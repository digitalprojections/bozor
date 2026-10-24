<?php

// Synthetic data for the existing local app only. Never use on production.
require '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (config('database.connections.'.config('database.default').'.database') !== 'bozor_local_test'
    || config('app.url') !== 'http://127.0.0.1:8087') {
    throw new RuntimeException('Requires the existing local test deployment.');
}
$emails = ['likes-seller@example.test', 'likes-viewer@example.test', 'likes-other@example.test'];
$action = $argv[1] ?? 'Status';
if ($action === 'Seed') {
    if (App\Models\User::whereIn('email', $emails)->exists()) {
        throw new RuntimeException('Fixture accounts already exist; refusing to overwrite.');
    }
    Illuminate\Support\Facades\DB::transaction(function () use ($emails) {
        $users = [];
        foreach ($emails as $email) {
            $users[] = App\Models\User::create(['name' => 'Likes QA', 'email' => $email,
                'password' => 'Local-Likes-QA-2026!', 'email_verified_at' => now(), 'terms_accepted_at' => now()]);
        }
        $category = App\Models\Category::create(['name' => 'Likes QA', 'slug' => 'likes-qa']);
        foreach ([0, 2] as $count) {
            $listing = App\Models\Listing::create(['user_id' => $users[0]->id, 'category_id' => $category->id,
                'title' => 'Likes QA '.$count, 'description' => 'Disposable local count verification.',
                'price' => 1000, 'status' => 'active', 'listing_type' => 'item', 'images' => [],
                'condition' => 'used_good', 'public_prefecture' => 'Tokyo', 'public_city' => 'Shibuya']);
            $listing->categories()->attach($category);
            if ($count) $listing->watchedBy()->attach([$users[0]->id, $users[2]->id]);
            echo 'Fixture listing '.$listing->id.' has '.$count." likes.\n";
        }
    });
} elseif ($action === 'Cleanup') {
    Illuminate\Support\Facades\DB::transaction(function () use ($emails) {
        $users = App\Models\User::whereIn('email', $emails)->where('name', 'Likes QA')->get();
        App\Models\Listing::withTrashed()->whereIn('user_id', $users->modelKeys())->forceDelete();
        foreach ($users as $user) $user->delete();
        App\Models\Category::where('slug', 'likes-qa')->delete();
    });
    echo "Removed synthetic likes fixtures.\n";
} else {
    echo App\Models\User::whereIn('email', $emails)->count()." synthetic accounts.\n";
}
