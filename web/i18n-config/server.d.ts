import type { Locale } from '.';
import type { NamespaceCamelCase } from './resources';
export declare function getTranslation(lng: Locale, ns?: NamespaceCamelCase): Promise<{
    t: any;
    i18n: any;
}>;
export declare const getLocaleOnServer: () => Promise<Locale>;
export declare const getResources: any;
