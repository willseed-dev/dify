import type { FC } from 'react';
import type { DataSet } from '@/models/datasets';
type ItemProps = {
    className?: string;
    config: DataSet;
    onRemove: (id: string) => void;
    readonly?: boolean;
    onSave: (newDataset: DataSet) => void;
    editable?: boolean;
};
declare const Item: FC<ItemProps>;
export default Item;
