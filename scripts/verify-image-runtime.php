<?php

// Exercise the codecs used by avatar uploads and listing preview images.
if (! extension_loaded('gd')) {
    fwrite(STDERR, "FAIL: PHP GD is not installed.\n");
    exit(1);
}

foreach (['png', 'jpeg', 'webp'] as $format) {
    $encoder = 'image'.$format;
    if (! function_exists($encoder)) {
        throw new RuntimeException("Missing GD codec: {$format}");
    }

    $image = imagecreatetruecolor(8, 8);
    imagefill($image, 0, 0, imagecolorallocate($image, 13, 148, 136));
    ob_start();
    $encoded = $encoder($image);
    $bytes = ob_get_clean();
    $decoded = $encoded ? imagecreatefromstring($bytes) : false;
    if (! $decoded || imagesx($decoded) !== 8 || imagesy($decoded) !== 8) {
        throw new RuntimeException("GD {$format} round trip failed.");
    }
    echo "PASS: GD {$format} encoding and decoding.\n";
}
