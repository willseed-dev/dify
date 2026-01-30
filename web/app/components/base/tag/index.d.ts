import * as React from 'react';
export type ITagProps = {
    children: string | React.ReactNode;
    color?: keyof typeof COLOR_MAP;
    className?: string;
    bordered?: boolean;
    hideBg?: boolean;
};
declare const COLOR_MAP: {
    green: {
        text: string;
        bg: string;
    };
    yellow: {
        text: string;
        bg: string;
    };
    red: {
        text: string;
        bg: string;
    };
    gray: {
        text: string;
        bg: string;
    };
};
export default function Tag({ children, color, className, bordered, hideBg }: ITagProps): any;
export {};
