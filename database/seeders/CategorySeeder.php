<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Electronics & Technology
        $electronics = Category::updateOrCreate(['slug' => 'electronics'], ['name' => 'Electronics']);
        $this->createSubcategories($electronics, [
            'Mobile Phones',
            'Cell Phone Accessories',
            'Computers & Laptops',
            'Tablets',
            'Cameras & Photography',
            'TV & Video',
            'Audio & Headphones',
            'Speakers',
            'Smart Watches',
            'Wearables',
            'Gaming Consoles',
            'PC Gaming',
            'Smart Home Devices',
            'Drones',
            'Home Appliances',
            'Air Conditioning',
        ]);

        // Fashion mirrors Mercari's broad clothing-first structure while keeping one searchable root.
        $fashion = Category::updateOrCreate(['slug' => 'fashion'], ['name' => 'Fashion']);
        $this->createSubcategories($fashion, [
            'Women Clothing',
            'Women Shoes',
            'Women Bags',
            'Women Accessories',
            'Men Clothing',
            'Men Shoes',
            'Men Bags',
            'Men Accessories',
            'Kids Clothing',
            'Jewelry',
            'Watches',
            'Sunglasses',
            'Traditional Clothing',
            'Maternity',
        ]);

        // Home & Living
        $home = Category::updateOrCreate(['slug' => 'home-living'], ['name' => 'Home & Living']);
        $this->createSubcategories($home, [
            'Furniture',
            'Home Decor',
            'Kitchen & Dining',
            'Bedding & Bath',
            'Rugs & Carpets',
            'Curtains & Blinds',
            'Garden & Outdoor',
            'Tools & Hardware',
            'Lighting',
            'Storage & Organization',
            'Cleaning Supplies',
        ]);

        // Sports & Outdoors
        $sports = Category::updateOrCreate(['slug' => 'sports'], ['name' => 'Sports & Outdoors']);
        $this->createSubcategories($sports, [
            'Sports Equipment',
            'Fitness & Gym',
            'Cycling',
            'Golf',
            'Fishing',
            'Camping & Hiking',
            'Water Sports',
            'Winter Sports',
            'Team Sports',
            'Outdoor Clothing',
        ]);

        // Vehicles
        $vehicles = Category::updateOrCreate(['slug' => 'vehicles'], ['name' => 'Vehicles']);
        $this->createSubcategories($vehicles, [
            'Cars',
            'Motorcycles',
            'Bicycles',
            'Scooters',
            'Auto Parts',
            'Accessories',
            'Car Audio & Navigation',
        ]);

        // Books, Music & Media
        $media = Category::updateOrCreate(['slug' => 'media'], ['name' => 'Books, Music & Media']);
        $this->createSubcategories($media, [
            'Books',
            'Magazines',
            'Manga',
            'Music & Instruments',
            'Movies & DVDs',
            'Blu-ray',
            'Video Games',
            'Vinyl Records',
            'Sheet Music',
        ]);

        // Hobbies & Collectibles
        $hobbies = Category::updateOrCreate(['slug' => 'hobbies'], ['name' => 'Games, Toys & Collectibles']);
        $this->createSubcategories($hobbies, [
            'Art & Crafts',
            'Collectibles',
            'Toys & Games',
            'Character Goods',
            'Anime Figures',
            'Plush Toys',
            'Trading Cards',
            'Model Kits',
            'Board Games',
            'Puzzles',
            'Musical Instruments',
            'Art Supplies',
        ]);

        // Baby & Kids
        $baby = Category::updateOrCreate(['slug' => 'baby-kids'], ['name' => 'Baby & Kids']);
        $this->createSubcategories($baby, [
            'Baby Clothing',
            'Kids Shoes',
            'Baby Gear',
            'Kids Toys',
            'Nursery Furniture',
            'Strollers & Car Seats',
            'Diapering',
            'Feeding',
            'School Supplies',
        ]);

        // Health & Beauty
        $beauty = Category::updateOrCreate(['slug' => 'health-beauty'], ['name' => 'Health & Beauty']);
        $this->createSubcategories($beauty, [
            'Skincare',
            'Makeup & Cosmetics',
            'Haircare',
            'Fragrances',
            'Bath & Body',
            'Nail Care',
            'Beauty Tools',
            'Health Supplements',
            'Personal Care',
        ]);

        // Pet Supplies
        $pets = Category::updateOrCreate(['slug' => 'pets'], ['name' => 'Pet Supplies']);
        $this->createSubcategories($pets, [
            'Pet Food',
            'Pet Toys',
            'Pet Accessories',
            'Pet Grooming',
            'Pet Health',
            'Aquarium Supplies',
            'Bird Supplies',
        ]);

        // Office & Stationery
        $office = Category::updateOrCreate(['slug' => 'office'], ['name' => 'Office & Stationery']);
        $this->createSubcategories($office, [
            'Office Supplies',
            'Stationery',
            'Office Furniture',
            'Printers & Scanners',
            'Craft Paper',
            'Writing Instruments',
        ]);

        // Food & Beverages
        $food = Category::updateOrCreate(['slug' => 'food'], ['name' => 'Food & Beverages']);
        $this->createSubcategories($food, [
            'Groceries',
            'Snacks & Sweets',
            'Beverages',
            'Specialty Foods',
            'Tea & Coffee',
            'Sake & Alcohol',
        ]);

        // Services
        $services = Category::updateOrCreate(['slug' => 'services'], ['name' => 'Services']);
        $this->createSubcategories($services, [
            'Professional Services',
            'Home Services',
            'Tutoring & Education',
            'Event Services',
            'Repair Services',
            'Translation',
        ]);

        // Other
        Category::updateOrCreate(['slug' => 'antiques'], ['name' => 'Antiques & Vintage']);
        Category::updateOrCreate(['slug' => 'free-stuff'], ['name' => 'Free Stuff']);
        Category::updateOrCreate(['slug' => 'other'], ['name' => 'Other']);
    }

    private function createSubcategories(Category $parent, array $names): void
    {
        foreach ($names as $name) {
            $slug = Str::slug($parent->slug.' '.$name);
            $legacySlug = Str::slug($name);

            $category = Category::where('parent_id', $parent->id)
                ->where('name', $name)
                ->first()
                ?? Category::where('slug', $legacySlug)
                    ->where('parent_id', $parent->id)
                    ->first()
                ?? new Category;

            $category->fill([
                'name' => $name,
                'slug' => $slug,
                'parent_id' => $parent->id,
            ])->save();
        }
    }
}
