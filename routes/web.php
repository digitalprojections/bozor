<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::post('locale', function (Request $request) {
    $request->validate(['locale' => 'required|string|in:' . implode(',', array_keys(config('locales.supported', ['en' => []])))]);
    session()->put('locale', $request->input('locale'));
    return redirect()->back();
})->name('locale.update');

Route::get('auth/google', [App\Http\Controllers\Auth\SocialiteController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [App\Http\Controllers\Auth\SocialiteController::class, 'handleGoogleCallback']);

// Root redirect based on locale detection
Route::get('/', function (Request $request) {
    return redirect("/" . (session('locale') ?? $request->cookie('locale') ?? config('app.locale', 'en')));
});

// Redirect bare public paths to localized versions
Route::get('/marketplace', fn(Request $request) => redirect('/' . (session('locale') ?? $request->cookie('locale') ?? config('app.locale', 'en')) . '/marketplace'));
Route::get('/privacy', fn(Request $request) => redirect('/' . (session('locale') ?? $request->cookie('locale') ?? config('app.locale', 'en')) . '/privacy'));
Route::get('/terms', fn(Request $request) => redirect('/' . (session('locale') ?? $request->cookie('locale') ?? config('app.locale', 'en')) . '/terms'));
Route::get('/listings/{listing}', fn(Request $request, $listing) => redirect('/' . (session('locale') ?? $request->cookie('locale') ?? config('app.locale', 'en')) . '/listings/' . $listing));
Route::get('/users/{user}', fn(Request $request, $user) => redirect('/' . (session('locale') ?? $request->cookie('locale') ?? config('app.locale', 'en')) . '/users/' . $user));


Route::group(['prefix' => '{locale}', 'where' => ['locale' => '[a-z]{2}']], function () {
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

    // Listing show route (public)
    Route::get('/listings/{listing}', [App\Http\Controllers\ListingController::class, 'show'])->name('listings.show');

    // Profile show route (public)
    Route::get('/users/{user}', [App\Http\Controllers\ProfileController::class, 'show'])->name('profile.show');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/user/accept-terms', function () {
        auth()->user()->update(['terms_accepted_at' => now()]);
        return back();
    })->name('user.accept-terms');
});

// Listing routes (protected)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/listings/create', [App\Http\Controllers\ListingController::class, 'create'])->name('listings.create');
    Route::post('/listings', [App\Http\Controllers\ListingController::class, 'store'])->name('listings.store');
    Route::get('/listings', function () {
        return redirect()->route('dashboard');
    })->name('listings.index');
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
});

Route::get('/transactions/{transaction}', [App\Http\Controllers\TransactionController::class, 'show'])->name('transactions.show');

Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('dashboard/won-items', [App\Http\Controllers\DashboardController::class, 'wonItems'])->middleware(['auth', 'verified'])->name('dashboard.won-items');
Route::get('dashboard/sold-items', [App\Http\Controllers\DashboardController::class, 'soldItems'])->middleware(['auth', 'verified'])->name('dashboard.sold-items');

// Watchlist routes
Route::get('/watchlist', [App\Http\Controllers\WatchlistController::class, 'index'])->middleware(['auth'])->name('watchlist.index');
Route::post('/watchlist/{listing}/toggle', [App\Http\Controllers\WatchlistController::class, 'toggle'])->name('watchlist.toggle');

// Verification routes
Route::middleware(['auth'])->group(function () {
    Route::post('verification/request', [App\Http\Controllers\VerificationRequestController::class, 'store'])->name('verification.store');
    Route::get('verification/status', [App\Http\Controllers\VerificationRequestController::class, 'index'])->name('verification.index');
    Route::delete('verification/request/{id}', [App\Http\Controllers\VerificationRequestController::class, 'destroy'])->name('verification.destroy');
});


Route::get('/sitemap.xml', [App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');

require __DIR__ . '/settings.php';

