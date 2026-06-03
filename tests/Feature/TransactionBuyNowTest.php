<?php

namespace Tests\Feature;

use App\Models\Bid;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
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
        $this->assertNotNull($transaction->transaction_package_id);
        $this->assertSame('sold', $listing->fresh()->status);
    }

    public function test_buyer_can_combine_same_seller_transactions_into_one_package(): void
    {
        Notification::fake();

        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $firstListing = $this->createListing($seller, [
            'price' => 3000,
            'shipping_payer' => 'buyer',
            'shipping_cost_type' => 'fixed',
            'shipping_cost' => 800,
        ]);
        $secondListing = $this->createListing($seller, [
            'price' => 5000,
            'shipping_payer' => 'buyer',
            'shipping_cost_type' => 'fixed',
            'shipping_cost' => 1200,
        ]);

        $this->actingAs($buyer)->post(route('listings.buy-now', $firstListing));
        $this->actingAs($buyer)->post(route('listings.buy-now', $secondListing));
        $transactions = Transaction::orderBy('id')->get();

        $this->assertNotSame(
            $transactions[0]->transaction_package_id,
            $transactions[1]->transaction_package_id,
        );

        $this->actingAs($buyer)
            ->post(route('transactions.packages.consolidate'), [
                'transaction_ids' => $transactions->pluck('id')->all(),
                'mode' => 'combine',
            ])
            ->assertSessionHasNoErrors();

        $transactions = Transaction::orderBy('id')->get();
        $this->assertSame(
            $transactions[0]->transaction_package_id,
            $transactions[1]->transaction_package_id,
        );
        $this->assertDatabaseHas('transaction_packages', [
            'id' => $transactions[0]->transaction_package_id,
            'shipping_cost_type' => 'fixed',
            'shipping_cost' => 1200,
        ]);
    }

    public function test_consolidation_rejects_different_sellers(): void
    {
        Notification::fake();

        $buyer = User::factory()->create();
        $firstListing = $this->createListing(User::factory()->create(), ['price' => 3000]);
        $secondListing = $this->createListing(User::factory()->create(), ['price' => 5000]);

        $this->actingAs($buyer)->post(route('listings.buy-now', $firstListing));
        $this->actingAs($buyer)->post(route('listings.buy-now', $secondListing));

        $this->actingAs($buyer)
            ->post(route('transactions.packages.consolidate'), [
                'transaction_ids' => Transaction::pluck('id')->all(),
                'mode' => 'combine',
            ])
            ->assertSessionHasErrors('transaction_ids');
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
        $this->assertSame(Transaction::TYPE_BUY_NOW, $transaction->purchase_type);
        $this->assertSame('sold', $listing->fresh()->status);
    }

    public function test_bidder_who_buys_auction_now_sees_one_won_item_and_transaction_on_listing(): void
    {
        Notification::fake();

        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = $this->createListing($seller, [
            'price' => 5000,
            'buy_now_price' => 9000,
            'is_auction' => true,
            'auction_end_date' => now()->subMinute(),
            'current_high_bid' => 6500,
        ]);

        Bid::create([
            'listing_id' => $listing->id,
            'user_id' => $buyer->id,
            'amount' => 6500,
        ]);

        $this->actingAs($buyer)->post(route('listings.buy-now', $listing));
        $transaction = Transaction::firstOrFail();

        $this->actingAs($buyer)
            ->get(route('dashboard.won-items'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('items', 1)
                ->where('items.0.id', $listing->id)
                ->where('items.0.transaction_id', $transaction->id)
                ->where('items.0.price', 9000)
                ->where('items.0.type', 'purchase')
            );

        $this->actingAs($buyer)
            ->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('listing.display_price', 9000)
                ->where('transaction.id', $transaction->id)
                ->where('transaction.amount', 9000)
                ->where('transaction.purchase_type', Transaction::TYPE_BUY_NOW)
            );
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

    public function test_guest_buy_now_does_not_redirect_to_login(): void
    {
        Notification::fake();

        $seller = User::factory()->create();
        $listing = $this->createListing($seller, [
            'price' => 12500,
            'buy_now_price' => null,
            'is_auction' => false,
        ]);

        $response = $this->from(route('listings.show', $listing))->post(route('listings.buy-now', $listing));

        $response
            ->assertRedirect(route('listings.show', $listing))
            ->assertSessionHasErrors('auth');

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
