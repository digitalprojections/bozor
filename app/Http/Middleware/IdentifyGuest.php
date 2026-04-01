<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyGuest
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            $guestId = $request->cookie('guest_id');

            if (!$guestId) {
                $guestId = (string) \Illuminate\Support\Str::uuid();
            }

            $user = \App\Models\User::where('guest_id', $guestId)->first();

            if (!$user) {
                $user = \App\Models\User::create([
                    'name' => 'Guest',
                    'is_guest' => true,
                    'guest_id' => $guestId,
                ]);
            }

            auth()->login($user, true);

            $response = $next($request);
            return $response->withCookie(cookie()->forever('guest_id', $guestId));
        }

        return $next($request);
    }
}
