<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(User $user): Response
    {
        $user->load(['receivedRatings.rater', 'listings' => function ($query) {
            $query->whereNotIn('status', ['draft', 'inactive'])->latest();
        }]);

        $user->append(['average_rating', 'ratings_count']);

        return Inertia::render('profile/show', [
            'profileUser' => $user,
        ]);
    }
}
