"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChat = void 0;
const compat_1 = require("es-toolkit/compat");
const immer_1 = require("immer");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const utils_1 = require("@/app/components/base/chat/chat/utils");
const utils_2 = require("@/app/components/base/chat/utils");
const utils_3 = require("@/app/components/base/file-uploader/utils");
const toast_1 = require("@/app/components/base/toast");
const use_workflow_1 = require("@/service/use-workflow");
const app_1 = require("@/types/app");
const constants_1 = require("../../constants");
const hooks_1 = require("../../hooks");
const hooks_store_1 = require("../../hooks-store");
const store_1 = require("../../store");
const types_1 = require("../../types");
const useChat = (config, formSettings, prevChatTree, stopChat) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, toast_1.useToastContext)();
    const { handleRun } = (0, hooks_1.useWorkflowRun)();
    const hasStopResponded = (0, react_1.useRef)(false);
    const workflowStore = (0, store_1.useWorkflowStore)();
    const conversationId = (0, react_1.useRef)('');
    const taskIdRef = (0, react_1.useRef)('');
    const [isResponding, setIsResponding] = (0, react_1.useState)(false);
    const isRespondingRef = (0, react_1.useRef)(false);
    const configsMap = (0, hooks_store_1.useHooksStore)(s => s.configsMap);
    const invalidAllLastRun = (0, use_workflow_1.useInvalidAllLastRun)(configsMap?.flowType, configsMap?.flowId);
    const { fetchInspectVars } = (0, hooks_1.useSetWorkflowVarsWithValue)();
    const [suggestedQuestions, setSuggestQuestions] = (0, react_1.useState)([]);
    const suggestedQuestionsAbortControllerRef = (0, react_1.useRef)(null);
    const { setIterTimes, setLoopTimes, } = workflowStore.getState();
    const handleResponding = (0, react_1.useCallback)((isResponding) => {
        setIsResponding(isResponding);
        isRespondingRef.current = isResponding;
    }, []);
    const [chatTree, setChatTree] = (0, react_1.useState)(prevChatTree || []);
    const chatTreeRef = (0, react_1.useRef)(chatTree);
    const [targetMessageId, setTargetMessageId] = (0, react_1.useState)();
    const threadMessages = (0, react_1.useMemo)(() => (0, utils_2.getThreadMessages)(chatTree, targetMessageId), [chatTree, targetMessageId]);
    const getIntroduction = (0, react_1.useCallback)((str) => {
        return (0, utils_1.processOpeningStatement)(str, formSettings?.inputs || {}, formSettings?.inputsForm || []);
    }, [formSettings?.inputs, formSettings?.inputsForm]);
    /** Final chat list that will be rendered */
    const chatList = (0, react_1.useMemo)(() => {
        const ret = [...threadMessages];
        if (config?.opening_statement) {
            const index = threadMessages.findIndex(item => item.isOpeningStatement);
            if (index > -1) {
                ret[index] = {
                    ...ret[index],
                    content: getIntroduction(config.opening_statement),
                    suggestedQuestions: config.suggested_questions?.map((item) => getIntroduction(item)),
                };
            }
            else {
                ret.unshift({
                    id: `${Date.now()}`,
                    content: getIntroduction(config.opening_statement),
                    isAnswer: true,
                    isOpeningStatement: true,
                    suggestedQuestions: config.suggested_questions?.map((item) => getIntroduction(item)),
                });
            }
        }
        return ret;
    }, [threadMessages, config?.opening_statement, getIntroduction, config?.suggested_questions]);
    (0, react_1.useEffect)(() => {
        (0, immer_1.setAutoFreeze)(false);
        return () => {
            (0, immer_1.setAutoFreeze)(true);
        };
    }, []);
    /** Find the target node by bfs and then operate on it */
    const produceChatTreeNode = (0, react_1.useCallback)((targetId, operation) => {
        return (0, immer_1.produce)(chatTreeRef.current, (draft) => {
            const queue = [...draft];
            while (queue.length > 0) {
                const current = queue.shift();
                if (current.id === targetId) {
                    operation(current);
                    break;
                }
                if (current.children)
                    queue.push(...current.children);
            }
        });
    }, []);
    const handleStop = (0, react_1.useCallback)(() => {
        hasStopResponded.current = true;
        handleResponding(false);
        if (stopChat && taskIdRef.current)
            stopChat(taskIdRef.current);
        setIterTimes(constants_1.DEFAULT_ITER_TIMES);
        setLoopTimes(constants_1.DEFAULT_LOOP_TIMES);
        if (suggestedQuestionsAbortControllerRef.current)
            suggestedQuestionsAbortControllerRef.current.abort();
    }, [handleResponding, setIterTimes, setLoopTimes, stopChat]);
    const handleRestart = (0, react_1.useCallback)(() => {
        conversationId.current = '';
        taskIdRef.current = '';
        handleStop();
        setIterTimes(constants_1.DEFAULT_ITER_TIMES);
        setLoopTimes(constants_1.DEFAULT_LOOP_TIMES);
        setChatTree([]);
        setSuggestQuestions([]);
    }, [
        handleStop,
        setIterTimes,
        setLoopTimes,
    ]);
    const updateCurrentQAOnTree = (0, react_1.useCallback)(({ parentId, responseItem, placeholderQuestionId, questionItem, }) => {
        let nextState;
        const currentQA = { ...questionItem, children: [{ ...responseItem, children: [] }] };
        if (!parentId && !chatTree.some(item => [placeholderQuestionId, questionItem.id].includes(item.id))) {
            // QA whose parent is not provided is considered as a first message of the conversation,
            // and it should be a root node of the chat tree
            nextState = (0, immer_1.produce)(chatTree, (draft) => {
                draft.push(currentQA);
            });
        }
        else {
            // find the target QA in the tree and update it; if not found, insert it to its parent node
            nextState = produceChatTreeNode(parentId, (parentNode) => {
                const questionNodeIndex = parentNode.children.findIndex(item => [placeholderQuestionId, questionItem.id].includes(item.id));
                if (questionNodeIndex === -1)
                    parentNode.children.push(currentQA);
                else
                    parentNode.children[questionNodeIndex] = currentQA;
            });
        }
        setChatTree(nextState);
        chatTreeRef.current = nextState;
    }, [chatTree, produceChatTreeNode]);
    const handleSend = (0, react_1.useCallback)((params, { onGetSuggestedQuestions, }) => {
        if (isRespondingRef.current) {
            notify({ type: 'info', message: t('errorMessage.waitForResponse', { ns: 'appDebug' }) });
            return false;
        }
        const parentMessage = threadMessages.find(item => item.id === params.parent_message_id);
        const placeholderQuestionId = `question-${Date.now()}`;
        const questionItem = {
            id: placeholderQuestionId,
            content: params.query,
            isAnswer: false,
            message_files: params.files,
            parentMessageId: params.parent_message_id,
        };
        const placeholderAnswerId = `answer-placeholder-${Date.now()}`;
        const placeholderAnswerItem = {
            id: placeholderAnswerId,
            content: '',
            isAnswer: true,
            parentMessageId: questionItem.id,
            siblingIndex: parentMessage?.children?.length ?? chatTree.length,
        };
        setTargetMessageId(parentMessage?.id);
        updateCurrentQAOnTree({
            parentId: params.parent_message_id,
            responseItem: placeholderAnswerItem,
            placeholderQuestionId,
            questionItem,
        });
        // answer
        const responseItem = {
            id: placeholderAnswerId,
            content: '',
            agent_thoughts: [],
            message_files: [],
            isAnswer: true,
            parentMessageId: questionItem.id,
            siblingIndex: parentMessage?.children?.length ?? chatTree.length,
        };
        handleResponding(true);
        const { files, inputs, ...restParams } = params;
        const bodyParams = {
            files: (0, utils_3.getProcessedFiles)(files || []),
            inputs: (0, utils_1.getProcessedInputs)(inputs || {}, formSettings?.inputsForm || []),
            ...restParams,
        };
        if (bodyParams?.files?.length) {
            bodyParams.files = bodyParams.files.map((item) => {
                if (item.transfer_method === app_1.TransferMethod.local_file) {
                    return {
                        ...item,
                        url: '',
                    };
                }
                return item;
            });
        }
        let hasSetResponseId = false;
        handleRun(bodyParams, {
            onData: (message, isFirstMessage, { conversationId: newConversationId, messageId, taskId }) => {
                responseItem.content = responseItem.content + message;
                if (messageId && !hasSetResponseId) {
                    questionItem.id = `question-${messageId}`;
                    responseItem.id = messageId;
                    responseItem.parentMessageId = questionItem.id;
                    hasSetResponseId = true;
                }
                if (isFirstMessage && newConversationId)
                    conversationId.current = newConversationId;
                taskIdRef.current = taskId;
                if (messageId)
                    responseItem.id = messageId;
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: params.parent_message_id,
                });
            },
            async onCompleted(hasError, errorMessage) {
                handleResponding(false);
                fetchInspectVars({});
                invalidAllLastRun();
                if (hasError) {
                    if (errorMessage) {
                        responseItem.content = errorMessage;
                        responseItem.isError = true;
                        updateCurrentQAOnTree({
                            placeholderQuestionId,
                            questionItem,
                            responseItem,
                            parentId: params.parent_message_id,
                        });
                    }
                    return;
                }
                if (config?.suggested_questions_after_answer?.enabled && !hasStopResponded.current && onGetSuggestedQuestions) {
                    try {
                        const { data } = await onGetSuggestedQuestions(responseItem.id, newAbortController => suggestedQuestionsAbortControllerRef.current = newAbortController);
                        setSuggestQuestions(data);
                    }
                    // eslint-disable-next-line unused-imports/no-unused-vars
                    catch (error) {
                        setSuggestQuestions([]);
                    }
                }
            },
            onMessageEnd: (messageEnd) => {
                responseItem.citation = messageEnd.metadata?.retriever_resources || [];
                const processedFilesFromResponse = (0, utils_3.getProcessedFilesFromResponse)(messageEnd.files || []);
                responseItem.allFiles = (0, compat_1.uniqBy)([...(responseItem.allFiles || []), ...(processedFilesFromResponse || [])], 'id');
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: params.parent_message_id,
                });
            },
            onMessageReplace: (messageReplace) => {
                responseItem.content = messageReplace.answer;
            },
            onError() {
                handleResponding(false);
            },
            onWorkflowStarted: ({ workflow_run_id, task_id }) => {
                taskIdRef.current = task_id;
                responseItem.workflow_run_id = workflow_run_id;
                responseItem.workflowProcess = {
                    status: types_1.WorkflowRunningStatus.Running,
                    tracing: [],
                };
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: params.parent_message_id,
                });
            },
            onWorkflowFinished: ({ data }) => {
                responseItem.workflowProcess.status = data.status;
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: params.parent_message_id,
                });
            },
            onIterationStart: ({ data }) => {
                responseItem.workflowProcess.tracing.push({
                    ...data,
                    status: types_1.NodeRunningStatus.Running,
                });
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: params.parent_message_id,
                });
            },
            onIterationFinish: ({ data }) => {
                const currentTracingIndex = responseItem.workflowProcess.tracing.findIndex(item => item.id === data.id);
                if (currentTracingIndex > -1) {
                    responseItem.workflowProcess.tracing[currentTracingIndex] = {
                        ...responseItem.workflowProcess.tracing[currentTracingIndex],
                        ...data,
                    };
                    updateCurrentQAOnTree({
                        placeholderQuestionId,
                        questionItem,
                        responseItem,
                        parentId: params.parent_message_id,
                    });
                }
            },
            onLoopStart: ({ data }) => {
                responseItem.workflowProcess.tracing.push({
                    ...data,
                    status: types_1.NodeRunningStatus.Running,
                });
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: params.parent_message_id,
                });
            },
            onLoopFinish: ({ data }) => {
                const currentTracingIndex = responseItem.workflowProcess.tracing.findIndex(item => item.id === data.id);
                if (currentTracingIndex > -1) {
                    responseItem.workflowProcess.tracing[currentTracingIndex] = {
                        ...responseItem.workflowProcess.tracing[currentTracingIndex],
                        ...data,
                    };
                    updateCurrentQAOnTree({
                        placeholderQuestionId,
                        questionItem,
                        responseItem,
                        parentId: params.parent_message_id,
                    });
                }
            },
            onNodeStarted: ({ data }) => {
                responseItem.workflowProcess.tracing.push({
                    ...data,
                    status: types_1.NodeRunningStatus.Running,
                });
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: params.parent_message_id,
                });
            },
            onNodeRetry: ({ data }) => {
                responseItem.workflowProcess.tracing.push(data);
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: params.parent_message_id,
                });
            },
            onNodeFinished: ({ data }) => {
                const currentTracingIndex = responseItem.workflowProcess.tracing.findIndex(item => item.id === data.id);
                if (currentTracingIndex > -1) {
                    responseItem.workflowProcess.tracing[currentTracingIndex] = {
                        ...responseItem.workflowProcess.tracing[currentTracingIndex],
                        ...data,
                    };
                    updateCurrentQAOnTree({
                        placeholderQuestionId,
                        questionItem,
                        responseItem,
                        parentId: params.parent_message_id,
                    });
                }
            },
            onAgentLog: ({ data }) => {
                const currentNodeIndex = responseItem.workflowProcess.tracing.findIndex(item => item.node_id === data.node_id);
                if (currentNodeIndex > -1) {
                    const current = responseItem.workflowProcess.tracing[currentNodeIndex];
                    if (current.execution_metadata) {
                        if (current.execution_metadata.agent_log) {
                            const currentLogIndex = current.execution_metadata.agent_log.findIndex(log => log.message_id === data.message_id);
                            if (currentLogIndex > -1) {
                                current.execution_metadata.agent_log[currentLogIndex] = {
                                    ...current.execution_metadata.agent_log[currentLogIndex],
                                    ...data,
                                };
                            }
                            else {
                                current.execution_metadata.agent_log.push(data);
                            }
                        }
                        else {
                            current.execution_metadata.agent_log = [data];
                        }
                    }
                    else {
                        current.execution_metadata = {
                            agent_log: [data],
                        };
                    }
                    responseItem.workflowProcess.tracing[currentNodeIndex] = {
                        ...current,
                    };
                    updateCurrentQAOnTree({
                        placeholderQuestionId,
                        questionItem,
                        responseItem,
                        parentId: params.parent_message_id,
                    });
                }
            },
        });
    }, [threadMessages, chatTree.length, updateCurrentQAOnTree, handleResponding, formSettings?.inputsForm, handleRun, notify, t, config?.suggested_questions_after_answer?.enabled, fetchInspectVars, invalidAllLastRun]);
    return {
        conversationId: conversationId.current,
        chatList,
        setTargetMessageId,
        handleSend,
        handleStop,
        handleRestart,
        isResponding,
        suggestedQuestions,
    };
};
exports.useChat = useChat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSw4Q0FBMEM7QUFDMUMsaUNBQThDO0FBQzlDLGlDQU1jO0FBQ2QsaURBQThDO0FBQzlDLGlFQUc4QztBQUM5Qyw0REFBb0U7QUFDcEUscUVBR2tEO0FBQ2xELHVEQUE2RDtBQUM3RCx5REFBNkQ7QUFDN0QscUNBQTRDO0FBQzVDLCtDQUF3RTtBQUN4RSx1Q0FHb0I7QUFDcEIsbURBQWlEO0FBQ2pELHVDQUE4QztBQUM5Qyx1Q0FBc0U7QUFNL0QsTUFBTSxPQUFPLEdBQUcsQ0FDckIsTUFBVyxFQUNYLFlBR0MsRUFDRCxZQUErQixFQUMvQixRQUFtQyxFQUNuQyxFQUFFO0lBQ0YsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLHVCQUFlLEdBQUUsQ0FBQTtJQUNwQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxzQkFBYyxHQUFFLENBQUE7SUFDdEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLGNBQU0sRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUN0QyxNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDeEMsTUFBTSxjQUFjLEdBQUcsSUFBQSxjQUFNLEVBQUMsRUFBRSxDQUFDLENBQUE7SUFDakMsTUFBTSxTQUFTLEdBQUcsSUFBQSxjQUFNLEVBQUMsRUFBRSxDQUFDLENBQUE7SUFDNUIsTUFBTSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDdkQsTUFBTSxlQUFlLEdBQUcsSUFBQSxjQUFNLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDckMsTUFBTSxVQUFVLEdBQUcsSUFBQSwyQkFBYSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FB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WixZQUFZO3dCQUNaLFFBQVEsRUFBRSxNQUFNLENBQUMsaUJBQWlCO3FCQUNuQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7U0FDRixDQUNGLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxnQ0FBZ0MsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFBO0lBRXROLE9BQU87UUFDTCxjQUFjLEVBQUUsY0FBYyxDQUFDLE9BQU87UUFDdEMsUUFBUTtRQUNSLGtCQUFrQjtRQUNsQixVQUFVO1FBQ1YsVUFBVTtRQUNWLGFBQWE7UUFDYixZQUFZO1FBQ1osa0JBQWtCO0tBQ25CLENBQUE7QUFDSCxDQUFDLENBQUE7QUF6ZFksUUFBQSxPQUFPLFdBeWRuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSW5wdXRGb3JtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoYXQvY2hhdC90eXBlJ1xuaW1wb3J0IHR5cGUge1xuICBDaGF0SXRlbSxcbiAgQ2hhdEl0ZW1JblRyZWUsXG4gIElucHV0cyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoYXQvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEZpbGVFbnRpdHkgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci90eXBlcydcbmltcG9ydCB7IHVuaXFCeSB9IGZyb20gJ2VzLXRvb2xraXQvY29tcGF0J1xuaW1wb3J0IHsgcHJvZHVjZSwgc2V0QXV0b0ZyZWV6ZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHtcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQge1xuICBnZXRQcm9jZXNzZWRJbnB1dHMsXG4gIHByb2Nlc3NPcGVuaW5nU3RhdGVtZW50LFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC9jaGF0L3V0aWxzJ1xuaW1wb3J0IHsgZ2V0VGhyZWFkTWVzc2FnZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC91dGlscydcbmltcG9ydCB7XG4gIGdldFByb2Nlc3NlZEZpbGVzLFxuICBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZpbGUtdXBsb2FkZXIvdXRpbHMnXG5pbXBvcnQgeyB1c2VUb2FzdENvbnRleHQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyB1c2VJbnZhbGlkQWxsTGFzdFJ1biB9IGZyb20gJ0Avc2VydmljZS91c2Utd29ya2Zsb3cnXG5pbXBvcnQgeyBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgREVGQVVMVF9JVEVSX1RJTUVTLCBERUZBVUxUX0xPT1BfVElNRVMgfSBmcm9tICcuLi8uLi9jb25zdGFudHMnXG5pbXBvcnQge1xuICB1c2VTZXRXb3JrZmxvd1ZhcnNXaXRoVmFsdWUsXG4gIHVzZVdvcmtmbG93UnVuLFxufSBmcm9tICcuLi8uLi9ob29rcydcbmltcG9ydCB7IHVzZUhvb2tzU3RvcmUgfSBmcm9tICcuLi8uLi9ob29rcy1zdG9yZSdcbmltcG9ydCB7IHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICcuLi8uLi9zdG9yZSdcbmltcG9ydCB7IE5vZGVSdW5uaW5nU3RhdHVzLCBXb3JrZmxvd1J1bm5pbmdTdGF0dXMgfSBmcm9tICcuLi8uLi90eXBlcydcblxudHlwZSBHZXRBYm9ydENvbnRyb2xsZXIgPSAoYWJvcnRDb250cm9sbGVyOiBBYm9ydENvbnRyb2xsZXIpID0+IHZvaWRcbnR5cGUgU2VuZENhbGxiYWNrID0ge1xuICBvbkdldFN1Z2dlc3RlZFF1ZXN0aW9ucz86IChyZXNwb25zZUl0ZW1JZDogc3RyaW5nLCBnZXRBYm9ydENvbnRyb2xsZXI6IEdldEFib3J0Q29udHJvbGxlcikgPT4gUHJvbWlzZTxhbnk+XG59XG5leHBvcnQgY29uc3QgdXNlQ2hhdCA9IChcbiAgY29uZmlnOiBhbnksXG4gIGZvcm1TZXR0aW5ncz86IHtcbiAgICBpbnB1dHM6IElucHV0c1xuICAgIGlucHV0c0Zvcm06IElucHV0Rm9ybVtdXG4gIH0sXG4gIHByZXZDaGF0VHJlZT86IENoYXRJdGVtSW5UcmVlW10sXG4gIHN0b3BDaGF0PzogKHRhc2tJZDogc3RyaW5nKSA9PiB2b2lkLFxuKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlVG9hc3RDb250ZXh0KClcbiAgY29uc3QgeyBoYW5kbGVSdW4gfSA9IHVzZVdvcmtmbG93UnVuKClcbiAgY29uc3QgaGFzU3RvcFJlc3BvbmRlZCA9IHVzZVJlZihmYWxzZSlcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCBjb252ZXJzYXRpb25JZCA9IHVzZVJlZignJylcbiAgY29uc3QgdGFza0lkUmVmID0gdXNlUmVmKCcnKVxuICBjb25zdCBbaXNSZXNwb25kaW5nLCBzZXRJc1Jlc3BvbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGlzUmVzcG9uZGluZ1JlZiA9IHVzZVJlZihmYWxzZSlcbiAgY29uc3QgY29uZmlnc01hcCA9IHVzZUhvb2tzU3RvcmUocyA9PiBzLmNvbmZpZ3NNYXApXG4gIGNvbnN0IGludmFsaWRBbGxMYXN0UnVuID0gdXNlSW52YWxpZEFsbExhc3RSdW4oY29uZmlnc01hcD8uZmxvd1R5cGUsIGNvbmZpZ3NNYXA/LmZsb3dJZClcbiAgY29uc3QgeyBmZXRjaEluc3BlY3RWYXJzIH0gPSB1c2VTZXRXb3JrZmxvd1ZhcnNXaXRoVmFsdWUoKVxuICBjb25zdCBbc3VnZ2VzdGVkUXVlc3Rpb25zLCBzZXRTdWdnZXN0UXVlc3Rpb25zXSA9IHVzZVN0YXRlPHN0cmluZ1tdPihbXSlcbiAgY29uc3Qgc3VnZ2VzdGVkUXVlc3Rpb25zQWJvcnRDb250cm9sbGVyUmVmID0gdXNlUmVmPEFib3J0Q29udHJvbGxlciB8IG51bGw+KG51bGwpXG4gIGNvbnN0IHtcbiAgICBzZXRJdGVyVGltZXMsXG4gICAgc2V0TG9vcFRpbWVzLFxuICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgY29uc3QgaGFuZGxlUmVzcG9uZGluZyA9IHVzZUNhbGxiYWNrKChpc1Jlc3BvbmRpbmc6IGJvb2xlYW4pID0+IHtcbiAgICBzZXRJc1Jlc3BvbmRpbmcoaXNSZXNwb25kaW5nKVxuICAgIGlzUmVzcG9uZGluZ1JlZi5jdXJyZW50ID0gaXNSZXNwb25kaW5nXG4gIH0sIFtdKVxuXG4gIGNvbnN0IFtjaGF0VHJlZSwgc2V0Q2hhdFRyZWVdID0gdXNlU3RhdGU8Q2hhdEl0ZW1JblRyZWVbXT4ocHJldkNoYXRUcmVlIHx8IFtdKVxuICBjb25zdCBjaGF0VHJlZVJlZiA9IHVzZVJlZjxDaGF0SXRlbUluVHJlZVtdPihjaGF0VHJlZSlcbiAgY29uc3QgW3RhcmdldE1lc3NhZ2VJZCwgc2V0VGFyZ2V0TWVzc2FnZUlkXSA9IHVzZVN0YXRlPHN0cmluZz4oKVxuICBjb25zdCB0aHJlYWRNZXNzYWdlcyA9IHVzZU1lbW8oKCkgPT4gZ2V0VGhyZWFkTWVzc2FnZXMoY2hhdFRyZWUsIHRhcmdldE1lc3NhZ2VJZCksIFtjaGF0VHJlZSwgdGFyZ2V0TWVzc2FnZUlkXSlcblxuICBjb25zdCBnZXRJbnRyb2R1Y3Rpb24gPSB1c2VDYWxsYmFjaygoc3RyOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gcHJvY2Vzc09wZW5pbmdTdGF0ZW1lbnQoc3RyLCBmb3JtU2V0dGluZ3M/LmlucHV0cyB8fCB7fSwgZm9ybVNldHRpbmdzPy5pbnB1dHNGb3JtIHx8IFtdKVxuICB9LCBbZm9ybVNldHRpbmdzPy5pbnB1dHMsIGZvcm1TZXR0aW5ncz8uaW5wdXRzRm9ybV0pXG5cbiAgLyoqIEZpbmFsIGNoYXQgbGlzdCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgKi9cbiAgY29uc3QgY2hhdExpc3QgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCByZXQgPSBbLi4udGhyZWFkTWVzc2FnZXNdXG4gICAgaWYgKGNvbmZpZz8ub3BlbmluZ19zdGF0ZW1lbnQpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhyZWFkTWVzc2FnZXMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5pc09wZW5pbmdTdGF0ZW1lbnQpXG5cbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHJldFtpbmRleF0gPSB7XG4gICAgICAgICAgLi4ucmV0W2luZGV4XSxcbiAgICAgICAgICBjb250ZW50OiBnZXRJbnRyb2R1Y3Rpb24oY29uZmlnLm9wZW5pbmdfc3RhdGVtZW50KSxcbiAgICAgICAgICBzdWdnZXN0ZWRRdWVzdGlvbnM6IGNvbmZpZy5zdWdnZXN0ZWRfcXVlc3Rpb25zPy5tYXAoKGl0ZW06IHN0cmluZykgPT4gZ2V0SW50cm9kdWN0aW9uKGl0ZW0pKSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldC51bnNoaWZ0KHtcbiAgICAgICAgICBpZDogYCR7RGF0ZS5ub3coKX1gLFxuICAgICAgICAgIGNvbnRlbnQ6IGdldEludHJvZHVjdGlvbihjb25maWcub3BlbmluZ19zdGF0ZW1lbnQpLFxuICAgICAgICAgIGlzQW5zd2VyOiB0cnVlLFxuICAgICAgICAgIGlzT3BlbmluZ1N0YXRlbWVudDogdHJ1ZSxcbiAgICAgICAgICBzdWdnZXN0ZWRRdWVzdGlvbnM6IGNvbmZpZy5zdWdnZXN0ZWRfcXVlc3Rpb25zPy5tYXAoKGl0ZW06IHN0cmluZykgPT4gZ2V0SW50cm9kdWN0aW9uKGl0ZW0pKSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldFxuICB9LCBbdGhyZWFkTWVzc2FnZXMsIGNvbmZpZz8ub3BlbmluZ19zdGF0ZW1lbnQsIGdldEludHJvZHVjdGlvbiwgY29uZmlnPy5zdWdnZXN0ZWRfcXVlc3Rpb25zXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldEF1dG9GcmVlemUoZmFsc2UpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHNldEF1dG9GcmVlemUodHJ1ZSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIC8qKiBGaW5kIHRoZSB0YXJnZXQgbm9kZSBieSBiZnMgYW5kIHRoZW4gb3BlcmF0ZSBvbiBpdCAqL1xuICBjb25zdCBwcm9kdWNlQ2hhdFRyZWVOb2RlID0gdXNlQ2FsbGJhY2soKHRhcmdldElkOiBzdHJpbmcsIG9wZXJhdGlvbjogKG5vZGU6IENoYXRJdGVtSW5UcmVlKSA9PiB2b2lkKSA9PiB7XG4gICAgcmV0dXJuIHByb2R1Y2UoY2hhdFRyZWVSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBjb25zdCBxdWV1ZTogQ2hhdEl0ZW1JblRyZWVbXSA9IFsuLi5kcmFmdF1cbiAgICAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBxdWV1ZS5zaGlmdCgpIVxuICAgICAgICBpZiAoY3VycmVudC5pZCA9PT0gdGFyZ2V0SWQpIHtcbiAgICAgICAgICBvcGVyYXRpb24oY3VycmVudClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50LmNoaWxkcmVuKVxuICAgICAgICAgIHF1ZXVlLnB1c2goLi4uY3VycmVudC5jaGlsZHJlbilcbiAgICAgIH1cbiAgICB9KVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTdG9wID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGhhc1N0b3BSZXNwb25kZWQuY3VycmVudCA9IHRydWVcbiAgICBoYW5kbGVSZXNwb25kaW5nKGZhbHNlKVxuICAgIGlmIChzdG9wQ2hhdCAmJiB0YXNrSWRSZWYuY3VycmVudClcbiAgICAgIHN0b3BDaGF0KHRhc2tJZFJlZi5jdXJyZW50KVxuICAgIHNldEl0ZXJUaW1lcyhERUZBVUxUX0lURVJfVElNRVMpXG4gICAgc2V0TG9vcFRpbWVzKERFRkFVTFRfTE9PUF9USU1FUylcbiAgICBpZiAoc3VnZ2VzdGVkUXVlc3Rpb25zQWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQpXG4gICAgICBzdWdnZXN0ZWRRdWVzdGlvbnNBYm9ydENvbnRyb2xsZXJSZWYuY3VycmVudC5hYm9ydCgpXG4gIH0sIFtoYW5kbGVSZXNwb25kaW5nLCBzZXRJdGVyVGltZXMsIHNldExvb3BUaW1lcywgc3RvcENoYXRdKVxuXG4gIGNvbnN0IGhhbmRsZVJlc3RhcnQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29udmVyc2F0aW9uSWQuY3VycmVudCA9ICcnXG4gICAgdGFza0lkUmVmLmN1cnJlbnQgPSAnJ1xuICAgIGhhbmRsZVN0b3AoKVxuICAgIHNldEl0ZXJUaW1lcyhERUZBVUxUX0lURVJfVElNRVMpXG4gICAgc2V0TG9vcFRpbWVzKERFRkFVTFRfTE9PUF9USU1FUylcbiAgICBzZXRDaGF0VHJlZShbXSlcbiAgICBzZXRTdWdnZXN0UXVlc3Rpb25zKFtdKVxuICB9LCBbXG4gICAgaGFuZGxlU3RvcCxcbiAgICBzZXRJdGVyVGltZXMsXG4gICAgc2V0TG9vcFRpbWVzLFxuICBdKVxuXG4gIGNvbnN0IHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSA9IHVzZUNhbGxiYWNrKCh7XG4gICAgcGFyZW50SWQsXG4gICAgcmVzcG9uc2VJdGVtLFxuICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICBxdWVzdGlvbkl0ZW0sXG4gIH06IHtcbiAgICBwYXJlbnRJZD86IHN0cmluZ1xuICAgIHJlc3BvbnNlSXRlbTogQ2hhdEl0ZW1cbiAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQ6IHN0cmluZ1xuICAgIHF1ZXN0aW9uSXRlbTogQ2hhdEl0ZW1cbiAgfSkgPT4ge1xuICAgIGxldCBuZXh0U3RhdGU6IENoYXRJdGVtSW5UcmVlW11cbiAgICBjb25zdCBjdXJyZW50UUEgPSB7IC4uLnF1ZXN0aW9uSXRlbSwgY2hpbGRyZW46IFt7IC4uLnJlc3BvbnNlSXRlbSwgY2hpbGRyZW46IFtdIH1dIH1cbiAgICBpZiAoIXBhcmVudElkICYmICFjaGF0VHJlZS5zb21lKGl0ZW0gPT4gW3BsYWNlaG9sZGVyUXVlc3Rpb25JZCwgcXVlc3Rpb25JdGVtLmlkXS5pbmNsdWRlcyhpdGVtLmlkKSkpIHtcbiAgICAgIC8vIFFBIHdob3NlIHBhcmVudCBpcyBub3QgcHJvdmlkZWQgaXMgY29uc2lkZXJlZCBhcyBhIGZpcnN0IG1lc3NhZ2Ugb2YgdGhlIGNvbnZlcnNhdGlvbixcbiAgICAgIC8vIGFuZCBpdCBzaG91bGQgYmUgYSByb290IG5vZGUgb2YgdGhlIGNoYXQgdHJlZVxuICAgICAgbmV4dFN0YXRlID0gcHJvZHVjZShjaGF0VHJlZSwgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGRyYWZ0LnB1c2goY3VycmVudFFBKVxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBmaW5kIHRoZSB0YXJnZXQgUUEgaW4gdGhlIHRyZWUgYW5kIHVwZGF0ZSBpdDsgaWYgbm90IGZvdW5kLCBpbnNlcnQgaXQgdG8gaXRzIHBhcmVudCBub2RlXG4gICAgICBuZXh0U3RhdGUgPSBwcm9kdWNlQ2hhdFRyZWVOb2RlKHBhcmVudElkISwgKHBhcmVudE5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgcXVlc3Rpb25Ob2RlSW5kZXggPSBwYXJlbnROb2RlLmNoaWxkcmVuIS5maW5kSW5kZXgoaXRlbSA9PiBbcGxhY2Vob2xkZXJRdWVzdGlvbklkLCBxdWVzdGlvbkl0ZW0uaWRdLmluY2x1ZGVzKGl0ZW0uaWQpKVxuICAgICAgICBpZiAocXVlc3Rpb25Ob2RlSW5kZXggPT09IC0xKVxuICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRyZW4hLnB1c2goY3VycmVudFFBKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHJlbiFbcXVlc3Rpb25Ob2RlSW5kZXhdID0gY3VycmVudFFBXG4gICAgICB9KVxuICAgIH1cbiAgICBzZXRDaGF0VHJlZShuZXh0U3RhdGUpXG4gICAgY2hhdFRyZWVSZWYuY3VycmVudCA9IG5leHRTdGF0ZVxuICB9LCBbY2hhdFRyZWUsIHByb2R1Y2VDaGF0VHJlZU5vZGVdKVxuXG4gIGNvbnN0IGhhbmRsZVNlbmQgPSB1c2VDYWxsYmFjaygoXG4gICAgcGFyYW1zOiB7XG4gICAgICBxdWVyeTogc3RyaW5nXG4gICAgICBmaWxlcz86IEZpbGVFbnRpdHlbXVxuICAgICAgcGFyZW50X21lc3NhZ2VfaWQ/OiBzdHJpbmdcbiAgICAgIFtrZXk6IHN0cmluZ106IGFueVxuICAgIH0sXG4gICAge1xuICAgICAgb25HZXRTdWdnZXN0ZWRRdWVzdGlvbnMsXG4gICAgfTogU2VuZENhbGxiYWNrLFxuICApID0+IHtcbiAgICBpZiAoaXNSZXNwb25kaW5nUmVmLmN1cnJlbnQpIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdpbmZvJywgbWVzc2FnZTogdCgnZXJyb3JNZXNzYWdlLndhaXRGb3JSZXNwb25zZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudE1lc3NhZ2UgPSB0aHJlYWRNZXNzYWdlcy5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gcGFyYW1zLnBhcmVudF9tZXNzYWdlX2lkKVxuXG4gICAgY29uc3QgcGxhY2Vob2xkZXJRdWVzdGlvbklkID0gYHF1ZXN0aW9uLSR7RGF0ZS5ub3coKX1gXG4gICAgY29uc3QgcXVlc3Rpb25JdGVtID0ge1xuICAgICAgaWQ6IHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgIGNvbnRlbnQ6IHBhcmFtcy5xdWVyeSxcbiAgICAgIGlzQW5zd2VyOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2VfZmlsZXM6IHBhcmFtcy5maWxlcyxcbiAgICAgIHBhcmVudE1lc3NhZ2VJZDogcGFyYW1zLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgIH1cblxuICAgIGNvbnN0IHBsYWNlaG9sZGVyQW5zd2VySWQgPSBgYW5zd2VyLXBsYWNlaG9sZGVyLSR7RGF0ZS5ub3coKX1gXG4gICAgY29uc3QgcGxhY2Vob2xkZXJBbnN3ZXJJdGVtID0ge1xuICAgICAgaWQ6IHBsYWNlaG9sZGVyQW5zd2VySWQsXG4gICAgICBjb250ZW50OiAnJyxcbiAgICAgIGlzQW5zd2VyOiB0cnVlLFxuICAgICAgcGFyZW50TWVzc2FnZUlkOiBxdWVzdGlvbkl0ZW0uaWQsXG4gICAgICBzaWJsaW5nSW5kZXg6IHBhcmVudE1lc3NhZ2U/LmNoaWxkcmVuPy5sZW5ndGggPz8gY2hhdFRyZWUubGVuZ3RoLFxuICAgIH1cblxuICAgIHNldFRhcmdldE1lc3NhZ2VJZChwYXJlbnRNZXNzYWdlPy5pZClcbiAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgcGFyZW50SWQ6IHBhcmFtcy5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgIHJlc3BvbnNlSXRlbTogcGxhY2Vob2xkZXJBbnN3ZXJJdGVtLFxuICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgcXVlc3Rpb25JdGVtLFxuICAgIH0pXG5cbiAgICAvLyBhbnN3ZXJcbiAgICBjb25zdCByZXNwb25zZUl0ZW06IENoYXRJdGVtID0ge1xuICAgICAgaWQ6IHBsYWNlaG9sZGVyQW5zd2VySWQsXG4gICAgICBjb250ZW50OiAnJyxcbiAgICAgIGFnZW50X3Rob3VnaHRzOiBbXSxcbiAgICAgIG1lc3NhZ2VfZmlsZXM6IFtdLFxuICAgICAgaXNBbnN3ZXI6IHRydWUsXG4gICAgICBwYXJlbnRNZXNzYWdlSWQ6IHF1ZXN0aW9uSXRlbS5pZCxcbiAgICAgIHNpYmxpbmdJbmRleDogcGFyZW50TWVzc2FnZT8uY2hpbGRyZW4/Lmxlbmd0aCA/PyBjaGF0VHJlZS5sZW5ndGgsXG4gICAgfVxuXG4gICAgaGFuZGxlUmVzcG9uZGluZyh0cnVlKVxuXG4gICAgY29uc3QgeyBmaWxlcywgaW5wdXRzLCAuLi5yZXN0UGFyYW1zIH0gPSBwYXJhbXNcbiAgICBjb25zdCBib2R5UGFyYW1zID0ge1xuICAgICAgZmlsZXM6IGdldFByb2Nlc3NlZEZpbGVzKGZpbGVzIHx8IFtdKSxcbiAgICAgIGlucHV0czogZ2V0UHJvY2Vzc2VkSW5wdXRzKGlucHV0cyB8fCB7fSwgZm9ybVNldHRpbmdzPy5pbnB1dHNGb3JtIHx8IFtdKSxcbiAgICAgIC4uLnJlc3RQYXJhbXMsXG4gICAgfVxuICAgIGlmIChib2R5UGFyYW1zPy5maWxlcz8ubGVuZ3RoKSB7XG4gICAgICBib2R5UGFyYW1zLmZpbGVzID0gYm9keVBhcmFtcy5maWxlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGl0ZW0udHJhbnNmZXJfbWV0aG9kID09PSBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgaGFzU2V0UmVzcG9uc2VJZCA9IGZhbHNlXG5cbiAgICBoYW5kbGVSdW4oXG4gICAgICBib2R5UGFyYW1zLFxuICAgICAge1xuICAgICAgICBvbkRhdGE6IChtZXNzYWdlOiBzdHJpbmcsIGlzRmlyc3RNZXNzYWdlOiBib29sZWFuLCB7IGNvbnZlcnNhdGlvbklkOiBuZXdDb252ZXJzYXRpb25JZCwgbWVzc2FnZUlkLCB0YXNrSWQgfTogYW55KSA9PiB7XG4gICAgICAgICAgcmVzcG9uc2VJdGVtLmNvbnRlbnQgPSByZXNwb25zZUl0ZW0uY29udGVudCArIG1lc3NhZ2VcblxuICAgICAgICAgIGlmIChtZXNzYWdlSWQgJiYgIWhhc1NldFJlc3BvbnNlSWQpIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uSXRlbS5pZCA9IGBxdWVzdGlvbi0ke21lc3NhZ2VJZH1gXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0uaWQgPSBtZXNzYWdlSWRcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbS5wYXJlbnRNZXNzYWdlSWQgPSBxdWVzdGlvbkl0ZW0uaWRcbiAgICAgICAgICAgIGhhc1NldFJlc3BvbnNlSWQgPSB0cnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzRmlyc3RNZXNzYWdlICYmIG5ld0NvbnZlcnNhdGlvbklkKVxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQuY3VycmVudCA9IG5ld0NvbnZlcnNhdGlvbklkXG5cbiAgICAgICAgICB0YXNrSWRSZWYuY3VycmVudCA9IHRhc2tJZFxuICAgICAgICAgIGlmIChtZXNzYWdlSWQpXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0uaWQgPSBtZXNzYWdlSWRcblxuICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQsXG4gICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICBwYXJlbnRJZDogcGFyYW1zLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIG9uQ29tcGxldGVkKGhhc0Vycm9yPzogYm9vbGVhbiwgZXJyb3JNZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgICAgICAgaGFuZGxlUmVzcG9uZGluZyhmYWxzZSlcbiAgICAgICAgICBmZXRjaEluc3BlY3RWYXJzKHt9KVxuICAgICAgICAgIGludmFsaWRBbGxMYXN0UnVuKClcblxuICAgICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgaWYgKGVycm9yTWVzc2FnZSkge1xuICAgICAgICAgICAgICByZXNwb25zZUl0ZW0uY29udGVudCA9IGVycm9yTWVzc2FnZVxuICAgICAgICAgICAgICByZXNwb25zZUl0ZW0uaXNFcnJvciA9IHRydWVcbiAgICAgICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQsXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZDogcGFyYW1zLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbmZpZz8uc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXI/LmVuYWJsZWQgJiYgIWhhc1N0b3BSZXNwb25kZWQuY3VycmVudCAmJiBvbkdldFN1Z2dlc3RlZFF1ZXN0aW9ucykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgeyBkYXRhIH06IGFueSA9IGF3YWl0IG9uR2V0U3VnZ2VzdGVkUXVlc3Rpb25zKFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlSXRlbS5pZCxcbiAgICAgICAgICAgICAgICBuZXdBYm9ydENvbnRyb2xsZXIgPT4gc3VnZ2VzdGVkUXVlc3Rpb25zQWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBuZXdBYm9ydENvbnRyb2xsZXIsXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgc2V0U3VnZ2VzdFF1ZXN0aW9ucyhkYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVudXNlZC1pbXBvcnRzL25vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgc2V0U3VnZ2VzdFF1ZXN0aW9ucyhbXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uTWVzc2FnZUVuZDogKG1lc3NhZ2VFbmQpID0+IHtcbiAgICAgICAgICByZXNwb25zZUl0ZW0uY2l0YXRpb24gPSBtZXNzYWdlRW5kLm1ldGFkYXRhPy5yZXRyaWV2ZXJfcmVzb3VyY2VzIHx8IFtdXG4gICAgICAgICAgY29uc3QgcHJvY2Vzc2VkRmlsZXNGcm9tUmVzcG9uc2UgPSBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZShtZXNzYWdlRW5kLmZpbGVzIHx8IFtdKVxuICAgICAgICAgIHJlc3BvbnNlSXRlbS5hbGxGaWxlcyA9IHVuaXFCeShbLi4uKHJlc3BvbnNlSXRlbS5hbGxGaWxlcyB8fCBbXSksIC4uLihwcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZSB8fCBbXSldLCAnaWQnKVxuXG4gICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgIHF1ZXN0aW9uSXRlbSxcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgIHBhcmVudElkOiBwYXJhbXMucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgb25NZXNzYWdlUmVwbGFjZTogKG1lc3NhZ2VSZXBsYWNlKSA9PiB7XG4gICAgICAgICAgcmVzcG9uc2VJdGVtLmNvbnRlbnQgPSBtZXNzYWdlUmVwbGFjZS5hbnN3ZXJcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcigpIHtcbiAgICAgICAgICBoYW5kbGVSZXNwb25kaW5nKGZhbHNlKVxuICAgICAgICB9LFxuICAgICAgICBvbldvcmtmbG93U3RhcnRlZDogKHsgd29ya2Zsb3dfcnVuX2lkLCB0YXNrX2lkIH0pID0+IHtcbiAgICAgICAgICB0YXNrSWRSZWYuY3VycmVudCA9IHRhc2tfaWRcbiAgICAgICAgICByZXNwb25zZUl0ZW0ud29ya2Zsb3dfcnVuX2lkID0gd29ya2Zsb3dfcnVuX2lkXG4gICAgICAgICAgcmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyA9IHtcbiAgICAgICAgICAgIHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICAgICAgICB0cmFjaW5nOiBbXSxcbiAgICAgICAgICB9XG4gICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgIHF1ZXN0aW9uSXRlbSxcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgIHBhcmVudElkOiBwYXJhbXMucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgb25Xb3JrZmxvd0ZpbmlzaGVkOiAoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICByZXNwb25zZUl0ZW0ud29ya2Zsb3dQcm9jZXNzIS5zdGF0dXMgPSBkYXRhLnN0YXR1cyBhcyBXb3JrZmxvd1J1bm5pbmdTdGF0dXNcbiAgICAgICAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLFxuICAgICAgICAgICAgcGFyZW50SWQ6IHBhcmFtcy5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBvbkl0ZXJhdGlvblN0YXJ0OiAoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICByZXNwb25zZUl0ZW0ud29ya2Zsb3dQcm9jZXNzIS50cmFjaW5nIS5wdXNoKHtcbiAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICAgICAgfSlcbiAgICAgICAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLFxuICAgICAgICAgICAgcGFyZW50SWQ6IHBhcmFtcy5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBvbkl0ZXJhdGlvbkZpbmlzaDogKHsgZGF0YSB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgY3VycmVudFRyYWNpbmdJbmRleCA9IHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmchLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGRhdGEuaWQpXG4gICAgICAgICAgaWYgKGN1cnJlbnRUcmFjaW5nSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyEudHJhY2luZ1tjdXJyZW50VHJhY2luZ0luZGV4XSA9IHtcbiAgICAgICAgICAgICAgLi4ucmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyEudHJhY2luZ1tjdXJyZW50VHJhY2luZ0luZGV4XSxcbiAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICAgIHBhcmVudElkOiBwYXJhbXMucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25Mb29wU3RhcnQ6ICh7IGRhdGEgfSkgPT4ge1xuICAgICAgICAgIHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmchLnB1c2goe1xuICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgIHN0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQsXG4gICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICBwYXJlbnRJZDogcGFyYW1zLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9vcEZpbmlzaDogKHsgZGF0YSB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgY3VycmVudFRyYWNpbmdJbmRleCA9IHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmchLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGRhdGEuaWQpXG4gICAgICAgICAgaWYgKGN1cnJlbnRUcmFjaW5nSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyEudHJhY2luZ1tjdXJyZW50VHJhY2luZ0luZGV4XSA9IHtcbiAgICAgICAgICAgICAgLi4ucmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyEudHJhY2luZ1tjdXJyZW50VHJhY2luZ0luZGV4XSxcbiAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICAgIHBhcmVudElkOiBwYXJhbXMucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlU3RhcnRlZDogKHsgZGF0YSB9KSA9PiB7XG4gICAgICAgICAgcmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyEudHJhY2luZyEucHVzaCh7XG4gICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiBOb2RlUnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgICAgIH0gYXMgYW55KVxuICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQsXG4gICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICBwYXJlbnRJZDogcGFyYW1zLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZVJldHJ5OiAoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICByZXNwb25zZUl0ZW0ud29ya2Zsb3dQcm9jZXNzIS50cmFjaW5nIS5wdXNoKGRhdGEpXG5cbiAgICAgICAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLFxuICAgICAgICAgICAgcGFyZW50SWQ6IHBhcmFtcy5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVGaW5pc2hlZDogKHsgZGF0YSB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgY3VycmVudFRyYWNpbmdJbmRleCA9IHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmchLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGRhdGEuaWQpXG4gICAgICAgICAgaWYgKGN1cnJlbnRUcmFjaW5nSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyEudHJhY2luZ1tjdXJyZW50VHJhY2luZ0luZGV4XSA9IHtcbiAgICAgICAgICAgICAgLi4ucmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyEudHJhY2luZ1tjdXJyZW50VHJhY2luZ0luZGV4XSxcbiAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICAgIHBhcmVudElkOiBwYXJhbXMucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25BZ2VudExvZzogKHsgZGF0YSB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgY3VycmVudE5vZGVJbmRleCA9IHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmchLmZpbmRJbmRleChpdGVtID0+IGl0ZW0ubm9kZV9pZCA9PT0gZGF0YS5ub2RlX2lkKVxuICAgICAgICAgIGlmIChjdXJyZW50Tm9kZUluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSByZXNwb25zZUl0ZW0ud29ya2Zsb3dQcm9jZXNzIS50cmFjaW5nIVtjdXJyZW50Tm9kZUluZGV4XVxuXG4gICAgICAgICAgICBpZiAoY3VycmVudC5leGVjdXRpb25fbWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnQuZXhlY3V0aW9uX21ldGFkYXRhLmFnZW50X2xvZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRMb2dJbmRleCA9IGN1cnJlbnQuZXhlY3V0aW9uX21ldGFkYXRhLmFnZW50X2xvZy5maW5kSW5kZXgobG9nID0+IGxvZy5tZXNzYWdlX2lkID09PSBkYXRhLm1lc3NhZ2VfaWQpXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRMb2dJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICBjdXJyZW50LmV4ZWN1dGlvbl9tZXRhZGF0YS5hZ2VudF9sb2dbY3VycmVudExvZ0luZGV4XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uY3VycmVudC5leGVjdXRpb25fbWV0YWRhdGEuYWdlbnRfbG9nW2N1cnJlbnRMb2dJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgY3VycmVudC5leGVjdXRpb25fbWV0YWRhdGEuYWdlbnRfbG9nLnB1c2goZGF0YSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY3VycmVudC5leGVjdXRpb25fbWV0YWRhdGEuYWdlbnRfbG9nID0gW2RhdGFdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBjdXJyZW50LmV4ZWN1dGlvbl9tZXRhZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBhZ2VudF9sb2c6IFtkYXRhXSxcbiAgICAgICAgICAgICAgfSBhcyBhbnlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyEudHJhY2luZ1tjdXJyZW50Tm9kZUluZGV4XSA9IHtcbiAgICAgICAgICAgICAgLi4uY3VycmVudCxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgICAgcGFyZW50SWQ6IHBhcmFtcy5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApXG4gIH0sIFt0aHJlYWRNZXNzYWdlcywgY2hhdFRyZWUubGVuZ3RoLCB1cGRhdGVDdXJyZW50UUFPblRyZWUsIGhhbmRsZVJlc3BvbmRpbmcsIGZvcm1TZXR0aW5ncz8uaW5wdXRzRm9ybSwgaGFuZGxlUnVuLCBub3RpZnksIHQsIGNvbmZpZz8uc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXI/LmVuYWJsZWQsIGZldGNoSW5zcGVjdFZhcnMsIGludmFsaWRBbGxMYXN0UnVuXSlcblxuICByZXR1cm4ge1xuICAgIGNvbnZlcnNhdGlvbklkOiBjb252ZXJzYXRpb25JZC5jdXJyZW50LFxuICAgIGNoYXRMaXN0LFxuICAgIHNldFRhcmdldE1lc3NhZ2VJZCxcbiAgICBoYW5kbGVTZW5kLFxuICAgIGhhbmRsZVN0b3AsXG4gICAgaGFuZGxlUmVzdGFydCxcbiAgICBpc1Jlc3BvbmRpbmcsXG4gICAgc3VnZ2VzdGVkUXVlc3Rpb25zLFxuICB9XG59XG4iXX0=