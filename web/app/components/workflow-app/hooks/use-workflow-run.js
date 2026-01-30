"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowRun = void 0;
const function_1 = require("es-toolkit/function");
const immer_1 = require("immer");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const uuid_1 = require("uuid");
const store_1 = require("@/app/components/app/store");
const amplitude_1 = require("@/app/components/base/amplitude");
const audio_player_manager_1 = require("@/app/components/base/audio-btn/audio.player.manager");
const hooks_1 = require("@/app/components/base/features/hooks");
const toast_1 = require("@/app/components/base/toast");
const test_run_menu_1 = require("@/app/components/workflow/header/test-run-menu");
const use_workflow_interactions_1 = require("@/app/components/workflow/hooks/use-workflow-interactions");
const use_workflow_run_event_1 = require("@/app/components/workflow/hooks/use-workflow-run-event/use-workflow-run-event");
const store_2 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const base_1 = require("@/service/base");
const fetch_1 = require("@/service/fetch");
const use_workflow_1 = require("@/service/use-workflow");
const workflow_1 = require("@/service/workflow");
const app_1 = require("@/types/app");
const use_fetch_workflow_inspect_vars_1 = require("../../workflow/hooks/use-fetch-workflow-inspect-vars");
const use_configs_map_1 = require("./use-configs-map");
const use_nodes_sync_draft_1 = require("./use-nodes-sync-draft");
const controllerKeyMap = {
    [test_run_menu_1.TriggerType.Webhook]: '__webhookDebugAbortController',
    [test_run_menu_1.TriggerType.Plugin]: '__pluginDebugAbortController',
    [test_run_menu_1.TriggerType.All]: '__allTriggersDebugAbortController',
    [test_run_menu_1.TriggerType.Schedule]: '__scheduleDebugAbortController',
};
const debugLabelMap = {
    [test_run_menu_1.TriggerType.Webhook]: 'Webhook',
    [test_run_menu_1.TriggerType.Plugin]: 'Plugin',
    [test_run_menu_1.TriggerType.All]: 'All',
    [test_run_menu_1.TriggerType.Schedule]: 'Schedule',
};
const useWorkflowRun = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_2.useWorkflowStore)();
    const reactflow = (0, reactflow_1.useReactFlow)();
    const featuresStore = (0, hooks_1.useFeaturesStore)();
    const { doSyncWorkflowDraft } = (0, use_nodes_sync_draft_1.useNodesSyncDraft)();
    const { handleUpdateWorkflowCanvas } = (0, use_workflow_interactions_1.useWorkflowUpdate)();
    const pathname = (0, navigation_1.usePathname)();
    const configsMap = (0, use_configs_map_1.useConfigsMap)();
    const { flowId, flowType } = configsMap;
    const invalidAllLastRun = (0, use_workflow_1.useInvalidAllLastRun)(flowType, flowId);
    const { fetchInspectVars } = (0, use_fetch_workflow_inspect_vars_1.useSetWorkflowVarsWithValue)({
        ...configsMap,
    });
    const abortControllerRef = (0, react_1.useRef)(null);
    const { handleWorkflowStarted, handleWorkflowFinished, handleWorkflowFailed, handleWorkflowNodeStarted, handleWorkflowNodeFinished, handleWorkflowNodeIterationStarted, handleWorkflowNodeIterationNext, handleWorkflowNodeIterationFinished, handleWorkflowNodeLoopStarted, handleWorkflowNodeLoopNext, handleWorkflowNodeLoopFinished, handleWorkflowNodeRetry, handleWorkflowAgentLog, handleWorkflowTextChunk, handleWorkflowTextReplace, } = (0, use_workflow_run_event_1.useWorkflowRunEvent)();
    const handleBackupDraft = (0, react_1.useCallback)(() => {
        const { getNodes, edges, } = store.getState();
        const { getViewport } = reactflow;
        const { backupDraft, setBackupDraft, environmentVariables, } = workflowStore.getState();
        const { features } = featuresStore.getState();
        if (!backupDraft) {
            setBackupDraft({
                nodes: getNodes(),
                edges,
                viewport: getViewport(),
                features,
                environmentVariables,
            });
            doSyncWorkflowDraft();
        }
    }, [reactflow, workflowStore, store, featuresStore, doSyncWorkflowDraft]);
    const handleLoadBackupDraft = (0, react_1.useCallback)(() => {
        const { backupDraft, setBackupDraft, setEnvironmentVariables, } = workflowStore.getState();
        if (backupDraft) {
            const { nodes, edges, viewport, features, environmentVariables, } = backupDraft;
            handleUpdateWorkflowCanvas({
                nodes,
                edges,
                viewport,
            });
            setEnvironmentVariables(environmentVariables);
            featuresStore.setState({ features });
            setBackupDraft(undefined);
        }
    }, [handleUpdateWorkflowCanvas, workflowStore, featuresStore]);
    const handleRun = (0, react_1.useCallback)(async (params, callback, options) => {
        const runMode = options?.mode ?? test_run_menu_1.TriggerType.UserInput;
        const resolvedParams = params ?? {};
        const { getNodes, setNodes, } = store.getState();
        const newNodes = (0, immer_1.produce)(getNodes(), (draft) => {
            draft.forEach((node) => {
                node.data.selected = false;
                node.data._runningStatus = undefined;
            });
        });
        setNodes(newNodes);
        await doSyncWorkflowDraft();
        const { onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished, onIterationStart, onIterationNext, onIterationFinish, onLoopStart, onLoopNext, onLoopFinish, onNodeRetry, onAgentLog, onError, onCompleted, ...restCallback } = callback || {};
        workflowStore.setState({ historyWorkflowData: undefined });
        const appDetail = store_1.useStore.getState().appDetail;
        const workflowContainer = document.getElementById('workflow-container');
        const { clientWidth, clientHeight, } = workflowContainer;
        const isInWorkflowDebug = appDetail?.mode === app_1.AppModeEnum.WORKFLOW;
        let url = '';
        if (runMode === test_run_menu_1.TriggerType.Plugin || runMode === test_run_menu_1.TriggerType.Webhook || runMode === test_run_menu_1.TriggerType.Schedule) {
            if (!appDetail?.id) {
                console.error('handleRun: missing app id for trigger plugin run');
                return;
            }
            url = `/apps/${appDetail.id}/workflows/draft/trigger/run`;
        }
        else if (runMode === test_run_menu_1.TriggerType.All) {
            if (!appDetail?.id) {
                console.error('handleRun: missing app id for trigger run all');
                return;
            }
            url = `/apps/${appDetail.id}/workflows/draft/trigger/run-all`;
        }
        else if (appDetail?.mode === app_1.AppModeEnum.ADVANCED_CHAT) {
            url = `/apps/${appDetail.id}/advanced-chat/workflows/draft/run`;
        }
        else if (isInWorkflowDebug && appDetail?.id) {
            url = `/apps/${appDetail.id}/workflows/draft/run`;
        }
        let requestBody = {};
        if (runMode === test_run_menu_1.TriggerType.Schedule)
            requestBody = { node_id: options?.scheduleNodeId };
        else if (runMode === test_run_menu_1.TriggerType.Webhook)
            requestBody = { node_id: options?.webhookNodeId };
        else if (runMode === test_run_menu_1.TriggerType.Plugin)
            requestBody = { node_id: options?.pluginNodeId };
        else if (runMode === test_run_menu_1.TriggerType.All)
            requestBody = { node_ids: options?.allNodeIds };
        else
            requestBody = resolvedParams;
        if (!url)
            return;
        if (runMode === test_run_menu_1.TriggerType.Schedule && !options?.scheduleNodeId) {
            console.error('handleRun: schedule trigger run requires node id');
            return;
        }
        if (runMode === test_run_menu_1.TriggerType.Webhook && !options?.webhookNodeId) {
            console.error('handleRun: webhook trigger run requires node id');
            return;
        }
        if (runMode === test_run_menu_1.TriggerType.Plugin && !options?.pluginNodeId) {
            console.error('handleRun: plugin trigger run requires node id');
            return;
        }
        if (runMode === test_run_menu_1.TriggerType.All && !options?.allNodeIds && options?.allNodeIds?.length === 0) {
            console.error('handleRun: all trigger run requires node ids');
            return;
        }
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        const { setWorkflowRunningData, setIsListening, setShowVariableInspectPanel, setListeningTriggerType, setListeningTriggerNodeIds, setListeningTriggerIsAll, setListeningTriggerNodeId, } = workflowStore.getState();
        if (runMode === test_run_menu_1.TriggerType.Webhook
            || runMode === test_run_menu_1.TriggerType.Plugin
            || runMode === test_run_menu_1.TriggerType.All
            || runMode === test_run_menu_1.TriggerType.Schedule) {
            setIsListening(true);
            setShowVariableInspectPanel(true);
            setListeningTriggerIsAll(runMode === test_run_menu_1.TriggerType.All);
            if (runMode === test_run_menu_1.TriggerType.All)
                setListeningTriggerNodeIds(options?.allNodeIds ?? []);
            else if (runMode === test_run_menu_1.TriggerType.Webhook && options?.webhookNodeId)
                setListeningTriggerNodeIds([options.webhookNodeId]);
            else if (runMode === test_run_menu_1.TriggerType.Schedule && options?.scheduleNodeId)
                setListeningTriggerNodeIds([options.scheduleNodeId]);
            else if (runMode === test_run_menu_1.TriggerType.Plugin && options?.pluginNodeId)
                setListeningTriggerNodeIds([options.pluginNodeId]);
            else
                setListeningTriggerNodeIds([]);
            setWorkflowRunningData({
                result: {
                    status: types_1.WorkflowRunningStatus.Running,
                    inputs_truncated: false,
                    process_data_truncated: false,
                    outputs_truncated: false,
                },
                tracing: [],
                resultText: '',
            });
        }
        else {
            setIsListening(false);
            setListeningTriggerType(null);
            setListeningTriggerNodeId(null);
            setListeningTriggerNodeIds([]);
            setListeningTriggerIsAll(false);
            setWorkflowRunningData({
                result: {
                    status: types_1.WorkflowRunningStatus.Running,
                    inputs_truncated: false,
                    process_data_truncated: false,
                    outputs_truncated: false,
                },
                tracing: [],
                resultText: '',
            });
        }
        let ttsUrl = '';
        let ttsIsPublic = false;
        if (resolvedParams.token) {
            ttsUrl = '/text-to-audio';
            ttsIsPublic = true;
        }
        else if (resolvedParams.appId) {
            if (pathname.search('explore/installed') > -1)
                ttsUrl = `/installed-apps/${resolvedParams.appId}/text-to-audio`;
            else
                ttsUrl = `/apps/${resolvedParams.appId}/text-to-audio`;
        }
        // Lazy initialization: Only create AudioPlayer when TTS is actually needed
        // This prevents opening audio channel unnecessarily
        let player = null;
        const getOrCreatePlayer = () => {
            if (!player)
                player = audio_player_manager_1.AudioPlayerManager.getInstance().getAudioPlayer(ttsUrl, ttsIsPublic, (0, uuid_1.v4)(), 'none', 'none', function_1.noop);
            return player;
        };
        const clearAbortController = () => {
            abortControllerRef.current = null;
            delete window.__webhookDebugAbortController;
            delete window.__pluginDebugAbortController;
            delete window.__scheduleDebugAbortController;
            delete window.__allTriggersDebugAbortController;
        };
        const clearListeningState = () => {
            const state = workflowStore.getState();
            state.setIsListening(false);
            state.setListeningTriggerType(null);
            state.setListeningTriggerNodeId(null);
            state.setListeningTriggerNodeIds([]);
            state.setListeningTriggerIsAll(false);
        };
        const wrappedOnError = (params) => {
            clearAbortController();
            handleWorkflowFailed();
            clearListeningState();
            if (onError)
                onError(params);
            (0, amplitude_1.trackEvent)('workflow_run_failed', { workflow_id: flowId, reason: params.error, node_type: params.node_type });
        };
        const wrappedOnCompleted = async (hasError, errorMessage) => {
            clearAbortController();
            clearListeningState();
            if (onCompleted)
                onCompleted(hasError, errorMessage);
        };
        const baseSseOptions = {
            ...restCallback,
            onWorkflowStarted: (params) => {
                const state = workflowStore.getState();
                if (state.workflowRunningData) {
                    state.setWorkflowRunningData((0, immer_1.produce)(state.workflowRunningData, (draft) => {
                        draft.resultText = '';
                    }));
                }
                handleWorkflowStarted(params);
                if (onWorkflowStarted)
                    onWorkflowStarted(params);
            },
            onWorkflowFinished: (params) => {
                clearListeningState();
                handleWorkflowFinished(params);
                if (onWorkflowFinished)
                    onWorkflowFinished(params);
                if (isInWorkflowDebug) {
                    fetchInspectVars({});
                    invalidAllLastRun();
                }
            },
            onNodeStarted: (params) => {
                handleWorkflowNodeStarted(params, {
                    clientWidth,
                    clientHeight,
                });
                if (onNodeStarted)
                    onNodeStarted(params);
            },
            onNodeFinished: (params) => {
                handleWorkflowNodeFinished(params);
                if (onNodeFinished)
                    onNodeFinished(params);
            },
            onIterationStart: (params) => {
                handleWorkflowNodeIterationStarted(params, {
                    clientWidth,
                    clientHeight,
                });
                if (onIterationStart)
                    onIterationStart(params);
            },
            onIterationNext: (params) => {
                handleWorkflowNodeIterationNext(params);
                if (onIterationNext)
                    onIterationNext(params);
            },
            onIterationFinish: (params) => {
                handleWorkflowNodeIterationFinished(params);
                if (onIterationFinish)
                    onIterationFinish(params);
            },
            onLoopStart: (params) => {
                handleWorkflowNodeLoopStarted(params, {
                    clientWidth,
                    clientHeight,
                });
                if (onLoopStart)
                    onLoopStart(params);
            },
            onLoopNext: (params) => {
                handleWorkflowNodeLoopNext(params);
                if (onLoopNext)
                    onLoopNext(params);
            },
            onLoopFinish: (params) => {
                handleWorkflowNodeLoopFinished(params);
                if (onLoopFinish)
                    onLoopFinish(params);
            },
            onNodeRetry: (params) => {
                handleWorkflowNodeRetry(params);
                if (onNodeRetry)
                    onNodeRetry(params);
            },
            onAgentLog: (params) => {
                handleWorkflowAgentLog(params);
                if (onAgentLog)
                    onAgentLog(params);
            },
            onTextChunk: (params) => {
                handleWorkflowTextChunk(params);
            },
            onTextReplace: (params) => {
                handleWorkflowTextReplace(params);
            },
            onTTSChunk: (messageId, audio) => {
                if (!audio || audio === '')
                    return;
                const audioPlayer = getOrCreatePlayer();
                if (audioPlayer) {
                    audioPlayer.playAudioWithAudio(audio, true);
                    audio_player_manager_1.AudioPlayerManager.getInstance().resetMsgId(messageId);
                }
            },
            onTTSEnd: (messageId, audio) => {
                const audioPlayer = getOrCreatePlayer();
                if (audioPlayer)
                    audioPlayer.playAudioWithAudio(audio, false);
            },
            onError: wrappedOnError,
            onCompleted: wrappedOnCompleted,
        };
        const waitWithAbort = (signal, delay) => new Promise((resolve) => {
            const timer = window.setTimeout(resolve, delay);
            signal.addEventListener('abort', () => {
                clearTimeout(timer);
                resolve();
            }, { once: true });
        });
        const runTriggerDebug = async (debugType) => {
            const controller = new AbortController();
            abortControllerRef.current = controller;
            const controllerKey = controllerKeyMap[debugType];
            window[controllerKey] = controller;
            const debugLabel = debugLabelMap[debugType];
            const poll = async () => {
                try {
                    const response = await (0, base_1.post)(url, {
                        body: requestBody,
                        signal: controller.signal,
                    }, {
                        needAllResponseContent: true,
                    });
                    if (controller.signal.aborted)
                        return;
                    if (!response) {
                        const message = `${debugLabel} debug request failed`;
                        toast_1.default.notify({ type: 'error', message });
                        clearAbortController();
                        return;
                    }
                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes(fetch_1.ContentType.json)) {
                        let data = null;
                        try {
                            data = await response.json();
                        }
                        catch (jsonError) {
                            console.error(`handleRun: ${debugLabel.toLowerCase()} debug response parse error`, jsonError);
                            toast_1.default.notify({ type: 'error', message: `${debugLabel} debug request failed` });
                            clearAbortController();
                            clearListeningState();
                            return;
                        }
                        if (controller.signal.aborted)
                            return;
                        if (data?.status === 'waiting') {
                            const delay = Number(data.retry_in) || 2000;
                            await waitWithAbort(controller.signal, delay);
                            if (controller.signal.aborted)
                                return;
                            await poll();
                            return;
                        }
                        const errorMessage = data?.message || `${debugLabel} debug failed`;
                        toast_1.default.notify({ type: 'error', message: errorMessage });
                        clearAbortController();
                        setWorkflowRunningData({
                            result: {
                                status: types_1.WorkflowRunningStatus.Failed,
                                error: errorMessage,
                                inputs_truncated: false,
                                process_data_truncated: false,
                                outputs_truncated: false,
                            },
                            tracing: [],
                        });
                        clearListeningState();
                        return;
                    }
                    clearListeningState();
                    (0, base_1.handleStream)(response, baseSseOptions.onData ?? function_1.noop, baseSseOptions.onCompleted, baseSseOptions.onThought, baseSseOptions.onMessageEnd, baseSseOptions.onMessageReplace, baseSseOptions.onFile, baseSseOptions.onWorkflowStarted, baseSseOptions.onWorkflowFinished, baseSseOptions.onNodeStarted, baseSseOptions.onNodeFinished, baseSseOptions.onIterationStart, baseSseOptions.onIterationNext, baseSseOptions.onIterationFinish, baseSseOptions.onLoopStart, baseSseOptions.onLoopNext, baseSseOptions.onLoopFinish, baseSseOptions.onNodeRetry, baseSseOptions.onParallelBranchStarted, baseSseOptions.onParallelBranchFinished, baseSseOptions.onTextChunk, baseSseOptions.onTTSChunk, baseSseOptions.onTTSEnd, baseSseOptions.onTextReplace, baseSseOptions.onAgentLog, baseSseOptions.onDataSourceNodeProcessing, baseSseOptions.onDataSourceNodeCompleted, baseSseOptions.onDataSourceNodeError);
                }
                catch (error) {
                    if (controller.signal.aborted)
                        return;
                    if (error instanceof Response) {
                        const data = await error.clone().json();
                        const { error: respError } = data || {};
                        toast_1.default.notify({ type: 'error', message: respError });
                        clearAbortController();
                        setWorkflowRunningData({
                            result: {
                                status: types_1.WorkflowRunningStatus.Failed,
                                error: respError,
                                inputs_truncated: false,
                                process_data_truncated: false,
                                outputs_truncated: false,
                            },
                            tracing: [],
                        });
                    }
                    clearListeningState();
                }
            };
            await poll();
        };
        if (runMode === test_run_menu_1.TriggerType.Schedule) {
            await runTriggerDebug(test_run_menu_1.TriggerType.Schedule);
            return;
        }
        if (runMode === test_run_menu_1.TriggerType.Webhook) {
            await runTriggerDebug(test_run_menu_1.TriggerType.Webhook);
            return;
        }
        if (runMode === test_run_menu_1.TriggerType.Plugin) {
            await runTriggerDebug(test_run_menu_1.TriggerType.Plugin);
            return;
        }
        if (runMode === test_run_menu_1.TriggerType.All) {
            await runTriggerDebug(test_run_menu_1.TriggerType.All);
            return;
        }
        (0, base_1.ssePost)(url, {
            body: requestBody,
        }, {
            ...baseSseOptions,
            getAbortController: (controller) => {
                abortControllerRef.current = controller;
            },
        });
    }, [store, doSyncWorkflowDraft, workflowStore, pathname, handleWorkflowStarted, handleWorkflowFinished, fetchInspectVars, invalidAllLastRun, handleWorkflowFailed, handleWorkflowNodeStarted, handleWorkflowNodeFinished, handleWorkflowNodeIterationStarted, handleWorkflowNodeIterationNext, handleWorkflowNodeIterationFinished, handleWorkflowNodeLoopStarted, handleWorkflowNodeLoopNext, handleWorkflowNodeLoopFinished, handleWorkflowNodeRetry, handleWorkflowAgentLog, handleWorkflowTextChunk, handleWorkflowTextReplace]);
    const handleStopRun = (0, react_1.useCallback)((taskId) => {
        const setStoppedState = () => {
            const { setWorkflowRunningData, setIsListening, setShowVariableInspectPanel, setListeningTriggerType, setListeningTriggerNodeId, } = workflowStore.getState();
            setWorkflowRunningData({
                result: {
                    status: types_1.WorkflowRunningStatus.Stopped,
                    inputs_truncated: false,
                    process_data_truncated: false,
                    outputs_truncated: false,
                },
                tracing: [],
                resultText: '',
            });
            setIsListening(false);
            setListeningTriggerType(null);
            setListeningTriggerNodeId(null);
            setShowVariableInspectPanel(true);
        };
        if (taskId) {
            const appId = store_1.useStore.getState().appDetail?.id;
            (0, workflow_1.stopWorkflowRun)(`/apps/${appId}/workflow-runs/tasks/${taskId}/stop`);
            setStoppedState();
            return;
        }
        // Try webhook debug controller from global variable first
        const webhookController = window.__webhookDebugAbortController;
        if (webhookController)
            webhookController.abort();
        const pluginController = window.__pluginDebugAbortController;
        if (pluginController)
            pluginController.abort();
        const scheduleController = window.__scheduleDebugAbortController;
        if (scheduleController)
            scheduleController.abort();
        const allTriggerController = window.__allTriggersDebugAbortController;
        if (allTriggerController)
            allTriggerController.abort();
        // Also try the ref
        if (abortControllerRef.current)
            abortControllerRef.current.abort();
        abortControllerRef.current = null;
        setStoppedState();
    }, [workflowStore]);
    const handleRestoreFromPublishedWorkflow = (0, react_1.useCallback)((publishedWorkflow) => {
        const nodes = publishedWorkflow.graph.nodes.map(node => ({ ...node, selected: false, data: { ...node.data, selected: false } }));
        const edges = publishedWorkflow.graph.edges;
        const viewport = publishedWorkflow.graph.viewport;
        handleUpdateWorkflowCanvas({
            nodes,
            edges,
            viewport,
        });
        const mappedFeatures = {
            opening: {
                enabled: !!publishedWorkflow.features.opening_statement || !!publishedWorkflow.features.suggested_questions.length,
                opening_statement: publishedWorkflow.features.opening_statement,
                suggested_questions: publishedWorkflow.features.suggested_questions,
            },
            suggested: publishedWorkflow.features.suggested_questions_after_answer,
            text2speech: publishedWorkflow.features.text_to_speech,
            speech2text: publishedWorkflow.features.speech_to_text,
            citation: publishedWorkflow.features.retriever_resource,
            moderation: publishedWorkflow.features.sensitive_word_avoidance,
            file: publishedWorkflow.features.file_upload,
        };
        featuresStore?.setState({ features: mappedFeatures });
        workflowStore.getState().setEnvironmentVariables(publishedWorkflow.environment_variables || []);
    }, [featuresStore, handleUpdateWorkflowCanvas, workflowStore]);
    return {
        handleBackupDraft,
        handleLoadBackupDraft,
        handleRun,
        handleStopRun,
        handleRestoreFromPublishedWorkflow,
    };
};
exports.useWorkflowRun = useWorkflowRun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LXJ1bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS13b3JrZmxvdy1ydW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsa0RBQTBDO0FBQzFDLGlDQUErQjtBQUMvQixnREFBNkM7QUFDN0MsaUNBQTJDO0FBQzNDLHlDQUdrQjtBQUNsQiwrQkFBbUM7QUFDbkMsc0RBQW9FO0FBQ3BFLCtEQUE0RDtBQUM1RCwrRkFBeUY7QUFDekYsZ0VBQXVFO0FBQ3ZFLHVEQUErQztBQUMvQyxrRkFBNEU7QUFDNUUseUdBQTZGO0FBQzdGLDBIQUFtSDtBQUNuSCwyREFBa0U7QUFDbEUsMkRBQXVFO0FBQ3ZFLHlDQUE0RDtBQUM1RCwyQ0FBNkM7QUFDN0MseURBQTZEO0FBQzdELGlEQUFvRDtBQUNwRCxxQ0FBeUM7QUFDekMsMEdBQWtHO0FBQ2xHLHVEQUFpRDtBQUNqRCxpRUFBMEQ7QUFhMUQsTUFBTSxnQkFBZ0IsR0FBMEM7SUFDOUQsQ0FBQywyQkFBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLCtCQUErQjtJQUN0RCxDQUFDLDJCQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsOEJBQThCO0lBQ3BELENBQUMsMkJBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxtQ0FBbUM7SUFDdEQsQ0FBQywyQkFBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdDQUFnQztDQUN6RCxDQUFBO0FBRUQsTUFBTSxhQUFhLEdBQTBDO0lBQzNELENBQUMsMkJBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTO0lBQ2hDLENBQUMsMkJBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRO0lBQzlCLENBQUMsMkJBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO0lBQ3hCLENBQUMsMkJBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVO0NBQ25DLENBQUE7QUFFTSxNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUU7SUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBQSx1QkFB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QUUsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGlCQUFpQjtnQkFDL0QsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsUUFBUSxDQUFDLG1CQUFtQjthQUNwRTtZQUNELFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsZ0NBQWdDO1lBQ3RFLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsY0FBYztZQUN0RCxXQUFXLEVBQUUsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGNBQWM7WUFDdEQsUUFBUSxFQUFFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxrQkFBa0I7WUFDdkQsVUFBVSxFQUFFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyx3QkFBd0I7WUFDL0QsSUFBSSxFQUFFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxXQUFXO1NBQzdDLENBQUE7UUFFRCxhQUFhLEVBQUUsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUE7UUFDckQsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLHVCQUF1QixDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQ2pHLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSwwQkFBMEIsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBRTlELE9BQU87UUFDTCxpQkFBaUI7UUFDakIscUJBQXFCO1FBQ3JCLFNBQVM7UUFDVCxhQUFhO1FBQ2Isa0NBQWtDO0tBQ25DLENBQUE7QUFDSCxDQUFDLENBQUE7QUFsc0JZLFFBQUEsY0FBYyxrQkFrc0IxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIEF1ZGlvUGxheWVyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hdWRpby1idG4vYXVkaW8nXG5pbXBvcnQgdHlwZSB7IE5vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBJT3RoZXJPcHRpb25zIH0gZnJvbSAnQC9zZXJ2aWNlL2Jhc2UnXG5pbXBvcnQgdHlwZSB7IFZlcnNpb25IaXN0b3J5IH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdlcy10b29sa2l0L2Z1bmN0aW9uJ1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlUGF0aG5hbWUgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlUmVmIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICB1c2VSZWFjdEZsb3csXG4gIHVzZVN0b3JlQXBpLFxufSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyB2NCBhcyB1dWlkVjQgfSBmcm9tICd1dWlkJ1xuaW1wb3J0IHsgdXNlU3RvcmUgYXMgdXNlQXBwU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9zdG9yZSdcbmltcG9ydCB7IHRyYWNrRXZlbnQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYW1wbGl0dWRlJ1xuaW1wb3J0IHsgQXVkaW9QbGF5ZXJNYW5hZ2VyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2F1ZGlvLWJ0bi9hdWRpby5wbGF5ZXIubWFuYWdlcidcbmltcG9ydCB7IHVzZUZlYXR1cmVzU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMvaG9va3MnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgVHJpZ2dlclR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hlYWRlci90ZXN0LXJ1bi1tZW51J1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dVcGRhdGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS13b3JrZmxvdy1pbnRlcmFjdGlvbnMnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1J1bkV2ZW50IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcy91c2Utd29ya2Zsb3ctcnVuLWV2ZW50L3VzZS13b3JrZmxvdy1ydW4tZXZlbnQnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7IFdvcmtmbG93UnVubmluZ1N0YXR1cyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBoYW5kbGVTdHJlYW0sIHBvc3QsIHNzZVBvc3QgfSBmcm9tICdAL3NlcnZpY2UvYmFzZSdcbmltcG9ydCB7IENvbnRlbnRUeXBlIH0gZnJvbSAnQC9zZXJ2aWNlL2ZldGNoJ1xuaW1wb3J0IHsgdXNlSW52YWxpZEFsbExhc3RSdW4gfSBmcm9tICdAL3NlcnZpY2UvdXNlLXdvcmtmbG93J1xuaW1wb3J0IHsgc3RvcFdvcmtmbG93UnVuIH0gZnJvbSAnQC9zZXJ2aWNlL3dvcmtmbG93J1xuaW1wb3J0IHsgQXBwTW9kZUVudW0gfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IHVzZVNldFdvcmtmbG93VmFyc1dpdGhWYWx1ZSB9IGZyb20gJy4uLy4uL3dvcmtmbG93L2hvb2tzL3VzZS1mZXRjaC13b3JrZmxvdy1pbnNwZWN0LXZhcnMnXG5pbXBvcnQgeyB1c2VDb25maWdzTWFwIH0gZnJvbSAnLi91c2UtY29uZmlncy1tYXAnXG5pbXBvcnQgeyB1c2VOb2Rlc1N5bmNEcmFmdCB9IGZyb20gJy4vdXNlLW5vZGVzLXN5bmMtZHJhZnQnXG5cbnR5cGUgSGFuZGxlUnVuTW9kZSA9IFRyaWdnZXJUeXBlXG50eXBlIEhhbmRsZVJ1bk9wdGlvbnMgPSB7XG4gIG1vZGU/OiBIYW5kbGVSdW5Nb2RlXG4gIHNjaGVkdWxlTm9kZUlkPzogc3RyaW5nXG4gIHdlYmhvb2tOb2RlSWQ/OiBzdHJpbmdcbiAgcGx1Z2luTm9kZUlkPzogc3RyaW5nXG4gIGFsbE5vZGVJZHM/OiBzdHJpbmdbXVxufVxuXG50eXBlIERlYnVnZ2FibGVUcmlnZ2VyVHlwZSA9IEV4Y2x1ZGU8VHJpZ2dlclR5cGUsIFRyaWdnZXJUeXBlLlVzZXJJbnB1dD5cblxuY29uc3QgY29udHJvbGxlcktleU1hcDogUmVjb3JkPERlYnVnZ2FibGVUcmlnZ2VyVHlwZSwgc3RyaW5nPiA9IHtcbiAgW1RyaWdnZXJUeXBlLldlYmhvb2tdOiAnX193ZWJob29rRGVidWdBYm9ydENvbnRyb2xsZXInLFxuICBbVHJpZ2dlclR5cGUuUGx1Z2luXTogJ19fcGx1Z2luRGVidWdBYm9ydENvbnRyb2xsZXInLFxuICBbVHJpZ2dlclR5cGUuQWxsXTogJ19fYWxsVHJpZ2dlcnNEZWJ1Z0Fib3J0Q29udHJvbGxlcicsXG4gIFtUcmlnZ2VyVHlwZS5TY2hlZHVsZV06ICdfX3NjaGVkdWxlRGVidWdBYm9ydENvbnRyb2xsZXInLFxufVxuXG5jb25zdCBkZWJ1Z0xhYmVsTWFwOiBSZWNvcmQ8RGVidWdnYWJsZVRyaWdnZXJUeXBlLCBzdHJpbmc+ID0ge1xuICBbVHJpZ2dlclR5cGUuV2ViaG9va106ICdXZWJob29rJyxcbiAgW1RyaWdnZXJUeXBlLlBsdWdpbl06ICdQbHVnaW4nLFxuICBbVHJpZ2dlclR5cGUuQWxsXTogJ0FsbCcsXG4gIFtUcmlnZ2VyVHlwZS5TY2hlZHVsZV06ICdTY2hlZHVsZScsXG59XG5cbmV4cG9ydCBjb25zdCB1c2VXb3JrZmxvd1J1biA9ICgpID0+IHtcbiAgY29uc3Qgc3RvcmUgPSB1c2VTdG9yZUFwaSgpXG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3QgcmVhY3RmbG93ID0gdXNlUmVhY3RGbG93KClcbiAgY29uc3QgZmVhdHVyZXNTdG9yZSA9IHVzZUZlYXR1cmVzU3RvcmUoKVxuICBjb25zdCB7IGRvU3luY1dvcmtmbG93RHJhZnQgfSA9IHVzZU5vZGVzU3luY0RyYWZ0KClcbiAgY29uc3QgeyBoYW5kbGVVcGRhdGVXb3JrZmxvd0NhbnZhcyB9ID0gdXNlV29ya2Zsb3dVcGRhdGUoKVxuICBjb25zdCBwYXRobmFtZSA9IHVzZVBhdGhuYW1lKClcbiAgY29uc3QgY29uZmlnc01hcCA9IHVzZUNvbmZpZ3NNYXAoKVxuICBjb25zdCB7IGZsb3dJZCwgZmxvd1R5cGUgfSA9IGNvbmZpZ3NNYXBcbiAgY29uc3QgaW52YWxpZEFsbExhc3RSdW4gPSB1c2VJbnZhbGlkQWxsTGFzdFJ1bihmbG93VHlwZSwgZmxvd0lkKVxuXG4gIGNvbnN0IHsgZmV0Y2hJbnNwZWN0VmFycyB9ID0gdXNlU2V0V29ya2Zsb3dWYXJzV2l0aFZhbHVlKHtcbiAgICAuLi5jb25maWdzTWFwLFxuICB9KVxuXG4gIGNvbnN0IGFib3J0Q29udHJvbGxlclJlZiA9IHVzZVJlZjxBYm9ydENvbnRyb2xsZXIgfCBudWxsPihudWxsKVxuXG4gIGNvbnN0IHtcbiAgICBoYW5kbGVXb3JrZmxvd1N0YXJ0ZWQsXG4gICAgaGFuZGxlV29ya2Zsb3dGaW5pc2hlZCxcbiAgICBoYW5kbGVXb3JrZmxvd0ZhaWxlZCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVTdGFydGVkLFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZUZpbmlzaGVkLFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZUl0ZXJhdGlvblN0YXJ0ZWQsXG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlSXRlcmF0aW9uTmV4dCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVJdGVyYXRpb25GaW5pc2hlZCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wU3RhcnRlZCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wTmV4dCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wRmluaXNoZWQsXG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlUmV0cnksXG4gICAgaGFuZGxlV29ya2Zsb3dBZ2VudExvZyxcbiAgICBoYW5kbGVXb3JrZmxvd1RleHRDaHVuayxcbiAgICBoYW5kbGVXb3JrZmxvd1RleHRSZXBsYWNlLFxuICB9ID0gdXNlV29ya2Zsb3dSdW5FdmVudCgpXG5cbiAgY29uc3QgaGFuZGxlQmFja3VwRHJhZnQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBlZGdlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IHsgZ2V0Vmlld3BvcnQgfSA9IHJlYWN0Zmxvd1xuICAgIGNvbnN0IHtcbiAgICAgIGJhY2t1cERyYWZ0LFxuICAgICAgc2V0QmFja3VwRHJhZnQsXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3QgeyBmZWF0dXJlcyB9ID0gZmVhdHVyZXNTdG9yZSEuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKCFiYWNrdXBEcmFmdCkge1xuICAgICAgc2V0QmFja3VwRHJhZnQoe1xuICAgICAgICBub2RlczogZ2V0Tm9kZXMoKSxcbiAgICAgICAgZWRnZXMsXG4gICAgICAgIHZpZXdwb3J0OiBnZXRWaWV3cG9ydCgpLFxuICAgICAgICBmZWF0dXJlcyxcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXMsXG4gICAgICB9KVxuICAgICAgZG9TeW5jV29ya2Zsb3dEcmFmdCgpXG4gICAgfVxuICB9LCBbcmVhY3RmbG93LCB3b3JrZmxvd1N0b3JlLCBzdG9yZSwgZmVhdHVyZXNTdG9yZSwgZG9TeW5jV29ya2Zsb3dEcmFmdF0pXG5cbiAgY29uc3QgaGFuZGxlTG9hZEJhY2t1cERyYWZ0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGJhY2t1cERyYWZ0LFxuICAgICAgc2V0QmFja3VwRHJhZnQsXG4gICAgICBzZXRFbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoYmFja3VwRHJhZnQpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbm9kZXMsXG4gICAgICAgIGVkZ2VzLFxuICAgICAgICB2aWV3cG9ydCxcbiAgICAgICAgZmVhdHVyZXMsXG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgfSA9IGJhY2t1cERyYWZ0XG4gICAgICBoYW5kbGVVcGRhdGVXb3JrZmxvd0NhbnZhcyh7XG4gICAgICAgIG5vZGVzLFxuICAgICAgICBlZGdlcyxcbiAgICAgICAgdmlld3BvcnQsXG4gICAgICB9KVxuICAgICAgc2V0RW52aXJvbm1lbnRWYXJpYWJsZXMoZW52aXJvbm1lbnRWYXJpYWJsZXMpXG4gICAgICBmZWF0dXJlc1N0b3JlIS5zZXRTdGF0ZSh7IGZlYXR1cmVzIH0pXG4gICAgICBzZXRCYWNrdXBEcmFmdCh1bmRlZmluZWQpXG4gICAgfVxuICB9LCBbaGFuZGxlVXBkYXRlV29ya2Zsb3dDYW52YXMsIHdvcmtmbG93U3RvcmUsIGZlYXR1cmVzU3RvcmVdKVxuXG4gIGNvbnN0IGhhbmRsZVJ1biA9IHVzZUNhbGxiYWNrKGFzeW5jIChcbiAgICBwYXJhbXM6IGFueSxcbiAgICBjYWxsYmFjaz86IElPdGhlck9wdGlvbnMsXG4gICAgb3B0aW9ucz86IEhhbmRsZVJ1bk9wdGlvbnMsXG4gICkgPT4ge1xuICAgIGNvbnN0IHJ1bk1vZGU6IEhhbmRsZVJ1bk1vZGUgPSBvcHRpb25zPy5tb2RlID8/IFRyaWdnZXJUeXBlLlVzZXJJbnB1dFxuICAgIGNvbnN0IHJlc29sdmVkUGFyYW1zID0gcGFyYW1zID8/IHt9XG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBzZXROb2RlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5ld05vZGVzID0gcHJvZHVjZShnZXROb2RlcygpLCAoZHJhZnQ6IE5vZGVbXSkgPT4ge1xuICAgICAgZHJhZnQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBub2RlLmRhdGEuc2VsZWN0ZWQgPSBmYWxzZVxuICAgICAgICBub2RlLmRhdGEuX3J1bm5pbmdTdGF0dXMgPSB1bmRlZmluZWRcbiAgICAgIH0pXG4gICAgfSlcbiAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICBhd2FpdCBkb1N5bmNXb3JrZmxvd0RyYWZ0KClcblxuICAgIGNvbnN0IHtcbiAgICAgIG9uV29ya2Zsb3dTdGFydGVkLFxuICAgICAgb25Xb3JrZmxvd0ZpbmlzaGVkLFxuICAgICAgb25Ob2RlU3RhcnRlZCxcbiAgICAgIG9uTm9kZUZpbmlzaGVkLFxuICAgICAgb25JdGVyYXRpb25TdGFydCxcbiAgICAgIG9uSXRlcmF0aW9uTmV4dCxcbiAgICAgIG9uSXRlcmF0aW9uRmluaXNoLFxuICAgICAgb25Mb29wU3RhcnQsXG4gICAgICBvbkxvb3BOZXh0LFxuICAgICAgb25Mb29wRmluaXNoLFxuICAgICAgb25Ob2RlUmV0cnksXG4gICAgICBvbkFnZW50TG9nLFxuICAgICAgb25FcnJvcixcbiAgICAgIG9uQ29tcGxldGVkLFxuICAgICAgLi4ucmVzdENhbGxiYWNrXG4gICAgfSA9IGNhbGxiYWNrIHx8IHt9XG4gICAgd29ya2Zsb3dTdG9yZS5zZXRTdGF0ZSh7IGhpc3RvcnlXb3JrZmxvd0RhdGE6IHVuZGVmaW5lZCB9KVxuICAgIGNvbnN0IGFwcERldGFpbCA9IHVzZUFwcFN0b3JlLmdldFN0YXRlKCkuYXBwRGV0YWlsXG4gICAgY29uc3Qgd29ya2Zsb3dDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd29ya2Zsb3ctY29udGFpbmVyJylcblxuICAgIGNvbnN0IHtcbiAgICAgIGNsaWVudFdpZHRoLFxuICAgICAgY2xpZW50SGVpZ2h0LFxuICAgIH0gPSB3b3JrZmxvd0NvbnRhaW5lciFcblxuICAgIGNvbnN0IGlzSW5Xb3JrZmxvd0RlYnVnID0gYXBwRGV0YWlsPy5tb2RlID09PSBBcHBNb2RlRW51bS5XT1JLRkxPV1xuXG4gICAgbGV0IHVybCA9ICcnXG4gICAgaWYgKHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLlBsdWdpbiB8fCBydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5XZWJob29rIHx8IHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLlNjaGVkdWxlKSB7XG4gICAgICBpZiAoIWFwcERldGFpbD8uaWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignaGFuZGxlUnVuOiBtaXNzaW5nIGFwcCBpZCBmb3IgdHJpZ2dlciBwbHVnaW4gcnVuJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB1cmwgPSBgL2FwcHMvJHthcHBEZXRhaWwuaWR9L3dvcmtmbG93cy9kcmFmdC90cmlnZ2VyL3J1bmBcbiAgICB9XG4gICAgZWxzZSBpZiAocnVuTW9kZSA9PT0gVHJpZ2dlclR5cGUuQWxsKSB7XG4gICAgICBpZiAoIWFwcERldGFpbD8uaWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignaGFuZGxlUnVuOiBtaXNzaW5nIGFwcCBpZCBmb3IgdHJpZ2dlciBydW4gYWxsJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB1cmwgPSBgL2FwcHMvJHthcHBEZXRhaWwuaWR9L3dvcmtmbG93cy9kcmFmdC90cmlnZ2VyL3J1bi1hbGxgXG4gICAgfVxuICAgIGVsc2UgaWYgKGFwcERldGFpbD8ubW9kZSA9PT0gQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVCkge1xuICAgICAgdXJsID0gYC9hcHBzLyR7YXBwRGV0YWlsLmlkfS9hZHZhbmNlZC1jaGF0L3dvcmtmbG93cy9kcmFmdC9ydW5gXG4gICAgfVxuICAgIGVsc2UgaWYgKGlzSW5Xb3JrZmxvd0RlYnVnICYmIGFwcERldGFpbD8uaWQpIHtcbiAgICAgIHVybCA9IGAvYXBwcy8ke2FwcERldGFpbC5pZH0vd29ya2Zsb3dzL2RyYWZ0L3J1bmBcbiAgICB9XG5cbiAgICBsZXQgcmVxdWVzdEJvZHkgPSB7fVxuXG4gICAgaWYgKHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLlNjaGVkdWxlKVxuICAgICAgcmVxdWVzdEJvZHkgPSB7IG5vZGVfaWQ6IG9wdGlvbnM/LnNjaGVkdWxlTm9kZUlkIH1cblxuICAgIGVsc2UgaWYgKHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLldlYmhvb2spXG4gICAgICByZXF1ZXN0Qm9keSA9IHsgbm9kZV9pZDogb3B0aW9ucz8ud2ViaG9va05vZGVJZCB9XG5cbiAgICBlbHNlIGlmIChydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5QbHVnaW4pXG4gICAgICByZXF1ZXN0Qm9keSA9IHsgbm9kZV9pZDogb3B0aW9ucz8ucGx1Z2luTm9kZUlkIH1cblxuICAgIGVsc2UgaWYgKHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLkFsbClcbiAgICAgIHJlcXVlc3RCb2R5ID0geyBub2RlX2lkczogb3B0aW9ucz8uYWxsTm9kZUlkcyB9XG5cbiAgICBlbHNlXG4gICAgICByZXF1ZXN0Qm9keSA9IHJlc29sdmVkUGFyYW1zXG5cbiAgICBpZiAoIXVybClcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLlNjaGVkdWxlICYmICFvcHRpb25zPy5zY2hlZHVsZU5vZGVJZCkge1xuICAgICAgY29uc29sZS5lcnJvcignaGFuZGxlUnVuOiBzY2hlZHVsZSB0cmlnZ2VyIHJ1biByZXF1aXJlcyBub2RlIGlkJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5XZWJob29rICYmICFvcHRpb25zPy53ZWJob29rTm9kZUlkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdoYW5kbGVSdW46IHdlYmhvb2sgdHJpZ2dlciBydW4gcmVxdWlyZXMgbm9kZSBpZCcpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAocnVuTW9kZSA9PT0gVHJpZ2dlclR5cGUuUGx1Z2luICYmICFvcHRpb25zPy5wbHVnaW5Ob2RlSWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2hhbmRsZVJ1bjogcGx1Z2luIHRyaWdnZXIgcnVuIHJlcXVpcmVzIG5vZGUgaWQnKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLkFsbCAmJiAhb3B0aW9ucz8uYWxsTm9kZUlkcyAmJiBvcHRpb25zPy5hbGxOb2RlSWRzPy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2hhbmRsZVJ1bjogYWxsIHRyaWdnZXIgcnVuIHJlcXVpcmVzIG5vZGUgaWRzJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGFib3J0Q29udHJvbGxlclJlZi5jdXJyZW50Py5hYm9ydCgpXG4gICAgYWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBudWxsXG5cbiAgICBjb25zdCB7XG4gICAgICBzZXRXb3JrZmxvd1J1bm5pbmdEYXRhLFxuICAgICAgc2V0SXNMaXN0ZW5pbmcsXG4gICAgICBzZXRTaG93VmFyaWFibGVJbnNwZWN0UGFuZWwsXG4gICAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyVHlwZSxcbiAgICAgIHNldExpc3RlbmluZ1RyaWdnZXJOb2RlSWRzLFxuICAgICAgc2V0TGlzdGVuaW5nVHJpZ2dlcklzQWxsLFxuICAgICAgc2V0TGlzdGVuaW5nVHJpZ2dlck5vZGVJZCxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoXG4gICAgICBydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5XZWJob29rXG4gICAgICB8fCBydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5QbHVnaW5cbiAgICAgIHx8IHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLkFsbFxuICAgICAgfHwgcnVuTW9kZSA9PT0gVHJpZ2dlclR5cGUuU2NoZWR1bGVcbiAgICApIHtcbiAgICAgIHNldElzTGlzdGVuaW5nKHRydWUpXG4gICAgICBzZXRTaG93VmFyaWFibGVJbnNwZWN0UGFuZWwodHJ1ZSlcbiAgICAgIHNldExpc3RlbmluZ1RyaWdnZXJJc0FsbChydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5BbGwpXG4gICAgICBpZiAocnVuTW9kZSA9PT0gVHJpZ2dlclR5cGUuQWxsKVxuICAgICAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkcyhvcHRpb25zPy5hbGxOb2RlSWRzID8/IFtdKVxuICAgICAgZWxzZSBpZiAocnVuTW9kZSA9PT0gVHJpZ2dlclR5cGUuV2ViaG9vayAmJiBvcHRpb25zPy53ZWJob29rTm9kZUlkKVxuICAgICAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkcyhbb3B0aW9ucy53ZWJob29rTm9kZUlkXSlcbiAgICAgIGVsc2UgaWYgKHJ1bk1vZGUgPT09IFRyaWdnZXJUeXBlLlNjaGVkdWxlICYmIG9wdGlvbnM/LnNjaGVkdWxlTm9kZUlkKVxuICAgICAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkcyhbb3B0aW9ucy5zY2hlZHVsZU5vZGVJZF0pXG4gICAgICBlbHNlIGlmIChydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5QbHVnaW4gJiYgb3B0aW9ucz8ucGx1Z2luTm9kZUlkKVxuICAgICAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkcyhbb3B0aW9ucy5wbHVnaW5Ob2RlSWRdKVxuICAgICAgZWxzZVxuICAgICAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkcyhbXSlcbiAgICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgICAgIGlucHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgIHByb2Nlc3NfZGF0YV90cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgIG91dHB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgdHJhY2luZzogW10sXG4gICAgICAgIHJlc3VsdFRleHQ6ICcnLFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzZXRJc0xpc3RlbmluZyhmYWxzZSlcbiAgICAgIHNldExpc3RlbmluZ1RyaWdnZXJUeXBlKG51bGwpXG4gICAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkKG51bGwpXG4gICAgICBzZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkcyhbXSlcbiAgICAgIHNldExpc3RlbmluZ1RyaWdnZXJJc0FsbChmYWxzZSlcbiAgICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgICAgIGlucHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgIHByb2Nlc3NfZGF0YV90cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgIG91dHB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgdHJhY2luZzogW10sXG4gICAgICAgIHJlc3VsdFRleHQ6ICcnLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgdHRzVXJsID0gJydcbiAgICBsZXQgdHRzSXNQdWJsaWMgPSBmYWxzZVxuICAgIGlmIChyZXNvbHZlZFBhcmFtcy50b2tlbikge1xuICAgICAgdHRzVXJsID0gJy90ZXh0LXRvLWF1ZGlvJ1xuICAgICAgdHRzSXNQdWJsaWMgPSB0cnVlXG4gICAgfVxuICAgIGVsc2UgaWYgKHJlc29sdmVkUGFyYW1zLmFwcElkKSB7XG4gICAgICBpZiAocGF0aG5hbWUuc2VhcmNoKCdleHBsb3JlL2luc3RhbGxlZCcpID4gLTEpXG4gICAgICAgIHR0c1VybCA9IGAvaW5zdGFsbGVkLWFwcHMvJHtyZXNvbHZlZFBhcmFtcy5hcHBJZH0vdGV4dC10by1hdWRpb2BcbiAgICAgIGVsc2VcbiAgICAgICAgdHRzVXJsID0gYC9hcHBzLyR7cmVzb2x2ZWRQYXJhbXMuYXBwSWR9L3RleHQtdG8tYXVkaW9gXG4gICAgfVxuICAgIC8vIExhenkgaW5pdGlhbGl6YXRpb246IE9ubHkgY3JlYXRlIEF1ZGlvUGxheWVyIHdoZW4gVFRTIGlzIGFjdHVhbGx5IG5lZWRlZFxuICAgIC8vIFRoaXMgcHJldmVudHMgb3BlbmluZyBhdWRpbyBjaGFubmVsIHVubmVjZXNzYXJpbHlcbiAgICBsZXQgcGxheWVyOiBBdWRpb1BsYXllciB8IG51bGwgPSBudWxsXG4gICAgY29uc3QgZ2V0T3JDcmVhdGVQbGF5ZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoIXBsYXllcilcbiAgICAgICAgcGxheWVyID0gQXVkaW9QbGF5ZXJNYW5hZ2VyLmdldEluc3RhbmNlKCkuZ2V0QXVkaW9QbGF5ZXIodHRzVXJsLCB0dHNJc1B1YmxpYywgdXVpZFY0KCksICdub25lJywgJ25vbmUnLCBub29wKVxuXG4gICAgICByZXR1cm4gcGxheWVyXG4gICAgfVxuXG4gICAgY29uc3QgY2xlYXJBYm9ydENvbnRyb2xsZXIgPSAoKSA9PiB7XG4gICAgICBhYm9ydENvbnRyb2xsZXJSZWYuY3VycmVudCA9IG51bGxcbiAgICAgIGRlbGV0ZSAod2luZG93IGFzIGFueSkuX193ZWJob29rRGVidWdBYm9ydENvbnRyb2xsZXJcbiAgICAgIGRlbGV0ZSAod2luZG93IGFzIGFueSkuX19wbHVnaW5EZWJ1Z0Fib3J0Q29udHJvbGxlclxuICAgICAgZGVsZXRlICh3aW5kb3cgYXMgYW55KS5fX3NjaGVkdWxlRGVidWdBYm9ydENvbnRyb2xsZXJcbiAgICAgIGRlbGV0ZSAod2luZG93IGFzIGFueSkuX19hbGxUcmlnZ2Vyc0RlYnVnQWJvcnRDb250cm9sbGVyXG4gICAgfVxuXG4gICAgY29uc3QgY2xlYXJMaXN0ZW5pbmdTdGF0ZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBzdGF0ZS5zZXRJc0xpc3RlbmluZyhmYWxzZSlcbiAgICAgIHN0YXRlLnNldExpc3RlbmluZ1RyaWdnZXJUeXBlKG51bGwpXG4gICAgICBzdGF0ZS5zZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkKG51bGwpXG4gICAgICBzdGF0ZS5zZXRMaXN0ZW5pbmdUcmlnZ2VyTm9kZUlkcyhbXSlcbiAgICAgIHN0YXRlLnNldExpc3RlbmluZ1RyaWdnZXJJc0FsbChmYWxzZSlcbiAgICB9XG5cbiAgICBjb25zdCB3cmFwcGVkT25FcnJvciA9IChwYXJhbXM6IGFueSkgPT4ge1xuICAgICAgY2xlYXJBYm9ydENvbnRyb2xsZXIoKVxuICAgICAgaGFuZGxlV29ya2Zsb3dGYWlsZWQoKVxuICAgICAgY2xlYXJMaXN0ZW5pbmdTdGF0ZSgpXG5cbiAgICAgIGlmIChvbkVycm9yKVxuICAgICAgICBvbkVycm9yKHBhcmFtcylcbiAgICAgIHRyYWNrRXZlbnQoJ3dvcmtmbG93X3J1bl9mYWlsZWQnLCB7IHdvcmtmbG93X2lkOiBmbG93SWQsIHJlYXNvbjogcGFyYW1zLmVycm9yLCBub2RlX3R5cGU6IHBhcmFtcy5ub2RlX3R5cGUgfSlcbiAgICB9XG5cbiAgICBjb25zdCB3cmFwcGVkT25Db21wbGV0ZWQ6IElPdGhlck9wdGlvbnNbJ29uQ29tcGxldGVkJ10gPSBhc3luYyAoaGFzRXJyb3I/OiBib29sZWFuLCBlcnJvck1lc3NhZ2U/OiBzdHJpbmcpID0+IHtcbiAgICAgIGNsZWFyQWJvcnRDb250cm9sbGVyKClcbiAgICAgIGNsZWFyTGlzdGVuaW5nU3RhdGUoKVxuICAgICAgaWYgKG9uQ29tcGxldGVkKVxuICAgICAgICBvbkNvbXBsZXRlZChoYXNFcnJvciwgZXJyb3JNZXNzYWdlKVxuICAgIH1cblxuICAgIGNvbnN0IGJhc2VTc2VPcHRpb25zOiBJT3RoZXJPcHRpb25zID0ge1xuICAgICAgLi4ucmVzdENhbGxiYWNrLFxuICAgICAgb25Xb3JrZmxvd1N0YXJ0ZWQ6IChwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICAgICAgaWYgKHN0YXRlLndvcmtmbG93UnVubmluZ0RhdGEpIHtcbiAgICAgICAgICBzdGF0ZS5zZXRXb3JrZmxvd1J1bm5pbmdEYXRhKHByb2R1Y2Uoc3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICBkcmFmdC5yZXN1bHRUZXh0ID0gJydcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVXb3JrZmxvd1N0YXJ0ZWQocGFyYW1zKVxuXG4gICAgICAgIGlmIChvbldvcmtmbG93U3RhcnRlZClcbiAgICAgICAgICBvbldvcmtmbG93U3RhcnRlZChwYXJhbXMpXG4gICAgICB9LFxuICAgICAgb25Xb3JrZmxvd0ZpbmlzaGVkOiAocGFyYW1zKSA9PiB7XG4gICAgICAgIGNsZWFyTGlzdGVuaW5nU3RhdGUoKVxuICAgICAgICBoYW5kbGVXb3JrZmxvd0ZpbmlzaGVkKHBhcmFtcylcblxuICAgICAgICBpZiAob25Xb3JrZmxvd0ZpbmlzaGVkKVxuICAgICAgICAgIG9uV29ya2Zsb3dGaW5pc2hlZChwYXJhbXMpXG4gICAgICAgIGlmIChpc0luV29ya2Zsb3dEZWJ1Zykge1xuICAgICAgICAgIGZldGNoSW5zcGVjdFZhcnMoe30pXG4gICAgICAgICAgaW52YWxpZEFsbExhc3RSdW4oKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25Ob2RlU3RhcnRlZDogKHBhcmFtcykgPT4ge1xuICAgICAgICBoYW5kbGVXb3JrZmxvd05vZGVTdGFydGVkKFxuICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGNsaWVudEhlaWdodCxcbiAgICAgICAgICB9LFxuICAgICAgICApXG5cbiAgICAgICAgaWYgKG9uTm9kZVN0YXJ0ZWQpXG4gICAgICAgICAgb25Ob2RlU3RhcnRlZChwYXJhbXMpXG4gICAgICB9LFxuICAgICAgb25Ob2RlRmluaXNoZWQ6IChwYXJhbXMpID0+IHtcbiAgICAgICAgaGFuZGxlV29ya2Zsb3dOb2RlRmluaXNoZWQocGFyYW1zKVxuXG4gICAgICAgIGlmIChvbk5vZGVGaW5pc2hlZClcbiAgICAgICAgICBvbk5vZGVGaW5pc2hlZChwYXJhbXMpXG4gICAgICB9LFxuICAgICAgb25JdGVyYXRpb25TdGFydDogKHBhcmFtcykgPT4ge1xuICAgICAgICBoYW5kbGVXb3JrZmxvd05vZGVJdGVyYXRpb25TdGFydGVkKFxuICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGNsaWVudEhlaWdodCxcbiAgICAgICAgICB9LFxuICAgICAgICApXG5cbiAgICAgICAgaWYgKG9uSXRlcmF0aW9uU3RhcnQpXG4gICAgICAgICAgb25JdGVyYXRpb25TdGFydChwYXJhbXMpXG4gICAgICB9LFxuICAgICAgb25JdGVyYXRpb25OZXh0OiAocGFyYW1zKSA9PiB7XG4gICAgICAgIGhhbmRsZVdvcmtmbG93Tm9kZUl0ZXJhdGlvbk5leHQocGFyYW1zKVxuXG4gICAgICAgIGlmIChvbkl0ZXJhdGlvbk5leHQpXG4gICAgICAgICAgb25JdGVyYXRpb25OZXh0KHBhcmFtcylcbiAgICAgIH0sXG4gICAgICBvbkl0ZXJhdGlvbkZpbmlzaDogKHBhcmFtcykgPT4ge1xuICAgICAgICBoYW5kbGVXb3JrZmxvd05vZGVJdGVyYXRpb25GaW5pc2hlZChwYXJhbXMpXG5cbiAgICAgICAgaWYgKG9uSXRlcmF0aW9uRmluaXNoKVxuICAgICAgICAgIG9uSXRlcmF0aW9uRmluaXNoKHBhcmFtcylcbiAgICAgIH0sXG4gICAgICBvbkxvb3BTdGFydDogKHBhcmFtcykgPT4ge1xuICAgICAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wU3RhcnRlZChcbiAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBjbGllbnRIZWlnaHQsXG4gICAgICAgICAgfSxcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChvbkxvb3BTdGFydClcbiAgICAgICAgICBvbkxvb3BTdGFydChwYXJhbXMpXG4gICAgICB9LFxuICAgICAgb25Mb29wTmV4dDogKHBhcmFtcykgPT4ge1xuICAgICAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wTmV4dChwYXJhbXMpXG5cbiAgICAgICAgaWYgKG9uTG9vcE5leHQpXG4gICAgICAgICAgb25Mb29wTmV4dChwYXJhbXMpXG4gICAgICB9LFxuICAgICAgb25Mb29wRmluaXNoOiAocGFyYW1zKSA9PiB7XG4gICAgICAgIGhhbmRsZVdvcmtmbG93Tm9kZUxvb3BGaW5pc2hlZChwYXJhbXMpXG5cbiAgICAgICAgaWYgKG9uTG9vcEZpbmlzaClcbiAgICAgICAgICBvbkxvb3BGaW5pc2gocGFyYW1zKVxuICAgICAgfSxcbiAgICAgIG9uTm9kZVJldHJ5OiAocGFyYW1zKSA9PiB7XG4gICAgICAgIGhhbmRsZVdvcmtmbG93Tm9kZVJldHJ5KHBhcmFtcylcblxuICAgICAgICBpZiAob25Ob2RlUmV0cnkpXG4gICAgICAgICAgb25Ob2RlUmV0cnkocGFyYW1zKVxuICAgICAgfSxcbiAgICAgIG9uQWdlbnRMb2c6IChwYXJhbXMpID0+IHtcbiAgICAgICAgaGFuZGxlV29ya2Zsb3dBZ2VudExvZyhwYXJhbXMpXG5cbiAgICAgICAgaWYgKG9uQWdlbnRMb2cpXG4gICAgICAgICAgb25BZ2VudExvZyhwYXJhbXMpXG4gICAgICB9LFxuICAgICAgb25UZXh0Q2h1bms6IChwYXJhbXMpID0+IHtcbiAgICAgICAgaGFuZGxlV29ya2Zsb3dUZXh0Q2h1bmsocGFyYW1zKVxuICAgICAgfSxcbiAgICAgIG9uVGV4dFJlcGxhY2U6IChwYXJhbXMpID0+IHtcbiAgICAgICAgaGFuZGxlV29ya2Zsb3dUZXh0UmVwbGFjZShwYXJhbXMpXG4gICAgICB9LFxuICAgICAgb25UVFNDaHVuazogKG1lc3NhZ2VJZDogc3RyaW5nLCBhdWRpbzogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICghYXVkaW8gfHwgYXVkaW8gPT09ICcnKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICBjb25zdCBhdWRpb1BsYXllciA9IGdldE9yQ3JlYXRlUGxheWVyKClcbiAgICAgICAgaWYgKGF1ZGlvUGxheWVyKSB7XG4gICAgICAgICAgYXVkaW9QbGF5ZXIucGxheUF1ZGlvV2l0aEF1ZGlvKGF1ZGlvLCB0cnVlKVxuICAgICAgICAgIEF1ZGlvUGxheWVyTWFuYWdlci5nZXRJbnN0YW5jZSgpLnJlc2V0TXNnSWQobWVzc2FnZUlkKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25UVFNFbmQ6IChtZXNzYWdlSWQ6IHN0cmluZywgYXVkaW86IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBhdWRpb1BsYXllciA9IGdldE9yQ3JlYXRlUGxheWVyKClcbiAgICAgICAgaWYgKGF1ZGlvUGxheWVyKVxuICAgICAgICAgIGF1ZGlvUGxheWVyLnBsYXlBdWRpb1dpdGhBdWRpbyhhdWRpbywgZmFsc2UpXG4gICAgICB9LFxuICAgICAgb25FcnJvcjogd3JhcHBlZE9uRXJyb3IsXG4gICAgICBvbkNvbXBsZXRlZDogd3JhcHBlZE9uQ29tcGxldGVkLFxuICAgIH1cblxuICAgIGNvbnN0IHdhaXRXaXRoQWJvcnQgPSAoc2lnbmFsOiBBYm9ydFNpZ25hbCwgZGVsYXk6IG51bWJlcikgPT4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpXG4gICAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcilcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9LCB7IG9uY2U6IHRydWUgfSlcbiAgICB9KVxuXG4gICAgY29uc3QgcnVuVHJpZ2dlckRlYnVnID0gYXN5bmMgKGRlYnVnVHlwZTogRGVidWdnYWJsZVRyaWdnZXJUeXBlKSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpXG4gICAgICBhYm9ydENvbnRyb2xsZXJSZWYuY3VycmVudCA9IGNvbnRyb2xsZXJcblxuICAgICAgY29uc3QgY29udHJvbGxlcktleSA9IGNvbnRyb2xsZXJLZXlNYXBbZGVidWdUeXBlXVxuXG4gICAgICAgIDsgKHdpbmRvdyBhcyBhbnkpW2NvbnRyb2xsZXJLZXldID0gY29udHJvbGxlclxuXG4gICAgICBjb25zdCBkZWJ1Z0xhYmVsID0gZGVidWdMYWJlbE1hcFtkZWJ1Z1R5cGVdXG5cbiAgICAgIGNvbnN0IHBvbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBwb3N0PFJlc3BvbnNlPih1cmwsIHtcbiAgICAgICAgICAgIGJvZHk6IHJlcXVlc3RCb2R5LFxuICAgICAgICAgICAgc2lnbmFsOiBjb250cm9sbGVyLnNpZ25hbCxcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuZWVkQWxsUmVzcG9uc2VDb250ZW50OiB0cnVlLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpZiAoY29udHJvbGxlci5zaWduYWwuYWJvcnRlZClcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGAke2RlYnVnTGFiZWx9IGRlYnVnIHJlcXVlc3QgZmFpbGVkYFxuICAgICAgICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZSB9KVxuICAgICAgICAgICAgY2xlYXJBYm9ydENvbnRyb2xsZXIoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgfHwgJydcblxuICAgICAgICAgIGlmIChjb250ZW50VHlwZS5pbmNsdWRlcyhDb250ZW50VHlwZS5qc29uKSkge1xuICAgICAgICAgICAgbGV0IGRhdGE6IGFueSA9IG51bGxcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgaGFuZGxlUnVuOiAke2RlYnVnTGFiZWwudG9Mb3dlckNhc2UoKX0gZGVidWcgcmVzcG9uc2UgcGFyc2UgZXJyb3JgLCBqc29uRXJyb3IpXG4gICAgICAgICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGAke2RlYnVnTGFiZWx9IGRlYnVnIHJlcXVlc3QgZmFpbGVkYCB9KVxuICAgICAgICAgICAgICBjbGVhckFib3J0Q29udHJvbGxlcigpXG4gICAgICAgICAgICAgIGNsZWFyTGlzdGVuaW5nU3RhdGUoKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXIuc2lnbmFsLmFib3J0ZWQpXG4gICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiAoZGF0YT8uc3RhdHVzID09PSAnd2FpdGluZycpIHtcbiAgICAgICAgICAgICAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZGF0YS5yZXRyeV9pbikgfHwgMjAwMFxuICAgICAgICAgICAgICBhd2FpdCB3YWl0V2l0aEFib3J0KGNvbnRyb2xsZXIuc2lnbmFsLCBkZWxheSlcbiAgICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXIuc2lnbmFsLmFib3J0ZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgIGF3YWl0IHBvbGwoKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZGF0YT8ubWVzc2FnZSB8fCBgJHtkZWJ1Z0xhYmVsfSBkZWJ1ZyBmYWlsZWRgXG4gICAgICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBlcnJvck1lc3NhZ2UgfSlcbiAgICAgICAgICAgIGNsZWFyQWJvcnRDb250cm9sbGVyKClcbiAgICAgICAgICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5GYWlsZWQsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgICAgICAgICBpbnB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwcm9jZXNzX2RhdGFfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvdXRwdXRzX3RydW5jYXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHRyYWNpbmc6IFtdLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNsZWFyTGlzdGVuaW5nU3RhdGUoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2xlYXJMaXN0ZW5pbmdTdGF0ZSgpXG4gICAgICAgICAgaGFuZGxlU3RyZWFtKFxuICAgICAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgICAgICBiYXNlU3NlT3B0aW9ucy5vbkRhdGEgPz8gbm9vcCxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uQ29tcGxldGVkLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25UaG91Z2h0LFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25NZXNzYWdlRW5kLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25NZXNzYWdlUmVwbGFjZSxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uRmlsZSxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uV29ya2Zsb3dTdGFydGVkLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25Xb3JrZmxvd0ZpbmlzaGVkLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25Ob2RlU3RhcnRlZCxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uTm9kZUZpbmlzaGVkLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25JdGVyYXRpb25TdGFydCxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uSXRlcmF0aW9uTmV4dCxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uSXRlcmF0aW9uRmluaXNoLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25Mb29wU3RhcnQsXG4gICAgICAgICAgICBiYXNlU3NlT3B0aW9ucy5vbkxvb3BOZXh0LFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25Mb29wRmluaXNoLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25Ob2RlUmV0cnksXG4gICAgICAgICAgICBiYXNlU3NlT3B0aW9ucy5vblBhcmFsbGVsQnJhbmNoU3RhcnRlZCxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uUGFyYWxsZWxCcmFuY2hGaW5pc2hlZCxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uVGV4dENodW5rLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25UVFNDaHVuayxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uVFRTRW5kLFxuICAgICAgICAgICAgYmFzZVNzZU9wdGlvbnMub25UZXh0UmVwbGFjZSxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uQWdlbnRMb2csXG4gICAgICAgICAgICBiYXNlU3NlT3B0aW9ucy5vbkRhdGFTb3VyY2VOb2RlUHJvY2Vzc2luZyxcbiAgICAgICAgICAgIGJhc2VTc2VPcHRpb25zLm9uRGF0YVNvdXJjZU5vZGVDb21wbGV0ZWQsXG4gICAgICAgICAgICBiYXNlU3NlT3B0aW9ucy5vbkRhdGFTb3VyY2VOb2RlRXJyb3IsXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGlmIChjb250cm9sbGVyLnNpZ25hbC5hYm9ydGVkKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBlcnJvci5jbG9uZSgpLmpzb24oKSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICAgICAgICAgICBjb25zdCB7IGVycm9yOiByZXNwRXJyb3IgfSA9IGRhdGEgfHwge31cbiAgICAgICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHJlc3BFcnJvciB9KVxuICAgICAgICAgICAgY2xlYXJBYm9ydENvbnRyb2xsZXIoKVxuICAgICAgICAgICAgc2V0V29ya2Zsb3dSdW5uaW5nRGF0YSh7XG4gICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgIHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLkZhaWxlZCxcbiAgICAgICAgICAgICAgICBlcnJvcjogcmVzcEVycm9yLFxuICAgICAgICAgICAgICAgIGlucHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHByb2Nlc3NfZGF0YV90cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG91dHB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgdHJhY2luZzogW10sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBjbGVhckxpc3RlbmluZ1N0YXRlKClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhd2FpdCBwb2xsKClcbiAgICB9XG5cbiAgICBpZiAocnVuTW9kZSA9PT0gVHJpZ2dlclR5cGUuU2NoZWR1bGUpIHtcbiAgICAgIGF3YWl0IHJ1blRyaWdnZXJEZWJ1ZyhUcmlnZ2VyVHlwZS5TY2hlZHVsZSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5XZWJob29rKSB7XG4gICAgICBhd2FpdCBydW5UcmlnZ2VyRGVidWcoVHJpZ2dlclR5cGUuV2ViaG9vaylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChydW5Nb2RlID09PSBUcmlnZ2VyVHlwZS5QbHVnaW4pIHtcbiAgICAgIGF3YWl0IHJ1blRyaWdnZXJEZWJ1ZyhUcmlnZ2VyVHlwZS5QbHVnaW4pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAocnVuTW9kZSA9PT0gVHJpZ2dlclR5cGUuQWxsKSB7XG4gICAgICBhd2FpdCBydW5UcmlnZ2VyRGVidWcoVHJpZ2dlclR5cGUuQWxsKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc3NlUG9zdChcbiAgICAgIHVybCxcbiAgICAgIHtcbiAgICAgICAgYm9keTogcmVxdWVzdEJvZHksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAuLi5iYXNlU3NlT3B0aW9ucyxcbiAgICAgICAgZ2V0QWJvcnRDb250cm9sbGVyOiAoY29udHJvbGxlcjogQWJvcnRDb250cm9sbGVyKSA9PiB7XG4gICAgICAgICAgYWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBjb250cm9sbGVyXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIClcbiAgfSwgW3N0b3JlLCBkb1N5bmNXb3JrZmxvd0RyYWZ0LCB3b3JrZmxvd1N0b3JlLCBwYXRobmFtZSwgaGFuZGxlV29ya2Zsb3dTdGFydGVkLCBoYW5kbGVXb3JrZmxvd0ZpbmlzaGVkLCBmZXRjaEluc3BlY3RWYXJzLCBpbnZhbGlkQWxsTGFzdFJ1biwgaGFuZGxlV29ya2Zsb3dGYWlsZWQsIGhhbmRsZVdvcmtmbG93Tm9kZVN0YXJ0ZWQsIGhhbmRsZVdvcmtmbG93Tm9kZUZpbmlzaGVkLCBoYW5kbGVXb3JrZmxvd05vZGVJdGVyYXRpb25TdGFydGVkLCBoYW5kbGVXb3JrZmxvd05vZGVJdGVyYXRpb25OZXh0LCBoYW5kbGVXb3JrZmxvd05vZGVJdGVyYXRpb25GaW5pc2hlZCwgaGFuZGxlV29ya2Zsb3dOb2RlTG9vcFN0YXJ0ZWQsIGhhbmRsZVdvcmtmbG93Tm9kZUxvb3BOZXh0LCBoYW5kbGVXb3JrZmxvd05vZGVMb29wRmluaXNoZWQsIGhhbmRsZVdvcmtmbG93Tm9kZVJldHJ5LCBoYW5kbGVXb3JrZmxvd0FnZW50TG9nLCBoYW5kbGVXb3JrZmxvd1RleHRDaHVuaywgaGFuZGxlV29ya2Zsb3dUZXh0UmVwbGFjZV0pXG5cbiAgY29uc3QgaGFuZGxlU3RvcFJ1biA9IHVzZUNhbGxiYWNrKCh0YXNrSWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHNldFN0b3BwZWRTdGF0ZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgc2V0V29ya2Zsb3dSdW5uaW5nRGF0YSxcbiAgICAgICAgc2V0SXNMaXN0ZW5pbmcsXG4gICAgICAgIHNldFNob3dWYXJpYWJsZUluc3BlY3RQYW5lbCxcbiAgICAgICAgc2V0TGlzdGVuaW5nVHJpZ2dlclR5cGUsXG4gICAgICAgIHNldExpc3RlbmluZ1RyaWdnZXJOb2RlSWQsXG4gICAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdG9wcGVkLFxuICAgICAgICAgIGlucHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgIHByb2Nlc3NfZGF0YV90cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgIG91dHB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgdHJhY2luZzogW10sXG4gICAgICAgIHJlc3VsdFRleHQ6ICcnLFxuICAgICAgfSlcbiAgICAgIHNldElzTGlzdGVuaW5nKGZhbHNlKVxuICAgICAgc2V0TGlzdGVuaW5nVHJpZ2dlclR5cGUobnVsbClcbiAgICAgIHNldExpc3RlbmluZ1RyaWdnZXJOb2RlSWQobnVsbClcbiAgICAgIHNldFNob3dWYXJpYWJsZUluc3BlY3RQYW5lbCh0cnVlKVxuICAgIH1cblxuICAgIGlmICh0YXNrSWQpIHtcbiAgICAgIGNvbnN0IGFwcElkID0gdXNlQXBwU3RvcmUuZ2V0U3RhdGUoKS5hcHBEZXRhaWw/LmlkXG4gICAgICBzdG9wV29ya2Zsb3dSdW4oYC9hcHBzLyR7YXBwSWR9L3dvcmtmbG93LXJ1bnMvdGFza3MvJHt0YXNrSWR9L3N0b3BgKVxuICAgICAgc2V0U3RvcHBlZFN0YXRlKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFRyeSB3ZWJob29rIGRlYnVnIGNvbnRyb2xsZXIgZnJvbSBnbG9iYWwgdmFyaWFibGUgZmlyc3RcbiAgICBjb25zdCB3ZWJob29rQ29udHJvbGxlciA9ICh3aW5kb3cgYXMgYW55KS5fX3dlYmhvb2tEZWJ1Z0Fib3J0Q29udHJvbGxlclxuICAgIGlmICh3ZWJob29rQ29udHJvbGxlcilcbiAgICAgIHdlYmhvb2tDb250cm9sbGVyLmFib3J0KClcblxuICAgIGNvbnN0IHBsdWdpbkNvbnRyb2xsZXIgPSAod2luZG93IGFzIGFueSkuX19wbHVnaW5EZWJ1Z0Fib3J0Q29udHJvbGxlclxuICAgIGlmIChwbHVnaW5Db250cm9sbGVyKVxuICAgICAgcGx1Z2luQ29udHJvbGxlci5hYm9ydCgpXG5cbiAgICBjb25zdCBzY2hlZHVsZUNvbnRyb2xsZXIgPSAod2luZG93IGFzIGFueSkuX19zY2hlZHVsZURlYnVnQWJvcnRDb250cm9sbGVyXG4gICAgaWYgKHNjaGVkdWxlQ29udHJvbGxlcilcbiAgICAgIHNjaGVkdWxlQ29udHJvbGxlci5hYm9ydCgpXG5cbiAgICBjb25zdCBhbGxUcmlnZ2VyQ29udHJvbGxlciA9ICh3aW5kb3cgYXMgYW55KS5fX2FsbFRyaWdnZXJzRGVidWdBYm9ydENvbnRyb2xsZXJcbiAgICBpZiAoYWxsVHJpZ2dlckNvbnRyb2xsZXIpXG4gICAgICBhbGxUcmlnZ2VyQ29udHJvbGxlci5hYm9ydCgpXG5cbiAgICAvLyBBbHNvIHRyeSB0aGUgcmVmXG4gICAgaWYgKGFib3J0Q29udHJvbGxlclJlZi5jdXJyZW50KVxuICAgICAgYWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQuYWJvcnQoKVxuXG4gICAgYWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBudWxsXG4gICAgc2V0U3RvcHBlZFN0YXRlKClcbiAgfSwgW3dvcmtmbG93U3RvcmVdKVxuXG4gIGNvbnN0IGhhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3cgPSB1c2VDYWxsYmFjaygocHVibGlzaGVkV29ya2Zsb3c6IFZlcnNpb25IaXN0b3J5KSA9PiB7XG4gICAgY29uc3Qgbm9kZXMgPSBwdWJsaXNoZWRXb3JrZmxvdy5ncmFwaC5ub2Rlcy5tYXAobm9kZSA9PiAoeyAuLi5ub2RlLCBzZWxlY3RlZDogZmFsc2UsIGRhdGE6IHsgLi4ubm9kZS5kYXRhLCBzZWxlY3RlZDogZmFsc2UgfSB9KSlcbiAgICBjb25zdCBlZGdlcyA9IHB1Ymxpc2hlZFdvcmtmbG93LmdyYXBoLmVkZ2VzXG4gICAgY29uc3Qgdmlld3BvcnQgPSBwdWJsaXNoZWRXb3JrZmxvdy5ncmFwaC52aWV3cG9ydCFcbiAgICBoYW5kbGVVcGRhdGVXb3JrZmxvd0NhbnZhcyh7XG4gICAgICBub2RlcyxcbiAgICAgIGVkZ2VzLFxuICAgICAgdmlld3BvcnQsXG4gICAgfSlcbiAgICBjb25zdCBtYXBwZWRGZWF0dXJlcyA9IHtcbiAgICAgIG9wZW5pbmc6IHtcbiAgICAgICAgZW5hYmxlZDogISFwdWJsaXNoZWRXb3JrZmxvdy5mZWF0dXJlcy5vcGVuaW5nX3N0YXRlbWVudCB8fCAhIXB1Ymxpc2hlZFdvcmtmbG93LmZlYXR1cmVzLnN1Z2dlc3RlZF9xdWVzdGlvbnMubGVuZ3RoLFxuICAgICAgICBvcGVuaW5nX3N0YXRlbWVudDogcHVibGlzaGVkV29ya2Zsb3cuZmVhdHVyZXMub3BlbmluZ19zdGF0ZW1lbnQsXG4gICAgICAgIHN1Z2dlc3RlZF9xdWVzdGlvbnM6IHB1Ymxpc2hlZFdvcmtmbG93LmZlYXR1cmVzLnN1Z2dlc3RlZF9xdWVzdGlvbnMsXG4gICAgICB9LFxuICAgICAgc3VnZ2VzdGVkOiBwdWJsaXNoZWRXb3JrZmxvdy5mZWF0dXJlcy5zdWdnZXN0ZWRfcXVlc3Rpb25zX2FmdGVyX2Fuc3dlcixcbiAgICAgIHRleHQyc3BlZWNoOiBwdWJsaXNoZWRXb3JrZmxvdy5mZWF0dXJlcy50ZXh0X3RvX3NwZWVjaCxcbiAgICAgIHNwZWVjaDJ0ZXh0OiBwdWJsaXNoZWRXb3JrZmxvdy5mZWF0dXJlcy5zcGVlY2hfdG9fdGV4dCxcbiAgICAgIGNpdGF0aW9uOiBwdWJsaXNoZWRXb3JrZmxvdy5mZWF0dXJlcy5yZXRyaWV2ZXJfcmVzb3VyY2UsXG4gICAgICBtb2RlcmF0aW9uOiBwdWJsaXNoZWRXb3JrZmxvdy5mZWF0dXJlcy5zZW5zaXRpdmVfd29yZF9hdm9pZGFuY2UsXG4gICAgICBmaWxlOiBwdWJsaXNoZWRXb3JrZmxvdy5mZWF0dXJlcy5maWxlX3VwbG9hZCxcbiAgICB9XG5cbiAgICBmZWF0dXJlc1N0b3JlPy5zZXRTdGF0ZSh7IGZlYXR1cmVzOiBtYXBwZWRGZWF0dXJlcyB9KVxuICAgIHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKS5zZXRFbnZpcm9ubWVudFZhcmlhYmxlcyhwdWJsaXNoZWRXb3JrZmxvdy5lbnZpcm9ubWVudF92YXJpYWJsZXMgfHwgW10pXG4gIH0sIFtmZWF0dXJlc1N0b3JlLCBoYW5kbGVVcGRhdGVXb3JrZmxvd0NhbnZhcywgd29ya2Zsb3dTdG9yZV0pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVCYWNrdXBEcmFmdCxcbiAgICBoYW5kbGVMb2FkQmFja3VwRHJhZnQsXG4gICAgaGFuZGxlUnVuLFxuICAgIGhhbmRsZVN0b3BSdW4sXG4gICAgaGFuZGxlUmVzdG9yZUZyb21QdWJsaXNoZWRXb3JrZmxvdyxcbiAgfVxufVxuIl19