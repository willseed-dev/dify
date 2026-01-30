import type { OpeningStatement } from '@/app/components/base/features/types';
import type { InputVar } from '@/app/components/workflow/types';
import type { PromptVariable } from '@/models/debug';
type OpeningSettingModalProps = {
    data: OpeningStatement;
    onSave: (newState: OpeningStatement) => void;
    onCancel: () => void;
    promptVariables?: PromptVariable[];
    workflowVariables?: InputVar[];
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void;
};
declare const OpeningSettingModal: ({ data, onSave, onCancel, promptVariables, workflowVariables, onAutoAddPromptVariable, }: OpeningSettingModalProps) => any;
export default OpeningSettingModal;
