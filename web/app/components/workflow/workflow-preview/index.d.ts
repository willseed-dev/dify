import type { Viewport } from 'reactflow';
import type { Edge, Node } from '@/app/components/workflow/types';
import 'reactflow/dist/style.css';
import '../style.css';
type WorkflowPreviewProps = {
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
    className?: string;
};
declare const WorkflowPreviewWrapper: (props: WorkflowPreviewProps) => any;
export default WorkflowPreviewWrapper;
