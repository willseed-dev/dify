"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionSelectorEntry = void 0;
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const subscription_list_1 = require("@/app/components/plugins/plugin-detail-panel/subscription-list");
const classnames_1 = require("@/utils/classnames");
const types_1 = require("./types");
const use_subscription_list_1 = require("./use-subscription-list");
const SubscriptionTriggerButton = ({ selectedId, onClick, isOpen = false, className, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { subscriptions } = (0, use_subscription_list_1.useSubscriptionList)();
    const statusConfig = (0, react_2.useMemo)(() => {
        if (!selectedId) {
            if (isOpen) {
                return {
                    label: t('subscription.selectPlaceholder', { ns: 'pluginTrigger' }),
                    color: 'yellow',
                };
            }
            return {
                label: t('subscription.noSubscriptionSelected', { ns: 'pluginTrigger' }),
                color: 'red',
            };
        }
        if (subscriptions && subscriptions.length > 0) {
            const selectedSubscription = subscriptions?.find(sub => sub.id === selectedId);
            if (!selectedSubscription) {
                return {
                    label: t('subscription.subscriptionRemoved', { ns: 'pluginTrigger' }),
                    color: 'red',
                };
            }
            return {
                label: selectedSubscription.name,
                color: 'green',
            };
        }
        return {
            label: t('subscription.noSubscriptionSelected', { ns: 'pluginTrigger' }),
            color: 'red',
        };
    }, [selectedId, subscriptions, t, isOpen]);
    return (<button className={(0, classnames_1.cn)('flex h-8 items-center gap-1 rounded-lg px-2 transition-colors', 'hover:bg-state-base-hover-alt', isOpen && 'bg-state-base-hover-alt', className)} onClick={onClick}>
      <react_1.RiWebhookLine className={(0, classnames_1.cn)('h-3.5 w-3.5 shrink-0 text-text-secondary', statusConfig.color === 'red' && 'text-components-button-destructive-secondary-text')}/>
      <span className={(0, classnames_1.cn)('system-xs-medium truncate text-components-button-ghost-text', statusConfig.color === 'red' && 'text-components-button-destructive-secondary-text')}>
        {statusConfig.label}
      </span>
      <react_1.RiArrowDownSLine className={(0, classnames_1.cn)('ml-auto h-4 w-4 shrink-0 text-text-quaternary transition-transform', isOpen && 'rotate-180', statusConfig.color === 'red' && 'text-components-button-destructive-secondary-text')}/>
    </button>);
};
const SubscriptionSelectorEntry = ({ selectedId, onSelect }) => {
    const [isOpen, setIsOpen] = (0, react_2.useState)(false);
    return (<portal_to_follow_elem_1.PortalToFollowElem placement="bottom-start" offset={4} open={isOpen} onOpenChange={setIsOpen}>
      <portal_to_follow_elem_1.PortalToFollowElemTrigger asChild>
        <div>
          <SubscriptionTriggerButton selectedId={selectedId} onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}/>
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemTrigger>
      <portal_to_follow_elem_1.PortalToFollowElemContent className="z-[11]">
        <div className="rounded-xl border border-components-panel-border bg-components-panel-bg shadow-lg">
          <subscription_list_1.SubscriptionList mode={types_1.SubscriptionListMode.SELECTOR} selectedId={selectedId} onSelect={(...args) => {
            onSelect(...args);
            setIsOpen(false);
        }}/>
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemContent>
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.SubscriptionSelectorEntry = SubscriptionSelectorEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3ItZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWxlY3Rvci1lbnRyeS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBRVosNENBQWtFO0FBQ2xFLGlDQUF5QztBQUN6QyxpREFBOEM7QUFDOUMsdUZBSW9EO0FBQ3BELHNHQUFpRztBQUNqRyxtREFBdUM7QUFDdkMsbUNBQThDO0FBQzlDLG1FQUE2RDtBQVM3RCxNQUFNLHlCQUF5QixHQUE2QyxDQUFDLEVBQzNFLFVBQVUsRUFDVixPQUFPLEVBQ1AsTUFBTSxHQUFHLEtBQUssRUFDZCxTQUFTLEdBQ1YsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxJQUFBLDJDQUFtQixHQUFFLENBQUE7SUFFL0MsTUFBTSxZQUFZLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNoQixJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNYLE9BQU87b0JBQ0wsS0FBSyxFQUFFLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsQ0FBQztvQkFDbkUsS0FBSyxFQUFFLFFBQWlCO2lCQUN6QixDQUFBO1lBQ0gsQ0FBQztZQUNELE9BQU87Z0JBQ0wsS0FBSyxFQUFFLENBQUMsQ0FBQyxxQ0FBcUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsQ0FBQztnQkFDeEUsS0FBSyxFQUFFLEtBQWM7YUFDdEIsQ0FBQTtRQUNILENBQUM7UUFFRCxJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzlDLE1BQU0sb0JBQW9CLEdBQUcsYUFBYSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdB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QyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRTtZQUNwQixRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtZQUNqQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEIsQ0FBQyxDQUFDLEVBRU47UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsaURBQXlCLENBQzdCO0lBQUEsRUFBRSwwQ0FBa0IsQ0FBQyxDQUN0QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBcENZLFFBQUEseUJBQXlCLDZCQW9DckMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgU2ltcGxlU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IFJpQXJyb3dEb3duU0xpbmUsIFJpV2ViaG9va0xpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7XG4gIFBvcnRhbFRvRm9sbG93RWxlbSxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbSdcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxpc3QgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvcGx1Z2luLWRldGFpbC1wYW5lbC9zdWJzY3JpcHRpb24tbGlzdCdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlzdE1vZGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgdXNlU3Vic2NyaXB0aW9uTGlzdCB9IGZyb20gJy4vdXNlLXN1YnNjcmlwdGlvbi1saXN0J1xuXG50eXBlIFN1YnNjcmlwdGlvblRyaWdnZXJCdXR0b25Qcm9wcyA9IHtcbiAgc2VsZWN0ZWRJZD86IHN0cmluZ1xuICBvbkNsaWNrPzogKCkgPT4gdm9pZFxuICBpc09wZW4/OiBib29sZWFuXG4gIGNsYXNzTmFtZT86IHN0cmluZ1xufVxuXG5jb25zdCBTdWJzY3JpcHRpb25UcmlnZ2VyQnV0dG9uOiBSZWFjdC5GQzxTdWJzY3JpcHRpb25UcmlnZ2VyQnV0dG9uUHJvcHM+ID0gKHtcbiAgc2VsZWN0ZWRJZCxcbiAgb25DbGljayxcbiAgaXNPcGVuID0gZmFsc2UsXG4gIGNsYXNzTmFtZSxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgc3Vic2NyaXB0aW9ucyB9ID0gdXNlU3Vic2NyaXB0aW9uTGlzdCgpXG5cbiAgY29uc3Qgc3RhdHVzQ29uZmlnID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFzZWxlY3RlZElkKSB7XG4gICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFiZWw6IHQoJ3N1YnNjcmlwdGlvbi5zZWxlY3RQbGFjZWhvbGRlcicsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgICAgICBjb2xvcjogJ3llbGxvdycgYXMgY29uc3QsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhYmVsOiB0KCdzdWJzY3JpcHRpb24ubm9TdWJzY3JpcHRpb25TZWxlY3RlZCcsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgICAgY29sb3I6ICdyZWQnIGFzIGNvbnN0LFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdWJzY3JpcHRpb25zICYmIHN1YnNjcmlwdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRTdWJzY3JpcHRpb24gPSBzdWJzY3JpcHRpb25zPy5maW5kKHN1YiA9PiBzdWIuaWQgPT09IHNlbGVjdGVkSWQpXG5cbiAgICAgIGlmICghc2VsZWN0ZWRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsYWJlbDogdCgnc3Vic2NyaXB0aW9uLnN1YnNjcmlwdGlvblJlbW92ZWQnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICAgICAgY29sb3I6ICdyZWQnIGFzIGNvbnN0LFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhYmVsOiBzZWxlY3RlZFN1YnNjcmlwdGlvbi5uYW1lLFxuICAgICAgICBjb2xvcjogJ2dyZWVuJyBhcyBjb25zdCxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IHQoJ3N1YnNjcmlwdGlvbi5ub1N1YnNjcmlwdGlvblNlbGVjdGVkJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgY29sb3I6ICdyZWQnIGFzIGNvbnN0LFxuICAgIH1cbiAgfSwgW3NlbGVjdGVkSWQsIHN1YnNjcmlwdGlvbnMsIHQsIGlzT3Blbl0pXG5cbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAnZmxleCBoLTggaXRlbXMtY2VudGVyIGdhcC0xIHJvdW5kZWQtbGcgcHgtMiB0cmFuc2l0aW9uLWNvbG9ycycsXG4gICAgICAgICdob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyLWFsdCcsXG4gICAgICAgIGlzT3BlbiAmJiAnYmctc3RhdGUtYmFzZS1ob3Zlci1hbHQnLFxuICAgICAgICBjbGFzc05hbWUsXG4gICAgICApfVxuICAgICAgb25DbGljaz17b25DbGlja31cbiAgICA+XG4gICAgICA8UmlXZWJob29rTGluZSBjbGFzc05hbWU9e2NuKCdoLTMuNSB3LTMuNSBzaHJpbmstMCB0ZXh0LXRleHQtc2Vjb25kYXJ5Jywgc3RhdHVzQ29uZmlnLmNvbG9yID09PSAncmVkJyAmJiAndGV4dC1jb21wb25lbnRzLWJ1dHRvbi1kZXN0cnVjdGl2ZS1zZWNvbmRhcnktdGV4dCcpfSAvPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjbignc3lzdGVtLXhzLW1lZGl1bSB0cnVuY2F0ZSB0ZXh0LWNvbXBvbmVudHMtYnV0dG9uLWdob3N0LXRleHQnLCBzdGF0dXNDb25maWcuY29sb3IgPT09ICdyZWQnICYmICd0ZXh0LWNvbXBvbmVudHMtYnV0dG9uLWRlc3RydWN0aXZlLXNlY29uZGFyeS10ZXh0Jyl9PlxuICAgICAgICB7c3RhdHVzQ29uZmlnLmxhYmVsfVxuICAgICAgPC9zcGFuPlxuICAgICAgPFJpQXJyb3dEb3duU0xpbmVcbiAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAnbWwtYXV0byBoLTQgdy00IHNocmluay0wIHRleHQtdGV4dC1xdWF0ZXJuYXJ5IHRyYW5zaXRpb24tdHJhbnNmb3JtJyxcbiAgICAgICAgICBpc09wZW4gJiYgJ3JvdGF0ZS0xODAnLFxuICAgICAgICAgIHN0YXR1c0NvbmZpZy5jb2xvciA9PT0gJ3JlZCcgJiYgJ3RleHQtY29tcG9uZW50cy1idXR0b24tZGVzdHJ1Y3RpdmUtc2Vjb25kYXJ5LXRleHQnLFxuICAgICAgICApfVxuICAgICAgLz5cbiAgICA8L2J1dHRvbj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgU3Vic2NyaXB0aW9uU2VsZWN0b3JFbnRyeSA9ICh7IHNlbGVjdGVkSWQsIG9uU2VsZWN0IH06IHtcbiAgc2VsZWN0ZWRJZD86IHN0cmluZ1xuICBvblNlbGVjdDogKHY6IFNpbXBsZVN1YnNjcmlwdGlvbiwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSA9PiB2b2lkXG59KSA9PiB7XG4gIGNvbnN0IFtpc09wZW4sIHNldElzT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICByZXR1cm4gKFxuICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1cbiAgICAgIHBsYWNlbWVudD1cImJvdHRvbS1zdGFydFwiXG4gICAgICBvZmZzZXQ9ezR9XG4gICAgICBvcGVuPXtpc09wZW59XG4gICAgICBvbk9wZW5DaGFuZ2U9e3NldElzT3Blbn1cbiAgICA+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlciBhc0NoaWxkPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxTdWJzY3JpcHRpb25UcmlnZ2VyQnV0dG9uXG4gICAgICAgICAgICBzZWxlY3RlZElkPXtzZWxlY3RlZElkfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNPcGVuKCFpc09wZW4pfVxuICAgICAgICAgICAgaXNPcGVuPXtpc09wZW59XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCBjbGFzc05hbWU9XCJ6LVsxMV1cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXhsIGJvcmRlciBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZyBzaGFkb3ctbGdcIj5cbiAgICAgICAgICA8U3Vic2NyaXB0aW9uTGlzdFxuICAgICAgICAgICAgbW9kZT17U3Vic2NyaXB0aW9uTGlzdE1vZGUuU0VMRUNUT1J9XG4gICAgICAgICAgICBzZWxlY3RlZElkPXtzZWxlY3RlZElkfVxuICAgICAgICAgICAgb25TZWxlY3Q9eyguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgIG9uU2VsZWN0KC4uLmFyZ3MpXG4gICAgICAgICAgICAgIHNldElzT3BlbihmYWxzZSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ+XG4gICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW0+XG4gIClcbn1cbiJdfQ==