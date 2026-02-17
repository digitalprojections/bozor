<?php

namespace App\Http\Controllers;

use App\Models\VerificationRequest;
use Illuminate\Http\Request;

class VerificationRequestController extends Controller
{
    /**
     * Submit a new verification request
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Check if user already has a pending request
        $existingRequest = $user->verificationRequests()->pending()->first();
        if ($existingRequest) {
            return back()->with('error', 'You already have a pending verification request.');
        }

        // Check if user is already verified
        if ($user->isVerified()) {
            return back()->with('error', 'Your account is already verified.');
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
            'documents' => 'nullable|array',
            'documents.*' => 'file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        // Handle document uploads
        $documentPaths = [];
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $document) {
                $path = $document->store('verification-documents', 'public');
                $documentPaths[] = $path;
            }
        }

        VerificationRequest::create([
            'user_id' => $user->id,
            'reason' => $validated['reason'] ?? null,
            'documents' => $documentPaths,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Verification request submitted successfully.');
    }

    /**
     * View user's verification request status
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $verificationRequest = $user->latestVerificationRequest;

        return inertia('verification/status', [
            'verificationRequest' => $verificationRequest,
            'isVerified' => $user->isVerified(),
        ]);
    }

    /**
     * Cancel a pending verification request
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $verificationRequest = VerificationRequest::where('id', $id)
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $verificationRequest->delete();

        return back()->with('success', 'Verification request cancelled.');
    }
}
