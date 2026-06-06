import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoldBadge } from './sold-badge';
import { FreeShippingBadge } from './free-shipping-badge';
import { AuctionCountdown } from './auction-countdown';
import { useTranslations } from '@/hooks/use-translations';
import { ITEM_CONDITIONS, type ItemCondition } from '@/types/item-conditions';

interface Listing {
    id: number;
    title: string;
    price: number;
    display_price?: number;
    images: string[];
    main_image_url?: string | null;
    status: string;
    location?: string | null;
    public_prefecture?: string | null;
    public_city?: string | null;
    condition?: ItemCondition | null;
    free_shipping?: boolean;
    is_auction?: boolean;
    auction_end_date?: string | null;
    auction_ended?: boolean;
}

interface ListingCardProps {
    listing: Listing;
    className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
    const { t } = useTranslations();
    const isSold = listing.status === 'sold';
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = listing.main_image_url ?? null;
    const displayPrice = listing.display_price ?? listing.price;
    const conditionLabelKey = ITEM_CONDITIONS.find(
        (condition) => condition.value === listing.condition,
    )?.labelKey;
    const locationLabel =
        [listing.public_prefecture, listing.public_city]
            .filter(Boolean)
            .join(', ') || listing.location;

    return (
        <Link
            href={`/listings/${listing.id}`}
            className={cn('group block', className)}
        >
            <Card className="overflow-hidden rounded-[20px] border-[#edf2f9] bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f5fd]">
                    {imageUrl && !imageFailed ? (
                        <img
                            src={imageUrl}
                            alt={listing.title}
                            className={cn(
                                'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
                                isSold && 'opacity-90 grayscale-[0.2]',
                            )}
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center opacity-20">
                            <Package size={40} />
                        </div>
                    )}

                    {isSold && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                            <SoldBadge variant="overlay" />
                        </div>
                    )}

                    <div className="absolute bottom-3 left-3">
                        <Badge className="border-none bg-white/95 px-3 py-1 text-sm font-bold text-[#0b1b32] shadow-sm hover:bg-white">
                            ¥{displayPrice.toLocaleString()}
                        </Badge>
                    </div>
                    {listing.free_shipping && (
                        <FreeShippingBadge
                            className="absolute top-3 right-3"
                            compact
                        />
                    )}
                    {listing.is_auction &&
                        listing.auction_end_date &&
                        !isSold && (
                            <AuctionCountdown
                                endsAt={listing.auction_end_date}
                                ended={listing.auction_ended}
                                variant="overlay"
                                className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)]"
                            />
                        )}
                </div>
                <CardContent className="p-4">
                    <h3 className="truncate leading-tight font-bold text-[#0b1b32] transition-colors group-hover:text-[#0d9488]">
                        {listing.title}
                    </h3>
                    {(conditionLabelKey || locationLabel) && (
                        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5f6c84]">
                            {conditionLabelKey && (
                                <span className="inline-flex min-w-0 items-center gap-1">
                                    <Tag className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">
                                        {t(conditionLabelKey)}
                                    </span>
                                </span>
                            )}
                            {locationLabel && (
                                <span className="inline-flex min-w-0 items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">
                                        {locationLabel}
                                    </span>
                                </span>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
