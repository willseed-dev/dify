import type { FC } from 'react';
import type { NodeProps } from '../types';
import type { VarInInspect } from '@/types/workflow';
export type currentVarType = {
    nodeId: string;
    nodeType: string;
    title: string;
    isValueFetched?: boolean;
    var: VarInInspect;
    nodeData: NodeProps['data'];
};
declare const Panel: FC;
export default Panel;
