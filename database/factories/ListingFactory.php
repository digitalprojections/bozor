<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Listing>
 */
class ListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(3),
            'price' => $this->faker->numberBetween(500, 50000),
            'status' => 'active',
            'images' => [],
            'location' => $this->faker->city(),
            'condition' => $this->faker->randomElement(['new', 'used_like_new', 'used_good', 'used_fair']),
            'is_auction' => false,
            'views' => $this->faker->numberBetween(0, 500),
        ];
    }
}
