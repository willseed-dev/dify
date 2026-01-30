"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConditionValueAsString = exports.findVariableWhenOnLLMVision = void 0;
const types_1 = require("@/app/components/workflow/types");
const findVariableWhenOnLLMVision = (valueSelector, availableVars) => {
    const currentVariableNode = availableVars.find((availableVar) => {
        if (valueSelector[0] === 'sys' && availableVar.isStartNode)
            return true;
        return valueSelector[0] === availableVar.nodeId;
    });
    const currentVariable = currentVariableNode?.vars.find((variable) => {
        if (valueSelector[0] === 'sys' && variable.variable === `sys.${valueSelector[1]}`)
            return true;
        return variable.variable === valueSelector[1];
    });
    let formType = '';
    if (currentVariable?.type === 'array[file]')
        formType = types_1.InputVarType.multiFiles;
    if (currentVariable?.type === 'file')
        formType = types_1.InputVarType.singleFile;
    return currentVariable && {
        ...currentVariable,
        formType,
    };
};
exports.findVariableWhenOnLLMVision = findVariableWhenOnLLMVision;
const getConditionValueAsString = (condition) => {
    if (Array.isArray(condition.value))
        return condition.value[0] ?? '';
    if (typeof condition.value === 'number')
        return String(condition.value);
    return condition.value ?? '';
};
exports.getConditionValueAsString = getConditionValueAsString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSwyREFBOEQ7QUFFdkQsTUFBTSwyQkFBMkIsR0FBRyxDQUFDLGFBQTRCLEVBQUUsYUFBOEIsRUFBRSxFQUFFO0lBQzFHLE1BQU0sbUJBQW1CLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO1FBQzlELElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxZQUFZLENBQUMsV0FBVztZQUN4RCxPQUFPLElBQUksQ0FBQTtRQUViLE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxNQUFNLENBQUE7SUFDakQsQ0FBQyxDQUFDLENBQUE7SUFDRixNQUFNLGVBQWUsR0FBRyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDbEUsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEtBQUssT0FBTyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDL0UsT0FBTyxJQUFJLENBQUE7UUFDYixPQUFPLFFBQVEsQ0FBQyxRQUFRLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQy9DLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFBO0lBQ2pCLElBQUksZUFBZSxFQUFFLElBQUksS0FBSyxhQUFhO1FBQ3pDLFFBQVEsR0FBRyxvQkFBWSxDQUFDLFVBQVUsQ0FBQTtJQUNwQyxJQUFJLGVBQWUsRUFBRSxJQUFJLEtBQUssTUFBTTtRQUNsQyxRQUFRLEdBQUcsb0JBQVksQ0FBQyxVQUFVLENBQUE7SUFFcEMsT0FBTyxlQUFlLElBQUk7UUFDeEIsR0FBRyxlQUFlO1FBQ2xCLFFBQVE7S0FDVCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBdkJZLFFBQUEsMkJBQTJCLCtCQXVCdkM7QUFFTSxNQUFNLHlCQUF5QixHQUFHLENBQUMsU0FBeUIsRUFBRSxFQUFFO0lBQ3JFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ2hDLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7SUFFakMsSUFBSSxPQUFPLFNBQVMsQ0FBQyxLQUFLLEtBQUssUUFBUTtRQUNyQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFaEMsT0FBTyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQTtBQUM5QixDQUFDLENBQUE7QUFSWSxRQUFBLHlCQUF5Qiw2QkFRckMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIE5vZGVPdXRQdXRWYXIsXG4gIFZhbHVlU2VsZWN0b3IsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBJbnB1dFZhclR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgZmluZFZhcmlhYmxlV2hlbk9uTExNVmlzaW9uID0gKHZhbHVlU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IsIGF2YWlsYWJsZVZhcnM6IE5vZGVPdXRQdXRWYXJbXSkgPT4ge1xuICBjb25zdCBjdXJyZW50VmFyaWFibGVOb2RlID0gYXZhaWxhYmxlVmFycy5maW5kKChhdmFpbGFibGVWYXIpID0+IHtcbiAgICBpZiAodmFsdWVTZWxlY3RvclswXSA9PT0gJ3N5cycgJiYgYXZhaWxhYmxlVmFyLmlzU3RhcnROb2RlKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiB2YWx1ZVNlbGVjdG9yWzBdID09PSBhdmFpbGFibGVWYXIubm9kZUlkXG4gIH0pXG4gIGNvbnN0IGN1cnJlbnRWYXJpYWJsZSA9IGN1cnJlbnRWYXJpYWJsZU5vZGU/LnZhcnMuZmluZCgodmFyaWFibGUpID0+IHtcbiAgICBpZiAodmFsdWVTZWxlY3RvclswXSA9PT0gJ3N5cycgJiYgdmFyaWFibGUudmFyaWFibGUgPT09IGBzeXMuJHt2YWx1ZVNlbGVjdG9yWzFdfWApXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiB2YXJpYWJsZS52YXJpYWJsZSA9PT0gdmFsdWVTZWxlY3RvclsxXVxuICB9KVxuXG4gIGxldCBmb3JtVHlwZSA9ICcnXG4gIGlmIChjdXJyZW50VmFyaWFibGU/LnR5cGUgPT09ICdhcnJheVtmaWxlXScpXG4gICAgZm9ybVR5cGUgPSBJbnB1dFZhclR5cGUubXVsdGlGaWxlc1xuICBpZiAoY3VycmVudFZhcmlhYmxlPy50eXBlID09PSAnZmlsZScpXG4gICAgZm9ybVR5cGUgPSBJbnB1dFZhclR5cGUuc2luZ2xlRmlsZVxuXG4gIHJldHVybiBjdXJyZW50VmFyaWFibGUgJiYge1xuICAgIC4uLmN1cnJlbnRWYXJpYWJsZSxcbiAgICBmb3JtVHlwZSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0Q29uZGl0aW9uVmFsdWVBc1N0cmluZyA9IChjb25kaXRpb246IHsgdmFsdWU6IGFueSB9KSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KGNvbmRpdGlvbi52YWx1ZSkpXG4gICAgcmV0dXJuIGNvbmRpdGlvbi52YWx1ZVswXSA/PyAnJ1xuXG4gIGlmICh0eXBlb2YgY29uZGl0aW9uLnZhbHVlID09PSAnbnVtYmVyJylcbiAgICByZXR1cm4gU3RyaW5nKGNvbmRpdGlvbi52YWx1ZSlcblxuICByZXR1cm4gY29uZGl0aW9uLnZhbHVlID8/ICcnXG59XG4iXX0=