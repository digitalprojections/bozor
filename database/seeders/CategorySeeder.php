<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing categories
        Category::query()->delete();

        // Electronics & Technology
        $electronics = Category::firstOrCreate(['slug' => 'electronics'], ['name' => 'Electronics']);
        $this->createSubcategories($electronics, [
            'Mobile Phones',
            'Computers & Laptops',
            'Tablets',
            'Cameras & Photography',
            'Audio & Headphones',
            'Smart Watches',
            'Gaming Consoles',
            'Smart Home Devices',
        ]);

        // Fashion & Accessories
        $fashion = Category::firstOrCreate(['slug' => 'fashion'], ['name' => 'Fashion & Accessories']);
        $this->createSubcategories($fashion, [
            'Men\'s Clothing',
            'Women\'s Clothing',
            'Kids Clothing',
            'Shoes & Footwear',
            'Bags & Luggage',
            'Watches & Jewelry',
            'Sunglasses',
            'Accessories',
        ]);

        // Home & Living
        $home = Category::firstOrCreate(['slug' => 'home-living'], ['name' => 'Home & Living']);
        $this->createSubcategories($home, [
            'Furniture',
            'Home Decor',
            'Kitchen & Dining',
            'Bedding & Bath',
            'Garden & Outdoor',
            'Tools & Hardware',
            'Lighting',
            'Storage & Organization',
        ]);

        // Sports & Outdoors
        $sports = Category::firstOrCreate(['slug' => 'sports'], ['name' => 'Sports & Outdoors']);
        $this->createSubcategories($sports, [
            'Sports Equipment',
            'Fitness & Gym',
            'Cycling',
            'Camping & Hiking',
            'Water Sports',
            'Winter Sports',
            'Team Sports',
        ]);

        // Vehicles
        $vehicles = Category::firstOrCreate(['slug' => 'vehicles'], ['name' => 'Vehicles']);
        $this->createSubcategories($vehicles, [
            'Cars',
            'Motorcycles',
            'Bicycles',
            'Scooters',
            'Auto Parts',
            'Accessories',
        ]);

        // Books, Music & Media
        $media = Category::firstOrCreate(['slug' => 'media'], ['name' => 'Books, Music & Media']);
        $this->createSubcategories($media, [
            'Books',
            'Music & Instruments',
            'Movies & DVDs',
            'Video Games',
            'Vinyl Records',
            'Sheet Music',
        ]);

        // Hobbies & Collectibles
        $hobbies = Category::firstOrCreate(['slug' => 'hobbies'], ['name' => 'Hobbies & Collectibles']);
        $this->createSubcategories($hobbies, [
            'Art & Crafts',
            'Collectibles',
            'Toys & Games',
            'Trading Cards',
            'Model Kits',
            'Board Games',
            'Puzzles',
        ]);

        // Baby & Kids
        $baby = Category::firstOrCreate(['slug' => 'baby-kids'], ['name' => 'Baby & Kids']);
        $this->createSubcategories($baby, [
            'Baby Clothing',
            'Baby Gear',
            'Kids Toys',
            'Nursery Furniture',
            'Strollers & Car Seats',
        ]);

        // Health & Beauty
        $beauty = Category::firstOrCreate(['slug' => 'health-beauty'], ['name' => 'Health & Beauty']);
        $this->createSubcategories($beauty, [
            'Skincare',
            'Makeup & Cosmetics',
            'Haircare',
            'Fragrances',
            'Health Supplements',
            'Personal Care',
        ]);

        // Pet Supplies
        $pets = Category::firstOrCreate(['slug' => 'pets'], ['name' => 'Pet Supplies']);
        $this->createSubcategories($pets, [
            'Pet Food',
            'Pet Toys',
            'Pet Accessories',
            'Pet Grooming',
            'Pet Health',
        ]);

        // Office & Stationery
        $office = Category::firstOrCreate(['slug' => 'office'], ['name' => 'Office & Stationery']);
        $this->createSubcategories($office, [
            'Office Supplies',
            'Stationery',
            'Office Furniture',
            'Printers & Scanners',
        ]);

        // Food & Beverages
        $food = Category::firstOrCreate(['slug' => 'food'], ['name' => 'Food & Beverages']);
        $this->createSubcategories($food, [
            'Groceries',
            'Snacks & Sweets',
            'Beverages',
            'Specialty Foods',
        ]);

        // Services
        $services = Category::firstOrCreate(['slug' => 'services'], ['name' => 'Services']);
        $this->createSubcategories($services, [
            'Professional Services',
            'Home Services',
            'Tutoring & Education',
            'Event Services',
        ]);

        // Other
        Category::firstOrCreate(['slug' => 'antiques'], ['name' => 'Antiques & Vintage']);
        Category::firstOrCreate(['slug' => 'free-stuff'], ['name' => 'Free Stuff']);
        Category::firstOrCreate(['slug' => 'other'], ['name' => 'Other']);
    }

    private function createSubcategories(Category $parent, array $names): void
    {
        foreach ($names as $name) {
            $slug = \Illuminate\Support\Str::slug($name);
            Category::firstOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'parent_id' => $parent->id]
            );
        }
    }
}
