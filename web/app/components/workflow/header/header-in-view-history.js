"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const arrows_1 = require("@/app/components/base/icons/src/vender/line/arrows");
const divider_1 = require("../../base/divider");
const hooks_1 = require("../hooks");
const store_1 = require("../store");
const running_title_1 = require("./running-title");
const view_history_1 = require("./view-history");
const HeaderInHistory = ({ viewHistoryProps, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { handleLoadBackupDraft, } = (0, hooks_1.useWorkflowRun)();
    const handleGoBackToEdit = (0, react_1.useCallback)(() => {
        handleLoadBackupDraft();
        workflowStore.setState({ historyWorkflowData: undefined });
    }, [workflowStore, handleLoadBackupDraft]);
    return (<>
      <div>
        <running_title_1.default />
      </div>
      <div className="flex items-center space-x-2">
        <view_history_1.default {...viewHistoryProps} withText/>
        <divider_1.default type="vertical" className="mx-auto h-3.5"/>
        <button_1.default variant="primary" onClick={handleGoBackToEdit}>
          <arrows_1.ArrowNarrowLeft className="mr-1 h-4 w-4"/>
          {t('common.goBackToEdit', { ns: 'workflow' })}
        </button_1.default>
      </div>
    </>);
};
exports.default = HeaderInHistory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLWluLXZpZXctaGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlYWRlci1pbi12aWV3LWhpc3RvcnkudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsaUNBRWM7QUFDZCxpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELCtFQUFvRjtBQUNwRixnREFBd0M7QUFDeEMsb0NBRWlCO0FBQ2pCLG9DQUVpQjtBQUNqQixtREFBMEM7QUFDMUMsaURBQXdDO0FBS3hDLE1BQU0sZUFBZSxHQUFHLENBQUMsRUFDdkIsZ0JBQWdCLEdBQ0ssRUFBRSxFQUFFO0lBQ3pCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFFeEMsTUFBTSxFQUNKLHFCQUFxQixHQUN0QixHQUFHLElBQUEsc0JBQWMsR0FBRSxDQUFBO0lBRXBCLE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUMxQyxxQkFBcUIsRUFBRSxDQUFBO1FBQ3ZCLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO0lBQzVELENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7SUFFMUMsT0FBTyxDQUNMLEVBQ0U7TUFBQSxDQUFDLEdBQUcsQ0FDRjtRQUFBLENBQUMsdUJBQVksQ0FBQyxBQUFELEVBQ2Y7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FDMUM7UUFBQSxDQUFDLHNCQUFXLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsRUFDM0M7UUFBQSxDQUFDLGlCQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUNsRDtRQUFBLENBQUMsZ0JBQU0sQ0FDTCxPQUFPLENBQUMsU0FBUyxDQUNqQixPQUFPLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUU1QjtVQUFBLENBQUMsd0JBQWUsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUN6QztVQUFBLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQy9DO1FBQUEsRUFBRSxnQkFBTSxDQUNWO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVmlld0hpc3RvcnlQcm9wcyB9IGZyb20gJy4vdmlldy1oaXN0b3J5J1xuaW1wb3J0IHtcbiAgdXNlQ2FsbGJhY2ssXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IHsgQXJyb3dOYXJyb3dMZWZ0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvbGluZS9hcnJvd3MnXG5pbXBvcnQgRGl2aWRlciBmcm9tICcuLi8uLi9iYXNlL2RpdmlkZXInXG5pbXBvcnQge1xuICB1c2VXb3JrZmxvd1J1bixcbn0gZnJvbSAnLi4vaG9va3MnXG5pbXBvcnQge1xuICB1c2VXb3JrZmxvd1N0b3JlLFxufSBmcm9tICcuLi9zdG9yZSdcbmltcG9ydCBSdW5uaW5nVGl0bGUgZnJvbSAnLi9ydW5uaW5nLXRpdGxlJ1xuaW1wb3J0IFZpZXdIaXN0b3J5IGZyb20gJy4vdmlldy1oaXN0b3J5J1xuXG5leHBvcnQgdHlwZSBIZWFkZXJJbkhpc3RvcnlQcm9wcyA9IHtcbiAgdmlld0hpc3RvcnlQcm9wcz86IFZpZXdIaXN0b3J5UHJvcHNcbn1cbmNvbnN0IEhlYWRlckluSGlzdG9yeSA9ICh7XG4gIHZpZXdIaXN0b3J5UHJvcHMsXG59OiBIZWFkZXJJbkhpc3RvcnlQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuXG4gIGNvbnN0IHtcbiAgICBoYW5kbGVMb2FkQmFja3VwRHJhZnQsXG4gIH0gPSB1c2VXb3JrZmxvd1J1bigpXG5cbiAgY29uc3QgaGFuZGxlR29CYWNrVG9FZGl0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGhhbmRsZUxvYWRCYWNrdXBEcmFmdCgpXG4gICAgd29ya2Zsb3dTdG9yZS5zZXRTdGF0ZSh7IGhpc3RvcnlXb3JrZmxvd0RhdGE6IHVuZGVmaW5lZCB9KVxuICB9LCBbd29ya2Zsb3dTdG9yZSwgaGFuZGxlTG9hZEJhY2t1cERyYWZ0XSlcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2PlxuICAgICAgICA8UnVubmluZ1RpdGxlIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0yXCI+XG4gICAgICAgIDxWaWV3SGlzdG9yeSB7Li4udmlld0hpc3RvcnlQcm9wc30gd2l0aFRleHQgLz5cbiAgICAgICAgPERpdmlkZXIgdHlwZT1cInZlcnRpY2FsXCIgY2xhc3NOYW1lPVwibXgtYXV0byBoLTMuNVwiIC8+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlR29CYWNrVG9FZGl0fVxuICAgICAgICA+XG4gICAgICAgICAgPEFycm93TmFycm93TGVmdCBjbGFzc05hbWU9XCJtci0xIGgtNCB3LTRcIiAvPlxuICAgICAgICAgIHt0KCdjb21tb24uZ29CYWNrVG9FZGl0JywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8Lz5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWFkZXJJbkhpc3RvcnlcbiJdfQ==