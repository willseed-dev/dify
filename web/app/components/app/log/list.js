"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("@heroicons/react/24/outline");
const react_1 = require("@remixicon/react");
const dayjs_1 = require("dayjs");
const timezone_1 = require("dayjs/plugin/timezone");
const utc_1 = require("dayjs/plugin/utc");
const compat_1 = require("es-toolkit/compat");
const function_1 = require("es-toolkit/function");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const shallow_1 = require("zustand/react/shallow");
const model_info_1 = require("@/app/components/app/log/model-info");
const store_1 = require("@/app/components/app/store");
const item_1 = require("@/app/components/app/text-generate/item");
const action_button_1 = require("@/app/components/base/action-button");
const chat_1 = require("@/app/components/base/chat/chat");
const utils_1 = require("@/app/components/base/chat/utils");
const copy_icon_1 = require("@/app/components/base/copy-icon");
const drawer_1 = require("@/app/components/base/drawer");
const utils_2 = require("@/app/components/base/file-uploader/utils");
const loading_1 = require("@/app/components/base/loading");
const message_log_modal_1 = require("@/app/components/base/message-log-modal");
const toast_1 = require("@/app/components/base/toast");
const tooltip_1 = require("@/app/components/base/tooltip");
const utils_3 = require("@/app/components/tools/utils");
const context_1 = require("@/app/components/workflow/context");
const app_context_1 = require("@/context/app-context");
const use_breakpoints_1 = require("@/hooks/use-breakpoints");
const use_timestamp_1 = require("@/hooks/use-timestamp");
const log_1 = require("@/service/log");
const use_log_1 = require("@/service/use-log");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const prompt_log_modal_1 = require("../../base/prompt-log-modal");
const indicator_1 = require("../../header/indicator");
const var_panel_1 = require("./var-panel");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const defaultValue = 'N/A';
const DrawerContext = (0, use_context_selector_1.createContext)({});
/**
 * Icon component with numbers
 */
const HandThumbIconWithCount = ({ count, iconType }) => {
    const classname = iconType === 'up' ? 'text-primary-600 bg-primary-50' : 'text-red-600 bg-red-50';
    const Icon = iconType === 'up' ? outline_1.HandThumbUpIcon : outline_1.HandThumbDownIcon;
    return (<div className={`inline-flex w-fit items-center rounded-md p-1 text-xs ${classname} mr-1 last:mr-0`}>
      <Icon className="mr-0.5 h-3 w-3 rounded-md"/>
      {count > 0 ? count : null}
    </div>);
};
const statusTdRender = (statusCount) => {
    if (!statusCount)
        return null;
    if (statusCount.partial_success + statusCount.failed === 0) {
        return (<div className="system-xs-semibold-uppercase inline-flex items-center gap-1">
        <indicator_1.default color="green"/>
        <span className="text-util-colors-green-green-600">Success</span>
      </div>);
    }
    else if (statusCount.failed === 0) {
        return (<div className="system-xs-semibold-uppercase inline-flex items-center gap-1">
        <indicator_1.default color="green"/>
        <span className="text-util-colors-green-green-600">Partial Success</span>
      </div>);
    }
    else {
        return (<div className="system-xs-semibold-uppercase inline-flex items-center gap-1">
        <indicator_1.default color="red"/>
        <span className="text-util-colors-red-red-600">
          {statusCount.failed}
          {' '}
          {`${statusCount.failed > 1 ? 'Failures' : 'Failure'}`}
        </span>
      </div>);
    }
};
const getFormattedChatList = (messages, conversationId, timezone, format) => {
    const newChatList = [];
    try {
        messages.forEach((item) => {
            const questionFiles = item.message_files?.filter((file) => file.belongs_to === 'user') || [];
            newChatList.push({
                id: `question-${item.id}`,
                content: item.inputs.query || item.inputs.default_input || item.query, // text generation: item.inputs.query; chat: item.query
                isAnswer: false,
                message_files: (0, utils_2.getProcessedFilesFromResponse)(questionFiles.map((item) => ({ ...item, related_id: item.id }))),
                parentMessageId: item.parent_message_id || undefined,
            });
            const answerFiles = item.message_files?.filter((file) => file.belongs_to === 'assistant') || [];
            newChatList.push({
                id: item.id,
                content: item.answer,
                agent_thoughts: (0, utils_3.addFileInfos)(item.agent_thoughts ? (0, utils_3.sortAgentSorts)(item.agent_thoughts) : item.agent_thoughts, item.message_files),
                feedback: item.feedbacks?.find(item => item.from_source === 'user'), // user feedback
                adminFeedback: item.feedbacks?.find(item => item.from_source === 'admin'), // admin feedback
                feedbackDisabled: false,
                isAnswer: true,
                message_files: (0, utils_2.getProcessedFilesFromResponse)(answerFiles.map((item) => ({ ...item, related_id: item.id }))),
                log: [
                    ...(item.message ?? []),
                    ...(item.message?.[item.message.length - 1]?.role !== 'assistant'
                        ? [
                            {
                                role: 'assistant',
                                text: item.answer,
                                files: item.message_files?.filter((file) => file.belongs_to === 'assistant') || [],
                            },
                        ]
                        : []),
                ],
                workflow_run_id: item.workflow_run_id,
                conversationId,
                input: {
                    inputs: item.inputs,
                    query: item.query,
                },
                more: {
                    time: dayjs_1.default.unix(item.created_at).tz(timezone).format(format),
                    tokens: item.answer_tokens + item.message_tokens,
                    latency: (item.provider_response_latency ?? 0).toFixed(2),
                },
                citation: item.metadata?.retriever_resources,
                annotation: (() => {
                    if (item.annotation_hit_history) {
                        return {
                            id: item.annotation_hit_history.annotation_id,
                            authorName: item.annotation_hit_history.annotation_create_account?.name || 'N/A',
                            created_at: item.annotation_hit_history.created_at,
                        };
                    }
                    if (item.annotation) {
                        return {
                            id: item.annotation.id,
                            authorName: item.annotation.account.name,
                            logAnnotation: item.annotation,
                            created_at: 0,
                        };
                    }
                    return undefined;
                })(),
                parentMessageId: `question-${item.id}`,
            });
        });
        return newChatList;
    }
    catch (error) {
        console.error('getFormattedChatList processing failed:', error);
        throw error;
    }
};
function DetailPanel({ detail, onFeedback }) {
    const MIN_ITEMS_FOR_SCROLL_LOADING = 8;
    const SCROLL_DEBOUNCE_MS = 200;
    const { userProfile: { timezone } } = (0, app_context_1.useAppContext)();
    const { formatTime } = (0, use_timestamp_1.default)();
    const { onClose, appDetail } = (0, use_context_selector_1.useContext)(DrawerContext);
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const { currentLogItem, setCurrentLogItem, showMessageLogModal, setShowMessageLogModal, showPromptLogModal, setShowPromptLogModal, currentLogModalActiveTab } = (0, store_1.useStore)((0, shallow_1.useShallow)((state) => ({
        currentLogItem: state.currentLogItem,
        setCurrentLogItem: state.setCurrentLogItem,
        showMessageLogModal: state.showMessageLogModal,
        setShowMessageLogModal: state.setShowMessageLogModal,
        showPromptLogModal: state.showPromptLogModal,
        setShowPromptLogModal: state.setShowPromptLogModal,
        currentLogModalActiveTab: state.currentLogModalActiveTab,
    })));
    const { t } = (0, react_i18next_1.useTranslation)();
    const [hasMore, setHasMore] = (0, react_2.useState)(true);
    const [varValues, setVarValues] = (0, react_2.useState)({});
    const isLoadingRef = (0, react_2.useRef)(false);
    const abortControllerRef = (0, react_2.useRef)(null);
    const requestIdRef = (0, react_2.useRef)(0);
    const lastLoadTimeRef = (0, react_2.useRef)(0);
    const retryCountRef = (0, react_2.useRef)(0);
    const oldestAnswerIdRef = (0, react_2.useRef)(undefined);
    const MAX_RETRY_COUNT = 3;
    const [allChatItems, setAllChatItems] = (0, react_2.useState)([]);
    const [chatItemTree, setChatItemTree] = (0, react_2.useState)([]);
    const [threadChatItems, setThreadChatItems] = (0, react_2.useState)([]);
    const fetchData = (0, react_2.useCallback)(async () => {
        if (isLoadingRef.current || !hasMore)
            return;
        // Cancel any in-flight request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const currentRequestId = ++requestIdRef.current;
        try {
            isLoadingRef.current = true;
            const params = {
                conversation_id: detail.id,
                limit: 10,
            };
            // Use ref for pagination anchor to avoid stale closure issues
            if (oldestAnswerIdRef.current)
                params.first_id = oldestAnswerIdRef.current;
            const messageRes = await (0, log_1.fetchChatMessages)({
                url: `/apps/${appDetail?.id}/chat-messages`,
                params,
            });
            // Ignore stale responses
            if (currentRequestId !== requestIdRef.current || controller.signal.aborted)
                return;
            if (messageRes.data.length > 0) {
                const varValues = messageRes.data.at(-1).inputs;
                setVarValues(varValues);
            }
            setHasMore(messageRes.has_more);
            const newItems = getFormattedChatList(messageRes.data, detail.id, timezone, t('dateTimeFormat', { ns: 'appLog' }));
            // Use functional update to avoid stale state issues
            setAllChatItems((prevItems) => {
                const existingIds = new Set(prevItems.map(item => item.id));
                const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
                return [...uniqueNewItems, ...prevItems];
            });
        }
        catch (err) {
            if (err instanceof Error && err.name === 'AbortError')
                return;
            console.error('fetchData execution failed:', err);
        }
        finally {
            isLoadingRef.current = false;
            if (abortControllerRef.current === controller)
                abortControllerRef.current = null;
        }
    }, [detail.id, hasMore, timezone, t, appDetail, detail?.model_config?.configs?.introduction]);
    // Derive chatItemTree, threadChatItems, and oldestAnswerIdRef from allChatItems
    (0, react_2.useEffect)(() => {
        if (allChatItems.length === 0)
            return;
        let tree = (0, utils_1.buildChatItemTree)(allChatItems);
        if (!hasMore && detail?.model_config?.configs?.introduction) {
            tree = [{
                    id: 'introduction',
                    isAnswer: true,
                    isOpeningStatement: true,
                    content: detail?.model_config?.configs?.introduction ?? 'hello',
                    feedbackDisabled: true,
                    children: tree,
                }];
        }
        setChatItemTree(tree);
        const lastMessageId = allChatItems.length > 0 ? allChatItems[allChatItems.length - 1].id : undefined;
        setThreadChatItems((0, utils_1.getThreadMessages)(tree, lastMessageId));
        // Update pagination anchor ref with the oldest answer ID
        const answerItems = allChatItems.filter(item => item.isAnswer);
        const oldestAnswer = answerItems[answerItems.length - 1];
        if (oldestAnswer?.id)
            oldestAnswerIdRef.current = oldestAnswer.id;
    }, [allChatItems, hasMore, detail?.model_config?.configs?.introduction]);
    const switchSibling = (0, react_2.useCallback)((siblingMessageId) => {
        const newThreadChatItems = (0, utils_1.getThreadMessages)(chatItemTree, siblingMessageId);
        setThreadChatItems(newThreadChatItems);
    }, [chatItemTree]);
    const handleAnnotationEdited = (0, react_2.useCallback)((query, answer, index) => {
        setAllChatItems(allChatItems.map((item, i) => {
            if (i === index - 1) {
                return {
                    ...item,
                    content: query,
                };
            }
            if (i === index) {
                return {
                    ...item,
                    annotation: {
                        ...item.annotation,
                        logAnnotation: {
                            ...item.annotation?.logAnnotation,
                            content: answer,
                        },
                    },
                };
            }
            return item;
        }));
    }, [allChatItems]);
    const handleAnnotationAdded = (0, react_2.useCallback)((annotationId, authorName, query, answer, index) => {
        setAllChatItems(allChatItems.map((item, i) => {
            if (i === index - 1) {
                return {
                    ...item,
                    content: query,
                };
            }
            if (i === index) {
                const answerItem = {
                    ...item,
                    content: item.content,
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
                };
                return answerItem;
            }
            return item;
        }));
    }, [allChatItems]);
    const handleAnnotationRemoved = (0, react_2.useCallback)(async (index) => {
        const annotation = allChatItems[index]?.annotation;
        try {
            if (annotation?.id) {
                const { delAnnotation } = await Promise.resolve().then(() => require('@/service/annotation'));
                await delAnnotation(appDetail?.id || '', annotation.id);
            }
            setAllChatItems(allChatItems.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        content: item.content,
                        annotation: undefined,
                    };
                }
                return item;
            }));
            notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            return true;
        }
        catch {
            notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            return false;
        }
    }, [allChatItems, appDetail?.id, t]);
    const fetchInitiated = (0, react_2.useRef)(false);
    // Only load initial messages, don't auto-load more
    (0, react_2.useEffect)(() => {
        if (appDetail?.id && detail.id && appDetail?.mode !== app_1.AppModeEnum.COMPLETION && !fetchInitiated.current) {
            // Mark as initialized, but don't auto-load more messages
            fetchInitiated.current = true;
            // Still call fetchData to get initial messages
            fetchData();
        }
    }, [appDetail?.id, detail.id, appDetail?.mode, fetchData]);
    const [isLoading, setIsLoading] = (0, react_2.useState)(false);
    const loadMoreMessages = (0, react_2.useCallback)(async () => {
        if (isLoading || !hasMore || !appDetail?.id || !detail.id)
            return;
        // Throttle using ref to persist across re-renders
        const now = Date.now();
        if (now - lastLoadTimeRef.current < SCROLL_DEBOUNCE_MS)
            return;
        lastLoadTimeRef.current = now;
        setIsLoading(true);
        try {
            const params = {
                conversation_id: detail.id,
                limit: 10,
            };
            // Use ref for pagination anchor to avoid stale closure issues
            if (oldestAnswerIdRef.current) {
                params.first_id = oldestAnswerIdRef.current;
            }
            const messageRes = await (0, log_1.fetchChatMessages)({
                url: `/apps/${appDetail.id}/chat-messages`,
                params,
            });
            if (!messageRes.data || messageRes.data.length === 0) {
                setHasMore(false);
                retryCountRef.current = 0;
                return;
            }
            if (messageRes.data.length > 0) {
                const varValues = messageRes.data.at(-1).inputs;
                setVarValues(varValues);
            }
            setHasMore(messageRes.has_more);
            const newItems = getFormattedChatList(messageRes.data, detail.id, timezone, t('dateTimeFormat', { ns: 'appLog' }));
            // Use functional update to get latest state and avoid stale closures
            setAllChatItems((prevItems) => {
                const existingIds = new Set(prevItems.map(item => item.id));
                const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
                // If no unique items and we haven't exceeded retry limit, signal retry needed
                if (uniqueNewItems.length === 0) {
                    if (retryCountRef.current < MAX_RETRY_COUNT && prevItems.length > 1) {
                        retryCountRef.current++;
                        return prevItems;
                    }
                    else {
                        retryCountRef.current = 0;
                        return prevItems;
                    }
                }
                retryCountRef.current = 0;
                return [...uniqueNewItems, ...prevItems];
            });
        }
        catch (error) {
            console.error(error);
            setHasMore(false);
            retryCountRef.current = 0;
        }
        finally {
            setIsLoading(false);
        }
    }, [detail.id, hasMore, isLoading, timezone, t, appDetail, detail?.model_config?.configs?.introduction]);
    (0, react_2.useEffect)(() => {
        const scrollableDiv = document.getElementById('scrollableDiv');
        const outerDiv = scrollableDiv?.parentElement;
        const chatContainer = document.querySelector('.mx-1.mb-1.grow.overflow-auto');
        let scrollContainer = null;
        if (outerDiv && outerDiv.scrollHeight > outerDiv.clientHeight) {
            scrollContainer = outerDiv;
        }
        else if (scrollableDiv && scrollableDiv.scrollHeight > scrollableDiv.clientHeight) {
            scrollContainer = scrollableDiv;
        }
        else if (chatContainer && chatContainer.scrollHeight > chatContainer.clientHeight) {
            scrollContainer = chatContainer;
        }
        else {
            const possibleContainers = document.querySelectorAll('.overflow-auto, .overflow-y-auto');
            for (let i = 0; i < possibleContainers.length; i++) {
                const container = possibleContainers[i];
                if (container.scrollHeight > container.clientHeight) {
                    scrollContainer = container;
                    break;
                }
            }
        }
        if (!scrollContainer)
            return;
        const handleScroll = () => {
            const currentScrollTop = scrollContainer.scrollTop;
            const isNearTop = currentScrollTop < 30;
            if (isNearTop && hasMore && !isLoading) {
                loadMoreMessages();
            }
        };
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        const handleWheel = (e) => {
            if (e.deltaY < 0)
                handleScroll();
        };
        scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, [hasMore, isLoading, loadMoreMessages]);
    const isChatMode = appDetail?.mode !== app_1.AppModeEnum.COMPLETION;
    const isAdvanced = appDetail?.mode === app_1.AppModeEnum.ADVANCED_CHAT;
    const varList = detail.model_config.user_input_form?.map((item) => {
        const itemContent = item[Object.keys(item)[0]];
        return {
            label: itemContent.variable,
            value: varValues[itemContent.variable] || detail.message?.inputs?.[itemContent.variable],
        };
    }) || [];
    const message_files = (!isChatMode && detail.message.message_files && detail.message.message_files.length > 0)
        ? detail.message.message_files.map((item) => item.url)
        : [];
    const [width, setWidth] = (0, react_2.useState)(0);
    const ref = (0, react_2.useRef)(null);
    const adjustModalWidth = () => {
        if (ref.current)
            setWidth(document.body.clientWidth - (ref.current?.clientWidth + 16) - 8);
    };
    (0, react_2.useEffect)(() => {
        const raf = requestAnimationFrame(adjustModalWidth);
        return () => cancelAnimationFrame(raf);
    }, []);
    return (<div ref={ref} className="flex h-full flex-col rounded-xl border-[0.5px] border-components-panel-border">
      {/* Panel Header */}
      <div className="flex shrink-0 items-center gap-2 rounded-t-xl bg-components-panel-bg pb-2 pl-4 pr-3 pt-3">
        <div className="shrink-0">
          <div className="system-xs-semibold-uppercase mb-0.5 text-text-primary">{isChatMode ? t('detail.conversationId', { ns: 'appLog' }) : t('detail.time', { ns: 'appLog' })}</div>
          {isChatMode && (<div className="system-2xs-regular-uppercase flex items-center text-text-secondary">
              <tooltip_1.default popupContent={detail.id}>
                <div className="truncate">{detail.id}</div>
              </tooltip_1.default>
              <copy_icon_1.default content={detail.id}/>
            </div>)}
          {!isChatMode && (<div className="system-2xs-regular-uppercase text-text-secondary">{formatTime(detail.created_at, t('dateTimeFormat', { ns: 'appLog' }))}</div>)}
        </div>
        <div className="flex grow flex-wrap items-center justify-end gap-y-1">
          {!isAdvanced && <model_info_1.default model={detail.model_config.model}/>}
        </div>
        <action_button_1.default size="l" onClick={onClose}>
          <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
        </action_button_1.default>
      </div>
      {/* Panel Body */}
      <div className="shrink-0 px-1 pt-1">
        <div className="rounded-t-xl bg-background-section-burn p-3 pb-2">
          {(varList.length > 0 || (!isChatMode && message_files.length > 0)) && (<var_panel_1.default varList={varList} message_files={message_files}/>)}
        </div>
      </div>
      <div className="mx-1 mb-1 grow overflow-auto rounded-b-xl bg-background-section-burn">
        {!isChatMode
            ? (<div className="px-6 py-4">
                <div className="flex h-[18px] items-center space-x-3">
                  <div className="system-xs-semibold-uppercase text-text-tertiary">{t('table.header.output', { ns: 'appLog' })}</div>
                  <div className="h-px grow" style={{
                    background: 'linear-gradient(270deg, rgba(243, 244, 246, 0) 0%, rgb(243, 244, 246) 100%)',
                }}>
                  </div>
                </div>
                <item_1.default className="mt-2" content={detail.message.answer} messageId={detail.message.id} isError={false} onRetry={function_1.noop} isInstalledApp={false} supportFeedback feedback={detail.message.feedbacks.find((item) => item.from_source === 'admin')} onFeedback={feedback => onFeedback(detail.message.id, feedback)} isShowTextToSpeech siteInfo={null}/>
              </div>)
            : threadChatItems.length < MIN_ITEMS_FOR_SCROLL_LOADING ? (<div className="mb-4 pt-4">
              <chat_1.default config={{
                    appId: appDetail?.id,
                    text_to_speech: {
                        enabled: true,
                    },
                    questionEditEnable: false,
                    supportAnnotation: true,
                    annotation_reply: {
                        enabled: true,
                    },
                    supportFeedback: true,
                }} chatList={threadChatItems} onAnnotationAdded={handleAnnotationAdded} onAnnotationEdited={handleAnnotationEdited} onAnnotationRemoved={handleAnnotationRemoved} onFeedback={onFeedback} noChatInput showPromptLog hideProcessDetail chatContainerInnerClassName="px-3" switchSibling={switchSibling}/>
            </div>) : (<div className="py-4" id="scrollableDiv" style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    height: '100%',
                    overflow: 'auto',
                }}>
              {/* Put the scroll bar always on the bottom */}
              <div className="flex w-full flex-col-reverse" style={{ position: 'relative' }}>
                {/* Loading state indicator - only shown when loading */}
                {hasMore && isLoading && (<div className="sticky left-0 right-0 top-0 z-10 bg-primary-50/40 py-3 text-center">
                    <div className="system-xs-regular text-text-tertiary">
                      {t('detail.loading', { ns: 'appLog' })}
                      ...
                    </div>
                  </div>)}

                <chat_1.default config={{
                    appId: appDetail?.id,
                    text_to_speech: {
                        enabled: true,
                    },
                    questionEditEnable: false,
                    supportAnnotation: true,
                    annotation_reply: {
                        enabled: true,
                    },
                    supportFeedback: true,
                }} chatList={threadChatItems} onAnnotationAdded={handleAnnotationAdded} onAnnotationEdited={handleAnnotationEdited} onAnnotationRemoved={handleAnnotationRemoved} onFeedback={onFeedback} noChatInput showPromptLog hideProcessDetail chatContainerInnerClassName="px-3" switchSibling={switchSibling}/>
              </div>
            </div>)}
      </div>
      {showMessageLogModal && (<context_1.WorkflowContextProvider>
          <message_log_modal_1.default width={width} currentLogItem={currentLogItem} onCancel={() => {
                setCurrentLogItem();
                setShowMessageLogModal(false);
            }} defaultTab={currentLogModalActiveTab}/>
        </context_1.WorkflowContextProvider>)}
      {!isChatMode && showPromptLogModal && (<prompt_log_modal_1.default width={width} currentLogItem={currentLogItem} onCancel={() => {
                setCurrentLogItem();
                setShowPromptLogModal(false);
            }}/>)}
    </div>);
}
/**
 * Text App Conversation Detail Component
 */
