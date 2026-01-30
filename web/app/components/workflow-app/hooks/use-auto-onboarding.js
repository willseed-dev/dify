"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoOnboarding = void 0;
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const store_1 = require("@/app/components/workflow/store");
const useAutoOnboarding = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const checkAndShowOnboarding = (0, react_1.useCallback)(() => {
        const { getNodes } = store.getState();
        const { showOnboarding, hasShownOnboarding, notInitialWorkflow, setShowOnboarding, setHasShownOnboarding, setShouldAutoOpenStartNodeSelector, } = workflowStore.getState();
        // Skip if already showing onboarding or it's the initial workflow creation
        if (showOnboarding || notInitialWorkflow)
            return;
        const nodes = getNodes();
        // Check if canvas is completely empty (no nodes at all)
        // Only trigger onboarding when canvas is completely blank to avoid data loss
        const isCompletelyEmpty = nodes.length === 0;
        // Show onboarding only if canvas is completely empty and we haven't shown it before in this session
        if (isCompletelyEmpty && !hasShownOnboarding) {
            setShowOnboarding?.(true);
            setHasShownOnboarding?.(true);
            setShouldAutoOpenStartNodeSelector?.(true);
        }
    }, [store, workflowStore]);
    const handleOnboardingClose = (0, react_1.useCallback)(() => {
        const { setShowOnboarding, setHasShownOnboarding, setShouldAutoOpenStartNodeSelector, hasSelectedStartNode, setHasSelectedStartNode, } = workflowStore.getState();
        setShowOnboarding?.(false);
        setHasShownOnboarding?.(true);
        if (hasSelectedStartNode)
            setHasSelectedStartNode?.(false);
        else
            setShouldAutoOpenStartNodeSelector?.(false);
    }, [workflowStore]);
    // Check on mount and when nodes change
    (0, react_1.useEffect)(() => {
        // Small delay to ensure the workflow data is loaded
        const timer = setTimeout(() => {
            checkAndShowOnboarding();
        }, 500);
        return () => clearTimeout(timer);
    }, [checkAndShowOnboarding]);
    return {
        checkAndShowOnboarding,
        handleOnboardingClose,
    };
};
exports.useAutoOnboarding = useAutoOnboarding;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWF1dG8tb25ib2FyZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1hdXRvLW9uYm9hcmRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQThDO0FBQzlDLHlDQUF1QztBQUN2QywyREFBa0U7QUFFM0QsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLEVBQUU7SUFDcEMsTUFBTSxLQUFLLEdBQUcsSUFBQSx1QkFBVyxHQUFFLENBQUE7SUFDM0IsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBRXhDLE1BQU0sc0JBQXNCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUM5QyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3JDLE1BQU0sRUFDSixjQUFjLEVBQ2Qsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixpQkFBaUIsRUFDakIscUJBQXFCLEVBQ3JCLGtDQUFrQyxHQUNuQyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUU1QiwyRUFBMkU7UUFDM0UsSUFBSSxjQUFjLElBQUksa0JBQWtCO1lBQ3RDLE9BQU07UUFFUixNQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQTtRQUV4Qix3REFBd0Q7UUFDeEQsNkVBQTZFO1FBQzdFLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7UUFFNUMsb0dBQW9HO1FBQ3BHLElBQUksaUJBQWlCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzdDLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDekIscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM3QixrQ0FBa0MsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzVDLENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUUxQixNQUFNLHFCQUFxQixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDN0MsTUFBTSxFQUNKLGlCQUFpQixFQUNqQixxQkFBcUIsRUFDckIsa0NBQWtDLEVBQ2xDLG9CQUFvQixFQUNwQix1QkFBdUIsR0FDeEIsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDNUIsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMxQixxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzdCLElBQUksb0JBQW9CO1lBQ3RCLHVCQUF1QixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7O1lBRWhDLGtDQUFrQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDL0MsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUVuQix1Q0FBdUM7SUFDdkMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLG9EQUFvRDtRQUNwRCxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzVCLHNCQUFzQixFQUFFLENBQUE7UUFDMUIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBRVAsT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEMsQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFBO0lBRTVCLE9BQU87UUFDTCxzQkFBc0I7UUFDdEIscUJBQXFCO0tBQ3RCLENBQUE7QUFDSCxDQUFDLENBQUE7QUEvRFksUUFBQSxpQkFBaUIscUJBK0Q3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0b3JlQXBpIH0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5cbmV4cG9ydCBjb25zdCB1c2VBdXRvT25ib2FyZGluZyA9ICgpID0+IHtcbiAgY29uc3Qgc3RvcmUgPSB1c2VTdG9yZUFwaSgpXG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcblxuICBjb25zdCBjaGVja0FuZFNob3dPbmJvYXJkaW5nID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHsgZ2V0Tm9kZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCB7XG4gICAgICBzaG93T25ib2FyZGluZyxcbiAgICAgIGhhc1Nob3duT25ib2FyZGluZyxcbiAgICAgIG5vdEluaXRpYWxXb3JrZmxvdyxcbiAgICAgIHNldFNob3dPbmJvYXJkaW5nLFxuICAgICAgc2V0SGFzU2hvd25PbmJvYXJkaW5nLFxuICAgICAgc2V0U2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvcixcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAvLyBTa2lwIGlmIGFscmVhZHkgc2hvd2luZyBvbmJvYXJkaW5nIG9yIGl0J3MgdGhlIGluaXRpYWwgd29ya2Zsb3cgY3JlYXRpb25cbiAgICBpZiAoc2hvd09uYm9hcmRpbmcgfHwgbm90SW5pdGlhbFdvcmtmbG93KVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcblxuICAgIC8vIENoZWNrIGlmIGNhbnZhcyBpcyBjb21wbGV0ZWx5IGVtcHR5IChubyBub2RlcyBhdCBhbGwpXG4gICAgLy8gT25seSB0cmlnZ2VyIG9uYm9hcmRpbmcgd2hlbiBjYW52YXMgaXMgY29tcGxldGVseSBibGFuayB0byBhdm9pZCBkYXRhIGxvc3NcbiAgICBjb25zdCBpc0NvbXBsZXRlbHlFbXB0eSA9IG5vZGVzLmxlbmd0aCA9PT0gMFxuXG4gICAgLy8gU2hvdyBvbmJvYXJkaW5nIG9ubHkgaWYgY2FudmFzIGlzIGNvbXBsZXRlbHkgZW1wdHkgYW5kIHdlIGhhdmVuJ3Qgc2hvd24gaXQgYmVmb3JlIGluIHRoaXMgc2Vzc2lvblxuICAgIGlmIChpc0NvbXBsZXRlbHlFbXB0eSAmJiAhaGFzU2hvd25PbmJvYXJkaW5nKSB7XG4gICAgICBzZXRTaG93T25ib2FyZGluZz8uKHRydWUpXG4gICAgICBzZXRIYXNTaG93bk9uYm9hcmRpbmc/Lih0cnVlKVxuICAgICAgc2V0U2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3Rvcj8uKHRydWUpXG4gICAgfVxuICB9LCBbc3RvcmUsIHdvcmtmbG93U3RvcmVdKVxuXG4gIGNvbnN0IGhhbmRsZU9uYm9hcmRpbmdDbG9zZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzZXRTaG93T25ib2FyZGluZyxcbiAgICAgIHNldEhhc1Nob3duT25ib2FyZGluZyxcbiAgICAgIHNldFNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3IsXG4gICAgICBoYXNTZWxlY3RlZFN0YXJ0Tm9kZSxcbiAgICAgIHNldEhhc1NlbGVjdGVkU3RhcnROb2RlLFxuICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICBzZXRTaG93T25ib2FyZGluZz8uKGZhbHNlKVxuICAgIHNldEhhc1Nob3duT25ib2FyZGluZz8uKHRydWUpXG4gICAgaWYgKGhhc1NlbGVjdGVkU3RhcnROb2RlKVxuICAgICAgc2V0SGFzU2VsZWN0ZWRTdGFydE5vZGU/LihmYWxzZSlcbiAgICBlbHNlXG4gICAgICBzZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yPy4oZmFsc2UpXG4gIH0sIFt3b3JrZmxvd1N0b3JlXSlcblxuICAvLyBDaGVjayBvbiBtb3VudCBhbmQgd2hlbiBub2RlcyBjaGFuZ2VcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBTbWFsbCBkZWxheSB0byBlbnN1cmUgdGhlIHdvcmtmbG93IGRhdGEgaXMgbG9hZGVkXG4gICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNoZWNrQW5kU2hvd09uYm9hcmRpbmcoKVxuICAgIH0sIDUwMClcblxuICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodGltZXIpXG4gIH0sIFtjaGVja0FuZFNob3dPbmJvYXJkaW5nXSlcblxuICByZXR1cm4ge1xuICAgIGNoZWNrQW5kU2hvd09uYm9hcmRpbmcsXG4gICAgaGFuZGxlT25ib2FyZGluZ0Nsb3NlLFxuICB9XG59XG4iXX0=