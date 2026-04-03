<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'avatar_style',
        'avatar_seed',
        'gender',
        'is_guest',
        'guest_id',
        'terms_accepted_at',
        'store_name',
        'store_description',
        'store_banner',
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
        ];
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    public function soldListings()
    {
        return $this->hasMany(Listing::class)->where('status', 'sold');
    }

    public function verificationRequests()
    {
        return $this->hasMany(VerificationRequest::class);
    }

    public function latestVerificationRequest()
    {
        return $this->hasOne(VerificationRequest::class)->latestOfMany();
    }

    public function isVerified(): bool
    {
        return (bool)$this->is_verified;
    }

    /**
     * Get the avatar URL (uploaded or generated)
     */
    public function getAvatarUrlAttribute(): string
    {
        return \App\Helpers\AvatarHelper::getAvatarUrl($this);
    }

    public function givenRatings()
    {
        return $this->hasMany(Rating::class , 'rater_id');
    }

    public function receivedRatings()
    {
        return $this->hasMany(Rating::class , 'rated_user_id');
    }

    public function getAverageRatingAttribute()
    {
        return $this->receivedRatings()->avg('score') ?: 0;
    }

    public function getRatingsCountAttribute()
    {
        return $this->receivedRatings()->count();
    }

    public function watchedListings()
    {
        return $this->belongsToMany(Listing::class , 'watchlists')->withTimestamps();
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
            if (empty($part)) return '';
            return mb_substr($part, 0, 1) . '****';
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

    /**
     * Get the store banner URL
     */
    public function getStoreBannerUrlAttribute(): ?string
    {
        return $this->store_banner 
            ? \Illuminate\Support\Facades\Storage::disk('public')->url($this->store_banner) 
            : null;
    }
}
