"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const compat_1 = require("es-toolkit/compat");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const shallow_1 = require("zustand/react/shallow");
const store_1 = require("@/app/components/app/store");
const mediaAndDevices_1 = require("@/app/components/base/icons/src/vender/line/mediaAndDevices");
const tooltip_1 = require("@/app/components/base/tooltip");
const constants_1 = require("@/app/components/header/account-setting/constants");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const plugin_auth_1 = require("@/app/components/plugins/plugin-auth");
const store_2 = require("@/app/components/plugins/plugin-detail-panel/store");
const entrance_1 = require("@/app/components/plugins/readme-panel/entrance");
const block_icon_1 = require("@/app/components/workflow/block-icon");
const hooks_2 = require("@/app/components/workflow/hooks");
const hooks_store_1 = require("@/app/components/workflow/hooks-store");
const use_inspect_vars_crud_1 = require("@/app/components/workflow/hooks/use-inspect-vars-crud");
const split_1 = require("@/app/components/workflow/nodes/_base/components/split");
const before_run_form_1 = require("@/app/components/workflow/nodes/data-source/before-run-form");
const types_1 = require("@/app/components/workflow/nodes/data-source/types");
const hooks_3 = require("@/app/components/workflow/run/hooks");
const special_result_panel_1 = require("@/app/components/workflow/run/special-result-panel");
const store_3 = require("@/app/components/workflow/store");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const modal_context_1 = require("@/context/modal-context");
const use_tools_1 = require("@/service/use-tools");
const use_triggers_1 = require("@/service/use-triggers");
const common_1 = require("@/types/common");
const utils_2 = require("@/utils");
const classnames_1 = require("@/utils/classnames");
const use_resize_panel_1 = require("../../hooks/use-resize-panel");
const before_run_form_2 = require("../before-run-form");
const panel_wrap_1 = require("../before-run-form/panel-wrap");
const error_handle_on_panel_1 = require("../error-handle/error-handle-on-panel");
const help_link_1 = require("../help-link");
const next_step_1 = require("../next-step");
const panel_operator_1 = require("../panel-operator");
const retry_on_panel_1 = require("../retry/retry-on-panel");
const title_description_input_1 = require("../title-description-input");
const last_run_1 = require("./last-run");
const use_last_run_1 = require("./last-run/use-last-run");
const tab_1 = require("./tab");
const trigger_subscription_1 = require("./trigger-subscription");
const getCustomRunForm = (params) => {
    const nodeType = params.payload.type;
    switch (nodeType) {
        case types_2.BlockEnum.DataSource:
            return <before_run_form_1.default {...params}/>;
        default:
            return (<div>
          Custom Run Form:
          {nodeType}
          {' '}
          not found
        </div>);
    }
};
const BasePanel = ({ id, data, children, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const language = (0, hooks_1.useLanguage)();
    const { showMessageLogModal } = (0, store_1.useStore)((0, shallow_1.useShallow)(state => ({
        showMessageLogModal: state.showMessageLogModal,
    })));
    const isSingleRunning = data._singleRunningStatus === types_2.NodeRunningStatus.Running;
    const showSingleRunPanel = (0, store_3.useStore)(s => s.showSingleRunPanel);
    const workflowCanvasWidth = (0, store_3.useStore)(s => s.workflowCanvasWidth);
    const nodePanelWidth = (0, store_3.useStore)(s => s.nodePanelWidth);
    const otherPanelWidth = (0, store_3.useStore)(s => s.otherPanelWidth);
    const setNodePanelWidth = (0, store_3.useStore)(s => s.setNodePanelWidth);
    const pendingSingleRun = (0, store_3.useStore)(s => s.pendingSingleRun);
    const setPendingSingleRun = (0, store_3.useStore)(s => s.setPendingSingleRun);
    const reservedCanvasWidth = 400; // Reserve the minimum visible width for the canvas
    const maxNodePanelWidth = (0, react_2.useMemo)(() => {
        if (!workflowCanvasWidth)
            return 720;
        const available = workflowCanvasWidth - (otherPanelWidth || 0) - reservedCanvasWidth;
        return Math.max(available, 400);
    }, [workflowCanvasWidth, otherPanelWidth]);
    const updateNodePanelWidth = (0, react_2.useCallback)((width, source = 'user') => {
        // Ensure the width is within the min and max range
        const newValue = Math.max(400, Math.min(width, maxNodePanelWidth));
        if (source === 'user')
            localStorage.setItem('workflow-node-panel-width', `${newValue}`);
        setNodePanelWidth(newValue);
    }, [maxNodePanelWidth, setNodePanelWidth]);
    const handleResize = (0, react_2.useCallback)((width) => {
        updateNodePanelWidth(width, 'user');
    }, [updateNodePanelWidth]);
    const { triggerRef, containerRef, } = (0, use_resize_panel_1.useResizePanel)({
        direction: 'horizontal',
        triggerDirection: 'left',
        minWidth: 400,
        maxWidth: maxNodePanelWidth,
        onResize: (0, compat_1.debounce)(handleResize),
    });
    const debounceUpdate = (0, compat_1.debounce)((width) => {
        updateNodePanelWidth(width, 'system');
    });
    (0, react_2.useEffect)(() => {
        if (!workflowCanvasWidth)
            return;
        // If the total width of the three exceeds the canvas, shrink the node panel to the available range (at least 400px)
        const total = nodePanelWidth + otherPanelWidth + reservedCanvasWidth;
        if (total > workflowCanvasWidth) {
            const target = Math.max(workflowCanvasWidth - otherPanelWidth - reservedCanvasWidth, 400);
            debounceUpdate(target);
        }
    }, [nodePanelWidth, otherPanelWidth, workflowCanvasWidth, debounceUpdate]);
    const { handleNodeSelect } = (0, hooks_2.useNodesInteractions)();
    const { nodesReadOnly } = (0, hooks_2.useNodesReadOnly)();
    const { availableNextBlocks } = (0, hooks_2.useAvailableBlocks)(data.type, data.isInIteration || data.isInLoop);
    const toolIcon = (0, hooks_2.useToolIcon)(data);
    const { saveStateToHistory } = (0, hooks_2.useWorkflowHistory)();
    const { handleNodeDataUpdate, handleNodeDataUpdateWithSyncDraft, } = (0, hooks_2.useNodeDataUpdate)();
    const handleTitleBlur = (0, react_2.useCallback)((title) => {
        handleNodeDataUpdateWithSyncDraft({ id, data: { title } });
        saveStateToHistory(hooks_2.WorkflowHistoryEvent.NodeTitleChange, { nodeId: id });
    }, [handleNodeDataUpdateWithSyncDraft, id, saveStateToHistory]);
    const handleDescriptionChange = (0, react_2.useCallback)((desc) => {
        handleNodeDataUpdateWithSyncDraft({ id, data: { desc } });
        saveStateToHistory(hooks_2.WorkflowHistoryEvent.NodeDescriptionChange, { nodeId: id });
    }, [handleNodeDataUpdateWithSyncDraft, id, saveStateToHistory]);
    const isChildNode = !!(data.isInIteration || data.isInLoop);
    const isSupportSingleRun = (0, utils_1.canRunBySingle)(data.type, isChildNode);
    const appDetail = (0, store_1.useStore)(state => state.appDetail);
    const hasClickRunning = (0, react_2.useRef)(false);
    const [isPaused, setIsPaused] = (0, react_2.useState)(false);
    (0, react_2.useEffect)(() => {
        if (data._singleRunningStatus === types_2.NodeRunningStatus.Running) {
            hasClickRunning.current = true;
            setIsPaused(false);
        }
        else if (data._isSingleRun && data._singleRunningStatus === undefined && hasClickRunning) {
            setIsPaused(true);
            hasClickRunning.current = false;
        }
    }, [data]);
    const updateNodeRunningStatus = (0, react_2.useCallback)((status) => {
        handleNodeDataUpdate({
            id,
            data: {
                ...data,
                _singleRunningStatus: status,
            },
        });
    }, [handleNodeDataUpdate, id, data]);
    (0, react_2.useEffect)(() => {
        hasClickRunning.current = false;
    }, [id]);
    const { nodesMap, } = (0, hooks_2.useNodesMetaData)();
    const configsMap = (0, hooks_store_1.useHooksStore)(s => s.configsMap);
    const { isShowSingleRun, hideSingleRun, runningStatus, runInputData, runInputDataRef, runResult, setRunResult, getInputVars, toVarInputs, tabType, isRunAfterSingleRun, setIsRunAfterSingleRun, setTabType, handleAfterCustomSingleRun, singleRunParams, nodeInfo, setRunInputData, handleStop, handleSingleRun, handleRunWithParams, getExistVarValuesInForms, getFilteredExistVarForms, } = (0, use_last_run_1.default)({
        id,
        flowId: configsMap?.flowId || '',
        flowType: configsMap?.flowType || common_1.FlowType.appFlow,
        data,
        defaultRunInputData: nodesMap?.[data.type]?.defaultRunInputData || {},
        isPaused,
    });
    (0, react_2.useEffect)(() => {
        setIsPaused(false);
    }, [tabType]);
    (0, react_2.useEffect)(() => {
        if (!pendingSingleRun || pendingSingleRun.nodeId !== id)
            return;
        if (pendingSingleRun.action === 'run')
            handleSingleRun();
        else
            handleStop();
        setPendingSingleRun(undefined);
    }, [pendingSingleRun, id, handleSingleRun, handleStop, setPendingSingleRun]);
    const logParams = (0, hooks_3.useLogs)();
    const passedLogParams = (0, react_2.useMemo)(() => [types_2.BlockEnum.Tool, types_2.BlockEnum.Agent, types_2.BlockEnum.Iteration, types_2.BlockEnum.Loop].includes(data.type) ? logParams : {}, [data.type, logParams]);
    const storeBuildInTools = (0, store_3.useStore)(s => s.buildInTools);
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const currToolCollection = (0, react_2.useMemo)(() => {
        const candidates = buildInTools ?? storeBuildInTools;
        return candidates?.find(item => (0, utils_2.canFindTool)(item.id, data.provider_id));
    }, [buildInTools, storeBuildInTools, data.provider_id]);
    const needsToolAuth = (0, react_2.useMemo)(() => {
        return data.type === types_2.BlockEnum.Tool && currToolCollection?.allow_delete;
    }, [data.type, currToolCollection?.allow_delete]);
    // only fetch trigger plugins when the node is a trigger plugin
    const { data: triggerPlugins = [] } = (0, use_triggers_1.useAllTriggerPlugins)(data.type === types_2.BlockEnum.TriggerPlugin);
    const currentTriggerPlugin = (0, react_2.useMemo)(() => {
        if (data.type !== types_2.BlockEnum.TriggerPlugin || !data.plugin_id || !triggerPlugins?.length)
            return undefined;
        return triggerPlugins?.find(p => p.plugin_id === data.plugin_id);
    }, [data.type, data.plugin_id, triggerPlugins]);
    const { setDetail } = (0, store_2.usePluginStore)();
    (0, react_2.useEffect)(() => {
        if (currentTriggerPlugin) {
            setDetail({
                name: currentTriggerPlugin.label[language],
                plugin_id: currentTriggerPlugin.plugin_id || '',
                plugin_unique_identifier: currentTriggerPlugin.plugin_unique_identifier || '',
                id: currentTriggerPlugin.id,
                provider: currentTriggerPlugin.name,
                declaration: {
                    trigger: {
                        subscription_schema: currentTriggerPlugin.subscription_schema || [],
                        subscription_constructor: currentTriggerPlugin.subscription_constructor,
                    },
                },
            });
        }
    }, [currentTriggerPlugin, language, setDetail]);
    const dataSourceList = (0, store_3.useStore)(s => s.dataSourceList);
    const currentDataSource = (0, react_2.useMemo)(() => {
        if (data.type === types_2.BlockEnum.DataSource && data.provider_type !== types_1.DataSourceClassification.localFile)
            return dataSourceList?.find(item => item.plugin_id === data.plugin_id);
    }, [dataSourceList, data.provider_id, data.type, data.provider_type]);
    const handleAuthorizationItemClick = (0, react_2.useCallback)((credential_id) => {
        handleNodeDataUpdateWithSyncDraft({
            id,
            data: {
                credential_id,
            },
        });
    }, [handleNodeDataUpdateWithSyncDraft, id]);
    const { setShowAccountSettingModal } = (0, modal_context_1.useModalContext)();
    const handleJumpToDataSourcePage = (0, react_2.useCallback)(() => {
        setShowAccountSettingModal({ payload: constants_1.ACCOUNT_SETTING_TAB.DATA_SOURCE });
    }, [setShowAccountSettingModal]);
    const { appendNodeInspectVars, } = (0, use_inspect_vars_crud_1.default)();
    const handleSubscriptionChange = (0, react_2.useCallback)((v, callback) => {
        handleNodeDataUpdateWithSyncDraft({ id, data: { subscription_id: v.id } }, {
            sync: true,
            callback: { onSettled: callback },
        });
    }, [handleNodeDataUpdateWithSyncDraft, id]);
    const readmeEntranceComponent = (0, react_2.useMemo)(() => {
        let pluginDetail;
        switch (data.type) {
            case types_2.BlockEnum.Tool:
                pluginDetail = currToolCollection;
                break;
            case types_2.BlockEnum.DataSource:
                pluginDetail = currentDataSource;
                break;
            case types_2.BlockEnum.TriggerPlugin:
                pluginDetail = currentTriggerPlugin;
                break;
            default:
                break;
        }
        return !pluginDetail ? null : <entrance_1.ReadmeEntrance pluginDetail={pluginDetail} className="mt-auto"/>;
    }, [data.type, currToolCollection, currentDataSource, currentTriggerPlugin]);
    const selectedNode = (0, react_2.useMemo)(() => ({
        id,
        data,
    }), [id, data]);
    if (logParams.showSpecialResultPanel) {
        return (<div className={(0, classnames_1.cn)('relative mr-1  h-full')}>
        <div ref={containerRef} className={(0, classnames_1.cn)('flex h-full flex-col rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg', showSingleRunPanel ? 'overflow-hidden' : 'overflow-y-auto')} style={{
                width: `${nodePanelWidth}px`,
            }}>
          <panel_wrap_1.default nodeName={data.title} onHide={hideSingleRun}>
            <div className="h-0 grow overflow-y-auto pb-4">
              <special_result_panel_1.default {...passedLogParams}/>
            </div>
          </panel_wrap_1.default>
        </div>
      </div>);
    }
    if (isShowSingleRun) {
        const form = getCustomRunForm({
            nodeId: id,
            flowId: configsMap?.flowId || '',
            flowType: configsMap?.flowType || common_1.FlowType.appFlow,
            payload: data,
            setRunResult,
            setIsRunAfterSingleRun,
            isPaused,
            isRunAfterSingleRun,
            onSuccess: handleAfterCustomSingleRun,
            onCancel: hideSingleRun,
            appendNodeInspectVars,
        });
        return (<div className={(0, classnames_1.cn)('relative mr-1  h-full')}>
        <div ref={containerRef} className={(0, classnames_1.cn)('flex h-full flex-col rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg', showSingleRunPanel ? 'overflow-hidden' : 'overflow-y-auto')} style={{
                width: `${nodePanelWidth}px`,
            }}>
          {(0, utils_1.isSupportCustomRunForm)(data.type)
                ? (form)
                : (<before_run_form_2.default nodeName={data.title} nodeType={data.type} onHide={hideSingleRun} onRun={handleRunWithParams} {...singleRunParams} {...passedLogParams} existVarValuesInForms={getExistVarValuesInForms(singleRunParams?.forms)} filteredExistVarForms={getFilteredExistVarForms(singleRunParams?.forms)}/>)}

        </div>
      </div>);
    }
    return (<div className={(0, classnames_1.cn)('relative mr-1 h-full', showMessageLogModal && 'absolute z-0 mr-2 w-[400px] overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border shadow-lg transition-all')} style={{
            right: !showMessageLogModal ? '0' : `${otherPanelWidth}px`,
        }}>
      <div ref={triggerRef} className="absolute -left-1 top-0 flex h-full w-1 cursor-col-resize resize-x items-center justify-center">
        <div className="h-10 w-0.5 rounded-sm bg-state-base-handle hover:h-full hover:bg-state-accent-solid active:h-full active:bg-state-accent-solid"></div>
      </div>
      <div ref={containerRef} className={(0, classnames_1.cn)('flex h-full flex-col rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg transition-[width] ease-linear', showSingleRunPanel ? 'overflow-hidden' : 'overflow-y-auto')} style={{
            width: `${nodePanelWidth}px`,
        }}>
        <div className="sticky top-0 z-10 shrink-0 border-b-[0.5px] border-divider-regular bg-components-panel-bg">
          <div className="flex items-center px-4 pb-1 pt-4">
            <block_icon_1.default className="mr-1 shrink-0" type={data.type} toolIcon={toolIcon} size="md"/>
            <title_description_input_1.TitleInput value={data.title || ''} onBlur={handleTitleBlur}/>
            <div className="flex shrink-0 items-center text-text-tertiary">
              {isSupportSingleRun && !nodesReadOnly && (<tooltip_1.default popupContent={t('panel.runThisStep', { ns: 'workflow' })} popupClassName="mr-1" disabled={isSingleRunning}>
                    <div className="mr-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-state-base-hover" onClick={() => {
                if (isSingleRunning)
                    handleStop();
                else
                    handleSingleRun();
            }}>
                      {isSingleRunning
                ? <mediaAndDevices_1.Stop className="h-4 w-4 text-text-tertiary"/>
                : <react_1.RiPlayLargeLine className="h-4 w-4 text-text-tertiary"/>}
                    </div>
                  </tooltip_1.default>)}
              <help_link_1.default nodeType={data.type}/>
              <panel_operator_1.default id={id} data={data} showHelpLink={false}/>
              <div className="mx-3 h-3.5 w-[1px] bg-divider-regular"/>
              <div className="flex h-6 w-6 cursor-pointer items-center justify-center" onClick={() => handleNodeSelect(id, true)}>
                <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
              </div>
            </div>
          </div>
          <div className="p-2">
            <title_description_input_1.DescriptionInput value={data.desc || ''} onChange={handleDescriptionChange}/>
          </div>
          {needsToolAuth && (<plugin_auth_1.PluginAuth className="px-4 pb-2" pluginPayload={{
                provider: currToolCollection?.name || '',
                providerType: currToolCollection?.type || '',
                category: plugin_auth_1.AuthCategory.tool,
                detail: currToolCollection,
            }}>
                <div className="flex items-center justify-between pl-4 pr-3">
                  <tab_1.default value={tabType} onChange={setTabType}/>
                  <plugin_auth_1.AuthorizedInNode pluginPayload={{
                provider: currToolCollection?.name || '',
                providerType: currToolCollection?.type || '',
                category: plugin_auth_1.AuthCategory.tool,
                detail: currToolCollection,
            }} onAuthorizationItemClick={handleAuthorizationItemClick} credentialId={data.credential_id}/>
                </div>
              </plugin_auth_1.PluginAuth>)}
          {!!currentDataSource && (<plugin_auth_1.PluginAuthInDataSourceNode onJumpToDataSourcePage={handleJumpToDataSourcePage} isAuthorized={currentDataSource.is_authorized}>
                <div className="flex items-center justify-between pl-4 pr-3">
                  <tab_1.default value={tabType} onChange={setTabType}/>
                  <plugin_auth_1.AuthorizedInDataSourceNode onJumpToDataSourcePage={handleJumpToDataSourcePage} authorizationsNum={3}/>
                </div>
              </plugin_auth_1.PluginAuthInDataSourceNode>)}
          {currentTriggerPlugin && (<trigger_subscription_1.TriggerSubscription subscriptionIdSelected={data.subscription_id} onSubscriptionChange={handleSubscriptionChange}>
                <tab_1.default value={tabType} onChange={setTabType}/>
              </trigger_subscription_1.TriggerSubscription>)}
          {!needsToolAuth && !currentDataSource && !currentTriggerPlugin && (<div className="flex items-center justify-between pl-4 pr-3">
                <tab_1.default value={tabType} onChange={setTabType}/>
              </div>)}
          <split_1.default />
        </div>
        {tabType === tab_1.TabType.settings && (<div className="flex flex-1 flex-col overflow-y-auto">
            <div>
              {(0, react_2.cloneElement)(children, {
                id,
                data,
                panelProps: {
                    getInputVars,
                    toVarInputs,
                    runInputData,
                    setRunInputData,
                    runResult,
                    runInputDataRef,
                },
            })}
            </div>
            <split_1.default />
            {(0, utils_1.hasRetryNode)(data.type) && (<retry_on_panel_1.default id={id} data={data}/>)}
            {(0, utils_1.hasErrorHandleNode)(data.type) && (<error_handle_on_panel_1.default id={id} data={data}/>)}
            {!!availableNextBlocks.length && (<div className="border-t-[0.5px] border-divider-regular p-4">
                  <div className="system-sm-semibold-uppercase mb-1 flex items-center text-text-secondary">
                    {t('panel.nextStep', { ns: 'workflow' }).toLocaleUpperCase()}
                  </div>
                  <div className="system-xs-regular mb-2 text-text-tertiary">
                    {t('panel.addNextStep', { ns: 'workflow' })}
                  </div>
                  <next_step_1.default selectedNode={selectedNode}/>
                </div>)}
            {readmeEntranceComponent}
          </div>)}

        {tabType === tab_1.TabType.lastRun && (<last_run_1.default appId={appDetail?.id || ''} nodeId={id} canSingleRun={isSupportSingleRun} runningStatus={runningStatus} isRunAfterSingleRun={isRunAfterSingleRun} updateNodeRunningStatus={updateNodeRunningStatus} onSingleRunClicked={handleSingleRun} nodeInfo={nodeInfo} singleRunResult={runResult} isPaused={isPaused} {...passedLogParams}/>)}

      </div>
    </div>);
};
exports.default = (0, react_2.memo)(BasePanel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSw0Q0FHeUI7QUFDekIsOENBQTRDO0FBQzVDLCtCQUE4QjtBQUM5QixpQ0FRYztBQUNkLGlEQUE4QztBQUM5QyxtREFBa0Q7QUFDbEQsc0RBQW9FO0FBQ3BFLGlHQUFrRjtBQUNsRiwyREFBbUQ7QUFDbkQsaUZBQXVGO0FBQ3ZGLDZGQUErRjtBQUMvRixzRUFNNkM7QUFDN0MsOEVBQW1GO0FBQ25GLDZFQUErRTtBQUMvRSxxRUFBNEQ7QUFDNUQsMkRBU3dDO0FBQ3hDLHVFQUFxRTtBQUNyRSxpR0FBc0Y7QUFDdEYsa0ZBQTBFO0FBQzFFLGlHQUFpRztBQUNqRyw2RUFBNEY7QUFDNUYsK0RBQTZEO0FBQzdELDZGQUFtRjtBQUNuRiwyREFBMEQ7QUFDMUQsMkRBQThFO0FBQzlFLDJEQUt3QztBQUN4QywyREFBeUQ7QUFDekQsbURBQXdEO0FBQ3hELHlEQUE2RDtBQUM3RCwyQ0FBeUM7QUFDekMsbUNBQXFDO0FBQ3JDLG1EQUF1QztBQUN2QyxtRUFBNkQ7QUFDN0Qsd0RBQThDO0FBQzlDLDhEQUFxRDtBQUNyRCxpRkFBc0U7QUFDdEUsNENBQW1DO0FBQ25DLDRDQUFtQztBQUNuQyxzREFBNkM7QUFDN0MsNERBQWtEO0FBQ2xELHdFQUF5RTtBQUN6RSx5Q0FBZ0M7QUFDaEMsMERBQWdEO0FBQ2hELCtCQUFvQztBQUNwQyxpRUFBNEQ7QUFFNUQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE1BQTBCLEVBQXFCLEVBQUU7SUFDekUsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUE7SUFDcEMsUUFBUSxRQUFRLEVBQUUsQ0FBQztRQUNqQixLQUFLLGlCQUFTLENBQUMsVUFBVTtZQUN2QixPQUFPLENBQUMseUJBQXVCLENBQUMsSUFBSSxNQUFNLENBQUMsRUFBRyxDQUFBO1FBQ2hEO1lBQ0UsT0FBTyxDQUNM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LENBQUMsdUJBQXVCLENBQUMsQ0FDakQsa0JBQWtCLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FDcEMsUUFBUSxDQUFDLENBQUMsUUFBUyxDQUFDLENBQ3BCLGVBQWUsQ0FBQyxDQUFDLFNBQVUsQ0FBQyxDQUM1QixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDbkIsSUFBSSxlQUFlLENBQUMsRUFDcEIsQ0FDSCxDQUVIOztNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsSUFBQSxZQUFJLEVBQUMsU0FBUyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZDLCBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgU2ltcGxlU3Vic2NyaXB0aW9uIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3BsdWdpbi1kZXRhaWwtcGFuZWwvc3Vic2NyaXB0aW9uLWxpc3QnXG5pbXBvcnQgdHlwZSB7IEN1c3RvbVJ1bkZvcm1Qcm9wcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvZGF0YS1zb3VyY2UvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE5vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHtcbiAgUmlDbG9zZUxpbmUsXG4gIFJpUGxheUxhcmdlTGluZSxcbn0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSAnZXMtdG9vbGtpdC9jb21wYXQnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIGNsb25lRWxlbWVudCxcbiAgbWVtbyxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VTaGFsbG93IH0gZnJvbSAnenVzdGFuZC9yZWFjdC9zaGFsbG93J1xuaW1wb3J0IHsgdXNlU3RvcmUgYXMgdXNlQXBwU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9zdG9yZSdcbmltcG9ydCB7IFN0b3AgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9saW5lL21lZGlhQW5kRGV2aWNlcydcbmltcG9ydCBUb29sdGlwIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b29sdGlwJ1xuaW1wb3J0IHsgQUNDT1VOVF9TRVRUSU5HX1RBQiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9jb25zdGFudHMnXG5pbXBvcnQgeyB1c2VMYW5ndWFnZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJ1xuaW1wb3J0IHtcbiAgQXV0aENhdGVnb3J5LFxuICBBdXRob3JpemVkSW5EYXRhU291cmNlTm9kZSxcbiAgQXV0aG9yaXplZEluTm9kZSxcbiAgUGx1Z2luQXV0aCxcbiAgUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGUsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9wbHVnaW4tYXV0aCdcbmltcG9ydCB7IHVzZVBsdWdpblN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3BsdWdpbi1kZXRhaWwtcGFuZWwvc3RvcmUnXG5pbXBvcnQgeyBSZWFkbWVFbnRyYW5jZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9yZWFkbWUtcGFuZWwvZW50cmFuY2UnXG5pbXBvcnQgQmxvY2tJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2staWNvbidcbmltcG9ydCB7XG4gIHVzZUF2YWlsYWJsZUJsb2NrcyxcbiAgdXNlTm9kZURhdGFVcGRhdGUsXG4gIHVzZU5vZGVzSW50ZXJhY3Rpb25zLFxuICB1c2VOb2Rlc01ldGFEYXRhLFxuICB1c2VOb2Rlc1JlYWRPbmx5LFxuICB1c2VUb29sSWNvbixcbiAgdXNlV29ya2Zsb3dIaXN0b3J5LFxuICBXb3JrZmxvd0hpc3RvcnlFdmVudCxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcbmltcG9ydCB7IHVzZUhvb2tzU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzLXN0b3JlJ1xuaW1wb3J0IHVzZUluc3BlY3RWYXJzQ3J1ZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1pbnNwZWN0LXZhcnMtY3J1ZCdcbmltcG9ydCBTcGxpdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL19iYXNlL2NvbXBvbmVudHMvc3BsaXQnXG5pbXBvcnQgRGF0YVNvdXJjZUJlZm9yZVJ1bkZvcm0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9kYXRhLXNvdXJjZS9iZWZvcmUtcnVuLWZvcm0nXG5pbXBvcnQgeyBEYXRhU291cmNlQ2xhc3NpZmljYXRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2RhdGEtc291cmNlL3R5cGVzJ1xuaW1wb3J0IHsgdXNlTG9ncyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcnVuL2hvb2tzJ1xuaW1wb3J0IFNwZWNpYWxSZXN1bHRQYW5lbCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3J1bi9zcGVjaWFsLXJlc3VsdC1wYW5lbCdcbmltcG9ydCB7IHVzZVN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7IEJsb2NrRW51bSwgTm9kZVJ1bm5pbmdTdGF0dXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHtcbiAgY2FuUnVuQnlTaW5nbGUsXG4gIGhhc0Vycm9ySGFuZGxlTm9kZSxcbiAgaGFzUmV0cnlOb2RlLFxuICBpc1N1cHBvcnRDdXN0b21SdW5Gb3JtLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuaW1wb3J0IHsgdXNlTW9kYWxDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VBbGxCdWlsdEluVG9vbHMgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXRvb2xzJ1xuaW1wb3J0IHsgdXNlQWxsVHJpZ2dlclBsdWdpbnMgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXRyaWdnZXJzJ1xuaW1wb3J0IHsgRmxvd1R5cGUgfSBmcm9tICdAL3R5cGVzL2NvbW1vbidcbmltcG9ydCB7IGNhbkZpbmRUb29sIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgdXNlUmVzaXplUGFuZWwgfSBmcm9tICcuLi8uLi9ob29rcy91c2UtcmVzaXplLXBhbmVsJ1xuaW1wb3J0IEJlZm9yZVJ1bkZvcm0gZnJvbSAnLi4vYmVmb3JlLXJ1bi1mb3JtJ1xuaW1wb3J0IFBhbmVsV3JhcCBmcm9tICcuLi9iZWZvcmUtcnVuLWZvcm0vcGFuZWwtd3JhcCdcbmltcG9ydCBFcnJvckhhbmRsZU9uUGFuZWwgZnJvbSAnLi4vZXJyb3ItaGFuZGxlL2Vycm9yLWhhbmRsZS1vbi1wYW5lbCdcbmltcG9ydCBIZWxwTGluayBmcm9tICcuLi9oZWxwLWxpbmsnXG5pbXBvcnQgTmV4dFN0ZXAgZnJvbSAnLi4vbmV4dC1zdGVwJ1xuaW1wb3J0IFBhbmVsT3BlcmF0b3IgZnJvbSAnLi4vcGFuZWwtb3BlcmF0b3InXG5pbXBvcnQgUmV0cnlPblBhbmVsIGZyb20gJy4uL3JldHJ5L3JldHJ5LW9uLXBhbmVsJ1xuaW1wb3J0IHsgRGVzY3JpcHRpb25JbnB1dCwgVGl0bGVJbnB1dCB9IGZyb20gJy4uL3RpdGxlLWRlc2NyaXB0aW9uLWlucHV0J1xuaW1wb3J0IExhc3RSdW4gZnJvbSAnLi9sYXN0LXJ1bidcbmltcG9ydCB1c2VMYXN0UnVuIGZyb20gJy4vbGFzdC1ydW4vdXNlLWxhc3QtcnVuJ1xuaW1wb3J0IFRhYiwgeyBUYWJUeXBlIH0gZnJvbSAnLi90YWInXG5pbXBvcnQgeyBUcmlnZ2VyU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi90cmlnZ2VyLXN1YnNjcmlwdGlvbidcblxuY29uc3QgZ2V0Q3VzdG9tUnVuRm9ybSA9IChwYXJhbXM6IEN1c3RvbVJ1bkZvcm1Qcm9wcyk6IFJlYWN0LkpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3Qgbm9kZVR5cGUgPSBwYXJhbXMucGF5bG9hZC50eXBlXG4gIHN3aXRjaCAobm9kZVR5cGUpIHtcbiAgICBjYXNlIEJsb2NrRW51bS5EYXRhU291cmNlOlxuICAgICAgcmV0dXJuIDxEYXRhU291cmNlQmVmb3JlUnVuRm9ybSB7Li4ucGFyYW1zfSAvPlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIEN1c3RvbSBSdW4gRm9ybTpcbiAgICAgICAgICB7bm9kZVR5cGV9XG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICBub3QgZm91bmRcbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gIH1cbn1cblxudHlwZSBCYXNlUGFuZWxQcm9wcyA9IHtcbiAgY2hpbGRyZW46IFJlYWN0Tm9kZVxuICBpZDogTm9kZVsnaWQnXVxuICBkYXRhOiBOb2RlWydkYXRhJ11cbn1cblxuY29uc3QgQmFzZVBhbmVsOiBGQzxCYXNlUGFuZWxQcm9wcz4gPSAoe1xuICBpZCxcbiAgZGF0YSxcbiAgY2hpbGRyZW4sXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBsYW5ndWFnZSA9IHVzZUxhbmd1YWdlKClcbiAgY29uc3QgeyBzaG93TWVzc2FnZUxvZ01vZGFsIH0gPSB1c2VBcHBTdG9yZSh1c2VTaGFsbG93KHN0YXRlID0+ICh7XG4gICAgc2hvd01lc3NhZ2VMb2dNb2RhbDogc3RhdGUuc2hvd01lc3NhZ2VMb2dNb2RhbCxcbiAgfSkpKVxuICBjb25zdCBpc1NpbmdsZVJ1bm5pbmcgPSBkYXRhLl9zaW5nbGVSdW5uaW5nU3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5SdW5uaW5nXG5cbiAgY29uc3Qgc2hvd1NpbmdsZVJ1blBhbmVsID0gdXNlU3RvcmUocyA9PiBzLnNob3dTaW5nbGVSdW5QYW5lbClcbiAgY29uc3Qgd29ya2Zsb3dDYW52YXNXaWR0aCA9IHVzZVN0b3JlKHMgPT4gcy53b3JrZmxvd0NhbnZhc1dpZHRoKVxuICBjb25zdCBub2RlUGFuZWxXaWR0aCA9IHVzZVN0b3JlKHMgPT4gcy5ub2RlUGFuZWxXaWR0aClcbiAgY29uc3Qgb3RoZXJQYW5lbFdpZHRoID0gdXNlU3RvcmUocyA9PiBzLm90aGVyUGFuZWxXaWR0aClcbiAgY29uc3Qgc2V0Tm9kZVBhbmVsV2lkdGggPSB1c2VTdG9yZShzID0+IHMuc2V0Tm9kZVBhbmVsV2lkdGgpXG4gIGNvbnN0IHBlbmRpbmdTaW5nbGVSdW4gPSB1c2VTdG9yZShzID0+IHMucGVuZGluZ1NpbmdsZVJ1bilcbiAgY29uc3Qgc2V0UGVuZGluZ1NpbmdsZVJ1biA9IHVzZVN0b3JlKHMgPT4gcy5zZXRQZW5kaW5nU2luZ2xlUnVuKVxuXG4gIGNvbnN0IHJlc2VydmVkQ2FudmFzV2lkdGggPSA0MDAgLy8gUmVzZXJ2ZSB0aGUgbWluaW11bSB2aXNpYmxlIHdpZHRoIGZvciB0aGUgY2FudmFzXG5cbiAgY29uc3QgbWF4Tm9kZVBhbmVsV2lkdGggPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXdvcmtmbG93Q2FudmFzV2lkdGgpXG4gICAgICByZXR1cm4gNzIwXG5cbiAgICBjb25zdCBhdmFpbGFibGUgPSB3b3JrZmxvd0NhbnZhc1dpZHRoIC0gKG90aGVyUGFuZWxXaWR0aCB8fCAwKSAtIHJlc2VydmVkQ2FudmFzV2lkdGhcbiAgICByZXR1cm4gTWF0aC5tYXgoYXZhaWxhYmxlLCA0MDApXG4gIH0sIFt3b3JrZmxvd0NhbnZhc1dpZHRoLCBvdGhlclBhbmVsV2lkdGhdKVxuXG4gIGNvbnN0IHVwZGF0ZU5vZGVQYW5lbFdpZHRoID0gdXNlQ2FsbGJhY2soKHdpZHRoOiBudW1iZXIsIHNvdXJjZTogJ3VzZXInIHwgJ3N5c3RlbScgPSAndXNlcicpID0+IHtcbiAgICAvLyBFbnN1cmUgdGhlIHdpZHRoIGlzIHdpdGhpbiB0aGUgbWluIGFuZCBtYXggcmFuZ2VcbiAgICBjb25zdCBuZXdWYWx1ZSA9IE1hdGgubWF4KDQwMCwgTWF0aC5taW4od2lkdGgsIG1heE5vZGVQYW5lbFdpZHRoKSlcblxuICAgIGlmIChzb3VyY2UgPT09ICd1c2VyJylcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3b3JrZmxvdy1ub2RlLXBhbmVsLXdpZHRoJywgYCR7bmV3VmFsdWV9YClcblxuICAgIHNldE5vZGVQYW5lbFdpZHRoKG5ld1ZhbHVlKVxuICB9LCBbbWF4Tm9kZVBhbmVsV2lkdGgsIHNldE5vZGVQYW5lbFdpZHRoXSlcblxuICBjb25zdCBoYW5kbGVSZXNpemUgPSB1c2VDYWxsYmFjaygod2lkdGg6IG51bWJlcikgPT4ge1xuICAgIHVwZGF0ZU5vZGVQYW5lbFdpZHRoKHdpZHRoLCAndXNlcicpXG4gIH0sIFt1cGRhdGVOb2RlUGFuZWxXaWR0aF0pXG5cbiAgY29uc3Qge1xuICAgIHRyaWdnZXJSZWYsXG4gICAgY29udGFpbmVyUmVmLFxuICB9ID0gdXNlUmVzaXplUGFuZWwoe1xuICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICAgIHRyaWdnZXJEaXJlY3Rpb246ICdsZWZ0JyxcbiAgICBtaW5XaWR0aDogNDAwLFxuICAgIG1heFdpZHRoOiBtYXhOb2RlUGFuZWxXaWR0aCxcbiAgICBvblJlc2l6ZTogZGVib3VuY2UoaGFuZGxlUmVzaXplKSxcbiAgfSlcblxuICBjb25zdCBkZWJvdW5jZVVwZGF0ZSA9IGRlYm91bmNlKCh3aWR0aDogbnVtYmVyKSA9PiB7XG4gICAgdXBkYXRlTm9kZVBhbmVsV2lkdGgod2lkdGgsICdzeXN0ZW0nKVxuICB9KVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCF3b3JrZmxvd0NhbnZhc1dpZHRoKVxuICAgICAgcmV0dXJuXG5cbiAgICAvLyBJZiB0aGUgdG90YWwgd2lkdGggb2YgdGhlIHRocmVlIGV4Y2VlZHMgdGhlIGNhbnZhcywgc2hyaW5rIHRoZSBub2RlIHBhbmVsIHRvIHRoZSBhdmFpbGFibGUgcmFuZ2UgKGF0IGxlYXN0IDQwMHB4KVxuICAgIGNvbnN0IHRvdGFsID0gbm9kZVBhbmVsV2lkdGggKyBvdGhlclBhbmVsV2lkdGggKyByZXNlcnZlZENhbnZhc1dpZHRoXG4gICAgaWYgKHRvdGFsID4gd29ya2Zsb3dDYW52YXNXaWR0aCkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gTWF0aC5tYXgod29ya2Zsb3dDYW52YXNXaWR0aCAtIG90aGVyUGFuZWxXaWR0aCAtIHJlc2VydmVkQ2FudmFzV2lkdGgsIDQwMClcbiAgICAgIGRlYm91bmNlVXBkYXRlKHRhcmdldClcbiAgICB9XG4gIH0sIFtub2RlUGFuZWxXaWR0aCwgb3RoZXJQYW5lbFdpZHRoLCB3b3JrZmxvd0NhbnZhc1dpZHRoLCBkZWJvdW5jZVVwZGF0ZV0pXG5cbiAgY29uc3QgeyBoYW5kbGVOb2RlU2VsZWN0IH0gPSB1c2VOb2Rlc0ludGVyYWN0aW9ucygpXG4gIGNvbnN0IHsgbm9kZXNSZWFkT25seSB9ID0gdXNlTm9kZXNSZWFkT25seSgpXG4gIGNvbnN0IHsgYXZhaWxhYmxlTmV4dEJsb2NrcyB9ID0gdXNlQXZhaWxhYmxlQmxvY2tzKGRhdGEudHlwZSwgZGF0YS5pc0luSXRlcmF0aW9uIHx8IGRhdGEuaXNJbkxvb3ApXG4gIGNvbnN0IHRvb2xJY29uID0gdXNlVG9vbEljb24oZGF0YSlcblxuICBjb25zdCB7IHNhdmVTdGF0ZVRvSGlzdG9yeSB9ID0gdXNlV29ya2Zsb3dIaXN0b3J5KClcblxuICBjb25zdCB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUsXG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0LFxuICB9ID0gdXNlTm9kZURhdGFVcGRhdGUoKVxuXG4gIGNvbnN0IGhhbmRsZVRpdGxlQmx1ciA9IHVzZUNhbGxiYWNrKCh0aXRsZTogc3RyaW5nKSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0KHsgaWQsIGRhdGE6IHsgdGl0bGUgfSB9KVxuICAgIHNhdmVTdGF0ZVRvSGlzdG9yeShXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlVGl0bGVDaGFuZ2UsIHsgbm9kZUlkOiBpZCB9KVxuICB9LCBbaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0LCBpZCwgc2F2ZVN0YXRlVG9IaXN0b3J5XSlcbiAgY29uc3QgaGFuZGxlRGVzY3JpcHRpb25DaGFuZ2UgPSB1c2VDYWxsYmFjaygoZGVzYzogc3RyaW5nKSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0KHsgaWQsIGRhdGE6IHsgZGVzYyB9IH0pXG4gICAgc2F2ZVN0YXRlVG9IaXN0b3J5KFdvcmtmbG93SGlzdG9yeUV2ZW50Lk5vZGVEZXNjcmlwdGlvbkNoYW5nZSwgeyBub2RlSWQ6IGlkIH0pXG4gIH0sIFtoYW5kbGVOb2RlRGF0YVVwZGF0ZVdpdGhTeW5jRHJhZnQsIGlkLCBzYXZlU3RhdGVUb0hpc3RvcnldKVxuXG4gIGNvbnN0IGlzQ2hpbGROb2RlID0gISEoZGF0YS5pc0luSXRlcmF0aW9uIHx8IGRhdGEuaXNJbkxvb3ApXG4gIGNvbnN0IGlzU3VwcG9ydFNpbmdsZVJ1biA9IGNhblJ1bkJ5U2luZ2xlKGRhdGEudHlwZSwgaXNDaGlsZE5vZGUpXG4gIGNvbnN0IGFwcERldGFpbCA9IHVzZUFwcFN0b3JlKHN0YXRlID0+IHN0YXRlLmFwcERldGFpbClcblxuICBjb25zdCBoYXNDbGlja1J1bm5pbmcgPSB1c2VSZWYoZmFsc2UpXG4gIGNvbnN0IFtpc1BhdXNlZCwgc2V0SXNQYXVzZWRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoZGF0YS5fc2luZ2xlUnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZykge1xuICAgICAgaGFzQ2xpY2tSdW5uaW5nLmN1cnJlbnQgPSB0cnVlXG4gICAgICBzZXRJc1BhdXNlZChmYWxzZSlcbiAgICB9XG4gICAgZWxzZSBpZiAoZGF0YS5faXNTaW5nbGVSdW4gJiYgZGF0YS5fc2luZ2xlUnVubmluZ1N0YXR1cyA9PT0gdW5kZWZpbmVkICYmIGhhc0NsaWNrUnVubmluZykge1xuICAgICAgc2V0SXNQYXVzZWQodHJ1ZSlcbiAgICAgIGhhc0NsaWNrUnVubmluZy5jdXJyZW50ID0gZmFsc2VcbiAgICB9XG4gIH0sIFtkYXRhXSlcblxuICBjb25zdCB1cGRhdGVOb2RlUnVubmluZ1N0YXR1cyA9IHVzZUNhbGxiYWNrKChzdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzKSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgaWQsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIF9zaW5nbGVSdW5uaW5nU3RhdHVzOiBzdGF0dXMsXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtoYW5kbGVOb2RlRGF0YVVwZGF0ZSwgaWQsIGRhdGFdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaGFzQ2xpY2tSdW5uaW5nLmN1cnJlbnQgPSBmYWxzZVxuICB9LCBbaWRdKVxuXG4gIGNvbnN0IHtcbiAgICBub2Rlc01hcCxcbiAgfSA9IHVzZU5vZGVzTWV0YURhdGEoKVxuXG4gIGNvbnN0IGNvbmZpZ3NNYXAgPSB1c2VIb29rc1N0b3JlKHMgPT4gcy5jb25maWdzTWFwKVxuICBjb25zdCB7XG4gICAgaXNTaG93U2luZ2xlUnVuLFxuICAgIGhpZGVTaW5nbGVSdW4sXG4gICAgcnVubmluZ1N0YXR1cyxcbiAgICBydW5JbnB1dERhdGEsXG4gICAgcnVuSW5wdXREYXRhUmVmLFxuICAgIHJ1blJlc3VsdCxcbiAgICBzZXRSdW5SZXN1bHQsXG4gICAgZ2V0SW5wdXRWYXJzLFxuICAgIHRvVmFySW5wdXRzLFxuICAgIHRhYlR5cGUsXG4gICAgaXNSdW5BZnRlclNpbmdsZVJ1bixcbiAgICBzZXRJc1J1bkFmdGVyU2luZ2xlUnVuLFxuICAgIHNldFRhYlR5cGUsXG4gICAgaGFuZGxlQWZ0ZXJDdXN0b21TaW5nbGVSdW4sXG4gICAgc2luZ2xlUnVuUGFyYW1zLFxuICAgIG5vZGVJbmZvLFxuICAgIHNldFJ1bklucHV0RGF0YSxcbiAgICBoYW5kbGVTdG9wLFxuICAgIGhhbmRsZVNpbmdsZVJ1bixcbiAgICBoYW5kbGVSdW5XaXRoUGFyYW1zLFxuICAgIGdldEV4aXN0VmFyVmFsdWVzSW5Gb3JtcyxcbiAgICBnZXRGaWx0ZXJlZEV4aXN0VmFyRm9ybXMsXG4gIH0gPSB1c2VMYXN0UnVuPHR5cGVvZiBkYXRhPih7XG4gICAgaWQsXG4gICAgZmxvd0lkOiBjb25maWdzTWFwPy5mbG93SWQgfHwgJycsXG4gICAgZmxvd1R5cGU6IGNvbmZpZ3NNYXA/LmZsb3dUeXBlIHx8IEZsb3dUeXBlLmFwcEZsb3csXG4gICAgZGF0YSxcbiAgICBkZWZhdWx0UnVuSW5wdXREYXRhOiBub2Rlc01hcD8uW2RhdGEudHlwZV0/LmRlZmF1bHRSdW5JbnB1dERhdGEgfHwge30sXG4gICAgaXNQYXVzZWQsXG4gIH0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRJc1BhdXNlZChmYWxzZSlcbiAgfSwgW3RhYlR5cGVdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFwZW5kaW5nU2luZ2xlUnVuIHx8IHBlbmRpbmdTaW5nbGVSdW4ubm9kZUlkICE9PSBpZClcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKHBlbmRpbmdTaW5nbGVSdW4uYWN0aW9uID09PSAncnVuJylcbiAgICAgIGhhbmRsZVNpbmdsZVJ1bigpXG4gICAgZWxzZVxuICAgICAgaGFuZGxlU3RvcCgpXG5cbiAgICBzZXRQZW5kaW5nU2luZ2xlUnVuKHVuZGVmaW5lZClcbiAgfSwgW3BlbmRpbmdTaW5nbGVSdW4sIGlkLCBoYW5kbGVTaW5nbGVSdW4sIGhhbmRsZVN0b3AsIHNldFBlbmRpbmdTaW5nbGVSdW5dKVxuXG4gIGNvbnN0IGxvZ1BhcmFtcyA9IHVzZUxvZ3MoKVxuICBjb25zdCBwYXNzZWRMb2dQYXJhbXMgPSB1c2VNZW1vKCgpID0+IFtCbG9ja0VudW0uVG9vbCwgQmxvY2tFbnVtLkFnZW50LCBCbG9ja0VudW0uSXRlcmF0aW9uLCBCbG9ja0VudW0uTG9vcF0uaW5jbHVkZXMoZGF0YS50eXBlKSA/IGxvZ1BhcmFtcyA6IHt9LCBbZGF0YS50eXBlLCBsb2dQYXJhbXNdKVxuXG4gIGNvbnN0IHN0b3JlQnVpbGRJblRvb2xzID0gdXNlU3RvcmUocyA9PiBzLmJ1aWxkSW5Ub29scylcbiAgY29uc3QgeyBkYXRhOiBidWlsZEluVG9vbHMgfSA9IHVzZUFsbEJ1aWx0SW5Ub29scygpXG4gIGNvbnN0IGN1cnJUb29sQ29sbGVjdGlvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBidWlsZEluVG9vbHMgPz8gc3RvcmVCdWlsZEluVG9vbHNcbiAgICByZXR1cm4gY2FuZGlkYXRlcz8uZmluZChpdGVtID0+IGNhbkZpbmRUb29sKGl0ZW0uaWQsIGRhdGEucHJvdmlkZXJfaWQpKVxuICB9LCBbYnVpbGRJblRvb2xzLCBzdG9yZUJ1aWxkSW5Ub29scywgZGF0YS5wcm92aWRlcl9pZF0pXG4gIGNvbnN0IG5lZWRzVG9vbEF1dGggPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gZGF0YS50eXBlID09PSBCbG9ja0VudW0uVG9vbCAmJiBjdXJyVG9vbENvbGxlY3Rpb24/LmFsbG93X2RlbGV0ZVxuICB9LCBbZGF0YS50eXBlLCBjdXJyVG9vbENvbGxlY3Rpb24/LmFsbG93X2RlbGV0ZV0pXG5cbiAgLy8gb25seSBmZXRjaCB0cmlnZ2VyIHBsdWdpbnMgd2hlbiB0aGUgbm9kZSBpcyBhIHRyaWdnZXIgcGx1Z2luXG4gIGNvbnN0IHsgZGF0YTogdHJpZ2dlclBsdWdpbnMgPSBbXSB9ID0gdXNlQWxsVHJpZ2dlclBsdWdpbnMoZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbilcbiAgY29uc3QgY3VycmVudFRyaWdnZXJQbHVnaW4gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoZGF0YS50eXBlICE9PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbiB8fCAhZGF0YS5wbHVnaW5faWQgfHwgIXRyaWdnZXJQbHVnaW5zPy5sZW5ndGgpXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRyaWdnZXJQbHVnaW5zPy5maW5kKHAgPT4gcC5wbHVnaW5faWQgPT09IGRhdGEucGx1Z2luX2lkKVxuICB9LCBbZGF0YS50eXBlLCBkYXRhLnBsdWdpbl9pZCwgdHJpZ2dlclBsdWdpbnNdKVxuICBjb25zdCB7IHNldERldGFpbCB9ID0gdXNlUGx1Z2luU3RvcmUoKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGN1cnJlbnRUcmlnZ2VyUGx1Z2luKSB7XG4gICAgICBzZXREZXRhaWwoe1xuICAgICAgICBuYW1lOiBjdXJyZW50VHJpZ2dlclBsdWdpbi5sYWJlbFtsYW5ndWFnZV0sXG4gICAgICAgIHBsdWdpbl9pZDogY3VycmVudFRyaWdnZXJQbHVnaW4ucGx1Z2luX2lkIHx8ICcnLFxuICAgICAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6IGN1cnJlbnRUcmlnZ2VyUGx1Z2luLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllciB8fCAnJyxcbiAgICAgICAgaWQ6IGN1cnJlbnRUcmlnZ2VyUGx1Z2luLmlkLFxuICAgICAgICBwcm92aWRlcjogY3VycmVudFRyaWdnZXJQbHVnaW4ubmFtZSxcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fc2NoZW1hOiBjdXJyZW50VHJpZ2dlclBsdWdpbi5zdWJzY3JpcHRpb25fc2NoZW1hIHx8IFtdLFxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiBjdXJyZW50VHJpZ2dlclBsdWdpbi5zdWJzY3JpcHRpb25fY29uc3RydWN0b3IsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuICB9LCBbY3VycmVudFRyaWdnZXJQbHVnaW4sIGxhbmd1YWdlLCBzZXREZXRhaWxdKVxuXG4gIGNvbnN0IGRhdGFTb3VyY2VMaXN0ID0gdXNlU3RvcmUocyA9PiBzLmRhdGFTb3VyY2VMaXN0KVxuXG4gIGNvbnN0IGN1cnJlbnREYXRhU291cmNlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UgJiYgZGF0YS5wcm92aWRlcl90eXBlICE9PSBEYXRhU291cmNlQ2xhc3NpZmljYXRpb24ubG9jYWxGaWxlKVxuICAgICAgcmV0dXJuIGRhdGFTb3VyY2VMaXN0Py5maW5kKGl0ZW0gPT4gaXRlbS5wbHVnaW5faWQgPT09IGRhdGEucGx1Z2luX2lkKVxuICB9LCBbZGF0YVNvdXJjZUxpc3QsIGRhdGEucHJvdmlkZXJfaWQsIGRhdGEudHlwZSwgZGF0YS5wcm92aWRlcl90eXBlXSlcblxuICBjb25zdCBoYW5kbGVBdXRob3JpemF0aW9uSXRlbUNsaWNrID0gdXNlQ2FsbGJhY2soKGNyZWRlbnRpYWxfaWQ6IHN0cmluZykgPT4ge1xuICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlV2l0aFN5bmNEcmFmdCh7XG4gICAgICBpZCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgY3JlZGVudGlhbF9pZCxcbiAgICAgIH0sXG4gICAgfSlcbiAgfSwgW2hhbmRsZU5vZGVEYXRhVXBkYXRlV2l0aFN5bmNEcmFmdCwgaWRdKVxuXG4gIGNvbnN0IHsgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwgfSA9IHVzZU1vZGFsQ29udGV4dCgpXG5cbiAgY29uc3QgaGFuZGxlSnVtcFRvRGF0YVNvdXJjZVBhZ2UgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwoeyBwYXlsb2FkOiBBQ0NPVU5UX1NFVFRJTkdfVEFCLkRBVEFfU09VUkNFIH0pXG4gIH0sIFtzZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbF0pXG5cbiAgY29uc3Qge1xuICAgIGFwcGVuZE5vZGVJbnNwZWN0VmFycyxcbiAgfSA9IHVzZUluc3BlY3RWYXJzQ3J1ZCgpXG5cbiAgY29uc3QgaGFuZGxlU3Vic2NyaXB0aW9uQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHY6IFNpbXBsZVN1YnNjcmlwdGlvbiwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0KFxuICAgICAgeyBpZCwgZGF0YTogeyBzdWJzY3JpcHRpb25faWQ6IHYuaWQgfSB9LFxuICAgICAge1xuICAgICAgICBzeW5jOiB0cnVlLFxuICAgICAgICBjYWxsYmFjazogeyBvblNldHRsZWQ6IGNhbGxiYWNrIH0sXG4gICAgICB9LFxuICAgIClcbiAgfSwgW2hhbmRsZU5vZGVEYXRhVXBkYXRlV2l0aFN5bmNEcmFmdCwgaWRdKVxuXG4gIGNvbnN0IHJlYWRtZUVudHJhbmNlQ29tcG9uZW50ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgbGV0IHBsdWdpbkRldGFpbFxuICAgIHN3aXRjaCAoZGF0YS50eXBlKSB7XG4gICAgICBjYXNlIEJsb2NrRW51bS5Ub29sOlxuICAgICAgICBwbHVnaW5EZXRhaWwgPSBjdXJyVG9vbENvbGxlY3Rpb25cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgQmxvY2tFbnVtLkRhdGFTb3VyY2U6XG4gICAgICAgIHBsdWdpbkRldGFpbCA9IGN1cnJlbnREYXRhU291cmNlXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIEJsb2NrRW51bS5UcmlnZ2VyUGx1Z2luOlxuICAgICAgICBwbHVnaW5EZXRhaWwgPSBjdXJyZW50VHJpZ2dlclBsdWdpblxuICAgICAgICBicmVha1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gIXBsdWdpbkRldGFpbCA/IG51bGwgOiA8UmVhZG1lRW50cmFuY2UgcGx1Z2luRGV0YWlsPXtwbHVnaW5EZXRhaWwgYXMgYW55fSBjbGFzc05hbWU9XCJtdC1hdXRvXCIgLz5cbiAgfSwgW2RhdGEudHlwZSwgY3VyclRvb2xDb2xsZWN0aW9uLCBjdXJyZW50RGF0YVNvdXJjZSwgY3VycmVudFRyaWdnZXJQbHVnaW5dKVxuXG4gIGNvbnN0IHNlbGVjdGVkTm9kZSA9IHVzZU1lbW8oKCkgPT4gKHtcbiAgICBpZCxcbiAgICBkYXRhLFxuICB9KSBhcyBOb2RlLCBbaWQsIGRhdGFdKVxuICBpZiAobG9nUGFyYW1zLnNob3dTcGVjaWFsUmVzdWx0UGFuZWwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgICAncmVsYXRpdmUgbXItMSAgaC1mdWxsJyxcbiAgICAgICl9XG4gICAgICA+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9e2NvbnRhaW5lclJlZn1cbiAgICAgICAgICBjbGFzc05hbWU9e2NuKCdmbGV4IGgtZnVsbCBmbGV4LWNvbCByb3VuZGVkLTJ4bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZyBzaGFkb3ctbGcnLCBzaG93U2luZ2xlUnVuUGFuZWwgPyAnb3ZlcmZsb3ctaGlkZGVuJyA6ICdvdmVyZmxvdy15LWF1dG8nKX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgd2lkdGg6IGAke25vZGVQYW5lbFdpZHRofXB4YCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFBhbmVsV3JhcFxuICAgICAgICAgICAgbm9kZU5hbWU9e2RhdGEudGl0bGV9XG4gICAgICAgICAgICBvbkhpZGU9e2hpZGVTaW5nbGVSdW59XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTAgZ3JvdyBvdmVyZmxvdy15LWF1dG8gcGItNFwiPlxuICAgICAgICAgICAgICA8U3BlY2lhbFJlc3VsdFBhbmVsIHsuLi5wYXNzZWRMb2dQYXJhbXN9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1BhbmVsV3JhcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBpZiAoaXNTaG93U2luZ2xlUnVuKSB7XG4gICAgY29uc3QgZm9ybSA9IGdldEN1c3RvbVJ1bkZvcm0oe1xuICAgICAgbm9kZUlkOiBpZCxcbiAgICAgIGZsb3dJZDogY29uZmlnc01hcD8uZmxvd0lkIHx8ICcnLFxuICAgICAgZmxvd1R5cGU6IGNvbmZpZ3NNYXA/LmZsb3dUeXBlIHx8IEZsb3dUeXBlLmFwcEZsb3csXG4gICAgICBwYXlsb2FkOiBkYXRhLFxuICAgICAgc2V0UnVuUmVzdWx0LFxuICAgICAgc2V0SXNSdW5BZnRlclNpbmdsZVJ1bixcbiAgICAgIGlzUGF1c2VkLFxuICAgICAgaXNSdW5BZnRlclNpbmdsZVJ1bixcbiAgICAgIG9uU3VjY2VzczogaGFuZGxlQWZ0ZXJDdXN0b21TaW5nbGVSdW4sXG4gICAgICBvbkNhbmNlbDogaGlkZVNpbmdsZVJ1bixcbiAgICAgIGFwcGVuZE5vZGVJbnNwZWN0VmFycyxcbiAgICB9KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgJ3JlbGF0aXZlIG1yLTEgIGgtZnVsbCcsXG4gICAgICApfVxuICAgICAgPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPXtjb250YWluZXJSZWZ9XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbignZmxleCBoLWZ1bGwgZmxleC1jb2wgcm91bmRlZC0yeGwgYm9yZGVyLVswLjVweF0gYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgc2hhZG93LWxnJywgc2hvd1NpbmdsZVJ1blBhbmVsID8gJ292ZXJmbG93LWhpZGRlbicgOiAnb3ZlcmZsb3cteS1hdXRvJyl9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOiBgJHtub2RlUGFuZWxXaWR0aH1weGAsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpc1N1cHBvcnRDdXN0b21SdW5Gb3JtKGRhdGEudHlwZSlcbiAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgIGZvcm1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiAoXG4gICAgICAgICAgICAgICAgPEJlZm9yZVJ1bkZvcm1cbiAgICAgICAgICAgICAgICAgIG5vZGVOYW1lPXtkYXRhLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgbm9kZVR5cGU9e2RhdGEudHlwZX1cbiAgICAgICAgICAgICAgICAgIG9uSGlkZT17aGlkZVNpbmdsZVJ1bn1cbiAgICAgICAgICAgICAgICAgIG9uUnVuPXtoYW5kbGVSdW5XaXRoUGFyYW1zfVxuICAgICAgICAgICAgICAgICAgey4uLnNpbmdsZVJ1blBhcmFtcyF9XG4gICAgICAgICAgICAgICAgICB7Li4ucGFzc2VkTG9nUGFyYW1zfVxuICAgICAgICAgICAgICAgICAgZXhpc3RWYXJWYWx1ZXNJbkZvcm1zPXtnZXRFeGlzdFZhclZhbHVlc0luRm9ybXMoc2luZ2xlUnVuUGFyYW1zPy5mb3JtcyBhcyBhbnkpfVxuICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFeGlzdFZhckZvcm1zPXtnZXRGaWx0ZXJlZEV4aXN0VmFyRm9ybXMoc2luZ2xlUnVuUGFyYW1zPy5mb3JtcyBhcyBhbnkpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICdyZWxhdGl2ZSBtci0xIGgtZnVsbCcsXG4gICAgICAgIHNob3dNZXNzYWdlTG9nTW9kYWwgJiYgJ2Fic29sdXRlIHotMCBtci0yIHctWzQwMHB4XSBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC0yeGwgYm9yZGVyLVswLjVweF0gYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIHNoYWRvdy1sZyB0cmFuc2l0aW9uLWFsbCcsXG4gICAgICApfVxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcmlnaHQ6ICFzaG93TWVzc2FnZUxvZ01vZGFsID8gJzAnIDogYCR7b3RoZXJQYW5lbFdpZHRofXB4YCxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICByZWY9e3RyaWdnZXJSZWZ9XG4gICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIC1sZWZ0LTEgdG9wLTAgZmxleCBoLWZ1bGwgdy0xIGN1cnNvci1jb2wtcmVzaXplIHJlc2l6ZS14IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0xMCB3LTAuNSByb3VuZGVkLXNtIGJnLXN0YXRlLWJhc2UtaGFuZGxlIGhvdmVyOmgtZnVsbCBob3ZlcjpiZy1zdGF0ZS1hY2NlbnQtc29saWQgYWN0aXZlOmgtZnVsbCBhY3RpdmU6Ymctc3RhdGUtYWNjZW50LXNvbGlkXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXtjb250YWluZXJSZWZ9XG4gICAgICAgIGNsYXNzTmFtZT17Y24oJ2ZsZXggaC1mdWxsIGZsZXgtY29sIHJvdW5kZWQtMnhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHNoYWRvdy1sZyB0cmFuc2l0aW9uLVt3aWR0aF0gZWFzZS1saW5lYXInLCBzaG93U2luZ2xlUnVuUGFuZWwgPyAnb3ZlcmZsb3ctaGlkZGVuJyA6ICdvdmVyZmxvdy15LWF1dG8nKX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogYCR7bm9kZVBhbmVsV2lkdGh9cHhgLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0aWNreSB0b3AtMCB6LTEwIHNocmluay0wIGJvcmRlci1iLVswLjVweF0gYm9yZGVyLWRpdmlkZXItcmVndWxhciBiZy1jb21wb25lbnRzLXBhbmVsLWJnXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBweC00IHBiLTEgcHQtNFwiPlxuICAgICAgICAgICAgPEJsb2NrSWNvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtci0xIHNocmluay0wXCJcbiAgICAgICAgICAgICAgdHlwZT17ZGF0YS50eXBlfVxuICAgICAgICAgICAgICB0b29sSWNvbj17dG9vbEljb259XG4gICAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFRpdGxlSW5wdXRcbiAgICAgICAgICAgICAgdmFsdWU9e2RhdGEudGl0bGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQmx1cj17aGFuZGxlVGl0bGVCbHVyfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzaHJpbmstMCBpdGVtcy1jZW50ZXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpc1N1cHBvcnRTaW5nbGVSdW4gJiYgIW5vZGVzUmVhZE9ubHkgJiYgKFxuICAgICAgICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgcG9wdXBDb250ZW50PXt0KCdwYW5lbC5ydW5UaGlzU3RlcCcsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwQ2xhc3NOYW1lPVwibXItMVwiXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtpc1NpbmdsZVJ1bm5pbmd9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtci0xIGZsZXggaC02IHctNiBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1tZCBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNTaW5nbGVSdW5uaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVTdG9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlU2luZ2xlUnVuKClcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNTaW5nbGVSdW5uaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gPFN0b3AgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IDxSaVBsYXlMYXJnZUxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDxIZWxwTGluayBub2RlVHlwZT17ZGF0YS50eXBlfSAvPlxuICAgICAgICAgICAgICA8UGFuZWxPcGVyYXRvciBpZD17aWR9IGRhdGE9e2RhdGF9IHNob3dIZWxwTGluaz17ZmFsc2V9IC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtMyBoLTMuNSB3LVsxcHhdIGJnLWRpdmlkZXItcmVndWxhclwiIC8+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtNiB3LTYgY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVOb2RlU2VsZWN0KGlkLCB0cnVlKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTJcIj5cbiAgICAgICAgICAgIDxEZXNjcmlwdGlvbklucHV0XG4gICAgICAgICAgICAgIHZhbHVlPXtkYXRhLmRlc2MgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVEZXNjcmlwdGlvbkNoYW5nZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge1xuICAgICAgICAgICAgbmVlZHNUb29sQXV0aCAmJiAoXG4gICAgICAgICAgICAgIDxQbHVnaW5BdXRoXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBwYi0yXCJcbiAgICAgICAgICAgICAgICBwbHVnaW5QYXlsb2FkPXt7XG4gICAgICAgICAgICAgICAgICBwcm92aWRlcjogY3VyclRvb2xDb2xsZWN0aW9uPy5uYW1lIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgcHJvdmlkZXJUeXBlOiBjdXJyVG9vbENvbGxlY3Rpb24/LnR5cGUgfHwgJycsXG4gICAgICAgICAgICAgICAgICBjYXRlZ29yeTogQXV0aENhdGVnb3J5LnRvb2wsXG4gICAgICAgICAgICAgICAgICBkZXRhaWw6IGN1cnJUb29sQ29sbGVjdGlvbiBhcyBhbnksXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHBsLTQgcHItM1wiPlxuICAgICAgICAgICAgICAgICAgPFRhYlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGFiVHlwZX1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFRhYlR5cGV9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPEF1dGhvcml6ZWRJbk5vZGVcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luUGF5bG9hZD17e1xuICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBjdXJyVG9vbENvbGxlY3Rpb24/Lm5hbWUgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJUeXBlOiBjdXJyVG9vbENvbGxlY3Rpb24/LnR5cGUgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IEF1dGhDYXRlZ29yeS50b29sLFxuICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogY3VyclRvb2xDb2xsZWN0aW9uIGFzIGFueSxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgb25BdXRob3JpemF0aW9uSXRlbUNsaWNrPXtoYW5kbGVBdXRob3JpemF0aW9uSXRlbUNsaWNrfVxuICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFsSWQ9e2RhdGEuY3JlZGVudGlhbF9pZH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvUGx1Z2luQXV0aD5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgICAge1xuICAgICAgICAgICAgISFjdXJyZW50RGF0YVNvdXJjZSAmJiAoXG4gICAgICAgICAgICAgIDxQbHVnaW5BdXRoSW5EYXRhU291cmNlTm9kZVxuICAgICAgICAgICAgICAgIG9uSnVtcFRvRGF0YVNvdXJjZVBhZ2U9e2hhbmRsZUp1bXBUb0RhdGFTb3VyY2VQYWdlfVxuICAgICAgICAgICAgICAgIGlzQXV0aG9yaXplZD17Y3VycmVudERhdGFTb3VyY2UuaXNfYXV0aG9yaXplZH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHBsLTQgcHItM1wiPlxuICAgICAgICAgICAgICAgICAgPFRhYlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGFiVHlwZX1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFRhYlR5cGV9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPEF1dGhvcml6ZWRJbkRhdGFTb3VyY2VOb2RlXG4gICAgICAgICAgICAgICAgICAgIG9uSnVtcFRvRGF0YVNvdXJjZVBhZ2U9e2hhbmRsZUp1bXBUb0RhdGFTb3VyY2VQYWdlfVxuICAgICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uc051bT17M31cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGU+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGN1cnJlbnRUcmlnZ2VyUGx1Z2luICYmIChcbiAgICAgICAgICAgICAgPFRyaWdnZXJTdWJzY3JpcHRpb25cbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25JZFNlbGVjdGVkPXtkYXRhLnN1YnNjcmlwdGlvbl9pZH1cbiAgICAgICAgICAgICAgICBvblN1YnNjcmlwdGlvbkNoYW5nZT17aGFuZGxlU3Vic2NyaXB0aW9uQ2hhbmdlfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFRhYlxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3RhYlR5cGV9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0VGFiVHlwZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L1RyaWdnZXJTdWJzY3JpcHRpb24+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICFuZWVkc1Rvb2xBdXRoICYmICFjdXJyZW50RGF0YVNvdXJjZSAmJiAhY3VycmVudFRyaWdnZXJQbHVnaW4gJiYgKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwbC00IHByLTNcIj5cbiAgICAgICAgICAgICAgICA8VGFiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17dGFiVHlwZX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRUYWJUeXBlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgICA8U3BsaXQgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0YWJUeXBlID09PSBUYWJUeXBlLnNldHRpbmdzICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC0xIGZsZXgtY29sIG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAge2Nsb25lRWxlbWVudChjaGlsZHJlbiBhcyBhbnksIHtcbiAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHBhbmVsUHJvcHM6IHtcbiAgICAgICAgICAgICAgICAgIGdldElucHV0VmFycyxcbiAgICAgICAgICAgICAgICAgIHRvVmFySW5wdXRzLFxuICAgICAgICAgICAgICAgICAgcnVuSW5wdXREYXRhLFxuICAgICAgICAgICAgICAgICAgc2V0UnVuSW5wdXREYXRhLFxuICAgICAgICAgICAgICAgICAgcnVuUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgcnVuSW5wdXREYXRhUmVmLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8U3BsaXQgLz5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaGFzUmV0cnlOb2RlKGRhdGEudHlwZSkgJiYgKFxuICAgICAgICAgICAgICAgIDxSZXRyeU9uUGFuZWxcbiAgICAgICAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBoYXNFcnJvckhhbmRsZU5vZGUoZGF0YS50eXBlKSAmJiAoXG4gICAgICAgICAgICAgICAgPEVycm9ySGFuZGxlT25QYW5lbFxuICAgICAgICAgICAgICAgICAgaWQ9e2lkfVxuICAgICAgICAgICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICEhYXZhaWxhYmxlTmV4dEJsb2Nrcy5sZW5ndGggJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQtWzAuNXB4XSBib3JkZXItZGl2aWRlci1yZWd1bGFyIHAtNFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQtdXBwZXJjYXNlIG1iLTEgZmxleCBpdGVtcy1jZW50ZXIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICB7dCgncGFuZWwubmV4dFN0ZXAnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLnRvTG9jYWxlVXBwZXJDYXNlKCl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgbWItMiB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAge3QoJ3BhbmVsLmFkZE5leHRTdGVwJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPE5leHRTdGVwIHNlbGVjdGVkTm9kZT17c2VsZWN0ZWROb2RlfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB7cmVhZG1lRW50cmFuY2VDb21wb25lbnR9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAge3RhYlR5cGUgPT09IFRhYlR5cGUubGFzdFJ1biAmJiAoXG4gICAgICAgICAgPExhc3RSdW5cbiAgICAgICAgICAgIGFwcElkPXthcHBEZXRhaWw/LmlkIHx8ICcnfVxuICAgICAgICAgICAgbm9kZUlkPXtpZH1cbiAgICAgICAgICAgIGNhblNpbmdsZVJ1bj17aXNTdXBwb3J0U2luZ2xlUnVufVxuICAgICAgICAgICAgcnVubmluZ1N0YXR1cz17cnVubmluZ1N0YXR1c31cbiAgICAgICAgICAgIGlzUnVuQWZ0ZXJTaW5nbGVSdW49e2lzUnVuQWZ0ZXJTaW5nbGVSdW59XG4gICAgICAgICAgICB1cGRhdGVOb2RlUnVubmluZ1N0YXR1cz17dXBkYXRlTm9kZVJ1bm5pbmdTdGF0dXN9XG4gICAgICAgICAgICBvblNpbmdsZVJ1bkNsaWNrZWQ9e2hhbmRsZVNpbmdsZVJ1bn1cbiAgICAgICAgICAgIG5vZGVJbmZvPXtub2RlSW5mbyF9XG4gICAgICAgICAgICBzaW5nbGVSdW5SZXN1bHQ9e3J1blJlc3VsdCF9XG4gICAgICAgICAgICBpc1BhdXNlZD17aXNQYXVzZWR9XG4gICAgICAgICAgICB7Li4ucGFzc2VkTG9nUGFyYW1zfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oQmFzZVBhbmVsKVxuIl19