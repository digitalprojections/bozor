<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), $this->validProfilePayload($user, [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), $this->validProfilePayload($user, [
                'name' => 'Test User',
                'email' => $user->email,
            ]));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_avatar_image_can_be_uploaded()
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'avatar' => 'https://example.com/google-avatar.jpg',
            'google_avatar' => 'https://example.com/google-avatar.jpg',
            'avatar_source' => 'google',
        ]);

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), $this->validProfilePayload($user, [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => UploadedFile::fake()->image('avatar.png'),
            ]));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertStringStartsWith('avatars/', $user->avatar);
        $this->assertStringEndsWith('.png', $user->avatar);
        $this->assertSame('uploaded', $user->avatar_source);
        Storage::disk('public')->assertExists($user->avatar);
        $this->assertStringContainsString('/storage/avatars/', $user->avatar_url);
    }

    public function test_mascot_avatar_can_override_google_avatar()
    {
        $user = User::factory()->create([
            'avatar' => 'https://example.com/google-avatar.jpg',
            'google_avatar' => 'https://example.com/google-avatar.jpg',
            'avatar_source' => 'google',
        ]);

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), $this->validProfilePayload($user, [
                'name' => $user->name,
                'email' => $user->email,
                'avatar_style' => 'mascot',
                'avatar_seed' => '{"characterType":"blob"}',
                'avatar_source' => 'mascot',
            ]));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('mascot', $user->avatar_source);
        $this->assertStringStartsWith('https://api.dicebear.com/7.x/bottts/svg?seed=%7B%22characterType%22%3A%22blob%22%7D', $user->avatar_url);
    }

    public function test_removing_uploaded_avatar_falls_back_to_google_avatar()
    {
        Storage::fake('public');
        Storage::disk('public')->put('avatars/custom.png', 'avatar');

        $user = User::factory()->create([
            'avatar' => 'avatars/custom.png',
            'google_avatar' => 'https://example.com/google-avatar.jpg',
            'avatar_source' => 'uploaded',
        ]);

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), $this->validProfilePayload($user, [
                'name' => $user->name,
                'email' => $user->email,
                'remove_avatar' => '1',
                'avatar_source' => 'google',
            ]));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertNull($user->avatar);
        $this->assertSame('google', $user->avatar_source);
        $this->assertSame('https://example.com/google-avatar.jpg', $user->avatar_url);
        Storage::disk('public')->assertMissing('avatars/custom.png');
    }

    public function test_personal_address_is_required()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->patch(route('profile.update'), $this->validProfilePayload($user, [
                'postal_code' => '',
            ]));

        $response
            ->assertSessionHasErrors('postal_code')
            ->assertRedirect(route('profile.edit'));
    }

    public function test_user_can_delete_their_account()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
                'confirmation_text' => 'DELETE',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('home'));

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), [
                'password' => 'wrong-password',
                'confirmation_text' => 'DELETE',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->fresh());
    }

    public function test_delete_account_requires_exact_confirmation_text()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), [
                'password' => 'password',
                'confirmation_text' => 'delete',
            ]);

        $response
            ->assertSessionHasErrors('confirmation_text')
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->fresh());
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validProfilePayload(User $user, array $overrides = []): array
    {
        return array_merge([
            'name' => $user->name,
            'email' => $user->email,
            'postal_code' => $user->postal_code,
            'prefecture' => $user->prefecture,
            'city' => $user->city,
            'address_line1' => $user->address_line1,
            'address_line2' => $user->address_line2,
            'phone' => $user->phone,
        ], $overrides);
    }
}
