<?php

namespace App\Models;

use App\Helpers\AvatarHelper;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'is_verified',
        'verified_at',
        'password',
        'avatar',
        'google_avatar',
        'avatar_source',
        'avatar_style',
        'avatar_seed',
        'gender',
        'is_guest',
        'guest_id',
        'terms_accepted_at',
        'store_name',
        'store_description',
        'store_banner',
        'postal_code',
        'prefecture',
        'city',
        'address_line1',
        'address_line2',
        'phone',
        'disabled_at',
        'disabled_reason',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
        'masked_name',
        'has_accepted_terms',
        'has_local_password',
        'store_banner_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'terms_accepted_at' => 'datetime',
            'disabled_at' => 'datetime',
        ];
    }

    public function listings()
    {
        return $this->hasMany(Listing::class)->where('listing_type', 'item');
    }

    public function advertiserProfile()
    {
        return $this->hasOne(AdvertiserProfile::class);
    }

    public function adCampaigns()
    {
        return $this->hasMany(AdCampaign::class);
    }

    public function adOrders()
    {
        return $this->hasMany(AdOrder::class);
    }

    public function soldListings()
    {
        return $this->hasMany(Listing::class)
            ->where('listing_type', 'item')
            ->where('status', 'sold');
    }

    public function verificationRequests()
    {
        return $this->hasMany(VerificationRequest::class);
    }

    public function reportsFiled()
    {
        return $this->hasMany(ListingReport::class, 'reporter_id');
    }

    public function reportsReceived()
    {
        return $this->hasMany(ListingReport::class, 'reported_user_id');
    }

    public function listingQuestions()
    {
        return $this->hasMany(ListingMessage::class, 'questioner_id');
    }

    public function listingAnswers()
    {
        return $this->hasMany(ListingMessage::class, 'seller_id');
    }

    public function isDisabled(): bool
    {
        return $this->disabled_at !== null;
    }

    public function purchases()
    {
        return $this->hasMany(Transaction::class, 'buyer_id');
    }

    public function sales()
    {
        return $this->hasMany(Transaction::class, 'seller_id');
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'user_follows', 'follower_id', 'followed_id')
            ->withTimestamps();
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'user_follows', 'followed_id', 'follower_id')
            ->withTimestamps();
    }

    public function hasTransactionWith(User|int $user): bool
    {
        $userId = $user instanceof User ? $user->id : $user;

        return Transaction::query()
            ->where(function ($query) use ($userId) {
                $query->where('buyer_id', $this->id)
                    ->where('seller_id', $userId);
            })
            ->orWhere(function ($query) use ($userId) {
                $query->where('buyer_id', $userId)
                    ->where('seller_id', $this->id);
            })
            ->exists();
    }

    public function latestVerificationRequest()
    {
        return $this->hasOne(VerificationRequest::class)->latestOfMany();
    }

    public function isVerified(): bool
    {
        return (bool) $this->is_verified;
    }

    /**
     * Get the avatar URL (uploaded or generated)
     */
    public function getAvatarUrlAttribute(): string
    {
        return AvatarHelper::getAvatarUrl($this);
    }

    public function givenRatings()
    {
        return $this->hasMany(Rating::class, 'rater_id');
    }

    public function receivedRatings()
    {
        return $this->hasMany(Rating::class, 'rated_user_id');
    }

    public function getAverageRatingAttribute()
    {
        return (float) ($this->receivedRatings()->avg('score') ?: 0);
    }

    public function getRatingsCountAttribute()
    {
        return $this->receivedRatings()->count();
    }

    public function watchedListings()
    {
        return $this->belongsToMany(Listing::class, 'watchlists')
            ->where('listing_type', 'item')
            ->withTimestamps();
    }

    /**
     * Get the masked name (e.g., "John Doe" -> "J**** D****")
     */
    public function getMaskedNameAttribute(): string
    {
        if ($this->is_guest) {
            return $this->name;
        }

        // If the authenticated user is THIS user, show full name
        if (auth()->check() && auth()->id() === $this->id) {
            return $this->name;
        }

        $parts = explode(' ', $this->name);
        $maskedParts = array_map(function ($part) {
            if (empty($part)) {
                return '';
            }

            return mb_substr($part, 0, 1).'****';
        }, $parts);

        return implode(' ', $maskedParts);
    }

    /**
     * Check if the user has accepted the terms of use
     */
    public function getHasAcceptedTermsAttribute(): bool
    {
        return $this->terms_accepted_at !== null;
    }

    public function getHasLocalPasswordAttribute(): bool
    {
        return filled($this->password);
    }

    /**
     * Get the store banner URL
     */
    public function getStoreBannerUrlAttribute(): ?string
    {
        return $this->store_banner
            ? Storage::disk('public')->url($this->store_banner)
            : null;
    }
}
