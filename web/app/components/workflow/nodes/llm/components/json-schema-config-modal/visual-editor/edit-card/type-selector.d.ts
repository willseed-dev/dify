import type { FC } from 'react';
import type { ArrayType, Type } from '../../../../types';
export type TypeItem = {
    value: Type | ArrayType;
    text: string;
};
type TypeSelectorProps = {
    items: TypeItem[];
    currentValue: Type | ArrayType;
    onSelect: (item: TypeItem) => void;
    popupClassName?: string;
};
declare const TypeSelector: FC<TypeSelectorProps>;
export default TypeSelector;
