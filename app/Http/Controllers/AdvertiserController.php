<?php

namespace App\Http\Controllers;

use App\Models\AdvertiserProfile;
use Illuminate\Http\Request;

class AdvertiserController extends Controller
{
    public function index(Request $request)
    {
        $profile = $request->user()->advertiserProfile()
            ->with(['campaigns.order'])
            ->first();

        return inertia('advertising/index', [
            'advertiserProfile' => $profile,
            'packages' => config('advertising.packages'),
            'placements' => config('advertising.placements'),
        ]);
    }

    public function apply(Request $request)
    {
        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:500'],
            'contact_email' => ['required', 'email', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:32'],
            'business_description' => ['required', 'string', 'max:2000'],
        ]);

        $profile = $request->user()->advertiserProfile;

        if ($profile && $profile->status === AdvertiserProfile::STATUS_APPROVED) {
            return back()->withErrors([
                'business_name' => __('Your advertiser account is already approved.'),
            ]);
        }

        $request->user()->advertiserProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                ...$validated,
                'status' => AdvertiserProfile::STATUS_PENDING,
                'admin_notes' => null,
                'reviewed_at' => null,
                'reviewed_by' => null,
            ],
        );

        return back()->with('success', __('Advertiser application submitted.'));
    }
}
