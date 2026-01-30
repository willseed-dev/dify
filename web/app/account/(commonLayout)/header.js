"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const navigation_1 = require("next/navigation");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const dify_logo_1 = require("@/app/components/base/logo/dify-logo");
const global_public_context_1 = require("@/context/global-public-context");
const avatar_1 = require("./avatar");
const Header = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, navigation_1.useRouter)();
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const goToStudio = (0, react_2.useCallback)(() => {
        router.push('/apps');
    }, [router]);
    return (<div className="flex flex-1 items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex cursor-pointer items-center" onClick={goToStudio}>
          {systemFeatures.branding.enabled && systemFeatures.branding.login_page_logo
            ? (<img src={systemFeatures.branding.login_page_logo} className="block h-[22px] w-auto object-contain" alt="Dify logo"/>)
            : <dify_logo_1.default />}
        </div>
        <div className="h-4 w-[1px] origin-center rotate-[11.31deg] bg-divider-regular"/>
        <p className="title-3xl-semi-bold relative mt-[-2px] text-text-primary">{t('account.account', { ns: 'common' })}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button_1.default className="system-sm-medium gap-2 px-3 py-2" onClick={goToStudio}>
          <react_1.RiRobot2Line className="h-4 w-4"/>
          <p>{t('account.studio', { ns: 'common' })}</p>
          <react_1.RiArrowRightUpLine className="h-4 w-4"/>
        </button_1.default>
        <div className="h-4 w-[1px] bg-divider-regular"/>
        <avatar_1.default />
      </div>
    </div>);
};
exports.default = Header;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVhZGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUNaLDRDQUFtRTtBQUNuRSxnREFBMkM7QUFDM0MsaUNBQW1DO0FBQ25DLGlEQUE4QztBQUM5Qyx5REFBaUQ7QUFDakQsb0VBQTJEO0FBQzNELDJFQUFzRTtBQUN0RSxxQ0FBNkI7QUFFN0IsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFO0lBQ2xCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLE1BQU0sR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQTtJQUMxQixNQUFNLGNBQWMsR0FBRyxJQUFBLDRDQUFvQixFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRWxFLE1BQU0sVUFBVSxHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN0QixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBRVosT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywrQ0FBK0MsQ0FDNUQ7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQ3RDO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUNwRTtVQUFBLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksY0FBYyxDQUFDLFFBQVEsQ0FBQyxlQUFlO1lBQ3pFLENBQUMsQ0FBQyxDQUNFLENBQUMsR0FBRyxDQUNGLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQzdDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FDaEQsR0FBRyxDQUFDLFdBQVcsRUFDZixDQUNIO1lBQ0gsQ0FBQyxDQUFDLENBQUMsbUJBQVEsQ0FBQyxBQUFELEVBQUcsQ0FDbEI7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnRUFBZ0UsRUFDL0U7UUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsMERBQTBELENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDckg7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FDL0M7UUFBQSxDQUFDLGdCQUFNLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUN2RTtVQUFBLENBQUMsb0JBQVksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUNqQztVQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQzdDO1VBQUEsQ0FBQywwQkFBa0IsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUN6QztRQUFBLEVBQUUsZ0JBQU0sQ0FDUjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFDL0M7UUFBQSxDQUFDLGdCQUFNLENBQUMsQUFBRCxFQUNUO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB7IFJpQXJyb3dSaWdodFVwTGluZSwgUmlSb2JvdDJMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgRGlmeUxvZ28gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2xvZ28vZGlmeS1sb2dvJ1xuaW1wb3J0IHsgdXNlR2xvYmFsUHVibGljU3RvcmUgfSBmcm9tICdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0J1xuaW1wb3J0IEF2YXRhciBmcm9tICcuL2F2YXRhcidcblxuY29uc3QgSGVhZGVyID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcbiAgY29uc3Qgc3lzdGVtRmVhdHVyZXMgPSB1c2VHbG9iYWxQdWJsaWNTdG9yZShzID0+IHMuc3lzdGVtRmVhdHVyZXMpXG5cbiAgY29uc3QgZ29Ub1N0dWRpbyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICByb3V0ZXIucHVzaCgnL2FwcHMnKVxuICB9LCBbcm91dGVyXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LTEgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC00XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXJcIiBvbkNsaWNrPXtnb1RvU3R1ZGlvfT5cbiAgICAgICAgICB7c3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcuZW5hYmxlZCAmJiBzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy5sb2dpbl9wYWdlX2xvZ29cbiAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICAgIHNyYz17c3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcubG9naW5fcGFnZV9sb2dvfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmxvY2sgaC1bMjJweF0gdy1hdXRvIG9iamVjdC1jb250YWluXCJcbiAgICAgICAgICAgICAgICAgIGFsdD1cIkRpZnkgbG9nb1wiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiA8RGlmeUxvZ28gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtNCB3LVsxcHhdIG9yaWdpbi1jZW50ZXIgcm90YXRlLVsxMS4zMWRlZ10gYmctZGl2aWRlci1yZWd1bGFyXCIgLz5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGl0bGUtM3hsLXNlbWktYm9sZCByZWxhdGl2ZSBtdC1bLTJweF0gdGV4dC10ZXh0LXByaW1hcnlcIj57dCgnYWNjb3VudC5hY2NvdW50JywgeyBuczogJ2NvbW1vbicgfSl9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc2hyaW5rLTAgaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBnYXAtMiBweC0zIHB5LTJcIiBvbkNsaWNrPXtnb1RvU3R1ZGlvfT5cbiAgICAgICAgICA8UmlSb2JvdDJMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgIDxwPnt0KCdhY2NvdW50LnN0dWRpbycsIHsgbnM6ICdjb21tb24nIH0pfTwvcD5cbiAgICAgICAgICA8UmlBcnJvd1JpZ2h0VXBMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTQgdy1bMXB4XSBiZy1kaXZpZGVyLXJlZ3VsYXJcIiAvPlxuICAgICAgICA8QXZhdGFyIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyXG4iXX0=