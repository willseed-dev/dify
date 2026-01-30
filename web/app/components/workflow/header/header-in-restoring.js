"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const use_theme_1 = require("@/hooks/use-theme");
const use_workflow_1 = require("@/service/use-workflow");
const classnames_1 = require("@/utils/classnames");
const toast_1 = require("../../base/toast");
const hooks_1 = require("../hooks");
const hooks_store_1 = require("../hooks-store");
const store_1 = require("../store");
const types_1 = require("../types");
const restoring_title_1 = require("./restoring-title");
const HeaderInRestoring = ({ onRestoreSettled, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { theme } = (0, use_theme_1.default)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const configsMap = (0, hooks_store_1.useHooksStore)(s => s.configsMap);
    const invalidAllLastRun = (0, use_workflow_1.useInvalidAllLastRun)(configsMap?.flowType, configsMap?.flowId);
    const { deleteAllInspectVars, } = workflowStore.getState();
    const currentVersion = (0, store_1.useStore)(s => s.currentVersion);
    const setShowWorkflowVersionHistoryPanel = (0, store_1.useStore)(s => s.setShowWorkflowVersionHistoryPanel);
    const { handleLoadBackupDraft, } = (0, hooks_1.useWorkflowRun)();
    const { handleSyncWorkflowDraft } = (0, hooks_1.useNodesSyncDraft)();
    const handleCancelRestore = (0, react_2.useCallback)(() => {
        handleLoadBackupDraft();
        workflowStore.setState({ isRestoring: false });
        setShowWorkflowVersionHistoryPanel(false);
    }, [workflowStore, handleLoadBackupDraft, setShowWorkflowVersionHistoryPanel]);
    const handleRestore = (0, react_2.useCallback)(() => {
        setShowWorkflowVersionHistoryPanel(false);
        workflowStore.setState({ isRestoring: false });
        workflowStore.setState({ backupDraft: undefined });
        handleSyncWorkflowDraft(true, false, {
            onSuccess: () => {
                toast_1.default.notify({
                    type: 'success',
                    message: t('versionHistory.action.restoreSuccess', { ns: 'workflow' }),
                });
            },
            onError: () => {
                toast_1.default.notify({
                    type: 'error',
                    message: t('versionHistory.action.restoreFailure', { ns: 'workflow' }),
                });
            },
            onSettled: () => {
                onRestoreSettled?.();
            },
        });
        deleteAllInspectVars();
        invalidAllLastRun();
    }, [setShowWorkflowVersionHistoryPanel, workflowStore, handleSyncWorkflowDraft, deleteAllInspectVars, invalidAllLastRun, t, onRestoreSettled]);
    return (<>
      <div>
        <restoring_title_1.default />
      </div>
      <div className=" flex items-center justify-end gap-x-2">
        <button_1.default onClick={handleRestore} disabled={!currentVersion || currentVersion.version === types_1.WorkflowVersion.Draft} variant="primary" className={(0, classnames_1.cn)('rounded-lg border border-transparent', theme === 'dark' && 'border-black/5 bg-white/10 backdrop-blur-sm')}>
          {t('common.restore', { ns: 'workflow' })}
        </button_1.default>
        <button_1.default onClick={handleCancelRestore} className={(0, classnames_1.cn)('rounded-lg border border-transparent text-components-button-secondary-accent-text', theme === 'dark' && 'border-black/5 bg-white/10 backdrop-blur-sm')}>
          <div className="flex items-center gap-x-0.5">
            <react_1.RiHistoryLine className="h-4 w-4"/>
            <span className="px-0.5">{t('common.exitVersions', { ns: 'workflow' })}</span>
          </div>
        </button_1.default>
      </div>
    </>);
};
exports.default = HeaderInRestoring;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLWluLXJlc3RvcmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlYWRlci1pbi1yZXN0b3JpbmcudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQWdEO0FBQ2hELGlDQUVjO0FBQ2QsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCxpREFBd0M7QUFDeEMseURBQTZEO0FBQzdELG1EQUF1QztBQUN2Qyw0Q0FBb0M7QUFDcEMsb0NBR2lCO0FBQ2pCLGdEQUE4QztBQUM5QyxvQ0FHaUI7QUFDakIsb0NBRWlCO0FBQ2pCLHVEQUE4QztBQUs5QyxNQUFNLGlCQUFpQixHQUFHLENBQUMsRUFDekIsZ0JBQWdCLEdBQ08sRUFBRSxFQUFFO0lBQzNCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBQSxtQkFBUSxHQUFFLENBQUE7SUFDNUIsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQ3hDLE1BQU0sVUFBVSxHQUFHLElBQUEsMkJBQWEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNuRCxNQUFNLGlCQUFpQixHQUFHLElBQUEsbUNBQW9CLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDeEYsTUFBTSxFQUNKLG9CQUFvQixHQUNyQixHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUM1QixNQUFNLGNBQWMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDdEQsTUFBTSxrQ0FBa0MsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtJQUU5RixNQUFNLEVB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QUMsU0FBUyxDQUFDLFNBQVMsRUFDbEM7WUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQy9FO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLGdCQUFNLENBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsaUJBQWlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSaUhpc3RvcnlMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCB1c2VUaGVtZSBmcm9tICdAL2hvb2tzL3VzZS10aGVtZSdcbmltcG9ydCB7IHVzZUludmFsaWRBbGxMYXN0UnVuIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS13b3JrZmxvdydcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4uLy4uL2Jhc2UvdG9hc3QnXG5pbXBvcnQge1xuICB1c2VOb2Rlc1N5bmNEcmFmdCxcbiAgdXNlV29ya2Zsb3dSdW4sXG59IGZyb20gJy4uL2hvb2tzJ1xuaW1wb3J0IHsgdXNlSG9va3NTdG9yZSB9IGZyb20gJy4uL2hvb2tzLXN0b3JlJ1xuaW1wb3J0IHtcbiAgdXNlU3RvcmUsXG4gIHVzZVdvcmtmbG93U3RvcmUsXG59IGZyb20gJy4uL3N0b3JlJ1xuaW1wb3J0IHtcbiAgV29ya2Zsb3dWZXJzaW9uLFxufSBmcm9tICcuLi90eXBlcydcbmltcG9ydCBSZXN0b3JpbmdUaXRsZSBmcm9tICcuL3Jlc3RvcmluZy10aXRsZSdcblxuZXhwb3J0IHR5cGUgSGVhZGVySW5SZXN0b3JpbmdQcm9wcyA9IHtcbiAgb25SZXN0b3JlU2V0dGxlZD86ICgpID0+IHZvaWRcbn1cbmNvbnN0IEhlYWRlckluUmVzdG9yaW5nID0gKHtcbiAgb25SZXN0b3JlU2V0dGxlZCxcbn06IEhlYWRlckluUmVzdG9yaW5nUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCBjb25maWdzTWFwID0gdXNlSG9va3NTdG9yZShzID0+IHMuY29uZmlnc01hcClcbiAgY29uc3QgaW52YWxpZEFsbExhc3RSdW4gPSB1c2VJbnZhbGlkQWxsTGFzdFJ1bihjb25maWdzTWFwPy5mbG93VHlwZSwgY29uZmlnc01hcD8uZmxvd0lkKVxuICBjb25zdCB7XG4gICAgZGVsZXRlQWxsSW5zcGVjdFZhcnMsXG4gIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgY29uc3QgY3VycmVudFZlcnNpb24gPSB1c2VTdG9yZShzID0+IHMuY3VycmVudFZlcnNpb24pXG4gIGNvbnN0IHNldFNob3dXb3JrZmxvd1ZlcnNpb25IaXN0b3J5UGFuZWwgPSB1c2VTdG9yZShzID0+IHMuc2V0U2hvd1dvcmtmbG93VmVyc2lvbkhpc3RvcnlQYW5lbClcblxuICBjb25zdCB7XG4gICAgaGFuZGxlTG9hZEJhY2t1cERyYWZ0LFxuICB9ID0gdXNlV29ya2Zsb3dSdW4oKVxuICBjb25zdCB7IGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0IH0gPSB1c2VOb2Rlc1N5bmNEcmFmdCgpXG5cbiAgY29uc3QgaGFuZGxlQ2FuY2VsUmVzdG9yZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBoYW5kbGVMb2FkQmFja3VwRHJhZnQoKVxuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBpc1Jlc3RvcmluZzogZmFsc2UgfSlcbiAgICBzZXRTaG93V29ya2Zsb3dWZXJzaW9uSGlzdG9yeVBhbmVsKGZhbHNlKVxuICB9LCBbd29ya2Zsb3dTdG9yZSwgaGFuZGxlTG9hZEJhY2t1cERyYWZ0LCBzZXRTaG93V29ya2Zsb3dWZXJzaW9uSGlzdG9yeVBhbmVsXSlcblxuICBjb25zdCBoYW5kbGVSZXN0b3JlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldFNob3dXb3JrZmxvd1ZlcnNpb25IaXN0b3J5UGFuZWwoZmFsc2UpXG4gICAgd29ya2Zsb3dTdG9yZS5zZXRTdGF0ZSh7IGlzUmVzdG9yaW5nOiBmYWxzZSB9KVxuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBiYWNrdXBEcmFmdDogdW5kZWZpbmVkIH0pXG4gICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQodHJ1ZSwgZmFsc2UsIHtcbiAgICAgIG9uU3VjY2VzczogKCkgPT4ge1xuICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICBtZXNzYWdlOiB0KCd2ZXJzaW9uSGlzdG9yeS5hY3Rpb24ucmVzdG9yZVN1Y2Nlc3MnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIG9uRXJyb3I6ICgpID0+IHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IHQoJ3ZlcnNpb25IaXN0b3J5LmFjdGlvbi5yZXN0b3JlRmFpbHVyZScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgb25TZXR0bGVkOiAoKSA9PiB7XG4gICAgICAgIG9uUmVzdG9yZVNldHRsZWQ/LigpXG4gICAgICB9LFxuICAgIH0pXG4gICAgZGVsZXRlQWxsSW5zcGVjdFZhcnMoKVxuICAgIGludmFsaWRBbGxMYXN0UnVuKClcbiAgfSwgW3NldFNob3dXb3JrZmxvd1ZlcnNpb25IaXN0b3J5UGFuZWwsIHdvcmtmbG93U3RvcmUsIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0LCBkZWxldGVBbGxJbnNwZWN0VmFycywgaW52YWxpZEFsbExhc3RSdW4sIHQsIG9uUmVzdG9yZVNldHRsZWRdKVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxSZXN0b3JpbmdUaXRsZSAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAteC0yXCI+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZXN0b3JlfVxuICAgICAgICAgIGRpc2FibGVkPXshY3VycmVudFZlcnNpb24gfHwgY3VycmVudFZlcnNpb24udmVyc2lvbiA9PT0gV29ya2Zsb3dWZXJzaW9uLkRyYWZ0fVxuICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcbiAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgJ3JvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudCcsXG4gICAgICAgICAgICB0aGVtZSA9PT0gJ2RhcmsnICYmICdib3JkZXItYmxhY2svNSBiZy13aGl0ZS8xMCBiYWNrZHJvcC1ibHVyLXNtJyxcbiAgICAgICAgICApfVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ2NvbW1vbi5yZXN0b3JlJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDYW5jZWxSZXN0b3JlfVxuICAgICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAncm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXRyYW5zcGFyZW50IHRleHQtY29tcG9uZW50cy1idXR0b24tc2Vjb25kYXJ5LWFjY2VudC10ZXh0JyxcbiAgICAgICAgICAgIHRoZW1lID09PSAnZGFyaycgJiYgJ2JvcmRlci1ibGFjay81IGJnLXdoaXRlLzEwIGJhY2tkcm9wLWJsdXItc20nLFxuICAgICAgICAgICl9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC14LTAuNVwiPlxuICAgICAgICAgICAgPFJpSGlzdG9yeUxpbmUgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJweC0wLjVcIj57dCgnY29tbW9uLmV4aXRWZXJzaW9ucycsIHsgbnM6ICd3b3JrZmxvdycgfSl9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEhlYWRlckluUmVzdG9yaW5nXG4iXX0=