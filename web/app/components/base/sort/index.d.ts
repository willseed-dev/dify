import type { FC } from 'react';
export type Item = {
    value: number | string;
    name: string;
} & Record<string, any>;
type Props = {
    order?: string;
    value: number | string;
    items: Item[];
    onSelect: (item: any) => void;
};
declare const Sort: FC<Props>;
export default Sort;
