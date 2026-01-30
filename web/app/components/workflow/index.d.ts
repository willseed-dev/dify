import type { FC } from 'react';
import type { Viewport } from 'reactflow';
import type { Edge, Node } from './types';
import 'reactflow/dist/style.css';
import './style.css';
export type WorkflowProps = {
    nodes: Node[];
    edges: Edge[];
    viewport?: Viewport;
    children?: React.ReactNode;
    onWorkflowDataUpdate?: (v: any) => void;
};
export declare const Workflow: FC<WorkflowProps>;
export declare const WorkflowWithInnerContext: any;
declare const _default: any;
export default _default;
