import React from 'react';
import { Link, Head, router } from '@inertiajs/react';
import { MessageCircle, Info, Truck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface ListingSidebarProps {
    listing: {
        id: number;
        title: string;
        description: string;
        images: string[];
        location?: string | null;
        price: number;
        status: string;
        buy_now_price: number | null;
        is_auction: boolean;
        auction_end_date: string | null;
        current_high_bid: number;
        bids_count?: number;
        user: {
            id: number;
            name: string;
            masked_name: string;
            avatar_url: string;
            average_rating?: number;
            ratings_count?: number;
        };
    };
}

export function ListingSidebar({ listing }: ListingSidebarProps) {
    const { t } = useTranslations();
    const { auth, is_watched } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: Math.max(listing.price, listing.current_high_bid) + 1,
    });

    const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
    const [pendingAction, setPendingAction] = React.useState<null | (() => void)>(null);

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
                    reset();
                },
            });
        });
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

    const currentPrice = listing.is_auction
        ? Math.max(listing.price, listing.current_high_bid)
        : listing.price;

    return (
        <div className="flex flex-col gap-6">
            {/* Bid / Watch Action Card */}
            <Card className="rounded-[16px] sm:rounded-[24px] border-[#edf2f9] shadow-sm overflow-hidden">
                <CardContent className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
                    {listing.is_auction && (
                        <div className="flex justify-between text-xs sm:text-sm font-medium">
                            <span>{t('listing.sidebar.bids')}: <strong className="text-[#0b1b32]">{listing.bids_count ?? 0}</strong></span>
                            <span className="text-right">{t('listing.sidebar.time_remaining')}: <strong className="text-[#0b1b32] block sm:inline">
                                {listing.auction_end_date ? new Date(listing.auction_end_date).toLocaleDateString() : t('common.n_a')}
                            </strong></span>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                            {listing.is_auction ? t('listing.show.current_price') : t('listing.create.price')}
                        </span>
                        <PriceDisplay price={currentPrice} size="lg" />
                        {listing.status === 'sold' && <SoldBadge className="mt-1 w-fit" />}
                    </div>
                    {auth?.user && !auth.user.is_guest && Number(auth.user.id) !== Number(listing.user.id) ? (
                        <div className="flex flex-col gap-4">
                            {listing.is_auction && (
                                <form onSubmit={submitBid} className="space-y-3">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', parseInt(e.target.value))}
                                                min={currentPrice + 1}
                                                className="rounded-full h-10 sm:h-12 text-sm"
                                            />
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-full h-10 sm:h-12 px-4 sm:px-8 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-sm sm:text-base"
                                            >
                                                {t('listing.show.bid')}
                                            </Button>
                                        </div>
                                        {errors.amount && <p className="text-[10px] sm:text-xs text-red-500 ml-4">{errors.amount}</p>}
                                    </div>
                                </form>
                            )}
                            {listing.buy_now_price && (
                                <Button
                                    onClick={buyNow}
                                    disabled={processing}
                                    className="w-full h-10 sm:h-12 rounded-full bg-[#2b4b8f] hover:bg-[#1e3a7a] text-white font-bold text-sm sm:text-lg"
                                >
                                    {t('listing.show.buy_now')} (¥{listing.buy_now_price.toLocaleString()})
                                </Button>
                            )}
                        </div>
                    ) : auth?.user && !auth.user.is_guest && Number(auth.user.id) === Number(listing.user.id) && listing.status !== 'sold' ? (
                        <div className="text-center text-xs sm:text-sm text-amber-600 bg-amber-50 p-3 sm:p-4 rounded-[16px] sm:rounded-2xl border border-dashed border-amber-200">
                            {t('listing.owner_actions_restricted') || 'You cannot bid on or buy your own listing.'}
                        </div>
                    ) : (
                        <div className="text-center text-xs sm:text-sm text-[#5f6c84] bg-muted/50 p-3 sm:p-4 rounded-[16px] sm:rounded-2xl border border-dashed">
                            {t('listing.sidebar.login_prefix')}{' '}
                            <Link href="/login" className="text-[#0d9488] font-semibold underline underline-offset-4">
                                {t('listing.sidebar.login_link')}
                            </Link>{' '}
                            {t('listing.sidebar.login_suffix')}
                        </div>
                    )}

                    <WatchButton
                        listingId={listing.id}
                        isWatched={is_watched}
                        className="w-full h-10 sm:h-12 text-sm"
                    />
                </CardContent>
            </Card>

            {/* Shipping & Payment Card */}
            <Card className="rounded-[16px] sm:rounded-[24px] border-[#edf2f9] shadow-sm">
                <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#f0f2f5] font-bold text-[#0b1b32] flex flex-row items-center gap-2 text-sm sm:text-base">
                    <Truck size={18} className="text-[#0d9488]" />
                    {t('listing.sidebar.shipping_payment')}
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex justify-between pb-2 sm:pb-3 border-b border-dashed border-[#e4ecf5]">
                            <span className="text-[#5f6c84]">{t('listing.sidebar.shipping')}</span>
                            <span className="font-medium text-[#1a263b]">{t('listing.sidebar.buyer_pays')}</span>
                        </div>
                        <div className="flex justify-between pb-2 sm:pb-3 border-b border-dashed border-[#e4ecf5]">
                            <span className="text-[#5f6c84]">{t('listing.sidebar.shipping_method')}</span>
                            <span className="font-medium text-[#1a263b]">{t('listing.sidebar.domestic_delivery')}</span>
                        </div>
                        <div className="flex justify-between pb-2 sm:pb-3 border-b border-dashed border-[#e4ecf5]">
                            <span className="text-[#5f6c84]">{t('listing.show.location')}</span>
                            <span className="font-medium text-[#1a263b]">Tokyo, JP</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#5f6c84]">{t('listing.sidebar.payment')}</span>
                            <span className="font-medium text-[#1a263b] text-right">
                                {t('transaction.payment.cash')}, {t('transaction.payment.cod')}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Seller Info Card */}
            <Card className="rounded-[16px] sm:rounded-[24px] border-[#edf2f9] shadow-sm p-4 sm:p-6">
                <UserRatingBadge user={listing.user} variant="full" />

                <Separator className="my-4 sm:my-5 bg-[#eef2f8]" />

                <div className="flex flex-col xs:flex-row gap-2.5">
                    <Button variant="secondary" className="flex-1 rounded-full bg-[#f3f9ff] text-[#2b4b8f] border-none hover:bg-[#e1f0ff] h-9 sm:h-10 font-medium text-xs sm:text-sm">
                        {t('listing.sidebar.ask_provider')}
                    </Button>
                    <Link href={`/users/${listing.user.id}`} className="flex-1">
                        <Button variant="secondary" className="w-full rounded-full bg-[#f3f9ff] text-[#2b4b8f] border-none hover:bg-[#e1f0ff] h-9 sm:h-10 font-medium text-xs sm:text-sm">
                            {t('listing.sidebar.store_info')}
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Reminder Note */}
            <div className="rounded-[16px] sm:rounded-[24px] bg-[#f3f9ff] border border-[#d1e2fc] p-4 sm:p-5 flex gap-3 text-xs sm:text-sm text-[#1a263b] leading-snug">
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
        </div>
    );
}
