<?php
// Run only after the documented synthetic browser journeys on the existing local stack.
require '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (config('database.connections.pgsql.database') !== 'bozor_local_test') {
    throw new RuntimeException('This verifier is restricted to the existing local test database.');
}
$cases = [
    'codex-registration-20261021@example.test' => ['1600023', '東京都', '新宿区', '西新宿2-8-1', 'QA Room 20261021', '0300000000'],
    'codex-registration-manual-20261021@example.test' => ['1000001', '東京都', '千代田区', '千代田1-1', 'QA Manual Room 20261021', '0300000000'],
];
$fields = ['postal_code', 'prefecture', 'city', 'address_line1', 'address_line2', 'phone'];
foreach ($cases as $email => $expected) {
    $query = App\Models\User::where('email', $email);
    if ($query->count() !== 1) throw new RuntimeException('Expected exactly one synthetic account per journey.');
    $user = $query->firstOrFail();
    foreach ($fields as $index => $field) {
        if ($user->getRawOriginal($field) !== $expected[$index]) throw new RuntimeException('Saved field mismatch: '.$field);
    }
    if (!Illuminate\Support\Facades\Hash::check('DisposableQa2026!', $user->password)) throw new RuntimeException('Saved password does not authenticate.');
}
echo "PASS: both registrations persisted all six address/contact fields and valid password hashes. Duplicate registration created no extra account.\n";
if (in_array('--cleanup', $argv, true)) {
    $deleted = App\Models\User::whereIn('email', array_keys($cases))->delete();
    if ($deleted !== 2) throw new RuntimeException('Unexpected synthetic cleanup count.');
    echo "PASS: removed exactly two synthetic QA accounts; existing users preserved.\n";
}
