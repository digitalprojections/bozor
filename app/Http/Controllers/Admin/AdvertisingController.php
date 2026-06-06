<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdCampaign;
use App\Models\AdOrder;
use App\Models\AdvertiserProfile;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdvertisingController extends Controller
{
    public function index(Request $request)
    {
        $profileStatus = $request->query('profile_status', 'pending');
        $campaignStatus = $request->query('campaign_status', 'open');

        $profiles = AdvertiserProfile::query()
            ->with('user:id,name,email,is_verified,email_verified_at')
            ->when($profileStatus !== 'all', fn ($query) => $query->where('status', $profileStatus))
            ->latest()
            ->paginate(10, ['*'], 'profiles_page')
            ->withQueryString();

        $campaigns = AdCampaign::query()
            ->with(['advertiserProfile.user:id,name,email', 'order'])
            ->when($campaignStatus === 'open', function ($query) {
                $query->whereIn('status', [
                    AdCampaign::STATUS_PENDING_PAYMENT,
                    AdCampaign::STATUS_PENDING_REVIEW,
                    AdCampaign::STATUS_SCHEDULED,
                    AdCampaign::STATUS_ACTIVE,
                ]);
            })
            ->when($campaignStatus !== 'open' && $campaignStatus !== 'all', fn ($query) => $query->where('status', $campaignStatus))
            ->latest()
            ->paginate(10, ['*'], 'campaigns_page')
            ->withQueryString();

        return inertia('admin/advertising/index', [
            'profiles' => $profiles,
            'campaigns' => $campaigns,
            'filters' => [
                'profile_status' => $profileStatus,
                'campaign_status' => $campaignStatus,
            ],
            'packages' => config('advertising.packages'),
            'placements' => config('advertising.placements'),
        ]);
    }

    public function updateProfile(Request $request, AdvertiserProfile $profile)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([
                AdvertiserProfile::STATUS_PENDING,
                AdvertiserProfile::STATUS_APPROVED,
                AdvertiserProfile::STATUS_REJECTED,
                AdvertiserProfile::STATUS_SUSPENDED,
            ])],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $profile->update([
            ...$validated,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return back()->with('success', __('Advertiser profile updated.'));
    }

    public function updateCampaign(Request $request, AdCampaign $campaign)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([
                AdCampaign::STATUS_PENDING_PAYMENT,
                AdCampaign::STATUS_PENDING_REVIEW,
                AdCampaign::STATUS_SCHEDULED,
                AdCampaign::STATUS_ACTIVE,
                AdCampaign::STATUS_PAUSED,
                AdCampaign::STATUS_REJECTED,
                AdCampaign::STATUS_EXPIRED,
            ])],
            'order_status' => ['required', Rule::in([
                AdOrder::STATUS_UNPAID,
                AdOrder::STATUS_PENDING_CONFIRMATION,
                AdOrder::STATUS_PAID,
                AdOrder::STATUS_CANCELLED,
                AdOrder::STATUS_REFUNDED,
            ])],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'priority' => ['required', 'integer', 'min:0', 'max:1000'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $startsAt = filled($validated['starts_at'] ?? null) ? CarbonImmutable::parse($validated['starts_at']) : null;
        $endsAt = filled($validated['ends_at'] ?? null) ? CarbonImmutable::parse($validated['ends_at']) : null;

        $campaign->update([
            'status' => $validated['status'],
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'priority' => (int) $validated['priority'],
            'admin_notes' => $validated['admin_notes'] ?? null,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        $campaign->order()->update([
            'status' => $validated['order_status'],
            'paid_at' => $validated['order_status'] === AdOrder::STATUS_PAID
                ? ($campaign->order?->paid_at ?? now())
                : null,
            'confirmed_by' => $validated['order_status'] === AdOrder::STATUS_PAID
                ? $request->user()->id
                : null,
        ]);

        return back()->with('success', __('Ad campaign updated.'));
    }
}
