<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Models\Listing;
use App\Notifications\Seller\BidReceived;
use App\Notifications\Buyer\Outbid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BidController extends Controller
{
    public function store(Request $request, Listing $listing)
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1',
        ]);

        if ($listing->status !== 'active') {
            return back()->withErrors(['amount' => 'This listing is no longer active.']);
        }

        if (!$listing->is_auction) {
            return back()->withErrors(['amount' => 'This listing is not an auction.']);
        }

        if ($listing->user_id === auth()->id()) {
            return back()->withErrors(['amount' => 'You cannot bid on your own listing.']);
        }

        $newBid = null;
        $previousBid = null;
        $updatedListing = null;
        $bidderId = auth()->id();

        DB::transaction(function () use ($listing, $validated, &$newBid, &$previousBid, &$updatedListing, $bidderId) {
            $lockedListing = Listing::query()
                ->whereKey($listing->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedListing->status !== 'active') {
                throw ValidationException::withMessages([
                    'amount' => 'This listing is no longer active.',
                ]);
            }

            if (! $lockedListing->is_auction) {
                throw ValidationException::withMessages([
                    'amount' => 'This listing is not an auction.',
                ]);
            }

            if ($lockedListing->user_id === $bidderId) {
                throw ValidationException::withMessages([
                    'amount' => 'You cannot bid on your own listing.',
                ]);
            }

            $now = now();
            if (! $lockedListing->auction_end_date || $lockedListing->auction_end_date->lte($now)) {
                throw ValidationException::withMessages([
                    'amount' => 'This auction has ended.',
                ]);
            }

            $minBid = $lockedListing->minimumBidAmount();

            if ($validated['amount'] < $minBid) {
                throw ValidationException::withMessages([
                    'amount' => "The bid must be at least ¥{$minBid}.",
                ]);
            }

            $previousBid = $lockedListing->bids()->orderBy('amount', 'desc')->first();
            $auctionEndDate = $lockedListing->auction_end_date;
            $extendedEndDate = $now->copy()->addMinutes(5);

            $newBid = Bid::create([
                'user_id' => $bidderId,
                'listing_id' => $lockedListing->id,
                'amount' => $validated['amount'],
            ]);

            $lockedListing->update([
                'auction_end_date' => $auctionEndDate->lt($extendedEndDate) ? $extendedEndDate : $auctionEndDate,
            ]);

            $updatedListing = $lockedListing->fresh('user');
        });

        // Notify the seller
        $updatedListing->user->notify(new BidReceived($updatedListing, $newBid));

        // Notify the previous high bidder that they've been outbid
        if ($previousBid && $previousBid->user_id !== $bidderId) {
            $previousBid->user->notify(new Outbid($updatedListing, $newBid));
        }

        // Notify watchers (except the bidder) about the new bid
        $updatedListing->load('watchedBy');
        $updatedListing->watchedBy->each(function (\App\Models\User $watcher) use ($updatedListing, $validated, $bidderId) {
            if ($watcher->id !== $bidderId) {
                $watcher->notify(new \App\Notifications\WatchlistItemUpdated($updatedListing, [
                    'new_bid' => ['amount' => $validated['amount']],
                ]));
            }
        });

        return back()->with('success', 'Bid placed successfully!');
    }
}
