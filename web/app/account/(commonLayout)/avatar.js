"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppSelector;
const react_1 = require("@headlessui/react");
const react_2 = require("@remixicon/react");
const navigation_1 = require("next/navigation");
const react_3 = require("react");
const react_i18next_1 = require("react-i18next");
const utils_1 = require("@/app/components/base/amplitude/utils");
const avatar_1 = require("@/app/components/base/avatar");
const general_1 = require("@/app/components/base/icons/src/vender/line/general");
const premium_badge_1 = require("@/app/components/base/premium-badge");
const app_context_1 = require("@/context/app-context");
const provider_context_1 = require("@/context/provider-context");
const use_common_1 = require("@/service/use-common");
function AppSelector() {
    const router = (0, navigation_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { userProfile } = (0, app_context_1.useAppContext)();
    const { isEducationAccount } = (0, provider_context_1.useProviderContext)();
    const { mutateAsync: logout } = (0, use_common_1.useLogout)();
    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('setup_status');
        (0, utils_1.resetUser)();
        // Tokens are now stored in cookies and cleared by backend
        router.push('/signin');
    };
    return (<react_1.Menu as="div" className="relative inline-block text-left">
      {({ open }) => (<>
            <div>
              <react_1.MenuButton className={`
                    p-1x inline-flex
                    items-center rounded-[20px] text-sm
                    text-text-primary
                    mobile:px-1
                    ${open && 'bg-components-panel-bg-blur'}
                  `}>
                <avatar_1.default avatar={userProfile.avatar_url} name={userProfile.name} size={32}/>
              </react_1.MenuButton>
            </div>
            <react_1.Transition as={react_3.Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
              <react_1.MenuItems className="
                    absolute -right-2 -top-1 w-60 max-w-80
                    origin-top-right divide-y divide-divider-subtle rounded-lg bg-components-panel-bg-blur
                    shadow-lg
                  ">
                <react_1.MenuItem>
                  <div className="p-1">
                    <div className="flex flex-nowrap items-center px-3 py-2">
                      <div className="grow">
                        <div className="system-md-medium break-all text-text-primary">
                          {userProfile.name}
                          {isEducationAccount && (<premium_badge_1.default size="s" color="blue" className="ml-1 !px-2">
                              <react_2.RiGraduationCapFill className="mr-1 h-3 w-3"/>
                              <span className="system-2xs-medium">EDU</span>
                            </premium_badge_1.default>)}
                        </div>
                        <div className="system-xs-regular break-all text-text-tertiary">{userProfile.email}</div>
                      </div>
                      <avatar_1.default avatar={userProfile.avatar_url} name={userProfile.name} size={32}/>
                    </div>
                  </div>
                </react_1.MenuItem>
                <react_1.MenuItem>
                  <div className="p-1" onClick={() => handleLogout()}>
                    <div className="group flex h-9 cursor-pointer items-center justify-start rounded-lg px-3 hover:bg-state-base-hover">
                      <general_1.LogOut01 className="mr-1 flex h-4 w-4 text-text-tertiary"/>
                      <div className="text-[14px] font-normal text-text-secondary">{t('userProfile.logout', { ns: 'common' })}</div>
                    </div>
                  </div>
                </react_1.MenuItem>
              </react_1.MenuItems>
            </react_1.Transition>
          </>)}
    </react_1.Menu>);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXZhdGFyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQW9CWiw4QkF1RkM7QUExR0QsNkNBQXFGO0FBQ3JGLDRDQUV5QjtBQUN6QixnREFBMkM7QUFDM0MsaUNBQWdDO0FBQ2hDLGlEQUE4QztBQUM5QyxpRUFBaUU7QUFDakUseURBQWlEO0FBQ2pELGlGQUE4RTtBQUM5RSx1RUFBOEQ7QUFDOUQsdURBQXFEO0FBQ3JELGlFQUErRDtBQUMvRCxxREFBZ0Q7QUFNaEQsU0FBd0IsV0FBVztJQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQTtJQUMxQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUEsMkJBQWEsR0FBRSxDQUFBO0lBQ3ZDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUFHLElBQUEscUNBQWtCLEdBQUUsQ0FBQTtJQUVuRCxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsc0JBQVMsR0FBRSxDQUFBO0lBQzNDLE1BQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQzlCLE1BQU0sTUFBTSxFQUFFLENBQUE7UUFFZCxZQUFZLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3ZDLElBQUEsaUJBQVMsR0FBRSxDQUFBO1FBQ1gsMERBQTBEO1FBRTFELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDeEIsQ0FBQyxDQUFBO0lBRUQsT0FBTyxDQUNMLENBQUMsWUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGlDQUFpQyxDQUN4RDtNQUFBLENBQ0UsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUNaLEVBQ0U7WUFBQSxDQUFDLEdB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OlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgeyBNZW51LCBNZW51QnV0dG9uLCBNZW51SXRlbSwgTWVudUl0ZW1zLCBUcmFuc2l0aW9uIH0gZnJvbSAnQGhlYWRsZXNzdWkvcmVhY3QnXG5pbXBvcnQge1xuICBSaUdyYWR1YXRpb25DYXBGaWxsLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgRnJhZ21lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHJlc2V0VXNlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hbXBsaXR1ZGUvdXRpbHMnXG5pbXBvcnQgQXZhdGFyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hdmF0YXInXG5pbXBvcnQgeyBMb2dPdXQwMSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL2xpbmUvZ2VuZXJhbCdcbmltcG9ydCBQcmVtaXVtQmFkZ2UgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3ByZW1pdW0tYmFkZ2UnXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlUHJvdmlkZXJDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VMb2dvdXQgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWNvbW1vbidcblxuZXhwb3J0IHR5cGUgSUFwcFNlbGVjdG9yID0ge1xuICBpc01vYmlsZTogYm9vbGVhblxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBTZWxlY3RvcigpIHtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgdXNlclByb2ZpbGUgfSA9IHVzZUFwcENvbnRleHQoKVxuICBjb25zdCB7IGlzRWR1Y2F0aW9uQWNjb3VudCB9ID0gdXNlUHJvdmlkZXJDb250ZXh0KClcblxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBsb2dvdXQgfSA9IHVzZUxvZ291dCgpXG4gIGNvbnN0IGhhbmRsZUxvZ291dCA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBsb2dvdXQoKVxuXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3NldHVwX3N0YXR1cycpXG4gICAgcmVzZXRVc2VyKClcbiAgICAvLyBUb2tlbnMgYXJlIG5vdyBzdG9yZWQgaW4gY29va2llcyBhbmQgY2xlYXJlZCBieSBiYWNrZW5kXG5cbiAgICByb3V0ZXIucHVzaCgnL3NpZ25pbicpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxNZW51IGFzPVwiZGl2XCIgY2xhc3NOYW1lPVwicmVsYXRpdmUgaW5saW5lLWJsb2NrIHRleHQtbGVmdFwiPlxuICAgICAge1xuICAgICAgICAoeyBvcGVuIH0pID0+IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPE1lbnVCdXR0b25cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BcbiAgICAgICAgICAgICAgICAgICAgcC0xeCBpbmxpbmUtZmxleFxuICAgICAgICAgICAgICAgICAgICBpdGVtcy1jZW50ZXIgcm91bmRlZC1bMjBweF0gdGV4dC1zbVxuICAgICAgICAgICAgICAgICAgICB0ZXh0LXRleHQtcHJpbWFyeVxuICAgICAgICAgICAgICAgICAgICBtb2JpbGU6cHgtMVxuICAgICAgICAgICAgICAgICAgICAke29wZW4gJiYgJ2JnLWNvbXBvbmVudHMtcGFuZWwtYmctYmx1cid9XG4gICAgICAgICAgICAgICAgICBgfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEF2YXRhciBhdmF0YXI9e3VzZXJQcm9maWxlLmF2YXRhcl91cmx9IG5hbWU9e3VzZXJQcm9maWxlLm5hbWV9IHNpemU9ezMyfSAvPlxuICAgICAgICAgICAgICA8L01lbnVCdXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxUcmFuc2l0aW9uXG4gICAgICAgICAgICAgIGFzPXtGcmFnbWVudH1cbiAgICAgICAgICAgICAgZW50ZXI9XCJ0cmFuc2l0aW9uIGVhc2Utb3V0IGR1cmF0aW9uLTEwMFwiXG4gICAgICAgICAgICAgIGVudGVyRnJvbT1cInRyYW5zZm9ybSBvcGFjaXR5LTAgc2NhbGUtOTVcIlxuICAgICAgICAgICAgICBlbnRlclRvPVwidHJhbnNmb3JtIG9wYWNpdHktMTAwIHNjYWxlLTEwMFwiXG4gICAgICAgICAgICAgIGxlYXZlPVwidHJhbnNpdGlvbiBlYXNlLWluIGR1cmF0aW9uLTc1XCJcbiAgICAgICAgICAgICAgbGVhdmVGcm9tPVwidHJhbnNmb3JtIG9wYWNpdHktMTAwIHNjYWxlLTEwMFwiXG4gICAgICAgICAgICAgIGxlYXZlVG89XCJ0cmFuc2Zvcm0gb3BhY2l0eS0wIHNjYWxlLTk1XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE1lbnVJdGVtc1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlxuICAgICAgICAgICAgICAgICAgICBhYnNvbHV0ZSAtcmlnaHQtMiAtdG9wLTEgdy02MCBtYXgtdy04MFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW4tdG9wLXJpZ2h0IGRpdmlkZS15IGRpdmlkZS1kaXZpZGVyLXN1YnRsZSByb3VuZGVkLWxnIGJnLWNvbXBvbmVudHMtcGFuZWwtYmctYmx1clxuICAgICAgICAgICAgICAgICAgICBzaGFkb3ctbGdcbiAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8TWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1ub3dyYXAgaXRlbXMtY2VudGVyIHB4LTMgcHktMlwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3Jvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtbWVkaXVtIGJyZWFrLWFsbCB0ZXh0LXRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dXNlclByb2ZpbGUubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2lzRWR1Y2F0aW9uQWNjb3VudCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFByZW1pdW1CYWRnZSBzaXplPVwic1wiIGNvbG9yPVwiYmx1ZVwiIGNsYXNzTmFtZT1cIm1sLTEgIXB4LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxSaUdyYWR1YXRpb25DYXBGaWxsIGNsYXNzTmFtZT1cIm1yLTEgaC0zIHctM1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tMnhzLW1lZGl1bVwiPkVEVTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1ByZW1pdW1CYWRnZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciBicmVhay1hbGwgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3VzZXJQcm9maWxlLmVtYWlsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxBdmF0YXIgYXZhdGFyPXt1c2VyUHJvZmlsZS5hdmF0YXJfdXJsfSBuYW1lPXt1c2VyUHJvZmlsZS5uYW1lfSBzaXplPXszMn0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICAgICAgICAgIDxNZW51SXRlbT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0xXCIgb25DbGljaz17KCkgPT4gaGFuZGxlTG9nb3V0KCl9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ3JvdXAgZmxleCBoLTkgY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktc3RhcnQgcm91bmRlZC1sZyBweC0zIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPExvZ091dDAxIGNsYXNzTmFtZT1cIm1yLTEgZmxleCBoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxNHB4XSBmb250LW5vcm1hbCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ3VzZXJQcm9maWxlLmxvZ291dCcsIHsgbnM6ICdjb21tb24nIH0pfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICAgICAgIDwvTWVudUl0ZW1zPlxuICAgICAgICAgICAgPC9UcmFuc2l0aW9uPlxuICAgICAgICAgIDwvPlxuICAgICAgICApXG4gICAgICB9XG4gICAgPC9NZW51PlxuICApXG59XG4iXX0=