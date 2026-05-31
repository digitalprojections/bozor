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
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->masked_name,
                'masked_name' => $user->masked_name,
                'avatar_url' => $user->avatar_url,
                'created_at' => $user->created_at,
                'average_rating' => $user->average_rating,
                'ratings_count' => $user->ratings_count,
                'received_ratings' => $user->receivedRatings->map(fn ($rating) => [
                    'id' => $rating->id,
                    'score' => $rating->score,
                    'comment' => $rating->comment,
                    'created_at' => $rating->created_at,
                    'rater' => [
                        'id' => $rating->rater->id,
                        'name' => $rating->rater->masked_name,
                        'masked_name' => $rating->rater->masked_name,
                        'avatar_url' => $rating->rater->avatar_url,
                    ],
                ]),
                'store_name' => $user->store_name,
                'store_description' => $user->store_description,
                'store_banner_url' => $user->store_banner_url,
            ],
            'activeListings' => $activeListings,
            'soldListings' => $soldListings,
        ]);
    }
}
