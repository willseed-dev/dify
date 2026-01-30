"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const function_1 = require("es-toolkit/function");
const object_1 = require("es-toolkit/object");
const immer_1 = require("immer");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const shallow_1 = require("zustand/react/shallow");
const chat_user_input_1 = require("@/app/components/app/configuration/debug/chat-user-input");
const prompt_value_panel_1 = require("@/app/components/app/configuration/prompt-value-panel");
const store_1 = require("@/app/components/app/store");
const item_1 = require("@/app/components/app/text-generate/item");
const action_button_1 = require("@/app/components/base/action-button");
const agent_log_modal_1 = require("@/app/components/base/agent-log-modal");
const button_1 = require("@/app/components/base/button");
const hooks_1 = require("@/app/components/base/features/hooks");
const arrows_1 = require("@/app/components/base/icons/src/vender/line/arrows");
const prompt_log_modal_1 = require("@/app/components/base/prompt-log-modal");
const toast_1 = require("@/app/components/base/toast");
const tooltip_1 = require("@/app/components/base/tooltip");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_2 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const config_1 = require("@/config");
const debug_configuration_1 = require("@/context/debug-configuration");
const event_emitter_1 = require("@/context/event-emitter");
const provider_context_1 = require("@/context/provider-context");
const debug_1 = require("@/service/debug");
const app_1 = require("@/types/app");
const model_config_1 = require("@/utils/model-config");
const group_name_1 = require("../base/group-name");
const cannot_query_dataset_1 = require("../base/warning-mask/cannot-query-dataset");
const formatting_changed_1 = require("../base/warning-mask/formatting-changed");
const has_not_set_api_1 = require("../base/warning-mask/has-not-set-api");
const debug_with_multiple_model_1 = require("./debug-with-multiple-model");
const debug_with_single_model_1 = require("./debug-with-single-model");
const types_1 = require("./types");
const Debug = ({ isAPIKeySet = true, onSetting, inputs, modelParameterParams, debugWithMultipleModel, multipleModelConfigs, onMultipleModelConfigsChange, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { appId, mode, modelModeType, hasSetBlockStatus, isAdvancedMode, promptMode, chatPromptConfig, completionPromptConfig, introduction, suggestedQuestionsAfterAnswerConfig, speechToTextConfig, textToSpeechConfig, citationConfig, formattingChanged, setFormattingChanged, dataSets, modelConfig, completionParams, hasSetContextVar, datasetConfigs, externalDataToolsConfig, } = (0, use_context_selector_1.useContext)(debug_configuration_1.default);
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    const { data: text2speechDefaultModel } = (0, hooks_2.useDefaultModel)(declarations_1.ModelTypeEnum.textEmbedding);
    (0, react_2.useEffect)(() => {
        (0, immer_1.setAutoFreeze)(false);
        return () => {
            (0, immer_1.setAutoFreeze)(true);
        };
    }, []);
    const [isResponding, { setTrue: setRespondingTrue, setFalse: setRespondingFalse }] = (0, ahooks_1.useBoolean)(false);
    const [isShowFormattingChangeConfirm, setIsShowFormattingChangeConfirm] = (0, react_2.useState)(false);
    const [isShowCannotQueryDataset, setShowCannotQueryDataset] = (0, react_2.useState)(false);
    (0, react_2.useEffect)(() => {
        if (formattingChanged)
            setIsShowFormattingChangeConfirm(true);
    }, [formattingChanged]);
    const debugWithSingleModelRef = React.useRef(null);
    const handleClearConversation = () => {
        debugWithSingleModelRef.current?.handleRestart();
    };
    const clearConversation = async () => {
        if (debugWithMultipleModel) {
            eventEmitter?.emit({
                type: types_1.APP_CHAT_WITH_MULTIPLE_MODEL_RESTART,
            });
            return;
        }
        handleClearConversation();
    };
    const handleConfirm = () => {
        clearConversation();
        setIsShowFormattingChangeConfirm(false);
        setFormattingChanged(false);
    };
    const handleCancel = () => {
        setIsShowFormattingChangeConfirm(false);
        setFormattingChanged(false);
    };
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const logError = (0, react_2.useCallback)((message) => {
        notify({ type: 'error', message });
    }, [notify]);
    const [completionFiles, setCompletionFiles] = (0, react_2.useState)([]);
    const checkCanSend = (0, react_2.useCallback)(() => {
        if (isAdvancedMode && mode !== app_1.AppModeEnum.COMPLETION) {
            if (modelModeType === app_1.ModelModeType.completion) {
                if (!hasSetBlockStatus.history) {
                    notify({ type: 'error', message: t('otherError.historyNoBeEmpty', { ns: 'appDebug' }) });
                    return false;
                }
                if (!hasSetBlockStatus.query) {
                    notify({ type: 'error', message: t('otherError.queryNoBeEmpty', { ns: 'appDebug' }) });
                    return false;
                }
            }
        }
        let hasEmptyInput = '';
        const requiredVars = modelConfig.configs.prompt_variables.filter(({ key, name, required, type }) => {
            if (type !== 'string' && type !== 'paragraph' && type !== 'select' && type !== 'number')
                return false;
            const res = (!key || !key.trim()) || (!name || !name.trim()) || (required || required === undefined || required === null);
            return res;
        }); // compatible with old version
        requiredVars.forEach(({ key, name }) => {
            if (hasEmptyInput)
                return;
            if (!inputs[key])
                hasEmptyInput = name;
        });
        if (hasEmptyInput) {
            logError(t('errorMessage.valueOfVarRequired', { ns: 'appDebug', key: hasEmptyInput }));
            return false;
        }
        if (completionFiles.find(item => item.transfer_method === app_1.TransferMethod.local_file && !item.upload_file_id)) {
            notify({ type: 'info', message: t('errorMessage.waitForFileUpload', { ns: 'appDebug' }) });
            return false;
        }
        return !hasEmptyInput;
    }, [
        completionFiles,
        hasSetBlockStatus.history,
        hasSetBlockStatus.query,
        inputs,
        isAdvancedMode,
        mode,
        modelConfig.configs.prompt_variables,
        t,
        logError,
        notify,
        modelModeType,
    ]);
    const [completionRes, setCompletionRes] = (0, react_2.useState)('');
    const [messageId, setMessageId] = (0, react_2.useState)(null);
    const features = (0, hooks_1.useFeatures)(s => s.features);
    const featuresStore = (0, hooks_1.useFeaturesStore)();
    const sendTextCompletion = async () => {
        if (isResponding) {
            notify({ type: 'info', message: t('errorMessage.waitForResponse', { ns: 'appDebug' }) });
            return false;
        }
        if (dataSets.length > 0 && !hasSetContextVar) {
            setShowCannotQueryDataset(true);
            return true;
        }
        if (!checkCanSend())
            return;
        const postDatasets = dataSets.map(({ id }) => ({
            dataset: {
                enabled: true,
                id,
            },
        }));
        const contextVar = modelConfig.configs.prompt_variables.find(item => item.is_context_var)?.key;
        const postModelConfig = {
            pre_prompt: !isAdvancedMode ? modelConfig.configs.prompt_template : '',
            prompt_type: promptMode,
            chat_prompt_config: isAdvancedMode ? chatPromptConfig : (0, object_1.cloneDeep)(config_1.DEFAULT_CHAT_PROMPT_CONFIG),
            completion_prompt_config: isAdvancedMode ? completionPromptConfig : (0, object_1.cloneDeep)(config_1.DEFAULT_COMPLETION_PROMPT_CONFIG),
            user_input_form: (0, model_config_1.promptVariablesToUserInputsForm)(modelConfig.configs.prompt_variables),
            dataset_query_variable: contextVar || '',
            dataset_configs: {
                ...datasetConfigs,
                datasets: {
                    datasets: [...postDatasets],
                },
            },
            agent_mode: {
                enabled: false,
                tools: [],
            },
            model: {
                provider: modelConfig.provider,
                name: modelConfig.model_id,
                mode: modelConfig.mode,
                completion_params: completionParams,
            },
            more_like_this: features.moreLikeThis,
            sensitive_word_avoidance: features.moderation,
            text_to_speech: features.text2speech,
            file_upload: features.file,
            opening_statement: introduction,
            suggested_questions_after_answer: suggestedQuestionsAfterAnswerConfig,
            speech_to_text: speechToTextConfig,
            retriever_resource: citationConfig,
            system_parameters: modelConfig.system_parameters,
            external_data_tools: externalDataToolsConfig,
        };
        const data = {
            inputs: (0, model_config_1.formatBooleanInputs)(modelConfig.configs.prompt_variables, inputs),
            model_config: postModelConfig,
        };
        if (features.file.enabled && completionFiles && completionFiles?.length > 0) {
            data.files = completionFiles.map((item) => {
                if (item.transfer_method === app_1.TransferMethod.local_file) {
                    return {
                        ...item,
                        url: '',
                    };
                }
                return item;
            });
        }
        setCompletionRes('');
        setMessageId('');
        let res = [];
        setRespondingTrue();
        (0, debug_1.sendCompletionMessage)(appId, data, {
            onData: (data, _isFirstMessage, { messageId }) => {
                res.push(data);
                setCompletionRes(res.join(''));
                setMessageId(messageId);
            },
            onMessageReplace: (messageReplace) => {
                res = [messageReplace.answer];
                setCompletionRes(res.join(''));
            },
            onCompleted() {
                setRespondingFalse();
            },
            onError() {
                setRespondingFalse();
            },
        });
    };
    const handleSendTextCompletion = () => {
        if (debugWithMultipleModel) {
            eventEmitter?.emit({
                type: types_1.APP_CHAT_WITH_MULTIPLE_MODEL,
                payload: {
                    message: '',
                    files: completionFiles,
                },
            });
            return;
        }
        sendTextCompletion();
    };
    const varList = modelConfig.configs.prompt_variables.map((item) => {
        return {
            label: item.key,
            value: inputs[item.key],
        };
    });
    const { textGenerationModelList } = (0, provider_context_1.useProviderContext)();
    const handleChangeToSingleModel = (item) => {
        const currentProvider = textGenerationModelList.find(modelItem => modelItem.provider === item.provider);
        const currentModel = currentProvider?.models.find(model => model.model === item.model);
        modelParameterParams.setModel({
            modelId: item.model,
            provider: item.provider,
            mode: currentModel?.model_properties.mode,
            features: currentModel?.features,
        });
        modelParameterParams.onCompletionParamsChange(item.parameters);
        onMultipleModelConfigsChange(false, []);
    };
    const handleVisionConfigInMultipleModel = (0, react_2.useCallback)(() => {
        if (debugWithMultipleModel && mode) {
            const supportedVision = multipleModelConfigs.some((modelConfig) => {
                const currentProvider = textGenerationModelList.find(modelItem => modelItem.provider === modelConfig.provider);
                const currentModel = currentProvider?.models.find(model => model.model === modelConfig.model);
                return currentModel?.features?.includes(declarations_1.ModelFeatureEnum.vision);
            });
            const { features, setFeatures, } = featuresStore.getState();
            const newFeatures = (0, immer_1.produce)(features, (draft) => {
                draft.file = {
                    ...draft.file,
                    enabled: supportedVision,
                };
            });
            setFeatures(newFeatures);
        }
    }, [debugWithMultipleModel, featuresStore, mode, multipleModelConfigs, textGenerationModelList]);
    (0, react_2.useEffect)(() => {
        handleVisionConfigInMultipleModel();
    }, [multipleModelConfigs, mode, handleVisionConfigInMultipleModel]);
    const { currentLogItem, setCurrentLogItem, showPromptLogModal, setShowPromptLogModal, showAgentLogModal, setShowAgentLogModal } = (0, store_1.useStore)((0, shallow_1.useShallow)(state => ({
        currentLogItem: state.currentLogItem,
        setCurrentLogItem: state.setCurrentLogItem,
        showPromptLogModal: state.showPromptLogModal,
        setShowPromptLogModal: state.setShowPromptLogModal,
        showAgentLogModal: state.showAgentLogModal,
        setShowAgentLogModal: state.setShowAgentLogModal,
    })));
    const [width, setWidth] = (0, react_2.useState)(0);
    const ref = (0, react_2.useRef)(null);
    const adjustModalWidth = () => {
        if (ref.current)
            setWidth(document.body.clientWidth - (ref.current?.clientWidth + 16) - 8);
    };
    (0, react_2.useEffect)(() => {
        adjustModalWidth();
    }, []);
    const [expanded, setExpanded] = (0, react_2.useState)(true);
    return (<>
      <div className="shrink-0">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <div className="system-xl-semibold text-text-primary">{t('inputs.title', { ns: 'appDebug' })}</div>
          <div className="flex items-center">
            {debugWithMultipleModel
            ? (<>
                      <button_1.default variant="ghost-accent" onClick={() => onMultipleModelConfigsChange(true, [...multipleModelConfigs, { id: `${Date.now()}`, model: '', provider: '', parameters: {} }])} disabled={multipleModelConfigs.length >= 4}>
                        <react_1.RiAddLine className="mr-1 h-3.5 w-3.5"/>
                        {t('modelProvider.addModel', { ns: 'common' })}
                        (
                        {multipleModelConfigs.length}
                        /4)
                      </button_1.default>
                      <div className="mx-2 h-[14px] w-[1px] bg-divider-regular"/>
                    </>)
            : null}
            {mode !== app_1.AppModeEnum.COMPLETION && (<>
                <tooltip_1.default popupContent={t('operation.refresh', { ns: 'common' })}>
                  <action_button_1.default onClick={clearConversation}>
                    <arrows_1.RefreshCcw01 className="h-4 w-4"/>
                  </action_button_1.default>
                </tooltip_1.default>
                {varList.length > 0 && (<div className="relative ml-1 mr-2">
                    <tooltip_1.default popupContent={t('panel.userInputField', { ns: 'workflow' })}>
                      <action_button_1.default state={expanded ? action_button_1.ActionButtonState.Active : undefined} onClick={() => setExpanded(!expanded)}>
                        <react_1.RiEqualizer2Line className="h-4 w-4"/>
                      </action_button_1.default>
                    </tooltip_1.default>
                    {expanded && <div className="absolute bottom-[-14px] right-[5px] z-10 h-3 w-3 rotate-45 border-l-[0.5px] border-t-[0.5px] border-components-panel-border-subtle bg-components-panel-on-panel-item-bg"/>}
                  </div>)}
              </>)}
          </div>
        </div>
        {mode !== app_1.AppModeEnum.COMPLETION && expanded && (<div className="mx-3">
            <chat_user_input_1.default inputs={inputs}/>
          </div>)}
        {mode === app_1.AppModeEnum.COMPLETION && (<prompt_value_panel_1.default appType={mode} onSend={handleSendTextCompletion} inputs={inputs} visionConfig={{
                ...features.file,
                transfer_methods: features.file.allowed_file_upload_methods || [],
                image_file_size_limit: features.file?.fileUploadConfig?.image_file_size_limit,
            }} onVisionFilesChange={setCompletionFiles}/>)}
      </div>
      {debugWithMultipleModel && (<div className="mt-3 grow overflow-hidden" ref={ref}>
            <debug_with_multiple_model_1.default multipleModelConfigs={multipleModelConfigs} onMultipleModelConfigsChange={onMultipleModelConfigsChange} onDebugWithMultipleModelChange={handleChangeToSingleModel} checkCanSend={checkCanSend}/>
            {showPromptLogModal && (<prompt_log_modal_1.default width={width} currentLogItem={currentLogItem} onCancel={() => {
                    setCurrentLogItem();
                    setShowPromptLogModal(false);
                }}/>)}
            {showAgentLogModal && (<agent_log_modal_1.default width={width} currentLogItem={currentLogItem} onCancel={() => {
                    setCurrentLogItem();
                    setShowAgentLogModal(false);
                }}/>)}
          </div>)}
      {!debugWithMultipleModel && (<div className="flex grow flex-col" ref={ref}>
            {/* Chat */}
            {mode !== app_1.AppModeEnum.COMPLETION && (<div className="h-0 grow overflow-hidden">
                <debug_with_single_model_1.default ref={debugWithSingleModelRef} checkCanSend={checkCanSend}/>
              </div>)}
            {/* Text  Generation */}
            {mode === app_1.AppModeEnum.COMPLETION && (<>
                {(completionRes || isResponding) && (<>
                    <div className="mx-4 mt-3"><group_name_1.default name={t('result', { ns: 'appDebug' })}/></div>
                    <div className="mx-3 mb-8">
                      <item_1.default className="mt-2" content={completionRes} isLoading={!completionRes && isResponding} isShowTextToSpeech={textToSpeechConfig.enabled && !!text2speechDefaultModel} isResponding={isResponding} isInstalledApp={false} messageId={messageId} isError={false} onRetry={function_1.noop} siteInfo={null}/>
                    </div>
                  </>)}
                {!completionRes && !isResponding && (<div className="flex grow flex-col items-center justify-center gap-2">
                    <react_1.RiSparklingFill className="h-12 w-12 text-text-empty-state-icon"/>
                    <div className="system-sm-regular text-text-quaternary">{t('noResult', { ns: 'appDebug' })}</div>
                  </div>)}
              </>)}
            {mode === app_1.AppModeEnum.COMPLETION && showPromptLogModal && (<prompt_log_modal_1.default width={width} currentLogItem={currentLogItem} onCancel={() => {
                    setCurrentLogItem();
                    setShowPromptLogModal(false);
                }}/>)}
            {isShowCannotQueryDataset && (<cannot_query_dataset_1.default onConfirm={() => setShowCannotQueryDataset(false)}/>)}
          </div>)}
      {isShowFormattingChangeConfirm && (<formatting_changed_1.default onConfirm={handleConfirm} onCancel={handleCancel}/>)}
      {!isAPIKeySet && (<has_not_set_api_1.default isTrailFinished={!config_1.IS_CE_EDITION} onSetting={onSetting}/>)}
    </>);
};
exports.default = React.memo(Debug);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFPWiw0Q0FJeUI7QUFDekIsbUNBQW1DO0FBQ25DLGtEQUEwQztBQUMxQyw4Q0FBNkM7QUFDN0MsaUNBQThDO0FBQzlDLCtCQUE4QjtBQUM5QixpQ0FBZ0U7QUFDaEUsaURBQThDO0FBQzlDLCtEQUFpRDtBQUNqRCxtREFBa0Q7QUFDbEQsOEZBQW9GO0FBQ3BGLDhGQUFvRjtBQUNwRixzREFBb0U7QUFDcEUsa0VBQW9FO0FBQ3BFLHVFQUFxRjtBQUNyRiwyRUFBaUU7QUFDakUseURBQWlEO0FBQ2pELGdFQUFvRjtBQUNwRiwrRUFBaUY7QUFDakYsNkVBQW1FO0FBQ25FLHVEQUEwRDtBQUMxRCwyREFBdUQ7QUFDdkQsMkdBQTBIO0FBQzFILDZGQUFtRztBQUNuRyxxQ0FBc0c7QUFDdEcsdUVBQXlEO0FBQ3pELDJEQUF1RTtBQUN2RSxpRUFBK0Q7QUFDL0QsMkNBQXVEO0FBQ3ZELHFDQUF3RTtBQUN4RSx1REFBMkY7QUFDM0YsbURBQTBDO0FBQzFDLG9GQUEwRTtBQUMxRSxnRkFBdUU7QUFDdkUsMEVBQWtFO0FBQ2xFLDJFQUFnRTtBQUNoRSx1RUFBNEQ7QUFDNUQsbUNBR2dCO0FBWWhCLE1BQU0sS0FBSyxHQUFlLENBQUMsRUFDekIsV0FBVyxHQUFHLElBQUksRUFDbEIsU0FBUyxFQUNULE1BQU0sRUFDTixvQkFBb0IsRUFDcEIsc0JBQXNCLEVBQ3RCLG9CQUFvQixFQUNwQiw0QkFBNEIsR0FDN0IsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFDSixLQUFLLEVBQ0wsSUFBSSxFQUNKLGFBQWEsRUFDYixpQkFBaUIsRUFDakIsY0FBYyxFQUNkLFVBQVUsRUFDVixnQkFBZ0IsRUFDaEIsc0JBQXNCLEVBQ3RCLFlBQVks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QUN6QixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFDdkIsQ0FDSCxDQUNEO01BQUEsQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMseUJBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLHNCQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRyxDQUFDLENBQy9GO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZSB9IGZyb20gJy4vZGVidWctd2l0aC1zaW5nbGUtbW9kZWwnXG5pbXBvcnQgdHlwZSB7IE1vZGVsQW5kUGFyYW1ldGVyIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIHsgTW9kZWxQYXJhbWV0ZXJNb2RhbFByb3BzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvbW9kZWwtcGFyYW1ldGVyLW1vZGFsJ1xuaW1wb3J0IHR5cGUgeyBJbnB1dHMgfSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB0eXBlIHsgTW9kZWxDb25maWcgYXMgQmFja2VuZE1vZGVsQ29uZmlnLCBWaXNpb25GaWxlLCBWaXNpb25TZXR0aW5ncyB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHtcbiAgUmlBZGRMaW5lLFxuICBSaUVxdWFsaXplcjJMaW5lLFxuICBSaVNwYXJrbGluZ0ZpbGwsXG59IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyB1c2VCb29sZWFuIH0gZnJvbSAnYWhvb2tzJ1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJ2VzLXRvb2xraXQvZnVuY3Rpb24nXG5pbXBvcnQgeyBjbG9uZURlZXAgfSBmcm9tICdlcy10b29sa2l0L29iamVjdCdcbmltcG9ydCB7IHByb2R1Y2UsIHNldEF1dG9GcmVlemUgfSBmcm9tICdpbW1lcidcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuaW1wb3J0IHsgdXNlU2hhbGxvdyB9IGZyb20gJ3p1c3RhbmQvcmVhY3Qvc2hhbGxvdydcbmltcG9ydCBDaGF0VXNlcklucHV0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL2NvbmZpZ3VyYXRpb24vZGVidWcvY2hhdC11c2VyLWlucHV0J1xuaW1wb3J0IFByb21wdFZhbHVlUGFuZWwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvY29uZmlndXJhdGlvbi9wcm9tcHQtdmFsdWUtcGFuZWwnXG5pbXBvcnQgeyB1c2VTdG9yZSBhcyB1c2VBcHBTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJ1xuaW1wb3J0IFRleHRHZW5lcmF0aW9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3RleHQtZ2VuZXJhdGUvaXRlbSdcbmltcG9ydCBBY3Rpb25CdXR0b24sIHsgQWN0aW9uQnV0dG9uU3RhdGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYWN0aW9uLWJ1dHRvbidcbmltcG9ydCBBZ2VudExvZ01vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hZ2VudC1sb2ctbW9kYWwnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgeyB1c2VGZWF0dXJlcywgdXNlRmVhdHVyZXNTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mZWF0dXJlcy9ob29rcydcbmltcG9ydCB7IFJlZnJlc2hDY3cwMSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL2xpbmUvYXJyb3dzJ1xuaW1wb3J0IFByb21wdExvZ01vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wcm9tcHQtbG9nLW1vZGFsJ1xuaW1wb3J0IHsgVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IFRvb2x0aXBQbHVzIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b29sdGlwJ1xuaW1wb3J0IHsgTW9kZWxGZWF0dXJlRW51bSwgTW9kZWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IHVzZURlZmF1bHRNb2RlbCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJ1xuaW1wb3J0IHsgREVGQVVMVF9DSEFUX1BST01QVF9DT05GSUcsIERFRkFVTFRfQ09NUExFVElPTl9QUk9NUFRfQ09ORklHLCBJU19DRV9FRElUSU9OIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgQ29uZmlnQ29udGV4dCBmcm9tICdAL2NvbnRleHQvZGVidWctY29uZmlndXJhdGlvbidcbmltcG9ydCB7IHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgeyB1c2VQcm92aWRlckNvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB7IHNlbmRDb21wbGV0aW9uTWVzc2FnZSB9IGZyb20gJ0Avc2VydmljZS9kZWJ1ZydcbmltcG9ydCB7IEFwcE1vZGVFbnVtLCBNb2RlbE1vZGVUeXBlLCBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgZm9ybWF0Qm9vbGVhbklucHV0cywgcHJvbXB0VmFyaWFibGVzVG9Vc2VySW5wdXRzRm9ybSB9IGZyb20gJ0AvdXRpbHMvbW9kZWwtY29uZmlnJ1xuaW1wb3J0IEdyb3VwTmFtZSBmcm9tICcuLi9iYXNlL2dyb3VwLW5hbWUnXG5pbXBvcnQgQ2Fubm90UXVlcnlEYXRhc2V0IGZyb20gJy4uL2Jhc2Uvd2FybmluZy1tYXNrL2Nhbm5vdC1xdWVyeS1kYXRhc2V0J1xuaW1wb3J0IEZvcm1hdHRpbmdDaGFuZ2VkIGZyb20gJy4uL2Jhc2Uvd2FybmluZy1tYXNrL2Zvcm1hdHRpbmctY2hhbmdlZCdcbmltcG9ydCBIYXNOb3RTZXRBUElLRVkgZnJvbSAnLi4vYmFzZS93YXJuaW5nLW1hc2svaGFzLW5vdC1zZXQtYXBpJ1xuaW1wb3J0IERlYnVnV2l0aE11bHRpcGxlTW9kZWwgZnJvbSAnLi9kZWJ1Zy13aXRoLW11bHRpcGxlLW1vZGVsJ1xuaW1wb3J0IERlYnVnV2l0aFNpbmdsZU1vZGVsIGZyb20gJy4vZGVidWctd2l0aC1zaW5nbGUtbW9kZWwnXG5pbXBvcnQge1xuICBBUFBfQ0hBVF9XSVRIX01VTFRJUExFX01PREVMLFxuICBBUFBfQ0hBVF9XSVRIX01VTFRJUExFX01PREVMX1JFU1RBUlQsXG59IGZyb20gJy4vdHlwZXMnXG5cbnR5cGUgSURlYnVnID0ge1xuICBpc0FQSUtleVNldDogYm9vbGVhblxuICBvblNldHRpbmc6ICgpID0+IHZvaWRcbiAgaW5wdXRzOiBJbnB1dHNcbiAgbW9kZWxQYXJhbWV0ZXJQYXJhbXM6IFBpY2s8TW9kZWxQYXJhbWV0ZXJNb2RhbFByb3BzLCAnc2V0TW9kZWwnIHwgJ29uQ29tcGxldGlvblBhcmFtc0NoYW5nZSc+XG4gIGRlYnVnV2l0aE11bHRpcGxlTW9kZWw6IGJvb2xlYW5cbiAgbXVsdGlwbGVNb2RlbENvbmZpZ3M6IE1vZGVsQW5kUGFyYW1ldGVyW11cbiAgb25NdWx0aXBsZU1vZGVsQ29uZmlnc0NoYW5nZTogKG11bHRpcGxlOiBib29sZWFuLCBtb2RlbENvbmZpZ3M6IE1vZGVsQW5kUGFyYW1ldGVyW10pID0+IHZvaWRcbn1cblxuY29uc3QgRGVidWc6IEZDPElEZWJ1Zz4gPSAoe1xuICBpc0FQSUtleVNldCA9IHRydWUsXG4gIG9uU2V0dGluZyxcbiAgaW5wdXRzLFxuICBtb2RlbFBhcmFtZXRlclBhcmFtcyxcbiAgZGVidWdXaXRoTXVsdGlwbGVNb2RlbCxcbiAgbXVsdGlwbGVNb2RlbENvbmZpZ3MsXG4gIG9uTXVsdGlwbGVNb2RlbENvbmZpZ3NDaGFuZ2UsXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7XG4gICAgYXBwSWQsXG4gICAgbW9kZSxcbiAgICBtb2RlbE1vZGVUeXBlLFxuICAgIGhhc1NldEJsb2NrU3RhdHVzLFxuICAgIGlzQWR2YW5jZWRNb2RlLFxuICAgIHByb21wdE1vZGUsXG4gICAgY2hhdFByb21wdENvbmZpZyxcbiAgICBjb21wbGV0aW9uUHJvbXB0Q29uZmlnLFxuICAgIGludHJvZHVjdGlvbixcbiAgICBzdWdnZXN0ZWRRdWVzdGlvbnNBZnRlckFuc3dlckNvbmZpZyxcbiAgICBzcGVlY2hUb1RleHRDb25maWcsXG4gICAgdGV4dFRvU3BlZWNoQ29uZmlnLFxuICAgIGNpdGF0aW9uQ29uZmlnLFxuICAgIGZvcm1hdHRpbmdDaGFuZ2VkLFxuICAgIHNldEZvcm1hdHRpbmdDaGFuZ2VkLFxuICAgIGRhdGFTZXRzLFxuICAgIG1vZGVsQ29uZmlnLFxuICAgIGNvbXBsZXRpb25QYXJhbXMsXG4gICAgaGFzU2V0Q29udGV4dFZhcixcbiAgICBkYXRhc2V0Q29uZmlncyxcbiAgICBleHRlcm5hbERhdGFUb29sc0NvbmZpZyxcbiAgfSA9IHVzZUNvbnRleHQoQ29uZmlnQ29udGV4dClcbiAgY29uc3QgeyBldmVudEVtaXR0ZXIgfSA9IHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0KClcbiAgY29uc3QgeyBkYXRhOiB0ZXh0MnNwZWVjaERlZmF1bHRNb2RlbCB9ID0gdXNlRGVmYXVsdE1vZGVsKE1vZGVsVHlwZUVudW0udGV4dEVtYmVkZGluZylcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRBdXRvRnJlZXplKGZhbHNlKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzZXRBdXRvRnJlZXplKHRydWUpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBbaXNSZXNwb25kaW5nLCB7IHNldFRydWU6IHNldFJlc3BvbmRpbmdUcnVlLCBzZXRGYWxzZTogc2V0UmVzcG9uZGluZ0ZhbHNlIH1dID0gdXNlQm9vbGVhbihmYWxzZSlcbiAgY29uc3QgW2lzU2hvd0Zvcm1hdHRpbmdDaGFuZ2VDb25maXJtLCBzZXRJc1Nob3dGb3JtYXR0aW5nQ2hhbmdlQ29uZmlybV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2lzU2hvd0Nhbm5vdFF1ZXJ5RGF0YXNldCwgc2V0U2hvd0Nhbm5vdFF1ZXJ5RGF0YXNldF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChmb3JtYXR0aW5nQ2hhbmdlZClcbiAgICAgIHNldElzU2hvd0Zvcm1hdHRpbmdDaGFuZ2VDb25maXJtKHRydWUpXG4gIH0sIFtmb3JtYXR0aW5nQ2hhbmdlZF0pXG5cbiAgY29uc3QgZGVidWdXaXRoU2luZ2xlTW9kZWxSZWYgPSBSZWFjdC51c2VSZWY8RGVidWdXaXRoU2luZ2xlTW9kZWxSZWZUeXBlPihudWxsISlcbiAgY29uc3QgaGFuZGxlQ2xlYXJDb252ZXJzYXRpb24gPSAoKSA9PiB7XG4gICAgZGVidWdXaXRoU2luZ2xlTW9kZWxSZWYuY3VycmVudD8uaGFuZGxlUmVzdGFydCgpXG4gIH1cbiAgY29uc3QgY2xlYXJDb252ZXJzYXRpb24gPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGRlYnVnV2l0aE11bHRpcGxlTW9kZWwpIHtcbiAgICAgIGV2ZW50RW1pdHRlcj8uZW1pdCh7XG4gICAgICAgIHR5cGU6IEFQUF9DSEFUX1dJVEhfTVVMVElQTEVfTU9ERUxfUkVTVEFSVCxcbiAgICAgIH0gYXMgYW55KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaGFuZGxlQ2xlYXJDb252ZXJzYXRpb24oKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybSA9ICgpID0+IHtcbiAgICBjbGVhckNvbnZlcnNhdGlvbigpXG4gICAgc2V0SXNTaG93Rm9ybWF0dGluZ0NoYW5nZUNvbmZpcm0oZmFsc2UpXG4gICAgc2V0Rm9ybWF0dGluZ0NoYW5nZWQoZmFsc2UpXG4gIH1cblxuICBjb25zdCBoYW5kbGVDYW5jZWwgPSAoKSA9PiB7XG4gICAgc2V0SXNTaG93Rm9ybWF0dGluZ0NoYW5nZUNvbmZpcm0oZmFsc2UpXG4gICAgc2V0Rm9ybWF0dGluZ0NoYW5nZWQoZmFsc2UpXG4gIH1cblxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlQ29udGV4dChUb2FzdENvbnRleHQpXG4gIGNvbnN0IGxvZ0Vycm9yID0gdXNlQ2FsbGJhY2soKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfSlcbiAgfSwgW25vdGlmeV0pXG4gIGNvbnN0IFtjb21wbGV0aW9uRmlsZXMsIHNldENvbXBsZXRpb25GaWxlc10gPSB1c2VTdGF0ZTxWaXNpb25GaWxlW10+KFtdKVxuXG4gIGNvbnN0IGNoZWNrQ2FuU2VuZCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoaXNBZHZhbmNlZE1vZGUgJiYgbW9kZSAhPT0gQXBwTW9kZUVudW0uQ09NUExFVElPTikge1xuICAgICAgaWYgKG1vZGVsTW9kZVR5cGUgPT09IE1vZGVsTW9kZVR5cGUuY29tcGxldGlvbikge1xuICAgICAgICBpZiAoIWhhc1NldEJsb2NrU3RhdHVzLmhpc3RvcnkpIHtcbiAgICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdvdGhlckVycm9yLmhpc3RvcnlOb0JlRW1wdHknLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoYXNTZXRCbG9ja1N0YXR1cy5xdWVyeSkge1xuICAgICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ290aGVyRXJyb3IucXVlcnlOb0JlRW1wdHknLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGhhc0VtcHR5SW5wdXQgPSAnJ1xuICAgIGNvbnN0IHJlcXVpcmVkVmFycyA9IG1vZGVsQ29uZmlnLmNvbmZpZ3MucHJvbXB0X3ZhcmlhYmxlcy5maWx0ZXIoKHsga2V5LCBuYW1lLCByZXF1aXJlZCwgdHlwZSB9KSA9PiB7XG4gICAgICBpZiAodHlwZSAhPT0gJ3N0cmluZycgJiYgdHlwZSAhPT0gJ3BhcmFncmFwaCcgJiYgdHlwZSAhPT0gJ3NlbGVjdCcgJiYgdHlwZSAhPT0gJ251bWJlcicpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgY29uc3QgcmVzID0gKCFrZXkgfHwgIWtleS50cmltKCkpIHx8ICghbmFtZSB8fCAhbmFtZS50cmltKCkpIHx8IChyZXF1aXJlZCB8fCByZXF1aXJlZCA9PT0gdW5kZWZpbmVkIHx8IHJlcXVpcmVkID09PSBudWxsKVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH0pIC8vIGNvbXBhdGlibGUgd2l0aCBvbGQgdmVyc2lvblxuICAgIHJlcXVpcmVkVmFycy5mb3JFYWNoKCh7IGtleSwgbmFtZSB9KSA9PiB7XG4gICAgICBpZiAoaGFzRW1wdHlJbnB1dClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmICghaW5wdXRzW2tleV0pXG4gICAgICAgIGhhc0VtcHR5SW5wdXQgPSBuYW1lXG4gICAgfSlcblxuICAgIGlmIChoYXNFbXB0eUlucHV0KSB7XG4gICAgICBsb2dFcnJvcih0KCdlcnJvck1lc3NhZ2UudmFsdWVPZlZhclJlcXVpcmVkJywgeyBuczogJ2FwcERlYnVnJywga2V5OiBoYXNFbXB0eUlucHV0IH0pKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKGNvbXBsZXRpb25GaWxlcy5maW5kKGl0ZW0gPT4gaXRlbS50cmFuc2Zlcl9tZXRob2QgPT09IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUgJiYgIWl0ZW0udXBsb2FkX2ZpbGVfaWQpKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnaW5mbycsIG1lc3NhZ2U6IHQoJ2Vycm9yTWVzc2FnZS53YWl0Rm9yRmlsZVVwbG9hZCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gIWhhc0VtcHR5SW5wdXRcbiAgfSwgW1xuICAgIGNvbXBsZXRpb25GaWxlcyxcbiAgICBoYXNTZXRCbG9ja1N0YXR1cy5oaXN0b3J5LFxuICAgIGhhc1NldEJsb2NrU3RhdHVzLnF1ZXJ5LFxuICAgIGlucHV0cyxcbiAgICBpc0FkdmFuY2VkTW9kZSxcbiAgICBtb2RlLFxuICAgIG1vZGVsQ29uZmlnLmNvbmZpZ3MucHJvbXB0X3ZhcmlhYmxlcyxcbiAgICB0LFxuICAgIGxvZ0Vycm9yLFxuICAgIG5vdGlmeSxcbiAgICBtb2RlbE1vZGVUeXBlLFxuICBdKVxuXG4gIGNvbnN0IFtjb21wbGV0aW9uUmVzLCBzZXRDb21wbGV0aW9uUmVzXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbbWVzc2FnZUlkLCBzZXRNZXNzYWdlSWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbClcbiAgY29uc3QgZmVhdHVyZXMgPSB1c2VGZWF0dXJlcyhzID0+IHMuZmVhdHVyZXMpXG4gIGNvbnN0IGZlYXR1cmVzU3RvcmUgPSB1c2VGZWF0dXJlc1N0b3JlKClcblxuICBjb25zdCBzZW5kVGV4dENvbXBsZXRpb24gPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGlzUmVzcG9uZGluZykge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2luZm8nLCBtZXNzYWdlOiB0KCdlcnJvck1lc3NhZ2Uud2FpdEZvclJlc3BvbnNlJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKGRhdGFTZXRzLmxlbmd0aCA+IDAgJiYgIWhhc1NldENvbnRleHRWYXIpIHtcbiAgICAgIHNldFNob3dDYW5ub3RRdWVyeURhdGFzZXQodHJ1ZSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKCFjaGVja0NhblNlbmQoKSlcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgcG9zdERhdGFzZXRzID0gZGF0YVNldHMubWFwKCh7IGlkIH0pID0+ICh7XG4gICAgICBkYXRhc2V0OiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGlkLFxuICAgICAgfSxcbiAgICB9KSlcbiAgICBjb25zdCBjb250ZXh0VmFyID0gbW9kZWxDb25maWcuY29uZmlncy5wcm9tcHRfdmFyaWFibGVzLmZpbmQoaXRlbSA9PiBpdGVtLmlzX2NvbnRleHRfdmFyKT8ua2V5XG5cbiAgICBjb25zdCBwb3N0TW9kZWxDb25maWc6IEJhY2tlbmRNb2RlbENvbmZpZyA9IHtcbiAgICAgIHByZV9wcm9tcHQ6ICFpc0FkdmFuY2VkTW9kZSA/IG1vZGVsQ29uZmlnLmNvbmZpZ3MucHJvbXB0X3RlbXBsYXRlIDogJycsXG4gICAgICBwcm9tcHRfdHlwZTogcHJvbXB0TW9kZSxcbiAgICAgIGNoYXRfcHJvbXB0X2NvbmZpZzogaXNBZHZhbmNlZE1vZGUgPyBjaGF0UHJvbXB0Q29uZmlnIDogY2xvbmVEZWVwKERFRkFVTFRfQ0hBVF9QUk9NUFRfQ09ORklHKSxcbiAgICAgIGNvbXBsZXRpb25fcHJvbXB0X2NvbmZpZzogaXNBZHZhbmNlZE1vZGUgPyBjb21wbGV0aW9uUHJvbXB0Q29uZmlnIDogY2xvbmVEZWVwKERFRkFVTFRfQ09NUExFVElPTl9QUk9NUFRfQ09ORklHKSxcbiAgICAgIHVzZXJfaW5wdXRfZm9ybTogcHJvbXB0VmFyaWFibGVzVG9Vc2VySW5wdXRzRm9ybShtb2RlbENvbmZpZy5jb25maWdzLnByb21wdF92YXJpYWJsZXMpLFxuICAgICAgZGF0YXNldF9xdWVyeV92YXJpYWJsZTogY29udGV4dFZhciB8fCAnJyxcbiAgICAgIGRhdGFzZXRfY29uZmlnczoge1xuICAgICAgICAuLi5kYXRhc2V0Q29uZmlncyxcbiAgICAgICAgZGF0YXNldHM6IHtcbiAgICAgICAgICBkYXRhc2V0czogWy4uLnBvc3REYXRhc2V0c10sXG4gICAgICAgIH0gYXMgYW55LFxuICAgICAgfSxcbiAgICAgIGFnZW50X21vZGU6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgIHRvb2xzOiBbXSxcbiAgICAgIH0sXG4gICAgICBtb2RlbDoge1xuICAgICAgICBwcm92aWRlcjogbW9kZWxDb25maWcucHJvdmlkZXIsXG4gICAgICAgIG5hbWU6IG1vZGVsQ29uZmlnLm1vZGVsX2lkLFxuICAgICAgICBtb2RlOiBtb2RlbENvbmZpZy5tb2RlLFxuICAgICAgICBjb21wbGV0aW9uX3BhcmFtczogY29tcGxldGlvblBhcmFtcyBhcyBhbnksXG4gICAgICB9LFxuICAgICAgbW9yZV9saWtlX3RoaXM6IGZlYXR1cmVzLm1vcmVMaWtlVGhpcyBhcyBhbnksXG4gICAgICBzZW5zaXRpdmVfd29yZF9hdm9pZGFuY2U6IGZlYXR1cmVzLm1vZGVyYXRpb24gYXMgYW55LFxuICAgICAgdGV4dF90b19zcGVlY2g6IGZlYXR1cmVzLnRleHQyc3BlZWNoIGFzIGFueSxcbiAgICAgIGZpbGVfdXBsb2FkOiBmZWF0dXJlcy5maWxlIGFzIGFueSxcbiAgICAgIG9wZW5pbmdfc3RhdGVtZW50OiBpbnRyb2R1Y3Rpb24sXG4gICAgICBzdWdnZXN0ZWRfcXVlc3Rpb25zX2FmdGVyX2Fuc3dlcjogc3VnZ2VzdGVkUXVlc3Rpb25zQWZ0ZXJBbnN3ZXJDb25maWcsXG4gICAgICBzcGVlY2hfdG9fdGV4dDogc3BlZWNoVG9UZXh0Q29uZmlnLFxuICAgICAgcmV0cmlldmVyX3Jlc291cmNlOiBjaXRhdGlvbkNvbmZpZyxcbiAgICAgIHN5c3RlbV9wYXJhbWV0ZXJzOiBtb2RlbENvbmZpZy5zeXN0ZW1fcGFyYW1ldGVycyxcbiAgICAgIGV4dGVybmFsX2RhdGFfdG9vbHM6IGV4dGVybmFsRGF0YVRvb2xzQ29uZmlnLFxuICAgIH1cblxuICAgIGNvbnN0IGRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICBpbnB1dHM6IGZvcm1hdEJvb2xlYW5JbnB1dHMobW9kZWxDb25maWcuY29uZmlncy5wcm9tcHRfdmFyaWFibGVzLCBpbnB1dHMpLFxuICAgICAgbW9kZWxfY29uZmlnOiBwb3N0TW9kZWxDb25maWcsXG4gICAgfVxuXG4gICAgaWYgKChmZWF0dXJlcy5maWxlIGFzIGFueSkuZW5hYmxlZCAmJiBjb21wbGV0aW9uRmlsZXMgJiYgY29tcGxldGlvbkZpbGVzPy5sZW5ndGggPiAwKSB7XG4gICAgICBkYXRhLmZpbGVzID0gY29tcGxldGlvbkZpbGVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS50cmFuc2Zlcl9tZXRob2QgPT09IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtXG4gICAgICB9KVxuICAgIH1cblxuICAgIHNldENvbXBsZXRpb25SZXMoJycpXG4gICAgc2V0TWVzc2FnZUlkKCcnKVxuICAgIGxldCByZXM6IHN0cmluZ1tdID0gW11cblxuICAgIHNldFJlc3BvbmRpbmdUcnVlKClcbiAgICBzZW5kQ29tcGxldGlvbk1lc3NhZ2UoYXBwSWQsIGRhdGEsIHtcbiAgICAgIG9uRGF0YTogKGRhdGE6IHN0cmluZywgX2lzRmlyc3RNZXNzYWdlOiBib29sZWFuLCB7IG1lc3NhZ2VJZCB9KSA9PiB7XG4gICAgICAgIHJlcy5wdXNoKGRhdGEpXG4gICAgICAgIHNldENvbXBsZXRpb25SZXMocmVzLmpvaW4oJycpKVxuICAgICAgICBzZXRNZXNzYWdlSWQobWVzc2FnZUlkKVxuICAgICAgfSxcbiAgICAgIG9uTWVzc2FnZVJlcGxhY2U6IChtZXNzYWdlUmVwbGFjZSkgPT4ge1xuICAgICAgICByZXMgPSBbbWVzc2FnZVJlcGxhY2UuYW5zd2VyXVxuICAgICAgICBzZXRDb21wbGV0aW9uUmVzKHJlcy5qb2luKCcnKSlcbiAgICAgIH0sXG4gICAgICBvbkNvbXBsZXRlZCgpIHtcbiAgICAgICAgc2V0UmVzcG9uZGluZ0ZhbHNlKClcbiAgICAgIH0sXG4gICAgICBvbkVycm9yKCkge1xuICAgICAgICBzZXRSZXNwb25kaW5nRmFsc2UoKVxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU2VuZFRleHRDb21wbGV0aW9uID0gKCkgPT4ge1xuICAgIGlmIChkZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsKSB7XG4gICAgICBldmVudEVtaXR0ZXI/LmVtaXQoe1xuICAgICAgICB0eXBlOiBBUFBfQ0hBVF9XSVRIX01VTFRJUExFX01PREVMLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgZmlsZXM6IGNvbXBsZXRpb25GaWxlcyxcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgYW55KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2VuZFRleHRDb21wbGV0aW9uKClcbiAgfVxuXG4gIGNvbnN0IHZhckxpc3QgPSBtb2RlbENvbmZpZy5jb25maWdzLnByb21wdF92YXJpYWJsZXMubWFwKChpdGVtOiBhbnkpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGl0ZW0ua2V5LFxuICAgICAgdmFsdWU6IGlucHV0c1tpdGVtLmtleV0sXG4gICAgfVxuICB9KVxuXG4gIGNvbnN0IHsgdGV4dEdlbmVyYXRpb25Nb2RlbExpc3QgfSA9IHVzZVByb3ZpZGVyQ29udGV4dCgpXG4gIGNvbnN0IGhhbmRsZUNoYW5nZVRvU2luZ2xlTW9kZWwgPSAoaXRlbTogTW9kZWxBbmRQYXJhbWV0ZXIpID0+IHtcbiAgICBjb25zdCBjdXJyZW50UHJvdmlkZXIgPSB0ZXh0R2VuZXJhdGlvbk1vZGVsTGlzdC5maW5kKG1vZGVsSXRlbSA9PiBtb2RlbEl0ZW0ucHJvdmlkZXIgPT09IGl0ZW0ucHJvdmlkZXIpXG4gICAgY29uc3QgY3VycmVudE1vZGVsID0gY3VycmVudFByb3ZpZGVyPy5tb2RlbHMuZmluZChtb2RlbCA9PiBtb2RlbC5tb2RlbCA9PT0gaXRlbS5tb2RlbClcblxuICAgIG1vZGVsUGFyYW1ldGVyUGFyYW1zLnNldE1vZGVsKHtcbiAgICAgIG1vZGVsSWQ6IGl0ZW0ubW9kZWwsXG4gICAgICBwcm92aWRlcjogaXRlbS5wcm92aWRlcixcbiAgICAgIG1vZGU6IGN1cnJlbnRNb2RlbD8ubW9kZWxfcHJvcGVydGllcy5tb2RlIGFzIHN0cmluZyxcbiAgICAgIGZlYXR1cmVzOiBjdXJyZW50TW9kZWw/LmZlYXR1cmVzLFxuICAgIH0pXG4gICAgbW9kZWxQYXJhbWV0ZXJQYXJhbXMub25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlKGl0ZW0ucGFyYW1ldGVycylcbiAgICBvbk11bHRpcGxlTW9kZWxDb25maWdzQ2hhbmdlKFxuICAgICAgZmFsc2UsXG4gICAgICBbXSxcbiAgICApXG4gIH1cblxuICBjb25zdCBoYW5kbGVWaXNpb25Db25maWdJbk11bHRpcGxlTW9kZWwgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKGRlYnVnV2l0aE11bHRpcGxlTW9kZWwgJiYgbW9kZSkge1xuICAgICAgY29uc3Qgc3VwcG9ydGVkVmlzaW9uID0gbXVsdGlwbGVNb2RlbENvbmZpZ3Muc29tZSgobW9kZWxDb25maWcpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFByb3ZpZGVyID0gdGV4dEdlbmVyYXRpb25Nb2RlbExpc3QuZmluZChtb2RlbEl0ZW0gPT4gbW9kZWxJdGVtLnByb3ZpZGVyID09PSBtb2RlbENvbmZpZy5wcm92aWRlcilcbiAgICAgICAgY29uc3QgY3VycmVudE1vZGVsID0gY3VycmVudFByb3ZpZGVyPy5tb2RlbHMuZmluZChtb2RlbCA9PiBtb2RlbC5tb2RlbCA9PT0gbW9kZWxDb25maWcubW9kZWwpXG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRNb2RlbD8uZmVhdHVyZXM/LmluY2x1ZGVzKE1vZGVsRmVhdHVyZUVudW0udmlzaW9uKVxuICAgICAgfSlcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZmVhdHVyZXMsXG4gICAgICAgIHNldEZlYXR1cmVzLFxuICAgICAgfSA9IGZlYXR1cmVzU3RvcmUhLmdldFN0YXRlKClcblxuICAgICAgY29uc3QgbmV3RmVhdHVyZXMgPSBwcm9kdWNlKGZlYXR1cmVzLCAoZHJhZnQpID0+IHtcbiAgICAgICAgZHJhZnQuZmlsZSA9IHtcbiAgICAgICAgICAuLi5kcmFmdC5maWxlLFxuICAgICAgICAgIGVuYWJsZWQ6IHN1cHBvcnRlZFZpc2lvbixcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHNldEZlYXR1cmVzKG5ld0ZlYXR1cmVzKVxuICAgIH1cbiAgfSwgW2RlYnVnV2l0aE11bHRpcGxlTW9kZWwsIGZlYXR1cmVzU3RvcmUsIG1vZGUsIG11bHRpcGxlTW9kZWxDb25maWdzLCB0ZXh0R2VuZXJhdGlvbk1vZGVsTGlzdF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBoYW5kbGVWaXNpb25Db25maWdJbk11bHRpcGxlTW9kZWwoKVxuICB9LCBbbXVsdGlwbGVNb2RlbENvbmZpZ3MsIG1vZGUsIGhhbmRsZVZpc2lvbkNvbmZpZ0luTXVsdGlwbGVNb2RlbF0pXG5cbiAgY29uc3QgeyBjdXJyZW50TG9nSXRlbSwgc2V0Q3VycmVudExvZ0l0ZW0sIHNob3dQcm9tcHRMb2dNb2RhbCwgc2V0U2hvd1Byb21wdExvZ01vZGFsLCBzaG93QWdlbnRMb2dNb2RhbCwgc2V0U2hvd0FnZW50TG9nTW9kYWwgfSA9IHVzZUFwcFN0b3JlKHVzZVNoYWxsb3coc3RhdGUgPT4gKHtcbiAgICBjdXJyZW50TG9nSXRlbTogc3RhdGUuY3VycmVudExvZ0l0ZW0sXG4gICAgc2V0Q3VycmVudExvZ0l0ZW06IHN0YXRlLnNldEN1cnJlbnRMb2dJdGVtLFxuICAgIHNob3dQcm9tcHRMb2dNb2RhbDogc3RhdGUuc2hvd1Byb21wdExvZ01vZGFsLFxuICAgIHNldFNob3dQcm9tcHRMb2dNb2RhbDogc3RhdGUuc2V0U2hvd1Byb21wdExvZ01vZGFsLFxuICAgIHNob3dBZ2VudExvZ01vZGFsOiBzdGF0ZS5zaG93QWdlbnRMb2dNb2RhbCxcbiAgICBzZXRTaG93QWdlbnRMb2dNb2RhbDogc3RhdGUuc2V0U2hvd0FnZW50TG9nTW9kYWwsXG4gIH0pKSlcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKVxuICBjb25zdCByZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG5cbiAgY29uc3QgYWRqdXN0TW9kYWxXaWR0aCA9ICgpID0+IHtcbiAgICBpZiAocmVmLmN1cnJlbnQpXG4gICAgICBzZXRXaWR0aChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gKHJlZi5jdXJyZW50Py5jbGllbnRXaWR0aCArIDE2KSAtIDgpXG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFkanVzdE1vZGFsV2lkdGgoKVxuICB9LCBbXSlcblxuICBjb25zdCBbZXhwYW5kZWQsIHNldEV4cGFuZGVkXSA9IHVzZVN0YXRlKHRydWUpXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaHJpbmstMFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC00IHBiLTIgcHQtM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhsLXNlbWlib2xkIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoJ2lucHV0cy50aXRsZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsXG4gICAgICAgICAgICAgICAgPyAoXG4gICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImdob3N0LWFjY2VudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbk11bHRpcGxlTW9kZWxDb25maWdzQ2hhbmdlKHRydWUsIFsuLi5tdWx0aXBsZU1vZGVsQ29uZmlncywgeyBpZDogYCR7RGF0ZS5ub3coKX1gLCBtb2RlbDogJycsIHByb3ZpZGVyOiAnJywgcGFyYW1ldGVyczoge30gfV0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e211bHRpcGxlTW9kZWxDb25maWdzLmxlbmd0aCA+PSA0fVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxSaUFkZExpbmUgY2xhc3NOYW1lPVwibXItMSBoLTMuNSB3LTMuNVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnbW9kZWxQcm92aWRlci5hZGRNb2RlbCcsIHsgbnM6ICdjb21tb24nIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICAgICAge211bHRpcGxlTW9kZWxDb25maWdzLmxlbmd0aH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC80KVxuICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtMiBoLVsxNHB4XSB3LVsxcHhdIGJnLWRpdmlkZXItcmVndWxhclwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAge21vZGUgIT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04gJiYgKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxUb29sdGlwUGx1c1xuICAgICAgICAgICAgICAgICAgcG9wdXBDb250ZW50PXt0KCdvcGVyYXRpb24ucmVmcmVzaCcsIHsgbnM6ICdjb21tb24nIH0pfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxBY3Rpb25CdXR0b24gb25DbGljaz17Y2xlYXJDb252ZXJzYXRpb259PlxuICAgICAgICAgICAgICAgICAgICA8UmVmcmVzaENjdzAxIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9BY3Rpb25CdXR0b24+XG4gICAgICAgICAgICAgICAgPC9Ub29sdGlwUGx1cz5cbiAgICAgICAgICAgICAgICB7dmFyTGlzdC5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbWwtMSBtci0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxUb29sdGlwUGx1c1xuICAgICAgICAgICAgICAgICAgICAgIHBvcHVwQ29udGVudD17dCgncGFuZWwudXNlcklucHV0RmllbGQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPEFjdGlvbkJ1dHRvbiBzdGF0ZT17ZXhwYW5kZWQgPyBBY3Rpb25CdXR0b25TdGF0ZS5BY3RpdmUgOiB1bmRlZmluZWR9IG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkKCFleHBhbmRlZCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPFJpRXF1YWxpemVyMkxpbmUgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9BY3Rpb25CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvVG9vbHRpcFBsdXM+XG4gICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCAmJiA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS1bLTE0cHhdIHJpZ2h0LVs1cHhdIHotMTAgaC0zIHctMyByb3RhdGUtNDUgYm9yZGVyLWwtWzAuNXB4XSBib3JkZXItdC1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1vbi1wYW5lbC1pdGVtLWJnXCIgLz59XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7bW9kZSAhPT0gQXBwTW9kZUVudW0uQ09NUExFVElPTiAmJiBleHBhbmRlZCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteC0zXCI+XG4gICAgICAgICAgICA8Q2hhdFVzZXJJbnB1dCBpbnB1dHM9e2lucHV0c30gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge21vZGUgPT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04gJiYgKFxuICAgICAgICAgIDxQcm9tcHRWYWx1ZVBhbmVsXG4gICAgICAgICAgICBhcHBUeXBlPXttb2RlIGFzIEFwcE1vZGVFbnVtfVxuICAgICAgICAgICAgb25TZW5kPXtoYW5kbGVTZW5kVGV4dENvbXBsZXRpb259XG4gICAgICAgICAgICBpbnB1dHM9e2lucHV0c31cbiAgICAgICAgICAgIHZpc2lvbkNvbmZpZz17e1xuICAgICAgICAgICAgICAuLi5mZWF0dXJlcy5maWxlISBhcyBWaXNpb25TZXR0aW5ncyxcbiAgICAgICAgICAgICAgdHJhbnNmZXJfbWV0aG9kczogZmVhdHVyZXMuZmlsZSEuYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzIHx8IFtdLFxuICAgICAgICAgICAgICBpbWFnZV9maWxlX3NpemVfbGltaXQ6IGZlYXR1cmVzLmZpbGU/LmZpbGVVcGxvYWRDb25maWc/LmltYWdlX2ZpbGVfc2l6ZV9saW1pdCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvblZpc2lvbkZpbGVzQ2hhbmdlPXtzZXRDb21wbGV0aW9uRmlsZXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAge1xuICAgICAgICBkZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTMgZ3JvdyBvdmVyZmxvdy1oaWRkZW5cIiByZWY9e3JlZn0+XG4gICAgICAgICAgICA8RGVidWdXaXRoTXVsdGlwbGVNb2RlbFxuICAgICAgICAgICAgICBtdWx0aXBsZU1vZGVsQ29uZmlncz17bXVsdGlwbGVNb2RlbENvbmZpZ3N9XG4gICAgICAgICAgICAgIG9uTXVsdGlwbGVNb2RlbENvbmZpZ3NDaGFuZ2U9e29uTXVsdGlwbGVNb2RlbENvbmZpZ3NDaGFuZ2V9XG4gICAgICAgICAgICAgIG9uRGVidWdXaXRoTXVsdGlwbGVNb2RlbENoYW5nZT17aGFuZGxlQ2hhbmdlVG9TaW5nbGVNb2RlbH1cbiAgICAgICAgICAgICAgY2hlY2tDYW5TZW5kPXtjaGVja0NhblNlbmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge3Nob3dQcm9tcHRMb2dNb2RhbCAmJiAoXG4gICAgICAgICAgICAgIDxQcm9tcHRMb2dNb2RhbFxuICAgICAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgICAgICBjdXJyZW50TG9nSXRlbT17Y3VycmVudExvZ0l0ZW19XG4gICAgICAgICAgICAgICAgb25DYW5jZWw9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnRMb2dJdGVtKClcbiAgICAgICAgICAgICAgICAgIHNldFNob3dQcm9tcHRMb2dNb2RhbChmYWxzZSlcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtzaG93QWdlbnRMb2dNb2RhbCAmJiAoXG4gICAgICAgICAgICAgIDxBZ2VudExvZ01vZGFsXG4gICAgICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgICAgIGN1cnJlbnRMb2dJdGVtPXtjdXJyZW50TG9nSXRlbX1cbiAgICAgICAgICAgICAgICBvbkNhbmNlbD17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudExvZ0l0ZW0oKVxuICAgICAgICAgICAgICAgICAgc2V0U2hvd0FnZW50TG9nTW9kYWwoZmFsc2UpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgIWRlYnVnV2l0aE11bHRpcGxlTW9kZWwgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGZsZXgtY29sXCIgcmVmPXtyZWZ9PlxuICAgICAgICAgICAgey8qIENoYXQgKi99XG4gICAgICAgICAgICB7bW9kZSAhPT0gQXBwTW9kZUVudW0uQ09NUExFVElPTiAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0wIGdyb3cgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICAgICAgPERlYnVnV2l0aFNpbmdsZU1vZGVsXG4gICAgICAgICAgICAgICAgICByZWY9e2RlYnVnV2l0aFNpbmdsZU1vZGVsUmVmfVxuICAgICAgICAgICAgICAgICAgY2hlY2tDYW5TZW5kPXtjaGVja0NhblNlbmR9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgey8qIFRleHQgIEdlbmVyYXRpb24gKi99XG4gICAgICAgICAgICB7bW9kZSA9PT0gQXBwTW9kZUVudW0uQ09NUExFVElPTiAmJiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgeyhjb21wbGV0aW9uUmVzIHx8IGlzUmVzcG9uZGluZykgJiYgKFxuICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteC00IG10LTNcIj48R3JvdXBOYW1lIG5hbWU9e3QoJ3Jlc3VsdCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9IC8+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtMyBtYi04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRHZW5lcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtdC0yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ9e2NvbXBsZXRpb25SZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xvYWRpbmc9eyFjb21wbGV0aW9uUmVzICYmIGlzUmVzcG9uZGluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2hvd1RleHRUb1NwZWVjaD17dGV4dFRvU3BlZWNoQ29uZmlnLmVuYWJsZWQgJiYgISF0ZXh0MnNwZWVjaERlZmF1bHRNb2RlbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzcG9uZGluZz17aXNSZXNwb25kaW5nfVxuICAgICAgICAgICAgICAgICAgICAgICAgaXNJbnN0YWxsZWRBcHA9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUlkPXttZXNzYWdlSWR9XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Vycm9yPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUmV0cnk9e25vb3B9XG4gICAgICAgICAgICAgICAgICAgICAgICBzaXRlSW5mbz17bnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgeyFjb21wbGV0aW9uUmVzICYmICFpc1Jlc3BvbmRpbmcgJiYgKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdyb3cgZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxSaVNwYXJrbGluZ0ZpbGwgY2xhc3NOYW1lPVwiaC0xMiB3LTEyIHRleHQtdGV4dC1lbXB0eS1zdGF0ZS1pY29uXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtcXVhdGVybmFyeVwiPnt0KCdub1Jlc3VsdCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7bW9kZSA9PT0gQXBwTW9kZUVudW0uQ09NUExFVElPTiAmJiBzaG93UHJvbXB0TG9nTW9kYWwgJiYgKFxuICAgICAgICAgICAgICA8UHJvbXB0TG9nTW9kYWxcbiAgICAgICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICAgICAgY3VycmVudExvZ0l0ZW09e2N1cnJlbnRMb2dJdGVtfVxuICAgICAgICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRDdXJyZW50TG9nSXRlbSgpXG4gICAgICAgICAgICAgICAgICBzZXRTaG93UHJvbXB0TG9nTW9kYWwoZmFsc2UpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7aXNTaG93Q2Fubm90UXVlcnlEYXRhc2V0ICYmIChcbiAgICAgICAgICAgICAgPENhbm5vdFF1ZXJ5RGF0YXNldFxuICAgICAgICAgICAgICAgIG9uQ29uZmlybT17KCkgPT4gc2V0U2hvd0Nhbm5vdFF1ZXJ5RGF0YXNldChmYWxzZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgICB9XG4gICAgICB7aXNTaG93Rm9ybWF0dGluZ0NoYW5nZUNvbmZpcm0gJiYgKFxuICAgICAgICA8Rm9ybWF0dGluZ0NoYW5nZWRcbiAgICAgICAgICBvbkNvbmZpcm09e2hhbmRsZUNvbmZpcm19XG4gICAgICAgICAgb25DYW5jZWw9e2hhbmRsZUNhbmNlbH1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7IWlzQVBJS2V5U2V0ICYmICg8SGFzTm90U2V0QVBJS0VZIGlzVHJhaWxGaW5pc2hlZD17IUlTX0NFX0VESVRJT059IG9uU2V0dGluZz17b25TZXR0aW5nfSAvPil9XG4gICAgPC8+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oRGVidWcpXG4iXX0=