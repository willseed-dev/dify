import type { OnFeaturesChange } from '@/app/components/base/features/types';
import type { InputVar } from '@/app/components/workflow/types';
import type { PromptVariable } from '@/models/debug';
type Props = {
    show: boolean;
    isChatMode: boolean;
    disabled: boolean;
    onChange?: OnFeaturesChange;
    onClose: () => void;
    inWorkflow?: boolean;
    showFileUpload?: boolean;
    promptVariables?: PromptVariable[];
    workflowVariables?: InputVar[];
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void;
};
declare const NewFeaturePanel: ({ show, isChatMode, disabled, onChange, onClose, inWorkflow, showFileUpload, promptVariables, workflowVariables, onAutoAddPromptVariable, }: Props) => any;
export default NewFeaturePanel;
