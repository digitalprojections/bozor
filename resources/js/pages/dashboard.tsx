import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard, home } from '@/routes';
import { StatsCard } from '@/components/dashboard/stats-card';
import type { DashboardStats, Listing, Transaction } from '@/types/dashboard';
import { useTranslations } from '@/hooks/use-translations';
import { Package, DollarSign, Eye, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerificationStatusCard } from '@/components/verification-status-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: DashboardStats;
    listings: Listing[];
    transactions: Transaction[];
    verificationRequest?: any;
    isVerified: boolean;
}

export default function Dashboard({ stats, listings, transactions, verificationRequest, isVerified }: DashboardProps) {
    const { t } = useTranslations();

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'sold':
                return 'secondary';
            case 'draft':
                return 'outline';
            case 'archived':
                return 'destructive';
            default:
                return 'default';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('common.dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title={t('dashboard.stats.total_listings')}
                        value={stats.total_listings}
                        icon={<Package className="size-5" />}
                    />
                    <StatsCard
                        title={t('dashboard.stats.active_listings')}
                        value={stats.active_listings}
                        icon={<ShoppingCart className="size-5" />}
                    />
                    <StatsCard
                        title={t('dashboard.stats.total_views')}
                        value={stats.total_views.toLocaleString()}
                        icon={<Eye className="size-5" />}
                    />
                    <StatsCard
                        title={t('dashboard.stats.revenue')}
                        value={formatCurrency(stats.total_revenue)}
                        icon={<DollarSign className="size-5" />}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Listings Section */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{t('dashboard.listings.title')}</CardTitle>
                                    <CardDescription>
                                        {t('dashboard.listings.manage_description')}
                                    </CardDescription>
                                </div>
                                <Link href="/listings/create">
                                    <Button size="sm">{t('dashboard.listings.create_new')}</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {listings.length === 0 ? (
                                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                                    {t('dashboard.listings.no_results')}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {listings.slice(0, 5).map((listing) => (
                                        <div
                                            key={listing.id}
                                            className="flex items-center gap-4 rounded-lg border p-4"
                                        >
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                                {listing.main_image_url ? (
                                                    <img
                                                        src={listing.main_image_url}
                                                        alt={listing.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Package className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="font-medium">{listing.title}</h4>
                                                    <Badge variant={getStatusBadgeVariant(listing.status)}>
                                                        {t(`dashboard.status.${listing.status}`)}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {(listing.categories && listing.categories.length > 0)
                                                        ? listing.categories[0].name
                                                        : 'Uncategorized'} • {formatCurrency(listing.price)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {listing.views} {t('dashboard.stats.views')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Transactions Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.transactions.title')}</CardTitle>
                            <CardDescription>
                                {t('dashboard.transactions.recent_activity')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Verification Status */}
                            <div className="mb-6">
                                <VerificationStatusCard
                                    verificationRequest={verificationRequest}
                                    isVerified={isVerified}
                                />
                            </div>

                            {/* Transactions List */}
                            <div>
                                <h3 className="mb-4 font-semibold">{t('dashboard.transactions.title')}</h3>
                                {transactions.length === 0 ? (
                                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                                        {t('dashboard.transactions.no_results')}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {transactions.map((transaction) => (
                                            <div key={transaction.id} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium">
                                                        {transaction.listing.title}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            transaction.status === 'completed'
                                                                ? 'default'
                                                                : transaction.status === 'pending'
                                                                    ? 'secondary'
                                                                    : 'destructive'
                                                        }
                                                    >
                                                        {transaction.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatCurrency(transaction.amount)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
