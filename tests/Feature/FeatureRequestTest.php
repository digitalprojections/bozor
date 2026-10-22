<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FeatureRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_form_is_available_in_every_supported_language(): void
    {
        $this->withoutVite();
        foreach (['en', 'ja', 'uz', 'ru'] as $locale) {
            $this->get('/feature-requests?lang='.$locale)->assertOk()
                ->assertInertia(fn (Assert $page) => $page->component('feature-requests/create')
                    ->where('locale', $locale)
                    ->where('translations', fn ($strings) => $strings['feature_requests.title'] === json_decode(file_get_contents(lang_path($locale.'.json')), true)['feature_requests.title']));
        }
    }

    public function test_signed_in_user_can_submit_a_request_with_its_original_language(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->withSession(['locale' => 'uz'])
            ->post('/feature-requests', ['title' => 'Qidiruvni yaxshilash', 'description' => 'Saqlangan qidiruvlar uchun bildirishnoma kerak.'])
            ->assertRedirect('/feature-requests')->assertSessionHasNoErrors()
            ->assertSessionHas('success');
        $this->assertDatabaseHas('feature_requests', ['user_id' => $user->id, 'locale' => 'uz', 'title' => 'Qidiruvni yaxshilash']);
    }

    public function test_sign_in_returns_the_user_to_the_request_form(): void
    {
        $user = User::factory()->create();
        $this->get('/feature-requests/login')->assertRedirect('/login');
        $this->assertSame(route('feature-requests.create'), session('url.intended'));
        $this->post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect('/feature-requests');
    }

    public function test_guest_cannot_submit(): void
    {
        $this->postJson('/feature-requests', ['title' => 'Idea', 'description' => 'Details'])->assertUnauthorized();
        $this->assertDatabaseCount('feature_requests', 0);
    }

    public function test_disabled_user_cannot_submit(): void
    {
        $user = User::factory()->create(['disabled_at' => now()]);
        $this->actingAs($user)->postJson('/feature-requests', ['title' => 'Idea', 'description' => 'Details'])->assertForbidden();
        $this->assertDatabaseCount('feature_requests', 0);
    }

    public function test_required_fields_have_localized_errors(): void
    {
        $user = User::factory()->create();
        foreach (['en', 'ja', 'uz', 'ru'] as $locale) {
            $strings = json_decode(file_get_contents(lang_path($locale.'.json')), true);
            $this->actingAs($user)->withSession(['locale' => $locale])->post('/feature-requests', [])
                ->assertSessionHasErrors(['title' => $strings['feature_requests.title_required'], 'description' => $strings['feature_requests.description_required']]);
        }
        $this->assertDatabaseCount('feature_requests', 0);
    }

    public function test_oversized_fields_are_rejected(): void
    {
        $this->actingAs(User::factory()->create())->post('/feature-requests', ['title' => str_repeat('a', 161), 'description' => str_repeat('b', 5001)])
            ->assertSessionHasErrors(['title', 'description']);
        $this->assertDatabaseCount('feature_requests', 0);
    }

    public function test_admin_can_review_requests_without_exposing_submitter_details(): void
    {
        $this->withoutVite();
        $user = User::factory()->create();
        $this->actingAs($user)->post('/feature-requests', ['title' => 'Search alerts', 'description' => 'Notify me of matching items.']);
        $this->actingAs(User::factory()->create(['email' => 'fuzalov@gmail.com']))
            ->get('/admin/feature-requests')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('feature-requests/index')->has('requests.data', 1)
                ->where('requests.data.0.title', 'Search alerts')
                ->missing('requests.data.0.user_id')->missing('requests.data.0.user'));
    }

    public function test_regular_user_cannot_read_admin_inbox(): void
    {
        $this->actingAs(User::factory()->create())->get('/admin/feature-requests')->assertForbidden();
    }
}
