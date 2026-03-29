import React from 'react';
import { Link, Head, router } from '@inertiajs/react';
import { Heart, MessageCircle, Info, Truck, CreditCard, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { useInitials } from '@/hooks/use-initials';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { synth } from '@/lib/synth-service';

interface ListingSidebarProps {
    listing: {
        id: number;
        title: string;
        description: string;
        images: string[];
        location?: string | null;
        price: number;
        buy_now_price: number | null;
        is_auction: boolean;
        auction_end_date: string | null;
        current_high_bid: number;
        bids_count?: number;
        user: {
            id: number;
            name: string;
            avatar_url: string;
            average_rating?: number;
            ratings_count?: number;
        };
    };
}

export function ListingSidebar({ listing }: ListingSidebarProps) {
    const { t } = useTranslations();
    const getInitials = useInitials();
    const { auth } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: Math.max(listing.price, listing.current_high_bid) + 1,
    });

    const submitBid = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/listings/${listing.id}/bid`, {
            onSuccess: () => {
                synth.playSuccess();
                reset();
            },
        });
    };

    const buyNow = () => {
        if (confirm(t('common.confirm_purchase'))) {
            post(`/listings/${listing.id}/buy-now`, {
                onSuccess: () => synth.playFanfare(),
            });
        }
    };

    const currentPrice = listing.is_auction
        ? Math.max(listing.price, listing.current_high_bid)
        : listing.price;

    return (
        <div className="flex flex-col gap-6">
            {/* Bid / Watch Action Card */}
            <Card className="rounded-[24px] border-[#edf2f9] shadow-sm overflow-hidden">
                <CardContent className="p-6 flex flex-col gap-5">
                    {listing.is_auction && (
                        <div className="flex justify-between text-sm font-medium">
                            <span>{t('listing.sidebar.bids')}: <strong className="text-[#0b1b32]">{listing.bids_count ?? 0}</strong></span>
                            <span>{t('listing.sidebar.time_remaining')}: <strong className="text-[#0b1b32]">
                                {listing.auction_end_date ? new Date(listing.auction_end_date).toLocaleDateString() : t('common.n_a')}
                            </strong></span>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">
                            {listing.is_auction ? t('listing.show.current_price') : t('listing.create.price')}
                        </span>
                        <div className="text-3xl font-bold text-[#0e1d38]">
                            ¥{currentPrice.toLocaleString()}
                        </div>
                    </div>

                    {auth?.user ? (
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
                                                className="rounded-full h-12"
                                            />
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-full h-12 px-8 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold"
                                            >
                                                {t('listing.show.bid')}
                                            </Button>
                                        </div>
                                        {errors.amount && <p className="text-xs text-red-500 ml-4">{errors.amount}</p>}
                                    </div>
                                </form>
                            )}

                            {listing.buy_now_price && (
                                <Button
                                    onClick={buyNow}
                                    disabled={processing}
                                    className="w-full h-12 rounded-full bg-[#2b4b8f] hover:bg-[#1e3a7a] text-white font-bold text-lg"
                                >
                                    {t('listing.show.buy_now')} (¥{listing.buy_now_price.toLocaleString()})
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-sm text-[#5f6c84] bg-muted/50 p-4 rounded-2xl border border-dashed">
                            {t('listing.sidebar.login_prefix')}{' '}
                            <Link href="/login" className="text-[#0d9488] font-semibold underline underline-offset-4">
                                {t('listing.sidebar.login_link')}
                            </Link>{' '}
                            {t('listing.sidebar.login_suffix')}
                        </div>
                    )}

                    {auth?.user ? (
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-full border-[#cddef5] bg-[#f0f5fd] text-[#2b4b8f] font-bold hover:bg-[#e1ecfb]"
                            onClick={() => router.post(`/watchlist/${listing.id}/toggle`, {}, { preserveScroll: true })}
                        >
                            <Star className="mr-2 h-5 w-5 fill-[#2b4b8f]" />
                            {t('listing.sidebar.add_to_watchlist')}
                        </Button>
                    ) : (
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full h-12 rounded-full border-[#cddef5] bg-[#f0f5fd] text-[#2b4b8f] font-bold hover:bg-[#e1ecfb]">
                                <Star className="mr-2 h-5 w-5" />
                                {t('listing.sidebar.add_to_watchlist')}
                            </Button>
                        </Link>
                    )}
                </CardContent>
            </Card>

            {/* Shipping & Payment Card */}
            <Card className="rounded-[24px] border-[#edf2f9] shadow-sm">
                <CardHeader className="px-6 py-4 border-b border-[#f0f2f5] font-bold text-[#0b1b32] flex flex-row items-center gap-2">
                    <Truck size={18} className="text-[#0d9488]" />
                    {t('listing.sidebar.shipping_payment')}
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 text-sm">
                        <div className="flex justify-between pb-3 border-b border-dashed border-[#e4ecf5]">
                            <span className="text-[#5f6c84]">{t('listing.sidebar.shipping')}</span>
                            <span className="font-medium text-[#1a263b]">{t('listing.sidebar.buyer_pays')}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-dashed border-[#e4ecf5]">
                            <span className="text-[#5f6c84]">{t('listing.sidebar.shipping_method')}</span>
                            <span className="font-medium text-[#1a263b]">{t('listing.sidebar.domestic_delivery')}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-dashed border-[#e4ecf5]">
                            <span className="text-[#5f6c84]">{t('listing.show.location')}</span>
                            <span className="font-medium text-[#1a263b]">Tokyo, JP</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#5f6c84]">{t('listing.sidebar.payment')}</span>
                            <span className="font-medium text-[#1a263b]">Credit Card, Bank Transfer</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Seller Info Card */}
            <Card className="rounded-[24px] border-[#edf2f9] shadow-sm p-6">
                <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-[#e1e9f2]">
                        <AvatarImage src={listing.user.avatar_url || undefined} alt={listing.user.name} className="object-cover" />
                        <AvatarFallback className="bg-[#d3e0f0] text-[#3a5670] text-sm font-semibold">
                            {getInitials(listing.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-bold text-[#0b1b32]">
                            {t('listing.sidebar.seller')}:
                            <Link href={`/users/${listing.user.id}`} className="ml-1 text-[#0d9488] hover:underline">
                                {listing.user.name}
                            </Link>
                        </div>
                        <div className="text-sm text-[#5f6c84] flex items-center gap-1.5 mt-0.5">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={12}
                                        className={cn(
                                            "transition-colors",
                                            star <= Math.round(listing.user.average_rating || 0) ? "text-amber-500 fill-amber-500" : "text-slate-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-[#0d9488] font-medium">
                                ({listing.user.ratings_count || 0})
                            </span>
                        </div>
                    </div>
                </div>

                <Separator className="my-5 bg-[#eef2f8]" />

                <div className="flex gap-2.5">
                    <Button variant="secondary" className="flex-1 rounded-full bg-[#f3f9ff] text-[#2b4b8f] border-none hover:bg-[#e1f0ff] h-10 font-medium">
                        {t('listing.sidebar.ask_provider')}
                    </Button>
                    <Button variant="secondary" className="flex-1 rounded-full bg-[#f3f9ff] text-[#2b4b8f] border-none hover:bg-[#e1f0ff] h-10 font-medium">
                        {t('listing.sidebar.store_info')}
                    </Button>
                </div>
            </Card>

            {/* Reminder Note */}
            <div className="rounded-[24px] bg-[#f3f9ff] border border-[#d1e2fc] p-5 flex gap-3 text-sm text-[#1a263b] leading-snug">
                <div className="text-xl">🔔</div>
                <div>{t('listing.sidebar.watchlist_reminder')}</div>
            </div>
        </div>
    );
}
