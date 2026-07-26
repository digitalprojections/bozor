<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Notifications\NewFollower;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProfileController extends Controller
{
    public function show(Request $request, User $user): Response
    {
        $user->load(['receivedRatings.rater']);
        $user->append(['average_rating', 'ratings_count']);
        $viewer = $request->user();
        $followers = $user->followers()
            ->orderByPivot('created_at', 'desc')
            ->get();
        $visibleFollowerIds = $this->fullNameVisibleUserIds($followers, $viewer);

        $activeListings = $user->listings()
            ->where('status', 'active')
            ->withCount('bids')
            ->withMax('bids', 'amount')
            ->latest()
            ->paginate(12, ['*'], 'active_page');

        $soldListings = $user->listings()
            ->where('status', 'sold')
            ->withCount('bids')
            ->withMax('bids', 'amount')
            ->latest()
            ->paginate(12, ['*'], 'sold_page');

        return Inertia::render('profile/show', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->masked_name,
                'masked_name' => $user->masked_name,
                'avatar_url' => $user->avatar_url,
                'avatar_source' => $user->avatar_source,
                'avatar_seed' => $user->avatar_seed,
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
                        'avatar_source' => $rating->rater->avatar_source,
                        'avatar_seed' => $rating->rater->avatar_seed,
                    ],
                ]),
                'store_name' => $user->store_name,
                'store_description' => $user->store_description,
                'store_banner_url' => $user->store_banner_url,
                'followers_count' => $user->followers()->count(),
                'is_following' => $viewer
                    ? $viewer->following()->where('followed_id', $user->id)->exists()
                    : false,
                'can_follow' => $viewer && ! $viewer->is_guest && $viewer->id !== $user->id,
                'followers' => $followers
                    ->map(fn (User $follower) => [
                        'id' => $follower->id,
                        'name' => $visibleFollowerIds->contains($follower->id)
                            ? $follower->name
                            : $follower->masked_name,
                        'masked_name' => $follower->masked_name,
                        'avatar_url' => $follower->avatar_url,
                        'avatar_source' => $follower->avatar_source,
                        'avatar_seed' => $follower->avatar_seed,
                        'created_at' => $follower->pivot->created_at,
                    ]),
            ],
            'activeListings' => $activeListings,
            'soldListings' => $soldListings,
        ]);
    }

    public function follow(Request $request, User $user): RedirectResponse
    {
        $follower = $request->user();

        abort_if(! $follower || $follower->is_guest, 403);
        abort_if($follower->id === $user->id, 422, 'You cannot follow yourself.');

        $alreadyFollowing = $follower->following()
            ->where('followed_id', $user->id)
            ->exists();

        if (! $alreadyFollowing) {
            $follower->following()->attach($user->id);
            $this->notifySafely($user, new NewFollower($follower));
        }

        return back()->with('success', 'You are now following this user.');
    }

    public function unfollow(Request $request, User $user): RedirectResponse
    {
        $request->user()->following()->detach($user->id);

        return back()->with('success', 'You are no longer following this user.');
    }

    private function fullNameVisibleUserIds($users, ?User $viewer)
    {
        if (! $viewer) {
            return collect();
        }

        $userIds = $users->pluck('id');

        if ($userIds->isEmpty()) {
            return collect();
        }

        $transactionUserIds = Transaction::query()
            ->where(function ($query) use ($viewer, $userIds) {
                $query->where('buyer_id', $viewer->id)
                    ->whereIn('seller_id', $userIds);
            })
            ->orWhere(function ($query) use ($viewer, $userIds) {
                $query->where('seller_id', $viewer->id)
                    ->whereIn('buyer_id', $userIds);
            })
            ->get(['buyer_id', 'seller_id'])
            ->flatMap(fn (Transaction $transaction) => [
                $transaction->buyer_id,
                $transaction->seller_id,
            ])
            ->unique()
            ->values();

        return $transactionUserIds
            ->push($viewer->id)
            ->intersect($userIds)
            ->values();
    }

    private function notifySafely($notifiable, $notification): void
    {
        try {
            $notifiable->notify($notification);
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}
