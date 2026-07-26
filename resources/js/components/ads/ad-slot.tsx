import React from 'react';
import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ExternalLink, Megaphone } from 'lucide-react';
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
    const hasMultipleAds = ads.length > 1;

    React.useEffect(() => {
        setIndex(0);
    }, [placement, ads.length]);

    React.useEffect(() => {
        if (!hasMultipleAds) {
            return;
        }

        const interval = window.setInterval(() => {
            setIndex((current) => (current + 1) % ads.length);
        }, 8000);

        return () => window.clearInterval(interval);
    }, [ads.length, hasMultipleAds]);

    if (ads.length === 0) {
        return null;
    }

    const ad = ads[index % ads.length];
    const showPrevious = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIndex((current) => (current - 1 + ads.length) % ads.length);
    };
    const showNext = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIndex((current) => (current + 1) % ads.length);
    };

    return (
        <div className={cn('relative', className)}>
            <AdCard ad={ad} variant={variant} />
            {hasMultipleAds && (
                <>
                    <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
                        <CarouselButton
                            label="Previous ad"
                            onClick={showPrevious}
                            className="pointer-events-auto"
                        >
                            <ChevronLeft size={16} />
                        </CarouselButton>
                        <CarouselButton
                            label="Next ad"
                            onClick={showNext}
                            className="pointer-events-auto"
                        >
                            <ChevronRight size={16} />
                        </CarouselButton>
                    </div>
                    <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
                        {ads.map((item, dotIndex) => (
                            <button
                                key={`${item.id}-${dotIndex}`}
                                type="button"
                                aria-label={`Show ad ${dotIndex + 1}`}
                                onClick={(event) => {
                                    event.preventDefault();
                                    setIndex(dotIndex);
                                }}
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    dotIndex === index % ads.length
                                        ? 'w-4 bg-[#0d9488]'
                                        : 'w-1.5 bg-white/85 shadow-sm',
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function CarouselButton({
    label,
    onClick,
    className,
    children,
}: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border border-white/75 bg-white/90 text-[#35516f] shadow-sm transition hover:bg-white hover:text-[#0d9488]',
                className,
            )}
        >
            {children}
        </button>
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
                isBanner ? 'p-2' : 'p-2',
            )}
        >
            <div
                className={cn(
                    'gap-2',
                    isBanner
                        ? 'grid grid-cols-1 sm:grid-cols-[minmax(0,3fr)_minmax(9rem,1fr)]'
                        : 'flex flex-col',
                )}
            >
                <div
                    className={cn(
                        'relative shrink-0 overflow-hidden rounded-sm bg-[#eef4fb]',
                        isBanner
                            ? 'aspect-[16/7] w-full sm:aspect-auto sm:h-28'
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
                    <span className="absolute top-1.5 left-1.5 rounded-sm bg-white/95 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-[#5f6c84] uppercase shadow-sm">
                        Ad
                    </span>
                </div>

                <div
                    className={cn(
                        'min-w-0',
                        isBanner
                            ? 'flex flex-col justify-center px-1 py-1 sm:px-2'
                            : 'px-1 pt-1',
                    )}
                >
                    <div className="flex items-start justify-between gap-1.5">
                        <h3
                            className={cn(
                                'leading-tight font-bold text-[#0b1b32] group-hover:text-[#0d9488]',
                                isBanner
                                    ? 'line-clamp-2 text-xs sm:text-sm'
                                    : 'line-clamp-2 text-xs',
                            )}
                        >
                            {ad.title}
                        </h3>
                        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-[#7f8fa4]" />
                    </div>
                    <p
                        className={cn(
                            'mt-1 leading-snug text-[#5f6c84]',
                            isBanner
                                ? 'line-clamp-2 text-[11px]'
                                : 'line-clamp-2 text-[11px]',
                        )}
                    >
                        {ad.description}
                    </p>
                    {ad.advertiser && (
                        <p className="mt-1.5 truncate text-[10px] font-medium text-[#7f8fa4]">
                            {ad.advertiser}
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
}
