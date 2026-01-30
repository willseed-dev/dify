import type { FC } from 'react';
import type { ActionButtonProps } from '@/app/components/base/action-button';
export type Item = {
    value: string | number;
    text: string | React.JSX.Element;
};
type DropdownProps = {
    items: Item[];
    secondItems?: Item[];
    onSelect: (item: Item) => void;
    renderTrigger?: (open: boolean) => React.ReactNode;
    triggerProps?: ActionButtonProps;
    popupClassName?: string;
    itemClassName?: string;
    secondItemClassName?: string;
};
declare const Dropdown: FC<DropdownProps>;
export default Dropdown;
