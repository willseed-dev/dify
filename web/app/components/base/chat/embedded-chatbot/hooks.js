"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEmbeddedChatbot = void 0;
const ahooks_1 = require("ahooks");
const function_1 = require("es-toolkit/function");
const immer_1 = require("immer");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const toast_1 = require("@/app/components/base/toast");
const utils_1 = require("@/app/components/tools/utils");
const types_1 = require("@/app/components/workflow/types");
const web_app_context_1 = require("@/context/web-app-context");
const client_1 = require("@/i18n-config/client");
const share_1 = require("@/service/share");
const use_share_1 = require("@/service/use-share");
const app_1 = require("@/types/app");
const utils_2 = require("../../file-uploader/utils");
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
            message_files: (0, utils_2.getProcessedFilesFromResponse)(questionFiles.map((item) => ({ ...item, related_id: item.id }))),
            parentMessageId: item.parent_message_id || undefined,
        });
        const answerFiles = item.message_files?.filter((file) => file.belongs_to === 'assistant') || [];
        newChatList.push({
            id: item.id,
            content: item.answer,
            agent_thoughts: (0, utils_1.addFileInfos)(item.agent_thoughts ? (0, utils_1.sortAgentSorts)(item.agent_thoughts) : item.agent_thoughts, item.message_files),
            feedback: item.feedback,
            isAnswer: true,
            citation: item.retriever_resources,
            message_files: (0, utils_2.getProcessedFilesFromResponse)(answerFiles.map((item) => ({ ...item, related_id: item.id }))),
            parentMessageId: `question-${item.id}`,
        });
    });
    return newChatList;
}
const useEmbeddedChatbot = () => {
    const isInstalledApp = false;
    const appInfo = (0, web_app_context_1.useWebAppStore)(s => s.appInfo);
    const appMeta = (0, web_app_context_1.useWebAppStore)(s => s.appMeta);
    const appParams = (0, web_app_context_1.useWebAppStore)(s => s.appParams);
    const embeddedConversationId = (0, web_app_context_1.useWebAppStore)(s => s.embeddedConversationId);
    const embeddedUserId = (0, web_app_context_1.useWebAppStore)(s => s.embeddedUserId);
    const appId = (0, react_1.useMemo)(() => appInfo?.app_id, [appInfo]);
    const [userId, setUserId] = (0, react_1.useState)();
    const [conversationId, setConversationId] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        setUserId(embeddedUserId || undefined);
    }, [embeddedUserId]);
    (0, react_1.useEffect)(() => {
        setConversationId(embeddedConversationId || undefined);
    }, [embeddedConversationId]);
    (0, react_1.useEffect)(() => {
        const setLanguageFromParams = async () => {
            // Check URL parameters for language override
            const urlParams = new URLSearchParams(window.location.search);
            const localeParam = urlParams.get('locale');
            // Check for encoded system variables
            const systemVariables = await (0, utils_3.getProcessedSystemVariablesFromUrlParams)();
            const localeFromSysVar = systemVariables.locale;
            if (localeParam) {
                // If locale parameter exists in URL, use it instead of default
                await (0, client_1.changeLanguage)(localeParam);
            }
            else if (localeFromSysVar) {
                // If locale is set as a system variable, use that
                await (0, client_1.changeLanguage)(localeFromSysVar);
            }
            else if (appInfo?.site.default_language) {
                // Otherwise use the default from app config
                await (0, client_1.changeLanguage)(appInfo.site.default_language);
            }
        };
        setLanguageFromParams();
    }, [appInfo]);
    const [conversationIdInfo, setConversationIdInfo] = (0, ahooks_1.useLocalStorageState)(constants_1.CONVERSATION_ID_INFO, {
        defaultValue: {},
    });
    const allowResetChat = !conversationId;
    const currentConversationId = (0, react_1.useMemo)(() => conversationIdInfo?.[appId || '']?.[userId || 'DEFAULT'] || conversationId || '', [appId, conversationIdInfo, userId, conversationId]);
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
    });
    const { data: appConversationData, isLoading: appConversationDataLoading, } = (0, use_share_1.useShareConversations)({
        isInstalledApp,
        appId,
        pinned: false,
        limit: 100,
    });
    const { data: appChatListData, isLoading: appChatListDataLoading, } = (0, use_share_1.useShareChatList)({
        conversationId: chatShouldReloadKey,
        isInstalledApp,
        appId,
    });
    const invalidateShareConversations = (0, use_share_1.useInvalidateShareConversations)();
    const [clearChatList, setClearChatList] = (0, react_1.useState)(false);
    const [isResponding, setIsResponding] = (0, react_1.useState)(false);
    const appPrevChatList = (0, react_1.useMemo)(() => (currentConversationId && appChatListData?.data.length)
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
            const inputs = await (0, utils_3.getProcessedInputsFromUrlParams)();
            const userVariables = await (0, utils_3.getProcessedUserVariablesFromUrlParams)();
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
        handleNewConversationInputsChange(await (0, utils_3.getProcessedInputsFromUrlParams)());
        setClearChatList(true);
    }, [handleChangeConversation, setShowNewConversationItemInList, handleNewConversationInputsChange, setClearChatList]);
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
        allowResetChat,
        appId,
        currentConversationId,
        currentConversationItem,
        handleConversationIdInfoChange,
        appData: appInfo,
        appParams: appParams || {},
        appMeta,
        appPinnedConversationData,
        appConversationData,
        appConversationDataLoading,
        appChatListData,
        appChatListDataLoading,
        appPrevChatList,
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
        handleNewConversationCompleted,
        newConversationId,
        chatShouldReloadKey,
        handleFeedback,
        currentChatInstanceRef,
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
exports.useEmbeddedChatbot = useEmbeddedChatbot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBVUEsbUNBQTZDO0FBQzdDLGtEQUEwQztBQUMxQyxpQ0FBK0I7QUFDL0IsaUNBTWM7QUFDZCxpREFBOEM7QUFDOUMsdURBQTZEO0FBQzdELHdEQUEyRTtBQUMzRSwyREFBOEQ7QUFDOUQsK0RBQTBEO0FBQzFELGlEQUFxRDtBQUNyRCwyQ0FBZ0Q7QUFDaEQsbURBSzRCO0FBQzVCLHFDQUE0QztBQUM1QyxxREFBeUU7QUFDekUsNENBQW1EO0FBQ25ELG9DQUErSjtBQUUvSixTQUFTLG9CQUFvQixDQUFDLFFBQWU7SUFDM0MsTUFBTSxXQUFXLEdBQWUsRUFBRSxDQUFBO0lBQ2xDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUN4QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDakcsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNmLEVBQUUsRUFBRSxZQUFZLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDekIsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ25CLFFBQVEsRUFBRSxLQUFLO1lBQ2YsYUFBYSxFQUFFLElBQUEscUNBQTZCLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xILGVBQWUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLElBQUksU0FBUztTQUNyRCxDQUFDLENBQUE7UUFDRixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FB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QjtRQUMxQixlQUFlO1FBQ2Ysc0JBQXNCO1FBQ3RCLGVBQWU7UUFDZixzQkFBc0I7UUFDdEIsZ0JBQWdCO1FBQ2hCLGdDQUFnQztRQUNoQyxxQkFBcUI7UUFDckIsd0JBQXdCO1FBQ3hCLGlDQUFpQztRQUNqQyxXQUFXO1FBQ1gscUJBQXFCO1FBQ3JCLGVBQWU7UUFDZix3QkFBd0I7UUFDeEIsOEJBQThCO1FBQzlCLGlCQUFpQjtRQUNqQixtQkFBbUI7UUFDbkIsY0FBYztRQUNkLHNCQUFzQjtRQUN0QixhQUFhO1FBQ2IsZ0JBQWdCO1FBQ2hCLFlBQVk7UUFDWixlQUFlO1FBQ2YseUJBQXlCO1FBQ3pCLDRCQUE0QjtRQUM1QixlQUFlO1FBQ2YsaUJBQWlCO0tBQ2xCLENBQUE7QUFDSCxDQUFDLENBQUE7QUF4WVksUUFBQSxrQkFBa0Isc0JBd1k5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgQ2hhdENvbmZpZyxcbiAgQ2hhdEl0ZW0sXG4gIEZlZWRiYWNrLFxufSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgTG9jYWxlIH0gZnJvbSAnQC9pMThuLWNvbmZpZydcbmltcG9ydCB0eXBlIHtcbiAgLy8gQXBwRGF0YSxcbiAgQ29udmVyc2F0aW9uSXRlbSxcbn0gZnJvbSAnQC9tb2RlbHMvc2hhcmUnXG5pbXBvcnQgeyB1c2VMb2NhbFN0b3JhZ2VTdGF0ZSB9IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdlcy10b29sa2l0L2Z1bmN0aW9uJ1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHtcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VUb2FzdENvbnRleHQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBhZGRGaWxlSW5mb3MsIHNvcnRBZ2VudFNvcnRzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy90b29scy91dGlscydcbmltcG9ydCB7IElucHV0VmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyB1c2VXZWJBcHBTdG9yZSB9IGZyb20gJ0AvY29udGV4dC93ZWItYXBwLWNvbnRleHQnXG5pbXBvcnQgeyBjaGFuZ2VMYW5ndWFnZSB9IGZyb20gJ0AvaTE4bi1jb25maWcvY2xpZW50J1xuaW1wb3J0IHsgdXBkYXRlRmVlZGJhY2sgfSBmcm9tICdAL3NlcnZpY2Uvc2hhcmUnXG5pbXBvcnQge1xuICB1c2VJbnZhbGlkYXRlU2hhcmVDb252ZXJzYXRpb25zLFxuICB1c2VTaGFyZUNoYXRMaXN0LFxuICB1c2VTaGFyZUNvbnZlcnNhdGlvbk5hbWUsXG4gIHVzZVNoYXJlQ29udmVyc2F0aW9ucyxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1zaGFyZSdcbmltcG9ydCB7IFRyYW5zZmVyTWV0aG9kIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZSB9IGZyb20gJy4uLy4uL2ZpbGUtdXBsb2FkZXIvdXRpbHMnXG5pbXBvcnQgeyBDT05WRVJTQVRJT05fSURfSU5GTyB9IGZyb20gJy4uL2NvbnN0YW50cydcbmltcG9ydCB7IGJ1aWxkQ2hhdEl0ZW1UcmVlLCBnZXRQcm9jZXNzZWRJbnB1dHNGcm9tVXJsUGFyYW1zLCBnZXRQcm9jZXNzZWRTeXN0ZW1WYXJpYWJsZXNGcm9tVXJsUGFyYW1zLCBnZXRQcm9jZXNzZWRVc2VyVmFyaWFibGVzRnJvbVVybFBhcmFtcyB9IGZyb20gJy4uL3V0aWxzJ1xuXG5mdW5jdGlvbiBnZXRGb3JtYXR0ZWRDaGF0TGlzdChtZXNzYWdlczogYW55W10pIHtcbiAgY29uc3QgbmV3Q2hhdExpc3Q6IENoYXRJdGVtW10gPSBbXVxuICBtZXNzYWdlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgY29uc3QgcXVlc3Rpb25GaWxlcyA9IGl0ZW0ubWVzc2FnZV9maWxlcz8uZmlsdGVyKChmaWxlOiBhbnkpID0+IGZpbGUuYmVsb25nc190byA9PT0gJ3VzZXInKSB8fCBbXVxuICAgIG5ld0NoYXRMaXN0LnB1c2goe1xuICAgICAgaWQ6IGBxdWVzdGlvbi0ke2l0ZW0uaWR9YCxcbiAgICAgIGNvbnRlbnQ6IGl0ZW0ucXVlcnksXG4gICAgICBpc0Fuc3dlcjogZmFsc2UsXG4gICAgICBtZXNzYWdlX2ZpbGVzOiBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZShxdWVzdGlvbkZpbGVzLm1hcCgoaXRlbTogYW55KSA9PiAoeyAuLi5pdGVtLCByZWxhdGVkX2lkOiBpdGVtLmlkIH0pKSksXG4gICAgICBwYXJlbnRNZXNzYWdlSWQ6IGl0ZW0ucGFyZW50X21lc3NhZ2VfaWQgfHwgdW5kZWZpbmVkLFxuICAgIH0pXG4gICAgY29uc3QgYW5zd2VyRmlsZXMgPSBpdGVtLm1lc3NhZ2VfZmlsZXM/LmZpbHRlcigoZmlsZTogYW55KSA9PiBmaWxlLmJlbG9uZ3NfdG8gPT09ICdhc3Npc3RhbnQnKSB8fCBbXVxuICAgIG5ld0NoYXRMaXN0LnB1c2goe1xuICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICBjb250ZW50OiBpdGVtLmFuc3dlcixcbiAgICAgIGFnZW50X3Rob3VnaHRzOiBhZGRGaWxlSW5mb3MoaXRlbS5hZ2VudF90aG91Z2h0cyA/IHNvcnRBZ2VudFNvcnRzKGl0ZW0uYWdlbnRfdGhvdWdodHMpIDogaXRlbS5hZ2VudF90aG91Z2h0cywgaXRlbS5tZXNzYWdlX2ZpbGVzKSxcbiAgICAgIGZlZWRiYWNrOiBpdGVtLmZlZWRiYWNrLFxuICAgICAgaXNBbnN3ZXI6IHRydWUsXG4gICAgICBjaXRhdGlvbjogaXRlbS5yZXRyaWV2ZXJfcmVzb3VyY2VzLFxuICAgICAgbWVzc2FnZV9maWxlczogZ2V0UHJvY2Vzc2VkRmlsZXNGcm9tUmVzcG9uc2UoYW5zd2VyRmlsZXMubWFwKChpdGVtOiBhbnkpID0+ICh7IC4uLml0ZW0sIHJlbGF0ZWRfaWQ6IGl0ZW0uaWQgfSkpKSxcbiAgICAgIHBhcmVudE1lc3NhZ2VJZDogYHF1ZXN0aW9uLSR7aXRlbS5pZH1gLFxuICAgIH0pXG4gIH0pXG4gIHJldHVybiBuZXdDaGF0TGlzdFxufVxuXG5leHBvcnQgY29uc3QgdXNlRW1iZWRkZWRDaGF0Ym90ID0gKCkgPT4ge1xuICBjb25zdCBpc0luc3RhbGxlZEFwcCA9IGZhbHNlXG4gIGNvbnN0IGFwcEluZm8gPSB1c2VXZWJBcHBTdG9yZShzID0+IHMuYXBwSW5mbylcbiAgY29uc3QgYXBwTWV0YSA9IHVzZVdlYkFwcFN0b3JlKHMgPT4gcy5hcHBNZXRhKVxuICBjb25zdCBhcHBQYXJhbXMgPSB1c2VXZWJBcHBTdG9yZShzID0+IHMuYXBwUGFyYW1zKVxuICBjb25zdCBlbWJlZGRlZENvbnZlcnNhdGlvbklkID0gdXNlV2ViQXBwU3RvcmUocyA9PiBzLmVtYmVkZGVkQ29udmVyc2F0aW9uSWQpXG4gIGNvbnN0IGVtYmVkZGVkVXNlcklkID0gdXNlV2ViQXBwU3RvcmUocyA9PiBzLmVtYmVkZGVkVXNlcklkKVxuICBjb25zdCBhcHBJZCA9IHVzZU1lbW8oKCkgPT4gYXBwSW5mbz8uYXBwX2lkLCBbYXBwSW5mb10pXG5cbiAgY29uc3QgW3VzZXJJZCwgc2V0VXNlcklkXSA9IHVzZVN0YXRlPHN0cmluZz4oKVxuICBjb25zdCBbY29udmVyc2F0aW9uSWQsIHNldENvbnZlcnNhdGlvbklkXSA9IHVzZVN0YXRlPHN0cmluZz4oKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0VXNlcklkKGVtYmVkZGVkVXNlcklkIHx8IHVuZGVmaW5lZClcbiAgfSwgW2VtYmVkZGVkVXNlcklkXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldENvbnZlcnNhdGlvbklkKGVtYmVkZGVkQ29udmVyc2F0aW9uSWQgfHwgdW5kZWZpbmVkKVxuICB9LCBbZW1iZWRkZWRDb252ZXJzYXRpb25JZF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzZXRMYW5ndWFnZUZyb21QYXJhbXMgPSBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBDaGVjayBVUkwgcGFyYW1ldGVycyBmb3IgbGFuZ3VhZ2Ugb3ZlcnJpZGVcbiAgICAgIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcbiAgICAgIGNvbnN0IGxvY2FsZVBhcmFtID0gdXJsUGFyYW1zLmdldCgnbG9jYWxlJylcblxuICAgICAgLy8gQ2hlY2sgZm9yIGVuY29kZWQgc3lzdGVtIHZhcmlhYmxlc1xuICAgICAgY29uc3Qgc3lzdGVtVmFyaWFibGVzID0gYXdhaXQgZ2V0UHJvY2Vzc2VkU3lzdGVtVmFyaWFibGVzRnJvbVVybFBhcmFtcygpXG4gICAgICBjb25zdCBsb2NhbGVGcm9tU3lzVmFyID0gc3lzdGVtVmFyaWFibGVzLmxvY2FsZVxuXG4gICAgICBpZiAobG9jYWxlUGFyYW0pIHtcbiAgICAgICAgLy8gSWYgbG9jYWxlIHBhcmFtZXRlciBleGlzdHMgaW4gVVJMLCB1c2UgaXQgaW5zdGVhZCBvZiBkZWZhdWx0XG4gICAgICAgIGF3YWl0IGNoYW5nZUxhbmd1YWdlKGxvY2FsZVBhcmFtIGFzIExvY2FsZSlcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGxvY2FsZUZyb21TeXNWYXIpIHtcbiAgICAgICAgLy8gSWYgbG9jYWxlIGlzIHNldCBhcyBhIHN5c3RlbSB2YXJpYWJsZSwgdXNlIHRoYXRcbiAgICAgICAgYXdhaXQgY2hhbmdlTGFuZ3VhZ2UobG9jYWxlRnJvbVN5c1ZhcilcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGFwcEluZm8/LnNpdGUuZGVmYXVsdF9sYW5ndWFnZSkge1xuICAgICAgICAvLyBPdGhlcndpc2UgdXNlIHRoZSBkZWZhdWx0IGZyb20gYXBwIGNvbmZpZ1xuICAgICAgICBhd2FpdCBjaGFuZ2VMYW5ndWFnZShhcHBJbmZvLnNpdGUuZGVmYXVsdF9sYW5ndWFnZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYW5ndWFnZUZyb21QYXJhbXMoKVxuICB9LCBbYXBwSW5mb10pXG5cbiAgY29uc3QgW2NvbnZlcnNhdGlvbklkSW5mbywgc2V0Q29udmVyc2F0aW9uSWRJbmZvXSA9IHVzZUxvY2FsU3RvcmFnZVN0YXRlPFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+PihDT05WRVJTQVRJT05fSURfSU5GTywge1xuICAgIGRlZmF1bHRWYWx1ZToge30sXG4gIH0pXG4gIGNvbnN0IGFsbG93UmVzZXRDaGF0ID0gIWNvbnZlcnNhdGlvbklkXG4gIGNvbnN0IGN1cnJlbnRDb252ZXJzYXRpb25JZCA9IHVzZU1lbW8oKCkgPT4gY29udmVyc2F0aW9uSWRJbmZvPy5bYXBwSWQgfHwgJyddPy5bdXNlcklkIHx8ICdERUZBVUxUJ10gfHwgY29udmVyc2F0aW9uSWQgfHwgJycsIFthcHBJZCwgY29udmVyc2F0aW9uSWRJbmZvLCB1c2VySWQsIGNvbnZlcnNhdGlvbklkXSlcbiAgY29uc3QgaGFuZGxlQ29udmVyc2F0aW9uSWRJbmZvQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGNoYW5nZUNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHtcbiAgICBpZiAoYXBwSWQpIHtcbiAgICAgIGxldCBwcmV2VmFsdWUgPSBjb252ZXJzYXRpb25JZEluZm8/LlthcHBJZCB8fCAnJ11cbiAgICAgIGlmICh0eXBlb2YgcHJldlZhbHVlID09PSAnc3RyaW5nJylcbiAgICAgICAgcHJldlZhbHVlID0ge31cbiAgICAgIHNldENvbnZlcnNhdGlvbklkSW5mbyh7XG4gICAgICAgIC4uLmNvbnZlcnNhdGlvbklkSW5mbyxcbiAgICAgICAgW2FwcElkIHx8ICcnXToge1xuICAgICAgICAgIC4uLnByZXZWYWx1ZSxcbiAgICAgICAgICBbdXNlcklkIHx8ICdERUZBVUxUJ106IGNoYW5nZUNvbnZlcnNhdGlvbklkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gIH0sIFthcHBJZCwgY29udmVyc2F0aW9uSWRJbmZvLCBzZXRDb252ZXJzYXRpb25JZEluZm8sIHVzZXJJZF0pXG5cbiAgY29uc3QgW25ld0NvbnZlcnNhdGlvbklkLCBzZXROZXdDb252ZXJzYXRpb25JZF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgY2hhdFNob3VsZFJlbG9hZEtleSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChjdXJyZW50Q29udmVyc2F0aW9uSWQgPT09IG5ld0NvbnZlcnNhdGlvbklkKVxuICAgICAgcmV0dXJuICcnXG5cbiAgICByZXR1cm4gY3VycmVudENvbnZlcnNhdGlvbklkXG4gIH0sIFtjdXJyZW50Q29udmVyc2F0aW9uSWQsIG5ld0NvbnZlcnNhdGlvbklkXSlcblxuICBjb25zdCB7IGRhdGE6IGFwcFBpbm5lZENvbnZlcnNhdGlvbkRhdGEgfSA9IHVzZVNoYXJlQ29udmVyc2F0aW9ucyh7XG4gICAgaXNJbnN0YWxsZWRBcHAsXG4gICAgYXBwSWQsXG4gICAgcGlubmVkOiB0cnVlLFxuICAgIGxpbWl0OiAxMDAsXG4gIH0pXG4gIGNvbnN0IHtcbiAgICBkYXRhOiBhcHBDb252ZXJzYXRpb25EYXRhLFxuICAgIGlzTG9hZGluZzogYXBwQ29udmVyc2F0aW9uRGF0YUxvYWRpbmcsXG4gIH0gPSB1c2VTaGFyZUNvbnZlcnNhdGlvbnMoe1xuICAgIGlzSW5zdGFsbGVkQXBwLFxuICAgIGFwcElkLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgbGltaXQ6IDEwMCxcbiAgfSlcbiAgY29uc3Qge1xuICAgIGRhdGE6IGFwcENoYXRMaXN0RGF0YSxcbiAgICBpc0xvYWRpbmc6IGFwcENoYXRMaXN0RGF0YUxvYWRpbmcsXG4gIH0gPSB1c2VTaGFyZUNoYXRMaXN0KHtcbiAgICBjb252ZXJzYXRpb25JZDogY2hhdFNob3VsZFJlbG9hZEtleSxcbiAgICBpc0luc3RhbGxlZEFwcCxcbiAgICBhcHBJZCxcbiAgfSlcbiAgY29uc3QgaW52YWxpZGF0ZVNoYXJlQ29udmVyc2F0aW9ucyA9IHVzZUludmFsaWRhdGVTaGFyZUNvbnZlcnNhdGlvbnMoKVxuXG4gIGNvbnN0IFtjbGVhckNoYXRMaXN0LCBzZXRDbGVhckNoYXRMaXN0XSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbaXNSZXNwb25kaW5nLCBzZXRJc1Jlc3BvbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGFwcFByZXZDaGF0TGlzdCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKGN1cnJlbnRDb252ZXJzYXRpb25JZCAmJiBhcHBDaGF0TGlzdERhdGE/LmRhdGEubGVuZ3RoKVxuICAgICAgPyBidWlsZENoYXRJdGVtVHJlZShnZXRGb3JtYXR0ZWRDaGF0TGlzdChhcHBDaGF0TGlzdERhdGEuZGF0YSkpXG4gICAgICA6IFtdLFxuICAgIFthcHBDaGF0TGlzdERhdGEsIGN1cnJlbnRDb252ZXJzYXRpb25JZF0sXG4gIClcblxuICBjb25zdCBbc2hvd05ld0NvbnZlcnNhdGlvbkl0ZW1Jbkxpc3QsIHNldFNob3dOZXdDb252ZXJzYXRpb25JdGVtSW5MaXN0XSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IHBpbm5lZENvbnZlcnNhdGlvbkxpc3QgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gYXBwUGlubmVkQ29udmVyc2F0aW9uRGF0YT8uZGF0YSB8fCBbXVxuICB9LCBbYXBwUGlubmVkQ29udmVyc2F0aW9uRGF0YV0pXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBuZXdDb252ZXJzYXRpb25JbnB1dHNSZWYgPSB1c2VSZWY8UmVjb3JkPHN0cmluZywgYW55Pj4oe30pXG4gIGNvbnN0IFtuZXdDb252ZXJzYXRpb25JbnB1dHMsIHNldE5ld0NvbnZlcnNhdGlvbklucHV0c10gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pih7fSlcbiAgY29uc3QgW2luaXRJbnB1dHMsIHNldEluaXRJbnB1dHNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55Pj4oe30pXG4gIGNvbnN0IFtpbml0VXNlclZhcmlhYmxlcywgc2V0SW5pdFVzZXJWYXJpYWJsZXNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55Pj4oe30pXG4gIGNvbnN0IGhhbmRsZU5ld0NvbnZlcnNhdGlvbklucHV0c0NoYW5nZSA9IHVzZUNhbGxiYWNrKChuZXdJbnB1dHM6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHtcbiAgICBuZXdDb252ZXJzYXRpb25JbnB1dHNSZWYuY3VycmVudCA9IG5ld0lucHV0c1xuICAgIHNldE5ld0NvbnZlcnNhdGlvbklucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtdKVxuICBjb25zdCBpbnB1dHNGb3JtcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiAoYXBwUGFyYW1zPy51c2VyX2lucHV0X2Zvcm0gfHwgW10pLmZpbHRlcigoaXRlbTogYW55KSA9PiAhaXRlbS5leHRlcm5hbF9kYXRhX3Rvb2wpLm1hcCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBpZiAoaXRlbS5wYXJhZ3JhcGgpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gaW5pdElucHV0c1tpdGVtLnBhcmFncmFwaC52YXJpYWJsZV1cbiAgICAgICAgaWYgKHZhbHVlICYmIGl0ZW0ucGFyYWdyYXBoLm1heF9sZW5ndGggJiYgdmFsdWUubGVuZ3RoID4gaXRlbS5wYXJhZ3JhcGgubWF4X2xlbmd0aClcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIGl0ZW0ucGFyYWdyYXBoLm1heF9sZW5ndGgpXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLnBhcmFncmFwaCxcbiAgICAgICAgICBkZWZhdWx0OiB2YWx1ZSB8fCBpdGVtLmRlZmF1bHQgfHwgaXRlbS5wYXJhZ3JhcGguZGVmYXVsdCxcbiAgICAgICAgICB0eXBlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ubnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGNvbnZlcnRlZE51bWJlciA9IE51bWJlcihpbml0SW5wdXRzW2l0ZW0ubnVtYmVyLnZhcmlhYmxlXSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLm51bWJlcixcbiAgICAgICAgICBkZWZhdWx0OiBjb252ZXJ0ZWROdW1iZXIgfHwgaXRlbS5kZWZhdWx0IHx8IGl0ZW0ubnVtYmVyLmRlZmF1bHQsXG4gICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uY2hlY2tib3gpIHtcbiAgICAgICAgY29uc3QgcHJlc2V0ID0gaW5pdElucHV0c1tpdGVtLmNoZWNrYm94LnZhcmlhYmxlXSA9PT0gdHJ1ZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0uY2hlY2tib3gsXG4gICAgICAgICAgZGVmYXVsdDogcHJlc2V0IHx8IGl0ZW0uZGVmYXVsdCB8fCBpdGVtLmNoZWNrYm94LmRlZmF1bHQsXG4gICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zZWxlY3QpIHtcbiAgICAgICAgY29uc3QgaXNJbnB1dEluT3B0aW9ucyA9IGl0ZW0uc2VsZWN0Lm9wdGlvbnMuaW5jbHVkZXMoaW5pdElucHV0c1tpdGVtLnNlbGVjdC52YXJpYWJsZV0pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbS5zZWxlY3QsXG4gICAgICAgICAgZGVmYXVsdDogKGlzSW5wdXRJbk9wdGlvbnMgPyBpbml0SW5wdXRzW2l0ZW0uc2VsZWN0LnZhcmlhYmxlXSA6IHVuZGVmaW5lZCkgfHwgaXRlbS5zZWxlY3QuZGVmYXVsdCxcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsnZmlsZS1saXN0J10pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtWydmaWxlLWxpc3QnXSxcbiAgICAgICAgICB0eXBlOiAnZmlsZS1saXN0JyxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5maWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbS5maWxlLFxuICAgICAgICAgIHR5cGU6ICdmaWxlJyxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5qc29uX29iamVjdCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0uanNvbl9vYmplY3QsXG4gICAgICAgICAgdHlwZTogJ2pzb25fb2JqZWN0JyxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgdmFsdWUgPSBpbml0SW5wdXRzW2l0ZW1bJ3RleHQtaW5wdXQnXS52YXJpYWJsZV1cbiAgICAgIGlmICh2YWx1ZSAmJiBpdGVtWyd0ZXh0LWlucHV0J10ubWF4X2xlbmd0aCAmJiB2YWx1ZS5sZW5ndGggPiBpdGVtWyd0ZXh0LWlucHV0J10ubWF4X2xlbmd0aClcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCBpdGVtWyd0ZXh0LWlucHV0J10ubWF4X2xlbmd0aClcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uaXRlbVsndGV4dC1pbnB1dCddLFxuICAgICAgICBkZWZhdWx0OiB2YWx1ZSB8fCBpdGVtLmRlZmF1bHQgfHwgaXRlbVsndGV4dC1pbnB1dCddLmRlZmF1bHQsXG4gICAgICAgIHR5cGU6ICd0ZXh0LWlucHV0JyxcbiAgICAgIH1cbiAgICB9KVxuICB9LCBbaW5pdElucHV0cywgYXBwUGFyYW1zXSlcblxuICBjb25zdCBhbGxJbnB1dHNIaWRkZW4gPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gaW5wdXRzRm9ybXMubGVuZ3RoID4gMCAmJiBpbnB1dHNGb3Jtcy5ldmVyeShpdGVtID0+IGl0ZW0uaGlkZSA9PT0gdHJ1ZSlcbiAgfSwgW2lucHV0c0Zvcm1zXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIGluaXQgaW5wdXRzIGZyb20gdXJsIHBhcmFtc1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dHMgPSBhd2FpdCBnZXRQcm9jZXNzZWRJbnB1dHNGcm9tVXJsUGFyYW1zKClcbiAgICAgIGNvbnN0IHVzZXJWYXJpYWJsZXMgPSBhd2FpdCBnZXRQcm9jZXNzZWRVc2VyVmFyaWFibGVzRnJvbVVybFBhcmFtcygpXG4gICAgICBzZXRJbml0SW5wdXRzKGlucHV0cylcbiAgICAgIHNldEluaXRVc2VyVmFyaWFibGVzKHVzZXJWYXJpYWJsZXMpXG4gICAgfSkoKVxuICB9LCBbXSlcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBjb252ZXJzYXRpb25JbnB1dHM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuXG4gICAgaW5wdXRzRm9ybXMuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb252ZXJzYXRpb25JbnB1dHNbaXRlbS52YXJpYWJsZV0gPSBpdGVtLmRlZmF1bHQgfHwgbnVsbFxuICAgIH0pXG4gICAgaGFuZGxlTmV3Q29udmVyc2F0aW9uSW5wdXRzQ2hhbmdlKGNvbnZlcnNhdGlvbklucHV0cylcbiAgfSwgW2hhbmRsZU5ld0NvbnZlcnNhdGlvbklucHV0c0NoYW5nZSwgaW5wdXRzRm9ybXNdKVxuXG4gIGNvbnN0IHsgZGF0YTogbmV3Q29udmVyc2F0aW9uIH0gPSB1c2VTaGFyZUNvbnZlcnNhdGlvbk5hbWUoe1xuICAgIGNvbnZlcnNhdGlvbklkOiBuZXdDb252ZXJzYXRpb25JZCxcbiAgICBpc0luc3RhbGxlZEFwcCxcbiAgICBhcHBJZCxcbiAgfSwge1xuICAgIHJlZmV0Y2hPbldpbmRvd0ZvY3VzOiBmYWxzZSxcbiAgfSlcbiAgY29uc3QgW29yaWdpbkNvbnZlcnNhdGlvbkxpc3QsIHNldE9yaWdpbkNvbnZlcnNhdGlvbkxpc3RdID0gdXNlU3RhdGU8Q29udmVyc2F0aW9uSXRlbVtdPihbXSlcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYXBwQ29udmVyc2F0aW9uRGF0YT8uZGF0YSAmJiAhYXBwQ29udmVyc2F0aW9uRGF0YUxvYWRpbmcpXG4gICAgICBzZXRPcmlnaW5Db252ZXJzYXRpb25MaXN0KGFwcENvbnZlcnNhdGlvbkRhdGE/LmRhdGEpXG4gIH0sIFthcHBDb252ZXJzYXRpb25EYXRhLCBhcHBDb252ZXJzYXRpb25EYXRhTG9hZGluZ10pXG4gIGNvbnN0IGNvbnZlcnNhdGlvbkxpc3QgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBkYXRhID0gb3JpZ2luQ29udmVyc2F0aW9uTGlzdC5zbGljZSgpXG5cbiAgICBpZiAoc2hvd05ld0NvbnZlcnNhdGlvbkl0ZW1Jbkxpc3QgJiYgZGF0YVswXT8uaWQgIT09ICcnKSB7XG4gICAgICBkYXRhLnVuc2hpZnQoe1xuICAgICAgICBpZDogJycsXG4gICAgICAgIG5hbWU6IHQoJ2NoYXQubmV3Q2hhdERlZmF1bHROYW1lJywgeyBuczogJ3NoYXJlJyB9KSxcbiAgICAgICAgaW5wdXRzOiB7fSxcbiAgICAgICAgaW50cm9kdWN0aW9uOiAnJyxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG4gIH0sIFtvcmlnaW5Db252ZXJzYXRpb25MaXN0LCBzaG93TmV3Q29udmVyc2F0aW9uSXRlbUluTGlzdCwgdF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobmV3Q29udmVyc2F0aW9uKSB7XG4gICAgICBzZXRPcmlnaW5Db252ZXJzYXRpb25MaXN0KHByb2R1Y2UoKGRyYWZ0KSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZHJhZnQuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5pZCA9PT0gbmV3Q29udmVyc2F0aW9uLmlkKVxuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKVxuICAgICAgICAgIGRyYWZ0W2luZGV4XSA9IG5ld0NvbnZlcnNhdGlvblxuICAgICAgICBlbHNlXG4gICAgICAgICAgZHJhZnQudW5zaGlmdChuZXdDb252ZXJzYXRpb24pXG4gICAgICB9KSlcbiAgICB9XG4gIH0sIFtuZXdDb252ZXJzYXRpb25dKVxuXG4gIGNvbnN0IGN1cnJlbnRDb252ZXJzYXRpb25JdGVtID0gdXNlTWVtbygoKSA9PiB7XG4gICAgbGV0IGNvbnZlcnNhdGlvbkl0ZW0gPSBjb252ZXJzYXRpb25MaXN0LmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBjdXJyZW50Q29udmVyc2F0aW9uSWQpXG5cbiAgICBpZiAoIWNvbnZlcnNhdGlvbkl0ZW0gJiYgcGlubmVkQ29udmVyc2F0aW9uTGlzdC5sZW5ndGgpXG4gICAgICBjb252ZXJzYXRpb25JdGVtID0gcGlubmVkQ29udmVyc2F0aW9uTGlzdC5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gY3VycmVudENvbnZlcnNhdGlvbklkKVxuXG4gICAgcmV0dXJuIGNvbnZlcnNhdGlvbkl0ZW1cbiAgfSwgW2NvbnZlcnNhdGlvbkxpc3QsIGN1cnJlbnRDb252ZXJzYXRpb25JZCwgcGlubmVkQ29udmVyc2F0aW9uTGlzdF0pXG5cbiAgY29uc3QgY3VycmVudENvbnZlcnNhdGlvbkxhdGVzdElucHV0cyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghY3VycmVudENvbnZlcnNhdGlvbklkIHx8ICFhcHBDaGF0TGlzdERhdGE/LmRhdGEubGVuZ3RoKVxuICAgICAgcmV0dXJuIG5ld0NvbnZlcnNhdGlvbklucHV0c1JlZi5jdXJyZW50IHx8IHt9XG4gICAgcmV0dXJuIGFwcENoYXRMaXN0RGF0YS5kYXRhLnNsaWNlKCkucG9wKCkuaW5wdXRzIHx8IHt9XG4gIH0sIFthcHBDaGF0TGlzdERhdGEsIGN1cnJlbnRDb252ZXJzYXRpb25JZF0pXG4gIGNvbnN0IFtjdXJyZW50Q29udmVyc2F0aW9uSW5wdXRzLCBzZXRDdXJyZW50Q29udmVyc2F0aW9uSW5wdXRzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIGFueT4+KGN1cnJlbnRDb252ZXJzYXRpb25MYXRlc3RJbnB1dHMgfHwge30pXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGN1cnJlbnRDb252ZXJzYXRpb25JdGVtKVxuICAgICAgc2V0Q3VycmVudENvbnZlcnNhdGlvbklucHV0cyhjdXJyZW50Q29udmVyc2F0aW9uTGF0ZXN0SW5wdXRzIHx8IHt9KVxuICB9LCBbY3VycmVudENvbnZlcnNhdGlvbkl0ZW0sIGN1cnJlbnRDb252ZXJzYXRpb25MYXRlc3RJbnB1dHNdKVxuXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VUb2FzdENvbnRleHQoKVxuICBjb25zdCBjaGVja0lucHV0c1JlcXVpcmVkID0gdXNlQ2FsbGJhY2soKHNpbGVudD86IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoYWxsSW5wdXRzSGlkZGVuKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIGxldCBoYXNFbXB0eUlucHV0ID0gJydcbiAgICBsZXQgZmlsZUlzVXBsb2FkaW5nID0gZmFsc2VcbiAgICBjb25zdCByZXF1aXJlZFZhcnMgPSBpbnB1dHNGb3Jtcy5maWx0ZXIoKHsgcmVxdWlyZWQsIHR5cGUgfSkgPT4gcmVxdWlyZWQgJiYgdHlwZSAhPT0gSW5wdXRWYXJUeXBlLmNoZWNrYm94KVxuICAgIGlmIChyZXF1aXJlZFZhcnMubGVuZ3RoKSB7XG4gICAgICByZXF1aXJlZFZhcnMuZm9yRWFjaCgoeyB2YXJpYWJsZSwgbGFiZWwsIHR5cGUgfSkgPT4ge1xuICAgICAgICBpZiAoaGFzRW1wdHlJbnB1dClcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAoZmlsZUlzVXBsb2FkaW5nKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICghbmV3Q29udmVyc2F0aW9uSW5wdXRzUmVmLmN1cnJlbnRbdmFyaWFibGVdICYmICFzaWxlbnQpXG4gICAgICAgICAgaGFzRW1wdHlJbnB1dCA9IGxhYmVsIGFzIHN0cmluZ1xuXG4gICAgICAgIGlmICgodHlwZSA9PT0gSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUgfHwgdHlwZSA9PT0gSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMpICYmIG5ld0NvbnZlcnNhdGlvbklucHV0c1JlZi5jdXJyZW50W3ZhcmlhYmxlXSAmJiAhc2lsZW50KSB7XG4gICAgICAgICAgY29uc3QgZmlsZXMgPSBuZXdDb252ZXJzYXRpb25JbnB1dHNSZWYuY3VycmVudFt2YXJpYWJsZV1cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmaWxlcykpXG4gICAgICAgICAgICBmaWxlSXNVcGxvYWRpbmcgPSBmaWxlcy5maW5kKGl0ZW0gPT4gaXRlbS50cmFuc2Zlck1ldGhvZCA9PT0gVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSAmJiAhaXRlbS51cGxvYWRlZElkKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZpbGVJc1VwbG9hZGluZyA9IGZpbGVzLnRyYW5zZmVyTWV0aG9kID09PSBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlICYmICFmaWxlcy51cGxvYWRlZElkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGhhc0VtcHR5SW5wdXQpIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2Vycm9yTWVzc2FnZS52YWx1ZU9mVmFyUmVxdWlyZWQnLCB7IG5zOiAnYXBwRGVidWcnLCBrZXk6IGhhc0VtcHR5SW5wdXQgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChmaWxlSXNVcGxvYWRpbmcpIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdpbmZvJywgbWVzc2FnZTogdCgnZXJyb3JNZXNzYWdlLndhaXRGb3JGaWxlVXBsb2FkJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfSwgW2lucHV0c0Zvcm1zLCBub3RpZnksIHQsIGFsbElucHV0c0hpZGRlbl0pXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2hhdCA9IHVzZUNhbGxiYWNrKChjYWxsYmFjaz86IGFueSkgPT4ge1xuICAgIGlmIChjaGVja0lucHV0c1JlcXVpcmVkKCkpIHtcbiAgICAgIHNldFNob3dOZXdDb252ZXJzYXRpb25JdGVtSW5MaXN0KHRydWUpXG4gICAgICBjYWxsYmFjaz8uKClcbiAgICB9XG4gIH0sIFtzZXRTaG93TmV3Q29udmVyc2F0aW9uSXRlbUluTGlzdCwgY2hlY2tJbnB1dHNSZXF1aXJlZF0pXG4gIGNvbnN0IGN1cnJlbnRDaGF0SW5zdGFuY2VSZWYgPSB1c2VSZWY8eyBoYW5kbGVTdG9wOiAoKSA9PiB2b2lkIH0+KHsgaGFuZGxlU3RvcDogbm9vcCB9KVxuICBjb25zdCBoYW5kbGVDaGFuZ2VDb252ZXJzYXRpb24gPSB1c2VDYWxsYmFjaygoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4ge1xuICAgIGN1cnJlbnRDaGF0SW5zdGFuY2VSZWYuY3VycmVudC5oYW5kbGVTdG9wKClcbiAgICBzZXROZXdDb252ZXJzYXRpb25JZCgnJylcbiAgICBoYW5kbGVDb252ZXJzYXRpb25JZEluZm9DaGFuZ2UoY29udmVyc2F0aW9uSWQpXG4gICAgaWYgKGNvbnZlcnNhdGlvbklkKVxuICAgICAgc2V0Q2xlYXJDaGF0TGlzdChmYWxzZSlcbiAgfSwgW2hhbmRsZUNvbnZlcnNhdGlvbklkSW5mb0NoYW5nZSwgc2V0Q2xlYXJDaGF0TGlzdF0pXG4gIGNvbnN0IGhhbmRsZU5ld0NvbnZlcnNhdGlvbiA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBjdXJyZW50Q2hhdEluc3RhbmNlUmVmLmN1cnJlbnQuaGFuZGxlU3RvcCgpXG4gICAgc2V0U2hvd05ld0NvbnZlcnNhdGlvbkl0ZW1Jbkxpc3QodHJ1ZSlcbiAgICBoYW5kbGVDaGFuZ2VDb252ZXJzYXRpb24oJycpXG4gICAgaGFuZGxlTmV3Q29udmVyc2F0aW9uSW5wdXRzQ2hhbmdlKGF3YWl0IGdldFByb2Nlc3NlZElucHV0c0Zyb21VcmxQYXJhbXMoKSlcbiAgICBzZXRDbGVhckNoYXRMaXN0KHRydWUpXG4gIH0sIFtoYW5kbGVDaGFuZ2VDb252ZXJzYXRpb24sIHNldFNob3dOZXdDb252ZXJzYXRpb25JdGVtSW5MaXN0LCBoYW5kbGVOZXdDb252ZXJzYXRpb25JbnB1dHNDaGFuZ2UsIHNldENsZWFyQ2hhdExpc3RdKVxuXG4gIGNvbnN0IGhhbmRsZU5ld0NvbnZlcnNhdGlvbkNvbXBsZXRlZCA9IHVzZUNhbGxiYWNrKChuZXdDb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB7XG4gICAgc2V0TmV3Q29udmVyc2F0aW9uSWQobmV3Q29udmVyc2F0aW9uSWQpXG4gICAgaGFuZGxlQ29udmVyc2F0aW9uSWRJbmZvQ2hhbmdlKG5ld0NvbnZlcnNhdGlvbklkKVxuICAgIHNldFNob3dOZXdDb252ZXJzYXRpb25JdGVtSW5MaXN0KGZhbHNlKVxuICAgIGludmFsaWRhdGVTaGFyZUNvbnZlcnNhdGlvbnMoKVxuICB9LCBbaGFuZGxlQ29udmVyc2F0aW9uSWRJbmZvQ2hhbmdlLCBpbnZhbGlkYXRlU2hhcmVDb252ZXJzYXRpb25zXSlcblxuICBjb25zdCBoYW5kbGVGZWVkYmFjayA9IHVzZUNhbGxiYWNrKGFzeW5jIChtZXNzYWdlSWQ6IHN0cmluZywgZmVlZGJhY2s6IEZlZWRiYWNrKSA9PiB7XG4gICAgYXdhaXQgdXBkYXRlRmVlZGJhY2soeyB1cmw6IGAvbWVzc2FnZXMvJHttZXNzYWdlSWR9L2ZlZWRiYWNrc2AsIGJvZHk6IHsgcmF0aW5nOiBmZWVkYmFjay5yYXRpbmcsIGNvbnRlbnQ6IGZlZWRiYWNrLmNvbnRlbnQgfSB9LCBpc0luc3RhbGxlZEFwcCwgYXBwSWQpXG4gICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhcGkuc3VjY2VzcycsIHsgbnM6ICdjb21tb24nIH0pIH0pXG4gIH0sIFtpc0luc3RhbGxlZEFwcCwgYXBwSWQsIHQsIG5vdGlmeV0pXG5cbiAgcmV0dXJuIHtcbiAgICBpc0luc3RhbGxlZEFwcCxcbiAgICBhbGxvd1Jlc2V0Q2hhdCxcbiAgICBhcHBJZCxcbiAgICBjdXJyZW50Q29udmVyc2F0aW9uSWQsXG4gICAgY3VycmVudENvbnZlcnNhdGlvbkl0ZW0sXG4gICAgaGFuZGxlQ29udmVyc2F0aW9uSWRJbmZvQ2hhbmdlLFxuICAgIGFwcERhdGE6IGFwcEluZm8sXG4gICAgYXBwUGFyYW1zOiBhcHBQYXJhbXMgfHwge30gYXMgQ2hhdENvbmZpZyxcbiAgICBhcHBNZXRhLFxuICAgIGFwcFBpbm5lZENvbnZlcnNhdGlvbkRhdGEsXG4gICAgYXBwQ29udmVyc2F0aW9uRGF0YSxcbiAgICBhcHBDb252ZXJzYXRpb25EYXRhTG9hZGluZyxcbiAgICBhcHBDaGF0TGlzdERhdGEsXG4gICAgYXBwQ2hhdExpc3REYXRhTG9hZGluZyxcbiAgICBhcHBQcmV2Q2hhdExpc3QsXG4gICAgcGlubmVkQ29udmVyc2F0aW9uTGlzdCxcbiAgICBjb252ZXJzYXRpb25MaXN0LFxuICAgIHNldFNob3dOZXdDb252ZXJzYXRpb25JdGVtSW5MaXN0LFxuICAgIG5ld0NvbnZlcnNhdGlvbklucHV0cyxcbiAgICBuZXdDb252ZXJzYXRpb25JbnB1dHNSZWYsXG4gICAgaGFuZGxlTmV3Q29udmVyc2F0aW9uSW5wdXRzQ2hhbmdlLFxuICAgIGlucHV0c0Zvcm1zLFxuICAgIGhhbmRsZU5ld0NvbnZlcnNhdGlvbixcbiAgICBoYW5kbGVTdGFydENoYXQsXG4gICAgaGFuZGxlQ2hhbmdlQ29udmVyc2F0aW9uLFxuICAgIGhhbmRsZU5ld0NvbnZlcnNhdGlvbkNvbXBsZXRlZCxcbiAgICBuZXdDb252ZXJzYXRpb25JZCxcbiAgICBjaGF0U2hvdWxkUmVsb2FkS2V5LFxuICAgIGhhbmRsZUZlZWRiYWNrLFxuICAgIGN1cnJlbnRDaGF0SW5zdGFuY2VSZWYsXG4gICAgY2xlYXJDaGF0TGlzdCxcbiAgICBzZXRDbGVhckNoYXRMaXN0LFxuICAgIGlzUmVzcG9uZGluZyxcbiAgICBzZXRJc1Jlc3BvbmRpbmcsXG4gICAgY3VycmVudENvbnZlcnNhdGlvbklucHV0cyxcbiAgICBzZXRDdXJyZW50Q29udmVyc2F0aW9uSW5wdXRzLFxuICAgIGFsbElucHV0c0hpZGRlbixcbiAgICBpbml0VXNlclZhcmlhYmxlcyxcbiAgfVxufVxuIl19