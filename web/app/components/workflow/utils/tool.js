"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapStructuredVarItem = exports.CHUNK_TYPE_MAP = exports.getToolCheckParams = void 0;
const types_1 = require("@/app/components/tools/types");
const to_form_schema_1 = require("@/app/components/tools/utils/to-form-schema");
const types_2 = require("@/app/components/workflow/nodes/llm/types");
const utils_1 = require("@/utils");
const getToolCheckParams = (toolData, buildInTools, customTools, workflowTools, language) => {
    const { provider_id, provider_type, tool_name } = toolData;
    const isBuiltIn = provider_type === types_1.CollectionType.builtIn;
    const currentTools = provider_type === types_1.CollectionType.builtIn ? buildInTools : provider_type === types_1.CollectionType.custom ? customTools : workflowTools;
    const currCollection = currentTools.find(item => (0, utils_1.canFindTool)(item.id, provider_id));
    const currTool = currCollection?.tools.find(tool => tool.name === tool_name);
    const formSchemas = currTool ? (0, to_form_schema_1.toolParametersToFormSchemas)(currTool.parameters) : [];
    const toolInputVarSchema = formSchemas.filter(item => item.form === 'llm');
    const toolSettingSchema = formSchemas.filter(item => item.form !== 'llm');
    return {
        toolInputsSchema: (() => {
            const formInputs = [];
            toolInputVarSchema.forEach((item) => {
                formInputs.push({
                    label: item.label[language] || item.label.en_US,
                    variable: item.variable,
                    type: item.type,
                    required: item.required,
                });
            });
            return formInputs;
        })(),
        notAuthed: isBuiltIn && !!currCollection?.allow_delete && !currCollection?.is_team_authorization,
        toolSettingSchema,
        language,
    };
};
exports.getToolCheckParams = getToolCheckParams;
exports.CHUNK_TYPE_MAP = {
    general_chunks: 'GeneralStructureChunk',
    parent_child_chunks: 'ParentChildStructureChunk',
    qa_chunks: 'QAStructureChunk',
};
const wrapStructuredVarItem = (outputItem, matchedSchemaType) => {
    const dataType = types_2.Type.object;
    return {
        schema: {
            type: dataType,
            properties: {
                [outputItem.name]: {
                    ...outputItem.value,
                    schemaType: matchedSchemaType,
                },
            },
            additionalProperties: false,
        },
    };
};
exports.wrapStructuredVarItem = wrapStructuredVarItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBTUEsd0RBQTZEO0FBQzdELGdGQUF5RjtBQUN6RixxRUFBZ0U7QUFDaEUsbUNBQXFDO0FBRTlCLE1BQU0sa0JBQWtCLEdBQUcsQ0FDaEMsUUFBc0IsRUFDdEIsWUFBZ0MsRUFDaEMsV0FBK0IsRUFDL0IsYUFBaUMsRUFDakMsUUFBZ0IsRUFDaEIsRUFBRTtJQUNGLE1BQU0sRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxHQUFHLFFBQVEsQ0FBQTtJQUMxRCxNQUFNLFNBQVMsR0FBRyxhQUFhLEtBQUssc0JBQWMsQ0FBQyxPQUFPLENBQUE7SUFDMUQsTUFBTSxZQUFZLEdBQUcsYUFBYSxLQUFLLHNCQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsS0FBSyxzQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUE7SUFDcEosTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUEsbUJBQVcsRUFBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUE7SUFDbkYsTUFBTSxRQUFRLEdBQUcsY0FBYyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFBO0lBQzVFLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBQSw0Q0FBMkIsRUFBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNwRixNQUFNLGtCQUFrQixHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFBO0lBQzFFLE1BQU0saUJBQWlCLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUE7SUFFekUsT0FBTztRQUNMLGdCQUFnQixFQUFFLENBQUMsR0FBRyxFQUFFO1lBQ3RCLE1BQU0sVUFBVSxHQUFlLEVBQUUsQ0FBQTtZQUNqQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtnQkFDdkMsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDZCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7b0JBQy9DLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtpQkFDeEIsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7WUFDRixPQUFPLFVBQVUsQ0FBQTtRQUNuQixDQUFDLENBQUMsRUFBRTtRQUNKLFNBQVMsRUFBRSxTQUFTLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxZQUFZLElBQUksQ0FBQyxjQUFjLEVBQUUscUJBQXFCO1FBQ2hHLGlCQUFpQjtRQUNqQixRQUFRO0tBQ1QsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQWpDWSxRQUFBLGtCQUFrQixzQkFpQzlCO0FBRVksUUFBQSxjQUFjLEdBQUc7SUFDNUIsY0FBYyxFQUFFLHVCQUF1QjtJQUN2QyxtQkFBbUIsRUFBRSwyQkFBMkI7SUFDaEQsU0FBUyxFQUFFLGtCQUFrQjtDQUM5QixDQUFBO0FBRU0sTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFVBQWUsRUFBRSxpQkFBeUIsRUFBb0IsRUFBRTtJQUNwRyxNQUFNLFFBQVEsR0FBRyxZQUFJLENBQUMsTUFBTSxDQUFBO0lBQzVCLE9BQU87UUFDTCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLFVBQVUsRUFBRTtnQkFDVixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDakIsR0FBRyxVQUFVLENBQUMsS0FBSztvQkFDbkIsVUFBVSxFQUFFLGlCQUFpQjtpQkFDOUI7YUFDRjtZQUNELG9CQUFvQixFQUFFLEtBQUs7U0FDNUI7S0FDRixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBZFksUUFBQSxxQkFBcUIseUJBY2pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBUb29sTm9kZVR5cGUgfSBmcm9tICcuLi9ub2Rlcy90b29sL3R5cGVzJ1xuaW1wb3J0IHR5cGUge1xuICBJbnB1dFZhcixcbiAgVG9vbFdpdGhQcm92aWRlcixcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFN0cnVjdHVyZWRPdXRwdXQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2xsbS90eXBlcydcbmltcG9ydCB7IENvbGxlY3Rpb25UeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy90b29scy90eXBlcydcbmltcG9ydCB7IHRvb2xQYXJhbWV0ZXJzVG9Gb3JtU2NoZW1hcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdXRpbHMvdG8tZm9ybS1zY2hlbWEnXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9sbG0vdHlwZXMnXG5pbXBvcnQgeyBjYW5GaW5kVG9vbCB9IGZyb20gJ0AvdXRpbHMnXG5cbmV4cG9ydCBjb25zdCBnZXRUb29sQ2hlY2tQYXJhbXMgPSAoXG4gIHRvb2xEYXRhOiBUb29sTm9kZVR5cGUsXG4gIGJ1aWxkSW5Ub29sczogVG9vbFdpdGhQcm92aWRlcltdLFxuICBjdXN0b21Ub29sczogVG9vbFdpdGhQcm92aWRlcltdLFxuICB3b3JrZmxvd1Rvb2xzOiBUb29sV2l0aFByb3ZpZGVyW10sXG4gIGxhbmd1YWdlOiBzdHJpbmcsXG4pID0+IHtcbiAgY29uc3QgeyBwcm92aWRlcl9pZCwgcHJvdmlkZXJfdHlwZSwgdG9vbF9uYW1lIH0gPSB0b29sRGF0YVxuICBjb25zdCBpc0J1aWx0SW4gPSBwcm92aWRlcl90eXBlID09PSBDb2xsZWN0aW9uVHlwZS5idWlsdEluXG4gIGNvbnN0IGN1cnJlbnRUb29scyA9IHByb3ZpZGVyX3R5cGUgPT09IENvbGxlY3Rpb25UeXBlLmJ1aWx0SW4gPyBidWlsZEluVG9vbHMgOiBwcm92aWRlcl90eXBlID09PSBDb2xsZWN0aW9uVHlwZS5jdXN0b20gPyBjdXN0b21Ub29scyA6IHdvcmtmbG93VG9vbHNcbiAgY29uc3QgY3VyckNvbGxlY3Rpb24gPSBjdXJyZW50VG9vbHMuZmluZChpdGVtID0+IGNhbkZpbmRUb29sKGl0ZW0uaWQsIHByb3ZpZGVyX2lkKSlcbiAgY29uc3QgY3VyclRvb2wgPSBjdXJyQ29sbGVjdGlvbj8udG9vbHMuZmluZCh0b29sID0+IHRvb2wubmFtZSA9PT0gdG9vbF9uYW1lKVxuICBjb25zdCBmb3JtU2NoZW1hcyA9IGN1cnJUb29sID8gdG9vbFBhcmFtZXRlcnNUb0Zvcm1TY2hlbWFzKGN1cnJUb29sLnBhcmFtZXRlcnMpIDogW11cbiAgY29uc3QgdG9vbElucHV0VmFyU2NoZW1hID0gZm9ybVNjaGVtYXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5mb3JtID09PSAnbGxtJylcbiAgY29uc3QgdG9vbFNldHRpbmdTY2hlbWEgPSBmb3JtU2NoZW1hcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmZvcm0gIT09ICdsbG0nKVxuXG4gIHJldHVybiB7XG4gICAgdG9vbElucHV0c1NjaGVtYTogKCgpID0+IHtcbiAgICAgIGNvbnN0IGZvcm1JbnB1dHM6IElucHV0VmFyW10gPSBbXVxuICAgICAgdG9vbElucHV0VmFyU2NoZW1hLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICBmb3JtSW5wdXRzLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBpdGVtLmxhYmVsW2xhbmd1YWdlXSB8fCBpdGVtLmxhYmVsLmVuX1VTLFxuICAgICAgICAgIHZhcmlhYmxlOiBpdGVtLnZhcmlhYmxlLFxuICAgICAgICAgIHR5cGU6IGl0ZW0udHlwZSxcbiAgICAgICAgICByZXF1aXJlZDogaXRlbS5yZXF1aXJlZCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4gZm9ybUlucHV0c1xuICAgIH0pKCksXG4gICAgbm90QXV0aGVkOiBpc0J1aWx0SW4gJiYgISFjdXJyQ29sbGVjdGlvbj8uYWxsb3dfZGVsZXRlICYmICFjdXJyQ29sbGVjdGlvbj8uaXNfdGVhbV9hdXRob3JpemF0aW9uLFxuICAgIHRvb2xTZXR0aW5nU2NoZW1hLFxuICAgIGxhbmd1YWdlLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBDSFVOS19UWVBFX01BUCA9IHtcbiAgZ2VuZXJhbF9jaHVua3M6ICdHZW5lcmFsU3RydWN0dXJlQ2h1bmsnLFxuICBwYXJlbnRfY2hpbGRfY2h1bmtzOiAnUGFyZW50Q2hpbGRTdHJ1Y3R1cmVDaHVuaycsXG4gIHFhX2NodW5rczogJ1FBU3RydWN0dXJlQ2h1bmsnLFxufVxuXG5leHBvcnQgY29uc3Qgd3JhcFN0cnVjdHVyZWRWYXJJdGVtID0gKG91dHB1dEl0ZW06IGFueSwgbWF0Y2hlZFNjaGVtYVR5cGU6IHN0cmluZyk6IFN0cnVjdHVyZWRPdXRwdXQgPT4ge1xuICBjb25zdCBkYXRhVHlwZSA9IFR5cGUub2JqZWN0XG4gIHJldHVybiB7XG4gICAgc2NoZW1hOiB7XG4gICAgICB0eXBlOiBkYXRhVHlwZSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgW291dHB1dEl0ZW0ubmFtZV06IHtcbiAgICAgICAgICAuLi5vdXRwdXRJdGVtLnZhbHVlLFxuICAgICAgICAgIHNjaGVtYVR5cGU6IG1hdGNoZWRTY2hlbWFUeXBlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICB9LFxuICB9XG59XG4iXX0=