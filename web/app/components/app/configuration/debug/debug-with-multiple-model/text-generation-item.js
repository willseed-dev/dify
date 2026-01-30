"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("es-toolkit/function");
const object_1 = require("es-toolkit/object");
const react_1 = require("react");
const item_1 = require("@/app/components/app/text-generate/item");
const types_1 = require("@/app/components/base/chat/types");
const hooks_1 = require("@/app/components/base/features/hooks");
const hooks_2 = require("@/app/components/base/text-generation/hooks");
const config_1 = require("@/config");
const debug_configuration_1 = require("@/context/debug-configuration");
const event_emitter_1 = require("@/context/event-emitter");
const provider_context_1 = require("@/context/provider-context");
const model_config_1 = require("@/utils/model-config");
const types_2 = require("../types");
const TextGenerationItem = ({ modelAndParameter, }) => {
    const { isAdvancedMode, modelConfig, appId, inputs, promptMode, speechToTextConfig, introduction, suggestedQuestionsAfterAnswerConfig, citationConfig, externalDataToolsConfig, chatPromptConfig, completionPromptConfig, dataSets, datasetConfigs, } = (0, debug_configuration_1.useDebugConfigurationContext)();
    const { textGenerationModelList } = (0, provider_context_1.useProviderContext)();
    const features = (0, hooks_1.useFeatures)(s => s.features);
    const postDatasets = dataSets.map(({ id }) => ({
        dataset: {
            enabled: true,
            id,
        },
    }));
    const contextVar = modelConfig.configs.prompt_variables.find(item => item.is_context_var)?.key;
    const config = {
        pre_prompt: !isAdvancedMode ? modelConfig.configs.prompt_template : '',
        prompt_type: promptMode,
        chat_prompt_config: isAdvancedMode ? chatPromptConfig : (0, object_1.cloneDeep)(config_1.DEFAULT_CHAT_PROMPT_CONFIG),
        completion_prompt_config: isAdvancedMode ? completionPromptConfig : (0, object_1.cloneDeep)(config_1.DEFAULT_COMPLETION_PROMPT_CONFIG),
        user_input_form: (0, model_config_1.promptVariablesToUserInputsForm)(modelConfig.configs.prompt_variables),
        dataset_query_variable: contextVar || '',
        // features
        more_like_this: features.moreLikeThis,
        sensitive_word_avoidance: features.moderation,
        text_to_speech: features.text2speech,
        file_upload: features.file,
        opening_statement: introduction,
        speech_to_text: speechToTextConfig,
        suggested_questions_after_answer: suggestedQuestionsAfterAnswerConfig,
        retriever_resource: citationConfig,
        external_data_tools: externalDataToolsConfig,
        agent_mode: {
            enabled: false,
            tools: [],
        },
        dataset_configs: {
            ...datasetConfigs,
            datasets: {
                datasets: [...postDatasets],
            },
        },
        system_parameters: modelConfig.system_parameters,
    };
    const { completion, handleSend, isResponding, messageId, } = (0, hooks_2.useTextGeneration)();
    const doSend = (message, files) => {
        const currentProvider = textGenerationModelList.find(item => item.provider === modelAndParameter.provider);
        const currentModel = currentProvider?.models.find(model => model.model === modelAndParameter.model);
        const configData = {
            ...config,
            model: {
                provider: modelAndParameter.provider,
                name: modelAndParameter.model,
                mode: currentModel?.model_properties.mode,
                completion_params: modelAndParameter.parameters,
            },
        };
        const data = {
            inputs,
            model_config: configData,
        };
        if (config.file_upload.enabled && files && files?.length > 0) {
            data.files = files.map((item) => {
                if (item.transfer_method === types_1.TransferMethod.local_file) {
                    return {
                        ...item,
                        url: '',
                    };
                }
                return item;
            });
        }
        handleSend(`apps/${appId}/completion-messages`, data);
    };
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    eventEmitter?.useSubscription((v) => {
        if (v.type === types_2.APP_CHAT_WITH_MULTIPLE_MODEL)
            doSend(v.payload.message, v.payload.files);
    });
    return (<item_1.default className="flex h-full flex-col overflow-y-auto border-none" content={completion} isLoading={!completion && isResponding} isResponding={isResponding} isInstalledApp={false} siteInfo={null} messageId={messageId} isError={false} onRetry={function_1.noop} inSidePanel/>);
};
exports.default = (0, react_1.memo)(TextGenerationItem);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1nZW5lcmF0aW9uLWl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXh0LWdlbmVyYXRpb24taXRlbS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQSxrREFBMEM7QUFDMUMsOENBQTZDO0FBQzdDLGlDQUE0QjtBQUM1QixrRUFBb0U7QUFDcEUsNERBQWlFO0FBQ2pFLGdFQUFrRTtBQUNsRSx1RUFBK0U7QUFDL0UscUNBQXVGO0FBQ3ZGLHVFQUE0RTtBQUM1RSwyREFBdUU7QUFDdkUsaUVBQStEO0FBQy9ELHVEQUFzRTtBQUN0RSxvQ0FBdUQ7QUFLdkQsTUFBTSxrQkFBa0IsR0FBZ0MsQ0FBQyxFQUN2RCxpQkFBaUIsR0FDbEIsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUNKLGNBQWMsRUFDZCxXQUFXLEVBQ1gsS0FBSyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBQ1Ysa0JBQWtCLEVBQ2xCLFlBQVksRUFDWixtQ0FBbUMsRUFDbkMsY0FBYyxFQUNkLHVCQUF1QixFQUN2QixnQkFBZ0IsRUFDaEIsc0JBQXNCLEVBQ3RCLFFBQVEsRUFDUixjQUFjLEdBQ2YsR0FBRyxJQUFBLGtEQUE0QixHQUFFLENBQUE7SUFDbEMsTUFBTSxFQUFFLHVCQUF1QixFQUFFLEdBQUcsSUFBQSxxQ0FBa0IsR0FBRSxDQUFBO0lBQ3hELE1BQU0sUUFBUSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM3QyxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QyxPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsSUFBSTtZQUNiLEVBQUU7U0FDSDtLQUNGLENBQUMsQ0FBQyxDQUFBO0lBQ0gsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMs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RyxFQUFFLEVBQUU7cUJBQ1IsQ0FBQTtnQkFDSCxDQUFDO2dCQUNELE9BQU8sSUFBSSxDQUFBO1lBQ2IsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBRUQsVUFBVSxDQUNSLFFBQVEsS0FBSyxzQkFBc0IsRUFDbkMsSUFBSSxDQUNMLENBQUE7SUFDSCxDQUFDLENBQUE7SUFFRCxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBQSw2Q0FBNkIsR0FBRSxDQUFBO0lBQ3hELFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUN2QyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssb0NBQTRCO1lBQ3pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlDLENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTyxDQUNMLENBQUMsY0FBYyxDQUNiLFNBQVMsQ0FBQyxrREFBa0QsQ0FDNUQsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQ3BCLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFlBQVksQ0FBQyxDQUN2QyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDM0IsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ3RCLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNmLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNyQixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDZixPQUFPLENBQUMsQ0FBQyxlQUFJLENBQUMsQ0FDZCxXQUFXLEVBQ1gsQ0FDSCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsSUFBQSxZQUFJLEVBQUMsa0JBQWtCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgTW9kZWxBbmRQYXJhbWV0ZXIgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHtcbiAgT25TZW5kLFxuICBUZXh0R2VuZXJhdGlvbkNvbmZpZyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RleHQtZ2VuZXJhdGlvbi90eXBlcydcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdlcy10b29sa2l0L2Z1bmN0aW9uJ1xuaW1wb3J0IHsgY2xvbmVEZWVwIH0gZnJvbSAnZXMtdG9vbGtpdC9vYmplY3QnXG5pbXBvcnQgeyBtZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgVGV4dEdlbmVyYXRpb24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvdGV4dC1nZW5lcmF0ZS9pdGVtJ1xuaW1wb3J0IHsgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC90eXBlcydcbmltcG9ydCB7IHVzZUZlYXR1cmVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZlYXR1cmVzL2hvb2tzJ1xuaW1wb3J0IHsgdXNlVGV4dEdlbmVyYXRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdGV4dC1nZW5lcmF0aW9uL2hvb2tzJ1xuaW1wb3J0IHsgREVGQVVMVF9DSEFUX1BST01QVF9DT05GSUcsIERFRkFVTFRfQ09NUExFVElPTl9QUk9NUFRfQ09ORklHIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyB1c2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2RlYnVnLWNvbmZpZ3VyYXRpb24nXG5pbXBvcnQgeyB1c2VFdmVudEVtaXR0ZXJDb250ZXh0Q29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9ldmVudC1lbWl0dGVyJ1xuaW1wb3J0IHsgdXNlUHJvdmlkZXJDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgeyBwcm9tcHRWYXJpYWJsZXNUb1VzZXJJbnB1dHNGb3JtIH0gZnJvbSAnQC91dGlscy9tb2RlbC1jb25maWcnXG5pbXBvcnQgeyBBUFBfQ0hBVF9XSVRIX01VTFRJUExFX01PREVMIH0gZnJvbSAnLi4vdHlwZXMnXG5cbnR5cGUgVGV4dEdlbmVyYXRpb25JdGVtUHJvcHMgPSB7XG4gIG1vZGVsQW5kUGFyYW1ldGVyOiBNb2RlbEFuZFBhcmFtZXRlclxufVxuY29uc3QgVGV4dEdlbmVyYXRpb25JdGVtOiBGQzxUZXh0R2VuZXJhdGlvbkl0ZW1Qcm9wcz4gPSAoe1xuICBtb2RlbEFuZFBhcmFtZXRlcixcbn0pID0+IHtcbiAgY29uc3Qge1xuICAgIGlzQWR2YW5jZWRNb2RlLFxuICAgIG1vZGVsQ29uZmlnLFxuICAgIGFwcElkLFxuICAgIGlucHV0cyxcbiAgICBwcm9tcHRNb2RlLFxuICAgIHNwZWVjaFRvVGV4dENvbmZpZyxcbiAgICBpbnRyb2R1Y3Rpb24sXG4gICAgc3VnZ2VzdGVkUXVlc3Rpb25zQWZ0ZXJBbnN3ZXJDb25maWcsXG4gICAgY2l0YXRpb25Db25maWcsXG4gICAgZXh0ZXJuYWxEYXRhVG9vbHNDb25maWcsXG4gICAgY2hhdFByb21wdENvbmZpZyxcbiAgICBjb21wbGV0aW9uUHJvbXB0Q29uZmlnLFxuICAgIGRhdGFTZXRzLFxuICAgIGRhdGFzZXRDb25maWdzLFxuICB9ID0gdXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dCgpXG4gIGNvbnN0IHsgdGV4dEdlbmVyYXRpb25Nb2RlbExpc3QgfSA9IHVzZVByb3ZpZGVyQ29udGV4dCgpXG4gIGNvbnN0IGZlYXR1cmVzID0gdXNlRmVhdHVyZXMocyA9PiBzLmZlYXR1cmVzKVxuICBjb25zdCBwb3N0RGF0YXNldHMgPSBkYXRhU2V0cy5tYXAoKHsgaWQgfSkgPT4gKHtcbiAgICBkYXRhc2V0OiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgaWQsXG4gICAgfSxcbiAgfSkpXG4gIGNvbnN0IGNvbnRleHRWYXIgPSBtb2RlbENvbmZpZy5jb25maWdzLnByb21wdF92YXJpYWJsZXMuZmluZChpdGVtID0+IGl0ZW0uaXNfY29udGV4dF92YXIpPy5rZXlcbiAgY29uc3QgY29uZmlnOiBUZXh0R2VuZXJhdGlvbkNvbmZpZyA9IHtcbiAgICBwcmVfcHJvbXB0OiAhaXNBZHZhbmNlZE1vZGUgPyBtb2RlbENvbmZpZy5jb25maWdzLnByb21wdF90ZW1wbGF0ZSA6ICcnLFxuICAgIHByb21wdF90eXBlOiBwcm9tcHRNb2RlLFxuICAgIGNoYXRfcHJvbXB0X2NvbmZpZzogaXNBZHZhbmNlZE1vZGUgPyBjaGF0UHJvbXB0Q29uZmlnIDogY2xvbmVEZWVwKERFRkFVTFRfQ0hBVF9QUk9NUFRfQ09ORklHKSxcbiAgICBjb21wbGV0aW9uX3Byb21wdF9jb25maWc6IGlzQWR2YW5jZWRNb2RlID8gY29tcGxldGlvblByb21wdENvbmZpZyA6IGNsb25lRGVlcChERUZBVUxUX0NPTVBMRVRJT05fUFJPTVBUX0NPTkZJRyksXG4gICAgdXNlcl9pbnB1dF9mb3JtOiBwcm9tcHRWYXJpYWJsZXNUb1VzZXJJbnB1dHNGb3JtKG1vZGVsQ29uZmlnLmNvbmZpZ3MucHJvbXB0X3ZhcmlhYmxlcyksXG4gICAgZGF0YXNldF9xdWVyeV92YXJpYWJsZTogY29udGV4dFZhciB8fCAnJyxcbiAgICAvLyBmZWF0dXJlc1xuICAgIG1vcmVfbGlrZV90aGlzOiBmZWF0dXJlcy5tb3JlTGlrZVRoaXMgYXMgYW55LFxuICAgIHNlbnNpdGl2ZV93b3JkX2F2b2lkYW5jZTogZmVhdHVyZXMubW9kZXJhdGlvbiBhcyBhbnksXG4gICAgdGV4dF90b19zcGVlY2g6IGZlYXR1cmVzLnRleHQyc3BlZWNoIGFzIGFueSxcbiAgICBmaWxlX3VwbG9hZDogZmVhdHVyZXMuZmlsZSBhcyBhbnksXG4gICAgb3BlbmluZ19zdGF0ZW1lbnQ6IGludHJvZHVjdGlvbixcbiAgICBzcGVlY2hfdG9fdGV4dDogc3BlZWNoVG9UZXh0Q29uZmlnLFxuICAgIHN1Z2dlc3RlZF9xdWVzdGlvbnNfYWZ0ZXJfYW5zd2VyOiBzdWdnZXN0ZWRRdWVzdGlvbnNBZnRlckFuc3dlckNvbmZpZyxcbiAgICByZXRyaWV2ZXJfcmVzb3VyY2U6IGNpdGF0aW9uQ29uZmlnLFxuICAgIGV4dGVybmFsX2RhdGFfdG9vbHM6IGV4dGVybmFsRGF0YVRvb2xzQ29uZmlnLFxuICAgIGFnZW50X21vZGU6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgdG9vbHM6IFtdLFxuICAgIH0sXG4gICAgZGF0YXNldF9jb25maWdzOiB7XG4gICAgICAuLi5kYXRhc2V0Q29uZmlncyxcbiAgICAgIGRhdGFzZXRzOiB7XG4gICAgICAgIGRhdGFzZXRzOiBbLi4ucG9zdERhdGFzZXRzXSxcbiAgICAgIH0gYXMgYW55LFxuICAgIH0sXG4gICAgc3lzdGVtX3BhcmFtZXRlcnM6IG1vZGVsQ29uZmlnLnN5c3RlbV9wYXJhbWV0ZXJzLFxuICB9XG4gIGNvbnN0IHtcbiAgICBjb21wbGV0aW9uLFxuICAgIGhhbmRsZVNlbmQsXG4gICAgaXNSZXNwb25kaW5nLFxuICAgIG1lc3NhZ2VJZCxcbiAgfSA9IHVzZVRleHRHZW5lcmF0aW9uKClcblxuICBjb25zdCBkb1NlbmQ6IE9uU2VuZCA9IChtZXNzYWdlLCBmaWxlcykgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRQcm92aWRlciA9IHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0LmZpbmQoaXRlbSA9PiBpdGVtLnByb3ZpZGVyID09PSBtb2RlbEFuZFBhcmFtZXRlci5wcm92aWRlcilcbiAgICBjb25zdCBjdXJyZW50TW9kZWwgPSBjdXJyZW50UHJvdmlkZXI/Lm1vZGVscy5maW5kKG1vZGVsID0+IG1vZGVsLm1vZGVsID09PSBtb2RlbEFuZFBhcmFtZXRlci5tb2RlbClcblxuICAgIGNvbnN0IGNvbmZpZ0RhdGEgPSB7XG4gICAgICAuLi5jb25maWcsXG4gICAgICBtb2RlbDoge1xuICAgICAgICBwcm92aWRlcjogbW9kZWxBbmRQYXJhbWV0ZXIucHJvdmlkZXIsXG4gICAgICAgIG5hbWU6IG1vZGVsQW5kUGFyYW1ldGVyLm1vZGVsLFxuICAgICAgICBtb2RlOiBjdXJyZW50TW9kZWw/Lm1vZGVsX3Byb3BlcnRpZXMubW9kZSxcbiAgICAgICAgY29tcGxldGlvbl9wYXJhbXM6IG1vZGVsQW5kUGFyYW1ldGVyLnBhcmFtZXRlcnMsXG4gICAgICB9LFxuICAgIH1cblxuICAgIGNvbnN0IGRhdGE6IGFueSA9IHtcbiAgICAgIGlucHV0cyxcbiAgICAgIG1vZGVsX2NvbmZpZzogY29uZmlnRGF0YSxcbiAgICB9XG5cbiAgICBpZiAoKGNvbmZpZy5maWxlX3VwbG9hZCBhcyBhbnkpLmVuYWJsZWQgJiYgZmlsZXMgJiYgZmlsZXM/Lmxlbmd0aCA+IDApIHtcbiAgICAgIGRhdGEuZmlsZXMgPSBmaWxlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGl0ZW0udHJhbnNmZXJfbWV0aG9kID09PSBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBoYW5kbGVTZW5kKFxuICAgICAgYGFwcHMvJHthcHBJZH0vY29tcGxldGlvbi1tZXNzYWdlc2AsXG4gICAgICBkYXRhLFxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHsgZXZlbnRFbWl0dGVyIH0gPSB1c2VFdmVudEVtaXR0ZXJDb250ZXh0Q29udGV4dCgpXG4gIGV2ZW50RW1pdHRlcj8udXNlU3Vic2NyaXB0aW9uKCh2OiBhbnkpID0+IHtcbiAgICBpZiAodi50eXBlID09PSBBUFBfQ0hBVF9XSVRIX01VTFRJUExFX01PREVMKVxuICAgICAgZG9TZW5kKHYucGF5bG9hZC5tZXNzYWdlLCB2LnBheWxvYWQuZmlsZXMpXG4gIH0pXG5cbiAgcmV0dXJuIChcbiAgICA8VGV4dEdlbmVyYXRpb25cbiAgICAgIGNsYXNzTmFtZT1cImZsZXggaC1mdWxsIGZsZXgtY29sIG92ZXJmbG93LXktYXV0byBib3JkZXItbm9uZVwiXG4gICAgICBjb250ZW50PXtjb21wbGV0aW9ufVxuICAgICAgaXNMb2FkaW5nPXshY29tcGxldGlvbiAmJiBpc1Jlc3BvbmRpbmd9XG4gICAgICBpc1Jlc3BvbmRpbmc9e2lzUmVzcG9uZGluZ31cbiAgICAgIGlzSW5zdGFsbGVkQXBwPXtmYWxzZX1cbiAgICAgIHNpdGVJbmZvPXtudWxsfVxuICAgICAgbWVzc2FnZUlkPXttZXNzYWdlSWR9XG4gICAgICBpc0Vycm9yPXtmYWxzZX1cbiAgICAgIG9uUmV0cnk9e25vb3B9XG4gICAgICBpblNpZGVQYW5lbFxuICAgIC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhUZXh0R2VuZXJhdGlvbkl0ZW0pXG4iXX0=