"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const function_1 = require("es-toolkit/function");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const button_1 = require("@/app/components/base/button");
const input_1 = require("@/app/components/base/input");
const modal_1 = require("@/app/components/base/modal");
const toast_1 = require("@/app/components/base/toast");
const app_context_1 = require("@/context/app-context");
const common_1 = require("@/service/common");
const classnames_1 = require("@/utils/classnames");
const index_module_css_1 = require("./index.module.css");
const EditWorkspaceModal = ({ onCancel, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const { currentWorkspace, isCurrentWorkspaceOwner } = (0, app_context_1.useAppContext)();
    const [name, setName] = (0, react_2.useState)(currentWorkspace.name);
    const changeWorkspaceInfo = async (name) => {
        try {
            await (0, common_1.updateWorkspaceInfo)({
                url: '/workspaces/info',
                body: {
                    name,
                },
            });
            notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            location.assign(`${location.origin}`);
        }
        catch {
            notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
        }
    };
    return (<div className={(0, classnames_1.cn)(index_module_css_1.default.wrap)}>
      <modal_1.default overflowVisible isShow onClose={function_1.noop} className={(0, classnames_1.cn)(index_module_css_1.default.modal)}>
        <div className="mb-2 flex justify-between">
          <div className="text-xl font-semibold text-text-primary">{t('account.editWorkspaceInfo', { ns: 'common' })}</div>
          <react_1.RiCloseLine className="h-4 w-4 cursor-pointer text-text-tertiary" onClick={onCancel}/>
        </div>
        <div>
          <div className="mb-2 text-sm font-medium text-text-primary">{t('account.workspaceName', { ns: 'common' })}</div>
          <input_1.default className="mb-2" value={name} placeholder={t('account.workspaceNamePlaceholder', { ns: 'common' })} onChange={(e) => {
            setName(e.target.value);
        }} onClear={() => {
            setName(currentWorkspace.name);
        }}/>

          <div className="sticky bottom-0 -mx-2 mt-2 flex flex-wrap items-center justify-end gap-x-2 bg-components-panel-bg px-2 pt-4">
            <button_1.default size="large" onClick={onCancel}>
              {t('operation.cancel', { ns: 'common' })}
            </button_1.default>
            <button_1.default size="large" variant="primary" onClick={() => {
            changeWorkspaceInfo(name);
            onCancel();
        }} disabled={!isCurrentWorkspaceOwner}>
              {t('operation.confirm', { ns: 'common' })}
            </button_1.default>
          </div>

        </div>
      </modal_1.default>
    </div>);
};
exports.default = EditWorkspaceModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFDWiw0Q0FBOEM7QUFDOUMsa0RBQTBDO0FBQzFDLGlDQUFnQztBQUNoQyxpREFBOEM7QUFDOUMsK0RBQWlEO0FBQ2pELHlEQUFpRDtBQUNqRCx1REFBK0M7QUFDL0MsdURBQStDO0FBQy9DLHVEQUEwRDtBQUMxRCx1REFBcUQ7QUFDckQsNkNBQXNEO0FBQ3RELG1EQUF1QztBQUN2Qyx5REFBa0M7QUFLbEMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEVBQzFCLFFBQVEsR0FDaUIsRUFBRSxFQUFFO0lBQzdCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxpQ0FBVSxFQUFDLG9CQUFZLENBQUMsQ0FBQTtJQUMzQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxJQUFBLDJCQUFhLEdBQUUsQ0FBQTtJQUNyRSxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBUyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUUvRCxNQUFNLG1CQUFtQixHQUFHLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtRQUNqRCxJQUFJLENBQUM7WUFDSCxNQUFNLElBQUEsNEJBQW1CLEVBQUM7Z0JBQ3hCLEdBQUcsRUFBRSxrQkFBa0I7Z0JBQ3ZCLElBQUksRUFBRTtvQkFDSixJQUFJO2lCQUNMO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLGdDQUFnQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzNGLFFBQVEsQ0FBQyxNQUFN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cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgeyBSaUNsb3NlTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyBub29wIH0gZnJvbSAnZXMtdG9vbGtpdC9mdW5jdGlvbidcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VDb250ZXh0IH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgSW5wdXQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2lucHV0J1xuaW1wb3J0IE1vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9tb2RhbCdcbmltcG9ydCB7IFRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IHVzZUFwcENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvYXBwLWNvbnRleHQnXG5pbXBvcnQgeyB1cGRhdGVXb3Jrc3BhY2VJbmZvIH0gZnJvbSAnQC9zZXJ2aWNlL2NvbW1vbidcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHMgZnJvbSAnLi9pbmRleC5tb2R1bGUuY3NzJ1xuXG50eXBlIElFZGl0V29ya3NwYWNlTW9kYWxQcm9wcyA9IHtcbiAgb25DYW5jZWw6ICgpID0+IHZvaWRcbn1cbmNvbnN0IEVkaXRXb3Jrc3BhY2VNb2RhbCA9ICh7XG4gIG9uQ2FuY2VsLFxufTogSUVkaXRXb3Jrc3BhY2VNb2RhbFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlQ29udGV4dChUb2FzdENvbnRleHQpXG4gIGNvbnN0IHsgY3VycmVudFdvcmtzcGFjZSwgaXNDdXJyZW50V29ya3NwYWNlT3duZXIgfSA9IHVzZUFwcENvbnRleHQoKVxuICBjb25zdCBbbmFtZSwgc2V0TmFtZV0gPSB1c2VTdGF0ZTxzdHJpbmc+KGN1cnJlbnRXb3Jrc3BhY2UubmFtZSlcblxuICBjb25zdCBjaGFuZ2VXb3Jrc3BhY2VJbmZvID0gYXN5bmMgKG5hbWU6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB1cGRhdGVXb3Jrc3BhY2VJbmZvKHtcbiAgICAgICAgdXJsOiAnL3dvcmtzcGFjZXMvaW5mbycsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgIGxvY2F0aW9uLmFzc2lnbihgJHtsb2NhdGlvbi5vcmlnaW59YClcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkVW5zdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKHMud3JhcCl9PlxuICAgICAgPE1vZGFsIG92ZXJmbG93VmlzaWJsZSBpc1Nob3cgb25DbG9zZT17bm9vcH0gY2xhc3NOYW1lPXtjbihzLm1vZGFsKX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMiBmbGV4IGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14bCBmb250LXNlbWlib2xkIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoJ2FjY291bnQuZWRpdFdvcmtzcGFjZUluZm8nLCB7IG5zOiAnY29tbW9uJyB9KX08L2Rpdj5cbiAgICAgICAgICA8UmlDbG9zZUxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCBjdXJzb3ItcG9pbnRlciB0ZXh0LXRleHQtdGVydGlhcnlcIiBvbkNsaWNrPXtvbkNhbmNlbH0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC10ZXh0LXByaW1hcnlcIj57dCgnYWNjb3VudC53b3Jrc3BhY2VOYW1lJywgeyBuczogJ2NvbW1vbicgfSl9PC9kaXY+XG4gICAgICAgICAgPElucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJtYi0yXCJcbiAgICAgICAgICAgIHZhbHVlPXtuYW1lfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ2FjY291bnQud29ya3NwYWNlTmFtZVBsYWNlaG9sZGVyJywgeyBuczogJ2NvbW1vbicgfSl9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgc2V0TmFtZShlLnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNsZWFyPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldE5hbWUoY3VycmVudFdvcmtzcGFjZS5uYW1lKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGlja3kgYm90dG9tLTAgLW14LTIgbXQtMiBmbGV4IGZsZXgtd3JhcCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLXgtMiBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHB4LTIgcHQtNFwiPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ29wZXJhdGlvbi5jYW5jZWwnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VXb3Jrc3BhY2VJbmZvKG5hbWUpXG4gICAgICAgICAgICAgICAgb25DYW5jZWwoKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWlzQ3VycmVudFdvcmtzcGFjZU93bmVyfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnb3BlcmF0aW9uLmNvbmZpcm0nLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Nb2RhbD5cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgRWRpdFdvcmtzcGFjZU1vZGFsXG4iXX0=