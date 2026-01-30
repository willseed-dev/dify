"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/tools/types");
const types_2 = require("@/app/components/workflow/nodes/tool/types");
const types_3 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const utils_2 = require("@/utils");
const constants_1 = require("../../constants");
const types_4 = require("../llm/types");
const output_schema_utils_1 = require("./output-schema-utils");
const i18nPrefix = 'errorMsg';
const metaData = (0, utils_1.genNodeMetaData)({
    sort: -1,
    type: types_3.BlockEnum.Tool,
    helpLinkUri: 'tools',
});
const nodeDefault = {
    metaData,
    defaultValue: {
        tool_parameters: {},
        tool_configurations: {},
        tool_node_version: '2',
    },
    checkValid(payload, t, moreDataForCheckValid) {
        const { toolInputsSchema, toolSettingSchema, language, notAuthed } = moreDataForCheckValid;
        let errorMessages = '';
        if (notAuthed)
            errorMessages = t(`${i18nPrefix}.authRequired`, { ns: 'workflow' });
        if (!errorMessages) {
            toolInputsSchema.filter((field) => {
                return field.required;
            }).forEach((field) => {
                const targetVar = payload.tool_parameters[field.variable];
                if (!targetVar) {
                    errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: field.label });
                    return;
                }
                const { type: variable_type, value } = targetVar;
                if (variable_type === types_2.VarType.variable) {
                    if (!errorMessages && (!value || value.length === 0))
                        errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: field.label });
                }
                else {
                    if (!errorMessages && (value === undefined || value === null || value === ''))
                        errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: field.label });
                }
            });
        }
        if (!errorMessages) {
            toolSettingSchema.filter((field) => {
                return field.required;
            }).forEach((field) => {
                const value = payload.tool_configurations[field.variable];
                if (!errorMessages && (value === undefined || value === null || value === ''))
                    errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: field.label[language] });
                if (!errorMessages && typeof value === 'object' && !!value.type && (value.value === undefined || value.value === null || value.value === '' || (Array.isArray(value.value) && value.value.length === 0)))
                    errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: field.label[language] });
            });
        }
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
    getOutputVars(payload, allPluginInfoList, _ragVars, { schemaTypeDefinitions } = { schemaTypeDefinitions: [] }) {
        const { provider_id, provider_type } = payload;
        let currentTools = [];
        switch (provider_type) {
            case types_1.CollectionType.builtIn:
                currentTools = allPluginInfoList.buildInTools ?? [];
                break;
            case types_1.CollectionType.custom:
                currentTools = allPluginInfoList.customTools ?? [];
                break;
            case types_1.CollectionType.workflow:
                currentTools = allPluginInfoList.workflowTools ?? [];
                break;
            case types_1.CollectionType.mcp:
                currentTools = allPluginInfoList.mcpTools ?? [];
                break;
            default:
                currentTools = [];
        }
        const currCollection = currentTools.find(item => (0, utils_2.canFindTool)(item.id, provider_id));
        const currTool = currCollection?.tools.find(tool => tool.name === payload.tool_name);
        const output_schema = currTool?.output_schema;
        let res = [];
        if (!output_schema || !output_schema.properties) {
            res = constants_1.TOOL_OUTPUT_STRUCT;
        }
        else {
            const outputSchema = [];
            Object.keys(output_schema.properties).forEach((outputKey) => {
                const output = output_schema.properties[outputKey];
                const { type, schemaType } = (0, output_schema_utils_1.resolveVarType)(output, schemaTypeDefinitions);
                outputSchema.push({
                    variable: outputKey,
                    type,
                    des: output.description,
                    schemaType,
                    children: output.type === 'object'
                        ? {
                            schema: {
                                type: types_4.Type.object,
                                properties: output.properties,
                                additionalProperties: false,
                            },
                        }
                        : undefined,
                });
            });
            res = [
                ...constants_1.TOOL_OUTPUT_STRUCT,
                ...outputSchema,
            ];
        }
        return res;
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx3REFBNkQ7QUFDN0Qsc0VBQW1GO0FBQ25GLDJEQUEyRDtBQUMzRCwyREFBaUU7QUFDakUsbUNBQXFDO0FBQ3JDLCtDQUFvRDtBQUNwRCx3Q0FBbUM7QUFDbkMsK0RBQXNEO0FBRXRELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUU3QixNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFlLEVBQUM7SUFDL0IsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNSLElBQUksRUFBRSxpQkFBUyxDQUFDLElBQUk7SUFDcEIsV0FBVyxFQUFFLE9BQU87Q0FDckIsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxXQUFXLEdBQThCO0lBQzdDLFFBQVE7SUFDUixZQUFZLEVBQUU7UUFDWixlQUFlLEVBQUUsRUFBRTtRQUNuQixtQkFBbUIsRUFBRSxFQUFFO1FBQ3ZCLGlCQUFpQixFQUFFLEdBQUc7S0FDdkI7SUFDRCxVQUFVLENBQUMsT0FBcUIsRUFBRSxDQUFNLEVBQUUscUJBQTBCO1FBQ2xFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEdBQUcscUJBQXFCLENBQUE7UUFDMUYsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLElBQUksU0FBUztZQUNYLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLGVBQWUsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBRXJFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNuQixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtnQkFDckMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFBO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO2dCQUN4QixN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QVUsRUFBRSxDQUFDO1lBQ2hELEdBQUcsR0FBRyw4QkFBa0IsQ0FBQTtRQUMxQixDQUFDO2FBQ0ksQ0FBQztZQUNKLE1BQU0sWUFBWSxHQUFVLEVBQUUsQ0FBQTtZQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDMUQsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDbEQsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFBLG9DQUFjLEVBQUMsTUFBTSxFQUFFLHFCQUFxQixDQUFDLENBQUE7Z0JBRTFFLFlBQVksQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLFFBQVEsRUFBRSxTQUFTO29CQUNuQixJQUFJO29CQUNKLEdBQUcsRUFBRSxNQUFNLENBQUMsV0FBVztvQkFDdkIsVUFBVTtvQkFDVixRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRO3dCQUNoQyxDQUFDLENBQUM7NEJBQ0UsTUFBTSxFQUFFO2dDQUNOLElBQUksRUFBRSxZQUFJLENBQUMsTUFBTTtnQ0FDakIsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVO2dDQUM3QixvQkFBb0IsRUFBRSxLQUFLOzZCQUM1Qjt5QkFDRjt3QkFDSCxDQUFDLENBQUMsU0FBUztpQkFDZCxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtZQUNGLEdBQUcsR0FBRztnQkFDSixHQUFHLDhCQUFrQjtnQkFDckIsR0FBRyxZQUFZO2FBQ2hCLENBQUE7UUFDSCxDQUFDO1FBQ0QsT0FBTyxHQUFHLENBQUE7SUFDWixDQUFDO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZURlZmF1bHQsIFRvb2xXaXRoUHJvdmlkZXIsIFZhciB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBUb29sTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQ29sbGVjdGlvblR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3Rvb2xzL3R5cGVzJ1xuaW1wb3J0IHsgVmFyVHlwZSBhcyBWYXJLaW5kVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvdG9vbC90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuaW1wb3J0IHsgY2FuRmluZFRvb2wgfSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IHsgVE9PTF9PVVRQVVRfU1RSVUNUIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJy4uL2xsbS90eXBlcydcbmltcG9ydCB7IHJlc29sdmVWYXJUeXBlIH0gZnJvbSAnLi9vdXRwdXQtc2NoZW1hLXV0aWxzJ1xuXG5jb25zdCBpMThuUHJlZml4ID0gJ2Vycm9yTXNnJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIHNvcnQ6IC0xLFxuICB0eXBlOiBCbG9ja0VudW0uVG9vbCxcbiAgaGVscExpbmtVcmk6ICd0b29scycsXG59KVxuY29uc3Qgbm9kZURlZmF1bHQ6IE5vZGVEZWZhdWx0PFRvb2xOb2RlVHlwZT4gPSB7XG4gIG1ldGFEYXRhLFxuICBkZWZhdWx0VmFsdWU6IHtcbiAgICB0b29sX3BhcmFtZXRlcnM6IHt9LFxuICAgIHRvb2xfY29uZmlndXJhdGlvbnM6IHt9LFxuICAgIHRvb2xfbm9kZV92ZXJzaW9uOiAnMicsXG4gIH0sXG4gIGNoZWNrVmFsaWQocGF5bG9hZDogVG9vbE5vZGVUeXBlLCB0OiBhbnksIG1vcmVEYXRhRm9yQ2hlY2tWYWxpZDogYW55KSB7XG4gICAgY29uc3QgeyB0b29sSW5wdXRzU2NoZW1hLCB0b29sU2V0dGluZ1NjaGVtYSwgbGFuZ3VhZ2UsIG5vdEF1dGhlZCB9ID0gbW9yZURhdGFGb3JDaGVja1ZhbGlkXG4gICAgbGV0IGVycm9yTWVzc2FnZXMgPSAnJ1xuICAgIGlmIChub3RBdXRoZWQpXG4gICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5hdXRoUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnIH0pXG5cbiAgICBpZiAoIWVycm9yTWVzc2FnZXMpIHtcbiAgICAgIHRvb2xJbnB1dHNTY2hlbWEuZmlsdGVyKChmaWVsZDogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiBmaWVsZC5yZXF1aXJlZFxuICAgICAgfSkuZm9yRWFjaCgoZmllbGQ6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXRWYXIgPSBwYXlsb2FkLnRvb2xfcGFyYW1ldGVyc1tmaWVsZC52YXJpYWJsZV1cbiAgICAgICAgaWYgKCF0YXJnZXRWYXIpIHtcbiAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IGZpZWxkLmxhYmVsIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyB0eXBlOiB2YXJpYWJsZV90eXBlLCB2YWx1ZSB9ID0gdGFyZ2V0VmFyXG4gICAgICAgIGlmICh2YXJpYWJsZV90eXBlID09PSBWYXJLaW5kVHlwZS52YXJpYWJsZSkge1xuICAgICAgICAgIGlmICghZXJyb3JNZXNzYWdlcyAmJiAoIXZhbHVlIHx8IHZhbHVlLmxlbmd0aCA9PT0gMCkpXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IGZpZWxkLmxhYmVsIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSAnJykpXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IGZpZWxkLmxhYmVsIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzKSB7XG4gICAgICB0b29sU2V0dGluZ1NjaGVtYS5maWx0ZXIoKGZpZWxkOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLnJlcXVpcmVkXG4gICAgICB9KS5mb3JFYWNoKChmaWVsZDogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gcGF5bG9hZC50b29sX2NvbmZpZ3VyYXRpb25zW2ZpZWxkLnZhcmlhYmxlXVxuICAgICAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09ICcnKSlcbiAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IGZpZWxkLmxhYmVsW2xhbmd1YWdlXSB9KVxuICAgICAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhIXZhbHVlLnR5cGUgJiYgKHZhbHVlLnZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUudmFsdWUgPT09IG51bGwgfHwgdmFsdWUudmFsdWUgPT09ICcnIHx8IChBcnJheS5pc0FycmF5KHZhbHVlLnZhbHVlKSAmJiB2YWx1ZS52YWx1ZS5sZW5ndGggPT09IDApKSlcbiAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IGZpZWxkLmxhYmVsW2xhbmd1YWdlXSB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogIWVycm9yTWVzc2FnZXMsXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZXMsXG4gICAgfVxuICB9LFxuICBnZXRPdXRwdXRWYXJzKHBheWxvYWQ6IFRvb2xOb2RlVHlwZSwgYWxsUGx1Z2luSW5mb0xpc3Q6IFJlY29yZDxzdHJpbmcsIFRvb2xXaXRoUHJvdmlkZXJbXT4sIF9yYWdWYXJzOiBhbnksIHsgc2NoZW1hVHlwZURlZmluaXRpb25zIH0gPSB7IHNjaGVtYVR5cGVEZWZpbml0aW9uczogW10gfSkge1xuICAgIGNvbnN0IHsgcHJvdmlkZXJfaWQsIHByb3ZpZGVyX3R5cGUgfSA9IHBheWxvYWRcbiAgICBsZXQgY3VycmVudFRvb2xzOiBUb29sV2l0aFByb3ZpZGVyW10gPSBbXVxuICAgIHN3aXRjaCAocHJvdmlkZXJfdHlwZSkge1xuICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS5idWlsdEluOlxuICAgICAgICBjdXJyZW50VG9vbHMgPSBhbGxQbHVnaW5JbmZvTGlzdC5idWlsZEluVG9vbHMgPz8gW11cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgQ29sbGVjdGlvblR5cGUuY3VzdG9tOlxuICAgICAgICBjdXJyZW50VG9vbHMgPSBhbGxQbHVnaW5JbmZvTGlzdC5jdXN0b21Ub29scyA/PyBbXVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS53b3JrZmxvdzpcbiAgICAgICAgY3VycmVudFRvb2xzID0gYWxsUGx1Z2luSW5mb0xpc3Qud29ya2Zsb3dUb29scyA/PyBbXVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS5tY3A6XG4gICAgICAgIGN1cnJlbnRUb29scyA9IGFsbFBsdWdpbkluZm9MaXN0Lm1jcFRvb2xzID8/IFtdXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjdXJyZW50VG9vbHMgPSBbXVxuICAgIH1cbiAgICBjb25zdCBjdXJyQ29sbGVjdGlvbiA9IGN1cnJlbnRUb29scy5maW5kKGl0ZW0gPT4gY2FuRmluZFRvb2woaXRlbS5pZCwgcHJvdmlkZXJfaWQpKVxuICAgIGNvbnN0IGN1cnJUb29sID0gY3VyckNvbGxlY3Rpb24/LnRvb2xzLmZpbmQodG9vbCA9PiB0b29sLm5hbWUgPT09IHBheWxvYWQudG9vbF9uYW1lKVxuICAgIGNvbnN0IG91dHB1dF9zY2hlbWEgPSBjdXJyVG9vbD8ub3V0cHV0X3NjaGVtYVxuICAgIGxldCByZXM6IFZhcltdID0gW11cbiAgICBpZiAoIW91dHB1dF9zY2hlbWEgfHwgIW91dHB1dF9zY2hlbWEucHJvcGVydGllcykge1xuICAgICAgcmVzID0gVE9PTF9PVVRQVVRfU1RSVUNUXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc3Qgb3V0cHV0U2NoZW1hOiBWYXJbXSA9IFtdXG4gICAgICBPYmplY3Qua2V5cyhvdXRwdXRfc2NoZW1hLnByb3BlcnRpZXMpLmZvckVhY2goKG91dHB1dEtleSkgPT4ge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBvdXRwdXRfc2NoZW1hLnByb3BlcnRpZXNbb3V0cHV0S2V5XVxuICAgICAgICBjb25zdCB7IHR5cGUsIHNjaGVtYVR5cGUgfSA9IHJlc29sdmVWYXJUeXBlKG91dHB1dCwgc2NoZW1hVHlwZURlZmluaXRpb25zKVxuXG4gICAgICAgIG91dHB1dFNjaGVtYS5wdXNoKHtcbiAgICAgICAgICB2YXJpYWJsZTogb3V0cHV0S2V5LFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgZGVzOiBvdXRwdXQuZGVzY3JpcHRpb24sXG4gICAgICAgICAgc2NoZW1hVHlwZSxcbiAgICAgICAgICBjaGlsZHJlbjogb3V0cHV0LnR5cGUgPT09ICdvYmplY3QnXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFR5cGUub2JqZWN0LFxuICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogb3V0cHV0LnByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgcmVzID0gW1xuICAgICAgICAuLi5UT09MX09VVFBVVF9TVFJVQ1QsXG4gICAgICAgIC4uLm91dHB1dFNjaGVtYSxcbiAgICAgIF1cbiAgICB9XG4gICAgcmV0dXJuIHJlc1xuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBub2RlRGVmYXVsdFxuIl19