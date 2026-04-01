import { Head, Link, useForm, usePage } from '@inertiajs/react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, Clock, MapPin, User, ArrowLeft, CreditCard, Receipt, AlertCircle, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, User as UserType } from '@/types';
import { TRANSACTION_STATUS, type TransactionStatus } from '@/types/transaction-status';

interface Rating {
    id: number;
    transaction_id: number;
    rater_id: number;
    rated_user_id: number;
    score: number;
    comment: string | null;
    rater: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Transaction {
    id: number;
    listing_id: number;
    buyer_id: number;
    seller_id: number;
    amount: number;
    status: TransactionStatus;
    tracking_number: string | null;
    shipping_method: string | null;
    paid_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    received_at: string | null;
    completed_at: string | null;
    created_at: string;
    listing: {
        id: number;
        title: string;
        images: string[] | null;
    };
    seller: {
        id: number;
        name: string;
        avatar_url: string;
    };
    buyer: {
        id: number;
        name: string;
    };
    ratings: Rating[];
}

export default function Show({ transaction }: { transaction: Transaction }) {
    const { t } = useTranslations();
    const { auth } = usePage<{ auth: { user: UserType | null } }>().props;

    const { data, setData, post, processing, errors } = useForm({
        shipping_method: '',
        tracking_number: '',
    });

    const ratingForm = useForm({
        score: 0,
        comment: '',
    });

    const isBuyer = auth.user?.id === transaction.buyer_id;
    const isSeller = auth.user?.id === transaction.seller_id;
    const isParticipant = isBuyer || isSeller;
    const canMarkAsPaid = isBuyer && transaction.status === TRANSACTION_STATUS.PENDING_PAYMENT;

    const handleMarkAsPaid = () => {
        if (confirm(t('transaction.mark_as_paid_confirm') || 'Are you sure you have completed the payment for this item?')) {
            post(`/transactions/${transaction.id}/mark-as-paid`);
        }
    };

    const handleCancel = () => {
        if (confirm(t('transaction.cancel_confirm') || 'Are you sure you want to cancel this transaction? The listing will be returned to the marketplace.')) {
            post(`/transactions/${transaction.id}/cancel`);
        }
    };

    const handleMarkAsShipped = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/transactions/${transaction.id}/mark-as-shipped`);
    };

    const handleMarkAsReceived = () => {
        if (confirm(t('transaction.confirm_receipt_confirm') || 'Have you received the item and are you happy with it? This will complete the transaction.')) {
            post(`/transactions/${transaction.id}/mark-as-received`);
        }
    };

    const handleRate = (e: React.FormEvent) => {
        e.preventDefault();
        ratingForm.post(`/transactions/${transaction.id}/rate`, {
            preserveScroll: true,
            onSuccess: () => ratingForm.reset(),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('common.dashboard'), href: '/dashboard' },
        { title: isBuyer ? t('dashboard.won_items.title') : (t('dashboard.sold_items.title') || 'Sold Items'), href: isBuyer ? '/dashboard/won-items' : '/dashboard/sold-items' },
        { title: `${t('common.transaction')} #${transaction.id}`, href: '#' },
    ].filter(b => b.title !== ''); // filter empty breadcrumbs for guest

    const steps = [
        {
            id: 'purchased',
            label: t('transaction.status.purchased') || 'Item Won',
            date: transaction.created_at,
            icon: Package,
            isCompleted: true,
        },
        {
            id: 'paid',
            label: t('transaction.status.paid') || 'Payment Completed',
            date: transaction.paid_at,
            icon: CreditCard,
            isCompleted: !!transaction.paid_at,
        },
        {
            id: 'shipped',
            label: t('transaction.status.shipped') || 'Shipped',
            date: transaction.shipped_at,
            icon: Truck,
            isCompleted: !!transaction.shipped_at,
        },
        {
            id: 'received',
            label: t('transaction.status.received') || 'Received & Finalized',
            date: transaction.received_at || transaction.completed_at,
            icon: CheckCircle,
            isCompleted: !!(transaction.received_at || transaction.completed_at),
        },
    ];

