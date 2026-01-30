import type { Locale } from '@/i18n-config/language';
export declare const useLocale: () => Locale;
export declare const useGetLanguage: () => any;
export declare const useGetPricingPageLanguage: () => any;
export declare const defaultDocBaseUrl = "https://docs.dify.ai";
export declare const useDocLink: (baseUrl?: string) => ((path?: string, pathMap?: {
    [index: string]: string;
}) => string);
