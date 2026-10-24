import { Heart } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

export function LikeCount({
    count,
    className,
    showHeart = true,
}: {
    count?: number;
    className?: string;
    showHeart?: boolean;
}) {
    const { t, locale } = useTranslations();
    const available = typeof count === 'number' && Number.isFinite(count);
    const value = available ? new Intl.NumberFormat(locale).format(count) : '—';
    const label = available
        ? t('listing.likes_count', { count: value })
        : t('listing.likes_unavailable');
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold tabular-nums',
                className,
            )}
            aria-label={label}
            title={label}
        >
            {showHeart && <Heart size={14} aria-hidden="true" />}
            <span aria-hidden="true">{value}</span>
        </span>
    );
}
