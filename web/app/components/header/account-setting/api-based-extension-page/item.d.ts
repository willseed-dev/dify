import type { FC } from 'react';
import type { ApiBasedExtension } from '@/models/common';
type ItemProps = {
    data: ApiBasedExtension;
    onUpdate: () => void;
};
declare const Item: FC<ItemProps>;
export default Item;
