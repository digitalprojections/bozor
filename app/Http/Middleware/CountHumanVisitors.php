<?php

namespace App\Http\Middleware;

use App\Services\HumanVisitorCounter;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CountHumanVisitors
{
    public function handle(Request $request, Closure $next): Response
    {
        app(HumanVisitorCounter::class)->record($request);

        return $next($request);
    }
}
