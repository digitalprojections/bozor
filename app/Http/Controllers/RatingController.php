<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Transaction;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function store(Request $request, Transaction $transaction)
    {
        $user = auth()->user();

        // Ensure user is either buyer or seller
        if ($user->id !== $transaction->buyer_id && $user->id !== $transaction->seller_id) {
            abort(403);
        }

        $validated = $request->validate([
            'score' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $ratedUserId = ($user->id === $transaction->buyer_id) ? $transaction->seller_id : $transaction->buyer_id;

        // Prevent self-rating just in case buyer and seller are the same (shouldn't happen)
        if ($user->id === $ratedUserId) {
            abort(403, 'You cannot rate yourself.');
        }

        // Create or update existing rating for this transaction/rater/rated combination
        Rating::updateOrCreate(
        [
            'transaction_id' => $transaction->id,
            'rater_id' => $user->id,
            'rated_user_id' => $ratedUserId,
        ],
        [
            'score' => $validated['score'],
            'comment' => $validated['comment'],
        ]
        );

        return back()->with('success', 'Rating submitted successfully!');
    }
}
