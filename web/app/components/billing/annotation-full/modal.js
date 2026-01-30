"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const grid_mask_1 = require("@/app/components/base/grid-mask");
const classnames_1 = require("@/utils/classnames");
const modal_1 = require("../../base/modal");
const upgrade_btn_1 = require("../upgrade-btn");
const style_module_css_1 = require("./style.module.css");
const usage_1 = require("./usage");
const AnnotationFullModal = ({ show, onHide, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<modal_1.default isShow={show} onClose={onHide} closable className="!p-0">
      <grid_mask_1.default wrapperClassName="rounded-lg" canvasClassName="rounded-lg" gradientClassName="rounded-lg">
        <div className="mt-6 flex cursor-pointer flex-col rounded-lg border-2 border-solid border-transparent px-7 py-6 shadow-md transition-all duration-200 ease-in-out">
          <div className="flex items-center justify-between">
            <div className={(0, classnames_1.cn)(style_module_css_1.default.textGradient, 'text-[18px] font-semibold leading-[27px]')}>
              <div>{t('annotatedResponse.fullTipLine1', { ns: 'billing' })}</div>
              <div>{t('annotatedResponse.fullTipLine2', { ns: 'billing' })}</div>
            </div>

          </div>
          <usage_1.default className="mt-4"/>
          <div className="mt-7 flex justify-end">
            <upgrade_btn_1.default loc="annotation-create"/>
          </div>
        </div>
      </grid_mask_1.default>
    </modal_1.default>);
};
exports.default = React.memo(AnnotationFullModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb2RhbC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLCtEQUFzRDtBQUN0RCxtREFBdUM7QUFDdkMsNENBQW9DO0FBQ3BDLGdEQUF1QztBQUN2Qyx5REFBa0M7QUFDbEMsbUNBQTJCO0FBTTNCLE1BQU0sbUJBQW1CLEdBQWMsQ0FBQyxFQUN0QyxJQUFJLEVBQ0osTUFBTSxHQUNQLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixPQUFPLENBQ0wsQ0FBQyxlQUFLLENBQ0osTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2IsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ2hCLFFBQVEsQ0FDUixTQUFTLENBQUMsTUFBTSxDQUVoQjtNQUFBLENBQUMsbUJBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQ2pHO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1KQUFtSixDQUNoSztVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FDaEQ7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQywwQkFBQyxDQUFDLFlBQVksRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDLENBQzdFO2NBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FDbEU7Y0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUNwRTtZQUFBLEVBQUUsR0FBRyxDQUVQOztVQUFBLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxlQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDdkI7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQ3BDO1lBQUEsQ0FBQyxxQkFBVSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFDckM7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxtQkFBUSxDQUNaO0lBQUEsRUFBRSxlQUFLLENBQUMsQ0FDVCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBHcmlkTWFzayBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZ3JpZC1tYXNrJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgTW9kYWwgZnJvbSAnLi4vLi4vYmFzZS9tb2RhbCdcbmltcG9ydCBVcGdyYWRlQnRuIGZyb20gJy4uL3VwZ3JhZGUtYnRuJ1xuaW1wb3J0IHMgZnJvbSAnLi9zdHlsZS5tb2R1bGUuY3NzJ1xuaW1wb3J0IFVzYWdlIGZyb20gJy4vdXNhZ2UnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIHNob3c6IGJvb2xlYW5cbiAgb25IaWRlOiAoKSA9PiB2b2lkXG59XG5jb25zdCBBbm5vdGF0aW9uRnVsbE1vZGFsOiBGQzxQcm9wcz4gPSAoe1xuICBzaG93LFxuICBvbkhpZGUsXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIHJldHVybiAoXG4gICAgPE1vZGFsXG4gICAgICBpc1Nob3c9e3Nob3d9XG4gICAgICBvbkNsb3NlPXtvbkhpZGV9XG4gICAgICBjbG9zYWJsZVxuICAgICAgY2xhc3NOYW1lPVwiIXAtMFwiXG4gICAgPlxuICAgICAgPEdyaWRNYXNrIHdyYXBwZXJDbGFzc05hbWU9XCJyb3VuZGVkLWxnXCIgY2FudmFzQ2xhc3NOYW1lPVwicm91bmRlZC1sZ1wiIGdyYWRpZW50Q2xhc3NOYW1lPVwicm91bmRlZC1sZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTYgZmxleCBjdXJzb3ItcG9pbnRlciBmbGV4LWNvbCByb3VuZGVkLWxnIGJvcmRlci0yIGJvcmRlci1zb2xpZCBib3JkZXItdHJhbnNwYXJlbnQgcHgtNyBweS02IHNoYWRvdy1tZCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDAgZWFzZS1pbi1vdXRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKHMudGV4dEdyYWRpZW50LCAndGV4dC1bMThweF0gZm9udC1zZW1pYm9sZCBsZWFkaW5nLVsyN3B4XScpfT5cbiAgICAgICAgICAgICAgPGRpdj57dCgnYW5ub3RhdGVkUmVzcG9uc2UuZnVsbFRpcExpbmUxJywgeyBuczogJ2JpbGxpbmcnIH0pfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2Pnt0KCdhbm5vdGF0ZWRSZXNwb25zZS5mdWxsVGlwTGluZTInLCB7IG5zOiAnYmlsbGluZycgfSl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxVc2FnZSBjbGFzc05hbWU9XCJtdC00XCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTcgZmxleCBqdXN0aWZ5LWVuZFwiPlxuICAgICAgICAgICAgPFVwZ3JhZGVCdG4gbG9jPVwiYW5ub3RhdGlvbi1jcmVhdGVcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvR3JpZE1hc2s+XG4gICAgPC9Nb2RhbD5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhBbm5vdGF0aW9uRnVsbE1vZGFsKVxuIl19