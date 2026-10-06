<?php

namespace Tests\Feature;

use App\Models\VisitorCounter;
use App\Services\HumanVisitorCounter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HumanVisitorCounterTest extends TestCase
{
    use RefreshDatabase;

    public function test_first_human_visit_increments_and_shares_the_counter(): void
    {
        $this->withHeader('User-Agent', 'Mozilla/5.0 Safari/537.36')
            ->get(route('home'))
            ->assertOk()
            ->assertCookie(HumanVisitorCounter::COOKIE_NAME)
            ->assertInertia(fn (Assert $page) => $page
                ->where('visitorCounter.total', 1)
            );

        $this->assertSame(
            1,
            VisitorCounter::query()->where('name', HumanVisitorCounter::COUNTER_NAME)->value('count')
        );
    }

    public function test_returning_browser_is_not_counted_twice(): void
    {
        $this->withCookie(HumanVisitorCounter::COOKIE_NAME, 'already-counted')
            ->withHeader('User-Agent', 'Mozilla/5.0 Safari/537.36')
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('visitorCounter.total', 0)
            );

        $this->assertDatabaseMissing('visitor_counters', [
            'name' => HumanVisitorCounter::COUNTER_NAME,
        ]);
    }

    public function test_bot_visits_are_not_counted(): void
    {
        $this->withHeader('User-Agent', 'Googlebot/2.1')
            ->get(route('home'))
            ->assertOk()
            ->assertCookieMissing(HumanVisitorCounter::COOKIE_NAME)
            ->assertInertia(fn (Assert $page) => $page
                ->where('visitorCounter.total', 0)
            );

        $this->assertDatabaseMissing('visitor_counters', [
            'name' => HumanVisitorCounter::COUNTER_NAME,
        ]);
    }
}
