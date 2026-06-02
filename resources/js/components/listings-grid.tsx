import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import { SoldBadge } from '@/components/listings/sold-badge';
import { WatchButton } from '@/components/listings/watch-button';
import { PriceDisplay } from '@/components/listings/price-display';
import { UserRatingBadge } from '@/components/user-rating-badge';

interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    display_price?: number;
    status: string;
    created_at: string;
    main_image_url: string | null;
    images: string[];
    user: {
        id: number;
        name: string;
        masked_name?: string;
        avatar_url?: string;
    };
    categories: Array<{
        id: number;
        name: string;
    }>;
}

interface Pagination {
    currentPage: number;
    lastPage: number;
    total: number;
}

interface ListingFilters {
    search?: string;
    category?: number;
    sort?: string;
    hide_sold?: boolean;
}

interface ListingsGridProps {
    listings: Listing[];
    viewMode: 'grid' | 'list';
    pagination: Pagination;
    watchedIds?: number[];
    filters?: ListingFilters;
}

export function ListingsGrid({
    listings,
    viewMode,
    pagination,
    watchedIds = [],
    filters = {},
}: ListingsGridProps) {
    const { t } = useTranslations();

    const handlePageChange = (page: number) => {
        router.get(
            '/marketplace',
            { ...filters, page },
            { preserveState: true, preserveScroll: false },
        );
    };

    if (listings.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center rounded-sm border-[#eeeeee] p-12 text-center shadow-none">
                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                    {t('dashboard.listings.no_results')}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {t('listings.grid.adjust_filters')}
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Listings Grid/List */}
            <div
                className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                        : 'space-y-3'
                }
            >
                {listings.map((listing) => {
                    const isSold = listing.status === 'sold';
                    const displayPrice = listing.display_price ?? listing.price;

                    if (viewMode === 'grid') {
                        return (
                            <Link
                                key={listing.id}
                                href={`/listings/${listing.id}`}
                                className="group block"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-sm bg-[#f5f5f5]">
                                    {listing.main_image_url ? (
                                        <img
                                            src={listing.main_image_url}
                                            alt={listing.title}
                                            className={cn(
                                                'h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]',
                                                isSold &&
                                                    'opacity-80 grayscale-[0.35]',
                                            )}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Package className="h-10 w-10 text-[#b9b9b9]" />
                                        </div>
                                    )}
                                    {isSold && <SoldBadge variant="overlay" />}
                                    <WatchButton
                                        listingId={listing.id}
                                        isWatched={watchedIds.includes(
                                            listing.id,
                                        )}
                                        variant="overlay"
                                    />
                                    <span className="absolute bottom-0 left-0 rounded-tr-sm bg-black/75 px-2 py-0.5 text-sm font-bold text-white">
                                        ¥{displayPrice.toLocaleString()}
                                    </span>
                                </div>

                                <div className="pt-1.5">
                                    <h3 className="line-clamp-2 text-sm leading-snug text-[#333333] group-hover:text-[#e62017]">
                                        {listing.title}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#777777]">
                                        <Avatar className="h-4 w-4 border border-[#eeeeee]">
                                            <AvatarImage
                                                src={
                                                    listing.user.avatar_url ||
                                                    undefined
                                                }
                                                alt={listing.user.name}
                                            />
                                            <AvatarFallback className="bg-[#eeeeee] text-[8px] text-[#777777]">
                                                {(
                                                    listing.user.masked_name ||
                                                    listing.user.name ||
                                                    '?'
                                                ).slice(0, 1)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="truncate">
                                            {listing.user.masked_name ||
                                                listing.user.name}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={listing.id}
                            href={`/listings/${listing.id}`}
                            className="group block"
                        >
                            <Card className="flex-row gap-0 overflow-hidden rounded-sm border-[#eeeeee] bg-white py-0 shadow-none transition-colors hover:border-[#d8d8d8]">
                                <div className="relative h-28 w-28 shrink-0 bg-[#f5f5f5] sm:h-32 sm:w-32">
                                    {listing.main_image_url ? (
                                        <img
                                            src={listing.main_image_url}
                                            alt={listing.title}
                                            className={cn(
                                                'h-full w-full object-cover',
                                                isSold &&
                                                    'opacity-80 grayscale-[0.35]',
                                            )}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Package className="h-9 w-9 text-[#b9b9b9]" />
                                        </div>
                                    )}
                                    {isSold && <SoldBadge variant="overlay" />}
                                    <WatchButton
                                        listingId={listing.id}
                                        isWatched={watchedIds.includes(
                                            listing.id,
                                        )}
                                        variant="overlay"
                                    />
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-[#222222] group-hover:text-[#e62017] sm:text-base">
                                            {listing.title}
                                        </h3>
                                    </div>

                                    <p className="mt-1 line-clamp-2 text-xs text-[#777777]">
                                        {listing.description}
                                    </p>

                                    <div className="mt-auto flex items-end justify-between gap-3">
                                        <div>
                                            <PriceDisplay
                                                price={displayPrice}
                                                size="md"
                                                className="text-[#e62017]"
                                            />
                                            {isSold && (
                                                <SoldBadge className="mt-1 w-fit text-[10px]" />
                                            )}
                                        </div>
                                        <UserRatingBadge
                                            user={listing.user}
                                            variant="compact"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Pagination */}
            {pagination.lastPage > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="order-2 text-sm text-muted-foreground sm:order-1">
                        {t('listings.grid.showing_count', {
                            count: listings.length,
                            total: pagination.total,
                        })}
                    </p>

                    <div className="order-1 flex w-full items-center justify-center gap-2 sm:order-2 sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                            }
                            disabled={pagination.currentPage === 1}
                            className="px-2 sm:px-3"
                        >
                            <ChevronLeft className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">
                                {t('listings.grid.previous')}
                            </span>
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from(
                                { length: pagination.lastPage },
                                (_, i) => i + 1,
                            )
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === pagination.lastPage ||
                                        Math.abs(
                                            page - pagination.currentPage,
                                        ) <= (window.innerWidth < 640 ? 0 : 1),
                                )
                                .map((page, index, array) => (
                                    <React.Fragment key={page}>
                                        {index > 0 &&
                                            array[index - 1] !== page - 1 && (
                                                <span className="px-1 text-muted-foreground sm:px-2">
                                                    ...
                                                </span>
                                            )}
                                        <Button
                                            variant={
                                                page === pagination.currentPage
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                        >
                                            {page}
                                        </Button>
                                    </React.Fragment>
                                ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handlePageChange(pagination.currentPage + 1)
                            }
                            disabled={
                                pagination.currentPage === pagination.lastPage
                            }
                            className="px-2 sm:px-3"
                        >
                            <span className="hidden sm:inline">
                                {t('listings.grid.next')}
                            </span>
                            <ChevronRight className="h-4 w-4 sm:ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
