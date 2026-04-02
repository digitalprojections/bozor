import React from 'react';
import { Head } from '@inertiajs/react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsOfUse() {
    const { t } = useTranslations();

    return (
        <BazaarLayout title={t('terms.title')}>
            <Head title={t('terms.title')} />

            <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
                <h1 className="text-3xl font-bold text-[#0b1a31]">{t('terms.title')}</h1>
                
                <Card className="rounded-[16px] border-[#edf2f9] shadow-sm">
                    <CardContent className="p-6 sm:p-8 prose dark:prose-invert max-w-none text-[#1a263b] space-y-4">
                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">1. Acceptable Use</h2>
                            <p>
                                By using {t('common.app_name')}, you agree to use the platform only for lawful purposes. You are prohibited from posting illegal, offensive, or fraudulent content. 
                                We reserve the right to remove any listing or user that violates these terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">2. Marketplace Transactions</h2>
                            <p>
                                {t('common.app_name')} provides a venue for users to connect. We do not participate in, guarantee, or assume liability for any transaction between buyers and sellers.
                                All deals are made directly between the parties involved.
                            </p>
                        </section>

                        <section className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                            <h2 className="text-xl font-bold mb-2">3. User Responsibility & Liability</h2>
                            <div className="font-bold text-amber-900 leading-relaxed">
                                <p>
                                    THIS PLATFORM IS PROVIDED "AS IS" AND IS COMPLETELY OPEN AND FREE TO USE. 
                                </p>
                                <p className="mt-2 text-lg">
                                    {t('terms.platform_free_notice')}
                                </p>
                                <p className="mt-2">
                                    WE DISCLAIM ALL WARRANTIES AND SHALL NOT BE HELD LIABLE FOR ANY LOSSES, DISPUTES, OR DAMAGES ARISING FROM THE USE OF THIS PLATFORM.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">4. Fees</h2>
                            <p>
                                Currently, there are no fees for listing or selling on this platform. We may introduce premium features in the future, but the core marketplace remains free to use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">5. Termination</h2>
                            <p>
                                We may suspend or terminate your account at any time for any reason, including violation of these terms or misuse of the platform.
                            </p>
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
