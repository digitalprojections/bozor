<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(User $user): Response
    {
        $user->load(['receivedRatings.rater']);
        $user->append(['average_rating', 'ratings_count']);

        $activeListings = $user->listings()
            ->where('status', 'active')
            ->latest()
            ->paginate(12, ['*'], 'active_page');

        $soldListings = $user->listings()
            ->where('status', 'sold')
            ->latest()
            ->paginate(12, ['*'], 'sold_page');

        return Inertia::render('profile/show', [
            'profileUser' => $user,
            'activeListings' => $activeListings,
            'soldListings' => $soldListings,
        ]);
    }
}
