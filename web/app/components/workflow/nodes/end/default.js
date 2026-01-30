"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: 2.1,
    type: types_1.BlockEnum.End,
    isRequired: false,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        outputs: [],
    },
    checkValid(payload, t) {
        const outputs = payload.outputs || [];
        let errorMessage = '';
        if (!outputs.length) {
            errorMessage = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('nodes.end.output.variable', { ns: 'workflow' }) });
        }
        else {
            const invalidOutput = outputs.find((output) => {
                const variableName = output.variable?.trim();
                const hasSelector = Array.isArray(output.value_selector) && output.value_selector.length > 0;
                return !variableName || !hasSelector;
            });
            if (invalidOutput)
                errorMessage = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('nodes.end.output.variable', { ns: 'workflow' }) });
        }
        return {
            isValid: !errorMessage,
            errorMessage,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyREFBMkQ7QUFDM0QsMkRBQWlFO0FBRWpFLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxpQkFBUyxDQUFDLEdBQUc7SUFDbkIsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxXQUFXLEdBQTZCO0lBQzVDLFFBQVE7SUFDUixZQUFZLEVBQUU7UUFDWixPQUFPLEVBQUUsRUFBRTtLQUNaO0lBQ0QsVUFBVSxDQUFDLE9BQW9CLEVBQUUsQ0FBTTtRQUNyQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQTtRQUVyQyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUE7UUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixZQUFZLEdBQUcsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNILENBQUM7YUFDSSxDQUFDO1lBQ0osTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUM1QyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFBO2dCQUM1QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7Z0JBQzVGLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxXQUFXLENBQUE7WUFDdEMsQ0FBQyxDQUFDLENBQUE7WUFFRixJQUFJLGFBQWE7Z0JBQ2YsWUFBWSxHQUFHLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM3SCxDQUFDO1FBRUQsT0FBTztZQUNMLE9BQU8sRUFBRSxDQUFDLFlBQVk7WUFDdEIsWUFBWTtTQUNiLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZURlZmF1bHQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgRW5kTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdlbk5vZGVNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG5cbmNvbnN0IG1ldGFEYXRhID0gZ2VuTm9kZU1ldGFEYXRhKHtcbiAgc29ydDogMi4xLFxuICB0eXBlOiBCbG9ja0VudW0uRW5kLFxuICBpc1JlcXVpcmVkOiBmYWxzZSxcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8RW5kTm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgb3V0cHV0czogW10sXG4gIH0sXG4gIGNoZWNrVmFsaWQocGF5bG9hZDogRW5kTm9kZVR5cGUsIHQ6IGFueSkge1xuICAgIGNvbnN0IG91dHB1dHMgPSBwYXlsb2FkLm91dHB1dHMgfHwgW11cblxuICAgIGxldCBlcnJvck1lc3NhZ2UgPSAnJ1xuICAgIGlmICghb3V0cHV0cy5sZW5ndGgpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IHQoJ2Vycm9yTXNnLmZpZWxkUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdCgnbm9kZXMuZW5kLm91dHB1dC52YXJpYWJsZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCBpbnZhbGlkT3V0cHV0ID0gb3V0cHV0cy5maW5kKChvdXRwdXQpID0+IHtcbiAgICAgICAgY29uc3QgdmFyaWFibGVOYW1lID0gb3V0cHV0LnZhcmlhYmxlPy50cmltKClcbiAgICAgICAgY29uc3QgaGFzU2VsZWN0b3IgPSBBcnJheS5pc0FycmF5KG91dHB1dC52YWx1ZV9zZWxlY3RvcikgJiYgb3V0cHV0LnZhbHVlX3NlbGVjdG9yLmxlbmd0aCA+IDBcbiAgICAgICAgcmV0dXJuICF2YXJpYWJsZU5hbWUgfHwgIWhhc1NlbGVjdG9yXG4gICAgICB9KVxuXG4gICAgICBpZiAoaW52YWxpZE91dHB1dClcbiAgICAgICAgZXJyb3JNZXNzYWdlID0gdCgnZXJyb3JNc2cuZmllbGRSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCdub2Rlcy5lbmQub3V0cHV0LnZhcmlhYmxlJywgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiAhZXJyb3JNZXNzYWdlLFxuICAgICAgZXJyb3JNZXNzYWdlLFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbm9kZURlZmF1bHRcbiJdfQ==