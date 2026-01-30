import type { TriggerWithProvider } from '@/app/components/workflow/block-selector/types';
import type { PluginTriggerNodeType } from '@/app/components/workflow/nodes/trigger-plugin/types';
export type TriggerCheckParams = {
    triggerInputsSchema: Array<{
        variable: string;
        label: string;
        required?: boolean;
    }>;
    isReadyForCheckValid: boolean;
};
export declare const getTriggerCheckParams: (triggerData: PluginTriggerNodeType, triggerProviders: TriggerWithProvider[] | undefined, language: string) => TriggerCheckParams;
