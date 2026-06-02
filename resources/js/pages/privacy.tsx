import React from 'react';
import { useTranslations } from '@/hooks/use-translations';
import LegalPage from '@/components/legal-page';
import { getPrivacyDocument } from '@/legal/legal-documents';

export default function PrivacyPolicy() {
    const { t, locale } = useTranslations();
    const document = getPrivacyDocument(locale, t);

    return <LegalPage document={document} />;
}