const CompletionConversationDetailComp = ({ appId, conversationId }) => {
    // Text Generator App Session Details Including Message List
    const { data: conversationDetail, refetch: conversationDetailMutate } = (0, use_log_1.useCompletionConversationDetail)(appId, conversationId);
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleFeedback = async (mid, { rating, content }) => {
        try {
            await (0, log_1.updateLogMessageFeedbacks)({
                url: `/apps/${appId}/feedbacks`,
                body: { message_id: mid, rating, content: content ?? undefined },
            });
            conversationDetailMutate();
            notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            return true;
        }
        catch {
            notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            return false;
        }
    };
    const handleAnnotation = async (mid, value) => {
        try {
            await (0, log_1.updateLogMessageAnnotations)({ url: `/apps/${appId}/annotations`, body: { message_id: mid, content: value } });
            conversationDetailMutate();
            notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            return true;
        }
        catch {
            notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            return false;
        }
    };
    if (!conversationDetail)
        return null;
    return (<DetailPanel detail={conversationDetail} onFeedback={handleFeedback} onSubmitAnnotation={handleAnnotation}/>);
};
/**
 * Chat App Conversation Detail Component
 */
const ChatConversationDetailComp = ({ appId, conversationId }) => {
    const { data: conversationDetail } = (0, use_log_1.useChatConversationDetail)(appId, conversationId);
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleFeedback = async (mid, { rating, content }) => {
        try {
            await (0, log_1.updateLogMessageFeedbacks)({
                url: `/apps/${appId}/feedbacks`,
                body: { message_id: mid, rating, content: content ?? undefined },
            });
            notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            return true;
        }
        catch {
            notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            return false;
        }
    };
    const handleAnnotation = async (mid, value) => {
        try {
            await (0, log_1.updateLogMessageAnnotations)({ url: `/apps/${appId}/annotations`, body: { message_id: mid, content: value } });
            notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            return true;
        }
        catch {
            notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            return false;
        }
    };
    if (!conversationDetail)
        return null;
    return (<DetailPanel detail={conversationDetail} onFeedback={handleFeedback} onSubmitAnnotation={handleAnnotation}/>);
};
/**
 * Conversation list component including basic information
 */
