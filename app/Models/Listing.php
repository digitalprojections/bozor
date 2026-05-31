<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

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
        'condition',
        'buy_now_price',
        'is_auction',
        'auction_end_date',
        'current_high_bid',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'integer',
        'buy_now_price' => 'integer',
        'is_auction' => 'boolean',
        'auction_end_date' => 'datetime',
        'current_high_bid' => 'integer',
        'views' => 'integer',
    ];

    protected $appends = ['main_image_url', 'all_image_urls'];

    /**
     * Get the URL for the first image
     */
    public function getMainImageUrlAttribute(): ?string
    {
        $images = $this->validImages();

        if (empty($images)) {
            return null;
        }

        return $this->imageUrl($images[0]);
    }

    /**
     * Get all image URLs
     */
    public function getAllImageUrlsAttribute(): array
    {
        return array_map(fn ($path) => $this->imageUrl($path), $this->validImages());
    }

    private function imageUrl(string $path): string
    {
        return asset('storage/'.$path);
    }

    private function validImages(): array
    {
        if (empty($this->images)) {
            return [];
        }

        return array_values(array_filter(
            $this->images,
            fn ($path) => is_string($path) && $path !== ''
        ));
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

    public function bids()
    {
        return $this->hasMany(Bid::class)->orderBy('amount', 'desc');
    }

    public function watchedBy()
    {
        return $this->belongsToMany(User::class, 'watchlists')->withTimestamps();
    }
}
