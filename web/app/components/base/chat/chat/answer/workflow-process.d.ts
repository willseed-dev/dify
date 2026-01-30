import type { ChatItem, WorkflowProcess } from '../../types';
type WorkflowProcessProps = {
    data: WorkflowProcess;
    item?: ChatItem;
    expand?: boolean;
    hideInfo?: boolean;
    hideProcessDetail?: boolean;
    readonly?: boolean;
};
declare const WorkflowProcessItem: ({ data, expand, hideInfo, hideProcessDetail, readonly, }: WorkflowProcessProps) => any;
export default WorkflowProcessItem;
