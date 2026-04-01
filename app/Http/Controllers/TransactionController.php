<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function buyNow(Request $request, Listing $listing)
    {
        if ($listing->status !== 'active') {
            return back()->withErrors(['error' => 'This listing is no longer active.']);
        }

        if ($listing->buy_now_price === null) {
            return back()->withErrors(['error' => 'This listing does not have a "Buy Now" price.']);
        }

        if ($listing->user_id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot buy your own listing.']);
        }

        // Potential balance check logic here if a wallet system exists

        DB::transaction(function () use ($listing) {
            $transaction = Transaction::create([
                'listing_id' => $listing->id,
                'buyer_id' => auth()->id(),
                'seller_id' => $listing->user_id,
                'amount' => $listing->buy_now_price,
                'status' => Transaction::STATUS_PENDING_PAYMENT,
            ]);

            $listing->update(['status' => 'sold']);
        });

        return redirect()->route('dashboard')->with('success', 'Purchase completed successfully!');
    }
    public function show(Transaction $transaction)
    {
        $transaction->load(['listing', 'seller', 'buyer', 'ratings.rater']);

        return inertia('transactions/show', [
            'transaction' => $transaction,
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

        return back()->with('success', 'Payment confirmed successfully!');
    }

    public function cancel(Transaction $transaction)
    {
        // Only buyer or seller can cancel
        if (!in_array(auth()->id(), [$transaction->buyer_id, $transaction->seller_id])) {
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

        return back()->with('success', 'Item received! Transaction completed.');
    }
}
