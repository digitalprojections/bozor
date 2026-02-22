<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = App::getLocale();
        $fallback = config('locales.fallback', config('app.fallback_locale', 'en'));

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? $request->user()->append(['average_rating', 'ratings_count']) : null,
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => $locale,
            'translations' => $this->loadTranslationsForLocale($locale, $fallback),
            'supportedLocales' => config('locales.supported', ['en' => ['name' => 'English', 'native' => 'English']]),
        ];
    }

    /**
     * Load JSON translations for the given locale, merged with fallback for missing keys.
     *
     * @return array<string, string>
     */
    private function loadTranslationsForLocale(string $locale, string $fallback): array
    {
        $path = lang_path($locale . '.json');
        $fallbackPath = lang_path($fallback . '.json');

        $fallbackStrings = $fallbackPath !== $path && File::exists($fallbackPath)
            ? (json_decode(File::get($fallbackPath), true) ?? [])
            : [];

        $strings = File::exists($path)
            ? (json_decode(File::get($path), true) ?? [])
            : [];

        return array_merge($fallbackStrings, $strings);
    }
}
