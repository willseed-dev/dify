"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const i18nPrefix = 'errorMsg';
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.Transform,
    sort: 4,
    type: types_2.BlockEnum.DocExtractor,
    helpLinkUri: 'doc-extractor',
});
const nodeDefault = {
    metaData,
    defaultValue: {
        variable_selector: [],
        is_array_file: false,
    },
    checkValid(payload, t) {
        let errorMessages = '';
        const { variable_selector: variable } = payload;
        if (!errorMessages && !variable?.length)
            errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.assigner.assignedVariable', { ns: 'workflow' }) });
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUVqRSxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFFN0IsTUFBTSxRQUFRLEdBQUcsSUFBQSx1QkFBZSxFQUFDO0lBQy9CLGNBQWMsRUFBRSwrQkFBdUIsQ0FBQyxTQUFTO0lBQ2pELElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFTLENBQUMsWUFBWTtJQUM1QixXQUFXLEVBQUUsZUFBZTtDQUM3QixDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBc0M7SUFDckQsUUFBUTtJQUNSLFlBQVksRUFBRTtRQUNaLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsYUFBYSxFQUFFLEtBQUs7S0FDckI7SUFDRCxVQUFVLENBQUMsT0FBNkIsRUFBRSxDQUFNO1FBQzlDLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQTtRQUN0QixNQUFNLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFBO1FBRS9DLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTTtZQUNyQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxpQ0FBaUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUV2SSxPQUFPO1lBQ0wsT0FBTyxFQUFFLENBQUMsYUFBYTtZQUN2QixZQUFZLEVBQUUsYUFBYTtTQUM1QixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IERvY0V4dHJhY3Rvck5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuXG5jb25zdCBpMThuUHJlZml4ID0gJ2Vycm9yTXNnJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5UcmFuc2Zvcm0sXG4gIHNvcnQ6IDQsXG4gIHR5cGU6IEJsb2NrRW51bS5Eb2NFeHRyYWN0b3IsXG4gIGhlbHBMaW5rVXJpOiAnZG9jLWV4dHJhY3RvcicsXG59KVxuY29uc3Qgbm9kZURlZmF1bHQ6IE5vZGVEZWZhdWx0PERvY0V4dHJhY3Rvck5vZGVUeXBlPiA9IHtcbiAgbWV0YURhdGEsXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIHZhcmlhYmxlX3NlbGVjdG9yOiBbXSxcbiAgICBpc19hcnJheV9maWxlOiBmYWxzZSxcbiAgfSxcbiAgY2hlY2tWYWxpZChwYXlsb2FkOiBEb2NFeHRyYWN0b3JOb2RlVHlwZSwgdDogYW55KSB7XG4gICAgbGV0IGVycm9yTWVzc2FnZXMgPSAnJ1xuICAgIGNvbnN0IHsgdmFyaWFibGVfc2VsZWN0b3I6IHZhcmlhYmxlIH0gPSBwYXlsb2FkXG5cbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgIXZhcmlhYmxlPy5sZW5ndGgpXG4gICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoJ25vZGVzLmFzc2lnbmVyLmFzc2lnbmVkVmFyaWFibGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogIWVycm9yTWVzc2FnZXMsXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZXMsXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBub2RlRGVmYXVsdFxuIl19