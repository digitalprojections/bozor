<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class DashboardController extends Controller
{
    public function index(Request $request, \App\Services\ListingService $listingService)
    {
        $user = $request->user();

        // Get dashboard stats
        $stats = [
            'total_listings' => $user->listings()->count(),
            'active_listings' => $user->listings()->where('status', 'active')->count(),
            'total_sales' => $user->soldListings()->count(),
            'pending_transactions' => Transaction::where('seller_id', $user->id)
            ->where('status', 'pending')
            ->count(),
            'total_views' => $user->listings()->sum('views'),
            'total_revenue' => Transaction::where('seller_id', $user->id)
            ->where('status', 'completed')
            ->sum('amount'),
        ];

        // Get user's listings with categories
        $listings = $user->listings()
            ->with('categories')
            ->latest()
            ->get();

        // Get recent transactions
        $transactions = Transaction::where('seller_id', $user->id)
            ->orWhere('buyer_id', $user->id)
            ->with(['listing', 'buyer', 'seller'])
            ->latest()
            ->take(10)
            ->get();

        // Get recommendations
        $recommendations = $listingService->getRecommendations($user);

        return inertia('dashboard', [
            'stats' => $stats,
            'listings' => $listings,
            'transactions' => $transactions,
            'recommendations' => $recommendations,
            'verificationRequest' => $user->latestVerificationRequest,
            'isVerified' => $user->isVerified(),
        ]);
    }

    public function wonItems(Request $request)
    {
        $user = $request->user();

        // 1. Get items won via "Buy Now" (Transactions)
        $purchasedItems = Transaction::where('buyer_id', $user->id)
            ->with(['listing.categories', 'seller'])
            ->latest()
            ->get()
            ->map(function ($transaction) {
            return [
            'id' => $transaction->listing->id,
            'transaction_id' => $transaction->id,
            'title' => $transaction->listing->title,
            'price' => $transaction->amount,
            'seller' => $transaction->seller,
            'images' => $transaction->listing->images,
            'won_at' => $transaction->created_at,
            'status' => $transaction->status,
            'type' => 'purchase',
            ];
        });

        // 2. Get items won via Auction
        // An auction is won if it's ended and the user has the highest bid
        $wonAuctions = \App\Models\Listing::where('is_auction', true)
            ->where('auction_end_date', '<', now())
            ->whereHas('bids', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['bids', 'user', 'transactions' => function ($query) use ($user) {
            $query->where('buyer_id', $user->id);
        }])
            ->get()
            ->filter(function ($listing) use ($user) {
            $highestBid = $listing->bids->first();
            return $highestBid && $highestBid->user_id === $user->id;
        })
            ->map(function ($listing) {
            $transaction = $listing->transactions->first();
            return [
            'id' => $listing->id,
            'transaction_id' => $transaction ? $transaction->id : null,
            'title' => $listing->title,
            'price' => $listing->current_high_bid,
            'seller' => $listing->user,
            'images' => $listing->images,
            'won_at' => $listing->auction_end_date,
            'status' => $transaction ? $transaction->status : Transaction::STATUS_PENDING_PAYMENT,
            'type' => 'auction',
            ];
        });

        // Merge and sort by date
        $allWonItems = $purchasedItems->concat($wonAuctions)
            ->sortByDesc('won_at')
            ->values();

        return inertia('dashboard/won-items', [
            'items' => $allWonItems,
        ]);
    }

    public function soldItems(Request $request)
    {
        $user = $request->user();

        $soldItems = Transaction::where('seller_id', $user->id)
            ->with(['listing.categories', 'buyer'])
            ->latest()
            ->get()
            ->map(function ($transaction) {
            return [
            'id' => $transaction->listing->id,
            'transaction_id' => $transaction->id,
            'title' => $transaction->listing->title,
            'price' => $transaction->amount,
            'buyer' => $transaction->buyer,
            'images' => $transaction->listing->images,
            'sold_at' => $transaction->created_at,
            'status' => $transaction->status,
            'type' => $transaction->listing->is_auction ? 'auction' : 'purchase',
            ];
        });

        return inertia('dashboard/sold-items', [
            'items' => $soldItems,
        ]);
    }
}
