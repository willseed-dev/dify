"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewType = void 0;
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const classnames_1 = require("@/utils/classnames");
var ViewType;
(function (ViewType) {
    ViewType["flat"] = "flat";
    ViewType["tree"] = "tree";
})(ViewType || (exports.ViewType = ViewType = {}));
const ViewTypeSelect = ({ viewType, onChange, }) => {
    const handleChange = (0, react_2.useCallback)((nextViewType) => {
        return () => {
            if (nextViewType === viewType)
                return;
            onChange(nextViewType);
        };
    }, [viewType, onChange]);
    return (<div className="flex items-center rounded-lg bg-components-segmented-control-bg-normal p-px">
      <div className={(0, classnames_1.cn)('rounded-lg p-[3px]', viewType === ViewType.flat
            ? 'bg-components-segmented-control-item-active-bg text-text-accent-light-mode-only shadow-xs'
            : 'cursor-pointer text-text-tertiary')} onClick={handleChange(ViewType.flat)}>
        <react_1.RiSortAlphabetAsc className="h-4 w-4"/>
      </div>
      <div className={(0, classnames_1.cn)('rounded-lg p-[3px]', viewType === ViewType.tree
            ? 'bg-components-segmented-control-item-active-bg text-text-accent-light-mode-only shadow-xs'
            : 'cursor-pointer text-text-tertiary')} onClick={handleChange(ViewType.tree)}>
        <react_1.RiNodeTree className="h-4 w-4 "/>
      </div>
    </div>);
};
exports.default = React.memo(ViewTypeSelect);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy10eXBlLXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpZXctdHlwZS1zZWxlY3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7OztBQUVaLDRDQUFnRTtBQUNoRSwrQkFBOEI7QUFDOUIsaUNBQW1DO0FBQ25DLG1EQUF1QztBQUV2QyxJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDbEIseUJBQWEsQ0FBQTtJQUNiLHlCQUFhLENBQUE7QUFDZixDQUFDLEVBSFcsUUFBUSx3QkFBUixRQUFRLFFBR25CO0FBT0QsTUFBTSxjQUFjLEdBQWMsQ0FBQyxFQUNqQyxRQUFRLEVBQ1IsUUFBUSxHQUNULEVBQUUsRUFBRTtJQUNILE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLFlBQXNCLEVBQUUsRUFBRTtRQUMxRCxPQUFPLEdBQUcsRUFBRTtZQUNWLElBQUksWUFBWSxLQUFLLFFBQVE7Z0JBQzNCLE9BQU07WUFDUixRQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDeEIsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFFeEIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2RUFBNkUsQ0FDMUY7TUFBQSxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsQ0FDUixJQUFBLGVBQUUsRUFBQyxvQkFBb0IsRUFBRSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUk7WUFDakQsQ0FBQyxDQUFDLDJGQUEyRjtZQUM3RixDQUFDLENBQUMsbUNBQW1DLENBQ3pDLENBQUMsQ0FDRCxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBRXJDO1FBQUEsQ0FBQyx5QkFBaUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUN4QztNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLENBQ1IsSUFBQSxlQUFFLEVBQUMsb0JBQW9CLEVBQUUsUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJO1lBQ2pELENBQUMsQ0FBQywyRkFBMkY7WUFDN0YsQ0FBQyxDQUFDLG1DQUFtQyxDQUN6QyxDQUFDLENBQ0QsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUVyQztRQUFBLENBQUMsa0JBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUNsQztNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgUmlOb2RlVHJlZSwgUmlTb3J0QWxwaGFiZXRBc2MgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5cbmV4cG9ydCBlbnVtIFZpZXdUeXBlIHtcbiAgZmxhdCA9ICdmbGF0JyxcbiAgdHJlZSA9ICd0cmVlJyxcbn1cblxudHlwZSBQcm9wcyA9IHtcbiAgdmlld1R5cGU6IFZpZXdUeXBlXG4gIG9uQ2hhbmdlOiAodmlld1R5cGU6IFZpZXdUeXBlKSA9PiB2b2lkXG59XG5cbmNvbnN0IFZpZXdUeXBlU2VsZWN0OiBGQzxQcm9wcz4gPSAoe1xuICB2aWV3VHlwZSxcbiAgb25DaGFuZ2UsXG59KSA9PiB7XG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChuZXh0Vmlld1R5cGU6IFZpZXdUeXBlKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChuZXh0Vmlld1R5cGUgPT09IHZpZXdUeXBlKVxuICAgICAgICByZXR1cm5cbiAgICAgIG9uQ2hhbmdlKG5leHRWaWV3VHlwZSlcbiAgICB9XG4gIH0sIFt2aWV3VHlwZSwgb25DaGFuZ2VdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciByb3VuZGVkLWxnIGJnLWNvbXBvbmVudHMtc2VnbWVudGVkLWNvbnRyb2wtYmctbm9ybWFsIHAtcHhcIj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtcbiAgICAgICAgICBjbigncm91bmRlZC1sZyBwLVszcHhdJywgdmlld1R5cGUgPT09IFZpZXdUeXBlLmZsYXRcbiAgICAgICAgICAgID8gJ2JnLWNvbXBvbmVudHMtc2VnbWVudGVkLWNvbnRyb2wtaXRlbS1hY3RpdmUtYmcgdGV4dC10ZXh0LWFjY2VudC1saWdodC1tb2RlLW9ubHkgc2hhZG93LXhzJ1xuICAgICAgICAgICAgOiAnY3Vyc29yLXBvaW50ZXIgdGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgICAgfVxuICAgICAgICBvbkNsaWNrPXtoYW5kbGVDaGFuZ2UoVmlld1R5cGUuZmxhdCl9XG4gICAgICA+XG4gICAgICAgIDxSaVNvcnRBbHBoYWJldEFzYyBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e1xuICAgICAgICAgIGNuKCdyb3VuZGVkLWxnIHAtWzNweF0nLCB2aWV3VHlwZSA9PT0gVmlld1R5cGUudHJlZVxuICAgICAgICAgICAgPyAnYmctY29tcG9uZW50cy1zZWdtZW50ZWQtY29udHJvbC1pdGVtLWFjdGl2ZS1iZyB0ZXh0LXRleHQtYWNjZW50LWxpZ2h0LW1vZGUtb25seSBzaGFkb3cteHMnXG4gICAgICAgICAgICA6ICdjdXJzb3ItcG9pbnRlciB0ZXh0LXRleHQtdGVydGlhcnknKVxuICAgICAgICB9XG4gICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNoYW5nZShWaWV3VHlwZS50cmVlKX1cbiAgICAgID5cbiAgICAgICAgPFJpTm9kZVRyZWUgY2xhc3NOYW1lPVwiaC00IHctNCBcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oVmlld1R5cGVTZWxlY3QpXG4iXX0=