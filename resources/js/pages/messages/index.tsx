import { Head, router } from '@inertiajs/react';
import type { FormDataConvertible } from '@inertiajs/core';
import { useState } from 'react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { SearchAndFilters } from '@/components/search-and-filters';
import { ListingsGrid } from '@/components/listings-grid';
import type { BreadcrumbItem } from '@/types';
import { useTranslations } from '@/hooks/use-translations';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: '/messages',
    },
];

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
    message_url?: string;
    unread_messages_count?: number;
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

type Filters = Record<string, FormDataConvertible> & {
    search?: string;
    category?: number;
    sort?: string;
    free_shipping?: boolean;
    prefecture?: string;
    city?: string;
};

export default function MessagesIndex({
    categories,
    locationOptions,
    listings,
    filters,
    watched_ids = [],
}: {
    categories: Category[];
    locationOptions: {
        prefectures: string[];
        cities: string[];
    };
    listings: PaginatedListings;
    filters: Filters;
    watched_ids?: number[];
}) {
    const { t } = useTranslations();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const title = t('layout.sidebar.messages') || 'Messages';

    const applyFilters = (nextFilters: Filters) => {
        router.get('/messages', nextFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <BazaarLayout title={title} breadcrumbs={breadcrumbs} showTitle>
            <Head title={title} />

            <div className="space-y-6">
                <SearchAndFilters
                    categories={categories}
                    locationOptions={locationOptions}
                    currentCategory={filters.category}
                    currentSort={filters.sort || 'newest_messages'}
                    currentSearch={filters.search || ''}
                    currentPrefecture={filters.prefecture || ''}
                    currentCity={filters.city || ''}
                    hideSold={false}
                    freeShipping={filters.free_shipping || false}
                    showHideSold={false}
                    showNewestMessagesSort
                    viewMode={viewMode}
                    onSearch={(search) => applyFilters({ ...filters, search })}
                    onCategoryChange={(categoryId) =>
                        applyFilters({
                            ...filters,
                            category: categoryId || undefined,
                        })
                    }
                    onPrefectureChange={(prefecture) =>
                        applyFilters({
                            ...filters,
                            prefecture: prefecture || undefined,
                            city: undefined,
                        })
                    }
                    onCityChange={(city) =>
                        applyFilters({ ...filters, city: city || undefined })
                    }
                    onSortChange={(sort) => applyFilters({ ...filters, sort })}
                    onHideSoldChange={() => {}}
                    onFreeShippingChange={(freeShipping) =>
                        applyFilters({
                            ...filters,
                            free_shipping: freeShipping ? true : undefined,
                        })
                    }
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
                    basePath="/messages"
                    emptyTitle={
                        t('messages.no_unread_items') ||
                        'No unread messages'
                    }
                    emptyDescription={
                        t('messages.no_unread_items_desc') ||
                        'New message items will appear here.'
                    }
                />
            </div>
        </BazaarLayout>
    );
}
