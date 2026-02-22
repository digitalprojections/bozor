import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, Clock, Info, FileText } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { ListingSidebar } from '@/components/listings/listing-sidebar';
import { RecommendationsSection } from '@/components/listings/recommendations-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePage } from '@inertiajs/react';
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
}

export default function Show({ listing, recommendations = [] }: ListingProps) {
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
            <Head title={`${listing.title} - ${t('marketplace.title')}`} />

            <div className="flex flex-col gap-8">
                {/* Images Section */}
                <Card className="rounded-[24px] border-[#edf2f9] shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                            <div className="main-image-placeholder aspect-[4/3] w-full bg-[#d9e2ef] rounded-[20px] overflow-hidden flex items-center justify-center border border-[#e1e9f2]">
                                {listing.images && listing.images.length > 0 ? (
                                    <img
                                        src={`/storage/${listing.images[activeImage]}`}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-[#4d627a]">
                                        <Package size={64} className="opacity-20" />
                                        <span className="font-medium">{t('listing.show.no_images')}</span>
                                    </div>
                                )}
                            </div>

                            {listing.images && listing.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {listing.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`h-20 w-20 shrink-0 rounded-[14px] overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#0d9488]' : 'border-transparent bg-[#e6ecf5] hover:border-[#ccd6e5]'
                                                }`}
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
                <Card className="rounded-[24px] border-[#edf2f9] shadow-sm">
                    <CardContent className="p-8">
                        <h1 className="text-[1.8rem] font-bold tracking-tight text-[#0b1b32] leading-tight mb-6">
                            {listing.title}
                        </h1>

                        <div className="bg-[#f8fbfe] border border-[#eef5fd] rounded-[20px] p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[#64748b] text-sm font-medium uppercase tracking-wider">{t('listing.show.current_price')}</span>
                                <span className="text-4xl font-bold text-[#0e1d38]">
                                    ¥{listing.price.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-2">
                                    {(listing as any).user_id === (auth.user as any)?.id && (
                                        <Link href={`/listings/${listing.id}/edit`}>
                                            <Button variant="outline" size="sm" className="rounded-full">
                                                {t('common.edit')}
                                            </Button>
                                        </Link>
                                    )}
                                    <span className="text-xs bg-[#eef2f6] text-[#2c3e50] px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                                        <Clock size={14} />
                                        {t('listing.show.ends')}: 2/22 (Sun) 19:30
                                    </span>
                                </div>
                                <Badge variant="destructive" className="bg-[#fce8e8] text-[#b13e3e] hover:bg-[#fce8e8] rounded-full px-3 h-7 border-none font-medium">
                                    {listing.is_auction ? t('listing.show.auction') : t('dashboard.status.' + listing.status)}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Item Information Grid */}
                <Card className="rounded-[24px] border-[#edf2f9] shadow-sm">
                    <CardHeader className="px-8 pt-8 pb-2">
                        <h2 className="font-bold text-lg text-[#0b1b32] flex flex-row items-center gap-2">
                            <Info size={20} className="text-[#0d9488]" />
                            {t('listing.show.details_title')}
                        </h2>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                            <InfoRow label={t('listing.show.auction_id')} value={`k${listing.id.toString().padStart(9, '0')}`} />
                            <InfoRow label={t('listing.show.start_price')} value={`¥${listing.price.toLocaleString()}`} />
                            <InfoRow label={t('listing.show.start_date')} value={new Date(listing.created_at).toLocaleDateString()} />
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
                <Card className="rounded-[24px] border-[#edf2f9] shadow-sm">
                    <CardHeader className="px-8 pt-8 pb-2">
                        <h2 className="font-bold text-lg text-[#0b1b32] flex flex-row items-center gap-2">
                            <FileText size={20} className="text-[#0d9488]" />
                            {t('listing.show.description_title')}
                        </h2>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="bg-[#f9fcff] border border-[#f0f5fa] rounded-[18px] p-6 text-[#1d2b41] leading-relaxed whitespace-pre-wrap">
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

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[0.75rem] font-bold text-[#6f7d98] uppercase tracking-[0.05em]">{label}</span>
            <span className="font-semibold text-[#1a263b]">{value}</span>
        </div>
    );
}
