import type { WorkflowProps } from '@/app/components/workflow';
type WorkflowMainProps = Pick<WorkflowProps, 'nodes' | 'edges' | 'viewport'>;
declare const WorkflowMain: ({ nodes, edges, viewport, }: WorkflowMainProps) => any;
export default WorkflowMain;
