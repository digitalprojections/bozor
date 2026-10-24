<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LocaleSwitchTest extends TestCase
{
    use RefreshDatabase;

    public function test_each_language_can_be_selected_and_survives_navigation(): void
    {
        $this->withoutVite();
        foreach (['uz', 'ja', 'ru', 'en'] as $locale) {
            $this->from('/')->post('/locale', ['locale' => $locale])
                ->assertRedirect('/')->assertSessionHas('locale', $locale)->assertCookie('locale', $locale);
            $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
                ->component('welcome')->where('locale', $locale));
        }
    }

    public function test_switching_replaces_a_language_query_without_losing_filters(): void
    {
        $this->from('/marketplace?lang=uz&search=chair')->post('/locale', ['locale' => 'ja'])
            ->assertRedirect('/marketplace?lang=ja&search=chair');
    }

    public function test_unsupported_language_is_rejected(): void
    {
        $this->withSession(['locale' => 'uz'])->from('/')->post('/locale', ['locale' => 'invalid'])
            ->assertSessionHasErrors('locale')->assertSessionHas('locale', 'uz');
    }
}
