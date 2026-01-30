"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateTriggerStatus = exports.useInvalidateAppTriggers = exports.useAppTriggers = exports.useInvalidateRAGRecommendedPlugins = exports.useRAGRecommendedPlugins = exports.useRemoveProviderCredentials = exports.useUpdateProviderCredentials = exports.useBuiltinTools = exports.useInvalidateBuiltinProviderInfo = exports.useBuiltinProviderInfo = exports.useRefreshMCPServerCode = exports.useUpdateMCPServer = exports.useCreateMCPServer = exports.useInvalidateMCPServerDetail = exports.useMCPServerDetail = exports.useUpdateMCPTools = exports.useInvalidateMCPTools = exports.useMCPTools = exports.useUpdateMCPAuthorizationToken = exports.useAuthorizeMCP = exports.useDeleteMCP = exports.useUpdateMCP = exports.useCreateMCP = exports.useInvalidToolsByType = exports.useInvalidateAllMCPTools = exports.useAllMCPTools = exports.useInvalidateAllWorkflowTools = exports.useAllWorkflowTools = exports.useInvalidateAllCustomTools = exports.useAllCustomTools = exports.useInvalidateAllBuiltInTools = exports.useAllBuiltInTools = exports.useInvalidateAllToolProviders = exports.useAllToolProviders = void 0;
const react_query_1 = require("@tanstack/react-query");
const types_1 = require("@/app/components/tools/types");
const base_1 = require("./base");
const use_base_1 = require("./use-base");
const NAME_SPACE = 'tools';
const useAllToolProvidersKey = [NAME_SPACE, 'allToolProviders'];
const useAllToolProviders = (enabled = true) => {
    return (0, react_query_1.useQuery)({
        queryKey: useAllToolProvidersKey,
        queryFn: () => (0, base_1.get)('/workspaces/current/tool-providers'),
        enabled,
    });
};
exports.useAllToolProviders = useAllToolProviders;
const useInvalidateAllToolProviders = () => {
    return (0, use_base_1.useInvalid)(useAllToolProvidersKey);
};
exports.useInvalidateAllToolProviders = useInvalidateAllToolProviders;
const useAllBuiltInToolsKey = [NAME_SPACE, 'builtIn'];
const useAllBuiltInTools = () => {
    return (0, react_query_1.useQuery)({
        queryKey: useAllBuiltInToolsKey,
        queryFn: () => (0, base_1.get)('/workspaces/current/tools/builtin'),
    });
};
exports.useAllBuiltInTools = useAllBuiltInTools;
const useInvalidateAllBuiltInTools = () => {
    return (0, use_base_1.useInvalid)(useAllBuiltInToolsKey);
};
exports.useInvalidateAllBuiltInTools = useInvalidateAllBuiltInTools;
const useAllCustomToolsKey = [NAME_SPACE, 'customTools'];
const useAllCustomTools = () => {
    return (0, react_query_1.useQuery)({
        queryKey: useAllCustomToolsKey,
        queryFn: () => (0, base_1.get)('/workspaces/current/tools/api'),
    });
};
exports.useAllCustomTools = useAllCustomTools;
const useInvalidateAllCustomTools = () => {
    return (0, use_base_1.useInvalid)(useAllCustomToolsKey);
};
exports.useInvalidateAllCustomTools = useInvalidateAllCustomTools;
const useAllWorkflowToolsKey = [NAME_SPACE, 'workflowTools'];
const useAllWorkflowTools = () => {
    return (0, react_query_1.useQuery)({
        queryKey: useAllWorkflowToolsKey,
        queryFn: () => (0, base_1.get)('/workspaces/current/tools/workflow'),
    });
};
exports.useAllWorkflowTools = useAllWorkflowTools;
const useInvalidateAllWorkflowTools = () => {
    return (0, use_base_1.useInvalid)(useAllWorkflowToolsKey);
};
exports.useInvalidateAllWorkflowTools = useInvalidateAllWorkflowTools;
const useAllMCPToolsKey = [NAME_SPACE, 'MCPTools'];
const useAllMCPTools = () => {
    return (0, react_query_1.useQuery)({
        queryKey: useAllMCPToolsKey,
        queryFn: () => (0, base_1.get)('/workspaces/current/tools/mcp'),
    });
};
exports.useAllMCPTools = useAllMCPTools;
const useInvalidateAllMCPTools = () => {
    return (0, use_base_1.useInvalid)(useAllMCPToolsKey);
};
exports.useInvalidateAllMCPTools = useInvalidateAllMCPTools;
const useInvalidToolsKeyMap = {
    [types_1.CollectionType.builtIn]: useAllBuiltInToolsKey,
    [types_1.CollectionType.custom]: useAllCustomToolsKey,
    [types_1.CollectionType.workflow]: useAllWorkflowToolsKey,
    [types_1.CollectionType.mcp]: useAllMCPToolsKey,
};
const useInvalidToolsByType = (type) => {
    const queryKey = type ? useInvalidToolsKeyMap[type] : undefined;
    return (0, use_base_1.useInvalid)(queryKey);
};
exports.useInvalidToolsByType = useInvalidToolsByType;
const useCreateMCP = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'create-mcp'],
        mutationFn: (payload) => {
            return (0, base_1.post)('workspaces/current/tool-provider/mcp', {
                body: {
                    ...payload,
                },
            });
        },
    });
};
exports.useCreateMCP = useCreateMCP;
const useUpdateMCP = ({ onSuccess, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'update-mcp'],
        mutationFn: (payload) => {
            return (0, base_1.put)('workspaces/current/tool-provider/mcp', {
                body: {
                    ...payload,
                },
            });
        },
        onSuccess,
    });
};
exports.useUpdateMCP = useUpdateMCP;
const useDeleteMCP = ({ onSuccess, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'delete-mcp'],
        mutationFn: (id) => {
            return (0, base_1.del)('/workspaces/current/tool-provider/mcp', {
                body: {
                    provider_id: id,
                },
            });
        },
        onSuccess,
    });
};
exports.useDeleteMCP = useDeleteMCP;
const useAuthorizeMCP = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'authorize-mcp'],
        mutationFn: (payload) => {
            return (0, base_1.post)('/workspaces/current/tool-provider/mcp/auth', {
                body: payload,
            });
        },
    });
};
exports.useAuthorizeMCP = useAuthorizeMCP;
const useUpdateMCPAuthorizationToken = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'refresh-mcp-server-code'],
        mutationFn: (payload) => {
            return (0, base_1.get)('/workspaces/current/tool-provider/mcp/token', {
                params: {
                    ...payload,
                },
            });
        },
    });
};
exports.useUpdateMCPAuthorizationToken = useUpdateMCPAuthorizationToken;
const useMCPTools = (providerID) => {
    return (0, react_query_1.useQuery)({
        enabled: !!providerID,
        queryKey: [NAME_SPACE, 'get-MCP-provider-tool', providerID],
        queryFn: () => (0, base_1.get)(`/workspaces/current/tool-provider/mcp/tools/${providerID}`),
    });
};
exports.useMCPTools = useMCPTools;
const useInvalidateMCPTools = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (providerID) => {
        queryClient.invalidateQueries({
            queryKey: [NAME_SPACE, 'get-MCP-provider-tool', providerID],
        });
    };
};
exports.useInvalidateMCPTools = useInvalidateMCPTools;
const useUpdateMCPTools = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: (providerID) => (0, base_1.get)(`/workspaces/current/tool-provider/mcp/update/${providerID}`),
    });
};
exports.useUpdateMCPTools = useUpdateMCPTools;
const useMCPServerDetail = (appID) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'MCPServerDetail', appID],
        queryFn: () => (0, base_1.get)(`/apps/${appID}/server`),
    });
};
exports.useMCPServerDetail = useMCPServerDetail;
const useInvalidateMCPServerDetail = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (appID) => {
        queryClient.invalidateQueries({
            queryKey: [NAME_SPACE, 'MCPServerDetail', appID],
        });
    };
};
exports.useInvalidateMCPServerDetail = useInvalidateMCPServerDetail;
const useCreateMCPServer = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'create-mcp-server'],
        mutationFn: (payload) => {
            const { appID, ...rest } = payload;
            return (0, base_1.post)(`apps/${appID}/server`, {
                body: {
                    ...rest,
                },
            });
        },
    });
};
exports.useCreateMCPServer = useCreateMCPServer;
const useUpdateMCPServer = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'update-mcp-server'],
        mutationFn: (payload) => {
            const { appID, ...rest } = payload;
            return (0, base_1.put)(`apps/${appID}/server`, {
                body: {
                    ...rest,
                },
            });
        },
    });
};
exports.useUpdateMCPServer = useUpdateMCPServer;
const useRefreshMCPServerCode = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'refresh-mcp-server-code'],
        mutationFn: (appID) => {
            return (0, base_1.get)(`apps/${appID}/server/refresh`);
        },
    });
};
exports.useRefreshMCPServerCode = useRefreshMCPServerCode;
const useBuiltinProviderInfo = (providerName) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'builtin-provider-info', providerName],
        queryFn: () => (0, base_1.get)(`/workspaces/current/tool-provider/builtin/${providerName}/info`),
    });
};
exports.useBuiltinProviderInfo = useBuiltinProviderInfo;
const useInvalidateBuiltinProviderInfo = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (providerName) => {
        queryClient.invalidateQueries({
            queryKey: [NAME_SPACE, 'builtin-provider-info', providerName],
        });
    };
};
exports.useInvalidateBuiltinProviderInfo = useInvalidateBuiltinProviderInfo;
const useBuiltinTools = (providerName) => {
    return (0, react_query_1.useQuery)({
        enabled: !!providerName,
        queryKey: [NAME_SPACE, 'builtin-provider-tools', providerName],
        queryFn: () => (0, base_1.get)(`/workspaces/current/tool-provider/builtin/${providerName}/tools`),
    });
};
exports.useBuiltinTools = useBuiltinTools;
const useUpdateProviderCredentials = ({ onSuccess, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'update-provider-credentials'],
        mutationFn: (payload) => {
            const { providerName, credentials } = payload;
            return (0, base_1.post)(`/workspaces/current/tool-provider/builtin/${providerName}/update`, {
                body: {
                    credentials,
                },
            });
        },
        onSuccess,
    });
};
exports.useUpdateProviderCredentials = useUpdateProviderCredentials;
const useRemoveProviderCredentials = ({ onSuccess, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'remove-provider-credentials'],
        mutationFn: (providerName) => {
            return (0, base_1.post)(`/workspaces/current/tool-provider/builtin/${providerName}/delete`, {
                body: {},
            });
        },
        onSuccess,
    });
};
exports.useRemoveProviderCredentials = useRemoveProviderCredentials;
const useRAGRecommendedPluginListKey = [NAME_SPACE, 'rag-recommended-plugins'];
const useRAGRecommendedPlugins = (type = 'all') => {
    return (0, react_query_1.useQuery)({
        queryKey: [...useRAGRecommendedPluginListKey, type],
        queryFn: () => (0, base_1.get)('/rag/pipelines/recommended-plugins', {
            params: {
                type,
            },
        }),
    });
};
exports.useRAGRecommendedPlugins = useRAGRecommendedPlugins;
const useInvalidateRAGRecommendedPlugins = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (type = 'all') => {
        queryClient.invalidateQueries({
            queryKey: [...useRAGRecommendedPluginListKey, type],
        });
    };
};
exports.useInvalidateRAGRecommendedPlugins = useInvalidateRAGRecommendedPlugins;
const useAppTriggers = (appId, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'app-triggers', appId],
        queryFn: () => (0, base_1.get)(`/apps/${appId}/triggers`),
        enabled: !!appId,
        ...options, // Merge additional options while maintaining backward compatibility
    });
};
exports.useAppTriggers = useAppTriggers;
const useInvalidateAppTriggers = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (appId) => {
        queryClient.invalidateQueries({
            queryKey: [NAME_SPACE, 'app-triggers', appId],
        });
    };
};
exports.useInvalidateAppTriggers = useInvalidateAppTriggers;
const useUpdateTriggerStatus = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'update-trigger-status'],
        mutationFn: (payload) => {
            const { appId, triggerId, enableTrigger } = payload;
            return (0, base_1.post)(`/apps/${appId}/trigger-enable`, {
                body: {
                    trigger_id: triggerId,
                    enable_trigger: enableTrigger,
                },
            });
        },
    });
};
exports.useUpdateTriggerStatus = useUpdateTriggerStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXRvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXRvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVFBLHVEQUk4QjtBQUM5Qix3REFBNkQ7QUFDN0QsaUNBQTRDO0FBQzVDLHlDQUF1QztBQUV2QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUE7QUFFMUIsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO0FBQ3hELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxFQUFFLEVBQUU7SUFDcEQsT0FBTyxJQUFBLHNCQUFRLEVBQWU7UUFDNUIsUUFBUSxFQUFFLHNCQUFzQjtRQUNoQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxVQUFHLEVBQWUsb0NBQW9DLENBQUM7UUFDdEUsT0FBTztLQUNSLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQU5ZLFFBQUEsbUJBQW1CLHVCQU0vQjtBQUVNLE1BQU0sNkJBQTZCLEdBQUcsR0FBRyxFQUFFO0lBQ2hELE9BQU8sSUFBQSxxQkFBVSxFQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDM0MsQ0FBQyxDQUFBO0FBRlksUUFBQSw2QkFBNkIsaUNBRXpDO0FBRUQsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUM5QyxNQUFNLGtCQUFrQixHQUFHLEdBQUcsRUFBRTtJQUNyQyxPQUFPLElBQUEsc0JBQVEsRUFBcUI7UUFDbEMsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxVQUFHLEVBQXFCLG1DQUFtQyxDQUFDO0tBQzVFLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQUxZLFFBQUEsa0JBQWtCLHNCQUs5QjtBQUVNLE1BQU0sNEJBQTRCLEdBQUcsR0FBRyxFQUFFO0lBQy9DLE9BQU8sSUFBQSxxQkFBVSxFQUFDLHFCQUFxQixD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RCxPQUFPLElBQUEsV0FBSSxFQUFhLFNBQVMsS0FBSyxpQkFBaUIsRUFBRTtnQkFDdkQsSUFBSSxFQUFFO29CQUNKLFVBQVUsRUFBRSxTQUFTO29CQUNyQixjQUFjLEVBQUUsYUFBYTtpQkFDOUI7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBakJZLFFBQUEsc0JBQXNCLDBCQWlCbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFF1ZXJ5S2V5IH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHR5cGUge1xuICBDb2xsZWN0aW9uLFxuICBNQ1BTZXJ2ZXJEZXRhaWwsXG4gIFRvb2wsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFJBR1JlY29tbWVuZGVkUGx1Z2lucywgVG9vbFdpdGhQcm92aWRlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEFwcEljb25UeXBlIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQge1xuICB1c2VNdXRhdGlvbixcbiAgdXNlUXVlcnksXG4gIHVzZVF1ZXJ5Q2xpZW50LFxufSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBDb2xsZWN0aW9uVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdHlwZXMnXG5pbXBvcnQgeyBkZWwsIGdldCwgcG9zdCwgcHV0IH0gZnJvbSAnLi9iYXNlJ1xuaW1wb3J0IHsgdXNlSW52YWxpZCB9IGZyb20gJy4vdXNlLWJhc2UnXG5cbmNvbnN0IE5BTUVfU1BBQ0UgPSAndG9vbHMnXG5cbmNvbnN0IHVzZUFsbFRvb2xQcm92aWRlcnNLZXkgPSBbTkFNRV9TUEFDRSwgJ2FsbFRvb2xQcm92aWRlcnMnXVxuZXhwb3J0IGNvbnN0IHVzZUFsbFRvb2xQcm92aWRlcnMgPSAoZW5hYmxlZCA9IHRydWUpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5PENvbGxlY3Rpb25bXT4oe1xuICAgIHF1ZXJ5S2V5OiB1c2VBbGxUb29sUHJvdmlkZXJzS2V5LFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxDb2xsZWN0aW9uW10+KCcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXJzJyksXG4gICAgZW5hYmxlZCxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUludmFsaWRhdGVBbGxUb29sUHJvdmlkZXJzID0gKCkgPT4ge1xuICByZXR1cm4gdXNlSW52YWxpZCh1c2VBbGxUb29sUHJvdmlkZXJzS2V5KVxufVxuXG5jb25zdCB1c2VBbGxCdWlsdEluVG9vbHNLZXkgPSBbTkFNRV9TUEFDRSwgJ2J1aWx0SW4nXVxuZXhwb3J0IGNvbnN0IHVzZUFsbEJ1aWx0SW5Ub29scyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5PFRvb2xXaXRoUHJvdmlkZXJbXT4oe1xuICAgIHF1ZXJ5S2V5OiB1c2VBbGxCdWlsdEluVG9vbHNLZXksXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0PFRvb2xXaXRoUHJvdmlkZXJbXT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbHMvYnVpbHRpbicpLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW52YWxpZGF0ZUFsbEJ1aWx0SW5Ub29scyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZUludmFsaWQodXNlQWxsQnVpbHRJblRvb2xzS2V5KVxufVxuXG5jb25zdCB1c2VBbGxDdXN0b21Ub29sc0tleSA9IFtOQU1FX1NQQUNFLCAnY3VzdG9tVG9vbHMnXVxuZXhwb3J0IGNvbnN0IHVzZUFsbEN1c3RvbVRvb2xzID0gKCkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8VG9vbFdpdGhQcm92aWRlcltdPih7XG4gICAgcXVlcnlLZXk6IHVzZUFsbEN1c3RvbVRvb2xzS2V5LFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxUb29sV2l0aFByb3ZpZGVyW10+KCcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2xzL2FwaScpLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW52YWxpZGF0ZUFsbEN1c3RvbVRvb2xzID0gKCkgPT4ge1xuICByZXR1cm4gdXNlSW52YWxpZCh1c2VBbGxDdXN0b21Ub29sc0tleSlcbn1cblxuY29uc3QgdXNlQWxsV29ya2Zsb3dUb29sc0tleSA9IFtOQU1FX1NQQUNFLCAnd29ya2Zsb3dUb29scyddXG5leHBvcnQgY29uc3QgdXNlQWxsV29ya2Zsb3dUb29scyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5PFRvb2xXaXRoUHJvdmlkZXJbXT4oe1xuICAgIHF1ZXJ5S2V5OiB1c2VBbGxXb3JrZmxvd1Rvb2xzS2V5LFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxUb29sV2l0aFByb3ZpZGVyW10+KCcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2xzL3dvcmtmbG93JyksXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbnZhbGlkYXRlQWxsV29ya2Zsb3dUb29scyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZUludmFsaWQodXNlQWxsV29ya2Zsb3dUb29sc0tleSlcbn1cblxuY29uc3QgdXNlQWxsTUNQVG9vbHNLZXkgPSBbTkFNRV9TUEFDRSwgJ01DUFRvb2xzJ11cbmV4cG9ydCBjb25zdCB1c2VBbGxNQ1BUb29scyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5PFRvb2xXaXRoUHJvdmlkZXJbXT4oe1xuICAgIHF1ZXJ5S2V5OiB1c2VBbGxNQ1BUb29sc0tleSxcbiAgICBxdWVyeUZuOiAoKSA9PiBnZXQ8VG9vbFdpdGhQcm92aWRlcltdPignL3dvcmtzcGFjZXMvY3VycmVudC90b29scy9tY3AnKSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUludmFsaWRhdGVBbGxNQ1BUb29scyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZUludmFsaWQodXNlQWxsTUNQVG9vbHNLZXkpXG59XG5cbmNvbnN0IHVzZUludmFsaWRUb29sc0tleU1hcDogUmVjb3JkPHN0cmluZywgUXVlcnlLZXk+ID0ge1xuICBbQ29sbGVjdGlvblR5cGUuYnVpbHRJbl06IHVzZUFsbEJ1aWx0SW5Ub29sc0tleSxcbiAgW0NvbGxlY3Rpb25UeXBlLmN1c3RvbV06IHVzZUFsbEN1c3RvbVRvb2xzS2V5LFxuICBbQ29sbGVjdGlvblR5cGUud29ya2Zsb3ddOiB1c2VBbGxXb3JrZmxvd1Rvb2xzS2V5LFxuICBbQ29sbGVjdGlvblR5cGUubWNwXTogdXNlQWxsTUNQVG9vbHNLZXksXG59XG5leHBvcnQgY29uc3QgdXNlSW52YWxpZFRvb2xzQnlUeXBlID0gKHR5cGU/OiBDb2xsZWN0aW9uVHlwZSB8IHN0cmluZykgPT4ge1xuICBjb25zdCBxdWVyeUtleSA9IHR5cGUgPyB1c2VJbnZhbGlkVG9vbHNLZXlNYXBbdHlwZV0gOiB1bmRlZmluZWRcbiAgcmV0dXJuIHVzZUludmFsaWQocXVlcnlLZXkpXG59XG5cbmV4cG9ydCBjb25zdCB1c2VDcmVhdGVNQ1AgPSAoKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAnY3JlYXRlLW1jcCddLFxuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiB7XG4gICAgICBuYW1lOiBzdHJpbmdcbiAgICAgIHNlcnZlcl91cmw6IHN0cmluZ1xuICAgICAgaWNvbl90eXBlOiBBcHBJY29uVHlwZVxuICAgICAgaWNvbjogc3RyaW5nXG4gICAgICBpY29uX2JhY2tncm91bmQ/OiBzdHJpbmcgfCBudWxsXG4gICAgICB0aW1lb3V0PzogbnVtYmVyXG4gICAgICBzc2VfcmVhZF90aW1lb3V0PzogbnVtYmVyXG4gICAgICBoZWFkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuICAgIH0pID0+IHtcbiAgICAgIHJldHVybiBwb3N0PFRvb2xXaXRoUHJvdmlkZXI+KCd3b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9tY3AnLCB7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlVXBkYXRlTUNQID0gKHtcbiAgb25TdWNjZXNzLFxufToge1xuICBvblN1Y2Nlc3M/OiAoKSA9PiB2b2lkXG59KSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAndXBkYXRlLW1jcCddLFxuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiB7XG4gICAgICBuYW1lOiBzdHJpbmdcbiAgICAgIHNlcnZlcl91cmw6IHN0cmluZ1xuICAgICAgaWNvbl90eXBlOiBBcHBJY29uVHlwZVxuICAgICAgaWNvbjogc3RyaW5nXG4gICAgICBpY29uX2JhY2tncm91bmQ/OiBzdHJpbmcgfCBudWxsXG4gICAgICBwcm92aWRlcl9pZDogc3RyaW5nXG4gICAgICB0aW1lb3V0PzogbnVtYmVyXG4gICAgICBzc2VfcmVhZF90aW1lb3V0PzogbnVtYmVyXG4gICAgICBoZWFkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuICAgIH0pID0+IHtcbiAgICAgIHJldHVybiBwdXQoJ3dvcmtzcGFjZXMvY3VycmVudC90b29sLXByb3ZpZGVyL21jcCcsIHtcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIC4uLnBheWxvYWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgb25TdWNjZXNzLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlRGVsZXRlTUNQID0gKHtcbiAgb25TdWNjZXNzLFxufToge1xuICBvblN1Y2Nlc3M/OiAoKSA9PiB2b2lkXG59KSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAnZGVsZXRlLW1jcCddLFxuICAgIG11dGF0aW9uRm46IChpZDogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gZGVsKCcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvbWNwJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgcHJvdmlkZXJfaWQ6IGlkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIG9uU3VjY2VzcyxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUF1dGhvcml6ZU1DUCA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdhdXRob3JpemUtbWNwJ10sXG4gICAgbXV0YXRpb25GbjogKHBheWxvYWQ6IHsgcHJvdmlkZXJfaWQ6IHN0cmluZyB9KSA9PiB7XG4gICAgICByZXR1cm4gcG9zdDx7IHJlc3VsdD86IHN0cmluZywgYXV0aG9yaXphdGlvbl91cmw/OiBzdHJpbmcgfT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9tY3AvYXV0aCcsIHtcbiAgICAgICAgYm9keTogcGF5bG9hZCxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVVwZGF0ZU1DUEF1dGhvcml6YXRpb25Ub2tlbiA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdyZWZyZXNoLW1jcC1zZXJ2ZXItY29kZSddLFxuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiB7IHByb3ZpZGVyX2lkOiBzdHJpbmcsIGF1dGhvcml6YXRpb25fY29kZTogc3RyaW5nIH0pID0+IHtcbiAgICAgIHJldHVybiBnZXQ8TUNQU2VydmVyRGV0YWlsPignL3dvcmtzcGFjZXMvY3VycmVudC90b29sLXByb3ZpZGVyL21jcC90b2tlbicsIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZU1DUFRvb2xzID0gKHByb3ZpZGVySUQ6IHN0cmluZykgPT4ge1xuICByZXR1cm4gdXNlUXVlcnkoe1xuICAgIGVuYWJsZWQ6ICEhcHJvdmlkZXJJRCxcbiAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdnZXQtTUNQLXByb3ZpZGVyLXRvb2wnLCBwcm92aWRlcklEXSxcbiAgICBxdWVyeUZuOiAoKSA9PiBnZXQ8eyB0b29sczogVG9vbFtdIH0+KGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvbWNwL3Rvb2xzLyR7cHJvdmlkZXJJRH1gKSxcbiAgfSlcbn1cbmV4cG9ydCBjb25zdCB1c2VJbnZhbGlkYXRlTUNQVG9vbHMgPSAoKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gdXNlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gKHByb3ZpZGVySUQ6IHN0cmluZykgPT4ge1xuICAgIHF1ZXJ5Q2xpZW50LmludmFsaWRhdGVRdWVyaWVzKFxuICAgICAge1xuICAgICAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdnZXQtTUNQLXByb3ZpZGVyLXRvb2wnLCBwcm92aWRlcklEXSxcbiAgICAgIH0sXG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VVcGRhdGVNQ1BUb29scyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbkZuOiAocHJvdmlkZXJJRDogc3RyaW5nKSA9PiBnZXQ8eyB0b29sczogVG9vbFtdIH0+KGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvbWNwL3VwZGF0ZS8ke3Byb3ZpZGVySUR9YCksXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VNQ1BTZXJ2ZXJEZXRhaWwgPSAoYXBwSUQ6IHN0cmluZykgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8TUNQU2VydmVyRGV0YWlsPih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnTUNQU2VydmVyRGV0YWlsJywgYXBwSURdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxNQ1BTZXJ2ZXJEZXRhaWw+KGAvYXBwcy8ke2FwcElEfS9zZXJ2ZXJgKSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUludmFsaWRhdGVNQ1BTZXJ2ZXJEZXRhaWwgPSAoKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gdXNlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gKGFwcElEOiBzdHJpbmcpID0+IHtcbiAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyhcbiAgICAgIHtcbiAgICAgICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnTUNQU2VydmVyRGV0YWlsJywgYXBwSURdLFxuICAgICAgfSxcbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZUNyZWF0ZU1DUFNlcnZlciA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdjcmVhdGUtbWNwLXNlcnZlciddLFxuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiB7XG4gICAgICBhcHBJRDogc3RyaW5nXG4gICAgICBkZXNjcmlwdGlvbj86IHN0cmluZ1xuICAgICAgcGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbiAgICB9KSA9PiB7XG4gICAgICBjb25zdCB7IGFwcElELCAuLi5yZXN0IH0gPSBwYXlsb2FkXG4gICAgICByZXR1cm4gcG9zdChgYXBwcy8ke2FwcElEfS9zZXJ2ZXJgLCB7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAuLi5yZXN0LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlVXBkYXRlTUNQU2VydmVyID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ3VwZGF0ZS1tY3Atc2VydmVyJ10sXG4gICAgbXV0YXRpb25GbjogKHBheWxvYWQ6IHtcbiAgICAgIGFwcElEOiBzdHJpbmdcbiAgICAgIGlkOiBzdHJpbmdcbiAgICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nXG4gICAgICBzdGF0dXM/OiBzdHJpbmdcbiAgICAgIHBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XG4gICAgfSkgPT4ge1xuICAgICAgY29uc3QgeyBhcHBJRCwgLi4ucmVzdCB9ID0gcGF5bG9hZFxuICAgICAgcmV0dXJuIHB1dChgYXBwcy8ke2FwcElEfS9zZXJ2ZXJgLCB7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAuLi5yZXN0LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlUmVmcmVzaE1DUFNlcnZlckNvZGUgPSAoKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAncmVmcmVzaC1tY3Atc2VydmVyLWNvZGUnXSxcbiAgICBtdXRhdGlvbkZuOiAoYXBwSUQ6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIGdldDxNQ1BTZXJ2ZXJEZXRhaWw+KGBhcHBzLyR7YXBwSUR9L3NlcnZlci9yZWZyZXNoYClcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlQnVpbHRpblByb3ZpZGVySW5mbyA9IChwcm92aWRlck5hbWU6IHN0cmluZykgPT4ge1xuICByZXR1cm4gdXNlUXVlcnkoe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2J1aWx0aW4tcHJvdmlkZXItaW5mbycsIHByb3ZpZGVyTmFtZV0sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0PENvbGxlY3Rpb24+KGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyTmFtZX0vaW5mb2ApLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW52YWxpZGF0ZUJ1aWx0aW5Qcm92aWRlckluZm8gPSAoKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gdXNlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gKHByb3ZpZGVyTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcXVlcnlDbGllbnQuaW52YWxpZGF0ZVF1ZXJpZXMoXG4gICAgICB7XG4gICAgICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2J1aWx0aW4tcHJvdmlkZXItaW5mbycsIHByb3ZpZGVyTmFtZV0sXG4gICAgICB9LFxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlQnVpbHRpblRvb2xzID0gKHByb3ZpZGVyTmFtZTogc3RyaW5nKSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeSh7XG4gICAgZW5hYmxlZDogISFwcm92aWRlck5hbWUsXG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnYnVpbHRpbi1wcm92aWRlci10b29scycsIHByb3ZpZGVyTmFtZV0sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0PFRvb2xbXT4oYC93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluLyR7cHJvdmlkZXJOYW1lfS90b29sc2ApLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlVXBkYXRlUHJvdmlkZXJDcmVkZW50aWFscyA9ICh7XG4gIG9uU3VjY2Vzcyxcbn06IHtcbiAgb25TdWNjZXNzPzogKCkgPT4gdm9pZFxufSkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ3VwZGF0ZS1wcm92aWRlci1jcmVkZW50aWFscyddLFxuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiB7IHByb3ZpZGVyTmFtZTogc3RyaW5nLCBjcmVkZW50aWFsczogUmVjb3JkPHN0cmluZywgYW55PiB9KSA9PiB7XG4gICAgICBjb25zdCB7IHByb3ZpZGVyTmFtZSwgY3JlZGVudGlhbHMgfSA9IHBheWxvYWRcbiAgICAgIHJldHVybiBwb3N0KGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyTmFtZX0vdXBkYXRlYCwge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgY3JlZGVudGlhbHMsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgb25TdWNjZXNzLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlUmVtb3ZlUHJvdmlkZXJDcmVkZW50aWFscyA9ICh7XG4gIG9uU3VjY2Vzcyxcbn06IHtcbiAgb25TdWNjZXNzPzogKCkgPT4gdm9pZFxufSkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ3JlbW92ZS1wcm92aWRlci1jcmVkZW50aWFscyddLFxuICAgIG11dGF0aW9uRm46IChwcm92aWRlck5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIHBvc3QoYC93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluLyR7cHJvdmlkZXJOYW1lfS9kZWxldGVgLCB7XG4gICAgICAgIGJvZHk6IHt9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIG9uU3VjY2VzcyxcbiAgfSlcbn1cblxuY29uc3QgdXNlUkFHUmVjb21tZW5kZWRQbHVnaW5MaXN0S2V5ID0gW05BTUVfU1BBQ0UsICdyYWctcmVjb21tZW5kZWQtcGx1Z2lucyddXG5cbmV4cG9ydCBjb25zdCB1c2VSQUdSZWNvbW1lbmRlZFBsdWdpbnMgPSAodHlwZTogJ3Rvb2wnIHwgJ2RhdGFzb3VyY2UnIHwgJ2FsbCcgPSAnYWxsJykgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8UkFHUmVjb21tZW5kZWRQbHVnaW5zPih7XG4gICAgcXVlcnlLZXk6IFsuLi51c2VSQUdSZWNvbW1lbmRlZFBsdWdpbkxpc3RLZXksIHR5cGVdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxSQUdSZWNvbW1lbmRlZFBsdWdpbnM+KCcvcmFnL3BpcGVsaW5lcy9yZWNvbW1lbmRlZC1wbHVnaW5zJywge1xuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIHR5cGUsXG4gICAgICB9LFxuICAgIH0pLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW52YWxpZGF0ZVJBR1JlY29tbWVuZGVkUGx1Z2lucyA9ICgpID0+IHtcbiAgY29uc3QgcXVlcnlDbGllbnQgPSB1c2VRdWVyeUNsaWVudCgpXG4gIHJldHVybiAodHlwZTogJ3Rvb2wnIHwgJ2RhdGFzb3VyY2UnIHwgJ2FsbCcgPSAnYWxsJykgPT4ge1xuICAgIHF1ZXJ5Q2xpZW50LmludmFsaWRhdGVRdWVyaWVzKHtcbiAgICAgIHF1ZXJ5S2V5OiBbLi4udXNlUkFHUmVjb21tZW5kZWRQbHVnaW5MaXN0S2V5LCB0eXBlXSxcbiAgICB9KVxuICB9XG59XG5cbi8vIEFwcCBUcmlnZ2VycyBBUEkgaG9va3NcbmV4cG9ydCB0eXBlIEFwcFRyaWdnZXIgPSB7XG4gIGlkOiBzdHJpbmdcbiAgdHJpZ2dlcl90eXBlOiAndHJpZ2dlci13ZWJob29rJyB8ICd0cmlnZ2VyLXNjaGVkdWxlJyB8ICd0cmlnZ2VyLXBsdWdpbidcbiAgdGl0bGU6IHN0cmluZ1xuICBub2RlX2lkOiBzdHJpbmdcbiAgcHJvdmlkZXJfbmFtZTogc3RyaW5nXG4gIGljb246IHN0cmluZ1xuICBzdGF0dXM6ICdlbmFibGVkJyB8ICdkaXNhYmxlZCcgfCAndW5hdXRob3JpemVkJ1xuICBjcmVhdGVkX2F0OiBzdHJpbmdcbiAgdXBkYXRlZF9hdDogc3RyaW5nXG59XG5cbmV4cG9ydCBjb25zdCB1c2VBcHBUcmlnZ2VycyA9IChhcHBJZDogc3RyaW5nIHwgdW5kZWZpbmVkLCBvcHRpb25zPzogYW55KSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeTx7IGRhdGE6IEFwcFRyaWdnZXJbXSB9Pih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnYXBwLXRyaWdnZXJzJywgYXBwSWRdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDx7IGRhdGE6IEFwcFRyaWdnZXJbXSB9PihgL2FwcHMvJHthcHBJZH0vdHJpZ2dlcnNgKSxcbiAgICBlbmFibGVkOiAhIWFwcElkLFxuICAgIC4uLm9wdGlvbnMsIC8vIE1lcmdlIGFkZGl0aW9uYWwgb3B0aW9ucyB3aGlsZSBtYWludGFpbmluZyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbnZhbGlkYXRlQXBwVHJpZ2dlcnMgPSAoKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gdXNlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gKGFwcElkOiBzdHJpbmcpID0+IHtcbiAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyh7XG4gICAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdhcHAtdHJpZ2dlcnMnLCBhcHBJZF0sXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlVXBkYXRlVHJpZ2dlclN0YXR1cyA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICd1cGRhdGUtdHJpZ2dlci1zdGF0dXMnXSxcbiAgICBtdXRhdGlvbkZuOiAocGF5bG9hZDoge1xuICAgICAgYXBwSWQ6IHN0cmluZ1xuICAgICAgdHJpZ2dlcklkOiBzdHJpbmdcbiAgICAgIGVuYWJsZVRyaWdnZXI6IGJvb2xlYW5cbiAgICB9KSA9PiB7XG4gICAgICBjb25zdCB7IGFwcElkLCB0cmlnZ2VySWQsIGVuYWJsZVRyaWdnZXIgfSA9IHBheWxvYWRcbiAgICAgIHJldHVybiBwb3N0PEFwcFRyaWdnZXI+KGAvYXBwcy8ke2FwcElkfS90cmlnZ2VyLWVuYWJsZWAsIHtcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHRyaWdnZXJfaWQ6IHRyaWdnZXJJZCxcbiAgICAgICAgICBlbmFibGVfdHJpZ2dlcjogZW5hYmxlVHJpZ2dlcixcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cbiJdfQ==