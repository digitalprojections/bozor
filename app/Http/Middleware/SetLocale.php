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

        // 1. Check URL segment (e.g. /ja/...)
        $locale = $request->segment(1);
        if ($locale && in_array($locale, $supported, true)) {
            App::setLocale($locale);
            if (Session::get('locale') !== $locale) {
                Session::put('locale', $locale);
            }
            return $next($request);
        }

        // Ignore locale prefix for these routes
        if ($request->is('auth/*', 'sitemap.xml', 'locale', 'up')) {
            return $next($request);
        }

        // 2. Determine best locale if prefix is missing
        $targetLocale = Session::get('locale') 
            ?? $request->cookie('locale') 
            ?? $this->preferredLocaleFromHeader($request->header('Accept-Language'), $supported)
            ?? config('app.locale', $fallback);

        if (!in_array($targetLocale, $supported, true)) {
            $targetLocale = $fallback;
        }

        // 3. Redirect to localized URL
        return redirect()->to('/' . $targetLocale . '/' . ltrim($request->path(), '/'));
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
