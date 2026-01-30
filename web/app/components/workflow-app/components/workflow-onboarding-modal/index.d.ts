import type { FC } from 'react';
import type { PluginDefaultValue } from '@/app/components/workflow/block-selector/types';
import { BlockEnum } from '@/app/components/workflow/types';
type WorkflowOnboardingModalProps = {
    isShow: boolean;
    onClose: () => void;
    onSelectStartNode: (nodeType: BlockEnum, toolConfig?: PluginDefaultValue) => void;
};
declare const WorkflowOnboardingModal: FC<WorkflowOnboardingModalProps>;
export default WorkflowOnboardingModal;
