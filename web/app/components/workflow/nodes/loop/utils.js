"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchNameCorrect = exports.comparisonOperatorNotRequireValue = exports.getOperators = exports.isEmptyRelatedOperator = void 0;
exports.isComparisonOperatorNeedTranslate = isComparisonOperatorNeedTranslate;
const types_1 = require("@/app/components/workflow/types");
const types_2 = require("./types");
const isEmptyRelatedOperator = (operator) => {
    return [types_2.ComparisonOperator.empty, types_2.ComparisonOperator.notEmpty, types_2.ComparisonOperator.isNull, types_2.ComparisonOperator.isNotNull, types_2.ComparisonOperator.exists, types_2.ComparisonOperator.notExists].includes(operator);
};
exports.isEmptyRelatedOperator = isEmptyRelatedOperator;
const notTranslateKey = [
    types_2.ComparisonOperator.equal,
    types_2.ComparisonOperator.notEqual,
    types_2.ComparisonOperator.largerThan,
    types_2.ComparisonOperator.largerThanOrEqual,
    types_2.ComparisonOperator.lessThan,
    types_2.ComparisonOperator.lessThanOrEqual,
];
function isComparisonOperatorNeedTranslate(operator) {
    if (!operator)
        return false;
    return !notTranslateKey.includes(operator);
}
const getOperators = (type, file) => {
    const isFile = !!file;
    if (isFile) {
        const { key } = file;
        switch (key) {
            case 'name':
                return [
                    types_2.ComparisonOperator.contains,
                    types_2.ComparisonOperator.notContains,
                    types_2.ComparisonOperator.startWith,
                    types_2.ComparisonOperator.endWith,
                    types_2.ComparisonOperator.is,
                    types_2.ComparisonOperator.isNot,
                    types_2.ComparisonOperator.empty,
                    types_2.ComparisonOperator.notEmpty,
                ];
            case 'type':
                return [
                    types_2.ComparisonOperator.in,
                    types_2.ComparisonOperator.notIn,
                ];
            case 'size':
                return [
                    types_2.ComparisonOperator.largerThan,
                    types_2.ComparisonOperator.largerThanOrEqual,
                    types_2.ComparisonOperator.lessThan,
                    types_2.ComparisonOperator.lessThanOrEqual,
                ];
            case 'extension':
                return [
                    types_2.ComparisonOperator.is,
                    types_2.ComparisonOperator.isNot,
                    types_2.ComparisonOperator.contains,
                    types_2.ComparisonOperator.notContains,
                ];
            case 'mime_type':
                return [
                    types_2.ComparisonOperator.contains,
                    types_2.ComparisonOperator.notContains,
                    types_2.ComparisonOperator.startWith,
                    types_2.ComparisonOperator.endWith,
                    types_2.ComparisonOperator.is,
                    types_2.ComparisonOperator.isNot,
                    types_2.ComparisonOperator.empty,
                    types_2.ComparisonOperator.notEmpty,
                ];
            case 'transfer_method':
                return [
                    types_2.ComparisonOperator.in,
                    types_2.ComparisonOperator.notIn,
                ];
            case 'url':
                return [
                    types_2.ComparisonOperator.contains,
                    types_2.ComparisonOperator.notContains,
                    types_2.ComparisonOperator.startWith,
                    types_2.ComparisonOperator.endWith,
                    types_2.ComparisonOperator.is,
                    types_2.ComparisonOperator.isNot,
                    types_2.ComparisonOperator.empty,
                    types_2.ComparisonOperator.notEmpty,
                ];
        }
        return [];
    }
    switch (type) {
        case types_1.VarType.string:
            return [
                types_2.ComparisonOperator.contains,
                types_2.ComparisonOperator.notContains,
                types_2.ComparisonOperator.startWith,
                types_2.ComparisonOperator.endWith,
                types_2.ComparisonOperator.is,
                types_2.ComparisonOperator.isNot,
                types_2.ComparisonOperator.empty,
                types_2.ComparisonOperator.notEmpty,
            ];
        case types_1.VarType.number:
            return [
                types_2.ComparisonOperator.equal,
                types_2.ComparisonOperator.notEqual,
                types_2.ComparisonOperator.largerThan,
                types_2.ComparisonOperator.lessThan,
                types_2.ComparisonOperator.largerThanOrEqual,
                types_2.ComparisonOperator.lessThanOrEqual,
                types_2.ComparisonOperator.empty,
                types_2.ComparisonOperator.notEmpty,
            ];
        case types_1.VarType.boolean:
            return [
                types_2.ComparisonOperator.is,
                types_2.ComparisonOperator.isNot,
                types_2.ComparisonOperator.empty,
                types_2.ComparisonOperator.notEmpty,
            ];
        case types_1.VarType.object:
            return [
                types_2.ComparisonOperator.empty,
                types_2.ComparisonOperator.notEmpty,
            ];
        case types_1.VarType.file:
            return [
                types_2.ComparisonOperator.exists,
                types_2.ComparisonOperator.notExists,
            ];
        case types_1.VarType.arrayString:
        case types_1.VarType.arrayNumber:
            return [
                types_2.ComparisonOperator.contains,
                types_2.ComparisonOperator.notContains,
                types_2.ComparisonOperator.empty,
                types_2.ComparisonOperator.notEmpty,
            ];
        case types_1.VarType.array:
        case types_1.VarType.arrayObject:
            return [
                types_2.ComparisonOperator.empty,
                types_2.ComparisonOperator.notEmpty,
            ];
        case types_1.VarType.arrayFile:
            return [
                types_2.ComparisonOperator.contains,
                types_2.ComparisonOperator.notContains,
                types_2.ComparisonOperator.allOf,
                types_2.ComparisonOperator.empty,
                types_2.ComparisonOperator.notEmpty,
            ];
        default:
            return [
                types_2.ComparisonOperator.is,
                types_2.ComparisonOperator.isNot,
                types_2.ComparisonOperator.empty,
                types_2.ComparisonOperator.notEmpty,
            ];
    }
};
exports.getOperators = getOperators;
const comparisonOperatorNotRequireValue = (operator) => {
    if (!operator)
        return false;
    return [types_2.ComparisonOperator.empty, types_2.ComparisonOperator.notEmpty, types_2.ComparisonOperator.isNull, types_2.ComparisonOperator.isNotNull, types_2.ComparisonOperator.exists, types_2.ComparisonOperator.notExists].includes(operator);
};
exports.comparisonOperatorNotRequireValue = comparisonOperatorNotRequireValue;
const branchNameCorrect = (branches) => {
    const branchLength = branches.length;
    if (branchLength < 2)
        throw new Error('if-else node branch number must than 2');
    if (branchLength === 2) {
        return branches.map((branch) => {
            return {
                ...branch,
                name: branch.id === 'false' ? 'ELSE' : 'IF',
            };
        });
    }
    return branches.map((branch, index) => {
        return {
            ...branch,
            name: branch.id === 'false' ? 'ELSE' : `CASE ${index + 1}`,
        };
    });
};
exports.branchNameCorrect = branchNameCorrect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFzQkEsOEVBSUM7QUF6QkQsMkRBQXlEO0FBQ3pELG1DQUE0QztBQUVyQyxNQUFNLHNCQUFzQixHQUFHLENBQUMsUUFBNEIsRUFBRSxFQUFFO0lBQ3JFLE9BQU8sQ0FBQywwQkFBa0IsQ0FBQyxLQUFLLEVBQUUsMEJBQWtCLENBQUMsUUFBUSxFQUFFLDBCQUFrQixDQUFDLE1BQU0sRUFBRSwwQkFBa0IsQ0FBQyxTQUFTLEVBQUUsMEJBQWtCLENBQUMsTUFBTSxFQUFFLDBCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyTSxDQUFDLENBQUE7QUFGWSxRQUFBLHNCQUFzQiwwQkFFbEM7QUFFRCxNQUFNLGVBQWUsR0FBRztJQUN0QiwwQkFBa0IsQ0FBQyxLQUFLO0lBQ3hCLDBCQUFrQixDQUFDLFFBQVE7SUFDM0IsMEJBQWtCLENBQUMsVUFBVTtJQUM3QiwwQkFBa0IsQ0FBQyxpQkFBaUI7SUFDcEMsMEJBQWtCLENBQUMsUUFBUTtJQUMzQiwwQkFBa0IsQ0FBQyxlQUFlO0NBQzFCLENBQUE7QUFPVixTQUFnQixpQ0FBaUMsQ0FBQyxRQUE2QjtJQUM3RSxJQUFJLENBQUMsUUFBUTtRQUNYLE9BQU8sS0FBSyxDQUFBO0lBQ2QsT0FBTyxDQUFFLGVBQWlELENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQy9FLENBQUM7QUFFTSxNQUFNLFlBQVksR0FBRyxDQUFDLElBQWMsRUFBRSxJQUFzQixFQUFFLEVBQUU7SUFDckUsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQTtJQUNyQixJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ1gsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQTtRQUVwQixRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ1osS0FBSyxNQUFNO2dC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cmFuY2ggfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgVmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBDb21wYXJpc29uT3BlcmF0b3IgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgaXNFbXB0eVJlbGF0ZWRPcGVyYXRvciA9IChvcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yKSA9PiB7XG4gIHJldHVybiBbQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LCBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksIENvbXBhcmlzb25PcGVyYXRvci5pc051bGwsIENvbXBhcmlzb25PcGVyYXRvci5pc05vdE51bGwsIENvbXBhcmlzb25PcGVyYXRvci5leGlzdHMsIENvbXBhcmlzb25PcGVyYXRvci5ub3RFeGlzdHNdLmluY2x1ZGVzKG9wZXJhdG9yKVxufVxuXG5jb25zdCBub3RUcmFuc2xhdGVLZXkgPSBbXG4gIENvbXBhcmlzb25PcGVyYXRvci5lcXVhbCxcbiAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVxdWFsLFxuICBDb21wYXJpc29uT3BlcmF0b3IubGFyZ2VyVGhhbixcbiAgQ29tcGFyaXNvbk9wZXJhdG9yLmxhcmdlclRoYW5PckVxdWFsLFxuICBDb21wYXJpc29uT3BlcmF0b3IubGVzc1RoYW4sXG4gIENvbXBhcmlzb25PcGVyYXRvci5sZXNzVGhhbk9yRXF1YWwsXG5dIGFzIGNvbnN0XG5cbnR5cGUgTm90VHJhbnNsYXRlT3BlcmF0b3IgPSB0eXBlb2Ygbm90VHJhbnNsYXRlS2V5W251bWJlcl1cbmV4cG9ydCB0eXBlIFRyYW5zbGF0YWJsZUNvbXBhcmlzb25PcGVyYXRvciA9IEV4Y2x1ZGU8Q29tcGFyaXNvbk9wZXJhdG9yLCBOb3RUcmFuc2xhdGVPcGVyYXRvcj5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcGFyaXNvbk9wZXJhdG9yTmVlZFRyYW5zbGF0ZShvcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yKTogb3BlcmF0b3IgaXMgVHJhbnNsYXRhYmxlQ29tcGFyaXNvbk9wZXJhdG9yXG5leHBvcnQgZnVuY3Rpb24gaXNDb21wYXJpc29uT3BlcmF0b3JOZWVkVHJhbnNsYXRlKG9wZXJhdG9yPzogQ29tcGFyaXNvbk9wZXJhdG9yKTogb3BlcmF0b3IgaXMgVHJhbnNsYXRhYmxlQ29tcGFyaXNvbk9wZXJhdG9yXG5leHBvcnQgZnVuY3Rpb24gaXNDb21wYXJpc29uT3BlcmF0b3JOZWVkVHJhbnNsYXRlKG9wZXJhdG9yPzogQ29tcGFyaXNvbk9wZXJhdG9yKTogb3BlcmF0b3IgaXMgVHJhbnNsYXRhYmxlQ29tcGFyaXNvbk9wZXJhdG9yIHtcbiAgaWYgKCFvcGVyYXRvcilcbiAgICByZXR1cm4gZmFsc2VcbiAgcmV0dXJuICEobm90VHJhbnNsYXRlS2V5IGFzIHJlYWRvbmx5IENvbXBhcmlzb25PcGVyYXRvcltdKS5pbmNsdWRlcyhvcGVyYXRvcilcbn1cblxuZXhwb3J0IGNvbnN0IGdldE9wZXJhdG9ycyA9ICh0eXBlPzogVmFyVHlwZSwgZmlsZT86IHsga2V5OiBzdHJpbmcgfSkgPT4ge1xuICBjb25zdCBpc0ZpbGUgPSAhIWZpbGVcbiAgaWYgKGlzRmlsZSkge1xuICAgIGNvbnN0IHsga2V5IH0gPSBmaWxlXG5cbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmNvbnRhaW5zLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RDb250YWlucyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iuc3RhcnRXaXRoLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbmRXaXRoLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pcyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3QsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSxcbiAgICAgICAgXVxuICAgICAgY2FzZSAndHlwZSc6XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmluLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RJbixcbiAgICAgICAgXVxuICAgICAgY2FzZSAnc2l6ZSc6XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmxhcmdlclRoYW4sXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmxhcmdlclRoYW5PckVxdWFsLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5sZXNzVGhhbixcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IubGVzc1RoYW5PckVxdWFsLFxuICAgICAgICBdXG4gICAgICBjYXNlICdleHRlbnNpb24nOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pcyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3QsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmNvbnRhaW5zLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RDb250YWlucyxcbiAgICAgICAgXVxuICAgICAgY2FzZSAnbWltZV90eXBlJzpcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuY29udGFpbnMsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdENvbnRhaW5zLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5zdGFydFdpdGgsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVuZFdpdGgsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pc05vdCxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZW1wdHksXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgICBdXG4gICAgICBjYXNlICd0cmFuc2Zlcl9tZXRob2QnOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pbixcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90SW4sXG4gICAgICAgIF1cbiAgICAgIGNhc2UgJ3VybCc6XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmNvbnRhaW5zLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RDb250YWlucyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iuc3RhcnRXaXRoLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbmRXaXRoLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pcyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3QsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSxcbiAgICAgICAgXVxuICAgIH1cbiAgICByZXR1cm4gW11cbiAgfVxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFZhclR5cGUuc3RyaW5nOlxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmNvbnRhaW5zLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90Q29udGFpbnMsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5zdGFydFdpdGgsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbmRXaXRoLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXMsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pc05vdCxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksXG4gICAgICBdXG4gICAgY2FzZSBWYXJUeXBlLm51bWJlcjpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lcXVhbCxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVxdWFsLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IubGFyZ2VyVGhhbixcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmxlc3NUaGFuLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IubGFyZ2VyVGhhbk9yRXF1YWwsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5sZXNzVGhhbk9yRXF1YWwsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgXVxuICAgIGNhc2UgVmFyVHlwZS5ib29sZWFuOlxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3QsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgXVxuICAgIGNhc2UgVmFyVHlwZS5vYmplY3Q6XG4gICAgICByZXR1cm4gW1xuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZW1wdHksXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSxcbiAgICAgIF1cbiAgICBjYXNlIFZhclR5cGUuZmlsZTpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5leGlzdHMsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFeGlzdHMsXG4gICAgICBdXG4gICAgY2FzZSBWYXJUeXBlLmFycmF5U3RyaW5nOlxuICAgIGNhc2UgVmFyVHlwZS5hcnJheU51bWJlcjpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5jb250YWlucyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdENvbnRhaW5zLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZW1wdHksXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSxcbiAgICAgIF1cbiAgICBjYXNlIFZhclR5cGUuYXJyYXk6XG4gICAgY2FzZSBWYXJUeXBlLmFycmF5T2JqZWN0OlxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksXG4gICAgICBdXG4gICAgY2FzZSBWYXJUeXBlLmFycmF5RmlsZTpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5jb250YWlucyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdENvbnRhaW5zLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuYWxsT2YsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgXVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gW1xuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXMsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pc05vdCxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksXG4gICAgICBdXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbXBhcmlzb25PcGVyYXRvck5vdFJlcXVpcmVWYWx1ZSA9IChvcGVyYXRvcj86IENvbXBhcmlzb25PcGVyYXRvcikgPT4ge1xuICBpZiAoIW9wZXJhdG9yKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHJldHVybiBbQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LCBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksIENvbXBhcmlzb25PcGVyYXRvci5pc051bGwsIENvbXBhcmlzb25PcGVyYXRvci5pc05vdE51bGwsIENvbXBhcmlzb25PcGVyYXRvci5leGlzdHMsIENvbXBhcmlzb25PcGVyYXRvci5ub3RFeGlzdHNdLmluY2x1ZGVzKG9wZXJhdG9yKVxufVxuXG5leHBvcnQgY29uc3QgYnJhbmNoTmFtZUNvcnJlY3QgPSAoYnJhbmNoZXM6IEJyYW5jaFtdKSA9PiB7XG4gIGNvbnN0IGJyYW5jaExlbmd0aCA9IGJyYW5jaGVzLmxlbmd0aFxuICBpZiAoYnJhbmNoTGVuZ3RoIDwgMilcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2lmLWVsc2Ugbm9kZSBicmFuY2ggbnVtYmVyIG11c3QgdGhhbiAyJylcblxuICBpZiAoYnJhbmNoTGVuZ3RoID09PSAyKSB7XG4gICAgcmV0dXJuIGJyYW5jaGVzLm1hcCgoYnJhbmNoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5icmFuY2gsXG4gICAgICAgIG5hbWU6IGJyYW5jaC5pZCA9PT0gJ2ZhbHNlJyA/ICdFTFNFJyA6ICdJRicsXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBicmFuY2hlcy5tYXAoKGJyYW5jaCwgaW5kZXgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uYnJhbmNoLFxuICAgICAgbmFtZTogYnJhbmNoLmlkID09PSAnZmFsc2UnID8gJ0VMU0UnIDogYENBU0UgJHtpbmRleCArIDF9YCxcbiAgICB9XG4gIH0pXG59XG4iXX0=