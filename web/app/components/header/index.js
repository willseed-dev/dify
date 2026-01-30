"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = require("next/link");
const react_1 = require("react");
const dify_logo_1 = require("@/app/components/base/logo/dify-logo");
const workplace_selector_1 = require("@/app/components/header/account-dropdown/workplace-selector");
const constants_1 = require("@/app/components/header/account-setting/constants");
const app_context_1 = require("@/context/app-context");
const global_public_context_1 = require("@/context/global-public-context");
const modal_context_1 = require("@/context/modal-context");
const provider_context_1 = require("@/context/provider-context");
const workspace_context_1 = require("@/context/workspace-context");
const use_breakpoints_1 = require("@/hooks/use-breakpoints");
const type_1 = require("../billing/type");
const account_dropdown_1 = require("./account-dropdown");
const app_nav_1 = require("./app-nav");
const dataset_nav_1 = require("./dataset-nav");
const env_nav_1 = require("./env-nav");
const explore_nav_1 = require("./explore-nav");
const license_env_1 = require("./license-env");
const plan_badge_1 = require("./plan-badge");
const plugins_nav_1 = require("./plugins-nav");
const tools_nav_1 = require("./tools-nav");
const navClassName = `
  flex items-center relative px-3 h-8 rounded-xl
  font-medium text-sm
  cursor-pointer
`;
const Header = () => {
    const { isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator } = (0, app_context_1.useAppContext)();
    const media = (0, use_breakpoints_1.default)();
    const isMobile = media === use_breakpoints_1.MediaType.mobile;
    const { enableBilling, plan } = (0, provider_context_1.useProviderContext)();
    const { setShowPricingModal, setShowAccountSettingModal } = (0, modal_context_1.useModalContext)();
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const isFreePlan = plan.type === type_1.Plan.sandbox;
    const isBrandingEnabled = systemFeatures.branding.enabled;
    const handlePlanClick = (0, react_1.useCallback)(() => {
        if (isFreePlan)
            setShowPricingModal();
        else
            setShowAccountSettingModal({ payload: constants_1.ACCOUNT_SETTING_TAB.BILLING });
    }, [isFreePlan, setShowAccountSettingModal, setShowPricingModal]);
    const renderLogo = () => (<h1>
      <link_1.default href="/apps" className="flex h-8 shrink-0 items-center justify-center overflow-hidden whitespace-nowrap px-0.5 indent-[-9999px]">
        {isBrandingEnabled && systemFeatures.branding.application_title ? systemFeatures.branding.application_title : 'Dify'}
        {systemFeatures.branding.enabled && systemFeatures.branding.workspace_logo
            ? (<img src={systemFeatures.branding.workspace_logo} className="block h-[22px] w-auto object-contain" alt="logo"/>)
            : <dify_logo_1.default />}
      </link_1.default>
    </h1>);
    if (isMobile) {
        return (<div className="">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center">
            {renderLogo()}
            <div className="mx-1.5 shrink-0 font-light text-divider-deep">/</div>
            <workspace_context_1.WorkspaceProvider>
              <workplace_selector_1.default />
            </workspace_context_1.WorkspaceProvider>
            {enableBilling ? <plan_badge_1.default allowHover sandboxAsUpgrade plan={plan.type} onClick={handlePlanClick}/> : <license_env_1.default />}
          </div>
          <div className="flex items-center">
            <div className="mr-2">
              <plugins_nav_1.default />
            </div>
            <account_dropdown_1.default />
          </div>
        </div>
        <div className="my-1 flex items-center justify-center space-x-1">
          {!isCurrentWorkspaceDatasetOperator && <explore_nav_1.default className={navClassName}/>}
          {!isCurrentWorkspaceDatasetOperator && <app_nav_1.default />}
          {(isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator) && <dataset_nav_1.default />}
          {!isCurrentWorkspaceDatasetOperator && <tools_nav_1.default className={navClassName}/>}
        </div>
      </div>);
    }
    return (<div className="flex h-[56px] items-center">
      <div className="flex min-w-0 flex-[1]  items-center pl-3 pr-2 min-[1280px]:pr-3">
        {renderLogo()}
        <div className="mx-1.5 shrink-0 font-light text-divider-deep">/</div>
        <workspace_context_1.WorkspaceProvider>
          <workplace_selector_1.default />
        </workspace_context_1.WorkspaceProvider>
        {enableBilling ? <plan_badge_1.default allowHover sandboxAsUpgrade plan={plan.type} onClick={handlePlanClick}/> : <license_env_1.default />}
      </div>
      <div className="flex items-center space-x-2">
        {!isCurrentWorkspaceDatasetOperator && <explore_nav_1.default className={navClassName}/>}
        {!isCurrentWorkspaceDatasetOperator && <app_nav_1.default />}
        {(isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator) && <dataset_nav_1.default />}
        {!isCurrentWorkspaceDatasetOperator && <tools_nav_1.default className={navClassName}/>}
      </div>
      <div className="flex min-w-0 flex-[1] items-center justify-end pl-2 pr-3 min-[1280px]:pl-3">
        <env_nav_1.default />
        <div className="mr-2">
          <plugins_nav_1.default />
        </div>
        <account_dropdown_1.default />
      </div>
    </div>);
};
exports.default = Header;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFDWixvQ0FBNEI7QUFDNUIsaUNBQW1DO0FBQ25DLG9FQUEyRDtBQUMzRCxvR0FBMkY7QUFDM0YsaUZBQXVGO0FBQ3ZGLHVEQUFxRDtBQUNyRCwyRUFBc0U7QUFDdEUsMkRBQXlEO0FBQ3pELGlFQUErRDtBQUMvRCxtRUFBK0Q7QUFDL0QsNkRBQW1FO0FBQ25FLDBDQUFzQztBQUN0Qyx5REFBZ0Q7QUFDaEQsdUNBQThCO0FBQzlCLCtDQUFzQztBQUN0Qyx1Q0FBOEI7QUFDOUIsK0NBQXNDO0FBQ3RDLCtDQUFzQztBQUN0Qyw2Q0FBb0M7QUFDcEMsK0NBQXNDO0FBQ3RDLDJDQUFrQztBQUVsQyxNQUFNLFlBQVksR0FBRzs7OztDQUlwQixDQUFBO0FBRUQsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFO0lBQ2xCLE1BQU0sRUFBRSx3QkFBd0IsRUFBRSxpQ0FBaUMsRUFBRSxHQUFHLElBQUEsMkJBQWEsR0FBRSxDQUFBO0lBQ3ZGLE1BQU0sS0FBSyxHQUFHLElBQUEseUJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sUUFBUSxHQUFHLEtBQUssS0FBSywyQkFBUyxDQUFDLE1BQU0sQ0FBQTtJQUMzQyxNQUFNLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUEscUNBQWtCLEdBQUUsQ0FBQTtJQUNwRCxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsMEJBQTBCLEVBQUUsR0FBRyxJQUFBLCtCQUFlLEdBQUUsQ0FBQTtJQUM3RSxNQUFNLGNBQWMsR0FBRyxJQUFBLDRDQUFvQixFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBSSxDQUFDLE9BQU8sQ0FBQTtJQUM3QyxNQUFNLGlCQUFpQixH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QUMsWUFBWSxDQUFDLEVBQUcsQ0FDOUU7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0RUFBNEUsQ0FDekY7UUFBQSxDQUFDLGlCQUFNLENBQUMsQUFBRCxFQUNQO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDbkI7VUFBQSxDQUFDLHFCQUFVLENBQUMsQUFBRCxFQUNiO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLDBCQUFlLENBQUMsQUFBRCxFQUNsQjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgTGluayBmcm9tICduZXh0L2xpbmsnXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IERpZnlMb2dvIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2dvL2RpZnktbG9nbydcbmltcG9ydCBXb3JrcGxhY2VTZWxlY3RvciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LWRyb3Bkb3duL3dvcmtwbGFjZS1zZWxlY3RvcidcbmltcG9ydCB7IEFDQ09VTlRfU0VUVElOR19UQUIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvY29uc3RhbnRzJ1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IHVzZUdsb2JhbFB1YmxpY1N0b3JlIH0gZnJvbSAnQC9jb250ZXh0L2dsb2JhbC1wdWJsaWMtY29udGV4dCdcbmltcG9ydCB7IHVzZU1vZGFsQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlUHJvdmlkZXJDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgeyBXb3Jrc3BhY2VQcm92aWRlciB9IGZyb20gJ0AvY29udGV4dC93b3Jrc3BhY2UtY29udGV4dCdcbmltcG9ydCB1c2VCcmVha3BvaW50cywgeyBNZWRpYVR5cGUgfSBmcm9tICdAL2hvb2tzL3VzZS1icmVha3BvaW50cydcbmltcG9ydCB7IFBsYW4gfSBmcm9tICcuLi9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgQWNjb3VudERyb3Bkb3duIGZyb20gJy4vYWNjb3VudC1kcm9wZG93bidcbmltcG9ydCBBcHBOYXYgZnJvbSAnLi9hcHAtbmF2J1xuaW1wb3J0IERhdGFzZXROYXYgZnJvbSAnLi9kYXRhc2V0LW5hdidcbmltcG9ydCBFbnZOYXYgZnJvbSAnLi9lbnYtbmF2J1xuaW1wb3J0IEV4cGxvcmVOYXYgZnJvbSAnLi9leHBsb3JlLW5hdidcbmltcG9ydCBMaWNlbnNlTmF2IGZyb20gJy4vbGljZW5zZS1lbnYnXG5pbXBvcnQgUGxhbkJhZGdlIGZyb20gJy4vcGxhbi1iYWRnZSdcbmltcG9ydCBQbHVnaW5zTmF2IGZyb20gJy4vcGx1Z2lucy1uYXYnXG5pbXBvcnQgVG9vbHNOYXYgZnJvbSAnLi90b29scy1uYXYnXG5cbmNvbnN0IG5hdkNsYXNzTmFtZSA9IGBcbiAgZmxleCBpdGVtcy1jZW50ZXIgcmVsYXRpdmUgcHgtMyBoLTggcm91bmRlZC14bFxuICBmb250LW1lZGl1bSB0ZXh0LXNtXG4gIGN1cnNvci1wb2ludGVyXG5gXG5cbmNvbnN0IEhlYWRlciA9ICgpID0+IHtcbiAgY29uc3QgeyBpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3IsIGlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvciB9ID0gdXNlQXBwQ29udGV4dCgpXG4gIGNvbnN0IG1lZGlhID0gdXNlQnJlYWtwb2ludHMoKVxuICBjb25zdCBpc01vYmlsZSA9IG1lZGlhID09PSBNZWRpYVR5cGUubW9iaWxlXG4gIGNvbnN0IHsgZW5hYmxlQmlsbGluZywgcGxhbiB9ID0gdXNlUHJvdmlkZXJDb250ZXh0KClcbiAgY29uc3QgeyBzZXRTaG93UHJpY2luZ01vZGFsLCBzZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCB9ID0gdXNlTW9kYWxDb250ZXh0KClcbiAgY29uc3Qgc3lzdGVtRmVhdHVyZXMgPSB1c2VHbG9iYWxQdWJsaWNTdG9yZShzID0+IHMuc3lzdGVtRmVhdHVyZXMpXG4gIGNvbnN0IGlzRnJlZVBsYW4gPSBwbGFuLnR5cGUgPT09IFBsYW4uc2FuZGJveFxuICBjb25zdCBpc0JyYW5kaW5nRW5hYmxlZCA9IHN5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLmVuYWJsZWRcbiAgY29uc3QgaGFuZGxlUGxhbkNsaWNrID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChpc0ZyZWVQbGFuKVxuICAgICAgc2V0U2hvd1ByaWNpbmdNb2RhbCgpXG4gICAgZWxzZVxuICAgICAgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwoeyBwYXlsb2FkOiBBQ0NPVU5UX1NFVFRJTkdfVEFCLkJJTExJTkcgfSlcbiAgfSwgW2lzRnJlZVBsYW4sIHNldFNob3dBY2NvdW50U2V0dGluZ01vZGFsLCBzZXRTaG93UHJpY2luZ01vZGFsXSlcblxuICBjb25zdCByZW5kZXJMb2dvID0gKCkgPT4gKFxuICAgIDxoMT5cbiAgICAgIDxMaW5rIGhyZWY9XCIvYXBwc1wiIGNsYXNzTmFtZT1cImZsZXggaC04IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBvdmVyZmxvdy1oaWRkZW4gd2hpdGVzcGFjZS1ub3dyYXAgcHgtMC41IGluZGVudC1bLTk5OTlweF1cIj5cbiAgICAgICAge2lzQnJhbmRpbmdFbmFibGVkICYmIHN5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLmFwcGxpY2F0aW9uX3RpdGxlID8gc3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcuYXBwbGljYXRpb25fdGl0bGUgOiAnRGlmeSd9XG4gICAgICAgIHtzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy5lbmFibGVkICYmIHN5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLndvcmtzcGFjZV9sb2dvXG4gICAgICAgICAgPyAoXG4gICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICBzcmM9e3N5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLndvcmtzcGFjZV9sb2dvfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJsb2NrIGgtWzIycHhdIHctYXV0byBvYmplY3QtY29udGFpblwiXG4gICAgICAgICAgICAgICAgYWx0PVwibG9nb1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApXG4gICAgICAgICAgOiA8RGlmeUxvZ28gLz59XG4gICAgICA8L0xpbms+XG4gICAgPC9oMT5cbiAgKVxuXG4gIGlmIChpc01vYmlsZSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC0yXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAge3JlbmRlckxvZ28oKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtMS41IHNocmluay0wIGZvbnQtbGlnaHQgdGV4dC1kaXZpZGVyLWRlZXBcIj4vPC9kaXY+XG4gICAgICAgICAgICA8V29ya3NwYWNlUHJvdmlkZXI+XG4gICAgICAgICAgICAgIDxXb3JrcGxhY2VTZWxlY3RvciAvPlxuICAgICAgICAgICAgPC9Xb3Jrc3BhY2VQcm92aWRlcj5cbiAgICAgICAgICAgIHtlbmFibGVCaWxsaW5nID8gPFBsYW5CYWRnZSBhbGxvd0hvdmVyIHNhbmRib3hBc1VwZ3JhZGUgcGxhbj17cGxhbi50eXBlfSBvbkNsaWNrPXtoYW5kbGVQbGFuQ2xpY2t9IC8+IDogPExpY2Vuc2VOYXYgLz59XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtci0yXCI+XG4gICAgICAgICAgICAgIDxQbHVnaW5zTmF2IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxBY2NvdW50RHJvcGRvd24gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXktMSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBzcGFjZS14LTFcIj5cbiAgICAgICAgICB7IWlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvciAmJiA8RXhwbG9yZU5hdiBjbGFzc05hbWU9e25hdkNsYXNzTmFtZX0gLz59XG4gICAgICAgICAgeyFpc0N1cnJlbnRXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3IgJiYgPEFwcE5hdiAvPn1cbiAgICAgICAgICB7KGlzQ3VycmVudFdvcmtzcGFjZUVkaXRvciB8fCBpc0N1cnJlbnRXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3IpICYmIDxEYXRhc2V0TmF2IC8+fVxuICAgICAgICAgIHshaXNDdXJyZW50V29ya3NwYWNlRGF0YXNldE9wZXJhdG9yICYmIDxUb29sc05hdiBjbGFzc05hbWU9e25hdkNsYXNzTmFtZX0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1bNTZweF0gaXRlbXMtY2VudGVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggbWluLXctMCBmbGV4LVsxXSAgaXRlbXMtY2VudGVyIHBsLTMgcHItMiBtaW4tWzEyODBweF06cHItM1wiPlxuICAgICAgICB7cmVuZGVyTG9nbygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14LTEuNSBzaHJpbmstMCBmb250LWxpZ2h0IHRleHQtZGl2aWRlci1kZWVwXCI+LzwvZGl2PlxuICAgICAgICA8V29ya3NwYWNlUHJvdmlkZXI+XG4gICAgICAgICAgPFdvcmtwbGFjZVNlbGVjdG9yIC8+XG4gICAgICAgIDwvV29ya3NwYWNlUHJvdmlkZXI+XG4gICAgICAgIHtlbmFibGVCaWxsaW5nID8gPFBsYW5CYWRnZSBhbGxvd0hvdmVyIHNhbmRib3hBc1VwZ3JhZGUgcGxhbj17cGxhbi50eXBlfSBvbkNsaWNrPXtoYW5kbGVQbGFuQ2xpY2t9IC8+IDogPExpY2Vuc2VOYXYgLz59XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0yXCI+XG4gICAgICAgIHshaXNDdXJyZW50V29ya3NwYWNlRGF0YXNldE9wZXJhdG9yICYmIDxFeHBsb3JlTmF2IGNsYXNzTmFtZT17bmF2Q2xhc3NOYW1lfSAvPn1cbiAgICAgICAgeyFpc0N1cnJlbnRXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3IgJiYgPEFwcE5hdiAvPn1cbiAgICAgICAgeyhpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3IgfHwgaXNDdXJyZW50V29ya3NwYWNlRGF0YXNldE9wZXJhdG9yKSAmJiA8RGF0YXNldE5hdiAvPn1cbiAgICAgICAgeyFpc0N1cnJlbnRXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3IgJiYgPFRvb2xzTmF2IGNsYXNzTmFtZT17bmF2Q2xhc3NOYW1lfSAvPn1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IG1pbi13LTAgZmxleC1bMV0gaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIHBsLTIgcHItMyBtaW4tWzEyODBweF06cGwtM1wiPlxuICAgICAgICA8RW52TmF2IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXItMlwiPlxuICAgICAgICAgIDxQbHVnaW5zTmF2IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8QWNjb3VudERyb3Bkb3duIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyXG4iXX0=