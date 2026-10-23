<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminStatistics;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class StatisticsController extends Controller
{
    public function __invoke(Request $request, AdminStatistics $statistics): Response
    {
        $validated = $request->validate(['days' => ['sometimes', 'integer', Rule::in([7, 30, 90, 365])]]);
        $response = Inertia::render('admin/statistics', [
            'statistics' => fn () => $statistics->build((int) ($validated['days'] ?? 30)),
        ])->toResponse($request);
        $response->headers->set('Cache-Control', 'private, no-store');

        return $response;
    }
}
