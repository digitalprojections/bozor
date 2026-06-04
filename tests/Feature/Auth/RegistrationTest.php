<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'postal_code' => '160-0022',
            'prefecture' => 'Tokyo',
            'city' => 'Shinjuku',
            'address_line1' => '2-2-2 Shinjuku',
            'address_line2' => 'Room 201',
            'phone' => '03-1234-5678',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'test@example.com')->firstOrFail();

        $this->assertSame('160-0022', $user->postal_code);
        $this->assertSame('Tokyo', $user->prefecture);
        $this->assertSame('Shinjuku', $user->city);
        $this->assertSame('2-2-2 Shinjuku', $user->address_line1);
        $this->assertSame('Room 201', $user->address_line2);
        $this->assertSame('03-1234-5678', $user->phone);
    }
}
