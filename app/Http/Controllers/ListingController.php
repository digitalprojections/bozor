<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Transaction;
use App\Notifications\WatchlistItemUpdated;
use App\Services\AuctionTransactionService;
use App\Services\ListingService;
use Carbon\CarbonImmutable;
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
        $this->mergeDefaultShippingInput($request);

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
            'auction_end_date' => 'nullable|string',
            'auction_timezone_offset' => 'nullable|integer|min:-840|max:840',
            'shipping_payer' => 'required|in:seller,buyer',
            'shipping_method' => 'required|in:kuroneko_yamato',
            'shipping_cost_type' => 'required|in:free,fixed,location_based,chakubarai',
            'shipping_cost' => 'nullable|integer|min:0|required_if:shipping_cost_type,fixed',
        ]);

        $isAuction = $request->boolean('is_auction');
        $this->ensureSellerAddressIsComplete($request);

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

        $auctionEndDate = $this->normalizeAuctionEndDate($request, $isAuction);
        $shipping = $this->normalizeShipping($validated);

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
            ...$shipping,
        ]);

        // Attach categories to listing
        $listing->categories()->attach($validated['categories']);

        return redirect()->route('marketplace')->with('success', 'Listing created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing, ListingService $listingService, AuctionTransactionService $auctionTransactions): Response
    {
        $auctionTransactions->ensureForListing($listing);

        $listing->refresh();
        $listing->load(['user', 'categories', 'latestTransaction'])->loadCount('bids')->loadMax('bids', 'amount');
        $listing->user->append(['average_rating', 'ratings_count']);
        $highestBid = $listing->bids()->orderBy('amount', 'desc')->first();
        $listing->setAttribute('minimum_bid', $listing->minimumBidAmount());
        $listing->setAttribute('is_highest_bidder', auth()->check() && $highestBid?->user_id === auth()->id());
        $transaction = $this->visibleTransactionFor($listing);

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
            'transaction' => $transaction ? [
                'id' => $transaction->id,
                'amount' => $transaction->amount,
                'status' => $transaction->status,
                'purchase_type' => $transaction->purchase_type ?? Transaction::TYPE_BUY_NOW,
                'buyer_id' => $transaction->buyer_id,
                'seller_id' => $transaction->seller_id,
            ] : null,
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

    private function visibleTransactionFor(Listing $listing): ?Transaction
    {
        if (! auth()->check()) {
            return null;
        }

        return $listing->transactions()
            ->where(function ($query) {
                $query->where('buyer_id', auth()->id())
                    ->orWhere('seller_id', auth()->id());
            })
            ->where('status', '!=', Transaction::STATUS_CANCELLED)
            ->latest()
            ->first();
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
        $this->mergeDefaultShippingInput($request, $listing);

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
            'auction_end_date' => 'nullable|string',
            'auction_timezone_offset' => 'nullable|integer|min:-840|max:840',
            'existing_images' => 'nullable|array|max:5',
            'existing_images.*' => 'string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'shipping_payer' => 'required|in:seller,buyer',
            'shipping_method' => 'required|in:kuroneko_yamato',
            'shipping_cost_type' => 'required|in:free,fixed,location_based,chakubarai',
            'shipping_cost' => 'nullable|integer|min:0|required_if:shipping_cost_type,fixed',
        ]);

        $isAuction = $request->boolean('is_auction');
        $this->ensureSellerAddressIsComplete($request);

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
        $shipping = $this->normalizeShipping($validated);

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
            'auction_end_date' => $this->normalizeAuctionEndDate($request, $isAuction, $listing),
            'images' => $imagePaths,
            ...$shipping,
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

    private function mergeDefaultShippingInput(Request $request, ?Listing $listing = null): void
    {
        $request->merge([
            'shipping_payer' => $request->input('shipping_payer', $listing?->shipping_payer ?? 'seller'),
            'shipping_method' => $request->input('shipping_method', $listing?->shipping_method ?? 'kuroneko_yamato'),
            'shipping_cost_type' => $request->input('shipping_cost_type', $listing?->shipping_cost_type ?? 'free'),
            'shipping_cost' => $request->input('shipping_cost', $listing?->shipping_cost),
        ]);
    }

    private function ensureSellerAddressIsComplete(Request $request): void
    {
        if ($request->input('status', 'draft') !== 'active') {
            return;
        }

        $user = $request->user();
        $requiredAddressFields = [
            'postal_code',
            'prefecture',
            'city',
            'address_line1',
            'phone',
        ];

        foreach ($requiredAddressFields as $field) {
            if (blank($user?->{$field})) {
                throw ValidationException::withMessages([
                    'location' => __('Complete your personal address in profile settings before publishing a listing.'),
                ]);
            }
        }
    }

    private function normalizeAuctionEndDate(Request $request, bool $isAuction, ?Listing $listing = null): ?CarbonImmutable
    {
        if (! $isAuction) {
            return null;
        }

        $submittedDate = $request->input('auction_end_date');
        if (blank($submittedDate)) {
            return CarbonImmutable::instance($listing?->auction_end_date ?? now()->addDays(30))->utc();
        }

        try {
            $localDate = str_contains($submittedDate, 'T')
                ? CarbonImmutable::createFromFormat('Y-m-d\TH:i', $submittedDate, 'UTC')
                : CarbonImmutable::parse($submittedDate, 'UTC');
        } catch (\Throwable) {
            throw ValidationException::withMessages([
                'auction_end_date' => __('Enter a valid auction end time.'),
            ]);
        }

        if (! $localDate) {
            throw ValidationException::withMessages([
                'auction_end_date' => __('Enter a valid auction end time.'),
            ]);
        }

        $utcDate = $localDate->addMinutes((int) $request->input('auction_timezone_offset', 0))->utc();

        if ($utcDate->lte(now())) {
            throw ValidationException::withMessages([
                'auction_end_date' => __('The auction end time must be in the future.'),
            ]);
        }

        return $utcDate;
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function normalizeShipping(array $validated): array
    {
        $payer = $validated['shipping_payer'];
        $costType = $validated['shipping_cost_type'];

        if ($payer === 'seller') {
            return [
                'shipping_payer' => 'seller',
                'shipping_method' => 'kuroneko_yamato',
                'shipping_cost_type' => 'free',
                'shipping_cost' => 0,
            ];
        }

        if ($costType === 'free') {
            throw ValidationException::withMessages([
                'shipping_cost_type' => __('Choose a buyer shipping cost option.'),
            ]);
        }

        return [
            'shipping_payer' => 'buyer',
            'shipping_method' => 'kuroneko_yamato',
            'shipping_cost_type' => $costType,
            'shipping_cost' => $costType === 'fixed' ? (int) $validated['shipping_cost'] : null,
        ];
    }
}
