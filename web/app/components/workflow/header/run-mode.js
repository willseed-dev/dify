"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const amplitude_1 = require("@/app/components/base/amplitude");
const mediaAndDevices_1 = require("@/app/components/base/icons/src/vender/line/mediaAndDevices");
const toast_1 = require("@/app/components/base/toast");
const hooks_1 = require("@/app/components/workflow/hooks");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const types_2 = require("@/app/components/workflow/variable-inspect/types");
const event_emitter_1 = require("@/context/event-emitter");
const classnames_1 = require("@/utils/classnames");
const use_dynamic_test_run_options_1 = require("../hooks/use-dynamic-test-run-options");
const test_run_menu_1 = require("./test-run-menu");
const RunMode = ({ text, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { handleWorkflowStartRunInWorkflow, handleWorkflowTriggerScheduleRunInWorkflow, handleWorkflowTriggerWebhookRunInWorkflow, handleWorkflowTriggerPluginRunInWorkflow, handleWorkflowRunAllTriggersInWorkflow, } = (0, hooks_1.useWorkflowStartRun)();
    const { handleStopRun } = (0, hooks_1.useWorkflowRun)();
    const { validateBeforeRun, warningNodes } = (0, hooks_1.useWorkflowRunValidation)();
    const workflowRunningData = (0, store_1.useStore)(s => s.workflowRunningData);
    const isListening = (0, store_1.useStore)(s => s.isListening);
    const status = workflowRunningData?.result.status;
    const isRunning = status === types_1.WorkflowRunningStatus.Running || isListening;
    const dynamicOptions = (0, use_dynamic_test_run_options_1.useDynamicTestRunOptions)();
    const testRunMenuRef = (0, react_2.useRef)(null);
    const { notify } = (0, toast_1.useToastContext)();
    (0, react_2.useEffect)(() => {
        // @ts-expect-error - Dynamic property for backward compatibility with keyboard shortcuts
        window._toggleTestRunDropdown = () => {
            testRunMenuRef.current?.toggle();
        };
        return () => {
            // @ts-expect-error - Dynamic property cleanup
            delete window._toggleTestRunDropdown;
        };
    }, []);
    const handleStop = (0, react_2.useCallback)(() => {
        handleStopRun(workflowRunningData?.task_id || '');
    }, [handleStopRun, workflowRunningData?.task_id]);
    const handleTriggerSelect = (0, react_2.useCallback)((option) => {
        // Validate checklist before running any workflow
        let isValid = true;
        warningNodes.forEach((node) => {
            if (node.id === option.nodeId)
                isValid = false;
        });
        if (!isValid) {
            notify({ type: 'error', message: t('panel.checklistTip', { ns: 'workflow' }) });
            return;
        }
        if (option.type === test_run_menu_1.TriggerType.UserInput) {
            handleWorkflowStartRunInWorkflow();
            (0, amplitude_1.trackEvent)('app_start_action_time', { action_type: 'user_input' });
        }
        else if (option.type === test_run_menu_1.TriggerType.Schedule) {
            handleWorkflowTriggerScheduleRunInWorkflow(option.nodeId);
            (0, amplitude_1.trackEvent)('app_start_action_time', { action_type: 'schedule' });
        }
        else if (option.type === test_run_menu_1.TriggerType.Webhook) {
            if (option.nodeId)
                handleWorkflowTriggerWebhookRunInWorkflow({ nodeId: option.nodeId });
            (0, amplitude_1.trackEvent)('app_start_action_time', { action_type: 'webhook' });
        }
        else if (option.type === test_run_menu_1.TriggerType.Plugin) {
            if (option.nodeId)
                handleWorkflowTriggerPluginRunInWorkflow(option.nodeId);
            (0, amplitude_1.trackEvent)('app_start_action_time', { action_type: 'plugin' });
        }
        else if (option.type === test_run_menu_1.TriggerType.All) {
            const targetNodeIds = option.relatedNodeIds?.filter(Boolean);
            if (targetNodeIds && targetNodeIds.length > 0)
                handleWorkflowRunAllTriggersInWorkflow(targetNodeIds);
            (0, amplitude_1.trackEvent)('app_start_action_time', { action_type: 'all' });
        }
        else {
            // Placeholder for trigger-specific execution logic for schedule, webhook, plugin types
            console.log('TODO: Handle trigger execution for type:', option.type, 'nodeId:', option.nodeId);
        }
    }, [
        validateBeforeRun,
        handleWorkflowStartRunInWorkflow,
        handleWorkflowTriggerScheduleRunInWorkflow,
        handleWorkflowTriggerWebhookRunInWorkflow,
        handleWorkflowTriggerPluginRunInWorkflow,
        handleWorkflowRunAllTriggersInWorkflow,
    ]);
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    eventEmitter?.useSubscription((v) => {
        if (v.type === types_2.EVENT_WORKFLOW_STOP)
            handleStop();
    });
    return (<div className="flex items-center gap-x-px">
      {isRunning
            ? (<button type="button" className={(0, classnames_1.cn)('system-xs-medium flex h-7 cursor-not-allowed items-center gap-x-1 rounded-l-md bg-state-accent-hover px-1.5 text-text-accent')} disabled={true}>
                <react_1.RiLoader2Line className="mr-1 size-4 animate-spin"/>
                {isListening ? t('common.listening', { ns: 'workflow' }) : t('common.running', { ns: 'workflow' })}
              </button>)
            : (<test_run_menu_1.default ref={testRunMenuRef} options={dynamicOptions} onSelect={handleTriggerSelect}>
                <div className={(0, classnames_1.cn)('system-xs-medium flex h-7 cursor-pointer items-center gap-x-1 rounded-md px-1.5 text-text-accent hover:bg-state-accent-hover')} style={{ userSelect: 'none' }}>
                  <react_1.RiPlayLargeLine className="mr-1 size-4"/>
                  {text ?? t('common.run', { ns: 'workflow' })}
                  <div className="system-kbd flex items-center gap-x-0.5 text-text-tertiary">
                    <div className="flex size-4 items-center justify-center rounded-[4px] bg-components-kbd-bg-gray">
                      {(0, utils_1.getKeyboardKeyNameBySystem)('alt')}
                    </div>
                    <div className="flex size-4 items-center justify-center rounded-[4px] bg-components-kbd-bg-gray">
                      R
                    </div>
                  </div>
                </div>
              </test_run_menu_1.default>)}
      {isRunning && (<button type="button" className={(0, classnames_1.cn)('flex size-7 items-center justify-center rounded-r-md bg-state-accent-active')} onClick={handleStop}>
            <mediaAndDevices_1.StopCircle className="size-4 text-text-accent"/>
          </button>)}
    </div>);
};
exports.default = React.memo(RunMode);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLW1vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJydW4tbW9kZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw0Q0FBaUU7QUFDakUsK0JBQThCO0FBQzlCLGlDQUFzRDtBQUN0RCxpREFBOEM7QUFDOUMsK0RBQTREO0FBQzVELGlHQUF3RjtBQUN4Rix1REFBNkQ7QUFDN0QsMkRBQStHO0FBQy9HLDJEQUEwRDtBQUMxRCwyREFBdUU7QUFDdkUsMkRBQTRFO0FBQzVFLDRFQUFzRjtBQUN0RiwyREFBdUU7QUFDdkUsbURBQXVDO0FBQ3ZDLHdGQUFnRjtBQUNoRixtREFBMEQ7QUFNMUQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUNmLElBQUksR0FDUyxFQUFFLEVBQUU7SUFDakIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFDSixnQ0FBZ0MsRUFDaEMsMENBQTBDLEVBQzFDLHlDQUF5QyxFQUN6Qyx3Q0FBd0MsRUFDeEMsc0NBQXNDLEdBQ3ZDLEdBQUcsSUFBQSwyQkFBbUIsR0FBRSxDQUFBO0lBQ3pCLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxJQUFBLHNCQUFjLEdBQUUsQ0FBQTtJQUMxQyxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBQSxnQ0FBd0IsR0FBRSxDQUFBO0lBQ3RFLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFDaEUsTUFBTSxXQUFXLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBRWhELE1BQU0sTUFBTSxHQUFHLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUE7SUFDakQsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLDZCQUFxQixDQUFDLE9BQU8sSUFBSSxXQUFXLENBQUE7SUFFekUsTUFBTSxjQUFjLEdBQUcsSUFBQSx1REFBd0IsR0FBRSxDQUFBO0lBQ2pELE1BQU0sY0FBYyxHQUFHLElBQUEsY0FBTSxFQUFpQixJQUFJLENBQUMsQ0FBQTtJQUNuRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFFcEMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLHlGQUF5RjtRQUN6RixNQUFNLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxFQUFFO1lBQ25DLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUE7UUFDbEMsQ0FBQyxDQUFBO1FBQ0QsT0FBTyxHQUFHLEVBQUU7WUFDViw4Q0FBOEM7WUFDOUMsT0FBTyxNQUFNLENBQUMsc0JBQXNCLENBQUE7UUFDdEMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRU4sTUFBTSxVQUFVLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNsQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQ25ELENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRWpELE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBcUIsRUFBRSxFQUFFO1FBQ2hFLGlEQUFpRDtRQUNqRCxJQUFJLE9BQU8sR0FBWSxJQUFJLENBQUE7UUFDM0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVCLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsTUFBTTtnQkFDM0IsT0FBTyxHQUFHLEtBQUssQ0FBQTtRQUNuQixDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNiLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUMvRSxPQUFNO1FBQ1IsQ0FBQztRQUVELElBQUksTUFBTSxDQUFDLElBQUksS0FBSywyQkFBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzFDLGdDQUFnQyxFQUFFLENBQUE7WUFDbEMsSUFBQSxzQkFBVSxFQUFDLHVCQUF1QixFQUFFLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUE7UUFDcEUsQ0FBQzthQUNJLElBQUksTUFBTSxDQUFDLElBQUksS0FBSywyQkFBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzlDLDBDQUEwQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN6RCxJQUFBLHNCQUFVLEVBQUMsdUJBQXVCLEVBQUUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtRQUNsRSxDQUFDO2FBQ0ksSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLDJCQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0MsSUFBSSxNQUFNLENBQUMsTUFBTTtnQkFDZix5Q0FBeUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtZQUN0RSxJQUFBLHNCQUFVLEVBQUMsdUJBQXVCLEVBQUUsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtRQUNqRSxDQUFDO2FBQ0ksSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLDJCQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDNUMsSUFBSSxNQUFNLENBQUMsTUFBTTtnQkFDZix3Q0FBd0MsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDekQsSUFBQSxzQkFBVSxFQUFDLHVCQUF1QixFQUFFLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDaEUsQ0FBQzthQUNJLElBQUksTUFBTSxDQUFDLElBQUksS0FBSywyQkFBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzVELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDM0Msc0NBQXNDLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDdkQsSUFBQSxzQkFBVSxFQUFDLHVCQUF1QixFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7UUFDN0QsQ0FBQzthQUNJLENBQUM7WUFDSix1RkFBdUY7WUFDdkYsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDaEcsQ0FBQztJQUNILENBQUMsRUFBRTtRQUNELGlCQUFpQjtRQUNqQixnQ0FBZ0M7UUFDaEMsMENBQTBDO1FBQzFDLHlDQUF5QztRQUN6Qyx3Q0FBd0M7UUFDeEMsc0NBQXNDO0tBQ3ZDLENBQUMsQ0FBQTtJQUVGLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFBLDZDQUE2QixHQUFFLENBQUE7SUFDeEQsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ3ZDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSywyQkFBbUI7WUFDaEMsVUFBVSxFQUFFLENBQUE7SUFDaEIsQ0FBQyxDQUFDLENBQUE7SUFFRixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUN6QztNQUFBLENBQ0UsU0FBUztZQUNQLENBQUMsQ0FBQyxDQUNFLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQ1gsOEhBQThILENBQy9ILENBQUMsQ0FDRixRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FFZjtnQkFBQSxDQUFDLHFCQUFhLENBQUMsU0FBUyxDQUFDLDBCQUEwQixFQUNuRDtnQkFBQSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUNwRztjQUFBLEVBQUUsTUFBTSxDQUFDLENBQ1Y7WUFDSCxDQUFDLENBQUMsQ0FDRSxDQUFDLHVCQUFXLENBQ1YsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQ3BCLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUN4QixRQUFRLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUU5QjtnQkFBQSxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFDWCw4SEFBOEgsQ0FDL0gsQ0FBQyxDQUNGLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBRTlCO2tCQUFBLENBQUMsdUJBQWUsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUN4QztrQkFBQSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQzVDO2tCQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywyREFBMkQsQ0FDeEU7b0JBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlGQUFpRixDQUM5RjtzQkFBQSxDQUFDLElBQUEsa0NBQTBCLEVBQUMsS0FBSyxDQUFDLENBQ3BDO29CQUFBLEVBQUUsR0FBRyxDQUNMO29CQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpRkFBaUYsQ0FDOUY7O29CQUNGLEVBQUUsR0FBRyxDQUNQO2tCQUFBLEVBQUUsR0FBRyxDQUNQO2dCQUFBLEVBQUUsR0FBRyxDQUNQO2NBQUEsRUFBRSx1QkFBVyxDQUFDLENBRXRCLENBQ0E7TUFBQSxDQUNFLFNBQVMsSUFBSSxDQUNYLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQ1gsNkVBQTZFLENBQzlFLENBQUMsQ0FDRixPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FFcEI7WUFBQSxDQUFDLDRCQUFVLENBQUMsU0FBUyxDQUFDLHlCQUF5QixFQUNqRDtVQUFBLEVBQUUsTUFBTSxDQUFDLENBRWIsQ0FDRjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFRlc3RSdW5NZW51UmVmLCBUcmlnZ2VyT3B0aW9uIH0gZnJvbSAnLi90ZXN0LXJ1bi1tZW51J1xuaW1wb3J0IHsgUmlMb2FkZXIyTGluZSwgUmlQbGF5TGFyZ2VMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB0cmFja0V2ZW50IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FtcGxpdHVkZSdcbmltcG9ydCB7IFN0b3BDaXJjbGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9saW5lL21lZGlhQW5kRGV2aWNlcydcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IHVzZVdvcmtmbG93UnVuLCB1c2VXb3JrZmxvd1J1blZhbGlkYXRpb24sIHVzZVdvcmtmbG93U3RhcnRSdW4gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzJ1xuaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHsgV29ya2Zsb3dSdW5uaW5nU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdldEtleWJvYXJkS2V5TmFtZUJ5U3lzdGVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy91dGlscydcbmltcG9ydCB7IEVWRU5UX1dPUktGTE9XX1NUT1AgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3ZhcmlhYmxlLWluc3BlY3QvdHlwZXMnXG5pbXBvcnQgeyB1c2VFdmVudEVtaXR0ZXJDb250ZXh0Q29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9ldmVudC1lbWl0dGVyJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgeyB1c2VEeW5hbWljVGVzdFJ1bk9wdGlvbnMgfSBmcm9tICcuLi9ob29rcy91c2UtZHluYW1pYy10ZXN0LXJ1bi1vcHRpb25zJ1xuaW1wb3J0IFRlc3RSdW5NZW51LCB7IFRyaWdnZXJUeXBlIH0gZnJvbSAnLi90ZXN0LXJ1bi1tZW51J1xuXG50eXBlIFJ1bk1vZGVQcm9wcyA9IHtcbiAgdGV4dD86IHN0cmluZ1xufVxuXG5jb25zdCBSdW5Nb2RlID0gKHtcbiAgdGV4dCxcbn06IFJ1bk1vZGVQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3Qge1xuICAgIGhhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93LFxuICAgIGhhbmRsZVdvcmtmbG93VHJpZ2dlclNjaGVkdWxlUnVuSW5Xb3JrZmxvdyxcbiAgICBoYW5kbGVXb3JrZmxvd1RyaWdnZXJXZWJob29rUnVuSW5Xb3JrZmxvdyxcbiAgICBoYW5kbGVXb3JrZmxvd1RyaWdnZXJQbHVnaW5SdW5JbldvcmtmbG93LFxuICAgIGhhbmRsZVdvcmtmbG93UnVuQWxsVHJpZ2dlcnNJbldvcmtmbG93LFxuICB9ID0gdXNlV29ya2Zsb3dTdGFydFJ1bigpXG4gIGNvbnN0IHsgaGFuZGxlU3RvcFJ1biB9ID0gdXNlV29ya2Zsb3dSdW4oKVxuICBjb25zdCB7IHZhbGlkYXRlQmVmb3JlUnVuLCB3YXJuaW5nTm9kZXMgfSA9IHVzZVdvcmtmbG93UnVuVmFsaWRhdGlvbigpXG4gIGNvbnN0IHdvcmtmbG93UnVubmluZ0RhdGEgPSB1c2VTdG9yZShzID0+IHMud29ya2Zsb3dSdW5uaW5nRGF0YSlcbiAgY29uc3QgaXNMaXN0ZW5pbmcgPSB1c2VTdG9yZShzID0+IHMuaXNMaXN0ZW5pbmcpXG5cbiAgY29uc3Qgc3RhdHVzID0gd29ya2Zsb3dSdW5uaW5nRGF0YT8ucmVzdWx0LnN0YXR1c1xuICBjb25zdCBpc1J1bm5pbmcgPSBzdGF0dXMgPT09IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nIHx8IGlzTGlzdGVuaW5nXG5cbiAgY29uc3QgZHluYW1pY09wdGlvbnMgPSB1c2VEeW5hbWljVGVzdFJ1bk9wdGlvbnMoKVxuICBjb25zdCB0ZXN0UnVuTWVudVJlZiA9IHVzZVJlZjxUZXN0UnVuTWVudVJlZj4obnVsbClcbiAgY29uc3QgeyBub3RpZnkgfSA9IHVzZVRvYXN0Q29udGV4dCgpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIC0gRHluYW1pYyBwcm9wZXJ0eSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIGtleWJvYXJkIHNob3J0Y3V0c1xuICAgIHdpbmRvdy5fdG9nZ2xlVGVzdFJ1bkRyb3Bkb3duID0gKCkgPT4ge1xuICAgICAgdGVzdFJ1bk1lbnVSZWYuY3VycmVudD8udG9nZ2xlKClcbiAgICB9XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgLSBEeW5hbWljIHByb3BlcnR5IGNsZWFudXBcbiAgICAgIGRlbGV0ZSB3aW5kb3cuX3RvZ2dsZVRlc3RSdW5Ecm9wZG93blxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlU3RvcCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBoYW5kbGVTdG9wUnVuKHdvcmtmbG93UnVubmluZ0RhdGE/LnRhc2tfaWQgfHwgJycpXG4gIH0sIFtoYW5kbGVTdG9wUnVuLCB3b3JrZmxvd1J1bm5pbmdEYXRhPy50YXNrX2lkXSlcblxuICBjb25zdCBoYW5kbGVUcmlnZ2VyU2VsZWN0ID0gdXNlQ2FsbGJhY2soKG9wdGlvbjogVHJpZ2dlck9wdGlvbikgPT4ge1xuICAgIC8vIFZhbGlkYXRlIGNoZWNrbGlzdCBiZWZvcmUgcnVubmluZyBhbnkgd29ya2Zsb3dcbiAgICBsZXQgaXNWYWxpZDogYm9vbGVhbiA9IHRydWVcbiAgICB3YXJuaW5nTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUuaWQgPT09IG9wdGlvbi5ub2RlSWQpXG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZVxuICAgIH0pXG4gICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdwYW5lbC5jaGVja2xpc3RUaXAnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAob3B0aW9uLnR5cGUgPT09IFRyaWdnZXJUeXBlLlVzZXJJbnB1dCkge1xuICAgICAgaGFuZGxlV29ya2Zsb3dTdGFydFJ1bkluV29ya2Zsb3coKVxuICAgICAgdHJhY2tFdmVudCgnYXBwX3N0YXJ0X2FjdGlvbl90aW1lJywgeyBhY3Rpb25fdHlwZTogJ3VzZXJfaW5wdXQnIH0pXG4gICAgfVxuICAgIGVsc2UgaWYgKG9wdGlvbi50eXBlID09PSBUcmlnZ2VyVHlwZS5TY2hlZHVsZSkge1xuICAgICAgaGFuZGxlV29ya2Zsb3dUcmlnZ2VyU2NoZWR1bGVSdW5JbldvcmtmbG93KG9wdGlvbi5ub2RlSWQpXG4gICAgICB0cmFja0V2ZW50KCdhcHBfc3RhcnRfYWN0aW9uX3RpbWUnLCB7IGFjdGlvbl90eXBlOiAnc2NoZWR1bGUnIH0pXG4gICAgfVxuICAgIGVsc2UgaWYgKG9wdGlvbi50eXBlID09PSBUcmlnZ2VyVHlwZS5XZWJob29rKSB7XG4gICAgICBpZiAob3B0aW9uLm5vZGVJZClcbiAgICAgICAgaGFuZGxlV29ya2Zsb3dUcmlnZ2VyV2ViaG9va1J1bkluV29ya2Zsb3coeyBub2RlSWQ6IG9wdGlvbi5ub2RlSWQgfSlcbiAgICAgIHRyYWNrRXZlbnQoJ2FwcF9zdGFydF9hY3Rpb25fdGltZScsIHsgYWN0aW9uX3R5cGU6ICd3ZWJob29rJyB9KVxuICAgIH1cbiAgICBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gVHJpZ2dlclR5cGUuUGx1Z2luKSB7XG4gICAgICBpZiAob3B0aW9uLm5vZGVJZClcbiAgICAgICAgaGFuZGxlV29ya2Zsb3dUcmlnZ2VyUGx1Z2luUnVuSW5Xb3JrZmxvdyhvcHRpb24ubm9kZUlkKVxuICAgICAgdHJhY2tFdmVudCgnYXBwX3N0YXJ0X2FjdGlvbl90aW1lJywgeyBhY3Rpb25fdHlwZTogJ3BsdWdpbicgfSlcbiAgICB9XG4gICAgZWxzZSBpZiAob3B0aW9uLnR5cGUgPT09IFRyaWdnZXJUeXBlLkFsbCkge1xuICAgICAgY29uc3QgdGFyZ2V0Tm9kZUlkcyA9IG9wdGlvbi5yZWxhdGVkTm9kZUlkcz8uZmlsdGVyKEJvb2xlYW4pXG4gICAgICBpZiAodGFyZ2V0Tm9kZUlkcyAmJiB0YXJnZXROb2RlSWRzLmxlbmd0aCA+IDApXG4gICAgICAgIGhhbmRsZVdvcmtmbG93UnVuQWxsVHJpZ2dlcnNJbldvcmtmbG93KHRhcmdldE5vZGVJZHMpXG4gICAgICB0cmFja0V2ZW50KCdhcHBfc3RhcnRfYWN0aW9uX3RpbWUnLCB7IGFjdGlvbl90eXBlOiAnYWxsJyB9KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFBsYWNlaG9sZGVyIGZvciB0cmlnZ2VyLXNwZWNpZmljIGV4ZWN1dGlvbiBsb2dpYyBmb3Igc2NoZWR1bGUsIHdlYmhvb2ssIHBsdWdpbiB0eXBlc1xuICAgICAgY29uc29sZS5sb2coJ1RPRE86IEhhbmRsZSB0cmlnZ2VyIGV4ZWN1dGlvbiBmb3IgdHlwZTonLCBvcHRpb24udHlwZSwgJ25vZGVJZDonLCBvcHRpb24ubm9kZUlkKVxuICAgIH1cbiAgfSwgW1xuICAgIHZhbGlkYXRlQmVmb3JlUnVuLFxuICAgIGhhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93LFxuICAgIGhhbmRsZVdvcmtmbG93VHJpZ2dlclNjaGVkdWxlUnVuSW5Xb3JrZmxvdyxcbiAgICBoYW5kbGVXb3JrZmxvd1RyaWdnZXJXZWJob29rUnVuSW5Xb3JrZmxvdyxcbiAgICBoYW5kbGVXb3JrZmxvd1RyaWdnZXJQbHVnaW5SdW5JbldvcmtmbG93LFxuICAgIGhhbmRsZVdvcmtmbG93UnVuQWxsVHJpZ2dlcnNJbldvcmtmbG93LFxuICBdKVxuXG4gIGNvbnN0IHsgZXZlbnRFbWl0dGVyIH0gPSB1c2VFdmVudEVtaXR0ZXJDb250ZXh0Q29udGV4dCgpXG4gIGV2ZW50RW1pdHRlcj8udXNlU3Vic2NyaXB0aW9uKCh2OiBhbnkpID0+IHtcbiAgICBpZiAodi50eXBlID09PSBFVkVOVF9XT1JLRkxPV19TVE9QKVxuICAgICAgaGFuZGxlU3RvcCgpXG4gIH0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC14LXB4XCI+XG4gICAgICB7XG4gICAgICAgIGlzUnVubmluZ1xuICAgICAgICAgID8gKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgICAgICdzeXN0ZW0teHMtbWVkaXVtIGZsZXggaC03IGN1cnNvci1ub3QtYWxsb3dlZCBpdGVtcy1jZW50ZXIgZ2FwLXgtMSByb3VuZGVkLWwtbWQgYmctc3RhdGUtYWNjZW50LWhvdmVyIHB4LTEuNSB0ZXh0LXRleHQtYWNjZW50JyxcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXt0cnVlfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFJpTG9hZGVyMkxpbmUgY2xhc3NOYW1lPVwibXItMSBzaXplLTQgYW5pbWF0ZS1zcGluXCIgLz5cbiAgICAgICAgICAgICAgICB7aXNMaXN0ZW5pbmcgPyB0KCdjb21tb24ubGlzdGVuaW5nJywgeyBuczogJ3dvcmtmbG93JyB9KSA6IHQoJ2NvbW1vbi5ydW5uaW5nJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApXG4gICAgICAgICAgOiAoXG4gICAgICAgICAgICAgIDxUZXN0UnVuTWVudVxuICAgICAgICAgICAgICAgIHJlZj17dGVzdFJ1bk1lbnVSZWZ9XG4gICAgICAgICAgICAgICAgb3B0aW9ucz17ZHluYW1pY09wdGlvbnN9XG4gICAgICAgICAgICAgICAgb25TZWxlY3Q9e2hhbmRsZVRyaWdnZXJTZWxlY3R9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICAgICAgICAnc3lzdGVtLXhzLW1lZGl1bSBmbGV4IGgtNyBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLXgtMSByb3VuZGVkLW1kIHB4LTEuNSB0ZXh0LXRleHQtYWNjZW50IGhvdmVyOmJnLXN0YXRlLWFjY2VudC1ob3ZlcicsXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgdXNlclNlbGVjdDogJ25vbmUnIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFJpUGxheUxhcmdlTGluZSBjbGFzc05hbWU9XCJtci0xIHNpemUtNFwiIC8+XG4gICAgICAgICAgICAgICAgICB7dGV4dCA/PyB0KCdjb21tb24ucnVuJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLWtiZCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAteC0wLjUgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzaXplLTQgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtWzRweF0gYmctY29tcG9uZW50cy1rYmQtYmctZ3JheVwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtnZXRLZXlib2FyZEtleU5hbWVCeVN5c3RlbSgnYWx0Jyl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc2l6ZS00IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLVs0cHhdIGJnLWNvbXBvbmVudHMta2JkLWJnLWdyYXlcIj5cbiAgICAgICAgICAgICAgICAgICAgICBSXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvVGVzdFJ1bk1lbnU+XG4gICAgICAgICAgICApXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlzUnVubmluZyAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICAnZmxleCBzaXplLTcgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtci1tZCBiZy1zdGF0ZS1hY2NlbnQtYWN0aXZlJyxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVTdG9wfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdG9wQ2lyY2xlIGNsYXNzTmFtZT1cInNpemUtNCB0ZXh0LXRleHQtYWNjZW50XCIgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKVxuICAgICAgfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oUnVuTW9kZSlcbiJdfQ==