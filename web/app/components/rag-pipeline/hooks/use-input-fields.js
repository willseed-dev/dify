"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfigurations = exports.useInitialData = void 0;
const react_1 = require("react");
const types_1 = require("@/app/components/base/form/form-scenarios/base/types");
const pipeline_1 = require("@/models/pipeline");
const useInitialData = (variables, lastRunInputData) => {
    const initialData = (0, react_1.useMemo)(() => {
        return variables.reduce((acc, item) => {
            const type = pipeline_1.VAR_TYPE_MAP[item.type];
            const variableName = item.variable;
            const defaultValue = lastRunInputData?.[variableName] || item.default_value;
            if ([types_1.BaseFieldType.textInput, types_1.BaseFieldType.paragraph, types_1.BaseFieldType.select].includes(type))
                acc[variableName] = defaultValue ?? '';
            if (type === types_1.BaseFieldType.numberInput)
                acc[variableName] = defaultValue ?? 0;
            if (type === types_1.BaseFieldType.checkbox)
                acc[variableName] = defaultValue ?? false;
            if ([types_1.BaseFieldType.file, types_1.BaseFieldType.fileList].includes(type))
                acc[variableName] = defaultValue ?? [];
            return acc;
        }, {});
    }, [lastRunInputData, variables]);
    return initialData;
};
exports.useInitialData = useInitialData;
const useConfigurations = (variables) => {
    const configurations = (0, react_1.useMemo)(() => {
        const configurations = [];
        variables.forEach((item) => {
            configurations.push({
                type: pipeline_1.VAR_TYPE_MAP[item.type],
                variable: item.variable,
                label: item.label,
                required: item.required,
                maxLength: item.max_length,
                options: item.options?.map(option => ({
                    label: option,
                    value: option,
                })),
                showConditions: [],
                placeholder: item.placeholder,
                tooltip: item.tooltips,
                unit: item.unit,
                allowedFileTypes: item.allowed_file_types,
                allowedFileExtensions: item.allowed_file_extensions,
                allowedFileUploadMethods: item.allowed_file_upload_methods,
            });
        });
        return configurations;
    }, [variables]);
    return configurations;
};
exports.useConfigurations = useConfigurations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWlucHV0LWZpZWxkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1pbnB1dC1maWVsZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsaUNBQStCO0FBQy9CLGdGQUFvRjtBQUNwRixnREFBZ0Q7QUFFekMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUErQixFQUFFLGdCQUFzQyxFQUFFLEVBQUU7SUFDeEcsTUFBTSxXQUFXLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQy9CLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNwQyxNQUFNLElBQUksR0FBRyx1QkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNwQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO1lBQ2xDLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQTtZQUMzRSxJQUFJLENBQUMscUJBQWEsQ0FBQyxTQUFTLEVBQUUscUJBQWEsQ0FBQyxTQUFTLEVBQUUscUJBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUN6RixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsWUFBWSxJQUFJLEVBQUUsQ0FBQTtZQUN4QyxJQUFJLElBQUksS0FBSyxxQkFBYSxDQUFDLFdBQVc7Z0JBQ3BDLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxZQUFZLElBQUksQ0FBQyxDQUFBO1lBQ3ZDLElBQUksSUFBSSxLQUFLLHFCQUFhLENBQUMsUUFBUTtnQkFDakMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLFlBQVksSUFBSSxLQUFLLENBQUE7WUFDM0MsSUFBSSxDQUFDLHFCQUFhLENBQUMsSUFBSSxFQUFFLHFCQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDN0QsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLFlBQVksSUFBSSxFQUFFLENBQUE7WUFDeEMsT0FBTyxHQUFHLENBQUE7UUFDWixDQUFDLEVBQUUsRUFBeUIsQ0FBQyxDQUFBO0lBQy9CLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFakMsT0FBTyxXQUFXLENBQUE7QUFDcEIsQ0FBQyxDQUFBO0FBbkJZLFFBQUEsY0FBYyxrQkFtQjFCO0FBRU0sTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFNBQStCLEVBQUUsRUFBRTtJQUNuRSxNQUFNLGNBQWMsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDbEMsTUFBTSxjQUFjLEdBQXdCLEVBQUUsQ0FBQTtRQUM5QyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDekIsY0FBYyxDQUFDLElBQUksQ0FBQztnQkFDbEIsSUFBSSxFQUFFLHVCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDN0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUMxQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNwQyxLQUFLLEVBQUUsTUFBTTtvQkFDYixLQUFLLEVBQUUsTUFBTTtpQkFDZCxDQUFDLENBQUM7Z0JBQ0gsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN0QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtnQkFDekMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHVCQUF1QjtnQkFDbkQsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLDJCQUEyQjthQUMzRCxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sY0FBYyxDQUFBO0lBQ3ZCLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFZixPQUFPLGNBQWMsQ0FBQTtBQUN2QixDQUFDLENBQUE7QUEzQlksUUFBQSxpQkFBaUIscUJBMkI3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQmFzZUNvbmZpZ3VyYXRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9iYXNlL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBSQUdQaXBlbGluZVZhcmlhYmxlcyB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQmFzZUZpZWxkVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL2Zvcm0tc2NlbmFyaW9zL2Jhc2UvdHlwZXMnXG5pbXBvcnQgeyBWQVJfVFlQRV9NQVAgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcblxuZXhwb3J0IGNvbnN0IHVzZUluaXRpYWxEYXRhID0gKHZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZXMsIGxhc3RSdW5JbnB1dERhdGE/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gIGNvbnN0IGluaXRpYWxEYXRhID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHZhcmlhYmxlcy5yZWR1Y2UoKGFjYywgaXRlbSkgPT4ge1xuICAgICAgY29uc3QgdHlwZSA9IFZBUl9UWVBFX01BUFtpdGVtLnR5cGVdXG4gICAgICBjb25zdCB2YXJpYWJsZU5hbWUgPSBpdGVtLnZhcmlhYmxlXG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBsYXN0UnVuSW5wdXREYXRhPy5bdmFyaWFibGVOYW1lXSB8fCBpdGVtLmRlZmF1bHRfdmFsdWVcbiAgICAgIGlmIChbQmFzZUZpZWxkVHlwZS50ZXh0SW5wdXQsIEJhc2VGaWVsZFR5cGUucGFyYWdyYXBoLCBCYXNlRmllbGRUeXBlLnNlbGVjdF0uaW5jbHVkZXModHlwZSkpXG4gICAgICAgIGFjY1t2YXJpYWJsZU5hbWVdID0gZGVmYXVsdFZhbHVlID8/ICcnXG4gICAgICBpZiAodHlwZSA9PT0gQmFzZUZpZWxkVHlwZS5udW1iZXJJbnB1dClcbiAgICAgICAgYWNjW3ZhcmlhYmxlTmFtZV0gPSBkZWZhdWx0VmFsdWUgPz8gMFxuICAgICAgaWYgKHR5cGUgPT09IEJhc2VGaWVsZFR5cGUuY2hlY2tib3gpXG4gICAgICAgIGFjY1t2YXJpYWJsZU5hbWVdID0gZGVmYXVsdFZhbHVlID8/IGZhbHNlXG4gICAgICBpZiAoW0Jhc2VGaWVsZFR5cGUuZmlsZSwgQmFzZUZpZWxkVHlwZS5maWxlTGlzdF0uaW5jbHVkZXModHlwZSkpXG4gICAgICAgIGFjY1t2YXJpYWJsZU5hbWVdID0gZGVmYXVsdFZhbHVlID8/IFtdXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgYW55PilcbiAgfSwgW2xhc3RSdW5JbnB1dERhdGEsIHZhcmlhYmxlc10pXG5cbiAgcmV0dXJuIGluaXRpYWxEYXRhXG59XG5cbmV4cG9ydCBjb25zdCB1c2VDb25maWd1cmF0aW9ucyA9ICh2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVzKSA9PiB7XG4gIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgY29uZmlndXJhdGlvbnM6IEJhc2VDb25maWd1cmF0aW9uW10gPSBbXVxuICAgIHZhcmlhYmxlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25maWd1cmF0aW9ucy5wdXNoKHtcbiAgICAgICAgdHlwZTogVkFSX1RZUEVfTUFQW2l0ZW0udHlwZV0sXG4gICAgICAgIHZhcmlhYmxlOiBpdGVtLnZhcmlhYmxlLFxuICAgICAgICBsYWJlbDogaXRlbS5sYWJlbCxcbiAgICAgICAgcmVxdWlyZWQ6IGl0ZW0ucmVxdWlyZWQsXG4gICAgICAgIG1heExlbmd0aDogaXRlbS5tYXhfbGVuZ3RoLFxuICAgICAgICBvcHRpb25zOiBpdGVtLm9wdGlvbnM/Lm1hcChvcHRpb24gPT4gKHtcbiAgICAgICAgICBsYWJlbDogb3B0aW9uLFxuICAgICAgICAgIHZhbHVlOiBvcHRpb24sXG4gICAgICAgIH0pKSxcbiAgICAgICAgc2hvd0NvbmRpdGlvbnM6IFtdLFxuICAgICAgICBwbGFjZWhvbGRlcjogaXRlbS5wbGFjZWhvbGRlcixcbiAgICAgICAgdG9vbHRpcDogaXRlbS50b29sdGlwcyxcbiAgICAgICAgdW5pdDogaXRlbS51bml0LFxuICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBpdGVtLmFsbG93ZWRfZmlsZV90eXBlcyxcbiAgICAgICAgYWxsb3dlZEZpbGVFeHRlbnNpb25zOiBpdGVtLmFsbG93ZWRfZmlsZV9leHRlbnNpb25zLFxuICAgICAgICBhbGxvd2VkRmlsZVVwbG9hZE1ldGhvZHM6IGl0ZW0uYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzLFxuICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiBjb25maWd1cmF0aW9uc1xuICB9LCBbdmFyaWFibGVzXSlcblxuICByZXR1cm4gY29uZmlndXJhdGlvbnNcbn1cbiJdfQ==