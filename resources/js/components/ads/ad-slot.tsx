import React from 'react';
import { usePage } from '@inertiajs/react';
import { ExternalLink, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LayoutAd, LayoutAds } from '@/types';

interface AdSlotProps {
    placement: string;
    variant?: 'banner' | 'rail' | 'footer';
    className?: string;
}

export function AdSlot({
    placement,
    variant = 'rail',
    className,
}: AdSlotProps) {
    const { layoutAds = {} } = usePage().props as { layoutAds?: LayoutAds };
    const ads = layoutAds[placement] ?? [];
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        if (ads.length <= 1) {
            return;
        }

        const interval = window.setInterval(() => {
            setIndex((current) => (current + 1) % ads.length);
        }, 8000);

        return () => window.clearInterval(interval);
    }, [ads.length]);

    if (ads.length === 0) {
        return null;
    }

    const ad = ads[index % ads.length];

    return (
        <div className={className}>
            <AdCard ad={ad} variant={variant} />
        </div>
    );
}

function AdCard({
    ad,
    variant,
}: {
    ad: LayoutAd;
    variant: AdSlotProps['variant'];
}) {
    const isBanner = variant === 'banner' || variant === 'footer';

    return (
        <a
            href={ad.target_url}
            target={ad.target_url.startsWith('/') ? undefined : '_blank'}
            rel={
                ad.target_url.startsWith('/')
                    ? undefined
                    : 'noopener noreferrer'
            }
            className={cn(
                'group block overflow-hidden rounded-sm border border-[#dbe7f4] bg-white shadow-sm transition hover:border-[#0d9488]/40 hover:shadow-md',
                isBanner ? 'p-3 sm:p-4' : 'p-3',
            )}
        >
            <div
                className={cn(
                    'flex gap-3',
                    isBanner ? 'items-center' : 'flex-col',
                )}
            >
                <div
                    className={cn(
                        'relative shrink-0 overflow-hidden rounded-sm bg-[#eef4fb]',
                        isBanner
                            ? 'h-16 w-24 sm:h-20 sm:w-36'
                            : 'aspect-[4/3] w-full',
                    )}
                >
                    {ad.image_url ? (
                        <img
                            src={ad.image_url}
                            alt={ad.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#7b8da6]">
                            <Megaphone size={isBanner ? 24 : 32} />
                        </div>
                    )}
                    <span className="absolute top-2 left-2 rounded-sm bg-white/95 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#5f6c84] uppercase shadow-sm">
                        Ad
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            className={cn(
                                'leading-snug font-bold text-[#0b1b32] group-hover:text-[#0d9488]',
                                isBanner
                                    ? 'line-clamp-1 text-sm sm:text-base'
                                    : 'line-clamp-2 text-sm',
                            )}
                        >
                            {ad.title}
                        </h3>
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7f8fa4]" />
                    </div>
                    <p
                        className={cn(
                            'mt-1 text-[#5f6c84]',
                            isBanner
                                ? 'line-clamp-1 text-xs sm:text-sm'
                                : 'line-clamp-3 text-xs',
                        )}
                    >
                        {ad.description}
                    </p>
                    {ad.advertiser && (
                        <p className="mt-2 truncate text-[11px] font-medium text-[#7f8fa4]">
                            {ad.advertiser}
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
}
