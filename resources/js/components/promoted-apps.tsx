import { ArrowUpRight, AudioLines, Sparkles, Swords } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { promotedApps } from '@/lib/promoted-apps';

const icons = {
    genstudio: Sparkles,
    localscribe: AudioLines,
    checkers: Swords,
};

export function PromotedApps() {
    const { t } = useTranslations();

    return (
        <section
            aria-labelledby="promoted-apps-title"
            className="rounded-xl border border-[#e1e9f2] bg-white p-4 dark:border-[#1f2a3d] dark:bg-[#111827]"
        >
            <h2
                id="promoted-apps-title"
                className="mb-3 text-sm font-semibold text-[#1a263b] dark:text-[#e5edf6]"
            >
                {t('promoted_apps.title')}
            </h2>
            <div className="space-y-1">
                {promotedApps.map((app) => {
                    const Icon = icons[app.id];
                    return (
                        <a
                            key={app.id}
                            href={app.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:hover:bg-teal-950/40"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                                <Icon size={18} aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">
                                    {app.name}
                                </span>
                                <span className="mt-0.5 block text-xs leading-relaxed text-[#5f6c84] dark:text-[#9fb0c5]">
                                    {t(`promoted_apps.${app.id}`)}
                                </span>
                            </span>
                            <ArrowUpRight
                                size={14}
                                className="mt-1 shrink-0 text-[#5f6c84] dark:text-[#9fb0c5]"
                                aria-hidden="true"
                            />
                            <span className="sr-only">
                                {t('promoted_apps.new_tab')}
                            </span>
                        </a>
                    );
                })}
            </div>
            <a
                href="https://created.link/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-between gap-2 border-t border-[#e1e9f2] pt-3 text-xs font-semibold text-teal-700 hover:underline dark:border-[#1f2a3d] dark:text-teal-300"
            >
                {t('promoted_apps.all_apps')}
                <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only">{t('promoted_apps.new_tab')}</span>
            </a>
        </section>
    );
}
