<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\ListingReport;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ListingReportController extends Controller
{
    public function store(Request $request, Listing $listing)
    {
        if ((int) $listing->user_id === (int) $request->user()->id) {
            throw ValidationException::withMessages([
                'report' => __('You cannot report your own listing.'),
            ]);
        }

        $validated = $request->validate([
            'reason' => ['required', Rule::in(ListingReport::REASONS)],
            'details' => ['required', 'string', 'min:20', 'max:2000'],
            'acknowledged' => ['accepted'],
        ]);

        $existingReport = ListingReport::query()
            ->where('listing_id', $listing->id)
            ->where('reporter_id', $request->user()->id)
            ->whereIn('status', [ListingReport::STATUS_PENDING, ListingReport::STATUS_REVIEWING])
            ->first();

        if ($existingReport) {
            return back()->with('success', __('Your existing report is already waiting for review.'));
        }

        ListingReport::create([
            'listing_id' => $listing->id,
            'reporter_id' => $request->user()->id,
            'reported_user_id' => $listing->user_id,
            'reason' => $validated['reason'],
            'details' => $validated['details'],
        ]);

        return back()->with('success', __('Report submitted for admin review.'));
    }
}
