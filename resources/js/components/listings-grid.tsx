import { Link, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { useInitials } from '@/hooks/use-initials';

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

interface Pagination {
    currentPage: number;
    lastPage: number;
    total: number;
}

interface ListingsGridProps {
    listings: Listing[];
    viewMode: 'grid' | 'list';
    pagination: Pagination;
}

export function ListingsGrid({
    listings,
    viewMode,
    pagination,
}: ListingsGridProps) {
    const { t } = useTranslations();
    const getInitials = useInitials();

    const handlePageChange = (page: number) => {
        router.get(
            '/marketplace',
            { page },
            { preserveState: true, preserveScroll: false }
        );
    };

    if (listings.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{t('dashboard.listings.no_results')}</h3>
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
                        ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'space-y-4'
                }
            >
                {listings.map((listing) => (
                    <Link
                        key={listing.id}
                        href={`/listings/${listing.id}`}
                        className="group"
                    >
                        <Card
                            className={`overflow-hidden transition-shadow hover:shadow-lg ${viewMode === 'list' ? 'flex' : ''
                                }`}
                        >
                            {/* Listing Image */}
                            <div
                                className={`relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 ${viewMode === 'grid'
                                    ? 'aspect-square'
                                    : 'h-32 w-32 shrink-0'
                                    }`}
                            >
                                {listing.main_image_url ? (
                                    <img
                                        src={listing.main_image_url}
                                        alt={listing.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Package className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Listing Details */}
                            <div className="flex flex-1 flex-col p-4">
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <h3 className="line-clamp-2 font-semibold group-hover:text-primary">
                                        {listing.title}
                                    </h3>
                                    <Badge variant="secondary" className="shrink-0">
                                        {listing.categories?.[0]?.name || t('common.not_specified')}
                                        {listing.categories?.length > 1 && ` +${listing.categories.length - 1}`}
                                    </Badge>
                                </div>

                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                    {listing.description}
                                </p>

                                <div className="mt-auto space-y-3">
                                    <p className="text-2xl font-bold">
                                        ¥{listing.price.toLocaleString()}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={listing.user.avatar_url}
                                                alt={listing.user.name}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {getInitials(listing.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">
                                            {listing.user.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {pagination.lastPage > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {t('listings.grid.showing_count', { count: listings.length, total: pagination.total })}
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                            }
                            disabled={pagination.currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {t('listings.grid.previous')}
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from(
                                { length: pagination.lastPage },
                                (_, i) => i + 1
                            )
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === pagination.lastPage ||
                                        Math.abs(page - pagination.currentPage) <=
                                        1
                                )
                                .map((page, index, array) => (
                                    <>
                                        {index > 0 &&
                                            array[index - 1] !== page - 1 && (
                                                <span
                                                    key={`ellipsis-${page}`}
                                                    className="px-2"
                                                >
                                                    ...
                                                </span>
                                            )}
                                        <Button
                                            key={page}
                                            variant={
                                                page === pagination.currentPage
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Button>
                                    </>
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
                        >
                            {t('listings.grid.next')}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