const ConversationList = ({ logs, appDetail, onRefresh }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { formatTime } = (0, use_timestamp_1.default)();
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const conversationIdInUrl = searchParams.get('conversation_id') ?? undefined;
    const media = (0, use_breakpoints_1.default)();
    const isMobile = media === use_breakpoints_1.MediaType.mobile;
    const [showDrawer, setShowDrawer] = (0, react_2.useState)(false); // Whether to display the chat details drawer
    const [currentConversation, setCurrentConversation] = (0, react_2.useState)(); // Currently selected conversation
    const closingConversationIdRef = (0, react_2.useRef)(null);
    const pendingConversationIdRef = (0, react_2.useRef)(null);
    const pendingConversationCacheRef = (0, react_2.useRef)(undefined);
    const isChatMode = appDetail.mode !== app_1.AppModeEnum.COMPLETION; // Whether the app is a chat app
    const isChatflow = appDetail.mode === app_1.AppModeEnum.ADVANCED_CHAT; // Whether the app is a chatflow app
    const { setShowPromptLogModal, setShowAgentLogModal, setShowMessageLogModal } = (0, store_1.useStore)((0, shallow_1.useShallow)((state) => ({
        setShowPromptLogModal: state.setShowPromptLogModal,
        setShowAgentLogModal: state.setShowAgentLogModal,
        setShowMessageLogModal: state.setShowMessageLogModal,
    })));
    const activeConversationId = conversationIdInUrl ?? pendingConversationIdRef.current ?? currentConversation?.id;
    const buildUrlWithConversation = (0, react_2.useCallback)((conversationId) => {
        const params = new URLSearchParams(searchParams.toString());
        if (conversationId)
            params.set('conversation_id', conversationId);
        else
            params.delete('conversation_id');
        const queryString = params.toString();
        return queryString ? `${pathname}?${queryString}` : pathname;
    }, [pathname, searchParams]);
    const handleRowClick = (0, react_2.useCallback)((log) => {
        if (conversationIdInUrl === log.id) {
            if (!showDrawer)
                setShowDrawer(true);
            if (!currentConversation || currentConversation.id !== log.id)
                setCurrentConversation(log);
            return;
        }
        pendingConversationIdRef.current = log.id;
        pendingConversationCacheRef.current = log;
        if (!showDrawer)
            setShowDrawer(true);
        if (currentConversation?.id !== log.id)
            setCurrentConversation(undefined);
        router.push(buildUrlWithConversation(log.id), { scroll: false });
    }, [buildUrlWithConversation, conversationIdInUrl, currentConversation, router, showDrawer]);
    const currentConversationId = currentConversation?.id;
    (0, react_2.useEffect)(() => {
        if (!conversationIdInUrl) {
            if (pendingConversationIdRef.current)
                return;
            if (showDrawer || currentConversationId) {
                setShowDrawer(false);
                setCurrentConversation(undefined);
            }
            closingConversationIdRef.current = null;
            pendingConversationCacheRef.current = undefined;
            return;
        }
        if (closingConversationIdRef.current === conversationIdInUrl)
            return;
        if (pendingConversationIdRef.current === conversationIdInUrl)
            pendingConversationIdRef.current = null;
        const matchedConversation = logs?.data?.find((item) => item.id === conversationIdInUrl);
        const nextConversation = matchedConversation
            ?? pendingConversationCacheRef.current
            ?? { id: conversationIdInUrl, isPlaceholder: true };
        if (!showDrawer)
            setShowDrawer(true);
        if (!currentConversation || currentConversation.id !== conversationIdInUrl || (!('created_at' in currentConversation) && matchedConversation))
            setCurrentConversation(nextConversation);
        if (pendingConversationCacheRef.current?.id === conversationIdInUrl || matchedConversation)
            pendingConversationCacheRef.current = undefined;
    }, [conversationIdInUrl, currentConversation, isChatMode, logs?.data, showDrawer]);
    const onCloseDrawer = (0, react_2.useCallback)(() => {
        onRefresh();
        setShowDrawer(false);
        setCurrentConversation(undefined);
        setShowPromptLogModal(false);
        setShowAgentLogModal(false);
        setShowMessageLogModal(false);
        pendingConversationIdRef.current = null;
        pendingConversationCacheRef.current = undefined;
        closingConversationIdRef.current = conversationIdInUrl ?? null;
        if (conversationIdInUrl)
            router.replace(buildUrlWithConversation(), { scroll: false });
    }, [buildUrlWithConversation, conversationIdInUrl, onRefresh, router, setShowAgentLogModal, setShowMessageLogModal, setShowPromptLogModal]);
    // Annotated data needs to be highlighted
    const renderTdValue = (value, isEmptyStyle, isHighlight = false, annotation) => {
        return (<tooltip_1.default popupContent={(<span className="inline-flex items-center text-xs text-text-tertiary">
            <react_1.RiEditFill className="mr-1 h-3 w-3"/>
            {`${t('detail.annotationTip', { ns: 'appLog', user: annotation?.account?.name })} ${formatTime(annotation?.created_at || (0, dayjs_1.default)().unix(), 'MM-DD hh:mm A')}`}
          </span>)} popupClassName={(isHighlight && !isChatMode) ? '' : '!hidden'}>
        <div className={(0, classnames_1.cn)(isEmptyStyle ? 'text-text-quaternary' : 'text-text-secondary', !isHighlight ? '' : 'bg-orange-100', 'system-sm-regular overflow-hidden text-ellipsis whitespace-nowrap')}>
          {value || '-'}
        </div>
      </tooltip_1.default>);
    };
    if (!logs)
        return <loading_1.default />;
    return (<div className="relative mt-2 grow overflow-x-auto">
      <table className={(0, classnames_1.cn)('w-full min-w-[440px] border-collapse border-0')}>
        <thead className="system-xs-medium-uppercase text-text-tertiary">
          <tr>
            <td className="w-5 whitespace-nowrap rounded-l-lg bg-background-section-burn pl-2 pr-1"></td>
            <td className="whitespace-nowrap bg-background-section-burn py-1.5 pl-3">{isChatMode ? t('table.header.summary', { ns: 'appLog' }) : t('table.header.input', { ns: 'appLog' })}</td>
            <td className="whitespace-nowrap bg-background-section-burn py-1.5 pl-3">{t('table.header.endUser', { ns: 'appLog' })}</td>
            {isChatflow && <td className="whitespace-nowrap bg-background-section-burn py-1.5 pl-3">{t('table.header.status', { ns: 'appLog' })}</td>}
            <td className="whitespace-nowrap bg-background-section-burn py-1.5 pl-3">{isChatMode ? t('table.header.messageCount', { ns: 'appLog' }) : t('table.header.output', { ns: 'appLog' })}</td>
            <td className="whitespace-nowrap bg-background-section-burn py-1.5 pl-3">{t('table.header.userRate', { ns: 'appLog' })}</td>
            <td className="whitespace-nowrap bg-background-section-burn py-1.5 pl-3">{t('table.header.adminRate', { ns: 'appLog' })}</td>
            <td className="whitespace-nowrap bg-background-section-burn py-1.5 pl-3">{t('table.header.updatedTime', { ns: 'appLog' })}</td>
            <td className="whitespace-nowrap rounded-r-lg bg-background-section-burn py-1.5 pl-3">{t('table.header.time', { ns: 'appLog' })}</td>
          </tr>
        </thead>
        <tbody className="system-sm-regular text-text-secondary">
          {logs.data.map((log) => {
            const endUser = log.from_end_user_session_id || log.from_account_name;
            const leftValue = (0, compat_1.get)(log, isChatMode ? 'name' : 'message.inputs.query') || (!isChatMode ? ((0, compat_1.get)(log, 'message.query') || (0, compat_1.get)(log, 'message.inputs.default_input')) : '') || '';
            const rightValue = (0, compat_1.get)(log, isChatMode ? 'message_count' : 'message.answer');
            return (<tr key={log.id} className={(0, classnames_1.cn)('cursor-pointer border-b border-divider-subtle hover:bg-background-default-hover', activeConversationId !== log.id ? '' : 'bg-background-default-hover')} onClick={() => handleRowClick(log)}>
                <td className="h-4">
                  {!log.read_at && (<div className="flex items-center p-3 pr-0.5">
                      <span className="inline-block h-1.5 w-1.5 rounded bg-util-colors-blue-blue-500"></span>
                    </div>)}
                </td>
                <td className="w-[160px] p-3 pr-2" style={{ maxWidth: isChatMode ? 300 : 200 }}>
                  {renderTdValue(leftValue || t('table.empty.noChat', { ns: 'appLog' }), !leftValue, isChatMode && log.annotated)}
                </td>
                <td className="p-3 pr-2">{renderTdValue(endUser || defaultValue, !endUser)}</td>
                {isChatflow && (<td className="w-[160px] p-3 pr-2" style={{ maxWidth: isChatMode ? 300 : 200 }}>
                    {statusTdRender(log.status_count)}
                  </td>)}
                <td className="p-3 pr-2" style={{ maxWidth: isChatMode ? 100 : 200 }}>
                  {renderTdValue(rightValue === 0 ? 0 : (rightValue || t('table.empty.noOutput', { ns: 'appLog' })), !rightValue, !isChatMode && !!log.annotation?.content, log.annotation)}
                </td>
                <td className="p-3 pr-2">
                  {(!log.user_feedback_stats.like && !log.user_feedback_stats.dislike)
                    ? renderTdValue(defaultValue, true)
                    : (<>
                          {!!log.user_feedback_stats.like && <HandThumbIconWithCount iconType="up" count={log.user_feedback_stats.like}/>}
                          {!!log.user_feedback_stats.dislike && <HandThumbIconWithCount iconType="down" count={log.user_feedback_stats.dislike}/>}
                        </>)}
                </td>
                <td className="p-3 pr-2">
                  {(!log.admin_feedback_stats.like && !log.admin_feedback_stats.dislike)
                    ? renderTdValue(defaultValue, true)
                    : (<>
                          {!!log.admin_feedback_stats.like && <HandThumbIconWithCount iconType="up" count={log.admin_feedback_stats.like}/>}
                          {!!log.admin_feedback_stats.dislike && <HandThumbIconWithCount iconType="down" count={log.admin_feedback_stats.dislike}/>}
                        </>)}
                </td>
                <td className="w-[160px] p-3 pr-2">{formatTime(log.updated_at, t('dateTimeFormat', { ns: 'appLog' }))}</td>
                <td className="w-[160px] p-3 pr-2">{formatTime(log.created_at, t('dateTimeFormat', { ns: 'appLog' }))}</td>
              </tr>);
        })}
        </tbody>
      </table>
      <drawer_1.default isOpen={showDrawer} onClose={onCloseDrawer} mask={isMobile} footer={null} panelClassName="mt-16 mx-2 sm:mr-2 mb-4 !p-0 !max-w-[640px] rounded-xl bg-components-panel-bg">
        <DrawerContext.Provider value={{
            onClose: onCloseDrawer,
            appDetail,
        }}>
          {isChatMode
            ? <ChatConversationDetailComp appId={appDetail.id} conversationId={currentConversation?.id}/>
            : <CompletionConversationDetailComp appId={appDetail.id} conversationId={currentConversation?.id}/>}
        </DrawerContext.Provider>
      </drawer_1.default>
    </div>);
};
exports.default = ConversationList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBTVoseURBR29DO0FBQ3BDLDRDQUEwRDtBQUMxRCxpQ0FBeUI7QUFDekIsb0RBQTRDO0FBQzVDLDBDQUFrQztBQUNsQyw4Q0FBdUM7QUFDdkMsa0RBQTBDO0FBQzFDLGdEQUF5RTtBQUN6RSwrQkFBOEI7QUFDOUIsaUNBQWdFO0FBQ2hFLGlEQUE4QztBQUM5QywrREFBZ0U7QUFDaEUsbURBQWtEO0FBQ2xELG9FQUEyRDtBQUMzRCxzREFBb0U7QUFDcEUsa0VBQW9FO0FBQ3BFLHVFQUE4RDtBQUM5RCwwREFBa0Q7QUFDbEQsNERBQXVGO0FBQ3ZGLCtEQUFzRDtBQUN0RCx5REFBaUQ7QUFDakQscUVBQXlGO0FBQ3pGLDJEQUFtRDtBQUNuRCwrRUFBcUU7QUFDckUsdURBQTBEO0FBQzFELDJEQUFtRDtBQUNuRCx3REFBMkU7QUFDM0UsK0RBQTJFO0FBQzNFLHVEQUFxRDtBQUNyRCw2REFBbUU7QUFDbkUseURBQWdEO0FBQ2hELHVDQUF5RztBQUN6RywrQ0FBOEY7QUFDOUYscUNBQXlDO0FBQ3pDLG1EQUF1QztBQUN2QyxrRUFBd0Q7QUFDeEQsc0RBQThDO0FBQzlDLDJDQUFrQztBQU1sQyxlQUFLLENBQUMsTUFBTSxDQUFDLGFBQUcsQ0FBQyxDQUFBO0FBQ2pCLGVBQUssQ0FBQyxNQUFNLENBQUMsa0JBQVEsQ0FBQyxDQUFBO0FBUXRCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQTtBQWExQixNQUFNLGFBQWEsR0FBRyxJQUFBLG9DQUFhLEVBQWlCLEVBQW9CLENBQUMsQ0FBQTtBQUV6RTs7R0FFRztBQUNILE1BQU0sc0JBQXNCLEdBQW1ELENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtJQUNyRyxNQUFNLFNBQVMsR0FBRyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxnQ0FB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LENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLEVBQUc7WUFDOUYsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxFQUFHLENBQ3hHO1FBQUEsRUFBRSxhQUFhLENBQUMsUUFBUSxDQUMxQjtNQUFBLEVBQUUsZ0JBQU0sQ0FDVjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGdCQUFnQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IENoYXRJdGVtSW5UcmVlIH0gZnJvbSAnLi4vLi4vYmFzZS9jaGF0L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBGZWVkYmFja0Z1bmMsIEZlZWRiYWNrVHlwZSwgSUNoYXRJdGVtLCBTdWJtaXRBbm5vdGF0aW9uRnVuYyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jaGF0L2NoYXQvdHlwZSdcbmltcG9ydCB0eXBlIHsgQW5ub3RhdGlvbiwgQ2hhdENvbnZlcnNhdGlvbkdlbmVyYWxEZXRhaWwsIENoYXRDb252ZXJzYXRpb25zUmVzcG9uc2UsIENoYXRNZXNzYWdlLCBDaGF0TWVzc2FnZXNSZXF1ZXN0LCBDb21wbGV0aW9uQ29udmVyc2F0aW9uR2VuZXJhbERldGFpbCwgQ29tcGxldGlvbkNvbnZlcnNhdGlvbnNSZXNwb25zZSwgTG9nQW5ub3RhdGlvbiB9IGZyb20gJ0AvbW9kZWxzL2xvZydcbmltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQge1xuICBIYW5kVGh1bWJEb3duSWNvbixcbiAgSGFuZFRodW1iVXBJY29uLFxufSBmcm9tICdAaGVyb2ljb25zL3JlYWN0LzI0L291dGxpbmUnXG5pbXBvcnQgeyBSaUNsb3NlTGluZSwgUmlFZGl0RmlsbCB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5pbXBvcnQgdGltZXpvbmUgZnJvbSAnZGF5anMvcGx1Z2luL3RpbWV6b25lJ1xuaW1wb3J0IHV0YyBmcm9tICdkYXlqcy9wbHVnaW4vdXRjJ1xuaW1wb3J0IHsgZ2V0IH0gZnJvbSAnZXMtdG9vbGtpdC9jb21wYXQnXG5pbXBvcnQgeyBub29wIH0gZnJvbSAnZXMtdG9vbGtpdC9mdW5jdGlvbidcbmltcG9ydCB7IHVzZVBhdGhuYW1lLCB1c2VSb3V0ZXIsIHVzZVNlYXJjaFBhcmFtcyB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuaW1wb3J0IHsgdXNlU2hhbGxvdyB9IGZyb20gJ3p1c3RhbmQvcmVhY3Qvc2hhbGxvdydcbmltcG9ydCBNb2RlbEluZm8gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvbG9nL21vZGVsLWluZm8nXG5pbXBvcnQgeyB1c2VTdG9yZSBhcyB1c2VBcHBTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJ1xuaW1wb3J0IFRleHRHZW5lcmF0aW9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3RleHQtZ2VuZXJhdGUvaXRlbSdcbmltcG9ydCBBY3Rpb25CdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FjdGlvbi1idXR0b24nXG5pbXBvcnQgQ2hhdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC9jaGF0J1xuaW1wb3J0IHsgYnVpbGRDaGF0SXRlbVRyZWUsIGdldFRocmVhZE1lc3NhZ2VzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoYXQvdXRpbHMnXG5pbXBvcnQgQ29weUljb24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NvcHktaWNvbidcbmltcG9ydCBEcmF3ZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2RyYXdlcidcbmltcG9ydCB7IGdldFByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZpbGUtdXBsb2FkZXIvdXRpbHMnXG5pbXBvcnQgTG9hZGluZyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbG9hZGluZydcbmltcG9ydCBNZXNzYWdlTG9nTW9kYWwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL21lc3NhZ2UtbG9nLW1vZGFsJ1xuaW1wb3J0IHsgVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Rvb2x0aXAnXG5pbXBvcnQgeyBhZGRGaWxlSW5mb3MsIHNvcnRBZ2VudFNvcnRzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy90b29scy91dGlscydcbmltcG9ydCB7IFdvcmtmbG93Q29udGV4dFByb3ZpZGVyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9jb250ZXh0J1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB1c2VCcmVha3BvaW50cywgeyBNZWRpYVR5cGUgfSBmcm9tICdAL2hvb2tzL3VzZS1icmVha3BvaW50cydcbmltcG9ydCB1c2VUaW1lc3RhbXAgZnJvbSAnQC9ob29rcy91c2UtdGltZXN0YW1wJ1xuaW1wb3J0IHsgZmV0Y2hDaGF0TWVzc2FnZXMsIHVwZGF0ZUxvZ01lc3NhZ2VBbm5vdGF0aW9ucywgdXBkYXRlTG9nTWVzc2FnZUZlZWRiYWNrcyB9IGZyb20gJ0Avc2VydmljZS9sb2cnXG5pbXBvcnQgeyB1c2VDaGF0Q29udmVyc2F0aW9uRGV0YWlsLCB1c2VDb21wbGV0aW9uQ29udmVyc2F0aW9uRGV0YWlsIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1sb2cnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgUHJvbXB0TG9nTW9kYWwgZnJvbSAnLi4vLi4vYmFzZS9wcm9tcHQtbG9nLW1vZGFsJ1xuaW1wb3J0IEluZGljYXRvciBmcm9tICcuLi8uLi9oZWFkZXIvaW5kaWNhdG9yJ1xuaW1wb3J0IFZhclBhbmVsIGZyb20gJy4vdmFyLXBhbmVsJ1xuXG50eXBlIEFwcFN0b3JlU3RhdGUgPSBSZXR1cm5UeXBlPHR5cGVvZiB1c2VBcHBTdG9yZS5nZXRTdGF0ZT5cbnR5cGUgQ29udmVyc2F0aW9uTGlzdEl0ZW0gPSBDaGF0Q29udmVyc2F0aW9uR2VuZXJhbERldGFpbCB8IENvbXBsZXRpb25Db252ZXJzYXRpb25HZW5lcmFsRGV0YWlsXG50eXBlIENvbnZlcnNhdGlvblNlbGVjdGlvbiA9IENvbnZlcnNhdGlvbkxpc3RJdGVtIHwgeyBpZDogc3RyaW5nLCBpc1BsYWNlaG9sZGVyPzogdHJ1ZSB9XG5cbmRheWpzLmV4dGVuZCh1dGMpXG5kYXlqcy5leHRlbmQodGltZXpvbmUpXG5cbnR5cGUgSUNvbnZlcnNhdGlvbkxpc3QgPSB7XG4gIGxvZ3M/OiBDaGF0Q29udmVyc2F0aW9uc1Jlc3BvbnNlIHwgQ29tcGxldGlvbkNvbnZlcnNhdGlvbnNSZXNwb25zZVxuICBhcHBEZXRhaWw6IEFwcFxuICBvblJlZnJlc2g6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgZGVmYXVsdFZhbHVlID0gJ04vQSdcblxudHlwZSBJRHJhd2VyQ29udGV4dCA9IHtcbiAgb25DbG9zZTogKCkgPT4gdm9pZFxuICBhcHBEZXRhaWw/OiBBcHBcbn1cblxudHlwZSBTdGF0dXNDb3VudCA9IHtcbiAgc3VjY2VzczogbnVtYmVyXG4gIGZhaWxlZDogbnVtYmVyXG4gIHBhcnRpYWxfc3VjY2VzczogbnVtYmVyXG59XG5cbmNvbnN0IERyYXdlckNvbnRleHQgPSBjcmVhdGVDb250ZXh0PElEcmF3ZXJDb250ZXh0Pih7fSBhcyBJRHJhd2VyQ29udGV4dClcblxuLyoqXG4gKiBJY29uIGNvbXBvbmVudCB3aXRoIG51bWJlcnNcbiAqL1xuY29uc3QgSGFuZFRodW1iSWNvbldpdGhDb3VudDogRkM8eyBjb3VudDogbnVtYmVyLCBpY29uVHlwZTogJ3VwJyB8ICdkb3duJyB9PiA9ICh7IGNvdW50LCBpY29uVHlwZSB9KSA9PiB7XG4gIGNvbnN0IGNsYXNzbmFtZSA9IGljb25UeXBlID09PSAndXAnID8gJ3RleHQtcHJpbWFyeS02MDAgYmctcHJpbWFyeS01MCcgOiAndGV4dC1yZWQtNjAwIGJnLXJlZC01MCdcbiAgY29uc3QgSWNvbiA9IGljb25UeXBlID09PSAndXAnID8gSGFuZFRodW1iVXBJY29uIDogSGFuZFRodW1iRG93bkljb25cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17YGlubGluZS1mbGV4IHctZml0IGl0ZW1zLWNlbnRlciByb3VuZGVkLW1kIHAtMSB0ZXh0LXhzICR7Y2xhc3NuYW1lfSBtci0xIGxhc3Q6bXItMGB9PlxuICAgICAgPEljb24gY2xhc3NOYW1lPVwibXItMC41IGgtMyB3LTMgcm91bmRlZC1tZFwiIC8+XG4gICAgICB7Y291bnQgPiAwID8gY291bnQgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IHN0YXR1c1RkUmVuZGVyID0gKHN0YXR1c0NvdW50OiBTdGF0dXNDb3VudCkgPT4ge1xuICBpZiAoIXN0YXR1c0NvdW50KVxuICAgIHJldHVybiBudWxsXG5cbiAgaWYgKHN0YXR1c0NvdW50LnBhcnRpYWxfc3VjY2VzcyArIHN0YXR1c0NvdW50LmZhaWxlZCA9PT0gMCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1zZW1pYm9sZC11cHBlcmNhc2UgaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgIDxJbmRpY2F0b3IgY29sb3I9XCJncmVlblwiIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtdXRpbC1jb2xvcnMtZ3JlZW4tZ3JlZW4tNjAwXCI+U3VjY2Vzczwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuICBlbHNlIGlmIChzdGF0dXNDb3VudC5mYWlsZWQgPT09IDApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtc2VtaWJvbGQtdXBwZXJjYXNlIGlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICA8SW5kaWNhdG9yIGNvbG9yPVwiZ3JlZW5cIiAvPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXV0aWwtY29sb3JzLWdyZWVuLWdyZWVuLTYwMFwiPlBhcnRpYWwgU3VjY2Vzczwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtc2VtaWJvbGQtdXBwZXJjYXNlIGlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICA8SW5kaWNhdG9yIGNvbG9yPVwicmVkXCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC11dGlsLWNvbG9ycy1yZWQtcmVkLTYwMFwiPlxuICAgICAgICAgIHtzdGF0dXNDb3VudC5mYWlsZWR9XG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICB7YCR7c3RhdHVzQ291bnQuZmFpbGVkID4gMSA/ICdGYWlsdXJlcycgOiAnRmFpbHVyZSd9YH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmNvbnN0IGdldEZvcm1hdHRlZENoYXRMaXN0ID0gKG1lc3NhZ2VzOiBDaGF0TWVzc2FnZVtdLCBjb252ZXJzYXRpb25JZDogc3RyaW5nLCB0aW1lem9uZTogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZykgPT4ge1xuICBjb25zdCBuZXdDaGF0TGlzdDogSUNoYXRJdGVtW10gPSBbXVxuICB0cnkge1xuICAgIG1lc3NhZ2VzLmZvckVhY2goKGl0ZW06IENoYXRNZXNzYWdlKSA9PiB7XG4gICAgICBjb25zdCBxdWVzdGlvbkZpbGVzID0gaXRlbS5tZXNzYWdlX2ZpbGVzPy5maWx0ZXIoKGZpbGU6IGFueSkgPT4gZmlsZS5iZWxvbmdzX3RvID09PSAndXNlcicpIHx8IFtdXG4gICAgICBuZXdDaGF0TGlzdC5wdXNoKHtcbiAgICAgICAgaWQ6IGBxdWVzdGlvbi0ke2l0ZW0uaWR9YCxcbiAgICAgICAgY29udGVudDogaXRlbS5pbnB1dHMucXVlcnkgfHwgaXRlbS5pbnB1dHMuZGVmYXVsdF9pbnB1dCB8fCBpdGVtLnF1ZXJ5LCAvLyB0ZXh0IGdlbmVyYXRpb246IGl0ZW0uaW5wdXRzLnF1ZXJ5OyBjaGF0OiBpdGVtLnF1ZXJ5XG4gICAgICAgIGlzQW5zd2VyOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZV9maWxlczogZ2V0UHJvY2Vzc2VkRmlsZXNGcm9tUmVzcG9uc2UocXVlc3Rpb25GaWxlcy5tYXAoKGl0ZW06IGFueSkgPT4gKHsgLi4uaXRlbSwgcmVsYXRlZF9pZDogaXRlbS5pZCB9KSkpLFxuICAgICAgICBwYXJlbnRNZXNzYWdlSWQ6IGl0ZW0ucGFyZW50X21lc3NhZ2VfaWQgfHwgdW5kZWZpbmVkLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgYW5zd2VyRmlsZXMgPSBpdGVtLm1lc3NhZ2VfZmlsZXM/LmZpbHRlcigoZmlsZTogYW55KSA9PiBmaWxlLmJlbG9uZ3NfdG8gPT09ICdhc3Npc3RhbnQnKSB8fCBbXVxuICAgICAgbmV3Q2hhdExpc3QucHVzaCh7XG4gICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICBjb250ZW50OiBpdGVtLmFuc3dlcixcbiAgICAgICAgYWdlbnRfdGhvdWdodHM6IGFkZEZpbGVJbmZvcyhpdGVtLmFnZW50X3Rob3VnaHRzID8gc29ydEFnZW50U29ydHMoaXRlbS5hZ2VudF90aG91Z2h0cykgOiBpdGVtLmFnZW50X3Rob3VnaHRzLCBpdGVtLm1lc3NhZ2VfZmlsZXMpLFxuICAgICAgICBmZWVkYmFjazogaXRlbS5mZWVkYmFja3M/LmZpbmQoaXRlbSA9PiBpdGVtLmZyb21fc291cmNlID09PSAndXNlcicpLCAvLyB1c2VyIGZlZWRiYWNrXG4gICAgICAgIGFkbWluRmVlZGJhY2s6IGl0ZW0uZmVlZGJhY2tzPy5maW5kKGl0ZW0gPT4gaXRlbS5mcm9tX3NvdXJjZSA9PT0gJ2FkbWluJyksIC8vIGFkbWluIGZlZWRiYWNrXG4gICAgICAgIGZlZWRiYWNrRGlzYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc0Fuc3dlcjogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZV9maWxlczogZ2V0UHJvY2Vzc2VkRmlsZXNGcm9tUmVzcG9uc2UoYW5zd2VyRmlsZXMubWFwKChpdGVtOiBhbnkpID0+ICh7IC4uLml0ZW0sIHJlbGF0ZWRfaWQ6IGl0ZW0uaWQgfSkpKSxcbiAgICAgICAgbG9nOiBbXG4gICAgICAgICAgLi4uKGl0ZW0ubWVzc2FnZSA/PyBbXSksXG4gICAgICAgICAgLi4uKGl0ZW0ubWVzc2FnZT8uW2l0ZW0ubWVzc2FnZS5sZW5ndGggLSAxXT8ucm9sZSAhPT0gJ2Fzc2lzdGFudCdcbiAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJvbGU6ICdhc3Npc3RhbnQnLFxuICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbS5hbnN3ZXIsXG4gICAgICAgICAgICAgICAgICBmaWxlczogaXRlbS5tZXNzYWdlX2ZpbGVzPy5maWx0ZXIoKGZpbGU6IGFueSkgPT4gZmlsZS5iZWxvbmdzX3RvID09PSAnYXNzaXN0YW50JykgfHwgW10sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgOiBbXSksXG4gICAgICAgIF0gYXMgSUNoYXRJdGVtWydsb2cnXSxcbiAgICAgICAgd29ya2Zsb3dfcnVuX2lkOiBpdGVtLndvcmtmbG93X3J1bl9pZCxcbiAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgaW5wdXRzOiBpdGVtLmlucHV0cyxcbiAgICAgICAgICBxdWVyeTogaXRlbS5xdWVyeSxcbiAgICAgICAgfSxcbiAgICAgICAgbW9yZToge1xuICAgICAgICAgIHRpbWU6IGRheWpzLnVuaXgoaXRlbS5jcmVhdGVkX2F0KS50eih0aW1lem9uZSkuZm9ybWF0KGZvcm1hdCksXG4gICAgICAgICAgdG9rZW5zOiBpdGVtLmFuc3dlcl90b2tlbnMgKyBpdGVtLm1lc3NhZ2VfdG9rZW5zLFxuICAgICAgICAgIGxhdGVuY3k6IChpdGVtLnByb3ZpZGVyX3Jlc3BvbnNlX2xhdGVuY3kgPz8gMCkudG9GaXhlZCgyKSxcbiAgICAgICAgfSxcbiAgICAgICAgY2l0YXRpb246IGl0ZW0ubWV0YWRhdGE/LnJldHJpZXZlcl9yZXNvdXJjZXMsXG4gICAgICAgIGFubm90YXRpb246ICgoKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0uYW5ub3RhdGlvbl9oaXRfaGlzdG9yeSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaWQ6IGl0ZW0uYW5ub3RhdGlvbl9oaXRfaGlzdG9yeS5hbm5vdGF0aW9uX2lkLFxuICAgICAgICAgICAgICBhdXRob3JOYW1lOiBpdGVtLmFubm90YXRpb25faGl0X2hpc3RvcnkuYW5ub3RhdGlvbl9jcmVhdGVfYWNjb3VudD8ubmFtZSB8fCAnTi9BJyxcbiAgICAgICAgICAgICAgY3JlYXRlZF9hdDogaXRlbS5hbm5vdGF0aW9uX2hpdF9oaXN0b3J5LmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGl0ZW0uYW5ub3RhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaWQ6IGl0ZW0uYW5ub3RhdGlvbi5pZCxcbiAgICAgICAgICAgICAgYXV0aG9yTmFtZTogaXRlbS5hbm5vdGF0aW9uLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgICAgbG9nQW5ub3RhdGlvbjogaXRlbS5hbm5vdGF0aW9uLFxuICAgICAgICAgICAgICBjcmVhdGVkX2F0OiAwLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfSkoKSxcbiAgICAgICAgcGFyZW50TWVzc2FnZUlkOiBgcXVlc3Rpb24tJHtpdGVtLmlkfWAsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gbmV3Q2hhdExpc3RcbiAgfVxuICBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRGb3JtYXR0ZWRDaGF0TGlzdCBwcm9jZXNzaW5nIGZhaWxlZDonLCBlcnJvcilcbiAgICB0aHJvdyBlcnJvclxuICB9XG59XG5cbnR5cGUgSURldGFpbFBhbmVsID0ge1xuICBkZXRhaWw6IGFueVxuICBvbkZlZWRiYWNrOiBGZWVkYmFja0Z1bmNcbiAgb25TdWJtaXRBbm5vdGF0aW9uOiBTdWJtaXRBbm5vdGF0aW9uRnVuY1xufVxuXG5mdW5jdGlvbiBEZXRhaWxQYW5lbCh7IGRldGFpbCwgb25GZWVkYmFjayB9OiBJRGV0YWlsUGFuZWwpIHtcbiAgY29uc3QgTUlOX0lURU1TX0ZPUl9TQ1JPTExfTE9BRElORyA9IDhcbiAgY29uc3QgU0NST0xMX0RFQk9VTkNFX01TID0gMjAwXG4gIGNvbnN0IHsgdXNlclByb2ZpbGU6IHsgdGltZXpvbmUgfSB9ID0gdXNlQXBwQ29udGV4dCgpXG4gIGNvbnN0IHsgZm9ybWF0VGltZSB9ID0gdXNlVGltZXN0YW1wKClcbiAgY29uc3QgeyBvbkNsb3NlLCBhcHBEZXRhaWwgfSA9IHVzZUNvbnRleHQoRHJhd2VyQ29udGV4dClcbiAgY29uc3QgeyBub3RpZnkgfSA9IHVzZUNvbnRleHQoVG9hc3RDb250ZXh0KVxuICBjb25zdCB7IGN1cnJlbnRMb2dJdGVtLCBzZXRDdXJyZW50TG9nSXRlbSwgc2hvd01lc3NhZ2VMb2dNb2RhbCwgc2V0U2hvd01lc3NhZ2VMb2dNb2RhbCwgc2hvd1Byb21wdExvZ01vZGFsLCBzZXRTaG93UHJvbXB0TG9nTW9kYWwsIGN1cnJlbnRMb2dNb2RhbEFjdGl2ZVRhYiB9ID0gdXNlQXBwU3RvcmUodXNlU2hhbGxvdygoc3RhdGU6IEFwcFN0b3JlU3RhdGUpID0+ICh7XG4gICAgY3VycmVudExvZ0l0ZW06IHN0YXRlLmN1cnJlbnRMb2dJdGVtLFxuICAgIHNldEN1cnJlbnRMb2dJdGVtOiBzdGF0ZS5zZXRDdXJyZW50TG9nSXRlbSxcbiAgICBzaG93TWVzc2FnZUxvZ01vZGFsOiBzdGF0ZS5zaG93TWVzc2FnZUxvZ01vZGFsLFxuICAgIHNldFNob3dNZXNzYWdlTG9nTW9kYWw6IHN0YXRlLnNldFNob3dNZXNzYWdlTG9nTW9kYWwsXG4gICAgc2hvd1Byb21wdExvZ01vZGFsOiBzdGF0ZS5zaG93UHJvbXB0TG9nTW9kYWwsXG4gICAgc2V0U2hvd1Byb21wdExvZ01vZGFsOiBzdGF0ZS5zZXRTaG93UHJvbXB0TG9nTW9kYWwsXG4gICAgY3VycmVudExvZ01vZGFsQWN0aXZlVGFiOiBzdGF0ZS5jdXJyZW50TG9nTW9kYWxBY3RpdmVUYWIsXG4gIH0pKSlcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IFtoYXNNb3JlLCBzZXRIYXNNb3JlXSA9IHVzZVN0YXRlKHRydWUpXG4gIGNvbnN0IFt2YXJWYWx1ZXMsIHNldFZhclZhbHVlc10gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih7fSlcbiAgY29uc3QgaXNMb2FkaW5nUmVmID0gdXNlUmVmKGZhbHNlKVxuICBjb25zdCBhYm9ydENvbnRyb2xsZXJSZWYgPSB1c2VSZWY8QWJvcnRDb250cm9sbGVyIHwgbnVsbD4obnVsbClcbiAgY29uc3QgcmVxdWVzdElkUmVmID0gdXNlUmVmKDApXG4gIGNvbnN0IGxhc3RMb2FkVGltZVJlZiA9IHVzZVJlZigwKVxuICBjb25zdCByZXRyeUNvdW50UmVmID0gdXNlUmVmKDApXG4gIGNvbnN0IG9sZGVzdEFuc3dlcklkUmVmID0gdXNlUmVmPHN0cmluZyB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKVxuICBjb25zdCBNQVhfUkVUUllfQ09VTlQgPSAzXG5cbiAgY29uc3QgW2FsbENoYXRJdGVtcywgc2V0QWxsQ2hhdEl0ZW1zXSA9IHVzZVN0YXRlPElDaGF0SXRlbVtdPihbXSlcbiAgY29uc3QgW2NoYXRJdGVtVHJlZSwgc2V0Q2hhdEl0ZW1UcmVlXSA9IHVzZVN0YXRlPENoYXRJdGVtSW5UcmVlW10+KFtdKVxuICBjb25zdCBbdGhyZWFkQ2hhdEl0ZW1zLCBzZXRUaHJlYWRDaGF0SXRlbXNdID0gdXNlU3RhdGU8SUNoYXRJdGVtW10+KFtdKVxuXG4gIGNvbnN0IGZldGNoRGF0YSA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXNMb2FkaW5nUmVmLmN1cnJlbnQgfHwgIWhhc01vcmUpXG4gICAgICByZXR1cm5cblxuICAgIC8vIENhbmNlbCBhbnkgaW4tZmxpZ2h0IHJlcXVlc3RcbiAgICBpZiAoYWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQpIHtcbiAgICAgIGFib3J0Q29udHJvbGxlclJlZi5jdXJyZW50LmFib3J0KClcbiAgICB9XG5cbiAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpXG4gICAgYWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBjb250cm9sbGVyXG4gICAgY29uc3QgY3VycmVudFJlcXVlc3RJZCA9ICsrcmVxdWVzdElkUmVmLmN1cnJlbnRcblxuICAgIHRyeSB7XG4gICAgICBpc0xvYWRpbmdSZWYuY3VycmVudCA9IHRydWVcblxuICAgICAgY29uc3QgcGFyYW1zOiBDaGF0TWVzc2FnZXNSZXF1ZXN0ID0ge1xuICAgICAgICBjb252ZXJzYXRpb25faWQ6IGRldGFpbC5pZCxcbiAgICAgICAgbGltaXQ6IDEwLFxuICAgICAgfVxuICAgICAgLy8gVXNlIHJlZiBmb3IgcGFnaW5hdGlvbiBhbmNob3IgdG8gYXZvaWQgc3RhbGUgY2xvc3VyZSBpc3N1ZXNcbiAgICAgIGlmIChvbGRlc3RBbnN3ZXJJZFJlZi5jdXJyZW50KVxuICAgICAgICBwYXJhbXMuZmlyc3RfaWQgPSBvbGRlc3RBbnN3ZXJJZFJlZi5jdXJyZW50XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VSZXMgPSBhd2FpdCBmZXRjaENoYXRNZXNzYWdlcyh7XG4gICAgICAgIHVybDogYC9hcHBzLyR7YXBwRGV0YWlsPy5pZH0vY2hhdC1tZXNzYWdlc2AsXG4gICAgICAgIHBhcmFtcyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIElnbm9yZSBzdGFsZSByZXNwb25zZXNcbiAgICAgIGlmIChjdXJyZW50UmVxdWVzdElkICE9PSByZXF1ZXN0SWRSZWYuY3VycmVudCB8fCBjb250cm9sbGVyLnNpZ25hbC5hYm9ydGVkKVxuICAgICAgICByZXR1cm5cbiAgICAgIGlmIChtZXNzYWdlUmVzLmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB2YXJWYWx1ZXMgPSBtZXNzYWdlUmVzLmRhdGEuYXQoLTEpIS5pbnB1dHNcbiAgICAgICAgc2V0VmFyVmFsdWVzKHZhclZhbHVlcylcbiAgICAgIH1cbiAgICAgIHNldEhhc01vcmUobWVzc2FnZVJlcy5oYXNfbW9yZSlcblxuICAgICAgY29uc3QgbmV3SXRlbXMgPSBnZXRGb3JtYXR0ZWRDaGF0TGlzdChtZXNzYWdlUmVzLmRhdGEsIGRldGFpbC5pZCwgdGltZXpvbmUhLCB0KCdkYXRlVGltZUZvcm1hdCcsIHsgbnM6ICdhcHBMb2cnIH0pIGFzIHN0cmluZylcblxuICAgICAgLy8gVXNlIGZ1bmN0aW9uYWwgdXBkYXRlIHRvIGF2b2lkIHN0YWxlIHN0YXRlIGlzc3Vlc1xuICAgICAgc2V0QWxsQ2hhdEl0ZW1zKChwcmV2SXRlbXM6IElDaGF0SXRlbVtdKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSWRzID0gbmV3IFNldChwcmV2SXRlbXMubWFwKGl0ZW0gPT4gaXRlbS5pZCkpXG4gICAgICAgIGNvbnN0IHVuaXF1ZU5ld0l0ZW1zID0gbmV3SXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWV4aXN0aW5nSWRzLmhhcyhpdGVtLmlkKSlcbiAgICAgICAgcmV0dXJuIFsuLi51bmlxdWVOZXdJdGVtcywgLi4ucHJldkl0ZW1zXVxuICAgICAgfSlcbiAgICB9XG4gICAgY2F0Y2ggKGVycjogdW5rbm93bikge1xuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yICYmIGVyci5uYW1lID09PSAnQWJvcnRFcnJvcicpXG4gICAgICAgIHJldHVyblxuICAgICAgY29uc29sZS5lcnJvcignZmV0Y2hEYXRhIGV4ZWN1dGlvbiBmYWlsZWQ6JywgZXJyKVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIGlzTG9hZGluZ1JlZi5jdXJyZW50ID0gZmFsc2VcbiAgICAgIGlmIChhYm9ydENvbnRyb2xsZXJSZWYuY3VycmVudCA9PT0gY29udHJvbGxlcilcbiAgICAgICAgYWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBudWxsXG4gICAgfVxuICB9LCBbZGV0YWlsLmlkLCBoYXNNb3JlLCB0aW1lem9uZSwgdCwgYXBwRGV0YWlsLCBkZXRhaWw/Lm1vZGVsX2NvbmZpZz8uY29uZmlncz8uaW50cm9kdWN0aW9uXSlcblxuICAvLyBEZXJpdmUgY2hhdEl0ZW1UcmVlLCB0aHJlYWRDaGF0SXRlbXMsIGFuZCBvbGRlc3RBbnN3ZXJJZFJlZiBmcm9tIGFsbENoYXRJdGVtc1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhbGxDaGF0SXRlbXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuXG5cbiAgICBsZXQgdHJlZSA9IGJ1aWxkQ2hhdEl0ZW1UcmVlKGFsbENoYXRJdGVtcylcbiAgICBpZiAoIWhhc01vcmUgJiYgZGV0YWlsPy5tb2RlbF9jb25maWc/LmNvbmZpZ3M/LmludHJvZHVjdGlvbikge1xuICAgICAgdHJlZSA9IFt7XG4gICAgICAgIGlkOiAnaW50cm9kdWN0aW9uJyxcbiAgICAgICAgaXNBbnN3ZXI6IHRydWUsXG4gICAgICAgIGlzT3BlbmluZ1N0YXRlbWVudDogdHJ1ZSxcbiAgICAgICAgY29udGVudDogZGV0YWlsPy5tb2RlbF9jb25maWc/LmNvbmZpZ3M/LmludHJvZHVjdGlvbiA/PyAnaGVsbG8nLFxuICAgICAgICBmZWVkYmFja0Rpc2FibGVkOiB0cnVlLFxuICAgICAgICBjaGlsZHJlbjogdHJlZSxcbiAgICAgIH1dXG4gICAgfVxuICAgIHNldENoYXRJdGVtVHJlZSh0cmVlKVxuXG4gICAgY29uc3QgbGFzdE1lc3NhZ2VJZCA9IGFsbENoYXRJdGVtcy5sZW5ndGggPiAwID8gYWxsQ2hhdEl0ZW1zW2FsbENoYXRJdGVtcy5sZW5ndGggLSAxXS5pZCA6IHVuZGVmaW5lZFxuICAgIHNldFRocmVhZENoYXRJdGVtcyhnZXRUaHJlYWRNZXNzYWdlcyh0cmVlLCBsYXN0TWVzc2FnZUlkKSlcblxuICAgIC8vIFVwZGF0ZSBwYWdpbmF0aW9uIGFuY2hvciByZWYgd2l0aCB0aGUgb2xkZXN0IGFuc3dlciBJRFxuICAgIGNvbnN0IGFuc3dlckl0ZW1zID0gYWxsQ2hhdEl0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uaXNBbnN3ZXIpXG4gICAgY29uc3Qgb2xkZXN0QW5zd2VyID0gYW5zd2VySXRlbXNbYW5zd2VySXRlbXMubGVuZ3RoIC0gMV1cbiAgICBpZiAob2xkZXN0QW5zd2VyPy5pZClcbiAgICAgIG9sZGVzdEFuc3dlcklkUmVmLmN1cnJlbnQgPSBvbGRlc3RBbnN3ZXIuaWRcbiAgfSwgW2FsbENoYXRJdGVtcywgaGFzTW9yZSwgZGV0YWlsPy5tb2RlbF9jb25maWc/LmNvbmZpZ3M/LmludHJvZHVjdGlvbl0pXG5cbiAgY29uc3Qgc3dpdGNoU2libGluZyA9IHVzZUNhbGxiYWNrKChzaWJsaW5nTWVzc2FnZUlkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBuZXdUaHJlYWRDaGF0SXRlbXMgPSBnZXRUaHJlYWRNZXNzYWdlcyhjaGF0SXRlbVRyZWUsIHNpYmxpbmdNZXNzYWdlSWQpXG4gICAgc2V0VGhyZWFkQ2hhdEl0ZW1zKG5ld1RocmVhZENoYXRJdGVtcylcbiAgfSwgW2NoYXRJdGVtVHJlZV0pXG5cbiAgY29uc3QgaGFuZGxlQW5ub3RhdGlvbkVkaXRlZCA9IHVzZUNhbGxiYWNrKChxdWVyeTogc3RyaW5nLCBhbnN3ZXI6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIHNldEFsbENoYXRJdGVtcyhhbGxDaGF0SXRlbXMubWFwKChpdGVtLCBpKSA9PiB7XG4gICAgICBpZiAoaSA9PT0gaW5kZXggLSAxKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBjb250ZW50OiBxdWVyeSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IGluZGV4KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBhbm5vdGF0aW9uOiB7XG4gICAgICAgICAgICAuLi5pdGVtLmFubm90YXRpb24sXG4gICAgICAgICAgICBsb2dBbm5vdGF0aW9uOiB7XG4gICAgICAgICAgICAgIC4uLml0ZW0uYW5ub3RhdGlvbj8ubG9nQW5ub3RhdGlvbixcbiAgICAgICAgICAgICAgY29udGVudDogYW5zd2VyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9IGFzIGFueSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW1cbiAgICB9KSlcbiAgfSwgW2FsbENoYXRJdGVtc10pXG4gIGNvbnN0IGhhbmRsZUFubm90YXRpb25BZGRlZCA9IHVzZUNhbGxiYWNrKChhbm5vdGF0aW9uSWQ6IHN0cmluZywgYXV0aG9yTmFtZTogc3RyaW5nLCBxdWVyeTogc3RyaW5nLCBhbnN3ZXI6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIHNldEFsbENoYXRJdGVtcyhhbGxDaGF0SXRlbXMubWFwKChpdGVtLCBpKSA9PiB7XG4gICAgICBpZiAoaSA9PT0gaW5kZXggLSAxKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBjb250ZW50OiBxdWVyeSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGFuc3dlckl0ZW0gPSB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBjb250ZW50OiBpdGVtLmNvbnRlbnQsXG4gICAgICAgICAgYW5ub3RhdGlvbjoge1xuICAgICAgICAgICAgaWQ6IGFubm90YXRpb25JZCxcbiAgICAgICAgICAgIGF1dGhvck5hbWUsXG4gICAgICAgICAgICBsb2dBbm5vdGF0aW9uOiB7XG4gICAgICAgICAgICAgIGNvbnRlbnQ6IGFuc3dlcixcbiAgICAgICAgICAgICAgYWNjb3VudDoge1xuICAgICAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgICAgICBuYW1lOiBhdXRob3JOYW1lLFxuICAgICAgICAgICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSBhcyBBbm5vdGF0aW9uLFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnN3ZXJJdGVtXG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlbVxuICAgIH0pKVxuICB9LCBbYWxsQ2hhdEl0ZW1zXSlcbiAgY29uc3QgaGFuZGxlQW5ub3RhdGlvblJlbW92ZWQgPSB1c2VDYWxsYmFjayhhc3luYyAoaW5kZXg6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IGFubm90YXRpb24gPSBhbGxDaGF0SXRlbXNbaW5kZXhdPy5hbm5vdGF0aW9uXG5cbiAgICB0cnkge1xuICAgICAgaWYgKGFubm90YXRpb24/LmlkKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsQW5ub3RhdGlvbiB9ID0gYXdhaXQgaW1wb3J0KCdAL3NlcnZpY2UvYW5ub3RhdGlvbicpXG4gICAgICAgIGF3YWl0IGRlbEFubm90YXRpb24oYXBwRGV0YWlsPy5pZCB8fCAnJywgYW5ub3RhdGlvbi5pZClcbiAgICAgIH1cblxuICAgICAgc2V0QWxsQ2hhdEl0ZW1zKGFsbENoYXRJdGVtcy5tYXAoKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgaWYgKGkgPT09IGluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICBjb250ZW50OiBpdGVtLmNvbnRlbnQsXG4gICAgICAgICAgICBhbm5vdGF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtXG4gICAgICB9KSlcblxuICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkVW5zdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9LCBbYWxsQ2hhdEl0ZW1zLCBhcHBEZXRhaWw/LmlkLCB0XSlcblxuICBjb25zdCBmZXRjaEluaXRpYXRlZCA9IHVzZVJlZihmYWxzZSlcblxuICAvLyBPbmx5IGxvYWQgaW5pdGlhbCBtZXNzYWdlcywgZG9uJ3QgYXV0by1sb2FkIG1vcmVcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYXBwRGV0YWlsPy5pZCAmJiBkZXRhaWwuaWQgJiYgYXBwRGV0YWlsPy5tb2RlICE9PSBBcHBNb2RlRW51bS5DT01QTEVUSU9OICYmICFmZXRjaEluaXRpYXRlZC5jdXJyZW50KSB7XG4gICAgICAvLyBNYXJrIGFzIGluaXRpYWxpemVkLCBidXQgZG9uJ3QgYXV0by1sb2FkIG1vcmUgbWVzc2FnZXNcbiAgICAgIGZldGNoSW5pdGlhdGVkLmN1cnJlbnQgPSB0cnVlXG4gICAgICAvLyBTdGlsbCBjYWxsIGZldGNoRGF0YSB0byBnZXQgaW5pdGlhbCBtZXNzYWdlc1xuICAgICAgZmV0Y2hEYXRhKClcbiAgICB9XG4gIH0sIFthcHBEZXRhaWw/LmlkLCBkZXRhaWwuaWQsIGFwcERldGFpbD8ubW9kZSwgZmV0Y2hEYXRhXSlcblxuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgY29uc3QgbG9hZE1vcmVNZXNzYWdlcyA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXNMb2FkaW5nIHx8ICFoYXNNb3JlIHx8ICFhcHBEZXRhaWw/LmlkIHx8ICFkZXRhaWwuaWQpXG4gICAgICByZXR1cm5cblxuICAgIC8vIFRocm90dGxlIHVzaW5nIHJlZiB0byBwZXJzaXN0IGFjcm9zcyByZS1yZW5kZXJzXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgIGlmIChub3cgLSBsYXN0TG9hZFRpbWVSZWYuY3VycmVudCA8IFNDUk9MTF9ERUJPVU5DRV9NUylcbiAgICAgIHJldHVyblxuICAgIGxhc3RMb2FkVGltZVJlZi5jdXJyZW50ID0gbm93XG5cbiAgICBzZXRJc0xvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJhbXM6IENoYXRNZXNzYWdlc1JlcXVlc3QgPSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbl9pZDogZGV0YWlsLmlkLFxuICAgICAgICBsaW1pdDogMTAsXG4gICAgICB9XG5cbiAgICAgIC8vIFVzZSByZWYgZm9yIHBhZ2luYXRpb24gYW5jaG9yIHRvIGF2b2lkIHN0YWxlIGNsb3N1cmUgaXNzdWVzXG4gICAgICBpZiAob2xkZXN0QW5zd2VySWRSZWYuY3VycmVudCkge1xuICAgICAgICBwYXJhbXMuZmlyc3RfaWQgPSBvbGRlc3RBbnN3ZXJJZFJlZi5jdXJyZW50XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VSZXMgPSBhd2FpdCBmZXRjaENoYXRNZXNzYWdlcyh7XG4gICAgICAgIHVybDogYC9hcHBzLyR7YXBwRGV0YWlsLmlkfS9jaGF0LW1lc3NhZ2VzYCxcbiAgICAgICAgcGFyYW1zLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFtZXNzYWdlUmVzLmRhdGEgfHwgbWVzc2FnZVJlcy5kYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzZXRIYXNNb3JlKGZhbHNlKVxuICAgICAgICByZXRyeUNvdW50UmVmLmN1cnJlbnQgPSAwXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAobWVzc2FnZVJlcy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgdmFyVmFsdWVzID0gbWVzc2FnZVJlcy5kYXRhLmF0KC0xKSEuaW5wdXRzXG4gICAgICAgIHNldFZhclZhbHVlcyh2YXJWYWx1ZXMpXG4gICAgICB9XG5cbiAgICAgIHNldEhhc01vcmUobWVzc2FnZVJlcy5oYXNfbW9yZSlcblxuICAgICAgY29uc3QgbmV3SXRlbXMgPSBnZXRGb3JtYXR0ZWRDaGF0TGlzdChcbiAgICAgICAgbWVzc2FnZVJlcy5kYXRhLFxuICAgICAgICBkZXRhaWwuaWQsXG4gICAgICAgIHRpbWV6b25lISxcbiAgICAgICAgdCgnZGF0ZVRpbWVGb3JtYXQnLCB7IG5zOiAnYXBwTG9nJyB9KSBhcyBzdHJpbmcsXG4gICAgICApXG5cbiAgICAgIC8vIFVzZSBmdW5jdGlvbmFsIHVwZGF0ZSB0byBnZXQgbGF0ZXN0IHN0YXRlIGFuZCBhdm9pZCBzdGFsZSBjbG9zdXJlc1xuICAgICAgc2V0QWxsQ2hhdEl0ZW1zKChwcmV2SXRlbXM6IElDaGF0SXRlbVtdKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSWRzID0gbmV3IFNldChwcmV2SXRlbXMubWFwKGl0ZW0gPT4gaXRlbS5pZCkpXG4gICAgICAgIGNvbnN0IHVuaXF1ZU5ld0l0ZW1zID0gbmV3SXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWV4aXN0aW5nSWRzLmhhcyhpdGVtLmlkKSlcblxuICAgICAgICAvLyBJZiBubyB1bmlxdWUgaXRlbXMgYW5kIHdlIGhhdmVuJ3QgZXhjZWVkZWQgcmV0cnkgbGltaXQsIHNpZ25hbCByZXRyeSBuZWVkZWRcbiAgICAgICAgaWYgKHVuaXF1ZU5ld0l0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGlmIChyZXRyeUNvdW50UmVmLmN1cnJlbnQgPCBNQVhfUkVUUllfQ09VTlQgJiYgcHJldkl0ZW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJldHJ5Q291bnRSZWYuY3VycmVudCsrXG4gICAgICAgICAgICByZXR1cm4gcHJldkl0ZW1zXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0cnlDb3VudFJlZi5jdXJyZW50ID0gMFxuICAgICAgICAgICAgcmV0dXJuIHByZXZJdGVtc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHJ5Q291bnRSZWYuY3VycmVudCA9IDBcbiAgICAgICAgcmV0dXJuIFsuLi51bmlxdWVOZXdJdGVtcywgLi4ucHJldkl0ZW1zXVxuICAgICAgfSlcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgc2V0SGFzTW9yZShmYWxzZSlcbiAgICAgIHJldHJ5Q291bnRSZWYuY3VycmVudCA9IDBcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpXG4gICAgfVxuICB9LCBbZGV0YWlsLmlkLCBoYXNNb3JlLCBpc0xvYWRpbmcsIHRpbWV6b25lLCB0LCBhcHBEZXRhaWwsIGRldGFpbD8ubW9kZWxfY29uZmlnPy5jb25maWdzPy5pbnRyb2R1Y3Rpb25dKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc2Nyb2xsYWJsZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JvbGxhYmxlRGl2JylcbiAgICBjb25zdCBvdXRlckRpdiA9IHNjcm9sbGFibGVEaXY/LnBhcmVudEVsZW1lbnRcbiAgICBjb25zdCBjaGF0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm14LTEubWItMS5ncm93Lm92ZXJmbG93LWF1dG8nKSBhcyBIVE1MRWxlbWVudFxuXG4gICAgbGV0IHNjcm9sbENvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gICAgaWYgKG91dGVyRGl2ICYmIG91dGVyRGl2LnNjcm9sbEhlaWdodCA+IG91dGVyRGl2LmNsaWVudEhlaWdodCkge1xuICAgICAgc2Nyb2xsQ29udGFpbmVyID0gb3V0ZXJEaXZcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsYWJsZURpdiAmJiBzY3JvbGxhYmxlRGl2LnNjcm9sbEhlaWdodCA+IHNjcm9sbGFibGVEaXYuY2xpZW50SGVpZ2h0KSB7XG4gICAgICBzY3JvbGxDb250YWluZXIgPSBzY3JvbGxhYmxlRGl2XG4gICAgfVxuICAgIGVsc2UgaWYgKGNoYXRDb250YWluZXIgJiYgY2hhdENvbnRhaW5lci5zY3JvbGxIZWlnaHQgPiBjaGF0Q29udGFpbmVyLmNsaWVudEhlaWdodCkge1xuICAgICAgc2Nyb2xsQ29udGFpbmVyID0gY2hhdENvbnRhaW5lclxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHBvc3NpYmxlQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vdmVyZmxvdy1hdXRvLCAub3ZlcmZsb3cteS1hdXRvJylcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zc2libGVDb250YWluZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHBvc3NpYmxlQ29udGFpbmVyc1tpXSBhcyBIVE1MRWxlbWVudFxuICAgICAgICBpZiAoY29udGFpbmVyLnNjcm9sbEhlaWdodCA+IGNvbnRhaW5lci5jbGllbnRIZWlnaHQpIHtcbiAgICAgICAgICBzY3JvbGxDb250YWluZXIgPSBjb250YWluZXJcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFzY3JvbGxDb250YWluZXIpXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IGhhbmRsZVNjcm9sbCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTY3JvbGxUb3AgPSBzY3JvbGxDb250YWluZXIhLnNjcm9sbFRvcFxuICAgICAgY29uc3QgaXNOZWFyVG9wID0gY3VycmVudFNjcm9sbFRvcCA8IDMwXG5cbiAgICAgIGlmIChpc05lYXJUb3AgJiYgaGFzTW9yZSAmJiAhaXNMb2FkaW5nKSB7XG4gICAgICAgIGxvYWRNb3JlTWVzc2FnZXMoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHNjcm9sbENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBoYW5kbGVTY3JvbGwsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxuXG4gICAgY29uc3QgaGFuZGxlV2hlZWwgPSAoZTogV2hlZWxFdmVudCkgPT4ge1xuICAgICAgaWYgKGUuZGVsdGFZIDwgMClcbiAgICAgICAgaGFuZGxlU2Nyb2xsKClcbiAgICB9XG4gICAgc2Nyb2xsQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgaGFuZGxlV2hlZWwsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHNjcm9sbENvbnRhaW5lciEucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaGFuZGxlU2Nyb2xsKVxuICAgICAgc2Nyb2xsQ29udGFpbmVyIS5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIGhhbmRsZVdoZWVsKVxuICAgIH1cbiAgfSwgW2hhc01vcmUsIGlzTG9hZGluZywgbG9hZE1vcmVNZXNzYWdlc10pXG5cbiAgY29uc3QgaXNDaGF0TW9kZSA9IGFwcERldGFpbD8ubW9kZSAhPT0gQXBwTW9kZUVudW0uQ09NUExFVElPTlxuICBjb25zdCBpc0FkdmFuY2VkID0gYXBwRGV0YWlsPy5tb2RlID09PSBBcHBNb2RlRW51bS5BRFZBTkNFRF9DSEFUXG5cbiAgY29uc3QgdmFyTGlzdCA9IChkZXRhaWwubW9kZWxfY29uZmlnIGFzIGFueSkudXNlcl9pbnB1dF9mb3JtPy5tYXAoKGl0ZW06IGFueSkgPT4ge1xuICAgIGNvbnN0IGl0ZW1Db250ZW50ID0gaXRlbVtPYmplY3Qua2V5cyhpdGVtKVswXV1cbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGl0ZW1Db250ZW50LnZhcmlhYmxlLFxuICAgICAgdmFsdWU6IHZhclZhbHVlc1tpdGVtQ29udGVudC52YXJpYWJsZV0gfHwgZGV0YWlsLm1lc3NhZ2U/LmlucHV0cz8uW2l0ZW1Db250ZW50LnZhcmlhYmxlXSxcbiAgICB9XG4gIH0pIHx8IFtdXG4gIGNvbnN0IG1lc3NhZ2VfZmlsZXMgPSAoIWlzQ2hhdE1vZGUgJiYgZGV0YWlsLm1lc3NhZ2UubWVzc2FnZV9maWxlcyAmJiBkZXRhaWwubWVzc2FnZS5tZXNzYWdlX2ZpbGVzLmxlbmd0aCA+IDApXG4gICAgPyBkZXRhaWwubWVzc2FnZS5tZXNzYWdlX2ZpbGVzLm1hcCgoaXRlbTogYW55KSA9PiBpdGVtLnVybClcbiAgICA6IFtdXG5cbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKVxuICBjb25zdCByZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG5cbiAgY29uc3QgYWRqdXN0TW9kYWxXaWR0aCA9ICgpID0+IHtcbiAgICBpZiAocmVmLmN1cnJlbnQpXG4gICAgICBzZXRXaWR0aChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gKHJlZi5jdXJyZW50Py5jbGllbnRXaWR0aCArIDE2KSAtIDgpXG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhZGp1c3RNb2RhbFdpZHRoKVxuICAgIHJldHVybiAoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpXG4gIH0sIFtdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiByZWY9e3JlZn0gY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgZmxleC1jb2wgcm91bmRlZC14bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXJcIj5cbiAgICAgIHsvKiBQYW5lbCBIZWFkZXIgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc2hyaW5rLTAgaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQtdC14bCBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHBiLTIgcGwtNCBwci0zIHB0LTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaHJpbmstMFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXNlbWlib2xkLXVwcGVyY2FzZSBtYi0wLjUgdGV4dC10ZXh0LXByaW1hcnlcIj57aXNDaGF0TW9kZSA/IHQoJ2RldGFpbC5jb252ZXJzYXRpb25JZCcsIHsgbnM6ICdhcHBMb2cnIH0pIDogdCgnZGV0YWlsLnRpbWUnLCB7IG5zOiAnYXBwTG9nJyB9KX08L2Rpdj5cbiAgICAgICAgICB7aXNDaGF0TW9kZSAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS0yeHMtcmVndWxhci11cHBlcmNhc2UgZmxleCBpdGVtcy1jZW50ZXIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgIHBvcHVwQ29udGVudD17ZGV0YWlsLmlkfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cnVuY2F0ZVwiPntkZXRhaWwuaWR9PC9kaXY+XG4gICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICAgPENvcHlJY29uIGNvbnRlbnQ9e2RldGFpbC5pZH0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAgeyFpc0NoYXRNb2RlICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLTJ4cy1yZWd1bGFyLXVwcGVyY2FzZSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e2Zvcm1hdFRpbWUoZGV0YWlsLmNyZWF0ZWRfYXQsIHQoJ2RhdGVUaW1lRm9ybWF0JywgeyBuczogJ2FwcExvZycgfSkgYXMgc3RyaW5nKX08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdyb3cgZmxleC13cmFwIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAteS0xXCI+XG4gICAgICAgICAgeyFpc0FkdmFuY2VkICYmIDxNb2RlbEluZm8gbW9kZWw9e2RldGFpbC5tb2RlbF9jb25maWcubW9kZWx9IC8+fVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEFjdGlvbkJ1dHRvbiBzaXplPVwibFwiIG9uQ2xpY2s9e29uQ2xvc2V9PlxuICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgIDwvQWN0aW9uQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICB7LyogUGFuZWwgQm9keSAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hyaW5rLTAgcHgtMSBwdC0xXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC10LXhsIGJnLWJhY2tncm91bmQtc2VjdGlvbi1idXJuIHAtMyBwYi0yXCI+XG4gICAgICAgICAgeyh2YXJMaXN0Lmxlbmd0aCA+IDAgfHwgKCFpc0NoYXRNb2RlICYmIG1lc3NhZ2VfZmlsZXMubGVuZ3RoID4gMCkpICYmIChcbiAgICAgICAgICAgIDxWYXJQYW5lbFxuICAgICAgICAgICAgICB2YXJMaXN0PXt2YXJMaXN0fVxuICAgICAgICAgICAgICBtZXNzYWdlX2ZpbGVzPXttZXNzYWdlX2ZpbGVzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJteC0xIG1iLTEgZ3JvdyBvdmVyZmxvdy1hdXRvIHJvdW5kZWQtYi14bCBiZy1iYWNrZ3JvdW5kLXNlY3Rpb24tYnVyblwiPlxuICAgICAgICB7IWlzQ2hhdE1vZGVcbiAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC02IHB5LTRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1bMThweF0gaXRlbXMtY2VudGVyIHNwYWNlLXgtM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtc2VtaWJvbGQtdXBwZXJjYXNlIHRleHQtdGV4dC10ZXJ0aWFyeVwiPnt0KCd0YWJsZS5oZWFkZXIub3V0cHV0JywgeyBuczogJ2FwcExvZycgfSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtcHggZ3Jvd1wiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgyNzBkZWcsIHJnYmEoMjQzLCAyNDQsIDI0NiwgMCkgMCUsIHJnYigyNDMsIDI0NCwgMjQ2KSAxMDAlKScsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8VGV4dEdlbmVyYXRpb25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm10LTJcIlxuICAgICAgICAgICAgICAgICAgY29udGVudD17ZGV0YWlsLm1lc3NhZ2UuYW5zd2VyfVxuICAgICAgICAgICAgICAgICAgbWVzc2FnZUlkPXtkZXRhaWwubWVzc2FnZS5pZH1cbiAgICAgICAgICAgICAgICAgIGlzRXJyb3I9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgb25SZXRyeT17bm9vcH1cbiAgICAgICAgICAgICAgICAgIGlzSW5zdGFsbGVkQXBwPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgIHN1cHBvcnRGZWVkYmFja1xuICAgICAgICAgICAgICAgICAgZmVlZGJhY2s9e2RldGFpbC5tZXNzYWdlLmZlZWRiYWNrcy5maW5kKChpdGVtOiBhbnkpID0+IGl0ZW0uZnJvbV9zb3VyY2UgPT09ICdhZG1pbicpfVxuICAgICAgICAgICAgICAgICAgb25GZWVkYmFjaz17ZmVlZGJhY2sgPT4gb25GZWVkYmFjayhkZXRhaWwubWVzc2FnZS5pZCwgZmVlZGJhY2spfVxuICAgICAgICAgICAgICAgICAgaXNTaG93VGV4dFRvU3BlZWNoXG4gICAgICAgICAgICAgICAgICBzaXRlSW5mbz17bnVsbH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IHRocmVhZENoYXRJdGVtcy5sZW5ndGggPCBNSU5fSVRFTVNfRk9SX1NDUk9MTF9MT0FESU5HID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00IHB0LTRcIj5cbiAgICAgICAgICAgICAgPENoYXRcbiAgICAgICAgICAgICAgICBjb25maWc9e3tcbiAgICAgICAgICAgICAgICAgIGFwcElkOiBhcHBEZXRhaWw/LmlkLFxuICAgICAgICAgICAgICAgICAgdGV4dF90b19zcGVlY2g6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBxdWVzdGlvbkVkaXRFbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgc3VwcG9ydEFubm90YXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uX3JlcGx5OiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgc3VwcG9ydEZlZWRiYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0gYXMgYW55fVxuICAgICAgICAgICAgICAgIGNoYXRMaXN0PXt0aHJlYWRDaGF0SXRlbXN9XG4gICAgICAgICAgICAgICAgb25Bbm5vdGF0aW9uQWRkZWQ9e2hhbmRsZUFubm90YXRpb25BZGRlZH1cbiAgICAgICAgICAgICAgICBvbkFubm90YXRpb25FZGl0ZWQ9e2hhbmRsZUFubm90YXRpb25FZGl0ZWR9XG4gICAgICAgICAgICAgICAgb25Bbm5vdGF0aW9uUmVtb3ZlZD17aGFuZGxlQW5ub3RhdGlvblJlbW92ZWR9XG4gICAgICAgICAgICAgICAgb25GZWVkYmFjaz17b25GZWVkYmFja31cbiAgICAgICAgICAgICAgICBub0NoYXRJbnB1dFxuICAgICAgICAgICAgICAgIHNob3dQcm9tcHRMb2dcbiAgICAgICAgICAgICAgICBoaWRlUHJvY2Vzc0RldGFpbFxuICAgICAgICAgICAgICAgIGNoYXRDb250YWluZXJJbm5lckNsYXNzTmFtZT1cInB4LTNcIlxuICAgICAgICAgICAgICAgIHN3aXRjaFNpYmxpbmc9e3N3aXRjaFNpYmxpbmd9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweS00XCJcbiAgICAgICAgICAgICAgaWQ9XCJzY3JvbGxhYmxlRGl2XCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbi1yZXZlcnNlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2F1dG8nLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7LyogUHV0IHRoZSBzY3JvbGwgYmFyIGFsd2F5cyBvbiB0aGUgYm90dG9tICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy1mdWxsIGZsZXgtY29sLXJldmVyc2VcIiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgICAgICAgICAgICB7LyogTG9hZGluZyBzdGF0ZSBpbmRpY2F0b3IgLSBvbmx5IHNob3duIHdoZW4gbG9hZGluZyAqL31cbiAgICAgICAgICAgICAgICB7aGFzTW9yZSAmJiBpc0xvYWRpbmcgJiYgKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGlja3kgbGVmdC0wIHJpZ2h0LTAgdG9wLTAgei0xMCBiZy1wcmltYXJ5LTUwLzQwIHB5LTMgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnZGV0YWlsLmxvYWRpbmcnLCB7IG5zOiAnYXBwTG9nJyB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgPENoYXRcbiAgICAgICAgICAgICAgICAgIGNvbmZpZz17e1xuICAgICAgICAgICAgICAgICAgICBhcHBJZDogYXBwRGV0YWlsPy5pZCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dF90b19zcGVlY2g6IHtcbiAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbkVkaXRFbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBzdXBwb3J0QW5ub3RhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYW5ub3RhdGlvbl9yZXBseToge1xuICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1cHBvcnRGZWVkYmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIH0gYXMgYW55fVxuICAgICAgICAgICAgICAgICAgY2hhdExpc3Q9e3RocmVhZENoYXRJdGVtc31cbiAgICAgICAgICAgICAgICAgIG9uQW5ub3RhdGlvbkFkZGVkPXtoYW5kbGVBbm5vdGF0aW9uQWRkZWR9XG4gICAgICAgICAgICAgICAgICBvbkFubm90YXRpb25FZGl0ZWQ9e2hhbmRsZUFubm90YXRpb25FZGl0ZWR9XG4gICAgICAgICAgICAgICAgICBvbkFubm90YXRpb25SZW1vdmVkPXtoYW5kbGVBbm5vdGF0aW9uUmVtb3ZlZH1cbiAgICAgICAgICAgICAgICAgIG9uRmVlZGJhY2s9e29uRmVlZGJhY2t9XG4gICAgICAgICAgICAgICAgICBub0NoYXRJbnB1dFxuICAgICAgICAgICAgICAgICAgc2hvd1Byb21wdExvZ1xuICAgICAgICAgICAgICAgICAgaGlkZVByb2Nlc3NEZXRhaWxcbiAgICAgICAgICAgICAgICAgIGNoYXRDb250YWluZXJJbm5lckNsYXNzTmFtZT1cInB4LTNcIlxuICAgICAgICAgICAgICAgICAgc3dpdGNoU2libGluZz17c3dpdGNoU2libGluZ31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIHtzaG93TWVzc2FnZUxvZ01vZGFsICYmIChcbiAgICAgICAgPFdvcmtmbG93Q29udGV4dFByb3ZpZGVyPlxuICAgICAgICAgIDxNZXNzYWdlTG9nTW9kYWxcbiAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgIGN1cnJlbnRMb2dJdGVtPXtjdXJyZW50TG9nSXRlbX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldEN1cnJlbnRMb2dJdGVtKClcbiAgICAgICAgICAgICAgc2V0U2hvd01lc3NhZ2VMb2dNb2RhbChmYWxzZSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkZWZhdWx0VGFiPXtjdXJyZW50TG9nTW9kYWxBY3RpdmVUYWJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Xb3JrZmxvd0NvbnRleHRQcm92aWRlcj5cbiAgICAgICl9XG4gICAgICB7IWlzQ2hhdE1vZGUgJiYgc2hvd1Byb21wdExvZ01vZGFsICYmIChcbiAgICAgICAgPFByb21wdExvZ01vZGFsXG4gICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgIGN1cnJlbnRMb2dJdGVtPXtjdXJyZW50TG9nSXRlbX1cbiAgICAgICAgICBvbkNhbmNlbD17KCkgPT4ge1xuICAgICAgICAgICAgc2V0Q3VycmVudExvZ0l0ZW0oKVxuICAgICAgICAgICAgc2V0U2hvd1Byb21wdExvZ01vZGFsKGZhbHNlKVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbi8qKlxuICogVGV4dCBBcHAgQ29udmVyc2F0aW9uIERldGFpbCBDb21wb25lbnRcbiAqL1xuY29uc3QgQ29tcGxldGlvbkNvbnZlcnNhdGlvbkRldGFpbENvbXA6IEZDPHsgYXBwSWQ/OiBzdHJpbmcsIGNvbnZlcnNhdGlvbklkPzogc3RyaW5nIH0+ID0gKHsgYXBwSWQsIGNvbnZlcnNhdGlvbklkIH0pID0+IHtcbiAgLy8gVGV4dCBHZW5lcmF0b3IgQXBwIFNlc3Npb24gRGV0YWlscyBJbmNsdWRpbmcgTWVzc2FnZSBMaXN0XG4gIGNvbnN0IHsgZGF0YTogY29udmVyc2F0aW9uRGV0YWlsLCByZWZldGNoOiBjb252ZXJzYXRpb25EZXRhaWxNdXRhdGUgfSA9IHVzZUNvbXBsZXRpb25Db252ZXJzYXRpb25EZXRhaWwoYXBwSWQsIGNvbnZlcnNhdGlvbklkKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlQ29udGV4dChUb2FzdENvbnRleHQpXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IGhhbmRsZUZlZWRiYWNrID0gYXN5bmMgKG1pZDogc3RyaW5nLCB7IHJhdGluZywgY29udGVudCB9OiBGZWVkYmFja1R5cGUpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlTG9nTWVzc2FnZUZlZWRiYWNrcyh7XG4gICAgICAgIHVybDogYC9hcHBzLyR7YXBwSWR9L2ZlZWRiYWNrc2AsXG4gICAgICAgIGJvZHk6IHsgbWVzc2FnZV9pZDogbWlkLCByYXRpbmcsIGNvbnRlbnQ6IGNvbnRlbnQgPz8gdW5kZWZpbmVkIH0sXG4gICAgICB9KVxuICAgICAgY29udmVyc2F0aW9uRGV0YWlsTXV0YXRlKClcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2FjdGlvbk1zZy5tb2RpZmllZFVuc3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhbmRsZUFubm90YXRpb24gPSBhc3luYyAobWlkOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlTG9nTWVzc2FnZUFubm90YXRpb25zKHsgdXJsOiBgL2FwcHMvJHthcHBJZH0vYW5ub3RhdGlvbnNgLCBib2R5OiB7IG1lc3NhZ2VfaWQ6IG1pZCwgY29udGVudDogdmFsdWUgfSB9KVxuICAgICAgY29udmVyc2F0aW9uRGV0YWlsTXV0YXRlKClcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2FjdGlvbk1zZy5tb2RpZmllZFVuc3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlmICghY29udmVyc2F0aW9uRGV0YWlsKVxuICAgIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8RGV0YWlsUGFuZWxcbiAgICAgIGRldGFpbD17Y29udmVyc2F0aW9uRGV0YWlsfVxuICAgICAgb25GZWVkYmFjaz17aGFuZGxlRmVlZGJhY2t9XG4gICAgICBvblN1Ym1pdEFubm90YXRpb249e2hhbmRsZUFubm90YXRpb259XG4gICAgLz5cbiAgKVxufVxuXG4vKipcbiAqIENoYXQgQXBwIENvbnZlcnNhdGlvbiBEZXRhaWwgQ29tcG9uZW50XG4gKi9cbmNvbnN0IENoYXRDb252ZXJzYXRpb25EZXRhaWxDb21wOiBGQzx7IGFwcElkPzogc3RyaW5nLCBjb252ZXJzYXRpb25JZD86IHN0cmluZyB9PiA9ICh7IGFwcElkLCBjb252ZXJzYXRpb25JZCB9KSA9PiB7XG4gIGNvbnN0IHsgZGF0YTogY29udmVyc2F0aW9uRGV0YWlsIH0gPSB1c2VDaGF0Q29udmVyc2F0aW9uRGV0YWlsKGFwcElkLCBjb252ZXJzYXRpb25JZClcbiAgY29uc3QgeyBub3RpZnkgfSA9IHVzZUNvbnRleHQoVG9hc3RDb250ZXh0KVxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICBjb25zdCBoYW5kbGVGZWVkYmFjayA9IGFzeW5jIChtaWQ6IHN0cmluZywgeyByYXRpbmcsIGNvbnRlbnQgfTogRmVlZGJhY2tUeXBlKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHVwZGF0ZUxvZ01lc3NhZ2VGZWVkYmFja3Moe1xuICAgICAgICB1cmw6IGAvYXBwcy8ke2FwcElkfS9mZWVkYmFja3NgLFxuICAgICAgICBib2R5OiB7IG1lc3NhZ2VfaWQ6IG1pZCwgcmF0aW5nLCBjb250ZW50OiBjb250ZW50ID8/IHVuZGVmaW5lZCB9LFxuICAgICAgfSlcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2FjdGlvbk1zZy5tb2RpZmllZFVuc3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhbmRsZUFubm90YXRpb24gPSBhc3luYyAobWlkOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlTG9nTWVzc2FnZUFubm90YXRpb25zKHsgdXJsOiBgL2FwcHMvJHthcHBJZH0vYW5ub3RhdGlvbnNgLCBib2R5OiB7IG1lc3NhZ2VfaWQ6IG1pZCwgY29udGVudDogdmFsdWUgfSB9KVxuICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkVW5zdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb252ZXJzYXRpb25EZXRhaWwpXG4gICAgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxEZXRhaWxQYW5lbFxuICAgICAgZGV0YWlsPXtjb252ZXJzYXRpb25EZXRhaWx9XG4gICAgICBvbkZlZWRiYWNrPXtoYW5kbGVGZWVkYmFja31cbiAgICAgIG9uU3VibWl0QW5ub3RhdGlvbj17aGFuZGxlQW5ub3RhdGlvbn1cbiAgICAvPlxuICApXG59XG5cbi8qKlxuICogQ29udmVyc2F0aW9uIGxpc3QgY29tcG9uZW50IGluY2x1ZGluZyBiYXNpYyBpbmZvcm1hdGlvblxuICovXG5jb25zdCBDb252ZXJzYXRpb25MaXN0OiBGQzxJQ29udmVyc2F0aW9uTGlzdD4gPSAoeyBsb2dzLCBhcHBEZXRhaWwsIG9uUmVmcmVzaCB9KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IGZvcm1hdFRpbWUgfSA9IHVzZVRpbWVzdGFtcCgpXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXG4gIGNvbnN0IHBhdGhuYW1lID0gdXNlUGF0aG5hbWUoKVxuICBjb25zdCBzZWFyY2hQYXJhbXMgPSB1c2VTZWFyY2hQYXJhbXMoKVxuICBjb25zdCBjb252ZXJzYXRpb25JZEluVXJsID0gc2VhcmNoUGFyYW1zLmdldCgnY29udmVyc2F0aW9uX2lkJykgPz8gdW5kZWZpbmVkXG5cbiAgY29uc3QgbWVkaWEgPSB1c2VCcmVha3BvaW50cygpXG4gIGNvbnN0IGlzTW9iaWxlID0gbWVkaWEgPT09IE1lZGlhVHlwZS5tb2JpbGVcblxuICBjb25zdCBbc2hvd0RyYXdlciwgc2V0U2hvd0RyYXdlcl0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSkgLy8gV2hldGhlciB0byBkaXNwbGF5IHRoZSBjaGF0IGRldGFpbHMgZHJhd2VyXG4gIGNvbnN0IFtjdXJyZW50Q29udmVyc2F0aW9uLCBzZXRDdXJyZW50Q29udmVyc2F0aW9uXSA9IHVzZVN0YXRlPENvbnZlcnNhdGlvblNlbGVjdGlvbiB8IHVuZGVmaW5lZD4oKSAvLyBDdXJyZW50bHkgc2VsZWN0ZWQgY29udmVyc2F0aW9uXG4gIGNvbnN0IGNsb3NpbmdDb252ZXJzYXRpb25JZFJlZiA9IHVzZVJlZjxzdHJpbmcgfCBudWxsPihudWxsKVxuICBjb25zdCBwZW5kaW5nQ29udmVyc2F0aW9uSWRSZWYgPSB1c2VSZWY8c3RyaW5nIHwgbnVsbD4obnVsbClcbiAgY29uc3QgcGVuZGluZ0NvbnZlcnNhdGlvbkNhY2hlUmVmID0gdXNlUmVmPENvbnZlcnNhdGlvblNlbGVjdGlvbiB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKVxuICBjb25zdCBpc0NoYXRNb2RlID0gYXBwRGV0YWlsLm1vZGUgIT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04gLy8gV2hldGhlciB0aGUgYXBwIGlzIGEgY2hhdCBhcHBcbiAgY29uc3QgaXNDaGF0ZmxvdyA9IGFwcERldGFpbC5tb2RlID09PSBBcHBNb2RlRW51bS5BRFZBTkNFRF9DSEFUIC8vIFdoZXRoZXIgdGhlIGFwcCBpcyBhIGNoYXRmbG93IGFwcFxuICBjb25zdCB7IHNldFNob3dQcm9tcHRMb2dNb2RhbCwgc2V0U2hvd0FnZW50TG9nTW9kYWwsIHNldFNob3dNZXNzYWdlTG9nTW9kYWwgfSA9IHVzZUFwcFN0b3JlKHVzZVNoYWxsb3coKHN0YXRlOiBBcHBTdG9yZVN0YXRlKSA9PiAoe1xuICAgIHNldFNob3dQcm9tcHRMb2dNb2RhbDogc3RhdGUuc2V0U2hvd1Byb21wdExvZ01vZGFsLFxuICAgIHNldFNob3dBZ2VudExvZ01vZGFsOiBzdGF0ZS5zZXRTaG93QWdlbnRMb2dNb2RhbCxcbiAgICBzZXRTaG93TWVzc2FnZUxvZ01vZGFsOiBzdGF0ZS5zZXRTaG93TWVzc2FnZUxvZ01vZGFsLFxuICB9KSkpXG5cbiAgY29uc3QgYWN0aXZlQ29udmVyc2F0aW9uSWQgPSBjb252ZXJzYXRpb25JZEluVXJsID8/IHBlbmRpbmdDb252ZXJzYXRpb25JZFJlZi5jdXJyZW50ID8/IGN1cnJlbnRDb252ZXJzYXRpb24/LmlkXG5cbiAgY29uc3QgYnVpbGRVcmxXaXRoQ29udmVyc2F0aW9uID0gdXNlQ2FsbGJhY2soKGNvbnZlcnNhdGlvbklkPzogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhzZWFyY2hQYXJhbXMudG9TdHJpbmcoKSlcbiAgICBpZiAoY29udmVyc2F0aW9uSWQpXG4gICAgICBwYXJhbXMuc2V0KCdjb252ZXJzYXRpb25faWQnLCBjb252ZXJzYXRpb25JZClcbiAgICBlbHNlXG4gICAgICBwYXJhbXMuZGVsZXRlKCdjb252ZXJzYXRpb25faWQnKVxuXG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBwYXJhbXMudG9TdHJpbmcoKVxuICAgIHJldHVybiBxdWVyeVN0cmluZyA/IGAke3BhdGhuYW1lfT8ke3F1ZXJ5U3RyaW5nfWAgOiBwYXRobmFtZVxuICB9LCBbcGF0aG5hbWUsIHNlYXJjaFBhcmFtc10pXG5cbiAgY29uc3QgaGFuZGxlUm93Q2xpY2sgPSB1c2VDYWxsYmFjaygobG9nOiBDb252ZXJzYXRpb25MaXN0SXRlbSkgPT4ge1xuICAgIGlmIChjb252ZXJzYXRpb25JZEluVXJsID09PSBsb2cuaWQpIHtcbiAgICAgIGlmICghc2hvd0RyYXdlcilcbiAgICAgICAgc2V0U2hvd0RyYXdlcih0cnVlKVxuXG4gICAgICBpZiAoIWN1cnJlbnRDb252ZXJzYXRpb24gfHwgY3VycmVudENvbnZlcnNhdGlvbi5pZCAhPT0gbG9nLmlkKVxuICAgICAgICBzZXRDdXJyZW50Q29udmVyc2F0aW9uKGxvZylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHBlbmRpbmdDb252ZXJzYXRpb25JZFJlZi5jdXJyZW50ID0gbG9nLmlkXG4gICAgcGVuZGluZ0NvbnZlcnNhdGlvbkNhY2hlUmVmLmN1cnJlbnQgPSBsb2dcbiAgICBpZiAoIXNob3dEcmF3ZXIpXG4gICAgICBzZXRTaG93RHJhd2VyKHRydWUpXG5cbiAgICBpZiAoY3VycmVudENvbnZlcnNhdGlvbj8uaWQgIT09IGxvZy5pZClcbiAgICAgIHNldEN1cnJlbnRDb252ZXJzYXRpb24odW5kZWZpbmVkKVxuXG4gICAgcm91dGVyLnB1c2goYnVpbGRVcmxXaXRoQ29udmVyc2F0aW9uKGxvZy5pZCksIHsgc2Nyb2xsOiBmYWxzZSB9KVxuICB9LCBbYnVpbGRVcmxXaXRoQ29udmVyc2F0aW9uLCBjb252ZXJzYXRpb25JZEluVXJsLCBjdXJyZW50Q29udmVyc2F0aW9uLCByb3V0ZXIsIHNob3dEcmF3ZXJdKVxuXG4gIGNvbnN0IGN1cnJlbnRDb252ZXJzYXRpb25JZCA9IGN1cnJlbnRDb252ZXJzYXRpb24/LmlkXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWNvbnZlcnNhdGlvbklkSW5VcmwpIHtcbiAgICAgIGlmIChwZW5kaW5nQ29udmVyc2F0aW9uSWRSZWYuY3VycmVudClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIChzaG93RHJhd2VyIHx8IGN1cnJlbnRDb252ZXJzYXRpb25JZCkge1xuICAgICAgICBzZXRTaG93RHJhd2VyKGZhbHNlKVxuICAgICAgICBzZXRDdXJyZW50Q29udmVyc2F0aW9uKHVuZGVmaW5lZClcbiAgICAgIH1cbiAgICAgIGNsb3NpbmdDb252ZXJzYXRpb25JZFJlZi5jdXJyZW50ID0gbnVsbFxuICAgICAgcGVuZGluZ0NvbnZlcnNhdGlvbkNhY2hlUmVmLmN1cnJlbnQgPSB1bmRlZmluZWRcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChjbG9zaW5nQ29udmVyc2F0aW9uSWRSZWYuY3VycmVudCA9PT0gY29udmVyc2F0aW9uSWRJblVybClcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKHBlbmRpbmdDb252ZXJzYXRpb25JZFJlZi5jdXJyZW50ID09PSBjb252ZXJzYXRpb25JZEluVXJsKVxuICAgICAgcGVuZGluZ0NvbnZlcnNhdGlvbklkUmVmLmN1cnJlbnQgPSBudWxsXG5cbiAgICBjb25zdCBtYXRjaGVkQ29udmVyc2F0aW9uID0gbG9ncz8uZGF0YT8uZmluZCgoaXRlbTogQ29udmVyc2F0aW9uTGlzdEl0ZW0pID0+IGl0ZW0uaWQgPT09IGNvbnZlcnNhdGlvbklkSW5VcmwpXG4gICAgY29uc3QgbmV4dENvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uU2VsZWN0aW9uID0gbWF0Y2hlZENvbnZlcnNhdGlvblxuICAgICAgPz8gcGVuZGluZ0NvbnZlcnNhdGlvbkNhY2hlUmVmLmN1cnJlbnRcbiAgICAgID8/IHsgaWQ6IGNvbnZlcnNhdGlvbklkSW5VcmwsIGlzUGxhY2Vob2xkZXI6IHRydWUgfVxuXG4gICAgaWYgKCFzaG93RHJhd2VyKVxuICAgICAgc2V0U2hvd0RyYXdlcih0cnVlKVxuXG4gICAgaWYgKCFjdXJyZW50Q29udmVyc2F0aW9uIHx8IGN1cnJlbnRDb252ZXJzYXRpb24uaWQgIT09IGNvbnZlcnNhdGlvbklkSW5VcmwgfHwgKCEoJ2NyZWF0ZWRfYXQnIGluIGN1cnJlbnRDb252ZXJzYXRpb24pICYmIG1hdGNoZWRDb252ZXJzYXRpb24pKVxuICAgICAgc2V0Q3VycmVudENvbnZlcnNhdGlvbihuZXh0Q29udmVyc2F0aW9uKVxuXG4gICAgaWYgKHBlbmRpbmdDb252ZXJzYXRpb25DYWNoZVJlZi5jdXJyZW50Py5pZCA9PT0gY29udmVyc2F0aW9uSWRJblVybCB8fCBtYXRjaGVkQ29udmVyc2F0aW9uKVxuICAgICAgcGVuZGluZ0NvbnZlcnNhdGlvbkNhY2hlUmVmLmN1cnJlbnQgPSB1bmRlZmluZWRcbiAgfSwgW2NvbnZlcnNhdGlvbklkSW5VcmwsIGN1cnJlbnRDb252ZXJzYXRpb24sIGlzQ2hhdE1vZGUsIGxvZ3M/LmRhdGEsIHNob3dEcmF3ZXJdKVxuXG4gIGNvbnN0IG9uQ2xvc2VEcmF3ZXIgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgb25SZWZyZXNoKClcbiAgICBzZXRTaG93RHJhd2VyKGZhbHNlKVxuICAgIHNldEN1cnJlbnRDb252ZXJzYXRpb24odW5kZWZpbmVkKVxuICAgIHNldFNob3dQcm9tcHRMb2dNb2RhbChmYWxzZSlcbiAgICBzZXRTaG93QWdlbnRMb2dNb2RhbChmYWxzZSlcbiAgICBzZXRTaG93TWVzc2FnZUxvZ01vZGFsKGZhbHNlKVxuICAgIHBlbmRpbmdDb252ZXJzYXRpb25JZFJlZi5jdXJyZW50ID0gbnVsbFxuICAgIHBlbmRpbmdDb252ZXJzYXRpb25DYWNoZVJlZi5jdXJyZW50ID0gdW5kZWZpbmVkXG4gICAgY2xvc2luZ0NvbnZlcnNhdGlvbklkUmVmLmN1cnJlbnQgPSBjb252ZXJzYXRpb25JZEluVXJsID8/IG51bGxcblxuICAgIGlmIChjb252ZXJzYXRpb25JZEluVXJsKVxuICAgICAgcm91dGVyLnJlcGxhY2UoYnVpbGRVcmxXaXRoQ29udmVyc2F0aW9uKCksIHsgc2Nyb2xsOiBmYWxzZSB9KVxuICB9LCBbYnVpbGRVcmxXaXRoQ29udmVyc2F0aW9uLCBjb252ZXJzYXRpb25JZEluVXJsLCBvblJlZnJlc2gsIHJvdXRlciwgc2V0U2hvd0FnZW50TG9nTW9kYWwsIHNldFNob3dNZXNzYWdlTG9nTW9kYWwsIHNldFNob3dQcm9tcHRMb2dNb2RhbF0pXG5cbiAgLy8gQW5ub3RhdGVkIGRhdGEgbmVlZHMgdG8gYmUgaGlnaGxpZ2h0ZWRcbiAgY29uc3QgcmVuZGVyVGRWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCwgaXNFbXB0eVN0eWxlOiBib29sZWFuLCBpc0hpZ2hsaWdodCA9IGZhbHNlLCBhbm5vdGF0aW9uPzogTG9nQW5ub3RhdGlvbikgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9vbHRpcFxuICAgICAgICBwb3B1cENvbnRlbnQ9eyhcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgdGV4dC14cyB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgIDxSaUVkaXRGaWxsIGNsYXNzTmFtZT1cIm1yLTEgaC0zIHctM1wiIC8+XG4gICAgICAgICAgICB7YCR7dCgnZGV0YWlsLmFubm90YXRpb25UaXAnLCB7IG5zOiAnYXBwTG9nJywgdXNlcjogYW5ub3RhdGlvbj8uYWNjb3VudD8ubmFtZSB9KX0gJHtmb3JtYXRUaW1lKGFubm90YXRpb24/LmNyZWF0ZWRfYXQgfHwgZGF5anMoKS51bml4KCksICdNTS1ERCBoaDptbSBBJyl9YH1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIHBvcHVwQ2xhc3NOYW1lPXsoaXNIaWdobGlnaHQgJiYgIWlzQ2hhdE1vZGUpID8gJycgOiAnIWhpZGRlbid9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbihpc0VtcHR5U3R5bGUgPyAndGV4dC10ZXh0LXF1YXRlcm5hcnknIDogJ3RleHQtdGV4dC1zZWNvbmRhcnknLCAhaXNIaWdobGlnaHQgPyAnJyA6ICdiZy1vcmFuZ2UtMTAwJywgJ3N5c3RlbS1zbS1yZWd1bGFyIG92ZXJmbG93LWhpZGRlbiB0ZXh0LWVsbGlwc2lzIHdoaXRlc3BhY2Utbm93cmFwJyl9PlxuICAgICAgICAgIHt2YWx1ZSB8fCAnLSd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Ub29sdGlwPlxuICAgIClcbiAgfVxuXG4gIGlmICghbG9ncylcbiAgICByZXR1cm4gPExvYWRpbmcgLz5cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbXQtMiBncm93IG92ZXJmbG93LXgtYXV0b1wiPlxuICAgICAgPHRhYmxlIGNsYXNzTmFtZT17Y24oJ3ctZnVsbCBtaW4tdy1bNDQwcHhdIGJvcmRlci1jb2xsYXBzZSBib3JkZXItMCcpfT5cbiAgICAgICAgPHRoZWFkIGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0tdXBwZXJjYXNlIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ3LTUgd2hpdGVzcGFjZS1ub3dyYXAgcm91bmRlZC1sLWxnIGJnLWJhY2tncm91bmQtc2VjdGlvbi1idXJuIHBsLTIgcHItMVwiPjwvdGQ+XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwid2hpdGVzcGFjZS1ub3dyYXAgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcHktMS41IHBsLTNcIj57aXNDaGF0TW9kZSA/IHQoJ3RhYmxlLmhlYWRlci5zdW1tYXJ5JywgeyBuczogJ2FwcExvZycgfSkgOiB0KCd0YWJsZS5oZWFkZXIuaW5wdXQnLCB7IG5zOiAnYXBwTG9nJyB9KX08L3RkPlxuICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIndoaXRlc3BhY2Utbm93cmFwIGJnLWJhY2tncm91bmQtc2VjdGlvbi1idXJuIHB5LTEuNSBwbC0zXCI+e3QoJ3RhYmxlLmhlYWRlci5lbmRVc2VyJywgeyBuczogJ2FwcExvZycgfSl9PC90ZD5cbiAgICAgICAgICAgIHtpc0NoYXRmbG93ICYmIDx0ZCBjbGFzc05hbWU9XCJ3aGl0ZXNwYWNlLW5vd3JhcCBiZy1iYWNrZ3JvdW5kLXNlY3Rpb24tYnVybiBweS0xLjUgcGwtM1wiPnt0KCd0YWJsZS5oZWFkZXIuc3RhdHVzJywgeyBuczogJ2FwcExvZycgfSl9PC90ZD59XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwid2hpdGVzcGFjZS1ub3dyYXAgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcHktMS41IHBsLTNcIj57aXNDaGF0TW9kZSA/IHQoJ3RhYmxlLmhlYWRlci5tZXNzYWdlQ291bnQnLCB7IG5zOiAnYXBwTG9nJyB9KSA6IHQoJ3RhYmxlLmhlYWRlci5vdXRwdXQnLCB7IG5zOiAnYXBwTG9nJyB9KX08L3RkPlxuICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIndoaXRlc3BhY2Utbm93cmFwIGJnLWJhY2tncm91bmQtc2VjdGlvbi1idXJuIHB5LTEuNSBwbC0zXCI+e3QoJ3RhYmxlLmhlYWRlci51c2VyUmF0ZScsIHsgbnM6ICdhcHBMb2cnIH0pfTwvdGQ+XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwid2hpdGVzcGFjZS1ub3dyYXAgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcHktMS41IHBsLTNcIj57dCgndGFibGUuaGVhZGVyLmFkbWluUmF0ZScsIHsgbnM6ICdhcHBMb2cnIH0pfTwvdGQ+XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwid2hpdGVzcGFjZS1ub3dyYXAgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcHktMS41IHBsLTNcIj57dCgndGFibGUuaGVhZGVyLnVwZGF0ZWRUaW1lJywgeyBuczogJ2FwcExvZycgfSl9PC90ZD5cbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ3aGl0ZXNwYWNlLW5vd3JhcCByb3VuZGVkLXItbGcgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcHktMS41IHBsLTNcIj57dCgndGFibGUuaGVhZGVyLnRpbWUnLCB7IG5zOiAnYXBwTG9nJyB9KX08L3RkPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keSBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAge2xvZ3MuZGF0YS5tYXAoKGxvZzogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbmRVc2VyID0gbG9nLmZyb21fZW5kX3VzZXJfc2Vzc2lvbl9pZCB8fCBsb2cuZnJvbV9hY2NvdW50X25hbWVcbiAgICAgICAgICAgIGNvbnN0IGxlZnRWYWx1ZSA9IGdldChsb2csIGlzQ2hhdE1vZGUgPyAnbmFtZScgOiAnbWVzc2FnZS5pbnB1dHMucXVlcnknKSB8fCAoIWlzQ2hhdE1vZGUgPyAoZ2V0KGxvZywgJ21lc3NhZ2UucXVlcnknKSB8fCBnZXQobG9nLCAnbWVzc2FnZS5pbnB1dHMuZGVmYXVsdF9pbnB1dCcpKSA6ICcnKSB8fCAnJ1xuICAgICAgICAgICAgY29uc3QgcmlnaHRWYWx1ZSA9IGdldChsb2csIGlzQ2hhdE1vZGUgPyAnbWVzc2FnZV9jb3VudCcgOiAnbWVzc2FnZS5hbnN3ZXInKVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHRyXG4gICAgICAgICAgICAgICAga2V5PXtsb2cuaWR9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbignY3Vyc29yLXBvaW50ZXIgYm9yZGVyLWIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGhvdmVyOmJnLWJhY2tncm91bmQtZGVmYXVsdC1ob3ZlcicsIGFjdGl2ZUNvbnZlcnNhdGlvbklkICE9PSBsb2cuaWQgPyAnJyA6ICdiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtaG92ZXInKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVSb3dDbGljayhsb2cpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImgtNFwiPlxuICAgICAgICAgICAgICAgICAgeyFsb2cucmVhZF9hdCAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgcC0zIHByLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1ibG9jayBoLTEuNSB3LTEuNSByb3VuZGVkIGJnLXV0aWwtY29sb3JzLWJsdWUtYmx1ZS01MDBcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ3LVsxNjBweF0gcC0zIHByLTJcIiBzdHlsZT17eyBtYXhXaWR0aDogaXNDaGF0TW9kZSA/IDMwMCA6IDIwMCB9fT5cbiAgICAgICAgICAgICAgICAgIHtyZW5kZXJUZFZhbHVlKGxlZnRWYWx1ZSB8fCB0KCd0YWJsZS5lbXB0eS5ub0NoYXQnLCB7IG5zOiAnYXBwTG9nJyB9KSwgIWxlZnRWYWx1ZSwgaXNDaGF0TW9kZSAmJiBsb2cuYW5ub3RhdGVkKX1cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgcHItMlwiPntyZW5kZXJUZFZhbHVlKGVuZFVzZXIgfHwgZGVmYXVsdFZhbHVlLCAhZW5kVXNlcil9PC90ZD5cbiAgICAgICAgICAgICAgICB7aXNDaGF0ZmxvdyAmJiAoXG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidy1bMTYwcHhdIHAtMyBwci0yXCIgc3R5bGU9e3sgbWF4V2lkdGg6IGlzQ2hhdE1vZGUgPyAzMDAgOiAyMDAgfX0+XG4gICAgICAgICAgICAgICAgICAgIHtzdGF0dXNUZFJlbmRlcihsb2cuc3RhdHVzX2NvdW50KX1cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0zIHByLTJcIiBzdHlsZT17eyBtYXhXaWR0aDogaXNDaGF0TW9kZSA/IDEwMCA6IDIwMCB9fT5cbiAgICAgICAgICAgICAgICAgIHtyZW5kZXJUZFZhbHVlKHJpZ2h0VmFsdWUgPT09IDAgPyAwIDogKHJpZ2h0VmFsdWUgfHwgdCgndGFibGUuZW1wdHkubm9PdXRwdXQnLCB7IG5zOiAnYXBwTG9nJyB9KSksICFyaWdodFZhbHVlLCAhaXNDaGF0TW9kZSAmJiAhIWxvZy5hbm5vdGF0aW9uPy5jb250ZW50LCBsb2cuYW5ub3RhdGlvbil9XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0zIHByLTJcIj5cbiAgICAgICAgICAgICAgICAgIHsoIWxvZy51c2VyX2ZlZWRiYWNrX3N0YXRzLmxpa2UgJiYgIWxvZy51c2VyX2ZlZWRiYWNrX3N0YXRzLmRpc2xpa2UpXG4gICAgICAgICAgICAgICAgICAgID8gcmVuZGVyVGRWYWx1ZShkZWZhdWx0VmFsdWUsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyEhbG9nLnVzZXJfZmVlZGJhY2tfc3RhdHMubGlrZSAmJiA8SGFuZFRodW1iSWNvbldpdGhDb3VudCBpY29uVHlwZT1cInVwXCIgY291bnQ9e2xvZy51c2VyX2ZlZWRiYWNrX3N0YXRzLmxpa2V9IC8+fVxuICAgICAgICAgICAgICAgICAgICAgICAgICB7ISFsb2cudXNlcl9mZWVkYmFja19zdGF0cy5kaXNsaWtlICYmIDxIYW5kVGh1bWJJY29uV2l0aENvdW50IGljb25UeXBlPVwiZG93blwiIGNvdW50PXtsb2cudXNlcl9mZWVkYmFja19zdGF0cy5kaXNsaWtlfSAvPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0zIHByLTJcIj5cbiAgICAgICAgICAgICAgICAgIHsoIWxvZy5hZG1pbl9mZWVkYmFja19zdGF0cy5saWtlICYmICFsb2cuYWRtaW5fZmVlZGJhY2tfc3RhdHMuZGlzbGlrZSlcbiAgICAgICAgICAgICAgICAgICAgPyByZW5kZXJUZFZhbHVlKGRlZmF1bHRWYWx1ZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7ISFsb2cuYWRtaW5fZmVlZGJhY2tfc3RhdHMubGlrZSAmJiA8SGFuZFRodW1iSWNvbldpdGhDb3VudCBpY29uVHlwZT1cInVwXCIgY291bnQ9e2xvZy5hZG1pbl9mZWVkYmFja19zdGF0cy5saWtlfSAvPn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyEhbG9nLmFkbWluX2ZlZWRiYWNrX3N0YXRzLmRpc2xpa2UgJiYgPEhhbmRUaHVtYkljb25XaXRoQ291bnQgaWNvblR5cGU9XCJkb3duXCIgY291bnQ9e2xvZy5hZG1pbl9mZWVkYmFja19zdGF0cy5kaXNsaWtlfSAvPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidy1bMTYwcHhdIHAtMyBwci0yXCI+e2Zvcm1hdFRpbWUobG9nLnVwZGF0ZWRfYXQsIHQoJ2RhdGVUaW1lRm9ybWF0JywgeyBuczogJ2FwcExvZycgfSkgYXMgc3RyaW5nKX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ3LVsxNjBweF0gcC0zIHByLTJcIj57Zm9ybWF0VGltZShsb2cuY3JlYXRlZF9hdCwgdCgnZGF0ZVRpbWVGb3JtYXQnLCB7IG5zOiAnYXBwTG9nJyB9KSBhcyBzdHJpbmcpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgICAgPERyYXdlclxuICAgICAgICBpc09wZW49e3Nob3dEcmF3ZXJ9XG4gICAgICAgIG9uQ2xvc2U9e29uQ2xvc2VEcmF3ZXJ9XG4gICAgICAgIG1hc2s9e2lzTW9iaWxlfVxuICAgICAgICBmb290ZXI9e251bGx9XG4gICAgICAgIHBhbmVsQ2xhc3NOYW1lPVwibXQtMTYgbXgtMiBzbTptci0yIG1iLTQgIXAtMCAhbWF4LXctWzY0MHB4XSByb3VuZGVkLXhsIGJnLWNvbXBvbmVudHMtcGFuZWwtYmdcIlxuICAgICAgPlxuICAgICAgICA8RHJhd2VyQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17e1xuICAgICAgICAgIG9uQ2xvc2U6IG9uQ2xvc2VEcmF3ZXIsXG4gICAgICAgICAgYXBwRGV0YWlsLFxuICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2lzQ2hhdE1vZGVcbiAgICAgICAgICAgID8gPENoYXRDb252ZXJzYXRpb25EZXRhaWxDb21wIGFwcElkPXthcHBEZXRhaWwuaWR9IGNvbnZlcnNhdGlvbklkPXtjdXJyZW50Q29udmVyc2F0aW9uPy5pZH0gLz5cbiAgICAgICAgICAgIDogPENvbXBsZXRpb25Db252ZXJzYXRpb25EZXRhaWxDb21wIGFwcElkPXthcHBEZXRhaWwuaWR9IGNvbnZlcnNhdGlvbklkPXtjdXJyZW50Q29udmVyc2F0aW9uPy5pZH0gLz59XG4gICAgICAgIDwvRHJhd2VyQ29udGV4dC5Qcm92aWRlcj5cbiAgICAgIDwvRHJhd2VyPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnZlcnNhdGlvbkxpc3RcbiJdfQ==