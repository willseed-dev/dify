"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModelFormSchemas = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const types_1 = require("@/app/components/base/form/types");
const utils_1 = require("../../utils");
const useModelFormSchemas = (provider, providerFormSchemaPredefined, credentials, credential, model) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { provider_credential_schema, supported_model_types, model_credential_schema, } = provider;
    const formSchemas = (0, react_1.useMemo)(() => {
        return providerFormSchemaPredefined
            ? provider_credential_schema.credential_form_schemas
            : model_credential_schema.credential_form_schemas;
    }, [
        providerFormSchemaPredefined,
        provider_credential_schema?.credential_form_schemas,
        supported_model_types,
        model_credential_schema?.credential_form_schemas,
        model_credential_schema?.model,
        model,
    ]);
    const formSchemasWithAuthorizationName = (0, react_1.useMemo)(() => {
        const authorizationNameSchema = {
            type: types_1.FormTypeEnum.textInput,
            variable: '__authorization_name__',
            label: t('auth.authorizationName', { ns: 'plugin' }),
            required: false,
        };
        return [
            authorizationNameSchema,
            ...formSchemas,
        ];
    }, [formSchemas, t]);
    const formValues = (0, react_1.useMemo)(() => {
        let result = {};
        formSchemas.forEach((schema) => {
            result[schema.variable] = schema.default;
        });
        if (credential) {
            result = { ...result, __authorization_name__: credential?.credential_name };
            if (credentials)
                result = { ...result, ...credentials };
        }
        if (model)
            result = { ...result, __model_name: model?.model, __model_type: model?.model_type };
        return result;
    }, [credentials, credential, model, formSchemas]);
    const modelNameAndTypeFormSchemas = (0, react_1.useMemo)(() => {
        if (providerFormSchemaPredefined)
            return [];
        const modelNameSchema = (0, utils_1.genModelNameFormSchema)(model_credential_schema?.model);
        const modelTypeSchema = (0, utils_1.genModelTypeFormSchema)(supported_model_types);
        return [
            modelNameSchema,
            modelTypeSchema,
        ];
    }, [supported_model_types, model_credential_schema?.model, providerFormSchemaPredefined]);
    const modelNameAndTypeFormValues = (0, react_1.useMemo)(() => {
        let result = {};
        if (providerFormSchemaPredefined)
            return result;
        if (model)
            result = { ...result, __model_name: model?.model, __model_type: model?.model_type };
        return result;
    }, [model, providerFormSchemaPredefined]);
    return {
        formSchemas: formSchemasWithAuthorizationName,
        formValues,
        modelNameAndTypeFormSchemas,
        modelNameAndTypeFormValues,
    };
};
exports.useModelFormSchemas = useModelFormSchemas;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW1vZGVsLWZvcm0tc2NoZW1hcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1tb2RlbC1mb3JtLXNjaGVtYXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0EsaUNBQStCO0FBQy9CLGlEQUE4QztBQUM5Qyw0REFBK0Q7QUFDL0QsdUNBR29CO0FBRWIsTUFBTSxtQkFBbUIsR0FBRyxDQUNqQyxRQUF1QixFQUN2Qiw0QkFBcUMsRUFDckMsV0FBaUMsRUFDakMsVUFBdUIsRUFDdkIsS0FBNkIsRUFDN0IsRUFBRTtJQUNGLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQ0osMEJBQTBCLEVBQzFCLHFCQUFxQixFQUNyQix1QkFBdUIsR0FDeEIsR0FBRyxRQUFRLENBQUE7SUFDWixNQUFNLFdBQVcsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDL0IsT0FBTyw0QkFBNEI7WUFDakMsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLHVCQUF1QjtZQUNwRCxDQUFDLENBQUMsdUJBQXVCLENBQUMsdUJBQXVCLENBQUE7SUFDckQsQ0FBQyxFQUFFO1FBQ0QsNEJBQTRCO1FBQzVCLDBCQUEwQixFQUFFLHVCQUF1QjtRQUNuRCxxQkFBcUI7UUFDckIsdUJBQXVCLEVBQUUsdUJBQXVCO1FBQ2hELHVCQUF1QixFQUFFLEtBQUs7UUFDOUIsS0FBSztLQUNOLENBQUMsQ0FBQTtJQUVGLE1BQU0sZ0NBQWdDLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ3BELE1BQU0sdUJBQXVCLEdBQUc7WUFDOUIsSUFBSSxFQUFFLG9CQUFZLENBQUMsU0FBUztZQUM1QixRQUFRLEVBQUUsd0JBQXdCO1lBQ2xDLEtBQUssRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7WUFDcEQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQTtRQUVELE9BQU87WUFDTCx1QkFBdUI7WUFDdkIsR0FBRyxXQUFXO1NBQ2YsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRXBCLE1BQU0sVUFBVSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUM5QixJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUE7UUFDcEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQTtRQUMxQyxDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUksVUFBVSxFQUFFLENBQUM7WUFDZixNQUFNLEdBQUcsRUFBRSxHQUFHLE1BQU0sRUFBRSxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLENBQUE7WUFDM0UsSUFBSSxXQUFXO2dCQUNiLE1BQU0sR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUE7UUFDMUMsQ0FBQztRQUNELElBQUksS0FBSztZQUNQLE1BQU0sR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUE7UUFDckYsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBO0lBRWpELE1BQU0sMkJBQTJCLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQy9DLElBQUksNEJBQTRCO1lBQzlCLE9BQU8sRUFBRSxDQUFBO1FBRVgsTUFBTSxlQUFlLEdBQUcsSUFBQSw4QkFBc0IsRUFBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM5RSxNQUFNLGVBQWUsR0FBRyxJQUFBLDhCQUFzQixFQUFDLHFCQUFxQixDQUFDLENBQUE7UUFDckUsT0FBTztZQUNMLGVBQWU7WUFDZixlQUFlO1NBQ2hCLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxDQUFBO0lBRXpGLE1BQU0sMEJBQTBCLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQzlDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtRQUNmLElBQUksNEJBQTRCO1lBQzlCLE9BQU8sTUFBTSxDQUFBO1FBRWYsSUFBSSxLQUFLO1lBQ1AsTUFBTSxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQTtRQUVyRixPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSw0QkFBNEIsQ0FBQyxDQUFDLENBQUE7SUFFekMsT0FBTztRQUNMLFdBQVcsRUFBRSxnQ0FBZ0M7UUFDN0MsVUFBVTtRQUNWLDJCQUEyQjtRQUMzQiwwQkFBMEI7S0FDM0IsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQXBGWSxRQUFBLG1CQUFtQix1QkFvRi9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUge1xuICBDcmVkZW50aWFsLFxuICBDdXN0b21Nb2RlbENyZWRlbnRpYWwsXG4gIE1vZGVsUHJvdmlkZXIsXG59IGZyb20gJy4uLy4uL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IEZvcm1UeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL3R5cGVzJ1xuaW1wb3J0IHtcbiAgZ2VuTW9kZWxOYW1lRm9ybVNjaGVtYSxcbiAgZ2VuTW9kZWxUeXBlRm9ybVNjaGVtYSxcbn0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbmV4cG9ydCBjb25zdCB1c2VNb2RlbEZvcm1TY2hlbWFzID0gKFxuICBwcm92aWRlcjogTW9kZWxQcm92aWRlcixcbiAgcHJvdmlkZXJGb3JtU2NoZW1hUHJlZGVmaW5lZDogYm9vbGVhbixcbiAgY3JlZGVudGlhbHM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBjcmVkZW50aWFsPzogQ3JlZGVudGlhbCxcbiAgbW9kZWw/OiBDdXN0b21Nb2RlbENyZWRlbnRpYWwsXG4pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHtcbiAgICBwcm92aWRlcl9jcmVkZW50aWFsX3NjaGVtYSxcbiAgICBzdXBwb3J0ZWRfbW9kZWxfdHlwZXMsXG4gICAgbW9kZWxfY3JlZGVudGlhbF9zY2hlbWEsXG4gIH0gPSBwcm92aWRlclxuICBjb25zdCBmb3JtU2NoZW1hcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBwcm92aWRlckZvcm1TY2hlbWFQcmVkZWZpbmVkXG4gICAgICA/IHByb3ZpZGVyX2NyZWRlbnRpYWxfc2NoZW1hLmNyZWRlbnRpYWxfZm9ybV9zY2hlbWFzXG4gICAgICA6IG1vZGVsX2NyZWRlbnRpYWxfc2NoZW1hLmNyZWRlbnRpYWxfZm9ybV9zY2hlbWFzXG4gIH0sIFtcbiAgICBwcm92aWRlckZvcm1TY2hlbWFQcmVkZWZpbmVkLFxuICAgIHByb3ZpZGVyX2NyZWRlbnRpYWxfc2NoZW1hPy5jcmVkZW50aWFsX2Zvcm1fc2NoZW1hcyxcbiAgICBzdXBwb3J0ZWRfbW9kZWxfdHlwZXMsXG4gICAgbW9kZWxfY3JlZGVudGlhbF9zY2hlbWE/LmNyZWRlbnRpYWxfZm9ybV9zY2hlbWFzLFxuICAgIG1vZGVsX2NyZWRlbnRpYWxfc2NoZW1hPy5tb2RlbCxcbiAgICBtb2RlbCxcbiAgXSlcblxuICBjb25zdCBmb3JtU2NoZW1hc1dpdGhBdXRob3JpemF0aW9uTmFtZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGF1dGhvcml6YXRpb25OYW1lU2NoZW1hID0ge1xuICAgICAgdHlwZTogRm9ybVR5cGVFbnVtLnRleHRJbnB1dCxcbiAgICAgIHZhcmlhYmxlOiAnX19hdXRob3JpemF0aW9uX25hbWVfXycsXG4gICAgICBsYWJlbDogdCgnYXV0aC5hdXRob3JpemF0aW9uTmFtZScsIHsgbnM6ICdwbHVnaW4nIH0pLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICBhdXRob3JpemF0aW9uTmFtZVNjaGVtYSxcbiAgICAgIC4uLmZvcm1TY2hlbWFzLFxuICAgIF1cbiAgfSwgW2Zvcm1TY2hlbWFzLCB0XSlcblxuICBjb25zdCBmb3JtVmFsdWVzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgbGV0IHJlc3VsdDogYW55ID0ge31cbiAgICBmb3JtU2NoZW1hcy5mb3JFYWNoKChzY2hlbWEpID0+IHtcbiAgICAgIHJlc3VsdFtzY2hlbWEudmFyaWFibGVdID0gc2NoZW1hLmRlZmF1bHRcbiAgICB9KVxuICAgIGlmIChjcmVkZW50aWFsKSB7XG4gICAgICByZXN1bHQgPSB7IC4uLnJlc3VsdCwgX19hdXRob3JpemF0aW9uX25hbWVfXzogY3JlZGVudGlhbD8uY3JlZGVudGlhbF9uYW1lIH1cbiAgICAgIGlmIChjcmVkZW50aWFscylcbiAgICAgICAgcmVzdWx0ID0geyAuLi5yZXN1bHQsIC4uLmNyZWRlbnRpYWxzIH1cbiAgICB9XG4gICAgaWYgKG1vZGVsKVxuICAgICAgcmVzdWx0ID0geyAuLi5yZXN1bHQsIF9fbW9kZWxfbmFtZTogbW9kZWw/Lm1vZGVsLCBfX21vZGVsX3R5cGU6IG1vZGVsPy5tb2RlbF90eXBlIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH0sIFtjcmVkZW50aWFscywgY3JlZGVudGlhbCwgbW9kZWwsIGZvcm1TY2hlbWFzXSlcblxuICBjb25zdCBtb2RlbE5hbWVBbmRUeXBlRm9ybVNjaGVtYXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAocHJvdmlkZXJGb3JtU2NoZW1hUHJlZGVmaW5lZClcbiAgICAgIHJldHVybiBbXVxuXG4gICAgY29uc3QgbW9kZWxOYW1lU2NoZW1hID0gZ2VuTW9kZWxOYW1lRm9ybVNjaGVtYShtb2RlbF9jcmVkZW50aWFsX3NjaGVtYT8ubW9kZWwpXG4gICAgY29uc3QgbW9kZWxUeXBlU2NoZW1hID0gZ2VuTW9kZWxUeXBlRm9ybVNjaGVtYShzdXBwb3J0ZWRfbW9kZWxfdHlwZXMpXG4gICAgcmV0dXJuIFtcbiAgICAgIG1vZGVsTmFtZVNjaGVtYSxcbiAgICAgIG1vZGVsVHlwZVNjaGVtYSxcbiAgICBdXG4gIH0sIFtzdXBwb3J0ZWRfbW9kZWxfdHlwZXMsIG1vZGVsX2NyZWRlbnRpYWxfc2NoZW1hPy5tb2RlbCwgcHJvdmlkZXJGb3JtU2NoZW1hUHJlZGVmaW5lZF0pXG5cbiAgY29uc3QgbW9kZWxOYW1lQW5kVHlwZUZvcm1WYWx1ZXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBsZXQgcmVzdWx0ID0ge31cbiAgICBpZiAocHJvdmlkZXJGb3JtU2NoZW1hUHJlZGVmaW5lZClcbiAgICAgIHJldHVybiByZXN1bHRcblxuICAgIGlmIChtb2RlbClcbiAgICAgIHJlc3VsdCA9IHsgLi4ucmVzdWx0LCBfX21vZGVsX25hbWU6IG1vZGVsPy5tb2RlbCwgX19tb2RlbF90eXBlOiBtb2RlbD8ubW9kZWxfdHlwZSB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH0sIFttb2RlbCwgcHJvdmlkZXJGb3JtU2NoZW1hUHJlZGVmaW5lZF0pXG5cbiAgcmV0dXJuIHtcbiAgICBmb3JtU2NoZW1hczogZm9ybVNjaGVtYXNXaXRoQXV0aG9yaXphdGlvbk5hbWUsXG4gICAgZm9ybVZhbHVlcyxcbiAgICBtb2RlbE5hbWVBbmRUeXBlRm9ybVNjaGVtYXMsXG4gICAgbW9kZWxOYW1lQW5kVHlwZUZvcm1WYWx1ZXMsXG4gIH1cbn1cbiJdfQ==