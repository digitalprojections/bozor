<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\Transaction;
use App\Models\TransactionPackage;
use Illuminate\Support\Facades\DB;

class AuctionTransactionService
{
    public function ensureForListing(Listing $listing): ?Transaction
    {
        return DB::transaction(function () use ($listing) {
            $lockedListing = Listing::query()
                ->with('bids')
                ->lockForUpdate()
                ->findOrFail($listing->id);

            $existingTransaction = $lockedListing->transactions()
                ->where('status', '!=', Transaction::STATUS_CANCELLED)
                ->latest()
                ->first();

            if ($existingTransaction) {
                return $existingTransaction;
            }

            if (! $lockedListing->auctionCanSell()) {
                return null;
            }

            $winningBid = $lockedListing->bids()->orderBy('amount', 'desc')->first();

            if (! $winningBid) {
                return null;
            }

            $package = TransactionPackage::create([
                'buyer_id' => $winningBid->user_id,
                'seller_id' => $lockedListing->user_id,
                ...$this->shippingForListing($lockedListing),
            ]);

            $transaction = Transaction::create([
                'listing_id' => $lockedListing->id,
                'buyer_id' => $winningBid->user_id,
                'seller_id' => $lockedListing->user_id,
                'transaction_package_id' => $package->id,
                'amount' => $winningBid->amount,
                'status' => Transaction::STATUS_PENDING_PAYMENT,
                'purchase_type' => Transaction::TYPE_AUCTION,
            ]);

            $lockedListing->update(['status' => 'sold']);

            return $transaction;
        });
    }

    private function shippingForListing(Listing $listing): array
    {
        if ($listing->shipping_cost_type === 'chakubarai') {
            return [
                'shipping_cost_type' => 'chakubarai',
                'shipping_cost' => null,
            ];
        }

        if ($listing->shipping_cost_type === 'fixed') {
            return [
                'shipping_cost_type' => 'fixed',
                'shipping_cost' => (int) ($listing->shipping_cost ?? 0),
            ];
        }

        if ($listing->shipping_cost_type === 'location_based') {
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
}
