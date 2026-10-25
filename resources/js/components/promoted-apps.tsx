import { ArrowUpRight, AudioLines, Sparkles, Swords } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { promotedApps } from '@/lib/promoted-apps';

const styles = {
    genstudio: {
        icon: Sparkles,
        background: 'from-indigo-950 via-violet-950 to-fuchsia-900',
        accent: 'bg-fuchsia-300 text-indigo-950',
    },
    localscribe: {
        icon: AudioLines,
        background: 'from-slate-950 via-teal-950 to-cyan-900',
        accent: 'bg-teal-200 text-teal-950',
    },
    checkers: {
        icon: Swords,
        background: 'from-stone-950 via-amber-950 to-orange-900',
        accent: 'bg-amber-200 text-amber-950',
    },
};

export function PromotedApps() {
    const { t } = useTranslations();

    return (
        <section aria-label={t('promoted_apps.title')} className="space-y-4">
            {promotedApps.map((app) => {
                const style = styles[app.id];
                const Icon = style.icon;
                return (
                    <a
                        key={app.id}
                        href={app.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative block overflow-hidden rounded-xl bg-linear-to-br ${style.background} p-5 text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600`}
                    >
                        <span className="mb-4 block text-[10px] tracking-widest text-white/70 uppercase">
                            {t('promoted_apps.title')}
                        </span>
                        <Icon
                            size={32}
                            className="mb-3 text-white/90"
                            aria-hidden="true"
                        />
                        <span className="block text-lg font-bold tracking-tight">
                            {app.name}
                        </span>
                        <span className="mt-2 block text-sm leading-relaxed text-white/85">
                            {t(`promoted_apps.${app.id}`)}
                        </span>
                        <span
                            className={`mt-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-transform group-hover:translate-x-1 ${style.accent}`}
                        >
                            {t(`promoted_apps.${app.id}_cta`)}
                            <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                        <span className="sr-only">
                            {t('promoted_apps.new_tab')}
                        </span>
                    </a>
                );
            })}
        </section>
    );
}
