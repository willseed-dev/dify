"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutForChildNodes = exports.getLayoutByDagre = void 0;
const elk_bundled_js_1 = require("elkjs/lib/elk.bundled.js");
const object_1 = require("es-toolkit/object");
const constants_1 = require("@/app/components/workflow/constants");
const constants_2 = require("@/app/components/workflow/nodes/iteration-start/constants");
const constants_3 = require("@/app/components/workflow/nodes/loop-start/constants");
const types_1 = require("@/app/components/workflow/types");
// Although the file name refers to Dagre, the implementation now relies on ELK's layered algorithm.
// Keep the export signatures unchanged to minimise the blast radius while we migrate the layout stack.
const elk = new elk_bundled_js_1.default();
const DEFAULT_NODE_WIDTH = 244;
const DEFAULT_NODE_HEIGHT = 100;
const ROOT_LAYOUT_OPTIONS = {
    'elk.algorithm': 'layered',
    'elk.direction': 'RIGHT',
    // === Spacing - Maximum spacing to prevent any overlap ===
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80',
    'elk.spacing.edgeNode': '50',
    'elk.spacing.edgeEdge': '30',
    'elk.spacing.edgeLabel': '10',
    'elk.spacing.portPort': '20',
    // === Port Configuration ===
    'elk.portConstraints': 'FIXED_ORDER',
    'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES',
    'elk.port.side': 'SOUTH',
    // === Node Placement - Best quality ===
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.nodePlacement.favorStraightEdges': 'true',
    'elk.layered.nodePlacement.linearSegments.deflectionDampening': '0.5',
    'elk.layered.nodePlacement.networkSimplex.nodeFlexibility': 'NODE_SIZE',
    // === Edge Routing - Maximum quality ===
    'elk.edgeRouting': 'SPLINES',
    'elk.layered.edgeRouting.selfLoopPlacement': 'NORTH',
    'elk.layered.edgeRouting.sloppySplineRouting': 'false',
    'elk.layered.edgeRouting.splines.mode': 'CONSERVATIVE',
    'elk.layered.edgeRouting.splines.sloppy.layerSpacingFactor': '1.2',
    // === Crossing Minimization - Most aggressive ===
    'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    'elk.layered.crossingMinimization.greedySwitch.type': 'TWO_SIDED',
    'elk.layered.crossingMinimization.greedySwitchHierarchical.type': 'TWO_SIDED',
    'elk.layered.crossingMinimization.semiInteractive': 'true',
    'elk.layered.crossingMinimization.hierarchicalSweepiness': '0.9',
    // === Layering Strategy - Best quality ===
    'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.layering.networkSimplex.nodeFlexibility': 'NODE_SIZE',
    'elk.layered.layering.layerConstraint': 'NONE',
    'elk.layered.layering.minWidth.upperBoundOnWidth': '4',
    // === Cycle Breaking ===
    'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
    // === Connected Components ===
    'elk.separateConnectedComponents': 'true',
    'elk.spacing.componentComponent': '100',
    // === Node Size Constraints ===
    'elk.nodeSize.constraints': 'NODE_LABELS',
    'elk.nodeSize.options': 'DEFAULT_MINIMUM_SIZE MINIMUM_SIZE_ACCOUNTS_FOR_PADDING',
    // === Edge Label Placement ===
    'elk.edgeLabels.placement': 'CENTER',
    'elk.edgeLabels.inline': 'true',
    // === Compaction ===
    'elk.layered.compaction.postCompaction.strategy': 'EDGE_LENGTH',
    'elk.layered.compaction.postCompaction.constraints': 'EDGE_LENGTH',
    // === High-Quality Mode ===
    'elk.layered.thoroughness': '10',
    'elk.layered.wrapping.strategy': 'OFF',
    'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    // === Additional Optimizations ===
    'elk.layered.feedbackEdges': 'true',
    'elk.layered.mergeEdges': 'false',
    'elk.layered.mergeHierarchyEdges': 'false',
    'elk.layered.allowNonFlowPortsToSwitchSides': 'false',
    'elk.layered.northOrSouthPort': 'false',
    'elk.partitioning.activate': 'false',
    'elk.junctionPoints': 'true',
    // === Content Alignment ===
    'elk.contentAlignment': 'V_TOP H_LEFT',
    'elk.alignment': 'AUTOMATIC',
};
const CHILD_LAYOUT_OPTIONS = {
    'elk.algorithm': 'layered',
    'elk.direction': 'RIGHT',
    // === Spacing - High quality for child nodes ===
    'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    'elk.spacing.nodeNode': '60',
    'elk.spacing.edgeNode': '40',
    'elk.spacing.edgeEdge': '25',
    'elk.spacing.edgeLabel': '8',
    'elk.spacing.portPort': '15',
    // === Node Placement - Best quality ===
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.nodePlacement.favorStraightEdges': 'true',
    'elk.layered.nodePlacement.linearSegments.deflectionDampening': '0.5',
    'elk.layered.nodePlacement.networkSimplex.nodeFlexibility': 'NODE_SIZE',
    // === Edge Routing - Maximum quality ===
    'elk.edgeRouting': 'SPLINES',
    'elk.layered.edgeRouting.sloppySplineRouting': 'false',
    'elk.layered.edgeRouting.splines.mode': 'CONSERVATIVE',
    // === Crossing Minimization - Aggressive ===
    'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    'elk.layered.crossingMinimization.greedySwitch.type': 'TWO_SIDED',
    'elk.layered.crossingMinimization.semiInteractive': 'true',
    // === Layering Strategy ===
    'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.layering.networkSimplex.nodeFlexibility': 'NODE_SIZE',
    // === Cycle Breaking ===
    'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
    // === Node Size ===
    'elk.nodeSize.constraints': 'NODE_LABELS',
    // === Compaction ===
    'elk.layered.compaction.postCompaction.strategy': 'EDGE_LENGTH',
    // === High-Quality Mode ===
    'elk.layered.thoroughness': '10',
    'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    // === Additional Optimizations ===
    'elk.layered.feedbackEdges': 'true',
    'elk.layered.mergeEdges': 'false',
    'elk.junctionPoints': 'true',
};
const toElkNode = (node) => ({
    id: node.id,
    width: node.width ?? DEFAULT_NODE_WIDTH,
    height: node.height ?? DEFAULT_NODE_HEIGHT,
});
let edgeCounter = 0;
const nextEdgeId = () => `elk-edge-${edgeCounter++}`;
const createEdge = (source, target, sourcePort, targetPort) => ({
    id: nextEdgeId(),
    sources: [source],
    targets: [target],
    sourcePort,
    targetPort,
});
const collectLayout = (graph, predicate) => {
    const result = new Map();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const visit = (node) => {
        node.children?.forEach((child) => {
            if (predicate(child.id)) {
                const x = child.x ?? 0;
                const y = child.y ?? 0;
                const width = child.width ?? DEFAULT_NODE_WIDTH;
                const height = child.height ?? DEFAULT_NODE_HEIGHT;
                const layer = child?.layoutOptions?.['org.eclipse.elk.layered.layerIndex'];
                result.set(child.id, {
                    x,
                    y,
                    width,
                    height,
                    layer: layer ? Number.parseInt(layer) : undefined,
                });
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x + width);
                maxY = Math.max(maxY, y + height);
            }
            if (child.children?.length)
                visit(child);
        });
    };
    visit(graph);
    if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
        minX = 0;
        minY = 0;
        maxX = 0;
        maxY = 0;
    }
    return {
        nodes: result,
        bounds: {
            minX,
            minY,
            maxX,
            maxY,
        },
    };
};
/**
 * Build If/Else node with ELK native Ports instead of dummy nodes
 * This is the recommended approach for handling multiple branches
 */
