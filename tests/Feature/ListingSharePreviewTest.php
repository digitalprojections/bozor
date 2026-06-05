<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ListingSharePreviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_listing_show_exposes_share_preview_metadata(): void
    {
        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD is required to generate cached share preview images.');
        }

        Storage::fake('public');

        Category::create([
            'name' => 'Cameras',
            'slug' => 'cameras',
        ]);

        $listing = Listing::factory()->create([
            'user_id' => User::factory(),
            'title' => 'Vintage Film Camera',
            'description' => 'A clean working camera with the original leather case and a bright lens.',
            'images' => ['listings/camera.webp'],
            'location' => 'Tokyo',
            'public_prefecture' => 'Tokyo',
            'price' => 12800,
        ]);

        $url = route('listings.show', $listing);
        $imageAlt = 'Vintage Film Camera current price JPY 12,800 in Tokyo on '.config('app.name', 'Bozor Japan');

        $this->get($url)
            ->assertOk()
            ->assertSee('<meta property="og:title" content="Vintage Film Camera | '.config('app.name').'">', false)
            ->assertSee('<meta property="og:description" content="Current price JPY 12,800. A clean working camera with the original leather case and a bright lens.">', false)
            ->assertSee('<meta property="og:url" content="'.$url.'">', false)
            ->assertSee('/storage/share-previews/listing-'.$listing->id.'-', false)
            ->assertSee('<meta property="og:image:alt" content="'.$imageAlt.'">', false)
            ->assertSee('<meta property="og:image:width" content="600">', false)
            ->assertSee('<meta property="og:image:height" content="315">', false)
            ->assertSee('<meta property="product:price:amount" content="12800">', false)
            ->assertSee('<meta property="product:price:currency" content="JPY">', false)
            ->assertSee('<meta name="geo.placename" content="Tokyo">', false)
            ->assertSee('<meta name="geo.region" content="Tokyo">', false)
            ->assertSee('<meta name="twitter:image:alt" content="'.$imageAlt.'">', false)
            ->assertInertia(fn (Assert $page) => $page
                ->where('seo.title', 'Vintage Film Camera | '.config('app.name'))
                ->where('seo.description', 'Current price JPY 12,800. A clean working camera with the original leather case and a bright lens.')
                ->where('seo.canonical', $url)
                ->where('seo.og_image', fn (string $value) => str_contains($value, '/storage/share-previews/listing-'.$listing->id.'-'))
                ->where('seo.og_image_alt', $imageAlt)
                ->where('seo.price_amount', 12800)
                ->where('seo.price_currency', 'JPY')
                ->where('seo.geo_placename', 'Tokyo')
                ->where('seo.geo_region', 'Tokyo')
                ->where('seo.json_ld.@graph.0.@type', 'Product')
                ->where('seo.json_ld.@graph.0.image.0.@type', 'ImageObject')
                ->where('seo.json_ld.@graph.0.image.0.caption', $imageAlt)
                ->where('seo.json_ld.@graph.0.offers.availableAtOrFrom.@type', 'Place')
                ->where('seo.json_ld.@graph.0.offers.availableAtOrFrom.name', 'Tokyo')
                ->where('seo.json_ld.@graph.0.offers.availableAtOrFrom.address.addressCountry', 'JP')
                ->where('seo.json_ld.@graph.1.@type', 'BreadcrumbList')
            );

        $this->assertNotEmpty(Storage::disk('public')->files('share-previews'));
    }

    public function test_old_share_preview_images_can_be_pruned(): void
    {
        Storage::fake('public');

        Storage::disk('public')->put('share-previews/old.jpg', 'old');
        Storage::disk('public')->put('share-previews/fresh.jpg', 'fresh');

        touch(Storage::disk('public')->path('share-previews/old.jpg'), now()->subDays(60)->timestamp);
        touch(Storage::disk('public')->path('share-previews/fresh.jpg'), now()->subDays(2)->timestamp);

        $this->artisan('share-previews:prune --days=45')
            ->expectsOutput('Deleted 1 cached share preview image(s).')
            ->assertExitCode(0);

        Storage::disk('public')->assertMissing('share-previews/old.jpg');
        Storage::disk('public')->assertExists('share-previews/fresh.jpg');
    }
}
