<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VerificationRequest;
use App\Models\User;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    /**
     * List all pending verification requests
     */
    public function index()
    {
        $requests = VerificationRequest::with('user')
            ->pending()
            ->latest()
            ->paginate(20);

        return inertia('admin/verifications/index', [
            'requests' => $requests,
        ]);
    }

    /**
     * View a specific verification request
     */
    public function show($id)
    {
        $request = VerificationRequest::with(['user', 'reviewer'])
            ->findOrFail($id);

        return inertia('admin/verifications/show', [
            'verificationRequest' => $request,
        ]);
    }

    /**
     * Approve a verification request
     */
    public function approve(Request $request, $id)
    {
        $verificationRequest = VerificationRequest::findOrFail($id);

        if ($verificationRequest->status !== 'pending') {
            return back()->with('error', 'This request has already been reviewed.');
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        // Update verification request
        $verificationRequest->update([
            'status' => 'approved',
            'admin_notes' => $validated['admin_notes'] ?? null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        // Update user verification status
        $verificationRequest->user->update([
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        return back()->with('success', 'Verification request approved successfully.');
    }

    /**
     * Reject a verification request
     */
    public function reject(Request $request, $id)
    {
        $verificationRequest = VerificationRequest::findOrFail($id);

        if ($verificationRequest->status !== 'pending') {
            return back()->with('error', 'This request has already been reviewed.');
        }

        $validated = $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        $verificationRequest->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Verification request rejected.');
    }
}
