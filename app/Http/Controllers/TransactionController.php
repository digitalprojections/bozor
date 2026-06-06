<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\ListingMessage;
use App\Models\Transaction;
use App\Models\TransactionPackage;
use App\Notifications\Seller\ListingSold;
use App\Notifications\MessageReceived;
use App\Notifications\TransactionUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

class TransactionController extends Controller
{
    public function buyNow(Request $request, Listing $listing)
    {
        if ($listing->user_id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot buy your own listing.']);
        }

        $transaction = null;
        DB::transaction(function () use ($listing, &$transaction) {
            $listing = Listing::query()->lockForUpdate()->findOrFail($listing->id);
            $purchasePrice = $listing->buy_now_price ?? ($listing->is_auction ? null : $listing->price);

            if ($listing->status !== 'active') {
                abort(409, 'This listing is no longer active.');
            }

            if ($purchasePrice === null) {
                abort(422, 'This listing does not have a Buy Now price.');
            }

            $package = $this->createPackageForListing($listing, auth()->id());

            $transaction = Transaction::create([
                'listing_id' => $listing->id,
                'buyer_id' => auth()->id(),
                'seller_id' => $listing->user_id,
                'transaction_package_id' => $package->id,
                'amount' => $purchasePrice,
                'status' => Transaction::STATUS_PENDING_PAYMENT,
                'purchase_type' => Transaction::TYPE_BUY_NOW,
            ]);

            $listing->update(['status' => 'sold']);

            $this->attachBuyerMessagesToTransaction($transaction);
        });

        $this->notifySafely($listing->user, new ListingSold($listing, $transaction));

        return redirect()->route('transactions.show', $transaction)->with('success', 'Purchase completed successfully!');
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['listing', 'seller', 'buyer', 'ratings.rater', 'package.transactions.listing', 'messages.questioner', 'messages.seller']);
        $canSeeFullNames = auth()->check() && in_array(auth()->id(), [$transaction->buyer_id, $transaction->seller_id], true);
        $this->markMessageNotificationsRead($transaction);

