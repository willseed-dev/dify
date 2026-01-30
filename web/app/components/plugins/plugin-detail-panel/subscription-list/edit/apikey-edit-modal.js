"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyEditModal = void 0;
const predicate_1 = require("es-toolkit/predicate");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const encrypted_bottom_1 = require("@/app/components/base/encrypted-bottom");
const base_1 = require("@/app/components/base/form/components/base");
const types_1 = require("@/app/components/base/form/types");
const modal_1 = require("@/app/components/base/modal/modal");
const toast_1 = require("@/app/components/base/toast");
const entrance_1 = require("@/app/components/plugins/readme-panel/entrance");
const use_triggers_1 = require("@/service/use-triggers");
const error_parser_1 = require("@/utils/error-parser");
const store_1 = require("../../../readme-panel/store");
const store_2 = require("../../store");
const use_subscription_list_1 = require("../use-subscription-list");
var EditStep;
(function (EditStep) {
    EditStep["EditCredentials"] = "edit_credentials";
    EditStep["EditConfiguration"] = "edit_configuration";
})(EditStep || (EditStep = {}));
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
const HIDDEN_SECRET_VALUE = '[__HIDDEN__]';
// Check if all credential values are hidden (meaning nothing was changed)
const areAllCredentialsHidden = (credentials) => {
    return Object.values(credentials).every(value => value === HIDDEN_SECRET_VALUE);
};
const StatusStep = ({ isActive, text, onClick, clickable }) => {
    return (<div className={`system-2xs-semibold-uppercase flex items-center gap-1 ${isActive
            ? 'text-state-accent-solid'
            : 'text-text-tertiary'} ${clickable ? 'cursor-pointer hover:text-text-secondary' : ''}`} onClick={clickable ? onClick : undefined}>
      {isActive && (<div className="h-1 w-1 rounded-full bg-state-accent-solid"></div>)}
      {text}
    </div>);
};
const MultiSteps = ({ currentStep, onStepClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="mb-6 flex w-1/3 items-center gap-2">
      <StatusStep isActive={currentStep === EditStep.EditCredentials} text={t('modal.steps.verify', { ns: 'pluginTrigger' })} onClick={() => onStepClick?.(EditStep.EditCredentials)} clickable={currentStep === EditStep.EditConfiguration}/>
      <div className="h-px w-3 shrink-0 bg-divider-deep"></div>
      <StatusStep isActive={currentStep === EditStep.EditConfiguration} text={t('modal.steps.configuration', { ns: 'pluginTrigger' })}/>
    </div>);
};
const ApiKeyEditModal = ({ onClose, subscription, pluginDetail }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const detail = (0, store_2.usePluginStore)(state => state.detail);
    const { refetch } = (0, use_subscription_list_1.useSubscriptionList)();
    const [currentStep, setCurrentStep] = (0, react_1.useState)(EditStep.EditCredentials);
    const [verifiedCredentials, setVerifiedCredentials] = (0, react_1.useState)(null);
    const { mutate: updateSubscription, isPending: isUpdating } = (0, use_triggers_1.useUpdateTriggerSubscription)();
    const { mutate: verifyCredentials, isPending: isVerifying } = (0, use_triggers_1.useVerifyTriggerSubscription)();
    const parametersSchema = (0, react_1.useMemo)(() => detail?.declaration?.trigger?.subscription_constructor?.parameters || [], [detail?.declaration?.trigger?.subscription_constructor?.parameters]);
    const apiKeyCredentialsSchema = (0, react_1.useMemo)(() => {
        const rawSchema = detail?.declaration?.trigger?.subscription_constructor?.credentials_schema || [];
        return rawSchema.map(schema => ({
            ...schema,
            tooltip: schema.help,
        }));
    }, [detail?.declaration?.trigger?.subscription_constructor?.credentials_schema]);
    const basicFormRef = (0, react_1.useRef)(null);
    const parametersFormRef = (0, react_1.useRef)(null);
    const credentialsFormRef = (0, react_1.useRef)(null);
    const handleVerifyCredentials = () => {
        const credentialsFormValues = credentialsFormRef.current?.getFormValues({
            needTransformWhenSecretFieldIsPristine: true,
        }) || { values: {}, isCheckValidated: false };
        if (!credentialsFormValues.isCheckValidated)
            return;
        const credentials = credentialsFormValues.values;
        verifyCredentials({
            provider: subscription.provider,
            subscriptionId: subscription.id,
            credentials,
        }, {
            onSuccess: () => {
                toast_1.default.notify({
                    type: 'success',
                    message: t('modal.apiKey.verify.success', { ns: 'pluginTrigger' }),
                });
                // Only save credentials if any field was modified (not all hidden)
                setVerifiedCredentials(areAllCredentialsHidden(credentials) ? null : credentials);
                setCurrentStep(EditStep.EditConfiguration);
            },
            onError: async (error) => {
                const errorMessage = await (0, error_parser_1.parsePluginErrorMessage)(error) || t('modal.apiKey.verify.error', { ns: 'pluginTrigger' });
                toast_1.default.notify({
                    type: 'error',
                    message: errorMessage,
                });
            },
        });
    };
    const handleUpdate = () => {
        const basicFormValues = basicFormRef.current?.getFormValues({});
        if (!basicFormValues?.isCheckValidated)
            return;
        const name = basicFormValues.values.subscription_name;
        let parameters;
        if (parametersSchema.length > 0) {
            const paramsFormValues = parametersFormRef.current?.getFormValues({
                needTransformWhenSecretFieldIsPristine: true,
            });
            if (!paramsFormValues?.isCheckValidated)
                return;
            // Only send parameters if changed
            const hasChanged = !(0, predicate_1.isEqual)(paramsFormValues.values, subscription.parameters || {});
            parameters = hasChanged ? paramsFormValues.values : undefined;
        }
        updateSubscription({
            subscriptionId: subscription.id,
            name,
            parameters,
            credentials: verifiedCredentials || undefined,
        }, {
            onSuccess: () => {
                toast_1.default.notify({
                    type: 'success',
                    message: t('subscription.list.item.actions.edit.success', { ns: 'pluginTrigger' }),
                });
                refetch?.();
                onClose();
            },
            onError: async (error) => {
                const errorMessage = await (0, error_parser_1.parsePluginErrorMessage)(error) || t('subscription.list.item.actions.edit.error', { ns: 'pluginTrigger' });
                toast_1.default.notify({
                    type: 'error',
                    message: errorMessage,
                });
            },
        });
    };
    const handleConfirm = () => {
        if (currentStep === EditStep.EditCredentials)
            handleVerifyCredentials();
        else
            handleUpdate();
    };
    const basicFormSchemas = (0, react_1.useMemo)(() => [
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
    ], [t, subscription.name, subscription.endpoint]);
    const credentialsFormSchemas = (0, react_1.useMemo)(() => {
        return apiKeyCredentialsSchema.map(schema => ({
            ...schema,
            type: normalizeFormType(schema.type),
            tooltip: schema.help,
            default: subscription.credentials?.[schema.name] || schema.default,
        }));
    }, [apiKeyCredentialsSchema, subscription.credentials]);
    const parametersFormSchemas = (0, react_1.useMemo)(() => {
        return parametersSchema.map((schema) => {
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
                        credentials: verifiedCredentials || undefined,
                    }
                    : undefined,
                fieldClassName: schema.type === types_1.FormTypeEnum.boolean ? 'flex items-center justify-between' : undefined,
                labelClassName: schema.type === types_1.FormTypeEnum.boolean ? 'mb-0' : undefined,
            };
        });
    }, [parametersSchema, subscription.parameters, subscription.id, detail?.plugin_id, detail?.provider, verifiedCredentials]);
    const getConfirmButtonText = () => {
        if (currentStep === EditStep.EditCredentials)
            return isVerifying ? t('modal.common.verifying', { ns: 'pluginTrigger' }) : t('modal.common.verify', { ns: 'pluginTrigger' });
        return isUpdating ? t('operation.saving', { ns: 'common' }) : t('operation.save', { ns: 'common' });
    };
    const handleBack = () => {
        setCurrentStep(EditStep.EditCredentials);
        setVerifiedCredentials(null);
    };
    return (<modal_1.default title={t('subscription.list.item.actions.edit.title', { ns: 'pluginTrigger' })} confirmButtonText={getConfirmButtonText()} onClose={onClose} onCancel={onClose} onConfirm={handleConfirm} disabled={isUpdating || isVerifying} showExtraButton={currentStep === EditStep.EditConfiguration} extraButtonText={t('modal.common.back', { ns: 'pluginTrigger' })} extraButtonVariant="secondary" onExtraButtonClick={handleBack} clickOutsideNotClose wrapperClassName="!z-[101]" bottomSlot={currentStep === EditStep.EditCredentials ? <encrypted_bottom_1.EncryptedBottom /> : null}>
      {pluginDetail && (<entrance_1.ReadmeEntrance pluginDetail={pluginDetail} showType={store_1.ReadmeShowType.modal}/>)}

      {/* Multi-step indicator */}
      <MultiSteps currentStep={currentStep} onStepClick={handleBack}/>

      {/* Step 1: Edit Credentials */}
      {currentStep === EditStep.EditCredentials && (<div className="mb-4">
          {credentialsFormSchemas.length > 0 && (<base_1.BaseForm formSchemas={credentialsFormSchemas} ref={credentialsFormRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" formClassName="space-y-4" preventDefaultSubmit={true}/>)}
        </div>)}

      {/* Step 2: Edit Configuration */}
      {currentStep === EditStep.EditConfiguration && (<div className="max-h-[70vh]">
          {/* Basic form: subscription name and callback URL */}
          <base_1.BaseForm formSchemas={basicFormSchemas} ref={basicFormRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" formClassName="space-y-4 mb-4"/>

          {/* Parameters */}
          {parametersFormSchemas.length > 0 && (<base_1.BaseForm formSchemas={parametersFormSchemas} ref={parametersFormRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" formClassName="space-y-4"/>)}
        </div>)}
    </modal_1.default>);
};
exports.ApiKeyEditModal = ApiKeyEditModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpa2V5LWVkaXQtbW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGlrZXktZWRpdC1tb2RhbC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBSVosb0RBQThDO0FBQzlDLGlDQUFpRDtBQUNqRCxpREFBOEM7QUFDOUMsNkVBQXdFO0FBQ3hFLHFFQUFxRTtBQUNyRSw0REFBK0Q7QUFDL0QsNkRBQXFEO0FBQ3JELHVEQUErQztBQUMvQyw2RUFBK0U7QUFDL0UseURBQW1HO0FBQ25HLHVEQUE4RDtBQUM5RCx1REFBNEQ7QUFDNUQsdUNBQTRDO0FBQzVDLG9FQUE4RDtBQVE5RCxJQUFLLFFBR0o7QUFIRCxXQUFLLFFBQVE7SUFDWCxnREFBb0MsQ0FBQTtJQUNwQyxvREFBd0MsQ0FBQTtBQUMxQyxDQUFDLEVBSEksUUFBUSxLQUFSLFFBQVEsUUFHWjtBQUVELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxJQUFZLEVBQWdCLEVBQUU7SUFDdkQsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNiLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxNQUFNO1lBQ1QsT0FBTyxvQkFBWSxDQUFDLFNBQVMsQ0FBQTtRQUMvQixLQUFLLFVBQVUsQ0FBQztRQUNoQixLQUFLLFFBQVE7WUFDWCxPQUFPLG9CQUFZLENBQUMsV0FBVyxDQUFBO1FBQ2pDLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxTQUFTO1lBQ1osT0FBTyxvQkFBWSxDQUFDLFVBQVUsQ0FBQTtRQUNoQyxLQUFLLFNBQVM7WUFDWixPQUFPLG9CQUFZLENBQUMsT0FBTyxDQUFBO1FBQzdCLEtBQUssUUFBUTtZQUNYLE9BQU8sb0JBQVksQ0FBQyxNQUFNLENBQUE7UUFDNUI7WUFDRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFvQixDQUFDO2dCQUM1RCxPQUFPLElBQW9CLENBQUE7WUFDN0IsT0FBTyxvQkFBWSxDQUFD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QixjQUFjLENBQUMsaUVBQWlFLENBQ2hGLGFBQWEsQ0FBQyxnQkFBZ0IsRUFHaEM7O1VBQUEsQ0FBQyxnQkFBZ0IsQ0FDakI7VUFBQSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FDbkMsQ0FBQyxlQUFRLENBQ1AsV0FBVyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FDbkMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FDdkIsY0FBYyxDQUFDLGlFQUFpRSxDQUNoRixhQUFhLENBQUMsV0FBVyxFQUN6QixDQUNILENBQ0g7UUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ0g7SUFBQSxFQUFFLGVBQUssQ0FBQyxDQUNULENBQUE7QUFDSCxDQUFDLENBQUE7QUF6UFksUUFBQSxlQUFlLG1CQXlQM0IiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRm9ybVJlZk9iamVjdCwgRm9ybVNjaGVtYSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQYXJhbWV0ZXJzU2NoZW1hLCBQbHVnaW5EZXRhaWwgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFRyaWdnZXJTdWJzY3JpcHRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgaXNFcXVhbCB9IGZyb20gJ2VzLXRvb2xraXQvcHJlZGljYXRlJ1xuaW1wb3J0IHsgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgRW5jcnlwdGVkQm90dG9tIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2VuY3J5cHRlZC1ib3R0b20nXG5pbXBvcnQgeyBCYXNlRm9ybSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL2NvbXBvbmVudHMvYmFzZSdcbmltcG9ydCB7IEZvcm1UeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL3R5cGVzJ1xuaW1wb3J0IE1vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9tb2RhbC9tb2RhbCdcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBSZWFkbWVFbnRyYW5jZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9yZWFkbWUtcGFuZWwvZW50cmFuY2UnXG5pbXBvcnQgeyB1c2VVcGRhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uLCB1c2VWZXJpZnlUcmlnZ2VyU3Vic2NyaXB0aW9uIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10cmlnZ2VycydcbmltcG9ydCB7IHBhcnNlUGx1Z2luRXJyb3JNZXNzYWdlIH0gZnJvbSAnQC91dGlscy9lcnJvci1wYXJzZXInXG5pbXBvcnQgeyBSZWFkbWVTaG93VHlwZSB9IGZyb20gJy4uLy4uLy4uL3JlYWRtZS1wYW5lbC9zdG9yZSdcbmltcG9ydCB7IHVzZVBsdWdpblN0b3JlIH0gZnJvbSAnLi4vLi4vc3RvcmUnXG5pbXBvcnQgeyB1c2VTdWJzY3JpcHRpb25MaXN0IH0gZnJvbSAnLi4vdXNlLXN1YnNjcmlwdGlvbi1saXN0J1xuXG50eXBlIFByb3BzID0ge1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkXG4gIHN1YnNjcmlwdGlvbjogVHJpZ2dlclN1YnNjcmlwdGlvblxuICBwbHVnaW5EZXRhaWw/OiBQbHVnaW5EZXRhaWxcbn1cblxuZW51bSBFZGl0U3RlcCB7XG4gIEVkaXRDcmVkZW50aWFscyA9ICdlZGl0X2NyZWRlbnRpYWxzJyxcbiAgRWRpdENvbmZpZ3VyYXRpb24gPSAnZWRpdF9jb25maWd1cmF0aW9uJyxcbn1cblxuY29uc3Qgbm9ybWFsaXplRm9ybVR5cGUgPSAodHlwZTogc3RyaW5nKTogRm9ybVR5cGVFbnVtID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICBjYXNlICd0ZXh0JzpcbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0udGV4dElucHV0XG4gICAgY2FzZSAncGFzc3dvcmQnOlxuICAgIGNhc2UgJ3NlY3JldCc6XG4gICAgICByZXR1cm4gRm9ybVR5cGVFbnVtLnNlY3JldElucHV0XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0udGV4dE51bWJlclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIEZvcm1UeXBlRW51bS5ib29sZWFuXG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0uc2VsZWN0XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChPYmplY3QudmFsdWVzKEZvcm1UeXBlRW51bSkuaW5jbHVkZXModHlwZSBhcyBGb3JtVHlwZUVudW0pKVxuICAgICAgICByZXR1cm4gdHlwZSBhcyBGb3JtVHlwZUVudW1cbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0udGV4dElucHV0XG4gIH1cbn1cblxuY29uc3QgSElEREVOX1NFQ1JFVF9WQUxVRSA9ICdbX19ISURERU5fX10nXG5cbi8vIENoZWNrIGlmIGFsbCBjcmVkZW50aWFsIHZhbHVlcyBhcmUgaGlkZGVuIChtZWFuaW5nIG5vdGhpbmcgd2FzIGNoYW5nZWQpXG5jb25zdCBhcmVBbGxDcmVkZW50aWFsc0hpZGRlbiA9IChjcmVkZW50aWFsczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIE9iamVjdC52YWx1ZXMoY3JlZGVudGlhbHMpLmV2ZXJ5KHZhbHVlID0+IHZhbHVlID09PSBISURERU5fU0VDUkVUX1ZBTFVFKVxufVxuXG5jb25zdCBTdGF0dXNTdGVwID0gKHsgaXNBY3RpdmUsIHRleHQsIG9uQ2xpY2ssIGNsaWNrYWJsZSB9OiB7XG4gIGlzQWN0aXZlOiBib29sZWFuXG4gIHRleHQ6IHN0cmluZ1xuICBvbkNsaWNrPzogKCkgPT4gdm9pZFxuICBjbGlja2FibGU/OiBib29sZWFuXG59KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtgc3lzdGVtLTJ4cy1zZW1pYm9sZC11cHBlcmNhc2UgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgJHtpc0FjdGl2ZVxuICAgICAgICA/ICd0ZXh0LXN0YXRlLWFjY2VudC1zb2xpZCdcbiAgICAgICAgOiAndGV4dC10ZXh0LXRlcnRpYXJ5J30gJHtjbGlja2FibGUgPyAnY3Vyc29yLXBvaW50ZXIgaG92ZXI6dGV4dC10ZXh0LXNlY29uZGFyeScgOiAnJ31gfVxuICAgICAgb25DbGljaz17Y2xpY2thYmxlID8gb25DbGljayA6IHVuZGVmaW5lZH1cbiAgICA+XG4gICAgICB7aXNBY3RpdmUgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMSB3LTEgcm91bmRlZC1mdWxsIGJnLXN0YXRlLWFjY2VudC1zb2xpZFwiPjwvZGl2PlxuICAgICAgKX1cbiAgICAgIHt0ZXh0fVxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IE11bHRpU3RlcHMgPSAoeyBjdXJyZW50U3RlcCwgb25TdGVwQ2xpY2sgfTogeyBjdXJyZW50U3RlcDogRWRpdFN0ZXAsIG9uU3RlcENsaWNrPzogKHN0ZXA6IEVkaXRTdGVwKSA9PiB2b2lkIH0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtYi02IGZsZXggdy0xLzMgaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICA8U3RhdHVzU3RlcFxuICAgICAgICBpc0FjdGl2ZT17Y3VycmVudFN0ZXAgPT09IEVkaXRTdGVwLkVkaXRDcmVkZW50aWFsc31cbiAgICAgICAgdGV4dD17dCgnbW9kYWwuc3RlcHMudmVyaWZ5JywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblN0ZXBDbGljaz8uKEVkaXRTdGVwLkVkaXRDcmVkZW50aWFscyl9XG4gICAgICAgIGNsaWNrYWJsZT17Y3VycmVudFN0ZXAgPT09IEVkaXRTdGVwLkVkaXRDb25maWd1cmF0aW9ufVxuICAgICAgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC1weCB3LTMgc2hyaW5rLTAgYmctZGl2aWRlci1kZWVwXCI+PC9kaXY+XG4gICAgICA8U3RhdHVzU3RlcFxuICAgICAgICBpc0FjdGl2ZT17Y3VycmVudFN0ZXAgPT09IEVkaXRTdGVwLkVkaXRDb25maWd1cmF0aW9ufVxuICAgICAgICB0ZXh0PXt0KCdtb2RhbC5zdGVwcy5jb25maWd1cmF0aW9uJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgQXBpS2V5RWRpdE1vZGFsID0gKHsgb25DbG9zZSwgc3Vic2NyaXB0aW9uLCBwbHVnaW5EZXRhaWwgfTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGRldGFpbCA9IHVzZVBsdWdpblN0b3JlKHN0YXRlID0+IHN0YXRlLmRldGFpbClcbiAgY29uc3QgeyByZWZldGNoIH0gPSB1c2VTdWJzY3JpcHRpb25MaXN0KClcblxuICBjb25zdCBbY3VycmVudFN0ZXAsIHNldEN1cnJlbnRTdGVwXSA9IHVzZVN0YXRlPEVkaXRTdGVwPihFZGl0U3RlcC5FZGl0Q3JlZGVudGlhbHMpXG4gIGNvbnN0IFt2ZXJpZmllZENyZWRlbnRpYWxzLCBzZXRWZXJpZmllZENyZWRlbnRpYWxzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbD4obnVsbClcblxuICBjb25zdCB7IG11dGF0ZTogdXBkYXRlU3Vic2NyaXB0aW9uLCBpc1BlbmRpbmc6IGlzVXBkYXRpbmcgfSA9IHVzZVVwZGF0ZVRyaWdnZXJTdWJzY3JpcHRpb24oKVxuICBjb25zdCB7IG11dGF0ZTogdmVyaWZ5Q3JlZGVudGlhbHMsIGlzUGVuZGluZzogaXNWZXJpZnlpbmcgfSA9IHVzZVZlcmlmeVRyaWdnZXJTdWJzY3JpcHRpb24oKVxuXG4gIGNvbnN0IHBhcmFtZXRlcnNTY2hlbWEgPSB1c2VNZW1vPFBhcmFtZXRlcnNTY2hlbWFbXT4oXG4gICAgKCkgPT4gZGV0YWlsPy5kZWNsYXJhdGlvbj8udHJpZ2dlcj8uc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yPy5wYXJhbWV0ZXJzIHx8IFtdLFxuICAgIFtkZXRhaWw/LmRlY2xhcmF0aW9uPy50cmlnZ2VyPy5zdWJzY3JpcHRpb25fY29uc3RydWN0b3I/LnBhcmFtZXRlcnNdLFxuICApXG5cbiAgY29uc3QgYXBpS2V5Q3JlZGVudGlhbHNTY2hlbWEgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCByYXdTY2hlbWEgPSBkZXRhaWw/LmRlY2xhcmF0aW9uPy50cmlnZ2VyPy5zdWJzY3JpcHRpb25fY29uc3RydWN0b3I/LmNyZWRlbnRpYWxzX3NjaGVtYSB8fCBbXVxuICAgIHJldHVybiByYXdTY2hlbWEubWFwKHNjaGVtYSA9PiAoe1xuICAgICAgLi4uc2NoZW1hLFxuICAgICAgdG9vbHRpcDogc2NoZW1hLmhlbHAsXG4gICAgfSkpXG4gIH0sIFtkZXRhaWw/LmRlY2xhcmF0aW9uPy50cmlnZ2VyPy5zdWJzY3JpcHRpb25fY29uc3RydWN0b3I/LmNyZWRlbnRpYWxzX3NjaGVtYV0pXG5cbiAgY29uc3QgYmFzaWNGb3JtUmVmID0gdXNlUmVmPEZvcm1SZWZPYmplY3Q+KG51bGwpXG4gIGNvbnN0IHBhcmFtZXRlcnNGb3JtUmVmID0gdXNlUmVmPEZvcm1SZWZPYmplY3Q+KG51bGwpXG4gIGNvbnN0IGNyZWRlbnRpYWxzRm9ybVJlZiA9IHVzZVJlZjxGb3JtUmVmT2JqZWN0PihudWxsKVxuXG4gIGNvbnN0IGhhbmRsZVZlcmlmeUNyZWRlbnRpYWxzID0gKCkgPT4ge1xuICAgIGNvbnN0IGNyZWRlbnRpYWxzRm9ybVZhbHVlcyA9IGNyZWRlbnRpYWxzRm9ybVJlZi5jdXJyZW50Py5nZXRGb3JtVmFsdWVzKHtcbiAgICAgIG5lZWRUcmFuc2Zvcm1XaGVuU2VjcmV0RmllbGRJc1ByaXN0aW5lOiB0cnVlLFxuICAgIH0pIHx8IHsgdmFsdWVzOiB7fSwgaXNDaGVja1ZhbGlkYXRlZDogZmFsc2UgfVxuXG4gICAgaWYgKCFjcmVkZW50aWFsc0Zvcm1WYWx1ZXMuaXNDaGVja1ZhbGlkYXRlZClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgY3JlZGVudGlhbHMgPSBjcmVkZW50aWFsc0Zvcm1WYWx1ZXMudmFsdWVzXG5cbiAgICB2ZXJpZnlDcmVkZW50aWFscyhcbiAgICAgIHtcbiAgICAgICAgcHJvdmlkZXI6IHN1YnNjcmlwdGlvbi5wcm92aWRlcixcbiAgICAgICAgc3Vic2NyaXB0aW9uSWQ6IHN1YnNjcmlwdGlvbi5pZCxcbiAgICAgICAgY3JlZGVudGlhbHMsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvblN1Y2Nlc3M6ICgpID0+IHtcbiAgICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgbWVzc2FnZTogdCgnbW9kYWwuYXBpS2V5LnZlcmlmeS5zdWNjZXNzJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLy8gT25seSBzYXZlIGNyZWRlbnRpYWxzIGlmIGFueSBmaWVsZCB3YXMgbW9kaWZpZWQgKG5vdCBhbGwgaGlkZGVuKVxuICAgICAgICAgIHNldFZlcmlmaWVkQ3JlZGVudGlhbHMoYXJlQWxsQ3JlZGVudGlhbHNIaWRkZW4oY3JlZGVudGlhbHMpID8gbnVsbCA6IGNyZWRlbnRpYWxzKVxuICAgICAgICAgIHNldEN1cnJlbnRTdGVwKEVkaXRTdGVwLkVkaXRDb25maWd1cmF0aW9uKVxuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yOiBhc3luYyAoZXJyb3I6IHVua25vd24pID0+IHtcbiAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBhd2FpdCBwYXJzZVBsdWdpbkVycm9yTWVzc2FnZShlcnJvcikgfHwgdCgnbW9kYWwuYXBpS2V5LnZlcmlmeS5lcnJvcicsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KVxuICAgICAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JNZXNzYWdlLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIClcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVVwZGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCBiYXNpY0Zvcm1WYWx1ZXMgPSBiYXNpY0Zvcm1SZWYuY3VycmVudD8uZ2V0Rm9ybVZhbHVlcyh7fSlcbiAgICBpZiAoIWJhc2ljRm9ybVZhbHVlcz8uaXNDaGVja1ZhbGlkYXRlZClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgbmFtZSA9IGJhc2ljRm9ybVZhbHVlcy52YWx1ZXMuc3Vic2NyaXB0aW9uX25hbWUgYXMgc3RyaW5nXG5cbiAgICBsZXQgcGFyYW1ldGVyczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWRcblxuICAgIGlmIChwYXJhbWV0ZXJzU2NoZW1hLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHBhcmFtc0Zvcm1WYWx1ZXMgPSBwYXJhbWV0ZXJzRm9ybVJlZi5jdXJyZW50Py5nZXRGb3JtVmFsdWVzKHtcbiAgICAgICAgbmVlZFRyYW5zZm9ybVdoZW5TZWNyZXRGaWVsZElzUHJpc3RpbmU6IHRydWUsXG4gICAgICB9KVxuICAgICAgaWYgKCFwYXJhbXNGb3JtVmFsdWVzPy5pc0NoZWNrVmFsaWRhdGVkKVxuICAgICAgICByZXR1cm5cblxuICAgICAgLy8gT25seSBzZW5kIHBhcmFtZXRlcnMgaWYgY2hhbmdlZFxuICAgICAgY29uc3QgaGFzQ2hhbmdlZCA9ICFpc0VxdWFsKHBhcmFtc0Zvcm1WYWx1ZXMudmFsdWVzLCBzdWJzY3JpcHRpb24ucGFyYW1ldGVycyB8fCB7fSlcbiAgICAgIHBhcmFtZXRlcnMgPSBoYXNDaGFuZ2VkID8gcGFyYW1zRm9ybVZhbHVlcy52YWx1ZXMgOiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICB1cGRhdGVTdWJzY3JpcHRpb24oXG4gICAgICB7XG4gICAgICAgIHN1YnNjcmlwdGlvbklkOiBzdWJzY3JpcHRpb24uaWQsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHBhcmFtZXRlcnMsXG4gICAgICAgIGNyZWRlbnRpYWxzOiB2ZXJpZmllZENyZWRlbnRpYWxzIHx8IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9uU3VjY2VzczogKCkgPT4ge1xuICAgICAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgICBtZXNzYWdlOiB0KCdzdWJzY3JpcHRpb24ubGlzdC5pdGVtLmFjdGlvbnMuZWRpdC5zdWNjZXNzJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmVmZXRjaD8uKClcbiAgICAgICAgICBvbkNsb3NlKClcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcjogYXN5bmMgKGVycm9yOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYXdhaXQgcGFyc2VQbHVnaW5FcnJvck1lc3NhZ2UoZXJyb3IpIHx8IHQoJ3N1YnNjcmlwdGlvbi5saXN0Lml0ZW0uYWN0aW9ucy5lZGl0LmVycm9yJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pXG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybSA9ICgpID0+IHtcbiAgICBpZiAoY3VycmVudFN0ZXAgPT09IEVkaXRTdGVwLkVkaXRDcmVkZW50aWFscylcbiAgICAgIGhhbmRsZVZlcmlmeUNyZWRlbnRpYWxzKClcbiAgICBlbHNlXG4gICAgICBoYW5kbGVVcGRhdGUoKVxuICB9XG5cbiAgY29uc3QgYmFzaWNGb3JtU2NoZW1hczogRm9ybVNjaGVtYVtdID0gdXNlTWVtbygoKSA9PiBbXG4gICAge1xuICAgICAgbmFtZTogJ3N1YnNjcmlwdGlvbl9uYW1lJyxcbiAgICAgIGxhYmVsOiB0KCdtb2RhbC5mb3JtLnN1YnNjcmlwdGlvbk5hbWUubGFiZWwnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICBwbGFjZWhvbGRlcjogdCgnbW9kYWwuZm9ybS5zdWJzY3JpcHRpb25OYW1lLnBsYWNlaG9sZGVyJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgdHlwZTogRm9ybVR5cGVFbnVtLnRleHRJbnB1dCxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgZGVmYXVsdDogc3Vic2NyaXB0aW9uLm5hbWUsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnY2FsbGJhY2tfdXJsJyxcbiAgICAgIGxhYmVsOiB0KCdtb2RhbC5mb3JtLmNhbGxiYWNrVXJsLmxhYmVsJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgcGxhY2Vob2xkZXI6IHQoJ21vZGFsLmZvcm0uY2FsbGJhY2tVcmwucGxhY2Vob2xkZXInLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICB0eXBlOiBGb3JtVHlwZUVudW0udGV4dElucHV0LFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgZGVmYXVsdDogc3Vic2NyaXB0aW9uLmVuZHBvaW50IHx8ICcnLFxuICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICB0b29sdGlwOiB0KCdtb2RhbC5mb3JtLmNhbGxiYWNrVXJsLnRvb2x0aXAnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICBzaG93Q29weTogdHJ1ZSxcbiAgICB9LFxuICBdLCBbdCwgc3Vic2NyaXB0aW9uLm5hbWUsIHN1YnNjcmlwdGlvbi5lbmRwb2ludF0pXG5cbiAgY29uc3QgY3JlZGVudGlhbHNGb3JtU2NoZW1hczogRm9ybVNjaGVtYVtdID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGFwaUtleUNyZWRlbnRpYWxzU2NoZW1hLm1hcChzY2hlbWEgPT4gKHtcbiAgICAgIC4uLnNjaGVtYSxcbiAgICAgIHR5cGU6IG5vcm1hbGl6ZUZvcm1UeXBlKHNjaGVtYS50eXBlIGFzIHN0cmluZyksXG4gICAgICB0b29sdGlwOiBzY2hlbWEuaGVscCxcbiAgICAgIGRlZmF1bHQ6IHN1YnNjcmlwdGlvbi5jcmVkZW50aWFscz8uW3NjaGVtYS5uYW1lXSB8fCBzY2hlbWEuZGVmYXVsdCxcbiAgICB9KSlcbiAgfSwgW2FwaUtleUNyZWRlbnRpYWxzU2NoZW1hLCBzdWJzY3JpcHRpb24uY3JlZGVudGlhbHNdKVxuXG4gIGNvbnN0IHBhcmFtZXRlcnNGb3JtU2NoZW1hczogRm9ybVNjaGVtYVtdID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHBhcmFtZXRlcnNTY2hlbWEubWFwKChzY2hlbWE6IFBhcmFtZXRlcnNTY2hlbWEpID0+IHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRUeXBlID0gbm9ybWFsaXplRm9ybVR5cGUoc2NoZW1hLnR5cGUgYXMgc3RyaW5nKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc2NoZW1hLFxuICAgICAgICB0eXBlOiBub3JtYWxpemVkVHlwZSxcbiAgICAgICAgdG9vbHRpcDogc2NoZW1hLmRlc2NyaXB0aW9uLFxuICAgICAgICBkZWZhdWx0OiBzdWJzY3JpcHRpb24ucGFyYW1ldGVycz8uW3NjaGVtYS5uYW1lXSB8fCBzY2hlbWEuZGVmYXVsdCxcbiAgICAgICAgZHluYW1pY1NlbGVjdFBhcmFtczogbm9ybWFsaXplZFR5cGUgPT09IEZvcm1UeXBlRW51bS5keW5hbWljU2VsZWN0XG4gICAgICAgICAgPyB7XG4gICAgICAgICAgICAgIHBsdWdpbl9pZDogZGV0YWlsPy5wbHVnaW5faWQgfHwgJycsXG4gICAgICAgICAgICAgIHByb3ZpZGVyOiBkZXRhaWw/LnByb3ZpZGVyIHx8ICcnLFxuICAgICAgICAgICAgICBhY3Rpb246ICdwcm92aWRlcicsXG4gICAgICAgICAgICAgIHBhcmFtZXRlcjogc2NoZW1hLm5hbWUsXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxfaWQ6IHN1YnNjcmlwdGlvbi5pZCxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IHZlcmlmaWVkQ3JlZGVudGlhbHMgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBmaWVsZENsYXNzTmFtZTogc2NoZW1hLnR5cGUgPT09IEZvcm1UeXBlRW51bS5ib29sZWFuID8gJ2ZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbicgOiB1bmRlZmluZWQsXG4gICAgICAgIGxhYmVsQ2xhc3NOYW1lOiBzY2hlbWEudHlwZSA9PT0gRm9ybVR5cGVFbnVtLmJvb2xlYW4gPyAnbWItMCcgOiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgfSlcbiAgfSwgW3BhcmFtZXRlcnNTY2hlbWEsIHN1YnNjcmlwdGlvbi5wYXJhbWV0ZXJzLCBzdWJzY3JpcHRpb24uaWQsIGRldGFpbD8ucGx1Z2luX2lkLCBkZXRhaWw/LnByb3ZpZGVyLCB2ZXJpZmllZENyZWRlbnRpYWxzXSlcblxuICBjb25zdCBnZXRDb25maXJtQnV0dG9uVGV4dCA9ICgpID0+IHtcbiAgICBpZiAoY3VycmVudFN0ZXAgPT09IEVkaXRTdGVwLkVkaXRDcmVkZW50aWFscylcbiAgICAgIHJldHVybiBpc1ZlcmlmeWluZyA/IHQoJ21vZGFsLmNvbW1vbi52ZXJpZnlpbmcnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSkgOiB0KCdtb2RhbC5jb21tb24udmVyaWZ5JywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pXG5cbiAgICByZXR1cm4gaXNVcGRhdGluZyA/IHQoJ29wZXJhdGlvbi5zYXZpbmcnLCB7IG5zOiAnY29tbW9uJyB9KSA6IHQoJ29wZXJhdGlvbi5zYXZlJywgeyBuczogJ2NvbW1vbicgfSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZUJhY2sgPSAoKSA9PiB7XG4gICAgc2V0Q3VycmVudFN0ZXAoRWRpdFN0ZXAuRWRpdENyZWRlbnRpYWxzKVxuICAgIHNldFZlcmlmaWVkQ3JlZGVudGlhbHMobnVsbClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPE1vZGFsXG4gICAgICB0aXRsZT17dCgnc3Vic2NyaXB0aW9uLmxpc3QuaXRlbS5hY3Rpb25zLmVkaXQudGl0bGUnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSl9XG4gICAgICBjb25maXJtQnV0dG9uVGV4dD17Z2V0Q29uZmlybUJ1dHRvblRleHQoKX1cbiAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICBvbkNhbmNlbD17b25DbG9zZX1cbiAgICAgIG9uQ29uZmlybT17aGFuZGxlQ29uZmlybX1cbiAgICAgIGRpc2FibGVkPXtpc1VwZGF0aW5nIHx8IGlzVmVyaWZ5aW5nfVxuICAgICAgc2hvd0V4dHJhQnV0dG9uPXtjdXJyZW50U3RlcCA9PT0gRWRpdFN0ZXAuRWRpdENvbmZpZ3VyYXRpb259XG4gICAgICBleHRyYUJ1dHRvblRleHQ9e3QoJ21vZGFsLmNvbW1vbi5iYWNrJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pfVxuICAgICAgZXh0cmFCdXR0b25WYXJpYW50PVwic2Vjb25kYXJ5XCJcbiAgICAgIG9uRXh0cmFCdXR0b25DbGljaz17aGFuZGxlQmFja31cbiAgICAgIGNsaWNrT3V0c2lkZU5vdENsb3NlXG4gICAgICB3cmFwcGVyQ2xhc3NOYW1lPVwiIXotWzEwMV1cIlxuICAgICAgYm90dG9tU2xvdD17Y3VycmVudFN0ZXAgPT09IEVkaXRTdGVwLkVkaXRDcmVkZW50aWFscyA/IDxFbmNyeXB0ZWRCb3R0b20gLz4gOiBudWxsfVxuICAgID5cbiAgICAgIHtwbHVnaW5EZXRhaWwgJiYgKFxuICAgICAgICA8UmVhZG1lRW50cmFuY2UgcGx1Z2luRGV0YWlsPXtwbHVnaW5EZXRhaWx9IHNob3dUeXBlPXtSZWFkbWVTaG93VHlwZS5tb2RhbH0gLz5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBNdWx0aS1zdGVwIGluZGljYXRvciAqL31cbiAgICAgIDxNdWx0aVN0ZXBzIGN1cnJlbnRTdGVwPXtjdXJyZW50U3RlcH0gb25TdGVwQ2xpY2s9e2hhbmRsZUJhY2t9IC8+XG5cbiAgICAgIHsvKiBTdGVwIDE6IEVkaXQgQ3JlZGVudGlhbHMgKi99XG4gICAgICB7Y3VycmVudFN0ZXAgPT09IEVkaXRTdGVwLkVkaXRDcmVkZW50aWFscyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNFwiPlxuICAgICAgICAgIHtjcmVkZW50aWFsc0Zvcm1TY2hlbWFzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPEJhc2VGb3JtXG4gICAgICAgICAgICAgIGZvcm1TY2hlbWFzPXtjcmVkZW50aWFsc0Zvcm1TY2hlbWFzfVxuICAgICAgICAgICAgICByZWY9e2NyZWRlbnRpYWxzRm9ybVJlZn1cbiAgICAgICAgICAgICAgbGFiZWxDbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIG1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgdGV4dC10ZXh0LXByaW1hcnlcIlxuICAgICAgICAgICAgICBmb3JtQ2xhc3NOYW1lPVwic3BhY2UteS00XCJcbiAgICAgICAgICAgICAgcHJldmVudERlZmF1bHRTdWJtaXQ9e3RydWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgey8qIFN0ZXAgMjogRWRpdCBDb25maWd1cmF0aW9uICovfVxuICAgICAge2N1cnJlbnRTdGVwID09PSBFZGl0U3RlcC5FZGl0Q29uZmlndXJhdGlvbiAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LWgtWzcwdmhdXCI+XG4gICAgICAgICAgey8qIEJhc2ljIGZvcm06IHN1YnNjcmlwdGlvbiBuYW1lIGFuZCBjYWxsYmFjayBVUkwgKi99XG4gICAgICAgICAgPEJhc2VGb3JtXG4gICAgICAgICAgICBmb3JtU2NoZW1hcz17YmFzaWNGb3JtU2NoZW1hc31cbiAgICAgICAgICAgIHJlZj17YmFzaWNGb3JtUmVmfVxuICAgICAgICAgICAgbGFiZWxDbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIG1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgdGV4dC10ZXh0LXByaW1hcnlcIlxuICAgICAgICAgICAgZm9ybUNsYXNzTmFtZT1cInNwYWNlLXktNCBtYi00XCJcbiAgICAgICAgICAvPlxuXG4gICAgICAgICAgey8qIFBhcmFtZXRlcnMgKi99XG4gICAgICAgICAge3BhcmFtZXRlcnNGb3JtU2NoZW1hcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxCYXNlRm9ybVxuICAgICAgICAgICAgICBmb3JtU2NoZW1hcz17cGFyYW1ldGVyc0Zvcm1TY2hlbWFzfVxuICAgICAgICAgICAgICByZWY9e3BhcmFtZXRlcnNGb3JtUmVmfVxuICAgICAgICAgICAgICBsYWJlbENsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gbWItMiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXRleHQtcHJpbWFyeVwiXG4gICAgICAgICAgICAgIGZvcm1DbGFzc05hbWU9XCJzcGFjZS15LTRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9Nb2RhbD5cbiAgKVxufVxuIl19