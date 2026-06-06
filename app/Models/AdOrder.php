<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdOrder extends Model
{
    use HasFactory;

    public const STATUS_UNPAID = 'unpaid';
    public const STATUS_PENDING_CONFIRMATION = 'pending_confirmation';
    public const STATUS_PAID = 'paid';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_REFUNDED = 'refunded';

    protected $fillable = [
        'ad_campaign_id',
        'user_id',
        'amount_jpy',
        'status',
        'payment_reference',
        'paid_at',
        'confirmed_by',
    ];

    protected $casts = [
        'amount_jpy' => 'integer',
        'paid_at' => 'datetime',
    ];

    public function campaign()
    {
        return $this->belongsTo(AdCampaign::class, 'ad_campaign_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function confirmer()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}
