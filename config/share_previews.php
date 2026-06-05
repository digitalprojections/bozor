<?php

return [
    'disk' => env('SHARE_PREVIEW_DISK', 'public'),
    'directory' => env('SHARE_PREVIEW_DIRECTORY', 'share-previews'),
    'retention_days' => (int) env('SHARE_PREVIEW_RETENTION_DAYS', 45),
    'width' => (int) env('SHARE_PREVIEW_WIDTH', 600),
    'height' => (int) env('SHARE_PREVIEW_HEIGHT', 315),
];
