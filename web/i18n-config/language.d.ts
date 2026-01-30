export type Item = {
    value: number | string;
    name: string;
    example: string;
};
export type I18nText = Record<typeof LanguagesSupported[number], string>;
export declare const languages: readonly [{
    readonly value: "en-US";
    readonly name: "English (United States)";
    readonly prompt_name: "English";
    readonly example: "Hello, Dify!";
    readonly supported: true;
}, {
    readonly value: "zh-Hans";
    readonly name: "简体中文";
    readonly prompt_name: "Chinese Simplified";
    readonly example: "你好，Dify！";
    readonly supported: true;
}, {
    readonly value: "zh-Hant";
    readonly name: "繁體中文";
    readonly prompt_name: "Chinese Traditional";
    readonly example: "你好，Dify！";
    readonly supported: true;
}, {
    readonly value: "pt-BR";
    readonly name: "Português (Brasil)";
    readonly prompt_name: "Portuguese";
    readonly example: "Olá, Dify!";
    readonly supported: true;
}, {
    readonly value: "es-ES";
    readonly name: "Español (España)";
    readonly prompt_name: "Spanish";
    readonly example: "¡Hola, Dify!";
    readonly supported: true;
}, {
    readonly value: "fr-FR";
    readonly name: "Français (France)";
    readonly prompt_name: "French";
    readonly example: "Bonjour, Dify!";
    readonly supported: true;
}, {
    readonly value: "de-DE";
    readonly name: "Deutsch (Deutschland)";
    readonly prompt_name: "German";
    readonly example: "Hallo, Dify!";
    readonly supported: true;
}, {
    readonly value: "ja-JP";
    readonly name: "日本語 (日本)";
    readonly prompt_name: "Japanese";
    readonly example: "こんにちは、Dify!";
    readonly supported: true;
}, {
    readonly value: "ko-KR";
    readonly name: "한국어 (대한민국)";
    readonly prompt_name: "Korean";
    readonly example: "안녕하세요, Dify!";
    readonly supported: true;
}, {
    readonly value: "ru-RU";
    readonly name: "Русский (Россия)";
    readonly prompt_name: "Russian";
    readonly example: " Привет, Dify!";
    readonly supported: true;
}, {
    readonly value: "it-IT";
    readonly name: "Italiano (Italia)";
    readonly prompt_name: "Italian";
    readonly example: "Ciao, Dify!";
    readonly supported: true;
}, {
    readonly value: "th-TH";
    readonly name: "ไทย (ประเทศไทย)";
    readonly prompt_name: "Thai";
    readonly example: "สวัสดี Dify!";
    readonly supported: true;
}, {
    readonly value: "uk-UA";
    readonly name: "Українська (Україна)";
    readonly prompt_name: "Ukrainian";
    readonly example: "Привет, Dify!";
    readonly supported: true;
}, {
    readonly value: "vi-VN";
    readonly name: "Tiếng Việt (Việt Nam)";
    readonly prompt_name: "Vietnamese";
    readonly example: "Xin chào, Dify!";
    readonly supported: true;
}, {
    readonly value: "ro-RO";
    readonly name: "Română (România)";
    readonly prompt_name: "Romanian";
    readonly example: "Salut, Dify!";
    readonly supported: true;
}, {
    readonly value: "pl-PL";
    readonly name: "Polski (Polish)";
    readonly prompt_name: "Polish";
    readonly example: "Cześć, Dify!";
    readonly supported: true;
}, {
    readonly value: "hi-IN";
    readonly name: "Hindi (India)";
    readonly prompt_name: "Hindi";
    readonly example: "नमस्ते, Dify!";
    readonly supported: true;
}, {
    readonly value: "tr-TR";
    readonly name: "Türkçe";
    readonly prompt_name: "Türkçe";
    readonly example: "Selam!";
    readonly supported: true;
}, {
    readonly value: "fa-IR";
    readonly name: "Farsi (Iran)";
    readonly prompt_name: "Farsi";
    readonly example: "سلام, دیفای!";
    readonly supported: true;
}, {
    readonly value: "sl-SI";
    readonly name: "Slovensko (Slovenija)";
    readonly prompt_name: "Slovensko";
    readonly example: "Zdravo, Dify!";
    readonly supported: true;
}, {
    readonly value: "id-ID";
    readonly name: "Bahasa Indonesia";
    readonly prompt_name: "Indonesian";
    readonly example: "Halo, Dify!";
    readonly supported: true;
}, {
    readonly value: "ar-TN";
    readonly name: "العربية (تونس)";
    readonly prompt_name: "Tunisian Arabic";
    readonly example: "مرحبا، Dify!";
    readonly supported: true;
}];
export type Locale = 'ja_JP' | 'zh_Hans' | 'en_US' | (typeof languages[number])['value'];
export declare const LanguagesSupported: Locale[];
export declare const getLanguage: (locale: Locale) => Locale;
export declare const localeMap: Record<Locale, string>;
export declare const getDocLanguage: (locale: string) => string;
export declare const getPricingPageLanguage: (locale: string) => string;
export declare const NOTICE_I18N: {
    title: {
        en_US: string;
        zh_Hans: string;
        zh_Hant: string;
        pt_BR: string;
        es_ES: string;
        fr_FR: string;
        de_DE: string;
        ja_JP: string;
        ko_KR: string;
        ru_RU: string;
        it_IT: string;
        th_TH: string;
        id_ID: string;
        uk_UA: string;
        vi_VN: string;
        ro_RO: string;
        pl_PL: string;
        hi_IN: string;
        tr_TR: string;
        fa_IR: string;
        sl_SI: string;
        ar_TN: string;
    };
    desc: {
        en_US: string;
        zh_Hans: string;
        pt_BR: string;
        es_ES: string;
        fr_FR: string;
        de_DE: string;
        ja_JP: string;
        ko_KR: string;
        pl_PL: string;
        uk_UA: string;
        ru_RU: string;
        vi_VN: string;
        id_ID: string;
        tr_TR: string;
        fa_IR: string;
        sl_SI: string;
        th_TH: string;
        ar_TN: string;
    };
    href: string;
};
