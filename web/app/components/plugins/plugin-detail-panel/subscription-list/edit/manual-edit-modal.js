"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualEditModal = void 0;
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
const ManualEditModal = ({ onClose, subscription, pluginDetail }) => {
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
    const propertiesSchema = (0, react_1.useMemo)(() => detail?.declaration?.trigger?.subscription_schema || [], [detail?.declaration?.trigger?.subscription_schema]);
    const formRef = (0, react_1.useRef)(null);
    const handleConfirm = () => {
        const formValues = formRef.current?.getFormValues({
            needTransformWhenSecretFieldIsPristine: true,
        });
        if (!formValues?.isCheckValidated)
            return;
        const name = formValues.values.subscription_name;
        // Extract properties (exclude subscription_name and callback_url)
        const newProperties = { ...formValues.values };
        delete newProperties.subscription_name;
        delete newProperties.callback_url;
        // Only send properties if changed
        const hasChanged = !(0, predicate_1.isEqual)(newProperties, subscription.properties || {});
        const properties = hasChanged ? newProperties : undefined;
        updateSubscription({
            subscriptionId: subscription.id,
            name,
            properties,
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
        ...propertiesSchema.map((schema) => ({
            ...schema,
            type: normalizeFormType(schema.type),
            tooltip: schema.description,
            default: subscription.properties?.[schema.name] || schema.default,
        })),
    ], [t, subscription.name, subscription.endpoint, subscription.properties, propertiesSchema]);
    return (<modal_1.default title={t('subscription.list.item.actions.edit.title', { ns: 'pluginTrigger' })} confirmButtonText={isUpdating ? t('operation.saving', { ns: 'common' }) : t('operation.save', { ns: 'common' })} onClose={onClose} onCancel={onClose} onConfirm={handleConfirm} disabled={isUpdating} clickOutsideNotClose wrapperClassName="!z-[101]">
      {pluginDetail && (<entrance_1.ReadmeEntrance pluginDetail={pluginDetail} showType={store_1.ReadmeShowType.modal}/>)}
      <base_1.BaseForm formSchemas={formSchemas} ref={formRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" formClassName="space-y-4"/>
    </modal_1.default>);
};
exports.ManualEditModal = ManualEditModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFudWFsLWVkaXQtbW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW51YWwtZWRpdC1tb2RhbC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBSVosb0RBQThDO0FBQzlDLGlDQUF1QztBQUN2QyxpREFBOEM7QUFDOUMscUVBQXFFO0FBQ3JFLDREQUErRDtBQUMvRCw2REFBcUQ7QUFDckQsdURBQStDO0FBQy9DLDZFQUErRTtBQUMvRSx5REFBcUU7QUFDckUsdURBQTREO0FBQzVELHVDQUE0QztBQUM1QyxvRUFBOEQ7QUFROUQsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLElBQVksRUFBZ0IsRUFBRTtJQUN2RCxRQUFRLElBQUksRUFBRSxDQUFDO1FBQ2IsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLE1BQU07WUFDVCxPQUFPLG9CQUFZLENBQUMsU0FBUyxDQUFBO1FBQy9CLEtBQUssVUFBVSxDQUFDO1FBQ2hCLEtBQUssUUFBUTtZQUNYLE9BQU8sb0JBQVksQ0FBQyxXQUFXLENBQUE7UUFDakMsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFNBQVM7WUFDWixPQUFPLG9CQUFZLENBQUMsVUFBVSxDQUFBO1FBQ2hDLEtBQUssU0FBUztZQUNaLE9BQU8sb0JBQVksQ0FBQyxPQUFPLENBQUE7UUFDN0IsS0FBSyxRQUFRO1lBQ1gsT0FBTyxvQkFBWSxDQUFDLE1BQU0sQ0FBQTtRQUM1QjtZQUNFLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQW9CLENBQUM7Z0JBQzVELE9BQU8sSUFBb0IsQ0FBQTtZQUM3QixPQUFPLG9CQUFZLENBQUMsU0FBUyxDQUFBO0lBQ2pDLENBQUM7QUFDSCxDQUFDLENBQUE7QUFFTSxNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQVMsRUFBRSxFQUFFO0lBQ2hGLE1BQU0sRUFBRSxDQUFD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QUMsQ0FDVCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBdEhZLFFBQUEsZUFBZSxtQkFzSDNCIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZvcm1SZWZPYmplY3QsIEZvcm1TY2hlbWEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS90eXBlcydcbmltcG9ydCB0eXBlIHsgUGFyYW1ldGVyc1NjaGVtYSwgUGx1Z2luRGV0YWlsIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBUcmlnZ2VyU3Vic2NyaXB0aW9uIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90eXBlcydcbmltcG9ydCB7IGlzRXF1YWwgfSBmcm9tICdlcy10b29sa2l0L3ByZWRpY2F0ZSdcbmltcG9ydCB7IHVzZU1lbW8sIHVzZVJlZiB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgQmFzZUZvcm0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9jb21wb25lbnRzL2Jhc2UnXG5pbXBvcnQgeyBGb3JtVHlwZUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS90eXBlcydcbmltcG9ydCBNb2RhbCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbW9kYWwvbW9kYWwnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgUmVhZG1lRW50cmFuY2UgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvcmVhZG1lLXBhbmVsL2VudHJhbmNlJ1xuaW1wb3J0IHsgdXNlVXBkYXRlVHJpZ2dlclN1YnNjcmlwdGlvbiB9IGZyb20gJ0Avc2VydmljZS91c2UtdHJpZ2dlcnMnXG5pbXBvcnQgeyBSZWFkbWVTaG93VHlwZSB9IGZyb20gJy4uLy4uLy4uL3JlYWRtZS1wYW5lbC9zdG9yZSdcbmltcG9ydCB7IHVzZVBsdWdpblN0b3JlIH0gZnJvbSAnLi4vLi4vc3RvcmUnXG5pbXBvcnQgeyB1c2VTdWJzY3JpcHRpb25MaXN0IH0gZnJvbSAnLi4vdXNlLXN1YnNjcmlwdGlvbi1saXN0J1xuXG50eXBlIFByb3BzID0ge1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkXG4gIHN1YnNjcmlwdGlvbjogVHJpZ2dlclN1YnNjcmlwdGlvblxuICBwbHVnaW5EZXRhaWw/OiBQbHVnaW5EZXRhaWxcbn1cblxuY29uc3Qgbm9ybWFsaXplRm9ybVR5cGUgPSAodHlwZTogc3RyaW5nKTogRm9ybVR5cGVFbnVtID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICBjYXNlICd0ZXh0JzpcbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0udGV4dElucHV0XG4gICAgY2FzZSAncGFzc3dvcmQnOlxuICAgIGNhc2UgJ3NlY3JldCc6XG4gICAgICByZXR1cm4gRm9ybVR5cGVFbnVtLnNlY3JldElucHV0XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0udGV4dE51bWJlclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIEZvcm1UeXBlRW51bS5ib29sZWFuXG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0uc2VsZWN0XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChPYmplY3QudmFsdWVzKEZvcm1UeXBlRW51bSkuaW5jbHVkZXModHlwZSBhcyBGb3JtVHlwZUVudW0pKVxuICAgICAgICByZXR1cm4gdHlwZSBhcyBGb3JtVHlwZUVudW1cbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0udGV4dElucHV0XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1hbnVhbEVkaXRNb2RhbCA9ICh7IG9uQ2xvc2UsIHN1YnNjcmlwdGlvbiwgcGx1Z2luRGV0YWlsIH06IFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBkZXRhaWwgPSB1c2VQbHVnaW5TdG9yZShzdGF0ZSA9PiBzdGF0ZS5kZXRhaWwpXG4gIGNvbnN0IHsgcmVmZXRjaCB9ID0gdXNlU3Vic2NyaXB0aW9uTGlzdCgpXG5cbiAgY29uc3QgeyBtdXRhdGU6IHVwZGF0ZVN1YnNjcmlwdGlvbiwgaXNQZW5kaW5nOiBpc1VwZGF0aW5nIH0gPSB1c2VVcGRhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uKClcblxuICBjb25zdCBnZXRFcnJvck1lc3NhZ2UgPSAoZXJyb3I6IHVua25vd24sIGZhbGxiYWNrOiBzdHJpbmcpID0+IHtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiBlcnJvci5tZXNzYWdlKVxuICAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2VcbiAgICBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyAmJiBlcnJvciAmJiAnbWVzc2FnZScgaW4gZXJyb3IpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSAoZXJyb3IgYXMgeyBtZXNzYWdlPzogc3RyaW5nIH0pLm1lc3NhZ2VcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgbWVzc2FnZSlcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VcbiAgICB9XG4gICAgcmV0dXJuIGZhbGxiYWNrXG4gIH1cblxuICBjb25zdCBwcm9wZXJ0aWVzU2NoZW1hID0gdXNlTWVtbzxQYXJhbWV0ZXJzU2NoZW1hW10+KFxuICAgICgpID0+IGRldGFpbD8uZGVjbGFyYXRpb24/LnRyaWdnZXI/LnN1YnNjcmlwdGlvbl9zY2hlbWEgfHwgW10sXG4gICAgW2RldGFpbD8uZGVjbGFyYXRpb24/LnRyaWdnZXI/LnN1YnNjcmlwdGlvbl9zY2hlbWFdLFxuICApXG5cbiAgY29uc3QgZm9ybVJlZiA9IHVzZVJlZjxGb3JtUmVmT2JqZWN0PihudWxsKVxuXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm0gPSAoKSA9PiB7XG4gICAgY29uc3QgZm9ybVZhbHVlcyA9IGZvcm1SZWYuY3VycmVudD8uZ2V0Rm9ybVZhbHVlcyh7XG4gICAgICBuZWVkVHJhbnNmb3JtV2hlblNlY3JldEZpZWxkSXNQcmlzdGluZTogdHJ1ZSxcbiAgICB9KVxuICAgIGlmICghZm9ybVZhbHVlcz8uaXNDaGVja1ZhbGlkYXRlZClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgbmFtZSA9IGZvcm1WYWx1ZXMudmFsdWVzLnN1YnNjcmlwdGlvbl9uYW1lIGFzIHN0cmluZ1xuXG4gICAgLy8gRXh0cmFjdCBwcm9wZXJ0aWVzIChleGNsdWRlIHN1YnNjcmlwdGlvbl9uYW1lIGFuZCBjYWxsYmFja191cmwpXG4gICAgY29uc3QgbmV3UHJvcGVydGllcyA9IHsgLi4uZm9ybVZhbHVlcy52YWx1ZXMgfVxuICAgIGRlbGV0ZSBuZXdQcm9wZXJ0aWVzLnN1YnNjcmlwdGlvbl9uYW1lXG4gICAgZGVsZXRlIG5ld1Byb3BlcnRpZXMuY2FsbGJhY2tfdXJsXG5cbiAgICAvLyBPbmx5IHNlbmQgcHJvcGVydGllcyBpZiBjaGFuZ2VkXG4gICAgY29uc3QgaGFzQ2hhbmdlZCA9ICFpc0VxdWFsKG5ld1Byb3BlcnRpZXMsIHN1YnNjcmlwdGlvbi5wcm9wZXJ0aWVzIHx8IHt9KVxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBoYXNDaGFuZ2VkID8gbmV3UHJvcGVydGllcyA6IHVuZGVmaW5lZFxuXG4gICAgdXBkYXRlU3Vic2NyaXB0aW9uKFxuICAgICAge1xuICAgICAgICBzdWJzY3JpcHRpb25JZDogc3Vic2NyaXB0aW9uLmlkLFxuICAgICAgICBuYW1lLFxuICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb25TdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHQoJ3N1YnNjcmlwdGlvbi5saXN0Lml0ZW0uYWN0aW9ucy5lZGl0LnN1Y2Nlc3MnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZWZldGNoPy4oKVxuICAgICAgICAgIG9uQ2xvc2UoKVxuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yOiAoZXJyb3I6IHVua25vd24pID0+IHtcbiAgICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGdldEVycm9yTWVzc2FnZShlcnJvciwgdCgnc3Vic2NyaXB0aW9uLmxpc3QuaXRlbS5hY3Rpb25zLmVkaXQuZXJyb3InLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSkpLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIClcbiAgfVxuXG4gIGNvbnN0IGZvcm1TY2hlbWFzOiBGb3JtU2NoZW1hW10gPSB1c2VNZW1vKCgpID0+IFtcbiAgICB7XG4gICAgICBuYW1lOiAnc3Vic2NyaXB0aW9uX25hbWUnLFxuICAgICAgbGFiZWw6IHQoJ21vZGFsLmZvcm0uc3Vic2NyaXB0aW9uTmFtZS5sYWJlbCcsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCdtb2RhbC5mb3JtLnN1YnNjcmlwdGlvbk5hbWUucGxhY2Vob2xkZXInLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICB0eXBlOiBGb3JtVHlwZUVudW0udGV4dElucHV0LFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBkZWZhdWx0OiBzdWJzY3JpcHRpb24ubmFtZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdjYWxsYmFja191cmwnLFxuICAgICAgbGFiZWw6IHQoJ21vZGFsLmZvcm0uY2FsbGJhY2tVcmwubGFiZWwnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICBwbGFjZWhvbGRlcjogdCgnbW9kYWwuZm9ybS5jYWxsYmFja1VybC5wbGFjZWhvbGRlcicsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgIHR5cGU6IEZvcm1UeXBlRW51bS50ZXh0SW5wdXQsXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBkZWZhdWx0OiBzdWJzY3JpcHRpb24uZW5kcG9pbnQgfHwgJycsXG4gICAgICBkaXNhYmxlZDogdHJ1ZSxcbiAgICAgIHRvb2x0aXA6IHQoJ21vZGFsLmZvcm0uY2FsbGJhY2tVcmwudG9vbHRpcCcsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgIHNob3dDb3B5OiB0cnVlLFxuICAgIH0sXG4gICAgLi4ucHJvcGVydGllc1NjaGVtYS5tYXAoKHNjaGVtYTogUGFyYW1ldGVyc1NjaGVtYSkgPT4gKHtcbiAgICAgIC4uLnNjaGVtYSxcbiAgICAgIHR5cGU6IG5vcm1hbGl6ZUZvcm1UeXBlKHNjaGVtYS50eXBlIGFzIHN0cmluZyksXG4gICAgICB0b29sdGlwOiBzY2hlbWEuZGVzY3JpcHRpb24sXG4gICAgICBkZWZhdWx0OiBzdWJzY3JpcHRpb24ucHJvcGVydGllcz8uW3NjaGVtYS5uYW1lXSB8fCBzY2hlbWEuZGVmYXVsdCxcbiAgICB9KSksXG4gIF0sIFt0LCBzdWJzY3JpcHRpb24ubmFtZSwgc3Vic2NyaXB0aW9uLmVuZHBvaW50LCBzdWJzY3JpcHRpb24ucHJvcGVydGllcywgcHJvcGVydGllc1NjaGVtYV0pXG5cbiAgcmV0dXJuIChcbiAgICA8TW9kYWxcbiAgICAgIHRpdGxlPXt0KCdzdWJzY3JpcHRpb24ubGlzdC5pdGVtLmFjdGlvbnMuZWRpdC50aXRsZScsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KX1cbiAgICAgIGNvbmZpcm1CdXR0b25UZXh0PXtpc1VwZGF0aW5nID8gdCgnb3BlcmF0aW9uLnNhdmluZycsIHsgbnM6ICdjb21tb24nIH0pIDogdCgnb3BlcmF0aW9uLnNhdmUnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICBvbkNhbmNlbD17b25DbG9zZX1cbiAgICAgIG9uQ29uZmlybT17aGFuZGxlQ29uZmlybX1cbiAgICAgIGRpc2FibGVkPXtpc1VwZGF0aW5nfVxuICAgICAgY2xpY2tPdXRzaWRlTm90Q2xvc2VcbiAgICAgIHdyYXBwZXJDbGFzc05hbWU9XCIhei1bMTAxXVwiXG4gICAgPlxuICAgICAge3BsdWdpbkRldGFpbCAmJiAoXG4gICAgICAgIDxSZWFkbWVFbnRyYW5jZSBwbHVnaW5EZXRhaWw9e3BsdWdpbkRldGFpbH0gc2hvd1R5cGU9e1JlYWRtZVNob3dUeXBlLm1vZGFsfSAvPlxuICAgICAgKX1cbiAgICAgIDxCYXNlRm9ybVxuICAgICAgICBmb3JtU2NoZW1hcz17Zm9ybVNjaGVtYXN9XG4gICAgICAgIHJlZj17Zm9ybVJlZn1cbiAgICAgICAgbGFiZWxDbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIG1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgdGV4dC10ZXh0LXByaW1hcnlcIlxuICAgICAgICBmb3JtQ2xhc3NOYW1lPVwic3BhY2UteS00XCJcbiAgICAgIC8+XG4gICAgPC9Nb2RhbD5cbiAgKVxufVxuIl19