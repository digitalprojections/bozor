<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        if ($users->isEmpty()) {
            $users = User::factory()->count(10)->create();
        }

        $categories = Category::all();

        foreach (range(1, 50) as $index) {
            Listing::create([
                'user_id' => $users->random()->id,
                'title' => 'Sample Listing ' . $index,
                'description' => 'This is a sample description for listing ' . $index . '. It contains some details about the item being sold.',
                'price' => rand(1000, 50000),
                'status' => 'active',
                'location' => 'Tokyo, Japan',
                'shipping_payer' => 'seller',
                'shipping_method' => 'kuroneko_yamato',
                'shipping_cost_type' => 'free',
                'shipping_cost' => 0,
                'condition' => 'used_good',
                'images' => [],
            ])->categories()->attach(
                $categories->random(rand(1, 2))->pluck('id')->toArray()
            );
        }
    }
}
