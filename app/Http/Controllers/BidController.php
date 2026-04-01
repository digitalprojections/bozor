<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BidController extends Controller
{
    public function store(Request $request, Listing $listing)
    {
        if (auth()->user()->is_guest) {
            return redirect()->route('login')->with('error', 'Please log in with your Google account to bid on items.');
        }

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

        $minBid = max($listing->price, $listing->current_high_bid) + 1;

        if ($validated['amount'] < $minBid) {
            return back()->withErrors(['amount' => "The bid must be at least ¥{$minBid}."]);
        }

        DB::transaction(function () use ($listing, $validated) {
            Bid::create([
                'user_id' => auth()->id(),
                'listing_id' => $listing->id,
                'amount' => $validated['amount'],
            ]);

            $listing->update([
                'current_high_bid' => $validated['amount'],
            ]);
        });

        // Notify watchers (except the bidder) about the new bid
        $listing->load('watchedBy');
        $bidderId = auth()->id();
        $listing->watchedBy->each(function (\App\Models\User $watcher) use ($listing, $validated, $bidderId) {
            if ($watcher->id !== $bidderId) {
                $watcher->notify(new \App\Notifications\WatchlistItemUpdated($listing, [
                    'new_bid' => ['amount' => $validated['amount']],
                ]));
            }
        });

        return back()->with('success', 'Bid placed successfully!');
    }
}
