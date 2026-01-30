"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("es-toolkit/object");
const immer_1 = require("immer");
const react_1 = require("react");
const constants_1 = require("@/app/components/base/prompt-editor/constants");
const config_1 = require("@/config");
const debug_1 = require("@/models/debug");
const debug_2 = require("@/service/debug");
const app_1 = require("@/types/app");
const useAdvancedPromptConfig = ({ appMode, modelModeType, modelName, promptMode, prePrompt, onUserChangedPrompt, hasSetDataSet, completionParams, setCompletionParams, setStop, }) => {
    const isAdvancedPrompt = promptMode === debug_1.PromptMode.advanced;
    const [chatPromptConfig, setChatPromptConfig] = (0, react_1.useState)(() => (0, object_1.clone)(config_1.DEFAULT_CHAT_PROMPT_CONFIG));
    const [completionPromptConfig, setCompletionPromptConfig] = (0, react_1.useState)(() => (0, object_1.clone)(config_1.DEFAULT_COMPLETION_PROMPT_CONFIG));
    const currentAdvancedPrompt = (() => {
        if (!isAdvancedPrompt)
            return [];
        return (modelModeType === app_1.ModelModeType.chat) ? chatPromptConfig.prompt : completionPromptConfig.prompt;
    })();
    const setCurrentAdvancedPrompt = (prompt, isUserChanged) => {
        if (!isAdvancedPrompt)
            return;
        if (modelModeType === app_1.ModelModeType.chat) {
            setChatPromptConfig({
                ...chatPromptConfig,
                prompt: prompt,
            });
        }
        else {
            setCompletionPromptConfig({
                ...completionPromptConfig,
                prompt: prompt,
            });
        }
        if (isUserChanged)
            onUserChangedPrompt();
    };
    const setConversationHistoriesRole = (conversationHistoriesRole) => {
        setCompletionPromptConfig({
            ...completionPromptConfig,
            conversation_histories_role: conversationHistoriesRole,
        });
    };
    const hasSetBlockStatus = (() => {
        if (!isAdvancedPrompt) {
            return {
                context: (0, constants_1.checkHasContextBlock)(prePrompt),
                history: false,
                query: false,
            };
        }
        if (modelModeType === app_1.ModelModeType.chat) {
            return {
                context: !!chatPromptConfig.prompt.find(p => (0, constants_1.checkHasContextBlock)(p.text)),
                history: false,
                query: !!chatPromptConfig.prompt.find(p => (0, constants_1.checkHasQueryBlock)(p.text)),
            };
        }
        else {
            const prompt = completionPromptConfig.prompt?.text;
            return {
                context: (0, constants_1.checkHasContextBlock)(prompt),
                history: (0, constants_1.checkHasHistoryBlock)(prompt),
                query: (0, constants_1.checkHasQueryBlock)(prompt),
            };
        }
    })();
    /* prompt: simple to advanced process, or chat model to completion model
    * 1. migrate prompt
    * 2. change promptMode to advanced
    */
    const migrateToDefaultPrompt = async (isMigrateToCompetition, toModelModeType) => {
        const mode = modelModeType;
        const toReplacePrePrompt = prePrompt || '';
        if (!appMode)
            return;
        if (!isAdvancedPrompt) {
            const { chat_prompt_config, completion_prompt_config, stop } = await (0, debug_2.fetchPromptTemplate)({
                appMode,
                mode,
                modelName,
                hasSetDataSet,
            });
            if (modelModeType === app_1.ModelModeType.chat) {
                const newPromptConfig = (0, immer_1.produce)(chat_prompt_config, (draft) => {
                    draft.prompt = draft.prompt.map((p) => {
                        return {
                            ...p,
                            text: p.text.replace(constants_1.PRE_PROMPT_PLACEHOLDER_TEXT, toReplacePrePrompt),
                        };
                    });
                });
                setChatPromptConfig(newPromptConfig);
            }
            else {
                const newPromptConfig = (0, immer_1.produce)(completion_prompt_config, (draft) => {
                    draft.prompt.text = draft.prompt.text.replace(constants_1.PRE_PROMPT_PLACEHOLDER_TEXT, toReplacePrePrompt);
                });
                setCompletionPromptConfig(newPromptConfig);
                setCompletionParams({
                    ...completionParams,
                    stop,
                });
            }
            return;
        }
        if (isMigrateToCompetition) {
            const { completion_prompt_config, chat_prompt_config, stop } = await (0, debug_2.fetchPromptTemplate)({
                appMode,
                mode: toModelModeType,
                modelName,
                hasSetDataSet,
            });
            if (toModelModeType === app_1.ModelModeType.completion) {
                const newPromptConfig = (0, immer_1.produce)(completion_prompt_config, (draft) => {
                    if (!completionPromptConfig.prompt?.text)
                        draft.prompt.text = draft.prompt.text.replace(constants_1.PRE_PROMPT_PLACEHOLDER_TEXT, toReplacePrePrompt);
                    else
                        draft.prompt.text = completionPromptConfig.prompt?.text.replace(constants_1.PRE_PROMPT_PLACEHOLDER_TEXT, toReplacePrePrompt);
                    if ([app_1.AppModeEnum.ADVANCED_CHAT, app_1.AppModeEnum.AGENT_CHAT, app_1.AppModeEnum.CHAT].includes(appMode) && completionPromptConfig.conversation_histories_role.assistant_prefix && completionPromptConfig.conversation_histories_role.user_prefix)
                        draft.conversation_histories_role = completionPromptConfig.conversation_histories_role;
                });
                setCompletionPromptConfig(newPromptConfig);
                if (!completionParams.stop || completionParams.stop.length === 0) {
                    setCompletionParams({
                        ...completionParams,
                        stop,
                    });
                }
                setStop(stop); // switch mode's params is async. It may override the stop value.
            }
            else {
                const newPromptConfig = (0, immer_1.produce)(chat_prompt_config, (draft) => {
                    draft.prompt = draft.prompt.map((p) => {
                        return {
                            ...p,
                            text: p.text.replace(constants_1.PRE_PROMPT_PLACEHOLDER_TEXT, toReplacePrePrompt),
                        };
                    });
                });
                setChatPromptConfig(newPromptConfig);
            }
        }
    };
    return {
        chatPromptConfig,
        setChatPromptConfig,
        completionPromptConfig,
        setCompletionPromptConfig,
        currentAdvancedPrompt,
        setCurrentAdvancedPrompt,
        hasSetBlockStatus,
        setConversationHistoriesRole,
        migrateToDefaultPrompt,
    };
};
exports.default = useAdvancedPromptConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWFkdmFuY2VkLXByb21wdC1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtYWR2YW5jZWQtcHJvbXB0LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDhDQUF5QztBQUN6QyxpQ0FBK0I7QUFDL0IsaUNBQWdDO0FBQ2hDLDZFQUEySjtBQUMzSixxQ0FBdUY7QUFDdkYsMENBQTJDO0FBQzNDLDJDQUFxRDtBQUNyRCxxQ0FBd0Q7QUFleEQsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLEVBQy9CLE9BQU8sRUFDUCxhQUFhLEVBQ2IsU0FBUyxFQUNULFVBQVUsRUFDVixTQUFTLEVBQ1QsbUJBQW1CLEVBQ25CLGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsbUJBQW1CLEVBQ25CLE9BQU8sR0FDRCxFQUFFLEVBQUU7SUFDVixNQUFNLGdCQUFnQixHQUFHLFVBQVUsS0FBSyxrQkFBVSxDQUFDLFFBQVEsQ0FBQTtJQUMzRCxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQW1CLEdBQUcsRUFBRSxDQUFDLElBQUEsY0FBSyxFQUFDLG1DQUEwQixDQUFDLENBQUMsQ0FBQTtJQUNuSCxNQUFNLENBQUMsc0JBQXNCLEVBQUUseUJBQXlCLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQXlCLEdBQUcsRUFBRSxDQUFDLElBQUEsY0FBSyxFQUFDLHlDQUFnQyxDQUFDLENBQUMsQ0FBQTtJQUUzSSxNQUFNLHFCQUFxQixHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0I7WUFDbkIsT0FBTyxFQUFFLENBQUE7UUFFWCxPQUFPLENBQUMsYUFBYSxLQUFLLG1CQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFBO0lBQ3pHLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFF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QUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHVDQUEyQixFQUFFLGtCQUFrQixDQUFDO3lCQUN0RSxDQUFBO29CQUNILENBQUMsQ0FBQyxDQUFBO2dCQUNKLENBQUMsQ0FBQyxDQUFBO2dCQUNGLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQ3RDLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsT0FBTztRQUNMLGdCQUFnQjtRQUNoQixtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLHlCQUF5QjtRQUN6QixxQkFBcUI7UUFDckIsd0JBQXdCO1FBQ3hCLGlCQUFpQjtRQUNqQiw0QkFBNEI7UUFDNUIsc0JBQXNCO0tBQ3ZCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSx1QkFBdUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRm9ybVZhbHVlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHR5cGUgeyBDaGF0UHJvbXB0Q29uZmlnLCBDb21wbGV0aW9uUHJvbXB0Q29uZmlnLCBDb252ZXJzYXRpb25IaXN0b3JpZXNSb2xlLCBQcm9tcHRJdGVtIH0gZnJvbSAnQC9tb2RlbHMvZGVidWcnXG5pbXBvcnQgeyBjbG9uZSB9IGZyb20gJ2VzLXRvb2xraXQvb2JqZWN0J1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNoZWNrSGFzQ29udGV4dEJsb2NrLCBjaGVja0hhc0hpc3RvcnlCbG9jaywgY2hlY2tIYXNRdWVyeUJsb2NrLCBQUkVfUFJPTVBUX1BMQUNFSE9MREVSX1RFWFQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcHJvbXB0LWVkaXRvci9jb25zdGFudHMnXG5pbXBvcnQgeyBERUZBVUxUX0NIQVRfUFJPTVBUX0NPTkZJRywgREVGQVVMVF9DT01QTEVUSU9OX1BST01QVF9DT05GSUcgfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IFByb21wdE1vZGUgfSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB7IGZldGNoUHJvbXB0VGVtcGxhdGUgfSBmcm9tICdAL3NlcnZpY2UvZGVidWcnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSwgTW9kZWxNb2RlVHlwZSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuXG50eXBlIFBhcmFtID0ge1xuICBhcHBNb2RlPzogQXBwTW9kZUVudW1cbiAgbW9kZWxNb2RlVHlwZTogTW9kZWxNb2RlVHlwZVxuICBtb2RlbE5hbWU6IHN0cmluZ1xuICBwcm9tcHRNb2RlOiBQcm9tcHRNb2RlXG4gIHByZVByb21wdDogc3RyaW5nXG4gIG9uVXNlckNoYW5nZWRQcm9tcHQ6ICgpID0+IHZvaWRcbiAgaGFzU2V0RGF0YVNldDogYm9vbGVhblxuICBjb21wbGV0aW9uUGFyYW1zOiBGb3JtVmFsdWVcbiAgc2V0Q29tcGxldGlvblBhcmFtczogKHBhcmFtczogRm9ybVZhbHVlKSA9PiB2b2lkXG4gIHNldFN0b3A6IChzdG9wOiBzdHJpbmdbXSkgPT4gdm9pZFxufVxuXG5jb25zdCB1c2VBZHZhbmNlZFByb21wdENvbmZpZyA9ICh7XG4gIGFwcE1vZGUsXG4gIG1vZGVsTW9kZVR5cGUsXG4gIG1vZGVsTmFtZSxcbiAgcHJvbXB0TW9kZSxcbiAgcHJlUHJvbXB0LFxuICBvblVzZXJDaGFuZ2VkUHJvbXB0LFxuICBoYXNTZXREYXRhU2V0LFxuICBjb21wbGV0aW9uUGFyYW1zLFxuICBzZXRDb21wbGV0aW9uUGFyYW1zLFxuICBzZXRTdG9wLFxufTogUGFyYW0pID0+IHtcbiAgY29uc3QgaXNBZHZhbmNlZFByb21wdCA9IHByb21wdE1vZGUgPT09IFByb21wdE1vZGUuYWR2YW5jZWRcbiAgY29uc3QgW2NoYXRQcm9tcHRDb25maWcsIHNldENoYXRQcm9tcHRDb25maWddID0gdXNlU3RhdGU8Q2hhdFByb21wdENvbmZpZz4oKCkgPT4gY2xvbmUoREVGQVVMVF9DSEFUX1BST01QVF9DT05GSUcpKVxuICBjb25zdCBbY29tcGxldGlvblByb21wdENvbmZpZywgc2V0Q29tcGxldGlvblByb21wdENvbmZpZ10gPSB1c2VTdGF0ZTxDb21wbGV0aW9uUHJvbXB0Q29uZmlnPigoKSA9PiBjbG9uZShERUZBVUxUX0NPTVBMRVRJT05fUFJPTVBUX0NPTkZJRykpXG5cbiAgY29uc3QgY3VycmVudEFkdmFuY2VkUHJvbXB0ID0gKCgpID0+IHtcbiAgICBpZiAoIWlzQWR2YW5jZWRQcm9tcHQpXG4gICAgICByZXR1cm4gW11cblxuICAgIHJldHVybiAobW9kZWxNb2RlVHlwZSA9PT0gTW9kZWxNb2RlVHlwZS5jaGF0KSA/IGNoYXRQcm9tcHRDb25maWcucHJvbXB0IDogY29tcGxldGlvblByb21wdENvbmZpZy5wcm9tcHRcbiAgfSkoKVxuXG4gIGNvbnN0IHNldEN1cnJlbnRBZHZhbmNlZFByb21wdCA9IChwcm9tcHQ6IFByb21wdEl0ZW0gfCBQcm9tcHRJdGVtW10sIGlzVXNlckNoYW5nZWQ/OiBib29sZWFuKSA9PiB7XG4gICAgaWYgKCFpc0FkdmFuY2VkUHJvbXB0KVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAobW9kZWxNb2RlVHlwZSA9PT0gTW9kZWxNb2RlVHlwZS5jaGF0KSB7XG4gICAgICBzZXRDaGF0UHJvbXB0Q29uZmlnKHtcbiAgICAgICAgLi4uY2hhdFByb21wdENvbmZpZyxcbiAgICAgICAgcHJvbXB0OiBwcm9tcHQgYXMgUHJvbXB0SXRlbVtdLFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzZXRDb21wbGV0aW9uUHJvbXB0Q29uZmlnKHtcbiAgICAgICAgLi4uY29tcGxldGlvblByb21wdENvbmZpZyxcbiAgICAgICAgcHJvbXB0OiBwcm9tcHQgYXMgUHJvbXB0SXRlbSxcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChpc1VzZXJDaGFuZ2VkKVxuICAgICAgb25Vc2VyQ2hhbmdlZFByb21wdCgpXG4gIH1cblxuICBjb25zdCBzZXRDb252ZXJzYXRpb25IaXN0b3JpZXNSb2xlID0gKGNvbnZlcnNhdGlvbkhpc3Rvcmllc1JvbGU6IENvbnZlcnNhdGlvbkhpc3Rvcmllc1JvbGUpID0+IHtcbiAgICBzZXRDb21wbGV0aW9uUHJvbXB0Q29uZmlnKHtcbiAgICAgIC4uLmNvbXBsZXRpb25Qcm9tcHRDb25maWcsXG4gICAgICBjb252ZXJzYXRpb25faGlzdG9yaWVzX3JvbGU6IGNvbnZlcnNhdGlvbkhpc3Rvcmllc1JvbGUsXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGhhc1NldEJsb2NrU3RhdHVzID0gKCgpID0+IHtcbiAgICBpZiAoIWlzQWR2YW5jZWRQcm9tcHQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbnRleHQ6IGNoZWNrSGFzQ29udGV4dEJsb2NrKHByZVByb21wdCksXG4gICAgICAgIGhpc3Rvcnk6IGZhbHNlLFxuICAgICAgICBxdWVyeTogZmFsc2UsXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChtb2RlbE1vZGVUeXBlID09PSBNb2RlbE1vZGVUeXBlLmNoYXQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbnRleHQ6ICEhY2hhdFByb21wdENvbmZpZy5wcm9tcHQuZmluZChwID0+IGNoZWNrSGFzQ29udGV4dEJsb2NrKHAudGV4dCkpLFxuICAgICAgICBoaXN0b3J5OiBmYWxzZSxcbiAgICAgICAgcXVlcnk6ICEhY2hhdFByb21wdENvbmZpZy5wcm9tcHQuZmluZChwID0+IGNoZWNrSGFzUXVlcnlCbG9jayhwLnRleHQpKSxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCBwcm9tcHQgPSBjb21wbGV0aW9uUHJvbXB0Q29uZmlnLnByb21wdD8udGV4dFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29udGV4dDogY2hlY2tIYXNDb250ZXh0QmxvY2socHJvbXB0KSxcbiAgICAgICAgaGlzdG9yeTogY2hlY2tIYXNIaXN0b3J5QmxvY2socHJvbXB0KSxcbiAgICAgICAgcXVlcnk6IGNoZWNrSGFzUXVlcnlCbG9jayhwcm9tcHQpLFxuICAgICAgfVxuICAgIH1cbiAgfSkoKVxuXG4gIC8qIHByb21wdDogc2ltcGxlIHRvIGFkdmFuY2VkIHByb2Nlc3MsIG9yIGNoYXQgbW9kZWwgdG8gY29tcGxldGlvbiBtb2RlbFxuICAqIDEuIG1pZ3JhdGUgcHJvbXB0XG4gICogMi4gY2hhbmdlIHByb21wdE1vZGUgdG8gYWR2YW5jZWRcbiAgKi9cbiAgY29uc3QgbWlncmF0ZVRvRGVmYXVsdFByb21wdCA9IGFzeW5jIChpc01pZ3JhdGVUb0NvbXBldGl0aW9uPzogYm9vbGVhbiwgdG9Nb2RlbE1vZGVUeXBlPzogTW9kZWxNb2RlVHlwZSkgPT4ge1xuICAgIGNvbnN0IG1vZGUgPSBtb2RlbE1vZGVUeXBlXG4gICAgY29uc3QgdG9SZXBsYWNlUHJlUHJvbXB0ID0gcHJlUHJvbXB0IHx8ICcnXG4gICAgaWYgKCFhcHBNb2RlKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAoIWlzQWR2YW5jZWRQcm9tcHQpIHtcbiAgICAgIGNvbnN0IHsgY2hhdF9wcm9tcHRfY29uZmlnLCBjb21wbGV0aW9uX3Byb21wdF9jb25maWcsIHN0b3AgfSA9IGF3YWl0IGZldGNoUHJvbXB0VGVtcGxhdGUoe1xuICAgICAgICBhcHBNb2RlLFxuICAgICAgICBtb2RlLFxuICAgICAgICBtb2RlbE5hbWUsXG4gICAgICAgIGhhc1NldERhdGFTZXQsXG4gICAgICB9KVxuICAgICAgaWYgKG1vZGVsTW9kZVR5cGUgPT09IE1vZGVsTW9kZVR5cGUuY2hhdCkge1xuICAgICAgICBjb25zdCBuZXdQcm9tcHRDb25maWcgPSBwcm9kdWNlKGNoYXRfcHJvbXB0X2NvbmZpZywgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgZHJhZnQucHJvbXB0ID0gZHJhZnQucHJvbXB0Lm1hcCgocCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ucCxcbiAgICAgICAgICAgICAgdGV4dDogcC50ZXh0LnJlcGxhY2UoUFJFX1BST01QVF9QTEFDRUhPTERFUl9URVhULCB0b1JlcGxhY2VQcmVQcm9tcHQpLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHNldENoYXRQcm9tcHRDb25maWcobmV3UHJvbXB0Q29uZmlnKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IG5ld1Byb21wdENvbmZpZyA9IHByb2R1Y2UoY29tcGxldGlvbl9wcm9tcHRfY29uZmlnLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICBkcmFmdC5wcm9tcHQudGV4dCA9IGRyYWZ0LnByb21wdC50ZXh0LnJlcGxhY2UoUFJFX1BST01QVF9QTEFDRUhPTERFUl9URVhULCB0b1JlcGxhY2VQcmVQcm9tcHQpXG4gICAgICAgIH0pXG4gICAgICAgIHNldENvbXBsZXRpb25Qcm9tcHRDb25maWcobmV3UHJvbXB0Q29uZmlnKVxuICAgICAgICBzZXRDb21wbGV0aW9uUGFyYW1zKHtcbiAgICAgICAgICAuLi5jb21wbGV0aW9uUGFyYW1zLFxuICAgICAgICAgIHN0b3AsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoaXNNaWdyYXRlVG9Db21wZXRpdGlvbikge1xuICAgICAgY29uc3QgeyBjb21wbGV0aW9uX3Byb21wdF9jb25maWcsIGNoYXRfcHJvbXB0X2NvbmZpZywgc3RvcCB9ID0gYXdhaXQgZmV0Y2hQcm9tcHRUZW1wbGF0ZSh7XG4gICAgICAgIGFwcE1vZGUsXG4gICAgICAgIG1vZGU6IHRvTW9kZWxNb2RlVHlwZSBhcyBNb2RlbE1vZGVUeXBlLFxuICAgICAgICBtb2RlbE5hbWUsXG4gICAgICAgIGhhc1NldERhdGFTZXQsXG4gICAgICB9KVxuXG4gICAgICBpZiAodG9Nb2RlbE1vZGVUeXBlID09PSBNb2RlbE1vZGVUeXBlLmNvbXBsZXRpb24pIHtcbiAgICAgICAgY29uc3QgbmV3UHJvbXB0Q29uZmlnID0gcHJvZHVjZShjb21wbGV0aW9uX3Byb21wdF9jb25maWcsIChkcmFmdCkgPT4ge1xuICAgICAgICAgIGlmICghY29tcGxldGlvblByb21wdENvbmZpZy5wcm9tcHQ/LnRleHQpXG4gICAgICAgICAgICBkcmFmdC5wcm9tcHQudGV4dCA9IGRyYWZ0LnByb21wdC50ZXh0LnJlcGxhY2UoUFJFX1BST01QVF9QTEFDRUhPTERFUl9URVhULCB0b1JlcGxhY2VQcmVQcm9tcHQpXG5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkcmFmdC5wcm9tcHQudGV4dCA9IGNvbXBsZXRpb25Qcm9tcHRDb25maWcucHJvbXB0Py50ZXh0LnJlcGxhY2UoUFJFX1BST01QVF9QTEFDRUhPTERFUl9URVhULCB0b1JlcGxhY2VQcmVQcm9tcHQpXG5cbiAgICAgICAgICBpZiAoW0FwcE1vZGVFbnVtLkFEVkFOQ0VEX0NIQVQsIEFwcE1vZGVFbnVtLkFHRU5UX0NIQVQsIEFwcE1vZGVFbnVtLkNIQVRdLmluY2x1ZGVzKGFwcE1vZGUpICYmIGNvbXBsZXRpb25Qcm9tcHRDb25maWcuY29udmVyc2F0aW9uX2hpc3Rvcmllc19yb2xlLmFzc2lzdGFudF9wcmVmaXggJiYgY29tcGxldGlvblByb21wdENvbmZpZy5jb252ZXJzYXRpb25faGlzdG9yaWVzX3JvbGUudXNlcl9wcmVmaXgpXG4gICAgICAgICAgICBkcmFmdC5jb252ZXJzYXRpb25faGlzdG9yaWVzX3JvbGUgPSBjb21wbGV0aW9uUHJvbXB0Q29uZmlnLmNvbnZlcnNhdGlvbl9oaXN0b3JpZXNfcm9sZVxuICAgICAgICB9KVxuICAgICAgICBzZXRDb21wbGV0aW9uUHJvbXB0Q29uZmlnKG5ld1Byb21wdENvbmZpZylcbiAgICAgICAgaWYgKCFjb21wbGV0aW9uUGFyYW1zLnN0b3AgfHwgY29tcGxldGlvblBhcmFtcy5zdG9wLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHNldENvbXBsZXRpb25QYXJhbXMoe1xuICAgICAgICAgICAgLi4uY29tcGxldGlvblBhcmFtcyxcbiAgICAgICAgICAgIHN0b3AsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBzZXRTdG9wKHN0b3ApIC8vIHN3aXRjaCBtb2RlJ3MgcGFyYW1zIGlzIGFzeW5jLiBJdCBtYXkgb3ZlcnJpZGUgdGhlIHN0b3AgdmFsdWUuXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgbmV3UHJvbXB0Q29uZmlnID0gcHJvZHVjZShjaGF0X3Byb21wdF9jb25maWcsIChkcmFmdCkgPT4ge1xuICAgICAgICAgIGRyYWZ0LnByb21wdCA9IGRyYWZ0LnByb21wdC5tYXAoKHApID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLnAsXG4gICAgICAgICAgICAgIHRleHQ6IHAudGV4dC5yZXBsYWNlKFBSRV9QUk9NUFRfUExBQ0VIT0xERVJfVEVYVCwgdG9SZXBsYWNlUHJlUHJvbXB0KSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICBzZXRDaGF0UHJvbXB0Q29uZmlnKG5ld1Byb21wdENvbmZpZylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNoYXRQcm9tcHRDb25maWcsXG4gICAgc2V0Q2hhdFByb21wdENvbmZpZyxcbiAgICBjb21wbGV0aW9uUHJvbXB0Q29uZmlnLFxuICAgIHNldENvbXBsZXRpb25Qcm9tcHRDb25maWcsXG4gICAgY3VycmVudEFkdmFuY2VkUHJvbXB0LFxuICAgIHNldEN1cnJlbnRBZHZhbmNlZFByb21wdCxcbiAgICBoYXNTZXRCbG9ja1N0YXR1cyxcbiAgICBzZXRDb252ZXJzYXRpb25IaXN0b3JpZXNSb2xlLFxuICAgIG1pZ3JhdGVUb0RlZmF1bHRQcm9tcHQsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQWR2YW5jZWRQcm9tcHRDb25maWdcbiJdfQ==