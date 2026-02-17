import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { useTranslations } from '@/hooks/use-translations';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const { t } = useTranslations();

    return (
        <>
            <Head title={`${t('common.app_name')} — ${t('welcome.title')} ${t('welcome.title_highlight')}`}>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
                <meta name="theme-color" content="#FAFAF9" />
                <meta name="theme-color" content="#0c0c0c" media="(prefers-color-scheme: dark)" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-[#FAFAF9] text-[#1a1a1a] dark:bg-[#0c0c0c] dark:text-[#f5f5f4]">
                {/* Header — compact on mobile */}
                <header className="sticky top-0 z-10 border-b border-[#e8e7e5] bg-[#FAFAF9]/95 backdrop-blur-sm dark:border-[#272726] dark:bg-[#0c0c0c]/95">
                    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <Link
                            href={dashboard().url}
                            className="flex items-center gap-2"
                        >
                            <img
                                src="/images/logo.png"
                                alt=""
                                className="size-8 rounded-md object-cover"
                            />
                            <span className="text-lg font-semibold tracking-tight text-[#1a1a1a] dark:text-[#f5f5f4]">
                                {t('common.app_name')}
                            </span>
                        </Link>
                        <nav className="flex items-center gap-2 sm:gap-3">
                            <LocaleSwitcher className="border-0" />
                            {auth.user ? (
                                <Link
                                    href={dashboard().url}
                                    className="rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333] dark:bg-[#f5f5f4] dark:text-[#0c0c0c] dark:hover:bg-[#e5e5e4]"
                                >
                                    {t('common.dashboard')}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login().url}
                                        className="rounded-full px-4 py-2 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#e8e7e5] dark:text-[#f5f5f4] dark:hover:bg-[#272726]"
                                    >
                                        {t('common.log_in')}
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register().url}
                                            className="rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333] dark:bg-[#f5f5f4] dark:text-[#0c0c0c] dark:hover:bg-[#e5e5e4]"
                                        >
                                            {t('common.sign_up')}
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 md:pt-16">
                    {/* Hero */}
                    <section className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            {t('welcome.title')}
                            <br />
                            <span className="text-[#0d9488] dark:text-[#2dd4bf]">{t('welcome.title_highlight')}</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-md text-base text-[#6b6b6a] sm:text-lg dark:text-[#a1a1a0]">
                            {t('welcome.tagline')}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                            {canRegister && (
                                <Link
                                    href={register().url}
                                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#0d9488] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#0f766e] active:scale-[0.98] dark:bg-[#2dd4bf] dark:text-[#0c0c0c] dark:hover:bg-[#5eead4]"
                                >
                                    {t('welcome.start_selling')}
                                </Link>
                            )}
                            <Link
                                href={auth.user ? dashboard().url : (canRegister ? register().url : login().url)}
                                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#e8e7e5] bg-white px-6 py-3 text-base font-semibold text-[#1a1a1a] transition hover:border-[#d4d3d1] hover:bg-[#fafaf9] active:scale-[0.98] dark:border-[#272726] dark:bg-[#161615] dark:text-[#f5f5f4] dark:hover:border-[#3f3f3e] dark:hover:bg-[#1f1f1e]"
                            >
                                {t('welcome.browse_listings')}
                            </Link>
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="mt-16 sm:mt-24">
                        <h2 className="text-center text-xl font-semibold sm:text-2xl">
                            {t('welcome.how_it_works')}
                        </h2>
                        <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
                            <div className="rounded-2xl border border-[#e8e7e5] bg-white p-6 text-center shadow-sm dark:border-[#272726] dark:bg-[#161615]">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488] dark:bg-[#134e4a] dark:text-[#2dd4bf]">
                                    <span className="text-xl font-bold">1</span>
                                </div>
                                <h3 className="mt-4 font-semibold">{t('welcome.step_1_title')}</h3>
                                <p className="mt-2 text-sm text-[#6b6b6a] dark:text-[#a1a1a0]">
                                    {t('welcome.step_1_desc')}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#e8e7e5] bg-white p-6 text-center shadow-sm dark:border-[#272726] dark:bg-[#161615]">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488] dark:bg-[#134e4a] dark:text-[#2dd4bf]">
                                    <span className="text-xl font-bold">2</span>
                                </div>
                                <h3 className="mt-4 font-semibold">{t('welcome.step_2_title')}</h3>
                                <p className="mt-2 text-sm text-[#6b6b6a] dark:text-[#a1a1a0]">
                                    {t('welcome.step_2_desc')}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#e8e7e5] bg-white p-6 text-center shadow-sm dark:border-[#272726] dark:bg-[#161615]">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488] dark:bg-[#134e4a] dark:text-[#2dd4bf]">
                                    <span className="text-xl font-bold">3</span>
                                </div>
                                <h3 className="mt-4 font-semibold">{t('welcome.step_3_title')}</h3>
                                <p className="mt-2 text-sm text-[#6b6b6a] dark:text-[#a1a1a0]">
                                    {t('welcome.step_3_desc')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Bottom CTA */}
                    <section className="mt-16 rounded-2xl border border-[#e8e7e5] bg-[#f5f5f4] p-8 text-center dark:border-[#272726] dark:bg-[#161615] sm:mt-24 sm:p-10">
                        <h2 className="text-xl font-semibold sm:text-2xl">
                            {t('welcome.cta_heading')}
                        </h2>
                        <p className="mt-2 text-[#6b6b6a] dark:text-[#a1a1a0]">
                            {t('welcome.cta_sub')}
                        </p>
                        {canRegister && (
                            <Link
                                href={register().url}
                                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#1a1a1a] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#333] active:scale-[0.98] dark:bg-[#f5f5f4] dark:text-[#0c0c0c] dark:hover:bg-[#e5e5e4]"
                            >
                                {t('common.create_free_account')}
                            </Link>
                        )}
                    </section>
                </main>

                <footer className="border-t border-[#e8e7e5] py-6 dark:border-[#272726]">
                    <div className="mx-auto max-w-6xl px-4 text-center text-sm text-[#6b6b6a] dark:text-[#a1a1a0] sm:px-6">
                        © {new Date().getFullYear()} {t('common.app_name')}. {t('welcome.footer')}
                    </div>
                </footer>
            </div>
        </>
    );
}
