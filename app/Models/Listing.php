<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'price',
        'status',
        'images',
        'location',
        'views',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
    ];

    protected $appends = ['main_image_url', 'all_image_urls'];

    /**
     * Get the URL for the first image
     */
    public function getMainImageUrlAttribute(): ?string
    {
        if (empty($this->images) || !isset($this->images[0])) {
            return null;
        }

        return asset('storage/' . $this->images[0]);
    }

    /**
     * Get all image URLs
     */
    public function getAllImageUrlsAttribute(): array
    {
        if (empty($this->images)) {
            return [];
        }

        return array_map(fn($path) => asset('storage/' . $path), $this->images);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get all categories for this listing (many-to-many)
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
