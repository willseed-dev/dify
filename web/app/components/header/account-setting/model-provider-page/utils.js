"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genModelNameFormSchema = exports.genModelTypeFormSchema = exports.modelTypeFormat = exports.sizeFormat = exports.removeCredentials = exports.savePredefinedLoadBalancingConfig = exports.saveCredentials = exports.validateLoadBalancingCredentials = exports.validateCredentials = exports.isNullOrUndefined = exports.modelNameMap = exports.MODEL_PROVIDER_QUOTA_GET_PAID = exports.ModelProviderQuotaGetPaid = void 0;
const common_1 = require("@/service/common");
const declarations_1 = require("../key-validator/declarations");
const declarations_2 = require("./declarations");
var ModelProviderQuotaGetPaid;
(function (ModelProviderQuotaGetPaid) {
    ModelProviderQuotaGetPaid["ANTHROPIC"] = "langgenius/anthropic/anthropic";
    ModelProviderQuotaGetPaid["OPENAI"] = "langgenius/openai/openai";
    // AZURE_OPENAI = 'langgenius/azure_openai/azure_openai',
    ModelProviderQuotaGetPaid["GEMINI"] = "langgenius/gemini/google";
    ModelProviderQuotaGetPaid["X"] = "langgenius/x/x";
    ModelProviderQuotaGetPaid["DEEPSEEK"] = "langgenius/deepseek/deepseek";
    ModelProviderQuotaGetPaid["TONGYI"] = "langgenius/tongyi/tongyi";
})(ModelProviderQuotaGetPaid || (exports.ModelProviderQuotaGetPaid = ModelProviderQuotaGetPaid = {}));
exports.MODEL_PROVIDER_QUOTA_GET_PAID = [ModelProviderQuotaGetPaid.ANTHROPIC, ModelProviderQuotaGetPaid.OPENAI, ModelProviderQuotaGetPaid.GEMINI, ModelProviderQuotaGetPaid.X, ModelProviderQuotaGetPaid.DEEPSEEK, ModelProviderQuotaGetPaid.TONGYI];
exports.modelNameMap = {
    [ModelProviderQuotaGetPaid.OPENAI]: 'OpenAI',
    [ModelProviderQuotaGetPaid.ANTHROPIC]: 'Anthropic',
    [ModelProviderQuotaGetPaid.GEMINI]: 'Gemini',
    [ModelProviderQuotaGetPaid.X]: 'xAI',
    [ModelProviderQuotaGetPaid.DEEPSEEK]: 'DeepSeek',
    [ModelProviderQuotaGetPaid.TONGYI]: 'Tongyi',
};
const isNullOrUndefined = (value) => {
    return value === undefined || value === null;
};
exports.isNullOrUndefined = isNullOrUndefined;
const validateCredentials = async (predefined, provider, v) => {
    let body, url;
    if (predefined) {
        body = {
            credentials: v,
        };
        url = `/workspaces/current/model-providers/${provider}/credentials/validate`;
    }
    else {
        const { __model_name, __model_type, ...credentials } = v;
        body = {
            model: __model_name,
            model_type: __model_type,
            credentials,
        };
        url = `/workspaces/current/model-providers/${provider}/models/credentials/validate`;
    }
    try {
        const res = await (0, common_1.validateModelProvider)({ url, body });
        if (res.result === 'success')
            return Promise.resolve({ status: declarations_1.ValidatedStatus.Success });
        else
            return Promise.resolve({ status: declarations_1.ValidatedStatus.Error, message: res.error || 'error' });
    }
    catch (e) {
        return Promise.resolve({ status: declarations_1.ValidatedStatus.Error, message: e.message });
    }
};
exports.validateCredentials = validateCredentials;
const validateLoadBalancingCredentials = async (predefined, provider, v, id) => {
    const { __model_name, __model_type, ...credentials } = v;
    try {
        const res = await (0, common_1.validateModelLoadBalancingCredentials)({
            url: `/workspaces/current/model-providers/${provider}/models/load-balancing-configs/${id ? `${id}/` : ''}credentials-validate`,
            body: {
                model: __model_name,
                model_type: __model_type,
                credentials,
            },
        });
        if (res.result === 'success')
            return Promise.resolve({ status: declarations_1.ValidatedStatus.Success });
        else
            return Promise.resolve({ status: declarations_1.ValidatedStatus.Error, message: res.error || 'error' });
    }
    catch (e) {
        return Promise.resolve({ status: declarations_1.ValidatedStatus.Error, message: e.message });
    }
};
exports.validateLoadBalancingCredentials = validateLoadBalancingCredentials;
const saveCredentials = async (predefined, provider, v, loadBalancing) => {
    let body, url;
    if (predefined) {
        const { __authorization_name__, ...rest } = v;
        body = {
            config_from: declarations_2.ConfigurationMethodEnum.predefinedModel,
            credentials: rest,
            load_balancing: loadBalancing,
            name: __authorization_name__,
        };
        url = `/workspaces/current/model-providers/${provider}/credentials`;
    }
    else {
        const { __model_name, __model_type, ...credentials } = v;
        body = {
            model: __model_name,
            model_type: __model_type,
            credentials,
            load_balancing: loadBalancing,
        };
        url = `/workspaces/current/model-providers/${provider}/models`;
    }
    return (0, common_1.setModelProvider)({ url, body });
};
exports.saveCredentials = saveCredentials;
const savePredefinedLoadBalancingConfig = async (provider, v, loadBalancing) => {
    const { __model_name, __model_type, ...credentials } = v;
    const body = {
        config_from: declarations_2.ConfigurationMethodEnum.predefinedModel,
        model: __model_name,
        model_type: __model_type,
        credentials,
        load_balancing: loadBalancing,
    };
    const url = `/workspaces/current/model-providers/${provider}/models`;
    return (0, common_1.setModelProvider)({ url, body });
};
exports.savePredefinedLoadBalancingConfig = savePredefinedLoadBalancingConfig;
const removeCredentials = async (predefined, provider, v, credentialId) => {
    let url = '';
    let body;
    if (predefined) {
        url = `/workspaces/current/model-providers/${provider}/credentials`;
        if (credentialId) {
            body = {
                credential_id: credentialId,
            };
        }
    }
    else {
        if (v) {
            const { __model_name, __model_type } = v;
            body = {
                model: __model_name,
                model_type: __model_type,
            };
            url = `/workspaces/current/model-providers/${provider}/models`;
        }
    }
    return (0, common_1.deleteModelProvider)({ url, body });
};
exports.removeCredentials = removeCredentials;
const sizeFormat = (size) => {
    const remainder = Math.floor(size / 1000);
    if (remainder < 1)
        return `${size}`;
    else
        return `${remainder}K`;
};
exports.sizeFormat = sizeFormat;
const modelTypeFormat = (modelType) => {
    if (modelType === declarations_2.ModelTypeEnum.textEmbedding)
        return 'TEXT EMBEDDING';
    return modelType.toLocaleUpperCase();
};
exports.modelTypeFormat = modelTypeFormat;
const genModelTypeFormSchema = (modelTypes) => {
    return {
        type: declarations_2.FormTypeEnum.select,
        label: {
            zh_Hans: '模型类型',
            en_US: 'Model Type',
        },
        variable: '__model_type',
        default: modelTypes[0],
        required: true,
        show_on: [],
        options: modelTypes.map((modelType) => {
            return {
                value: modelType,
                label: {
                    zh_Hans: declarations_2.MODEL_TYPE_TEXT[modelType],
                    en_US: declarations_2.MODEL_TYPE_TEXT[modelType],
                },
                show_on: [],
            };
        }),
    };
};
exports.genModelTypeFormSchema = genModelTypeFormSchema;
const genModelNameFormSchema = (model) => {
    return {
        type: declarations_2.FormTypeEnum.textInput,
        label: model?.label || {
            zh_Hans: '模型名称',
            en_US: 'Model Name',
        },
        variable: '__model_name',
        required: true,
        show_on: [],
        placeholder: model?.placeholder || {
            zh_Hans: '请输入模型名称',
            en_US: 'Please enter model name',
        },
    };
};
exports.genModelNameFormSchema = genModelNameFormSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLQSw2Q0FLeUI7QUFDekIsZ0VBQStEO0FBQy9ELGlEQUt1QjtBQUV2QixJQUFZLHlCQVFYO0FBUkQsV0FBWSx5QkFBeUI7SUFDbkMseUVBQTRDLENBQUE7SUFDNUMsZ0VBQW1DLENBQUE7SUFDbkMseURBQXlEO0lBQ3pELGdFQUFtQyxDQUFBO0lBQ25DLGlEQUFvQixDQUFBO0lBQ3BCLHNFQUF5QyxDQUFBO0lBQ3pDLGdFQUFtQyxDQUFBO0FBQ3JDLENBQUMsRUFSVyx5QkFBeUIseUNBQXpCLHlCQUF5QixRQVFwQztBQUNZLFFBQUEsNkJBQTZCLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLEVBQUUseUJBQXlCLENBQUMsTUFBTSxFQUFFLHlCQUF5QixDQUFDLE1BQU0sRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLEVBQUUseUJBQXlCLENBQUMsUUFBUSxFQUFFLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBRTVPLFFBQUEsWUFBWSxHQUFHO0lBQzFCLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUTtJQUM1QyxDQUFDLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxFQUFFLFdBQVc7SUFDbEQsQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRO0lBQzVDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSztJQUNwQyxDQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVU7SUFDaEQsQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRO0NBQzdDLENBQUE7QUFFTSxNQUFNLGlCQUFpQixHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7SUFDOUMsT0FBTyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUE7QUFDOUMsQ0FBQyxDQUFBO0FBRlks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QVM7UUFDNUIsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLElBQUk7WUFDckIsT0FBTyxFQUFFLE1BQU07WUFDZixLQUFLLEVBQUUsWUFBWTtTQUNwQjtRQUNELFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsT0FBTyxFQUFFLEVBQUU7UUFDWCxXQUFXLEVBQUUsS0FBSyxFQUFFLFdBQVcsSUFBSTtZQUNqQyxPQUFPLEVBQUUsU0FBUztZQUNsQixLQUFLLEVBQUUseUJBQXlCO1NBQ2pDO0tBQ0ssQ0FBQTtBQUNWLENBQUMsQ0FBQTtBQWZZLFFBQUEsc0JBQXNCLDBCQWVsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgQ3JlZGVudGlhbEZvcm1TY2hlbWFUZXh0SW5wdXQsXG4gIEZvcm1WYWx1ZSxcbiAgTW9kZWxMb2FkQmFsYW5jaW5nQ29uZmlnLFxufSBmcm9tICcuL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7XG4gIGRlbGV0ZU1vZGVsUHJvdmlkZXIsXG4gIHNldE1vZGVsUHJvdmlkZXIsXG4gIHZhbGlkYXRlTW9kZWxMb2FkQmFsYW5jaW5nQ3JlZGVudGlhbHMsXG4gIHZhbGlkYXRlTW9kZWxQcm92aWRlcixcbn0gZnJvbSAnQC9zZXJ2aWNlL2NvbW1vbidcbmltcG9ydCB7IFZhbGlkYXRlZFN0YXR1cyB9IGZyb20gJy4uL2tleS12YWxpZGF0b3IvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHtcbiAgQ29uZmlndXJhdGlvbk1ldGhvZEVudW0sXG4gIEZvcm1UeXBlRW51bSxcbiAgTU9ERUxfVFlQRV9URVhULFxuICBNb2RlbFR5cGVFbnVtLFxufSBmcm9tICcuL2RlY2xhcmF0aW9ucydcblxuZXhwb3J0IGVudW0gTW9kZWxQcm92aWRlclF1b3RhR2V0UGFpZCB7XG4gIEFOVEhST1BJQyA9ICdsYW5nZ2VuaXVzL2FudGhyb3BpYy9hbnRocm9waWMnLFxuICBPUEVOQUkgPSAnbGFuZ2dlbml1cy9vcGVuYWkvb3BlbmFpJyxcbiAgLy8gQVpVUkVfT1BFTkFJID0gJ2xhbmdnZW5pdXMvYXp1cmVfb3BlbmFpL2F6dXJlX29wZW5haScsXG4gIEdFTUlOSSA9ICdsYW5nZ2VuaXVzL2dlbWluaS9nb29nbGUnLFxuICBYID0gJ2xhbmdnZW5pdXMveC94JyxcbiAgREVFUFNFRUsgPSAnbGFuZ2dlbml1cy9kZWVwc2Vlay9kZWVwc2VlaycsXG4gIFRPTkdZSSA9ICdsYW5nZ2VuaXVzL3Rvbmd5aS90b25neWknLFxufVxuZXhwb3J0IGNvbnN0IE1PREVMX1BST1ZJREVSX1FVT1RBX0dFVF9QQUlEID0gW01vZGVsUHJvdmlkZXJRdW90YUdldFBhaWQuQU5USFJPUElDLCBNb2RlbFByb3ZpZGVyUXVvdGFHZXRQYWlkLk9QRU5BSSwgTW9kZWxQcm92aWRlclF1b3RhR2V0UGFpZC5HRU1JTkksIE1vZGVsUHJvdmlkZXJRdW90YUdldFBhaWQuWCwgTW9kZWxQcm92aWRlclF1b3RhR2V0UGFpZC5ERUVQU0VFSywgTW9kZWxQcm92aWRlclF1b3RhR2V0UGFpZC5UT05HWUldXG5cbmV4cG9ydCBjb25zdCBtb2RlbE5hbWVNYXAgPSB7XG4gIFtNb2RlbFByb3ZpZGVyUXVvdGFHZXRQYWlkLk9QRU5BSV06ICdPcGVuQUknLFxuICBbTW9kZWxQcm92aWRlclF1b3RhR2V0UGFpZC5BTlRIUk9QSUNdOiAnQW50aHJvcGljJyxcbiAgW01vZGVsUHJvdmlkZXJRdW90YUdldFBhaWQuR0VNSU5JXTogJ0dlbWluaScsXG4gIFtNb2RlbFByb3ZpZGVyUXVvdGFHZXRQYWlkLlhdOiAneEFJJyxcbiAgW01vZGVsUHJvdmlkZXJRdW90YUdldFBhaWQuREVFUFNFRUtdOiAnRGVlcFNlZWsnLFxuICBbTW9kZWxQcm92aWRlclF1b3RhR2V0UGFpZC5UT05HWUldOiAnVG9uZ3lpJyxcbn1cblxuZXhwb3J0IGNvbnN0IGlzTnVsbE9yVW5kZWZpbmVkID0gKHZhbHVlOiBhbnkpID0+IHtcbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGxcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQ3JlZGVudGlhbHMgPSBhc3luYyAocHJlZGVmaW5lZDogYm9vbGVhbiwgcHJvdmlkZXI6IHN0cmluZywgdjogRm9ybVZhbHVlKSA9PiB7XG4gIGxldCBib2R5LCB1cmxcblxuICBpZiAocHJlZGVmaW5lZCkge1xuICAgIGJvZHkgPSB7XG4gICAgICBjcmVkZW50aWFsczogdixcbiAgICB9XG4gICAgdXJsID0gYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWwtcHJvdmlkZXJzLyR7cHJvdmlkZXJ9L2NyZWRlbnRpYWxzL3ZhbGlkYXRlYFxuICB9XG4gIGVsc2Uge1xuICAgIGNvbnN0IHsgX19tb2RlbF9uYW1lLCBfX21vZGVsX3R5cGUsIC4uLmNyZWRlbnRpYWxzIH0gPSB2XG4gICAgYm9keSA9IHtcbiAgICAgIG1vZGVsOiBfX21vZGVsX25hbWUsXG4gICAgICBtb2RlbF90eXBlOiBfX21vZGVsX3R5cGUsXG4gICAgICBjcmVkZW50aWFscyxcbiAgICB9XG4gICAgdXJsID0gYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWwtcHJvdmlkZXJzLyR7cHJvdmlkZXJ9L21vZGVscy9jcmVkZW50aWFscy92YWxpZGF0ZWBcbiAgfVxuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHZhbGlkYXRlTW9kZWxQcm92aWRlcih7IHVybCwgYm9keSB9KVxuICAgIGlmIChyZXMucmVzdWx0ID09PSAnc3VjY2VzcycpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgc3RhdHVzOiBWYWxpZGF0ZWRTdGF0dXMuU3VjY2VzcyB9KVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBzdGF0dXM6IFZhbGlkYXRlZFN0YXR1cy5FcnJvciwgbWVzc2FnZTogcmVzLmVycm9yIHx8ICdlcnJvcicgfSlcbiAgfVxuICBjYXRjaCAoZTogYW55KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHN0YXR1czogVmFsaWRhdGVkU3RhdHVzLkVycm9yLCBtZXNzYWdlOiBlLm1lc3NhZ2UgfSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVMb2FkQmFsYW5jaW5nQ3JlZGVudGlhbHMgPSBhc3luYyAocHJlZGVmaW5lZDogYm9vbGVhbiwgcHJvdmlkZXI6IHN0cmluZywgdjogRm9ybVZhbHVlLCBpZD86IHN0cmluZyk6IFByb21pc2U8e1xuICBzdGF0dXM6IFZhbGlkYXRlZFN0YXR1c1xuICBtZXNzYWdlPzogc3RyaW5nXG59PiA9PiB7XG4gIGNvbnN0IHsgX19tb2RlbF9uYW1lLCBfX21vZGVsX3R5cGUsIC4uLmNyZWRlbnRpYWxzIH0gPSB2XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgdmFsaWRhdGVNb2RlbExvYWRCYWxhbmNpbmdDcmVkZW50aWFscyh7XG4gICAgICB1cmw6IGAvd29ya3NwYWNlcy9jdXJyZW50L21vZGVsLXByb3ZpZGVycy8ke3Byb3ZpZGVyfS9tb2RlbHMvbG9hZC1iYWxhbmNpbmctY29uZmlncy8ke2lkID8gYCR7aWR9L2AgOiAnJ31jcmVkZW50aWFscy12YWxpZGF0ZWAsXG4gICAgICBib2R5OiB7XG4gICAgICAgIG1vZGVsOiBfX21vZGVsX25hbWUsXG4gICAgICAgIG1vZGVsX3R5cGU6IF9fbW9kZWxfdHlwZSxcbiAgICAgICAgY3JlZGVudGlhbHMsXG4gICAgICB9LFxuICAgIH0pXG4gICAgaWYgKHJlcy5yZXN1bHQgPT09ICdzdWNjZXNzJylcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBzdGF0dXM6IFZhbGlkYXRlZFN0YXR1cy5TdWNjZXNzIH0pXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHN0YXR1czogVmFsaWRhdGVkU3RhdHVzLkVycm9yLCBtZXNzYWdlOiByZXMuZXJyb3IgfHwgJ2Vycm9yJyB9KVxuICB9XG4gIGNhdGNoIChlOiBhbnkpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgc3RhdHVzOiBWYWxpZGF0ZWRTdGF0dXMuRXJyb3IsIG1lc3NhZ2U6IGUubWVzc2FnZSB9KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzYXZlQ3JlZGVudGlhbHMgPSBhc3luYyAocHJlZGVmaW5lZDogYm9vbGVhbiwgcHJvdmlkZXI6IHN0cmluZywgdjogRm9ybVZhbHVlLCBsb2FkQmFsYW5jaW5nPzogTW9kZWxMb2FkQmFsYW5jaW5nQ29uZmlnKSA9PiB7XG4gIGxldCBib2R5LCB1cmxcblxuICBpZiAocHJlZGVmaW5lZCkge1xuICAgIGNvbnN0IHsgX19hdXRob3JpemF0aW9uX25hbWVfXywgLi4ucmVzdCB9ID0gdlxuICAgIGJvZHkgPSB7XG4gICAgICBjb25maWdfZnJvbTogQ29uZmlndXJhdGlvbk1ldGhvZEVudW0ucHJlZGVmaW5lZE1vZGVsLFxuICAgICAgY3JlZGVudGlhbHM6IHJlc3QsXG4gICAgICBsb2FkX2JhbGFuY2luZzogbG9hZEJhbGFuY2luZyxcbiAgICAgIG5hbWU6IF9fYXV0aG9yaXphdGlvbl9uYW1lX18sXG4gICAgfVxuICAgIHVybCA9IGAvd29ya3NwYWNlcy9jdXJyZW50L21vZGVsLXByb3ZpZGVycy8ke3Byb3ZpZGVyfS9jcmVkZW50aWFsc2BcbiAgfVxuICBlbHNlIHtcbiAgICBjb25zdCB7IF9fbW9kZWxfbmFtZSwgX19tb2RlbF90eXBlLCAuLi5jcmVkZW50aWFscyB9ID0gdlxuICAgIGJvZHkgPSB7XG4gICAgICBtb2RlbDogX19tb2RlbF9uYW1lLFxuICAgICAgbW9kZWxfdHlwZTogX19tb2RlbF90eXBlLFxuICAgICAgY3JlZGVudGlhbHMsXG4gICAgICBsb2FkX2JhbGFuY2luZzogbG9hZEJhbGFuY2luZyxcbiAgICB9XG4gICAgdXJsID0gYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWwtcHJvdmlkZXJzLyR7cHJvdmlkZXJ9L21vZGVsc2BcbiAgfVxuXG4gIHJldHVybiBzZXRNb2RlbFByb3ZpZGVyKHsgdXJsLCBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCBzYXZlUHJlZGVmaW5lZExvYWRCYWxhbmNpbmdDb25maWcgPSBhc3luYyAocHJvdmlkZXI6IHN0cmluZywgdjogRm9ybVZhbHVlLCBsb2FkQmFsYW5jaW5nPzogTW9kZWxMb2FkQmFsYW5jaW5nQ29uZmlnKSA9PiB7XG4gIGNvbnN0IHsgX19tb2RlbF9uYW1lLCBfX21vZGVsX3R5cGUsIC4uLmNyZWRlbnRpYWxzIH0gPSB2XG4gIGNvbnN0IGJvZHkgPSB7XG4gICAgY29uZmlnX2Zyb206IENvbmZpZ3VyYXRpb25NZXRob2RFbnVtLnByZWRlZmluZWRNb2RlbCxcbiAgICBtb2RlbDogX19tb2RlbF9uYW1lLFxuICAgIG1vZGVsX3R5cGU6IF9fbW9kZWxfdHlwZSxcbiAgICBjcmVkZW50aWFscyxcbiAgICBsb2FkX2JhbGFuY2luZzogbG9hZEJhbGFuY2luZyxcbiAgfVxuICBjb25zdCB1cmwgPSBgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vbW9kZWxzYFxuXG4gIHJldHVybiBzZXRNb2RlbFByb3ZpZGVyKHsgdXJsLCBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCByZW1vdmVDcmVkZW50aWFscyA9IGFzeW5jIChwcmVkZWZpbmVkOiBib29sZWFuLCBwcm92aWRlcjogc3RyaW5nLCB2OiBGb3JtVmFsdWUsIGNyZWRlbnRpYWxJZD86IHN0cmluZykgPT4ge1xuICBsZXQgdXJsID0gJydcbiAgbGV0IGJvZHlcblxuICBpZiAocHJlZGVmaW5lZCkge1xuICAgIHVybCA9IGAvd29ya3NwYWNlcy9jdXJyZW50L21vZGVsLXByb3ZpZGVycy8ke3Byb3ZpZGVyfS9jcmVkZW50aWFsc2BcbiAgICBpZiAoY3JlZGVudGlhbElkKSB7XG4gICAgICBib2R5ID0ge1xuICAgICAgICBjcmVkZW50aWFsX2lkOiBjcmVkZW50aWFsSWQsXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGlmICh2KSB7XG4gICAgICBjb25zdCB7IF9fbW9kZWxfbmFtZSwgX19tb2RlbF90eXBlIH0gPSB2XG4gICAgICBib2R5ID0ge1xuICAgICAgICBtb2RlbDogX19tb2RlbF9uYW1lLFxuICAgICAgICBtb2RlbF90eXBlOiBfX21vZGVsX3R5cGUsXG4gICAgICB9XG4gICAgICB1cmwgPSBgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vbW9kZWxzYFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZWxldGVNb2RlbFByb3ZpZGVyKHsgdXJsLCBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCBzaXplRm9ybWF0ID0gKHNpemU6IG51bWJlcikgPT4ge1xuICBjb25zdCByZW1haW5kZXIgPSBNYXRoLmZsb29yKHNpemUgLyAxMDAwKVxuICBpZiAocmVtYWluZGVyIDwgMSlcbiAgICByZXR1cm4gYCR7c2l6ZX1gXG4gIGVsc2VcbiAgICByZXR1cm4gYCR7cmVtYWluZGVyfUtgXG59XG5cbmV4cG9ydCBjb25zdCBtb2RlbFR5cGVGb3JtYXQgPSAobW9kZWxUeXBlOiBNb2RlbFR5cGVFbnVtKSA9PiB7XG4gIGlmIChtb2RlbFR5cGUgPT09IE1vZGVsVHlwZUVudW0udGV4dEVtYmVkZGluZylcbiAgICByZXR1cm4gJ1RFWFQgRU1CRURESU5HJ1xuXG4gIHJldHVybiBtb2RlbFR5cGUudG9Mb2NhbGVVcHBlckNhc2UoKVxufVxuXG5leHBvcnQgY29uc3QgZ2VuTW9kZWxUeXBlRm9ybVNjaGVtYSA9IChtb2RlbFR5cGVzOiBNb2RlbFR5cGVFbnVtW10pID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBGb3JtVHlwZUVudW0uc2VsZWN0LFxuICAgIGxhYmVsOiB7XG4gICAgICB6aF9IYW5zOiAn5qih5Z6L57G75Z6LJyxcbiAgICAgIGVuX1VTOiAnTW9kZWwgVHlwZScsXG4gICAgfSxcbiAgICB2YXJpYWJsZTogJ19fbW9kZWxfdHlwZScsXG4gICAgZGVmYXVsdDogbW9kZWxUeXBlc1swXSxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBzaG93X29uOiBbXSxcbiAgICBvcHRpb25zOiBtb2RlbFR5cGVzLm1hcCgobW9kZWxUeXBlOiBNb2RlbFR5cGVFbnVtKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogbW9kZWxUeXBlLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHpoX0hhbnM6IE1PREVMX1RZUEVfVEVYVFttb2RlbFR5cGVdLFxuICAgICAgICAgIGVuX1VTOiBNT0RFTF9UWVBFX1RFWFRbbW9kZWxUeXBlXSxcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd19vbjogW10sXG4gICAgICB9XG4gICAgfSksXG4gIH0gYXMgYW55XG59XG5cbmV4cG9ydCBjb25zdCBnZW5Nb2RlbE5hbWVGb3JtU2NoZW1hID0gKG1vZGVsPzogUGljazxDcmVkZW50aWFsRm9ybVNjaGVtYVRleHRJbnB1dCwgJ2xhYmVsJyB8ICdwbGFjZWhvbGRlcic+KSA9PiB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogRm9ybVR5cGVFbnVtLnRleHRJbnB1dCxcbiAgICBsYWJlbDogbW9kZWw/LmxhYmVsIHx8IHtcbiAgICAgIHpoX0hhbnM6ICfmqKHlnovlkI3np7AnLFxuICAgICAgZW5fVVM6ICdNb2RlbCBOYW1lJyxcbiAgICB9LFxuICAgIHZhcmlhYmxlOiAnX19tb2RlbF9uYW1lJyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBzaG93X29uOiBbXSxcbiAgICBwbGFjZWhvbGRlcjogbW9kZWw/LnBsYWNlaG9sZGVyIHx8IHtcbiAgICAgIHpoX0hhbnM6ICfor7fovpPlhaXmqKHlnovlkI3np7AnLFxuICAgICAgZW5fVVM6ICdQbGVhc2UgZW50ZXIgbW9kZWwgbmFtZScsXG4gICAgfSxcbiAgfSBhcyBhbnlcbn1cbiJdfQ==