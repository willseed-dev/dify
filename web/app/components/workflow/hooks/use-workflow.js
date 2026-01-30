"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsNodeInLoop = exports.useIsNodeInIteration = exports.useNodesReadOnly = exports.useWorkflowReadOnly = exports.useWorkflow = exports.useIsChatMode = void 0;
const compat_1 = require("es-toolkit/compat");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const store_1 = require("@/app/components/app/store");
const constants_1 = require("@/app/components/workflow/nodes/iteration-start/constants");
const constants_2 = require("@/app/components/workflow/nodes/loop-start/constants");
const app_1 = require("@/types/app");
const _1 = require(".");
const constants_3 = require("../constants");
const utils_1 = require("../nodes/_base/components/variable/utils");
const constants_4 = require("../note-node/constants");
const store_2 = require("../store");
const types_1 = require("../types");
const workflow_entry_1 = require("../utils/workflow-entry");
const use_available_blocks_1 = require("./use-available-blocks");
const useIsChatMode = () => {
    const appDetail = (0, store_1.useStore)(s => s.appDetail);
    return appDetail?.mode === app_1.AppModeEnum.ADVANCED_CHAT;
};
exports.useIsChatMode = useIsChatMode;
const useWorkflow = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const { getAvailableBlocks } = (0, use_available_blocks_1.useAvailableBlocks)();
    const { nodesMap } = (0, _1.useNodesMetaData)();
    const getNodeById = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, } = store.getState();
        const nodes = getNodes();
        const currentNode = nodes.find(node => node.id === nodeId);
        return currentNode;
    }, [store]);
    const getTreeLeafNodes = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, edges, } = store.getState();
        const nodes = getNodes();
        // let startNode = getWorkflowEntryNode(nodes)
        const currentNode = nodes.find(node => node.id === nodeId);
        let startNodes = nodes.filter(node => nodesMap?.[node.data.type]?.metaData.isStart) || [];
        if (currentNode?.parentId) {
            const startNode = nodes.find(node => node.parentId === currentNode.parentId && (node.type === constants_1.CUSTOM_ITERATION_START_NODE || node.type === constants_2.CUSTOM_LOOP_START_NODE));
            if (startNode)
                startNodes = [startNode];
        }
        if (!startNodes.length)
            return [];
        const list = [];
        const preOrder = (root, callback) => {
            if (root.id === nodeId)
                return;
            const outgoers = (0, reactflow_1.getOutgoers)(root, nodes, edges);
            if (outgoers.length) {
                outgoers.forEach((outgoer) => {
                    preOrder(outgoer, callback);
                });
            }
            else {
                if (root.id !== nodeId)
                    callback(root);
            }
        };
        startNodes.forEach((startNode) => {
            preOrder(startNode, (node) => {
                list.push(node);
            });
        });
        const incomers = (0, reactflow_1.getIncomers)({ id: nodeId }, nodes, edges);
        list.push(...incomers);
        return (0, compat_1.uniqBy)(list, 'id').filter((item) => {
            return constants_3.SUPPORT_OUTPUT_VARS_NODE.includes(item.data.type);
        });
    }, [store, nodesMap]);
    const getBeforeNodesInSameBranch = (0, react_1.useCallback)((nodeId, newNodes, newEdges) => {
        const { getNodes, edges, } = store.getState();
        const nodes = newNodes || getNodes();
        const currentNode = nodes.find(node => node.id === nodeId);
        const list = [];
        if (!currentNode)
            return list;
        if (currentNode.parentId) {
            const parentNode = nodes.find(node => node.id === currentNode.parentId);
            if (parentNode) {
                const parentList = getBeforeNodesInSameBranch(parentNode.id);
                list.push(...parentList);
            }
        }
        const traverse = (root, callback) => {
            if (root) {
                const incomers = (0, reactflow_1.getIncomers)(root, nodes, newEdges || edges);
                if (incomers.length) {
                    incomers.forEach((node) => {
                        if (!list.find(n => node.id === n.id)) {
                            callback(node);
                            traverse(node, callback);
                        }
                    });
                }
            }
        };
        traverse(currentNode, (node) => {
            list.push(node);
        });
        const length = list.length;
        if (length) {
            return (0, compat_1.uniqBy)(list, 'id').reverse().filter((item) => {
                return constants_3.SUPPORT_OUTPUT_VARS_NODE.includes(item.data.type);
            });
        }
        return [];
    }, [store]);
    const getBeforeNodesInSameBranchIncludeParent = (0, react_1.useCallback)((nodeId, newNodes, newEdges) => {
        const nodes = getBeforeNodesInSameBranch(nodeId, newNodes, newEdges);
        const { getNodes, } = store.getState();
        const allNodes = getNodes();
        const node = allNodes.find(n => n.id === nodeId);
        const parentNodeId = node?.parentId;
        const parentNode = allNodes.find(n => n.id === parentNodeId);
        if (parentNode)
            nodes.push(parentNode);
        return nodes;
    }, [getBeforeNodesInSameBranch, store]);
    const getAfterNodesInSameBranch = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, edges, } = store.getState();
        const nodes = getNodes();
        const currentNode = nodes.find(node => node.id === nodeId);
        if (!currentNode)
            return [];
        const list = [currentNode];
        const traverse = (root, callback) => {
            if (root) {
                const outgoers = (0, reactflow_1.getOutgoers)(root, nodes, edges);
                if (outgoers.length) {
                    outgoers.forEach((node) => {
                        callback(node);
                        traverse(node, callback);
                    });
                }
            }
        };
        traverse(currentNode, (node) => {
            list.push(node);
        });
        return (0, compat_1.uniqBy)(list, 'id');
    }, [store]);
    const getBeforeNodeById = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, edges, } = store.getState();
        const nodes = getNodes();
        const node = nodes.find(node => node.id === nodeId);
        return (0, reactflow_1.getIncomers)(node, nodes, edges);
    }, [store]);
    const getIterationNodeChildren = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, } = store.getState();
        const nodes = getNodes();
        return nodes.filter(node => node.parentId === nodeId);
    }, [store]);
    const getLoopNodeChildren = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, } = store.getState();
        const nodes = getNodes();
        return nodes.filter(node => node.parentId === nodeId);
    }, [store]);
    const isFromStartNode = (0, react_1.useCallback)((nodeId) => {
        const { getNodes } = store.getState();
        const nodes = getNodes();
        const currentNode = nodes.find(node => node.id === nodeId);
        if (!currentNode)
            return false;
        if ((0, workflow_entry_1.isWorkflowEntryNode)(currentNode.data.type))
            return true;
        const checkPreviousNodes = (node) => {
            const previousNodes = getBeforeNodeById(node.id);
            for (const prevNode of previousNodes) {
                if ((0, workflow_entry_1.isWorkflowEntryNode)(prevNode.data.type))
                    return true;
                if (checkPreviousNodes(prevNode))
                    return true;
            }
            return false;
        };
        return checkPreviousNodes(currentNode);
    }, [store, getBeforeNodeById]);
    const handleOutVarRenameChange = (0, react_1.useCallback)((nodeId, oldValeSelector, newVarSelector) => {
        const { getNodes, setNodes } = store.getState();
        const allNodes = getNodes();
        const affectedNodes = (0, utils_1.findUsedVarNodes)(oldValeSelector, allNodes);
        if (affectedNodes.length > 0) {
            const newNodes = allNodes.map((node) => {
                if (affectedNodes.find(n => n.id === node.id))
                    return (0, utils_1.updateNodeVars)(node, oldValeSelector, newVarSelector);
                return node;
            });
            setNodes(newNodes);
        }
    }, [store]);
    const isVarUsedInNodes = (0, react_1.useCallback)((varSelector) => {
        const nodeId = varSelector[0];
        const afterNodes = getAfterNodesInSameBranch(nodeId);
        const effectNodes = (0, utils_1.findUsedVarNodes)(varSelector, afterNodes);
        return effectNodes.length > 0;
    }, [getAfterNodesInSameBranch]);
    const removeUsedVarInNodes = (0, react_1.useCallback)((varSelector) => {
        const nodeId = varSelector[0];
        const { getNodes, setNodes } = store.getState();
        const afterNodes = getAfterNodesInSameBranch(nodeId);
        const effectNodes = (0, utils_1.findUsedVarNodes)(varSelector, afterNodes);
        if (effectNodes.length > 0) {
            const newNodes = getNodes().map((node) => {
                if (effectNodes.find(n => n.id === node.id))
                    return (0, utils_1.updateNodeVars)(node, varSelector, []);
                return node;
            });
            setNodes(newNodes);
        }
    }, [getAfterNodesInSameBranch, store]);
    const isNodeVarsUsedInNodes = (0, react_1.useCallback)((node, isChatMode) => {
        const outputVars = (0, utils_1.getNodeOutputVars)(node, isChatMode);
        const isUsed = outputVars.some((varSelector) => {
            return isVarUsedInNodes(varSelector);
        });
        return isUsed;
    }, [isVarUsedInNodes]);
    const getRootNodesById = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, edges, } = store.getState();
        const nodes = getNodes();
        const currentNode = nodes.find(node => node.id === nodeId);
        const rootNodes = [];
        if (!currentNode)
            return rootNodes;
        if (currentNode.parentId) {
            const parentNode = nodes.find(node => node.id === currentNode.parentId);
            if (parentNode) {
                const parentList = getRootNodesById(parentNode.id);
                rootNodes.push(...parentList);
            }
        }
        const traverse = (root, callback) => {
            if (root) {
                const incomers = (0, reactflow_1.getIncomers)(root, nodes, edges);
                if (incomers.length) {
                    incomers.forEach((node) => {
                        traverse(node, callback);
                    });
                }
                else {
                    callback(root);
                }
            }
        };
        traverse(currentNode, (node) => {
            rootNodes.push(node);
        });
        const length = rootNodes.length;
        if (length)
            return (0, compat_1.uniqBy)(rootNodes, 'id');
        return [];
    }, [store]);
    const getStartNodes = (0, react_1.useCallback)((nodes, currentNode) => {
        const { id, parentId } = currentNode || {};
        let startNodes = [];
        if (parentId) {
            const parentNode = nodes.find(node => node.id === parentId);
            if (!parentNode)
                throw new Error('Parent node not found');
            const startNode = nodes.find(node => node.id === parentNode.data.start_node_id);
            if (startNode)
                startNodes = [startNode];
        }
        else {
            startNodes = nodes.filter(node => nodesMap?.[node.data.type]?.metaData.isStart) || [];
        }
        if (!startNodes.length)
            startNodes = getRootNodesById(id || '');
        return startNodes;
    }, [nodesMap, getRootNodesById]);
    const isValidConnection = (0, react_1.useCallback)(({ source, sourceHandle: _sourceHandle, target }) => {
        const { edges, getNodes, } = store.getState();
        const nodes = getNodes();
        const sourceNode = nodes.find(node => node.id === source);
        const targetNode = nodes.find(node => node.id === target);
        if (sourceNode.type === constants_4.CUSTOM_NOTE_NODE || targetNode.type === constants_4.CUSTOM_NOTE_NODE)
            return false;
        if (sourceNode.parentId !== targetNode.parentId)
            return false;
        if (sourceNode && targetNode) {
            const sourceNodeAvailableNextNodes = getAvailableBlocks(sourceNode.data.type, !!sourceNode.parentId).availableNextBlocks;
            const targetNodeAvailablePrevNodes = getAvailableBlocks(targetNode.data.type, !!targetNode.parentId).availablePrevBlocks;
            if (!sourceNodeAvailableNextNodes.includes(targetNode.data.type))
                return false;
            if (!targetNodeAvailablePrevNodes.includes(sourceNode.data.type))
                return false;
        }
        const hasCycle = (node, visited = new Set()) => {
            if (visited.has(node.id))
                return false;
            visited.add(node.id);
            for (const outgoer of (0, reactflow_1.getOutgoers)(node, nodes, edges)) {
                if (outgoer.id === source)
                    return true;
                if (hasCycle(outgoer, visited))
                    return true;
            }
        };
        return !hasCycle(targetNode);
    }, [store, getAvailableBlocks]);
    const getNode = (0, react_1.useCallback)((nodeId) => {
        const { getNodes } = store.getState();
        const nodes = getNodes();
        return nodes.find(node => node.id === nodeId) || (0, workflow_entry_1.getWorkflowEntryNode)(nodes);
    }, [store]);
    return {
        getNodeById,
        getTreeLeafNodes,
        getBeforeNodesInSameBranch,
        getBeforeNodesInSameBranchIncludeParent,
        getAfterNodesInSameBranch,
        handleOutVarRenameChange,
        isVarUsedInNodes,
        removeUsedVarInNodes,
        isNodeVarsUsedInNodes,
        isValidConnection,
        getBeforeNodeById,
        getIterationNodeChildren,
        getLoopNodeChildren,
        getRootNodesById,
        getStartNodes,
        isFromStartNode,
        getNode,
    };
};
exports.useWorkflow = useWorkflow;
const useWorkflowReadOnly = () => {
    const workflowStore = (0, store_2.useWorkflowStore)();
    const workflowRunningData = (0, store_2.useStore)(s => s.workflowRunningData);
    const getWorkflowReadOnly = (0, react_1.useCallback)(() => {
        return workflowStore.getState().workflowRunningData?.result.status === types_1.WorkflowRunningStatus.Running;
    }, [workflowStore]);
    return {
        workflowReadOnly: workflowRunningData?.result.status === types_1.WorkflowRunningStatus.Running,
        getWorkflowReadOnly,
    };
};
exports.useWorkflowReadOnly = useWorkflowReadOnly;
const useNodesReadOnly = () => {
    const workflowStore = (0, store_2.useWorkflowStore)();
    const workflowRunningData = (0, store_2.useStore)(s => s.workflowRunningData);
    const historyWorkflowData = (0, store_2.useStore)(s => s.historyWorkflowData);
    const isRestoring = (0, store_2.useStore)(s => s.isRestoring);
    const getNodesReadOnly = (0, react_1.useCallback)(() => {
        const { workflowRunningData, historyWorkflowData, isRestoring, } = workflowStore.getState();
        return !!(workflowRunningData?.result.status === types_1.WorkflowRunningStatus.Running || historyWorkflowData || isRestoring);
    }, [workflowStore]);
    return {
        nodesReadOnly: !!(workflowRunningData?.result.status === types_1.WorkflowRunningStatus.Running || historyWorkflowData || isRestoring),
        getNodesReadOnly,
    };
};
exports.useNodesReadOnly = useNodesReadOnly;
const useIsNodeInIteration = (iterationId) => {
    const store = (0, reactflow_1.useStoreApi)();
    const isNodeInIteration = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, } = store.getState();
        const nodes = getNodes();
        const node = nodes.find(node => node.id === nodeId);
        if (!node)
            return false;
        if (node.parentId === iterationId)
            return true;
        return false;
    }, [iterationId, store]);
    return {
        isNodeInIteration,
    };
};
exports.useIsNodeInIteration = useIsNodeInIteration;
const useIsNodeInLoop = (loopId) => {
    const store = (0, reactflow_1.useStoreApi)();
    const isNodeInLoop = (0, react_1.useCallback)((nodeId) => {
        const { getNodes, } = store.getState();
        const nodes = getNodes();
        const node = nodes.find(node => node.id === nodeId);
        if (!node)
            return false;
        if (node.parentId === loopId)
            return true;
        return false;
    }, [loopId, store]);
    return {
        isNodeInLoop,
    };
};
exports.useIsNodeInLoop = useIsNodeInLoop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXdvcmtmbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVdBLDhDQUEwQztBQUMxQyxpQ0FFYztBQUNkLHlDQUlrQjtBQUNsQixzREFBb0U7QUFDcEUseUZBQXVHO0FBQ3ZHLG9GQUE2RjtBQUM3RixxQ0FBeUM7QUFDekMsd0JBQW9DO0FBQ3BDLDRDQUVxQjtBQUNyQixvRUFBOEc7QUFDOUcsc0RBQXlEO0FBRXpELG9DQUdpQjtBQUNqQixvQ0FFaUI7QUFDakIsNERBR2dDO0FBQ2hDLGlFQUEyRDtBQUVwRCxNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7SUFDaEMsTUFBTSxTQUFTLEdBQUcsSUFBQSxnQkFBVyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBRS9DLE9BQU8sU0FBUyxFQUFFLElBQUksS0FBSyxpQkFBVyxDQUFDLGFBQWEsQ0FBQTtBQUN0RCxDQUFDLENBQUE7QUFKWSxRQUFBLGFBQWEsaUJBSXpCO0FBRU0sTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFO0lBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBQzNCLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUFHLElBQUEseUNBQWtCLEdBQUUsQ0FBQTtJQUNuRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSxtQkFBZ0IsR0FBRSxDQUFBO0lBRXZDLE1BQU0sV0FBVyxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE1BQWMsRUFBRSxFQUFFO1FBQ2pELE1BQU0sRUFDSixRQUFRLEdBQ1QsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDcEIsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUE7UUFDeEIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUks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QUksQ0FBQyxRQUFRLEtBQUssV0FBVztZQUMvQixPQUFPLElBQUksQ0FBQTtRQUViLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDeEIsT0FBTztRQUNMLGlCQUFpQjtLQUNsQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBckJZLFFBQUEsb0JBQW9CLHdCQXFCaEM7QUFFTSxNQUFNLGVBQWUsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFO0lBQ2hELE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBRTNCLE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE1BQWMsRUFBRSxFQUFFO1FBQ2xELE1BQU0sRUFDSixRQUFRLEdBQ1QsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDcEIsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUE7UUFDeEIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUE7UUFFbkQsSUFBSSxDQUFDLElBQUk7WUFDUCxPQUFPLEtBQUssQ0FBQTtRQUVkLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxNQUFNO1lBQzFCLE9BQU8sSUFBSSxDQUFBO1FBRWIsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUNuQixPQUFPO1FBQ0wsWUFBWTtLQUNiLENBQUE7QUFDSCxDQUFDLENBQUE7QUFyQlksUUFBQSxlQUFlLG1CQXFCM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIENvbm5lY3Rpb24sXG59IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB0eXBlIHsgSXRlcmF0aW9uTm9kZVR5cGUgfSBmcm9tICcuLi9ub2Rlcy9pdGVyYXRpb24vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IExvb3BOb2RlVHlwZSB9IGZyb20gJy4uL25vZGVzL2xvb3AvdHlwZXMnXG5pbXBvcnQgdHlwZSB7XG4gIEJsb2NrRW51bSxcbiAgRWRnZSxcbiAgTm9kZSxcbiAgVmFsdWVTZWxlY3Rvcixcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyB1bmlxQnkgfSBmcm9tICdlcy10b29sa2l0L2NvbXBhdCdcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIGdldEluY29tZXJzLFxuICBnZXRPdXRnb2VycyxcbiAgdXNlU3RvcmVBcGksXG59IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IHVzZVN0b3JlIGFzIHVzZUFwcFN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvc3RvcmUnXG5pbXBvcnQgeyBDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2l0ZXJhdGlvbi1zdGFydC9jb25zdGFudHMnXG5pbXBvcnQgeyBDVVNUT01fTE9PUF9TVEFSVF9OT0RFIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9sb29wLXN0YXJ0L2NvbnN0YW50cydcbmltcG9ydCB7IEFwcE1vZGVFbnVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyB1c2VOb2Rlc01ldGFEYXRhIH0gZnJvbSAnLidcbmltcG9ydCB7XG4gIFNVUFBPUlRfT1VUUFVUX1ZBUlNfTk9ERSxcbn0gZnJvbSAnLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgZmluZFVzZWRWYXJOb2RlcywgZ2V0Tm9kZU91dHB1dFZhcnMsIHVwZGF0ZU5vZGVWYXJzIH0gZnJvbSAnLi4vbm9kZXMvX2Jhc2UvY29tcG9uZW50cy92YXJpYWJsZS91dGlscydcbmltcG9ydCB7IENVU1RPTV9OT1RFX05PREUgfSBmcm9tICcuLi9ub3RlLW5vZGUvY29uc3RhbnRzJ1xuXG5pbXBvcnQge1xuICB1c2VTdG9yZSxcbiAgdXNlV29ya2Zsb3dTdG9yZSxcbn0gZnJvbSAnLi4vc3RvcmUnXG5pbXBvcnQge1xuICBXb3JrZmxvd1J1bm5pbmdTdGF0dXMsXG59IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHtcbiAgZ2V0V29ya2Zsb3dFbnRyeU5vZGUsXG4gIGlzV29ya2Zsb3dFbnRyeU5vZGUsXG59IGZyb20gJy4uL3V0aWxzL3dvcmtmbG93LWVudHJ5J1xuaW1wb3J0IHsgdXNlQXZhaWxhYmxlQmxvY2tzIH0gZnJvbSAnLi91c2UtYXZhaWxhYmxlLWJsb2NrcydcblxuZXhwb3J0IGNvbnN0IHVzZUlzQ2hhdE1vZGUgPSAoKSA9PiB7XG4gIGNvbnN0IGFwcERldGFpbCA9IHVzZUFwcFN0b3JlKHMgPT4gcy5hcHBEZXRhaWwpXG5cbiAgcmV0dXJuIGFwcERldGFpbD8ubW9kZSA9PT0gQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVFxufVxuXG5leHBvcnQgY29uc3QgdXNlV29ya2Zsb3cgPSAoKSA9PiB7XG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuICBjb25zdCB7IGdldEF2YWlsYWJsZUJsb2NrcyB9ID0gdXNlQXZhaWxhYmxlQmxvY2tzKClcbiAgY29uc3QgeyBub2Rlc01hcCB9ID0gdXNlTm9kZXNNZXRhRGF0YSgpXG5cbiAgY29uc3QgZ2V0Tm9kZUJ5SWQgPSB1c2VDYWxsYmFjaygobm9kZUlkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVJZClcbiAgICByZXR1cm4gY3VycmVudE5vZGVcbiAgfSwgW3N0b3JlXSlcblxuICBjb25zdCBnZXRUcmVlTGVhZk5vZGVzID0gdXNlQ2FsbGJhY2soKG5vZGVJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBlZGdlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIC8vIGxldCBzdGFydE5vZGUgPSBnZXRXb3JrZmxvd0VudHJ5Tm9kZShub2RlcylcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBub2RlSWQpXG5cbiAgICBsZXQgc3RhcnROb2RlcyA9IG5vZGVzLmZpbHRlcihub2RlID0+IG5vZGVzTWFwPy5bbm9kZS5kYXRhLnR5cGUgYXMgQmxvY2tFbnVtXT8ubWV0YURhdGEuaXNTdGFydCkgfHwgW11cblxuICAgIGlmIChjdXJyZW50Tm9kZT8ucGFyZW50SWQpIHtcbiAgICAgIGNvbnN0IHN0YXJ0Tm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLnBhcmVudElkID09PSBjdXJyZW50Tm9kZS5wYXJlbnRJZCAmJiAobm9kZS50eXBlID09PSBDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREUgfHwgbm9kZS50eXBlID09PSBDVVNUT01fTE9PUF9TVEFSVF9OT0RFKSlcbiAgICAgIGlmIChzdGFydE5vZGUpXG4gICAgICAgIHN0YXJ0Tm9kZXMgPSBbc3RhcnROb2RlXVxuICAgIH1cblxuICAgIGlmICghc3RhcnROb2Rlcy5sZW5ndGgpXG4gICAgICByZXR1cm4gW11cblxuICAgIGNvbnN0IGxpc3Q6IE5vZGVbXSA9IFtdXG4gICAgY29uc3QgcHJlT3JkZXIgPSAocm9vdDogTm9kZSwgY2FsbGJhY2s6IChub2RlOiBOb2RlKSA9PiB2b2lkKSA9PiB7XG4gICAgICBpZiAocm9vdC5pZCA9PT0gbm9kZUlkKVxuICAgICAgICByZXR1cm5cbiAgICAgIGNvbnN0IG91dGdvZXJzID0gZ2V0T3V0Z29lcnMocm9vdCwgbm9kZXMsIGVkZ2VzKVxuXG4gICAgICBpZiAob3V0Z29lcnMubGVuZ3RoKSB7XG4gICAgICAgIG91dGdvZXJzLmZvckVhY2goKG91dGdvZXIpID0+IHtcbiAgICAgICAgICBwcmVPcmRlcihvdXRnb2VyLCBjYWxsYmFjaylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAocm9vdC5pZCAhPT0gbm9kZUlkKVxuICAgICAgICAgIGNhbGxiYWNrKHJvb3QpXG4gICAgICB9XG4gICAgfVxuICAgIHN0YXJ0Tm9kZXMuZm9yRWFjaCgoc3RhcnROb2RlKSA9PiB7XG4gICAgICBwcmVPcmRlcihzdGFydE5vZGUsIChub2RlKSA9PiB7XG4gICAgICAgIGxpc3QucHVzaChub2RlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgY29uc3QgaW5jb21lcnMgPSBnZXRJbmNvbWVycyh7IGlkOiBub2RlSWQgfSBhcyBOb2RlLCBub2RlcywgZWRnZXMpXG5cbiAgICBsaXN0LnB1c2goLi4uaW5jb21lcnMpXG5cbiAgICByZXR1cm4gdW5pcUJ5KGxpc3QsICdpZCcpLmZpbHRlcigoaXRlbTogTm9kZSkgPT4ge1xuICAgICAgcmV0dXJuIFNVUFBPUlRfT1VUUFVUX1ZBUlNfTk9ERS5pbmNsdWRlcyhpdGVtLmRhdGEudHlwZSlcbiAgICB9KVxuICB9LCBbc3RvcmUsIG5vZGVzTWFwXSlcblxuICBjb25zdCBnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaCA9IHVzZUNhbGxiYWNrKChub2RlSWQ6IHN0cmluZywgbmV3Tm9kZXM/OiBOb2RlW10sIG5ld0VkZ2VzPzogRWRnZVtdKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBlZGdlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gbmV3Tm9kZXMgfHwgZ2V0Tm9kZXMoKVxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVJZClcblxuICAgIGNvbnN0IGxpc3Q6IE5vZGVbXSA9IFtdXG5cbiAgICBpZiAoIWN1cnJlbnROb2RlKVxuICAgICAgcmV0dXJuIGxpc3RcblxuICAgIGlmIChjdXJyZW50Tm9kZS5wYXJlbnRJZCkge1xuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBjdXJyZW50Tm9kZS5wYXJlbnRJZClcbiAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudExpc3QgPSBnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaChwYXJlbnROb2RlLmlkKVxuXG4gICAgICAgIGxpc3QucHVzaCguLi5wYXJlbnRMaXN0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRyYXZlcnNlID0gKHJvb3Q6IE5vZGUsIGNhbGxiYWNrOiAobm9kZTogTm9kZSkgPT4gdm9pZCkgPT4ge1xuICAgICAgaWYgKHJvb3QpIHtcbiAgICAgICAgY29uc3QgaW5jb21lcnMgPSBnZXRJbmNvbWVycyhyb290LCBub2RlcywgbmV3RWRnZXMgfHwgZWRnZXMpXG5cbiAgICAgICAgaWYgKGluY29tZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGluY29tZXJzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGlmICghbGlzdC5maW5kKG4gPT4gbm9kZS5pZCA9PT0gbi5pZCkpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sobm9kZSlcbiAgICAgICAgICAgICAgdHJhdmVyc2Uobm9kZSwgY2FsbGJhY2spXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0cmF2ZXJzZShjdXJyZW50Tm9kZSwgKG5vZGUpID0+IHtcbiAgICAgIGxpc3QucHVzaChub2RlKVxuICAgIH0pXG5cbiAgICBjb25zdCBsZW5ndGggPSBsaXN0Lmxlbmd0aFxuICAgIGlmIChsZW5ndGgpIHtcbiAgICAgIHJldHVybiB1bmlxQnkobGlzdCwgJ2lkJykucmV2ZXJzZSgpLmZpbHRlcigoaXRlbTogTm9kZSkgPT4ge1xuICAgICAgICByZXR1cm4gU1VQUE9SVF9PVVRQVVRfVkFSU19OT0RFLmluY2x1ZGVzKGl0ZW0uZGF0YS50eXBlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfSwgW3N0b3JlXSlcblxuICBjb25zdCBnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaEluY2x1ZGVQYXJlbnQgPSB1c2VDYWxsYmFjaygobm9kZUlkOiBzdHJpbmcsIG5ld05vZGVzPzogTm9kZVtdLCBuZXdFZGdlcz86IEVkZ2VbXSkgPT4ge1xuICAgIGNvbnN0IG5vZGVzID0gZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2gobm9kZUlkLCBuZXdOb2RlcywgbmV3RWRnZXMpXG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCBhbGxOb2RlcyA9IGdldE5vZGVzKClcbiAgICBjb25zdCBub2RlID0gYWxsTm9kZXMuZmluZChuID0+IG4uaWQgPT09IG5vZGVJZClcbiAgICBjb25zdCBwYXJlbnROb2RlSWQgPSBub2RlPy5wYXJlbnRJZFxuICAgIGNvbnN0IHBhcmVudE5vZGUgPSBhbGxOb2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gcGFyZW50Tm9kZUlkKVxuICAgIGlmIChwYXJlbnROb2RlKVxuICAgICAgbm9kZXMucHVzaChwYXJlbnROb2RlKVxuXG4gICAgcmV0dXJuIG5vZGVzXG4gIH0sIFtnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaCwgc3RvcmVdKVxuXG4gIGNvbnN0IGdldEFmdGVyTm9kZXNJblNhbWVCcmFuY2ggPSB1c2VDYWxsYmFjaygobm9kZUlkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICAgIGVkZ2VzLFxuICAgIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZUlkKSFcblxuICAgIGlmICghY3VycmVudE5vZGUpXG4gICAgICByZXR1cm4gW11cbiAgICBjb25zdCBsaXN0OiBOb2RlW10gPSBbY3VycmVudE5vZGVdXG5cbiAgICBjb25zdCB0cmF2ZXJzZSA9IChyb290OiBOb2RlLCBjYWxsYmFjazogKG5vZGU6IE5vZGUpID0+IHZvaWQpID0+IHtcbiAgICAgIGlmIChyb290KSB7XG4gICAgICAgIGNvbnN0IG91dGdvZXJzID0gZ2V0T3V0Z29lcnMocm9vdCwgbm9kZXMsIGVkZ2VzKVxuXG4gICAgICAgIGlmIChvdXRnb2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICBvdXRnb2Vycy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjayhub2RlKVxuICAgICAgICAgICAgdHJhdmVyc2Uobm9kZSwgY2FsbGJhY2spXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0cmF2ZXJzZShjdXJyZW50Tm9kZSwgKG5vZGUpID0+IHtcbiAgICAgIGxpc3QucHVzaChub2RlKVxuICAgIH0pXG5cbiAgICByZXR1cm4gdW5pcUJ5KGxpc3QsICdpZCcpXG4gIH0sIFtzdG9yZV0pXG5cbiAgY29uc3QgZ2V0QmVmb3JlTm9kZUJ5SWQgPSB1c2VDYWxsYmFjaygobm9kZUlkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICAgIGVkZ2VzLFxuICAgIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgY29uc3Qgbm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBub2RlSWQpIVxuXG4gICAgcmV0dXJuIGdldEluY29tZXJzKG5vZGUsIG5vZGVzLCBlZGdlcylcbiAgfSwgW3N0b3JlXSlcblxuICBjb25zdCBnZXRJdGVyYXRpb25Ob2RlQ2hpbGRyZW4gPSB1c2VDYWxsYmFjaygobm9kZUlkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuXG4gICAgcmV0dXJuIG5vZGVzLmZpbHRlcihub2RlID0+IG5vZGUucGFyZW50SWQgPT09IG5vZGVJZClcbiAgfSwgW3N0b3JlXSlcblxuICBjb25zdCBnZXRMb29wTm9kZUNoaWxkcmVuID0gdXNlQ2FsbGJhY2soKG5vZGVJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcblxuICAgIHJldHVybiBub2Rlcy5maWx0ZXIobm9kZSA9PiBub2RlLnBhcmVudElkID09PSBub2RlSWQpXG4gIH0sIFtzdG9yZV0pXG5cbiAgY29uc3QgaXNGcm9tU3RhcnROb2RlID0gdXNlQ2FsbGJhY2soKG5vZGVJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyBnZXROb2RlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVJZClcblxuICAgIGlmICghY3VycmVudE5vZGUpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGlmIChpc1dvcmtmbG93RW50cnlOb2RlKGN1cnJlbnROb2RlLmRhdGEudHlwZSkpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgY29uc3QgY2hlY2tQcmV2aW91c05vZGVzID0gKG5vZGU6IE5vZGUpID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzTm9kZXMgPSBnZXRCZWZvcmVOb2RlQnlJZChub2RlLmlkKVxuXG4gICAgICBmb3IgKGNvbnN0IHByZXZOb2RlIG9mIHByZXZpb3VzTm9kZXMpIHtcbiAgICAgICAgaWYgKGlzV29ya2Zsb3dFbnRyeU5vZGUocHJldk5vZGUuZGF0YS50eXBlKSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBpZiAoY2hlY2tQcmV2aW91c05vZGVzKHByZXZOb2RlKSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gY2hlY2tQcmV2aW91c05vZGVzKGN1cnJlbnROb2RlKVxuICB9LCBbc3RvcmUsIGdldEJlZm9yZU5vZGVCeUlkXSlcblxuICBjb25zdCBoYW5kbGVPdXRWYXJSZW5hbWVDaGFuZ2UgPSB1c2VDYWxsYmFjaygobm9kZUlkOiBzdHJpbmcsIG9sZFZhbGVTZWxlY3RvcjogVmFsdWVTZWxlY3RvciwgbmV3VmFyU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpID0+IHtcbiAgICBjb25zdCB7IGdldE5vZGVzLCBzZXROb2RlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IGFsbE5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIGNvbnN0IGFmZmVjdGVkTm9kZXMgPSBmaW5kVXNlZFZhck5vZGVzKG9sZFZhbGVTZWxlY3RvciwgYWxsTm9kZXMpXG4gICAgaWYgKGFmZmVjdGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbmV3Tm9kZXMgPSBhbGxOb2Rlcy5tYXAoKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKGFmZmVjdGVkTm9kZXMuZmluZChuID0+IG4uaWQgPT09IG5vZGUuaWQpKVxuICAgICAgICAgIHJldHVybiB1cGRhdGVOb2RlVmFycyhub2RlLCBvbGRWYWxlU2VsZWN0b3IsIG5ld1ZhclNlbGVjdG9yKVxuXG4gICAgICAgIHJldHVybiBub2RlXG4gICAgICB9KVxuICAgICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG4gICAgfVxuICB9LCBbc3RvcmVdKVxuXG4gIGNvbnN0IGlzVmFyVXNlZEluTm9kZXMgPSB1c2VDYWxsYmFjaygodmFyU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpID0+IHtcbiAgICBjb25zdCBub2RlSWQgPSB2YXJTZWxlY3RvclswXVxuICAgIGNvbnN0IGFmdGVyTm9kZXMgPSBnZXRBZnRlck5vZGVzSW5TYW1lQnJhbmNoKG5vZGVJZClcbiAgICBjb25zdCBlZmZlY3ROb2RlcyA9IGZpbmRVc2VkVmFyTm9kZXModmFyU2VsZWN0b3IsIGFmdGVyTm9kZXMpXG4gICAgcmV0dXJuIGVmZmVjdE5vZGVzLmxlbmd0aCA+IDBcbiAgfSwgW2dldEFmdGVyTm9kZXNJblNhbWVCcmFuY2hdKVxuXG4gIGNvbnN0IHJlbW92ZVVzZWRWYXJJbk5vZGVzID0gdXNlQ2FsbGJhY2soKHZhclNlbGVjdG9yOiBWYWx1ZVNlbGVjdG9yKSA9PiB7XG4gICAgY29uc3Qgbm9kZUlkID0gdmFyU2VsZWN0b3JbMF1cbiAgICBjb25zdCB7IGdldE5vZGVzLCBzZXROb2RlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IGFmdGVyTm9kZXMgPSBnZXRBZnRlck5vZGVzSW5TYW1lQnJhbmNoKG5vZGVJZClcbiAgICBjb25zdCBlZmZlY3ROb2RlcyA9IGZpbmRVc2VkVmFyTm9kZXModmFyU2VsZWN0b3IsIGFmdGVyTm9kZXMpXG4gICAgaWYgKGVmZmVjdE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG5ld05vZGVzID0gZ2V0Tm9kZXMoKS5tYXAoKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKGVmZmVjdE5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBub2RlLmlkKSlcbiAgICAgICAgICByZXR1cm4gdXBkYXRlTm9kZVZhcnMobm9kZSwgdmFyU2VsZWN0b3IsIFtdKVxuXG4gICAgICAgIHJldHVybiBub2RlXG4gICAgICB9KVxuICAgICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG4gICAgfVxuICB9LCBbZ2V0QWZ0ZXJOb2Rlc0luU2FtZUJyYW5jaCwgc3RvcmVdKVxuXG4gIGNvbnN0IGlzTm9kZVZhcnNVc2VkSW5Ob2RlcyA9IHVzZUNhbGxiYWNrKChub2RlOiBOb2RlLCBpc0NoYXRNb2RlOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3Qgb3V0cHV0VmFycyA9IGdldE5vZGVPdXRwdXRWYXJzKG5vZGUsIGlzQ2hhdE1vZGUpXG4gICAgY29uc3QgaXNVc2VkID0gb3V0cHV0VmFycy5zb21lKCh2YXJTZWxlY3RvcikgPT4ge1xuICAgICAgcmV0dXJuIGlzVmFyVXNlZEluTm9kZXModmFyU2VsZWN0b3IpXG4gICAgfSlcbiAgICByZXR1cm4gaXNVc2VkXG4gIH0sIFtpc1ZhclVzZWRJbk5vZGVzXSlcblxuICBjb25zdCBnZXRSb290Tm9kZXNCeUlkID0gdXNlQ2FsbGJhY2soKG5vZGVJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBlZGdlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVJZClcblxuICAgIGNvbnN0IHJvb3ROb2RlczogTm9kZVtdID0gW11cblxuICAgIGlmICghY3VycmVudE5vZGUpXG4gICAgICByZXR1cm4gcm9vdE5vZGVzXG5cbiAgICBpZiAoY3VycmVudE5vZGUucGFyZW50SWQpIHtcbiAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gY3VycmVudE5vZGUucGFyZW50SWQpXG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBjb25zdCBwYXJlbnRMaXN0ID0gZ2V0Um9vdE5vZGVzQnlJZChwYXJlbnROb2RlLmlkKVxuXG4gICAgICAgIHJvb3ROb2Rlcy5wdXNoKC4uLnBhcmVudExpc3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdHJhdmVyc2UgPSAocm9vdDogTm9kZSwgY2FsbGJhY2s6IChub2RlOiBOb2RlKSA9PiB2b2lkKSA9PiB7XG4gICAgICBpZiAocm9vdCkge1xuICAgICAgICBjb25zdCBpbmNvbWVycyA9IGdldEluY29tZXJzKHJvb3QsIG5vZGVzLCBlZGdlcylcblxuICAgICAgICBpZiAoaW5jb21lcnMubGVuZ3RoKSB7XG4gICAgICAgICAgaW5jb21lcnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgdHJhdmVyc2Uobm9kZSwgY2FsbGJhY2spXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhyb290KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRyYXZlcnNlKGN1cnJlbnROb2RlLCAobm9kZSkgPT4ge1xuICAgICAgcm9vdE5vZGVzLnB1c2gobm9kZSlcbiAgICB9KVxuXG4gICAgY29uc3QgbGVuZ3RoID0gcm9vdE5vZGVzLmxlbmd0aFxuICAgIGlmIChsZW5ndGgpXG4gICAgICByZXR1cm4gdW5pcUJ5KHJvb3ROb2RlcywgJ2lkJylcblxuICAgIHJldHVybiBbXVxuICB9LCBbc3RvcmVdKVxuXG4gIGNvbnN0IGdldFN0YXJ0Tm9kZXMgPSB1c2VDYWxsYmFjaygobm9kZXM6IE5vZGVbXSwgY3VycmVudE5vZGU/OiBOb2RlKSA9PiB7XG4gICAgY29uc3QgeyBpZCwgcGFyZW50SWQgfSA9IGN1cnJlbnROb2RlIHx8IHt9XG4gICAgbGV0IHN0YXJ0Tm9kZXM6IE5vZGVbXSA9IFtdXG5cbiAgICBpZiAocGFyZW50SWQpIHtcbiAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gcGFyZW50SWQpXG4gICAgICBpZiAoIXBhcmVudE5vZGUpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyZW50IG5vZGUgbm90IGZvdW5kJylcblxuICAgICAgY29uc3Qgc3RhcnROb2RlID0gbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IChwYXJlbnROb2RlLmRhdGEgYXMgKEl0ZXJhdGlvbk5vZGVUeXBlIHwgTG9vcE5vZGVUeXBlKSkuc3RhcnRfbm9kZV9pZClcbiAgICAgIGlmIChzdGFydE5vZGUpXG4gICAgICAgIHN0YXJ0Tm9kZXMgPSBbc3RhcnROb2RlXVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHN0YXJ0Tm9kZXMgPSBub2Rlcy5maWx0ZXIobm9kZSA9PiBub2Rlc01hcD8uW25vZGUuZGF0YS50eXBlIGFzIEJsb2NrRW51bV0/Lm1ldGFEYXRhLmlzU3RhcnQpIHx8IFtdXG4gICAgfVxuXG4gICAgaWYgKCFzdGFydE5vZGVzLmxlbmd0aClcbiAgICAgIHN0YXJ0Tm9kZXMgPSBnZXRSb290Tm9kZXNCeUlkKGlkIHx8ICcnKVxuXG4gICAgcmV0dXJuIHN0YXJ0Tm9kZXNcbiAgfSwgW25vZGVzTWFwLCBnZXRSb290Tm9kZXNCeUlkXSlcblxuICBjb25zdCBpc1ZhbGlkQ29ubmVjdGlvbiA9IHVzZUNhbGxiYWNrKCh7IHNvdXJjZSwgc291cmNlSGFuZGxlOiBfc291cmNlSGFuZGxlLCB0YXJnZXQgfTogQ29ubmVjdGlvbikgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGVkZ2VzLFxuICAgICAgZ2V0Tm9kZXMsXG4gICAgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcbiAgICBjb25zdCBzb3VyY2VOb2RlOiBOb2RlID0gbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IHNvdXJjZSkhXG4gICAgY29uc3QgdGFyZ2V0Tm9kZTogTm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSB0YXJnZXQpIVxuXG4gICAgaWYgKHNvdXJjZU5vZGUudHlwZSA9PT0gQ1VTVE9NX05PVEVfTk9ERSB8fCB0YXJnZXROb2RlLnR5cGUgPT09IENVU1RPTV9OT1RFX05PREUpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGlmIChzb3VyY2VOb2RlLnBhcmVudElkICE9PSB0YXJnZXROb2RlLnBhcmVudElkKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBpZiAoc291cmNlTm9kZSAmJiB0YXJnZXROb2RlKSB7XG4gICAgICBjb25zdCBzb3VyY2VOb2RlQXZhaWxhYmxlTmV4dE5vZGVzID0gZ2V0QXZhaWxhYmxlQmxvY2tzKHNvdXJjZU5vZGUuZGF0YS50eXBlLCAhIXNvdXJjZU5vZGUucGFyZW50SWQpLmF2YWlsYWJsZU5leHRCbG9ja3NcbiAgICAgIGNvbnN0IHRhcmdldE5vZGVBdmFpbGFibGVQcmV2Tm9kZXMgPSBnZXRBdmFpbGFibGVCbG9ja3ModGFyZ2V0Tm9kZS5kYXRhLnR5cGUsICEhdGFyZ2V0Tm9kZS5wYXJlbnRJZCkuYXZhaWxhYmxlUHJldkJsb2Nrc1xuXG4gICAgICBpZiAoIXNvdXJjZU5vZGVBdmFpbGFibGVOZXh0Tm9kZXMuaW5jbHVkZXModGFyZ2V0Tm9kZS5kYXRhLnR5cGUpKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgaWYgKCF0YXJnZXROb2RlQXZhaWxhYmxlUHJldk5vZGVzLmluY2x1ZGVzKHNvdXJjZU5vZGUuZGF0YS50eXBlKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgaGFzQ3ljbGUgPSAobm9kZTogTm9kZSwgdmlzaXRlZCA9IG5ldyBTZXQoKSkgPT4ge1xuICAgICAgaWYgKHZpc2l0ZWQuaGFzKG5vZGUuaWQpKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgdmlzaXRlZC5hZGQobm9kZS5pZClcblxuICAgICAgZm9yIChjb25zdCBvdXRnb2VyIG9mIGdldE91dGdvZXJzKG5vZGUsIG5vZGVzLCBlZGdlcykpIHtcbiAgICAgICAgaWYgKG91dGdvZXIuaWQgPT09IHNvdXJjZSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBpZiAoaGFzQ3ljbGUob3V0Z29lciwgdmlzaXRlZCkpXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gIWhhc0N5Y2xlKHRhcmdldE5vZGUpXG4gIH0sIFtzdG9yZSwgZ2V0QXZhaWxhYmxlQmxvY2tzXSlcblxuICBjb25zdCBnZXROb2RlID0gdXNlQ2FsbGJhY2soKG5vZGVJZD86IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHsgZ2V0Tm9kZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcblxuICAgIHJldHVybiBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZUlkKSB8fCBnZXRXb3JrZmxvd0VudHJ5Tm9kZShub2RlcylcbiAgfSwgW3N0b3JlXSlcblxuICByZXR1cm4ge1xuICAgIGdldE5vZGVCeUlkLFxuICAgIGdldFRyZWVMZWFmTm9kZXMsXG4gICAgZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2gsXG4gICAgZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2hJbmNsdWRlUGFyZW50LFxuICAgIGdldEFmdGVyTm9kZXNJblNhbWVCcmFuY2gsXG4gICAgaGFuZGxlT3V0VmFyUmVuYW1lQ2hhbmdlLFxuICAgIGlzVmFyVXNlZEluTm9kZXMsXG4gICAgcmVtb3ZlVXNlZFZhckluTm9kZXMsXG4gICAgaXNOb2RlVmFyc1VzZWRJbk5vZGVzLFxuICAgIGlzVmFsaWRDb25uZWN0aW9uLFxuICAgIGdldEJlZm9yZU5vZGVCeUlkLFxuICAgIGdldEl0ZXJhdGlvbk5vZGVDaGlsZHJlbixcbiAgICBnZXRMb29wTm9kZUNoaWxkcmVuLFxuICAgIGdldFJvb3ROb2Rlc0J5SWQsXG4gICAgZ2V0U3RhcnROb2RlcyxcbiAgICBpc0Zyb21TdGFydE5vZGUsXG4gICAgZ2V0Tm9kZSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlV29ya2Zsb3dSZWFkT25seSA9ICgpID0+IHtcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCB3b3JrZmxvd1J1bm5pbmdEYXRhID0gdXNlU3RvcmUocyA9PiBzLndvcmtmbG93UnVubmluZ0RhdGEpXG5cbiAgY29uc3QgZ2V0V29ya2Zsb3dSZWFkT25seSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICByZXR1cm4gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpLndvcmtmbG93UnVubmluZ0RhdGE/LnJlc3VsdC5zdGF0dXMgPT09IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nXG4gIH0sIFt3b3JrZmxvd1N0b3JlXSlcblxuICByZXR1cm4ge1xuICAgIHdvcmtmbG93UmVhZE9ubHk6IHdvcmtmbG93UnVubmluZ0RhdGE/LnJlc3VsdC5zdGF0dXMgPT09IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgIGdldFdvcmtmbG93UmVhZE9ubHksXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZU5vZGVzUmVhZE9ubHkgPSAoKSA9PiB7XG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3Qgd29ya2Zsb3dSdW5uaW5nRGF0YSA9IHVzZVN0b3JlKHMgPT4gcy53b3JrZmxvd1J1bm5pbmdEYXRhKVxuICBjb25zdCBoaXN0b3J5V29ya2Zsb3dEYXRhID0gdXNlU3RvcmUocyA9PiBzLmhpc3RvcnlXb3JrZmxvd0RhdGEpXG4gIGNvbnN0IGlzUmVzdG9yaW5nID0gdXNlU3RvcmUocyA9PiBzLmlzUmVzdG9yaW5nKVxuXG4gIGNvbnN0IGdldE5vZGVzUmVhZE9ubHkgPSB1c2VDYWxsYmFjaygoKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YSxcbiAgICAgIGhpc3RvcnlXb3JrZmxvd0RhdGEsXG4gICAgICBpc1Jlc3RvcmluZyxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4gISEod29ya2Zsb3dSdW5uaW5nRGF0YT8ucmVzdWx0LnN0YXR1cyA9PT0gV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfHwgaGlzdG9yeVdvcmtmbG93RGF0YSB8fCBpc1Jlc3RvcmluZylcbiAgfSwgW3dvcmtmbG93U3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgbm9kZXNSZWFkT25seTogISEod29ya2Zsb3dSdW5uaW5nRGF0YT8ucmVzdWx0LnN0YXR1cyA9PT0gV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfHwgaGlzdG9yeVdvcmtmbG93RGF0YSB8fCBpc1Jlc3RvcmluZyksXG4gICAgZ2V0Tm9kZXNSZWFkT25seSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlSXNOb2RlSW5JdGVyYXRpb24gPSAoaXRlcmF0aW9uSWQ6IHN0cmluZykgPT4ge1xuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcblxuICBjb25zdCBpc05vZGVJbkl0ZXJhdGlvbiA9IHVzZUNhbGxiYWNrKChub2RlSWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGdldE5vZGVzLFxuICAgIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgY29uc3Qgbm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBub2RlSWQpXG5cbiAgICBpZiAoIW5vZGUpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGlmIChub2RlLnBhcmVudElkID09PSBpdGVyYXRpb25JZClcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfSwgW2l0ZXJhdGlvbklkLCBzdG9yZV0pXG4gIHJldHVybiB7XG4gICAgaXNOb2RlSW5JdGVyYXRpb24sXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZUlzTm9kZUluTG9vcCA9IChsb29wSWQ6IHN0cmluZykgPT4ge1xuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcblxuICBjb25zdCBpc05vZGVJbkxvb3AgPSB1c2VDYWxsYmFjaygobm9kZUlkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIGNvbnN0IG5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZUlkKVxuXG4gICAgaWYgKCFub2RlKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBpZiAobm9kZS5wYXJlbnRJZCA9PT0gbG9vcElkKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiBmYWxzZVxuICB9LCBbbG9vcElkLCBzdG9yZV0pXG4gIHJldHVybiB7XG4gICAgaXNOb2RlSW5Mb29wLFxuICB9XG59XG4iXX0=