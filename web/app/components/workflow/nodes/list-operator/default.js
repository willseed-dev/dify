"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const utils_1 = require("@/app/components/workflow/utils");
const types_2 = require("../../types");
const utils_2 = require("../if-else/utils");
const types_3 = require("./types");
const i18nPrefix = 'errorMsg';
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.Utilities,
    sort: 2,
    type: types_2.BlockEnum.ListFilter,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        variable: [],
        filter_by: {
            enabled: false,
            conditions: [],
        },
        extract_by: {
            enabled: false,
            serial: '1',
        },
        order_by: {
            enabled: false,
            key: '',
            value: types_3.OrderBy.ASC,
        },
        limit: {
            enabled: false,
            size: 10,
        },
    },
    checkValid(payload, t) {
        let errorMessages = '';
        const { variable, var_type, filter_by, item_var_type } = payload;
        if (!errorMessages && !variable?.length)
            errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.listFilter.inputVar', { ns: 'workflow' }) });
        // Check filter condition
        if (!errorMessages && filter_by?.enabled) {
            if (var_type === types_2.VarType.arrayFile && !filter_by.conditions[0]?.key)
                errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.listFilter.filterConditionKey', { ns: 'workflow' }) });
            if (!errorMessages && !filter_by.conditions[0]?.comparison_operator)
                errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.listFilter.filterConditionComparisonOperator', { ns: 'workflow' }) });
            if (!errorMessages && !(0, utils_2.comparisonOperatorNotRequireValue)(filter_by.conditions[0]?.comparison_operator) && (item_var_type === types_2.VarType.boolean ? filter_by.conditions[0]?.value === undefined : !filter_by.conditions[0]?.value))
                errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.listFilter.filterConditionComparisonValue', { ns: 'workflow' }) });
        }
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQWlFO0FBQ2pFLHVDQUFnRDtBQUNoRCw0Q0FBb0U7QUFDcEUsbUNBQWlDO0FBRWpDLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUU3QixNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFlLEVBQUM7SUFDL0IsY0FBYyxFQUFFLCtCQUF1QixDQUFDLFNBQVM7SUFDakQsSUFBSSxFQUFFLENBQUM7SUFDUCxJQUFJLEVBQUUsaUJBQVMsQ0FBQyxVQUFVO0NBQzNCLENBQUMsQ0FBQTtBQUNGLE1BQU0sV0FBVyxHQUFvQztJQUNuRCxRQUFRO0lBQ1IsWUFBWSxFQUFFO1FBQ1osUUFBUSxFQUFFLEVBQUU7UUFDWixTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsS0FBSztZQUNkLFVBQVUsRUFBRSxFQUFFO1NBQ2Y7UUFDRCxVQUFVLEVBQUU7WUFDVixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSxHQUFHO1NBQ1o7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsS0FBSztZQUNkLEdBQUcsRUFBRSxFQUFFO1lBQ1AsS0FBSyxFQUFFLGVBQU8sQ0FBQyxHQUFHO1NBQ25CO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLEtBQUs7WUFDZCxJQUFJLEVBQUUsRUFBRTtTQUNUO0tBQ0Y7SUFDRCxVQUFVLENBQUMsT0FBMkIsRUFBRSxDQUFNO1FBQzVDLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQTtRQUN0QixNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLEdBQUcsT0FBTyxDQUFBO1FBRWhFLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTTtZQUNyQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUVqSSx5QkFBeUI7UUFDekIsSUFBSSxDQUFDLGFBQWEsSUFBSSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDekMsSUFBSSxRQUFRLEtBQUssZUFBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRztnQkFDakUsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMscUNBQXFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFM0ksSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CO2dCQUNqRSxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxvREFBb0QsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUUxSixJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBQSx5Q0FBaUMsRUFBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUssZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO2dCQUM1TixhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxpREFBaUQsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN6SixDQUFDO1FBRUQsT0FBTztZQUNMLE9BQU8sRUFBRSxDQUFDLGFBQWE7WUFDdkIsWUFBWSxFQUFFLGFBQWE7U0FDNUIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb2RlRGVmYXVsdCB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBMaXN0RmlsdGVyTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgZ2VuTm9kZU1ldGFEYXRhIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy91dGlscydcbmltcG9ydCB7IEJsb2NrRW51bSwgVmFyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgY29tcGFyaXNvbk9wZXJhdG9yTm90UmVxdWlyZVZhbHVlIH0gZnJvbSAnLi4vaWYtZWxzZS91dGlscydcbmltcG9ydCB7IE9yZGVyQnkgfSBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBpMThuUHJlZml4ID0gJ2Vycm9yTXNnJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5VdGlsaXRpZXMsXG4gIHNvcnQ6IDIsXG4gIHR5cGU6IEJsb2NrRW51bS5MaXN0RmlsdGVyLFxufSlcbmNvbnN0IG5vZGVEZWZhdWx0OiBOb2RlRGVmYXVsdDxMaXN0RmlsdGVyTm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgdmFyaWFibGU6IFtdLFxuICAgIGZpbHRlcl9ieToge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBjb25kaXRpb25zOiBbXSxcbiAgICB9LFxuICAgIGV4dHJhY3RfYnk6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgc2VyaWFsOiAnMScsXG4gICAgfSxcbiAgICBvcmRlcl9ieToge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBrZXk6ICcnLFxuICAgICAgdmFsdWU6IE9yZGVyQnkuQVNDLFxuICAgIH0sXG4gICAgbGltaXQ6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgc2l6ZTogMTAsXG4gICAgfSxcbiAgfSxcbiAgY2hlY2tWYWxpZChwYXlsb2FkOiBMaXN0RmlsdGVyTm9kZVR5cGUsIHQ6IGFueSkge1xuICAgIGxldCBlcnJvck1lc3NhZ2VzID0gJydcbiAgICBjb25zdCB7IHZhcmlhYmxlLCB2YXJfdHlwZSwgZmlsdGVyX2J5LCBpdGVtX3Zhcl90eXBlIH0gPSBwYXlsb2FkXG5cbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgIXZhcmlhYmxlPy5sZW5ndGgpXG4gICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoJ25vZGVzLmxpc3RGaWx0ZXIuaW5wdXRWYXInLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG5cbiAgICAvLyBDaGVjayBmaWx0ZXIgY29uZGl0aW9uXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmIGZpbHRlcl9ieT8uZW5hYmxlZCkge1xuICAgICAgaWYgKHZhcl90eXBlID09PSBWYXJUeXBlLmFycmF5RmlsZSAmJiAhZmlsdGVyX2J5LmNvbmRpdGlvbnNbMF0/LmtleSlcbiAgICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH0uZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCdub2Rlcy5saXN0RmlsdGVyLmZpbHRlckNvbmRpdGlvbktleScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcblxuICAgICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICFmaWx0ZXJfYnkuY29uZGl0aW9uc1swXT8uY29tcGFyaXNvbl9vcGVyYXRvcilcbiAgICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH0uZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCdub2Rlcy5saXN0RmlsdGVyLmZpbHRlckNvbmRpdGlvbkNvbXBhcmlzb25PcGVyYXRvcicsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcblxuICAgICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICFjb21wYXJpc29uT3BlcmF0b3JOb3RSZXF1aXJlVmFsdWUoZmlsdGVyX2J5LmNvbmRpdGlvbnNbMF0/LmNvbXBhcmlzb25fb3BlcmF0b3IpICYmIChpdGVtX3Zhcl90eXBlID09PSBWYXJUeXBlLmJvb2xlYW4gPyBmaWx0ZXJfYnkuY29uZGl0aW9uc1swXT8udmFsdWUgPT09IHVuZGVmaW5lZCA6ICFmaWx0ZXJfYnkuY29uZGl0aW9uc1swXT8udmFsdWUpKVxuICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoJ25vZGVzLmxpc3RGaWx0ZXIuZmlsdGVyQ29uZGl0aW9uQ29tcGFyaXNvblZhbHVlJywgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiAhZXJyb3JNZXNzYWdlcyxcbiAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlcyxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVEZWZhdWx0XG4iXX0=