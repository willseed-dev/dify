"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const i18n_config_1 = require("@/i18n-config");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: 3,
    type: types_1.BlockEnum.Agent,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        tool_node_version: '2',
    },
    checkValid(payload, t, moreDataForCheckValid) {
        const { strategy, language, isReadyForCheckValid } = moreDataForCheckValid;
        if (!isReadyForCheckValid) {
            return {
                isValid: true,
                errorMessage: '',
            };
        }
        if (!strategy) {
            return {
                isValid: false,
                errorMessage: t('nodes.agent.checkList.strategyNotSelected', { ns: 'workflow' }),
            };
        }
        for (const param of strategy.parameters) {
            // single tool
            if (param.required && param.type === declarations_1.FormTypeEnum.toolSelector) {
                // no value
                const toolValue = payload.agent_parameters?.[param.name]?.value;
                if (!toolValue) {
                    return {
                        isValid: false,
                        errorMessage: t('errorMsg.fieldRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language) }),
                    };
                }
                // not enabled
                else if (!toolValue.enabled) {
                    return {
                        isValid: false,
                        errorMessage: t('errorMsg.noValidTool', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language) }),
                    };
                }
                // check form of tool
                else {
                    const schemas = toolValue.schemas || [];
                    const userSettings = toolValue.settings;
                    const reasoningConfig = toolValue.parameters;
                    const version = payload.version;
                    const toolNodeVersion = payload.tool_node_version;
                    const mergeVersion = version || toolNodeVersion;
                    schemas.forEach((schema) => {
                        if (schema?.required) {
                            if (schema.form === 'form' && !mergeVersion && !userSettings[schema.name]?.value) {
                                return {
                                    isValid: false,
                                    errorMessage: t('errorMsg.toolParameterRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language), param: (0, i18n_config_1.renderI18nObject)(schema.label, language) }),
                                };
                            }
                            if (schema.form === 'form' && mergeVersion && !userSettings[schema.name]?.value.value) {
                                return {
                                    isValid: false,
                                    errorMessage: t('errorMsg.toolParameterRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language), param: (0, i18n_config_1.renderI18nObject)(schema.label, language) }),
                                };
                            }
                            if (schema.form === 'llm' && !mergeVersion && reasoningConfig[schema.name].auto === 0 && !reasoningConfig[schema.name]?.value) {
                                return {
                                    isValid: false,
                                    errorMessage: t('errorMsg.toolParameterRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language), param: (0, i18n_config_1.renderI18nObject)(schema.label, language) }),
                                };
                            }
                            if (schema.form === 'llm' && mergeVersion && reasoningConfig[schema.name].auto === 0 && !reasoningConfig[schema.name]?.value.value) {
                                return {
                                    isValid: false,
                                    errorMessage: t('errorMsg.toolParameterRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language), param: (0, i18n_config_1.renderI18nObject)(schema.label, language) }),
                                };
                            }
                        }
                    });
                }
            }
            // multiple tools
            if (param.required && param.type === declarations_1.FormTypeEnum.multiToolSelector) {
                const tools = payload.agent_parameters?.[param.name]?.value || [];
                // no value
                if (!tools.length) {
                    return {
                        isValid: false,
                        errorMessage: t('errorMsg.fieldRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language) }),
                    };
                }
                // not enabled
                else if (tools.every((tool) => !tool.enabled)) {
                    return {
                        isValid: false,
                        errorMessage: t('errorMsg.noValidTool', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language) }),
                    };
                }
                // check form of tools
                else {
                    const validState = {
                        isValid: true,
                        errorMessage: '',
                    };
                    for (const tool of tools) {
                        const schemas = tool.schemas || [];
                        const userSettings = tool.settings;
                        const reasoningConfig = tool.parameters;
                        schemas.forEach((schema) => {
                            if (schema?.required) {
                                if (schema.form === 'form' && !userSettings[schema.name]?.value) {
                                    return {
                                        isValid: false,
                                        errorMessage: t('errorMsg.toolParameterRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language), param: (0, i18n_config_1.renderI18nObject)(schema.label, language) }),
                                    };
                                }
                                if (schema.form === 'llm' && reasoningConfig[schema.name]?.auto === 0 && !reasoningConfig[schema.name]?.value) {
                                    return {
                                        isValid: false,
                                        errorMessage: t('errorMsg.toolParameterRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language), param: (0, i18n_config_1.renderI18nObject)(schema.label, language) }),
                                    };
                                }
                            }
                        });
                    }
                    return validState;
                }
            }
            // common params
            if (param.required && !(payload.agent_parameters?.[param.name]?.value || param.default)) {
                return {
                    isValid: false,
                    errorMessage: t('errorMsg.fieldRequired', { ns: 'workflow', field: (0, i18n_config_1.renderI18nObject)(param.label, language) }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwyR0FBdUc7QUFDdkcsK0NBQWdEO0FBQ2hELHVDQUF1QztBQUN2Qyx1Q0FBNkM7QUFFN0MsTUFBTSxRQUFRLEdBQUcsSUFBQSx1QkFBZSxFQUFDO0lBQy9CLElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFTLENBQUMsS0FBSztDQUN0QixDQUFDLENBQUE7QUFFRixNQUFNLFdBQVcsR0FBK0I7SUFDOUMsUUFBUTtJQUNSLFlBQVksRUFBRTtRQUNaLGlCQUFpQixFQUFFLEdBQUc7S0FDdkI7SUFDRCxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxxQkFLdEI7UUFDQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxHQUFHLHFCQUFxQixDQUFBO1FBQzFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzFCLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsWUFBWSxFQUFFLEVBQUU7YUFDakIsQ0FBQTtRQUNILENBQUM7UUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxPQUFPO2dCQUNMLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFlBQVksRUFBRSxDQUFDLENBQUMsMkNBQTJDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7YUFDakYsQ0FBQTtRQUNILENBQUM7UUFDRCxLQUFLLE1BQU0sS0FBSyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN4QyxjQUFjO1lBQ2QsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssMkJBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDL0QsV0FBVztnQkFDWCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUMs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LEVBQUUsQ0FBQztnQkFDeEYsT0FBTztvQkFDTCxPQUFPLEVBQUUsS0FBSztvQkFDZCxZQUFZLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBQSw4QkFBZ0IsRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUM7aUJBQzlHLENBQUE7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSTtZQUNiLFlBQVksRUFBRSxFQUFFO1NBQ2pCLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZURlZmF1bHQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgQWdlbnROb2RlVHlwZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFN0cmF0ZWd5RGV0YWlsLCBTdHJhdGVneVBsdWdpbkRldGFpbCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7IEZvcm1UeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IHJlbmRlckkxOG5PYmplY3QgfSBmcm9tICdAL2kxOG4tY29uZmlnJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICcuLi8uLi91dGlscydcblxuY29uc3QgbWV0YURhdGEgPSBnZW5Ob2RlTWV0YURhdGEoe1xuICBzb3J0OiAzLFxuICB0eXBlOiBCbG9ja0VudW0uQWdlbnQsXG59KVxuXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8QWdlbnROb2RlVHlwZT4gPSB7XG4gIG1ldGFEYXRhLFxuICBkZWZhdWx0VmFsdWU6IHtcbiAgICB0b29sX25vZGVfdmVyc2lvbjogJzInLFxuICB9LFxuICBjaGVja1ZhbGlkKHBheWxvYWQsIHQsIG1vcmVEYXRhRm9yQ2hlY2tWYWxpZDoge1xuICAgIHN0cmF0ZWd5UHJvdmlkZXI/OiBTdHJhdGVneVBsdWdpbkRldGFpbFxuICAgIHN0cmF0ZWd5PzogU3RyYXRlZ3lEZXRhaWxcbiAgICBsYW5ndWFnZTogc3RyaW5nXG4gICAgaXNSZWFkeUZvckNoZWNrVmFsaWQ6IGJvb2xlYW5cbiAgfSkge1xuICAgIGNvbnN0IHsgc3RyYXRlZ3ksIGxhbmd1YWdlLCBpc1JlYWR5Rm9yQ2hlY2tWYWxpZCB9ID0gbW9yZURhdGFGb3JDaGVja1ZhbGlkXG4gICAgaWYgKCFpc1JlYWR5Rm9yQ2hlY2tWYWxpZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnJyxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFzdHJhdGVneSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIGVycm9yTWVzc2FnZTogdCgnbm9kZXMuYWdlbnQuY2hlY2tMaXN0LnN0cmF0ZWd5Tm90U2VsZWN0ZWQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHBhcmFtIG9mIHN0cmF0ZWd5LnBhcmFtZXRlcnMpIHtcbiAgICAgIC8vIHNpbmdsZSB0b29sXG4gICAgICBpZiAocGFyYW0ucmVxdWlyZWQgJiYgcGFyYW0udHlwZSA9PT0gRm9ybVR5cGVFbnVtLnRvb2xTZWxlY3Rvcikge1xuICAgICAgICAvLyBubyB2YWx1ZVxuICAgICAgICBjb25zdCB0b29sVmFsdWUgPSBwYXlsb2FkLmFnZW50X3BhcmFtZXRlcnM/LltwYXJhbS5uYW1lXT8udmFsdWVcbiAgICAgICAgaWYgKCF0b29sVmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHQoJ2Vycm9yTXNnLmZpZWxkUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogcmVuZGVySTE4bk9iamVjdChwYXJhbS5sYWJlbCwgbGFuZ3VhZ2UpIH0pLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBub3QgZW5hYmxlZFxuICAgICAgICBlbHNlIGlmICghdG9vbFZhbHVlLmVuYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHQoJ2Vycm9yTXNnLm5vVmFsaWRUb29sJywgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHJlbmRlckkxOG5PYmplY3QocGFyYW0ubGFiZWwsIGxhbmd1YWdlKSB9KSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgZm9ybSBvZiB0b29sXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHNjaGVtYXMgPSB0b29sVmFsdWUuc2NoZW1hcyB8fCBbXVxuICAgICAgICAgIGNvbnN0IHVzZXJTZXR0aW5ncyA9IHRvb2xWYWx1ZS5zZXR0aW5nc1xuICAgICAgICAgIGNvbnN0IHJlYXNvbmluZ0NvbmZpZyA9IHRvb2xWYWx1ZS5wYXJhbWV0ZXJzXG4gICAgICAgICAgY29uc3QgdmVyc2lvbiA9IHBheWxvYWQudmVyc2lvblxuICAgICAgICAgIGNvbnN0IHRvb2xOb2RlVmVyc2lvbiA9IHBheWxvYWQudG9vbF9ub2RlX3ZlcnNpb25cbiAgICAgICAgICBjb25zdCBtZXJnZVZlcnNpb24gPSB2ZXJzaW9uIHx8IHRvb2xOb2RlVmVyc2lvblxuICAgICAgICAgIHNjaGVtYXMuZm9yRWFjaCgoc2NoZW1hOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmIChzY2hlbWE/LnJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgIGlmIChzY2hlbWEuZm9ybSA9PT0gJ2Zvcm0nICYmICFtZXJnZVZlcnNpb24gJiYgIXVzZXJTZXR0aW5nc1tzY2hlbWEubmFtZV0/LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdlcnJvck1zZy50b29sUGFyYW1ldGVyUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogcmVuZGVySTE4bk9iamVjdChwYXJhbS5sYWJlbCwgbGFuZ3VhZ2UpLCBwYXJhbTogcmVuZGVySTE4bk9iamVjdChzY2hlbWEubGFiZWwsIGxhbmd1YWdlKSB9KSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHNjaGVtYS5mb3JtID09PSAnZm9ybScgJiYgbWVyZ2VWZXJzaW9uICYmICF1c2VyU2V0dGluZ3Nbc2NoZW1hLm5hbWVdPy52YWx1ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdCgnZXJyb3JNc2cudG9vbFBhcmFtZXRlclJlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHJlbmRlckkxOG5PYmplY3QocGFyYW0ubGFiZWwsIGxhbmd1YWdlKSwgcGFyYW06IHJlbmRlckkxOG5PYmplY3Qoc2NoZW1hLmxhYmVsLCBsYW5ndWFnZSkgfSksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzY2hlbWEuZm9ybSA9PT0gJ2xsbScgJiYgIW1lcmdlVmVyc2lvbiAmJiByZWFzb25pbmdDb25maWdbc2NoZW1hLm5hbWVdLmF1dG8gPT09IDAgJiYgIXJlYXNvbmluZ0NvbmZpZ1tzY2hlbWEubmFtZV0/LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdlcnJvck1zZy50b29sUGFyYW1ldGVyUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogcmVuZGVySTE4bk9iamVjdChwYXJhbS5sYWJlbCwgbGFuZ3VhZ2UpLCBwYXJhbTogcmVuZGVySTE4bk9iamVjdChzY2hlbWEubGFiZWwsIGxhbmd1YWdlKSB9KSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHNjaGVtYS5mb3JtID09PSAnbGxtJyAmJiBtZXJnZVZlcnNpb24gJiYgcmVhc29uaW5nQ29uZmlnW3NjaGVtYS5uYW1lXS5hdXRvID09PSAwICYmICFyZWFzb25pbmdDb25maWdbc2NoZW1hLm5hbWVdPy52YWx1ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdCgnZXJyb3JNc2cudG9vbFBhcmFtZXRlclJlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHJlbmRlckkxOG5PYmplY3QocGFyYW0ubGFiZWwsIGxhbmd1YWdlKSwgcGFyYW06IHJlbmRlckkxOG5PYmplY3Qoc2NoZW1hLmxhYmVsLCBsYW5ndWFnZSkgfSksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gbXVsdGlwbGUgdG9vbHNcbiAgICAgIGlmIChwYXJhbS5yZXF1aXJlZCAmJiBwYXJhbS50eXBlID09PSBGb3JtVHlwZUVudW0ubXVsdGlUb29sU2VsZWN0b3IpIHtcbiAgICAgICAgY29uc3QgdG9vbHMgPSBwYXlsb2FkLmFnZW50X3BhcmFtZXRlcnM/LltwYXJhbS5uYW1lXT8udmFsdWUgfHwgW11cbiAgICAgICAgLy8gbm8gdmFsdWVcbiAgICAgICAgaWYgKCF0b29scy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHQoJ2Vycm9yTXNnLmZpZWxkUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogcmVuZGVySTE4bk9iamVjdChwYXJhbS5sYWJlbCwgbGFuZ3VhZ2UpIH0pLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBub3QgZW5hYmxlZFxuICAgICAgICBlbHNlIGlmICh0b29scy5ldmVyeSgodG9vbDogYW55KSA9PiAhdG9vbC5lbmFibGVkKSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdCgnZXJyb3JNc2cubm9WYWxpZFRvb2wnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogcmVuZGVySTE4bk9iamVjdChwYXJhbS5sYWJlbCwgbGFuZ3VhZ2UpIH0pLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBmb3JtIG9mIHRvb2xzXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHZhbGlkU3RhdGUgPSB7XG4gICAgICAgICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnJyxcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChjb25zdCB0b29sIG9mIHRvb2xzKSB7XG4gICAgICAgICAgICBjb25zdCBzY2hlbWFzID0gdG9vbC5zY2hlbWFzIHx8IFtdXG4gICAgICAgICAgICBjb25zdCB1c2VyU2V0dGluZ3MgPSB0b29sLnNldHRpbmdzXG4gICAgICAgICAgICBjb25zdCByZWFzb25pbmdDb25maWcgPSB0b29sLnBhcmFtZXRlcnNcbiAgICAgICAgICAgIHNjaGVtYXMuZm9yRWFjaCgoc2NoZW1hOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHNjaGVtYT8ucmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NoZW1hLmZvcm0gPT09ICdmb3JtJyAmJiAhdXNlclNldHRpbmdzW3NjaGVtYS5uYW1lXT8udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHQoJ2Vycm9yTXNnLnRvb2xQYXJhbWV0ZXJSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiByZW5kZXJJMThuT2JqZWN0KHBhcmFtLmxhYmVsLCBsYW5ndWFnZSksIHBhcmFtOiByZW5kZXJJMThuT2JqZWN0KHNjaGVtYS5sYWJlbCwgbGFuZ3VhZ2UpIH0pLFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2NoZW1hLmZvcm0gPT09ICdsbG0nICYmIHJlYXNvbmluZ0NvbmZpZ1tzY2hlbWEubmFtZV0/LmF1dG8gPT09IDAgJiYgIXJlYXNvbmluZ0NvbmZpZ1tzY2hlbWEubmFtZV0/LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdlcnJvck1zZy50b29sUGFyYW1ldGVyUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogcmVuZGVySTE4bk9iamVjdChwYXJhbS5sYWJlbCwgbGFuZ3VhZ2UpLCBwYXJhbTogcmVuZGVySTE4bk9iamVjdChzY2hlbWEubGFiZWwsIGxhbmd1YWdlKSB9KSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWxpZFN0YXRlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGNvbW1vbiBwYXJhbXNcbiAgICAgIGlmIChwYXJhbS5yZXF1aXJlZCAmJiAhKHBheWxvYWQuYWdlbnRfcGFyYW1ldGVycz8uW3BhcmFtLm5hbWVdPy52YWx1ZSB8fCBwYXJhbS5kZWZhdWx0KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIGVycm9yTWVzc2FnZTogdCgnZXJyb3JNc2cuZmllbGRSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiByZW5kZXJJMThuT2JqZWN0KHBhcmFtLmxhYmVsLCBsYW5ndWFnZSkgfSksXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBlcnJvck1lc3NhZ2U6ICcnLFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbm9kZURlZmF1bHRcbiJdfQ==