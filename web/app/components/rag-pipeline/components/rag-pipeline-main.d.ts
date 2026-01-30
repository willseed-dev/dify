import type { WorkflowProps } from '@/app/components/workflow';
type RagPipelineMainProps = Pick<WorkflowProps, 'nodes' | 'edges' | 'viewport'>;
declare const RagPipelineMain: ({ nodes, edges, viewport, }: RagPipelineMainProps) => any;
export default RagPipelineMain;
