import type { Emoji } from '@/app/components/tools/types';
import type { InputVar, Variable } from '@/app/components/workflow/types';
import type { PublishWorkflowParams } from '@/types/workflow';
type Props = {
    disabled: boolean;
    published: boolean;
    detailNeedUpdate: boolean;
    workflowAppId: string;
    icon: Emoji;
    name: string;
    description: string;
    inputs?: InputVar[];
    outputs?: Variable[];
    handlePublish: (params?: PublishWorkflowParams) => Promise<void>;
    onRefreshData?: () => void;
    disabledReason?: string;
};
declare const WorkflowToolConfigureButton: ({ disabled, published, detailNeedUpdate, workflowAppId, icon, name, description, inputs, outputs, handlePublish, onRefreshData, disabledReason, }: Props) => any;
export default WorkflowToolConfigureButton;
