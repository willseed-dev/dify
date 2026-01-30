import type { FC } from 'react';
import type { Dataset } from './index';
type ContextBlockComponentProps = {
    nodeKey: string;
    datasets?: Dataset[];
    onAddContext: () => void;
    canNotAddContext?: boolean;
};
declare const ContextBlockComponent: FC<ContextBlockComponentProps>;
export default ContextBlockComponent;
