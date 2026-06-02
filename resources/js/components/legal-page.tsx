import React from 'react';
import { Head } from '@inertiajs/react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Card, CardContent } from '@/components/ui/card';
import type { LegalDocument } from '@/legal/legal-documents';

interface LegalPageProps {
    document: LegalDocument;
}

export default function LegalPage({ document }: LegalPageProps) {
    return (
        <BazaarLayout title={document.title}>
            <Head title={document.title} />

            <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
                <h1 className="text-3xl font-bold text-[#0b1a31]">
                    {document.title}
                </h1>

                <Card className="rounded-[16px] border-[#edf2f9] shadow-sm">
                    <CardContent className="prose dark:prose-invert max-w-none space-y-4 p-6 text-[#1a263b] sm:p-8">
                        {document.content}

                        <p className="pt-4 text-sm text-muted-foreground">
                            Last updated: {document.lastUpdated}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </BazaarLayout>
    );
}
