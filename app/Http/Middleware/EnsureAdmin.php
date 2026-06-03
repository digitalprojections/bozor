<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    private const ADMIN_EMAILS = [
        'fuzalov@gmail.com',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $email = strtolower((string) $request->user()?->email);

        if (! in_array($email, self::ADMIN_EMAILS, true)) {
            abort(403);
        }

        return $next($request);
    }

    public static function isAdminEmail(?string $email): bool
    {
        return in_array(strtolower((string) $email), self::ADMIN_EMAILS, true);
    }
}
