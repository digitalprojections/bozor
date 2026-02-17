import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { MarketplaceHeader } from '@/components/marketplace-header';
import { SearchAndFilters } from '@/components/search-and-filters';
import { ListingsGrid } from '@/components/listings-grid';
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
    user: {
        id: number;
        name: string;
        avatar_url: string;
    };
    category: {
        id: number;
        name: string;
    };
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
    filters,
}: {
    stats: Stats | null;
    categories: Category[];
    listings: PaginatedListings;
    filters: Filters;
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
        <AppLayout breadcrumbs={breadcrumbs}>
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
                    pagination={{
                        currentPage: listings.current_page,
                        lastPage: listings.last_page,
                        total: listings.total,
                    }}
                />
            </div>
        </AppLayout>
    );
}