        return inertia('transactions/show', [
            'transaction' => [
                'id' => $transaction->id,
                'listing_id' => $transaction->listing_id,
                'buyer_id' => $transaction->buyer_id,
                'seller_id' => $transaction->seller_id,
                'amount' => $transaction->amount,
                'status' => $transaction->status,
                'purchase_type' => $transaction->purchase_type ?? Transaction::TYPE_BUY_NOW,
                'tracking_number' => $transaction->tracking_number,
                'shipping_method' => $transaction->shipping_method,
                'package' => $this->transactionPackage($transaction),
                'paid_at' => $transaction->paid_at,
                'shipped_at' => $transaction->shipped_at,
                'delivered_at' => $transaction->delivered_at,
                'received_at' => $transaction->received_at,
                'completed_at' => $transaction->completed_at,
                'created_at' => $transaction->created_at,
                'listing' => [
                    'id' => $transaction->listing->id,
                    'title' => $transaction->listing->title,
                    'images' => $transaction->listing->images,
                ],
                'seller' => $this->transactionUser($transaction->seller, $canSeeFullNames),
                'buyer' => $this->transactionUser($transaction->buyer, $canSeeFullNames),
                'ratings' => $transaction->ratings->map(fn ($rating) => [
                    'id' => $rating->id,
                    'transaction_id' => $rating->transaction_id,
                    'rater_id' => $rating->rater_id,
                    'rated_user_id' => $rating->rated_user_id,
                    'score' => $rating->score,
                    'comment' => $rating->comment,
                    'created_at' => $rating->created_at,
                    'rater' => $this->transactionUser($rating->rater, $canSeeFullNames),
                ]),
                'messages' => $canSeeFullNames
                    ? $transaction->messages->sortBy('created_at')->map(fn (ListingMessage $message) => $this->messagePayload($message))->values()
                    : [],
            ],
        ]);
    }

    public function markAsPaid(Transaction $transaction)
    {
        if (auth()->id() !== $transaction->buyer_id) {
            abort(403);
        }

        if ($transaction->status !== Transaction::STATUS_PENDING_PAYMENT) {
            return back()->withErrors(['error' => 'This transaction is not in a pending payment state.']);
        }

        $transaction->update([
            'status' => Transaction::STATUS_PAID,
            'paid_at' => now(),
        ]);

        $this->notifySafely($transaction->seller, new TransactionUpdated($transaction, Transaction::STATUS_PAID, 'seller'));

        return back()->with('success', 'Payment confirmed successfully!');
    }

    public function cancel(Transaction $transaction)
    {
        // Only buyer or seller can cancel
        if (! in_array(auth()->id(), [$transaction->buyer_id, $transaction->seller_id])) {
            abort(403);
        }

        // Cannot cancel if already shipped or received
        if (in_array($transaction->status, [Transaction::STATUS_SHIPPED, Transaction::STATUS_DELIVERED, Transaction::STATUS_RECEIVED])) {
            return back()->withErrors(['error' => 'This transaction cannot be cancelled at this stage.']);
        }

        if ($transaction->status === Transaction::STATUS_CANCELLED) {
            return back()->withErrors(['error' => 'This transaction is already cancelled.']);
        }

        DB::transaction(function () use ($transaction) {
            $transaction->update([
                'status' => Transaction::STATUS_CANCELLED,
            ]);

            // Revert listing to active
            $transaction->listing->update([
                'status' => 'active',
            ]);
        });

        // Notify the other party
        $isCancelledByBuyer = auth()->id() === $transaction->buyer_id;
        $recipient = $isCancelledByBuyer ? $transaction->seller : $transaction->buyer;
        $recipientRole = $isCancelledByBuyer ? 'seller' : 'buyer';

        $this->notifySafely($recipient, new TransactionUpdated($transaction, Transaction::STATUS_CANCELLED, $recipientRole));

        return back()->with('success', 'Transaction cancelled successfully.');
    }

    public function markAsShipped(Request $request, Transaction $transaction)
    {
        if (auth()->id() !== $transaction->seller_id) {
            abort(403);
        }

        $validated = $request->validate([
            'shipping_method' => 'required|string|max:255',
            'tracking_number' => 'nullable|string|max:255',
        ]);

        $package = $this->ensurePackage($transaction);
        $package->load('transactions');

        if ($package->transactions->contains(fn ($item) => $item->status !== Transaction::STATUS_PAID)) {
            return back()->withErrors(['error' => 'Every transaction in this package must be paid before shipping.']);
        }

        DB::transaction(function () use ($package, $validated) {
            $package->update([
                'shipping_method' => $validated['shipping_method'],
                'tracking_number' => $validated['tracking_number'],
                'shipped_at' => now(),
            ]);

            $package->transactions()->update([
                'status' => Transaction::STATUS_SHIPPED,
                'shipping_method' => $validated['shipping_method'],
                'tracking_number' => $validated['tracking_number'],
                'shipped_at' => now(),
            ]);
        });

        $this->notifySafely($transaction->buyer, new TransactionUpdated($transaction, Transaction::STATUS_SHIPPED, 'buyer'));

        return back()->with('success', 'Package marked as shipped!');
    }

    public function markAsReceived(Transaction $transaction)
    {
        if (auth()->id() !== $transaction->buyer_id) {
            abort(403);
        }

        $package = $this->ensurePackage($transaction);
        $package->load('transactions');

        if ($package->transactions->contains(fn ($item) => $item->status !== Transaction::STATUS_SHIPPED)) {
            return back()->withErrors(['error' => 'Package has not been shipped yet.']);
        }

        DB::transaction(function () use ($package) {
            $package->update([
                'received_at' => now(),
            ]);

            $package->transactions()->update([
                'status' => Transaction::STATUS_RECEIVED,
                'received_at' => now(),
                'completed_at' => now(),
            ]);
        });

        $this->notifySafely($transaction->seller, new TransactionUpdated($transaction, Transaction::STATUS_RECEIVED, 'seller'));

        return back()->with('success', 'Package received! Transactions completed.');
    }

    public function consolidatePackages(Request $request)
    {
        $validated = $request->validate([
            'transaction_ids' => ['required', 'array', 'min:1'],
            'transaction_ids.*' => ['integer', 'distinct', 'exists:transactions,id'],
            'mode' => ['required', 'in:combine,separate'],
        ]);

        $result = DB::transaction(function () use ($validated) {
            $transactions = Transaction::query()
                ->with(['listing', 'package'])
                ->whereIn('id', $validated['transaction_ids'])
                ->lockForUpdate()
                ->get();

            if ($transactions->count() !== count($validated['transaction_ids'])) {
                return back()->withErrors(['transaction_ids' => 'Some transactions could not be found.']);
            }

            $userId = auth()->id();
            if ($transactions->contains(fn ($transaction) => ! in_array($userId, [$transaction->buyer_id, $transaction->seller_id], true))) {
                abort(403);
            }

            if ($transactions->contains(fn ($transaction) => in_array($transaction->status, [
                Transaction::STATUS_SHIPPED,
                Transaction::STATUS_DELIVERED,
                Transaction::STATUS_RECEIVED,
                Transaction::STATUS_CANCELLED,
            ], true))) {
                return back()->withErrors(['transaction_ids' => 'Only unshipped active transactions can be regrouped.']);
            }

            if ($transactions->pluck('buyer_id')->unique()->count() !== 1 || $transactions->pluck('seller_id')->unique()->count() !== 1) {
                return back()->withErrors(['transaction_ids' => 'Packages can only combine transactions between the same buyer and seller.']);
            }

            if ($validated['mode'] === 'separate') {
                $transactions->each(function (Transaction $transaction) {
                    $package = $this->createPackageForListing($transaction->listing, $transaction->buyer_id);
                    $transaction->update(['transaction_package_id' => $package->id]);
                });

                return;
            }

            $package = TransactionPackage::create([
                'buyer_id' => $transactions->first()->buyer_id,
                'seller_id' => $transactions->first()->seller_id,
                ...$this->shippingForPackage($transactions),
            ]);

            Transaction::query()
                ->whereIn('id', $transactions->pluck('id'))
                ->update(['transaction_package_id' => $package->id]);
        });

        if ($result) {
            return $result;
        }

        return back()->with('success', $validated['mode'] === 'combine'
            ? 'Selected items were combined into one package.'
            : 'Selected items were separated into individual packages.');
    }

    private function notifySafely($notifiable, $notification): void
    {
        try {
            $notifiable->notify($notification);
        } catch (Throwable $exception) {
            report($exception);
        }
    }

    private function attachBuyerMessagesToTransaction(Transaction $transaction): void
    {
        ListingMessage::query()
            ->where('listing_id', $transaction->listing_id)
            ->where('questioner_id', $transaction->buyer_id)
            ->where('seller_id', $transaction->seller_id)
            ->whereNull('transaction_id')
            ->update(['transaction_id' => $transaction->id]);
    }

    private function transactionUser($user, bool $canSeeFullName): array
    {
        return [
            'id' => $user->id,
            'name' => $canSeeFullName ? $user->name : $user->masked_name,
            'masked_name' => $user->masked_name,
            'avatar_url' => $user->avatar_url,
            'contact' => $canSeeFullName ? $this->transactionUserContact($user) : null,
        ];
    }

    private function transactionUserContact($user): array
    {
        $nameParts = preg_split('/\s+/', trim($user->name), 2) ?: [];

        return [
            'full_name' => $user->name,
            'first_name' => $nameParts[0] ?? $user->name,
            'family_name' => $nameParts[1] ?? '',
            'postal_code' => $user->postal_code,
            'prefecture' => $user->prefecture,
            'city' => $user->city,
            'address_line1' => $user->address_line1,
            'address_line2' => $user->address_line2,
            'phone' => $user->phone,
        ];
    }

    private function messagePayload(ListingMessage $message): array
    {
        return [
            'id' => $message->id,
            'listing_id' => $message->listing_id,
            'transaction_id' => $message->transaction_id,
            'question' => $message->question,
            'answer' => $message->answer,
            'answered_at' => $message->answered_at,
            'created_at' => $message->created_at,
            'questioner' => $this->transactionUser($message->questioner, true),
            'seller' => $this->transactionUser($message->seller, true),
        ];
    }

    private function markMessageNotificationsRead(Transaction $transaction): void
    {
        $user = auth()->user();

        if (! $user || ! in_array($user->id, [$transaction->buyer_id, $transaction->seller_id], true)) {
            return;
        }

        $user->unreadNotifications
            ->filter(function ($notification) use ($transaction) {
                if ($notification->type !== MessageReceived::class) {
                    return false;
                }

                return (int) ($notification->data['transaction_id'] ?? 0) === (int) $transaction->id;
            })
            ->each->markAsRead();
    }

    private function createPackageForListing(Listing $listing, int $buyerId): TransactionPackage
    {
        return TransactionPackage::create([
            'buyer_id' => $buyerId,
            'seller_id' => $listing->user_id,
            ...$this->shippingForPackage(collect([(object) ['listing' => $listing]])),
        ]);
    }

    private function ensurePackage(Transaction $transaction): TransactionPackage
    {
        if ($transaction->package) {
            return $transaction->package;
        }

        $transaction->loadMissing('listing');
        $package = $this->createPackageForListing($transaction->listing, $transaction->buyer_id);
        $transaction->update(['transaction_package_id' => $package->id]);

        return $package;
    }

    private function shippingForPackage(Collection $transactions): array
    {
        $listings = $transactions->map(fn ($transaction) => $transaction->listing)->filter();

        if ($listings->contains(fn (Listing $listing) => $listing->shipping_cost_type === 'chakubarai')) {
            return [
                'shipping_cost_type' => 'chakubarai',
                'shipping_cost' => null,
            ];
        }

        $fixedCosts = $listings
            ->filter(fn (Listing $listing) => $listing->shipping_cost_type === 'fixed')
            ->map(fn (Listing $listing) => (int) ($listing->shipping_cost ?? 0));

        if ($fixedCosts->isNotEmpty()) {
            return [
                'shipping_cost_type' => 'fixed',
                'shipping_cost' => $fixedCosts->max(),
            ];
        }

        if ($listings->contains(fn (Listing $listing) => $listing->shipping_cost_type === 'location_based')) {
            return [
                'shipping_cost_type' => 'location_based',
                'shipping_cost' => null,
            ];
        }

        return [
            'shipping_cost_type' => 'free',
            'shipping_cost' => 0,
        ];
    }

    private function transactionPackage(Transaction $transaction): ?array
    {
        if (! $transaction->package) {
            return null;
        }

        return [
            'id' => $transaction->package->id,
            'shipping_cost_type' => $transaction->package->shipping_cost_type,
            'shipping_cost' => $transaction->package->shipping_cost,
            'shipping_method' => $transaction->package->shipping_method,
            'tracking_number' => $transaction->package->tracking_number,
            'items' => $transaction->package->transactions->map(fn (Transaction $item) => [
                'id' => $item->id,
                'amount' => $item->amount,
                'status' => $item->status,
                'listing' => [
                    'id' => $item->listing->id,
                    'title' => $item->listing->title,
                    'main_image_url' => $item->listing->main_image_url,
                ],
            ])->values(),
        ];
    }
}
