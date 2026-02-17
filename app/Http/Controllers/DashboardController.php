<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class DashboardController extends Controller
{
    public function index(Request $request)
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

        return inertia('dashboard', [
            'stats' => $stats,
            'listings' => $listings,
            'transactions' => $transactions,
            'verificationRequest' => $user->latestVerificationRequest,
            'isVerified' => $user->isVerified(),
        ]);
    }
}
