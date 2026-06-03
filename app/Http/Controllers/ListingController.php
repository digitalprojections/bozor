<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use App\Notifications\WatchlistItemUpdated;
use App\Services\ListingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
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
            'reserve_price' => [
                'nullable',
                'integer',
                'min:1',
                'gte:price',
            ],
            'categories' => 'required|array|min:1|max:5',
            'categories.*' => 'exists:categories,id',
            'location' => 'nullable|string|max:255',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'in:draft,active',
            'condition' => 'required|in:new,like_new,used_good,used_fair,for_parts',
            'buy_now_price' => 'nullable|integer|min:1',
            'is_auction' => 'required|boolean',
            'auction_end_date' => 'nullable|date|after:now',
        ]);

        $isAuction = $request->boolean('is_auction');
        if (
            $isAuction
            && isset($validated['buy_now_price'], $validated['reserve_price'])
            && (int) $validated['buy_now_price'] < (int) $validated['reserve_price']
        ) {
            throw ValidationException::withMessages([
                'buy_now_price' => __('The Buy Now price must be at least the secret reserve price.'),
            ]);
        }

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('listings', 'public');

                if (! $path) {
                    throw ValidationException::withMessages([
                        'images' => __('One or more images could not be saved. Please try again.'),
                    ]);
                }

                $imagePaths[] = $path;
            }
        }

        $auctionEndDate = $isAuction ? ($validated['auction_end_date'] ?? now()->addDays(30)) : null;

        $listing = Listing::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'reserve_price' => $isAuction ? ($validated['reserve_price'] ?? null) : null,
            'location' => $validated['location'] ?? null,
            'images' => $imagePaths,
            'status' => $validated['status'] ?? 'draft',
            'condition' => $validated['condition'],
            'buy_now_price' => $validated['buy_now_price'] ?? null,
            'is_auction' => $isAuction,
            'auction_end_date' => $auctionEndDate,
        ]);

        // Attach categories to listing
        $listing->categories()->attach($validated['categories']);

        return redirect()->route('marketplace')->with('success', 'Listing created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing, ListingService $listingService): Response
    {
        $listing->load(['user', 'categories'])->loadCount('bids')->loadMax('bids', 'amount');
        $listing->user->append(['average_rating', 'ratings_count']);
        $highestBid = $listing->bids()->orderBy('amount', 'desc')->first();
        $listing->setAttribute('minimum_bid', $listing->minimumBidAmount());
        $listing->setAttribute('is_highest_bidder', auth()->check() && $highestBid?->user_id === auth()->id());

        $recommendations = $listingService->getRecommendations(
            auth()->user(),
            $listing->id,
            10
        );

        $description = str($listing->description)->squish()->limit(160)->toString();
        $canonicalUrl = route('listings.show', $listing);
        $previewImageUrl = $listing->main_image_url ?: asset('favicon.png');

        return Inertia::render('listings/show', [
            'listing' => $listing,
            'is_watched' => auth()->check() ? auth()->user()->watchedListings()->where('listing_id', $listing->id)->exists() : false,
            'recommendations' => $recommendations,
            'seo' => [
                'title' => $listing->title.' | '.config('app.name'),
                'description' => $description,
                'canonical' => $canonicalUrl,
                'url' => $canonicalUrl,
                'og_type' => 'product',
                'og_image' => $previewImageUrl,
                'twitter_card' => 'summary_large_image',
                'json_ld' => [
                    '@context' => 'https://schema.org/',
                    '@type' => 'Product',
                    'name' => $listing->title,
                    'image' => $listing->all_image_urls,
                    'description' => $description,
                    'url' => $canonicalUrl,
                    'offers' => [
                        '@type' => 'Offer',
                        'price' => $listing->display_price,
                        'priceCurrency' => 'JPY',
                        'availability' => $listing->status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    ],
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Listing $listing): Response
    {
        $this->ensureListingIsOwnedByCurrentUser($listing);

        $categories = Category::with('children')->whereNull('parent_id')->get();
        $listing->load('categories')->loadCount('bids');
        $listing->makeVisible('reserve_price');

        return Inertia::render('listings/edit', [
            'listing' => $listing,
            'categories' => $categories,
            'hasBids' => $listing->hasBids(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing)
    {
        $this->ensureListingIsOwnedByCurrentUser($listing);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|integer|min:0',
            'reserve_price' => [
                'nullable',
                'integer',
                'min:1',
                'gte:price',
            ],
            'categories' => 'required|array|min:1|max:5',
            'categories.*' => 'exists:categories,id',
            'location' => 'nullable|string|max:255',
            'status' => 'in:draft,active',
            'condition' => 'required|in:new,like_new,used_good,used_fair,for_parts',
            'buy_now_price' => 'nullable|integer|min:1',
            'is_auction' => 'required|boolean',
            'auction_end_date' => 'nullable|date|after:now',
            'existing_images' => 'nullable|array|max:5',
            'existing_images.*' => 'string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $isAuction = $request->boolean('is_auction');
        if (
            $isAuction
            && isset($validated['buy_now_price'], $validated['reserve_price'])
            && (int) $validated['buy_now_price'] < (int) $validated['reserve_price']
        ) {
            throw ValidationException::withMessages([
                'buy_now_price' => __('The Buy Now price must be at least the secret reserve price.'),
            ]);
        }

        $currentImages = array_values($listing->images ?? []);
        $existingImages = array_values(array_intersect(
            $validated['existing_images'] ?? $currentImages,
            $currentImages
        ));

        $newImagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('listings', 'public');

                if (! $path) {
                    throw ValidationException::withMessages([
                        'images' => __('One or more images could not be saved. Please try again.'),
                    ]);
                }

                $newImagePaths[] = $path;
            }
        }

        $imagePaths = array_values(array_slice([...$existingImages, ...$newImagePaths], 0, 5));

        foreach (array_diff($currentImages, $existingImages) as $removedImagePath) {
            Storage::disk('public')->delete($removedImagePath);
        }

        // Capture relevant changes before updating
        $changes = [];
        if ($listing->price != $validated['price']) {
            $changes['price'] = ['old' => $listing->price, 'new' => $validated['price']];
        }
        if (isset($validated['status']) && $listing->status !== $validated['status']) {
            $changes['status'] = ['old' => $listing->status, 'new' => $validated['status']];
        }

        $listing->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'reserve_price' => $isAuction ? ($validated['reserve_price'] ?? null) : null,
            'location' => $validated['location'] ?? null,
            'status' => $validated['status'] ?? 'draft',
            'condition' => $validated['condition'],
            'buy_now_price' => $validated['buy_now_price'] ?? null,
            'is_auction' => $isAuction,
            'auction_end_date' => $isAuction ? ($validated['auction_end_date'] ?? $listing->auction_end_date ?? now()->addDays(30)) : null,
            'images' => $imagePaths,
        ]);

        // Update categories
        $listing->categories()->sync($validated['categories']);

        // Notify watchers if anything relevant changed
        if (! empty($changes)) {
            $listing->watchedBy()->each(function ($watcher) use ($listing, $changes) {
                $watcher->notify(new WatchlistItemUpdated($listing, $changes));
            });
        }

        return redirect()->route('listings.show', $listing->id)->with('success', 'Listing updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listing $listing)
    {
        $this->ensureListingIsOwnedByCurrentUser($listing);

        if ($listing->hasBids()) {
            abort(403, __('listing.bid_locked'));
        }

        // Delete images from storage
        foreach ($listing->images ?? [] as $imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        $listing->delete();

        return redirect()->route('dashboard')->with('success', 'Listing deleted successfully.');
    }

    private function ensureListingIsOwnedByCurrentUser(Listing $listing): void
    {
        if ((int) $listing->user_id !== (int) auth()->id()) {
            abort(403);
        }
    }
}
