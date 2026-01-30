"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePanelInteractions = void 0;
const react_1 = require("react");
const store_1 = require("../store");
const usePanelInteractions = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handlePaneContextMenu = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        const container = document.querySelector('#workflow-container');
        const { x, y } = container.getBoundingClientRect();
        workflowStore.setState({
            panelMenu: {
                top: e.clientY - y,
                left: e.clientX - x,
            },
        });
    }, [workflowStore]);
    const handlePaneContextmenuCancel = (0, react_1.useCallback)(() => {
        workflowStore.setState({
            panelMenu: undefined,
        });
    }, [workflowStore]);
    const handleNodeContextmenuCancel = (0, react_1.useCallback)(() => {
        workflowStore.setState({
            nodeMenu: undefined,
        });
    }, [workflowStore]);
    return {
        handlePaneContextMenu,
        handlePaneContextmenuCancel,
        handleNodeContextmenuCancel,
    };
};
exports.usePanelInteractions = usePanelInteractions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBhbmVsLWludGVyYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1wYW5lbC1pbnRlcmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQW1DO0FBQ25DLG9DQUEyQztBQUVwQyxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUN2QyxNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFFeEMsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxDQUFhLEVBQUUsRUFBRTtRQUMxRCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7UUFDbEIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1FBQy9ELE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsU0FBVSxDQUFDLHFCQUFxQixFQUFFLENBQUE7UUFDbkQsYUFBYSxDQUFDLFFBQVEsQ0FBQztZQUNyQixTQUFTLEVBQUU7Z0JBQ1QsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQztnQkFDbEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQzthQUNwQjtTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFbkIsTUFBTSwyQkFBMkIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ25ELGFBQWEsQ0FBQyxRQUFRLENBQUM7WUFDckIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUVuQixNQUFNLDJCQUEyQixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDbkQsYUFBYSxDQUFDLFFBQVEsQ0FBQztZQUNyQixRQUFRLEVBQUUsU0FBUztTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBRW5CLE9BQU87UUFDTCxxQkFBcUI7UUFDckIsMkJBQTJCO1FBQzNCLDJCQUEyQjtLQUM1QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBaENZLFFBQUEsb0JBQW9CLHdCQWdDaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vdXNlRXZlbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnLi4vc3RvcmUnXG5cbmV4cG9ydCBjb25zdCB1c2VQYW5lbEludGVyYWN0aW9ucyA9ICgpID0+IHtcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuXG4gIGNvbnN0IGhhbmRsZVBhbmVDb250ZXh0TWVudSA9IHVzZUNhbGxiYWNrKChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtmbG93LWNvbnRhaW5lcicpXG4gICAgY29uc3QgeyB4LCB5IH0gPSBjb250YWluZXIhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgd29ya2Zsb3dTdG9yZS5zZXRTdGF0ZSh7XG4gICAgICBwYW5lbE1lbnU6IHtcbiAgICAgICAgdG9wOiBlLmNsaWVudFkgLSB5LFxuICAgICAgICBsZWZ0OiBlLmNsaWVudFggLSB4LFxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbd29ya2Zsb3dTdG9yZV0pXG5cbiAgY29uc3QgaGFuZGxlUGFuZUNvbnRleHRtZW51Q2FuY2VsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoe1xuICAgICAgcGFuZWxNZW51OiB1bmRlZmluZWQsXG4gICAgfSlcbiAgfSwgW3dvcmtmbG93U3RvcmVdKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVDb250ZXh0bWVudUNhbmNlbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICB3b3JrZmxvd1N0b3JlLnNldFN0YXRlKHtcbiAgICAgIG5vZGVNZW51OiB1bmRlZmluZWQsXG4gICAgfSlcbiAgfSwgW3dvcmtmbG93U3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlUGFuZUNvbnRleHRNZW51LFxuICAgIGhhbmRsZVBhbmVDb250ZXh0bWVudUNhbmNlbCxcbiAgICBoYW5kbGVOb2RlQ29udGV4dG1lbnVDYW5jZWwsXG4gIH1cbn1cbiJdfQ==