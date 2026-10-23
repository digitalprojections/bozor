import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, Megaphone, Armchair, Wrench } from 'lucide-react';
import { WelcomeIllustration } from '@/components/welcome-illustration';
import { useTranslations } from '@/hooks/use-translations';
import BazaarLayout from '@/layouts/bazaar-layout';
import { listingEntryHref } from '@/lib/listing-entry';

const examples = [
    { key: 'item', icon: Armchair, color: 'bg-[#e6f4ed] text-[#25634c]' },
    { key: 'service', icon: Wrench, color: 'bg-[#fff0db] text-[#925323]' },
    {
        key: 'announcement',
        icon: Megaphone,
        color: 'bg-[#eaf0ff] text-[#456597]',
    },
] as const;
const scenes = ['post', 'connect', 'agree'] as const;
const primaryButton =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#115e59] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { t } = useTranslations();
    const { auth } = usePage<{
        auth: { user: { is_guest?: boolean } | null };
    }>().props;
    const entryHref = listingEntryHref(auth?.user, canRegister);

    return (
        <BazaarLayout title={t('welcome.title')}>
            <Head
                title={`${t('welcome.title')} ${t('welcome.title_highlight')}`}
            >
                <meta
                    name="description"
                    content={t('welcome.meta_description')}
                />
            </Head>
            <section className="relative overflow-hidden rounded-3xl border border-[#dcebe2] bg-[#faf9f2] p-6 sm:p-8 xl:p-12">
                <div className="grid items-center gap-8 xl:grid-cols-[1.1fr_1fr]">
                    <div>
                        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#0f766e]">
                            <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                            {t('welcome.eyebrow')}
                        </p>
                        <h1 className="max-w-xl text-3xl leading-tight font-bold tracking-tight text-balance text-[#183f38] sm:text-4xl xl:text-5xl">
                            {t('welcome.title')}{' '}
                            <span className="text-[#0f766e]">
                                {t('welcome.title_highlight')}
                            </span>
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#52655e]">
                            {t('welcome.tagline')}
                        </p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <Link href={entryHref} className={primaryButton}>
                                {t('welcome.start_selling')}
                                <ArrowRight size={18} aria-hidden="true" />
                            </Link>
                            <Link
                                href="/marketplace"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#cbdcd1] bg-white px-5 py-3 text-sm font-semibold text-[#183f38] hover:bg-[#eef5ef]"
                            >
                                {t('welcome.browse_listings')}
                            </Link>
                        </div>
                        <p className="mt-4 flex items-start gap-2 text-sm text-[#52655e]">
                            <Check
                                size={17}
                                className="mt-0.5 shrink-0 text-[#0f766e]"
                                aria-hidden="true"
                            />
                            {t('welcome.no_fee')}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white bg-white/75 p-4 sm:p-5">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-sm font-bold text-[#183f38]">
                                {t('welcome.examples_heading')}
                            </h2>
                            <span className="rounded-full bg-[#edf3ed] px-2.5 py-1 text-xs font-medium text-[#52655e]">
                                {t('welcome.examples_label')}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {examples.map(({ key, icon: Icon, color }) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-4 rounded-xl border border-[#e6ece5] bg-white p-3 sm:p-4"
                                >
                                    <div
                                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${color}`}
                                    >
                                        <Icon
                                            size={29}
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-[#617269]">
                                            {t(
                                                `welcome.example_${key}_category`,
                                            )}
                                        </p>
                                        <h3 className="mt-1 text-sm font-semibold text-[#243e35]">
                                            {t(`welcome.example_${key}_title`)}
                                        </h3>
                                        <p className="mt-1 text-xs leading-relaxed text-[#617269]">
                                            {t(`welcome.example_${key}_desc`)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-[#617269]">
                            {t('welcome.examples_note')}
                        </p>
                    </div>
                </div>
            </section>
            <section aria-labelledby="welcome-steps" className="py-3">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                    <h2
                        id="welcome-steps"
                        className="text-xl font-bold text-[#183f38] sm:text-2xl dark:text-teal-100"
                    >
                        {t('welcome.how_it_works')}
                    </h2>
                    <p className="text-sm text-[#617269] dark:text-slate-300">
                        {t('welcome.steps_note')}
                    </p>
                </div>
                <ol className="grid gap-4 md:grid-cols-3">
                    {scenes.map((scene, index) => (
                        <li
                            key={scene}
                            className="rounded-2xl border border-[#e2e9e5] bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
                        >
                            <WelcomeIllustration
                                scene={scene}
                                className="mx-auto h-32 w-full max-w-64"
                            />
                            <div className="mt-3 flex items-baseline gap-2.5">
                                <span className="text-xs font-bold text-[#0f766e] dark:text-teal-300">
                                    0{index + 1}
                                </span>
                                <h3 className="font-bold text-[#243e35] dark:text-slate-100">
                                    {t(`welcome.step_${index + 1}_title`)}
                                </h3>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-[#617269] dark:text-slate-300">
                                {t(`welcome.step_${index + 1}_desc`)}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>
            <section className="flex flex-col gap-5 rounded-2xl bg-[#e6f3ed] p-6 sm:p-8 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-2xl">
                    <h2 className="text-xl font-bold text-[#183f38]">
                        {t('welcome.cta_heading')}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#426155]">
                        {t('welcome.free_note')}
                    </p>
                </div>
                <Link href={entryHref} className={`${primaryButton} shrink-0`}>
                    {t('welcome.start_selling')}
                    <ArrowRight size={18} aria-hidden="true" />
                </Link>
            </section>
        </BazaarLayout>
    );
}
