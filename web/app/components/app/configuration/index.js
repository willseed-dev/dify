"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const solid_1 = require("@heroicons/react/20/solid");
const ahooks_1 = require("ahooks");
const object_1 = require("es-toolkit/object");
const predicate_1 = require("es-toolkit/predicate");
const immer_1 = require("immer");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const shallow_1 = require("zustand/react/shallow");
const features_wrapper_1 = require("@/app/components/app/app-publisher/features-wrapper");
const config_1 = require("@/app/components/app/configuration/config");
const edit_modal_1 = require("@/app/components/app/configuration/config-prompt/conversation-history/edit-modal");
const agent_setting_button_1 = require("@/app/components/app/configuration/config/agent-setting-button");
const select_dataset_1 = require("@/app/components/app/configuration/dataset-config/select-dataset");
const debug_1 = require("@/app/components/app/configuration/debug");
const hooks_1 = require("@/app/components/app/configuration/debug/hooks");
const use_advanced_prompt_config_1 = require("@/app/components/app/configuration/hooks/use-advanced-prompt-config");
const store_1 = require("@/app/components/app/store");
const button_1 = require("@/app/components/base/button");
const confirm_1 = require("@/app/components/base/confirm");
const divider_1 = require("@/app/components/base/divider");
const drawer_1 = require("@/app/components/base/drawer");
const features_1 = require("@/app/components/base/features");
const new_feature_panel_1 = require("@/app/components/base/features/new-feature-panel");
const loading_1 = require("@/app/components/base/loading");
const constants_1 = require("@/app/components/base/prompt-editor/constants");
const toast_1 = require("@/app/components/base/toast");
const constants_2 = require("@/app/components/header/account-setting/constants");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_2 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const model_parameter_modal_1 = require("@/app/components/header/account-setting/model-provider-page/model-parameter-modal");
const utils_1 = require("@/app/components/workflow/nodes/knowledge-retrieval/utils");
const plugin_dependency_1 = require("@/app/components/workflow/plugin-dependency");
const types_1 = require("@/app/components/workflow/types");
const config_2 = require("@/config");
const app_context_1 = require("@/context/app-context");
const debug_configuration_1 = require("@/context/debug-configuration");
const mitt_context_1 = require("@/context/mitt-context");
const modal_context_1 = require("@/context/modal-context");
const provider_context_1 = require("@/context/provider-context");
const use_breakpoints_1 = require("@/hooks/use-breakpoints");
const debug_2 = require("@/models/debug");
const apps_1 = require("@/service/apps");
const datasets_1 = require("@/service/datasets");
const tools_1 = require("@/service/tools");
const use_common_1 = require("@/service/use-common");
const app_1 = require("@/types/app");
const utils_2 = require("@/utils");
const completion_params_1 = require("@/utils/completion-params");
const model_config_1 = require("@/utils/model-config");
const tool_call_1 = require("@/utils/tool-call");
const var_1 = require("@/utils/var");
const Configuration = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const { isLoadingCurrentWorkspace, currentWorkspace } = (0, app_context_1.useAppContext)();
    const { appDetail, showAppConfigureFeaturesModal, setAppSidebarExpand, setShowAppConfigureFeaturesModal } = (0, store_1.useStore)((0, shallow_1.useShallow)(state => ({
        appDetail: state.appDetail,
        setAppSidebarExpand: state.setAppSidebarExpand,
        showAppConfigureFeaturesModal: state.showAppConfigureFeaturesModal,
        setShowAppConfigureFeaturesModal: state.setShowAppConfigureFeaturesModal,
    })));
    const { data: fileUploadConfigResponse } = (0, use_common_1.useFileUploadConfig)();
    const latestPublishedAt = (0, react_1.useMemo)(() => appDetail?.model_config?.updated_at, [appDetail]);
    const [formattingChanged, setFormattingChanged] = (0, react_1.useState)(false);
    const { setShowAccountSettingModal } = (0, modal_context_1.useModalContext)();
    const [hasFetchedDetail, setHasFetchedDetail] = (0, react_1.useState)(false);
    const isLoading = !hasFetchedDetail;
    const pathname = (0, navigation_1.usePathname)();
    const matched = pathname.match(/\/app\/([^/]+)/);
    const appId = (matched?.length && matched[1]) ? matched[1] : '';
    const [mode, setMode] = (0, react_1.useState)(app_1.AppModeEnum.CHAT);
    const [publishedConfig, setPublishedConfig] = (0, react_1.useState)(null);
    const [conversationId, setConversationId] = (0, react_1.useState)('');
    const media = (0, use_breakpoints_1.default)();
    const isMobile = media === use_breakpoints_1.MediaType.mobile;
    const [isShowDebugPanel, { setTrue: showDebugPanel, setFalse: hideDebugPanel }] = (0, ahooks_1.useBoolean)(false);
    const [introduction, setIntroduction] = (0, react_1.useState)('');
    const [suggestedQuestions, setSuggestedQuestions] = (0, react_1.useState)([]);
    const [controlClearChatMessage, setControlClearChatMessage] = (0, react_1.useState)(0);
    const [prevPromptConfig, setPrevPromptConfig] = (0, react_1.useState)({
        prompt_template: '',
        prompt_variables: [],
    });
    const [moreLikeThisConfig, setMoreLikeThisConfig] = (0, react_1.useState)({
        enabled: false,
    });
    const [suggestedQuestionsAfterAnswerConfig, setSuggestedQuestionsAfterAnswerConfig] = (0, react_1.useState)({
        enabled: false,
    });
    const [speechToTextConfig, setSpeechToTextConfig] = (0, react_1.useState)({
        enabled: false,
    });
    const [textToSpeechConfig, setTextToSpeechConfig] = (0, react_1.useState)({
        enabled: false,
        voice: '',
        language: '',
    });
    const [citationConfig, setCitationConfig] = (0, react_1.useState)({
        enabled: false,
    });
    const [annotationConfig, doSetAnnotationConfig] = (0, react_1.useState)({
        id: '',
        enabled: false,
        score_threshold: config_2.ANNOTATION_DEFAULT.score_threshold,
        embedding_model: {
            embedding_provider_name: '',
            embedding_model_name: '',
        },
    });
    const formattingChangedDispatcher = (0, hooks_1.useFormattingChangedDispatcher)();
    const setAnnotationConfig = (config, notSetFormatChanged) => {
        doSetAnnotationConfig(config);
        if (!notSetFormatChanged)
            formattingChangedDispatcher();
    };
    const [moderationConfig, setModerationConfig] = (0, react_1.useState)({
        enabled: false,
    });
    const [externalDataToolsConfig, setExternalDataToolsConfig] = (0, react_1.useState)([]);
    const [inputs, setInputs] = (0, react_1.useState)({});
    const [query, setQuery] = (0, react_1.useState)('');
    const [completionParams, doSetCompletionParams] = (0, react_1.useState)({});
    const [_, setTempStop, getTempStop] = (0, ahooks_1.useGetState)([]);
    const setCompletionParams = (value) => {
        const params = { ...value };
        // eslint-disable-next-line ts/no-use-before-define
        if ((!params.stop || params.stop.length === 0) && (modeModeTypeRef.current === app_1.ModelModeType.completion)) {
            params.stop = getTempStop();
            setTempStop([]);
        }
        doSetCompletionParams(params);
    };
    const [modelConfig, doSetModelConfig] = (0, react_1.useState)({
        provider: 'langgenius/openai/openai',
        model_id: 'gpt-3.5-turbo',
        mode: app_1.ModelModeType.unset,
        configs: {
            prompt_template: '',
            prompt_variables: [],
        },
        chat_prompt_config: (0, object_1.clone)(config_2.DEFAULT_CHAT_PROMPT_CONFIG),
        completion_prompt_config: (0, object_1.clone)(config_2.DEFAULT_COMPLETION_PROMPT_CONFIG),
        more_like_this: null,
        opening_statement: '',
        suggested_questions: [],
        sensitive_word_avoidance: null,
        speech_to_text: null,
        text_to_speech: null,
        file_upload: null,
        suggested_questions_after_answer: null,
        retriever_resource: null,
        annotation_reply: null,
        external_data_tools: [],
        system_parameters: {
            audio_file_size_limit: 0,
            file_size_limit: 0,
            image_file_size_limit: 0,
            video_file_size_limit: 0,
            workflow_file_upload_limit: 0,
        },
        dataSets: [],
        agentConfig: config_2.DEFAULT_AGENT_SETTING,
    });
    const isAgent = mode === app_1.AppModeEnum.AGENT_CHAT;
    const isOpenAI = modelConfig.provider === 'langgenius/openai/openai';
    const [collectionList, setCollectionList] = (0, react_1.useState)([]);
    const [datasetConfigs, doSetDatasetConfigs] = (0, react_1.useState)({
        retrieval_model: app_1.RETRIEVE_TYPE.multiWay,
        reranking_model: {
            reranking_provider_name: '',
            reranking_model_name: '',
        },
        top_k: config_2.DATASET_DEFAULT.top_k,
        score_threshold_enabled: false,
        score_threshold: config_2.DATASET_DEFAULT.score_threshold,
        datasets: {
            datasets: [],
        },
    });
    const datasetConfigsRef = (0, react_1.useRef)(datasetConfigs);
    const setDatasetConfigs = (0, react_1.useCallback)((newDatasetConfigs) => {
        doSetDatasetConfigs(newDatasetConfigs);
        datasetConfigsRef.current = newDatasetConfigs;
    }, []);
    const setModelConfig = (newModelConfig) => {
        doSetModelConfig(newModelConfig);
    };
    const modelModeType = modelConfig.mode;
    const modeModeTypeRef = (0, react_1.useRef)(modelModeType);
    (0, react_1.useEffect)(() => {
        modeModeTypeRef.current = modelModeType;
    }, [modelModeType]);
    const [dataSets, setDataSets] = (0, react_1.useState)([]);
    const contextVar = modelConfig.configs.prompt_variables.find(item => item.is_context_var)?.key;
    const hasSetContextVar = !!contextVar;
    const [isShowSelectDataSet, { setTrue: showSelectDataSet, setFalse: hideSelectDataSet }] = (0, ahooks_1.useBoolean)(false);
    const selectedIds = dataSets.map(item => item.id);
    const [rerankSettingModalOpen, setRerankSettingModalOpen] = (0, react_1.useState)(false);
    const { currentModel: currentRerankModel, currentProvider: currentRerankProvider, } = (0, hooks_2.useModelListAndDefaultModelAndCurrentProviderAndModel)(declarations_1.ModelTypeEnum.rerank);
    const handleSelect = (data) => {
        if ((0, predicate_1.isEqual)(data.map(item => item.id), dataSets.map(item => item.id))) {
            hideSelectDataSet();
            return;
        }
        formattingChangedDispatcher();
        let newDatasets = data;
        if (data.find(item => !item.name)) { // has not loaded selected dataset
            const newSelected = (0, immer_1.produce)(data, (draft) => {
                data.forEach((item, index) => {
                    if (!item.name) { // not fetched database
                        const newItem = dataSets.find(i => i.id === item.id);
                        if (newItem)
                            draft[index] = newItem;
                    }
                });
            });
            setDataSets(newSelected);
            newDatasets = newSelected;
        }
        else {
            setDataSets(data);
        }
        hideSelectDataSet();
        const { allExternal, allInternal, mixtureInternalAndExternal, mixtureHighQualityAndEconomic, inconsistentEmbeddingModel, } = (0, utils_1.getSelectedDatasetsMode)(newDatasets);
        if ((allInternal && (mixtureHighQualityAndEconomic || inconsistentEmbeddingModel))
            || mixtureInternalAndExternal
            || allExternal) {
            setRerankSettingModalOpen(true);
        }
        const { datasets, retrieval_model, score_threshold_enabled, ...restConfigs } = datasetConfigs;
        const { top_k, score_threshold, reranking_model, reranking_mode, weights, reranking_enable, } = restConfigs;
        const oldRetrievalConfig = {
            top_k,
            score_threshold,
            reranking_model: (reranking_model?.reranking_provider_name && reranking_model?.reranking_model_name)
                ? {
                    provider: reranking_model.reranking_provider_name,
                    model: reranking_model.reranking_model_name,
                }
                : undefined,
            reranking_mode,
            weights,
            reranking_enable,
        };
        const retrievalConfig = (0, utils_1.getMultipleRetrievalConfig)(oldRetrievalConfig, newDatasets, dataSets, {
            provider: currentRerankProvider?.provider,
            model: currentRerankModel?.model,
        });
        setDatasetConfigs({
            ...datasetConfigsRef.current,
            ...retrievalConfig,
            reranking_model: {
                reranking_provider_name: retrievalConfig?.reranking_model?.provider || '',
                reranking_model_name: retrievalConfig?.reranking_model?.model || '',
            },
            retrieval_model,
            score_threshold_enabled,
            datasets,
        });
    };
    const [isShowHistoryModal, { setTrue: showHistoryModal, setFalse: hideHistoryModal }] = (0, ahooks_1.useBoolean)(false);
    const syncToPublishedConfig = (_publishedConfig) => {
        const modelConfig = _publishedConfig.modelConfig;
        setModelConfig(_publishedConfig.modelConfig);
        setCompletionParams(_publishedConfig.completionParams);
        setDataSets(modelConfig.dataSets || []);
        // reset feature
        setIntroduction(modelConfig.opening_statement);
        setMoreLikeThisConfig(modelConfig.more_like_this || {
            enabled: false,
        });
        setSuggestedQuestionsAfterAnswerConfig(modelConfig.suggested_questions_after_answer || {
            enabled: false,
        });
        setSpeechToTextConfig(modelConfig.speech_to_text || {
            enabled: false,
        });
        setTextToSpeechConfig(modelConfig.text_to_speech || {
            enabled: false,
            voice: '',
            language: '',
        });
        setCitationConfig(modelConfig.retriever_resource || {
            enabled: false,
        });
    };
    const { isAPIKeySet } = (0, provider_context_1.useProviderContext)();
    const { currentModel: currModel, textGenerationModelList, } = (0, hooks_2.useTextGenerationCurrentProviderAndModelAndModelList)({
        provider: modelConfig.provider,
        model: modelConfig.model_id,
    });
    const isFunctionCall = (0, tool_call_1.supportFunctionCall)(currModel?.features);
    // Fill old app data missing model mode.
    (0, react_1.useEffect)(() => {
        if (hasFetchedDetail && !modelModeType) {
            const mode = currModel?.model_properties.mode;
            if (mode) {
                const newModelConfig = (0, immer_1.produce)(modelConfig, (draft) => {
                    draft.mode = mode;
                });
                setModelConfig(newModelConfig);
            }
        }
    }, [textGenerationModelList, hasFetchedDetail, modelModeType, currModel, modelConfig]);
    const [promptMode, doSetPromptMode] = (0, react_1.useState)(debug_2.PromptMode.simple);
    const isAdvancedMode = promptMode === debug_2.PromptMode.advanced;
    const [canReturnToSimpleMode, setCanReturnToSimpleMode] = (0, react_1.useState)(true);
    const setPromptMode = async (mode) => {
        if (mode === debug_2.PromptMode.advanced) {
            // eslint-disable-next-line ts/no-use-before-define
            await migrateToDefaultPrompt();
            setCanReturnToSimpleMode(true);
        }
        doSetPromptMode(mode);
    };
    const [visionConfig, doSetVisionConfig] = (0, react_1.useState)({
        enabled: false,
        number_limits: 2,
        detail: app_1.Resolution.low,
        transfer_methods: [app_1.TransferMethod.local_file],
    });
    const handleSetVisionConfig = (config, notNoticeFormattingChanged) => {
        doSetVisionConfig({
            enabled: config.enabled || false,
            number_limits: config.number_limits || 2,
            detail: config.detail || app_1.Resolution.low,
            transfer_methods: config.transfer_methods || [app_1.TransferMethod.local_file],
        });
        if (!notNoticeFormattingChanged)
            formattingChangedDispatcher();
    };
    const { chatPromptConfig, setChatPromptConfig, completionPromptConfig, setCompletionPromptConfig, currentAdvancedPrompt, setCurrentAdvancedPrompt, hasSetBlockStatus, setConversationHistoriesRole, migrateToDefaultPrompt, } = (0, use_advanced_prompt_config_1.default)({
        appMode: mode,
        modelName: modelConfig.model_id,
        promptMode,
        modelModeType,
        prePrompt: modelConfig.configs.prompt_template,
        hasSetDataSet: dataSets.length > 0,
        onUserChangedPrompt: () => {
            setCanReturnToSimpleMode(false);
        },
        completionParams,
        setCompletionParams,
        setStop: setTempStop,
    });
    const setModel = async ({ modelId, provider, mode: modeMode, features, }) => {
        if (isAdvancedMode) {
            const appMode = mode;
            if (modeMode === app_1.ModelModeType.completion) {
                if (appMode !== app_1.AppModeEnum.COMPLETION) {
                    if (!completionPromptConfig.prompt?.text || !completionPromptConfig.conversation_histories_role.assistant_prefix || !completionPromptConfig.conversation_histories_role.user_prefix)
                        await migrateToDefaultPrompt(true, app_1.ModelModeType.completion);
                }
                else {
                    if (!completionPromptConfig.prompt?.text)
                        await migrateToDefaultPrompt(true, app_1.ModelModeType.completion);
                }
            }
            if (modeMode === app_1.ModelModeType.chat) {
                if (chatPromptConfig.prompt.length === 0)
                    await migrateToDefaultPrompt(true, app_1.ModelModeType.chat);
            }
        }
        const newModelConfig = (0, immer_1.produce)(modelConfig, (draft) => {
            draft.provider = provider;
            draft.model_id = modelId;
            draft.mode = modeMode;
        });
        setModelConfig(newModelConfig);
        const supportVision = features && features.includes(declarations_1.ModelFeatureEnum.vision);
        handleSetVisionConfig({
            ...visionConfig,
            enabled: supportVision,
        }, true);
        try {
            const { params: filtered, removedDetails } = await (0, completion_params_1.fetchAndMergeValidCompletionParams)(provider, modelId, completionParams, isAdvancedMode);
            if (Object.keys(removedDetails).length)
                toast_1.default.notify({ type: 'warning', message: `${t('modelProvider.parametersInvalidRemoved', { ns: 'common' })}: ${Object.entries(removedDetails).map(([k, reason]) => `${k} (${reason})`).join(', ')}` });
            setCompletionParams(filtered);
        }
        catch {
            toast_1.default.notify({ type: 'error', message: t('error', { ns: 'common' }) });
            setCompletionParams({});
        }
    };
    const isShowVisionConfig = !!currModel?.features?.includes(declarations_1.ModelFeatureEnum.vision);
    const isShowDocumentConfig = !!currModel?.features?.includes(declarations_1.ModelFeatureEnum.document);
    const isShowAudioConfig = !!currModel?.features?.includes(declarations_1.ModelFeatureEnum.audio);
    const isAllowVideoUpload = !!currModel?.features?.includes(declarations_1.ModelFeatureEnum.video);
    // *** web app features ***
    const featuresData = (0, react_1.useMemo)(() => {
        return {
            moreLikeThis: modelConfig.more_like_this || { enabled: false },
            opening: {
                enabled: !!modelConfig.opening_statement,
                opening_statement: modelConfig.opening_statement || '',
                suggested_questions: modelConfig.suggested_questions || [],
            },
            moderation: modelConfig.sensitive_word_avoidance || { enabled: false },
            speech2text: modelConfig.speech_to_text || { enabled: false },
            text2speech: modelConfig.text_to_speech || { enabled: false },
            file: {
                image: {
                    detail: modelConfig.file_upload?.image?.detail || app_1.Resolution.high,
                    enabled: !!modelConfig.file_upload?.image?.enabled,
                    number_limits: modelConfig.file_upload?.image?.number_limits || 3,
                    transfer_methods: modelConfig.file_upload?.image?.transfer_methods || ['local_file', 'remote_url'],
                },
                enabled: !!(modelConfig.file_upload?.enabled || modelConfig.file_upload?.image?.enabled),
                allowed_file_types: modelConfig.file_upload?.allowed_file_types || [],
                allowed_file_extensions: modelConfig.file_upload?.allowed_file_extensions || [...constants_1.FILE_EXTS[types_1.SupportUploadFileTypes.image], ...constants_1.FILE_EXTS[types_1.SupportUploadFileTypes.video]].map(ext => `.${ext}`),
                allowed_file_upload_methods: modelConfig.file_upload?.allowed_file_upload_methods || modelConfig.file_upload?.image?.transfer_methods || ['local_file', 'remote_url'],
                number_limits: modelConfig.file_upload?.number_limits || modelConfig.file_upload?.image?.number_limits || 3,
                fileUploadConfig: fileUploadConfigResponse,
            },
            suggested: modelConfig.suggested_questions_after_answer || { enabled: false },
            citation: modelConfig.retriever_resource || { enabled: false },
            annotationReply: modelConfig.annotation_reply || { enabled: false },
        };
    }, [fileUploadConfigResponse, modelConfig]);
    const handleFeaturesChange = (0, react_1.useCallback)((flag) => {
        setShowAppConfigureFeaturesModal(true);
        if (flag)
            formattingChangedDispatcher();
    }, [formattingChangedDispatcher, setShowAppConfigureFeaturesModal]);
    const handleAddPromptVariable = (0, react_1.useCallback)((variable) => {
        const newModelConfig = (0, immer_1.produce)(modelConfig, (draft) => {
            draft.configs.prompt_variables = [...draft.configs.prompt_variables, ...variable];
        });
        setModelConfig(newModelConfig);
    }, [modelConfig]);
    (0, react_1.useEffect)(() => {
        (async () => {
            const collectionList = await (0, tools_1.fetchCollectionList)();
            if (var_1.basePath) {
                collectionList.forEach((item) => {
                    if (typeof item.icon == 'string' && !item.icon.includes(var_1.basePath))
                        item.icon = `${var_1.basePath}${item.icon}`;
                });
            }
            setCollectionList(collectionList);
            const res = await (0, apps_1.fetchAppDetailDirect)({ url: '/apps', id: appId });
            setMode(res.mode);
            const modelConfig = res.model_config;
            const promptMode = modelConfig.prompt_type === debug_2.PromptMode.advanced ? debug_2.PromptMode.advanced : debug_2.PromptMode.simple;
            doSetPromptMode(promptMode);
            if (promptMode === debug_2.PromptMode.advanced) {
                if (modelConfig.chat_prompt_config && modelConfig.chat_prompt_config.prompt.length > 0)
                    setChatPromptConfig(modelConfig.chat_prompt_config);
                else
                    setChatPromptConfig((0, object_1.clone)(config_2.DEFAULT_CHAT_PROMPT_CONFIG));
                setCompletionPromptConfig(modelConfig.completion_prompt_config || (0, object_1.clone)(config_2.DEFAULT_COMPLETION_PROMPT_CONFIG));
                setCanReturnToSimpleMode(false);
            }
            const model = modelConfig.model;
            let datasets = null;
            // old dataset struct
            if (modelConfig.agent_mode?.tools?.find(({ dataset }) => dataset?.enabled))
                datasets = modelConfig.agent_mode?.tools.filter(({ dataset }) => dataset?.enabled);
            // new dataset struct
            else if (modelConfig.dataset_configs.datasets?.datasets?.length > 0)
                datasets = modelConfig.dataset_configs?.datasets?.datasets;
            if (dataSets && datasets?.length && datasets?.length > 0) {
                const { data: dataSetsWithDetail } = await (0, datasets_1.fetchDatasets)({ url: '/datasets', params: { page: 1, ids: datasets.map(({ dataset }) => dataset.id) } });
                datasets = dataSetsWithDetail;
                setDataSets(datasets);
            }
            setIntroduction(modelConfig.opening_statement);
            setSuggestedQuestions(modelConfig.suggested_questions || []);
            if (modelConfig.more_like_this)
                setMoreLikeThisConfig(modelConfig.more_like_this);
            if (modelConfig.suggested_questions_after_answer)
                setSuggestedQuestionsAfterAnswerConfig(modelConfig.suggested_questions_after_answer);
            if (modelConfig.speech_to_text)
                setSpeechToTextConfig(modelConfig.speech_to_text);
            if (modelConfig.text_to_speech)
                setTextToSpeechConfig(modelConfig.text_to_speech);
            if (modelConfig.retriever_resource)
                setCitationConfig(modelConfig.retriever_resource);
            if (modelConfig.annotation_reply) {
                let annotationConfig = modelConfig.annotation_reply;
                if (modelConfig.annotation_reply.enabled) {
                    annotationConfig = {
                        ...modelConfig.annotation_reply,
                        embedding_model: {
                            ...modelConfig.annotation_reply.embedding_model,
                            embedding_provider_name: (0, utils_2.correctModelProvider)(modelConfig.annotation_reply.embedding_model.embedding_provider_name),
                        },
                    };
                }
                setAnnotationConfig(annotationConfig, true);
            }
            if (modelConfig.sensitive_word_avoidance)
                setModerationConfig(modelConfig.sensitive_word_avoidance);
            if (modelConfig.external_data_tools)
                setExternalDataToolsConfig(modelConfig.external_data_tools);
            const config = {
                modelConfig: {
                    provider: (0, utils_2.correctModelProvider)(model.provider),
                    model_id: model.name,
                    mode: model.mode,
                    configs: {
                        prompt_template: modelConfig.pre_prompt || '',
                        prompt_variables: (0, model_config_1.userInputsFormToPromptVariables)(([
                            ...modelConfig.user_input_form,
                            ...(modelConfig.external_data_tools?.length
                                ? modelConfig.external_data_tools.map((item) => {
                                    return {
                                        external_data_tool: {
                                            variable: item.variable,
                                            label: item.label,
                                            enabled: item.enabled,
                                            type: item.type,
                                            config: item.config,
                                            required: true,
                                            icon: item.icon,
                                            icon_background: item.icon_background,
                                        },
                                    };
                                })
                                : []),
                        ]), modelConfig.dataset_query_variable),
                    },
                    more_like_this: modelConfig.more_like_this ?? { enabled: false },
                    opening_statement: modelConfig.opening_statement,
                    suggested_questions: modelConfig.suggested_questions ?? [],
                    sensitive_word_avoidance: modelConfig.sensitive_word_avoidance,
                    speech_to_text: modelConfig.speech_to_text,
                    text_to_speech: modelConfig.text_to_speech,
                    file_upload: modelConfig.file_upload ?? null,
                    suggested_questions_after_answer: modelConfig.suggested_questions_after_answer ?? { enabled: false },
                    retriever_resource: modelConfig.retriever_resource,
                    annotation_reply: modelConfig.annotation_reply ?? null,
                    external_data_tools: modelConfig.external_data_tools ?? [],
                    system_parameters: modelConfig.system_parameters,
                    dataSets: datasets || [],
                    agentConfig: res.mode === app_1.AppModeEnum.AGENT_CHAT ? {
                        max_iteration: config_2.DEFAULT_AGENT_SETTING.max_iteration,
                        ...modelConfig.agent_mode,
                        // remove dataset
                        enabled: true, // modelConfig.agent_mode?.enabled is not correct. old app: the value of app with dataset's is always true
                        tools: (modelConfig.agent_mode?.tools ?? []).filter((tool) => {
                            return !tool.dataset;
                        }).map((tool) => {
                            const toolInCollectionList = collectionList.find(c => tool.provider_id === c.id);
                            return {
                                ...tool,
                                isDeleted: res.deleted_tools?.some((deletedTool) => deletedTool.provider_id === tool.provider_id && deletedTool.tool_name === tool.tool_name) ?? false,
                                notAuthor: toolInCollectionList?.is_team_authorization === false,
                                ...(tool.provider_type === 'builtin'
                                    ? {
                                        provider_id: (0, utils_2.correctToolProvider)(tool.provider_name, !!toolInCollectionList),
                                        provider_name: (0, utils_2.correctToolProvider)(tool.provider_name, !!toolInCollectionList),
                                    }
                                    : {}),
                            };
                        }),
                        strategy: modelConfig.agent_mode?.strategy ?? app_1.AgentStrategy.react,
                    } : config_2.DEFAULT_AGENT_SETTING,
                },
                completionParams: model.completion_params,
            };
            if (modelConfig.file_upload)
                handleSetVisionConfig(modelConfig.file_upload.image, true);
            syncToPublishedConfig(config);
            setPublishedConfig(config);
            const retrievalConfig = (0, utils_1.getMultipleRetrievalConfig)({
                ...modelConfig.dataset_configs,
                reranking_model: modelConfig.dataset_configs.reranking_model && {
                    provider: modelConfig.dataset_configs.reranking_model.reranking_provider_name,
                    model: modelConfig.dataset_configs.reranking_model.reranking_model_name,
                },
            }, datasets, datasets, {
                provider: currentRerankProvider?.provider,
                model: currentRerankModel?.model,
            });
            const datasetConfigsToSet = {
                ...modelConfig.dataset_configs,
                ...retrievalConfig,
                ...(retrievalConfig.reranking_model
                    ? {
                        reranking_model: {
                            reranking_model_name: retrievalConfig.reranking_model.model,
                            reranking_provider_name: (0, utils_2.correctModelProvider)(retrievalConfig.reranking_model.provider),
                        },
                    }
                    : {}),
            };
            datasetConfigsToSet.retrieval_model = datasetConfigsToSet.retrieval_model ?? app_1.RETRIEVE_TYPE.multiWay;
            setDatasetConfigs(datasetConfigsToSet);
            setHasFetchedDetail(true);
        })();
    }, [appId]);
    const promptEmpty = (() => {
        if (mode !== app_1.AppModeEnum.COMPLETION)
            return false;
        if (isAdvancedMode) {
            if (modelModeType === app_1.ModelModeType.chat)
                return chatPromptConfig.prompt.every(({ text }) => !text);
            else
                return !completionPromptConfig.prompt?.text;
        }
        else {
            return !modelConfig.configs.prompt_template;
        }
    })();
    const cannotPublish = (() => {
        if (mode !== app_1.AppModeEnum.COMPLETION) {
            if (!isAdvancedMode)
                return false;
            if (modelModeType === app_1.ModelModeType.completion) {
                if (!hasSetBlockStatus.history || !hasSetBlockStatus.query)
                    return true;
                return false;
            }
            return false;
        }
        else {
            return promptEmpty;
        }
    })();
    const contextVarEmpty = mode === app_1.AppModeEnum.COMPLETION && dataSets.length > 0 && !hasSetContextVar;
    const onPublish = async (modelAndParameter, features) => {
        const modelId = modelAndParameter?.model || modelConfig.model_id;
        const promptTemplate = modelConfig.configs.prompt_template;
        const promptVariables = modelConfig.configs.prompt_variables;
        if (promptEmpty) {
            notify({ type: 'error', message: t('otherError.promptNoBeEmpty', { ns: 'appDebug' }) });
            return;
        }
        if (isAdvancedMode && mode !== app_1.AppModeEnum.COMPLETION) {
            if (modelModeType === app_1.ModelModeType.completion) {
                if (!hasSetBlockStatus.history) {
                    notify({ type: 'error', message: t('otherError.historyNoBeEmpty', { ns: 'appDebug' }) });
                    return;
                }
                if (!hasSetBlockStatus.query) {
                    notify({ type: 'error', message: t('otherError.queryNoBeEmpty', { ns: 'appDebug' }) });
                    return;
                }
            }
        }
        if (contextVarEmpty) {
            notify({ type: 'error', message: t('feature.dataSet.queryVariable.contextVarNotEmpty', { ns: 'appDebug' }) });
            return;
        }
        const postDatasets = dataSets.map(({ id }) => ({
            dataset: {
                enabled: true,
                id,
            },
        }));
        const fileUpload = { ...features?.file };
        delete fileUpload?.fileUploadConfig;
        // new model config data struct
        const data = {
            // Simple Mode prompt
            pre_prompt: !isAdvancedMode ? promptTemplate : '',
            prompt_type: promptMode,
            chat_prompt_config: isAdvancedMode ? chatPromptConfig : (0, object_1.clone)(config_2.DEFAULT_CHAT_PROMPT_CONFIG),
            completion_prompt_config: isAdvancedMode ? completionPromptConfig : (0, object_1.clone)(config_2.DEFAULT_COMPLETION_PROMPT_CONFIG),
            user_input_form: (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables),
            dataset_query_variable: contextVar || '',
            //  features
            more_like_this: features?.moreLikeThis,
            opening_statement: features?.opening?.enabled ? (features.opening?.opening_statement || '') : '',
            suggested_questions: features?.opening?.enabled ? (features.opening?.suggested_questions || []) : [],
            sensitive_word_avoidance: features?.moderation,
            speech_to_text: features?.speech2text,
            text_to_speech: features?.text2speech,
            file_upload: fileUpload,
            suggested_questions_after_answer: features?.suggested,
            retriever_resource: features?.citation,
            agent_mode: {
                ...modelConfig.agentConfig,
                strategy: isFunctionCall ? app_1.AgentStrategy.functionCall : app_1.AgentStrategy.react,
            },
            external_data_tools: externalDataToolsConfig,
            model: {
                provider: modelAndParameter?.provider || modelConfig.provider,
                name: modelId,
                mode: modelConfig.mode,
                completion_params: modelAndParameter?.parameters || completionParams,
            },
            dataset_configs: {
                ...datasetConfigs,
                datasets: {
                    datasets: [...postDatasets],
                },
            },
            system_parameters: modelConfig.system_parameters,
        };
        await (0, apps_1.updateAppModelConfig)({ url: `/apps/${appId}/model-config`, body: data });
        const newModelConfig = (0, immer_1.produce)(modelConfig, (draft) => {
            draft.opening_statement = introduction;
            draft.more_like_this = moreLikeThisConfig;
            draft.suggested_questions_after_answer = suggestedQuestionsAfterAnswerConfig;
            draft.speech_to_text = speechToTextConfig;
            draft.text_to_speech = textToSpeechConfig;
            draft.retriever_resource = citationConfig;
            draft.dataSets = dataSets;
        });
        setPublishedConfig({
            modelConfig: newModelConfig,
            completionParams,
        });
        notify({ type: 'success', message: t('api.success', { ns: 'common' }) });
        setCanReturnToSimpleMode(false);
        return true;
    };
    const [showUseGPT4Confirm, setShowUseGPT4Confirm] = (0, react_1.useState)(false);
    const { debugWithMultipleModel, multipleModelConfigs, handleMultipleModelConfigsChange, } = (0, hooks_1.useDebugWithSingleOrMultipleModel)(appId);
    const handleDebugWithMultipleModelChange = () => {
        handleMultipleModelConfigsChange(true, [
            { id: `${Date.now()}`, model: modelConfig.model_id, provider: modelConfig.provider, parameters: completionParams },
            { id: `${Date.now()}-no-repeat`, model: '', provider: '', parameters: {} },
        ]);
        setAppSidebarExpand('collapse');
    };
    if (isLoading || isLoadingCurrentWorkspace || !currentWorkspace.id) {
        return (<div className="flex h-full items-center justify-center">
        <loading_1.default type="area"/>
      </div>);
    }
    const value = {
        appId,
        isAPIKeySet,
        isTrailFinished: false,
        mode,
        modelModeType,
        promptMode,
        isAdvancedMode,
        isAgent,
        isOpenAI,
        isFunctionCall,
        collectionList,
        setPromptMode,
        canReturnToSimpleMode,
        setCanReturnToSimpleMode,
        chatPromptConfig,
        completionPromptConfig,
        currentAdvancedPrompt,
        setCurrentAdvancedPrompt,
        conversationHistoriesRole: completionPromptConfig.conversation_histories_role,
        showHistoryModal,
        setConversationHistoriesRole,
        hasSetBlockStatus,
        conversationId,
        introduction,
        setIntroduction,
        suggestedQuestions,
        setSuggestedQuestions,
        setConversationId,
        controlClearChatMessage,
        setControlClearChatMessage,
        prevPromptConfig,
        setPrevPromptConfig,
        moreLikeThisConfig,
        setMoreLikeThisConfig,
        suggestedQuestionsAfterAnswerConfig,
        setSuggestedQuestionsAfterAnswerConfig,
        speechToTextConfig,
        setSpeechToTextConfig,
        textToSpeechConfig,
        setTextToSpeechConfig,
        citationConfig,
        setCitationConfig,
        annotationConfig,
        setAnnotationConfig,
        moderationConfig,
        setModerationConfig,
        externalDataToolsConfig,
        setExternalDataToolsConfig,
        formattingChanged,
        setFormattingChanged,
        inputs,
        setInputs,
        query,
        setQuery,
        completionParams,
        setCompletionParams,
        modelConfig,
        setModelConfig,
        showSelectDataSet,
        dataSets,
        setDataSets,
        datasetConfigs,
        datasetConfigsRef,
        setDatasetConfigs,
        hasSetContextVar,
        isShowVisionConfig,
        visionConfig,
        setVisionConfig: handleSetVisionConfig,
        isAllowVideoUpload,
        isShowDocumentConfig,
        isShowAudioConfig,
        rerankSettingModalOpen,
        setRerankSettingModalOpen,
    };
    return (<debug_configuration_1.default.Provider value={value}>
      <features_1.FeaturesProvider features={featuresData}>
        <mitt_context_1.MittProvider>
          <div className="flex h-full flex-col">
            <div className="relative flex h-[200px] grow pt-14">
              {/* Header */}
              <div className="bg-default-subtle absolute left-0 top-0 h-14 w-full">
                <div className="flex h-14 items-center justify-between px-6">
                  <div className="flex items-center">
                    <div className="system-xl-semibold text-text-primary">{t('orchestrate', { ns: 'appDebug' })}</div>
                    <div className="flex h-[14px] items-center space-x-1 text-xs">
                      {isAdvancedMode && (<div className="system-xs-medium-uppercase ml-1 flex h-5 items-center rounded-md border border-components-button-secondary-border px-1.5 uppercase text-text-tertiary">{t('promptMode.advanced', { ns: 'appDebug' })}</div>)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {/* Agent Setting */}
                    {isAgent && (<agent_setting_button_1.default isChatModel={modelConfig.mode === app_1.ModelModeType.chat} agentConfig={modelConfig.agentConfig} isFunctionCall={isFunctionCall} onAgentSettingChange={(config) => {
                const nextConfig = (0, immer_1.produce)(modelConfig, (draft) => {
                    draft.agentConfig = config;
                });
                setModelConfig(nextConfig);
            }}/>)}
                    {/* Model and Parameters */}
                    {!debugWithMultipleModel && (<>
                        <model_parameter_modal_1.default isAdvancedMode={isAdvancedMode} provider={modelConfig.provider} completionParams={completionParams} modelId={modelConfig.model_id} setModel={setModel} onCompletionParamsChange={(newParams) => {
                setCompletionParams(newParams);
            }} debugWithMultipleModel={debugWithMultipleModel} onDebugWithMultipleModelChange={handleDebugWithMultipleModelChange}/>
                        <divider_1.default type="vertical" className="mx-2 h-[14px]"/>
                      </>)}
                    {isMobile && (<button_1.default className="mr-2 !h-8 !text-[13px] font-medium" onClick={showDebugPanel}>
                        <span className="mr-1">{t('operation.debugConfig', { ns: 'appDebug' })}</span>
                        <solid_1.CodeBracketIcon className="h-4 w-4 text-text-tertiary"/>
                      </button_1.default>)}
                    <features_wrapper_1.default {...{
        publishDisabled: cannotPublish,
        publishedAt: (latestPublishedAt || 0) * 1000,
        debugWithMultipleModel,
        multipleModelConfigs,
        onPublish,
        publishedConfig: publishedConfig,
        resetAppConfig: () => syncToPublishedConfig(publishedConfig),
    }}/>
                  </div>
                </div>
              </div>
              <div className={`flex h-full w-full shrink-0 flex-col sm:w-1/2 ${debugWithMultipleModel && 'max-w-[560px]'}`}>
                <config_1.default />
              </div>
              {!isMobile && (<div className="relative flex h-full w-1/2 grow flex-col overflow-y-auto " style={{ borderColor: 'rgba(0, 0, 0, 0.02)' }}>
                  <div className="flex grow flex-col rounded-tl-2xl border-l-[0.5px] border-t-[0.5px] border-components-panel-border bg-chatbot-bg ">
                    <debug_1.default isAPIKeySet={isAPIKeySet} onSetting={() => setShowAccountSettingModal({ payload: constants_2.ACCOUNT_SETTING_TAB.PROVIDER })} inputs={inputs} modelParameterParams={{
                setModel: setModel,
                onCompletionParamsChange: setCompletionParams,
            }} debugWithMultipleModel={debugWithMultipleModel} multipleModelConfigs={multipleModelConfigs} onMultipleModelConfigsChange={handleMultipleModelConfigsChange}/>
                  </div>
                </div>)}
            </div>
          </div>
          {showUseGPT4Confirm && (<confirm_1.default title={t('trailUseGPT4Info.title', { ns: 'appDebug' })} content={t('trailUseGPT4Info.description', { ns: 'appDebug' })} isShow={showUseGPT4Confirm} onConfirm={() => {
                setShowAccountSettingModal({ payload: constants_2.ACCOUNT_SETTING_TAB.PROVIDER });
                setShowUseGPT4Confirm(false);
            }} onCancel={() => setShowUseGPT4Confirm(false)}/>)}

          {isShowSelectDataSet && (<select_dataset_1.default isShow={isShowSelectDataSet} onClose={hideSelectDataSet} selectedIds={selectedIds} onSelect={handleSelect}/>)}

          {isShowHistoryModal && (<edit_modal_1.default isShow={isShowHistoryModal} saveLoading={false} onClose={hideHistoryModal} data={completionPromptConfig.conversation_histories_role} onSave={(data) => {
                setConversationHistoriesRole(data);
                hideHistoryModal();
            }}/>)}
          {isMobile && (<drawer_1.default showClose isOpen={isShowDebugPanel} onClose={hideDebugPanel} mask footer={null}>
              <debug_1.default isAPIKeySet={isAPIKeySet} onSetting={() => setShowAccountSettingModal({ payload: constants_2.ACCOUNT_SETTING_TAB.PROVIDER })} inputs={inputs} modelParameterParams={{
                setModel: setModel,
                onCompletionParamsChange: setCompletionParams,
            }} debugWithMultipleModel={debugWithMultipleModel} multipleModelConfigs={multipleModelConfigs} onMultipleModelConfigsChange={handleMultipleModelConfigsChange}/>
            </drawer_1.default>)}
          {showAppConfigureFeaturesModal && (<new_feature_panel_1.default show inWorkflow={false} showFileUpload={false} isChatMode={mode !== app_1.AppModeEnum.COMPLETION} disabled={false} onChange={handleFeaturesChange} onClose={() => setShowAppConfigureFeaturesModal(false)} promptVariables={modelConfig.configs.prompt_variables} onAutoAddPromptVariable={handleAddPromptVariable}/>)}
          <plugin_dependency_1.default />
        </mitt_context_1.MittProvider>
      </features_1.FeaturesProvider>
    </debug_configuration_1.default.Provider>);
};
exports.default = React.memo(Configuration);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFvQloscURBQTJEO0FBQzNELG1DQUFnRDtBQUNoRCw4Q0FBeUM7QUFDekMsb0RBQThDO0FBQzlDLGlDQUErQjtBQUMvQixnREFBNkM7QUFDN0MsK0JBQThCO0FBQzlCLGlDQUF5RTtBQUN6RSxpREFBOEM7QUFDOUMsK0RBQWlEO0FBQ2pELG1EQUFrRDtBQUNsRCwwRkFBOEU7QUFDOUUsc0VBQThEO0FBQzlELGlIQUErRztBQUMvRyx5R0FBK0Y7QUFDL0YscUdBQTRGO0FBQzVGLG9FQUE0RDtBQUM1RCwwRUFHdUQ7QUFDdkQsb0hBQXlHO0FBQ3pHLHNEQUFvRTtBQUNwRSx5REFBaUQ7QUFDakQsMkRBQW1EO0FBQ25ELDJEQUFtRDtBQUNuRCx5REFBaUQ7QUFDakQsNkRBQWlFO0FBQ2pFLHdGQUE4RTtBQUM5RSwyREFBbUQ7QUFDbkQsNkVBQXlFO0FBQ3pFLHVEQUFpRTtBQUNqRSxpRkFBdUY7QUFDdkYsMkdBQTBIO0FBQzFILDZGQUcwRTtBQUMxRSw2SEFBbUg7QUFDbkgscUZBR2tFO0FBQ2xFLG1GQUEwRTtBQUMxRSwyREFBd0U7QUFDeEUscUNBQW1KO0FBQ25KLHVEQUFxRDtBQUNyRCx1RUFBeUQ7QUFDekQseURBQXFEO0FBQ3JELDJEQUF5RDtBQUN6RCxpRUFBK0Q7QUFDL0QsNkRBQW1FO0FBQ25FLDBDQUEyQztBQUMzQyx5Q0FBMkU7QUFDM0UsaURBQWtEO0FBQ2xELDJDQUFxRDtBQUNyRCxxREFBMEQ7QUFDMUQscUNBQWtIO0FBQ2xILG1DQUdnQjtBQUNoQixpRUFBOEU7QUFDOUUsdURBQXVHO0FBQ3ZHLGlEQUF1RDtBQUN2RCxxQ0FBc0M7QUFPdEMsTUFBTSxhQUFhLEdBQU8sR0FBRyxFQUFFO0lBQzdCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5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QVcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FDdEQsdUJBQXVCLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxFQUNqRCxDQUNILENBQ0Q7VUFBQSxDQUFDLDJCQUFnQixDQUFDLEFBQUQsRUFDbkI7UUFBQSxFQUFFLDJCQUFZLENBQ2hCO01BQUEsRUFBRSwyQkFBZ0IsQ0FDcEI7SUFBQSxFQUFFLDZCQUFhLENBQUMsUUFBUSxDQUFDLENBQzFCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IE1vZGVsQW5kUGFyYW1ldGVyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvY29uZmlndXJhdGlvbi9kZWJ1Zy90eXBlcydcbmltcG9ydCB0eXBlIHsgRmVhdHVyZXMgYXMgRmVhdHVyZXNEYXRhLCBGaWxlVXBsb2FkIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZlYXR1cmVzL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBGb3JtVmFsdWUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9kZWNsYXJhdGlvbnMnXG5pbXBvcnQgdHlwZSB7IENvbGxlY3Rpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3Rvb2xzL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBFeHRlcm5hbERhdGFUb29sIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU2V0IH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7XG4gIEFubm90YXRpb25SZXBseUNvbmZpZyxcbiAgRGF0YXNldENvbmZpZ3MsXG4gIElucHV0cyxcbiAgTW9kZWxDb25maWcsXG4gIE1vZGVyYXRpb25Db25maWcsXG4gIE1vcmVMaWtlVGhpc0NvbmZpZyxcbiAgUHJvbXB0Q29uZmlnLFxuICBQcm9tcHRWYXJpYWJsZSxcbiAgVGV4dFRvU3BlZWNoQ29uZmlnLFxufSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB0eXBlIHsgTW9kZWxDb25maWcgYXMgQmFja2VuZE1vZGVsQ29uZmlnLCBVc2VySW5wdXRGb3JtSXRlbSwgVmlzaW9uU2V0dGluZ3MgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IENvZGVCcmFja2V0SWNvbiB9IGZyb20gJ0BoZXJvaWNvbnMvcmVhY3QvMjAvc29saWQnXG5pbXBvcnQgeyB1c2VCb29sZWFuLCB1c2VHZXRTdGF0ZSB9IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IGNsb25lIH0gZnJvbSAnZXMtdG9vbGtpdC9vYmplY3QnXG5pbXBvcnQgeyBpc0VxdWFsIH0gZnJvbSAnZXMtdG9vbGtpdC9wcmVkaWNhdGUnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgeyB1c2VQYXRobmFtZSB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuaW1wb3J0IHsgdXNlU2hhbGxvdyB9IGZyb20gJ3p1c3RhbmQvcmVhY3Qvc2hhbGxvdydcbmltcG9ydCBBcHBQdWJsaXNoZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvYXBwLXB1Ymxpc2hlci9mZWF0dXJlcy13cmFwcGVyJ1xuaW1wb3J0IENvbmZpZyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9jb25maWd1cmF0aW9uL2NvbmZpZydcbmltcG9ydCBFZGl0SGlzdG9yeU1vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL2NvbmZpZ3VyYXRpb24vY29uZmlnLXByb21wdC9jb252ZXJzYXRpb24taGlzdG9yeS9lZGl0LW1vZGFsJ1xuaW1wb3J0IEFnZW50U2V0dGluZ0J1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9jb25maWd1cmF0aW9uL2NvbmZpZy9hZ2VudC1zZXR0aW5nLWJ1dHRvbidcbmltcG9ydCBTZWxlY3REYXRhU2V0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL2NvbmZpZ3VyYXRpb24vZGF0YXNldC1jb25maWcvc2VsZWN0LWRhdGFzZXQnXG5pbXBvcnQgRGVidWcgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvY29uZmlndXJhdGlvbi9kZWJ1ZydcbmltcG9ydCB7XG4gIHVzZURlYnVnV2l0aFNpbmdsZU9yTXVsdGlwbGVNb2RlbCxcbiAgdXNlRm9ybWF0dGluZ0NoYW5nZWREaXNwYXRjaGVyLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9jb25maWd1cmF0aW9uL2RlYnVnL2hvb2tzJ1xuaW1wb3J0IHVzZUFkdmFuY2VkUHJvbXB0Q29uZmlnIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL2NvbmZpZ3VyYXRpb24vaG9va3MvdXNlLWFkdmFuY2VkLXByb21wdC1jb25maWcnXG5pbXBvcnQgeyB1c2VTdG9yZSBhcyB1c2VBcHBTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJ1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IENvbmZpcm0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NvbmZpcm0nXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCBEcmF3ZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2RyYXdlcidcbmltcG9ydCB7IEZlYXR1cmVzUHJvdmlkZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMnXG5pbXBvcnQgTmV3RmVhdHVyZVBhbmVsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mZWF0dXJlcy9uZXctZmVhdHVyZS1wYW5lbCdcbmltcG9ydCBMb2FkaW5nIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuaW1wb3J0IHsgRklMRV9FWFRTIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Byb21wdC1lZGl0b3IvY29uc3RhbnRzJ1xuaW1wb3J0IFRvYXN0LCB7IFRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IEFDQ09VTlRfU0VUVElOR19UQUIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvY29uc3RhbnRzJ1xuaW1wb3J0IHsgTW9kZWxGZWF0dXJlRW51bSwgTW9kZWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7XG4gIHVzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbEFuZEN1cnJlbnRQcm92aWRlckFuZE1vZGVsLFxuICB1c2VUZXh0R2VuZXJhdGlvbkN1cnJlbnRQcm92aWRlckFuZE1vZGVsQW5kTW9kZWxMaXN0LFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcydcbmltcG9ydCBNb2RlbFBhcmFtZXRlck1vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL21vZGVsLXBhcmFtZXRlci1tb2RhbCdcbmltcG9ydCB7XG4gIGdldE11bHRpcGxlUmV0cmlldmFsQ29uZmlnLFxuICBnZXRTZWxlY3RlZERhdGFzZXRzTW9kZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9rbm93bGVkZ2UtcmV0cmlldmFsL3V0aWxzJ1xuaW1wb3J0IFBsdWdpbkRlcGVuZGVuY3kgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9wbHVnaW4tZGVwZW5kZW5jeSdcbmltcG9ydCB7IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgQU5OT1RBVElPTl9ERUZBVUxULCBEQVRBU0VUX0RFRkFVTFQsIERFRkFVTFRfQUdFTlRfU0VUVElORywgREVGQVVMVF9DSEFUX1BST01QVF9DT05GSUcsIERFRkFVTFRfQ09NUExFVElPTl9QUk9NUFRfQ09ORklHIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IENvbmZpZ0NvbnRleHQgZnJvbSAnQC9jb250ZXh0L2RlYnVnLWNvbmZpZ3VyYXRpb24nXG5pbXBvcnQgeyBNaXR0UHJvdmlkZXIgfSBmcm9tICdAL2NvbnRleHQvbWl0dC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlTW9kYWxDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VQcm92aWRlckNvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB1c2VCcmVha3BvaW50cywgeyBNZWRpYVR5cGUgfSBmcm9tICdAL2hvb2tzL3VzZS1icmVha3BvaW50cydcbmltcG9ydCB7IFByb21wdE1vZGUgfSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB7IGZldGNoQXBwRGV0YWlsRGlyZWN0LCB1cGRhdGVBcHBNb2RlbENvbmZpZyB9IGZyb20gJ0Avc2VydmljZS9hcHBzJ1xuaW1wb3J0IHsgZmV0Y2hEYXRhc2V0cyB9IGZyb20gJ0Avc2VydmljZS9kYXRhc2V0cydcbmltcG9ydCB7IGZldGNoQ29sbGVjdGlvbkxpc3QgfSBmcm9tICdAL3NlcnZpY2UvdG9vbHMnXG5pbXBvcnQgeyB1c2VGaWxlVXBsb2FkQ29uZmlnIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgeyBBZ2VudFN0cmF0ZWd5LCBBcHBNb2RlRW51bSwgTW9kZWxNb2RlVHlwZSwgUmVzb2x1dGlvbiwgUkVUUklFVkVfVFlQRSwgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7XG4gIGNvcnJlY3RNb2RlbFByb3ZpZGVyLFxuICBjb3JyZWN0VG9vbFByb3ZpZGVyLFxufSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IHsgZmV0Y2hBbmRNZXJnZVZhbGlkQ29tcGxldGlvblBhcmFtcyB9IGZyb20gJ0AvdXRpbHMvY29tcGxldGlvbi1wYXJhbXMnXG5pbXBvcnQgeyBwcm9tcHRWYXJpYWJsZXNUb1VzZXJJbnB1dHNGb3JtLCB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzIH0gZnJvbSAnQC91dGlscy9tb2RlbC1jb25maWcnXG5pbXBvcnQgeyBzdXBwb3J0RnVuY3Rpb25DYWxsIH0gZnJvbSAnQC91dGlscy90b29sLWNhbGwnXG5pbXBvcnQgeyBiYXNlUGF0aCB9IGZyb20gJ0AvdXRpbHMvdmFyJ1xuXG50eXBlIFB1Ymxpc2hDb25maWcgPSB7XG4gIG1vZGVsQ29uZmlnOiBNb2RlbENvbmZpZ1xuICBjb21wbGV0aW9uUGFyYW1zOiBGb3JtVmFsdWVcbn1cblxuY29uc3QgQ29uZmlndXJhdGlvbjogRkMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlQ29udGV4dChUb2FzdENvbnRleHQpXG4gIGNvbnN0IHsgaXNMb2FkaW5nQ3VycmVudFdvcmtzcGFjZSwgY3VycmVudFdvcmtzcGFjZSB9ID0gdXNlQXBwQ29udGV4dCgpXG5cbiAgY29uc3QgeyBhcHBEZXRhaWwsIHNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsLCBzZXRBcHBTaWRlYmFyRXhwYW5kLCBzZXRTaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbCB9ID0gdXNlQXBwU3RvcmUodXNlU2hhbGxvdyhzdGF0ZSA9PiAoe1xuICAgIGFwcERldGFpbDogc3RhdGUuYXBwRGV0YWlsLFxuICAgIHNldEFwcFNpZGViYXJFeHBhbmQ6IHN0YXRlLnNldEFwcFNpZGViYXJFeHBhbmQsXG4gICAgc2hvd0FwcENvbmZpZ3VyZUZlYXR1cmVzTW9kYWw6IHN0YXRlLnNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsLFxuICAgIHNldFNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsOiBzdGF0ZS5zZXRTaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbCxcbiAgfSkpKVxuICBjb25zdCB7IGRhdGE6IGZpbGVVcGxvYWRDb25maWdSZXNwb25zZSB9ID0gdXNlRmlsZVVwbG9hZENvbmZpZygpXG5cbiAgY29uc3QgbGF0ZXN0UHVibGlzaGVkQXQgPSB1c2VNZW1vKCgpID0+IGFwcERldGFpbD8ubW9kZWxfY29uZmlnPy51cGRhdGVkX2F0LCBbYXBwRGV0YWlsXSlcbiAgY29uc3QgW2Zvcm1hdHRpbmdDaGFuZ2VkLCBzZXRGb3JtYXR0aW5nQ2hhbmdlZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyBzZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCB9ID0gdXNlTW9kYWxDb250ZXh0KClcbiAgY29uc3QgW2hhc0ZldGNoZWREZXRhaWwsIHNldEhhc0ZldGNoZWREZXRhaWxdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGlzTG9hZGluZyA9ICFoYXNGZXRjaGVkRGV0YWlsXG4gIGNvbnN0IHBhdGhuYW1lID0gdXNlUGF0aG5hbWUoKVxuICBjb25zdCBtYXRjaGVkID0gcGF0aG5hbWUubWF0Y2goL1xcL2FwcFxcLyhbXi9dKykvKVxuICBjb25zdCBhcHBJZCA9IChtYXRjaGVkPy5sZW5ndGggJiYgbWF0Y2hlZFsxXSkgPyBtYXRjaGVkWzFdIDogJydcbiAgY29uc3QgW21vZGUsIHNldE1vZGVdID0gdXNlU3RhdGU8QXBwTW9kZUVudW0+KEFwcE1vZGVFbnVtLkNIQVQpXG4gIGNvbnN0IFtwdWJsaXNoZWRDb25maWcsIHNldFB1Ymxpc2hlZENvbmZpZ10gPSB1c2VTdGF0ZTxQdWJsaXNoQ29uZmlnIHwgbnVsbD4obnVsbClcblxuICBjb25zdCBbY29udmVyc2F0aW9uSWQsIHNldENvbnZlcnNhdGlvbklkXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KCcnKVxuXG4gIGNvbnN0IG1lZGlhID0gdXNlQnJlYWtwb2ludHMoKVxuICBjb25zdCBpc01vYmlsZSA9IG1lZGlhID09PSBNZWRpYVR5cGUubW9iaWxlXG4gIGNvbnN0IFtpc1Nob3dEZWJ1Z1BhbmVsLCB7IHNldFRydWU6IHNob3dEZWJ1Z1BhbmVsLCBzZXRGYWxzZTogaGlkZURlYnVnUGFuZWwgfV0gPSB1c2VCb29sZWFuKGZhbHNlKVxuXG4gIGNvbnN0IFtpbnRyb2R1Y3Rpb24sIHNldEludHJvZHVjdGlvbl0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKVxuICBjb25zdCBbc3VnZ2VzdGVkUXVlc3Rpb25zLCBzZXRTdWdnZXN0ZWRRdWVzdGlvbnNdID0gdXNlU3RhdGU8c3RyaW5nW10+KFtdKVxuICBjb25zdCBbY29udHJvbENsZWFyQ2hhdE1lc3NhZ2UsIHNldENvbnRyb2xDbGVhckNoYXRNZXNzYWdlXSA9IHVzZVN0YXRlKDApXG4gIGNvbnN0IFtwcmV2UHJvbXB0Q29uZmlnLCBzZXRQcmV2UHJvbXB0Q29uZmlnXSA9IHVzZVN0YXRlPFByb21wdENvbmZpZz4oe1xuICAgIHByb21wdF90ZW1wbGF0ZTogJycsXG4gICAgcHJvbXB0X3ZhcmlhYmxlczogW10sXG4gIH0pXG4gIGNvbnN0IFttb3JlTGlrZVRoaXNDb25maWcsIHNldE1vcmVMaWtlVGhpc0NvbmZpZ10gPSB1c2VTdGF0ZTxNb3JlTGlrZVRoaXNDb25maWc+KHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgfSlcbiAgY29uc3QgW3N1Z2dlc3RlZFF1ZXN0aW9uc0FmdGVyQW5zd2VyQ29uZmlnLCBzZXRTdWdnZXN0ZWRRdWVzdGlvbnNBZnRlckFuc3dlckNvbmZpZ10gPSB1c2VTdGF0ZTxNb3JlTGlrZVRoaXNDb25maWc+KHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgfSlcbiAgY29uc3QgW3NwZWVjaFRvVGV4dENvbmZpZywgc2V0U3BlZWNoVG9UZXh0Q29uZmlnXSA9IHVzZVN0YXRlPE1vcmVMaWtlVGhpc0NvbmZpZz4oe1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICB9KVxuICBjb25zdCBbdGV4dFRvU3BlZWNoQ29uZmlnLCBzZXRUZXh0VG9TcGVlY2hDb25maWddID0gdXNlU3RhdGU8VGV4dFRvU3BlZWNoQ29uZmlnPih7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgdm9pY2U6ICcnLFxuICAgIGxhbmd1YWdlOiAnJyxcbiAgfSlcbiAgY29uc3QgW2NpdGF0aW9uQ29uZmlnLCBzZXRDaXRhdGlvbkNvbmZpZ10gPSB1c2VTdGF0ZTxNb3JlTGlrZVRoaXNDb25maWc+KHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgfSlcbiAgY29uc3QgW2Fubm90YXRpb25Db25maWcsIGRvU2V0QW5ub3RhdGlvbkNvbmZpZ10gPSB1c2VTdGF0ZTxBbm5vdGF0aW9uUmVwbHlDb25maWc+KHtcbiAgICBpZDogJycsXG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgc2NvcmVfdGhyZXNob2xkOiBBTk5PVEFUSU9OX0RFRkFVTFQuc2NvcmVfdGhyZXNob2xkLFxuICAgIGVtYmVkZGluZ19tb2RlbDoge1xuICAgICAgZW1iZWRkaW5nX3Byb3ZpZGVyX25hbWU6ICcnLFxuICAgICAgZW1iZWRkaW5nX21vZGVsX25hbWU6ICcnLFxuICAgIH0sXG4gIH0pXG4gIGNvbnN0IGZvcm1hdHRpbmdDaGFuZ2VkRGlzcGF0Y2hlciA9IHVzZUZvcm1hdHRpbmdDaGFuZ2VkRGlzcGF0Y2hlcigpXG4gIGNvbnN0IHNldEFubm90YXRpb25Db25maWcgPSAoY29uZmlnOiBBbm5vdGF0aW9uUmVwbHlDb25maWcsIG5vdFNldEZvcm1hdENoYW5nZWQ/OiBib29sZWFuKSA9PiB7XG4gICAgZG9TZXRBbm5vdGF0aW9uQ29uZmlnKGNvbmZpZylcbiAgICBpZiAoIW5vdFNldEZvcm1hdENoYW5nZWQpXG4gICAgICBmb3JtYXR0aW5nQ2hhbmdlZERpc3BhdGNoZXIoKVxuICB9XG5cbiAgY29uc3QgW21vZGVyYXRpb25Db25maWcsIHNldE1vZGVyYXRpb25Db25maWddID0gdXNlU3RhdGU8TW9kZXJhdGlvbkNvbmZpZz4oe1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICB9KVxuICBjb25zdCBbZXh0ZXJuYWxEYXRhVG9vbHNDb25maWcsIHNldEV4dGVybmFsRGF0YVRvb2xzQ29uZmlnXSA9IHVzZVN0YXRlPEV4dGVybmFsRGF0YVRvb2xbXT4oW10pXG4gIGNvbnN0IFtpbnB1dHMsIHNldElucHV0c10gPSB1c2VTdGF0ZTxJbnB1dHM+KHt9KVxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbY29tcGxldGlvblBhcmFtcywgZG9TZXRDb21wbGV0aW9uUGFyYW1zXSA9IHVzZVN0YXRlPEZvcm1WYWx1ZT4oe30pXG4gIGNvbnN0IFtfLCBzZXRUZW1wU3RvcCwgZ2V0VGVtcFN0b3BdID0gdXNlR2V0U3RhdGU8c3RyaW5nW10+KFtdKVxuICBjb25zdCBzZXRDb21wbGV0aW9uUGFyYW1zID0gKHZhbHVlOiBGb3JtVmFsdWUpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSB7IC4uLnZhbHVlIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB0cy9uby11c2UtYmVmb3JlLWRlZmluZVxuICAgIGlmICgoIXBhcmFtcy5zdG9wIHx8IHBhcmFtcy5zdG9wLmxlbmd0aCA9PT0gMCkgJiYgKG1vZGVNb2RlVHlwZVJlZi5jdXJyZW50ID09PSBNb2RlbE1vZGVUeXBlLmNvbXBsZXRpb24pKSB7XG4gICAgICBwYXJhbXMuc3RvcCA9IGdldFRlbXBTdG9wKClcbiAgICAgIHNldFRlbXBTdG9wKFtdKVxuICAgIH1cbiAgICBkb1NldENvbXBsZXRpb25QYXJhbXMocGFyYW1zKVxuICB9XG5cbiAgY29uc3QgW21vZGVsQ29uZmlnLCBkb1NldE1vZGVsQ29uZmlnXSA9IHVzZVN0YXRlPE1vZGVsQ29uZmlnPih7XG4gICAgcHJvdmlkZXI6ICdsYW5nZ2VuaXVzL29wZW5haS9vcGVuYWknLFxuICAgIG1vZGVsX2lkOiAnZ3B0LTMuNS10dXJibycsXG4gICAgbW9kZTogTW9kZWxNb2RlVHlwZS51bnNldCxcbiAgICBjb25maWdzOiB7XG4gICAgICBwcm9tcHRfdGVtcGxhdGU6ICcnLFxuICAgICAgcHJvbXB0X3ZhcmlhYmxlczogW10gYXMgUHJvbXB0VmFyaWFibGVbXSxcbiAgICB9LFxuICAgIGNoYXRfcHJvbXB0X2NvbmZpZzogY2xvbmUoREVGQVVMVF9DSEFUX1BST01QVF9DT05GSUcpLFxuICAgIGNvbXBsZXRpb25fcHJvbXB0X2NvbmZpZzogY2xvbmUoREVGQVVMVF9DT01QTEVUSU9OX1BST01QVF9DT05GSUcpLFxuICAgIG1vcmVfbGlrZV90aGlzOiBudWxsLFxuICAgIG9wZW5pbmdfc3RhdGVtZW50OiAnJyxcbiAgICBzdWdnZXN0ZWRfcXVlc3Rpb25zOiBbXSxcbiAgICBzZW5zaXRpdmVfd29yZF9hdm9pZGFuY2U6IG51bGwsXG4gICAgc3BlZWNoX3RvX3RleHQ6IG51bGwsXG4gICAgdGV4dF90b19zcGVlY2g6IG51bGwsXG4gICAgZmlsZV91cGxvYWQ6IG51bGwsXG4gICAgc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXI6IG51bGwsXG4gICAgcmV0cmlldmVyX3Jlc291cmNlOiBudWxsLFxuICAgIGFubm90YXRpb25fcmVwbHk6IG51bGwsXG4gICAgZXh0ZXJuYWxfZGF0YV90b29sczogW10sXG4gICAgc3lzdGVtX3BhcmFtZXRlcnM6IHtcbiAgICAgIGF1ZGlvX2ZpbGVfc2l6ZV9saW1pdDogMCxcbiAgICAgIGZpbGVfc2l6ZV9saW1pdDogMCxcbiAgICAgIGltYWdlX2ZpbGVfc2l6ZV9saW1pdDogMCxcbiAgICAgIHZpZGVvX2ZpbGVfc2l6ZV9saW1pdDogMCxcbiAgICAgIHdvcmtmbG93X2ZpbGVfdXBsb2FkX2xpbWl0OiAwLFxuICAgIH0sXG4gICAgZGF0YVNldHM6IFtdLFxuICAgIGFnZW50Q29uZmlnOiBERUZBVUxUX0FHRU5UX1NFVFRJTkcsXG4gIH0pXG4gIGNvbnN0IGlzQWdlbnQgPSBtb2RlID09PSBBcHBNb2RlRW51bS5BR0VOVF9DSEFUXG5cbiAgY29uc3QgaXNPcGVuQUkgPSBtb2RlbENvbmZpZy5wcm92aWRlciA9PT0gJ2xhbmdnZW5pdXMvb3BlbmFpL29wZW5haSdcblxuICBjb25zdCBbY29sbGVjdGlvbkxpc3QsIHNldENvbGxlY3Rpb25MaXN0XSA9IHVzZVN0YXRlPENvbGxlY3Rpb25bXT4oW10pXG4gIGNvbnN0IFtkYXRhc2V0Q29uZmlncywgZG9TZXREYXRhc2V0Q29uZmlnc10gPSB1c2VTdGF0ZTxEYXRhc2V0Q29uZmlncz4oe1xuICAgIHJldHJpZXZhbF9tb2RlbDogUkVUUklFVkVfVFlQRS5tdWx0aVdheSxcbiAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyxcbiAgICB9LFxuICAgIHRvcF9rOiBEQVRBU0VUX0RFRkFVTFQudG9wX2ssXG4gICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgIHNjb3JlX3RocmVzaG9sZDogREFUQVNFVF9ERUZBVUxULnNjb3JlX3RocmVzaG9sZCxcbiAgICBkYXRhc2V0czoge1xuICAgICAgZGF0YXNldHM6IFtdLFxuICAgIH0sXG4gIH0pXG4gIGNvbnN0IGRhdGFzZXRDb25maWdzUmVmID0gdXNlUmVmKGRhdGFzZXRDb25maWdzKVxuICBjb25zdCBzZXREYXRhc2V0Q29uZmlncyA9IHVzZUNhbGxiYWNrKChuZXdEYXRhc2V0Q29uZmlnczogRGF0YXNldENvbmZpZ3MpID0+IHtcbiAgICBkb1NldERhdGFzZXRDb25maWdzKG5ld0RhdGFzZXRDb25maWdzKVxuICAgIGRhdGFzZXRDb25maWdzUmVmLmN1cnJlbnQgPSBuZXdEYXRhc2V0Q29uZmlnc1xuICB9LCBbXSlcblxuICBjb25zdCBzZXRNb2RlbENvbmZpZyA9IChuZXdNb2RlbENvbmZpZzogTW9kZWxDb25maWcpID0+IHtcbiAgICBkb1NldE1vZGVsQ29uZmlnKG5ld01vZGVsQ29uZmlnKVxuICB9XG5cbiAgY29uc3QgbW9kZWxNb2RlVHlwZSA9IG1vZGVsQ29uZmlnLm1vZGVcbiAgY29uc3QgbW9kZU1vZGVUeXBlUmVmID0gdXNlUmVmKG1vZGVsTW9kZVR5cGUpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbW9kZU1vZGVUeXBlUmVmLmN1cnJlbnQgPSBtb2RlbE1vZGVUeXBlXG4gIH0sIFttb2RlbE1vZGVUeXBlXSlcblxuICBjb25zdCBbZGF0YVNldHMsIHNldERhdGFTZXRzXSA9IHVzZVN0YXRlPERhdGFTZXRbXT4oW10pXG4gIGNvbnN0IGNvbnRleHRWYXIgPSBtb2RlbENvbmZpZy5jb25maWdzLnByb21wdF92YXJpYWJsZXMuZmluZChpdGVtID0+IGl0ZW0uaXNfY29udGV4dF92YXIpPy5rZXlcbiAgY29uc3QgaGFzU2V0Q29udGV4dFZhciA9ICEhY29udGV4dFZhclxuICBjb25zdCBbaXNTaG93U2VsZWN0RGF0YVNldCwgeyBzZXRUcnVlOiBzaG93U2VsZWN0RGF0YVNldCwgc2V0RmFsc2U6IGhpZGVTZWxlY3REYXRhU2V0IH1dID0gdXNlQm9vbGVhbihmYWxzZSlcbiAgY29uc3Qgc2VsZWN0ZWRJZHMgPSBkYXRhU2V0cy5tYXAoaXRlbSA9PiBpdGVtLmlkKVxuICBjb25zdCBbcmVyYW5rU2V0dGluZ01vZGFsT3Blbiwgc2V0UmVyYW5rU2V0dGluZ01vZGFsT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3Qge1xuICAgIGN1cnJlbnRNb2RlbDogY3VycmVudFJlcmFua01vZGVsLFxuICAgIGN1cnJlbnRQcm92aWRlcjogY3VycmVudFJlcmFua1Byb3ZpZGVyLFxuICB9ID0gdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwoTW9kZWxUeXBlRW51bS5yZXJhbmspXG4gIGNvbnN0IGhhbmRsZVNlbGVjdCA9IChkYXRhOiBEYXRhU2V0W10pID0+IHtcbiAgICBpZiAoaXNFcXVhbChkYXRhLm1hcChpdGVtID0+IGl0ZW0uaWQpLCBkYXRhU2V0cy5tYXAoaXRlbSA9PiBpdGVtLmlkKSkpIHtcbiAgICAgIGhpZGVTZWxlY3REYXRhU2V0KClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGZvcm1hdHRpbmdDaGFuZ2VkRGlzcGF0Y2hlcigpXG4gICAgbGV0IG5ld0RhdGFzZXRzID0gZGF0YVxuICAgIGlmIChkYXRhLmZpbmQoaXRlbSA9PiAhaXRlbS5uYW1lKSkgeyAvLyBoYXMgbm90IGxvYWRlZCBzZWxlY3RlZCBkYXRhc2V0XG4gICAgICBjb25zdCBuZXdTZWxlY3RlZCA9IHByb2R1Y2UoZGF0YSwgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGRhdGEuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoIWl0ZW0ubmFtZSkgeyAvLyBub3QgZmV0Y2hlZCBkYXRhYmFzZVxuICAgICAgICAgICAgY29uc3QgbmV3SXRlbSA9IGRhdGFTZXRzLmZpbmQoaSA9PiBpLmlkID09PSBpdGVtLmlkKVxuICAgICAgICAgICAgaWYgKG5ld0l0ZW0pXG4gICAgICAgICAgICAgIGRyYWZ0W2luZGV4XSA9IG5ld0l0ZW1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgc2V0RGF0YVNldHMobmV3U2VsZWN0ZWQpXG4gICAgICBuZXdEYXRhc2V0cyA9IG5ld1NlbGVjdGVkXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc2V0RGF0YVNldHMoZGF0YSlcbiAgICB9XG4gICAgaGlkZVNlbGVjdERhdGFTZXQoKVxuICAgIGNvbnN0IHtcbiAgICAgIGFsbEV4dGVybmFsLFxuICAgICAgYWxsSW50ZXJuYWwsXG4gICAgICBtaXh0dXJlSW50ZXJuYWxBbmRFeHRlcm5hbCxcbiAgICAgIG1peHR1cmVIaWdoUXVhbGl0eUFuZEVjb25vbWljLFxuICAgICAgaW5jb25zaXN0ZW50RW1iZWRkaW5nTW9kZWwsXG4gICAgfSA9IGdldFNlbGVjdGVkRGF0YXNldHNNb2RlKG5ld0RhdGFzZXRzKVxuXG4gICAgaWYgKFxuICAgICAgKGFsbEludGVybmFsICYmIChtaXh0dXJlSGlnaFF1YWxpdHlBbmRFY29ub21pYyB8fCBpbmNvbnNpc3RlbnRFbWJlZGRpbmdNb2RlbCkpXG4gICAgICB8fCBtaXh0dXJlSW50ZXJuYWxBbmRFeHRlcm5hbFxuICAgICAgfHwgYWxsRXh0ZXJuYWxcbiAgICApIHtcbiAgICAgIHNldFJlcmFua1NldHRpbmdNb2RhbE9wZW4odHJ1ZSlcbiAgICB9XG5cbiAgICBjb25zdCB7IGRhdGFzZXRzLCByZXRyaWV2YWxfbW9kZWwsIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkLCAuLi5yZXN0Q29uZmlncyB9ID0gZGF0YXNldENvbmZpZ3NcbiAgICBjb25zdCB7XG4gICAgICB0b3BfayxcbiAgICAgIHNjb3JlX3RocmVzaG9sZCxcbiAgICAgIHJlcmFua2luZ19tb2RlbCxcbiAgICAgIHJlcmFua2luZ19tb2RlLFxuICAgICAgd2VpZ2h0cyxcbiAgICAgIHJlcmFua2luZ19lbmFibGUsXG4gICAgfSA9IHJlc3RDb25maWdzXG5cbiAgICBjb25zdCBvbGRSZXRyaWV2YWxDb25maWcgPSB7XG4gICAgICB0b3BfayxcbiAgICAgIHNjb3JlX3RocmVzaG9sZCxcbiAgICAgIHJlcmFua2luZ19tb2RlbDogKHJlcmFua2luZ19tb2RlbD8ucmVyYW5raW5nX3Byb3ZpZGVyX25hbWUgJiYgcmVyYW5raW5nX21vZGVsPy5yZXJhbmtpbmdfbW9kZWxfbmFtZSlcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBwcm92aWRlcjogcmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19wcm92aWRlcl9uYW1lLFxuICAgICAgICAgICAgbW9kZWw6IHJlcmFua2luZ19tb2RlbC5yZXJhbmtpbmdfbW9kZWxfbmFtZSxcbiAgICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgcmVyYW5raW5nX21vZGUsXG4gICAgICB3ZWlnaHRzLFxuICAgICAgcmVyYW5raW5nX2VuYWJsZSxcbiAgICB9XG5cbiAgICBjb25zdCByZXRyaWV2YWxDb25maWcgPSBnZXRNdWx0aXBsZVJldHJpZXZhbENvbmZpZyhvbGRSZXRyaWV2YWxDb25maWcsIG5ld0RhdGFzZXRzLCBkYXRhU2V0cywge1xuICAgICAgcHJvdmlkZXI6IGN1cnJlbnRSZXJhbmtQcm92aWRlcj8ucHJvdmlkZXIsXG4gICAgICBtb2RlbDogY3VycmVudFJlcmFua01vZGVsPy5tb2RlbCxcbiAgICB9KVxuXG4gICAgc2V0RGF0YXNldENvbmZpZ3Moe1xuICAgICAgLi4uZGF0YXNldENvbmZpZ3NSZWYuY3VycmVudCxcbiAgICAgIC4uLnJldHJpZXZhbENvbmZpZyxcbiAgICAgIHJlcmFua2luZ19tb2RlbDoge1xuICAgICAgICByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogcmV0cmlldmFsQ29uZmlnPy5yZXJhbmtpbmdfbW9kZWw/LnByb3ZpZGVyIHx8ICcnLFxuICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogcmV0cmlldmFsQ29uZmlnPy5yZXJhbmtpbmdfbW9kZWw/Lm1vZGVsIHx8ICcnLFxuICAgICAgfSxcbiAgICAgIHJldHJpZXZhbF9tb2RlbCxcbiAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkLFxuICAgICAgZGF0YXNldHMsXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IFtpc1Nob3dIaXN0b3J5TW9kYWwsIHsgc2V0VHJ1ZTogc2hvd0hpc3RvcnlNb2RhbCwgc2V0RmFsc2U6IGhpZGVIaXN0b3J5TW9kYWwgfV0gPSB1c2VCb29sZWFuKGZhbHNlKVxuXG4gIGNvbnN0IHN5bmNUb1B1Ymxpc2hlZENvbmZpZyA9IChfcHVibGlzaGVkQ29uZmlnOiBQdWJsaXNoQ29uZmlnKSA9PiB7XG4gICAgY29uc3QgbW9kZWxDb25maWcgPSBfcHVibGlzaGVkQ29uZmlnLm1vZGVsQ29uZmlnXG4gICAgc2V0TW9kZWxDb25maWcoX3B1Ymxpc2hlZENvbmZpZy5tb2RlbENvbmZpZylcbiAgICBzZXRDb21wbGV0aW9uUGFyYW1zKF9wdWJsaXNoZWRDb25maWcuY29tcGxldGlvblBhcmFtcylcbiAgICBzZXREYXRhU2V0cyhtb2RlbENvbmZpZy5kYXRhU2V0cyB8fCBbXSlcbiAgICAvLyByZXNldCBmZWF0dXJlXG4gICAgc2V0SW50cm9kdWN0aW9uKG1vZGVsQ29uZmlnLm9wZW5pbmdfc3RhdGVtZW50ISlcbiAgICBzZXRNb3JlTGlrZVRoaXNDb25maWcobW9kZWxDb25maWcubW9yZV9saWtlX3RoaXMgfHwge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgfSlcbiAgICBzZXRTdWdnZXN0ZWRRdWVzdGlvbnNBZnRlckFuc3dlckNvbmZpZyhtb2RlbENvbmZpZy5zdWdnZXN0ZWRfcXVlc3Rpb25zX2FmdGVyX2Fuc3dlciB8fCB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9KVxuICAgIHNldFNwZWVjaFRvVGV4dENvbmZpZyhtb2RlbENvbmZpZy5zcGVlY2hfdG9fdGV4dCB8fCB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9KVxuICAgIHNldFRleHRUb1NwZWVjaENvbmZpZyhtb2RlbENvbmZpZy50ZXh0X3RvX3NwZWVjaCB8fCB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIHZvaWNlOiAnJyxcbiAgICAgIGxhbmd1YWdlOiAnJyxcbiAgICB9KVxuICAgIHNldENpdGF0aW9uQ29uZmlnKG1vZGVsQ29uZmlnLnJldHJpZXZlcl9yZXNvdXJjZSB8fCB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgeyBpc0FQSUtleVNldCB9ID0gdXNlUHJvdmlkZXJDb250ZXh0KClcbiAgY29uc3Qge1xuICAgIGN1cnJlbnRNb2RlbDogY3Vyck1vZGVsLFxuICAgIHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0LFxuICB9ID0gdXNlVGV4dEdlbmVyYXRpb25DdXJyZW50UHJvdmlkZXJBbmRNb2RlbEFuZE1vZGVsTGlzdChcbiAgICB7XG4gICAgICBwcm92aWRlcjogbW9kZWxDb25maWcucHJvdmlkZXIsXG4gICAgICBtb2RlbDogbW9kZWxDb25maWcubW9kZWxfaWQsXG4gICAgfSxcbiAgKVxuXG4gIGNvbnN0IGlzRnVuY3Rpb25DYWxsID0gc3VwcG9ydEZ1bmN0aW9uQ2FsbChjdXJyTW9kZWw/LmZlYXR1cmVzKVxuXG4gIC8vIEZpbGwgb2xkIGFwcCBkYXRhIG1pc3NpbmcgbW9kZWwgbW9kZS5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFzRmV0Y2hlZERldGFpbCAmJiAhbW9kZWxNb2RlVHlwZSkge1xuICAgICAgY29uc3QgbW9kZSA9IGN1cnJNb2RlbD8ubW9kZWxfcHJvcGVydGllcy5tb2RlIGFzIChNb2RlbE1vZGVUeXBlIHwgdW5kZWZpbmVkKVxuICAgICAgaWYgKG1vZGUpIHtcbiAgICAgICAgY29uc3QgbmV3TW9kZWxDb25maWcgPSBwcm9kdWNlKG1vZGVsQ29uZmlnLCAoZHJhZnQ6IE1vZGVsQ29uZmlnKSA9PiB7XG4gICAgICAgICAgZHJhZnQubW9kZSA9IG1vZGVcbiAgICAgICAgfSlcbiAgICAgICAgc2V0TW9kZWxDb25maWcobmV3TW9kZWxDb25maWcpXG4gICAgICB9XG4gICAgfVxuICB9LCBbdGV4dEdlbmVyYXRpb25Nb2RlbExpc3QsIGhhc0ZldGNoZWREZXRhaWwsIG1vZGVsTW9kZVR5cGUsIGN1cnJNb2RlbCwgbW9kZWxDb25maWddKVxuXG4gIGNvbnN0IFtwcm9tcHRNb2RlLCBkb1NldFByb21wdE1vZGVdID0gdXNlU3RhdGUoUHJvbXB0TW9kZS5zaW1wbGUpXG4gIGNvbnN0IGlzQWR2YW5jZWRNb2RlID0gcHJvbXB0TW9kZSA9PT0gUHJvbXB0TW9kZS5hZHZhbmNlZFxuICBjb25zdCBbY2FuUmV0dXJuVG9TaW1wbGVNb2RlLCBzZXRDYW5SZXR1cm5Ub1NpbXBsZU1vZGVdID0gdXNlU3RhdGUodHJ1ZSlcbiAgY29uc3Qgc2V0UHJvbXB0TW9kZSA9IGFzeW5jIChtb2RlOiBQcm9tcHRNb2RlKSA9PiB7XG4gICAgaWYgKG1vZGUgPT09IFByb21wdE1vZGUuYWR2YW5jZWQpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB0cy9uby11c2UtYmVmb3JlLWRlZmluZVxuICAgICAgYXdhaXQgbWlncmF0ZVRvRGVmYXVsdFByb21wdCgpXG4gICAgICBzZXRDYW5SZXR1cm5Ub1NpbXBsZU1vZGUodHJ1ZSlcbiAgICB9XG5cbiAgICBkb1NldFByb21wdE1vZGUobW9kZSlcbiAgfVxuICBjb25zdCBbdmlzaW9uQ29uZmlnLCBkb1NldFZpc2lvbkNvbmZpZ10gPSB1c2VTdGF0ZSh7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgbnVtYmVyX2xpbWl0czogMixcbiAgICBkZXRhaWw6IFJlc29sdXRpb24ubG93LFxuICAgIHRyYW5zZmVyX21ldGhvZHM6IFtUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlXSxcbiAgfSlcblxuICBjb25zdCBoYW5kbGVTZXRWaXNpb25Db25maWcgPSAoY29uZmlnOiBWaXNpb25TZXR0aW5ncywgbm90Tm90aWNlRm9ybWF0dGluZ0NoYW5nZWQ/OiBib29sZWFuKSA9PiB7XG4gICAgZG9TZXRWaXNpb25Db25maWcoe1xuICAgICAgZW5hYmxlZDogY29uZmlnLmVuYWJsZWQgfHwgZmFsc2UsXG4gICAgICBudW1iZXJfbGltaXRzOiBjb25maWcubnVtYmVyX2xpbWl0cyB8fCAyLFxuICAgICAgZGV0YWlsOiBjb25maWcuZGV0YWlsIHx8IFJlc29sdXRpb24ubG93LFxuICAgICAgdHJhbnNmZXJfbWV0aG9kczogY29uZmlnLnRyYW5zZmVyX21ldGhvZHMgfHwgW1RyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGVdLFxuICAgIH0pXG4gICAgaWYgKCFub3ROb3RpY2VGb3JtYXR0aW5nQ2hhbmdlZClcbiAgICAgIGZvcm1hdHRpbmdDaGFuZ2VkRGlzcGF0Y2hlcigpXG4gIH1cblxuICBjb25zdCB7XG4gICAgY2hhdFByb21wdENvbmZpZyxcbiAgICBzZXRDaGF0UHJvbXB0Q29uZmlnLFxuICAgIGNvbXBsZXRpb25Qcm9tcHRDb25maWcsXG4gICAgc2V0Q29tcGxldGlvblByb21wdENvbmZpZyxcbiAgICBjdXJyZW50QWR2YW5jZWRQcm9tcHQsXG4gICAgc2V0Q3VycmVudEFkdmFuY2VkUHJvbXB0LFxuICAgIGhhc1NldEJsb2NrU3RhdHVzLFxuICAgIHNldENvbnZlcnNhdGlvbkhpc3Rvcmllc1JvbGUsXG4gICAgbWlncmF0ZVRvRGVmYXVsdFByb21wdCxcbiAgfSA9IHVzZUFkdmFuY2VkUHJvbXB0Q29uZmlnKHtcbiAgICBhcHBNb2RlOiBtb2RlLFxuICAgIG1vZGVsTmFtZTogbW9kZWxDb25maWcubW9kZWxfaWQsXG4gICAgcHJvbXB0TW9kZSxcbiAgICBtb2RlbE1vZGVUeXBlLFxuICAgIHByZVByb21wdDogbW9kZWxDb25maWcuY29uZmlncy5wcm9tcHRfdGVtcGxhdGUsXG4gICAgaGFzU2V0RGF0YVNldDogZGF0YVNldHMubGVuZ3RoID4gMCxcbiAgICBvblVzZXJDaGFuZ2VkUHJvbXB0OiAoKSA9PiB7XG4gICAgICBzZXRDYW5SZXR1cm5Ub1NpbXBsZU1vZGUoZmFsc2UpXG4gICAgfSxcbiAgICBjb21wbGV0aW9uUGFyYW1zLFxuICAgIHNldENvbXBsZXRpb25QYXJhbXMsXG4gICAgc2V0U3RvcDogc2V0VGVtcFN0b3AsXG4gIH0pXG4gIGNvbnN0IHNldE1vZGVsID0gYXN5bmMgKHtcbiAgICBtb2RlbElkLFxuICAgIHByb3ZpZGVyLFxuICAgIG1vZGU6IG1vZGVNb2RlLFxuICAgIGZlYXR1cmVzLFxuICB9OiB7IG1vZGVsSWQ6IHN0cmluZywgcHJvdmlkZXI6IHN0cmluZywgbW9kZTogc3RyaW5nLCBmZWF0dXJlczogc3RyaW5nW10gfSkgPT4ge1xuICAgIGlmIChpc0FkdmFuY2VkTW9kZSkge1xuICAgICAgY29uc3QgYXBwTW9kZSA9IG1vZGVcblxuICAgICAgaWYgKG1vZGVNb2RlID09PSBNb2RlbE1vZGVUeXBlLmNvbXBsZXRpb24pIHtcbiAgICAgICAgaWYgKGFwcE1vZGUgIT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04pIHtcbiAgICAgICAgICBpZiAoIWNvbXBsZXRpb25Qcm9tcHRDb25maWcucHJvbXB0Py50ZXh0IHx8ICFjb21wbGV0aW9uUHJvbXB0Q29uZmlnLmNvbnZlcnNhdGlvbl9oaXN0b3JpZXNfcm9sZS5hc3Npc3RhbnRfcHJlZml4IHx8ICFjb21wbGV0aW9uUHJvbXB0Q29uZmlnLmNvbnZlcnNhdGlvbl9oaXN0b3JpZXNfcm9sZS51c2VyX3ByZWZpeClcbiAgICAgICAgICAgIGF3YWl0IG1pZ3JhdGVUb0RlZmF1bHRQcm9tcHQodHJ1ZSwgTW9kZWxNb2RlVHlwZS5jb21wbGV0aW9uKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmICghY29tcGxldGlvblByb21wdENvbmZpZy5wcm9tcHQ/LnRleHQpXG4gICAgICAgICAgICBhd2FpdCBtaWdyYXRlVG9EZWZhdWx0UHJvbXB0KHRydWUsIE1vZGVsTW9kZVR5cGUuY29tcGxldGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1vZGVNb2RlID09PSBNb2RlbE1vZGVUeXBlLmNoYXQpIHtcbiAgICAgICAgaWYgKGNoYXRQcm9tcHRDb25maWcucHJvbXB0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgICBhd2FpdCBtaWdyYXRlVG9EZWZhdWx0UHJvbXB0KHRydWUsIE1vZGVsTW9kZVR5cGUuY2hhdClcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbmV3TW9kZWxDb25maWcgPSBwcm9kdWNlKG1vZGVsQ29uZmlnLCAoZHJhZnQ6IE1vZGVsQ29uZmlnKSA9PiB7XG4gICAgICBkcmFmdC5wcm92aWRlciA9IHByb3ZpZGVyXG4gICAgICBkcmFmdC5tb2RlbF9pZCA9IG1vZGVsSWRcbiAgICAgIGRyYWZ0Lm1vZGUgPSBtb2RlTW9kZSBhcyBNb2RlbE1vZGVUeXBlXG4gICAgfSlcblxuICAgIHNldE1vZGVsQ29uZmlnKG5ld01vZGVsQ29uZmlnKVxuICAgIGNvbnN0IHN1cHBvcnRWaXNpb24gPSBmZWF0dXJlcyAmJiBmZWF0dXJlcy5pbmNsdWRlcyhNb2RlbEZlYXR1cmVFbnVtLnZpc2lvbilcblxuICAgIGhhbmRsZVNldFZpc2lvbkNvbmZpZyh7XG4gICAgICAuLi52aXNpb25Db25maWcsXG4gICAgICBlbmFibGVkOiBzdXBwb3J0VmlzaW9uLFxuICAgIH0sIHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBwYXJhbXM6IGZpbHRlcmVkLCByZW1vdmVkRGV0YWlscyB9ID0gYXdhaXQgZmV0Y2hBbmRNZXJnZVZhbGlkQ29tcGxldGlvblBhcmFtcyhcbiAgICAgICAgcHJvdmlkZXIsXG4gICAgICAgIG1vZGVsSWQsXG4gICAgICAgIGNvbXBsZXRpb25QYXJhbXMsXG4gICAgICAgIGlzQWR2YW5jZWRNb2RlLFxuICAgICAgKVxuICAgICAgaWYgKE9iamVjdC5rZXlzKHJlbW92ZWREZXRhaWxzKS5sZW5ndGgpXG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICd3YXJuaW5nJywgbWVzc2FnZTogYCR7dCgnbW9kZWxQcm92aWRlci5wYXJhbWV0ZXJzSW52YWxpZFJlbW92ZWQnLCB7IG5zOiAnY29tbW9uJyB9KX06ICR7T2JqZWN0LmVudHJpZXMocmVtb3ZlZERldGFpbHMpLm1hcCgoW2ssIHJlYXNvbl0pID0+IGAke2t9ICgke3JlYXNvbn0pYCkuam9pbignLCAnKX1gIH0pXG4gICAgICBzZXRDb21wbGV0aW9uUGFyYW1zKGZpbHRlcmVkKVxuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdlcnJvcicsIHsgbnM6ICdjb21tb24nIH0pIH0pXG4gICAgICBzZXRDb21wbGV0aW9uUGFyYW1zKHt9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGlzU2hvd1Zpc2lvbkNvbmZpZyA9ICEhY3Vyck1vZGVsPy5mZWF0dXJlcz8uaW5jbHVkZXMoTW9kZWxGZWF0dXJlRW51bS52aXNpb24pXG4gIGNvbnN0IGlzU2hvd0RvY3VtZW50Q29uZmlnID0gISFjdXJyTW9kZWw/LmZlYXR1cmVzPy5pbmNsdWRlcyhNb2RlbEZlYXR1cmVFbnVtLmRvY3VtZW50KVxuICBjb25zdCBpc1Nob3dBdWRpb0NvbmZpZyA9ICEhY3Vyck1vZGVsPy5mZWF0dXJlcz8uaW5jbHVkZXMoTW9kZWxGZWF0dXJlRW51bS5hdWRpbylcbiAgY29uc3QgaXNBbGxvd1ZpZGVvVXBsb2FkID0gISFjdXJyTW9kZWw/LmZlYXR1cmVzPy5pbmNsdWRlcyhNb2RlbEZlYXR1cmVFbnVtLnZpZGVvKVxuICAvLyAqKiogd2ViIGFwcCBmZWF0dXJlcyAqKipcbiAgY29uc3QgZmVhdHVyZXNEYXRhOiBGZWF0dXJlc0RhdGEgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9yZUxpa2VUaGlzOiBtb2RlbENvbmZpZy5tb3JlX2xpa2VfdGhpcyB8fCB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICBvcGVuaW5nOiB7XG4gICAgICAgIGVuYWJsZWQ6ICEhbW9kZWxDb25maWcub3BlbmluZ19zdGF0ZW1lbnQsXG4gICAgICAgIG9wZW5pbmdfc3RhdGVtZW50OiBtb2RlbENvbmZpZy5vcGVuaW5nX3N0YXRlbWVudCB8fCAnJyxcbiAgICAgICAgc3VnZ2VzdGVkX3F1ZXN0aW9uczogbW9kZWxDb25maWcuc3VnZ2VzdGVkX3F1ZXN0aW9ucyB8fCBbXSxcbiAgICAgIH0sXG4gICAgICBtb2RlcmF0aW9uOiBtb2RlbENvbmZpZy5zZW5zaXRpdmVfd29yZF9hdm9pZGFuY2UgfHwgeyBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgc3BlZWNoMnRleHQ6IG1vZGVsQ29uZmlnLnNwZWVjaF90b190ZXh0IHx8IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgIHRleHQyc3BlZWNoOiBtb2RlbENvbmZpZy50ZXh0X3RvX3NwZWVjaCB8fCB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICBmaWxlOiB7XG4gICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgZGV0YWlsOiBtb2RlbENvbmZpZy5maWxlX3VwbG9hZD8uaW1hZ2U/LmRldGFpbCB8fCBSZXNvbHV0aW9uLmhpZ2gsXG4gICAgICAgICAgZW5hYmxlZDogISFtb2RlbENvbmZpZy5maWxlX3VwbG9hZD8uaW1hZ2U/LmVuYWJsZWQsXG4gICAgICAgICAgbnVtYmVyX2xpbWl0czogbW9kZWxDb25maWcuZmlsZV91cGxvYWQ/LmltYWdlPy5udW1iZXJfbGltaXRzIHx8IDMsXG4gICAgICAgICAgdHJhbnNmZXJfbWV0aG9kczogbW9kZWxDb25maWcuZmlsZV91cGxvYWQ/LmltYWdlPy50cmFuc2Zlcl9tZXRob2RzIHx8IFsnbG9jYWxfZmlsZScsICdyZW1vdGVfdXJsJ10sXG4gICAgICAgIH0sXG4gICAgICAgIGVuYWJsZWQ6ICEhKG1vZGVsQ29uZmlnLmZpbGVfdXBsb2FkPy5lbmFibGVkIHx8IG1vZGVsQ29uZmlnLmZpbGVfdXBsb2FkPy5pbWFnZT8uZW5hYmxlZCksXG4gICAgICAgIGFsbG93ZWRfZmlsZV90eXBlczogbW9kZWxDb25maWcuZmlsZV91cGxvYWQ/LmFsbG93ZWRfZmlsZV90eXBlcyB8fCBbXSxcbiAgICAgICAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IG1vZGVsQ29uZmlnLmZpbGVfdXBsb2FkPy5hbGxvd2VkX2ZpbGVfZXh0ZW5zaW9ucyB8fCBbLi4uRklMRV9FWFRTW1N1cHBvcnRVcGxvYWRGaWxlVHlwZXMuaW1hZ2VdLCAuLi5GSUxFX0VYVFNbU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy52aWRlb11dLm1hcChleHQgPT4gYC4ke2V4dH1gKSxcbiAgICAgICAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBtb2RlbENvbmZpZy5maWxlX3VwbG9hZD8uYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzIHx8IG1vZGVsQ29uZmlnLmZpbGVfdXBsb2FkPy5pbWFnZT8udHJhbnNmZXJfbWV0aG9kcyB8fCBbJ2xvY2FsX2ZpbGUnLCAncmVtb3RlX3VybCddLFxuICAgICAgICBudW1iZXJfbGltaXRzOiBtb2RlbENvbmZpZy5maWxlX3VwbG9hZD8ubnVtYmVyX2xpbWl0cyB8fCBtb2RlbENvbmZpZy5maWxlX3VwbG9hZD8uaW1hZ2U/Lm51bWJlcl9saW1pdHMgfHwgMyxcbiAgICAgICAgZmlsZVVwbG9hZENvbmZpZzogZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlLFxuICAgICAgfSBhcyBGaWxlVXBsb2FkLFxuICAgICAgc3VnZ2VzdGVkOiBtb2RlbENvbmZpZy5zdWdnZXN0ZWRfcXVlc3Rpb25zX2FmdGVyX2Fuc3dlciB8fCB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICBjaXRhdGlvbjogbW9kZWxDb25maWcucmV0cmlldmVyX3Jlc291cmNlIHx8IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgIGFubm90YXRpb25SZXBseTogbW9kZWxDb25maWcuYW5ub3RhdGlvbl9yZXBseSB8fCB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgfVxuICB9LCBbZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlLCBtb2RlbENvbmZpZ10pXG4gIGNvbnN0IGhhbmRsZUZlYXR1cmVzQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGZsYWc6IGFueSkgPT4ge1xuICAgIHNldFNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsKHRydWUpXG4gICAgaWYgKGZsYWcpXG4gICAgICBmb3JtYXR0aW5nQ2hhbmdlZERpc3BhdGNoZXIoKVxuICB9LCBbZm9ybWF0dGluZ0NoYW5nZWREaXNwYXRjaGVyLCBzZXRTaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbF0pXG4gIGNvbnN0IGhhbmRsZUFkZFByb21wdFZhcmlhYmxlID0gdXNlQ2FsbGJhY2soKHZhcmlhYmxlOiBQcm9tcHRWYXJpYWJsZVtdKSA9PiB7XG4gICAgY29uc3QgbmV3TW9kZWxDb25maWcgPSBwcm9kdWNlKG1vZGVsQ29uZmlnLCAoZHJhZnQ6IE1vZGVsQ29uZmlnKSA9PiB7XG4gICAgICBkcmFmdC5jb25maWdzLnByb21wdF92YXJpYWJsZXMgPSBbLi4uZHJhZnQuY29uZmlncy5wcm9tcHRfdmFyaWFibGVzLCAuLi52YXJpYWJsZV1cbiAgICB9KVxuICAgIHNldE1vZGVsQ29uZmlnKG5ld01vZGVsQ29uZmlnKVxuICB9LCBbbW9kZWxDb25maWddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb25MaXN0ID0gYXdhaXQgZmV0Y2hDb2xsZWN0aW9uTGlzdCgpXG4gICAgICBpZiAoYmFzZVBhdGgpIHtcbiAgICAgICAgY29sbGVjdGlvbkxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgaXRlbS5pY29uID09ICdzdHJpbmcnICYmICFpdGVtLmljb24uaW5jbHVkZXMoYmFzZVBhdGgpKVxuICAgICAgICAgICAgaXRlbS5pY29uID0gYCR7YmFzZVBhdGh9JHtpdGVtLmljb259YFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgc2V0Q29sbGVjdGlvbkxpc3QoY29sbGVjdGlvbkxpc3QpXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaEFwcERldGFpbERpcmVjdCh7IHVybDogJy9hcHBzJywgaWQ6IGFwcElkIH0pXG4gICAgICBzZXRNb2RlKHJlcy5tb2RlIGFzIEFwcE1vZGVFbnVtKVxuICAgICAgY29uc3QgbW9kZWxDb25maWcgPSByZXMubW9kZWxfY29uZmlnIGFzIEJhY2tlbmRNb2RlbENvbmZpZ1xuICAgICAgY29uc3QgcHJvbXB0TW9kZSA9IG1vZGVsQ29uZmlnLnByb21wdF90eXBlID09PSBQcm9tcHRNb2RlLmFkdmFuY2VkID8gUHJvbXB0TW9kZS5hZHZhbmNlZCA6IFByb21wdE1vZGUuc2ltcGxlXG4gICAgICBkb1NldFByb21wdE1vZGUocHJvbXB0TW9kZSlcbiAgICAgIGlmIChwcm9tcHRNb2RlID09PSBQcm9tcHRNb2RlLmFkdmFuY2VkKSB7XG4gICAgICAgIGlmIChtb2RlbENvbmZpZy5jaGF0X3Byb21wdF9jb25maWcgJiYgbW9kZWxDb25maWcuY2hhdF9wcm9tcHRfY29uZmlnLnByb21wdC5sZW5ndGggPiAwKVxuICAgICAgICAgIHNldENoYXRQcm9tcHRDb25maWcobW9kZWxDb25maWcuY2hhdF9wcm9tcHRfY29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgc2V0Q2hhdFByb21wdENvbmZpZyhjbG9uZShERUZBVUxUX0NIQVRfUFJPTVBUX0NPTkZJRykpXG4gICAgICAgIHNldENvbXBsZXRpb25Qcm9tcHRDb25maWcobW9kZWxDb25maWcuY29tcGxldGlvbl9wcm9tcHRfY29uZmlnIHx8IGNsb25lKERFRkFVTFRfQ09NUExFVElPTl9QUk9NUFRfQ09ORklHKSBhcyBhbnkpXG4gICAgICAgIHNldENhblJldHVyblRvU2ltcGxlTW9kZShmYWxzZSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9kZWwgPSBtb2RlbENvbmZpZy5tb2RlbFxuXG4gICAgICBsZXQgZGF0YXNldHM6IGFueSA9IG51bGxcbiAgICAgIC8vIG9sZCBkYXRhc2V0IHN0cnVjdFxuICAgICAgaWYgKG1vZGVsQ29uZmlnLmFnZW50X21vZGU/LnRvb2xzPy5maW5kKCh7IGRhdGFzZXQgfTogYW55KSA9PiBkYXRhc2V0Py5lbmFibGVkKSlcbiAgICAgICAgZGF0YXNldHMgPSBtb2RlbENvbmZpZy5hZ2VudF9tb2RlPy50b29scy5maWx0ZXIoKHsgZGF0YXNldCB9OiBhbnkpID0+IGRhdGFzZXQ/LmVuYWJsZWQpXG4gICAgICAgIC8vIG5ldyBkYXRhc2V0IHN0cnVjdFxuICAgICAgZWxzZSBpZiAobW9kZWxDb25maWcuZGF0YXNldF9jb25maWdzLmRhdGFzZXRzPy5kYXRhc2V0cz8ubGVuZ3RoID4gMClcbiAgICAgICAgZGF0YXNldHMgPSBtb2RlbENvbmZpZy5kYXRhc2V0X2NvbmZpZ3M/LmRhdGFzZXRzPy5kYXRhc2V0c1xuXG4gICAgICBpZiAoZGF0YVNldHMgJiYgZGF0YXNldHM/Lmxlbmd0aCAmJiBkYXRhc2V0cz8ubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB7IGRhdGE6IGRhdGFTZXRzV2l0aERldGFpbCB9ID0gYXdhaXQgZmV0Y2hEYXRhc2V0cyh7IHVybDogJy9kYXRhc2V0cycsIHBhcmFtczogeyBwYWdlOiAxLCBpZHM6IGRhdGFzZXRzLm1hcCgoeyBkYXRhc2V0IH06IGFueSkgPT4gZGF0YXNldC5pZCkgfSB9KVxuICAgICAgICBkYXRhc2V0cyA9IGRhdGFTZXRzV2l0aERldGFpbFxuICAgICAgICBzZXREYXRhU2V0cyhkYXRhc2V0cylcbiAgICAgIH1cblxuICAgICAgc2V0SW50cm9kdWN0aW9uKG1vZGVsQ29uZmlnLm9wZW5pbmdfc3RhdGVtZW50KVxuICAgICAgc2V0U3VnZ2VzdGVkUXVlc3Rpb25zKG1vZGVsQ29uZmlnLnN1Z2dlc3RlZF9xdWVzdGlvbnMgfHwgW10pXG4gICAgICBpZiAobW9kZWxDb25maWcubW9yZV9saWtlX3RoaXMpXG4gICAgICAgIHNldE1vcmVMaWtlVGhpc0NvbmZpZyhtb2RlbENvbmZpZy5tb3JlX2xpa2VfdGhpcylcblxuICAgICAgaWYgKG1vZGVsQ29uZmlnLnN1Z2dlc3RlZF9xdWVzdGlvbnNfYWZ0ZXJfYW5zd2VyKVxuICAgICAgICBzZXRTdWdnZXN0ZWRRdWVzdGlvbnNBZnRlckFuc3dlckNvbmZpZyhtb2RlbENvbmZpZy5zdWdnZXN0ZWRfcXVlc3Rpb25zX2FmdGVyX2Fuc3dlcilcblxuICAgICAgaWYgKG1vZGVsQ29uZmlnLnNwZWVjaF90b190ZXh0KVxuICAgICAgICBzZXRTcGVlY2hUb1RleHRDb25maWcobW9kZWxDb25maWcuc3BlZWNoX3RvX3RleHQpXG5cbiAgICAgIGlmIChtb2RlbENvbmZpZy50ZXh0X3RvX3NwZWVjaClcbiAgICAgICAgc2V0VGV4dFRvU3BlZWNoQ29uZmlnKG1vZGVsQ29uZmlnLnRleHRfdG9fc3BlZWNoKVxuXG4gICAgICBpZiAobW9kZWxDb25maWcucmV0cmlldmVyX3Jlc291cmNlKVxuICAgICAgICBzZXRDaXRhdGlvbkNvbmZpZyhtb2RlbENvbmZpZy5yZXRyaWV2ZXJfcmVzb3VyY2UpXG5cbiAgICAgIGlmIChtb2RlbENvbmZpZy5hbm5vdGF0aW9uX3JlcGx5KSB7XG4gICAgICAgIGxldCBhbm5vdGF0aW9uQ29uZmlnID0gbW9kZWxDb25maWcuYW5ub3RhdGlvbl9yZXBseVxuICAgICAgICBpZiAobW9kZWxDb25maWcuYW5ub3RhdGlvbl9yZXBseS5lbmFibGVkKSB7XG4gICAgICAgICAgYW5ub3RhdGlvbkNvbmZpZyA9IHtcbiAgICAgICAgICAgIC4uLm1vZGVsQ29uZmlnLmFubm90YXRpb25fcmVwbHksXG4gICAgICAgICAgICBlbWJlZGRpbmdfbW9kZWw6IHtcbiAgICAgICAgICAgICAgLi4ubW9kZWxDb25maWcuYW5ub3RhdGlvbl9yZXBseS5lbWJlZGRpbmdfbW9kZWwsXG4gICAgICAgICAgICAgIGVtYmVkZGluZ19wcm92aWRlcl9uYW1lOiBjb3JyZWN0TW9kZWxQcm92aWRlcihtb2RlbENvbmZpZy5hbm5vdGF0aW9uX3JlcGx5LmVtYmVkZGluZ19tb2RlbC5lbWJlZGRpbmdfcHJvdmlkZXJfbmFtZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRBbm5vdGF0aW9uQ29uZmlnKGFubm90YXRpb25Db25maWcsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIGlmIChtb2RlbENvbmZpZy5zZW5zaXRpdmVfd29yZF9hdm9pZGFuY2UpXG4gICAgICAgIHNldE1vZGVyYXRpb25Db25maWcobW9kZWxDb25maWcuc2Vuc2l0aXZlX3dvcmRfYXZvaWRhbmNlKVxuXG4gICAgICBpZiAobW9kZWxDb25maWcuZXh0ZXJuYWxfZGF0YV90b29scylcbiAgICAgICAgc2V0RXh0ZXJuYWxEYXRhVG9vbHNDb25maWcobW9kZWxDb25maWcuZXh0ZXJuYWxfZGF0YV90b29scylcblxuICAgICAgY29uc3QgY29uZmlnOiBQdWJsaXNoQ29uZmlnID0ge1xuICAgICAgICBtb2RlbENvbmZpZzoge1xuICAgICAgICAgIHByb3ZpZGVyOiBjb3JyZWN0TW9kZWxQcm92aWRlcihtb2RlbC5wcm92aWRlciksXG4gICAgICAgICAgbW9kZWxfaWQ6IG1vZGVsLm5hbWUsXG4gICAgICAgICAgbW9kZTogbW9kZWwubW9kZSxcbiAgICAgICAgICBjb25maWdzOiB7XG4gICAgICAgICAgICBwcm9tcHRfdGVtcGxhdGU6IG1vZGVsQ29uZmlnLnByZV9wcm9tcHQgfHwgJycsXG4gICAgICAgICAgICBwcm9tcHRfdmFyaWFibGVzOiB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzKFxuICAgICAgICAgICAgICAoW1xuICAgICAgICAgICAgICAgIC4uLm1vZGVsQ29uZmlnLnVzZXJfaW5wdXRfZm9ybSxcbiAgICAgICAgICAgICAgICAuLi4oXG4gICAgICAgICAgICAgICAgICBtb2RlbENvbmZpZy5leHRlcm5hbF9kYXRhX3Rvb2xzPy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgPyBtb2RlbENvbmZpZy5leHRlcm5hbF9kYXRhX3Rvb2xzLm1hcCgoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlcm5hbF9kYXRhX3Rvb2w6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZTogaXRlbS52YXJpYWJsZSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGl0ZW0ubGFiZWwgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGl0ZW0uZW5hYmxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBpdGVtLnR5cGUgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogaXRlbS5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogaXRlbS5pY29uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25fYmFja2dyb3VuZDogaXRlbS5pY29uX2JhY2tncm91bmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgOiBbXVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIF0pIGFzIHVua25vd24gYXMgVXNlcklucHV0Rm9ybUl0ZW1bXSxcbiAgICAgICAgICAgICAgbW9kZWxDb25maWcuZGF0YXNldF9xdWVyeV92YXJpYWJsZSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb3JlX2xpa2VfdGhpczogbW9kZWxDb25maWcubW9yZV9saWtlX3RoaXMgPz8geyBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgICAgIG9wZW5pbmdfc3RhdGVtZW50OiBtb2RlbENvbmZpZy5vcGVuaW5nX3N0YXRlbWVudCxcbiAgICAgICAgICBzdWdnZXN0ZWRfcXVlc3Rpb25zOiBtb2RlbENvbmZpZy5zdWdnZXN0ZWRfcXVlc3Rpb25zID8/IFtdLFxuICAgICAgICAgIHNlbnNpdGl2ZV93b3JkX2F2b2lkYW5jZTogbW9kZWxDb25maWcuc2Vuc2l0aXZlX3dvcmRfYXZvaWRhbmNlLFxuICAgICAgICAgIHNwZWVjaF90b190ZXh0OiBtb2RlbENvbmZpZy5zcGVlY2hfdG9fdGV4dCxcbiAgICAgICAgICB0ZXh0X3RvX3NwZWVjaDogbW9kZWxDb25maWcudGV4dF90b19zcGVlY2gsXG4gICAgICAgICAgZmlsZV91cGxvYWQ6IG1vZGVsQ29uZmlnLmZpbGVfdXBsb2FkID8/IG51bGwsXG4gICAgICAgICAgc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXI6IG1vZGVsQ29uZmlnLnN1Z2dlc3RlZF9xdWVzdGlvbnNfYWZ0ZXJfYW5zd2VyID8/IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgICAgICByZXRyaWV2ZXJfcmVzb3VyY2U6IG1vZGVsQ29uZmlnLnJldHJpZXZlcl9yZXNvdXJjZSxcbiAgICAgICAgICBhbm5vdGF0aW9uX3JlcGx5OiBtb2RlbENvbmZpZy5hbm5vdGF0aW9uX3JlcGx5ID8/IG51bGwsXG4gICAgICAgICAgZXh0ZXJuYWxfZGF0YV90b29sczogbW9kZWxDb25maWcuZXh0ZXJuYWxfZGF0YV90b29scyA/PyBbXSxcbiAgICAgICAgICBzeXN0ZW1fcGFyYW1ldGVyczogbW9kZWxDb25maWcuc3lzdGVtX3BhcmFtZXRlcnMsXG4gICAgICAgICAgZGF0YVNldHM6IGRhdGFzZXRzIHx8IFtdLFxuICAgICAgICAgIGFnZW50Q29uZmlnOiByZXMubW9kZSA9PT0gQXBwTW9kZUVudW0uQUdFTlRfQ0hBVCA/IHtcbiAgICAgICAgICAgIG1heF9pdGVyYXRpb246IERFRkFVTFRfQUdFTlRfU0VUVElORy5tYXhfaXRlcmF0aW9uLFxuICAgICAgICAgICAgLi4ubW9kZWxDb25maWcuYWdlbnRfbW9kZSxcbiAgICAgICAgICAgIC8vIHJlbW92ZSBkYXRhc2V0XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLCAvLyBtb2RlbENvbmZpZy5hZ2VudF9tb2RlPy5lbmFibGVkIGlzIG5vdCBjb3JyZWN0LiBvbGQgYXBwOiB0aGUgdmFsdWUgb2YgYXBwIHdpdGggZGF0YXNldCdzIGlzIGFsd2F5cyB0cnVlXG4gICAgICAgICAgICB0b29sczogKG1vZGVsQ29uZmlnLmFnZW50X21vZGU/LnRvb2xzID8/IFtdKS5maWx0ZXIoKHRvb2w6IGFueSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gIXRvb2wuZGF0YXNldFxuICAgICAgICAgICAgfSkubWFwKCh0b29sOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdG9vbEluQ29sbGVjdGlvbkxpc3QgPSBjb2xsZWN0aW9uTGlzdC5maW5kKGMgPT4gdG9vbC5wcm92aWRlcl9pZCA9PT0gYy5pZClcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi50b29sLFxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogcmVzLmRlbGV0ZWRfdG9vbHM/LnNvbWUoKGRlbGV0ZWRUb29sOiBhbnkpID0+IGRlbGV0ZWRUb29sLnByb3ZpZGVyX2lkID09PSB0b29sLnByb3ZpZGVyX2lkICYmIGRlbGV0ZWRUb29sLnRvb2xfbmFtZSA9PT0gdG9vbC50b29sX25hbWUpID8/IGZhbHNlLFxuICAgICAgICAgICAgICAgIG5vdEF1dGhvcjogdG9vbEluQ29sbGVjdGlvbkxpc3Q/LmlzX3RlYW1fYXV0aG9yaXphdGlvbiA9PT0gZmFsc2UsXG4gICAgICAgICAgICAgICAgLi4uKHRvb2wucHJvdmlkZXJfdHlwZSA9PT0gJ2J1aWx0aW4nXG4gICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcl9pZDogY29ycmVjdFRvb2xQcm92aWRlcih0b29sLnByb3ZpZGVyX25hbWUsICEhdG9vbEluQ29sbGVjdGlvbkxpc3QpLFxuICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyX25hbWU6IGNvcnJlY3RUb29sUHJvdmlkZXIodG9vbC5wcm92aWRlcl9uYW1lLCAhIXRvb2xJbkNvbGxlY3Rpb25MaXN0KSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgOiB7fSksXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc3RyYXRlZ3k6IG1vZGVsQ29uZmlnLmFnZW50X21vZGU/LnN0cmF0ZWd5ID8/IEFnZW50U3RyYXRlZ3kucmVhY3QsXG4gICAgICAgICAgfSA6IERFRkFVTFRfQUdFTlRfU0VUVElORyxcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGlvblBhcmFtczogbW9kZWwuY29tcGxldGlvbl9wYXJhbXMsXG4gICAgICB9XG5cbiAgICAgIGlmIChtb2RlbENvbmZpZy5maWxlX3VwbG9hZClcbiAgICAgICAgaGFuZGxlU2V0VmlzaW9uQ29uZmlnKG1vZGVsQ29uZmlnLmZpbGVfdXBsb2FkLmltYWdlLCB0cnVlKVxuXG4gICAgICBzeW5jVG9QdWJsaXNoZWRDb25maWcoY29uZmlnKVxuICAgICAgc2V0UHVibGlzaGVkQ29uZmlnKGNvbmZpZylcbiAgICAgIGNvbnN0IHJldHJpZXZhbENvbmZpZyA9IGdldE11bHRpcGxlUmV0cmlldmFsQ29uZmlnKHtcbiAgICAgICAgLi4ubW9kZWxDb25maWcuZGF0YXNldF9jb25maWdzLFxuICAgICAgICByZXJhbmtpbmdfbW9kZWw6IG1vZGVsQ29uZmlnLmRhdGFzZXRfY29uZmlncy5yZXJhbmtpbmdfbW9kZWwgJiYge1xuICAgICAgICAgIHByb3ZpZGVyOiBtb2RlbENvbmZpZy5kYXRhc2V0X2NvbmZpZ3MucmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19wcm92aWRlcl9uYW1lLFxuICAgICAgICAgIG1vZGVsOiBtb2RlbENvbmZpZy5kYXRhc2V0X2NvbmZpZ3MucmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19tb2RlbF9uYW1lLFxuICAgICAgICB9LFxuICAgICAgfSwgZGF0YXNldHMsIGRhdGFzZXRzLCB7XG4gICAgICAgIHByb3ZpZGVyOiBjdXJyZW50UmVyYW5rUHJvdmlkZXI/LnByb3ZpZGVyLFxuICAgICAgICBtb2RlbDogY3VycmVudFJlcmFua01vZGVsPy5tb2RlbCxcbiAgICAgIH0pXG4gICAgICBjb25zdCBkYXRhc2V0Q29uZmlnc1RvU2V0ID0ge1xuICAgICAgICAuLi5tb2RlbENvbmZpZy5kYXRhc2V0X2NvbmZpZ3MsXG4gICAgICAgIC4uLnJldHJpZXZhbENvbmZpZyxcbiAgICAgICAgLi4uKHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfbW9kZWxcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfbW9kZWwubW9kZWwsXG4gICAgICAgICAgICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6IGNvcnJlY3RNb2RlbFByb3ZpZGVyKHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfbW9kZWwucHJvdmlkZXIpLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIDoge30pLFxuICAgICAgfSBhcyBEYXRhc2V0Q29uZmlnc1xuICAgICAgZGF0YXNldENvbmZpZ3NUb1NldC5yZXRyaWV2YWxfbW9kZWwgPSBkYXRhc2V0Q29uZmlnc1RvU2V0LnJldHJpZXZhbF9tb2RlbCA/PyBSRVRSSUVWRV9UWVBFLm11bHRpV2F5XG4gICAgICBzZXREYXRhc2V0Q29uZmlncyhkYXRhc2V0Q29uZmlnc1RvU2V0KVxuICAgICAgc2V0SGFzRmV0Y2hlZERldGFpbCh0cnVlKVxuICAgIH0pKClcbiAgfSwgW2FwcElkXSlcblxuICBjb25zdCBwcm9tcHRFbXB0eSA9ICgoKSA9PiB7XG4gICAgaWYgKG1vZGUgIT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04pXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGlmIChpc0FkdmFuY2VkTW9kZSkge1xuICAgICAgaWYgKG1vZGVsTW9kZVR5cGUgPT09IE1vZGVsTW9kZVR5cGUuY2hhdClcbiAgICAgICAgcmV0dXJuIGNoYXRQcm9tcHRDb25maWcucHJvbXB0LmV2ZXJ5KCh7IHRleHQgfTogYW55KSA9PiAhdGV4dClcblxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gIWNvbXBsZXRpb25Qcm9tcHRDb25maWcucHJvbXB0Py50ZXh0XG4gICAgfVxuXG4gICAgZWxzZSB7IHJldHVybiAhbW9kZWxDb25maWcuY29uZmlncy5wcm9tcHRfdGVtcGxhdGUgfVxuICB9KSgpXG4gIGNvbnN0IGNhbm5vdFB1Ymxpc2ggPSAoKCkgPT4ge1xuICAgIGlmIChtb2RlICE9PSBBcHBNb2RlRW51bS5DT01QTEVUSU9OKSB7XG4gICAgICBpZiAoIWlzQWR2YW5jZWRNb2RlKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgaWYgKG1vZGVsTW9kZVR5cGUgPT09IE1vZGVsTW9kZVR5cGUuY29tcGxldGlvbikge1xuICAgICAgICBpZiAoIWhhc1NldEJsb2NrU3RhdHVzLmhpc3RvcnkgfHwgIWhhc1NldEJsb2NrU3RhdHVzLnF1ZXJ5KVxuICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBlbHNlIHsgcmV0dXJuIHByb21wdEVtcHR5IH1cbiAgfSkoKVxuICBjb25zdCBjb250ZXh0VmFyRW1wdHkgPSBtb2RlID09PSBBcHBNb2RlRW51bS5DT01QTEVUSU9OICYmIGRhdGFTZXRzLmxlbmd0aCA+IDAgJiYgIWhhc1NldENvbnRleHRWYXJcbiAgY29uc3Qgb25QdWJsaXNoID0gYXN5bmMgKG1vZGVsQW5kUGFyYW1ldGVyPzogTW9kZWxBbmRQYXJhbWV0ZXIsIGZlYXR1cmVzPzogRmVhdHVyZXNEYXRhKSA9PiB7XG4gICAgY29uc3QgbW9kZWxJZCA9IG1vZGVsQW5kUGFyYW1ldGVyPy5tb2RlbCB8fCBtb2RlbENvbmZpZy5tb2RlbF9pZFxuICAgIGNvbnN0IHByb21wdFRlbXBsYXRlID0gbW9kZWxDb25maWcuY29uZmlncy5wcm9tcHRfdGVtcGxhdGVcbiAgICBjb25zdCBwcm9tcHRWYXJpYWJsZXMgPSBtb2RlbENvbmZpZy5jb25maWdzLnByb21wdF92YXJpYWJsZXNcblxuICAgIGlmIChwcm9tcHRFbXB0eSkge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnb3RoZXJFcnJvci5wcm9tcHROb0JlRW1wdHknLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKGlzQWR2YW5jZWRNb2RlICYmIG1vZGUgIT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04pIHtcbiAgICAgIGlmIChtb2RlbE1vZGVUeXBlID09PSBNb2RlbE1vZGVUeXBlLmNvbXBsZXRpb24pIHtcbiAgICAgICAgaWYgKCFoYXNTZXRCbG9ja1N0YXR1cy5oaXN0b3J5KSB7XG4gICAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnb3RoZXJFcnJvci5oaXN0b3J5Tm9CZUVtcHR5JywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzU2V0QmxvY2tTdGF0dXMucXVlcnkpIHtcbiAgICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdvdGhlckVycm9yLnF1ZXJ5Tm9CZUVtcHR5JywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb250ZXh0VmFyRW1wdHkpIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2ZlYXR1cmUuZGF0YVNldC5xdWVyeVZhcmlhYmxlLmNvbnRleHRWYXJOb3RFbXB0eScsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBwb3N0RGF0YXNldHMgPSBkYXRhU2V0cy5tYXAoKHsgaWQgfSkgPT4gKHtcbiAgICAgIGRhdGFzZXQ6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgaWQsXG4gICAgICB9LFxuICAgIH0pKVxuXG4gICAgY29uc3QgZmlsZVVwbG9hZCA9IHsgLi4uZmVhdHVyZXM/LmZpbGUgfVxuICAgIGRlbGV0ZSBmaWxlVXBsb2FkPy5maWxlVXBsb2FkQ29uZmlnXG5cbiAgICAvLyBuZXcgbW9kZWwgY29uZmlnIGRhdGEgc3RydWN0XG4gICAgY29uc3QgZGF0YTogQmFja2VuZE1vZGVsQ29uZmlnID0ge1xuICAgICAgLy8gU2ltcGxlIE1vZGUgcHJvbXB0XG4gICAgICBwcmVfcHJvbXB0OiAhaXNBZHZhbmNlZE1vZGUgPyBwcm9tcHRUZW1wbGF0ZSA6ICcnLFxuICAgICAgcHJvbXB0X3R5cGU6IHByb21wdE1vZGUsXG4gICAgICBjaGF0X3Byb21wdF9jb25maWc6IGlzQWR2YW5jZWRNb2RlID8gY2hhdFByb21wdENvbmZpZyA6IGNsb25lKERFRkFVTFRfQ0hBVF9QUk9NUFRfQ09ORklHKSxcbiAgICAgIGNvbXBsZXRpb25fcHJvbXB0X2NvbmZpZzogaXNBZHZhbmNlZE1vZGUgPyBjb21wbGV0aW9uUHJvbXB0Q29uZmlnIDogY2xvbmUoREVGQVVMVF9DT01QTEVUSU9OX1BST01QVF9DT05GSUcpLFxuICAgICAgdXNlcl9pbnB1dF9mb3JtOiBwcm9tcHRWYXJpYWJsZXNUb1VzZXJJbnB1dHNGb3JtKHByb21wdFZhcmlhYmxlcyksXG4gICAgICBkYXRhc2V0X3F1ZXJ5X3ZhcmlhYmxlOiBjb250ZXh0VmFyIHx8ICcnLFxuICAgICAgLy8gIGZlYXR1cmVzXG4gICAgICBtb3JlX2xpa2VfdGhpczogZmVhdHVyZXM/Lm1vcmVMaWtlVGhpcyBhcyBhbnksXG4gICAgICBvcGVuaW5nX3N0YXRlbWVudDogZmVhdHVyZXM/Lm9wZW5pbmc/LmVuYWJsZWQgPyAoZmVhdHVyZXMub3BlbmluZz8ub3BlbmluZ19zdGF0ZW1lbnQgfHwgJycpIDogJycsXG4gICAgICBzdWdnZXN0ZWRfcXVlc3Rpb25zOiBmZWF0dXJlcz8ub3BlbmluZz8uZW5hYmxlZCA/IChmZWF0dXJlcy5vcGVuaW5nPy5zdWdnZXN0ZWRfcXVlc3Rpb25zIHx8IFtdKSA6IFtdLFxuICAgICAgc2Vuc2l0aXZlX3dvcmRfYXZvaWRhbmNlOiBmZWF0dXJlcz8ubW9kZXJhdGlvbiBhcyBhbnksXG4gICAgICBzcGVlY2hfdG9fdGV4dDogZmVhdHVyZXM/LnNwZWVjaDJ0ZXh0IGFzIGFueSxcbiAgICAgIHRleHRfdG9fc3BlZWNoOiBmZWF0dXJlcz8udGV4dDJzcGVlY2ggYXMgYW55LFxuICAgICAgZmlsZV91cGxvYWQ6IGZpbGVVcGxvYWQgYXMgYW55LFxuICAgICAgc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXI6IGZlYXR1cmVzPy5zdWdnZXN0ZWQgYXMgYW55LFxuICAgICAgcmV0cmlldmVyX3Jlc291cmNlOiBmZWF0dXJlcz8uY2l0YXRpb24gYXMgYW55LFxuICAgICAgYWdlbnRfbW9kZToge1xuICAgICAgICAuLi5tb2RlbENvbmZpZy5hZ2VudENvbmZpZyxcbiAgICAgICAgc3RyYXRlZ3k6IGlzRnVuY3Rpb25DYWxsID8gQWdlbnRTdHJhdGVneS5mdW5jdGlvbkNhbGwgOiBBZ2VudFN0cmF0ZWd5LnJlYWN0LFxuICAgICAgfSxcbiAgICAgIGV4dGVybmFsX2RhdGFfdG9vbHM6IGV4dGVybmFsRGF0YVRvb2xzQ29uZmlnLFxuICAgICAgbW9kZWw6IHtcbiAgICAgICAgcHJvdmlkZXI6IG1vZGVsQW5kUGFyYW1ldGVyPy5wcm92aWRlciB8fCBtb2RlbENvbmZpZy5wcm92aWRlcixcbiAgICAgICAgbmFtZTogbW9kZWxJZCxcbiAgICAgICAgbW9kZTogbW9kZWxDb25maWcubW9kZSxcbiAgICAgICAgY29tcGxldGlvbl9wYXJhbXM6IG1vZGVsQW5kUGFyYW1ldGVyPy5wYXJhbWV0ZXJzIHx8IGNvbXBsZXRpb25QYXJhbXMgYXMgYW55LFxuICAgICAgfSxcbiAgICAgIGRhdGFzZXRfY29uZmlnczoge1xuICAgICAgICAuLi5kYXRhc2V0Q29uZmlncyxcbiAgICAgICAgZGF0YXNldHM6IHtcbiAgICAgICAgICBkYXRhc2V0czogWy4uLnBvc3REYXRhc2V0c10sXG4gICAgICAgIH0gYXMgYW55LFxuICAgICAgfSxcbiAgICAgIHN5c3RlbV9wYXJhbWV0ZXJzOiBtb2RlbENvbmZpZy5zeXN0ZW1fcGFyYW1ldGVycyxcbiAgICB9XG5cbiAgICBhd2FpdCB1cGRhdGVBcHBNb2RlbENvbmZpZyh7IHVybDogYC9hcHBzLyR7YXBwSWR9L21vZGVsLWNvbmZpZ2AsIGJvZHk6IGRhdGEgfSlcbiAgICBjb25zdCBuZXdNb2RlbENvbmZpZyA9IHByb2R1Y2UobW9kZWxDb25maWcsIChkcmFmdDogYW55KSA9PiB7XG4gICAgICBkcmFmdC5vcGVuaW5nX3N0YXRlbWVudCA9IGludHJvZHVjdGlvblxuICAgICAgZHJhZnQubW9yZV9saWtlX3RoaXMgPSBtb3JlTGlrZVRoaXNDb25maWdcbiAgICAgIGRyYWZ0LnN1Z2dlc3RlZF9xdWVzdGlvbnNfYWZ0ZXJfYW5zd2VyID0gc3VnZ2VzdGVkUXVlc3Rpb25zQWZ0ZXJBbnN3ZXJDb25maWdcbiAgICAgIGRyYWZ0LnNwZWVjaF90b190ZXh0ID0gc3BlZWNoVG9UZXh0Q29uZmlnXG4gICAgICBkcmFmdC50ZXh0X3RvX3NwZWVjaCA9IHRleHRUb1NwZWVjaENvbmZpZ1xuICAgICAgZHJhZnQucmV0cmlldmVyX3Jlc291cmNlID0gY2l0YXRpb25Db25maWdcbiAgICAgIGRyYWZ0LmRhdGFTZXRzID0gZGF0YVNldHNcbiAgICB9KVxuICAgIHNldFB1Ymxpc2hlZENvbmZpZyh7XG4gICAgICBtb2RlbENvbmZpZzogbmV3TW9kZWxDb25maWcsXG4gICAgICBjb21wbGV0aW9uUGFyYW1zLFxuICAgIH0pXG4gICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhcGkuc3VjY2VzcycsIHsgbnM6ICdjb21tb24nIH0pIH0pXG5cbiAgICBzZXRDYW5SZXR1cm5Ub1NpbXBsZU1vZGUoZmFsc2UpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGNvbnN0IFtzaG93VXNlR1BUNENvbmZpcm0sIHNldFNob3dVc2VHUFQ0Q29uZmlybV0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICBjb25zdCB7XG4gICAgZGVidWdXaXRoTXVsdGlwbGVNb2RlbCxcbiAgICBtdWx0aXBsZU1vZGVsQ29uZmlncyxcbiAgICBoYW5kbGVNdWx0aXBsZU1vZGVsQ29uZmlnc0NoYW5nZSxcbiAgfSA9IHVzZURlYnVnV2l0aFNpbmdsZU9yTXVsdGlwbGVNb2RlbChhcHBJZClcblxuICBjb25zdCBoYW5kbGVEZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsQ2hhbmdlID0gKCkgPT4ge1xuICAgIGhhbmRsZU11bHRpcGxlTW9kZWxDb25maWdzQ2hhbmdlKFxuICAgICAgdHJ1ZSxcbiAgICAgIFtcbiAgICAgICAgeyBpZDogYCR7RGF0ZS5ub3coKX1gLCBtb2RlbDogbW9kZWxDb25maWcubW9kZWxfaWQsIHByb3ZpZGVyOiBtb2RlbENvbmZpZy5wcm92aWRlciwgcGFyYW1ldGVyczogY29tcGxldGlvblBhcmFtcyB9LFxuICAgICAgICB7IGlkOiBgJHtEYXRlLm5vdygpfS1uby1yZXBlYXRgLCBtb2RlbDogJycsIHByb3ZpZGVyOiAnJywgcGFyYW1ldGVyczoge30gfSxcbiAgICAgIF0sXG4gICAgKVxuICAgIHNldEFwcFNpZGViYXJFeHBhbmQoJ2NvbGxhcHNlJylcbiAgfVxuXG4gIGlmIChpc0xvYWRpbmcgfHwgaXNMb2FkaW5nQ3VycmVudFdvcmtzcGFjZSB8fCAhY3VycmVudFdvcmtzcGFjZS5pZCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1mdWxsIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICA8TG9hZGluZyB0eXBlPVwiYXJlYVwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbiAgY29uc3QgdmFsdWUgPSB7XG4gICAgYXBwSWQsXG4gICAgaXNBUElLZXlTZXQsXG4gICAgaXNUcmFpbEZpbmlzaGVkOiBmYWxzZSxcbiAgICBtb2RlLFxuICAgIG1vZGVsTW9kZVR5cGUsXG4gICAgcHJvbXB0TW9kZSxcbiAgICBpc0FkdmFuY2VkTW9kZSxcbiAgICBpc0FnZW50LFxuICAgIGlzT3BlbkFJLFxuICAgIGlzRnVuY3Rpb25DYWxsLFxuICAgIGNvbGxlY3Rpb25MaXN0LFxuICAgIHNldFByb21wdE1vZGUsXG4gICAgY2FuUmV0dXJuVG9TaW1wbGVNb2RlLFxuICAgIHNldENhblJldHVyblRvU2ltcGxlTW9kZSxcbiAgICBjaGF0UHJvbXB0Q29uZmlnLFxuICAgIGNvbXBsZXRpb25Qcm9tcHRDb25maWcsXG4gICAgY3VycmVudEFkdmFuY2VkUHJvbXB0LFxuICAgIHNldEN1cnJlbnRBZHZhbmNlZFByb21wdCxcbiAgICBjb252ZXJzYXRpb25IaXN0b3JpZXNSb2xlOiBjb21wbGV0aW9uUHJvbXB0Q29uZmlnLmNvbnZlcnNhdGlvbl9oaXN0b3JpZXNfcm9sZSxcbiAgICBzaG93SGlzdG9yeU1vZGFsLFxuICAgIHNldENvbnZlcnNhdGlvbkhpc3Rvcmllc1JvbGUsXG4gICAgaGFzU2V0QmxvY2tTdGF0dXMsXG4gICAgY29udmVyc2F0aW9uSWQsXG4gICAgaW50cm9kdWN0aW9uLFxuICAgIHNldEludHJvZHVjdGlvbixcbiAgICBzdWdnZXN0ZWRRdWVzdGlvbnMsXG4gICAgc2V0U3VnZ2VzdGVkUXVlc3Rpb25zLFxuICAgIHNldENvbnZlcnNhdGlvbklkLFxuICAgIGNvbnRyb2xDbGVhckNoYXRNZXNzYWdlLFxuICAgIHNldENvbnRyb2xDbGVhckNoYXRNZXNzYWdlLFxuICAgIHByZXZQcm9tcHRDb25maWcsXG4gICAgc2V0UHJldlByb21wdENvbmZpZyxcbiAgICBtb3JlTGlrZVRoaXNDb25maWcsXG4gICAgc2V0TW9yZUxpa2VUaGlzQ29uZmlnLFxuICAgIHN1Z2dlc3RlZFF1ZXN0aW9uc0FmdGVyQW5zd2VyQ29uZmlnLFxuICAgIHNldFN1Z2dlc3RlZFF1ZXN0aW9uc0FmdGVyQW5zd2VyQ29uZmlnLFxuICAgIHNwZWVjaFRvVGV4dENvbmZpZyxcbiAgICBzZXRTcGVlY2hUb1RleHRDb25maWcsXG4gICAgdGV4dFRvU3BlZWNoQ29uZmlnLFxuICAgIHNldFRleHRUb1NwZWVjaENvbmZpZyxcbiAgICBjaXRhdGlvbkNvbmZpZyxcbiAgICBzZXRDaXRhdGlvbkNvbmZpZyxcbiAgICBhbm5vdGF0aW9uQ29uZmlnLFxuICAgIHNldEFubm90YXRpb25Db25maWcsXG4gICAgbW9kZXJhdGlvbkNvbmZpZyxcbiAgICBzZXRNb2RlcmF0aW9uQ29uZmlnLFxuICAgIGV4dGVybmFsRGF0YVRvb2xzQ29uZmlnLFxuICAgIHNldEV4dGVybmFsRGF0YVRvb2xzQ29uZmlnLFxuICAgIGZvcm1hdHRpbmdDaGFuZ2VkLFxuICAgIHNldEZvcm1hdHRpbmdDaGFuZ2VkLFxuICAgIGlucHV0cyxcbiAgICBzZXRJbnB1dHMsXG4gICAgcXVlcnksXG4gICAgc2V0UXVlcnksXG4gICAgY29tcGxldGlvblBhcmFtcyxcbiAgICBzZXRDb21wbGV0aW9uUGFyYW1zLFxuICAgIG1vZGVsQ29uZmlnLFxuICAgIHNldE1vZGVsQ29uZmlnLFxuICAgIHNob3dTZWxlY3REYXRhU2V0LFxuICAgIGRhdGFTZXRzLFxuICAgIHNldERhdGFTZXRzLFxuICAgIGRhdGFzZXRDb25maWdzLFxuICAgIGRhdGFzZXRDb25maWdzUmVmLFxuICAgIHNldERhdGFzZXRDb25maWdzLFxuICAgIGhhc1NldENvbnRleHRWYXIsXG4gICAgaXNTaG93VmlzaW9uQ29uZmlnLFxuICAgIHZpc2lvbkNvbmZpZyxcbiAgICBzZXRWaXNpb25Db25maWc6IGhhbmRsZVNldFZpc2lvbkNvbmZpZyxcbiAgICBpc0FsbG93VmlkZW9VcGxvYWQsXG4gICAgaXNTaG93RG9jdW1lbnRDb25maWcsXG4gICAgaXNTaG93QXVkaW9Db25maWcsXG4gICAgcmVyYW5rU2V0dGluZ01vZGFsT3BlbixcbiAgICBzZXRSZXJhbmtTZXR0aW5nTW9kYWxPcGVuLFxuICB9XG4gIHJldHVybiAoXG4gICAgPENvbmZpZ0NvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT5cbiAgICAgIDxGZWF0dXJlc1Byb3ZpZGVyIGZlYXR1cmVzPXtmZWF0dXJlc0RhdGF9PlxuICAgICAgICA8TWl0dFByb3ZpZGVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgZmxleC1jb2xcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBoLVsyMDBweF0gZ3JvdyBwdC0xNFwiPlxuICAgICAgICAgICAgICB7LyogSGVhZGVyICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWRlZmF1bHQtc3VidGxlIGFic29sdXRlIGxlZnQtMCB0b3AtMCBoLTE0IHctZnVsbFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTE0IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtNlwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14bC1zZW1pYm9sZCB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KCdvcmNoZXN0cmF0ZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLVsxNHB4XSBpdGVtcy1jZW50ZXIgc3BhY2UteC0xIHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7aXNBZHZhbmNlZE1vZGUgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtbWVkaXVtLXVwcGVyY2FzZSBtbC0xIGZsZXggaC01IGl0ZW1zLWNlbnRlciByb3VuZGVkLW1kIGJvcmRlciBib3JkZXItY29tcG9uZW50cy1idXR0b24tc2Vjb25kYXJ5LWJvcmRlciBweC0xLjUgdXBwZXJjYXNlIHRleHQtdGV4dC10ZXJ0aWFyeVwiPnt0KCdwcm9tcHRNb2RlLmFkdmFuY2VkJywgeyBuczogJ2FwcERlYnVnJyB9KX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICB7LyogQWdlbnQgU2V0dGluZyAqL31cbiAgICAgICAgICAgICAgICAgICAge2lzQWdlbnQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxBZ2VudFNldHRpbmdCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2hhdE1vZGVsPXttb2RlbENvbmZpZy5tb2RlID09PSBNb2RlbE1vZGVUeXBlLmNoYXR9XG4gICAgICAgICAgICAgICAgICAgICAgICBhZ2VudENvbmZpZz17bW9kZWxDb25maWcuYWdlbnRDb25maWd9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRnVuY3Rpb25DYWxsPXtpc0Z1bmN0aW9uQ2FsbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQWdlbnRTZXR0aW5nQ2hhbmdlPXsoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRDb25maWcgPSBwcm9kdWNlKG1vZGVsQ29uZmlnLCAoZHJhZnQ6IE1vZGVsQ29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJhZnQuYWdlbnRDb25maWcgPSBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0TW9kZWxDb25maWcobmV4dENvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgey8qIE1vZGVsIGFuZCBQYXJhbWV0ZXJzICovfVxuICAgICAgICAgICAgICAgICAgICB7IWRlYnVnV2l0aE11bHRpcGxlTW9kZWwgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8TW9kZWxQYXJhbWV0ZXJNb2RhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc0FkdmFuY2VkTW9kZT17aXNBZHZhbmNlZE1vZGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyPXttb2RlbENvbmZpZy5wcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvblBhcmFtcz17Y29tcGxldGlvblBhcmFtc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxJZD17bW9kZWxDb25maWcubW9kZWxfaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldE1vZGVsPXtzZXRNb2RlbCBhcyBhbnl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZT17KG5ld1BhcmFtczogRm9ybVZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q29tcGxldGlvblBhcmFtcyhuZXdQYXJhbXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnV2l0aE11bHRpcGxlTW9kZWw9e2RlYnVnV2l0aE11bHRpcGxlTW9kZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uRGVidWdXaXRoTXVsdGlwbGVNb2RlbENoYW5nZT17aGFuZGxlRGVidWdXaXRoTXVsdGlwbGVNb2RlbENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8RGl2aWRlciB0eXBlPVwidmVydGljYWxcIiBjbGFzc05hbWU9XCJteC0yIGgtWzE0cHhdXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAge2lzTW9iaWxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT1cIm1yLTIgIWgtOCAhdGV4dC1bMTNweF0gZm9udC1tZWRpdW1cIiBvbkNsaWNrPXtzaG93RGVidWdQYW5lbH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtci0xXCI+e3QoJ29wZXJhdGlvbi5kZWJ1Z0NvbmZpZycsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPENvZGVCcmFja2V0SWNvbiBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDxBcHBQdWJsaXNoZXIgey4uLntcbiAgICAgICAgICAgICAgICAgICAgICBwdWJsaXNoRGlzYWJsZWQ6IGNhbm5vdFB1Ymxpc2gsXG4gICAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkQXQ6IChsYXRlc3RQdWJsaXNoZWRBdCB8fCAwKSAqIDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgZGVidWdXaXRoTXVsdGlwbGVNb2RlbCxcbiAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZU1vZGVsQ29uZmlncyxcbiAgICAgICAgICAgICAgICAgICAgICBvblB1Ymxpc2gsXG4gICAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkQ29uZmlnOiBwdWJsaXNoZWRDb25maWchLFxuICAgICAgICAgICAgICAgICAgICAgIHJlc2V0QXBwQ29uZmlnOiAoKSA9PiBzeW5jVG9QdWJsaXNoZWRDb25maWcocHVibGlzaGVkQ29uZmlnISksXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZmxleCBoLWZ1bGwgdy1mdWxsIHNocmluay0wIGZsZXgtY29sIHNtOnctMS8yICR7ZGVidWdXaXRoTXVsdGlwbGVNb2RlbCAmJiAnbWF4LXctWzU2MHB4XSd9YH0+XG4gICAgICAgICAgICAgICAgPENvbmZpZyAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgeyFpc01vYmlsZSAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4IGgtZnVsbCB3LTEvMiBncm93IGZsZXgtY29sIG92ZXJmbG93LXktYXV0byBcIiBzdHlsZT17eyBib3JkZXJDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC4wMiknIH19PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdyb3cgZmxleC1jb2wgcm91bmRlZC10bC0yeGwgYm9yZGVyLWwtWzAuNXB4XSBib3JkZXItdC1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jaGF0Ym90LWJnIFwiPlxuICAgICAgICAgICAgICAgICAgICA8RGVidWdcbiAgICAgICAgICAgICAgICAgICAgICBpc0FQSUtleVNldD17aXNBUElLZXlTZXR9XG4gICAgICAgICAgICAgICAgICAgICAgb25TZXR0aW5nPXsoKSA9PiBzZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCh7IHBheWxvYWQ6IEFDQ09VTlRfU0VUVElOR19UQUIuUFJPVklERVIgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgaW5wdXRzPXtpbnB1dHN9XG4gICAgICAgICAgICAgICAgICAgICAgbW9kZWxQYXJhbWV0ZXJQYXJhbXM9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldE1vZGVsOiBzZXRNb2RlbCBhcyBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2U6IHNldENvbXBsZXRpb25QYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsPXtkZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsfVxuICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlTW9kZWxDb25maWdzPXttdWx0aXBsZU1vZGVsQ29uZmlnc31cbiAgICAgICAgICAgICAgICAgICAgICBvbk11bHRpcGxlTW9kZWxDb25maWdzQ2hhbmdlPXtoYW5kbGVNdWx0aXBsZU1vZGVsQ29uZmlnc0NoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3Nob3dVc2VHUFQ0Q29uZmlybSAmJiAoXG4gICAgICAgICAgICA8Q29uZmlybVxuICAgICAgICAgICAgICB0aXRsZT17dCgndHJhaWxVc2VHUFQ0SW5mby50aXRsZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9XG4gICAgICAgICAgICAgIGNvbnRlbnQ9e3QoJ3RyYWlsVXNlR1BUNEluZm8uZGVzY3JpcHRpb24nLCB7IG5zOiAnYXBwRGVidWcnIH0pfVxuICAgICAgICAgICAgICBpc1Nob3c9e3Nob3dVc2VHUFQ0Q29uZmlybX1cbiAgICAgICAgICAgICAgb25Db25maXJtPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwoeyBwYXlsb2FkOiBBQ0NPVU5UX1NFVFRJTkdfVEFCLlBST1ZJREVSIH0pXG4gICAgICAgICAgICAgICAgc2V0U2hvd1VzZUdQVDRDb25maXJtKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbkNhbmNlbD17KCkgPT4gc2V0U2hvd1VzZUdQVDRDb25maXJtKGZhbHNlKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtpc1Nob3dTZWxlY3REYXRhU2V0ICYmIChcbiAgICAgICAgICAgIDxTZWxlY3REYXRhU2V0XG4gICAgICAgICAgICAgIGlzU2hvdz17aXNTaG93U2VsZWN0RGF0YVNldH1cbiAgICAgICAgICAgICAgb25DbG9zZT17aGlkZVNlbGVjdERhdGFTZXR9XG4gICAgICAgICAgICAgIHNlbGVjdGVkSWRzPXtzZWxlY3RlZElkc31cbiAgICAgICAgICAgICAgb25TZWxlY3Q9e2hhbmRsZVNlbGVjdH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtpc1Nob3dIaXN0b3J5TW9kYWwgJiYgKFxuICAgICAgICAgICAgPEVkaXRIaXN0b3J5TW9kYWxcbiAgICAgICAgICAgICAgaXNTaG93PXtpc1Nob3dIaXN0b3J5TW9kYWx9XG4gICAgICAgICAgICAgIHNhdmVMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICAgICAgb25DbG9zZT17aGlkZUhpc3RvcnlNb2RhbH1cbiAgICAgICAgICAgICAgZGF0YT17Y29tcGxldGlvblByb21wdENvbmZpZy5jb252ZXJzYXRpb25faGlzdG9yaWVzX3JvbGV9XG4gICAgICAgICAgICAgIG9uU2F2ZT17KGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRDb252ZXJzYXRpb25IaXN0b3JpZXNSb2xlKGRhdGEpXG4gICAgICAgICAgICAgICAgaGlkZUhpc3RvcnlNb2RhbCgpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAge2lzTW9iaWxlICYmIChcbiAgICAgICAgICAgIDxEcmF3ZXIgc2hvd0Nsb3NlIGlzT3Blbj17aXNTaG93RGVidWdQYW5lbH0gb25DbG9zZT17aGlkZURlYnVnUGFuZWx9IG1hc2sgZm9vdGVyPXtudWxsfT5cbiAgICAgICAgICAgICAgPERlYnVnXG4gICAgICAgICAgICAgICAgaXNBUElLZXlTZXQ9e2lzQVBJS2V5U2V0fVxuICAgICAgICAgICAgICAgIG9uU2V0dGluZz17KCkgPT4gc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwoeyBwYXlsb2FkOiBBQ0NPVU5UX1NFVFRJTkdfVEFCLlBST1ZJREVSIH0pfVxuICAgICAgICAgICAgICAgIGlucHV0cz17aW5wdXRzfVxuICAgICAgICAgICAgICAgIG1vZGVsUGFyYW1ldGVyUGFyYW1zPXt7XG4gICAgICAgICAgICAgICAgICBzZXRNb2RlbDogc2V0TW9kZWwgYXMgYW55LFxuICAgICAgICAgICAgICAgICAgb25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlOiBzZXRDb21wbGV0aW9uUGFyYW1zLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgZGVidWdXaXRoTXVsdGlwbGVNb2RlbD17ZGVidWdXaXRoTXVsdGlwbGVNb2RlbH1cbiAgICAgICAgICAgICAgICBtdWx0aXBsZU1vZGVsQ29uZmlncz17bXVsdGlwbGVNb2RlbENvbmZpZ3N9XG4gICAgICAgICAgICAgICAgb25NdWx0aXBsZU1vZGVsQ29uZmlnc0NoYW5nZT17aGFuZGxlTXVsdGlwbGVNb2RlbENvbmZpZ3NDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0RyYXdlcj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtzaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbCAmJiAoXG4gICAgICAgICAgICA8TmV3RmVhdHVyZVBhbmVsXG4gICAgICAgICAgICAgIHNob3dcbiAgICAgICAgICAgICAgaW5Xb3JrZmxvdz17ZmFsc2V9XG4gICAgICAgICAgICAgIHNob3dGaWxlVXBsb2FkPXtmYWxzZX1cbiAgICAgICAgICAgICAgaXNDaGF0TW9kZT17bW9kZSAhPT0gQXBwTW9kZUVudW0uQ09NUExFVElPTn1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2ZhbHNlfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRmVhdHVyZXNDaGFuZ2V9XG4gICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsKGZhbHNlKX1cbiAgICAgICAgICAgICAgcHJvbXB0VmFyaWFibGVzPXttb2RlbENvbmZpZy5jb25maWdzLnByb21wdF92YXJpYWJsZXN9XG4gICAgICAgICAgICAgIG9uQXV0b0FkZFByb21wdFZhcmlhYmxlPXtoYW5kbGVBZGRQcm9tcHRWYXJpYWJsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8UGx1Z2luRGVwZW5kZW5jeSAvPlxuICAgICAgICA8L01pdHRQcm92aWRlcj5cbiAgICAgIDwvRmVhdHVyZXNQcm92aWRlcj5cbiAgICA8L0NvbmZpZ0NvbnRleHQuUHJvdmlkZXI+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQ29uZmlndXJhdGlvbilcbiJdfQ==