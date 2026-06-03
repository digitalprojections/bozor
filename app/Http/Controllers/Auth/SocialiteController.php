<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    private function shouldUseGoogleAvatar(User $user): bool
    {
        return ! in_array($user->avatar_source, ['uploaded', 'mascot'], true)
            && (! $user->avatar || str_starts_with($user->avatar, 'http://') || str_starts_with($user->avatar, 'https://'));
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Google authentication failed.');
        }

        // Check if user exists
        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            $updates = [
                'name' => $googleUser->getName(),
                'google_avatar' => $googleUser->getAvatar(),
                'is_guest' => false,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ];

            if ($this->shouldUseGoogleAvatar($user)) {
                $updates['avatar'] = $googleUser->getAvatar();
                $updates['avatar_source'] = 'google';
            }

            $user->update($updates);
        } else {
            // Create a new user
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => null,
                'avatar' => $googleUser->getAvatar(),
                'google_avatar' => $googleUser->getAvatar(),
                'avatar_source' => 'google',
                'is_guest' => false,
                'email_verified_at' => now(),
            ]);
        }

        Auth::login($user, true);
        request()->session()->put('auth.login_provider', 'google');

        return redirect()->intended(route('marketplace'));
    }
}
