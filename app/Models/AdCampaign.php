<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class AdCampaign extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING_PAYMENT = 'pending_payment';
    public const STATUS_PENDING_REVIEW = 'pending_review';
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_PAUSED = 'paused';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_EXPIRED = 'expired';

    protected $fillable = [
        'advertiser_profile_id',
        'user_id',
        'title',
        'description',
        'image_path',
        'target_url',
        'placement',
        'package_key',
        'status',
        'starts_at',
        'ends_at',
        'priority',
        'price_jpy',
        'admin_notes',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'priority' => 'integer',
        'price_jpy' => 'integer',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = [
        'image_url',
    ];

    public function advertiserProfile()
    {
        return $this->belongsTo(AdvertiserProfile::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->hasOne(AdOrder::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }

    public function scopeDisplayable($query, ?string $placement = null)
    {
        $query->where('status', self::STATUS_ACTIVE)
            ->whereHas('order', fn ($query) => $query->where('status', AdOrder::STATUS_PAID))
            ->where(function ($query) {
                $query->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', now());
            });

        if ($placement) {
            $query->where('placement', $placement);
        }

        return $query;
    }
}
