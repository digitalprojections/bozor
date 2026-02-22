<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    /**
     * Display the marketplace with listings, categories, and user stats.
     */
    public function index(Request $request, \App\Services\ListingService $listingService): Response
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

        // Build listings query with filters
        $listingsQuery = Listing::with(['user', 'categories'])
            ->where('status', 'active');

        // Apply search filter
        if ($request->filled('search')) {
            $listingsQuery->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Apply category filter
        if ($request->filled('category')) {
            $listingsQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category);
            });
        }

        // Apply sorting
        $sort = $request->input('sort', 'newest');
        match ($sort) {
                'price_low' => $listingsQuery->orderBy('price', 'asc'),
                'price_high' => $listingsQuery->orderBy('price', 'desc'),
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
            'listings' => $listings,
            'recommendations' => $recommendations,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'sort' => $sort,
            ],
        ]);
    }
}
