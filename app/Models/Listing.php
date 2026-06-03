<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    public const BID_INCREMENT_PERCENT = 0.05;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'price',
        'reserve_price',
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
        'shipping_payer',
        'shipping_method',
        'shipping_cost_type',
        'shipping_cost',
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
        'reserve_price' => 'integer',
        'buy_now_price' => 'integer',
        'is_auction' => 'boolean',
        'auction_end_date' => 'datetime',
        'current_high_bid' => 'integer',
        'shipping_cost' => 'integer',
        'ad_starts_at' => 'datetime',
        'ad_ends_at' => 'datetime',
        'ad_priority' => 'integer',
        'ad_price_jpy' => 'integer',
        'ad_budget_jpy' => 'integer',
        'ad_impressions' => 'integer',
        'ad_clicks' => 'integer',
        'views' => 'integer',
    ];

    protected $appends = [
        'main_image_url',
        'all_image_urls',
        'highest_bid_amount',
        'current_price',
        'display_price',
        'free_shipping',
        'reserve_met',
        'auction_ended',
    ];

    protected $hidden = [
        'reserve_price',
    ];

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

    public function hasBids(): bool
    {
        if ($this->relationLoaded('bids')) {
            return $this->bids->isNotEmpty();
        }

        if (array_key_exists('bids_count', $this->attributes)) {
            return (int) $this->attributes['bids_count'] > 0;
        }

        return $this->bids()->exists();
    }

    public function highestBidAmount(): int
    {
        if ($this->relationLoaded('bids')) {
            return (int) ($this->bids->max('amount') ?? 0);
        }

        if (array_key_exists('bids_max_amount', $this->attributes)) {
            return (int) ($this->attributes['bids_max_amount'] ?? 0);
        }

        return (int) ($this->bids()->max('amount') ?? 0);
    }

    public function currentPrice(): int
    {
        if (! $this->is_auction) {
            return (int) $this->price;
        }

        return max((int) $this->price, $this->highestBidAmount());
    }

    public function getHighestBidAmountAttribute(): int
    {
        return $this->highestBidAmount();
    }

    public function getCurrentPriceAttribute(): int
    {
        return $this->currentPrice();
    }

    public function getDisplayPriceAttribute(): int
    {
        return $this->currentPrice();
    }

    public function hasFreeShipping(): bool
    {
        return $this->shipping_payer === 'seller'
            || $this->shipping_cost_type === 'free'
            || (int) ($this->shipping_cost ?? -1) === 0;
    }

    public function getFreeShippingAttribute(): bool
    {
        return $this->hasFreeShipping();
    }

    public function minimumBidAmount(): int
    {
        $currentPrice = $this->currentPrice();
        $increment = max(1, (int) ceil($currentPrice * self::BID_INCREMENT_PERCENT));

        return $currentPrice + $increment;
    }

    public function hasReservePrice(): bool
    {
        return $this->is_auction && $this->reserve_price !== null;
    }

    public function reserveMet(): bool
    {
        if (! $this->hasReservePrice()) {
            return true;
        }

        return $this->highestBidAmount() >= (int) $this->reserve_price;
    }

    public function getReserveMetAttribute(): bool
    {
        return $this->reserveMet();
    }

    public function auctionCanSell(): bool
    {
        return $this->is_auction
            && $this->auction_end_date !== null
            && $this->auctionEnded()
            && $this->highestBidAmount() > 0
            && $this->reserveMet();
    }

    public function auctionEnded(): bool
    {
        return $this->is_auction
            && $this->auction_end_date !== null
            && $this->auction_end_date->lte(now());
    }

    public function getAuctionEndedAttribute(): bool
    {
        return $this->auctionEnded();
    }

    public function watchedBy()
    {
        return $this->belongsToMany(User::class, 'watchlists')->withTimestamps();
    }

    public function scopeItems($query)
    {
        return $query->where('listing_type', 'item');
    }

    public function scopeFreeShipping($query)
    {
        return $query->where(function ($query) {
            $query->where('shipping_payer', 'seller')
                ->orWhere('shipping_cost_type', 'free')
                ->orWhere('shipping_cost', 0);
        });
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
