"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ahooks_1 = require("ahooks");
const react_1 = require("react");
const hooks_1 = require("../../../hooks");
const store_1 = require("../../../store");
const hooks_2 = require("../../variable-assigner/hooks");
const utils_1 = require("../../variable-assigner/utils");
const add_variable_popup_1 = require("./add-variable-popup");
const AddVariablePopupWithPosition = ({ nodeId, nodeData, }) => {
    const ref = (0, react_1.useRef)(null);
    const showAssignVariablePopup = (0, store_1.useStore)(s => s.showAssignVariablePopup);
    const setShowAssignVariablePopup = (0, store_1.useStore)(s => s.setShowAssignVariablePopup);
    const { handleNodeDataUpdate } = (0, hooks_1.useNodeDataUpdate)();
    const { handleAddVariableInAddVariablePopupWithPosition } = (0, hooks_2.useVariableAssigner)();
    const isChatMode = (0, hooks_1.useIsChatMode)();
    const { getBeforeNodesInSameBranch } = (0, hooks_1.useWorkflow)();
    const { getNodeAvailableVars } = (0, hooks_1.useWorkflowVariables)();
    const outputType = (0, react_1.useMemo)(() => {
        if (!showAssignVariablePopup)
            return '';
        const groupEnabled = showAssignVariablePopup.variableAssignerNodeData.advanced_settings?.group_enabled;
        if (!groupEnabled)
            return showAssignVariablePopup.variableAssignerNodeData.output_type;
        const group = showAssignVariablePopup.variableAssignerNodeData.advanced_settings?.groups.find(group => group.groupId === showAssignVariablePopup.variableAssignerNodeHandleId);
        return group?.output_type || '';
    }, [showAssignVariablePopup]);
    const availableVars = (0, react_1.useMemo)(() => {
        if (!showAssignVariablePopup)
            return [];
        return getNodeAvailableVars({
            parentNode: showAssignVariablePopup.parentNode,
            beforeNodes: [
                ...getBeforeNodesInSameBranch(showAssignVariablePopup.nodeId),
                {
                    id: showAssignVariablePopup.nodeId,
                    data: showAssignVariablePopup.nodeData,
                },
            ],
            hideEnv: true,
            hideChatVar: !isChatMode,
            isChatMode,
            filterVar: (0, utils_1.filterVar)(outputType),
        })
            .map(node => ({
            ...node,
            vars: node.isStartNode ? node.vars.filter(v => !v.variable.startsWith('sys.')) : node.vars,
        }))
            .filter(item => item.vars.length > 0);
    }, [showAssignVariablePopup, getNodeAvailableVars, getBeforeNodesInSameBranch, isChatMode, outputType]);
    (0, ahooks_1.useClickAway)(() => {
        if (nodeData._holdAddVariablePopup) {
            handleNodeDataUpdate({
                id: nodeId,
                data: {
                    _holdAddVariablePopup: false,
                },
            });
        }
        else {
            handleNodeDataUpdate({
                id: nodeId,
                data: {
                    _showAddVariablePopup: false,
                },
            });
            setShowAssignVariablePopup(undefined);
        }
    }, ref);
    const handleAddVariable = (0, react_1.useCallback)((value, varDetail) => {
        if (showAssignVariablePopup) {
            handleAddVariableInAddVariablePopupWithPosition(showAssignVariablePopup.nodeId, showAssignVariablePopup.variableAssignerNodeId, showAssignVariablePopup.variableAssignerNodeHandleId, value, varDetail);
        }
    }, [showAssignVariablePopup, handleAddVariableInAddVariablePopupWithPosition]);
    if (!showAssignVariablePopup)
        return null;
    return (<div className="absolute z-10" style={{
            left: showAssignVariablePopup.x,
            top: showAssignVariablePopup.y,
        }} ref={ref}>
      <add_variable_popup_1.default availableVars={availableVars} onSelect={handleAddVariable}/>
    </div>);
};
exports.default = (0, react_1.memo)(AddVariablePopupWithPosition);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLXZhcmlhYmxlLXBvcHVwLXdpdGgtcG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZGQtdmFyaWFibGUtcG9wdXAtd2l0aC1wb3NpdGlvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxtQ0FBcUM7QUFDckMsaUNBS2M7QUFDZCwwQ0FLdUI7QUFDdkIsMENBQXlDO0FBQ3pDLHlEQUFtRTtBQUNuRSx5REFBeUQ7QUFDekQsNkRBQW1EO0FBTW5ELE1BQU0sNEJBQTRCLEdBQUcsQ0FBQyxFQUNwQyxNQUFNLEVBQ04sUUFBUSxHQUMwQixFQUFFLEVBQUU7SUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBQSxjQUFNLEVBQWlCLElBQUksQ0FBQyxDQUFBO0lBQ3hDLE1BQU0sdUJBQXVCLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUE7SUFDeEUsTUFBTSwwQkFBMEIsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtJQUM5RSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxJQUFBLHlCQUFpQixHQUFFLENBQUE7SUFDcEQsTUFBTSxFQUFFLCtDQUErQyxFQUFFLEdBQUcsSUFBQSwyQkFBbUIsR0FBRSxDQUFBO0lBQ2pGLE1BQU0sVUFBVSxHQUFHLElBQUEscUJBQWEsR0FBRSxDQUFBO0lBQ2xDLE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxHQUFHLElBQUEsbUJBQVcsR0FBRSxDQUFBO0lBQ3BELE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxHQUFHLElBQUEsNEJBQW9CLEdBQUUsQ0FBQTtJQUV2RCxNQUFNLFVBQVUsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDOUIsSUFBSSxDQUFDLHVCQUF1QjtZQUMxQixPQUFPLEVBQUUsQ0FBQTtRQUVYLE1BQU0sWUFBWSxHQUFHLHVC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LElBQUksQ0FBQyx1QkFBdUI7UUFDMUIsT0FBTyxJQUFJLENBQUE7SUFFYixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLGVBQWUsQ0FDekIsS0FBSyxDQUFDLENBQUM7WUFDTCxJQUFJLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUMvQixHQUFHLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztTQUMvQixDQUFDLENBQ0YsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBRVQ7TUFBQSxDQUFDLDRCQUFnQixDQUNmLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUM3QixRQUFRLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUVoQztJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLElBQUEsWUFBSSxFQUFDLDRCQUE0QixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIFZhbHVlU2VsZWN0b3IsXG4gIFZhcixcbiAgVmFyVHlwZSxcbn0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyB1c2VDbGlja0F3YXkgfSBmcm9tICdhaG9va3MnXG5pbXBvcnQge1xuICBtZW1vLFxuICB1c2VDYWxsYmFjayxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIHVzZUlzQ2hhdE1vZGUsXG4gIHVzZU5vZGVEYXRhVXBkYXRlLFxuICB1c2VXb3JrZmxvdyxcbiAgdXNlV29ya2Zsb3dWYXJpYWJsZXMsXG59IGZyb20gJy4uLy4uLy4uL2hvb2tzJ1xuaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICcuLi8uLi8uLi9zdG9yZSdcbmltcG9ydCB7IHVzZVZhcmlhYmxlQXNzaWduZXIgfSBmcm9tICcuLi8uLi92YXJpYWJsZS1hc3NpZ25lci9ob29rcydcbmltcG9ydCB7IGZpbHRlclZhciB9IGZyb20gJy4uLy4uL3ZhcmlhYmxlLWFzc2lnbmVyL3V0aWxzJ1xuaW1wb3J0IEFkZFZhcmlhYmxlUG9wdXAgZnJvbSAnLi9hZGQtdmFyaWFibGUtcG9wdXAnXG5cbnR5cGUgQWRkVmFyaWFibGVQb3B1cFdpdGhQb3NpdGlvblByb3BzID0ge1xuICBub2RlSWQ6IHN0cmluZ1xuICBub2RlRGF0YTogYW55XG59XG5jb25zdCBBZGRWYXJpYWJsZVBvcHVwV2l0aFBvc2l0aW9uID0gKHtcbiAgbm9kZUlkLFxuICBub2RlRGF0YSxcbn06IEFkZFZhcmlhYmxlUG9wdXBXaXRoUG9zaXRpb25Qcm9wcykgPT4ge1xuICBjb25zdCByZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG4gIGNvbnN0IHNob3dBc3NpZ25WYXJpYWJsZVBvcHVwID0gdXNlU3RvcmUocyA9PiBzLnNob3dBc3NpZ25WYXJpYWJsZVBvcHVwKVxuICBjb25zdCBzZXRTaG93QXNzaWduVmFyaWFibGVQb3B1cCA9IHVzZVN0b3JlKHMgPT4gcy5zZXRTaG93QXNzaWduVmFyaWFibGVQb3B1cClcbiAgY29uc3QgeyBoYW5kbGVOb2RlRGF0YVVwZGF0ZSB9ID0gdXNlTm9kZURhdGFVcGRhdGUoKVxuICBjb25zdCB7IGhhbmRsZUFkZFZhcmlhYmxlSW5BZGRWYXJpYWJsZVBvcHVwV2l0aFBvc2l0aW9uIH0gPSB1c2VWYXJpYWJsZUFzc2lnbmVyKClcbiAgY29uc3QgaXNDaGF0TW9kZSA9IHVzZUlzQ2hhdE1vZGUoKVxuICBjb25zdCB7IGdldEJlZm9yZU5vZGVzSW5TYW1lQnJhbmNoIH0gPSB1c2VXb3JrZmxvdygpXG4gIGNvbnN0IHsgZ2V0Tm9kZUF2YWlsYWJsZVZhcnMgfSA9IHVzZVdvcmtmbG93VmFyaWFibGVzKClcblxuICBjb25zdCBvdXRwdXRUeXBlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFzaG93QXNzaWduVmFyaWFibGVQb3B1cClcbiAgICAgIHJldHVybiAnJ1xuXG4gICAgY29uc3QgZ3JvdXBFbmFibGVkID0gc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAudmFyaWFibGVBc3NpZ25lck5vZGVEYXRhLmFkdmFuY2VkX3NldHRpbmdzPy5ncm91cF9lbmFibGVkXG5cbiAgICBpZiAoIWdyb3VwRW5hYmxlZClcbiAgICAgIHJldHVybiBzaG93QXNzaWduVmFyaWFibGVQb3B1cC52YXJpYWJsZUFzc2lnbmVyTm9kZURhdGEub3V0cHV0X3R5cGVcblxuICAgIGNvbnN0IGdyb3VwID0gc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAudmFyaWFibGVBc3NpZ25lck5vZGVEYXRhLmFkdmFuY2VkX3NldHRpbmdzPy5ncm91cHMuZmluZChncm91cCA9PiBncm91cC5ncm91cElkID09PSBzaG93QXNzaWduVmFyaWFibGVQb3B1cC52YXJpYWJsZUFzc2lnbmVyTm9kZUhhbmRsZUlkKVxuICAgIHJldHVybiBncm91cD8ub3V0cHV0X3R5cGUgfHwgJydcbiAgfSwgW3Nob3dBc3NpZ25WYXJpYWJsZVBvcHVwXSlcbiAgY29uc3QgYXZhaWxhYmxlVmFycyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXApXG4gICAgICByZXR1cm4gW11cblxuICAgIHJldHVybiBnZXROb2RlQXZhaWxhYmxlVmFycyh7XG4gICAgICBwYXJlbnROb2RlOiBzaG93QXNzaWduVmFyaWFibGVQb3B1cC5wYXJlbnROb2RlLFxuICAgICAgYmVmb3JlTm9kZXM6IFtcbiAgICAgICAgLi4uZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2goc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAubm9kZUlkKSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBzaG93QXNzaWduVmFyaWFibGVQb3B1cC5ub2RlSWQsXG4gICAgICAgICAgZGF0YTogc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAubm9kZURhdGEsXG4gICAgICAgIH0gYXMgYW55LFxuICAgICAgXSxcbiAgICAgIGhpZGVFbnY6IHRydWUsXG4gICAgICBoaWRlQ2hhdFZhcjogIWlzQ2hhdE1vZGUsXG4gICAgICBpc0NoYXRNb2RlLFxuICAgICAgZmlsdGVyVmFyOiBmaWx0ZXJWYXIob3V0cHV0VHlwZSBhcyBWYXJUeXBlKSxcbiAgICB9KVxuICAgICAgLm1hcChub2RlID0+ICh7XG4gICAgICAgIC4uLm5vZGUsXG4gICAgICAgIHZhcnM6IG5vZGUuaXNTdGFydE5vZGUgPyBub2RlLnZhcnMuZmlsdGVyKHYgPT4gIXYudmFyaWFibGUuc3RhcnRzV2l0aCgnc3lzLicpKSA6IG5vZGUudmFycyxcbiAgICAgIH0pKVxuICAgICAgLmZpbHRlcihpdGVtID0+IGl0ZW0udmFycy5sZW5ndGggPiAwKVxuICB9LCBbc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAsIGdldE5vZGVBdmFpbGFibGVWYXJzLCBnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaCwgaXNDaGF0TW9kZSwgb3V0cHV0VHlwZV0pXG5cbiAgdXNlQ2xpY2tBd2F5KCgpID0+IHtcbiAgICBpZiAobm9kZURhdGEuX2hvbGRBZGRWYXJpYWJsZVBvcHVwKSB7XG4gICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICAgIGlkOiBub2RlSWQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBfaG9sZEFkZFZhcmlhYmxlUG9wdXA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICAgIGlkOiBub2RlSWQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBfc2hvd0FkZFZhcmlhYmxlUG9wdXA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIHNldFNob3dBc3NpZ25WYXJpYWJsZVBvcHVwKHVuZGVmaW5lZClcbiAgICB9XG4gIH0sIHJlZilcblxuICBjb25zdCBoYW5kbGVBZGRWYXJpYWJsZSA9IHVzZUNhbGxiYWNrKCh2YWx1ZTogVmFsdWVTZWxlY3RvciwgdmFyRGV0YWlsOiBWYXIpID0+IHtcbiAgICBpZiAoc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXApIHtcbiAgICAgIGhhbmRsZUFkZFZhcmlhYmxlSW5BZGRWYXJpYWJsZVBvcHVwV2l0aFBvc2l0aW9uKFxuICAgICAgICBzaG93QXNzaWduVmFyaWFibGVQb3B1cC5ub2RlSWQsXG4gICAgICAgIHNob3dBc3NpZ25WYXJpYWJsZVBvcHVwLnZhcmlhYmxlQXNzaWduZXJOb2RlSWQsXG4gICAgICAgIHNob3dBc3NpZ25WYXJpYWJsZVBvcHVwLnZhcmlhYmxlQXNzaWduZXJOb2RlSGFuZGxlSWQsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB2YXJEZXRhaWwsXG4gICAgICApXG4gICAgfVxuICB9LCBbc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAsIGhhbmRsZUFkZFZhcmlhYmxlSW5BZGRWYXJpYWJsZVBvcHVwV2l0aFBvc2l0aW9uXSlcblxuICBpZiAoIXNob3dBc3NpZ25WYXJpYWJsZVBvcHVwKVxuICAgIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB6LTEwXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGxlZnQ6IHNob3dBc3NpZ25WYXJpYWJsZVBvcHVwLngsXG4gICAgICAgIHRvcDogc2hvd0Fzc2lnblZhcmlhYmxlUG9wdXAueSxcbiAgICAgIH19XG4gICAgICByZWY9e3JlZn1cbiAgICA+XG4gICAgICA8QWRkVmFyaWFibGVQb3B1cFxuICAgICAgICBhdmFpbGFibGVWYXJzPXthdmFpbGFibGVWYXJzfVxuICAgICAgICBvblNlbGVjdD17aGFuZGxlQWRkVmFyaWFibGV9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oQWRkVmFyaWFibGVQb3B1cFdpdGhQb3NpdGlvbilcbiJdfQ==