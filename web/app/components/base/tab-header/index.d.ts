import * as React from 'react';
type Item = {
    id: string;
    name: string;
    isRight?: boolean;
    icon?: React.ReactNode;
    extra?: React.ReactNode;
    disabled?: boolean;
};
export type ITabHeaderProps = {
    items: Item[];
    value: string;
    itemClassName?: string;
    onChange: (value: string) => void;
};
declare const _default: any;
export default _default;
