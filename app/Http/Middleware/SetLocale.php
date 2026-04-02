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

        // 1. Explicit session (user switched language)
        $locale = Session::get('locale');
        if ($locale && in_array($locale, $supported, true)) {
            App::setLocale($locale);
            return $next($request);
        }

        // 2. Cookie (persists after logout)
        $locale = $request->cookie('locale');
        if ($locale && in_array($locale, $supported, true)) {
            App::setLocale($locale);
            Session::put('locale', $locale);
            return $next($request);
        }

        // 2. Accept-Language header (first match in supported)
        $preferred = $this->preferredLocaleFromHeader($request->header('Accept-Language'), $supported);
        if ($preferred) {
            App::setLocale($preferred);
            return $next($request);
        }

        // 3. Config default
        App::setLocale(config('app.locale', $fallback));

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
