import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuctionCountdownVariant = 'overlay' | 'inline' | 'panel' | 'compact';

interface AuctionCountdownProps {
    endsAt: string | null;
    ended?: boolean;
    variant?: AuctionCountdownVariant;
    className?: string;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function AuctionCountdown({
    endsAt,
    ended = false,
    variant = 'inline',
    className,
}: AuctionCountdownProps) {
    const endTime = React.useMemo(() => parseEndTime(endsAt), [endsAt]);
    const [now, setNow] = React.useState(() => Date.now());

    React.useEffect(() => {
        if (!endTime || ended) {
            return;
        }

        const remaining = endTime - Date.now();
        const intervalMs = remaining <= HOUR ? SECOND : MINUTE;
        const timer = window.setInterval(() => setNow(Date.now()), intervalMs);

        return () => window.clearInterval(timer);
    }, [endTime, ended, now]);

    if (!endTime) {
        return null;
    }

    const remaining = Math.max(0, endTime - now);
    const isEnded = ended || remaining <= 0;
    const urgency = getUrgency(remaining, isEnded);
    const label = isEnded ? 'Ended' : formatRemaining(remaining);

    return (
        <span
            className={cn(
                'inline-flex min-w-0 items-center gap-1.5 font-bold tabular-nums',
                variantClasses[variant],
                urgencyClasses[urgency],
                className,
            )}
            title={`Ends ${new Date(endTime).toLocaleString()}`}
            aria-live={urgency === 'critical' ? 'polite' : 'off'}
        >
            <Clock className="size-3.5 shrink-0" />
            <span className="truncate">{label}</span>
        </span>
    );
}

function parseEndTime(endsAt: string | null): number | null {
    if (!endsAt) {
        return null;
    }

    const time = new Date(endsAt).getTime();

    return Number.isNaN(time) ? null : time;
}

function getUrgency(
    remaining: number,
    isEnded: boolean,
): 'ended' | 'critical' | 'soon' | 'normal' {
    if (isEnded) {
        return 'ended';
    }

    if (remaining <= 10 * MINUTE) {
        return 'critical';
    }

    if (remaining <= HOUR) {
        return 'soon';
    }

    return 'normal';
}

function formatRemaining(remaining: number): string {
    if (remaining >= DAY) {
        const days = Math.floor(remaining / DAY);
        const hours = Math.floor((remaining % DAY) / HOUR);

        return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }

    if (remaining >= HOUR) {
        const hours = Math.floor(remaining / HOUR);
        const minutes = Math.floor((remaining % HOUR) / MINUTE);

        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    const minutes = Math.floor(remaining / MINUTE);
    const seconds = Math.floor((remaining % MINUTE) / SECOND);

    if (remaining <= 10 * MINUTE) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${Math.max(1, minutes)}m`;
}

const variantClasses: Record<AuctionCountdownVariant, string> = {
    overlay: 'rounded-full px-2.5 py-1 text-xs shadow-sm backdrop-blur-sm',
    inline: 'text-xs sm:text-sm',
    compact: 'rounded-full px-2 py-0.5 text-[11px]',
    panel: 'w-full justify-center rounded-[14px] px-3 py-2 text-base sm:text-lg',
};

const urgencyClasses = {
    normal: 'border border-sky-200 bg-white/95 text-[#0b1b32]',
    soon: 'border border-amber-300 bg-amber-100 text-amber-900',
    critical: 'border border-red-300 bg-red-100 text-red-700',
    ended: 'border border-slate-200 bg-slate-100 text-slate-600',
};
