<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ListingSharePreviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_listing_show_exposes_share_preview_metadata(): void
    {
        Category::create([
            'name' => 'Cameras',
            'slug' => 'cameras',
        ]);

        $listing = Listing::factory()->create([
            'user_id' => User::factory(),
            'title' => 'Vintage Film Camera',
            'description' => 'A clean working camera with the original leather case and a bright lens.',
            'images' => ['listings/camera.webp'],
            'price' => 12800,
        ]);

        $url = route('listings.show', $listing);
        $imageUrl = asset('storage/listings/camera.webp');

        $this->get($url)
            ->assertOk()
            ->assertSee('<meta property="og:title" content="Vintage Film Camera | '.config('app.name').'">', false)
            ->assertSee('<meta property="og:description" content="A clean working camera with the original leather case and a bright lens.">', false)
            ->assertSee('<meta property="og:url" content="'.$url.'">', false)
            ->assertSee('<meta property="og:image" content="'.$imageUrl.'">', false)
            ->assertSee('<meta name="twitter:image" content="'.$imageUrl.'">', false)
            ->assertInertia(fn (Assert $page) => $page
                ->where('seo.title', 'Vintage Film Camera | '.config('app.name'))
                ->where('seo.description', 'A clean working camera with the original leather case and a bright lens.')
                ->where('seo.canonical', $url)
                ->where('seo.og_image', $imageUrl)
            );
    }
}
