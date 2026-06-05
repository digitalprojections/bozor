<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Storage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('share-previews:prune {--days= : Delete previews older than this many days}', function () {
    $disk = Storage::disk((string) config('share_previews.disk', 'public'));
    $directory = trim((string) config('share_previews.directory', 'share-previews'), '/');
    $days = (int) ($this->option('days') ?: config('share_previews.retention_days', 45));
    $cutoff = now()->subDays(max(1, $days))->timestamp;
    $deleted = 0;

    foreach ($disk->files($directory) as $path) {
        if ($disk->lastModified($path) < $cutoff) {
            $disk->delete($path);
            $deleted++;
        }
    }

    $this->info("Deleted {$deleted} cached share preview image(s).");
})->purpose('Delete old cached listing share preview images');

Schedule::command('share-previews:prune')->daily();
