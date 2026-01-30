"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const immer_1 = require("immer");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const reactflow_1 = require("reactflow");
const hooks_1 = require("./hooks");
const use_selection_interactions_1 = require("./hooks/use-selection-interactions");
const use_workflow_history_1 = require("./hooks/use-workflow-history");
const store_1 = require("./store");
var AlignType;
(function (AlignType) {
    AlignType["Left"] = "left";
    AlignType["Center"] = "center";
    AlignType["Right"] = "right";
    AlignType["Top"] = "top";
    AlignType["Middle"] = "middle";
    AlignType["Bottom"] = "bottom";
    AlignType["DistributeHorizontal"] = "distributeHorizontal";
    AlignType["DistributeVertical"] = "distributeVertical";
})(AlignType || (AlignType = {}));
const SelectionContextmenu = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const ref = (0, react_2.useRef)(null);
    const { getNodesReadOnly } = (0, hooks_1.useNodesReadOnly)();
    const { handleSelectionContextmenuCancel } = (0, use_selection_interactions_1.useSelectionInteractions)();
    const selectionMenu = (0, store_1.useStore)(s => s.selectionMenu);
    // Access React Flow methods
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    // Get selected nodes for alignment logic
    const selectedNodes = (0, reactflow_1.useStore)(state => state.getNodes().filter(node => node.selected));
    const { handleSyncWorkflowDraft } = (0, hooks_1.useNodesSyncDraft)();
    const { saveStateToHistory } = (0, use_workflow_history_1.useWorkflowHistory)();
    const menuRef = (0, react_2.useRef)(null);
    const menuPosition = (0, react_2.useMemo)(() => {
        if (!selectionMenu)
            return { left: 0, top: 0 };
        let left = selectionMenu.left;
        let top = selectionMenu.top;
        const container = document.querySelector('#workflow-container');
        if (container) {
            const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
            const menuWidth = 240;
            const estimatedMenuHeight = 380;
            if (left + menuWidth > containerWidth)
                left = left - menuWidth;
            if (top + estimatedMenuHeight > containerHeight)
                top = top - estimatedMenuHeight;
            left = Math.max(0, left);
            top = Math.max(0, top);
        }
        return { left, top };
    }, [selectionMenu]);
    (0, ahooks_1.useClickAway)(() => {
        handleSelectionContextmenuCancel();
    }, ref);
    (0, react_2.useEffect)(() => {
        if (selectionMenu && selectedNodes.length <= 1)
            handleSelectionContextmenuCancel();
    }, [selectionMenu, selectedNodes.length, handleSelectionContextmenuCancel]);
    // Handle align nodes logic
    const handleAlignNode = (0, react_2.useCallback)((currentNode, nodeToAlign, alignType, minX, maxX, minY, maxY) => {
        const width = nodeToAlign.width;
        const height = nodeToAlign.height;
        // Calculate new positions based on alignment type
        switch (alignType) {
            case AlignType.Left:
                // For left alignment, align left edge of each node to minX
                currentNode.position.x = minX;
                if (currentNode.positionAbsolute)
                    currentNode.positionAbsolute.x = minX;
                break;
            case AlignType.Center: {
                // For center alignment, center each node horizontally in the selection bounds
                const centerX = minX + (maxX - minX) / 2 - width / 2;
                currentNode.position.x = centerX;
                if (currentNode.positionAbsolute)
                    currentNode.positionAbsolute.x = centerX;
                break;
            }
            case AlignType.Right: {
                // For right alignment, align right edge of each node to maxX
                const rightX = maxX - width;
                currentNode.position.x = rightX;
                if (currentNode.positionAbsolute)
                    currentNode.positionAbsolute.x = rightX;
                break;
            }
            case AlignType.Top: {
                // For top alignment, align top edge of each node to minY
                currentNode.position.y = minY;
                if (currentNode.positionAbsolute)
                    currentNode.positionAbsolute.y = minY;
                break;
            }
            case AlignType.Middle: {
                // For middle alignment, center each node vertically in the selection bounds
                const middleY = minY + (maxY - minY) / 2 - height / 2;
                currentNode.position.y = middleY;
                if (currentNode.positionAbsolute)
                    currentNode.positionAbsolute.y = middleY;
                break;
            }
            case AlignType.Bottom: {
                // For bottom alignment, align bottom edge of each node to maxY
                const newY = Math.round(maxY - height);
                currentNode.position.y = newY;
                if (currentNode.positionAbsolute)
                    currentNode.positionAbsolute.y = newY;
                break;
            }
        }
    }, []);
    // Handle distribute nodes logic
    const handleDistributeNodes = (0, react_2.useCallback)((nodesToAlign, nodes, alignType) => {
        // Sort nodes appropriately
        const sortedNodes = [...nodesToAlign].sort((a, b) => {
            if (alignType === AlignType.DistributeHorizontal) {
                // Sort by left position for horizontal distribution
                return a.position.x - b.position.x;
            }
            else {
                // Sort by top position for vertical distribution
                return a.position.y - b.position.y;
            }
        });
        if (sortedNodes.length < 3)
            return null; // Need at least 3 nodes for distribution
        let totalGap = 0;
        let fixedSpace = 0;
        if (alignType === AlignType.DistributeHorizontal) {
            // Fixed positions - first node's left edge and last node's right edge
            const firstNodeLeft = sortedNodes[0].position.x;
            const lastNodeRight = sortedNodes[sortedNodes.length - 1].position.x + (sortedNodes[sortedNodes.length - 1].width || 0);
            // Total available space
            totalGap = lastNodeRight - firstNodeLeft;
            // Space occupied by nodes themselves
            fixedSpace = sortedNodes.reduce((sum, node) => sum + (node.width || 0), 0);
        }
        else {
            // Fixed positions - first node's top edge and last node's bottom edge
            const firstNodeTop = sortedNodes[0].position.y;
            const lastNodeBottom = sortedNodes[sortedNodes.length - 1].position.y + (sortedNodes[sortedNodes.length - 1].height || 0);
            // Total available space
            totalGap = lastNodeBottom - firstNodeTop;
            // Space occupied by nodes themselves
            fixedSpace = sortedNodes.reduce((sum, node) => sum + (node.height || 0), 0);
        }
        // Available space for gaps
        const availableSpace = totalGap - fixedSpace;
        // Calculate even spacing between node edges
        const spacing = availableSpace / (sortedNodes.length - 1);
        if (spacing <= 0)
            return null; // Nodes are overlapping, can't distribute evenly
        return (0, immer_1.produce)(nodes, (draft) => {
            // Keep first node fixed, position others with even gaps
            let currentPosition;
            if (alignType === AlignType.DistributeHorizontal) {
                // Start from first node's right edge
                currentPosition = sortedNodes[0].position.x + (sortedNodes[0].width || 0);
            }
            else {
                // Start from first node's bottom edge
                currentPosition = sortedNodes[0].position.y + (sortedNodes[0].height || 0);
            }
            // Skip first node (index 0), it stays in place
            for (let i = 1; i < sortedNodes.length - 1; i++) {
                const nodeToAlign = sortedNodes[i];
                const currentNode = draft.find(n => n.id === nodeToAlign.id);
                if (!currentNode)
                    continue;
                if (alignType === AlignType.DistributeHorizontal) {
                    // Position = previous right edge + spacing
                    const newX = currentPosition + spacing;
                    currentNode.position.x = newX;
                    if (currentNode.positionAbsolute)
                        currentNode.positionAbsolute.x = newX;
                    // Update for next iteration - current node's right edge
                    currentPosition = newX + (nodeToAlign.width || 0);
                }
                else {
                    // Position = previous bottom edge + spacing
                    const newY = currentPosition + spacing;
                    currentNode.position.y = newY;
                    if (currentNode.positionAbsolute)
                        currentNode.positionAbsolute.y = newY;
                    // Update for next iteration - current node's bottom edge
                    currentPosition = newY + (nodeToAlign.height || 0);
                }
            }
        });
    }, []);
    const handleAlignNodes = (0, react_2.useCallback)((alignType) => {
        if (getNodesReadOnly() || selectedNodes.length <= 1) {
            handleSelectionContextmenuCancel();
            return;
        }
        // Disable node animation state - same as handleNodeDragStart
        workflowStore.setState({ nodeAnimation: false });
        // Get all current nodes
        const nodes = store.getState().getNodes();
        // Get all selected nodes
        const selectedNodeIds = selectedNodes.map(node => node.id);
        // Find container nodes and their children
        // Container nodes (like Iteration and Loop) have child nodes that should not be aligned independently
        // when the container is selected. This prevents child nodes from being moved outside their containers.
        const childNodeIds = new Set();
        nodes.forEach((node) => {
            // Check if this is a container node (Iteration or Loop)
            if (node.data._children && node.data._children.length > 0) {
                // If container node is selected, add its children to the exclusion set
                if (selectedNodeIds.includes(node.id)) {
                    // Add all its children to the childNodeIds set
                    node.data._children.forEach((child) => {
                        childNodeIds.add(child.nodeId);
                    });
                }
            }
        });
        // Filter out child nodes from the alignment operation
        // Only align nodes that are selected AND are not children of container nodes
        // This ensures container nodes can be aligned while their children stay in the same relative position
        const nodesToAlign = nodes.filter(node => selectedNodeIds.includes(node.id) && !childNodeIds.has(node.id));
        if (nodesToAlign.length <= 1) {
            handleSelectionContextmenuCancel();
            return;
        }
        // Calculate node boundaries for alignment
        let minX = Number.MAX_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER;
        let minY = Number.MAX_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;
        // Calculate boundaries of selected nodes
        const validNodes = nodesToAlign.filter(node => node.width && node.height);
        validNodes.forEach((node) => {
            const width = node.width;
            const height = node.height;
            minX = Math.min(minX, node.position.x);
            maxX = Math.max(maxX, node.position.x + width);
            minY = Math.min(minY, node.position.y);
            maxY = Math.max(maxY, node.position.y + height);
        });
        // Handle distribute nodes logic
        if (alignType === AlignType.DistributeHorizontal || alignType === AlignType.DistributeVertical) {
            const distributeNodes = handleDistributeNodes(nodesToAlign, nodes, alignType);
            if (distributeNodes) {
                // Apply node distribution updates
                store.getState().setNodes(distributeNodes);
                handleSelectionContextmenuCancel();
                // Clear guide lines
                const { setHelpLineHorizontal, setHelpLineVertical } = workflowStore.getState();
                setHelpLineHorizontal();
                setHelpLineVertical();
                // Sync workflow draft
                handleSyncWorkflowDraft();
                // Save to history
                saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodeDragStop);
                return; // End function execution
            }
        }
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            // Iterate through all selected nodes
            const validNodesToAlign = nodesToAlign.filter(node => node.width && node.height);
            validNodesToAlign.forEach((nodeToAlign) => {
                // Find the corresponding node in draft - consistent with handleNodeDrag
                const currentNode = draft.find(n => n.id === nodeToAlign.id);
                if (!currentNode)
                    return;
                // Use the extracted alignment function
                handleAlignNode(currentNode, nodeToAlign, alignType, minX, maxX, minY, maxY);
            });
        });
        // Apply node position updates - consistent with handleNodeDrag and handleNodeDragStop
        try {
            // Directly use setNodes to update nodes - consistent with handleNodeDrag
            store.getState().setNodes(newNodes);
            // Close popup
            handleSelectionContextmenuCancel();
            // Clear guide lines - consistent with handleNodeDragStop
            const { setHelpLineHorizontal, setHelpLineVertical } = workflowStore.getState();
            setHelpLineHorizontal();
            setHelpLineVertical();
            // Sync workflow draft - consistent with handleNodeDragStop
            handleSyncWorkflowDraft();
            // Save to history - consistent with handleNodeDragStop
            saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodeDragStop);
        }
        catch (err) {
            console.error('Failed to update nodes:', err);
        }
    }, [store, workflowStore, selectedNodes, getNodesReadOnly, handleSyncWorkflowDraft, saveStateToHistory, handleSelectionContextmenuCancel, handleAlignNode, handleDistributeNodes]);
    if (!selectionMenu)
        return null;
    return (<div className="absolute z-[9]" style={{
            left: menuPosition.left,
            top: menuPosition.top,
        }} ref={ref}>
      <div ref={menuRef} className="w-[240px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-xl">
        <div className="p-1">
          <div className="system-xs-medium px-2 py-2 text-text-tertiary">
            {t('operator.vertical', { ns: 'workflow' })}
          </div>
          <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover" onClick={() => handleAlignNodes(AlignType.Top)}>
            <react_1.RiAlignTop className="h-4 w-4"/>
            {t('operator.alignTop', { ns: 'workflow' })}
          </div>
          <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover" onClick={() => handleAlignNodes(AlignType.Middle)}>
            <react_1.RiAlignCenter className="h-4 w-4 rotate-90"/>
            {t('operator.alignMiddle', { ns: 'workflow' })}
          </div>
          <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover" onClick={() => handleAlignNodes(AlignType.Bottom)}>
            <react_1.RiAlignBottom className="h-4 w-4"/>
            {t('operator.alignBottom', { ns: 'workflow' })}
          </div>
          <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover" onClick={() => handleAlignNodes(AlignType.DistributeVertical)}>
            <react_1.RiAlignJustify className="h-4 w-4 rotate-90"/>
            {t('operator.distributeVertical', { ns: 'workflow' })}
          </div>
        </div>
        <div className="h-px bg-divider-regular"></div>
        <div className="p-1">
          <div className="system-xs-medium px-2 py-2 text-text-tertiary">
            {t('operator.horizontal', { ns: 'workflow' })}
          </div>
          <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover" onClick={() => handleAlignNodes(AlignType.Left)}>
            <react_1.RiAlignLeft className="h-4 w-4"/>
            {t('operator.alignLeft', { ns: 'workflow' })}
          </div>
          <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover" onClick={() => handleAlignNodes(AlignType.Center)}>
            <react_1.RiAlignCenter className="h-4 w-4"/>
            {t('operator.alignCenter', { ns: 'workflow' })}
          </div>
          <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover" onClick={() => handleAlignNodes(AlignType.Right)}>
            <react_1.RiAlignRight className="h-4 w-4"/>
            {t('operator.alignRight', { ns: 'workflow' })}
          </div>
          <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover" onClick={() => handleAlignNodes(AlignType.DistributeHorizontal)}>
            <react_1.RiAlignJustify className="h-4 w-4"/>
            {t('operator.distributeHorizontal', { ns: 'workflow' })}
          </div>
        </div>
      </div>
    </div>);
};
exports.default = (0, react_2.memo)(SelectionContextmenu);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWNvbnRleHRtZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VsZWN0aW9uLWNvbnRleHRtZW51LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQU95QjtBQUN6QixtQ0FBcUM7QUFDckMsaUNBQStCO0FBQy9CLGlDQU1jO0FBQ2QsaURBQThDO0FBQzlDLHlDQUFzRTtBQUN0RSxtQ0FBNkQ7QUFDN0QsbUZBQTZFO0FBQzdFLHVFQUF1RjtBQUN2RixtQ0FBb0Q7QUFFcEQsSUFBSyxTQVNKO0FBVEQsV0FBSyxTQUFTO0lBQ1osMEJBQWEsQ0FBQTtJQUNiLDhCQUFpQixDQUFBO0lBQ2pCLDRCQUFlLENBQUE7SUFDZix3QkFBVyxDQUFBO0lBQ1gsOEJBQWlCLENBQUE7SUFDakIsOEJBQWlCLENBQUE7SUFDakIsMERBQTZDLENBQUE7SUFDN0Msc0RBQXlDLENBQUE7QUFDM0MsQ0FBQyxFQVRJLFNBQVMsS0FBVCxTQUFTLFFBU2I7QUFFRCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUNoQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBQSxjQUFNLEVBQUMsSUFBSSxDQUFDLENBQUE7SUFDeEIsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQy9DLE1BQU0sRUFBRSxnQ0FBZ0MsRUFBRSxHQUFHLElBQUEscURBQXdCLEdBQUUsQ0FBQTtJQUN2RSxNQUFNLGFBQWEsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFcEQsNEJBQTRCO0lBQzVCLE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBQzNCLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUV4Qyx5Q0FBeUM7SUFD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LFVBQVUsRUFBRSxDQUFDLENBQ3pEO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsSUFBQSxZQUFJLEVBQUMsb0JBQW9CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIFJpQWxpZ25Cb3R0b20sXG4gIFJpQWxpZ25DZW50ZXIsXG4gIFJpQWxpZ25KdXN0aWZ5LFxuICBSaUFsaWduTGVmdCxcbiAgUmlBbGlnblJpZ2h0LFxuICBSaUFsaWduVG9wLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2xpY2tBd2F5IH0gZnJvbSAnYWhvb2tzJ1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHtcbiAgbWVtbyxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZVN0b3JlIGFzIHVzZVJlYWN0Rmxvd1N0b3JlLCB1c2VTdG9yZUFwaSB9IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IHVzZU5vZGVzUmVhZE9ubHksIHVzZU5vZGVzU3luY0RyYWZ0IH0gZnJvbSAnLi9ob29rcydcbmltcG9ydCB7IHVzZVNlbGVjdGlvbkludGVyYWN0aW9ucyB9IGZyb20gJy4vaG9va3MvdXNlLXNlbGVjdGlvbi1pbnRlcmFjdGlvbnMnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd0hpc3RvcnksIFdvcmtmbG93SGlzdG9yeUV2ZW50IH0gZnJvbSAnLi9ob29rcy91c2Utd29ya2Zsb3ctaGlzdG9yeSdcbmltcG9ydCB7IHVzZVN0b3JlLCB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnLi9zdG9yZSdcblxuZW51bSBBbGlnblR5cGUge1xuICBMZWZ0ID0gJ2xlZnQnLFxuICBDZW50ZXIgPSAnY2VudGVyJyxcbiAgUmlnaHQgPSAncmlnaHQnLFxuICBUb3AgPSAndG9wJyxcbiAgTWlkZGxlID0gJ21pZGRsZScsXG4gIEJvdHRvbSA9ICdib3R0b20nLFxuICBEaXN0cmlidXRlSG9yaXpvbnRhbCA9ICdkaXN0cmlidXRlSG9yaXpvbnRhbCcsXG4gIERpc3RyaWJ1dGVWZXJ0aWNhbCA9ICdkaXN0cmlidXRlVmVydGljYWwnLFxufVxuXG5jb25zdCBTZWxlY3Rpb25Db250ZXh0bWVudSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCB7IGdldE5vZGVzUmVhZE9ubHkgfSA9IHVzZU5vZGVzUmVhZE9ubHkoKVxuICBjb25zdCB7IGhhbmRsZVNlbGVjdGlvbkNvbnRleHRtZW51Q2FuY2VsIH0gPSB1c2VTZWxlY3Rpb25JbnRlcmFjdGlvbnMoKVxuICBjb25zdCBzZWxlY3Rpb25NZW51ID0gdXNlU3RvcmUocyA9PiBzLnNlbGVjdGlvbk1lbnUpXG5cbiAgLy8gQWNjZXNzIFJlYWN0IEZsb3cgbWV0aG9kc1xuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuXG4gIC8vIEdldCBzZWxlY3RlZCBub2RlcyBmb3IgYWxpZ25tZW50IGxvZ2ljXG4gIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB1c2VSZWFjdEZsb3dTdG9yZShzdGF0ZSA9PlxuICAgIHN0YXRlLmdldE5vZGVzKCkuZmlsdGVyKG5vZGUgPT4gbm9kZS5zZWxlY3RlZCksXG4gIClcblxuICBjb25zdCB7IGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0IH0gPSB1c2VOb2Rlc1N5bmNEcmFmdCgpXG4gIGNvbnN0IHsgc2F2ZVN0YXRlVG9IaXN0b3J5IH0gPSB1c2VXb3JrZmxvd0hpc3RvcnkoKVxuXG4gIGNvbnN0IG1lbnVSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG5cbiAgY29uc3QgbWVudVBvc2l0aW9uID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFzZWxlY3Rpb25NZW51KVxuICAgICAgcmV0dXJuIHsgbGVmdDogMCwgdG9wOiAwIH1cblxuICAgIGxldCBsZWZ0ID0gc2VsZWN0aW9uTWVudS5sZWZ0XG4gICAgbGV0IHRvcCA9IHNlbGVjdGlvbk1lbnUudG9wXG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2Zsb3ctY29udGFpbmVyJylcbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb25zdCB7IHdpZHRoOiBjb250YWluZXJXaWR0aCwgaGVpZ2h0OiBjb250YWluZXJIZWlnaHQgfSA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICBjb25zdCBtZW51V2lkdGggPSAyNDBcblxuICAgICAgY29uc3QgZXN0aW1hdGVkTWVudUhlaWdodCA9IDM4MFxuXG4gICAgICBpZiAobGVmdCArIG1lbnVXaWR0aCA+IGNvbnRhaW5lcldpZHRoKVxuICAgICAgICBsZWZ0ID0gbGVmdCAtIG1lbnVXaWR0aFxuXG4gICAgICBpZiAodG9wICsgZXN0aW1hdGVkTWVudUhlaWdodCA+IGNvbnRhaW5lckhlaWdodClcbiAgICAgICAgdG9wID0gdG9wIC0gZXN0aW1hdGVkTWVudUhlaWdodFxuXG4gICAgICBsZWZ0ID0gTWF0aC5tYXgoMCwgbGVmdClcbiAgICAgIHRvcCA9IE1hdGgubWF4KDAsIHRvcClcbiAgICB9XG5cbiAgICByZXR1cm4geyBsZWZ0LCB0b3AgfVxuICB9LCBbc2VsZWN0aW9uTWVudV0pXG5cbiAgdXNlQ2xpY2tBd2F5KCgpID0+IHtcbiAgICBoYW5kbGVTZWxlY3Rpb25Db250ZXh0bWVudUNhbmNlbCgpXG4gIH0sIHJlZilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzZWxlY3Rpb25NZW51ICYmIHNlbGVjdGVkTm9kZXMubGVuZ3RoIDw9IDEpXG4gICAgICBoYW5kbGVTZWxlY3Rpb25Db250ZXh0bWVudUNhbmNlbCgpXG4gIH0sIFtzZWxlY3Rpb25NZW51LCBzZWxlY3RlZE5vZGVzLmxlbmd0aCwgaGFuZGxlU2VsZWN0aW9uQ29udGV4dG1lbnVDYW5jZWxdKVxuXG4gIC8vIEhhbmRsZSBhbGlnbiBub2RlcyBsb2dpY1xuICBjb25zdCBoYW5kbGVBbGlnbk5vZGUgPSB1c2VDYWxsYmFjaygoY3VycmVudE5vZGU6IGFueSwgbm9kZVRvQWxpZ246IGFueSwgYWxpZ25UeXBlOiBBbGlnblR5cGUsIG1pblg6IG51bWJlciwgbWF4WDogbnVtYmVyLCBtaW5ZOiBudW1iZXIsIG1heFk6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IHdpZHRoID0gbm9kZVRvQWxpZ24ud2lkdGhcbiAgICBjb25zdCBoZWlnaHQgPSBub2RlVG9BbGlnbi5oZWlnaHRcblxuICAgIC8vIENhbGN1bGF0ZSBuZXcgcG9zaXRpb25zIGJhc2VkIG9uIGFsaWdubWVudCB0eXBlXG4gICAgc3dpdGNoIChhbGlnblR5cGUpIHtcbiAgICAgIGNhc2UgQWxpZ25UeXBlLkxlZnQ6XG4gICAgICAgIC8vIEZvciBsZWZ0IGFsaWdubWVudCwgYWxpZ24gbGVmdCBlZGdlIG9mIGVhY2ggbm9kZSB0byBtaW5YXG4gICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uLnggPSBtaW5YXG4gICAgICAgIGlmIChjdXJyZW50Tm9kZS5wb3NpdGlvbkFic29sdXRlKVxuICAgICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uQWJzb2x1dGUueCA9IG1pblhcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSBBbGlnblR5cGUuQ2VudGVyOiB7XG4gICAgICAgIC8vIEZvciBjZW50ZXIgYWxpZ25tZW50LCBjZW50ZXIgZWFjaCBub2RlIGhvcml6b250YWxseSBpbiB0aGUgc2VsZWN0aW9uIGJvdW5kc1xuICAgICAgICBjb25zdCBjZW50ZXJYID0gbWluWCArIChtYXhYIC0gbWluWCkgLyAyIC0gd2lkdGggLyAyXG4gICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uLnggPSBjZW50ZXJYXG4gICAgICAgIGlmIChjdXJyZW50Tm9kZS5wb3NpdGlvbkFic29sdXRlKVxuICAgICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uQWJzb2x1dGUueCA9IGNlbnRlclhcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY2FzZSBBbGlnblR5cGUuUmlnaHQ6IHtcbiAgICAgICAgLy8gRm9yIHJpZ2h0IGFsaWdubWVudCwgYWxpZ24gcmlnaHQgZWRnZSBvZiBlYWNoIG5vZGUgdG8gbWF4WFxuICAgICAgICBjb25zdCByaWdodFggPSBtYXhYIC0gd2lkdGhcbiAgICAgICAgY3VycmVudE5vZGUucG9zaXRpb24ueCA9IHJpZ2h0WFxuICAgICAgICBpZiAoY3VycmVudE5vZGUucG9zaXRpb25BYnNvbHV0ZSlcbiAgICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbkFic29sdXRlLnggPSByaWdodFhcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY2FzZSBBbGlnblR5cGUuVG9wOiB7XG4gICAgICAgIC8vIEZvciB0b3AgYWxpZ25tZW50LCBhbGlnbiB0b3AgZWRnZSBvZiBlYWNoIG5vZGUgdG8gbWluWVxuICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbi55ID0gbWluWVxuICAgICAgICBpZiAoY3VycmVudE5vZGUucG9zaXRpb25BYnNvbHV0ZSlcbiAgICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbkFic29sdXRlLnkgPSBtaW5ZXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgQWxpZ25UeXBlLk1pZGRsZToge1xuICAgICAgICAvLyBGb3IgbWlkZGxlIGFsaWdubWVudCwgY2VudGVyIGVhY2ggbm9kZSB2ZXJ0aWNhbGx5IGluIHRoZSBzZWxlY3Rpb24gYm91bmRzXG4gICAgICAgIGNvbnN0IG1pZGRsZVkgPSBtaW5ZICsgKG1heFkgLSBtaW5ZKSAvIDIgLSBoZWlnaHQgLyAyXG4gICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uLnkgPSBtaWRkbGVZXG4gICAgICAgIGlmIChjdXJyZW50Tm9kZS5wb3NpdGlvbkFic29sdXRlKVxuICAgICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uQWJzb2x1dGUueSA9IG1pZGRsZVlcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY2FzZSBBbGlnblR5cGUuQm90dG9tOiB7XG4gICAgICAgIC8vIEZvciBib3R0b20gYWxpZ25tZW50LCBhbGlnbiBib3R0b20gZWRnZSBvZiBlYWNoIG5vZGUgdG8gbWF4WVxuICAgICAgICBjb25zdCBuZXdZID0gTWF0aC5yb3VuZChtYXhZIC0gaGVpZ2h0KVxuICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbi55ID0gbmV3WVxuICAgICAgICBpZiAoY3VycmVudE5vZGUucG9zaXRpb25BYnNvbHV0ZSlcbiAgICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbkFic29sdXRlLnkgPSBuZXdZXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9LCBbXSlcblxuICAvLyBIYW5kbGUgZGlzdHJpYnV0ZSBub2RlcyBsb2dpY1xuICBjb25zdCBoYW5kbGVEaXN0cmlidXRlTm9kZXMgPSB1c2VDYWxsYmFjaygobm9kZXNUb0FsaWduOiBhbnlbXSwgbm9kZXM6IGFueVtdLCBhbGlnblR5cGU6IEFsaWduVHlwZSkgPT4ge1xuICAgIC8vIFNvcnQgbm9kZXMgYXBwcm9wcmlhdGVseVxuICAgIGNvbnN0IHNvcnRlZE5vZGVzID0gWy4uLm5vZGVzVG9BbGlnbl0uc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGFsaWduVHlwZSA9PT0gQWxpZ25UeXBlLkRpc3RyaWJ1dGVIb3Jpem9udGFsKSB7XG4gICAgICAgIC8vIFNvcnQgYnkgbGVmdCBwb3NpdGlvbiBmb3IgaG9yaXpvbnRhbCBkaXN0cmlidXRpb25cbiAgICAgICAgcmV0dXJuIGEucG9zaXRpb24ueCAtIGIucG9zaXRpb24ueFxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIFNvcnQgYnkgdG9wIHBvc2l0aW9uIGZvciB2ZXJ0aWNhbCBkaXN0cmlidXRpb25cbiAgICAgICAgcmV0dXJuIGEucG9zaXRpb24ueSAtIGIucG9zaXRpb24ueVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoc29ydGVkTm9kZXMubGVuZ3RoIDwgMylcbiAgICAgIHJldHVybiBudWxsIC8vIE5lZWQgYXQgbGVhc3QgMyBub2RlcyBmb3IgZGlzdHJpYnV0aW9uXG5cbiAgICBsZXQgdG90YWxHYXAgPSAwXG4gICAgbGV0IGZpeGVkU3BhY2UgPSAwXG5cbiAgICBpZiAoYWxpZ25UeXBlID09PSBBbGlnblR5cGUuRGlzdHJpYnV0ZUhvcml6b250YWwpIHtcbiAgICAgIC8vIEZpeGVkIHBvc2l0aW9ucyAtIGZpcnN0IG5vZGUncyBsZWZ0IGVkZ2UgYW5kIGxhc3Qgbm9kZSdzIHJpZ2h0IGVkZ2VcbiAgICAgIGNvbnN0IGZpcnN0Tm9kZUxlZnQgPSBzb3J0ZWROb2Rlc1swXS5wb3NpdGlvbi54XG4gICAgICBjb25zdCBsYXN0Tm9kZVJpZ2h0ID0gc29ydGVkTm9kZXNbc29ydGVkTm9kZXMubGVuZ3RoIC0gMV0ucG9zaXRpb24ueCArIChzb3J0ZWROb2Rlc1tzb3J0ZWROb2Rlcy5sZW5ndGggLSAxXS53aWR0aCB8fCAwKVxuXG4gICAgICAvLyBUb3RhbCBhdmFpbGFibGUgc3BhY2VcbiAgICAgIHRvdGFsR2FwID0gbGFzdE5vZGVSaWdodCAtIGZpcnN0Tm9kZUxlZnRcblxuICAgICAgLy8gU3BhY2Ugb2NjdXBpZWQgYnkgbm9kZXMgdGhlbXNlbHZlc1xuICAgICAgZml4ZWRTcGFjZSA9IHNvcnRlZE5vZGVzLnJlZHVjZSgoc3VtLCBub2RlKSA9PiBzdW0gKyAobm9kZS53aWR0aCB8fCAwKSwgMClcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBGaXhlZCBwb3NpdGlvbnMgLSBmaXJzdCBub2RlJ3MgdG9wIGVkZ2UgYW5kIGxhc3Qgbm9kZSdzIGJvdHRvbSBlZGdlXG4gICAgICBjb25zdCBmaXJzdE5vZGVUb3AgPSBzb3J0ZWROb2Rlc1swXS5wb3NpdGlvbi55XG4gICAgICBjb25zdCBsYXN0Tm9kZUJvdHRvbSA9IHNvcnRlZE5vZGVzW3NvcnRlZE5vZGVzLmxlbmd0aCAtIDFdLnBvc2l0aW9uLnkgKyAoc29ydGVkTm9kZXNbc29ydGVkTm9kZXMubGVuZ3RoIC0gMV0uaGVpZ2h0IHx8IDApXG5cbiAgICAgIC8vIFRvdGFsIGF2YWlsYWJsZSBzcGFjZVxuICAgICAgdG90YWxHYXAgPSBsYXN0Tm9kZUJvdHRvbSAtIGZpcnN0Tm9kZVRvcFxuXG4gICAgICAvLyBTcGFjZSBvY2N1cGllZCBieSBub2RlcyB0aGVtc2VsdmVzXG4gICAgICBmaXhlZFNwYWNlID0gc29ydGVkTm9kZXMucmVkdWNlKChzdW0sIG5vZGUpID0+IHN1bSArIChub2RlLmhlaWdodCB8fCAwKSwgMClcbiAgICB9XG5cbiAgICAvLyBBdmFpbGFibGUgc3BhY2UgZm9yIGdhcHNcbiAgICBjb25zdCBhdmFpbGFibGVTcGFjZSA9IHRvdGFsR2FwIC0gZml4ZWRTcGFjZVxuXG4gICAgLy8gQ2FsY3VsYXRlIGV2ZW4gc3BhY2luZyBiZXR3ZWVuIG5vZGUgZWRnZXNcbiAgICBjb25zdCBzcGFjaW5nID0gYXZhaWxhYmxlU3BhY2UgLyAoc29ydGVkTm9kZXMubGVuZ3RoIC0gMSlcblxuICAgIGlmIChzcGFjaW5nIDw9IDApXG4gICAgICByZXR1cm4gbnVsbCAvLyBOb2RlcyBhcmUgb3ZlcmxhcHBpbmcsIGNhbid0IGRpc3RyaWJ1dGUgZXZlbmx5XG5cbiAgICByZXR1cm4gcHJvZHVjZShub2RlcywgKGRyYWZ0KSA9PiB7XG4gICAgICAvLyBLZWVwIGZpcnN0IG5vZGUgZml4ZWQsIHBvc2l0aW9uIG90aGVycyB3aXRoIGV2ZW4gZ2Fwc1xuICAgICAgbGV0IGN1cnJlbnRQb3NpdGlvblxuXG4gICAgICBpZiAoYWxpZ25UeXBlID09PSBBbGlnblR5cGUuRGlzdHJpYnV0ZUhvcml6b250YWwpIHtcbiAgICAgICAgLy8gU3RhcnQgZnJvbSBmaXJzdCBub2RlJ3MgcmlnaHQgZWRnZVxuICAgICAgICBjdXJyZW50UG9zaXRpb24gPSBzb3J0ZWROb2Rlc1swXS5wb3NpdGlvbi54ICsgKHNvcnRlZE5vZGVzWzBdLndpZHRoIHx8IDApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gU3RhcnQgZnJvbSBmaXJzdCBub2RlJ3MgYm90dG9tIGVkZ2VcbiAgICAgICAgY3VycmVudFBvc2l0aW9uID0gc29ydGVkTm9kZXNbMF0ucG9zaXRpb24ueSArIChzb3J0ZWROb2Rlc1swXS5oZWlnaHQgfHwgMClcbiAgICAgIH1cblxuICAgICAgLy8gU2tpcCBmaXJzdCBub2RlIChpbmRleCAwKSwgaXQgc3RheXMgaW4gcGxhY2VcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc29ydGVkTm9kZXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGVUb0FsaWduID0gc29ydGVkTm9kZXNbaV1cbiAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBkcmFmdC5maW5kKG4gPT4gbi5pZCA9PT0gbm9kZVRvQWxpZ24uaWQpXG4gICAgICAgIGlmICghY3VycmVudE5vZGUpXG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBpZiAoYWxpZ25UeXBlID09PSBBbGlnblR5cGUuRGlzdHJpYnV0ZUhvcml6b250YWwpIHtcbiAgICAgICAgICAvLyBQb3NpdGlvbiA9IHByZXZpb3VzIHJpZ2h0IGVkZ2UgKyBzcGFjaW5nXG4gICAgICAgICAgY29uc3QgbmV3WDogbnVtYmVyID0gY3VycmVudFBvc2l0aW9uICsgc3BhY2luZ1xuICAgICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uLnggPSBuZXdYXG4gICAgICAgICAgaWYgKGN1cnJlbnROb2RlLnBvc2l0aW9uQWJzb2x1dGUpXG4gICAgICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbkFic29sdXRlLnggPSBuZXdYXG5cbiAgICAgICAgICAvLyBVcGRhdGUgZm9yIG5leHQgaXRlcmF0aW9uIC0gY3VycmVudCBub2RlJ3MgcmlnaHQgZWRnZVxuICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IG5ld1ggKyAobm9kZVRvQWxpZ24ud2lkdGggfHwgMClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBQb3NpdGlvbiA9IHByZXZpb3VzIGJvdHRvbSBlZGdlICsgc3BhY2luZ1xuICAgICAgICAgIGNvbnN0IG5ld1k6IG51bWJlciA9IGN1cnJlbnRQb3NpdGlvbiArIHNwYWNpbmdcbiAgICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbi55ID0gbmV3WVxuICAgICAgICAgIGlmIChjdXJyZW50Tm9kZS5wb3NpdGlvbkFic29sdXRlKVxuICAgICAgICAgICAgY3VycmVudE5vZGUucG9zaXRpb25BYnNvbHV0ZS55ID0gbmV3WVxuXG4gICAgICAgICAgLy8gVXBkYXRlIGZvciBuZXh0IGl0ZXJhdGlvbiAtIGN1cnJlbnQgbm9kZSdzIGJvdHRvbSBlZGdlXG4gICAgICAgICAgY3VycmVudFBvc2l0aW9uID0gbmV3WSArIChub2RlVG9BbGlnbi5oZWlnaHQgfHwgMClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUFsaWduTm9kZXMgPSB1c2VDYWxsYmFjaygoYWxpZ25UeXBlOiBBbGlnblR5cGUpID0+IHtcbiAgICBpZiAoZ2V0Tm9kZXNSZWFkT25seSgpIHx8IHNlbGVjdGVkTm9kZXMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIGhhbmRsZVNlbGVjdGlvbkNvbnRleHRtZW51Q2FuY2VsKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIERpc2FibGUgbm9kZSBhbmltYXRpb24gc3RhdGUgLSBzYW1lIGFzIGhhbmRsZU5vZGVEcmFnU3RhcnRcbiAgICB3b3JrZmxvd1N0b3JlLnNldFN0YXRlKHsgbm9kZUFuaW1hdGlvbjogZmFsc2UgfSlcblxuICAgIC8vIEdldCBhbGwgY3VycmVudCBub2Rlc1xuICAgIGNvbnN0IG5vZGVzID0gc3RvcmUuZ2V0U3RhdGUoKS5nZXROb2RlcygpXG5cbiAgICAvLyBHZXQgYWxsIHNlbGVjdGVkIG5vZGVzXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlSWRzID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmlkKVxuXG4gICAgLy8gRmluZCBjb250YWluZXIgbm9kZXMgYW5kIHRoZWlyIGNoaWxkcmVuXG4gICAgLy8gQ29udGFpbmVyIG5vZGVzIChsaWtlIEl0ZXJhdGlvbiBhbmQgTG9vcCkgaGF2ZSBjaGlsZCBub2RlcyB0aGF0IHNob3VsZCBub3QgYmUgYWxpZ25lZCBpbmRlcGVuZGVudGx5XG4gICAgLy8gd2hlbiB0aGUgY29udGFpbmVyIGlzIHNlbGVjdGVkLiBUaGlzIHByZXZlbnRzIGNoaWxkIG5vZGVzIGZyb20gYmVpbmcgbW92ZWQgb3V0c2lkZSB0aGVpciBjb250YWluZXJzLlxuICAgIGNvbnN0IGNoaWxkTm9kZUlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpXG5cbiAgICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAvLyBDaGVjayBpZiB0aGlzIGlzIGEgY29udGFpbmVyIG5vZGUgKEl0ZXJhdGlvbiBvciBMb29wKVxuICAgICAgaWYgKG5vZGUuZGF0YS5fY2hpbGRyZW4gJiYgbm9kZS5kYXRhLl9jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIElmIGNvbnRhaW5lciBub2RlIGlzIHNlbGVjdGVkLCBhZGQgaXRzIGNoaWxkcmVuIHRvIHRoZSBleGNsdXNpb24gc2V0XG4gICAgICAgIGlmIChzZWxlY3RlZE5vZGVJZHMuaW5jbHVkZXMobm9kZS5pZCkpIHtcbiAgICAgICAgICAvLyBBZGQgYWxsIGl0cyBjaGlsZHJlbiB0byB0aGUgY2hpbGROb2RlSWRzIHNldFxuICAgICAgICAgIG5vZGUuZGF0YS5fY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IHsgbm9kZUlkOiBzdHJpbmcsIG5vZGVUeXBlOiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICAgICAgY2hpbGROb2RlSWRzLmFkZChjaGlsZC5ub2RlSWQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBGaWx0ZXIgb3V0IGNoaWxkIG5vZGVzIGZyb20gdGhlIGFsaWdubWVudCBvcGVyYXRpb25cbiAgICAvLyBPbmx5IGFsaWduIG5vZGVzIHRoYXQgYXJlIHNlbGVjdGVkIEFORCBhcmUgbm90IGNoaWxkcmVuIG9mIGNvbnRhaW5lciBub2Rlc1xuICAgIC8vIFRoaXMgZW5zdXJlcyBjb250YWluZXIgbm9kZXMgY2FuIGJlIGFsaWduZWQgd2hpbGUgdGhlaXIgY2hpbGRyZW4gc3RheSBpbiB0aGUgc2FtZSByZWxhdGl2ZSBwb3NpdGlvblxuICAgIGNvbnN0IG5vZGVzVG9BbGlnbiA9IG5vZGVzLmZpbHRlcihub2RlID0+XG4gICAgICBzZWxlY3RlZE5vZGVJZHMuaW5jbHVkZXMobm9kZS5pZCkgJiYgIWNoaWxkTm9kZUlkcy5oYXMobm9kZS5pZCkpXG5cbiAgICBpZiAobm9kZXNUb0FsaWduLmxlbmd0aCA8PSAxKSB7XG4gICAgICBoYW5kbGVTZWxlY3Rpb25Db250ZXh0bWVudUNhbmNlbCgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBDYWxjdWxhdGUgbm9kZSBib3VuZGFyaWVzIGZvciBhbGlnbm1lbnRcbiAgICBsZXQgbWluWCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgbGV0IG1heFggPSBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxuICAgIGxldCBtaW5ZID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICBsZXQgbWF4WSA9IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXG5cbiAgICAvLyBDYWxjdWxhdGUgYm91bmRhcmllcyBvZiBzZWxlY3RlZCBub2Rlc1xuICAgIGNvbnN0IHZhbGlkTm9kZXMgPSBub2Rlc1RvQWxpZ24uZmlsdGVyKG5vZGUgPT4gbm9kZS53aWR0aCAmJiBub2RlLmhlaWdodClcbiAgICB2YWxpZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGNvbnN0IHdpZHRoID0gbm9kZS53aWR0aCFcbiAgICAgIGNvbnN0IGhlaWdodCA9IG5vZGUuaGVpZ2h0IVxuICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIG5vZGUucG9zaXRpb24ueClcbiAgICAgIG1heFggPSBNYXRoLm1heChtYXhYLCBub2RlLnBvc2l0aW9uLnggKyB3aWR0aClcbiAgICAgIG1pblkgPSBNYXRoLm1pbihtaW5ZLCBub2RlLnBvc2l0aW9uLnkpXG4gICAgICBtYXhZID0gTWF0aC5tYXgobWF4WSwgbm9kZS5wb3NpdGlvbi55ICsgaGVpZ2h0KVxuICAgIH0pXG5cbiAgICAvLyBIYW5kbGUgZGlzdHJpYnV0ZSBub2RlcyBsb2dpY1xuICAgIGlmIChhbGlnblR5cGUgPT09IEFsaWduVHlwZS5EaXN0cmlidXRlSG9yaXpvbnRhbCB8fCBhbGlnblR5cGUgPT09IEFsaWduVHlwZS5EaXN0cmlidXRlVmVydGljYWwpIHtcbiAgICAgIGNvbnN0IGRpc3RyaWJ1dGVOb2RlcyA9IGhhbmRsZURpc3RyaWJ1dGVOb2Rlcyhub2Rlc1RvQWxpZ24sIG5vZGVzLCBhbGlnblR5cGUpXG4gICAgICBpZiAoZGlzdHJpYnV0ZU5vZGVzKSB7XG4gICAgICAgIC8vIEFwcGx5IG5vZGUgZGlzdHJpYnV0aW9uIHVwZGF0ZXNcbiAgICAgICAgc3RvcmUuZ2V0U3RhdGUoKS5zZXROb2RlcyhkaXN0cmlidXRlTm9kZXMpXG4gICAgICAgIGhhbmRsZVNlbGVjdGlvbkNvbnRleHRtZW51Q2FuY2VsKClcblxuICAgICAgICAvLyBDbGVhciBndWlkZSBsaW5lc1xuICAgICAgICBjb25zdCB7IHNldEhlbHBMaW5lSG9yaXpvbnRhbCwgc2V0SGVscExpbmVWZXJ0aWNhbCB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICAgIHNldEhlbHBMaW5lSG9yaXpvbnRhbCgpXG4gICAgICAgIHNldEhlbHBMaW5lVmVydGljYWwoKVxuXG4gICAgICAgIC8vIFN5bmMgd29ya2Zsb3cgZHJhZnRcbiAgICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQoKVxuXG4gICAgICAgIC8vIFNhdmUgdG8gaGlzdG9yeVxuICAgICAgICBzYXZlU3RhdGVUb0hpc3RvcnkoV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZURyYWdTdG9wKVxuXG4gICAgICAgIHJldHVybiAvLyBFbmQgZnVuY3Rpb24gZXhlY3V0aW9uXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQpID0+IHtcbiAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBhbGwgc2VsZWN0ZWQgbm9kZXNcbiAgICAgIGNvbnN0IHZhbGlkTm9kZXNUb0FsaWduID0gbm9kZXNUb0FsaWduLmZpbHRlcihub2RlID0+IG5vZGUud2lkdGggJiYgbm9kZS5oZWlnaHQpXG4gICAgICB2YWxpZE5vZGVzVG9BbGlnbi5mb3JFYWNoKChub2RlVG9BbGlnbikgPT4ge1xuICAgICAgICAvLyBGaW5kIHRoZSBjb3JyZXNwb25kaW5nIG5vZGUgaW4gZHJhZnQgLSBjb25zaXN0ZW50IHdpdGggaGFuZGxlTm9kZURyYWdcbiAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBkcmFmdC5maW5kKG4gPT4gbi5pZCA9PT0gbm9kZVRvQWxpZ24uaWQpXG4gICAgICAgIGlmICghY3VycmVudE5vZGUpXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgLy8gVXNlIHRoZSBleHRyYWN0ZWQgYWxpZ25tZW50IGZ1bmN0aW9uXG4gICAgICAgIGhhbmRsZUFsaWduTm9kZShjdXJyZW50Tm9kZSwgbm9kZVRvQWxpZ24sIGFsaWduVHlwZSwgbWluWCwgbWF4WCwgbWluWSwgbWF4WSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIEFwcGx5IG5vZGUgcG9zaXRpb24gdXBkYXRlcyAtIGNvbnNpc3RlbnQgd2l0aCBoYW5kbGVOb2RlRHJhZyBhbmQgaGFuZGxlTm9kZURyYWdTdG9wXG4gICAgdHJ5IHtcbiAgICAgIC8vIERpcmVjdGx5IHVzZSBzZXROb2RlcyB0byB1cGRhdGUgbm9kZXMgLSBjb25zaXN0ZW50IHdpdGggaGFuZGxlTm9kZURyYWdcbiAgICAgIHN0b3JlLmdldFN0YXRlKCkuc2V0Tm9kZXMobmV3Tm9kZXMpXG5cbiAgICAgIC8vIENsb3NlIHBvcHVwXG4gICAgICBoYW5kbGVTZWxlY3Rpb25Db250ZXh0bWVudUNhbmNlbCgpXG5cbiAgICAgIC8vIENsZWFyIGd1aWRlIGxpbmVzIC0gY29uc2lzdGVudCB3aXRoIGhhbmRsZU5vZGVEcmFnU3RvcFxuICAgICAgY29uc3QgeyBzZXRIZWxwTGluZUhvcml6b250YWwsIHNldEhlbHBMaW5lVmVydGljYWwgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0SGVscExpbmVIb3Jpem9udGFsKClcbiAgICAgIHNldEhlbHBMaW5lVmVydGljYWwoKVxuXG4gICAgICAvLyBTeW5jIHdvcmtmbG93IGRyYWZ0IC0gY29uc2lzdGVudCB3aXRoIGhhbmRsZU5vZGVEcmFnU3RvcFxuICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQoKVxuXG4gICAgICAvLyBTYXZlIHRvIGhpc3RvcnkgLSBjb25zaXN0ZW50IHdpdGggaGFuZGxlTm9kZURyYWdTdG9wXG4gICAgICBzYXZlU3RhdGVUb0hpc3RvcnkoV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZURyYWdTdG9wKVxuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIG5vZGVzOicsIGVycilcbiAgICB9XG4gIH0sIFtzdG9yZSwgd29ya2Zsb3dTdG9yZSwgc2VsZWN0ZWROb2RlcywgZ2V0Tm9kZXNSZWFkT25seSwgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsIHNhdmVTdGF0ZVRvSGlzdG9yeSwgaGFuZGxlU2VsZWN0aW9uQ29udGV4dG1lbnVDYW5jZWwsIGhhbmRsZUFsaWduTm9kZSwgaGFuZGxlRGlzdHJpYnV0ZU5vZGVzXSlcblxuICBpZiAoIXNlbGVjdGlvbk1lbnUpXG4gICAgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHotWzldXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGxlZnQ6IG1lbnVQb3NpdGlvbi5sZWZ0LFxuICAgICAgICB0b3A6IG1lbnVQb3NpdGlvbi50b3AsXG4gICAgICB9fVxuICAgICAgcmVmPXtyZWZ9XG4gICAgPlxuICAgICAgPGRpdiByZWY9e21lbnVSZWZ9IGNsYXNzTmFtZT1cInctWzI0MHB4XSByb3VuZGVkLWxnIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHNoYWRvdy14bFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLW1lZGl1bSBweC0yIHB5LTIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICB7dCgnb3BlcmF0b3IudmVydGljYWwnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWxnIHB4LTMgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlQWxpZ25Ob2RlcyhBbGlnblR5cGUuVG9wKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8UmlBbGlnblRvcCBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgIHt0KCdvcGVyYXRvci5hbGlnblRvcCcsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQtbGcgcHgtMyB0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnkgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVBbGlnbk5vZGVzKEFsaWduVHlwZS5NaWRkbGUpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxSaUFsaWduQ2VudGVyIGNsYXNzTmFtZT1cImgtNCB3LTQgcm90YXRlLTkwXCIgLz5cbiAgICAgICAgICAgIHt0KCdvcGVyYXRvci5hbGlnbk1pZGRsZScsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQtbGcgcHgtMyB0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnkgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVBbGlnbk5vZGVzKEFsaWduVHlwZS5Cb3R0b20pfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxSaUFsaWduQm90dG9tIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAge3QoJ29wZXJhdG9yLmFsaWduQm90dG9tJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC1sZyBweC0zIHRleHQtc20gdGV4dC10ZXh0LXNlY29uZGFyeSBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZUFsaWduTm9kZXMoQWxpZ25UeXBlLkRpc3RyaWJ1dGVWZXJ0aWNhbCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFJpQWxpZ25KdXN0aWZ5IGNsYXNzTmFtZT1cImgtNCB3LTQgcm90YXRlLTkwXCIgLz5cbiAgICAgICAgICAgIHt0KCdvcGVyYXRvci5kaXN0cmlidXRlVmVydGljYWwnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLXB4IGJnLWRpdmlkZXItcmVndWxhclwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLW1lZGl1bSBweC0yIHB5LTIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICB7dCgnb3BlcmF0b3IuaG9yaXpvbnRhbCcsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQtbGcgcHgtMyB0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnkgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVBbGlnbk5vZGVzKEFsaWduVHlwZS5MZWZ0KX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8UmlBbGlnbkxlZnQgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICB7dCgnb3BlcmF0b3IuYWxpZ25MZWZ0JywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC1sZyBweC0zIHRleHQtc20gdGV4dC10ZXh0LXNlY29uZGFyeSBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZUFsaWduTm9kZXMoQWxpZ25UeXBlLkNlbnRlcil9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFJpQWxpZ25DZW50ZXIgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICB7dCgnb3BlcmF0b3IuYWxpZ25DZW50ZXInLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWxnIHB4LTMgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlQWxpZ25Ob2RlcyhBbGlnblR5cGUuUmlnaHQpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxSaUFsaWduUmlnaHQgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICB7dCgnb3BlcmF0b3IuYWxpZ25SaWdodCcsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQtbGcgcHgtMyB0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnkgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVBbGlnbk5vZGVzKEFsaWduVHlwZS5EaXN0cmlidXRlSG9yaXpvbnRhbCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFJpQWxpZ25KdXN0aWZ5IGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAge3QoJ29wZXJhdG9yLmRpc3RyaWJ1dGVIb3Jpem9udGFsJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vKFNlbGVjdGlvbkNvbnRleHRtZW51KVxuIl19