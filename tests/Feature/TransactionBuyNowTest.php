<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class TransactionBuyNowTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_can_buy_direct_sale_listing_for_listing_price(): void
    {
        Notification::fake();

        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = $this->createListing($seller, [
            'price' => 12500,
            'buy_now_price' => null,
            'is_auction' => false,
        ]);

        $response = $this->actingAs($buyer)->post(route('listings.buy-now', $listing));

        $transaction = Transaction::firstOrFail();
        $response->assertRedirect(route('transactions.show', $transaction));
        $this->assertSame(12500, $transaction->amount);
        $this->assertSame(Transaction::STATUS_PENDING_PAYMENT, $transaction->status);
        $this->assertSame('sold', $listing->fresh()->status);
    }

    public function test_buyer_can_use_buy_now_price_on_auction_listing(): void
    {
        Notification::fake();

        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = $this->createListing($seller, [
            'price' => 5000,
            'buy_now_price' => 9000,
            'is_auction' => true,
            'auction_end_date' => now()->addDays(7),
        ]);

        $response = $this->actingAs($buyer)->post(route('listings.buy-now', $listing));

        $transaction = Transaction::firstOrFail();
        $response->assertRedirect(route('transactions.show', $transaction));
        $this->assertSame(9000, $transaction->amount);
        $this->assertSame('sold', $listing->fresh()->status);
    }

    public function test_sold_listing_cannot_be_bought_again(): void
    {
        Notification::fake();

        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = $this->createListing($seller, [
            'status' => 'sold',
            'price' => 12500,
            'buy_now_price' => null,
            'is_auction' => false,
        ]);

        $response = $this->actingAs($buyer)->post(route('listings.buy-now', $listing));

        $response->assertStatus(409);
        $this->assertDatabaseCount('transactions', 0);
    }

    private function createListing(User $seller, array $attributes = []): Listing
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
        ], $attributes));
    }
}
