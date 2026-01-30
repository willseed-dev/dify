"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExceptionVariable = exports.variableTransformer = void 0;
const _1 = require(".");
const variableTransformer = (v) => {
    if (typeof v === 'string')
        return v.replace(/^\{\{#|#\}\}$/g, '').split('.');
    return `{{#${v.join('.')}#}}`;
};
exports.variableTransformer = variableTransformer;
const isExceptionVariable = (variable, nodeType) => {
    return (variable === 'error_message' || variable === 'error_type') && (0, _1.hasErrorHandleNode)(nodeType);
};
exports.isExceptionVariable = isExceptionVariable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YXJpYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSx3QkFBc0M7QUFFL0IsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLENBQXlCLEVBQUUsRUFBRTtJQUMvRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFDdkIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUVuRCxPQUFPLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFBO0FBQy9CLENBQUMsQ0FBQTtBQUxZLFFBQUEsbUJBQW1CLHVCQUsvQjtBQUVNLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxRQUFnQixFQUFFLFFBQW9CLEVBQUUsRUFBRTtJQUM1RSxPQUFPLENBQUMsUUFBUSxLQUFLLGVBQWUsSUFBSSxRQUFRLEtBQUssWUFBWSxDQUFDLElBQUksSUFBQSxxQkFBa0IsRUFBQyxRQUFRLENBQUMsQ0FBQTtBQUNwRyxDQUFDLENBQUE7QUFGWSxRQUFBLG1CQUFtQix1QkFFL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIEJsb2NrRW51bSxcbiAgVmFsdWVTZWxlY3Rvcixcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBoYXNFcnJvckhhbmRsZU5vZGUgfSBmcm9tICcuJ1xuXG5leHBvcnQgY29uc3QgdmFyaWFibGVUcmFuc2Zvcm1lciA9ICh2OiBWYWx1ZVNlbGVjdG9yIHwgc3RyaW5nKSA9PiB7XG4gIGlmICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpXG4gICAgcmV0dXJuIHYucmVwbGFjZSgvXlxce1xceyN8I1xcfVxcfSQvZywgJycpLnNwbGl0KCcuJylcblxuICByZXR1cm4gYHt7IyR7di5qb2luKCcuJyl9I319YFxufVxuXG5leHBvcnQgY29uc3QgaXNFeGNlcHRpb25WYXJpYWJsZSA9ICh2YXJpYWJsZTogc3RyaW5nLCBub2RlVHlwZT86IEJsb2NrRW51bSkgPT4ge1xuICByZXR1cm4gKHZhcmlhYmxlID09PSAnZXJyb3JfbWVzc2FnZScgfHwgdmFyaWFibGUgPT09ICdlcnJvcl90eXBlJykgJiYgaGFzRXJyb3JIYW5kbGVOb2RlKG5vZGVUeXBlKVxufVxuIl19