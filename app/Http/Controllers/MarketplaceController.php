<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use App\Services\ListingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    /**
     * Display the marketplace with listings, categories, and user stats.
     */
    public function index(Request $request, ListingService $listingService): Response
    {
        $user = $request->user();

        // Get user stats only for authenticated users
        $stats = null;
        if ($user) {
            $stats = [
                'active_listings' => $user->listings()->where('status', 'active')->count(),
                'sold_items' => $user->soldListings()->count(),
                'total_earnings' => $user->soldListings()->sum('price'),
                'cart_items' => 0, // TODO: implement cart functionality
            ];
        }

        // Get categories with listing counts
        $categories = Category::withCount('listings')->get();
        $locationOptions = $this->locationOptions($request);

        // Build listings query with filters
        $listingsQuery = Listing::with(['user', 'categories', 'latestTransaction'])
            ->withCount('bids')
            ->withMax('bids', 'amount')
            ->items()
            ->where('status', '!=', 'disabled')
            ->where('status', '!=', 'draft');

        // Optionally hide sold listings while still allowing the default view to show all.
        if ($request->boolean('hide_sold')) {
            $listingsQuery->where('status', '!=', 'sold');
        }

        if ($request->boolean('free_shipping')) {
            $listingsQuery->freeShipping();
        }

        // Apply search filter
        if ($request->filled('search')) {
            $listingsQuery->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%")
                    ->orWhere('location', 'like', "%{$request->search}%")
                    ->orWhere('public_prefecture', 'like', "%{$request->search}%")
                    ->orWhere('public_city', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('prefecture')) {
            $listingsQuery->where('public_prefecture', $request->string('prefecture')->toString());
        }

        if ($request->filled('city')) {
            $listingsQuery->where('public_city', $request->string('city')->toString());
        }

        // Apply category filter
        if ($request->filled('category')) {
            $listingsQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category);
            });
        }

        // Apply sorting
        $sort = $request->input('sort', 'newest');
        $highestBidSql = '(select max(amount) from bids where bids.listing_id = listings.id)';
        $transactionAmountSql = "(select amount from transactions where transactions.listing_id = listings.id and transactions.status != 'cancelled' order by transactions.created_at desc limit 1)";
        $auctionPriceSql = 'case when coalesce('.$highestBidSql.', 0) > price then coalesce('.$highestBidSql.', 0) else price end';
        $displayPriceSql = "case when status = 'sold' and ".$transactionAmountSql.' is not null then '.$transactionAmountSql.' else '.$auctionPriceSql.' end';
        match ($sort) {
            'price_low' => $listingsQuery->orderByRaw($displayPriceSql.' asc'),
            'price_high' => $listingsQuery->orderByRaw($displayPriceSql.' desc'),
            'oldest' => $listingsQuery->orderBy('created_at', 'asc'),
            default => $listingsQuery->latest(),
        };

        // Paginate results
        $listings = $listingsQuery->paginate(24)->withQueryString();

        // Get recommendations
        $recommendations = $listingService->getRecommendations($user, null, 15);

        return Inertia::render('marketplace/index', [
            'stats' => $stats,
            'categories' => $categories,
            'locationOptions' => $locationOptions,
            'listings' => $listings,
            'recommendations' => $recommendations,
            'watched_ids' => $user ? $user->watchedListings()->pluck('listing_id')->toArray() : [],
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'sort' => $sort,
                'hide_sold' => $request->boolean('hide_sold'),
                'free_shipping' => $request->boolean('free_shipping'),
                'prefecture' => $request->input('prefecture'),
                'city' => $request->input('city'),
            ],
            'seo' => [
                'title' => __('Marketplace').' | '.config('app.name'),
                'description' => __('Browse and buy products from individuals and small businesses across Japan. Free registration and zero sales fees!'),
            ],
        ]);
    }

    /**
     * @return array{prefectures: array<int, string>, cities: array<int, string>}
     */
    private function locationOptions(Request $request): array
    {
        $baseQuery = Listing::query()
            ->items()
            ->where('status', '!=', 'disabled')
            ->where('status', '!=', 'draft');

        $prefectures = (clone $baseQuery)
            ->whereNotNull('public_prefecture')
            ->where('public_prefecture', '!=', '')
            ->distinct()
            ->orderBy('public_prefecture')
            ->pluck('public_prefecture')
            ->values()
            ->all();

        $cityQuery = (clone $baseQuery)
            ->whereNotNull('public_city')
            ->where('public_city', '!=', '');

        if ($request->filled('prefecture')) {
            $cityQuery->where('public_prefecture', $request->string('prefecture')->toString());
        }

        $cities = $cityQuery
            ->distinct()
            ->orderBy('public_city')
            ->pluck('public_city')
            ->values()
            ->all();

        return [
            'prefectures' => $prefectures,
            'cities' => $cities,
        ];
    }
}
