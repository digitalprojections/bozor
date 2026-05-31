<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Mockery;
use Tests\TestCase;

class GoogleAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_login_marks_existing_user_email_as_verified(): void
    {
        $user = User::factory()->unverified()->create([
            'email' => 'buyer@example.com',
            'is_guest' => true,
        ]);

        $this->fakeGoogleUser('buyer@example.com', 'Buyer Name', 'https://example.com/avatar.jpg');

        $this->get('/auth/google/callback')
            ->assertRedirect(route('marketplace'));

        $user->refresh();

        $this->assertAuthenticatedAs($user);
        $this->assertFalse((bool) $user->is_guest);
        $this->assertNotNull($user->email_verified_at);
        $this->assertSame('Buyer Name', $user->name);
        $this->assertSame('https://example.com/avatar.jpg', $user->avatar);
    }

    public function test_google_login_creates_verified_user(): void
    {
        $this->fakeGoogleUser('new-buyer@example.com', 'New Buyer', 'https://example.com/new-avatar.jpg');

        $this->get('/auth/google/callback')
            ->assertRedirect(route('marketplace'));

        $user = User::where('email', 'new-buyer@example.com')->firstOrFail();

        $this->assertAuthenticatedAs($user);
        $this->assertFalse((bool) $user->is_guest);
        $this->assertNotNull($user->email_verified_at);
    }

    private function fakeGoogleUser(string $email, string $name, string $avatar): void
    {
        $googleUser = Mockery::mock();
        $googleUser->shouldReceive('getEmail')->andReturn($email);
        $googleUser->shouldReceive('getName')->andReturn($name);
        $googleUser->shouldReceive('getAvatar')->andReturn($avatar);

        $provider = Mockery::mock();
        $provider->shouldReceive('user')->andReturn($googleUser);

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($provider);
    }
}
