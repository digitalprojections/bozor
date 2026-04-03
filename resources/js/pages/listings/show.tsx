import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, Clock, Info, FileText, Heart, Trash2 } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/use-translations';
import { ListingSidebar } from '@/components/listings/listing-sidebar';
import { RecommendationsSection } from '@/components/listings/recommendations-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePage, router } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { ITEM_CONDITIONS } from '@/types/item-conditions';

interface ListingProps {
    listing: {
        id: number;
        title: string;
        description: string;
        price: number;
        status: string;
        created_at: string;
        location: string | null;
        images: string[];
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
        current_high_bid: number;
        bids_count?: number;
    };
    recommendations?: any[];
    is_watched?: boolean;
}

export default function Show({ listing, recommendations = [], is_watched = false }: ListingProps) {
    const { t } = useTranslations();
    const { auth } = usePage().props as any;
    const [activeImage, setActiveImage] = useState(0);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('marketplace.title'), href: '/marketplace' },
        { title: t('listing.show.title'), href: '#' },
    ];

    return (
        <BazaarLayout
            title={t('listing.show.title')}
            breadcrumbs={breadcrumbs}
            sidebar={<ListingSidebar listing={listing} />}
        >
            <Head title={`${listing.title} - ${t('marketplace.title')}`}>
                <link rel="canonical" href={`${window.location.origin}/listings/${listing.id}`} />
                <meta name="description" content={listing.description.substring(0, 160)} />

                <meta property="og:title" content={listing.title} />
                <meta property="og:description" content={listing.description.substring(0, 160)} />
                <meta property="og:type" content="product" />
                {listing.images && listing.images.length > 0 && (
                    <meta property="og:image" content={`${window.location.origin}/storage/${listing.images[0]}`} />
                )}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": listing.title,
                        "image": listing.images.map(img => `${window.location.origin}/storage/${img}`),
                        "description": listing.description,
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "JPY",
                            "price": listing.price,
                            "availability": "https://schema.org/InStock",
                            "url": `${window.location.origin}/listings/${listing.id}`,
                            "areaServed": {
                                "@type": "Country",
                                "name": "Japan"
                            },
                            "eligibleRegion": listing.location ? {
                                "@type": "State",
                                "name": listing.location
                            } : undefined
                        }
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": t('marketplace.title'),
                                "item": `${window.location.origin}/marketplace`
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": listing.title,
                                "item": `${window.location.origin}/listings/${listing.id}`
                            }
                        ]
                    })}
                </script>
            </Head>



            <div className="flex flex-col gap-8">
                {/* Images Section */}
                <Card className="rounded-[16px] sm:rounded-[24px] border-[#edf2f9] shadow-sm overflow-hidden">
                    <CardContent className="p-3 sm:p-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="main-image-placeholder aspect-[4/3] w-full bg-[#d9e2ef] rounded-[12px] sm:rounded-[20px] overflow-hidden flex items-center justify-center border border-[#e1e9f2]">
                                {listing.images && listing.images.length > 0 ? (
                                    <img
                                        src={`/storage/${listing.images[activeImage]}`}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 sm:gap-3 text-[#4d627a]">
                                        <Package size={48} className="opacity-20 sm:w-16 sm:h-16" />
                                        <span className="font-medium text-sm sm:text-base">{t('listing.show.no_images')}</span>
                                    </div>
                                )}
                            </div>

                            {listing.images && listing.images.length > 1 && (
                                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {listing.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={cn(
                                                "h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-[10px] sm:rounded-[14px] overflow-hidden border-2 transition-all",
                                                activeImage === idx ? 'border-[#0d9488]' : 'border-transparent bg-[#e6ecf5] hover:border-[#ccd6e5]'
                                            )}
                                        >
                                            <img
                                                src={`/storage/${img}`}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Title and Price Info */}
                <Card className="rounded-[16px] sm:rounded-[24px] border-[#edf2f9] shadow-sm">
                    <CardContent className="p-4 sm:p-8">
                        <div className="flex flex-col gap-4 sm:gap-6">
                            <div className="flex flex-col gap-3">
                                <Badge variant="destructive" className="bg-[#fce8e8] text-[#b13e3e] hover:bg-[#fce8e8] rounded-full px-3 h-6 sm:h-7 border-none font-medium w-fit text-[10px] sm:text-xs">
                                    {listing.is_auction ? t('listing.show.auction') : t('dashboard.status.' + listing.status)}
                                </Badge>
                                <h1 className="text-xl sm:text-[1.8rem] font-bold tracking-tight text-[#0b1b32] leading-tight">
                                    {listing.title}
                                </h1>
                            </div>

                            <div className="bg-[#f8fbfe] border border-[#eef5fd] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#64748b] text-[10px] sm:text-sm font-medium uppercase tracking-wider">
                                        {listing.is_auction ? t('listing.show.current_price') : t('listing.create.price')}
                                    </span>
                                    <span className="text-2xl sm:text-4xl font-bold text-[#101b2d]">
                                        ¥{listing.price.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row md:flex-col md:items-end gap-4 sm:gap-6 md:gap-3">
                                    <div className="flex items-center gap-2">
                                        {(auth?.user && !auth.user.is_guest && Number(listing.user.id) !== Number(auth.user.id)) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "rounded-full h-9 sm:h-10 px-5 flex items-center gap-2 transition-all flex-1 sm:flex-none",
                                                    is_watched ? 'border-[#ff4d4f] text-[#ff4d4f] bg-[#fff1f0]' : 'border-[#cbd5e1] text-[#475569] hover:bg-slate-50'
                                                )}
                                                onClick={() => router.post(`/watchlist/${listing.id}/toggle`, {}, { preserveScroll: true })}
                                            >
                                                <Heart size={16} className={is_watched ? 'fill-current' : ''} />
                                                <span className="font-semibold text-sm">{is_watched ? 'Watched' : 'Watch'}</span>
                                            </Button>
                                        )}
                                        {auth?.user && !auth.user.is_guest && Number(listing.user.id) === Number(auth.user.id) && (
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <Link href={`/listings/${listing.id}/edit`} className="flex-1 sm:flex-none">
                                                    <Button variant="outline" size="sm" className="rounded-full w-full h-9 sm:h-10 px-5 border-[#cbd5e1] text-[#475569]">
                                                        {t('common.edit')}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full h-9 sm:h-10 px-5 border-red-200 text-red-500 hover:bg-red-50 flex-1 sm:flex-none"
                                                    onClick={() => {
                                                        if (confirm(t('listing.delete_confirm'))) {
                                                            router.delete(`/listings/${listing.id}`);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={14} className="mr-1" />
                                                    {t('common.delete')}
                                                </Button>
                                            </div>
                                        )}
                                        {(!auth?.user || auth.user.is_guest) && (
                                             <Link href="/login" className="flex-1 sm:flex-none">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full h-9 sm:h-10 px-5 flex items-center gap-2 border-[#cbd5e1] text-[#475569] hover:bg-slate-50 w-full"
                                                >
                                                    <Heart size={16} />
                                                    <span className="font-semibold text-sm">{t('listing.sidebar.add_to_watchlist')}</span>
                                                </Button>
                                            </Link>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap md:flex-col md:items-end gap-2 sm:gap-3 md:gap-2">
                                        <div className="text-[10px] sm:text-xs bg-white border border-[#e2e8f0] text-[#475569] px-3 py-1.5 rounded-full font-medium flex items-center gap-2 shadow-sm">
                                            <Clock size={12} className="text-[#0d9488]" />
                                            <span className="opacity-70">{t('listing.show.published')}:</span>
                                            <span className="text-[#0f172a]">{new Date(listing.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-[10px] sm:text-xs bg-white border border-[#e2e8f0] text-[#475569] px-3 py-1.5 rounded-full font-medium flex items-center gap-2 shadow-sm">
                                            <Clock size={12} className="text-[#0d9488]" />
                                            <span className="opacity-70">{t('listing.show.ends')}:</span>
                                            <span className="text-[#0f172a]">{listing.auction_end_date ? new Date(listing.auction_end_date).toLocaleDateString() : t('common.n_a')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Item Information Grid */}
                <Card className="rounded-[16px] sm:rounded-[24px] border-[#edf2f9] shadow-sm">
                    <CardHeader className="px-5 sm:px-8 pt-5 sm:pt-8 pb-2">
                        <h2 className="font-bold text-lg text-[#0b1b32] flex flex-row items-center gap-2">
                            <Info size={20} className="text-[#0d9488]" />
                            {t('listing.show.details_title')}
                        </h2>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-8 pt-4 sm:pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                            <InfoRow label={t('listing.show.auction_id')} value={`k${listing.id.toString().padStart(9, '0')}`} />
                            <InfoRow label={t('listing.show.start_price')} value={`¥${listing.price.toLocaleString()}`} />
                            <InfoRow label={t('listing.show.published')} value={new Date(listing.created_at).toLocaleDateString()} />
                            <InfoRow label={t('listing.show.ends')} value={listing.auction_end_date ? new Date(listing.auction_end_date).toLocaleDateString() : t('common.n_a')} />
                            <InfoRow label={t('listing.show.location')} value={listing.location || t('common.not_specified')} />
                            <InfoRow label={t('listing.show.auto_extension')} value={t('common.yes')} />
                            <InfoRow label={t('listing.show.early_termination')} value={t('common.permitted')} />
                            <InfoRow label={t('listing.show.returns')} value={t('common.not_accepted')} />
                            <InfoRow label={t('listing.show.bid_restriction')} value={t('common.none')} />
                            <InfoRow label={t('listing.show.condition')} value={t(ITEM_CONDITIONS.find(c => c.value === listing.condition)?.labelKey || 'common.not_specified')} />
                        </div>
                    </CardContent>
                </Card>

                {/* DescriptionSection */}
                <Card className="rounded-[16px] sm:rounded-[24px] border-[#edf2f9] shadow-sm">
                    <CardHeader className="px-5 sm:px-8 pt-6 sm:pt-8 pb-2">
                        <h2 className="font-bold text-lg text-[#0b1b32] flex flex-row items-center gap-2">
                            <FileText size={20} className="text-[#0d9488]" />
                            {t('listing.show.description_title')}
                        </h2>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-8 pt-2 sm:pt-4">
                        <div className="bg-[#f9fcff] border border-[#f0f5fa] rounded-[14px] sm:rounded-[18px] p-4 sm:p-6 text-[#1d2b41] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                            {listing.description}
                        </div>
                    </CardContent>
                </Card>

                {/* Recommendations Section */}
                <RecommendationsSection recommendations={recommendations} />
            </div>
        </BazaarLayout >
    );
}

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[0.75rem] font-bold text-[#6f7d98] uppercase tracking-[0.05em]">{label}</span>
            <span className="font-semibold text-[#1a263b]">{value}</span>
        </div>
    );
}
