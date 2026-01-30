"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const types_3 = require("../../types");
const types_4 = require("./types");
const utils_2 = require("./utils");
const i18nPrefix = 'errorMsg';
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.Logic,
    sort: 1,
    type: types_2.BlockEnum.IfElse,
    helpLinkUri: 'ifelse',
});
const nodeDefault = {
    metaData,
    defaultValue: {
        _targetBranches: [
            {
                id: 'true',
                name: 'IF',
            },
            {
                id: 'false',
                name: 'ELSE',
            },
        ],
        cases: [
            {
                case_id: 'true',
                logical_operator: types_4.LogicalOperator.and,
                conditions: [],
            },
        ],
    },
    checkValid(payload, t) {
        let errorMessages = '';
        const { cases } = payload;
        if (!cases || cases.length === 0)
            errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: 'IF' });
        cases.forEach((caseItem, index) => {
            if (!caseItem.conditions.length)
                errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: index === 0 ? 'IF' : 'ELIF' });
            caseItem.conditions.forEach((condition) => {
                if (!errorMessages && (!condition.variable_selector || condition.variable_selector.length === 0))
                    errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}.fields.variable`, { ns: 'workflow' }) });
                if (!errorMessages && !condition.comparison_operator)
                    errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.ifElse.operator', { ns: 'workflow' }) });
                if (!errorMessages) {
                    if (condition.sub_variable_condition) {
                        const isSet = condition.sub_variable_condition.conditions.every((c) => {
                            if (!c.comparison_operator)
                                return false;
                            if ((0, utils_2.isEmptyRelatedOperator)(c.comparison_operator))
                                return true;
                            return (c.varType === types_3.VarType.boolean || c.varType === types_3.VarType.arrayBoolean) ? c.value === undefined : !!c.value;
                        });
                        if (!isSet)
                            errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}.fields.variableValue`, { ns: 'workflow' }) });
                    }
                    else {
                        if (!(0, utils_2.isEmptyRelatedOperator)(condition.comparison_operator) && ((condition.varType === types_3.VarType.boolean || condition.varType === types_3.VarType.arrayBoolean) ? condition.value === undefined : !condition.value))
                            errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}.fields.variableValue`, { ns: 'workflow' }) });
                    }
                }
            });
        });
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUNqRSx1Q0FBcUM7QUFDckMsbUNBQXlDO0FBQ3pDLG1DQUFnRDtBQUVoRCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFFN0IsTUFBTSxRQUFRLEdBQUcsSUFBQSx1QkFBZSxFQUFDO0lBQy9CLGNBQWMsRUFBRSwrQkFBdUIsQ0FBQyxLQUFLO0lBQzdDLElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFTLENBQUMsTUFBTTtJQUN0QixXQUFXLEVBQUUsUUFBUTtDQUN0QixDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBZ0M7SUFDL0MsUUFBUTtJQUNSLFlBQVksRUFBRTtRQUNaLGVBQWUsRUFBRTtZQUNmO2dCQUNFLEVBQUUsRUFBRSxNQUFNO2dCQUNWLElBQUksRUFBRSxJQUFJO2FBQ1g7WUFDRDtnQkFDRSxFQUFFLEVBQUUsT0FBTztnQkFDWCxJQUFJLEVBQUUsTUFBTTthQUNiO1NBQ0Y7UUFDRCxLQUFLLEVBQUU7WUFDTDtnQkFDRSxPQUFPLEVBQUUsTUFBTTtnQkFDZixnQkFBZ0IsRUFBRSx1QkFBZSxDQUFDLEdBQUc7Z0JBQ3JDLFVBQVUsRUFBRSxFQUFFO2FBQ2Y7U0FDRjtLQUNGO0lBQ0QsVUFBVSxDQUFDLE9BQXVCLEVBQUUsQ0FBTTtRQUN4QyxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUE7UUFDdEIsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQTtRQUN6QixJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUM5QixhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFD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QkFBdUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQkFDNUksQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU87WUFDTCxPQUFPLEVBQUUsQ0FBQyxhQUFhO1lBQ3ZCLFlBQVksRUFBRSxhQUFhO1NBQzVCLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZURlZmF1bHQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgSWZFbHNlTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdlbk5vZGVNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG5pbXBvcnQgeyBWYXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBMb2dpY2FsT3BlcmF0b3IgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgaXNFbXB0eVJlbGF0ZWRPcGVyYXRvciB9IGZyb20gJy4vdXRpbHMnXG5cbmNvbnN0IGkxOG5QcmVmaXggPSAnZXJyb3JNc2cnXG5cbmNvbnN0IG1ldGFEYXRhID0gZ2VuTm9kZU1ldGFEYXRhKHtcbiAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLkxvZ2ljLFxuICBzb3J0OiAxLFxuICB0eXBlOiBCbG9ja0VudW0uSWZFbHNlLFxuICBoZWxwTGlua1VyaTogJ2lmZWxzZScsXG59KVxuY29uc3Qgbm9kZURlZmF1bHQ6IE5vZGVEZWZhdWx0PElmRWxzZU5vZGVUeXBlPiA9IHtcbiAgbWV0YURhdGEsXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIF90YXJnZXRCcmFuY2hlczogW1xuICAgICAge1xuICAgICAgICBpZDogJ3RydWUnLFxuICAgICAgICBuYW1lOiAnSUYnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdmYWxzZScsXG4gICAgICAgIG5hbWU6ICdFTFNFJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjYXNlczogW1xuICAgICAge1xuICAgICAgICBjYXNlX2lkOiAndHJ1ZScsXG4gICAgICAgIGxvZ2ljYWxfb3BlcmF0b3I6IExvZ2ljYWxPcGVyYXRvci5hbmQsXG4gICAgICAgIGNvbmRpdGlvbnM6IFtdLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBjaGVja1ZhbGlkKHBheWxvYWQ6IElmRWxzZU5vZGVUeXBlLCB0OiBhbnkpIHtcbiAgICBsZXQgZXJyb3JNZXNzYWdlcyA9ICcnXG4gICAgY29uc3QgeyBjYXNlcyB9ID0gcGF5bG9hZFxuICAgIGlmICghY2FzZXMgfHwgY2FzZXMubGVuZ3RoID09PSAwKVxuICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH0uZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiAnSUYnIH0pXG5cbiAgICBjYXNlcy5mb3JFYWNoKChjYXNlSXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGlmICghY2FzZUl0ZW0uY29uZGl0aW9ucy5sZW5ndGgpXG4gICAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9LmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogaW5kZXggPT09IDAgPyAnSUYnIDogJ0VMSUYnIH0pXG5cbiAgICAgIGNhc2VJdGVtLmNvbmRpdGlvbnMuZm9yRWFjaCgoY29uZGl0aW9uKSA9PiB7XG4gICAgICAgIGlmICghZXJyb3JNZXNzYWdlcyAmJiAoIWNvbmRpdGlvbi52YXJpYWJsZV9zZWxlY3RvciB8fCBjb25kaXRpb24udmFyaWFibGVfc2VsZWN0b3IubGVuZ3RoID09PSAwKSlcbiAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoYCR7aTE4blByZWZpeH0uZmllbGRzLnZhcmlhYmxlYCwgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgICAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgIWNvbmRpdGlvbi5jb21wYXJpc29uX29wZXJhdG9yKVxuICAgICAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9LmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdCgnbm9kZXMuaWZFbHNlLm9wZXJhdG9yJywgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgICAgICBpZiAoIWVycm9yTWVzc2FnZXMpIHtcbiAgICAgICAgICBpZiAoY29uZGl0aW9uLnN1Yl92YXJpYWJsZV9jb25kaXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGlzU2V0ID0gY29uZGl0aW9uLnN1Yl92YXJpYWJsZV9jb25kaXRpb24uY29uZGl0aW9ucy5ldmVyeSgoYykgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWMuY29tcGFyaXNvbl9vcGVyYXRvcilcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICAgICAgICBpZiAoaXNFbXB0eVJlbGF0ZWRPcGVyYXRvcihjLmNvbXBhcmlzb25fb3BlcmF0b3IhKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAgICAgICAgIHJldHVybiAoYy52YXJUeXBlID09PSBWYXJUeXBlLmJvb2xlYW4gfHwgYy52YXJUeXBlID09PSBWYXJUeXBlLmFycmF5Qm9vbGVhbikgPyBjLnZhbHVlID09PSB1bmRlZmluZWQgOiAhIWMudmFsdWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoIWlzU2V0KVxuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoYCR7aTE4blByZWZpeH0uZmllbGRzLnZhcmlhYmxlVmFsdWVgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFpc0VtcHR5UmVsYXRlZE9wZXJhdG9yKGNvbmRpdGlvbi5jb21wYXJpc29uX29wZXJhdG9yISkgJiYgKChjb25kaXRpb24udmFyVHlwZSA9PT0gVmFyVHlwZS5ib29sZWFuIHx8IGNvbmRpdGlvbi52YXJUeXBlID09PSBWYXJUeXBlLmFycmF5Qm9vbGVhbikgPyBjb25kaXRpb24udmFsdWUgPT09IHVuZGVmaW5lZCA6ICFjb25kaXRpb24udmFsdWUpKVxuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoYCR7aTE4blByZWZpeH0uZmllbGRzLnZhcmlhYmxlVmFsdWVgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6ICFlcnJvck1lc3NhZ2VzLFxuICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2VzLFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbm9kZURlZmF1bHRcbiJdfQ==