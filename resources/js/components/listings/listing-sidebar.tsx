import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Check,
    CreditCard,
    Share2,
    ShoppingBag,
    Trophy,
    Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { synth } from '@/lib/synth-service';
import { TermsAcceptanceModal } from '@/components/terms-acceptance-modal';
import { SoldBadge } from '@/components/listings/sold-badge';
import { WatchButton } from '@/components/listings/watch-button';
import { PriceDisplay } from '@/components/listings/price-display';
import { UserRatingBadge } from '@/components/user-rating-badge';
import { LoginRequiredDialog } from '@/components/login-required-dialog';
import { useClipboard } from '@/hooks/use-clipboard';
import { YAMATO_RATE_TABLE_URL } from '@/components/listings/shipping-settings-card';
import { AuctionCountdown } from '@/components/listings/auction-countdown';

interface ListingSidebarProps {
    listing: {
        id: number;
        title: string;
        description: string;
        images: string[];
        location?: string | null;
        price: number;
        display_price?: number;
        current_price?: number;
        highest_bid_amount?: number;
        status: string;
        buy_now_price: number | null;
        is_auction: boolean;
        auction_end_date: string | null;
        auction_ended?: boolean;
        reserve_met?: boolean;
        current_high_bid: number;
        minimum_bid?: number;
        is_highest_bidder?: boolean;
        bids_count?: number;
        shipping_payer?: 'seller' | 'buyer';
        shipping_method?: 'kuroneko_yamato';
        shipping_cost_type?: 'free' | 'fixed' | 'location_based' | 'chakubarai';
        shipping_cost?: number | null;
        user: {
            id: number;
            name: string;
            masked_name: string;
            avatar_url: string;
            average_rating?: number;
            ratings_count?: number;
        };
    };
    transaction?: {
        id: number;
        amount: number;
        status: string;
        purchase_type: 'buy_now' | 'auction' | string;
        buyer_id: number;
        seller_id: number;
    } | null;
    shareUrl?: string;
}

