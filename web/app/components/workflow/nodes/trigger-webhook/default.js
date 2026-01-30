"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const parameter_type_utils_1 = require("./utils/parameter-type-utils");
const raw_variable_1 = require("./utils/raw-variable");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: 3,
    type: types_1.BlockEnum.TriggerWebhook,
    helpLinkUri: 'webhook-trigger',
    isStart: true,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        webhook_url: '',
        method: 'POST',
        content_type: 'application/json',
        headers: [],
        params: [],
        body: [],
        async_mode: true,
        status_code: 200,
        response_body: '',
        variables: [(0, raw_variable_1.createWebhookRawVariable)()],
    },
    checkValid(payload, t) {
        // Require webhook_url to be configured
        if (!payload.webhook_url || payload.webhook_url.trim() === '') {
            return {
                isValid: false,
                errorMessage: t('nodes.triggerWebhook.validation.webhookUrlRequired', { ns: 'workflow' }),
            };
        }
        // Validate parameter types for params and body
        const parametersWithTypes = [
            ...(payload.params || []),
            ...(payload.body || []),
        ];
        for (const param of parametersWithTypes) {
            // Validate parameter type is valid
            if (!(0, parameter_type_utils_1.isValidParameterType)(param.type)) {
                return {
                    isValid: false,
                    errorMessage: t('nodes.triggerWebhook.validation.invalidParameterType', {
                        ns: 'workflow',
                        name: param.name,
                        type: param.type,
                    }),
                };
            }
        }
        return {
            isValid: true,
            errorMessage: '',
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx1Q0FBdUM7QUFDdkMsdUNBQTZDO0FBQzdDLHVFQUFtRTtBQUNuRSx1REFBK0Q7QUFFL0QsTUFBTSxRQUFRLEdBQUcsSUFBQSx1QkFBZSxFQUFDO0lBQy9CLElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFTLENBQUMsY0FBYztJQUM5QixXQUFXLEVBQUUsaUJBQWlCO0lBQzlCLE9BQU8sRUFBRSxJQUFJO0NBQ2QsQ0FBQyxDQUFBO0FBRUYsTUFBTSxXQUFXLEdBQXdDO0lBQ3ZELFFBQVE7SUFDUixZQUFZLEVBQUU7UUFDWixXQUFXLEVBQUUsRUFBRTtRQUNmLE1BQU0sRUFBRSxNQUFNO1FBQ2QsWUFBWSxFQUFFLGtCQUFrQjtRQUNoQyxPQUFPLEVBQUUsRUFBRTtRQUNYLE1BQU0sRUFBRSxFQUFFO1FBQ1YsSUFBSSxFQUFFLEVBQUU7UUFDUixVQUFVLEVBQUUsSUFBSTtRQUNoQixXQUFXLEVBQUUsR0FBRztRQUNoQixhQUFhLEVBQUUsRUFBRTtRQUNqQixTQUFTLEVBQUUsQ0FBQyxJQUFBLHVDQUF3QixHQUFFLENBQUM7S0FDeEM7SUFDRCxVQUFVLENBQUMsT0FBK0IsRUFBRSxDQUFNO1FBQ2hELHVDQUF1QztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQzlELE9BQU87Z0JBQ0wsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsWUFBWSxFQUFFLENBQUMsQ0FBQyxvREFBb0QsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQzthQUMxRixDQUFBO1FBQ0gsQ0FBQztRQUVELCtDQUErQztRQUMvQyxNQUFNLG1CQUFtQixHQUFHO1lBQzFCLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUN6QixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7U0FDeEIsQ0FBQTtRQUVELEtBQUssTUFBTSxLQUFLLElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUN4QyxtQ0FBbUM7WUFDbkMsSUFBSSxDQUFDLElBQUEsMkNBQW9CLEVBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3RDLE9BQU87b0JBQ0wsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsWUFBWSxFQUFFLENBQUMsQ0FBQyxzREFBc0QsRUFBRTt3QkFDdEUsRUFBRSxFQUFFLFVBQVU7d0JBQ2QsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO3dCQUNoQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7cUJBQ2pCLENBQUM7aUJBQ0gsQ0FBQTtZQUNILENBQUM7UUFDSCxDQUFDO1FBRUQsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJO1lBQ2IsWUFBWSxFQUFFLEVBQUU7U0FDakIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb2RlRGVmYXVsdCB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBXZWJob29rVHJpZ2dlck5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgZ2VuTm9kZU1ldGFEYXRhIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5pbXBvcnQgeyBpc1ZhbGlkUGFyYW1ldGVyVHlwZSB9IGZyb20gJy4vdXRpbHMvcGFyYW1ldGVyLXR5cGUtdXRpbHMnXG5pbXBvcnQgeyBjcmVhdGVXZWJob29rUmF3VmFyaWFibGUgfSBmcm9tICcuL3V0aWxzL3Jhdy12YXJpYWJsZSdcblxuY29uc3QgbWV0YURhdGEgPSBnZW5Ob2RlTWV0YURhdGEoe1xuICBzb3J0OiAzLFxuICB0eXBlOiBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2ssXG4gIGhlbHBMaW5rVXJpOiAnd2ViaG9vay10cmlnZ2VyJyxcbiAgaXNTdGFydDogdHJ1ZSxcbn0pXG5cbmNvbnN0IG5vZGVEZWZhdWx0OiBOb2RlRGVmYXVsdDxXZWJob29rVHJpZ2dlck5vZGVUeXBlPiA9IHtcbiAgbWV0YURhdGEsXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIHdlYmhvb2tfdXJsOiAnJyxcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBjb250ZW50X3R5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBoZWFkZXJzOiBbXSxcbiAgICBwYXJhbXM6IFtdLFxuICAgIGJvZHk6IFtdLFxuICAgIGFzeW5jX21vZGU6IHRydWUsXG4gICAgc3RhdHVzX2NvZGU6IDIwMCxcbiAgICByZXNwb25zZV9ib2R5OiAnJyxcbiAgICB2YXJpYWJsZXM6IFtjcmVhdGVXZWJob29rUmF3VmFyaWFibGUoKV0sXG4gIH0sXG4gIGNoZWNrVmFsaWQocGF5bG9hZDogV2ViaG9va1RyaWdnZXJOb2RlVHlwZSwgdDogYW55KSB7XG4gICAgLy8gUmVxdWlyZSB3ZWJob29rX3VybCB0byBiZSBjb25maWd1cmVkXG4gICAgaWYgKCFwYXlsb2FkLndlYmhvb2tfdXJsIHx8IHBheWxvYWQud2ViaG9va191cmwudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIGVycm9yTWVzc2FnZTogdCgnbm9kZXMudHJpZ2dlcldlYmhvb2sudmFsaWRhdGlvbi53ZWJob29rVXJsUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZhbGlkYXRlIHBhcmFtZXRlciB0eXBlcyBmb3IgcGFyYW1zIGFuZCBib2R5XG4gICAgY29uc3QgcGFyYW1ldGVyc1dpdGhUeXBlcyA9IFtcbiAgICAgIC4uLihwYXlsb2FkLnBhcmFtcyB8fCBbXSksXG4gICAgICAuLi4ocGF5bG9hZC5ib2R5IHx8IFtdKSxcbiAgICBdXG5cbiAgICBmb3IgKGNvbnN0IHBhcmFtIG9mIHBhcmFtZXRlcnNXaXRoVHlwZXMpIHtcbiAgICAgIC8vIFZhbGlkYXRlIHBhcmFtZXRlciB0eXBlIGlzIHZhbGlkXG4gICAgICBpZiAoIWlzVmFsaWRQYXJhbWV0ZXJUeXBlKHBhcmFtLnR5cGUpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdub2Rlcy50cmlnZ2VyV2ViaG9vay52YWxpZGF0aW9uLmludmFsaWRQYXJhbWV0ZXJUeXBlJywge1xuICAgICAgICAgICAgbnM6ICd3b3JrZmxvdycsXG4gICAgICAgICAgICBuYW1lOiBwYXJhbS5uYW1lLFxuICAgICAgICAgICAgdHlwZTogcGFyYW0udHlwZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgZXJyb3JNZXNzYWdlOiAnJyxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVEZWZhdWx0XG4iXX0=