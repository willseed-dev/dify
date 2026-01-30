"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const variable_modal_1 = require("@/app/components/workflow/panel/env-panel/variable-modal");
const VariableTrigger = ({ open, setOpen, env, onClose, onSave, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<portal_to_follow_elem_1.PortalToFollowElem open={open} onOpenChange={() => {
            setOpen(v => !v);
            if (open)
                onClose();
        }} placement="left-start" offset={{
            mainAxis: 8,
            alignmentAxis: -104,
        }}>
      <portal_to_follow_elem_1.PortalToFollowElemTrigger onClick={() => {
            setOpen(v => !v);
            if (open)
                onClose();
        }}>
        <button_1.default variant="primary">
          <react_1.RiAddLine className="mr-1 h-4 w-4"/>
          <span className="system-sm-medium">{t('env.envPanelButton', { ns: 'workflow' })}</span>
        </button_1.default>
      </portal_to_follow_elem_1.PortalToFollowElemTrigger>
      <portal_to_follow_elem_1.PortalToFollowElemContent className="z-[11]">
        <variable_modal_1.default env={env} onSave={onSave} onClose={() => {
            onClose();
            setOpen(false);
        }}/>
      </portal_to_follow_elem_1.PortalToFollowElemContent>
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.default = VariableTrigger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtdHJpZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhcmlhYmxlLXRyaWdnZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBRVosNENBQTRDO0FBQzVDLCtCQUE4QjtBQUM5QixpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELHVGQUlvRDtBQUNwRCw2RkFBb0Y7QUFVcEYsTUFBTSxlQUFlLEdBQUcsQ0FBQyxFQUN2QixJQUFJLEVBQ0osT0FBTyxFQUNQLEdBQUcsRUFDSCxPQUFPLEVBQ1AsTUFBTSxHQUNBLEVBQUUsRUFBRTtJQUNWLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixPQUFPLENBQ0wsQ0FBQywwQ0FBa0IsQ0FDakIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ1gsWUFBWSxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEIsSUFBSSxJQUFJO2dCQUNOLE9BQU8sRUFBRSxDQUFBO1FBQ2IsQ0FBQyxDQUFDLENBQ0YsU0FBUyxDQUFDLFlBQVksQ0FDdEIsTUFBTSxDQUFDLENBQUM7WUFDTixRQUFRLEVBQUUsQ0FBQztZQUNYLGFBQWEsRUFBRSxDQUFDLEdBQUc7U0FDcEIsQ0FBQyxDQUVGO01BQUEsQ0FBQyxpREFBeUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUU7WUFDdkMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoQixJQUFJLElBQUk7Z0JBQ04sT0FBTyxFQUFFLENBQUE7UUFDYixDQUFDLENBQUMsQ0FFQTtRQUFBLENBQUMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUN2QjtVQUFBLENBQUMsaUJBQVMsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUNuQztVQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUN4RjtRQUFBLEVBQUUsZ0JBQU0sQ0FDVjtNQUFBLEVBQUUsaURBQXlCLENBQzNCO01BQUEsQ0FBQyxpREFBeUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUMzQztRQUFBLENBQUMsd0JBQWEsQ0FDWixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDVCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDZixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUU7WUFDWixPQUFPLEVBQUUsQ0FBQTtZQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNoQixDQUFDLENBQUMsRUFFTjtNQUFBLEVBQUUsaURBQXlCLENBQzdCO0lBQUEsRUFBRSwwQ0FBa0IsQ0FBQyxDQUN0QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsZUFBZSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEVudmlyb25tZW50VmFyaWFibGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgUmlBZGRMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IHtcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtLFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50LFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcG9ydGFsLXRvLWZvbGxvdy1lbGVtJ1xuaW1wb3J0IFZhcmlhYmxlTW9kYWwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9wYW5lbC9lbnYtcGFuZWwvdmFyaWFibGUtbW9kYWwnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG9wZW46IGJvb2xlYW5cbiAgc2V0T3BlbjogKHZhbHVlOiBSZWFjdC5TZXRTdGF0ZUFjdGlvbjxib29sZWFuPikgPT4gdm9pZFxuICBlbnY/OiBFbnZpcm9ubWVudFZhcmlhYmxlXG4gIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgb25TYXZlOiAoZW52OiBFbnZpcm9ubWVudFZhcmlhYmxlKSA9PiB2b2lkXG59XG5cbmNvbnN0IFZhcmlhYmxlVHJpZ2dlciA9ICh7XG4gIG9wZW4sXG4gIHNldE9wZW4sXG4gIGVudixcbiAgb25DbG9zZSxcbiAgb25TYXZlLFxufTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgcmV0dXJuIChcbiAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtXG4gICAgICBvcGVuPXtvcGVufVxuICAgICAgb25PcGVuQ2hhbmdlPXsoKSA9PiB7XG4gICAgICAgIHNldE9wZW4odiA9PiAhdilcbiAgICAgICAgaWYgKG9wZW4pXG4gICAgICAgICAgb25DbG9zZSgpXG4gICAgICB9fVxuICAgICAgcGxhY2VtZW50PVwibGVmdC1zdGFydFwiXG4gICAgICBvZmZzZXQ9e3tcbiAgICAgICAgbWFpbkF4aXM6IDgsXG4gICAgICAgIGFsaWdubWVudEF4aXM6IC0xMDQsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgc2V0T3Blbih2ID0+ICF2KVxuICAgICAgICBpZiAob3BlbilcbiAgICAgICAgICBvbkNsb3NlKClcbiAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cInByaW1hcnlcIj5cbiAgICAgICAgICA8UmlBZGRMaW5lIGNsYXNzTmFtZT1cIm1yLTEgaC00IHctNFwiIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bVwiPnt0KCdlbnYuZW52UGFuZWxCdXR0b24nLCB7IG5zOiAnd29ya2Zsb3cnIH0pfTwvc3Bhbj5cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCBjbGFzc05hbWU9XCJ6LVsxMV1cIj5cbiAgICAgICAgPFZhcmlhYmxlTW9kYWxcbiAgICAgICAgICBlbnY9e2Vudn1cbiAgICAgICAgICBvblNhdmU9e29uU2F2ZX1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgICBvbkNsb3NlKClcbiAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudD5cbiAgICA8L1BvcnRhbFRvRm9sbG93RWxlbT5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBWYXJpYWJsZVRyaWdnZXJcbiJdfQ==