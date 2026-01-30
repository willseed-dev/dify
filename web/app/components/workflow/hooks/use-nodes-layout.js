"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNodesLayout = exports.getLayoutedNodes = void 0;
const elk_bundled_js_1 = require("elkjs/lib/elk.bundled.js");
const object_1 = require("es-toolkit/object");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const constants_1 = require("../constants");
const store_1 = require("../store");
const use_nodes_sync_draft_1 = require("./use-nodes-sync-draft");
const layoutOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'RIGHT',
    'elk.layered.spacing.nodeNodeBetweenLayers': '60',
    'elk.spacing.nodeNode': '40',
    'elk.layered.nodePlacement.strategy': 'SIMPLE',
};
const elk = new elk_bundled_js_1.default();
const getLayoutedNodes = async (nodes, edges) => {
    const graph = {
        id: 'root',
        layoutOptions,
        children: nodes.map((n) => {
            return {
                ...n,
                width: n.width ?? 150,
                height: n.height ?? 50,
                targetPosition: 'left',
                sourcePosition: 'right',
            };
        }),
        edges: (0, object_1.cloneDeep)(edges),
    };
    const layoutedGraph = await elk.layout(graph);
    const layoutedNodes = nodes.map((node) => {
        const layoutedNode = layoutedGraph.children?.find(lgNode => lgNode.id === node.id);
        return {
            ...node,
            position: {
                x: (layoutedNode?.x ?? 0) + constants_1.AUTO_LAYOUT_OFFSET.x,
                y: (layoutedNode?.y ?? 0) + constants_1.AUTO_LAYOUT_OFFSET.y,
            },
        };
    });
    return {
        layoutedNodes,
    };
};
exports.getLayoutedNodes = getLayoutedNodes;
const useNodesLayout = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const reactflow = (0, reactflow_1.useReactFlow)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { handleSyncWorkflowDraft } = (0, use_nodes_sync_draft_1.useNodesSyncDraft)();
    const handleNodesLayout = (0, react_1.useCallback)(async () => {
        workflowStore.setState({ nodeAnimation: true });
        const { getNodes, edges, setNodes, } = store.getState();
        const { setViewport } = reactflow;
        const nodes = getNodes();
        const { layoutedNodes, } = await (0, exports.getLayoutedNodes)(nodes, edges);
        setNodes(layoutedNodes);
        const zoom = 0.7;
        setViewport({
            x: 0,
            y: 0,
            zoom,
        });
        setTimeout(() => {
            handleSyncWorkflowDraft();
        });
    }, [store, reactflow, handleSyncWorkflowDraft, workflowStore]);
    return {
        handleNodesLayout,
    };
};
exports.useNodesLayout = useNodesLayout;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW5vZGVzLWxheW91dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1ub2Rlcy1sYXlvdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsNkRBQTBDO0FBQzFDLDhDQUE2QztBQUM3QyxpQ0FBbUM7QUFDbkMseUNBR2tCO0FBQ2xCLDRDQUFpRDtBQUNqRCxvQ0FBMkM7QUFDM0MsaUVBQTBEO0FBRTFELE1BQU0sYUFBYSxHQUFHO0lBQ3BCLGVBQWUsRUFBRSxTQUFTO0lBQzFCLGVBQWUsRUFBRSxPQUFPO0lBQ3hCLDJDQUEyQyxFQUFFLElBQUk7SUFDakQsc0JBQXNCLEVBQUUsSUFBSTtJQUM1QixvQ0FBb0MsRUFBRSxRQUFRO0NBQy9DLENBQUE7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFHLEVBQUUsQ0FBQTtBQUVkLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxFQUFFLEtBQWEsRUFBRSxLQUFhLEVBQUUsRUFBRTtJQUNyRSxNQUFNLEtBQUssR0FBRztRQUNaLEVBQUUsRUFBRSxNQUFNO1FBQ1YsYUFBYTtRQUNiLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDeEIsT0FBTztnQkFDTCxHQUFHLENBQUM7Z0JBQ0osS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksR0FBRztnQkFDckIsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksRUFBRTtnQkFDdEIsY0FBYyxFQUFFLE1BQU07Z0JBQ3RCLGNBQWMsRUFBRSxPQUFPO2FBQ3hCLENBQUE7UUFDSCxDQUFDLENBQUM7UUFDRixLQUFLLEVBQUUsSUFBQSxrQkFBUyxFQUFDLEtBQUssQ0FBQztLQUN4QixDQUFBO0lBRUQsTUFBTSxhQUFhLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQVksQ0FBQyxDQUFBO0lBQ3BELE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUN2QyxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FDL0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQ2hDLENBQUE7UUFFRCxPQUFPO1lBQ0wsR0FBRyxJQUFJO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsOEJBQWtCLENBQUMsQ0FBQztnQkFDaEQsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyw4QkFBa0IsQ0FBQyxDQUFDO2FBQ2pEO1NBQ0YsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTztRQUNMLGFBQWE7S0FDZCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBbENZLFFBQUEsZ0JBQWdCLG9CQWtDNUI7QUFFTSxNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUU7SUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBQSx1QkFBVyxHQUFFLENBQUE7SUFDM0IsTUFBTSxTQUFTLEdBQUcsSUFBQSx3QkFBWSxHQUFFLENBQUE7SUFDaEMsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQ3hDLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxHQUFHLElBQUEsd0NBQWlCLEdBQUUsQ0FBQTtJQUV2RCxNQUFNLGlCQUFpQixHQUFHLElBQUEsbUJBQVcsRUFBQyxLQUFLLElBQUksRUFBRTtRQUMvQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFDL0MsTUFBTSxFQUNKLFFBQVEsRUFDUixLQUFLLEVBQ0wsUUFBUSxHQUNULEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3BCLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxTQUFTLENBQUE7UUFDakMsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUE7UUFDeEIsTUFBTSxFQUNKLGFBQWEsR0FDZCxHQUFHLE1BQU0sSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFeEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQTtRQUNoQixXQUFXLENBQUM7WUFDVixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1lBQ0osSUFBSTtTQUNMLENBQUMsQ0FBQTtRQUNGLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCx1QkFBdUIsRUFBRSxDQUFBO1FBQzNCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBRTlELE9BQU87UUFDTCxpQkFBaUI7S0FDbEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQWxDWSxRQUFBLGNBQWMsa0JBa0MxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgRWRnZSxcbiAgTm9kZSxcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgRUxLIGZyb20gJ2Vsa2pzL2xpYi9lbGsuYnVuZGxlZC5qcydcbmltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gJ2VzLXRvb2xraXQvb2JqZWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIHVzZVJlYWN0RmxvdyxcbiAgdXNlU3RvcmVBcGksXG59IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IEFVVE9fTEFZT1VUX09GRlNFVCB9IGZyb20gJy4uL2NvbnN0YW50cydcbmltcG9ydCB7IHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICcuLi9zdG9yZSdcbmltcG9ydCB7IHVzZU5vZGVzU3luY0RyYWZ0IH0gZnJvbSAnLi91c2Utbm9kZXMtc3luYy1kcmFmdCdcblxuY29uc3QgbGF5b3V0T3B0aW9ucyA9IHtcbiAgJ2Vsay5hbGdvcml0aG0nOiAnbGF5ZXJlZCcsXG4gICdlbGsuZGlyZWN0aW9uJzogJ1JJR0hUJyxcbiAgJ2Vsay5sYXllcmVkLnNwYWNpbmcubm9kZU5vZGVCZXR3ZWVuTGF5ZXJzJzogJzYwJyxcbiAgJ2Vsay5zcGFjaW5nLm5vZGVOb2RlJzogJzQwJyxcbiAgJ2Vsay5sYXllcmVkLm5vZGVQbGFjZW1lbnQuc3RyYXRlZ3knOiAnU0lNUExFJyxcbn1cblxuY29uc3QgZWxrID0gbmV3IEVMSygpXG5cbmV4cG9ydCBjb25zdCBnZXRMYXlvdXRlZE5vZGVzID0gYXN5bmMgKG5vZGVzOiBOb2RlW10sIGVkZ2VzOiBFZGdlW10pID0+IHtcbiAgY29uc3QgZ3JhcGggPSB7XG4gICAgaWQ6ICdyb290JyxcbiAgICBsYXlvdXRPcHRpb25zLFxuICAgIGNoaWxkcmVuOiBub2Rlcy5tYXAoKG4pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLm4sXG4gICAgICAgIHdpZHRoOiBuLndpZHRoID8/IDE1MCxcbiAgICAgICAgaGVpZ2h0OiBuLmhlaWdodCA/PyA1MCxcbiAgICAgICAgdGFyZ2V0UG9zaXRpb246ICdsZWZ0JyxcbiAgICAgICAgc291cmNlUG9zaXRpb246ICdyaWdodCcsXG4gICAgICB9XG4gICAgfSksXG4gICAgZWRnZXM6IGNsb25lRGVlcChlZGdlcyksXG4gIH1cblxuICBjb25zdCBsYXlvdXRlZEdyYXBoID0gYXdhaXQgZWxrLmxheW91dChncmFwaCBhcyBhbnkpXG4gIGNvbnN0IGxheW91dGVkTm9kZXMgPSBub2Rlcy5tYXAoKG5vZGUpID0+IHtcbiAgICBjb25zdCBsYXlvdXRlZE5vZGUgPSBsYXlvdXRlZEdyYXBoLmNoaWxkcmVuPy5maW5kKFxuICAgICAgbGdOb2RlID0+IGxnTm9kZS5pZCA9PT0gbm9kZS5pZCxcbiAgICApXG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ubm9kZSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHg6IChsYXlvdXRlZE5vZGU/LnggPz8gMCkgKyBBVVRPX0xBWU9VVF9PRkZTRVQueCxcbiAgICAgICAgeTogKGxheW91dGVkTm9kZT8ueSA/PyAwKSArIEFVVE9fTEFZT1VUX09GRlNFVC55LFxuICAgICAgfSxcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHtcbiAgICBsYXlvdXRlZE5vZGVzLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VOb2Rlc0xheW91dCA9ICgpID0+IHtcbiAgY29uc3Qgc3RvcmUgPSB1c2VTdG9yZUFwaSgpXG4gIGNvbnN0IHJlYWN0ZmxvdyA9IHVzZVJlYWN0RmxvdygpXG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3QgeyBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCB9ID0gdXNlTm9kZXNTeW5jRHJhZnQoKVxuXG4gIGNvbnN0IGhhbmRsZU5vZGVzTGF5b3V0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBub2RlQW5pbWF0aW9uOiB0cnVlIH0pXG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBlZGdlcyxcbiAgICAgIHNldE5vZGVzLFxuICAgIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3QgeyBzZXRWaWV3cG9ydCB9ID0gcmVhY3RmbG93XG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgY29uc3Qge1xuICAgICAgbGF5b3V0ZWROb2RlcyxcbiAgICB9ID0gYXdhaXQgZ2V0TGF5b3V0ZWROb2Rlcyhub2RlcywgZWRnZXMpXG5cbiAgICBzZXROb2RlcyhsYXlvdXRlZE5vZGVzKVxuICAgIGNvbnN0IHpvb20gPSAwLjdcbiAgICBzZXRWaWV3cG9ydCh7XG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICAgIHpvb20sXG4gICAgfSlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KClcbiAgICB9KVxuICB9LCBbc3RvcmUsIHJlYWN0ZmxvdywgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQsIHdvcmtmbG93U3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlTm9kZXNMYXlvdXQsXG4gIH1cbn1cbiJdfQ==