import { Head, Link } from '@inertiajs/react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    display_price?: number;
    images: string[];
    main_image_url: string | null;
    status: string;
    user: {
        name: string;
        masked_name: string;
    };
    categories: Array<{
        name: string;
    }>;
}

interface Props {
    listings: Listing[];
}

export default function Watchlist({ listings }: Props) {
    const { t } = useTranslations();

    const formatCurrency = (amt: number) => {
        return Math.floor(amt).toLocaleString() + ' 円';
    };

    return (
        <BazaarLayout title={t('layout.sidebar.watchlist')}>
            <Head title={t('layout.sidebar.watchlist')} />

            <div className="flex flex-col gap-6">
                {listings.length === 0 ? (
                    <Card className="border-[#f0f2f5] bg-white shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fafcff]">
                                <Heart className="h-8 w-8 text-[#a3b6cc]" />
                            </div>
                            <div>
                                <h3 className="mb-1 text-xl font-semibold text-[#1a263b]">
                                    Your watchlist is empty
                                </h3>
                                <p className="text-[#5f6c84]">
                                    Save items you are interested in to keep
                                    track of them here.
                                </p>
                            </div>
                            <Link
                                href="/marketplace"
                                className="mt-2 inline-flex items-center justify-center rounded-md bg-[#0066cc] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0052a3]"
                            >
                                Browse Marketplace
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((listing) => {
                            const displayPrice =
                                listing.display_price ?? listing.price;

                            return (
                                <Link
                                    key={listing.id}
                                    href={`/listings/${listing.id}`}
                                >
                                    <Card className="flex h-full flex-col overflow-hidden rounded-[4px] border-[#f0f2f5] bg-white shadow-sm transition-shadow hover:shadow-md">
                                        <div className="relative aspect-[4/3] w-full bg-[#f8f9fa]">
                                            {listing.main_image_url ? (
                                                <img
                                                    src={listing.main_image_url}
                                                    alt={listing.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[#a3b6cc]">
                                                    No image
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <Badge className="border-0 bg-[#0066cc] text-white hover:bg-[#0066cc]">
                                                    {listing.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="flex flex-1 flex-col gap-2 p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[0.75rem] font-medium tracking-wider text-[#0066cc] uppercase">
                                                    {listing.categories?.[0]
                                                        ?.name ||
                                                        'Uncategorized'}
                                                </span>
                                                <h3 className="line-clamp-2 text-[1.05rem] leading-tight font-bold text-[#1a263b]">
                                                    {listing.title}
                                                </h3>
                                            </div>
                                            <div className="mt-auto pt-2">
                                                <span className="text-xl font-bold text-[#0b1a31]">
                                                    {formatCurrency(
                                                        displayPrice,
                                                    )}
                                                </span>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="text-[0.8rem] text-[#5f6c84]">
                                                        by{' '}
                                                        {listing.user
                                                            .masked_name ||
                                                            listing.user.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </BazaarLayout>
    );
}
