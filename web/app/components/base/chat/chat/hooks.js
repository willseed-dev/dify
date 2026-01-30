"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChat = void 0;
const compat_1 = require("es-toolkit/compat");
const function_1 = require("es-toolkit/function");
const immer_1 = require("immer");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const uuid_1 = require("uuid");
const audio_player_manager_1 = require("@/app/components/base/audio-btn/audio.player.manager");
const utils_1 = require("@/app/components/base/file-uploader/utils");
const toast_1 = require("@/app/components/base/toast");
const types_1 = require("@/app/components/workflow/types");
const use_timestamp_1 = require("@/hooks/use-timestamp");
const base_1 = require("@/service/base");
const app_1 = require("@/types/app");
const utils_2 = require("../utils");
const utils_3 = require("./utils");
const useChat = (config, formSettings, prevChatTree, stopChat, clearChatList, clearChatListCallback) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { formatTime } = (0, use_timestamp_1.default)();
    const { notify } = (0, toast_1.useToastContext)();
    const conversationId = (0, react_1.useRef)('');
    const hasStopResponded = (0, react_1.useRef)(false);
    const [isResponding, setIsResponding] = (0, react_1.useState)(false);
    const isRespondingRef = (0, react_1.useRef)(false);
    const taskIdRef = (0, react_1.useRef)('');
    const [suggestedQuestions, setSuggestQuestions] = (0, react_1.useState)([]);
    const conversationMessagesAbortControllerRef = (0, react_1.useRef)(null);
    const suggestedQuestionsAbortControllerRef = (0, react_1.useRef)(null);
    const params = (0, navigation_1.useParams)();
    const pathname = (0, navigation_1.usePathname)();
    const [chatTree, setChatTree] = (0, react_1.useState)(prevChatTree || []);
    const chatTreeRef = (0, react_1.useRef)(chatTree);
    const [targetMessageId, setTargetMessageId] = (0, react_1.useState)();
    const threadMessages = (0, react_1.useMemo)(() => (0, utils_2.getThreadMessages)(chatTree, targetMessageId), [chatTree, targetMessageId]);
    const getIntroduction = (0, react_1.useCallback)((str) => {
        return (0, utils_3.processOpeningStatement)(str, formSettings?.inputs || {}, formSettings?.inputsForm || []);
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
                    suggestedQuestions: config.suggested_questions?.map(item => getIntroduction(item)),
                };
            }
            else {
                ret.unshift({
                    id: 'opening-statement',
                    content: getIntroduction(config.opening_statement),
                    isAnswer: true,
                    isOpeningStatement: true,
                    suggestedQuestions: config.suggested_questions?.map(item => getIntroduction(item)),
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
    const updateChatTreeNode = (0, react_1.useCallback)((id, fieldsOrUpdate) => {
        const nextState = produceChatTreeNode(id, (node) => {
            if (typeof fieldsOrUpdate === 'function') {
                fieldsOrUpdate(node);
            }
            else {
                Object.keys(fieldsOrUpdate).forEach((key) => {
                    node[key] = fieldsOrUpdate[key];
                });
            }
        });
        setChatTree(nextState);
        chatTreeRef.current = nextState;
    }, [produceChatTreeNode]);
    const handleResponding = (0, react_1.useCallback)((isResponding) => {
        setIsResponding(isResponding);
        isRespondingRef.current = isResponding;
    }, []);
    const handleStop = (0, react_1.useCallback)(() => {
        hasStopResponded.current = true;
        handleResponding(false);
        if (stopChat && taskIdRef.current)
            stopChat(taskIdRef.current);
        if (conversationMessagesAbortControllerRef.current)
            conversationMessagesAbortControllerRef.current.abort();
        if (suggestedQuestionsAbortControllerRef.current)
            suggestedQuestionsAbortControllerRef.current.abort();
    }, [stopChat, handleResponding]);
    const handleRestart = (0, react_1.useCallback)((cb) => {
        conversationId.current = '';
        taskIdRef.current = '';
        handleStop();
        setChatTree([]);
        setSuggestQuestions([]);
        cb?.();
    }, [handleStop]);
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
    const handleSend = (0, react_1.useCallback)(async (url, data, { onGetConversationMessages, onGetSuggestedQuestions, onConversationComplete, isPublicAPI, }) => {
        setSuggestQuestions([]);
        if (isRespondingRef.current) {
            notify({ type: 'info', message: t('errorMessage.waitForResponse', { ns: 'appDebug' }) });
            return false;
        }
        const parentMessage = threadMessages.find(item => item.id === data.parent_message_id);
        const placeholderQuestionId = `question-${Date.now()}`;
        const questionItem = {
            id: placeholderQuestionId,
            content: data.query,
            isAnswer: false,
            message_files: data.files,
            parentMessageId: data.parent_message_id,
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
            parentId: data.parent_message_id,
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
        hasStopResponded.current = false;
        const { query, files, inputs, ...restData } = data;
        const bodyParams = {
            response_mode: 'streaming',
            conversation_id: conversationId.current,
            files: (0, utils_1.getProcessedFiles)(files || []),
            query,
            inputs: (0, utils_3.getProcessedInputs)(inputs || {}, formSettings?.inputsForm || []),
            ...restData,
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
        let isAgentMode = false;
        let hasSetResponseId = false;
        let ttsUrl = '';
        let ttsIsPublic = false;
        if (params.token) {
            ttsUrl = '/text-to-audio';
            ttsIsPublic = true;
        }
        else if (params.appId) {
            if (pathname.search('explore/installed') > -1)
                ttsUrl = `/installed-apps/${params.appId}/text-to-audio`;
            else
                ttsUrl = `/apps/${params.appId}/text-to-audio`;
        }
        // Lazy initialization: Only create AudioPlayer when TTS is actually needed
        // This prevents opening audio channel unnecessarily
        let player = null;
        const getOrCreatePlayer = () => {
            if (!player)
                player = audio_player_manager_1.AudioPlayerManager.getInstance().getAudioPlayer(ttsUrl, ttsIsPublic, (0, uuid_1.v4)(), 'none', 'none', function_1.noop);
            return player;
        };
        (0, base_1.ssePost)(url, {
            body: bodyParams,
        }, {
            isPublicAPI,
            onData: (message, isFirstMessage, { conversationId: newConversationId, messageId, taskId }) => {
                if (!isAgentMode) {
                    responseItem.content = responseItem.content + message;
                }
                else {
                    const lastThought = responseItem.agent_thoughts?.[responseItem.agent_thoughts?.length - 1];
                    if (lastThought)
                        lastThought.thought = lastThought.thought + message; // need immer setAutoFreeze
                }
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
                    parentId: data.parent_message_id,
                });
            },
            async onCompleted(hasError) {
                handleResponding(false);
                if (hasError)
                    return;
                if (onConversationComplete)
                    onConversationComplete(conversationId.current);
                if (conversationId.current && !hasStopResponded.current && onGetConversationMessages) {
                    const { data } = await onGetConversationMessages(conversationId.current, newAbortController => conversationMessagesAbortControllerRef.current = newAbortController);
                    const newResponseItem = data.find((item) => item.id === responseItem.id);
                    if (!newResponseItem)
                        return;
                    const isUseAgentThought = newResponseItem.agent_thoughts?.length > 0 && newResponseItem.agent_thoughts[newResponseItem.agent_thoughts?.length - 1].thought === newResponseItem.answer;
                    updateChatTreeNode(responseItem.id, {
                        content: isUseAgentThought ? '' : newResponseItem.answer,
                        log: [
                            ...newResponseItem.message,
                            ...(newResponseItem.message[newResponseItem.message.length - 1].role !== 'assistant'
                                ? [
                                    {
                                        role: 'assistant',
                                        text: newResponseItem.answer,
                                        files: newResponseItem.message_files?.filter((file) => file.belongs_to === 'assistant') || [],
                                    },
                                ]
                                : []),
                        ],
                        more: {
                            time: formatTime(newResponseItem.created_at, 'hh:mm A'),
                            tokens: newResponseItem.answer_tokens + newResponseItem.message_tokens,
                            latency: newResponseItem.provider_response_latency.toFixed(2),
                            tokens_per_second: newResponseItem.provider_response_latency > 0 ? (newResponseItem.answer_tokens / newResponseItem.provider_response_latency).toFixed(2) : undefined,
                        },
                        // for agent log
                        conversationId: conversationId.current,
                        input: {
                            inputs: newResponseItem.inputs,
                            query: newResponseItem.query,
                        },
                    });
                }
                if (config?.suggested_questions_after_answer?.enabled && !hasStopResponded.current && onGetSuggestedQuestions) {
                    try {
                        const { data } = await onGetSuggestedQuestions(responseItem.id, newAbortController => suggestedQuestionsAbortControllerRef.current = newAbortController);
                        setSuggestQuestions(data);
                    }
                    // eslint-disable-next-line unused-imports/no-unused-vars
                    catch (e) {
                        setSuggestQuestions([]);
                    }
                }
            },
            onFile(file) {
                const lastThought = responseItem.agent_thoughts?.[responseItem.agent_thoughts?.length - 1];
                if (lastThought)
                    responseItem.agent_thoughts[responseItem.agent_thoughts.length - 1].message_files = [...lastThought.message_files, file];
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
            onThought(thought) {
                isAgentMode = true;
                const response = responseItem;
                if (thought.message_id && !hasSetResponseId)
                    response.id = thought.message_id;
                if (thought.conversation_id)
                    response.conversationId = thought.conversation_id;
                if (response.agent_thoughts.length === 0) {
                    response.agent_thoughts.push(thought);
                }
                else {
                    const lastThought = response.agent_thoughts[response.agent_thoughts.length - 1];
                    // thought changed but still the same thought, so update.
                    if (lastThought.id === thought.id) {
                        thought.thought = lastThought.thought;
                        thought.message_files = lastThought.message_files;
                        responseItem.agent_thoughts[response.agent_thoughts.length - 1] = thought;
                    }
                    else {
                        responseItem.agent_thoughts.push(thought);
                    }
                }
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
            onMessageEnd: (messageEnd) => {
                if (messageEnd.metadata?.annotation_reply) {
                    responseItem.id = messageEnd.id;
                    responseItem.annotation = ({
                        id: messageEnd.metadata.annotation_reply.id,
                        authorName: messageEnd.metadata.annotation_reply.account.name,
                    });
                    updateCurrentQAOnTree({
                        placeholderQuestionId,
                        questionItem,
                        responseItem,
                        parentId: data.parent_message_id,
                    });
                    return;
                }
                responseItem.citation = messageEnd.metadata?.retriever_resources || [];
                const processedFilesFromResponse = (0, utils_1.getProcessedFilesFromResponse)(messageEnd.files || []);
                responseItem.allFiles = (0, compat_1.uniqBy)([...(responseItem.allFiles || []), ...(processedFilesFromResponse || [])], 'id');
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
            onMessageReplace: (messageReplace) => {
                responseItem.content = messageReplace.answer;
            },
            onError() {
                handleResponding(false);
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
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
                    parentId: data.parent_message_id,
                });
            },
            onWorkflowFinished: ({ data: workflowFinishedData }) => {
                responseItem.workflowProcess.status = workflowFinishedData.status;
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
            onIterationStart: ({ data: iterationStartedData }) => {
                responseItem.workflowProcess.tracing.push({
                    ...iterationStartedData,
                    status: types_1.WorkflowRunningStatus.Running,
                });
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
            onIterationFinish: ({ data: iterationFinishedData }) => {
                const tracing = responseItem.workflowProcess.tracing;
                const iterationIndex = tracing.findIndex(item => item.node_id === iterationFinishedData.node_id
                    && (item.execution_metadata?.parallel_id === iterationFinishedData.execution_metadata?.parallel_id || item.parallel_id === iterationFinishedData.execution_metadata?.parallel_id));
                tracing[iterationIndex] = {
                    ...tracing[iterationIndex],
                    ...iterationFinishedData,
                    status: types_1.WorkflowRunningStatus.Succeeded,
                };
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
            onNodeStarted: ({ data: nodeStartedData }) => {
                if (nodeStartedData.iteration_id)
                    return;
                if (data.loop_id)
                    return;
                responseItem.workflowProcess.tracing.push({
                    ...nodeStartedData,
                    status: types_1.WorkflowRunningStatus.Running,
                });
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
            onNodeFinished: ({ data: nodeFinishedData }) => {
                if (nodeFinishedData.iteration_id)
                    return;
                if (data.loop_id)
                    return;
                const currentIndex = responseItem.workflowProcess.tracing.findIndex((item) => {
                    if (!item.execution_metadata?.parallel_id)
                        return item.node_id === nodeFinishedData.node_id;
                    return item.node_id === nodeFinishedData.node_id && (item.execution_metadata?.parallel_id === nodeFinishedData.execution_metadata?.parallel_id);
                });
                responseItem.workflowProcess.tracing[currentIndex] = nodeFinishedData;
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
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
            onLoopStart: ({ data: loopStartedData }) => {
                responseItem.workflowProcess.tracing.push({
                    ...loopStartedData,
                    status: types_1.WorkflowRunningStatus.Running,
                });
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
            onLoopFinish: ({ data: loopFinishedData }) => {
                const tracing = responseItem.workflowProcess.tracing;
                const loopIndex = tracing.findIndex(item => item.node_id === loopFinishedData.node_id
                    && (item.execution_metadata?.parallel_id === loopFinishedData.execution_metadata?.parallel_id || item.parallel_id === loopFinishedData.execution_metadata?.parallel_id));
                tracing[loopIndex] = {
                    ...tracing[loopIndex],
                    ...loopFinishedData,
                    status: types_1.WorkflowRunningStatus.Succeeded,
                };
                updateCurrentQAOnTree({
                    placeholderQuestionId,
                    questionItem,
                    responseItem,
                    parentId: data.parent_message_id,
                });
            },
        });
        return true;
    }, [
        t,
        chatTree.length,
        threadMessages,
        config?.suggested_questions_after_answer,
        updateCurrentQAOnTree,
        updateChatTreeNode,
        notify,
        handleResponding,
        formatTime,
        params.token,
        params.appId,
        pathname,
        formSettings,
    ]);
    const handleAnnotationEdited = (0, react_1.useCallback)((query, answer, index) => {
        const targetQuestionId = chatList[index - 1].id;
        const targetAnswerId = chatList[index].id;
        updateChatTreeNode(targetQuestionId, {
            content: query,
        });
        updateChatTreeNode(targetAnswerId, {
            content: answer,
            annotation: {
                ...chatList[index].annotation,
                logAnnotation: undefined,
            },
        });
    }, [chatList, updateChatTreeNode]);
    const handleAnnotationAdded = (0, react_1.useCallback)((annotationId, authorName, query, answer, index) => {
        const targetQuestionId = chatList[index - 1].id;
        const targetAnswerId = chatList[index].id;
        updateChatTreeNode(targetQuestionId, {
            content: query,
        });
        updateChatTreeNode(targetAnswerId, {
            content: chatList[index].content,
            annotation: {
                id: annotationId,
                authorName,
                logAnnotation: {
                    content: answer,
                    account: {
                        id: '',
                        name: authorName,
                        email: '',
                    },
                },
            },
        });
    }, [chatList, updateChatTreeNode]);
    const handleAnnotationRemoved = (0, react_1.useCallback)((index) => {
        const targetAnswerId = chatList[index].id;
        updateChatTreeNode(targetAnswerId, {
            content: chatList[index].content,
            annotation: {
                ...chatList[index].annotation,
                id: '',
            },
        });
    }, [chatList, updateChatTreeNode]);
    (0, react_1.useEffect)(() => {
        if (clearChatList)
            handleRestart(() => clearChatListCallback?.(false));
    }, [clearChatList, clearChatListCallback, handleRestart]);
    return {
        chatList,
        setTargetMessageId,
        conversationId: conversationId.current,
        isResponding,
        setIsResponding,
        handleSend,
        suggestedQuestions,
        handleRestart,
        handleStop,
        handleAnnotationEdited,
        handleAnnotationAdded,
        handleAnnotationRemoved,
    };
};
exports.useChat = useChat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFVQSw4Q0FBMEM7QUFDMUMsa0RBQTBDO0FBQzFDLGlDQUE4QztBQUM5QyxnREFBd0Q7QUFDeEQsaUNBTWM7QUFDZCxpREFBOEM7QUFDOUMsK0JBQW1DO0FBQ25DLCtGQUF5RjtBQUN6RixxRUFHa0Q7QUFDbEQsdURBQTZEO0FBQzdELDJEQUF1RTtBQUN2RSx5REFBZ0Q7QUFDaEQseUNBQXdDO0FBQ3hDLHFDQUE0QztBQUM1QyxvQ0FBNEM7QUFDNUMsbUNBR2dCO0FBVVQsTUFBTSxPQUFPLEdBQUcsQ0FDckIsTUFBbUIsRUFDbkIsWUFHQyxFQUNELFlBQStCLEVBQy9CLFFBQW1DLEVBQ25DLGFBQXVCLEVBQ3ZCLHFCQUFnRCxFQUNoRCxFQUFFO0lBQ0YsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFBLHVCQUFZLEdBQUUsQ0FBQTtJQUNyQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFDcEMsTUFBTSxjQUFjLEdBQUcsSUFBQSxjQUFNLEVBQUMsRUFBRSxDQUFDLENBQUE7SUFDakMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLGNBQU0sRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUN0QyxNQUFNLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUN2RCxNQUFNLGVBQWUsR0FBRyxJQUFBLGNBQU0sRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUNyQyxNQUFNLFNBQVMsR0FBRyxJQUFBLGNBQU0sRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUM1QixNQUFNLENBQUMsa0JBQWtCLEVBQUUsbUJBQW1CLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQVcsRUFB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LEVBQUUsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO0lBRWxDLE1BQU0sdUJBQXVCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsS0FBYSxFQUFFLEVBQUU7UUFDNUQsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUV6QyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUU7WUFDakMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPO1lBQ2hDLFVBQVUsRUFBRTtnQkFDVixHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVO2dCQUM3QixFQUFFLEVBQUUsRUFBRTthQUNPO1NBQ2hCLENBQUMsQ0FBQTtJQUNKLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUE7SUFFbEMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLElBQUksYUFBYTtZQUNmLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDdkQsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLHFCQUFxQixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFekQsT0FBTztRQUNMLFFBQVE7UUFDUixrQkFBa0I7UUFDbEIsY0FBYyxFQUFFLGNBQWMsQ0FBQyxPQUFPO1FBQ3RDLFlBQVk7UUFDWixlQUFlO1FBQ2YsVUFBVTtRQUNWLGtCQUFrQjtRQUNsQixhQUFhO1FBQ2IsVUFBVTtRQUNWLHNCQUFzQjtRQUN0QixxQkFBcUI7UUFDckIsdUJBQXVCO0tBQ3hCLENBQUE7QUFDSCxDQUFDLENBQUE7QUF2cUJZLFFBQUEsT0FBTyxXQXVxQm5CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUge1xuICBDaGF0Q29uZmlnLFxuICBDaGF0SXRlbSxcbiAgQ2hhdEl0ZW1JblRyZWUsXG4gIElucHV0cyxcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IElucHV0Rm9ybSB9IGZyb20gJy4vdHlwZSdcbmltcG9ydCB0eXBlIEF1ZGlvUGxheWVyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hdWRpby1idG4vYXVkaW8nXG5pbXBvcnQgdHlwZSB7IEZpbGVFbnRpdHkgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci90eXBlcydcbmltcG9ydCB0eXBlIHsgQW5ub3RhdGlvbiB9IGZyb20gJ0AvbW9kZWxzL2xvZydcbmltcG9ydCB7IHVuaXFCeSB9IGZyb20gJ2VzLXRvb2xraXQvY29tcGF0J1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJ2VzLXRvb2xraXQvZnVuY3Rpb24nXG5pbXBvcnQgeyBwcm9kdWNlLCBzZXRBdXRvRnJlZXplIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgeyB1c2VQYXJhbXMsIHVzZVBhdGhuYW1lIH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHtcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB2NCBhcyB1dWlkVjQgfSBmcm9tICd1dWlkJ1xuaW1wb3J0IHsgQXVkaW9QbGF5ZXJNYW5hZ2VyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2F1ZGlvLWJ0bi9hdWRpby5wbGF5ZXIubWFuYWdlcidcbmltcG9ydCB7XG4gIGdldFByb2Nlc3NlZEZpbGVzLFxuICBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZpbGUtdXBsb2FkZXIvdXRpbHMnXG5pbXBvcnQgeyB1c2VUb2FzdENvbnRleHQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBXb3JrZmxvd1J1bm5pbmdTdGF0dXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHVzZVRpbWVzdGFtcCBmcm9tICdAL2hvb2tzL3VzZS10aW1lc3RhbXAnXG5pbXBvcnQgeyBzc2VQb3N0IH0gZnJvbSAnQC9zZXJ2aWNlL2Jhc2UnXG5pbXBvcnQgeyBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgZ2V0VGhyZWFkTWVzc2FnZXMgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7XG4gIGdldFByb2Nlc3NlZElucHV0cyxcbiAgcHJvY2Vzc09wZW5pbmdTdGF0ZW1lbnQsXG59IGZyb20gJy4vdXRpbHMnXG5cbnR5cGUgR2V0QWJvcnRDb250cm9sbGVyID0gKGFib3J0Q29udHJvbGxlcjogQWJvcnRDb250cm9sbGVyKSA9PiB2b2lkXG50eXBlIFNlbmRDYWxsYmFjayA9IHtcbiAgb25HZXRDb252ZXJzYXRpb25NZXNzYWdlcz86IChjb252ZXJzYXRpb25JZDogc3RyaW5nLCBnZXRBYm9ydENvbnRyb2xsZXI6IEdldEFib3J0Q29udHJvbGxlcikgPT4gUHJvbWlzZTxhbnk+XG4gIG9uR2V0U3VnZ2VzdGVkUXVlc3Rpb25zPzogKHJlc3BvbnNlSXRlbUlkOiBzdHJpbmcsIGdldEFib3J0Q29udHJvbGxlcjogR2V0QWJvcnRDb250cm9sbGVyKSA9PiBQcm9taXNlPGFueT5cbiAgb25Db252ZXJzYXRpb25Db21wbGV0ZT86IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB2b2lkXG4gIGlzUHVibGljQVBJPzogYm9vbGVhblxufVxuXG5leHBvcnQgY29uc3QgdXNlQ2hhdCA9IChcbiAgY29uZmlnPzogQ2hhdENvbmZpZyxcbiAgZm9ybVNldHRpbmdzPzoge1xuICAgIGlucHV0czogSW5wdXRzXG4gICAgaW5wdXRzRm9ybTogSW5wdXRGb3JtW11cbiAgfSxcbiAgcHJldkNoYXRUcmVlPzogQ2hhdEl0ZW1JblRyZWVbXSxcbiAgc3RvcENoYXQ/OiAodGFza0lkOiBzdHJpbmcpID0+IHZvaWQsXG4gIGNsZWFyQ2hhdExpc3Q/OiBib29sZWFuLFxuICBjbGVhckNoYXRMaXN0Q2FsbGJhY2s/OiAoc3RhdGU6IGJvb2xlYW4pID0+IHZvaWQsXG4pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgZm9ybWF0VGltZSB9ID0gdXNlVGltZXN0YW1wKClcbiAgY29uc3QgeyBub3RpZnkgfSA9IHVzZVRvYXN0Q29udGV4dCgpXG4gIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gdXNlUmVmKCcnKVxuICBjb25zdCBoYXNTdG9wUmVzcG9uZGVkID0gdXNlUmVmKGZhbHNlKVxuICBjb25zdCBbaXNSZXNwb25kaW5nLCBzZXRJc1Jlc3BvbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGlzUmVzcG9uZGluZ1JlZiA9IHVzZVJlZihmYWxzZSlcbiAgY29uc3QgdGFza0lkUmVmID0gdXNlUmVmKCcnKVxuICBjb25zdCBbc3VnZ2VzdGVkUXVlc3Rpb25zLCBzZXRTdWdnZXN0UXVlc3Rpb25zXSA9IHVzZVN0YXRlPHN0cmluZ1tdPihbXSlcbiAgY29uc3QgY29udmVyc2F0aW9uTWVzc2FnZXNBYm9ydENvbnRyb2xsZXJSZWYgPSB1c2VSZWY8QWJvcnRDb250cm9sbGVyIHwgbnVsbD4obnVsbClcbiAgY29uc3Qgc3VnZ2VzdGVkUXVlc3Rpb25zQWJvcnRDb250cm9sbGVyUmVmID0gdXNlUmVmPEFib3J0Q29udHJvbGxlciB8IG51bGw+KG51bGwpXG4gIGNvbnN0IHBhcmFtcyA9IHVzZVBhcmFtcygpXG4gIGNvbnN0IHBhdGhuYW1lID0gdXNlUGF0aG5hbWUoKVxuXG4gIGNvbnN0IFtjaGF0VHJlZSwgc2V0Q2hhdFRyZWVdID0gdXNlU3RhdGU8Q2hhdEl0ZW1JblRyZWVbXT4ocHJldkNoYXRUcmVlIHx8IFtdKVxuICBjb25zdCBjaGF0VHJlZVJlZiA9IHVzZVJlZjxDaGF0SXRlbUluVHJlZVtdPihjaGF0VHJlZSlcbiAgY29uc3QgW3RhcmdldE1lc3NhZ2VJZCwgc2V0VGFyZ2V0TWVzc2FnZUlkXSA9IHVzZVN0YXRlPHN0cmluZz4oKVxuICBjb25zdCB0aHJlYWRNZXNzYWdlcyA9IHVzZU1lbW8oKCkgPT4gZ2V0VGhyZWFkTWVzc2FnZXMoY2hhdFRyZWUsIHRhcmdldE1lc3NhZ2VJZCksIFtjaGF0VHJlZSwgdGFyZ2V0TWVzc2FnZUlkXSlcblxuICBjb25zdCBnZXRJbnRyb2R1Y3Rpb24gPSB1c2VDYWxsYmFjaygoc3RyOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gcHJvY2Vzc09wZW5pbmdTdGF0ZW1lbnQoc3RyLCBmb3JtU2V0dGluZ3M/LmlucHV0cyB8fCB7fSwgZm9ybVNldHRpbmdzPy5pbnB1dHNGb3JtIHx8IFtdKVxuICB9LCBbZm9ybVNldHRpbmdzPy5pbnB1dHMsIGZvcm1TZXR0aW5ncz8uaW5wdXRzRm9ybV0pXG5cbiAgLyoqIEZpbmFsIGNoYXQgbGlzdCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgKi9cbiAgY29uc3QgY2hhdExpc3QgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCByZXQgPSBbLi4udGhyZWFkTWVzc2FnZXNdXG4gICAgaWYgKGNvbmZpZz8ub3BlbmluZ19zdGF0ZW1lbnQpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhyZWFkTWVzc2FnZXMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5pc09wZW5pbmdTdGF0ZW1lbnQpXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICByZXRbaW5kZXhdID0ge1xuICAgICAgICAgIC4uLnJldFtpbmRleF0sXG4gICAgICAgICAgY29udGVudDogZ2V0SW50cm9kdWN0aW9uKGNvbmZpZy5vcGVuaW5nX3N0YXRlbWVudCksXG4gICAgICAgICAgc3VnZ2VzdGVkUXVlc3Rpb25zOiBjb25maWcuc3VnZ2VzdGVkX3F1ZXN0aW9ucz8ubWFwKGl0ZW0gPT4gZ2V0SW50cm9kdWN0aW9uKGl0ZW0pKSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldC51bnNoaWZ0KHtcbiAgICAgICAgICBpZDogJ29wZW5pbmctc3RhdGVtZW50JyxcbiAgICAgICAgICBjb250ZW50OiBnZXRJbnRyb2R1Y3Rpb24oY29uZmlnLm9wZW5pbmdfc3RhdGVtZW50KSxcbiAgICAgICAgICBpc0Fuc3dlcjogdHJ1ZSxcbiAgICAgICAgICBpc09wZW5pbmdTdGF0ZW1lbnQ6IHRydWUsXG4gICAgICAgICAgc3VnZ2VzdGVkUXVlc3Rpb25zOiBjb25maWcuc3VnZ2VzdGVkX3F1ZXN0aW9ucz8ubWFwKGl0ZW0gPT4gZ2V0SW50cm9kdWN0aW9uKGl0ZW0pKSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldFxuICB9LCBbdGhyZWFkTWVzc2FnZXMsIGNvbmZpZz8ub3BlbmluZ19zdGF0ZW1lbnQsIGdldEludHJvZHVjdGlvbiwgY29uZmlnPy5zdWdnZXN0ZWRfcXVlc3Rpb25zXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldEF1dG9GcmVlemUoZmFsc2UpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHNldEF1dG9GcmVlemUodHJ1ZSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIC8qKiBGaW5kIHRoZSB0YXJnZXQgbm9kZSBieSBiZnMgYW5kIHRoZW4gb3BlcmF0ZSBvbiBpdCAqL1xuICBjb25zdCBwcm9kdWNlQ2hhdFRyZWVOb2RlID0gdXNlQ2FsbGJhY2soKHRhcmdldElkOiBzdHJpbmcsIG9wZXJhdGlvbjogKG5vZGU6IENoYXRJdGVtSW5UcmVlKSA9PiB2b2lkKSA9PiB7XG4gICAgcmV0dXJuIHByb2R1Y2UoY2hhdFRyZWVSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBjb25zdCBxdWV1ZTogQ2hhdEl0ZW1JblRyZWVbXSA9IFsuLi5kcmFmdF1cbiAgICAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBxdWV1ZS5zaGlmdCgpIVxuICAgICAgICBpZiAoY3VycmVudC5pZCA9PT0gdGFyZ2V0SWQpIHtcbiAgICAgICAgICBvcGVyYXRpb24oY3VycmVudClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50LmNoaWxkcmVuKVxuICAgICAgICAgIHF1ZXVlLnB1c2goLi4uY3VycmVudC5jaGlsZHJlbilcbiAgICAgIH1cbiAgICB9KVxuICB9LCBbXSlcblxuICB0eXBlIFVwZGF0ZUNoYXRUcmVlTm9kZSA9IHtcbiAgICAoaWQ6IHN0cmluZywgZmllbGRzOiBQYXJ0aWFsPENoYXRJdGVtSW5UcmVlPik6IHZvaWRcbiAgICAoaWQ6IHN0cmluZywgdXBkYXRlOiAobm9kZTogQ2hhdEl0ZW1JblRyZWUpID0+IHZvaWQpOiB2b2lkXG4gIH1cblxuICBjb25zdCB1cGRhdGVDaGF0VHJlZU5vZGU6IFVwZGF0ZUNoYXRUcmVlTm9kZSA9IHVzZUNhbGxiYWNrKChcbiAgICBpZDogc3RyaW5nLFxuICAgIGZpZWxkc09yVXBkYXRlOiBQYXJ0aWFsPENoYXRJdGVtSW5UcmVlPiB8ICgobm9kZTogQ2hhdEl0ZW1JblRyZWUpID0+IHZvaWQpLFxuICApID0+IHtcbiAgICBjb25zdCBuZXh0U3RhdGUgPSBwcm9kdWNlQ2hhdFRyZWVOb2RlKGlkLCAobm9kZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZHNPclVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmaWVsZHNPclVwZGF0ZShub2RlKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGZpZWxkc09yVXBkYXRlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAobm9kZSBhcyBhbnkpW2tleV0gPSAoZmllbGRzT3JVcGRhdGUgYXMgYW55KVtrZXldXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgICBzZXRDaGF0VHJlZShuZXh0U3RhdGUpXG4gICAgY2hhdFRyZWVSZWYuY3VycmVudCA9IG5leHRTdGF0ZVxuICB9LCBbcHJvZHVjZUNoYXRUcmVlTm9kZV0pXG5cbiAgY29uc3QgaGFuZGxlUmVzcG9uZGluZyA9IHVzZUNhbGxiYWNrKChpc1Jlc3BvbmRpbmc6IGJvb2xlYW4pID0+IHtcbiAgICBzZXRJc1Jlc3BvbmRpbmcoaXNSZXNwb25kaW5nKVxuICAgIGlzUmVzcG9uZGluZ1JlZi5jdXJyZW50ID0gaXNSZXNwb25kaW5nXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZVN0b3AgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaGFzU3RvcFJlc3BvbmRlZC5jdXJyZW50ID0gdHJ1ZVxuICAgIGhhbmRsZVJlc3BvbmRpbmcoZmFsc2UpXG4gICAgaWYgKHN0b3BDaGF0ICYmIHRhc2tJZFJlZi5jdXJyZW50KVxuICAgICAgc3RvcENoYXQodGFza0lkUmVmLmN1cnJlbnQpXG4gICAgaWYgKGNvbnZlcnNhdGlvbk1lc3NhZ2VzQWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQpXG4gICAgICBjb252ZXJzYXRpb25NZXNzYWdlc0Fib3J0Q29udHJvbGxlclJlZi5jdXJyZW50LmFib3J0KClcbiAgICBpZiAoc3VnZ2VzdGVkUXVlc3Rpb25zQWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQpXG4gICAgICBzdWdnZXN0ZWRRdWVzdGlvbnNBYm9ydENvbnRyb2xsZXJSZWYuY3VycmVudC5hYm9ydCgpXG4gIH0sIFtzdG9wQ2hhdCwgaGFuZGxlUmVzcG9uZGluZ10pXG5cbiAgY29uc3QgaGFuZGxlUmVzdGFydCA9IHVzZUNhbGxiYWNrKChjYj86IGFueSkgPT4ge1xuICAgIGNvbnZlcnNhdGlvbklkLmN1cnJlbnQgPSAnJ1xuICAgIHRhc2tJZFJlZi5jdXJyZW50ID0gJydcbiAgICBoYW5kbGVTdG9wKClcbiAgICBzZXRDaGF0VHJlZShbXSlcbiAgICBzZXRTdWdnZXN0UXVlc3Rpb25zKFtdKVxuICAgIGNiPy4oKVxuICB9LCBbaGFuZGxlU3RvcF0pXG5cbiAgY29uc3QgdXBkYXRlQ3VycmVudFFBT25UcmVlID0gdXNlQ2FsbGJhY2soKHtcbiAgICBwYXJlbnRJZCxcbiAgICByZXNwb25zZUl0ZW0sXG4gICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgIHF1ZXN0aW9uSXRlbSxcbiAgfToge1xuICAgIHBhcmVudElkPzogc3RyaW5nXG4gICAgcmVzcG9uc2VJdGVtOiBDaGF0SXRlbVxuICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZDogc3RyaW5nXG4gICAgcXVlc3Rpb25JdGVtOiBDaGF0SXRlbVxuICB9KSA9PiB7XG4gICAgbGV0IG5leHRTdGF0ZTogQ2hhdEl0ZW1JblRyZWVbXVxuICAgIGNvbnN0IGN1cnJlbnRRQSA9IHsgLi4ucXVlc3Rpb25JdGVtLCBjaGlsZHJlbjogW3sgLi4ucmVzcG9uc2VJdGVtLCBjaGlsZHJlbjogW10gfV0gfVxuICAgIGlmICghcGFyZW50SWQgJiYgIWNoYXRUcmVlLnNvbWUoaXRlbSA9PiBbcGxhY2Vob2xkZXJRdWVzdGlvbklkLCBxdWVzdGlvbkl0ZW0uaWRdLmluY2x1ZGVzKGl0ZW0uaWQpKSkge1xuICAgICAgLy8gUUEgd2hvc2UgcGFyZW50IGlzIG5vdCBwcm92aWRlZCBpcyBjb25zaWRlcmVkIGFzIGEgZmlyc3QgbWVzc2FnZSBvZiB0aGUgY29udmVyc2F0aW9uLFxuICAgICAgLy8gYW5kIGl0IHNob3VsZCBiZSBhIHJvb3Qgbm9kZSBvZiB0aGUgY2hhdCB0cmVlXG4gICAgICBuZXh0U3RhdGUgPSBwcm9kdWNlKGNoYXRUcmVlLCAoZHJhZnQpID0+IHtcbiAgICAgICAgZHJhZnQucHVzaChjdXJyZW50UUEpXG4gICAgICB9KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIGZpbmQgdGhlIHRhcmdldCBRQSBpbiB0aGUgdHJlZSBhbmQgdXBkYXRlIGl0OyBpZiBub3QgZm91bmQsIGluc2VydCBpdCB0byBpdHMgcGFyZW50IG5vZGVcbiAgICAgIG5leHRTdGF0ZSA9IHByb2R1Y2VDaGF0VHJlZU5vZGUocGFyZW50SWQhLCAocGFyZW50Tm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBxdWVzdGlvbk5vZGVJbmRleCA9IHBhcmVudE5vZGUuY2hpbGRyZW4hLmZpbmRJbmRleChpdGVtID0+IFtwbGFjZWhvbGRlclF1ZXN0aW9uSWQsIHF1ZXN0aW9uSXRlbS5pZF0uaW5jbHVkZXMoaXRlbS5pZCkpXG4gICAgICAgIGlmIChxdWVzdGlvbk5vZGVJbmRleCA9PT0gLTEpXG4gICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHJlbiEucHVzaChjdXJyZW50UUEpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcmVuIVtxdWVzdGlvbk5vZGVJbmRleF0gPSBjdXJyZW50UUFcbiAgICAgIH0pXG4gICAgfVxuICAgIHNldENoYXRUcmVlKG5leHRTdGF0ZSlcbiAgICBjaGF0VHJlZVJlZi5jdXJyZW50ID0gbmV4dFN0YXRlXG4gIH0sIFtjaGF0VHJlZSwgcHJvZHVjZUNoYXRUcmVlTm9kZV0pXG5cbiAgY29uc3QgaGFuZGxlU2VuZCA9IHVzZUNhbGxiYWNrKGFzeW5jIChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhOiB7XG4gICAgICBxdWVyeTogc3RyaW5nXG4gICAgICBmaWxlcz86IEZpbGVFbnRpdHlbXVxuICAgICAgcGFyZW50X21lc3NhZ2VfaWQ/OiBzdHJpbmdcbiAgICAgIFtrZXk6IHN0cmluZ106IGFueVxuICAgIH0sXG4gICAge1xuICAgICAgb25HZXRDb252ZXJzYXRpb25NZXNzYWdlcyxcbiAgICAgIG9uR2V0U3VnZ2VzdGVkUXVlc3Rpb25zLFxuICAgICAgb25Db252ZXJzYXRpb25Db21wbGV0ZSxcbiAgICAgIGlzUHVibGljQVBJLFxuICAgIH06IFNlbmRDYWxsYmFjayxcbiAgKSA9PiB7XG4gICAgc2V0U3VnZ2VzdFF1ZXN0aW9ucyhbXSlcblxuICAgIGlmIChpc1Jlc3BvbmRpbmdSZWYuY3VycmVudCkge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2luZm8nLCBtZXNzYWdlOiB0KCdlcnJvck1lc3NhZ2Uud2FpdEZvclJlc3BvbnNlJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgcGFyZW50TWVzc2FnZSA9IHRocmVhZE1lc3NhZ2VzLmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBkYXRhLnBhcmVudF9tZXNzYWdlX2lkKVxuXG4gICAgY29uc3QgcGxhY2Vob2xkZXJRdWVzdGlvbklkID0gYHF1ZXN0aW9uLSR7RGF0ZS5ub3coKX1gXG4gICAgY29uc3QgcXVlc3Rpb25JdGVtID0ge1xuICAgICAgaWQ6IHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgIGNvbnRlbnQ6IGRhdGEucXVlcnksXG4gICAgICBpc0Fuc3dlcjogZmFsc2UsXG4gICAgICBtZXNzYWdlX2ZpbGVzOiBkYXRhLmZpbGVzLFxuICAgICAgcGFyZW50TWVzc2FnZUlkOiBkYXRhLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgIH1cblxuICAgIGNvbnN0IHBsYWNlaG9sZGVyQW5zd2VySWQgPSBgYW5zd2VyLXBsYWNlaG9sZGVyLSR7RGF0ZS5ub3coKX1gXG4gICAgY29uc3QgcGxhY2Vob2xkZXJBbnN3ZXJJdGVtID0ge1xuICAgICAgaWQ6IHBsYWNlaG9sZGVyQW5zd2VySWQsXG4gICAgICBjb250ZW50OiAnJyxcbiAgICAgIGlzQW5zd2VyOiB0cnVlLFxuICAgICAgcGFyZW50TWVzc2FnZUlkOiBxdWVzdGlvbkl0ZW0uaWQsXG4gICAgICBzaWJsaW5nSW5kZXg6IHBhcmVudE1lc3NhZ2U/LmNoaWxkcmVuPy5sZW5ndGggPz8gY2hhdFRyZWUubGVuZ3RoLFxuICAgIH1cblxuICAgIHNldFRhcmdldE1lc3NhZ2VJZChwYXJlbnRNZXNzYWdlPy5pZClcbiAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgcGFyZW50SWQ6IGRhdGEucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICByZXNwb25zZUl0ZW06IHBsYWNlaG9sZGVyQW5zd2VySXRlbSxcbiAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgIHF1ZXN0aW9uSXRlbSxcbiAgICB9KVxuXG4gICAgLy8gYW5zd2VyXG4gICAgY29uc3QgcmVzcG9uc2VJdGVtOiBDaGF0SXRlbUluVHJlZSA9IHtcbiAgICAgIGlkOiBwbGFjZWhvbGRlckFuc3dlcklkLFxuICAgICAgY29udGVudDogJycsXG4gICAgICBhZ2VudF90aG91Z2h0czogW10sXG4gICAgICBtZXNzYWdlX2ZpbGVzOiBbXSxcbiAgICAgIGlzQW5zd2VyOiB0cnVlLFxuICAgICAgcGFyZW50TWVzc2FnZUlkOiBxdWVzdGlvbkl0ZW0uaWQsXG4gICAgICBzaWJsaW5nSW5kZXg6IHBhcmVudE1lc3NhZ2U/LmNoaWxkcmVuPy5sZW5ndGggPz8gY2hhdFRyZWUubGVuZ3RoLFxuICAgIH1cblxuICAgIGhhbmRsZVJlc3BvbmRpbmcodHJ1ZSlcbiAgICBoYXNTdG9wUmVzcG9uZGVkLmN1cnJlbnQgPSBmYWxzZVxuXG4gICAgY29uc3QgeyBxdWVyeSwgZmlsZXMsIGlucHV0cywgLi4ucmVzdERhdGEgfSA9IGRhdGFcbiAgICBjb25zdCBib2R5UGFyYW1zID0ge1xuICAgICAgcmVzcG9uc2VfbW9kZTogJ3N0cmVhbWluZycsXG4gICAgICBjb252ZXJzYXRpb25faWQ6IGNvbnZlcnNhdGlvbklkLmN1cnJlbnQsXG4gICAgICBmaWxlczogZ2V0UHJvY2Vzc2VkRmlsZXMoZmlsZXMgfHwgW10pLFxuICAgICAgcXVlcnksXG4gICAgICBpbnB1dHM6IGdldFByb2Nlc3NlZElucHV0cyhpbnB1dHMgfHwge30sIGZvcm1TZXR0aW5ncz8uaW5wdXRzRm9ybSB8fCBbXSksXG4gICAgICAuLi5yZXN0RGF0YSxcbiAgICB9XG4gICAgaWYgKGJvZHlQYXJhbXM/LmZpbGVzPy5sZW5ndGgpIHtcbiAgICAgIGJvZHlQYXJhbXMuZmlsZXMgPSBib2R5UGFyYW1zLmZpbGVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS50cmFuc2Zlcl9tZXRob2QgPT09IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxldCBpc0FnZW50TW9kZSA9IGZhbHNlXG4gICAgbGV0IGhhc1NldFJlc3BvbnNlSWQgPSBmYWxzZVxuXG4gICAgbGV0IHR0c1VybCA9ICcnXG4gICAgbGV0IHR0c0lzUHVibGljID0gZmFsc2VcbiAgICBpZiAocGFyYW1zLnRva2VuKSB7XG4gICAgICB0dHNVcmwgPSAnL3RleHQtdG8tYXVkaW8nXG4gICAgICB0dHNJc1B1YmxpYyA9IHRydWVcbiAgICB9XG4gICAgZWxzZSBpZiAocGFyYW1zLmFwcElkKSB7XG4gICAgICBpZiAocGF0aG5hbWUuc2VhcmNoKCdleHBsb3JlL2luc3RhbGxlZCcpID4gLTEpXG4gICAgICAgIHR0c1VybCA9IGAvaW5zdGFsbGVkLWFwcHMvJHtwYXJhbXMuYXBwSWR9L3RleHQtdG8tYXVkaW9gXG4gICAgICBlbHNlXG4gICAgICAgIHR0c1VybCA9IGAvYXBwcy8ke3BhcmFtcy5hcHBJZH0vdGV4dC10by1hdWRpb2BcbiAgICB9XG4gICAgLy8gTGF6eSBpbml0aWFsaXphdGlvbjogT25seSBjcmVhdGUgQXVkaW9QbGF5ZXIgd2hlbiBUVFMgaXMgYWN0dWFsbHkgbmVlZGVkXG4gICAgLy8gVGhpcyBwcmV2ZW50cyBvcGVuaW5nIGF1ZGlvIGNoYW5uZWwgdW5uZWNlc3NhcmlseVxuICAgIGxldCBwbGF5ZXI6IEF1ZGlvUGxheWVyIHwgbnVsbCA9IG51bGxcbiAgICBjb25zdCBnZXRPckNyZWF0ZVBsYXllciA9ICgpID0+IHtcbiAgICAgIGlmICghcGxheWVyKVxuICAgICAgICBwbGF5ZXIgPSBBdWRpb1BsYXllck1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5nZXRBdWRpb1BsYXllcih0dHNVcmwsIHR0c0lzUHVibGljLCB1dWlkVjQoKSwgJ25vbmUnLCAnbm9uZScsIG5vb3ApXG5cbiAgICAgIHJldHVybiBwbGF5ZXJcbiAgICB9XG5cbiAgICBzc2VQb3N0KFxuICAgICAgdXJsLFxuICAgICAge1xuICAgICAgICBib2R5OiBib2R5UGFyYW1zLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaXNQdWJsaWNBUEksXG4gICAgICAgIG9uRGF0YTogKG1lc3NhZ2U6IHN0cmluZywgaXNGaXJzdE1lc3NhZ2U6IGJvb2xlYW4sIHsgY29udmVyc2F0aW9uSWQ6IG5ld0NvbnZlcnNhdGlvbklkLCBtZXNzYWdlSWQsIHRhc2tJZCB9OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIWlzQWdlbnRNb2RlKSB7XG4gICAgICAgICAgICByZXNwb25zZUl0ZW0uY29udGVudCA9IHJlc3BvbnNlSXRlbS5jb250ZW50ICsgbWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RUaG91Z2h0ID0gcmVzcG9uc2VJdGVtLmFnZW50X3Rob3VnaHRzPy5bcmVzcG9uc2VJdGVtLmFnZW50X3Rob3VnaHRzPy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgaWYgKGxhc3RUaG91Z2h0KVxuICAgICAgICAgICAgICBsYXN0VGhvdWdodC50aG91Z2h0ID0gbGFzdFRob3VnaHQudGhvdWdodCArIG1lc3NhZ2UgLy8gbmVlZCBpbW1lciBzZXRBdXRvRnJlZXplXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG1lc3NhZ2VJZCAmJiAhaGFzU2V0UmVzcG9uc2VJZCkge1xuICAgICAgICAgICAgcXVlc3Rpb25JdGVtLmlkID0gYHF1ZXN0aW9uLSR7bWVzc2FnZUlkfWBcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbS5pZCA9IG1lc3NhZ2VJZFxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLnBhcmVudE1lc3NhZ2VJZCA9IHF1ZXN0aW9uSXRlbS5pZFxuICAgICAgICAgICAgaGFzU2V0UmVzcG9uc2VJZCA9IHRydWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNGaXJzdE1lc3NhZ2UgJiYgbmV3Q29udmVyc2F0aW9uSWQpXG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZC5jdXJyZW50ID0gbmV3Q29udmVyc2F0aW9uSWRcblxuICAgICAgICAgIHRhc2tJZFJlZi5jdXJyZW50ID0gdGFza0lkXG4gICAgICAgICAgaWYgKG1lc3NhZ2VJZClcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbS5pZCA9IG1lc3NhZ2VJZFxuXG4gICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgIHF1ZXN0aW9uSXRlbSxcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgIHBhcmVudElkOiBkYXRhLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIG9uQ29tcGxldGVkKGhhc0Vycm9yPzogYm9vbGVhbikge1xuICAgICAgICAgIGhhbmRsZVJlc3BvbmRpbmcoZmFsc2UpXG5cbiAgICAgICAgICBpZiAoaGFzRXJyb3IpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIGlmIChvbkNvbnZlcnNhdGlvbkNvbXBsZXRlKVxuICAgICAgICAgICAgb25Db252ZXJzYXRpb25Db21wbGV0ZShjb252ZXJzYXRpb25JZC5jdXJyZW50KVxuXG4gICAgICAgICAgaWYgKGNvbnZlcnNhdGlvbklkLmN1cnJlbnQgJiYgIWhhc1N0b3BSZXNwb25kZWQuY3VycmVudCAmJiBvbkdldENvbnZlcnNhdGlvbk1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEgfTogYW55ID0gYXdhaXQgb25HZXRDb252ZXJzYXRpb25NZXNzYWdlcyhcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQuY3VycmVudCxcbiAgICAgICAgICAgICAgbmV3QWJvcnRDb250cm9sbGVyID0+IGNvbnZlcnNhdGlvbk1lc3NhZ2VzQWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBuZXdBYm9ydENvbnRyb2xsZXIsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBjb25zdCBuZXdSZXNwb25zZUl0ZW0gPSBkYXRhLmZpbmQoKGl0ZW06IGFueSkgPT4gaXRlbS5pZCA9PT0gcmVzcG9uc2VJdGVtLmlkKVxuICAgICAgICAgICAgaWYgKCFuZXdSZXNwb25zZUl0ZW0pXG4gICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBjb25zdCBpc1VzZUFnZW50VGhvdWdodCA9IG5ld1Jlc3BvbnNlSXRlbS5hZ2VudF90aG91Z2h0cz8ubGVuZ3RoID4gMCAmJiBuZXdSZXNwb25zZUl0ZW0uYWdlbnRfdGhvdWdodHNbbmV3UmVzcG9uc2VJdGVtLmFnZW50X3Rob3VnaHRzPy5sZW5ndGggLSAxXS50aG91Z2h0ID09PSBuZXdSZXNwb25zZUl0ZW0uYW5zd2VyXG4gICAgICAgICAgICB1cGRhdGVDaGF0VHJlZU5vZGUocmVzcG9uc2VJdGVtLmlkLCB7XG4gICAgICAgICAgICAgIGNvbnRlbnQ6IGlzVXNlQWdlbnRUaG91Z2h0ID8gJycgOiBuZXdSZXNwb25zZUl0ZW0uYW5zd2VyLFxuICAgICAgICAgICAgICBsb2c6IFtcbiAgICAgICAgICAgICAgICAuLi5uZXdSZXNwb25zZUl0ZW0ubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAuLi4obmV3UmVzcG9uc2VJdGVtLm1lc3NhZ2VbbmV3UmVzcG9uc2VJdGVtLm1lc3NhZ2UubGVuZ3RoIC0gMV0ucm9sZSAhPT0gJ2Fzc2lzdGFudCdcbiAgICAgICAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6ICdhc3Npc3RhbnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogbmV3UmVzcG9uc2VJdGVtLmFuc3dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBuZXdSZXNwb25zZUl0ZW0ubWVzc2FnZV9maWxlcz8uZmlsdGVyKChmaWxlOiBhbnkpID0+IGZpbGUuYmVsb25nc190byA9PT0gJ2Fzc2lzdGFudCcpIHx8IFtdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBtb3JlOiB7XG4gICAgICAgICAgICAgICAgdGltZTogZm9ybWF0VGltZShuZXdSZXNwb25zZUl0ZW0uY3JlYXRlZF9hdCwgJ2hoOm1tIEEnKSxcbiAgICAgICAgICAgICAgICB0b2tlbnM6IG5ld1Jlc3BvbnNlSXRlbS5hbnN3ZXJfdG9rZW5zICsgbmV3UmVzcG9uc2VJdGVtLm1lc3NhZ2VfdG9rZW5zLFxuICAgICAgICAgICAgICAgIGxhdGVuY3k6IG5ld1Jlc3BvbnNlSXRlbS5wcm92aWRlcl9yZXNwb25zZV9sYXRlbmN5LnRvRml4ZWQoMiksXG4gICAgICAgICAgICAgICAgdG9rZW5zX3Blcl9zZWNvbmQ6IG5ld1Jlc3BvbnNlSXRlbS5wcm92aWRlcl9yZXNwb25zZV9sYXRlbmN5ID4gMCA/IChuZXdSZXNwb25zZUl0ZW0uYW5zd2VyX3Rva2VucyAvIG5ld1Jlc3BvbnNlSXRlbS5wcm92aWRlcl9yZXNwb25zZV9sYXRlbmN5KS50b0ZpeGVkKDIpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAvLyBmb3IgYWdlbnQgbG9nXG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBjb252ZXJzYXRpb25JZC5jdXJyZW50LFxuICAgICAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgICAgIGlucHV0czogbmV3UmVzcG9uc2VJdGVtLmlucHV0cyxcbiAgICAgICAgICAgICAgICBxdWVyeTogbmV3UmVzcG9uc2VJdGVtLnF1ZXJ5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvbmZpZz8uc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXI/LmVuYWJsZWQgJiYgIWhhc1N0b3BSZXNwb25kZWQuY3VycmVudCAmJiBvbkdldFN1Z2dlc3RlZFF1ZXN0aW9ucykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgeyBkYXRhIH06IGFueSA9IGF3YWl0IG9uR2V0U3VnZ2VzdGVkUXVlc3Rpb25zKFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlSXRlbS5pZCxcbiAgICAgICAgICAgICAgICBuZXdBYm9ydENvbnRyb2xsZXIgPT4gc3VnZ2VzdGVkUXVlc3Rpb25zQWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBuZXdBYm9ydENvbnRyb2xsZXIsXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgc2V0U3VnZ2VzdFF1ZXN0aW9ucyhkYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVudXNlZC1pbXBvcnRzL25vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBzZXRTdWdnZXN0UXVlc3Rpb25zKFtdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25GaWxlKGZpbGUpIHtcbiAgICAgICAgICBjb25zdCBsYXN0VGhvdWdodCA9IHJlc3BvbnNlSXRlbS5hZ2VudF90aG91Z2h0cz8uW3Jlc3BvbnNlSXRlbS5hZ2VudF90aG91Z2h0cz8ubGVuZ3RoIC0gMV1cbiAgICAgICAgICBpZiAobGFzdFRob3VnaHQpXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0uYWdlbnRfdGhvdWdodHMhW3Jlc3BvbnNlSXRlbS5hZ2VudF90aG91Z2h0cyEubGVuZ3RoIC0gMV0ubWVzc2FnZV9maWxlcyA9IFsuLi4obGFzdFRob3VnaHQgYXMgYW55KS5tZXNzYWdlX2ZpbGVzLCBmaWxlXVxuXG4gICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgIHF1ZXN0aW9uSXRlbSxcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgIHBhcmVudElkOiBkYXRhLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG9uVGhvdWdodCh0aG91Z2h0KSB7XG4gICAgICAgICAgaXNBZ2VudE1vZGUgPSB0cnVlXG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSByZXNwb25zZUl0ZW0gYXMgYW55XG4gICAgICAgICAgaWYgKHRob3VnaHQubWVzc2FnZV9pZCAmJiAhaGFzU2V0UmVzcG9uc2VJZClcbiAgICAgICAgICAgIHJlc3BvbnNlLmlkID0gdGhvdWdodC5tZXNzYWdlX2lkXG4gICAgICAgICAgaWYgKHRob3VnaHQuY29udmVyc2F0aW9uX2lkKVxuICAgICAgICAgICAgcmVzcG9uc2UuY29udmVyc2F0aW9uSWQgPSB0aG91Z2h0LmNvbnZlcnNhdGlvbl9pZFxuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmFnZW50X3Rob3VnaHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmVzcG9uc2UuYWdlbnRfdGhvdWdodHMucHVzaCh0aG91Z2h0KVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RUaG91Z2h0ID0gcmVzcG9uc2UuYWdlbnRfdGhvdWdodHNbcmVzcG9uc2UuYWdlbnRfdGhvdWdodHMubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIC8vIHRob3VnaHQgY2hhbmdlZCBidXQgc3RpbGwgdGhlIHNhbWUgdGhvdWdodCwgc28gdXBkYXRlLlxuICAgICAgICAgICAgaWYgKGxhc3RUaG91Z2h0LmlkID09PSB0aG91Z2h0LmlkKSB7XG4gICAgICAgICAgICAgIHRob3VnaHQudGhvdWdodCA9IGxhc3RUaG91Z2h0LnRob3VnaHRcbiAgICAgICAgICAgICAgdGhvdWdodC5tZXNzYWdlX2ZpbGVzID0gbGFzdFRob3VnaHQubWVzc2FnZV9maWxlc1xuICAgICAgICAgICAgICByZXNwb25zZUl0ZW0uYWdlbnRfdGhvdWdodHMhW3Jlc3BvbnNlLmFnZW50X3Rob3VnaHRzLmxlbmd0aCAtIDFdID0gdGhvdWdodFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3BvbnNlSXRlbS5hZ2VudF90aG91Z2h0cyEucHVzaCh0aG91Z2h0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLFxuICAgICAgICAgICAgcGFyZW50SWQ6IGRhdGEucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgb25NZXNzYWdlRW5kOiAobWVzc2FnZUVuZCkgPT4ge1xuICAgICAgICAgIGlmIChtZXNzYWdlRW5kLm1ldGFkYXRhPy5hbm5vdGF0aW9uX3JlcGx5KSB7XG4gICAgICAgICAgICByZXNwb25zZUl0ZW0uaWQgPSBtZXNzYWdlRW5kLmlkXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0uYW5ub3RhdGlvbiA9ICh7XG4gICAgICAgICAgICAgIGlkOiBtZXNzYWdlRW5kLm1ldGFkYXRhLmFubm90YXRpb25fcmVwbHkuaWQsXG4gICAgICAgICAgICAgIGF1dGhvck5hbWU6IG1lc3NhZ2VFbmQubWV0YWRhdGEuYW5ub3RhdGlvbl9yZXBseS5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgICAgcGFyZW50SWQ6IGRhdGEucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3BvbnNlSXRlbS5jaXRhdGlvbiA9IG1lc3NhZ2VFbmQubWV0YWRhdGE/LnJldHJpZXZlcl9yZXNvdXJjZXMgfHwgW11cbiAgICAgICAgICBjb25zdCBwcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZSA9IGdldFByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlKG1lc3NhZ2VFbmQuZmlsZXMgfHwgW10pXG4gICAgICAgICAgcmVzcG9uc2VJdGVtLmFsbEZpbGVzID0gdW5pcUJ5KFsuLi4ocmVzcG9uc2VJdGVtLmFsbEZpbGVzIHx8IFtdKSwgLi4uKHByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlIHx8IFtdKV0sICdpZCcpXG5cbiAgICAgICAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLFxuICAgICAgICAgICAgcGFyZW50SWQ6IGRhdGEucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgb25NZXNzYWdlUmVwbGFjZTogKG1lc3NhZ2VSZXBsYWNlKSA9PiB7XG4gICAgICAgICAgcmVzcG9uc2VJdGVtLmNvbnRlbnQgPSBtZXNzYWdlUmVwbGFjZS5hbnN3ZXJcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcigpIHtcbiAgICAgICAgICBoYW5kbGVSZXNwb25kaW5nKGZhbHNlKVxuICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQsXG4gICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICBwYXJlbnRJZDogZGF0YS5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBvbldvcmtmbG93U3RhcnRlZDogKHsgd29ya2Zsb3dfcnVuX2lkLCB0YXNrX2lkIH0pID0+IHtcbiAgICAgICAgICB0YXNrSWRSZWYuY3VycmVudCA9IHRhc2tfaWRcbiAgICAgICAgICByZXNwb25zZUl0ZW0ud29ya2Zsb3dfcnVuX2lkID0gd29ya2Zsb3dfcnVuX2lkXG4gICAgICAgICAgcmVzcG9uc2VJdGVtLndvcmtmbG93UHJvY2VzcyA9IHtcbiAgICAgICAgICAgIHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICAgICAgICB0cmFjaW5nOiBbXSxcbiAgICAgICAgICB9XG4gICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgIHF1ZXN0aW9uSXRlbSxcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgIHBhcmVudElkOiBkYXRhLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG9uV29ya2Zsb3dGaW5pc2hlZDogKHsgZGF0YTogd29ya2Zsb3dGaW5pc2hlZERhdGEgfSkgPT4ge1xuICAgICAgICAgIHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnN0YXR1cyA9IHdvcmtmbG93RmluaXNoZWREYXRhLnN0YXR1cyBhcyBXb3JrZmxvd1J1bm5pbmdTdGF0dXNcbiAgICAgICAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLFxuICAgICAgICAgICAgcGFyZW50SWQ6IGRhdGEucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgb25JdGVyYXRpb25TdGFydDogKHsgZGF0YTogaXRlcmF0aW9uU3RhcnRlZERhdGEgfSkgPT4ge1xuICAgICAgICAgIHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmchLnB1c2goe1xuICAgICAgICAgICAgLi4uaXRlcmF0aW9uU3RhcnRlZERhdGEsXG4gICAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgIHF1ZXN0aW9uSXRlbSxcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgIHBhcmVudElkOiBkYXRhLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG9uSXRlcmF0aW9uRmluaXNoOiAoeyBkYXRhOiBpdGVyYXRpb25GaW5pc2hlZERhdGEgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRyYWNpbmcgPSByZXNwb25zZUl0ZW0ud29ya2Zsb3dQcm9jZXNzIS50cmFjaW5nIVxuICAgICAgICAgIGNvbnN0IGl0ZXJhdGlvbkluZGV4ID0gdHJhY2luZy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLm5vZGVfaWQgPT09IGl0ZXJhdGlvbkZpbmlzaGVkRGF0YS5ub2RlX2lkXG4gICAgICAgICAgICAmJiAoaXRlbS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmFsbGVsX2lkID09PSBpdGVyYXRpb25GaW5pc2hlZERhdGEuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCB8fCBpdGVtLnBhcmFsbGVsX2lkID09PSBpdGVyYXRpb25GaW5pc2hlZERhdGEuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCkpIVxuICAgICAgICAgIHRyYWNpbmdbaXRlcmF0aW9uSW5kZXhdID0ge1xuICAgICAgICAgICAgLi4udHJhY2luZ1tpdGVyYXRpb25JbmRleF0sXG4gICAgICAgICAgICAuLi5pdGVyYXRpb25GaW5pc2hlZERhdGEsXG4gICAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdWNjZWVkZWQsXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdXBkYXRlQ3VycmVudFFBT25UcmVlKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyUXVlc3Rpb25JZCxcbiAgICAgICAgICAgIHF1ZXN0aW9uSXRlbSxcbiAgICAgICAgICAgIHJlc3BvbnNlSXRlbSxcbiAgICAgICAgICAgIHBhcmVudElkOiBkYXRhLnBhcmVudF9tZXNzYWdlX2lkLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZVN0YXJ0ZWQ6ICh7IGRhdGE6IG5vZGVTdGFydGVkRGF0YSB9KSA9PiB7XG4gICAgICAgICAgaWYgKG5vZGVTdGFydGVkRGF0YS5pdGVyYXRpb25faWQpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIGlmIChkYXRhLmxvb3BfaWQpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmchLnB1c2goe1xuICAgICAgICAgICAgLi4ubm9kZVN0YXJ0ZWREYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQsXG4gICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICBwYXJlbnRJZDogZGF0YS5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVGaW5pc2hlZDogKHsgZGF0YTogbm9kZUZpbmlzaGVkRGF0YSB9KSA9PiB7XG4gICAgICAgICAgaWYgKG5vZGVGaW5pc2hlZERhdGEuaXRlcmF0aW9uX2lkKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICBpZiAoZGF0YS5sb29wX2lkKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSByZXNwb25zZUl0ZW0ud29ya2Zsb3dQcm9jZXNzIS50cmFjaW5nIS5maW5kSW5kZXgoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmICghaXRlbS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmFsbGVsX2lkKVxuICAgICAgICAgICAgICByZXR1cm4gaXRlbS5ub2RlX2lkID09PSBub2RlRmluaXNoZWREYXRhLm5vZGVfaWRcblxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ubm9kZV9pZCA9PT0gbm9kZUZpbmlzaGVkRGF0YS5ub2RlX2lkICYmIChpdGVtLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQgPT09IG5vZGVGaW5pc2hlZERhdGEuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmdbY3VycmVudEluZGV4XSA9IG5vZGVGaW5pc2hlZERhdGEgYXMgYW55XG5cbiAgICAgICAgICB1cGRhdGVDdXJyZW50UUFPblRyZWUoe1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJRdWVzdGlvbklkLFxuICAgICAgICAgICAgcXVlc3Rpb25JdGVtLFxuICAgICAgICAgICAgcmVzcG9uc2VJdGVtLFxuICAgICAgICAgICAgcGFyZW50SWQ6IGRhdGEucGFyZW50X21lc3NhZ2VfaWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgb25UVFNDaHVuazogKG1lc3NhZ2VJZDogc3RyaW5nLCBhdWRpbzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgaWYgKCFhdWRpbyB8fCBhdWRpbyA9PT0gJycpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBjb25zdCBhdWRpb1BsYXllciA9IGdldE9yQ3JlYXRlUGxheWVyKClcbiAgICAgICAgICBpZiAoYXVkaW9QbGF5ZXIpIHtcbiAgICAgICAgICAgIGF1ZGlvUGxheWVyLnBsYXlBdWRpb1dpdGhBdWRpbyhhdWRpbywgdHJ1ZSlcbiAgICAgICAgICAgIEF1ZGlvUGxheWVyTWFuYWdlci5nZXRJbnN0YW5jZSgpLnJlc2V0TXNnSWQobWVzc2FnZUlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25UVFNFbmQ6IChtZXNzYWdlSWQ6IHN0cmluZywgYXVkaW86IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IGF1ZGlvUGxheWVyID0gZ2V0T3JDcmVhdGVQbGF5ZXIoKVxuICAgICAgICAgIGlmIChhdWRpb1BsYXllcilcbiAgICAgICAgICAgIGF1ZGlvUGxheWVyLnBsYXlBdWRpb1dpdGhBdWRpbyhhdWRpbywgZmFsc2UpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9vcFN0YXJ0OiAoeyBkYXRhOiBsb29wU3RhcnRlZERhdGEgfSkgPT4ge1xuICAgICAgICAgIHJlc3BvbnNlSXRlbS53b3JrZmxvd1Byb2Nlc3MhLnRyYWNpbmchLnB1c2goe1xuICAgICAgICAgICAgLi4ubG9vcFN0YXJ0ZWREYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQsXG4gICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICBwYXJlbnRJZDogZGF0YS5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBvbkxvb3BGaW5pc2g6ICh7IGRhdGE6IGxvb3BGaW5pc2hlZERhdGEgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRyYWNpbmcgPSByZXNwb25zZUl0ZW0ud29ya2Zsb3dQcm9jZXNzIS50cmFjaW5nIVxuICAgICAgICAgIGNvbnN0IGxvb3BJbmRleCA9IHRyYWNpbmcuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5ub2RlX2lkID09PSBsb29wRmluaXNoZWREYXRhLm5vZGVfaWRcbiAgICAgICAgICAgICYmIChpdGVtLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQgPT09IGxvb3BGaW5pc2hlZERhdGEuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCB8fCBpdGVtLnBhcmFsbGVsX2lkID09PSBsb29wRmluaXNoZWREYXRhLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQpKSFcbiAgICAgICAgICB0cmFjaW5nW2xvb3BJbmRleF0gPSB7XG4gICAgICAgICAgICAuLi50cmFjaW5nW2xvb3BJbmRleF0sXG4gICAgICAgICAgICAuLi5sb29wRmluaXNoZWREYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuU3VjY2VlZGVkLFxuICAgICAgICAgIH1cblxuICAgICAgICAgIHVwZGF0ZUN1cnJlbnRRQU9uVHJlZSh7XG4gICAgICAgICAgICBwbGFjZWhvbGRlclF1ZXN0aW9uSWQsXG4gICAgICAgICAgICBxdWVzdGlvbkl0ZW0sXG4gICAgICAgICAgICByZXNwb25zZUl0ZW0sXG4gICAgICAgICAgICBwYXJlbnRJZDogZGF0YS5wYXJlbnRfbWVzc2FnZV9pZCxcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApXG4gICAgcmV0dXJuIHRydWVcbiAgfSwgW1xuICAgIHQsXG4gICAgY2hhdFRyZWUubGVuZ3RoLFxuICAgIHRocmVhZE1lc3NhZ2VzLFxuICAgIGNvbmZpZz8uc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXIsXG4gICAgdXBkYXRlQ3VycmVudFFBT25UcmVlLFxuICAgIHVwZGF0ZUNoYXRUcmVlTm9kZSxcbiAgICBub3RpZnksXG4gICAgaGFuZGxlUmVzcG9uZGluZyxcbiAgICBmb3JtYXRUaW1lLFxuICAgIHBhcmFtcy50b2tlbixcbiAgICBwYXJhbXMuYXBwSWQsXG4gICAgcGF0aG5hbWUsXG4gICAgZm9ybVNldHRpbmdzLFxuICBdKVxuXG4gIGNvbnN0IGhhbmRsZUFubm90YXRpb25FZGl0ZWQgPSB1c2VDYWxsYmFjaygocXVlcnk6IHN0cmluZywgYW5zd2VyOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCB0YXJnZXRRdWVzdGlvbklkID0gY2hhdExpc3RbaW5kZXggLSAxXS5pZFxuICAgIGNvbnN0IHRhcmdldEFuc3dlcklkID0gY2hhdExpc3RbaW5kZXhdLmlkXG5cbiAgICB1cGRhdGVDaGF0VHJlZU5vZGUodGFyZ2V0UXVlc3Rpb25JZCwge1xuICAgICAgY29udGVudDogcXVlcnksXG4gICAgfSlcbiAgICB1cGRhdGVDaGF0VHJlZU5vZGUodGFyZ2V0QW5zd2VySWQsIHtcbiAgICAgIGNvbnRlbnQ6IGFuc3dlcixcbiAgICAgIGFubm90YXRpb246IHtcbiAgICAgICAgLi4uY2hhdExpc3RbaW5kZXhdLmFubm90YXRpb24sXG4gICAgICAgIGxvZ0Fubm90YXRpb246IHVuZGVmaW5lZCxcbiAgICAgIH0gYXMgYW55LFxuICAgIH0pXG4gIH0sIFtjaGF0TGlzdCwgdXBkYXRlQ2hhdFRyZWVOb2RlXSlcblxuICBjb25zdCBoYW5kbGVBbm5vdGF0aW9uQWRkZWQgPSB1c2VDYWxsYmFjaygoYW5ub3RhdGlvbklkOiBzdHJpbmcsIGF1dGhvck5hbWU6IHN0cmluZywgcXVlcnk6IHN0cmluZywgYW5zd2VyOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCB0YXJnZXRRdWVzdGlvbklkID0gY2hhdExpc3RbaW5kZXggLSAxXS5pZFxuICAgIGNvbnN0IHRhcmdldEFuc3dlcklkID0gY2hhdExpc3RbaW5kZXhdLmlkXG5cbiAgICB1cGRhdGVDaGF0VHJlZU5vZGUodGFyZ2V0UXVlc3Rpb25JZCwge1xuICAgICAgY29udGVudDogcXVlcnksXG4gICAgfSlcblxuICAgIHVwZGF0ZUNoYXRUcmVlTm9kZSh0YXJnZXRBbnN3ZXJJZCwge1xuICAgICAgY29udGVudDogY2hhdExpc3RbaW5kZXhdLmNvbnRlbnQsXG4gICAgICBhbm5vdGF0aW9uOiB7XG4gICAgICAgIGlkOiBhbm5vdGF0aW9uSWQsXG4gICAgICAgIGF1dGhvck5hbWUsXG4gICAgICAgIGxvZ0Fubm90YXRpb246IHtcbiAgICAgICAgICBjb250ZW50OiBhbnN3ZXIsXG4gICAgICAgICAgYWNjb3VudDoge1xuICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgbmFtZTogYXV0aG9yTmFtZSxcbiAgICAgICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSBhcyBBbm5vdGF0aW9uLFxuICAgIH0pXG4gIH0sIFtjaGF0TGlzdCwgdXBkYXRlQ2hhdFRyZWVOb2RlXSlcblxuICBjb25zdCBoYW5kbGVBbm5vdGF0aW9uUmVtb3ZlZCA9IHVzZUNhbGxiYWNrKChpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0QW5zd2VySWQgPSBjaGF0TGlzdFtpbmRleF0uaWRcblxuICAgIHVwZGF0ZUNoYXRUcmVlTm9kZSh0YXJnZXRBbnN3ZXJJZCwge1xuICAgICAgY29udGVudDogY2hhdExpc3RbaW5kZXhdLmNvbnRlbnQsXG4gICAgICBhbm5vdGF0aW9uOiB7XG4gICAgICAgIC4uLmNoYXRMaXN0W2luZGV4XS5hbm5vdGF0aW9uLFxuICAgICAgICBpZDogJycsXG4gICAgICB9IGFzIEFubm90YXRpb24sXG4gICAgfSlcbiAgfSwgW2NoYXRMaXN0LCB1cGRhdGVDaGF0VHJlZU5vZGVdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGNsZWFyQ2hhdExpc3QpXG4gICAgICBoYW5kbGVSZXN0YXJ0KCgpID0+IGNsZWFyQ2hhdExpc3RDYWxsYmFjaz8uKGZhbHNlKSlcbiAgfSwgW2NsZWFyQ2hhdExpc3QsIGNsZWFyQ2hhdExpc3RDYWxsYmFjaywgaGFuZGxlUmVzdGFydF0pXG5cbiAgcmV0dXJuIHtcbiAgICBjaGF0TGlzdCxcbiAgICBzZXRUYXJnZXRNZXNzYWdlSWQsXG4gICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbklkLmN1cnJlbnQsXG4gICAgaXNSZXNwb25kaW5nLFxuICAgIHNldElzUmVzcG9uZGluZyxcbiAgICBoYW5kbGVTZW5kLFxuICAgIHN1Z2dlc3RlZFF1ZXN0aW9ucyxcbiAgICBoYW5kbGVSZXN0YXJ0LFxuICAgIGhhbmRsZVN0b3AsXG4gICAgaGFuZGxlQW5ub3RhdGlvbkVkaXRlZCxcbiAgICBoYW5kbGVBbm5vdGF0aW9uQWRkZWQsXG4gICAgaGFuZGxlQW5ub3RhdGlvblJlbW92ZWQsXG4gIH1cbn1cbiJdfQ==