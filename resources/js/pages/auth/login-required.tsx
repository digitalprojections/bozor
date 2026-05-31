import { Head, Link } from '@inertiajs/react';
import { LockKeyhole } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';

export default function LoginRequired() {
    const { t } = useTranslations();
    const title = t('auth.login_required_title') === 'auth.login_required_title'
        ? 'Login required'
        : t('auth.login_required_title');
    const description = t('auth.login_required_description') === 'auth.login_required_description'
        ? 'Please log in to continue. You can keep browsing, and we will only take you to login when you choose to.'
        : t('auth.login_required_description');

    return (
        <BazaarLayout title={title}>
            <Head title={title} />
            <Card className="mx-auto max-w-xl rounded-[24px] border-[#dbe7f5] shadow-sm">
                <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f9ff] text-[#2b4b8f]">
                        <LockKeyhole size={30} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-[#0b1b32]">{title}</h2>
                        <p className="text-sm leading-relaxed text-[#5f6c84]">{description}</p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Button asChild variant="outline" className="rounded-full border-[#cbd5e1]">
                            <Link href="/marketplace">{t('marketplace.title')}</Link>
                        </Button>
                        <Button asChild className="rounded-full bg-[#0d9488] px-8 text-white hover:bg-[#0f766e]">
                            <Link href="/login">{t('common.login')}</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </BazaarLayout>
    );
}
