"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const dynamic_1 = require("next/dynamic");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const card_view_1 = require("@/app/(commonLayout)/app/(appDetailLayout)/[appId]/overview/card-view");
const store_1 = require("@/app/components/app/store");
const button_1 = require("@/app/components/base/button");
const content_dialog_1 = require("@/app/components/base/content-dialog");
const toast_1 = require("@/app/components/base/toast");
const config_1 = require("@/config");
const app_context_1 = require("@/context/app-context");
const provider_context_1 = require("@/context/provider-context");
const apps_1 = require("@/service/apps");
const use_apps_1 = require("@/service/use-apps");
const workflow_1 = require("@/service/workflow");
const app_1 = require("@/types/app");
const app_redirection_1 = require("@/utils/app-redirection");
const classnames_1 = require("@/utils/classnames");
const app_icon_1 = require("../base/app-icon");
const app_operations_1 = require("./app-operations");
const SwitchAppModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/app/switch-app-modal')), {
    ssr: false,
});
const CreateAppModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/explore/create-app-modal')), {
    ssr: false,
});
const DuplicateAppModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/app/duplicate-modal')), {
    ssr: false,
});
const Confirm = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/base/confirm')), {
    ssr: false,
});
const UpdateDSLModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/workflow/update-dsl-modal')), {
    ssr: false,
});
const DSLExportConfirmModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/workflow/dsl-export-confirm-modal')), {
    ssr: false,
});
const AppInfo = ({ expand, onlyShowDetail = false, openState = false, onDetailExpand }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const { replace } = (0, navigation_1.useRouter)();
    const { onPlanInfoChanged } = (0, provider_context_1.useProviderContext)();
    const appDetail = (0, store_1.useStore)(state => state.appDetail);
    const setAppDetail = (0, store_1.useStore)(state => state.setAppDetail);
    const invalidateAppList = (0, use_apps_1.useInvalidateAppList)();
    const [open, setOpen] = (0, react_2.useState)(openState);
    const [showEditModal, setShowEditModal] = (0, react_2.useState)(false);
    const [showDuplicateModal, setShowDuplicateModal] = (0, react_2.useState)(false);
    const [showConfirmDelete, setShowConfirmDelete] = (0, react_2.useState)(false);
    const [showSwitchModal, setShowSwitchModal] = (0, react_2.useState)(false);
    const [showImportDSLModal, setShowImportDSLModal] = (0, react_2.useState)(false);
    const [secretEnvList, setSecretEnvList] = (0, react_2.useState)([]);
    const [showExportWarning, setShowExportWarning] = (0, react_2.useState)(false);
    const onEdit = (0, react_2.useCallback)(async ({ name, icon_type, icon, icon_background, description, use_icon_as_answer_icon, max_active_requests, }) => {
        if (!appDetail)
            return;
        try {
            const app = await (0, apps_1.updateAppInfo)({
                appID: appDetail.id,
                name,
                icon_type,
                icon,
                icon_background,
                description,
                use_icon_as_answer_icon,
                max_active_requests,
            });
            setShowEditModal(false);
            notify({
                type: 'success',
                message: t('editDone', { ns: 'app' }),
            });
            setAppDetail(app);
        }
        catch {
            notify({ type: 'error', message: t('editFailed', { ns: 'app' }) });
        }
    }, [appDetail, notify, setAppDetail, t]);
    const onCopy = async ({ name, icon_type, icon, icon_background }) => {
        if (!appDetail)
            return;
        try {
            const newApp = await (0, apps_1.copyApp)({
                appID: appDetail.id,
                name,
                icon_type,
                icon,
                icon_background,
                mode: appDetail.mode,
            });
            setShowDuplicateModal(false);
            notify({
                type: 'success',
                message: t('newApp.appCreated', { ns: 'app' }),
            });
            localStorage.setItem(config_1.NEED_REFRESH_APP_LIST_KEY, '1');
            onPlanInfoChanged();
            (0, app_redirection_1.getRedirection)(true, newApp, replace);
        }
        catch {
            notify({ type: 'error', message: t('newApp.appCreateFailed', { ns: 'app' }) });
        }
    };
    const onExport = async (include = false) => {
        if (!appDetail)
            return;
        try {
            const { data } = await (0, apps_1.exportAppConfig)({
                appID: appDetail.id,
                include,
            });
            const a = document.createElement('a');
            const file = new Blob([data], { type: 'application/yaml' });
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = `${appDetail.name}.yml`;
            a.click();
            URL.revokeObjectURL(url);
        }
        catch {
            notify({ type: 'error', message: t('exportFailed', { ns: 'app' }) });
        }
    };
    const exportCheck = async () => {
        if (!appDetail)
            return;
        if (appDetail.mode !== app_1.AppModeEnum.WORKFLOW && appDetail.mode !== app_1.AppModeEnum.ADVANCED_CHAT) {
            onExport();
            return;
        }
        setShowExportWarning(true);
    };
    const handleConfirmExport = async () => {
        if (!appDetail)
            return;
        setShowExportWarning(false);
        try {
            const workflowDraft = await (0, workflow_1.fetchWorkflowDraft)(`/apps/${appDetail.id}/workflows/draft`);
            const list = (workflowDraft.environment_variables || []).filter(env => env.value_type === 'secret');
            if (list.length === 0) {
                onExport();
                return;
            }
            setSecretEnvList(list);
        }
        catch {
            notify({ type: 'error', message: t('exportFailed', { ns: 'app' }) });
        }
    };
    const onConfirmDelete = (0, react_2.useCallback)(async () => {
        if (!appDetail)
            return;
        try {
            await (0, apps_1.deleteApp)(appDetail.id);
            notify({ type: 'success', message: t('appDeleted', { ns: 'app' }) });
            invalidateAppList();
            onPlanInfoChanged();
            setAppDetail();
            replace('/apps');
        }
        catch (e) {
            notify({
                type: 'error',
                message: `${t('appDeleteFailed', { ns: 'app' })}${'message' in e ? `: ${e.message}` : ''}`,
            });
        }
        setShowConfirmDelete(false);
    }, [appDetail, invalidateAppList, notify, onPlanInfoChanged, replace, setAppDetail, t]);
    const { isCurrentWorkspaceEditor } = (0, app_context_1.useAppContext)();
    if (!appDetail)
        return null;
    const primaryOperations = [
        {
            id: 'edit',
            title: t('editApp', { ns: 'app' }),
            icon: <react_1.RiEditLine />,
            onClick: () => {
                setOpen(false);
                onDetailExpand?.(false);
                setShowEditModal(true);
            },
        },
        {
            id: 'duplicate',
            title: t('duplicate', { ns: 'app' }),
            icon: <react_1.RiFileCopy2Line />,
            onClick: () => {
                setOpen(false);
                onDetailExpand?.(false);
                setShowDuplicateModal(true);
            },
        },
        {
            id: 'export',
            title: t('export', { ns: 'app' }),
            icon: <react_1.RiFileDownloadLine />,
            onClick: exportCheck,
        },
    ];
    const secondaryOperations = [
        // Import DSL (conditional)
        ...(appDetail.mode === app_1.AppModeEnum.ADVANCED_CHAT || appDetail.mode === app_1.AppModeEnum.WORKFLOW)
            ? [{
                    id: 'import',
                    title: t('common.importDSL', { ns: 'workflow' }),
                    icon: <react_1.RiFileUploadLine />,
                    onClick: () => {
                        setOpen(false);
                        onDetailExpand?.(false);
                        setShowImportDSLModal(true);
                    },
                }]
            : [],
        // Divider
        {
            id: 'divider-1',
            title: '',
            icon: <></>,
            onClick: () => { },
            type: 'divider',
        },
        // Delete operation
        {
            id: 'delete',
            title: t('operation.delete', { ns: 'common' }),
            icon: <react_1.RiDeleteBinLine />,
            onClick: () => {
                setOpen(false);
                onDetailExpand?.(false);
                setShowConfirmDelete(true);
            },
        },
    ];
    // Keep the switch operation separate as it's not part of the main operations
    const switchOperation = (appDetail.mode === app_1.AppModeEnum.COMPLETION || appDetail.mode === app_1.AppModeEnum.CHAT)
        ? {
            id: 'switch',
            title: t('switch', { ns: 'app' }),
            icon: <react_1.RiExchange2Line />,
            onClick: () => {
                setOpen(false);
                onDetailExpand?.(false);
                setShowSwitchModal(true);
            },
        }
        : null;
    return (<div>
      {!onlyShowDetail && (<button type="button" onClick={() => {
                if (isCurrentWorkspaceEditor)
                    setOpen(v => !v);
            }} className="block w-full">
          <div className="flex flex-col gap-2 rounded-lg p-1 hover:bg-state-base-hover">
            <div className="flex items-center gap-1">
              <div className={(0, classnames_1.cn)(!expand && 'ml-1')}>
                <app_icon_1.default size={expand ? 'large' : 'small'} iconType={appDetail.icon_type} icon={appDetail.icon} background={appDetail.icon_background} imageUrl={appDetail.icon_url}/>
              </div>
              {expand && (<div className="ml-auto flex items-center justify-center rounded-md p-0.5">
                  <div className="flex h-5 w-5 items-center justify-center">
                    <react_1.RiEqualizer2Line className="h-4 w-4 text-text-tertiary"/>
                  </div>
                </div>)}
            </div>
            {!expand && (<div className="flex items-center justify-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-md p-0.5">
                  <react_1.RiEqualizer2Line className="h-4 w-4 text-text-tertiary"/>
                </div>
              </div>)}
            {expand && (<div className="flex flex-col items-start gap-1">
                <div className="flex w-full">
                  <div className="system-md-semibold truncate whitespace-nowrap text-text-secondary">{appDetail.name}</div>
                </div>
                <div className="system-2xs-medium-uppercase whitespace-nowrap text-text-tertiary">
                  {appDetail.mode === app_1.AppModeEnum.ADVANCED_CHAT
                    ? t('types.advanced', { ns: 'app' })
                    : appDetail.mode === app_1.AppModeEnum.AGENT_CHAT
                        ? t('types.agent', { ns: 'app' })
                        : appDetail.mode === app_1.AppModeEnum.CHAT
                            ? t('types.chatbot', { ns: 'app' })
                            : appDetail.mode === app_1.AppModeEnum.COMPLETION
                                ? t('types.completion', { ns: 'app' })
                                : t('types.workflow', { ns: 'app' })}
                </div>
              </div>)}
          </div>
        </button>)}
      <content_dialog_1.default show={onlyShowDetail ? openState : open} onClose={() => {
            setOpen(false);
            onDetailExpand?.(false);
        }} className="absolute bottom-2 left-2 top-2 flex w-[420px] flex-col rounded-2xl !p-0">
        <div className="flex shrink-0 flex-col items-start justify-center gap-3 self-stretch p-4">
          <div className="flex items-center gap-3 self-stretch">
            <app_icon_1.default size="large" iconType={appDetail.icon_type} icon={appDetail.icon} background={appDetail.icon_background} imageUrl={appDetail.icon_url}/>
            <div className="flex flex-1 flex-col items-start justify-center overflow-hidden">
              <div className="system-md-semibold w-full truncate text-text-secondary">{appDetail.name}</div>
              <div className="system-2xs-medium-uppercase text-text-tertiary">{appDetail.mode === app_1.AppModeEnum.ADVANCED_CHAT ? t('types.advanced', { ns: 'app' }) : appDetail.mode === app_1.AppModeEnum.AGENT_CHAT ? t('types.agent', { ns: 'app' }) : appDetail.mode === app_1.AppModeEnum.CHAT ? t('types.chatbot', { ns: 'app' }) : appDetail.mode === app_1.AppModeEnum.COMPLETION ? t('types.completion', { ns: 'app' }) : t('types.workflow', { ns: 'app' })}</div>
            </div>
          </div>
          {/* description */}
          {appDetail.description && (<div className="system-xs-regular overflow-wrap-anywhere max-h-[105px] w-full max-w-full overflow-y-auto whitespace-normal break-words text-text-tertiary">{appDetail.description}</div>)}
          {/* operations */}
          <app_operations_1.default gap={4} primaryOperations={primaryOperations} secondaryOperations={secondaryOperations}/>
        </div>
        <card_view_1.default appId={appDetail.id} isInPanel={true} className="flex flex-1 flex-col gap-2 overflow-auto px-2 py-1"/>
        {/* Switch operation (if available) */}
        {switchOperation && (<div className="flex min-h-fit shrink-0 flex-col items-start justify-center gap-3 self-stretch pb-2">
            <button_1.default size="medium" variant="ghost" className="gap-0.5" onClick={switchOperation.onClick}>
              {switchOperation.icon}
              <span className="system-sm-medium text-text-tertiary">{switchOperation.title}</span>
            </button_1.default>
          </div>)}
      </content_dialog_1.default>
      {showSwitchModal && (<SwitchAppModal inAppDetail show={showSwitchModal} appDetail={appDetail} onClose={() => setShowSwitchModal(false)} onSuccess={() => setShowSwitchModal(false)}/>)}
      {showEditModal && (<CreateAppModal isEditModal appName={appDetail.name} appIconType={appDetail.icon_type} appIcon={appDetail.icon} appIconBackground={appDetail.icon_background} appIconUrl={appDetail.icon_url} appDescription={appDetail.description} appMode={appDetail.mode} appUseIconAsAnswerIcon={appDetail.use_icon_as_answer_icon} max_active_requests={appDetail.max_active_requests ?? null} show={showEditModal} onConfirm={onEdit} onHide={() => setShowEditModal(false)}/>)}
      {showDuplicateModal && (<DuplicateAppModal appName={appDetail.name} icon_type={appDetail.icon_type} icon={appDetail.icon} icon_background={appDetail.icon_background} icon_url={appDetail.icon_url} show={showDuplicateModal} onConfirm={onCopy} onHide={() => setShowDuplicateModal(false)}/>)}
      {showConfirmDelete && (<Confirm title={t('deleteAppConfirmTitle', { ns: 'app' })} content={t('deleteAppConfirmContent', { ns: 'app' })} isShow={showConfirmDelete} onConfirm={onConfirmDelete} onCancel={() => setShowConfirmDelete(false)}/>)}
      {showImportDSLModal && (<UpdateDSLModal onCancel={() => setShowImportDSLModal(false)} onBackup={exportCheck}/>)}
      {secretEnvList.length > 0 && (<DSLExportConfirmModal envList={secretEnvList} onConfirm={onExport} onClose={() => setSecretEnvList([])}/>)}
      {showExportWarning && (<Confirm type="info" isShow={showExportWarning} title={t('sidebar.exportWarning', { ns: 'workflow' })} content={t('sidebar.exportWarningDesc', { ns: 'workflow' })} onConfirm={handleConfirmExport} onCancel={() => setShowExportWarning(false)}/>)}
    </div>);
};
exports.default = React.memo(AppInfo);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAtaW5mby50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSw0Q0FReUI7QUFDekIsMENBQWtDO0FBQ2xDLGdEQUEyQztBQUMzQywrQkFBOEI7QUFDOUIsaUNBQTZDO0FBQzdDLGlEQUE4QztBQUM5QywrREFBaUQ7QUFDakQscUdBQTRGO0FBQzVGLHNEQUFvRTtBQUNwRSx5REFBaUQ7QUFDakQseUVBQWdFO0FBQ2hFLHVEQUEwRDtBQUMxRCxxQ0FBb0Q7QUFDcEQsdURBQXFEO0FBQ3JELGlFQUErRDtBQUMvRCx5Q0FBbUY7QUFDbkYsaURBQXlEO0FBQ3pELGlEQUF1RDtBQUN2RCxxQ0FBeUM7QUFDekMsNkRBQXdEO0FBQ3hELG1EQUF1QztBQUN2QywrQ0FBc0M7QUFDdEMscURBQTRDO0FBRTVDLE1BQU0sY0FBYyxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsdUNBQXVDLEVBQUMsRUFBRTtJQUNwRixHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUNGLE1BQU0sY0FBYyxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsMkNBQTJDLEVBQUMsRUFBRTtJQUN4RixHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUNGLE1BQU0saUJBQWlCLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSxzQ0FBc0MsRUFBQyxFQUFFO0lBQ3RGLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSwrQkFBK0IsRUFBQyxFQUFFO0lBQ3JFLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxjQUFjLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSw0Q0FBNEMsRUFBQyxFQUFFO0lBQ3pGLEdB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LE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQzVELFNBQVMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQzVDLENBQ0gsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE9wZXJhdGlvbiB9IGZyb20gJy4vYXBwLW9wZXJhdGlvbnMnXG5pbXBvcnQgdHlwZSB7IER1cGxpY2F0ZUFwcE1vZGFsUHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9kdXBsaWNhdGUtbW9kYWwnXG5pbXBvcnQgdHlwZSB7IENyZWF0ZUFwcE1vZGFsUHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2V4cGxvcmUvY3JlYXRlLWFwcC1tb2RhbCdcbmltcG9ydCB0eXBlIHsgRW52aXJvbm1lbnRWYXJpYWJsZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQge1xuICBSaURlbGV0ZUJpbkxpbmUsXG4gIFJpRWRpdExpbmUsXG4gIFJpRXF1YWxpemVyMkxpbmUsXG4gIFJpRXhjaGFuZ2UyTGluZSxcbiAgUmlGaWxlQ29weTJMaW5lLFxuICBSaUZpbGVEb3dubG9hZExpbmUsXG4gIFJpRmlsZVVwbG9hZExpbmUsXG59IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgZHluYW1pYyBmcm9tICduZXh0L2R5bmFtaWMnXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuaW1wb3J0IENhcmRWaWV3IGZyb20gJ0AvYXBwLyhjb21tb25MYXlvdXQpL2FwcC8oYXBwRGV0YWlsTGF5b3V0KS9bYXBwSWRdL292ZXJ2aWV3L2NhcmQtdmlldydcbmltcG9ydCB7IHVzZVN0b3JlIGFzIHVzZUFwcFN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvc3RvcmUnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgQ29udGVudERpYWxvZyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY29udGVudC1kaWFsb2cnXG5pbXBvcnQgeyBUb2FzdENvbnRleHQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBORUVEX1JFRlJFU0hfQVBQX0xJU1RfS0VZIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlUHJvdmlkZXJDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgeyBjb3B5QXBwLCBkZWxldGVBcHAsIGV4cG9ydEFwcENvbmZpZywgdXBkYXRlQXBwSW5mbyB9IGZyb20gJ0Avc2VydmljZS9hcHBzJ1xuaW1wb3J0IHsgdXNlSW52YWxpZGF0ZUFwcExpc3QgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWFwcHMnXG5pbXBvcnQgeyBmZXRjaFdvcmtmbG93RHJhZnQgfSBmcm9tICdAL3NlcnZpY2Uvd29ya2Zsb3cnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgZ2V0UmVkaXJlY3Rpb24gfSBmcm9tICdAL3V0aWxzL2FwcC1yZWRpcmVjdGlvbidcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IEFwcEljb24gZnJvbSAnLi4vYmFzZS9hcHAtaWNvbidcbmltcG9ydCBBcHBPcGVyYXRpb25zIGZyb20gJy4vYXBwLW9wZXJhdGlvbnMnXG5cbmNvbnN0IFN3aXRjaEFwcE1vZGFsID0gZHluYW1pYygoKSA9PiBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N3aXRjaC1hcHAtbW9kYWwnKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IENyZWF0ZUFwcE1vZGFsID0gZHluYW1pYygoKSA9PiBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvZXhwbG9yZS9jcmVhdGUtYXBwLW1vZGFsJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5jb25zdCBEdXBsaWNhdGVBcHBNb2RhbCA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCdAL2FwcC9jb21wb25lbnRzL2FwcC9kdXBsaWNhdGUtbW9kYWwnKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IENvbmZpcm0gPSBkeW5hbWljKCgpID0+IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NvbmZpcm0nKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IFVwZGF0ZURTTE1vZGFsID0gZHluYW1pYygoKSA9PiBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXBkYXRlLWRzbC1tb2RhbCcpLCB7XG4gIHNzcjogZmFsc2UsXG59KVxuY29uc3QgRFNMRXhwb3J0Q29uZmlybU1vZGFsID0gZHluYW1pYygoKSA9PiBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvZHNsLWV4cG9ydC1jb25maXJtLW1vZGFsJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5cbmV4cG9ydCB0eXBlIElBcHBJbmZvUHJvcHMgPSB7XG4gIGV4cGFuZDogYm9vbGVhblxuICBvbmx5U2hvd0RldGFpbD86IGJvb2xlYW5cbiAgb3BlblN0YXRlPzogYm9vbGVhblxuICBvbkRldGFpbEV4cGFuZD86IChleHBhbmQ6IGJvb2xlYW4pID0+IHZvaWRcbn1cblxuY29uc3QgQXBwSW5mbyA9ICh7IGV4cGFuZCwgb25seVNob3dEZXRhaWwgPSBmYWxzZSwgb3BlblN0YXRlID0gZmFsc2UsIG9uRGV0YWlsRXhwYW5kIH06IElBcHBJbmZvUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VDb250ZXh0KFRvYXN0Q29udGV4dClcbiAgY29uc3QgeyByZXBsYWNlIH0gPSB1c2VSb3V0ZXIoKVxuICBjb25zdCB7IG9uUGxhbkluZm9DaGFuZ2VkIH0gPSB1c2VQcm92aWRlckNvbnRleHQoKVxuICBjb25zdCBhcHBEZXRhaWwgPSB1c2VBcHBTdG9yZShzdGF0ZSA9PiBzdGF0ZS5hcHBEZXRhaWwpXG4gIGNvbnN0IHNldEFwcERldGFpbCA9IHVzZUFwcFN0b3JlKHN0YXRlID0+IHN0YXRlLnNldEFwcERldGFpbClcbiAgY29uc3QgaW52YWxpZGF0ZUFwcExpc3QgPSB1c2VJbnZhbGlkYXRlQXBwTGlzdCgpXG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKG9wZW5TdGF0ZSlcbiAgY29uc3QgW3Nob3dFZGl0TW9kYWwsIHNldFNob3dFZGl0TW9kYWxdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93RHVwbGljYXRlTW9kYWwsIHNldFNob3dEdXBsaWNhdGVNb2RhbF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3Nob3dDb25maXJtRGVsZXRlLCBzZXRTaG93Q29uZmlybURlbGV0ZV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3Nob3dTd2l0Y2hNb2RhbCwgc2V0U2hvd1N3aXRjaE1vZGFsXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKVxuICBjb25zdCBbc2hvd0ltcG9ydERTTE1vZGFsLCBzZXRTaG93SW1wb3J0RFNMTW9kYWxdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpXG4gIGNvbnN0IFtzZWNyZXRFbnZMaXN0LCBzZXRTZWNyZXRFbnZMaXN0XSA9IHVzZVN0YXRlPEVudmlyb25tZW50VmFyaWFibGVbXT4oW10pXG4gIGNvbnN0IFtzaG93RXhwb3J0V2FybmluZywgc2V0U2hvd0V4cG9ydFdhcm5pbmddID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgY29uc3Qgb25FZGl0OiBDcmVhdGVBcHBNb2RhbFByb3BzWydvbkNvbmZpcm0nXSA9IHVzZUNhbGxiYWNrKGFzeW5jICh7XG4gICAgbmFtZSxcbiAgICBpY29uX3R5cGUsXG4gICAgaWNvbixcbiAgICBpY29uX2JhY2tncm91bmQsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgdXNlX2ljb25fYXNfYW5zd2VyX2ljb24sXG4gICAgbWF4X2FjdGl2ZV9yZXF1ZXN0cyxcbiAgfSkgPT4ge1xuICAgIGlmICghYXBwRGV0YWlsKVxuICAgICAgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGFwcCA9IGF3YWl0IHVwZGF0ZUFwcEluZm8oe1xuICAgICAgICBhcHBJRDogYXBwRGV0YWlsLmlkLFxuICAgICAgICBuYW1lLFxuICAgICAgICBpY29uX3R5cGUsXG4gICAgICAgIGljb24sXG4gICAgICAgIGljb25fYmFja2dyb3VuZCxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIHVzZV9pY29uX2FzX2Fuc3dlcl9pY29uLFxuICAgICAgICBtYXhfYWN0aXZlX3JlcXVlc3RzLFxuICAgICAgfSlcbiAgICAgIHNldFNob3dFZGl0TW9kYWwoZmFsc2UpXG4gICAgICBub3RpZnkoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6IHQoJ2VkaXREb25lJywgeyBuczogJ2FwcCcgfSksXG4gICAgICB9KVxuICAgICAgc2V0QXBwRGV0YWlsKGFwcClcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnZWRpdEZhaWxlZCcsIHsgbnM6ICdhcHAnIH0pIH0pXG4gICAgfVxuICB9LCBbYXBwRGV0YWlsLCBub3RpZnksIHNldEFwcERldGFpbCwgdF0pXG5cbiAgY29uc3Qgb25Db3B5OiBEdXBsaWNhdGVBcHBNb2RhbFByb3BzWydvbkNvbmZpcm0nXSA9IGFzeW5jICh7IG5hbWUsIGljb25fdHlwZSwgaWNvbiwgaWNvbl9iYWNrZ3JvdW5kIH0pID0+IHtcbiAgICBpZiAoIWFwcERldGFpbClcbiAgICAgIHJldHVyblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBuZXdBcHAgPSBhd2FpdCBjb3B5QXBwKHtcbiAgICAgICAgYXBwSUQ6IGFwcERldGFpbC5pZCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgaWNvbl90eXBlLFxuICAgICAgICBpY29uLFxuICAgICAgICBpY29uX2JhY2tncm91bmQsXG4gICAgICAgIG1vZGU6IGFwcERldGFpbC5tb2RlLFxuICAgICAgfSlcbiAgICAgIHNldFNob3dEdXBsaWNhdGVNb2RhbChmYWxzZSlcbiAgICAgIG5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogdCgnbmV3QXBwLmFwcENyZWF0ZWQnLCB7IG5zOiAnYXBwJyB9KSxcbiAgICAgIH0pXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShORUVEX1JFRlJFU0hfQVBQX0xJU1RfS0VZLCAnMScpXG4gICAgICBvblBsYW5JbmZvQ2hhbmdlZCgpXG4gICAgICBnZXRSZWRpcmVjdGlvbih0cnVlLCBuZXdBcHAsIHJlcGxhY2UpXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ25ld0FwcC5hcHBDcmVhdGVGYWlsZWQnLCB7IG5zOiAnYXBwJyB9KSB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uRXhwb3J0ID0gYXN5bmMgKGluY2x1ZGUgPSBmYWxzZSkgPT4ge1xuICAgIGlmICghYXBwRGV0YWlsKVxuICAgICAgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgZXhwb3J0QXBwQ29uZmlnKHtcbiAgICAgICAgYXBwSUQ6IGFwcERldGFpbC5pZCxcbiAgICAgICAgaW5jbHVkZSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgICBjb25zdCBmaWxlID0gbmV3IEJsb2IoW2RhdGFdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi95YW1sJyB9KVxuICAgICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgICAgYS5ocmVmID0gdXJsXG4gICAgICBhLmRvd25sb2FkID0gYCR7YXBwRGV0YWlsLm5hbWV9LnltbGBcbiAgICAgIGEuY2xpY2soKVxuICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2V4cG9ydEZhaWxlZCcsIHsgbnM6ICdhcHAnIH0pIH0pXG4gICAgfVxuICB9XG5cbiAgY29uc3QgZXhwb3J0Q2hlY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFhcHBEZXRhaWwpXG4gICAgICByZXR1cm5cbiAgICBpZiAoYXBwRGV0YWlsLm1vZGUgIT09IEFwcE1vZGVFbnVtLldPUktGTE9XICYmIGFwcERldGFpbC5tb2RlICE9PSBBcHBNb2RlRW51bS5BRFZBTkNFRF9DSEFUKSB7XG4gICAgICBvbkV4cG9ydCgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRTaG93RXhwb3J0V2FybmluZyh0cnVlKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybUV4cG9ydCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWFwcERldGFpbClcbiAgICAgIHJldHVyblxuICAgIHNldFNob3dFeHBvcnRXYXJuaW5nKGZhbHNlKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCB3b3JrZmxvd0RyYWZ0ID0gYXdhaXQgZmV0Y2hXb3JrZmxvd0RyYWZ0KGAvYXBwcy8ke2FwcERldGFpbC5pZH0vd29ya2Zsb3dzL2RyYWZ0YClcbiAgICAgIGNvbnN0IGxpc3QgPSAod29ya2Zsb3dEcmFmdC5lbnZpcm9ubWVudF92YXJpYWJsZXMgfHwgW10pLmZpbHRlcihlbnYgPT4gZW52LnZhbHVlX3R5cGUgPT09ICdzZWNyZXQnKVxuICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG9uRXhwb3J0KClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBzZXRTZWNyZXRFbnZMaXN0KGxpc3QpXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2V4cG9ydEZhaWxlZCcsIHsgbnM6ICdhcHAnIH0pIH0pXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb25Db25maXJtRGVsZXRlID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGlmICghYXBwRGV0YWlsKVxuICAgICAgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRlbGV0ZUFwcChhcHBEZXRhaWwuaWQpXG4gICAgICBub3RpZnkoeyB0eXBlOiAnc3VjY2VzcycsIG1lc3NhZ2U6IHQoJ2FwcERlbGV0ZWQnLCB7IG5zOiAnYXBwJyB9KSB9KVxuICAgICAgaW52YWxpZGF0ZUFwcExpc3QoKVxuICAgICAgb25QbGFuSW5mb0NoYW5nZWQoKVxuICAgICAgc2V0QXBwRGV0YWlsKClcbiAgICAgIHJlcGxhY2UoJy9hcHBzJylcbiAgICB9XG4gICAgY2F0Y2ggKGU6IGFueSkge1xuICAgICAgbm90aWZ5KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogYCR7dCgnYXBwRGVsZXRlRmFpbGVkJywgeyBuczogJ2FwcCcgfSl9JHsnbWVzc2FnZScgaW4gZSA/IGA6ICR7ZS5tZXNzYWdlfWAgOiAnJ31gLFxuICAgICAgfSlcbiAgICB9XG4gICAgc2V0U2hvd0NvbmZpcm1EZWxldGUoZmFsc2UpXG4gIH0sIFthcHBEZXRhaWwsIGludmFsaWRhdGVBcHBMaXN0LCBub3RpZnksIG9uUGxhbkluZm9DaGFuZ2VkLCByZXBsYWNlLCBzZXRBcHBEZXRhaWwsIHRdKVxuXG4gIGNvbnN0IHsgaXNDdXJyZW50V29ya3NwYWNlRWRpdG9yIH0gPSB1c2VBcHBDb250ZXh0KClcblxuICBpZiAoIWFwcERldGFpbClcbiAgICByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHByaW1hcnlPcGVyYXRpb25zID0gW1xuICAgIHtcbiAgICAgIGlkOiAnZWRpdCcsXG4gICAgICB0aXRsZTogdCgnZWRpdEFwcCcsIHsgbnM6ICdhcHAnIH0pLFxuICAgICAgaWNvbjogPFJpRWRpdExpbmUgLz4sXG4gICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgIG9uRGV0YWlsRXhwYW5kPy4oZmFsc2UpXG4gICAgICAgIHNldFNob3dFZGl0TW9kYWwodHJ1ZSlcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2R1cGxpY2F0ZScsXG4gICAgICB0aXRsZTogdCgnZHVwbGljYXRlJywgeyBuczogJ2FwcCcgfSksXG4gICAgICBpY29uOiA8UmlGaWxlQ29weTJMaW5lIC8+LFxuICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICBvbkRldGFpbEV4cGFuZD8uKGZhbHNlKVxuICAgICAgICBzZXRTaG93RHVwbGljYXRlTW9kYWwodHJ1ZSlcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2V4cG9ydCcsXG4gICAgICB0aXRsZTogdCgnZXhwb3J0JywgeyBuczogJ2FwcCcgfSksXG4gICAgICBpY29uOiA8UmlGaWxlRG93bmxvYWRMaW5lIC8+LFxuICAgICAgb25DbGljazogZXhwb3J0Q2hlY2ssXG4gICAgfSxcbiAgXVxuXG4gIGNvbnN0IHNlY29uZGFyeU9wZXJhdGlvbnM6IE9wZXJhdGlvbltdID0gW1xuICAgIC8vIEltcG9ydCBEU0wgKGNvbmRpdGlvbmFsKVxuICAgIC4uLihhcHBEZXRhaWwubW9kZSA9PT0gQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVCB8fCBhcHBEZXRhaWwubW9kZSA9PT0gQXBwTW9kZUVudW0uV09SS0ZMT1cpXG4gICAgICA/IFt7XG4gICAgICAgICAgaWQ6ICdpbXBvcnQnLFxuICAgICAgICAgIHRpdGxlOiB0KCdjb21tb24uaW1wb3J0RFNMJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgICAgICBpY29uOiA8UmlGaWxlVXBsb2FkTGluZSAvPixcbiAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgb25EZXRhaWxFeHBhbmQ/LihmYWxzZSlcbiAgICAgICAgICAgIHNldFNob3dJbXBvcnREU0xNb2RhbCh0cnVlKVxuICAgICAgICAgIH0sXG4gICAgICAgIH1dXG4gICAgICA6IFtdLFxuICAgIC8vIERpdmlkZXJcbiAgICB7XG4gICAgICBpZDogJ2RpdmlkZXItMScsXG4gICAgICB0aXRsZTogJycsXG4gICAgICBpY29uOiA8PjwvPixcbiAgICAgIG9uQ2xpY2s6ICgpID0+IHsgLyogZGl2aWRlciBoYXMgbm8gYWN0aW9uICovIH0sXG4gICAgICB0eXBlOiAnZGl2aWRlcicgYXMgY29uc3QsXG4gICAgfSxcbiAgICAvLyBEZWxldGUgb3BlcmF0aW9uXG4gICAge1xuICAgICAgaWQ6ICdkZWxldGUnLFxuICAgICAgdGl0bGU6IHQoJ29wZXJhdGlvbi5kZWxldGUnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgIGljb246IDxSaURlbGV0ZUJpbkxpbmUgLz4sXG4gICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgIG9uRGV0YWlsRXhwYW5kPy4oZmFsc2UpXG4gICAgICAgIHNldFNob3dDb25maXJtRGVsZXRlKHRydWUpXG4gICAgICB9LFxuICAgIH0sXG4gIF1cblxuICAvLyBLZWVwIHRoZSBzd2l0Y2ggb3BlcmF0aW9uIHNlcGFyYXRlIGFzIGl0J3Mgbm90IHBhcnQgb2YgdGhlIG1haW4gb3BlcmF0aW9uc1xuICBjb25zdCBzd2l0Y2hPcGVyYXRpb24gPSAoYXBwRGV0YWlsLm1vZGUgPT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04gfHwgYXBwRGV0YWlsLm1vZGUgPT09IEFwcE1vZGVFbnVtLkNIQVQpXG4gICAgPyB7XG4gICAgICAgIGlkOiAnc3dpdGNoJyxcbiAgICAgICAgdGl0bGU6IHQoJ3N3aXRjaCcsIHsgbnM6ICdhcHAnIH0pLFxuICAgICAgICBpY29uOiA8UmlFeGNoYW5nZTJMaW5lIC8+LFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICBvbkRldGFpbEV4cGFuZD8uKGZhbHNlKVxuICAgICAgICAgIHNldFNob3dTd2l0Y2hNb2RhbCh0cnVlKVxuICAgICAgICB9LFxuICAgICAgfVxuICAgIDogbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIHshb25seVNob3dEZXRhaWwgJiYgKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzQ3VycmVudFdvcmtzcGFjZUVkaXRvcilcbiAgICAgICAgICAgICAgc2V0T3Blbih2ID0+ICF2KVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYmxvY2sgdy1mdWxsXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtMiByb3VuZGVkLWxnIHAtMSBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbighZXhwYW5kICYmICdtbC0xJyl9PlxuICAgICAgICAgICAgICAgIDxBcHBJY29uXG4gICAgICAgICAgICAgICAgICBzaXplPXtleHBhbmQgPyAnbGFyZ2UnIDogJ3NtYWxsJ31cbiAgICAgICAgICAgICAgICAgIGljb25UeXBlPXthcHBEZXRhaWwuaWNvbl90eXBlfVxuICAgICAgICAgICAgICAgICAgaWNvbj17YXBwRGV0YWlsLmljb259XG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kPXthcHBEZXRhaWwuaWNvbl9iYWNrZ3JvdW5kfVxuICAgICAgICAgICAgICAgICAgaW1hZ2VVcmw9e2FwcERldGFpbC5pY29uX3VybH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAge2V4cGFuZCAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtbC1hdXRvIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbWQgcC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTUgdy01IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8UmlFcXVhbGl6ZXIyTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgeyFleHBhbmQgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtNSB3LTUgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbWQgcC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgIDxSaUVxdWFsaXplcjJMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2V4cGFuZCAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1zdGFydCBnYXAtMVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGxcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLW1kLXNlbWlib2xkIHRydW5jYXRlIHdoaXRlc3BhY2Utbm93cmFwIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57YXBwRGV0YWlsLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tMnhzLW1lZGl1bS11cHBlcmNhc2Ugd2hpdGVzcGFjZS1ub3dyYXAgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAgICB7YXBwRGV0YWlsLm1vZGUgPT09IEFwcE1vZGVFbnVtLkFEVkFOQ0VEX0NIQVRcbiAgICAgICAgICAgICAgICAgICAgPyB0KCd0eXBlcy5hZHZhbmNlZCcsIHsgbnM6ICdhcHAnIH0pXG4gICAgICAgICAgICAgICAgICAgIDogYXBwRGV0YWlsLm1vZGUgPT09IEFwcE1vZGVFbnVtLkFHRU5UX0NIQVRcbiAgICAgICAgICAgICAgICAgICAgICA/IHQoJ3R5cGVzLmFnZW50JywgeyBuczogJ2FwcCcgfSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGFwcERldGFpbC5tb2RlID09PSBBcHBNb2RlRW51bS5DSEFUXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHQoJ3R5cGVzLmNoYXRib3QnLCB7IG5zOiAnYXBwJyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBhcHBEZXRhaWwubW9kZSA9PT0gQXBwTW9kZUVudW0uQ09NUExFVElPTlxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IHQoJ3R5cGVzLmNvbXBsZXRpb24nLCB7IG5zOiAnYXBwJyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IHQoJ3R5cGVzLndvcmtmbG93JywgeyBuczogJ2FwcCcgfSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApfVxuICAgICAgPENvbnRlbnREaWFsb2dcbiAgICAgICAgc2hvdz17b25seVNob3dEZXRhaWwgPyBvcGVuU3RhdGUgOiBvcGVufVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICBvbkRldGFpbEV4cGFuZD8uKGZhbHNlKVxuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMiBsZWZ0LTIgdG9wLTIgZmxleCB3LVs0MjBweF0gZmxleC1jb2wgcm91bmRlZC0yeGwgIXAtMFwiXG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzaHJpbmstMCBmbGV4LWNvbCBpdGVtcy1zdGFydCBqdXN0aWZ5LWNlbnRlciBnYXAtMyBzZWxmLXN0cmV0Y2ggcC00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBzZWxmLXN0cmV0Y2hcIj5cbiAgICAgICAgICAgIDxBcHBJY29uXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIGljb25UeXBlPXthcHBEZXRhaWwuaWNvbl90eXBlfVxuICAgICAgICAgICAgICBpY29uPXthcHBEZXRhaWwuaWNvbn1cbiAgICAgICAgICAgICAgYmFja2dyb3VuZD17YXBwRGV0YWlsLmljb25fYmFja2dyb3VuZH1cbiAgICAgICAgICAgICAgaW1hZ2VVcmw9e2FwcERldGFpbC5pY29uX3VybH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC0xIGZsZXgtY29sIGl0ZW1zLXN0YXJ0IGp1c3RpZnktY2VudGVyIG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1tZC1zZW1pYm9sZCB3LWZ1bGwgdHJ1bmNhdGUgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnthcHBEZXRhaWwubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tMnhzLW1lZGl1bS11cHBlcmNhc2UgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e2FwcERldGFpbC5tb2RlID09PSBBcHBNb2RlRW51bS5BRFZBTkNFRF9DSEFUID8gdCgndHlwZXMuYWR2YW5jZWQnLCB7IG5zOiAnYXBwJyB9KSA6IGFwcERldGFpbC5tb2RlID09PSBBcHBNb2RlRW51bS5BR0VOVF9DSEFUID8gdCgndHlwZXMuYWdlbnQnLCB7IG5zOiAnYXBwJyB9KSA6IGFwcERldGFpbC5tb2RlID09PSBBcHBNb2RlRW51bS5DSEFUID8gdCgndHlwZXMuY2hhdGJvdCcsIHsgbnM6ICdhcHAnIH0pIDogYXBwRGV0YWlsLm1vZGUgPT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04gPyB0KCd0eXBlcy5jb21wbGV0aW9uJywgeyBuczogJ2FwcCcgfSkgOiB0KCd0eXBlcy53b3JrZmxvdycsIHsgbnM6ICdhcHAnIH0pfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgey8qIGRlc2NyaXB0aW9uICovfVxuICAgICAgICAgIHthcHBEZXRhaWwuZGVzY3JpcHRpb24gJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciBvdmVyZmxvdy13cmFwLWFueXdoZXJlIG1heC1oLVsxMDVweF0gdy1mdWxsIG1heC13LWZ1bGwgb3ZlcmZsb3cteS1hdXRvIHdoaXRlc3BhY2Utbm9ybWFsIGJyZWFrLXdvcmRzIHRleHQtdGV4dC10ZXJ0aWFyeVwiPnthcHBEZXRhaWwuZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7Lyogb3BlcmF0aW9ucyAqL31cbiAgICAgICAgICA8QXBwT3BlcmF0aW9uc1xuICAgICAgICAgICAgZ2FwPXs0fVxuICAgICAgICAgICAgcHJpbWFyeU9wZXJhdGlvbnM9e3ByaW1hcnlPcGVyYXRpb25zfVxuICAgICAgICAgICAgc2Vjb25kYXJ5T3BlcmF0aW9ucz17c2Vjb25kYXJ5T3BlcmF0aW9uc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPENhcmRWaWV3XG4gICAgICAgICAgYXBwSWQ9e2FwcERldGFpbC5pZH1cbiAgICAgICAgICBpc0luUGFuZWw9e3RydWV9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBmbGV4LTEgZmxleC1jb2wgZ2FwLTIgb3ZlcmZsb3ctYXV0byBweC0yIHB5LTFcIlxuICAgICAgICAvPlxuICAgICAgICB7LyogU3dpdGNoIG9wZXJhdGlvbiAoaWYgYXZhaWxhYmxlKSAqL31cbiAgICAgICAge3N3aXRjaE9wZXJhdGlvbiAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IG1pbi1oLWZpdCBzaHJpbmstMCBmbGV4LWNvbCBpdGVtcy1zdGFydCBqdXN0aWZ5LWNlbnRlciBnYXAtMyBzZWxmLXN0cmV0Y2ggcGItMlwiPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBzaXplPVwibWVkaXVtXCJcbiAgICAgICAgICAgICAgdmFyaWFudD1cImdob3N0XCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2FwLTAuNVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3N3aXRjaE9wZXJhdGlvbi5vbkNsaWNrfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7c3dpdGNoT3BlcmF0aW9uLmljb259XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3N3aXRjaE9wZXJhdGlvbi50aXRsZX08L3NwYW4+XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvQ29udGVudERpYWxvZz5cbiAgICAgIHtzaG93U3dpdGNoTW9kYWwgJiYgKFxuICAgICAgICA8U3dpdGNoQXBwTW9kYWxcbiAgICAgICAgICBpbkFwcERldGFpbFxuICAgICAgICAgIHNob3c9e3Nob3dTd2l0Y2hNb2RhbH1cbiAgICAgICAgICBhcHBEZXRhaWw9e2FwcERldGFpbH1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRTaG93U3dpdGNoTW9kYWwoZmFsc2UpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17KCkgPT4gc2V0U2hvd1N3aXRjaE1vZGFsKGZhbHNlKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7c2hvd0VkaXRNb2RhbCAmJiAoXG4gICAgICAgIDxDcmVhdGVBcHBNb2RhbFxuICAgICAgICAgIGlzRWRpdE1vZGFsXG4gICAgICAgICAgYXBwTmFtZT17YXBwRGV0YWlsLm5hbWV9XG4gICAgICAgICAgYXBwSWNvblR5cGU9e2FwcERldGFpbC5pY29uX3R5cGV9XG4gICAgICAgICAgYXBwSWNvbj17YXBwRGV0YWlsLmljb259XG4gICAgICAgICAgYXBwSWNvbkJhY2tncm91bmQ9e2FwcERldGFpbC5pY29uX2JhY2tncm91bmR9XG4gICAgICAgICAgYXBwSWNvblVybD17YXBwRGV0YWlsLmljb25fdXJsfVxuICAgICAgICAgIGFwcERlc2NyaXB0aW9uPXthcHBEZXRhaWwuZGVzY3JpcHRpb259XG4gICAgICAgICAgYXBwTW9kZT17YXBwRGV0YWlsLm1vZGV9XG4gICAgICAgICAgYXBwVXNlSWNvbkFzQW5zd2VySWNvbj17YXBwRGV0YWlsLnVzZV9pY29uX2FzX2Fuc3dlcl9pY29ufVxuICAgICAgICAgIG1heF9hY3RpdmVfcmVxdWVzdHM9e2FwcERldGFpbC5tYXhfYWN0aXZlX3JlcXVlc3RzID8/IG51bGx9XG4gICAgICAgICAgc2hvdz17c2hvd0VkaXRNb2RhbH1cbiAgICAgICAgICBvbkNvbmZpcm09e29uRWRpdH1cbiAgICAgICAgICBvbkhpZGU9eygpID0+IHNldFNob3dFZGl0TW9kYWwoZmFsc2UpfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtzaG93RHVwbGljYXRlTW9kYWwgJiYgKFxuICAgICAgICA8RHVwbGljYXRlQXBwTW9kYWxcbiAgICAgICAgICBhcHBOYW1lPXthcHBEZXRhaWwubmFtZX1cbiAgICAgICAgICBpY29uX3R5cGU9e2FwcERldGFpbC5pY29uX3R5cGV9XG4gICAgICAgICAgaWNvbj17YXBwRGV0YWlsLmljb259XG4gICAgICAgICAgaWNvbl9iYWNrZ3JvdW5kPXthcHBEZXRhaWwuaWNvbl9iYWNrZ3JvdW5kfVxuICAgICAgICAgIGljb25fdXJsPXthcHBEZXRhaWwuaWNvbl91cmx9XG4gICAgICAgICAgc2hvdz17c2hvd0R1cGxpY2F0ZU1vZGFsfVxuICAgICAgICAgIG9uQ29uZmlybT17b25Db3B5fVxuICAgICAgICAgIG9uSGlkZT17KCkgPT4gc2V0U2hvd0R1cGxpY2F0ZU1vZGFsKGZhbHNlKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7c2hvd0NvbmZpcm1EZWxldGUgJiYgKFxuICAgICAgICA8Q29uZmlybVxuICAgICAgICAgIHRpdGxlPXt0KCdkZWxldGVBcHBDb25maXJtVGl0bGUnLCB7IG5zOiAnYXBwJyB9KX1cbiAgICAgICAgICBjb250ZW50PXt0KCdkZWxldGVBcHBDb25maXJtQ29udGVudCcsIHsgbnM6ICdhcHAnIH0pfVxuICAgICAgICAgIGlzU2hvdz17c2hvd0NvbmZpcm1EZWxldGV9XG4gICAgICAgICAgb25Db25maXJtPXtvbkNvbmZpcm1EZWxldGV9XG4gICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldFNob3dDb25maXJtRGVsZXRlKGZhbHNlKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7c2hvd0ltcG9ydERTTE1vZGFsICYmIChcbiAgICAgICAgPFVwZGF0ZURTTE1vZGFsXG4gICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldFNob3dJbXBvcnREU0xNb2RhbChmYWxzZSl9XG4gICAgICAgICAgb25CYWNrdXA9e2V4cG9ydENoZWNrfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtzZWNyZXRFbnZMaXN0Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8RFNMRXhwb3J0Q29uZmlybU1vZGFsXG4gICAgICAgICAgZW52TGlzdD17c2VjcmV0RW52TGlzdH1cbiAgICAgICAgICBvbkNvbmZpcm09e29uRXhwb3J0fVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFNlY3JldEVudkxpc3QoW10pfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtzaG93RXhwb3J0V2FybmluZyAmJiAoXG4gICAgICAgIDxDb25maXJtXG4gICAgICAgICAgdHlwZT1cImluZm9cIlxuICAgICAgICAgIGlzU2hvdz17c2hvd0V4cG9ydFdhcm5pbmd9XG4gICAgICAgICAgdGl0bGU9e3QoJ3NpZGViYXIuZXhwb3J0V2FybmluZycsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgY29udGVudD17dCgnc2lkZWJhci5leHBvcnRXYXJuaW5nRGVzYycsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgb25Db25maXJtPXtoYW5kbGVDb25maXJtRXhwb3J0fVxuICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiBzZXRTaG93RXhwb3J0V2FybmluZyhmYWxzZSl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQXBwSW5mbylcbiJdfQ==