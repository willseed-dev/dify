import type { OnFeaturesChange } from '@/app/components/base/features/types';
import type { InputVar } from '@/app/components/workflow/types';
import type { PromptVariable } from '@/models/debug';
type Props = {
    disabled?: boolean;
    onChange?: OnFeaturesChange;
    promptVariables?: PromptVariable[];
    workflowVariables?: InputVar[];
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void;
};
declare const ConversationOpener: ({ disabled, onChange, promptVariables, workflowVariables, onAutoAddPromptVariable, }: Props) => any;
export default ConversationOpener;
