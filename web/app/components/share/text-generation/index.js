"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const saved_items_1 = require("@/app/components/app/text-generate/saved-items");
const app_icon_1 = require("@/app/components/base/app-icon");
const badge_1 = require("@/app/components/base/badge");
const loading_1 = require("@/app/components/base/loading");
const dify_logo_1 = require("@/app/components/base/logo/dify-logo");
const toast_1 = require("@/app/components/base/toast");
const result_1 = require("@/app/components/share/text-generation/result");
const run_once_1 = require("@/app/components/share/text-generation/run-once");
const config_1 = require("@/config");
const global_public_context_1 = require("@/context/global-public-context");
const web_app_context_1 = require("@/context/web-app-context");
const use_app_favicon_1 = require("@/hooks/use-app-favicon");
const use_breakpoints_1 = require("@/hooks/use-breakpoints");
const use_document_title_1 = require("@/hooks/use-document-title");
const client_1 = require("@/i18n-config/client");
const access_control_1 = require("@/models/access-control");
const share_1 = require("@/service/share");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const model_config_1 = require("@/utils/model-config");
const tab_header_1 = require("../../base/tab-header");
const menu_dropdown_1 = require("./menu-dropdown");
const run_batch_1 = require("./run-batch");
const res_download_1 = require("./run-batch/res-download");
const GROUP_SIZE = config_1.BATCH_CONCURRENCY; // to avoid RPM(Request per minute) limit. The group task finished then the next group.
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["pending"] = "pending";
    TaskStatus["running"] = "running";
    TaskStatus["completed"] = "completed";
    TaskStatus["failed"] = "failed";
})(TaskStatus || (TaskStatus = {}));
const TextGeneration = ({ isInstalledApp = false, installedAppInfo, isWorkflow = false, }) => {
    const { notify } = toast_1.default;
    const { t } = (0, react_i18next_1.useTranslation)();
    const media = (0, use_breakpoints_1.default)();
    const isPC = media === use_breakpoints_1.MediaType.pc;
    const searchParams = (0, navigation_1.useSearchParams)();
    const mode = searchParams.get('mode') || 'create';
    const [currentTab, setCurrentTab] = (0, react_2.useState)(['create', 'batch'].includes(mode) ? mode : 'create');
    // Notice this situation isCallBatchAPI but not in batch tab
    const [isCallBatchAPI, setIsCallBatchAPI] = (0, react_2.useState)(false);
    const isInBatchTab = currentTab === 'batch';
    const [inputs, doSetInputs] = (0, react_2.useState)({});
    const inputsRef = (0, react_2.useRef)(inputs);
    const setInputs = (0, react_2.useCallback)((newInputs) => {
        doSetInputs(newInputs);
        inputsRef.current = newInputs;
    }, []);
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const [appId, setAppId] = (0, react_2.useState)('');
    const [siteInfo, setSiteInfo] = (0, react_2.useState)(null);
    const [customConfig, setCustomConfig] = (0, react_2.useState)(null);
    const [promptConfig, setPromptConfig] = (0, react_2.useState)(null);
    const [moreLikeThisConfig, setMoreLikeThisConfig] = (0, react_2.useState)(null);
    const [textToSpeechConfig, setTextToSpeechConfig] = (0, react_2.useState)(null);
    // save message
    const [savedMessages, setSavedMessages] = (0, react_2.useState)([]);
    const fetchSavedMessage = (0, react_2.useCallback)(async () => {
        const res = await (0, share_1.fetchSavedMessage)(isInstalledApp, appId);
        setSavedMessages(res.data);
    }, [isInstalledApp, appId]);
    const handleSaveMessage = async (messageId) => {
        await (0, share_1.saveMessage)(messageId, isInstalledApp, appId);
        notify({ type: 'success', message: t('api.saved', { ns: 'common' }) });
        fetchSavedMessage();
    };
    const handleRemoveSavedMessage = async (messageId) => {
        await (0, share_1.removeMessage)(messageId, isInstalledApp, appId);
        notify({ type: 'success', message: t('api.remove', { ns: 'common' }) });
        fetchSavedMessage();
    };
    // send message task
    const [controlSend, setControlSend] = (0, react_2.useState)(0);
    const [controlStopResponding, setControlStopResponding] = (0, react_2.useState)(0);
    const [visionConfig, setVisionConfig] = (0, react_2.useState)({
        enabled: false,
        number_limits: 2,
        detail: app_1.Resolution.low,
        transfer_methods: [app_1.TransferMethod.local_file],
    });
    const [completionFiles, setCompletionFiles] = (0, react_2.useState)([]);
    const [runControl, setRunControl] = (0, react_2.useState)(null);
    (0, react_2.useEffect)(() => {
        if (isCallBatchAPI)
            setRunControl(null);
    }, [isCallBatchAPI]);
    const handleSend = () => {
        setIsCallBatchAPI(false);
        setControlSend(Date.now());
        // eslint-disable-next-line ts/no-use-before-define
        setAllTaskList([]); // clear batch task running status
        // eslint-disable-next-line ts/no-use-before-define
        showResultPanel();
    };
    const [controlRetry, setControlRetry] = (0, react_2.useState)(0);
    const handleRetryAllFailedTask = () => {
        setControlRetry(Date.now());
    };
    const [allTaskList, doSetAllTaskList] = (0, react_2.useState)([]);
    const allTaskListRef = (0, react_2.useRef)([]);
    const getLatestTaskList = () => allTaskListRef.current;
    const setAllTaskList = (taskList) => {
        doSetAllTaskList(taskList);
        allTaskListRef.current = taskList;
    };
    const pendingTaskList = allTaskList.filter(task => task.status === TaskStatus.pending);
    const noPendingTask = pendingTaskList.length === 0;
    const showTaskList = allTaskList.filter(task => task.status !== TaskStatus.pending);
    const currGroupNumRef = (0, react_2.useRef)(0);
    const setCurrGroupNum = (num) => {
        currGroupNumRef.current = num;
    };
    const getCurrGroupNum = () => {
        return currGroupNumRef.current;
    };
    const allSuccessTaskList = allTaskList.filter(task => task.status === TaskStatus.completed);
    const allFailedTaskList = allTaskList.filter(task => task.status === TaskStatus.failed);
    const allTasksFinished = allTaskList.every(task => task.status === TaskStatus.completed);
    const allTasksRun = allTaskList.every(task => [TaskStatus.completed, TaskStatus.failed].includes(task.status));
    const batchCompletionResRef = (0, react_2.useRef)({});
    const setBatchCompletionRes = (res) => {
        batchCompletionResRef.current = res;
    };
    const getBatchCompletionRes = () => batchCompletionResRef.current;
    const exportRes = allTaskList.map((task) => {
        const batchCompletionResLatest = getBatchCompletionRes();
        const res = {};
        const { inputs } = task.params;
        promptConfig?.prompt_variables.forEach((v) => {
            res[v.name] = inputs[v.key];
        });
        let result = batchCompletionResLatest[task.id];
        // task might return multiple fields, should marshal object to string
        if (typeof batchCompletionResLatest[task.id] === 'object')
            result = JSON.stringify(result);
        res[t('generation.completionResult', { ns: 'share' })] = result;
        return res;
    });
    const checkBatchInputs = (data) => {
        if (!data || data.length === 0) {
            notify({ type: 'error', message: t('generation.errorMsg.empty', { ns: 'share' }) });
            return false;
        }
        const headerData = data[0];
        let isMapVarName = true;
        promptConfig?.prompt_variables.forEach((item, index) => {
            if (!isMapVarName)
                return;
            if (item.name !== headerData[index])
                isMapVarName = false;
        });
        if (!isMapVarName) {
            notify({ type: 'error', message: t('generation.errorMsg.fileStructNotMatch', { ns: 'share' }) });
            return false;
        }
        let payloadData = data.slice(1);
        if (payloadData.length === 0) {
            notify({ type: 'error', message: t('generation.errorMsg.atLeastOne', { ns: 'share' }) });
            return false;
        }
        // check middle empty line
        const allEmptyLineIndexes = payloadData.filter(item => item.every(i => i === '')).map(item => payloadData.indexOf(item));
        if (allEmptyLineIndexes.length > 0) {
            let hasMiddleEmptyLine = false;
            let startIndex = allEmptyLineIndexes[0] - 1;
            allEmptyLineIndexes.forEach((index) => {
                if (hasMiddleEmptyLine)
                    return;
                if (startIndex + 1 !== index) {
                    hasMiddleEmptyLine = true;
                    return;
                }
                startIndex++;
            });
            if (hasMiddleEmptyLine) {
                notify({ type: 'error', message: t('generation.errorMsg.emptyLine', { ns: 'share', rowIndex: startIndex + 2 }) });
                return false;
            }
        }
        // check row format
        payloadData = payloadData.filter(item => !item.every(i => i === ''));
        // after remove empty rows in the end, checked again
        if (payloadData.length === 0) {
            notify({ type: 'error', message: t('generation.errorMsg.atLeastOne', { ns: 'share' }) });
            return false;
        }
        let errorRowIndex = 0;
        let requiredVarName = '';
        let moreThanMaxLengthVarName = '';
        let maxLength = 0;
        payloadData.forEach((item, index) => {
            if (errorRowIndex !== 0)
                return;
            promptConfig?.prompt_variables.forEach((varItem, varIndex) => {
                if (errorRowIndex !== 0)
                    return;
                if (varItem.type === 'string') {
                    const maxLen = varItem.max_length || config_1.DEFAULT_VALUE_MAX_LEN;
                    if (item[varIndex].length > maxLen) {
                        moreThanMaxLengthVarName = varItem.name;
                        maxLength = maxLen;
                        errorRowIndex = index + 1;
                        return;
                    }
                }
                if (!varItem.required)
                    return;
                if (item[varIndex].trim() === '') {
                    requiredVarName = varItem.name;
                    errorRowIndex = index + 1;
                }
            });
        });
        if (errorRowIndex !== 0) {
            if (requiredVarName)
                notify({ type: 'error', message: t('generation.errorMsg.invalidLine', { ns: 'share', rowIndex: errorRowIndex + 1, varName: requiredVarName }) });
            if (moreThanMaxLengthVarName)
                notify({ type: 'error', message: t('generation.errorMsg.moreThanMaxLengthLine', { ns: 'share', rowIndex: errorRowIndex + 1, varName: moreThanMaxLengthVarName, maxLength }) });
            return false;
        }
        return true;
    };
    const handleRunBatch = (data) => {
        if (!checkBatchInputs(data))
            return;
        if (!allTasksFinished) {
            notify({ type: 'info', message: t('errorMessage.waitForBatchResponse', { ns: 'appDebug' }) });
            return;
        }
        const payloadData = data.filter(item => !item.every(i => i === '')).slice(1);
        const varLen = promptConfig?.prompt_variables.length || 0;
        setIsCallBatchAPI(true);
        const allTaskList = payloadData.map((item, i) => {
            const inputs = {};
            if (varLen > 0) {
                item.slice(0, varLen).forEach((input, index) => {
                    const varSchema = promptConfig?.prompt_variables[index];
                    inputs[varSchema?.key] = input;
                    if (!input) {
                        if (varSchema?.type === 'string' || varSchema?.type === 'paragraph')
                            inputs[varSchema?.key] = '';
                        else
                            inputs[varSchema?.key] = undefined;
                    }
                });
            }
            return {
                id: i + 1,
                status: i < GROUP_SIZE ? TaskStatus.running : TaskStatus.pending,
                params: {
                    inputs,
                },
            };
        });
        setAllTaskList(allTaskList);
        setCurrGroupNum(0);
        setControlSend(Date.now());
        // clear run once task status
        setControlStopResponding(Date.now());
        // eslint-disable-next-line ts/no-use-before-define
        showResultPanel();
    };
    const handleCompleted = (completionRes, taskId, isSuccess) => {
        const allTaskListLatest = getLatestTaskList();
        const batchCompletionResLatest = getBatchCompletionRes();
        const pendingTaskList = allTaskListLatest.filter(task => task.status === TaskStatus.pending);
        const runTasksCount = 1 + allTaskListLatest.filter(task => [TaskStatus.completed, TaskStatus.failed].includes(task.status)).length;
        const needToAddNextGroupTask = (getCurrGroupNum() !== runTasksCount) && pendingTaskList.length > 0 && (runTasksCount % GROUP_SIZE === 0 || (allTaskListLatest.length - runTasksCount < GROUP_SIZE));
        // avoid add many task at the same time
        if (needToAddNextGroupTask)
            setCurrGroupNum(runTasksCount);
        const nextPendingTaskIds = needToAddNextGroupTask ? pendingTaskList.slice(0, GROUP_SIZE).map(item => item.id) : [];
        const newAllTaskList = allTaskListLatest.map((item) => {
            if (item.id === taskId) {
                return {
                    ...item,
                    status: isSuccess ? TaskStatus.completed : TaskStatus.failed,
                };
            }
            if (needToAddNextGroupTask && nextPendingTaskIds.includes(item.id)) {
                return {
                    ...item,
                    status: TaskStatus.running,
                };
            }
            return item;
        });
        setAllTaskList(newAllTaskList);
        if (taskId) {
            setBatchCompletionRes({
                ...batchCompletionResLatest,
                [`${taskId}`]: completionRes,
            });
        }
    };
    const appData = (0, web_app_context_1.useWebAppStore)(s => s.appInfo);
    const appParams = (0, web_app_context_1.useWebAppStore)(s => s.appParams);
    const accessMode = (0, web_app_context_1.useWebAppStore)(s => s.webAppAccessMode);
    (0, react_2.useEffect)(() => {
        (async () => {
            if (!appData || !appParams)
                return;
            if (!isWorkflow)
                fetchSavedMessage();
            const { app_id: appId, site: siteInfo, custom_config } = appData;
            setAppId(appId);
            setSiteInfo(siteInfo);
            setCustomConfig(custom_config);
            await (0, client_1.changeLanguage)(siteInfo.default_language);
            const { user_input_form, more_like_this, file_upload, text_to_speech } = appParams;
            setVisionConfig({
                // legacy of image upload compatible
                ...file_upload,
                transfer_methods: file_upload?.allowed_file_upload_methods || file_upload?.allowed_upload_methods,
                // legacy of image upload compatible
                image_file_size_limit: appParams?.system_parameters.image_file_size_limit,
                fileUploadConfig: appParams?.system_parameters,
            });
            const prompt_variables = (0, model_config_1.userInputsFormToPromptVariables)(user_input_form);
            setPromptConfig({
                prompt_template: '', // placeholder for future
                prompt_variables,
            });
            setMoreLikeThisConfig(more_like_this);
            setTextToSpeechConfig(text_to_speech);
        })();
    }, [appData, appParams, fetchSavedMessage, isWorkflow]);
    // Can Use metadata(https://beta.nextjs.org/docs/api-reference/metadata) to set title. But it only works in server side client.
    (0, use_document_title_1.default)(siteInfo?.title || t('generation.title', { ns: 'share' }));
    (0, use_app_favicon_1.useAppFavicon)({
        enable: !isInstalledApp,
        icon_type: siteInfo?.icon_type,
        icon: siteInfo?.icon,
        icon_background: siteInfo?.icon_background,
        icon_url: siteInfo?.icon_url,
    });
    const [isShowResultPanel, { setTrue: doShowResultPanel, setFalse: hideResultPanel }] = (0, ahooks_1.useBoolean)(false);
    const showResultPanel = () => {
        // fix: useClickAway hideResSidebar will close sidebar
        setTimeout(() => {
            doShowResultPanel();
        }, 0);
    };
    const [resultExisted, setResultExisted] = (0, react_2.useState)(false);
    const renderRes = (task) => (<result_1.default key={task?.id} isWorkflow={isWorkflow} isCallBatchAPI={isCallBatchAPI} isPC={isPC} isMobile={!isPC} isInstalledApp={isInstalledApp} appId={appId} installedAppInfo={installedAppInfo} isError={task?.status === TaskStatus.failed} promptConfig={promptConfig} moreLikeThisEnabled={!!moreLikeThisConfig?.enabled} inputs={isCallBatchAPI ? task.params.inputs : inputs} controlSend={controlSend} controlRetry={task?.status === TaskStatus.failed ? controlRetry : 0} controlStopResponding={controlStopResponding} onShowRes={showResultPanel} handleSaveMessage={handleSaveMessage} taskId={task?.id} onCompleted={handleCompleted} visionConfig={visionConfig} completionFiles={completionFiles} isShowTextToSpeech={!!textToSpeechConfig?.enabled} siteInfo={siteInfo} onRunStart={() => setResultExisted(true)} onRunControlChange={!isCallBatchAPI ? setRunControl : undefined} hideInlineStopButton={!isCallBatchAPI}/>);
    const renderBatchRes = () => {
        return (showTaskList.map(task => renderRes(task)));
    };
    const renderResWrap = (<div className={(0, classnames_1.cn)('relative flex h-full flex-col', !isPC && 'h-[calc(100vh_-_36px)] rounded-t-2xl shadow-lg backdrop-blur-sm', !isPC
            ? isShowResultPanel
                ? 'bg-background-default-burn'
                : 'border-t-[0.5px] border-divider-regular bg-components-panel-bg'
            : 'bg-chatbot-bg')}>
      {isCallBatchAPI && (<div className={(0, classnames_1.cn)('flex shrink-0 items-center justify-between px-14 pb-2 pt-9', !isPC && 'px-4 pb-1 pt-3')}>
          <div className="system-md-semibold-uppercase text-text-primary">{t('generation.executions', { ns: 'share', num: allTaskList.length })}</div>
          {allSuccessTaskList.length > 0 && (<res_download_1.default isMobile={!isPC} values={exportRes}/>)}
        </div>)}
      <div className={(0, classnames_1.cn)('flex h-0 grow flex-col overflow-y-auto', isPC && 'px-14 py-8', isPC && isCallBatchAPI && 'pt-0', !isPC && 'p-0 pb-2')}>
        {!isCallBatchAPI ? renderRes() : renderBatchRes()}
        {!noPendingTask && (<div className="mt-4">
            <loading_1.default type="area"/>
          </div>)}
      </div>
      {isCallBatchAPI && allFailedTaskList.length > 0 && (<div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-components-panel-border bg-components-panel-bg-blur p-3 shadow-lg backdrop-blur-sm">
          <react_1.RiErrorWarningFill className="h-4 w-4 text-text-destructive"/>
          <div className="system-sm-medium text-text-secondary">{t('generation.batchFailed.info', { ns: 'share', num: allFailedTaskList.length })}</div>
          <div className="h-3.5 w-px bg-divider-regular"></div>
          <div onClick={handleRetryAllFailedTask} className="system-sm-semibold-uppercase cursor-pointer text-text-accent">{t('generation.batchFailed.retry', { ns: 'share' })}</div>
        </div>)}
    </div>);
    if (!appId || !siteInfo || !promptConfig) {
        return (<div className="flex h-screen items-center">
        <loading_1.default type="app"/>
      </div>);
    }
    return (<div className={(0, classnames_1.cn)('bg-background-default-burn', isPC && 'flex', !isPC && 'flex-col', isInstalledApp ? 'h-full rounded-2xl shadow-md' : 'h-screen')}>
      {/* Left */}
      <div className={(0, classnames_1.cn)('relative flex h-full shrink-0 flex-col', isPC ? 'w-[600px] max-w-[50%]' : resultExisted ? 'h-[calc(100%_-_64px)]' : '', isInstalledApp && 'rounded-l-2xl')}>
        {/* header */}
        <div className={(0, classnames_1.cn)('shrink-0 space-y-4 border-b border-divider-subtle', isPC ? 'bg-components-panel-bg p-8 pb-0' : 'p-4 pb-0')}>
          <div className="flex items-center gap-3">
            <app_icon_1.default size={isPC ? 'large' : 'small'} iconType={siteInfo.icon_type} icon={siteInfo.icon} background={siteInfo.icon_background || config_1.appDefaultIconBackground} imageUrl={siteInfo.icon_url}/>
            <div className="system-md-semibold grow truncate text-text-secondary">{siteInfo.title}</div>
            <menu_dropdown_1.default hideLogout={isInstalledApp || accessMode === access_control_1.AccessMode.PUBLIC} data={siteInfo}/>
          </div>
          {siteInfo.description && (<div className="system-xs-regular text-text-tertiary">{siteInfo.description}</div>)}
          <tab_header_1.default items={[
            { id: 'create', name: t('generation.tabs.create', { ns: 'share' }) },
            { id: 'batch', name: t('generation.tabs.batch', { ns: 'share' }) },
            ...(!isWorkflow
                ? [{
                        id: 'saved',
                        name: t('generation.tabs.saved', { ns: 'share' }),
                        isRight: true,
                        icon: <react_1.RiBookmark3Line className="h-4 w-4"/>,
                        extra: savedMessages.length > 0
                            ? (<badge_1.default className="ml-1">
                            {savedMessages.length}
                          </badge_1.default>)
                            : null,
                    }]
                : []),
        ]} value={currentTab} onChange={setCurrentTab}/>
        </div>
        {/* form */}
        <div className={(0, classnames_1.cn)('h-0 grow overflow-y-auto bg-components-panel-bg', isPC ? 'px-8' : 'px-4', !isPC && resultExisted && customConfig?.remove_webapp_brand && 'rounded-b-2xl border-b-[0.5px] border-divider-regular')}>
          <div className={(0, classnames_1.cn)(currentTab === 'create' ? 'block' : 'hidden')}>
            <run_once_1.default siteInfo={siteInfo} inputs={inputs} inputsRef={inputsRef} onInputsChange={setInputs} promptConfig={promptConfig} onSend={handleSend} visionConfig={visionConfig} onVisionFilesChange={setCompletionFiles} runControl={runControl}/>
          </div>
          <div className={(0, classnames_1.cn)(isInBatchTab ? 'block' : 'hidden')}>
            <run_batch_1.default vars={promptConfig.prompt_variables} onSend={handleRunBatch} isAllFinished={allTasksRun}/>
          </div>
          {currentTab === 'saved' && (<saved_items_1.default className={(0, classnames_1.cn)(isPC ? 'mt-6' : 'mt-4')} isShowTextToSpeech={textToSpeechConfig?.enabled} list={savedMessages} onRemove={handleRemoveSavedMessage} onStartCreateContent={() => setCurrentTab('create')}/>)}
        </div>
        {/* powered by */}
        {!customConfig?.remove_webapp_brand && (<div className={(0, classnames_1.cn)('flex shrink-0 items-center gap-1.5 bg-components-panel-bg py-3', isPC ? 'px-8' : 'px-4', !isPC && resultExisted && 'rounded-b-2xl border-b-[0.5px] border-divider-regular')}>
            <div className="system-2xs-medium-uppercase text-text-tertiary">{t('chat.poweredBy', { ns: 'share' })}</div>
            {systemFeatures.branding.enabled && systemFeatures.branding.workspace_logo
                ? <img src={systemFeatures.branding.workspace_logo} alt="logo" className="block h-5 w-auto"/>
                : customConfig?.replace_webapp_logo
                    ? <img src={`${customConfig?.replace_webapp_logo}`} alt="logo" className="block h-5 w-auto"/>
                    : <dify_logo_1.default size="small"/>}
          </div>)}
      </div>
      {/* Result */}
      <div className={(0, classnames_1.cn)(isPC
            ? 'h-full w-0 grow'
            : isShowResultPanel
                ? 'fixed inset-0 z-50 bg-background-overlay backdrop-blur-sm'
                : resultExisted
                    ? 'relative h-16 shrink-0 overflow-hidden bg-background-default-burn pt-2.5'
                    : '')}>
        {!isPC && (<div className={(0, classnames_1.cn)(isShowResultPanel
                ? 'flex items-center justify-center p-2 pt-6'
                : 'absolute left-0 top-0 z-10 flex w-full items-center justify-center px-2 pb-[57px] pt-[3px]')} onClick={() => {
                if (isShowResultPanel)
                    hideResultPanel();
                else
                    showResultPanel();
            }}>
            <div className="h-1 w-8 cursor-grab rounded bg-divider-solid"/>
          </div>)}
        {renderResWrap}
      </div>
    </div>);
};
exports.default = TextGeneration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFXWiw0Q0FHeUI7QUFDekIsbUNBQW1DO0FBQ25DLGdEQUFpRDtBQUNqRCwrQkFBOEI7QUFDOUIsaUNBQWdFO0FBQ2hFLGlEQUE4QztBQUM5QyxnRkFBdUU7QUFDdkUsNkRBQW9EO0FBQ3BELHVEQUErQztBQUMvQywyREFBbUQ7QUFDbkQsb0VBQTJEO0FBQzNELHVEQUErQztBQUMvQywwRUFBK0Q7QUFDL0QsOEVBQXFFO0FBQ3JFLHFDQUE2RjtBQUM3RiwyRUFBc0U7QUFDdEUsK0RBQTBEO0FBQzFELDZEQUF1RDtBQUN2RCw2REFBbUU7QUFDbkUsbUVBQXlEO0FBQ3pELGlEQUFxRDtBQUNyRCw0REFBb0Q7QUFDcEQsMkNBQXNHO0FBQ3RHLHFDQUF3RDtBQUN4RCxtREFBdUM7QUFDdkMsdURBQXNFO0FBQ3RFLHNEQUE2QztBQUM3QyxtREFBMEM7QUFDMUMsMkNBQWtDO0FBQ2xDLDJEQUFrRDtBQUVsRCxNQUFNLFVBQVUsR0FBRywwQkFBaUIsQ0FBQSxDQUFDLHVGQUF1RjtBQUM1SCxJQUFLLFVBS0o7QUFMRCxXQUFLLFVBQVU7SUFDYixpQ0FBbUIsQ0FBQTtJQUNuQixpQ0FBbUIsQ0FBQTtJQUNuQixxQ0FBdUIsQ0FBQTtJQUN2QiwrQkFBaUIsQ0FBQTtBQUNuQixDQUFDLEVBTEksVUFBVSxLQUFWLFVBQVUsUUFLZDtBQWtCRCxNQUFNLGNBQWMsR0FBbUIsQ0FBQyxFQUN0QyxjQUFjLEdBQUcsS0FBSyxFQUN0QixnQkFBZ0IsRUFDaEIsVUFBVSxHQUFHLEtBQUssR0FDbkIsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQTtJQUV4QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxLQUFLLEdBQUcsSUFBQSx5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RixDQUFDLENBQUMsaUJBQWlCO1lBQ25CLENBQUMsQ0FBQyxpQkFBaUI7Z0JBQ2pCLENBQUMsQ0FBQywyREFBMkQ7Z0JBQzdELENBQUMsQ0FBQyxhQUFhO29CQUNiLENBQUMsQ0FBQywwRUFBMEU7b0JBQzVFLENBQUMsQ0FBQyxFQUFFLENBQ1gsQ0FBQyxDQUVBO1FBQUEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUNSLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUNYLGlCQUFpQjtnQkFDZixDQUFDLENBQUMsMkNBQTJDO2dCQUM3QyxDQUFDLENBQUMsNEZBQTRGLENBQ2pHLENBQUMsQ0FDRixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxpQkFBaUI7b0JBQ25CLGVBQWUsRUFBRSxDQUFBOztvQkFFakIsZUFBZSxFQUFFLENBQUE7WUFDckIsQ0FBQyxDQUFDLENBRUY7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsOENBQThDLEVBQy9EO1VBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNEO1FBQUEsQ0FBQyxhQUFhLENBQ2hCO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHtcbiAgTW9yZUxpa2VUaGlzQ29uZmlnLFxuICBQcm9tcHRDb25maWcsXG4gIFNhdmVkTWVzc2FnZSxcbiAgVGV4dFRvU3BlZWNoQ29uZmlnLFxufSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB0eXBlIHsgSW5zdGFsbGVkQXBwIH0gZnJvbSAnQC9tb2RlbHMvZXhwbG9yZSdcbmltcG9ydCB0eXBlIHsgU2l0ZUluZm8gfSBmcm9tICdAL21vZGVscy9zaGFyZSdcbmltcG9ydCB0eXBlIHsgVmlzaW9uRmlsZSwgVmlzaW9uU2V0dGluZ3MgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7XG4gIFJpQm9va21hcmszTGluZSxcbiAgUmlFcnJvcldhcm5pbmdGaWxsLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlQm9vbGVhbiB9IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IHVzZVNlYXJjaFBhcmFtcyB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IFNhdmVkSXRlbXMgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvdGV4dC1nZW5lcmF0ZS9zYXZlZC1pdGVtcydcbmltcG9ydCBBcHBJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hcHAtaWNvbidcbmltcG9ydCBCYWRnZSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYmFkZ2UnXG5pbXBvcnQgTG9hZGluZyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbG9hZGluZydcbmltcG9ydCBEaWZ5TG9nbyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbG9nby9kaWZ5LWxvZ28nXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IFJlcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3NoYXJlL3RleHQtZ2VuZXJhdGlvbi9yZXN1bHQnXG5pbXBvcnQgUnVuT25jZSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3NoYXJlL3RleHQtZ2VuZXJhdGlvbi9ydW4tb25jZSdcbmltcG9ydCB7IGFwcERlZmF1bHRJY29uQmFja2dyb3VuZCwgQkFUQ0hfQ09OQ1VSUkVOQ1ksIERFRkFVTFRfVkFMVUVfTUFYX0xFTiB9IGZyb20gJ0AvY29uZmlnJ1xuaW1wb3J0IHsgdXNlR2xvYmFsUHVibGljU3RvcmUgfSBmcm9tICdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0J1xuaW1wb3J0IHsgdXNlV2ViQXBwU3RvcmUgfSBmcm9tICdAL2NvbnRleHQvd2ViLWFwcC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlQXBwRmF2aWNvbiB9IGZyb20gJ0AvaG9va3MvdXNlLWFwcC1mYXZpY29uJ1xuaW1wb3J0IHVzZUJyZWFrcG9pbnRzLCB7IE1lZGlhVHlwZSB9IGZyb20gJ0AvaG9va3MvdXNlLWJyZWFrcG9pbnRzJ1xuaW1wb3J0IHVzZURvY3VtZW50VGl0bGUgZnJvbSAnQC9ob29rcy91c2UtZG9jdW1lbnQtdGl0bGUnXG5pbXBvcnQgeyBjaGFuZ2VMYW5ndWFnZSB9IGZyb20gJ0AvaTE4bi1jb25maWcvY2xpZW50J1xuaW1wb3J0IHsgQWNjZXNzTW9kZSB9IGZyb20gJ0AvbW9kZWxzL2FjY2Vzcy1jb250cm9sJ1xuaW1wb3J0IHsgZmV0Y2hTYXZlZE1lc3NhZ2UgYXMgZG9GZXRjaFNhdmVkTWVzc2FnZSwgcmVtb3ZlTWVzc2FnZSwgc2F2ZU1lc3NhZ2UgfSBmcm9tICdAL3NlcnZpY2Uvc2hhcmUnXG5pbXBvcnQgeyBSZXNvbHV0aW9uLCBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgeyB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzIH0gZnJvbSAnQC91dGlscy9tb2RlbC1jb25maWcnXG5pbXBvcnQgVGFiSGVhZGVyIGZyb20gJy4uLy4uL2Jhc2UvdGFiLWhlYWRlcidcbmltcG9ydCBNZW51RHJvcGRvd24gZnJvbSAnLi9tZW51LWRyb3Bkb3duJ1xuaW1wb3J0IFJ1bkJhdGNoIGZyb20gJy4vcnVuLWJhdGNoJ1xuaW1wb3J0IFJlc0Rvd25sb2FkIGZyb20gJy4vcnVuLWJhdGNoL3Jlcy1kb3dubG9hZCdcblxuY29uc3QgR1JPVVBfU0laRSA9IEJBVENIX0NPTkNVUlJFTkNZIC8vIHRvIGF2b2lkIFJQTShSZXF1ZXN0IHBlciBtaW51dGUpIGxpbWl0LiBUaGUgZ3JvdXAgdGFzayBmaW5pc2hlZCB0aGVuIHRoZSBuZXh0IGdyb3VwLlxuZW51bSBUYXNrU3RhdHVzIHtcbiAgcGVuZGluZyA9ICdwZW5kaW5nJyxcbiAgcnVubmluZyA9ICdydW5uaW5nJyxcbiAgY29tcGxldGVkID0gJ2NvbXBsZXRlZCcsXG4gIGZhaWxlZCA9ICdmYWlsZWQnLFxufVxuXG50eXBlIFRhc2tQYXJhbSA9IHtcbiAgaW5wdXRzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG59XG5cbnR5cGUgVGFzayA9IHtcbiAgaWQ6IG51bWJlclxuICBzdGF0dXM6IFRhc2tTdGF0dXNcbiAgcGFyYW1zOiBUYXNrUGFyYW1cbn1cblxuZXhwb3J0IHR5cGUgSU1haW5Qcm9wcyA9IHtcbiAgaXNJbnN0YWxsZWRBcHA/OiBib29sZWFuXG4gIGluc3RhbGxlZEFwcEluZm8/OiBJbnN0YWxsZWRBcHBcbiAgaXNXb3JrZmxvdz86IGJvb2xlYW5cbn1cblxuY29uc3QgVGV4dEdlbmVyYXRpb246IEZDPElNYWluUHJvcHM+ID0gKHtcbiAgaXNJbnN0YWxsZWRBcHAgPSBmYWxzZSxcbiAgaW5zdGFsbGVkQXBwSW5mbyxcbiAgaXNXb3JrZmxvdyA9IGZhbHNlLFxufSkgPT4ge1xuICBjb25zdCB7IG5vdGlmeSB9ID0gVG9hc3RcblxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgbWVkaWEgPSB1c2VCcmVha3BvaW50cygpXG4gIGNvbnN0IGlzUEMgPSBtZWRpYSA9PT0gTWVkaWFUeXBlLnBjXG5cbiAgY29uc3Qgc2VhcmNoUGFyYW1zID0gdXNlU2VhcmNoUGFyYW1zKClcbiAgY29uc3QgbW9kZSA9IHNlYXJjaFBhcmFtcy5nZXQoJ21vZGUnKSB8fCAnY3JlYXRlJ1xuICBjb25zdCBbY3VycmVudFRhYiwgc2V0Q3VycmVudFRhYl0gPSB1c2VTdGF0ZTxzdHJpbmc+KFsnY3JlYXRlJywgJ2JhdGNoJ10uaW5jbHVkZXMobW9kZSkgPyBtb2RlIDogJ2NyZWF0ZScpXG5cbiAgLy8gTm90aWNlIHRoaXMgc2l0dWF0aW9uIGlzQ2FsbEJhdGNoQVBJIGJ1dCBub3QgaW4gYmF0Y2ggdGFiXG4gIGNvbnN0IFtpc0NhbGxCYXRjaEFQSSwgc2V0SXNDYWxsQmF0Y2hBUEldID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGlzSW5CYXRjaFRhYiA9IGN1cnJlbnRUYWIgPT09ICdiYXRjaCdcbiAgY29uc3QgW2lucHV0cywgZG9TZXRJbnB1dHNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55Pj4oe30pXG4gIGNvbnN0IGlucHV0c1JlZiA9IHVzZVJlZihpbnB1dHMpXG4gIGNvbnN0IHNldElucHV0cyA9IHVzZUNhbGxiYWNrKChuZXdJbnB1dHM6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHtcbiAgICBkb1NldElucHV0cyhuZXdJbnB1dHMpXG4gICAgaW5wdXRzUmVmLmN1cnJlbnQgPSBuZXdJbnB1dHNcbiAgfSwgW10pXG4gIGNvbnN0IHN5c3RlbUZlYXR1cmVzID0gdXNlR2xvYmFsUHVibGljU3RvcmUocyA9PiBzLnN5c3RlbUZlYXR1cmVzKVxuICBjb25zdCBbYXBwSWQsIHNldEFwcElkXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpXG4gIGNvbnN0IFtzaXRlSW5mbywgc2V0U2l0ZUluZm9dID0gdXNlU3RhdGU8U2l0ZUluZm8gfCBudWxsPihudWxsKVxuICBjb25zdCBbY3VzdG9tQ29uZmlnLCBzZXRDdXN0b21Db25maWddID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55PiB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtwcm9tcHRDb25maWcsIHNldFByb21wdENvbmZpZ10gPSB1c2VTdGF0ZTxQcm9tcHRDb25maWcgfCBudWxsPihudWxsKVxuICBjb25zdCBbbW9yZUxpa2VUaGlzQ29uZmlnLCBzZXRNb3JlTGlrZVRoaXNDb25maWddID0gdXNlU3RhdGU8TW9yZUxpa2VUaGlzQ29uZmlnIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW3RleHRUb1NwZWVjaENvbmZpZywgc2V0VGV4dFRvU3BlZWNoQ29uZmlnXSA9IHVzZVN0YXRlPFRleHRUb1NwZWVjaENvbmZpZyB8IG51bGw+KG51bGwpXG5cbiAgLy8gc2F2ZSBtZXNzYWdlXG4gIGNvbnN0IFtzYXZlZE1lc3NhZ2VzLCBzZXRTYXZlZE1lc3NhZ2VzXSA9IHVzZVN0YXRlPFNhdmVkTWVzc2FnZVtdPihbXSlcbiAgY29uc3QgZmV0Y2hTYXZlZE1lc3NhZ2UgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVzOiBhbnkgPSBhd2FpdCBkb0ZldGNoU2F2ZWRNZXNzYWdlKGlzSW5zdGFsbGVkQXBwLCBhcHBJZClcbiAgICBzZXRTYXZlZE1lc3NhZ2VzKHJlcy5kYXRhKVxuICB9LCBbaXNJbnN0YWxsZWRBcHAsIGFwcElkXSlcbiAgY29uc3QgaGFuZGxlU2F2ZU1lc3NhZ2UgPSBhc3luYyAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHtcbiAgICBhd2FpdCBzYXZlTWVzc2FnZShtZXNzYWdlSWQsIGlzSW5zdGFsbGVkQXBwLCBhcHBJZClcbiAgICBub3RpZnkoeyB0eXBlOiAnc3VjY2VzcycsIG1lc3NhZ2U6IHQoJ2FwaS5zYXZlZCcsIHsgbnM6ICdjb21tb24nIH0pIH0pXG4gICAgZmV0Y2hTYXZlZE1lc3NhZ2UoKVxuICB9XG4gIGNvbnN0IGhhbmRsZVJlbW92ZVNhdmVkTWVzc2FnZSA9IGFzeW5jIChtZXNzYWdlSWQ6IHN0cmluZykgPT4ge1xuICAgIGF3YWl0IHJlbW92ZU1lc3NhZ2UobWVzc2FnZUlkLCBpc0luc3RhbGxlZEFwcCwgYXBwSWQpXG4gICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhcGkucmVtb3ZlJywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICBmZXRjaFNhdmVkTWVzc2FnZSgpXG4gIH1cblxuICAvLyBzZW5kIG1lc3NhZ2UgdGFza1xuICBjb25zdCBbY29udHJvbFNlbmQsIHNldENvbnRyb2xTZW5kXSA9IHVzZVN0YXRlKDApXG4gIGNvbnN0IFtjb250cm9sU3RvcFJlc3BvbmRpbmcsIHNldENvbnRyb2xTdG9wUmVzcG9uZGluZ10gPSB1c2VTdGF0ZSgwKVxuICBjb25zdCBbdmlzaW9uQ29uZmlnLCBzZXRWaXNpb25Db25maWddID0gdXNlU3RhdGU8VmlzaW9uU2V0dGluZ3M+KHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICBudW1iZXJfbGltaXRzOiAyLFxuICAgIGRldGFpbDogUmVzb2x1dGlvbi5sb3csXG4gICAgdHJhbnNmZXJfbWV0aG9kczogW1RyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGVdLFxuICB9KVxuICBjb25zdCBbY29tcGxldGlvbkZpbGVzLCBzZXRDb21wbGV0aW9uRmlsZXNdID0gdXNlU3RhdGU8VmlzaW9uRmlsZVtdPihbXSlcbiAgY29uc3QgW3J1bkNvbnRyb2wsIHNldFJ1bkNvbnRyb2xdID0gdXNlU3RhdGU8eyBvblN0b3A6ICgpID0+IFByb21pc2U8dm9pZD4gfCB2b2lkLCBpc1N0b3BwaW5nOiBib29sZWFuIH0gfCBudWxsPihudWxsKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzQ2FsbEJhdGNoQVBJKVxuICAgICAgc2V0UnVuQ29udHJvbChudWxsKVxuICB9LCBbaXNDYWxsQmF0Y2hBUEldKVxuXG4gIGNvbnN0IGhhbmRsZVNlbmQgPSAoKSA9PiB7XG4gICAgc2V0SXNDYWxsQmF0Y2hBUEkoZmFsc2UpXG4gICAgc2V0Q29udHJvbFNlbmQoRGF0ZS5ub3coKSlcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB0cy9uby11c2UtYmVmb3JlLWRlZmluZVxuICAgIHNldEFsbFRhc2tMaXN0KFtdKSAvLyBjbGVhciBiYXRjaCB0YXNrIHJ1bm5pbmcgc3RhdHVzXG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdHMvbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICBzaG93UmVzdWx0UGFuZWwoKVxuICB9XG5cbiAgY29uc3QgW2NvbnRyb2xSZXRyeSwgc2V0Q29udHJvbFJldHJ5XSA9IHVzZVN0YXRlKDApXG4gIGNvbnN0IGhhbmRsZVJldHJ5QWxsRmFpbGVkVGFzayA9ICgpID0+IHtcbiAgICBzZXRDb250cm9sUmV0cnkoRGF0ZS5ub3coKSlcbiAgfVxuICBjb25zdCBbYWxsVGFza0xpc3QsIGRvU2V0QWxsVGFza0xpc3RdID0gdXNlU3RhdGU8VGFza1tdPihbXSlcbiAgY29uc3QgYWxsVGFza0xpc3RSZWYgPSB1c2VSZWY8VGFza1tdPihbXSlcbiAgY29uc3QgZ2V0TGF0ZXN0VGFza0xpc3QgPSAoKSA9PiBhbGxUYXNrTGlzdFJlZi5jdXJyZW50XG4gIGNvbnN0IHNldEFsbFRhc2tMaXN0ID0gKHRhc2tMaXN0OiBUYXNrW10pID0+IHtcbiAgICBkb1NldEFsbFRhc2tMaXN0KHRhc2tMaXN0KVxuICAgIGFsbFRhc2tMaXN0UmVmLmN1cnJlbnQgPSB0YXNrTGlzdFxuICB9XG4gIGNvbnN0IHBlbmRpbmdUYXNrTGlzdCA9IGFsbFRhc2tMaXN0LmZpbHRlcih0YXNrID0+IHRhc2suc3RhdHVzID09PSBUYXNrU3RhdHVzLnBlbmRpbmcpXG4gIGNvbnN0IG5vUGVuZGluZ1Rhc2sgPSBwZW5kaW5nVGFza0xpc3QubGVuZ3RoID09PSAwXG4gIGNvbnN0IHNob3dUYXNrTGlzdCA9IGFsbFRhc2tMaXN0LmZpbHRlcih0YXNrID0+IHRhc2suc3RhdHVzICE9PSBUYXNrU3RhdHVzLnBlbmRpbmcpXG4gIGNvbnN0IGN1cnJHcm91cE51bVJlZiA9IHVzZVJlZigwKVxuXG4gIGNvbnN0IHNldEN1cnJHcm91cE51bSA9IChudW06IG51bWJlcikgPT4ge1xuICAgIGN1cnJHcm91cE51bVJlZi5jdXJyZW50ID0gbnVtXG4gIH1cbiAgY29uc3QgZ2V0Q3Vyckdyb3VwTnVtID0gKCkgPT4ge1xuICAgIHJldHVybiBjdXJyR3JvdXBOdW1SZWYuY3VycmVudFxuICB9XG4gIGNvbnN0IGFsbFN1Y2Nlc3NUYXNrTGlzdCA9IGFsbFRhc2tMaXN0LmZpbHRlcih0YXNrID0+IHRhc2suc3RhdHVzID09PSBUYXNrU3RhdHVzLmNvbXBsZXRlZClcbiAgY29uc3QgYWxsRmFpbGVkVGFza0xpc3QgPSBhbGxUYXNrTGlzdC5maWx0ZXIodGFzayA9PiB0YXNrLnN0YXR1cyA9PT0gVGFza1N0YXR1cy5mYWlsZWQpXG4gIGNvbnN0IGFsbFRhc2tzRmluaXNoZWQgPSBhbGxUYXNrTGlzdC5ldmVyeSh0YXNrID0+IHRhc2suc3RhdHVzID09PSBUYXNrU3RhdHVzLmNvbXBsZXRlZClcbiAgY29uc3QgYWxsVGFza3NSdW4gPSBhbGxUYXNrTGlzdC5ldmVyeSh0YXNrID0+IFtUYXNrU3RhdHVzLmNvbXBsZXRlZCwgVGFza1N0YXR1cy5mYWlsZWRdLmluY2x1ZGVzKHRhc2suc3RhdHVzKSlcbiAgY29uc3QgYmF0Y2hDb21wbGV0aW9uUmVzUmVmID0gdXNlUmVmPFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHt9KVxuICBjb25zdCBzZXRCYXRjaENvbXBsZXRpb25SZXMgPSAocmVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiB7XG4gICAgYmF0Y2hDb21wbGV0aW9uUmVzUmVmLmN1cnJlbnQgPSByZXNcbiAgfVxuICBjb25zdCBnZXRCYXRjaENvbXBsZXRpb25SZXMgPSAoKSA9PiBiYXRjaENvbXBsZXRpb25SZXNSZWYuY3VycmVudFxuICBjb25zdCBleHBvcnRSZXMgPSBhbGxUYXNrTGlzdC5tYXAoKHRhc2spID0+IHtcbiAgICBjb25zdCBiYXRjaENvbXBsZXRpb25SZXNMYXRlc3QgPSBnZXRCYXRjaENvbXBsZXRpb25SZXMoKVxuICAgIGNvbnN0IHJlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9XG4gICAgY29uc3QgeyBpbnB1dHMgfSA9IHRhc2sucGFyYW1zXG4gICAgcHJvbXB0Q29uZmlnPy5wcm9tcHRfdmFyaWFibGVzLmZvckVhY2goKHYpID0+IHtcbiAgICAgIHJlc1t2Lm5hbWVdID0gaW5wdXRzW3Yua2V5XVxuICAgIH0pXG4gICAgbGV0IHJlc3VsdCA9IGJhdGNoQ29tcGxldGlvblJlc0xhdGVzdFt0YXNrLmlkXVxuICAgIC8vIHRhc2sgbWlnaHQgcmV0dXJuIG11bHRpcGxlIGZpZWxkcywgc2hvdWxkIG1hcnNoYWwgb2JqZWN0IHRvIHN0cmluZ1xuICAgIGlmICh0eXBlb2YgYmF0Y2hDb21wbGV0aW9uUmVzTGF0ZXN0W3Rhc2suaWRdID09PSAnb2JqZWN0JylcbiAgICAgIHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdClcblxuICAgIHJlc1t0KCdnZW5lcmF0aW9uLmNvbXBsZXRpb25SZXN1bHQnLCB7IG5zOiAnc2hhcmUnIH0pXSA9IHJlc3VsdFxuICAgIHJldHVybiByZXNcbiAgfSlcbiAgY29uc3QgY2hlY2tCYXRjaElucHV0cyA9IChkYXRhOiBzdHJpbmdbXVtdKSA9PiB7XG4gICAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdnZW5lcmF0aW9uLmVycm9yTXNnLmVtcHR5JywgeyBuczogJ3NoYXJlJyB9KSB9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IGhlYWRlckRhdGEgPSBkYXRhWzBdXG4gICAgbGV0IGlzTWFwVmFyTmFtZSA9IHRydWVcbiAgICBwcm9tcHRDb25maWc/LnByb21wdF92YXJpYWJsZXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGlmICghaXNNYXBWYXJOYW1lKVxuICAgICAgICByZXR1cm5cblxuICAgICAgaWYgKGl0ZW0ubmFtZSAhPT0gaGVhZGVyRGF0YVtpbmRleF0pXG4gICAgICAgIGlzTWFwVmFyTmFtZSA9IGZhbHNlXG4gICAgfSlcblxuICAgIGlmICghaXNNYXBWYXJOYW1lKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdnZW5lcmF0aW9uLmVycm9yTXNnLmZpbGVTdHJ1Y3ROb3RNYXRjaCcsIHsgbnM6ICdzaGFyZScgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGxldCBwYXlsb2FkRGF0YSA9IGRhdGEuc2xpY2UoMSlcbiAgICBpZiAocGF5bG9hZERhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdnZW5lcmF0aW9uLmVycm9yTXNnLmF0TGVhc3RPbmUnLCB7IG5zOiAnc2hhcmUnIH0pIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBjaGVjayBtaWRkbGUgZW1wdHkgbGluZVxuICAgIGNvbnN0IGFsbEVtcHR5TGluZUluZGV4ZXMgPSBwYXlsb2FkRGF0YS5maWx0ZXIoaXRlbSA9PiBpdGVtLmV2ZXJ5KGkgPT4gaSA9PT0gJycpKS5tYXAoaXRlbSA9PiBwYXlsb2FkRGF0YS5pbmRleE9mKGl0ZW0pKVxuICAgIGlmIChhbGxFbXB0eUxpbmVJbmRleGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBoYXNNaWRkbGVFbXB0eUxpbmUgPSBmYWxzZVxuICAgICAgbGV0IHN0YXJ0SW5kZXggPSBhbGxFbXB0eUxpbmVJbmRleGVzWzBdIC0gMVxuICAgICAgYWxsRW1wdHlMaW5lSW5kZXhlcy5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaGFzTWlkZGxlRW1wdHlMaW5lKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmIChzdGFydEluZGV4ICsgMSAhPT0gaW5kZXgpIHtcbiAgICAgICAgICBoYXNNaWRkbGVFbXB0eUxpbmUgPSB0cnVlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgc3RhcnRJbmRleCsrXG4gICAgICB9KVxuXG4gICAgICBpZiAoaGFzTWlkZGxlRW1wdHlMaW5lKSB7XG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2dlbmVyYXRpb24uZXJyb3JNc2cuZW1wdHlMaW5lJywgeyBuczogJ3NoYXJlJywgcm93SW5kZXg6IHN0YXJ0SW5kZXggKyAyIH0pIH0pXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIHJvdyBmb3JtYXRcbiAgICBwYXlsb2FkRGF0YSA9IHBheWxvYWREYXRhLmZpbHRlcihpdGVtID0+ICFpdGVtLmV2ZXJ5KGkgPT4gaSA9PT0gJycpKVxuICAgIC8vIGFmdGVyIHJlbW92ZSBlbXB0eSByb3dzIGluIHRoZSBlbmQsIGNoZWNrZWQgYWdhaW5cbiAgICBpZiAocGF5bG9hZERhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdnZW5lcmF0aW9uLmVycm9yTXNnLmF0TGVhc3RPbmUnLCB7IG5zOiAnc2hhcmUnIH0pIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgbGV0IGVycm9yUm93SW5kZXggPSAwXG4gICAgbGV0IHJlcXVpcmVkVmFyTmFtZSA9ICcnXG4gICAgbGV0IG1vcmVUaGFuTWF4TGVuZ3RoVmFyTmFtZSA9ICcnXG4gICAgbGV0IG1heExlbmd0aCA9IDBcbiAgICBwYXlsb2FkRGF0YS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGVycm9yUm93SW5kZXggIT09IDApXG4gICAgICAgIHJldHVyblxuXG4gICAgICBwcm9tcHRDb25maWc/LnByb21wdF92YXJpYWJsZXMuZm9yRWFjaCgodmFySXRlbSwgdmFySW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGVycm9yUm93SW5kZXggIT09IDApXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIGlmICh2YXJJdGVtLnR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29uc3QgbWF4TGVuID0gdmFySXRlbS5tYXhfbGVuZ3RoIHx8IERFRkFVTFRfVkFMVUVfTUFYX0xFTlxuICAgICAgICAgIGlmIChpdGVtW3ZhckluZGV4XS5sZW5ndGggPiBtYXhMZW4pIHtcbiAgICAgICAgICAgIG1vcmVUaGFuTWF4TGVuZ3RoVmFyTmFtZSA9IHZhckl0ZW0ubmFtZVxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gbWF4TGVuXG4gICAgICAgICAgICBlcnJvclJvd0luZGV4ID0gaW5kZXggKyAxXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YXJJdGVtLnJlcXVpcmVkKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmIChpdGVtW3ZhckluZGV4XS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgcmVxdWlyZWRWYXJOYW1lID0gdmFySXRlbS5uYW1lXG4gICAgICAgICAgZXJyb3JSb3dJbmRleCA9IGluZGV4ICsgMVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpZiAoZXJyb3JSb3dJbmRleCAhPT0gMCkge1xuICAgICAgaWYgKHJlcXVpcmVkVmFyTmFtZSlcbiAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnZ2VuZXJhdGlvbi5lcnJvck1zZy5pbnZhbGlkTGluZScsIHsgbnM6ICdzaGFyZScsIHJvd0luZGV4OiBlcnJvclJvd0luZGV4ICsgMSwgdmFyTmFtZTogcmVxdWlyZWRWYXJOYW1lIH0pIH0pXG5cbiAgICAgIGlmIChtb3JlVGhhbk1heExlbmd0aFZhck5hbWUpXG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2dlbmVyYXRpb24uZXJyb3JNc2cubW9yZVRoYW5NYXhMZW5ndGhMaW5lJywgeyBuczogJ3NoYXJlJywgcm93SW5kZXg6IGVycm9yUm93SW5kZXggKyAxLCB2YXJOYW1lOiBtb3JlVGhhbk1heExlbmd0aFZhck5hbWUsIG1heExlbmd0aCB9KSB9KVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBoYW5kbGVSdW5CYXRjaCA9IChkYXRhOiBzdHJpbmdbXVtdKSA9PiB7XG4gICAgaWYgKCFjaGVja0JhdGNoSW5wdXRzKGRhdGEpKVxuICAgICAgcmV0dXJuXG4gICAgaWYgKCFhbGxUYXNrc0ZpbmlzaGVkKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnaW5mbycsIG1lc3NhZ2U6IHQoJ2Vycm9yTWVzc2FnZS53YWl0Rm9yQmF0Y2hSZXNwb25zZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHBheWxvYWREYXRhID0gZGF0YS5maWx0ZXIoaXRlbSA9PiAhaXRlbS5ldmVyeShpID0+IGkgPT09ICcnKSkuc2xpY2UoMSlcbiAgICBjb25zdCB2YXJMZW4gPSBwcm9tcHRDb25maWc/LnByb21wdF92YXJpYWJsZXMubGVuZ3RoIHx8IDBcbiAgICBzZXRJc0NhbGxCYXRjaEFQSSh0cnVlKVxuICAgIGNvbnN0IGFsbFRhc2tMaXN0OiBUYXNrW10gPSBwYXlsb2FkRGF0YS5tYXAoKGl0ZW0sIGkpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0czogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG4gICAgICBpZiAodmFyTGVuID4gMCkge1xuICAgICAgICBpdGVtLnNsaWNlKDAsIHZhckxlbikuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFyU2NoZW1hID0gcHJvbXB0Q29uZmlnPy5wcm9tcHRfdmFyaWFibGVzW2luZGV4XVxuICAgICAgICAgIGlucHV0c1t2YXJTY2hlbWE/LmtleSBhcyBzdHJpbmddID0gaW5wdXRcbiAgICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBpZiAodmFyU2NoZW1hPy50eXBlID09PSAnc3RyaW5nJyB8fCB2YXJTY2hlbWE/LnR5cGUgPT09ICdwYXJhZ3JhcGgnKVxuICAgICAgICAgICAgICBpbnB1dHNbdmFyU2NoZW1hPy5rZXkgYXMgc3RyaW5nXSA9ICcnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGlucHV0c1t2YXJTY2hlbWE/LmtleSBhcyBzdHJpbmddID0gdW5kZWZpbmVkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGkgKyAxLFxuICAgICAgICBzdGF0dXM6IGkgPCBHUk9VUF9TSVpFID8gVGFza1N0YXR1cy5ydW5uaW5nIDogVGFza1N0YXR1cy5wZW5kaW5nLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBpbnB1dHMsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfSlcbiAgICBzZXRBbGxUYXNrTGlzdChhbGxUYXNrTGlzdClcbiAgICBzZXRDdXJyR3JvdXBOdW0oMClcbiAgICBzZXRDb250cm9sU2VuZChEYXRlLm5vdygpKVxuICAgIC8vIGNsZWFyIHJ1biBvbmNlIHRhc2sgc3RhdHVzXG4gICAgc2V0Q29udHJvbFN0b3BSZXNwb25kaW5nKERhdGUubm93KCkpXG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdHMvbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICBzaG93UmVzdWx0UGFuZWwoKVxuICB9XG4gIGNvbnN0IGhhbmRsZUNvbXBsZXRlZCA9IChjb21wbGV0aW9uUmVzOiBzdHJpbmcsIHRhc2tJZD86IG51bWJlciwgaXNTdWNjZXNzPzogYm9vbGVhbikgPT4ge1xuICAgIGNvbnN0IGFsbFRhc2tMaXN0TGF0ZXN0ID0gZ2V0TGF0ZXN0VGFza0xpc3QoKVxuICAgIGNvbnN0IGJhdGNoQ29tcGxldGlvblJlc0xhdGVzdCA9IGdldEJhdGNoQ29tcGxldGlvblJlcygpXG4gICAgY29uc3QgcGVuZGluZ1Rhc2tMaXN0ID0gYWxsVGFza0xpc3RMYXRlc3QuZmlsdGVyKHRhc2sgPT4gdGFzay5zdGF0dXMgPT09IFRhc2tTdGF0dXMucGVuZGluZylcbiAgICBjb25zdCBydW5UYXNrc0NvdW50ID0gMSArIGFsbFRhc2tMaXN0TGF0ZXN0LmZpbHRlcih0YXNrID0+IFtUYXNrU3RhdHVzLmNvbXBsZXRlZCwgVGFza1N0YXR1cy5mYWlsZWRdLmluY2x1ZGVzKHRhc2suc3RhdHVzKSkubGVuZ3RoXG4gICAgY29uc3QgbmVlZFRvQWRkTmV4dEdyb3VwVGFzayA9IChnZXRDdXJyR3JvdXBOdW0oKSAhPT0gcnVuVGFza3NDb3VudCkgJiYgcGVuZGluZ1Rhc2tMaXN0Lmxlbmd0aCA+IDAgJiYgKHJ1blRhc2tzQ291bnQgJSBHUk9VUF9TSVpFID09PSAwIHx8IChhbGxUYXNrTGlzdExhdGVzdC5sZW5ndGggLSBydW5UYXNrc0NvdW50IDwgR1JPVVBfU0laRSkpXG4gICAgLy8gYXZvaWQgYWRkIG1hbnkgdGFzayBhdCB0aGUgc2FtZSB0aW1lXG4gICAgaWYgKG5lZWRUb0FkZE5leHRHcm91cFRhc2spXG4gICAgICBzZXRDdXJyR3JvdXBOdW0ocnVuVGFza3NDb3VudClcblxuICAgIGNvbnN0IG5leHRQZW5kaW5nVGFza0lkcyA9IG5lZWRUb0FkZE5leHRHcm91cFRhc2sgPyBwZW5kaW5nVGFza0xpc3Quc2xpY2UoMCwgR1JPVVBfU0laRSkubWFwKGl0ZW0gPT4gaXRlbS5pZCkgOiBbXVxuICAgIGNvbnN0IG5ld0FsbFRhc2tMaXN0ID0gYWxsVGFza0xpc3RMYXRlc3QubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbS5pZCA9PT0gdGFza0lkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzdGF0dXM6IGlzU3VjY2VzcyA/IFRhc2tTdGF0dXMuY29tcGxldGVkIDogVGFza1N0YXR1cy5mYWlsZWQsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZWVkVG9BZGROZXh0R3JvdXBUYXNrICYmIG5leHRQZW5kaW5nVGFza0lkcy5pbmNsdWRlcyhpdGVtLmlkKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc3RhdHVzOiBUYXNrU3RhdHVzLnJ1bm5pbmcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVtXG4gICAgfSlcbiAgICBzZXRBbGxUYXNrTGlzdChuZXdBbGxUYXNrTGlzdClcbiAgICBpZiAodGFza0lkKSB7XG4gICAgICBzZXRCYXRjaENvbXBsZXRpb25SZXMoe1xuICAgICAgICAuLi5iYXRjaENvbXBsZXRpb25SZXNMYXRlc3QsXG4gICAgICAgIFtgJHt0YXNrSWR9YF06IGNvbXBsZXRpb25SZXMsXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFwcERhdGEgPSB1c2VXZWJBcHBTdG9yZShzID0+IHMuYXBwSW5mbylcbiAgY29uc3QgYXBwUGFyYW1zID0gdXNlV2ViQXBwU3RvcmUocyA9PiBzLmFwcFBhcmFtcylcbiAgY29uc3QgYWNjZXNzTW9kZSA9IHVzZVdlYkFwcFN0b3JlKHMgPT4gcy53ZWJBcHBBY2Nlc3NNb2RlKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIWFwcERhdGEgfHwgIWFwcFBhcmFtcylcbiAgICAgICAgcmV0dXJuXG4gICAgICBpZiAoIWlzV29ya2Zsb3cpXG4gICAgICAgIGZldGNoU2F2ZWRNZXNzYWdlKClcbiAgICAgIGNvbnN0IHsgYXBwX2lkOiBhcHBJZCwgc2l0ZTogc2l0ZUluZm8sIGN1c3RvbV9jb25maWcgfSA9IGFwcERhdGFcbiAgICAgIHNldEFwcElkKGFwcElkKVxuICAgICAgc2V0U2l0ZUluZm8oc2l0ZUluZm8gYXMgU2l0ZUluZm8pXG4gICAgICBzZXRDdXN0b21Db25maWcoY3VzdG9tX2NvbmZpZylcbiAgICAgIGF3YWl0IGNoYW5nZUxhbmd1YWdlKHNpdGVJbmZvLmRlZmF1bHRfbGFuZ3VhZ2UpXG5cbiAgICAgIGNvbnN0IHsgdXNlcl9pbnB1dF9mb3JtLCBtb3JlX2xpa2VfdGhpcywgZmlsZV91cGxvYWQsIHRleHRfdG9fc3BlZWNoIH06IGFueSA9IGFwcFBhcmFtc1xuICAgICAgc2V0VmlzaW9uQ29uZmlnKHtcbiAgICAgICAgLy8gbGVnYWN5IG9mIGltYWdlIHVwbG9hZCBjb21wYXRpYmxlXG4gICAgICAgIC4uLmZpbGVfdXBsb2FkLFxuICAgICAgICB0cmFuc2Zlcl9tZXRob2RzOiBmaWxlX3VwbG9hZD8uYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzIHx8IGZpbGVfdXBsb2FkPy5hbGxvd2VkX3VwbG9hZF9tZXRob2RzLFxuICAgICAgICAvLyBsZWdhY3kgb2YgaW1hZ2UgdXBsb2FkIGNvbXBhdGlibGVcbiAgICAgICAgaW1hZ2VfZmlsZV9zaXplX2xpbWl0OiBhcHBQYXJhbXM/LnN5c3RlbV9wYXJhbWV0ZXJzLmltYWdlX2ZpbGVfc2l6ZV9saW1pdCxcbiAgICAgICAgZmlsZVVwbG9hZENvbmZpZzogYXBwUGFyYW1zPy5zeXN0ZW1fcGFyYW1ldGVycyxcbiAgICAgIH0gYXMgYW55KVxuICAgICAgY29uc3QgcHJvbXB0X3ZhcmlhYmxlcyA9IHVzZXJJbnB1dHNGb3JtVG9Qcm9tcHRWYXJpYWJsZXModXNlcl9pbnB1dF9mb3JtKVxuICAgICAgc2V0UHJvbXB0Q29uZmlnKHtcbiAgICAgICAgcHJvbXB0X3RlbXBsYXRlOiAnJywgLy8gcGxhY2Vob2xkZXIgZm9yIGZ1dHVyZVxuICAgICAgICBwcm9tcHRfdmFyaWFibGVzLFxuICAgICAgfSBhcyBQcm9tcHRDb25maWcpXG4gICAgICBzZXRNb3JlTGlrZVRoaXNDb25maWcobW9yZV9saWtlX3RoaXMpXG4gICAgICBzZXRUZXh0VG9TcGVlY2hDb25maWcodGV4dF90b19zcGVlY2gpXG4gICAgfSkoKVxuICB9LCBbYXBwRGF0YSwgYXBwUGFyYW1zLCBmZXRjaFNhdmVkTWVzc2FnZSwgaXNXb3JrZmxvd10pXG5cbiAgLy8gQ2FuIFVzZSBtZXRhZGF0YShodHRwczovL2JldGEubmV4dGpzLm9yZy9kb2NzL2FwaS1yZWZlcmVuY2UvbWV0YWRhdGEpIHRvIHNldCB0aXRsZS4gQnV0IGl0IG9ubHkgd29ya3MgaW4gc2VydmVyIHNpZGUgY2xpZW50LlxuICB1c2VEb2N1bWVudFRpdGxlKHNpdGVJbmZvPy50aXRsZSB8fCB0KCdnZW5lcmF0aW9uLnRpdGxlJywgeyBuczogJ3NoYXJlJyB9KSlcblxuICB1c2VBcHBGYXZpY29uKHtcbiAgICBlbmFibGU6ICFpc0luc3RhbGxlZEFwcCxcbiAgICBpY29uX3R5cGU6IHNpdGVJbmZvPy5pY29uX3R5cGUsXG4gICAgaWNvbjogc2l0ZUluZm8/Lmljb24sXG4gICAgaWNvbl9iYWNrZ3JvdW5kOiBzaXRlSW5mbz8uaWNvbl9iYWNrZ3JvdW5kLFxuICAgIGljb25fdXJsOiBzaXRlSW5mbz8uaWNvbl91cmwsXG4gIH0pXG5cbiAgY29uc3QgW2lzU2hvd1Jlc3VsdFBhbmVsLCB7IHNldFRydWU6IGRvU2hvd1Jlc3VsdFBhbmVsLCBzZXRGYWxzZTogaGlkZVJlc3VsdFBhbmVsIH1dID0gdXNlQm9vbGVhbihmYWxzZSlcbiAgY29uc3Qgc2hvd1Jlc3VsdFBhbmVsID0gKCkgPT4ge1xuICAgIC8vIGZpeDogdXNlQ2xpY2tBd2F5IGhpZGVSZXNTaWRlYmFyIHdpbGwgY2xvc2Ugc2lkZWJhclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZG9TaG93UmVzdWx0UGFuZWwoKVxuICAgIH0sIDApXG4gIH1cbiAgY29uc3QgW3Jlc3VsdEV4aXN0ZWQsIHNldFJlc3VsdEV4aXN0ZWRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgY29uc3QgcmVuZGVyUmVzID0gKHRhc2s/OiBUYXNrKSA9PiAoXG4gICAgPFJlc1xuICAgICAga2V5PXt0YXNrPy5pZH1cbiAgICAgIGlzV29ya2Zsb3c9e2lzV29ya2Zsb3d9XG4gICAgICBpc0NhbGxCYXRjaEFQST17aXNDYWxsQmF0Y2hBUEl9XG4gICAgICBpc1BDPXtpc1BDfVxuICAgICAgaXNNb2JpbGU9eyFpc1BDfVxuICAgICAgaXNJbnN0YWxsZWRBcHA9e2lzSW5zdGFsbGVkQXBwfVxuICAgICAgYXBwSWQ9e2FwcElkfVxuICAgICAgaW5zdGFsbGVkQXBwSW5mbz17aW5zdGFsbGVkQXBwSW5mb31cbiAgICAgIGlzRXJyb3I9e3Rhc2s/LnN0YXR1cyA9PT0gVGFza1N0YXR1cy5mYWlsZWR9XG4gICAgICBwcm9tcHRDb25maWc9e3Byb21wdENvbmZpZ31cbiAgICAgIG1vcmVMaWtlVGhpc0VuYWJsZWQ9eyEhbW9yZUxpa2VUaGlzQ29uZmlnPy5lbmFibGVkfVxuICAgICAgaW5wdXRzPXtpc0NhbGxCYXRjaEFQSSA/ICh0YXNrIGFzIFRhc2spLnBhcmFtcy5pbnB1dHMgOiBpbnB1dHN9XG4gICAgICBjb250cm9sU2VuZD17Y29udHJvbFNlbmR9XG4gICAgICBjb250cm9sUmV0cnk9e3Rhc2s/LnN0YXR1cyA9PT0gVGFza1N0YXR1cy5mYWlsZWQgPyBjb250cm9sUmV0cnkgOiAwfVxuICAgICAgY29udHJvbFN0b3BSZXNwb25kaW5nPXtjb250cm9sU3RvcFJlc3BvbmRpbmd9XG4gICAgICBvblNob3dSZXM9e3Nob3dSZXN1bHRQYW5lbH1cbiAgICAgIGhhbmRsZVNhdmVNZXNzYWdlPXtoYW5kbGVTYXZlTWVzc2FnZX1cbiAgICAgIHRhc2tJZD17dGFzaz8uaWR9XG4gICAgICBvbkNvbXBsZXRlZD17aGFuZGxlQ29tcGxldGVkfVxuICAgICAgdmlzaW9uQ29uZmlnPXt2aXNpb25Db25maWd9XG4gICAgICBjb21wbGV0aW9uRmlsZXM9e2NvbXBsZXRpb25GaWxlc31cbiAgICAgIGlzU2hvd1RleHRUb1NwZWVjaD17ISF0ZXh0VG9TcGVlY2hDb25maWc/LmVuYWJsZWR9XG4gICAgICBzaXRlSW5mbz17c2l0ZUluZm99XG4gICAgICBvblJ1blN0YXJ0PXsoKSA9PiBzZXRSZXN1bHRFeGlzdGVkKHRydWUpfVxuICAgICAgb25SdW5Db250cm9sQ2hhbmdlPXshaXNDYWxsQmF0Y2hBUEkgPyBzZXRSdW5Db250cm9sIDogdW5kZWZpbmVkfVxuICAgICAgaGlkZUlubGluZVN0b3BCdXR0b249eyFpc0NhbGxCYXRjaEFQSX1cbiAgICAvPlxuICApXG5cbiAgY29uc3QgcmVuZGVyQmF0Y2hSZXMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChzaG93VGFza0xpc3QubWFwKHRhc2sgPT4gcmVuZGVyUmVzKHRhc2spKSlcbiAgfVxuXG4gIGNvbnN0IHJlbmRlclJlc1dyYXAgPSAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgJ3JlbGF0aXZlIGZsZXggaC1mdWxsIGZsZXgtY29sJyxcbiAgICAgICAgIWlzUEMgJiYgJ2gtW2NhbGMoMTAwdmhfLV8zNnB4KV0gcm91bmRlZC10LTJ4bCBzaGFkb3ctbGcgYmFja2Ryb3AtYmx1ci1zbScsXG4gICAgICAgICFpc1BDXG4gICAgICAgICAgPyBpc1Nob3dSZXN1bHRQYW5lbFxuICAgICAgICAgICAgPyAnYmctYmFja2dyb3VuZC1kZWZhdWx0LWJ1cm4nXG4gICAgICAgICAgICA6ICdib3JkZXItdC1bMC41cHhdIGJvcmRlci1kaXZpZGVyLXJlZ3VsYXIgYmctY29tcG9uZW50cy1wYW5lbC1iZydcbiAgICAgICAgICA6ICdiZy1jaGF0Ym90LWJnJyxcbiAgICAgICl9XG4gICAgPlxuICAgICAge2lzQ2FsbEJhdGNoQVBJICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICdmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtMTQgcGItMiBwdC05JyxcbiAgICAgICAgICAhaXNQQyAmJiAncHgtNCBwYi0xIHB0LTMnLFxuICAgICAgICApfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQtdXBwZXJjYXNlIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoJ2dlbmVyYXRpb24uZXhlY3V0aW9ucycsIHsgbnM6ICdzaGFyZScsIG51bTogYWxsVGFza0xpc3QubGVuZ3RoIH0pfTwvZGl2PlxuICAgICAgICAgIHthbGxTdWNjZXNzVGFza0xpc3QubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8UmVzRG93bmxvYWRcbiAgICAgICAgICAgICAgaXNNb2JpbGU9eyFpc1BDfVxuICAgICAgICAgICAgICB2YWx1ZXM9e2V4cG9ydFJlc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgICAnZmxleCBoLTAgZ3JvdyBmbGV4LWNvbCBvdmVyZmxvdy15LWF1dG8nLFxuICAgICAgICBpc1BDICYmICdweC0xNCBweS04JyxcbiAgICAgICAgaXNQQyAmJiBpc0NhbGxCYXRjaEFQSSAmJiAncHQtMCcsXG4gICAgICAgICFpc1BDICYmICdwLTAgcGItMicsXG4gICAgICApfVxuICAgICAgPlxuICAgICAgICB7IWlzQ2FsbEJhdGNoQVBJID8gcmVuZGVyUmVzKCkgOiByZW5kZXJCYXRjaFJlcygpfVxuICAgICAgICB7IW5vUGVuZGluZ1Rhc2sgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNFwiPlxuICAgICAgICAgICAgPExvYWRpbmcgdHlwZT1cImFyZWFcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICB7aXNDYWxsQmF0Y2hBUEkgJiYgYWxsRmFpbGVkVGFza0xpc3QubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTYgbGVmdC0xLzIgei0xMCBmbGV4IC10cmFuc2xhdGUteC0xLzIgaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnLWJsdXIgcC0zIHNoYWRvdy1sZyBiYWNrZHJvcC1ibHVyLXNtXCI+XG4gICAgICAgICAgPFJpRXJyb3JXYXJuaW5nRmlsbCBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC1kZXN0cnVjdGl2ZVwiIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnZ2VuZXJhdGlvbi5iYXRjaEZhaWxlZC5pbmZvJywgeyBuczogJ3NoYXJlJywgbnVtOiBhbGxGYWlsZWRUYXNrTGlzdC5sZW5ndGggfSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTMuNSB3LXB4IGJnLWRpdmlkZXItcmVndWxhclwiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgb25DbGljaz17aGFuZGxlUmV0cnlBbGxGYWlsZWRUYXNrfSBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQtdXBwZXJjYXNlIGN1cnNvci1wb2ludGVyIHRleHQtdGV4dC1hY2NlbnRcIj57dCgnZ2VuZXJhdGlvbi5iYXRjaEZhaWxlZC5yZXRyeScsIHsgbnM6ICdzaGFyZScgfSl9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxuXG4gIGlmICghYXBwSWQgfHwgIXNpdGVJbmZvIHx8ICFwcm9tcHRDb25maWcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtc2NyZWVuIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICA8TG9hZGluZyB0eXBlPVwiYXBwXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbihcbiAgICAgICdiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtYnVybicsXG4gICAgICBpc1BDICYmICdmbGV4JyxcbiAgICAgICFpc1BDICYmICdmbGV4LWNvbCcsXG4gICAgICBpc0luc3RhbGxlZEFwcCA/ICdoLWZ1bGwgcm91bmRlZC0yeGwgc2hhZG93LW1kJyA6ICdoLXNjcmVlbicsXG4gICAgKX1cbiAgICA+XG4gICAgICB7LyogTGVmdCAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgJ3JlbGF0aXZlIGZsZXggaC1mdWxsIHNocmluay0wIGZsZXgtY29sJyxcbiAgICAgICAgaXNQQyA/ICd3LVs2MDBweF0gbWF4LXctWzUwJV0nIDogcmVzdWx0RXhpc3RlZCA/ICdoLVtjYWxjKDEwMCVfLV82NHB4KV0nIDogJycsXG4gICAgICAgIGlzSW5zdGFsbGVkQXBwICYmICdyb3VuZGVkLWwtMnhsJyxcbiAgICAgICl9XG4gICAgICA+XG4gICAgICAgIHsvKiBoZWFkZXIgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignc2hyaW5rLTAgc3BhY2UteS00IGJvcmRlci1iIGJvcmRlci1kaXZpZGVyLXN1YnRsZScsIGlzUEMgPyAnYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTggcGItMCcgOiAncC00IHBiLTAnKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPEFwcEljb25cbiAgICAgICAgICAgICAgc2l6ZT17aXNQQyA/ICdsYXJnZScgOiAnc21hbGwnfVxuICAgICAgICAgICAgICBpY29uVHlwZT17c2l0ZUluZm8uaWNvbl90eXBlfVxuICAgICAgICAgICAgICBpY29uPXtzaXRlSW5mby5pY29ufVxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kPXtzaXRlSW5mby5pY29uX2JhY2tncm91bmQgfHwgYXBwRGVmYXVsdEljb25CYWNrZ3JvdW5kfVxuICAgICAgICAgICAgICBpbWFnZVVybD17c2l0ZUluZm8uaWNvbl91cmx9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQgZ3JvdyB0cnVuY2F0ZSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3NpdGVJbmZvLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgPE1lbnVEcm9wZG93biBoaWRlTG9nb3V0PXtpc0luc3RhbGxlZEFwcCB8fCBhY2Nlc3NNb2RlID09PSBBY2Nlc3NNb2RlLlBVQkxJQ30gZGF0YT17c2l0ZUluZm99IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3NpdGVJbmZvLmRlc2NyaXB0aW9uICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3NpdGVJbmZvLmRlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFRhYkhlYWRlclxuICAgICAgICAgICAgaXRlbXM9e1tcbiAgICAgICAgICAgICAgeyBpZDogJ2NyZWF0ZScsIG5hbWU6IHQoJ2dlbmVyYXRpb24udGFicy5jcmVhdGUnLCB7IG5zOiAnc2hhcmUnIH0pIH0sXG4gICAgICAgICAgICAgIHsgaWQ6ICdiYXRjaCcsIG5hbWU6IHQoJ2dlbmVyYXRpb24udGFicy5iYXRjaCcsIHsgbnM6ICdzaGFyZScgfSkgfSxcbiAgICAgICAgICAgICAgLi4uKCFpc1dvcmtmbG93XG4gICAgICAgICAgICAgICAgPyBbe1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3NhdmVkJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdCgnZ2VuZXJhdGlvbi50YWJzLnNhdmVkJywgeyBuczogJ3NoYXJlJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgaXNSaWdodDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogPFJpQm9va21hcmszTGluZSBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz4sXG4gICAgICAgICAgICAgICAgICAgIGV4dHJhOiBzYXZlZE1lc3NhZ2VzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEJhZGdlIGNsYXNzTmFtZT1cIm1sLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRNZXNzYWdlcy5sZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvQmFkZ2U+XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICA6IFtdKSxcbiAgICAgICAgICAgIF19XG4gICAgICAgICAgICB2YWx1ZT17Y3VycmVudFRhYn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRDdXJyZW50VGFifVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7LyogZm9ybSAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICdoLTAgZ3JvdyBvdmVyZmxvdy15LWF1dG8gYmctY29tcG9uZW50cy1wYW5lbC1iZycsXG4gICAgICAgICAgaXNQQyA/ICdweC04JyA6ICdweC00JyxcbiAgICAgICAgICAhaXNQQyAmJiByZXN1bHRFeGlzdGVkICYmIGN1c3RvbUNvbmZpZz8ucmVtb3ZlX3dlYmFwcF9icmFuZCAmJiAncm91bmRlZC1iLTJ4bCBib3JkZXItYi1bMC41cHhdIGJvcmRlci1kaXZpZGVyLXJlZ3VsYXInLFxuICAgICAgICApfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKGN1cnJlbnRUYWIgPT09ICdjcmVhdGUnID8gJ2Jsb2NrJyA6ICdoaWRkZW4nKX0+XG4gICAgICAgICAgICA8UnVuT25jZVxuICAgICAgICAgICAgICBzaXRlSW5mbz17c2l0ZUluZm99XG4gICAgICAgICAgICAgIGlucHV0cz17aW5wdXRzfVxuICAgICAgICAgICAgICBpbnB1dHNSZWY9e2lucHV0c1JlZn1cbiAgICAgICAgICAgICAgb25JbnB1dHNDaGFuZ2U9e3NldElucHV0c31cbiAgICAgICAgICAgICAgcHJvbXB0Q29uZmlnPXtwcm9tcHRDb25maWd9XG4gICAgICAgICAgICAgIG9uU2VuZD17aGFuZGxlU2VuZH1cbiAgICAgICAgICAgICAgdmlzaW9uQ29uZmlnPXt2aXNpb25Db25maWd9XG4gICAgICAgICAgICAgIG9uVmlzaW9uRmlsZXNDaGFuZ2U9e3NldENvbXBsZXRpb25GaWxlc31cbiAgICAgICAgICAgICAgcnVuQ29udHJvbD17cnVuQ29udHJvbH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKGlzSW5CYXRjaFRhYiA/ICdibG9jaycgOiAnaGlkZGVuJyl9PlxuICAgICAgICAgICAgPFJ1bkJhdGNoXG4gICAgICAgICAgICAgIHZhcnM9e3Byb21wdENvbmZpZy5wcm9tcHRfdmFyaWFibGVzfVxuICAgICAgICAgICAgICBvblNlbmQ9e2hhbmRsZVJ1bkJhdGNofVxuICAgICAgICAgICAgICBpc0FsbEZpbmlzaGVkPXthbGxUYXNrc1J1bn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2N1cnJlbnRUYWIgPT09ICdzYXZlZCcgJiYgKFxuICAgICAgICAgICAgPFNhdmVkSXRlbXNcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihpc1BDID8gJ210LTYnIDogJ210LTQnKX1cbiAgICAgICAgICAgICAgaXNTaG93VGV4dFRvU3BlZWNoPXt0ZXh0VG9TcGVlY2hDb25maWc/LmVuYWJsZWR9XG4gICAgICAgICAgICAgIGxpc3Q9e3NhdmVkTWVzc2FnZXN9XG4gICAgICAgICAgICAgIG9uUmVtb3ZlPXtoYW5kbGVSZW1vdmVTYXZlZE1lc3NhZ2V9XG4gICAgICAgICAgICAgIG9uU3RhcnRDcmVhdGVDb250ZW50PXsoKSA9PiBzZXRDdXJyZW50VGFiKCdjcmVhdGUnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvKiBwb3dlcmVkIGJ5ICovfVxuICAgICAgICB7IWN1c3RvbUNvbmZpZz8ucmVtb3ZlX3dlYmFwcF9icmFuZCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgJ2ZsZXggc2hyaW5rLTAgaXRlbXMtY2VudGVyIGdhcC0xLjUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBweS0zJyxcbiAgICAgICAgICAgIGlzUEMgPyAncHgtOCcgOiAncHgtNCcsXG4gICAgICAgICAgICAhaXNQQyAmJiByZXN1bHRFeGlzdGVkICYmICdyb3VuZGVkLWItMnhsIGJvcmRlci1iLVswLjVweF0gYm9yZGVyLWRpdmlkZXItcmVndWxhcicsXG4gICAgICAgICAgKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS0yeHMtbWVkaXVtLXVwcGVyY2FzZSB0ZXh0LXRleHQtdGVydGlhcnlcIj57dCgnY2hhdC5wb3dlcmVkQnknLCB7IG5zOiAnc2hhcmUnIH0pfTwvZGl2PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy5lbmFibGVkICYmIHN5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLndvcmtzcGFjZV9sb2dvXG4gICAgICAgICAgICAgICAgPyA8aW1nIHNyYz17c3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcud29ya3NwYWNlX2xvZ299IGFsdD1cImxvZ29cIiBjbGFzc05hbWU9XCJibG9jayBoLTUgdy1hdXRvXCIgLz5cbiAgICAgICAgICAgICAgICA6IGN1c3RvbUNvbmZpZz8ucmVwbGFjZV93ZWJhcHBfbG9nb1xuICAgICAgICAgICAgICAgICAgPyA8aW1nIHNyYz17YCR7Y3VzdG9tQ29uZmlnPy5yZXBsYWNlX3dlYmFwcF9sb2dvfWB9IGFsdD1cImxvZ29cIiBjbGFzc05hbWU9XCJibG9jayBoLTUgdy1hdXRvXCIgLz5cbiAgICAgICAgICAgICAgICAgIDogPERpZnlMb2dvIHNpemU9XCJzbWFsbFwiIC8+XG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiBSZXN1bHQgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oXG4gICAgICAgIGlzUENcbiAgICAgICAgICA/ICdoLWZ1bGwgdy0wIGdyb3cnXG4gICAgICAgICAgOiBpc1Nob3dSZXN1bHRQYW5lbFxuICAgICAgICAgICAgPyAnZml4ZWQgaW5zZXQtMCB6LTUwIGJnLWJhY2tncm91bmQtb3ZlcmxheSBiYWNrZHJvcC1ibHVyLXNtJ1xuICAgICAgICAgICAgOiByZXN1bHRFeGlzdGVkXG4gICAgICAgICAgICAgID8gJ3JlbGF0aXZlIGgtMTYgc2hyaW5rLTAgb3ZlcmZsb3ctaGlkZGVuIGJnLWJhY2tncm91bmQtZGVmYXVsdC1idXJuIHB0LTIuNSdcbiAgICAgICAgICAgICAgOiAnJyxcbiAgICAgICl9XG4gICAgICA+XG4gICAgICAgIHshaXNQQyAmJiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgaXNTaG93UmVzdWx0UGFuZWxcbiAgICAgICAgICAgICAgICA/ICdmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwLTIgcHQtNidcbiAgICAgICAgICAgICAgICA6ICdhYnNvbHV0ZSBsZWZ0LTAgdG9wLTAgei0xMCBmbGV4IHctZnVsbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcHgtMiBwYi1bNTdweF0gcHQtWzNweF0nLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGlzU2hvd1Jlc3VsdFBhbmVsKVxuICAgICAgICAgICAgICAgIGhpZGVSZXN1bHRQYW5lbCgpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzaG93UmVzdWx0UGFuZWwoKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMSB3LTggY3Vyc29yLWdyYWIgcm91bmRlZCBiZy1kaXZpZGVyLXNvbGlkXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge3JlbmRlclJlc1dyYXB9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBUZXh0R2VuZXJhdGlvblxuIl19