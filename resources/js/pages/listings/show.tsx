import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, Clock, Info, FileText, Trash2 } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/use-translations';
import { ListingSidebar } from '@/components/listings/listing-sidebar';
import { RecommendationsSection } from '@/components/listings/recommendations-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePage, router } from '@inertiajs/react';
import { SoldBadge } from '@/components/listings/sold-badge';
import { WatchButton } from '@/components/listings/watch-button';
import { PriceDisplay } from '@/components/listings/price-display';
import type { BreadcrumbItem } from '@/types';
import { ITEM_CONDITIONS } from '@/types/item-conditions';

interface ListingProps {
    listing: {
        id: number;
        title: string;
        description: string;
        price: number;
        display_price?: number;
        current_price?: number;
        highest_bid_amount?: number;
        status: string;
        created_at: string;
        location: string | null;
        images: string[];
        all_image_urls: string[];
        user: {
            id: number;
            name: string;
            masked_name: string;
            avatar_url: string;
            average_rating?: number;
            ratings_count?: number;
        };
        categories: Array<{
            id: number;
            name: string;
        }>;
        condition: string | null;
        buy_now_price: number | null;
        is_auction: boolean;
        auction_end_date: string | null;
        auction_ended?: boolean;
        reserve_met?: boolean;
        current_high_bid: number;
        bids_count?: number;
        shipping_payer?: 'seller' | 'buyer';
        shipping_method?: 'kuroneko_yamato';
        shipping_cost_type?: 'free' | 'fixed' | 'location_based' | 'chakubarai';
        shipping_cost?: number | null;
    };
    recommendations?: any[];
    is_watched?: boolean;
    seo?: {
        title?: string;
        description?: string;
        canonical?: string;
        url?: string;
        og_image?: string;
    };
}

