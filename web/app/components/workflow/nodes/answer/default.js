"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: 2.1,
    type: types_1.BlockEnum.Answer,
    isRequired: true,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        variables: [],
        answer: '',
    },
    checkValid(payload, t) {
        let errorMessages = '';
        const { answer } = payload;
        if (!answer)
            errorMessages = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('nodes.answer.answer', { ns: 'workflow' }) });
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyREFBMkQ7QUFDM0QsMkRBQWlFO0FBRWpFLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxpQkFBUyxDQUFDLE1BQU07SUFDdEIsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxXQUFXLEdBQWdDO0lBQy9DLFFBQVE7SUFDUixZQUFZLEVBQUU7UUFDWixTQUFTLEVBQUUsRUFBRTtRQUNiLE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxVQUFVLENBQUMsT0FBdUIsRUFBRSxDQUFNO1FBQ3hDLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQTtRQUN0QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFBO1FBQzFCLElBQUksQ0FBQyxNQUFNO1lBQ1QsYUFBYSxHQUFHLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUV0SCxPQUFPO1lBQ0wsT0FBTyxFQUFFLENBQUMsYUFBYTtZQUN2QixZQUFZLEVBQUUsYUFBYTtTQUM1QixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEFuc3dlck5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIHNvcnQ6IDIuMSxcbiAgdHlwZTogQmxvY2tFbnVtLkFuc3dlcixcbiAgaXNSZXF1aXJlZDogdHJ1ZSxcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8QW5zd2VyTm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgdmFyaWFibGVzOiBbXSxcbiAgICBhbnN3ZXI6ICcnLFxuICB9LFxuICBjaGVja1ZhbGlkKHBheWxvYWQ6IEFuc3dlck5vZGVUeXBlLCB0OiBhbnkpIHtcbiAgICBsZXQgZXJyb3JNZXNzYWdlcyA9ICcnXG4gICAgY29uc3QgeyBhbnN3ZXIgfSA9IHBheWxvYWRcbiAgICBpZiAoIWFuc3dlcilcbiAgICAgIGVycm9yTWVzc2FnZXMgPSB0KCdlcnJvck1zZy5maWVsZFJlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoJ25vZGVzLmFuc3dlci5hbnN3ZXInLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogIWVycm9yTWVzc2FnZXMsXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZXMsXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBub2RlRGVmYXVsdFxuIl19