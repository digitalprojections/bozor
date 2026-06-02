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
    recommendations = [],
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
                <div className="flex flex-col justify-between gap-3 px-2 sm:flex-row sm:items-center">
                    <h2 className="text-xl font-bold tracking-tight text-[#0b1a31]">
                        {t('dashboard.listings.title')}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link
                            href="/dashboard/won-items"
                            className="flex items-center gap-1 text-sm font-semibold text-[#2b4b8f] hover:underline"
                        >
                            <ShoppingBag size={14} />{' '}
                            {t('dashboard.won_items.title')}
                        </Link>
                        <Link
                            href="/listings/create"
                            className="text-sm font-semibold text-[#0d9488] hover:underline"
                        >
                            + {t('dashboard.listings.create_new')}
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {listings.length > 0 ? (
                        listings.map((listing) => {
                            const displayPrice =
                                listing.display_price ?? listing.price;
                            const hasBids = (listing.bids_count ?? 0) > 0;

                            return (
                                <Card
                                    key={listing.id}
                                    className="overflow-hidden rounded-[4px] border-[#f0f2f5] shadow-sm transition-colors hover:border-[#ced9e5]"
                                >
                                    <CardContent className="xs:flex-row xs:items-center flex flex-col items-start gap-4 p-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-[#e1e9f2] bg-[#f0f5fd]">
                                            {listing.main_image_url ? (
                                                <img
                                                    src={listing.main_image_url}
                                                    alt=""
                                                    className="h-full w-full rounded object-cover"
                                                />
                                            ) : (
                                                <Package
                                                    className="text-[#a3b6cc]"
                                                    size={24}
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold text-[#1a263b]">
                                                {listing.title}
                                            </h3>
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#5f6c84]">
                                                <span className="font-bold text-[#0e1d38]">
                                                    ¥
                                                    {displayPrice.toLocaleString()}
                                                </span>
                                                <span className="xs:inline hidden">
                                                    •
                                                </span>
                                                <span className="capitalize">
                                                    {t(
                                                        'dashboard.status.' +
                                                            listing.status,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="xs:w-auto xs:mt-0 mt-2 flex w-full justify-end gap-2">
                                            {!hasBids && (
                                                <Link
                                                    href={`/listings/${listing.id}/edit`}
                                                    className="xs:flex-none flex-1 rounded-full bg-[#f3f9ff] px-4 py-2 text-center text-sm font-semibold text-[#2b4b8f] hover:bg-[#e1f0ff]"
                                                >
                                                    {t('common.edit')}
                                                </Link>
                                            )}
                                            <Link
                                                href={`/listings/${listing.id}`}
                                                className="xs:flex-none flex-1 rounded-full bg-[#f0f5fd] px-4 py-2 text-center text-sm font-semibold text-[#2b4b8f] hover:bg-[#e1ecfb]"
                                            >
                                                {t('common.view')}
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <Card className="rounded-[4px] border-[#f0f2f5] p-12 text-center text-[#5f6c84] shadow-sm">
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
