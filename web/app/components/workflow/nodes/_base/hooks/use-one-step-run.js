"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compat_1 = require("es-toolkit/compat");
const function_1 = require("es-toolkit/function");
const immer_1 = require("immer");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const reactflow_1 = require("reactflow");
const amplitude_1 = require("@/app/components/base/amplitude");
const constants_1 = require("@/app/components/base/prompt-editor/constants");
const toast_1 = require("@/app/components/base/toast");
const hooks_1 = require("@/app/components/workflow/hooks");
const use_inspect_vars_crud_1 = require("@/app/components/workflow/hooks/use-inspect-vars-crud");
const utils_1 = require("@/app/components/workflow/nodes/_base/components/variable/utils");
const default_1 = require("@/app/components/workflow/nodes/assigner/default");
const default_2 = require("@/app/components/workflow/nodes/code/default");
const default_3 = require("@/app/components/workflow/nodes/document-extractor/default");
const default_4 = require("@/app/components/workflow/nodes/http/default");
const default_5 = require("@/app/components/workflow/nodes/if-else/default");
const default_6 = require("@/app/components/workflow/nodes/iteration/default");
const default_7 = require("@/app/components/workflow/nodes/knowledge-retrieval/default");
const default_8 = require("@/app/components/workflow/nodes/llm/default");
const default_9 = require("@/app/components/workflow/nodes/loop/default");
const default_10 = require("@/app/components/workflow/nodes/parameter-extractor/default");
const default_11 = require("@/app/components/workflow/nodes/question-classifier/default");
const default_12 = require("@/app/components/workflow/nodes/template-transform/default");
const default_13 = require("@/app/components/workflow/nodes/tool/default");
const default_14 = require("@/app/components/workflow/nodes/variable-assigner/default");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const types_2 = require("@/app/components/workflow/variable-inspect/types");
const event_emitter_1 = require("@/context/event-emitter");
const base_1 = require("@/service/base");
const use_tools_1 = require("@/service/use-tools");
const use_workflow_1 = require("@/service/use-workflow");
const workflow_1 = require("@/service/workflow");
const use_match_schema_type_1 = require("../components/variable/use-match-schema-type");
const { checkValid: checkLLMValid } = default_8.default;
const { checkValid: checkKnowledgeRetrievalValid } = default_7.default;
const { checkValid: checkIfElseValid } = default_5.default;
const { checkValid: checkCodeValid } = default_2.default;
const { checkValid: checkTemplateTransformValid } = default_12.default;
const { checkValid: checkQuestionClassifyValid } = default_11.default;
const { checkValid: checkHttpValid } = default_4.default;
const { checkValid: checkToolValid } = default_13.default;
const { checkValid: checkVariableAssignerValid } = default_14.default;
const { checkValid: checkAssignerValid } = default_1.default;
const { checkValid: checkParameterExtractorValid } = default_10.default;
const { checkValid: checkIterationValid } = default_6.default;
const { checkValid: checkDocumentExtractorValid } = default_3.default;
const { checkValid: checkLoopValid } = default_9.default;
// eslint-disable-next-line ts/no-unsafe-function-type
const checkValidFns = {
    [types_1.BlockEnum.LLM]: checkLLMValid,
    [types_1.BlockEnum.KnowledgeRetrieval]: checkKnowledgeRetrievalValid,
    [types_1.BlockEnum.IfElse]: checkIfElseValid,
    [types_1.BlockEnum.Code]: checkCodeValid,
    [types_1.BlockEnum.TemplateTransform]: checkTemplateTransformValid,
    [types_1.BlockEnum.QuestionClassifier]: checkQuestionClassifyValid,
    [types_1.BlockEnum.HttpRequest]: checkHttpValid,
    [types_1.BlockEnum.Tool]: checkToolValid,
    [types_1.BlockEnum.VariableAssigner]: checkAssignerValid,
    [types_1.BlockEnum.VariableAggregator]: checkVariableAssignerValid,
    [types_1.BlockEnum.ParameterExtractor]: checkParameterExtractorValid,
    [types_1.BlockEnum.Iteration]: checkIterationValid,
    [types_1.BlockEnum.DocExtractor]: checkDocumentExtractorValid,
    [types_1.BlockEnum.Loop]: checkLoopValid,
};
const varTypeToInputVarType = (type, { isSelect, isParagraph, }) => {
    if (isSelect)
        return types_1.InputVarType.select;
    if (isParagraph)
        return types_1.InputVarType.paragraph;
    if (type === types_1.VarType.number)
        return types_1.InputVarType.number;
    if (type === types_1.VarType.boolean)
        return types_1.InputVarType.checkbox;
    if ([types_1.VarType.object, types_1.VarType.array, types_1.VarType.arrayNumber, types_1.VarType.arrayString, types_1.VarType.arrayObject].includes(type))
        return types_1.InputVarType.json;
    if (type === types_1.VarType.file)
        return types_1.InputVarType.singleFile;
    if (type === types_1.VarType.arrayFile)
        return types_1.InputVarType.multiFiles;
    return types_1.InputVarType.textInput;
};
const useOneStepRun = ({ id, flowId, flowType, data, defaultRunInputData, moreDataForCheckValid, iteratorInputKey, loopInputKey, isRunAfterSingleRun, isPaused, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { getBeforeNodesInSameBranch, getBeforeNodesInSameBranchIncludeParent } = (0, hooks_1.useWorkflow)();
    const conversationVariables = (0, store_1.useStore)(s => s.conversationVariables);
    const isChatMode = (0, hooks_1.useIsChatMode)();
    const isIteration = data.type === types_1.BlockEnum.Iteration;
    const isLoop = data.type === types_1.BlockEnum.Loop;
    const isStartNode = data.type === types_1.BlockEnum.Start;
    const availableNodes = getBeforeNodesInSameBranch(id);
    const availableNodesIncludeParent = getBeforeNodesInSameBranchIncludeParent(id);
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { schemaTypeDefinitions } = (0, use_match_schema_type_1.default)();
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const { data: mcpTools } = (0, use_tools_1.useAllMCPTools)();
    const getVar = (valueSelector) => {
        const isSystem = valueSelector[0] === 'sys';
        const { dataSourceList, } = workflowStore.getState();
        const allPluginInfoList = {
            buildInTools: buildInTools || [],
            customTools: customTools || [],
            workflowTools: workflowTools || [],
            mcpTools: mcpTools || [],
            dataSourceList: dataSourceList || [],
        };
        const allOutputVars = (0, utils_1.toNodeOutputVars)(availableNodes, isChatMode, undefined, undefined, conversationVariables, [], allPluginInfoList, schemaTypeDefinitions);
        const targetVar = allOutputVars.find(item => isSystem ? !!item.isStartNode : item.nodeId === valueSelector[0]);
        if (!targetVar)
            return undefined;
        if (isSystem)
            return targetVar.vars.find(item => item.variable.split('.')[1] === valueSelector[1]);
        let curr = targetVar.vars;
        for (let i = 1; i < valueSelector.length; i++) {
            const key = valueSelector[i];
            const isLast = i === valueSelector.length - 1;
            if (Array.isArray(curr))
                curr = curr.find((v) => v.variable.replace('conversation.', '') === key);
            if (isLast)
                return curr;
            else if (curr?.type === types_1.VarType.object || curr?.type === types_1.VarType.file)
                curr = curr.children;
        }
        return undefined;
    };
    const checkValid = checkValidFns[data.type];
    const [runInputData, setRunInputData] = (0, react_1.useState)(defaultRunInputData || {});
    const runInputDataRef = (0, react_1.useRef)(runInputData);
    const handleSetRunInputData = (0, react_1.useCallback)((data) => {
        runInputDataRef.current = data;
        setRunInputData(data);
    }, []);
    const iterationTimes = iteratorInputKey ? runInputData[iteratorInputKey]?.length : 0;
    const loopTimes = loopInputKey ? runInputData[loopInputKey]?.length : 0;
    const store = (0, reactflow_1.useStoreApi)();
    const { setShowSingleRunPanel, setIsListening, setListeningTriggerType, setListeningTriggerNodeId, setListeningTriggerNodeIds, setListeningTriggerIsAll, setShowVariableInspectPanel, } = workflowStore.getState();
    const updateNodeInspectRunningState = (0, react_1.useCallback)((nodeId, isRunning) => {
        const { nodesWithInspectVars, setNodesWithInspectVars, } = workflowStore.getState();
        let hasChanges = false;
        const nodes = (0, immer_1.produce)(nodesWithInspectVars, (draft) => {
            const index = draft.findIndex(node => node.nodeId === nodeId);
            if (index !== -1) {
                const targetNode = draft[index];
                if (targetNode.isSingRunRunning !== isRunning) {
                    targetNode.isSingRunRunning = isRunning;
                    if (isRunning)
                        targetNode.isValueFetched = false;
                    hasChanges = true;
                }
            }
            else if (isRunning) {
                const { getNodes } = store.getState();
                const target = getNodes().find(node => node.id === nodeId);
                if (target) {
                    draft.unshift({
                        nodeId,
                        nodeType: target.data.type,
                        title: target.data.title,
                        vars: [],
                        nodePayload: target.data,
                        isSingRunRunning: true,
                        isValueFetched: false,
                    });
                    hasChanges = true;
                }
            }
        });
        if (hasChanges)
            setNodesWithInspectVars(nodes);
    }, [workflowStore, store]);
    const invalidLastRun = (0, use_workflow_1.useInvalidLastRun)(flowType, flowId, id);
    const [runResult, doSetRunResult] = (0, react_1.useState)(null);
    const { appendNodeInspectVars, invalidateSysVarValues, invalidateConversationVarValues, } = (0, use_inspect_vars_crud_1.default)();
    const runningStatus = data._singleRunningStatus || types_1.NodeRunningStatus.NotStart;
    const webhookSingleRunActiveRef = (0, react_1.useRef)(false);
    const webhookSingleRunAbortRef = (0, react_1.useRef)(null);
    const webhookSingleRunTimeoutRef = (0, react_1.useRef)(undefined);
    const webhookSingleRunTokenRef = (0, react_1.useRef)(0);
    const webhookSingleRunDelayResolveRef = (0, react_1.useRef)(null);
    const pluginSingleRunActiveRef = (0, react_1.useRef)(false);
    const pluginSingleRunAbortRef = (0, react_1.useRef)(null);
    const pluginSingleRunTimeoutRef = (0, react_1.useRef)(undefined);
    const pluginSingleRunTokenRef = (0, react_1.useRef)(0);
    const pluginSingleRunDelayResolveRef = (0, react_1.useRef)(null);
    const isPausedRef = (0, react_1.useRef)(isPaused);
    (0, react_1.useEffect)(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    const isScheduleTriggerNode = data.type === types_1.BlockEnum.TriggerSchedule;
    const isWebhookTriggerNode = data.type === types_1.BlockEnum.TriggerWebhook;
    const isPluginTriggerNode = data.type === types_1.BlockEnum.TriggerPlugin;
    const isTriggerNode = isWebhookTriggerNode || isPluginTriggerNode || isScheduleTriggerNode;
    const setRunResult = (0, react_1.useCallback)(async (data) => {
        const isPaused = isPausedRef.current;
        // The backend don't support pause the single run, so the frontend handle the pause state.
        if (isPaused)
            return;
        const canRunLastRun = !isRunAfterSingleRun || runningStatus === types_1.NodeRunningStatus.Succeeded;
        if (!canRunLastRun) {
            doSetRunResult(data);
            return;
        }
        // run fail may also update the inspect vars when the node set the error default output.
        const vars = await (0, workflow_1.fetchNodeInspectVars)(flowType, flowId, id);
        const { getNodes } = store.getState();
        const nodes = getNodes();
        appendNodeInspectVars(id, vars, nodes);
        updateNodeInspectRunningState(id, false);
        if (data?.status === types_1.NodeRunningStatus.Succeeded) {
            invalidLastRun();
            if (isStartNode || isTriggerNode)
                invalidateSysVarValues();
            invalidateConversationVarValues(); // loop, iteration, variable assigner node can update the conversation variables, but to simple the logic(some nodes may also can update in the future), all nodes refresh.
        }
    }, [
        isRunAfterSingleRun,
        runningStatus,
        flowId,
        id,
        store,
        appendNodeInspectVars,
        updateNodeInspectRunningState,
        invalidLastRun,
        isStartNode,
        isTriggerNode,
        invalidateSysVarValues,
        invalidateConversationVarValues,
    ]);
    const { handleNodeDataUpdate } = (0, hooks_1.useNodeDataUpdate)();
    const setNodeRunning = () => {
        handleNodeDataUpdate({
            id,
            data: {
                ...data,
                _singleRunningStatus: types_1.NodeRunningStatus.Running,
            },
        });
    };
    const cancelWebhookSingleRun = (0, react_1.useCallback)(() => {
        webhookSingleRunActiveRef.current = false;
        webhookSingleRunTokenRef.current += 1;
        if (webhookSingleRunAbortRef.current)
            webhookSingleRunAbortRef.current.abort();
        webhookSingleRunAbortRef.current = null;
        if (webhookSingleRunTimeoutRef.current !== undefined) {
            window.clearTimeout(webhookSingleRunTimeoutRef.current);
            webhookSingleRunTimeoutRef.current = undefined;
        }
        if (webhookSingleRunDelayResolveRef.current) {
            webhookSingleRunDelayResolveRef.current();
            webhookSingleRunDelayResolveRef.current = null;
        }
    }, []);
    const cancelPluginSingleRun = (0, react_1.useCallback)(() => {
        pluginSingleRunActiveRef.current = false;
        pluginSingleRunTokenRef.current += 1;
        if (pluginSingleRunAbortRef.current)
            pluginSingleRunAbortRef.current.abort();
        pluginSingleRunAbortRef.current = null;
        if (pluginSingleRunTimeoutRef.current !== undefined) {
            window.clearTimeout(pluginSingleRunTimeoutRef.current);
            pluginSingleRunTimeoutRef.current = undefined;
        }
        if (pluginSingleRunDelayResolveRef.current) {
            pluginSingleRunDelayResolveRef.current();
            pluginSingleRunDelayResolveRef.current = null;
        }
    }, []);
    const startTriggerListening = (0, react_1.useCallback)(() => {
        if (!isTriggerNode)
            return;
        setIsListening(true);
        setShowVariableInspectPanel(true);
        setListeningTriggerType(data.type);
        setListeningTriggerNodeId(id);
        setListeningTriggerNodeIds([id]);
        setListeningTriggerIsAll(false);
    }, [
        isTriggerNode,
        setIsListening,
        setShowVariableInspectPanel,
        setListeningTriggerType,
        data.type,
        setListeningTriggerNodeId,
        id,
        setListeningTriggerNodeIds,
        setListeningTriggerIsAll,
    ]);
    const stopTriggerListening = (0, react_1.useCallback)(() => {
        if (!isTriggerNode)
            return;
        setIsListening(false);
        setListeningTriggerType(null);
        setListeningTriggerNodeId(null);
        setListeningTriggerNodeIds([]);
        setListeningTriggerIsAll(false);
    }, [
        isTriggerNode,
        setIsListening,
        setListeningTriggerType,
        setListeningTriggerNodeId,
        setListeningTriggerNodeIds,
        setListeningTriggerIsAll,
    ]);
    const runScheduleSingleRun = (0, react_1.useCallback)(async () => {
        const urlPath = `/apps/${flowId}/workflows/draft/nodes/${id}/trigger/run`;
        try {
            const response = await (0, base_1.post)(urlPath, {
                body: JSON.stringify({}),
            });
            if (!response) {
                const message = 'Schedule trigger run failed';
                toast_1.default.notify({ type: 'error', message });
                throw new Error(message);
            }
            if (response?.status === 'error') {
                const message = response?.message || 'Schedule trigger run failed';
                toast_1.default.notify({ type: 'error', message });
                throw new Error(message);
            }
            handleNodeDataUpdate({
                id,
                data: {
                    ...data,
                    _isSingleRun: false,
                    _singleRunningStatus: types_1.NodeRunningStatus.Succeeded,
                },
            });
            return response;
        }
        catch (error) {
            console.error('handleRun: schedule trigger single run error', error);
            handleNodeDataUpdate({
                id,
                data: {
                    ...data,
                    _isSingleRun: false,
                    _singleRunningStatus: types_1.NodeRunningStatus.Failed,
                },
            });
            toast_1.default.notify({ type: 'error', message: 'Schedule trigger run failed' });
            throw error;
        }
    }, [flowId, id, handleNodeDataUpdate, data]);
    const runWebhookSingleRun = (0, react_1.useCallback)(async () => {
        const urlPath = `/apps/${flowId}/workflows/draft/nodes/${id}/trigger/run`;
        webhookSingleRunActiveRef.current = true;
        const token = ++webhookSingleRunTokenRef.current;
        while (webhookSingleRunActiveRef.current && token === webhookSingleRunTokenRef.current) {
            const controller = new AbortController();
            webhookSingleRunAbortRef.current = controller;
            try {
                const response = await (0, base_1.post)(urlPath, {
                    body: JSON.stringify({}),
                    signal: controller.signal,
                });
                if (!webhookSingleRunActiveRef.current || token !== webhookSingleRunTokenRef.current)
                    return null;
                if (!response) {
                    const message = response?.message || 'Webhook debug failed';
                    toast_1.default.notify({ type: 'error', message });
                    cancelWebhookSingleRun();
                    throw new Error(message);
                }
                if (response?.status === 'waiting') {
                    const delay = Number(response.retry_in) || 2000;
                    webhookSingleRunAbortRef.current = null;
                    if (!webhookSingleRunActiveRef.current || token !== webhookSingleRunTokenRef.current)
                        return null;
                    await new Promise((resolve) => {
                        const timeoutId = window.setTimeout(resolve, delay);
                        webhookSingleRunTimeoutRef.current = timeoutId;
                        webhookSingleRunDelayResolveRef.current = resolve;
                        controller.signal.addEventListener('abort', () => {
                            window.clearTimeout(timeoutId);
                            resolve();
                        }, { once: true });
                    });
                    webhookSingleRunTimeoutRef.current = undefined;
                    webhookSingleRunDelayResolveRef.current = null;
                    continue;
                }
                if (response?.status === 'error') {
                    const message = response.message || 'Webhook debug failed';
                    toast_1.default.notify({ type: 'error', message });
                    cancelWebhookSingleRun();
                    throw new Error(message);
                }
                handleNodeDataUpdate({
                    id,
                    data: {
                        ...data,
                        _isSingleRun: false,
                        _singleRunningStatus: types_1.NodeRunningStatus.Listening,
                    },
                });
                cancelWebhookSingleRun();
                return response;
            }
            catch (error) {
                if (controller.signal.aborted && (!webhookSingleRunActiveRef.current || token !== webhookSingleRunTokenRef.current))
                    return null;
                if (controller.signal.aborted)
                    return null;
                toast_1.default.notify({ type: 'error', message: 'Webhook debug request failed' });
                cancelWebhookSingleRun();
                if (error instanceof Error)
                    throw error;
                throw new Error(String(error));
            }
            finally {
                webhookSingleRunAbortRef.current = null;
            }
        }
        return null;
    }, [flowId, id, data, handleNodeDataUpdate, cancelWebhookSingleRun]);
    const runPluginSingleRun = (0, react_1.useCallback)(async () => {
        const urlPath = `/apps/${flowId}/workflows/draft/nodes/${id}/trigger/run`;
        pluginSingleRunActiveRef.current = true;
        const token = ++pluginSingleRunTokenRef.current;
        while (pluginSingleRunActiveRef.current && token === pluginSingleRunTokenRef.current) {
            const controller = new AbortController();
            pluginSingleRunAbortRef.current = controller;
            let requestError;
            const response = await (0, base_1.post)(urlPath, {
                body: JSON.stringify({}),
                signal: controller.signal,
            }).catch(async (error) => {
                const data = await error.clone().json();
                const { error: respError, status } = data || {};
                requestError = {
                    message: respError,
                    status,
                };
                return null;
            }).finally(() => {
                pluginSingleRunAbortRef.current = null;
            });
            if (!pluginSingleRunActiveRef.current || token !== pluginSingleRunTokenRef.current)
                return null;
            if (requestError) {
                if (controller.signal.aborted)
                    return null;
                toast_1.default.notify({ type: 'error', message: requestError.message });
                cancelPluginSingleRun();
                throw requestError;
            }
            if (!response) {
                const message = 'Plugin debug failed';
                toast_1.default.notify({ type: 'error', message });
                cancelPluginSingleRun();
                throw new Error(message);
            }
            if (response?.status === 'waiting') {
                const delay = Number(response.retry_in) || 2000;
                if (!pluginSingleRunActiveRef.current || token !== pluginSingleRunTokenRef.current)
                    return null;
                await new Promise((resolve) => {
                    const timeoutId = window.setTimeout(resolve, delay);
                    pluginSingleRunTimeoutRef.current = timeoutId;
                    pluginSingleRunDelayResolveRef.current = resolve;
                    controller.signal.addEventListener('abort', () => {
                        window.clearTimeout(timeoutId);
                        resolve();
                    }, { once: true });
                });
                pluginSingleRunTimeoutRef.current = undefined;
                pluginSingleRunDelayResolveRef.current = null;
                continue;
            }
            if (response?.status === 'error') {
                const message = response.message || 'Plugin debug failed';
                toast_1.default.notify({ type: 'error', message });
                cancelPluginSingleRun();
                throw new Error(message);
            }
            handleNodeDataUpdate({
                id,
                data: {
                    ...data,
                    _isSingleRun: false,
                    _singleRunningStatus: types_1.NodeRunningStatus.Listening,
                },
            });
            cancelPluginSingleRun();
            return response;
        }
        return null;
    }, [flowId, id, data, handleNodeDataUpdate, cancelPluginSingleRun]);
    const checkValidWrap = () => {
        if (!checkValid)
            return { isValid: true, errorMessage: '' };
        const res = checkValid(data, t, moreDataForCheckValid);
        if (!res.isValid) {
            handleNodeDataUpdate({
                id,
                data: {
                    ...data,
                    _isSingleRun: false,
                },
            });
            toast_1.default.notify({
                type: 'error',
                message: res.errorMessage || '',
            });
        }
        return res;
    };
    const [canShowSingleRun, setCanShowSingleRun] = (0, react_1.useState)(false);
    const isShowSingleRun = data._isSingleRun && canShowSingleRun;
    const [iterationRunResult, setIterationRunResult] = (0, react_1.useState)([]);
    const [loopRunResult, setLoopRunResult] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (!checkValid) {
            setCanShowSingleRun(true);
            return;
        }
        if (data._isSingleRun) {
            const { isValid } = checkValidWrap();
            setCanShowSingleRun(isValid);
        }
    }, [data._isSingleRun]);
    (0, react_1.useEffect)(() => {
        setShowSingleRunPanel(!!isShowSingleRun);
    }, [isShowSingleRun, setShowSingleRunPanel]);
    const hideSingleRun = () => {
        handleNodeDataUpdate({
            id,
            data: {
                ...data,
                _isSingleRun: false,
            },
        });
    };
    const showSingleRun = () => {
        handleNodeDataUpdate({
            id,
            data: {
                ...data,
                _isSingleRun: true,
            },
        });
    };
    const isCompleted = runningStatus === types_1.NodeRunningStatus.Succeeded || runningStatus === types_1.NodeRunningStatus.Failed;
    const handleRun = async (submitData) => {
        if (isWebhookTriggerNode)
            cancelWebhookSingleRun();
        if (isPluginTriggerNode)
            cancelPluginSingleRun();
        updateNodeInspectRunningState(id, true);
        if (isTriggerNode)
            startTriggerListening();
        else
            stopTriggerListening();
        handleNodeDataUpdate({
            id,
            data: {
                ...data,
                _isSingleRun: false,
                _singleRunningStatus: isTriggerNode
                    ? types_1.NodeRunningStatus.Listening
                    : types_1.NodeRunningStatus.Running,
            },
        });
        let res;
        let hasError = false;
        try {
            if (!isIteration && !isLoop) {
                if (isScheduleTriggerNode) {
                    res = await runScheduleSingleRun();
                }
                else if (isWebhookTriggerNode) {
                    res = await runWebhookSingleRun();
                    if (!res) {
                        if (webhookSingleRunActiveRef.current) {
                            handleNodeDataUpdate({
                                id,
                                data: {
                                    ...data,
                                    _isSingleRun: false,
                                    _singleRunningStatus: types_1.NodeRunningStatus.Stopped,
                                },
                            });
                        }
                        return false;
                    }
                }
                else if (isPluginTriggerNode) {
                    res = await runPluginSingleRun();
                    if (!res) {
                        if (pluginSingleRunActiveRef.current) {
                            handleNodeDataUpdate({
                                id,
                                data: {
                                    ...data,
                                    _isSingleRun: false,
                                    _singleRunningStatus: types_1.NodeRunningStatus.Stopped,
                                },
                            });
                        }
                        return false;
                    }
                }
                else {
                    const isStartNode = data.type === types_1.BlockEnum.Start;
                    const postData = {};
                    if (isStartNode) {
                        const { '#sys.query#': query, '#sys.files#': files, ...inputs } = submitData;
                        if (isChatMode)
                            postData.conversation_id = '';
                        postData.inputs = inputs;
                        postData.query = query;
                        postData.files = files || [];
                    }
                    else {
                        postData.inputs = submitData;
                    }
                    res = await (0, workflow_1.singleNodeRun)(flowType, flowId, id, postData);
                }
            }
            else if (isIteration) {
                setIterationRunResult([]);
                let _iterationResult = [];
                let _runResult = null;
                (0, base_1.ssePost)((0, workflow_1.getIterationSingleNodeRunUrl)(flowType, isChatMode, flowId, id), { body: { inputs: submitData } }, {
                    onWorkflowStarted: function_1.noop,
                    onWorkflowFinished: (params) => {
                        if (isPausedRef.current)
                            return;
                        handleNodeDataUpdate({
                            id,
                            data: {
                                ...data,
                                _isSingleRun: false,
                                _singleRunningStatus: types_1.NodeRunningStatus.Succeeded,
                            },
                        });
                        const { data: iterationData } = params;
                        _runResult.created_by = iterationData.created_by.name;
                        setRunResult(_runResult);
                    },
                    onIterationStart: (params) => {
                        const newIterationRunResult = (0, immer_1.produce)(_iterationResult, (draft) => {
                            draft.push({
                                ...params.data,
                                status: types_1.NodeRunningStatus.Running,
                            });
                        });
                        _iterationResult = newIterationRunResult;
                        setIterationRunResult(newIterationRunResult);
                    },
                    onIterationNext: () => {
                        // iteration next trigger time is triggered one more time than iterationTimes
                        if (_iterationResult.length >= iterationTimes)
                            return _iterationResult.length >= iterationTimes;
                    },
                    onIterationFinish: (params) => {
                        _runResult = params.data;
                        setRunResult(_runResult);
                        const iterationRunResult = _iterationResult;
                        const currentIndex = iterationRunResult.findIndex(trace => trace.id === params.data.id);
                        const newIterationRunResult = (0, immer_1.produce)(iterationRunResult, (draft) => {
                            if (currentIndex > -1) {
                                draft[currentIndex] = {
                                    ...draft[currentIndex],
                                    ...data,
                                };
                            }
                        });
                        _iterationResult = newIterationRunResult;
                        setIterationRunResult(newIterationRunResult);
                    },
                    onNodeStarted: (params) => {
                        const newIterationRunResult = (0, immer_1.produce)(_iterationResult, (draft) => {
                            draft.push({
                                ...params.data,
                                status: types_1.NodeRunningStatus.Running,
                            });
                        });
                        _iterationResult = newIterationRunResult;
                        setIterationRunResult(newIterationRunResult);
                    },
                    onNodeFinished: (params) => {
                        const iterationRunResult = _iterationResult;
                        const { data } = params;
                        const currentIndex = iterationRunResult.findIndex(trace => trace.id === data.id);
                        const newIterationRunResult = (0, immer_1.produce)(iterationRunResult, (draft) => {
                            if (currentIndex > -1) {
                                draft[currentIndex] = {
                                    ...draft[currentIndex],
                                    ...data,
                                };
                            }
                        });
                        _iterationResult = newIterationRunResult;
                        setIterationRunResult(newIterationRunResult);
                    },
                    onNodeRetry: (params) => {
                        const newIterationRunResult = (0, immer_1.produce)(_iterationResult, (draft) => {
                            draft.push(params.data);
                        });
                        _iterationResult = newIterationRunResult;
                        setIterationRunResult(newIterationRunResult);
                    },
                    onError: () => {
                        if (isPausedRef.current)
                            return;
                        handleNodeDataUpdate({
                            id,
                            data: {
                                ...data,
                                _isSingleRun: false,
                                _singleRunningStatus: types_1.NodeRunningStatus.Failed,
                            },
                        });
                    },
                });
            }
            else if (isLoop) {
                setLoopRunResult([]);
                let _loopResult = [];
                let _runResult = null;
                (0, base_1.ssePost)((0, workflow_1.getLoopSingleNodeRunUrl)(flowType, isChatMode, flowId, id), { body: { inputs: submitData } }, {
                    onWorkflowStarted: function_1.noop,
                    onWorkflowFinished: (params) => {
                        if (isPausedRef.current)
                            return;
                        handleNodeDataUpdate({
                            id,
                            data: {
                                ...data,
                                _isSingleRun: false,
                                _singleRunningStatus: types_1.NodeRunningStatus.Succeeded,
                            },
                        });
                        const { data: loopData } = params;
                        _runResult.created_by = loopData.created_by.name;
                        setRunResult(_runResult);
                    },
                    onLoopStart: (params) => {
                        const newLoopRunResult = (0, immer_1.produce)(_loopResult, (draft) => {
                            draft.push({
                                ...params.data,
                                status: types_1.NodeRunningStatus.Running,
                            });
                        });
                        _loopResult = newLoopRunResult;
                        setLoopRunResult(newLoopRunResult);
                    },
                    onLoopNext: () => {
                        // loop next trigger time is triggered one more time than loopTimes
                        if (_loopResult.length >= loopTimes)
                            return _loopResult.length >= loopTimes;
                    },
                    onLoopFinish: (params) => {
                        _runResult = params.data;
                        setRunResult(_runResult);
                        const loopRunResult = _loopResult;
                        const currentIndex = loopRunResult.findIndex(trace => trace.id === params.data.id);
                        const newLoopRunResult = (0, immer_1.produce)(loopRunResult, (draft) => {
                            if (currentIndex > -1) {
                                draft[currentIndex] = {
                                    ...draft[currentIndex],
                                    ...data,
                                };
                            }
                        });
                        _loopResult = newLoopRunResult;
                        setLoopRunResult(newLoopRunResult);
                    },
                    onNodeStarted: (params) => {
                        const newLoopRunResult = (0, immer_1.produce)(_loopResult, (draft) => {
                            draft.push({
                                ...params.data,
                                status: types_1.NodeRunningStatus.Running,
                            });
                        });
                        _loopResult = newLoopRunResult;
                        setLoopRunResult(newLoopRunResult);
                    },
                    onNodeFinished: (params) => {
                        const loopRunResult = _loopResult;
                        const { data } = params;
                        const currentIndex = loopRunResult.findIndex(trace => trace.id === data.id);
                        const newLoopRunResult = (0, immer_1.produce)(loopRunResult, (draft) => {
                            if (currentIndex > -1) {
                                draft[currentIndex] = {
                                    ...draft[currentIndex],
                                    ...data,
                                };
                            }
                        });
                        _loopResult = newLoopRunResult;
                        setLoopRunResult(newLoopRunResult);
                    },
                    onNodeRetry: (params) => {
                        const newLoopRunResult = (0, immer_1.produce)(_loopResult, (draft) => {
                            draft.push(params.data);
                        });
                        _loopResult = newLoopRunResult;
                        setLoopRunResult(newLoopRunResult);
                    },
                    onError: () => {
                        if (isPausedRef.current)
                            return;
                        handleNodeDataUpdate({
                            id,
                            data: {
                                ...data,
                                _isSingleRun: false,
                                _singleRunningStatus: types_1.NodeRunningStatus.Failed,
                            },
                        });
                        (0, amplitude_1.trackEvent)('workflow_run_failed', { workflow_id: flowId, node_id: id, reason: res.error, node_type: data?.type });
                    },
                });
            }
            if (res && res.error)
                throw new Error(res.error);
        }
        catch (e) {
            console.error(e);
            hasError = true;
            invalidLastRun();
            if (!isIteration && !isLoop) {
                if (isPausedRef.current)
                    return;
                handleNodeDataUpdate({
                    id,
                    data: {
                        ...data,
                        _isSingleRun: false,
                        _singleRunningStatus: types_1.NodeRunningStatus.Failed,
                    },
                });
                return false;
            }
        }
        finally {
            if (isWebhookTriggerNode)
                cancelWebhookSingleRun();
            if (isPluginTriggerNode)
                cancelPluginSingleRun();
            if (isTriggerNode)
                stopTriggerListening();
            if (!isIteration && !isLoop)
                updateNodeInspectRunningState(id, false);
            if (!isPausedRef.current && !isIteration && !isLoop && res) {
                setRunResult({
                    ...res,
                    total_tokens: res.execution_metadata?.total_tokens || 0,
                    created_by: res.created_by_account?.name || '',
                });
            }
        }
        if (isPausedRef.current)
            return;
        if (!isIteration && !isLoop && !hasError) {
            if (isPausedRef.current)
                return;
            handleNodeDataUpdate({
                id,
                data: {
                    ...data,
                    _isSingleRun: false,
                    _singleRunningStatus: types_1.NodeRunningStatus.Succeeded,
                },
            });
        }
    };
    const handleStop = (0, react_1.useCallback)(() => {
        if (isTriggerNode) {
            const isTriggerActive = runningStatus === types_1.NodeRunningStatus.Listening
                || webhookSingleRunActiveRef.current
                || pluginSingleRunActiveRef.current;
            if (!isTriggerActive)
                return;
        }
        else if (runningStatus !== types_1.NodeRunningStatus.Running) {
            return;
        }
        cancelWebhookSingleRun();
        cancelPluginSingleRun();
        handleNodeDataUpdate({
            id,
            data: {
                _isSingleRun: false,
                _singleRunningStatus: types_1.NodeRunningStatus.Stopped,
            },
        });
        stopTriggerListening();
        updateNodeInspectRunningState(id, false);
        const { workflowRunningData, setWorkflowRunningData, nodesWithInspectVars, deleteNodeInspectVars, } = workflowStore.getState();
        if (workflowRunningData) {
            setWorkflowRunningData((0, immer_1.produce)(workflowRunningData, (draft) => {
                draft.result.status = types_1.WorkflowRunningStatus.Stopped;
            }));
        }
        const inspectNode = nodesWithInspectVars.find(node => node.nodeId === id);
        if (inspectNode && !inspectNode.isValueFetched && (!inspectNode.vars || inspectNode.vars.length === 0))
            deleteNodeInspectVars(id);
    }, [
        isTriggerNode,
        runningStatus,
        cancelWebhookSingleRun,
        cancelPluginSingleRun,
        handleNodeDataUpdate,
        id,
        stopTriggerListening,
        updateNodeInspectRunningState,
        workflowStore,
    ]);
    const toVarInputs = (variables) => {
        if (!variables)
            return [];
        const varInputs = variables.filter(item => !(0, utils_1.isENV)(item.value_selector)).map((item) => {
            const originalVar = getVar(item.value_selector);
            if (!originalVar) {
                return {
                    label: item.label || item.variable,
                    variable: item.variable,
                    type: types_1.InputVarType.textInput,
                    required: true,
                    value_selector: item.value_selector,
                };
            }
            return {
                label: (typeof item.label === 'object' ? item.label.variable : item.label) || item.variable,
                variable: item.variable,
                type: varTypeToInputVarType(originalVar.type, {
                    isSelect: !!originalVar.isSelect,
                    isParagraph: !!originalVar.isParagraph,
                }),
                required: item.required !== false,
                options: originalVar.options,
            };
        });
        return varInputs;
    };
    const getInputVars = (textList) => {
        const valueSelectors = [];
        textList.forEach((text) => {
            valueSelectors.push(...(0, constants_1.getInputVars)(text));
        });
        const variables = (0, compat_1.unionBy)(valueSelectors, item => item.join('.')).map((item) => {
            const varInfo = (0, utils_1.getNodeInfoById)(availableNodesIncludeParent, item[0])?.data;
            return {
                label: {
                    nodeType: varInfo?.type,
                    nodeName: varInfo?.title || availableNodesIncludeParent[0]?.data.title, // default start node title
                    variable: (0, utils_1.isSystemVar)(item) ? item.join('.') : item[item.length - 1],
                    isChatVar: (0, utils_1.isConversationVar)(item),
                },
                variable: `#${item.join('.')}#`,
                value_selector: item,
            };
        });
        const varInputs = toVarInputs(variables);
        return varInputs;
    };
    const varSelectorsToVarInputs = (valueSelectors) => {
        return valueSelectors.filter(item => !!item).map((item) => {
            return getInputVars([`{{#${typeof item === 'string' ? item : item.join('.')}#}}`])[0];
        });
    };
    eventEmitter?.useSubscription((v) => {
        if (v.type === types_2.EVENT_WORKFLOW_STOP)
            handleStop();
    });
    return {
        isShowSingleRun,
        hideSingleRun,
        showSingleRun,
        toVarInputs,
        varSelectorsToVarInputs,
        getInputVars,
        runningStatus,
        isCompleted,
        handleRun,
        handleStop,
        runInputData,
        runInputDataRef,
        setRunInputData: handleSetRunInputData,
        runResult,
        setRunResult: doSetRunResult,
        iterationRunResult,
        loopRunResult,
        setNodeRunning,
        checkValid: checkValidWrap,
    };
};
exports.default = useOneStepRun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW9uZS1zdGVwLXJ1bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1vbmUtc3RlcC1ydW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSw4Q0FBMkM7QUFDM0Msa0RBQTBDO0FBRTFDLGlDQUErQjtBQUMvQixpQ0FBZ0U7QUFDaEUsaURBQThDO0FBQzlDLHlDQUVrQjtBQUNsQiwrREFBNEQ7QUFDNUQsNkVBQThGO0FBQzlGLHVEQUErQztBQUMvQywyREFJd0M7QUFDeEMsaUdBQXNGO0FBQ3RGLDJGQUEwSjtBQUMxSiw4RUFBdUU7QUFDdkUsMEVBQXNFO0FBQ3RFLHdGQUFpRztBQUNqRywwRUFBc0U7QUFDdEUsNkVBQTJFO0FBQzNFLCtFQUFnRjtBQUNoRix5RkFBbUc7QUFDbkcseUVBQW9FO0FBQ3BFLDBFQUFzRTtBQUN0RSwwRkFBbUc7QUFDbkcsMEZBQWlHO0FBQ2pHLHlGQUFpRztBQUNqRywyRUFBc0U7QUFDdEUsd0ZBQXdGO0FBQ3hGLDJEQUE0RTtBQUM1RSwyREFNd0M7QUFDeEMsNEVBQXNGO0FBQ3RGLDJEQUF1RTtBQUN2RSx5Q0FBOEM7QUFDOUMsbURBSzRCO0FBQzVCLHlEQUEwRDtBQUMxRCxpREFBK0g7QUFDL0gsd0ZBQTZFO0FBRTdFLE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLEdBQUcsaUJBQVUsQ0FBQTtBQUNoRCxNQUFNLEVBQUUsVUFBVSxFQUFFLDRCQUE0QixFQUFFLEdBQUcsaUJBQXlCLENBQUE7QUFDOUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLGlCQUFhLENBQUE7QUFDdEQsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsR0FBRyxpQkFBVyxDQUFBO0FBQ2xELE1BQU0sRUFBRSxVQUFVLEVBQUUsMkJBQTJCLEVBQUUsR0FBRyxrQkFBd0IsQ0FBQTtBQUM1RSxNQUFNLEVBQUUsVUFBVSxFQUFFLDBCQUEwQixFQUFFLEdBQUcsa0JBQXVCLENBQUE7QUFDMUUs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LFNBQVM7UUFDVCxZQUFZLEVBQUUsY0FBYztRQUM1QixrQkFBa0I7UUFDbEIsYUFBYTtRQUNiLGNBQWM7UUFDZCxVQUFVLEVBQUUsY0FBYztLQUMzQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDb21tb25Ob2RlVHlwZSwgSW5wdXRWYXIsIFRyaWdnZXJOb2RlVHlwZSwgVmFsdWVTZWxlY3RvciwgVmFyLCBWYXJpYWJsZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEZsb3dUeXBlIH0gZnJvbSAnQC90eXBlcy9jb21tb24nXG5pbXBvcnQgdHlwZSB7IE5vZGVSdW5SZXN1bHQsIE5vZGVUcmFjaW5nIH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IHVuaW9uQnkgfSBmcm9tICdlcy10b29sa2l0L2NvbXBhdCdcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdlcy10b29sa2l0L2Z1bmN0aW9uJ1xuXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQge1xuICB1c2VTdG9yZUFwaSxcbn0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IHsgdHJhY2tFdmVudCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hbXBsaXR1ZGUnXG5pbXBvcnQgeyBnZXRJbnB1dFZhcnMgYXMgZG9HZXRJbnB1dFZhcnMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcHJvbXB0LWVkaXRvci9jb25zdGFudHMnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHtcbiAgdXNlSXNDaGF0TW9kZSxcbiAgdXNlTm9kZURhdGFVcGRhdGUsXG4gIHVzZVdvcmtmbG93LFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzJ1xuaW1wb3J0IHVzZUluc3BlY3RWYXJzQ3J1ZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1pbnNwZWN0LXZhcnMtY3J1ZCdcbmltcG9ydCB7IGdldE5vZGVJbmZvQnlJZCwgaXNDb252ZXJzYXRpb25WYXIsIGlzRU5WLCBpc1N5c3RlbVZhciwgdG9Ob2RlT3V0cHV0VmFycyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvX2Jhc2UvY29tcG9uZW50cy92YXJpYWJsZS91dGlscydcbmltcG9ydCBBc3NpZ25lciBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2Fzc2lnbmVyL2RlZmF1bHQnXG5pbXBvcnQgQ29kZURlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9jb2RlL2RlZmF1bHQnXG5pbXBvcnQgRG9jdW1lbnRFeHRyYWN0b3JEZWZhdWx0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvZG9jdW1lbnQtZXh0cmFjdG9yL2RlZmF1bHQnXG5pbXBvcnQgSFRUUERlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9odHRwL2RlZmF1bHQnXG5pbXBvcnQgSWZFbHNlRGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2lmLWVsc2UvZGVmYXVsdCdcbmltcG9ydCBJdGVyYXRpb25EZWZhdWx0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvaXRlcmF0aW9uL2RlZmF1bHQnXG5pbXBvcnQgS25vd2xlZGdlUmV0cmlldmFsRGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvZGVmYXVsdCdcbmltcG9ydCBMTE1EZWZhdWx0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvbGxtL2RlZmF1bHQnXG5pbXBvcnQgTG9vcERlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9sb29wL2RlZmF1bHQnXG5pbXBvcnQgUGFyYW1ldGVyRXh0cmFjdG9yRGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3BhcmFtZXRlci1leHRyYWN0b3IvZGVmYXVsdCdcbmltcG9ydCBRdWVzdGlvbkNsYXNzaWZ5RGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3F1ZXN0aW9uLWNsYXNzaWZpZXIvZGVmYXVsdCdcbmltcG9ydCBUZW1wbGF0ZVRyYW5zZm9ybURlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy90ZW1wbGF0ZS10cmFuc2Zvcm0vZGVmYXVsdCdcbmltcG9ydCBUb29sRGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3Rvb2wvZGVmYXVsdCdcbmltcG9ydCBWYXJpYWJsZUFzc2lnbmVyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvdmFyaWFibGUtYXNzaWduZXIvZGVmYXVsdCdcbmltcG9ydCB7IHVzZVN0b3JlLCB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7XG4gIEJsb2NrRW51bSxcbiAgSW5wdXRWYXJUeXBlLFxuICBOb2RlUnVubmluZ1N0YXR1cyxcbiAgVmFyVHlwZSxcbiAgV29ya2Zsb3dSdW5uaW5nU3RhdHVzLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgRVZFTlRfV09SS0ZMT1dfU1RPUCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdmFyaWFibGUtaW5zcGVjdC90eXBlcydcbmltcG9ydCB7IHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgeyBwb3N0LCBzc2VQb3N0IH0gZnJvbSAnQC9zZXJ2aWNlL2Jhc2UnXG5pbXBvcnQge1xuICB1c2VBbGxCdWlsdEluVG9vbHMsXG4gIHVzZUFsbEN1c3RvbVRvb2xzLFxuICB1c2VBbGxNQ1BUb29scyxcbiAgdXNlQWxsV29ya2Zsb3dUb29scyxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10b29scydcbmltcG9ydCB7IHVzZUludmFsaWRMYXN0UnVuIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS13b3JrZmxvdydcbmltcG9ydCB7IGZldGNoTm9kZUluc3BlY3RWYXJzLCBnZXRJdGVyYXRpb25TaW5nbGVOb2RlUnVuVXJsLCBnZXRMb29wU2luZ2xlTm9kZVJ1blVybCwgc2luZ2xlTm9kZVJ1biB9IGZyb20gJ0Avc2VydmljZS93b3JrZmxvdydcbmltcG9ydCB1c2VNYXRjaFNjaGVtYVR5cGUgZnJvbSAnLi4vY29tcG9uZW50cy92YXJpYWJsZS91c2UtbWF0Y2gtc2NoZW1hLXR5cGUnXG5cbmNvbnN0IHsgY2hlY2tWYWxpZDogY2hlY2tMTE1WYWxpZCB9ID0gTExNRGVmYXVsdFxuY29uc3QgeyBjaGVja1ZhbGlkOiBjaGVja0tub3dsZWRnZVJldHJpZXZhbFZhbGlkIH0gPSBLbm93bGVkZ2VSZXRyaWV2YWxEZWZhdWx0XG5jb25zdCB7IGNoZWNrVmFsaWQ6IGNoZWNrSWZFbHNlVmFsaWQgfSA9IElmRWxzZURlZmF1bHRcbmNvbnN0IHsgY2hlY2tWYWxpZDogY2hlY2tDb2RlVmFsaWQgfSA9IENvZGVEZWZhdWx0XG5jb25zdCB7IGNoZWNrVmFsaWQ6IGNoZWNrVGVtcGxhdGVUcmFuc2Zvcm1WYWxpZCB9ID0gVGVtcGxhdGVUcmFuc2Zvcm1EZWZhdWx0XG5jb25zdCB7IGNoZWNrVmFsaWQ6IGNoZWNrUXVlc3Rpb25DbGFzc2lmeVZhbGlkIH0gPSBRdWVzdGlvbkNsYXNzaWZ5RGVmYXVsdFxuY29uc3QgeyBjaGVja1ZhbGlkOiBjaGVja0h0dHBWYWxpZCB9ID0gSFRUUERlZmF1bHRcbmNvbnN0IHsgY2hlY2tWYWxpZDogY2hlY2tUb29sVmFsaWQgfSA9IFRvb2xEZWZhdWx0XG5jb25zdCB7IGNoZWNrVmFsaWQ6IGNoZWNrVmFyaWFibGVBc3NpZ25lclZhbGlkIH0gPSBWYXJpYWJsZUFzc2lnbmVyXG5jb25zdCB7IGNoZWNrVmFsaWQ6IGNoZWNrQXNzaWduZXJWYWxpZCB9ID0gQXNzaWduZXJcbmNvbnN0IHsgY2hlY2tWYWxpZDogY2hlY2tQYXJhbWV0ZXJFeHRyYWN0b3JWYWxpZCB9ID0gUGFyYW1ldGVyRXh0cmFjdG9yRGVmYXVsdFxuY29uc3QgeyBjaGVja1ZhbGlkOiBjaGVja0l0ZXJhdGlvblZhbGlkIH0gPSBJdGVyYXRpb25EZWZhdWx0XG5jb25zdCB7IGNoZWNrVmFsaWQ6IGNoZWNrRG9jdW1lbnRFeHRyYWN0b3JWYWxpZCB9ID0gRG9jdW1lbnRFeHRyYWN0b3JEZWZhdWx0XG5jb25zdCB7IGNoZWNrVmFsaWQ6IGNoZWNrTG9vcFZhbGlkIH0gPSBMb29wRGVmYXVsdFxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdHMvbm8tdW5zYWZlLWZ1bmN0aW9uLXR5cGVcbmNvbnN0IGNoZWNrVmFsaWRGbnM6IFBhcnRpYWw8UmVjb3JkPEJsb2NrRW51bSwgRnVuY3Rpb24+PiA9IHtcbiAgW0Jsb2NrRW51bS5MTE1dOiBjaGVja0xMTVZhbGlkLFxuICBbQmxvY2tFbnVtLktub3dsZWRnZVJldHJpZXZhbF06IGNoZWNrS25vd2xlZGdlUmV0cmlldmFsVmFsaWQsXG4gIFtCbG9ja0VudW0uSWZFbHNlXTogY2hlY2tJZkVsc2VWYWxpZCxcbiAgW0Jsb2NrRW51bS5Db2RlXTogY2hlY2tDb2RlVmFsaWQsXG4gIFtCbG9ja0VudW0uVGVtcGxhdGVUcmFuc2Zvcm1dOiBjaGVja1RlbXBsYXRlVHJhbnNmb3JtVmFsaWQsXG4gIFtCbG9ja0VudW0uUXVlc3Rpb25DbGFzc2lmaWVyXTogY2hlY2tRdWVzdGlvbkNsYXNzaWZ5VmFsaWQsXG4gIFtCbG9ja0VudW0uSHR0cFJlcXVlc3RdOiBjaGVja0h0dHBWYWxpZCxcbiAgW0Jsb2NrRW51bS5Ub29sXTogY2hlY2tUb29sVmFsaWQsXG4gIFtCbG9ja0VudW0uVmFyaWFibGVBc3NpZ25lcl06IGNoZWNrQXNzaWduZXJWYWxpZCxcbiAgW0Jsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3JdOiBjaGVja1ZhcmlhYmxlQXNzaWduZXJWYWxpZCxcbiAgW0Jsb2NrRW51bS5QYXJhbWV0ZXJFeHRyYWN0b3JdOiBjaGVja1BhcmFtZXRlckV4dHJhY3RvclZhbGlkLFxuICBbQmxvY2tFbnVtLkl0ZXJhdGlvbl06IGNoZWNrSXRlcmF0aW9uVmFsaWQsXG4gIFtCbG9ja0VudW0uRG9jRXh0cmFjdG9yXTogY2hlY2tEb2N1bWVudEV4dHJhY3RvclZhbGlkLFxuICBbQmxvY2tFbnVtLkxvb3BdOiBjaGVja0xvb3BWYWxpZCxcbn1cblxudHlwZSBSZXF1ZXN0RXJyb3IgPSB7XG4gIG1lc3NhZ2U6IHN0cmluZ1xuICBzdGF0dXM6IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBQYXJhbXM8VD4gPSB7XG4gIGlkOiBzdHJpbmdcbiAgZmxvd0lkOiBzdHJpbmdcbiAgZmxvd1R5cGU6IEZsb3dUeXBlXG4gIGRhdGE6IENvbW1vbk5vZGVUeXBlPFQ+XG4gIGRlZmF1bHRSdW5JbnB1dERhdGE6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgbW9yZURhdGFGb3JDaGVja1ZhbGlkPzogYW55XG4gIGl0ZXJhdG9ySW5wdXRLZXk/OiBzdHJpbmdcbiAgbG9vcElucHV0S2V5Pzogc3RyaW5nXG4gIGlzUnVuQWZ0ZXJTaW5nbGVSdW46IGJvb2xlYW5cbiAgaXNQYXVzZWQ6IGJvb2xlYW5cbn1cblxuY29uc3QgdmFyVHlwZVRvSW5wdXRWYXJUeXBlID0gKHR5cGU6IFZhclR5cGUsIHtcbiAgaXNTZWxlY3QsXG4gIGlzUGFyYWdyYXBoLFxufToge1xuICBpc1NlbGVjdDogYm9vbGVhblxuICBpc1BhcmFncmFwaDogYm9vbGVhblxufSkgPT4ge1xuICBpZiAoaXNTZWxlY3QpXG4gICAgcmV0dXJuIElucHV0VmFyVHlwZS5zZWxlY3RcbiAgaWYgKGlzUGFyYWdyYXBoKVxuICAgIHJldHVybiBJbnB1dFZhclR5cGUucGFyYWdyYXBoXG4gIGlmICh0eXBlID09PSBWYXJUeXBlLm51bWJlcilcbiAgICByZXR1cm4gSW5wdXRWYXJUeXBlLm51bWJlclxuICBpZiAodHlwZSA9PT0gVmFyVHlwZS5ib29sZWFuKVxuICAgIHJldHVybiBJbnB1dFZhclR5cGUuY2hlY2tib3hcbiAgaWYgKFtWYXJUeXBlLm9iamVjdCwgVmFyVHlwZS5hcnJheSwgVmFyVHlwZS5hcnJheU51bWJlciwgVmFyVHlwZS5hcnJheVN0cmluZywgVmFyVHlwZS5hcnJheU9iamVjdF0uaW5jbHVkZXModHlwZSkpXG4gICAgcmV0dXJuIElucHV0VmFyVHlwZS5qc29uXG4gIGlmICh0eXBlID09PSBWYXJUeXBlLmZpbGUpXG4gICAgcmV0dXJuIElucHV0VmFyVHlwZS5zaW5nbGVGaWxlXG4gIGlmICh0eXBlID09PSBWYXJUeXBlLmFycmF5RmlsZSlcbiAgICByZXR1cm4gSW5wdXRWYXJUeXBlLm11bHRpRmlsZXNcblxuICByZXR1cm4gSW5wdXRWYXJUeXBlLnRleHRJbnB1dFxufVxuXG5jb25zdCB1c2VPbmVTdGVwUnVuID0gPFQ+KHtcbiAgaWQsXG4gIGZsb3dJZCxcbiAgZmxvd1R5cGUsXG4gIGRhdGEsXG4gIGRlZmF1bHRSdW5JbnB1dERhdGEsXG4gIG1vcmVEYXRhRm9yQ2hlY2tWYWxpZCxcbiAgaXRlcmF0b3JJbnB1dEtleSxcbiAgbG9vcElucHV0S2V5LFxuICBpc1J1bkFmdGVyU2luZ2xlUnVuLFxuICBpc1BhdXNlZCxcbn06IFBhcmFtczxUPikgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyBnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaCwgZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2hJbmNsdWRlUGFyZW50IH0gPSB1c2VXb3JrZmxvdygpIGFzIGFueVxuICBjb25zdCBjb252ZXJzYXRpb25WYXJpYWJsZXMgPSB1c2VTdG9yZShzID0+IHMuY29udmVyc2F0aW9uVmFyaWFibGVzKVxuICBjb25zdCBpc0NoYXRNb2RlID0gdXNlSXNDaGF0TW9kZSgpXG4gIGNvbnN0IGlzSXRlcmF0aW9uID0gZGF0YS50eXBlID09PSBCbG9ja0VudW0uSXRlcmF0aW9uXG4gIGNvbnN0IGlzTG9vcCA9IGRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkxvb3BcbiAgY29uc3QgaXNTdGFydE5vZGUgPSBkYXRhLnR5cGUgPT09IEJsb2NrRW51bS5TdGFydFxuXG4gIGNvbnN0IGF2YWlsYWJsZU5vZGVzID0gZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2goaWQpXG4gIGNvbnN0IGF2YWlsYWJsZU5vZGVzSW5jbHVkZVBhcmVudCA9IGdldEJlZm9yZU5vZGVzSW5TYW1lQnJhbmNoSW5jbHVkZVBhcmVudChpZClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCB7IHNjaGVtYVR5cGVEZWZpbml0aW9ucyB9ID0gdXNlTWF0Y2hTY2hlbWFUeXBlKClcblxuICBjb25zdCB7IGRhdGE6IGJ1aWxkSW5Ub29scyB9ID0gdXNlQWxsQnVpbHRJblRvb2xzKClcbiAgY29uc3QgeyBkYXRhOiBjdXN0b21Ub29scyB9ID0gdXNlQWxsQ3VzdG9tVG9vbHMoKVxuICBjb25zdCB7IGRhdGE6IHdvcmtmbG93VG9vbHMgfSA9IHVzZUFsbFdvcmtmbG93VG9vbHMoKVxuICBjb25zdCB7IGRhdGE6IG1jcFRvb2xzIH0gPSB1c2VBbGxNQ1BUb29scygpXG5cbiAgY29uc3QgZ2V0VmFyID0gKHZhbHVlU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpOiBWYXIgfCB1bmRlZmluZWQgPT4ge1xuICAgIGNvbnN0IGlzU3lzdGVtID0gdmFsdWVTZWxlY3RvclswXSA9PT0gJ3N5cydcbiAgICBjb25zdCB7XG4gICAgICBkYXRhU291cmNlTGlzdCxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3QgYWxsUGx1Z2luSW5mb0xpc3QgPSB7XG4gICAgICBidWlsZEluVG9vbHM6IGJ1aWxkSW5Ub29scyB8fCBbXSxcbiAgICAgIGN1c3RvbVRvb2xzOiBjdXN0b21Ub29scyB8fCBbXSxcbiAgICAgIHdvcmtmbG93VG9vbHM6IHdvcmtmbG93VG9vbHMgfHwgW10sXG4gICAgICBtY3BUb29sczogbWNwVG9vbHMgfHwgW10sXG4gICAgICBkYXRhU291cmNlTGlzdDogZGF0YVNvdXJjZUxpc3QgfHwgW10sXG4gICAgfVxuXG4gICAgY29uc3QgYWxsT3V0cHV0VmFycyA9IHRvTm9kZU91dHB1dFZhcnMoYXZhaWxhYmxlTm9kZXMsIGlzQ2hhdE1vZGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb252ZXJzYXRpb25WYXJpYWJsZXMsIFtdLCBhbGxQbHVnaW5JbmZvTGlzdCwgc2NoZW1hVHlwZURlZmluaXRpb25zKVxuICAgIGNvbnN0IHRhcmdldFZhciA9IGFsbE91dHB1dFZhcnMuZmluZChpdGVtID0+IGlzU3lzdGVtID8gISFpdGVtLmlzU3RhcnROb2RlIDogaXRlbS5ub2RlSWQgPT09IHZhbHVlU2VsZWN0b3JbMF0pXG4gICAgaWYgKCF0YXJnZXRWYXIpXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBpZiAoaXNTeXN0ZW0pXG4gICAgICByZXR1cm4gdGFyZ2V0VmFyLnZhcnMuZmluZChpdGVtID0+IGl0ZW0udmFyaWFibGUuc3BsaXQoJy4nKVsxXSA9PT0gdmFsdWVTZWxlY3RvclsxXSlcblxuICAgIGxldCBjdXJyOiBhbnkgPSB0YXJnZXRWYXIudmFyc1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmFsdWVTZWxlY3Rvci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qga2V5ID0gdmFsdWVTZWxlY3RvcltpXVxuICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gdmFsdWVTZWxlY3Rvci5sZW5ndGggLSAxXG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGN1cnIpKVxuICAgICAgICBjdXJyID0gY3Vyci5maW5kKCh2OiBhbnkpID0+IHYudmFyaWFibGUucmVwbGFjZSgnY29udmVyc2F0aW9uLicsICcnKSA9PT0ga2V5KVxuXG4gICAgICBpZiAoaXNMYXN0KVxuICAgICAgICByZXR1cm4gY3VyclxuICAgICAgZWxzZSBpZiAoY3Vycj8udHlwZSA9PT0gVmFyVHlwZS5vYmplY3QgfHwgY3Vycj8udHlwZSA9PT0gVmFyVHlwZS5maWxlKVxuICAgICAgICBjdXJyID0gY3Vyci5jaGlsZHJlblxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIGNvbnN0IGNoZWNrVmFsaWQgPSBjaGVja1ZhbGlkRm5zW2RhdGEudHlwZV1cblxuICBjb25zdCBbcnVuSW5wdXREYXRhLCBzZXRSdW5JbnB1dERhdGFdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55Pj4oZGVmYXVsdFJ1bklucHV0RGF0YSB8fCB7fSlcbiAgY29uc3QgcnVuSW5wdXREYXRhUmVmID0gdXNlUmVmKHJ1bklucHV0RGF0YSlcbiAgY29uc3QgaGFuZGxlU2V0UnVuSW5wdXREYXRhID0gdXNlQ2FsbGJhY2soKGRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHtcbiAgICBydW5JbnB1dERhdGFSZWYuY3VycmVudCA9IGRhdGFcbiAgICBzZXRSdW5JbnB1dERhdGEoZGF0YSlcbiAgfSwgW10pXG4gIGNvbnN0IGl0ZXJhdGlvblRpbWVzID0gaXRlcmF0b3JJbnB1dEtleSA/IHJ1bklucHV0RGF0YVtpdGVyYXRvcklucHV0S2V5XT8ubGVuZ3RoIDogMFxuICBjb25zdCBsb29wVGltZXMgPSBsb29wSW5wdXRLZXkgPyBydW5JbnB1dERhdGFbbG9vcElucHV0S2V5XT8ubGVuZ3RoIDogMFxuXG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuICBjb25zdCB7XG4gICAgc2V0U2hvd1NpbmdsZVJ1blBhbmVsLFxuICAgIHNldElzTGlzdGVuaW5nLFxuICAgIHNldExpc3RlbmluZ1RyaWdnZXJUeXBlLFxuICAgIHNldExpc3RlbmluZ1RyaWdnZXJOb2RlSWQsXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlck5vZGVJZHMsXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlcklzQWxsLFxuICAgIHNldFNob3dWYXJpYWJsZUluc3BlY3RQYW5lbCxcbiAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICBjb25zdCB1cGRhdGVOb2RlSW5zcGVjdFJ1bm5pbmdTdGF0ZSA9IHVzZUNhbGxiYWNrKChub2RlSWQ6IHN0cmluZywgaXNSdW5uaW5nOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgbm9kZXNXaXRoSW5zcGVjdFZhcnMsXG4gICAgICBzZXROb2Rlc1dpdGhJbnNwZWN0VmFycyxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICBsZXQgaGFzQ2hhbmdlcyA9IGZhbHNlXG4gICAgY29uc3Qgbm9kZXMgPSBwcm9kdWNlKG5vZGVzV2l0aEluc3BlY3RWYXJzLCAoZHJhZnQpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZHJhZnQuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5ub2RlSWQgPT09IG5vZGVJZClcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGRyYWZ0W2luZGV4XVxuICAgICAgICBpZiAodGFyZ2V0Tm9kZS5pc1NpbmdSdW5SdW5uaW5nICE9PSBpc1J1bm5pbmcpIHtcbiAgICAgICAgICB0YXJnZXROb2RlLmlzU2luZ1J1blJ1bm5pbmcgPSBpc1J1bm5pbmdcbiAgICAgICAgICBpZiAoaXNSdW5uaW5nKVxuICAgICAgICAgICAgdGFyZ2V0Tm9kZS5pc1ZhbHVlRmV0Y2hlZCA9IGZhbHNlXG4gICAgICAgICAgaGFzQ2hhbmdlcyA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNSdW5uaW5nKSB7XG4gICAgICAgIGNvbnN0IHsgZ2V0Tm9kZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZ2V0Tm9kZXMoKS5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZUlkKVxuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgZHJhZnQudW5zaGlmdCh7XG4gICAgICAgICAgICBub2RlSWQsXG4gICAgICAgICAgICBub2RlVHlwZTogdGFyZ2V0LmRhdGEudHlwZSxcbiAgICAgICAgICAgIHRpdGxlOiB0YXJnZXQuZGF0YS50aXRsZSxcbiAgICAgICAgICAgIHZhcnM6IFtdLFxuICAgICAgICAgICAgbm9kZVBheWxvYWQ6IHRhcmdldC5kYXRhLFxuICAgICAgICAgICAgaXNTaW5nUnVuUnVubmluZzogdHJ1ZSxcbiAgICAgICAgICAgIGlzVmFsdWVGZXRjaGVkOiBmYWxzZSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIGhhc0NoYW5nZXMgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKGhhc0NoYW5nZXMpXG4gICAgICBzZXROb2Rlc1dpdGhJbnNwZWN0VmFycyhub2RlcylcbiAgfSwgW3dvcmtmbG93U3RvcmUsIHN0b3JlXSlcbiAgY29uc3QgaW52YWxpZExhc3RSdW4gPSB1c2VJbnZhbGlkTGFzdFJ1bihmbG93VHlwZSwgZmxvd0lkISwgaWQpXG4gIGNvbnN0IFtydW5SZXN1bHQsIGRvU2V0UnVuUmVzdWx0XSA9IHVzZVN0YXRlPE5vZGVSdW5SZXN1bHQgfCBudWxsPihudWxsKVxuICBjb25zdCB7XG4gICAgYXBwZW5kTm9kZUluc3BlY3RWYXJzLFxuICAgIGludmFsaWRhdGVTeXNWYXJWYWx1ZXMsXG4gICAgaW52YWxpZGF0ZUNvbnZlcnNhdGlvblZhclZhbHVlcyxcbiAgfSA9IHVzZUluc3BlY3RWYXJzQ3J1ZCgpXG4gIGNvbnN0IHJ1bm5pbmdTdGF0dXMgPSBkYXRhLl9zaW5nbGVSdW5uaW5nU3RhdHVzIHx8IE5vZGVSdW5uaW5nU3RhdHVzLk5vdFN0YXJ0XG4gIGNvbnN0IHdlYmhvb2tTaW5nbGVSdW5BY3RpdmVSZWYgPSB1c2VSZWYoZmFsc2UpXG4gIGNvbnN0IHdlYmhvb2tTaW5nbGVSdW5BYm9ydFJlZiA9IHVzZVJlZjxBYm9ydENvbnRyb2xsZXIgfCBudWxsPihudWxsKVxuICBjb25zdCB3ZWJob29rU2luZ2xlUnVuVGltZW91dFJlZiA9IHVzZVJlZjxudW1iZXIgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZClcbiAgY29uc3Qgd2ViaG9va1NpbmdsZVJ1blRva2VuUmVmID0gdXNlUmVmKDApXG4gIGNvbnN0IHdlYmhvb2tTaW5nbGVSdW5EZWxheVJlc29sdmVSZWYgPSB1c2VSZWY8KCgpID0+IHZvaWQpIHwgbnVsbD4obnVsbClcbiAgY29uc3QgcGx1Z2luU2luZ2xlUnVuQWN0aXZlUmVmID0gdXNlUmVmKGZhbHNlKVxuICBjb25zdCBwbHVnaW5TaW5nbGVSdW5BYm9ydFJlZiA9IHVzZVJlZjxBYm9ydENvbnRyb2xsZXIgfCBudWxsPihudWxsKVxuICBjb25zdCBwbHVnaW5TaW5nbGVSdW5UaW1lb3V0UmVmID0gdXNlUmVmPG51bWJlciB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKVxuICBjb25zdCBwbHVnaW5TaW5nbGVSdW5Ub2tlblJlZiA9IHVzZVJlZigwKVxuICBjb25zdCBwbHVnaW5TaW5nbGVSdW5EZWxheVJlc29sdmVSZWYgPSB1c2VSZWY8KCgpID0+IHZvaWQpIHwgbnVsbD4obnVsbClcbiAgY29uc3QgaXNQYXVzZWRSZWYgPSB1c2VSZWYoaXNQYXVzZWQpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaXNQYXVzZWRSZWYuY3VycmVudCA9IGlzUGF1c2VkXG4gIH0sIFtpc1BhdXNlZF0pXG4gIGNvbnN0IHsgZXZlbnRFbWl0dGVyIH0gPSB1c2VFdmVudEVtaXR0ZXJDb250ZXh0Q29udGV4dCgpXG5cbiAgY29uc3QgaXNTY2hlZHVsZVRyaWdnZXJOb2RlID0gZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlXG4gIGNvbnN0IGlzV2ViaG9va1RyaWdnZXJOb2RlID0gZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2tcbiAgY29uc3QgaXNQbHVnaW5UcmlnZ2VyTm9kZSA9IGRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5cbiAgY29uc3QgaXNUcmlnZ2VyTm9kZSA9IGlzV2ViaG9va1RyaWdnZXJOb2RlIHx8IGlzUGx1Z2luVHJpZ2dlck5vZGUgfHwgaXNTY2hlZHVsZVRyaWdnZXJOb2RlXG5cbiAgY29uc3Qgc2V0UnVuUmVzdWx0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKGRhdGE6IE5vZGVSdW5SZXN1bHQgfCBudWxsKSA9PiB7XG4gICAgY29uc3QgaXNQYXVzZWQgPSBpc1BhdXNlZFJlZi5jdXJyZW50XG5cbiAgICAvLyBUaGUgYmFja2VuZCBkb24ndCBzdXBwb3J0IHBhdXNlIHRoZSBzaW5nbGUgcnVuLCBzbyB0aGUgZnJvbnRlbmQgaGFuZGxlIHRoZSBwYXVzZSBzdGF0ZS5cbiAgICBpZiAoaXNQYXVzZWQpXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IGNhblJ1bkxhc3RSdW4gPSAhaXNSdW5BZnRlclNpbmdsZVJ1biB8fCBydW5uaW5nU3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5TdWNjZWVkZWRcbiAgICBpZiAoIWNhblJ1bkxhc3RSdW4pIHtcbiAgICAgIGRvU2V0UnVuUmVzdWx0KGRhdGEpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBydW4gZmFpbCBtYXkgYWxzbyB1cGRhdGUgdGhlIGluc3BlY3QgdmFycyB3aGVuIHRoZSBub2RlIHNldCB0aGUgZXJyb3IgZGVmYXVsdCBvdXRwdXQuXG4gICAgY29uc3QgdmFycyA9IGF3YWl0IGZldGNoTm9kZUluc3BlY3RWYXJzKGZsb3dUeXBlLCBmbG93SWQhLCBpZClcbiAgICBjb25zdCB7IGdldE5vZGVzIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgYXBwZW5kTm9kZUluc3BlY3RWYXJzKGlkLCB2YXJzLCBub2RlcylcbiAgICB1cGRhdGVOb2RlSW5zcGVjdFJ1bm5pbmdTdGF0ZShpZCwgZmFsc2UpXG4gICAgaWYgKGRhdGE/LnN0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuU3VjY2VlZGVkKSB7XG4gICAgICBpbnZhbGlkTGFzdFJ1bigpXG4gICAgICBpZiAoaXNTdGFydE5vZGUgfHwgaXNUcmlnZ2VyTm9kZSlcbiAgICAgICAgaW52YWxpZGF0ZVN5c1ZhclZhbHVlcygpXG4gICAgICBpbnZhbGlkYXRlQ29udmVyc2F0aW9uVmFyVmFsdWVzKCkgLy8gbG9vcCwgaXRlcmF0aW9uLCB2YXJpYWJsZSBhc3NpZ25lciBub2RlIGNhbiB1cGRhdGUgdGhlIGNvbnZlcnNhdGlvbiB2YXJpYWJsZXMsIGJ1dCB0byBzaW1wbGUgdGhlIGxvZ2ljKHNvbWUgbm9kZXMgbWF5IGFsc28gY2FuIHVwZGF0ZSBpbiB0aGUgZnV0dXJlKSwgYWxsIG5vZGVzIHJlZnJlc2guXG4gICAgfVxuICB9LCBbXG4gICAgaXNSdW5BZnRlclNpbmdsZVJ1bixcbiAgICBydW5uaW5nU3RhdHVzLFxuICAgIGZsb3dJZCxcbiAgICBpZCxcbiAgICBzdG9yZSxcbiAgICBhcHBlbmROb2RlSW5zcGVjdFZhcnMsXG4gICAgdXBkYXRlTm9kZUluc3BlY3RSdW5uaW5nU3RhdGUsXG4gICAgaW52YWxpZExhc3RSdW4sXG4gICAgaXNTdGFydE5vZGUsXG4gICAgaXNUcmlnZ2VyTm9kZSxcbiAgICBpbnZhbGlkYXRlU3lzVmFyVmFsdWVzLFxuICAgIGludmFsaWRhdGVDb252ZXJzYXRpb25WYXJWYWx1ZXMsXG4gIF0pXG5cbiAgY29uc3QgeyBoYW5kbGVOb2RlRGF0YVVwZGF0ZSB9OiB7IGhhbmRsZU5vZGVEYXRhVXBkYXRlOiAoZGF0YTogYW55KSA9PiB2b2lkIH0gPSB1c2VOb2RlRGF0YVVwZGF0ZSgpXG4gIGNvbnN0IHNldE5vZGVSdW5uaW5nID0gKCkgPT4ge1xuICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgIGlkLFxuICAgICAgZGF0YToge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBfc2luZ2xlUnVubmluZ1N0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNhbmNlbFdlYmhvb2tTaW5nbGVSdW4gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgd2ViaG9va1NpbmdsZVJ1bkFjdGl2ZVJlZi5jdXJyZW50ID0gZmFsc2VcbiAgICB3ZWJob29rU2luZ2xlUnVuVG9rZW5SZWYuY3VycmVudCArPSAxXG4gICAgaWYgKHdlYmhvb2tTaW5nbGVSdW5BYm9ydFJlZi5jdXJyZW50KVxuICAgICAgd2ViaG9va1NpbmdsZVJ1bkFib3J0UmVmLmN1cnJlbnQuYWJvcnQoKVxuICAgIHdlYmhvb2tTaW5nbGVSdW5BYm9ydFJlZi5jdXJyZW50ID0gbnVsbFxuICAgIGlmICh3ZWJob29rU2luZ2xlUnVuVGltZW91dFJlZi5jdXJyZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2ViaG9va1NpbmdsZVJ1blRpbWVvdXRSZWYuY3VycmVudClcbiAgICAgIHdlYmhvb2tTaW5nbGVSdW5UaW1lb3V0UmVmLmN1cnJlbnQgPSB1bmRlZmluZWRcbiAgICB9XG4gICAgaWYgKHdlYmhvb2tTaW5nbGVSdW5EZWxheVJlc29sdmVSZWYuY3VycmVudCkge1xuICAgICAgd2ViaG9va1NpbmdsZVJ1bkRlbGF5UmVzb2x2ZVJlZi5jdXJyZW50KClcbiAgICAgIHdlYmhvb2tTaW5nbGVSdW5EZWxheVJlc29sdmVSZWYuY3VycmVudCA9IG51bGxcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGNhbmNlbFBsdWdpblNpbmdsZVJ1biA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBwbHVnaW5TaW5nbGVSdW5BY3RpdmVSZWYuY3VycmVudCA9IGZhbHNlXG4gICAgcGx1Z2luU2luZ2xlUnVuVG9rZW5SZWYuY3VycmVudCArPSAxXG4gICAgaWYgKHBsdWdpblNpbmdsZVJ1bkFib3J0UmVmLmN1cnJlbnQpXG4gICAgICBwbHVnaW5TaW5nbGVSdW5BYm9ydFJlZi5jdXJyZW50LmFib3J0KClcbiAgICBwbHVnaW5TaW5nbGVSdW5BYm9ydFJlZi5jdXJyZW50ID0gbnVsbFxuICAgIGlmIChwbHVnaW5TaW5nbGVSdW5UaW1lb3V0UmVmLmN1cnJlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dChwbHVnaW5TaW5nbGVSdW5UaW1lb3V0UmVmLmN1cnJlbnQpXG4gICAgICBwbHVnaW5TaW5nbGVSdW5UaW1lb3V0UmVmLmN1cnJlbnQgPSB1bmRlZmluZWRcbiAgICB9XG4gICAgaWYgKHBsdWdpblNpbmdsZVJ1bkRlbGF5UmVzb2x2ZVJlZi5jdXJyZW50KSB7XG4gICAgICBwbHVnaW5TaW5nbGVSdW5EZWxheVJlc29sdmVSZWYuY3VycmVudCgpXG4gICAgICBwbHVnaW5TaW5nbGVSdW5EZWxheVJlc29sdmVSZWYuY3VycmVudCA9IG51bGxcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IHN0YXJ0VHJpZ2dlckxpc3RlbmluZyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoIWlzVHJpZ2dlck5vZGUpXG4gICAgICByZXR1cm5cblxuICAgIHNldElzTGlzdGVuaW5nKHRydWUpXG4gICAgc2V0U2hvd1ZhcmlhYmxlSW5zcGVjdFBhbmVsKHRydWUpXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlclR5cGUoZGF0YS50eXBlIGFzIFRyaWdnZXJOb2RlVHlwZSlcbiAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkKGlkKVxuICAgIHNldExpc3RlbmluZ1RyaWdnZXJOb2RlSWRzKFtpZF0pXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlcklzQWxsKGZhbHNlKVxuICB9LCBbXG4gICAgaXNUcmlnZ2VyTm9kZSxcbiAgICBzZXRJc0xpc3RlbmluZyxcbiAgICBzZXRTaG93VmFyaWFibGVJbnNwZWN0UGFuZWwsXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlclR5cGUsXG4gICAgZGF0YS50eXBlLFxuICAgIHNldExpc3RlbmluZ1RyaWdnZXJOb2RlSWQsXG4gICAgaWQsXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlck5vZGVJZHMsXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlcklzQWxsLFxuICBdKVxuXG4gIGNvbnN0IHN0b3BUcmlnZ2VyTGlzdGVuaW5nID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICghaXNUcmlnZ2VyTm9kZSlcbiAgICAgIHJldHVyblxuXG4gICAgc2V0SXNMaXN0ZW5pbmcoZmFsc2UpXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlclR5cGUobnVsbClcbiAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkKG51bGwpXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlck5vZGVJZHMoW10pXG4gICAgc2V0TGlzdGVuaW5nVHJpZ2dlcklzQWxsKGZhbHNlKVxuICB9LCBbXG4gICAgaXNUcmlnZ2VyTm9kZSxcbiAgICBzZXRJc0xpc3RlbmluZyxcbiAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyVHlwZSxcbiAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkLFxuICAgIHNldExpc3RlbmluZ1RyaWdnZXJOb2RlSWRzLFxuICAgIHNldExpc3RlbmluZ1RyaWdnZXJJc0FsbCxcbiAgXSlcblxuICBjb25zdCBydW5TY2hlZHVsZVNpbmdsZVJ1biA9IHVzZUNhbGxiYWNrKGFzeW5jICgpOiBQcm9taXNlPE5vZGVSdW5SZXN1bHQgfCBudWxsPiA9PiB7XG4gICAgY29uc3QgdXJsUGF0aCA9IGAvYXBwcy8ke2Zsb3dJZH0vd29ya2Zsb3dzL2RyYWZ0L25vZGVzLyR7aWR9L3RyaWdnZXIvcnVuYFxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCBwb3N0KHVybFBhdGgsIHtcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe30pLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gJ1NjaGVkdWxlIHRyaWdnZXIgcnVuIGZhaWxlZCdcbiAgICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZSB9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSlcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlPy5zdGF0dXMgPT09ICdlcnJvcicpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlc3BvbnNlPy5tZXNzYWdlIHx8ICdTY2hlZHVsZSB0cmlnZ2VyIHJ1biBmYWlsZWQnXG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICB9XG5cbiAgICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgICAgaWQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgX3NpbmdsZVJ1bm5pbmdTdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLlN1Y2NlZWRlZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiByZXNwb25zZSBhcyBOb2RlUnVuUmVzdWx0XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignaGFuZGxlUnVuOiBzY2hlZHVsZSB0cmlnZ2VyIHNpbmdsZSBydW4gZXJyb3InLCBlcnJvcilcbiAgICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgICAgaWQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgX3NpbmdsZVJ1bm5pbmdTdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLkZhaWxlZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiAnU2NoZWR1bGUgdHJpZ2dlciBydW4gZmFpbGVkJyB9KVxuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH0sIFtmbG93SWQsIGlkLCBoYW5kbGVOb2RlRGF0YVVwZGF0ZSwgZGF0YV0pXG5cbiAgY29uc3QgcnVuV2ViaG9va1NpbmdsZVJ1biA9IHVzZUNhbGxiYWNrKGFzeW5jICgpOiBQcm9taXNlPGFueSB8IG51bGw+ID0+IHtcbiAgICBjb25zdCB1cmxQYXRoID0gYC9hcHBzLyR7Zmxvd0lkfS93b3JrZmxvd3MvZHJhZnQvbm9kZXMvJHtpZH0vdHJpZ2dlci9ydW5gXG5cbiAgICB3ZWJob29rU2luZ2xlUnVuQWN0aXZlUmVmLmN1cnJlbnQgPSB0cnVlXG4gICAgY29uc3QgdG9rZW4gPSArK3dlYmhvb2tTaW5nbGVSdW5Ub2tlblJlZi5jdXJyZW50XG5cbiAgICB3aGlsZSAod2ViaG9va1NpbmdsZVJ1bkFjdGl2ZVJlZi5jdXJyZW50ICYmIHRva2VuID09PSB3ZWJob29rU2luZ2xlUnVuVG9rZW5SZWYuY3VycmVudCkge1xuICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuICAgICAgd2ViaG9va1NpbmdsZVJ1bkFib3J0UmVmLmN1cnJlbnQgPSBjb250cm9sbGVyXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCBwb3N0KHVybFBhdGgsIHtcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7fSksXG4gICAgICAgICAgc2lnbmFsOiBjb250cm9sbGVyLnNpZ25hbCxcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoIXdlYmhvb2tTaW5nbGVSdW5BY3RpdmVSZWYuY3VycmVudCB8fCB0b2tlbiAhPT0gd2ViaG9va1NpbmdsZVJ1blRva2VuUmVmLmN1cnJlbnQpXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlc3BvbnNlPy5tZXNzYWdlIHx8ICdXZWJob29rIGRlYnVnIGZhaWxlZCdcbiAgICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlIH0pXG4gICAgICAgICAgY2FuY2VsV2ViaG9va1NpbmdsZVJ1bigpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzcG9uc2U/LnN0YXR1cyA9PT0gJ3dhaXRpbmcnKSB7XG4gICAgICAgICAgY29uc3QgZGVsYXkgPSBOdW1iZXIocmVzcG9uc2UucmV0cnlfaW4pIHx8IDIwMDBcbiAgICAgICAgICB3ZWJob29rU2luZ2xlUnVuQWJvcnRSZWYuY3VycmVudCA9IG51bGxcbiAgICAgICAgICBpZiAoIXdlYmhvb2tTaW5nbGVSdW5BY3RpdmVSZWYuY3VycmVudCB8fCB0b2tlbiAhPT0gd2ViaG9va1NpbmdsZVJ1blRva2VuUmVmLmN1cnJlbnQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KVxuICAgICAgICAgICAgd2ViaG9va1NpbmdsZVJ1blRpbWVvdXRSZWYuY3VycmVudCA9IHRpbWVvdXRJZFxuICAgICAgICAgICAgd2ViaG9va1NpbmdsZVJ1bkRlbGF5UmVzb2x2ZVJlZi5jdXJyZW50ID0gcmVzb2x2ZVxuICAgICAgICAgICAgY29udHJvbGxlci5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKVxuICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICB3ZWJob29rU2luZ2xlUnVuVGltZW91dFJlZi5jdXJyZW50ID0gdW5kZWZpbmVkXG4gICAgICAgICAgd2ViaG9va1NpbmdsZVJ1bkRlbGF5UmVzb2x2ZVJlZi5jdXJyZW50ID0gbnVsbFxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzcG9uc2U/LnN0YXR1cyA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlIHx8ICdXZWJob29rIGRlYnVnIGZhaWxlZCdcbiAgICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlIH0pXG4gICAgICAgICAgY2FuY2VsV2ViaG9va1NpbmdsZVJ1bigpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgIH1cblxuICAgICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgICBfc2luZ2xlUnVubmluZ1N0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuTGlzdGVuaW5nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgY2FuY2VsV2ViaG9va1NpbmdsZVJ1bigpXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChjb250cm9sbGVyLnNpZ25hbC5hYm9ydGVkICYmICghd2ViaG9va1NpbmdsZVJ1bkFjdGl2ZVJlZi5jdXJyZW50IHx8IHRva2VuICE9PSB3ZWJob29rU2luZ2xlUnVuVG9rZW5SZWYuY3VycmVudCkpXG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgaWYgKGNvbnRyb2xsZXIuc2lnbmFsLmFib3J0ZWQpXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiAnV2ViaG9vayBkZWJ1ZyByZXF1ZXN0IGZhaWxlZCcgfSlcbiAgICAgICAgY2FuY2VsV2ViaG9va1NpbmdsZVJ1bigpXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKVxuICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihTdHJpbmcoZXJyb3IpKVxuICAgICAgfVxuICAgICAgZmluYWxseSB7XG4gICAgICAgIHdlYmhvb2tTaW5nbGVSdW5BYm9ydFJlZi5jdXJyZW50ID0gbnVsbFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH0sIFtmbG93SWQsIGlkLCBkYXRhLCBoYW5kbGVOb2RlRGF0YVVwZGF0ZSwgY2FuY2VsV2ViaG9va1NpbmdsZVJ1bl0pXG5cbiAgY29uc3QgcnVuUGx1Z2luU2luZ2xlUnVuID0gdXNlQ2FsbGJhY2soYXN5bmMgKCk6IFByb21pc2U8YW55IHwgbnVsbD4gPT4ge1xuICAgIGNvbnN0IHVybFBhdGggPSBgL2FwcHMvJHtmbG93SWR9L3dvcmtmbG93cy9kcmFmdC9ub2Rlcy8ke2lkfS90cmlnZ2VyL3J1bmBcblxuICAgIHBsdWdpblNpbmdsZVJ1bkFjdGl2ZVJlZi5jdXJyZW50ID0gdHJ1ZVxuICAgIGNvbnN0IHRva2VuID0gKytwbHVnaW5TaW5nbGVSdW5Ub2tlblJlZi5jdXJyZW50XG5cbiAgICB3aGlsZSAocGx1Z2luU2luZ2xlUnVuQWN0aXZlUmVmLmN1cnJlbnQgJiYgdG9rZW4gPT09IHBsdWdpblNpbmdsZVJ1blRva2VuUmVmLmN1cnJlbnQpIHtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKClcbiAgICAgIHBsdWdpblNpbmdsZVJ1bkFib3J0UmVmLmN1cnJlbnQgPSBjb250cm9sbGVyXG5cbiAgICAgIGxldCByZXF1ZXN0RXJyb3I6IFJlcXVlc3RFcnJvciB8IHVuZGVmaW5lZFxuICAgICAgY29uc3QgcmVzcG9uc2U6IGFueSA9IGF3YWl0IHBvc3QodXJsUGF0aCwge1xuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7fSksXG4gICAgICAgIHNpZ25hbDogY29udHJvbGxlci5zaWduYWwsXG4gICAgICB9KS5jYXRjaChhc3luYyAoZXJyb3I6IFJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBlcnJvci5jbG9uZSgpLmpzb24oKSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICAgICAgIGNvbnN0IHsgZXJyb3I6IHJlc3BFcnJvciwgc3RhdHVzIH0gPSBkYXRhIHx8IHt9XG4gICAgICAgIHJlcXVlc3RFcnJvciA9IHtcbiAgICAgICAgICBtZXNzYWdlOiByZXNwRXJyb3IsXG4gICAgICAgICAgc3RhdHVzLFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9KS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgcGx1Z2luU2luZ2xlUnVuQWJvcnRSZWYuY3VycmVudCA9IG51bGxcbiAgICAgIH0pXG5cbiAgICAgIGlmICghcGx1Z2luU2luZ2xlUnVuQWN0aXZlUmVmLmN1cnJlbnQgfHwgdG9rZW4gIT09IHBsdWdpblNpbmdsZVJ1blRva2VuUmVmLmN1cnJlbnQpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgIGlmIChyZXF1ZXN0RXJyb3IpIHtcbiAgICAgICAgaWYgKGNvbnRyb2xsZXIuc2lnbmFsLmFib3J0ZWQpXG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiByZXF1ZXN0RXJyb3IubWVzc2FnZSB9KVxuICAgICAgICBjYW5jZWxQbHVnaW5TaW5nbGVSdW4oKVxuICAgICAgICB0aHJvdyByZXF1ZXN0RXJyb3JcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gJ1BsdWdpbiBkZWJ1ZyBmYWlsZWQnXG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfSlcbiAgICAgICAgY2FuY2VsUGx1Z2luU2luZ2xlUnVuKClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwb25zZT8uc3RhdHVzID09PSAnd2FpdGluZycpIHtcbiAgICAgICAgY29uc3QgZGVsYXkgPSBOdW1iZXIocmVzcG9uc2UucmV0cnlfaW4pIHx8IDIwMDBcbiAgICAgICAgaWYgKCFwbHVnaW5TaW5nbGVSdW5BY3RpdmVSZWYuY3VycmVudCB8fCB0b2tlbiAhPT0gcGx1Z2luU2luZ2xlUnVuVG9rZW5SZWYuY3VycmVudClcbiAgICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpXG4gICAgICAgICAgcGx1Z2luU2luZ2xlUnVuVGltZW91dFJlZi5jdXJyZW50ID0gdGltZW91dElkXG4gICAgICAgICAgcGx1Z2luU2luZ2xlUnVuRGVsYXlSZXNvbHZlUmVmLmN1cnJlbnQgPSByZXNvbHZlXG4gICAgICAgICAgY29udHJvbGxlci5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcbiAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIHBsdWdpblNpbmdsZVJ1blRpbWVvdXRSZWYuY3VycmVudCA9IHVuZGVmaW5lZFxuICAgICAgICBwbHVnaW5TaW5nbGVSdW5EZWxheVJlc29sdmVSZWYuY3VycmVudCA9IG51bGxcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlPy5zdGF0dXMgPT09ICdlcnJvcicpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UgfHwgJ1BsdWdpbiBkZWJ1ZyBmYWlsZWQnXG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfSlcbiAgICAgICAgY2FuY2VsUGx1Z2luU2luZ2xlUnVuKClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICB9XG5cbiAgICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgICAgaWQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgX3NpbmdsZVJ1bm5pbmdTdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLkxpc3RlbmluZyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNhbmNlbFBsdWdpblNpbmdsZVJ1bigpXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9LCBbZmxvd0lkLCBpZCwgZGF0YSwgaGFuZGxlTm9kZURhdGFVcGRhdGUsIGNhbmNlbFBsdWdpblNpbmdsZVJ1bl0pXG5cbiAgY29uc3QgY2hlY2tWYWxpZFdyYXAgPSAoKSA9PiB7XG4gICAgaWYgKCFjaGVja1ZhbGlkKVxuICAgICAgcmV0dXJuIHsgaXNWYWxpZDogdHJ1ZSwgZXJyb3JNZXNzYWdlOiAnJyB9XG4gICAgY29uc3QgcmVzID0gY2hlY2tWYWxpZChkYXRhLCB0LCBtb3JlRGF0YUZvckNoZWNrVmFsaWQpXG4gICAgaWYgKCFyZXMuaXNWYWxpZCkge1xuICAgICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgICBpZCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgX2lzU2luZ2xlUnVuOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiByZXMuZXJyb3JNZXNzYWdlIHx8ICcnLFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHJlc1xuICB9XG4gIGNvbnN0IFtjYW5TaG93U2luZ2xlUnVuLCBzZXRDYW5TaG93U2luZ2xlUnVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBpc1Nob3dTaW5nbGVSdW4gPSBkYXRhLl9pc1NpbmdsZVJ1biAmJiBjYW5TaG93U2luZ2xlUnVuXG4gIGNvbnN0IFtpdGVyYXRpb25SdW5SZXN1bHQsIHNldEl0ZXJhdGlvblJ1blJlc3VsdF0gPSB1c2VTdGF0ZTxOb2RlVHJhY2luZ1tdPihbXSlcbiAgY29uc3QgW2xvb3BSdW5SZXN1bHQsIHNldExvb3BSdW5SZXN1bHRdID0gdXNlU3RhdGU8Tm9kZVRyYWNpbmdbXT4oW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWNoZWNrVmFsaWQpIHtcbiAgICAgIHNldENhblNob3dTaW5nbGVSdW4odHJ1ZSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChkYXRhLl9pc1NpbmdsZVJ1bikge1xuICAgICAgY29uc3QgeyBpc1ZhbGlkIH0gPSBjaGVja1ZhbGlkV3JhcCgpXG4gICAgICBzZXRDYW5TaG93U2luZ2xlUnVuKGlzVmFsaWQpXG4gICAgfVxuICB9LCBbZGF0YS5faXNTaW5nbGVSdW5dKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0U2hvd1NpbmdsZVJ1blBhbmVsKCEhaXNTaG93U2luZ2xlUnVuKVxuICB9LCBbaXNTaG93U2luZ2xlUnVuLCBzZXRTaG93U2luZ2xlUnVuUGFuZWxdKVxuXG4gIGNvbnN0IGhpZGVTaW5nbGVSdW4gPSAoKSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgaWQsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cbiAgY29uc3Qgc2hvd1NpbmdsZVJ1biA9ICgpID0+IHtcbiAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICBpZCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgX2lzU2luZ2xlUnVuOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KVxuICB9XG4gIGNvbnN0IGlzQ29tcGxldGVkID0gcnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuU3VjY2VlZGVkIHx8IHJ1bm5pbmdTdGF0dXMgPT09IE5vZGVSdW5uaW5nU3RhdHVzLkZhaWxlZFxuXG4gIGNvbnN0IGhhbmRsZVJ1biA9IGFzeW5jIChzdWJtaXREYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgaWYgKGlzV2ViaG9va1RyaWdnZXJOb2RlKVxuICAgICAgY2FuY2VsV2ViaG9va1NpbmdsZVJ1bigpXG4gICAgaWYgKGlzUGx1Z2luVHJpZ2dlck5vZGUpXG4gICAgICBjYW5jZWxQbHVnaW5TaW5nbGVSdW4oKVxuXG4gICAgdXBkYXRlTm9kZUluc3BlY3RSdW5uaW5nU3RhdGUoaWQsIHRydWUpXG5cbiAgICBpZiAoaXNUcmlnZ2VyTm9kZSlcbiAgICAgIHN0YXJ0VHJpZ2dlckxpc3RlbmluZygpXG4gICAgZWxzZVxuICAgICAgc3RvcFRyaWdnZXJMaXN0ZW5pbmcoKVxuXG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgaWQsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgIF9zaW5nbGVSdW5uaW5nU3RhdHVzOiBpc1RyaWdnZXJOb2RlXG4gICAgICAgICAgPyBOb2RlUnVubmluZ1N0YXR1cy5MaXN0ZW5pbmdcbiAgICAgICAgICA6IE5vZGVSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICB9LFxuICAgIH0pXG4gICAgbGV0IHJlczogYW55XG4gICAgbGV0IGhhc0Vycm9yID0gZmFsc2VcbiAgICB0cnkge1xuICAgICAgaWYgKCFpc0l0ZXJhdGlvbiAmJiAhaXNMb29wKSB7XG4gICAgICAgIGlmIChpc1NjaGVkdWxlVHJpZ2dlck5vZGUpIHtcbiAgICAgICAgICByZXMgPSBhd2FpdCBydW5TY2hlZHVsZVNpbmdsZVJ1bigpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNXZWJob29rVHJpZ2dlck5vZGUpIHtcbiAgICAgICAgICByZXMgPSBhd2FpdCBydW5XZWJob29rU2luZ2xlUnVuKClcbiAgICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgaWYgKHdlYmhvb2tTaW5nbGVSdW5BY3RpdmVSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBfc2luZ2xlUnVubmluZ1N0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuU3RvcHBlZCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzUGx1Z2luVHJpZ2dlck5vZGUpIHtcbiAgICAgICAgICByZXMgPSBhd2FpdCBydW5QbHVnaW5TaW5nbGVSdW4oKVxuICAgICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICBpZiAocGx1Z2luU2luZ2xlUnVuQWN0aXZlUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICAgICAgICBfaXNTaW5nbGVSdW46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgX3NpbmdsZVJ1bm5pbmdTdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLlN0b3BwZWQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpc1N0YXJ0Tm9kZSA9IGRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlN0YXJ0XG4gICAgICAgICAgY29uc3QgcG9zdERhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuICAgICAgICAgIGlmIChpc1N0YXJ0Tm9kZSkge1xuICAgICAgICAgICAgY29uc3QgeyAnI3N5cy5xdWVyeSMnOiBxdWVyeSwgJyNzeXMuZmlsZXMjJzogZmlsZXMsIC4uLmlucHV0cyB9ID0gc3VibWl0RGF0YVxuICAgICAgICAgICAgaWYgKGlzQ2hhdE1vZGUpXG4gICAgICAgICAgICAgIHBvc3REYXRhLmNvbnZlcnNhdGlvbl9pZCA9ICcnXG5cbiAgICAgICAgICAgIHBvc3REYXRhLmlucHV0cyA9IGlucHV0c1xuICAgICAgICAgICAgcG9zdERhdGEucXVlcnkgPSBxdWVyeVxuICAgICAgICAgICAgcG9zdERhdGEuZmlsZXMgPSBmaWxlcyB8fCBbXVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBvc3REYXRhLmlucHV0cyA9IHN1Ym1pdERhdGFcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzID0gYXdhaXQgc2luZ2xlTm9kZVJ1bihmbG93VHlwZSwgZmxvd0lkISwgaWQsIHBvc3REYXRhKSBhcyBhbnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNJdGVyYXRpb24pIHtcbiAgICAgICAgc2V0SXRlcmF0aW9uUnVuUmVzdWx0KFtdKVxuICAgICAgICBsZXQgX2l0ZXJhdGlvblJlc3VsdDogTm9kZVRyYWNpbmdbXSA9IFtdXG4gICAgICAgIGxldCBfcnVuUmVzdWx0OiBhbnkgPSBudWxsXG4gICAgICAgIHNzZVBvc3QoXG4gICAgICAgICAgZ2V0SXRlcmF0aW9uU2luZ2xlTm9kZVJ1blVybChmbG93VHlwZSwgaXNDaGF0TW9kZSwgZmxvd0lkISwgaWQpLFxuICAgICAgICAgIHsgYm9keTogeyBpbnB1dHM6IHN1Ym1pdERhdGEgfSB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9uV29ya2Zsb3dTdGFydGVkOiBub29wLFxuICAgICAgICAgICAgb25Xb3JrZmxvd0ZpbmlzaGVkOiAocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpc1BhdXNlZFJlZi5jdXJyZW50KVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBfc2luZ2xlUnVubmluZ1N0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuU3VjY2VlZGVkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGNvbnN0IHsgZGF0YTogaXRlcmF0aW9uRGF0YSB9ID0gcGFyYW1zXG4gICAgICAgICAgICAgIF9ydW5SZXN1bHQuY3JlYXRlZF9ieSA9IGl0ZXJhdGlvbkRhdGEuY3JlYXRlZF9ieS5uYW1lXG4gICAgICAgICAgICAgIHNldFJ1blJlc3VsdChfcnVuUmVzdWx0KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uSXRlcmF0aW9uU3RhcnQ6IChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbmV3SXRlcmF0aW9uUnVuUmVzdWx0ID0gcHJvZHVjZShfaXRlcmF0aW9uUmVzdWx0LCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgICBkcmFmdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIC4uLnBhcmFtcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgc3RhdHVzOiBOb2RlUnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIF9pdGVyYXRpb25SZXN1bHQgPSBuZXdJdGVyYXRpb25SdW5SZXN1bHRcbiAgICAgICAgICAgICAgc2V0SXRlcmF0aW9uUnVuUmVzdWx0KG5ld0l0ZXJhdGlvblJ1blJlc3VsdClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkl0ZXJhdGlvbk5leHQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgLy8gaXRlcmF0aW9uIG5leHQgdHJpZ2dlciB0aW1lIGlzIHRyaWdnZXJlZCBvbmUgbW9yZSB0aW1lIHRoYW4gaXRlcmF0aW9uVGltZXNcbiAgICAgICAgICAgICAgaWYgKF9pdGVyYXRpb25SZXN1bHQubGVuZ3RoID49IGl0ZXJhdGlvblRpbWVzISlcbiAgICAgICAgICAgICAgICByZXR1cm4gX2l0ZXJhdGlvblJlc3VsdC5sZW5ndGggPj0gaXRlcmF0aW9uVGltZXMhXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25JdGVyYXRpb25GaW5pc2g6IChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgX3J1blJlc3VsdCA9IHBhcmFtcy5kYXRhXG4gICAgICAgICAgICAgIHNldFJ1blJlc3VsdChfcnVuUmVzdWx0KVxuICAgICAgICAgICAgICBjb25zdCBpdGVyYXRpb25SdW5SZXN1bHQgPSBfaXRlcmF0aW9uUmVzdWx0XG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGl0ZXJhdGlvblJ1blJlc3VsdC5maW5kSW5kZXgodHJhY2UgPT4gdHJhY2UuaWQgPT09IHBhcmFtcy5kYXRhLmlkKVxuICAgICAgICAgICAgICBjb25zdCBuZXdJdGVyYXRpb25SdW5SZXN1bHQgPSBwcm9kdWNlKGl0ZXJhdGlvblJ1blJlc3VsdCwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICBkcmFmdFtjdXJyZW50SW5kZXhdID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5kcmFmdFtjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgX2l0ZXJhdGlvblJlc3VsdCA9IG5ld0l0ZXJhdGlvblJ1blJlc3VsdFxuICAgICAgICAgICAgICBzZXRJdGVyYXRpb25SdW5SZXN1bHQobmV3SXRlcmF0aW9uUnVuUmVzdWx0KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uTm9kZVN0YXJ0ZWQ6IChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbmV3SXRlcmF0aW9uUnVuUmVzdWx0ID0gcHJvZHVjZShfaXRlcmF0aW9uUmVzdWx0LCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgICBkcmFmdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIC4uLnBhcmFtcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgc3RhdHVzOiBOb2RlUnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIF9pdGVyYXRpb25SZXN1bHQgPSBuZXdJdGVyYXRpb25SdW5SZXN1bHRcbiAgICAgICAgICAgICAgc2V0SXRlcmF0aW9uUnVuUmVzdWx0KG5ld0l0ZXJhdGlvblJ1blJlc3VsdClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk5vZGVGaW5pc2hlZDogKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBpdGVyYXRpb25SdW5SZXN1bHQgPSBfaXRlcmF0aW9uUmVzdWx0XG5cbiAgICAgICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBwYXJhbXNcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gaXRlcmF0aW9uUnVuUmVzdWx0LmZpbmRJbmRleCh0cmFjZSA9PiB0cmFjZS5pZCA9PT0gZGF0YS5pZClcbiAgICAgICAgICAgICAgY29uc3QgbmV3SXRlcmF0aW9uUnVuUmVzdWx0ID0gcHJvZHVjZShpdGVyYXRpb25SdW5SZXN1bHQsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgZHJhZnRbY3VycmVudEluZGV4XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZHJhZnRbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIF9pdGVyYXRpb25SZXN1bHQgPSBuZXdJdGVyYXRpb25SdW5SZXN1bHRcbiAgICAgICAgICAgICAgc2V0SXRlcmF0aW9uUnVuUmVzdWx0KG5ld0l0ZXJhdGlvblJ1blJlc3VsdClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk5vZGVSZXRyeTogKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuZXdJdGVyYXRpb25SdW5SZXN1bHQgPSBwcm9kdWNlKF9pdGVyYXRpb25SZXN1bHQsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgICAgIGRyYWZ0LnB1c2gocGFyYW1zLmRhdGEpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIF9pdGVyYXRpb25SZXN1bHQgPSBuZXdJdGVyYXRpb25SdW5SZXN1bHRcbiAgICAgICAgICAgICAgc2V0SXRlcmF0aW9uUnVuUmVzdWx0KG5ld0l0ZXJhdGlvblJ1blJlc3VsdClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpc1BhdXNlZFJlZi5jdXJyZW50KVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBfc2luZ2xlUnVubmluZ1N0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuRmFpbGVkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzTG9vcCkge1xuICAgICAgICBzZXRMb29wUnVuUmVzdWx0KFtdKVxuICAgICAgICBsZXQgX2xvb3BSZXN1bHQ6IE5vZGVUcmFjaW5nW10gPSBbXVxuICAgICAgICBsZXQgX3J1blJlc3VsdDogYW55ID0gbnVsbFxuICAgICAgICBzc2VQb3N0KFxuICAgICAgICAgIGdldExvb3BTaW5nbGVOb2RlUnVuVXJsKGZsb3dUeXBlLCBpc0NoYXRNb2RlLCBmbG93SWQhLCBpZCksXG4gICAgICAgICAgeyBib2R5OiB7IGlucHV0czogc3VibWl0RGF0YSB9IH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgb25Xb3JrZmxvd1N0YXJ0ZWQ6IG5vb3AsXG4gICAgICAgICAgICBvbldvcmtmbG93RmluaXNoZWQ6IChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGlzUGF1c2VkUmVmLmN1cnJlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgICAgX2lzU2luZ2xlUnVuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIF9zaW5nbGVSdW5uaW5nU3RhdHVzOiBOb2RlUnVubmluZ1N0YXR1cy5TdWNjZWVkZWQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgY29uc3QgeyBkYXRhOiBsb29wRGF0YSB9ID0gcGFyYW1zXG4gICAgICAgICAgICAgIF9ydW5SZXN1bHQuY3JlYXRlZF9ieSA9IGxvb3BEYXRhLmNyZWF0ZWRfYnkubmFtZVxuICAgICAgICAgICAgICBzZXRSdW5SZXN1bHQoX3J1blJlc3VsdClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkxvb3BTdGFydDogKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuZXdMb29wUnVuUmVzdWx0ID0gcHJvZHVjZShfbG9vcFJlc3VsdCwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgZHJhZnQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAuLi5wYXJhbXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBfbG9vcFJlc3VsdCA9IG5ld0xvb3BSdW5SZXN1bHRcbiAgICAgICAgICAgICAgc2V0TG9vcFJ1blJlc3VsdChuZXdMb29wUnVuUmVzdWx0KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uTG9vcE5leHQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgLy8gbG9vcCBuZXh0IHRyaWdnZXIgdGltZSBpcyB0cmlnZ2VyZWQgb25lIG1vcmUgdGltZSB0aGFuIGxvb3BUaW1lc1xuICAgICAgICAgICAgICBpZiAoX2xvb3BSZXN1bHQubGVuZ3RoID49IGxvb3BUaW1lcyEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9sb29wUmVzdWx0Lmxlbmd0aCA+PSBsb29wVGltZXMhXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Mb29wRmluaXNoOiAocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICAgIF9ydW5SZXN1bHQgPSBwYXJhbXMuZGF0YVxuICAgICAgICAgICAgICBzZXRSdW5SZXN1bHQoX3J1blJlc3VsdClcblxuICAgICAgICAgICAgICBjb25zdCBsb29wUnVuUmVzdWx0ID0gX2xvb3BSZXN1bHRcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gbG9vcFJ1blJlc3VsdC5maW5kSW5kZXgodHJhY2UgPT4gdHJhY2UuaWQgPT09IHBhcmFtcy5kYXRhLmlkKVxuICAgICAgICAgICAgICBjb25zdCBuZXdMb29wUnVuUmVzdWx0ID0gcHJvZHVjZShsb29wUnVuUmVzdWx0LCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgIGRyYWZ0W2N1cnJlbnRJbmRleF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmRyYWZ0W2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBfbG9vcFJlc3VsdCA9IG5ld0xvb3BSdW5SZXN1bHRcbiAgICAgICAgICAgICAgc2V0TG9vcFJ1blJlc3VsdChuZXdMb29wUnVuUmVzdWx0KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uTm9kZVN0YXJ0ZWQ6IChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbmV3TG9vcFJ1blJlc3VsdCA9IHByb2R1Y2UoX2xvb3BSZXN1bHQsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgICAgIGRyYWZ0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgLi4ucGFyYW1zLmRhdGEsXG4gICAgICAgICAgICAgICAgICBzdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgX2xvb3BSZXN1bHQgPSBuZXdMb29wUnVuUmVzdWx0XG4gICAgICAgICAgICAgIHNldExvb3BSdW5SZXN1bHQobmV3TG9vcFJ1blJlc3VsdClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk5vZGVGaW5pc2hlZDogKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBsb29wUnVuUmVzdWx0ID0gX2xvb3BSZXN1bHRcblxuICAgICAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IHBhcmFtc1xuICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBsb29wUnVuUmVzdWx0LmZpbmRJbmRleCh0cmFjZSA9PiB0cmFjZS5pZCA9PT0gZGF0YS5pZClcbiAgICAgICAgICAgICAgY29uc3QgbmV3TG9vcFJ1blJlc3VsdCA9IHByb2R1Y2UobG9vcFJ1blJlc3VsdCwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICBkcmFmdFtjdXJyZW50SW5kZXhdID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5kcmFmdFtjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgX2xvb3BSZXN1bHQgPSBuZXdMb29wUnVuUmVzdWx0XG4gICAgICAgICAgICAgIHNldExvb3BSdW5SZXN1bHQobmV3TG9vcFJ1blJlc3VsdClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk5vZGVSZXRyeTogKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuZXdMb29wUnVuUmVzdWx0ID0gcHJvZHVjZShfbG9vcFJlc3VsdCwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgZHJhZnQucHVzaChwYXJhbXMuZGF0YSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgX2xvb3BSZXN1bHQgPSBuZXdMb29wUnVuUmVzdWx0XG4gICAgICAgICAgICAgIHNldExvb3BSdW5SZXN1bHQobmV3TG9vcFJ1blJlc3VsdClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpc1BhdXNlZFJlZi5jdXJyZW50KVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBfc2luZ2xlUnVubmluZ1N0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuRmFpbGVkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRyYWNrRXZlbnQoJ3dvcmtmbG93X3J1bl9mYWlsZWQnLCB7IHdvcmtmbG93X2lkOiBmbG93SWQsIG5vZGVfaWQ6IGlkLCByZWFzb246IHJlcy5lcnJvciwgbm9kZV90eXBlOiBkYXRhPy50eXBlIH0pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGlmIChyZXMgJiYgcmVzLmVycm9yKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLmVycm9yKVxuICAgIH1cbiAgICBjYXRjaCAoZTogYW55KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICBoYXNFcnJvciA9IHRydWVcbiAgICAgIGludmFsaWRMYXN0UnVuKClcbiAgICAgIGlmICghaXNJdGVyYXRpb24gJiYgIWlzTG9vcCkge1xuICAgICAgICBpZiAoaXNQYXVzZWRSZWYuY3VycmVudClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICBfaXNTaW5nbGVSdW46IGZhbHNlLFxuICAgICAgICAgICAgX3NpbmdsZVJ1bm5pbmdTdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLkZhaWxlZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBpZiAoaXNXZWJob29rVHJpZ2dlck5vZGUpXG4gICAgICAgIGNhbmNlbFdlYmhvb2tTaW5nbGVSdW4oKVxuICAgICAgaWYgKGlzUGx1Z2luVHJpZ2dlck5vZGUpXG4gICAgICAgIGNhbmNlbFBsdWdpblNpbmdsZVJ1bigpXG4gICAgICBpZiAoaXNUcmlnZ2VyTm9kZSlcbiAgICAgICAgc3RvcFRyaWdnZXJMaXN0ZW5pbmcoKVxuICAgICAgaWYgKCFpc0l0ZXJhdGlvbiAmJiAhaXNMb29wKVxuICAgICAgICB1cGRhdGVOb2RlSW5zcGVjdFJ1bm5pbmdTdGF0ZShpZCwgZmFsc2UpXG4gICAgICBpZiAoIWlzUGF1c2VkUmVmLmN1cnJlbnQgJiYgIWlzSXRlcmF0aW9uICYmICFpc0xvb3AgJiYgcmVzKSB7XG4gICAgICAgIHNldFJ1blJlc3VsdCh7XG4gICAgICAgICAgLi4ucmVzLFxuICAgICAgICAgIHRvdGFsX3Rva2VuczogcmVzLmV4ZWN1dGlvbl9tZXRhZGF0YT8udG90YWxfdG9rZW5zIHx8IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogcmVzLmNyZWF0ZWRfYnlfYWNjb3VudD8ubmFtZSB8fCAnJyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzUGF1c2VkUmVmLmN1cnJlbnQpXG4gICAgICByZXR1cm5cblxuICAgIGlmICghaXNJdGVyYXRpb24gJiYgIWlzTG9vcCAmJiAhaGFzRXJyb3IpIHtcbiAgICAgIGlmIChpc1BhdXNlZFJlZi5jdXJyZW50KVxuICAgICAgICByZXR1cm5cbiAgICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgICAgaWQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgX3NpbmdsZVJ1bm5pbmdTdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLlN1Y2NlZWRlZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU3RvcCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoaXNUcmlnZ2VyTm9kZSkge1xuICAgICAgY29uc3QgaXNUcmlnZ2VyQWN0aXZlID0gcnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuTGlzdGVuaW5nXG4gICAgICAgIHx8IHdlYmhvb2tTaW5nbGVSdW5BY3RpdmVSZWYuY3VycmVudFxuICAgICAgICB8fCBwbHVnaW5TaW5nbGVSdW5BY3RpdmVSZWYuY3VycmVudFxuICAgICAgaWYgKCFpc1RyaWdnZXJBY3RpdmUpXG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICBlbHNlIGlmIChydW5uaW5nU3RhdHVzICE9PSBOb2RlUnVubmluZ1N0YXR1cy5SdW5uaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjYW5jZWxXZWJob29rU2luZ2xlUnVuKClcbiAgICBjYW5jZWxQbHVnaW5TaW5nbGVSdW4oKVxuICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgIGlkLFxuICAgICAgZGF0YToge1xuICAgICAgICBfaXNTaW5nbGVSdW46IGZhbHNlLFxuICAgICAgICBfc2luZ2xlUnVubmluZ1N0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuU3RvcHBlZCxcbiAgICAgIH0sXG4gICAgfSlcbiAgICBzdG9wVHJpZ2dlckxpc3RlbmluZygpXG4gICAgdXBkYXRlTm9kZUluc3BlY3RSdW5uaW5nU3RhdGUoaWQsIGZhbHNlKVxuICAgIGNvbnN0IHtcbiAgICAgIHdvcmtmbG93UnVubmluZ0RhdGEsXG4gICAgICBzZXRXb3JrZmxvd1J1bm5pbmdEYXRhLFxuICAgICAgbm9kZXNXaXRoSW5zcGVjdFZhcnMsXG4gICAgICBkZWxldGVOb2RlSW5zcGVjdFZhcnMsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgIGlmICh3b3JrZmxvd1J1bm5pbmdEYXRhKSB7XG4gICAgICBzZXRXb3JrZmxvd1J1bm5pbmdEYXRhKHByb2R1Y2Uod29ya2Zsb3dSdW5uaW5nRGF0YSwgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGRyYWZ0LnJlc3VsdC5zdGF0dXMgPSBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuU3RvcHBlZFxuICAgICAgfSkpXG4gICAgfVxuXG4gICAgY29uc3QgaW5zcGVjdE5vZGUgPSBub2Rlc1dpdGhJbnNwZWN0VmFycy5maW5kKG5vZGUgPT4gbm9kZS5ub2RlSWQgPT09IGlkKVxuICAgIGlmIChpbnNwZWN0Tm9kZSAmJiAhaW5zcGVjdE5vZGUuaXNWYWx1ZUZldGNoZWQgJiYgKCFpbnNwZWN0Tm9kZS52YXJzIHx8IGluc3BlY3ROb2RlLnZhcnMubGVuZ3RoID09PSAwKSlcbiAgICAgIGRlbGV0ZU5vZGVJbnNwZWN0VmFycyhpZClcbiAgfSwgW1xuICAgIGlzVHJpZ2dlck5vZGUsXG4gICAgcnVubmluZ1N0YXR1cyxcbiAgICBjYW5jZWxXZWJob29rU2luZ2xlUnVuLFxuICAgIGNhbmNlbFBsdWdpblNpbmdsZVJ1bixcbiAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSxcbiAgICBpZCxcbiAgICBzdG9wVHJpZ2dlckxpc3RlbmluZyxcbiAgICB1cGRhdGVOb2RlSW5zcGVjdFJ1bm5pbmdTdGF0ZSxcbiAgICB3b3JrZmxvd1N0b3JlLFxuICBdKVxuXG4gIGNvbnN0IHRvVmFySW5wdXRzID0gKHZhcmlhYmxlczogVmFyaWFibGVbXSk6IElucHV0VmFyW10gPT4ge1xuICAgIGlmICghdmFyaWFibGVzKVxuICAgICAgcmV0dXJuIFtdXG5cbiAgICBjb25zdCB2YXJJbnB1dHMgPSB2YXJpYWJsZXMuZmlsdGVyKGl0ZW0gPT4gIWlzRU5WKGl0ZW0udmFsdWVfc2VsZWN0b3IpKS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsVmFyID0gZ2V0VmFyKGl0ZW0udmFsdWVfc2VsZWN0b3IpXG4gICAgICBpZiAoIW9yaWdpbmFsVmFyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFiZWw6IGl0ZW0ubGFiZWwgfHwgaXRlbS52YXJpYWJsZSxcbiAgICAgICAgICB2YXJpYWJsZTogaXRlbS52YXJpYWJsZSxcbiAgICAgICAgICB0eXBlOiBJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHZhbHVlX3NlbGVjdG9yOiBpdGVtLnZhbHVlX3NlbGVjdG9yLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsYWJlbDogKHR5cGVvZiBpdGVtLmxhYmVsID09PSAnb2JqZWN0JyA/IGl0ZW0ubGFiZWwudmFyaWFibGUgOiBpdGVtLmxhYmVsKSB8fCBpdGVtLnZhcmlhYmxlLFxuICAgICAgICB2YXJpYWJsZTogaXRlbS52YXJpYWJsZSxcbiAgICAgICAgdHlwZTogdmFyVHlwZVRvSW5wdXRWYXJUeXBlKG9yaWdpbmFsVmFyLnR5cGUsIHtcbiAgICAgICAgICBpc1NlbGVjdDogISFvcmlnaW5hbFZhci5pc1NlbGVjdCxcbiAgICAgICAgICBpc1BhcmFncmFwaDogISFvcmlnaW5hbFZhci5pc1BhcmFncmFwaCxcbiAgICAgICAgfSksXG4gICAgICAgIHJlcXVpcmVkOiBpdGVtLnJlcXVpcmVkICE9PSBmYWxzZSxcbiAgICAgICAgb3B0aW9uczogb3JpZ2luYWxWYXIub3B0aW9ucyxcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHZhcklucHV0c1xuICB9XG5cbiAgY29uc3QgZ2V0SW5wdXRWYXJzID0gKHRleHRMaXN0OiBzdHJpbmdbXSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlU2VsZWN0b3JzOiBWYWx1ZVNlbGVjdG9yW10gPSBbXVxuICAgIHRleHRMaXN0LmZvckVhY2goKHRleHQpID0+IHtcbiAgICAgIHZhbHVlU2VsZWN0b3JzLnB1c2goLi4uZG9HZXRJbnB1dFZhcnModGV4dCkpXG4gICAgfSlcblxuICAgIGNvbnN0IHZhcmlhYmxlcyA9IHVuaW9uQnkodmFsdWVTZWxlY3RvcnMsIGl0ZW0gPT4gaXRlbS5qb2luKCcuJykpLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgdmFySW5mbyA9IGdldE5vZGVJbmZvQnlJZChhdmFpbGFibGVOb2Rlc0luY2x1ZGVQYXJlbnQsIGl0ZW1bMF0pPy5kYXRhXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgbm9kZVR5cGU6IHZhckluZm8/LnR5cGUsXG4gICAgICAgICAgbm9kZU5hbWU6IHZhckluZm8/LnRpdGxlIHx8IGF2YWlsYWJsZU5vZGVzSW5jbHVkZVBhcmVudFswXT8uZGF0YS50aXRsZSwgLy8gZGVmYXVsdCBzdGFydCBub2RlIHRpdGxlXG4gICAgICAgICAgdmFyaWFibGU6IGlzU3lzdGVtVmFyKGl0ZW0pID8gaXRlbS5qb2luKCcuJykgOiBpdGVtW2l0ZW0ubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgaXNDaGF0VmFyOiBpc0NvbnZlcnNhdGlvblZhcihpdGVtKSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFyaWFibGU6IGAjJHtpdGVtLmpvaW4oJy4nKX0jYCxcbiAgICAgICAgdmFsdWVfc2VsZWN0b3I6IGl0ZW0sXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IHZhcklucHV0cyA9IHRvVmFySW5wdXRzKHZhcmlhYmxlcylcbiAgICByZXR1cm4gdmFySW5wdXRzXG4gIH1cblxuICBjb25zdCB2YXJTZWxlY3RvcnNUb1ZhcklucHV0cyA9ICh2YWx1ZVNlbGVjdG9yczogVmFsdWVTZWxlY3RvcltdIHwgc3RyaW5nW10pOiBJbnB1dFZhcltdID0+IHtcbiAgICByZXR1cm4gdmFsdWVTZWxlY3RvcnMuZmlsdGVyKGl0ZW0gPT4gISFpdGVtKS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBnZXRJbnB1dFZhcnMoW2B7eyMke3R5cGVvZiBpdGVtID09PSAnc3RyaW5nJyA/IGl0ZW0gOiBpdGVtLmpvaW4oJy4nKX0jfX1gXSlbMF1cbiAgICB9KVxuICB9XG5cbiAgZXZlbnRFbWl0dGVyPy51c2VTdWJzY3JpcHRpb24oKHY6IGFueSkgPT4ge1xuICAgIGlmICh2LnR5cGUgPT09IEVWRU5UX1dPUktGTE9XX1NUT1ApXG4gICAgICBoYW5kbGVTdG9wKClcbiAgfSlcblxuICByZXR1cm4ge1xuICAgIGlzU2hvd1NpbmdsZVJ1bixcbiAgICBoaWRlU2luZ2xlUnVuLFxuICAgIHNob3dTaW5nbGVSdW4sXG4gICAgdG9WYXJJbnB1dHMsXG4gICAgdmFyU2VsZWN0b3JzVG9WYXJJbnB1dHMsXG4gICAgZ2V0SW5wdXRWYXJzLFxuICAgIHJ1bm5pbmdTdGF0dXMsXG4gICAgaXNDb21wbGV0ZWQsXG4gICAgaGFuZGxlUnVuLFxuICAgIGhhbmRsZVN0b3AsXG4gICAgcnVuSW5wdXREYXRhLFxuICAgIHJ1bklucHV0RGF0YVJlZixcbiAgICBzZXRSdW5JbnB1dERhdGE6IGhhbmRsZVNldFJ1bklucHV0RGF0YSxcbiAgICBydW5SZXN1bHQsXG4gICAgc2V0UnVuUmVzdWx0OiBkb1NldFJ1blJlc3VsdCxcbiAgICBpdGVyYXRpb25SdW5SZXN1bHQsXG4gICAgbG9vcFJ1blJlc3VsdCxcbiAgICBzZXROb2RlUnVubmluZyxcbiAgICBjaGVja1ZhbGlkOiBjaGVja1ZhbGlkV3JhcCxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VPbmVTdGVwUnVuXG4iXX0=