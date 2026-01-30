"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const dynamic_1 = require("next/dynamic");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const type_selector_1 = require("@/app/components/app/type-selector");
const app_icon_1 = require("@/app/components/base/app-icon");
const divider_1 = require("@/app/components/base/divider");
const popover_1 = require("@/app/components/base/popover");
const selector_1 = require("@/app/components/base/tag-management/selector");
const toast_1 = require("@/app/components/base/toast");
const tooltip_1 = require("@/app/components/base/tooltip");
const config_1 = require("@/config");
const app_context_1 = require("@/context/app-context");
const global_public_context_1 = require("@/context/global-public-context");
const provider_context_1 = require("@/context/provider-context");
const use_async_window_open_1 = require("@/hooks/use-async-window-open");
const access_control_1 = require("@/models/access-control");
const access_control_2 = require("@/service/access-control");
const apps_1 = require("@/service/apps");
const explore_1 = require("@/service/explore");
const workflow_1 = require("@/service/workflow");
const app_1 = require("@/types/app");
const app_redirection_1 = require("@/utils/app-redirection");
const classnames_1 = require("@/utils/classnames");
const time_1 = require("@/utils/time");
const var_1 = require("@/utils/var");
const EditAppModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/explore/create-app-modal')), {
    ssr: false,
});
const DuplicateAppModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/app/duplicate-modal')), {
    ssr: false,
});
const SwitchAppModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/app/switch-app-modal')), {
    ssr: false,
});
const Confirm = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/base/confirm')), {
    ssr: false,
});
const DSLExportConfirmModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/workflow/dsl-export-confirm-modal')), {
    ssr: false,
});
const AccessControl = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/app/app-access-control')), {
    ssr: false,
});
const AppCard = ({ app, onRefresh }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const { isCurrentWorkspaceEditor } = (0, app_context_1.useAppContext)();
    const { onPlanInfoChanged } = (0, provider_context_1.useProviderContext)();
    const { push } = (0, navigation_1.useRouter)();
    const openAsyncWindow = (0, use_async_window_open_1.useAsyncWindowOpen)();
    const [showEditModal, setShowEditModal] = (0, react_2.useState)(false);
    const [showDuplicateModal, setShowDuplicateModal] = (0, react_2.useState)(false);
    const [showSwitchModal, setShowSwitchModal] = (0, react_2.useState)(false);
    const [showConfirmDelete, setShowConfirmDelete] = (0, react_2.useState)(false);
    const [showAccessControl, setShowAccessControl] = (0, react_2.useState)(false);
    const [secretEnvList, setSecretEnvList] = (0, react_2.useState)([]);
    const onConfirmDelete = (0, react_2.useCallback)(async () => {
        try {
            await (0, apps_1.deleteApp)(app.id);
            notify({ type: 'success', message: t('appDeleted', { ns: 'app' }) });
            if (onRefresh)
                onRefresh();
            onPlanInfoChanged();
        }
        catch (e) {
            notify({
                type: 'error',
                message: `${t('appDeleteFailed', { ns: 'app' })}${'message' in e ? `: ${e.message}` : ''}`,
            });
        }
        setShowConfirmDelete(false);
    }, [app.id, notify, onPlanInfoChanged, onRefresh, t]);
    const onEdit = (0, react_2.useCallback)(async ({ name, icon_type, icon, icon_background, description, use_icon_as_answer_icon, max_active_requests, }) => {
        try {
            await (0, apps_1.updateAppInfo)({
                appID: app.id,
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
            if (onRefresh)
                onRefresh();
        }
        catch (e) {
            notify({
                type: 'error',
                message: e.message || t('editFailed', { ns: 'app' }),
            });
        }
    }, [app.id, notify, onRefresh, t]);
    const onCopy = async ({ name, icon_type, icon, icon_background }) => {
        try {
            const newApp = await (0, apps_1.copyApp)({
                appID: app.id,
                name,
                icon_type,
                icon,
                icon_background,
                mode: app.mode,
            });
            setShowDuplicateModal(false);
            notify({
                type: 'success',
                message: t('newApp.appCreated', { ns: 'app' }),
            });
            localStorage.setItem(config_1.NEED_REFRESH_APP_LIST_KEY, '1');
            if (onRefresh)
                onRefresh();
            onPlanInfoChanged();
            (0, app_redirection_1.getRedirection)(isCurrentWorkspaceEditor, newApp, push);
        }
        catch {
            notify({ type: 'error', message: t('newApp.appCreateFailed', { ns: 'app' }) });
        }
    };
    const onExport = async (include = false) => {
        try {
            const { data } = await (0, apps_1.exportAppConfig)({
                appID: app.id,
                include,
            });
            const a = document.createElement('a');
            const file = new Blob([data], { type: 'application/yaml' });
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = `${app.name}.yml`;
            a.click();
            URL.revokeObjectURL(url);
        }
        catch {
            notify({ type: 'error', message: t('exportFailed', { ns: 'app' }) });
        }
    };
    const exportCheck = async () => {
        if (app.mode !== app_1.AppModeEnum.WORKFLOW && app.mode !== app_1.AppModeEnum.ADVANCED_CHAT) {
            onExport();
            return;
        }
        try {
            const workflowDraft = await (0, workflow_1.fetchWorkflowDraft)(`/apps/${app.id}/workflows/draft`);
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
    const onSwitch = () => {
        if (onRefresh)
            onRefresh();
        setShowSwitchModal(false);
    };
    const onUpdateAccessControl = (0, react_2.useCallback)(() => {
        if (onRefresh)
            onRefresh();
        setShowAccessControl(false);
    }, [onRefresh, setShowAccessControl]);
    const Operations = (props) => {
        const { data: userCanAccessApp, isLoading: isGettingUserCanAccessApp } = (0, access_control_2.useGetUserCanAccessApp)({ appId: app?.id, enabled: (!!props?.open && systemFeatures.webapp_auth.enabled) });
        const onMouseLeave = async () => {
            props.onClose?.();
        };
        const onClickSettings = async (e) => {
            e.stopPropagation();
            props.onClick?.();
            e.preventDefault();
            setShowEditModal(true);
        };
        const onClickDuplicate = async (e) => {
            e.stopPropagation();
            props.onClick?.();
            e.preventDefault();
            setShowDuplicateModal(true);
        };
        const onClickExport = async (e) => {
            e.stopPropagation();
            props.onClick?.();
            e.preventDefault();
            exportCheck();
        };
        const onClickSwitch = async (e) => {
            e.stopPropagation();
            props.onClick?.();
            e.preventDefault();
            setShowSwitchModal(true);
        };
        const onClickDelete = async (e) => {
            e.stopPropagation();
            props.onClick?.();
            e.preventDefault();
            setShowConfirmDelete(true);
        };
        const onClickAccessControl = async (e) => {
            e.stopPropagation();
            props.onClick?.();
            e.preventDefault();
            setShowAccessControl(true);
        };
        const onClickInstalledApp = async (e) => {
            e.stopPropagation();
            props.onClick?.();
            e.preventDefault();
            try {
                await openAsyncWindow(async () => {
                    const { installed_apps } = await (0, explore_1.fetchInstalledAppList)(app.id) || {};
                    if (installed_apps?.length > 0)
                        return `${var_1.basePath}/explore/installed/${installed_apps[0].id}`;
                    throw new Error('No app found in Explore');
                }, {
                    onError: (err) => {
                        toast_1.default.notify({ type: 'error', message: `${err.message || err}` });
                    },
                });
            }
            catch (e) {
                toast_1.default.notify({ type: 'error', message: `${e.message || e}` });
            }
        };
        return (<div className="relative flex w-full flex-col py-1" onMouseLeave={onMouseLeave}>
        <button type="button" className="mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 hover:bg-state-base-hover" onClick={onClickSettings}>
          <span className="system-sm-regular text-text-secondary">{t('editApp', { ns: 'app' })}</span>
        </button>
        <divider_1.default className="my-1"/>
        <button type="button" className="mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 hover:bg-state-base-hover" onClick={onClickDuplicate}>
          <span className="system-sm-regular text-text-secondary">{t('duplicate', { ns: 'app' })}</span>
        </button>
        <button type="button" className="mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 hover:bg-state-base-hover" onClick={onClickExport}>
          <span className="system-sm-regular text-text-secondary">{t('export', { ns: 'app' })}</span>
        </button>
        {(app.mode === app_1.AppModeEnum.COMPLETION || app.mode === app_1.AppModeEnum.CHAT) && (<>
            <divider_1.default className="my-1"/>
            <button type="button" className="mx-1 flex h-8 cursor-pointer items-center rounded-lg px-3 hover:bg-state-base-hover" onClick={onClickSwitch}>
              <span className="text-sm leading-5 text-text-secondary">{t('switch', { ns: 'app' })}</span>
            </button>
          </>)}
        {!app.has_draft_trigger && ((!systemFeatures.webapp_auth.enabled)
                ? (<>
                    <divider_1.default className="my-1"/>
                    <button type="button" className="mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 hover:bg-state-base-hover" onClick={onClickInstalledApp}>
                      <span className="system-sm-regular text-text-secondary">{t('openInExplore', { ns: 'app' })}</span>
                    </button>
                  </>)
                : !(isGettingUserCanAccessApp || !userCanAccessApp?.result) && (<>
                    <divider_1.default className="my-1"/>
                    <button type="button" className="mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 hover:bg-state-base-hover" onClick={onClickInstalledApp}>
                      <span className="system-sm-regular text-text-secondary">{t('openInExplore', { ns: 'app' })}</span>
                    </button>
                  </>))}
        <divider_1.default className="my-1"/>
        {systemFeatures.webapp_auth.enabled && isCurrentWorkspaceEditor && (<>
              <button type="button" className="mx-1 flex h-8 cursor-pointer items-center rounded-lg px-3 hover:bg-state-base-hover" onClick={onClickAccessControl}>
                <span className="text-sm leading-5 text-text-secondary">{t('accessControl', { ns: 'app' })}</span>
              </button>
              <divider_1.default className="my-1"/>
            </>)}
        <button type="button" className="group mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 py-[6px] hover:bg-state-destructive-hover" onClick={onClickDelete}>
          <span className="system-sm-regular text-text-secondary group-hover:text-text-destructive">
            {t('operation.delete', { ns: 'common' })}
          </span>
        </button>
      </div>);
    };
    const [tags, setTags] = (0, react_2.useState)(app.tags);
    (0, react_2.useEffect)(() => {
        setTags(app.tags);
    }, [app.tags]);
    const EditTimeText = (0, react_2.useMemo)(() => {
        const timeText = (0, time_1.formatTime)({
            date: (app.updated_at || app.created_at) * 1000,
            dateFormat: `${t('segment.dateTimeFormat', { ns: 'datasetDocuments' })}`,
        });
        return `${t('segment.editedAt', { ns: 'datasetDocuments' })} ${timeText}`;
    }, [app.updated_at, app.created_at]);
    return (<>
      <div onClick={(e) => {
            e.preventDefault();
            (0, app_redirection_1.getRedirection)(isCurrentWorkspaceEditor, app, push);
        }} className="group relative col-span-1 inline-flex h-[160px] cursor-pointer flex-col rounded-xl border-[1px] border-solid border-components-card-border bg-components-card-bg shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg">
        <div className="flex h-[66px] shrink-0 grow-0 items-center gap-3 px-[14px] pb-3 pt-[14px]">
          <div className="relative shrink-0">
            <app_icon_1.default size="large" iconType={app.icon_type} icon={app.icon} background={app.icon_background} imageUrl={app.icon_url}/>
            <type_selector_1.AppTypeIcon type={app.mode} wrapperClassName="absolute -bottom-0.5 -right-0.5 w-4 h-4 shadow-sm" className="h-3 w-3"/>
          </div>
          <div className="w-0 grow py-[1px]">
            <div className="flex items-center text-sm font-semibold leading-5 text-text-secondary">
              <div className="truncate" title={app.name}>{app.name}</div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium leading-[18px] text-text-tertiary">
              <div className="truncate" title={app.author_name}>{app.author_name}</div>
              <div>·</div>
              <div className="truncate" title={EditTimeText}>{EditTimeText}</div>
            </div>
          </div>
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            {app.access_mode === access_control_1.AccessMode.PUBLIC && (<tooltip_1.default asChild={false} popupContent={t('accessItemsDescription.anyone', { ns: 'app' })}>
                <react_1.RiGlobalLine className="h-4 w-4 text-text-quaternary"/>
              </tooltip_1.default>)}
            {app.access_mode === access_control_1.AccessMode.SPECIFIC_GROUPS_MEMBERS && (<tooltip_1.default asChild={false} popupContent={t('accessItemsDescription.specific', { ns: 'app' })}>
                <react_1.RiLockLine className="h-4 w-4 text-text-quaternary"/>
              </tooltip_1.default>)}
            {app.access_mode === access_control_1.AccessMode.ORGANIZATION && (<tooltip_1.default asChild={false} popupContent={t('accessItemsDescription.organization', { ns: 'app' })}>
                <react_1.RiBuildingLine className="h-4 w-4 text-text-quaternary"/>
              </tooltip_1.default>)}
            {app.access_mode === access_control_1.AccessMode.EXTERNAL_MEMBERS && (<tooltip_1.default asChild={false} popupContent={t('accessItemsDescription.external', { ns: 'app' })}>
                <react_1.RiVerifiedBadgeLine className="h-4 w-4 text-text-quaternary"/>
              </tooltip_1.default>)}
          </div>
        </div>
        <div className="title-wrapper h-[90px] px-[14px] text-xs leading-normal text-text-tertiary">
          <div className="line-clamp-2" title={app.description}>
            {app.description}
          </div>
        </div>
        <div className="absolute bottom-1 left-0 right-0 flex h-[42px] shrink-0 items-center pb-[6px] pl-[14px] pr-[6px] pt-1">
          {isCurrentWorkspaceEditor && (<>
              <div className={(0, classnames_1.cn)('flex w-0 grow items-center gap-1')} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}>
                <div className="mr-[41px] w-full grow group-hover:!mr-0">
                  <selector_1.default position="bl" type="app" targetID={app.id} value={tags.map(tag => tag.id)} selectedTags={tags} onCacheUpdate={setTags} onChange={onRefresh}/>
                </div>
              </div>
              <div className="mx-1 !hidden h-[14px] w-[1px] shrink-0 bg-divider-regular group-hover:!flex"/>
              <div className="!hidden shrink-0 group-hover:!flex">
                <popover_1.default htmlContent={<Operations />} position="br" trigger="click" btnElement={(<div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md">
                      <react_1.RiMoreFill className="h-4 w-4 text-text-tertiary"/>
                    </div>)} btnClassName={open => (0, classnames_1.cn)(open ? '!bg-state-base-hover !shadow-none' : '!bg-transparent', 'h-8 w-8 rounded-md border-none !p-2 hover:!bg-state-base-hover')} popupClassName={(app.mode === app_1.AppModeEnum.COMPLETION || app.mode === app_1.AppModeEnum.CHAT)
                ? '!w-[256px] translate-x-[-224px]'
                : '!w-[216px] translate-x-[-128px]'} className="!z-20 h-fit"/>
              </div>
            </>)}
        </div>
      </div>
      {showEditModal && (<EditAppModal isEditModal appName={app.name} appIconType={app.icon_type} appIcon={app.icon} appIconBackground={app.icon_background} appIconUrl={app.icon_url} appDescription={app.description} appMode={app.mode} appUseIconAsAnswerIcon={app.use_icon_as_answer_icon} max_active_requests={app.max_active_requests ?? null} show={showEditModal} onConfirm={onEdit} onHide={() => setShowEditModal(false)}/>)}
      {showDuplicateModal && (<DuplicateAppModal appName={app.name} icon_type={app.icon_type} icon={app.icon} icon_background={app.icon_background} icon_url={app.icon_url} show={showDuplicateModal} onConfirm={onCopy} onHide={() => setShowDuplicateModal(false)}/>)}
      {showSwitchModal && (<SwitchAppModal show={showSwitchModal} appDetail={app} onClose={() => setShowSwitchModal(false)} onSuccess={onSwitch}/>)}
      {showConfirmDelete && (<Confirm title={t('deleteAppConfirmTitle', { ns: 'app' })} content={t('deleteAppConfirmContent', { ns: 'app' })} isShow={showConfirmDelete} onConfirm={onConfirmDelete} onCancel={() => setShowConfirmDelete(false)}/>)}
      {secretEnvList.length > 0 && (<DSLExportConfirmModal envList={secretEnvList} onConfirm={onExport} onClose={() => setSecretEnvList([])}/>)}
      {showAccessControl && (<AccessControl app={app} onConfirm={onUpdateAccessControl} onClose={() => setShowAccessControl(false)}/>)}
    </>);
};
exports.default = React.memo(AppCard);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAtY2FyZC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFRWiw0Q0FBNEc7QUFDNUcsMENBQWtDO0FBQ2xDLGdEQUEyQztBQUMzQywrQkFBOEI7QUFDOUIsaUNBQWlFO0FBQ2pFLGlEQUE4QztBQUM5QywrREFBaUQ7QUFDakQsc0VBQWdFO0FBQ2hFLDZEQUFvRDtBQUNwRCwyREFBbUQ7QUFDbkQsMkRBQXlEO0FBQ3pELDRFQUF1RTtBQUN2RSx1REFBaUU7QUFDakUsMkRBQW1EO0FBQ25ELHFDQUFvRDtBQUNwRCx1REFBcUQ7QUFDckQsMkVBQXNFO0FBQ3RFLGlFQUErRDtBQUMvRCx5RUFBa0U7QUFDbEUsNERBQW9EO0FBQ3BELDZEQUFpRTtBQUNqRSx5Q0FBbUY7QUFDbkYsK0NBQXlEO0FBQ3pELGlEQUF1RDtBQUN2RCxxQ0FBeUM7QUFDekMsNkRBQXdEO0FBQ3hELG1EQUF1QztBQUN2Qyx1Q0FBeUM7QUFDekMscUNBQXNDO0FBRXRDLE1BQU0sWUFBWSxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsMkNBQTJDLEVBQUMsRUFBRTtJQUN0RixHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUNGLE1BQU0saUJBQWlCLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSxzQ0FBc0MsRUFBQyxFQUFFO0lBQ3RGLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxjQUFjLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSx1Q0FBdUMsRUFBQyxFQUFFO0lBQ3BGLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSwrQkFBK0IsRUFBQyxFQUFFO0lBQ3JFLEdBQUcsRUFBRSxLQUFL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QUEsQ0FBQyxpQkFBaUIsSUFBSSxDQUNwQixDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUcsQ0FDMUcsQ0FDSDtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgdHlwZSB7IER1cGxpY2F0ZUFwcE1vZGFsUHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9kdXBsaWNhdGUtbW9kYWwnXG5pbXBvcnQgdHlwZSB7IEh0bWxDb250ZW50UHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcG9wb3ZlcidcbmltcG9ydCB0eXBlIHsgVGFnIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RhZy1tYW5hZ2VtZW50L2NvbnN0YW50J1xuaW1wb3J0IHR5cGUgeyBDcmVhdGVBcHBNb2RhbFByb3BzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9leHBsb3JlL2NyZWF0ZS1hcHAtbW9kYWwnXG5pbXBvcnQgdHlwZSB7IEVudmlyb25tZW50VmFyaWFibGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IFJpQnVpbGRpbmdMaW5lLCBSaUdsb2JhbExpbmUsIFJpTG9ja0xpbmUsIFJpTW9yZUZpbGwsIFJpVmVyaWZpZWRCYWRnZUxpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IGR5bmFtaWMgZnJvbSAnbmV4dC9keW5hbWljJ1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuaW1wb3J0IHsgQXBwVHlwZUljb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC90eXBlLXNlbGVjdG9yJ1xuaW1wb3J0IEFwcEljb24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FwcC1pY29uJ1xuaW1wb3J0IERpdmlkZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2RpdmlkZXInXG5pbXBvcnQgQ3VzdG9tUG9wb3ZlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcG9wb3ZlcidcbmltcG9ydCBUYWdTZWxlY3RvciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdGFnLW1hbmFnZW1lbnQvc2VsZWN0b3InXG5pbXBvcnQgVG9hc3QsIHsgVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Rvb2x0aXAnXG5pbXBvcnQgeyBORUVEX1JFRlJFU0hfQVBQX0xJU1RfS0VZIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlR2xvYmFsUHVibGljU3RvcmUgfSBmcm9tICdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0J1xuaW1wb3J0IHsgdXNlUHJvdmlkZXJDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VBc3luY1dpbmRvd09wZW4gfSBmcm9tICdAL2hvb2tzL3VzZS1hc3luYy13aW5kb3ctb3BlbidcbmltcG9ydCB7IEFjY2Vzc01vZGUgfSBmcm9tICdAL21vZGVscy9hY2Nlc3MtY29udHJvbCdcbmltcG9ydCB7IHVzZUdldFVzZXJDYW5BY2Nlc3NBcHAgfSBmcm9tICdAL3NlcnZpY2UvYWNjZXNzLWNvbnRyb2wnXG5pbXBvcnQgeyBjb3B5QXBwLCBkZWxldGVBcHAsIGV4cG9ydEFwcENvbmZpZywgdXBkYXRlQXBwSW5mbyB9IGZyb20gJ0Avc2VydmljZS9hcHBzJ1xuaW1wb3J0IHsgZmV0Y2hJbnN0YWxsZWRBcHBMaXN0IH0gZnJvbSAnQC9zZXJ2aWNlL2V4cGxvcmUnXG5pbXBvcnQgeyBmZXRjaFdvcmtmbG93RHJhZnQgfSBmcm9tICdAL3NlcnZpY2Uvd29ya2Zsb3cnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgZ2V0UmVkaXJlY3Rpb24gfSBmcm9tICdAL3V0aWxzL2FwcC1yZWRpcmVjdGlvbidcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgZm9ybWF0VGltZSB9IGZyb20gJ0AvdXRpbHMvdGltZSdcbmltcG9ydCB7IGJhc2VQYXRoIH0gZnJvbSAnQC91dGlscy92YXInXG5cbmNvbnN0IEVkaXRBcHBNb2RhbCA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCdAL2FwcC9jb21wb25lbnRzL2V4cGxvcmUvY3JlYXRlLWFwcC1tb2RhbCcpLCB7XG4gIHNzcjogZmFsc2UsXG59KVxuY29uc3QgRHVwbGljYXRlQXBwTW9kYWwgPSBkeW5hbWljKCgpID0+IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy9hcHAvZHVwbGljYXRlLW1vZGFsJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5jb25zdCBTd2l0Y2hBcHBNb2RhbCA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCdAL2FwcC9jb21wb25lbnRzL2FwcC9zd2l0Y2gtYXBwLW1vZGFsJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5jb25zdCBDb25maXJtID0gZHluYW1pYygoKSA9PiBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jb25maXJtJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5jb25zdCBEU0xFeHBvcnRDb25maXJtTW9kYWwgPSBkeW5hbWljKCgpID0+IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9kc2wtZXhwb3J0LWNvbmZpcm0tbW9kYWwnKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IEFjY2Vzc0NvbnRyb2wgPSBkeW5hbWljKCgpID0+IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy9hcHAvYXBwLWFjY2Vzcy1jb250cm9sJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5cbmV4cG9ydCB0eXBlIEFwcENhcmRQcm9wcyA9IHtcbiAgYXBwOiBBcHBcbiAgb25SZWZyZXNoPzogKCkgPT4gdm9pZFxufVxuXG5jb25zdCBBcHBDYXJkID0gKHsgYXBwLCBvblJlZnJlc2ggfTogQXBwQ2FyZFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlQ29udGV4dChUb2FzdENvbnRleHQpXG4gIGNvbnN0IHN5c3RlbUZlYXR1cmVzID0gdXNlR2xvYmFsUHVibGljU3RvcmUocyA9PiBzLnN5c3RlbUZlYXR1cmVzKVxuICBjb25zdCB7IGlzQ3VycmVudFdvcmtzcGFjZUVkaXRvciB9ID0gdXNlQXBwQ29udGV4dCgpXG4gIGNvbnN0IHsgb25QbGFuSW5mb0NoYW5nZWQgfSA9IHVzZVByb3ZpZGVyQ29udGV4dCgpXG4gIGNvbnN0IHsgcHVzaCB9ID0gdXNlUm91dGVyKClcbiAgY29uc3Qgb3BlbkFzeW5jV2luZG93ID0gdXNlQXN5bmNXaW5kb3dPcGVuKClcblxuICBjb25zdCBbc2hvd0VkaXRNb2RhbCwgc2V0U2hvd0VkaXRNb2RhbF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3Nob3dEdXBsaWNhdGVNb2RhbCwgc2V0U2hvd0R1cGxpY2F0ZU1vZGFsXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2hvd1N3aXRjaE1vZGFsLCBzZXRTaG93U3dpdGNoTW9kYWxdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpXG4gIGNvbnN0IFtzaG93Q29uZmlybURlbGV0ZSwgc2V0U2hvd0NvbmZpcm1EZWxldGVdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93QWNjZXNzQ29udHJvbCwgc2V0U2hvd0FjY2Vzc0NvbnRyb2xdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzZWNyZXRFbnZMaXN0LCBzZXRTZWNyZXRFbnZMaXN0XSA9IHVzZVN0YXRlPEVudmlyb25tZW50VmFyaWFibGVbXT4oW10pXG5cbiAgY29uc3Qgb25Db25maXJtRGVsZXRlID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkZWxldGVBcHAoYXBwLmlkKVxuICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhcHBEZWxldGVkJywgeyBuczogJ2FwcCcgfSkgfSlcbiAgICAgIGlmIChvblJlZnJlc2gpXG4gICAgICAgIG9uUmVmcmVzaCgpXG4gICAgICBvblBsYW5JbmZvQ2hhbmdlZCgpXG4gICAgfVxuICAgIGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIG5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGAke3QoJ2FwcERlbGV0ZUZhaWxlZCcsIHsgbnM6ICdhcHAnIH0pfSR7J21lc3NhZ2UnIGluIGUgPyBgOiAke2UubWVzc2FnZX1gIDogJyd9YCxcbiAgICAgIH0pXG4gICAgfVxuICAgIHNldFNob3dDb25maXJtRGVsZXRlKGZhbHNlKVxuICB9LCBbYXBwLmlkLCBub3RpZnksIG9uUGxhbkluZm9DaGFuZ2VkLCBvblJlZnJlc2gsIHRdKVxuXG4gIGNvbnN0IG9uRWRpdDogQ3JlYXRlQXBwTW9kYWxQcm9wc1snb25Db25maXJtJ10gPSB1c2VDYWxsYmFjayhhc3luYyAoe1xuICAgIG5hbWUsXG4gICAgaWNvbl90eXBlLFxuICAgIGljb24sXG4gICAgaWNvbl9iYWNrZ3JvdW5kLFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIHVzZV9pY29uX2FzX2Fuc3dlcl9pY29uLFxuICAgIG1heF9hY3RpdmVfcmVxdWVzdHMsXG4gIH0pID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlQXBwSW5mbyh7XG4gICAgICAgIGFwcElEOiBhcHAuaWQsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIGljb25fdHlwZSxcbiAgICAgICAgaWNvbixcbiAgICAgICAgaWNvbl9iYWNrZ3JvdW5kLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgdXNlX2ljb25fYXNfYW5zd2VyX2ljb24sXG4gICAgICAgIG1heF9hY3RpdmVfcmVxdWVzdHMsXG4gICAgICB9KVxuICAgICAgc2V0U2hvd0VkaXRNb2RhbChmYWxzZSlcbiAgICAgIG5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogdCgnZWRpdERvbmUnLCB7IG5zOiAnYXBwJyB9KSxcbiAgICAgIH0pXG4gICAgICBpZiAob25SZWZyZXNoKVxuICAgICAgICBvblJlZnJlc2goKVxuICAgIH1cbiAgICBjYXRjaCAoZTogYW55KSB7XG4gICAgICBub3RpZnkoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UgfHwgdCgnZWRpdEZhaWxlZCcsIHsgbnM6ICdhcHAnIH0pLFxuICAgICAgfSlcbiAgICB9XG4gIH0sIFthcHAuaWQsIG5vdGlmeSwgb25SZWZyZXNoLCB0XSlcblxuICBjb25zdCBvbkNvcHk6IER1cGxpY2F0ZUFwcE1vZGFsUHJvcHNbJ29uQ29uZmlybSddID0gYXN5bmMgKHsgbmFtZSwgaWNvbl90eXBlLCBpY29uLCBpY29uX2JhY2tncm91bmQgfSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBuZXdBcHAgPSBhd2FpdCBjb3B5QXBwKHtcbiAgICAgICAgYXBwSUQ6IGFwcC5pZCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgaWNvbl90eXBlLFxuICAgICAgICBpY29uLFxuICAgICAgICBpY29uX2JhY2tncm91bmQsXG4gICAgICAgIG1vZGU6IGFwcC5tb2RlLFxuICAgICAgfSlcbiAgICAgIHNldFNob3dEdXBsaWNhdGVNb2RhbChmYWxzZSlcbiAgICAgIG5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogdCgnbmV3QXBwLmFwcENyZWF0ZWQnLCB7IG5zOiAnYXBwJyB9KSxcbiAgICAgIH0pXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShORUVEX1JFRlJFU0hfQVBQX0xJU1RfS0VZLCAnMScpXG4gICAgICBpZiAob25SZWZyZXNoKVxuICAgICAgICBvblJlZnJlc2goKVxuICAgICAgb25QbGFuSW5mb0NoYW5nZWQoKVxuICAgICAgZ2V0UmVkaXJlY3Rpb24oaXNDdXJyZW50V29ya3NwYWNlRWRpdG9yLCBuZXdBcHAsIHB1c2gpXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ25ld0FwcC5hcHBDcmVhdGVGYWlsZWQnLCB7IG5zOiAnYXBwJyB9KSB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uRXhwb3J0ID0gYXN5bmMgKGluY2x1ZGUgPSBmYWxzZSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGV4cG9ydEFwcENvbmZpZyh7XG4gICAgICAgIGFwcElEOiBhcHAuaWQsXG4gICAgICAgIGluY2x1ZGUsXG4gICAgICB9KVxuICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgICAgY29uc3QgZmlsZSA9IG5ldyBCbG9iKFtkYXRhXSwgeyB0eXBlOiAnYXBwbGljYXRpb24veWFtbCcgfSlcbiAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICAgIGEuaHJlZiA9IHVybFxuICAgICAgYS5kb3dubG9hZCA9IGAke2FwcC5uYW1lfS55bWxgXG4gICAgICBhLmNsaWNrKClcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKVxuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdleHBvcnRGYWlsZWQnLCB7IG5zOiAnYXBwJyB9KSB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGV4cG9ydENoZWNrID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmIChhcHAubW9kZSAhPT0gQXBwTW9kZUVudW0uV09SS0ZMT1cgJiYgYXBwLm1vZGUgIT09IEFwcE1vZGVFbnVtLkFEVkFOQ0VEX0NIQVQpIHtcbiAgICAgIG9uRXhwb3J0KClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3Qgd29ya2Zsb3dEcmFmdCA9IGF3YWl0IGZldGNoV29ya2Zsb3dEcmFmdChgL2FwcHMvJHthcHAuaWR9L3dvcmtmbG93cy9kcmFmdGApXG4gICAgICBjb25zdCBsaXN0ID0gKHdvcmtmbG93RHJhZnQuZW52aXJvbm1lbnRfdmFyaWFibGVzIHx8IFtdKS5maWx0ZXIoZW52ID0+IGVudi52YWx1ZV90eXBlID09PSAnc2VjcmV0JylcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBvbkV4cG9ydCgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgc2V0U2VjcmV0RW52TGlzdChsaXN0KVxuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdleHBvcnRGYWlsZWQnLCB7IG5zOiAnYXBwJyB9KSB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uU3dpdGNoID0gKCkgPT4ge1xuICAgIGlmIChvblJlZnJlc2gpXG4gICAgICBvblJlZnJlc2goKVxuICAgIHNldFNob3dTd2l0Y2hNb2RhbChmYWxzZSlcbiAgfVxuXG4gIGNvbnN0IG9uVXBkYXRlQWNjZXNzQ29udHJvbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAob25SZWZyZXNoKVxuICAgICAgb25SZWZyZXNoKClcbiAgICBzZXRTaG93QWNjZXNzQ29udHJvbChmYWxzZSlcbiAgfSwgW29uUmVmcmVzaCwgc2V0U2hvd0FjY2Vzc0NvbnRyb2xdKVxuXG4gIGNvbnN0IE9wZXJhdGlvbnMgPSAocHJvcHM6IEh0bWxDb250ZW50UHJvcHMpID0+IHtcbiAgICBjb25zdCB7IGRhdGE6IHVzZXJDYW5BY2Nlc3NBcHAsIGlzTG9hZGluZzogaXNHZXR0aW5nVXNlckNhbkFjY2Vzc0FwcCB9ID0gdXNlR2V0VXNlckNhbkFjY2Vzc0FwcCh7IGFwcElkOiBhcHA/LmlkLCBlbmFibGVkOiAoISFwcm9wcz8ub3BlbiAmJiBzeXN0ZW1GZWF0dXJlcy53ZWJhcHBfYXV0aC5lbmFibGVkKSB9KVxuICAgIGNvbnN0IG9uTW91c2VMZWF2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIHByb3BzLm9uQ2xvc2U/LigpXG4gICAgfVxuICAgIGNvbnN0IG9uQ2xpY2tTZXR0aW5ncyA9IGFzeW5jIChlOiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxCdXR0b25FbGVtZW50PikgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgcHJvcHMub25DbGljaz8uKClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgc2V0U2hvd0VkaXRNb2RhbCh0cnVlKVxuICAgIH1cbiAgICBjb25zdCBvbkNsaWNrRHVwbGljYXRlID0gYXN5bmMgKGU6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBwcm9wcy5vbkNsaWNrPy4oKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBzZXRTaG93RHVwbGljYXRlTW9kYWwodHJ1ZSlcbiAgICB9XG4gICAgY29uc3Qgb25DbGlja0V4cG9ydCA9IGFzeW5jIChlOiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxCdXR0b25FbGVtZW50PikgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgcHJvcHMub25DbGljaz8uKClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZXhwb3J0Q2hlY2soKVxuICAgIH1cbiAgICBjb25zdCBvbkNsaWNrU3dpdGNoID0gYXN5bmMgKGU6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBwcm9wcy5vbkNsaWNrPy4oKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBzZXRTaG93U3dpdGNoTW9kYWwodHJ1ZSlcbiAgICB9XG4gICAgY29uc3Qgb25DbGlja0RlbGV0ZSA9IGFzeW5jIChlOiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxCdXR0b25FbGVtZW50PikgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgcHJvcHMub25DbGljaz8uKClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgc2V0U2hvd0NvbmZpcm1EZWxldGUodHJ1ZSlcbiAgICB9XG4gICAgY29uc3Qgb25DbGlja0FjY2Vzc0NvbnRyb2wgPSBhc3luYyAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MQnV0dG9uRWxlbWVudD4pID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHByb3BzLm9uQ2xpY2s/LigpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHNldFNob3dBY2Nlc3NDb250cm9sKHRydWUpXG4gICAgfVxuICAgIGNvbnN0IG9uQ2xpY2tJbnN0YWxsZWRBcHAgPSBhc3luYyAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MQnV0dG9uRWxlbWVudD4pID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHByb3BzLm9uQ2xpY2s/LigpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IG9wZW5Bc3luY1dpbmRvdyhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBpbnN0YWxsZWRfYXBwcyB9OiBhbnkgPSBhd2FpdCBmZXRjaEluc3RhbGxlZEFwcExpc3QoYXBwLmlkKSB8fCB7fVxuICAgICAgICAgIGlmIChpbnN0YWxsZWRfYXBwcz8ubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldHVybiBgJHtiYXNlUGF0aH0vZXhwbG9yZS9pbnN0YWxsZWQvJHtpbnN0YWxsZWRfYXBwc1swXS5pZH1gXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhcHAgZm91bmQgaW4gRXhwbG9yZScpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBvbkVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBgJHtlcnIubWVzc2FnZSB8fCBlcnJ9YCB9KVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGAke2UubWVzc2FnZSB8fCBlfWAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCB3LWZ1bGwgZmxleC1jb2wgcHktMVwiIG9uTW91c2VMZWF2ZT17b25Nb3VzZUxlYXZlfT5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibXgtMSBmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC1sZyBweC0zIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIiBvbkNsaWNrPXtvbkNsaWNrU2V0dGluZ3N9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnZWRpdEFwcCcsIHsgbnM6ICdhcHAnIH0pfTwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxEaXZpZGVyIGNsYXNzTmFtZT1cIm15LTFcIiAvPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJteC0xIGZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWxnIHB4LTMgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiIG9uQ2xpY2s9e29uQ2xpY2tEdXBsaWNhdGV9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnZHVwbGljYXRlJywgeyBuczogJ2FwcCcgfSl9PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibXgtMSBmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC1sZyBweC0zIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIiBvbkNsaWNrPXtvbkNsaWNrRXhwb3J0fT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2V4cG9ydCcsIHsgbnM6ICdhcHAnIH0pfTwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIHsoYXBwLm1vZGUgPT09IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04gfHwgYXBwLm1vZGUgPT09IEFwcE1vZGVFbnVtLkNIQVQpICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPERpdmlkZXIgY2xhc3NOYW1lPVwibXktMVwiIC8+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJteC0xIGZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciByb3VuZGVkLWxnIHB4LTMgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tTd2l0Y2h9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gbGVhZGluZy01IHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnc3dpdGNoJywgeyBuczogJ2FwcCcgfSl9PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG4gICAgICAgIHtcbiAgICAgICAgICAhYXBwLmhhc19kcmFmdF90cmlnZ2VyICYmIChcbiAgICAgICAgICAgICghc3lzdGVtRmVhdHVyZXMud2ViYXBwX2F1dGguZW5hYmxlZClcbiAgICAgICAgICAgICAgPyAoXG4gICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICA8RGl2aWRlciBjbGFzc05hbWU9XCJteS0xXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibXgtMSBmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC1sZyBweC0zIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIiBvbkNsaWNrPXtvbkNsaWNrSW5zdGFsbGVkQXBwfT5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ29wZW5JbkV4cGxvcmUnLCB7IG5zOiAnYXBwJyB9KX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICA6ICEoaXNHZXR0aW5nVXNlckNhbkFjY2Vzc0FwcCB8fCAhdXNlckNhbkFjY2Vzc0FwcD8ucmVzdWx0KSAmJiAoXG4gICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICA8RGl2aWRlciBjbGFzc05hbWU9XCJteS0xXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibXgtMSBmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC1sZyBweC0zIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIiBvbkNsaWNrPXtvbkNsaWNrSW5zdGFsbGVkQXBwfT5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ29wZW5JbkV4cGxvcmUnLCB7IG5zOiAnYXBwJyB9KX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICA8RGl2aWRlciBjbGFzc05hbWU9XCJteS0xXCIgLz5cbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbUZlYXR1cmVzLndlYmFwcF9hdXRoLmVuYWJsZWQgJiYgaXNDdXJyZW50V29ya3NwYWNlRWRpdG9yICYmIChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm14LTEgZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIHJvdW5kZWQtbGcgcHgtMyBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCIgb25DbGljaz17b25DbGlja0FjY2Vzc0NvbnRyb2x9PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gbGVhZGluZy01IHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnYWNjZXNzQ29udHJvbCcsIHsgbnM6ICdhcHAnIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxEaXZpZGVyIGNsYXNzTmFtZT1cIm15LTFcIiAvPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJncm91cCBteC0xIGZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWxnIHB4LTMgcHktWzZweF0gaG92ZXI6Ymctc3RhdGUtZGVzdHJ1Y3RpdmUtaG92ZXJcIlxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tEZWxldGV9XG4gICAgICAgID5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5IGdyb3VwLWhvdmVyOnRleHQtdGV4dC1kZXN0cnVjdGl2ZVwiPlxuICAgICAgICAgICAge3QoJ29wZXJhdGlvbi5kZWxldGUnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgW3RhZ3MsIHNldFRhZ3NdID0gdXNlU3RhdGU8VGFnW10+KGFwcC50YWdzKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFRhZ3MoYXBwLnRhZ3MpXG4gIH0sIFthcHAudGFnc10pXG5cbiAgY29uc3QgRWRpdFRpbWVUZXh0ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgdGltZVRleHQgPSBmb3JtYXRUaW1lKHtcbiAgICAgIGRhdGU6IChhcHAudXBkYXRlZF9hdCB8fCBhcHAuY3JlYXRlZF9hdCkgKiAxMDAwLFxuICAgICAgZGF0ZUZvcm1hdDogYCR7dCgnc2VnbWVudC5kYXRlVGltZUZvcm1hdCcsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJyB9KX1gLFxuICAgIH0pXG4gICAgcmV0dXJuIGAke3QoJ3NlZ21lbnQuZWRpdGVkQXQnLCB7IG5zOiAnZGF0YXNldERvY3VtZW50cycgfSl9ICR7dGltZVRleHR9YFxuICB9LCBbYXBwLnVwZGF0ZWRfYXQsIGFwcC5jcmVhdGVkX2F0XSlcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2XG4gICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgZ2V0UmVkaXJlY3Rpb24oaXNDdXJyZW50V29ya3NwYWNlRWRpdG9yLCBhcHAsIHB1c2gpXG4gICAgICAgIH19XG4gICAgICAgIGNsYXNzTmFtZT1cImdyb3VwIHJlbGF0aXZlIGNvbC1zcGFuLTEgaW5saW5lLWZsZXggaC1bMTYwcHhdIGN1cnNvci1wb2ludGVyIGZsZXgtY29sIHJvdW5kZWQteGwgYm9yZGVyLVsxcHhdIGJvcmRlci1zb2xpZCBib3JkZXItY29tcG9uZW50cy1jYXJkLWJvcmRlciBiZy1jb21wb25lbnRzLWNhcmQtYmcgc2hhZG93LXNtIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTIwMCBlYXNlLWluLW91dCBob3ZlcjpzaGFkb3ctbGdcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1bNjZweF0gc2hyaW5rLTAgZ3Jvdy0wIGl0ZW1zLWNlbnRlciBnYXAtMyBweC1bMTRweF0gcGItMyBwdC1bMTRweF1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIHNocmluay0wXCI+XG4gICAgICAgICAgICA8QXBwSWNvblxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICBpY29uVHlwZT17YXBwLmljb25fdHlwZX1cbiAgICAgICAgICAgICAgaWNvbj17YXBwLmljb259XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ9e2FwcC5pY29uX2JhY2tncm91bmR9XG4gICAgICAgICAgICAgIGltYWdlVXJsPXthcHAuaWNvbl91cmx9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEFwcFR5cGVJY29uIHR5cGU9e2FwcC5tb2RlfSB3cmFwcGVyQ2xhc3NOYW1lPVwiYWJzb2x1dGUgLWJvdHRvbS0wLjUgLXJpZ2h0LTAuNSB3LTQgaC00IHNoYWRvdy1zbVwiIGNsYXNzTmFtZT1cImgtMyB3LTNcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0wIGdyb3cgcHktWzFweF1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgdGV4dC1zbSBmb250LXNlbWlib2xkIGxlYWRpbmctNSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJ1bmNhdGVcIiB0aXRsZT17YXBwLm5hbWV9PnthcHAubmFtZX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LVsxMHB4XSBmb250LW1lZGl1bSBsZWFkaW5nLVsxOHB4XSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cnVuY2F0ZVwiIHRpdGxlPXthcHAuYXV0aG9yX25hbWV9PnthcHAuYXV0aG9yX25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+wrc8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cnVuY2F0ZVwiIHRpdGxlPXtFZGl0VGltZVRleHR9PntFZGl0VGltZVRleHR9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC01IHctNSBzaHJpbmstMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICAgIHthcHAuYWNjZXNzX21vZGUgPT09IEFjY2Vzc01vZGUuUFVCTElDICYmIChcbiAgICAgICAgICAgICAgPFRvb2x0aXAgYXNDaGlsZD17ZmFsc2V9IHBvcHVwQ29udGVudD17dCgnYWNjZXNzSXRlbXNEZXNjcmlwdGlvbi5hbnlvbmUnLCB7IG5zOiAnYXBwJyB9KX0+XG4gICAgICAgICAgICAgICAgPFJpR2xvYmFsTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHthcHAuYWNjZXNzX21vZGUgPT09IEFjY2Vzc01vZGUuU1BFQ0lGSUNfR1JPVVBTX01FTUJFUlMgJiYgKFxuICAgICAgICAgICAgICA8VG9vbHRpcCBhc0NoaWxkPXtmYWxzZX0gcG9wdXBDb250ZW50PXt0KCdhY2Nlc3NJdGVtc0Rlc2NyaXB0aW9uLnNwZWNpZmljJywgeyBuczogJ2FwcCcgfSl9PlxuICAgICAgICAgICAgICAgIDxSaUxvY2tMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2FwcC5hY2Nlc3NfbW9kZSA9PT0gQWNjZXNzTW9kZS5PUkdBTklaQVRJT04gJiYgKFxuICAgICAgICAgICAgICA8VG9vbHRpcCBhc0NoaWxkPXtmYWxzZX0gcG9wdXBDb250ZW50PXt0KCdhY2Nlc3NJdGVtc0Rlc2NyaXB0aW9uLm9yZ2FuaXphdGlvbicsIHsgbnM6ICdhcHAnIH0pfT5cbiAgICAgICAgICAgICAgICA8UmlCdWlsZGluZ0xpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtcXVhdGVybmFyeVwiIC8+XG4gICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7YXBwLmFjY2Vzc19tb2RlID09PSBBY2Nlc3NNb2RlLkVYVEVSTkFMX01FTUJFUlMgJiYgKFxuICAgICAgICAgICAgICA8VG9vbHRpcCBhc0NoaWxkPXtmYWxzZX0gcG9wdXBDb250ZW50PXt0KCdhY2Nlc3NJdGVtc0Rlc2NyaXB0aW9uLmV4dGVybmFsJywgeyBuczogJ2FwcCcgfSl9PlxuICAgICAgICAgICAgICAgIDxSaVZlcmlmaWVkQmFkZ2VMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZS13cmFwcGVyIGgtWzkwcHhdIHB4LVsxNHB4XSB0ZXh0LXhzIGxlYWRpbmctbm9ybWFsIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImxpbmUtY2xhbXAtMlwiXG4gICAgICAgICAgICB0aXRsZT17YXBwLmRlc2NyaXB0aW9ufVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHthcHAuZGVzY3JpcHRpb259XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS0xIGxlZnQtMCByaWdodC0wIGZsZXggaC1bNDJweF0gc2hyaW5rLTAgaXRlbXMtY2VudGVyIHBiLVs2cHhdIHBsLVsxNHB4XSBwci1bNnB4XSBwdC0xXCI+XG4gICAgICAgICAge2lzQ3VycmVudFdvcmtzcGFjZUVkaXRvciAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbignZmxleCB3LTAgZ3JvdyBpdGVtcy1jZW50ZXIgZ2FwLTEnKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXItWzQxcHhdIHctZnVsbCBncm93IGdyb3VwLWhvdmVyOiFtci0wXCI+XG4gICAgICAgICAgICAgICAgICA8VGFnU2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb249XCJibFwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJhcHBcIlxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRJRD17YXBwLmlkfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGFncy5tYXAodGFnID0+IHRhZy5pZCl9XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkVGFncz17dGFnc31cbiAgICAgICAgICAgICAgICAgICAgb25DYWNoZVVwZGF0ZT17c2V0VGFnc31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uUmVmcmVzaH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14LTEgIWhpZGRlbiBoLVsxNHB4XSB3LVsxcHhdIHNocmluay0wIGJnLWRpdmlkZXItcmVndWxhciBncm91cC1ob3ZlcjohZmxleFwiIC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiIWhpZGRlbiBzaHJpbmstMCBncm91cC1ob3ZlcjohZmxleFwiPlxuICAgICAgICAgICAgICAgIDxDdXN0b21Qb3BvdmVyXG4gICAgICAgICAgICAgICAgICBodG1sQ29udGVudD17PE9wZXJhdGlvbnMgLz59XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbj1cImJyXCJcbiAgICAgICAgICAgICAgICAgIHRyaWdnZXI9XCJjbGlja1wiXG4gICAgICAgICAgICAgICAgICBidG5FbGVtZW50PXsoXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtOCB3LTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbWRcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFJpTW9yZUZpbGwgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICBidG5DbGFzc05hbWU9e29wZW4gPT5cbiAgICAgICAgICAgICAgICAgICAgY24oXG4gICAgICAgICAgICAgICAgICAgICAgb3BlbiA/ICchYmctc3RhdGUtYmFzZS1ob3ZlciAhc2hhZG93LW5vbmUnIDogJyFiZy10cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ2gtOCB3LTggcm91bmRlZC1tZCBib3JkZXItbm9uZSAhcC0yIGhvdmVyOiFiZy1zdGF0ZS1iYXNlLWhvdmVyJyxcbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIHBvcHVwQ2xhc3NOYW1lPXtcbiAgICAgICAgICAgICAgICAgICAgKGFwcC5tb2RlID09PSBBcHBNb2RlRW51bS5DT01QTEVUSU9OIHx8IGFwcC5tb2RlID09PSBBcHBNb2RlRW51bS5DSEFUKVxuICAgICAgICAgICAgICAgICAgICAgID8gJyF3LVsyNTZweF0gdHJhbnNsYXRlLXgtWy0yMjRweF0nXG4gICAgICAgICAgICAgICAgICAgICAgOiAnIXctWzIxNnB4XSB0cmFuc2xhdGUteC1bLTEyOHB4XSdcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIiF6LTIwIGgtZml0XCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7c2hvd0VkaXRNb2RhbCAmJiAoXG4gICAgICAgIDxFZGl0QXBwTW9kYWxcbiAgICAgICAgICBpc0VkaXRNb2RhbFxuICAgICAgICAgIGFwcE5hbWU9e2FwcC5uYW1lfVxuICAgICAgICAgIGFwcEljb25UeXBlPXthcHAuaWNvbl90eXBlfVxuICAgICAgICAgIGFwcEljb249e2FwcC5pY29ufVxuICAgICAgICAgIGFwcEljb25CYWNrZ3JvdW5kPXthcHAuaWNvbl9iYWNrZ3JvdW5kfVxuICAgICAgICAgIGFwcEljb25Vcmw9e2FwcC5pY29uX3VybH1cbiAgICAgICAgICBhcHBEZXNjcmlwdGlvbj17YXBwLmRlc2NyaXB0aW9ufVxuICAgICAgICAgIGFwcE1vZGU9e2FwcC5tb2RlfVxuICAgICAgICAgIGFwcFVzZUljb25Bc0Fuc3dlckljb249e2FwcC51c2VfaWNvbl9hc19hbnN3ZXJfaWNvbn1cbiAgICAgICAgICBtYXhfYWN0aXZlX3JlcXVlc3RzPXthcHAubWF4X2FjdGl2ZV9yZXF1ZXN0cyA/PyBudWxsfVxuICAgICAgICAgIHNob3c9e3Nob3dFZGl0TW9kYWx9XG4gICAgICAgICAgb25Db25maXJtPXtvbkVkaXR9XG4gICAgICAgICAgb25IaWRlPXsoKSA9PiBzZXRTaG93RWRpdE1vZGFsKGZhbHNlKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7c2hvd0R1cGxpY2F0ZU1vZGFsICYmIChcbiAgICAgICAgPER1cGxpY2F0ZUFwcE1vZGFsXG4gICAgICAgICAgYXBwTmFtZT17YXBwLm5hbWV9XG4gICAgICAgICAgaWNvbl90eXBlPXthcHAuaWNvbl90eXBlfVxuICAgICAgICAgIGljb249e2FwcC5pY29ufVxuICAgICAgICAgIGljb25fYmFja2dyb3VuZD17YXBwLmljb25fYmFja2dyb3VuZH1cbiAgICAgICAgICBpY29uX3VybD17YXBwLmljb25fdXJsfVxuICAgICAgICAgIHNob3c9e3Nob3dEdXBsaWNhdGVNb2RhbH1cbiAgICAgICAgICBvbkNvbmZpcm09e29uQ29weX1cbiAgICAgICAgICBvbkhpZGU9eygpID0+IHNldFNob3dEdXBsaWNhdGVNb2RhbChmYWxzZSl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge3Nob3dTd2l0Y2hNb2RhbCAmJiAoXG4gICAgICAgIDxTd2l0Y2hBcHBNb2RhbFxuICAgICAgICAgIHNob3c9e3Nob3dTd2l0Y2hNb2RhbH1cbiAgICAgICAgICBhcHBEZXRhaWw9e2FwcH1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRTaG93U3dpdGNoTW9kYWwoZmFsc2UpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17b25Td2l0Y2h9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge3Nob3dDb25maXJtRGVsZXRlICYmIChcbiAgICAgICAgPENvbmZpcm1cbiAgICAgICAgICB0aXRsZT17dCgnZGVsZXRlQXBwQ29uZmlybVRpdGxlJywgeyBuczogJ2FwcCcgfSl9XG4gICAgICAgICAgY29udGVudD17dCgnZGVsZXRlQXBwQ29uZmlybUNvbnRlbnQnLCB7IG5zOiAnYXBwJyB9KX1cbiAgICAgICAgICBpc1Nob3c9e3Nob3dDb25maXJtRGVsZXRlfVxuICAgICAgICAgIG9uQ29uZmlybT17b25Db25maXJtRGVsZXRlfVxuICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiBzZXRTaG93Q29uZmlybURlbGV0ZShmYWxzZSl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge3NlY3JldEVudkxpc3QubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxEU0xFeHBvcnRDb25maXJtTW9kYWxcbiAgICAgICAgICBlbnZMaXN0PXtzZWNyZXRFbnZMaXN0fVxuICAgICAgICAgIG9uQ29uZmlybT17b25FeHBvcnR9XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2VjcmV0RW52TGlzdChbXSl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge3Nob3dBY2Nlc3NDb250cm9sICYmIChcbiAgICAgICAgPEFjY2Vzc0NvbnRyb2wgYXBwPXthcHB9IG9uQ29uZmlybT17b25VcGRhdGVBY2Nlc3NDb250cm9sfSBvbkNsb3NlPXsoKSA9PiBzZXRTaG93QWNjZXNzQ29udHJvbChmYWxzZSl9IC8+XG4gICAgICApfVxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQXBwQ2FyZClcbiJdfQ==