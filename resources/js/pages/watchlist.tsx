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
    images: string[];
    status: string;
    user: {
        name: string;
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
                        <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-4">
                            <div className="h-16 w-16 bg-[#fafcff] rounded-full flex items-center justify-center">
                                <Heart className="h-8 w-8 text-[#a3b6cc]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#1a263b] mb-1">Your watchlist is empty</h3>
                                <p className="text-[#5f6c84]">Save items you are interested in to keep track of them here.</p>
                            </div>
                            <Link
                                href="/marketplace"
                                className="mt-2 inline-flex items-center justify-center rounded-md bg-[#0066cc] px-6 py-2 text-sm font-medium text-white hover:bg-[#0052a3] transition-colors"
                            >
                                Browse Marketplace
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <Link key={listing.id} href={`/listings/${listing.id}`}>
                                <Card className="overflow-hidden rounded-[4px] border-[#f0f2f5] bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                    <div className="aspect-[4/3] w-full bg-[#f8f9fa] relative">
                                        {listing.images && listing.images[0] ? (
                                            <img
                                                src={`/storage/${listing.images[0]}`}
                                                alt={listing.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-[#a3b6cc]">
                                                No image
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-[#0066cc] hover:bg-[#0066cc] text-white border-0">
                                                {listing.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 flex flex-col flex-1 gap-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[0.75rem] font-medium text-[#0066cc] uppercase tracking-wider">
                                                {listing.categories?.[0]?.name || 'Uncategorized'}
                                            </span>
                                            <h3 className="text-[1.05rem] font-bold text-[#1a263b] line-clamp-2 leading-tight">
                                                {listing.title}
                                            </h3>
                                        </div>
                                        <div className="mt-auto pt-2">
                                            <span className="text-xl font-bold text-[#0b1a31]">{formatCurrency(listing.price)}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[0.8rem] text-[#5f6c84]">by {listing.user.name}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </BazaarLayout>
    );
}
