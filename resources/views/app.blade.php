<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @php
            $seo = $page['props']['seo'] ?? [];
            $seoTitle = $seo['title'] ?? config('app.name', 'Bozor Japan');
            $seoDescription = $seo['description'] ?? 'Free registration and no sales fees! The ultimate marketplace for individuals and small businesses in Japan. Buy and sell items easily without hidden costs.';
            $seoUrl = $seo['url'] ?? $seo['canonical'] ?? request()->url();
            $seoImage = $seo['og_image'] ?? asset('favicon.png');
            $seoType = $seo['og_type'] ?? 'website';
            $twitterCard = $seo['twitter_card'] ?? 'summary_large_image';
        @endphp

        <meta name="description" content="{{ $seoDescription }}">
        <link rel="canonical" href="{{ $seoUrl }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:type" content="{{ $seoType }}">
        <meta property="og:url" content="{{ $seoUrl }}">
        <meta property="og:site_name" content="{{ config('app.name', 'Bozor Japan') }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:image:secure_url" content="{{ $seoImage }}">
        <meta name="twitter:card" content="{{ $twitterCard }}">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">

        @if(!empty($seo['json_ld']))
            <script type="application/ld+json">@json($seo['json_ld'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)</script>
        @endif

        {{-- hreflang tags for SEO visibility across regions --}}
        @if(isset($request) || request())
            @php $currentRequest = $request ?? request(); @endphp
            @foreach(array_keys(config('locales.supported', ['en' => []])) as $localeCode)
                <link rel="alternate" hreflang="{{ $localeCode }}" href="{{ $currentRequest->fullUrlWithQuery(['lang' => $localeCode]) }}">
            @endforeach
            <link rel="alternate" hreflang="x-default" href="{{ $currentRequest->fullUrlWithQuery(['lang' => 'en']) }}">
        @endif

        <link rel="icon" href="{{ asset('favicon.png') }}" type="image/png" sizes="80x80">
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}" sizes="180x180">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @production
            @vite(['resources/js/app.tsx'])
        @else
            @viteReactRefresh
            @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @endproduction
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
