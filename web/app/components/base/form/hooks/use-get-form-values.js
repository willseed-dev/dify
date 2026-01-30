"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetFormValues = void 0;
const react_1 = require("react");
const secret_input_1 = require("../utils/secret-input");
const use_check_validated_1 = require("./use-check-validated");
const useGetFormValues = (form, formSchemas) => {
    const { checkValidated } = (0, use_check_validated_1.useCheckValidated)(form, formSchemas);
    const getFormValues = (0, react_1.useCallback)(({ needCheckValidatedValues = true, needTransformWhenSecretFieldIsPristine, }) => {
        const values = form?.store.state.values || {};
        if (!needCheckValidatedValues) {
            return {
                values,
                isCheckValidated: true,
            };
        }
        if (checkValidated()) {
            return {
                values: needTransformWhenSecretFieldIsPristine ? (0, secret_input_1.getTransformedValuesWhenSecretInputPristine)(formSchemas, form) : values,
                isCheckValidated: true,
            };
        }
        else {
            return {
                values: {},
                isCheckValidated: false,
            };
        }
    }, [form, checkValidated, formSchemas]);
    return {
        getFormValues,
    };
};
exports.useGetFormValues = useGetFormValues;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWdldC1mb3JtLXZhbHVlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1nZXQtZm9ybS12YWx1ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0EsaUNBQW1DO0FBQ25DLHdEQUFtRjtBQUNuRiwrREFBeUQ7QUFFbEQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQWdCLEVBQUUsV0FBeUIsRUFBRSxFQUFFO0lBQzlFLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxJQUFBLHVDQUFpQixFQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUUvRCxNQUFNLGFBQWEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FDaEMsRUFDRSx3QkFBd0IsR0FBRyxJQUFJLEVBQy9CLHNDQUFzQyxHQUNyQixFQUNuQixFQUFFO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQTtRQUM3QyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUM5QixPQUFPO2dCQUNMLE1BQU07Z0JBQ04sZ0JBQWdCLEVBQUUsSUFBSTthQUN2QixDQUFBO1FBQ0gsQ0FBQztRQUVELElBQUksY0FBYyxFQUFFLEVBQUUsQ0FBQztZQUNyQixPQUFPO2dCQUNMLE1BQU0sRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsSUFBQSwwREFBMkMsRUFBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQ3hILGdCQUFnQixFQUFFLElBQUk7YUFDdkIsQ0FBQTtRQUNILENBQUM7YUFDSSxDQUFDO1lBQ0osT0FBTztnQkFDTCxNQUFNLEVBQUUsRUFBRTtnQkFDVixnQkFBZ0IsRUFBRSxLQUFLO2FBQ3hCLENBQUE7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBO0lBRXZDLE9BQU87UUFDTCxhQUFhO0tBQ2QsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQWxDWSxRQUFBLGdCQUFnQixvQkFrQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBbnlGb3JtQXBpIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LWZvcm0nXG5pbXBvcnQgdHlwZSB7XG4gIEZvcm1TY2hlbWEsXG4gIEdldFZhbHVlc09wdGlvbnMsXG59IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGdldFRyYW5zZm9ybWVkVmFsdWVzV2hlblNlY3JldElucHV0UHJpc3RpbmUgfSBmcm9tICcuLi91dGlscy9zZWNyZXQtaW5wdXQnXG5pbXBvcnQgeyB1c2VDaGVja1ZhbGlkYXRlZCB9IGZyb20gJy4vdXNlLWNoZWNrLXZhbGlkYXRlZCdcblxuZXhwb3J0IGNvbnN0IHVzZUdldEZvcm1WYWx1ZXMgPSAoZm9ybTogQW55Rm9ybUFwaSwgZm9ybVNjaGVtYXM6IEZvcm1TY2hlbWFbXSkgPT4ge1xuICBjb25zdCB7IGNoZWNrVmFsaWRhdGVkIH0gPSB1c2VDaGVja1ZhbGlkYXRlZChmb3JtLCBmb3JtU2NoZW1hcylcblxuICBjb25zdCBnZXRGb3JtVmFsdWVzID0gdXNlQ2FsbGJhY2soKFxuICAgIHtcbiAgICAgIG5lZWRDaGVja1ZhbGlkYXRlZFZhbHVlcyA9IHRydWUsXG4gICAgICBuZWVkVHJhbnNmb3JtV2hlblNlY3JldEZpZWxkSXNQcmlzdGluZSxcbiAgICB9OiBHZXRWYWx1ZXNPcHRpb25zLFxuICApID0+IHtcbiAgICBjb25zdCB2YWx1ZXMgPSBmb3JtPy5zdG9yZS5zdGF0ZS52YWx1ZXMgfHwge31cbiAgICBpZiAoIW5lZWRDaGVja1ZhbGlkYXRlZFZhbHVlcykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWVzLFxuICAgICAgICBpc0NoZWNrVmFsaWRhdGVkOiB0cnVlLFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjaGVja1ZhbGlkYXRlZCgpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZXM6IG5lZWRUcmFuc2Zvcm1XaGVuU2VjcmV0RmllbGRJc1ByaXN0aW5lID8gZ2V0VHJhbnNmb3JtZWRWYWx1ZXNXaGVuU2VjcmV0SW5wdXRQcmlzdGluZShmb3JtU2NoZW1hcywgZm9ybSkgOiB2YWx1ZXMsXG4gICAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWVzOiB7fSxcbiAgICAgICAgaXNDaGVja1ZhbGlkYXRlZDogZmFsc2UsXG4gICAgICB9XG4gICAgfVxuICB9LCBbZm9ybSwgY2hlY2tWYWxpZGF0ZWQsIGZvcm1TY2hlbWFzXSlcblxuICByZXR1cm4ge1xuICAgIGdldEZvcm1WYWx1ZXMsXG4gIH1cbn1cbiJdfQ==