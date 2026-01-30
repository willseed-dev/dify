"use strict";
/**
 * Node navigation utilities for workflow
 * This module provides functions for node selection, focusing and scrolling in workflow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectWorkflowNode = selectWorkflowNode;
exports.scrollToWorkflowNode = scrollToWorkflowNode;
exports.setupNodeSelectionListener = setupNodeSelectionListener;
exports.setupScrollToNodeListener = setupScrollToNodeListener;
/**
 * Select a node in the workflow
 * @param nodeId - The ID of the node to select
 * @param focus - Whether to focus/scroll to the node
 */
function selectWorkflowNode(nodeId, focus = false) {
    // Create and dispatch a custom event for node selection
    const event = new CustomEvent('workflow:select-node', {
        detail: {
            nodeId,
            focus,
        },
    });
    document.dispatchEvent(event);
}
/**
 * Scroll to a specific node in the workflow
 * @param nodeId - The ID of the node to scroll to
 */
function scrollToWorkflowNode(nodeId) {
    // Create and dispatch a custom event for scrolling to node
    const event = new CustomEvent('workflow:scroll-to-node', {
        detail: { nodeId },
    });
    document.dispatchEvent(event);
}
/**
 * Setup node selection event listener
 * @param handleNodeSelect - Function to handle node selection
 * @returns Cleanup function
 */
function setupNodeSelectionListener(handleNodeSelect) {
    // Event handler for node selection
    const handleNodeSelection = (event) => {
        const { nodeId, focus } = event.detail;
        if (nodeId) {
            // Select the node
            handleNodeSelect(nodeId);
            // If focus is requested, scroll to the node
            if (focus) {
                // Use a small timeout to ensure node selection happens first
                setTimeout(() => {
                    scrollToWorkflowNode(nodeId);
                }, 100);
            }
        }
    };
    // Add event listener
    document.addEventListener('workflow:select-node', handleNodeSelection);
    // Return cleanup function
    return () => {
        document.removeEventListener('workflow:select-node', handleNodeSelection);
    };
}
/**
 * Setup scroll to node event listener with ReactFlow
 * @param nodes - The workflow nodes
 * @param reactflow - The ReactFlow instance
 * @returns Cleanup function
 */
