import React from 'react';
import { useTranslations } from '@/hooks/use-translations';
import LegalPage from '@/components/legal-page';
import { getTermsDocument } from '@/legal/legal-documents';

export default function TermsOfUse() {
    const { t, locale } = useTranslations();
    const document = getTermsDocument(locale, t);

    return <LegalPage document={document} />;
}
