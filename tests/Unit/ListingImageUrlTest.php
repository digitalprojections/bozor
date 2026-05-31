<?php

namespace Tests\Unit;

use App\Models\Listing;
use Tests\TestCase;

class ListingImageUrlTest extends TestCase
{
    public function test_image_urls_ignore_failed_upload_values(): void
    {
        config(['filesystems.default' => 'public']);

        $listing = new Listing([
            'images' => [false, null, '', 'listings/item.webp'],
        ]);

        $this->assertStringEndsWith('/storage/listings/item.webp', $listing->main_image_url);
        $this->assertCount(1, $listing->all_image_urls);
        $this->assertStringEndsWith('/storage/listings/item.webp', $listing->all_image_urls[0]);
    }

    public function test_listing_with_only_failed_upload_values_has_no_image_urls(): void
    {
        config(['filesystems.default' => 'public']);

        $listing = new Listing([
            'images' => [false, false],
        ]);

        $this->assertNull($listing->main_image_url);
        $this->assertSame([], $listing->all_image_urls);
    }
}