function setupScrollToNodeListener(nodes, reactflow) {
    // Event handler for scrolling to node
    const handleScrollToNode = (event) => {
        const { nodeId } = event.detail;
        if (nodeId) {
            // Find the target node
            const node = nodes.find(n => n.id === nodeId);
            if (node) {
                // Use ReactFlow's fitView API to scroll to the node
                const nodePosition = { x: node.position.x, y: node.position.y };
                // Calculate position to place node in top-left area
                // Move the center point right and down to show node in top-left
                const targetX = nodePosition.x + window.innerWidth * 0.25;
                const targetY = nodePosition.y + window.innerHeight * 0.25;
                reactflow.setCenter(targetX, targetY, { zoom: 1, duration: 800 });
            }
        }
    };
    // Add event listener
    document.addEventListener('workflow:scroll-to-node', handleScrollToNode);
    // Return cleanup function
    return () => {
        document.removeEventListener('workflow:scroll-to-node', handleScrollToNode);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1uYXZpZ2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9kZS1uYXZpZ2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7O0FBZUgsZ0RBU0M7QUFNRCxvREFNQztBQU9ELGdFQWlDQztBQVFELDhEQXFDQztBQS9HRDs7OztHQUlHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsTUFBYyxFQUFFLEtBQUssR0FBRyxLQUFLO0lBQzlELHdEQUF3RDtJQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRTtRQUNwRCxNQUFNLEVBQUU7WUFDTixNQUFNO1lBQ04sS0FBSztTQUNOO0tBQ0YsQ0FBQyxDQUFBO0lBQ0YsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMvQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsTUFBYztJQUNqRCwyREFBMkQ7SUFDM0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMseUJBQXlCLEVBQUU7UUFDdkQsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFO0tBQ25CLENBQUMsQ0FBQTtJQUNGLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0IsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQiwwQkFBMEIsQ0FDeEMsZ0JBQTBDO0lBRTFDLG1DQUFtQztJQUNuQyxNQUFNLG1CQUFtQixHQUFHLENBQUMsS0FBdUMsRUFBRSxFQUFFO1FBQ3RFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQTtRQUN0QyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsa0JBQWtCO1lBQ2xCLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRXhCLDRDQUE0QztZQUM1QyxJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUNWLDZEQUE2RDtnQkFDN0QsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDZCxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDOUIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ1QsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDLENBQUE7SUFFRCxxQkFBcUI7SUFDckIsUUFBUSxDQUFDLGdCQUFnQixDQUN2QixzQkFBc0IsRUFDdEIsbUJBQW9DLENBQ3JDLENBQUE7SUFFRCwwQkFBMEI7SUFDMUIsT0FBTyxHQUFHLEVBQUU7UUFDVixRQUFRLENBQUMsbUJBQW1CLENBQzFCLHNCQUFzQixFQUN0QixtQkFBb0MsQ0FDckMsQ0FBQTtJQUNILENBQUMsQ0FBQTtBQUNILENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLHlCQUF5QixDQUN2QyxLQUFZLEVBQ1osU0FBYztJQUVkLHNDQUFzQztJQUN0QyxNQUFNLGtCQUFrQixHQUFHLENBQUMsS0FBdUMsRUFBRSxFQUFFO1FBQ3JFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFBO1FBQy9CLElBQUksTUFBTSxFQUFFLENBQUM7WUFDWCx1QkFBdUI7WUFDdkIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUE7WUFDN0MsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDVCxvREFBb0Q7Z0JBQ3BELE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFBO2dCQUUvRCxvREFBb0Q7Z0JBQ3BELGdFQUFnRTtnQkFDaEUsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtnQkFDekQsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtnQkFFMUQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQTtZQUNuRSxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUMsQ0FBQTtJQUVELHFCQUFxQjtJQUNyQixRQUFRLENBQUMsZ0JBQWdCLENBQ3ZCLHlCQUF5QixFQUN6QixrQkFBbUMsQ0FDcEMsQ0FBQTtJQUVELDBCQUEwQjtJQUMxQixPQUFPLEdBQUcsRUFBRTtRQUNWLFFBQVEsQ0FBQyxtQkFBbUIsQ0FDMUIseUJBQXlCLEVBQ3pCLGtCQUFtQyxDQUNwQyxDQUFBO0lBQ0gsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTm9kZSBuYXZpZ2F0aW9uIHV0aWxpdGllcyBmb3Igd29ya2Zsb3dcbiAqIFRoaXMgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyBmb3Igbm9kZSBzZWxlY3Rpb24sIGZvY3VzaW5nIGFuZCBzY3JvbGxpbmcgaW4gd29ya2Zsb3dcbiAqL1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igbm9kZSBzZWxlY3Rpb24gZXZlbnQgZGV0YWlsXG4gKi9cbmV4cG9ydCB0eXBlIE5vZGVTZWxlY3Rpb25EZXRhaWwgPSB7XG4gIG5vZGVJZDogc3RyaW5nXG4gIGZvY3VzPzogYm9vbGVhblxufVxuXG4vKipcbiAqIFNlbGVjdCBhIG5vZGUgaW4gdGhlIHdvcmtmbG93XG4gKiBAcGFyYW0gbm9kZUlkIC0gVGhlIElEIG9mIHRoZSBub2RlIHRvIHNlbGVjdFxuICogQHBhcmFtIGZvY3VzIC0gV2hldGhlciB0byBmb2N1cy9zY3JvbGwgdG8gdGhlIG5vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFdvcmtmbG93Tm9kZShub2RlSWQ6IHN0cmluZywgZm9jdXMgPSBmYWxzZSk6IHZvaWQge1xuICAvLyBDcmVhdGUgYW5kIGRpc3BhdGNoIGEgY3VzdG9tIGV2ZW50IGZvciBub2RlIHNlbGVjdGlvblxuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnd29ya2Zsb3c6c2VsZWN0LW5vZGUnLCB7XG4gICAgZGV0YWlsOiB7XG4gICAgICBub2RlSWQsXG4gICAgICBmb2N1cyxcbiAgICB9LFxuICB9KVxuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxufVxuXG4vKipcbiAqIFNjcm9sbCB0byBhIHNwZWNpZmljIG5vZGUgaW4gdGhlIHdvcmtmbG93XG4gKiBAcGFyYW0gbm9kZUlkIC0gVGhlIElEIG9mIHRoZSBub2RlIHRvIHNjcm9sbCB0b1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsVG9Xb3JrZmxvd05vZGUobm9kZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgLy8gQ3JlYXRlIGFuZCBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBmb3Igc2Nyb2xsaW5nIHRvIG5vZGVcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3dvcmtmbG93OnNjcm9sbC10by1ub2RlJywge1xuICAgIGRldGFpbDogeyBub2RlSWQgfSxcbiAgfSlcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudClcbn1cblxuLyoqXG4gKiBTZXR1cCBub2RlIHNlbGVjdGlvbiBldmVudCBsaXN0ZW5lclxuICogQHBhcmFtIGhhbmRsZU5vZGVTZWxlY3QgLSBGdW5jdGlvbiB0byBoYW5kbGUgbm9kZSBzZWxlY3Rpb25cbiAqIEByZXR1cm5zIENsZWFudXAgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldHVwTm9kZVNlbGVjdGlvbkxpc3RlbmVyKFxuICBoYW5kbGVOb2RlU2VsZWN0OiAobm9kZUlkOiBzdHJpbmcpID0+IHZvaWQsXG4pOiAoKSA9PiB2b2lkIHtcbiAgLy8gRXZlbnQgaGFuZGxlciBmb3Igbm9kZSBzZWxlY3Rpb25cbiAgY29uc3QgaGFuZGxlTm9kZVNlbGVjdGlvbiA9IChldmVudDogQ3VzdG9tRXZlbnQ8Tm9kZVNlbGVjdGlvbkRldGFpbD4pID0+IHtcbiAgICBjb25zdCB7IG5vZGVJZCwgZm9jdXMgfSA9IGV2ZW50LmRldGFpbFxuICAgIGlmIChub2RlSWQpIHtcbiAgICAgIC8vIFNlbGVjdCB0aGUgbm9kZVxuICAgICAgaGFuZGxlTm9kZVNlbGVjdChub2RlSWQpXG5cbiAgICAgIC8vIElmIGZvY3VzIGlzIHJlcXVlc3RlZCwgc2Nyb2xsIHRvIHRoZSBub2RlXG4gICAgICBpZiAoZm9jdXMpIHtcbiAgICAgICAgLy8gVXNlIGEgc21hbGwgdGltZW91dCB0byBlbnN1cmUgbm9kZSBzZWxlY3Rpb24gaGFwcGVucyBmaXJzdFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBzY3JvbGxUb1dvcmtmbG93Tm9kZShub2RlSWQpXG4gICAgICAgIH0sIDEwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAnd29ya2Zsb3c6c2VsZWN0LW5vZGUnLFxuICAgIGhhbmRsZU5vZGVTZWxlY3Rpb24gYXMgRXZlbnRMaXN0ZW5lcixcbiAgKVxuXG4gIC8vIFJldHVybiBjbGVhbnVwIGZ1bmN0aW9uXG4gIHJldHVybiAoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICd3b3JrZmxvdzpzZWxlY3Qtbm9kZScsXG4gICAgICBoYW5kbGVOb2RlU2VsZWN0aW9uIGFzIEV2ZW50TGlzdGVuZXIsXG4gICAgKVxuICB9XG59XG5cbi8qKlxuICogU2V0dXAgc2Nyb2xsIHRvIG5vZGUgZXZlbnQgbGlzdGVuZXIgd2l0aCBSZWFjdEZsb3dcbiAqIEBwYXJhbSBub2RlcyAtIFRoZSB3b3JrZmxvdyBub2Rlc1xuICogQHBhcmFtIHJlYWN0ZmxvdyAtIFRoZSBSZWFjdEZsb3cgaW5zdGFuY2VcbiAqIEByZXR1cm5zIENsZWFudXAgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldHVwU2Nyb2xsVG9Ob2RlTGlzdGVuZXIoXG4gIG5vZGVzOiBhbnlbXSxcbiAgcmVhY3RmbG93OiBhbnksXG4pOiAoKSA9PiB2b2lkIHtcbiAgLy8gRXZlbnQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHRvIG5vZGVcbiAgY29uc3QgaGFuZGxlU2Nyb2xsVG9Ob2RlID0gKGV2ZW50OiBDdXN0b21FdmVudDxOb2RlU2VsZWN0aW9uRGV0YWlsPikgPT4ge1xuICAgIGNvbnN0IHsgbm9kZUlkIH0gPSBldmVudC5kZXRhaWxcbiAgICBpZiAobm9kZUlkKSB7XG4gICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBub2RlSWQpXG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICAvLyBVc2UgUmVhY3RGbG93J3MgZml0VmlldyBBUEkgdG8gc2Nyb2xsIHRvIHRoZSBub2RlXG4gICAgICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IHsgeDogbm9kZS5wb3NpdGlvbi54LCB5OiBub2RlLnBvc2l0aW9uLnkgfVxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBwb3NpdGlvbiB0byBwbGFjZSBub2RlIGluIHRvcC1sZWZ0IGFyZWFcbiAgICAgICAgLy8gTW92ZSB0aGUgY2VudGVyIHBvaW50IHJpZ2h0IGFuZCBkb3duIHRvIHNob3cgbm9kZSBpbiB0b3AtbGVmdFxuICAgICAgICBjb25zdCB0YXJnZXRYID0gbm9kZVBvc2l0aW9uLnggKyB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuMjVcbiAgICAgICAgY29uc3QgdGFyZ2V0WSA9IG5vZGVQb3NpdGlvbi55ICsgd2luZG93LmlubmVySGVpZ2h0ICogMC4yNVxuXG4gICAgICAgIHJlYWN0Zmxvdy5zZXRDZW50ZXIodGFyZ2V0WCwgdGFyZ2V0WSwgeyB6b29tOiAxLCBkdXJhdGlvbjogODAwIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgJ3dvcmtmbG93OnNjcm9sbC10by1ub2RlJyxcbiAgICBoYW5kbGVTY3JvbGxUb05vZGUgYXMgRXZlbnRMaXN0ZW5lcixcbiAgKVxuXG4gIC8vIFJldHVybiBjbGVhbnVwIGZ1bmN0aW9uXG4gIHJldHVybiAoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICd3b3JrZmxvdzpzY3JvbGwtdG8tbm9kZScsXG4gICAgICBoYW5kbGVTY3JvbGxUb05vZGUgYXMgRXZlbnRMaXN0ZW5lcixcbiAgICApXG4gIH1cbn1cbiJdfQ==