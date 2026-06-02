<?php

namespace Tests\Feature;

use App\Models\Bid;
use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuctionBidTest extends TestCase
{
    use RefreshDatabase;

    public function test_bid_must_be_at_least_five_percent_above_current_price(): void
    {
        Notification::fake();

        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = $this->createAuction($seller, [
            'price' => 1000,
            'current_high_bid' => 0,
        ]);

        $this->actingAs($buyer)
            ->from(route('listings.show', $listing))
            ->post(route('listings.bid', $listing), ['amount' => 1049])
            ->assertRedirect(route('listings.show', $listing))
            ->assertSessionHasErrors('amount');

        $this->assertDatabaseCount('bids', 0);

        $this->actingAs($buyer)
            ->post(route('listings.bid', $listing), ['amount' => 1050])
            ->assertRedirect();

        $this->assertDatabaseHas('bids', [
            'listing_id' => $listing->id,
            'user_id' => $buyer->id,
            'amount' => 1050,
        ]);
        $this->assertSame(1050, $listing->fresh()->display_price);
    }

    public function test_listing_show_marks_current_user_as_highest_bidder(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = $this->createAuction($seller, [
            'price' => 1000,
            'current_high_bid' => 1500,
        ]);

        Bid::create([
            'listing_id' => $listing->id,
            'user_id' => $buyer->id,
            'amount' => 1500,
        ]);

        $this->actingAs($buyer)
            ->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('listing.is_highest_bidder', true)
                ->where('listing.minimum_bid', 1575)
            );
    }

    public function test_bid_extends_auction_to_full_five_minutes_when_close_to_ending(): void
    {
        Notification::fake();
        $this->travelTo(now()->setMicrosecond(0));

        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = $this->createAuction($seller, [
            'price' => 1000,
            'auction_end_date' => now()->addMinutes(2),
        ]);

        $this->actingAs($buyer)
            ->post(route('listings.bid', $listing), ['amount' => 1050])
            ->assertRedirect();

        $this->assertTrue(
            $listing->fresh()->auction_end_date->equalTo(now()->addMinutes(5))
        );

        $this->travelBack();
    }

    public function test_listing_price_reverts_when_highest_bid_is_removed(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $secondBuyer = User::factory()->create();
        $listing = $this->createAuction($seller, [
            'price' => 1000,
            'current_high_bid' => 5000,
        ]);

        $lowerBid = Bid::create([
            'listing_id' => $listing->id,
            'user_id' => $buyer->id,
            'amount' => 1200,
        ]);

        $higherBid = Bid::create([
            'listing_id' => $listing->id,
            'user_id' => $secondBuyer->id,
            'amount' => 1500,
        ]);

        $this->assertSame(1500, $listing->fresh()->display_price);
        $this->assertSame(1575, $listing->fresh()->minimumBidAmount());

        $higherBid->delete();

        $this->assertSame(1200, $listing->fresh()->display_price);
        $this->assertSame(1260, $listing->fresh()->minimumBidAmount());

        $lowerBid->delete();

        $this->assertSame(1000, $listing->fresh()->display_price);
        $this->assertSame(1050, $listing->fresh()->minimumBidAmount());
    }

    public function test_bid_does_not_shorten_auction_when_more_than_five_minutes_remain(): void
    {
        Notification::fake();
        $this->travelTo(now()->setMicrosecond(0));

        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $originalEndDate = now()->addMinutes(10);
        $listing = $this->createAuction($seller, [
            'price' => 1000,
            'auction_end_date' => $originalEndDate,
        ]);

        $this->actingAs($buyer)
            ->post(route('listings.bid', $listing), ['amount' => 1050])
            ->assertRedirect();

        $this->assertTrue($listing->fresh()->auction_end_date->equalTo($originalEndDate));

        $this->travelBack();
    }

    public function test_listing_with_bids_can_be_edited_and_updated_by_seller(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $listing = $this->createAuction($seller, [
            'price' => 1000,
        ]);

        Bid::create([
            'listing_id' => $listing->id,
            'user_id' => $buyer->id,
            'amount' => 1050,
        ]);

        $this->actingAs($seller)
            ->get(route('listings.edit', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('hasBids', true)
                ->where('listing.bids_count', 1)
            );

        $this->actingAs($seller)
            ->patch(route('listings.update', $listing), [
                'title' => 'Updated title',
                'description' => $listing->description,
                'price' => 900,
                'categories' => [$listing->category_id],
                'location' => $listing->location,
                'status' => 'active',
                'condition' => $listing->condition,
                'buy_now_price' => null,
                'is_auction' => true,
                'auction_end_date' => now()->addDay()->toDateTimeString(),
            ])
            ->assertRedirect(route('listings.show', $listing));

        $this->assertSame('Updated title', $listing->fresh()->title);
        $this->assertSame(900, $listing->fresh()->price);
    }

    public function test_listing_with_bids_cannot_be_deleted_by_seller(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $listing = $this->createAuction($seller);

        Bid::create([
            'listing_id' => $listing->id,
            'user_id' => $buyer->id,
            'amount' => 1050,
        ]);

        $this->actingAs($seller)
            ->delete(route('listings.destroy', $listing))
            ->assertForbidden();

        $this->assertDatabaseHas('listings', [
            'id' => $listing->id,
            'deleted_at' => null,
        ]);
    }

    private function createAuction(User $seller, array $attributes = []): Listing
    {
        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics-'.uniqid(),
        ]);

        return Listing::factory()->create(array_merge([
            'user_id' => $seller->id,
            'category_id' => $category->id,
            'condition' => 'used_good',
            'status' => 'active',
            'is_auction' => true,
            'auction_end_date' => now()->addHour(),
            'current_high_bid' => 0,
        ], $attributes));
    }
}
