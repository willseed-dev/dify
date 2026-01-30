import type { ParametersSchema, PluginDeclaration, PluginDetail, PluginTriggerSubscriptionConstructor } from '../types';
type TriggerDeclarationSummary = {
    subscription_schema?: ParametersSchema[];
    subscription_constructor?: PluginTriggerSubscriptionConstructor | null;
};
export type SimpleDetail = Pick<PluginDetail, 'plugin_id' | 'name' | 'plugin_unique_identifier' | 'id'> & {
    provider: string;
    declaration: Partial<Omit<PluginDeclaration, 'trigger'>> & {
        trigger?: TriggerDeclarationSummary;
    };
};
export declare const usePluginStore: any;
export {};
