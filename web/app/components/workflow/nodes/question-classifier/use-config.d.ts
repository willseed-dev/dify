import type { QuestionClassifierNodeType } from './types';
declare const useConfig: (id: string, payload: QuestionClassifierNodeType) => {
    readOnly: boolean;
    inputs: any;
    handleModelChanged: any;
    isChatMode: boolean;
    isChatModel: boolean;
    handleCompletionParamsChange: any;
    handleQueryVarChange: any;
    filterVar: any;
    handleTopicsChange: any;
    hasSetBlockStatus: {
        history: boolean;
        query: any;
        context: boolean;
    };
    availableVars: any[];
    availableNodesWithParent: any[];
    availableVisionVars: any[];
    handleInstructionChange: any;
    handleMemoryChange: any;
    isVisionModel: any;
    handleVisionResolutionEnabledChange: any;
    handleVisionResolutionChange: any;
    handleSortTopic: any;
};
export default useConfig;
