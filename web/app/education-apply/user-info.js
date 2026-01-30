"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const react_i18next_1 = require("react-i18next");
const avatar_1 = require("@/app/components/base/avatar");
const button_1 = require("@/app/components/base/button");
const education_1 = require("@/app/components/base/icons/src/public/education");
const app_context_1 = require("@/context/app-context");
const use_common_1 = require("@/service/use-common");
const UserInfo = () => {
    const router = (0, navigation_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { userProfile } = (0, app_context_1.useAppContext)();
    const { mutateAsync: logout } = (0, use_common_1.useLogout)();
    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('setup_status');
        // Tokens are now stored in cookies and cleared by backend
        router.push('/signin');
    };
    return (<div className="relative flex items-center justify-between rounded-xl border-[4px] border-components-panel-on-panel-item-bg bg-gradient-to-r from-background-gradient-bg-fill-chat-bg-2 to-background-gradient-bg-fill-chat-bg-1 pb-6 pl-6 pr-8 pt-9 shadow-shadow-shadow-5">
      <div className="absolute left-0 top-0 flex items-center">
        <div className="system-2xs-semibold-uppercase flex h-[22px] items-center bg-components-panel-on-panel-item-bg pl-2 pt-1 text-text-accent-light-mode-only">
          {t('currentSigned', { ns: 'education' })}
        </div>
        <education_1.Triangle className="h-[22px] w-4 text-components-panel-on-panel-item-bg"/>
      </div>
      <div className="flex items-center">
        <avatar_1.default className="mr-4" avatar={userProfile.avatar_url} name={userProfile.name} size={48}/>
        <div className="pt-1.5">
          <div className="system-md-semibold text-text-primary">
            {userProfile.name}
          </div>
          <div className="system-sm-regular text-text-secondary">
            {userProfile.email}
          </div>
        </div>
      </div>
      <button_1.default variant="secondary" onClick={handleLogout}>
        {t('userProfile.logout', { ns: 'common' })}
      </button_1.default>
    </div>);
};
exports.default = UserInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1pbmZvLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUEyQztBQUMzQyxpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELHlEQUFpRDtBQUNqRCxnRkFBMkU7QUFDM0UsdURBQXFEO0FBQ3JELHFEQUFnRDtBQUVoRCxNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7SUFDcEIsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUE7SUFDMUIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFBLDJCQUFhLEdBQUUsQ0FBQTtJQUV2QyxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsc0JBQVMsR0FBRSxDQUFBO0lBQzNDLE1BQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQzlCLE1BQU0sTUFBTSxFQUFFLENBQUE7UUFFZCxZQUFZLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3ZDLDBEQUEwRDtRQUUxRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3hCLENBQUMsQ0FBQTtJQUVELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNlBBQTZQLENBQzFRO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlDQUF5QyxDQUN0RDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwSUFBMEksQ0FDdko7VUFBQSxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FDMUM7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsb0JBQVEsQ0FBQyxTQUFTLENBQUMscURBQXFELEVBQzNFO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQ2hDO1FBQUEsQ0FBQyxnQkFBTSxDQUNMLFNBQVMsQ0FBQyxNQUFNLENBQ2hCLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FDL0IsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUN2QixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFFWDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQ3JCO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUNuRDtZQUFBLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDbkI7VUFBQSxFQUFFLEdBQUcsQ0FDTDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FDcEQ7WUFBQSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQ3BCO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxnQkFBTSxDQUNMLE9BQU8sQ0FBQyxXQUFXLENBQ25CLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUV0QjtRQUFBLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQzVDO01BQUEsRUFBRSxnQkFBTSxDQUNWO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsUUFBUSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEF2YXRhciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYXZhdGFyJ1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IHsgVHJpYW5nbGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3B1YmxpYy9lZHVjYXRpb24nXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlTG9nb3V0IH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5cbmNvbnN0IFVzZXJJbmZvID0gKCkgPT4ge1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyB1c2VyUHJvZmlsZSB9ID0gdXNlQXBwQ29udGV4dCgpXG5cbiAgY29uc3QgeyBtdXRhdGVBc3luYzogbG9nb3V0IH0gPSB1c2VMb2dvdXQoKVxuICBjb25zdCBoYW5kbGVMb2dvdXQgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9nb3V0KClcblxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdzZXR1cF9zdGF0dXMnKVxuICAgIC8vIFRva2VucyBhcmUgbm93IHN0b3JlZCBpbiBjb29raWVzIGFuZCBjbGVhcmVkIGJ5IGJhY2tlbmRcblxuICAgIHJvdXRlci5wdXNoKCcvc2lnbmluJylcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC14bCBib3JkZXItWzRweF0gYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtb24tcGFuZWwtaXRlbS1iZyBiZy1ncmFkaWVudC10by1yIGZyb20tYmFja2dyb3VuZC1ncmFkaWVudC1iZy1maWxsLWNoYXQtYmctMiB0by1iYWNrZ3JvdW5kLWdyYWRpZW50LWJnLWZpbGwtY2hhdC1iZy0xIHBiLTYgcGwtNiBwci04IHB0LTkgc2hhZG93LXNoYWRvdy1zaGFkb3ctNVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTAgdG9wLTAgZmxleCBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tMnhzLXNlbWlib2xkLXVwcGVyY2FzZSBmbGV4IGgtWzIycHhdIGl0ZW1zLWNlbnRlciBiZy1jb21wb25lbnRzLXBhbmVsLW9uLXBhbmVsLWl0ZW0tYmcgcGwtMiBwdC0xIHRleHQtdGV4dC1hY2NlbnQtbGlnaHQtbW9kZS1vbmx5XCI+XG4gICAgICAgICAge3QoJ2N1cnJlbnRTaWduZWQnLCB7IG5zOiAnZWR1Y2F0aW9uJyB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxUcmlhbmdsZSBjbGFzc05hbWU9XCJoLVsyMnB4XSB3LTQgdGV4dC1jb21wb25lbnRzLXBhbmVsLW9uLXBhbmVsLWl0ZW0tYmdcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgIDxBdmF0YXJcbiAgICAgICAgICBjbGFzc05hbWU9XCJtci00XCJcbiAgICAgICAgICBhdmF0YXI9e3VzZXJQcm9maWxlLmF2YXRhcl91cmx9XG4gICAgICAgICAgbmFtZT17dXNlclByb2ZpbGUubmFtZX1cbiAgICAgICAgICBzaXplPXs0OH1cbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdC0xLjVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1tZC1zZW1pYm9sZCB0ZXh0LXRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgICAge3VzZXJQcm9maWxlLm5hbWV9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICB7dXNlclByb2ZpbGUuZW1haWx9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIlxuICAgICAgICBvbkNsaWNrPXtoYW5kbGVMb2dvdXR9XG4gICAgICA+XG4gICAgICAgIHt0KCd1c2VyUHJvZmlsZS5sb2dvdXQnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgIDwvQnV0dG9uPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJJbmZvXG4iXX0=