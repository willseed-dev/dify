"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const custom_edge_linear_gradient_render_1 = require("@/app/components/workflow/custom-edge-linear-gradient-render");
const types_1 = require("@/app/components/workflow/nodes/_base/components/error-handle/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const CustomEdge = ({ id, data, sourceHandleId, sourceX, sourceY, targetX, targetY, selected, }) => {
    const [edgePath,] = (0, reactflow_1.getBezierPath)({
        sourceX: sourceX - 8,
        sourceY,
        sourcePosition: reactflow_1.Position.Right,
        targetX: targetX + 8,
        targetY,
        targetPosition: reactflow_1.Position.Left,
        curvature: 0.16,
    });
    const { _sourceRunningStatus, _targetRunningStatus, } = data;
    const linearGradientId = (0, react_1.useMemo)(() => {
        if ((_sourceRunningStatus === types_2.NodeRunningStatus.Succeeded
            || _sourceRunningStatus === types_2.NodeRunningStatus.Failed
            || _sourceRunningStatus === types_2.NodeRunningStatus.Exception) && (_targetRunningStatus === types_2.NodeRunningStatus.Succeeded
            || _targetRunningStatus === types_2.NodeRunningStatus.Failed
            || _targetRunningStatus === types_2.NodeRunningStatus.Exception
            || _targetRunningStatus === types_2.NodeRunningStatus.Running)) {
            return id;
        }
    }, [_sourceRunningStatus, _targetRunningStatus, id]);
    const stroke = (0, react_1.useMemo)(() => {
        if (selected)
            return (0, utils_1.getEdgeColor)(types_2.NodeRunningStatus.Running);
        if (linearGradientId)
            return `url(#${linearGradientId})`;
        if (data?._connectedNodeIsHovering)
            return (0, utils_1.getEdgeColor)(types_2.NodeRunningStatus.Running, sourceHandleId === types_1.ErrorHandleTypeEnum.failBranch);
        return (0, utils_1.getEdgeColor)();
    }, [data._connectedNodeIsHovering, linearGradientId, selected, sourceHandleId]);
    return (<>
      {linearGradientId && (<custom_edge_linear_gradient_render_1.default id={linearGradientId} startColor={(0, utils_1.getEdgeColor)(_sourceRunningStatus)} stopColor={(0, utils_1.getEdgeColor)(_targetRunningStatus)} position={{
                x1: sourceX,
                y1: sourceY,
                x2: targetX,
                y2: targetY,
            }}/>)}
      <reactflow_1.BaseEdge id={id} path={edgePath} style={{
            stroke,
            strokeWidth: 2,
            opacity: data._waitingRun ? 0.7 : 1,
        }}/>
    </>);
};
exports.default = (0, react_1.memo)(CustomEdge);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWVkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tZWRnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FHYztBQUNkLHlDQUlrQjtBQUNsQixxSEFBeUc7QUFDekcsK0ZBQXlHO0FBQ3pHLDJEQUFtRTtBQUNuRSwyREFBOEQ7QUFFOUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUNsQixFQUFFLEVBQ0YsSUFBSSxFQUNKLGNBQWMsRUFDZCxPQUFPLEVBQ1AsT0FBTyxFQUNQLE9BQU8sRUFDUCxPQUFPLEVBQ1AsUUFBUSxHQUNFLEVBQUUsRUFBRTtJQUNkLE1BQU0sQ0FDSixRQUFRLEVBQ1QsR0FBRyxJQUFBLHlCQUFhLEVBQUM7UUFDaEIsT0FBTyxFQUFFLE9BQU8sR0FBRyxDQUFDO1FBQ3BCLE9BQU87UUFDUCxjQUFjLEVBQUUsb0JBQVEsQ0FBQyxLQUFLO1FBQzlCLE9BQU8sRUFBRSxPQUFPLEdBQUcsQ0FBQztRQUNwQixPQUFPO1FBQ1AsY0FBYyxFQUFFLG9CQUFRLENBQUMsSUFBSTtRQUM3QixTQUFTLEVBQUUsSUFBSTtLQUNoQixDQUFDLENBQUE7SUFDRixNQUFNLEVBQ0osb0JBQW9CLEVBQ3BCLG9CQUFvQixHQUNyQixHQUFHLElBQUksQ0FBQTtJQUVSLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ3BDLElBQ0UsQ0FDRSxvQkFBb0IsS0FBSyx5QkFBaUIsQ0FBQyxTQUFTO2VBQ2pELG9CQUFvQixLQUFLLHlCQUFpQixDQUFDLE1BQU07ZUFDakQsb0JBQW9CLEtBQUsseUJBQWlCLENBQUMsU0FBUyxDQUN4RCxJQUFJLENBQ0gsb0JBQW9CLEtBQUsseUJBQWlCLENBQUMsU0FBUztlQUNqRCxvQkFBb0IsS0FBSyx5QkFBaUIsQ0FBQyxNQUFNO2VBQ2pELG9CQUFvQixLQUFLLHlCQUFpQixDQUFDLFNBQVM7ZUFDcEQsb0JBQW9CLEtBQUsseUJBQWlCLENBQUMsT0FBTyxDQUN0RCxFQUNELENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRXBELE1BQU0sTUFBTSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUMxQixJQUFJLFFBQVE7WUFDVixPQUFPLElBQUEsb0JBQVksRUFBQyx5QkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVoRCxJQUFJLGdCQUFnQjtZQUNsQixPQUFPLFFBQVEsZ0JBQWdCLEdBQUcsQ0FBQTtRQUVwQyxJQUFJLElBQUksRUFBRSx3QkFBd0I7WUFDaEMsT0FBTyxJQUFBLG9CQUFZLEVBQUMseUJBQWlCLENBQUMsT0FBTyxFQUFFLGNBQWMsS0FBSywyQkFBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUVuRyxPQUFPLElBQUEsb0JBQVksR0FBRSxDQUFBO0lBQ3ZCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUUvRSxPQUFPLENBQ0wsRUFDRTtNQUFBLENBQ0UsZ0JBQWdCLElBQUksQ0FDbEIsQ0FBQyw0Q0FBOEIsQ0FDN0IsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FDckIsVUFBVSxDQUFDLENBQUMsSUFBQSxvQkFBWSxFQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FDL0MsU0FBUyxDQUFDLENBQUMsSUFBQSxvQkFBWSxFQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FDOUMsUUFBUSxDQUFDLENBQUM7Z0JBQ1IsRUFBRSxFQUFFLE9BQU87Z0JBQ1gsRUFBRSxFQUFFLE9BQU87Z0JBQ1gsRUFBRSxFQUFFLE9BQU87Z0JBQ1gsRUFBRSxFQUFFLE9BQU87YUFDWixDQUFDLEVBQ0YsQ0FFTixDQUNBO01BQUEsQ0FBQyxvQkFBUSxDQUNQLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNQLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNmLEtBQUssQ0FBQyxDQUFDO1lBQ0wsTUFBTTtZQUNOLFdBQVcsRUFBRSxDQUFDO1lBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQyxDQUFDLEVBRU47SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLElBQUEsWUFBSSxFQUFDLFVBQVUsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBFZGdlUHJvcHMgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQge1xuICBtZW1vLFxuICB1c2VNZW1vLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIEJhc2VFZGdlLFxuICBnZXRCZXppZXJQYXRoLFxuICBQb3NpdGlvbixcbn0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IEN1c3RvbUVkZ2VMaW5lYXJHcmFkaWVudFJlbmRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2N1c3RvbS1lZGdlLWxpbmVhci1ncmFkaWVudC1yZW5kZXInXG5pbXBvcnQgeyBFcnJvckhhbmRsZVR5cGVFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL2Vycm9yLWhhbmRsZS90eXBlcydcbmltcG9ydCB7IE5vZGVSdW5uaW5nU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdldEVkZ2VDb2xvciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG5cbmNvbnN0IEN1c3RvbUVkZ2UgPSAoe1xuICBpZCxcbiAgZGF0YSxcbiAgc291cmNlSGFuZGxlSWQsXG4gIHNvdXJjZVgsXG4gIHNvdXJjZVksXG4gIHRhcmdldFgsXG4gIHRhcmdldFksXG4gIHNlbGVjdGVkLFxufTogRWRnZVByb3BzKSA9PiB7XG4gIGNvbnN0IFtcbiAgICBlZGdlUGF0aCxcbiAgXSA9IGdldEJlemllclBhdGgoe1xuICAgIHNvdXJjZVg6IHNvdXJjZVggLSA4LFxuICAgIHNvdXJjZVksXG4gICAgc291cmNlUG9zaXRpb246IFBvc2l0aW9uLlJpZ2h0LFxuICAgIHRhcmdldFg6IHRhcmdldFggKyA4LFxuICAgIHRhcmdldFksXG4gICAgdGFyZ2V0UG9zaXRpb246IFBvc2l0aW9uLkxlZnQsXG4gICAgY3VydmF0dXJlOiAwLjE2LFxuICB9KVxuICBjb25zdCB7XG4gICAgX3NvdXJjZVJ1bm5pbmdTdGF0dXMsXG4gICAgX3RhcmdldFJ1bm5pbmdTdGF0dXMsXG4gIH0gPSBkYXRhXG5cbiAgY29uc3QgbGluZWFyR3JhZGllbnRJZCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChcbiAgICAgIChcbiAgICAgICAgX3NvdXJjZVJ1bm5pbmdTdGF0dXMgPT09IE5vZGVSdW5uaW5nU3RhdHVzLlN1Y2NlZWRlZFxuICAgICAgICB8fCBfc291cmNlUnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuRmFpbGVkXG4gICAgICAgIHx8IF9zb3VyY2VSdW5uaW5nU3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5FeGNlcHRpb25cbiAgICAgICkgJiYgKFxuICAgICAgICBfdGFyZ2V0UnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuU3VjY2VlZGVkXG4gICAgICAgIHx8IF90YXJnZXRSdW5uaW5nU3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5GYWlsZWRcbiAgICAgICAgfHwgX3RhcmdldFJ1bm5pbmdTdGF0dXMgPT09IE5vZGVSdW5uaW5nU3RhdHVzLkV4Y2VwdGlvblxuICAgICAgICB8fCBfdGFyZ2V0UnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZ1xuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIGlkXG4gICAgfVxuICB9LCBbX3NvdXJjZVJ1bm5pbmdTdGF0dXMsIF90YXJnZXRSdW5uaW5nU3RhdHVzLCBpZF0pXG5cbiAgY29uc3Qgc3Ryb2tlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKHNlbGVjdGVkKVxuICAgICAgcmV0dXJuIGdldEVkZ2VDb2xvcihOb2RlUnVubmluZ1N0YXR1cy5SdW5uaW5nKVxuXG4gICAgaWYgKGxpbmVhckdyYWRpZW50SWQpXG4gICAgICByZXR1cm4gYHVybCgjJHtsaW5lYXJHcmFkaWVudElkfSlgXG5cbiAgICBpZiAoZGF0YT8uX2Nvbm5lY3RlZE5vZGVJc0hvdmVyaW5nKVxuICAgICAgcmV0dXJuIGdldEVkZ2VDb2xvcihOb2RlUnVubmluZ1N0YXR1cy5SdW5uaW5nLCBzb3VyY2VIYW5kbGVJZCA9PT0gRXJyb3JIYW5kbGVUeXBlRW51bS5mYWlsQnJhbmNoKVxuXG4gICAgcmV0dXJuIGdldEVkZ2VDb2xvcigpXG4gIH0sIFtkYXRhLl9jb25uZWN0ZWROb2RlSXNIb3ZlcmluZywgbGluZWFyR3JhZGllbnRJZCwgc2VsZWN0ZWQsIHNvdXJjZUhhbmRsZUlkXSlcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7XG4gICAgICAgIGxpbmVhckdyYWRpZW50SWQgJiYgKFxuICAgICAgICAgIDxDdXN0b21FZGdlTGluZWFyR3JhZGllbnRSZW5kZXJcbiAgICAgICAgICAgIGlkPXtsaW5lYXJHcmFkaWVudElkfVxuICAgICAgICAgICAgc3RhcnRDb2xvcj17Z2V0RWRnZUNvbG9yKF9zb3VyY2VSdW5uaW5nU3RhdHVzKX1cbiAgICAgICAgICAgIHN0b3BDb2xvcj17Z2V0RWRnZUNvbG9yKF90YXJnZXRSdW5uaW5nU3RhdHVzKX1cbiAgICAgICAgICAgIHBvc2l0aW9uPXt7XG4gICAgICAgICAgICAgIHgxOiBzb3VyY2VYLFxuICAgICAgICAgICAgICB5MTogc291cmNlWSxcbiAgICAgICAgICAgICAgeDI6IHRhcmdldFgsXG4gICAgICAgICAgICAgIHkyOiB0YXJnZXRZLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICApXG4gICAgICB9XG4gICAgICA8QmFzZUVkZ2VcbiAgICAgICAgaWQ9e2lkfVxuICAgICAgICBwYXRoPXtlZGdlUGF0aH1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBzdHJva2UsXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6IDIsXG4gICAgICAgICAgb3BhY2l0eTogZGF0YS5fd2FpdGluZ1J1biA/IDAuNyA6IDEsXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oQ3VzdG9tRWRnZSlcbiJdfQ==