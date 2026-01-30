"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const app_1 = require("@/types/app");
const types_3 = require("./types");
const i18nPrefix = '';
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.Transform,
    sort: 6,
    type: types_2.BlockEnum.ParameterExtractor,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        query: [],
        model: {
            provider: '',
            name: '',
            mode: app_1.AppModeEnum.CHAT,
            completion_params: {
                temperature: 0.7,
            },
        },
        reasoning_mode: types_3.ReasoningModeType.prompt,
        vision: {
            enabled: false,
        },
    },
    checkValid(payload, t) {
        let errorMessages = '';
        if (!errorMessages && (!payload.query || payload.query.length === 0))
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.parameterExtractor.inputVar`, { ns: 'workflow' }) });
        if (!errorMessages && !payload.model.provider)
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.parameterExtractor.model`, { ns: 'workflow' }) });
        if (!errorMessages && (!payload.parameters || payload.parameters.length === 0))
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.parameterExtractor.extractParameters`, { ns: 'workflow' }) });
        if (!errorMessages) {
            payload.parameters.forEach((param) => {
                if (errorMessages)
                    return;
                if (!param.name) {
                    errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.parameterExtractor.addExtractParameterContent.namePlaceholder`, { ns: 'workflow' }) });
                    return;
                }
                if (!param.type) {
                    errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.parameterExtractor.addExtractParameterContent.typePlaceholder`, { ns: 'workflow' }) });
                    return;
                }
                if (!param.description)
                    errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.parameterExtractor.addExtractParameterContent.descriptionPlaceholder`, { ns: 'workflow' }) });
            });
        }
        if (!errorMessages && payload.vision?.enabled && !payload.vision.configs?.variable_selector?.length)
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}errorMsg.fields.visionVariable`, { ns: 'workflow' }) });
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUNqRSxxQ0FBeUM7QUFDekMsbUNBQTJDO0FBRTNDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQTtBQUVyQixNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFlLEVBQUM7SUFDL0IsY0FBYyxFQUFFLCtCQUF1QixDQUFDLFNBQVM7SUFDakQsSUFBSSxFQUFFLENBQUM7SUFDUCxJQUFJLEVBQUUsaUJBQVMsQ0FBQyxrQkFBa0I7Q0FDbkMsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxXQUFXLEdBQTRDO0lBQzNELFFBQVE7SUFDUixZQUFZLEVBQUU7UUFDWixLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRTtZQUNMLFFBQVEsRUFBRSxFQUFFO1lBQ1osSUFBSSxFQUFFLEVBQUU7WUFDUixJQUFJLEVBQUUsaUJBQVcsQ0FBQyxJQUFJO1lBQ3RCLGlCQUFpQixFQUFFO2dCQUNqQixXQUFXLEVBQUUsR0FBRzthQUNqQjtTQUNGO1FBQ0QsY0FBYyxFQUFFLHlCQUFpQixDQUFDLE1BQU07UUFDeEMsTUFBTSxFQUFFO1lBQ04sT0FBTyxFQUFFLEtBQUs7U0FDZjtLQUNGO0lBQ0QsVUFBVSxDQUFDLE9BQW1DLEVBQUUsQ0FBTTtRQUNwRCxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFDbEUsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLG1DQUFtQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRTlKLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDM0MsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLGdDQUFnQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRTNKLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQzVFLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSw0Q0FBNEMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUV2SyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxhQUFhO29CQUNmLE9BQU07Z0JBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEIsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLHFFQUFxRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUM5TCxPQUFNO2dCQUNSLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEIsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLHFFQUFxRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUM5TCxPQUFNO2dCQUNSLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXO29CQUNwQixhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsNEVBQTRFLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDek0sQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU07WUFDakcsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLGdDQUFnQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNKLE9BQU87WUFDTCxPQUFPLEVBQUUsQ0FBQyxhQUFhO1lBQ3ZCLFlBQVksRUFBRSxhQUFhO1NBQzVCLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZURlZmF1bHQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgUGFyYW1ldGVyRXh0cmFjdG9yTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdlbk5vZGVNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgUmVhc29uaW5nTW9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBpMThuUHJlZml4ID0gJydcblxuY29uc3QgbWV0YURhdGEgPSBnZW5Ob2RlTWV0YURhdGEoe1xuICBjbGFzc2lmaWNhdGlvbjogQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uVHJhbnNmb3JtLFxuICBzb3J0OiA2LFxuICB0eXBlOiBCbG9ja0VudW0uUGFyYW1ldGVyRXh0cmFjdG9yLFxufSlcbmNvbnN0IG5vZGVEZWZhdWx0OiBOb2RlRGVmYXVsdDxQYXJhbWV0ZXJFeHRyYWN0b3JOb2RlVHlwZT4gPSB7XG4gIG1ldGFEYXRhLFxuICBkZWZhdWx0VmFsdWU6IHtcbiAgICBxdWVyeTogW10sXG4gICAgbW9kZWw6IHtcbiAgICAgIHByb3ZpZGVyOiAnJyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgbW9kZTogQXBwTW9kZUVudW0uQ0hBVCxcbiAgICAgIGNvbXBsZXRpb25fcGFyYW1zOiB7XG4gICAgICAgIHRlbXBlcmF0dXJlOiAwLjcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVhc29uaW5nX21vZGU6IFJlYXNvbmluZ01vZGVUeXBlLnByb21wdCxcbiAgICB2aXNpb246IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIGNoZWNrVmFsaWQocGF5bG9hZDogUGFyYW1ldGVyRXh0cmFjdG9yTm9kZVR5cGUsIHQ6IGFueSkge1xuICAgIGxldCBlcnJvck1lc3NhZ2VzID0gJydcbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgKCFwYXlsb2FkLnF1ZXJ5IHx8IHBheWxvYWQucXVlcnkubGVuZ3RoID09PSAwKSlcbiAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KGAke2kxOG5QcmVmaXh9bm9kZXMucGFyYW1ldGVyRXh0cmFjdG9yLmlucHV0VmFyYCwgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICFwYXlsb2FkLm1vZGVsLnByb3ZpZGVyKVxuICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH1lcnJvck1zZy5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoYCR7aTE4blByZWZpeH1ub2Rlcy5wYXJhbWV0ZXJFeHRyYWN0b3IubW9kZWxgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG5cbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgKCFwYXlsb2FkLnBhcmFtZXRlcnMgfHwgcGF5bG9hZC5wYXJhbWV0ZXJzLmxlbmd0aCA9PT0gMCkpXG4gICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fWVycm9yTXNnLmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdChgJHtpMThuUHJlZml4fW5vZGVzLnBhcmFtZXRlckV4dHJhY3Rvci5leHRyYWN0UGFyYW1ldGVyc2AsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcblxuICAgIGlmICghZXJyb3JNZXNzYWdlcykge1xuICAgICAgcGF5bG9hZC5wYXJhbWV0ZXJzLmZvckVhY2goKHBhcmFtKSA9PiB7XG4gICAgICAgIGlmIChlcnJvck1lc3NhZ2VzKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICBpZiAoIXBhcmFtLm5hbWUpIHtcbiAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fWVycm9yTXNnLmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdChgJHtpMThuUHJlZml4fW5vZGVzLnBhcmFtZXRlckV4dHJhY3Rvci5hZGRFeHRyYWN0UGFyYW1ldGVyQ29udGVudC5uYW1lUGxhY2Vob2xkZXJgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwYXJhbS50eXBlKSB7XG4gICAgICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH1lcnJvck1zZy5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoYCR7aTE4blByZWZpeH1ub2Rlcy5wYXJhbWV0ZXJFeHRyYWN0b3IuYWRkRXh0cmFjdFBhcmFtZXRlckNvbnRlbnQudHlwZVBsYWNlaG9sZGVyYCwgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmICghcGFyYW0uZGVzY3JpcHRpb24pXG4gICAgICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH1lcnJvck1zZy5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoYCR7aTE4blByZWZpeH1ub2Rlcy5wYXJhbWV0ZXJFeHRyYWN0b3IuYWRkRXh0cmFjdFBhcmFtZXRlckNvbnRlbnQuZGVzY3JpcHRpb25QbGFjZWhvbGRlcmAsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmICghZXJyb3JNZXNzYWdlcyAmJiBwYXlsb2FkLnZpc2lvbj8uZW5hYmxlZCAmJiAhcGF5bG9hZC52aXNpb24uY29uZmlncz8udmFyaWFibGVfc2VsZWN0b3I/Lmxlbmd0aClcbiAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRzLnZpc2lvblZhcmlhYmxlYCwgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiAhZXJyb3JNZXNzYWdlcyxcbiAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlcyxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVEZWZhdWx0XG4iXX0=