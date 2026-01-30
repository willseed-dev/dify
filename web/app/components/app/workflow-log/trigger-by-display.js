"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const workflow_1 = require("@/app/components/base/icons/src/vender/workflow");
const block_icon_1 = require("@/app/components/workflow/block-icon");
const types_1 = require("@/app/components/workflow/types");
const use_theme_1 = require("@/hooks/use-theme");
const log_1 = require("@/models/log");
const app_1 = require("@/types/app");
const getTriggerDisplayName = (triggeredFrom, t, metadata) => {
    if (triggeredFrom === log_1.WorkflowRunTriggeredFrom.PLUGIN && metadata?.event_name)
        return metadata.event_name;
    const nameMap = {
        'debugging': t('triggerBy.debugging', { ns: 'appLog' }),
        'app-run': t('triggerBy.appRun', { ns: 'appLog' }),
        'webhook': t('triggerBy.webhook', { ns: 'appLog' }),
        'schedule': t('triggerBy.schedule', { ns: 'appLog' }),
        'plugin': t('triggerBy.plugin', { ns: 'appLog' }),
        'rag-pipeline-run': t('triggerBy.ragPipelineRun', { ns: 'appLog' }),
        'rag-pipeline-debugging': t('triggerBy.ragPipelineDebugging', { ns: 'appLog' }),
    };
    return nameMap[triggeredFrom] || triggeredFrom;
};
const getPluginIcon = (metadata, theme) => {
    if (!metadata)
        return null;
    const icon = theme === app_1.Theme.dark
        ? metadata.icon_dark || metadata.icon
        : metadata.icon || metadata.icon_dark;
    if (!icon)
        return null;
    return (<block_icon_1.default type={types_1.BlockEnum.TriggerPlugin} size="md" toolIcon={icon}/>);
};
const getTriggerIcon = (triggeredFrom, metadata, theme) => {
    switch (triggeredFrom) {
        case 'webhook':
            return (<div className="rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-blue-blue-500 p-1 shadow-md">
          <workflow_1.WebhookLine className="h-4 w-4 text-text-primary-on-surface"/>
        </div>);
        case 'schedule':
            return (<div className="rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-violet-violet-500 p-1 shadow-md">
          <workflow_1.Schedule className="h-4 w-4 text-text-primary-on-surface"/>
        </div>);
        case 'plugin':
            return getPluginIcon(metadata, theme) || (<block_icon_1.default type={types_1.BlockEnum.TriggerPlugin} size="md"/>);
        case 'debugging':
            return (<div className="rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-blue-blue-500 p-1 shadow-md">
          <workflow_1.Code className="h-4 w-4 text-text-primary-on-surface"/>
        </div>);
        case 'rag-pipeline-run':
        case 'rag-pipeline-debugging':
            return (<div className="rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-green-green-500 p-1 shadow-md">
          <workflow_1.KnowledgeRetrieval className="h-4 w-4 text-text-primary-on-surface"/>
        </div>);
        case 'app-run':
        default:
            // For user input types (app-run, etc.), use webapp icon
            return (<div className="rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-blue-brand-blue-brand-500 p-1 shadow-md">
          <workflow_1.WindowCursor className="h-4 w-4 text-text-primary-on-surface"/>
        </div>);
    }
};
const TriggerByDisplay = ({ triggeredFrom, className = '', showText = true, triggerMetadata, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { theme } = (0, use_theme_1.default)();
    const displayName = getTriggerDisplayName(triggeredFrom, t, triggerMetadata);
    const icon = getTriggerIcon(triggeredFrom, triggerMetadata, theme);
    return (<div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center justify-center">
        {icon}
      </div>
      {showText && (<span className="system-sm-regular text-text-secondary">
          {displayName}
        </span>)}
    </div>);
};
exports.default = TriggerByDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpZ2dlci1ieS1kaXNwbGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHJpZ2dlci1ieS1kaXNwbGF5LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUdaLCtCQUE4QjtBQUM5QixpREFBOEM7QUFDOUMsOEVBTXdEO0FBQ3hELHFFQUE0RDtBQUM1RCwyREFBMkQ7QUFDM0QsaURBQXdDO0FBQ3hDLHNDQUF1RDtBQUN2RCxxQ0FBbUM7QUFTbkMsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLGFBQXVDLEVBQUUsQ0FBTSxFQUFFLFFBQTBCLEVBQUUsRUFBRTtJQUM1RyxJQUFJLGFBQWEsS0FBSyw4QkFBd0IsQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFLFVBQVU7UUFDM0UsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFBO0lBRTVCLE1BQU0sT0FBTyxHQUE2QztRQUN4RCxXQUFXLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ3ZELFNBQVMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDbEQsU0FBUyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUNuRCxVQUFVLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ3JELFFBQVEsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDakQsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ25FLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztLQUNo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QUFBO0lBQzVFLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBRWxFLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyw2QkFBNkIsU0FBUyxFQUFFLENBQUMsQ0FDdkQ7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0NBQWtDLENBQy9DO1FBQUEsQ0FBQyxJQUFJLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsUUFBUSxJQUFJLENBQ1gsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHVDQUF1QyxDQUNyRDtVQUFBLENBQUMsV0FBVyxDQUNkO1FBQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUNIO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsZ0JBQWdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgVHJpZ2dlck1ldGFkYXRhIH0gZnJvbSAnQC9tb2RlbHMvbG9nJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQge1xuICBDb2RlLFxuICBLbm93bGVkZ2VSZXRyaWV2YWwsXG4gIFNjaGVkdWxlLFxuICBXZWJob29rTGluZSxcbiAgV2luZG93Q3Vyc29yLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci93b3JrZmxvdydcbmltcG9ydCBCbG9ja0ljb24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1pY29uJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB1c2VUaGVtZSBmcm9tICdAL2hvb2tzL3VzZS10aGVtZSdcbmltcG9ydCB7IFdvcmtmbG93UnVuVHJpZ2dlcmVkRnJvbSB9IGZyb20gJ0AvbW9kZWxzL2xvZydcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5cbnR5cGUgVHJpZ2dlckJ5RGlzcGxheVByb3BzID0ge1xuICB0cmlnZ2VyZWRGcm9tOiBXb3JrZmxvd1J1blRyaWdnZXJlZEZyb21cbiAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIHNob3dUZXh0PzogYm9vbGVhblxuICB0cmlnZ2VyTWV0YWRhdGE/OiBUcmlnZ2VyTWV0YWRhdGFcbn1cblxuY29uc3QgZ2V0VHJpZ2dlckRpc3BsYXlOYW1lID0gKHRyaWdnZXJlZEZyb206IFdvcmtmbG93UnVuVHJpZ2dlcmVkRnJvbSwgdDogYW55LCBtZXRhZGF0YT86IFRyaWdnZXJNZXRhZGF0YSkgPT4ge1xuICBpZiAodHJpZ2dlcmVkRnJvbSA9PT0gV29ya2Zsb3dSdW5UcmlnZ2VyZWRGcm9tLlBMVUdJTiAmJiBtZXRhZGF0YT8uZXZlbnRfbmFtZSlcbiAgICByZXR1cm4gbWV0YWRhdGEuZXZlbnRfbmFtZVxuXG4gIGNvbnN0IG5hbWVNYXA6IFJlY29yZDxXb3JrZmxvd1J1blRyaWdnZXJlZEZyb20sIHN0cmluZz4gPSB7XG4gICAgJ2RlYnVnZ2luZyc6IHQoJ3RyaWdnZXJCeS5kZWJ1Z2dpbmcnLCB7IG5zOiAnYXBwTG9nJyB9KSxcbiAgICAnYXBwLXJ1bic6IHQoJ3RyaWdnZXJCeS5hcHBSdW4nLCB7IG5zOiAnYXBwTG9nJyB9KSxcbiAgICAnd2ViaG9vayc6IHQoJ3RyaWdnZXJCeS53ZWJob29rJywgeyBuczogJ2FwcExvZycgfSksXG4gICAgJ3NjaGVkdWxlJzogdCgndHJpZ2dlckJ5LnNjaGVkdWxlJywgeyBuczogJ2FwcExvZycgfSksXG4gICAgJ3BsdWdpbic6IHQoJ3RyaWdnZXJCeS5wbHVnaW4nLCB7IG5zOiAnYXBwTG9nJyB9KSxcbiAgICAncmFnLXBpcGVsaW5lLXJ1bic6IHQoJ3RyaWdnZXJCeS5yYWdQaXBlbGluZVJ1bicsIHsgbnM6ICdhcHBMb2cnIH0pLFxuICAgICdyYWctcGlwZWxpbmUtZGVidWdnaW5nJzogdCgndHJpZ2dlckJ5LnJhZ1BpcGVsaW5lRGVidWdnaW5nJywgeyBuczogJ2FwcExvZycgfSksXG4gIH1cblxuICByZXR1cm4gbmFtZU1hcFt0cmlnZ2VyZWRGcm9tXSB8fCB0cmlnZ2VyZWRGcm9tXG59XG5cbmNvbnN0IGdldFBsdWdpbkljb24gPSAobWV0YWRhdGE6IFRyaWdnZXJNZXRhZGF0YSB8IHVuZGVmaW5lZCwgdGhlbWU6IFRoZW1lKSA9PiB7XG4gIGlmICghbWV0YWRhdGEpXG4gICAgcmV0dXJuIG51bGxcblxuICBjb25zdCBpY29uID0gdGhlbWUgPT09IFRoZW1lLmRhcmtcbiAgICA/IG1ldGFkYXRhLmljb25fZGFyayB8fCBtZXRhZGF0YS5pY29uXG4gICAgOiBtZXRhZGF0YS5pY29uIHx8IG1ldGFkYXRhLmljb25fZGFya1xuXG4gIGlmICghaWNvbilcbiAgICByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPEJsb2NrSWNvblxuICAgICAgdHlwZT17QmxvY2tFbnVtLlRyaWdnZXJQbHVnaW59XG4gICAgICBzaXplPVwibWRcIlxuICAgICAgdG9vbEljb249e2ljb259XG4gICAgLz5cbiAgKVxufVxuXG5jb25zdCBnZXRUcmlnZ2VySWNvbiA9ICh0cmlnZ2VyZWRGcm9tOiBXb3JrZmxvd1J1blRyaWdnZXJlZEZyb20sIG1ldGFkYXRhOiBUcmlnZ2VyTWV0YWRhdGEgfCB1bmRlZmluZWQsIHRoZW1lOiBUaGVtZSkgPT4ge1xuICBzd2l0Y2ggKHRyaWdnZXJlZEZyb20pIHtcbiAgICBjYXNlICd3ZWJob29rJzpcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXItWzAuNXB4XSBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctdXRpbC1jb2xvcnMtYmx1ZS1ibHVlLTUwMCBwLTEgc2hhZG93LW1kXCI+XG4gICAgICAgICAgPFdlYmhvb2tMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXByaW1hcnktb24tc3VyZmFjZVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIGNhc2UgJ3NjaGVkdWxlJzpcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXItWzAuNXB4XSBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctdXRpbC1jb2xvcnMtdmlvbGV0LXZpb2xldC01MDAgcC0xIHNoYWRvdy1tZFwiPlxuICAgICAgICAgIDxTY2hlZHVsZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC1wcmltYXJ5LW9uLXN1cmZhY2VcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICBjYXNlICdwbHVnaW4nOlxuICAgICAgcmV0dXJuIGdldFBsdWdpbkljb24obWV0YWRhdGEsIHRoZW1lKSB8fCAoXG4gICAgICAgIDxCbG9ja0ljb25cbiAgICAgICAgICB0eXBlPXtCbG9ja0VudW0uVHJpZ2dlclBsdWdpbn1cbiAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAvPlxuICAgICAgKVxuICAgIGNhc2UgJ2RlYnVnZ2luZyc6XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyLVswLjVweF0gYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLXV0aWwtY29sb3JzLWJsdWUtYmx1ZS01MDAgcC0xIHNoYWRvdy1tZFwiPlxuICAgICAgICAgIDxDb2RlIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXByaW1hcnktb24tc3VyZmFjZVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIGNhc2UgJ3JhZy1waXBlbGluZS1ydW4nOlxuICAgIGNhc2UgJ3JhZy1waXBlbGluZS1kZWJ1Z2dpbmcnOlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlci1bMC41cHhdIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy11dGlsLWNvbG9ycy1ncmVlbi1ncmVlbi01MDAgcC0xIHNoYWRvdy1tZFwiPlxuICAgICAgICAgIDxLbm93bGVkZ2VSZXRyaWV2YWwgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtcHJpbWFyeS1vbi1zdXJmYWNlXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgY2FzZSAnYXBwLXJ1bic6XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIEZvciB1c2VyIGlucHV0IHR5cGVzIChhcHAtcnVuLCBldGMuKSwgdXNlIHdlYmFwcCBpY29uXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyLVswLjVweF0gYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLXV0aWwtY29sb3JzLWJsdWUtYnJhbmQtYmx1ZS1icmFuZC01MDAgcC0xIHNoYWRvdy1tZFwiPlxuICAgICAgICAgIDxXaW5kb3dDdXJzb3IgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtcHJpbWFyeS1vbi1zdXJmYWNlXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gIH1cbn1cblxuY29uc3QgVHJpZ2dlckJ5RGlzcGxheTogRkM8VHJpZ2dlckJ5RGlzcGxheVByb3BzPiA9ICh7XG4gIHRyaWdnZXJlZEZyb20sXG4gIGNsYXNzTmFtZSA9ICcnLFxuICBzaG93VGV4dCA9IHRydWUsXG4gIHRyaWdnZXJNZXRhZGF0YSxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcblxuICBjb25zdCBkaXNwbGF5TmFtZSA9IGdldFRyaWdnZXJEaXNwbGF5TmFtZSh0cmlnZ2VyZWRGcm9tLCB0LCB0cmlnZ2VyTWV0YWRhdGEpXG4gIGNvbnN0IGljb24gPSBnZXRUcmlnZ2VySWNvbih0cmlnZ2VyZWRGcm9tLCB0cmlnZ2VyTWV0YWRhdGEsIHRoZW1lKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2BmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41ICR7Y2xhc3NOYW1lfWB9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICB7aWNvbn1cbiAgICAgIDwvZGl2PlxuICAgICAge3Nob3dUZXh0ICYmIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLXNtLXJlZ3VsYXIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgIHtkaXNwbGF5TmFtZX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmlnZ2VyQnlEaXNwbGF5XG4iXX0=