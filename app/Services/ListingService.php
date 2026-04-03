<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ListingService
{
    /**
     * Get recommended listings based on popularity and recency.
     *
     * @param User|null $currentUser
     * @param int|null $excludeListingId
     * @param int $limit
     * @return Collection
     */
    public function getRecommendations(?User $currentUser = null, ?int $excludeListingId = null, int $limit = 10): Collection
    {
        $query = Listing::with(['user', 'categories'])
            ->where('status', 'active');

        // Exclude current user's listings if authenticated (removed per user request to show all marketplace items)

        // Exclude specific listing (e.g., when viewing a listing page)
        if ($excludeListingId) {
            $query->where('id', '!=', $excludeListingId);
        }

        return $query->orderBy('views', 'desc')
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }
}
