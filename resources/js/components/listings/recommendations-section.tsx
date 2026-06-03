import { Link } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { FreeShippingBadge } from '@/components/listings/free-shipping-badge';
import { AuctionCountdown } from '@/components/listings/auction-countdown';

interface Listing {
    id: number;
    title: string;
    price: number;
    display_price?: number;
    status: string;
    images?: string[];
    main_image_url?: string;
    free_shipping?: boolean;
    is_auction?: boolean;
    auction_end_date?: string | null;
    auction_ended?: boolean;
}

interface RecommendationsSectionProps {
    recommendations: Listing[];
    title?: string;
}

export function RecommendationsSection({
    recommendations,
    title,
}: RecommendationsSectionProps) {
    const { t } = useTranslations();

    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <section className="mt-2 flex flex-col gap-3 border-t border-[#eeeeee] bg-white px-3 py-4 sm:px-4">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#222222] sm:text-lg">
                    {title || t('dashboard.recommendations.title')}
                </h2>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
                {recommendations.map((item) => {
                    const imageUrl = item.main_image_url || null;
                    const displayPrice = item.display_price ?? item.price;

                    return (
                        <Link
                            key={item.id}
                            href={`/listings/${item.id}`}
                            className="group flex max-w-[104px] min-w-[104px] flex-col gap-1.5 sm:max-w-[116px] sm:min-w-[116px]"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-sm bg-[#f5f5f5]">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Package
                                            className="text-[#b9b9b9]"
                                            size={26}
                                        />
                                    </div>
                                )}
                                <span className="absolute bottom-0 left-0 rounded-tr-sm bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-white">
                                    ¥{displayPrice.toLocaleString()}
                                </span>
                                {item.free_shipping && (
                                    <FreeShippingBadge
                                        className="absolute top-1 left-1"
                                        compact
                                    />
                                )}
                                {item.is_auction &&
                                    item.auction_end_date &&
                                    item.status !== 'sold' && (
                                        <AuctionCountdown
                                            endsAt={item.auction_end_date}
                                            ended={item.auction_ended}
                                            variant="compact"
                                            className="absolute top-1 right-1 max-w-[calc(100%-0.5rem)] shadow-sm"
                                        />
                                    )}
                            </div>
                            <span className="line-clamp-2 text-xs leading-snug text-[#333333] group-hover:text-[#e62017]">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
