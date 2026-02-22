<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categories = Category::with('children')->whereNull('parent_id')->get();

        return Inertia::render('listings/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|integer|min:0',
            'categories' => 'required|array|min:1|max:5',
            'categories.*' => 'exists:categories,id',
            'location' => 'nullable|string|max:255',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'in:draft,active',
            'condition' => 'required|in:new,like_new,used_good,used_fair,for_parts',
            'buy_now_price' => 'nullable|integer|min:1',
            'is_auction' => 'required|boolean',
            'auction_end_date' => 'required_if:is_auction,1|nullable|date|after:now',
        ]);

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('listings', 'public');
                $imagePaths[] = $path;
            }
        }

        $listing = Listing::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'location' => $validated['location'] ?? null,
            'images' => $imagePaths,
            'status' => $validated['status'] ?? 'draft',
            'condition' => $validated['condition'],
            'buy_now_price' => $validated['buy_now_price'] ?? null,
            'is_auction' => $validated['is_auction'],
            'auction_end_date' => $validated['auction_end_date'] ?? null,
        ]);

        // Attach categories to listing
        $listing->categories()->attach($validated['categories']);

        return redirect()->route('marketplace')->with('success', 'Listing created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing, \App\Services\ListingService $listingService): Response
    {
        $listing->load(['user', 'categories'])->loadCount('bids');
        $listing->user->append(['average_rating', 'ratings_count']);

        $recommendations = $listingService->getRecommendations(
            auth()->user(),
            $listing->id,
            10
        );

        return Inertia::render('listings/show', [
            'listing' => $listing,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Listing $listing): Response
    {
        if ($listing->user_id !== auth()->id()) {
            abort(403);
        }

        $categories = Category::with('children')->whereNull('parent_id')->get();
        $listing->load('categories');

        return Inertia::render('listings/edit', [
            'listing' => $listing,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing)
    {
        if ($listing->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|integer|min:0',
            'categories' => 'required|array|min:1|max:5',
            'categories.*' => 'exists:categories,id',
            'location' => 'nullable|string|max:255',
            'status' => 'in:draft,active',
            'condition' => 'required|in:new,like_new,used_good,used_fair,for_parts',
            'buy_now_price' => 'nullable|integer|min:1',
            'is_auction' => 'required|boolean',
            'auction_end_date' => 'required_if:is_auction,1|nullable|date|after:now',
        ]);

        $listing->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'location' => $validated['location'] ?? null,
            'status' => $validated['status'] ?? 'draft',
            'condition' => $validated['condition'],
            'buy_now_price' => $validated['buy_now_price'] ?? null,
            'is_auction' => $validated['is_auction'],
            'auction_end_date' => $validated['auction_end_date'] ?? null,
        ]);

        // Update categories
        $listing->categories()->sync($validated['categories']);

        return redirect()->route('listings.show', $listing->id)->with('success', 'Listing updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
    //
    }
}
