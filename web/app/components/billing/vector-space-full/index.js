"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const grid_mask_1 = require("@/app/components/base/grid-mask");
const classnames_1 = require("@/utils/classnames");
const upgrade_btn_1 = require("../upgrade-btn");
const vector_space_info_1 = require("../usage-info/vector-space-info");
const style_module_css_1 = require("./style.module.css");
const VectorSpaceFull = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<grid_mask_1.default wrapperClassName="border border-gray-200 rounded-xl" canvasClassName="rounded-xl" gradientClassName="rounded-xl">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className={(0, classnames_1.cn)(style_module_css_1.default.textGradient, 'text-base font-semibold leading-[24px]')}>
            <div>{t('vectorSpace.fullTip', { ns: 'billing' })}</div>
            <div>{t('vectorSpace.fullSolution', { ns: 'billing' })}</div>
          </div>
          <upgrade_btn_1.default loc="knowledge-add-file"/>
        </div>
        <vector_space_info_1.default className="pt-4"/>
      </div>
    </grid_mask_1.default>);
};
exports.default = React.memo(VectorSpaceFull);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLCtEQUFzRDtBQUN0RCxtREFBdUM7QUFDdkMsZ0RBQXVDO0FBQ3ZDLHVFQUE2RDtBQUM3RCx5REFBa0M7QUFFbEMsTUFBTSxlQUFlLEdBQU8sR0FBRyxFQUFFO0lBQy9CLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixPQUFPLENBQ0wsQ0FBQyxtQkFBUSxDQUFDLGdCQUFnQixDQUFDLG1DQUFtQyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUN4SDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUNoRDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLDBCQUFDLENBQUMsWUFBWSxFQUFFLHdDQUF3QyxDQUFDLENBQUMsQ0FDM0U7WUFBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUN2RDtZQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQzlEO1VBQUEsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLHFCQUFVLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUN0QztRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQywyQkFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQ25DO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLG1CQUFRLENBQUMsQ0FDWixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgR3JpZE1hc2sgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2dyaWQtbWFzaydcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IFVwZ3JhZGVCdG4gZnJvbSAnLi4vdXBncmFkZS1idG4nXG5pbXBvcnQgVmVjdG9yU3BhY2VJbmZvIGZyb20gJy4uL3VzYWdlLWluZm8vdmVjdG9yLXNwYWNlLWluZm8nXG5pbXBvcnQgcyBmcm9tICcuL3N0eWxlLm1vZHVsZS5jc3MnXG5cbmNvbnN0IFZlY3RvclNwYWNlRnVsbDogRkMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIHJldHVybiAoXG4gICAgPEdyaWRNYXNrIHdyYXBwZXJDbGFzc05hbWU9XCJib3JkZXIgYm9yZGVyLWdyYXktMjAwIHJvdW5kZWQteGxcIiBjYW52YXNDbGFzc05hbWU9XCJyb3VuZGVkLXhsXCIgZ3JhZGllbnRDbGFzc05hbWU9XCJyb3VuZGVkLXhsXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTYgcHktNVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbihzLnRleHRHcmFkaWVudCwgJ3RleHQtYmFzZSBmb250LXNlbWlib2xkIGxlYWRpbmctWzI0cHhdJyl9PlxuICAgICAgICAgICAgPGRpdj57dCgndmVjdG9yU3BhY2UuZnVsbFRpcCcsIHsgbnM6ICdiaWxsaW5nJyB9KX08L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+e3QoJ3ZlY3RvclNwYWNlLmZ1bGxTb2x1dGlvbicsIHsgbnM6ICdiaWxsaW5nJyB9KX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8VXBncmFkZUJ0biBsb2M9XCJrbm93bGVkZ2UtYWRkLWZpbGVcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFZlY3RvclNwYWNlSW5mbyBjbGFzc05hbWU9XCJwdC00XCIgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvR3JpZE1hc2s+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oVmVjdG9yU3BhY2VGdWxsKVxuIl19