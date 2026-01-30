"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderContextProvider = exports.useProviderContextSelector = exports.useProviderContext = exports.baseProviderContextValue = void 0;
const react_query_1 = require("@tanstack/react-query");
const dayjs_1 = require("dayjs");
const function_1 = require("es-toolkit/function");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const toast_1 = require("@/app/components/base/toast");
const utils_1 = require("@/app/components/base/zendesk/utils");
const config_1 = require("@/app/components/billing/config");
const utils_2 = require("@/app/components/billing/utils");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const config_2 = require("@/config");
const billing_1 = require("@/service/billing");
const use_common_1 = require("@/service/use-common");
const use_education_1 = require("@/service/use-education");
exports.baseProviderContextValue = {
    modelProviders: [],
    refreshModelProviders: function_1.noop,
    textGenerationModelList: [],
    supportRetrievalMethods: [],
    isAPIKeySet: true,
    plan: config_1.defaultPlan,
    isFetchedPlan: false,
    enableBilling: false,
    onPlanInfoChanged: function_1.noop,
    enableReplaceWebAppLogo: false,
    modelLoadBalancingEnabled: false,
    datasetOperatorEnabled: false,
    enableEducationPlan: false,
    isEducationWorkspace: false,
    isEducationAccount: false,
    allowRefreshEducationVerify: false,
    educationAccountExpireAt: null,
    isLoadingEducationAccountInfo: false,
    isFetchingEducationAccountInfo: false,
    webappCopyrightEnabled: false,
    licenseLimit: {
        workspace_members: {
            size: 0,
            limit: 0,
        },
    },
    refreshLicenseLimit: function_1.noop,
    isAllowTransferWorkspace: false,
    isAllowPublishAsCustomKnowledgePipelineTemplate: false,
};
const ProviderContext = (0, use_context_selector_1.createContext)(exports.baseProviderContextValue);
const useProviderContext = () => (0, use_context_selector_1.useContext)(ProviderContext);
exports.useProviderContext = useProviderContext;
// Adding a dangling comma to avoid the generic parsing issue in tsx, see:
// https://github.com/microsoft/TypeScript/issues/15713
const useProviderContextSelector = (selector) => (0, use_context_selector_1.useContextSelector)(ProviderContext, selector);
exports.useProviderContextSelector = useProviderContextSelector;
const ProviderContextProvider = ({ children, }) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: providersData } = (0, use_common_1.useModelProviders)();
    const { data: textGenerationModelList } = (0, use_common_1.useModelListByType)(declarations_1.ModelTypeEnum.textGeneration);
    const { data: supportRetrievalMethods } = (0, use_common_1.useSupportRetrievalMethods)();
    const [plan, setPlan] = (0, react_1.useState)(config_1.defaultPlan);
    const [isFetchedPlan, setIsFetchedPlan] = (0, react_1.useState)(false);
    const [enableBilling, setEnableBilling] = (0, react_1.useState)(true);
    const [enableReplaceWebAppLogo, setEnableReplaceWebAppLogo] = (0, react_1.useState)(false);
    const [modelLoadBalancingEnabled, setModelLoadBalancingEnabled] = (0, react_1.useState)(false);
    const [datasetOperatorEnabled, setDatasetOperatorEnabled] = (0, react_1.useState)(false);
    const [webappCopyrightEnabled, setWebappCopyrightEnabled] = (0, react_1.useState)(false);
    const [licenseLimit, setLicenseLimit] = (0, react_1.useState)({
        workspace_members: {
            size: 0,
            limit: 0,
        },
    });
    const [enableEducationPlan, setEnableEducationPlan] = (0, react_1.useState)(false);
    const [isEducationWorkspace, setIsEducationWorkspace] = (0, react_1.useState)(false);
    const { data: educationAccountInfo, isLoading: isLoadingEducationAccountInfo, isFetching: isFetchingEducationAccountInfo, isFetchedAfterMount: isEducationDataFetchedAfterMount } = (0, use_education_1.useEducationStatus)(!enableEducationPlan);
    const [isAllowTransferWorkspace, setIsAllowTransferWorkspace] = (0, react_1.useState)(false);
    const [isAllowPublishAsCustomKnowledgePipelineTemplate, setIsAllowPublishAsCustomKnowledgePipelineTemplate] = (0, react_1.useState)(false);
    const refreshModelProviders = () => {
        queryClient.invalidateQueries({ queryKey: ['common', 'model-providers'] });
    };
    const fetchPlan = async () => {
        try {
            const data = await (0, billing_1.fetchCurrentPlanInfo)();
            if (!data) {
                console.error('Failed to fetch plan info: data is undefined');
                return;
            }
            // set default value to avoid undefined error
            setEnableBilling(data.billing?.enabled ?? false);
            setEnableEducationPlan(data.education?.enabled ?? false);
            setIsEducationWorkspace(data.education?.activated ?? false);
            setEnableReplaceWebAppLogo(data.can_replace_logo ?? false);
            if (data.billing?.enabled) {
                setPlan((0, utils_2.parseCurrentPlan)(data));
                setIsFetchedPlan(true);
            }
            if (data.model_load_balancing_enabled)
                setModelLoadBalancingEnabled(true);
            if (data.dataset_operator_enabled)
                setDatasetOperatorEnabled(true);
            if (data.webapp_copyright_enabled)
                setWebappCopyrightEnabled(true);
            if (data.workspace_members)
                setLicenseLimit({ workspace_members: data.workspace_members });
            if (data.is_allow_transfer_workspace)
                setIsAllowTransferWorkspace(data.is_allow_transfer_workspace);
            if (data.knowledge_pipeline?.publish_enabled)
                setIsAllowPublishAsCustomKnowledgePipelineTemplate(data.knowledge_pipeline?.publish_enabled);
        }
        catch (error) {
            console.error('Failed to fetch plan info:', error);
            // set default value to avoid undefined error
            setEnableBilling(false);
            setEnableEducationPlan(false);
            setIsEducationWorkspace(false);
            setEnableReplaceWebAppLogo(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchPlan();
    }, []);
    // #region Zendesk conversation fields
    (0, react_1.useEffect)(() => {
        if (config_2.ZENDESK_FIELD_IDS.PLAN && plan.type) {
            (0, utils_1.setZendeskConversationFields)([{
                    id: config_2.ZENDESK_FIELD_IDS.PLAN,
                    value: `${plan.type}-plan`,
                }]);
        }
    }, [plan.type]);
    // #endregion Zendesk conversation fields
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        if (localStorage.getItem('anthropic_quota_notice') === 'true')
            return;
        if ((0, dayjs_1.default)().isAfter((0, dayjs_1.default)('2025-03-17')))
            return;
        if (providersData?.data && providersData.data.length > 0) {
            const anthropic = providersData.data.find(provider => provider.provider === 'anthropic');
            if (anthropic && anthropic.system_configuration.current_quota_type === declarations_1.CurrentSystemQuotaTypeEnum.trial) {
                const quota = anthropic.system_configuration.quota_configurations.find(item => item.quota_type === anthropic.system_configuration.current_quota_type);
                if (quota && quota.is_valid && quota.quota_used < quota.quota_limit) {
                    toast_1.default.notify({
                        type: 'info',
                        message: t('provider.anthropicHosted.trialQuotaTip', { ns: 'common' }),
                        duration: 60000,
                        onClose: () => {
                            localStorage.setItem('anthropic_quota_notice', 'true');
                        },
                    });
                }
            }
        }
    }, [providersData, t]);
    return (<ProviderContext.Provider value={{
            modelProviders: providersData?.data || [],
            refreshModelProviders,
            textGenerationModelList: textGenerationModelList?.data || [],
            isAPIKeySet: !!textGenerationModelList?.data?.some(model => model.status === declarations_1.ModelStatusEnum.active),
            supportRetrievalMethods: supportRetrievalMethods?.retrieval_method || [],
            plan,
            isFetchedPlan,
            enableBilling,
            onPlanInfoChanged: fetchPlan,
            enableReplaceWebAppLogo,
            modelLoadBalancingEnabled,
            datasetOperatorEnabled,
            enableEducationPlan,
            isEducationWorkspace,
            isEducationAccount: isEducationDataFetchedAfterMount ? (educationAccountInfo?.is_student ?? false) : false,
            allowRefreshEducationVerify: isEducationDataFetchedAfterMount ? (educationAccountInfo?.allow_refresh ?? false) : false,
            educationAccountExpireAt: isEducationDataFetchedAfterMount ? (educationAccountInfo?.expire_at ?? null) : null,
            isLoadingEducationAccountInfo,
            isFetchingEducationAccountInfo,
            webappCopyrightEnabled,
            licenseLimit,
            refreshLicenseLimit: fetchPlan,
            isAllowTransferWorkspace,
            isAllowPublishAsCustomKnowledgePipelineTemplate,
        }}>
      {children}
    </ProviderContext.Provider>);
};
exports.ProviderContextProvider = ProviderContextProvider;
exports.default = ProviderContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXItY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb3ZpZGVyLWNvbnRleHQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7OztBQUtaLHVEQUFzRDtBQUN0RCxpQ0FBeUI7QUFDekIsa0RBQTBDO0FBQzFDLGlDQUEyQztBQUMzQyxpREFBOEM7QUFDOUMsK0RBQW9GO0FBQ3BGLHVEQUErQztBQUMvQywrREFBa0Y7QUFDbEYsNERBQTZEO0FBQzdELDBEQUFpRTtBQUNqRSwyR0FJaUY7QUFDakYscUNBQTRDO0FBQzVDLCtDQUF3RDtBQUN4RCxxREFJNkI7QUFDN0IsMkRBRWdDO0FBdUNuQixRQUFBLHdCQUF3QixHQUF5QjtJQUM1RCxjQUFjLEVBQUUsRUFBRTtJQUNsQixxQkFBcUIsRUFBRSxlQUFJO0lBQzNCLHVCQUF1QixFQUFFLEVBQUU7SUFDM0IsdUJBQXVCLEVBQUUsRUFBRTtJQUMzQixXQUFXLEVBQUUsSUFBSTtJQUNqQixJQUFJLEVBQUUsb0JBQVc7SUFDakIsYUFBYSxFQUFFLEtBQUs7SUFDcEIsYUFBYSxFQUFFLEtBQUs7SUFDcEIsaUJBQWlCLEVBQUUsZUFBSTtJQUN2Qix1QkFBdUIsRUFBRSxLQUFLO0lBQzlCLHlCQUF5QixFQUFFLEtBQUs7SUFDaEMsc0JBQXNCLEVBQUUsS0FBSztJQUM3QixtQkFBbUIsRUFBRSxLQUFLO0lBQzFCLG9CQUFvQixFQUFFLEtBQUs7SUFDM0Isa0JBQWtCLEVBQUUsS0FBSztJQUN6QiwyQkFBMkIsRUFBRSxLQUFLO0lBQ2xDLHdCQUF3QixFQUFFLElBQUk7SUFDOUIsNkJBQTZCLEVBQUUsS0FBSztJQUNwQyw4QkFBOEIsRUFBRSxLQUFLO0lBQ3JDLHNCQUFzQixFQUFFLEtBQUs7SUFDN0IsWUFBWSxFQUFFO1FBQ1osaUJBQWlCLEVBQUU7WUFDakIsSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUUsQ0FBQztTQUNUO0tBQ0Y7SUFDRCxtQkFBbUIs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QjtZQUM5QixzQkFBc0I7WUFDdEIsWUFBWTtZQUNaLG1CQUFtQixFQUFFLFNBQVM7WUFDOUIsd0JBQXdCO1lBQ3hCLCtDQUErQztTQUNoRCxDQUFDLENBRUE7TUFBQSxDQUFDLFFBQVEsQ0FDWDtJQUFBLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUM1QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBakpZLFFBQUEsdUJBQXVCLDJCQWlKbkM7QUFFRCxrQkFBZSxlQUFlLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcblxuaW1wb3J0IHR5cGUgeyBQbGFuLCBVc2FnZVBsYW5JbmZvLCBVc2FnZVJlc2V0SW5mbyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmlsbGluZy90eXBlJ1xuaW1wb3J0IHR5cGUgeyBNb2RlbCwgTW9kZWxQcm92aWRlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB0eXBlIHsgUkVUUklFVkVfTUVUSE9EIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyB1c2VRdWVyeUNsaWVudCB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdlcy10b29sa2l0L2Z1bmN0aW9uJ1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlQ29udGV4dFNlbGVjdG9yIH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgc2V0WmVuZGVza0NvbnZlcnNhdGlvbkZpZWxkcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS96ZW5kZXNrL3V0aWxzJ1xuaW1wb3J0IHsgZGVmYXVsdFBsYW4gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2JpbGxpbmcvY29uZmlnJ1xuaW1wb3J0IHsgcGFyc2VDdXJyZW50UGxhbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmlsbGluZy91dGlscydcbmltcG9ydCB7XG4gIEN1cnJlbnRTeXN0ZW1RdW90YVR5cGVFbnVtLFxuICBNb2RlbFN0YXR1c0VudW0sXG4gIE1vZGVsVHlwZUVudW0sXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IFpFTkRFU0tfRklFTERfSURTIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyBmZXRjaEN1cnJlbnRQbGFuSW5mbyB9IGZyb20gJ0Avc2VydmljZS9iaWxsaW5nJ1xuaW1wb3J0IHtcbiAgdXNlTW9kZWxMaXN0QnlUeXBlLFxuICB1c2VNb2RlbFByb3ZpZGVycyxcbiAgdXNlU3VwcG9ydFJldHJpZXZhbE1ldGhvZHMsXG59IGZyb20gJ0Avc2VydmljZS91c2UtY29tbW9uJ1xuaW1wb3J0IHtcbiAgdXNlRWR1Y2F0aW9uU3RhdHVzLFxufSBmcm9tICdAL3NlcnZpY2UvdXNlLWVkdWNhdGlvbidcblxuZXhwb3J0IHR5cGUgUHJvdmlkZXJDb250ZXh0U3RhdGUgPSB7XG4gIG1vZGVsUHJvdmlkZXJzOiBNb2RlbFByb3ZpZGVyW11cbiAgcmVmcmVzaE1vZGVsUHJvdmlkZXJzOiAoKSA9PiB2b2lkXG4gIHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0OiBNb2RlbFtdXG4gIHN1cHBvcnRSZXRyaWV2YWxNZXRob2RzOiBSRVRSSUVWRV9NRVRIT0RbXVxuICBpc0FQSUtleVNldDogYm9vbGVhblxuICBwbGFuOiB7XG4gICAgdHlwZTogUGxhblxuICAgIHVzYWdlOiBVc2FnZVBsYW5JbmZvXG4gICAgdG90YWw6IFVzYWdlUGxhbkluZm9cbiAgICByZXNldDogVXNhZ2VSZXNldEluZm9cbiAgfVxuICBpc0ZldGNoZWRQbGFuOiBib29sZWFuXG4gIGVuYWJsZUJpbGxpbmc6IGJvb2xlYW5cbiAgb25QbGFuSW5mb0NoYW5nZWQ6ICgpID0+IHZvaWRcbiAgZW5hYmxlUmVwbGFjZVdlYkFwcExvZ286IGJvb2xlYW5cbiAgbW9kZWxMb2FkQmFsYW5jaW5nRW5hYmxlZDogYm9vbGVhblxuICBkYXRhc2V0T3BlcmF0b3JFbmFibGVkOiBib29sZWFuXG4gIGVuYWJsZUVkdWNhdGlvblBsYW46IGJvb2xlYW5cbiAgaXNFZHVjYXRpb25Xb3Jrc3BhY2U6IGJvb2xlYW5cbiAgaXNFZHVjYXRpb25BY2NvdW50OiBib29sZWFuXG4gIGFsbG93UmVmcmVzaEVkdWNhdGlvblZlcmlmeTogYm9vbGVhblxuICBlZHVjYXRpb25BY2NvdW50RXhwaXJlQXQ6IG51bWJlciB8IG51bGxcbiAgaXNMb2FkaW5nRWR1Y2F0aW9uQWNjb3VudEluZm86IGJvb2xlYW5cbiAgaXNGZXRjaGluZ0VkdWNhdGlvbkFjY291bnRJbmZvOiBib29sZWFuXG4gIHdlYmFwcENvcHlyaWdodEVuYWJsZWQ6IGJvb2xlYW5cbiAgbGljZW5zZUxpbWl0OiB7XG4gICAgd29ya3NwYWNlX21lbWJlcnM6IHtcbiAgICAgIHNpemU6IG51bWJlclxuICAgICAgbGltaXQ6IG51bWJlclxuICAgIH1cbiAgfVxuICByZWZyZXNoTGljZW5zZUxpbWl0OiAoKSA9PiB2b2lkXG4gIGlzQWxsb3dUcmFuc2ZlcldvcmtzcGFjZTogYm9vbGVhblxuICBpc0FsbG93UHVibGlzaEFzQ3VzdG9tS25vd2xlZGdlUGlwZWxpbmVUZW1wbGF0ZTogYm9vbGVhblxufVxuXG5leHBvcnQgY29uc3QgYmFzZVByb3ZpZGVyQ29udGV4dFZhbHVlOiBQcm92aWRlckNvbnRleHRTdGF0ZSA9IHtcbiAgbW9kZWxQcm92aWRlcnM6IFtdLFxuICByZWZyZXNoTW9kZWxQcm92aWRlcnM6IG5vb3AsXG4gIHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0OiBbXSxcbiAgc3VwcG9ydFJldHJpZXZhbE1ldGhvZHM6IFtdLFxuICBpc0FQSUtleVNldDogdHJ1ZSxcbiAgcGxhbjogZGVmYXVsdFBsYW4sXG4gIGlzRmV0Y2hlZFBsYW46IGZhbHNlLFxuICBlbmFibGVCaWxsaW5nOiBmYWxzZSxcbiAgb25QbGFuSW5mb0NoYW5nZWQ6IG5vb3AsXG4gIGVuYWJsZVJlcGxhY2VXZWJBcHBMb2dvOiBmYWxzZSxcbiAgbW9kZWxMb2FkQmFsYW5jaW5nRW5hYmxlZDogZmFsc2UsXG4gIGRhdGFzZXRPcGVyYXRvckVuYWJsZWQ6IGZhbHNlLFxuICBlbmFibGVFZHVjYXRpb25QbGFuOiBmYWxzZSxcbiAgaXNFZHVjYXRpb25Xb3Jrc3BhY2U6IGZhbHNlLFxuICBpc0VkdWNhdGlvbkFjY291bnQ6IGZhbHNlLFxuICBhbGxvd1JlZnJlc2hFZHVjYXRpb25WZXJpZnk6IGZhbHNlLFxuICBlZHVjYXRpb25BY2NvdW50RXhwaXJlQXQ6IG51bGwsXG4gIGlzTG9hZGluZ0VkdWNhdGlvbkFjY291bnRJbmZvOiBmYWxzZSxcbiAgaXNGZXRjaGluZ0VkdWNhdGlvbkFjY291bnRJbmZvOiBmYWxzZSxcbiAgd2ViYXBwQ29weXJpZ2h0RW5hYmxlZDogZmFsc2UsXG4gIGxpY2Vuc2VMaW1pdDoge1xuICAgIHdvcmtzcGFjZV9tZW1iZXJzOiB7XG4gICAgICBzaXplOiAwLFxuICAgICAgbGltaXQ6IDAsXG4gICAgfSxcbiAgfSxcbiAgcmVmcmVzaExpY2Vuc2VMaW1pdDogbm9vcCxcbiAgaXNBbGxvd1RyYW5zZmVyV29ya3NwYWNlOiBmYWxzZSxcbiAgaXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGU6IGZhbHNlLFxufVxuXG5jb25zdCBQcm92aWRlckNvbnRleHQgPSBjcmVhdGVDb250ZXh0PFByb3ZpZGVyQ29udGV4dFN0YXRlPihiYXNlUHJvdmlkZXJDb250ZXh0VmFsdWUpXG5cbmV4cG9ydCBjb25zdCB1c2VQcm92aWRlckNvbnRleHQgPSAoKSA9PiB1c2VDb250ZXh0KFByb3ZpZGVyQ29udGV4dClcblxuLy8gQWRkaW5nIGEgZGFuZ2xpbmcgY29tbWEgdG8gYXZvaWQgdGhlIGdlbmVyaWMgcGFyc2luZyBpc3N1ZSBpbiB0c3gsIHNlZTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTU3MTNcbmV4cG9ydCBjb25zdCB1c2VQcm92aWRlckNvbnRleHRTZWxlY3RvciA9IDxULD4oc2VsZWN0b3I6IChzdGF0ZTogUHJvdmlkZXJDb250ZXh0U3RhdGUpID0+IFQpOiBUID0+XG4gIHVzZUNvbnRleHRTZWxlY3RvcihQcm92aWRlckNvbnRleHQsIHNlbGVjdG9yKVxuXG50eXBlIFByb3ZpZGVyQ29udGV4dFByb3ZpZGVyUHJvcHMgPSB7XG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbn1cbmV4cG9ydCBjb25zdCBQcm92aWRlckNvbnRleHRQcm92aWRlciA9ICh7XG4gIGNoaWxkcmVuLFxufTogUHJvdmlkZXJDb250ZXh0UHJvdmlkZXJQcm9wcykgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcbiAgY29uc3QgeyBkYXRhOiBwcm92aWRlcnNEYXRhIH0gPSB1c2VNb2RlbFByb3ZpZGVycygpXG4gIGNvbnN0IHsgZGF0YTogdGV4dEdlbmVyYXRpb25Nb2RlbExpc3QgfSA9IHVzZU1vZGVsTGlzdEJ5VHlwZShNb2RlbFR5cGVFbnVtLnRleHRHZW5lcmF0aW9uKVxuICBjb25zdCB7IGRhdGE6IHN1cHBvcnRSZXRyaWV2YWxNZXRob2RzIH0gPSB1c2VTdXBwb3J0UmV0cmlldmFsTWV0aG9kcygpXG5cbiAgY29uc3QgW3BsYW4sIHNldFBsYW5dID0gdXNlU3RhdGUoZGVmYXVsdFBsYW4pXG4gIGNvbnN0IFtpc0ZldGNoZWRQbGFuLCBzZXRJc0ZldGNoZWRQbGFuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbZW5hYmxlQmlsbGluZywgc2V0RW5hYmxlQmlsbGluZ10gPSB1c2VTdGF0ZSh0cnVlKVxuICBjb25zdCBbZW5hYmxlUmVwbGFjZVdlYkFwcExvZ28sIHNldEVuYWJsZVJlcGxhY2VXZWJBcHBMb2dvXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbbW9kZWxMb2FkQmFsYW5jaW5nRW5hYmxlZCwgc2V0TW9kZWxMb2FkQmFsYW5jaW5nRW5hYmxlZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2RhdGFzZXRPcGVyYXRvckVuYWJsZWQsIHNldERhdGFzZXRPcGVyYXRvckVuYWJsZWRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFt3ZWJhcHBDb3B5cmlnaHRFbmFibGVkLCBzZXRXZWJhcHBDb3B5cmlnaHRFbmFibGVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbbGljZW5zZUxpbWl0LCBzZXRMaWNlbnNlTGltaXRdID0gdXNlU3RhdGUoe1xuICAgIHdvcmtzcGFjZV9tZW1iZXJzOiB7XG4gICAgICBzaXplOiAwLFxuICAgICAgbGltaXQ6IDAsXG4gICAgfSxcbiAgfSlcblxuICBjb25zdCBbZW5hYmxlRWR1Y2F0aW9uUGxhbiwgc2V0RW5hYmxlRWR1Y2F0aW9uUGxhbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2lzRWR1Y2F0aW9uV29ya3NwYWNlLCBzZXRJc0VkdWNhdGlvbldvcmtzcGFjZV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyBkYXRhOiBlZHVjYXRpb25BY2NvdW50SW5mbywgaXNMb2FkaW5nOiBpc0xvYWRpbmdFZHVjYXRpb25BY2NvdW50SW5mbywgaXNGZXRjaGluZzogaXNGZXRjaGluZ0VkdWNhdGlvbkFjY291bnRJbmZvLCBpc0ZldGNoZWRBZnRlck1vdW50OiBpc0VkdWNhdGlvbkRhdGFGZXRjaGVkQWZ0ZXJNb3VudCB9ID0gdXNlRWR1Y2F0aW9uU3RhdHVzKCFlbmFibGVFZHVjYXRpb25QbGFuKVxuICBjb25zdCBbaXNBbGxvd1RyYW5zZmVyV29ya3NwYWNlLCBzZXRJc0FsbG93VHJhbnNmZXJXb3Jrc3BhY2VdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtpc0FsbG93UHVibGlzaEFzQ3VzdG9tS25vd2xlZGdlUGlwZWxpbmVUZW1wbGF0ZSwgc2V0SXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGVdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgY29uc3QgcmVmcmVzaE1vZGVsUHJvdmlkZXJzID0gKCkgPT4ge1xuICAgIHF1ZXJ5Q2xpZW50LmludmFsaWRhdGVRdWVyaWVzKHsgcXVlcnlLZXk6IFsnY29tbW9uJywgJ21vZGVsLXByb3ZpZGVycyddIH0pXG4gIH1cblxuICBjb25zdCBmZXRjaFBsYW4gPSBhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaEN1cnJlbnRQbGFuSW5mbygpXG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGZldGNoIHBsYW4gaW5mbzogZGF0YSBpcyB1bmRlZmluZWQnKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGRlZmF1bHQgdmFsdWUgdG8gYXZvaWQgdW5kZWZpbmVkIGVycm9yXG4gICAgICBzZXRFbmFibGVCaWxsaW5nKGRhdGEuYmlsbGluZz8uZW5hYmxlZCA/PyBmYWxzZSlcbiAgICAgIHNldEVuYWJsZUVkdWNhdGlvblBsYW4oZGF0YS5lZHVjYXRpb24/LmVuYWJsZWQgPz8gZmFsc2UpXG4gICAgICBzZXRJc0VkdWNhdGlvbldvcmtzcGFjZShkYXRhLmVkdWNhdGlvbj8uYWN0aXZhdGVkID8/IGZhbHNlKVxuICAgICAgc2V0RW5hYmxlUmVwbGFjZVdlYkFwcExvZ28oZGF0YS5jYW5fcmVwbGFjZV9sb2dvID8/IGZhbHNlKVxuXG4gICAgICBpZiAoZGF0YS5iaWxsaW5nPy5lbmFibGVkKSB7XG4gICAgICAgIHNldFBsYW4ocGFyc2VDdXJyZW50UGxhbihkYXRhKSBhcyBhbnkpXG4gICAgICAgIHNldElzRmV0Y2hlZFBsYW4odHJ1ZSlcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEubW9kZWxfbG9hZF9iYWxhbmNpbmdfZW5hYmxlZClcbiAgICAgICAgc2V0TW9kZWxMb2FkQmFsYW5jaW5nRW5hYmxlZCh0cnVlKVxuICAgICAgaWYgKGRhdGEuZGF0YXNldF9vcGVyYXRvcl9lbmFibGVkKVxuICAgICAgICBzZXREYXRhc2V0T3BlcmF0b3JFbmFibGVkKHRydWUpXG4gICAgICBpZiAoZGF0YS53ZWJhcHBfY29weXJpZ2h0X2VuYWJsZWQpXG4gICAgICAgIHNldFdlYmFwcENvcHlyaWdodEVuYWJsZWQodHJ1ZSlcbiAgICAgIGlmIChkYXRhLndvcmtzcGFjZV9tZW1iZXJzKVxuICAgICAgICBzZXRMaWNlbnNlTGltaXQoeyB3b3Jrc3BhY2VfbWVtYmVyczogZGF0YS53b3Jrc3BhY2VfbWVtYmVycyB9KVxuICAgICAgaWYgKGRhdGEuaXNfYWxsb3dfdHJhbnNmZXJfd29ya3NwYWNlKVxuICAgICAgICBzZXRJc0FsbG93VHJhbnNmZXJXb3Jrc3BhY2UoZGF0YS5pc19hbGxvd190cmFuc2Zlcl93b3Jrc3BhY2UpXG4gICAgICBpZiAoZGF0YS5rbm93bGVkZ2VfcGlwZWxpbmU/LnB1Ymxpc2hfZW5hYmxlZClcbiAgICAgICAgc2V0SXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUoZGF0YS5rbm93bGVkZ2VfcGlwZWxpbmU/LnB1Ymxpc2hfZW5hYmxlZClcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggcGxhbiBpbmZvOicsIGVycm9yKVxuICAgICAgLy8gc2V0IGRlZmF1bHQgdmFsdWUgdG8gYXZvaWQgdW5kZWZpbmVkIGVycm9yXG4gICAgICBzZXRFbmFibGVCaWxsaW5nKGZhbHNlKVxuICAgICAgc2V0RW5hYmxlRWR1Y2F0aW9uUGxhbihmYWxzZSlcbiAgICAgIHNldElzRWR1Y2F0aW9uV29ya3NwYWNlKGZhbHNlKVxuICAgICAgc2V0RW5hYmxlUmVwbGFjZVdlYkFwcExvZ28oZmFsc2UpXG4gICAgfVxuICB9XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZmV0Y2hQbGFuKClcbiAgfSwgW10pXG5cbiAgLy8gI3JlZ2lvbiBaZW5kZXNrIGNvbnZlcnNhdGlvbiBmaWVsZHNcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoWkVOREVTS19GSUVMRF9JRFMuUExBTiAmJiBwbGFuLnR5cGUpIHtcbiAgICAgIHNldFplbmRlc2tDb252ZXJzYXRpb25GaWVsZHMoW3tcbiAgICAgICAgaWQ6IFpFTkRFU0tfRklFTERfSURTLlBMQU4sXG4gICAgICAgIHZhbHVlOiBgJHtwbGFuLnR5cGV9LXBsYW5gLFxuICAgICAgfV0pXG4gICAgfVxuICB9LCBbcGxhbi50eXBlXSlcbiAgLy8gI2VuZHJlZ2lvbiBaZW5kZXNrIGNvbnZlcnNhdGlvbiBmaWVsZHNcblxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FudGhyb3BpY19xdW90YV9ub3RpY2UnKSA9PT0gJ3RydWUnKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAoZGF5anMoKS5pc0FmdGVyKGRheWpzKCcyMDI1LTAzLTE3JykpKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAocHJvdmlkZXJzRGF0YT8uZGF0YSAmJiBwcm92aWRlcnNEYXRhLmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgYW50aHJvcGljID0gcHJvdmlkZXJzRGF0YS5kYXRhLmZpbmQocHJvdmlkZXIgPT4gcHJvdmlkZXIucHJvdmlkZXIgPT09ICdhbnRocm9waWMnKVxuICAgICAgaWYgKGFudGhyb3BpYyAmJiBhbnRocm9waWMuc3lzdGVtX2NvbmZpZ3VyYXRpb24uY3VycmVudF9xdW90YV90eXBlID09PSBDdXJyZW50U3lzdGVtUXVvdGFUeXBlRW51bS50cmlhbCkge1xuICAgICAgICBjb25zdCBxdW90YSA9IGFudGhyb3BpYy5zeXN0ZW1fY29uZmlndXJhdGlvbi5xdW90YV9jb25maWd1cmF0aW9ucy5maW5kKGl0ZW0gPT4gaXRlbS5xdW90YV90eXBlID09PSBhbnRocm9waWMuc3lzdGVtX2NvbmZpZ3VyYXRpb24uY3VycmVudF9xdW90YV90eXBlKVxuICAgICAgICBpZiAocXVvdGEgJiYgcXVvdGEuaXNfdmFsaWQgJiYgcXVvdGEucXVvdGFfdXNlZCA8IHF1b3RhLnF1b3RhX2xpbWl0KSB7XG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHQoJ3Byb3ZpZGVyLmFudGhyb3BpY0hvc3RlZC50cmlhbFF1b3RhVGlwJywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgICAgICAgICBkdXJhdGlvbjogNjAwMDAsXG4gICAgICAgICAgICBvbkNsb3NlOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhbnRocm9waWNfcXVvdGFfbm90aWNlJywgJ3RydWUnKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCBbcHJvdmlkZXJzRGF0YSwgdF0pXG5cbiAgcmV0dXJuIChcbiAgICA8UHJvdmlkZXJDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7XG4gICAgICBtb2RlbFByb3ZpZGVyczogcHJvdmlkZXJzRGF0YT8uZGF0YSB8fCBbXSxcbiAgICAgIHJlZnJlc2hNb2RlbFByb3ZpZGVycyxcbiAgICAgIHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0OiB0ZXh0R2VuZXJhdGlvbk1vZGVsTGlzdD8uZGF0YSB8fCBbXSxcbiAgICAgIGlzQVBJS2V5U2V0OiAhIXRleHRHZW5lcmF0aW9uTW9kZWxMaXN0Py5kYXRhPy5zb21lKG1vZGVsID0+IG1vZGVsLnN0YXR1cyA9PT0gTW9kZWxTdGF0dXNFbnVtLmFjdGl2ZSksXG4gICAgICBzdXBwb3J0UmV0cmlldmFsTWV0aG9kczogc3VwcG9ydFJldHJpZXZhbE1ldGhvZHM/LnJldHJpZXZhbF9tZXRob2QgfHwgW10sXG4gICAgICBwbGFuLFxuICAgICAgaXNGZXRjaGVkUGxhbixcbiAgICAgIGVuYWJsZUJpbGxpbmcsXG4gICAgICBvblBsYW5JbmZvQ2hhbmdlZDogZmV0Y2hQbGFuLFxuICAgICAgZW5hYmxlUmVwbGFjZVdlYkFwcExvZ28sXG4gICAgICBtb2RlbExvYWRCYWxhbmNpbmdFbmFibGVkLFxuICAgICAgZGF0YXNldE9wZXJhdG9yRW5hYmxlZCxcbiAgICAgIGVuYWJsZUVkdWNhdGlvblBsYW4sXG4gICAgICBpc0VkdWNhdGlvbldvcmtzcGFjZSxcbiAgICAgIGlzRWR1Y2F0aW9uQWNjb3VudDogaXNFZHVjYXRpb25EYXRhRmV0Y2hlZEFmdGVyTW91bnQgPyAoZWR1Y2F0aW9uQWNjb3VudEluZm8/LmlzX3N0dWRlbnQgPz8gZmFsc2UpIDogZmFsc2UsXG4gICAgICBhbGxvd1JlZnJlc2hFZHVjYXRpb25WZXJpZnk6IGlzRWR1Y2F0aW9uRGF0YUZldGNoZWRBZnRlck1vdW50ID8gKGVkdWNhdGlvbkFjY291bnRJbmZvPy5hbGxvd19yZWZyZXNoID8/IGZhbHNlKSA6IGZhbHNlLFxuICAgICAgZWR1Y2F0aW9uQWNjb3VudEV4cGlyZUF0OiBpc0VkdWNhdGlvbkRhdGFGZXRjaGVkQWZ0ZXJNb3VudCA/IChlZHVjYXRpb25BY2NvdW50SW5mbz8uZXhwaXJlX2F0ID8/IG51bGwpIDogbnVsbCxcbiAgICAgIGlzTG9hZGluZ0VkdWNhdGlvbkFjY291bnRJbmZvLFxuICAgICAgaXNGZXRjaGluZ0VkdWNhdGlvbkFjY291bnRJbmZvLFxuICAgICAgd2ViYXBwQ29weXJpZ2h0RW5hYmxlZCxcbiAgICAgIGxpY2Vuc2VMaW1pdCxcbiAgICAgIHJlZnJlc2hMaWNlbnNlTGltaXQ6IGZldGNoUGxhbixcbiAgICAgIGlzQWxsb3dUcmFuc2ZlcldvcmtzcGFjZSxcbiAgICAgIGlzQWxsb3dQdWJsaXNoQXNDdXN0b21Lbm93bGVkZ2VQaXBlbGluZVRlbXBsYXRlLFxuICAgIH19XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvUHJvdmlkZXJDb250ZXh0LlByb3ZpZGVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb3ZpZGVyQ29udGV4dFxuIl19