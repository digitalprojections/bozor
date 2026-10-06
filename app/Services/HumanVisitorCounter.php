<?php

namespace App\Services;

use App\Models\VisitorCounter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HumanVisitorCounter
{
    public const COOKIE_NAME = 'bozor_human_visitor';

    public const COUNTER_NAME = 'site_human_visitors';

    private const COOKIE_MINUTES = 525_600;

    /**
     * @var string[]
     */
    private const BOT_USER_AGENT_PARTS = [
        'ahrefs',
        'bot',
        'crawler',
        'curl',
        'facebookexternalhit',
        'headlesschrome',
        'httpclient',
        'lighthouse',
        'monitoring',
        'pingdom',
        'preview',
        'scanner',
        'scraper',
        'semrush',
        'slurp',
        'spider',
        'uptime',
        'wget',
    ];

    /**
     * @return array{total: int}
     */
    public function record(Request $request): array
    {
        if (! $this->shouldCount($request)) {
            return ['total' => $this->total()];
        }

        $total = $this->incrementTotal();

        Cookie::queue(cookie(
            self::COOKIE_NAME,
            (string) Str::uuid(),
            self::COOKIE_MINUTES,
            null,
            null,
            $request->isSecure(),
            true,
            false,
            'lax'
        ));

        return ['total' => $total];
    }

    public function shouldCount(Request $request): bool
    {
        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            return false;
        }

        if ($request->cookies->has(self::COOKIE_NAME)) {
            return false;
        }

        if ($this->isPrefetch($request)) {
            return false;
        }

        return ! $this->hasBotUserAgent($request);
    }

    public function total(): int
    {
        return (int) (VisitorCounter::query()
            ->where('name', self::COUNTER_NAME)
            ->value('count') ?? 0);
    }

    private function incrementTotal(): int
    {
        return DB::transaction(function (): int {
            $counter = VisitorCounter::query()
                ->where('name', self::COUNTER_NAME)
                ->lockForUpdate()
                ->first();

            if (! $counter) {
                $counter = VisitorCounter::query()->create([
                    'name' => self::COUNTER_NAME,
                    'count' => 0,
                ]);
            }

            $counter->count += 1;
            $counter->save();

            return $counter->count;
        });
    }

    private function isPrefetch(Request $request): bool
    {
        $purpose = strtolower((string) $request->headers->get('purpose'));
        $secPurpose = strtolower((string) $request->headers->get('sec-purpose'));

        return str_contains($purpose, 'prefetch')
            || str_contains($secPurpose, 'prefetch')
            || $request->headers->get('x-moz') === 'prefetch';
    }

    private function hasBotUserAgent(Request $request): bool
    {
        $userAgent = strtolower((string) $request->userAgent());

        if ($userAgent === '') {
            return true;
        }

        foreach (self::BOT_USER_AGENT_PARTS as $needle) {
            if (str_contains($userAgent, $needle)) {
                return true;
            }
        }

        return false;
    }
}
