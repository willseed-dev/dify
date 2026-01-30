"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const grid_mask_1 = require("@/app/components/base/grid-mask");
const classnames_1 = require("@/utils/classnames");
const upgrade_btn_1 = require("../upgrade-btn");
const style_module_css_1 = require("./style.module.css");
const usage_1 = require("./usage");
const AnnotationFull = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<grid_mask_1.default wrapperClassName="rounded-lg" canvasClassName="rounded-lg" gradientClassName="rounded-lg">
      <div className="mt-6 flex cursor-pointer flex-col rounded-lg border-2 border-solid border-transparent px-3.5 py-4 shadow-md transition-all duration-200 ease-in-out">
        <div className="flex items-center justify-between">
          <div className={(0, classnames_1.cn)(style_module_css_1.default.textGradient, 'text-base font-semibold leading-[24px]')}>
            <div>{t('annotatedResponse.fullTipLine1', { ns: 'billing' })}</div>
            <div>{t('annotatedResponse.fullTipLine2', { ns: 'billing' })}</div>
          </div>
          <div className="flex">
            <upgrade_btn_1.default loc="annotation-create"/>
          </div>
        </div>
        <usage_1.default className="mt-4"/>
      </div>
    </grid_mask_1.default>);
};
exports.default = React.memo(AnnotationFull);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLCtEQUFzRDtBQUN0RCxtREFBdUM7QUFDdkMsZ0RBQXVDO0FBQ3ZDLHlEQUFrQztBQUNsQyxtQ0FBMkI7QUFFM0IsTUFBTSxjQUFjLEdBQU8sR0FBRyxFQUFFO0lBQzlCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixPQUFPLENBQ0wsQ0FBQyxtQkFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FDakc7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUpBQXFKLENBQ2xLO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUNoRDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLDBCQUFDLENBQUMsWUFBWSxFQUFFLHdDQUF3QyxDQUFDLENBQUMsQ0FDM0U7WUFBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUNsRTtZQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQ3BFO1VBQUEsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNuQjtZQUFBLENBQUMscUJBQVUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQ3JDO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsZUFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQ3pCO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLG1CQUFRLENBQUMsQ0FDWixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgR3JpZE1hc2sgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2dyaWQtbWFzaydcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IFVwZ3JhZGVCdG4gZnJvbSAnLi4vdXBncmFkZS1idG4nXG5pbXBvcnQgcyBmcm9tICcuL3N0eWxlLm1vZHVsZS5jc3MnXG5pbXBvcnQgVXNhZ2UgZnJvbSAnLi91c2FnZSdcblxuY29uc3QgQW5ub3RhdGlvbkZ1bGw6IEZDID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICByZXR1cm4gKFxuICAgIDxHcmlkTWFzayB3cmFwcGVyQ2xhc3NOYW1lPVwicm91bmRlZC1sZ1wiIGNhbnZhc0NsYXNzTmFtZT1cInJvdW5kZWQtbGdcIiBncmFkaWVudENsYXNzTmFtZT1cInJvdW5kZWQtbGdcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNiBmbGV4IGN1cnNvci1wb2ludGVyIGZsZXgtY29sIHJvdW5kZWQtbGcgYm9yZGVyLTIgYm9yZGVyLXNvbGlkIGJvcmRlci10cmFuc3BhcmVudCBweC0zLjUgcHktNCBzaGFkb3ctbWQgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwIGVhc2UtaW4tb3V0XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKHMudGV4dEdyYWRpZW50LCAndGV4dC1iYXNlIGZvbnQtc2VtaWJvbGQgbGVhZGluZy1bMjRweF0nKX0+XG4gICAgICAgICAgICA8ZGl2Pnt0KCdhbm5vdGF0ZWRSZXNwb25zZS5mdWxsVGlwTGluZTEnLCB7IG5zOiAnYmlsbGluZycgfSl9PC9kaXY+XG4gICAgICAgICAgICA8ZGl2Pnt0KCdhbm5vdGF0ZWRSZXNwb25zZS5mdWxsVGlwTGluZTInLCB7IG5zOiAnYmlsbGluZycgfSl9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XG4gICAgICAgICAgICA8VXBncmFkZUJ0biBsb2M9XCJhbm5vdGF0aW9uLWNyZWF0ZVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8VXNhZ2UgY2xhc3NOYW1lPVwibXQtNFwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L0dyaWRNYXNrPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEFubm90YXRpb25GdWxsKVxuIl19