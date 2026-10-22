<?php

// Synthetic browser fixture. Refuses every database except the existing local test database.
require '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (config('database.connections.'.config('database.default').'.database') !== 'bozor_local_test'
    || config('app.url') !== 'http://127.0.0.1:8087') {
    throw new RuntimeException('This tool is restricted to the Bozor local test app.');
}
$email = 'feature-request-qa-20261022@example.test';
$action = $argv[1] ?? 'Status';
if ($action === 'Seed') {
    if (App\Models\User::where('email', $email)->exists()) {
        throw new RuntimeException('Fixture already exists; clean it up before seeding again.');
    }
    App\Models\User::create([
        'email' => $email, 'name' => 'Feature Request QA', 'password' => 'Bozor-Local-QA-20261022!',
        'email_verified_at' => now(), 'terms_accepted_at' => now(),
    ]);
    echo "Synthetic local browser account created.\n";
} elseif ($action === 'Assert') {
    $user = App\Models\User::where('email', $email)->firstOrFail();
    $requests = App\Models\FeatureRequest::where('user_id', $user->id)->get();
    if ($requests->count() !== 1 || $requests->first()->locale !== 'uz'
        || $requests->first()->title !== 'QA: Saqlangan qidiruvlar'
        || $requests->first()->description !== 'QA: Mos e’lonlar joylanganda bildirishnoma olishni xohlayman.') {
        throw new RuntimeException('The browser submission did not persist the expected data.');
    }
    echo "PASS: exactly one Uzbek browser request persisted with the expected title and description.\n";
} elseif ($action === 'Cleanup') {
    $user = App\Models\User::where('email', $email)->firstOrFail();
    $count = App\Models\FeatureRequest::where('user_id', $user->id)->delete();
    $user->delete();
    echo "Removed synthetic local account and ".$count." test request(s).\n";
} else {
    echo 'Synthetic local accounts: '.App\Models\User::where('email', $email)->count()."\n";
}
