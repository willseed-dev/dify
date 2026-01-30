"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const app_1 = require("@/types/app");
const i18nPrefix = '';
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.QuestionUnderstand,
    sort: 1,
    type: types_2.BlockEnum.QuestionClassifier,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        query_variable_selector: [],
        model: {
            provider: '',
            name: '',
            mode: app_1.AppModeEnum.CHAT,
            completion_params: {
                temperature: 0.7,
            },
        },
        classes: [
            {
                id: '1',
                name: '',
            },
            {
                id: '2',
                name: '',
            },
        ],
        _targetBranches: [
            {
                id: '1',
                name: '',
            },
            {
                id: '2',
                name: '',
            },
        ],
        vision: {
            enabled: false,
        },
    },
    checkValid(payload, t) {
        let errorMessages = '';
        if (!errorMessages && (!payload.query_variable_selector || payload.query_variable_selector.length === 0))
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.questionClassifiers.inputVars`, { ns: 'workflow' }) });
        if (!errorMessages && !payload.model.provider)
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.questionClassifiers.model`, { ns: 'workflow' }) });
        if (!errorMessages && (!payload.classes || payload.classes.length === 0))
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.questionClassifiers.class`, { ns: 'workflow' }) });
        if (!errorMessages && (payload.classes.some(item => !item.name)))
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.questionClassifiers.topicName`, { ns: 'workflow' }) });
        if (!errorMessages && payload.vision?.enabled && !payload.vision.configs?.variable_selector?.length)
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}errorMsg.fields.visionVariable`, { ns: 'workflow' }) });
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUNqRSxxQ0FBeUM7QUFFekMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFBO0FBRXJCLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixjQUFjLEVBQUUsK0JBQXVCLENBQUMsa0JBQWtCO0lBQzFELElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFTLENBQUMsa0JBQWtCO0NBQ25DLENBQUMsQ0FBQTtBQUNGLE1BQU0sV0FBVyxHQUE0QztJQUMzRCxRQUFRO0lBQ1IsWUFBWSxFQUFFO1FBQ1osdUJBQXVCLEVBQUUsRUFBRTtRQUMzQixLQUFLLEVBQUU7WUFDTCxRQUFRLEVBQUUsRUFBRTtZQUNaLElBQUksRUFBRSxFQUFFO1lBQ1IsSUFBSSxFQUFFLGlCQUFXLENBQUMsSUFBSTtZQUN0QixpQkFBaUIsRUFBRTtnQkFDakIsV0FBVyxFQUFFLEdBQUc7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLEVBQUUsRUFBRSxHQUFHO2dCQUNQLElBQUksRUFBRSxFQUFFO2FBQ1Q7WUFDRDtnQkFDRSxFQUFFLEVBQUUsR0FBRztnQkFDUCxJQUFJLEVBQUUsRUFBRTthQUNUO1NBQ0Y7UUFDRCxlQUFlLEVBQUU7WUFDZjtnQkFDRSxFQUFFLEVBQUUsR0FBRztnQkFDUCxJQUFJLEVBQUUsRUFBRTthQUNUO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLEdBQUc7Z0JBQ1AsSUFBSSxFQUFFLEVBQUU7YUFDVDtTQUNGO1FBQ0QsTUFBTSxFQUFFO1lBQ04sT0FBTyxFQUFFLEtBQUs7U0FDZjtLQUNGO0lBQ0QsVUFBVSxDQUFDLE9BQW1DLEVBQUUsQ0FBTTtRQUNwRCxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixJQUFJLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQ3RHLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSxxQ0FBcUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUVoSyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQzNDLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSxpQ0FBaUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUU1SixJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUN0RSxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsaUNBQWlDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7UUFFNUosSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUQsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLHFDQUFxQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRWhLLElBQUksQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNO1lBQ2pHLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUMzSixPQUFPO1lBQ0wsT0FBTyxFQUFFLENBQUMsYUFBYTtZQUN2QixZQUFZLEVBQUUsYUFBYTtTQUM1QixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFF1ZXN0aW9uQ2xhc3NpZmllck5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuaW1wb3J0IHsgQXBwTW9kZUVudW0gfSBmcm9tICdAL3R5cGVzL2FwcCdcblxuY29uc3QgaTE4blByZWZpeCA9ICcnXG5cbmNvbnN0IG1ldGFEYXRhID0gZ2VuTm9kZU1ldGFEYXRhKHtcbiAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLlF1ZXN0aW9uVW5kZXJzdGFuZCxcbiAgc29ydDogMSxcbiAgdHlwZTogQmxvY2tFbnVtLlF1ZXN0aW9uQ2xhc3NpZmllcixcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8UXVlc3Rpb25DbGFzc2lmaWVyTm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgcXVlcnlfdmFyaWFibGVfc2VsZWN0b3I6IFtdLFxuICAgIG1vZGVsOiB7XG4gICAgICBwcm92aWRlcjogJycsXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIG1vZGU6IEFwcE1vZGVFbnVtLkNIQVQsXG4gICAgICBjb21wbGV0aW9uX3BhcmFtczoge1xuICAgICAgICB0ZW1wZXJhdHVyZTogMC43LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNsYXNzZXM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJzInLFxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBfdGFyZ2V0QnJhbmNoZXM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJzInLFxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICB2aXNpb246IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIGNoZWNrVmFsaWQocGF5bG9hZDogUXVlc3Rpb25DbGFzc2lmaWVyTm9kZVR5cGUsIHQ6IGFueSkge1xuICAgIGxldCBlcnJvck1lc3NhZ2VzID0gJydcbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgKCFwYXlsb2FkLnF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yIHx8IHBheWxvYWQucXVlcnlfdmFyaWFibGVfc2VsZWN0b3IubGVuZ3RoID09PSAwKSlcbiAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KGAke2kxOG5QcmVmaXh9bm9kZXMucXVlc3Rpb25DbGFzc2lmaWVycy5pbnB1dFZhcnNgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG5cbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgIXBheWxvYWQubW9kZWwucHJvdmlkZXIpXG4gICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fWVycm9yTXNnLmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdChgJHtpMThuUHJlZml4fW5vZGVzLnF1ZXN0aW9uQ2xhc3NpZmllcnMubW9kZWxgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG5cbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgKCFwYXlsb2FkLmNsYXNzZXMgfHwgcGF5bG9hZC5jbGFzc2VzLmxlbmd0aCA9PT0gMCkpXG4gICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fWVycm9yTXNnLmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdChgJHtpMThuUHJlZml4fW5vZGVzLnF1ZXN0aW9uQ2xhc3NpZmllcnMuY2xhc3NgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG5cbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgKHBheWxvYWQuY2xhc3Nlcy5zb21lKGl0ZW0gPT4gIWl0ZW0ubmFtZSkpKVxuICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH1lcnJvck1zZy5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoYCR7aTE4blByZWZpeH1ub2Rlcy5xdWVzdGlvbkNsYXNzaWZpZXJzLnRvcGljTmFtZWAsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcblxuICAgIGlmICghZXJyb3JNZXNzYWdlcyAmJiBwYXlsb2FkLnZpc2lvbj8uZW5hYmxlZCAmJiAhcGF5bG9hZC52aXNpb24uY29uZmlncz8udmFyaWFibGVfc2VsZWN0b3I/Lmxlbmd0aClcbiAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRzLnZpc2lvblZhcmlhYmxlYCwgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiAhZXJyb3JNZXNzYWdlcyxcbiAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlcyxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVEZWZhdWx0XG4iXX0=