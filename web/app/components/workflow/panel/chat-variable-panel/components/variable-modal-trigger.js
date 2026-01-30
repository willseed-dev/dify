"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const variable_modal_1 = require("@/app/components/workflow/panel/chat-variable-panel/components/variable-modal");
const VariableModalTrigger = ({ open, setOpen, showTip, chatVar, onClose, onSave, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<portal_to_follow_elem_1.PortalToFollowElem open={open} onOpenChange={() => {
            setOpen(v => !v);
            if (open)
                onClose();
        }} placement="left-start" offset={{
            mainAxis: 8,
            alignmentAxis: showTip ? -278 : -48,
        }}>
      <portal_to_follow_elem_1.PortalToFollowElemTrigger onClick={() => {
            setOpen(v => !v);
            if (open)
                onClose();
        }}>
        <button_1.default variant="primary">
          <react_1.RiAddLine className="mr-1 h-4 w-4"/>
          <span className="system-sm-medium">{t('chatVariable.button', { ns: 'workflow' })}</span>
        </button_1.default>
      </portal_to_follow_elem_1.PortalToFollowElemTrigger>
      <portal_to_follow_elem_1.PortalToFollowElemContent className="z-[11]">
        <variable_modal_1.default chatVar={chatVar} onSave={onSave} onClose={() => {
            onClose();
            setOpen(false);
        }}/>
      </portal_to_follow_elem_1.PortalToFollowElemContent>
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.default = VariableModalTrigger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtbW9kYWwtdHJpZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhcmlhYmxlLW1vZGFsLXRyaWdnZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBRVosNENBQTRDO0FBQzVDLCtCQUE4QjtBQUM5QixpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELHVGQUlvRDtBQUNwRCxrSEFBeUc7QUFXekcsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEVBQzVCLElBQUksRUFDSixPQUFPLEVBQ1AsT0FBTyxFQUNQLE9BQU8sRUFDUCxPQUFPLEVBQ1AsTUFBTSxHQUNBLEVBQUUsRUFBRTtJQUNWLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixPQUFPLENBQ0wsQ0FBQywwQ0FBa0IsQ0FDakIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ1gsWUFBWSxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEIsSUFBSSxJQUFJO2dCQUNOLE9BQU8sRUFBRSxDQUFBO1FBQ2IsQ0FBQyxDQUFDLENBQ0YsU0FBUyxDQUFDLFlBQVksQ0FDdEIsTUFBTSxDQUFDLENBQUM7WUFDTixRQUFRLEVBQUUsQ0FBQztZQUNYLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDcEMsQ0FBQyxDQUVGO01BQUEsQ0FBQyxpREFBeUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUU7WUFDdkMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoQixJQUFJLElBQUk7Z0JBQ04sT0FBTyxFQUFFLENBQUE7UUFDYixDQUFDLENBQUMsQ0FFQTtRQUFBLENBQUMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUN2QjtVQUFBLENBQUMsaUJBQVMsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUNuQztVQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUN6RjtRQUFBLEVBQUUsZ0JBQU0sQ0FDVjtNQUFBLEVBQUUsaURBQXlCLENBQzNCO01BQUEsQ0FBQyxpREFBeUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUMzQztRQUFBLENBQUMsd0JBQWEsQ0FDWixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDakIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ2YsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ1osT0FBTyxFQUFFLENBQUE7WUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDaEIsQ0FBQyxDQUFDLEVBRU47TUFBQSxFQUFFLGlEQUF5QixDQUM3QjtJQUFBLEVBQUUsMENBQWtCLENBQUMsQ0FDdEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLG9CQUFvQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblZhcmlhYmxlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IFJpQWRkTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCB7XG4gIFBvcnRhbFRvRm9sbG93RWxlbSxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbSdcbmltcG9ydCBWYXJpYWJsZU1vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcGFuZWwvY2hhdC12YXJpYWJsZS1wYW5lbC9jb21wb25lbnRzL3ZhcmlhYmxlLW1vZGFsJ1xuXG50eXBlIFByb3BzID0ge1xuICBvcGVuOiBib29sZWFuXG4gIHNldE9wZW46ICh2YWx1ZTogUmVhY3QuU2V0U3RhdGVBY3Rpb248Ym9vbGVhbj4pID0+IHZvaWRcbiAgc2hvd1RpcDogYm9vbGVhblxuICBjaGF0VmFyPzogQ29udmVyc2F0aW9uVmFyaWFibGVcbiAgb25DbG9zZTogKCkgPT4gdm9pZFxuICBvblNhdmU6IChlbnY6IENvbnZlcnNhdGlvblZhcmlhYmxlKSA9PiB2b2lkXG59XG5cbmNvbnN0IFZhcmlhYmxlTW9kYWxUcmlnZ2VyID0gKHtcbiAgb3BlbixcbiAgc2V0T3BlbixcbiAgc2hvd1RpcCxcbiAgY2hhdFZhcixcbiAgb25DbG9zZSxcbiAgb25TYXZlLFxufTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgcmV0dXJuIChcbiAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtXG4gICAgICBvcGVuPXtvcGVufVxuICAgICAgb25PcGVuQ2hhbmdlPXsoKSA9PiB7XG4gICAgICAgIHNldE9wZW4odiA9PiAhdilcbiAgICAgICAgaWYgKG9wZW4pXG4gICAgICAgICAgb25DbG9zZSgpXG4gICAgICB9fVxuICAgICAgcGxhY2VtZW50PVwibGVmdC1zdGFydFwiXG4gICAgICBvZmZzZXQ9e3tcbiAgICAgICAgbWFpbkF4aXM6IDgsXG4gICAgICAgIGFsaWdubWVudEF4aXM6IHNob3dUaXAgPyAtMjc4IDogLTQ4LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlciBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgIHNldE9wZW4odiA9PiAhdilcbiAgICAgICAgaWYgKG9wZW4pXG4gICAgICAgICAgb25DbG9zZSgpXG4gICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJwcmltYXJ5XCI+XG4gICAgICAgICAgPFJpQWRkTGluZSBjbGFzc05hbWU9XCJtci0xIGgtNCB3LTRcIiAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW1cIj57dCgnY2hhdFZhcmlhYmxlLmJ1dHRvbicsIHsgbnM6ICd3b3JrZmxvdycgfSl9PC9zcGFuPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcj5cbiAgICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50IGNsYXNzTmFtZT1cInotWzExXVwiPlxuICAgICAgICA8VmFyaWFibGVNb2RhbFxuICAgICAgICAgIGNoYXRWYXI9e2NoYXRWYXJ9XG4gICAgICAgICAgb25TYXZlPXtvblNhdmV9XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgICAgb25DbG9zZSgpXG4gICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ+XG4gICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW0+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgVmFyaWFibGVNb2RhbFRyaWdnZXJcbiJdfQ==