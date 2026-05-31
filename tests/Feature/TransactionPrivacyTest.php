<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TransactionPrivacyTest extends TestCase
{
    use RefreshDatabase;

    public function test_transaction_participants_can_see_each_others_full_names(): void
    {
        $buyer = User::factory()->create(['name' => 'Buyer Person']);
        $seller = User::factory()->create(['name' => 'Seller Person']);
        $transaction = Transaction::create([
            'listing_id' => $this->createListing($seller)->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'amount' => 1000,
            'status' => Transaction::STATUS_PENDING_PAYMENT,
        ]);

        $this->actingAs($buyer)
            ->get(route('transactions.show', $transaction))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('transactions/show')
                ->where('transaction.buyer.name', 'Buyer Person')
                ->where('transaction.seller.name', 'Seller Person')
            );
    }

    public function test_transaction_viewers_outside_the_transaction_see_masked_names(): void
    {
        $buyer = User::factory()->create(['name' => 'Buyer Person']);
        $seller = User::factory()->create(['name' => 'Seller Person']);
        $transaction = Transaction::create([
            'listing_id' => $this->createListing($seller)->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'amount' => 1000,
            'status' => Transaction::STATUS_PENDING_PAYMENT,
        ]);

        $this->actingAs(User::factory()->create())
            ->get(route('transactions.show', $transaction))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('transactions/show')
                ->where('transaction.buyer.name', 'B**** P****')
                ->where('transaction.seller.name', 'S**** P****')
            );
    }

    private function createListing(User $seller): Listing
    {
        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics-'.uniqid(),
        ]);

        return Listing::factory()->create([
            'user_id' => $seller->id,
            'category_id' => $category->id,
        ]);
    }
}
