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
        'listing_type',
        'ad_placement',
        'ad_target_url',
        'ad_starts_at',
        'ad_ends_at',
        'ad_priority',
        'ad_price_jpy',
        'ad_budget_jpy',
        'ad_impressions',
        'ad_clicks',
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
        'ad_starts_at' => 'datetime',
        'ad_ends_at' => 'datetime',
        'ad_priority' => 'integer',
        'ad_price_jpy' => 'integer',
        'ad_budget_jpy' => 'integer',
        'ad_impressions' => 'integer',
        'ad_clicks' => 'integer',
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

    public function scopeItems($query)
    {
        return $query->where('listing_type', 'item');
    }

    public function scopeAdvertisements($query)
    {
        return $query->where('listing_type', 'advertisement');
    }

    public function scopeActiveAdvertisements($query, ?string $placement = null)
    {
        $query->advertisements()
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('ad_starts_at')
                    ->orWhere('ad_starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ad_ends_at')
                    ->orWhere('ad_ends_at', '>=', now());
            });

        if ($placement) {
            $query->where('ad_placement', $placement);
        }

        return $query;
    }

    public function isAdvertisement(): bool
    {
        return $this->listing_type === 'advertisement';
    }
}
