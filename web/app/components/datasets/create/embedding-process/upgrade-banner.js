"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const general_1 = require("@/app/components/base/icons/src/vender/solid/general");
const upgrade_btn_1 = require("@/app/components/billing/upgrade-btn");
const UpgradeBanner = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="flex h-14 items-center rounded-xl border-[0.5px] border-black/5 bg-white p-3 shadow-md">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF6ED]">
        <general_1.ZapFast className="h-4 w-4 text-[#FB6514]"/>
      </div>
      <div className="mx-3 grow text-[13px] font-medium text-gray-700">
        {t('plansCommon.documentProcessingPriorityUpgrade', { ns: 'billing' })}
      </div>
      <upgrade_btn_1.default loc="knowledge-speed-up"/>
    </div>);
};
exports.default = UpgradeBanner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZS1iYW5uZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1cGdyYWRlLWJhbm5lci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpREFBOEM7QUFDOUMsa0ZBQThFO0FBQzlFLHNFQUE2RDtBQUU3RCxNQUFNLGFBQWEsR0FBTyxHQUFHLEVBQUU7SUFDN0IsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0ZBQXdGLENBQ3JHO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJFQUEyRSxDQUN4RjtRQUFBLENBQUMsaUJBQU8sQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQzdDO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsaURBQWlELENBQzlEO1FBQUEsQ0FBQyxDQUFDLENBQUMsK0NBQStDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FDeEU7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMscUJBQVUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQ3RDO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgWmFwRmFzdCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL3NvbGlkL2dlbmVyYWwnXG5pbXBvcnQgVXBncmFkZUJ0biBmcm9tICdAL2FwcC9jb21wb25lbnRzL2JpbGxpbmcvdXBncmFkZS1idG4nXG5cbmNvbnN0IFVwZ3JhZGVCYW5uZXI6IEZDID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTE0IGl0ZW1zLWNlbnRlciByb3VuZGVkLXhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1ibGFjay81IGJnLXdoaXRlIHAtMyBzaGFkb3ctbWRcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTggdy04IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWxnIGJnLVsjRkZGNkVEXVwiPlxuICAgICAgICA8WmFwRmFzdCBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtWyNGQjY1MTRdXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJteC0zIGdyb3cgdGV4dC1bMTNweF0gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICB7dCgncGxhbnNDb21tb24uZG9jdW1lbnRQcm9jZXNzaW5nUHJpb3JpdHlVcGdyYWRlJywgeyBuczogJ2JpbGxpbmcnIH0pfVxuICAgICAgPC9kaXY+XG4gICAgICA8VXBncmFkZUJ0biBsb2M9XCJrbm93bGVkZ2Utc3BlZWQtdXBcIiAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFVwZ3JhZGVCYW5uZXJcbiJdfQ==