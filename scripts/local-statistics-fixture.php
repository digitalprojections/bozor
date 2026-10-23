<?php

// Disposable accounts and data for the existing local statistics browser journey.
require '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (config('database.connections.'.config('database.default').'.database') !== 'bozor_local_test'
    || config('app.url') !== 'http://127.0.0.1:8087') {
    throw new RuntimeException('Statistics fixtures require the existing local test app.');
}
$adminEmail = 'fuzalov@gmail.com';
$userEmail = 'statistics-qa-20261023@example.test';
$action = $argv[1] ?? 'Status';
if ($action === 'Seed') {
    if (App\Models\User::whereIn('email', [$adminEmail, $userEmail])->exists()) {
        throw new RuntimeException('An account already exists; refusing to change it.');
    }
    $admin = App\Models\User::create(['email' => $adminEmail, 'name' => 'Statistics QA Admin', 'password' => 'Bozor-Statistics-QA-20261023!', 'email_verified_at' => now(), 'terms_accepted_at' => now()]);
    $user = App\Models\User::create(['email' => $userEmail, 'name' => 'Statistics QA User', 'password' => 'Bozor-Statistics-QA-20261023!', 'email_verified_at' => now(), 'terms_accepted_at' => now()]);
    $category = App\Models\Category::create(['name' => 'Statistics QA', 'slug' => 'statistics-qa-20261023']);
    foreach ([0, 2, 5] as $offset) {
        $listing = App\Models\Listing::create([
            'user_id' => $admin->id, 'category_id' => $category->id, 'title' => 'Statistics QA '.$offset,
            'description' => 'Disposable statistics browser fixture.', 'price' => 1200 + $offset * 100,
            'status' => $offset === 0 ? 'sold' : 'active', 'listing_type' => 'item', 'images' => [],
            'condition' => 'used_good', 'location' => 'Tokyo', 'public_prefecture' => 'Tokyo',
            'is_auction' => $offset === 2, 'views' => 42,
        ]);
        $listing->forceFill(['created_at' => now()->subDays($offset)])->save();
        $listing->categories()->attach($category);
        if ($offset === 0) {
            App\Models\Transaction::create(['listing_id' => $listing->id, 'buyer_id' => $user->id, 'seller_id' => $admin->id, 'amount' => 1200, 'status' => 'received', 'completed_at' => now()]);
        }
        if ($offset === 2) {
            App\Models\Bid::create(['listing_id' => $listing->id, 'user_id' => $user->id, 'amount' => 1500]);
        }
    }
    App\Models\FeatureRequest::create(['user_id' => $user->id, 'title' => 'Statistics QA request', 'description' => 'Disposable test request.', 'locale' => 'uz']);
    echo "Created two disposable accounts and statistics fixtures.\n";
} elseif ($action === 'Cleanup') {
    $admin = App\Models\User::where('email', $adminEmail)->where('name', 'Statistics QA Admin')->firstOrFail();
    $user = App\Models\User::where('email', $userEmail)->where('name', 'Statistics QA User')->firstOrFail();
    App\Models\FeatureRequest::where('user_id', $user->id)->delete();
    App\Models\Listing::withTrashed()->where('user_id', $admin->id)->forceDelete();
    App\Models\Category::where('slug', 'statistics-qa-20261023')->delete();
    $user->delete();
    $admin->delete();
    echo "Removed both disposable accounts and all statistics fixtures.\n";
} else {
    echo 'Synthetic statistics accounts: '.App\Models\User::where('email', $userEmail)->count()."\n";
}
