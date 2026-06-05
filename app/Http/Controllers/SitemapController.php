<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class SitemapController extends Controller
{
    /**
     * Generate a dynamic sitemap.xml
     */
    public function index(): Response
    {
        $locales = array_keys(config('locales.supported', ['en' => []]));
        $activeListingsQuery = Listing::items()->where('status', 'active');
        $listings = (clone $activeListingsQuery)->orderBy('updated_at', 'desc')->get();
        $categories = Category::query()
            ->whereHas('listings', fn ($query) => $query->where('status', 'active'))
            ->orderBy('name')
            ->get();
        $sellerIds = $listings->pluck('user_id')->unique()->values();
        $sellers = User::query()
            ->whereIn('id', $sellerIds)
            ->where('is_guest', false)
            ->orderBy('id')
            ->get();
        $prefectures = (clone $activeListingsQuery)
            ->whereNotNull('public_prefecture')
            ->where('public_prefecture', '!=', '')
            ->select('public_prefecture')
            ->selectRaw('max(updated_at) as latest_listing_updated_at')
            ->groupBy('public_prefecture')
            ->orderBy('public_prefecture')
            ->get();
        $cities = (clone $activeListingsQuery)
            ->whereNotNull('public_prefecture')
            ->where('public_prefecture', '!=', '')
            ->whereNotNull('public_city')
            ->where('public_city', '!=', '')
            ->select('public_prefecture', 'public_city')
            ->selectRaw('max(updated_at) as latest_listing_updated_at')
            ->groupBy('public_prefecture', 'public_city')
            ->orderBy('public_prefecture')
            ->orderBy('public_city')
            ->get();

        $urls = [];

        // Main pages for each locale
        foreach ($locales as $locale) {
            $urls[] = [
                'loc' => route('home', ['lang' => $locale]),
                'lastmod' => now()->startOfDay()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '1.0',
            ];
            $urls[] = [
                'loc' => route('marketplace', ['lang' => $locale]),
                'lastmod' => now()->startOfDay()->toAtomString(),
                'changefreq' => 'always',
                'priority' => '0.9',
            ];

            foreach ($categories as $category) {
                $urls[] = [
                    'loc' => route('marketplace', ['category' => $category->id, 'lang' => $locale]),
                    'lastmod' => now()->startOfDay()->toAtomString(),
                    'changefreq' => 'daily',
                    'priority' => '0.7',
                ];
            }

            foreach ($prefectures as $prefecture) {
                $urls[] = [
                    'loc' => route('marketplace', [
                        'prefecture' => $prefecture->public_prefecture,
                        'lang' => $locale,
                    ]),
                    'lastmod' => $this->lastmod($prefecture->latest_listing_updated_at),
                    'changefreq' => 'daily',
                    'priority' => '0.7',
                ];
            }

            foreach ($cities as $city) {
                $urls[] = [
                    'loc' => route('marketplace', [
                        'prefecture' => $city->public_prefecture,
                        'city' => $city->public_city,
                        'lang' => $locale,
                    ]),
                    'lastmod' => $this->lastmod($city->latest_listing_updated_at),
                    'changefreq' => 'daily',
                    'priority' => '0.6',
                ];
            }
        }

        // Listing pages
        foreach ($listings as $listing) {
            foreach ($locales as $locale) {
                $urls[] = [
                    'loc' => route('listings.show', ['listing' => $listing, 'lang' => $locale]),
                    'lastmod' => $listing->updated_at->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.8',
                ];
            }
        }

        // Public seller profile pages
        foreach ($sellers as $seller) {
            foreach ($locales as $locale) {
                $lastListingUpdatedAt = $listings
                    ->where('user_id', $seller->id)
                    ->max('updated_at');

                $urls[] = [
                    'loc' => route('profile.show', ['user' => $seller, 'lang' => $locale]),
                    'lastmod' => $this->lastmod($lastListingUpdatedAt ?? $seller->updated_at),
                    'changefreq' => 'weekly',
                    'priority' => '0.5',
                ];
            }
        }

        $xml = view('sitemap', compact('urls'))->render();

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }

    private function lastmod(CarbonInterface|string $value): string
    {
        return ($value instanceof CarbonInterface ? $value : Carbon::parse($value))->toAtomString();
    }
}
