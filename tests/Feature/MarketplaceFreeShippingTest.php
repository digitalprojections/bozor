<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MarketplaceFreeShippingTest extends TestCase
{
    use RefreshDatabase;

    public function test_marketplace_can_filter_to_free_shipping_listings(): void
    {
        Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
        ]);

        $freeShippingListing = Listing::factory()->create([
            'title' => 'Free shipping item',
            'shipping_payer' => 'seller',
            'shipping_cost_type' => 'free',
            'shipping_cost' => 0,
        ]);

        Listing::factory()->create([
            'title' => 'Paid shipping item',
            'shipping_payer' => 'buyer',
            'shipping_cost_type' => 'fixed',
            'shipping_cost' => 1200,
        ]);

        $this->get(route('marketplace', ['free_shipping' => 1]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.free_shipping', true)
                ->has('listings.data', 1)
                ->where('listings.data.0.id', $freeShippingListing->id)
                ->where('listings.data.0.free_shipping', true)
            );
    }

    public function test_paid_shipping_listing_is_not_marked_as_free_shipping(): void
    {
        Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
        ]);

        $listing = Listing::factory()->create([
            'shipping_payer' => 'buyer',
            'shipping_cost_type' => 'fixed',
            'shipping_cost' => 1200,
        ]);

        $this->assertFalse($listing->fresh()->free_shipping);
    }
}
