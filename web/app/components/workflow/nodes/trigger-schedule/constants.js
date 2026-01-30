"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultVisualConfig = exports.getDefaultScheduleConfig = void 0;
const getDefaultScheduleConfig = () => ({
    mode: 'visual',
    frequency: 'daily',
    visual_config: {
        time: '12:00 AM',
        weekdays: ['sun'],
        on_minute: 0,
        monthly_days: [1],
    },
});
exports.getDefaultScheduleConfig = getDefaultScheduleConfig;
const getDefaultVisualConfig = () => ({
    time: '12:00 AM',
    weekdays: ['sun'],
    on_minute: 0,
    monthly_days: [1],
});
exports.getDefaultVisualConfig = getDefaultVisualConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVPLE1BQU0sd0JBQXdCLEdBQUcsR0FBcUMsRUFBRSxDQUFDLENBQUM7SUFDL0UsSUFBSSxFQUFFLFFBQVE7SUFDZCxTQUFTLEVBQUUsT0FBTztJQUNsQixhQUFhLEVBQUU7UUFDYixJQUFJLEVBQUUsVUFBVTtRQUNoQixRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDakIsU0FBUyxFQUFFLENBQUM7UUFDWixZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbEI7Q0FDRixDQUFDLENBQUE7QUFUVyxRQUFBLHdCQUF3Qiw0QkFTbkM7QUFFSyxNQUFNLHNCQUFzQixHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDM0MsSUFBSSxFQUFFLFVBQVU7SUFDaEIsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2pCLFNBQVMsRUFBRSxDQUFDO0lBQ1osWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO0NBQ2xCLENBQUMsQ0FBQTtBQUxXLFFBQUEsc0JBQXNCLDBCQUtqQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU2NoZWR1bGVUcmlnZ2VyTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgZ2V0RGVmYXVsdFNjaGVkdWxlQ29uZmlnID0gKCk6IFBhcnRpYWw8U2NoZWR1bGVUcmlnZ2VyTm9kZVR5cGU+ID0+ICh7XG4gIG1vZGU6ICd2aXN1YWwnLFxuICBmcmVxdWVuY3k6ICdkYWlseScsXG4gIHZpc3VhbF9jb25maWc6IHtcbiAgICB0aW1lOiAnMTI6MDAgQU0nLFxuICAgIHdlZWtkYXlzOiBbJ3N1biddLFxuICAgIG9uX21pbnV0ZTogMCxcbiAgICBtb250aGx5X2RheXM6IFsxXSxcbiAgfSxcbn0pXG5cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0VmlzdWFsQ29uZmlnID0gKCkgPT4gKHtcbiAgdGltZTogJzEyOjAwIEFNJyxcbiAgd2Vla2RheXM6IFsnc3VuJ10sXG4gIG9uX21pbnV0ZTogMCxcbiAgbW9udGhseV9kYXlzOiBbMV0sXG59KVxuIl19