export function ListingSidebar({
    listing,
    transaction,
    shareUrl,
}: ListingSidebarProps) {
    const { t } = useTranslations();
    const { auth, is_watched } = usePage().props as any;
    const purchasePrice =
        listing.buy_now_price ?? (!listing.is_auction ? listing.price : null);
    const isOwner =
        auth?.user && Number(auth.user.id) === Number(listing.user.id);
    const canTransact = auth?.user && !auth.user.is_guest && !isOwner;
    const canBuyNow = listing.status === 'active' && purchasePrice !== null;
    const auctionEnded = listing.is_auction && Boolean(listing.auction_ended);
    const reserveNotMet =
        auctionEnded &&
        listing.reserve_met === false &&
        listing.status === 'active';
    const currentPrice =
        transaction?.amount ??
        listing.display_price ??
        listing.current_price ??
        (listing.is_auction
            ? Math.max(listing.price, listing.current_high_bid)
            : listing.price);
    const suggestedBidAmount =
        listing.minimum_bid ?? getSuggestedBidAmount(currentPrice);
    const shippingSummary = getShippingSummary(listing);

    const { data, setData, post, processing, errors } = useForm({
        amount: suggestedBidAmount,
    });
    const previousSuggestedBidAmount = React.useRef(suggestedBidAmount);

    React.useEffect(() => {
        const shouldUpdateAmount =
            data.amount === previousSuggestedBidAmount.current ||
            data.amount < suggestedBidAmount;

        if (shouldUpdateAmount) {
            setData('amount', suggestedBidAmount);
        }

        previousSuggestedBidAmount.current = suggestedBidAmount;
    }, [data.amount, setData, suggestedBidAmount]);

    const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
    const [pendingAction, setPendingAction] = React.useState<
        null | (() => void)
    >(null);
    const [loginRequiredOpen, setLoginRequiredOpen] = React.useState(false);
    const [copiedText, copy] = useClipboard();
    const [shareStatus, setShareStatus] = React.useState<
        'idle' | 'copied' | 'failed'
    >('idle');
    const listingShareUrl = React.useMemo(() => {
        if (shareUrl?.startsWith('http')) {
            return shareUrl;
        }

        if (typeof window === 'undefined') {
            return shareUrl ?? `/listings/${listing.id}`;
        }

        return new URL(
            shareUrl ?? `/listings/${listing.id}`,
            window.location.origin,
        ).toString();
    }, [listing.id, shareUrl]);
    const shareCopied =
        shareStatus === 'copied' || copiedText === listingShareUrl;

    const checkTermsAndExecute = (action: () => void) => {
        if (auth?.user && !auth.user.has_accepted_terms) {
            setPendingAction(() => action);
            setIsTermsModalOpen(true);
            return;
        }
        action();
    };

    const submitBid = (e: React.FormEvent) => {
        e.preventDefault();
        checkTermsAndExecute(() => {
            post(`/listings/${listing.id}/bid`, {
                onSuccess: () => {
                    synth.playSuccess();
                },
            });
        });
    };

    const shareListing = async () => {
        const shareData = {
            title: listing.title,
            text: listing.description,
            url: listingShareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (error) {
                if ((error as DOMException).name === 'AbortError') {
                    return;
                }
            }
        }

        const copied = await copy(listingShareUrl);
        setShareStatus(copied ? 'copied' : 'failed');

        if (copied) {
            window.setTimeout(() => setShareStatus('idle'), 2200);
        }
    };

    const buyNow = () => {
        checkTermsAndExecute(() => {
            if (confirm(t('common.confirm_purchase'))) {
                post(`/listings/${listing.id}/buy-now`, {
                    onSuccess: () => synth.playFanfare(),
                });
            }
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {transaction && (
                <Card className="overflow-hidden rounded-[16px] border-[#c7d2fe] bg-[#f8faff] shadow-sm sm:rounded-[24px]">
                    <CardHeader className="flex flex-row items-center gap-2 border-b border-[#e5ebff] px-4 py-3 text-sm font-bold text-[#1e2a5a] sm:px-6 sm:py-4 sm:text-base">
                        <CreditCard size={18} className="text-[#2b4b8f]" />
                        {t('common.transaction')}
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-[#1a263b]">
                                {transaction.purchase_type === 'auction' ? (
                                    <Trophy
                                        size={16}
                                        className="text-[#0d9488]"
                                    />
                                ) : (
                                    <ShoppingBag
                                        size={16}
                                        className="text-[#2b4b8f]"
                                    />
                                )}
                                {transaction.purchase_type === 'auction'
                                    ? t('listing.type.auction')
                                    : t('listing.type.purchase')}
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#475569]">
                                {t(
                                    `transaction.status.${transaction.status}`,
                                ) || transaction.status}
                            </span>
                        </div>
                        <div className="flex items-end justify-between gap-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-[#64748b]">
                                    {t('transaction.details.total')}
                                </span>
                                <PriceDisplay
                                    price={transaction.amount}
                                    size="lg"
                                />
                            </div>
                            <Link href={`/transactions/${transaction.id}`}>
                                <Button className="h-10 rounded-full bg-[#2b4b8f] px-5 text-sm font-bold text-white hover:bg-[#203a70]">
                                    {t('common.view')}
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bid / Watch Action Card */}
            <Card className="overflow-hidden rounded-[16px] border-[#edf2f9] shadow-sm sm:rounded-[24px]">
                <CardContent className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
                    {listing.is_auction && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between text-xs font-medium sm:text-sm">
                                <span>
                                    {t('listing.sidebar.bids')}:{' '}
                                    <strong className="text-[#0b1b32]">
                                        {listing.bids_count ?? 0}
                                    </strong>
                                </span>
                                <span className="text-[#64748b]">
                                    {auctionEnded
                                        ? t('listing.sidebar.ended')
                                        : t('listing.sidebar.time_remaining')}
                                </span>
                            </div>
                            <AuctionCountdown
                                endsAt={listing.auction_end_date}
                                ended={auctionEnded}
                                variant="panel"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground sm:text-sm">
                            {listing.is_auction
                                ? listing.status === 'sold'
                                    ? t('listing.show.final_price')
                                    : t('listing.show.current_price')
                                : t('listing.create.price')}
                        </span>
                        <PriceDisplay price={currentPrice} size="lg" />
                        {listing.status === 'sold' && (
                            <SoldBadge className="mt-1 w-fit" />
                        )}
                        {listing.is_highest_bidder && (
                            <div className="mt-2 w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                {t('listing.sidebar.highest_bidder')}
                            </div>
                        )}
                        {reserveNotMet && (
                            <div className="mt-3 rounded-[14px] border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">
                                {t('listing.sidebar.reserve_not_met')}
                            </div>
                        )}
                    </div>
                    {canTransact ? (
                        <div className="flex flex-col gap-4">
                            {listing.is_auction &&
                                listing.status === 'active' &&
                                !auctionEnded && (
                                    <form
                                        onSubmit={submitBid}
                                        className="space-y-3"
                                    >
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    value={data.amount}
                                                    onChange={(e) =>
                                                        setData(
                                                            'amount',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    min={suggestedBidAmount}
                                                    className="h-10 rounded-full text-sm sm:h-12"
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="h-10 rounded-full bg-[#0d9488] px-4 text-sm font-bold text-white hover:bg-[#0f766e] sm:h-12 sm:px-8 sm:text-base"
                                                >
                                                    {t('listing.show.bid')}
                                                </Button>
                                            </div>
                                            {errors.amount && (
                                                <p className="ml-4 text-[10px] text-red-500 sm:text-xs">
                                                    {errors.amount}
                                                </p>
                                            )}
                                        </div>
                                    </form>
                                )}
                            {canBuyNow && (
                                <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-2 shadow-sm">
                                    <Button
                                        onClick={buyNow}
                                        disabled={processing}
                                        className="h-14 w-full rounded-[14px] bg-[#d97706] text-base font-extrabold text-white shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 hover:bg-[#b45309] hover:shadow-amber-300 active:translate-y-0 sm:h-16 sm:text-lg"
                                    >
                                        <ShoppingBag
                                            size={20}
                                            className="shrink-0"
                                        />
                                        <span>{t('listing.show.buy_now')}</span>
                                        <span className="rounded-full bg-white/20 px-2.5 py-1 text-sm font-bold sm:text-base">
                                            ¥{purchasePrice.toLocaleString()}
                                        </span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : auth?.user && !auth.user.is_guest && isOwner ? (
                        <div className="rounded-[16px] border border-dashed border-amber-200 bg-amber-50 p-3 text-center text-xs text-amber-600 sm:rounded-2xl sm:p-4 sm:text-sm">
                            {t('listing.owner_actions_restricted') ||
                                'You cannot bid on or buy your own listing.'}
                        </div>
                    ) : canBuyNow ? (
                        <div className="flex flex-col gap-3">
                            <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-2 shadow-sm">
                                <Button
                                    onClick={() => setLoginRequiredOpen(true)}
                                    className="h-14 w-full rounded-[14px] bg-[#d97706] text-base font-extrabold text-white shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 hover:bg-[#b45309] hover:shadow-amber-300 active:translate-y-0 sm:h-16 sm:text-lg"
                                >
                                    <ShoppingBag
                                        size={20}
                                        className="shrink-0"
                                    />
                                    <span>{t('listing.show.buy_now')}</span>
                                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-sm font-bold sm:text-base">
                                        ¥{purchasePrice.toLocaleString()}
                                    </span>
                                </Button>
                            </div>
                            <div className="rounded-[16px] border border-dashed bg-muted/50 p-3 text-center text-xs text-[#5f6c84] sm:rounded-2xl sm:p-4 sm:text-sm">
                                {t('listing.sidebar.login_prefix')}{' '}
                                <Link
                                    href="/login"
                                    className="font-semibold text-[#0d9488] underline underline-offset-4"
                                >
                                    {t('listing.sidebar.login_link')}
                                </Link>{' '}
                                {t('listing.sidebar.login_suffix')}
                            </div>
                        </div>
                    ) : null}

                    <WatchButton
                        listingId={listing.id}
                        isWatched={is_watched}
                        className="h-10 w-full text-sm sm:h-12"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={shareListing}
                        className="h-10 w-full rounded-full border-[#cbd5e1] text-sm font-semibold text-[#475569] sm:h-12"
                        aria-label={t('listing.sidebar.share')}
                    >
                        {shareCopied ? (
                            <Check size={16} className="text-emerald-600" />
                        ) : (
                            <Share2 size={16} />
                        )}
                        {shareCopied
                            ? t('listing.sidebar.link_copied')
                            : t('listing.sidebar.share')}
                    </Button>
                    {shareStatus === 'failed' && (
                        <p className="text-center text-xs text-red-500">
                            {t('listing.sidebar.link_copy_failed')}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Shipping & Payment Card */}
            <Card className="rounded-[16px] border-[#edf2f9] shadow-sm sm:rounded-[24px]">
                <CardHeader className="flex flex-row items-center gap-2 border-b border-[#f0f2f5] px-4 py-3 text-sm font-bold text-[#0b1b32] sm:px-6 sm:py-4 sm:text-base">
                    <Truck size={18} className="text-[#0d9488]" />
                    {t('listing.sidebar.shipping_payment')}
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 text-xs sm:gap-4 sm:text-sm">
                        <div className="flex justify-between border-b border-dashed border-[#e4ecf5] pb-2 sm:pb-3">
                            <span className="text-[#5f6c84]">
                                {t('listing.sidebar.shipping')}
                            </span>
                            <span className="font-medium text-[#1a263b]">
                                {shippingSummary.payer}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-[#e4ecf5] pb-2 sm:pb-3">
                            <span className="text-[#5f6c84]">
                                {t('listing.sidebar.shipping_method')}
                            </span>
                            <span className="text-right font-medium text-[#1a263b]">
                                {shippingSummary.method}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-[#e4ecf5] pb-2 sm:pb-3">
                            <span className="text-[#5f6c84]">Cost</span>
                            <span className="text-right font-medium text-[#1a263b]">
                                {shippingSummary.cost}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-[#e4ecf5] pb-2 sm:pb-3">
                            <span className="text-[#5f6c84]">
                                {t('listing.show.location')}
                            </span>
                            <span className="text-right font-medium text-[#1a263b]">
                                {listing.location || t('common.not_specified')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#5f6c84]">
                                {t('listing.sidebar.payment')}
                            </span>
                            <span className="text-right font-medium text-[#1a263b]">
                                {t('transaction.payment.cash') || 'Cash'}
                            </span>
                        </div>
                        <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-3 text-xs leading-relaxed text-[#475569]">
                            {t('transaction.payment.cod_contracted_note') ||
                                'Yamato TA-Q-BIN Collect/COD is only for contracted corporate, organization, or sole-proprietor senders. Individual sellers should not offer COD unless they have the required Yamato contract.'}
                        </div>
                        <a
                            href={YAMATO_RATE_TABLE_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex w-fit text-xs font-semibold text-[#0f766e] underline underline-offset-4"
                        >
                            Check Yamato prices
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* Seller Info Card */}
            <Card className="rounded-[16px] border-[#edf2f9] p-4 shadow-sm sm:rounded-[24px] sm:p-6">
                <UserRatingBadge user={listing.user} variant="full" />

                <Separator className="my-4 bg-[#eef2f8] sm:my-5" />

                <div className="xs:flex-row flex flex-col gap-2.5">
                    <Button
                        variant="secondary"
                        className="h-9 flex-1 rounded-full border-none bg-[#f3f9ff] text-xs font-medium text-[#2b4b8f] hover:bg-[#e1f0ff] sm:h-10 sm:text-sm"
                    >
                        {t('listing.sidebar.ask_provider')}
                    </Button>
                    <Link href={`/users/${listing.user.id}`} className="flex-1">
                        <Button
                            variant="secondary"
                            className="h-9 w-full rounded-full border-none bg-[#f3f9ff] text-xs font-medium text-[#2b4b8f] hover:bg-[#e1f0ff] sm:h-10 sm:text-sm"
                        >
                            {t('listing.sidebar.store_info')}
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Reminder Note */}
            <div className="flex gap-3 rounded-[16px] border border-[#d1e2fc] bg-[#f3f9ff] p-4 text-xs leading-snug text-[#1a263b] sm:rounded-[24px] sm:p-5 sm:text-sm">
                <div className="text-lg sm:text-xl">🔔</div>
                <div>{t('listing.sidebar.watchlist_reminder')}</div>
            </div>

            <TermsAcceptanceModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                onAccepted={() => {
                    if (pendingAction) {
                        pendingAction();
                        setPendingAction(null);
                    }
                }}
            />
            <LoginRequiredDialog
                open={loginRequiredOpen}
                onOpenChange={setLoginRequiredOpen}
            />
        </div>
    );
}

function getSuggestedBidAmount(currentPrice: number): number {
    const increment = Math.max(1, Math.ceil(currentPrice * 0.05));

    return currentPrice + increment;
}

function getShippingSummary(listing: ListingSidebarProps['listing']): {
    payer: string;
    method: string;
    cost: string;
} {
    const method = 'Kuroneko Yamato TA-Q-BIN';

    if ((listing.shipping_payer ?? 'seller') === 'seller') {
        return {
            payer: 'Seller pays',
            method,
            cost: 'Free shipping',
        };
    }

    if (listing.shipping_cost_type === 'fixed') {
        return {
            payer: 'Buyer pays',
            method,
            cost: `¥${(listing.shipping_cost ?? 0).toLocaleString()}`,
        };
    }

    if (listing.shipping_cost_type === 'chakubarai') {
        return {
            payer: 'Buyer pays on delivery',
            method,
            cost: 'Chakubarai',
        };
    }

    return {
        payer: 'Buyer pays',
        method,
        cost: "Decided by buyer's location",
    };
}
