import * as React from 'react';
type TranslationMap = Record<string, string | string[]>;
/**
 * Create a t function with optional custom translations
 * Checks translations[key] first, then translations[ns.key], then returns ns.key as fallback
 */
export declare function createTFunction(translations: TranslationMap, defaultNs?: string): (key: string, options?: Record<string, unknown>) => string | string[];
/**
 * Create useTranslation mock with optional custom translations
 *
 * @example
 * vi.mock('react-i18next', () => createUseTranslationMock({
 *   'operation.confirm': 'Confirm',
 * }))
 */
export declare function createUseTranslationMock(translations?: TranslationMap): {
    useTranslation: (defaultNs?: string) => {
        t: (key: string, options?: Record<string, unknown>) => string | string[];
        i18n: {
            language: string;
            changeLanguage: any;
        };
    };
};
/**
 * Create Trans component mock with optional custom translations
 */
export declare function createTransMock(translations?: TranslationMap): {
    Trans: ({ i18nKey, children }: {
        i18nKey: string;
        children?: React.ReactNode;
    }) => any;
};
/**
 * Create complete react-i18next mock (useTranslation + Trans)
 *
 * @example
 * vi.mock('react-i18next', () => createReactI18nextMock({
 *   'modal.title': 'My Modal',
 * }))
 */
export declare function createReactI18nextMock(translations?: TranslationMap): {
    Trans: ({ i18nKey, children }: {
        i18nKey: string;
        children?: React.ReactNode;
    }) => any;
    useTranslation: (defaultNs?: string) => {
        t: (key: string, options?: Record<string, unknown>) => string | string[];
        i18n: {
            language: string;
            changeLanguage: any;
        };
    };
};
export {};
