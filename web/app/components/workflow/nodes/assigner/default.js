"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const types_3 = require("./types");
const i18nPrefix = 'errorMsg';
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.Transform,
    sort: 5,
    type: types_2.BlockEnum.Assigner,
    helpLinkUri: 'variable-assigner',
});
const nodeDefault = {
    metaData,
    defaultValue: {
        version: '2',
        items: [],
    },
    checkValid(payload, t) {
        let errorMessages = '';
        const { items: operationItems, } = payload;
        operationItems?.forEach((value) => {
            if (!errorMessages && !value.variable_selector?.length)
                errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.assigner.assignedVariable', { ns: 'workflow' }) });
            if (!errorMessages && value.operation !== types_3.WriteMode.clear && value.operation !== types_3.WriteMode.removeFirst && value.operation !== types_3.WriteMode.removeLast) {
                if (value.operation === types_3.WriteMode.set || value.operation === types_3.WriteMode.increment
                    || value.operation === types_3.WriteMode.decrement || value.operation === types_3.WriteMode.multiply
                    || value.operation === types_3.WriteMode.divide) {
                    if (!value.value && value.value !== false && typeof value.value !== 'number')
                        errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.assigner.variable', { ns: 'workflow' }) });
                }
                else if (!value.value?.length) {
                    errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.assigner.variable', { ns: 'workflow' }) });
                }
            }
        });
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUNqRSxtQ0FBbUM7QUFFbkMsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBRTdCLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixjQUFjLEVBQUUsK0JBQXVCLENBQUMsU0FBUztJQUNqRCxJQUFJLEVBQUUsQ0FBQztJQUNQLElBQUksRUFBRSxpQkFBUyxDQUFDLFFBQVE7SUFDeEIsV0FBVyxFQUFFLG1CQUFtQjtDQUNqQyxDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBa0M7SUFDakQsUUFBUTtJQUNSLFlBQVksRUFBRTtRQUNaLE9BQU8sRUFBRSxHQUFHO1FBQ1osS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUNELFVBQVUsQ0FBQyxPQUF5QixFQUFFLENBQU07UUFDMUMsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLE1BQU0sRUFDSixLQUFLLEVBQUUsY0FBYyxHQUN0QixHQUFHLE9BQU8sQ0FBQTtRQUVYLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNoQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLE1BQU07Z0JBQ3BELGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLGlDQUFpQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBRXZJLElBQUksQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLFNBQVMsS0FBSyxpQkFBUyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLGlCQUFTLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssaUJBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbkosSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLGlCQUFTLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssaUJBQVMsQ0FBQyxTQUFTO3VCQUMzRSxLQUFLLENBQUMsU0FBUyxLQUFLLGlCQUFTLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssaUJBQVMsQ0FBQyxRQUFRO3VCQUNqRixLQUFLLENBQUMsU0FBUyxLQUFLLGlCQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssS0FBSyxRQUFRO3dCQUMxRSxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDakksQ0FBQztxQkFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQztvQkFDOUIsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQy9ILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixPQUFPO1lBQ0wsT0FBTyxFQUFFLENBQUMsYUFBYTtZQUN2QixZQUFZLEVBQUUsYUFBYTtTQUM1QixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEFzc2lnbmVyTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdlbk5vZGVNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG5pbXBvcnQgeyBXcml0ZU1vZGUgfSBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBpMThuUHJlZml4ID0gJ2Vycm9yTXNnJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5UcmFuc2Zvcm0sXG4gIHNvcnQ6IDUsXG4gIHR5cGU6IEJsb2NrRW51bS5Bc3NpZ25lcixcbiAgaGVscExpbmtVcmk6ICd2YXJpYWJsZS1hc3NpZ25lcicsXG59KVxuY29uc3Qgbm9kZURlZmF1bHQ6IE5vZGVEZWZhdWx0PEFzc2lnbmVyTm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgdmVyc2lvbjogJzInLFxuICAgIGl0ZW1zOiBbXSxcbiAgfSxcbiAgY2hlY2tWYWxpZChwYXlsb2FkOiBBc3NpZ25lck5vZGVUeXBlLCB0OiBhbnkpIHtcbiAgICBsZXQgZXJyb3JNZXNzYWdlcyA9ICcnXG4gICAgY29uc3Qge1xuICAgICAgaXRlbXM6IG9wZXJhdGlvbkl0ZW1zLFxuICAgIH0gPSBwYXlsb2FkXG5cbiAgICBvcGVyYXRpb25JdGVtcz8uZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgIGlmICghZXJyb3JNZXNzYWdlcyAmJiAhdmFsdWUudmFyaWFibGVfc2VsZWN0b3I/Lmxlbmd0aClcbiAgICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH0uZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCdub2Rlcy5hc3NpZ25lci5hc3NpZ25lZFZhcmlhYmxlJywgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuXG4gICAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgdmFsdWUub3BlcmF0aW9uICE9PSBXcml0ZU1vZGUuY2xlYXIgJiYgdmFsdWUub3BlcmF0aW9uICE9PSBXcml0ZU1vZGUucmVtb3ZlRmlyc3QgJiYgdmFsdWUub3BlcmF0aW9uICE9PSBXcml0ZU1vZGUucmVtb3ZlTGFzdCkge1xuICAgICAgICBpZiAodmFsdWUub3BlcmF0aW9uID09PSBXcml0ZU1vZGUuc2V0IHx8IHZhbHVlLm9wZXJhdGlvbiA9PT0gV3JpdGVNb2RlLmluY3JlbWVudFxuICAgICAgICAgIHx8IHZhbHVlLm9wZXJhdGlvbiA9PT0gV3JpdGVNb2RlLmRlY3JlbWVudCB8fCB2YWx1ZS5vcGVyYXRpb24gPT09IFdyaXRlTW9kZS5tdWx0aXBseVxuICAgICAgICAgIHx8IHZhbHVlLm9wZXJhdGlvbiA9PT0gV3JpdGVNb2RlLmRpdmlkZSkge1xuICAgICAgICAgIGlmICghdmFsdWUudmFsdWUgJiYgdmFsdWUudmFsdWUgIT09IGZhbHNlICYmIHR5cGVvZiB2YWx1ZS52YWx1ZSAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoJ25vZGVzLmFzc2lnbmVyLnZhcmlhYmxlJywgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF2YWx1ZS52YWx1ZT8ubGVuZ3RoKSB7XG4gICAgICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH0uZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCdub2Rlcy5hc3NpZ25lci52YXJpYWJsZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogIWVycm9yTWVzc2FnZXMsXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZXMsXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBub2RlRGVmYXVsdFxuIl19