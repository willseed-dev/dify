"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const types_3 = require("../../types");
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.Transform,
    sort: 3,
    type: types_2.BlockEnum.VariableAggregator,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        output_type: types_3.VarType.any,
        variables: [],
    },
    checkValid(payload, t) {
        let errorMessages = '';
        const { variables, advanced_settings } = payload;
        const { group_enabled = false, groups = [] } = advanced_settings || {};
        // enable group
        const validateVariables = (variables, field) => {
            variables.forEach((variable) => {
                if (!variable || variable.length === 0)
                    errorMessages = t('errorMsg.fieldRequired', { ns: 'workflow', field: t(field, { ns: 'workflow' }) });
            });
        };
        if (group_enabled) {
            if (!groups || groups.length === 0) {
                errorMessages = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('nodes.variableAssigner.title', { ns: 'workflow' }) });
            }
            else if (!errorMessages) {
                groups.forEach((group) => {
                    validateVariables(group.variables || [], 'errorMsg.fields.variableValue');
                });
            }
        }
        else {
            if (!variables || variables.length === 0)
                errorMessages = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('nodes.variableAssigner.title', { ns: 'workflow' }) });
            else if (!errorMessages)
                validateVariables(variables, 'errorMsg.fields.variableValue');
        }
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUNqRSx1Q0FBcUM7QUFFckMsTUFBTSxRQUFRLEdBQUcsSUFBQSx1QkFBZSxFQUFDO0lBQy9CLGNBQWMsRUFBRSwrQkFBdUIsQ0FBQyxTQUFTO0lBQ2pELElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFTLENBQUMsa0JBQWtCO0NBQ25DLENBQUMsQ0FBQTtBQUNGLE1BQU0sV0FBVyxHQUEwQztJQUN6RCxRQUFRO0lBQ1IsWUFBWSxFQUFFO1FBQ1osV0FBVyxFQUFFLGVBQU8sQ0FBQyxHQUFHO1FBQ3hCLFNBQVMsRUFBRSxFQUFFO0tBQ2Q7SUFDRCxVQUFVLENBQUMsT0FBaUMsRUFBRSxDQUFNO1FBQ2xELElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQTtRQUN0QixNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsT0FBTyxDQUFBO1FBQ2hELE1BQU0sRUFBRSxhQUFhLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsR0FBRyxpQkFBaUIsSUFBSSxFQUFFLENBQUE7UUFDdEUsZUFBZTtRQUNmLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxTQUFnQixFQUFFLEtBQXNDLEVBQUUsRUFBRTtZQUNyRixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDO29CQUNwQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN4RyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQTtRQUVELElBQUksYUFBYSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNuQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLDhCQUE4QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQy9ILENBQUM7aUJBQ0ksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3ZCLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksRUFBRSxFQUFFLCtCQUErQixDQUFDLENBQUE7Z0JBQzNFLENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztRQUNILENBQUM7YUFDSSxDQUFDO1lBQ0osSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUM7Z0JBQ3RDLGFBQWEsR0FBRyxDQUFDLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsOEJBQThCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7aUJBQzFILElBQUksQ0FBQyxhQUFhO2dCQUNyQixpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsK0JBQStCLENBQUMsQ0FBQTtRQUNqRSxDQUFDO1FBRUQsT0FBTztZQUNMLE9BQU8sRUFBRSxDQUFDLGFBQWE7WUFDdkIsWUFBWSxFQUFFLGFBQWE7U0FDNUIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb2RlRGVmYXVsdCB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBWYXJpYWJsZUFzc2lnbmVyTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdlbk5vZGVNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG5pbXBvcnQgeyBWYXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmNvbnN0IG1ldGFEYXRhID0gZ2VuTm9kZU1ldGFEYXRhKHtcbiAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLlRyYW5zZm9ybSxcbiAgc29ydDogMyxcbiAgdHlwZTogQmxvY2tFbnVtLlZhcmlhYmxlQWdncmVnYXRvcixcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8VmFyaWFibGVBc3NpZ25lck5vZGVUeXBlPiA9IHtcbiAgbWV0YURhdGEsXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIG91dHB1dF90eXBlOiBWYXJUeXBlLmFueSxcbiAgICB2YXJpYWJsZXM6IFtdLFxuICB9LFxuICBjaGVja1ZhbGlkKHBheWxvYWQ6IFZhcmlhYmxlQXNzaWduZXJOb2RlVHlwZSwgdDogYW55KSB7XG4gICAgbGV0IGVycm9yTWVzc2FnZXMgPSAnJ1xuICAgIGNvbnN0IHsgdmFyaWFibGVzLCBhZHZhbmNlZF9zZXR0aW5ncyB9ID0gcGF5bG9hZFxuICAgIGNvbnN0IHsgZ3JvdXBfZW5hYmxlZCA9IGZhbHNlLCBncm91cHMgPSBbXSB9ID0gYWR2YW5jZWRfc2V0dGluZ3MgfHwge31cbiAgICAvLyBlbmFibGUgZ3JvdXBcbiAgICBjb25zdCB2YWxpZGF0ZVZhcmlhYmxlcyA9ICh2YXJpYWJsZXM6IGFueVtdLCBmaWVsZDogJ2Vycm9yTXNnLmZpZWxkcy52YXJpYWJsZVZhbHVlJykgPT4ge1xuICAgICAgdmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlKSA9PiB7XG4gICAgICAgIGlmICghdmFyaWFibGUgfHwgdmFyaWFibGUubGVuZ3RoID09PSAwKVxuICAgICAgICAgIGVycm9yTWVzc2FnZXMgPSB0KCdlcnJvck1zZy5maWVsZFJlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoZmllbGQsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGdyb3VwX2VuYWJsZWQpIHtcbiAgICAgIGlmICghZ3JvdXBzIHx8IGdyb3Vwcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoJ2Vycm9yTXNnLmZpZWxkUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdCgnbm9kZXMudmFyaWFibGVBc3NpZ25lci50aXRsZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFlcnJvck1lc3NhZ2VzKSB7XG4gICAgICAgIGdyb3Vwcy5mb3JFYWNoKChncm91cCkgPT4ge1xuICAgICAgICAgIHZhbGlkYXRlVmFyaWFibGVzKGdyb3VwLnZhcmlhYmxlcyB8fCBbXSwgJ2Vycm9yTXNnLmZpZWxkcy52YXJpYWJsZVZhbHVlJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoIXZhcmlhYmxlcyB8fCB2YXJpYWJsZXMubGVuZ3RoID09PSAwKVxuICAgICAgICBlcnJvck1lc3NhZ2VzID0gdCgnZXJyb3JNc2cuZmllbGRSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCdub2Rlcy52YXJpYWJsZUFzc2lnbmVyLnRpdGxlJywgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgICAgZWxzZSBpZiAoIWVycm9yTWVzc2FnZXMpXG4gICAgICAgIHZhbGlkYXRlVmFyaWFibGVzKHZhcmlhYmxlcywgJ2Vycm9yTXNnLmZpZWxkcy52YXJpYWJsZVZhbHVlJylcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogIWVycm9yTWVzc2FnZXMsXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZXMsXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBub2RlRGVmYXVsdFxuIl19