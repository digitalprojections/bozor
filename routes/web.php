<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::post('locale', function (Request $request) {
    $request->validate(['locale' => 'required|string|in:'.implode(',', array_keys(config('locales.supported', ['en' => []])))]);
    session()->put('locale', $request->input('locale'));
    return redirect()->back();
})->name('locale.update');

Route::get('/', function () {
    // Redirect authenticated users to marketplace
    if (auth()->check()) {
        return redirect()->route('marketplace');
    }
    
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/marketplace', [App\Http\Controllers\MarketplaceController::class, 'index'])
    ->name('marketplace');

// Listing routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/listings/create', [App\Http\Controllers\ListingController::class, 'create'])->name('listings.create');
    Route::post('/listings', [App\Http\Controllers\ListingController::class, 'store'])->name('listings.store');
});

Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Verification routes
Route::middleware(['auth'])->group(function () {
    Route::post('verification/request', [App\Http\Controllers\VerificationRequestController::class, 'store'])->name('verification.store');
    Route::get('verification/status', [App\Http\Controllers\VerificationRequestController::class, 'index'])->name('verification.index');
    Route::delete('verification/request/{id}', [App\Http\Controllers\VerificationRequestController::class, 'destroy'])->name('verification.destroy');
});

require __DIR__.'/settings.php';
