"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const loading_1 = require("@/app/components/base/loading");
const use_document_title_1 = require("@/hooks/use-document-title");
const use_common_1 = require("@/service/use-common");
const classnames_1 = require("@/utils/classnames");
const ActivateForm = () => {
    (0, use_document_title_1.default)('');
    const router = (0, navigation_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const workspaceID = searchParams.get('workspace_id');
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const checkParams = {
        url: '/activate/check',
        params: {
            ...workspaceID && { workspace_id: workspaceID },
            ...email && { email },
            token,
        },
    };
    const { data: checkRes } = (0, use_common_1.useInvitationCheck)({
        ...checkParams.params,
        token: token || undefined,
    }, true);
    (0, react_1.useEffect)(() => {
        if (checkRes?.is_valid) {
            const params = new URLSearchParams(searchParams);
            const { email, workspace_id } = checkRes.data;
            params.set('email', encodeURIComponent(email));
            params.set('workspace_id', encodeURIComponent(workspace_id));
            params.set('invite_token', encodeURIComponent(token));
            router.replace(`/signin?${params.toString()}`);
        }
    }, [checkRes, router, searchParams, token]);
    return (<div className={(0, classnames_1.cn)('flex w-full grow flex-col items-center justify-center', 'px-6', 'md:px-[108px]')}>
      {!checkRes && <loading_1.default />}
      {checkRes && !checkRes.is_valid && (<div className="flex flex-col md:w-[400px]">
          <div className="mx-auto w-full">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-[20px] border border-divider-regular bg-components-option-card-option-bg p-5 text-[40px] font-bold shadow-lg">🤷‍♂️</div>
            <h2 className="text-[32px] font-bold text-text-primary">{t('invalid', { ns: 'login' })}</h2>
          </div>
          <div className="mx-auto mt-6 w-full">
            <button_1.default variant="primary" className="w-full !text-sm">
              <a href="https://dify.ai">{t('explore', { ns: 'login' })}</a>
            </button_1.default>
          </div>
        </div>)}
    </div>);
};
exports.default = ActivateForm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGVGb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aXZhdGVGb3JtLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUNaLGdEQUE0RDtBQUM1RCxpQ0FBaUM7QUFDakMsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCwyREFBbUQ7QUFFbkQsbUVBQXlEO0FBQ3pELHFEQUF5RDtBQUN6RCxtREFBdUM7QUFFdkMsTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFO0lBQ3hCLElBQUEsNEJBQWdCLEVBQUMsRUFBRSxDQUFDLENBQUE7SUFDcEIsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUE7SUFDMUIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUEsNEJBQWUsR0FBRSxDQUFBO0lBQ3RDLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDcEQsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN2QyxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRXZDLE1BQU0sV0FBVyxHQUFHO1FBQ2xCLEdBQUcsRUFBRSxpQkFBaUI7UUFDdEIsTUFBTSxFQUFFO1lBQ04sR0FBRyxXQUFXLElBQUksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFO1lBQy9DLEdBQUcsS0FBSyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3JCLEtBQUs7U0FDTjtLQUNGLENBQUE7SUFDRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsK0JBQWtCLEVBQUM7UUFDNUMsR0FBRyxXQUFXLENBQUMsTUFBTTtRQUNyQixLQUFLLEVBQUUsS0FBSyxJQUFJLFNBQVM7S0FDMUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUVSLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDYixJQUFJLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQztZQUN2QixNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUNoRCxNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUE7WUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtZQUM5QyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1lBQzVELE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLEtBQWUsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDaEQsQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFFM0MsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUNiLElBQUEsZUFBRSxFQUNBLHVEQUF1RCxFQUN2RCxNQUFNLEVBQ04sZUFBZSxDQUVuQixDQUFDLENBRUM7TUFBQSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsaUJBQU8sQ0FBQyxBQUFELEVBQUcsQ0FDekI7TUFBQSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksQ0FDakMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUN6QztVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FDN0I7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0tBQXNLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FDaE07WUFBQSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQzdGO1VBQUEsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQ2xDO1lBQUEsQ0FBQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUNuRDtjQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDOUQ7WUFBQSxFQUFFLGdCQUFNLENBQ1Y7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHsgdXNlUm91dGVyLCB1c2VTZWFyY2hQYXJhbXMgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCBMb2FkaW5nIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuXG5pbXBvcnQgdXNlRG9jdW1lbnRUaXRsZSBmcm9tICdAL2hvb2tzL3VzZS1kb2N1bWVudC10aXRsZSdcbmltcG9ydCB7IHVzZUludml0YXRpb25DaGVjayB9IGZyb20gJ0Avc2VydmljZS91c2UtY29tbW9uJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5cbmNvbnN0IEFjdGl2YXRlRm9ybSA9ICgpID0+IHtcbiAgdXNlRG9jdW1lbnRUaXRsZSgnJylcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHNlYXJjaFBhcmFtcyA9IHVzZVNlYXJjaFBhcmFtcygpXG4gIGNvbnN0IHdvcmtzcGFjZUlEID0gc2VhcmNoUGFyYW1zLmdldCgnd29ya3NwYWNlX2lkJylcbiAgY29uc3QgZW1haWwgPSBzZWFyY2hQYXJhbXMuZ2V0KCdlbWFpbCcpXG4gIGNvbnN0IHRva2VuID0gc2VhcmNoUGFyYW1zLmdldCgndG9rZW4nKVxuXG4gIGNvbnN0IGNoZWNrUGFyYW1zID0ge1xuICAgIHVybDogJy9hY3RpdmF0ZS9jaGVjaycsXG4gICAgcGFyYW1zOiB7XG4gICAgICAuLi53b3Jrc3BhY2VJRCAmJiB7IHdvcmtzcGFjZV9pZDogd29ya3NwYWNlSUQgfSxcbiAgICAgIC4uLmVtYWlsICYmIHsgZW1haWwgfSxcbiAgICAgIHRva2VuLFxuICAgIH0sXG4gIH1cbiAgY29uc3QgeyBkYXRhOiBjaGVja1JlcyB9ID0gdXNlSW52aXRhdGlvbkNoZWNrKHtcbiAgICAuLi5jaGVja1BhcmFtcy5wYXJhbXMsXG4gICAgdG9rZW46IHRva2VuIHx8IHVuZGVmaW5lZCxcbiAgfSwgdHJ1ZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChjaGVja1Jlcz8uaXNfdmFsaWQpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoc2VhcmNoUGFyYW1zKVxuICAgICAgY29uc3QgeyBlbWFpbCwgd29ya3NwYWNlX2lkIH0gPSBjaGVja1Jlcy5kYXRhXG4gICAgICBwYXJhbXMuc2V0KCdlbWFpbCcsIGVuY29kZVVSSUNvbXBvbmVudChlbWFpbCkpXG4gICAgICBwYXJhbXMuc2V0KCd3b3Jrc3BhY2VfaWQnLCBlbmNvZGVVUklDb21wb25lbnQod29ya3NwYWNlX2lkKSlcbiAgICAgIHBhcmFtcy5zZXQoJ2ludml0ZV90b2tlbicsIGVuY29kZVVSSUNvbXBvbmVudCh0b2tlbiBhcyBzdHJpbmcpKVxuICAgICAgcm91dGVyLnJlcGxhY2UoYC9zaWduaW4/JHtwYXJhbXMudG9TdHJpbmcoKX1gKVxuICAgIH1cbiAgfSwgW2NoZWNrUmVzLCByb3V0ZXIsIHNlYXJjaFBhcmFtcywgdG9rZW5dKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e1xuICAgICAgY24oXG4gICAgICAgICdmbGV4IHctZnVsbCBncm93IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlcicsXG4gICAgICAgICdweC02JyxcbiAgICAgICAgJ21kOnB4LVsxMDhweF0nLFxuICAgICAgKVxuICAgIH1cbiAgICA+XG4gICAgICB7IWNoZWNrUmVzICYmIDxMb2FkaW5nIC8+fVxuICAgICAge2NoZWNrUmVzICYmICFjaGVja1Jlcy5pc192YWxpZCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtZDp3LVs0MDBweF1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14LWF1dG8gdy1mdWxsXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTMgZmxleCBoLTIwIHctMjAgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtWzIwcHhdIGJvcmRlciBib3JkZXItZGl2aWRlci1yZWd1bGFyIGJnLWNvbXBvbmVudHMtb3B0aW9uLWNhcmQtb3B0aW9uLWJnIHAtNSB0ZXh0LVs0MHB4XSBmb250LWJvbGQgc2hhZG93LWxnXCI+8J+kt+KAjeKZgu+4jzwvZGl2PlxuICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtWzMycHhdIGZvbnQtYm9sZCB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KCdpbnZhbGlkJywgeyBuczogJ2xvZ2luJyB9KX08L2gyPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtYXV0byBtdC02IHctZnVsbFwiPlxuICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwicHJpbWFyeVwiIGNsYXNzTmFtZT1cInctZnVsbCAhdGV4dC1zbVwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9kaWZ5LmFpXCI+e3QoJ2V4cGxvcmUnLCB7IG5zOiAnbG9naW4nIH0pfTwvYT5cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZhdGVGb3JtXG4iXX0=