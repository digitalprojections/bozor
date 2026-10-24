import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import React from 'react';
import { LikeCount } from '@/components/listings/like-count';
import { LoginRequiredDialog } from '@/components/login-required-dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

interface WatchButtonProps {
    listingId: number;
    count?: number;
    isWatched: boolean;
    variant?: 'overlay' | 'button';
    className?: string;
    onToggle?: (isWatched: boolean) => void;
}

export function WatchButton({
    listingId,
    count,
    isWatched,
    variant = 'button',
    className,
    onToggle,
}: WatchButtonProps) {
    const { t } = useTranslations();
    const { auth } = usePage<{ auth: Auth }>().props;
    const [isLoading, setIsLoading] = React.useState(false);
    const [loginRequiredOpen, setLoginRequiredOpen] = React.useState(false);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user || auth.user.is_guest) {
            setLoginRequiredOpen(true);
            return;
        }

        if (isLoading) return;
        setIsLoading(true);
        router.post(
            `/watchlist/${listingId}/toggle`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => onToggle?.(!isWatched),
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    if (variant === 'overlay') {
        return (
            <>
                <button
                    disabled={isLoading}
                    onClick={handleToggle}
                    className={cn(
                        'absolute top-2 right-2 z-10 flex min-h-9 min-w-12 items-center justify-center gap-1.5 rounded-full px-2.5 shadow transition-all',
                        isWatched
                            ? 'bg-white text-rose-500'
                            : 'bg-black/30 text-white hover:bg-white hover:text-rose-400',
                        isLoading && 'scale-90 opacity-50',
                        className,
                    )}
                    aria-pressed={isWatched}
                    aria-busy={isLoading}
                    title={t(
                        isWatched
                            ? 'listing.sidebar.remove_from_watchlist'
                            : 'listing.sidebar.add_to_watchlist',
                    )}
                    aria-label={`${t(isWatched ? 'listing.sidebar.remove_from_watchlist' : 'listing.sidebar.add_to_watchlist')}. ${count === undefined ? t('listing.likes_unavailable') : t('listing.likes_count', { count })}`}
                >
                    <Heart
                        size={15}
                        className={cn(
                            isWatched && 'fill-current',
                            isLoading && 'animate-pulse',
                        )}
                    />
                    <LikeCount count={count} showHeart={false} />
                </button>
                <LoginRequiredDialog
                    open={loginRequiredOpen}
                    onOpenChange={setLoginRequiredOpen}
                />
            </>
        );
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                className={cn(
                    'flex h-9 items-center gap-2 rounded-full px-5 transition-all sm:h-10',
                    isWatched
                        ? 'border-[#ff4d4f] bg-[#fff1f0] text-[#ff4d4f] hover:bg-[#fff1f0]/80'
                        : 'border-[#cbd5e1] text-[#475569] hover:bg-slate-50',
                    className,
                )}
                onClick={handleToggle}
                aria-pressed={isWatched}
                aria-busy={isLoading}
            >
                <Heart
                    size={16}
                    className={cn(
                        isWatched && 'fill-current',
                        isLoading && 'animate-pulse',
                    )}
                />
                <span className="text-sm font-semibold">
                    {isWatched
                        ? t('listing.sidebar.remove_from_watchlist') ||
                          'Watched'
                        : t('listing.sidebar.add_to_watchlist') || 'Watch'}
                </span>
                <LikeCount count={count} showHeart={false} />
            </Button>
            <LoginRequiredDialog
                open={loginRequiredOpen}
                onOpenChange={setLoginRequiredOpen}
            />
        </>
    );
}
