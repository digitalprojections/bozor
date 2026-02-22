import { ShoppingCart, Package, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { Link } from '@inertiajs/react';

interface Stats {
    active_listings: number;
    sold_items: number;
    total_earnings: number;
    cart_items: number;
}

export function MarketplaceHeader({ stats }: { stats: Stats }) {
    const { t } = useTranslations();
    const statCards = [
        {
            label: t('marketplace.stats.active_listings'),
            value: stats.active_listings,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950',
        },
        {
            label: t('marketplace.stats.sold_items'),
            value: stats.sold_items,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950',
        },
        {
            label: t('marketplace.stats.total_earnings'),
            value: `¥${stats.total_earnings.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950',
        },
        {
            label: t('marketplace.stats.cart'),
            value: stats.cart_items,
            icon: ShoppingCart,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('marketplace.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('marketplace.description')}
                    </p>
                </div>
                <Link href="/listings/create">
                    <Button size="lg">
                        <Package className="mr-2 h-4 w-4" />
                        {t('marketplace.create_listing')}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`rounded-full p-3 ${stat.bgColor}`}
                                >
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
