"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonCreateModal = void 0;
const react_1 = require("@remixicon/react");
const compat_1 = require("es-toolkit/compat");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
// import { CopyFeedbackNew } from '@/app/components/base/copy-feedback'
const encrypted_bottom_1 = require("@/app/components/base/encrypted-bottom");
const base_1 = require("@/app/components/base/form/components/base");
const types_1 = require("@/app/components/base/form/types");
const modal_1 = require("@/app/components/base/modal/modal");
const toast_1 = require("@/app/components/base/toast");
const types_2 = require("@/app/components/plugins/types");
const types_3 = require("@/app/components/workflow/block-selector/types");
const use_triggers_1 = require("@/service/use-triggers");
const error_parser_1 = require("@/utils/error-parser");
const urlValidation_1 = require("@/utils/urlValidation");
const store_1 = require("../../store");
const log_viewer_1 = require("../log-viewer");
const use_subscription_list_1 = require("../use-subscription-list");
const CREDENTIAL_TYPE_MAP = {
    [types_2.SupportedCreationMethods.APIKEY]: types_3.TriggerCredentialTypeEnum.ApiKey,
    [types_2.SupportedCreationMethods.OAUTH]: types_3.TriggerCredentialTypeEnum.Oauth2,
    [types_2.SupportedCreationMethods.MANUAL]: types_3.TriggerCredentialTypeEnum.Unauthorized,
};
const MODAL_TITLE_KEY_MAP = {
    [types_2.SupportedCreationMethods.APIKEY]: 'modal.apiKey.title',
    [types_2.SupportedCreationMethods.OAUTH]: 'modal.oauth.title',
    [types_2.SupportedCreationMethods.MANUAL]: 'modal.manual.title',
};
var ApiKeyStep;
(function (ApiKeyStep) {
    ApiKeyStep["Verify"] = "verify";
    ApiKeyStep["Configuration"] = "configuration";
})(ApiKeyStep || (ApiKeyStep = {}));
const defaultFormValues = { values: {}, isCheckValidated: false };
const normalizeFormType = (type) => {
    if (Object.values(types_1.FormTypeEnum).includes(type))
        return type;
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
        default:
            return types_1.FormTypeEnum.textInput;
    }
};
const StatusStep = ({ isActive, text }) => {
    return (<div className={`system-2xs-semibold-uppercase flex items-center gap-1 ${isActive
            ? 'text-state-accent-solid'
            : 'text-text-tertiary'}`}>
      {/* Active indicator dot */}
      {isActive && (<div className="h-1 w-1 rounded-full bg-state-accent-solid"></div>)}
      {text}
    </div>);
};
const MultiSteps = ({ currentStep }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="mb-6 flex w-1/3 items-center gap-2">
      <StatusStep isActive={currentStep === ApiKeyStep.Verify} text={t('modal.steps.verify', { ns: 'pluginTrigger' })}/>
      <div className="h-px w-3 shrink-0 bg-divider-deep"></div>
      <StatusStep isActive={currentStep === ApiKeyStep.Configuration} text={t('modal.steps.configuration', { ns: 'pluginTrigger' })}/>
    </div>);
};
const CommonCreateModal = ({ onClose, createType, builder }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const detail = (0, store_1.usePluginStore)(state => state.detail);
    const { refetch } = (0, use_subscription_list_1.useSubscriptionList)();
    const [currentStep, setCurrentStep] = (0, react_2.useState)(createType === types_2.SupportedCreationMethods.APIKEY ? ApiKeyStep.Verify : ApiKeyStep.Configuration);
    const [subscriptionBuilder, setSubscriptionBuilder] = (0, react_2.useState)(builder);
    const isInitializedRef = (0, react_2.useRef)(false);
    const { mutate: verifyCredentials, isPending: isVerifyingCredentials } = (0, use_triggers_1.useVerifyAndUpdateTriggerSubscriptionBuilder)();
    const { mutateAsync: createBuilder /* isPending: isCreatingBuilder */ } = (0, use_triggers_1.useCreateTriggerSubscriptionBuilder)();
    const { mutate: buildSubscription, isPending: isBuilding } = (0, use_triggers_1.useBuildTriggerSubscription)();
    const { mutate: updateBuilder } = (0, use_triggers_1.useUpdateTriggerSubscriptionBuilder)();
    const manualPropertiesSchema = detail?.declaration?.trigger?.subscription_schema || []; // manual
    const manualPropertiesFormRef = React.useRef(null);
    const subscriptionFormRef = React.useRef(null);
    const autoCommonParametersSchema = detail?.declaration.trigger?.subscription_constructor?.parameters || []; // apikey and oauth
    const autoCommonParametersFormRef = React.useRef(null);
    const apiKeyCredentialsSchema = (0, react_2.useMemo)(() => {
        const rawSchema = detail?.declaration?.trigger?.subscription_constructor?.credentials_schema || [];
        return rawSchema.map(schema => ({
            ...schema,
            tooltip: schema.help,
        }));
    }, [detail?.declaration?.trigger?.subscription_constructor?.credentials_schema]);
    const apiKeyCredentialsFormRef = React.useRef(null);
    const { data: logData } = (0, use_triggers_1.useTriggerSubscriptionBuilderLogs)(detail?.provider || '', subscriptionBuilder?.id || '', {
        enabled: createType === types_2.SupportedCreationMethods.MANUAL,
        refetchInterval: 3000,
    });
    (0, react_2.useEffect)(() => {
        const initializeBuilder = async () => {
            isInitializedRef.current = true;
            try {
                const response = await createBuilder({
                    provider: detail?.provider || '',
                    credential_type: CREDENTIAL_TYPE_MAP[createType],
                });
                setSubscriptionBuilder(response.subscription_builder);
            }
            catch (error) {
                console.error('createBuilder error:', error);
                toast_1.default.notify({
                    type: 'error',
                    message: t('modal.errors.createFailed', { ns: 'pluginTrigger' }),
                });
            }
        };
        if (!isInitializedRef.current && !subscriptionBuilder && detail?.provider)
            initializeBuilder();
    }, [subscriptionBuilder, detail?.provider, createType, createBuilder, t]);
    (0, react_2.useEffect)(() => {
        if (subscriptionBuilder?.endpoint && subscriptionFormRef.current && currentStep === ApiKeyStep.Configuration) {
            const form = subscriptionFormRef.current.getForm();
            if (form)
                form.setFieldValue('callback_url', subscriptionBuilder.endpoint);
            if ((0, urlValidation_1.isPrivateOrLocalAddress)(subscriptionBuilder.endpoint)) {
                console.warn('callback_url is private or local address', subscriptionBuilder.endpoint);
                subscriptionFormRef.current?.setFields([{
                        name: 'callback_url',
                        warnings: [t('modal.form.callbackUrl.privateAddressWarning', { ns: 'pluginTrigger' })],
                    }]);
            }
            else {
                subscriptionFormRef.current?.setFields([{
                        name: 'callback_url',
                        warnings: [],
                    }]);
            }
        }
    }, [subscriptionBuilder?.endpoint, currentStep, t]);
    const debouncedUpdate = (0, react_2.useMemo)(() => (0, compat_1.debounce)((provider, builderId, properties) => {
        updateBuilder({
            provider,
            subscriptionBuilderId: builderId,
            properties,
        }, {
            onError: async (error) => {
                const errorMessage = await (0, error_parser_1.parsePluginErrorMessage)(error) || t('modal.errors.updateFailed', { ns: 'pluginTrigger' });
                console.error('Failed to update subscription builder:', error);
                toast_1.default.notify({
                    type: 'error',
                    message: errorMessage,
                });
            },
        });
    }, 500), [updateBuilder, t]);
    const handleManualPropertiesChange = (0, react_2.useCallback)(() => {
        if (!subscriptionBuilder || !detail?.provider)
            return;
        const formValues = manualPropertiesFormRef.current?.getFormValues({ needCheckValidatedValues: false }) || { values: {}, isCheckValidated: true };
        debouncedUpdate(detail.provider, subscriptionBuilder.id, formValues.values);
    }, [subscriptionBuilder, detail?.provider, debouncedUpdate]);
    (0, react_2.useEffect)(() => {
        return () => {
            debouncedUpdate.cancel();
        };
    }, [debouncedUpdate]);
    const handleVerify = () => {
        const apiKeyCredentialsFormValues = apiKeyCredentialsFormRef.current?.getFormValues({}) || defaultFormValues;
        const credentials = apiKeyCredentialsFormValues.values;
        if (!Object.keys(credentials).length) {
            toast_1.default.notify({
                type: 'error',
                message: 'Please fill in all required credentials',
            });
            return;
        }
        apiKeyCredentialsFormRef.current?.setFields([{
                name: Object.keys(credentials)[0],
                errors: [],
            }]);
        verifyCredentials({
            provider: detail?.provider || '',
            subscriptionBuilderId: subscriptionBuilder?.id || '',
            credentials,
        }, {
            onSuccess: () => {
                toast_1.default.notify({
                    type: 'success',
                    message: t('modal.apiKey.verify.success', { ns: 'pluginTrigger' }),
                });
                setCurrentStep(ApiKeyStep.Configuration);
            },
            onError: async (error) => {
                const errorMessage = await (0, error_parser_1.parsePluginErrorMessage)(error) || t('modal.apiKey.verify.error', { ns: 'pluginTrigger' });
                apiKeyCredentialsFormRef.current?.setFields([{
                        name: Object.keys(credentials)[0],
                        errors: [errorMessage],
                    }]);
            },
        });
    };
    const handleCreate = () => {
        if (!subscriptionBuilder) {
            toast_1.default.notify({
                type: 'error',
                message: 'Subscription builder not found',
            });
            return;
        }
        const subscriptionFormValues = subscriptionFormRef.current?.getFormValues({});
        if (!subscriptionFormValues?.isCheckValidated)
            return;
        const subscriptionNameValue = subscriptionFormValues?.values?.subscription_name;
        const params = {
            provider: detail?.provider || '',
            subscriptionBuilderId: subscriptionBuilder.id,
            name: subscriptionNameValue,
        };
        if (createType !== types_2.SupportedCreationMethods.MANUAL) {
            if (autoCommonParametersSchema.length > 0) {
                const autoCommonParametersFormValues = autoCommonParametersFormRef.current?.getFormValues({}) || defaultFormValues;
                if (!autoCommonParametersFormValues?.isCheckValidated)
                    return;
                params.parameters = autoCommonParametersFormValues.values;
            }
        }
        else if (manualPropertiesSchema.length > 0) {
            const manualFormValues = manualPropertiesFormRef.current?.getFormValues({}) || defaultFormValues;
            if (!manualFormValues?.isCheckValidated)
                return;
        }
        buildSubscription(params, {
            onSuccess: () => {
                toast_1.default.notify({
                    type: 'success',
                    message: t('subscription.createSuccess', { ns: 'pluginTrigger' }),
                });
                onClose();
                refetch?.();
            },
            onError: async (error) => {
                const errorMessage = await (0, error_parser_1.parsePluginErrorMessage)(error) || t('subscription.createFailed', { ns: 'pluginTrigger' });
                toast_1.default.notify({
                    type: 'error',
                    message: errorMessage,
                });
            },
        });
    };
    const handleConfirm = () => {
        if (currentStep === ApiKeyStep.Verify)
            handleVerify();
        else
            handleCreate();
    };
    const handleApiKeyCredentialsChange = () => {
        apiKeyCredentialsFormRef.current?.setFields([{
                name: apiKeyCredentialsSchema[0].name,
                errors: [],
            }]);
    };
    const confirmButtonText = (0, react_2.useMemo)(() => {
        if (currentStep === ApiKeyStep.Verify)
            return isVerifyingCredentials ? t('modal.common.verifying', { ns: 'pluginTrigger' }) : t('modal.common.verify', { ns: 'pluginTrigger' });
        return isBuilding ? t('modal.common.creating', { ns: 'pluginTrigger' }) : t('modal.common.create', { ns: 'pluginTrigger' });
    }, [currentStep, isVerifyingCredentials, isBuilding, t]);
    return (<modal_1.default title={t(MODAL_TITLE_KEY_MAP[createType], { ns: 'pluginTrigger' })} confirmButtonText={confirmButtonText} onClose={onClose} onCancel={onClose} onConfirm={handleConfirm} disabled={isVerifyingCredentials || isBuilding} bottomSlot={currentStep === ApiKeyStep.Verify ? <encrypted_bottom_1.EncryptedBottom /> : null} size={createType === types_2.SupportedCreationMethods.MANUAL ? 'md' : 'sm'} containerClassName="min-h-[360px]" clickOutsideNotClose>
      {createType === types_2.SupportedCreationMethods.APIKEY && <MultiSteps currentStep={currentStep}/>}
      {currentStep === ApiKeyStep.Verify && (<>
          {apiKeyCredentialsSchema.length > 0 && (<div className="mb-4">
              <base_1.BaseForm formSchemas={apiKeyCredentialsSchema} ref={apiKeyCredentialsFormRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" preventDefaultSubmit={true} formClassName="space-y-4" onChange={handleApiKeyCredentialsChange}/>
            </div>)}
        </>)}
      {currentStep === ApiKeyStep.Configuration && (<div className="max-h-[70vh]">
          <base_1.BaseForm formSchemas={[
                {
                    name: 'subscription_name',
                    label: t('modal.form.subscriptionName.label', { ns: 'pluginTrigger' }),
                    placeholder: t('modal.form.subscriptionName.placeholder', { ns: 'pluginTrigger' }),
                    type: types_1.FormTypeEnum.textInput,
                    required: true,
                },
                {
                    name: 'callback_url',
                    label: t('modal.form.callbackUrl.label', { ns: 'pluginTrigger' }),
                    placeholder: t('modal.form.callbackUrl.placeholder', { ns: 'pluginTrigger' }),
                    type: types_1.FormTypeEnum.textInput,
                    required: false,
                    default: subscriptionBuilder?.endpoint || '',
                    disabled: true,
                    tooltip: t('modal.form.callbackUrl.tooltip', { ns: 'pluginTrigger' }),
                    showCopy: true,
                },
            ]} ref={subscriptionFormRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" formClassName="space-y-4 mb-4"/>
          {/* <div className='system-xs-regular mb-6 mt-[-1rem] text-text-tertiary'>
            {t('pluginTrigger.modal.form.callbackUrl.description')}
          </div> */}
          {createType !== types_2.SupportedCreationMethods.MANUAL && autoCommonParametersSchema.length > 0 && (<base_1.BaseForm formSchemas={autoCommonParametersSchema.map((schema) => {
                    const normalizedType = normalizeFormType(schema.type);
                    return {
                        ...schema,
                        tooltip: schema.description,
                        type: normalizedType,
                        dynamicSelectParams: normalizedType === types_1.FormTypeEnum.dynamicSelect
                            ? {
                                plugin_id: detail?.plugin_id || '',
                                provider: detail?.provider || '',
                                action: 'provider',
                                parameter: schema.name,
                                credential_id: subscriptionBuilder?.id || '',
                            }
                            : undefined,
                        fieldClassName: schema.type === types_1.FormTypeEnum.boolean ? 'flex items-center justify-between' : undefined,
                        labelClassName: schema.type === types_1.FormTypeEnum.boolean ? 'mb-0' : undefined,
                    };
                })} ref={autoCommonParametersFormRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" formClassName="space-y-4"/>)}
          {createType === types_2.SupportedCreationMethods.MANUAL && (<>
              {manualPropertiesSchema.length > 0 && (<div className="mb-6">
                  <base_1.BaseForm formSchemas={manualPropertiesSchema.map(schema => ({
                        ...schema,
                        tooltip: schema.description,
                    }))} ref={manualPropertiesFormRef} labelClassName="system-sm-medium mb-2 flex items-center gap-1 text-text-primary" formClassName="space-y-4" onChange={handleManualPropertiesChange}/>
                </div>)}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="system-xs-medium-uppercase text-text-tertiary">
                    {t('modal.manual.logs.title', { ns: 'pluginTrigger' })}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-divider-regular to-transparent"/>
                </div>

                <div className="mb-1 flex items-center justify-center gap-1 rounded-lg bg-background-section p-3">
                  <div className="h-3.5 w-3.5">
                    <react_1.RiLoader2Line className="h-full w-full animate-spin"/>
                  </div>
                  <div className="system-xs-regular text-text-tertiary">
                    {t('modal.manual.logs.loading', { ns: 'pluginTrigger', pluginName: detail?.name || '' })}
                  </div>
                </div>
                <log_viewer_1.default logs={logData?.logs || []}/>
              </div>
            </>)}
        </div>)}
    </modal_1.default>);
};
exports.CommonCreateModal = CommonCreateModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZGFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLW1vZGFsLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOzs7QUFJWiw0Q0FBZ0Q7QUFDaEQsOENBQTRDO0FBQzVDLCtCQUE4QjtBQUM5QixpQ0FBeUU7QUFDekUsaURBQThDO0FBQzlDLHdFQUF3RTtBQUN4RSw2RUFBd0U7QUFDeEUscUVBQXFFO0FBQ3JFLDREQUErRDtBQUMvRCw2REFBcUQ7QUFDckQsdURBQStDO0FBQy9DLDBEQUF5RTtBQUN6RSwwRUFBMEY7QUFDMUYseURBTStCO0FBQy9CLHVEQUE4RDtBQUM5RCx5REFBK0Q7QUFDL0QsdUNBQTRDO0FBQzVDLDhDQUFxQztBQUNyQyxvRUFBOEQ7QUFROUQsTUFBTSxtQkFBbUIsR0FBZ0U7SUFDdkYsQ0FBQyxnQ0FBd0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxpQ0FBeUIsQ0FBQyxNQUFNO0lBQ25FLENBQUMsZ0NBQXdCLENBQUMsS0FBSyxDQUFDLEVBQUUsaUNBQXlCLENBQUMsTUFBTTtJQUNsRSxDQUFDLGdDQUF3QixDQUFDLE1BQU0sQ0FBQyxFQUFFLGlDQUF5QixDQUFDLFlBQVk7Q0FDMUUsQ0FBQTtBQUVELE1BQU0sbUJBQW1CLEdBR3JCO0lBQ0YsQ0FBQyxnQ0FBd0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxvQkFBb0I7SUFDdkQsQ0FBQyxnQ0FBd0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxtQkFBbUI7SUFDckQsQ0FBQyxnQ0FBd0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxvQkFBb0I7Q0FDeEQsQ0FBQTtBQUVELElBQUssVUFHSjtBQUhELFdBQUssVUFBVTtJQUNiLCtCQUFpQixDQUFBO0lBQ2pCLDZDQUErQixDQUFBO0FBQ2pDLENBQUMsRUFISSxVQUFVLEtBQVYsVUFBVSxRQUdkO0FBRUQsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUs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a0JBQUEsRUFBRSxHQUFHLENBQ0w7a0JBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtFQUFrRSxFQUNuRjtnQkFBQSxFQUFFLEdBQUcsQ0FFTDs7Z0JBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtGQUFrRixDQUMvRjtrQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUMxQjtvQkFBQSxDQUFDLHFCQUFhLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUN2RDtrQkFBQSxFQUFFLEdBQUcsQ0FDTDtrQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQ25EO29CQUFBLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUMxRjtrQkFBQSxFQUFFLEdBQUcsQ0FDUDtnQkFBQSxFQUFFLEdBQUcsQ0FDTDtnQkFBQSxDQUFDLG9CQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsRUFDdkM7Y0FBQSxFQUFFLEdBQUcsQ0FDUDtZQUFBLEdBQUcsQ0FDSixDQUNIO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNIO0lBQUEsRUFBRSxlQUFLLENBQUMsQ0FDVCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBaFhZLFFBQUEsaUJBQWlCLHFCQWdYN0IiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRm9ybVJlZk9iamVjdCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEJ1aWxkVHJpZ2dlclN1YnNjcmlwdGlvblBheWxvYWQgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXRyaWdnZXJzJ1xuaW1wb3J0IHsgUmlMb2FkZXIyTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJ2VzLXRvb2xraXQvY29tcGF0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG4vLyBpbXBvcnQgeyBDb3B5RmVlZGJhY2tOZXcgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY29weS1mZWVkYmFjaydcbmltcG9ydCB7IEVuY3J5cHRlZEJvdHRvbSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9lbmNyeXB0ZWQtYm90dG9tJ1xuaW1wb3J0IHsgQmFzZUZvcm0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9jb21wb25lbnRzL2Jhc2UnXG5pbXBvcnQgeyBGb3JtVHlwZUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS90eXBlcydcbmltcG9ydCBNb2RhbCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbW9kYWwvbW9kYWwnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0IHsgVHJpZ2dlckNyZWRlbnRpYWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQge1xuICB1c2VCdWlsZFRyaWdnZXJTdWJzY3JpcHRpb24sXG4gIHVzZUNyZWF0ZVRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyLFxuICB1c2VUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlckxvZ3MsXG4gIHVzZVVwZGF0ZVRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyLFxuICB1c2VWZXJpZnlBbmRVcGRhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlcixcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10cmlnZ2VycydcbmltcG9ydCB7IHBhcnNlUGx1Z2luRXJyb3JNZXNzYWdlIH0gZnJvbSAnQC91dGlscy9lcnJvci1wYXJzZXInXG5pbXBvcnQgeyBpc1ByaXZhdGVPckxvY2FsQWRkcmVzcyB9IGZyb20gJ0AvdXRpbHMvdXJsVmFsaWRhdGlvbidcbmltcG9ydCB7IHVzZVBsdWdpblN0b3JlIH0gZnJvbSAnLi4vLi4vc3RvcmUnXG5pbXBvcnQgTG9nVmlld2VyIGZyb20gJy4uL2xvZy12aWV3ZXInXG5pbXBvcnQgeyB1c2VTdWJzY3JpcHRpb25MaXN0IH0gZnJvbSAnLi4vdXNlLXN1YnNjcmlwdGlvbi1saXN0J1xuXG50eXBlIFByb3BzID0ge1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkXG4gIGNyZWF0ZVR5cGU6IFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kc1xuICBidWlsZGVyPzogVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXJcbn1cblxuY29uc3QgQ1JFREVOVElBTF9UWVBFX01BUDogUmVjb3JkPFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcywgVHJpZ2dlckNyZWRlbnRpYWxUeXBlRW51bT4gPSB7XG4gIFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuQVBJS0VZXTogVHJpZ2dlckNyZWRlbnRpYWxUeXBlRW51bS5BcGlLZXksXG4gIFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEhdOiBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtLk9hdXRoMixcbiAgW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdOiBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtLlVuYXV0aG9yaXplZCxcbn1cblxuY29uc3QgTU9EQUxfVElUTEVfS0VZX01BUDogUmVjb3JkPFxuICBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMsXG4gICdtb2RhbC5hcGlLZXkudGl0bGUnIHwgJ21vZGFsLm9hdXRoLnRpdGxlJyB8ICdtb2RhbC5tYW51YWwudGl0bGUnXG4+ID0ge1xuICBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWV06ICdtb2RhbC5hcGlLZXkudGl0bGUnLFxuICBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIXTogJ21vZGFsLm9hdXRoLnRpdGxlJyxcbiAgW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdOiAnbW9kYWwubWFudWFsLnRpdGxlJyxcbn1cblxuZW51bSBBcGlLZXlTdGVwIHtcbiAgVmVyaWZ5ID0gJ3ZlcmlmeScsXG4gIENvbmZpZ3VyYXRpb24gPSAnY29uZmlndXJhdGlvbicsXG59XG5cbmNvbnN0IGRlZmF1bHRGb3JtVmFsdWVzID0geyB2YWx1ZXM6IHt9LCBpc0NoZWNrVmFsaWRhdGVkOiBmYWxzZSB9XG5cbmNvbnN0IG5vcm1hbGl6ZUZvcm1UeXBlID0gKHR5cGU6IEZvcm1UeXBlRW51bSB8IHN0cmluZyk6IEZvcm1UeXBlRW51bSA9PiB7XG4gIGlmIChPYmplY3QudmFsdWVzKEZvcm1UeXBlRW51bSkuaW5jbHVkZXModHlwZSBhcyBGb3JtVHlwZUVudW0pKVxuICAgIHJldHVybiB0eXBlIGFzIEZvcm1UeXBlRW51bVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgICByZXR1cm4gRm9ybVR5cGVFbnVtLnRleHRJbnB1dFxuICAgIGNhc2UgJ3Bhc3N3b3JkJzpcbiAgICBjYXNlICdzZWNyZXQnOlxuICAgICAgcmV0dXJuIEZvcm1UeXBlRW51bS5zZWNyZXRJbnB1dFxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICByZXR1cm4gRm9ybVR5cGVFbnVtLnRleHROdW1iZXJcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiBGb3JtVHlwZUVudW0uYm9vbGVhblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gRm9ybVR5cGVFbnVtLnRleHRJbnB1dFxuICB9XG59XG5cbmNvbnN0IFN0YXR1c1N0ZXAgPSAoeyBpc0FjdGl2ZSwgdGV4dCB9OiB7IGlzQWN0aXZlOiBib29sZWFuLCB0ZXh0OiBzdHJpbmcgfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtgc3lzdGVtLTJ4cy1zZW1pYm9sZC11cHBlcmNhc2UgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgJHtpc0FjdGl2ZVxuICAgICAgPyAndGV4dC1zdGF0ZS1hY2NlbnQtc29saWQnXG4gICAgICA6ICd0ZXh0LXRleHQtdGVydGlhcnknfWB9XG4gICAgPlxuICAgICAgey8qIEFjdGl2ZSBpbmRpY2F0b3IgZG90ICovfVxuICAgICAge2lzQWN0aXZlICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTEgdy0xIHJvdW5kZWQtZnVsbCBiZy1zdGF0ZS1hY2NlbnQtc29saWRcIj48L2Rpdj5cbiAgICAgICl9XG4gICAgICB7dGV4dH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBNdWx0aVN0ZXBzID0gKHsgY3VycmVudFN0ZXAgfTogeyBjdXJyZW50U3RlcDogQXBpS2V5U3RlcCB9KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNiBmbGV4IHctMS8zIGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgPFN0YXR1c1N0ZXAgaXNBY3RpdmU9e2N1cnJlbnRTdGVwID09PSBBcGlLZXlTdGVwLlZlcmlmeX0gdGV4dD17dCgnbW9kYWwuc3RlcHMudmVyaWZ5JywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pfSAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLXB4IHctMyBzaHJpbmstMCBiZy1kaXZpZGVyLWRlZXBcIj48L2Rpdj5cbiAgICAgIDxTdGF0dXNTdGVwIGlzQWN0aXZlPXtjdXJyZW50U3RlcCA9PT0gQXBpS2V5U3RlcC5Db25maWd1cmF0aW9ufSB0ZXh0PXt0KCdtb2RhbC5zdGVwcy5jb25maWd1cmF0aW9uJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pfSAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBDb21tb25DcmVhdGVNb2RhbCA9ICh7IG9uQ2xvc2UsIGNyZWF0ZVR5cGUsIGJ1aWxkZXIgfTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGRldGFpbCA9IHVzZVBsdWdpblN0b3JlKHN0YXRlID0+IHN0YXRlLmRldGFpbClcbiAgY29uc3QgeyByZWZldGNoIH0gPSB1c2VTdWJzY3JpcHRpb25MaXN0KClcblxuICBjb25zdCBbY3VycmVudFN0ZXAsIHNldEN1cnJlbnRTdGVwXSA9IHVzZVN0YXRlPEFwaUtleVN0ZXA+KGNyZWF0ZVR5cGUgPT09IFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5BUElLRVkgPyBBcGlLZXlTdGVwLlZlcmlmeSA6IEFwaUtleVN0ZXAuQ29uZmlndXJhdGlvbilcblxuICBjb25zdCBbc3Vic2NyaXB0aW9uQnVpbGRlciwgc2V0U3Vic2NyaXB0aW9uQnVpbGRlcl0gPSB1c2VTdGF0ZTxUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlciB8IHVuZGVmaW5lZD4oYnVpbGRlcilcbiAgY29uc3QgaXNJbml0aWFsaXplZFJlZiA9IHVzZVJlZihmYWxzZSlcblxuICBjb25zdCB7IG11dGF0ZTogdmVyaWZ5Q3JlZGVudGlhbHMsIGlzUGVuZGluZzogaXNWZXJpZnlpbmdDcmVkZW50aWFscyB9ID0gdXNlVmVyaWZ5QW5kVXBkYXRlVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXIoKVxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBjcmVhdGVCdWlsZGVyIC8qIGlzUGVuZGluZzogaXNDcmVhdGluZ0J1aWxkZXIgKi8gfSA9IHVzZUNyZWF0ZVRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgY29uc3QgeyBtdXRhdGU6IGJ1aWxkU3Vic2NyaXB0aW9uLCBpc1BlbmRpbmc6IGlzQnVpbGRpbmcgfSA9IHVzZUJ1aWxkVHJpZ2dlclN1YnNjcmlwdGlvbigpXG4gIGNvbnN0IHsgbXV0YXRlOiB1cGRhdGVCdWlsZGVyIH0gPSB1c2VVcGRhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlcigpXG5cbiAgY29uc3QgbWFudWFsUHJvcGVydGllc1NjaGVtYSA9IGRldGFpbD8uZGVjbGFyYXRpb24/LnRyaWdnZXI/LnN1YnNjcmlwdGlvbl9zY2hlbWEgfHwgW10gLy8gbWFudWFsXG4gIGNvbnN0IG1hbnVhbFByb3BlcnRpZXNGb3JtUmVmID0gUmVhY3QudXNlUmVmPEZvcm1SZWZPYmplY3Q+KG51bGwpXG5cbiAgY29uc3Qgc3Vic2NyaXB0aW9uRm9ybVJlZiA9IFJlYWN0LnVzZVJlZjxGb3JtUmVmT2JqZWN0PihudWxsKVxuXG4gIGNvbnN0IGF1dG9Db21tb25QYXJhbWV0ZXJzU2NoZW1hID0gZGV0YWlsPy5kZWNsYXJhdGlvbi50cmlnZ2VyPy5zdWJzY3JpcHRpb25fY29uc3RydWN0b3I/LnBhcmFtZXRlcnMgfHwgW10gLy8gYXBpa2V5IGFuZCBvYXV0aFxuICBjb25zdCBhdXRvQ29tbW9uUGFyYW1ldGVyc0Zvcm1SZWYgPSBSZWFjdC51c2VSZWY8Rm9ybVJlZk9iamVjdD4obnVsbClcblxuICBjb25zdCBhcGlLZXlDcmVkZW50aWFsc1NjaGVtYSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHJhd1NjaGVtYSA9IGRldGFpbD8uZGVjbGFyYXRpb24/LnRyaWdnZXI/LnN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcj8uY3JlZGVudGlhbHNfc2NoZW1hIHx8IFtdXG4gICAgcmV0dXJuIHJhd1NjaGVtYS5tYXAoc2NoZW1hID0+ICh7XG4gICAgICAuLi5zY2hlbWEsXG4gICAgICB0b29sdGlwOiBzY2hlbWEuaGVscCxcbiAgICB9KSlcbiAgfSwgW2RldGFpbD8uZGVjbGFyYXRpb24/LnRyaWdnZXI/LnN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcj8uY3JlZGVudGlhbHNfc2NoZW1hXSlcbiAgY29uc3QgYXBpS2V5Q3JlZGVudGlhbHNGb3JtUmVmID0gUmVhY3QudXNlUmVmPEZvcm1SZWZPYmplY3Q+KG51bGwpXG5cbiAgY29uc3QgeyBkYXRhOiBsb2dEYXRhIH0gPSB1c2VUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlckxvZ3MoXG4gICAgZGV0YWlsPy5wcm92aWRlciB8fCAnJyxcbiAgICBzdWJzY3JpcHRpb25CdWlsZGVyPy5pZCB8fCAnJyxcbiAgICB7XG4gICAgICBlbmFibGVkOiBjcmVhdGVUeXBlID09PSBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMLFxuICAgICAgcmVmZXRjaEludGVydmFsOiAzMDAwLFxuICAgIH0sXG4gIClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGluaXRpYWxpemVCdWlsZGVyID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaXNJbml0aWFsaXplZFJlZi5jdXJyZW50ID0gdHJ1ZVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjcmVhdGVCdWlsZGVyKHtcbiAgICAgICAgICBwcm92aWRlcjogZGV0YWlsPy5wcm92aWRlciB8fCAnJyxcbiAgICAgICAgICBjcmVkZW50aWFsX3R5cGU6IENSRURFTlRJQUxfVFlQRV9NQVBbY3JlYXRlVHlwZV0sXG4gICAgICAgIH0pXG4gICAgICAgIHNldFN1YnNjcmlwdGlvbkJ1aWxkZXIocmVzcG9uc2Uuc3Vic2NyaXB0aW9uX2J1aWxkZXIpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignY3JlYXRlQnVpbGRlciBlcnJvcjonLCBlcnJvcilcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IHQoJ21vZGFsLmVycm9ycy5jcmVhdGVGYWlsZWQnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIGlmICghaXNJbml0aWFsaXplZFJlZi5jdXJyZW50ICYmICFzdWJzY3JpcHRpb25CdWlsZGVyICYmIGRldGFpbD8ucHJvdmlkZXIpXG4gICAgICBpbml0aWFsaXplQnVpbGRlcigpXG4gIH0sIFtzdWJzY3JpcHRpb25CdWlsZGVyLCBkZXRhaWw/LnByb3ZpZGVyLCBjcmVhdGVUeXBlLCBjcmVhdGVCdWlsZGVyLCB0XSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzdWJzY3JpcHRpb25CdWlsZGVyPy5lbmRwb2ludCAmJiBzdWJzY3JpcHRpb25Gb3JtUmVmLmN1cnJlbnQgJiYgY3VycmVudFN0ZXAgPT09IEFwaUtleVN0ZXAuQ29uZmlndXJhdGlvbikge1xuICAgICAgY29uc3QgZm9ybSA9IHN1YnNjcmlwdGlvbkZvcm1SZWYuY3VycmVudC5nZXRGb3JtKClcbiAgICAgIGlmIChmb3JtKVxuICAgICAgICBmb3JtLnNldEZpZWxkVmFsdWUoJ2NhbGxiYWNrX3VybCcsIHN1YnNjcmlwdGlvbkJ1aWxkZXIuZW5kcG9pbnQpXG4gICAgICBpZiAoaXNQcml2YXRlT3JMb2NhbEFkZHJlc3Moc3Vic2NyaXB0aW9uQnVpbGRlci5lbmRwb2ludCkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdjYWxsYmFja191cmwgaXMgcHJpdmF0ZSBvciBsb2NhbCBhZGRyZXNzJywgc3Vic2NyaXB0aW9uQnVpbGRlci5lbmRwb2ludClcbiAgICAgICAgc3Vic2NyaXB0aW9uRm9ybVJlZi5jdXJyZW50Py5zZXRGaWVsZHMoW3tcbiAgICAgICAgICBuYW1lOiAnY2FsbGJhY2tfdXJsJyxcbiAgICAgICAgICB3YXJuaW5nczogW3QoJ21vZGFsLmZvcm0uY2FsbGJhY2tVcmwucHJpdmF0ZUFkZHJlc3NXYXJuaW5nJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pXSxcbiAgICAgICAgfV0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3Vic2NyaXB0aW9uRm9ybVJlZi5jdXJyZW50Py5zZXRGaWVsZHMoW3tcbiAgICAgICAgICBuYW1lOiAnY2FsbGJhY2tfdXJsJyxcbiAgICAgICAgICB3YXJuaW5nczogW10sXG4gICAgICAgIH1dKVxuICAgICAgfVxuICAgIH1cbiAgfSwgW3N1YnNjcmlwdGlvbkJ1aWxkZXI/LmVuZHBvaW50LCBjdXJyZW50U3RlcCwgdF0pXG5cbiAgY29uc3QgZGVib3VuY2VkVXBkYXRlID0gdXNlTWVtbyhcbiAgICAoKSA9PiBkZWJvdW5jZSgocHJvdmlkZXI6IHN0cmluZywgYnVpbGRlcklkOiBzdHJpbmcsIHByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICB1cGRhdGVCdWlsZGVyKFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZXIsXG4gICAgICAgICAgc3Vic2NyaXB0aW9uQnVpbGRlcklkOiBidWlsZGVySWQsXG4gICAgICAgICAgcHJvcGVydGllcyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9uRXJyb3I6IGFzeW5jIChlcnJvcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYXdhaXQgcGFyc2VQbHVnaW5FcnJvck1lc3NhZ2UoZXJyb3IpIHx8IHQoJ21vZGFsLmVycm9ycy51cGRhdGVGYWlsZWQnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSlcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byB1cGRhdGUgc3Vic2NyaXB0aW9uIGJ1aWxkZXI6JywgZXJyb3IpXG4gICAgICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApXG4gICAgfSwgNTAwKSxcbiAgICBbdXBkYXRlQnVpbGRlciwgdF0sXG4gIClcblxuICBjb25zdCBoYW5kbGVNYW51YWxQcm9wZXJ0aWVzQ2hhbmdlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICghc3Vic2NyaXB0aW9uQnVpbGRlciB8fCAhZGV0YWlsPy5wcm92aWRlcilcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgZm9ybVZhbHVlcyA9IG1hbnVhbFByb3BlcnRpZXNGb3JtUmVmLmN1cnJlbnQ/LmdldEZvcm1WYWx1ZXMoeyBuZWVkQ2hlY2tWYWxpZGF0ZWRWYWx1ZXM6IGZhbHNlIH0pIHx8IHsgdmFsdWVzOiB7fSwgaXNDaGVja1ZhbGlkYXRlZDogdHJ1ZSB9XG5cbiAgICBkZWJvdW5jZWRVcGRhdGUoZGV0YWlsLnByb3ZpZGVyLCBzdWJzY3JpcHRpb25CdWlsZGVyLmlkLCBmb3JtVmFsdWVzLnZhbHVlcylcbiAgfSwgW3N1YnNjcmlwdGlvbkJ1aWxkZXIsIGRldGFpbD8ucHJvdmlkZXIsIGRlYm91bmNlZFVwZGF0ZV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZGVib3VuY2VkVXBkYXRlLmNhbmNlbCgpXG4gICAgfVxuICB9LCBbZGVib3VuY2VkVXBkYXRlXSlcblxuICBjb25zdCBoYW5kbGVWZXJpZnkgPSAoKSA9PiB7XG4gICAgY29uc3QgYXBpS2V5Q3JlZGVudGlhbHNGb3JtVmFsdWVzID0gYXBpS2V5Q3JlZGVudGlhbHNGb3JtUmVmLmN1cnJlbnQ/LmdldEZvcm1WYWx1ZXMoe30pIHx8IGRlZmF1bHRGb3JtVmFsdWVzXG4gICAgY29uc3QgY3JlZGVudGlhbHMgPSBhcGlLZXlDcmVkZW50aWFsc0Zvcm1WYWx1ZXMudmFsdWVzXG5cbiAgICBpZiAoIU9iamVjdC5rZXlzKGNyZWRlbnRpYWxzKS5sZW5ndGgpIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdQbGVhc2UgZmlsbCBpbiBhbGwgcmVxdWlyZWQgY3JlZGVudGlhbHMnLFxuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGFwaUtleUNyZWRlbnRpYWxzRm9ybVJlZi5jdXJyZW50Py5zZXRGaWVsZHMoW3tcbiAgICAgIG5hbWU6IE9iamVjdC5rZXlzKGNyZWRlbnRpYWxzKVswXSxcbiAgICAgIGVycm9yczogW10sXG4gICAgfV0pXG5cbiAgICB2ZXJpZnlDcmVkZW50aWFscyhcbiAgICAgIHtcbiAgICAgICAgcHJvdmlkZXI6IGRldGFpbD8ucHJvdmlkZXIgfHwgJycsXG4gICAgICAgIHN1YnNjcmlwdGlvbkJ1aWxkZXJJZDogc3Vic2NyaXB0aW9uQnVpbGRlcj8uaWQgfHwgJycsXG4gICAgICAgIGNyZWRlbnRpYWxzLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb25TdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHQoJ21vZGFsLmFwaUtleS52ZXJpZnkuc3VjY2VzcycsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHNldEN1cnJlbnRTdGVwKEFwaUtleVN0ZXAuQ29uZmlndXJhdGlvbilcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcjogYXN5bmMgKGVycm9yOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYXdhaXQgcGFyc2VQbHVnaW5FcnJvck1lc3NhZ2UoZXJyb3IpIHx8IHQoJ21vZGFsLmFwaUtleS52ZXJpZnkuZXJyb3InLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSlcbiAgICAgICAgICBhcGlLZXlDcmVkZW50aWFsc0Zvcm1SZWYuY3VycmVudD8uc2V0RmllbGRzKFt7XG4gICAgICAgICAgICBuYW1lOiBPYmplY3Qua2V5cyhjcmVkZW50aWFscylbMF0sXG4gICAgICAgICAgICBlcnJvcnM6IFtlcnJvck1lc3NhZ2VdLFxuICAgICAgICAgIH1dKVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApXG4gIH1cblxuICBjb25zdCBoYW5kbGVDcmVhdGUgPSAoKSA9PiB7XG4gICAgaWYgKCFzdWJzY3JpcHRpb25CdWlsZGVyKSB7XG4gICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnU3Vic2NyaXB0aW9uIGJ1aWxkZXIgbm90IGZvdW5kJyxcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb25Gb3JtVmFsdWVzID0gc3Vic2NyaXB0aW9uRm9ybVJlZi5jdXJyZW50Py5nZXRGb3JtVmFsdWVzKHt9KVxuICAgIGlmICghc3Vic2NyaXB0aW9uRm9ybVZhbHVlcz8uaXNDaGVja1ZhbGlkYXRlZClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uTmFtZVZhbHVlID0gc3Vic2NyaXB0aW9uRm9ybVZhbHVlcz8udmFsdWVzPy5zdWJzY3JpcHRpb25fbmFtZSBhcyBzdHJpbmdcblxuICAgIGNvbnN0IHBhcmFtczogQnVpbGRUcmlnZ2VyU3Vic2NyaXB0aW9uUGF5bG9hZCA9IHtcbiAgICAgIHByb3ZpZGVyOiBkZXRhaWw/LnByb3ZpZGVyIHx8ICcnLFxuICAgICAgc3Vic2NyaXB0aW9uQnVpbGRlcklkOiBzdWJzY3JpcHRpb25CdWlsZGVyLmlkLFxuICAgICAgbmFtZTogc3Vic2NyaXB0aW9uTmFtZVZhbHVlLFxuICAgIH1cblxuICAgIGlmIChjcmVhdGVUeXBlICE9PSBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMKSB7XG4gICAgICBpZiAoYXV0b0NvbW1vblBhcmFtZXRlcnNTY2hlbWEubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBhdXRvQ29tbW9uUGFyYW1ldGVyc0Zvcm1WYWx1ZXMgPSBhdXRvQ29tbW9uUGFyYW1ldGVyc0Zvcm1SZWYuY3VycmVudD8uZ2V0Rm9ybVZhbHVlcyh7fSkgfHwgZGVmYXVsdEZvcm1WYWx1ZXNcbiAgICAgICAgaWYgKCFhdXRvQ29tbW9uUGFyYW1ldGVyc0Zvcm1WYWx1ZXM/LmlzQ2hlY2tWYWxpZGF0ZWQpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIHBhcmFtcy5wYXJhbWV0ZXJzID0gYXV0b0NvbW1vblBhcmFtZXRlcnNGb3JtVmFsdWVzLnZhbHVlc1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChtYW51YWxQcm9wZXJ0aWVzU2NoZW1hLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG1hbnVhbEZvcm1WYWx1ZXMgPSBtYW51YWxQcm9wZXJ0aWVzRm9ybVJlZi5jdXJyZW50Py5nZXRGb3JtVmFsdWVzKHt9KSB8fCBkZWZhdWx0Rm9ybVZhbHVlc1xuICAgICAgaWYgKCFtYW51YWxGb3JtVmFsdWVzPy5pc0NoZWNrVmFsaWRhdGVkKVxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBidWlsZFN1YnNjcmlwdGlvbihcbiAgICAgIHBhcmFtcyxcbiAgICAgIHtcbiAgICAgICAgb25TdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHQoJ3N1YnNjcmlwdGlvbi5jcmVhdGVTdWNjZXNzJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgb25DbG9zZSgpXG4gICAgICAgICAgcmVmZXRjaD8uKClcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcjogYXN5bmMgKGVycm9yOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYXdhaXQgcGFyc2VQbHVnaW5FcnJvck1lc3NhZ2UoZXJyb3IpIHx8IHQoJ3N1YnNjcmlwdGlvbi5jcmVhdGVGYWlsZWQnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSlcbiAgICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApXG4gIH1cblxuICBjb25zdCBoYW5kbGVDb25maXJtID0gKCkgPT4ge1xuICAgIGlmIChjdXJyZW50U3RlcCA9PT0gQXBpS2V5U3RlcC5WZXJpZnkpXG4gICAgICBoYW5kbGVWZXJpZnkoKVxuICAgIGVsc2VcbiAgICAgIGhhbmRsZUNyZWF0ZSgpXG4gIH1cblxuICBjb25zdCBoYW5kbGVBcGlLZXlDcmVkZW50aWFsc0NoYW5nZSA9ICgpID0+IHtcbiAgICBhcGlLZXlDcmVkZW50aWFsc0Zvcm1SZWYuY3VycmVudD8uc2V0RmllbGRzKFt7XG4gICAgICBuYW1lOiBhcGlLZXlDcmVkZW50aWFsc1NjaGVtYVswXS5uYW1lLFxuICAgICAgZXJyb3JzOiBbXSxcbiAgICB9XSlcbiAgfVxuXG4gIGNvbnN0IGNvbmZpcm1CdXR0b25UZXh0ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGN1cnJlbnRTdGVwID09PSBBcGlLZXlTdGVwLlZlcmlmeSlcbiAgICAgIHJldHVybiBpc1ZlcmlmeWluZ0NyZWRlbnRpYWxzID8gdCgnbW9kYWwuY29tbW9uLnZlcmlmeWluZycsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSA6IHQoJ21vZGFsLmNvbW1vbi52ZXJpZnknLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSlcblxuICAgIHJldHVybiBpc0J1aWxkaW5nID8gdCgnbW9kYWwuY29tbW9uLmNyZWF0aW5nJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pIDogdCgnbW9kYWwuY29tbW9uLmNyZWF0ZScsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KVxuICB9LCBbY3VycmVudFN0ZXAsIGlzVmVyaWZ5aW5nQ3JlZGVudGlhbHMsIGlzQnVpbGRpbmcsIHRdKVxuXG4gIHJldHVybiAoXG4gICAgPE1vZGFsXG4gICAgICB0aXRsZT17dChNT0RBTF9USVRMRV9LRVlfTUFQW2NyZWF0ZVR5cGVdLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSl9XG4gICAgICBjb25maXJtQnV0dG9uVGV4dD17Y29uZmlybUJ1dHRvblRleHR9XG4gICAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICAgICAgb25DYW5jZWw9e29uQ2xvc2V9XG4gICAgICBvbkNvbmZpcm09e2hhbmRsZUNvbmZpcm19XG4gICAgICBkaXNhYmxlZD17aXNWZXJpZnlpbmdDcmVkZW50aWFscyB8fCBpc0J1aWxkaW5nfVxuICAgICAgYm90dG9tU2xvdD17Y3VycmVudFN0ZXAgPT09IEFwaUtleVN0ZXAuVmVyaWZ5ID8gPEVuY3J5cHRlZEJvdHRvbSAvPiA6IG51bGx9XG4gICAgICBzaXplPXtjcmVhdGVUeXBlID09PSBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMID8gJ21kJyA6ICdzbSd9XG4gICAgICBjb250YWluZXJDbGFzc05hbWU9XCJtaW4taC1bMzYwcHhdXCJcbiAgICAgIGNsaWNrT3V0c2lkZU5vdENsb3NlXG4gICAgPlxuICAgICAge2NyZWF0ZVR5cGUgPT09IFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5BUElLRVkgJiYgPE11bHRpU3RlcHMgY3VycmVudFN0ZXA9e2N1cnJlbnRTdGVwfSAvPn1cbiAgICAgIHtjdXJyZW50U3RlcCA9PT0gQXBpS2V5U3RlcC5WZXJpZnkgJiYgKFxuICAgICAgICA8PlxuICAgICAgICAgIHthcGlLZXlDcmVkZW50aWFsc1NjaGVtYS5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNFwiPlxuICAgICAgICAgICAgICA8QmFzZUZvcm1cbiAgICAgICAgICAgICAgICBmb3JtU2NoZW1hcz17YXBpS2V5Q3JlZGVudGlhbHNTY2hlbWF9XG4gICAgICAgICAgICAgICAgcmVmPXthcGlLZXlDcmVkZW50aWFsc0Zvcm1SZWZ9XG4gICAgICAgICAgICAgICAgbGFiZWxDbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIG1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgdGV4dC10ZXh0LXByaW1hcnlcIlxuICAgICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0U3VibWl0PXt0cnVlfVxuICAgICAgICAgICAgICAgIGZvcm1DbGFzc05hbWU9XCJzcGFjZS15LTRcIlxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVBcGlLZXlDcmVkZW50aWFsc0NoYW5nZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvPlxuICAgICAgKX1cbiAgICAgIHtjdXJyZW50U3RlcCA9PT0gQXBpS2V5U3RlcC5Db25maWd1cmF0aW9uICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtaC1bNzB2aF1cIj5cbiAgICAgICAgICA8QmFzZUZvcm1cbiAgICAgICAgICAgIGZvcm1TY2hlbWFzPXtbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc3Vic2NyaXB0aW9uX25hbWUnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB0KCdtb2RhbC5mb3JtLnN1YnNjcmlwdGlvbk5hbWUubGFiZWwnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHQoJ21vZGFsLmZvcm0uc3Vic2NyaXB0aW9uTmFtZS5wbGFjZWhvbGRlcicsIHsgbnM6ICdwbHVnaW5UcmlnZ2VyJyB9KSxcbiAgICAgICAgICAgICAgICB0eXBlOiBGb3JtVHlwZUVudW0udGV4dElucHV0LFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NhbGxiYWNrX3VybCcsXG4gICAgICAgICAgICAgICAgbGFiZWw6IHQoJ21vZGFsLmZvcm0uY2FsbGJhY2tVcmwubGFiZWwnLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHQoJ21vZGFsLmZvcm0uY2FsbGJhY2tVcmwucGxhY2Vob2xkZXInLCB7IG5zOiAncGx1Z2luVHJpZ2dlcicgfSksXG4gICAgICAgICAgICAgICAgdHlwZTogRm9ybVR5cGVFbnVtLnRleHRJbnB1dCxcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogc3Vic2NyaXB0aW9uQnVpbGRlcj8uZW5kcG9pbnQgfHwgJycsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogdCgnbW9kYWwuZm9ybS5jYWxsYmFja1VybC50b29sdGlwJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pLFxuICAgICAgICAgICAgICAgIHNob3dDb3B5OiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAgIHJlZj17c3Vic2NyaXB0aW9uRm9ybVJlZn1cbiAgICAgICAgICAgIGxhYmVsQ2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBtYi0yIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRleHQtdGV4dC1wcmltYXJ5XCJcbiAgICAgICAgICAgIGZvcm1DbGFzc05hbWU9XCJzcGFjZS15LTQgbWItNFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICB7LyogPGRpdiBjbGFzc05hbWU9J3N5c3RlbS14cy1yZWd1bGFyIG1iLTYgbXQtWy0xcmVtXSB0ZXh0LXRleHQtdGVydGlhcnknPlxuICAgICAgICAgIHt0KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLmZvcm0uY2FsbGJhY2tVcmwuZGVzY3JpcHRpb24nKX1cbiAgICAgICAgPC9kaXY+ICovfVxuICAgICAgICAgIHtjcmVhdGVUeXBlICE9PSBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMICYmIGF1dG9Db21tb25QYXJhbWV0ZXJzU2NoZW1hLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPEJhc2VGb3JtXG4gICAgICAgICAgICAgIGZvcm1TY2hlbWFzPXthdXRvQ29tbW9uUGFyYW1ldGVyc1NjaGVtYS5tYXAoKHNjaGVtYSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRUeXBlID0gbm9ybWFsaXplRm9ybVR5cGUoc2NoZW1hLnR5cGUgYXMgRm9ybVR5cGVFbnVtIHwgc3RyaW5nKVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAuLi5zY2hlbWEsXG4gICAgICAgICAgICAgICAgICB0b29sdGlwOiBzY2hlbWEuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICB0eXBlOiBub3JtYWxpemVkVHlwZSxcbiAgICAgICAgICAgICAgICAgIGR5bmFtaWNTZWxlY3RQYXJhbXM6IG5vcm1hbGl6ZWRUeXBlID09PSBGb3JtVHlwZUVudW0uZHluYW1pY1NlbGVjdFxuICAgICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbl9pZDogZGV0YWlsPy5wbHVnaW5faWQgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcjogZGV0YWlsPy5wcm92aWRlciB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3Byb3ZpZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcjogc2NoZW1hLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFsX2lkOiBzdWJzY3JpcHRpb25CdWlsZGVyPy5pZCB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgZmllbGRDbGFzc05hbWU6IHNjaGVtYS50eXBlID09PSBGb3JtVHlwZUVudW0uYm9vbGVhbiA/ICdmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4nIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgbGFiZWxDbGFzc05hbWU6IHNjaGVtYS50eXBlID09PSBGb3JtVHlwZUVudW0uYm9vbGVhbiA/ICdtYi0wJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICByZWY9e2F1dG9Db21tb25QYXJhbWV0ZXJzRm9ybVJlZn1cbiAgICAgICAgICAgICAgbGFiZWxDbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIG1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgdGV4dC10ZXh0LXByaW1hcnlcIlxuICAgICAgICAgICAgICBmb3JtQ2xhc3NOYW1lPVwic3BhY2UteS00XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7Y3JlYXRlVHlwZSA9PT0gU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTCAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICB7bWFudWFsUHJvcGVydGllc1NjaGVtYS5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTZcIj5cbiAgICAgICAgICAgICAgICAgIDxCYXNlRm9ybVxuICAgICAgICAgICAgICAgICAgICBmb3JtU2NoZW1hcz17bWFudWFsUHJvcGVydGllc1NjaGVtYS5tYXAoc2NoZW1hID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uc2NoZW1hLFxuICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6IHNjaGVtYS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgfSkpfVxuICAgICAgICAgICAgICAgICAgICByZWY9e21hbnVhbFByb3BlcnRpZXNGb3JtUmVmfVxuICAgICAgICAgICAgICAgICAgICBsYWJlbENsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gbWItMiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXRleHQtcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgIGZvcm1DbGFzc05hbWU9XCJzcGFjZS15LTRcIlxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlTWFudWFsUHJvcGVydGllc0NoYW5nZX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtbWVkaXVtLXVwcGVyY2FzZSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAge3QoJ21vZGFsLm1hbnVhbC5sb2dzLnRpdGxlJywgeyBuczogJ3BsdWdpblRyaWdnZXInIH0pfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtcHggZmxleC0xIGJnLWdyYWRpZW50LXRvLXIgZnJvbS1kaXZpZGVyLXJlZ3VsYXIgdG8tdHJhbnNwYXJlbnRcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0xIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0xIHJvdW5kZWQtbGcgYmctYmFja2dyb3VuZC1zZWN0aW9uIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTMuNSB3LTMuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8UmlMb2FkZXIyTGluZSBjbGFzc05hbWU9XCJoLWZ1bGwgdy1mdWxsIGFuaW1hdGUtc3BpblwiIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgIHt0KCdtb2RhbC5tYW51YWwubG9ncy5sb2FkaW5nJywgeyBuczogJ3BsdWdpblRyaWdnZXInLCBwbHVnaW5OYW1lOiBkZXRhaWw/Lm5hbWUgfHwgJycgfSl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8TG9nVmlld2VyIGxvZ3M9e2xvZ0RhdGE/LmxvZ3MgfHwgW119IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvTW9kYWw+XG4gIClcbn1cbiJdfQ==