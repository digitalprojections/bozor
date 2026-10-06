<?php

namespace Tests\Unit;

use App\Services\HumanVisitorCounter;
use Illuminate\Http\Request;
use PHPUnit\Framework\TestCase;

class HumanVisitorCounterTest extends TestCase
{
    public function test_normal_browser_get_request_can_be_counted(): void
    {
        $request = Request::create('/', 'GET', server: [
            'HTTP_USER_AGENT' => 'Mozilla/5.0 Safari/537.36',
        ]);

        $this->assertTrue((new HumanVisitorCounter)->shouldCount($request));
    }

    public function test_bot_user_agent_is_not_counted(): void
    {
        $request = Request::create('/', 'GET', server: [
            'HTTP_USER_AGENT' => 'Googlebot/2.1',
        ]);

        $this->assertFalse((new HumanVisitorCounter)->shouldCount($request));
    }

    public function test_prefetch_request_is_not_counted(): void
    {
        $request = Request::create('/', 'GET', server: [
            'HTTP_PURPOSE' => 'prefetch',
            'HTTP_USER_AGENT' => 'Mozilla/5.0 Safari/537.36',
        ]);

        $this->assertFalse((new HumanVisitorCounter)->shouldCount($request));
    }

    public function test_request_with_counter_cookie_is_not_counted_again(): void
    {
        $request = Request::create(
            '/',
            'GET',
            cookies: [HumanVisitorCounter::COOKIE_NAME => 'already-counted'],
            server: ['HTTP_USER_AGENT' => 'Mozilla/5.0 Safari/537.36'],
        );

        $this->assertFalse((new HumanVisitorCounter)->shouldCount($request));
    }
}
