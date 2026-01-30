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
            case 'related_id':
                return [
                    types_2.ComparisonOperator.is,
                    types_2.ComparisonOperator.isNot,
                    types_2.ComparisonOperator.contains,
                    types_2.ComparisonOperator.notContains,
                    types_2.ComparisonOperator.startWith,
                    types_2.ComparisonOperator.endWith,
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
        case types_1.VarType.integer:
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
            ];
        case types_1.VarType.file:
            return [
                types_2.ComparisonOperator.exists,
                types_2.ComparisonOperator.notExists,
            ];
        case types_1.VarType.arrayString:
        case types_1.VarType.arrayNumber:
        case types_1.VarType.arrayBoolean:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF3QkEsOEVBSUM7QUExQkQsMkRBQXlEO0FBQ3pELG1DQUE0QztBQUVyQyxNQUFNLHNCQUFzQixHQUFHLENBQUMsUUFBNEIsRUFBRSxFQUFFO0lBQ3JFLE9BQU8sQ0FBQywwQkFBa0IsQ0FBQyxLQUFLLEVBQUUsMEJBQWtCLENBQUMsUUFBUSxFQUFFLDBCQUFrQixDQUFDLE1BQU0sRUFBRSwwQkFBa0IsQ0FBQyxTQUFTLEVBQUUsMEJBQWtCLENBQUMsTUFBTSxFQUFFLDBCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyTSxDQUFDLENBQUE7QUFGWSxRQUFBLHNCQUFzQiwwQkFFbEM7QUFFRCxNQUFNLGVBQWUsR0FBRztJQUN0QiwwQkFBa0IsQ0FBQyxLQUFLO0lBQ3hCLDBCQUFrQixDQUFDLFFBQVE7SUFDM0IsMEJBQWtCLENBQUMsVUFBVTtJQUM3QiwwQkFBa0IsQ0FBQyxpQkFBaUI7SUFDcEMsMEJBQWtCLENBQUMsUUFBUTtJQUMzQiwwQkFBa0IsQ0FBQyxlQUFlO0NBQzFCLENBQUE7QUFRVixTQUFnQixpQ0FBaUMsQ0FBQyxRQUE2QjtJQUM3RSxJQUFJLENBQUMsUUFBUTtRQUNYLE9BQU8sS0FBSyxDQUFBO0lBQ2QsT0FBTyxDQUFFLGVBQWlELENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQy9FLENBQUM7QUFFTSxNQUFNLFlBQVksR0FBRyxDQUFDLElBQWMsRUFBRSxJQUFzQixFQUFFLEVBQUU7SUFDckUsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQTtJQUNyQixJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ1gsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQTtRQUVwQixRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ1osS0FBSyxNQUFNO2dC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TSxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssR0FBRyxDQUFDLEVBQUU7U0FDM0QsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBcEJZLFFBQUEsaUJBQWlCLHFCQW9CN0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEJyYW5jaCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEkxOG5LZXlzQnlQcmVmaXggfSBmcm9tICdAL3R5cGVzL2kxOG4nXG5pbXBvcnQgeyBWYXJUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IENvbXBhcmlzb25PcGVyYXRvciB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBpc0VtcHR5UmVsYXRlZE9wZXJhdG9yID0gKG9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IpID0+IHtcbiAgcmV0dXJuIFtDb21wYXJpc29uT3BlcmF0b3IuZW1wdHksIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSwgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTnVsbCwgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTm90TnVsbCwgQ29tcGFyaXNvbk9wZXJhdG9yLmV4aXN0cywgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEV4aXN0c10uaW5jbHVkZXMob3BlcmF0b3IpXG59XG5cbmNvbnN0IG5vdFRyYW5zbGF0ZUtleSA9IFtcbiAgQ29tcGFyaXNvbk9wZXJhdG9yLmVxdWFsLFxuICBDb21wYXJpc29uT3BlcmF0b3Iubm90RXF1YWwsXG4gIENvbXBhcmlzb25PcGVyYXRvci5sYXJnZXJUaGFuLFxuICBDb21wYXJpc29uT3BlcmF0b3IubGFyZ2VyVGhhbk9yRXF1YWwsXG4gIENvbXBhcmlzb25PcGVyYXRvci5sZXNzVGhhbixcbiAgQ29tcGFyaXNvbk9wZXJhdG9yLmxlc3NUaGFuT3JFcXVhbCxcbl0gYXMgY29uc3RcblxudHlwZSBOb3RUcmFuc2xhdGVPcGVyYXRvciA9IHR5cGVvZiBub3RUcmFuc2xhdGVLZXlbbnVtYmVyXVxuZXhwb3J0IHR5cGUgVHJhbnNsYXRhYmxlQ29tcGFyaXNvbk9wZXJhdG9yID0gRXhjbHVkZTxDb21wYXJpc29uT3BlcmF0b3IsIE5vdFRyYW5zbGF0ZU9wZXJhdG9yPlxuZXhwb3J0IHR5cGUgSWZFbHNlT3B0aW9uTmFtZSA9IEkxOG5LZXlzQnlQcmVmaXg8J3dvcmtmbG93JywgJ25vZGVzLmlmRWxzZS5vcHRpb25OYW1lLic+XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbXBhcmlzb25PcGVyYXRvck5lZWRUcmFuc2xhdGUob3BlcmF0b3I6IENvbXBhcmlzb25PcGVyYXRvcik6IG9wZXJhdG9yIGlzIFRyYW5zbGF0YWJsZUNvbXBhcmlzb25PcGVyYXRvclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcGFyaXNvbk9wZXJhdG9yTmVlZFRyYW5zbGF0ZShvcGVyYXRvcj86IENvbXBhcmlzb25PcGVyYXRvcik6IG9wZXJhdG9yIGlzIFRyYW5zbGF0YWJsZUNvbXBhcmlzb25PcGVyYXRvclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcGFyaXNvbk9wZXJhdG9yTmVlZFRyYW5zbGF0ZShvcGVyYXRvcj86IENvbXBhcmlzb25PcGVyYXRvcik6IG9wZXJhdG9yIGlzIFRyYW5zbGF0YWJsZUNvbXBhcmlzb25PcGVyYXRvciB7XG4gIGlmICghb3BlcmF0b3IpXG4gICAgcmV0dXJuIGZhbHNlXG4gIHJldHVybiAhKG5vdFRyYW5zbGF0ZUtleSBhcyByZWFkb25seSBDb21wYXJpc29uT3BlcmF0b3JbXSkuaW5jbHVkZXMob3BlcmF0b3IpXG59XG5cbmV4cG9ydCBjb25zdCBnZXRPcGVyYXRvcnMgPSAodHlwZT86IFZhclR5cGUsIGZpbGU/OiB7IGtleTogc3RyaW5nIH0pID0+IHtcbiAgY29uc3QgaXNGaWxlID0gISFmaWxlXG4gIGlmIChpc0ZpbGUpIHtcbiAgICBjb25zdCB7IGtleSB9ID0gZmlsZVxuXG4gICAgc3dpdGNoIChrZXkpIHtcbiAgICAgIGNhc2UgJ25hbWUnOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5jb250YWlucyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90Q29udGFpbnMsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLnN0YXJ0V2l0aCxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZW5kV2l0aCxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXMsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTm90LFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksXG4gICAgICAgIF1cbiAgICAgIGNhc2UgJ3R5cGUnOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pbixcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90SW4sXG4gICAgICAgIF1cbiAgICAgIGNhc2UgJ3NpemUnOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5sYXJnZXJUaGFuLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5sYXJnZXJUaGFuT3JFcXVhbCxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IubGVzc1RoYW4sXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmxlc3NUaGFuT3JFcXVhbCxcbiAgICAgICAgXVxuICAgICAgY2FzZSAnZXh0ZW5zaW9uJzpcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXMsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTm90LFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5jb250YWlucyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90Q29udGFpbnMsXG4gICAgICAgIF1cbiAgICAgIGNhc2UgJ21pbWVfdHlwZSc6XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmNvbnRhaW5zLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RDb250YWlucyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iuc3RhcnRXaXRoLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbmRXaXRoLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pcyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3QsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSxcbiAgICAgICAgXVxuICAgICAgY2FzZSAndHJhbnNmZXJfbWV0aG9kJzpcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaW4sXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEluLFxuICAgICAgICBdXG4gICAgICBjYXNlICd1cmwnOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5jb250YWlucyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90Q29udGFpbnMsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLnN0YXJ0V2l0aCxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZW5kV2l0aCxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXMsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTm90LFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksXG4gICAgICAgIF1cbiAgICAgIGNhc2UgJ3JlbGF0ZWRfaWQnOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pcyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3QsXG4gICAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmNvbnRhaW5zLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RDb250YWlucyxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iuc3RhcnRXaXRoLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbmRXaXRoLFxuICAgICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksXG4gICAgICAgIF1cbiAgICB9XG4gICAgcmV0dXJuIFtdXG4gIH1cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBWYXJUeXBlLnN0cmluZzpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5jb250YWlucyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdENvbnRhaW5zLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iuc3RhcnRXaXRoLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZW5kV2l0aCxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3QsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgXVxuICAgIGNhc2UgVmFyVHlwZS5udW1iZXI6XG4gICAgY2FzZSBWYXJUeXBlLmludGVnZXI6XG4gICAgICByZXR1cm4gW1xuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZXF1YWwsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFcXVhbCxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmxhcmdlclRoYW4sXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5sZXNzVGhhbixcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmxhcmdlclRoYW5PckVxdWFsLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IubGVzc1RoYW5PckVxdWFsLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZW1wdHksXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSxcbiAgICAgIF1cbiAgICBjYXNlIFZhclR5cGUuYm9vbGVhbjpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5pcyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzTm90LFxuICAgICAgXVxuICAgIGNhc2UgVmFyVHlwZS5maWxlOlxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmV4aXN0cyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEV4aXN0cyxcbiAgICAgIF1cbiAgICBjYXNlIFZhclR5cGUuYXJyYXlTdHJpbmc6XG4gICAgY2FzZSBWYXJUeXBlLmFycmF5TnVtYmVyOlxuICAgIGNhc2UgVmFyVHlwZS5hcnJheUJvb2xlYW46XG4gICAgICByZXR1cm4gW1xuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuY29udGFpbnMsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RDb250YWlucyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmVtcHR5LFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3Iubm90RW1wdHksXG4gICAgICBdXG4gICAgY2FzZSBWYXJUeXBlLmFycmF5OlxuICAgIGNhc2UgVmFyVHlwZS5hcnJheU9iamVjdDpcbiAgICAgIHJldHVybiBbXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgXVxuICAgIGNhc2UgVmFyVHlwZS5hcnJheUZpbGU6XG4gICAgICByZXR1cm4gW1xuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuY29udGFpbnMsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RDb250YWlucyxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmFsbE9mLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuZW1wdHksXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5ub3RFbXB0eSxcbiAgICAgIF1cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLmlzLFxuICAgICAgICBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3QsXG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvci5lbXB0eSxcbiAgICAgICAgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LFxuICAgICAgXVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBjb21wYXJpc29uT3BlcmF0b3JOb3RSZXF1aXJlVmFsdWUgPSAob3BlcmF0b3I/OiBDb21wYXJpc29uT3BlcmF0b3IpID0+IHtcbiAgaWYgKCFvcGVyYXRvcilcbiAgICByZXR1cm4gZmFsc2VcblxuICByZXR1cm4gW0NvbXBhcmlzb25PcGVyYXRvci5lbXB0eSwgQ29tcGFyaXNvbk9wZXJhdG9yLm5vdEVtcHR5LCBDb21wYXJpc29uT3BlcmF0b3IuaXNOdWxsLCBDb21wYXJpc29uT3BlcmF0b3IuaXNOb3ROdWxsLCBDb21wYXJpc29uT3BlcmF0b3IuZXhpc3RzLCBDb21wYXJpc29uT3BlcmF0b3Iubm90RXhpc3RzXS5pbmNsdWRlcyhvcGVyYXRvcilcbn1cblxuZXhwb3J0IGNvbnN0IGJyYW5jaE5hbWVDb3JyZWN0ID0gKGJyYW5jaGVzOiBCcmFuY2hbXSkgPT4ge1xuICBjb25zdCBicmFuY2hMZW5ndGggPSBicmFuY2hlcy5sZW5ndGhcbiAgaWYgKGJyYW5jaExlbmd0aCA8IDIpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpZi1lbHNlIG5vZGUgYnJhbmNoIG51bWJlciBtdXN0IHRoYW4gMicpXG5cbiAgaWYgKGJyYW5jaExlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiBicmFuY2hlcy5tYXAoKGJyYW5jaCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYnJhbmNoLFxuICAgICAgICBuYW1lOiBicmFuY2guaWQgPT09ICdmYWxzZScgPyAnRUxTRScgOiAnSUYnLFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gYnJhbmNoZXMubWFwKChicmFuY2gsIGluZGV4KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmJyYW5jaCxcbiAgICAgIG5hbWU6IGJyYW5jaC5pZCA9PT0gJ2ZhbHNlJyA/ICdFTFNFJyA6IGBDQVNFICR7aW5kZXggKyAxfWAsXG4gICAgfVxuICB9KVxufVxuIl19