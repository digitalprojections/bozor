<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Notifications\Seller\NewWatcher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WatchlistController extends Controller
{
    /**
     * Display the user's watchlist.
     */
    public function index(Request $request)
    {
        $listings = $request->user()->watchedListings()
            ->with(['categories', 'user'])
            ->latest('watchlists.created_at')
            ->get();

        return Inertia::render('watchlist', [
            'listings' => $listings
        ]);
    }

    /**
     * Toggle the watchlist status for a listing.
     */
    public function toggle(Request $request, Listing $listing)
    {
        $user = $request->user();

        if ($user->watchedListings()->where('listing_id', $listing->id)->exists()) {
            $user->watchedListings()->detach($listing->id);
            $message = 'Removed from watchlist';
            $status = 'removed';
        }
        else {
            $user->watchedListings()->attach($listing->id);
            $message = 'Added to watchlist';
            $status = 'added';

            // Notify the seller
            if ($listing->user_id !== $user->id) {
                $listing->user->notify(new NewWatcher($listing, $user));
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => $message,
                'status' => $status,
                'is_watched' => $status === 'added'
            ]);
        }

        return back()->with('success', $message);
    }
}
