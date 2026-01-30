"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowWithInnerContext = exports.Workflow = void 0;
const ahooks_1 = require("ahooks");
const predicate_1 = require("es-toolkit/predicate");
const immer_1 = require("immer");
const dynamic_1 = require("next/dynamic");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const config_1 = require("@/config");
const event_emitter_1 = require("@/context/event-emitter");
const use_tools_1 = require("@/service/use-tools");
const workflow_1 = require("@/service/workflow");
const classnames_1 = require("@/utils/classnames");
const candidate_node_1 = require("./candidate-node");
const constants_1 = require("./constants");
const custom_connection_line_1 = require("./custom-connection-line");
const custom_edge_1 = require("./custom-edge");
const provider_1 = require("./datasets-detail-store/provider");
const help_line_1 = require("./help-line");
const hooks_1 = require("./hooks");
const hooks_store_1 = require("./hooks-store");
const use_workflow_search_1 = require("./hooks/use-workflow-search");
const node_contextmenu_1 = require("./node-contextmenu");
const nodes_1 = require("./nodes");
const use_match_schema_type_1 = require("./nodes/_base/components/variable/use-match-schema-type");
const data_source_empty_1 = require("./nodes/data-source-empty");
const constants_2 = require("./nodes/data-source-empty/constants");
const iteration_start_1 = require("./nodes/iteration-start");
const constants_3 = require("./nodes/iteration-start/constants");
const loop_start_1 = require("./nodes/loop-start");
const constants_4 = require("./nodes/loop-start/constants");
const note_node_1 = require("./note-node");
const constants_5 = require("./note-node/constants");
const operator_1 = require("./operator");
const control_1 = require("./operator/control");
const panel_contextmenu_1 = require("./panel-contextmenu");
const selection_contextmenu_1 = require("./selection-contextmenu");
const simple_node_1 = require("./simple-node");
const constants_6 = require("./simple-node/constants");
const store_1 = require("./store");
const syncing_data_modal_1 = require("./syncing-data-modal");
const types_1 = require("./types");
const node_navigation_1 = require("./utils/node-navigation");
const workflow_history_store_1 = require("./workflow-history-store");
require("reactflow/dist/style.css");
require("./style.css");
const Confirm = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/base/confirm')), {
    ssr: false,
});
const nodeTypes = {
    [constants_1.CUSTOM_NODE]: nodes_1.default,
    [constants_5.CUSTOM_NOTE_NODE]: note_node_1.default,
    [constants_6.CUSTOM_SIMPLE_NODE]: simple_node_1.default,
    [constants_3.CUSTOM_ITERATION_START_NODE]: iteration_start_1.default,
    [constants_4.CUSTOM_LOOP_START_NODE]: loop_start_1.default,
    [constants_2.CUSTOM_DATA_SOURCE_EMPTY_NODE]: data_source_empty_1.default,
};
const edgeTypes = {
    [constants_1.CUSTOM_EDGE]: custom_edge_1.default,
};
exports.Workflow = (0, react_1.memo)(({ nodes: originalNodes, edges: originalEdges, viewport, children, onWorkflowDataUpdate, }) => {
    const workflowContainerRef = (0, react_1.useRef)(null);
    const workflowStore = (0, store_1.useWorkflowStore)();
    const reactflow = (0, reactflow_1.useReactFlow)();
    const [nodes, setNodes] = (0, reactflow_1.useNodesState)(originalNodes);
    const [edges, setEdges] = (0, reactflow_1.useEdgesState)(originalEdges);
    const controlMode = (0, store_1.useStore)(s => s.controlMode);
    const nodeAnimation = (0, store_1.useStore)(s => s.nodeAnimation);
    const showConfirm = (0, store_1.useStore)(s => s.showConfirm);
    const workflowCanvasHeight = (0, store_1.useStore)(s => s.workflowCanvasHeight);
    const bottomPanelHeight = (0, store_1.useStore)(s => s.bottomPanelHeight);
    const setWorkflowCanvasWidth = (0, store_1.useStore)(s => s.setWorkflowCanvasWidth);
    const setWorkflowCanvasHeight = (0, store_1.useStore)(s => s.setWorkflowCanvasHeight);
    const controlHeight = (0, react_1.useMemo)(() => {
        if (!workflowCanvasHeight)
            return '100%';
        return workflowCanvasHeight - bottomPanelHeight;
    }, [workflowCanvasHeight, bottomPanelHeight]);
    // update workflow Canvas width and height
    (0, react_1.useEffect)(() => {
        if (workflowContainerRef.current) {
            const resizeContainerObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { inlineSize, blockSize } = entry.borderBoxSize[0];
                    setWorkflowCanvasWidth(inlineSize);
                    setWorkflowCanvasHeight(blockSize);
                }
            });
            resizeContainerObserver.observe(workflowContainerRef.current);
            return () => {
                resizeContainerObserver.disconnect();
            };
        }
    }, [setWorkflowCanvasHeight, setWorkflowCanvasWidth]);
    const { setShowConfirm, setControlPromptEditorRerenderKey, setSyncWorkflowDraftHash, setNodes: setNodesInStore, } = workflowStore.getState();
    const currentNodes = (0, reactflow_1.useNodes)();
    const setNodesOnlyChangeWithData = (0, react_1.useCallback)((nodes) => {
        const nodesData = nodes.map(node => ({
            id: node.id,
            data: node.data,
        }));
        const oldData = workflowStore.getState().nodes.map(node => ({
            id: node.id,
            data: node.data,
        }));
        if (!(0, predicate_1.isEqual)(oldData, nodesData))
            setNodesInStore(nodes);
    }, [setNodesInStore, workflowStore]);
    (0, react_1.useEffect)(() => {
        setNodesOnlyChangeWithData(currentNodes);
    }, [currentNodes, setNodesOnlyChangeWithData]);
    const { handleSyncWorkflowDraft, syncWorkflowDraftWhenPageClose, } = (0, hooks_1.useNodesSyncDraft)();
    const { workflowReadOnly } = (0, hooks_1.useWorkflowReadOnly)();
    const { nodesReadOnly } = (0, hooks_1.useNodesReadOnly)();
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    const store = (0, reactflow_1.useStoreApi)();
    eventEmitter?.useSubscription((v) => {
        if (v.type === constants_1.WORKFLOW_DATA_UPDATE) {
            setNodes(v.payload.nodes);
            store.getState().setNodes(v.payload.nodes);
            setEdges(v.payload.edges);
            if (v.payload.viewport)
                reactflow.setViewport(v.payload.viewport);
            if (v.payload.hash)
                setSyncWorkflowDraftHash(v.payload.hash);
            onWorkflowDataUpdate?.(v.payload);
            setTimeout(() => setControlPromptEditorRerenderKey(Date.now()));
        }
    });
    (0, react_1.useEffect)(() => {
        (0, immer_1.setAutoFreeze)(false);
        return () => {
            (0, immer_1.setAutoFreeze)(true);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        return () => {
            handleSyncWorkflowDraft(true, true);
        };
    }, [handleSyncWorkflowDraft]);
    const { handleRefreshWorkflowDraft } = (0, hooks_1.useWorkflowRefreshDraft)();
    const handleSyncWorkflowDraftWhenPageClose = (0, react_1.useCallback)(() => {
        if (document.visibilityState === 'hidden')
            syncWorkflowDraftWhenPageClose();
        else if (document.visibilityState === 'visible')
            setTimeout(() => handleRefreshWorkflowDraft(), 500);
    }, [syncWorkflowDraftWhenPageClose, handleRefreshWorkflowDraft, workflowStore]);
    // Also add beforeunload handler as additional safety net for tab close
    const handleBeforeUnload = (0, react_1.useCallback)(() => {
        syncWorkflowDraftWhenPageClose();
    }, [syncWorkflowDraftWhenPageClose]);
    (0, react_1.useEffect)(() => {
        document.addEventListener('visibilitychange', handleSyncWorkflowDraftWhenPageClose);
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            document.removeEventListener('visibilitychange', handleSyncWorkflowDraftWhenPageClose);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [handleSyncWorkflowDraftWhenPageClose, handleBeforeUnload]);
    (0, ahooks_1.useEventListener)('keydown', (e) => {
        if ((e.key === 'd' || e.key === 'D') && (e.ctrlKey || e.metaKey))
            e.preventDefault();
        if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey))
            e.preventDefault();
        if ((e.key === 'y' || e.key === 'Y') && (e.ctrlKey || e.metaKey))
            e.preventDefault();
        if ((e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey))
            e.preventDefault();
    });
    (0, ahooks_1.useEventListener)('mousemove', (e) => {
        const containerClientRect = workflowContainerRef.current?.getBoundingClientRect();
        if (containerClientRect) {
            workflowStore.setState({
                mousePosition: {
                    pageX: e.clientX,
                    pageY: e.clientY,
                    elementX: e.clientX - containerClientRect.left,
                    elementY: e.clientY - containerClientRect.top,
                },
            });
        }
    });
    const { handleNodeDragStart, handleNodeDrag, handleNodeDragStop, handleNodeEnter, handleNodeLeave, handleNodeClick, handleNodeConnect, handleNodeConnectStart, handleNodeConnectEnd, handleNodeContextMenu, handleHistoryBack, handleHistoryForward, } = (0, hooks_1.useNodesInteractions)();
    const { handleEdgeEnter, handleEdgeLeave, handleEdgesChange, } = (0, hooks_1.useEdgesInteractions)();
    const { handleSelectionStart, handleSelectionChange, handleSelectionDrag, handleSelectionContextMenu, } = (0, hooks_1.useSelectionInteractions)();
    const { handlePaneContextMenu, } = (0, hooks_1.usePanelInteractions)();
    const { isValidConnection, } = (0, hooks_1.useWorkflow)();
    (0, reactflow_1.useOnViewportChange)({
        onEnd: () => {
            handleSyncWorkflowDraft();
        },
    });
    (0, hooks_1.useShortcuts)();
    // Initialize workflow node search functionality
    (0, use_workflow_search_1.useWorkflowSearch)();
    // Set up scroll to node event listener using the utility function
    (0, react_1.useEffect)(() => {
        return (0, node_navigation_1.setupScrollToNodeListener)(nodes, reactflow);
    }, [nodes, reactflow]);
    const { schemaTypeDefinitions } = (0, use_match_schema_type_1.default)();
    const { fetchInspectVars } = (0, hooks_1.useSetWorkflowVarsWithValue)();
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const { data: mcpTools } = (0, use_tools_1.useAllMCPTools)();
    const dataSourceList = (0, store_1.useStore)(s => s.dataSourceList);
    // buildInTools, customTools, workflowTools, mcpTools, dataSourceList
    const configsMap = (0, hooks_store_1.useHooksStore)(s => s.configsMap);
    const [isLoadedVars, setIsLoadedVars] = (0, react_1.useState)(false);
    const [vars, setVars] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        (async () => {
            if (!configsMap?.flowType || !configsMap?.flowId)
                return;
            const data = await (0, workflow_1.fetchAllInspectVars)(configsMap.flowType, configsMap.flowId);
            setVars(data);
            setIsLoadedVars(true);
        })();
    }, [configsMap?.flowType, configsMap?.flowId]);
    (0, react_1.useEffect)(() => {
        if (schemaTypeDefinitions && isLoadedVars) {
            fetchInspectVars({
                passInVars: true,
                vars,
                passedInAllPluginInfoList: {
                    buildInTools: buildInTools || [],
                    customTools: customTools || [],
                    workflowTools: workflowTools || [],
                    mcpTools: mcpTools || [],
                    dataSourceList: dataSourceList ?? [],
                },
                passedInSchemaTypeDefinitions: schemaTypeDefinitions,
            });
        }
    }, [schemaTypeDefinitions, fetchInspectVars, isLoadedVars, vars, customTools, buildInTools, workflowTools, mcpTools, dataSourceList]);
    if (config_1.IS_DEV) {
        store.getState().onError = (code, message) => {
            if (code === '002')
                return;
            console.warn(message);
        };
    }
    return (<div id="workflow-container" className={(0, classnames_1.cn)('relative h-full w-full min-w-[960px]', workflowReadOnly && 'workflow-panel-animation', nodeAnimation && 'workflow-node-animation')} ref={workflowContainerRef}>
      <syncing_data_modal_1.default />
      <candidate_node_1.default />
      <div className="pointer-events-none absolute left-0 top-0 z-10 flex w-12 items-center justify-center p-1 pl-2" style={{ height: controlHeight }}>
        <control_1.default />
      </div>
      <operator_1.default handleRedo={handleHistoryForward} handleUndo={handleHistoryBack}/>
      <panel_contextmenu_1.default />
      <node_contextmenu_1.default />
      <selection_contextmenu_1.default />
      <help_line_1.default />
      {!!showConfirm && (<Confirm isShow onCancel={() => setShowConfirm(undefined)} onConfirm={showConfirm.onConfirm} title={showConfirm.title} content={showConfirm.desc}/>)}
      {children}
      <reactflow_1.default nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodes={nodes} edges={edges} onNodeDragStart={handleNodeDragStart} onNodeDrag={handleNodeDrag} onNodeDragStop={handleNodeDragStop} onNodeMouseEnter={handleNodeEnter} onNodeMouseLeave={handleNodeLeave} onNodeClick={handleNodeClick} onNodeContextMenu={handleNodeContextMenu} onConnect={handleNodeConnect} onConnectStart={handleNodeConnectStart} onConnectEnd={handleNodeConnectEnd} onEdgeMouseEnter={handleEdgeEnter} onEdgeMouseLeave={handleEdgeLeave} onEdgesChange={handleEdgesChange} onSelectionStart={handleSelectionStart} onSelectionChange={handleSelectionChange} onSelectionDrag={handleSelectionDrag} onPaneContextMenu={handlePaneContextMenu} onSelectionContextMenu={handleSelectionContextMenu} connectionLineComponent={custom_connection_line_1.default} 
    // NOTE: For LOOP node, how to distinguish between ITERATION and LOOP here? Maybe both are the same?
    connectionLineContainerStyle={{ zIndex: constants_1.ITERATION_CHILDREN_Z_INDEX }} defaultViewport={viewport} multiSelectionKeyCode={null} deleteKeyCode={null} nodesDraggable={!nodesReadOnly} nodesConnectable={!nodesReadOnly} nodesFocusable={!nodesReadOnly} edgesFocusable={!nodesReadOnly} panOnScroll={controlMode === types_1.ControlMode.Pointer && !workflowReadOnly} panOnDrag={controlMode === types_1.ControlMode.Hand || [1]} zoomOnPinch={true} zoomOnScroll={true} zoomOnDoubleClick={true} isValidConnection={isValidConnection} selectionKeyCode={null} selectionMode={reactflow_1.SelectionMode.Partial} selectionOnDrag={controlMode === types_1.ControlMode.Pointer && !workflowReadOnly} minZoom={0.25}>
        <reactflow_1.Background gap={[14, 14]} size={2} className="bg-workflow-canvas-workflow-bg" color="var(--color-workflow-canvas-workflow-dot-color)"/>
      </reactflow_1.default>
    </div>);
});
exports.WorkflowWithInnerContext = (0, react_1.memo)(({ hooksStore, ...restProps }) => {
    return (<hooks_store_1.HooksStoreContextProvider {...hooksStore}>
      <exports.Workflow {...restProps}/>
    </hooks_store_1.HooksStoreContextProvider>);
});
const WorkflowWithDefaultContext = ({ nodes, edges, children, }) => {
    return (<reactflow_1.ReactFlowProvider>
      <workflow_history_store_1.WorkflowHistoryProvider nodes={nodes} edges={edges}>
        <provider_1.default nodes={nodes}>
          {children}
        </provider_1.default>
      </workflow_history_store_1.WorkflowHistoryProvider>
    </reactflow_1.ReactFlowProvider>);
};
exports.default = (0, react_1.memo)(WorkflowWithDefaultContext);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBWVosbUNBRWU7QUFDZixvREFBOEM7QUFDOUMsaUNBQXFDO0FBQ3JDLDBDQUFrQztBQUNsQyxpQ0FPYztBQUNkLHlDQVVrQjtBQUNsQixxQ0FBaUM7QUFDakMsMkRBQXVFO0FBQ3ZFLG1EQUs0QjtBQUM1QixpREFBd0Q7QUFDeEQsbURBQXVDO0FBQ3ZDLHFEQUE0QztBQUM1QywyQ0FLb0I7QUFDcEIscUVBQTJEO0FBQzNELCtDQUFzQztBQUN0QywrREFBcUU7QUFDckUsMkNBQWtDO0FBQ2xDLG1DQVlnQjtBQUNoQiwrQ0FBd0U7QUFDeEUscUVBQStEO0FBQy9ELHlEQUFnRDtBQUNoRCxtQ0FBZ0M7QUFDaEMsbUdBQXdGO0FBQ3hGLGlFQUFpRTtBQUNqRSxtRUFBbUY7QUFDbkYsNkRBQThEO0FBQzlELGlFQUErRTtBQUMvRSxtREFBb0Q7QUFDcEQsNERBQXFFO0FBQ3JFLDJDQUF3QztBQUN4QyxxREFBd0Q7QUFDeEQseUNBQWlDO0FBQ2pDLGdEQUF3QztBQUN4QywyREFBa0Q7QUFDbEQsbUVBQTBEO0FBQzFELCtDQUE0QztBQUM1Qyx1REFBNEQ7QUFDNUQsbUNBR2dCO0FBQ2hCLDZEQUFtRDtBQUNuRCxtQ0FFZ0I7QUFDaEIsNkRBQW1FO0FBQ25FLHFFQUFrRTtBQUNsRSxvQ0FBaUM7QUFDakMsdUJBQW9CO0FBRXBCLE1BQU0sT0FBTyxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsK0JBQStCLEVBQUMsRUFBRTtJQUNyRSxHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUVGLE1BQU0sU0FBUyxHQUFHO0lBQ2hCLENBQUMsdUJBQVcsQ0FBQyxFQUFFLGVBQVU7SUFDekIsQ0FBQyw0QkFBZ0IsQ0FBQyxFQUFFLG1CQUFjO0lBQ2xDLENBQUMsOEJBQWtCLENBQUMsRUFBRSxx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QUFDLENBQ2QsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1IsU0FBUyxDQUFDLGdDQUFnQyxDQUMxQyxLQUFLLENBQUMsaURBQWlELEVBRTNEO01BQUEsRUFBRSxtQkFBUyxDQUNiO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFDLENBQUE7QUFLVyxRQUFBLHdCQUF3QixHQUFHLElBQUEsWUFBSSxFQUFDLENBQUMsRUFDNUMsVUFBVSxFQUNWLEdBQUcsU0FBUyxFQUNrQixFQUFFLEVBQUU7SUFDbEMsT0FBTyxDQUNMLENBQUMsdUNBQXlCLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FDeEM7TUFBQSxDQUFDLGdCQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsRUFDMUI7SUFBQSxFQUFFLHVDQUF5QixDQUFDLENBQzdCLENBQUE7QUFDSCxDQUFDLENBQUMsQ0FBQTtBQVFGLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxFQUNsQyxLQUFLLEVBQ0wsS0FBSyxFQUNMLFFBQVEsR0FDd0IsRUFBRSxFQUFFO0lBQ3BDLE9BQU8sQ0FDTCxDQUFDLDZCQUFpQixDQUNoQjtNQUFBLENBQUMsZ0RBQXVCLENBQ3RCLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNiLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUViO1FBQUEsQ0FBQyxrQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDbkM7VUFBQSxDQUFDLFFBQVEsQ0FDWDtRQUFBLEVBQUUsa0JBQXNCLENBQzFCO01BQUEsRUFBRSxnREFBdUIsQ0FDM0I7SUFBQSxFQUFFLDZCQUFpQixDQUFDLENBQ3JCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxJQUFBLFlBQUksRUFBQywwQkFBMEIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHtcbiAgVmlld3BvcnQsXG59IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB0eXBlIHsgU2hhcGUgYXMgSG9va3NTdG9yZVNoYXBlIH0gZnJvbSAnLi9ob29rcy1zdG9yZSdcbmltcG9ydCB0eXBlIHtcbiAgRWRnZSxcbiAgTm9kZSxcbn0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIHsgVmFySW5JbnNwZWN0IH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7XG4gIHVzZUV2ZW50TGlzdGVuZXIsXG59IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IGlzRXF1YWwgfSBmcm9tICdlcy10b29sa2l0L3ByZWRpY2F0ZSdcbmltcG9ydCB7IHNldEF1dG9GcmVlemUgfSBmcm9tICdpbW1lcidcbmltcG9ydCBkeW5hbWljIGZyb20gJ25leHQvZHluYW1pYydcbmltcG9ydCB7XG4gIG1lbW8sXG4gIHVzZUNhbGxiYWNrLFxuICB1c2VFZmZlY3QsXG4gIHVzZU1lbW8sXG4gIHVzZVJlZixcbiAgdXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0Rmxvdywge1xuICBCYWNrZ3JvdW5kLFxuICBSZWFjdEZsb3dQcm92aWRlcixcbiAgU2VsZWN0aW9uTW9kZSxcbiAgdXNlRWRnZXNTdGF0ZSxcbiAgdXNlTm9kZXMsXG4gIHVzZU5vZGVzU3RhdGUsXG4gIHVzZU9uVmlld3BvcnRDaGFuZ2UsXG4gIHVzZVJlYWN0RmxvdyxcbiAgdXNlU3RvcmVBcGksXG59IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IElTX0RFViB9IGZyb20gJ0AvY29uZmlnJ1xuaW1wb3J0IHsgdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvZXZlbnQtZW1pdHRlcidcbmltcG9ydCB7XG4gIHVzZUFsbEJ1aWx0SW5Ub29scyxcbiAgdXNlQWxsQ3VzdG9tVG9vbHMsXG4gIHVzZUFsbE1DUFRvb2xzLFxuICB1c2VBbGxXb3JrZmxvd1Rvb2xzLFxufSBmcm9tICdAL3NlcnZpY2UvdXNlLXRvb2xzJ1xuaW1wb3J0IHsgZmV0Y2hBbGxJbnNwZWN0VmFycyB9IGZyb20gJ0Avc2VydmljZS93b3JrZmxvdydcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IENhbmRpZGF0ZU5vZGUgZnJvbSAnLi9jYW5kaWRhdGUtbm9kZSdcbmltcG9ydCB7XG4gIENVU1RPTV9FREdFLFxuICBDVVNUT01fTk9ERSxcbiAgSVRFUkFUSU9OX0NISUxEUkVOX1pfSU5ERVgsXG4gIFdPUktGTE9XX0RBVEFfVVBEQVRFLFxufSBmcm9tICcuL2NvbnN0YW50cydcbmltcG9ydCBDdXN0b21Db25uZWN0aW9uTGluZSBmcm9tICcuL2N1c3RvbS1jb25uZWN0aW9uLWxpbmUnXG5pbXBvcnQgQ3VzdG9tRWRnZSBmcm9tICcuL2N1c3RvbS1lZGdlJ1xuaW1wb3J0IERhdGFzZXRzRGV0YWlsUHJvdmlkZXIgZnJvbSAnLi9kYXRhc2V0cy1kZXRhaWwtc3RvcmUvcHJvdmlkZXInXG5pbXBvcnQgSGVscExpbmUgZnJvbSAnLi9oZWxwLWxpbmUnXG5pbXBvcnQge1xuICB1c2VFZGdlc0ludGVyYWN0aW9ucyxcbiAgdXNlTm9kZXNJbnRlcmFjdGlvbnMsXG4gIHVzZU5vZGVzUmVhZE9ubHksXG4gIHVzZU5vZGVzU3luY0RyYWZ0LFxuICB1c2VQYW5lbEludGVyYWN0aW9ucyxcbiAgdXNlU2VsZWN0aW9uSW50ZXJhY3Rpb25zLFxuICB1c2VTZXRXb3JrZmxvd1ZhcnNXaXRoVmFsdWUsXG4gIHVzZVNob3J0Y3V0cyxcbiAgdXNlV29ya2Zsb3csXG4gIHVzZVdvcmtmbG93UmVhZE9ubHksXG4gIHVzZVdvcmtmbG93UmVmcmVzaERyYWZ0LFxufSBmcm9tICcuL2hvb2tzJ1xuaW1wb3J0IHsgSG9va3NTdG9yZUNvbnRleHRQcm92aWRlciwgdXNlSG9va3NTdG9yZSB9IGZyb20gJy4vaG9va3Mtc3RvcmUnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1NlYXJjaCB9IGZyb20gJy4vaG9va3MvdXNlLXdvcmtmbG93LXNlYXJjaCdcbmltcG9ydCBOb2RlQ29udGV4dG1lbnUgZnJvbSAnLi9ub2RlLWNvbnRleHRtZW51J1xuaW1wb3J0IEN1c3RvbU5vZGUgZnJvbSAnLi9ub2RlcydcbmltcG9ydCB1c2VNYXRjaFNjaGVtYVR5cGUgZnJvbSAnLi9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL3ZhcmlhYmxlL3VzZS1tYXRjaC1zY2hlbWEtdHlwZSdcbmltcG9ydCBDdXN0b21EYXRhU291cmNlRW1wdHlOb2RlIGZyb20gJy4vbm9kZXMvZGF0YS1zb3VyY2UtZW1wdHknXG5pbXBvcnQgeyBDVVNUT01fREFUQV9TT1VSQ0VfRU1QVFlfTk9ERSB9IGZyb20gJy4vbm9kZXMvZGF0YS1zb3VyY2UtZW1wdHkvY29uc3RhbnRzJ1xuaW1wb3J0IEN1c3RvbUl0ZXJhdGlvblN0YXJ0Tm9kZSBmcm9tICcuL25vZGVzL2l0ZXJhdGlvbi1zdGFydCdcbmltcG9ydCB7IENVU1RPTV9JVEVSQVRJT05fU1RBUlRfTk9ERSB9IGZyb20gJy4vbm9kZXMvaXRlcmF0aW9uLXN0YXJ0L2NvbnN0YW50cydcbmltcG9ydCBDdXN0b21Mb29wU3RhcnROb2RlIGZyb20gJy4vbm9kZXMvbG9vcC1zdGFydCdcbmltcG9ydCB7IENVU1RPTV9MT09QX1NUQVJUX05PREUgfSBmcm9tICcuL25vZGVzL2xvb3Atc3RhcnQvY29uc3RhbnRzJ1xuaW1wb3J0IEN1c3RvbU5vdGVOb2RlIGZyb20gJy4vbm90ZS1ub2RlJ1xuaW1wb3J0IHsgQ1VTVE9NX05PVEVfTk9ERSB9IGZyb20gJy4vbm90ZS1ub2RlL2NvbnN0YW50cydcbmltcG9ydCBPcGVyYXRvciBmcm9tICcuL29wZXJhdG9yJ1xuaW1wb3J0IENvbnRyb2wgZnJvbSAnLi9vcGVyYXRvci9jb250cm9sJ1xuaW1wb3J0IFBhbmVsQ29udGV4dG1lbnUgZnJvbSAnLi9wYW5lbC1jb250ZXh0bWVudSdcbmltcG9ydCBTZWxlY3Rpb25Db250ZXh0bWVudSBmcm9tICcuL3NlbGVjdGlvbi1jb250ZXh0bWVudSdcbmltcG9ydCBDdXN0b21TaW1wbGVOb2RlIGZyb20gJy4vc2ltcGxlLW5vZGUnXG5pbXBvcnQgeyBDVVNUT01fU0lNUExFX05PREUgfSBmcm9tICcuL3NpbXBsZS1ub2RlL2NvbnN0YW50cydcbmltcG9ydCB7XG4gIHVzZVN0b3JlLFxuICB1c2VXb3JrZmxvd1N0b3JlLFxufSBmcm9tICcuL3N0b3JlJ1xuaW1wb3J0IFN5bmNpbmdEYXRhTW9kYWwgZnJvbSAnLi9zeW5jaW5nLWRhdGEtbW9kYWwnXG5pbXBvcnQge1xuICBDb250cm9sTW9kZSxcbn0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IHNldHVwU2Nyb2xsVG9Ob2RlTGlzdGVuZXIgfSBmcm9tICcuL3V0aWxzL25vZGUtbmF2aWdhdGlvbidcbmltcG9ydCB7IFdvcmtmbG93SGlzdG9yeVByb3ZpZGVyIH0gZnJvbSAnLi93b3JrZmxvdy1oaXN0b3J5LXN0b3JlJ1xuaW1wb3J0ICdyZWFjdGZsb3cvZGlzdC9zdHlsZS5jc3MnXG5pbXBvcnQgJy4vc3R5bGUuY3NzJ1xuXG5jb25zdCBDb25maXJtID0gZHluYW1pYygoKSA9PiBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jb25maXJtJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5cbmNvbnN0IG5vZGVUeXBlcyA9IHtcbiAgW0NVU1RPTV9OT0RFXTogQ3VzdG9tTm9kZSxcbiAgW0NVU1RPTV9OT1RFX05PREVdOiBDdXN0b21Ob3RlTm9kZSxcbiAgW0NVU1RPTV9TSU1QTEVfTk9ERV06IEN1c3RvbVNpbXBsZU5vZGUsXG4gIFtDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREVdOiBDdXN0b21JdGVyYXRpb25TdGFydE5vZGUsXG4gIFtDVVNUT01fTE9PUF9TVEFSVF9OT0RFXTogQ3VzdG9tTG9vcFN0YXJ0Tm9kZSxcbiAgW0NVU1RPTV9EQVRBX1NPVVJDRV9FTVBUWV9OT0RFXTogQ3VzdG9tRGF0YVNvdXJjZUVtcHR5Tm9kZSxcbn1cbmNvbnN0IGVkZ2VUeXBlcyA9IHtcbiAgW0NVU1RPTV9FREdFXTogQ3VzdG9tRWRnZSxcbn1cblxuZXhwb3J0IHR5cGUgV29ya2Zsb3dQcm9wcyA9IHtcbiAgbm9kZXM6IE5vZGVbXVxuICBlZGdlczogRWRnZVtdXG4gIHZpZXdwb3J0PzogVmlld3BvcnRcbiAgY2hpbGRyZW4/OiBSZWFjdC5SZWFjdE5vZGVcbiAgb25Xb3JrZmxvd0RhdGFVcGRhdGU/OiAodjogYW55KSA9PiB2b2lkXG59XG5leHBvcnQgY29uc3QgV29ya2Zsb3c6IEZDPFdvcmtmbG93UHJvcHM+ID0gbWVtbygoe1xuICBub2Rlczogb3JpZ2luYWxOb2RlcyxcbiAgZWRnZXM6IG9yaWdpbmFsRWRnZXMsXG4gIHZpZXdwb3J0LFxuICBjaGlsZHJlbixcbiAgb25Xb3JrZmxvd0RhdGFVcGRhdGUsXG59KSA9PiB7XG4gIGNvbnN0IHdvcmtmbG93Q29udGFpbmVyUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKVxuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IHJlYWN0ZmxvdyA9IHVzZVJlYWN0RmxvdygpXG4gIGNvbnN0IFtub2Rlcywgc2V0Tm9kZXNdID0gdXNlTm9kZXNTdGF0ZShvcmlnaW5hbE5vZGVzKVxuICBjb25zdCBbZWRnZXMsIHNldEVkZ2VzXSA9IHVzZUVkZ2VzU3RhdGUob3JpZ2luYWxFZGdlcylcbiAgY29uc3QgY29udHJvbE1vZGUgPSB1c2VTdG9yZShzID0+IHMuY29udHJvbE1vZGUpXG4gIGNvbnN0IG5vZGVBbmltYXRpb24gPSB1c2VTdG9yZShzID0+IHMubm9kZUFuaW1hdGlvbilcbiAgY29uc3Qgc2hvd0NvbmZpcm0gPSB1c2VTdG9yZShzID0+IHMuc2hvd0NvbmZpcm0pXG4gIGNvbnN0IHdvcmtmbG93Q2FudmFzSGVpZ2h0ID0gdXNlU3RvcmUocyA9PiBzLndvcmtmbG93Q2FudmFzSGVpZ2h0KVxuICBjb25zdCBib3R0b21QYW5lbEhlaWdodCA9IHVzZVN0b3JlKHMgPT4gcy5ib3R0b21QYW5lbEhlaWdodClcbiAgY29uc3Qgc2V0V29ya2Zsb3dDYW52YXNXaWR0aCA9IHVzZVN0b3JlKHMgPT4gcy5zZXRXb3JrZmxvd0NhbnZhc1dpZHRoKVxuICBjb25zdCBzZXRXb3JrZmxvd0NhbnZhc0hlaWdodCA9IHVzZVN0b3JlKHMgPT4gcy5zZXRXb3JrZmxvd0NhbnZhc0hlaWdodClcbiAgY29uc3QgY29udHJvbEhlaWdodCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghd29ya2Zsb3dDYW52YXNIZWlnaHQpXG4gICAgICByZXR1cm4gJzEwMCUnXG4gICAgcmV0dXJuIHdvcmtmbG93Q2FudmFzSGVpZ2h0IC0gYm90dG9tUGFuZWxIZWlnaHRcbiAgfSwgW3dvcmtmbG93Q2FudmFzSGVpZ2h0LCBib3R0b21QYW5lbEhlaWdodF0pXG5cbiAgLy8gdXBkYXRlIHdvcmtmbG93IENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHdvcmtmbG93Q29udGFpbmVyUmVmLmN1cnJlbnQpIHtcbiAgICAgIGNvbnN0IHJlc2l6ZUNvbnRhaW5lck9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgICAgICAgIGNvbnN0IHsgaW5saW5lU2l6ZSwgYmxvY2tTaXplIH0gPSBlbnRyeS5ib3JkZXJCb3hTaXplWzBdXG4gICAgICAgICAgc2V0V29ya2Zsb3dDYW52YXNXaWR0aChpbmxpbmVTaXplKVxuICAgICAgICAgIHNldFdvcmtmbG93Q2FudmFzSGVpZ2h0KGJsb2NrU2l6ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJlc2l6ZUNvbnRhaW5lck9ic2VydmVyLm9ic2VydmUod29ya2Zsb3dDb250YWluZXJSZWYuY3VycmVudClcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHJlc2l6ZUNvbnRhaW5lck9ic2VydmVyLmRpc2Nvbm5lY3QoKVxuICAgICAgfVxuICAgIH1cbiAgfSwgW3NldFdvcmtmbG93Q2FudmFzSGVpZ2h0LCBzZXRXb3JrZmxvd0NhbnZhc1dpZHRoXSlcblxuICBjb25zdCB7XG4gICAgc2V0U2hvd0NvbmZpcm0sXG4gICAgc2V0Q29udHJvbFByb21wdEVkaXRvclJlcmVuZGVyS2V5LFxuICAgIHNldFN5bmNXb3JrZmxvd0RyYWZ0SGFzaCxcbiAgICBzZXROb2Rlczogc2V0Tm9kZXNJblN0b3JlLFxuICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gIGNvbnN0IGN1cnJlbnROb2RlcyA9IHVzZU5vZGVzKClcbiAgY29uc3Qgc2V0Tm9kZXNPbmx5Q2hhbmdlV2l0aERhdGEgPSB1c2VDYWxsYmFjaygobm9kZXM6IE5vZGVbXSkgPT4ge1xuICAgIGNvbnN0IG5vZGVzRGF0YSA9IG5vZGVzLm1hcChub2RlID0+ICh7XG4gICAgICBpZDogbm9kZS5pZCxcbiAgICAgIGRhdGE6IG5vZGUuZGF0YSxcbiAgICB9KSlcbiAgICBjb25zdCBvbGREYXRhID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpLm5vZGVzLm1hcChub2RlID0+ICh7XG4gICAgICBpZDogbm9kZS5pZCxcbiAgICAgIGRhdGE6IG5vZGUuZGF0YSxcbiAgICB9KSlcbiAgICBpZiAoIWlzRXF1YWwob2xkRGF0YSwgbm9kZXNEYXRhKSlcbiAgICAgIHNldE5vZGVzSW5TdG9yZShub2RlcylcbiAgfSwgW3NldE5vZGVzSW5TdG9yZSwgd29ya2Zsb3dTdG9yZV0pXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Tm9kZXNPbmx5Q2hhbmdlV2l0aERhdGEoY3VycmVudE5vZGVzIGFzIE5vZGVbXSlcbiAgfSwgW2N1cnJlbnROb2Rlcywgc2V0Tm9kZXNPbmx5Q2hhbmdlV2l0aERhdGFdKVxuICBjb25zdCB7XG4gICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsXG4gICAgc3luY1dvcmtmbG93RHJhZnRXaGVuUGFnZUNsb3NlLFxuICB9ID0gdXNlTm9kZXNTeW5jRHJhZnQoKVxuICBjb25zdCB7IHdvcmtmbG93UmVhZE9ubHkgfSA9IHVzZVdvcmtmbG93UmVhZE9ubHkoKVxuICBjb25zdCB7IG5vZGVzUmVhZE9ubHkgfSA9IHVzZU5vZGVzUmVhZE9ubHkoKVxuICBjb25zdCB7IGV2ZW50RW1pdHRlciB9ID0gdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQoKVxuXG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuICBldmVudEVtaXR0ZXI/LnVzZVN1YnNjcmlwdGlvbigodjogYW55KSA9PiB7XG4gICAgaWYgKHYudHlwZSA9PT0gV09SS0ZMT1dfREFUQV9VUERBVEUpIHtcbiAgICAgIHNldE5vZGVzKHYucGF5bG9hZC5ub2RlcylcbiAgICAgIHN0b3JlLmdldFN0YXRlKCkuc2V0Tm9kZXModi5wYXlsb2FkLm5vZGVzKVxuICAgICAgc2V0RWRnZXModi5wYXlsb2FkLmVkZ2VzKVxuXG4gICAgICBpZiAodi5wYXlsb2FkLnZpZXdwb3J0KVxuICAgICAgICByZWFjdGZsb3cuc2V0Vmlld3BvcnQodi5wYXlsb2FkLnZpZXdwb3J0KVxuXG4gICAgICBpZiAodi5wYXlsb2FkLmhhc2gpXG4gICAgICAgIHNldFN5bmNXb3JrZmxvd0RyYWZ0SGFzaCh2LnBheWxvYWQuaGFzaClcblxuICAgICAgb25Xb3JrZmxvd0RhdGFVcGRhdGU/Lih2LnBheWxvYWQpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0Q29udHJvbFByb21wdEVkaXRvclJlcmVuZGVyS2V5KERhdGUubm93KCkpKVxuICAgIH1cbiAgfSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldEF1dG9GcmVlemUoZmFsc2UpXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc2V0QXV0b0ZyZWV6ZSh0cnVlKVxuICAgIH1cbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQodHJ1ZSwgdHJ1ZSlcbiAgICB9XG4gIH0sIFtoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdF0pXG5cbiAgY29uc3QgeyBoYW5kbGVSZWZyZXNoV29ya2Zsb3dEcmFmdCB9ID0gdXNlV29ya2Zsb3dSZWZyZXNoRHJhZnQoKVxuICBjb25zdCBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicpXG4gICAgICBzeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UoKVxuXG4gICAgZWxzZSBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGhhbmRsZVJlZnJlc2hXb3JrZmxvd0RyYWZ0KCksIDUwMClcbiAgfSwgW3N5bmNXb3JrZmxvd0RyYWZ0V2hlblBhZ2VDbG9zZSwgaGFuZGxlUmVmcmVzaFdvcmtmbG93RHJhZnQsIHdvcmtmbG93U3RvcmVdKVxuXG4gIC8vIEFsc28gYWRkIGJlZm9yZXVubG9hZCBoYW5kbGVyIGFzIGFkZGl0aW9uYWwgc2FmZXR5IG5ldCBmb3IgdGFiIGNsb3NlXG4gIGNvbnN0IGhhbmRsZUJlZm9yZVVubG9hZCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UoKVxuICB9LCBbc3luY1dvcmtmbG93RHJhZnRXaGVuUGFnZUNsb3NlXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIGhhbmRsZUJlZm9yZVVubG9hZClcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlU3luY1dvcmtmbG93RHJhZnRXaGVuUGFnZUNsb3NlKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIGhhbmRsZUJlZm9yZVVubG9hZClcbiAgICB9XG4gIH0sIFtoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UsIGhhbmRsZUJlZm9yZVVubG9hZF0pXG5cbiAgdXNlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKChlLmtleSA9PT0gJ2QnIHx8IGUua2V5ID09PSAnRCcpICYmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSlcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmICgoZS5rZXkgPT09ICd6JyB8fCBlLmtleSA9PT0gJ1onKSAmJiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSkpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBpZiAoKGUua2V5ID09PSAneScgfHwgZS5rZXkgPT09ICdZJykgJiYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkpKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgKChlLmtleSA9PT0gJ3MnIHx8IGUua2V5ID09PSAnUycpICYmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSlcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9KVxuICB1c2VFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lckNsaWVudFJlY3QgPSB3b3JrZmxvd0NvbnRhaW5lclJlZi5jdXJyZW50Py5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgaWYgKGNvbnRhaW5lckNsaWVudFJlY3QpIHtcbiAgICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoe1xuICAgICAgICBtb3VzZVBvc2l0aW9uOiB7XG4gICAgICAgICAgcGFnZVg6IGUuY2xpZW50WCxcbiAgICAgICAgICBwYWdlWTogZS5jbGllbnRZLFxuICAgICAgICAgIGVsZW1lbnRYOiBlLmNsaWVudFggLSBjb250YWluZXJDbGllbnRSZWN0LmxlZnQsXG4gICAgICAgICAgZWxlbWVudFk6IGUuY2xpZW50WSAtIGNvbnRhaW5lckNsaWVudFJlY3QudG9wLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgY29uc3Qge1xuICAgIGhhbmRsZU5vZGVEcmFnU3RhcnQsXG4gICAgaGFuZGxlTm9kZURyYWcsXG4gICAgaGFuZGxlTm9kZURyYWdTdG9wLFxuICAgIGhhbmRsZU5vZGVFbnRlcixcbiAgICBoYW5kbGVOb2RlTGVhdmUsXG4gICAgaGFuZGxlTm9kZUNsaWNrLFxuICAgIGhhbmRsZU5vZGVDb25uZWN0LFxuICAgIGhhbmRsZU5vZGVDb25uZWN0U3RhcnQsXG4gICAgaGFuZGxlTm9kZUNvbm5lY3RFbmQsXG4gICAgaGFuZGxlTm9kZUNvbnRleHRNZW51LFxuICAgIGhhbmRsZUhpc3RvcnlCYWNrLFxuICAgIGhhbmRsZUhpc3RvcnlGb3J3YXJkLFxuICB9ID0gdXNlTm9kZXNJbnRlcmFjdGlvbnMoKVxuICBjb25zdCB7XG4gICAgaGFuZGxlRWRnZUVudGVyLFxuICAgIGhhbmRsZUVkZ2VMZWF2ZSxcbiAgICBoYW5kbGVFZGdlc0NoYW5nZSxcbiAgfSA9IHVzZUVkZ2VzSW50ZXJhY3Rpb25zKClcbiAgY29uc3Qge1xuICAgIGhhbmRsZVNlbGVjdGlvblN0YXJ0LFxuICAgIGhhbmRsZVNlbGVjdGlvbkNoYW5nZSxcbiAgICBoYW5kbGVTZWxlY3Rpb25EcmFnLFxuICAgIGhhbmRsZVNlbGVjdGlvbkNvbnRleHRNZW51LFxuICB9ID0gdXNlU2VsZWN0aW9uSW50ZXJhY3Rpb25zKClcbiAgY29uc3Qge1xuICAgIGhhbmRsZVBhbmVDb250ZXh0TWVudSxcbiAgfSA9IHVzZVBhbmVsSW50ZXJhY3Rpb25zKClcbiAgY29uc3Qge1xuICAgIGlzVmFsaWRDb25uZWN0aW9uLFxuICB9ID0gdXNlV29ya2Zsb3coKVxuXG4gIHVzZU9uVmlld3BvcnRDaGFuZ2Uoe1xuICAgIG9uRW5kOiAoKSA9PiB7XG4gICAgICBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCgpXG4gICAgfSxcbiAgfSlcblxuICB1c2VTaG9ydGN1dHMoKVxuICAvLyBJbml0aWFsaXplIHdvcmtmbG93IG5vZGUgc2VhcmNoIGZ1bmN0aW9uYWxpdHlcbiAgdXNlV29ya2Zsb3dTZWFyY2goKVxuXG4gIC8vIFNldCB1cCBzY3JvbGwgdG8gbm9kZSBldmVudCBsaXN0ZW5lciB1c2luZyB0aGUgdXRpbGl0eSBmdW5jdGlvblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiBzZXR1cFNjcm9sbFRvTm9kZUxpc3RlbmVyKG5vZGVzLCByZWFjdGZsb3cpXG4gIH0sIFtub2RlcywgcmVhY3RmbG93XSlcblxuICBjb25zdCB7IHNjaGVtYVR5cGVEZWZpbml0aW9ucyB9ID0gdXNlTWF0Y2hTY2hlbWFUeXBlKClcbiAgY29uc3QgeyBmZXRjaEluc3BlY3RWYXJzIH0gPSB1c2VTZXRXb3JrZmxvd1ZhcnNXaXRoVmFsdWUoKVxuICBjb25zdCB7IGRhdGE6IGJ1aWxkSW5Ub29scyB9ID0gdXNlQWxsQnVpbHRJblRvb2xzKClcbiAgY29uc3QgeyBkYXRhOiBjdXN0b21Ub29scyB9ID0gdXNlQWxsQ3VzdG9tVG9vbHMoKVxuICBjb25zdCB7IGRhdGE6IHdvcmtmbG93VG9vbHMgfSA9IHVzZUFsbFdvcmtmbG93VG9vbHMoKVxuICBjb25zdCB7IGRhdGE6IG1jcFRvb2xzIH0gPSB1c2VBbGxNQ1BUb29scygpXG4gIGNvbnN0IGRhdGFTb3VyY2VMaXN0ID0gdXNlU3RvcmUocyA9PiBzLmRhdGFTb3VyY2VMaXN0KVxuICAvLyBidWlsZEluVG9vbHMsIGN1c3RvbVRvb2xzLCB3b3JrZmxvd1Rvb2xzLCBtY3BUb29scywgZGF0YVNvdXJjZUxpc3RcbiAgY29uc3QgY29uZmlnc01hcCA9IHVzZUhvb2tzU3RvcmUocyA9PiBzLmNvbmZpZ3NNYXApXG4gIGNvbnN0IFtpc0xvYWRlZFZhcnMsIHNldElzTG9hZGVkVmFyc10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3ZhcnMsIHNldFZhcnNdID0gdXNlU3RhdGU8VmFySW5JbnNwZWN0W10+KFtdKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIWNvbmZpZ3NNYXA/LmZsb3dUeXBlIHx8ICFjb25maWdzTWFwPy5mbG93SWQpXG4gICAgICAgIHJldHVyblxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoQWxsSW5zcGVjdFZhcnMoY29uZmlnc01hcC5mbG93VHlwZSwgY29uZmlnc01hcC5mbG93SWQpXG4gICAgICBzZXRWYXJzKGRhdGEpXG4gICAgICBzZXRJc0xvYWRlZFZhcnModHJ1ZSlcbiAgICB9KSgpXG4gIH0sIFtjb25maWdzTWFwPy5mbG93VHlwZSwgY29uZmlnc01hcD8uZmxvd0lkXSlcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2NoZW1hVHlwZURlZmluaXRpb25zICYmIGlzTG9hZGVkVmFycykge1xuICAgICAgZmV0Y2hJbnNwZWN0VmFycyh7XG4gICAgICAgIHBhc3NJblZhcnM6IHRydWUsXG4gICAgICAgIHZhcnMsXG4gICAgICAgIHBhc3NlZEluQWxsUGx1Z2luSW5mb0xpc3Q6IHtcbiAgICAgICAgICBidWlsZEluVG9vbHM6IGJ1aWxkSW5Ub29scyB8fCBbXSxcbiAgICAgICAgICBjdXN0b21Ub29sczogY3VzdG9tVG9vbHMgfHwgW10sXG4gICAgICAgICAgd29ya2Zsb3dUb29sczogd29ya2Zsb3dUb29scyB8fCBbXSxcbiAgICAgICAgICBtY3BUb29sczogbWNwVG9vbHMgfHwgW10sXG4gICAgICAgICAgZGF0YVNvdXJjZUxpc3Q6IGRhdGFTb3VyY2VMaXN0ID8/IFtdLFxuICAgICAgICB9LFxuICAgICAgICBwYXNzZWRJblNjaGVtYVR5cGVEZWZpbml0aW9uczogc2NoZW1hVHlwZURlZmluaXRpb25zLFxuICAgICAgfSlcbiAgICB9XG4gIH0sIFtzY2hlbWFUeXBlRGVmaW5pdGlvbnMsIGZldGNoSW5zcGVjdFZhcnMsIGlzTG9hZGVkVmFycywgdmFycywgY3VzdG9tVG9vbHMsIGJ1aWxkSW5Ub29scywgd29ya2Zsb3dUb29scywgbWNwVG9vbHMsIGRhdGFTb3VyY2VMaXN0XSlcblxuICBpZiAoSVNfREVWKSB7XG4gICAgc3RvcmUuZ2V0U3RhdGUoKS5vbkVycm9yID0gKGNvZGUsIG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChjb2RlID09PSAnMDAyJylcbiAgICAgICAgcmV0dXJuXG4gICAgICBjb25zb2xlLndhcm4obWVzc2FnZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGlkPVwid29ya2Zsb3ctY29udGFpbmVyXCJcbiAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICdyZWxhdGl2ZSBoLWZ1bGwgdy1mdWxsIG1pbi13LVs5NjBweF0nLFxuICAgICAgICB3b3JrZmxvd1JlYWRPbmx5ICYmICd3b3JrZmxvdy1wYW5lbC1hbmltYXRpb24nLFxuICAgICAgICBub2RlQW5pbWF0aW9uICYmICd3b3JrZmxvdy1ub2RlLWFuaW1hdGlvbicsXG4gICAgICApfVxuICAgICAgcmVmPXt3b3JrZmxvd0NvbnRhaW5lclJlZn1cbiAgICA+XG4gICAgICA8U3luY2luZ0RhdGFNb2RhbCAvPlxuICAgICAgPENhbmRpZGF0ZU5vZGUgLz5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZSBhYnNvbHV0ZSBsZWZ0LTAgdG9wLTAgei0xMCBmbGV4IHctMTIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMSBwbC0yXCJcbiAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OiBjb250cm9sSGVpZ2h0IH19XG4gICAgICA+XG4gICAgICAgIDxDb250cm9sIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxPcGVyYXRvciBoYW5kbGVSZWRvPXtoYW5kbGVIaXN0b3J5Rm9yd2FyZH0gaGFuZGxlVW5kbz17aGFuZGxlSGlzdG9yeUJhY2t9IC8+XG4gICAgICA8UGFuZWxDb250ZXh0bWVudSAvPlxuICAgICAgPE5vZGVDb250ZXh0bWVudSAvPlxuICAgICAgPFNlbGVjdGlvbkNvbnRleHRtZW51IC8+XG4gICAgICA8SGVscExpbmUgLz5cbiAgICAgIHtcbiAgICAgICAgISFzaG93Q29uZmlybSAmJiAoXG4gICAgICAgICAgPENvbmZpcm1cbiAgICAgICAgICAgIGlzU2hvd1xuICAgICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldFNob3dDb25maXJtKHVuZGVmaW5lZCl9XG4gICAgICAgICAgICBvbkNvbmZpcm09e3Nob3dDb25maXJtLm9uQ29uZmlybX1cbiAgICAgICAgICAgIHRpdGxlPXtzaG93Q29uZmlybS50aXRsZX1cbiAgICAgICAgICAgIGNvbnRlbnQ9e3Nob3dDb25maXJtLmRlc2N9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfVxuICAgICAge2NoaWxkcmVufVxuICAgICAgPFJlYWN0Rmxvd1xuICAgICAgICBub2RlVHlwZXM9e25vZGVUeXBlc31cbiAgICAgICAgZWRnZVR5cGVzPXtlZGdlVHlwZXN9XG4gICAgICAgIG5vZGVzPXtub2Rlc31cbiAgICAgICAgZWRnZXM9e2VkZ2VzfVxuICAgICAgICBvbk5vZGVEcmFnU3RhcnQ9e2hhbmRsZU5vZGVEcmFnU3RhcnR9XG4gICAgICAgIG9uTm9kZURyYWc9e2hhbmRsZU5vZGVEcmFnfVxuICAgICAgICBvbk5vZGVEcmFnU3RvcD17aGFuZGxlTm9kZURyYWdTdG9wfVxuICAgICAgICBvbk5vZGVNb3VzZUVudGVyPXtoYW5kbGVOb2RlRW50ZXJ9XG4gICAgICAgIG9uTm9kZU1vdXNlTGVhdmU9e2hhbmRsZU5vZGVMZWF2ZX1cbiAgICAgICAgb25Ob2RlQ2xpY2s9e2hhbmRsZU5vZGVDbGlja31cbiAgICAgICAgb25Ob2RlQ29udGV4dE1lbnU9e2hhbmRsZU5vZGVDb250ZXh0TWVudX1cbiAgICAgICAgb25Db25uZWN0PXtoYW5kbGVOb2RlQ29ubmVjdH1cbiAgICAgICAgb25Db25uZWN0U3RhcnQ9e2hhbmRsZU5vZGVDb25uZWN0U3RhcnR9XG4gICAgICAgIG9uQ29ubmVjdEVuZD17aGFuZGxlTm9kZUNvbm5lY3RFbmR9XG4gICAgICAgIG9uRWRnZU1vdXNlRW50ZXI9e2hhbmRsZUVkZ2VFbnRlcn1cbiAgICAgICAgb25FZGdlTW91c2VMZWF2ZT17aGFuZGxlRWRnZUxlYXZlfVxuICAgICAgICBvbkVkZ2VzQ2hhbmdlPXtoYW5kbGVFZGdlc0NoYW5nZX1cbiAgICAgICAgb25TZWxlY3Rpb25TdGFydD17aGFuZGxlU2VsZWN0aW9uU3RhcnR9XG4gICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlPXtoYW5kbGVTZWxlY3Rpb25DaGFuZ2V9XG4gICAgICAgIG9uU2VsZWN0aW9uRHJhZz17aGFuZGxlU2VsZWN0aW9uRHJhZ31cbiAgICAgICAgb25QYW5lQ29udGV4dE1lbnU9e2hhbmRsZVBhbmVDb250ZXh0TWVudX1cbiAgICAgICAgb25TZWxlY3Rpb25Db250ZXh0TWVudT17aGFuZGxlU2VsZWN0aW9uQ29udGV4dE1lbnV9XG4gICAgICAgIGNvbm5lY3Rpb25MaW5lQ29tcG9uZW50PXtDdXN0b21Db25uZWN0aW9uTGluZX1cbiAgICAgICAgLy8gTk9URTogRm9yIExPT1Agbm9kZSwgaG93IHRvIGRpc3Rpbmd1aXNoIGJldHdlZW4gSVRFUkFUSU9OIGFuZCBMT09QIGhlcmU/IE1heWJlIGJvdGggYXJlIHRoZSBzYW1lP1xuICAgICAgICBjb25uZWN0aW9uTGluZUNvbnRhaW5lclN0eWxlPXt7IHpJbmRleDogSVRFUkFUSU9OX0NISUxEUkVOX1pfSU5ERVggfX1cbiAgICAgICAgZGVmYXVsdFZpZXdwb3J0PXt2aWV3cG9ydH1cbiAgICAgICAgbXVsdGlTZWxlY3Rpb25LZXlDb2RlPXtudWxsfVxuICAgICAgICBkZWxldGVLZXlDb2RlPXtudWxsfVxuICAgICAgICBub2Rlc0RyYWdnYWJsZT17IW5vZGVzUmVhZE9ubHl9XG4gICAgICAgIG5vZGVzQ29ubmVjdGFibGU9eyFub2Rlc1JlYWRPbmx5fVxuICAgICAgICBub2Rlc0ZvY3VzYWJsZT17IW5vZGVzUmVhZE9ubHl9XG4gICAgICAgIGVkZ2VzRm9jdXNhYmxlPXshbm9kZXNSZWFkT25seX1cbiAgICAgICAgcGFuT25TY3JvbGw9e2NvbnRyb2xNb2RlID09PSBDb250cm9sTW9kZS5Qb2ludGVyICYmICF3b3JrZmxvd1JlYWRPbmx5fVxuICAgICAgICBwYW5PbkRyYWc9e2NvbnRyb2xNb2RlID09PSBDb250cm9sTW9kZS5IYW5kIHx8IFsxXX1cbiAgICAgICAgem9vbU9uUGluY2g9e3RydWV9XG4gICAgICAgIHpvb21PblNjcm9sbD17dHJ1ZX1cbiAgICAgICAgem9vbU9uRG91YmxlQ2xpY2s9e3RydWV9XG4gICAgICAgIGlzVmFsaWRDb25uZWN0aW9uPXtpc1ZhbGlkQ29ubmVjdGlvbn1cbiAgICAgICAgc2VsZWN0aW9uS2V5Q29kZT17bnVsbH1cbiAgICAgICAgc2VsZWN0aW9uTW9kZT17U2VsZWN0aW9uTW9kZS5QYXJ0aWFsfVxuICAgICAgICBzZWxlY3Rpb25PbkRyYWc9e2NvbnRyb2xNb2RlID09PSBDb250cm9sTW9kZS5Qb2ludGVyICYmICF3b3JrZmxvd1JlYWRPbmx5fVxuICAgICAgICBtaW5ab29tPXswLjI1fVxuICAgICAgPlxuICAgICAgICA8QmFja2dyb3VuZFxuICAgICAgICAgIGdhcD17WzE0LCAxNF19XG4gICAgICAgICAgc2l6ZT17Mn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJiZy13b3JrZmxvdy1jYW52YXMtd29ya2Zsb3ctYmdcIlxuICAgICAgICAgIGNvbG9yPVwidmFyKC0tY29sb3Itd29ya2Zsb3ctY2FudmFzLXdvcmtmbG93LWRvdC1jb2xvcilcIlxuICAgICAgICAvPlxuICAgICAgPC9SZWFjdEZsb3c+XG4gICAgPC9kaXY+XG4gIClcbn0pXG5cbnR5cGUgV29ya2Zsb3dXaXRoSW5uZXJDb250ZXh0UHJvcHMgPSBXb3JrZmxvd1Byb3BzICYge1xuICBob29rc1N0b3JlPzogUGFydGlhbDxIb29rc1N0b3JlU2hhcGU+XG59XG5leHBvcnQgY29uc3QgV29ya2Zsb3dXaXRoSW5uZXJDb250ZXh0ID0gbWVtbygoe1xuICBob29rc1N0b3JlLFxuICAuLi5yZXN0UHJvcHNcbn06IFdvcmtmbG93V2l0aElubmVyQ29udGV4dFByb3BzKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPEhvb2tzU3RvcmVDb250ZXh0UHJvdmlkZXIgey4uLmhvb2tzU3RvcmV9PlxuICAgICAgPFdvcmtmbG93IHsuLi5yZXN0UHJvcHN9IC8+XG4gICAgPC9Ib29rc1N0b3JlQ29udGV4dFByb3ZpZGVyPlxuICApXG59KVxuXG50eXBlIFdvcmtmbG93V2l0aERlZmF1bHRDb250ZXh0UHJvcHNcbiAgPSBQaWNrPFdvcmtmbG93UHJvcHMsICdlZGdlcycgfCAnbm9kZXMnPlxuICAgICYge1xuICAgICAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZVxuICAgIH1cblxuY29uc3QgV29ya2Zsb3dXaXRoRGVmYXVsdENvbnRleHQgPSAoe1xuICBub2RlcyxcbiAgZWRnZXMsXG4gIGNoaWxkcmVuLFxufTogV29ya2Zsb3dXaXRoRGVmYXVsdENvbnRleHRQcm9wcykgPT4ge1xuICByZXR1cm4gKFxuICAgIDxSZWFjdEZsb3dQcm92aWRlcj5cbiAgICAgIDxXb3JrZmxvd0hpc3RvcnlQcm92aWRlclxuICAgICAgICBub2Rlcz17bm9kZXN9XG4gICAgICAgIGVkZ2VzPXtlZGdlc31cbiAgICAgID5cbiAgICAgICAgPERhdGFzZXRzRGV0YWlsUHJvdmlkZXIgbm9kZXM9e25vZGVzfT5cbiAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIDwvRGF0YXNldHNEZXRhaWxQcm92aWRlcj5cbiAgICAgIDwvV29ya2Zsb3dIaXN0b3J5UHJvdmlkZXI+XG4gICAgPC9SZWFjdEZsb3dQcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vKFdvcmtmbG93V2l0aERlZmF1bHRDb250ZXh0KVxuIl19