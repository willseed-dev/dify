"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const react_1 = require("react");
const constants_1 = require("@/app/components/base/prompt-editor/constants");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const use_inspect_vars_crud_1 = require("@/app/components/workflow/hooks/use-inspect-vars-crud");
const use_node_crud_1 = require("@/app/components/workflow/nodes/_base/hooks/use-node-crud");
const app_1 = require("@/types/app");
const hooks_2 = require("../../hooks");
const use_config_vision_1 = require("../../hooks/use-config-vision");
const store_1 = require("../../store");
const types_1 = require("../../types");
const use_available_var_list_1 = require("../_base/hooks/use-available-var-list");
const useConfig = (id, payload) => {
    const { nodesReadOnly: readOnly } = (0, hooks_2.useNodesReadOnly)();
    const isChatMode = (0, hooks_2.useIsChatMode)();
    const defaultConfig = (0, store_1.useStore)(s => s.nodesDefaultConfigs)?.[payload.type];
    const [defaultRolePrefix, setDefaultRolePrefix] = (0, react_1.useState)({ user: '', assistant: '' });
    const { inputs, setInputs: doSetInputs } = (0, use_node_crud_1.default)(id, payload);
    const inputRef = (0, react_1.useRef)(inputs);
    (0, react_1.useEffect)(() => {
        inputRef.current = inputs;
    }, [inputs]);
    const { deleteNodeInspectorVars } = (0, use_inspect_vars_crud_1.default)();
    const setInputs = (0, react_1.useCallback)((newInputs) => {
        if (newInputs.memory && !newInputs.memory.role_prefix) {
            const newPayload = (0, immer_1.produce)(newInputs, (draft) => {
                draft.memory.role_prefix = defaultRolePrefix;
            });
            doSetInputs(newPayload);
            inputRef.current = newPayload;
            return;
        }
        doSetInputs(newInputs);
        inputRef.current = newInputs;
    }, [doSetInputs, defaultRolePrefix]);
    // model
    const model = inputs.model;
    const modelMode = inputs.model?.mode;
    const isChatModel = modelMode === app_1.AppModeEnum.CHAT;
    const isCompletionModel = !isChatModel;
    const hasSetBlockStatus = (() => {
        const promptTemplate = inputs.prompt_template;
        const hasSetContext = isChatModel ? promptTemplate.some(item => (0, constants_1.checkHasContextBlock)(item.text)) : (0, constants_1.checkHasContextBlock)(promptTemplate.text);
        if (!isChatMode) {
            return {
                history: false,
                query: false,
                context: hasSetContext,
            };
        }
        if (isChatModel) {
            return {
                history: false,
                query: promptTemplate.some(item => (0, constants_1.checkHasQueryBlock)(item.text)),
                context: hasSetContext,
            };
        }
        else {
            return {
                history: (0, constants_1.checkHasHistoryBlock)(promptTemplate.text),
                query: (0, constants_1.checkHasQueryBlock)(promptTemplate.text),
                context: hasSetContext,
            };
        }
    })();
    const shouldShowContextTip = !hasSetBlockStatus.context && inputs.context.enabled;
    const appendDefaultPromptConfig = (0, react_1.useCallback)((draft, defaultConfig, passInIsChatMode) => {
        const promptTemplates = defaultConfig.prompt_templates;
        if (passInIsChatMode === undefined ? isChatModel : passInIsChatMode) {
            draft.prompt_template = promptTemplates.chat_model.prompts;
        }
        else {
            draft.prompt_template = promptTemplates.completion_model.prompt;
            setDefaultRolePrefix({
                user: promptTemplates.completion_model.conversation_histories_role.user_prefix,
                assistant: promptTemplates.completion_model.conversation_histories_role.assistant_prefix,
            });
        }
    }, [isChatModel]);
    (0, react_1.useEffect)(() => {
        const isReady = defaultConfig && Object.keys(defaultConfig).length > 0;
        if (isReady && !inputs.prompt_template) {
            const newInputs = (0, immer_1.produce)(inputs, (draft) => {
                appendDefaultPromptConfig(draft, defaultConfig);
            });
            setInputs(newInputs);
        }
    }, [defaultConfig, isChatModel]);
    const [modelChanged, setModelChanged] = (0, react_1.useState)(false);
    const { currentProvider, currentModel, } = (0, hooks_1.useModelListAndDefaultModelAndCurrentProviderAndModel)(declarations_1.ModelTypeEnum.textGeneration);
    const { isVisionModel, handleVisionResolutionEnabledChange, handleVisionResolutionChange, handleModelChanged: handleVisionConfigAfterModelChanged, } = (0, use_config_vision_1.default)(model, {
        payload: inputs.vision,
        onChange: (newPayload) => {
            const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
                draft.vision = newPayload;
            });
            setInputs(newInputs);
        },
    });
    const handleModelChanged = (0, react_1.useCallback)((model) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.model.provider = model.provider;
            draft.model.name = model.modelId;
            draft.model.mode = model.mode;
            const isModeChange = model.mode !== inputRef.current.model.mode;
            if (isModeChange && defaultConfig && Object.keys(defaultConfig).length > 0)
                appendDefaultPromptConfig(draft, defaultConfig, model.mode === app_1.AppModeEnum.CHAT);
        });
        setInputs(newInputs);
        setModelChanged(true);
    }, [setInputs, defaultConfig, appendDefaultPromptConfig]);
    (0, react_1.useEffect)(() => {
        if (currentProvider?.provider && currentModel?.model && !model.provider) {
            handleModelChanged({
                provider: currentProvider?.provider,
                modelId: currentModel?.model,
                mode: currentModel?.model_properties?.mode,
            });
        }
    }, [model.provider, currentProvider, currentModel, handleModelChanged]);
    const handleCompletionParamsChange = (0, react_1.useCallback)((newParams) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.model.completion_params = newParams;
        });
        setInputs(newInputs);
    }, [setInputs]);
    // change to vision model to set vision enabled, else disabled
    (0, react_1.useEffect)(() => {
        if (!modelChanged)
            return;
        setModelChanged(false);
        handleVisionConfigAfterModelChanged();
    }, [isVisionModel, modelChanged]);
    // variables
    const isShowVars = (() => {
        if (isChatModel)
            return inputs.prompt_template.some(item => item.edition_type === types_1.EditionType.jinja2);
        return inputs.prompt_template.edition_type === types_1.EditionType.jinja2;
    })();
    const handleAddEmptyVariable = (0, react_1.useCallback)(() => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (!draft.prompt_config) {
                draft.prompt_config = {
                    jinja2_variables: [],
                };
            }
            if (!draft.prompt_config.jinja2_variables)
                draft.prompt_config.jinja2_variables = [];
            draft.prompt_config.jinja2_variables.push({
                variable: '',
                value_selector: [],
            });
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleAddVariable = (0, react_1.useCallback)((payload) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (!draft.prompt_config) {
                draft.prompt_config = {
                    jinja2_variables: [],
                };
            }
            if (!draft.prompt_config.jinja2_variables)
                draft.prompt_config.jinja2_variables = [];
            draft.prompt_config.jinja2_variables.push(payload);
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleVarListChange = (0, react_1.useCallback)((newList) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (!draft.prompt_config) {
                draft.prompt_config = {
                    jinja2_variables: [],
                };
            }
            if (!draft.prompt_config.jinja2_variables)
                draft.prompt_config.jinja2_variables = [];
            draft.prompt_config.jinja2_variables = newList;
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleVarNameChange = (0, react_1.useCallback)((oldName, newName) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (isChatModel) {
                const promptTemplate = draft.prompt_template;
                promptTemplate.filter(item => item.edition_type === types_1.EditionType.jinja2).forEach((item) => {
                    item.jinja2_text = (item.jinja2_text || '').replaceAll(`{{ ${oldName} }}`, `{{ ${newName} }}`);
                });
            }
            else {
                if (draft.prompt_template.edition_type !== types_1.EditionType.jinja2)
                    return;
                const promptTemplate = draft.prompt_template;
                promptTemplate.jinja2_text = (promptTemplate.jinja2_text || '').replaceAll(`{{ ${oldName} }}`, `{{ ${newName} }}`);
            }
        });
        setInputs(newInputs);
    }, [isChatModel, setInputs]);
    // context
    const handleContextVarChange = (0, react_1.useCallback)((newVar) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.context.variable_selector = newVar || [];
            draft.context.enabled = !!(newVar && newVar.length > 0);
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handlePromptChange = (0, react_1.useCallback)((newPrompt) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.prompt_template = newPrompt;
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleMemoryChange = (0, react_1.useCallback)((newMemory) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.memory = newMemory;
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleSyeQueryChange = (0, react_1.useCallback)((newQuery) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (!draft.memory) {
                draft.memory = {
                    window: {
                        enabled: false,
                        size: 10,
                    },
                    query_prompt_template: newQuery,
                };
            }
            else {
                draft.memory.query_prompt_template = newQuery;
            }
        });
        setInputs(newInputs);
    }, [setInputs]);
    // structure output
    const { data: modelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.textGeneration);
    const isModelSupportStructuredOutput = modelList
        ?.find(provideItem => provideItem.provider === model?.provider)
        ?.models
        .find(modelItem => modelItem.model === model?.name)
        ?.features
        ?.includes(declarations_1.ModelFeatureEnum.StructuredOutput);
    const [structuredOutputCollapsed, setStructuredOutputCollapsed] = (0, react_1.useState)(true);
    const handleStructureOutputEnableChange = (0, react_1.useCallback)((enabled) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.structured_output_enabled = enabled;
        });
        setInputs(newInputs);
        if (enabled)
            setStructuredOutputCollapsed(false);
        deleteNodeInspectorVars(id);
    }, [setInputs, deleteNodeInspectorVars, id]);
    const handleStructureOutputChange = (0, react_1.useCallback)((newOutput) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.structured_output = newOutput;
        });
        setInputs(newInputs);
        deleteNodeInspectorVars(id);
    }, [setInputs, deleteNodeInspectorVars, id]);
    const filterInputVar = (0, react_1.useCallback)((varPayload) => {
        return [types_1.VarType.number, types_1.VarType.string, types_1.VarType.secret, types_1.VarType.arrayString, types_1.VarType.arrayNumber, types_1.VarType.file, types_1.VarType.arrayFile].includes(varPayload.type);
    }, []);
    const filterJinja2InputVar = (0, react_1.useCallback)((varPayload) => {
        return [types_1.VarType.number, types_1.VarType.string, types_1.VarType.secret, types_1.VarType.arrayString, types_1.VarType.arrayNumber, types_1.VarType.arrayBoolean, types_1.VarType.arrayObject, types_1.VarType.object, types_1.VarType.array, types_1.VarType.boolean].includes(varPayload.type);
    }, []);
    const filterMemoryPromptVar = (0, react_1.useCallback)((varPayload) => {
        return [types_1.VarType.arrayObject, types_1.VarType.array, types_1.VarType.number, types_1.VarType.string, types_1.VarType.secret, types_1.VarType.arrayString, types_1.VarType.arrayNumber, types_1.VarType.file, types_1.VarType.arrayFile].includes(varPayload.type);
    }, []);
    // reasoning format
    const handleReasoningFormatChange = (0, react_1.useCallback)((reasoningFormat) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.reasoning_format = reasoningFormat;
        });
        setInputs(newInputs);
    }, [setInputs]);
    const { availableVars, availableNodesWithParent, } = (0, use_available_var_list_1.default)(id, {
        onlyLeafNodeVar: false,
        filterVar: filterMemoryPromptVar,
    });
    return {
        readOnly,
        isChatMode,
        inputs,
        isChatModel,
        isCompletionModel,
        hasSetBlockStatus,
        shouldShowContextTip,
        isVisionModel,
        handleModelChanged,
        handleCompletionParamsChange,
        isShowVars,
        handleVarListChange,
        handleVarNameChange,
        handleAddVariable,
        handleAddEmptyVariable,
        handleContextVarChange,
        filterInputVar,
        filterVar: filterMemoryPromptVar,
        availableVars,
        availableNodesWithParent,
        handlePromptChange,
        handleMemoryChange,
        handleSyeQueryChange,
        handleVisionResolutionEnabledChange,
        handleVisionResolutionChange,
        isModelSupportStructuredOutput,
        handleStructureOutputChange,
        structuredOutputCollapsed,
        setStructuredOutputCollapsed,
        handleStructureOutputEnableChange,
        filterJinja2InputVar,
        handleReasoningFormatChange,
    };
};
exports.default = useConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBK0I7QUFDL0IsaUNBQWdFO0FBQ2hFLDZFQUE4SDtBQUM5SCwyR0FHaUY7QUFDakYsNkZBQXVKO0FBQ3ZKLGlHQUFzRjtBQUN0Riw2RkFBbUY7QUFDbkYscUNBQXlDO0FBQ3pDLHVDQUdvQjtBQUNwQixxRUFBMkQ7QUFDM0QsdUNBQXNDO0FBQ3RDLHVDQUFrRDtBQUNsRCxrRkFBdUU7QUFFdkUsTUFBTSxTQUFTLEdBQUcsQ0FBQyxFQUFVLEVBQUUsT0FBb0IsRUFBRSxFQUFFO0lBQ3JELE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQ3RELE1BQU0sVUFBVSxHQUFHLElBQUEscUJBQWEsR0FBRSxDQUFBO0lBRWxDLE1BQU0sYUFBYSxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFFLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxvQkFBb0IsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBc0MsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQzVILE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUEsdUJBQVcsRUFBYyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDaEYsTUFBTSxRQUFRLEdBQUcsSUFBQSxjQUFNLEVBQUMsTUFBTSxDQUFDLENBQUE7SUFDL0IsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLFFBQVEsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO0lBQzNCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FB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UUFDMUMsQ0FBQyxDQUFDLENBQUE7UUFDRixTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUVmLE1BQU0sRUFDSixhQUFhLEVBQ2Isd0JBQXdCLEdBQ3pCLEdBQUcsSUFBQSxnQ0FBbUIsRUFBQyxFQUFFLEVBQUU7UUFDMUIsZUFBZSxFQUFFLEtBQUs7UUFDdEIsU0FBUyxFQUFFLHFCQUFxQjtLQUNqQyxDQUFDLENBQUE7SUFFRixPQUFPO1FBQ0wsUUFBUTtRQUNSLFVBQVU7UUFDVixNQUFNO1FBQ04sV0FBVztRQUNYLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsb0JBQW9CO1FBQ3BCLGFBQWE7UUFDYixrQkFBa0I7UUFDbEIsNEJBQTRCO1FBQzVCLFVBQVU7UUFDVixtQkFBbUI7UUFDbkIsbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQixzQkFBc0I7UUFDdEIsc0JBQXNCO1FBQ3RCLGNBQWM7UUFDZCxTQUFTLEVBQUUscUJBQXFCO1FBQ2hDLGFBQWE7UUFDYix3QkFBd0I7UUFDeEIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQixvQkFBb0I7UUFDcEIsbUNBQW1DO1FBQ25DLDRCQUE0QjtRQUM1Qiw4QkFBOEI7UUFDOUIsMkJBQTJCO1FBQzNCLHlCQUF5QjtRQUN6Qiw0QkFBNEI7UUFDNUIsaUNBQWlDO1FBQ2pDLG9CQUFvQjtRQUNwQiwyQkFBMkI7S0FDNUIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFNBQVMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWVtb3J5LCBQcm9tcHRJdGVtLCBWYWx1ZVNlbGVjdG9yLCBWYXIsIFZhcmlhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IExMTU5vZGVUeXBlLCBTdHJ1Y3R1cmVkT3V0cHV0IH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNoZWNrSGFzQ29udGV4dEJsb2NrLCBjaGVja0hhc0hpc3RvcnlCbG9jaywgY2hlY2tIYXNRdWVyeUJsb2NrIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Byb21wdC1lZGl0b3IvY29uc3RhbnRzJ1xuaW1wb3J0IHtcbiAgTW9kZWxGZWF0dXJlRW51bSxcbiAgTW9kZWxUeXBlRW51bSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHsgdXNlTW9kZWxMaXN0LCB1c2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWxBbmRDdXJyZW50UHJvdmlkZXJBbmRNb2RlbCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJ1xuaW1wb3J0IHVzZUluc3BlY3RWYXJzQ3J1ZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1pbnNwZWN0LXZhcnMtY3J1ZCdcbmltcG9ydCB1c2VOb2RlQ3J1ZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL19iYXNlL2hvb2tzL3VzZS1ub2RlLWNydWQnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHtcbiAgdXNlSXNDaGF0TW9kZSxcbiAgdXNlTm9kZXNSZWFkT25seSxcbn0gZnJvbSAnLi4vLi4vaG9va3MnXG5pbXBvcnQgdXNlQ29uZmlnVmlzaW9uIGZyb20gJy4uLy4uL2hvb2tzL3VzZS1jb25maWctdmlzaW9uJ1xuaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICcuLi8uLi9zdG9yZSdcbmltcG9ydCB7IEVkaXRpb25UeXBlLCBWYXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdXNlQXZhaWxhYmxlVmFyTGlzdCBmcm9tICcuLi9fYmFzZS9ob29rcy91c2UtYXZhaWxhYmxlLXZhci1saXN0J1xuXG5jb25zdCB1c2VDb25maWcgPSAoaWQ6IHN0cmluZywgcGF5bG9hZDogTExNTm9kZVR5cGUpID0+IHtcbiAgY29uc3QgeyBub2Rlc1JlYWRPbmx5OiByZWFkT25seSB9ID0gdXNlTm9kZXNSZWFkT25seSgpXG4gIGNvbnN0IGlzQ2hhdE1vZGUgPSB1c2VJc0NoYXRNb2RlKClcblxuICBjb25zdCBkZWZhdWx0Q29uZmlnID0gdXNlU3RvcmUocyA9PiBzLm5vZGVzRGVmYXVsdENvbmZpZ3MpPy5bcGF5bG9hZC50eXBlXVxuICBjb25zdCBbZGVmYXVsdFJvbGVQcmVmaXgsIHNldERlZmF1bHRSb2xlUHJlZml4XSA9IHVzZVN0YXRlPHsgdXNlcjogc3RyaW5nLCBhc3Npc3RhbnQ6IHN0cmluZyB9Pih7IHVzZXI6ICcnLCBhc3Npc3RhbnQ6ICcnIH0pXG4gIGNvbnN0IHsgaW5wdXRzLCBzZXRJbnB1dHM6IGRvU2V0SW5wdXRzIH0gPSB1c2VOb2RlQ3J1ZDxMTE1Ob2RlVHlwZT4oaWQsIHBheWxvYWQpXG4gIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmKGlucHV0cylcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpbnB1dFJlZi5jdXJyZW50ID0gaW5wdXRzXG4gIH0sIFtpbnB1dHNdKVxuXG4gIGNvbnN0IHsgZGVsZXRlTm9kZUluc3BlY3RvclZhcnMgfSA9IHVzZUluc3BlY3RWYXJzQ3J1ZCgpXG5cbiAgY29uc3Qgc2V0SW5wdXRzID0gdXNlQ2FsbGJhY2soKG5ld0lucHV0czogTExNTm9kZVR5cGUpID0+IHtcbiAgICBpZiAobmV3SW5wdXRzLm1lbW9yeSAmJiAhbmV3SW5wdXRzLm1lbW9yeS5yb2xlX3ByZWZpeCkge1xuICAgICAgY29uc3QgbmV3UGF5bG9hZCA9IHByb2R1Y2UobmV3SW5wdXRzLCAoZHJhZnQpID0+IHtcbiAgICAgICAgZHJhZnQubWVtb3J5IS5yb2xlX3ByZWZpeCA9IGRlZmF1bHRSb2xlUHJlZml4XG4gICAgICB9KVxuICAgICAgZG9TZXRJbnB1dHMobmV3UGF5bG9hZClcbiAgICAgIGlucHV0UmVmLmN1cnJlbnQgPSBuZXdQYXlsb2FkXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZG9TZXRJbnB1dHMobmV3SW5wdXRzKVxuICAgIGlucHV0UmVmLmN1cnJlbnQgPSBuZXdJbnB1dHNcbiAgfSwgW2RvU2V0SW5wdXRzLCBkZWZhdWx0Um9sZVByZWZpeF0pXG5cbiAgLy8gbW9kZWxcbiAgY29uc3QgbW9kZWwgPSBpbnB1dHMubW9kZWxcbiAgY29uc3QgbW9kZWxNb2RlID0gaW5wdXRzLm1vZGVsPy5tb2RlXG4gIGNvbnN0IGlzQ2hhdE1vZGVsID0gbW9kZWxNb2RlID09PSBBcHBNb2RlRW51bS5DSEFUXG5cbiAgY29uc3QgaXNDb21wbGV0aW9uTW9kZWwgPSAhaXNDaGF0TW9kZWxcblxuICBjb25zdCBoYXNTZXRCbG9ja1N0YXR1cyA9ICgoKSA9PiB7XG4gICAgY29uc3QgcHJvbXB0VGVtcGxhdGUgPSBpbnB1dHMucHJvbXB0X3RlbXBsYXRlXG4gICAgY29uc3QgaGFzU2V0Q29udGV4dCA9IGlzQ2hhdE1vZGVsID8gKHByb21wdFRlbXBsYXRlIGFzIFByb21wdEl0ZW1bXSkuc29tZShpdGVtID0+IGNoZWNrSGFzQ29udGV4dEJsb2NrKGl0ZW0udGV4dCkpIDogY2hlY2tIYXNDb250ZXh0QmxvY2soKHByb21wdFRlbXBsYXRlIGFzIFByb21wdEl0ZW0pLnRleHQpXG4gICAgaWYgKCFpc0NoYXRNb2RlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoaXN0b3J5OiBmYWxzZSxcbiAgICAgICAgcXVlcnk6IGZhbHNlLFxuICAgICAgICBjb250ZXh0OiBoYXNTZXRDb250ZXh0LFxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNDaGF0TW9kZWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhpc3Rvcnk6IGZhbHNlLFxuICAgICAgICBxdWVyeTogKHByb21wdFRlbXBsYXRlIGFzIFByb21wdEl0ZW1bXSkuc29tZShpdGVtID0+IGNoZWNrSGFzUXVlcnlCbG9jayhpdGVtLnRleHQpKSxcbiAgICAgICAgY29udGV4dDogaGFzU2V0Q29udGV4dCxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoaXN0b3J5OiBjaGVja0hhc0hpc3RvcnlCbG9jaygocHJvbXB0VGVtcGxhdGUgYXMgUHJvbXB0SXRlbSkudGV4dCksXG4gICAgICAgIHF1ZXJ5OiBjaGVja0hhc1F1ZXJ5QmxvY2soKHByb21wdFRlbXBsYXRlIGFzIFByb21wdEl0ZW0pLnRleHQpLFxuICAgICAgICBjb250ZXh0OiBoYXNTZXRDb250ZXh0LFxuICAgICAgfVxuICAgIH1cbiAgfSkoKVxuXG4gIGNvbnN0IHNob3VsZFNob3dDb250ZXh0VGlwID0gIWhhc1NldEJsb2NrU3RhdHVzLmNvbnRleHQgJiYgaW5wdXRzLmNvbnRleHQuZW5hYmxlZFxuXG4gIGNvbnN0IGFwcGVuZERlZmF1bHRQcm9tcHRDb25maWcgPSB1c2VDYWxsYmFjaygoZHJhZnQ6IExMTU5vZGVUeXBlLCBkZWZhdWx0Q29uZmlnOiBhbnksIHBhc3NJbklzQ2hhdE1vZGU/OiBib29sZWFuKSA9PiB7XG4gICAgY29uc3QgcHJvbXB0VGVtcGxhdGVzID0gZGVmYXVsdENvbmZpZy5wcm9tcHRfdGVtcGxhdGVzXG4gICAgaWYgKHBhc3NJbklzQ2hhdE1vZGUgPT09IHVuZGVmaW5lZCA/IGlzQ2hhdE1vZGVsIDogcGFzc0luSXNDaGF0TW9kZSkge1xuICAgICAgZHJhZnQucHJvbXB0X3RlbXBsYXRlID0gcHJvbXB0VGVtcGxhdGVzLmNoYXRfbW9kZWwucHJvbXB0c1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGRyYWZ0LnByb21wdF90ZW1wbGF0ZSA9IHByb21wdFRlbXBsYXRlcy5jb21wbGV0aW9uX21vZGVsLnByb21wdFxuXG4gICAgICBzZXREZWZhdWx0Um9sZVByZWZpeCh7XG4gICAgICAgIHVzZXI6IHByb21wdFRlbXBsYXRlcy5jb21wbGV0aW9uX21vZGVsLmNvbnZlcnNhdGlvbl9oaXN0b3JpZXNfcm9sZS51c2VyX3ByZWZpeCxcbiAgICAgICAgYXNzaXN0YW50OiBwcm9tcHRUZW1wbGF0ZXMuY29tcGxldGlvbl9tb2RlbC5jb252ZXJzYXRpb25faGlzdG9yaWVzX3JvbGUuYXNzaXN0YW50X3ByZWZpeCxcbiAgICAgIH0pXG4gICAgfVxuICB9LCBbaXNDaGF0TW9kZWxdKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGlzUmVhZHkgPSBkZWZhdWx0Q29uZmlnICYmIE9iamVjdC5rZXlzKGRlZmF1bHRDb25maWcpLmxlbmd0aCA+IDBcblxuICAgIGlmIChpc1JlYWR5ICYmICFpbnB1dHMucHJvbXB0X3RlbXBsYXRlKSB7XG4gICAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0cywgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGFwcGVuZERlZmF1bHRQcm9tcHRDb25maWcoZHJhZnQsIGRlZmF1bHRDb25maWcpXG4gICAgICB9KVxuICAgICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgICB9XG4gIH0sIFtkZWZhdWx0Q29uZmlnLCBpc0NoYXRNb2RlbF0pXG5cbiAgY29uc3QgW21vZGVsQ2hhbmdlZCwgc2V0TW9kZWxDaGFuZ2VkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7XG4gICAgY3VycmVudFByb3ZpZGVyLFxuICAgIGN1cnJlbnRNb2RlbCxcbiAgfSA9IHVzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbEFuZEN1cnJlbnRQcm92aWRlckFuZE1vZGVsKE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24pXG5cbiAgY29uc3Qge1xuICAgIGlzVmlzaW9uTW9kZWwsXG4gICAgaGFuZGxlVmlzaW9uUmVzb2x1dGlvbkVuYWJsZWRDaGFuZ2UsXG4gICAgaGFuZGxlVmlzaW9uUmVzb2x1dGlvbkNoYW5nZSxcbiAgICBoYW5kbGVNb2RlbENoYW5nZWQ6IGhhbmRsZVZpc2lvbkNvbmZpZ0FmdGVyTW9kZWxDaGFuZ2VkLFxuICB9ID0gdXNlQ29uZmlnVmlzaW9uKG1vZGVsLCB7XG4gICAgcGF5bG9hZDogaW5wdXRzLnZpc2lvbixcbiAgICBvbkNoYW5nZTogKG5ld1BheWxvYWQpID0+IHtcbiAgICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGRyYWZ0LnZpc2lvbiA9IG5ld1BheWxvYWRcbiAgICAgIH0pXG4gICAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICAgIH0sXG4gIH0pXG5cbiAgY29uc3QgaGFuZGxlTW9kZWxDaGFuZ2VkID0gdXNlQ2FsbGJhY2soKG1vZGVsOiB7IHByb3ZpZGVyOiBzdHJpbmcsIG1vZGVsSWQ6IHN0cmluZywgbW9kZT86IHN0cmluZyB9KSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dFJlZi5jdXJyZW50LCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0Lm1vZGVsLnByb3ZpZGVyID0gbW9kZWwucHJvdmlkZXJcbiAgICAgIGRyYWZ0Lm1vZGVsLm5hbWUgPSBtb2RlbC5tb2RlbElkXG4gICAgICBkcmFmdC5tb2RlbC5tb2RlID0gbW9kZWwubW9kZSFcbiAgICAgIGNvbnN0IGlzTW9kZUNoYW5nZSA9IG1vZGVsLm1vZGUgIT09IGlucHV0UmVmLmN1cnJlbnQubW9kZWwubW9kZVxuICAgICAgaWYgKGlzTW9kZUNoYW5nZSAmJiBkZWZhdWx0Q29uZmlnICYmIE9iamVjdC5rZXlzKGRlZmF1bHRDb25maWcpLmxlbmd0aCA+IDApXG4gICAgICAgIGFwcGVuZERlZmF1bHRQcm9tcHRDb25maWcoZHJhZnQsIGRlZmF1bHRDb25maWcsIG1vZGVsLm1vZGUgPT09IEFwcE1vZGVFbnVtLkNIQVQpXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICAgIHNldE1vZGVsQ2hhbmdlZCh0cnVlKVxuICB9LCBbc2V0SW5wdXRzLCBkZWZhdWx0Q29uZmlnLCBhcHBlbmREZWZhdWx0UHJvbXB0Q29uZmlnXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChjdXJyZW50UHJvdmlkZXI/LnByb3ZpZGVyICYmIGN1cnJlbnRNb2RlbD8ubW9kZWwgJiYgIW1vZGVsLnByb3ZpZGVyKSB7XG4gICAgICBoYW5kbGVNb2RlbENoYW5nZWQoe1xuICAgICAgICBwcm92aWRlcjogY3VycmVudFByb3ZpZGVyPy5wcm92aWRlcixcbiAgICAgICAgbW9kZWxJZDogY3VycmVudE1vZGVsPy5tb2RlbCxcbiAgICAgICAgbW9kZTogY3VycmVudE1vZGVsPy5tb2RlbF9wcm9wZXJ0aWVzPy5tb2RlIGFzIHN0cmluZyxcbiAgICAgIH0pXG4gICAgfVxuICB9LCBbbW9kZWwucHJvdmlkZXIsIGN1cnJlbnRQcm92aWRlciwgY3VycmVudE1vZGVsLCBoYW5kbGVNb2RlbENoYW5nZWRdKVxuXG4gIGNvbnN0IGhhbmRsZUNvbXBsZXRpb25QYXJhbXNDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3UGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dFJlZi5jdXJyZW50LCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0Lm1vZGVsLmNvbXBsZXRpb25fcGFyYW1zID0gbmV3UGFyYW1zXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbc2V0SW5wdXRzXSlcblxuICAvLyBjaGFuZ2UgdG8gdmlzaW9uIG1vZGVsIHRvIHNldCB2aXNpb24gZW5hYmxlZCwgZWxzZSBkaXNhYmxlZFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbW9kZWxDaGFuZ2VkKVxuICAgICAgcmV0dXJuXG4gICAgc2V0TW9kZWxDaGFuZ2VkKGZhbHNlKVxuICAgIGhhbmRsZVZpc2lvbkNvbmZpZ0FmdGVyTW9kZWxDaGFuZ2VkKClcbiAgfSwgW2lzVmlzaW9uTW9kZWwsIG1vZGVsQ2hhbmdlZF0pXG5cbiAgLy8gdmFyaWFibGVzXG4gIGNvbnN0IGlzU2hvd1ZhcnMgPSAoKCkgPT4ge1xuICAgIGlmIChpc0NoYXRNb2RlbClcbiAgICAgIHJldHVybiAoaW5wdXRzLnByb21wdF90ZW1wbGF0ZSBhcyBQcm9tcHRJdGVtW10pLnNvbWUoaXRlbSA9PiBpdGVtLmVkaXRpb25fdHlwZSA9PT0gRWRpdGlvblR5cGUuamluamEyKVxuXG4gICAgcmV0dXJuIChpbnB1dHMucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW0pLmVkaXRpb25fdHlwZSA9PT0gRWRpdGlvblR5cGUuamluamEyXG4gIH0pKClcbiAgY29uc3QgaGFuZGxlQWRkRW1wdHlWYXJpYWJsZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0UmVmLmN1cnJlbnQsIChkcmFmdCkgPT4ge1xuICAgICAgaWYgKCFkcmFmdC5wcm9tcHRfY29uZmlnKSB7XG4gICAgICAgIGRyYWZ0LnByb21wdF9jb25maWcgPSB7XG4gICAgICAgICAgamluamEyX3ZhcmlhYmxlczogW10sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghZHJhZnQucHJvbXB0X2NvbmZpZy5qaW5qYTJfdmFyaWFibGVzKVxuICAgICAgICBkcmFmdC5wcm9tcHRfY29uZmlnLmppbmphMl92YXJpYWJsZXMgPSBbXVxuXG4gICAgICBkcmFmdC5wcm9tcHRfY29uZmlnLmppbmphMl92YXJpYWJsZXMucHVzaCh7XG4gICAgICAgIHZhcmlhYmxlOiAnJyxcbiAgICAgICAgdmFsdWVfc2VsZWN0b3I6IFtdLFxuICAgICAgfSlcbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZUFkZFZhcmlhYmxlID0gdXNlQ2FsbGJhY2soKHBheWxvYWQ6IFZhcmlhYmxlKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dFJlZi5jdXJyZW50LCAoZHJhZnQpID0+IHtcbiAgICAgIGlmICghZHJhZnQucHJvbXB0X2NvbmZpZykge1xuICAgICAgICBkcmFmdC5wcm9tcHRfY29uZmlnID0ge1xuICAgICAgICAgIGppbmphMl92YXJpYWJsZXM6IFtdLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWRyYWZ0LnByb21wdF9jb25maWcuamluamEyX3ZhcmlhYmxlcylcbiAgICAgICAgZHJhZnQucHJvbXB0X2NvbmZpZy5qaW5qYTJfdmFyaWFibGVzID0gW11cblxuICAgICAgZHJhZnQucHJvbXB0X2NvbmZpZy5qaW5qYTJfdmFyaWFibGVzLnB1c2gocGF5bG9hZClcbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZVZhckxpc3RDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3TGlzdDogVmFyaWFibGVbXSkgPT4ge1xuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBpZiAoIWRyYWZ0LnByb21wdF9jb25maWcpIHtcbiAgICAgICAgZHJhZnQucHJvbXB0X2NvbmZpZyA9IHtcbiAgICAgICAgICBqaW5qYTJfdmFyaWFibGVzOiBbXSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFkcmFmdC5wcm9tcHRfY29uZmlnLmppbmphMl92YXJpYWJsZXMpXG4gICAgICAgIGRyYWZ0LnByb21wdF9jb25maWcuamluamEyX3ZhcmlhYmxlcyA9IFtdXG5cbiAgICAgIGRyYWZ0LnByb21wdF9jb25maWcuamluamEyX3ZhcmlhYmxlcyA9IG5ld0xpc3RcbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZVZhck5hbWVDaGFuZ2UgPSB1c2VDYWxsYmFjaygob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0UmVmLmN1cnJlbnQsIChkcmFmdCkgPT4ge1xuICAgICAgaWYgKGlzQ2hhdE1vZGVsKSB7XG4gICAgICAgIGNvbnN0IHByb21wdFRlbXBsYXRlID0gZHJhZnQucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW1bXVxuICAgICAgICBwcm9tcHRUZW1wbGF0ZS5maWx0ZXIoaXRlbSA9PiBpdGVtLmVkaXRpb25fdHlwZSA9PT0gRWRpdGlvblR5cGUuamluamEyKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaXRlbS5qaW5qYTJfdGV4dCA9IChpdGVtLmppbmphMl90ZXh0IHx8ICcnKS5yZXBsYWNlQWxsKGB7eyAke29sZE5hbWV9IH19YCwgYHt7ICR7bmV3TmFtZX0gfX1gKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmICgoZHJhZnQucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW0pLmVkaXRpb25fdHlwZSAhPT0gRWRpdGlvblR5cGUuamluamEyKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHByb21wdFRlbXBsYXRlID0gZHJhZnQucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW1cbiAgICAgICAgcHJvbXB0VGVtcGxhdGUuamluamEyX3RleHQgPSAocHJvbXB0VGVtcGxhdGUuamluamEyX3RleHQgfHwgJycpLnJlcGxhY2VBbGwoYHt7ICR7b2xkTmFtZX0gfX1gLCBge3sgJHtuZXdOYW1lfSB9fWApXG4gICAgICB9XG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbaXNDaGF0TW9kZWwsIHNldElucHV0c10pXG5cbiAgLy8gY29udGV4dFxuICBjb25zdCBoYW5kbGVDb250ZXh0VmFyQ2hhbmdlID0gdXNlQ2FsbGJhY2soKG5ld1ZhcjogVmFsdWVTZWxlY3RvciB8IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5jb250ZXh0LnZhcmlhYmxlX3NlbGVjdG9yID0gbmV3VmFyIGFzIFZhbHVlU2VsZWN0b3IgfHwgW11cbiAgICAgIGRyYWZ0LmNvbnRleHQuZW5hYmxlZCA9ICEhKG5ld1ZhciAmJiBuZXdWYXIubGVuZ3RoID4gMClcbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZVByb21wdENoYW5nZSA9IHVzZUNhbGxiYWNrKChuZXdQcm9tcHQ6IFByb21wdEl0ZW1bXSB8IFByb21wdEl0ZW0pID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0UmVmLmN1cnJlbnQsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQucHJvbXB0X3RlbXBsYXRlID0gbmV3UHJvbXB0XG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbc2V0SW5wdXRzXSlcblxuICBjb25zdCBoYW5kbGVNZW1vcnlDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3TWVtb3J5PzogTWVtb3J5KSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dFJlZi5jdXJyZW50LCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0Lm1lbW9yeSA9IG5ld01lbW9yeVxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW3NldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlU3llUXVlcnlDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3UXVlcnk6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBpZiAoIWRyYWZ0Lm1lbW9yeSkge1xuICAgICAgICBkcmFmdC5tZW1vcnkgPSB7XG4gICAgICAgICAgd2luZG93OiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIHNpemU6IDEwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcXVlcnlfcHJvbXB0X3RlbXBsYXRlOiBuZXdRdWVyeSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRyYWZ0Lm1lbW9yeS5xdWVyeV9wcm9tcHRfdGVtcGxhdGUgPSBuZXdRdWVyeVxuICAgICAgfVxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW3NldElucHV0c10pXG5cbiAgLy8gc3RydWN0dXJlIG91dHB1dFxuICBjb25zdCB7IGRhdGE6IG1vZGVsTGlzdCB9ID0gdXNlTW9kZWxMaXN0KE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24pXG4gIGNvbnN0IGlzTW9kZWxTdXBwb3J0U3RydWN0dXJlZE91dHB1dCA9IG1vZGVsTGlzdFxuICAgID8uZmluZChwcm92aWRlSXRlbSA9PiBwcm92aWRlSXRlbS5wcm92aWRlciA9PT0gbW9kZWw/LnByb3ZpZGVyKVxuICAgID8ubW9kZWxzXG4gICAgLmZpbmQobW9kZWxJdGVtID0+IG1vZGVsSXRlbS5tb2RlbCA9PT0gbW9kZWw/Lm5hbWUpXG4gICAgPy5mZWF0dXJlc1xuICAgID8uaW5jbHVkZXMoTW9kZWxGZWF0dXJlRW51bS5TdHJ1Y3R1cmVkT3V0cHV0KVxuXG4gIGNvbnN0IFtzdHJ1Y3R1cmVkT3V0cHV0Q29sbGFwc2VkLCBzZXRTdHJ1Y3R1cmVkT3V0cHV0Q29sbGFwc2VkXSA9IHVzZVN0YXRlKHRydWUpXG4gIGNvbnN0IGhhbmRsZVN0cnVjdHVyZU91dHB1dEVuYWJsZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChlbmFibGVkOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dFJlZi5jdXJyZW50LCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LnN0cnVjdHVyZWRfb3V0cHV0X2VuYWJsZWQgPSBlbmFibGVkXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICAgIGlmIChlbmFibGVkKVxuICAgICAgc2V0U3RydWN0dXJlZE91dHB1dENvbGxhcHNlZChmYWxzZSlcbiAgICBkZWxldGVOb2RlSW5zcGVjdG9yVmFycyhpZClcbiAgfSwgW3NldElucHV0cywgZGVsZXRlTm9kZUluc3BlY3RvclZhcnMsIGlkXSlcblxuICBjb25zdCBoYW5kbGVTdHJ1Y3R1cmVPdXRwdXRDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3T3V0cHV0OiBTdHJ1Y3R1cmVkT3V0cHV0KSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dFJlZi5jdXJyZW50LCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LnN0cnVjdHVyZWRfb3V0cHV0ID0gbmV3T3V0cHV0XG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICAgIGRlbGV0ZU5vZGVJbnNwZWN0b3JWYXJzKGlkKVxuICB9LCBbc2V0SW5wdXRzLCBkZWxldGVOb2RlSW5zcGVjdG9yVmFycywgaWRdKVxuXG4gIGNvbnN0IGZpbHRlcklucHV0VmFyID0gdXNlQ2FsbGJhY2soKHZhclBheWxvYWQ6IFZhcikgPT4ge1xuICAgIHJldHVybiBbVmFyVHlwZS5udW1iZXIsIFZhclR5cGUuc3RyaW5nLCBWYXJUeXBlLnNlY3JldCwgVmFyVHlwZS5hcnJheVN0cmluZywgVmFyVHlwZS5hcnJheU51bWJlciwgVmFyVHlwZS5maWxlLCBWYXJUeXBlLmFycmF5RmlsZV0uaW5jbHVkZXModmFyUGF5bG9hZC50eXBlKVxuICB9LCBbXSlcblxuICBjb25zdCBmaWx0ZXJKaW5qYTJJbnB1dFZhciA9IHVzZUNhbGxiYWNrKCh2YXJQYXlsb2FkOiBWYXIpID0+IHtcbiAgICByZXR1cm4gW1ZhclR5cGUubnVtYmVyLCBWYXJUeXBlLnN0cmluZywgVmFyVHlwZS5zZWNyZXQsIFZhclR5cGUuYXJyYXlTdHJpbmcsIFZhclR5cGUuYXJyYXlOdW1iZXIsIFZhclR5cGUuYXJyYXlCb29sZWFuLCBWYXJUeXBlLmFycmF5T2JqZWN0LCBWYXJUeXBlLm9iamVjdCwgVmFyVHlwZS5hcnJheSwgVmFyVHlwZS5ib29sZWFuXS5pbmNsdWRlcyh2YXJQYXlsb2FkLnR5cGUpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGZpbHRlck1lbW9yeVByb21wdFZhciA9IHVzZUNhbGxiYWNrKCh2YXJQYXlsb2FkOiBWYXIpID0+IHtcbiAgICByZXR1cm4gW1ZhclR5cGUuYXJyYXlPYmplY3QsIFZhclR5cGUuYXJyYXksIFZhclR5cGUubnVtYmVyLCBWYXJUeXBlLnN0cmluZywgVmFyVHlwZS5zZWNyZXQsIFZhclR5cGUuYXJyYXlTdHJpbmcsIFZhclR5cGUuYXJyYXlOdW1iZXIsIFZhclR5cGUuZmlsZSwgVmFyVHlwZS5hcnJheUZpbGVdLmluY2x1ZGVzKHZhclBheWxvYWQudHlwZSlcbiAgfSwgW10pXG5cbiAgLy8gcmVhc29uaW5nIGZvcm1hdFxuICBjb25zdCBoYW5kbGVSZWFzb25pbmdGb3JtYXRDaGFuZ2UgPSB1c2VDYWxsYmFjaygocmVhc29uaW5nRm9ybWF0OiAndGFnZ2VkJyB8ICdzZXBhcmF0ZWQnKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dFJlZi5jdXJyZW50LCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LnJlYXNvbmluZ19mb3JtYXQgPSByZWFzb25pbmdGb3JtYXRcbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IHtcbiAgICBhdmFpbGFibGVWYXJzLFxuICAgIGF2YWlsYWJsZU5vZGVzV2l0aFBhcmVudCxcbiAgfSA9IHVzZUF2YWlsYWJsZVZhckxpc3QoaWQsIHtcbiAgICBvbmx5TGVhZk5vZGVWYXI6IGZhbHNlLFxuICAgIGZpbHRlclZhcjogZmlsdGVyTWVtb3J5UHJvbXB0VmFyLFxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgcmVhZE9ubHksXG4gICAgaXNDaGF0TW9kZSxcbiAgICBpbnB1dHMsXG4gICAgaXNDaGF0TW9kZWwsXG4gICAgaXNDb21wbGV0aW9uTW9kZWwsXG4gICAgaGFzU2V0QmxvY2tTdGF0dXMsXG4gICAgc2hvdWxkU2hvd0NvbnRleHRUaXAsXG4gICAgaXNWaXNpb25Nb2RlbCxcbiAgICBoYW5kbGVNb2RlbENoYW5nZWQsXG4gICAgaGFuZGxlQ29tcGxldGlvblBhcmFtc0NoYW5nZSxcbiAgICBpc1Nob3dWYXJzLFxuICAgIGhhbmRsZVZhckxpc3RDaGFuZ2UsXG4gICAgaGFuZGxlVmFyTmFtZUNoYW5nZSxcbiAgICBoYW5kbGVBZGRWYXJpYWJsZSxcbiAgICBoYW5kbGVBZGRFbXB0eVZhcmlhYmxlLFxuICAgIGhhbmRsZUNvbnRleHRWYXJDaGFuZ2UsXG4gICAgZmlsdGVySW5wdXRWYXIsXG4gICAgZmlsdGVyVmFyOiBmaWx0ZXJNZW1vcnlQcm9tcHRWYXIsXG4gICAgYXZhaWxhYmxlVmFycyxcbiAgICBhdmFpbGFibGVOb2Rlc1dpdGhQYXJlbnQsXG4gICAgaGFuZGxlUHJvbXB0Q2hhbmdlLFxuICAgIGhhbmRsZU1lbW9yeUNoYW5nZSxcbiAgICBoYW5kbGVTeWVRdWVyeUNoYW5nZSxcbiAgICBoYW5kbGVWaXNpb25SZXNvbHV0aW9uRW5hYmxlZENoYW5nZSxcbiAgICBoYW5kbGVWaXNpb25SZXNvbHV0aW9uQ2hhbmdlLFxuICAgIGlzTW9kZWxTdXBwb3J0U3RydWN0dXJlZE91dHB1dCxcbiAgICBoYW5kbGVTdHJ1Y3R1cmVPdXRwdXRDaGFuZ2UsXG4gICAgc3RydWN0dXJlZE91dHB1dENvbGxhcHNlZCxcbiAgICBzZXRTdHJ1Y3R1cmVkT3V0cHV0Q29sbGFwc2VkLFxuICAgIGhhbmRsZVN0cnVjdHVyZU91dHB1dEVuYWJsZUNoYW5nZSxcbiAgICBmaWx0ZXJKaW5qYTJJbnB1dFZhcixcbiAgICBoYW5kbGVSZWFzb25pbmdGb3JtYXRDaGFuZ2UsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQ29uZmlnXG4iXX0=