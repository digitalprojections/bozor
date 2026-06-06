import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { MarketplaceHeader } from '@/components/marketplace-header';
import { SearchAndFilters } from '@/components/search-and-filters';
import { ListingsGrid } from '@/components/listings-grid';
import { RecommendationsSection } from '@/components/listings/recommendations-section';
import { useTranslations } from '@/hooks/use-translations';
import type { BreadcrumbItem } from '@/types';

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
        masked_name?: string;
        avatar_url: string;
        avatar_source?: 'uploaded' | 'mascot' | 'generated' | 'google';
        avatar_seed?: string;
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
    hide_sold?: boolean;
    free_shipping?: boolean;
    prefecture?: string;
    city?: string;
}

export default function Marketplace({
    stats,
    categories,
    locationOptions,
    listings,
    recommendations = [],
    filters,
    watched_ids = [],
}: {
    stats: Stats | null;
    categories: Category[];
    locationOptions: {
        prefectures: string[];
        cities: string[];
    };
    listings: PaginatedListings;
    recommendations?: any[];
    filters: Filters;
    watched_ids?: number[];
}) {
    const { t } = useTranslations();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('marketplace.title'),
            href: '/marketplace',
        },
    ];

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

    const handlePrefectureChange = (prefecture: string | null) => {
        router.get(
            '/marketplace',
            { ...filters, prefecture: prefecture || undefined, city: undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleCityChange = (city: string | null) => {
        router.get(
            '/marketplace',
            { ...filters, city: city || undefined },
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

    const handleHideSoldChange = (hideSold: boolean) => {
        router.get(
            '/marketplace',
            { ...filters, hide_sold: hideSold ? 1 : undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleFreeShippingChange = (freeShipping: boolean) => {
        router.get(
            '/marketplace',
            { ...filters, free_shipping: freeShipping ? 1 : undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <BazaarLayout title={t('marketplace.title')} breadcrumbs={breadcrumbs} showTitle>
            <Head title={t('marketplace.title')} />

            <div className="space-y-6">
                {stats && <MarketplaceHeader stats={stats} />}

                <SearchAndFilters
                    categories={categories}
                    locationOptions={locationOptions}
                    currentCategory={filters.category}
                    currentSort={filters.sort || 'newest'}
                    currentSearch={filters.search || ''}
                    currentPrefecture={filters.prefecture || ''}
                    currentCity={filters.city || ''}
                    hideSold={filters.hide_sold || false}
                    freeShipping={filters.free_shipping || false}
                    viewMode={viewMode}
                    onSearch={handleSearch}
                    onCategoryChange={handleCategoryChange}
                    onPrefectureChange={handlePrefectureChange}
                    onCityChange={handleCityChange}
                    onSortChange={handleSortChange}
                    onHideSoldChange={handleHideSoldChange}
                    onFreeShippingChange={handleFreeShippingChange}
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
                    filters={filters}
                />

                <RecommendationsSection recommendations={recommendations} />
            </div>
        </BazaarLayout>
    );
}
