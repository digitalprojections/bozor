<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_user_accounts(): void
    {
        $this->withoutVite();

        $admin = User::factory()->create(['email' => 'fuzalov@gmail.com']);
        $user = User::factory()->create(['name' => 'Managed User']);

        $response = $this
            ->actingAs($admin)
            ->get(route('admin.users.index', ['search' => 'Managed']));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/users/index')
                ->has('users.data', 1)
                ->where('users.data.0.id', $user->id)
            );
    }

    public function test_non_admin_cannot_view_user_accounts(): void
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    public function test_admin_can_update_relevant_user_properties(): void
    {
        $admin = User::factory()->create(['email' => 'fuzalov@gmail.com']);
        $user = User::factory()->unverified()->create([
            'is_verified' => false,
            'verified_at' => null,
        ]);

        $response = $this
            ->actingAs($admin)
            ->patch(route('admin.users.update', $user), [
                'name' => 'Updated Account',
                'email' => 'updated@example.com',
                'email_verified' => true,
                'is_verified' => true,
                'is_guest' => false,
                'store_name' => 'Updated Store',
                'store_description' => 'Curated marketplace goods.',
                'postal_code' => '160-0022',
                'prefecture' => 'Tokyo',
                'city' => 'Shinjuku',
                'address_line1' => '2-2-2 Shinjuku',
                'address_line2' => 'Suite 3',
                'phone' => '03-9999-0000',
                'gender' => 'unspecified',
                'avatar_source' => 'generated',
                'avatar_style' => 'initials',
                'avatar_seed' => 'Updated Account',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.users.edit', $user));

        $user->refresh();

        $this->assertSame('Updated Account', $user->name);
        $this->assertSame('updated@example.com', $user->email);
        $this->assertNotNull($user->email_verified_at);
        $this->assertTrue((bool) $user->is_verified);
        $this->assertNotNull($user->verified_at);
        $this->assertSame('Updated Store', $user->store_name);
        $this->assertSame('2-2-2 Shinjuku', $user->address_line1);
    }

    public function test_admin_cannot_remove_their_own_admin_email(): void
    {
        $admin = User::factory()->create(['email' => 'fuzalov@gmail.com']);

        $response = $this
            ->actingAs($admin)
            ->from(route('admin.users.edit', $admin))
            ->patch(route('admin.users.update', $admin), [
                'name' => $admin->name,
                'email' => 'not-admin@example.com',
                'email_verified' => true,
                'is_verified' => false,
                'is_guest' => false,
                'store_name' => null,
                'store_description' => null,
                'postal_code' => $admin->postal_code,
                'prefecture' => $admin->prefecture,
                'city' => $admin->city,
                'address_line1' => $admin->address_line1,
                'address_line2' => $admin->address_line2,
                'phone' => $admin->phone,
                'gender' => 'unspecified',
                'avatar_source' => 'generated',
                'avatar_style' => 'initials',
                'avatar_seed' => '',
            ]);

        $response
            ->assertSessionHasErrors('email')
            ->assertRedirect(route('admin.users.edit', $admin));

        $this->assertSame('fuzalov@gmail.com', $admin->refresh()->email);
    }
}
