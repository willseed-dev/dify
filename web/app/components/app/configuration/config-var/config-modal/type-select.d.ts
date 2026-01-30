import type { FC } from 'react';
import type { InputVarType } from '@/app/components/workflow/types';
export type Item = {
    value: InputVarType;
    name: string;
};
type Props = {
    value: string | number;
    onSelect: (value: Item) => void;
    items: Item[];
    popupClassName?: string;
    popupInnerClassName?: string;
    readonly?: boolean;
    hideChecked?: boolean;
};
declare const TypeSelector: FC<Props>;
export default TypeSelector;
