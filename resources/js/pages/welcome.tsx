import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';
import { ListingIllustration } from '@/components/listing-illustration';
import { WelcomeIllustration } from '@/components/welcome-illustration';
import { useTranslations } from '@/hooks/use-translations';
import BazaarLayout from '@/layouts/bazaar-layout';
import { listingEntryHref } from '@/lib/listing-entry';

const examples = ['item', 'service', 'announcement'] as const;
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
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {examples.map((key) => (
                                <div
                                    key={key}
                                    className="rounded-xl bg-white p-2 text-center sm:p-3"
                                >
                                    <ListingIllustration
                                        kind={key}
                                        className="mx-auto aspect-square w-full max-w-40"
                                    />
                                    <h3 className="mt-2 text-xs leading-snug font-semibold text-[#243e35] sm:text-sm">
                                        {t(`welcome.example_${key}_title`)}
                                    </h3>
                                </div>
                            ))}
                        </div>
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
                </div>
                <ol className="grid gap-4 md:grid-cols-3">
                    {scenes.map((scene, index) => (
                        <li
                            key={scene}
                            className="rounded-2xl border border-[#e2e9e5] bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
                        >
                            <WelcomeIllustration
                                scene={scene}
                                className="mx-auto h-40 w-full max-w-64"
                            />
                            <div className="mt-3 flex items-baseline gap-2.5">
                                <span className="text-xs font-bold text-[#0f766e] dark:text-teal-300">
                                    0{index + 1}
                                </span>
                                <h3 className="font-bold text-[#243e35] dark:text-slate-100">
                                    {t(`welcome.step_${index + 1}_title`)}
                                </h3>
                            </div>
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
                        {t('welcome.free_short')}
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
