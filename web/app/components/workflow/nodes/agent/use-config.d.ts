import type { AgentNodeType } from './types';
import { produce } from 'immer';
export type StrategyStatus = {
    plugin: {
        source: 'external' | 'marketplace';
        installed: boolean;
    };
    isExistInPlugin: boolean;
};
export declare const useStrategyInfo: (strategyProviderName?: string, strategyName?: string) => {
    strategyProvider: any;
    strategy: any;
    strategyStatus: StrategyStatus | undefined;
    refetch: any;
};
declare const useConfig: (id: string, payload: AgentNodeType) => {
    readOnly: any;
    inputs: CommonNodeType<T>;
    setInputs: (newInputs: produce<any>) => void;
    handleVarListChange: any;
    handleAddVariable: any;
    currentStrategy: any;
    formData: any;
    onFormChange: (value: Record<string, any>) => void;
    currentStrategyStatus: StrategyStatus | undefined;
    strategyProvider: any;
    pluginDetail: any;
    availableVars: any[];
    availableNodesWithParent: any[];
    outputSchema: any;
    handleMemoryChange: any;
    isChatMode: any;
    canChooseMCPTool: any;
};
export default useConfig;