export default function Show({
    listing,
    recommendations = [],
    is_watched = false,
    seo,
}: ListingProps) {
    const { t } = useTranslations();
    const { auth } = usePage().props as any;
    const [activeImage, setActiveImage] = useState(0);
    const [failedImages, setFailedImages] = useState<Set<number>>(
        () => new Set(),
    );
    const imageUrls = listing.all_image_urls ?? [];
    const activeImageUrl = imageUrls[activeImage];
    const activeImageFailed = failedImages.has(activeImage);
    const displayPrice =
        listing.display_price ?? listing.current_price ?? listing.price;
    const listingUrl = seo?.canonical ?? seo?.url ?? `/listings/${listing.id}`;
    const seoDescription =
        seo?.description ?? listing.description.substring(0, 160);
    const seoImage = seo?.og_image ?? imageUrls[0];
    const hasBids = (listing.bids_count ?? 0) > 0;
    const reserveNotMet =
        listing.is_auction &&
        Boolean(listing.auction_ended) &&
        listing.reserve_met === false &&
        listing.status === 'active';
    const markImageFailed = (index: number) => {
        setFailedImages((current) => new Set(current).add(index));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('marketplace.title'), href: '/marketplace' },
        { title: t('listing.show.title'), href: '#' },
    ];

    return (
        <BazaarLayout
            title={t('listing.show.title')}
            breadcrumbs={breadcrumbs}
            sidebar={<ListingSidebar listing={listing} shareUrl={listingUrl} />}
        >
            <Head title={`${listing.title} - ${t('marketplace.title')}`}>
                <link rel="canonical" href={listingUrl} />
                <meta name="description" content={seoDescription} />

                <meta property="og:title" content={listing.title} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:type" content="product" />
                <meta property="og:url" content={listingUrl} />
                {seoImage && (
                    <>
                        <meta property="og:image" content={seoImage} />
                        <meta name="twitter:image" content={seoImage} />
                    </>
                )}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={listing.title} />
                <meta name="twitter:description" content={seoDescription} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org/',
                        '@type': 'Product',
                        name: listing.title,
                        image: imageUrls,
                        description: seoDescription,
                        url: listingUrl,
                        offers: {
                            '@type': 'Offer',
                            priceCurrency: 'JPY',
                            price: displayPrice,
                            availability: 'https://schema.org/InStock',
                            url: listingUrl,
                            areaServed: {
                                '@type': 'Country',
                                name: 'Japan',
                            },
                            eligibleRegion: listing.location
                                ? {
                                      '@type': 'State',
                                      name: listing.location,
                                  }
                                : undefined,
                        },
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: t('marketplace.title'),
                                item: '/marketplace',
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: listing.title,
                                item: listingUrl,
                            },
                        ],
                    })}
                </script>
            </Head>

            <div className="flex flex-col gap-8">
                {/* Images Section */}
                <Card className="overflow-hidden rounded-[16px] border-[#edf2f9] shadow-sm sm:rounded-[24px]">
                    <CardContent className="p-3 sm:p-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="main-image-placeholder relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[12px] border border-[#e1e9f2] bg-[#d9e2ef] sm:rounded-[20px]">
                                {activeImageUrl && !activeImageFailed ? (
                                    <>
                                        <img
                                            src={activeImageUrl}
                                            alt={listing.title}
                                            className="h-full w-full object-cover"
                                            onError={() =>
                                                markImageFailed(activeImage)
                                            }
                                        />
                                        {listing.status === 'sold' && (
                                            <SoldBadge variant="overlay" />
                                        )}
                                        <WatchButton
                                            listingId={listing.id}
                                            isWatched={is_watched}
                                            variant="overlay"
                                        />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-[#4d627a] sm:gap-3">
                                        <Package
                                            size={48}
                                            className="opacity-20 sm:h-16 sm:w-16"
                                        />
                                        <span className="text-sm font-medium sm:text-base">
                                            {t('listing.show.no_images')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {imageUrls.length > 1 && (
                                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 sm:gap-3">
                                    {imageUrls.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={cn(
                                                'h-16 w-16 shrink-0 overflow-hidden rounded-[10px] border-2 transition-all sm:h-20 sm:w-20 sm:rounded-[14px]',
                                                activeImage === idx
                                                    ? 'border-[#0d9488]'
                                                    : 'border-transparent bg-[#e6ecf5] hover:border-[#ccd6e5]',
                                            )}
                                        >
                                            {failedImages.has(idx) ? (
                                                <div className="flex h-full w-full items-center justify-center text-[#4d627a]">
                                                    <Package
                                                        size={24}
                                                        className="opacity-30"
                                                    />
                                                </div>
                                            ) : (
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="h-full w-full object-cover"
                                                    onError={() =>
                                                        markImageFailed(idx)
                                                    }
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Title and Price Info */}
                <Card className="rounded-[16px] border-[#edf2f9] shadow-sm sm:rounded-[24px]">
                    <CardContent className="p-4 sm:p-8">
                        <div className="flex flex-col gap-4 sm:gap-6">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="h-6 rounded-full border-[#e2e8f0] bg-[#f1f5f9] px-3 text-[10px] font-medium text-[#475569] sm:h-7 sm:text-xs"
                                    >
                                        {listing.is_auction
                                            ? t('listing.show.auction')
                                            : t('listing.show.buy_now')}
                                    </Badge>
                                    {listing.status === 'sold' && (
                                        <SoldBadge className="h-6 rounded-full px-3 text-[10px] tracking-wider sm:h-7 sm:text-xs" />
                                    )}
                                </div>
                                <h1 className="text-xl leading-tight font-bold tracking-tight text-[#0b1b32] sm:text-[1.8rem]">
                                    {listing.title}
                                </h1>
                                {reserveNotMet && (
                                    <div className="rounded-[14px] border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800 sm:text-base">
                                        {t('listing.show.reserve_not_met')}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-between gap-6 rounded-[16px] border border-[#eef5fd] bg-[#f8fbfe] p-4 sm:rounded-[20px] sm:p-6 md:flex-row md:items-center">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-medium tracking-wider text-[#64748b] uppercase sm:text-sm">
                                        {listing.is_auction
                                            ? t('listing.show.current_price')
                                            : t('listing.create.price')}
                                    </span>
                                    <PriceDisplay
                                        price={displayPrice}
                                        size="xl"
                                    />
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 md:flex-col md:items-end md:gap-3">
                                    <div className="flex items-center gap-2">
                                        {listing.status !== 'sold' ? (
                                            <div className="flex items-center gap-2">
                                                {auth?.user &&
                                                    !auth.user.is_guest &&
                                                    Number(listing.user.id) !==
                                                        Number(
                                                            auth.user.id,
                                                        ) && (
                                                        <WatchButton
                                                            listingId={
                                                                listing.id
                                                            }
                                                            isWatched={
                                                                is_watched
                                                            }
                                                        />
                                                    )}
                                                {auth?.user &&
                                                    !auth.user.is_guest &&
                                                    Number(listing.user.id) ===
                                                        Number(auth.user.id) &&
                                                    !hasBids && (
                                                        <div className="flex w-full items-center gap-2 sm:w-auto">
                                                            <Link
                                                                href={`/listings/${listing.id}/edit`}
                                                                className="flex-1 sm:flex-none"
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-9 w-full rounded-full border-[#cbd5e1] px-5 text-[#475569] sm:h-10"
                                                                >
                                                                    {t(
                                                                        'common.edit',
                                                                    )}
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-9 flex-1 rounded-full border-red-200 px-5 text-red-500 hover:bg-red-50 sm:h-10 sm:flex-none"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            t(
                                                                                'listing.delete_confirm',
                                                                            ),
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            `/listings/${listing.id}`,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                    className="mr-1"
                                                                />
                                                                {t(
                                                                    'common.delete',
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                {(!auth?.user ||
                                                    auth.user.is_guest) && (
                                                    <WatchButton
                                                        listingId={listing.id}
                                                        isWatched={is_watched}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <SoldBadge />
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-[11px] font-medium tracking-wider text-[#64748b] uppercase md:flex-col md:items-end">
                                        <div className="flex items-center gap-2">
                                            <span>
                                                {t('listing.show.published')}:
                                            </span>
                                            <span className="text-[#0f172a]">
                                                {new Date(
                                                    listing.created_at,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {listing.auction_end_date && (
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    {t('listing.show.ends')}:
                                                </span>
                                                <span className="text-[#0f172a]">
                                                    {new Date(
                                                        listing.auction_end_date,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Item Information Grid */}
                <Card className="rounded-[14px] border-[#edf2f9] shadow-sm sm:rounded-[24px]">
                    <CardHeader className="px-4 pt-4 pb-1 sm:px-8 sm:pt-8 sm:pb-2">
                        <h2 className="flex flex-row items-center gap-2 text-base font-bold text-[#0b1b32] sm:text-lg">
                            <Info
                                size={18}
                                className="text-[#0d9488] sm:size-5"
                            />
                            {t('listing.show.details_title')}
                        </h2>
                    </CardHeader>
                    <CardContent className="p-4 pt-3 sm:p-8 sm:pt-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-[12px] border border-[#eef5fd] bg-[#f8fbfe] p-3 sm:gap-x-12 sm:gap-y-6 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
                            <InfoRow
                                label={t('listing.show.auction_id')}
                                value={`k${listing.id.toString().padStart(9, '0')}`}
                            />
                            <InfoRow
                                label={t('listing.show.start_price')}
                                value={`¥${listing.price.toLocaleString()}`}
                            />
                            <InfoRow
                                label={t('listing.show.published')}
                                value={new Date(
                                    listing.created_at,
                                ).toLocaleDateString()}
                            />
                            <InfoRow
                                label={t('listing.show.ends')}
                                value={
                                    listing.auction_end_date
                                        ? new Date(
                                              listing.auction_end_date,
                                          ).toLocaleDateString()
                                        : t('common.n_a')
                                }
                            />
                            <InfoRow
                                label={t('listing.show.location')}
                                value={
                                    listing.location ||
                                    t('common.not_specified')
                                }
                            />
                            <InfoRow
                                label={t('listing.show.auto_extension')}
                                value={t('common.yes')}
                            />
                            <InfoRow
                                label={t('listing.show.early_termination')}
                                value={t('common.permitted')}
                            />
                            <InfoRow
                                label={t('listing.show.returns')}
                                value={t('common.not_accepted')}
                            />
                            <InfoRow
                                label={t('listing.show.bid_restriction')}
                                value={t('common.none')}
                            />
                            <InfoRow
                                label={t('listing.show.condition')}
                                value={t(
                                    ITEM_CONDITIONS.find(
                                        (c) => c.value === listing.condition,
                                    )?.labelKey || 'common.not_specified',
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* DescriptionSection */}
                <Card className="rounded-[16px] border-[#edf2f9] shadow-sm sm:rounded-[24px]">
                    <CardHeader className="px-5 pt-6 pb-2 sm:px-8 sm:pt-8">
                        <h2 className="flex flex-row items-center gap-2 text-lg font-bold text-[#0b1b32]">
                            <FileText size={20} className="text-[#0d9488]" />
                            {t('listing.show.description_title')}
                        </h2>
                    </CardHeader>
                    <CardContent className="p-5 pt-2 sm:p-8 sm:pt-4">
                        <div className="rounded-[14px] border border-[#f0f5fa] bg-[#f9fcff] p-4 text-sm leading-relaxed whitespace-pre-wrap text-[#1d2b41] sm:rounded-[18px] sm:p-6 sm:text-base">
                            {listing.description}
                        </div>
                    </CardContent>
                </Card>

                {/* Recommendations Section */}
                <RecommendationsSection recommendations={recommendations} />
            </div>
        </BazaarLayout>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1.5">
            <span className="text-[0.625rem] leading-tight font-bold tracking-[0.04em] text-[#6f7d98] uppercase sm:text-[0.75rem] sm:tracking-[0.05em]">
                {label}
            </span>
            <span className="text-sm leading-snug font-semibold break-words text-[#1a263b] sm:text-base">
                {value}
            </span>
        </div>
    );
}
