"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaysOfWeek = void 0;
const React = require("react");
const hooks_1 = require("../hooks");
const DaysOfWeek = () => {
    const daysOfWeek = (0, hooks_1.useDaysOfWeek)();
    return (<div className="grid grid-cols-7 gap-x-0.5 border-b-[0.5px] border-divider-regular p-2">
      {daysOfWeek.map(day => (<div key={day} className="system-2xs-medium flex items-center justify-center text-text-tertiary">
          {day}
        </div>))}
    </div>);
};
exports.DaysOfWeek = DaysOfWeek;
exports.default = React.memo(exports.DaysOfWeek);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5cy1vZi13ZWVrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGF5cy1vZi13ZWVrLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBOEI7QUFDOUIsb0NBQXdDO0FBRWpDLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtJQUM3QixNQUFNLFVBQVUsR0FBRyxJQUFBLHFCQUFhLEdBQUUsQ0FBQTtJQUVsQyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdFQUF3RSxDQUNyRjtNQUFBLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQ3JCLENBQUMsR0FBRyxDQUNGLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNULFNBQVMsQ0FBQyx1RUFBdUUsQ0FFakY7VUFBQSxDQUFDLEdBQUcsQ0FDTjtRQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyxDQUNKO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBZlksUUFBQSxVQUFVLGNBZXRCO0FBRUQsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBVSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZURheXNPZldlZWsgfSBmcm9tICcuLi9ob29rcydcblxuZXhwb3J0IGNvbnN0IERheXNPZldlZWsgPSAoKSA9PiB7XG4gIGNvbnN0IGRheXNPZldlZWsgPSB1c2VEYXlzT2ZXZWVrKClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtNyBnYXAteC0wLjUgYm9yZGVyLWItWzAuNXB4XSBib3JkZXItZGl2aWRlci1yZWd1bGFyIHAtMlwiPlxuICAgICAge2RheXNPZldlZWsubWFwKGRheSA9PiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2RheX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJzeXN0ZW0tMnhzLW1lZGl1bSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LXRleHQtdGVydGlhcnlcIlxuICAgICAgICA+XG4gICAgICAgICAge2RheX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKERheXNPZldlZWspXG4iXX0=