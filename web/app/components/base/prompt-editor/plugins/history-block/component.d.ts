import type { FC } from 'react';
import type { RoleName } from './index';
type HistoryBlockComponentProps = {
    nodeKey: string;
    roleName?: RoleName;
    onEditRole: () => void;
};
declare const HistoryBlockComponent: FC<HistoryBlockComponentProps>;
export default HistoryBlockComponent;
