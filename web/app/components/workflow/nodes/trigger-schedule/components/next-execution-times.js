"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const execution_time_calculator_1 = require("../utils/execution-time-calculator");
const NextExecutionTimes = ({ data }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!data.frequency)
        return null;
    const executionTimes = (0, execution_time_calculator_1.getFormattedExecutionTimes)(data, 5);
    if (executionTimes.length === 0)
        return null;
    return (<div className="space-y-2">
      <label className="block text-xs font-medium text-gray-500">
        {t('nodes.triggerSchedule.nextExecutionTimes', { ns: 'workflow' })}
      </label>
      <div className="flex min-h-[80px] flex-col rounded-xl bg-components-input-bg-normal py-2">
        {executionTimes.map((time, index) => (<div key={index} className="flex items-baseline text-xs">
            <span className="w-6 select-none text-right font-mono font-normal leading-[150%] tracking-wider text-text-quaternary">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="pl-2 pr-3 font-mono font-normal leading-[150%] tracking-wider text-text-secondary">
              {time}
            </span>
          </div>))}
      </div>
    </div>);
};
exports.default = NextExecutionTimes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV4dC1leGVjdXRpb24tdGltZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXh0LWV4ZWN1dGlvbi10aW1lcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLGtGQUErRTtBQU0vRSxNQUFNLGtCQUFrQixHQUFHLENBQUMsRUFBRSxJQUFJLEVBQTJCLEVBQUUsRUFBRTtJQUMvRCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTO1FBQ2pCLE9BQU8sSUFBSSxDQUFBO0lBRWIsTUFBTSxjQUFjLEdBQUcsSUFBQSxzREFBMEIsRUFBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFFMUQsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUE7SUFFYixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FDeEI7TUFBQSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQ3hEO1FBQUEsQ0FBQyxDQUFDLENBQUMsMENBQTBDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDcEU7TUFBQSxFQUFFLEtBQUssQ0FDUDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwRUFBMEUsQ0FDdkY7UUFBQSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUNuQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQ3REO1lBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHFHQUFxRyxDQUNuSDtjQUFBLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUNyQztZQUFBLEVBQUUsSUFBSSxDQUNOO1lBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1GQUFtRixDQUNqRztjQUFBLENBQUMsSUFBSSxDQUNQO1lBQUEsRUFBRSxJQUFJLENBQ1I7VUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUMsQ0FDSjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNjaGVkdWxlVHJpZ2dlck5vZGVUeXBlIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IGdldEZvcm1hdHRlZEV4ZWN1dGlvblRpbWVzIH0gZnJvbSAnLi4vdXRpbHMvZXhlY3V0aW9uLXRpbWUtY2FsY3VsYXRvcidcblxudHlwZSBOZXh0RXhlY3V0aW9uVGltZXNQcm9wcyA9IHtcbiAgZGF0YTogU2NoZWR1bGVUcmlnZ2VyTm9kZVR5cGVcbn1cblxuY29uc3QgTmV4dEV4ZWN1dGlvblRpbWVzID0gKHsgZGF0YSB9OiBOZXh0RXhlY3V0aW9uVGltZXNQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICBpZiAoIWRhdGEuZnJlcXVlbmN5KVxuICAgIHJldHVybiBudWxsXG5cbiAgY29uc3QgZXhlY3V0aW9uVGltZXMgPSBnZXRGb3JtYXR0ZWRFeGVjdXRpb25UaW1lcyhkYXRhLCA1KVxuXG4gIGlmIChleGVjdXRpb25UaW1lcy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgIHt0KCdub2Rlcy50cmlnZ2VyU2NoZWR1bGUubmV4dEV4ZWN1dGlvblRpbWVzJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgIDwvbGFiZWw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggbWluLWgtWzgwcHhdIGZsZXgtY29sIHJvdW5kZWQteGwgYmctY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwgcHktMlwiPlxuICAgICAgICB7ZXhlY3V0aW9uVGltZXMubWFwKCh0aW1lLCBpbmRleCkgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXtpbmRleH0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1iYXNlbGluZSB0ZXh0LXhzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3LTYgc2VsZWN0LW5vbmUgdGV4dC1yaWdodCBmb250LW1vbm8gZm9udC1ub3JtYWwgbGVhZGluZy1bMTUwJV0gdHJhY2tpbmctd2lkZXIgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIj5cbiAgICAgICAgICAgICAge1N0cmluZyhpbmRleCArIDEpLnBhZFN0YXJ0KDIsICcwJyl9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwbC0yIHByLTMgZm9udC1tb25vIGZvbnQtbm9ybWFsIGxlYWRpbmctWzE1MCVdIHRyYWNraW5nLXdpZGVyIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAge3RpbWV9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmV4dEV4ZWN1dGlvblRpbWVzXG4iXX0=