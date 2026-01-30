"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("../../base/button");
const dify_logo_1 = require("../../base/logo/dify-logo");
const Header = ({ onClose, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="flex min-h-[105px] w-full justify-center px-10">
      <div className="relative flex max-w-[1680px] grow flex-col justify-end gap-y-1 border-x border-divider-accent p-6 pt-8">
        <div className="flex items-end">
          <div className="py-[5px]">
            <dify_logo_1.default className="h-[27px] w-[60px]"/>
          </div>
          <span className="bg-billing-plan-title-bg bg-clip-text px-1.5 font-instrument text-[37px] italic leading-[1.2] text-transparent">
            {t('plansCommon.title.plans', { ns: 'billing' })}
          </span>
        </div>
        <p className="system-sm-regular text-text-tertiary">
          {t('plansCommon.title.description', { ns: 'billing' })}
        </p>
        <button_1.default variant="secondary" className="absolute bottom-[40.5px] right-[-18px] z-10 size-9 rounded-full p-2" onClick={onClose}>
          <react_1.RiCloseLine className="size-5"/>
        </button_1.default>
      </div>
    </div>);
};
exports.default = React.memo(Header);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVhZGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUE4QztBQUM5QywrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLDhDQUFzQztBQUN0Qyx5REFBZ0Q7QUFNaEQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxFQUNkLE9BQU8sR0FDSyxFQUFFLEVBQUU7SUFDaEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0RBQWdELENBQzdEO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdHQUF3RyxDQUNySDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FDN0I7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUN2QjtZQUFBLENBQUMsbUJBQVEsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQ3pDO1VBQUEsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0hBQWdILENBQzlIO1lBQUEsQ0FBQyxDQUFDLENBQUMseUJBQXlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FDbEQ7VUFBQSxFQUFFLElBQUksQ0FDUjtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUNqRDtVQUFBLENBQUMsQ0FBQyxDQUFDLCtCQUErQixFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQ3hEO1FBQUEsRUFBRSxDQUFDLENBQ0g7UUFBQSxDQUFDLGdCQUFNLENBQ0wsT0FBTyxDQUFDLFdBQVcsQ0FDbkIsU0FBUyxDQUFDLHFFQUFxRSxDQUMvRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FFakI7VUFBQSxDQUFDLG1CQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFDakM7UUFBQSxFQUFFLGdCQUFNLENBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSaUNsb3NlTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vLi4vYmFzZS9idXR0b24nXG5pbXBvcnQgRGlmeUxvZ28gZnJvbSAnLi4vLi4vYmFzZS9sb2dvL2RpZnktbG9nbydcblxudHlwZSBIZWFkZXJQcm9wcyA9IHtcbiAgb25DbG9zZTogKCkgPT4gdm9pZFxufVxuXG5jb25zdCBIZWFkZXIgPSAoe1xuICBvbkNsb3NlLFxufTogSGVhZGVyUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggbWluLWgtWzEwNXB4XSB3LWZ1bGwganVzdGlmeS1jZW50ZXIgcHgtMTBcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBtYXgtdy1bMTY4MHB4XSBncm93IGZsZXgtY29sIGp1c3RpZnktZW5kIGdhcC15LTEgYm9yZGVyLXggYm9yZGVyLWRpdmlkZXItYWNjZW50IHAtNiBwdC04XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1lbmRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB5LVs1cHhdXCI+XG4gICAgICAgICAgICA8RGlmeUxvZ28gY2xhc3NOYW1lPVwiaC1bMjdweF0gdy1bNjBweF1cIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJnLWJpbGxpbmctcGxhbi10aXRsZS1iZyBiZy1jbGlwLXRleHQgcHgtMS41IGZvbnQtaW5zdHJ1bWVudCB0ZXh0LVszN3B4XSBpdGFsaWMgbGVhZGluZy1bMS4yXSB0ZXh0LXRyYW5zcGFyZW50XCI+XG4gICAgICAgICAgICB7dCgncGxhbnNDb21tb24udGl0bGUucGxhbnMnLCB7IG5zOiAnYmlsbGluZycgfSl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwic3lzdGVtLXNtLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAge3QoJ3BsYW5zQ29tbW9uLnRpdGxlLmRlc2NyaXB0aW9uJywgeyBuczogJ2JpbGxpbmcnIH0pfVxuICAgICAgICA8L3A+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tWzQwLjVweF0gcmlnaHQtWy0xOHB4XSB6LTEwIHNpemUtOSByb3VuZGVkLWZ1bGwgcC0yXCJcbiAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICA+XG4gICAgICAgICAgPFJpQ2xvc2VMaW5lIGNsYXNzTmFtZT1cInNpemUtNVwiIC8+XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhIZWFkZXIpXG4iXX0=