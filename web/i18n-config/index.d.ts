import type { Locale } from '@/i18n-config/language';
export declare const i18n: {
    readonly defaultLocale: "en-US";
    readonly locales: any;
};
export { Locale };
export declare const setLocaleOnClient: (locale: Locale, reloadPage?: boolean) => Promise<void>;
export declare const renderI18nObject: (obj: Record<string, string>, language: string) => string;
