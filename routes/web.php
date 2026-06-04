<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\VerificationRequestController;
use App\Http\Controllers\WatchlistController;
use App\Models\Listing;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Locale update route
Route::post('locale', [LocaleController::class, 'update'])->name('locale.update');

Route::get('auth/google', [SocialiteController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [SocialiteController::class, 'handleGoogleCallback']);
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', function () {
    return response("User-agent: *\nAllow: /\n\nSitemap: ".url('/sitemap.xml')."\n", 200)
        ->header('Content-Type', 'text/plain');
})->name('robots');

// Root
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/marketplace', [MarketplaceController::class, 'index'])
    ->name('marketplace');

$supportedLocalePattern = implode('|', array_map('preg_quote', array_keys(config('locales.supported', ['en' => []]))));

Route::get('/{locale}', function (string $locale) {
    return redirect()->route('home', ['lang' => $locale], 301);
})->where('locale', $supportedLocalePattern);

Route::get('/{locale}/marketplace', function (string $locale) {
    return redirect()->route('marketplace', ['lang' => $locale], 301);
})->where('locale', $supportedLocalePattern);

Route::get('/{locale}/listings/{listing}', function (string $locale, Listing $listing) {
    return redirect()->route('listings.show', ['listing' => $listing, 'lang' => $locale], 301);
})->where('locale', $supportedLocalePattern);

Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('terms');
})->name('terms');

Route::middleware(['real-user'])->group(function () {
    Route::post('/user/accept-terms', function () {
        auth()->user()->update(['terms_accepted_at' => now()]);

        return back();
    })->name('user.accept-terms');

    // Watchlist routes
    Route::get('/watchlist', [WatchlistController::class, 'index'])->name('watchlist.index');
    Route::post('/watchlist/{listing}/toggle', [WatchlistController::class, 'toggle'])->name('watchlist.toggle');

    // Verification routes
    Route::post('verification/request', [VerificationRequestController::class, 'store'])->name('verification.store');
    Route::get('verification/status', [VerificationRequestController::class, 'index'])->name('verification.index');
    Route::delete('verification/request/{id}', [VerificationRequestController::class, 'destroy'])->name('verification.destroy');

    // Protected Listing & Transaction routes
    Route::middleware(['verified'])->group(function () {
        Route::get('/listings/create', [ListingController::class, 'create'])->name('listings.create');
        Route::post('/listings', [ListingController::class, 'store'])->name('listings.store');
        Route::get('/listings/{listing}/edit', [ListingController::class, 'edit'])->name('listings.edit');
        Route::patch('/listings/{listing}', [ListingController::class, 'update'])->name('listings.update');
        Route::delete('/listings/{listing}', [ListingController::class, 'destroy'])->name('listings.destroy');

        // Bidding and Buy Now routes
        Route::post('/listings/{listing}/bid', [BidController::class, 'store'])->name('listings.bid');
        Route::post('/listings/{listing}/buy-now', [TransactionController::class, 'buyNow'])->name('listings.buy-now');

        Route::post('/transactions/{transaction}/mark-as-paid', [TransactionController::class, 'markAsPaid'])->name('transactions.mark-as-paid');
        Route::post('/transactions/{transaction}/cancel', [TransactionController::class, 'cancel'])->name('transactions.cancel');
        Route::post('/transactions/{transaction}/mark-as-shipped', [TransactionController::class, 'markAsShipped'])->name('transactions.mark-as-shipped');
        Route::post('/transactions/{transaction}/mark-as-received', [TransactionController::class, 'markAsReceived'])->name('transactions.mark-as-received');
        Route::post('/transactions/packages/consolidate', [TransactionController::class, 'consolidatePackages'])->name('transactions.packages.consolidate');
        Route::post('/transactions/{transaction}/rate', [RatingController::class, 'store'])->name('transactions.rate');

        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('dashboard/won-items', [DashboardController::class, 'wonItems'])->name('dashboard.won-items');
        Route::get('dashboard/sold-items', [DashboardController::class, 'soldItems'])->name('dashboard.sold-items');
    });
});

Route::get('/listings', function () {
    return redirect()->route('dashboard');
})->name('listings.index');

Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');

require __DIR__.'/settings.php';

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('/verifications', [VerificationController::class, 'index'])->name('verifications.index');
        Route::get('/verifications/{id}', [VerificationController::class, 'show'])->name('verifications.show');
        Route::post('/verifications/{id}/approve', [VerificationController::class, 'approve'])->name('verifications.approve');
        Route::post('/verifications/{id}/reject', [VerificationController::class, 'reject'])->name('verifications.reject');
    });

// Public Wildcard Routes (Must be at the bottom to avoid shadowing static routes)
Route::get('/listings/{listing}', [ListingController::class, 'show'])->name('listings.show');
Route::get('/users/{user}', [ProfileController::class, 'show'])->name('profile.show');
