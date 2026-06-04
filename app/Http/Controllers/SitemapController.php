<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate a dynamic sitemap.xml
     */
    public function index(): Response
    {
        $locales = array_keys(config('locales.supported', ['en' => []]));
        $listings = Listing::items()->where('status', 'active')->orderBy('updated_at', 'desc')->get();

        $urls = [];

        // Main pages for each locale
        foreach ($locales as $locale) {
            $urls[] = [
                'loc' => route('home', ['lang' => $locale]),
                'lastmod' => now()->startOfDay()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '1.0',
            ];
            $urls[] = [
                'loc' => route('marketplace', ['lang' => $locale]),
                'lastmod' => now()->startOfDay()->toAtomString(),
                'changefreq' => 'always',
                'priority' => '0.9',
            ];
        }

        // Listing pages
        foreach ($listings as $listing) {
            foreach ($locales as $locale) {
                $urls[] = [
                    'loc' => route('listings.show', ['listing' => $listing, 'lang' => $locale]),
                    'lastmod' => $listing->updated_at->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.8',
                ];
            }
        }

        $xml = view('sitemap', compact('urls'))->render();

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }
}
