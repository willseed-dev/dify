import type { Resource } from 'i18next';
import type { Locale } from '.';
export declare function createI18nextInstance(lng: Locale, resources: Resource): any;
export declare const changeLanguage: (lng?: Locale) => Promise<void>;
