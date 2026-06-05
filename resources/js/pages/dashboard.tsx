import { Head, Link, router, usePage } from '@inertiajs/react';
import { DashboardProfileCard } from '@/components/dashboard/dashboard-profile-card';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    CalendarDays,
    Edit3,
    Eye,
    Heart,
    MapPin,
    Package,
    ReceiptText,
    ShoppingBag,
    Tag,
    Trash2,
} from 'lucide-react';
import { RecommendationsSection } from '@/components/listings/recommendations-section';

type DashboardListing = {
    id: number;
    title: string;
    description?: string | null;
    display_price?: number;
    price: number;
    status: 'draft' | 'active' | 'sold' | 'archived';
    main_image_url?: string | null;
    condition?: string | null;
    location?: string | null;
    views?: number;
    created_at?: string;
    bids_count?: number;
    watched_by_count?: number;
    categories?: { id: number; name: string }[];
    transactions?: { id: number; status: string; amount: number }[];
};

export default function Dashboard({
    isVerified = false,
    stats,
    listings = [],
    recommendations = [],
}: {
    isVerified?: boolean;
    stats?: any;
    listings?: DashboardListing[];
    recommendations?: any[];
}) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const { t } = useTranslations();

    const breadcrumbs: any[] = [];
    const formatPrice = (price: number) => `¥${price.toLocaleString()}`;
    const formatDate = (date?: string) =>
        date
            ? new Intl.DateTimeFormat(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
              }).format(new Date(date))
            : t('common.not_specified');

    const formatLabel = (value?: string | null) =>
        value
            ? value
                  .split('_')
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ')
            : t('common.not_specified');

    const deleteListing = (listing: DashboardListing) => {
        if (!confirm(`Delete "${listing.title}"? This cannot be undone.`)) {
            return;
        }

        router.delete(`/listings/${listing.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <BazaarLayout
            title={t('layout.header.my_listings')}
            breadcrumbs={breadcrumbs}
        >
            <Head title={t('common.dashboard')} />

            <DashboardProfileCard
                user={user}
                isVerified={isVerified}
                rating="528"
                reviewCount={99}
            />

            {/* Your Listings Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-3 px-2 sm:flex-row sm:items-center">
                    <h2 className="text-xl font-bold tracking-tight text-[#0b1a31]">
                        {t('dashboard.listings.title')}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link
                            href="/dashboard/won-items"
                            className="flex items-center gap-1 text-sm font-semibold text-[#2b4b8f] hover:underline"
                        >
                            <ShoppingBag size={14} />{' '}
                            {t('dashboard.won_items.title')}
                        </Link>
                        <Link
                            href="/listings/create"
                            className="text-sm font-semibold text-[#0d9488] hover:underline"
                        >
                            + {t('dashboard.listings.create_new')}
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {listings.length > 0 ? (
                        listings.map((listing) => {
                            const displayPrice =
                                listing.display_price ?? listing.price;
                            const hasBids = (listing.bids_count ?? 0) > 0;
                            const transaction = listing.transactions?.[0];
                            const canOpenTransaction =
                                listing.status === 'sold' && transaction;
                            const categories =
                                listing.categories
                                    ?.map((category) => category.name)
                                    .join(', ') || t('common.not_specified');

                            return (
                                <Card
                                    key={listing.id}
                                    className="overflow-hidden rounded-[4px] border-[#dce5ef] py-0 shadow-sm transition-colors hover:border-[#b9c9d9]"
                                >
                                    <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-stretch">
                                        <Link
                                            href={`/listings/${listing.id}`}
                                            className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded border border-[#d8e2ee] bg-[#f0f5fd] sm:h-28 sm:w-28"
                                        >
                                            {listing.main_image_url ? (
                                                <img
                                                    src={listing.main_image_url}
                                                    alt={listing.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Package
                                                    className="text-[#a3b6cc]"
                                                    size={28}
                                                />
                                            )}
                                        </Link>

                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                    className="min-w-0 text-base leading-5 font-semibold text-[#16233a] hover:text-[#2b4b8f]"
                                                >
                                                    <span className="block truncate">
                                                        {listing.title}
                                                    </span>
                                                </Link>
                                                <span className="shrink-0 text-sm font-bold text-[#0f766e]">
                                                    {formatPrice(displayPrice)}
                                                </span>
                                            </div>

                                            <p className="[display:-webkit-box] max-w-4xl overflow-hidden text-sm leading-5 text-[#5f6c84] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                                                {listing.description ||
                                                    t(
                                                        'common.no_description',
                                                    ) ||
                                                    'No description'}
                                            </p>

                                            <div className="grid gap-x-4 gap-y-1 text-xs text-[#5f6c84] sm:grid-cols-2 lg:grid-cols-3">
                                                <span className="flex min-w-0 items-center gap-1.5">
                                                    <Tag size={13} />
                                                    <span className="truncate capitalize">
                                                        {t(
                                                            'dashboard.status.' +
                                                                listing.status,
                                                        ) ||
                                                            formatLabel(
                                                                listing.status,
                                                            )}
                                                    </span>
                                                </span>
                                                <span className="flex min-w-0 items-center gap-1.5">
                                                    <Package size={13} />
                                                    <span className="truncate">
                                                        {formatLabel(
                                                            listing.condition,
                                                        )}
                                                    </span>
                                                </span>
                                                <span className="flex min-w-0 items-center gap-1.5">
                                                    <MapPin size={13} />
                                                    <span className="truncate">
                                                        {listing.location ||
                                                            t(
                                                                'common.not_specified',
                                                            )}
                                                    </span>
                                                </span>
                                                <span className="flex min-w-0 items-center gap-1.5">
                                                    <Eye size={13} />
                                                    <span className="truncate">
                                                        {listing.views ?? 0}{' '}
                                                        {t(
                                                            'dashboard.stats.views',
                                                        )}
                                                    </span>
                                                </span>
                                                <span className="flex min-w-0 items-center gap-1.5">
                                                    <Heart size={13} />
                                                    <span className="truncate">
                                                        {listing.watched_by_count ??
                                                            0}{' '}
                                                        {t(
                                                            'dashboard.stats.watchers',
                                                        )}
                                                    </span>
                                                </span>
                                                <span className="flex min-w-0 items-center gap-1.5">
                                                    <ShoppingBag size={13} />
                                                    <span className="truncate">
                                                        {hasBids
                                                            ? `${listing.bids_count} ${t('listing.sidebar.bids')}`
                                                            : `0 ${t('listing.sidebar.bids')}`}
                                                    </span>
                                                </span>
                                                <span className="flex min-w-0 items-center gap-1.5">
                                                    <CalendarDays size={13} />
                                                    <span className="truncate">
                                                        {formatDate(
                                                            listing.created_at,
                                                        )}
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="truncate text-xs text-[#5f6c84]">
                                                Categories: {categories}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 sm:w-36 sm:grid-cols-1">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="h-8 justify-start rounded-[4px] border-[#cfdbe8] text-[#2b4b8f]"
                                            >
                                                <Link
                                                    href={`/listings/${listing.id}/edit`}
                                                >
                                                    <Edit3 size={14} />
                                                    {t('common.edit')}
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild={!!canOpenTransaction}
                                                size="sm"
                                                variant="outline"
                                                disabled={!canOpenTransaction}
                                                className="h-8 justify-start rounded-[4px] border-[#cfdbe8] text-[#0f766e] disabled:text-[#8a98a8]"
                                            >
                                                {canOpenTransaction ? (
                                                    <Link
                                                        href={`/transactions/${transaction.id}`}
                                                    >
                                                        <ReceiptText
                                                            size={14}
                                                        />
                                                        Transaction
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <ReceiptText
                                                            size={14}
                                                        />
                                                        Transaction
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    deleteListing(listing)
                                                }
                                                className="h-8 justify-start rounded-[4px] border-[#f1c7c7] text-[#b42318] hover:bg-[#fff1f1] hover:text-[#8a1f15] sm:col-span-1"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </Button>
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 justify-start rounded-[4px] text-[#5f6c84] sm:col-span-1"
                                            >
                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                >
                                                    <Eye size={14} />
                                                    {t('common.view')}
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <Card className="rounded-[4px] border-[#f0f2f5] p-12 text-center text-[#5f6c84] shadow-sm">
                            <p>{t('dashboard.listings.no_results')}</p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Recommendations Section */}
            <RecommendationsSection recommendations={recommendations} />
        </BazaarLayout>
    );
}
