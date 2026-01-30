"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const shallow_1 = require("zustand/react/shallow");
const store_1 = require("@/app/components/app/store");
const header_1 = require("@/app/components/workflow/header");
const use_workflow_1 = require("@/service/use-workflow");
const hooks_1 = require("../../hooks");
const chat_variable_trigger_1 = require("./chat-variable-trigger");
const features_trigger_1 = require("./features-trigger");
const WorkflowHeader = () => {
    const { appDetail, setCurrentLogItem, setShowMessageLogModal } = (0, store_1.useStore)((0, shallow_1.useShallow)(state => ({
        appDetail: state.appDetail,
        setCurrentLogItem: state.setCurrentLogItem,
        setShowMessageLogModal: state.setShowMessageLogModal,
    })));
    const resetWorkflowVersionHistory = (0, use_workflow_1.useResetWorkflowVersionHistory)();
    const isChatMode = (0, hooks_1.useIsChatMode)();
    const handleClearLogAndMessageModal = (0, react_1.useCallback)(() => {
        setCurrentLogItem();
        setShowMessageLogModal(false);
    }, [setCurrentLogItem, setShowMessageLogModal]);
    const viewHistoryProps = (0, react_1.useMemo)(() => {
        return {
            onClearLogAndMessageModal: handleClearLogAndMessageModal,
            historyUrl: isChatMode ? `/apps/${appDetail.id}/advanced-chat/workflow-runs` : `/apps/${appDetail.id}/workflow-runs`,
        };
    }, [appDetail, isChatMode, handleClearLogAndMessageModal]);
    const headerProps = (0, react_1.useMemo)(() => {
        return {
            normal: {
                components: {
                    middle: <features_trigger_1.default />,
                    chatVariableTrigger: <chat_variable_trigger_1.default />,
                },
                runAndHistoryProps: {
                    showRunButton: !isChatMode,
                    showPreviewButton: isChatMode,
                    viewHistoryProps,
                },
            },
            viewHistory: {
                viewHistoryProps,
            },
            restoring: {
                onRestoreSettled: resetWorkflowVersionHistory,
            },
        };
    }, [resetWorkflowVersionHistory, isChatMode, viewHistoryProps]);
    return (<header_1.default {...headerProps}/>);
};
exports.default = (0, react_1.memo)(WorkflowHeader);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FJYztBQUNkLG1EQUFrRDtBQUNsRCxzREFBb0U7QUFDcEUsNkRBQXFEO0FBQ3JELHlEQUF1RTtBQUN2RSx1Q0FBMkM7QUFDM0MsbUVBQXlEO0FBQ3pELHlEQUFnRDtBQUVoRCxNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUU7SUFDMUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBRSxHQUFHLElBQUEsZ0JBQVcsRUFBQyxJQUFBLG9CQUFVLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztRQUMxQixpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCO1FBQzFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxzQkFBc0I7S0FDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNKLE1BQU0sMkJBQTJCLEdBQUcsSUFBQSw2Q0FBOEIsR0FBRSxDQUFBO0lBQ3BFLE1BQU0sVUFBVSxHQUFHLElBQUEscUJBQWEsR0FBRSxDQUFBO0lBRWxDLE1BQU0sNkJBQTZCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNyRCxpQkFBaUIsRUFBRSxDQUFBO1FBQ25CLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQy9CLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQTtJQUUvQyxNQUFNLGdCQUFnQixHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUNwQyxPQUFPO1lBQ0wseUJBQXlCLEVBQUUsNkJBQTZCO1lBQ3hELFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsU0FBVSxDQUFDLEVBQUUsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFNBQVMsU0FBVSxDQUFDLEVBQUUsZ0JBQWdCO1NBQ3ZILENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLDZCQUE2QixDQUFDLENBQUMsQ0FBQTtJQUUxRCxNQUFNLFdBQVcsR0FBZ0IsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQzVDLE9BQU87WUFDTCxNQUFNLEVBQUU7Z0JBQ04sVUFBVSxFQUFFO29CQUNWLE1BQU0sRUFBRSxDQUFDLDBCQUFlLENBQUMsQUFBRCxFQUFHO29CQUMzQixtQkFBbUIsRUFBRSxDQUFDLCtCQUFtQixDQUFDLEFBQUQsRUFBRztpQkFDN0M7Z0JBQ0Qsa0JBQWtCLEVBQUU7b0JBQ2xCLGFBQWEsRUFBRSxDQUFDLFVBQVU7b0JBQzFCLGlCQUFpQixFQUFFLFVBQVU7b0JBQzdCLGdCQUFnQjtpQkFDakI7YUFDRjtZQUNELFdBQVcsRUFBRTtnQkFDWCxnQkFBZ0I7YUFDakI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsZ0JBQWdCLEVBQUUsMkJBQTJCO2FBQzlDO1NBQ0YsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLDJCQUEyQixFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7SUFDL0QsT0FBTyxDQUNMLENBQUMsZ0JBQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxFQUFHLENBQzVCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxJQUFBLFlBQUksRUFBQyxjQUFjLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSGVhZGVyUHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hlYWRlcidcbmltcG9ydCB7XG4gIG1lbW8sXG4gIHVzZUNhbGxiYWNrLFxuICB1c2VNZW1vLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVNoYWxsb3cgfSBmcm9tICd6dXN0YW5kL3JlYWN0L3NoYWxsb3cnXG5pbXBvcnQgeyB1c2VTdG9yZSBhcyB1c2VBcHBTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJ1xuaW1wb3J0IEhlYWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hlYWRlcidcbmltcG9ydCB7IHVzZVJlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeSB9IGZyb20gJ0Avc2VydmljZS91c2Utd29ya2Zsb3cnXG5pbXBvcnQgeyB1c2VJc0NoYXRNb2RlIH0gZnJvbSAnLi4vLi4vaG9va3MnXG5pbXBvcnQgQ2hhdFZhcmlhYmxlVHJpZ2dlciBmcm9tICcuL2NoYXQtdmFyaWFibGUtdHJpZ2dlcidcbmltcG9ydCBGZWF0dXJlc1RyaWdnZXIgZnJvbSAnLi9mZWF0dXJlcy10cmlnZ2VyJ1xuXG5jb25zdCBXb3JrZmxvd0hlYWRlciA9ICgpID0+IHtcbiAgY29uc3QgeyBhcHBEZXRhaWwsIHNldEN1cnJlbnRMb2dJdGVtLCBzZXRTaG93TWVzc2FnZUxvZ01vZGFsIH0gPSB1c2VBcHBTdG9yZSh1c2VTaGFsbG93KHN0YXRlID0+ICh7XG4gICAgYXBwRGV0YWlsOiBzdGF0ZS5hcHBEZXRhaWwsXG4gICAgc2V0Q3VycmVudExvZ0l0ZW06IHN0YXRlLnNldEN1cnJlbnRMb2dJdGVtLFxuICAgIHNldFNob3dNZXNzYWdlTG9nTW9kYWw6IHN0YXRlLnNldFNob3dNZXNzYWdlTG9nTW9kYWwsXG4gIH0pKSlcbiAgY29uc3QgcmVzZXRXb3JrZmxvd1ZlcnNpb25IaXN0b3J5ID0gdXNlUmVzZXRXb3JrZmxvd1ZlcnNpb25IaXN0b3J5KClcbiAgY29uc3QgaXNDaGF0TW9kZSA9IHVzZUlzQ2hhdE1vZGUoKVxuXG4gIGNvbnN0IGhhbmRsZUNsZWFyTG9nQW5kTWVzc2FnZU1vZGFsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldEN1cnJlbnRMb2dJdGVtKClcbiAgICBzZXRTaG93TWVzc2FnZUxvZ01vZGFsKGZhbHNlKVxuICB9LCBbc2V0Q3VycmVudExvZ0l0ZW0sIHNldFNob3dNZXNzYWdlTG9nTW9kYWxdKVxuXG4gIGNvbnN0IHZpZXdIaXN0b3J5UHJvcHMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgb25DbGVhckxvZ0FuZE1lc3NhZ2VNb2RhbDogaGFuZGxlQ2xlYXJMb2dBbmRNZXNzYWdlTW9kYWwsXG4gICAgICBoaXN0b3J5VXJsOiBpc0NoYXRNb2RlID8gYC9hcHBzLyR7YXBwRGV0YWlsIS5pZH0vYWR2YW5jZWQtY2hhdC93b3JrZmxvdy1ydW5zYCA6IGAvYXBwcy8ke2FwcERldGFpbCEuaWR9L3dvcmtmbG93LXJ1bnNgLFxuICAgIH1cbiAgfSwgW2FwcERldGFpbCwgaXNDaGF0TW9kZSwgaGFuZGxlQ2xlYXJMb2dBbmRNZXNzYWdlTW9kYWxdKVxuXG4gIGNvbnN0IGhlYWRlclByb3BzOiBIZWFkZXJQcm9wcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBub3JtYWw6IHtcbiAgICAgICAgY29tcG9uZW50czoge1xuICAgICAgICAgIG1pZGRsZTogPEZlYXR1cmVzVHJpZ2dlciAvPixcbiAgICAgICAgICBjaGF0VmFyaWFibGVUcmlnZ2VyOiA8Q2hhdFZhcmlhYmxlVHJpZ2dlciAvPixcbiAgICAgICAgfSxcbiAgICAgICAgcnVuQW5kSGlzdG9yeVByb3BzOiB7XG4gICAgICAgICAgc2hvd1J1bkJ1dHRvbjogIWlzQ2hhdE1vZGUsXG4gICAgICAgICAgc2hvd1ByZXZpZXdCdXR0b246IGlzQ2hhdE1vZGUsXG4gICAgICAgICAgdmlld0hpc3RvcnlQcm9wcyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB2aWV3SGlzdG9yeToge1xuICAgICAgICB2aWV3SGlzdG9yeVByb3BzLFxuICAgICAgfSxcbiAgICAgIHJlc3RvcmluZzoge1xuICAgICAgICBvblJlc3RvcmVTZXR0bGVkOiByZXNldFdvcmtmbG93VmVyc2lvbkhpc3RvcnksXG4gICAgICB9LFxuICAgIH1cbiAgfSwgW3Jlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeSwgaXNDaGF0TW9kZSwgdmlld0hpc3RvcnlQcm9wc10pXG4gIHJldHVybiAoXG4gICAgPEhlYWRlciB7Li4uaGVhZGVyUHJvcHN9IC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhXb3JrZmxvd0hlYWRlcilcbiJdfQ==