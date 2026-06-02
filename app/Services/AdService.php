<?php

namespace App\Services;

use App\Models\Listing;
use Illuminate\Support\Facades\Schema;

class AdService
{
    private const PLACEMENTS = [
        'top_banner' => 2,
        'sidebar' => 3,
        'right_rail' => 3,
        'footer' => 2,
    ];

    /**
     * Load active ads for the shared layout slots.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function layoutAds(): array
    {
        if (! Schema::hasColumn('listings', 'listing_type')) {
            return [];
        }

        $ads = [];

        foreach (self::PLACEMENTS as $placement => $limit) {
            $ads[$placement] = Listing::query()
                ->activeAdvertisements($placement)
                ->with('user:id,name,store_name')
                ->select([
                    'id',
                    'user_id',
                    'title',
                    'description',
                    'price',
                    'status',
                    'images',
                    'ad_placement',
                    'ad_target_url',
                    'ad_priority',
                    'ad_ends_at',
                ])
                ->orderByDesc('ad_priority')
                ->inRandomOrder()
                ->take($limit)
                ->get()
                ->map(fn (Listing $listing) => [
                    'id' => $listing->id,
                    'title' => $listing->title,
                    'description' => str($listing->description)->limit(120)->toString(),
                    'image_url' => $listing->main_image_url,
                    'target_url' => $listing->ad_target_url ?: route('listings.show', $listing),
                    'placement' => $listing->ad_placement,
                    'advertiser' => $listing->user?->store_name ?: $listing->user?->name,
                    'ends_at' => $listing->ad_ends_at?->toISOString(),
                ])
                ->all();
        }

        return $ads;
    }
}
