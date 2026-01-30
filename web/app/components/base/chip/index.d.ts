import type { FC } from 'react';
export type Item = {
    value: number | string;
    name: string;
} & Record<string, any>;
type Props = {
    className?: string;
    panelClassName?: string;
    showLeftIcon?: boolean;
    leftIcon?: any;
    value: number | string;
    items: Item[];
    onSelect: (item: any) => void;
    onClear: () => void;
};
declare const Chip: FC<Props>;
export default Chip;
