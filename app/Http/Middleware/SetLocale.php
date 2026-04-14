<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Set the application locale from session, then Accept-Language, then config.
     * To add a new language: add an entry in config/locales.php and a lang/{code}.json file.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supported = array_keys(config('locales.supported', ['en' => []]));
        $fallback = config('locales.fallback', config('app.fallback_locale', 'en'));

        // 1. Priority: URL query parameter ?lang=... (Good for SEO and manual links)
        $langParam = $request->query('lang');
        if ($langParam && in_array($langParam, $supported, true)) {
            $targetLocale = $langParam;
        } 
        // 2. Secondary: Session or Cookie
        else {
            $targetLocale = Session::get('locale') 
                ?? $request->cookie('locale') 
                ?? $this->preferredLocaleFromHeader($request->header('Accept-Language'), $supported)
                ?? config('app.locale', $fallback);
        }

        if (!in_array($targetLocale, $supported, true)) {
            $targetLocale = $fallback;
        }

        App::setLocale($targetLocale);
        if (Session::get('locale') !== $targetLocale) {
            Session::put('locale', $targetLocale);
        }

        return $next($request);
    }

    /**
     * Parse Accept-Language and return the first supported locale code.
     */
    private function preferredLocaleFromHeader(?string $header, array $supported): ?string
    {
        if (! $header) {
            return null;
        }
        $parts = array_map('trim', explode(',', $header));
        foreach ($parts as $part) {
            $code = strtolower(explode(';', $part)[0]);
            $code = trim(explode('-', $code)[0]);
            if (in_array($code, $supported, true)) {
                return $code;
            }
        }
        return null;
    }
}
