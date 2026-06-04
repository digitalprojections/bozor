<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapDiscoverabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_uses_live_listing_routes_with_locale_query_parameters(): void
    {
        Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
        ]);

        $listing = Listing::factory()->create([
            'status' => 'active',
            'title' => 'Compact record player',
        ]);

        $this->get(route('sitemap'))
            ->assertOk()
            ->assertHeader('Content-Type', 'text/xml; charset=UTF-8')
            ->assertSee(route('listings.show', ['listing' => $listing, 'lang' => 'en']), false)
            ->assertDontSee('/en/listings/'.$listing->id, false);
    }

    public function test_previous_locale_prefixed_listing_urls_redirect_to_live_listing_routes(): void
    {
        Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
        ]);

        $listing = Listing::factory()->create(['status' => 'active']);

        $this->get('/en/listings/'.$listing->id)
            ->assertStatus(301)
            ->assertRedirect(route('listings.show', ['listing' => $listing, 'lang' => 'en']));
    }

    public function test_robots_file_points_to_the_sitemap_without_a_blade_placeholder(): void
    {
        $this->get(route('robots'))
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
            ->assertSee('Sitemap: '.url('/sitemap.xml'), false)
            ->assertDontSee('{{', false);
    }
}
