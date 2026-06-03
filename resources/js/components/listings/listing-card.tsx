import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoldBadge } from './sold-badge';
import { FreeShippingBadge } from './free-shipping-badge';
import { AuctionCountdown } from './auction-countdown';

interface Listing {
    id: number;
    title: string;
    price: number;
    display_price?: number;
    images: string[];
    main_image_url?: string | null;
    status: string;
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
    const isSold = listing.status === 'sold';
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = listing.main_image_url ?? null;
    const displayPrice = listing.display_price ?? listing.price;

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
                    {listing.free_shipping && (
                        <FreeShippingBadge className="mt-2" compact />
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
