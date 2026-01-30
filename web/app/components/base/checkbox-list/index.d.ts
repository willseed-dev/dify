import type { FC } from 'react';
export type CheckboxListOption = {
    label: string;
    value: string;
    disabled?: boolean;
};
export type CheckboxListProps = {
    title?: string;
    label?: string;
    description?: string;
    options: CheckboxListOption[];
    value?: string[];
    onChange?: (value: string[]) => void;
    disabled?: boolean;
    containerClassName?: string;
    showSelectAll?: boolean;
    showCount?: boolean;
    showSearch?: boolean;
    maxHeight?: string | number;
};
declare const CheckboxList: FC<CheckboxListProps>;
export default CheckboxList;
