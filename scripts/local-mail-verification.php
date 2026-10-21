<?php
// Local-only Mailpit configuration and assertions; never uses a production database.
require '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (config('database.connections.pgsql.database') !== 'bozor_local_test') {
    throw new RuntimeException('This tool is restricted to bozor_local_test.');
}
$action = $argv[1] ?? 'Status';
$cache = $app->getCachedConfigPath();
$backup = '/tmp/bozor-mail-config-before.php';
$email = 'codex-mail-verification-20261021@example.test';
if ($action === 'Enable') {
    $socket = fsockopen('host.docker.internal', 1025, $errorCode, $errorMessage, 5);
    if (!$socket) throw new RuntimeException('The local Mailpit SMTP listener is unreachable.');
    fclose($socket);
    if (!file_exists($backup) && !copy($cache, $backup)) throw new RuntimeException('Unable to back up local mail settings.');
    config([
        'mail.default' => 'smtp',
        'mail.mailers.smtp' => [
            'transport' => 'smtp', 'scheme' => 'smtp', 'host' => 'host.docker.internal',
            'port' => 1025, 'username' => null, 'password' => null, 'timeout' => 10,
            'local_domain' => 'localhost',
        ],
        'mail.from.address' => 'noreply@bozor.test',
        'mail.from.name' => 'Bozor',
    ]);
    if (file_put_contents($cache, '<?php return '.var_export(config()->all(), true).';') === false) throw new RuntimeException('Unable to enable local SMTP.');
    echo "Local SMTP enabled: Mailpit on host.docker.internal:1025.\n";
} elseif ($action === 'Disable') {
    if (!is_file($backup) || !copy($backup, $cache)) throw new RuntimeException('Unable to restore local mail settings.');
    unlink($backup);
    echo "Original local mail settings restored.\n";
} elseif ($action === 'AssertVerified') {
    $user = App\Models\User::where('email', $email)->firstOrFail();
    if (!$user->hasVerifiedEmail()) throw new RuntimeException('The synthetic account has not verified its email.');
    echo "PASS: the browser email link persisted email_verified_at.\n";
} elseif ($action === 'Cleanup') {
    $count = App\Models\User::where('email', $email)->delete();
    if ($count !== 1) throw new RuntimeException('Unexpected synthetic-account cleanup count.');
    echo "Removed exactly one email-verification QA account.\n";
} elseif ($action === 'Status') {
    echo 'Mailer: '.config('mail.default').'; synthetic accounts: '.App\Models\User::where('email', $email)->count()."\n";
} else {
    throw new InvalidArgumentException('Unknown action.');
}
