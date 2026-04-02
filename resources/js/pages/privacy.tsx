import React from 'react';
import { Head } from '@inertiajs/react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicy() {
    const { t } = useTranslations();

    return (
        <BazaarLayout title={t('privacy.title')}>
            <Head title={t('privacy.title')} />

            <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
                <h1 className="text-3xl font-bold text-[#0b1a31]">{t('privacy.title')}</h1>
                
                <Card className="rounded-[16px] border-[#edf2f9] shadow-sm">
                    <CardContent className="p-6 sm:p-8 prose dark:prose-invert max-w-none text-[#1a263b] space-y-4">
                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">1. Data Collection</h2>
                            <p>
                                We collect minimal personal data necessary to provide our services, such as your name and email address when you sign in via Google. 
                                We also collect item data, images, and transaction records you voluntarily provide.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">2. Use of Data</h2>
                            <p>
                                Your data is used solely to facilitate the marketplace experience, connect buyers and sellers, and improve our services. 
                                We do not sell your personal information to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">3. Security</h2>
                            <p>
                                We take reasonable measures to protect your information, but please be aware that no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">4. Platform Nature</h2>
                            <div className="bg-[#f3f9ff] border border-[#d1e2fc] p-4 rounded-lg italic">
                                <p>
                                    {t('terms.platform_free_notice')}
                                </p>
                            </div>
                        </section>
                        
                        <p className="text-sm text-muted-foreground pt-4">
                            Last updated: April 1, 2026
                        </p>
                    </CardContent>
                </Card>
            </div>
        </BazaarLayout>
    );
}
