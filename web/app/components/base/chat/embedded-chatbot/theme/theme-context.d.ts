export declare class Theme {
    chatColorTheme: string | null;
    chatColorThemeInverted: boolean;
    primaryColor: string;
    backgroundHeaderColorStyle: string;
    headerBorderBottomStyle: string;
    colorFontOnHeaderStyle: string;
    colorPathOnHeader: string;
    backgroundButtonDefaultColorStyle: string;
    roundedBackgroundColorStyle: string;
    chatBubbleColorStyle: string;
    constructor(chatColorTheme?: string | null, chatColorThemeInverted?: boolean);
    private configCustomColor;
    private configInvertedColor;
}
export declare class ThemeBuilder {
    private _theme?;
    private buildChecker;
    get theme(): Theme;
    buildTheme(chatColorTheme?: string | null, chatColorThemeInverted?: boolean): void;
}
export declare const useThemeContext: () => any;
