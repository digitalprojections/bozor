<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;

class SitemapController extends Controller
{
    /**
     * Generate a dynamic sitemap.xml
     */
    public function index(): Response
    {
        $locales = array_keys(config('locales.supported', ['en' => []]));
        $listings = Listing::where('status', 'active')->orderBy('updated_at', 'desc')->get();

        $urls = [];

        // Main pages for each locale
        foreach ($locales as $locale) {
            $urls[] = [
                'loc' => url("/$locale"),
                'lastmod' => now()->startOfDay()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '1.0',
            ];
            $urls[] = [
                'loc' => url("/$locale/marketplace"),
                'lastmod' => now()->startOfDay()->toAtomString(),
                'changefreq' => 'always',
                'priority' => '0.9',
            ];
        }

        // Listing pages
        foreach ($listings as $listing) {
            foreach ($locales as $locale) {
                // We use the ID but often SEO slugs are better. For now, ID to match routes.
                $urls[] = [
                    'loc' => url("/$locale/listings/{$listing->id}"),
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
