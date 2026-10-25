import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { nextPromotionIndex, promotedApps } from '@/lib/promoted-apps';

const slides = [...promotedApps, ...promotedApps];

export function PromotedApps() {
    const { t } = useTranslations();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [interacting, setInteracting] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(true);
    const advance = (direction: number) =>
        setIndex((current) =>
            nextPromotionIndex(current, direction, promotedApps.length),
        );

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (paused || interacting || reducedMotion) return;
        const timer = window.setInterval(() => {
            if (!document.hidden) advance(1);
        }, 6000);
        return () => window.clearInterval(timer);
    }, [paused, interacting, reducedMotion]);

    return (
        <section
            aria-label={t('promoted_apps.title')}
            aria-roledescription={t('promoted_apps.carousel')}
            className="border-b border-[#e1e9f2] bg-white px-4 pt-3 pb-2 md:px-8 dark:border-[#1f2a3d] dark:bg-[#111827]"
            onMouseEnter={() => setInteracting(true)}
            onMouseLeave={() => setInteracting(false)}
            onFocusCapture={() => setInteracting(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                    setInteracting(false);
            }}
        >
            <div className="mx-auto max-w-[1200px]">
                <div className="mb-1 text-right text-[10px] text-slate-500 dark:text-slate-400">
                    {t('promoted_apps.title')}
                </div>
                <div className="relative overflow-hidden [--ad-width:230px] sm:[--ad-width:260px] lg:[--ad-width:300px]">
                    <div
                        className="flex gap-1 transition-transform duration-500 ease-out motion-reduce:transition-none"
                        style={{
                            transform: `translateX(calc(${index} * (var(--ad-width) + 4px) * -1))`,
                        }}
                    >
                        {slides.map((app, slideIndex) => {
                            const visible =
                                slideIndex >= index && slideIndex < index + 4;
                            return (
                                <a
                                    key={`${app.id}-${slideIndex}`}
                                    href={app.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-hidden={!visible}
                                    tabIndex={visible ? 0 : -1}
                                    aria-label={`${app.name}. ${t(`promoted_apps.${app.id}`)} ${t('promoted_apps.new_tab')}`}
                                    className="block w-(--ad-width) shrink-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600"
                                >
                                    <img
                                        src={app.image}
                                        alt={`${app.name} — ${t(`promoted_apps.${app.id}_cta`)}`}
                                        width={720}
                                        height={600}
                                        decoding="async"
                                        className="aspect-[6/5] w-full object-contain"
                                        draggable={false}
                                    />
                                </a>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        aria-label={t('promoted_apps.previous')}
                        onClick={() => advance(-1)}
                        className="absolute top-1/2 left-0 flex size-8 -translate-y-1/2 items-center justify-center bg-black/55 text-white hover:bg-black/75"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        type="button"
                        aria-label={t('promoted_apps.next')}
                        onClick={() => advance(1)}
                        className="absolute top-1/2 right-0 flex size-8 -translate-y-1/2 items-center justify-center bg-black/55 text-white hover:bg-black/75"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="mt-1 flex items-center justify-center gap-1">
                    {promotedApps.map((app, slideIndex) => (
                        <button
                            type="button"
                            key={app.id}
                            aria-label={app.name}
                            aria-pressed={slideIndex === index}
                            onClick={() => setIndex(slideIndex)}
                            className="flex size-7 items-center justify-center"
                        >
                            <span
                                className={`size-1.5 rounded-full ${slideIndex === index ? 'bg-slate-700 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'}`}
                            />
                        </button>
                    ))}
                    {!reducedMotion && (
                        <button
                            type="button"
                            aria-label={t(
                                paused
                                    ? 'promoted_apps.play'
                                    : 'promoted_apps.pause',
                            )}
                            onClick={() => setPaused((current) => !current)}
                            className="ml-2 flex h-6 w-8 items-center justify-center rounded-sm border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
                        >
                            {paused ? <Play size={12} /> : <Pause size={12} />}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
