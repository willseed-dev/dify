import type { ReactNode } from 'react';
export type ColumnType = 'input' | 'select' | 'switch' | 'custom';
export type SelectOption = {
    name: string;
    value: string;
};
export type ColumnConfig = {
    key: string;
    title: string;
    type: ColumnType;
    width?: string;
    placeholder?: string;
    options?: SelectOption[];
    render?: (value: unknown, row: GenericTableRow, index: number, onChange: (value: unknown) => void) => ReactNode;
    required?: boolean;
};
export type GenericTableRow = {
    [key: string]: unknown;
};
declare const _default: any;
export default _default;
