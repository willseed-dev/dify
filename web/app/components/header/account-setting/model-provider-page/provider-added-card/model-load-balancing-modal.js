"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const confirm_1 = require("@/app/components/base/confirm");
const loading_1 = require("@/app/components/base/loading");
const modal_1 = require("@/app/components/base/modal");
const toast_1 = require("@/app/components/base/toast");
const model_auth_1 = require("@/app/components/header/account-setting/model-provider-page/model-auth");
const use_models_1 = require("@/service/use-models");
const classnames_1 = require("@/utils/classnames");
const declarations_1 = require("../declarations");
const hooks_1 = require("../hooks");
const use_auth_1 = require("../model-auth/hooks/use-auth");
const model_icon_1 = require("../model-icon");
const model_name_1 = require("../model-name");
const model_load_balancing_configs_1 = require("./model-load-balancing-configs");
// model balancing config modal
const ModelLoadBalancingModal = ({ provider, configurateMethod, currentCustomConfigurationModelFixedFields, model, credential, open = false, onClose, onSave, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, toast_1.useToastContext)();
    const { doingAction, deleteModel, openConfirmDelete, closeConfirmDelete, handleConfirmDelete, } = (0, use_auth_1.useAuth)(provider, configurateMethod, currentCustomConfigurationModelFixedFields, {
        isModelCredential: true,
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const providerFormSchemaPredefined = configurateMethod === declarations_1.ConfigurationMethodEnum.predefinedModel;
    const configFrom = providerFormSchemaPredefined ? 'predefined-model' : 'custom-model';
    const { isLoading, data, refetch, } = (0, use_models_1.useGetModelCredential)(true, provider.provider, credential?.credential_id, model.model, model.model_type, configFrom);
    const modelCredential = data;
    const { load_balancing, current_credential_id, available_credentials, current_credential_name, } = modelCredential ?? {};
    const originalConfig = load_balancing;
    const [draftConfig, setDraftConfig] = (0, react_1.useState)();
    const originalConfigMap = (0, react_1.useMemo)(() => {
        if (!originalConfig)
            return {};
        return originalConfig?.configs.reduce((prev, config) => {
            if (config.id)
                prev[config.id] = config;
            return prev;
        }, {});
    }, [originalConfig]);
    (0, react_1.useEffect)(() => {
        if (originalConfig)
            setDraftConfig(originalConfig);
    }, [originalConfig]);
    const toggleModalBalancing = (0, react_1.useCallback)((enabled) => {
        if (draftConfig) {
            setDraftConfig({
                ...draftConfig,
                enabled,
            });
        }
    }, [draftConfig]);
    const extendedSecretFormSchemas = (0, react_1.useMemo)(() => {
        if (providerFormSchemaPredefined) {
            return provider?.provider_credential_schema?.credential_form_schemas?.filter(({ type }) => type === declarations_1.FormTypeEnum.secretInput) ?? [];
        }
        return provider?.model_credential_schema?.credential_form_schemas?.filter(({ type }) => type === declarations_1.FormTypeEnum.secretInput) ?? [];
    }, [provider?.model_credential_schema?.credential_form_schemas, provider?.provider_credential_schema?.credential_form_schemas, providerFormSchemaPredefined]);
    const encodeConfigEntrySecretValues = (0, react_1.useCallback)((entry) => {
        const result = { ...entry };
        extendedSecretFormSchemas.forEach(({ variable }) => {
            if (entry.id && result.credentials[variable] === originalConfigMap[entry.id]?.credentials?.[variable])
                result.credentials[variable] = '[__HIDDEN__]';
        });
        return result;
    }, [extendedSecretFormSchemas, originalConfigMap]);
    const { mutateAsync: updateModelLoadBalancingConfig } = (0, use_models_1.useUpdateModelLoadBalancingConfig)(provider.provider);
    const initialCustomModelCredential = (0, react_1.useMemo)(() => {
        if (!current_credential_id)
            return undefined;
        return {
            credential_id: current_credential_id,
            credential_name: current_credential_name,
        };
    }, [current_credential_id, current_credential_name]);
    const [customModelCredential, setCustomModelCredential] = (0, react_1.useState)(initialCustomModelCredential);
    const { handleRefreshModel } = (0, hooks_1.useRefreshModel)();
    const handleSave = async () => {
        try {
            setLoading(true);
            const res = await updateModelLoadBalancingConfig({
                credential_id: customModelCredential?.credential_id || current_credential_id,
                config_from: configFrom,
                model: model.model,
                model_type: model.model_type,
                load_balancing: {
                    ...draftConfig,
                    configs: draftConfig.configs.map(encodeConfigEntrySecretValues),
                    enabled: Boolean(draftConfig?.enabled),
                },
            });
            if (res.result === 'success') {
                notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
                handleRefreshModel(provider, currentCustomConfigurationModelFixedFields, false);
                onSave?.(provider.provider);
                onClose?.();
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteModel = (0, react_1.useCallback)(async () => {
        await handleConfirmDelete();
        onClose?.();
    }, [handleConfirmDelete, onClose]);
    const handleUpdate = (0, react_1.useCallback)(async (payload, formValues) => {
        const result = await refetch();
        const available_credentials = result.data?.available_credentials || [];
        const credentialName = formValues?.__authorization_name__;
        const modelCredential = payload?.credential;
        if (!available_credentials.length) {
            onClose?.();
            return;
        }
        if (!modelCredential) {
            const currentCredential = available_credentials.find(c => c.credential_name === credentialName);
            if (currentCredential) {
                setDraftConfig((prev) => {
                    if (!prev)
                        return prev;
                    return {
                        ...prev,
                        configs: [...prev.configs, {
                                credential_id: currentCredential.credential_id,
                                enabled: true,
                                name: currentCredential.credential_name,
                            }],
                    };
                });
            }
        }
        else {
            setDraftConfig((prev) => {
                if (!prev)
                    return prev;
                const newConfigs = [...prev.configs];
                const prevIndex = newConfigs.findIndex(item => item.credential_id === modelCredential.credential_id && item.name !== '__inherit__');
                const newIndex = available_credentials.findIndex(c => c.credential_id === modelCredential.credential_id);
                if (newIndex > -1 && prevIndex > -1)
                    newConfigs[prevIndex].name = available_credentials[newIndex].credential_name || '';
                return {
                    ...prev,
                    configs: newConfigs,
                };
            });
        }
    }, [refetch, credential]);
    const handleUpdateWhenSwitchCredential = (0, react_1.useCallback)(async () => {
        const result = await refetch();
        const available_credentials = result.data?.available_credentials || [];
        if (!available_credentials.length)
            onClose?.();
    }, [refetch, onClose]);
    return (<>
      <modal_1.default isShow={Boolean(model) && open} onClose={onClose} className="w-[640px] max-w-none px-8 pt-8" title={(<div className="pb-3 font-semibold">
            <div className="h-[30px]">
              {draftConfig?.enabled
                ? t('modelProvider.auth.configLoadBalancing', { ns: 'common' })
                : t('modelProvider.auth.configModel', { ns: 'common' })}
            </div>
            {Boolean(model) && (<div className="flex h-5 items-center">
                <model_icon_1.default className="mr-2 shrink-0" provider={provider} modelName={model.model}/>
                <model_name_1.default className="system-md-regular grow text-text-secondary" modelItem={model} showModelType showMode showContextSize/>
              </div>)}
          </div>)}>
        {!draftConfig
            ? <loading_1.default type="area"/>
            : (<>
                <div className="py-2">
                  <div className={(0, classnames_1.cn)('min-h-16 rounded-xl border bg-components-panel-bg transition-colors', draftConfig.enabled ? 'cursor-pointer border-components-panel-border' : 'cursor-default border-util-colors-blue-blue-600')} onClick={draftConfig.enabled ? () => toggleModalBalancing(false) : undefined}>
                    <div className="flex select-none items-center gap-2 px-[15px] py-3">
                      <div className="flex h-8 w-8 shrink-0 grow-0 items-center justify-center rounded-lg border border-components-card-border bg-components-card-bg">
                        {Boolean(model) && (<model_icon_1.default className="shrink-0" provider={provider} modelName={model.model}/>)}
                      </div>
                      <div className="grow">
                        <div className="text-sm text-text-secondary">
                          {providerFormSchemaPredefined
                    ? t('modelProvider.auth.providerManaged', { ns: 'common' })
                    : t('modelProvider.auth.specifyModelCredential', { ns: 'common' })}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          {providerFormSchemaPredefined
                    ? t('modelProvider.auth.providerManagedTip', { ns: 'common' })
                    : t('modelProvider.auth.specifyModelCredentialTip', { ns: 'common' })}
                        </div>
                      </div>
                      {!providerFormSchemaPredefined && (<model_auth_1.SwitchCredentialInLoadBalancing provider={provider} customModelCredential={customModelCredential ?? initialCustomModelCredential} setCustomModelCredential={setCustomModelCredential} model={model} credentials={available_credentials} onUpdate={handleUpdateWhenSwitchCredential} onRemove={handleUpdateWhenSwitchCredential}/>)}
                    </div>
                  </div>
                  {modelCredential && (<model_load_balancing_configs_1.default {...{
                    draftConfig,
                    setDraftConfig,
                    provider,
                    currentCustomConfigurationModelFixedFields: {
                        __model_name: model.model,
                        __model_type: model.model_type,
                    },
                    configurationMethod: model.fetch_from,
                    className: 'mt-2',
                    modelCredential,
                    onUpdate: handleUpdate,
                    onRemove: handleUpdateWhenSwitchCredential,
                    model: {
                        model: model.model,
                        model_type: model.model_type,
                    },
                }}/>)}
                </div>

                <div className="mt-6 flex items-center justify-between gap-2">
                  <div>
                    {!providerFormSchemaPredefined && (<button_1.default onClick={() => openConfirmDelete(undefined, { model: model.model, model_type: model.model_type })} className="text-components-button-destructive-secondary-text">
                          {t('modelProvider.auth.removeModel', { ns: 'common' })}
                        </button_1.default>)}
                  </div>
                  <div className="space-x-2">
                    <button_1.default onClick={onClose}>{t('operation.cancel', { ns: 'common' })}</button_1.default>
                    <button_1.default variant="primary" onClick={handleSave} disabled={loading
                    || (draftConfig?.enabled && (draftConfig?.configs.filter(config => config.enabled).length ?? 0) < 2)
                    || isLoading}>
                      {t('operation.save', { ns: 'common' })}
                    </button_1.default>
                  </div>
                </div>
              </>)}
      </modal_1.default>
      {deleteModel && (<confirm_1.default isShow title={t('modelProvider.confirmDelete', { ns: 'common' })} onCancel={closeConfirmDelete} onConfirm={handleDeleteModel} isDisabled={doingAction}/>)}
    </>);
};
exports.default = (0, react_1.memo)(ModelLoadBalancingModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtbG9hZC1iYWxhbmNpbmctbW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb2RlbC1sb2FkLWJhbGFuY2luZy1tb2RhbC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxpQ0FBdUU7QUFDdkUsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCwyREFBbUQ7QUFDbkQsMkRBQW1EO0FBQ25ELHVEQUErQztBQUMvQyx1REFBNkQ7QUFDN0QsdUdBQXdIO0FBQ3hILHFEQUc2QjtBQUM3QixtREFBdUM7QUFDdkMsa0RBR3dCO0FBQ3hCLG9DQUEwQztBQUMxQywyREFBc0Q7QUFDdEQsOENBQXFDO0FBQ3JDLDhDQUFxQztBQUNyQyxpRkFBc0U7QUFhdEUsK0JBQStCO0FBQy9CLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxFQUMvQixRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLDBDQUEwQyxFQUMxQyxLQUFLLEVBQ0wsVUFBVSxFQUNWLElBQUksR0FBRyxLQUFLLEVBQ1osT0FBTyxFQUNQLE1BQU0sR0FDdUIsRUFBRSxFQUFFO0lBQ2pDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFDcEMsTUFBTSxFQUNKLFdBQVcsRUFDWCxXQUFXLEVBQ1gsaUJBQWlCLEVBQ2pCLGtCQUFrQixFQUNsQixtQkFBbUIsR0FDcEIsR0FBRyxJQUFBLGtCQUFPLEVBQ1QsUUFBUSxFQUNSLGlCQUFpQixFQUNqQiwwQ0FBMEMsRUFDMUM7UUFDRSxpQkFBaUIsRUFBRSxJQUFJO0tBQ3hCLENBQ0YsQ0FBQTtJQUNELE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzdDLE1BQU0sNEJBQTRCLEdBQUcsaUJBQWlCLEtBQUssc0NBQXVCLENBQUMsZUFBZSxDQUFB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LEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQzFELFFBQVEsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQzdCLFNBQVMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQzdCLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUN4QixDQUVOLENBQ0Y7SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLElBQUEsWUFBSSxFQUFDLHVCQUF1QixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIENyZWRlbnRpYWwsXG4gIEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzLFxuICBNb2RlbEl0ZW0sXG4gIE1vZGVsTG9hZEJhbGFuY2luZ0NvbmZpZyxcbiAgTW9kZWxMb2FkQmFsYW5jaW5nQ29uZmlnRW50cnksXG4gIE1vZGVsUHJvdmlkZXIsXG59IGZyb20gJy4uL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IG1lbW8sIHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgQ29uZmlybSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY29uZmlybSdcbmltcG9ydCBMb2FkaW5nIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuaW1wb3J0IE1vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9tb2RhbCdcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IFN3aXRjaENyZWRlbnRpYWxJbkxvYWRCYWxhbmNpbmcgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9tb2RlbC1hdXRoJ1xuaW1wb3J0IHtcbiAgdXNlR2V0TW9kZWxDcmVkZW50aWFsLFxuICB1c2VVcGRhdGVNb2RlbExvYWRCYWxhbmNpbmdDb25maWcsXG59IGZyb20gJ0Avc2VydmljZS91c2UtbW9kZWxzJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQge1xuICBDb25maWd1cmF0aW9uTWV0aG9kRW51bSxcbiAgRm9ybVR5cGVFbnVtLFxufSBmcm9tICcuLi9kZWNsYXJhdGlvbnMnXG5pbXBvcnQgeyB1c2VSZWZyZXNoTW9kZWwgfSBmcm9tICcuLi9ob29rcydcbmltcG9ydCB7IHVzZUF1dGggfSBmcm9tICcuLi9tb2RlbC1hdXRoL2hvb2tzL3VzZS1hdXRoJ1xuaW1wb3J0IE1vZGVsSWNvbiBmcm9tICcuLi9tb2RlbC1pY29uJ1xuaW1wb3J0IE1vZGVsTmFtZSBmcm9tICcuLi9tb2RlbC1uYW1lJ1xuaW1wb3J0IE1vZGVsTG9hZEJhbGFuY2luZ0NvbmZpZ3MgZnJvbSAnLi9tb2RlbC1sb2FkLWJhbGFuY2luZy1jb25maWdzJ1xuXG5leHBvcnQgdHlwZSBNb2RlbExvYWRCYWxhbmNpbmdNb2RhbFByb3BzID0ge1xuICBwcm92aWRlcjogTW9kZWxQcm92aWRlclxuICBjb25maWd1cmF0ZU1ldGhvZDogQ29uZmlndXJhdGlvbk1ldGhvZEVudW1cbiAgY3VycmVudEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzPzogQ3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHNcbiAgbW9kZWw6IE1vZGVsSXRlbVxuICBjcmVkZW50aWFsPzogQ3JlZGVudGlhbFxuICBvcGVuPzogYm9vbGVhblxuICBvbkNsb3NlPzogKCkgPT4gdm9pZFxuICBvblNhdmU/OiAocHJvdmlkZXI6IHN0cmluZykgPT4gdm9pZFxufVxuXG4vLyBtb2RlbCBiYWxhbmNpbmcgY29uZmlnIG1vZGFsXG5jb25zdCBNb2RlbExvYWRCYWxhbmNpbmdNb2RhbCA9ICh7XG4gIHByb3ZpZGVyLFxuICBjb25maWd1cmF0ZU1ldGhvZCxcbiAgY3VycmVudEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzLFxuICBtb2RlbCxcbiAgY3JlZGVudGlhbCxcbiAgb3BlbiA9IGZhbHNlLFxuICBvbkNsb3NlLFxuICBvblNhdmUsXG59OiBNb2RlbExvYWRCYWxhbmNpbmdNb2RhbFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlVG9hc3RDb250ZXh0KClcbiAgY29uc3Qge1xuICAgIGRvaW5nQWN0aW9uLFxuICAgIGRlbGV0ZU1vZGVsLFxuICAgIG9wZW5Db25maXJtRGVsZXRlLFxuICAgIGNsb3NlQ29uZmlybURlbGV0ZSxcbiAgICBoYW5kbGVDb25maXJtRGVsZXRlLFxuICB9ID0gdXNlQXV0aChcbiAgICBwcm92aWRlcixcbiAgICBjb25maWd1cmF0ZU1ldGhvZCxcbiAgICBjdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHMsXG4gICAge1xuICAgICAgaXNNb2RlbENyZWRlbnRpYWw6IHRydWUsXG4gICAgfSxcbiAgKVxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgcHJvdmlkZXJGb3JtU2NoZW1hUHJlZGVmaW5lZCA9IGNvbmZpZ3VyYXRlTWV0aG9kID09PSBDb25maWd1cmF0aW9uTWV0aG9kRW51bS5wcmVkZWZpbmVkTW9kZWxcbiAgY29uc3QgY29uZmlnRnJvbSA9IHByb3ZpZGVyRm9ybVNjaGVtYVByZWRlZmluZWQgPyAncHJlZGVmaW5lZC1tb2RlbCcgOiAnY3VzdG9tLW1vZGVsJ1xuICBjb25zdCB7XG4gICAgaXNMb2FkaW5nLFxuICAgIGRhdGEsXG4gICAgcmVmZXRjaCxcbiAgfSA9IHVzZUdldE1vZGVsQ3JlZGVudGlhbCh0cnVlLCBwcm92aWRlci5wcm92aWRlciwgY3JlZGVudGlhbD8uY3JlZGVudGlhbF9pZCwgbW9kZWwubW9kZWwsIG1vZGVsLm1vZGVsX3R5cGUsIGNvbmZpZ0Zyb20pXG4gIGNvbnN0IG1vZGVsQ3JlZGVudGlhbCA9IGRhdGFcbiAgY29uc3Qge1xuICAgIGxvYWRfYmFsYW5jaW5nLFxuICAgIGN1cnJlbnRfY3JlZGVudGlhbF9pZCxcbiAgICBhdmFpbGFibGVfY3JlZGVudGlhbHMsXG4gICAgY3VycmVudF9jcmVkZW50aWFsX25hbWUsXG4gIH0gPSBtb2RlbENyZWRlbnRpYWwgPz8ge31cbiAgY29uc3Qgb3JpZ2luYWxDb25maWcgPSBsb2FkX2JhbGFuY2luZ1xuICBjb25zdCBbZHJhZnRDb25maWcsIHNldERyYWZ0Q29uZmlnXSA9IHVzZVN0YXRlPE1vZGVsTG9hZEJhbGFuY2luZ0NvbmZpZz4oKVxuICBjb25zdCBvcmlnaW5hbENvbmZpZ01hcCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghb3JpZ2luYWxDb25maWcpXG4gICAgICByZXR1cm4ge31cbiAgICByZXR1cm4gb3JpZ2luYWxDb25maWc/LmNvbmZpZ3MucmVkdWNlKChwcmV2LCBjb25maWcpID0+IHtcbiAgICAgIGlmIChjb25maWcuaWQpXG4gICAgICAgIHByZXZbY29uZmlnLmlkXSA9IGNvbmZpZ1xuICAgICAgcmV0dXJuIHByZXZcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBNb2RlbExvYWRCYWxhbmNpbmdDb25maWdFbnRyeT4pXG4gIH0sIFtvcmlnaW5hbENvbmZpZ10pXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKG9yaWdpbmFsQ29uZmlnKVxuICAgICAgc2V0RHJhZnRDb25maWcob3JpZ2luYWxDb25maWcpXG4gIH0sIFtvcmlnaW5hbENvbmZpZ10pXG5cbiAgY29uc3QgdG9nZ2xlTW9kYWxCYWxhbmNpbmcgPSB1c2VDYWxsYmFjaygoZW5hYmxlZDogYm9vbGVhbikgPT4ge1xuICAgIGlmIChkcmFmdENvbmZpZykge1xuICAgICAgc2V0RHJhZnRDb25maWcoe1xuICAgICAgICAuLi5kcmFmdENvbmZpZyxcbiAgICAgICAgZW5hYmxlZCxcbiAgICAgIH0pXG4gICAgfVxuICB9LCBbZHJhZnRDb25maWddKVxuXG4gIGNvbnN0IGV4dGVuZGVkU2VjcmV0Rm9ybVNjaGVtYXMgPSB1c2VNZW1vKFxuICAgICgpID0+IHtcbiAgICAgIGlmIChwcm92aWRlckZvcm1TY2hlbWFQcmVkZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBwcm92aWRlcj8ucHJvdmlkZXJfY3JlZGVudGlhbF9zY2hlbWE/LmNyZWRlbnRpYWxfZm9ybV9zY2hlbWFzPy5maWx0ZXIoXG4gICAgICAgICAgKHsgdHlwZSB9KSA9PiB0eXBlID09PSBGb3JtVHlwZUVudW0uc2VjcmV0SW5wdXQsXG4gICAgICAgICkgPz8gW11cbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm92aWRlcj8ubW9kZWxfY3JlZGVudGlhbF9zY2hlbWE/LmNyZWRlbnRpYWxfZm9ybV9zY2hlbWFzPy5maWx0ZXIoXG4gICAgICAgICh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gRm9ybVR5cGVFbnVtLnNlY3JldElucHV0LFxuICAgICAgKSA/PyBbXVxuICAgIH0sXG4gICAgW3Byb3ZpZGVyPy5tb2RlbF9jcmVkZW50aWFsX3NjaGVtYT8uY3JlZGVudGlhbF9mb3JtX3NjaGVtYXMsIHByb3ZpZGVyPy5wcm92aWRlcl9jcmVkZW50aWFsX3NjaGVtYT8uY3JlZGVudGlhbF9mb3JtX3NjaGVtYXMsIHByb3ZpZGVyRm9ybVNjaGVtYVByZWRlZmluZWRdLFxuICApXG5cbiAgY29uc3QgZW5jb2RlQ29uZmlnRW50cnlTZWNyZXRWYWx1ZXMgPSB1c2VDYWxsYmFjaygoZW50cnk6IE1vZGVsTG9hZEJhbGFuY2luZ0NvbmZpZ0VudHJ5KSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0geyAuLi5lbnRyeSB9XG4gICAgZXh0ZW5kZWRTZWNyZXRGb3JtU2NoZW1hcy5mb3JFYWNoKCh7IHZhcmlhYmxlIH0pID0+IHtcbiAgICAgIGlmIChlbnRyeS5pZCAmJiByZXN1bHQuY3JlZGVudGlhbHNbdmFyaWFibGVdID09PSBvcmlnaW5hbENvbmZpZ01hcFtlbnRyeS5pZF0/LmNyZWRlbnRpYWxzPy5bdmFyaWFibGVdKVxuICAgICAgICByZXN1bHQuY3JlZGVudGlhbHNbdmFyaWFibGVdID0gJ1tfX0hJRERFTl9fXSdcbiAgICB9KVxuICAgIHJldHVybiByZXN1bHRcbiAgfSwgW2V4dGVuZGVkU2VjcmV0Rm9ybVNjaGVtYXMsIG9yaWdpbmFsQ29uZmlnTWFwXSlcblxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiB1cGRhdGVNb2RlbExvYWRCYWxhbmNpbmdDb25maWcgfSA9IHVzZVVwZGF0ZU1vZGVsTG9hZEJhbGFuY2luZ0NvbmZpZyhwcm92aWRlci5wcm92aWRlcilcbiAgY29uc3QgaW5pdGlhbEN1c3RvbU1vZGVsQ3JlZGVudGlhbCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghY3VycmVudF9jcmVkZW50aWFsX2lkKVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB7XG4gICAgICBjcmVkZW50aWFsX2lkOiBjdXJyZW50X2NyZWRlbnRpYWxfaWQsXG4gICAgICBjcmVkZW50aWFsX25hbWU6IGN1cnJlbnRfY3JlZGVudGlhbF9uYW1lLFxuICAgIH1cbiAgfSwgW2N1cnJlbnRfY3JlZGVudGlhbF9pZCwgY3VycmVudF9jcmVkZW50aWFsX25hbWVdKVxuICBjb25zdCBbY3VzdG9tTW9kZWxDcmVkZW50aWFsLCBzZXRDdXN0b21Nb2RlbENyZWRlbnRpYWxdID0gdXNlU3RhdGU8Q3JlZGVudGlhbCB8IHVuZGVmaW5lZD4oaW5pdGlhbEN1c3RvbU1vZGVsQ3JlZGVudGlhbClcbiAgY29uc3QgeyBoYW5kbGVSZWZyZXNoTW9kZWwgfSA9IHVzZVJlZnJlc2hNb2RlbCgpXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSBhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHVwZGF0ZU1vZGVsTG9hZEJhbGFuY2luZ0NvbmZpZyhcbiAgICAgICAge1xuICAgICAgICAgIGNyZWRlbnRpYWxfaWQ6IGN1c3RvbU1vZGVsQ3JlZGVudGlhbD8uY3JlZGVudGlhbF9pZCB8fCBjdXJyZW50X2NyZWRlbnRpYWxfaWQsXG4gICAgICAgICAgY29uZmlnX2Zyb206IGNvbmZpZ0Zyb20sXG4gICAgICAgICAgbW9kZWw6IG1vZGVsLm1vZGVsLFxuICAgICAgICAgIG1vZGVsX3R5cGU6IG1vZGVsLm1vZGVsX3R5cGUsXG4gICAgICAgICAgbG9hZF9iYWxhbmNpbmc6IHtcbiAgICAgICAgICAgIC4uLmRyYWZ0Q29uZmlnLFxuICAgICAgICAgICAgY29uZmlnczogZHJhZnRDb25maWchLmNvbmZpZ3MubWFwKGVuY29kZUNvbmZpZ0VudHJ5U2VjcmV0VmFsdWVzKSxcbiAgICAgICAgICAgIGVuYWJsZWQ6IEJvb2xlYW4oZHJhZnRDb25maWc/LmVuYWJsZWQpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApXG4gICAgICBpZiAocmVzLnJlc3VsdCA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgICAgaGFuZGxlUmVmcmVzaE1vZGVsKHByb3ZpZGVyLCBjdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHMsIGZhbHNlKVxuICAgICAgICBvblNhdmU/Lihwcm92aWRlci5wcm92aWRlcilcbiAgICAgICAgb25DbG9zZT8uKClcbiAgICAgIH1cbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuICBjb25zdCBoYW5kbGVEZWxldGVNb2RlbCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBoYW5kbGVDb25maXJtRGVsZXRlKClcbiAgICBvbkNsb3NlPy4oKVxuICB9LCBbaGFuZGxlQ29uZmlybURlbGV0ZSwgb25DbG9zZV0pXG5cbiAgY29uc3QgaGFuZGxlVXBkYXRlID0gdXNlQ2FsbGJhY2soYXN5bmMgKHBheWxvYWQ/OiBhbnksIGZvcm1WYWx1ZXM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVmZXRjaCgpXG4gICAgY29uc3QgYXZhaWxhYmxlX2NyZWRlbnRpYWxzID0gcmVzdWx0LmRhdGE/LmF2YWlsYWJsZV9jcmVkZW50aWFscyB8fCBbXVxuICAgIGNvbnN0IGNyZWRlbnRpYWxOYW1lID0gZm9ybVZhbHVlcz8uX19hdXRob3JpemF0aW9uX25hbWVfX1xuICAgIGNvbnN0IG1vZGVsQ3JlZGVudGlhbCA9IHBheWxvYWQ/LmNyZWRlbnRpYWxcblxuICAgIGlmICghYXZhaWxhYmxlX2NyZWRlbnRpYWxzLmxlbmd0aCkge1xuICAgICAgb25DbG9zZT8uKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghbW9kZWxDcmVkZW50aWFsKSB7XG4gICAgICBjb25zdCBjdXJyZW50Q3JlZGVudGlhbCA9IGF2YWlsYWJsZV9jcmVkZW50aWFscy5maW5kKGMgPT4gYy5jcmVkZW50aWFsX25hbWUgPT09IGNyZWRlbnRpYWxOYW1lKVxuICAgICAgaWYgKGN1cnJlbnRDcmVkZW50aWFsKSB7XG4gICAgICAgIHNldERyYWZ0Q29uZmlnKChwcmV2OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIXByZXYpXG4gICAgICAgICAgICByZXR1cm4gcHJldlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5wcmV2LFxuICAgICAgICAgICAgY29uZmlnczogWy4uLnByZXYuY29uZmlncywge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsX2lkOiBjdXJyZW50Q3JlZGVudGlhbC5jcmVkZW50aWFsX2lkLFxuICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICBuYW1lOiBjdXJyZW50Q3JlZGVudGlhbC5jcmVkZW50aWFsX25hbWUsXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc2V0RHJhZnRDb25maWcoKHByZXYpID0+IHtcbiAgICAgICAgaWYgKCFwcmV2KVxuICAgICAgICAgIHJldHVybiBwcmV2XG4gICAgICAgIGNvbnN0IG5ld0NvbmZpZ3MgPSBbLi4ucHJldi5jb25maWdzXVxuICAgICAgICBjb25zdCBwcmV2SW5kZXggPSBuZXdDb25maWdzLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uY3JlZGVudGlhbF9pZCA9PT0gbW9kZWxDcmVkZW50aWFsLmNyZWRlbnRpYWxfaWQgJiYgaXRlbS5uYW1lICE9PSAnX19pbmhlcml0X18nKVxuICAgICAgICBjb25zdCBuZXdJbmRleCA9IGF2YWlsYWJsZV9jcmVkZW50aWFscy5maW5kSW5kZXgoYyA9PiBjLmNyZWRlbnRpYWxfaWQgPT09IG1vZGVsQ3JlZGVudGlhbC5jcmVkZW50aWFsX2lkKVxuXG4gICAgICAgIGlmIChuZXdJbmRleCA+IC0xICYmIHByZXZJbmRleCA+IC0xKVxuICAgICAgICAgIG5ld0NvbmZpZ3NbcHJldkluZGV4XS5uYW1lID0gYXZhaWxhYmxlX2NyZWRlbnRpYWxzW25ld0luZGV4XS5jcmVkZW50aWFsX25hbWUgfHwgJydcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgY29uZmlnczogbmV3Q29uZmlncyxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0sIFtyZWZldGNoLCBjcmVkZW50aWFsXSlcblxuICBjb25zdCBoYW5kbGVVcGRhdGVXaGVuU3dpdGNoQ3JlZGVudGlhbCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZWZldGNoKClcbiAgICBjb25zdCBhdmFpbGFibGVfY3JlZGVudGlhbHMgPSByZXN1bHQuZGF0YT8uYXZhaWxhYmxlX2NyZWRlbnRpYWxzIHx8IFtdXG4gICAgaWYgKCFhdmFpbGFibGVfY3JlZGVudGlhbHMubGVuZ3RoKVxuICAgICAgb25DbG9zZT8uKClcbiAgfSwgW3JlZmV0Y2gsIG9uQ2xvc2VdKVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxNb2RhbFxuICAgICAgICBpc1Nob3c9e0Jvb2xlYW4obW9kZWwpICYmIG9wZW59XG4gICAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICAgIGNsYXNzTmFtZT1cInctWzY0MHB4XSBtYXgtdy1ub25lIHB4LTggcHQtOFwiXG4gICAgICAgIHRpdGxlPXsoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYi0zIGZvbnQtc2VtaWJvbGRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC1bMzBweF1cIj5cbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRyYWZ0Q29uZmlnPy5lbmFibGVkXG4gICAgICAgICAgICAgICAgICA/IHQoJ21vZGVsUHJvdmlkZXIuYXV0aC5jb25maWdMb2FkQmFsYW5jaW5nJywgeyBuczogJ2NvbW1vbicgfSlcbiAgICAgICAgICAgICAgICAgIDogdCgnbW9kZWxQcm92aWRlci5hdXRoLmNvbmZpZ01vZGVsJywgeyBuczogJ2NvbW1vbicgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7Qm9vbGVhbihtb2RlbCkgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC01IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgIDxNb2RlbEljb25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTIgc2hyaW5rLTBcIlxuICAgICAgICAgICAgICAgICAgcHJvdmlkZXI9e3Byb3ZpZGVyfVxuICAgICAgICAgICAgICAgICAgbW9kZWxOYW1lPXttb2RlbCEubW9kZWx9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8TW9kZWxOYW1lXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtcmVndWxhciBncm93IHRleHQtdGV4dC1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgbW9kZWxJdGVtPXttb2RlbCF9XG4gICAgICAgICAgICAgICAgICBzaG93TW9kZWxUeXBlXG4gICAgICAgICAgICAgICAgICBzaG93TW9kZVxuICAgICAgICAgICAgICAgICAgc2hvd0NvbnRleHRTaXplXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPlxuICAgICAgICB7IWRyYWZ0Q29uZmlnXG4gICAgICAgICAgPyA8TG9hZGluZyB0eXBlPVwiYXJlYVwiIC8+XG4gICAgICAgICAgOiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweS0yXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oJ21pbi1oLTE2IHJvdW5kZWQteGwgYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgdHJhbnNpdGlvbi1jb2xvcnMnLCBkcmFmdENvbmZpZy5lbmFibGVkID8gJ2N1cnNvci1wb2ludGVyIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlcicgOiAnY3Vyc29yLWRlZmF1bHQgYm9yZGVyLXV0aWwtY29sb3JzLWJsdWUtYmx1ZS02MDAnKX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZHJhZnRDb25maWcuZW5hYmxlZCA/ICgpID0+IHRvZ2dsZU1vZGFsQmFsYW5jaW5nKGZhbHNlKSA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNlbGVjdC1ub25lIGl0ZW1zLWNlbnRlciBnYXAtMiBweC1bMTVweF0gcHktM1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTggdy04IHNocmluay0wIGdyb3ctMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWNvbXBvbmVudHMtY2FyZC1ib3JkZXIgYmctY29tcG9uZW50cy1jYXJkLWJnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Qm9vbGVhbihtb2RlbCkgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kZWxJY29uIGNsYXNzTmFtZT1cInNocmluay0wXCIgcHJvdmlkZXI9e3Byb3ZpZGVyfSBtb2RlbE5hbWU9e21vZGVsIS5tb2RlbH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJGb3JtU2NoZW1hUHJlZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0KCdtb2RlbFByb3ZpZGVyLmF1dGgucHJvdmlkZXJNYW5hZ2VkJywgeyBuczogJ2NvbW1vbicgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdCgnbW9kZWxQcm92aWRlci5hdXRoLnNwZWNpZnlNb2RlbENyZWRlbnRpYWwnLCB7IG5zOiAnY29tbW9uJyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyRm9ybVNjaGVtYVByZWRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdCgnbW9kZWxQcm92aWRlci5hdXRoLnByb3ZpZGVyTWFuYWdlZFRpcCcsIHsgbnM6ICdjb21tb24nIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHQoJ21vZGVsUHJvdmlkZXIuYXV0aC5zcGVjaWZ5TW9kZWxDcmVkZW50aWFsVGlwJywgeyBuczogJ2NvbW1vbicgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgIXByb3ZpZGVyRm9ybVNjaGVtYVByZWRlZmluZWQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8U3dpdGNoQ3JlZGVudGlhbEluTG9hZEJhbGFuY2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyPXtwcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21Nb2RlbENyZWRlbnRpYWw9e2N1c3RvbU1vZGVsQ3JlZGVudGlhbCA/PyBpbml0aWFsQ3VzdG9tTW9kZWxDcmVkZW50aWFsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEN1c3RvbU1vZGVsQ3JlZGVudGlhbD17c2V0Q3VzdG9tTW9kZWxDcmVkZW50aWFsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsPXttb2RlbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFscz17YXZhaWxhYmxlX2NyZWRlbnRpYWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uVXBkYXRlPXtoYW5kbGVVcGRhdGVXaGVuU3dpdGNoQ3JlZGVudGlhbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblJlbW92ZT17aGFuZGxlVXBkYXRlV2hlblN3aXRjaENyZWRlbnRpYWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbENyZWRlbnRpYWwgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxNb2RlbExvYWRCYWxhbmNpbmdDb25maWdzIHsuLi57XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFmdENvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldERyYWZ0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX19tb2RlbF9uYW1lOiBtb2RlbC5tb2RlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX19tb2RlbF90eXBlOiBtb2RlbC5tb2RlbF90eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25NZXRob2Q6IG1vZGVsLmZldGNoX2Zyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdtdC0yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsQ3JlZGVudGlhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uVXBkYXRlOiBoYW5kbGVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlbW92ZTogaGFuZGxlVXBkYXRlV2hlblN3aXRjaENyZWRlbnRpYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogbW9kZWwubW9kZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsX3R5cGU6IG1vZGVsLm1vZGVsX3R5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC02IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICFwcm92aWRlckZvcm1TY2hlbWFQcmVkZWZpbmVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb3BlbkNvbmZpcm1EZWxldGUodW5kZWZpbmVkLCB7IG1vZGVsOiBtb2RlbC5tb2RlbCwgbW9kZWxfdHlwZTogbW9kZWwubW9kZWxfdHlwZSB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1jb21wb25lbnRzLWJ1dHRvbi1kZXN0cnVjdGl2ZS1zZWNvbmRhcnktdGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdtb2RlbFByb3ZpZGVyLmF1dGgucmVtb3ZlTW9kZWwnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXgtMlwiPlxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9Pnt0KCdvcGVyYXRpb24uY2FuY2VsJywgeyBuczogJ2NvbW1vbicgfSl9PC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAoZHJhZnRDb25maWc/LmVuYWJsZWQgJiYgKGRyYWZ0Q29uZmlnPy5jb25maWdzLmZpbHRlcihjb25maWcgPT4gY29uZmlnLmVuYWJsZWQpLmxlbmd0aCA/PyAwKSA8IDIpXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBpc0xvYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnb3BlcmF0aW9uLnNhdmUnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApfVxuICAgICAgPC9Nb2RhbD5cbiAgICAgIHtcbiAgICAgICAgZGVsZXRlTW9kZWwgJiYgKFxuICAgICAgICAgIDxDb25maXJtXG4gICAgICAgICAgICBpc1Nob3dcbiAgICAgICAgICAgIHRpdGxlPXt0KCdtb2RlbFByb3ZpZGVyLmNvbmZpcm1EZWxldGUnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXtjbG9zZUNvbmZpcm1EZWxldGV9XG4gICAgICAgICAgICBvbkNvbmZpcm09e2hhbmRsZURlbGV0ZU1vZGVsfVxuICAgICAgICAgICAgaXNEaXNhYmxlZD17ZG9pbmdBY3Rpb259XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfVxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oTW9kZWxMb2FkQmFsYW5jaW5nTW9kYWwpXG4iXX0=