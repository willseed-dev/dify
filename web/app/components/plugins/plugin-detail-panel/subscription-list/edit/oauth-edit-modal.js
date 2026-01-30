"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthEditModal = void 0;
const predicate_1 = require("es-toolkit/predicate");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const base_1 = require("@/app/components/base/form/components/base");
const types_1 = require("@/app/components/base/form/types");
const modal_1 = require("@/app/components/base/modal/modal");
const toast_1 = require("@/app/components/base/toast");
const entrance_1 = require("@/app/components/plugins/readme-panel/entrance");
const use_triggers_1 = require("@/service/use-triggers");
const store_1 = require("../../../readme-panel/store");
const store_2 = require("../../store");
const use_subscription_list_1 = require("../use-subscription-list");
const normalizeFormType = (type) => {
    switch (type) {
        case 'string':
        case 'text':
            return types_1.FormTypeEnum.textInput;
        case 'password':
        case 'secret':
            return types_1.FormTypeEnum.secretInput;
        case 'number':
        case 'integer':
            return types_1.FormTypeEnum.textNumber;
        case 'boolean':
            return types_1.FormTypeEnum.boolean;
        case 'select':
            return types_1.FormTypeEnum.select;
        default:
            if (Object.values(types_1.FormTypeEnum).includes(type))
                return type;
            return types_1.FormTypeEnum.textInput;
    }
};
const OAuthEditModal = ({ onClose, subscription, pluginDetail }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const detail = (0, store_2.usePluginStore)(state => state.detail);
    const { refetch } = (0, use_subscription_list_1.useSubscriptionList)();
    const { mutate: updateSubscription, isPending: isUpdating } = (0, use_triggers_1.useUpdateTriggerSubscription)();
    const getErrorMessage = (error, fallback) => {
        if (error instanceof Error && error.message)
            return error.message;
        if (typeof error === 'object' && error && 'message' in error) {
            const message = error.message;
            if (typeof message === 'string' && message)
                return message;
        }
        return fallback;
    };
    const parametersSchema = (0, react_1.useMemo)(() => detail?.declaration?.trigger?.subscription_constructor?.parameters || [], [detail?.declaration?.trigger?.subscription_constructor?.parameters]);
    const formRef = (0, react_1.useRef)(null);
    const handleConfirm = () => {
        const formValues = formRef.current?.getFormValues({
            needTransformWhenSecretFieldIsPristine: true,
        });
        if (!formValues?.isCheckValidated)
            return;
        const name = formValues.values.subscription_name;
        // Extract parameters (exclude subscription_name and callback_url)
        const newParameters = { ...formValues.values };
        delete newParameters.subscription_name;
        delete newParameters.callback_url;
        // Only send parameters if changed
        const hasChanged = !(0, predicate_1.isEqual)(newParameters, subscription.parameters || {});
        const parameters = hasChanged ? newParameters : undefined;
        updateSubscription({
            subscriptionId: subscription.id,
            name,
            parameters,
        }, {
            onSuccess: () => {
                toast_1.default.notify({
                    type: 'success',
                    message: t('subscription.list.item.actions.edit.success', { ns: 'pluginTrigger' }),
                });
                refetch?.();
                onClose();
            },
            onError: (error) => {
                toast_1.default.notify({
                    type: 'error',
                    message: getErrorMessage(error, t('subscription.list.item.actions.edit.error', { ns: 'pluginTrigger' })),
                });
            },
        });
    };
    const formSchemas = (0, react_1.useMemo)(() => [
        {
            name: 'subscription_name',
            label: t('modal.form.subscriptionName.label', { ns: 'pluginTrigger' }),
            placeholder: t('modal.form.subscriptionName.placeholder', { ns: 'pluginTrigger' }),
            type: types_1.FormTypeEnum.textInput,
            required: true,
            default: subscription.name,
        },
        {
            name: 'callback_url',
            label: t('modal.form.callbackUrl.label', { ns: 'pluginTrigger' }),
            placeholder: t('modal.form.callbackUrl.placeholder', { ns: 'pluginTrigger' }),
            type: types_1.FormTypeEnum.textInput,
            required: false,
            default: subscription.endpoint || '',
            disabled: true,
            tooltip: t('modal.form.callbackUrl.tooltip', { ns: 'pluginTrigger' }),
            showCopy: true,
        },
        ...parametersSchema.map((schema) => {
            const normalizedType = normalizeFormType(schema.type);
            return {
                ...schema,
                type: normalizedType,
                tooltip: schema.description,
                default: subscription.parameters?.[schema.name] || schema.default,
                dynamicSelectParams: normalizedType === types_1.FormTypeEnum.dynamicSelect
                    ? {
                        plugin_id: detail?.plugin_id || '',
                        provider: detail?.provider || '',
                        action: 'provider',
                        parameter: schema.name,
                        credential_id: subscription.id,
                    }
                    : undefined,
                fieldClassName: schema.type === types_1.FormTypeEnum.boolean ? 'flex items-center justify-between' : undefined,
                labelClassName: schema.type === types_1.FormTypeEnum.boolean ? 'mb-0' : undefined,
            };
        }),
    ], [t, subscription.name, subscription.endpoint, subscription.parameters, subscription.id, parametersSchema, detail?.plugin_id, detail?.provider]);
    return (<modal_1.default title={t('subscription.list.item.actions.edit.title', { ns: 'pluginTrigger' })} confirmButtonText={isUpdating ? t('operation.saving', { ns: 'common' }) : t('operation.save', { ns: 'common' })} onClose={onClose} onCancel={onClose} onConfirm={handleConfirm} disabled={isUpdating} clickOutsideNotClose wrapperClassName="!z-[101]">
      {pluginDetail && (<entrance_1.ReadmeEntrance pluginDetail={pluginDetail} showType={store_1.ReadmeShowType.modal}/>)}
      <base_1.BaseForm formSchemas={formSchemas} ref={formRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" formClassName="space-y-4"/>
    </modal_1.default>);
};
exports.OAuthEditModal = OAuthEditModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtZWRpdC1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9hdXRoLWVkaXQtbW9kYWwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7OztBQUlaLG9EQUE4QztBQUM5QyxpQ0FBdUM7QUFDdkMsaURBQThDO0FBQzlDLHFFQUFxRTtBQUNyRSw0REFBK0Q7QUFDL0QsNkRBQXFEO0FBQ3JELHVEQUErQztBQUMvQyw2RUFBK0U7QUFDL0UseURBQXFFO0FBQ3JFLHVEQUE0RDtBQUM1RCx1Q0FBNEM7QUFDNUMsb0VBQThEO0FBUTlELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxJQUFZLEVBQWdCLEVBQUU7SUFDdkQsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNiLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxNQUFNO1lBQ1QsT0FBTyxvQkFBWSxDQUFDLFNBQVMsQ0FBQTtRQUMvQixLQUFLLFVBQVUsQ0FBQztRQUNoQixLQUFLLFFBQVE7WUFDWCxPQUFPLG9CQUFZLENBQUMsV0FBVyxDQUFBO1FBQ2pDLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxTQUFTO1lBQ1osT0FBTyxvQkFBWSxDQUFDLFVBQVUsQ0FBQTtRQUNoQyxLQUFLLFNBQVM7WUFDWixPQUFPLG9CQUFZLENBQUMsT0FBTyxDQUFBO1FBQzdCLEtBQUssUUFBUTtZQUNYLE9BQU8sb0JBQVksQ0FBQyxNQUFNLENBQUE7UUFDNUI7WUFDRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFvQixDQUFDO2dCQUM1RCxPQUFPLElBQW9CLENBQUE7WUFDN0IsT0FBTyxvQkFBWSxDQUFDLFNBQVMsQ0FBQTtJQUNqQyxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBRU0sTUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFTLEVBQUUsRUFBRTtJQUMvRSxNQUFNLEVBQUUsQ0FBQyxF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QUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FDaEgsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pCLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNsQixTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FDekIsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQ3JCLG9CQUFvQixDQUNwQixnQkFBZ0IsQ0FBQyxVQUFVLENBRTNCO01BQUEsQ0FBQyxZQUFZLElBQUksQ0FDZixDQUFDLHlCQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsc0JBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRyxDQUMvRSxDQUNEO01BQUEsQ0FBQyxlQUFRLENBQ1AsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQ3pCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNiLGNBQWMsQ0FBQyxpRUFBaUUsQ0FDaEYsYUFBYSxDQUFDLFdBQVcsRUFFN0I7SUFBQSxFQUFFLGVBQUssQ0FBQyxDQUNULENBQUE7QUFDSCxDQUFDLENBQUE7QUFwSVksUUFBQSxjQUFjLGtCQW9JMUIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRm9ybVJlZk9iamVjdCwgRm9ybVNjaGVtYSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQYXJhbWV0ZXJzU2NoZW1hLCBQbHVnaW5EZXRhaWwgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFRyaWdnZXJTdWJzY3JpcHRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgaXNFcXVhbCB9IGZyb20gJ2VzLXRvb2xraXQvcHJlZGljYXRlJ1xuaW1wb3J0IHsgdXNlTWVtbywgdXNlUmVmIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBCYXNlRm9ybSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL2NvbXBvbmVudHMvYmFzZSdcbmltcG9ydCB7IEZvcm1UeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL3R5cGVzJ1xuaW1wb3J0IE1vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9tb2RhbC9tb2RhbCdcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBSZWFkbWVFbnRyYW5jZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9yZWFkbWUtcGFuZWwvZW50cmFuY2UnXG5pbXBvcnQgeyB1c2VVcGRhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10cmlnZ2VycydcbmltcG9ydCB7IFJlYWRtZVNob3dUeXBlIH0gZnJvbSAnLi4vLi4vLi4vcmVhZG1lLXBhbmVsL3N0b3JlJ1xuaW1wb3J0IHsgdXNlUGx1Z2luU3RvcmUgfSBmcm9tICcuLi8uLi9zdG9yZSdcbmltcG9ydCB7IHVzZVN1YnNjcmlwdGlvbkxpc3QgfSBmcm9tICcuLi91c2Utc3Vic2NyaXB0aW9uLWxpc3QnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgc3Vic2NyaXB0aW9uOiBUcmlnZ2VyU3Vic2NyaXB0aW9uXG4gIHBsdWdpbkRldGFpbD86IFBsdWdpbkRldGFpbFxufVxuXG5jb25zdCBub3JtYWxpemVGb3JtVHlwZSA9ICh0eXBlOiBzdHJpbmcpOiBGb3JtVHlwZUVudW0gPT4ge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgIGNhc2UgJ3RleHQnOlxuICAgICAgcmV0dXJuIEZvcm1UeXBlRW51bS50ZXh0SW5wdXRcbiAgICBjYXNlICdwYXNzd29yZCc6XG4gICAgY2FzZSAnc2VjcmV0JzpcbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0uc2VjcmV0SW5wdXRcbiAgICBjYXNlICdudW1iZXInOlxuICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgcmV0dXJuIEZvcm1UeXBlRW51bS50ZXh0TnVtYmVyXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gRm9ybVR5cGVFbnVtLmJvb2xlYW5cbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgcmV0dXJuIEZvcm1UeXBlRW51bS5zZWxlY3RcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKE9iamVjdC52YWx1ZXMoRm9ybVR5cGVFbnVtKS5pbmNsdWRlcyh0eXBlIGFzIEZvcm1UeXBlRW51bSkpXG4gICAgICAgIHJldHVybiB0eXBlIGFzIEZvcm1UeXBlRW51bVxuICAgICAgcmV0dXJuIEZvcm1UeXBlRW51bS50ZXh0SW5wdXRcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgT0F1dGhFZGl0TW9kYWwgPSAoeyBvbkNsb3NlLCBzdWJzY3JpcHRpb24sIHBsdWdpbkRldGFpbCB9OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgZGV0YWlsID0gdXNlUGx1Z2luU3RvcmUoc3RhdGUgPT4gc3RhdGUuZGV0YWlsKVxuICBjb25zdCB7IHJlZmV0Y2ggfSA9IHVzZVN1YnNjcmlwdGlvbkxpc3QoKVxuXG4gIGNvbnN0IHsgbXV0YXRlOiB1cGRhdGVTdWJzY3JpcHRpb24sIGlzUGVuZGluZzogaXNVcGRhdGluZyB9ID0gdXNlVXBkYXRlVHJpZ2dlclN1YnNjcmlwdGlvbigpXG5cbiAgY29uc3QgZ2V0RXJyb3JNZXNzYWdlID0gKGVycm9yOiB1bmtub3duLCBmYWxsYmFjazogc3RyaW5nKSA9PiB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgZXJyb3IubWVzc2FnZSlcbiAgICAgIHJldHVybiBlcnJvci5tZXNzYWdlXG4gICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcgJiYgZXJyb3IgJiYgJ21lc3NhZ2UnIGluIGVycm9yKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gKGVycm9yIGFzIHsgbWVzc2FnZT86IHN0cmluZyB9KS5tZXNzYWdlXG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnICYmIG1lc3NhZ2UpXG4gICAgICAgIHJldHVybiBtZXNzYWdlXG4gICAgfVxuICAgIHJldHVybiBmYWxsYmFja1xuICB9XG5cbiAgY29uc3QgcGFyYW1ldGVyc1NjaGVtYSA9IHVzZU1lbW88UGFyYW1ldGVyc1NjaGVtYVtdPihcbiAgICAoKSA9PiBkZXRhaWw/LmRlY2xhcmF0aW9uPy50cmlnZ2VyPy5zdWJzY3JpcHRpb25fY29uc3RydWN0b3I/LnBhcmFtZXRlcnMgfHwgW10sXG4gICAgW2RldGFpbD8uZGVjbGFyYXRpb24/LnRyaWdnZXI/LnN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcj8ucGFyYW1ldGVyc10sXG4gIClcblxuICBjb25zdCBmb3JtUmVmID0gdXNlUmVmPEZvcm1SZWZPYmplY3Q+KG51bGwpXG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybSA9ICgpID0+IHtcbiAgICBjb25zdCBmb3JtVmFsdWVzID0gZm9ybVJlZi5jdXJyZW50Py5nZXRGb3JtVmFsdWVzKHtcbiAgICAgIG5lZWRUcmFuc2Zvcm1XaGVuU2VjcmV0RmllbGRJc1ByaXN0aW5lOiB0cnVlLFxuICAgIH0pXG4gICAgaWYgKCFmb3JtVmFsdWVzPy5pc0NoZWNrVmFsaWRhdGVkKVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBuYW1lID0gZm9ybVZhbHVlcy52YWx1ZXMuc3Vic2NyaXB0aW9uX25hbWUgYXMgc3RyaW5nXG5cbiAgICAvLyBFeHRyYWN0IHBhcmFtZXRlcnMgKGV4Y2x1ZGUgc3Vic2NyaXB0aW9uX25hbWUgYW5kIGNhbGxiYWNrX3VybClcbiAgICBjb25zdCBuZXdQYXJhbWV0ZXJzID0geyAuLi5mb3JtVmFsdWVzLnZhbHVlcyB9XG4gICAgZGVsZXRlIG5ld1BhcmFtZXRlcnMuc3Vic2NyaXB0aW9uX25hbWVcbiAgICBkZWxldGUgbmV3UGFyYW1ldGVycy5jYWxsYmFja191cmxcblxuICAgIC8vIE9ubHkgc2VuZCBwYXJhbWV0ZXJzIGlmIGNoYW5nZWRcbiAgICBjb25zdCBoYXNDaGFuZ2VkID0gIWlzRXF1YWwobmV3UGFyYW1ldGVycywgc3Vic2NyaXB0aW9uLnBhcmFtZXRlcnMgfHwge30pXG4gICAgY29uc3QgcGFyYW1ldGVycyA9IGhhc0NoYW5nZWQgPyBuZXdQYXJhbWV0ZXJzIDogdW5kZWZpbmVkXG5cbiAgICB1cGRhdGVTdWJzY3JpcHRpb24oXG4gICAgICB7XG4gICAgICAgIHN1YnNjcmlwdGlvbklkOiBzdWJzY3JpcHRpb24uaWQsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHBhcmFtZXRlcnMsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvblN1Y2Nlc3M6ICgpID0+IHtcbiAgICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgbWVzc2FnZTogdCgnc3Vic2NyaXB0aW9uLmxpc3QuaXRlbS5hY3Rpb25zLmVkaXQuc3VjY2VzcycsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJlZmV0Y2g/LigpXG4gICAgICAgICAgb25DbG9zZSgpXG4gICAgICAgIH0sXG4gICAgICAgIG9uRXJyb3I6IChlcnJvcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogZ2V0RXJyb3JNZXNzYWdlKGVycm9yLCB0KCdzdWJzY3JpcHRpb24ubGlzdC5pdGVtLmFjdGlvbnMuZWRpdC5lcnJvcicsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSksXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgKVxuICB9XG5cbiAgY29uc3QgZm9ybVNjaGVtYXM6IEZvcm1TY2hlbWFbXSA9IHVzZU1lbW8oKCkgPT4gW1xuICAgIHtcbiAgICAgIG5hbWU6ICdzdWJzY3JpcHRpb25fbmFtZScsXG4gICAgICBsYWJlbDogdCgnbW9kYWwuZm9ybS5zdWJzY3JpcHRpb25OYW1lLmxhYmVsJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgcGxhY2Vob2xkZXI6IHQoJ21vZGFsLmZvcm0uc3Vic2NyaXB0aW9uTmFtZS5wbGFjZWhvbGRlcicsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgIHR5cGU6IEZvcm1UeXBlRW51bS50ZXh0SW5wdXQsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGRlZmF1bHQ6IHN1YnNjcmlwdGlvbi5uYW1lLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2NhbGxiYWNrX3VybCcsXG4gICAgICBsYWJlbDogdCgnbW9kYWwuZm9ybS5jYWxsYmFja1VybC5sYWJlbCcsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCdtb2RhbC5mb3JtLmNhbGxiYWNrVXJsLnBsYWNlaG9sZGVyJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgdHlwZTogRm9ybVR5cGVFbnVtLnRleHRJbnB1dCxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IHN1YnNjcmlwdGlvbi5lbmRwb2ludCB8fCAnJyxcbiAgICAgIGRpc2FibGVkOiB0cnVlLFxuICAgICAgdG9vbHRpcDogdCgnbW9kYWwuZm9ybS5jYWxsYmFja1VybC50b29sdGlwJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgc2hvd0NvcHk6IHRydWUsXG4gICAgfSxcbiAgICAuLi5wYXJhbWV0ZXJzU2NoZW1hLm1hcCgoc2NoZW1hOiBQYXJhbWV0ZXJzU2NoZW1hKSA9PiB7XG4gICAgICBjb25zdCBub3JtYWxpemVkVHlwZSA9IG5vcm1hbGl6ZUZvcm1UeXBlKHNjaGVtYS50eXBlIGFzIHN0cmluZylcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnNjaGVtYSxcbiAgICAgICAgdHlwZTogbm9ybWFsaXplZFR5cGUsXG4gICAgICAgIHRvb2x0aXA6IHNjaGVtYS5kZXNjcmlwdGlvbixcbiAgICAgICAgZGVmYXVsdDogc3Vic2NyaXB0aW9uLnBhcmFtZXRlcnM/LltzY2hlbWEubmFtZV0gfHwgc2NoZW1hLmRlZmF1bHQsXG4gICAgICAgIGR5bmFtaWNTZWxlY3RQYXJhbXM6IG5vcm1hbGl6ZWRUeXBlID09PSBGb3JtVHlwZUVudW0uZHluYW1pY1NlbGVjdFxuICAgICAgICAgID8ge1xuICAgICAgICAgICAgICBwbHVnaW5faWQ6IGRldGFpbD8ucGx1Z2luX2lkIHx8ICcnLFxuICAgICAgICAgICAgICBwcm92aWRlcjogZGV0YWlsPy5wcm92aWRlciB8fCAnJyxcbiAgICAgICAgICAgICAgYWN0aW9uOiAncHJvdmlkZXInLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXI6IHNjaGVtYS5uYW1lLFxuICAgICAgICAgICAgICBjcmVkZW50aWFsX2lkOiBzdWJzY3JpcHRpb24uaWQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGZpZWxkQ2xhc3NOYW1lOiBzY2hlbWEudHlwZSA9PT0gRm9ybVR5cGVFbnVtLmJvb2xlYW4gPyAnZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGFiZWxDbGFzc05hbWU6IHNjaGVtYS50eXBlID09PSBGb3JtVHlwZUVudW0uYm9vbGVhbiA/ICdtYi0wJyA6IHVuZGVmaW5lZCxcbiAgICAgIH1cbiAgICB9KSxcbiAgXSwgW3QsIHN1YnNjcmlwdGlvbi5uYW1lLCBzdWJzY3JpcHRpb24uZW5kcG9pbnQsIHN1YnNjcmlwdGlvbi5wYXJhbWV0ZXJzLCBzdWJzY3JpcHRpb24uaWQsIHBhcmFtZXRlcnNTY2hlbWEsIGRldGFpbD8ucGx1Z2luX2lkLCBkZXRhaWw/LnByb3ZpZGVyXSlcblxuICByZXR1cm4gKFxuICAgIDxNb2RhbFxuICAgICAgdGl0bGU9e3QoJ3N1YnNjcmlwdGlvbi5saXN0Lml0ZW0uYWN0aW9ucy5lZGl0LnRpdGxlJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pfVxuICAgICAgY29uZmlybUJ1dHRvblRleHQ9e2lzVXBkYXRpbmcgPyB0KCdvcGVyYXRpb24uc2F2aW5nJywgeyBuczogJ2NvbW1vbicgfSkgOiB0KCdvcGVyYXRpb24uc2F2ZScsIHsgbnM6ICdjb21tb24nIH0pfVxuICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgIG9uQ2FuY2VsPXtvbkNsb3NlfVxuICAgICAgb25Db25maXJtPXtoYW5kbGVDb25maXJtfVxuICAgICAgZGlzYWJsZWQ9e2lzVXBkYXRpbmd9XG4gICAgICBjbGlja091dHNpZGVOb3RDbG9zZVxuICAgICAgd3JhcHBlckNsYXNzTmFtZT1cIiF6LVsxMDFdXCJcbiAgICA+XG4gICAgICB7cGx1Z2luRGV0YWlsICYmIChcbiAgICAgICAgPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17cGx1Z2luRGV0YWlsfSBzaG93VHlwZT17UmVhZG1lU2hvd1R5cGUubW9kYWx9IC8+XG4gICAgICApfVxuICAgICAgPEJhc2VGb3JtXG4gICAgICAgIGZvcm1TY2hlbWFzPXtmb3JtU2NoZW1hc31cbiAgICAgICAgcmVmPXtmb3JtUmVmfVxuICAgICAgICBsYWJlbENsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gbWItMiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXRleHQtcHJpbWFyeVwiXG4gICAgICAgIGZvcm1DbGFzc05hbWU9XCJzcGFjZS15LTRcIlxuICAgICAgLz5cbiAgICA8L01vZGFsPlxuICApXG59XG4iXX0=