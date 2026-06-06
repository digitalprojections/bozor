<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ListingCreateProfileRequirementTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_listing_page_flags_incomplete_profile_address(): void
    {
        $this->withoutVite();

        $user = User::factory()->create([
            'postal_code' => null,
            'address_line1' => '',
            'phone' => null,
        ]);

        $this->actingAs($user)
            ->get(route('listings.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/create')
                ->where('profileSetupComplete', false)
                ->where('missingProfileFields', [
                    'Postal Code',
                    'Address Line 1',
                    'Phone',
                ])
            );
    }

    public function test_create_listing_page_allows_complete_profile_address(): void
    {
        $this->withoutVite();

        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('listings.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/create')
                ->where('profileSetupComplete', true)
                ->where('missingProfileFields', [])
            );
    }
}
