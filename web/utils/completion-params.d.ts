import type { FormValue, ModelParameterRule } from '@/app/components/header/account-setting/model-provider-page/declarations';
export declare const mergeValidCompletionParams: (oldParams: FormValue | undefined, rules: ModelParameterRule[], isAdvancedMode?: boolean) => {
    params: FormValue;
    removedDetails: Record<string, string>;
};
export declare const fetchAndMergeValidCompletionParams: (provider: string, modelId: string, oldParams: FormValue | undefined, isAdvancedMode?: boolean) => Promise<{
    params: FormValue;
    removedDetails: Record<string, string>;
}>;
