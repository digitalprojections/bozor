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

        Session::put('locale', $request->locale);

        return back();
    }
}
