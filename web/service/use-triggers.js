"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvalidateTriggerOAuthConfig = exports.useTriggerPluginDynamicOptions = exports.useInitiateTriggerOAuth = exports.useDeleteTriggerOAuth = exports.useConfigureTriggerOAuth = exports.useTriggerOAuthConfig = exports.useTriggerSubscriptionBuilderLogs = exports.useUpdateTriggerSubscription = exports.useDeleteTriggerSubscription = exports.useBuildTriggerSubscription = exports.useVerifyTriggerSubscription = exports.useVerifyAndUpdateTriggerSubscriptionBuilder = exports.useUpdateTriggerSubscriptionBuilder = exports.useCreateTriggerSubscriptionBuilder = exports.useInvalidateTriggerSubscriptions = exports.useTriggerSubscriptions = exports.useTriggerProviderInfo = exports.useInvalidateAllTriggerPlugins = exports.useTriggerPluginsByType = exports.useAllTriggerPlugins = void 0;
const react_query_1 = require("@tanstack/react-query");
const types_1 = require("@/app/components/tools/types");
const base_1 = require("./base");
const use_base_1 = require("./use-base");
const NAME_SPACE = 'triggers';
// Trigger Provider Service - Provider ID Format: plugin_id/provider_name
// Convert backend API response to frontend ToolWithProvider format
const convertToTriggerWithProvider = (provider) => {
    return {
        // Collection fields
        id: provider.plugin_id || provider.name,
        name: provider.name,
        author: provider.author,
        description: provider.description,
        icon: provider.icon || '',
        icon_dark: provider.icon_dark || '',
        label: provider.label,
        type: types_1.CollectionType.trigger,
        team_credentials: {},
        is_team_authorization: false,
        allow_delete: false,
        labels: provider.tags || [],
        plugin_id: provider.plugin_id,
        plugin_unique_identifier: provider.plugin_unique_identifier || '',
        events: provider.events.map(event => ({
            name: event.name,
            author: provider.author,
            label: event.identity.label,
            description: event.description,
            parameters: event.parameters.map(param => ({
                name: param.name,
                label: param.label,
                human_description: param.description || param.label,
                type: param.type,
                form: param.type,
                llm_description: JSON.stringify(param.description || {}),
                required: param.required || false,
                default: param.default || '',
                options: param.options?.map(option => ({
                    label: option.label,
                    value: option.value,
                })) || [],
                multiple: param.multiple || false,
            })),
            labels: provider.tags || [],
            output_schema: event.output_schema || {},
        })),
        // Trigger-specific schema fields
        subscription_constructor: provider.subscription_constructor,
        subscription_schema: provider.subscription_schema,
        supported_creation_methods: provider.supported_creation_methods,
        meta: {
            version: '1.0',
        },
    };
};
const useAllTriggerPlugins = (enabled = true) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'all'],
        queryFn: async () => {
            const response = await (0, base_1.get)('/workspaces/current/triggers');
            return response.map(convertToTriggerWithProvider);
        },
        enabled,
        staleTime: 0,
        gcTime: 0,
    });
};
exports.useAllTriggerPlugins = useAllTriggerPlugins;
const useTriggerPluginsByType = (triggerType, enabled = true) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'byType', triggerType],
        queryFn: async () => {
            const response = await (0, base_1.get)(`/workspaces/current/triggers?type=${triggerType}`);
            return response.map(convertToTriggerWithProvider);
        },
        enabled: enabled && !!triggerType,
    });
};
exports.useTriggerPluginsByType = useTriggerPluginsByType;
const useInvalidateAllTriggerPlugins = () => {
    return (0, use_base_1.useInvalid)([NAME_SPACE, 'all']);
};
exports.useInvalidateAllTriggerPlugins = useInvalidateAllTriggerPlugins;
// ===== Trigger Subscriptions Management =====
const useTriggerProviderInfo = (provider, enabled = true) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'provider-info', provider],
        queryFn: () => (0, base_1.get)(`/workspaces/current/trigger-provider/${provider}/info`),
        enabled: enabled && !!provider,
        staleTime: 0,
        gcTime: 0,
    });
};
exports.useTriggerProviderInfo = useTriggerProviderInfo;
const useTriggerSubscriptions = (provider, enabled = true) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'list-subscriptions', provider],
        queryFn: () => (0, base_1.get)(`/workspaces/current/trigger-provider/${provider}/subscriptions/list`),
        enabled: enabled && !!provider,
    });
};
exports.useTriggerSubscriptions = useTriggerSubscriptions;
const useInvalidateTriggerSubscriptions = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (provider) => {
        queryClient.invalidateQueries({
            queryKey: [NAME_SPACE, 'subscriptions', provider],
        });
    };
};
exports.useInvalidateTriggerSubscriptions = useInvalidateTriggerSubscriptions;
const useCreateTriggerSubscriptionBuilder = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'create-subscription-builder'],
        mutationFn: (payload) => {
            const { provider, ...body } = payload;
            return (0, base_1.post)(`/workspaces/current/trigger-provider/${provider}/subscriptions/builder/create`, { body });
        },
    });
};
exports.useCreateTriggerSubscriptionBuilder = useCreateTriggerSubscriptionBuilder;
const useUpdateTriggerSubscriptionBuilder = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'update-subscription-builder'],
        mutationFn: (payload) => {
            const { provider, subscriptionBuilderId, ...body } = payload;
            return (0, base_1.post)(`/workspaces/current/trigger-provider/${provider}/subscriptions/builder/update/${subscriptionBuilderId}`, { body });
        },
    });
};
exports.useUpdateTriggerSubscriptionBuilder = useUpdateTriggerSubscriptionBuilder;
const useVerifyAndUpdateTriggerSubscriptionBuilder = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'verify-and-update-subscription-builder'],
        mutationFn: (payload) => {
            const { provider, subscriptionBuilderId, ...body } = payload;
            return (0, base_1.post)(`/workspaces/current/trigger-provider/${provider}/subscriptions/builder/verify-and-update/${subscriptionBuilderId}`, { body }, { silent: true });
        },
    });
};
exports.useVerifyAndUpdateTriggerSubscriptionBuilder = useVerifyAndUpdateTriggerSubscriptionBuilder;
const useVerifyTriggerSubscription = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'verify-subscription'],
        mutationFn: (payload) => {
            const { provider, subscriptionId, ...body } = payload;
            return (0, base_1.post)(`/workspaces/current/trigger-provider/${provider}/subscriptions/verify/${subscriptionId}`, { body }, { silent: true });
        },
    });
};
exports.useVerifyTriggerSubscription = useVerifyTriggerSubscription;
const useBuildTriggerSubscription = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'build-subscription'],
        mutationFn: (payload) => {
            const { provider, subscriptionBuilderId, ...body } = payload;
            return (0, base_1.post)(`/workspaces/current/trigger-provider/${provider}/subscriptions/builder/build/${subscriptionBuilderId}`, { body });
        },
    });
};
exports.useBuildTriggerSubscription = useBuildTriggerSubscription;
const useDeleteTriggerSubscription = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'delete-subscription'],
        mutationFn: (subscriptionId) => {
            return (0, base_1.post)(`/workspaces/current/trigger-provider/${subscriptionId}/subscriptions/delete`);
        },
    });
};
exports.useDeleteTriggerSubscription = useDeleteTriggerSubscription;
const useUpdateTriggerSubscription = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'update-subscription'],
        mutationFn: (payload) => {
            const { subscriptionId, ...body } = payload;
            return (0, base_1.post)(`/workspaces/current/trigger-provider/${subscriptionId}/subscriptions/update`, { body });
        },
    });
};
exports.useUpdateTriggerSubscription = useUpdateTriggerSubscription;
const useTriggerSubscriptionBuilderLogs = (provider, subscriptionBuilderId, options = {}) => {
    const { enabled = true, refetchInterval = false } = options;
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'subscription-builder-logs', provider, subscriptionBuilderId],
        queryFn: () => (0, base_1.get)(`/workspaces/current/trigger-provider/${provider}/subscriptions/builder/logs/${subscriptionBuilderId}`),
        enabled: enabled && !!provider && !!subscriptionBuilderId,
        refetchInterval,
    });
};
exports.useTriggerSubscriptionBuilderLogs = useTriggerSubscriptionBuilderLogs;
// ===== OAuth Management =====
const useTriggerOAuthConfig = (provider, enabled = true) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'oauth-config', provider],
        queryFn: () => (0, base_1.get)(`/workspaces/current/trigger-provider/${provider}/oauth/client`),
        enabled: enabled && !!provider,
    });
};
exports.useTriggerOAuthConfig = useTriggerOAuthConfig;
const useConfigureTriggerOAuth = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'configure-oauth'],
        mutationFn: (payload) => {
            const { provider, ...body } = payload;
            return (0, base_1.post)(`/workspaces/current/trigger-provider/${provider}/oauth/client`, { body });
        },
    });
};
exports.useConfigureTriggerOAuth = useConfigureTriggerOAuth;
const useDeleteTriggerOAuth = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'delete-oauth'],
        mutationFn: (provider) => {
            return (0, base_1.del)(`/workspaces/current/trigger-provider/${provider}/oauth/client`);
        },
    });
};
exports.useDeleteTriggerOAuth = useDeleteTriggerOAuth;
const useInitiateTriggerOAuth = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'initiate-oauth'],
        mutationFn: (provider) => {
            return (0, base_1.get)(`/workspaces/current/trigger-provider/${provider}/subscriptions/oauth/authorize`, {}, { silent: true });
        },
    });
};
exports.useInitiateTriggerOAuth = useInitiateTriggerOAuth;
// ===== Dynamic Options Support =====
const useTriggerPluginDynamicOptions = (payload, enabled = true) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'dynamic-options', payload.plugin_id, payload.provider, payload.action, payload.parameter, payload.credential_id, payload.credentials, payload.extra],
        queryFn: () => {
            // Use new endpoint with POST when credentials provided (for edit mode)
            if (payload.credentials) {
                return (0, base_1.post)('/workspaces/current/plugin/parameters/dynamic-options-with-credentials', {
                    body: {
                        plugin_id: payload.plugin_id,
                        provider: payload.provider,
                        action: payload.action,
                        parameter: payload.parameter,
                        credential_id: payload.credential_id,
                        credentials: payload.credentials,
                    },
                }, { silent: true });
            }
            // Use original GET endpoint for normal cases
            return (0, base_1.get)('/workspaces/current/plugin/parameters/dynamic-options', {
                params: {
                    plugin_id: payload.plugin_id,
                    provider: payload.provider,
                    action: payload.action,
                    parameter: payload.parameter,
                    credential_id: payload.credential_id,
                    provider_type: 'trigger',
                },
            }, { silent: true });
        },
        enabled: enabled && !!payload.plugin_id && !!payload.provider && !!payload.action && !!payload.parameter && !!payload.credential_id,
        retry: 0,
        staleTime: 0,
        gcTime: 0,
    });
};
exports.useTriggerPluginDynamicOptions = useTriggerPluginDynamicOptions;
// ===== Cache Invalidation Helpers =====
const useInvalidateTriggerOAuthConfig = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (provider) => {
        queryClient.invalidateQueries({
            queryKey: [NAME_SPACE, 'oauth-config', provider],
        });
    };
};
exports.useInvalidateTriggerOAuthConfig = useInvalidateTriggerOAuthConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXRyaWdnZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXRyaWdnZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVVBLHVEQUE2RTtBQUM3RSx3REFBNkQ7QUFDN0QsaUNBQXVDO0FBQ3ZDLHlDQUF1QztBQUV2QyxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFFN0IseUVBQXlFO0FBRXpFLG1FQUFtRTtBQUNuRSxNQUFNLDRCQUE0QixHQUFHLENBQUMsUUFBa0MsRUFBdUIsRUFBRTtJQUMvRixPQUFPO1FBQ0wsb0JBQW9CO1FBQ3BCLEVBQUUsRUFBRSxRQUFRLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxJQUFJO1FBQ3ZDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtRQUNuQixNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07UUFDdkIsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXO1FBQ2pDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxJQUFJLEVBQUU7UUFDekIsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTLElBQUksRUFBRTtRQUNuQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7UUFDckIsSUFBSSxFQUFFLHNCQUFjLENBQUMsT0FBTztRQUM1QixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLHFCQUFxQixFQUFFLEtBQUs7UUFDNUIsWUFBWSxFQUFFLEtBQUs7UUFDbkIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLElBQUksRUFBRTtRQUMzQixTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVM7UUFDN0Isd0JBQXdCLEVBQUUsUUFBUSxDQUFDLHdCQUF3QixJQUFJLEVBQUU7UUFDakUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO1lBQ3ZCLEtB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LENBQUE7QUFDSixDQUFDLENBQUE7QUFsRFksUUFBQSw4QkFBOEIsa0NBa0QxQztBQUVELHlDQUF5QztBQUVsQyxNQUFNLCtCQUErQixHQUFHLEdBQUcsRUFBRTtJQUNsRCxNQUFNLFdBQVcsR0FBRyxJQUFBLDRCQUFjLEdBQUUsQ0FBQTtJQUNwQyxPQUFPLENBQUMsUUFBZ0IsRUFBRSxFQUFFO1FBQzFCLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztZQUM1QixRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsQ0FBQztTQUNqRCxDQUFDLENBQUE7SUFDSixDQUFDLENBQUE7QUFDSCxDQUFDLENBQUE7QUFQWSxRQUFBLCtCQUErQixtQ0FPM0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZvcm1PcHRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS90eXBlcydcbmltcG9ydCB0eXBlIHtcbiAgVHJpZ2dlckxvZ0VudGl0eSxcbiAgVHJpZ2dlck9BdXRoQ2xpZW50UGFyYW1zLFxuICBUcmlnZ2VyT0F1dGhDb25maWcsXG4gIFRyaWdnZXJQcm92aWRlckFwaUVudGl0eSxcbiAgVHJpZ2dlclN1YnNjcmlwdGlvbixcbiAgVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXIsXG4gIFRyaWdnZXJXaXRoUHJvdmlkZXIsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgeyB1c2VNdXRhdGlvbiwgdXNlUXVlcnksIHVzZVF1ZXJ5Q2xpZW50IH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgQ29sbGVjdGlvblR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3Rvb2xzL3R5cGVzJ1xuaW1wb3J0IHsgZGVsLCBnZXQsIHBvc3QgfSBmcm9tICcuL2Jhc2UnXG5pbXBvcnQgeyB1c2VJbnZhbGlkIH0gZnJvbSAnLi91c2UtYmFzZSdcblxuY29uc3QgTkFNRV9TUEFDRSA9ICd0cmlnZ2VycydcblxuLy8gVHJpZ2dlciBQcm92aWRlciBTZXJ2aWNlIC0gUHJvdmlkZXIgSUQgRm9ybWF0OiBwbHVnaW5faWQvcHJvdmlkZXJfbmFtZVxuXG4vLyBDb252ZXJ0IGJhY2tlbmQgQVBJIHJlc3BvbnNlIHRvIGZyb250ZW5kIFRvb2xXaXRoUHJvdmlkZXIgZm9ybWF0XG5jb25zdCBjb252ZXJ0VG9UcmlnZ2VyV2l0aFByb3ZpZGVyID0gKHByb3ZpZGVyOiBUcmlnZ2VyUHJvdmlkZXJBcGlFbnRpdHkpOiBUcmlnZ2VyV2l0aFByb3ZpZGVyID0+IHtcbiAgcmV0dXJuIHtcbiAgICAvLyBDb2xsZWN0aW9uIGZpZWxkc1xuICAgIGlkOiBwcm92aWRlci5wbHVnaW5faWQgfHwgcHJvdmlkZXIubmFtZSxcbiAgICBuYW1lOiBwcm92aWRlci5uYW1lLFxuICAgIGF1dGhvcjogcHJvdmlkZXIuYXV0aG9yLFxuICAgIGRlc2NyaXB0aW9uOiBwcm92aWRlci5kZXNjcmlwdGlvbixcbiAgICBpY29uOiBwcm92aWRlci5pY29uIHx8ICcnLFxuICAgIGljb25fZGFyazogcHJvdmlkZXIuaWNvbl9kYXJrIHx8ICcnLFxuICAgIGxhYmVsOiBwcm92aWRlci5sYWJlbCxcbiAgICB0eXBlOiBDb2xsZWN0aW9uVHlwZS50cmlnZ2VyLFxuICAgIHRlYW1fY3JlZGVudGlhbHM6IHt9LFxuICAgIGlzX3RlYW1fYXV0aG9yaXphdGlvbjogZmFsc2UsXG4gICAgYWxsb3dfZGVsZXRlOiBmYWxzZSxcbiAgICBsYWJlbHM6IHByb3ZpZGVyLnRhZ3MgfHwgW10sXG4gICAgcGx1Z2luX2lkOiBwcm92aWRlci5wbHVnaW5faWQsXG4gICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiBwcm92aWRlci5wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIgfHwgJycsXG4gICAgZXZlbnRzOiBwcm92aWRlci5ldmVudHMubWFwKGV2ZW50ID0+ICh7XG4gICAgICBuYW1lOiBldmVudC5uYW1lLFxuICAgICAgYXV0aG9yOiBwcm92aWRlci5hdXRob3IsXG4gICAgICBsYWJlbDogZXZlbnQuaWRlbnRpdHkubGFiZWwsXG4gICAgICBkZXNjcmlwdGlvbjogZXZlbnQuZGVzY3JpcHRpb24sXG4gICAgICBwYXJhbWV0ZXJzOiBldmVudC5wYXJhbWV0ZXJzLm1hcChwYXJhbSA9PiAoe1xuICAgICAgICBuYW1lOiBwYXJhbS5uYW1lLFxuICAgICAgICBsYWJlbDogcGFyYW0ubGFiZWwsXG4gICAgICAgIGh1bWFuX2Rlc2NyaXB0aW9uOiBwYXJhbS5kZXNjcmlwdGlvbiB8fCBwYXJhbS5sYWJlbCxcbiAgICAgICAgdHlwZTogcGFyYW0udHlwZSxcbiAgICAgICAgZm9ybTogcGFyYW0udHlwZSxcbiAgICAgICAgbGxtX2Rlc2NyaXB0aW9uOiBKU09OLnN0cmluZ2lmeShwYXJhbS5kZXNjcmlwdGlvbiB8fCB7fSksXG4gICAgICAgIHJlcXVpcmVkOiBwYXJhbS5yZXF1aXJlZCB8fCBmYWxzZSxcbiAgICAgICAgZGVmYXVsdDogcGFyYW0uZGVmYXVsdCB8fCAnJyxcbiAgICAgICAgb3B0aW9uczogcGFyYW0ub3B0aW9ucz8ubWFwKG9wdGlvbiA9PiAoe1xuICAgICAgICAgIGxhYmVsOiBvcHRpb24ubGFiZWwsXG4gICAgICAgICAgdmFsdWU6IG9wdGlvbi52YWx1ZSxcbiAgICAgICAgfSkpIHx8IFtdLFxuICAgICAgICBtdWx0aXBsZTogcGFyYW0ubXVsdGlwbGUgfHwgZmFsc2UsXG4gICAgICB9KSksXG4gICAgICBsYWJlbHM6IHByb3ZpZGVyLnRhZ3MgfHwgW10sXG4gICAgICBvdXRwdXRfc2NoZW1hOiBldmVudC5vdXRwdXRfc2NoZW1hIHx8IHt9LFxuICAgIH0pKSxcblxuICAgIC8vIFRyaWdnZXItc3BlY2lmaWMgc2NoZW1hIGZpZWxkc1xuICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3RvcjogcHJvdmlkZXIuc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yLFxuICAgIHN1YnNjcmlwdGlvbl9zY2hlbWE6IHByb3ZpZGVyLnN1YnNjcmlwdGlvbl9zY2hlbWEsXG4gICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IHByb3ZpZGVyLnN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzLFxuXG4gICAgbWV0YToge1xuICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgfSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlQWxsVHJpZ2dlclBsdWdpbnMgPSAoZW5hYmxlZCA9IHRydWUpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5PFRyaWdnZXJXaXRoUHJvdmlkZXJbXT4oe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2FsbCddLFxuICAgIHF1ZXJ5Rm46IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0PFRyaWdnZXJQcm92aWRlckFwaUVudGl0eVtdPignL3dvcmtzcGFjZXMvY3VycmVudC90cmlnZ2VycycpXG4gICAgICByZXR1cm4gcmVzcG9uc2UubWFwKGNvbnZlcnRUb1RyaWdnZXJXaXRoUHJvdmlkZXIpXG4gICAgfSxcbiAgICBlbmFibGVkLFxuICAgIHN0YWxlVGltZTogMCxcbiAgICBnY1RpbWU6IDAsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VUcmlnZ2VyUGx1Z2luc0J5VHlwZSA9ICh0cmlnZ2VyVHlwZTogc3RyaW5nLCBlbmFibGVkID0gdHJ1ZSkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8VHJpZ2dlcldpdGhQcm92aWRlcltdPih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnYnlUeXBlJywgdHJpZ2dlclR5cGVdLFxuICAgIHF1ZXJ5Rm46IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0PFRyaWdnZXJQcm92aWRlckFwaUVudGl0eVtdPihgL3dvcmtzcGFjZXMvY3VycmVudC90cmlnZ2Vycz90eXBlPSR7dHJpZ2dlclR5cGV9YClcbiAgICAgIHJldHVybiByZXNwb25zZS5tYXAoY29udmVydFRvVHJpZ2dlcldpdGhQcm92aWRlcilcbiAgICB9LFxuICAgIGVuYWJsZWQ6IGVuYWJsZWQgJiYgISF0cmlnZ2VyVHlwZSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUludmFsaWRhdGVBbGxUcmlnZ2VyUGx1Z2lucyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZUludmFsaWQoW05BTUVfU1BBQ0UsICdhbGwnXSlcbn1cblxuLy8gPT09PT0gVHJpZ2dlciBTdWJzY3JpcHRpb25zIE1hbmFnZW1lbnQgPT09PT1cblxuZXhwb3J0IGNvbnN0IHVzZVRyaWdnZXJQcm92aWRlckluZm8gPSAocHJvdmlkZXI6IHN0cmluZywgZW5hYmxlZCA9IHRydWUpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5PFRyaWdnZXJQcm92aWRlckFwaUVudGl0eT4oe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ3Byb3ZpZGVyLWluZm8nLCBwcm92aWRlcl0sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0PFRyaWdnZXJQcm92aWRlckFwaUVudGl0eT4oYC93b3Jrc3BhY2VzL2N1cnJlbnQvdHJpZ2dlci1wcm92aWRlci8ke3Byb3ZpZGVyfS9pbmZvYCksXG4gICAgZW5hYmxlZDogZW5hYmxlZCAmJiAhIXByb3ZpZGVyLFxuICAgIHN0YWxlVGltZTogMCxcbiAgICBnY1RpbWU6IDAsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VUcmlnZ2VyU3Vic2NyaXB0aW9ucyA9IChwcm92aWRlcjogc3RyaW5nLCBlbmFibGVkID0gdHJ1ZSkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8VHJpZ2dlclN1YnNjcmlwdGlvbltdPih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnbGlzdC1zdWJzY3JpcHRpb25zJywgcHJvdmlkZXJdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxUcmlnZ2VyU3Vic2NyaXB0aW9uW10+KGAvd29ya3NwYWNlcy9jdXJyZW50L3RyaWdnZXItcHJvdmlkZXIvJHtwcm92aWRlcn0vc3Vic2NyaXB0aW9ucy9saXN0YCksXG4gICAgZW5hYmxlZDogZW5hYmxlZCAmJiAhIXByb3ZpZGVyLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW52YWxpZGF0ZVRyaWdnZXJTdWJzY3JpcHRpb25zID0gKCkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuIChwcm92aWRlcjogc3RyaW5nKSA9PiB7XG4gICAgcXVlcnlDbGllbnQuaW52YWxpZGF0ZVF1ZXJpZXMoe1xuICAgICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnc3Vic2NyaXB0aW9ucycsIHByb3ZpZGVyXSxcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VDcmVhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlciA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdjcmVhdGUtc3Vic2NyaXB0aW9uLWJ1aWxkZXInXSxcbiAgICBtdXRhdGlvbkZuOiAocGF5bG9hZDoge1xuICAgICAgcHJvdmlkZXI6IHN0cmluZ1xuICAgICAgY3JlZGVudGlhbF90eXBlPzogc3RyaW5nXG4gICAgfSkgPT4ge1xuICAgICAgY29uc3QgeyBwcm92aWRlciwgLi4uYm9keSB9ID0gcGF5bG9hZFxuICAgICAgcmV0dXJuIHBvc3Q8eyBzdWJzY3JpcHRpb25fYnVpbGRlcjogVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXIgfT4oXG4gICAgICAgIGAvd29ya3NwYWNlcy9jdXJyZW50L3RyaWdnZXItcHJvdmlkZXIvJHtwcm92aWRlcn0vc3Vic2NyaXB0aW9ucy9idWlsZGVyL2NyZWF0ZWAsXG4gICAgICAgIHsgYm9keSB9LFxuICAgICAgKVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VVcGRhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlciA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICd1cGRhdGUtc3Vic2NyaXB0aW9uLWJ1aWxkZXInXSxcbiAgICBtdXRhdGlvbkZuOiAocGF5bG9hZDoge1xuICAgICAgcHJvdmlkZXI6IHN0cmluZ1xuICAgICAgc3Vic2NyaXB0aW9uQnVpbGRlcklkOiBzdHJpbmdcbiAgICAgIG5hbWU/OiBzdHJpbmdcbiAgICAgIHByb3BlcnRpZXM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgICAgcGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICAgICBjcmVkZW50aWFscz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICAgfSkgPT4ge1xuICAgICAgY29uc3QgeyBwcm92aWRlciwgc3Vic2NyaXB0aW9uQnVpbGRlcklkLCAuLi5ib2R5IH0gPSBwYXlsb2FkXG4gICAgICByZXR1cm4gcG9zdDxUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlcj4oXG4gICAgICAgIGAvd29ya3NwYWNlcy9jdXJyZW50L3RyaWdnZXItcHJvdmlkZXIvJHtwcm92aWRlcn0vc3Vic2NyaXB0aW9ucy9idWlsZGVyL3VwZGF0ZS8ke3N1YnNjcmlwdGlvbkJ1aWxkZXJJZH1gLFxuICAgICAgICB7IGJvZHkgfSxcbiAgICAgIClcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlVmVyaWZ5QW5kVXBkYXRlVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXIgPSAoKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAndmVyaWZ5LWFuZC11cGRhdGUtc3Vic2NyaXB0aW9uLWJ1aWxkZXInXSxcbiAgICBtdXRhdGlvbkZuOiAocGF5bG9hZDoge1xuICAgICAgcHJvdmlkZXI6IHN0cmluZ1xuICAgICAgc3Vic2NyaXB0aW9uQnVpbGRlcklkOiBzdHJpbmdcbiAgICAgIGNyZWRlbnRpYWxzPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICB9KSA9PiB7XG4gICAgICBjb25zdCB7IHByb3ZpZGVyLCBzdWJzY3JpcHRpb25CdWlsZGVySWQsIC4uLmJvZHkgfSA9IHBheWxvYWRcbiAgICAgIHJldHVybiBwb3N0PHsgdmVyaWZpZWQ6IGJvb2xlYW4gfT4oXG4gICAgICAgIGAvd29ya3NwYWNlcy9jdXJyZW50L3RyaWdnZXItcHJvdmlkZXIvJHtwcm92aWRlcn0vc3Vic2NyaXB0aW9ucy9idWlsZGVyL3ZlcmlmeS1hbmQtdXBkYXRlLyR7c3Vic2NyaXB0aW9uQnVpbGRlcklkfWAsXG4gICAgICAgIHsgYm9keSB9LFxuICAgICAgICB7IHNpbGVudDogdHJ1ZSB9LFxuICAgICAgKVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VWZXJpZnlUcmlnZ2VyU3Vic2NyaXB0aW9uID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ3ZlcmlmeS1zdWJzY3JpcHRpb24nXSxcbiAgICBtdXRhdGlvbkZuOiAocGF5bG9hZDoge1xuICAgICAgcHJvdmlkZXI6IHN0cmluZ1xuICAgICAgc3Vic2NyaXB0aW9uSWQ6IHN0cmluZ1xuICAgICAgY3JlZGVudGlhbHM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgIH0pID0+IHtcbiAgICAgIGNvbnN0IHsgcHJvdmlkZXIsIHN1YnNjcmlwdGlvbklkLCAuLi5ib2R5IH0gPSBwYXlsb2FkXG4gICAgICByZXR1cm4gcG9zdDx7IHZlcmlmaWVkOiBib29sZWFuIH0+KFxuICAgICAgICBgL3dvcmtzcGFjZXMvY3VycmVudC90cmlnZ2VyLXByb3ZpZGVyLyR7cHJvdmlkZXJ9L3N1YnNjcmlwdGlvbnMvdmVyaWZ5LyR7c3Vic2NyaXB0aW9uSWR9YCxcbiAgICAgICAgeyBib2R5IH0sXG4gICAgICAgIHsgc2lsZW50OiB0cnVlIH0sXG4gICAgICApXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IHR5cGUgQnVpbGRUcmlnZ2VyU3Vic2NyaXB0aW9uUGF5bG9hZCA9IHtcbiAgcHJvdmlkZXI6IHN0cmluZ1xuICBzdWJzY3JpcHRpb25CdWlsZGVySWQ6IHN0cmluZ1xuICBuYW1lPzogc3RyaW5nXG4gIHBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxufVxuXG5leHBvcnQgY29uc3QgdXNlQnVpbGRUcmlnZ2VyU3Vic2NyaXB0aW9uID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ2J1aWxkLXN1YnNjcmlwdGlvbiddLFxuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiBCdWlsZFRyaWdnZXJTdWJzY3JpcHRpb25QYXlsb2FkKSA9PiB7XG4gICAgICBjb25zdCB7IHByb3ZpZGVyLCBzdWJzY3JpcHRpb25CdWlsZGVySWQsIC4uLmJvZHkgfSA9IHBheWxvYWRcbiAgICAgIHJldHVybiBwb3N0KFxuICAgICAgICBgL3dvcmtzcGFjZXMvY3VycmVudC90cmlnZ2VyLXByb3ZpZGVyLyR7cHJvdmlkZXJ9L3N1YnNjcmlwdGlvbnMvYnVpbGRlci9idWlsZC8ke3N1YnNjcmlwdGlvbkJ1aWxkZXJJZH1gLFxuICAgICAgICB7IGJvZHkgfSxcbiAgICAgIClcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlRGVsZXRlVHJpZ2dlclN1YnNjcmlwdGlvbiA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdkZWxldGUtc3Vic2NyaXB0aW9uJ10sXG4gICAgbXV0YXRpb25GbjogKHN1YnNjcmlwdGlvbklkOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBwb3N0PHsgcmVzdWx0OiBzdHJpbmcgfT4oXG4gICAgICAgIGAvd29ya3NwYWNlcy9jdXJyZW50L3RyaWdnZXItcHJvdmlkZXIvJHtzdWJzY3JpcHRpb25JZH0vc3Vic2NyaXB0aW9ucy9kZWxldGVgLFxuICAgICAgKVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCB0eXBlIFVwZGF0ZVRyaWdnZXJTdWJzY3JpcHRpb25QYXlsb2FkID0ge1xuICBzdWJzY3JpcHRpb25JZDogc3RyaW5nXG4gIG5hbWU/OiBzdHJpbmdcbiAgcHJvcGVydGllcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gIHBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICBjcmVkZW50aWFscz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG59XG5cbmV4cG9ydCBjb25zdCB1c2VVcGRhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ3VwZGF0ZS1zdWJzY3JpcHRpb24nXSxcbiAgICBtdXRhdGlvbkZuOiAocGF5bG9hZDogVXBkYXRlVHJpZ2dlclN1YnNjcmlwdGlvblBheWxvYWQpID0+IHtcbiAgICAgIGNvbnN0IHsgc3Vic2NyaXB0aW9uSWQsIC4uLmJvZHkgfSA9IHBheWxvYWRcbiAgICAgIHJldHVybiBwb3N0PHsgcmVzdWx0OiBzdHJpbmcsIGlkOiBzdHJpbmcgfT4oXG4gICAgICAgIGAvd29ya3NwYWNlcy9jdXJyZW50L3RyaWdnZXItcHJvdmlkZXIvJHtzdWJzY3JpcHRpb25JZH0vc3Vic2NyaXB0aW9ucy91cGRhdGVgLFxuICAgICAgICB7IGJvZHkgfSxcbiAgICAgIClcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXJMb2dzID0gKFxuICBwcm92aWRlcjogc3RyaW5nLFxuICBzdWJzY3JpcHRpb25CdWlsZGVySWQ6IHN0cmluZyxcbiAgb3B0aW9uczoge1xuICAgIGVuYWJsZWQ/OiBib29sZWFuXG4gICAgcmVmZXRjaEludGVydmFsPzogbnVtYmVyIHwgZmFsc2VcbiAgfSA9IHt9LFxuKSA9PiB7XG4gIGNvbnN0IHsgZW5hYmxlZCA9IHRydWUsIHJlZmV0Y2hJbnRlcnZhbCA9IGZhbHNlIH0gPSBvcHRpb25zXG5cbiAgcmV0dXJuIHVzZVF1ZXJ5PHsgbG9nczogVHJpZ2dlckxvZ0VudGl0eVtdIH0+KHtcbiAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdzdWJzY3JpcHRpb24tYnVpbGRlci1sb2dzJywgcHJvdmlkZXIsIHN1YnNjcmlwdGlvbkJ1aWxkZXJJZF0sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0KFxuICAgICAgYC93b3Jrc3BhY2VzL2N1cnJlbnQvdHJpZ2dlci1wcm92aWRlci8ke3Byb3ZpZGVyfS9zdWJzY3JpcHRpb25zL2J1aWxkZXIvbG9ncy8ke3N1YnNjcmlwdGlvbkJ1aWxkZXJJZH1gLFxuICAgICksXG4gICAgZW5hYmxlZDogZW5hYmxlZCAmJiAhIXByb3ZpZGVyICYmICEhc3Vic2NyaXB0aW9uQnVpbGRlcklkLFxuICAgIHJlZmV0Y2hJbnRlcnZhbCxcbiAgfSlcbn1cblxuLy8gPT09PT0gT0F1dGggTWFuYWdlbWVudCA9PT09PVxuZXhwb3J0IGNvbnN0IHVzZVRyaWdnZXJPQXV0aENvbmZpZyA9IChwcm92aWRlcjogc3RyaW5nLCBlbmFibGVkID0gdHJ1ZSkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8VHJpZ2dlck9BdXRoQ29uZmlnPih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnb2F1dGgtY29uZmlnJywgcHJvdmlkZXJdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxUcmlnZ2VyT0F1dGhDb25maWc+KGAvd29ya3NwYWNlcy9jdXJyZW50L3RyaWdnZXItcHJvdmlkZXIvJHtwcm92aWRlcn0vb2F1dGgvY2xpZW50YCksXG4gICAgZW5hYmxlZDogZW5hYmxlZCAmJiAhIXByb3ZpZGVyLFxuICB9KVxufVxuXG5leHBvcnQgdHlwZSBDb25maWd1cmVUcmlnZ2VyT0F1dGhQYXlsb2FkID0ge1xuICBwcm92aWRlcjogc3RyaW5nXG4gIGNsaWVudF9wYXJhbXM/OiBUcmlnZ2VyT0F1dGhDbGllbnRQYXJhbXNcbiAgZW5hYmxlZDogYm9vbGVhblxufVxuXG5leHBvcnQgY29uc3QgdXNlQ29uZmlndXJlVHJpZ2dlck9BdXRoID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ2NvbmZpZ3VyZS1vYXV0aCddLFxuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiBDb25maWd1cmVUcmlnZ2VyT0F1dGhQYXlsb2FkKSA9PiB7XG4gICAgICBjb25zdCB7IHByb3ZpZGVyLCAuLi5ib2R5IH0gPSBwYXlsb2FkXG4gICAgICByZXR1cm4gcG9zdDx7IHJlc3VsdDogc3RyaW5nIH0+KFxuICAgICAgICBgL3dvcmtzcGFjZXMvY3VycmVudC90cmlnZ2VyLXByb3ZpZGVyLyR7cHJvdmlkZXJ9L29hdXRoL2NsaWVudGAsXG4gICAgICAgIHsgYm9keSB9LFxuICAgICAgKVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VEZWxldGVUcmlnZ2VyT0F1dGggPSAoKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAnZGVsZXRlLW9hdXRoJ10sXG4gICAgbXV0YXRpb25GbjogKHByb3ZpZGVyOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBkZWw8eyByZXN1bHQ6IHN0cmluZyB9PihcbiAgICAgICAgYC93b3Jrc3BhY2VzL2N1cnJlbnQvdHJpZ2dlci1wcm92aWRlci8ke3Byb3ZpZGVyfS9vYXV0aC9jbGllbnRgLFxuICAgICAgKVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbml0aWF0ZVRyaWdnZXJPQXV0aCA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdpbml0aWF0ZS1vYXV0aCddLFxuICAgIG11dGF0aW9uRm46IChwcm92aWRlcjogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0PHsgYXV0aG9yaXphdGlvbl91cmw6IHN0cmluZywgc3Vic2NyaXB0aW9uX2J1aWxkZXI6IFRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyIH0+KFxuICAgICAgICBgL3dvcmtzcGFjZXMvY3VycmVudC90cmlnZ2VyLXByb3ZpZGVyLyR7cHJvdmlkZXJ9L3N1YnNjcmlwdGlvbnMvb2F1dGgvYXV0aG9yaXplYCxcbiAgICAgICAge30sXG4gICAgICAgIHsgc2lsZW50OiB0cnVlIH0sXG4gICAgICApXG4gICAgfSxcbiAgfSlcbn1cblxuLy8gPT09PT0gRHluYW1pYyBPcHRpb25zIFN1cHBvcnQgPT09PT1cbmV4cG9ydCBjb25zdCB1c2VUcmlnZ2VyUGx1Z2luRHluYW1pY09wdGlvbnMgPSAocGF5bG9hZDoge1xuICBwbHVnaW5faWQ6IHN0cmluZ1xuICBwcm92aWRlcjogc3RyaW5nXG4gIGFjdGlvbjogc3RyaW5nXG4gIHBhcmFtZXRlcjogc3RyaW5nXG4gIGNyZWRlbnRpYWxfaWQ6IHN0cmluZ1xuICBjcmVkZW50aWFscz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gIGV4dHJhPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbn0sIGVuYWJsZWQgPSB0cnVlKSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeTx7IG9wdGlvbnM6IEZvcm1PcHRpb25bXSB9Pih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnZHluYW1pYy1vcHRpb25zJywgcGF5bG9hZC5wbHVnaW5faWQsIHBheWxvYWQucHJvdmlkZXIsIHBheWxvYWQuYWN0aW9uLCBwYXlsb2FkLnBhcmFtZXRlciwgcGF5bG9hZC5jcmVkZW50aWFsX2lkLCBwYXlsb2FkLmNyZWRlbnRpYWxzLCBwYXlsb2FkLmV4dHJhXSxcbiAgICBxdWVyeUZuOiAoKSA9PiB7XG4gICAgICAvLyBVc2UgbmV3IGVuZHBvaW50IHdpdGggUE9TVCB3aGVuIGNyZWRlbnRpYWxzIHByb3ZpZGVkIChmb3IgZWRpdCBtb2RlKVxuICAgICAgaWYgKHBheWxvYWQuY3JlZGVudGlhbHMpIHtcbiAgICAgICAgcmV0dXJuIHBvc3Q8eyBvcHRpb25zOiBGb3JtT3B0aW9uW10gfT4oXG4gICAgICAgICAgJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL3BhcmFtZXRlcnMvZHluYW1pYy1vcHRpb25zLXdpdGgtY3JlZGVudGlhbHMnLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgcGx1Z2luX2lkOiBwYXlsb2FkLnBsdWdpbl9pZCxcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IHBheWxvYWQucHJvdmlkZXIsXG4gICAgICAgICAgICAgIGFjdGlvbjogcGF5bG9hZC5hY3Rpb24sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcjogcGF5bG9hZC5wYXJhbWV0ZXIsXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxfaWQ6IHBheWxvYWQuY3JlZGVudGlhbF9pZCxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IHBheWxvYWQuY3JlZGVudGlhbHMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBzaWxlbnQ6IHRydWUgfSxcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgLy8gVXNlIG9yaWdpbmFsIEdFVCBlbmRwb2ludCBmb3Igbm9ybWFsIGNhc2VzXG4gICAgICByZXR1cm4gZ2V0PHsgb3B0aW9uczogRm9ybU9wdGlvbltdIH0+KFxuICAgICAgICAnL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vcGFyYW1ldGVycy9keW5hbWljLW9wdGlvbnMnLFxuICAgICAgICB7XG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBwbHVnaW5faWQ6IHBheWxvYWQucGx1Z2luX2lkLFxuICAgICAgICAgICAgcHJvdmlkZXI6IHBheWxvYWQucHJvdmlkZXIsXG4gICAgICAgICAgICBhY3Rpb246IHBheWxvYWQuYWN0aW9uLFxuICAgICAgICAgICAgcGFyYW1ldGVyOiBwYXlsb2FkLnBhcmFtZXRlcixcbiAgICAgICAgICAgIGNyZWRlbnRpYWxfaWQ6IHBheWxvYWQuY3JlZGVudGlhbF9pZCxcbiAgICAgICAgICAgIHByb3ZpZGVyX3R5cGU6ICd0cmlnZ2VyJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7IHNpbGVudDogdHJ1ZSB9LFxuICAgICAgKVxuICAgIH0sXG4gICAgZW5hYmxlZDogZW5hYmxlZCAmJiAhIXBheWxvYWQucGx1Z2luX2lkICYmICEhcGF5bG9hZC5wcm92aWRlciAmJiAhIXBheWxvYWQuYWN0aW9uICYmICEhcGF5bG9hZC5wYXJhbWV0ZXIgJiYgISFwYXlsb2FkLmNyZWRlbnRpYWxfaWQsXG4gICAgcmV0cnk6IDAsXG4gICAgc3RhbGVUaW1lOiAwLFxuICAgIGdjVGltZTogMCxcbiAgfSlcbn1cblxuLy8gPT09PT0gQ2FjaGUgSW52YWxpZGF0aW9uIEhlbHBlcnMgPT09PT1cblxuZXhwb3J0IGNvbnN0IHVzZUludmFsaWRhdGVUcmlnZ2VyT0F1dGhDb25maWcgPSAoKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gdXNlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gKHByb3ZpZGVyOiBzdHJpbmcpID0+IHtcbiAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyh7XG4gICAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdvYXV0aC1jb25maWcnLCBwcm92aWRlcl0sXG4gICAgfSlcbiAgfVxufVxuIl19