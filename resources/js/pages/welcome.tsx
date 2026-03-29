import { Head, Link } from '@inertiajs/react';
import { dashboard, register } from '@/routes';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent } from '@/components/ui/card';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { t } = useTranslations();

    return (
        <BazaarLayout title={t('welcome.title')}>
            <Head title={`${t('common.app_name')} — ${t('welcome.title')} ${t('welcome.title_highlight')}`} />

            <Card className="rounded-[4px] border-[#f0f2f5] bg-[#fafcff] shadow-sm">
                <CardContent className="p-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-[#0b1a31] sm:text-5xl">
                        {t('welcome.title')} <br />
                        <span className="text-[#0d9488]">{t('welcome.title_highlight')}</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-lg text-lg text-[#5f6c84]">
                        {t('welcome.tagline')}
                    </p>
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        {canRegister && (
                            <Link
                                href={register().url}
                                className="inline-flex h-12 items-center justify-center rounded-sm bg-[#0d9488] px-8 text-base font-bold text-white shadow-sm transition hover:bg-[#0f766e]"
                            >
                                {t('welcome.start_selling')}
                            </Link>
                        )}
                        <Link
                            href="/marketplace"
                            className="inline-flex h-12 items-center justify-center rounded-sm border border-[#cfddee] bg-white px-8 text-base font-bold text-[#1a263b] transition hover:bg-[#f8fafd]"
                        >
                            {t('welcome.browse_listings')}
                        </Link>

                    </div>
                </CardContent>
            </Card>

            {/* How it works */}
            <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold tracking-tight text-[#0b1a31]">
                    {t('welcome.how_it_works')}
                </h2>
                <div className="grid gap-6 sm:grid-cols-3">
                    {[1, 2, 3].map((step) => (
                        <Card key={step} className="rounded-[4px] border-[#f0f2f5] bg-white shadow-sm">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488] font-bold text-xl">
                                    {step}
                                </div>
                                <h3 className="mt-4 font-bold text-[#0b1a31]">{t(`welcome.step_${step}_title` as any)}</h3>
                                <p className="mt-2 text-sm text-[#5f6c84]">
                                    {t(`welcome.step_${step}_desc` as any)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <Card className="rounded-[4px] border-[#f0f2f5] bg-[#1a263b] shadow-sm">
                <CardContent className="p-10 text-center text-white">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        {t('welcome.cta_heading')}
                    </h2>
                    <p className="mt-2 text-[#a3b6cc]">
                        {t('welcome.cta_sub')}
                    </p>
                    {canRegister && (
                        <Link
                            href={register().url}
                            className="mt-8 inline-flex h-12 items-center justify-center rounded-sm bg-white px-8 text-base font-bold text-[#1a263b] transition hover:bg-[#fafaf9]"
                        >
                            {t('common.create_free_account')}
                        </Link>
                    )}
                </CardContent>
            </Card>
        </BazaarLayout>
    );
}
