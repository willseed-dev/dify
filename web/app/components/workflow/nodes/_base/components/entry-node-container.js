"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartNodeTypeEnum = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
var StartNodeTypeEnum;
(function (StartNodeTypeEnum) {
    StartNodeTypeEnum["Start"] = "start";
    StartNodeTypeEnum["Trigger"] = "trigger";
})(StartNodeTypeEnum || (exports.StartNodeTypeEnum = StartNodeTypeEnum = {}));
const EntryNodeContainer = ({ children, customLabel, nodeType = StartNodeTypeEnum.Trigger, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const label = (0, react_1.useMemo)(() => {
        const translationKey = nodeType === StartNodeTypeEnum.Start ? 'entryNodeStatus' : 'triggerStatus';
        return customLabel || t(`${translationKey}.enabled`, { ns: 'workflow' });
    }, [customLabel, nodeType, t]);
    return (<div className="w-fit min-w-[242px] rounded-2xl bg-workflow-block-wrapper-bg-1 px-0 pb-0 pt-0.5">
      <div className="mb-0.5 flex items-center px-2.5 pt-0.5">
        <span className="text-2xs font-semibold uppercase text-text-tertiary">
          {label}
        </span>
      </div>
      {children}
    </div>);
};
exports.default = EntryNodeContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnktbm9kZS1jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbnRyeS1ub2RlLWNvbnRhaW5lci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQStCO0FBQy9CLGlEQUE4QztBQUU5QyxJQUFZLGlCQUdYO0FBSEQsV0FBWSxpQkFBaUI7SUFDM0Isb0NBQWUsQ0FBQTtJQUNmLHdDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFIVyxpQkFBaUIsaUNBQWpCLGlCQUFpQixRQUc1QjtBQVFELE1BQU0sa0JBQWtCLEdBQWdDLENBQUMsRUFDdkQsUUFBUSxFQUNSLFdBQVcsRUFDWCxRQUFRLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxHQUNyQyxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ3pCLE1BQU0sY0FBYyxHQUFHLFFBQVEsS0FBSyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUE7UUFDakcsT0FBTyxXQUFXLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtJQUMxRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFOUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpRkFBaUYsQ0FDOUY7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0NBQXdDLENBQ3JEO1FBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHFEQUFxRCxDQUNuRTtVQUFBLENBQUMsS0FBSyxDQUNSO1FBQUEsRUFBRSxJQUFJLENBQ1I7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsUUFBUSxDQUNYO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZDLCBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcblxuZXhwb3J0IGVudW0gU3RhcnROb2RlVHlwZUVudW0ge1xuICBTdGFydCA9ICdzdGFydCcsXG4gIFRyaWdnZXIgPSAndHJpZ2dlcicsXG59XG5cbnR5cGUgRW50cnlOb2RlQ29udGFpbmVyUHJvcHMgPSB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGVcbiAgY3VzdG9tTGFiZWw/OiBzdHJpbmdcbiAgbm9kZVR5cGU/OiBTdGFydE5vZGVUeXBlRW51bVxufVxuXG5jb25zdCBFbnRyeU5vZGVDb250YWluZXI6IEZDPEVudHJ5Tm9kZUNvbnRhaW5lclByb3BzPiA9ICh7XG4gIGNoaWxkcmVuLFxuICBjdXN0b21MYWJlbCxcbiAgbm9kZVR5cGUgPSBTdGFydE5vZGVUeXBlRW51bS5UcmlnZ2VyLFxufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICBjb25zdCBsYWJlbCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHRyYW5zbGF0aW9uS2V5ID0gbm9kZVR5cGUgPT09IFN0YXJ0Tm9kZVR5cGVFbnVtLlN0YXJ0ID8gJ2VudHJ5Tm9kZVN0YXR1cycgOiAndHJpZ2dlclN0YXR1cydcbiAgICByZXR1cm4gY3VzdG9tTGFiZWwgfHwgdChgJHt0cmFuc2xhdGlvbktleX0uZW5hYmxlZGAsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgfSwgW2N1c3RvbUxhYmVsLCBub2RlVHlwZSwgdF0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInctZml0IG1pbi13LVsyNDJweF0gcm91bmRlZC0yeGwgYmctd29ya2Zsb3ctYmxvY2std3JhcHBlci1iZy0xIHB4LTAgcGItMCBwdC0wLjVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMC41IGZsZXggaXRlbXMtY2VudGVyIHB4LTIuNSBwdC0wLjVcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC0yeHMgZm9udC1zZW1pYm9sZCB1cHBlcmNhc2UgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAge2xhYmVsfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBFbnRyeU5vZGVDb250YWluZXJcbiJdfQ==