const buildIfElseWithPorts = (ifElseNode, edges) => {
    const childEdges = edges.filter(edge => edge.source === ifElseNode.id);
    if (childEdges.length <= 1)
        return null;
    // Sort child edges according to case order
    const sortedChildEdges = [...childEdges].sort((edgeA, edgeB) => {
        const handleA = edgeA.sourceHandle;
        const handleB = edgeB.sourceHandle;
        if (handleA && handleB) {
            const cases = ifElseNode.data.cases || [];
            const isAElse = handleA === 'false';
            const isBElse = handleB === 'false';
            if (isAElse)
                return 1;
            if (isBElse)
                return -1;
            const indexA = cases.findIndex((c) => c.case_id === handleA);
            const indexB = cases.findIndex((c) => c.case_id === handleB);
            if (indexA !== -1 && indexB !== -1)
                return indexA - indexB;
        }
        return 0;
    });
    // Create ELK ports for each branch
    const ports = sortedChildEdges.map((edge, index) => ({
        id: `${ifElseNode.id}-port-${edge.sourceHandle || index}`,
        layoutOptions: {
            'port.side': 'EAST', // Ports on the right side (matching 'RIGHT' direction)
            'port.index': String(index),
        },
    }));
    // Build port mapping: sourceHandle -> portId
    const portMap = new Map();
    sortedChildEdges.forEach((edge, index) => {
        const portId = `${ifElseNode.id}-port-${edge.sourceHandle || index}`;
        portMap.set(edge.id, portId);
    });
    return {
        node: {
            id: ifElseNode.id,
            width: ifElseNode.width ?? DEFAULT_NODE_WIDTH,
            height: ifElseNode.height ?? DEFAULT_NODE_HEIGHT,
            ports,
            layoutOptions: {
                'elk.portConstraints': 'FIXED_ORDER',
            },
        },
        portMap,
    };
};
const normaliseBounds = (layout) => {
    const { nodes, bounds, } = layout;
    if (nodes.size === 0)
        return layout;
    const offsetX = bounds.minX;
    const offsetY = bounds.minY;
    const adjustedNodes = new Map();
    nodes.forEach((info, id) => {
        adjustedNodes.set(id, {
            ...info,
            x: info.x - offsetX,
            y: info.y - offsetY,
        });
    });
    return {
        nodes: adjustedNodes,
        bounds: {
            minX: 0,
            minY: 0,
            maxX: bounds.maxX - offsetX,
            maxY: bounds.maxY - offsetY,
        },
    };
};
const getLayoutByDagre = async (originNodes, originEdges) => {
    edgeCounter = 0;
    const nodes = (0, object_1.cloneDeep)(originNodes).filter(node => !node.parentId && node.type === constants_1.CUSTOM_NODE);
    const edges = (0, object_1.cloneDeep)(originEdges).filter(edge => (!edge.data?.isInIteration && !edge.data?.isInLoop));
    const elkNodes = [];
    const elkEdges = [];
    // Track which edges have been processed for If/Else nodes with ports
    const edgeToPortMap = new Map();
    // Build nodes with ports for If/Else nodes
    nodes.forEach((node) => {
        if (node.data.type === types_1.BlockEnum.IfElse) {
            const portsResult = buildIfElseWithPorts(node, edges);
            if (portsResult) {
                // Use node with ports
                elkNodes.push(portsResult.node);
                // Store port mappings for edges
                portsResult.portMap.forEach((portId, edgeId) => {
                    edgeToPortMap.set(edgeId, portId);
                });
            }
            else {
                // No multiple branches, use normal node
                elkNodes.push(toElkNode(node));
            }
        }
        else {
            elkNodes.push(toElkNode(node));
        }
    });
    // Build edges with port connections
    edges.forEach((edge) => {
        const sourcePort = edgeToPortMap.get(edge.id);
        elkEdges.push(createEdge(edge.source, edge.target, sourcePort));
    });
    const graph = {
        id: 'workflow-root',
        layoutOptions: ROOT_LAYOUT_OPTIONS,
        children: elkNodes,
        edges: elkEdges,
    };
    const layoutedGraph = await elk.layout(graph);
    // No need to filter dummy nodes anymore, as we're using ports
    const layout = collectLayout(layoutedGraph, () => true);
    return normaliseBounds(layout);
};
exports.getLayoutByDagre = getLayoutByDagre;
const normaliseChildLayout = (layout, nodes) => {
    const result = new Map();
    layout.nodes.forEach((info, id) => {
        result.set(id, info);
    });
    // Ensure iteration / loop start nodes do not collapse into the children.
    const startNode = nodes.find(node => node.type === constants_2.CUSTOM_ITERATION_START_NODE
        || node.type === constants_3.CUSTOM_LOOP_START_NODE
        || node.data?.type === types_1.BlockEnum.LoopStart
        || node.data?.type === types_1.BlockEnum.IterationStart);
    if (startNode) {
        const startLayout = result.get(startNode.id);
        if (startLayout) {
            const desiredMinX = constants_1.NODE_LAYOUT_HORIZONTAL_PADDING / 1.5;
            if (startLayout.x > desiredMinX) {
                const shiftX = startLayout.x - desiredMinX;
                result.forEach((value, key) => {
                    result.set(key, {
                        ...value,
                        x: value.x - shiftX,
                    });
                });
            }
            const desiredMinY = startLayout.y;
            const deltaY = constants_1.NODE_LAYOUT_VERTICAL_PADDING / 2;
            result.forEach((value, key) => {
                result.set(key, {
                    ...value,
                    y: value.y - desiredMinY + deltaY,
                });
            });
        }
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    result.forEach((value) => {
        minX = Math.min(minX, value.x);
        minY = Math.min(minY, value.y);
        maxX = Math.max(maxX, value.x + value.width);
        maxY = Math.max(maxY, value.y + value.height);
    });
    if (!Number.isFinite(minX) || !Number.isFinite(minY))
        return layout;
    return normaliseBounds({
        nodes: result,
        bounds: {
            minX,
            minY,
            maxX,
            maxY,
        },
    });
};
const getLayoutForChildNodes = async (parentNodeId, originNodes, originEdges) => {
    edgeCounter = 0;
    const nodes = (0, object_1.cloneDeep)(originNodes).filter(node => node.parentId === parentNodeId);
    if (!nodes.length)
        return null;
    const edges = (0, object_1.cloneDeep)(originEdges).filter(edge => (edge.data?.isInIteration && edge.data?.iteration_id === parentNodeId)
        || (edge.data?.isInLoop && edge.data?.loop_id === parentNodeId));
    const elkNodes = nodes.map(toElkNode);
    const elkEdges = edges.map(edge => createEdge(edge.source, edge.target));
    const graph = {
        id: parentNodeId,
        layoutOptions: CHILD_LAYOUT_OPTIONS,
        children: elkNodes,
        edges: elkEdges,
    };
    const layoutedGraph = await elk.layout(graph);
    const layout = collectLayout(layoutedGraph, () => true);
    return normaliseChildLayout(layout, nodes);
};
exports.getLayoutForChildNodes = getLayoutForChildNodes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxrLWxheW91dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVsay1sYXlvdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBTUEsNkRBQTBDO0FBQzFDLDhDQUE2QztBQUM3QyxtRUFJNEM7QUFDNUMseUZBQXVHO0FBQ3ZHLG9GQUE2RjtBQUM3RiwyREFFd0M7QUFFeEMsb0dBQW9HO0FBQ3BHLHVHQUF1RztBQUV2RyxNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFHLEVBQUUsQ0FBQTtBQUVyQixNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQTtBQUM5QixNQUFNLG1CQUFtQixHQUFHLEdBQUcsQ0FBQTtBQUUvQixNQUFNLG1CQUFtQixHQUFHO0lBQzFCLGVBQWUsRUFBRSxTQUFTO0lBQzFCLGVBQWUsRUFBRSxPQUFPO0lBRXhCLDJEQUEyRDtJQUMzRCwyQ0FBMkMsRUFBRSxLQUFLO0lBQ2xELHNCQUFzQixFQUFFLElBQUk7SUFDNUIsc0JBQXNCLEVBQUUsSUFBSTtJQUM1QixzQkFBc0IsRUFBRSxJQUFJO0lBQzVCLHVCQUF1QixFQUFFLElBQUk7SUFDN0Isc0JBQXNCLEVBQUUsSUFBSTtJQUU1Qiw2QkFBNkI7SUFDN0IscUJBQXFCLEVBQUUsYUFBYTtJQUNwQyx5Q0FBeUMsRUFBRSxjQUFjO0lBQ3pELGVBQWUsRUFBRSxPQUFPO0lBRXhCLHdDQUF3QztJQUN4QyxvQ0FBb0MsRUFBRSxpQkFBaUI7SUFDdkQsOENBQThDLEVBQUUsTUFBTTtJQUN0RCw4REFBOEQsRUFBRSxLQUFLO0lBQ3JFLDBEQUEwRCxFQUFFLFdBQVc7SUFFdkUseUNBQXlDO0lBQ3pDLGlCQUFpQixFQUFFLFNBQVM7SUFDNUIsMkNBQTJDLEVBQUUsT0FBTztJQUNwRCw2Q0FBNkMsRUFBRSxPQUFPO0lBQ3RELHNDQUFzQyxFQUFFLGNBQWM7SUFDdEQsMkRBQTJELEVBQUUsS0FBSztJQUVsRSxrREFBa0Q7SUFDbEQsMkNBQTJDLEVBQUUsYUFBYTtJQUMxRCxvREFBb0QsRUFBRSxXQUFXO0lBQ2pFLGdFQUFnRSxFQUFFLFdBQVc7SUFDN0Usa0RBQWtELEVBQUUsTUFBTTtJQUMxRCx5REFBeUQsRUFBRSxLQUFLO0lBRWhFLDJDQUEyQztJQUMzQywrQkFBK0IsRUFBRSxpQkFBaUI7SUFDbEQscURBQXFELEVBQUUsV0FBVztJQUNsRSxzQ0FBc0MsRUFBRSxNQUFNO0lBQzlDLGlEQUFpRCxFQUFFLEdBQUc7SUFFdEQseUJBQXlCO0lBQ3pCLG9DQUFvQyxFQUFFLGFBQWE7SUFFbkQsK0JBQStCO0lBQy9CLGlDQUFpQyxFQUFFLE1BQU07SUFDekMsZ0NBQWdDLEVBQUUsS0FBSztJQUV2QyxnQ0FBZ0M7SUFDaEMsMEJBQTBCLEVBQUUsYUFBYTtJQUN6QyxzQkFBc0IsRUFBRSx3REFBd0Q7SUFFaEYsK0JBQStCO0lBQy9CLDBCQUEwQixFQUFFLFFBQVE7SUFDcEMsdUJBQXVCLEVBQUUsTUFBTTtJQUUvQixxQkFBcUI7SUFDckIsZ0RBQWdELEVBQUUsYUFBYTtJQUMvRCxtREFBbUQsRUFBRSxhQUFhO0lBRWxFLDRCQUE0QjtJQUM1QiwwQkFBMEIsRUFBRSxJQUFJO0lBQ2hDLCtCQUErQixFQUFFLEtBQUs7SUFDdEMsdUJBQXVCLEVBQUUsa0JBQWtCO0lBRTNDLG1DQUFtQztJQUNuQywyQkFBMkIsRUFBRSxNQUFNO0lBQ25DLHdCQUF3QixFQUFFLE9BQU87SUFDakMsaUNBQWlDLEVBQUUsT0FBTztJQUMxQyw0Q0FBNEMsRUFBRSxPQUFPO0lBQ3JELDhCQUE4QixFQUFFLE9BQU87SUFDdkMsMkJBQTJCLEVBQUUsT0FBTztJQUNwQyxvQkFBb0IsRUFBRSxNQUFNO0lBRTVCLDRCQUE0QjtJQUM1QixzQkFBc0IsRUFBRSxjQUFjO0lBQ3RDLGVBQWUsRUFBRSxXQUFXO0NBQzdCLENBQUE7QUFFRCxNQUFNLG9CQUFvQixHQUFHO0lBQzNCLGVBQWUsRUFBRSxTQUFTO0lBQzFCLGVBQWUsRUFBRSxPQUFPO0lBRXhCLGlEQUFpRDtJQUNqRCwyQ0FBMkMsRUFBRSxJQUFJO0lBQ2pELHNCQUFzQixFQUFFLElBQUk7SUFDNUIsc0JBQXNCLEVBQUUsSUFBSTtJQUM1QixzQkFBc0IsRUFBRSxJQUFJO0lBQzVCLHVCQUF1QixFQUFFLEdBQUc7SUFDNUIsc0JBQXNCLEVBQUUsSUFBSTtJQUU1Qix3Q0FBd0M7SUFDeEMsb0NBQW9DLEVBQUUsaUJBQWlCO0lBQ3ZELDhDQUE4QyxFQUFFLE1BQU07SUFDdEQsOERBQThELEVBQUUsS0FBSztJQUNyRSwwREFBMEQsRUFBRSxXQUFXO0lBRXZFLHlDQUF5QztJQUN6QyxpQkFBaUIsRUFBRSxTQUFTO0lBQzVCLDZDQUE2QyxFQUFFLE9BQU87SUFDdEQsc0NBQXNDLEVBQUUsY0FBYztJQUV0RCw2Q0FBNkM7SUFDN0MsMkNBQTJDLEVBQUUsYUFBYTtJQUMxRCxvREFBb0QsRUFBRSxXQUFXO0lBQ2pFLGtEQUFrRCxFQUFFLE1BQU07SUFFMUQsNEJBQTRCO0lBQzVCLCtCQUErQixFQUFFLGlCQUFpQjtJQUNsRCxxREFBcUQsRUFBRSxXQUFXO0lBRWxFLHlCQUF5QjtJQUN6QixvQ0FBb0MsRUFBRSxhQUFhO0lBRW5ELG9CQUFvQjtJQUNwQiwwQkFBMEIsRUFBRSxhQUFhO0lBRXpDLHFCQUFxQjtJQUNyQixnREFBZ0QsRUFBRSxhQUFhO0lBRS9ELDRCQUE0QjtJQUM1QiwwQkFBMEIsRUFBRSxJQUFJO0lBQ2hDLHVCQUF1QixFQUFFLGtCQUFrQjtJQUUzQyxtQ0FBbUM7SUFDbkMsMkJBQTJCLEVBQUUsTUFBTTtJQUNuQyx3QkFBd0IsRUFBRSxPQUFPO0lBQ2pDLG9CQUFvQixFQUFFLE1BQU07Q0FDN0IsQ0FBQTtBQTZDRCxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQVUsRUFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDL0MsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO0lBQ1gsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLElBQUksa0JBQWtCO0lBQ3ZDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLG1CQUFtQjtDQUMzQyxDQUFDLENBQUE7QUFFRixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUE7QUFDbkIsTUFBTSxVQUFVLEdBQUcsR0FBRyxFQUFFLENBQUMsWUFBWSxXQUFXLEVBQUUsRUFBRSxDQUFBO0FBRXBELE1BQU0sVUFBVSxHQUFHLENBQ2pCLE1BQWMsRUFDZCxNQUFjLEVBQ2QsVUFBbUIsRUFDbkIsVUFBbUIsRUFDTCxFQUFFLENBQUMsQ0FBQztJQUNsQixFQUFFLEVBQUUsVUFBVSxFQUFFO0lBQ2hCLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNqQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDakIsVUFBVTtJQUNWLFVBQVU7Q0FDWCxDQUFDLENBQUE7QUFFRixNQUFNLGFBQWEsR0FBRyxDQUFDLEtBQWMsRUFBRSxTQUFrQyxFQUFnQixFQUFFO0lBQ3pGLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFBO0lBQzVDLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQTtJQUNuQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUE7SUFDbkIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUE7SUFDcEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUE7SUFFcEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFhLEVBQUUsRUFBRTtRQUM5QixJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEtBQWMsRUFBRSxFQUFFO1lBQ3hDLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN4QixNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDdEIsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ3RCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksa0JBQWtCLENBQUE7Z0JBQy9DLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksbUJBQW1CLENBQUE7Z0JBQ2xELE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO2dCQUUxRSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUU7b0JBQ25CLENBQUM7b0JBQ0QsQ0FBQztvQkFDRCxLQUFLO29CQUNMLE1BQU07b0JBQ04sS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztpQkFDbEQsQ0FBQyxDQUFBO2dCQUVGLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDeEIsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO2dCQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFBO2dCQUNoQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFBO1lBQ25DLENBQUM7WUFFRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTTtnQkFDeEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFBO0lBRUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRVosSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDckQsSUFBSSxHQUFHLENBQUMsQ0FBQTtRQUNSLElBQUksR0FBRyxDQUFDLENBQUE7UUFDUixJQUFJLEdBQUcsQ0FBQyxDQUFBO1FBQ1IsSUFBSSxHQUFHLENBQUMsQ0FBQTtJQUNWLENBQUM7SUFFRCxPQUFPO1FBQ0wsS0FBSyxFQUFFLE1BQU07UUFDYixNQUFNLEVBQUU7WUFDTixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1NBQ0w7S0FDRixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxDQUMzQixVQUFnQixFQUNoQixLQUFhLEVBQ2dELEVBQUU7SUFDL0QsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRXRFLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFBO0lBRWIsMkNBQTJDO0lBQzNDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUM3RCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFBO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUE7UUFFbEMsSUFBSSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7WUFDdkIsTUFBTSxLQUFLLEdBQUksVUFBVSxDQUFDLElBQXVCLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQTtZQUM3RCxNQUFNLE9BQU8sR0FBRyxPQUFPLEtBQUssT0FBTyxDQUFBO1lBQ25DLE1BQU0sT0FBTyxHQUFHLE9BQU8sS0FBSyxPQUFPLENBQUE7WUFFbkMsSUFBSSxPQUFPO2dCQUNULE9BQU8sQ0FBQyxDQUFBO1lBQ1YsSUFBSSxPQUFPO2dCQUNULE9BQU8sQ0FBQyxDQUFDLENBQUE7WUFFWCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFBO1lBQ3RFLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDLENBQUE7WUFFdEUsSUFBSSxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksTUFBTSxLQUFLLENBQUMsQ0FBQztnQkFDaEMsT0FBTyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQzFCLENBQUM7UUFFRCxPQUFPLENBQUMsQ0FBQTtJQUNWLENBQUMsQ0FBQyxDQUFBO0lBRUYsbUNBQW1DO0lBQ25DLE1BQU0sS0FBSyxHQUFtQixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLEVBQUUsRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFFLFNBQVMsSUFBSSxDQUFDLFlBQVksSUFBSSxLQUFLLEVBQUU7UUFDekQsYUFBYSxFQUFFO1lBQ2IsV0FBVyxFQUFFLE1BQU0sRUFBRSx1REFBdUQ7WUFDNUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDNUI7S0FDRixDQUFDLENBQUMsQ0FBQTtJQUVILDZDQUE2QztJQUM3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQTtJQUN6QyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDdkMsTUFBTSxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsRUFBRSxTQUFTLElBQUksQ0FBQyxZQUFZLElBQUksS0FBSyxFQUFFLENBQUE7UUFDcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzlCLENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRTtZQUNKLEVBQUUsRUFBRSxVQUFVLENBQUMsRUFBRTtZQUNqQixLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssSUFBSSxrQkFBa0I7WUFDN0MsTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNLElBQUksbUJBQW1CO1lBQ2hELEtBQUs7WUFDTCxhQUFhLEVBQUU7Z0JBQ2IscUJBQXFCLEVBQUUsYUFBYTthQUNyQztTQUNGO1FBQ0QsT0FBTztLQUNSLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLGVBQWUsR0FBRyxDQUFDLE1BQW9CLEVBQWdCLEVBQUU7SUFDN0QsTUFBTSxFQUNKLEtBQUssRUFDTCxNQUFNLEdBQ1AsR0FBRyxNQUFNLENBQUE7SUFFVixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQztRQUNsQixPQUFPLE1BQU0sQ0FBQTtJQUVmLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDM0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUUzQixNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBc0IsQ0FBQTtJQUNuRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ3pCLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO1lBQ3BCLEdBQUcsSUFBSTtZQUNQLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU87WUFDbkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTztTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLE9BQU87UUFDTCxLQUFLLEVBQUUsYUFBYTtRQUNwQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQztZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTztZQUMzQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPO1NBQzVCO0tBQ0YsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVNLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxFQUFFLFdBQW1CLEVBQUUsV0FBbUIsRUFBeUIsRUFBRTtJQUN4RyxXQUFXLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsTUFBTSxLQUFLLEdBQUcsSUFBQSxrQkFBUyxFQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHVCQUFXLENBQUMsQ0FBQTtJQUNoRyxNQUFNLEtBQUssR0FBRyxJQUFBLGtCQUFTLEVBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRXhHLE1BQU0sUUFBUSxHQUFtQixFQUFFLENBQUE7SUFDbkMsTUFBTSxRQUFRLEdBQW1CLEVBQUUsQ0FBQTtJQUVuQyxxRUFBcUU7SUFDckUsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUE7SUFFL0MsMkNBQTJDO0lBQzNDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNyQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEMsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQ3JELElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQ2hCLHNCQUFzQjtnQkFDdEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQy9CLGdDQUFnQztnQkFDaEMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQzdDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO2dCQUNuQyxDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUM7aUJBQ0ksQ0FBQztnQkFDSix3Q0FBd0M7Z0JBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7WUFDaEMsQ0FBQztRQUNILENBQUM7YUFDSSxDQUFDO1lBQ0osUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNoQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFFRixvQ0FBb0M7SUFDcEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3JCLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFBO0lBQ2pFLENBQUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxLQUFLLEdBQUc7UUFDWixFQUFFLEVBQUUsZUFBZTtRQUNuQixhQUFhLEVBQUUsbUJBQW1CO1FBQ2xDLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUE7SUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDN0MsOERBQThEO0lBQzlELE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdkQsT0FBTyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEMsQ0FBQyxDQUFBO0FBbERZLFFBQUEsZ0JBQWdCLG9CQWtENUI7QUFFRCxNQUFNLG9CQUFvQixHQUFHLENBQzNCLE1BQW9CLEVBQ3BCLEtBQWEsRUFDQyxFQUFFO0lBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFBO0lBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3RCLENBQUMsQ0FBQyxDQUFBO0lBRUYseUVBQXlFO0lBQ3pFLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDbEMsSUFBSSxDQUFDLElBQUksS0FBSyx1Q0FBMkI7V0FDdEMsSUFBSSxDQUFDLElBQUksS0FBSyxrQ0FBc0I7V0FDcEMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEtBQUssaUJBQVMsQ0FBQyxTQUFTO1dBQ3ZDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFLLGlCQUFTLENBQUMsY0FBYyxDQUNoRCxDQUFBO0lBRUQsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNkLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRTVDLElBQUksV0FBVyxFQUFFLENBQUM7WUFDaEIsTUFBTSxXQUFXLEdBQUcsMENBQThCLEdBQUcsR0FBRyxDQUFBO1lBQ3hELElBQUksV0FBVyxDQUFDLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQztnQkFDaEMsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUE7Z0JBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7b0JBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO3dCQUNkLEdBQUcsS0FBSzt3QkFDUixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNO3FCQUNwQixDQUFDLENBQUE7Z0JBQ0osQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDO1lBRUQsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQTtZQUNqQyxNQUFNLE1BQU0sR0FBRyx3Q0FBNEIsR0FBRyxDQUFDLENBQUE7WUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ2QsR0FBRyxLQUFLO29CQUNSLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLFdBQVcsR0FBRyxNQUFNO2lCQUNsQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFBO0lBQ25CLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQTtJQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQTtJQUNwQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQTtJQUVwQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDdkIsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM1QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDL0MsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ2xELE9BQU8sTUFBTSxDQUFBO0lBRWYsT0FBTyxlQUFlLENBQUM7UUFDckIsS0FBSyxFQUFFLE1BQU07UUFDYixNQUFNLEVBQUU7WUFDTixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1NBQ0w7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFFTSxNQUFNLHNCQUFzQixHQUFHLEtBQUssRUFDekMsWUFBb0IsRUFDcEIsV0FBbUIsRUFDbkIsV0FBbUIsRUFDVyxFQUFFO0lBQ2hDLFdBQVcsR0FBRyxDQUFDLENBQUE7SUFDZixNQUFNLEtBQUssR0FBRyxJQUFBLGtCQUFTLEVBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxZQUFZLENBQUMsQ0FBQTtJQUNuRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQTtJQUViLE1BQU0sS0FBSyxHQUFHLElBQUEsa0JBQVMsRUFBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDakQsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksS0FBSyxZQUFZLENBQUM7V0FDbkUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsQ0FDaEUsQ0FBQTtJQUVELE1BQU0sUUFBUSxHQUFtQixLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3JELE1BQU0sUUFBUSxHQUFtQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFFeEYsTUFBTSxLQUFLLEdBQUc7UUFDWixFQUFFLEVBQUUsWUFBWTtRQUNoQixhQUFhLEVBQUUsb0JBQW9CO1FBQ25DLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUE7SUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDN0MsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN2RCxPQUFPLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUM1QyxDQUFDLENBQUE7QUE1QlksUUFBQSxzQkFBc0IsMEJBNEJsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRWxrTm9kZSwgTGF5b3V0T3B0aW9ucyB9IGZyb20gJ2Vsa2pzL2xpYi9lbGstYXBpJ1xuaW1wb3J0IHR5cGUgeyBDYXNlSXRlbSwgSWZFbHNlTm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2lmLWVsc2UvdHlwZXMnXG5pbXBvcnQgdHlwZSB7XG4gIEVkZ2UsXG4gIE5vZGUsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgRUxLIGZyb20gJ2Vsa2pzL2xpYi9lbGsuYnVuZGxlZC5qcydcbmltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gJ2VzLXRvb2xraXQvb2JqZWN0J1xuaW1wb3J0IHtcbiAgQ1VTVE9NX05PREUsXG4gIE5PREVfTEFZT1VUX0hPUklaT05UQUxfUEFERElORyxcbiAgTk9ERV9MQVlPVVRfVkVSVElDQUxfUEFERElORyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9jb25zdGFudHMnXG5pbXBvcnQgeyBDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2l0ZXJhdGlvbi1zdGFydC9jb25zdGFudHMnXG5pbXBvcnQgeyBDVVNUT01fTE9PUF9TVEFSVF9OT0RFIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9sb29wLXN0YXJ0L2NvbnN0YW50cydcbmltcG9ydCB7XG4gIEJsb2NrRW51bSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcblxuLy8gQWx0aG91Z2ggdGhlIGZpbGUgbmFtZSByZWZlcnMgdG8gRGFncmUsIHRoZSBpbXBsZW1lbnRhdGlvbiBub3cgcmVsaWVzIG9uIEVMSydzIGxheWVyZWQgYWxnb3JpdGhtLlxuLy8gS2VlcCB0aGUgZXhwb3J0IHNpZ25hdHVyZXMgdW5jaGFuZ2VkIHRvIG1pbmltaXNlIHRoZSBibGFzdCByYWRpdXMgd2hpbGUgd2UgbWlncmF0ZSB0aGUgbGF5b3V0IHN0YWNrLlxuXG5jb25zdCBlbGsgPSBuZXcgRUxLKClcblxuY29uc3QgREVGQVVMVF9OT0RFX1dJRFRIID0gMjQ0XG5jb25zdCBERUZBVUxUX05PREVfSEVJR0hUID0gMTAwXG5cbmNvbnN0IFJPT1RfTEFZT1VUX09QVElPTlMgPSB7XG4gICdlbGsuYWxnb3JpdGhtJzogJ2xheWVyZWQnLFxuICAnZWxrLmRpcmVjdGlvbic6ICdSSUdIVCcsXG5cbiAgLy8gPT09IFNwYWNpbmcgLSBNYXhpbXVtIHNwYWNpbmcgdG8gcHJldmVudCBhbnkgb3ZlcmxhcCA9PT1cbiAgJ2Vsay5sYXllcmVkLnNwYWNpbmcubm9kZU5vZGVCZXR3ZWVuTGF5ZXJzJzogJzEwMCcsXG4gICdlbGsuc3BhY2luZy5ub2RlTm9kZSc6ICc4MCcsXG4gICdlbGsuc3BhY2luZy5lZGdlTm9kZSc6ICc1MCcsXG4gICdlbGsuc3BhY2luZy5lZGdlRWRnZSc6ICczMCcsXG4gICdlbGsuc3BhY2luZy5lZGdlTGFiZWwnOiAnMTAnLFxuICAnZWxrLnNwYWNpbmcucG9ydFBvcnQnOiAnMjAnLFxuXG4gIC8vID09PSBQb3J0IENvbmZpZ3VyYXRpb24gPT09XG4gICdlbGsucG9ydENvbnN0cmFpbnRzJzogJ0ZJWEVEX09SREVSJyxcbiAgJ2Vsay5sYXllcmVkLmNvbnNpZGVyTW9kZWxPcmRlci5zdHJhdGVneSc6ICdQUkVGRVJfRURHRVMnLFxuICAnZWxrLnBvcnQuc2lkZSc6ICdTT1VUSCcsXG5cbiAgLy8gPT09IE5vZGUgUGxhY2VtZW50IC0gQmVzdCBxdWFsaXR5ID09PVxuICAnZWxrLmxheWVyZWQubm9kZVBsYWNlbWVudC5zdHJhdGVneSc6ICdORVRXT1JLX1NJTVBMRVgnLFxuICAnZWxrLmxheWVyZWQubm9kZVBsYWNlbWVudC5mYXZvclN0cmFpZ2h0RWRnZXMnOiAndHJ1ZScsXG4gICdlbGsubGF5ZXJlZC5ub2RlUGxhY2VtZW50LmxpbmVhclNlZ21lbnRzLmRlZmxlY3Rpb25EYW1wZW5pbmcnOiAnMC41JyxcbiAgJ2Vsay5sYXllcmVkLm5vZGVQbGFjZW1lbnQubmV0d29ya1NpbXBsZXgubm9kZUZsZXhpYmlsaXR5JzogJ05PREVfU0laRScsXG5cbiAgLy8gPT09IEVkZ2UgUm91dGluZyAtIE1heGltdW0gcXVhbGl0eSA9PT1cbiAgJ2Vsay5lZGdlUm91dGluZyc6ICdTUExJTkVTJyxcbiAgJ2Vsay5sYXllcmVkLmVkZ2VSb3V0aW5nLnNlbGZMb29wUGxhY2VtZW50JzogJ05PUlRIJyxcbiAgJ2Vsay5sYXllcmVkLmVkZ2VSb3V0aW5nLnNsb3BweVNwbGluZVJvdXRpbmcnOiAnZmFsc2UnLFxuICAnZWxrLmxheWVyZWQuZWRnZVJvdXRpbmcuc3BsaW5lcy5tb2RlJzogJ0NPTlNFUlZBVElWRScsXG4gICdlbGsubGF5ZXJlZC5lZGdlUm91dGluZy5zcGxpbmVzLnNsb3BweS5sYXllclNwYWNpbmdGYWN0b3InOiAnMS4yJyxcblxuICAvLyA9PT0gQ3Jvc3NpbmcgTWluaW1pemF0aW9uIC0gTW9zdCBhZ2dyZXNzaXZlID09PVxuICAnZWxrLmxheWVyZWQuY3Jvc3NpbmdNaW5pbWl6YXRpb24uc3RyYXRlZ3knOiAnTEFZRVJfU1dFRVAnLFxuICAnZWxrLmxheWVyZWQuY3Jvc3NpbmdNaW5pbWl6YXRpb24uZ3JlZWR5U3dpdGNoLnR5cGUnOiAnVFdPX1NJREVEJyxcbiAgJ2Vsay5sYXllcmVkLmNyb3NzaW5nTWluaW1pemF0aW9uLmdyZWVkeVN3aXRjaEhpZXJhcmNoaWNhbC50eXBlJzogJ1RXT19TSURFRCcsXG4gICdlbGsubGF5ZXJlZC5jcm9zc2luZ01pbmltaXphdGlvbi5zZW1pSW50ZXJhY3RpdmUnOiAndHJ1ZScsXG4gICdlbGsubGF5ZXJlZC5jcm9zc2luZ01pbmltaXphdGlvbi5oaWVyYXJjaGljYWxTd2VlcGluZXNzJzogJzAuOScsXG5cbiAgLy8gPT09IExheWVyaW5nIFN0cmF0ZWd5IC0gQmVzdCBxdWFsaXR5ID09PVxuICAnZWxrLmxheWVyZWQubGF5ZXJpbmcuc3RyYXRlZ3knOiAnTkVUV09SS19TSU1QTEVYJyxcbiAgJ2Vsay5sYXllcmVkLmxheWVyaW5nLm5ldHdvcmtTaW1wbGV4Lm5vZGVGbGV4aWJpbGl0eSc6ICdOT0RFX1NJWkUnLFxuICAnZWxrLmxheWVyZWQubGF5ZXJpbmcubGF5ZXJDb25zdHJhaW50JzogJ05PTkUnLFxuICAnZWxrLmxheWVyZWQubGF5ZXJpbmcubWluV2lkdGgudXBwZXJCb3VuZE9uV2lkdGgnOiAnNCcsXG5cbiAgLy8gPT09IEN5Y2xlIEJyZWFraW5nID09PVxuICAnZWxrLmxheWVyZWQuY3ljbGVCcmVha2luZy5zdHJhdGVneSc6ICdERVBUSF9GSVJTVCcsXG5cbiAgLy8gPT09IENvbm5lY3RlZCBDb21wb25lbnRzID09PVxuICAnZWxrLnNlcGFyYXRlQ29ubmVjdGVkQ29tcG9uZW50cyc6ICd0cnVlJyxcbiAgJ2Vsay5zcGFjaW5nLmNvbXBvbmVudENvbXBvbmVudCc6ICcxMDAnLFxuXG4gIC8vID09PSBOb2RlIFNpemUgQ29uc3RyYWludHMgPT09XG4gICdlbGsubm9kZVNpemUuY29uc3RyYWludHMnOiAnTk9ERV9MQUJFTFMnLFxuICAnZWxrLm5vZGVTaXplLm9wdGlvbnMnOiAnREVGQVVMVF9NSU5JTVVNX1NJWkUgTUlOSU1VTV9TSVpFX0FDQ09VTlRTX0ZPUl9QQURESU5HJyxcblxuICAvLyA9PT0gRWRnZSBMYWJlbCBQbGFjZW1lbnQgPT09XG4gICdlbGsuZWRnZUxhYmVscy5wbGFjZW1lbnQnOiAnQ0VOVEVSJyxcbiAgJ2Vsay5lZGdlTGFiZWxzLmlubGluZSc6ICd0cnVlJyxcblxuICAvLyA9PT0gQ29tcGFjdGlvbiA9PT1cbiAgJ2Vsay5sYXllcmVkLmNvbXBhY3Rpb24ucG9zdENvbXBhY3Rpb24uc3RyYXRlZ3knOiAnRURHRV9MRU5HVEgnLFxuICAnZWxrLmxheWVyZWQuY29tcGFjdGlvbi5wb3N0Q29tcGFjdGlvbi5jb25zdHJhaW50cyc6ICdFREdFX0xFTkdUSCcsXG5cbiAgLy8gPT09IEhpZ2gtUXVhbGl0eSBNb2RlID09PVxuICAnZWxrLmxheWVyZWQudGhvcm91Z2huZXNzJzogJzEwJyxcbiAgJ2Vsay5sYXllcmVkLndyYXBwaW5nLnN0cmF0ZWd5JzogJ09GRicsXG4gICdlbGsuaGllcmFyY2h5SGFuZGxpbmcnOiAnSU5DTFVERV9DSElMRFJFTicsXG5cbiAgLy8gPT09IEFkZGl0aW9uYWwgT3B0aW1pemF0aW9ucyA9PT1cbiAgJ2Vsay5sYXllcmVkLmZlZWRiYWNrRWRnZXMnOiAndHJ1ZScsXG4gICdlbGsubGF5ZXJlZC5tZXJnZUVkZ2VzJzogJ2ZhbHNlJyxcbiAgJ2Vsay5sYXllcmVkLm1lcmdlSGllcmFyY2h5RWRnZXMnOiAnZmFsc2UnLFxuICAnZWxrLmxheWVyZWQuYWxsb3dOb25GbG93UG9ydHNUb1N3aXRjaFNpZGVzJzogJ2ZhbHNlJyxcbiAgJ2Vsay5sYXllcmVkLm5vcnRoT3JTb3V0aFBvcnQnOiAnZmFsc2UnLFxuICAnZWxrLnBhcnRpdGlvbmluZy5hY3RpdmF0ZSc6ICdmYWxzZScsXG4gICdlbGsuanVuY3Rpb25Qb2ludHMnOiAndHJ1ZScsXG5cbiAgLy8gPT09IENvbnRlbnQgQWxpZ25tZW50ID09PVxuICAnZWxrLmNvbnRlbnRBbGlnbm1lbnQnOiAnVl9UT1AgSF9MRUZUJyxcbiAgJ2Vsay5hbGlnbm1lbnQnOiAnQVVUT01BVElDJyxcbn1cblxuY29uc3QgQ0hJTERfTEFZT1VUX09QVElPTlMgPSB7XG4gICdlbGsuYWxnb3JpdGhtJzogJ2xheWVyZWQnLFxuICAnZWxrLmRpcmVjdGlvbic6ICdSSUdIVCcsXG5cbiAgLy8gPT09IFNwYWNpbmcgLSBIaWdoIHF1YWxpdHkgZm9yIGNoaWxkIG5vZGVzID09PVxuICAnZWxrLmxheWVyZWQuc3BhY2luZy5ub2RlTm9kZUJldHdlZW5MYXllcnMnOiAnODAnLFxuICAnZWxrLnNwYWNpbmcubm9kZU5vZGUnOiAnNjAnLFxuICAnZWxrLnNwYWNpbmcuZWRnZU5vZGUnOiAnNDAnLFxuICAnZWxrLnNwYWNpbmcuZWRnZUVkZ2UnOiAnMjUnLFxuICAnZWxrLnNwYWNpbmcuZWRnZUxhYmVsJzogJzgnLFxuICAnZWxrLnNwYWNpbmcucG9ydFBvcnQnOiAnMTUnLFxuXG4gIC8vID09PSBOb2RlIFBsYWNlbWVudCAtIEJlc3QgcXVhbGl0eSA9PT1cbiAgJ2Vsay5sYXllcmVkLm5vZGVQbGFjZW1lbnQuc3RyYXRlZ3knOiAnTkVUV09SS19TSU1QTEVYJyxcbiAgJ2Vsay5sYXllcmVkLm5vZGVQbGFjZW1lbnQuZmF2b3JTdHJhaWdodEVkZ2VzJzogJ3RydWUnLFxuICAnZWxrLmxheWVyZWQubm9kZVBsYWNlbWVudC5saW5lYXJTZWdtZW50cy5kZWZsZWN0aW9uRGFtcGVuaW5nJzogJzAuNScsXG4gICdlbGsubGF5ZXJlZC5ub2RlUGxhY2VtZW50Lm5ldHdvcmtTaW1wbGV4Lm5vZGVGbGV4aWJpbGl0eSc6ICdOT0RFX1NJWkUnLFxuXG4gIC8vID09PSBFZGdlIFJvdXRpbmcgLSBNYXhpbXVtIHF1YWxpdHkgPT09XG4gICdlbGsuZWRnZVJvdXRpbmcnOiAnU1BMSU5FUycsXG4gICdlbGsubGF5ZXJlZC5lZGdlUm91dGluZy5zbG9wcHlTcGxpbmVSb3V0aW5nJzogJ2ZhbHNlJyxcbiAgJ2Vsay5sYXllcmVkLmVkZ2VSb3V0aW5nLnNwbGluZXMubW9kZSc6ICdDT05TRVJWQVRJVkUnLFxuXG4gIC8vID09PSBDcm9zc2luZyBNaW5pbWl6YXRpb24gLSBBZ2dyZXNzaXZlID09PVxuICAnZWxrLmxheWVyZWQuY3Jvc3NpbmdNaW5pbWl6YXRpb24uc3RyYXRlZ3knOiAnTEFZRVJfU1dFRVAnLFxuICAnZWxrLmxheWVyZWQuY3Jvc3NpbmdNaW5pbWl6YXRpb24uZ3JlZWR5U3dpdGNoLnR5cGUnOiAnVFdPX1NJREVEJyxcbiAgJ2Vsay5sYXllcmVkLmNyb3NzaW5nTWluaW1pemF0aW9uLnNlbWlJbnRlcmFjdGl2ZSc6ICd0cnVlJyxcblxuICAvLyA9PT0gTGF5ZXJpbmcgU3RyYXRlZ3kgPT09XG4gICdlbGsubGF5ZXJlZC5sYXllcmluZy5zdHJhdGVneSc6ICdORVRXT1JLX1NJTVBMRVgnLFxuICAnZWxrLmxheWVyZWQubGF5ZXJpbmcubmV0d29ya1NpbXBsZXgubm9kZUZsZXhpYmlsaXR5JzogJ05PREVfU0laRScsXG5cbiAgLy8gPT09IEN5Y2xlIEJyZWFraW5nID09PVxuICAnZWxrLmxheWVyZWQuY3ljbGVCcmVha2luZy5zdHJhdGVneSc6ICdERVBUSF9GSVJTVCcsXG5cbiAgLy8gPT09IE5vZGUgU2l6ZSA9PT1cbiAgJ2Vsay5ub2RlU2l6ZS5jb25zdHJhaW50cyc6ICdOT0RFX0xBQkVMUycsXG5cbiAgLy8gPT09IENvbXBhY3Rpb24gPT09XG4gICdlbGsubGF5ZXJlZC5jb21wYWN0aW9uLnBvc3RDb21wYWN0aW9uLnN0cmF0ZWd5JzogJ0VER0VfTEVOR1RIJyxcblxuICAvLyA9PT0gSGlnaC1RdWFsaXR5IE1vZGUgPT09XG4gICdlbGsubGF5ZXJlZC50aG9yb3VnaG5lc3MnOiAnMTAnLFxuICAnZWxrLmhpZXJhcmNoeUhhbmRsaW5nJzogJ0lOQ0xVREVfQ0hJTERSRU4nLFxuXG4gIC8vID09PSBBZGRpdGlvbmFsIE9wdGltaXphdGlvbnMgPT09XG4gICdlbGsubGF5ZXJlZC5mZWVkYmFja0VkZ2VzJzogJ3RydWUnLFxuICAnZWxrLmxheWVyZWQubWVyZ2VFZGdlcyc6ICdmYWxzZScsXG4gICdlbGsuanVuY3Rpb25Qb2ludHMnOiAndHJ1ZScsXG59XG5cbnR5cGUgTGF5b3V0SW5mbyA9IHtcbiAgeDogbnVtYmVyXG4gIHk6IG51bWJlclxuICB3aWR0aDogbnVtYmVyXG4gIGhlaWdodDogbnVtYmVyXG4gIGxheWVyPzogbnVtYmVyXG59XG5cbnR5cGUgTGF5b3V0Qm91bmRzID0ge1xuICBtaW5YOiBudW1iZXJcbiAgbWluWTogbnVtYmVyXG4gIG1heFg6IG51bWJlclxuICBtYXhZOiBudW1iZXJcbn1cblxuZXhwb3J0IHR5cGUgTGF5b3V0UmVzdWx0ID0ge1xuICBub2RlczogTWFwPHN0cmluZywgTGF5b3V0SW5mbz5cbiAgYm91bmRzOiBMYXlvdXRCb3VuZHNcbn1cblxuLy8gRUxLIFBvcnQgZGVmaW5pdGlvbiBmb3IgbmF0aXZlIHBvcnQgc3VwcG9ydFxudHlwZSBFbGtQb3J0U2hhcGUgPSB7XG4gIGlkOiBzdHJpbmdcbiAgbGF5b3V0T3B0aW9ucz86IExheW91dE9wdGlvbnNcbn1cblxudHlwZSBFbGtOb2RlU2hhcGUgPSB7XG4gIGlkOiBzdHJpbmdcbiAgd2lkdGg6IG51bWJlclxuICBoZWlnaHQ6IG51bWJlclxuICBwb3J0cz86IEVsa1BvcnRTaGFwZVtdXG4gIGxheW91dE9wdGlvbnM/OiBMYXlvdXRPcHRpb25zXG4gIGNoaWxkcmVuPzogRWxrTm9kZVNoYXBlW11cbn1cblxudHlwZSBFbGtFZGdlU2hhcGUgPSB7XG4gIGlkOiBzdHJpbmdcbiAgc291cmNlczogc3RyaW5nW11cbiAgdGFyZ2V0czogc3RyaW5nW11cbiAgc291cmNlUG9ydD86IHN0cmluZ1xuICB0YXJnZXRQb3J0Pzogc3RyaW5nXG59XG5cbmNvbnN0IHRvRWxrTm9kZSA9IChub2RlOiBOb2RlKTogRWxrTm9kZVNoYXBlID0+ICh7XG4gIGlkOiBub2RlLmlkLFxuICB3aWR0aDogbm9kZS53aWR0aCA/PyBERUZBVUxUX05PREVfV0lEVEgsXG4gIGhlaWdodDogbm9kZS5oZWlnaHQgPz8gREVGQVVMVF9OT0RFX0hFSUdIVCxcbn0pXG5cbmxldCBlZGdlQ291bnRlciA9IDBcbmNvbnN0IG5leHRFZGdlSWQgPSAoKSA9PiBgZWxrLWVkZ2UtJHtlZGdlQ291bnRlcisrfWBcblxuY29uc3QgY3JlYXRlRWRnZSA9IChcbiAgc291cmNlOiBzdHJpbmcsXG4gIHRhcmdldDogc3RyaW5nLFxuICBzb3VyY2VQb3J0Pzogc3RyaW5nLFxuICB0YXJnZXRQb3J0Pzogc3RyaW5nLFxuKTogRWxrRWRnZVNoYXBlID0+ICh7XG4gIGlkOiBuZXh0RWRnZUlkKCksXG4gIHNvdXJjZXM6IFtzb3VyY2VdLFxuICB0YXJnZXRzOiBbdGFyZ2V0XSxcbiAgc291cmNlUG9ydCxcbiAgdGFyZ2V0UG9ydCxcbn0pXG5cbmNvbnN0IGNvbGxlY3RMYXlvdXQgPSAoZ3JhcGg6IEVsa05vZGUsIHByZWRpY2F0ZTogKGlkOiBzdHJpbmcpID0+IGJvb2xlYW4pOiBMYXlvdXRSZXN1bHQgPT4ge1xuICBjb25zdCByZXN1bHQgPSBuZXcgTWFwPHN0cmluZywgTGF5b3V0SW5mbz4oKVxuICBsZXQgbWluWCA9IEluZmluaXR5XG4gIGxldCBtaW5ZID0gSW5maW5pdHlcbiAgbGV0IG1heFggPSAtSW5maW5pdHlcbiAgbGV0IG1heFkgPSAtSW5maW5pdHlcblxuICBjb25zdCB2aXNpdCA9IChub2RlOiBFbGtOb2RlKSA9PiB7XG4gICAgbm9kZS5jaGlsZHJlbj8uZm9yRWFjaCgoY2hpbGQ6IEVsa05vZGUpID0+IHtcbiAgICAgIGlmIChwcmVkaWNhdGUoY2hpbGQuaWQpKSB7XG4gICAgICAgIGNvbnN0IHggPSBjaGlsZC54ID8/IDBcbiAgICAgICAgY29uc3QgeSA9IGNoaWxkLnkgPz8gMFxuICAgICAgICBjb25zdCB3aWR0aCA9IGNoaWxkLndpZHRoID8/IERFRkFVTFRfTk9ERV9XSURUSFxuICAgICAgICBjb25zdCBoZWlnaHQgPSBjaGlsZC5oZWlnaHQgPz8gREVGQVVMVF9OT0RFX0hFSUdIVFxuICAgICAgICBjb25zdCBsYXllciA9IGNoaWxkPy5sYXlvdXRPcHRpb25zPy5bJ29yZy5lY2xpcHNlLmVsay5sYXllcmVkLmxheWVySW5kZXgnXVxuXG4gICAgICAgIHJlc3VsdC5zZXQoY2hpbGQuaWQsIHtcbiAgICAgICAgICB4LFxuICAgICAgICAgIHksXG4gICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIGxheWVyOiBsYXllciA/IE51bWJlci5wYXJzZUludChsYXllcikgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIHgpXG4gICAgICAgIG1pblkgPSBNYXRoLm1pbihtaW5ZLCB5KVxuICAgICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgeCArIHdpZHRoKVxuICAgICAgICBtYXhZID0gTWF0aC5tYXgobWF4WSwgeSArIGhlaWdodClcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuPy5sZW5ndGgpXG4gICAgICAgIHZpc2l0KGNoaWxkKVxuICAgIH0pXG4gIH1cblxuICB2aXNpdChncmFwaClcblxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShtaW5YKSB8fCAhTnVtYmVyLmlzRmluaXRlKG1pblkpKSB7XG4gICAgbWluWCA9IDBcbiAgICBtaW5ZID0gMFxuICAgIG1heFggPSAwXG4gICAgbWF4WSA9IDBcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbm9kZXM6IHJlc3VsdCxcbiAgICBib3VuZHM6IHtcbiAgICAgIG1pblgsXG4gICAgICBtaW5ZLFxuICAgICAgbWF4WCxcbiAgICAgIG1heFksXG4gICAgfSxcbiAgfVxufVxuXG4vKipcbiAqIEJ1aWxkIElmL0Vsc2Ugbm9kZSB3aXRoIEVMSyBuYXRpdmUgUG9ydHMgaW5zdGVhZCBvZiBkdW1teSBub2Rlc1xuICogVGhpcyBpcyB0aGUgcmVjb21tZW5kZWQgYXBwcm9hY2ggZm9yIGhhbmRsaW5nIG11bHRpcGxlIGJyYW5jaGVzXG4gKi9cbmNvbnN0IGJ1aWxkSWZFbHNlV2l0aFBvcnRzID0gKFxuICBpZkVsc2VOb2RlOiBOb2RlLFxuICBlZGdlczogRWRnZVtdLFxuKTogeyBub2RlOiBFbGtOb2RlU2hhcGUsIHBvcnRNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gfSB8IG51bGwgPT4ge1xuICBjb25zdCBjaGlsZEVkZ2VzID0gZWRnZXMuZmlsdGVyKGVkZ2UgPT4gZWRnZS5zb3VyY2UgPT09IGlmRWxzZU5vZGUuaWQpXG5cbiAgaWYgKGNoaWxkRWRnZXMubGVuZ3RoIDw9IDEpXG4gICAgcmV0dXJuIG51bGxcblxuICAvLyBTb3J0IGNoaWxkIGVkZ2VzIGFjY29yZGluZyB0byBjYXNlIG9yZGVyXG4gIGNvbnN0IHNvcnRlZENoaWxkRWRnZXMgPSBbLi4uY2hpbGRFZGdlc10uc29ydCgoZWRnZUEsIGVkZ2VCKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlQSA9IGVkZ2VBLnNvdXJjZUhhbmRsZVxuICAgIGNvbnN0IGhhbmRsZUIgPSBlZGdlQi5zb3VyY2VIYW5kbGVcblxuICAgIGlmIChoYW5kbGVBICYmIGhhbmRsZUIpIHtcbiAgICAgIGNvbnN0IGNhc2VzID0gKGlmRWxzZU5vZGUuZGF0YSBhcyBJZkVsc2VOb2RlVHlwZSkuY2FzZXMgfHwgW11cbiAgICAgIGNvbnN0IGlzQUVsc2UgPSBoYW5kbGVBID09PSAnZmFsc2UnXG4gICAgICBjb25zdCBpc0JFbHNlID0gaGFuZGxlQiA9PT0gJ2ZhbHNlJ1xuXG4gICAgICBpZiAoaXNBRWxzZSlcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgIGlmIChpc0JFbHNlKVxuICAgICAgICByZXR1cm4gLTFcblxuICAgICAgY29uc3QgaW5kZXhBID0gY2FzZXMuZmluZEluZGV4KChjOiBDYXNlSXRlbSkgPT4gYy5jYXNlX2lkID09PSBoYW5kbGVBKVxuICAgICAgY29uc3QgaW5kZXhCID0gY2FzZXMuZmluZEluZGV4KChjOiBDYXNlSXRlbSkgPT4gYy5jYXNlX2lkID09PSBoYW5kbGVCKVxuXG4gICAgICBpZiAoaW5kZXhBICE9PSAtMSAmJiBpbmRleEIgIT09IC0xKVxuICAgICAgICByZXR1cm4gaW5kZXhBIC0gaW5kZXhCXG4gICAgfVxuXG4gICAgcmV0dXJuIDBcbiAgfSlcblxuICAvLyBDcmVhdGUgRUxLIHBvcnRzIGZvciBlYWNoIGJyYW5jaFxuICBjb25zdCBwb3J0czogRWxrUG9ydFNoYXBlW10gPSBzb3J0ZWRDaGlsZEVkZ2VzLm1hcCgoZWRnZSwgaW5kZXgpID0+ICh7XG4gICAgaWQ6IGAke2lmRWxzZU5vZGUuaWR9LXBvcnQtJHtlZGdlLnNvdXJjZUhhbmRsZSB8fCBpbmRleH1gLFxuICAgIGxheW91dE9wdGlvbnM6IHtcbiAgICAgICdwb3J0LnNpZGUnOiAnRUFTVCcsIC8vIFBvcnRzIG9uIHRoZSByaWdodCBzaWRlIChtYXRjaGluZyAnUklHSFQnIGRpcmVjdGlvbilcbiAgICAgICdwb3J0LmluZGV4JzogU3RyaW5nKGluZGV4KSxcbiAgICB9LFxuICB9KSlcblxuICAvLyBCdWlsZCBwb3J0IG1hcHBpbmc6IHNvdXJjZUhhbmRsZSAtPiBwb3J0SWRcbiAgY29uc3QgcG9ydE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KClcbiAgc29ydGVkQ2hpbGRFZGdlcy5mb3JFYWNoKChlZGdlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHBvcnRJZCA9IGAke2lmRWxzZU5vZGUuaWR9LXBvcnQtJHtlZGdlLnNvdXJjZUhhbmRsZSB8fCBpbmRleH1gXG4gICAgcG9ydE1hcC5zZXQoZWRnZS5pZCwgcG9ydElkKVxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgbm9kZToge1xuICAgICAgaWQ6IGlmRWxzZU5vZGUuaWQsXG4gICAgICB3aWR0aDogaWZFbHNlTm9kZS53aWR0aCA/PyBERUZBVUxUX05PREVfV0lEVEgsXG4gICAgICBoZWlnaHQ6IGlmRWxzZU5vZGUuaGVpZ2h0ID8/IERFRkFVTFRfTk9ERV9IRUlHSFQsXG4gICAgICBwb3J0cyxcbiAgICAgIGxheW91dE9wdGlvbnM6IHtcbiAgICAgICAgJ2Vsay5wb3J0Q29uc3RyYWludHMnOiAnRklYRURfT1JERVInLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBvcnRNYXAsXG4gIH1cbn1cblxuY29uc3Qgbm9ybWFsaXNlQm91bmRzID0gKGxheW91dDogTGF5b3V0UmVzdWx0KTogTGF5b3V0UmVzdWx0ID0+IHtcbiAgY29uc3Qge1xuICAgIG5vZGVzLFxuICAgIGJvdW5kcyxcbiAgfSA9IGxheW91dFxuXG4gIGlmIChub2Rlcy5zaXplID09PSAwKVxuICAgIHJldHVybiBsYXlvdXRcblxuICBjb25zdCBvZmZzZXRYID0gYm91bmRzLm1pblhcbiAgY29uc3Qgb2Zmc2V0WSA9IGJvdW5kcy5taW5ZXG5cbiAgY29uc3QgYWRqdXN0ZWROb2RlcyA9IG5ldyBNYXA8c3RyaW5nLCBMYXlvdXRJbmZvPigpXG4gIG5vZGVzLmZvckVhY2goKGluZm8sIGlkKSA9PiB7XG4gICAgYWRqdXN0ZWROb2Rlcy5zZXQoaWQsIHtcbiAgICAgIC4uLmluZm8sXG4gICAgICB4OiBpbmZvLnggLSBvZmZzZXRYLFxuICAgICAgeTogaW5mby55IC0gb2Zmc2V0WSxcbiAgICB9KVxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgbm9kZXM6IGFkanVzdGVkTm9kZXMsXG4gICAgYm91bmRzOiB7XG4gICAgICBtaW5YOiAwLFxuICAgICAgbWluWTogMCxcbiAgICAgIG1heFg6IGJvdW5kcy5tYXhYIC0gb2Zmc2V0WCxcbiAgICAgIG1heFk6IGJvdW5kcy5tYXhZIC0gb2Zmc2V0WSxcbiAgICB9LFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRMYXlvdXRCeURhZ3JlID0gYXN5bmMgKG9yaWdpbk5vZGVzOiBOb2RlW10sIG9yaWdpbkVkZ2VzOiBFZGdlW10pOiBQcm9taXNlPExheW91dFJlc3VsdD4gPT4ge1xuICBlZGdlQ291bnRlciA9IDBcbiAgY29uc3Qgbm9kZXMgPSBjbG9uZURlZXAob3JpZ2luTm9kZXMpLmZpbHRlcihub2RlID0+ICFub2RlLnBhcmVudElkICYmIG5vZGUudHlwZSA9PT0gQ1VTVE9NX05PREUpXG4gIGNvbnN0IGVkZ2VzID0gY2xvbmVEZWVwKG9yaWdpbkVkZ2VzKS5maWx0ZXIoZWRnZSA9PiAoIWVkZ2UuZGF0YT8uaXNJbkl0ZXJhdGlvbiAmJiAhZWRnZS5kYXRhPy5pc0luTG9vcCkpXG5cbiAgY29uc3QgZWxrTm9kZXM6IEVsa05vZGVTaGFwZVtdID0gW11cbiAgY29uc3QgZWxrRWRnZXM6IEVsa0VkZ2VTaGFwZVtdID0gW11cblxuICAvLyBUcmFjayB3aGljaCBlZGdlcyBoYXZlIGJlZW4gcHJvY2Vzc2VkIGZvciBJZi9FbHNlIG5vZGVzIHdpdGggcG9ydHNcbiAgY29uc3QgZWRnZVRvUG9ydE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KClcblxuICAvLyBCdWlsZCBub2RlcyB3aXRoIHBvcnRzIGZvciBJZi9FbHNlIG5vZGVzXG4gIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICBpZiAobm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5JZkVsc2UpIHtcbiAgICAgIGNvbnN0IHBvcnRzUmVzdWx0ID0gYnVpbGRJZkVsc2VXaXRoUG9ydHMobm9kZSwgZWRnZXMpXG4gICAgICBpZiAocG9ydHNSZXN1bHQpIHtcbiAgICAgICAgLy8gVXNlIG5vZGUgd2l0aCBwb3J0c1xuICAgICAgICBlbGtOb2Rlcy5wdXNoKHBvcnRzUmVzdWx0Lm5vZGUpXG4gICAgICAgIC8vIFN0b3JlIHBvcnQgbWFwcGluZ3MgZm9yIGVkZ2VzXG4gICAgICAgIHBvcnRzUmVzdWx0LnBvcnRNYXAuZm9yRWFjaCgocG9ydElkLCBlZGdlSWQpID0+IHtcbiAgICAgICAgICBlZGdlVG9Qb3J0TWFwLnNldChlZGdlSWQsIHBvcnRJZClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBObyBtdWx0aXBsZSBicmFuY2hlcywgdXNlIG5vcm1hbCBub2RlXG4gICAgICAgIGVsa05vZGVzLnB1c2godG9FbGtOb2RlKG5vZGUpKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsa05vZGVzLnB1c2godG9FbGtOb2RlKG5vZGUpKVxuICAgIH1cbiAgfSlcblxuICAvLyBCdWlsZCBlZGdlcyB3aXRoIHBvcnQgY29ubmVjdGlvbnNcbiAgZWRnZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgIGNvbnN0IHNvdXJjZVBvcnQgPSBlZGdlVG9Qb3J0TWFwLmdldChlZGdlLmlkKVxuICAgIGVsa0VkZ2VzLnB1c2goY3JlYXRlRWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQsIHNvdXJjZVBvcnQpKVxuICB9KVxuXG4gIGNvbnN0IGdyYXBoID0ge1xuICAgIGlkOiAnd29ya2Zsb3ctcm9vdCcsXG4gICAgbGF5b3V0T3B0aW9uczogUk9PVF9MQVlPVVRfT1BUSU9OUyxcbiAgICBjaGlsZHJlbjogZWxrTm9kZXMsXG4gICAgZWRnZXM6IGVsa0VkZ2VzLFxuICB9XG5cbiAgY29uc3QgbGF5b3V0ZWRHcmFwaCA9IGF3YWl0IGVsay5sYXlvdXQoZ3JhcGgpXG4gIC8vIE5vIG5lZWQgdG8gZmlsdGVyIGR1bW15IG5vZGVzIGFueW1vcmUsIGFzIHdlJ3JlIHVzaW5nIHBvcnRzXG4gIGNvbnN0IGxheW91dCA9IGNvbGxlY3RMYXlvdXQobGF5b3V0ZWRHcmFwaCwgKCkgPT4gdHJ1ZSlcbiAgcmV0dXJuIG5vcm1hbGlzZUJvdW5kcyhsYXlvdXQpXG59XG5cbmNvbnN0IG5vcm1hbGlzZUNoaWxkTGF5b3V0ID0gKFxuICBsYXlvdXQ6IExheW91dFJlc3VsdCxcbiAgbm9kZXM6IE5vZGVbXSxcbik6IExheW91dFJlc3VsdCA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXA8c3RyaW5nLCBMYXlvdXRJbmZvPigpXG4gIGxheW91dC5ub2Rlcy5mb3JFYWNoKChpbmZvLCBpZCkgPT4ge1xuICAgIHJlc3VsdC5zZXQoaWQsIGluZm8pXG4gIH0pXG5cbiAgLy8gRW5zdXJlIGl0ZXJhdGlvbiAvIGxvb3Agc3RhcnQgbm9kZXMgZG8gbm90IGNvbGxhcHNlIGludG8gdGhlIGNoaWxkcmVuLlxuICBjb25zdCBzdGFydE5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT5cbiAgICBub2RlLnR5cGUgPT09IENVU1RPTV9JVEVSQVRJT05fU1RBUlRfTk9ERVxuICAgIHx8IG5vZGUudHlwZSA9PT0gQ1VTVE9NX0xPT1BfU1RBUlRfTk9ERVxuICAgIHx8IG5vZGUuZGF0YT8udHlwZSA9PT0gQmxvY2tFbnVtLkxvb3BTdGFydFxuICAgIHx8IG5vZGUuZGF0YT8udHlwZSA9PT0gQmxvY2tFbnVtLkl0ZXJhdGlvblN0YXJ0LFxuICApXG5cbiAgaWYgKHN0YXJ0Tm9kZSkge1xuICAgIGNvbnN0IHN0YXJ0TGF5b3V0ID0gcmVzdWx0LmdldChzdGFydE5vZGUuaWQpXG5cbiAgICBpZiAoc3RhcnRMYXlvdXQpIHtcbiAgICAgIGNvbnN0IGRlc2lyZWRNaW5YID0gTk9ERV9MQVlPVVRfSE9SSVpPTlRBTF9QQURESU5HIC8gMS41XG4gICAgICBpZiAoc3RhcnRMYXlvdXQueCA+IGRlc2lyZWRNaW5YKSB7XG4gICAgICAgIGNvbnN0IHNoaWZ0WCA9IHN0YXJ0TGF5b3V0LnggLSBkZXNpcmVkTWluWFxuICAgICAgICByZXN1bHQuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgIHJlc3VsdC5zZXQoa2V5LCB7XG4gICAgICAgICAgICAuLi52YWx1ZSxcbiAgICAgICAgICAgIHg6IHZhbHVlLnggLSBzaGlmdFgsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVzaXJlZE1pblkgPSBzdGFydExheW91dC55XG4gICAgICBjb25zdCBkZWx0YVkgPSBOT0RFX0xBWU9VVF9WRVJUSUNBTF9QQURESU5HIC8gMlxuICAgICAgcmVzdWx0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgcmVzdWx0LnNldChrZXksIHtcbiAgICAgICAgICAuLi52YWx1ZSxcbiAgICAgICAgICB5OiB2YWx1ZS55IC0gZGVzaXJlZE1pblkgKyBkZWx0YVksXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGxldCBtaW5YID0gSW5maW5pdHlcbiAgbGV0IG1pblkgPSBJbmZpbml0eVxuICBsZXQgbWF4WCA9IC1JbmZpbml0eVxuICBsZXQgbWF4WSA9IC1JbmZpbml0eVxuXG4gIHJlc3VsdC5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgIG1pblggPSBNYXRoLm1pbihtaW5YLCB2YWx1ZS54KVxuICAgIG1pblkgPSBNYXRoLm1pbihtaW5ZLCB2YWx1ZS55KVxuICAgIG1heFggPSBNYXRoLm1heChtYXhYLCB2YWx1ZS54ICsgdmFsdWUud2lkdGgpXG4gICAgbWF4WSA9IE1hdGgubWF4KG1heFksIHZhbHVlLnkgKyB2YWx1ZS5oZWlnaHQpXG4gIH0pXG5cbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobWluWCkgfHwgIU51bWJlci5pc0Zpbml0ZShtaW5ZKSlcbiAgICByZXR1cm4gbGF5b3V0XG5cbiAgcmV0dXJuIG5vcm1hbGlzZUJvdW5kcyh7XG4gICAgbm9kZXM6IHJlc3VsdCxcbiAgICBib3VuZHM6IHtcbiAgICAgIG1pblgsXG4gICAgICBtaW5ZLFxuICAgICAgbWF4WCxcbiAgICAgIG1heFksXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGdldExheW91dEZvckNoaWxkTm9kZXMgPSBhc3luYyAoXG4gIHBhcmVudE5vZGVJZDogc3RyaW5nLFxuICBvcmlnaW5Ob2RlczogTm9kZVtdLFxuICBvcmlnaW5FZGdlczogRWRnZVtdLFxuKTogUHJvbWlzZTxMYXlvdXRSZXN1bHQgfCBudWxsPiA9PiB7XG4gIGVkZ2VDb3VudGVyID0gMFxuICBjb25zdCBub2RlcyA9IGNsb25lRGVlcChvcmlnaW5Ob2RlcykuZmlsdGVyKG5vZGUgPT4gbm9kZS5wYXJlbnRJZCA9PT0gcGFyZW50Tm9kZUlkKVxuICBpZiAoIW5vZGVzLmxlbmd0aClcbiAgICByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IGVkZ2VzID0gY2xvbmVEZWVwKG9yaWdpbkVkZ2VzKS5maWx0ZXIoZWRnZSA9PlxuICAgIChlZGdlLmRhdGE/LmlzSW5JdGVyYXRpb24gJiYgZWRnZS5kYXRhPy5pdGVyYXRpb25faWQgPT09IHBhcmVudE5vZGVJZClcbiAgICB8fCAoZWRnZS5kYXRhPy5pc0luTG9vcCAmJiBlZGdlLmRhdGE/Lmxvb3BfaWQgPT09IHBhcmVudE5vZGVJZCksXG4gIClcblxuICBjb25zdCBlbGtOb2RlczogRWxrTm9kZVNoYXBlW10gPSBub2Rlcy5tYXAodG9FbGtOb2RlKVxuICBjb25zdCBlbGtFZGdlczogRWxrRWRnZVNoYXBlW10gPSBlZGdlcy5tYXAoZWRnZSA9PiBjcmVhdGVFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCkpXG5cbiAgY29uc3QgZ3JhcGggPSB7XG4gICAgaWQ6IHBhcmVudE5vZGVJZCxcbiAgICBsYXlvdXRPcHRpb25zOiBDSElMRF9MQVlPVVRfT1BUSU9OUyxcbiAgICBjaGlsZHJlbjogZWxrTm9kZXMsXG4gICAgZWRnZXM6IGVsa0VkZ2VzLFxuICB9XG5cbiAgY29uc3QgbGF5b3V0ZWRHcmFwaCA9IGF3YWl0IGVsay5sYXlvdXQoZ3JhcGgpXG4gIGNvbnN0IGxheW91dCA9IGNvbGxlY3RMYXlvdXQobGF5b3V0ZWRHcmFwaCwgKCkgPT4gdHJ1ZSlcbiAgcmV0dXJuIG5vcm1hbGlzZUNoaWxkTGF5b3V0KGxheW91dCwgbm9kZXMpXG59XG4iXX0=