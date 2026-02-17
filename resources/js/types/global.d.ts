import type { Auth } from '@/types/auth';

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
            [key: string]: unknown;
        };
    }
}
