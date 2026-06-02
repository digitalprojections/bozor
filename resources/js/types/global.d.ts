import type { Auth } from '@/types/auth';
import type { LayoutAds } from '@/types/ads';

export type SupportedLocale = Record<string, { name: string; native: string }>;
export type Translations = Record<string, string>;

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            locale: string;
            translations: Translations;
            supportedLocales: SupportedLocale;
            layoutAds?: LayoutAds;
            [key: string]: unknown;
        };
    }
}
