<?php

namespace App\Http\Controllers;

use App\Models\AdCampaign;
use App\Models\AdOrder;
use App\Models\AdvertiserProfile;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AdCampaignController extends Controller
{
    public function create(Request $request)
    {
        $profile = $this->approvedProfile($request);

        return inertia('advertising/create', [
            'advertiserProfile' => $profile,
            'packages' => config('advertising.packages'),
            'placements' => config('advertising.placements'),
        ]);
    }

    public function store(Request $request)
    {
        $profile = $this->approvedProfile($request);
        $packages = config('advertising.packages');

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:500'],
            'target_url' => ['required', 'url', 'max:500'],
            'package_key' => ['required', Rule::in(array_keys($packages))],
            'starts_at' => ['nullable', 'date', 'after_or_equal:today'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $package = $packages[$validated['package_key']];
        $startsAt = filled($validated['starts_at'] ?? null)
            ? CarbonImmutable::parse($validated['starts_at'])->startOfDay()
            : null;
        $endsAt = $startsAt?->addDays((int) $package['duration_days']);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('ads', 'public');
        }

        $campaign = AdCampaign::create([
            'advertiser_profile_id' => $profile->id,
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'target_url' => $validated['target_url'],
            'image_path' => $imagePath,
            'placement' => $package['placement'],
            'package_key' => $validated['package_key'],
            'status' => AdCampaign::STATUS_PENDING_PAYMENT,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'price_jpy' => (int) $package['price_jpy'],
        ]);

        $campaign->order()->create([
            'user_id' => $request->user()->id,
            'amount_jpy' => (int) $package['price_jpy'],
            'status' => AdOrder::STATUS_UNPAID,
        ]);

        return redirect()->route('advertising.index')->with('success', __('Ad request created.'));
    }

    public function submitPayment(Request $request, AdCampaign $campaign)
    {
        $this->ensureCampaignOwner($request, $campaign);

        $validated = $request->validate([
            'payment_reference' => ['required', 'string', 'max:255'],
        ]);

        $campaign->order()->update([
            'status' => AdOrder::STATUS_PENDING_CONFIRMATION,
            'payment_reference' => $validated['payment_reference'],
        ]);

        $campaign->update([
            'status' => AdCampaign::STATUS_PENDING_REVIEW,
        ]);

        return back()->with('success', __('Payment reference submitted for confirmation.'));
    }

    public function destroy(Request $request, AdCampaign $campaign)
    {
        $this->ensureCampaignOwner($request, $campaign);

        if (in_array($campaign->status, [AdCampaign::STATUS_ACTIVE, AdCampaign::STATUS_SCHEDULED], true)) {
            return back()->withErrors([
                'campaign' => __('Active or scheduled ads cannot be deleted.'),
            ]);
        }

        if ($campaign->image_path) {
            Storage::disk('public')->delete($campaign->image_path);
        }

        $campaign->delete();

        return back()->with('success', __('Ad request deleted.'));
    }

    private function approvedProfile(Request $request): AdvertiserProfile
    {
        $profile = $request->user()->advertiserProfile;

        if (! $profile || ! $profile->isApproved()) {
            throw ValidationException::withMessages([
                'advertiser' => __('Your advertiser account must be approved before creating ads.'),
            ]);
        }

        return $profile;
    }

    private function ensureCampaignOwner(Request $request, AdCampaign $campaign): void
    {
        if ((int) $campaign->user_id !== (int) $request->user()->id) {
            abort(403);
        }
    }
}
