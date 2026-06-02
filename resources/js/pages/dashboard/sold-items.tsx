import { Head, Link } from '@inertiajs/react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    ShoppingBag,
    Trophy,
    ArrowLeft,
    Clock,
    CreditCard,
    ChevronRight,
    Truck,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import {
    TRANSACTION_STATUS,
    type TransactionStatus,
} from '@/types/transaction-status';
import { cn } from '@/lib/utils';
import { TransactionStatusBadge } from '@/components/transactions/status-badge';
import { PriceDisplay } from '@/components/listings/price-display';
import { UserRatingBadge } from '@/components/user-rating-badge';

interface SoldItem {
    id: number;
    transaction_id: number;
    title: string;
    price: number;
    buyer: {
        id: number;
        name: string;
        avatar_url: string;
    };
    images: string[] | null;
    main_image_url: string | null;
    sold_at: string;
    type: 'purchase' | 'auction';
    status: TransactionStatus;
}

export default function SoldItems({ items }: { items: SoldItem[] }) {
    const { t } = useTranslations();
    const [activeFilter, setActiveFilter] = useState<
        'all' | 'pending' | 'active' | 'completed' | 'cancelled'
    >('all');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('common.dashboard'), href: '/dashboard' },
        { title: t('dashboard.sold_items.title') || 'Sold Items', href: '#' },
    ];

    const filteredItems = items.filter((item) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'pending')
            return item.status === TRANSACTION_STATUS.PENDING_PAYMENT;
        if (activeFilter === 'active') {
            return [
                TRANSACTION_STATUS.PAID,
                TRANSACTION_STATUS.SHIPPED,
                TRANSACTION_STATUS.DELIVERED,
            ].includes(item.status);
        }
        if (activeFilter === 'completed')
            return item.status === TRANSACTION_STATUS.RECEIVED;
        if (activeFilter === 'cancelled')
            return item.status === TRANSACTION_STATUS.CANCELLED;
        return true;
    });

    return (
        <BazaarLayout
            title={t('dashboard.sold_items.title') || 'Sold Items'}
            breadcrumbs={breadcrumbs}
        >
            <Head title={t('dashboard.sold_items.title') || 'Sold Items'} />

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 px-2">
                    <h1 className="text-2xl font-bold tracking-tight text-[#0b1a31]">
                        {t('dashboard.sold_items.title') || 'Sold Items'}
                    </h1>
                    <p className="text-sm text-[#5f6c84]">
                        {t('dashboard.sold_items.subtitle') ||
                            'Manage your sales and shipping progress'}
                    </p>
                </div>

                <div className="no-scrollbar flex overflow-x-auto border-b border-[#f0f2f5]">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={cn(
                            'px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors',
                            activeFilter === 'all'
                                ? 'border-b-2 border-[#2b4b8f] text-[#2b4b8f]'
                                : 'text-[#5f6c84] hover:text-[#1a263b]',
                        )}
                    >
                        {t('marketplace.filters.all')}
                    </button>
                    <button
                        onClick={() => setActiveFilter('pending')}
                        className={cn(
                            'flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors',
                            activeFilter === 'pending'
                                ? 'border-b-2 border-[#2b4b8f] text-[#2b4b8f]'
                                : 'text-[#5f6c84] hover:text-[#1a263b]',
                        )}
                    >
                        <CreditCard size={14} />
                        {t('transaction.status.pending_payment') ||
                            'Awaiting Payment'}
                        {items.filter(
                            (i) =>
                                i.status === TRANSACTION_STATUS.PENDING_PAYMENT,
                        ).length > 0 && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[0.65rem] text-amber-700">
                                {
                                    items.filter(
                                        (i) =>
                                            i.status ===
                                            TRANSACTION_STATUS.PENDING_PAYMENT,
                                    ).length
                                }
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveFilter('active')}
                        className={cn(
                            'flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors',
                            activeFilter === 'active'
                                ? 'border-b-2 border-[#2b4b8f] text-[#2b4b8f]'
                                : 'text-[#5f6c84] hover:text-[#1a263b]',
                        )}
                    >
                        <Truck size={14} />
                        {t('transaction.status.pending') ||
                            'To Ship / In Transit'}
                    </button>
                    <button
                        onClick={() => setActiveFilter('completed')}
                        className={cn(
                            'px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors',
                            activeFilter === 'completed'
                                ? 'border-b-2 border-[#2b4b8f] text-[#2b4b8f]'
                                : 'text-[#5f6c84] hover:text-[#1a263b]',
                        )}
                    >
                        {t('transaction.status.completed')}
                    </button>
                    <button
                        onClick={() => setActiveFilter('cancelled')}
                        className={cn(
                            'px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors',
                            activeFilter === 'cancelled'
                                ? 'border-b-2 border-[#2b4b8f] text-[#2b4b8f]'
                                : 'text-[#5f6c84] hover:text-[#1a263b]',
                        )}
                    >
                        {t('transaction.cancel') || 'Cancelled'}
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <Card
                                key={`${item.type}-${item.id}-${index}`}
                                className="group overflow-hidden rounded-xl border-[#f0f2f5] shadow-sm transition-all hover:border-[#ced9e5]"
                            >
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e1e9f2] bg-[#f0f5fd]">
                                        {item.main_image_url ? (
                                            <img
                                                src={item.main_image_url}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Package
                                                className="text-[#a3b6cc]"
                                                size={24}
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="h-5 px-1.5 text-[0.65rem] font-bold tracking-wider uppercase"
                                            >
                                                {item.type === 'auction' ? (
                                                    <span className="flex items-center gap-1 text-[#0d9488]">
                                                        <Trophy size={10} />{' '}
                                                        {t(
                                                            'listing.type.auction',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[#2b4b8f]">
                                                        <ShoppingBag
                                                            size={10}
                                                        />{' '}
                                                        {t(
                                                            'listing.type.purchase',
                                                        )}
                                                    </span>
                                                )}
                                            </Badge>
                                            <span className="text-[0.7rem] text-[#8e9aaf]">
                                                {new Date(
                                                    item.sold_at,
                                                ).toLocaleDateString()}
                                            </span>
                                            <span className="ml-auto">
                                                <TransactionStatusBadge
                                                    status={item.status}
                                                />
                                            </span>
                                        </div>
                                        <h3 className="truncate text-lg font-bold text-[#1a263b]">
                                            {item.title}
                                        </h3>
                                        <div className="mt-1 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-sm text-[#5f6c84]">
                                                <PriceDisplay
                                                    price={item.price}
                                                    size="md"
                                                />
                                                <span>•</span>
                                                <UserRatingBadge
                                                    user={item.buyer}
                                                    variant="compact"
                                                />
                                            </div>
                                            <Link
                                                href={`/transactions/${item.transaction_id}`}
                                                className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-bold text-[#2b4b8f] transition-colors group-hover:translate-x-1 hover:bg-[#f0f5fd]"
                                            >
                                                {t('common.view')}
                                                <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="rounded-2xl border-2 border-dashed border-[#f0f2f5] bg-white p-12 text-center text-[#5f6c84]">
                            <Package
                                className="mx-auto mb-4 opacity-20"
                                size={48}
                            />
                            <p className="font-medium">
                                {t('dashboard.sold_items.no_items') +
                                    ' in ' +
                                    activeFilter}
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </BazaarLayout>
    );
}
