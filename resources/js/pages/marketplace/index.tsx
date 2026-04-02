import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { MarketplaceHeader } from '@/components/marketplace-header';
import { SearchAndFilters } from '@/components/search-and-filters';
import { ListingsGrid } from '@/components/listings-grid';
import { RecommendationsSection } from '@/components/listings/recommendations-section';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Marketplace',
        href: '/marketplace',
    },
];

interface Stats {
    active_listings: number;
    sold_items: number;
    total_earnings: number;
    cart_items: number;
}

interface Category {
    id: number;
    name: string;
    listings_count: number;
}

interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    status: string;
    created_at: string;
    main_image_url: string | null;
    images: string[];
    user: {
        id: number;
        name: string;
        avatar_url: string;
    };
    categories: Array<{
        id: number;
        name: string;
    }>;
}

interface PaginatedListings {
    data: Listing[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    search?: string;
    category?: number;
    sort?: string;
}

export default function Marketplace({
    stats,
    categories,
    listings,
    recommendations = [],
    filters,
    watched_ids = [],
}: {
    stats: Stats | null;
    categories: Category[];
    listings: PaginatedListings;
    recommendations?: any[];
    filters: Filters;
    watched_ids?: number[];
}) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleSearch = (search: string) => {
        router.get(
            '/marketplace',
            { ...filters, search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleCategoryChange = (categoryId: number | null) => {
        router.get(
            '/marketplace',
            { ...filters, category: categoryId || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSortChange = (sort: string) => {
        router.get(
            '/marketplace',
            { ...filters, sort },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <BazaarLayout title="Marketplace" breadcrumbs={breadcrumbs}>
            <Head title="Marketplace" />

            <div className="space-y-6">
                {stats && <MarketplaceHeader stats={stats} />}

                <SearchAndFilters
                    categories={categories}
                    currentCategory={filters.category}
                    currentSort={filters.sort || 'newest'}
                    currentSearch={filters.search || ''}
                    viewMode={viewMode}
                    onSearch={handleSearch}
                    onCategoryChange={handleCategoryChange}
                    onSortChange={handleSortChange}
                    onViewModeChange={setViewMode}
                />

                <ListingsGrid
                    listings={listings.data}
                    viewMode={viewMode}
                    watchedIds={watched_ids}
                    pagination={{
                        currentPage: listings.current_page,
                        lastPage: listings.last_page,
                        total: listings.total,
                    }}
                />

                <RecommendationsSection recommendations={recommendations} />
            </div>
        </BazaarLayout>
    );
}
