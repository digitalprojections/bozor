import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoldBadge } from './sold-badge';

interface Listing {
    id: number;
    title: string;
    price: number;
    images: string[];
    status: string;
}

interface ListingCardProps {
    listing: Listing;
    className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
    const isSold = listing.status === 'sold';

    return (
        <Link href={`/listings/${listing.id}`} className={cn("block group", className)}>
            <Card className="rounded-[20px] border-[#edf2f9] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white">
                <div className="aspect-[4/3] bg-[#f0f5fd] relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                        <img
                            src={`/storage/${listing.images[0]}`}
                            alt={listing.title}
                            className={cn(
                                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                                isSold && "grayscale-[0.2] opacity-90"
                            )}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                            <Package size={40} />
                        </div>
                    )}
                    
                    {isSold && (
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                            <SoldBadge variant="overlay" />
                        </div>
                    )}

                    <div className="absolute bottom-3 left-3">
                        <Badge className="bg-white/95 text-[#0b1b32] hover:bg-white border-none font-bold shadow-sm px-3 py-1 text-sm">
                            ¥{listing.price.toLocaleString()}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-bold text-[#0b1b32] truncate leading-tight group-hover:text-[#0d9488] transition-colors">
                        {listing.title}
                    </h3>
                </CardContent>
            </Card>
        </Link>
    );
}
