<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    private function shouldUseGoogleAvatar(User $user): bool
    {
        return ! $user->avatar || str_starts_with($user->avatar, 'http://') || str_starts_with($user->avatar, 'https://');
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
                'is_guest' => false,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ];

            if ($this->shouldUseGoogleAvatar($user)) {
                $updates['avatar'] = $googleUser->getAvatar();
            }

            $user->update($updates);
        } else {
            // Create a new user
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => bcrypt(Str::random(24)),
                'avatar' => $googleUser->getAvatar(),
                'is_guest' => false,
                'email_verified_at' => now(),
            ]);
        }

        Auth::login($user, true);

        return redirect()->intended(route('marketplace'));
    }
}
