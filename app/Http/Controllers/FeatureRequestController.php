<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeatureRequest;
use App\Models\FeatureRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeatureRequestController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('feature-requests/create');
    }

    public function signIn(Request $request): RedirectResponse
    {
        if ($request->user() && ! $request->user()->is_guest) {
            return to_route('feature-requests.create');
        }

        $request->session()->put('url.intended', route('feature-requests.create'));

        return to_route('login');
    }

    public function store(StoreFeatureRequest $request): RedirectResponse
    {
        FeatureRequest::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'locale' => app()->getLocale(),
        ]);

        return to_route('feature-requests.create')->with('success', __('feature_requests.success'));
    }

    public function index(): Response
    {
        return Inertia::render('feature-requests/index', [
            'requests' => FeatureRequest::query()->orderByDesc('id')
                ->paginate(20, ['id', 'title', 'description', 'locale', 'created_at']),
        ]);
    }
}
