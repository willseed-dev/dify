import type { PluginTriggerNodeType } from './types';
declare const useConfig: (id: string, payload: PluginTriggerNodeType) => {
    readOnly: any;
    inputs: any;
    currentProvider: any;
    currentEvent: any;
    triggerParameterSchema: any;
    triggerParameterValue: any;
    setTriggerParameterValue: any;
    setInputVar: any;
    outputSchema: any;
    hasObjectOutput: any;
    subscriptions: any;
    subscriptionSelected: any;
};
export default useConfig;
