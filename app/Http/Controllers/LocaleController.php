<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LocaleController extends Controller
{
    /**
     * Persist the user's chosen locale in the session.
     */
    public function update(Request $request)
    {
        $request->validate([
            'locale' => ['required', 'string', 'in:' . implode(',', array_keys(config('locales.supported', ['en' => []])))],
        ]);

        $locale = $request->input('locale');
        Session::put('locale', $locale);
        cookie()->queue('locale', $locale, 43200 * 6); // 6 months

        // Redirect back to the same path but with the new locale segment
        $previousUrl = url()->previous();
        $previousPath = parse_url($previousUrl, PHP_URL_PATH) ?: '/';
        
        $supported = array_keys(config('locales.supported', ['en' => []]));
        $segments = explode('/', ltrim($previousPath, '/'));
        
        if (isset($segments[0]) && in_array($segments[0], $supported, true)) {
            $segments[0] = $locale;
            $newPath = implode('/', $segments);
        } else {
            $newPath = $locale . '/' . ltrim($previousPath, '/');
        }

        return redirect()->to('/' . ltrim($newPath, '/'));
    }
}
