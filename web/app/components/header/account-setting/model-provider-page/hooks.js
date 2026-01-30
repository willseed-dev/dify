"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModelModalHandler = exports.useRefreshModel = exports.useMarketplaceAllPlugins = exports.useUpdateModelProviders = exports.useAnthropicBuyQuota = exports.useUpdateModelList = exports.useModelListAndDefaultModelAndCurrentProviderAndModel = exports.useModelListAndDefaultModel = exports.useTextGenerationCurrentProviderAndModelAndModelList = exports.useCurrentProviderAndModel = exports.useDefaultModel = exports.useModelList = exports.useProviderCredentialsAndLoadBalancing = exports.useLanguage = exports.useSystemDefaultModelAndModelList = void 0;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const hooks_1 = require("@/app/components/plugins/marketplace/hooks");
const types_1 = require("@/app/components/plugins/types");
const event_emitter_1 = require("@/context/event-emitter");
const i18n_1 = require("@/context/i18n");
const modal_context_1 = require("@/context/modal-context");
const provider_context_1 = require("@/context/provider-context");
const common_1 = require("@/service/common");
const use_common_1 = require("@/service/use-common");
const declarations_1 = require("./declarations");
const provider_added_card_1 = require("./provider-added-card");
const useSystemDefaultModelAndModelList = (defaultModel, modelList) => {
    const currentDefaultModel = (0, react_1.useMemo)(() => {
        const currentProvider = modelList.find(provider => provider.provider === defaultModel?.provider.provider);
        const currentModel = currentProvider?.models.find(model => model.model === defaultModel?.model);
        const currentDefaultModel = currentProvider && currentModel && {
            model: currentModel.model,
            provider: currentProvider.provider,
        };
        return currentDefaultModel;
    }, [defaultModel, modelList]);
    const [defaultModelState, setDefaultModelState] = (0, react_1.useState)(currentDefaultModel);
    const handleDefaultModelChange = (0, react_1.useCallback)((model) => {
        setDefaultModelState(model);
    }, []);
    (0, react_1.useEffect)(() => {
        setDefaultModelState(currentDefaultModel);
    }, [currentDefaultModel]);
    return [defaultModelState, handleDefaultModelChange];
};
exports.useSystemDefaultModelAndModelList = useSystemDefaultModelAndModelList;
const useLanguage = () => {
    const locale = (0, i18n_1.useLocale)();
    return locale.replace('-', '_');
};
exports.useLanguage = useLanguage;
const useProviderCredentialsAndLoadBalancing = (provider, configurationMethod, configured, currentCustomConfigurationModelFixedFields, credentialId) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const predefinedEnabled = configurationMethod === declarations_1.ConfigurationMethodEnum.predefinedModel && configured && !!credentialId;
    const customEnabled = configurationMethod === declarations_1.ConfigurationMethodEnum.customizableModel && !!currentCustomConfigurationModelFixedFields && !!credentialId;
    const { data: predefinedFormSchemasValue, isPending: isPredefinedLoading } = (0, react_query_1.useQuery)({
        queryKey: ['model-providers', 'credentials', provider, credentialId],
        queryFn: () => (0, common_1.fetchModelProviderCredentials)(`/workspaces/current/model-providers/${provider}/credentials${credentialId ? `?credential_id=${credentialId}` : ''}`),
        enabled: predefinedEnabled,
    });
    const { data: customFormSchemasValue, isPending: isCustomizedLoading } = (0, react_query_1.useQuery)({
        queryKey: ['model-providers', 'models', 'credentials', provider, currentCustomConfigurationModelFixedFields?.__model_type, currentCustomConfigurationModelFixedFields?.__model_name, credentialId],
        queryFn: () => (0, common_1.fetchModelProviderCredentials)(`/workspaces/current/model-providers/${provider}/models/credentials?model=${currentCustomConfigurationModelFixedFields?.__model_name}&model_type=${currentCustomConfigurationModelFixedFields?.__model_type}${credentialId ? `&credential_id=${credentialId}` : ''}`),
        enabled: customEnabled,
    });
    const credentials = (0, react_1.useMemo)(() => {
        return configurationMethod === declarations_1.ConfigurationMethodEnum.predefinedModel
            ? predefinedFormSchemasValue?.credentials
            : customFormSchemasValue?.credentials
                ? {
                    ...customFormSchemasValue?.credentials,
                    ...currentCustomConfigurationModelFixedFields,
                }
                : undefined;
    }, [
        configurationMethod,
        credentialId,
        currentCustomConfigurationModelFixedFields,
        customFormSchemasValue?.credentials,
        predefinedFormSchemasValue?.credentials,
    ]);
    const mutate = (0, react_1.useMemo)(() => () => {
        if (predefinedEnabled)
            queryClient.invalidateQueries({ queryKey: ['model-providers', 'credentials', provider, credentialId] });
        if (customEnabled)
            queryClient.invalidateQueries({ queryKey: ['model-providers', 'models', 'credentials', provider, currentCustomConfigurationModelFixedFields?.__model_type, currentCustomConfigurationModelFixedFields?.__model_name, credentialId] });
    }, [customEnabled, credentialId, currentCustomConfigurationModelFixedFields?.__model_name, currentCustomConfigurationModelFixedFields?.__model_type, predefinedEnabled, provider, queryClient]);
    return {
        credentials,
        loadBalancing: (configurationMethod === declarations_1.ConfigurationMethodEnum.predefinedModel
            ? predefinedFormSchemasValue
            : customFormSchemasValue)?.load_balancing,
        mutate,
        isLoading: isPredefinedLoading || isCustomizedLoading,
    };
    // as ([Record<string, string | boolean | undefined> | undefined, ModelLoadBalancingConfig | undefined])
};
exports.useProviderCredentialsAndLoadBalancing = useProviderCredentialsAndLoadBalancing;
const useModelList = (type) => {
    const { data, refetch, isPending } = (0, react_query_1.useQuery)({
        queryKey: use_common_1.commonQueryKeys.modelList(type),
        queryFn: () => (0, common_1.fetchModelList)(`/workspaces/current/models/model-types/${type}`),
    });
    return {
        data: data?.data || [],
        mutate: refetch,
        isLoading: isPending,
    };
};
exports.useModelList = useModelList;
const useDefaultModel = (type) => {
    const { data, refetch, isPending } = (0, react_query_1.useQuery)({
        queryKey: use_common_1.commonQueryKeys.defaultModel(type),
        queryFn: () => (0, common_1.fetchDefaultModal)(`/workspaces/current/default-model?model_type=${type}`),
    });
    return {
        data: data?.data,
        mutate: refetch,
        isLoading: isPending,
    };
};
exports.useDefaultModel = useDefaultModel;
const useCurrentProviderAndModel = (modelList, defaultModel) => {
    const currentProvider = modelList.find(provider => provider.provider === defaultModel?.provider);
    const currentModel = currentProvider?.models.find(model => model.model === defaultModel?.model);
    return {
        currentProvider,
        currentModel,
    };
};
exports.useCurrentProviderAndModel = useCurrentProviderAndModel;
const useTextGenerationCurrentProviderAndModelAndModelList = (defaultModel) => {
    const { textGenerationModelList } = (0, provider_context_1.useProviderContext)();
    const activeTextGenerationModelList = textGenerationModelList.filter(model => model.status === declarations_1.ModelStatusEnum.active);
    const { currentProvider, currentModel, } = (0, exports.useCurrentProviderAndModel)(textGenerationModelList, defaultModel);
    return {
        currentProvider,
        currentModel,
        textGenerationModelList,
        activeTextGenerationModelList,
    };
};
exports.useTextGenerationCurrentProviderAndModelAndModelList = useTextGenerationCurrentProviderAndModelAndModelList;
const useModelListAndDefaultModel = (type) => {
    const { data: modelList } = (0, exports.useModelList)(type);
    const { data: defaultModel } = (0, exports.useDefaultModel)(type);
    return {
        modelList,
        defaultModel,
    };
};
exports.useModelListAndDefaultModel = useModelListAndDefaultModel;
const useModelListAndDefaultModelAndCurrentProviderAndModel = (type) => {
    const { modelList, defaultModel } = (0, exports.useModelListAndDefaultModel)(type);
    const { currentProvider, currentModel } = (0, exports.useCurrentProviderAndModel)(modelList, { provider: defaultModel?.provider.provider || '', model: defaultModel?.model || '' });
    return {
        modelList,
        defaultModel,
        currentProvider,
        currentModel,
    };
};
exports.useModelListAndDefaultModelAndCurrentProviderAndModel = useModelListAndDefaultModelAndCurrentProviderAndModel;
const useUpdateModelList = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const updateModelList = (0, react_1.useCallback)((type) => {
        queryClient.invalidateQueries({ queryKey: use_common_1.commonQueryKeys.modelList(type) });
    }, [queryClient]);
    return updateModelList;
};
exports.useUpdateModelList = useUpdateModelList;
const useAnthropicBuyQuota = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleGetPayUrl = async () => {
        if (loading)
            return;
        setLoading(true);
        try {
            const res = await (0, common_1.getPayUrl)('/workspaces/current/model-providers/anthropic/checkout-url');
            window.location.href = res.url;
        }
        finally {
            setLoading(false);
        }
    };
    return handleGetPayUrl;
};
exports.useAnthropicBuyQuota = useAnthropicBuyQuota;
const useUpdateModelProviders = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const updateModelProviders = (0, react_1.useCallback)(() => {
        queryClient.invalidateQueries({ queryKey: use_common_1.commonQueryKeys.modelProviders });
    }, [queryClient]);
    return updateModelProviders;
};
exports.useUpdateModelProviders = useUpdateModelProviders;
const useMarketplaceAllPlugins = (providers, searchText) => {
    const exclude = (0, react_1.useMemo)(() => {
        return providers.map(provider => provider.provider.replace(/(.+)\/([^/]+)$/, '$1'));
    }, [providers]);
    const { plugins: collectionPlugins = [], isLoading: isCollectionLoading, } = (0, hooks_1.useMarketplacePluginsByCollectionId)('__model-settings-pinned-models');
    const { plugins, queryPlugins, queryPluginsWithDebounced, isLoading: isPluginsLoading, } = (0, hooks_1.useMarketplacePlugins)();
    (0, react_1.useEffect)(() => {
        if (searchText) {
            queryPluginsWithDebounced({
                query: searchText,
                category: types_1.PluginCategoryEnum.model,
                exclude,
                type: 'plugin',
                sortBy: 'install_count',
                sortOrder: 'DESC',
            });
        }
        else {
            queryPlugins({
                query: '',
                category: types_1.PluginCategoryEnum.model,
                type: 'plugin',
                pageSize: 1000,
                exclude,
                sortBy: 'install_count',
                sortOrder: 'DESC',
            });
        }
    }, [queryPlugins, queryPluginsWithDebounced, searchText, exclude]);
    const allPlugins = (0, react_1.useMemo)(() => {
        const allPlugins = collectionPlugins.filter(plugin => !exclude.includes(plugin.plugin_id));
        if (plugins?.length) {
            for (let i = 0; i < plugins.length; i++) {
                const plugin = plugins[i];
                if (plugin.type !== 'bundle' && !allPlugins.find(p => p.plugin_id === plugin.plugin_id))
                    allPlugins.push(plugin);
            }
        }
        return allPlugins;
    }, [plugins, collectionPlugins, exclude]);
    return {
        plugins: allPlugins,
        isLoading: isCollectionLoading || isPluginsLoading,
    };
};
exports.useMarketplaceAllPlugins = useMarketplaceAllPlugins;
const useRefreshModel = () => {
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    const updateModelProviders = (0, exports.useUpdateModelProviders)();
    const updateModelList = (0, exports.useUpdateModelList)();
    const handleRefreshModel = (0, react_1.useCallback)((provider, CustomConfigurationModelFixedFields, refreshModelList) => {
        updateModelProviders();
        provider.supported_model_types.forEach((type) => {
            updateModelList(type);
        });
        if (refreshModelList && provider.custom_configuration.status === declarations_1.CustomConfigurationStatusEnum.active) {
            eventEmitter?.emit({
                type: provider_added_card_1.UPDATE_MODEL_PROVIDER_CUSTOM_MODEL_LIST,
                payload: provider.provider,
            });
            if (CustomConfigurationModelFixedFields?.__model_type)
                updateModelList(CustomConfigurationModelFixedFields.__model_type);
        }
    }, [eventEmitter, updateModelList, updateModelProviders]);
    return {
        handleRefreshModel,
    };
};
exports.useRefreshModel = useRefreshModel;
const useModelModalHandler = () => {
    const setShowModelModal = (0, modal_context_1.useModalContextSelector)(state => state.setShowModelModal);
    return (provider, configurationMethod, CustomConfigurationModelFixedFields, extra = {}) => {
        setShowModelModal({
            payload: {
                currentProvider: provider,
                currentConfigurationMethod: configurationMethod,
                currentCustomConfigurationModelFixedFields: CustomConfigurationModelFixedFields,
                isModelCredential: extra.isModelCredential,
                credential: extra.credential,
                model: extra.model,
                mode: extra.mode,
            },
            onSaveCallback: (newPayload, formValues) => {
                extra.onUpdate?.(newPayload, formValues);
            },
        });
    };
};
exports.useModelModalHandler = useModelModalHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFXQSx1REFBZ0U7QUFDaEUsaUNBS2M7QUFDZCxzRUFHbUQ7QUFDbkQsMERBQW1FO0FBQ25FLDJEQUF1RTtBQUN2RSx5Q0FBMEM7QUFDMUMsMkRBQWlFO0FBQ2pFLGlFQUErRDtBQUMvRCw2Q0FLeUI7QUFDekIscURBQXNEO0FBQ3RELGlEQUl1QjtBQUN2QiwrREFBK0U7QUFNeEUsTUFBTSxpQ0FBaUMsR0FBZ0MsQ0FDNUUsWUFBWSxFQUNaLFNBQVMsRUFDVCxFQUFFO0lBQ0YsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDdkMsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6RyxNQUFNLFlBQVksR0FBRyxlQUFlLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQy9GLE1BQU0sbUJBQW1CLEdBQUcsZUFBZSxJQUFJLFlBQVksSUFBSTtZQUM3RCxLQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUs7WUFDekIsUUFBUSxFQUFFLGVBQWUsQ0FBQyxRQUFRO1NBQ25DLENBQUE7UUFFRCxPQUFPLG1CQUFtQixDQUFBO0lBQzVCLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBQzdCLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxvQkFBb0IsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBMkIsbUJBQW1CLENBQUMsQ0FBQTtJQUN6RyxNQUFNLHdCQUF3QixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLEtBQW1C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bUMsRUFBRSxZQUFZO2dCQUNuRCxlQUFlLENBQUMsbUNBQW1DLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDckUsQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFBO0lBRXpELE9BQU87UUFDTCxrQkFBa0I7S0FDbkIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQTdCWSxRQUFBLGVBQWUsbUJBNkIzQjtBQUVNLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxFQUFFO0lBQ3ZDLE1BQU0saUJBQWlCLEdBQUcsSUFBQSx1Q0FBdUIsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBRW5GLE9BQU8sQ0FDTCxRQUF1QixFQUN2QixtQkFBNEMsRUFDNUMsbUNBQXlFLEVBQ3pFLFFBTUksRUFBRSxFQUNOLEVBQUU7UUFDRixpQkFBaUIsQ0FBQztZQUNoQixPQUFPLEVBQUU7Z0JBQ1AsZUFBZSxFQUFFLFFBQVE7Z0JBQ3pCLDBCQUEwQixFQUFFLG1CQUFtQjtnQkFDL0MsMENBQTBDLEVBQUUsbUNBQW1DO2dCQUMvRSxpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCO2dCQUMxQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7Z0JBQzVCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztnQkFDbEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2FBQ2pCO1lBQ0QsY0FBYyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFO2dCQUN6QyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO1lBQzFDLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDLENBQUE7QUFDSCxDQUFDLENBQUE7QUE5QlksUUFBQSxvQkFBb0Isd0JBOEJoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgQ3JlZGVudGlhbCxcbiAgQ3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHMsXG4gIEN1c3RvbU1vZGVsLFxuICBEZWZhdWx0TW9kZWwsXG4gIERlZmF1bHRNb2RlbFJlc3BvbnNlLFxuICBNb2RlbCxcbiAgTW9kZWxNb2RhbE1vZGVFbnVtLFxuICBNb2RlbFByb3ZpZGVyLFxuICBNb2RlbFR5cGVFbnVtLFxufSBmcm9tICcuL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IHVzZVF1ZXJ5LCB1c2VRdWVyeUNsaWVudCB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxuICB1c2VFZmZlY3QsXG4gIHVzZU1lbW8sXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIHVzZU1hcmtldHBsYWNlUGx1Z2lucyxcbiAgdXNlTWFya2V0cGxhY2VQbHVnaW5zQnlDb2xsZWN0aW9uSWQsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9tYXJrZXRwbGFjZS9ob29rcydcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7IHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgeyB1c2VMb2NhbGUgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcbmltcG9ydCB7IHVzZU1vZGFsQ29udGV4dFNlbGVjdG9yIH0gZnJvbSAnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VQcm92aWRlckNvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB7XG4gIGZldGNoRGVmYXVsdE1vZGFsLFxuICBmZXRjaE1vZGVsTGlzdCxcbiAgZmV0Y2hNb2RlbFByb3ZpZGVyQ3JlZGVudGlhbHMsXG4gIGdldFBheVVybCxcbn0gZnJvbSAnQC9zZXJ2aWNlL2NvbW1vbidcbmltcG9ydCB7IGNvbW1vblF1ZXJ5S2V5cyB9IGZyb20gJ0Avc2VydmljZS91c2UtY29tbW9uJ1xuaW1wb3J0IHtcbiAgQ29uZmlndXJhdGlvbk1ldGhvZEVudW0sXG4gIEN1c3RvbUNvbmZpZ3VyYXRpb25TdGF0dXNFbnVtLFxuICBNb2RlbFN0YXR1c0VudW0sXG59IGZyb20gJy4vZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHsgVVBEQVRFX01PREVMX1BST1ZJREVSX0NVU1RPTV9NT0RFTF9MSVNUIH0gZnJvbSAnLi9wcm92aWRlci1hZGRlZC1jYXJkJ1xuXG50eXBlIFVzZURlZmF1bHRNb2RlbEFuZE1vZGVsTGlzdCA9IChcbiAgZGVmYXVsdE1vZGVsOiBEZWZhdWx0TW9kZWxSZXNwb25zZSB8IHVuZGVmaW5lZCxcbiAgbW9kZWxMaXN0OiBNb2RlbFtdLFxuKSA9PiBbRGVmYXVsdE1vZGVsIHwgdW5kZWZpbmVkLCAobW9kZWw6IERlZmF1bHRNb2RlbCkgPT4gdm9pZF1cbmV4cG9ydCBjb25zdCB1c2VTeXN0ZW1EZWZhdWx0TW9kZWxBbmRNb2RlbExpc3Q6IFVzZURlZmF1bHRNb2RlbEFuZE1vZGVsTGlzdCA9IChcbiAgZGVmYXVsdE1vZGVsLFxuICBtb2RlbExpc3QsXG4pID0+IHtcbiAgY29uc3QgY3VycmVudERlZmF1bHRNb2RlbCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRQcm92aWRlciA9IG1vZGVsTGlzdC5maW5kKHByb3ZpZGVyID0+IHByb3ZpZGVyLnByb3ZpZGVyID09PSBkZWZhdWx0TW9kZWw/LnByb3ZpZGVyLnByb3ZpZGVyKVxuICAgIGNvbnN0IGN1cnJlbnRNb2RlbCA9IGN1cnJlbnRQcm92aWRlcj8ubW9kZWxzLmZpbmQobW9kZWwgPT4gbW9kZWwubW9kZWwgPT09IGRlZmF1bHRNb2RlbD8ubW9kZWwpXG4gICAgY29uc3QgY3VycmVudERlZmF1bHRNb2RlbCA9IGN1cnJlbnRQcm92aWRlciAmJiBjdXJyZW50TW9kZWwgJiYge1xuICAgICAgbW9kZWw6IGN1cnJlbnRNb2RlbC5tb2RlbCxcbiAgICAgIHByb3ZpZGVyOiBjdXJyZW50UHJvdmlkZXIucHJvdmlkZXIsXG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnREZWZhdWx0TW9kZWxcbiAgfSwgW2RlZmF1bHRNb2RlbCwgbW9kZWxMaXN0XSlcbiAgY29uc3QgW2RlZmF1bHRNb2RlbFN0YXRlLCBzZXREZWZhdWx0TW9kZWxTdGF0ZV0gPSB1c2VTdGF0ZTxEZWZhdWx0TW9kZWwgfCB1bmRlZmluZWQ+KGN1cnJlbnREZWZhdWx0TW9kZWwpXG4gIGNvbnN0IGhhbmRsZURlZmF1bHRNb2RlbENoYW5nZSA9IHVzZUNhbGxiYWNrKChtb2RlbDogRGVmYXVsdE1vZGVsKSA9PiB7XG4gICAgc2V0RGVmYXVsdE1vZGVsU3RhdGUobW9kZWwpXG4gIH0sIFtdKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldERlZmF1bHRNb2RlbFN0YXRlKGN1cnJlbnREZWZhdWx0TW9kZWwpXG4gIH0sIFtjdXJyZW50RGVmYXVsdE1vZGVsXSlcblxuICByZXR1cm4gW2RlZmF1bHRNb2RlbFN0YXRlLCBoYW5kbGVEZWZhdWx0TW9kZWxDaGFuZ2VdXG59XG5cbmV4cG9ydCBjb25zdCB1c2VMYW5ndWFnZSA9ICgpID0+IHtcbiAgY29uc3QgbG9jYWxlID0gdXNlTG9jYWxlKClcbiAgcmV0dXJuIGxvY2FsZS5yZXBsYWNlKCctJywgJ18nKVxufVxuXG5leHBvcnQgY29uc3QgdXNlUHJvdmlkZXJDcmVkZW50aWFsc0FuZExvYWRCYWxhbmNpbmcgPSAoXG4gIHByb3ZpZGVyOiBzdHJpbmcsXG4gIGNvbmZpZ3VyYXRpb25NZXRob2Q6IENvbmZpZ3VyYXRpb25NZXRob2RFbnVtLFxuICBjb25maWd1cmVkPzogYm9vbGVhbixcbiAgY3VycmVudEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzPzogQ3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHMsXG4gIGNyZWRlbnRpYWxJZD86IHN0cmluZyxcbikgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcbiAgY29uc3QgcHJlZGVmaW5lZEVuYWJsZWQgPSBjb25maWd1cmF0aW9uTWV0aG9kID09PSBDb25maWd1cmF0aW9uTWV0aG9kRW51bS5wcmVkZWZpbmVkTW9kZWwgJiYgY29uZmlndXJlZCAmJiAhIWNyZWRlbnRpYWxJZFxuICBjb25zdCBjdXN0b21FbmFibGVkID0gY29uZmlndXJhdGlvbk1ldGhvZCA9PT0gQ29uZmlndXJhdGlvbk1ldGhvZEVudW0uY3VzdG9taXphYmxlTW9kZWwgJiYgISFjdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHMgJiYgISFjcmVkZW50aWFsSWRcblxuICBjb25zdCB7IGRhdGE6IHByZWRlZmluZWRGb3JtU2NoZW1hc1ZhbHVlLCBpc1BlbmRpbmc6IGlzUHJlZGVmaW5lZExvYWRpbmcgfSA9IHVzZVF1ZXJ5KFxuICAgIHtcbiAgICAgIHF1ZXJ5S2V5OiBbJ21vZGVsLXByb3ZpZGVycycsICdjcmVkZW50aWFscycsIHByb3ZpZGVyLCBjcmVkZW50aWFsSWRdLFxuICAgICAgcXVlcnlGbjogKCkgPT4gZmV0Y2hNb2RlbFByb3ZpZGVyQ3JlZGVudGlhbHMoYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWwtcHJvdmlkZXJzLyR7cHJvdmlkZXJ9L2NyZWRlbnRpYWxzJHtjcmVkZW50aWFsSWQgPyBgP2NyZWRlbnRpYWxfaWQ9JHtjcmVkZW50aWFsSWR9YCA6ICcnfWApLFxuICAgICAgZW5hYmxlZDogcHJlZGVmaW5lZEVuYWJsZWQsXG4gICAgfSxcbiAgKVxuICBjb25zdCB7IGRhdGE6IGN1c3RvbUZvcm1TY2hlbWFzVmFsdWUsIGlzUGVuZGluZzogaXNDdXN0b21pemVkTG9hZGluZyB9ID0gdXNlUXVlcnkoXG4gICAge1xuICAgICAgcXVlcnlLZXk6IFsnbW9kZWwtcHJvdmlkZXJzJywgJ21vZGVscycsICdjcmVkZW50aWFscycsIHByb3ZpZGVyLCBjdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHM/Ll9fbW9kZWxfdHlwZSwgY3VycmVudEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzPy5fX21vZGVsX25hbWUsIGNyZWRlbnRpYWxJZF0sXG4gICAgICBxdWVyeUZuOiAoKSA9PiBmZXRjaE1vZGVsUHJvdmlkZXJDcmVkZW50aWFscyhgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vbW9kZWxzL2NyZWRlbnRpYWxzP21vZGVsPSR7Y3VycmVudEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzPy5fX21vZGVsX25hbWV9Jm1vZGVsX3R5cGU9JHtjdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHM/Ll9fbW9kZWxfdHlwZX0ke2NyZWRlbnRpYWxJZCA/IGAmY3JlZGVudGlhbF9pZD0ke2NyZWRlbnRpYWxJZH1gIDogJyd9YCksXG4gICAgICBlbmFibGVkOiBjdXN0b21FbmFibGVkLFxuICAgIH0sXG4gIClcblxuICBjb25zdCBjcmVkZW50aWFscyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBjb25maWd1cmF0aW9uTWV0aG9kID09PSBDb25maWd1cmF0aW9uTWV0aG9kRW51bS5wcmVkZWZpbmVkTW9kZWxcbiAgICAgID8gcHJlZGVmaW5lZEZvcm1TY2hlbWFzVmFsdWU/LmNyZWRlbnRpYWxzXG4gICAgICA6IGN1c3RvbUZvcm1TY2hlbWFzVmFsdWU/LmNyZWRlbnRpYWxzXG4gICAgICAgID8ge1xuICAgICAgICAgICAgLi4uY3VzdG9tRm9ybVNjaGVtYXNWYWx1ZT8uY3JlZGVudGlhbHMsXG4gICAgICAgICAgICAuLi5jdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHMsXG4gICAgICAgICAgfVxuICAgICAgICA6IHVuZGVmaW5lZFxuICB9LCBbXG4gICAgY29uZmlndXJhdGlvbk1ldGhvZCxcbiAgICBjcmVkZW50aWFsSWQsXG4gICAgY3VycmVudEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzLFxuICAgIGN1c3RvbUZvcm1TY2hlbWFzVmFsdWU/LmNyZWRlbnRpYWxzLFxuICAgIHByZWRlZmluZWRGb3JtU2NoZW1hc1ZhbHVlPy5jcmVkZW50aWFscyxcbiAgXSlcblxuICBjb25zdCBtdXRhdGUgPSB1c2VNZW1vKCgpID0+ICgpID0+IHtcbiAgICBpZiAocHJlZGVmaW5lZEVuYWJsZWQpXG4gICAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyh7IHF1ZXJ5S2V5OiBbJ21vZGVsLXByb3ZpZGVycycsICdjcmVkZW50aWFscycsIHByb3ZpZGVyLCBjcmVkZW50aWFsSWRdIH0pXG4gICAgaWYgKGN1c3RvbUVuYWJsZWQpXG4gICAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyh7IHF1ZXJ5S2V5OiBbJ21vZGVsLXByb3ZpZGVycycsICdtb2RlbHMnLCAnY3JlZGVudGlhbHMnLCBwcm92aWRlciwgY3VycmVudEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzPy5fX21vZGVsX3R5cGUsIGN1cnJlbnRDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcz8uX19tb2RlbF9uYW1lLCBjcmVkZW50aWFsSWRdIH0pXG4gIH0sIFtjdXN0b21FbmFibGVkLCBjcmVkZW50aWFsSWQsIGN1cnJlbnRDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcz8uX19tb2RlbF9uYW1lLCBjdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHM/Ll9fbW9kZWxfdHlwZSwgcHJlZGVmaW5lZEVuYWJsZWQsIHByb3ZpZGVyLCBxdWVyeUNsaWVudF0pXG5cbiAgcmV0dXJuIHtcbiAgICBjcmVkZW50aWFscyxcbiAgICBsb2FkQmFsYW5jaW5nOiAoY29uZmlndXJhdGlvbk1ldGhvZCA9PT0gQ29uZmlndXJhdGlvbk1ldGhvZEVudW0ucHJlZGVmaW5lZE1vZGVsXG4gICAgICA/IHByZWRlZmluZWRGb3JtU2NoZW1hc1ZhbHVlXG4gICAgICA6IGN1c3RvbUZvcm1TY2hlbWFzVmFsdWVcbiAgICApPy5sb2FkX2JhbGFuY2luZyxcbiAgICBtdXRhdGUsXG4gICAgaXNMb2FkaW5nOiBpc1ByZWRlZmluZWRMb2FkaW5nIHx8IGlzQ3VzdG9taXplZExvYWRpbmcsXG4gIH1cbiAgLy8gYXMgKFtSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBib29sZWFuIHwgdW5kZWZpbmVkPiB8IHVuZGVmaW5lZCwgTW9kZWxMb2FkQmFsYW5jaW5nQ29uZmlnIHwgdW5kZWZpbmVkXSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZU1vZGVsTGlzdCA9ICh0eXBlOiBNb2RlbFR5cGVFbnVtKSA9PiB7XG4gIGNvbnN0IHsgZGF0YSwgcmVmZXRjaCwgaXNQZW5kaW5nIH0gPSB1c2VRdWVyeSh7XG4gICAgcXVlcnlLZXk6IGNvbW1vblF1ZXJ5S2V5cy5tb2RlbExpc3QodHlwZSksXG4gICAgcXVlcnlGbjogKCkgPT4gZmV0Y2hNb2RlbExpc3QoYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWxzL21vZGVsLXR5cGVzLyR7dHlwZX1gKSxcbiAgfSlcblxuICByZXR1cm4ge1xuICAgIGRhdGE6IGRhdGE/LmRhdGEgfHwgW10sXG4gICAgbXV0YXRlOiByZWZldGNoLFxuICAgIGlzTG9hZGluZzogaXNQZW5kaW5nLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VEZWZhdWx0TW9kZWwgPSAodHlwZTogTW9kZWxUeXBlRW51bSkgPT4ge1xuICBjb25zdCB7IGRhdGEsIHJlZmV0Y2gsIGlzUGVuZGluZyB9ID0gdXNlUXVlcnkoe1xuICAgIHF1ZXJ5S2V5OiBjb21tb25RdWVyeUtleXMuZGVmYXVsdE1vZGVsKHR5cGUpLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGZldGNoRGVmYXVsdE1vZGFsKGAvd29ya3NwYWNlcy9jdXJyZW50L2RlZmF1bHQtbW9kZWw/bW9kZWxfdHlwZT0ke3R5cGV9YCksXG4gIH0pXG5cbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBkYXRhPy5kYXRhLFxuICAgIG11dGF0ZTogcmVmZXRjaCxcbiAgICBpc0xvYWRpbmc6IGlzUGVuZGluZyxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgPSAobW9kZWxMaXN0OiBNb2RlbFtdLCBkZWZhdWx0TW9kZWw/OiBEZWZhdWx0TW9kZWwpID0+IHtcbiAgY29uc3QgY3VycmVudFByb3ZpZGVyID0gbW9kZWxMaXN0LmZpbmQocHJvdmlkZXIgPT4gcHJvdmlkZXIucHJvdmlkZXIgPT09IGRlZmF1bHRNb2RlbD8ucHJvdmlkZXIpXG4gIGNvbnN0IGN1cnJlbnRNb2RlbCA9IGN1cnJlbnRQcm92aWRlcj8ubW9kZWxzLmZpbmQobW9kZWwgPT4gbW9kZWwubW9kZWwgPT09IGRlZmF1bHRNb2RlbD8ubW9kZWwpXG5cbiAgcmV0dXJuIHtcbiAgICBjdXJyZW50UHJvdmlkZXIsXG4gICAgY3VycmVudE1vZGVsLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VUZXh0R2VuZXJhdGlvbkN1cnJlbnRQcm92aWRlckFuZE1vZGVsQW5kTW9kZWxMaXN0ID0gKGRlZmF1bHRNb2RlbD86IERlZmF1bHRNb2RlbCkgPT4ge1xuICBjb25zdCB7IHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0IH0gPSB1c2VQcm92aWRlckNvbnRleHQoKVxuICBjb25zdCBhY3RpdmVUZXh0R2VuZXJhdGlvbk1vZGVsTGlzdCA9IHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0LmZpbHRlcihtb2RlbCA9PiBtb2RlbC5zdGF0dXMgPT09IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUpXG4gIGNvbnN0IHtcbiAgICBjdXJyZW50UHJvdmlkZXIsXG4gICAgY3VycmVudE1vZGVsLFxuICB9ID0gdXNlQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwodGV4dEdlbmVyYXRpb25Nb2RlbExpc3QsIGRlZmF1bHRNb2RlbClcblxuICByZXR1cm4ge1xuICAgIGN1cnJlbnRQcm92aWRlcixcbiAgICBjdXJyZW50TW9kZWwsXG4gICAgdGV4dEdlbmVyYXRpb25Nb2RlbExpc3QsXG4gICAgYWN0aXZlVGV4dEdlbmVyYXRpb25Nb2RlbExpc3QsXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbCA9ICh0eXBlOiBNb2RlbFR5cGVFbnVtKSA9PiB7XG4gIGNvbnN0IHsgZGF0YTogbW9kZWxMaXN0IH0gPSB1c2VNb2RlbExpc3QodHlwZSlcbiAgY29uc3QgeyBkYXRhOiBkZWZhdWx0TW9kZWwgfSA9IHVzZURlZmF1bHRNb2RlbCh0eXBlKVxuXG4gIHJldHVybiB7XG4gICAgbW9kZWxMaXN0LFxuICAgIGRlZmF1bHRNb2RlbCxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgPSAodHlwZTogTW9kZWxUeXBlRW51bSkgPT4ge1xuICBjb25zdCB7IG1vZGVsTGlzdCwgZGVmYXVsdE1vZGVsIH0gPSB1c2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWwodHlwZSlcbiAgY29uc3QgeyBjdXJyZW50UHJvdmlkZXIsIGN1cnJlbnRNb2RlbCB9ID0gdXNlQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwoXG4gICAgbW9kZWxMaXN0LFxuICAgIHsgcHJvdmlkZXI6IGRlZmF1bHRNb2RlbD8ucHJvdmlkZXIucHJvdmlkZXIgfHwgJycsIG1vZGVsOiBkZWZhdWx0TW9kZWw/Lm1vZGVsIHx8ICcnIH0sXG4gIClcblxuICByZXR1cm4ge1xuICAgIG1vZGVsTGlzdCxcbiAgICBkZWZhdWx0TW9kZWwsXG4gICAgY3VycmVudFByb3ZpZGVyLFxuICAgIGN1cnJlbnRNb2RlbCxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlVXBkYXRlTW9kZWxMaXN0ID0gKCkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcblxuICBjb25zdCB1cGRhdGVNb2RlbExpc3QgPSB1c2VDYWxsYmFjaygodHlwZTogTW9kZWxUeXBlRW51bSkgPT4ge1xuICAgIHF1ZXJ5Q2xpZW50LmludmFsaWRhdGVRdWVyaWVzKHsgcXVlcnlLZXk6IGNvbW1vblF1ZXJ5S2V5cy5tb2RlbExpc3QodHlwZSkgfSlcbiAgfSwgW3F1ZXJ5Q2xpZW50XSlcblxuICByZXR1cm4gdXBkYXRlTW9kZWxMaXN0XG59XG5cbmV4cG9ydCBjb25zdCB1c2VBbnRocm9waWNCdXlRdW90YSA9ICgpID0+IHtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgY29uc3QgaGFuZGxlR2V0UGF5VXJsID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmIChsb2FkaW5nKVxuICAgICAgcmV0dXJuXG5cbiAgICBzZXRMb2FkaW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGdldFBheVVybCgnL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvYW50aHJvcGljL2NoZWNrb3V0LXVybCcpXG5cbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVzLnVybFxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGhhbmRsZUdldFBheVVybFxufVxuXG5leHBvcnQgY29uc3QgdXNlVXBkYXRlTW9kZWxQcm92aWRlcnMgPSAoKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gdXNlUXVlcnlDbGllbnQoKVxuXG4gIGNvbnN0IHVwZGF0ZU1vZGVsUHJvdmlkZXJzID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHF1ZXJ5Q2xpZW50LmludmFsaWRhdGVRdWVyaWVzKHsgcXVlcnlLZXk6IGNvbW1vblF1ZXJ5S2V5cy5tb2RlbFByb3ZpZGVycyB9KVxuICB9LCBbcXVlcnlDbGllbnRdKVxuXG4gIHJldHVybiB1cGRhdGVNb2RlbFByb3ZpZGVyc1xufVxuXG5leHBvcnQgY29uc3QgdXNlTWFya2V0cGxhY2VBbGxQbHVnaW5zID0gKHByb3ZpZGVyczogTW9kZWxQcm92aWRlcltdLCBzZWFyY2hUZXh0OiBzdHJpbmcpID0+IHtcbiAgY29uc3QgZXhjbHVkZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBwcm92aWRlcnMubWFwKHByb3ZpZGVyID0+IHByb3ZpZGVyLnByb3ZpZGVyLnJlcGxhY2UoLyguKylcXC8oW14vXSspJC8sICckMScpKVxuICB9LCBbcHJvdmlkZXJzXSlcbiAgY29uc3Qge1xuICAgIHBsdWdpbnM6IGNvbGxlY3Rpb25QbHVnaW5zID0gW10sXG4gICAgaXNMb2FkaW5nOiBpc0NvbGxlY3Rpb25Mb2FkaW5nLFxuICB9ID0gdXNlTWFya2V0cGxhY2VQbHVnaW5zQnlDb2xsZWN0aW9uSWQoJ19fbW9kZWwtc2V0dGluZ3MtcGlubmVkLW1vZGVscycpXG4gIGNvbnN0IHtcbiAgICBwbHVnaW5zLFxuICAgIHF1ZXJ5UGx1Z2lucyxcbiAgICBxdWVyeVBsdWdpbnNXaXRoRGVib3VuY2VkLFxuICAgIGlzTG9hZGluZzogaXNQbHVnaW5zTG9hZGluZyxcbiAgfSA9IHVzZU1hcmtldHBsYWNlUGx1Z2lucygpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2VhcmNoVGV4dCkge1xuICAgICAgcXVlcnlQbHVnaW5zV2l0aERlYm91bmNlZCh7XG4gICAgICAgIHF1ZXJ5OiBzZWFyY2hUZXh0LFxuICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLm1vZGVsLFxuICAgICAgICBleGNsdWRlLFxuICAgICAgICB0eXBlOiAncGx1Z2luJyxcbiAgICAgICAgc29ydEJ5OiAnaW5zdGFsbF9jb3VudCcsXG4gICAgICAgIHNvcnRPcmRlcjogJ0RFU0MnLFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBxdWVyeVBsdWdpbnMoe1xuICAgICAgICBxdWVyeTogJycsXG4gICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0ubW9kZWwsXG4gICAgICAgIHR5cGU6ICdwbHVnaW4nLFxuICAgICAgICBwYWdlU2l6ZTogMTAwMCxcbiAgICAgICAgZXhjbHVkZSxcbiAgICAgICAgc29ydEJ5OiAnaW5zdGFsbF9jb3VudCcsXG4gICAgICAgIHNvcnRPcmRlcjogJ0RFU0MnLFxuICAgICAgfSlcbiAgICB9XG4gIH0sIFtxdWVyeVBsdWdpbnMsIHF1ZXJ5UGx1Z2luc1dpdGhEZWJvdW5jZWQsIHNlYXJjaFRleHQsIGV4Y2x1ZGVdKVxuXG4gIGNvbnN0IGFsbFBsdWdpbnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBhbGxQbHVnaW5zID0gY29sbGVjdGlvblBsdWdpbnMuZmlsdGVyKHBsdWdpbiA9PiAhZXhjbHVkZS5pbmNsdWRlcyhwbHVnaW4ucGx1Z2luX2lkKSlcblxuICAgIGlmIChwbHVnaW5zPy5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwbHVnaW4gPSBwbHVnaW5zW2ldXG5cbiAgICAgICAgaWYgKHBsdWdpbi50eXBlICE9PSAnYnVuZGxlJyAmJiAhYWxsUGx1Z2lucy5maW5kKHAgPT4gcC5wbHVnaW5faWQgPT09IHBsdWdpbi5wbHVnaW5faWQpKVxuICAgICAgICAgIGFsbFBsdWdpbnMucHVzaChwbHVnaW4pXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbFBsdWdpbnNcbiAgfSwgW3BsdWdpbnMsIGNvbGxlY3Rpb25QbHVnaW5zLCBleGNsdWRlXSlcblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IGFsbFBsdWdpbnMsXG4gICAgaXNMb2FkaW5nOiBpc0NvbGxlY3Rpb25Mb2FkaW5nIHx8IGlzUGx1Z2luc0xvYWRpbmcsXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZVJlZnJlc2hNb2RlbCA9ICgpID0+IHtcbiAgY29uc3QgeyBldmVudEVtaXR0ZXIgfSA9IHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0KClcbiAgY29uc3QgdXBkYXRlTW9kZWxQcm92aWRlcnMgPSB1c2VVcGRhdGVNb2RlbFByb3ZpZGVycygpXG4gIGNvbnN0IHVwZGF0ZU1vZGVsTGlzdCA9IHVzZVVwZGF0ZU1vZGVsTGlzdCgpXG4gIGNvbnN0IGhhbmRsZVJlZnJlc2hNb2RlbCA9IHVzZUNhbGxiYWNrKChcbiAgICBwcm92aWRlcjogTW9kZWxQcm92aWRlcixcbiAgICBDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcz86IEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzLFxuICAgIHJlZnJlc2hNb2RlbExpc3Q/OiBib29sZWFuLFxuICApID0+IHtcbiAgICB1cGRhdGVNb2RlbFByb3ZpZGVycygpXG5cbiAgICBwcm92aWRlci5zdXBwb3J0ZWRfbW9kZWxfdHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgdXBkYXRlTW9kZWxMaXN0KHR5cGUpXG4gICAgfSlcblxuICAgIGlmIChyZWZyZXNoTW9kZWxMaXN0ICYmIHByb3ZpZGVyLmN1c3RvbV9jb25maWd1cmF0aW9uLnN0YXR1cyA9PT0gQ3VzdG9tQ29uZmlndXJhdGlvblN0YXR1c0VudW0uYWN0aXZlKSB7XG4gICAgICBldmVudEVtaXR0ZXI/LmVtaXQoe1xuICAgICAgICB0eXBlOiBVUERBVEVfTU9ERUxfUFJPVklERVJfQ1VTVE9NX01PREVMX0xJU1QsXG4gICAgICAgIHBheWxvYWQ6IHByb3ZpZGVyLnByb3ZpZGVyLFxuICAgICAgfSBhcyBhbnkpXG5cbiAgICAgIGlmIChDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcz8uX19tb2RlbF90eXBlKVxuICAgICAgICB1cGRhdGVNb2RlbExpc3QoQ3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHMuX19tb2RlbF90eXBlKVxuICAgIH1cbiAgfSwgW2V2ZW50RW1pdHRlciwgdXBkYXRlTW9kZWxMaXN0LCB1cGRhdGVNb2RlbFByb3ZpZGVyc10pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVSZWZyZXNoTW9kZWwsXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZU1vZGVsTW9kYWxIYW5kbGVyID0gKCkgPT4ge1xuICBjb25zdCBzZXRTaG93TW9kZWxNb2RhbCA9IHVzZU1vZGFsQ29udGV4dFNlbGVjdG9yKHN0YXRlID0+IHN0YXRlLnNldFNob3dNb2RlbE1vZGFsKVxuXG4gIHJldHVybiAoXG4gICAgcHJvdmlkZXI6IE1vZGVsUHJvdmlkZXIsXG4gICAgY29uZmlndXJhdGlvbk1ldGhvZDogQ29uZmlndXJhdGlvbk1ldGhvZEVudW0sXG4gICAgQ3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHM/OiBDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcyxcbiAgICBleHRyYToge1xuICAgICAgaXNNb2RlbENyZWRlbnRpYWw/OiBib29sZWFuXG4gICAgICBjcmVkZW50aWFsPzogQ3JlZGVudGlhbFxuICAgICAgbW9kZWw/OiBDdXN0b21Nb2RlbFxuICAgICAgb25VcGRhdGU/OiAobmV3UGF5bG9hZDogYW55LCBmb3JtVmFsdWVzPzogUmVjb3JkPHN0cmluZywgYW55PikgPT4gdm9pZFxuICAgICAgbW9kZT86IE1vZGVsTW9kYWxNb2RlRW51bVxuICAgIH0gPSB7fSxcbiAgKSA9PiB7XG4gICAgc2V0U2hvd01vZGVsTW9kYWwoe1xuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBjdXJyZW50UHJvdmlkZXI6IHByb3ZpZGVyLFxuICAgICAgICBjdXJyZW50Q29uZmlndXJhdGlvbk1ldGhvZDogY29uZmlndXJhdGlvbk1ldGhvZCxcbiAgICAgICAgY3VycmVudEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzOiBDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcyxcbiAgICAgICAgaXNNb2RlbENyZWRlbnRpYWw6IGV4dHJhLmlzTW9kZWxDcmVkZW50aWFsLFxuICAgICAgICBjcmVkZW50aWFsOiBleHRyYS5jcmVkZW50aWFsLFxuICAgICAgICBtb2RlbDogZXh0cmEubW9kZWwsXG4gICAgICAgIG1vZGU6IGV4dHJhLm1vZGUsXG4gICAgICB9LFxuICAgICAgb25TYXZlQ2FsbGJhY2s6IChuZXdQYXlsb2FkLCBmb3JtVmFsdWVzKSA9PiB7XG4gICAgICAgIGV4dHJhLm9uVXBkYXRlPy4obmV3UGF5bG9hZCwgZm9ybVZhbHVlcylcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxufVxuIl19