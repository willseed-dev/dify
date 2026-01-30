"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const progress_bar_1 = require("@/app/components/billing/progress-bar");
const type_1 = require("@/app/components/billing/type");
const util_1 = require("@/app/components/header/utils/util");
const app_context_1 = require("@/context/app-context");
const provider_context_1 = require("@/context/provider-context");
const classnames_1 = require("@/utils/classnames");
const upgrade_btn_1 = require("../upgrade-btn");
const style_module_css_1 = require("./style.module.css");
const LOW = 50;
const MIDDLE = 80;
const AppsFull = ({ loc, className, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { plan } = (0, provider_context_1.useProviderContext)();
    const { userProfile, langGeniusVersionInfo } = (0, app_context_1.useAppContext)();
    const isTeam = plan.type === type_1.Plan.team;
    const usage = plan.usage.buildApps;
    const total = plan.total.buildApps;
    const percent = usage / total * 100;
    const color = (() => {
        if (percent < LOW)
            return 'bg-components-progress-bar-progress-solid';
        if (percent < MIDDLE)
            return 'bg-components-progress-warning-progress';
        return 'bg-components-progress-error-progress';
    })();
    return (<div className={(0, classnames_1.cn)('flex flex-col gap-3 rounded-xl border-[0.5px] border-components-panel-border-subtle bg-components-panel-on-panel-item-bg p-4 shadow-xs backdrop-blur-sm', className)}>
      <div className="flex justify-between">
        {!isTeam && (<div>
            <div className={(0, classnames_1.cn)('title-xl-semi-bold mb-1', style_module_css_1.default.textGradient)}>
              {t('apps.fullTip1', { ns: 'billing' })}
            </div>
            <div className="system-xs-regular text-text-tertiary">{t('apps.fullTip1des', { ns: 'billing' })}</div>
          </div>)}
        {isTeam && (<div>
            <div className={(0, classnames_1.cn)('title-xl-semi-bold mb-1', style_module_css_1.default.textGradient)}>
              {t('apps.fullTip2', { ns: 'billing' })}
            </div>
            <div className="system-xs-regular text-text-tertiary">{t('apps.fullTip2des', { ns: 'billing' })}</div>
          </div>)}
        {(plan.type === type_1.Plan.sandbox || plan.type === type_1.Plan.professional) && (<upgrade_btn_1.default isShort loc={loc}/>)}
        {plan.type !== type_1.Plan.sandbox && plan.type !== type_1.Plan.professional && (<button_1.default variant="secondary-accent">
            <a target="_blank" rel="noopener noreferrer" href={(0, util_1.mailToSupport)(userProfile.email, plan.type, langGeniusVersionInfo.current_version)}>
              {t('apps.contactUs', { ns: 'billing' })}
            </a>
          </button_1.default>)}
      </div>
      <div className="flex flex-col gap-2">
        <div className="system-xs-medium flex items-center justify-between text-text-secondary">
          <div>{t('usagePage.buildApps', { ns: 'billing' })}</div>
          <div>
            {usage}
            /
            {total}
          </div>
        </div>
        <progress_bar_1.default percent={percent} color={color}/>
      </div>
    </div>);
};
exports.default = React.memo(AppsFull);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCx3RUFBK0Q7QUFDL0Qsd0RBQW9EO0FBQ3BELDZEQUFrRTtBQUNsRSx1REFBcUQ7QUFDckQsaUVBQStEO0FBQy9ELG1EQUF1QztBQUN2QyxnREFBdUM7QUFDdkMseURBQWtDO0FBRWxDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQTtBQUNkLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtBQUVqQixNQUFNLFFBQVEsR0FBNEMsQ0FBQyxFQUN6RCxHQUFHLEVBQ0gsU0FBUyxHQUNWLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBQSxxQ0FBa0IsR0FBRSxDQUFBO0lBQ3JDLE1BQU0sRUFBRSxXQUFXLEVBQUUscUJBQXFCLEVBQUUsR0FBRyxJQUFBLDJCQUFhLEdBQUUsQ0FBQTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQUksQ0FBQyxJQUFJLENBQUE7SUFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUE7SUFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUE7SUFDbEMsTUFBTSxPQUFPLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUE7SUFDbkMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUU7UUFDbEIsSUFBSSxPQUFPLEdBQUcsR0FBRztZQUNmLE9BQU8sMkNBQTJDLENBQUE7UUFFcEQsSUFBSSxPQUFPLEdBQUcsTUFBTTtZQUNsQixPQUFPLHlDQUF5QyxDQUFBO1FBRWxELE9BQU8sdUNBQXVDLENBQUE7SUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNKLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFDaEIseUpBQXlKLEVBQ3pKLFNBQVMsQ0FDVixDQUFDLENBRUE7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQ25DO1FBQUEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUNWLENBQUMsR0FBRyxDQUNGO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMseUJBQXlCLEVBQUUsMEJBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUM1RDtjQUFBLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUN4QztZQUFBLEVBQUUsR0FBRyxDQUNMO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQ3ZHO1VBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNEO1FBQUEsQ0FBQyxNQUFNLElBQUksQ0FDVCxDQUFDLEdBQUcsQ0FDRjtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHlCQUF5QixFQUFFLDBCQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FDNUQ7Y0FBQSxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FDeEM7WUFBQSxFQUFFLEdBQUcsQ0FDTDtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUN2RztVQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDRDtRQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxXQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FDbEUsQ0FBQyxxQkFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRyxDQUNqQyxDQUNEO1FBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxXQUFJLENBQUMsWUFBWSxJQUFJLENBQ2hFLENBQUMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQ2hDO1lBQUEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBQSxvQkFBYSxFQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUNwSTtjQUFBLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQ3pDO1lBQUEsRUFBRSxDQUFDLENBQ0w7VUFBQSxFQUFFLGdCQUFNLENBQUMsQ0FDVixDQUNIO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQ2xDO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdFQUF3RSxDQUNyRjtVQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQ3ZEO1VBQUEsQ0FBQyxHQUFHLENBQ0Y7WUFBQSxDQUFDLEtBQUssQ0FDTjs7WUFDQSxDQUFDLEtBQUssQ0FDUjtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLHNCQUFXLENBQ1YsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pCLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUVqQjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgUHJvZ3Jlc3NCYXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3Byb2dyZXNzLWJhcidcbmltcG9ydCB7IFBsYW4gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2JpbGxpbmcvdHlwZSdcbmltcG9ydCB7IG1haWxUb1N1cHBvcnQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci91dGlscy91dGlsJ1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IHVzZVByb3ZpZGVyQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0J1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgVXBncmFkZUJ0biBmcm9tICcuLi91cGdyYWRlLWJ0bidcbmltcG9ydCBzIGZyb20gJy4vc3R5bGUubW9kdWxlLmNzcydcblxuY29uc3QgTE9XID0gNTBcbmNvbnN0IE1JRERMRSA9IDgwXG5cbmNvbnN0IEFwcHNGdWxsOiBGQzx7IGxvYzogc3RyaW5nLCBjbGFzc05hbWU/OiBzdHJpbmcgfT4gPSAoe1xuICBsb2MsXG4gIGNsYXNzTmFtZSxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgcGxhbiB9ID0gdXNlUHJvdmlkZXJDb250ZXh0KClcbiAgY29uc3QgeyB1c2VyUHJvZmlsZSwgbGFuZ0dlbml1c1ZlcnNpb25JbmZvIH0gPSB1c2VBcHBDb250ZXh0KClcbiAgY29uc3QgaXNUZWFtID0gcGxhbi50eXBlID09PSBQbGFuLnRlYW1cbiAgY29uc3QgdXNhZ2UgPSBwbGFuLnVzYWdlLmJ1aWxkQXBwc1xuICBjb25zdCB0b3RhbCA9IHBsYW4udG90YWwuYnVpbGRBcHBzXG4gIGNvbnN0IHBlcmNlbnQgPSB1c2FnZSAvIHRvdGFsICogMTAwXG4gIGNvbnN0IGNvbG9yID0gKCgpID0+IHtcbiAgICBpZiAocGVyY2VudCA8IExPVylcbiAgICAgIHJldHVybiAnYmctY29tcG9uZW50cy1wcm9ncmVzcy1iYXItcHJvZ3Jlc3Mtc29saWQnXG5cbiAgICBpZiAocGVyY2VudCA8IE1JRERMRSlcbiAgICAgIHJldHVybiAnYmctY29tcG9uZW50cy1wcm9ncmVzcy13YXJuaW5nLXByb2dyZXNzJ1xuXG4gICAgcmV0dXJuICdiZy1jb21wb25lbnRzLXByb2dyZXNzLWVycm9yLXByb2dyZXNzJ1xuICB9KSgpXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgJ2ZsZXggZmxleC1jb2wgZ2FwLTMgcm91bmRlZC14bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtb24tcGFuZWwtaXRlbS1iZyBwLTQgc2hhZG93LXhzIGJhY2tkcm9wLWJsdXItc20nLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICl9XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICB7IWlzVGVhbSAmJiAoXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbigndGl0bGUteGwtc2VtaS1ib2xkIG1iLTEnLCBzLnRleHRHcmFkaWVudCl9PlxuICAgICAgICAgICAgICB7dCgnYXBwcy5mdWxsVGlwMScsIHsgbnM6ICdiaWxsaW5nJyB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj57dCgnYXBwcy5mdWxsVGlwMWRlcycsIHsgbnM6ICdiaWxsaW5nJyB9KX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge2lzVGVhbSAmJiAoXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbigndGl0bGUteGwtc2VtaS1ib2xkIG1iLTEnLCBzLnRleHRHcmFkaWVudCl9PlxuICAgICAgICAgICAgICB7dCgnYXBwcy5mdWxsVGlwMicsIHsgbnM6ICdiaWxsaW5nJyB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj57dCgnYXBwcy5mdWxsVGlwMmRlcycsIHsgbnM6ICdiaWxsaW5nJyB9KX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgeyhwbGFuLnR5cGUgPT09IFBsYW4uc2FuZGJveCB8fCBwbGFuLnR5cGUgPT09IFBsYW4ucHJvZmVzc2lvbmFsKSAmJiAoXG4gICAgICAgICAgPFVwZ3JhZGVCdG4gaXNTaG9ydCBsb2M9e2xvY30gLz5cbiAgICAgICAgKX1cbiAgICAgICAge3BsYW4udHlwZSAhPT0gUGxhbi5zYW5kYm94ICYmIHBsYW4udHlwZSAhPT0gUGxhbi5wcm9mZXNzaW9uYWwgJiYgKFxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInNlY29uZGFyeS1hY2NlbnRcIj5cbiAgICAgICAgICAgIDxhIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBocmVmPXttYWlsVG9TdXBwb3J0KHVzZXJQcm9maWxlLmVtYWlsLCBwbGFuLnR5cGUsIGxhbmdHZW5pdXNWZXJzaW9uSW5mby5jdXJyZW50X3ZlcnNpb24pfT5cbiAgICAgICAgICAgICAge3QoJ2FwcHMuY29udGFjdFVzJywgeyBuczogJ2JpbGxpbmcnIH0pfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtbWVkaXVtIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgPGRpdj57dCgndXNhZ2VQYWdlLmJ1aWxkQXBwcycsIHsgbnM6ICdiaWxsaW5nJyB9KX08L2Rpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge3VzYWdlfVxuICAgICAgICAgICAgL1xuICAgICAgICAgICAge3RvdGFsfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFByb2dyZXNzQmFyXG4gICAgICAgICAgcGVyY2VudD17cGVyY2VudH1cbiAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhBcHBzRnVsbClcbiJdfQ==