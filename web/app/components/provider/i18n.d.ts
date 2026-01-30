import type { Resource } from 'i18next';
import type { Locale } from '@/i18n-config';
export declare function I18nClientProvider({ locale, resource, children, }: {
    locale: Locale;
    resource: Resource;
    children: React.ReactNode;
}): any;
