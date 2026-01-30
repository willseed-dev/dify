"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const segmented_control_1 = require("@/app/components/base/segmented-control");
const ModeSwitcher = ({ mode, onChange }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const options = [
        {
            Icon: react_1.RiCalendarLine,
            text: t('nodes.triggerSchedule.modeVisual', { ns: 'workflow' }),
            value: 'visual',
        },
        {
            Icon: react_1.RiCodeLine,
            text: t('nodes.triggerSchedule.modeCron', { ns: 'workflow' }),
            value: 'cron',
        },
    ];
    return (<segmented_control_1.SegmentedControl options={options} value={mode} onChange={onChange}/>);
};
exports.default = ModeSwitcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZS1zd2l0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vZGUtc3dpdGNoZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNENBQTZEO0FBQzdELCtCQUE4QjtBQUM5QixpREFBOEM7QUFDOUMsK0VBQTBFO0FBTzFFLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFxQixFQUFFLEVBQUU7SUFDN0QsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE1BQU0sT0FBTyxHQUFHO1FBQ2Q7WUFDRSxJQUFJLEVBQUUsc0JBQWM7WUFDcEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQ0FBa0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztZQUMvRCxLQUFLLEVBQUUsUUFBaUI7U0FDekI7UUFDRDtZQUNFLElBQUksRUFBRSxrQkFBVTtZQUNoQixJQUFJLEVBQUUsQ0FBQyxDQUFDLGdDQUFnQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDO1lBQzdELEtBQUssRUFBRSxNQUFlO1NBQ3ZCO0tBQ0YsQ0FBQTtJQUVELE9BQU8sQ0FDTCxDQUFDLG9DQUFnQixDQUNmLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNqQixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDWixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFDbkIsQ0FDSCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTY2hlZHVsZU1vZGUgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IFJpQ2FsZW5kYXJMaW5lLCBSaUNvZGVMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgU2VnbWVudGVkQ29udHJvbCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9zZWdtZW50ZWQtY29udHJvbCdcblxudHlwZSBNb2RlU3dpdGNoZXJQcm9wcyA9IHtcbiAgbW9kZTogU2NoZWR1bGVNb2RlXG4gIG9uQ2hhbmdlOiAobW9kZTogU2NoZWR1bGVNb2RlKSA9PiB2b2lkXG59XG5cbmNvbnN0IE1vZGVTd2l0Y2hlciA9ICh7IG1vZGUsIG9uQ2hhbmdlIH06IE1vZGVTd2l0Y2hlclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IG9wdGlvbnMgPSBbXG4gICAge1xuICAgICAgSWNvbjogUmlDYWxlbmRhckxpbmUsXG4gICAgICB0ZXh0OiB0KCdub2Rlcy50cmlnZ2VyU2NoZWR1bGUubW9kZVZpc3VhbCcsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICB2YWx1ZTogJ3Zpc3VhbCcgYXMgY29uc3QsXG4gICAgfSxcbiAgICB7XG4gICAgICBJY29uOiBSaUNvZGVMaW5lLFxuICAgICAgdGV4dDogdCgnbm9kZXMudHJpZ2dlclNjaGVkdWxlLm1vZGVDcm9uJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgIHZhbHVlOiAnY3JvbicgYXMgY29uc3QsXG4gICAgfSxcbiAgXVxuXG4gIHJldHVybiAoXG4gICAgPFNlZ21lbnRlZENvbnRyb2xcbiAgICAgIG9wdGlvbnM9e29wdGlvbnN9XG4gICAgICB2YWx1ZT17bW9kZX1cbiAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVTd2l0Y2hlclxuIl19