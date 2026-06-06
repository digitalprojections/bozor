<?php

namespace App\Support;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SafeIntendedRedirect
{
    public function to(Request $request, string $default): RedirectResponse
    {
        $intended = $request->session()->get('url.intended');

        if (is_string($intended) && $this->isSafe($intended, $request)) {
            return redirect()->intended($default);
        }

        if ($intended !== null) {
            $request->session()->forget('url.intended');
        }

        return redirect()->to($default);
    }

    private function isSafe(string $url, Request $request): bool
    {
        if ($url === '') {
            return false;
        }

        if (Str::startsWith($url, '/') && ! Str::startsWith($url, '//')) {
            return true;
        }

        $parts = parse_url($url);

        if (! is_array($parts) || ! isset($parts['scheme'], $parts['host'])) {
            return false;
        }

        $scheme = Str::lower($parts['scheme']);
        $host = Str::lower($parts['host']);
        $port = $parts['port'] ?? $this->defaultPort($scheme);

        return $scheme === $request->getScheme()
            && $host === Str::lower($request->getHost())
            && $port === $request->getPort();
    }

    private function defaultPort(string $scheme): int
    {
        return $scheme === 'https' ? 443 : 80;
    }
}
