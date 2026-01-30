import type { FormValue } from '@/app/components/header/account-setting/model-provider-page/declarations';
type Props = {
    isAdvancedMode: boolean;
    provider: string;
    modelId: string;
    completionParams: FormValue;
    onCompletionParamsChange: (newParams: FormValue) => void;
};
declare const LLMParamsPanel: ({ isAdvancedMode, provider, modelId, completionParams, onCompletionParamsChange, }: Props) => any;
export default LLMParamsPanel;
