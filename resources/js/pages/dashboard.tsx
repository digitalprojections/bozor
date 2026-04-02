import { Head, Link, usePage } from '@inertiajs/react';
import { DashboardProfileCard } from '@/components/dashboard/dashboard-profile-card';
import { BazaarBalanceSection } from '@/components/dashboard/bazaar-balance-section';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingBag } from 'lucide-react';
import { RecommendationsSection } from '@/components/listings/recommendations-section';

export default function Dashboard({
    isVerified = false,
    stats,
    listings = [],
    recommendations = []
}: {
    isVerified?: boolean;
    stats?: any;
    listings?: any[];
    recommendations?: any[];
}) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const { t } = useTranslations();

    const breadcrumbs: any[] = [];

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-[#0b1a31]">
                        {t('dashboard.listings.title')}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link href="/dashboard/won-items" className="text-sm font-semibold text-[#2b4b8f] hover:underline flex items-center gap-1">
                            <ShoppingBag size={14} /> {t('dashboard.won_items.title')}
                        </Link>
                        <Link href="/listings/create" className="text-sm font-semibold text-[#0d9488] hover:underline">
                            + {t('dashboard.listings.create_new')}
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {listings.length > 0 ? (
                        listings.map((listing) => (
                            <Card key={listing.id} className="rounded-[4px] border-[#f0f2f5] shadow-sm overflow-hidden hover:border-[#ced9e5] transition-colors">
                                <CardContent className="p-4 flex flex-col xs:flex-row items-start xs:items-center gap-4">
                                    <div className="h-16 w-16 rounded bg-[#f0f5fd] flex items-center justify-center shrink-0 border border-[#e1e9f2]">
                                        {listing.images && listing.images.length > 0 ? (
                                            <img src={`/storage/${listing.images[0]}`} alt="" className="h-full w-full object-cover rounded" />
                                        ) : (
                                            <Package className="text-[#a3b6cc]" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[#1a263b] truncate">{listing.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[#5f6c84]">
                                            <span className="font-bold text-[#0e1d38]">¥{listing.price.toLocaleString()}</span>
                                            <span className="hidden xs:inline">•</span>
                                            <span className="capitalize">{t('dashboard.status.' + listing.status)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full xs:w-auto justify-end mt-2 xs:mt-0">
                                        <Link
                                            href={`/listings/${listing.id}/edit`}
                                            className="px-4 py-2 text-sm font-semibold bg-[#f3f9ff] text-[#2b4b8f] rounded-full hover:bg-[#e1f0ff] flex-1 xs:flex-none text-center"
                                        >
                                            {t('common.edit')}
                                        </Link>
                                        <Link
                                            href={`/listings/${listing.id}`}
                                            className="px-4 py-2 text-sm font-semibold bg-[#f0f5fd] text-[#2b4b8f] rounded-full hover:bg-[#e1ecfb] flex-1 xs:flex-none text-center"
                                        >
                                            {t('common.view')}
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="rounded-[4px] border-[#f0f2f5] shadow-sm p-12 text-center text-[#5f6c84]">
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
