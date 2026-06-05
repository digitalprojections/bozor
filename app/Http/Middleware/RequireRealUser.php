<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class RequireRealUser
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->disabled_at !== null) {
            auth()->logout();

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => __('This account has been disabled by an administrator.'),
                ], 403);
            }

            return redirect()->route('login')->withErrors([
                'auth' => __('This account has been disabled by an administrator.'),
            ]);
        }

        if ($user && ! $user->is_guest) {
            return $next($request);
        }

        if ($request->isMethod('get')) {
            return Inertia::render('auth/login-required')->toResponse($request);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => __('Please log in to continue.'),
            ], 401);
        }

        return back()->withErrors([
            'auth' => __('Please log in to continue.'),
        ]);
    }
}
