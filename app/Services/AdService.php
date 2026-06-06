<?php

namespace App\Services;

use App\Models\AdCampaign;
use App\Models\Listing;
use Illuminate\Support\Facades\Schema;

class AdService
{
    /**
     * Load active ads for the shared layout slots.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function layoutAds(): array
    {
        if (Schema::hasTable('ad_campaigns')) {
            return $this->campaignAds();
        }

        if (! Schema::hasColumn('listings', 'listing_type')) {
            return [];
        }

        return $this->legacyListingAds();
    }

    private function campaignAds(): array
    {
        $ads = [];

        foreach (config('advertising.placements', []) as $placement => $settings) {
            $limit = (int) ($settings['limit'] ?? 1);
            $ads[$placement] = AdCampaign::query()
                ->displayable($placement)
                ->with('advertiserProfile:id,business_name')
                ->select([
                    'id',
                    'advertiser_profile_id',
                    'title',
                    'description',
                    'image_path',
                    'target_url',
                    'placement',
                    'priority',
                    'ends_at',
                ])
                ->orderByDesc('priority')
                ->inRandomOrder()
                ->take($limit)
                ->get()
                ->map(fn (AdCampaign $campaign) => [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'description' => str($campaign->description)->limit(120)->toString(),
                    'image_url' => $campaign->image_url,
                    'target_url' => $campaign->target_url,
                    'placement' => $campaign->placement,
                    'advertiser' => $campaign->advertiserProfile?->business_name,
                    'ends_at' => $campaign->ends_at?->toISOString(),
                ])
                ->all();
        }

        return $ads;
    }

    private function legacyListingAds(): array
    {
        $ads = [];

        foreach (config('advertising.placements', []) as $placement => $settings) {
            $limit = (int) ($settings['limit'] ?? 1);
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
