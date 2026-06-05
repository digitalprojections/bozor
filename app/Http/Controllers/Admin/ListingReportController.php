<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Middleware\EnsureAdmin;
use App\Models\Listing;
use App\Models\ListingReport;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ListingReportController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'open');
        $search = trim((string) $request->query('search', ''));

        $reports = ListingReport::query()
            ->with([
                'listing' => fn ($query) => $query->withTrashed(),
                'reporter:id,name,email,disabled_at,is_verified,email_verified_at',
                'reportedUser:id,name,email,disabled_at,is_verified,email_verified_at',
                'reviewer:id,name,email',
            ])
            ->when($status === 'open', fn ($query) => $query->whereIn('status', [
                ListingReport::STATUS_PENDING,
                ListingReport::STATUS_REVIEWING,
            ]))
            ->when($status !== 'open' && $status !== 'all', fn ($query) => $query->where('status', $status))
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('details', 'like', "%{$search}%")
                        ->orWhereHas('listing', fn ($query) => $query->where('title', 'like', "%{$search}%"))
                        ->orWhereHas('reporter', fn ($query) => $query->where('email', 'like', "%{$search}%")->orWhere('name', 'like', "%{$search}%"))
                        ->orWhereHas('reportedUser', fn ($query) => $query->where('email', 'like', "%{$search}%")->orWhere('name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return inertia('admin/reports/index', [
            'reports' => $reports,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'counts' => [
                'pending' => ListingReport::where('status', ListingReport::STATUS_PENDING)->count(),
                'reviewing' => ListingReport::where('status', ListingReport::STATUS_REVIEWING)->count(),
                'resolved' => ListingReport::where('status', ListingReport::STATUS_RESOLVED)->count(),
                'dismissed' => ListingReport::where('status', ListingReport::STATUS_DISMISSED)->count(),
            ],
        ]);
    }

    public function update(Request $request, ListingReport $report)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([
                ListingReport::STATUS_PENDING,
                ListingReport::STATUS_REVIEWING,
                ListingReport::STATUS_RESOLVED,
                ListingReport::STATUS_DISMISSED,
            ])],
            'admin_notes' => ['nullable', 'string', 'max:3000'],
        ]);

        $report->fill($validated);

        if (in_array($validated['status'], [ListingReport::STATUS_RESOLVED, ListingReport::STATUS_DISMISSED], true)) {
            $report->reviewed_by = $request->user()->id;
            $report->reviewed_at = now();
        }

        $report->save();

        return back()->with('success', 'Report review updated.');
    }

    public function listingAction(Request $request, ListingReport $report)
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['activate', 'disable', 'take_down', 'delete'])],
        ]);

        $listing = Listing::withTrashed()->findOrFail($report->listing_id);

        if ($validated['action'] === 'activate') {
            $listing->restore();
            $listing->update(['status' => 'active']);
        } elseif ($validated['action'] === 'disable') {
            $listing->update(['status' => 'disabled']);
        } elseif ($validated['action'] === 'take_down') {
            $listing->update(['status' => 'archived']);
        } else {
            $listing->delete();
        }

        return back()->with('success', 'Listing moderation action applied.');
    }

    public function userAction(Request $request, ListingReport $report, User $user)
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['enable', 'disable', 'verify', 'unverify', 'delete'])],
            'disabled_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($request->user()->is($user) && in_array($validated['action'], ['disable', 'delete'], true)) {
            return back()->withErrors([
                'account' => 'You cannot disable or delete your own admin account.',
            ]);
        }

        if ($request->user()->is($user) && $validated['action'] === 'unverify' && EnsureAdmin::isAdminEmail($user->email)) {
            return back()->withErrors([
                'account' => 'Your admin account must remain marketplace verified.',
            ]);
        }

        try {
            match ($validated['action']) {
                'enable' => $user->update(['disabled_at' => null, 'disabled_reason' => null]),
                'disable' => $user->update([
                    'disabled_at' => now(),
                    'disabled_reason' => $validated['disabled_reason'] ?: 'Disabled from report review.',
                ]),
                'verify' => $user->update(['is_verified' => true, 'verified_at' => $user->verified_at ?? now()]),
                'unverify' => $user->update(['is_verified' => false, 'verified_at' => null]),
                'delete' => $user->delete(),
            };
        } catch (QueryException) {
            return back()->withErrors([
                'account' => 'This account has related records and cannot be deleted safely.',
            ]);
        }

        return back()->with('success', 'Account moderation action applied.');
    }
}
