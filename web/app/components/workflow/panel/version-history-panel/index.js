"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionHistoryPanel = void 0;
const react_1 = require("@remixicon/react");
const copy_to_clipboard_1 = require("copy-to-clipboard");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const version_info_modal_1 = require("@/app/components/app/app-publisher/version-info-modal");
const divider_1 = require("@/app/components/base/divider");
const toast_1 = require("@/app/components/base/toast");
const app_context_1 = require("@/context/app-context");
const use_workflow_1 = require("@/service/use-workflow");
const hooks_1 = require("../../hooks");
const hooks_store_1 = require("../../hooks-store");
const store_1 = require("../../store");
const types_1 = require("../../types");
const delete_confirm_modal_1 = require("./delete-confirm-modal");
const empty_1 = require("./empty");
const filter_1 = require("./filter");
const loading_1 = require("./loading");
const restore_confirm_modal_1 = require("./restore-confirm-modal");
const version_history_item_1 = require("./version-history-item");
const HISTORY_PER_PAGE = 10;
const INITIAL_PAGE = 1;
const VersionHistoryPanel = ({ getVersionListUrl, deleteVersionUrl, updateVersionUrl, latestVersionId, }) => {
    const [filterValue, setFilterValue] = (0, react_2.useState)(types_1.WorkflowVersionFilterOptions.all);
    const [isOnlyShowNamedVersions, setIsOnlyShowNamedVersions] = (0, react_2.useState)(false);
    const [operatedItem, setOperatedItem] = (0, react_2.useState)();
    const [restoreConfirmOpen, setRestoreConfirmOpen] = (0, react_2.useState)(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = (0, react_2.useState)(false);
    const [editModalOpen, setEditModalOpen] = (0, react_2.useState)(false);
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { handleSyncWorkflowDraft } = (0, hooks_1.useNodesSyncDraft)();
    const { handleRestoreFromPublishedWorkflow, handleLoadBackupDraft } = (0, hooks_1.useWorkflowRun)();
    const { handleExportDSL } = (0, hooks_1.useDSL)();
    const setShowWorkflowVersionHistoryPanel = (0, store_1.useStore)(s => s.setShowWorkflowVersionHistoryPanel);
    const currentVersion = (0, store_1.useStore)(s => s.currentVersion);
    const setCurrentVersion = (0, store_1.useStore)(s => s.setCurrentVersion);
    const userProfile = (0, app_context_1.useSelector)(s => s.userProfile);
    const configsMap = (0, hooks_store_1.useHooksStore)(s => s.configsMap);
    const invalidAllLastRun = (0, use_workflow_1.useInvalidAllLastRun)(configsMap?.flowType, configsMap?.flowId);
    const { deleteAllInspectVars, } = workflowStore.getState();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data: versionHistory, fetchNextPage, hasNextPage, isFetching, } = (0, use_workflow_1.useWorkflowVersionHistory)({
        url: getVersionListUrl || '',
        initialPage: INITIAL_PAGE,
        limit: HISTORY_PER_PAGE,
        userId: filterValue === types_1.WorkflowVersionFilterOptions.onlyYours ? userProfile.id : '',
        namedOnly: isOnlyShowNamedVersions,
    });
    const handleVersionClick = (0, react_2.useCallback)((item) => {
        if (item.id !== currentVersion?.id) {
            setCurrentVersion(item);
            if (item.version === types_1.WorkflowVersion.Draft)
                handleLoadBackupDraft();
            else
                handleRestoreFromPublishedWorkflow(item);
        }
    }, [currentVersion?.id, setCurrentVersion, handleLoadBackupDraft, handleRestoreFromPublishedWorkflow]);
    const handleNextPage = () => {
        if (hasNextPage)
            fetchNextPage();
    };
    const handleClose = () => {
        handleLoadBackupDraft();
        workflowStore.setState({ isRestoring: false });
        setShowWorkflowVersionHistoryPanel(false);
    };
    const handleClickFilterItem = (0, react_2.useCallback)((value) => {
        setFilterValue(value);
    }, []);
    const handleSwitch = (0, react_2.useCallback)((value) => {
        setIsOnlyShowNamedVersions(value);
    }, []);
    const handleResetFilter = (0, react_2.useCallback)(() => {
        setFilterValue(types_1.WorkflowVersionFilterOptions.all);
        setIsOnlyShowNamedVersions(false);
    }, []);
    const handleClickMenuItem = (0, react_2.useCallback)((item, operation) => {
        setOperatedItem(item);
        switch (operation) {
            case types_1.VersionHistoryContextMenuOptions.restore:
                setRestoreConfirmOpen(true);
                break;
            case types_1.VersionHistoryContextMenuOptions.edit:
                setEditModalOpen(true);
                break;
            case types_1.VersionHistoryContextMenuOptions.delete:
                setDeleteConfirmOpen(true);
                break;
            case types_1.VersionHistoryContextMenuOptions.copyId:
                (0, copy_to_clipboard_1.default)(item.id);
                toast_1.default.notify({
                    type: 'success',
                    message: t('versionHistory.action.copyIdSuccess', { ns: 'workflow' }),
                });
                break;
            case types_1.VersionHistoryContextMenuOptions.exportDSL:
                handleExportDSL?.(false, item.id);
                break;
        }
    }, [t, handleExportDSL]);
    const handleCancel = (0, react_2.useCallback)((operation) => {
        switch (operation) {
            case types_1.VersionHistoryContextMenuOptions.restore:
                setRestoreConfirmOpen(false);
                break;
            case types_1.VersionHistoryContextMenuOptions.edit:
                setEditModalOpen(false);
                break;
            case types_1.VersionHistoryContextMenuOptions.delete:
                setDeleteConfirmOpen(false);
                break;
        }
    }, []);
    const resetWorkflowVersionHistory = (0, use_workflow_1.useResetWorkflowVersionHistory)();
    const handleRestore = (0, react_2.useCallback)((item) => {
        setShowWorkflowVersionHistoryPanel(false);
        handleRestoreFromPublishedWorkflow(item);
        workflowStore.setState({ isRestoring: false });
        workflowStore.setState({ backupDraft: undefined });
        handleSyncWorkflowDraft(true, false, {
            onSuccess: () => {
                toast_1.default.notify({
                    type: 'success',
                    message: t('versionHistory.action.restoreSuccess', { ns: 'workflow' }),
                });
                deleteAllInspectVars();
                invalidAllLastRun();
            },
            onError: () => {
                toast_1.default.notify({
                    type: 'error',
                    message: t('versionHistory.action.restoreFailure', { ns: 'workflow' }),
                });
            },
            onSettled: () => {
                resetWorkflowVersionHistory();
            },
        });
    }, [setShowWorkflowVersionHistoryPanel, handleRestoreFromPublishedWorkflow, workflowStore, handleSyncWorkflowDraft, deleteAllInspectVars, invalidAllLastRun, t, resetWorkflowVersionHistory]);
    const { mutateAsync: deleteWorkflow } = (0, use_workflow_1.useDeleteWorkflow)();
    const handleDelete = (0, react_2.useCallback)(async (id) => {
        await deleteWorkflow(deleteVersionUrl?.(id) || '', {
            onSuccess: () => {
                setDeleteConfirmOpen(false);
                toast_1.default.notify({
                    type: 'success',
                    message: t('versionHistory.action.deleteSuccess', { ns: 'workflow' }),
                });
                resetWorkflowVersionHistory();
                deleteAllInspectVars();
                invalidAllLastRun();
            },
            onError: () => {
                toast_1.default.notify({
                    type: 'error',
                    message: t('versionHistory.action.deleteFailure', { ns: 'workflow' }),
                });
            },
            onSettled: () => {
                setDeleteConfirmOpen(false);
            },
        });
    }, [deleteWorkflow, t, resetWorkflowVersionHistory, deleteAllInspectVars, invalidAllLastRun, deleteVersionUrl]);
    const { mutateAsync: updateWorkflow } = (0, use_workflow_1.useUpdateWorkflow)();
    const handleUpdateWorkflow = (0, react_2.useCallback)(async (params) => {
        const { id, ...rest } = params;
        await updateWorkflow({
            url: updateVersionUrl?.(id || '') || '',
            ...rest,
        }, {
            onSuccess: () => {
                setEditModalOpen(false);
                toast_1.default.notify({
                    type: 'success',
                    message: t('versionHistory.action.updateSuccess', { ns: 'workflow' }),
                });
                resetWorkflowVersionHistory();
            },
            onError: () => {
                toast_1.default.notify({
                    type: 'error',
                    message: t('versionHistory.action.updateFailure', { ns: 'workflow' }),
                });
            },
            onSettled: () => {
                setEditModalOpen(false);
            },
        });
    }, [t, updateWorkflow, resetWorkflowVersionHistory, updateVersionUrl]);
    return (<div className="flex h-full w-[268px] flex-col rounded-l-2xl border-y-[0.5px] border-l-[0.5px] border-components-panel-border bg-components-panel-bg shadow-xl shadow-shadow-shadow-5">
      <div className="flex items-center gap-x-2 px-4 pt-3">
        <div className="system-xl-semibold flex-1 py-1 text-text-primary">{t('versionHistory.title', { ns: 'workflow' })}</div>
        <filter_1.default filterValue={filterValue} isOnlyShowNamedVersions={isOnlyShowNamedVersions} onClickFilterItem={handleClickFilterItem} handleSwitch={handleSwitch}/>
        <divider_1.default type="vertical" className="mx-1 h-3.5"/>
        <div className="flex h-6 w-6 cursor-pointer items-center justify-center p-0.5" onClick={handleClose}>
          <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
        </div>
      </div>
      <div className="flex h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {(isFetching && !versionHistory?.pages?.length)
            ? (<loading_1.default />)
            : (<>
                  {versionHistory?.pages?.map((page, pageNumber) => (page.items?.map((item, idx) => {
                    const isLast = pageNumber === versionHistory.pages.length - 1 && idx === page.items.length - 1;
                    return (<version_history_item_1.default key={item.id} item={item} currentVersion={currentVersion} latestVersionId={latestVersionId || ''} onClick={handleVersionClick} handleClickMenuItem={handleClickMenuItem.bind(null, item)} isLast={isLast}/>);
                })))}
                  {!isFetching && (!versionHistory?.pages?.length || !versionHistory.pages[0].items.length) && (<empty_1.default onResetFilter={handleResetFilter}/>)}
                </>)}
        </div>
        {hasNextPage && (<div className="p-2">
            <div className="flex cursor-pointer items-center gap-x-1" onClick={handleNextPage}>
              <div className="item-center flex justify-center p-0.5">
                {isFetching
                ? <react_1.RiLoader2Line className="h-3.5 w-3.5 animate-spin text-text-accent"/>
                : <react_1.RiArrowDownDoubleLine className="h-3.5 w-3.5 text-text-accent"/>}
              </div>
              <div className="system-xs-medium-uppercase py-[1px] text-text-accent">
                {t('common.loadMore', { ns: 'workflow' })}
              </div>
            </div>
          </div>)}
      </div>
      {restoreConfirmOpen && (<restore_confirm_modal_1.default isOpen={restoreConfirmOpen} versionInfo={operatedItem} onClose={handleCancel.bind(null, types_1.VersionHistoryContextMenuOptions.restore)} onRestore={handleRestore}/>)}
      {deleteConfirmOpen && (<delete_confirm_modal_1.default isOpen={deleteConfirmOpen} versionInfo={operatedItem} onClose={handleCancel.bind(null, types_1.VersionHistoryContextMenuOptions.delete)} onDelete={handleDelete}/>)}
      {editModalOpen && (<version_info_modal_1.default isOpen={editModalOpen} versionInfo={operatedItem} onClose={handleCancel.bind(null, types_1.VersionHistoryContextMenuOptions.edit)} onPublish={handleUpdateWorkflow}/>)}
    </div>);
};
exports.VersionHistoryPanel = VersionHistoryPanel;
exports.default = React.memo(exports.VersionHistoryPanel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBRVosNENBQW9GO0FBQ3BGLHlEQUFvQztBQUNwQywrQkFBOEI7QUFDOUIsaUNBQTZDO0FBQzdDLGlEQUE4QztBQUM5Qyw4RkFBb0Y7QUFDcEYsMkRBQW1EO0FBQ25ELHVEQUErQztBQUMvQyx1REFBNEU7QUFDNUUseURBQThKO0FBQzlKLHVDQUF1RTtBQUN2RSxtREFBaUQ7QUFDakQsdUNBQXdEO0FBQ3hELHVDQUE2RztBQUM3RyxpRUFBdUQ7QUFDdkQsbUNBQTJCO0FBQzNCLHFDQUE2QjtBQUM3Qix1Q0FBK0I7QUFDL0IsbUVBQXlEO0FBQ3pELGlFQUF1RDtBQUV2RCxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtBQUMzQixNQUFNLFlBQVksR0FBRyxDQUFDLENBQUE7QUFRZixNQUFNLG1CQUFtQixHQUFHLENBQUMsRUFDbEMsaUJBQWlCLEVBQ2pCLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsZUFBZSxHQUNVLEVBQUUsRUFBRTtJQUM3QixNQUFNLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxvQ0FBNEIsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNoRixNQUFNLENBQUMsdUJBQXVCLEVBQUUsMEJBQTBCLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDN0UsTUFBTSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxJQUFBLGdCQUFRLEdBQWtCLENBQUE7SUFDbEUsTUFBTSxDQUFDLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25FLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxvQkFBb0IsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FB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QUFXLENBQUMsQ0FBQyxZQUFhLENBQUMsQ0FDM0IsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsd0NBQWdDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FDM0UsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQ3pCLENBQ0gsQ0FDRDtNQUFBLENBQUMsaUJBQWlCLElBQUksQ0FDcEIsQ0FBQyw4QkFBa0IsQ0FDakIsTUFBTSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FDMUIsV0FBVyxDQUFDLENBQUMsWUFBYSxDQUFDLENBQzNCLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLHdDQUFnQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQzFFLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUN2QixDQUNILENBQ0Q7TUFBQSxDQUFDLGFBQWEsSUFBSSxDQUNoQixDQUFDLDRCQUFnQixDQUNmLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUN0QixXQUFXLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDMUIsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsd0NBQWdDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDeEUsU0FBUyxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFDaEMsQ0FDSCxDQUNIO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBL1JZLFFBQUEsbUJBQW1CLHVCQStSL0I7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLDJCQUFtQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgVmVyc2lvbkhpc3RvcnkgfSBmcm9tICdAL3R5cGVzL3dvcmtmbG93J1xuaW1wb3J0IHsgUmlBcnJvd0Rvd25Eb3VibGVMaW5lLCBSaUNsb3NlTGluZSwgUmlMb2FkZXIyTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgY29weSBmcm9tICdjb3B5LXRvLWNsaXBib2FyZCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgVmVyc2lvbkluZm9Nb2RhbCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9hcHAtcHVibGlzaGVyL3ZlcnNpb24taW5mby1tb2RhbCdcbmltcG9ydCBEaXZpZGVyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9kaXZpZGVyJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IHVzZVNlbGVjdG9yIGFzIHVzZUFwcENvbnRleHRTZWxlY3RvciB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IHVzZURlbGV0ZVdvcmtmbG93LCB1c2VJbnZhbGlkQWxsTGFzdFJ1biwgdXNlUmVzZXRXb3JrZmxvd1ZlcnNpb25IaXN0b3J5LCB1c2VVcGRhdGVXb3JrZmxvdywgdXNlV29ya2Zsb3dWZXJzaW9uSGlzdG9yeSB9IGZyb20gJ0Avc2VydmljZS91c2Utd29ya2Zsb3cnXG5pbXBvcnQgeyB1c2VEU0wsIHVzZU5vZGVzU3luY0RyYWZ0LCB1c2VXb3JrZmxvd1J1biB9IGZyb20gJy4uLy4uL2hvb2tzJ1xuaW1wb3J0IHsgdXNlSG9va3NTdG9yZSB9IGZyb20gJy4uLy4uL2hvb2tzLXN0b3JlJ1xuaW1wb3J0IHsgdXNlU3RvcmUsIHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICcuLi8uLi9zdG9yZSdcbmltcG9ydCB7IFZlcnNpb25IaXN0b3J5Q29udGV4dE1lbnVPcHRpb25zLCBXb3JrZmxvd1ZlcnNpb24sIFdvcmtmbG93VmVyc2lvbkZpbHRlck9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCBEZWxldGVDb25maXJtTW9kYWwgZnJvbSAnLi9kZWxldGUtY29uZmlybS1tb2RhbCdcbmltcG9ydCBFbXB0eSBmcm9tICcuL2VtcHR5J1xuaW1wb3J0IEZpbHRlciBmcm9tICcuL2ZpbHRlcidcbmltcG9ydCBMb2FkaW5nIGZyb20gJy4vbG9hZGluZydcbmltcG9ydCBSZXN0b3JlQ29uZmlybU1vZGFsIGZyb20gJy4vcmVzdG9yZS1jb25maXJtLW1vZGFsJ1xuaW1wb3J0IFZlcnNpb25IaXN0b3J5SXRlbSBmcm9tICcuL3ZlcnNpb24taGlzdG9yeS1pdGVtJ1xuXG5jb25zdCBISVNUT1JZX1BFUl9QQUdFID0gMTBcbmNvbnN0IElOSVRJQUxfUEFHRSA9IDFcblxuZXhwb3J0IHR5cGUgVmVyc2lvbkhpc3RvcnlQYW5lbFByb3BzID0ge1xuICBnZXRWZXJzaW9uTGlzdFVybD86IHN0cmluZ1xuICBkZWxldGVWZXJzaW9uVXJsPzogKHZlcnNpb25JZDogc3RyaW5nKSA9PiBzdHJpbmdcbiAgdXBkYXRlVmVyc2lvblVybD86ICh2ZXJzaW9uSWQ6IHN0cmluZykgPT4gc3RyaW5nXG4gIGxhdGVzdFZlcnNpb25JZD86IHN0cmluZ1xufVxuZXhwb3J0IGNvbnN0IFZlcnNpb25IaXN0b3J5UGFuZWwgPSAoe1xuICBnZXRWZXJzaW9uTGlzdFVybCxcbiAgZGVsZXRlVmVyc2lvblVybCxcbiAgdXBkYXRlVmVyc2lvblVybCxcbiAgbGF0ZXN0VmVyc2lvbklkLFxufTogVmVyc2lvbkhpc3RvcnlQYW5lbFByb3BzKSA9PiB7XG4gIGNvbnN0IFtmaWx0ZXJWYWx1ZSwgc2V0RmlsdGVyVmFsdWVdID0gdXNlU3RhdGUoV29ya2Zsb3dWZXJzaW9uRmlsdGVyT3B0aW9ucy5hbGwpXG4gIGNvbnN0IFtpc09ubHlTaG93TmFtZWRWZXJzaW9ucywgc2V0SXNPbmx5U2hvd05hbWVkVmVyc2lvbnNdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtvcGVyYXRlZEl0ZW0sIHNldE9wZXJhdGVkSXRlbV0gPSB1c2VTdGF0ZTxWZXJzaW9uSGlzdG9yeT4oKVxuICBjb25zdCBbcmVzdG9yZUNvbmZpcm1PcGVuLCBzZXRSZXN0b3JlQ29uZmlybU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtkZWxldGVDb25maXJtT3Blbiwgc2V0RGVsZXRlQ29uZmlybU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtlZGl0TW9kYWxPcGVuLCBzZXRFZGl0TW9kYWxPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IHsgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQgfSA9IHVzZU5vZGVzU3luY0RyYWZ0KClcbiAgY29uc3QgeyBoYW5kbGVSZXN0b3JlRnJvbVB1Ymxpc2hlZFdvcmtmbG93LCBoYW5kbGVMb2FkQmFja3VwRHJhZnQgfSA9IHVzZVdvcmtmbG93UnVuKClcbiAgY29uc3QgeyBoYW5kbGVFeHBvcnREU0wgfSA9IHVzZURTTCgpXG4gIGNvbnN0IHNldFNob3dXb3JrZmxvd1ZlcnNpb25IaXN0b3J5UGFuZWwgPSB1c2VTdG9yZShzID0+IHMuc2V0U2hvd1dvcmtmbG93VmVyc2lvbkhpc3RvcnlQYW5lbClcbiAgY29uc3QgY3VycmVudFZlcnNpb24gPSB1c2VTdG9yZShzID0+IHMuY3VycmVudFZlcnNpb24pXG4gIGNvbnN0IHNldEN1cnJlbnRWZXJzaW9uID0gdXNlU3RvcmUocyA9PiBzLnNldEN1cnJlbnRWZXJzaW9uKVxuICBjb25zdCB1c2VyUHJvZmlsZSA9IHVzZUFwcENvbnRleHRTZWxlY3RvcihzID0+IHMudXNlclByb2ZpbGUpXG4gIGNvbnN0IGNvbmZpZ3NNYXAgPSB1c2VIb29rc1N0b3JlKHMgPT4gcy5jb25maWdzTWFwKVxuICBjb25zdCBpbnZhbGlkQWxsTGFzdFJ1biA9IHVzZUludmFsaWRBbGxMYXN0UnVuKGNvbmZpZ3NNYXA/LmZsb3dUeXBlLCBjb25maWdzTWFwPy5mbG93SWQpXG4gIGNvbnN0IHtcbiAgICBkZWxldGVBbGxJbnNwZWN0VmFycyxcbiAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICBjb25zdCB7XG4gICAgZGF0YTogdmVyc2lvbkhpc3RvcnksXG4gICAgZmV0Y2hOZXh0UGFnZSxcbiAgICBoYXNOZXh0UGFnZSxcbiAgICBpc0ZldGNoaW5nLFxuICB9ID0gdXNlV29ya2Zsb3dWZXJzaW9uSGlzdG9yeSh7XG4gICAgdXJsOiBnZXRWZXJzaW9uTGlzdFVybCB8fCAnJyxcbiAgICBpbml0aWFsUGFnZTogSU5JVElBTF9QQUdFLFxuICAgIGxpbWl0OiBISVNUT1JZX1BFUl9QQUdFLFxuICAgIHVzZXJJZDogZmlsdGVyVmFsdWUgPT09IFdvcmtmbG93VmVyc2lvbkZpbHRlck9wdGlvbnMub25seVlvdXJzID8gdXNlclByb2ZpbGUuaWQgOiAnJyxcbiAgICBuYW1lZE9ubHk6IGlzT25seVNob3dOYW1lZFZlcnNpb25zLFxuICB9KVxuXG4gIGNvbnN0IGhhbmRsZVZlcnNpb25DbGljayA9IHVzZUNhbGxiYWNrKChpdGVtOiBWZXJzaW9uSGlzdG9yeSkgPT4ge1xuICAgIGlmIChpdGVtLmlkICE9PSBjdXJyZW50VmVyc2lvbj8uaWQpIHtcbiAgICAgIHNldEN1cnJlbnRWZXJzaW9uKGl0ZW0pXG4gICAgICBpZiAoaXRlbS52ZXJzaW9uID09PSBXb3JrZmxvd1ZlcnNpb24uRHJhZnQpXG4gICAgICAgIGhhbmRsZUxvYWRCYWNrdXBEcmFmdCgpXG4gICAgICBlbHNlXG4gICAgICAgIGhhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3coaXRlbSlcbiAgICB9XG4gIH0sIFtjdXJyZW50VmVyc2lvbj8uaWQsIHNldEN1cnJlbnRWZXJzaW9uLCBoYW5kbGVMb2FkQmFja3VwRHJhZnQsIGhhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3ddKVxuXG4gIGNvbnN0IGhhbmRsZU5leHRQYWdlID0gKCkgPT4ge1xuICAgIGlmIChoYXNOZXh0UGFnZSlcbiAgICAgIGZldGNoTmV4dFBhZ2UoKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ2xvc2UgPSAoKSA9PiB7XG4gICAgaGFuZGxlTG9hZEJhY2t1cERyYWZ0KClcbiAgICB3b3JrZmxvd1N0b3JlLnNldFN0YXRlKHsgaXNSZXN0b3Jpbmc6IGZhbHNlIH0pXG4gICAgc2V0U2hvd1dvcmtmbG93VmVyc2lvbkhpc3RvcnlQYW5lbChmYWxzZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZUNsaWNrRmlsdGVySXRlbSA9IHVzZUNhbGxiYWNrKCh2YWx1ZTogV29ya2Zsb3dWZXJzaW9uRmlsdGVyT3B0aW9ucykgPT4ge1xuICAgIHNldEZpbHRlclZhbHVlKHZhbHVlKVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTd2l0Y2ggPSB1c2VDYWxsYmFjaygodmFsdWU6IGJvb2xlYW4pID0+IHtcbiAgICBzZXRJc09ubHlTaG93TmFtZWRWZXJzaW9ucyh2YWx1ZSlcbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlUmVzZXRGaWx0ZXIgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0RmlsdGVyVmFsdWUoV29ya2Zsb3dWZXJzaW9uRmlsdGVyT3B0aW9ucy5hbGwpXG4gICAgc2V0SXNPbmx5U2hvd05hbWVkVmVyc2lvbnMoZmFsc2UpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUNsaWNrTWVudUl0ZW0gPSB1c2VDYWxsYmFjaygoaXRlbTogVmVyc2lvbkhpc3RvcnksIG9wZXJhdGlvbjogVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMpID0+IHtcbiAgICBzZXRPcGVyYXRlZEl0ZW0oaXRlbSlcbiAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgY2FzZSBWZXJzaW9uSGlzdG9yeUNvbnRleHRNZW51T3B0aW9ucy5yZXN0b3JlOlxuICAgICAgICBzZXRSZXN0b3JlQ29uZmlybU9wZW4odHJ1ZSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMuZWRpdDpcbiAgICAgICAgc2V0RWRpdE1vZGFsT3Blbih0cnVlKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBWZXJzaW9uSGlzdG9yeUNvbnRleHRNZW51T3B0aW9ucy5kZWxldGU6XG4gICAgICAgIHNldERlbGV0ZUNvbmZpcm1PcGVuKHRydWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFZlcnNpb25IaXN0b3J5Q29udGV4dE1lbnVPcHRpb25zLmNvcHlJZDpcbiAgICAgICAgY29weShpdGVtLmlkKVxuICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICBtZXNzYWdlOiB0KCd2ZXJzaW9uSGlzdG9yeS5hY3Rpb24uY29weUlkU3VjY2VzcycsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFZlcnNpb25IaXN0b3J5Q29udGV4dE1lbnVPcHRpb25zLmV4cG9ydERTTDpcbiAgICAgICAgaGFuZGxlRXhwb3J0RFNMPy4oZmFsc2UsIGl0ZW0uaWQpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9LCBbdCwgaGFuZGxlRXhwb3J0RFNMXSlcblxuICBjb25zdCBoYW5kbGVDYW5jZWwgPSB1c2VDYWxsYmFjaygob3BlcmF0aW9uOiBWZXJzaW9uSGlzdG9yeUNvbnRleHRNZW51T3B0aW9ucykgPT4ge1xuICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgICBjYXNlIFZlcnNpb25IaXN0b3J5Q29udGV4dE1lbnVPcHRpb25zLnJlc3RvcmU6XG4gICAgICAgIHNldFJlc3RvcmVDb25maXJtT3BlbihmYWxzZSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMuZWRpdDpcbiAgICAgICAgc2V0RWRpdE1vZGFsT3BlbihmYWxzZSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMuZGVsZXRlOlxuICAgICAgICBzZXREZWxldGVDb25maXJtT3BlbihmYWxzZSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IHJlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeSA9IHVzZVJlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeSgpXG5cbiAgY29uc3QgaGFuZGxlUmVzdG9yZSA9IHVzZUNhbGxiYWNrKChpdGVtOiBWZXJzaW9uSGlzdG9yeSkgPT4ge1xuICAgIHNldFNob3dXb3JrZmxvd1ZlcnNpb25IaXN0b3J5UGFuZWwoZmFsc2UpXG4gICAgaGFuZGxlUmVzdG9yZUZyb21QdWJsaXNoZWRXb3JrZmxvdyhpdGVtKVxuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBpc1Jlc3RvcmluZzogZmFsc2UgfSlcbiAgICB3b3JrZmxvd1N0b3JlLnNldFN0YXRlKHsgYmFja3VwRHJhZnQ6IHVuZGVmaW5lZCB9KVxuICAgIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KHRydWUsIGZhbHNlLCB7XG4gICAgICBvblN1Y2Nlc3M6ICgpID0+IHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgbWVzc2FnZTogdCgndmVyc2lvbkhpc3RvcnkuYWN0aW9uLnJlc3RvcmVTdWNjZXNzJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgICAgfSlcbiAgICAgICAgZGVsZXRlQWxsSW5zcGVjdFZhcnMoKVxuICAgICAgICBpbnZhbGlkQWxsTGFzdFJ1bigpXG4gICAgICB9LFxuICAgICAgb25FcnJvcjogKCkgPT4ge1xuICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogdCgndmVyc2lvbkhpc3RvcnkuYWN0aW9uLnJlc3RvcmVGYWlsdXJlJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBvblNldHRsZWQ6ICgpID0+IHtcbiAgICAgICAgcmVzZXRXb3JrZmxvd1ZlcnNpb25IaXN0b3J5KClcbiAgICAgIH0sXG4gICAgfSlcbiAgfSwgW3NldFNob3dXb3JrZmxvd1ZlcnNpb25IaXN0b3J5UGFuZWwsIGhhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3csIHdvcmtmbG93U3RvcmUsIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0LCBkZWxldGVBbGxJbnNwZWN0VmFycywgaW52YWxpZEFsbExhc3RSdW4sIHQsIHJlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeV0pXG5cbiAgY29uc3QgeyBtdXRhdGVBc3luYzogZGVsZXRlV29ya2Zsb3cgfSA9IHVzZURlbGV0ZVdvcmtmbG93KClcblxuICBjb25zdCBoYW5kbGVEZWxldGUgPSB1c2VDYWxsYmFjayhhc3luYyAoaWQ6IHN0cmluZykgPT4ge1xuICAgIGF3YWl0IGRlbGV0ZVdvcmtmbG93KGRlbGV0ZVZlcnNpb25Vcmw/LihpZCkgfHwgJycsIHtcbiAgICAgIG9uU3VjY2VzczogKCkgPT4ge1xuICAgICAgICBzZXREZWxldGVDb25maXJtT3BlbihmYWxzZSlcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgbWVzc2FnZTogdCgndmVyc2lvbkhpc3RvcnkuYWN0aW9uLmRlbGV0ZVN1Y2Nlc3MnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICB9KVxuICAgICAgICByZXNldFdvcmtmbG93VmVyc2lvbkhpc3RvcnkoKVxuICAgICAgICBkZWxldGVBbGxJbnNwZWN0VmFycygpXG4gICAgICAgIGludmFsaWRBbGxMYXN0UnVuKClcbiAgICAgIH0sXG4gICAgICBvbkVycm9yOiAoKSA9PiB7XG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiB0KCd2ZXJzaW9uSGlzdG9yeS5hY3Rpb24uZGVsZXRlRmFpbHVyZScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgb25TZXR0bGVkOiAoKSA9PiB7XG4gICAgICAgIHNldERlbGV0ZUNvbmZpcm1PcGVuKGZhbHNlKVxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbZGVsZXRlV29ya2Zsb3csIHQsIHJlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeSwgZGVsZXRlQWxsSW5zcGVjdFZhcnMsIGludmFsaWRBbGxMYXN0UnVuLCBkZWxldGVWZXJzaW9uVXJsXSlcblxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiB1cGRhdGVXb3JrZmxvdyB9ID0gdXNlVXBkYXRlV29ya2Zsb3coKVxuXG4gIGNvbnN0IGhhbmRsZVVwZGF0ZVdvcmtmbG93ID0gdXNlQ2FsbGJhY2soYXN5bmMgKHBhcmFtczogeyBpZD86IHN0cmluZywgdGl0bGU6IHN0cmluZywgcmVsZWFzZU5vdGVzOiBzdHJpbmcgfSkgPT4ge1xuICAgIGNvbnN0IHsgaWQsIC4uLnJlc3QgfSA9IHBhcmFtc1xuICAgIGF3YWl0IHVwZGF0ZVdvcmtmbG93KHtcbiAgICAgIHVybDogdXBkYXRlVmVyc2lvblVybD8uKGlkIHx8ICcnKSB8fCAnJyxcbiAgICAgIC4uLnJlc3QsXG4gICAgfSwge1xuICAgICAgb25TdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgIHNldEVkaXRNb2RhbE9wZW4oZmFsc2UpXG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIG1lc3NhZ2U6IHQoJ3ZlcnNpb25IaXN0b3J5LmFjdGlvbi51cGRhdGVTdWNjZXNzJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVzZXRXb3JrZmxvd1ZlcnNpb25IaXN0b3J5KClcbiAgICAgIH0sXG4gICAgICBvbkVycm9yOiAoKSA9PiB7XG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiB0KCd2ZXJzaW9uSGlzdG9yeS5hY3Rpb24udXBkYXRlRmFpbHVyZScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgb25TZXR0bGVkOiAoKSA9PiB7XG4gICAgICAgIHNldEVkaXRNb2RhbE9wZW4oZmFsc2UpXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFt0LCB1cGRhdGVXb3JrZmxvdywgcmVzZXRXb3JrZmxvd1ZlcnNpb25IaXN0b3J5LCB1cGRhdGVWZXJzaW9uVXJsXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgdy1bMjY4cHhdIGZsZXgtY29sIHJvdW5kZWQtbC0yeGwgYm9yZGVyLXktWzAuNXB4XSBib3JkZXItbC1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHNoYWRvdy14bCBzaGFkb3ctc2hhZG93LXNoYWRvdy01XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC14LTIgcHgtNCBwdC0zXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhsLXNlbWlib2xkIGZsZXgtMSBweS0xIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoJ3ZlcnNpb25IaXN0b3J5LnRpdGxlJywgeyBuczogJ3dvcmtmbG93JyB9KX08L2Rpdj5cbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIGZpbHRlclZhbHVlPXtmaWx0ZXJWYWx1ZX1cbiAgICAgICAgICBpc09ubHlTaG93TmFtZWRWZXJzaW9ucz17aXNPbmx5U2hvd05hbWVkVmVyc2lvbnN9XG4gICAgICAgICAgb25DbGlja0ZpbHRlckl0ZW09e2hhbmRsZUNsaWNrRmlsdGVySXRlbX1cbiAgICAgICAgICBoYW5kbGVTd2l0Y2g9e2hhbmRsZVN3aXRjaH1cbiAgICAgICAgLz5cbiAgICAgICAgPERpdmlkZXIgdHlwZT1cInZlcnRpY2FsXCIgY2xhc3NOYW1lPVwibXgtMSBoLTMuNVwiIC8+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtNiB3LTYgY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMC41XCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDbG9zZX1cbiAgICAgICAgPlxuICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC0wIGZsZXgtMSBmbGV4LWNvbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBvdmVyZmxvdy15LWF1dG8gcHgtMyBweS0yXCI+XG4gICAgICAgICAgeyhpc0ZldGNoaW5nICYmICF2ZXJzaW9uSGlzdG9yeT8ucGFnZXM/Lmxlbmd0aClcbiAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgIDxMb2FkaW5nIC8+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICB7dmVyc2lvbkhpc3Rvcnk/LnBhZ2VzPy5tYXAoKHBhZ2UsIHBhZ2VOdW1iZXIpID0+IChcbiAgICAgICAgICAgICAgICAgICAgcGFnZS5pdGVtcz8ubWFwKChpdGVtLCBpZHgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0xhc3QgPSBwYWdlTnVtYmVyID09PSB2ZXJzaW9uSGlzdG9yeS5wYWdlcy5sZW5ndGggLSAxICYmIGlkeCA9PT0gcGFnZS5pdGVtcy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxWZXJzaW9uSGlzdG9yeUl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmVyc2lvbj17Y3VycmVudFZlcnNpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxhdGVzdFZlcnNpb25JZD17bGF0ZXN0VmVyc2lvbklkIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVWZXJzaW9uQ2xpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUNsaWNrTWVudUl0ZW09e2hhbmRsZUNsaWNrTWVudUl0ZW0uYmluZChudWxsLCBpdGVtKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNMYXN0PXtpc0xhc3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgeyFpc0ZldGNoaW5nICYmICghdmVyc2lvbkhpc3Rvcnk/LnBhZ2VzPy5sZW5ndGggfHwgIXZlcnNpb25IaXN0b3J5LnBhZ2VzWzBdLml0ZW1zLmxlbmd0aCkgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8RW1wdHkgb25SZXNldEZpbHRlcj17aGFuZGxlUmVzZXRGaWx0ZXJ9IC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2hhc05leHRQYWdlICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMlwiPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBnYXAteC0xXCJcbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlTmV4dFBhZ2V9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1jZW50ZXIgZmxleCBqdXN0aWZ5LWNlbnRlciBwLTAuNVwiPlxuICAgICAgICAgICAgICAgIHtpc0ZldGNoaW5nXG4gICAgICAgICAgICAgICAgICA/IDxSaUxvYWRlcjJMaW5lIGNsYXNzTmFtZT1cImgtMy41IHctMy41IGFuaW1hdGUtc3BpbiB0ZXh0LXRleHQtYWNjZW50XCIgLz5cbiAgICAgICAgICAgICAgICAgIDogPFJpQXJyb3dEb3duRG91YmxlTGluZSBjbGFzc05hbWU9XCJoLTMuNSB3LTMuNSB0ZXh0LXRleHQtYWNjZW50XCIgLz59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0tdXBwZXJjYXNlIHB5LVsxcHhdIHRleHQtdGV4dC1hY2NlbnRcIj5cbiAgICAgICAgICAgICAgICB7dCgnY29tbW9uLmxvYWRNb3JlJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAge3Jlc3RvcmVDb25maXJtT3BlbiAmJiAoXG4gICAgICAgIDxSZXN0b3JlQ29uZmlybU1vZGFsXG4gICAgICAgICAgaXNPcGVuPXtyZXN0b3JlQ29uZmlybU9wZW59XG4gICAgICAgICAgdmVyc2lvbkluZm89e29wZXJhdGVkSXRlbSF9XG4gICAgICAgICAgb25DbG9zZT17aGFuZGxlQ2FuY2VsLmJpbmQobnVsbCwgVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMucmVzdG9yZSl9XG4gICAgICAgICAgb25SZXN0b3JlPXtoYW5kbGVSZXN0b3JlfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtkZWxldGVDb25maXJtT3BlbiAmJiAoXG4gICAgICAgIDxEZWxldGVDb25maXJtTW9kYWxcbiAgICAgICAgICBpc09wZW49e2RlbGV0ZUNvbmZpcm1PcGVufVxuICAgICAgICAgIHZlcnNpb25JbmZvPXtvcGVyYXRlZEl0ZW0hfVxuICAgICAgICAgIG9uQ2xvc2U9e2hhbmRsZUNhbmNlbC5iaW5kKG51bGwsIFZlcnNpb25IaXN0b3J5Q29udGV4dE1lbnVPcHRpb25zLmRlbGV0ZSl9XG4gICAgICAgICAgb25EZWxldGU9e2hhbmRsZURlbGV0ZX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7ZWRpdE1vZGFsT3BlbiAmJiAoXG4gICAgICAgIDxWZXJzaW9uSW5mb01vZGFsXG4gICAgICAgICAgaXNPcGVuPXtlZGl0TW9kYWxPcGVufVxuICAgICAgICAgIHZlcnNpb25JbmZvPXtvcGVyYXRlZEl0ZW19XG4gICAgICAgICAgb25DbG9zZT17aGFuZGxlQ2FuY2VsLmJpbmQobnVsbCwgVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMuZWRpdCl9XG4gICAgICAgICAgb25QdWJsaXNoPXtoYW5kbGVVcGRhdGVXb3JrZmxvd31cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhWZXJzaW9uSGlzdG9yeVBhbmVsKVxuIl19