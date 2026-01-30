"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = require("next/link");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const workflow_1 = require("@/app/components/base/icons/src/vender/workflow");
const switch_1 = require("@/app/components/base/switch");
const block_icon_1 = require("@/app/components/workflow/block-icon");
const trigger_status_1 = require("@/app/components/workflow/store/trigger-status");
const types_1 = require("@/app/components/workflow/types");
const app_context_1 = require("@/context/app-context");
const i18n_1 = require("@/context/i18n");
const use_tools_1 = require("@/service/use-tools");
const use_triggers_1 = require("@/service/use-triggers");
const utils_1 = require("@/utils");
const getTriggerIcon = (trigger, triggerPlugins) => {
    const { trigger_type, status, provider_name } = trigger;
    // Status dot styling based on trigger status
    const getStatusDot = () => {
        if (status === 'enabled') {
            return (<div className="absolute -left-0.5 -top-0.5 h-1.5 w-1.5 rounded-sm border border-black/15 bg-green-500"/>);
        }
        else {
            return (<div className="absolute -left-0.5 -top-0.5 h-1.5 w-1.5 rounded-sm border border-components-badge-status-light-disabled-border-inner bg-components-badge-status-light-disabled-bg shadow-status-indicator-gray-shadow"/>);
        }
    };
    // Get BlockEnum type from trigger_type
    let blockType;
    switch (trigger_type) {
        case 'trigger-webhook':
            blockType = types_1.BlockEnum.TriggerWebhook;
            break;
        case 'trigger-schedule':
            blockType = types_1.BlockEnum.TriggerSchedule;
            break;
        case 'trigger-plugin':
            blockType = types_1.BlockEnum.TriggerPlugin;
            break;
        default:
            blockType = types_1.BlockEnum.TriggerWebhook;
    }
    let triggerIcon;
    if (trigger_type === 'trigger-plugin' && provider_name) {
        const targetTriggers = triggerPlugins || [];
        const foundTrigger = targetTriggers.find(triggerWithProvider => (0, utils_1.canFindTool)(triggerWithProvider.id, provider_name)
            || triggerWithProvider.id.includes(provider_name)
            || triggerWithProvider.name === provider_name);
        triggerIcon = foundTrigger?.icon;
    }
    return (<div className="relative">
      <block_icon_1.default type={blockType} size="md" toolIcon={triggerIcon}/>
      {getStatusDot()}
    </div>);
};
function TriggerCard({ appInfo, onToggleResult }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const docLink = (0, i18n_1.useDocLink)();
    const appId = appInfo.id;
    const { isCurrentWorkspaceEditor } = (0, app_context_1.useAppContext)();
    const { data: triggersResponse, isLoading } = (0, use_tools_1.useAppTriggers)(appId);
    const { mutateAsync: updateTriggerStatus } = (0, use_tools_1.useUpdateTriggerStatus)();
    const invalidateAppTriggers = (0, use_tools_1.useInvalidateAppTriggers)();
    const { data: triggerPlugins } = (0, use_triggers_1.useAllTriggerPlugins)();
    // Zustand store for trigger status sync
    const { setTriggerStatus, setTriggerStatuses } = (0, trigger_status_1.useTriggerStatusStore)();
    const triggers = triggersResponse?.data || [];
    const triggerCount = triggers.length;
    // Sync trigger statuses to Zustand store when data loads initially or after API calls
    React.useEffect(() => {
        if (triggers.length > 0) {
            const statusMap = triggers.reduce((acc, trigger) => {
                // Map API status to EntryNodeStatus: only 'enabled' shows green, others show gray
                acc[trigger.node_id] = trigger.status === 'enabled' ? 'enabled' : 'disabled';
                return acc;
            }, {});
            // Only update if there are actual changes to prevent overriding optimistic updates
            setTriggerStatuses(statusMap);
        }
    }, [triggers, setTriggerStatuses]);
    const onToggleTrigger = async (trigger, enabled) => {
        try {
            // Immediately update Zustand store for real-time UI sync
            const newStatus = enabled ? 'enabled' : 'disabled';
            setTriggerStatus(trigger.node_id, newStatus);
            await updateTriggerStatus({
                appId,
                triggerId: trigger.id,
                enableTrigger: enabled,
            });
            invalidateAppTriggers(appId);
            // Success toast notification
            onToggleResult?.(null);
        }
        catch (error) {
            // Rollback Zustand store state on error
            const rollbackStatus = enabled ? 'disabled' : 'enabled';
            setTriggerStatus(trigger.node_id, rollbackStatus);
            // Error toast notification
            onToggleResult?.(error);
        }
    };
    if (isLoading) {
        return (<div className="w-full max-w-full rounded-xl border-l-[0.5px] border-t border-effects-highlight">
        <div className="rounded-xl bg-background-default">
          <div className="flex w-full flex-col items-start justify-center gap-3 self-stretch border-b-[0.5px] border-divider-subtle p-3">
            <div className="h-6 w-full animate-pulse rounded bg-components-input-bg-normal"></div>
          </div>
        </div>
      </div>);
    }
    return (<div className="w-full max-w-full rounded-xl border-l-[0.5px] border-t border-effects-highlight">
      <div className="rounded-xl bg-background-default">
        <div className="flex w-full flex-col items-start justify-center gap-3 self-stretch border-b-[0.5px] border-divider-subtle p-3">
          <div className="flex w-full items-center gap-3 self-stretch">
            <div className="flex grow items-center">
              <div className="mr-2 shrink-0 rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-purple-purple-500 p-1 shadow-md">
                <workflow_1.TriggerAll className="h-4 w-4 text-text-primary-on-surface"/>
              </div>
              <div className="group w-full">
                <div className="system-md-semibold min-w-0 overflow-hidden text-ellipsis break-normal text-text-secondary group-hover:text-text-primary">
                  {triggerCount > 0
            ? t('overview.triggerInfo.triggersAdded', { ns: 'appOverview', count: triggerCount })
            : t('overview.triggerInfo.noTriggerAdded', { ns: 'appOverview' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {triggerCount > 0 && (<div className="flex flex-col gap-2 p-3">
            {triggers.map(trigger => (<div key={trigger.id} className="flex w-full items-center gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="shrink-0">
                    {getTriggerIcon(trigger, triggerPlugins || [])}
                  </div>
                  <div className="system-sm-medium min-w-0 flex-1 truncate text-text-secondary">
                    {trigger.title}
                  </div>
                </div>
                <div className="flex shrink-0 items-center">
                  <div className={`${trigger.status === 'enabled' ? 'text-text-success' : 'text-text-warning'} system-xs-semibold-uppercase whitespace-nowrap`}>
                    {trigger.status === 'enabled'
                    ? t('overview.status.running', { ns: 'appOverview' })
                    : t('overview.status.disable', { ns: 'appOverview' })}
                  </div>
                </div>
                <div className="shrink-0">
                  <switch_1.default defaultValue={trigger.status === 'enabled'} onChange={enabled => onToggleTrigger(trigger, enabled)} disabled={!isCurrentWorkspaceEditor}/>
                </div>
              </div>))}
          </div>)}

        {triggerCount === 0 && (<div className="p-3">
            <div className="system-xs-regular leading-4 text-text-tertiary">
              {t('overview.triggerInfo.triggerStatusDescription', { ns: 'appOverview' })}
              {' '}
              <link_1.default href={docLink('/guides/workflow/node/trigger')} target="_blank" rel="noopener noreferrer" className="text-text-accent hover:underline">
                {t('overview.triggerInfo.learnAboutTriggers', { ns: 'appOverview' })}
              </link_1.default>
            </div>
          </div>)}
      </div>
    </div>);
}
exports.default = TriggerCard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpZ2dlci1jYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHJpZ2dlci1jYXJkLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUtaLG9DQUE0QjtBQUM1QiwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLDhFQUE0RTtBQUM1RSx5REFBaUQ7QUFDakQscUVBQTREO0FBQzVELG1GQUFzRjtBQUN0RiwyREFBMkQ7QUFDM0QsdURBQXFEO0FBQ3JELHlDQUEyQztBQUMzQyxtREFLNEI7QUFDNUIseURBQTZEO0FBQzdELG1DQUFxQztBQU9yQyxNQUFNLGNBQWMsR0FBRyxDQUFDLE9BQW1CLEVBQUUsY0FBcUIsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLE9BQU8sQ0FBQTtJQUV2RCw2Q0FBNkM7SUFDN0MsTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFO1FBQ3hCLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3pCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0ZBQXdGLEVBQUcsQ0FDM0csQ0FBQTtRQUNILENBQUM7YUFDSSxDQUFDO1lBQ0osT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1TUFBdU0sRUFBRyxDQUMxTixDQUFBO1FBQ0gsQ0FBQztJQUNILENBQUMsQ0FBQTtJQUVELHVDQUF1QztJQUN2QyxJQUFJLFNBQW9CLENBQUE7SUFDeEIsUUFBUSxZQUFZLEVBQUUsQ0FBQztRQUNyQixLQUFLLGlCQUFpQjtZQUNwQixTQUFTLEdBQUcsaUJBQVMsQ0FBQyxjQUFjLENBQUE7WUFDcEMsTUFBSztRQUNQLEtBQUssa0JBQWtCO1lBQ3JCLFNBQVMsR0FBRyxpQkFBUyxDQUFDLGVBQWUsQ0FBQTtZQUNyQyxNQUFLO1FBQ1AsS0FBSyxnQkFBZ0I7WUFDbkIsU0FBUyxHQUFHLGlCQUFTLENBQUMsYUFBYSxD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QVEsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsRUFFeEM7Z0JBQUEsRUFBRSxHQUFHLENBQ1A7Y0FBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUMsQ0FDSjtVQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FFRDs7UUFBQSxDQUFDLFlBQVksS0FBSyxDQUFDLElBQUksQ0FDckIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FDbEI7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0RBQWdELENBQzdEO2NBQUEsQ0FBQyxDQUFDLENBQUMsK0NBQStDLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FDMUU7Y0FBQSxDQUFDLEdBQUcsQ0FDSjtjQUFBLENBQUMsY0FBSSxDQUNILElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQ2YsR0FBRyxDQUFDLHFCQUFxQixDQUN6QixTQUFTLENBQUMsa0NBQWtDLENBRTVDO2dCQUFBLENBQUMsQ0FBQyxDQUFDLHlDQUF5QyxFQUFFLEVBQUUsRUFBRSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQ3RFO2NBQUEsRUFBRSxjQUFJLENBQ1I7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDSDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBBcHBEZXRhaWxSZXNwb25zZSB9IGZyb20gJ0AvbW9kZWxzL2FwcCdcbmltcG9ydCB0eXBlIHsgQXBwVHJpZ2dlciB9IGZyb20gJ0Avc2VydmljZS91c2UtdG9vbHMnXG5pbXBvcnQgdHlwZSB7IEFwcFNTTyB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHR5cGUgeyBJMThuS2V5c0J5UHJlZml4IH0gZnJvbSAnQC90eXBlcy9pMThuJ1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBUcmlnZ2VyQWxsIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvd29ya2Zsb3cnXG5pbXBvcnQgU3dpdGNoIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9zd2l0Y2gnXG5pbXBvcnQgQmxvY2tJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2staWNvbidcbmltcG9ydCB7IHVzZVRyaWdnZXJTdGF0dXNTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUvdHJpZ2dlci1zdGF0dXMnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IHVzZURvY0xpbmsgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcbmltcG9ydCB7XG5cbiAgdXNlQXBwVHJpZ2dlcnMsXG4gIHVzZUludmFsaWRhdGVBcHBUcmlnZ2VycyxcbiAgdXNlVXBkYXRlVHJpZ2dlclN0YXR1cyxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10b29scydcbmltcG9ydCB7IHVzZUFsbFRyaWdnZXJQbHVnaW5zIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10cmlnZ2VycydcbmltcG9ydCB7IGNhbkZpbmRUb29sIH0gZnJvbSAnQC91dGlscydcblxuZXhwb3J0IHR5cGUgSVRyaWdnZXJDYXJkUHJvcHMgPSB7XG4gIGFwcEluZm86IEFwcERldGFpbFJlc3BvbnNlICYgUGFydGlhbDxBcHBTU08+XG4gIG9uVG9nZ2xlUmVzdWx0PzogKGVycjogRXJyb3IgfCBudWxsLCBtZXNzYWdlPzogSTE4bktleXNCeVByZWZpeDwnY29tbW9uJywgJ2FjdGlvbk1zZy4nPikgPT4gdm9pZFxufVxuXG5jb25zdCBnZXRUcmlnZ2VySWNvbiA9ICh0cmlnZ2VyOiBBcHBUcmlnZ2VyLCB0cmlnZ2VyUGx1Z2luczogYW55W10pID0+IHtcbiAgY29uc3QgeyB0cmlnZ2VyX3R5cGUsIHN0YXR1cywgcHJvdmlkZXJfbmFtZSB9ID0gdHJpZ2dlclxuXG4gIC8vIFN0YXR1cyBkb3Qgc3R5bGluZyBiYXNlZCBvbiB0cmlnZ2VyIHN0YXR1c1xuICBjb25zdCBnZXRTdGF0dXNEb3QgPSAoKSA9PiB7XG4gICAgaWYgKHN0YXR1cyA9PT0gJ2VuYWJsZWQnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIC1sZWZ0LTAuNSAtdG9wLTAuNSBoLTEuNSB3LTEuNSByb3VuZGVkLXNtIGJvcmRlciBib3JkZXItYmxhY2svMTUgYmctZ3JlZW4tNTAwXCIgLz5cbiAgICAgIClcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIC1sZWZ0LTAuNSAtdG9wLTAuNSBoLTEuNSB3LTEuNSByb3VuZGVkLXNtIGJvcmRlciBib3JkZXItY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtZGlzYWJsZWQtYm9yZGVyLWlubmVyIGJnLWNvbXBvbmVudHMtYmFkZ2Utc3RhdHVzLWxpZ2h0LWRpc2FibGVkLWJnIHNoYWRvdy1zdGF0dXMtaW5kaWNhdG9yLWdyYXktc2hhZG93XCIgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgQmxvY2tFbnVtIHR5cGUgZnJvbSB0cmlnZ2VyX3R5cGVcbiAgbGV0IGJsb2NrVHlwZTogQmxvY2tFbnVtXG4gIHN3aXRjaCAodHJpZ2dlcl90eXBlKSB7XG4gICAgY2FzZSAndHJpZ2dlci13ZWJob29rJzpcbiAgICAgIGJsb2NrVHlwZSA9IEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9va1xuICAgICAgYnJlYWtcbiAgICBjYXNlICd0cmlnZ2VyLXNjaGVkdWxlJzpcbiAgICAgIGJsb2NrVHlwZSA9IEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGVcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndHJpZ2dlci1wbHVnaW4nOlxuICAgICAgYmxvY2tUeXBlID0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5cbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIGJsb2NrVHlwZSA9IEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9va1xuICB9XG5cbiAgbGV0IHRyaWdnZXJJY29uOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgaWYgKHRyaWdnZXJfdHlwZSA9PT0gJ3RyaWdnZXItcGx1Z2luJyAmJiBwcm92aWRlcl9uYW1lKSB7XG4gICAgY29uc3QgdGFyZ2V0VHJpZ2dlcnMgPSB0cmlnZ2VyUGx1Z2lucyB8fCBbXVxuICAgIGNvbnN0IGZvdW5kVHJpZ2dlciA9IHRhcmdldFRyaWdnZXJzLmZpbmQodHJpZ2dlcldpdGhQcm92aWRlciA9PlxuICAgICAgY2FuRmluZFRvb2wodHJpZ2dlcldpdGhQcm92aWRlci5pZCwgcHJvdmlkZXJfbmFtZSlcbiAgICAgIHx8IHRyaWdnZXJXaXRoUHJvdmlkZXIuaWQuaW5jbHVkZXMocHJvdmlkZXJfbmFtZSlcbiAgICAgIHx8IHRyaWdnZXJXaXRoUHJvdmlkZXIubmFtZSA9PT0gcHJvdmlkZXJfbmFtZSxcbiAgICApXG4gICAgdHJpZ2dlckljb24gPSBmb3VuZFRyaWdnZXI/Lmljb25cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgPEJsb2NrSWNvblxuICAgICAgICB0eXBlPXtibG9ja1R5cGV9XG4gICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgIHRvb2xJY29uPXt0cmlnZ2VySWNvbn1cbiAgICAgIC8+XG4gICAgICB7Z2V0U3RhdHVzRG90KCl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gVHJpZ2dlckNhcmQoeyBhcHBJbmZvLCBvblRvZ2dsZVJlc3VsdCB9OiBJVHJpZ2dlckNhcmRQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgZG9jTGluayA9IHVzZURvY0xpbmsoKVxuICBjb25zdCBhcHBJZCA9IGFwcEluZm8uaWRcbiAgY29uc3QgeyBpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3IgfSA9IHVzZUFwcENvbnRleHQoKVxuICBjb25zdCB7IGRhdGE6IHRyaWdnZXJzUmVzcG9uc2UsIGlzTG9hZGluZyB9ID0gdXNlQXBwVHJpZ2dlcnMoYXBwSWQpXG4gIGNvbnN0IHsgbXV0YXRlQXN5bmM6IHVwZGF0ZVRyaWdnZXJTdGF0dXMgfSA9IHVzZVVwZGF0ZVRyaWdnZXJTdGF0dXMoKVxuICBjb25zdCBpbnZhbGlkYXRlQXBwVHJpZ2dlcnMgPSB1c2VJbnZhbGlkYXRlQXBwVHJpZ2dlcnMoKVxuICBjb25zdCB7IGRhdGE6IHRyaWdnZXJQbHVnaW5zIH0gPSB1c2VBbGxUcmlnZ2VyUGx1Z2lucygpXG5cbiAgLy8gWnVzdGFuZCBzdG9yZSBmb3IgdHJpZ2dlciBzdGF0dXMgc3luY1xuICBjb25zdCB7IHNldFRyaWdnZXJTdGF0dXMsIHNldFRyaWdnZXJTdGF0dXNlcyB9ID0gdXNlVHJpZ2dlclN0YXR1c1N0b3JlKClcblxuICBjb25zdCB0cmlnZ2VycyA9IHRyaWdnZXJzUmVzcG9uc2U/LmRhdGEgfHwgW11cbiAgY29uc3QgdHJpZ2dlckNvdW50ID0gdHJpZ2dlcnMubGVuZ3RoXG5cbiAgLy8gU3luYyB0cmlnZ2VyIHN0YXR1c2VzIHRvIFp1c3RhbmQgc3RvcmUgd2hlbiBkYXRhIGxvYWRzIGluaXRpYWxseSBvciBhZnRlciBBUEkgY2FsbHNcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodHJpZ2dlcnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc3RhdHVzTWFwID0gdHJpZ2dlcnMucmVkdWNlKChhY2MsIHRyaWdnZXIpID0+IHtcbiAgICAgICAgLy8gTWFwIEFQSSBzdGF0dXMgdG8gRW50cnlOb2RlU3RhdHVzOiBvbmx5ICdlbmFibGVkJyBzaG93cyBncmVlbiwgb3RoZXJzIHNob3cgZ3JheVxuICAgICAgICBhY2NbdHJpZ2dlci5ub2RlX2lkXSA9IHRyaWdnZXIuc3RhdHVzID09PSAnZW5hYmxlZCcgPyAnZW5hYmxlZCcgOiAnZGlzYWJsZWQnXG4gICAgICAgIHJldHVybiBhY2NcbiAgICAgIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsICdlbmFibGVkJyB8ICdkaXNhYmxlZCc+KVxuXG4gICAgICAvLyBPbmx5IHVwZGF0ZSBpZiB0aGVyZSBhcmUgYWN0dWFsIGNoYW5nZXMgdG8gcHJldmVudCBvdmVycmlkaW5nIG9wdGltaXN0aWMgdXBkYXRlc1xuICAgICAgc2V0VHJpZ2dlclN0YXR1c2VzKHN0YXR1c01hcClcbiAgICB9XG4gIH0sIFt0cmlnZ2Vycywgc2V0VHJpZ2dlclN0YXR1c2VzXSlcblxuICBjb25zdCBvblRvZ2dsZVRyaWdnZXIgPSBhc3luYyAodHJpZ2dlcjogQXBwVHJpZ2dlciwgZW5hYmxlZDogYm9vbGVhbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBJbW1lZGlhdGVseSB1cGRhdGUgWnVzdGFuZCBzdG9yZSBmb3IgcmVhbC10aW1lIFVJIHN5bmNcbiAgICAgIGNvbnN0IG5ld1N0YXR1cyA9IGVuYWJsZWQgPyAnZW5hYmxlZCcgOiAnZGlzYWJsZWQnXG4gICAgICBzZXRUcmlnZ2VyU3RhdHVzKHRyaWdnZXIubm9kZV9pZCwgbmV3U3RhdHVzKVxuXG4gICAgICBhd2FpdCB1cGRhdGVUcmlnZ2VyU3RhdHVzKHtcbiAgICAgICAgYXBwSWQsXG4gICAgICAgIHRyaWdnZXJJZDogdHJpZ2dlci5pZCxcbiAgICAgICAgZW5hYmxlVHJpZ2dlcjogZW5hYmxlZCxcbiAgICAgIH0pXG4gICAgICBpbnZhbGlkYXRlQXBwVHJpZ2dlcnMoYXBwSWQpXG5cbiAgICAgIC8vIFN1Y2Nlc3MgdG9hc3Qgbm90aWZpY2F0aW9uXG4gICAgICBvblRvZ2dsZVJlc3VsdD8uKG51bGwpXG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gUm9sbGJhY2sgWnVzdGFuZCBzdG9yZSBzdGF0ZSBvbiBlcnJvclxuICAgICAgY29uc3Qgcm9sbGJhY2tTdGF0dXMgPSBlbmFibGVkID8gJ2Rpc2FibGVkJyA6ICdlbmFibGVkJ1xuICAgICAgc2V0VHJpZ2dlclN0YXR1cyh0cmlnZ2VyLm5vZGVfaWQsIHJvbGxiYWNrU3RhdHVzKVxuXG4gICAgICAvLyBFcnJvciB0b2FzdCBub3RpZmljYXRpb25cbiAgICAgIG9uVG9nZ2xlUmVzdWx0Py4oZXJyb3IgYXMgRXJyb3IpXG4gICAgfVxuICB9XG5cbiAgaWYgKGlzTG9hZGluZykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBtYXgtdy1mdWxsIHJvdW5kZWQteGwgYm9yZGVyLWwtWzAuNXB4XSBib3JkZXItdCBib3JkZXItZWZmZWN0cy1oaWdobGlnaHRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXhsIGJnLWJhY2tncm91bmQtZGVmYXVsdFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgZmxleC1jb2wgaXRlbXMtc3RhcnQganVzdGlmeS1jZW50ZXIgZ2FwLTMgc2VsZi1zdHJldGNoIGJvcmRlci1iLVswLjVweF0gYm9yZGVyLWRpdmlkZXItc3VidGxlIHAtM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTYgdy1mdWxsIGFuaW1hdGUtcHVsc2Ugcm91bmRlZCBiZy1jb21wb25lbnRzLWlucHV0LWJnLW5vcm1hbFwiPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgbWF4LXctZnVsbCByb3VuZGVkLXhsIGJvcmRlci1sLVswLjVweF0gYm9yZGVyLXQgYm9yZGVyLWVmZmVjdHMtaGlnaGxpZ2h0XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQteGwgYmctYmFja2dyb3VuZC1kZWZhdWx0XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgZmxleC1jb2wgaXRlbXMtc3RhcnQganVzdGlmeS1jZW50ZXIgZ2FwLTMgc2VsZi1zdHJldGNoIGJvcmRlci1iLVswLjVweF0gYm9yZGVyLWRpdmlkZXItc3VidGxlIHAtM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgaXRlbXMtY2VudGVyIGdhcC0zIHNlbGYtc3RyZXRjaFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdyb3cgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXItMiBzaHJpbmstMCByb3VuZGVkLWxnIGJvcmRlci1bMC41cHhdIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy11dGlsLWNvbG9ycy1wdXJwbGUtcHVycGxlLTUwMCBwLTEgc2hhZG93LW1kXCI+XG4gICAgICAgICAgICAgICAgPFRyaWdnZXJBbGwgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtcHJpbWFyeS1vbi1zdXJmYWNlXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JvdXAgdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQgbWluLXctMCBvdmVyZmxvdy1oaWRkZW4gdGV4dC1lbGxpcHNpcyBicmVhay1ub3JtYWwgdGV4dC10ZXh0LXNlY29uZGFyeSBncm91cC1ob3Zlcjp0ZXh0LXRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgICAgICAgICAge3RyaWdnZXJDb3VudCA+IDBcbiAgICAgICAgICAgICAgICAgICAgPyB0KCdvdmVydmlldy50cmlnZ2VySW5mby50cmlnZ2Vyc0FkZGVkJywgeyBuczogJ2FwcE92ZXJ2aWV3JywgY291bnQ6IHRyaWdnZXJDb3VudCB9KVxuICAgICAgICAgICAgICAgICAgICA6IHQoJ292ZXJ2aWV3LnRyaWdnZXJJbmZvLm5vVHJpZ2dlckFkZGVkJywgeyBuczogJ2FwcE92ZXJ2aWV3JyB9KX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3RyaWdnZXJDb3VudCA+IDAgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtMiBwLTNcIj5cbiAgICAgICAgICAgIHt0cmlnZ2Vycy5tYXAodHJpZ2dlciA9PiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXt0cmlnZ2VyLmlkfSBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggbWluLXctMCBmbGV4LTEgaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNocmluay0wXCI+XG4gICAgICAgICAgICAgICAgICAgIHtnZXRUcmlnZ2VySWNvbih0cmlnZ2VyLCB0cmlnZ2VyUGx1Z2lucyB8fCBbXSl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBtaW4tdy0wIGZsZXgtMSB0cnVuY2F0ZSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgIHt0cmlnZ2VyLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake3RyaWdnZXIuc3RhdHVzID09PSAnZW5hYmxlZCcgPyAndGV4dC10ZXh0LXN1Y2Nlc3MnIDogJ3RleHQtdGV4dC13YXJuaW5nJ30gc3lzdGVtLXhzLXNlbWlib2xkLXVwcGVyY2FzZSB3aGl0ZXNwYWNlLW5vd3JhcGB9PlxuICAgICAgICAgICAgICAgICAgICB7dHJpZ2dlci5zdGF0dXMgPT09ICdlbmFibGVkJ1xuICAgICAgICAgICAgICAgICAgICAgID8gdCgnb3ZlcnZpZXcuc3RhdHVzLnJ1bm5pbmcnLCB7IG5zOiAnYXBwT3ZlcnZpZXcnIH0pXG4gICAgICAgICAgICAgICAgICAgICAgOiB0KCdvdmVydmlldy5zdGF0dXMuZGlzYWJsZScsIHsgbnM6ICdhcHBPdmVydmlldycgfSl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNocmluay0wXCI+XG4gICAgICAgICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dHJpZ2dlci5zdGF0dXMgPT09ICdlbmFibGVkJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2VuYWJsZWQgPT4gb25Ub2dnbGVUcmlnZ2VyKHRyaWdnZXIsIGVuYWJsZWQpfVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWlzQ3VycmVudFdvcmtzcGFjZUVkaXRvcn1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAge3RyaWdnZXJDb3VudCA9PT0gMCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTNcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgbGVhZGluZy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICB7dCgnb3ZlcnZpZXcudHJpZ2dlckluZm8udHJpZ2dlclN0YXR1c0Rlc2NyaXB0aW9uJywgeyBuczogJ2FwcE92ZXJ2aWV3JyB9KX1cbiAgICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgICBocmVmPXtkb2NMaW5rKCcvZ3VpZGVzL3dvcmtmbG93L25vZGUvdHJpZ2dlcicpfVxuICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC10ZXh0LWFjY2VudCBob3Zlcjp1bmRlcmxpbmVcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ292ZXJ2aWV3LnRyaWdnZXJJbmZvLmxlYXJuQWJvdXRUcmlnZ2VycycsIHsgbnM6ICdhcHBPdmVydmlldycgfSl9XG4gICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJpZ2dlckNhcmRcbiJdfQ==