import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface WatchButtonProps {
    listingId: number;
    isWatched: boolean;
    variant?: 'overlay' | 'button';
    className?: string;
    onToggle?: (isWatched: boolean) => void;
}

export function WatchButton({ 
    listingId, 
    isWatched, 
    variant = 'button', 
    className,
    onToggle
}: WatchButtonProps) {
    const { t } = useTranslations();
    const { auth } = usePage().props as any;
    const [isLoading, setIsLoading] = React.useState(false);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user || auth.user.is_guest) {
            router.get('/login');
            return;
        }

        setIsLoading(true);
        router.post(`/watchlist/${listingId}/toggle`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsLoading(false);
                if (onToggle) onToggle(!isWatched);
            },
        });
    };

    if (variant === 'overlay') {
        return (
            <button
                disabled={isLoading}
                onClick={handleToggle}
                className={cn(
                    "absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full shadow transition-all z-10",
                    isWatched
                        ? 'bg-white text-rose-500'
                        : 'bg-black/30 text-white hover:bg-white hover:text-rose-400',
                    isLoading && 'opacity-50 scale-90',
                    className
                )}
                title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
            >
                <Heart
                    size={15}
                    className={cn(isWatched && 'fill-current', isLoading && 'animate-pulse')}
                />
            </button>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            className={cn(
                "rounded-full h-9 sm:h-10 px-5 flex items-center gap-2 transition-all",
                isWatched 
                    ? 'border-[#ff4d4f] text-[#ff4d4f] bg-[#fff1f0] hover:bg-[#fff1f0]/80' 
                    : 'border-[#cbd5e1] text-[#475569] hover:bg-slate-50',
                className
            )}
            onClick={handleToggle}
        >
            <Heart size={16} className={cn(isWatched && 'fill-current', isLoading && 'animate-pulse')} />
            <span className="font-semibold text-sm">
                {isWatched ? (t('listing.sidebar.remove_from_watchlist') || 'Watched') : (t('listing.sidebar.add_to_watchlist') || 'Watch')}
            </span>
        </Button>
    );
}
