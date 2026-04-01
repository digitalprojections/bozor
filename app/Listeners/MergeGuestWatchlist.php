<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class MergeGuestWatchlist
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;
        $guestId = request()->cookie('guest_id');

        if ($guestId && !$user->is_guest) {
            $guest = \App\Models\User::where('guest_id', $guestId)->where('is_guest', true)->first();

            if ($guest) {
                // Get all listing IDs in the guest's watchlist
                $guestWatchlistIds = \Illuminate\Support\Facades\DB::table('watchlists')
                    ->where('user_id', $guest->id)
                    ->pluck('listing_id');

                foreach ($guestWatchlistIds as $listingId) {
                    // Check if the authenticated user already has this listing in their watchlist
                    $exists = \Illuminate\Support\Facades\DB::table('watchlists')
                        ->where('user_id', $user->id)
                        ->where('listing_id', $listingId)
                        ->exists();

                    if (!$exists) {
                        \Illuminate\Support\Facades\DB::table('watchlists')->insert([
                            'user_id' => $user->id,
                            'listing_id' => $listingId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }

                // Delete the guest user after merging
                $guest->delete();
            }
        }
    }
}
