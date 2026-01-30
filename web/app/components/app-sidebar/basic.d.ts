import * as React from 'react';
export type IAppBasicProps = {
    iconType?: 'app' | 'api' | 'dataset' | 'webapp' | 'notion';
    icon?: string;
    icon_background?: string | null;
    isExternal?: boolean;
    name: string;
    type: string | React.ReactNode;
    hoverTip?: string;
    textStyle?: {
        main?: string;
        extra?: string;
    };
    isExtraInLine?: boolean;
    mode?: string;
    hideType?: boolean;
};
export default function AppBasic({ icon, icon_background, name, isExternal, type, hoverTip, textStyle, isExtraInLine, mode, iconType, hideType }: IAppBasicProps): any;