    const currentStepIndex = steps.findIndex(step => !step.isCompleted);

    return (
        <BazaarLayout
            title={t('common.transaction')}
            breadcrumbs={breadcrumbs}
        >
            <Head title={`${t('common.transaction')} #${transaction.id}`} />

            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                {!auth.user && (
                    <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="bg-[#bae6fd] p-3 rounded-xl h-fit">
                                <Info size={24} className="text-[#0369a1]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0369a1] text-lg">{t('common.login')}</h3>
                                <p className="text-[#075985] text-sm">
                                    {t('transaction.login_to_manage') || 'Please log in to manage your transaction.'}
                                </p>
                            </div>
                        </div>
                        <Link href="/login" className="w-full md:w-auto">
                            <Button className="w-full bg-[#0369a1] hover:bg-[#075985] text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-blue-100">
                                {t('common.login')}
                            </Button>
                        </Link>
                    </div>
                )}

                {auth.user && !isParticipant && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                        <Info size={18} className="text-slate-400" />
                        <p className="text-sm text-slate-500 font-medium">
                            {t('transaction.view_only_notice') || 'This transaction is being viewed in read-only mode.'}
                        </p>
                    </div>
                )}
                {canMarkAsPaid && (
                    <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="bg-[#fef3c7] p-3 rounded-xl h-fit">
                                <AlertCircle size={24} className="text-[#92400e]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#92400e] text-lg">{t('transaction.payment_required.title') || 'Payment Required'}</h3>
                                <p className="text-[#a16207] text-sm">
                                    {t('transaction.payment_required.desc') || 'Please complete the payment to the seller and mark it as paid to proceed with the transaction.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button
                                onClick={handleMarkAsPaid}
                                disabled={processing}
                                className="bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl px-8 py-6 h-auto font-bold text-lg shadow-lg shadow-amber-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex-1 md:flex-none"
                            >
                                <CreditCard className="mr-2" size={20} />
                                {t('transaction.mark_as_paid')}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Seller: Mark as Shipped Form */}
                {isSeller && transaction.status === TRANSACTION_STATUS.PAID && (
                    <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-6 flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="bg-[#bae6fd] p-3 rounded-xl h-fit">
                                <Truck size={24} className="text-[#0369a1]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0369a1] text-lg">{t('transaction.ship_item.title') || 'Ship the Item'}</h3>
                                <p className="text-[#075985] text-sm">
                                    {t('transaction.ship_item.desc') || 'The buyer has paid. Please ship the item and provide tracking details below.'}
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleMarkAsShipped} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[#0369a1] uppercase">{t('transaction.details.method')}</label>
                                <input
                                    type="text"
                                    value={data.shipping_method}
                                    onChange={e => setData('shipping_method', e.target.value)}
                                    placeholder="e.g. UPS, FedEx, Yamato"
                                    className="rounded-lg border-[#bae6fd] text-sm focus:ring-[#0369a1]/20"
                                    required
                                />
                                {errors.shipping_method && <span className="text-xs text-red-500">{errors.shipping_method}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[#0369a1] uppercase">{t('transaction.details.tracking')}</label>
                                <input
                                    type="text"
                                    value={data.tracking_number}
                                    onChange={e => setData('tracking_number', e.target.value)}
                                    placeholder="Tracking Number (Optional)"
                                    className="rounded-lg border-[#bae6fd] text-sm focus:ring-[#0369a1]/20"
                                />
                                {errors.tracking_number && <span className="text-xs text-red-500">{errors.tracking_number}</span>}
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#0369a1] hover:bg-[#075985] text-white rounded-xl h-10 font-bold"
                                >
                                    {t('transaction.mark_as_shipped') || 'Mark as Shipped'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Buyer: Confirm Receipt */}
                {isBuyer && transaction.status === TRANSACTION_STATUS.SHIPPED && (
                    <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="bg-[#dcfce7] p-3 rounded-xl h-fit">
                                <CheckCircle size={24} className="text-[#166534]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#166534] text-lg">{t('transaction.confirm_receipt.title') || 'Did you receive it?'}</h3>
                                <p className="text-[#166534] text-sm">
                                    {t('transaction.confirm_receipt.desc') || 'Please confirm once you have received the item and everything is in order.'}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handleMarkAsReceived}
                            disabled={processing}
                            className="bg-[#166534] hover:bg-[#14532d] text-white rounded-xl px-8 py-6 h-auto font-bold text-lg shadow-lg shadow-green-100 transition-all hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
                        >
                            {t('transaction.confirm_receipt') || 'Confirm Receipt'}
                        </Button>
                    </div>
                )}

                {/* Secondary Actions Area (Visible to both buyer/seller before shipping) */}
                {isParticipant &&
                    transaction.status !== TRANSACTION_STATUS.CANCELLED &&
                    transaction.status !== TRANSACTION_STATUS.SHIPPED &&
                    transaction.status !== TRANSACTION_STATUS.DELIVERED &&
                    transaction.status !== TRANSACTION_STATUS.RECEIVED && (
                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={handleCancel}
                                variant="ghost"
                                disabled={processing}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl px-6"
                            >
                                {t('transaction.cancel') || t('common.cancel')} {t('common.transaction')}
                            </Button>
                        </div>
                    )}

                {transaction.status === TRANSACTION_STATUS.CANCELLED && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-xl h-fit">
                            <AlertCircle size={24} className="text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900 text-lg">{t('transaction.status.cancelled') || 'Transaction Cancelled'}</h3>
                            <p className="text-red-700 text-sm">
                                This transaction has been cancelled. The listing is now active in the marketplace again.
                            </p>
                        </div>
                    </div>
                )}

                {/* Rating Section */}
                <Card className="rounded-[24px] border-[#edf2f9] shadow-sm overflow-hidden">
                    <CardHeader className="px-8 pt-8 pb-4">
                        <h2 className="font-bold text-lg text-[#0b1b32] flex items-center gap-2">
                            <Star size={20} className="text-amber-500 fill-amber-500" />
                            {t('rating.title') || 'Rate Transaction'}
                        </h2>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 flex flex-col gap-6">
                        {/* Rating Form */}
                        {isParticipant && transaction.status !== TRANSACTION_STATUS.CANCELLED && (
                            <form onSubmit={handleRate} className="bg-[#f8fafc] rounded-2xl p-6 border border-[#f1f5f9]">
                                <p className="text-sm font-bold text-[#475569] mb-4 uppercase tracking-wider">
                                    {t('rating.rate_user', { name: isBuyer ? transaction.seller.name : transaction.buyer.name })}
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => ratingForm.setData('score', star)}
                                                className="transition-transform active:scale-95"
                                            >
                                                <Star
                                                    size={32}
                                                    className={cn(
                                                        "transition-colors",
                                                        star <= ratingForm.data.score ? "text-amber-500 fill-amber-500" : "text-slate-300"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                        {ratingForm.errors.score && <span className="text-xs text-red-500 ml-2">{ratingForm.errors.score}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <textarea
                                            value={ratingForm.data.comment}
                                            onChange={e => ratingForm.setData('comment', e.target.value)}
                                            placeholder={t('rating.comment') || "Write a comment..."}
                                            className="rounded-xl border-[#e2e8f0] text-sm focus:ring-amber-500/20 w-full min-h-[100px]"
                                        />
                                        {ratingForm.errors.comment && <span className="text-xs text-red-500">{ratingForm.errors.comment}</span>}
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={ratingForm.processing || ratingForm.data.score === 0}
                                        className="bg-[#1a263b] hover:bg-[#0b1a31] text-white rounded-xl h-12 font-bold w-fit px-8"
                                    >
                                        {t('rating.submit') || 'Submit Rating'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Rating List */}
                        <div className="flex flex-col gap-4">
                            {transaction.ratings.map((rating) => (
                                <div key={rating.id} className="flex gap-4 p-4 rounded-2xl border border-[#f1f5f9]">
                                    <div className="h-10 w-10 rounded-full bg-[#f1f5f9] flex items-center justify-center font-bold text-[#64748b] shrink-0">
                                        {rating.rater.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[#1a263b] text-sm">{rating.rater.name}</span>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={cn(
                                                            star <= rating.score ? "text-amber-500 fill-amber-500" : "text-slate-200"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {rating.comment && <p className="text-sm text-[#475569] italic">"{rating.comment}"</p>}
                                        <p className="text-[0.65rem] text-[#94a3b8]">{new Date(rating.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col gap-1">
                        <Link href={isBuyer ? "/dashboard/won-items" : "/dashboard/sold-items"} className="flex items-center gap-2 text-sm text-[#0d9488] font-semibold hover:underline mb-2">
                            <ArrowLeft size={16} />
                            {isBuyer ? t('dashboard.won_items.title') : (t('dashboard.sold_items.title') || 'Sold Items')}
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0b1a31]">
                            {t('common.transaction')} #{transaction.id}
                        </h1>
                        <p className="text-sm text-[#5f6c84]">
                            {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <Badge className={cn(
                        "rounded-full px-4 py-1 border",
                        transaction.status === TRANSACTION_STATUS.PENDING_PAYMENT ? "bg-[#fffbeb] text-[#92400e] border-[#fef3c7]" :
                            transaction.status === TRANSACTION_STATUS.CANCELLED ? "bg-red-50 text-red-600 border-red-100" :
                                "bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]"
                    )}>
                        {transaction.status.toUpperCase().replace('_', ' ')}
                    </Badge>
                </div>

                {/* Progress Board */}
                <Card className="rounded-[24px] border-[#edf2f9] shadow-sm overflow-hidden">
                    <CardHeader className="px-8 pt-8 pb-4">
                        <h2 className="font-bold text-lg text-[#0b1b32] flex items-center gap-2">
                            <Clock size={20} className="text-[#0d9488]" />
                            {t('transaction.tracking.title') || 'Transaction Progress'}
                        </h2>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="relative">
                            {/* Vertical line for mobile, horizontal for desktop? Let's do a nice vertical one for clarity as requested "linear info board" */}
                            <div className="flex flex-col gap-0">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isLast = index === steps.length - 1;
                                    const isPast = step.isCompleted;
                                    const isCurrent = index === currentStepIndex;

                                    return (
                                        <div key={step.id} className="flex gap-6">
                                            <div className="flex flex-col items-center">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-colors",
                                                    isPast ? "bg-[#0d9488] border-[#0d9488] text-white" : "bg-white border-[#e2e8f0] text-[#94a3b8]",
                                                    isCurrent && "ring-4 ring-[#ccfbf1]"
                                                )}>
                                                    {isPast && !isCurrent ? <CheckCircle size={20} /> : <Icon size={20} />}
                                                </div>
                                                {!isLast && (
                                                    <div className={cn(
                                                        "w-0.5 h-16 transition-colors",
                                                        isPast ? "bg-[#0d9488]" : "bg-[#e2e8f0]"
                                                    )} />
                                                )}
                                            </div>
                                            <div className="flex-1 pt-2 pb-8">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className={cn(
                                                        "font-bold text-[1.05rem]",
                                                        isPast || isCurrent ? "text-[#0b1b32]" : "text-[#94a3b8]"
                                                    )}>
                                                        {step.label}
                                                    </h3>
                                                    {step.date && (
                                                        <p className="text-sm text-[#5f6c84]">
                                                            {new Date(step.date).toLocaleString()}
                                                        </p>
                                                    )}
                                                    {isCurrent && (
                                                        <Badge variant="outline" className={cn(
                                                            "w-fit mt-1",
                                                            isPast ? "text-[#0d9488] border-[#0d9488] bg-[#f0fdfa]" : "text-[#d97706] border-[#d97706] bg-[#fffbeb]"
                                                        )}>
                                                            {isPast ? (t('transaction.status.completed') || 'Completed') : (t('transaction.status.pending') || 'In Progress')}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Item Summary */}
                    <Card className="rounded-[24px] border-[#edf2f9] shadow-sm">
                        <CardHeader className="px-6 py-4 border-b border-[#f0f2f5]">
                            <h3 className="font-bold text-[#0b1b32] flex items-center gap-2">
                                <Package size={18} className="text-[#0d9488]" />
                                {t('transaction.details.item') || 'Item Details'}
                            </h3>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="h-20 w-20 rounded-xl bg-[#f0f5fd] border border-[#e1e9f2] overflow-hidden shrink-0">
                                    {transaction.listing.images && transaction.listing.images.length > 0 ? (
                                        <img src={`/storage/${transaction.listing.images[0]}`} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-[#a3b6cc]">
                                            <Package size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold text-[#1a263b] leading-tight">{transaction.listing.title}</h4>
                                    <p className="text-lg font-bold text-[#0d9488]">¥{transaction.amount.toLocaleString()}</p>
                                    <Link href={`/listings/${transaction.listing.id}`} className="text-xs text-[#2b4b8f] font-medium hover:underline">
                                        {t('transaction.details.view_original') || 'View Original Listing'}
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Info */}
                    <Card className="rounded-[24px] border-[#edf2f9] shadow-sm">
                        <CardHeader className="px-6 py-4 border-b border-[#f0f2f5]">
                            <h3 className="font-bold text-[#0b1b32] flex items-center gap-2">
                                <Truck size={18} className="text-[#0d9488]" />
                                {t('transaction.details.shipping') || 'Shipping Info'}
                            </h3>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#5f6c84]">{t('transaction.details.method') || 'Method'}</span>
                                    <span className="font-medium text-[#1a263b]">{transaction.shipping_method || t('common.n_a')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#5f6c84]">{t('transaction.details.tracking') || 'Tracking Number'}</span>
                                    <span className="font-mono font-medium text-[#0d9488] underline decoration-dotted underline-offset-4">
                                        {transaction.tracking_number || t('common.n_a')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seller Info */}
                    <Card className="rounded-[24px] border-[#edf2f9] shadow-sm">
                        <CardHeader className="px-6 py-4 border-b border-[#f0f2f5]">
                            <h3 className="font-bold text-[#0b1b32] flex items-center gap-2">
                                <User size={18} className="text-[#0d9488]" />
                                {t('transaction.details.seller') || 'Seller Info'}
                            </h3>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#f0f5fd] border border-[#e1e9f2] flex items-center justify-center font-bold text-[#2b4b8f]">
                                    {transaction.seller.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-[#1a263b]">{transaction.seller.name}</p>
                                    <p className="text-xs text-[#5f6c84]">{t('transaction.details.contact_seller') || 'Contact Seller'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card className="rounded-[24px] border-[#edf2f9] shadow-sm">
                        <CardHeader className="px-6 py-4 border-b border-[#f0f2f5]">
                            <h3 className="font-bold text-[#0b1b32] flex items-center gap-2">
                                <Receipt size={18} className="text-[#0d9488]" />
                                {t('transaction.details.payment') || 'Payment Info'}
                            </h3>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#5f6c84]">{t('transaction.details.total') || 'Total Amount'}</span>
                                    <span className="font-bold text-[#1a263b]">¥{transaction.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#5f6c84]">{t('transaction.details.paid_date') || 'Paid Date'}</span>
                                    <span className="font-medium text-[#1a263b]">
                                        {transaction.paid_at ? new Date(transaction.paid_at).toLocaleDateString() : t('transaction.status.pending')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </BazaarLayout>
    );
}
