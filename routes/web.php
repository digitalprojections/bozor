<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Locale update route
Route::post('locale', [App\Http\Controllers\LocaleController::class, 'update'])->name('locale.update');

Route::get('auth/google', [App\Http\Controllers\Auth\SocialiteController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [App\Http\Controllers\Auth\SocialiteController::class, 'handleGoogleCallback']);
Route::get('/sitemap.xml', [App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');


// Root
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/marketplace', [App\Http\Controllers\MarketplaceController::class, 'index'])
    ->name('marketplace');

Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('terms');
})->name('terms');


Route::middleware(['auth'])->group(function () {
    Route::post('/user/accept-terms', function () {
        auth()->user()->update(['terms_accepted_at' => now()]);
        return back();
    })->name('user.accept-terms');

    // Watchlist routes
    Route::get('/watchlist', [App\Http\Controllers\WatchlistController::class, 'index'])->name('watchlist.index');
    Route::post('/watchlist/{listing}/toggle', [App\Http\Controllers\WatchlistController::class, 'toggle'])->name('watchlist.toggle');

    // Verification routes
    Route::post('verification/request', [App\Http\Controllers\VerificationRequestController::class, 'store'])->name('verification.store');
    Route::get('verification/status', [App\Http\Controllers\VerificationRequestController::class, 'index'])->name('verification.index');
    Route::delete('verification/request/{id}', [App\Http\Controllers\VerificationRequestController::class, 'destroy'])->name('verification.destroy');

    // Protected Listing & Transaction routes
    Route::middleware(['verified'])->group(function () {
        Route::get('/listings/create', [App\Http\Controllers\ListingController::class, 'create'])->name('listings.create');
        Route::post('/listings', [App\Http\Controllers\ListingController::class, 'store'])->name('listings.store');
        Route::get('/listings/{listing}/edit', [App\Http\Controllers\ListingController::class, 'edit'])->name('listings.edit');
        Route::patch('/listings/{listing}', [App\Http\Controllers\ListingController::class, 'update'])->name('listings.update');
        Route::delete('/listings/{listing}', [App\Http\Controllers\ListingController::class, 'destroy'])->name('listings.destroy');

        // Bidding and Buy Now routes
        Route::post('/listings/{listing}/bid', [App\Http\Controllers\BidController::class, 'store'])->name('listings.bid');
        Route::post('/listings/{listing}/buy-now', [App\Http\Controllers\TransactionController::class, 'buyNow'])->name('listings.buy-now');

        Route::post('/transactions/{transaction}/mark-as-paid', [App\Http\Controllers\TransactionController::class, 'markAsPaid'])->name('transactions.mark-as-paid');
        Route::post('/transactions/{transaction}/cancel', [App\Http\Controllers\TransactionController::class, 'cancel'])->name('transactions.cancel');
        Route::post('/transactions/{transaction}/mark-as-shipped', [App\Http\Controllers\TransactionController::class, 'markAsShipped'])->name('transactions.mark-as-shipped');
        Route::post('/transactions/{transaction}/mark-as-received', [App\Http\Controllers\TransactionController::class, 'markAsReceived'])->name('transactions.mark-as-received');
        Route::post('/transactions/{transaction}/rate', [App\Http\Controllers\RatingController::class, 'store'])->name('transactions.rate');

        Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
        Route::get('dashboard/won-items', [App\Http\Controllers\DashboardController::class, 'wonItems'])->name('dashboard.won-items');
        Route::get('dashboard/sold-items', [App\Http\Controllers\DashboardController::class, 'soldItems'])->name('dashboard.sold-items');
    });
});

Route::get('/listings', function () {
    return redirect()->route('dashboard');
})->name('listings.index');

Route::get('/transactions/{transaction}', [App\Http\Controllers\TransactionController::class, 'show'])->name('transactions.show');

require __DIR__ . '/settings.php';

// Public Wildcard Routes (Must be at the bottom to avoid shadowing static routes)
Route::get('/listings/{listing}', [App\Http\Controllers\ListingController::class, 'show'])->name('listings.show');
Route::get('/users/{user}', [App\Http\Controllers\ProfileController::class, 'show'])->name('profile.show');


