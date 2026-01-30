import type { FormValue } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { ConversationHistoriesRole, PromptItem } from '@/models/debug';
import { PromptMode } from '@/models/debug';
import { AppModeEnum, ModelModeType } from '@/types/app';
type Param = {
    appMode?: AppModeEnum;
    modelModeType: ModelModeType;
    modelName: string;
    promptMode: PromptMode;
    prePrompt: string;
    onUserChangedPrompt: () => void;
    hasSetDataSet: boolean;
    completionParams: FormValue;
    setCompletionParams: (params: FormValue) => void;
    setStop: (stop: string[]) => void;
};
declare const useAdvancedPromptConfig: ({ appMode, modelModeType, modelName, promptMode, prePrompt, onUserChangedPrompt, hasSetDataSet, completionParams, setCompletionParams, setStop, }: Param) => {
    chatPromptConfig: any;
    setChatPromptConfig: any;
    completionPromptConfig: any;
    setCompletionPromptConfig: any;
    currentAdvancedPrompt: any;
    setCurrentAdvancedPrompt: (prompt: PromptItem | PromptItem[], isUserChanged?: boolean) => void;
    hasSetBlockStatus: {
        context: any;
        history: any;
        query: any;
    };
    setConversationHistoriesRole: (conversationHistoriesRole: ConversationHistoriesRole) => void;
    migrateToDefaultPrompt: (isMigrateToCompetition?: boolean, toModelModeType?: ModelModeType) => Promise<void>;
};
export default useAdvancedPromptConfig;
