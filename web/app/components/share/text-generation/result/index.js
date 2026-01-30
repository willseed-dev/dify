"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const i18next_1 = require("i18next");
const immer_1 = require("immer");
const React = require("react");
const react_2 = require("react");
const item_1 = require("@/app/components/app/text-generate/item");
const button_1 = require("@/app/components/base/button");
const utils_1 = require("@/app/components/base/file-uploader/utils");
const mediaAndDevices_1 = require("@/app/components/base/icons/src/vender/solid/mediaAndDevices");
const loading_1 = require("@/app/components/base/loading");
const toast_1 = require("@/app/components/base/toast");
const no_data_1 = require("@/app/components/share/text-generation/no-data");
const types_1 = require("@/app/components/workflow/types");
const config_1 = require("@/config");
const share_1 = require("@/service/share");
const app_1 = require("@/types/app");
const utils_2 = require("@/utils");
const model_config_1 = require("@/utils/model-config");
const Result = ({ isWorkflow, isCallBatchAPI, isPC, isMobile, isInstalledApp, appId, installedAppInfo, isError, isShowTextToSpeech, promptConfig, moreLikeThisEnabled, inputs, controlSend, controlRetry, controlStopResponding, onShowRes, handleSaveMessage, taskId, onCompleted, visionConfig, completionFiles, siteInfo, onRunStart, onRunControlChange, hideInlineStopButton = false, }) => {
    const [isResponding, { setTrue: setRespondingTrue, setFalse: setRespondingFalse }] = (0, ahooks_1.useBoolean)(false);
    const [completionRes, doSetCompletionRes] = (0, react_2.useState)('');
    const completionResRef = (0, react_2.useRef)('');
    const setCompletionRes = (res) => {
        completionResRef.current = res;
        doSetCompletionRes(res);
    };
    const getCompletionRes = () => completionResRef.current;
    const [workflowProcessData, doSetWorkflowProcessData] = (0, react_2.useState)();
    const workflowProcessDataRef = (0, react_2.useRef)(undefined);
    const setWorkflowProcessData = (data) => {
        workflowProcessDataRef.current = data;
        doSetWorkflowProcessData(data);
    };
    const getWorkflowProcessData = () => workflowProcessDataRef.current;
    const [currentTaskId, setCurrentTaskId] = (0, react_2.useState)(null);
    const [isStopping, setIsStopping] = (0, react_2.useState)(false);
    const abortControllerRef = (0, react_2.useRef)(null);
    const resetRunState = (0, react_2.useCallback)(() => {
        setCurrentTaskId(null);
        setIsStopping(false);
        abortControllerRef.current = null;
        onRunControlChange?.(null);
    }, [onRunControlChange]);
    (0, react_2.useEffect)(() => {
        const abortCurrentRequest = () => {
            abortControllerRef.current?.abort();
        };
        if (controlStopResponding) {
            abortCurrentRequest();
            setRespondingFalse();
            resetRunState();
        }
        return abortCurrentRequest;
    }, [controlStopResponding, resetRunState, setRespondingFalse]);
    const { notify } = toast_1.default;
    const isNoData = !completionRes;
    const [messageId, setMessageId] = (0, react_2.useState)(null);
    const [feedback, setFeedback] = (0, react_2.useState)({
        rating: null,
    });
    const handleFeedback = async (feedback) => {
        await (0, share_1.updateFeedback)({ url: `/messages/${messageId}/feedbacks`, body: { rating: feedback.rating, content: feedback.content } }, isInstalledApp, installedAppInfo?.id);
        setFeedback(feedback);
    };
    const logError = (message) => {
        notify({ type: 'error', message });
    };
    const handleStop = (0, react_2.useCallback)(async () => {
        if (!currentTaskId || isStopping)
            return;
        setIsStopping(true);
        try {
            if (isWorkflow)
                await (0, share_1.stopWorkflowMessage)(appId, currentTaskId, isInstalledApp, installedAppInfo?.id || '');
            else
                await (0, share_1.stopChatMessageResponding)(appId, currentTaskId, isInstalledApp, installedAppInfo?.id || '');
            abortControllerRef.current?.abort();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            notify({ type: 'error', message });
        }
        finally {
            setIsStopping(false);
        }
    }, [appId, currentTaskId, installedAppInfo?.id, isInstalledApp, isStopping, isWorkflow, notify]);
    (0, react_2.useEffect)(() => {
        if (!onRunControlChange)
            return;
        if (isResponding && currentTaskId) {
            onRunControlChange({
                onStop: handleStop,
                isStopping,
            });
        }
        else {
            onRunControlChange(null);
        }
    }, [currentTaskId, handleStop, isResponding, isStopping, onRunControlChange]);
    const checkCanSend = () => {
        // batch will check outer
        if (isCallBatchAPI)
            return true;
        const prompt_variables = promptConfig?.prompt_variables;
        if (!prompt_variables || prompt_variables?.length === 0) {
            if (completionFiles.find(item => item.transfer_method === app_1.TransferMethod.local_file && !item.upload_file_id)) {
                notify({ type: 'info', message: (0, i18next_1.t)('errorMessage.waitForFileUpload', { ns: 'appDebug' }) });
                return false;
            }
            return true;
        }
        let hasEmptyInput = '';
        const requiredVars = prompt_variables?.filter(({ key, name, required, type }) => {
            if (type === 'boolean' || type === 'checkbox')
                return false; // boolean/checkbox input is not required
            const res = (!key || !key.trim()) || (!name || !name.trim()) || (required || required === undefined || required === null);
            return res;
        }) || []; // compatible with old version
        requiredVars.forEach(({ key, name }) => {
            if (hasEmptyInput)
                return;
            if (!inputs[key])
                hasEmptyInput = name;
        });
        if (hasEmptyInput) {
            logError((0, i18next_1.t)('errorMessage.valueOfVarRequired', { ns: 'appDebug', key: hasEmptyInput }));
            return false;
        }
        if (completionFiles.find(item => item.transfer_method === app_1.TransferMethod.local_file && !item.upload_file_id)) {
            notify({ type: 'info', message: (0, i18next_1.t)('errorMessage.waitForFileUpload', { ns: 'appDebug' }) });
            return false;
        }
        return !hasEmptyInput;
    };
    const handleSend = async () => {
        if (isResponding) {
            notify({ type: 'info', message: (0, i18next_1.t)('errorMessage.waitForResponse', { ns: 'appDebug' }) });
            return false;
        }
        if (!checkCanSend())
            return;
        // Process inputs: convert file entities to API format
        const processedInputs = { ...(0, model_config_1.formatBooleanInputs)(promptConfig?.prompt_variables, inputs) };
        promptConfig?.prompt_variables.forEach((variable) => {
            const value = processedInputs[variable.key];
            if (variable.type === 'file' && value && typeof value === 'object' && !Array.isArray(value)) {
                // Convert single file entity to API format
                processedInputs[variable.key] = (0, utils_1.getProcessedFiles)([value])[0];
            }
            else if (variable.type === 'file-list' && Array.isArray(value) && value.length > 0) {
                // Convert file entity array to API format
                processedInputs[variable.key] = (0, utils_1.getProcessedFiles)(value);
            }
        });
        const data = {
            inputs: processedInputs,
        };
        if (visionConfig.enabled && completionFiles && completionFiles?.length > 0) {
            data.files = completionFiles.map((item) => {
                if (item.transfer_method === app_1.TransferMethod.local_file) {
                    return {
                        ...item,
                        url: '',
                    };
                }
                return item;
            });
        }
        setMessageId(null);
        setFeedback({
            rating: null,
        });
        setCompletionRes('');
        resetRunState();
        let res = [];
        let tempMessageId = '';
        if (!isPC) {
            onShowRes();
            onRunStart();
        }
        setRespondingTrue();
        let isEnd = false;
        let isTimeout = false;
        (async () => {
            await (0, utils_2.sleep)(config_1.TEXT_GENERATION_TIMEOUT_MS);
            if (!isEnd) {
                setRespondingFalse();
                onCompleted(getCompletionRes(), taskId, false);
                resetRunState();
                isTimeout = true;
            }
        })();
        if (isWorkflow) {
            (0, share_1.sendWorkflowMessage)(data, {
                onWorkflowStarted: ({ workflow_run_id, task_id }) => {
                    tempMessageId = workflow_run_id;
                    setCurrentTaskId(task_id || null);
                    setIsStopping(false);
                    setWorkflowProcessData({
                        status: types_1.WorkflowRunningStatus.Running,
                        tracing: [],
                        expand: false,
                        resultText: '',
                    });
                },
                onIterationStart: ({ data }) => {
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.expand = true;
                        draft.tracing.push({
                            ...data,
                            status: types_1.NodeRunningStatus.Running,
                            expand: true,
                        });
                    }));
                },
                onIterationNext: () => {
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.expand = true;
                        const iterations = draft.tracing.find(item => item.node_id === data.node_id
                            && (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || item.parallel_id === data.execution_metadata?.parallel_id));
                        iterations?.details.push([]);
                    }));
                },
                onIterationFinish: ({ data }) => {
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.expand = true;
                        const iterationsIndex = draft.tracing.findIndex(item => item.node_id === data.node_id
                            && (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || item.parallel_id === data.execution_metadata?.parallel_id));
                        draft.tracing[iterationsIndex] = {
                            ...data,
                            expand: !!data.error,
                        };
                    }));
                },
                onLoopStart: ({ data }) => {
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.expand = true;
                        draft.tracing.push({
                            ...data,
                            status: types_1.NodeRunningStatus.Running,
                            expand: true,
                        });
                    }));
                },
                onLoopNext: () => {
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.expand = true;
                        const loops = draft.tracing.find(item => item.node_id === data.node_id
                            && (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || item.parallel_id === data.execution_metadata?.parallel_id));
                        loops?.details.push([]);
                    }));
                },
                onLoopFinish: ({ data }) => {
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.expand = true;
                        const loopsIndex = draft.tracing.findIndex(item => item.node_id === data.node_id
                            && (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || item.parallel_id === data.execution_metadata?.parallel_id));
                        draft.tracing[loopsIndex] = {
                            ...data,
                            expand: !!data.error,
                        };
                    }));
                },
                onNodeStarted: ({ data }) => {
                    if (data.iteration_id)
                        return;
                    if (data.loop_id)
                        return;
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.expand = true;
                        draft.tracing.push({
                            ...data,
                            status: types_1.NodeRunningStatus.Running,
                            expand: true,
                        });
                    }));
                },
                onNodeFinished: ({ data }) => {
                    if (data.iteration_id)
                        return;
                    if (data.loop_id)
                        return;
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        const currentIndex = draft.tracing.findIndex(trace => trace.node_id === data.node_id
                            && (trace.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || trace.parallel_id === data.execution_metadata?.parallel_id));
                        if (currentIndex > -1 && draft.tracing) {
                            draft.tracing[currentIndex] = {
                                ...(draft.tracing[currentIndex].extras
                                    ? { extras: draft.tracing[currentIndex].extras }
                                    : {}),
                                ...data,
                                expand: !!data.error,
                            };
                        }
                    }));
                },
                onWorkflowFinished: ({ data }) => {
                    if (isTimeout) {
                        notify({ type: 'warning', message: (0, i18next_1.t)('warningMessage.timeoutExceeded', { ns: 'appDebug' }) });
                        return;
                    }
                    const workflowStatus = data.status;
                    const markNodesStopped = (traces) => {
                        if (!traces)
                            return;
                        const markTrace = (trace) => {
                            if ([types_1.NodeRunningStatus.Running, types_1.NodeRunningStatus.Waiting].includes(trace.status))
                                trace.status = types_1.NodeRunningStatus.Stopped;
                            trace.details?.forEach(detailGroup => detailGroup.forEach(markTrace));
                            trace.retryDetail?.forEach(markTrace);
                            trace.parallelDetail?.children?.forEach(markTrace);
                        };
                        traces.forEach(markTrace);
                    };
                    if (workflowStatus === types_1.WorkflowRunningStatus.Stopped) {
                        setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                            draft.status = types_1.WorkflowRunningStatus.Stopped;
                            markNodesStopped(draft.tracing);
                        }));
                        setRespondingFalse();
                        resetRunState();
                        onCompleted(getCompletionRes(), taskId, false);
                        isEnd = true;
                        return;
                    }
                    if (data.error) {
                        notify({ type: 'error', message: data.error });
                        setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                            draft.status = types_1.WorkflowRunningStatus.Failed;
                            markNodesStopped(draft.tracing);
                        }));
                        setRespondingFalse();
                        resetRunState();
                        onCompleted(getCompletionRes(), taskId, false);
                        isEnd = true;
                        return;
                    }
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.status = types_1.WorkflowRunningStatus.Succeeded;
                        draft.files = (0, utils_1.getFilesInLogs)(data.outputs || []);
                    }));
                    if (!data.outputs) {
                        setCompletionRes('');
                    }
                    else {
                        setCompletionRes(data.outputs);
                        const isStringOutput = Object.keys(data.outputs).length === 1 && typeof data.outputs[Object.keys(data.outputs)[0]] === 'string';
                        if (isStringOutput) {
                            setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                                draft.resultText = data.outputs[Object.keys(data.outputs)[0]];
                            }));
                        }
                    }
                    setRespondingFalse();
                    resetRunState();
                    setMessageId(tempMessageId);
                    onCompleted(getCompletionRes(), taskId, true);
                    isEnd = true;
                },
                onTextChunk: (params) => {
                    const { data: { text } } = params;
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.resultText += text;
                    }));
                },
                onTextReplace: (params) => {
                    const { data: { text } } = params;
                    setWorkflowProcessData((0, immer_1.produce)(getWorkflowProcessData(), (draft) => {
                        draft.resultText = text;
                    }));
                },
            }, isInstalledApp, installedAppInfo?.id).catch((error) => {
                setRespondingFalse();
                resetRunState();
                const message = error instanceof Error ? error.message : String(error);
                notify({ type: 'error', message });
            });
        }
        else {
            (0, share_1.sendCompletionMessage)(data, {
                onData: (data, _isFirstMessage, { messageId, taskId }) => {
                    tempMessageId = messageId;
                    if (taskId && typeof taskId === 'string' && taskId.trim() !== '')
                        setCurrentTaskId(prev => prev ?? taskId);
                    res.push(data);
                    setCompletionRes(res.join(''));
                },
                onCompleted: () => {
                    if (isTimeout) {
                        notify({ type: 'warning', message: (0, i18next_1.t)('warningMessage.timeoutExceeded', { ns: 'appDebug' }) });
                        return;
                    }
                    setRespondingFalse();
                    resetRunState();
                    setMessageId(tempMessageId);
                    onCompleted(getCompletionRes(), taskId, true);
                    isEnd = true;
                },
                onMessageReplace: (messageReplace) => {
                    res = [messageReplace.answer];
                    setCompletionRes(res.join(''));
                },
                onError() {
                    if (isTimeout) {
                        notify({ type: 'warning', message: (0, i18next_1.t)('warningMessage.timeoutExceeded', { ns: 'appDebug' }) });
                        return;
                    }
                    setRespondingFalse();
                    resetRunState();
                    onCompleted(getCompletionRes(), taskId, false);
                    isEnd = true;
                },
                getAbortController: (abortController) => {
                    abortControllerRef.current = abortController;
                },
            }, isInstalledApp, installedAppInfo?.id);
        }
    };
    const [controlClearMoreLikeThis, setControlClearMoreLikeThis] = (0, react_2.useState)(0);
    (0, react_2.useEffect)(() => {
        if (controlSend) {
            handleSend();
            setControlClearMoreLikeThis(Date.now());
        }
    }, [controlSend]);
    (0, react_2.useEffect)(() => {
        if (controlRetry)
            handleSend();
    }, [controlRetry]);
    const renderTextGenerationRes = () => (<>
      {!hideInlineStopButton && isResponding && currentTaskId && (<div className={`mb-3 flex ${isPC ? 'justify-end' : 'justify-center'}`}>
          <button_1.default variant="secondary" disabled={isStopping} onClick={handleStop}>
            {isStopping
                ? <react_1.RiLoader2Line className="mr-[5px] h-3.5 w-3.5 animate-spin"/>
                : <mediaAndDevices_1.StopCircle className="mr-[5px] h-3.5 w-3.5"/>}
            <span className="text-xs font-normal">{(0, i18next_1.t)('operation.stopResponding', { ns: 'appDebug' })}</span>
          </button_1.default>
        </div>)}
      <item_1.default isWorkflow={isWorkflow} workflowProcessData={workflowProcessData} isError={isError} onRetry={handleSend} content={completionRes} messageId={messageId} isInWebApp moreLikeThis={moreLikeThisEnabled} onFeedback={handleFeedback} feedback={feedback} onSave={handleSaveMessage} isMobile={isMobile} isInstalledApp={isInstalledApp} installedAppId={installedAppInfo?.id} isLoading={isCallBatchAPI ? (!completionRes && isResponding) : false} taskId={isCallBatchAPI ? (taskId < 10 ? `0${taskId}` : `${taskId}`) : undefined} controlClearMoreLikeThis={controlClearMoreLikeThis} isShowTextToSpeech={isShowTextToSpeech} hideProcessDetail siteInfo={siteInfo}/>
    </>);
    return (<>
      {!isCallBatchAPI && !isWorkflow && ((isResponding && !completionRes)
            ? (<div className="flex h-full w-full items-center justify-center">
                <loading_1.default type="area"/>
              </div>)
            : (<>
                {(isNoData)
                    ? <no_data_1.default />
                    : renderTextGenerationRes()}
              </>))}
      {!isCallBatchAPI && isWorkflow && ((isResponding && !workflowProcessData)
            ? (<div className="flex h-full w-full items-center justify-center">
                <loading_1.default type="area"/>
              </div>)
            : !workflowProcessData
                ? <no_data_1.default />
                : renderTextGenerationRes())}
      {isCallBatchAPI && renderTextGenerationRes()}
    </>);
};
exports.default = React.memo(Result);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFTWiw0Q0FBZ0Q7QUFDaEQsbUNBQW1DO0FBQ25DLHFDQUEyQjtBQUMzQixpQ0FBK0I7QUFDL0IsK0JBQThCO0FBQzlCLGlDQUFnRTtBQUNoRSxrRUFBdUU7QUFDdkUseURBQWlEO0FBQ2pELHFFQUdrRDtBQUNsRCxrR0FBeUY7QUFDekYsMkRBQW1EO0FBQ25ELHVEQUErQztBQUMvQyw0RUFBbUU7QUFDbkUsMkRBQTBGO0FBQzFGLHFDQUFxRDtBQUNyRCwyQ0FBNEk7QUFDNUkscUNBQTRDO0FBQzVDLG1DQUErQjtBQUMvQix1REFBMEQ7QUE4QjFELE1BQU0sTUFBTSxHQUFxQixDQUFDLEVBQ2hDLFVBQVUsRUFDVixjQUFjLEVBQ2QsSUFBSSxFQUNKLFFBQVEsRUFDUixjQUFjLEVBQ2QsS0FBSyxFQUNMLGdCQUFnQixFQUNoQixPQUFPLEVBQ1Asa0JBQWtCLEVBQ2xCLFlBQVksRUFDWixtQkFBbUIsRUFDbkIsTUFBTSxFQUNOLFdBQVcsRUFDWCxZQUFZLEVBQ1oscUJBQXFCLEVBQ3JCLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFdBQVcsRUFDWCxZQUFZLEVBQ1osZUFBZSxFQUNmLFFBQVEsRUFDUixVQUFVLEVBQ1Ysa0JBQWtCLEVBQ2xCLG9CQUFvQixHQUFHLEtBQUssR0FDN0IsRUFBRSxFQUFFO0lBQ0gsTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUN0RyxNQUFNLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFTLEVBQUUsQ0FBQyxDQUFBO0lBQ2hFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxj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Q0FBQyxJQUFJLENBQUMsTUFBTSxFQUN0QjtjQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7WUFDSCxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDLGlCQUFNLENBQUMsQUFBRCxFQUFHO2dCQUNaLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxDQUNsQyxDQUNEO01BQUEsQ0FBQyxjQUFjLElBQUksdUJBQXVCLEVBQUUsQ0FDOUM7SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUNELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgRmVlZGJhY2tUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoYXQvY2hhdC90eXBlJ1xuaW1wb3J0IHR5cGUgeyBXb3JrZmxvd1Byb2Nlc3MgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC90eXBlcydcbmltcG9ydCB0eXBlIHsgRmlsZUVudGl0eSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9maWxlLXVwbG9hZGVyL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQcm9tcHRDb25maWcgfSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB0eXBlIHsgSW5zdGFsbGVkQXBwIH0gZnJvbSAnQC9tb2RlbHMvZXhwbG9yZSdcbmltcG9ydCB0eXBlIHsgU2l0ZUluZm8gfSBmcm9tICdAL21vZGVscy9zaGFyZSdcbmltcG9ydCB0eXBlIHsgVmlzaW9uRmlsZSwgVmlzaW9uU2V0dGluZ3MgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IFJpTG9hZGVyMkxpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlQm9vbGVhbiB9IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IHQgfSBmcm9tICdpMThuZXh0J1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgVGV4dEdlbmVyYXRpb25SZXMgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvdGV4dC1nZW5lcmF0ZS9pdGVtJ1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IHtcbiAgZ2V0RmlsZXNJbkxvZ3MsXG4gIGdldFByb2Nlc3NlZEZpbGVzLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci91dGlscydcbmltcG9ydCB7IFN0b3BDaXJjbGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9tZWRpYUFuZERldmljZXMnXG5pbXBvcnQgTG9hZGluZyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbG9hZGluZydcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgTm9EYXRhIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvc2hhcmUvdGV4dC1nZW5lcmF0aW9uL25vLWRhdGEnXG5pbXBvcnQgeyBOb2RlUnVubmluZ1N0YXR1cywgV29ya2Zsb3dSdW5uaW5nU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IFRFWFRfR0VORVJBVElPTl9USU1FT1VUX01TIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyBzZW5kQ29tcGxldGlvbk1lc3NhZ2UsIHNlbmRXb3JrZmxvd01lc3NhZ2UsIHN0b3BDaGF0TWVzc2FnZVJlc3BvbmRpbmcsIHN0b3BXb3JrZmxvd01lc3NhZ2UsIHVwZGF0ZUZlZWRiYWNrIH0gZnJvbSAnQC9zZXJ2aWNlL3NoYXJlJ1xuaW1wb3J0IHsgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCB7IGZvcm1hdEJvb2xlYW5JbnB1dHMgfSBmcm9tICdAL3V0aWxzL21vZGVsLWNvbmZpZydcblxuZXhwb3J0IHR5cGUgSVJlc3VsdFByb3BzID0ge1xuICBpc1dvcmtmbG93OiBib29sZWFuXG4gIGlzQ2FsbEJhdGNoQVBJOiBib29sZWFuXG4gIGlzUEM6IGJvb2xlYW5cbiAgaXNNb2JpbGU6IGJvb2xlYW5cbiAgaXNJbnN0YWxsZWRBcHA6IGJvb2xlYW5cbiAgYXBwSWQ6IHN0cmluZ1xuICBpbnN0YWxsZWRBcHBJbmZvPzogSW5zdGFsbGVkQXBwXG4gIGlzRXJyb3I6IGJvb2xlYW5cbiAgaXNTaG93VGV4dFRvU3BlZWNoOiBib29sZWFuXG4gIHByb21wdENvbmZpZzogUHJvbXB0Q29uZmlnIHwgbnVsbFxuICBtb3JlTGlrZVRoaXNFbmFibGVkOiBib29sZWFuXG4gIGlucHV0czogUmVjb3JkPHN0cmluZywgYW55PlxuICBjb250cm9sU2VuZD86IG51bWJlclxuICBjb250cm9sUmV0cnk/OiBudW1iZXJcbiAgY29udHJvbFN0b3BSZXNwb25kaW5nPzogbnVtYmVyXG4gIG9uU2hvd1JlczogKCkgPT4gdm9pZFxuICBoYW5kbGVTYXZlTWVzc2FnZTogKG1lc3NhZ2VJZDogc3RyaW5nKSA9PiB2b2lkXG4gIHRhc2tJZD86IG51bWJlclxuICBvbkNvbXBsZXRlZDogKGNvbXBsZXRpb25SZXM6IHN0cmluZywgdGFza0lkPzogbnVtYmVyLCBzdWNjZXNzPzogYm9vbGVhbikgPT4gdm9pZFxuICB2aXNpb25Db25maWc6IFZpc2lvblNldHRpbmdzXG4gIGNvbXBsZXRpb25GaWxlczogVmlzaW9uRmlsZVtdXG4gIHNpdGVJbmZvOiBTaXRlSW5mbyB8IG51bGxcbiAgb25SdW5TdGFydDogKCkgPT4gdm9pZFxuICBvblJ1bkNvbnRyb2xDaGFuZ2U/OiAoY29udHJvbDogeyBvblN0b3A6ICgpID0+IFByb21pc2U8dm9pZD4gfCB2b2lkLCBpc1N0b3BwaW5nOiBib29sZWFuIH0gfCBudWxsKSA9PiB2b2lkXG4gIGhpZGVJbmxpbmVTdG9wQnV0dG9uPzogYm9vbGVhblxufVxuXG5jb25zdCBSZXN1bHQ6IEZDPElSZXN1bHRQcm9wcz4gPSAoe1xuICBpc1dvcmtmbG93LFxuICBpc0NhbGxCYXRjaEFQSSxcbiAgaXNQQyxcbiAgaXNNb2JpbGUsXG4gIGlzSW5zdGFsbGVkQXBwLFxuICBhcHBJZCxcbiAgaW5zdGFsbGVkQXBwSW5mbyxcbiAgaXNFcnJvcixcbiAgaXNTaG93VGV4dFRvU3BlZWNoLFxuICBwcm9tcHRDb25maWcsXG4gIG1vcmVMaWtlVGhpc0VuYWJsZWQsXG4gIGlucHV0cyxcbiAgY29udHJvbFNlbmQsXG4gIGNvbnRyb2xSZXRyeSxcbiAgY29udHJvbFN0b3BSZXNwb25kaW5nLFxuICBvblNob3dSZXMsXG4gIGhhbmRsZVNhdmVNZXNzYWdlLFxuICB0YXNrSWQsXG4gIG9uQ29tcGxldGVkLFxuICB2aXNpb25Db25maWcsXG4gIGNvbXBsZXRpb25GaWxlcyxcbiAgc2l0ZUluZm8sXG4gIG9uUnVuU3RhcnQsXG4gIG9uUnVuQ29udHJvbENoYW5nZSxcbiAgaGlkZUlubGluZVN0b3BCdXR0b24gPSBmYWxzZSxcbn0pID0+IHtcbiAgY29uc3QgW2lzUmVzcG9uZGluZywgeyBzZXRUcnVlOiBzZXRSZXNwb25kaW5nVHJ1ZSwgc2V0RmFsc2U6IHNldFJlc3BvbmRpbmdGYWxzZSB9XSA9IHVzZUJvb2xlYW4oZmFsc2UpXG4gIGNvbnN0IFtjb21wbGV0aW9uUmVzLCBkb1NldENvbXBsZXRpb25SZXNdID0gdXNlU3RhdGU8c3RyaW5nPignJylcbiAgY29uc3QgY29tcGxldGlvblJlc1JlZiA9IHVzZVJlZjxzdHJpbmc+KCcnKVxuICBjb25zdCBzZXRDb21wbGV0aW9uUmVzID0gKHJlczogc3RyaW5nKSA9PiB7XG4gICAgY29tcGxldGlvblJlc1JlZi5jdXJyZW50ID0gcmVzXG4gICAgZG9TZXRDb21wbGV0aW9uUmVzKHJlcylcbiAgfVxuICBjb25zdCBnZXRDb21wbGV0aW9uUmVzID0gKCkgPT4gY29tcGxldGlvblJlc1JlZi5jdXJyZW50XG4gIGNvbnN0IFt3b3JrZmxvd1Byb2Nlc3NEYXRhLCBkb1NldFdvcmtmbG93UHJvY2Vzc0RhdGFdID0gdXNlU3RhdGU8V29ya2Zsb3dQcm9jZXNzPigpXG4gIGNvbnN0IHdvcmtmbG93UHJvY2Vzc0RhdGFSZWYgPSB1c2VSZWY8V29ya2Zsb3dQcm9jZXNzIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpXG4gIGNvbnN0IHNldFdvcmtmbG93UHJvY2Vzc0RhdGEgPSAoZGF0YTogV29ya2Zsb3dQcm9jZXNzKSA9PiB7XG4gICAgd29ya2Zsb3dQcm9jZXNzRGF0YVJlZi5jdXJyZW50ID0gZGF0YVxuICAgIGRvU2V0V29ya2Zsb3dQcm9jZXNzRGF0YShkYXRhKVxuICB9XG4gIGNvbnN0IGdldFdvcmtmbG93UHJvY2Vzc0RhdGEgPSAoKSA9PiB3b3JrZmxvd1Byb2Nlc3NEYXRhUmVmLmN1cnJlbnRcbiAgY29uc3QgW2N1cnJlbnRUYXNrSWQsIHNldEN1cnJlbnRUYXNrSWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW2lzU3RvcHBpbmcsIHNldElzU3RvcHBpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGFib3J0Q29udHJvbGxlclJlZiA9IHVzZVJlZjxBYm9ydENvbnRyb2xsZXIgfCBudWxsPihudWxsKVxuICBjb25zdCByZXNldFJ1blN0YXRlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldEN1cnJlbnRUYXNrSWQobnVsbClcbiAgICBzZXRJc1N0b3BwaW5nKGZhbHNlKVxuICAgIGFib3J0Q29udHJvbGxlclJlZi5jdXJyZW50ID0gbnVsbFxuICAgIG9uUnVuQ29udHJvbENoYW5nZT8uKG51bGwpXG4gIH0sIFtvblJ1bkNvbnRyb2xDaGFuZ2VdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgYWJvcnRDdXJyZW50UmVxdWVzdCA9ICgpID0+IHtcbiAgICAgIGFib3J0Q29udHJvbGxlclJlZi5jdXJyZW50Py5hYm9ydCgpXG4gICAgfVxuXG4gICAgaWYgKGNvbnRyb2xTdG9wUmVzcG9uZGluZykge1xuICAgICAgYWJvcnRDdXJyZW50UmVxdWVzdCgpXG4gICAgICBzZXRSZXNwb25kaW5nRmFsc2UoKVxuICAgICAgcmVzZXRSdW5TdGF0ZSgpXG4gICAgfVxuXG4gICAgcmV0dXJuIGFib3J0Q3VycmVudFJlcXVlc3RcbiAgfSwgW2NvbnRyb2xTdG9wUmVzcG9uZGluZywgcmVzZXRSdW5TdGF0ZSwgc2V0UmVzcG9uZGluZ0ZhbHNlXSlcblxuICBjb25zdCB7IG5vdGlmeSB9ID0gVG9hc3RcbiAgY29uc3QgaXNOb0RhdGEgPSAhY29tcGxldGlvblJlc1xuXG4gIGNvbnN0IFttZXNzYWdlSWQsIHNldE1lc3NhZ2VJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKVxuICBjb25zdCBbZmVlZGJhY2ssIHNldEZlZWRiYWNrXSA9IHVzZVN0YXRlPEZlZWRiYWNrVHlwZT4oe1xuICAgIHJhdGluZzogbnVsbCxcbiAgfSlcblxuICBjb25zdCBoYW5kbGVGZWVkYmFjayA9IGFzeW5jIChmZWVkYmFjazogRmVlZGJhY2tUeXBlKSA9PiB7XG4gICAgYXdhaXQgdXBkYXRlRmVlZGJhY2soeyB1cmw6IGAvbWVzc2FnZXMvJHttZXNzYWdlSWR9L2ZlZWRiYWNrc2AsIGJvZHk6IHsgcmF0aW5nOiBmZWVkYmFjay5yYXRpbmcsIGNvbnRlbnQ6IGZlZWRiYWNrLmNvbnRlbnQgfSB9LCBpc0luc3RhbGxlZEFwcCwgaW5zdGFsbGVkQXBwSW5mbz8uaWQpXG4gICAgc2V0RmVlZGJhY2soZmVlZGJhY2spXG4gIH1cblxuICBjb25zdCBsb2dFcnJvciA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlIH0pXG4gIH1cblxuICBjb25zdCBoYW5kbGVTdG9wID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGlmICghY3VycmVudFRhc2tJZCB8fCBpc1N0b3BwaW5nKVxuICAgICAgcmV0dXJuXG4gICAgc2V0SXNTdG9wcGluZyh0cnVlKVxuICAgIHRyeSB7XG4gICAgICBpZiAoaXNXb3JrZmxvdylcbiAgICAgICAgYXdhaXQgc3RvcFdvcmtmbG93TWVzc2FnZShhcHBJZCwgY3VycmVudFRhc2tJZCwgaXNJbnN0YWxsZWRBcHAsIGluc3RhbGxlZEFwcEluZm8/LmlkIHx8ICcnKVxuICAgICAgZWxzZVxuICAgICAgICBhd2FpdCBzdG9wQ2hhdE1lc3NhZ2VSZXNwb25kaW5nKGFwcElkLCBjdXJyZW50VGFza0lkLCBpc0luc3RhbGxlZEFwcCwgaW5zdGFsbGVkQXBwSW5mbz8uaWQgfHwgJycpXG4gICAgICBhYm9ydENvbnRyb2xsZXJSZWYuY3VycmVudD8uYWJvcnQoKVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcilcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfSlcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBzZXRJc1N0b3BwaW5nKGZhbHNlKVxuICAgIH1cbiAgfSwgW2FwcElkLCBjdXJyZW50VGFza0lkLCBpbnN0YWxsZWRBcHBJbmZvPy5pZCwgaXNJbnN0YWxsZWRBcHAsIGlzU3RvcHBpbmcsIGlzV29ya2Zsb3csIG5vdGlmeV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW9uUnVuQ29udHJvbENoYW5nZSlcbiAgICAgIHJldHVyblxuICAgIGlmIChpc1Jlc3BvbmRpbmcgJiYgY3VycmVudFRhc2tJZCkge1xuICAgICAgb25SdW5Db250cm9sQ2hhbmdlKHtcbiAgICAgICAgb25TdG9wOiBoYW5kbGVTdG9wLFxuICAgICAgICBpc1N0b3BwaW5nLFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvblJ1bkNvbnRyb2xDaGFuZ2UobnVsbClcbiAgICB9XG4gIH0sIFtjdXJyZW50VGFza0lkLCBoYW5kbGVTdG9wLCBpc1Jlc3BvbmRpbmcsIGlzU3RvcHBpbmcsIG9uUnVuQ29udHJvbENoYW5nZV0pXG5cbiAgY29uc3QgY2hlY2tDYW5TZW5kID0gKCkgPT4ge1xuICAgIC8vIGJhdGNoIHdpbGwgY2hlY2sgb3V0ZXJcbiAgICBpZiAoaXNDYWxsQmF0Y2hBUEkpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgY29uc3QgcHJvbXB0X3ZhcmlhYmxlcyA9IHByb21wdENvbmZpZz8ucHJvbXB0X3ZhcmlhYmxlc1xuICAgIGlmICghcHJvbXB0X3ZhcmlhYmxlcyB8fCBwcm9tcHRfdmFyaWFibGVzPy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChjb21wbGV0aW9uRmlsZXMuZmluZChpdGVtID0+IGl0ZW0udHJhbnNmZXJfbWV0aG9kID09PSBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlICYmICFpdGVtLnVwbG9hZF9maWxlX2lkKSkge1xuICAgICAgICBub3RpZnkoeyB0eXBlOiAnaW5mbycsIG1lc3NhZ2U6IHQoJ2Vycm9yTWVzc2FnZS53YWl0Rm9yRmlsZVVwbG9hZCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGxldCBoYXNFbXB0eUlucHV0ID0gJydcbiAgICBjb25zdCByZXF1aXJlZFZhcnMgPSBwcm9tcHRfdmFyaWFibGVzPy5maWx0ZXIoKHsga2V5LCBuYW1lLCByZXF1aXJlZCwgdHlwZSB9KSA9PiB7XG4gICAgICBpZiAodHlwZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGUgPT09ICdjaGVja2JveCcpXG4gICAgICAgIHJldHVybiBmYWxzZSAvLyBib29sZWFuL2NoZWNrYm94IGlucHV0IGlzIG5vdCByZXF1aXJlZFxuICAgICAgY29uc3QgcmVzID0gKCFrZXkgfHwgIWtleS50cmltKCkpIHx8ICghbmFtZSB8fCAhbmFtZS50cmltKCkpIHx8IChyZXF1aXJlZCB8fCByZXF1aXJlZCA9PT0gdW5kZWZpbmVkIHx8IHJlcXVpcmVkID09PSBudWxsKVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH0pIHx8IFtdIC8vIGNvbXBhdGlibGUgd2l0aCBvbGQgdmVyc2lvblxuICAgIHJlcXVpcmVkVmFycy5mb3JFYWNoKCh7IGtleSwgbmFtZSB9KSA9PiB7XG4gICAgICBpZiAoaGFzRW1wdHlJbnB1dClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmICghaW5wdXRzW2tleV0pXG4gICAgICAgIGhhc0VtcHR5SW5wdXQgPSBuYW1lXG4gICAgfSlcblxuICAgIGlmIChoYXNFbXB0eUlucHV0KSB7XG4gICAgICBsb2dFcnJvcih0KCdlcnJvck1lc3NhZ2UudmFsdWVPZlZhclJlcXVpcmVkJywgeyBuczogJ2FwcERlYnVnJywga2V5OiBoYXNFbXB0eUlucHV0IH0pKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKGNvbXBsZXRpb25GaWxlcy5maW5kKGl0ZW0gPT4gaXRlbS50cmFuc2Zlcl9tZXRob2QgPT09IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUgJiYgIWl0ZW0udXBsb2FkX2ZpbGVfaWQpKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnaW5mbycsIG1lc3NhZ2U6IHQoJ2Vycm9yTWVzc2FnZS53YWl0Rm9yRmlsZVVwbG9hZCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gIWhhc0VtcHR5SW5wdXRcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVNlbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGlzUmVzcG9uZGluZykge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2luZm8nLCBtZXNzYWdlOiB0KCdlcnJvck1lc3NhZ2Uud2FpdEZvclJlc3BvbnNlJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCFjaGVja0NhblNlbmQoKSlcbiAgICAgIHJldHVyblxuXG4gICAgLy8gUHJvY2VzcyBpbnB1dHM6IGNvbnZlcnQgZmlsZSBlbnRpdGllcyB0byBBUEkgZm9ybWF0XG4gICAgY29uc3QgcHJvY2Vzc2VkSW5wdXRzID0geyAuLi5mb3JtYXRCb29sZWFuSW5wdXRzKHByb21wdENvbmZpZz8ucHJvbXB0X3ZhcmlhYmxlcywgaW5wdXRzKSB9XG4gICAgcHJvbXB0Q29uZmlnPy5wcm9tcHRfdmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHByb2Nlc3NlZElucHV0c1t2YXJpYWJsZS5rZXldXG4gICAgICBpZiAodmFyaWFibGUudHlwZSA9PT0gJ2ZpbGUnICYmIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIC8vIENvbnZlcnQgc2luZ2xlIGZpbGUgZW50aXR5IHRvIEFQSSBmb3JtYXRcbiAgICAgICAgcHJvY2Vzc2VkSW5wdXRzW3ZhcmlhYmxlLmtleV0gPSBnZXRQcm9jZXNzZWRGaWxlcyhbdmFsdWUgYXMgRmlsZUVudGl0eV0pWzBdXG4gICAgICB9XG4gICAgICBlbHNlIGlmICh2YXJpYWJsZS50eXBlID09PSAnZmlsZS1saXN0JyAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIENvbnZlcnQgZmlsZSBlbnRpdHkgYXJyYXkgdG8gQVBJIGZvcm1hdFxuICAgICAgICBwcm9jZXNzZWRJbnB1dHNbdmFyaWFibGUua2V5XSA9IGdldFByb2Nlc3NlZEZpbGVzKHZhbHVlIGFzIEZpbGVFbnRpdHlbXSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgZGF0YTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIGlucHV0czogcHJvY2Vzc2VkSW5wdXRzLFxuICAgIH1cbiAgICBpZiAodmlzaW9uQ29uZmlnLmVuYWJsZWQgJiYgY29tcGxldGlvbkZpbGVzICYmIGNvbXBsZXRpb25GaWxlcz8ubGVuZ3RoID4gMCkge1xuICAgICAgZGF0YS5maWxlcyA9IGNvbXBsZXRpb25GaWxlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGl0ZW0udHJhbnNmZXJfbWV0aG9kID09PSBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRNZXNzYWdlSWQobnVsbClcbiAgICBzZXRGZWVkYmFjayh7XG4gICAgICByYXRpbmc6IG51bGwsXG4gICAgfSlcbiAgICBzZXRDb21wbGV0aW9uUmVzKCcnKVxuICAgIHJlc2V0UnVuU3RhdGUoKVxuXG4gICAgbGV0IHJlczogc3RyaW5nW10gPSBbXVxuICAgIGxldCB0ZW1wTWVzc2FnZUlkID0gJydcblxuICAgIGlmICghaXNQQykge1xuICAgICAgb25TaG93UmVzKClcbiAgICAgIG9uUnVuU3RhcnQoKVxuICAgIH1cblxuICAgIHNldFJlc3BvbmRpbmdUcnVlKClcbiAgICBsZXQgaXNFbmQgPSBmYWxzZVxuICAgIGxldCBpc1RpbWVvdXQgPSBmYWxzZTtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgc2xlZXAoVEVYVF9HRU5FUkFUSU9OX1RJTUVPVVRfTVMpXG4gICAgICBpZiAoIWlzRW5kKSB7XG4gICAgICAgIHNldFJlc3BvbmRpbmdGYWxzZSgpXG4gICAgICAgIG9uQ29tcGxldGVkKGdldENvbXBsZXRpb25SZXMoKSwgdGFza0lkLCBmYWxzZSlcbiAgICAgICAgcmVzZXRSdW5TdGF0ZSgpXG4gICAgICAgIGlzVGltZW91dCA9IHRydWVcbiAgICAgIH1cbiAgICB9KSgpXG5cbiAgICBpZiAoaXNXb3JrZmxvdykge1xuICAgICAgc2VuZFdvcmtmbG93TWVzc2FnZShcbiAgICAgICAgZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIG9uV29ya2Zsb3dTdGFydGVkOiAoeyB3b3JrZmxvd19ydW5faWQsIHRhc2tfaWQgfSkgPT4ge1xuICAgICAgICAgICAgdGVtcE1lc3NhZ2VJZCA9IHdvcmtmbG93X3J1bl9pZFxuICAgICAgICAgICAgc2V0Q3VycmVudFRhc2tJZCh0YXNrX2lkIHx8IG51bGwpXG4gICAgICAgICAgICBzZXRJc1N0b3BwaW5nKGZhbHNlKVxuICAgICAgICAgICAgc2V0V29ya2Zsb3dQcm9jZXNzRGF0YSh7XG4gICAgICAgICAgICAgIHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICAgICAgICAgIHRyYWNpbmc6IFtdLFxuICAgICAgICAgICAgICBleHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICByZXN1bHRUZXh0OiAnJyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkl0ZXJhdGlvblN0YXJ0OiAoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICAgIHNldFdvcmtmbG93UHJvY2Vzc0RhdGEocHJvZHVjZShnZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKCkhLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgZHJhZnQuZXhwYW5kID0gdHJ1ZVxuICAgICAgICAgICAgICBkcmFmdC50cmFjaW5nIS5wdXNoKHtcbiAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgICAgICAgICAgICBleHBhbmQ6IHRydWUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uSXRlcmF0aW9uTmV4dDogKCkgPT4ge1xuICAgICAgICAgICAgc2V0V29ya2Zsb3dQcm9jZXNzRGF0YShwcm9kdWNlKGdldFdvcmtmbG93UHJvY2Vzc0RhdGEoKSEsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgICBkcmFmdC5leHBhbmQgPSB0cnVlXG4gICAgICAgICAgICAgIGNvbnN0IGl0ZXJhdGlvbnMgPSBkcmFmdC50cmFjaW5nLmZpbmQoaXRlbSA9PiBpdGVtLm5vZGVfaWQgPT09IGRhdGEubm9kZV9pZFxuICAgICAgICAgICAgICAgICYmIChpdGVtLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQgPT09IGRhdGEuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCB8fCBpdGVtLnBhcmFsbGVsX2lkID09PSBkYXRhLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQpKSFcbiAgICAgICAgICAgICAgaXRlcmF0aW9ucz8uZGV0YWlscyEucHVzaChbXSlcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25JdGVyYXRpb25GaW5pc2g6ICh7IGRhdGEgfSkgPT4ge1xuICAgICAgICAgICAgc2V0V29ya2Zsb3dQcm9jZXNzRGF0YShwcm9kdWNlKGdldFdvcmtmbG93UHJvY2Vzc0RhdGEoKSEsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgICBkcmFmdC5leHBhbmQgPSB0cnVlXG4gICAgICAgICAgICAgIGNvbnN0IGl0ZXJhdGlvbnNJbmRleCA9IGRyYWZ0LnRyYWNpbmcuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5ub2RlX2lkID09PSBkYXRhLm5vZGVfaWRcbiAgICAgICAgICAgICAgICAmJiAoaXRlbS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmFsbGVsX2lkID09PSBkYXRhLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQgfHwgaXRlbS5wYXJhbGxlbF9pZCA9PT0gZGF0YS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmFsbGVsX2lkKSkhXG4gICAgICAgICAgICAgIGRyYWZ0LnRyYWNpbmdbaXRlcmF0aW9uc0luZGV4XSA9IHtcbiAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgIGV4cGFuZDogISFkYXRhLmVycm9yLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uTG9vcFN0YXJ0OiAoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICAgIHNldFdvcmtmbG93UHJvY2Vzc0RhdGEocHJvZHVjZShnZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKCkhLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgZHJhZnQuZXhwYW5kID0gdHJ1ZVxuICAgICAgICAgICAgICBkcmFmdC50cmFjaW5nIS5wdXNoKHtcbiAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgICAgICAgICAgICBleHBhbmQ6IHRydWUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uTG9vcE5leHQ6ICgpID0+IHtcbiAgICAgICAgICAgIHNldFdvcmtmbG93UHJvY2Vzc0RhdGEocHJvZHVjZShnZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKCkhLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgZHJhZnQuZXhwYW5kID0gdHJ1ZVxuICAgICAgICAgICAgICBjb25zdCBsb29wcyA9IGRyYWZ0LnRyYWNpbmcuZmluZChpdGVtID0+IGl0ZW0ubm9kZV9pZCA9PT0gZGF0YS5ub2RlX2lkXG4gICAgICAgICAgICAgICAgJiYgKGl0ZW0uZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCA9PT0gZGF0YS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmFsbGVsX2lkIHx8IGl0ZW0ucGFyYWxsZWxfaWQgPT09IGRhdGEuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCkpIVxuICAgICAgICAgICAgICBsb29wcz8uZGV0YWlscyEucHVzaChbXSlcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25Mb29wRmluaXNoOiAoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICAgIHNldFdvcmtmbG93UHJvY2Vzc0RhdGEocHJvZHVjZShnZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKCkhLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgZHJhZnQuZXhwYW5kID0gdHJ1ZVxuICAgICAgICAgICAgICBjb25zdCBsb29wc0luZGV4ID0gZHJhZnQudHJhY2luZy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLm5vZGVfaWQgPT09IGRhdGEubm9kZV9pZFxuICAgICAgICAgICAgICAgICYmIChpdGVtLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQgPT09IGRhdGEuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCB8fCBpdGVtLnBhcmFsbGVsX2lkID09PSBkYXRhLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQpKSFcbiAgICAgICAgICAgICAgZHJhZnQudHJhY2luZ1tsb29wc0luZGV4XSA9IHtcbiAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgIGV4cGFuZDogISFkYXRhLmVycm9yLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uTm9kZVN0YXJ0ZWQ6ICh7IGRhdGEgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuaXRlcmF0aW9uX2lkKVxuICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgaWYgKGRhdGEubG9vcF9pZClcbiAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIHNldFdvcmtmbG93UHJvY2Vzc0RhdGEocHJvZHVjZShnZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKCkhLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgZHJhZnQuZXhwYW5kID0gdHJ1ZVxuICAgICAgICAgICAgICBkcmFmdC50cmFjaW5nIS5wdXNoKHtcbiAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgICAgICAgICAgICBleHBhbmQ6IHRydWUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uTm9kZUZpbmlzaGVkOiAoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLml0ZXJhdGlvbl9pZClcbiAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIChkYXRhLmxvb3BfaWQpXG4gICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBzZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKHByb2R1Y2UoZ2V0V29ya2Zsb3dQcm9jZXNzRGF0YSgpISwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGRyYWZ0LnRyYWNpbmchLmZpbmRJbmRleCh0cmFjZSA9PiB0cmFjZS5ub2RlX2lkID09PSBkYXRhLm5vZGVfaWRcbiAgICAgICAgICAgICAgICAmJiAodHJhY2UuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCA9PT0gZGF0YS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmFsbGVsX2lkIHx8IHRyYWNlLnBhcmFsbGVsX2lkID09PSBkYXRhLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQpKVxuICAgICAgICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gLTEgJiYgZHJhZnQudHJhY2luZykge1xuICAgICAgICAgICAgICAgIGRyYWZ0LnRyYWNpbmdbY3VycmVudEluZGV4XSA9IHtcbiAgICAgICAgICAgICAgICAgIC4uLihkcmFmdC50cmFjaW5nW2N1cnJlbnRJbmRleF0uZXh0cmFzXG4gICAgICAgICAgICAgICAgICAgID8geyBleHRyYXM6IGRyYWZ0LnRyYWNpbmdbY3VycmVudEluZGV4XS5leHRyYXMgfVxuICAgICAgICAgICAgICAgICAgICA6IHt9KSxcbiAgICAgICAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICAgICAgICBleHBhbmQ6ICEhZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25Xb3JrZmxvd0ZpbmlzaGVkOiAoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChpc1RpbWVvdXQpIHtcbiAgICAgICAgICAgICAgbm90aWZ5KHsgdHlwZTogJ3dhcm5pbmcnLCBtZXNzYWdlOiB0KCd3YXJuaW5nTWVzc2FnZS50aW1lb3V0RXhjZWVkZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgd29ya2Zsb3dTdGF0dXMgPSBkYXRhLnN0YXR1cyBhcyBXb3JrZmxvd1J1bm5pbmdTdGF0dXMgfCB1bmRlZmluZWRcbiAgICAgICAgICAgIGNvbnN0IG1hcmtOb2Rlc1N0b3BwZWQgPSAodHJhY2VzPzogV29ya2Zsb3dQcm9jZXNzWyd0cmFjaW5nJ10pID0+IHtcbiAgICAgICAgICAgICAgaWYgKCF0cmFjZXMpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgIGNvbnN0IG1hcmtUcmFjZSA9ICh0cmFjZTogV29ya2Zsb3dQcm9jZXNzWyd0cmFjaW5nJ11bbnVtYmVyXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChbTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZywgTm9kZVJ1bm5pbmdTdGF0dXMuV2FpdGluZ10uaW5jbHVkZXModHJhY2Uuc3RhdHVzIGFzIE5vZGVSdW5uaW5nU3RhdHVzKSlcbiAgICAgICAgICAgICAgICAgIHRyYWNlLnN0YXR1cyA9IE5vZGVSdW5uaW5nU3RhdHVzLlN0b3BwZWRcbiAgICAgICAgICAgICAgICB0cmFjZS5kZXRhaWxzPy5mb3JFYWNoKGRldGFpbEdyb3VwID0+IGRldGFpbEdyb3VwLmZvckVhY2gobWFya1RyYWNlKSlcbiAgICAgICAgICAgICAgICB0cmFjZS5yZXRyeURldGFpbD8uZm9yRWFjaChtYXJrVHJhY2UpXG4gICAgICAgICAgICAgICAgdHJhY2UucGFyYWxsZWxEZXRhaWw/LmNoaWxkcmVuPy5mb3JFYWNoKG1hcmtUcmFjZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0cmFjZXMuZm9yRWFjaChtYXJrVHJhY2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod29ya2Zsb3dTdGF0dXMgPT09IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdG9wcGVkKSB7XG4gICAgICAgICAgICAgIHNldFdvcmtmbG93UHJvY2Vzc0RhdGEocHJvZHVjZShnZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKCkhLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgICBkcmFmdC5zdGF0dXMgPSBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuU3RvcHBlZFxuICAgICAgICAgICAgICAgIG1hcmtOb2Rlc1N0b3BwZWQoZHJhZnQudHJhY2luZylcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgIHNldFJlc3BvbmRpbmdGYWxzZSgpXG4gICAgICAgICAgICAgIHJlc2V0UnVuU3RhdGUoKVxuICAgICAgICAgICAgICBvbkNvbXBsZXRlZChnZXRDb21wbGV0aW9uUmVzKCksIHRhc2tJZCwgZmFsc2UpXG4gICAgICAgICAgICAgIGlzRW5kID0gdHJ1ZVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhLmVycm9yKSB7XG4gICAgICAgICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGRhdGEuZXJyb3IgfSlcbiAgICAgICAgICAgICAgc2V0V29ya2Zsb3dQcm9jZXNzRGF0YShwcm9kdWNlKGdldFdvcmtmbG93UHJvY2Vzc0RhdGEoKSEsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgICAgIGRyYWZ0LnN0YXR1cyA9IFdvcmtmbG93UnVubmluZ1N0YXR1cy5GYWlsZWRcbiAgICAgICAgICAgICAgICBtYXJrTm9kZXNTdG9wcGVkKGRyYWZ0LnRyYWNpbmcpXG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICBzZXRSZXNwb25kaW5nRmFsc2UoKVxuICAgICAgICAgICAgICByZXNldFJ1blN0YXRlKClcbiAgICAgICAgICAgICAgb25Db21wbGV0ZWQoZ2V0Q29tcGxldGlvblJlcygpLCB0YXNrSWQsIGZhbHNlKVxuICAgICAgICAgICAgICBpc0VuZCA9IHRydWVcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKHByb2R1Y2UoZ2V0V29ya2Zsb3dQcm9jZXNzRGF0YSgpISwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgIGRyYWZ0LnN0YXR1cyA9IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdWNjZWVkZWRcbiAgICAgICAgICAgICAgZHJhZnQuZmlsZXMgPSBnZXRGaWxlc0luTG9ncyhkYXRhLm91dHB1dHMgfHwgW10pIGFzIGFueVtdXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIGlmICghZGF0YS5vdXRwdXRzKSB7XG4gICAgICAgICAgICAgIHNldENvbXBsZXRpb25SZXMoJycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgc2V0Q29tcGxldGlvblJlcyhkYXRhLm91dHB1dHMpXG4gICAgICAgICAgICAgIGNvbnN0IGlzU3RyaW5nT3V0cHV0ID0gT2JqZWN0LmtleXMoZGF0YS5vdXRwdXRzKS5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGRhdGEub3V0cHV0c1tPYmplY3Qua2V5cyhkYXRhLm91dHB1dHMpWzBdXSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgaWYgKGlzU3RyaW5nT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgc2V0V29ya2Zsb3dQcm9jZXNzRGF0YShwcm9kdWNlKGdldFdvcmtmbG93UHJvY2Vzc0RhdGEoKSEsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgZHJhZnQucmVzdWx0VGV4dCA9IGRhdGEub3V0cHV0c1tPYmplY3Qua2V5cyhkYXRhLm91dHB1dHMpWzBdXVxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRSZXNwb25kaW5nRmFsc2UoKVxuICAgICAgICAgICAgcmVzZXRSdW5TdGF0ZSgpXG4gICAgICAgICAgICBzZXRNZXNzYWdlSWQodGVtcE1lc3NhZ2VJZClcbiAgICAgICAgICAgIG9uQ29tcGxldGVkKGdldENvbXBsZXRpb25SZXMoKSwgdGFza0lkLCB0cnVlKVxuICAgICAgICAgICAgaXNFbmQgPSB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvblRleHRDaHVuazogKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBkYXRhOiB7IHRleHQgfSB9ID0gcGFyYW1zXG4gICAgICAgICAgICBzZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKHByb2R1Y2UoZ2V0V29ya2Zsb3dQcm9jZXNzRGF0YSgpISwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgIGRyYWZ0LnJlc3VsdFRleHQgKz0gdGV4dFxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvblRleHRSZXBsYWNlOiAocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGE6IHsgdGV4dCB9IH0gPSBwYXJhbXNcbiAgICAgICAgICAgIHNldFdvcmtmbG93UHJvY2Vzc0RhdGEocHJvZHVjZShnZXRXb3JrZmxvd1Byb2Nlc3NEYXRhKCkhLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgICAgZHJhZnQucmVzdWx0VGV4dCA9IHRleHRcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGlzSW5zdGFsbGVkQXBwLFxuICAgICAgICBpbnN0YWxsZWRBcHBJbmZvPy5pZCxcbiAgICAgICkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHNldFJlc3BvbmRpbmdGYWxzZSgpXG4gICAgICAgIHJlc2V0UnVuU3RhdGUoKVxuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpXG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc2VuZENvbXBsZXRpb25NZXNzYWdlKGRhdGEsIHtcbiAgICAgICAgb25EYXRhOiAoZGF0YTogc3RyaW5nLCBfaXNGaXJzdE1lc3NhZ2U6IGJvb2xlYW4sIHsgbWVzc2FnZUlkLCB0YXNrSWQgfSkgPT4ge1xuICAgICAgICAgIHRlbXBNZXNzYWdlSWQgPSBtZXNzYWdlSWRcbiAgICAgICAgICBpZiAodGFza0lkICYmIHR5cGVvZiB0YXNrSWQgPT09ICdzdHJpbmcnICYmIHRhc2tJZC50cmltKCkgIT09ICcnKVxuICAgICAgICAgICAgc2V0Q3VycmVudFRhc2tJZChwcmV2ID0+IHByZXYgPz8gdGFza0lkKVxuICAgICAgICAgIHJlcy5wdXNoKGRhdGEpXG4gICAgICAgICAgc2V0Q29tcGxldGlvblJlcyhyZXMuam9pbignJykpXG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGVkOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKGlzVGltZW91dCkge1xuICAgICAgICAgICAgbm90aWZ5KHsgdHlwZTogJ3dhcm5pbmcnLCBtZXNzYWdlOiB0KCd3YXJuaW5nTWVzc2FnZS50aW1lb3V0RXhjZWVkZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0UmVzcG9uZGluZ0ZhbHNlKClcbiAgICAgICAgICByZXNldFJ1blN0YXRlKClcbiAgICAgICAgICBzZXRNZXNzYWdlSWQodGVtcE1lc3NhZ2VJZClcbiAgICAgICAgICBvbkNvbXBsZXRlZChnZXRDb21wbGV0aW9uUmVzKCksIHRhc2tJZCwgdHJ1ZSlcbiAgICAgICAgICBpc0VuZCA9IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgb25NZXNzYWdlUmVwbGFjZTogKG1lc3NhZ2VSZXBsYWNlKSA9PiB7XG4gICAgICAgICAgcmVzID0gW21lc3NhZ2VSZXBsYWNlLmFuc3dlcl1cbiAgICAgICAgICBzZXRDb21wbGV0aW9uUmVzKHJlcy5qb2luKCcnKSlcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcigpIHtcbiAgICAgICAgICBpZiAoaXNUaW1lb3V0KSB7XG4gICAgICAgICAgICBub3RpZnkoeyB0eXBlOiAnd2FybmluZycsIG1lc3NhZ2U6IHQoJ3dhcm5pbmdNZXNzYWdlLnRpbWVvdXRFeGNlZWRlZCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRSZXNwb25kaW5nRmFsc2UoKVxuICAgICAgICAgIHJlc2V0UnVuU3RhdGUoKVxuICAgICAgICAgIG9uQ29tcGxldGVkKGdldENvbXBsZXRpb25SZXMoKSwgdGFza0lkLCBmYWxzZSlcbiAgICAgICAgICBpc0VuZCA9IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWJvcnRDb250cm9sbGVyOiAoYWJvcnRDb250cm9sbGVyKSA9PiB7XG4gICAgICAgICAgYWJvcnRDb250cm9sbGVyUmVmLmN1cnJlbnQgPSBhYm9ydENvbnRyb2xsZXJcbiAgICAgICAgfSxcbiAgICAgIH0sIGlzSW5zdGFsbGVkQXBwLCBpbnN0YWxsZWRBcHBJbmZvPy5pZClcbiAgICB9XG4gIH1cblxuICBjb25zdCBbY29udHJvbENsZWFyTW9yZUxpa2VUaGlzLCBzZXRDb250cm9sQ2xlYXJNb3JlTGlrZVRoaXNdID0gdXNlU3RhdGUoMClcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoY29udHJvbFNlbmQpIHtcbiAgICAgIGhhbmRsZVNlbmQoKVxuICAgICAgc2V0Q29udHJvbENsZWFyTW9yZUxpa2VUaGlzKERhdGUubm93KCkpXG4gICAgfVxuICB9LCBbY29udHJvbFNlbmRdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGNvbnRyb2xSZXRyeSlcbiAgICAgIGhhbmRsZVNlbmQoKVxuICB9LCBbY29udHJvbFJldHJ5XSlcblxuICBjb25zdCByZW5kZXJUZXh0R2VuZXJhdGlvblJlcyA9ICgpID0+IChcbiAgICA8PlxuICAgICAgeyFoaWRlSW5saW5lU3RvcEJ1dHRvbiAmJiBpc1Jlc3BvbmRpbmcgJiYgY3VycmVudFRhc2tJZCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgbWItMyBmbGV4ICR7aXNQQyA/ICdqdXN0aWZ5LWVuZCcgOiAnanVzdGlmeS1jZW50ZXInfWB9PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzU3RvcHBpbmd9XG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVTdG9wfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaXNTdG9wcGluZ1xuICAgICAgICAgICAgICAgID8gPFJpTG9hZGVyMkxpbmUgY2xhc3NOYW1lPVwibXItWzVweF0gaC0zLjUgdy0zLjUgYW5pbWF0ZS1zcGluXCIgLz5cbiAgICAgICAgICAgICAgICA6IDxTdG9wQ2lyY2xlIGNsYXNzTmFtZT1cIm1yLVs1cHhdIGgtMy41IHctMy41XCIgLz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ub3JtYWxcIj57dCgnb3BlcmF0aW9uLnN0b3BSZXNwb25kaW5nJywgeyBuczogJ2FwcERlYnVnJyB9KX08L3NwYW4+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIDxUZXh0R2VuZXJhdGlvblJlc1xuICAgICAgICBpc1dvcmtmbG93PXtpc1dvcmtmbG93fVxuICAgICAgICB3b3JrZmxvd1Byb2Nlc3NEYXRhPXt3b3JrZmxvd1Byb2Nlc3NEYXRhfVxuICAgICAgICBpc0Vycm9yPXtpc0Vycm9yfVxuICAgICAgICBvblJldHJ5PXtoYW5kbGVTZW5kfVxuICAgICAgICBjb250ZW50PXtjb21wbGV0aW9uUmVzfVxuICAgICAgICBtZXNzYWdlSWQ9e21lc3NhZ2VJZH1cbiAgICAgICAgaXNJbldlYkFwcFxuICAgICAgICBtb3JlTGlrZVRoaXM9e21vcmVMaWtlVGhpc0VuYWJsZWR9XG4gICAgICAgIG9uRmVlZGJhY2s9e2hhbmRsZUZlZWRiYWNrfVxuICAgICAgICBmZWVkYmFjaz17ZmVlZGJhY2t9XG4gICAgICAgIG9uU2F2ZT17aGFuZGxlU2F2ZU1lc3NhZ2V9XG4gICAgICAgIGlzTW9iaWxlPXtpc01vYmlsZX1cbiAgICAgICAgaXNJbnN0YWxsZWRBcHA9e2lzSW5zdGFsbGVkQXBwfVxuICAgICAgICBpbnN0YWxsZWRBcHBJZD17aW5zdGFsbGVkQXBwSW5mbz8uaWR9XG4gICAgICAgIGlzTG9hZGluZz17aXNDYWxsQmF0Y2hBUEkgPyAoIWNvbXBsZXRpb25SZXMgJiYgaXNSZXNwb25kaW5nKSA6IGZhbHNlfVxuICAgICAgICB0YXNrSWQ9e2lzQ2FsbEJhdGNoQVBJID8gKCh0YXNrSWQgYXMgbnVtYmVyKSA8IDEwID8gYDAke3Rhc2tJZH1gIDogYCR7dGFza0lkfWApIDogdW5kZWZpbmVkfVxuICAgICAgICBjb250cm9sQ2xlYXJNb3JlTGlrZVRoaXM9e2NvbnRyb2xDbGVhck1vcmVMaWtlVGhpc31cbiAgICAgICAgaXNTaG93VGV4dFRvU3BlZWNoPXtpc1Nob3dUZXh0VG9TcGVlY2h9XG4gICAgICAgIGhpZGVQcm9jZXNzRGV0YWlsXG4gICAgICAgIHNpdGVJbmZvPXtzaXRlSW5mb31cbiAgICAgIC8+XG4gICAgPC8+XG4gIClcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7IWlzQ2FsbEJhdGNoQVBJICYmICFpc1dvcmtmbG93ICYmIChcbiAgICAgICAgKGlzUmVzcG9uZGluZyAmJiAhY29tcGxldGlvblJlcylcbiAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtZnVsbCB3LWZ1bGwgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgPExvYWRpbmcgdHlwZT1cImFyZWFcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICB7KGlzTm9EYXRhKVxuICAgICAgICAgICAgICAgICAgPyA8Tm9EYXRhIC8+XG4gICAgICAgICAgICAgICAgICA6IHJlbmRlclRleHRHZW5lcmF0aW9uUmVzKCl9XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKVxuICAgICAgKX1cbiAgICAgIHshaXNDYWxsQmF0Y2hBUEkgJiYgaXNXb3JrZmxvdyAmJiAoXG4gICAgICAgIChpc1Jlc3BvbmRpbmcgJiYgIXdvcmtmbG93UHJvY2Vzc0RhdGEpXG4gICAgICAgICAgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgdy1mdWxsIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgIDxMb2FkaW5nIHR5cGU9XCJhcmVhXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgOiAhd29ya2Zsb3dQcm9jZXNzRGF0YVxuICAgICAgICAgICAgICA/IDxOb0RhdGEgLz5cbiAgICAgICAgICAgICAgOiByZW5kZXJUZXh0R2VuZXJhdGlvblJlcygpXG4gICAgICApfVxuICAgICAge2lzQ2FsbEJhdGNoQVBJICYmIHJlbmRlclRleHRHZW5lcmF0aW9uUmVzKCl9XG4gICAgPC8+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oUmVzdWx0KVxuIl19