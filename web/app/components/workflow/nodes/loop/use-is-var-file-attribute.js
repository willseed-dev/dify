"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const hooks_1 = require("../../hooks");
const types_1 = require("../../types");
const useIsVarFileAttribute = ({ nodeId, }) => {
    const isChatMode = (0, hooks_1.useIsChatMode)();
    const { getBeforeNodesInSameBranch } = (0, hooks_1.useWorkflow)();
    const availableNodes = (0, react_1.useMemo)(() => {
        return getBeforeNodesInSameBranch(nodeId);
    }, [getBeforeNodesInSameBranch, nodeId]);
    const { getCurrentVariableType } = (0, hooks_1.useWorkflowVariables)();
    const getIsVarFileAttribute = (variable) => {
        if (variable.length !== 3)
            return false;
        const parentVariable = variable.slice(0, 2);
        const varType = getCurrentVariableType({
            valueSelector: parentVariable,
            availableNodes,
            isChatMode,
            isConstant: false,
        });
        return varType === types_1.VarType.file;
    };
    return {
        getIsVarFileAttribute,
    };
};
exports.default = useIsVarFileAttribute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWlzLXZhci1maWxlLWF0dHJpYnV0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1pcy12YXItZmlsZS1hdHRyaWJ1dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBK0I7QUFDL0IsdUNBQThFO0FBQzlFLHVDQUFxQztBQUtyQyxNQUFNLHFCQUFxQixHQUFHLENBQUMsRUFDN0IsTUFBTSxHQUNDLEVBQUUsRUFBRTtJQUNYLE1BQU0sVUFBVSxHQUFHLElBQUEscUJBQWEsR0FBRSxDQUFBO0lBQ2xDLE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxHQUFHLElBQUEsbUJBQVcsR0FBRSxDQUFBO0lBQ3BELE1BQU0sY0FBYyxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUNsQyxPQUFPLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNDLENBQUMsRUFBRSxDQUFDLDBCQUEwQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDeEMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsSUFBQSw0QkFBb0IsR0FBRSxDQUFBO0lBQ3pELE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxRQUF1QixFQUFFLEVBQUU7UUFDeEQsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDdkIsT0FBTyxLQUFLLENBQUE7UUFDZCxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQyxNQUFNLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQztZQUNyQyxhQUFhLEVBQUUsY0FBYztZQUM3QixjQUFjO1lBQ2QsVUFBVTtZQUNWLFVBQVUsRUFBRSxLQUFLO1NBQ2xCLENBQUMsQ0FBQTtRQUNGLE9BQU8sT0FBTyxLQUFLLGVBQU8sQ0FBQyxJQUFJLENBQUE7SUFDakMsQ0FBQyxDQUFBO0lBQ0QsT0FBTztRQUNMLHFCQUFxQjtLQUN0QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUscUJBQXFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFZhbHVlU2VsZWN0b3IgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUlzQ2hhdE1vZGUsIHVzZVdvcmtmbG93LCB1c2VXb3JrZmxvd1ZhcmlhYmxlcyB9IGZyb20gJy4uLy4uL2hvb2tzJ1xuaW1wb3J0IHsgVmFyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuXG50eXBlIFBhcmFtcyA9IHtcbiAgbm9kZUlkOiBzdHJpbmdcbn1cbmNvbnN0IHVzZUlzVmFyRmlsZUF0dHJpYnV0ZSA9ICh7XG4gIG5vZGVJZCxcbn06IFBhcmFtcykgPT4ge1xuICBjb25zdCBpc0NoYXRNb2RlID0gdXNlSXNDaGF0TW9kZSgpXG4gIGNvbnN0IHsgZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2ggfSA9IHVzZVdvcmtmbG93KClcbiAgY29uc3QgYXZhaWxhYmxlTm9kZXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2gobm9kZUlkKVxuICB9LCBbZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2gsIG5vZGVJZF0pXG4gIGNvbnN0IHsgZ2V0Q3VycmVudFZhcmlhYmxlVHlwZSB9ID0gdXNlV29ya2Zsb3dWYXJpYWJsZXMoKVxuICBjb25zdCBnZXRJc1ZhckZpbGVBdHRyaWJ1dGUgPSAodmFyaWFibGU6IFZhbHVlU2VsZWN0b3IpID0+IHtcbiAgICBpZiAodmFyaWFibGUubGVuZ3RoICE9PSAzKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgY29uc3QgcGFyZW50VmFyaWFibGUgPSB2YXJpYWJsZS5zbGljZSgwLCAyKVxuICAgIGNvbnN0IHZhclR5cGUgPSBnZXRDdXJyZW50VmFyaWFibGVUeXBlKHtcbiAgICAgIHZhbHVlU2VsZWN0b3I6IHBhcmVudFZhcmlhYmxlLFxuICAgICAgYXZhaWxhYmxlTm9kZXMsXG4gICAgICBpc0NoYXRNb2RlLFxuICAgICAgaXNDb25zdGFudDogZmFsc2UsXG4gICAgfSlcbiAgICByZXR1cm4gdmFyVHlwZSA9PT0gVmFyVHlwZS5maWxlXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXRJc1ZhckZpbGVBdHRyaWJ1dGUsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlSXNWYXJGaWxlQXR0cmlidXRlXG4iXX0=