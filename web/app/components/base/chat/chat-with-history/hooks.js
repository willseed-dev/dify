"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatWithHistory = void 0;
const ahooks_1 = require("ahooks");
const function_1 = require("es-toolkit/function");
const immer_1 = require("immer");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const utils_1 = require("@/app/components/base/file-uploader/utils");
const toast_1 = require("@/app/components/base/toast");
const types_1 = require("@/app/components/workflow/types");
const web_app_context_1 = require("@/context/web-app-context");
const use_app_favicon_1 = require("@/hooks/use-app-favicon");
const client_1 = require("@/i18n-config/client");
const share_1 = require("@/service/share");
const use_share_1 = require("@/service/use-share");
const app_1 = require("@/types/app");
const utils_2 = require("../../../tools/utils");
const constants_1 = require("../constants");
const utils_3 = require("../utils");
function getFormattedChatList(messages) {
    const newChatList = [];
    messages.forEach((item) => {
        const questionFiles = item.message_files?.filter((file) => file.belongs_to === 'user') || [];
        newChatList.push({
            id: `question-${item.id}`,
            content: item.query,
            isAnswer: false,
            message_files: (0, utils_1.getProcessedFilesFromResponse)(questionFiles.map((item) => ({ ...item, related_id: item.id, upload_file_id: item.upload_file_id }))),
            parentMessageId: item.parent_message_id || undefined,
        });
        const answerFiles = item.message_files?.filter((file) => file.belongs_to === 'assistant') || [];
        newChatList.push({
            id: item.id,
            content: item.answer,
            agent_thoughts: (0, utils_2.addFileInfos)(item.agent_thoughts ? (0, utils_2.sortAgentSorts)(item.agent_thoughts) : item.agent_thoughts, item.message_files),
            feedback: item.feedback,
            isAnswer: true,
            citation: item.retriever_resources,
            message_files: (0, utils_1.getProcessedFilesFromResponse)(answerFiles.map((item) => ({ ...item, related_id: item.id, upload_file_id: item.upload_file_id }))),
            parentMessageId: `question-${item.id}`,
        });
    });
    return newChatList;
}
const useChatWithHistory = (installedAppInfo) => {
    const isInstalledApp = (0, react_1.useMemo)(() => !!installedAppInfo, [installedAppInfo]);
    const appInfo = (0, web_app_context_1.useWebAppStore)(s => s.appInfo);
    const appParams = (0, web_app_context_1.useWebAppStore)(s => s.appParams);
    const appMeta = (0, web_app_context_1.useWebAppStore)(s => s.appMeta);
    (0, use_app_favicon_1.useAppFavicon)({
        enable: !installedAppInfo,
        icon_type: appInfo?.site.icon_type,
        icon: appInfo?.site.icon,
        icon_background: appInfo?.site.icon_background,
        icon_url: appInfo?.site.icon_url,
    });
    const appData = (0, react_1.useMemo)(() => {
        if (isInstalledApp) {
            const { id, app } = installedAppInfo;
            return {
                app_id: id,
                site: {
                    title: app.name,
                    icon_type: app.icon_type,
                    icon: app.icon,
                    icon_background: app.icon_background,
                    icon_url: app.icon_url,
                    prompt_public: false,
                    copyright: '',
                    show_workflow_steps: true,
                    use_icon_as_answer_icon: app.use_icon_as_answer_icon,
                },
                plan: 'basic',
                custom_config: null,
            };
        }
        return appInfo;
    }, [isInstalledApp, installedAppInfo, appInfo]);
    const appId = (0, react_1.useMemo)(() => appData?.app_id, [appData]);
    const [userId, setUserId] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        (0, utils_3.getProcessedSystemVariablesFromUrlParams)().then(({ user_id }) => {
            setUserId(user_id);
        });
    }, []);
    (0, react_1.useEffect)(() => {
        const setLocaleFromProps = async () => {
            if (appData?.site.default_language)
                await (0, client_1.changeLanguage)(appData.site.default_language);
        };
        setLocaleFromProps();
    }, [appData]);
    const [sidebarCollapseState, setSidebarCollapseState] = (0, react_1.useState)(() => {
        if (typeof window !== 'undefined') {
            try {
                const localState = localStorage.getItem('webappSidebarCollapse');
                return localState === 'collapsed';
            }
            catch {
                // localStorage may be disabled in private browsing mode or by security settings
                // fallback to default value
                return false;
            }
        }
        return false;
    });
    const handleSidebarCollapse = (0, react_1.useCallback)((state) => {
        if (appId) {
            setSidebarCollapseState(state);
            try {
                localStorage.setItem('webappSidebarCollapse', state ? 'collapsed' : 'expanded');
            }
            catch {
                // localStorage may be disabled, continue without persisting state
            }
        }
    }, [appId, setSidebarCollapseState]);
    const [conversationIdInfo, setConversationIdInfo] = (0, ahooks_1.useLocalStorageState)(constants_1.CONVERSATION_ID_INFO, {
        defaultValue: {},
    });
    const currentConversationId = (0, react_1.useMemo)(() => conversationIdInfo?.[appId || '']?.[userId || 'DEFAULT'] || '', [appId, conversationIdInfo, userId]);
    const handleConversationIdInfoChange = (0, react_1.useCallback)((changeConversationId) => {
        if (appId) {
            let prevValue = conversationIdInfo?.[appId || ''];
            if (typeof prevValue === 'string')
                prevValue = {};
            setConversationIdInfo({
                ...conversationIdInfo,
                [appId || '']: {
                    ...prevValue,
                    [userId || 'DEFAULT']: changeConversationId,
                },
            });
        }
    }, [appId, conversationIdInfo, setConversationIdInfo, userId]);
    const [newConversationId, setNewConversationId] = (0, react_1.useState)('');
    const chatShouldReloadKey = (0, react_1.useMemo)(() => {
        if (currentConversationId === newConversationId)
            return '';
        return currentConversationId;
    }, [currentConversationId, newConversationId]);
    const { data: appPinnedConversationData } = (0, use_share_1.useShareConversations)({
        isInstalledApp,
        appId,
        pinned: true,
        limit: 100,
    }, {
        enabled: !!appId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const { data: appConversationData, isLoading: appConversationDataLoading, } = (0, use_share_1.useShareConversations)({
        isInstalledApp,
        appId,
        pinned: false,
        limit: 100,
    }, {
        enabled: !!appId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const { data: appChatListData, isLoading: appChatListDataLoading, } = (0, use_share_1.useShareChatList)({
        conversationId: chatShouldReloadKey,
        isInstalledApp,
        appId,
    }, {
        enabled: !!chatShouldReloadKey,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const invalidateShareConversations = (0, use_share_1.useInvalidateShareConversations)();
    const [clearChatList, setClearChatList] = (0, react_1.useState)(false);
    const [isResponding, setIsResponding] = (0, react_1.useState)(false);
    const appPrevChatTree = (0, react_1.useMemo)(() => (currentConversationId && appChatListData?.data.length)
        ? (0, utils_3.buildChatItemTree)(getFormattedChatList(appChatListData.data))
        : [], [appChatListData, currentConversationId]);
    const [showNewConversationItemInList, setShowNewConversationItemInList] = (0, react_1.useState)(false);
    const pinnedConversationList = (0, react_1.useMemo)(() => {
        return appPinnedConversationData?.data || [];
    }, [appPinnedConversationData]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const newConversationInputsRef = (0, react_1.useRef)({});
    const [newConversationInputs, setNewConversationInputs] = (0, react_1.useState)({});
    const [initInputs, setInitInputs] = (0, react_1.useState)({});
    const [initUserVariables, setInitUserVariables] = (0, react_1.useState)({});
    const handleNewConversationInputsChange = (0, react_1.useCallback)((newInputs) => {
        newConversationInputsRef.current = newInputs;
        setNewConversationInputs(newInputs);
    }, []);
    const inputsForms = (0, react_1.useMemo)(() => {
        return (appParams?.user_input_form || []).filter((item) => !item.external_data_tool).map((item) => {
            if (item.paragraph) {
                let value = initInputs[item.paragraph.variable];
                if (value && item.paragraph.max_length && value.length > item.paragraph.max_length)
                    value = value.slice(0, item.paragraph.max_length);
                return {
                    ...item.paragraph,
                    default: value || item.default || item.paragraph.default,
                    type: 'paragraph',
                };
            }
            if (item.number) {
                const convertedNumber = Number(initInputs[item.number.variable]);
                return {
                    ...item.number,
                    default: convertedNumber || item.default || item.number.default,
                    type: 'number',
                };
            }
            if (item.checkbox) {
                const preset = initInputs[item.checkbox.variable] === true;
                return {
                    ...item.checkbox,
                    default: preset || item.default || item.checkbox.default,
                    type: 'checkbox',
                };
            }
            if (item.select) {
                const isInputInOptions = item.select.options.includes(initInputs[item.select.variable]);
                return {
                    ...item.select,
                    default: (isInputInOptions ? initInputs[item.select.variable] : undefined) || item.select.default,
                    type: 'select',
                };
            }
            if (item['file-list']) {
                return {
                    ...item['file-list'],
                    type: 'file-list',
                };
            }
            if (item.file) {
                return {
                    ...item.file,
                    type: 'file',
                };
            }
            if (item.json_object) {
                return {
                    ...item.json_object,
                    type: 'json_object',
                };
            }
            let value = initInputs[item['text-input'].variable];
            if (value && item['text-input'].max_length && value.length > item['text-input'].max_length)
                value = value.slice(0, item['text-input'].max_length);
            return {
                ...item['text-input'],
                default: value || item.default || item['text-input'].default,
                type: 'text-input',
            };
        });
    }, [initInputs, appParams]);
    const allInputsHidden = (0, react_1.useMemo)(() => {
        return inputsForms.length > 0 && inputsForms.every(item => item.hide === true);
    }, [inputsForms]);
    (0, react_1.useEffect)(() => {
        // init inputs from url params
        (async () => {
            const inputs = await (0, utils_3.getRawInputsFromUrlParams)();
            const userVariables = await (0, utils_3.getRawUserVariablesFromUrlParams)();
            setInitInputs(inputs);
            setInitUserVariables(userVariables);
        })();
    }, []);
    (0, react_1.useEffect)(() => {
        const conversationInputs = {};
        inputsForms.forEach((item) => {
            conversationInputs[item.variable] = item.default || null;
        });
        handleNewConversationInputsChange(conversationInputs);
    }, [handleNewConversationInputsChange, inputsForms]);
    const { data: newConversation } = (0, use_share_1.useShareConversationName)({
        conversationId: newConversationId,
        isInstalledApp,
        appId,
    }, {
        refetchOnWindowFocus: false,
    });
    const [originConversationList, setOriginConversationList] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (appConversationData?.data && !appConversationDataLoading)
            setOriginConversationList(appConversationData?.data);
    }, [appConversationData, appConversationDataLoading]);
    const conversationList = (0, react_1.useMemo)(() => {
        const data = originConversationList.slice();
        if (showNewConversationItemInList && data[0]?.id !== '') {
            data.unshift({
                id: '',
                name: t('chat.newChatDefaultName', { ns: 'share' }),
                inputs: {},
                introduction: '',
            });
        }
        return data;
    }, [originConversationList, showNewConversationItemInList, t]);
    (0, react_1.useEffect)(() => {
        if (newConversation) {
            setOriginConversationList((0, immer_1.produce)((draft) => {
                const index = draft.findIndex(item => item.id === newConversation.id);
                if (index > -1)
                    draft[index] = newConversation;
                else
                    draft.unshift(newConversation);
            }));
        }
    }, [newConversation]);
    const currentConversationItem = (0, react_1.useMemo)(() => {
        let conversationItem = conversationList.find(item => item.id === currentConversationId);
        if (!conversationItem && pinnedConversationList.length)
            conversationItem = pinnedConversationList.find(item => item.id === currentConversationId);
        return conversationItem;
    }, [conversationList, currentConversationId, pinnedConversationList]);
    const currentConversationLatestInputs = (0, react_1.useMemo)(() => {
        if (!currentConversationId || !appChatListData?.data.length)
            return newConversationInputsRef.current || {};
        return appChatListData.data.slice().pop().inputs || {};
    }, [appChatListData, currentConversationId]);
    const [currentConversationInputs, setCurrentConversationInputs] = (0, react_1.useState)(currentConversationLatestInputs || {});
    (0, react_1.useEffect)(() => {
        if (currentConversationItem)
            setCurrentConversationInputs(currentConversationLatestInputs || {});
    }, [currentConversationItem, currentConversationLatestInputs]);
    const { notify } = (0, toast_1.useToastContext)();
    const checkInputsRequired = (0, react_1.useCallback)((silent) => {
        if (allInputsHidden)
            return true;
        let hasEmptyInput = '';
        let fileIsUploading = false;
        const requiredVars = inputsForms.filter(({ required, type }) => required && type !== types_1.InputVarType.checkbox);
        if (requiredVars.length) {
            requiredVars.forEach(({ variable, label, type }) => {
                if (hasEmptyInput)
                    return;
                if (fileIsUploading)
                    return;
                if (!newConversationInputsRef.current[variable] && !silent)
                    hasEmptyInput = label;
                if ((type === types_1.InputVarType.singleFile || type === types_1.InputVarType.multiFiles) && newConversationInputsRef.current[variable] && !silent) {
                    const files = newConversationInputsRef.current[variable];
                    if (Array.isArray(files))
                        fileIsUploading = files.find(item => item.transferMethod === app_1.TransferMethod.local_file && !item.uploadedId);
                    else
                        fileIsUploading = files.transferMethod === app_1.TransferMethod.local_file && !files.uploadedId;
                }
            });
        }
        if (hasEmptyInput) {
            notify({ type: 'error', message: t('errorMessage.valueOfVarRequired', { ns: 'appDebug', key: hasEmptyInput }) });
            return false;
        }
        if (fileIsUploading) {
            notify({ type: 'info', message: t('errorMessage.waitForFileUpload', { ns: 'appDebug' }) });
            return;
        }
        return true;
    }, [inputsForms, notify, t, allInputsHidden]);
    const handleStartChat = (0, react_1.useCallback)((callback) => {
        if (checkInputsRequired()) {
            setShowNewConversationItemInList(true);
            callback?.();
        }
    }, [setShowNewConversationItemInList, checkInputsRequired]);
    const currentChatInstanceRef = (0, react_1.useRef)({ handleStop: function_1.noop });
    const handleChangeConversation = (0, react_1.useCallback)((conversationId) => {
        currentChatInstanceRef.current.handleStop();
        setNewConversationId('');
        handleConversationIdInfoChange(conversationId);
        if (conversationId)
            setClearChatList(false);
    }, [handleConversationIdInfoChange, setClearChatList]);
    const handleNewConversation = (0, react_1.useCallback)(async () => {
        currentChatInstanceRef.current.handleStop();
        setShowNewConversationItemInList(true);
        handleChangeConversation('');
        const conversationInputs = {};
        inputsForms.forEach((item) => {
            conversationInputs[item.variable] = item.default || null;
        });
        handleNewConversationInputsChange(conversationInputs);
        setClearChatList(true);
    }, [handleChangeConversation, setShowNewConversationItemInList, handleNewConversationInputsChange, setClearChatList, inputsForms]);
    const handleUpdateConversationList = (0, react_1.useCallback)(() => {
        invalidateShareConversations();
    }, [invalidateShareConversations]);
    const handlePinConversation = (0, react_1.useCallback)(async (conversationId) => {
        await (0, share_1.pinConversation)(isInstalledApp, appId, conversationId);
        notify({ type: 'success', message: t('api.success', { ns: 'common' }) });
        handleUpdateConversationList();
    }, [isInstalledApp, appId, notify, t, handleUpdateConversationList]);
    const handleUnpinConversation = (0, react_1.useCallback)(async (conversationId) => {
        await (0, share_1.unpinConversation)(isInstalledApp, appId, conversationId);
        notify({ type: 'success', message: t('api.success', { ns: 'common' }) });
        handleUpdateConversationList();
    }, [isInstalledApp, appId, notify, t, handleUpdateConversationList]);
    const [conversationDeleting, setConversationDeleting] = (0, react_1.useState)(false);
    const handleDeleteConversation = (0, react_1.useCallback)(async (conversationId, { onSuccess, }) => {
        if (conversationDeleting)
            return;
        try {
            setConversationDeleting(true);
            await (0, share_1.delConversation)(isInstalledApp, appId, conversationId);
            notify({ type: 'success', message: t('api.success', { ns: 'common' }) });
            onSuccess();
        }
        finally {
            setConversationDeleting(false);
        }
        if (conversationId === currentConversationId)
            handleNewConversation();
        handleUpdateConversationList();
    }, [isInstalledApp, appId, notify, t, handleUpdateConversationList, handleNewConversation, currentConversationId, conversationDeleting]);
    const [conversationRenaming, setConversationRenaming] = (0, react_1.useState)(false);
    const handleRenameConversation = (0, react_1.useCallback)(async (conversationId, newName, { onSuccess, }) => {
        if (conversationRenaming)
            return;
        if (!newName.trim()) {
            notify({
                type: 'error',
                message: t('chat.conversationNameCanNotEmpty', { ns: 'common' }),
            });
            return;
        }
        setConversationRenaming(true);
        try {
            await (0, share_1.renameConversation)(isInstalledApp, appId, conversationId, newName);
            notify({
                type: 'success',
                message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }),
            });
            setOriginConversationList((0, immer_1.produce)((draft) => {
                const index = originConversationList.findIndex(item => item.id === conversationId);
                const item = draft[index];
                draft[index] = {
                    ...item,
                    name: newName,
                };
            }));
            onSuccess();
        }
        finally {
            setConversationRenaming(false);
        }
    }, [isInstalledApp, appId, notify, t, conversationRenaming, originConversationList]);
    const handleNewConversationCompleted = (0, react_1.useCallback)((newConversationId) => {
        setNewConversationId(newConversationId);
        handleConversationIdInfoChange(newConversationId);
        setShowNewConversationItemInList(false);
        invalidateShareConversations();
    }, [handleConversationIdInfoChange, invalidateShareConversations]);
    const handleFeedback = (0, react_1.useCallback)(async (messageId, feedback) => {
        await (0, share_1.updateFeedback)({ url: `/messages/${messageId}/feedbacks`, body: { rating: feedback.rating, content: feedback.content } }, isInstalledApp, appId);
        notify({ type: 'success', message: t('api.success', { ns: 'common' }) });
    }, [isInstalledApp, appId, t, notify]);
    return {
        isInstalledApp,
        appId,
        currentConversationId,
        currentConversationItem,
        handleConversationIdInfoChange,
        appData,
        appParams: appParams || {},
        appMeta,
        appPinnedConversationData,
        appConversationData,
        appConversationDataLoading,
        appChatListData,
        appChatListDataLoading,
        appPrevChatTree,
        pinnedConversationList,
        conversationList,
        setShowNewConversationItemInList,
        newConversationInputs,
        newConversationInputsRef,
        handleNewConversationInputsChange,
        inputsForms,
        handleNewConversation,
        handleStartChat,
        handleChangeConversation,
        handlePinConversation,
        handleUnpinConversation,
        conversationDeleting,
        handleDeleteConversation,
        conversationRenaming,
        handleRenameConversation,
        handleNewConversationCompleted,
        newConversationId,
        chatShouldReloadKey,
        handleFeedback,
        currentChatInstanceRef,
        sidebarCollapseState,
        handleSidebarCollapse,
        clearChatList,
        setClearChatList,
        isResponding,
        setIsResponding,
        currentConversationInputs,
        setCurrentConversationInputs,
        allInputsHidden,
        initUserVariables,
    };
};
exports.useChatWithHistory = useChatWithHistory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBV0EsbUNBQTZDO0FBQzdDLGtEQUEwQztBQUMxQyxpQ0FBK0I7QUFDL0IsaUNBTWM7QUFDZCxpREFBOEM7QUFDOUMscUVBQXlGO0FBQ3pGLHVEQUE2RDtBQUM3RCwyREFBOEQ7QUFDOUQsK0RBQTBEO0FBQzFELDZEQUF1RDtBQUN2RCxpREFBcUQ7QUFDckQsMkNBTXdCO0FBQ3hCLG1EQUs0QjtBQUM1QixxQ0FBNEM7QUFDNUMsZ0RBQW1FO0FBQ25FLDRDQUFtRDtBQUNuRCxvQ0FBbUo7QUFFbkosU0FBUyxvQkFBb0IsQ0FBQyxRQUFlO0lBQzNDLE1BQU0sV0FBVyxHQUFlLEVBQUUsQ0FBQTtJQUNsQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDeEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ2pHLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDZixFQUFFLEVBQUUsWUFBWSxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ3pCLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSztZQUNuQixRQUFRLEVBQUUsS0FBSztZQUNmLGFBQWEsRUFBRSxJQUFBLHFDQUE2QixFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2SixlQUFlLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixJQUFJLFNBQVM7U0FDckQsQ0FBQyxDQUFBO1FBQ0Ys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QUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzFFLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFFdEMsT0FBTztRQUNMLGNBQWM7UUFDZCxLQUFLO1FBQ0wscUJBQXFCO1FBQ3JCLHVCQUF1QjtRQUN2Qiw4QkFBOEI7UUFDOUIsT0FBTztRQUNQLFNBQVMsRUFBRSxTQUFTLElBQUksRUFBZ0I7UUFDeEMsT0FBTztRQUNQLHlCQUF5QjtRQUN6QixtQkFBbUI7UUFDbkIsMEJBQTBCO1FBQzFCLGVBQWU7UUFDZixzQkFBc0I7UUFDdEIsZUFBZTtRQUNmLHNCQUFzQjtRQUN0QixnQkFBZ0I7UUFDaEIsZ0NBQWdDO1FBQ2hDLHFCQUFxQjtRQUNyQix3QkFBd0I7UUFDeEIsaUNBQWlDO1FBQ2pDLFdBQVc7UUFDWCxxQkFBcUI7UUFDckIsZUFBZTtRQUNmLHdCQUF3QjtRQUN4QixxQkFBcUI7UUFDckIsdUJBQXVCO1FBQ3ZCLG9CQUFvQjtRQUNwQix3QkFBd0I7UUFDeEIsb0JBQW9CO1FBQ3BCLHdCQUF3QjtRQUN4Qiw4QkFBOEI7UUFDOUIsaUJBQWlCO1FBQ2pCLG1CQUFtQjtRQUNuQixjQUFjO1FBQ2Qsc0JBQXNCO1FBQ3RCLG9CQUFvQjtRQUNwQixxQkFBcUI7UUFDckIsYUFBYTtRQUNiLGdCQUFnQjtRQUNoQixZQUFZO1FBQ1osZUFBZTtRQUNmLHlCQUF5QjtRQUN6Qiw0QkFBNEI7UUFDNUIsZUFBZTtRQUNmLGlCQUFpQjtLQUNsQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBbmhCWSxRQUFBLGtCQUFrQixzQkFtaEI5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgQ2FsbGJhY2ssXG4gIENoYXRDb25maWcsXG4gIENoYXRJdGVtLFxuICBGZWVkYmFjayxcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEluc3RhbGxlZEFwcCB9IGZyb20gJ0AvbW9kZWxzL2V4cGxvcmUnXG5pbXBvcnQgdHlwZSB7XG4gIEFwcERhdGEsXG4gIENvbnZlcnNhdGlvbkl0ZW0sXG59IGZyb20gJ0AvbW9kZWxzL3NoYXJlJ1xuaW1wb3J0IHsgdXNlTG9jYWxTdG9yYWdlU3RhdGUgfSBmcm9tICdhaG9va3MnXG5pbXBvcnQgeyBub29wIH0gZnJvbSAnZXMtdG9vbGtpdC9mdW5jdGlvbidcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxuICB1c2VFZmZlY3QsXG4gIHVzZU1lbW8sXG4gIHVzZVJlZixcbiAgdXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgZ2V0UHJvY2Vzc2VkRmlsZXNGcm9tUmVzcG9uc2UgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci91dGlscydcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IElucHV0VmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyB1c2VXZWJBcHBTdG9yZSB9IGZyb20gJ0AvY29udGV4dC93ZWItYXBwLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VBcHBGYXZpY29uIH0gZnJvbSAnQC9ob29rcy91c2UtYXBwLWZhdmljb24nXG5pbXBvcnQgeyBjaGFuZ2VMYW5ndWFnZSB9IGZyb20gJ0AvaTE4bi1jb25maWcvY2xpZW50J1xuaW1wb3J0IHtcbiAgZGVsQ29udmVyc2F0aW9uLFxuICBwaW5Db252ZXJzYXRpb24sXG4gIHJlbmFtZUNvbnZlcnNhdGlvbixcbiAgdW5waW5Db252ZXJzYXRpb24sXG4gIHVwZGF0ZUZlZWRiYWNrLFxufSBmcm9tICdAL3NlcnZpY2Uvc2hhcmUnXG5pbXBvcnQge1xuICB1c2VJbnZhbGlkYXRlU2hhcmVDb252ZXJzYXRpb25zLFxuICB1c2VTaGFyZUNoYXRMaXN0LFxuICB1c2VTaGFyZUNvbnZlcnNhdGlvbk5hbWUsXG4gIHVzZVNoYXJlQ29udmVyc2F0aW9ucyxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1zaGFyZSdcbmltcG9ydCB7IFRyYW5zZmVyTWV0aG9kIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBhZGRGaWxlSW5mb3MsIHNvcnRBZ2VudFNvcnRzIH0gZnJvbSAnLi4vLi4vLi4vdG9vbHMvdXRpbHMnXG5pbXBvcnQgeyBDT05WRVJTQVRJT05fSURfSU5GTyB9IGZyb20gJy4uL2NvbnN0YW50cydcbmltcG9ydCB7IGJ1aWxkQ2hhdEl0ZW1UcmVlLCBnZXRQcm9jZXNzZWRTeXN0ZW1WYXJpYWJsZXNGcm9tVXJsUGFyYW1zLCBnZXRSYXdJbnB1dHNGcm9tVXJsUGFyYW1zLCBnZXRSYXdVc2VyVmFyaWFibGVzRnJvbVVybFBhcmFtcyB9IGZyb20gJy4uL3V0aWxzJ1xuXG5mdW5jdGlvbiBnZXRGb3JtYXR0ZWRDaGF0TGlzdChtZXNzYWdlczogYW55W10pIHtcbiAgY29uc3QgbmV3Q2hhdExpc3Q6IENoYXRJdGVtW10gPSBbXVxuICBtZXNzYWdlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgY29uc3QgcXVlc3Rpb25GaWxlcyA9IGl0ZW0ubWVzc2FnZV9maWxlcz8uZmlsdGVyKChmaWxlOiBhbnkpID0+IGZpbGUuYmVsb25nc190byA9PT0gJ3VzZXInKSB8fCBbXVxuICAgIG5ld0NoYXRMaXN0LnB1c2goe1xuICAgICAgaWQ6IGBxdWVzdGlvbi0ke2l0ZW0uaWR9YCxcbiAgICAgIGNvbnRlbnQ6IGl0ZW0ucXVlcnksXG4gICAgICBpc0Fuc3dlcjogZmFsc2UsXG4gICAgICBtZXNzYWdlX2ZpbGVzOiBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZShxdWVzdGlvbkZpbGVzLm1hcCgoaXRlbTogYW55KSA9PiAoeyAuLi5pdGVtLCByZWxhdGVkX2lkOiBpdGVtLmlkLCB1cGxvYWRfZmlsZV9pZDogaXRlbS51cGxvYWRfZmlsZV9pZCB9KSkpLFxuICAgICAgcGFyZW50TWVzc2FnZUlkOiBpdGVtLnBhcmVudF9tZXNzYWdlX2lkIHx8IHVuZGVmaW5lZCxcbiAgICB9KVxuICAgIGNvbnN0IGFuc3dlckZpbGVzID0gaXRlbS5tZXNzYWdlX2ZpbGVzPy5maWx0ZXIoKGZpbGU6IGFueSkgPT4gZmlsZS5iZWxvbmdzX3RvID09PSAnYXNzaXN0YW50JykgfHwgW11cbiAgICBuZXdDaGF0TGlzdC5wdXNoKHtcbiAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgY29udGVudDogaXRlbS5hbnN3ZXIsXG4gICAgICBhZ2VudF90aG91Z2h0czogYWRkRmlsZUluZm9zKGl0ZW0uYWdlbnRfdGhvdWdodHMgPyBzb3J0QWdlbnRTb3J0cyhpdGVtLmFnZW50X3Rob3VnaHRzKSA6IGl0ZW0uYWdlbnRfdGhvdWdodHMsIGl0ZW0ubWVzc2FnZV9maWxlcyksXG4gICAgICBmZWVkYmFjazogaXRlbS5mZWVkYmFjayxcbiAgICAgIGlzQW5zd2VyOiB0cnVlLFxuICAgICAgY2l0YXRpb246IGl0ZW0ucmV0cmlldmVyX3Jlc291cmNlcyxcbiAgICAgIG1lc3NhZ2VfZmlsZXM6IGdldFByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlKGFuc3dlckZpbGVzLm1hcCgoaXRlbTogYW55KSA9PiAoeyAuLi5pdGVtLCByZWxhdGVkX2lkOiBpdGVtLmlkLCB1cGxvYWRfZmlsZV9pZDogaXRlbS51cGxvYWRfZmlsZV9pZCB9KSkpLFxuICAgICAgcGFyZW50TWVzc2FnZUlkOiBgcXVlc3Rpb24tJHtpdGVtLmlkfWAsXG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIG5ld0NoYXRMaXN0XG59XG5cbmV4cG9ydCBjb25zdCB1c2VDaGF0V2l0aEhpc3RvcnkgPSAoaW5zdGFsbGVkQXBwSW5mbz86IEluc3RhbGxlZEFwcCkgPT4ge1xuICBjb25zdCBpc0luc3RhbGxlZEFwcCA9IHVzZU1lbW8oKCkgPT4gISFpbnN0YWxsZWRBcHBJbmZvLCBbaW5zdGFsbGVkQXBwSW5mb10pXG4gIGNvbnN0IGFwcEluZm8gPSB1c2VXZWJBcHBTdG9yZShzID0+IHMuYXBwSW5mbylcbiAgY29uc3QgYXBwUGFyYW1zID0gdXNlV2ViQXBwU3RvcmUocyA9PiBzLmFwcFBhcmFtcylcbiAgY29uc3QgYXBwTWV0YSA9IHVzZVdlYkFwcFN0b3JlKHMgPT4gcy5hcHBNZXRhKVxuXG4gIHVzZUFwcEZhdmljb24oe1xuICAgIGVuYWJsZTogIWluc3RhbGxlZEFwcEluZm8sXG4gICAgaWNvbl90eXBlOiBhcHBJbmZvPy5zaXRlLmljb25fdHlwZSxcbiAgICBpY29uOiBhcHBJbmZvPy5zaXRlLmljb24sXG4gICAgaWNvbl9iYWNrZ3JvdW5kOiBhcHBJbmZvPy5zaXRlLmljb25fYmFja2dyb3VuZCxcbiAgICBpY29uX3VybDogYXBwSW5mbz8uc2l0ZS5pY29uX3VybCxcbiAgfSlcblxuICBjb25zdCBhcHBEYXRhID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGlzSW5zdGFsbGVkQXBwKSB7XG4gICAgICBjb25zdCB7IGlkLCBhcHAgfSA9IGluc3RhbGxlZEFwcEluZm8hXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhcHBfaWQ6IGlkLFxuICAgICAgICBzaXRlOiB7XG4gICAgICAgICAgdGl0bGU6IGFwcC5uYW1lLFxuICAgICAgICAgIGljb25fdHlwZTogYXBwLmljb25fdHlwZSxcbiAgICAgICAgICBpY29uOiBhcHAuaWNvbixcbiAgICAgICAgICBpY29uX2JhY2tncm91bmQ6IGFwcC5pY29uX2JhY2tncm91bmQsXG4gICAgICAgICAgaWNvbl91cmw6IGFwcC5pY29uX3VybCxcbiAgICAgICAgICBwcm9tcHRfcHVibGljOiBmYWxzZSxcbiAgICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuICAgICAgICAgIHNob3dfd29ya2Zsb3dfc3RlcHM6IHRydWUsXG4gICAgICAgICAgdXNlX2ljb25fYXNfYW5zd2VyX2ljb246IGFwcC51c2VfaWNvbl9hc19hbnN3ZXJfaWNvbixcbiAgICAgICAgfSxcbiAgICAgICAgcGxhbjogJ2Jhc2ljJyxcbiAgICAgICAgY3VzdG9tX2NvbmZpZzogbnVsbCxcbiAgICAgIH0gYXMgQXBwRGF0YVxuICAgIH1cblxuICAgIHJldHVybiBhcHBJbmZvXG4gIH0sIFtpc0luc3RhbGxlZEFwcCwgaW5zdGFsbGVkQXBwSW5mbywgYXBwSW5mb10pXG4gIGNvbnN0IGFwcElkID0gdXNlTWVtbygoKSA9PiBhcHBEYXRhPy5hcHBfaWQsIFthcHBEYXRhXSlcblxuICBjb25zdCBbdXNlcklkLCBzZXRVc2VySWRdID0gdXNlU3RhdGU8c3RyaW5nPigpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZ2V0UHJvY2Vzc2VkU3lzdGVtVmFyaWFibGVzRnJvbVVybFBhcmFtcygpLnRoZW4oKHsgdXNlcl9pZCB9KSA9PiB7XG4gICAgICBzZXRVc2VySWQodXNlcl9pZClcbiAgICB9KVxuICB9LCBbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHNldExvY2FsZUZyb21Qcm9wcyA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChhcHBEYXRhPy5zaXRlLmRlZmF1bHRfbGFuZ3VhZ2UpXG4gICAgICAgIGF3YWl0IGNoYW5nZUxhbmd1YWdlKGFwcERhdGEuc2l0ZS5kZWZhdWx0X2xhbmd1YWdlKVxuICAgIH1cbiAgICBzZXRMb2NhbGVGcm9tUHJvcHMoKVxuICB9LCBbYXBwRGF0YV0pXG5cbiAgY29uc3QgW3NpZGViYXJDb2xsYXBzZVN0YXRlLCBzZXRTaWRlYmFyQ29sbGFwc2VTdGF0ZV0gPSB1c2VTdGF0ZTxib29sZWFuPigoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBsb2NhbFN0YXRlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmFwcFNpZGViYXJDb2xsYXBzZScpXG4gICAgICAgIHJldHVybiBsb2NhbFN0YXRlID09PSAnY29sbGFwc2VkJ1xuICAgICAgfVxuICAgICAgY2F0Y2gge1xuICAgICAgICAvLyBsb2NhbFN0b3JhZ2UgbWF5IGJlIGRpc2FibGVkIGluIHByaXZhdGUgYnJvd3NpbmcgbW9kZSBvciBieSBzZWN1cml0eSBzZXR0aW5nc1xuICAgICAgICAvLyBmYWxsYmFjayB0byBkZWZhdWx0IHZhbHVlXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbiAgY29uc3QgaGFuZGxlU2lkZWJhckNvbGxhcHNlID0gdXNlQ2FsbGJhY2soKHN0YXRlOiBib29sZWFuKSA9PiB7XG4gICAgaWYgKGFwcElkKSB7XG4gICAgICBzZXRTaWRlYmFyQ29sbGFwc2VTdGF0ZShzdGF0ZSlcbiAgICAgIHRyeSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3ZWJhcHBTaWRlYmFyQ29sbGFwc2UnLCBzdGF0ZSA/ICdjb2xsYXBzZWQnIDogJ2V4cGFuZGVkJylcbiAgICAgIH1cbiAgICAgIGNhdGNoIHtcbiAgICAgICAgLy8gbG9jYWxTdG9yYWdlIG1heSBiZSBkaXNhYmxlZCwgY29udGludWUgd2l0aG91dCBwZXJzaXN0aW5nIHN0YXRlXG4gICAgICB9XG4gICAgfVxuICB9LCBbYXBwSWQsIHNldFNpZGViYXJDb2xsYXBzZVN0YXRlXSlcbiAgY29uc3QgW2NvbnZlcnNhdGlvbklkSW5mbywgc2V0Q29udmVyc2F0aW9uSWRJbmZvXSA9IHVzZUxvY2FsU3RvcmFnZVN0YXRlPFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+PihDT05WRVJTQVRJT05fSURfSU5GTywge1xuICAgIGRlZmF1bHRWYWx1ZToge30sXG4gIH0pXG4gIGNvbnN0IGN1cnJlbnRDb252ZXJzYXRpb25JZCA9IHVzZU1lbW8oKCkgPT4gY29udmVyc2F0aW9uSWRJbmZvPy5bYXBwSWQgfHwgJyddPy5bdXNlcklkIHx8ICdERUZBVUxUJ10gfHwgJycsIFthcHBJZCwgY29udmVyc2F0aW9uSWRJbmZvLCB1c2VySWRdKVxuICBjb25zdCBoYW5kbGVDb252ZXJzYXRpb25JZEluZm9DaGFuZ2UgPSB1c2VDYWxsYmFjaygoY2hhbmdlQ29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4ge1xuICAgIGlmIChhcHBJZCkge1xuICAgICAgbGV0IHByZXZWYWx1ZSA9IGNvbnZlcnNhdGlvbklkSW5mbz8uW2FwcElkIHx8ICcnXVxuICAgICAgaWYgKHR5cGVvZiBwcmV2VmFsdWUgPT09ICdzdHJpbmcnKVxuICAgICAgICBwcmV2VmFsdWUgPSB7fVxuICAgICAgc2V0Q29udmVyc2F0aW9uSWRJbmZvKHtcbiAgICAgICAgLi4uY29udmVyc2F0aW9uSWRJbmZvLFxuICAgICAgICBbYXBwSWQgfHwgJyddOiB7XG4gICAgICAgICAgLi4ucHJldlZhbHVlLFxuICAgICAgICAgIFt1c2VySWQgfHwgJ0RFRkFVTFQnXTogY2hhbmdlQ29udmVyc2F0aW9uSWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgfSwgW2FwcElkLCBjb252ZXJzYXRpb25JZEluZm8sIHNldENvbnZlcnNhdGlvbklkSW5mbywgdXNlcklkXSlcblxuICBjb25zdCBbbmV3Q29udmVyc2F0aW9uSWQsIHNldE5ld0NvbnZlcnNhdGlvbklkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBjaGF0U2hvdWxkUmVsb2FkS2V5ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGN1cnJlbnRDb252ZXJzYXRpb25JZCA9PT0gbmV3Q29udmVyc2F0aW9uSWQpXG4gICAgICByZXR1cm4gJydcblxuICAgIHJldHVybiBjdXJyZW50Q29udmVyc2F0aW9uSWRcbiAgfSwgW2N1cnJlbnRDb252ZXJzYXRpb25JZCwgbmV3Q29udmVyc2F0aW9uSWRdKVxuXG4gIGNvbnN0IHsgZGF0YTogYXBwUGlubmVkQ29udmVyc2F0aW9uRGF0YSB9ID0gdXNlU2hhcmVDb252ZXJzYXRpb25zKHtcbiAgICBpc0luc3RhbGxlZEFwcCxcbiAgICBhcHBJZCxcbiAgICBwaW5uZWQ6IHRydWUsXG4gICAgbGltaXQ6IDEwMCxcbiAgfSwge1xuICAgIGVuYWJsZWQ6ICEhYXBwSWQsXG4gICAgcmVmZXRjaE9uV2luZG93Rm9jdXM6IGZhbHNlLFxuICAgIHJlZmV0Y2hPblJlY29ubmVjdDogZmFsc2UsXG4gIH0pXG4gIGNvbnN0IHtcbiAgICBkYXRhOiBhcHBDb252ZXJzYXRpb25EYXRhLFxuICAgIGlzTG9hZGluZzogYXBwQ29udmVyc2F0aW9uRGF0YUxvYWRpbmcsXG4gIH0gPSB1c2VTaGFyZUNvbnZlcnNhdGlvbnMoe1xuICAgIGlzSW5zdGFsbGVkQXBwLFxuICAgIGFwcElkLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgbGltaXQ6IDEwMCxcbiAgfSwge1xuICAgIGVuYWJsZWQ6ICEhYXBwSWQsXG4gICAgcmVmZXRjaE9uV2luZG93Rm9jdXM6IGZhbHNlLFxuICAgIHJlZmV0Y2hPblJlY29ubmVjdDogZmFsc2UsXG4gIH0pXG4gIGNvbnN0IHtcbiAgICBkYXRhOiBhcHBDaGF0TGlzdERhdGEsXG4gICAgaXNMb2FkaW5nOiBhcHBDaGF0TGlzdERhdGFMb2FkaW5nLFxuICB9ID0gdXNlU2hhcmVDaGF0TGlzdCh7XG4gICAgY29udmVyc2F0aW9uSWQ6IGNoYXRTaG91bGRSZWxvYWRLZXksXG4gICAgaXNJbnN0YWxsZWRBcHAsXG4gICAgYXBwSWQsXG4gIH0sIHtcbiAgICBlbmFibGVkOiAhIWNoYXRTaG91bGRSZWxvYWRLZXksXG4gICAgcmVmZXRjaE9uV2luZG93Rm9jdXM6IGZhbHNlLFxuICAgIHJlZmV0Y2hPblJlY29ubmVjdDogZmFsc2UsXG4gIH0pXG4gIGNvbnN0IGludmFsaWRhdGVTaGFyZUNvbnZlcnNhdGlvbnMgPSB1c2VJbnZhbGlkYXRlU2hhcmVDb252ZXJzYXRpb25zKClcblxuICBjb25zdCBbY2xlYXJDaGF0TGlzdCwgc2V0Q2xlYXJDaGF0TGlzdF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2lzUmVzcG9uZGluZywgc2V0SXNSZXNwb25kaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBhcHBQcmV2Q2hhdFRyZWUgPSB1c2VNZW1vKFxuICAgICgpID0+IChjdXJyZW50Q29udmVyc2F0aW9uSWQgJiYgYXBwQ2hhdExpc3REYXRhPy5kYXRhLmxlbmd0aClcbiAgICAgID8gYnVpbGRDaGF0SXRlbVRyZWUoZ2V0Rm9ybWF0dGVkQ2hhdExpc3QoYXBwQ2hhdExpc3REYXRhLmRhdGEpKVxuICAgICAgOiBbXSxcbiAgICBbYXBwQ2hhdExpc3REYXRhLCBjdXJyZW50Q29udmVyc2F0aW9uSWRdLFxuICApXG5cbiAgY29uc3QgW3Nob3dOZXdDb252ZXJzYXRpb25JdGVtSW5MaXN0LCBzZXRTaG93TmV3Q29udmVyc2F0aW9uSXRlbUluTGlzdF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICBjb25zdCBwaW5uZWRDb252ZXJzYXRpb25MaXN0ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGFwcFBpbm5lZENvbnZlcnNhdGlvbkRhdGE/LmRhdGEgfHwgW11cbiAgfSwgW2FwcFBpbm5lZENvbnZlcnNhdGlvbkRhdGFdKVxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgbmV3Q29udmVyc2F0aW9uSW5wdXRzUmVmID0gdXNlUmVmPFJlY29yZDxzdHJpbmcsIGFueT4+KHt9KVxuICBjb25zdCBbbmV3Q29udmVyc2F0aW9uSW5wdXRzLCBzZXROZXdDb252ZXJzYXRpb25JbnB1dHNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55Pj4oe30pXG4gIGNvbnN0IFtpbml0SW5wdXRzLCBzZXRJbml0SW5wdXRzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIGFueT4+KHt9KVxuICBjb25zdCBbaW5pdFVzZXJWYXJpYWJsZXMsIHNldEluaXRVc2VyVmFyaWFibGVzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIGFueT4+KHt9KVxuICBjb25zdCBoYW5kbGVOZXdDb252ZXJzYXRpb25JbnB1dHNDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3SW5wdXRzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgbmV3Q29udmVyc2F0aW9uSW5wdXRzUmVmLmN1cnJlbnQgPSBuZXdJbnB1dHNcbiAgICBzZXROZXdDb252ZXJzYXRpb25JbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbXSlcbiAgY29uc3QgaW5wdXRzRm9ybXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gKGFwcFBhcmFtcz8udXNlcl9pbnB1dF9mb3JtIHx8IFtdKS5maWx0ZXIoKGl0ZW06IGFueSkgPT4gIWl0ZW0uZXh0ZXJuYWxfZGF0YV90b29sKS5tYXAoKGl0ZW06IGFueSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ucGFyYWdyYXBoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGluaXRJbnB1dHNbaXRlbS5wYXJhZ3JhcGgudmFyaWFibGVdXG4gICAgICAgIGlmICh2YWx1ZSAmJiBpdGVtLnBhcmFncmFwaC5tYXhfbGVuZ3RoICYmIHZhbHVlLmxlbmd0aCA+IGl0ZW0ucGFyYWdyYXBoLm1heF9sZW5ndGgpXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCBpdGVtLnBhcmFncmFwaC5tYXhfbGVuZ3RoKVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbS5wYXJhZ3JhcGgsXG4gICAgICAgICAgZGVmYXVsdDogdmFsdWUgfHwgaXRlbS5kZWZhdWx0IHx8IGl0ZW0ucGFyYWdyYXBoLmRlZmF1bHQsXG4gICAgICAgICAgdHlwZTogJ3BhcmFncmFwaCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLm51bWJlcikge1xuICAgICAgICBjb25zdCBjb252ZXJ0ZWROdW1iZXIgPSBOdW1iZXIoaW5pdElucHV0c1tpdGVtLm51bWJlci52YXJpYWJsZV0pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbS5udW1iZXIsXG4gICAgICAgICAgZGVmYXVsdDogY29udmVydGVkTnVtYmVyIHx8IGl0ZW0uZGVmYXVsdCB8fCBpdGVtLm51bWJlci5kZWZhdWx0LFxuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLmNoZWNrYm94KSB7XG4gICAgICAgIGNvbnN0IHByZXNldCA9IGluaXRJbnB1dHNbaXRlbS5jaGVja2JveC52YXJpYWJsZV0gPT09IHRydWVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLmNoZWNrYm94LFxuICAgICAgICAgIGRlZmF1bHQ6IHByZXNldCB8fCBpdGVtLmRlZmF1bHQgfHwgaXRlbS5jaGVja2JveC5kZWZhdWx0LFxuICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc2VsZWN0KSB7XG4gICAgICAgIGNvbnN0IGlzSW5wdXRJbk9wdGlvbnMgPSBpdGVtLnNlbGVjdC5vcHRpb25zLmluY2x1ZGVzKGluaXRJbnB1dHNbaXRlbS5zZWxlY3QudmFyaWFibGVdKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0uc2VsZWN0LFxuICAgICAgICAgIGRlZmF1bHQ6IChpc0lucHV0SW5PcHRpb25zID8gaW5pdElucHV0c1tpdGVtLnNlbGVjdC52YXJpYWJsZV0gOiB1bmRlZmluZWQpIHx8IGl0ZW0uc2VsZWN0LmRlZmF1bHQsXG4gICAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bJ2ZpbGUtbGlzdCddKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbVsnZmlsZS1saXN0J10sXG4gICAgICAgICAgdHlwZTogJ2ZpbGUtbGlzdCcsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uZmlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0uZmlsZSxcbiAgICAgICAgICB0eXBlOiAnZmlsZScsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uanNvbl9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLmpzb25fb2JqZWN0LFxuICAgICAgICAgIHR5cGU6ICdqc29uX29iamVjdCcsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHZhbHVlID0gaW5pdElucHV0c1tpdGVtWyd0ZXh0LWlucHV0J10udmFyaWFibGVdXG4gICAgICBpZiAodmFsdWUgJiYgaXRlbVsndGV4dC1pbnB1dCddLm1heF9sZW5ndGggJiYgdmFsdWUubGVuZ3RoID4gaXRlbVsndGV4dC1pbnB1dCddLm1heF9sZW5ndGgpXG4gICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgaXRlbVsndGV4dC1pbnB1dCddLm1heF9sZW5ndGgpXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLml0ZW1bJ3RleHQtaW5wdXQnXSxcbiAgICAgICAgZGVmYXVsdDogdmFsdWUgfHwgaXRlbS5kZWZhdWx0IHx8IGl0ZW1bJ3RleHQtaW5wdXQnXS5kZWZhdWx0LFxuICAgICAgICB0eXBlOiAndGV4dC1pbnB1dCcsXG4gICAgICB9XG4gICAgfSlcbiAgfSwgW2luaXRJbnB1dHMsIGFwcFBhcmFtc10pXG5cbiAgY29uc3QgYWxsSW5wdXRzSGlkZGVuID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGlucHV0c0Zvcm1zLmxlbmd0aCA+IDAgJiYgaW5wdXRzRm9ybXMuZXZlcnkoaXRlbSA9PiBpdGVtLmhpZGUgPT09IHRydWUpXG4gIH0sIFtpbnB1dHNGb3Jtc10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBpbml0IGlucHV0cyBmcm9tIHVybCBwYXJhbXNcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXRzID0gYXdhaXQgZ2V0UmF3SW5wdXRzRnJvbVVybFBhcmFtcygpXG4gICAgICBjb25zdCB1c2VyVmFyaWFibGVzID0gYXdhaXQgZ2V0UmF3VXNlclZhcmlhYmxlc0Zyb21VcmxQYXJhbXMoKVxuICAgICAgc2V0SW5pdElucHV0cyhpbnB1dHMpXG4gICAgICBzZXRJbml0VXNlclZhcmlhYmxlcyh1c2VyVmFyaWFibGVzKVxuICAgIH0pKClcbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBjb252ZXJzYXRpb25JbnB1dHM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuXG4gICAgaW5wdXRzRm9ybXMuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb252ZXJzYXRpb25JbnB1dHNbaXRlbS52YXJpYWJsZV0gPSBpdGVtLmRlZmF1bHQgfHwgbnVsbFxuICAgIH0pXG4gICAgaGFuZGxlTmV3Q29udmVyc2F0aW9uSW5wdXRzQ2hhbmdlKGNvbnZlcnNhdGlvbklucHV0cylcbiAgfSwgW2hhbmRsZU5ld0NvbnZlcnNhdGlvbklucHV0c0NoYW5nZSwgaW5wdXRzRm9ybXNdKVxuXG4gIGNvbnN0IHsgZGF0YTogbmV3Q29udmVyc2F0aW9uIH0gPSB1c2VTaGFyZUNvbnZlcnNhdGlvbk5hbWUoe1xuICAgIGNvbnZlcnNhdGlvbklkOiBuZXdDb252ZXJzYXRpb25JZCxcbiAgICBpc0luc3RhbGxlZEFwcCxcbiAgICBhcHBJZCxcbiAgfSwge1xuICAgIHJlZmV0Y2hPbldpbmRvd0ZvY3VzOiBmYWxzZSxcbiAgfSlcbiAgY29uc3QgW29yaWdpbkNvbnZlcnNhdGlvbkxpc3QsIHNldE9yaWdpbkNvbnZlcnNhdGlvbkxpc3RdID0gdXNlU3RhdGU8Q29udmVyc2F0aW9uSXRlbVtdPihbXSlcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYXBwQ29udmVyc2F0aW9uRGF0YT8uZGF0YSAmJiAhYXBwQ29udmVyc2F0aW9uRGF0YUxvYWRpbmcpXG4gICAgICBzZXRPcmlnaW5Db252ZXJzYXRpb25MaXN0KGFwcENvbnZlcnNhdGlvbkRhdGE/LmRhdGEpXG4gIH0sIFthcHBDb252ZXJzYXRpb25EYXRhLCBhcHBDb252ZXJzYXRpb25EYXRhTG9hZGluZ10pXG4gIGNvbnN0IGNvbnZlcnNhdGlvbkxpc3QgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBkYXRhID0gb3JpZ2luQ29udmVyc2F0aW9uTGlzdC5zbGljZSgpXG5cbiAgICBpZiAoc2hvd05ld0NvbnZlcnNhdGlvbkl0ZW1Jbkxpc3QgJiYgZGF0YVswXT8uaWQgIT09ICcnKSB7XG4gICAgICBkYXRhLnVuc2hpZnQoe1xuICAgICAgICBpZDogJycsXG4gICAgICAgIG5hbWU6IHQoJ2NoYXQubmV3Q2hhdERlZmF1bHROYW1lJywgeyBuczogJ3NoYXJlJyB9KSxcbiAgICAgICAgaW5wdXRzOiB7fSxcbiAgICAgICAgaW50cm9kdWN0aW9uOiAnJyxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG4gIH0sIFtvcmlnaW5Db252ZXJzYXRpb25MaXN0LCBzaG93TmV3Q29udmVyc2F0aW9uSXRlbUluTGlzdCwgdF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobmV3Q29udmVyc2F0aW9uKSB7XG4gICAgICBzZXRPcmlnaW5Db252ZXJzYXRpb25MaXN0KHByb2R1Y2UoKGRyYWZ0KSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZHJhZnQuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5pZCA9PT0gbmV3Q29udmVyc2F0aW9uLmlkKVxuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKVxuICAgICAgICAgIGRyYWZ0W2luZGV4XSA9IG5ld0NvbnZlcnNhdGlvblxuICAgICAgICBlbHNlXG4gICAgICAgICAgZHJhZnQudW5zaGlmdChuZXdDb252ZXJzYXRpb24pXG4gICAgICB9KSlcbiAgICB9XG4gIH0sIFtuZXdDb252ZXJzYXRpb25dKVxuXG4gIGNvbnN0IGN1cnJlbnRDb252ZXJzYXRpb25JdGVtID0gdXNlTWVtbygoKSA9PiB7XG4gICAgbGV0IGNvbnZlcnNhdGlvbkl0ZW0gPSBjb252ZXJzYXRpb25MaXN0LmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBjdXJyZW50Q29udmVyc2F0aW9uSWQpXG5cbiAgICBpZiAoIWNvbnZlcnNhdGlvbkl0ZW0gJiYgcGlubmVkQ29udmVyc2F0aW9uTGlzdC5sZW5ndGgpXG4gICAgICBjb252ZXJzYXRpb25JdGVtID0gcGlubmVkQ29udmVyc2F0aW9uTGlzdC5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gY3VycmVudENvbnZlcnNhdGlvbklkKVxuXG4gICAgcmV0dXJuIGNvbnZlcnNhdGlvbkl0ZW1cbiAgfSwgW2NvbnZlcnNhdGlvbkxpc3QsIGN1cnJlbnRDb252ZXJzYXRpb25JZCwgcGlubmVkQ29udmVyc2F0aW9uTGlzdF0pXG5cbiAgY29uc3QgY3VycmVudENvbnZlcnNhdGlvbkxhdGVzdElucHV0cyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghY3VycmVudENvbnZlcnNhdGlvbklkIHx8ICFhcHBDaGF0TGlzdERhdGE/LmRhdGEubGVuZ3RoKVxuICAgICAgcmV0dXJuIG5ld0NvbnZlcnNhdGlvbklucHV0c1JlZi5jdXJyZW50IHx8IHt9XG4gICAgcmV0dXJuIGFwcENoYXRMaXN0RGF0YS5kYXRhLnNsaWNlKCkucG9wKCkuaW5wdXRzIHx8IHt9XG4gIH0sIFthcHBDaGF0TGlzdERhdGEsIGN1cnJlbnRDb252ZXJzYXRpb25JZF0pXG4gIGNvbnN0IFtjdXJyZW50Q29udmVyc2F0aW9uSW5wdXRzLCBzZXRDdXJyZW50Q29udmVyc2F0aW9uSW5wdXRzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIGFueT4+KGN1cnJlbnRDb252ZXJzYXRpb25MYXRlc3RJbnB1dHMgfHwge30pXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGN1cnJlbnRDb252ZXJzYXRpb25JdGVtKVxuICAgICAgc2V0Q3VycmVudENvbnZlcnNhdGlvbklucHV0cyhjdXJyZW50Q29udmVyc2F0aW9uTGF0ZXN0SW5wdXRzIHx8IHt9KVxuICB9LCBbY3VycmVudENvbnZlcnNhdGlvbkl0ZW0sIGN1cnJlbnRDb252ZXJzYXRpb25MYXRlc3RJbnB1dHNdKVxuXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VUb2FzdENvbnRleHQoKVxuICBjb25zdCBjaGVja0lucHV0c1JlcXVpcmVkID0gdXNlQ2FsbGJhY2soKHNpbGVudD86IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoYWxsSW5wdXRzSGlkZGVuKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIGxldCBoYXNFbXB0eUlucHV0ID0gJydcbiAgICBsZXQgZmlsZUlzVXBsb2FkaW5nID0gZmFsc2VcbiAgICBjb25zdCByZXF1aXJlZFZhcnMgPSBpbnB1dHNGb3Jtcy5maWx0ZXIoKHsgcmVxdWlyZWQsIHR5cGUgfSkgPT4gcmVxdWlyZWQgJiYgdHlwZSAhPT0gSW5wdXRWYXJUeXBlLmNoZWNrYm94KVxuICAgIGlmIChyZXF1aXJlZFZhcnMubGVuZ3RoKSB7XG4gICAgICByZXF1aXJlZFZhcnMuZm9yRWFjaCgoeyB2YXJpYWJsZSwgbGFiZWwsIHR5cGUgfSkgPT4ge1xuICAgICAgICBpZiAoaGFzRW1wdHlJbnB1dClcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAoZmlsZUlzVXBsb2FkaW5nKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICghbmV3Q29udmVyc2F0aW9uSW5wdXRzUmVmLmN1cnJlbnRbdmFyaWFibGVdICYmICFzaWxlbnQpXG4gICAgICAgICAgaGFzRW1wdHlJbnB1dCA9IGxhYmVsIGFzIHN0cmluZ1xuXG4gICAgICAgIGlmICgodHlwZSA9PT0gSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUgfHwgdHlwZSA9PT0gSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMpICYmIG5ld0NvbnZlcnNhdGlvbklucHV0c1JlZi5jdXJyZW50W3ZhcmlhYmxlXSAmJiAhc2lsZW50KSB7XG4gICAgICAgICAgY29uc3QgZmlsZXMgPSBuZXdDb252ZXJzYXRpb25JbnB1dHNSZWYuY3VycmVudFt2YXJpYWJsZV1cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmaWxlcykpXG4gICAgICAgICAgICBmaWxlSXNVcGxvYWRpbmcgPSBmaWxlcy5maW5kKGl0ZW0gPT4gaXRlbS50cmFuc2Zlck1ldGhvZCA9PT0gVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSAmJiAhaXRlbS51cGxvYWRlZElkKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZpbGVJc1VwbG9hZGluZyA9IGZpbGVzLnRyYW5zZmVyTWV0aG9kID09PSBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlICYmICFmaWxlcy51cGxvYWRlZElkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGhhc0VtcHR5SW5wdXQpIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2Vycm9yTWVzc2FnZS52YWx1ZU9mVmFyUmVxdWlyZWQnLCB7IG5zOiAnYXBwRGVidWcnLCBrZXk6IGhhc0VtcHR5SW5wdXQgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChmaWxlSXNVcGxvYWRpbmcpIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdpbmZvJywgbWVzc2FnZTogdCgnZXJyb3JNZXNzYWdlLndhaXRGb3JGaWxlVXBsb2FkJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfSwgW2lucHV0c0Zvcm1zLCBub3RpZnksIHQsIGFsbElucHV0c0hpZGRlbl0pXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2hhdCA9IHVzZUNhbGxiYWNrKChjYWxsYmFjazogYW55KSA9PiB7XG4gICAgaWYgKGNoZWNrSW5wdXRzUmVxdWlyZWQoKSkge1xuICAgICAgc2V0U2hvd05ld0NvbnZlcnNhdGlvbkl0ZW1Jbkxpc3QodHJ1ZSlcbiAgICAgIGNhbGxiYWNrPy4oKVxuICAgIH1cbiAgfSwgW3NldFNob3dOZXdDb252ZXJzYXRpb25JdGVtSW5MaXN0LCBjaGVja0lucHV0c1JlcXVpcmVkXSlcbiAgY29uc3QgY3VycmVudENoYXRJbnN0YW5jZVJlZiA9IHVzZVJlZjx7IGhhbmRsZVN0b3A6ICgpID0+IHZvaWQgfT4oeyBoYW5kbGVTdG9wOiBub29wIH0pXG4gIGNvbnN0IGhhbmRsZUNoYW5nZUNvbnZlcnNhdGlvbiA9IHVzZUNhbGxiYWNrKChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB7XG4gICAgY3VycmVudENoYXRJbnN0YW5jZVJlZi5jdXJyZW50LmhhbmRsZVN0b3AoKVxuICAgIHNldE5ld0NvbnZlcnNhdGlvbklkKCcnKVxuICAgIGhhbmRsZUNvbnZlcnNhdGlvbklkSW5mb0NoYW5nZShjb252ZXJzYXRpb25JZClcbiAgICBpZiAoY29udmVyc2F0aW9uSWQpXG4gICAgICBzZXRDbGVhckNoYXRMaXN0KGZhbHNlKVxuICB9LCBbaGFuZGxlQ29udmVyc2F0aW9uSWRJbmZvQ2hhbmdlLCBzZXRDbGVhckNoYXRMaXN0XSlcbiAgY29uc3QgaGFuZGxlTmV3Q29udmVyc2F0aW9uID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGN1cnJlbnRDaGF0SW5zdGFuY2VSZWYuY3VycmVudC5oYW5kbGVTdG9wKClcbiAgICBzZXRTaG93TmV3Q29udmVyc2F0aW9uSXRlbUluTGlzdCh0cnVlKVxuICAgIGhhbmRsZUNoYW5nZUNvbnZlcnNhdGlvbignJylcbiAgICBjb25zdCBjb252ZXJzYXRpb25JbnB1dHM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuICAgIGlucHV0c0Zvcm1zLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgY29udmVyc2F0aW9uSW5wdXRzW2l0ZW0udmFyaWFibGVdID0gaXRlbS5kZWZhdWx0IHx8IG51bGxcbiAgICB9KVxuICAgIGhhbmRsZU5ld0NvbnZlcnNhdGlvbklucHV0c0NoYW5nZShjb252ZXJzYXRpb25JbnB1dHMpXG4gICAgc2V0Q2xlYXJDaGF0TGlzdCh0cnVlKVxuICB9LCBbaGFuZGxlQ2hhbmdlQ29udmVyc2F0aW9uLCBzZXRTaG93TmV3Q29udmVyc2F0aW9uSXRlbUluTGlzdCwgaGFuZGxlTmV3Q29udmVyc2F0aW9uSW5wdXRzQ2hhbmdlLCBzZXRDbGVhckNoYXRMaXN0LCBpbnB1dHNGb3Jtc10pXG4gIGNvbnN0IGhhbmRsZVVwZGF0ZUNvbnZlcnNhdGlvbkxpc3QgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaW52YWxpZGF0ZVNoYXJlQ29udmVyc2F0aW9ucygpXG4gIH0sIFtpbnZhbGlkYXRlU2hhcmVDb252ZXJzYXRpb25zXSlcblxuICBjb25zdCBoYW5kbGVQaW5Db252ZXJzYXRpb24gPSB1c2VDYWxsYmFjayhhc3luYyAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4ge1xuICAgIGF3YWl0IHBpbkNvbnZlcnNhdGlvbihpc0luc3RhbGxlZEFwcCwgYXBwSWQsIGNvbnZlcnNhdGlvbklkKVxuICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYXBpLnN1Y2Nlc3MnLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgIGhhbmRsZVVwZGF0ZUNvbnZlcnNhdGlvbkxpc3QoKVxuICB9LCBbaXNJbnN0YWxsZWRBcHAsIGFwcElkLCBub3RpZnksIHQsIGhhbmRsZVVwZGF0ZUNvbnZlcnNhdGlvbkxpc3RdKVxuXG4gIGNvbnN0IGhhbmRsZVVucGluQ29udmVyc2F0aW9uID0gdXNlQ2FsbGJhY2soYXN5bmMgKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHtcbiAgICBhd2FpdCB1bnBpbkNvbnZlcnNhdGlvbihpc0luc3RhbGxlZEFwcCwgYXBwSWQsIGNvbnZlcnNhdGlvbklkKVxuICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYXBpLnN1Y2Nlc3MnLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgIGhhbmRsZVVwZGF0ZUNvbnZlcnNhdGlvbkxpc3QoKVxuICB9LCBbaXNJbnN0YWxsZWRBcHAsIGFwcElkLCBub3RpZnksIHQsIGhhbmRsZVVwZGF0ZUNvbnZlcnNhdGlvbkxpc3RdKVxuXG4gIGNvbnN0IFtjb252ZXJzYXRpb25EZWxldGluZywgc2V0Q29udmVyc2F0aW9uRGVsZXRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGhhbmRsZURlbGV0ZUNvbnZlcnNhdGlvbiA9IHVzZUNhbGxiYWNrKGFzeW5jIChcbiAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICAgIHtcbiAgICAgIG9uU3VjY2VzcyxcbiAgICB9OiBDYWxsYmFjayxcbiAgKSA9PiB7XG4gICAgaWYgKGNvbnZlcnNhdGlvbkRlbGV0aW5nKVxuICAgICAgcmV0dXJuXG5cbiAgICB0cnkge1xuICAgICAgc2V0Q29udmVyc2F0aW9uRGVsZXRpbmcodHJ1ZSlcbiAgICAgIGF3YWl0IGRlbENvbnZlcnNhdGlvbihpc0luc3RhbGxlZEFwcCwgYXBwSWQsIGNvbnZlcnNhdGlvbklkKVxuICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhcGkuc3VjY2VzcycsIHsgbnM6ICdjb21tb24nIH0pIH0pXG4gICAgICBvblN1Y2Nlc3MoKVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIHNldENvbnZlcnNhdGlvbkRlbGV0aW5nKGZhbHNlKVxuICAgIH1cblxuICAgIGlmIChjb252ZXJzYXRpb25JZCA9PT0gY3VycmVudENvbnZlcnNhdGlvbklkKVxuICAgICAgaGFuZGxlTmV3Q29udmVyc2F0aW9uKClcblxuICAgIGhhbmRsZVVwZGF0ZUNvbnZlcnNhdGlvbkxpc3QoKVxuICB9LCBbaXNJbnN0YWxsZWRBcHAsIGFwcElkLCBub3RpZnksIHQsIGhhbmRsZVVwZGF0ZUNvbnZlcnNhdGlvbkxpc3QsIGhhbmRsZU5ld0NvbnZlcnNhdGlvbiwgY3VycmVudENvbnZlcnNhdGlvbklkLCBjb252ZXJzYXRpb25EZWxldGluZ10pXG5cbiAgY29uc3QgW2NvbnZlcnNhdGlvblJlbmFtaW5nLCBzZXRDb252ZXJzYXRpb25SZW5hbWluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgaGFuZGxlUmVuYW1lQ29udmVyc2F0aW9uID0gdXNlQ2FsbGJhY2soYXN5bmMgKFxuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gICAgbmV3TmFtZTogc3RyaW5nLFxuICAgIHtcbiAgICAgIG9uU3VjY2VzcyxcbiAgICB9OiBDYWxsYmFjayxcbiAgKSA9PiB7XG4gICAgaWYgKGNvbnZlcnNhdGlvblJlbmFtaW5nKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAoIW5ld05hbWUudHJpbSgpKSB7XG4gICAgICBub3RpZnkoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiB0KCdjaGF0LmNvbnZlcnNhdGlvbk5hbWVDYW5Ob3RFbXB0eScsIHsgbnM6ICdjb21tb24nIH0pLFxuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldENvbnZlcnNhdGlvblJlbmFtaW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHJlbmFtZUNvbnZlcnNhdGlvbihpc0luc3RhbGxlZEFwcCwgYXBwSWQsIGNvbnZlcnNhdGlvbklkLCBuZXdOYW1lKVxuXG4gICAgICBub3RpZnkoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6IHQoJ2FjdGlvbk1zZy5tb2RpZmllZFN1Y2Nlc3NmdWxseScsIHsgbnM6ICdjb21tb24nIH0pLFxuICAgICAgfSlcbiAgICAgIHNldE9yaWdpbkNvbnZlcnNhdGlvbkxpc3QocHJvZHVjZSgoZHJhZnQpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBvcmlnaW5Db252ZXJzYXRpb25MaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGNvbnZlcnNhdGlvbklkKVxuICAgICAgICBjb25zdCBpdGVtID0gZHJhZnRbaW5kZXhdXG5cbiAgICAgICAgZHJhZnRbaW5kZXhdID0ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgbmFtZTogbmV3TmFtZSxcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgICBvblN1Y2Nlc3MoKVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIHNldENvbnZlcnNhdGlvblJlbmFtaW5nKGZhbHNlKVxuICAgIH1cbiAgfSwgW2lzSW5zdGFsbGVkQXBwLCBhcHBJZCwgbm90aWZ5LCB0LCBjb252ZXJzYXRpb25SZW5hbWluZywgb3JpZ2luQ29udmVyc2F0aW9uTGlzdF0pXG5cbiAgY29uc3QgaGFuZGxlTmV3Q29udmVyc2F0aW9uQ29tcGxldGVkID0gdXNlQ2FsbGJhY2soKG5ld0NvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHtcbiAgICBzZXROZXdDb252ZXJzYXRpb25JZChuZXdDb252ZXJzYXRpb25JZClcbiAgICBoYW5kbGVDb252ZXJzYXRpb25JZEluZm9DaGFuZ2UobmV3Q29udmVyc2F0aW9uSWQpXG4gICAgc2V0U2hvd05ld0NvbnZlcnNhdGlvbkl0ZW1Jbkxpc3QoZmFsc2UpXG4gICAgaW52YWxpZGF0ZVNoYXJlQ29udmVyc2F0aW9ucygpXG4gIH0sIFtoYW5kbGVDb252ZXJzYXRpb25JZEluZm9DaGFuZ2UsIGludmFsaWRhdGVTaGFyZUNvbnZlcnNhdGlvbnNdKVxuXG4gIGNvbnN0IGhhbmRsZUZlZWRiYWNrID0gdXNlQ2FsbGJhY2soYXN5bmMgKG1lc3NhZ2VJZDogc3RyaW5nLCBmZWVkYmFjazogRmVlZGJhY2spID0+IHtcbiAgICBhd2FpdCB1cGRhdGVGZWVkYmFjayh7IHVybDogYC9tZXNzYWdlcy8ke21lc3NhZ2VJZH0vZmVlZGJhY2tzYCwgYm9keTogeyByYXRpbmc6IGZlZWRiYWNrLnJhdGluZywgY29udGVudDogZmVlZGJhY2suY29udGVudCB9IH0sIGlzSW5zdGFsbGVkQXBwLCBhcHBJZClcbiAgICBub3RpZnkoeyB0eXBlOiAnc3VjY2VzcycsIG1lc3NhZ2U6IHQoJ2FwaS5zdWNjZXNzJywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgfSwgW2lzSW5zdGFsbGVkQXBwLCBhcHBJZCwgdCwgbm90aWZ5XSlcblxuICByZXR1cm4ge1xuICAgIGlzSW5zdGFsbGVkQXBwLFxuICAgIGFwcElkLFxuICAgIGN1cnJlbnRDb252ZXJzYXRpb25JZCxcbiAgICBjdXJyZW50Q29udmVyc2F0aW9uSXRlbSxcbiAgICBoYW5kbGVDb252ZXJzYXRpb25JZEluZm9DaGFuZ2UsXG4gICAgYXBwRGF0YSxcbiAgICBhcHBQYXJhbXM6IGFwcFBhcmFtcyB8fCB7fSBhcyBDaGF0Q29uZmlnLFxuICAgIGFwcE1ldGEsXG4gICAgYXBwUGlubmVkQ29udmVyc2F0aW9uRGF0YSxcbiAgICBhcHBDb252ZXJzYXRpb25EYXRhLFxuICAgIGFwcENvbnZlcnNhdGlvbkRhdGFMb2FkaW5nLFxuICAgIGFwcENoYXRMaXN0RGF0YSxcbiAgICBhcHBDaGF0TGlzdERhdGFMb2FkaW5nLFxuICAgIGFwcFByZXZDaGF0VHJlZSxcbiAgICBwaW5uZWRDb252ZXJzYXRpb25MaXN0LFxuICAgIGNvbnZlcnNhdGlvbkxpc3QsXG4gICAgc2V0U2hvd05ld0NvbnZlcnNhdGlvbkl0ZW1Jbkxpc3QsXG4gICAgbmV3Q29udmVyc2F0aW9uSW5wdXRzLFxuICAgIG5ld0NvbnZlcnNhdGlvbklucHV0c1JlZixcbiAgICBoYW5kbGVOZXdDb252ZXJzYXRpb25JbnB1dHNDaGFuZ2UsXG4gICAgaW5wdXRzRm9ybXMsXG4gICAgaGFuZGxlTmV3Q29udmVyc2F0aW9uLFxuICAgIGhhbmRsZVN0YXJ0Q2hhdCxcbiAgICBoYW5kbGVDaGFuZ2VDb252ZXJzYXRpb24sXG4gICAgaGFuZGxlUGluQ29udmVyc2F0aW9uLFxuICAgIGhhbmRsZVVucGluQ29udmVyc2F0aW9uLFxuICAgIGNvbnZlcnNhdGlvbkRlbGV0aW5nLFxuICAgIGhhbmRsZURlbGV0ZUNvbnZlcnNhdGlvbixcbiAgICBjb252ZXJzYXRpb25SZW5hbWluZyxcbiAgICBoYW5kbGVSZW5hbWVDb252ZXJzYXRpb24sXG4gICAgaGFuZGxlTmV3Q29udmVyc2F0aW9uQ29tcGxldGVkLFxuICAgIG5ld0NvbnZlcnNhdGlvbklkLFxuICAgIGNoYXRTaG91bGRSZWxvYWRLZXksXG4gICAgaGFuZGxlRmVlZGJhY2ssXG4gICAgY3VycmVudENoYXRJbnN0YW5jZVJlZixcbiAgICBzaWRlYmFyQ29sbGFwc2VTdGF0ZSxcbiAgICBoYW5kbGVTaWRlYmFyQ29sbGFwc2UsXG4gICAgY2xlYXJDaGF0TGlzdCxcbiAgICBzZXRDbGVhckNoYXRMaXN0LFxuICAgIGlzUmVzcG9uZGluZyxcbiAgICBzZXRJc1Jlc3BvbmRpbmcsXG4gICAgY3VycmVudENvbnZlcnNhdGlvbklucHV0cyxcbiAgICBzZXRDdXJyZW50Q29udmVyc2F0aW9uSW5wdXRzLFxuICAgIGFsbElucHV0c0hpZGRlbixcbiAgICBpbml0VXNlclZhcmlhYmxlcyxcbiAgfVxufVxuIl19