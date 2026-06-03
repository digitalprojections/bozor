<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

class RequirePasswordWhenAvailable extends RequirePassword
{
    public function handle($request, Closure $next, $redirectToRoute = null, $passwordTimeoutSeconds = null)
    {
        if (
            $request instanceof Request
            && $request->user()
            && (
                ! $request->user()->has_local_password
                || $request->session()->get('auth.login_provider') === 'google'
            )
        ) {
            $request->session()->put('auth.password_confirmed_at', Date::now()->unix());

            return $next($request);
        }

        return parent::handle($request, $next, $redirectToRoute, $passwordTimeoutSeconds);
    }
}
