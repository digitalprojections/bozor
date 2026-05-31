<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Transaction;
use App\Notifications\Seller\ListingSold;
use App\Notifications\TransactionUpdated;
use Illuminate\Http\Request;
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

            $transaction = Transaction::create([
                'listing_id' => $listing->id,
                'buyer_id' => auth()->id(),
                'seller_id' => $listing->user_id,
                'amount' => $purchasePrice,
                'status' => Transaction::STATUS_PENDING_PAYMENT,
            ]);

            $listing->update(['status' => 'sold']);
        });

        $this->notifySafely($listing->user, new ListingSold($listing, $transaction));

        return redirect()->route('transactions.show', $transaction)->with('success', 'Purchase completed successfully!');
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['listing', 'seller', 'buyer', 'ratings.rater']);
        $canSeeFullNames = auth()->check() && in_array(auth()->id(), [$transaction->buyer_id, $transaction->seller_id], true);

        return inertia('transactions/show', [
            'transaction' => [
                'id' => $transaction->id,
                'listing_id' => $transaction->listing_id,
                'buyer_id' => $transaction->buyer_id,
                'seller_id' => $transaction->seller_id,
                'amount' => $transaction->amount,
                'status' => $transaction->status,
                'tracking_number' => $transaction->tracking_number,
                'shipping_method' => $transaction->shipping_method,
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

        if ($transaction->status !== Transaction::STATUS_PAID) {
            return back()->withErrors(['error' => 'Transaction must be paid before shipping.']);
        }

        $transaction->update([
            'status' => Transaction::STATUS_SHIPPED,
            'shipping_method' => $validated['shipping_method'],
            'tracking_number' => $validated['tracking_number'],
            'shipped_at' => now(),
        ]);

        $this->notifySafely($transaction->buyer, new TransactionUpdated($transaction, Transaction::STATUS_SHIPPED, 'buyer'));

        return back()->with('success', 'Item marked as shipped!');
    }

    public function markAsReceived(Transaction $transaction)
    {
        if (auth()->id() !== $transaction->buyer_id) {
            abort(403);
        }

        if ($transaction->status !== Transaction::STATUS_SHIPPED) {
            return back()->withErrors(['error' => 'Item has not been shipped yet.']);
        }

        $transaction->update([
            'status' => Transaction::STATUS_RECEIVED,
            'received_at' => now(),
            'completed_at' => now(),
        ]);

        $this->notifySafely($transaction->seller, new TransactionUpdated($transaction, Transaction::STATUS_RECEIVED, 'seller'));

        return back()->with('success', 'Item received! Transaction completed.');
    }

    private function notifySafely($notifiable, $notification): void
    {
        try {
            $notifiable->notify($notification);
        } catch (Throwable $exception) {
            report($exception);
        }
    }

    private function transactionUser($user, bool $canSeeFullName): array
    {
        return [
            'id' => $user->id,
            'name' => $canSeeFullName ? $user->name : $user->masked_name,
            'masked_name' => $user->masked_name,
            'avatar_url' => $user->avatar_url,
        ];
    }
}
