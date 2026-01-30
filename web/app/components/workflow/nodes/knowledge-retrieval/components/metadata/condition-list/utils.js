"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_VARIABLE_REGEX = exports.VARIABLE_REGEX = exports.comparisonOperatorNotRequireValue = exports.getOperators = exports.isEmptyRelatedOperator = void 0;
exports.isComparisonOperatorNeedTranslate = isComparisonOperatorNeedTranslate;
const types_1 = require("@/app/components/workflow/nodes/knowledge-retrieval/types");
const isEmptyRelatedOperator = (operator) => {
    return [types_1.ComparisonOperator.empty, types_1.ComparisonOperator.notEmpty, types_1.ComparisonOperator.isNull, types_1.ComparisonOperator.isNotNull, types_1.ComparisonOperator.exists, types_1.ComparisonOperator.notExists].includes(operator);
};
exports.isEmptyRelatedOperator = isEmptyRelatedOperator;
const notTranslateKey = [
    types_1.ComparisonOperator.equal,
    types_1.ComparisonOperator.notEqual,
    types_1.ComparisonOperator.largerThan,
    types_1.ComparisonOperator.largerThanOrEqual,
    types_1.ComparisonOperator.lessThan,
    types_1.ComparisonOperator.lessThanOrEqual,
];
function isComparisonOperatorNeedTranslate(operator) {
    if (!operator)
        return false;
    return !notTranslateKey.includes(operator);
}
const getOperators = (type) => {
    switch (type) {
        case types_1.MetadataFilteringVariableType.string:
        case types_1.MetadataFilteringVariableType.select:
            return [
                types_1.ComparisonOperator.is,
                types_1.ComparisonOperator.isNot,
                types_1.ComparisonOperator.contains,
                types_1.ComparisonOperator.notContains,
                types_1.ComparisonOperator.startWith,
                types_1.ComparisonOperator.endWith,
                types_1.ComparisonOperator.empty,
                types_1.ComparisonOperator.notEmpty,
                types_1.ComparisonOperator.in,
                types_1.ComparisonOperator.notIn,
            ];
        case types_1.MetadataFilteringVariableType.number:
            return [
                types_1.ComparisonOperator.equal,
                types_1.ComparisonOperator.notEqual,
                types_1.ComparisonOperator.largerThan,
                types_1.ComparisonOperator.lessThan,
                types_1.ComparisonOperator.largerThanOrEqual,
                types_1.ComparisonOperator.lessThanOrEqual,
                types_1.ComparisonOperator.empty,
                types_1.ComparisonOperator.notEmpty,
            ];
        default:
            return [
                types_1.ComparisonOperator.is,
                types_1.ComparisonOperator.before,
                types_1.ComparisonOperator.after,
                types_1.ComparisonOperator.empty,
                types_1.ComparisonOperator.notEmpty,
            ];
    }
};
exports.getOperators = getOperators;
const comparisonOperatorNotRequireValue = (operator) => {
    if (!operator)
        return false;
    return [types_1.ComparisonOperator.empty, types_1.ComparisonOperator.notEmpty, types_1.ComparisonOperator.isNull, types_1.ComparisonOperator.isNotNull, types_1.ComparisonOperator.exists, types_1.ComparisonOperator.notExists].includes(operator);
};
exports.comparisonOperatorNotRequireValue = comparisonOperatorNotRequireValue;
exports.VARIABLE_REGEX = /\{\{(#[\w-]{1,50}(\.[a-z_]\w{0,29}){1,10}#)\}\}/gi;
exports.COMMON_VARIABLE_REGEX = /\{\{([\w-]{1,50})\}\}/g;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF1QkEsOEVBSUM7QUEzQkQscUZBR2tFO0FBRTNELE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxRQUE0QixFQUFFLEVBQUU7SUFDckUsT0FBTyxDQUFDLDBCQUFrQixDQUFDLEtBQUssRUFBRSwwQkFBa0IsQ0FBQyxRQUFRLEVBQUUsMEJBQWtCLENBQUMsTUFBTSxFQUFFLDBCQUFrQixDQUFDLFNBQVMsRUFBRSwwQkFBa0IsQ0FBQyxNQUFNLEVBQUUsMEJBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JNLENBQUMsQ0FBQTtBQUZZLFFBQUEsc0JBQXNCLDBCQUVsQztBQUVELE1BQU0sZUFBZSxHQUFHO0lBQ3RCLDBCQUFrQixDQUFDLEtBQUs7SUFDeEIsMEJBQWtCLENBQUMsUUFBUTtJQUMzQiwwQkFBa0IsQ0FBQyxVQUFVO0lBQzdCLDBCQUFrQixDQUFDLGlCQUFpQjtJQUNwQywwQkFBa0IsQ0FBQyxRQUFRO0lBQzNCLDBCQUFrQixDQUFDLGVBQWU7Q0FDMUIsQ0FBQTtBQU9WLFNBQWdCLGlDQUFpQyxDQUFDLFFBQTZCO0lBQzdFLElBQUksQ0FBQyxRQUFRO1FBQ1gsT0FBTyxLQUFLLENBQUE7SUFDZCxPQUFPLENBQUUsZUFBaUQsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDL0UsQ0FBQztBQUVNLE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBb0MsRUFBRSxFQUFFO0lBQ25FLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDYixLQUFLLHFDQUE2QixDQUFDLE1BQU0sQ0FBQztRQUMxQyxLQUFLLHFDQUE2QixDQUFDLE1BQU07WUFDdkMsT0FBTztnQkFDTCwwQkFBa0IsQ0FBQyxFQUFFO2dCQUNyQiwwQkFBa0IsQ0FBQyxLQUFLO2dCQUN4QiwwQkFBa0IsQ0FBQyxRQUFRO2dCQUMzQiwwQkFBa0IsQ0FBQyxXQUFXO2dCQUM5QiwwQkFBa0IsQ0FBQyxTQUFTO2dCQUM1QiwwQkFBa0IsQ0FBQyxPQUFPO2dCQUMxQiwwQkFBa0IsQ0FBQyxLQUFLO2dCQUN4QiwwQkFBa0IsQ0FBQyxRQUFRO2dCQUMzQiwwQkFBa0IsQ0FBQyxFQUFFO2dCQUNyQiwwQkFBa0IsQ0FBQyxLQUFLO2FBQ3pCLENBQUE7UUFDSCxLQUFLLHFDQUE2QixDQUFDLE1BQU07WUFDdkMsT0FBTztnQkFDTCwwQkFBa0IsQ0FBQyxLQUFLO2dCQUN4QiwwQkFBa0IsQ0FBQyxRQUFRO2dCQUMzQiwwQkFBa0IsQ0FBQyxVQUFVO2dCQUM3QiwwQkFBa0IsQ0FBQyxRQUFRO2dCQUMzQiwwQkFBa0IsQ0FBQyxpQkFBaUI7Z0JBQ3BDLDBCQUFrQixDQUFDLGVBQWU7Z0JBQ2xDLDBCQUFrQixDQUFDLEtBQUs7Z0JBQ3hCLDBCQUFrQixDQUFDLFFBQVE7YUFDNUIsQ0FBQTtRQUNIO1lBQ0UsT0FBTztnQkFDTCwwQkFBa0IsQ0FBQyxFQUFFO2dCQUNyQiwwQkFBa0IsQ0FBQyxNQUFNO2dCQUN6QiwwQkFBa0IsQ0FBQyxLQUFLO2dCQUN4QiwwQkFBa0IsQ0FBQyxLQUFLO2dCQUN4QiwwQkFBa0IsQ0FBQyxRQUFRO2FBQzVCLENBQUE7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBcENZLFFBQUEsWUFBWSxnQkFvQ3hCO0FBRU0sTUFBTSxpQ0FBaUMsR0FBRyxDQUFDLFFBQTZCLEVBQUUsRUFBRTtJQUNqRixJQUFJLENBQUMsUUFBUTtRQUNYLE9BQU8sS0FBSyxDQUFBO0lBRWQsT0FBTyxDQUFDLDBCQUFrQixDQUFDLEtBQUssRUFBRSwwQkFBa0IsQ0FBQyxRQUFRLEVBQUUsMEJBQWtCLENBQUMsTUFBTSxFQUFFLDBCQUFrQixDQUFDLFNBQVMsRUFBRSwwQkFBa0IsQ0FBQyxNQUFNLEVBQUUsMEJBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JNLENBQUMsQ0FBQTtBQUxZLFFBQUEsaUNBQWlDLHFDQUs3QztBQUVZLFFBQUEsY0FBYyxHQUFHLG1EQUFtRCxDQUFBO0FBQ3BFLFFBQUEscUJBQXFCLEdBQUcsd0JBQXdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wYXJpc29uT3BlcmF0b3IsXG4gIE1ldGFkYXRhRmlsdGVyaW5nVmFyaWFibGVUeXBlLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBpc0VtcHR5UmVsYXRlZE9wZXJhdG9yID0gKG9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IpID0+IHtcbiAgcmV0dXJuIFtDb21wYXJpc29uT3BlcmF0b3IuZW1wdHksIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSwgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTnVsbCwgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTm90TnVsbCwgQ29tcGFyaXNvbk9wZXJhdG9yLmV4aXN0cywgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEV4aXN0c10uaW5jbHVkZXMob3BlcmF0b3IpXG59XG5cbmNvbnN0IG5vdFRyYW5zbGF0ZUtleSA9IFtcbiAgQ29tcGFyaXNvbk9wZXJhdG9yLmVxdWFsLFxuICBDb21wYXJpc29uT3BlcmF0b3Iubm90RXF1YWwsXG4gIENvbXBhcmlzb25PcGVyYXRvci5sYXJnZXJUaGFuLFxuICBDb21wYXJpc29uT3BlcmF0b3IubGFyZ2VyVGhhbk9yRXF1YWwsXG4gIENvbXBhcmlzb25PcGVyYXRvci5sZXNzVGhhbixcbiAgQ29tcGFyaXNvbk9wZXJhdG9yLmxlc3NUaGFuT3JFcXVhbCxcbl0gYXMgY29uc3RcblxudHlwZSBOb3RUcmFuc2xhdGVPcGVyYXRvciA9IHR5cGVvZiBub3RUcmFuc2xhdGVLZXlbbnVtYmVyXVxuZXhwb3J0IHR5cGUgVHJhbnNsYXRhYmxlQ29tcGFyaXNvbk9wZXJhdG9yID0gRXhjbHVkZTxDb21wYXJpc29uT3BlcmF0b3IsIE5vdFRyYW5zbGF0ZU9wZXJhdG9yPlxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb21wYXJpc29uT3BlcmF0b3JOZWVkVHJhbnNsYXRlKG9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IpOiBvcGVyYXRvciBpcyBUcmFuc2xhdGFibGVDb21wYXJpc29uT3BlcmF0b3JcbmV4cG9ydCBmdW5jdGlvbiBpc0NvbXBhcmlzb25PcGVyYXRvck5lZWRUcmFuc2xhdGUob3BlcmF0b3I/OiBDb21wYXJpc29uT3BlcmF0b3IpOiBvcGVyYXRvciBpcyBUcmFuc2xhdGFibGVDb21wYXJpc29uT3BlcmF0b3JcbmV4cG9ydCBmdW5jdGlvbiBpc0NvbXBhcmlzb25PcGVyYXRvck5lZWRUcmFuc2xhdGUob3BlcmF0b3I/OiBDb21wYXJpc29uT3BlcmF0b3IpOiBvcGVyYXRvciBpcyBUcmFuc2xhdGFibGVDb21wYXJpc29uT3BlcmF0b3Ige1xuICBpZiAoIW9wZXJhdG9yKVxuICAgIHJldHVybiBmYWxzZVxuICByZXR1cm4gIShub3RUcmFuc2xhdGVLZXkgYXMgcmVhZG9ubHkgQ29tcGFyaXNvbk9wZXJhdG9yW10pLmluY2x1ZGVzKG9wZXJhdG9yKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0T3BlcmF0b3JzID0gKHR5cGU/OiBNZXRhZGF0YUZpbHRlcmluZ1ZhcmlhYmxlVHlwZSkgPT4ge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIE1ldGFkYXRhRmlsdGVyaW5nVmFyaWFibGVUeXBlLnN0cmluZzpcbiAgICBjYXNlIE1ldGFkYXRhRmlsdGVyaW5nVmFyaWFibGVUeXBlLnNlbGVjdDpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pcyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTm90LFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuY29udGFpbnMsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RDb250YWlucyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLnN0YXJ0V2l0aCxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVuZFdpdGgsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaW4sXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RJbixcbiAgICAgIF1cbiAgICBjYXNlIE1ldGFkYXRhRmlsdGVyaW5nVmFyaWFibGVUeXBlLm51bWJlcjpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lcXVhbCxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVxdWFsLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IubGFyZ2VyVGhhbixcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmxlc3NUaGFuLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IubGFyZ2VyVGhhbk9yRXF1YWwsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5sZXNzVGhhbk9yRXF1YWwsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgXVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gW1xuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXMsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5iZWZvcmUsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5hZnRlcixcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksXG4gICAgICBdXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbXBhcmlzb25PcGVyYXRvck5vdFJlcXVpcmVWYWx1ZSA9IChvcGVyYXRvcj86IENvbXBhcmlzb25PcGVyYXRvcikgPT4ge1xuICBpZiAoIW9wZXJhdG9yKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHJldHVybiBbQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LCBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksIENvbXBhcmlzb25PcGVyYXRvci5pc051bGwsIENvbXBhcmlzb25PcGVyYXRvci5pc05vdE51bGwsIENvbXBhcmlzb25PcGVyYXRvci5leGlzdHMsIENvbXBhcmlzb25PcGVyYXRvci5ub3RFeGlzdHNdLmluY2x1ZGVzKG9wZXJhdG9yKVxufVxuXG5leHBvcnQgY29uc3QgVkFSSUFCTEVfUkVHRVggPSAvXFx7XFx7KCNbXFx3LV17MSw1MH0oXFwuW2Etel9dXFx3ezAsMjl9KXsxLDEwfSMpXFx9XFx9L2dpXG5leHBvcnQgY29uc3QgQ09NTU9OX1ZBUklBQkxFX1JFR0VYID0gL1xce1xceyhbXFx3LV17MSw1MH0pXFx9XFx9L2dcbiJdfQ==