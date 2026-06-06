<?php

namespace App\Http\Controllers\Settings;

use App\Helpers\AvatarHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    private function deleteStoredFile(?string $path): void
    {
        if (! $path || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        // Handle avatar removal
        if ($request->boolean('remove_avatar') && $user->avatar) {
            $this->deleteStoredFile($user->avatar);
            $user->avatar = null;
            $user->avatar_source = $user->google_avatar ? 'google' : 'generated';
        }

        // Handle store banner removal
        if ($request->boolean('remove_store_banner') && $user->store_banner) {
            $this->deleteStoredFile($user->store_banner);
            $user->store_banner = null;
        }
        
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            if (! $user->google_avatar && AvatarHelper::isRemoteAvatar($user->avatar)) {
                $user->google_avatar = $user->avatar;
            }

            // Delete old avatar if exists
            if ($user->avatar) {
                $this->deleteStoredFile($user->avatar);
            }
            
            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
            $user->avatar_source = 'uploaded';
        }

        // Handle store banner upload
        if ($request->hasFile('store_banner')) {
            // Delete old banner if exists
            if ($user->store_banner) {
                $this->deleteStoredFile($user->store_banner);
            }

            // Store new banner
            $path = $request->file('store_banner')->store('banners', 'public');
            $user->store_banner = $path;
        }

        // Update other profile fields
        $user->fill($request->only([
            'name', 
            'email', 
            'avatar_style', 
            'avatar_seed', 
            'gender',
            'avatar_source',
            'store_name',
            'store_description',
            'postal_code',
            'prefecture',
            'city',
            'address_line1',
            'address_line2',
            'phone',
        ]));

        if ($request->hasFile('avatar')) {
            $user->avatar_source = 'uploaded';
        } elseif ($request->boolean('remove_avatar')) {
            $user->avatar_source = $user->google_avatar ? 'google' : 'generated';
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit')->with('success', __('Profile settings saved.'));
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
