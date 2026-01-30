"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNodesInteractions = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const reactflow_1 = require("reactflow");
const constants_1 = require("../constants");
const utils_1 = require("../nodes/_base/components/variable/utils");
const constants_2 = require("../nodes/iteration-start/constants");
const use_interactions_1 = require("../nodes/iteration/use-interactions");
const constants_3 = require("../nodes/loop-start/constants");
const use_interactions_2 = require("../nodes/loop/use-interactions");
const constants_4 = require("../note-node/constants");
const store_1 = require("../store");
const types_1 = require("../types");
const utils_2 = require("../utils");
const workflow_history_store_1 = require("../workflow-history-store");
const use_auto_generate_webhook_url_1 = require("./use-auto-generate-webhook-url");
const use_helpline_1 = require("./use-helpline");
const use_inspect_vars_crud_1 = require("./use-inspect-vars-crud");
const use_nodes_meta_data_1 = require("./use-nodes-meta-data");
const use_nodes_sync_draft_1 = require("./use-nodes-sync-draft");
const use_workflow_1 = require("./use-workflow");
const use_workflow_history_1 = require("./use-workflow-history");
// Entry node deletion restriction has been removed to allow empty workflows
// Entry node (Start/Trigger) wrapper offsets for alignment
// Must match the values in use-helpline.ts
const ENTRY_NODE_WRAPPER_OFFSET = {
    x: 0,
    y: 21, // Adjusted based on visual testing feedback
};
const useNodesInteractions = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const reactflow = (0, reactflow_1.useReactFlow)();
    const { store: workflowHistoryStore } = (0, workflow_history_store_1.useWorkflowHistoryStore)();
    const { handleSyncWorkflowDraft } = (0, use_nodes_sync_draft_1.useNodesSyncDraft)();
    const { getAfterNodesInSameBranch } = (0, use_workflow_1.useWorkflow)();
    const { getNodesReadOnly } = (0, use_workflow_1.useNodesReadOnly)();
    const { getWorkflowReadOnly } = (0, use_workflow_1.useWorkflowReadOnly)();
    const { handleSetHelpline } = (0, use_helpline_1.useHelpline)();
    const { handleNodeIterationChildDrag, handleNodeIterationChildrenCopy } = (0, use_interactions_1.useNodeIterationInteractions)();
    const { handleNodeLoopChildDrag, handleNodeLoopChildrenCopy } = (0, use_interactions_2.useNodeLoopInteractions)();
    const dragNodeStartPosition = (0, react_1.useRef)({ x: 0, y: 0 });
    const { nodesMap: nodesMetaDataMap } = (0, use_nodes_meta_data_1.useNodesMetaData)();
    const { saveStateToHistory, undo, redo } = (0, use_workflow_history_1.useWorkflowHistory)();
    const autoGenerateWebhookUrl = (0, use_auto_generate_webhook_url_1.useAutoGenerateWebhookUrl)();
    const handleNodeDragStart = (0, react_1.useCallback)((_, node) => {
        workflowStore.setState({ nodeAnimation: false });
        if (getNodesReadOnly())
            return;
        if (node.type === constants_2.CUSTOM_ITERATION_START_NODE
            || node.type === constants_4.CUSTOM_NOTE_NODE) {
            return;
        }
        if (node.type === constants_3.CUSTOM_LOOP_START_NODE
            || node.type === constants_4.CUSTOM_NOTE_NODE) {
            return;
        }
        dragNodeStartPosition.current = {
            x: node.position.x,
            y: node.position.y,
        };
    }, [workflowStore, getNodesReadOnly]);
    const handleNodeDrag = (0, react_1.useCallback)((e, node) => {
        if (getNodesReadOnly())
            return;
        if (node.type === constants_2.CUSTOM_ITERATION_START_NODE)
            return;
        if (node.type === constants_3.CUSTOM_LOOP_START_NODE)
            return;
        const { getNodes, setNodes } = store.getState();
        e.stopPropagation();
        const nodes = getNodes();
        const { restrictPosition } = handleNodeIterationChildDrag(node);
        const { restrictPosition: restrictLoopPosition } = handleNodeLoopChildDrag(node);
        const { showHorizontalHelpLineNodes, showVerticalHelpLineNodes } = handleSetHelpline(node);
        const showHorizontalHelpLineNodesLength = showHorizontalHelpLineNodes.length;
        const showVerticalHelpLineNodesLength = showVerticalHelpLineNodes.length;
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            const currentNode = draft.find(n => n.id === node.id);
            // Check if current dragging node is an entry node
            const isCurrentEntryNode = (0, types_1.isTriggerNode)(node.data.type) || node.data.type === types_1.BlockEnum.Start;
            // X-axis alignment with offset consideration
            if (showVerticalHelpLineNodesLength > 0) {
                const targetNode = showVerticalHelpLineNodes[0];
                const isTargetEntryNode = (0, types_1.isTriggerNode)(targetNode.data.type) || targetNode.data.type === types_1.BlockEnum.Start;
                // Calculate the wrapper position needed to align the inner nodes
                // Target inner position = target.position + target.offset
                // Current inner position should equal target inner position
                // So: current.position + current.offset = target.position + target.offset
                // Therefore: current.position = target.position + target.offset - current.offset
                const targetOffset = isTargetEntryNode ? ENTRY_NODE_WRAPPER_OFFSET.x : 0;
                const currentOffset = isCurrentEntryNode ? ENTRY_NODE_WRAPPER_OFFSET.x : 0;
                currentNode.position.x = targetNode.position.x + targetOffset - currentOffset;
            }
            else if (restrictPosition.x !== undefined) {
                currentNode.position.x = restrictPosition.x;
            }
            else if (restrictLoopPosition.x !== undefined) {
                currentNode.position.x = restrictLoopPosition.x;
            }
            else {
                currentNode.position.x = node.position.x;
            }
            // Y-axis alignment with offset consideration
            if (showHorizontalHelpLineNodesLength > 0) {
                const targetNode = showHorizontalHelpLineNodes[0];
                const isTargetEntryNode = (0, types_1.isTriggerNode)(targetNode.data.type) || targetNode.data.type === types_1.BlockEnum.Start;
                const targetOffset = isTargetEntryNode ? ENTRY_NODE_WRAPPER_OFFSET.y : 0;
                const currentOffset = isCurrentEntryNode ? ENTRY_NODE_WRAPPER_OFFSET.y : 0;
                currentNode.position.y = targetNode.position.y + targetOffset - currentOffset;
            }
            else if (restrictPosition.y !== undefined) {
                currentNode.position.y = restrictPosition.y;
            }
            else if (restrictLoopPosition.y !== undefined) {
                currentNode.position.y = restrictLoopPosition.y;
            }
            else {
                currentNode.position.y = node.position.y;
            }
        });
        setNodes(newNodes);
    }, [
        getNodesReadOnly,
        store,
        handleNodeIterationChildDrag,
        handleNodeLoopChildDrag,
        handleSetHelpline,
    ]);
    const handleNodeDragStop = (0, react_1.useCallback)((_, node) => {
        const { setHelpLineHorizontal, setHelpLineVertical } = workflowStore.getState();
        if (getNodesReadOnly())
            return;
        const { x, y } = dragNodeStartPosition.current;
        if (!(x === node.position.x && y === node.position.y)) {
            setHelpLineHorizontal();
            setHelpLineVertical();
            handleSyncWorkflowDraft();
            if (x !== 0 && y !== 0) {
                // selecting a note will trigger a drag stop event with x and y as 0
                saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodeDragStop, {
                    nodeId: node.id,
                });
            }
        }
    }, [
        workflowStore,
        getNodesReadOnly,
        saveStateToHistory,
        handleSyncWorkflowDraft,
    ]);
    const handleNodeEnter = (0, react_1.useCallback)((_, node) => {
        if (getNodesReadOnly())
            return;
        if (node.type === constants_4.CUSTOM_NOTE_NODE
            || node.type === constants_2.CUSTOM_ITERATION_START_NODE) {
            return;
        }
        if (node.type === constants_3.CUSTOM_LOOP_START_NODE
            || node.type === constants_4.CUSTOM_NOTE_NODE) {
            return;
        }
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        const { connectingNodePayload, setEnteringNodePayload } = workflowStore.getState();
        if (connectingNodePayload) {
            if (connectingNodePayload.nodeId === node.id)
                return;
            const connectingNode = nodes.find(n => n.id === connectingNodePayload.nodeId);
            const sameLevel = connectingNode.parentId === node.parentId;
            if (sameLevel) {
                setEnteringNodePayload({
                    nodeId: node.id,
                    nodeData: node.data,
                });
                const fromType = connectingNodePayload.handleType;
                const newNodes = (0, immer_1.produce)(nodes, (draft) => {
                    draft.forEach((n) => {
                        if (n.id === node.id
                            && fromType === 'source'
                            && (node.data.type === types_1.BlockEnum.VariableAssigner
                                || node.data.type === types_1.BlockEnum.VariableAggregator)) {
                            if (!node.data.advanced_settings?.group_enabled)
                                n.data._isEntering = true;
                        }
                        if (n.id === node.id
                            && fromType === 'target'
                            && (connectingNode.data.type === types_1.BlockEnum.VariableAssigner
                                || connectingNode.data.type === types_1.BlockEnum.VariableAggregator)
                            && node.data.type !== types_1.BlockEnum.IfElse
                            && node.data.type !== types_1.BlockEnum.QuestionClassifier) {
                            n.data._isEntering = true;
                        }
                    });
                });
                setNodes(newNodes);
            }
        }
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            const connectedEdges = (0, reactflow_1.getConnectedEdges)([node], edges);
            connectedEdges.forEach((edge) => {
                const currentEdge = draft.find(e => e.id === edge.id);
                if (currentEdge)
                    currentEdge.data._connectedNodeIsHovering = true;
            });
        });
        setEdges(newEdges);
    }, [store, workflowStore, getNodesReadOnly]);
    const handleNodeLeave = (0, react_1.useCallback)((_, node) => {
        if (getNodesReadOnly())
            return;
        if (node.type === constants_4.CUSTOM_NOTE_NODE
            || node.type === constants_2.CUSTOM_ITERATION_START_NODE) {
            return;
        }
        if (node.type === constants_4.CUSTOM_NOTE_NODE
            || node.type === constants_3.CUSTOM_LOOP_START_NODE) {
            return;
        }
        const { setEnteringNodePayload } = workflowStore.getState();
        setEnteringNodePayload(undefined);
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const newNodes = (0, immer_1.produce)(getNodes(), (draft) => {
            draft.forEach((node) => {
                node.data._isEntering = false;
            });
        });
        setNodes(newNodes);
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            draft.forEach((edge) => {
                edge.data._connectedNodeIsHovering = false;
            });
        });
        setEdges(newEdges);
    }, [store, workflowStore, getNodesReadOnly]);
    const handleNodeSelect = (0, react_1.useCallback)((nodeId, cancelSelection, initShowLastRunTab) => {
        if (initShowLastRunTab)
            workflowStore.setState({ initShowLastRunTab: true });
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        const selectedNode = nodes.find(node => node.data.selected);
        if (!cancelSelection && selectedNode?.id === nodeId)
            return;
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((node) => {
                if (node.id === nodeId)
                    node.data.selected = !cancelSelection;
                else
                    node.data.selected = false;
            });
        });
        setNodes(newNodes);
        const connectedEdges = (0, reactflow_1.getConnectedEdges)([{ id: nodeId }], edges).map(edge => edge.id);
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            draft.forEach((edge) => {
                if (connectedEdges.includes(edge.id)) {
                    edge.data = {
                        ...edge.data,
                        _connectedNodeIsSelected: !cancelSelection,
                    };
                }
                else {
                    edge.data = {
                        ...edge.data,
                        _connectedNodeIsSelected: false,
                    };
                }
            });
        });
        setEdges(newEdges);
        handleSyncWorkflowDraft();
    }, [store, handleSyncWorkflowDraft]);
    const handleNodeClick = (0, react_1.useCallback)((_, node) => {
        if (node.type === constants_2.CUSTOM_ITERATION_START_NODE)
            return;
        if (node.type === constants_3.CUSTOM_LOOP_START_NODE)
            return;
        if (node.data.type === types_1.BlockEnum.DataSourceEmpty)
            return;
        if (node.data._pluginInstallLocked)
            return;
        handleNodeSelect(node.id);
    }, [handleNodeSelect]);
    const handleNodeConnect = (0, react_1.useCallback)(({ source, sourceHandle, target, targetHandle }) => {
        if (source === target)
            return;
        if (getNodesReadOnly())
            return;
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        const targetNode = nodes.find(node => node.id === target);
        const sourceNode = nodes.find(node => node.id === source);
        if (targetNode?.parentId !== sourceNode?.parentId)
            return;
        if (sourceNode?.type === constants_4.CUSTOM_NOTE_NODE
            || targetNode?.type === constants_4.CUSTOM_NOTE_NODE) {
            return;
        }
        if (edges.find(edge => edge.source === source
            && edge.sourceHandle === sourceHandle
            && edge.target === target
            && edge.targetHandle === targetHandle)) {
            return;
        }
        const parendNode = nodes.find(node => node.id === targetNode?.parentId);
        const isInIteration = parendNode && parendNode.data.type === types_1.BlockEnum.Iteration;
        const isInLoop = !!parendNode && parendNode.data.type === types_1.BlockEnum.Loop;
        const newEdge = {
            id: `${source}-${sourceHandle}-${target}-${targetHandle}`,
            type: constants_1.CUSTOM_EDGE,
            source: source,
            target: target,
            sourceHandle,
            targetHandle,
            data: {
                sourceType: nodes.find(node => node.id === source).data.type,
                targetType: nodes.find(node => node.id === target).data.type,
                isInIteration,
                iteration_id: isInIteration ? targetNode?.parentId : undefined,
                isInLoop,
                loop_id: isInLoop ? targetNode?.parentId : undefined,
            },
            zIndex: targetNode?.parentId
                ? isInIteration
                    ? constants_1.ITERATION_CHILDREN_Z_INDEX
                    : constants_1.LOOP_CHILDREN_Z_INDEX
                : 0,
        };
        const nodesConnectedSourceOrTargetHandleIdsMap = (0, utils_2.getNodesConnectedSourceOrTargetHandleIdsMap)([{ type: 'add', edge: newEdge }], nodes);
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((node) => {
                if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
                    node.data = {
                        ...node.data,
                        ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
                    };
                }
            });
        });
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            draft.push(newEdge);
        });
        setNodes(newNodes);
        setEdges(newEdges);
        handleSyncWorkflowDraft();
        saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodeConnect, {
            nodeId: targetNode?.id,
        });
    }, [
        getNodesReadOnly,
        store,
        workflowStore,
        handleSyncWorkflowDraft,
        saveStateToHistory,
    ]);
    const handleNodeConnectStart = (0, react_1.useCallback)((_, { nodeId, handleType, handleId }) => {
        if (getNodesReadOnly())
            return;
        if (nodeId && handleType) {
            const { setConnectingNodePayload } = workflowStore.getState();
            const { getNodes } = store.getState();
            const node = getNodes().find(n => n.id === nodeId);
            if (node.type === constants_4.CUSTOM_NOTE_NODE)
                return;
            if (node.data.type === types_1.BlockEnum.VariableAggregator
                || node.data.type === types_1.BlockEnum.VariableAssigner) {
                if (handleType === 'target')
                    return;
            }
            setConnectingNodePayload({
                nodeId,
                nodeType: node.data.type,
                handleType,
                handleId,
            });
        }
    }, [store, workflowStore, getNodesReadOnly]);
    const handleNodeConnectEnd = (0, react_1.useCallback)((e) => {
        if (getNodesReadOnly())
            return;
        const { connectingNodePayload, setConnectingNodePayload, enteringNodePayload, setEnteringNodePayload, } = workflowStore.getState();
        if (connectingNodePayload && enteringNodePayload) {
            const { setShowAssignVariablePopup, hoveringAssignVariableGroupId } = workflowStore.getState();
            const { screenToFlowPosition } = reactflow;
            const { getNodes, setNodes } = store.getState();
            const nodes = getNodes();
            const fromHandleType = connectingNodePayload.handleType;
            const fromHandleId = connectingNodePayload.handleId;
            const fromNode = nodes.find(n => n.id === connectingNodePayload.nodeId);
            const toNode = nodes.find(n => n.id === enteringNodePayload.nodeId);
            const toParentNode = nodes.find(n => n.id === toNode.parentId);
            if (fromNode.parentId !== toNode.parentId)
                return;
            const { x, y } = screenToFlowPosition({ x: e.x, y: e.y });
            if (fromHandleType === 'source'
                && (toNode.data.type === types_1.BlockEnum.VariableAssigner
                    || toNode.data.type === types_1.BlockEnum.VariableAggregator)) {
                const groupEnabled = toNode.data.advanced_settings?.group_enabled;
                const firstGroupId = toNode.data.advanced_settings?.groups[0].groupId;
                let handleId = 'target';
                if (groupEnabled) {
                    if (hoveringAssignVariableGroupId)
                        handleId = hoveringAssignVariableGroupId;
                    else
                        handleId = firstGroupId;
                }
                const newNodes = (0, immer_1.produce)(nodes, (draft) => {
                    draft.forEach((node) => {
                        if (node.id === toNode.id) {
                            node.data._showAddVariablePopup = true;
                            node.data._holdAddVariablePopup = true;
                        }
                    });
                });
                setNodes(newNodes);
                setShowAssignVariablePopup({
                    nodeId: fromNode.id,
                    nodeData: fromNode.data,
                    variableAssignerNodeId: toNode.id,
                    variableAssignerNodeData: toNode.data,
                    variableAssignerNodeHandleId: handleId,
                    parentNode: toParentNode,
                    x: x - toNode.positionAbsolute.x,
                    y: y - toNode.positionAbsolute.y,
                });
                handleNodeConnect({
                    source: fromNode.id,
                    sourceHandle: fromHandleId,
                    target: toNode.id,
                    targetHandle: 'target',
                });
            }
        }
        setConnectingNodePayload(undefined);
        setEnteringNodePayload(undefined);
    }, [store, handleNodeConnect, getNodesReadOnly, workflowStore, reactflow]);
    const { deleteNodeInspectorVars } = (0, use_inspect_vars_crud_1.default)();
    const handleNodeDelete = (0, react_1.useCallback)((nodeId) => {
        if (getNodesReadOnly())
            return;
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        const currentNodeIndex = nodes.findIndex(node => node.id === nodeId);
        const currentNode = nodes[currentNodeIndex];
        if (!currentNode)
            return;
        if (nodesMetaDataMap?.[currentNode.data.type]?.metaData
            .isUndeletable) {
            return;
        }
        deleteNodeInspectorVars(nodeId);
        if (currentNode.data.type === types_1.BlockEnum.Iteration) {
            const iterationChildren = nodes.filter(node => node.parentId === currentNode.id);
            if (iterationChildren.length) {
                if (currentNode.data._isBundled) {
                    iterationChildren.forEach((child) => {
                        handleNodeDelete(child.id);
                    });
                    return handleNodeDelete(nodeId);
                }
                else {
                    if (iterationChildren.length === 1) {
                        handleNodeDelete(iterationChildren[0].id);
                        handleNodeDelete(nodeId);
                        return;
                    }
                    const { setShowConfirm, showConfirm } = workflowStore.getState();
                    if (!showConfirm) {
                        setShowConfirm({
                            title: t('nodes.iteration.deleteTitle', { ns: 'workflow' }),
                            desc: t('nodes.iteration.deleteDesc', { ns: 'workflow' }) || '',
                            onConfirm: () => {
                                iterationChildren.forEach((child) => {
                                    handleNodeDelete(child.id);
                                });
                                handleNodeDelete(nodeId);
                                handleSyncWorkflowDraft();
                                setShowConfirm(undefined);
                            },
                        });
                        return;
                    }
                }
            }
        }
        if (currentNode.data.type === types_1.BlockEnum.Loop) {
            const loopChildren = nodes.filter(node => node.parentId === currentNode.id);
            if (loopChildren.length) {
                if (currentNode.data._isBundled) {
                    loopChildren.forEach((child) => {
                        handleNodeDelete(child.id);
                    });
                    return handleNodeDelete(nodeId);
                }
                else {
                    if (loopChildren.length === 1) {
                        handleNodeDelete(loopChildren[0].id);
                        handleNodeDelete(nodeId);
                        return;
                    }
                    const { setShowConfirm, showConfirm } = workflowStore.getState();
                    if (!showConfirm) {
                        setShowConfirm({
                            title: t('nodes.loop.deleteTitle', { ns: 'workflow' }),
                            desc: t('nodes.loop.deleteDesc', { ns: 'workflow' }) || '',
                            onConfirm: () => {
                                loopChildren.forEach((child) => {
                                    handleNodeDelete(child.id);
                                });
                                handleNodeDelete(nodeId);
                                handleSyncWorkflowDraft();
                                setShowConfirm(undefined);
                            },
                        });
                        return;
                    }
                }
            }
        }
        if (currentNode.data.type === types_1.BlockEnum.DataSource) {
            const { id } = currentNode;
            const { ragPipelineVariables, setRagPipelineVariables } = workflowStore.getState();
            if (ragPipelineVariables && setRagPipelineVariables) {
                const newRagPipelineVariables = [];
                ragPipelineVariables.forEach((variable) => {
                    if (variable.belong_to_node_id === id)
                        return;
                    newRagPipelineVariables.push(variable);
                });
                setRagPipelineVariables(newRagPipelineVariables);
            }
        }
        const connectedEdges = (0, reactflow_1.getConnectedEdges)([{ id: nodeId }], edges);
        const nodesConnectedSourceOrTargetHandleIdsMap = (0, utils_2.getNodesConnectedSourceOrTargetHandleIdsMap)(connectedEdges.map(edge => ({ type: 'remove', edge })), nodes);
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((node) => {
                if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
                    node.data = {
                        ...node.data,
                        ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
                    };
                }
                if (node.id === currentNode.parentId) {
                    node.data._children = node.data._children?.filter(child => child.nodeId !== nodeId);
                }
            });
            draft.splice(currentNodeIndex, 1);
        });
        setNodes(newNodes);
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            return draft.filter(edge => !connectedEdges.find(connectedEdge => connectedEdge.id === edge.id));
        });
        setEdges(newEdges);
        handleSyncWorkflowDraft();
        if (currentNode.type === constants_4.CUSTOM_NOTE_NODE) {
            saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NoteDelete, {
                nodeId: currentNode.id,
            });
        }
        else {
            saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodeDelete, {
                nodeId: currentNode.id,
            });
        }
    }, [
        getNodesReadOnly,
        store,
        handleSyncWorkflowDraft,
        saveStateToHistory,
        workflowStore,
        t,
        nodesMetaDataMap,
        deleteNodeInspectorVars,
    ]);
    const handleNodeAdd = (0, react_1.useCallback)(({ nodeType, sourceHandle = 'source', targetHandle = 'target', pluginDefaultValue, }, { prevNodeId, prevNodeSourceHandle, nextNodeId, nextNodeTargetHandle }) => {
        if (getNodesReadOnly())
            return;
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        const nodesWithSameType = nodes.filter(node => node.data.type === nodeType);
        const { defaultValue } = nodesMetaDataMap[nodeType];
        const { newNode, newIterationStartNode, newLoopStartNode } = (0, utils_2.generateNewNode)({
            type: (0, utils_2.getNodeCustomTypeByNodeDataType)(nodeType),
            data: {
                ...defaultValue,
                title: nodesWithSameType.length > 0
                    ? `${defaultValue.title} ${nodesWithSameType.length + 1}`
                    : defaultValue.title,
                ...pluginDefaultValue,
                selected: true,
                _showAddVariablePopup: (nodeType === types_1.BlockEnum.VariableAssigner
                    || nodeType === types_1.BlockEnum.VariableAggregator)
                    && !!prevNodeId,
                _holdAddVariablePopup: false,
            },
            position: {
                x: 0,
                y: 0,
            },
        });
        if (prevNodeId && !nextNodeId) {
            const prevNodeIndex = nodes.findIndex(node => node.id === prevNodeId);
            const prevNode = nodes[prevNodeIndex];
            const outgoers = (0, reactflow_1.getOutgoers)(prevNode, nodes, edges).sort((a, b) => a.position.y - b.position.y);
            const lastOutgoer = outgoers[outgoers.length - 1];
            newNode.data._connectedTargetHandleIds
                = nodeType === types_1.BlockEnum.DataSource ? [] : [targetHandle];
            newNode.data._connectedSourceHandleIds = [];
            newNode.position = {
                x: lastOutgoer
                    ? lastOutgoer.position.x
                    : prevNode.position.x + prevNode.width + constants_1.X_OFFSET,
                y: lastOutgoer
                    ? lastOutgoer.position.y + lastOutgoer.height + constants_1.Y_OFFSET
                    : prevNode.position.y,
            };
            newNode.parentId = prevNode.parentId;
            newNode.extent = prevNode.extent;
            const parentNode = nodes.find(node => node.id === prevNode.parentId) || null;
            const isInIteration = !!parentNode && parentNode.data.type === types_1.BlockEnum.Iteration;
            const isInLoop = !!parentNode && parentNode.data.type === types_1.BlockEnum.Loop;
            if (prevNode.parentId) {
                newNode.data.isInIteration = isInIteration;
                newNode.data.isInLoop = isInLoop;
                if (isInIteration) {
                    newNode.data.iteration_id = parentNode.id;
                    newNode.zIndex = constants_1.ITERATION_CHILDREN_Z_INDEX;
                }
                if (isInLoop) {
                    newNode.data.loop_id = parentNode.id;
                    newNode.zIndex = constants_1.LOOP_CHILDREN_Z_INDEX;
                }
                if (isInIteration
                    && (newNode.data.type === types_1.BlockEnum.Answer
                        || newNode.data.type === types_1.BlockEnum.Tool
                        || newNode.data.type === types_1.BlockEnum.Assigner)) {
                    const iterNodeData = parentNode.data;
                    iterNodeData._isShowTips = true;
                }
                if (isInLoop
                    && (newNode.data.type === types_1.BlockEnum.Answer
                        || newNode.data.type === types_1.BlockEnum.Tool
                        || newNode.data.type === types_1.BlockEnum.Assigner)) {
                    const iterNodeData = parentNode.data;
                    iterNodeData._isShowTips = true;
                }
            }
            let newEdge = null;
            if (nodeType !== types_1.BlockEnum.DataSource) {
                newEdge = {
                    id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
                    type: constants_1.CUSTOM_EDGE,
                    source: prevNodeId,
                    sourceHandle: prevNodeSourceHandle,
                    target: newNode.id,
                    targetHandle,
                    data: {
                        sourceType: prevNode.data.type,
                        targetType: newNode.data.type,
                        isInIteration,
                        isInLoop,
                        iteration_id: isInIteration ? prevNode.parentId : undefined,
                        loop_id: isInLoop ? prevNode.parentId : undefined,
                        _connectedNodeIsSelected: true,
                    },
                    zIndex: prevNode.parentId
                        ? isInIteration
                            ? constants_1.ITERATION_CHILDREN_Z_INDEX
                            : constants_1.LOOP_CHILDREN_Z_INDEX
                        : 0,
                };
            }
            const nodesConnectedSourceOrTargetHandleIdsMap = (0, utils_2.getNodesConnectedSourceOrTargetHandleIdsMap)((newEdge ? [{ type: 'add', edge: newEdge }] : []), nodes);
            const newNodes = (0, immer_1.produce)(nodes, (draft) => {
                draft.forEach((node) => {
                    node.data.selected = false;
                    if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
                        node.data = {
                            ...node.data,
                            ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
                        };
                    }
                    if (node.data.type === types_1.BlockEnum.Iteration
                        && prevNode.parentId === node.id) {
                        node.data._children?.push({
                            nodeId: newNode.id,
                            nodeType: newNode.data.type,
                        });
                    }
                    if (node.data.type === types_1.BlockEnum.Loop
                        && prevNode.parentId === node.id) {
                        node.data._children?.push({
                            nodeId: newNode.id,
                            nodeType: newNode.data.type,
                        });
                    }
                });
                draft.push(newNode);
                if (newIterationStartNode)
                    draft.push(newIterationStartNode);
                if (newLoopStartNode)
                    draft.push(newLoopStartNode);
            });
            if (newNode.data.type === types_1.BlockEnum.VariableAssigner
                || newNode.data.type === types_1.BlockEnum.VariableAggregator) {
                const { setShowAssignVariablePopup } = workflowStore.getState();
                setShowAssignVariablePopup({
                    nodeId: prevNode.id,
                    nodeData: prevNode.data,
                    variableAssignerNodeId: newNode.id,
                    variableAssignerNodeData: newNode.data,
                    variableAssignerNodeHandleId: targetHandle,
                    parentNode: nodes.find(node => node.id === newNode.parentId),
                    x: -25,
                    y: 44,
                });
            }
            const newEdges = (0, immer_1.produce)(edges, (draft) => {
                draft.forEach((item) => {
                    item.data = {
                        ...item.data,
                        _connectedNodeIsSelected: false,
                    };
                });
                if (newEdge)
                    draft.push(newEdge);
            });
            setNodes(newNodes);
            setEdges(newEdges);
        }
        if (!prevNodeId && nextNodeId) {
            const nextNodeIndex = nodes.findIndex(node => node.id === nextNodeId);
            const nextNode = nodes[nextNodeIndex];
            if (nodeType !== types_1.BlockEnum.IfElse
                && nodeType !== types_1.BlockEnum.QuestionClassifier) {
                newNode.data._connectedSourceHandleIds = [sourceHandle];
            }
            newNode.data._connectedTargetHandleIds = [];
            newNode.position = {
                x: nextNode.position.x,
                y: nextNode.position.y,
            };
            newNode.parentId = nextNode.parentId;
            newNode.extent = nextNode.extent;
            const parentNode = nodes.find(node => node.id === nextNode.parentId) || null;
            const isInIteration = !!parentNode && parentNode.data.type === types_1.BlockEnum.Iteration;
            const isInLoop = !!parentNode && parentNode.data.type === types_1.BlockEnum.Loop;
            if (parentNode && nextNode.parentId) {
                newNode.data.isInIteration = isInIteration;
                newNode.data.isInLoop = isInLoop;
                if (isInIteration) {
                    newNode.data.iteration_id = parentNode.id;
                    newNode.zIndex = constants_1.ITERATION_CHILDREN_Z_INDEX;
                }
                if (isInLoop) {
                    newNode.data.loop_id = parentNode.id;
                    newNode.zIndex = constants_1.LOOP_CHILDREN_Z_INDEX;
                }
            }
            let newEdge;
            if (nodeType !== types_1.BlockEnum.IfElse
                && nodeType !== types_1.BlockEnum.QuestionClassifier
                && nodeType !== types_1.BlockEnum.LoopEnd) {
                newEdge = {
                    id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
                    type: constants_1.CUSTOM_EDGE,
                    source: newNode.id,
                    sourceHandle,
                    target: nextNodeId,
                    targetHandle: nextNodeTargetHandle,
                    data: {
                        sourceType: newNode.data.type,
                        targetType: nextNode.data.type,
                        isInIteration,
                        isInLoop,
                        iteration_id: isInIteration ? nextNode.parentId : undefined,
                        loop_id: isInLoop ? nextNode.parentId : undefined,
                        _connectedNodeIsSelected: true,
                    },
                    zIndex: nextNode.parentId
                        ? isInIteration
                            ? constants_1.ITERATION_CHILDREN_Z_INDEX
                            : constants_1.LOOP_CHILDREN_Z_INDEX
                        : 0,
                };
            }
            let nodesConnectedSourceOrTargetHandleIdsMap;
            if (newEdge) {
                nodesConnectedSourceOrTargetHandleIdsMap
                    = (0, utils_2.getNodesConnectedSourceOrTargetHandleIdsMap)([{ type: 'add', edge: newEdge }], nodes);
            }
            const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId);
            const afterNodesInSameBranchIds = afterNodesInSameBranch.map(node => node.id);
            const newNodes = (0, immer_1.produce)(nodes, (draft) => {
                draft.forEach((node) => {
                    node.data.selected = false;
                    if (afterNodesInSameBranchIds.includes(node.id))
                        node.position.x += constants_1.NODE_WIDTH_X_OFFSET;
                    if (nodesConnectedSourceOrTargetHandleIdsMap?.[node.id]) {
                        node.data = {
                            ...node.data,
                            ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
                        };
                    }
                    if (node.data.type === types_1.BlockEnum.Iteration
                        && nextNode.parentId === node.id) {
                        node.data._children?.push({
                            nodeId: newNode.id,
                            nodeType: newNode.data.type,
                        });
                    }
                    if (node.data.type === types_1.BlockEnum.Iteration
                        && node.data.start_node_id === nextNodeId) {
                        node.data.start_node_id = newNode.id;
                        node.data.startNodeType = newNode.data.type;
                    }
                    if (node.data.type === types_1.BlockEnum.Loop
                        && nextNode.parentId === node.id) {
                        node.data._children?.push({
                            nodeId: newNode.id,
                            nodeType: newNode.data.type,
                        });
                    }
                    if (node.data.type === types_1.BlockEnum.Loop
                        && node.data.start_node_id === nextNodeId) {
                        node.data.start_node_id = newNode.id;
                        node.data.startNodeType = newNode.data.type;
                    }
                });
                draft.push(newNode);
                if (newIterationStartNode)
                    draft.push(newIterationStartNode);
                if (newLoopStartNode)
                    draft.push(newLoopStartNode);
            });
            if (newEdge) {
                const newEdges = (0, immer_1.produce)(edges, (draft) => {
                    draft.forEach((item) => {
                        item.data = {
                            ...item.data,
                            _connectedNodeIsSelected: false,
                        };
                    });
                    draft.push(newEdge);
                });
                setNodes(newNodes);
                setEdges(newEdges);
            }
            else {
                setNodes(newNodes);
            }
        }
        if (prevNodeId && nextNodeId) {
            const prevNode = nodes.find(node => node.id === prevNodeId);
            const nextNode = nodes.find(node => node.id === nextNodeId);
            newNode.data._connectedTargetHandleIds
                = nodeType === types_1.BlockEnum.DataSource ? [] : [targetHandle];
            newNode.data._connectedSourceHandleIds = [sourceHandle];
            newNode.position = {
                x: nextNode.position.x,
                y: nextNode.position.y,
            };
            newNode.parentId = prevNode.parentId;
            newNode.extent = prevNode.extent;
            const parentNode = nodes.find(node => node.id === prevNode.parentId) || null;
            const isInIteration = !!parentNode && parentNode.data.type === types_1.BlockEnum.Iteration;
            const isInLoop = !!parentNode && parentNode.data.type === types_1.BlockEnum.Loop;
            if (parentNode && prevNode.parentId) {
                newNode.data.isInIteration = isInIteration;
                newNode.data.isInLoop = isInLoop;
                if (isInIteration) {
                    newNode.data.iteration_id = parentNode.id;
                    newNode.zIndex = constants_1.ITERATION_CHILDREN_Z_INDEX;
                }
                if (isInLoop) {
                    newNode.data.loop_id = parentNode.id;
                    newNode.zIndex = constants_1.LOOP_CHILDREN_Z_INDEX;
                }
            }
            const currentEdgeIndex = edges.findIndex(edge => edge.source === prevNodeId && edge.target === nextNodeId);
            let newPrevEdge = null;
            if (nodeType !== types_1.BlockEnum.DataSource) {
                newPrevEdge = {
                    id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
                    type: constants_1.CUSTOM_EDGE,
                    source: prevNodeId,
                    sourceHandle: prevNodeSourceHandle,
                    target: newNode.id,
                    targetHandle,
                    data: {
                        sourceType: prevNode.data.type,
                        targetType: newNode.data.type,
                        isInIteration,
                        isInLoop,
                        iteration_id: isInIteration ? prevNode.parentId : undefined,
                        loop_id: isInLoop ? prevNode.parentId : undefined,
                        _connectedNodeIsSelected: true,
                    },
                    zIndex: prevNode.parentId
                        ? isInIteration
                            ? constants_1.ITERATION_CHILDREN_Z_INDEX
                            : constants_1.LOOP_CHILDREN_Z_INDEX
                        : 0,
                };
            }
            let newNextEdge = null;
            const nextNodeParentNode = nodes.find(node => node.id === nextNode.parentId) || null;
            const isNextNodeInIteration = !!nextNodeParentNode
                && nextNodeParentNode.data.type === types_1.BlockEnum.Iteration;
            const isNextNodeInLoop = !!nextNodeParentNode
                && nextNodeParentNode.data.type === types_1.BlockEnum.Loop;
            if (nodeType !== types_1.BlockEnum.IfElse
                && nodeType !== types_1.BlockEnum.QuestionClassifier
                && nodeType !== types_1.BlockEnum.LoopEnd) {
                newNextEdge = {
                    id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
                    type: constants_1.CUSTOM_EDGE,
                    source: newNode.id,
                    sourceHandle,
                    target: nextNodeId,
                    targetHandle: nextNodeTargetHandle,
                    data: {
                        sourceType: newNode.data.type,
                        targetType: nextNode.data.type,
                        isInIteration: isNextNodeInIteration,
                        isInLoop: isNextNodeInLoop,
                        iteration_id: isNextNodeInIteration
                            ? nextNode.parentId
                            : undefined,
                        loop_id: isNextNodeInLoop ? nextNode.parentId : undefined,
                        _connectedNodeIsSelected: true,
                    },
                    zIndex: nextNode.parentId
                        ? isNextNodeInIteration
                            ? constants_1.ITERATION_CHILDREN_Z_INDEX
                            : constants_1.LOOP_CHILDREN_Z_INDEX
                        : 0,
                };
            }
            const nodesConnectedSourceOrTargetHandleIdsMap = (0, utils_2.getNodesConnectedSourceOrTargetHandleIdsMap)([
                { type: 'remove', edge: edges[currentEdgeIndex] },
                ...(newPrevEdge ? [{ type: 'add', edge: newPrevEdge }] : []),
                ...(newNextEdge ? [{ type: 'add', edge: newNextEdge }] : []),
            ], [...nodes, newNode]);
            const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId);
            const afterNodesInSameBranchIds = afterNodesInSameBranch.map(node => node.id);
            const newNodes = (0, immer_1.produce)(nodes, (draft) => {
                draft.forEach((node) => {
                    node.data.selected = false;
                    if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
                        node.data = {
                            ...node.data,
                            ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
                        };
                    }
                    if (afterNodesInSameBranchIds.includes(node.id))
                        node.position.x += constants_1.NODE_WIDTH_X_OFFSET;
                    if (node.data.type === types_1.BlockEnum.Iteration
                        && prevNode.parentId === node.id) {
                        node.data._children?.push({
                            nodeId: newNode.id,
                            nodeType: newNode.data.type,
                        });
                    }
                    if (node.data.type === types_1.BlockEnum.Loop
                        && prevNode.parentId === node.id) {
                        node.data._children?.push({
                            nodeId: newNode.id,
                            nodeType: newNode.data.type,
                        });
                    }
                });
                draft.push(newNode);
                if (newIterationStartNode)
                    draft.push(newIterationStartNode);
                if (newLoopStartNode)
                    draft.push(newLoopStartNode);
            });
            setNodes(newNodes);
            if (newNode.data.type === types_1.BlockEnum.VariableAssigner
                || newNode.data.type === types_1.BlockEnum.VariableAggregator) {
                const { setShowAssignVariablePopup } = workflowStore.getState();
                setShowAssignVariablePopup({
                    nodeId: prevNode.id,
                    nodeData: prevNode.data,
                    variableAssignerNodeId: newNode.id,
                    variableAssignerNodeData: newNode.data,
                    variableAssignerNodeHandleId: targetHandle,
                    parentNode: nodes.find(node => node.id === newNode.parentId),
                    x: -25,
                    y: 44,
                });
            }
            const newEdges = (0, immer_1.produce)(edges, (draft) => {
                draft.splice(currentEdgeIndex, 1);
                draft.forEach((item) => {
                    item.data = {
                        ...item.data,
                        _connectedNodeIsSelected: false,
                    };
                });
                if (newPrevEdge)
                    draft.push(newPrevEdge);
                if (newNextEdge)
                    draft.push(newNextEdge);
            });
            setEdges(newEdges);
        }
        handleSyncWorkflowDraft();
        saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodeAdd, { nodeId: newNode.id });
    }, [
        getNodesReadOnly,
        store,
        handleSyncWorkflowDraft,
        saveStateToHistory,
        workflowStore,
        getAfterNodesInSameBranch,
        nodesMetaDataMap,
    ]);
    const handleNodeChange = (0, react_1.useCallback)((currentNodeId, nodeType, sourceHandle, pluginDefaultValue) => {
        if (getNodesReadOnly())
            return;
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        const currentNode = nodes.find(node => node.id === currentNodeId);
        const connectedEdges = (0, reactflow_1.getConnectedEdges)([currentNode], edges);
        const nodesWithSameType = nodes.filter(node => node.data.type === nodeType);
        const { defaultValue } = nodesMetaDataMap[nodeType];
        const { newNode: newCurrentNode, newIterationStartNode, newLoopStartNode, } = (0, utils_2.generateNewNode)({
            type: (0, utils_2.getNodeCustomTypeByNodeDataType)(nodeType),
            data: {
                ...defaultValue,
                title: nodesWithSameType.length > 0
                    ? `${defaultValue.title} ${nodesWithSameType.length + 1}`
                    : defaultValue.title,
                ...pluginDefaultValue,
                _connectedSourceHandleIds: [],
                _connectedTargetHandleIds: [],
                selected: currentNode.data.selected,
                isInIteration: currentNode.data.isInIteration,
                isInLoop: currentNode.data.isInLoop,
                iteration_id: currentNode.data.iteration_id,
                loop_id: currentNode.data.loop_id,
            },
            position: {
                x: currentNode.position.x,
                y: currentNode.position.y,
            },
            parentId: currentNode.parentId,
            extent: currentNode.extent,
            zIndex: currentNode.zIndex,
        });
        const nodesConnectedSourceOrTargetHandleIdsMap = (0, utils_2.getNodesConnectedSourceOrTargetHandleIdsMap)(connectedEdges.map(edge => ({ type: 'remove', edge })), nodes);
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((node) => {
                node.data.selected = false;
                if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
                    node.data = {
                        ...node.data,
                        ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
                    };
                }
            });
            const index = draft.findIndex(node => node.id === currentNodeId);
            draft.splice(index, 1, newCurrentNode);
            if (newIterationStartNode)
                draft.push(newIterationStartNode);
            if (newLoopStartNode)
                draft.push(newLoopStartNode);
        });
        setNodes(newNodes);
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            const filtered = draft.filter(edge => !connectedEdges.find(connectedEdge => connectedEdge.id === edge.id));
            return filtered;
        });
        setEdges(newEdges);
        if (nodeType === types_1.BlockEnum.TriggerWebhook) {
            handleSyncWorkflowDraft(true, true, {
                onSuccess: () => autoGenerateWebhookUrl(newCurrentNode.id),
            });
        }
        else {
            handleSyncWorkflowDraft();
        }
        saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodeChange, {
            nodeId: currentNodeId,
        });
    }, [
        getNodesReadOnly,
        store,
        handleSyncWorkflowDraft,
        saveStateToHistory,
        nodesMetaDataMap,
        autoGenerateWebhookUrl,
    ]);
    const handleNodesCancelSelected = (0, react_1.useCallback)(() => {
        const { getNodes, setNodes } = store.getState();
        const nodes = getNodes();
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((node) => {
                node.data.selected = false;
            });
        });
        setNodes(newNodes);
    }, [store]);
    const handleNodeContextMenu = (0, react_1.useCallback)((e, node) => {
        if (node.type === constants_4.CUSTOM_NOTE_NODE
            || node.type === constants_2.CUSTOM_ITERATION_START_NODE) {
            return;
        }
        if (node.type === constants_4.CUSTOM_NOTE_NODE
            || node.type === constants_3.CUSTOM_LOOP_START_NODE) {
            return;
        }
        e.preventDefault();
        const container = document.querySelector('#workflow-container');
        const { x, y } = container.getBoundingClientRect();
        workflowStore.setState({
            nodeMenu: {
                top: e.clientY - y,
                left: e.clientX - x,
                nodeId: node.id,
            },
        });
        handleNodeSelect(node.id);
    }, [workflowStore, handleNodeSelect]);
    const handleNodesCopy = (0, react_1.useCallback)((nodeId) => {
        if (getNodesReadOnly())
            return;
        const { setClipboardElements } = workflowStore.getState();
        const { getNodes } = store.getState();
        const nodes = getNodes();
        if (nodeId) {
            // If nodeId is provided, copy that specific node
            const nodeToCopy = nodes.find(node => node.id === nodeId
                && node.data.type !== types_1.BlockEnum.Start
                && node.type !== constants_2.CUSTOM_ITERATION_START_NODE
                && node.type !== constants_3.CUSTOM_LOOP_START_NODE
                && node.data.type !== types_1.BlockEnum.LoopEnd
                && node.data.type !== types_1.BlockEnum.KnowledgeBase
                && node.data.type !== types_1.BlockEnum.DataSourceEmpty);
            if (nodeToCopy)
                setClipboardElements([nodeToCopy]);
        }
        else {
            // If no nodeId is provided, fall back to the current behavior
            const bundledNodes = nodes.filter((node) => {
                if (!node.data._isBundled)
                    return false;
                if (node.type === constants_4.CUSTOM_NOTE_NODE)
                    return true;
                const { metaData } = nodesMetaDataMap[node.data.type];
                if (metaData.isSingleton)
                    return false;
                return !node.data.isInIteration && !node.data.isInLoop;
            });
            if (bundledNodes.length) {
                setClipboardElements(bundledNodes);
                return;
            }
            const selectedNode = nodes.find((node) => {
                if (!node.data.selected)
                    return false;
                if (node.type === constants_4.CUSTOM_NOTE_NODE)
                    return true;
                const { metaData } = nodesMetaDataMap[node.data.type];
                return !metaData.isSingleton;
            });
            if (selectedNode)
                setClipboardElements([selectedNode]);
        }
    }, [getNodesReadOnly, store, workflowStore]);
    const handleNodesPaste = (0, react_1.useCallback)(() => {
        if (getNodesReadOnly())
            return;
        const { clipboardElements, mousePosition } = workflowStore.getState();
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodesToPaste = [];
        const edgesToPaste = [];
        const nodes = getNodes();
        if (clipboardElements.length) {
            const { x, y } = (0, utils_2.getTopLeftNodePosition)(clipboardElements);
            const { screenToFlowPosition } = reactflow;
            const currentPosition = screenToFlowPosition({
                x: mousePosition.pageX,
                y: mousePosition.pageY,
            });
            const offsetX = currentPosition.x - x;
            const offsetY = currentPosition.y - y;
            let idMapping = {};
            clipboardElements.forEach((nodeToPaste, index) => {
                const nodeType = nodeToPaste.data.type;
                const { newNode, newIterationStartNode, newLoopStartNode } = (0, utils_2.generateNewNode)({
                    type: nodeToPaste.type,
                    data: {
                        ...(nodeToPaste.type !== constants_4.CUSTOM_NOTE_NODE && nodesMetaDataMap[nodeType].defaultValue),
                        ...nodeToPaste.data,
                        selected: false,
                        _isBundled: false,
                        _connectedSourceHandleIds: [],
                        _connectedTargetHandleIds: [],
                        title: (0, utils_2.genNewNodeTitleFromOld)(nodeToPaste.data.title),
                    },
                    position: {
                        x: nodeToPaste.position.x + offsetX,
                        y: nodeToPaste.position.y + offsetY,
                    },
                    extent: nodeToPaste.extent,
                    zIndex: nodeToPaste.zIndex,
                });
                newNode.id = newNode.id + index;
                // This new node is movable and can be placed anywhere
                let newChildren = [];
                if (nodeToPaste.data.type === types_1.BlockEnum.Iteration) {
                    newIterationStartNode.parentId = newNode.id;
                    newNode.data.start_node_id
                        = newIterationStartNode.id;
                    const oldIterationStartNode = nodes.find(n => n.parentId === nodeToPaste.id
                        && n.type === constants_2.CUSTOM_ITERATION_START_NODE);
                    idMapping[oldIterationStartNode.id] = newIterationStartNode.id;
                    const { copyChildren, newIdMapping } = handleNodeIterationChildrenCopy(nodeToPaste.id, newNode.id, idMapping);
                    newChildren = copyChildren;
                    idMapping = newIdMapping;
                    newChildren.forEach((child) => {
                        newNode.data._children?.push({
                            nodeId: child.id,
                            nodeType: child.data.type,
                        });
                    });
                    newChildren.push(newIterationStartNode);
                }
                else if (nodeToPaste.data.type === types_1.BlockEnum.Loop) {
                    newLoopStartNode.parentId = newNode.id;
                    newNode.data.start_node_id = newLoopStartNode.id;
                    newChildren = handleNodeLoopChildrenCopy(nodeToPaste.id, newNode.id);
                    newChildren.forEach((child) => {
                        newNode.data._children?.push({
                            nodeId: child.id,
                            nodeType: child.data.type,
                        });
                    });
                    newChildren.push(newLoopStartNode);
                }
                else {
                    // single node paste
                    const selectedNode = nodes.find(node => node.selected);
                    if (selectedNode) {
                        const commonNestedDisallowPasteNodes = [
                            // end node only can be placed outermost layer
                            types_1.BlockEnum.End,
                        ];
                        // handle disallow paste node
                        if (commonNestedDisallowPasteNodes.includes(nodeToPaste.data.type))
                            return;
                        // handle paste to nested block
                        if (selectedNode.data.type === types_1.BlockEnum.Iteration) {
                            newNode.data.isInIteration = true;
                            newNode.data.iteration_id = selectedNode.data.iteration_id;
                            newNode.parentId = selectedNode.id;
                            newNode.positionAbsolute = {
                                x: newNode.position.x,
                                y: newNode.position.y,
                            };
                            // set position base on parent node
                            newNode.position = (0, utils_2.getNestedNodePosition)(newNode, selectedNode);
                        }
                        else if (selectedNode.data.type === types_1.BlockEnum.Loop) {
                            newNode.data.isInLoop = true;
                            newNode.data.loop_id = selectedNode.data.loop_id;
                            newNode.parentId = selectedNode.id;
                            newNode.positionAbsolute = {
                                x: newNode.position.x,
                                y: newNode.position.y,
                            };
                            // set position base on parent node
                            newNode.position = (0, utils_2.getNestedNodePosition)(newNode, selectedNode);
                        }
                    }
                }
                nodesToPaste.push(newNode);
                if (newChildren.length)
                    nodesToPaste.push(...newChildren);
            });
            // only handle edge when paste nested block
            edges.forEach((edge) => {
                const sourceId = idMapping[edge.source];
                const targetId = idMapping[edge.target];
                if (sourceId && targetId) {
                    const newEdge = {
                        ...edge,
                        id: `${sourceId}-${edge.sourceHandle}-${targetId}-${edge.targetHandle}`,
                        source: sourceId,
                        target: targetId,
                        data: {
                            ...edge.data,
                            _connectedNodeIsSelected: false,
                        },
                    };
                    edgesToPaste.push(newEdge);
                }
            });
            setNodes([...nodes, ...nodesToPaste]);
            setEdges([...edges, ...edgesToPaste]);
            saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodePaste, {
                nodeId: nodesToPaste?.[0]?.id,
            });
            handleSyncWorkflowDraft();
        }
    }, [
        getNodesReadOnly,
        workflowStore,
        store,
        reactflow,
        saveStateToHistory,
        handleSyncWorkflowDraft,
        handleNodeIterationChildrenCopy,
        handleNodeLoopChildrenCopy,
        nodesMetaDataMap,
    ]);
    const handleNodesDuplicate = (0, react_1.useCallback)((nodeId) => {
        if (getNodesReadOnly())
            return;
        handleNodesCopy(nodeId);
        handleNodesPaste();
    }, [getNodesReadOnly, handleNodesCopy, handleNodesPaste]);
    const handleNodesDelete = (0, react_1.useCallback)(() => {
        if (getNodesReadOnly())
            return;
        const { getNodes, edges } = store.getState();
        const nodes = getNodes();
        const bundledNodes = nodes.filter(node => node.data._isBundled);
        if (bundledNodes.length) {
            bundledNodes.forEach(node => handleNodeDelete(node.id));
            return;
        }
        const edgeSelected = edges.some(edge => edge.selected);
        if (edgeSelected)
            return;
        const selectedNode = nodes.find(node => node.data.selected);
        if (selectedNode)
            handleNodeDelete(selectedNode.id);
    }, [store, getNodesReadOnly, handleNodeDelete]);
    const handleNodeResize = (0, react_1.useCallback)((nodeId, params) => {
        if (getNodesReadOnly())
            return;
        const { getNodes, setNodes } = store.getState();
        const { x, y, width, height } = params;
        const nodes = getNodes();
        const currentNode = nodes.find(n => n.id === nodeId);
        const childrenNodes = nodes.filter(n => currentNode.data._children?.find((c) => c.nodeId === n.id));
        let rightNode;
        let bottomNode;
        childrenNodes.forEach((n) => {
            if (rightNode) {
                if (n.position.x + n.width > rightNode.position.x + rightNode.width)
                    rightNode = n;
            }
            else {
                rightNode = n;
            }
            if (bottomNode) {
                if (n.position.y + n.height
                    > bottomNode.position.y + bottomNode.height) {
                    bottomNode = n;
                }
            }
            else {
                bottomNode = n;
            }
        });
        if (rightNode && bottomNode) {
            const parentNode = nodes.find(n => n.id === rightNode.parentId);
            const paddingMap = parentNode?.data.type === types_1.BlockEnum.Iteration
                ? constants_1.ITERATION_PADDING
                : constants_1.LOOP_PADDING;
            if (width < rightNode.position.x + rightNode.width + paddingMap.right)
                return;
            if (height
                < bottomNode.position.y + bottomNode.height + paddingMap.bottom) {
                return;
            }
        }
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((n) => {
                if (n.id === nodeId) {
                    n.data.width = width;
                    n.data.height = height;
                    n.width = width;
                    n.height = height;
                    n.position.x = x;
                    n.position.y = y;
                }
            });
        });
        setNodes(newNodes);
        handleSyncWorkflowDraft();
        saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.NodeResize, { nodeId });
    }, [getNodesReadOnly, store, handleSyncWorkflowDraft, saveStateToHistory]);
    const handleNodeDisconnect = (0, react_1.useCallback)((nodeId) => {
        if (getNodesReadOnly())
            return;
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        const currentNode = nodes.find(node => node.id === nodeId);
        const connectedEdges = (0, reactflow_1.getConnectedEdges)([currentNode], edges);
        const nodesConnectedSourceOrTargetHandleIdsMap = (0, utils_2.getNodesConnectedSourceOrTargetHandleIdsMap)(connectedEdges.map(edge => ({ type: 'remove', edge })), nodes);
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((node) => {
                if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
                    node.data = {
                        ...node.data,
                        ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
                    };
                }
            });
        });
        setNodes(newNodes);
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            return draft.filter(edge => !connectedEdges.find(connectedEdge => connectedEdge.id === edge.id));
        });
        setEdges(newEdges);
        handleSyncWorkflowDraft();
        saveStateToHistory(use_workflow_history_1.WorkflowHistoryEvent.EdgeDelete);
    }, [store, getNodesReadOnly, handleSyncWorkflowDraft, saveStateToHistory]);
    const handleHistoryBack = (0, react_1.useCallback)(() => {
        if (getNodesReadOnly() || getWorkflowReadOnly())
            return;
        const { setEdges, setNodes } = store.getState();
        undo();
        const { edges, nodes } = workflowHistoryStore.getState();
        if (edges.length === 0 && nodes.length === 0)
            return;
        setEdges(edges);
        setNodes(nodes);
    }, [
        store,
        undo,
        workflowHistoryStore,
        getNodesReadOnly,
        getWorkflowReadOnly,
    ]);
    const handleHistoryForward = (0, react_1.useCallback)(() => {
        if (getNodesReadOnly() || getWorkflowReadOnly())
            return;
        const { setEdges, setNodes } = store.getState();
        redo();
        const { edges, nodes } = workflowHistoryStore.getState();
        if (edges.length === 0 && nodes.length === 0)
            return;
        setEdges(edges);
        setNodes(nodes);
    }, [
        redo,
        store,
        workflowHistoryStore,
        getNodesReadOnly,
        getWorkflowReadOnly,
    ]);
    const [isDimming, setIsDimming] = (0, react_1.useState)(false);
    /** Add opacity-30 to all nodes except the nodeId */
    const dimOtherNodes = (0, react_1.useCallback)(() => {
        if (isDimming)
            return;
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        const selectedNode = nodes.find(n => n.data.selected);
        if (!selectedNode)
            return;
        setIsDimming(true);
        // const workflowNodes = useStore(s => s.getNodes())
        const workflowNodes = nodes;
        const usedVars = (0, utils_1.getNodeUsedVars)(selectedNode);
        const dependencyNodes = [];
        usedVars.forEach((valueSelector) => {
            const node = workflowNodes.find(node => node.id === valueSelector?.[0]);
            if (node) {
                if (!dependencyNodes.includes(node))
                    dependencyNodes.push(node);
            }
        });
        const outgoers = (0, reactflow_1.getOutgoers)(selectedNode, nodes, edges);
        for (let currIdx = 0; currIdx < outgoers.length; currIdx++) {
            const node = outgoers[currIdx];
            const outgoersForNode = (0, reactflow_1.getOutgoers)(node, nodes, edges);
            outgoersForNode.forEach((item) => {
                const existed = outgoers.some(v => v.id === item.id);
                if (!existed)
                    outgoers.push(item);
            });
        }
        const dependentNodes = [];
        outgoers.forEach((node) => {
            const usedVars = (0, utils_1.getNodeUsedVars)(node);
            const used = usedVars.some(v => v?.[0] === selectedNode.id);
            if (used) {
                const existed = dependentNodes.some(v => v.id === node.id);
                if (!existed)
                    dependentNodes.push(node);
            }
        });
        const dimNodes = [...dependencyNodes, ...dependentNodes, selectedNode];
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((n) => {
                const dimNode = dimNodes.find(v => v.id === n.id);
                if (!dimNode)
                    n.data._dimmed = true;
            });
        });
        setNodes(newNodes);
        const tempEdges = [];
        dependencyNodes.forEach((n) => {
            tempEdges.push({
                id: `tmp_${n.id}-source-${selectedNode.id}-target`,
                type: constants_1.CUSTOM_EDGE,
                source: n.id,
                sourceHandle: 'source_tmp',
                target: selectedNode.id,
                targetHandle: 'target_tmp',
                animated: true,
                data: {
                    sourceType: n.data.type,
                    targetType: selectedNode.data.type,
                    _isTemp: true,
                    _connectedNodeIsHovering: true,
                },
            });
        });
        dependentNodes.forEach((n) => {
            tempEdges.push({
                id: `tmp_${selectedNode.id}-source-${n.id}-target`,
                type: constants_1.CUSTOM_EDGE,
                source: selectedNode.id,
                sourceHandle: 'source_tmp',
                target: n.id,
                targetHandle: 'target_tmp',
                animated: true,
                data: {
                    sourceType: selectedNode.data.type,
                    targetType: n.data.type,
                    _isTemp: true,
                    _connectedNodeIsHovering: true,
                },
            });
        });
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            draft.forEach((e) => {
                e.data._dimmed = true;
            });
            draft.push(...tempEdges);
        });
        setEdges(newEdges);
    }, [isDimming, store]);
    /** Restore all nodes to full opacity */
    const undimAllNodes = (0, react_1.useCallback)(() => {
        const { getNodes, setNodes, edges, setEdges } = store.getState();
        const nodes = getNodes();
        setIsDimming(false);
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((n) => {
                n.data._dimmed = false;
            });
        });
        setNodes(newNodes);
        const newEdges = (0, immer_1.produce)(edges.filter(e => !e.data._isTemp), (draft) => {
            draft.forEach((e) => {
                e.data._dimmed = false;
            });
        });
        setEdges(newEdges);
    }, [store]);
    return {
        handleNodeDragStart,
        handleNodeDrag,
        handleNodeDragStop,
        handleNodeEnter,
        handleNodeLeave,
        handleNodeSelect,
        handleNodeClick,
        handleNodeConnect,
        handleNodeConnectStart,
        handleNodeConnectEnd,
        handleNodeDelete,
        handleNodeChange,
        handleNodeAdd,
        handleNodesCancelSelected,
        handleNodeContextMenu,
        handleNodesCopy,
        handleNodesPaste,
        handleNodesDuplicate,
        handleNodesDelete,
        handleNodeResize,
        handleNodeDisconnect,
        handleHistoryBack,
        handleHistoryForward,
        dimOtherNodes,
        undimAllNodes,
    };
};
exports.useNodesInteractions = useNodesInteractions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW5vZGVzLWludGVyYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1ub2Rlcy1pbnRlcmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBZUEsaUNBQStCO0FBQy9CLGlDQUFxRDtBQUNyRCxpREFBOEM7QUFDOUMseUNBS2tCO0FBQ2xCLDRDQVNxQjtBQUNyQixvRUFBMEU7QUFDMUUsa0VBQWdGO0FBQ2hGLDBFQUFrRjtBQUNsRiw2REFBc0U7QUFDdEUscUVBQXdFO0FBQ3hFLHNEQUF5RDtBQUN6RCxvQ0FBMkM7QUFDM0Msb0NBQW1EO0FBQ25ELG9DQU9pQjtBQUNqQixzRUFBbUU7QUFDbkUsbUZBQTJFO0FBQzNFLGlEQUE0QztBQUM1QyxtRUFBd0Q7QUFDeEQsK0RBQXdEO0FBQ3hELGlFQUEwRDtBQUMxRCxpREFJdUI7QUFDdkIsaUVBRytCO0FBRS9CLDRFQUE0RTtBQUU1RSwyREFBMkQ7QUFDM0QsMkNBQTJDO0FBQzNDLE1BQU0seUJBQXlCLEdBQUc7SUFDaEMsQ0FBQyxFQUFFLENBQUM7SUFDSixDQUFDLEVBQUUsRUFBRSxFQUFFLDRDQUE0QztDQUMzQyxDQUFBO0FBRUgsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7SUFDdkMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBQzNCLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLFNBQVMsR0FBRyxJQUFBLHdCQUFZLEdBQUUsQ0FBQTtJQUNoQyxNQUFNLEVBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFFLEdBQUcsSUFBQSxnREFBdUIsR0FBRSxDQUFBO0lBQ2pFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxHQUFHLElBQUEsd0NBQWlCLEdBQUUsQ0FBQTtJQUN2RCxNQUFNLEVBQUUseUJBQXlCLEVBQUUs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QixvQkFBb0I7UUFDcEIsaUJBQWlCO1FBQ2pCLGdCQUFnQjtRQUNoQixvQkFBb0I7UUFDcEIsaUJBQWlCO1FBQ2pCLG9CQUFvQjtRQUNwQixhQUFhO1FBQ2IsYUFBYTtLQUNkLENBQUE7QUFDSCxDQUFDLENBQUE7QUFoL0RZLFFBQUEsb0JBQW9CLHdCQWcvRGhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNb3VzZUV2ZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7XG4gIE5vZGVEcmFnSGFuZGxlcixcbiAgTm9kZU1vdXNlSGFuZGxlcixcbiAgT25Db25uZWN0LFxuICBPbkNvbm5lY3RFbmQsXG4gIE9uQ29ubmVjdFN0YXJ0LFxuICBSZXNpemVQYXJhbXNXaXRoRGlyZWN0aW9uLFxufSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgdHlwZSB7IFBsdWdpbkRlZmF1bHRWYWx1ZSB9IGZyb20gJy4uL2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBJdGVyYXRpb25Ob2RlVHlwZSB9IGZyb20gJy4uL25vZGVzL2l0ZXJhdGlvbi90eXBlcydcbmltcG9ydCB0eXBlIHsgTG9vcE5vZGVUeXBlIH0gZnJvbSAnLi4vbm9kZXMvbG9vcC90eXBlcydcbmltcG9ydCB0eXBlIHsgVmFyaWFibGVBc3NpZ25lck5vZGVUeXBlIH0gZnJvbSAnLi4vbm9kZXMvdmFyaWFibGUtYXNzaWduZXIvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEVkZ2UsIE5vZGUsIE9uTm9kZUFkZCB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBSQUdQaXBlbGluZVZhcmlhYmxlcyB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7XG4gIGdldENvbm5lY3RlZEVkZ2VzLFxuICBnZXRPdXRnb2VycyxcbiAgdXNlUmVhY3RGbG93LFxuICB1c2VTdG9yZUFwaSxcbn0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IHtcbiAgQ1VTVE9NX0VER0UsXG4gIElURVJBVElPTl9DSElMRFJFTl9aX0lOREVYLFxuICBJVEVSQVRJT05fUEFERElORyxcbiAgTE9PUF9DSElMRFJFTl9aX0lOREVYLFxuICBMT09QX1BBRERJTkcsXG4gIE5PREVfV0lEVEhfWF9PRkZTRVQsXG4gIFhfT0ZGU0VULFxuICBZX09GRlNFVCxcbn0gZnJvbSAnLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgZ2V0Tm9kZVVzZWRWYXJzIH0gZnJvbSAnLi4vbm9kZXMvX2Jhc2UvY29tcG9uZW50cy92YXJpYWJsZS91dGlscydcbmltcG9ydCB7IENVU1RPTV9JVEVSQVRJT05fU1RBUlRfTk9ERSB9IGZyb20gJy4uL25vZGVzL2l0ZXJhdGlvbi1zdGFydC9jb25zdGFudHMnXG5pbXBvcnQgeyB1c2VOb2RlSXRlcmF0aW9uSW50ZXJhY3Rpb25zIH0gZnJvbSAnLi4vbm9kZXMvaXRlcmF0aW9uL3VzZS1pbnRlcmFjdGlvbnMnXG5pbXBvcnQgeyBDVVNUT01fTE9PUF9TVEFSVF9OT0RFIH0gZnJvbSAnLi4vbm9kZXMvbG9vcC1zdGFydC9jb25zdGFudHMnXG5pbXBvcnQgeyB1c2VOb2RlTG9vcEludGVyYWN0aW9ucyB9IGZyb20gJy4uL25vZGVzL2xvb3AvdXNlLWludGVyYWN0aW9ucydcbmltcG9ydCB7IENVU1RPTV9OT1RFX05PREUgfSBmcm9tICcuLi9ub3RlLW5vZGUvY29uc3RhbnRzJ1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJy4uL3N0b3JlJ1xuaW1wb3J0IHsgQmxvY2tFbnVtLCBpc1RyaWdnZXJOb2RlIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQge1xuICBnZW5lcmF0ZU5ld05vZGUsXG4gIGdlbk5ld05vZGVUaXRsZUZyb21PbGQsXG4gIGdldE5lc3RlZE5vZGVQb3NpdGlvbixcbiAgZ2V0Tm9kZUN1c3RvbVR5cGVCeU5vZGVEYXRhVHlwZSxcbiAgZ2V0Tm9kZXNDb25uZWN0ZWRTb3VyY2VPclRhcmdldEhhbmRsZUlkc01hcCxcbiAgZ2V0VG9wTGVmdE5vZGVQb3NpdGlvbixcbn0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd0hpc3RvcnlTdG9yZSB9IGZyb20gJy4uL3dvcmtmbG93LWhpc3Rvcnktc3RvcmUnXG5pbXBvcnQgeyB1c2VBdXRvR2VuZXJhdGVXZWJob29rVXJsIH0gZnJvbSAnLi91c2UtYXV0by1nZW5lcmF0ZS13ZWJob29rLXVybCdcbmltcG9ydCB7IHVzZUhlbHBsaW5lIH0gZnJvbSAnLi91c2UtaGVscGxpbmUnXG5pbXBvcnQgdXNlSW5zcGVjdFZhcnNDcnVkIGZyb20gJy4vdXNlLWluc3BlY3QtdmFycy1jcnVkJ1xuaW1wb3J0IHsgdXNlTm9kZXNNZXRhRGF0YSB9IGZyb20gJy4vdXNlLW5vZGVzLW1ldGEtZGF0YSdcbmltcG9ydCB7IHVzZU5vZGVzU3luY0RyYWZ0IH0gZnJvbSAnLi91c2Utbm9kZXMtc3luYy1kcmFmdCdcbmltcG9ydCB7XG4gIHVzZU5vZGVzUmVhZE9ubHksXG4gIHVzZVdvcmtmbG93LFxuICB1c2VXb3JrZmxvd1JlYWRPbmx5LFxufSBmcm9tICcuL3VzZS13b3JrZmxvdydcbmltcG9ydCB7XG4gIHVzZVdvcmtmbG93SGlzdG9yeSxcbiAgV29ya2Zsb3dIaXN0b3J5RXZlbnQsXG59IGZyb20gJy4vdXNlLXdvcmtmbG93LWhpc3RvcnknXG5cbi8vIEVudHJ5IG5vZGUgZGVsZXRpb24gcmVzdHJpY3Rpb24gaGFzIGJlZW4gcmVtb3ZlZCB0byBhbGxvdyBlbXB0eSB3b3JrZmxvd3NcblxuLy8gRW50cnkgbm9kZSAoU3RhcnQvVHJpZ2dlcikgd3JhcHBlciBvZmZzZXRzIGZvciBhbGlnbm1lbnRcbi8vIE11c3QgbWF0Y2ggdGhlIHZhbHVlcyBpbiB1c2UtaGVscGxpbmUudHNcbmNvbnN0IEVOVFJZX05PREVfV1JBUFBFUl9PRkZTRVQgPSB7XG4gIHg6IDAsXG4gIHk6IDIxLCAvLyBBZGp1c3RlZCBiYXNlZCBvbiB2aXN1YWwgdGVzdGluZyBmZWVkYmFja1xufSBhcyBjb25zdFxuXG5leHBvcnQgY29uc3QgdXNlTm9kZXNJbnRlcmFjdGlvbnMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCByZWFjdGZsb3cgPSB1c2VSZWFjdEZsb3coKVxuICBjb25zdCB7IHN0b3JlOiB3b3JrZmxvd0hpc3RvcnlTdG9yZSB9ID0gdXNlV29ya2Zsb3dIaXN0b3J5U3RvcmUoKVxuICBjb25zdCB7IGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0IH0gPSB1c2VOb2Rlc1N5bmNEcmFmdCgpXG4gIGNvbnN0IHsgZ2V0QWZ0ZXJOb2Rlc0luU2FtZUJyYW5jaCB9ID0gdXNlV29ya2Zsb3coKVxuICBjb25zdCB7IGdldE5vZGVzUmVhZE9ubHkgfSA9IHVzZU5vZGVzUmVhZE9ubHkoKVxuICBjb25zdCB7IGdldFdvcmtmbG93UmVhZE9ubHkgfSA9IHVzZVdvcmtmbG93UmVhZE9ubHkoKVxuICBjb25zdCB7IGhhbmRsZVNldEhlbHBsaW5lIH0gPSB1c2VIZWxwbGluZSgpXG4gIGNvbnN0IHsgaGFuZGxlTm9kZUl0ZXJhdGlvbkNoaWxkRHJhZywgaGFuZGxlTm9kZUl0ZXJhdGlvbkNoaWxkcmVuQ29weSB9XG4gICAgPSB1c2VOb2RlSXRlcmF0aW9uSW50ZXJhY3Rpb25zKClcbiAgY29uc3QgeyBoYW5kbGVOb2RlTG9vcENoaWxkRHJhZywgaGFuZGxlTm9kZUxvb3BDaGlsZHJlbkNvcHkgfVxuICAgID0gdXNlTm9kZUxvb3BJbnRlcmFjdGlvbnMoKVxuICBjb25zdCBkcmFnTm9kZVN0YXJ0UG9zaXRpb24gPSB1c2VSZWYoeyB4OiAwLCB5OiAwIH0gYXMge1xuICAgIHg6IG51bWJlclxuICAgIHk6IG51bWJlclxuICB9KVxuICBjb25zdCB7IG5vZGVzTWFwOiBub2Rlc01ldGFEYXRhTWFwIH0gPSB1c2VOb2Rlc01ldGFEYXRhKClcblxuICBjb25zdCB7IHNhdmVTdGF0ZVRvSGlzdG9yeSwgdW5kbywgcmVkbyB9ID0gdXNlV29ya2Zsb3dIaXN0b3J5KClcbiAgY29uc3QgYXV0b0dlbmVyYXRlV2ViaG9va1VybCA9IHVzZUF1dG9HZW5lcmF0ZVdlYmhvb2tVcmwoKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVEcmFnU3RhcnQgPSB1c2VDYWxsYmFjazxOb2RlRHJhZ0hhbmRsZXI+KFxuICAgIChfLCBub2RlKSA9PiB7XG4gICAgICB3b3JrZmxvd1N0b3JlLnNldFN0YXRlKHsgbm9kZUFuaW1hdGlvbjogZmFsc2UgfSlcblxuICAgICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS50eXBlID09PSBDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREVcbiAgICAgICAgfHwgbm9kZS50eXBlID09PSBDVVNUT01fTk9URV9OT0RFXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS50eXBlID09PSBDVVNUT01fTE9PUF9TVEFSVF9OT0RFXG4gICAgICAgIHx8IG5vZGUudHlwZSA9PT0gQ1VTVE9NX05PVEVfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBkcmFnTm9kZVN0YXJ0UG9zaXRpb24uY3VycmVudCA9IHtcbiAgICAgICAgeDogbm9kZS5wb3NpdGlvbi54LFxuICAgICAgICB5OiBub2RlLnBvc2l0aW9uLnksXG4gICAgICB9XG4gICAgfSxcbiAgICBbd29ya2Zsb3dTdG9yZSwgZ2V0Tm9kZXNSZWFkT25seV0sXG4gIClcblxuICBjb25zdCBoYW5kbGVOb2RlRHJhZyA9IHVzZUNhbGxiYWNrPE5vZGVEcmFnSGFuZGxlcj4oXG4gICAgKGUsIG5vZGU6IE5vZGUpID0+IHtcbiAgICAgIGlmIChnZXROb2Rlc1JlYWRPbmx5KCkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpZiAobm9kZS50eXBlID09PSBDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREUpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpZiAobm9kZS50eXBlID09PSBDVVNUT01fTE9PUF9TVEFSVF9OT0RFKVxuICAgICAgICByZXR1cm5cblxuICAgICAgY29uc3QgeyBnZXROb2Rlcywgc2V0Tm9kZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG5cbiAgICAgIGNvbnN0IHsgcmVzdHJpY3RQb3NpdGlvbiB9ID0gaGFuZGxlTm9kZUl0ZXJhdGlvbkNoaWxkRHJhZyhub2RlKVxuICAgICAgY29uc3QgeyByZXN0cmljdFBvc2l0aW9uOiByZXN0cmljdExvb3BQb3NpdGlvbiB9XG4gICAgICAgID0gaGFuZGxlTm9kZUxvb3BDaGlsZERyYWcobm9kZSlcblxuICAgICAgY29uc3QgeyBzaG93SG9yaXpvbnRhbEhlbHBMaW5lTm9kZXMsIHNob3dWZXJ0aWNhbEhlbHBMaW5lTm9kZXMgfVxuICAgICAgICA9IGhhbmRsZVNldEhlbHBsaW5lKG5vZGUpXG4gICAgICBjb25zdCBzaG93SG9yaXpvbnRhbEhlbHBMaW5lTm9kZXNMZW5ndGhcbiAgICAgICAgPSBzaG93SG9yaXpvbnRhbEhlbHBMaW5lTm9kZXMubGVuZ3RoXG4gICAgICBjb25zdCBzaG93VmVydGljYWxIZWxwTGluZU5vZGVzTGVuZ3RoID0gc2hvd1ZlcnRpY2FsSGVscExpbmVOb2Rlcy5sZW5ndGhcblxuICAgICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBkcmFmdC5maW5kKG4gPT4gbi5pZCA9PT0gbm9kZS5pZCkhXG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgY3VycmVudCBkcmFnZ2luZyBub2RlIGlzIGFuIGVudHJ5IG5vZGVcbiAgICAgICAgY29uc3QgaXNDdXJyZW50RW50cnlOb2RlID0gaXNUcmlnZ2VyTm9kZShub2RlLmRhdGEudHlwZSBhcyBhbnkpIHx8IG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uU3RhcnRcblxuICAgICAgICAvLyBYLWF4aXMgYWxpZ25tZW50IHdpdGggb2Zmc2V0IGNvbnNpZGVyYXRpb25cbiAgICAgICAgaWYgKHNob3dWZXJ0aWNhbEhlbHBMaW5lTm9kZXNMZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IHNob3dWZXJ0aWNhbEhlbHBMaW5lTm9kZXNbMF1cbiAgICAgICAgICBjb25zdCBpc1RhcmdldEVudHJ5Tm9kZSA9IGlzVHJpZ2dlck5vZGUodGFyZ2V0Tm9kZS5kYXRhLnR5cGUgYXMgYW55KSB8fCB0YXJnZXROb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlN0YXJ0XG5cbiAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHdyYXBwZXIgcG9zaXRpb24gbmVlZGVkIHRvIGFsaWduIHRoZSBpbm5lciBub2Rlc1xuICAgICAgICAgIC8vIFRhcmdldCBpbm5lciBwb3NpdGlvbiA9IHRhcmdldC5wb3NpdGlvbiArIHRhcmdldC5vZmZzZXRcbiAgICAgICAgICAvLyBDdXJyZW50IGlubmVyIHBvc2l0aW9uIHNob3VsZCBlcXVhbCB0YXJnZXQgaW5uZXIgcG9zaXRpb25cbiAgICAgICAgICAvLyBTbzogY3VycmVudC5wb3NpdGlvbiArIGN1cnJlbnQub2Zmc2V0ID0gdGFyZ2V0LnBvc2l0aW9uICsgdGFyZ2V0Lm9mZnNldFxuICAgICAgICAgIC8vIFRoZXJlZm9yZTogY3VycmVudC5wb3NpdGlvbiA9IHRhcmdldC5wb3NpdGlvbiArIHRhcmdldC5vZmZzZXQgLSBjdXJyZW50Lm9mZnNldFxuICAgICAgICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IGlzVGFyZ2V0RW50cnlOb2RlID8gRU5UUllfTk9ERV9XUkFQUEVSX09GRlNFVC54IDogMFxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRPZmZzZXQgPSBpc0N1cnJlbnRFbnRyeU5vZGUgPyBFTlRSWV9OT0RFX1dSQVBQRVJfT0ZGU0VULnggOiAwXG4gICAgICAgICAgY3VycmVudE5vZGUucG9zaXRpb24ueCA9IHRhcmdldE5vZGUucG9zaXRpb24ueCArIHRhcmdldE9mZnNldCAtIGN1cnJlbnRPZmZzZXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZXN0cmljdFBvc2l0aW9uLnggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uLnggPSByZXN0cmljdFBvc2l0aW9uLnhcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZXN0cmljdExvb3BQb3NpdGlvbi54ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbi54ID0gcmVzdHJpY3RMb29wUG9zaXRpb24ueFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uLnggPSBub2RlLnBvc2l0aW9uLnhcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFktYXhpcyBhbGlnbm1lbnQgd2l0aCBvZmZzZXQgY29uc2lkZXJhdGlvblxuICAgICAgICBpZiAoc2hvd0hvcml6b250YWxIZWxwTGluZU5vZGVzTGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGUgPSBzaG93SG9yaXpvbnRhbEhlbHBMaW5lTm9kZXNbMF1cbiAgICAgICAgICBjb25zdCBpc1RhcmdldEVudHJ5Tm9kZSA9IGlzVHJpZ2dlck5vZGUodGFyZ2V0Tm9kZS5kYXRhLnR5cGUgYXMgYW55KSB8fCB0YXJnZXROb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlN0YXJ0XG5cbiAgICAgICAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBpc1RhcmdldEVudHJ5Tm9kZSA/IEVOVFJZX05PREVfV1JBUFBFUl9PRkZTRVQueSA6IDBcbiAgICAgICAgICBjb25zdCBjdXJyZW50T2Zmc2V0ID0gaXNDdXJyZW50RW50cnlOb2RlID8gRU5UUllfTk9ERV9XUkFQUEVSX09GRlNFVC55IDogMFxuICAgICAgICAgIGN1cnJlbnROb2RlLnBvc2l0aW9uLnkgPSB0YXJnZXROb2RlLnBvc2l0aW9uLnkgKyB0YXJnZXRPZmZzZXQgLSBjdXJyZW50T2Zmc2V0XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmVzdHJpY3RQb3NpdGlvbi55ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbi55ID0gcmVzdHJpY3RQb3NpdGlvbi55XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmVzdHJpY3RMb29wUG9zaXRpb24ueSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY3VycmVudE5vZGUucG9zaXRpb24ueSA9IHJlc3RyaWN0TG9vcFBvc2l0aW9uLnlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZS5wb3NpdGlvbi55ID0gbm9kZS5wb3NpdGlvbi55XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICB9LFxuICAgIFtcbiAgICAgIGdldE5vZGVzUmVhZE9ubHksXG4gICAgICBzdG9yZSxcbiAgICAgIGhhbmRsZU5vZGVJdGVyYXRpb25DaGlsZERyYWcsXG4gICAgICBoYW5kbGVOb2RlTG9vcENoaWxkRHJhZyxcbiAgICAgIGhhbmRsZVNldEhlbHBsaW5lLFxuICAgIF0sXG4gIClcblxuICBjb25zdCBoYW5kbGVOb2RlRHJhZ1N0b3AgPSB1c2VDYWxsYmFjazxOb2RlRHJhZ0hhbmRsZXI+KFxuICAgIChfLCBub2RlKSA9PiB7XG4gICAgICBjb25zdCB7IHNldEhlbHBMaW5lSG9yaXpvbnRhbCwgc2V0SGVscExpbmVWZXJ0aWNhbCB9XG4gICAgICAgID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAgIGlmIChnZXROb2Rlc1JlYWRPbmx5KCkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjb25zdCB7IHgsIHkgfSA9IGRyYWdOb2RlU3RhcnRQb3NpdGlvbi5jdXJyZW50XG4gICAgICBpZiAoISh4ID09PSBub2RlLnBvc2l0aW9uLnggJiYgeSA9PT0gbm9kZS5wb3NpdGlvbi55KSkge1xuICAgICAgICBzZXRIZWxwTGluZUhvcml6b250YWwoKVxuICAgICAgICBzZXRIZWxwTGluZVZlcnRpY2FsKClcbiAgICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQoKVxuXG4gICAgICAgIGlmICh4ICE9PSAwICYmIHkgIT09IDApIHtcbiAgICAgICAgICAvLyBzZWxlY3RpbmcgYSBub3RlIHdpbGwgdHJpZ2dlciBhIGRyYWcgc3RvcCBldmVudCB3aXRoIHggYW5kIHkgYXMgMFxuICAgICAgICAgIHNhdmVTdGF0ZVRvSGlzdG9yeShXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlRHJhZ1N0b3AsIHtcbiAgICAgICAgICAgIG5vZGVJZDogbm9kZS5pZCxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBbXG4gICAgICB3b3JrZmxvd1N0b3JlLFxuICAgICAgZ2V0Tm9kZXNSZWFkT25seSxcbiAgICAgIHNhdmVTdGF0ZVRvSGlzdG9yeSxcbiAgICAgIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0LFxuICAgIF0sXG4gIClcblxuICBjb25zdCBoYW5kbGVOb2RlRW50ZXIgPSB1c2VDYWxsYmFjazxOb2RlTW91c2VIYW5kbGVyPihcbiAgICAoXywgbm9kZSkgPT4ge1xuICAgICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS50eXBlID09PSBDVVNUT01fTk9URV9OT0RFXG4gICAgICAgIHx8IG5vZGUudHlwZSA9PT0gQ1VTVE9NX0lURVJBVElPTl9TVEFSVF9OT0RFXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS50eXBlID09PSBDVVNUT01fTE9PUF9TVEFSVF9OT0RFXG4gICAgICAgIHx8IG5vZGUudHlwZSA9PT0gQ1VTVE9NX05PVEVfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGdldE5vZGVzLCBzZXROb2RlcywgZWRnZXMsIHNldEVkZ2VzIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcbiAgICAgIGNvbnN0IHsgY29ubmVjdGluZ05vZGVQYXlsb2FkLCBzZXRFbnRlcmluZ05vZGVQYXlsb2FkIH1cbiAgICAgICAgPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcblxuICAgICAgaWYgKGNvbm5lY3RpbmdOb2RlUGF5bG9hZCkge1xuICAgICAgICBpZiAoY29ubmVjdGluZ05vZGVQYXlsb2FkLm5vZGVJZCA9PT0gbm9kZS5pZClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgY29uc3QgY29ubmVjdGluZ05vZGU6IE5vZGUgPSBub2Rlcy5maW5kKFxuICAgICAgICAgIG4gPT4gbi5pZCA9PT0gY29ubmVjdGluZ05vZGVQYXlsb2FkLm5vZGVJZCxcbiAgICAgICAgKSFcbiAgICAgICAgY29uc3Qgc2FtZUxldmVsID0gY29ubmVjdGluZ05vZGUucGFyZW50SWQgPT09IG5vZGUucGFyZW50SWRcblxuICAgICAgICBpZiAoc2FtZUxldmVsKSB7XG4gICAgICAgICAgc2V0RW50ZXJpbmdOb2RlUGF5bG9hZCh7XG4gICAgICAgICAgICBub2RlSWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICBub2RlRGF0YTogbm9kZS5kYXRhIGFzIFZhcmlhYmxlQXNzaWduZXJOb2RlVHlwZSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIGNvbnN0IGZyb21UeXBlID0gY29ubmVjdGluZ05vZGVQYXlsb2FkLmhhbmRsZVR5cGVcblxuICAgICAgICAgIGNvbnN0IG5ld05vZGVzID0gcHJvZHVjZShub2RlcywgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICBkcmFmdC5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBuLmlkID09PSBub2RlLmlkXG4gICAgICAgICAgICAgICAgJiYgZnJvbVR5cGUgPT09ICdzb3VyY2UnXG4gICAgICAgICAgICAgICAgJiYgKG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVmFyaWFibGVBc3NpZ25lclxuICAgICAgICAgICAgICAgICAgfHwgbm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3IpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmICghbm9kZS5kYXRhLmFkdmFuY2VkX3NldHRpbmdzPy5ncm91cF9lbmFibGVkKVxuICAgICAgICAgICAgICAgICAgbi5kYXRhLl9pc0VudGVyaW5nID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBuLmlkID09PSBub2RlLmlkXG4gICAgICAgICAgICAgICAgJiYgZnJvbVR5cGUgPT09ICd0YXJnZXQnXG4gICAgICAgICAgICAgICAgJiYgKGNvbm5lY3RpbmdOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlZhcmlhYmxlQXNzaWduZXJcbiAgICAgICAgICAgICAgICAgIHx8IGNvbm5lY3RpbmdOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlZhcmlhYmxlQWdncmVnYXRvcilcbiAgICAgICAgICAgICAgICAmJiBub2RlLmRhdGEudHlwZSAhPT0gQmxvY2tFbnVtLklmRWxzZVxuICAgICAgICAgICAgICAgICYmIG5vZGUuZGF0YS50eXBlICE9PSBCbG9ja0VudW0uUXVlc3Rpb25DbGFzc2lmaWVyXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIG4uZGF0YS5faXNFbnRlcmluZyA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIHNldE5vZGVzKG5ld05vZGVzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoZWRnZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICBjb25zdCBjb25uZWN0ZWRFZGdlcyA9IGdldENvbm5lY3RlZEVkZ2VzKFtub2RlXSwgZWRnZXMpXG5cbiAgICAgICAgY29ubmVjdGVkRWRnZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRFZGdlID0gZHJhZnQuZmluZChlID0+IGUuaWQgPT09IGVkZ2UuaWQpXG4gICAgICAgICAgaWYgKGN1cnJlbnRFZGdlKVxuICAgICAgICAgICAgY3VycmVudEVkZ2UuZGF0YS5fY29ubmVjdGVkTm9kZUlzSG92ZXJpbmcgPSB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgc2V0RWRnZXMobmV3RWRnZXMpXG4gICAgfSxcbiAgICBbc3RvcmUsIHdvcmtmbG93U3RvcmUsIGdldE5vZGVzUmVhZE9ubHldLFxuICApXG5cbiAgY29uc3QgaGFuZGxlTm9kZUxlYXZlID0gdXNlQ2FsbGJhY2s8Tm9kZU1vdXNlSGFuZGxlcj4oXG4gICAgKF8sIG5vZGUpID0+IHtcbiAgICAgIGlmIChnZXROb2Rlc1JlYWRPbmx5KCkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUudHlwZSA9PT0gQ1VTVE9NX05PVEVfTk9ERVxuICAgICAgICB8fCBub2RlLnR5cGUgPT09IENVU1RPTV9JVEVSQVRJT05fU1RBUlRfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUudHlwZSA9PT0gQ1VTVE9NX05PVEVfTk9ERVxuICAgICAgICB8fCBub2RlLnR5cGUgPT09IENVU1RPTV9MT09QX1NUQVJUX05PREVcbiAgICAgICkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBzZXRFbnRlcmluZ05vZGVQYXlsb2FkIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICAgIHNldEVudGVyaW5nTm9kZVBheWxvYWQodW5kZWZpbmVkKVxuICAgICAgY29uc3QgeyBnZXROb2Rlcywgc2V0Tm9kZXMsIGVkZ2VzLCBzZXRFZGdlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKGdldE5vZGVzKCksIChkcmFmdCkgPT4ge1xuICAgICAgICBkcmFmdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgbm9kZS5kYXRhLl9pc0VudGVyaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICAgIGNvbnN0IG5ld0VkZ2VzID0gcHJvZHVjZShlZGdlcywgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGRyYWZ0LmZvckVhY2goKGVkZ2UpID0+IHtcbiAgICAgICAgICBlZGdlLmRhdGEuX2Nvbm5lY3RlZE5vZGVJc0hvdmVyaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBzZXRFZGdlcyhuZXdFZGdlcylcbiAgICB9LFxuICAgIFtzdG9yZSwgd29ya2Zsb3dTdG9yZSwgZ2V0Tm9kZXNSZWFkT25seV0sXG4gIClcblxuICBjb25zdCBoYW5kbGVOb2RlU2VsZWN0ID0gdXNlQ2FsbGJhY2soXG4gICAgKFxuICAgICAgbm9kZUlkOiBzdHJpbmcsXG4gICAgICBjYW5jZWxTZWxlY3Rpb24/OiBib29sZWFuLFxuICAgICAgaW5pdFNob3dMYXN0UnVuVGFiPzogYm9vbGVhbixcbiAgICApID0+IHtcbiAgICAgIGlmIChpbml0U2hvd0xhc3RSdW5UYWIpXG4gICAgICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBpbml0U2hvd0xhc3RSdW5UYWI6IHRydWUgfSlcbiAgICAgIGNvbnN0IHsgZ2V0Tm9kZXMsIHNldE5vZGVzLCBlZGdlcywgc2V0RWRnZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcblxuICAgICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgICBjb25zdCBzZWxlY3RlZE5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5kYXRhLnNlbGVjdGVkKVxuXG4gICAgICBpZiAoIWNhbmNlbFNlbGVjdGlvbiAmJiBzZWxlY3RlZE5vZGU/LmlkID09PSBub2RlSWQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICBkcmFmdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgaWYgKG5vZGUuaWQgPT09IG5vZGVJZClcbiAgICAgICAgICAgIG5vZGUuZGF0YS5zZWxlY3RlZCA9ICFjYW5jZWxTZWxlY3Rpb25cbiAgICAgICAgICBlbHNlIG5vZGUuZGF0YS5zZWxlY3RlZCA9IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG5cbiAgICAgIGNvbnN0IGNvbm5lY3RlZEVkZ2VzID0gZ2V0Q29ubmVjdGVkRWRnZXMoXG4gICAgICAgIFt7IGlkOiBub2RlSWQgfSBhcyBOb2RlXSxcbiAgICAgICAgZWRnZXMsXG4gICAgICApLm1hcChlZGdlID0+IGVkZ2UuaWQpXG4gICAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoZWRnZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICBkcmFmdC5mb3JFYWNoKChlZGdlKSA9PiB7XG4gICAgICAgICAgaWYgKGNvbm5lY3RlZEVkZ2VzLmluY2x1ZGVzKGVkZ2UuaWQpKSB7XG4gICAgICAgICAgICBlZGdlLmRhdGEgPSB7XG4gICAgICAgICAgICAgIC4uLmVkZ2UuZGF0YSxcbiAgICAgICAgICAgICAgX2Nvbm5lY3RlZE5vZGVJc1NlbGVjdGVkOiAhY2FuY2VsU2VsZWN0aW9uLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVkZ2UuZGF0YSA9IHtcbiAgICAgICAgICAgICAgLi4uZWRnZS5kYXRhLFxuICAgICAgICAgICAgICBfY29ubmVjdGVkTm9kZUlzU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBzZXRFZGdlcyhuZXdFZGdlcylcblxuICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQoKVxuICAgIH0sXG4gICAgW3N0b3JlLCBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdF0sXG4gIClcblxuICBjb25zdCBoYW5kbGVOb2RlQ2xpY2sgPSB1c2VDYWxsYmFjazxOb2RlTW91c2VIYW5kbGVyPihcbiAgICAoXywgbm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gQ1VTVE9NX0lURVJBVElPTl9TVEFSVF9OT0RFKVxuICAgICAgICByZXR1cm5cbiAgICAgIGlmIChub2RlLnR5cGUgPT09IENVU1RPTV9MT09QX1NUQVJUX05PREUpXG4gICAgICAgIHJldHVyblxuICAgICAgaWYgKG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uRGF0YVNvdXJjZUVtcHR5KVxuICAgICAgICByZXR1cm5cbiAgICAgIGlmIChub2RlLmRhdGEuX3BsdWdpbkluc3RhbGxMb2NrZWQpXG4gICAgICAgIHJldHVyblxuICAgICAgaGFuZGxlTm9kZVNlbGVjdChub2RlLmlkKVxuICAgIH0sXG4gICAgW2hhbmRsZU5vZGVTZWxlY3RdLFxuICApXG5cbiAgY29uc3QgaGFuZGxlTm9kZUNvbm5lY3QgPSB1c2VDYWxsYmFjazxPbkNvbm5lY3Q+KFxuICAgICh7IHNvdXJjZSwgc291cmNlSGFuZGxlLCB0YXJnZXQsIHRhcmdldEhhbmRsZSB9KSA9PiB7XG4gICAgICBpZiAoc291cmNlID09PSB0YXJnZXQpXG4gICAgICAgIHJldHVyblxuICAgICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHsgZ2V0Tm9kZXMsIHNldE5vZGVzLCBlZGdlcywgc2V0RWRnZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSB0YXJnZXQhKVxuICAgICAgY29uc3Qgc291cmNlTm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBzb3VyY2UhKVxuXG4gICAgICBpZiAodGFyZ2V0Tm9kZT8ucGFyZW50SWQgIT09IHNvdXJjZU5vZGU/LnBhcmVudElkKVxuICAgICAgICByZXR1cm5cblxuICAgICAgaWYgKFxuICAgICAgICBzb3VyY2VOb2RlPy50eXBlID09PSBDVVNUT01fTk9URV9OT0RFXG4gICAgICAgIHx8IHRhcmdldE5vZGU/LnR5cGUgPT09IENVU1RPTV9OT1RFX05PREVcbiAgICAgICkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBlZGdlcy5maW5kKFxuICAgICAgICAgIGVkZ2UgPT5cbiAgICAgICAgICAgIGVkZ2Uuc291cmNlID09PSBzb3VyY2VcbiAgICAgICAgICAgICYmIGVkZ2Uuc291cmNlSGFuZGxlID09PSBzb3VyY2VIYW5kbGVcbiAgICAgICAgICAgICYmIGVkZ2UudGFyZ2V0ID09PSB0YXJnZXRcbiAgICAgICAgICAgICYmIGVkZ2UudGFyZ2V0SGFuZGxlID09PSB0YXJnZXRIYW5kbGUsXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFyZW5kTm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSB0YXJnZXROb2RlPy5wYXJlbnRJZClcbiAgICAgIGNvbnN0IGlzSW5JdGVyYXRpb25cbiAgICAgICAgPSBwYXJlbmROb2RlICYmIHBhcmVuZE5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uSXRlcmF0aW9uXG4gICAgICBjb25zdCBpc0luTG9vcCA9ICEhcGFyZW5kTm9kZSAmJiBwYXJlbmROb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkxvb3BcblxuICAgICAgY29uc3QgbmV3RWRnZSA9IHtcbiAgICAgICAgaWQ6IGAke3NvdXJjZX0tJHtzb3VyY2VIYW5kbGV9LSR7dGFyZ2V0fS0ke3RhcmdldEhhbmRsZX1gLFxuICAgICAgICB0eXBlOiBDVVNUT01fRURHRSxcbiAgICAgICAgc291cmNlOiBzb3VyY2UhLFxuICAgICAgICB0YXJnZXQ6IHRhcmdldCEsXG4gICAgICAgIHNvdXJjZUhhbmRsZSxcbiAgICAgICAgdGFyZ2V0SGFuZGxlLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgc291cmNlVHlwZTogbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IHNvdXJjZSkhLmRhdGEudHlwZSxcbiAgICAgICAgICB0YXJnZXRUeXBlOiBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gdGFyZ2V0KSEuZGF0YS50eXBlLFxuICAgICAgICAgIGlzSW5JdGVyYXRpb24sXG4gICAgICAgICAgaXRlcmF0aW9uX2lkOiBpc0luSXRlcmF0aW9uID8gdGFyZ2V0Tm9kZT8ucGFyZW50SWQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgaXNJbkxvb3AsXG4gICAgICAgICAgbG9vcF9pZDogaXNJbkxvb3AgPyB0YXJnZXROb2RlPy5wYXJlbnRJZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgICAgekluZGV4OiB0YXJnZXROb2RlPy5wYXJlbnRJZFxuICAgICAgICAgID8gaXNJbkl0ZXJhdGlvblxuICAgICAgICAgICAgPyBJVEVSQVRJT05fQ0hJTERSRU5fWl9JTkRFWFxuICAgICAgICAgICAgOiBMT09QX0NISUxEUkVOX1pfSU5ERVhcbiAgICAgICAgICA6IDAsXG4gICAgICB9XG4gICAgICBjb25zdCBub2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwXG4gICAgICAgID0gZ2V0Tm9kZXNDb25uZWN0ZWRTb3VyY2VPclRhcmdldEhhbmRsZUlkc01hcChcbiAgICAgICAgICBbeyB0eXBlOiAnYWRkJywgZWRnZTogbmV3RWRnZSB9XSxcbiAgICAgICAgICBub2RlcyxcbiAgICAgICAgKVxuICAgICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQ6IE5vZGVbXSkgPT4ge1xuICAgICAgICBkcmFmdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgaWYgKG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBbbm9kZS5pZF0pIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSA9IHtcbiAgICAgICAgICAgICAgLi4ubm9kZS5kYXRhLFxuICAgICAgICAgICAgICAuLi5ub2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwW25vZGUuaWRdLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoZWRnZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICBkcmFmdC5wdXNoKG5ld0VkZ2UpXG4gICAgICB9KVxuXG4gICAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICAgIHNldEVkZ2VzKG5ld0VkZ2VzKVxuXG4gICAgICBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCgpXG4gICAgICBzYXZlU3RhdGVUb0hpc3RvcnkoV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZUNvbm5lY3QsIHtcbiAgICAgICAgbm9kZUlkOiB0YXJnZXROb2RlPy5pZCxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBbXG4gICAgICBnZXROb2Rlc1JlYWRPbmx5LFxuICAgICAgc3RvcmUsXG4gICAgICB3b3JrZmxvd1N0b3JlLFxuICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsXG4gICAgICBzYXZlU3RhdGVUb0hpc3RvcnksXG4gICAgXSxcbiAgKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVDb25uZWN0U3RhcnQgPSB1c2VDYWxsYmFjazxPbkNvbm5lY3RTdGFydD4oXG4gICAgKF8sIHsgbm9kZUlkLCBoYW5kbGVUeXBlLCBoYW5kbGVJZCB9KSA9PiB7XG4gICAgICBpZiAoZ2V0Tm9kZXNSZWFkT25seSgpKVxuICAgICAgICByZXR1cm5cblxuICAgICAgaWYgKG5vZGVJZCAmJiBoYW5kbGVUeXBlKSB7XG4gICAgICAgIGNvbnN0IHsgc2V0Q29ubmVjdGluZ05vZGVQYXlsb2FkIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICAgICAgY29uc3QgeyBnZXROb2RlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgICBjb25zdCBub2RlID0gZ2V0Tm9kZXMoKS5maW5kKG4gPT4gbi5pZCA9PT0gbm9kZUlkKSFcblxuICAgICAgICBpZiAobm9kZS50eXBlID09PSBDVVNUT01fTk9URV9OT0RFKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlZhcmlhYmxlQWdncmVnYXRvclxuICAgICAgICAgIHx8IG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVmFyaWFibGVBc3NpZ25lclxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoaGFuZGxlVHlwZSA9PT0gJ3RhcmdldCcpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHNldENvbm5lY3RpbmdOb2RlUGF5bG9hZCh7XG4gICAgICAgICAgbm9kZUlkLFxuICAgICAgICAgIG5vZGVUeXBlOiBub2RlLmRhdGEudHlwZSxcbiAgICAgICAgICBoYW5kbGVUeXBlLFxuICAgICAgICAgIGhhbmRsZUlkLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG4gICAgW3N0b3JlLCB3b3JrZmxvd1N0b3JlLCBnZXROb2Rlc1JlYWRPbmx5XSxcbiAgKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVDb25uZWN0RW5kID0gdXNlQ2FsbGJhY2s8T25Db25uZWN0RW5kPihcbiAgICAoZTogYW55KSA9PiB7XG4gICAgICBpZiAoZ2V0Tm9kZXNSZWFkT25seSgpKVxuICAgICAgICByZXR1cm5cblxuICAgICAgY29uc3Qge1xuICAgICAgICBjb25uZWN0aW5nTm9kZVBheWxvYWQsXG4gICAgICAgIHNldENvbm5lY3RpbmdOb2RlUGF5bG9hZCxcbiAgICAgICAgZW50ZXJpbmdOb2RlUGF5bG9hZCxcbiAgICAgICAgc2V0RW50ZXJpbmdOb2RlUGF5bG9hZCxcbiAgICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICAgIGlmIChjb25uZWN0aW5nTm9kZVBheWxvYWQgJiYgZW50ZXJpbmdOb2RlUGF5bG9hZCkge1xuICAgICAgICBjb25zdCB7IHNldFNob3dBc3NpZ25WYXJpYWJsZVBvcHVwLCBob3ZlcmluZ0Fzc2lnblZhcmlhYmxlR3JvdXBJZCB9XG4gICAgICAgICAgPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICAgICAgY29uc3QgeyBzY3JlZW5Ub0Zsb3dQb3NpdGlvbiB9ID0gcmVhY3RmbG93XG4gICAgICAgIGNvbnN0IHsgZ2V0Tm9kZXMsIHNldE5vZGVzIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgICAgICBjb25zdCBmcm9tSGFuZGxlVHlwZSA9IGNvbm5lY3RpbmdOb2RlUGF5bG9hZC5oYW5kbGVUeXBlXG4gICAgICAgIGNvbnN0IGZyb21IYW5kbGVJZCA9IGNvbm5lY3RpbmdOb2RlUGF5bG9hZC5oYW5kbGVJZFxuICAgICAgICBjb25zdCBmcm9tTm9kZSA9IG5vZGVzLmZpbmQoXG4gICAgICAgICAgbiA9PiBuLmlkID09PSBjb25uZWN0aW5nTm9kZVBheWxvYWQubm9kZUlkLFxuICAgICAgICApIVxuICAgICAgICBjb25zdCB0b05vZGUgPSBub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZW50ZXJpbmdOb2RlUGF5bG9hZC5ub2RlSWQpIVxuICAgICAgICBjb25zdCB0b1BhcmVudE5vZGUgPSBub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gdG9Ob2RlLnBhcmVudElkKVxuXG4gICAgICAgIGlmIChmcm9tTm9kZS5wYXJlbnRJZCAhPT0gdG9Ob2RlLnBhcmVudElkKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gc2NyZWVuVG9GbG93UG9zaXRpb24oeyB4OiBlLngsIHk6IGUueSB9KVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBmcm9tSGFuZGxlVHlwZSA9PT0gJ3NvdXJjZSdcbiAgICAgICAgICAmJiAodG9Ob2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlZhcmlhYmxlQXNzaWduZXJcbiAgICAgICAgICAgIHx8IHRvTm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3IpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IGdyb3VwRW5hYmxlZCA9IHRvTm9kZS5kYXRhLmFkdmFuY2VkX3NldHRpbmdzPy5ncm91cF9lbmFibGVkXG4gICAgICAgICAgY29uc3QgZmlyc3RHcm91cElkID0gdG9Ob2RlLmRhdGEuYWR2YW5jZWRfc2V0dGluZ3M/Lmdyb3Vwc1swXS5ncm91cElkXG4gICAgICAgICAgbGV0IGhhbmRsZUlkID0gJ3RhcmdldCdcblxuICAgICAgICAgIGlmIChncm91cEVuYWJsZWQpIHtcbiAgICAgICAgICAgIGlmIChob3ZlcmluZ0Fzc2lnblZhcmlhYmxlR3JvdXBJZClcbiAgICAgICAgICAgICAgaGFuZGxlSWQgPSBob3ZlcmluZ0Fzc2lnblZhcmlhYmxlR3JvdXBJZFxuICAgICAgICAgICAgZWxzZSBoYW5kbGVJZCA9IGZpcnN0R3JvdXBJZFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgZHJhZnQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAobm9kZS5pZCA9PT0gdG9Ob2RlLmlkKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5kYXRhLl9zaG93QWRkVmFyaWFibGVQb3B1cCA9IHRydWVcbiAgICAgICAgICAgICAgICBub2RlLmRhdGEuX2hvbGRBZGRWYXJpYWJsZVBvcHVwID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG4gICAgICAgICAgc2V0U2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAoe1xuICAgICAgICAgICAgbm9kZUlkOiBmcm9tTm9kZS5pZCxcbiAgICAgICAgICAgIG5vZGVEYXRhOiBmcm9tTm9kZS5kYXRhLFxuICAgICAgICAgICAgdmFyaWFibGVBc3NpZ25lck5vZGVJZDogdG9Ob2RlLmlkLFxuICAgICAgICAgICAgdmFyaWFibGVBc3NpZ25lck5vZGVEYXRhOiB0b05vZGUuZGF0YSxcbiAgICAgICAgICAgIHZhcmlhYmxlQXNzaWduZXJOb2RlSGFuZGxlSWQ6IGhhbmRsZUlkLFxuICAgICAgICAgICAgcGFyZW50Tm9kZTogdG9QYXJlbnROb2RlLFxuICAgICAgICAgICAgeDogeCAtIHRvTm9kZS5wb3NpdGlvbkFic29sdXRlIS54LFxuICAgICAgICAgICAgeTogeSAtIHRvTm9kZS5wb3NpdGlvbkFic29sdXRlIS55LFxuICAgICAgICAgIH0pXG4gICAgICAgICAgaGFuZGxlTm9kZUNvbm5lY3Qoe1xuICAgICAgICAgICAgc291cmNlOiBmcm9tTm9kZS5pZCxcbiAgICAgICAgICAgIHNvdXJjZUhhbmRsZTogZnJvbUhhbmRsZUlkLFxuICAgICAgICAgICAgdGFyZ2V0OiB0b05vZGUuaWQsXG4gICAgICAgICAgICB0YXJnZXRIYW5kbGU6ICd0YXJnZXQnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldENvbm5lY3RpbmdOb2RlUGF5bG9hZCh1bmRlZmluZWQpXG4gICAgICBzZXRFbnRlcmluZ05vZGVQYXlsb2FkKHVuZGVmaW5lZClcbiAgICB9LFxuICAgIFtzdG9yZSwgaGFuZGxlTm9kZUNvbm5lY3QsIGdldE5vZGVzUmVhZE9ubHksIHdvcmtmbG93U3RvcmUsIHJlYWN0Zmxvd10sXG4gIClcblxuICBjb25zdCB7IGRlbGV0ZU5vZGVJbnNwZWN0b3JWYXJzIH0gPSB1c2VJbnNwZWN0VmFyc0NydWQoKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVEZWxldGUgPSB1c2VDYWxsYmFjayhcbiAgICAobm9kZUlkOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChnZXROb2Rlc1JlYWRPbmx5KCkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjb25zdCB7IGdldE5vZGVzLCBzZXROb2RlcywgZWRnZXMsIHNldEVkZ2VzIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgICAgY29uc3QgY3VycmVudE5vZGVJbmRleCA9IG5vZGVzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVJZClcbiAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZXNbY3VycmVudE5vZGVJbmRleF1cblxuICAgICAgaWYgKCFjdXJyZW50Tm9kZSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZXNNZXRhRGF0YU1hcD8uW2N1cnJlbnROb2RlLmRhdGEudHlwZSBhcyBCbG9ja0VudW1dPy5tZXRhRGF0YVxuICAgICAgICAgIC5pc1VuZGVsZXRhYmxlXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZU5vZGVJbnNwZWN0b3JWYXJzKG5vZGVJZClcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5JdGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgaXRlcmF0aW9uQ2hpbGRyZW4gPSBub2Rlcy5maWx0ZXIoXG4gICAgICAgICAgbm9kZSA9PiBub2RlLnBhcmVudElkID09PSBjdXJyZW50Tm9kZS5pZCxcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChpdGVyYXRpb25DaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoY3VycmVudE5vZGUuZGF0YS5faXNCdW5kbGVkKSB7XG4gICAgICAgICAgICBpdGVyYXRpb25DaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICBoYW5kbGVOb2RlRGVsZXRlKGNoaWxkLmlkKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVOb2RlRGVsZXRlKG5vZGVJZClcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9uQ2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgIGhhbmRsZU5vZGVEZWxldGUoaXRlcmF0aW9uQ2hpbGRyZW5bMF0uaWQpXG4gICAgICAgICAgICAgIGhhbmRsZU5vZGVEZWxldGUobm9kZUlkKVxuXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBzZXRTaG93Q29uZmlybSwgc2hvd0NvbmZpcm0gfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgICAgICAgICBpZiAoIXNob3dDb25maXJtKSB7XG4gICAgICAgICAgICAgIHNldFNob3dDb25maXJtKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdCgnbm9kZXMuaXRlcmF0aW9uLmRlbGV0ZVRpdGxlJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgICAgICAgICAgICBkZXNjOiB0KCdub2Rlcy5pdGVyYXRpb24uZGVsZXRlRGVzYycsIHsgbnM6ICd3b3JrZmxvdycgfSkgfHwgJycsXG4gICAgICAgICAgICAgICAgb25Db25maXJtOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpdGVyYXRpb25DaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlRGVsZXRlKGNoaWxkLmlkKVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIGhhbmRsZU5vZGVEZWxldGUobm9kZUlkKVxuICAgICAgICAgICAgICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQoKVxuICAgICAgICAgICAgICAgICAgc2V0U2hvd0NvbmZpcm0odW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudE5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uTG9vcCkge1xuICAgICAgICBjb25zdCBsb29wQ2hpbGRyZW4gPSBub2Rlcy5maWx0ZXIoXG4gICAgICAgICAgbm9kZSA9PiBub2RlLnBhcmVudElkID09PSBjdXJyZW50Tm9kZS5pZCxcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChsb29wQ2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnROb2RlLmRhdGEuX2lzQnVuZGxlZCkge1xuICAgICAgICAgICAgbG9vcENoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgIGhhbmRsZU5vZGVEZWxldGUoY2hpbGQuaWQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZU5vZGVEZWxldGUobm9kZUlkKVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChsb29wQ2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgIGhhbmRsZU5vZGVEZWxldGUobG9vcENoaWxkcmVuWzBdLmlkKVxuICAgICAgICAgICAgICBoYW5kbGVOb2RlRGVsZXRlKG5vZGVJZClcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgc2V0U2hvd0NvbmZpcm0sIHNob3dDb25maXJtIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcblxuICAgICAgICAgICAgaWYgKCFzaG93Q29uZmlybSkge1xuICAgICAgICAgICAgICBzZXRTaG93Q29uZmlybSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHQoJ25vZGVzLmxvb3AuZGVsZXRlVGl0bGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICAgICAgICAgIGRlc2M6IHQoJ25vZGVzLmxvb3AuZGVsZXRlRGVzYycsIHsgbnM6ICd3b3JrZmxvdycgfSkgfHwgJycsXG4gICAgICAgICAgICAgICAgb25Db25maXJtOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBsb29wQ2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTm9kZURlbGV0ZShjaGlsZC5pZClcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlRGVsZXRlKG5vZGVJZClcbiAgICAgICAgICAgICAgICAgIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KClcbiAgICAgICAgICAgICAgICAgIHNldFNob3dDb25maXJtKHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnROb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UpIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gY3VycmVudE5vZGVcbiAgICAgICAgY29uc3QgeyByYWdQaXBlbGluZVZhcmlhYmxlcywgc2V0UmFnUGlwZWxpbmVWYXJpYWJsZXMgfVxuICAgICAgICAgID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICAgIGlmIChyYWdQaXBlbGluZVZhcmlhYmxlcyAmJiBzZXRSYWdQaXBlbGluZVZhcmlhYmxlcykge1xuICAgICAgICAgIGNvbnN0IG5ld1JhZ1BpcGVsaW5lVmFyaWFibGVzOiBSQUdQaXBlbGluZVZhcmlhYmxlcyA9IFtdXG4gICAgICAgICAgcmFnUGlwZWxpbmVWYXJpYWJsZXMuZm9yRWFjaCgodmFyaWFibGUpID0+IHtcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZS5iZWxvbmdfdG9fbm9kZV9pZCA9PT0gaWQpXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgbmV3UmFnUGlwZWxpbmVWYXJpYWJsZXMucHVzaCh2YXJpYWJsZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIHNldFJhZ1BpcGVsaW5lVmFyaWFibGVzKG5ld1JhZ1BpcGVsaW5lVmFyaWFibGVzKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbm5lY3RlZEVkZ2VzID0gZ2V0Q29ubmVjdGVkRWRnZXMoW3sgaWQ6IG5vZGVJZCB9IGFzIE5vZGVdLCBlZGdlcylcbiAgICAgIGNvbnN0IG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBcbiAgICAgICAgPSBnZXROb2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwKFxuICAgICAgICAgIGNvbm5lY3RlZEVkZ2VzLm1hcChlZGdlID0+ICh7IHR5cGU6ICdyZW1vdmUnLCBlZGdlIH0pKSxcbiAgICAgICAgICBub2RlcyxcbiAgICAgICAgKVxuICAgICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQ6IE5vZGVbXSkgPT4ge1xuICAgICAgICBkcmFmdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgaWYgKG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBbbm9kZS5pZF0pIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSA9IHtcbiAgICAgICAgICAgICAgLi4ubm9kZS5kYXRhLFxuICAgICAgICAgICAgICAuLi5ub2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwW25vZGUuaWRdLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChub2RlLmlkID09PSBjdXJyZW50Tm9kZS5wYXJlbnRJZCkge1xuICAgICAgICAgICAgbm9kZS5kYXRhLl9jaGlsZHJlbiA9IG5vZGUuZGF0YS5fY2hpbGRyZW4/LmZpbHRlcihcbiAgICAgICAgICAgICAgY2hpbGQgPT4gY2hpbGQubm9kZUlkICE9PSBub2RlSWQsXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBkcmFmdC5zcGxpY2UoY3VycmVudE5vZGVJbmRleCwgMSlcbiAgICAgIH0pXG4gICAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICAgIGNvbnN0IG5ld0VkZ2VzID0gcHJvZHVjZShlZGdlcywgKGRyYWZ0KSA9PiB7XG4gICAgICAgIHJldHVybiBkcmFmdC5maWx0ZXIoXG4gICAgICAgICAgZWRnZSA9PlxuICAgICAgICAgICAgIWNvbm5lY3RlZEVkZ2VzLmZpbmQoXG4gICAgICAgICAgICAgIGNvbm5lY3RlZEVkZ2UgPT4gY29ubmVjdGVkRWRnZS5pZCA9PT0gZWRnZS5pZCxcbiAgICAgICAgICAgICksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICBzZXRFZGdlcyhuZXdFZGdlcylcbiAgICAgIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KClcblxuICAgICAgaWYgKGN1cnJlbnROb2RlLnR5cGUgPT09IENVU1RPTV9OT1RFX05PREUpIHtcbiAgICAgICAgc2F2ZVN0YXRlVG9IaXN0b3J5KFdvcmtmbG93SGlzdG9yeUV2ZW50Lk5vdGVEZWxldGUsIHtcbiAgICAgICAgICBub2RlSWQ6IGN1cnJlbnROb2RlLmlkLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHNhdmVTdGF0ZVRvSGlzdG9yeShXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlRGVsZXRlLCB7XG4gICAgICAgICAgbm9kZUlkOiBjdXJyZW50Tm9kZS5pZCxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIFtcbiAgICAgIGdldE5vZGVzUmVhZE9ubHksXG4gICAgICBzdG9yZSxcbiAgICAgIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0LFxuICAgICAgc2F2ZVN0YXRlVG9IaXN0b3J5LFxuICAgICAgd29ya2Zsb3dTdG9yZSxcbiAgICAgIHQsXG4gICAgICBub2Rlc01ldGFEYXRhTWFwLFxuICAgICAgZGVsZXRlTm9kZUluc3BlY3RvclZhcnMsXG4gICAgXSxcbiAgKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVBZGQgPSB1c2VDYWxsYmFjazxPbk5vZGVBZGQ+KFxuICAgIChcbiAgICAgIHtcbiAgICAgICAgbm9kZVR5cGUsXG4gICAgICAgIHNvdXJjZUhhbmRsZSA9ICdzb3VyY2UnLFxuICAgICAgICB0YXJnZXRIYW5kbGUgPSAndGFyZ2V0JyxcbiAgICAgICAgcGx1Z2luRGVmYXVsdFZhbHVlLFxuICAgICAgfSxcbiAgICAgIHsgcHJldk5vZGVJZCwgcHJldk5vZGVTb3VyY2VIYW5kbGUsIG5leHROb2RlSWQsIG5leHROb2RlVGFyZ2V0SGFuZGxlIH0sXG4gICAgKSA9PiB7XG4gICAgICBpZiAoZ2V0Tm9kZXNSZWFkT25seSgpKVxuICAgICAgICByZXR1cm5cblxuICAgICAgY29uc3QgeyBnZXROb2Rlcywgc2V0Tm9kZXMsIGVkZ2VzLCBzZXRFZGdlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgICBjb25zdCBub2Rlc1dpdGhTYW1lVHlwZSA9IG5vZGVzLmZpbHRlcihcbiAgICAgICAgbm9kZSA9PiBub2RlLmRhdGEudHlwZSA9PT0gbm9kZVR5cGUsXG4gICAgICApXG4gICAgICBjb25zdCB7IGRlZmF1bHRWYWx1ZSB9ID0gbm9kZXNNZXRhRGF0YU1hcCFbbm9kZVR5cGVdXG4gICAgICBjb25zdCB7IG5ld05vZGUsIG5ld0l0ZXJhdGlvblN0YXJ0Tm9kZSwgbmV3TG9vcFN0YXJ0Tm9kZSB9XG4gICAgICAgID0gZ2VuZXJhdGVOZXdOb2RlKHtcbiAgICAgICAgICB0eXBlOiBnZXROb2RlQ3VzdG9tVHlwZUJ5Tm9kZURhdGFUeXBlKG5vZGVUeXBlKSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAuLi4oZGVmYXVsdFZhbHVlIGFzIGFueSksXG4gICAgICAgICAgICB0aXRsZTpcbiAgICAgICAgICAgICAgbm9kZXNXaXRoU2FtZVR5cGUubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgID8gYCR7ZGVmYXVsdFZhbHVlLnRpdGxlfSAke25vZGVzV2l0aFNhbWVUeXBlLmxlbmd0aCArIDF9YFxuICAgICAgICAgICAgICAgIDogZGVmYXVsdFZhbHVlLnRpdGxlLFxuICAgICAgICAgICAgLi4ucGx1Z2luRGVmYXVsdFZhbHVlLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHRydWUsXG4gICAgICAgICAgICBfc2hvd0FkZFZhcmlhYmxlUG9wdXA6XG4gICAgICAgICAgICAgIChub2RlVHlwZSA9PT0gQmxvY2tFbnVtLlZhcmlhYmxlQXNzaWduZXJcbiAgICAgICAgICAgICAgICB8fCBub2RlVHlwZSA9PT0gQmxvY2tFbnVtLlZhcmlhYmxlQWdncmVnYXRvcilcbiAgICAgICAgICAgICAgJiYgISFwcmV2Tm9kZUlkLFxuICAgICAgICAgICAgX2hvbGRBZGRWYXJpYWJsZVBvcHVwOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgaWYgKHByZXZOb2RlSWQgJiYgIW5leHROb2RlSWQpIHtcbiAgICAgICAgY29uc3QgcHJldk5vZGVJbmRleCA9IG5vZGVzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IHByZXZOb2RlSWQpXG4gICAgICAgIGNvbnN0IHByZXZOb2RlID0gbm9kZXNbcHJldk5vZGVJbmRleF1cbiAgICAgICAgY29uc3Qgb3V0Z29lcnMgPSBnZXRPdXRnb2VycyhwcmV2Tm9kZSwgbm9kZXMsIGVkZ2VzKS5zb3J0KFxuICAgICAgICAgIChhLCBiKSA9PiBhLnBvc2l0aW9uLnkgLSBiLnBvc2l0aW9uLnksXG4gICAgICAgIClcbiAgICAgICAgY29uc3QgbGFzdE91dGdvZXIgPSBvdXRnb2Vyc1tvdXRnb2Vycy5sZW5ndGggLSAxXVxuXG4gICAgICAgIG5ld05vZGUuZGF0YS5fY29ubmVjdGVkVGFyZ2V0SGFuZGxlSWRzXG4gICAgICAgICAgPSBub2RlVHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UgPyBbXSA6IFt0YXJnZXRIYW5kbGVdXG4gICAgICAgIG5ld05vZGUuZGF0YS5fY29ubmVjdGVkU291cmNlSGFuZGxlSWRzID0gW11cbiAgICAgICAgbmV3Tm9kZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgICB4OiBsYXN0T3V0Z29lclxuICAgICAgICAgICAgPyBsYXN0T3V0Z29lci5wb3NpdGlvbi54XG4gICAgICAgICAgICA6IHByZXZOb2RlLnBvc2l0aW9uLnggKyBwcmV2Tm9kZS53aWR0aCEgKyBYX09GRlNFVCxcbiAgICAgICAgICB5OiBsYXN0T3V0Z29lclxuICAgICAgICAgICAgPyBsYXN0T3V0Z29lci5wb3NpdGlvbi55ICsgbGFzdE91dGdvZXIuaGVpZ2h0ISArIFlfT0ZGU0VUXG4gICAgICAgICAgICA6IHByZXZOb2RlLnBvc2l0aW9uLnksXG4gICAgICAgIH1cbiAgICAgICAgbmV3Tm9kZS5wYXJlbnRJZCA9IHByZXZOb2RlLnBhcmVudElkXG4gICAgICAgIG5ld05vZGUuZXh0ZW50ID0gcHJldk5vZGUuZXh0ZW50XG5cbiAgICAgICAgY29uc3QgcGFyZW50Tm9kZVxuICAgICAgICAgID0gbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IHByZXZOb2RlLnBhcmVudElkKSB8fCBudWxsXG4gICAgICAgIGNvbnN0IGlzSW5JdGVyYXRpb25cbiAgICAgICAgICA9ICEhcGFyZW50Tm9kZSAmJiBwYXJlbnROb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkl0ZXJhdGlvblxuICAgICAgICBjb25zdCBpc0luTG9vcFxuICAgICAgICAgID0gISFwYXJlbnROb2RlICYmIHBhcmVudE5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uTG9vcFxuXG4gICAgICAgIGlmIChwcmV2Tm9kZS5wYXJlbnRJZCkge1xuICAgICAgICAgIG5ld05vZGUuZGF0YS5pc0luSXRlcmF0aW9uID0gaXNJbkl0ZXJhdGlvblxuICAgICAgICAgIG5ld05vZGUuZGF0YS5pc0luTG9vcCA9IGlzSW5Mb29wXG4gICAgICAgICAgaWYgKGlzSW5JdGVyYXRpb24pIHtcbiAgICAgICAgICAgIG5ld05vZGUuZGF0YS5pdGVyYXRpb25faWQgPSBwYXJlbnROb2RlLmlkXG4gICAgICAgICAgICBuZXdOb2RlLnpJbmRleCA9IElURVJBVElPTl9DSElMRFJFTl9aX0lOREVYXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc0luTG9vcCkge1xuICAgICAgICAgICAgbmV3Tm9kZS5kYXRhLmxvb3BfaWQgPSBwYXJlbnROb2RlLmlkXG4gICAgICAgICAgICBuZXdOb2RlLnpJbmRleCA9IExPT1BfQ0hJTERSRU5fWl9JTkRFWFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBpc0luSXRlcmF0aW9uXG4gICAgICAgICAgICAmJiAobmV3Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5BbnN3ZXJcbiAgICAgICAgICAgICAgfHwgbmV3Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Ub29sXG4gICAgICAgICAgICAgIHx8IG5ld05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uQXNzaWduZXIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVyTm9kZURhdGE6IEl0ZXJhdGlvbk5vZGVUeXBlID0gcGFyZW50Tm9kZS5kYXRhXG4gICAgICAgICAgICBpdGVyTm9kZURhdGEuX2lzU2hvd1RpcHMgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGlzSW5Mb29wXG4gICAgICAgICAgICAmJiAobmV3Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5BbnN3ZXJcbiAgICAgICAgICAgICAgfHwgbmV3Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Ub29sXG4gICAgICAgICAgICAgIHx8IG5ld05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uQXNzaWduZXIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVyTm9kZURhdGE6IEl0ZXJhdGlvbk5vZGVUeXBlID0gcGFyZW50Tm9kZS5kYXRhXG4gICAgICAgICAgICBpdGVyTm9kZURhdGEuX2lzU2hvd1RpcHMgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld0VkZ2UgPSBudWxsXG4gICAgICAgIGlmIChub2RlVHlwZSAhPT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UpIHtcbiAgICAgICAgICBuZXdFZGdlID0ge1xuICAgICAgICAgICAgaWQ6IGAke3ByZXZOb2RlSWR9LSR7cHJldk5vZGVTb3VyY2VIYW5kbGV9LSR7bmV3Tm9kZS5pZH0tJHt0YXJnZXRIYW5kbGV9YCxcbiAgICAgICAgICAgIHR5cGU6IENVU1RPTV9FREdFLFxuICAgICAgICAgICAgc291cmNlOiBwcmV2Tm9kZUlkLFxuICAgICAgICAgICAgc291cmNlSGFuZGxlOiBwcmV2Tm9kZVNvdXJjZUhhbmRsZSxcbiAgICAgICAgICAgIHRhcmdldDogbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgIHRhcmdldEhhbmRsZSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgc291cmNlVHlwZTogcHJldk5vZGUuZGF0YS50eXBlLFxuICAgICAgICAgICAgICB0YXJnZXRUeXBlOiBuZXdOb2RlLmRhdGEudHlwZSxcbiAgICAgICAgICAgICAgaXNJbkl0ZXJhdGlvbixcbiAgICAgICAgICAgICAgaXNJbkxvb3AsXG4gICAgICAgICAgICAgIGl0ZXJhdGlvbl9pZDogaXNJbkl0ZXJhdGlvbiA/IHByZXZOb2RlLnBhcmVudElkIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBsb29wX2lkOiBpc0luTG9vcCA/IHByZXZOb2RlLnBhcmVudElkIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBfY29ubmVjdGVkTm9kZUlzU2VsZWN0ZWQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgekluZGV4OiBwcmV2Tm9kZS5wYXJlbnRJZFxuICAgICAgICAgICAgICA/IGlzSW5JdGVyYXRpb25cbiAgICAgICAgICAgICAgICA/IElURVJBVElPTl9DSElMRFJFTl9aX0lOREVYXG4gICAgICAgICAgICAgICAgOiBMT09QX0NISUxEUkVOX1pfSU5ERVhcbiAgICAgICAgICAgICAgOiAwLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBcbiAgICAgICAgICA9IGdldE5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXAoXG4gICAgICAgICAgICAobmV3RWRnZSA/IFt7IHR5cGU6ICdhZGQnLCBlZGdlOiBuZXdFZGdlIH1dIDogW10pLFxuICAgICAgICAgICAgbm9kZXMsXG4gICAgICAgICAgKVxuICAgICAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdDogTm9kZVtdKSA9PiB7XG4gICAgICAgICAgZHJhZnQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgbm9kZS5kYXRhLnNlbGVjdGVkID0gZmFsc2VcblxuICAgICAgICAgICAgaWYgKG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBbbm9kZS5pZF0pIHtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLm5vZGUuZGF0YSxcbiAgICAgICAgICAgICAgICAuLi5ub2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwW25vZGUuaWRdLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgbm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5JdGVyYXRpb25cbiAgICAgICAgICAgICAgJiYgcHJldk5vZGUucGFyZW50SWQgPT09IG5vZGUuaWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBub2RlLmRhdGEuX2NoaWxkcmVuPy5wdXNoKHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IG5ld05vZGUuaWQsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6IG5ld05vZGUuZGF0YS50eXBlLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uTG9vcFxuICAgICAgICAgICAgICAmJiBwcmV2Tm9kZS5wYXJlbnRJZCA9PT0gbm9kZS5pZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YS5fY2hpbGRyZW4/LnB1c2goe1xuICAgICAgICAgICAgICAgIG5vZGVJZDogbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogbmV3Tm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBkcmFmdC5wdXNoKG5ld05vZGUpXG5cbiAgICAgICAgICBpZiAobmV3SXRlcmF0aW9uU3RhcnROb2RlKVxuICAgICAgICAgICAgZHJhZnQucHVzaChuZXdJdGVyYXRpb25TdGFydE5vZGUpXG5cbiAgICAgICAgICBpZiAobmV3TG9vcFN0YXJ0Tm9kZSlcbiAgICAgICAgICAgIGRyYWZ0LnB1c2gobmV3TG9vcFN0YXJ0Tm9kZSlcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5WYXJpYWJsZUFzc2lnbmVyXG4gICAgICAgICAgfHwgbmV3Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3JcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3QgeyBzZXRTaG93QXNzaWduVmFyaWFibGVQb3B1cCB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAgICAgICBzZXRTaG93QXNzaWduVmFyaWFibGVQb3B1cCh7XG4gICAgICAgICAgICBub2RlSWQ6IHByZXZOb2RlLmlkLFxuICAgICAgICAgICAgbm9kZURhdGE6IHByZXZOb2RlLmRhdGEsXG4gICAgICAgICAgICB2YXJpYWJsZUFzc2lnbmVyTm9kZUlkOiBuZXdOb2RlLmlkLFxuICAgICAgICAgICAgdmFyaWFibGVBc3NpZ25lck5vZGVEYXRhOiBuZXdOb2RlLmRhdGEgYXMgVmFyaWFibGVBc3NpZ25lck5vZGVUeXBlLFxuICAgICAgICAgICAgdmFyaWFibGVBc3NpZ25lck5vZGVIYW5kbGVJZDogdGFyZ2V0SGFuZGxlLFxuICAgICAgICAgICAgcGFyZW50Tm9kZTogbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IG5ld05vZGUucGFyZW50SWQpLFxuICAgICAgICAgICAgeDogLTI1LFxuICAgICAgICAgICAgeTogNDQsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoZWRnZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICAgIGRyYWZ0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IHtcbiAgICAgICAgICAgICAgLi4uaXRlbS5kYXRhLFxuICAgICAgICAgICAgICBfY29ubmVjdGVkTm9kZUlzU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKG5ld0VkZ2UpXG4gICAgICAgICAgICBkcmFmdC5wdXNoKG5ld0VkZ2UpXG4gICAgICAgIH0pXG5cbiAgICAgICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG4gICAgICAgIHNldEVkZ2VzKG5ld0VkZ2VzKVxuICAgICAgfVxuICAgICAgaWYgKCFwcmV2Tm9kZUlkICYmIG5leHROb2RlSWQpIHtcbiAgICAgICAgY29uc3QgbmV4dE5vZGVJbmRleCA9IG5vZGVzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5leHROb2RlSWQpXG4gICAgICAgIGNvbnN0IG5leHROb2RlID0gbm9kZXNbbmV4dE5vZGVJbmRleF0hXG4gICAgICAgIGlmIChcbiAgICAgICAgICBub2RlVHlwZSAhPT0gQmxvY2tFbnVtLklmRWxzZVxuICAgICAgICAgICYmIG5vZGVUeXBlICE9PSBCbG9ja0VudW0uUXVlc3Rpb25DbGFzc2lmaWVyXG4gICAgICAgICkge1xuICAgICAgICAgIG5ld05vZGUuZGF0YS5fY29ubmVjdGVkU291cmNlSGFuZGxlSWRzID0gW3NvdXJjZUhhbmRsZV1cbiAgICAgICAgfVxuICAgICAgICBuZXdOb2RlLmRhdGEuX2Nvbm5lY3RlZFRhcmdldEhhbmRsZUlkcyA9IFtdXG4gICAgICAgIG5ld05vZGUucG9zaXRpb24gPSB7XG4gICAgICAgICAgeDogbmV4dE5vZGUucG9zaXRpb24ueCxcbiAgICAgICAgICB5OiBuZXh0Tm9kZS5wb3NpdGlvbi55LFxuICAgICAgICB9XG4gICAgICAgIG5ld05vZGUucGFyZW50SWQgPSBuZXh0Tm9kZS5wYXJlbnRJZFxuICAgICAgICBuZXdOb2RlLmV4dGVudCA9IG5leHROb2RlLmV4dGVudFxuXG4gICAgICAgIGNvbnN0IHBhcmVudE5vZGVcbiAgICAgICAgICA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBuZXh0Tm9kZS5wYXJlbnRJZCkgfHwgbnVsbFxuICAgICAgICBjb25zdCBpc0luSXRlcmF0aW9uXG4gICAgICAgICAgPSAhIXBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5JdGVyYXRpb25cbiAgICAgICAgY29uc3QgaXNJbkxvb3BcbiAgICAgICAgICA9ICEhcGFyZW50Tm9kZSAmJiBwYXJlbnROb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkxvb3BcblxuICAgICAgICBpZiAocGFyZW50Tm9kZSAmJiBuZXh0Tm9kZS5wYXJlbnRJZCkge1xuICAgICAgICAgIG5ld05vZGUuZGF0YS5pc0luSXRlcmF0aW9uID0gaXNJbkl0ZXJhdGlvblxuICAgICAgICAgIG5ld05vZGUuZGF0YS5pc0luTG9vcCA9IGlzSW5Mb29wXG4gICAgICAgICAgaWYgKGlzSW5JdGVyYXRpb24pIHtcbiAgICAgICAgICAgIG5ld05vZGUuZGF0YS5pdGVyYXRpb25faWQgPSBwYXJlbnROb2RlLmlkXG4gICAgICAgICAgICBuZXdOb2RlLnpJbmRleCA9IElURVJBVElPTl9DSElMRFJFTl9aX0lOREVYXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc0luTG9vcCkge1xuICAgICAgICAgICAgbmV3Tm9kZS5kYXRhLmxvb3BfaWQgPSBwYXJlbnROb2RlLmlkXG4gICAgICAgICAgICBuZXdOb2RlLnpJbmRleCA9IExPT1BfQ0hJTERSRU5fWl9JTkRFWFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdFZGdlXG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5vZGVUeXBlICE9PSBCbG9ja0VudW0uSWZFbHNlXG4gICAgICAgICAgJiYgbm9kZVR5cGUgIT09IEJsb2NrRW51bS5RdWVzdGlvbkNsYXNzaWZpZXJcbiAgICAgICAgICAmJiBub2RlVHlwZSAhPT0gQmxvY2tFbnVtLkxvb3BFbmRcbiAgICAgICAgKSB7XG4gICAgICAgICAgbmV3RWRnZSA9IHtcbiAgICAgICAgICAgIGlkOiBgJHtuZXdOb2RlLmlkfS0ke3NvdXJjZUhhbmRsZX0tJHtuZXh0Tm9kZUlkfS0ke25leHROb2RlVGFyZ2V0SGFuZGxlfWAsXG4gICAgICAgICAgICB0eXBlOiBDVVNUT01fRURHRSxcbiAgICAgICAgICAgIHNvdXJjZTogbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgIHNvdXJjZUhhbmRsZSxcbiAgICAgICAgICAgIHRhcmdldDogbmV4dE5vZGVJZCxcbiAgICAgICAgICAgIHRhcmdldEhhbmRsZTogbmV4dE5vZGVUYXJnZXRIYW5kbGUsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHNvdXJjZVR5cGU6IG5ld05vZGUuZGF0YS50eXBlLFxuICAgICAgICAgICAgICB0YXJnZXRUeXBlOiBuZXh0Tm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgICAgIGlzSW5JdGVyYXRpb24sXG4gICAgICAgICAgICAgIGlzSW5Mb29wLFxuICAgICAgICAgICAgICBpdGVyYXRpb25faWQ6IGlzSW5JdGVyYXRpb24gPyBuZXh0Tm9kZS5wYXJlbnRJZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgbG9vcF9pZDogaXNJbkxvb3AgPyBuZXh0Tm9kZS5wYXJlbnRJZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgX2Nvbm5lY3RlZE5vZGVJc1NlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHpJbmRleDogbmV4dE5vZGUucGFyZW50SWRcbiAgICAgICAgICAgICAgPyBpc0luSXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgPyBJVEVSQVRJT05fQ0hJTERSRU5fWl9JTkRFWFxuICAgICAgICAgICAgICAgIDogTE9PUF9DSElMRFJFTl9aX0lOREVYXG4gICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbm9kZXNDb25uZWN0ZWRTb3VyY2VPclRhcmdldEhhbmRsZUlkc01hcDogUmVjb3JkPHN0cmluZywgYW55PlxuICAgICAgICBpZiAobmV3RWRnZSkge1xuICAgICAgICAgIG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBcbiAgICAgICAgICAgID0gZ2V0Tm9kZXNDb25uZWN0ZWRTb3VyY2VPclRhcmdldEhhbmRsZUlkc01hcChcbiAgICAgICAgICAgICAgW3sgdHlwZTogJ2FkZCcsIGVkZ2U6IG5ld0VkZ2UgfV0sXG4gICAgICAgICAgICAgIG5vZGVzLFxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWZ0ZXJOb2Rlc0luU2FtZUJyYW5jaCA9IGdldEFmdGVyTm9kZXNJblNhbWVCcmFuY2gobmV4dE5vZGVJZCEpXG4gICAgICAgIGNvbnN0IGFmdGVyTm9kZXNJblNhbWVCcmFuY2hJZHMgPSBhZnRlck5vZGVzSW5TYW1lQnJhbmNoLm1hcChcbiAgICAgICAgICBub2RlID0+IG5vZGUuaWQsXG4gICAgICAgIClcbiAgICAgICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICBkcmFmdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICBub2RlLmRhdGEuc2VsZWN0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiAoYWZ0ZXJOb2Rlc0luU2FtZUJyYW5jaElkcy5pbmNsdWRlcyhub2RlLmlkKSlcbiAgICAgICAgICAgICAgbm9kZS5wb3NpdGlvbi54ICs9IE5PREVfV0lEVEhfWF9PRkZTRVRcblxuICAgICAgICAgICAgaWYgKG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXA/Lltub2RlLmlkXSkge1xuICAgICAgICAgICAgICBub2RlLmRhdGEgPSB7XG4gICAgICAgICAgICAgICAgLi4ubm9kZS5kYXRhLFxuICAgICAgICAgICAgICAgIC4uLm5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBbbm9kZS5pZF0sXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkl0ZXJhdGlvblxuICAgICAgICAgICAgICAmJiBuZXh0Tm9kZS5wYXJlbnRJZCA9PT0gbm9kZS5pZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YS5fY2hpbGRyZW4/LnB1c2goe1xuICAgICAgICAgICAgICAgIG5vZGVJZDogbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogbmV3Tm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgbm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5JdGVyYXRpb25cbiAgICAgICAgICAgICAgJiYgbm9kZS5kYXRhLnN0YXJ0X25vZGVfaWQgPT09IG5leHROb2RlSWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBub2RlLmRhdGEuc3RhcnRfbm9kZV9pZCA9IG5ld05vZGUuaWRcbiAgICAgICAgICAgICAgbm9kZS5kYXRhLnN0YXJ0Tm9kZVR5cGUgPSBuZXdOb2RlLmRhdGEudHlwZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uTG9vcFxuICAgICAgICAgICAgICAmJiBuZXh0Tm9kZS5wYXJlbnRJZCA9PT0gbm9kZS5pZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YS5fY2hpbGRyZW4/LnB1c2goe1xuICAgICAgICAgICAgICAgIG5vZGVJZDogbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogbmV3Tm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgbm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Mb29wXG4gICAgICAgICAgICAgICYmIG5vZGUuZGF0YS5zdGFydF9ub2RlX2lkID09PSBuZXh0Tm9kZUlkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhLnN0YXJ0X25vZGVfaWQgPSBuZXdOb2RlLmlkXG4gICAgICAgICAgICAgIG5vZGUuZGF0YS5zdGFydE5vZGVUeXBlID0gbmV3Tm9kZS5kYXRhLnR5cGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGRyYWZ0LnB1c2gobmV3Tm9kZSlcbiAgICAgICAgICBpZiAobmV3SXRlcmF0aW9uU3RhcnROb2RlKVxuICAgICAgICAgICAgZHJhZnQucHVzaChuZXdJdGVyYXRpb25TdGFydE5vZGUpXG4gICAgICAgICAgaWYgKG5ld0xvb3BTdGFydE5vZGUpXG4gICAgICAgICAgICBkcmFmdC5wdXNoKG5ld0xvb3BTdGFydE5vZGUpXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChuZXdFZGdlKSB7XG4gICAgICAgICAgY29uc3QgbmV3RWRnZXMgPSBwcm9kdWNlKGVkZ2VzLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICAgIGRyYWZ0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgaXRlbS5kYXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLml0ZW0uZGF0YSxcbiAgICAgICAgICAgICAgICBfY29ubmVjdGVkTm9kZUlzU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgZHJhZnQucHVzaChuZXdFZGdlKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICAgICAgICBzZXRFZGdlcyhuZXdFZGdlcylcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByZXZOb2RlSWQgJiYgbmV4dE5vZGVJZCkge1xuICAgICAgICBjb25zdCBwcmV2Tm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBwcmV2Tm9kZUlkKSFcbiAgICAgICAgY29uc3QgbmV4dE5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gbmV4dE5vZGVJZCkhXG5cbiAgICAgICAgbmV3Tm9kZS5kYXRhLl9jb25uZWN0ZWRUYXJnZXRIYW5kbGVJZHNcbiAgICAgICAgICA9IG5vZGVUeXBlID09PSBCbG9ja0VudW0uRGF0YVNvdXJjZSA/IFtdIDogW3RhcmdldEhhbmRsZV1cbiAgICAgICAgbmV3Tm9kZS5kYXRhLl9jb25uZWN0ZWRTb3VyY2VIYW5kbGVJZHMgPSBbc291cmNlSGFuZGxlXVxuICAgICAgICBuZXdOb2RlLnBvc2l0aW9uID0ge1xuICAgICAgICAgIHg6IG5leHROb2RlLnBvc2l0aW9uLngsXG4gICAgICAgICAgeTogbmV4dE5vZGUucG9zaXRpb24ueSxcbiAgICAgICAgfVxuICAgICAgICBuZXdOb2RlLnBhcmVudElkID0gcHJldk5vZGUucGFyZW50SWRcbiAgICAgICAgbmV3Tm9kZS5leHRlbnQgPSBwcmV2Tm9kZS5leHRlbnRcblxuICAgICAgICBjb25zdCBwYXJlbnROb2RlXG4gICAgICAgICAgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gcHJldk5vZGUucGFyZW50SWQpIHx8IG51bGxcbiAgICAgICAgY29uc3QgaXNJbkl0ZXJhdGlvblxuICAgICAgICAgID0gISFwYXJlbnROb2RlICYmIHBhcmVudE5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uSXRlcmF0aW9uXG4gICAgICAgIGNvbnN0IGlzSW5Mb29wXG4gICAgICAgICAgPSAhIXBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Mb29wXG5cbiAgICAgICAgaWYgKHBhcmVudE5vZGUgJiYgcHJldk5vZGUucGFyZW50SWQpIHtcbiAgICAgICAgICBuZXdOb2RlLmRhdGEuaXNJbkl0ZXJhdGlvbiA9IGlzSW5JdGVyYXRpb25cbiAgICAgICAgICBuZXdOb2RlLmRhdGEuaXNJbkxvb3AgPSBpc0luTG9vcFxuICAgICAgICAgIGlmIChpc0luSXRlcmF0aW9uKSB7XG4gICAgICAgICAgICBuZXdOb2RlLmRhdGEuaXRlcmF0aW9uX2lkID0gcGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgbmV3Tm9kZS56SW5kZXggPSBJVEVSQVRJT05fQ0hJTERSRU5fWl9JTkRFWFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNJbkxvb3ApIHtcbiAgICAgICAgICAgIG5ld05vZGUuZGF0YS5sb29wX2lkID0gcGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgbmV3Tm9kZS56SW5kZXggPSBMT09QX0NISUxEUkVOX1pfSU5ERVhcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50RWRnZUluZGV4ID0gZWRnZXMuZmluZEluZGV4KFxuICAgICAgICAgIGVkZ2UgPT4gZWRnZS5zb3VyY2UgPT09IHByZXZOb2RlSWQgJiYgZWRnZS50YXJnZXQgPT09IG5leHROb2RlSWQsXG4gICAgICAgIClcbiAgICAgICAgbGV0IG5ld1ByZXZFZGdlID0gbnVsbFxuXG4gICAgICAgIGlmIChub2RlVHlwZSAhPT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UpIHtcbiAgICAgICAgICBuZXdQcmV2RWRnZSA9IHtcbiAgICAgICAgICAgIGlkOiBgJHtwcmV2Tm9kZUlkfS0ke3ByZXZOb2RlU291cmNlSGFuZGxlfS0ke25ld05vZGUuaWR9LSR7dGFyZ2V0SGFuZGxlfWAsXG4gICAgICAgICAgICB0eXBlOiBDVVNUT01fRURHRSxcbiAgICAgICAgICAgIHNvdXJjZTogcHJldk5vZGVJZCxcbiAgICAgICAgICAgIHNvdXJjZUhhbmRsZTogcHJldk5vZGVTb3VyY2VIYW5kbGUsXG4gICAgICAgICAgICB0YXJnZXQ6IG5ld05vZGUuaWQsXG4gICAgICAgICAgICB0YXJnZXRIYW5kbGUsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHNvdXJjZVR5cGU6IHByZXZOb2RlLmRhdGEudHlwZSxcbiAgICAgICAgICAgICAgdGFyZ2V0VHlwZTogbmV3Tm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgICAgIGlzSW5JdGVyYXRpb24sXG4gICAgICAgICAgICAgIGlzSW5Mb29wLFxuICAgICAgICAgICAgICBpdGVyYXRpb25faWQ6IGlzSW5JdGVyYXRpb24gPyBwcmV2Tm9kZS5wYXJlbnRJZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgbG9vcF9pZDogaXNJbkxvb3AgPyBwcmV2Tm9kZS5wYXJlbnRJZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgX2Nvbm5lY3RlZE5vZGVJc1NlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHpJbmRleDogcHJldk5vZGUucGFyZW50SWRcbiAgICAgICAgICAgICAgPyBpc0luSXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgPyBJVEVSQVRJT05fQ0hJTERSRU5fWl9JTkRFWFxuICAgICAgICAgICAgICAgIDogTE9PUF9DSElMRFJFTl9aX0lOREVYXG4gICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3TmV4dEVkZ2U6IEVkZ2UgfCBudWxsID0gbnVsbFxuXG4gICAgICAgIGNvbnN0IG5leHROb2RlUGFyZW50Tm9kZVxuICAgICAgICAgID0gbm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IG5leHROb2RlLnBhcmVudElkKSB8fCBudWxsXG4gICAgICAgIGNvbnN0IGlzTmV4dE5vZGVJbkl0ZXJhdGlvblxuICAgICAgICAgID0gISFuZXh0Tm9kZVBhcmVudE5vZGVcbiAgICAgICAgICAgICYmIG5leHROb2RlUGFyZW50Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5JdGVyYXRpb25cbiAgICAgICAgY29uc3QgaXNOZXh0Tm9kZUluTG9vcFxuICAgICAgICAgID0gISFuZXh0Tm9kZVBhcmVudE5vZGVcbiAgICAgICAgICAgICYmIG5leHROb2RlUGFyZW50Tm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Mb29wXG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5vZGVUeXBlICE9PSBCbG9ja0VudW0uSWZFbHNlXG4gICAgICAgICAgJiYgbm9kZVR5cGUgIT09IEJsb2NrRW51bS5RdWVzdGlvbkNsYXNzaWZpZXJcbiAgICAgICAgICAmJiBub2RlVHlwZSAhPT0gQmxvY2tFbnVtLkxvb3BFbmRcbiAgICAgICAgKSB7XG4gICAgICAgICAgbmV3TmV4dEVkZ2UgPSB7XG4gICAgICAgICAgICBpZDogYCR7bmV3Tm9kZS5pZH0tJHtzb3VyY2VIYW5kbGV9LSR7bmV4dE5vZGVJZH0tJHtuZXh0Tm9kZVRhcmdldEhhbmRsZX1gLFxuICAgICAgICAgICAgdHlwZTogQ1VTVE9NX0VER0UsXG4gICAgICAgICAgICBzb3VyY2U6IG5ld05vZGUuaWQsXG4gICAgICAgICAgICBzb3VyY2VIYW5kbGUsXG4gICAgICAgICAgICB0YXJnZXQ6IG5leHROb2RlSWQsXG4gICAgICAgICAgICB0YXJnZXRIYW5kbGU6IG5leHROb2RlVGFyZ2V0SGFuZGxlLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBzb3VyY2VUeXBlOiBuZXdOb2RlLmRhdGEudHlwZSxcbiAgICAgICAgICAgICAgdGFyZ2V0VHlwZTogbmV4dE5vZGUuZGF0YS50eXBlLFxuICAgICAgICAgICAgICBpc0luSXRlcmF0aW9uOiBpc05leHROb2RlSW5JdGVyYXRpb24sXG4gICAgICAgICAgICAgIGlzSW5Mb29wOiBpc05leHROb2RlSW5Mb29wLFxuICAgICAgICAgICAgICBpdGVyYXRpb25faWQ6IGlzTmV4dE5vZGVJbkl0ZXJhdGlvblxuICAgICAgICAgICAgICAgID8gbmV4dE5vZGUucGFyZW50SWRcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgbG9vcF9pZDogaXNOZXh0Tm9kZUluTG9vcCA/IG5leHROb2RlLnBhcmVudElkIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBfY29ubmVjdGVkTm9kZUlzU2VsZWN0ZWQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgekluZGV4OiBuZXh0Tm9kZS5wYXJlbnRJZFxuICAgICAgICAgICAgICA/IGlzTmV4dE5vZGVJbkl0ZXJhdGlvblxuICAgICAgICAgICAgICAgID8gSVRFUkFUSU9OX0NISUxEUkVOX1pfSU5ERVhcbiAgICAgICAgICAgICAgICA6IExPT1BfQ0hJTERSRU5fWl9JTkRFWFxuICAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBcbiAgICAgICAgICA9IGdldE5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXAoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHsgdHlwZTogJ3JlbW92ZScsIGVkZ2U6IGVkZ2VzW2N1cnJlbnRFZGdlSW5kZXhdIH0sXG4gICAgICAgICAgICAgIC4uLihuZXdQcmV2RWRnZSA/IFt7IHR5cGU6ICdhZGQnLCBlZGdlOiBuZXdQcmV2RWRnZSB9XSA6IFtdKSxcbiAgICAgICAgICAgICAgLi4uKG5ld05leHRFZGdlID8gW3sgdHlwZTogJ2FkZCcsIGVkZ2U6IG5ld05leHRFZGdlIH1dIDogW10pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFsuLi5ub2RlcywgbmV3Tm9kZV0sXG4gICAgICAgICAgKVxuXG4gICAgICAgIGNvbnN0IGFmdGVyTm9kZXNJblNhbWVCcmFuY2ggPSBnZXRBZnRlck5vZGVzSW5TYW1lQnJhbmNoKG5leHROb2RlSWQhKVxuICAgICAgICBjb25zdCBhZnRlck5vZGVzSW5TYW1lQnJhbmNoSWRzID0gYWZ0ZXJOb2Rlc0luU2FtZUJyYW5jaC5tYXAoXG4gICAgICAgICAgbm9kZSA9PiBub2RlLmlkLFxuICAgICAgICApXG4gICAgICAgIGNvbnN0IG5ld05vZGVzID0gcHJvZHVjZShub2RlcywgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgZHJhZnQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgbm9kZS5kYXRhLnNlbGVjdGVkID0gZmFsc2VcblxuICAgICAgICAgICAgaWYgKG5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXBbbm9kZS5pZF0pIHtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLm5vZGUuZGF0YSxcbiAgICAgICAgICAgICAgICAuLi5ub2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwW25vZGUuaWRdLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWZ0ZXJOb2Rlc0luU2FtZUJyYW5jaElkcy5pbmNsdWRlcyhub2RlLmlkKSlcbiAgICAgICAgICAgICAgbm9kZS5wb3NpdGlvbi54ICs9IE5PREVfV0lEVEhfWF9PRkZTRVRcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkl0ZXJhdGlvblxuICAgICAgICAgICAgICAmJiBwcmV2Tm9kZS5wYXJlbnRJZCA9PT0gbm9kZS5pZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YS5fY2hpbGRyZW4/LnB1c2goe1xuICAgICAgICAgICAgICAgIG5vZGVJZDogbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogbmV3Tm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uTG9vcFxuICAgICAgICAgICAgICAmJiBwcmV2Tm9kZS5wYXJlbnRJZCA9PT0gbm9kZS5pZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YS5fY2hpbGRyZW4/LnB1c2goe1xuICAgICAgICAgICAgICAgIG5vZGVJZDogbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogbmV3Tm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBkcmFmdC5wdXNoKG5ld05vZGUpXG4gICAgICAgICAgaWYgKG5ld0l0ZXJhdGlvblN0YXJ0Tm9kZSlcbiAgICAgICAgICAgIGRyYWZ0LnB1c2gobmV3SXRlcmF0aW9uU3RhcnROb2RlKVxuICAgICAgICAgIGlmIChuZXdMb29wU3RhcnROb2RlKVxuICAgICAgICAgICAgZHJhZnQucHVzaChuZXdMb29wU3RhcnROb2RlKVxuICAgICAgICB9KVxuICAgICAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5ld05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVmFyaWFibGVBc3NpZ25lclxuICAgICAgICAgIHx8IG5ld05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVmFyaWFibGVBZ2dyZWdhdG9yXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IHsgc2V0U2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgICAgICAgc2V0U2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAoe1xuICAgICAgICAgICAgbm9kZUlkOiBwcmV2Tm9kZS5pZCxcbiAgICAgICAgICAgIG5vZGVEYXRhOiBwcmV2Tm9kZS5kYXRhLFxuICAgICAgICAgICAgdmFyaWFibGVBc3NpZ25lck5vZGVJZDogbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgIHZhcmlhYmxlQXNzaWduZXJOb2RlRGF0YTogbmV3Tm9kZS5kYXRhIGFzIFZhcmlhYmxlQXNzaWduZXJOb2RlVHlwZSxcbiAgICAgICAgICAgIHZhcmlhYmxlQXNzaWduZXJOb2RlSGFuZGxlSWQ6IHRhcmdldEhhbmRsZSxcbiAgICAgICAgICAgIHBhcmVudE5vZGU6IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBuZXdOb2RlLnBhcmVudElkKSxcbiAgICAgICAgICAgIHg6IC0yNSxcbiAgICAgICAgICAgIHk6IDQ0LFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3RWRnZXMgPSBwcm9kdWNlKGVkZ2VzLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICBkcmFmdC5zcGxpY2UoY3VycmVudEVkZ2VJbmRleCwgMSlcbiAgICAgICAgICBkcmFmdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtLmRhdGEgPSB7XG4gICAgICAgICAgICAgIC4uLml0ZW0uZGF0YSxcbiAgICAgICAgICAgICAgX2Nvbm5lY3RlZE5vZGVJc1NlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmIChuZXdQcmV2RWRnZSlcbiAgICAgICAgICAgIGRyYWZ0LnB1c2gobmV3UHJldkVkZ2UpXG5cbiAgICAgICAgICBpZiAobmV3TmV4dEVkZ2UpXG4gICAgICAgICAgICBkcmFmdC5wdXNoKG5ld05leHRFZGdlKVxuICAgICAgICB9KVxuICAgICAgICBzZXRFZGdlcyhuZXdFZGdlcylcbiAgICAgIH1cbiAgICAgIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KClcbiAgICAgIHNhdmVTdGF0ZVRvSGlzdG9yeShXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlQWRkLCB7IG5vZGVJZDogbmV3Tm9kZS5pZCB9KVxuICAgIH0sXG4gICAgW1xuICAgICAgZ2V0Tm9kZXNSZWFkT25seSxcbiAgICAgIHN0b3JlLFxuICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsXG4gICAgICBzYXZlU3RhdGVUb0hpc3RvcnksXG4gICAgICB3b3JrZmxvd1N0b3JlLFxuICAgICAgZ2V0QWZ0ZXJOb2Rlc0luU2FtZUJyYW5jaCxcbiAgICAgIG5vZGVzTWV0YURhdGFNYXAsXG4gICAgXSxcbiAgKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVDaGFuZ2UgPSB1c2VDYWxsYmFjayhcbiAgICAoXG4gICAgICBjdXJyZW50Tm9kZUlkOiBzdHJpbmcsXG4gICAgICBub2RlVHlwZTogQmxvY2tFbnVtLFxuICAgICAgc291cmNlSGFuZGxlOiBzdHJpbmcsXG4gICAgICBwbHVnaW5EZWZhdWx0VmFsdWU/OiBQbHVnaW5EZWZhdWx0VmFsdWUsXG4gICAgKSA9PiB7XG4gICAgICBpZiAoZ2V0Tm9kZXNSZWFkT25seSgpKVxuICAgICAgICByZXR1cm5cblxuICAgICAgY29uc3QgeyBnZXROb2Rlcywgc2V0Tm9kZXMsIGVkZ2VzLCBzZXRFZGdlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBjdXJyZW50Tm9kZUlkKSFcbiAgICAgIGNvbnN0IGNvbm5lY3RlZEVkZ2VzID0gZ2V0Q29ubmVjdGVkRWRnZXMoW2N1cnJlbnROb2RlXSwgZWRnZXMpXG4gICAgICBjb25zdCBub2Rlc1dpdGhTYW1lVHlwZSA9IG5vZGVzLmZpbHRlcihcbiAgICAgICAgbm9kZSA9PiBub2RlLmRhdGEudHlwZSA9PT0gbm9kZVR5cGUsXG4gICAgICApXG4gICAgICBjb25zdCB7IGRlZmF1bHRWYWx1ZSB9ID0gbm9kZXNNZXRhRGF0YU1hcCFbbm9kZVR5cGVdXG4gICAgICBjb25zdCB7XG4gICAgICAgIG5ld05vZGU6IG5ld0N1cnJlbnROb2RlLFxuICAgICAgICBuZXdJdGVyYXRpb25TdGFydE5vZGUsXG4gICAgICAgIG5ld0xvb3BTdGFydE5vZGUsXG4gICAgICB9ID0gZ2VuZXJhdGVOZXdOb2RlKHtcbiAgICAgICAgdHlwZTogZ2V0Tm9kZUN1c3RvbVR5cGVCeU5vZGVEYXRhVHlwZShub2RlVHlwZSksXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi4oZGVmYXVsdFZhbHVlIGFzIGFueSksXG4gICAgICAgICAgdGl0bGU6XG4gICAgICAgICAgICBub2Rlc1dpdGhTYW1lVHlwZS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgID8gYCR7ZGVmYXVsdFZhbHVlLnRpdGxlfSAke25vZGVzV2l0aFNhbWVUeXBlLmxlbmd0aCArIDF9YFxuICAgICAgICAgICAgICA6IGRlZmF1bHRWYWx1ZS50aXRsZSxcbiAgICAgICAgICAuLi5wbHVnaW5EZWZhdWx0VmFsdWUsXG4gICAgICAgICAgX2Nvbm5lY3RlZFNvdXJjZUhhbmRsZUlkczogW10sXG4gICAgICAgICAgX2Nvbm5lY3RlZFRhcmdldEhhbmRsZUlkczogW10sXG4gICAgICAgICAgc2VsZWN0ZWQ6IGN1cnJlbnROb2RlLmRhdGEuc2VsZWN0ZWQsXG4gICAgICAgICAgaXNJbkl0ZXJhdGlvbjogY3VycmVudE5vZGUuZGF0YS5pc0luSXRlcmF0aW9uLFxuICAgICAgICAgIGlzSW5Mb29wOiBjdXJyZW50Tm9kZS5kYXRhLmlzSW5Mb29wLFxuICAgICAgICAgIGl0ZXJhdGlvbl9pZDogY3VycmVudE5vZGUuZGF0YS5pdGVyYXRpb25faWQsXG4gICAgICAgICAgbG9vcF9pZDogY3VycmVudE5vZGUuZGF0YS5sb29wX2lkLFxuICAgICAgICB9LFxuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIHg6IGN1cnJlbnROb2RlLnBvc2l0aW9uLngsXG4gICAgICAgICAgeTogY3VycmVudE5vZGUucG9zaXRpb24ueSxcbiAgICAgICAgfSxcbiAgICAgICAgcGFyZW50SWQ6IGN1cnJlbnROb2RlLnBhcmVudElkLFxuICAgICAgICBleHRlbnQ6IGN1cnJlbnROb2RlLmV4dGVudCxcbiAgICAgICAgekluZGV4OiBjdXJyZW50Tm9kZS56SW5kZXgsXG4gICAgICB9KVxuICAgICAgY29uc3Qgbm9kZXNDb25uZWN0ZWRTb3VyY2VPclRhcmdldEhhbmRsZUlkc01hcFxuICAgICAgICA9IGdldE5vZGVzQ29ubmVjdGVkU291cmNlT3JUYXJnZXRIYW5kbGVJZHNNYXAoXG4gICAgICAgICAgY29ubmVjdGVkRWRnZXMubWFwKGVkZ2UgPT4gKHsgdHlwZTogJ3JlbW92ZScsIGVkZ2UgfSkpLFxuICAgICAgICAgIG5vZGVzLFxuICAgICAgICApXG4gICAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICBkcmFmdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgbm9kZS5kYXRhLnNlbGVjdGVkID0gZmFsc2VcblxuICAgICAgICAgIGlmIChub2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwW25vZGUuaWRdKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSB7XG4gICAgICAgICAgICAgIC4uLm5vZGUuZGF0YSxcbiAgICAgICAgICAgICAgLi4ubm9kZXNDb25uZWN0ZWRTb3VyY2VPclRhcmdldEhhbmRsZUlkc01hcFtub2RlLmlkXSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IGluZGV4ID0gZHJhZnQuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gY3VycmVudE5vZGVJZClcblxuICAgICAgICBkcmFmdC5zcGxpY2UoaW5kZXgsIDEsIG5ld0N1cnJlbnROb2RlKVxuICAgICAgICBpZiAobmV3SXRlcmF0aW9uU3RhcnROb2RlKVxuICAgICAgICAgIGRyYWZ0LnB1c2gobmV3SXRlcmF0aW9uU3RhcnROb2RlKVxuICAgICAgICBpZiAobmV3TG9vcFN0YXJ0Tm9kZSlcbiAgICAgICAgICBkcmFmdC5wdXNoKG5ld0xvb3BTdGFydE5vZGUpXG4gICAgICB9KVxuICAgICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG4gICAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoZWRnZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZCA9IGRyYWZ0LmZpbHRlcihcbiAgICAgICAgICBlZGdlID0+XG4gICAgICAgICAgICAhY29ubmVjdGVkRWRnZXMuZmluZChcbiAgICAgICAgICAgICAgY29ubmVjdGVkRWRnZSA9PiBjb25uZWN0ZWRFZGdlLmlkID09PSBlZGdlLmlkLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZFxuICAgICAgfSlcbiAgICAgIHNldEVkZ2VzKG5ld0VkZ2VzKVxuICAgICAgaWYgKG5vZGVUeXBlID09PSBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2spIHtcbiAgICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQodHJ1ZSwgdHJ1ZSwge1xuICAgICAgICAgIG9uU3VjY2VzczogKCkgPT4gYXV0b0dlbmVyYXRlV2ViaG9va1VybChuZXdDdXJyZW50Tm9kZS5pZCksXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQoKVxuICAgICAgfVxuXG4gICAgICBzYXZlU3RhdGVUb0hpc3RvcnkoV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZUNoYW5nZSwge1xuICAgICAgICBub2RlSWQ6IGN1cnJlbnROb2RlSWQsXG4gICAgICB9KVxuICAgIH0sXG4gICAgW1xuICAgICAgZ2V0Tm9kZXNSZWFkT25seSxcbiAgICAgIHN0b3JlLFxuICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsXG4gICAgICBzYXZlU3RhdGVUb0hpc3RvcnksXG4gICAgICBub2Rlc01ldGFEYXRhTWFwLFxuICAgICAgYXV0b0dlbmVyYXRlV2ViaG9va1VybCxcbiAgICBdLFxuICApXG5cbiAgY29uc3QgaGFuZGxlTm9kZXNDYW5jZWxTZWxlY3RlZCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7IGdldE5vZGVzLCBzZXROb2RlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgbm9kZS5kYXRhLnNlbGVjdGVkID0gZmFsc2VcbiAgICAgIH0pXG4gICAgfSlcbiAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgfSwgW3N0b3JlXSlcblxuICBjb25zdCBoYW5kbGVOb2RlQ29udGV4dE1lbnUgPSB1c2VDYWxsYmFjayhcbiAgICAoZTogTW91c2VFdmVudCwgbm9kZTogTm9kZSkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBub2RlLnR5cGUgPT09IENVU1RPTV9OT1RFX05PREVcbiAgICAgICAgfHwgbm9kZS50eXBlID09PSBDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREVcbiAgICAgICkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBub2RlLnR5cGUgPT09IENVU1RPTV9OT1RFX05PREVcbiAgICAgICAgfHwgbm9kZS50eXBlID09PSBDVVNUT01fTE9PUF9TVEFSVF9OT0RFXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtmbG93LWNvbnRhaW5lcicpXG4gICAgICBjb25zdCB7IHgsIHkgfSA9IGNvbnRhaW5lciEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoe1xuICAgICAgICBub2RlTWVudToge1xuICAgICAgICAgIHRvcDogZS5jbGllbnRZIC0geSxcbiAgICAgICAgICBsZWZ0OiBlLmNsaWVudFggLSB4LFxuICAgICAgICAgIG5vZGVJZDogbm9kZS5pZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBoYW5kbGVOb2RlU2VsZWN0KG5vZGUuaWQpXG4gICAgfSxcbiAgICBbd29ya2Zsb3dTdG9yZSwgaGFuZGxlTm9kZVNlbGVjdF0sXG4gIClcblxuICBjb25zdCBoYW5kbGVOb2Rlc0NvcHkgPSB1c2VDYWxsYmFjayhcbiAgICAobm9kZUlkPzogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoZ2V0Tm9kZXNSZWFkT25seSgpKVxuICAgICAgICByZXR1cm5cblxuICAgICAgY29uc3QgeyBzZXRDbGlwYm9hcmRFbGVtZW50cyB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAgIGNvbnN0IHsgZ2V0Tm9kZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcblxuICAgICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG5cbiAgICAgIGlmIChub2RlSWQpIHtcbiAgICAgICAgLy8gSWYgbm9kZUlkIGlzIHByb3ZpZGVkLCBjb3B5IHRoYXQgc3BlY2lmaWMgbm9kZVxuICAgICAgICBjb25zdCBub2RlVG9Db3B5ID0gbm9kZXMuZmluZChcbiAgICAgICAgICBub2RlID0+XG4gICAgICAgICAgICBub2RlLmlkID09PSBub2RlSWRcbiAgICAgICAgICAgICYmIG5vZGUuZGF0YS50eXBlICE9PSBCbG9ja0VudW0uU3RhcnRcbiAgICAgICAgICAgICYmIG5vZGUudHlwZSAhPT0gQ1VTVE9NX0lURVJBVElPTl9TVEFSVF9OT0RFXG4gICAgICAgICAgICAmJiBub2RlLnR5cGUgIT09IENVU1RPTV9MT09QX1NUQVJUX05PREVcbiAgICAgICAgICAgICYmIG5vZGUuZGF0YS50eXBlICE9PSBCbG9ja0VudW0uTG9vcEVuZFxuICAgICAgICAgICAgJiYgbm9kZS5kYXRhLnR5cGUgIT09IEJsb2NrRW51bS5Lbm93bGVkZ2VCYXNlXG4gICAgICAgICAgICAmJiBub2RlLmRhdGEudHlwZSAhPT0gQmxvY2tFbnVtLkRhdGFTb3VyY2VFbXB0eSxcbiAgICAgICAgKVxuICAgICAgICBpZiAobm9kZVRvQ29weSlcbiAgICAgICAgICBzZXRDbGlwYm9hcmRFbGVtZW50cyhbbm9kZVRvQ29weV0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gSWYgbm8gbm9kZUlkIGlzIHByb3ZpZGVkLCBmYWxsIGJhY2sgdG8gdGhlIGN1cnJlbnQgYmVoYXZpb3JcbiAgICAgICAgY29uc3QgYnVuZGxlZE5vZGVzID0gbm9kZXMuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgICAgaWYgKCFub2RlLmRhdGEuX2lzQnVuZGxlZClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09IENVU1RPTV9OT1RFX05PREUpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIGNvbnN0IHsgbWV0YURhdGEgfSA9IG5vZGVzTWV0YURhdGFNYXAhW25vZGUuZGF0YS50eXBlIGFzIEJsb2NrRW51bV1cbiAgICAgICAgICBpZiAobWV0YURhdGEuaXNTaW5nbGV0b24pXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICByZXR1cm4gIW5vZGUuZGF0YS5pc0luSXRlcmF0aW9uICYmICFub2RlLmRhdGEuaXNJbkxvb3BcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoYnVuZGxlZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgIHNldENsaXBib2FyZEVsZW1lbnRzKGJ1bmRsZWROb2RlcylcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZSA9IG5vZGVzLmZpbmQoKG5vZGUpID0+IHtcbiAgICAgICAgICBpZiAoIW5vZGUuZGF0YS5zZWxlY3RlZClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09IENVU1RPTV9OT1RFX05PREUpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIGNvbnN0IHsgbWV0YURhdGEgfSA9IG5vZGVzTWV0YURhdGFNYXAhW25vZGUuZGF0YS50eXBlIGFzIEJsb2NrRW51bV1cbiAgICAgICAgICByZXR1cm4gIW1ldGFEYXRhLmlzU2luZ2xldG9uXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHNlbGVjdGVkTm9kZSlcbiAgICAgICAgICBzZXRDbGlwYm9hcmRFbGVtZW50cyhbc2VsZWN0ZWROb2RlXSlcbiAgICAgIH1cbiAgICB9LFxuICAgIFtnZXROb2Rlc1JlYWRPbmx5LCBzdG9yZSwgd29ya2Zsb3dTdG9yZV0sXG4gIClcblxuICBjb25zdCBoYW5kbGVOb2Rlc1Bhc3RlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChnZXROb2Rlc1JlYWRPbmx5KCkpXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IHsgY2xpcGJvYXJkRWxlbWVudHMsIG1vdXNlUG9zaXRpb24gfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgeyBnZXROb2Rlcywgc2V0Tm9kZXMsIGVkZ2VzLCBzZXRFZGdlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3Qgbm9kZXNUb1Bhc3RlOiBOb2RlW10gPSBbXVxuICAgIGNvbnN0IGVkZ2VzVG9QYXN0ZTogRWRnZVtdID0gW11cbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcblxuICAgIGlmIChjbGlwYm9hcmRFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHsgeCwgeSB9ID0gZ2V0VG9wTGVmdE5vZGVQb3NpdGlvbihjbGlwYm9hcmRFbGVtZW50cylcbiAgICAgIGNvbnN0IHsgc2NyZWVuVG9GbG93UG9zaXRpb24gfSA9IHJlYWN0Zmxvd1xuICAgICAgY29uc3QgY3VycmVudFBvc2l0aW9uID0gc2NyZWVuVG9GbG93UG9zaXRpb24oe1xuICAgICAgICB4OiBtb3VzZVBvc2l0aW9uLnBhZ2VYLFxuICAgICAgICB5OiBtb3VzZVBvc2l0aW9uLnBhZ2VZLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IG9mZnNldFggPSBjdXJyZW50UG9zaXRpb24ueCAtIHhcbiAgICAgIGNvbnN0IG9mZnNldFkgPSBjdXJyZW50UG9zaXRpb24ueSAtIHlcbiAgICAgIGxldCBpZE1hcHBpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fVxuICAgICAgY2xpcGJvYXJkRWxlbWVudHMuZm9yRWFjaCgobm9kZVRvUGFzdGUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGVUeXBlID0gbm9kZVRvUGFzdGUuZGF0YS50eXBlXG5cbiAgICAgICAgY29uc3QgeyBuZXdOb2RlLCBuZXdJdGVyYXRpb25TdGFydE5vZGUsIG5ld0xvb3BTdGFydE5vZGUgfVxuICAgICAgICAgID0gZ2VuZXJhdGVOZXdOb2RlKHtcbiAgICAgICAgICAgIHR5cGU6IG5vZGVUb1Bhc3RlLnR5cGUsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIC4uLihub2RlVG9QYXN0ZS50eXBlICE9PSBDVVNUT01fTk9URV9OT0RFICYmIG5vZGVzTWV0YURhdGFNYXAhW25vZGVUeXBlXS5kZWZhdWx0VmFsdWUpLFxuICAgICAgICAgICAgICAuLi5ub2RlVG9QYXN0ZS5kYXRhLFxuICAgICAgICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgIF9pc0J1bmRsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICBfY29ubmVjdGVkU291cmNlSGFuZGxlSWRzOiBbXSxcbiAgICAgICAgICAgICAgX2Nvbm5lY3RlZFRhcmdldEhhbmRsZUlkczogW10sXG4gICAgICAgICAgICAgIHRpdGxlOiBnZW5OZXdOb2RlVGl0bGVGcm9tT2xkKG5vZGVUb1Bhc3RlLmRhdGEudGl0bGUpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgIHg6IG5vZGVUb1Bhc3RlLnBvc2l0aW9uLnggKyBvZmZzZXRYLFxuICAgICAgICAgICAgICB5OiBub2RlVG9QYXN0ZS5wb3NpdGlvbi55ICsgb2Zmc2V0WSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleHRlbnQ6IG5vZGVUb1Bhc3RlLmV4dGVudCxcbiAgICAgICAgICAgIHpJbmRleDogbm9kZVRvUGFzdGUuekluZGV4LFxuICAgICAgICAgIH0pXG4gICAgICAgIG5ld05vZGUuaWQgPSBuZXdOb2RlLmlkICsgaW5kZXhcbiAgICAgICAgLy8gVGhpcyBuZXcgbm9kZSBpcyBtb3ZhYmxlIGFuZCBjYW4gYmUgcGxhY2VkIGFueXdoZXJlXG4gICAgICAgIGxldCBuZXdDaGlsZHJlbjogTm9kZVtdID0gW11cbiAgICAgICAgaWYgKG5vZGVUb1Bhc3RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkl0ZXJhdGlvbikge1xuICAgICAgICAgIG5ld0l0ZXJhdGlvblN0YXJ0Tm9kZSEucGFyZW50SWQgPSBuZXdOb2RlLmlkO1xuICAgICAgICAgIChuZXdOb2RlLmRhdGEgYXMgSXRlcmF0aW9uTm9kZVR5cGUpLnN0YXJ0X25vZGVfaWRcbiAgICAgICAgICAgID0gbmV3SXRlcmF0aW9uU3RhcnROb2RlIS5pZFxuXG4gICAgICAgICAgY29uc3Qgb2xkSXRlcmF0aW9uU3RhcnROb2RlID0gbm9kZXMuZmluZChcbiAgICAgICAgICAgIG4gPT5cbiAgICAgICAgICAgICAgbi5wYXJlbnRJZCA9PT0gbm9kZVRvUGFzdGUuaWRcbiAgICAgICAgICAgICAgJiYgbi50eXBlID09PSBDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREUsXG4gICAgICAgICAgKVxuICAgICAgICAgIGlkTWFwcGluZ1tvbGRJdGVyYXRpb25TdGFydE5vZGUhLmlkXSA9IG5ld0l0ZXJhdGlvblN0YXJ0Tm9kZSEuaWRcblxuICAgICAgICAgIGNvbnN0IHsgY29weUNoaWxkcmVuLCBuZXdJZE1hcHBpbmcgfVxuICAgICAgICAgICAgPSBoYW5kbGVOb2RlSXRlcmF0aW9uQ2hpbGRyZW5Db3B5KFxuICAgICAgICAgICAgICBub2RlVG9QYXN0ZS5pZCxcbiAgICAgICAgICAgICAgbmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgaWRNYXBwaW5nLFxuICAgICAgICAgICAgKVxuICAgICAgICAgIG5ld0NoaWxkcmVuID0gY29weUNoaWxkcmVuXG4gICAgICAgICAgaWRNYXBwaW5nID0gbmV3SWRNYXBwaW5nXG4gICAgICAgICAgbmV3Q2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgIG5ld05vZGUuZGF0YS5fY2hpbGRyZW4/LnB1c2goe1xuICAgICAgICAgICAgICBub2RlSWQ6IGNoaWxkLmlkLFxuICAgICAgICAgICAgICBub2RlVHlwZTogY2hpbGQuZGF0YS50eXBlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2gobmV3SXRlcmF0aW9uU3RhcnROb2RlISlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlVG9QYXN0ZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Mb29wKSB7XG4gICAgICAgICAgbmV3TG9vcFN0YXJ0Tm9kZSEucGFyZW50SWQgPSBuZXdOb2RlLmlkO1xuICAgICAgICAgIChuZXdOb2RlLmRhdGEgYXMgTG9vcE5vZGVUeXBlKS5zdGFydF9ub2RlX2lkID0gbmV3TG9vcFN0YXJ0Tm9kZSEuaWRcblxuICAgICAgICAgIG5ld0NoaWxkcmVuID0gaGFuZGxlTm9kZUxvb3BDaGlsZHJlbkNvcHkobm9kZVRvUGFzdGUuaWQsIG5ld05vZGUuaWQpXG4gICAgICAgICAgbmV3Q2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgIG5ld05vZGUuZGF0YS5fY2hpbGRyZW4/LnB1c2goe1xuICAgICAgICAgICAgICBub2RlSWQ6IGNoaWxkLmlkLFxuICAgICAgICAgICAgICBub2RlVHlwZTogY2hpbGQuZGF0YS50eXBlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2gobmV3TG9vcFN0YXJ0Tm9kZSEpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy8gc2luZ2xlIG5vZGUgcGFzdGVcbiAgICAgICAgICBjb25zdCBzZWxlY3RlZE5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5zZWxlY3RlZClcbiAgICAgICAgICBpZiAoc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICBjb25zdCBjb21tb25OZXN0ZWREaXNhbGxvd1Bhc3RlTm9kZXMgPSBbXG4gICAgICAgICAgICAgIC8vIGVuZCBub2RlIG9ubHkgY2FuIGJlIHBsYWNlZCBvdXRlcm1vc3QgbGF5ZXJcbiAgICAgICAgICAgICAgQmxvY2tFbnVtLkVuZCxcbiAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgLy8gaGFuZGxlIGRpc2FsbG93IHBhc3RlIG5vZGVcbiAgICAgICAgICAgIGlmIChjb21tb25OZXN0ZWREaXNhbGxvd1Bhc3RlTm9kZXMuaW5jbHVkZXMobm9kZVRvUGFzdGUuZGF0YS50eXBlKSlcbiAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIC8vIGhhbmRsZSBwYXN0ZSB0byBuZXN0ZWQgYmxvY2tcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uSXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgIG5ld05vZGUuZGF0YS5pc0luSXRlcmF0aW9uID0gdHJ1ZVxuICAgICAgICAgICAgICBuZXdOb2RlLmRhdGEuaXRlcmF0aW9uX2lkID0gc2VsZWN0ZWROb2RlLmRhdGEuaXRlcmF0aW9uX2lkXG4gICAgICAgICAgICAgIG5ld05vZGUucGFyZW50SWQgPSBzZWxlY3RlZE5vZGUuaWRcbiAgICAgICAgICAgICAgbmV3Tm9kZS5wb3NpdGlvbkFic29sdXRlID0ge1xuICAgICAgICAgICAgICAgIHg6IG5ld05vZGUucG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgICB5OiBuZXdOb2RlLnBvc2l0aW9uLnksXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gc2V0IHBvc2l0aW9uIGJhc2Ugb24gcGFyZW50IG5vZGVcbiAgICAgICAgICAgICAgbmV3Tm9kZS5wb3NpdGlvbiA9IGdldE5lc3RlZE5vZGVQb3NpdGlvbihuZXdOb2RlLCBzZWxlY3RlZE5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzZWxlY3RlZE5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uTG9vcCkge1xuICAgICAgICAgICAgICBuZXdOb2RlLmRhdGEuaXNJbkxvb3AgPSB0cnVlXG4gICAgICAgICAgICAgIG5ld05vZGUuZGF0YS5sb29wX2lkID0gc2VsZWN0ZWROb2RlLmRhdGEubG9vcF9pZFxuICAgICAgICAgICAgICBuZXdOb2RlLnBhcmVudElkID0gc2VsZWN0ZWROb2RlLmlkXG4gICAgICAgICAgICAgIG5ld05vZGUucG9zaXRpb25BYnNvbHV0ZSA9IHtcbiAgICAgICAgICAgICAgICB4OiBuZXdOb2RlLnBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgeTogbmV3Tm9kZS5wb3NpdGlvbi55LFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIHNldCBwb3NpdGlvbiBiYXNlIG9uIHBhcmVudCBub2RlXG4gICAgICAgICAgICAgIG5ld05vZGUucG9zaXRpb24gPSBnZXROZXN0ZWROb2RlUG9zaXRpb24obmV3Tm9kZSwgc2VsZWN0ZWROb2RlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGVzVG9QYXN0ZS5wdXNoKG5ld05vZGUpXG5cbiAgICAgICAgaWYgKG5ld0NoaWxkcmVuLmxlbmd0aClcbiAgICAgICAgICBub2Rlc1RvUGFzdGUucHVzaCguLi5uZXdDaGlsZHJlbilcbiAgICAgIH0pXG5cbiAgICAgIC8vIG9ubHkgaGFuZGxlIGVkZ2Ugd2hlbiBwYXN0ZSBuZXN0ZWQgYmxvY2tcbiAgICAgIGVkZ2VzLmZvckVhY2goKGVkZ2UpID0+IHtcbiAgICAgICAgY29uc3Qgc291cmNlSWQgPSBpZE1hcHBpbmdbZWRnZS5zb3VyY2VdXG4gICAgICAgIGNvbnN0IHRhcmdldElkID0gaWRNYXBwaW5nW2VkZ2UudGFyZ2V0XVxuXG4gICAgICAgIGlmIChzb3VyY2VJZCAmJiB0YXJnZXRJZCkge1xuICAgICAgICAgIGNvbnN0IG5ld0VkZ2U6IEVkZ2UgPSB7XG4gICAgICAgICAgICAuLi5lZGdlLFxuICAgICAgICAgICAgaWQ6IGAke3NvdXJjZUlkfS0ke2VkZ2Uuc291cmNlSGFuZGxlfS0ke3RhcmdldElkfS0ke2VkZ2UudGFyZ2V0SGFuZGxlfWAsXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZUlkLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXRJZCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgLi4uZWRnZS5kYXRhLFxuICAgICAgICAgICAgICBfY29ubmVjdGVkTm9kZUlzU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgICAgZWRnZXNUb1Bhc3RlLnB1c2gobmV3RWRnZSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgc2V0Tm9kZXMoWy4uLm5vZGVzLCAuLi5ub2Rlc1RvUGFzdGVdKVxuICAgICAgc2V0RWRnZXMoWy4uLmVkZ2VzLCAuLi5lZGdlc1RvUGFzdGVdKVxuICAgICAgc2F2ZVN0YXRlVG9IaXN0b3J5KFdvcmtmbG93SGlzdG9yeUV2ZW50Lk5vZGVQYXN0ZSwge1xuICAgICAgICBub2RlSWQ6IG5vZGVzVG9QYXN0ZT8uWzBdPy5pZCxcbiAgICAgIH0pXG4gICAgICBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCgpXG4gICAgfVxuICB9LCBbXG4gICAgZ2V0Tm9kZXNSZWFkT25seSxcbiAgICB3b3JrZmxvd1N0b3JlLFxuICAgIHN0b3JlLFxuICAgIHJlYWN0ZmxvdyxcbiAgICBzYXZlU3RhdGVUb0hpc3RvcnksXG4gICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsXG4gICAgaGFuZGxlTm9kZUl0ZXJhdGlvbkNoaWxkcmVuQ29weSxcbiAgICBoYW5kbGVOb2RlTG9vcENoaWxkcmVuQ29weSxcbiAgICBub2Rlc01ldGFEYXRhTWFwLFxuICBdKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVzRHVwbGljYXRlID0gdXNlQ2FsbGJhY2soXG4gICAgKG5vZGVJZD86IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGhhbmRsZU5vZGVzQ29weShub2RlSWQpXG4gICAgICBoYW5kbGVOb2Rlc1Bhc3RlKClcbiAgICB9LFxuICAgIFtnZXROb2Rlc1JlYWRPbmx5LCBoYW5kbGVOb2Rlc0NvcHksIGhhbmRsZU5vZGVzUGFzdGVdLFxuICApXG5cbiAgY29uc3QgaGFuZGxlTm9kZXNEZWxldGUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgeyBnZXROb2RlcywgZWRnZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcblxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIGNvbnN0IGJ1bmRsZWROb2RlcyA9IG5vZGVzLmZpbHRlcihcbiAgICAgIG5vZGUgPT4gbm9kZS5kYXRhLl9pc0J1bmRsZWQsXG4gICAgKVxuXG4gICAgaWYgKGJ1bmRsZWROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIGJ1bmRsZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4gaGFuZGxlTm9kZURlbGV0ZShub2RlLmlkKSlcblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZWRnZVNlbGVjdGVkID0gZWRnZXMuc29tZShlZGdlID0+IGVkZ2Uuc2VsZWN0ZWQpXG4gICAgaWYgKGVkZ2VTZWxlY3RlZClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlID0gbm9kZXMuZmluZChcbiAgICAgIG5vZGUgPT4gbm9kZS5kYXRhLnNlbGVjdGVkLFxuICAgIClcblxuICAgIGlmIChzZWxlY3RlZE5vZGUpXG4gICAgICBoYW5kbGVOb2RlRGVsZXRlKHNlbGVjdGVkTm9kZS5pZClcbiAgfSwgW3N0b3JlLCBnZXROb2Rlc1JlYWRPbmx5LCBoYW5kbGVOb2RlRGVsZXRlXSlcblxuICBjb25zdCBoYW5kbGVOb2RlUmVzaXplID0gdXNlQ2FsbGJhY2soXG4gICAgKG5vZGVJZDogc3RyaW5nLCBwYXJhbXM6IFJlc2l6ZVBhcmFtc1dpdGhEaXJlY3Rpb24pID0+IHtcbiAgICAgIGlmIChnZXROb2Rlc1JlYWRPbmx5KCkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjb25zdCB7IGdldE5vZGVzLCBzZXROb2RlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBwYXJhbXNcblxuICAgICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBub2RlSWQpIVxuICAgICAgY29uc3QgY2hpbGRyZW5Ob2RlcyA9IG5vZGVzLmZpbHRlcihuID0+XG4gICAgICAgIGN1cnJlbnROb2RlLmRhdGEuX2NoaWxkcmVuPy5maW5kKChjOiBhbnkpID0+IGMubm9kZUlkID09PSBuLmlkKSxcbiAgICAgIClcbiAgICAgIGxldCByaWdodE5vZGU6IE5vZGVcbiAgICAgIGxldCBib3R0b21Ob2RlOiBOb2RlXG5cbiAgICAgIGNoaWxkcmVuTm9kZXMuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAocmlnaHROb2RlKSB7XG4gICAgICAgICAgaWYgKG4ucG9zaXRpb24ueCArIG4ud2lkdGghID4gcmlnaHROb2RlLnBvc2l0aW9uLnggKyByaWdodE5vZGUud2lkdGghKVxuICAgICAgICAgICAgcmlnaHROb2RlID0gblxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJpZ2h0Tm9kZSA9IG5cbiAgICAgICAgfVxuICAgICAgICBpZiAoYm90dG9tTm9kZSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG4ucG9zaXRpb24ueSArIG4uaGVpZ2h0IVxuICAgICAgICAgICAgPiBib3R0b21Ob2RlLnBvc2l0aW9uLnkgKyBib3R0b21Ob2RlLmhlaWdodCFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJvdHRvbU5vZGUgPSBuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGJvdHRvbU5vZGUgPSBuXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmIChyaWdodE5vZGUhICYmIGJvdHRvbU5vZGUhKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSBub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gcmlnaHROb2RlLnBhcmVudElkKVxuICAgICAgICBjb25zdCBwYWRkaW5nTWFwXG4gICAgICAgICAgPSBwYXJlbnROb2RlPy5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5JdGVyYXRpb25cbiAgICAgICAgICAgID8gSVRFUkFUSU9OX1BBRERJTkdcbiAgICAgICAgICAgIDogTE9PUF9QQURESU5HXG5cbiAgICAgICAgaWYgKHdpZHRoIDwgcmlnaHROb2RlIS5wb3NpdGlvbi54ICsgcmlnaHROb2RlLndpZHRoISArIHBhZGRpbmdNYXAucmlnaHQpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICA8IGJvdHRvbU5vZGUucG9zaXRpb24ueSArIGJvdHRvbU5vZGUuaGVpZ2h0ISArIHBhZGRpbmdNYXAuYm90dG9tXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICBkcmFmdC5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgICAgaWYgKG4uaWQgPT09IG5vZGVJZCkge1xuICAgICAgICAgICAgbi5kYXRhLndpZHRoID0gd2lkdGhcbiAgICAgICAgICAgIG4uZGF0YS5oZWlnaHQgPSBoZWlnaHRcbiAgICAgICAgICAgIG4ud2lkdGggPSB3aWR0aFxuICAgICAgICAgICAgbi5oZWlnaHQgPSBoZWlnaHRcbiAgICAgICAgICAgIG4ucG9zaXRpb24ueCA9IHhcbiAgICAgICAgICAgIG4ucG9zaXRpb24ueSA9IHlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG4gICAgICBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCgpXG4gICAgICBzYXZlU3RhdGVUb0hpc3RvcnkoV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZVJlc2l6ZSwgeyBub2RlSWQgfSlcbiAgICB9LFxuICAgIFtnZXROb2Rlc1JlYWRPbmx5LCBzdG9yZSwgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsIHNhdmVTdGF0ZVRvSGlzdG9yeV0sXG4gIClcblxuICBjb25zdCBoYW5kbGVOb2RlRGlzY29ubmVjdCA9IHVzZUNhbGxiYWNrKFxuICAgIChub2RlSWQ6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHsgZ2V0Tm9kZXMsIHNldE5vZGVzLCBlZGdlcywgc2V0RWRnZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZUlkKSFcbiAgICAgIGNvbnN0IGNvbm5lY3RlZEVkZ2VzID0gZ2V0Q29ubmVjdGVkRWRnZXMoW2N1cnJlbnROb2RlXSwgZWRnZXMpXG4gICAgICBjb25zdCBub2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwXG4gICAgICAgID0gZ2V0Tm9kZXNDb25uZWN0ZWRTb3VyY2VPclRhcmdldEhhbmRsZUlkc01hcChcbiAgICAgICAgICBjb25uZWN0ZWRFZGdlcy5tYXAoZWRnZSA9PiAoeyB0eXBlOiAncmVtb3ZlJywgZWRnZSB9KSksXG4gICAgICAgICAgbm9kZXMsXG4gICAgICAgIClcbiAgICAgIGNvbnN0IG5ld05vZGVzID0gcHJvZHVjZShub2RlcywgKGRyYWZ0OiBOb2RlW10pID0+IHtcbiAgICAgICAgZHJhZnQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgIGlmIChub2Rlc0Nvbm5lY3RlZFNvdXJjZU9yVGFyZ2V0SGFuZGxlSWRzTWFwW25vZGUuaWRdKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSB7XG4gICAgICAgICAgICAgIC4uLm5vZGUuZGF0YSxcbiAgICAgICAgICAgICAgLi4ubm9kZXNDb25uZWN0ZWRTb3VyY2VPclRhcmdldEhhbmRsZUlkc01hcFtub2RlLmlkXSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG4gICAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoZWRnZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICByZXR1cm4gZHJhZnQuZmlsdGVyKFxuICAgICAgICAgIGVkZ2UgPT5cbiAgICAgICAgICAgICFjb25uZWN0ZWRFZGdlcy5maW5kKFxuICAgICAgICAgICAgICBjb25uZWN0ZWRFZGdlID0+IGNvbm5lY3RlZEVkZ2UuaWQgPT09IGVkZ2UuaWQsXG4gICAgICAgICAgICApLFxuICAgICAgICApXG4gICAgICB9KVxuICAgICAgc2V0RWRnZXMobmV3RWRnZXMpXG4gICAgICBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCgpXG4gICAgICBzYXZlU3RhdGVUb0hpc3RvcnkoV29ya2Zsb3dIaXN0b3J5RXZlbnQuRWRnZURlbGV0ZSlcbiAgICB9LFxuICAgIFtzdG9yZSwgZ2V0Tm9kZXNSZWFkT25seSwgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsIHNhdmVTdGF0ZVRvSGlzdG9yeV0sXG4gIClcblxuICBjb25zdCBoYW5kbGVIaXN0b3J5QmFjayA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoZ2V0Tm9kZXNSZWFkT25seSgpIHx8IGdldFdvcmtmbG93UmVhZE9ubHkoKSlcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgeyBzZXRFZGdlcywgc2V0Tm9kZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICB1bmRvKClcblxuICAgIGNvbnN0IHsgZWRnZXMsIG5vZGVzIH0gPSB3b3JrZmxvd0hpc3RvcnlTdG9yZS5nZXRTdGF0ZSgpXG4gICAgaWYgKGVkZ2VzLmxlbmd0aCA9PT0gMCAmJiBub2Rlcy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm5cblxuICAgIHNldEVkZ2VzKGVkZ2VzKVxuICAgIHNldE5vZGVzKG5vZGVzKVxuICB9LCBbXG4gICAgc3RvcmUsXG4gICAgdW5kbyxcbiAgICB3b3JrZmxvd0hpc3RvcnlTdG9yZSxcbiAgICBnZXROb2Rlc1JlYWRPbmx5LFxuICAgIGdldFdvcmtmbG93UmVhZE9ubHksXG4gIF0pXG5cbiAgY29uc3QgaGFuZGxlSGlzdG9yeUZvcndhcmQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSB8fCBnZXRXb3JrZmxvd1JlYWRPbmx5KCkpXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IHsgc2V0RWRnZXMsIHNldE5vZGVzIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgcmVkbygpXG5cbiAgICBjb25zdCB7IGVkZ2VzLCBub2RlcyB9ID0gd29ya2Zsb3dIaXN0b3J5U3RvcmUuZ2V0U3RhdGUoKVxuICAgIGlmIChlZGdlcy5sZW5ndGggPT09IDAgJiYgbm9kZXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuXG5cbiAgICBzZXRFZGdlcyhlZGdlcylcbiAgICBzZXROb2Rlcyhub2RlcylcbiAgfSwgW1xuICAgIHJlZG8sXG4gICAgc3RvcmUsXG4gICAgd29ya2Zsb3dIaXN0b3J5U3RvcmUsXG4gICAgZ2V0Tm9kZXNSZWFkT25seSxcbiAgICBnZXRXb3JrZmxvd1JlYWRPbmx5LFxuICBdKVxuXG4gIGNvbnN0IFtpc0RpbW1pbmcsIHNldElzRGltbWluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgLyoqIEFkZCBvcGFjaXR5LTMwIHRvIGFsbCBub2RlcyBleGNlcHQgdGhlIG5vZGVJZCAqL1xuICBjb25zdCBkaW1PdGhlck5vZGVzID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChpc0RpbW1pbmcpXG4gICAgICByZXR1cm5cbiAgICBjb25zdCB7IGdldE5vZGVzLCBzZXROb2RlcywgZWRnZXMsIHNldEVkZ2VzIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG5cbiAgICBjb25zdCBzZWxlY3RlZE5vZGUgPSBub2Rlcy5maW5kKG4gPT4gbi5kYXRhLnNlbGVjdGVkKVxuICAgIGlmICghc2VsZWN0ZWROb2RlKVxuICAgICAgcmV0dXJuXG5cbiAgICBzZXRJc0RpbW1pbmcodHJ1ZSlcblxuICAgIC8vIGNvbnN0IHdvcmtmbG93Tm9kZXMgPSB1c2VTdG9yZShzID0+IHMuZ2V0Tm9kZXMoKSlcbiAgICBjb25zdCB3b3JrZmxvd05vZGVzID0gbm9kZXNcblxuICAgIGNvbnN0IHVzZWRWYXJzID0gZ2V0Tm9kZVVzZWRWYXJzKHNlbGVjdGVkTm9kZSlcbiAgICBjb25zdCBkZXBlbmRlbmN5Tm9kZXM6IE5vZGVbXSA9IFtdXG4gICAgdXNlZFZhcnMuZm9yRWFjaCgodmFsdWVTZWxlY3RvcikgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IHdvcmtmbG93Tm9kZXMuZmluZChub2RlID0+IG5vZGUuaWQgPT09IHZhbHVlU2VsZWN0b3I/LlswXSlcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIGlmICghZGVwZW5kZW5jeU5vZGVzLmluY2x1ZGVzKG5vZGUpKVxuICAgICAgICAgIGRlcGVuZGVuY3lOb2Rlcy5wdXNoKG5vZGUpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IG91dGdvZXJzID0gZ2V0T3V0Z29lcnMoc2VsZWN0ZWROb2RlIGFzIE5vZGUsIG5vZGVzIGFzIE5vZGVbXSwgZWRnZXMpXG4gICAgZm9yIChsZXQgY3VycklkeCA9IDA7IGN1cnJJZHggPCBvdXRnb2Vycy5sZW5ndGg7IGN1cnJJZHgrKykge1xuICAgICAgY29uc3Qgbm9kZSA9IG91dGdvZXJzW2N1cnJJZHhdXG4gICAgICBjb25zdCBvdXRnb2Vyc0Zvck5vZGUgPSBnZXRPdXRnb2Vycyhub2RlLCBub2RlcyBhcyBOb2RlW10sIGVkZ2VzKVxuICAgICAgb3V0Z29lcnNGb3JOb2RlLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZXhpc3RlZCA9IG91dGdvZXJzLnNvbWUodiA9PiB2LmlkID09PSBpdGVtLmlkKVxuICAgICAgICBpZiAoIWV4aXN0ZWQpXG4gICAgICAgICAgb3V0Z29lcnMucHVzaChpdGVtKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBkZXBlbmRlbnROb2RlczogTm9kZVtdID0gW11cbiAgICBvdXRnb2Vycy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICBjb25zdCB1c2VkVmFycyA9IGdldE5vZGVVc2VkVmFycyhub2RlKVxuICAgICAgY29uc3QgdXNlZCA9IHVzZWRWYXJzLnNvbWUodiA9PiB2Py5bMF0gPT09IHNlbGVjdGVkTm9kZS5pZClcbiAgICAgIGlmICh1c2VkKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0ZWQgPSBkZXBlbmRlbnROb2Rlcy5zb21lKHYgPT4gdi5pZCA9PT0gbm9kZS5pZClcbiAgICAgICAgaWYgKCFleGlzdGVkKVxuICAgICAgICAgIGRlcGVuZGVudE5vZGVzLnB1c2gobm9kZSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgZGltTm9kZXMgPSBbLi4uZGVwZW5kZW5jeU5vZGVzLCAuLi5kZXBlbmRlbnROb2Rlcywgc2VsZWN0ZWROb2RlXVxuXG4gICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgY29uc3QgZGltTm9kZSA9IGRpbU5vZGVzLmZpbmQodiA9PiB2LmlkID09PSBuLmlkKVxuICAgICAgICBpZiAoIWRpbU5vZGUpXG4gICAgICAgICAgbi5kYXRhLl9kaW1tZWQgPSB0cnVlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBzZXROb2RlcyhuZXdOb2RlcylcblxuICAgIGNvbnN0IHRlbXBFZGdlczogRWRnZVtdID0gW11cblxuICAgIGRlcGVuZGVuY3lOb2Rlcy5mb3JFYWNoKChuKSA9PiB7XG4gICAgICB0ZW1wRWRnZXMucHVzaCh7XG4gICAgICAgIGlkOiBgdG1wXyR7bi5pZH0tc291cmNlLSR7c2VsZWN0ZWROb2RlLmlkfS10YXJnZXRgLFxuICAgICAgICB0eXBlOiBDVVNUT01fRURHRSxcbiAgICAgICAgc291cmNlOiBuLmlkLFxuICAgICAgICBzb3VyY2VIYW5kbGU6ICdzb3VyY2VfdG1wJyxcbiAgICAgICAgdGFyZ2V0OiBzZWxlY3RlZE5vZGUuaWQsXG4gICAgICAgIHRhcmdldEhhbmRsZTogJ3RhcmdldF90bXAnLFxuICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHNvdXJjZVR5cGU6IG4uZGF0YS50eXBlLFxuICAgICAgICAgIHRhcmdldFR5cGU6IHNlbGVjdGVkTm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgX2lzVGVtcDogdHJ1ZSxcbiAgICAgICAgICBfY29ubmVjdGVkTm9kZUlzSG92ZXJpbmc6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG4gICAgZGVwZW5kZW50Tm9kZXMuZm9yRWFjaCgobikgPT4ge1xuICAgICAgdGVtcEVkZ2VzLnB1c2goe1xuICAgICAgICBpZDogYHRtcF8ke3NlbGVjdGVkTm9kZS5pZH0tc291cmNlLSR7bi5pZH0tdGFyZ2V0YCxcbiAgICAgICAgdHlwZTogQ1VTVE9NX0VER0UsXG4gICAgICAgIHNvdXJjZTogc2VsZWN0ZWROb2RlLmlkLFxuICAgICAgICBzb3VyY2VIYW5kbGU6ICdzb3VyY2VfdG1wJyxcbiAgICAgICAgdGFyZ2V0OiBuLmlkLFxuICAgICAgICB0YXJnZXRIYW5kbGU6ICd0YXJnZXRfdG1wJyxcbiAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBzb3VyY2VUeXBlOiBzZWxlY3RlZE5vZGUuZGF0YS50eXBlLFxuICAgICAgICAgIHRhcmdldFR5cGU6IG4uZGF0YS50eXBlLFxuICAgICAgICAgIF9pc1RlbXA6IHRydWUsXG4gICAgICAgICAgX2Nvbm5lY3RlZE5vZGVJc0hvdmVyaW5nOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgY29uc3QgbmV3RWRnZXMgPSBwcm9kdWNlKGVkZ2VzLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgZS5kYXRhLl9kaW1tZWQgPSB0cnVlXG4gICAgICB9KVxuICAgICAgZHJhZnQucHVzaCguLi50ZW1wRWRnZXMpXG4gICAgfSlcbiAgICBzZXRFZGdlcyhuZXdFZGdlcylcbiAgfSwgW2lzRGltbWluZywgc3RvcmVdKVxuXG4gIC8qKiBSZXN0b3JlIGFsbCBub2RlcyB0byBmdWxsIG9wYWNpdHkgKi9cbiAgY29uc3QgdW5kaW1BbGxOb2RlcyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7IGdldE5vZGVzLCBzZXROb2RlcywgZWRnZXMsIHNldEVkZ2VzIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgc2V0SXNEaW1taW5nKGZhbHNlKVxuXG4gICAgY29uc3QgbmV3Tm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5kYXRhLl9kaW1tZWQgPSBmYWxzZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG5cbiAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoXG4gICAgICBlZGdlcy5maWx0ZXIoZSA9PiAhZS5kYXRhLl9pc1RlbXApLFxuICAgICAgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGRyYWZ0LmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICBlLmRhdGEuX2RpbW1lZCA9IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIClcbiAgICBzZXRFZGdlcyhuZXdFZGdlcylcbiAgfSwgW3N0b3JlXSlcblxuICByZXR1cm4ge1xuICAgIGhhbmRsZU5vZGVEcmFnU3RhcnQsXG4gICAgaGFuZGxlTm9kZURyYWcsXG4gICAgaGFuZGxlTm9kZURyYWdTdG9wLFxuICAgIGhhbmRsZU5vZGVFbnRlcixcbiAgICBoYW5kbGVOb2RlTGVhdmUsXG4gICAgaGFuZGxlTm9kZVNlbGVjdCxcbiAgICBoYW5kbGVOb2RlQ2xpY2ssXG4gICAgaGFuZGxlTm9kZUNvbm5lY3QsXG4gICAgaGFuZGxlTm9kZUNvbm5lY3RTdGFydCxcbiAgICBoYW5kbGVOb2RlQ29ubmVjdEVuZCxcbiAgICBoYW5kbGVOb2RlRGVsZXRlLFxuICAgIGhhbmRsZU5vZGVDaGFuZ2UsXG4gICAgaGFuZGxlTm9kZUFkZCxcbiAgICBoYW5kbGVOb2Rlc0NhbmNlbFNlbGVjdGVkLFxuICAgIGhhbmRsZU5vZGVDb250ZXh0TWVudSxcbiAgICBoYW5kbGVOb2Rlc0NvcHksXG4gICAgaGFuZGxlTm9kZXNQYXN0ZSxcbiAgICBoYW5kbGVOb2Rlc0R1cGxpY2F0ZSxcbiAgICBoYW5kbGVOb2Rlc0RlbGV0ZSxcbiAgICBoYW5kbGVOb2RlUmVzaXplLFxuICAgIGhhbmRsZU5vZGVEaXNjb25uZWN0LFxuICAgIGhhbmRsZUhpc3RvcnlCYWNrLFxuICAgIGhhbmRsZUhpc3RvcnlGb3J3YXJkLFxuICAgIGRpbU90aGVyTm9kZXMsXG4gICAgdW5kaW1BbGxOb2RlcyxcbiAgfVxufVxuIl19