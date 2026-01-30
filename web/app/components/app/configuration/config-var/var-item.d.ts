import type { FC } from 'react';
type ItemProps = {
    className?: string;
    readonly?: boolean;
    name: string;
    label: string;
    required: boolean;
    type: string;
    onEdit: () => void;
    onRemove: () => void;
    canDrag?: boolean;
};
declare const VarItem: FC<ItemProps>;
export default VarItem;
