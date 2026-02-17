import { router, usePage } from '@inertiajs/react';
import { update as localeUpdate } from '@/routes/locale';
import type { SupportedLocale, Translations } from '@/types/global';

/**
 * Get current locale, translation function, and supported locales.
 * Translations are loaded from Laravel lang/{locale}.json and shared via Inertia.
 */
export function useTranslations() {
    const page = usePage();
    const locale = page.props.locale as string;
    const translations = page.props.translations as Translations;
    const supportedLocales = page.props.supportedLocales as SupportedLocale;

    const t = (key: string): string => {
        return translations?.[key] ?? key;
    };

    const setLocale = (newLocale: string) => {
        if (newLocale === locale || !supportedLocales?.[newLocale]) return;
        router.post(localeUpdate().url, { locale: newLocale });
    };

    return { t, locale, setLocale, supportedLocales };
}
