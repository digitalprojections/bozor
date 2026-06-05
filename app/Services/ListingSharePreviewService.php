<?php

namespace App\Services;

use App\Models\Listing;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ListingSharePreviewService
{
    public function imageUrlFor(Listing $listing): ?string
    {
        if (! $this->gdCanCreateImages()) {
            return $listing->main_image_url;
        }

        $disk = Storage::disk($this->disk());
        $path = $this->pathFor($listing);

        if (! $disk->exists($path)) {
            $image = $this->makeCanvas($listing);

            if (! $image) {
                return $listing->main_image_url;
            }

            ob_start();
            imagejpeg($image, null, 78);
            $bytes = ob_get_clean();
            imagedestroy($image);

            if (! is_string($bytes) || $bytes === '') {
                return $listing->main_image_url;
            }

            $disk->put($path, $bytes, 'public');
        }

        return $disk->url($path);
    }

    public function altTextFor(Listing $listing): string
    {
        $price = 'JPY '.number_format($listing->display_price);
        $location = filled($listing->location) ? ' in '.$listing->location : '';

        return "{$listing->title} current price {$price}{$location} on ".config('app.name', 'Bozor Japan');
    }

    private function pathFor(Listing $listing): string
    {
        $imagePath = collect($listing->images ?? [])
            ->first(fn ($path) => is_string($path) && $path !== '');
        $updatedAt = $listing->updated_at?->timestamp ?? time();
        $fingerprint = substr(sha1(implode('|', [
            'v2-large-price-stamp',
            $listing->id,
            $listing->display_price,
            $updatedAt,
            $imagePath,
        ])), 0, 12);

        return trim($this->directory(), '/')."/listing-{$listing->id}-{$fingerprint}.jpg";
    }

    private function makeCanvas(Listing $listing): mixed
    {
        $width = $this->width();
        $height = $this->height();
        $canvas = imagecreatetruecolor($width, $height);

        if (! $canvas) {
            return null;
        }

        $this->paintBackground($canvas, $listing, $width, $height);
        $this->paintPriceBadge($canvas, $listing, $width, $height);

        return $canvas;
    }

    private function paintBackground(mixed $canvas, Listing $listing, int $width, int $height): void
    {
        $source = $this->openSourceImage($listing);

        if ($source) {
            $sourceWidth = imagesx($source);
            $sourceHeight = imagesy($source);
            $scale = max($width / $sourceWidth, $height / $sourceHeight);
            $targetWidth = (int) ceil($sourceWidth * $scale);
            $targetHeight = (int) ceil($sourceHeight * $scale);
            $targetX = (int) floor(($width - $targetWidth) / 2);
            $targetY = (int) floor(($height - $targetHeight) / 2);

            imagecopyresampled(
                $canvas,
                $source,
                $targetX,
                $targetY,
                0,
                0,
                $targetWidth,
                $targetHeight,
                $sourceWidth,
                $sourceHeight
            );
            imagedestroy($source);

            return;
        }

        $background = imagecolorallocate($canvas, 15, 23, 42);
        $accent = imagecolorallocate($canvas, 13, 148, 136);

        imagefilledrectangle($canvas, 0, 0, $width, $height, $background);
        imagefilledellipse($canvas, $width - 90, 70, 260, 180, $accent);
    }

    private function paintPriceBadge(mixed $canvas, Listing $listing, int $width, int $height): void
    {
        $shadow = imagecolorallocatealpha($canvas, 2, 6, 23, 18);
        $panel = imagecolorallocatealpha($canvas, 2, 6, 23, 4);
        $white = imagecolorallocate($canvas, 255, 255, 255);
        $muted = imagecolorallocate($canvas, 226, 232, 240);
        $accent = imagecolorallocate($canvas, 20, 184, 166);

        $panelTop = (int) round($height * 0.56);

        imagefilledrectangle($canvas, 0, $panelTop - 18, $width, $height, $shadow);
        imagefilledrectangle($canvas, 0, $panelTop, $width, $height, $panel);
        imagefilledrectangle($canvas, 0, $panelTop, 10, $height, $accent);

        $priceLabel = $this->priceLabelFor($listing);
        $price = 'JPY '.number_format($listing->display_price);

        $this->drawScaledText($canvas, strtoupper($priceLabel), 3, 26, $panelTop + 20, 2, $muted);
        $this->drawScaledText($canvas, $price, 5, 26, $panelTop + 54, 4, $white);

        $location = filled($listing->location)
            ? Str::ascii((string) $listing->location)
            : 'Japan marketplace';
        $this->drawScaledText($canvas, Str::limit($location, 58, ''), 3, 26, $height - 34, 1, $muted);

        if ($listing->is_auction && $listing->buy_now_price) {
            $buyNow = 'BUY NOW JPY '.number_format($listing->buy_now_price);
            $this->drawScaledText($canvas, $buyNow, 3, $width - 210, $height - 34, 1, $muted);
        }
    }

    private function priceLabelFor(Listing $listing): string
    {
        if ($listing->status === 'sold') {
            return 'Final price';
        }

        if ($listing->is_auction) {
            return 'Current price';
        }

        return 'Price';
    }

    private function drawScaledText(
        mixed $canvas,
        string $text,
        int $font,
        int $x,
        int $y,
        int $scale,
        int $color,
    ): void {
        if ($scale <= 1) {
            imagestring($canvas, $font, $x, $y, $text, $color);

            return;
        }

        $textWidth = imagefontwidth($font) * strlen($text);
        $textHeight = imagefontheight($font);
        $source = imagecreatetruecolor($textWidth, $textHeight);

        if (! $source) {
            imagestring($canvas, $font, $x, $y, $text, $color);

            return;
        }

        $transparent = imagecolorallocatealpha($source, 0, 0, 0, 127);
        imagefill($source, 0, 0, $transparent);
        imagecolortransparent($source, $transparent);

        $rgba = imagecolorsforindex($canvas, $color);
        $sourceColor = imagecolorallocate($source, $rgba['red'], $rgba['green'], $rgba['blue']);
        imagestring($source, $font, 0, 0, $text, $sourceColor);

        imagecopyresampled(
            $canvas,
            $source,
            $x,
            $y,
            0,
            0,
            $textWidth * $scale,
            $textHeight * $scale,
            $textWidth,
            $textHeight
        );

        imagedestroy($source);
    }

    private function openSourceImage(Listing $listing): mixed
    {
        $imagePath = collect($listing->images ?? [])
            ->first(fn ($path) => is_string($path) && $path !== '');

        if (! $imagePath) {
            return null;
        }

        $disk = Storage::disk('public');

        if (! $disk->exists($imagePath)) {
            return null;
        }

        $path = $disk->path($imagePath);
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        try {
            return match ($extension) {
                'jpg', 'jpeg' => imagecreatefromjpeg($path),
                'png' => imagecreatefrompng($path),
                'gif' => imagecreatefromgif($path),
                'webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($path) : null,
                default => null,
            };
        } catch (\Throwable) {
            return null;
        }
    }

    private function gdCanCreateImages(): bool
    {
        return extension_loaded('gd')
            && function_exists('imagecreatetruecolor')
            && function_exists('imagejpeg');
    }

    private function disk(): string
    {
        return (string) config('share_previews.disk', 'public');
    }

    private function directory(): string
    {
        return (string) config('share_previews.directory', 'share-previews');
    }

    private function width(): int
    {
        return max(200, (int) config('share_previews.width', 600));
    }

    private function height(): int
    {
        return max(200, (int) config('share_previews.height', 315));
    }
}
