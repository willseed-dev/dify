"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const app_context_1 = require("@/context/app-context");
const provider_context_1 = require("@/context/provider-context");
const use_async_window_open_1 = require("@/hooks/use-async-window-open");
const use_billing_1 = require("@/service/use-billing");
const plan_1 = require("../plan");
const Billing = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { isCurrentWorkspaceManager } = (0, app_context_1.useAppContext)();
    const { enableBilling } = (0, provider_context_1.useProviderContext)();
    const { data: billingUrl, isFetching, refetch } = (0, use_billing_1.useBillingUrl)(enableBilling && isCurrentWorkspaceManager);
    const openAsyncWindow = (0, use_async_window_open_1.useAsyncWindowOpen)();
    const handleOpenBilling = async () => {
        await openAsyncWindow(async () => {
            const url = (await refetch()).data;
            if (url)
                return url;
            return null;
        }, {
            immediateUrl: billingUrl,
            features: 'noopener,noreferrer',
            onError: (err) => {
                console.error('Failed to fetch billing url', err);
            },
        });
    };
    return (<div>
      <plan_1.default loc="billing-page"/>
      {enableBilling && isCurrentWorkspaceManager && (<button type="button" className="mt-3 flex w-full items-center justify-between rounded-xl bg-background-section-burn px-4 py-3" onClick={handleOpenBilling} disabled={isFetching}>
          <div className="flex flex-col gap-0.5 text-left">
            <div className="system-md-semibold text-text-primary">{t('viewBillingTitle', { ns: 'billing' })}</div>
            <div className="system-sm-regular text-text-secondary">{t('viewBillingDescription', { ns: 'billing' })}</div>
          </div>
          <span className="inline-flex h-8 w-24 items-center justify-center gap-0.5 rounded-lg border-[0.5px] border-components-button-secondary-border bg-components-button-secondary-bg px-3 py-2 text-saas-dify-blue-accessible shadow-[0_1px_2px_rgba(9,9,11,0.05)] backdrop-blur-[5px]">
            <span className="system-sm-medium leading-[1]">{t('viewBillingAction', { ns: 'billing' })}</span>
            <react_1.RiArrowRightUpLine className="h-4 w-4"/>
          </span>
        </button>)}
    </div>);
};
exports.default = React.memo(Billing);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiw0Q0FFeUI7QUFDekIsK0JBQThCO0FBQzlCLGlEQUE4QztBQUM5Qyx1REFBcUQ7QUFDckQsaUVBQStEO0FBQy9ELHlFQUFrRTtBQUNsRSx1REFBcUQ7QUFDckQsa0NBQThCO0FBRTlCLE1BQU0sT0FBTyxHQUFPLEdBQUcsRUFBRTtJQUN2QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLHlCQUF5QixFQUFFLEdBQUcsSUFBQSwyQkFBYSxHQUFFLENBQUE7SUFDckQsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLElBQUEscUNBQWtCLEdBQUUsQ0FBQTtJQUM5QyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSwyQkFBYSxFQUFDLGFBQWEsSUFBSSx5QkFBeUIsQ0FBQyxDQUFBO0lBQzNHLE1BQU0sZUFBZSxHQUFHLElBQUEsMENBQWtCLEdBQUUsQ0FBQTtJQUU1QyxNQUFNLGlCQUFpQixHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sZUFBZSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQy9CLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQTtZQUNsQyxJQUFJLEdBQUc7Z0JBQ0wsT0FBTyxHQUFHLENBQUE7WUFDWixPQUFPLElBQUksQ0FBQTtRQUNiLENBQUMsRUFBRTtZQUNELFlBQVksRUFBRSxVQUFVO1lBQ3hCLFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNuRCxDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFBO0lBRUQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUNGO01BQUEsQ0FBQyxjQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFDNUI7TUFBQSxDQUFDLGFBQWEsSUFBSSx5QkFBeUIsSUFBSSxDQUM3QyxDQUFDLE1BQU0sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQywrRkFBK0YsQ0FDekcsT0FBTyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FDM0IsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLENBRXJCO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlDQUFpQyxDQUM5QztZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUNyRztZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUM5RztVQUFBLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtRQUFrUSxDQUNoUjtZQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUNoRztZQUFBLENBQUMsMEJBQWtCLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFDekM7VUFBQSxFQUFFLElBQUksQ0FDUjtRQUFBLEVBQUUsTUFBTSxDQUFDLENBQ1YsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIFJpQXJyb3dSaWdodFVwTGluZSxcbn0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IHVzZVByb3ZpZGVyQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0J1xuaW1wb3J0IHsgdXNlQXN5bmNXaW5kb3dPcGVuIH0gZnJvbSAnQC9ob29rcy91c2UtYXN5bmMtd2luZG93LW9wZW4nXG5pbXBvcnQgeyB1c2VCaWxsaW5nVXJsIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1iaWxsaW5nJ1xuaW1wb3J0IFBsYW5Db21wIGZyb20gJy4uL3BsYW4nXG5cbmNvbnN0IEJpbGxpbmc6IEZDID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyBpc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyIH0gPSB1c2VBcHBDb250ZXh0KClcbiAgY29uc3QgeyBlbmFibGVCaWxsaW5nIH0gPSB1c2VQcm92aWRlckNvbnRleHQoKVxuICBjb25zdCB7IGRhdGE6IGJpbGxpbmdVcmwsIGlzRmV0Y2hpbmcsIHJlZmV0Y2ggfSA9IHVzZUJpbGxpbmdVcmwoZW5hYmxlQmlsbGluZyAmJiBpc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyKVxuICBjb25zdCBvcGVuQXN5bmNXaW5kb3cgPSB1c2VBc3luY1dpbmRvd09wZW4oKVxuXG4gIGNvbnN0IGhhbmRsZU9wZW5CaWxsaW5nID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IG9wZW5Bc3luY1dpbmRvdyhhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSAoYXdhaXQgcmVmZXRjaCgpKS5kYXRhXG4gICAgICBpZiAodXJsKVxuICAgICAgICByZXR1cm4gdXJsXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0sIHtcbiAgICAgIGltbWVkaWF0ZVVybDogYmlsbGluZ1VybCxcbiAgICAgIGZlYXR1cmVzOiAnbm9vcGVuZXIsbm9yZWZlcnJlcicsXG4gICAgICBvbkVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBiaWxsaW5nIHVybCcsIGVycilcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxQbGFuQ29tcCBsb2M9XCJiaWxsaW5nLXBhZ2VcIiAvPlxuICAgICAge2VuYWJsZUJpbGxpbmcgJiYgaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlciAmJiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJtdC0zIGZsZXggdy1mdWxsIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC14bCBiZy1iYWNrZ3JvdW5kLXNlY3Rpb24tYnVybiBweC00IHB5LTNcIlxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZU9wZW5CaWxsaW5nfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0ZldGNoaW5nfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC0wLjUgdGV4dC1sZWZ0XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1tZC1zZW1pYm9sZCB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KCd2aWV3QmlsbGluZ1RpdGxlJywgeyBuczogJ2JpbGxpbmcnIH0pfTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ3ZpZXdCaWxsaW5nRGVzY3JpcHRpb24nLCB7IG5zOiAnYmlsbGluZycgfSl9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaC04IHctMjQgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0wLjUgcm91bmRlZC1sZyBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1idXR0b24tc2Vjb25kYXJ5LWJvcmRlciBiZy1jb21wb25lbnRzLWJ1dHRvbi1zZWNvbmRhcnktYmcgcHgtMyBweS0yIHRleHQtc2Fhcy1kaWZ5LWJsdWUtYWNjZXNzaWJsZSBzaGFkb3ctWzBfMXB4XzJweF9yZ2JhKDksOSwxMSwwLjA1KV0gYmFja2Ryb3AtYmx1ci1bNXB4XVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBsZWFkaW5nLVsxXVwiPnt0KCd2aWV3QmlsbGluZ0FjdGlvbicsIHsgbnM6ICdiaWxsaW5nJyB9KX08L3NwYW4+XG4gICAgICAgICAgICA8UmlBcnJvd1JpZ2h0VXBMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQmlsbGluZylcbiJdfQ==