"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePluginReadmeAsset = exports.usePluginReadme = exports.useFetchDynamicOptions = exports.usePluginInfo = exports.useModelInList = exports.useMutationCheckDependencies = exports.useDownloadPlugin = exports.usePluginManifestInfo = exports.useMutationClearAllTaskPlugin = exports.useMutationClearTaskPlugin = exports.usePluginTaskList = exports.useFetchPluginsInMarketPlaceByInfo = exports.useFetchPluginListOrBundleList = exports.useFetchPluginsInMarketPlaceByIds = exports.useMutationPluginsFromMarketplace = exports.useRemoveAutoUpgrade = exports.useMutationReferenceSettings = exports.useInvalidateReferenceSettings = exports.useReferenceSettings = exports.useDebugKey = exports.useInstallOrUpdate = exports.useUploadGitHub = exports.useInstallPackageFromGitHub = exports.useInstallPackageFromLocal = exports.useInvalidateVersionListOfPlugin = exports.useVersionListOfPlugin = exports.usePluginDeclarationFromMarketPlace = exports.useUpdatePackageFromMarketPlace = exports.useInstallPackageFromMarketPlace = exports.useInvalidateInstalledPluginList = exports.useInstalledLatestVersion = exports.useInstalledPluginList = exports.useFeaturedTriggersRecommendations = exports.useFeaturedToolsRecommendations = exports.useRecommendedMarketplacePlugins = exports.useCheckInstalled = void 0;
const react_query_1 = require("@tanstack/react-query");
const object_1 = require("es-toolkit/object");
const react_1 = require("react");
const use_refresh_plugin_list_1 = require("@/app/components/plugins/install-plugin/hooks/use-refresh-plugin-list");
const utils_1 = require("@/app/components/plugins/marketplace/utils");
const use_reference_setting_1 = require("@/app/components/plugins/plugin-page/use-reference-setting");
const types_1 = require("@/app/components/plugins/types");
const common_1 = require("@/service/common");
const plugins_1 = require("@/service/plugins");
const base_1 = require("./base");
const use_tools_1 = require("./use-tools");
const NAME_SPACE = 'plugins';
const useInstalledPluginListKey = [NAME_SPACE, 'installedPluginList'];
const useCheckInstalled = ({ pluginIds, enabled, }) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'checkInstalled', pluginIds],
        queryFn: () => (0, base_1.post)('/workspaces/current/plugin/list/installations/ids', {
            body: {
                plugin_ids: pluginIds,
            },
        }),
        enabled,
        staleTime: 0, // always fresh
    });
};
exports.useCheckInstalled = useCheckInstalled;
const useRecommendedMarketplacePluginsKey = [NAME_SPACE, 'recommendedMarketplacePlugins'];
const useRecommendedMarketplacePlugins = ({ collection = '__recommended-plugins-tools', enabled = true, limit = 15, } = {}) => {
    return (0, react_query_1.useQuery)({
        queryKey: [...useRecommendedMarketplacePluginsKey, collection, limit],
        queryFn: async () => {
            const response = await (0, base_1.postMarketplace)(`/collections/${collection}/plugins`, {
                body: {
                    limit,
                },
            });
            return response.data.plugins.map(plugin => (0, utils_1.getFormattedPlugin)(plugin));
        },
        enabled,
        staleTime: 60 * 1000,
    });
};
exports.useRecommendedMarketplacePlugins = useRecommendedMarketplacePlugins;
const useFeaturedToolsRecommendations = (enabled, limit = 15) => {
    const { data: plugins = [], isLoading, } = (0, exports.useRecommendedMarketplacePlugins)({
        collection: '__recommended-plugins-tools',
        enabled,
        limit,
    });
    return {
        plugins,
        isLoading,
    };
};
exports.useFeaturedToolsRecommendations = useFeaturedToolsRecommendations;
const useFeaturedTriggersRecommendations = (enabled, limit = 15) => {
    const { data: plugins = [], isLoading, } = (0, exports.useRecommendedMarketplacePlugins)({
        collection: '__recommended-plugins-triggers',
        enabled,
        limit,
    });
    return {
        plugins,
        isLoading,
    };
};
exports.useFeaturedTriggersRecommendations = useFeaturedTriggersRecommendations;
const useInstalledPluginList = (disable, pageSize = 100) => {
    const fetchPlugins = async ({ pageParam = 1 }) => {
        const response = await (0, base_1.get)(`/workspaces/current/plugin/list?page=${pageParam}&page_size=${pageSize}`);
        return response;
    };
    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isSuccess, } = (0, react_query_1.useInfiniteQuery)({
        enabled: !disable,
        queryKey: useInstalledPluginListKey,
        queryFn: fetchPlugins,
        getNextPageParam: (lastPage, pages) => {
            const totalItems = lastPage.total;
            const currentPage = pages.length;
            const itemsLoaded = currentPage * pageSize;
            if (itemsLoaded >= totalItems)
                return;
            return currentPage + 1;
        },
        initialPageParam: 1,
    });
    const plugins = data?.pages.flatMap(page => page.plugins) ?? [];
    const total = data?.pages[0].total ?? 0;
    return {
        data: disable
            ? undefined
            : {
                plugins,
                total,
            },
        isLastPage: !hasNextPage,
        loadNextPage: () => {
            fetchNextPage();
        },
        isLoading,
        isFetching: isFetchingNextPage,
        error,
        isSuccess,
    };
};
exports.useInstalledPluginList = useInstalledPluginList;
const useInstalledLatestVersion = (pluginIds) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'installedLatestVersion', pluginIds],
        queryFn: () => (0, base_1.post)('/workspaces/current/plugin/list/latest-versions', {
            body: {
                plugin_ids: pluginIds,
            },
        }),
        enabled: !!pluginIds.length,
        initialData: pluginIds.length ? undefined : { versions: {} },
    });
};
exports.useInstalledLatestVersion = useInstalledLatestVersion;
const useInvalidateInstalledPluginList = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const invalidateAllBuiltInTools = (0, use_tools_1.useInvalidateAllBuiltInTools)();
    return () => {
        queryClient.invalidateQueries({
            queryKey: useInstalledPluginListKey,
        });
        invalidateAllBuiltInTools();
    };
};
exports.useInvalidateInstalledPluginList = useInvalidateInstalledPluginList;
const useInstallPackageFromMarketPlace = (options) => {
    return (0, react_query_1.useMutation)({
        ...options,
        mutationFn: (uniqueIdentifier) => {
            return (0, base_1.post)('/workspaces/current/plugin/install/marketplace', { body: { plugin_unique_identifiers: [uniqueIdentifier] } });
        },
    });
};
exports.useInstallPackageFromMarketPlace = useInstallPackageFromMarketPlace;
const useUpdatePackageFromMarketPlace = (options) => {
    return (0, react_query_1.useMutation)({
        ...options,
        mutationFn: (body) => {
            return (0, base_1.post)('/workspaces/current/plugin/upgrade/marketplace', {
                body,
            });
        },
    });
};
exports.useUpdatePackageFromMarketPlace = useUpdatePackageFromMarketPlace;
const usePluginDeclarationFromMarketPlace = (pluginUniqueIdentifier) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'pluginDeclaration', pluginUniqueIdentifier],
        queryFn: () => (0, base_1.get)('/workspaces/current/plugin/marketplace/pkg', { params: { plugin_unique_identifier: pluginUniqueIdentifier } }),
        enabled: !!pluginUniqueIdentifier,
    });
};
exports.usePluginDeclarationFromMarketPlace = usePluginDeclarationFromMarketPlace;
const useVersionListOfPlugin = (pluginID) => {
    return (0, react_query_1.useQuery)({
        enabled: !!pluginID,
        queryKey: [NAME_SPACE, 'versions', pluginID],
        queryFn: () => (0, base_1.getMarketplace)(`/plugins/${pluginID}/versions`, { params: { page: 1, page_size: 100 } }),
    });
};
exports.useVersionListOfPlugin = useVersionListOfPlugin;
const useInvalidateVersionListOfPlugin = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (pluginID) => {
        queryClient.invalidateQueries({ queryKey: [NAME_SPACE, 'versions', pluginID] });
    };
};
exports.useInvalidateVersionListOfPlugin = useInvalidateVersionListOfPlugin;
const useInstallPackageFromLocal = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: (uniqueIdentifier) => {
            return (0, base_1.post)('/workspaces/current/plugin/install/pkg', {
                body: { plugin_unique_identifiers: [uniqueIdentifier] },
            });
        },
    });
};
exports.useInstallPackageFromLocal = useInstallPackageFromLocal;
const useInstallPackageFromGitHub = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: ({ repoUrl, selectedVersion, selectedPackage, uniqueIdentifier }) => {
            return (0, base_1.post)('/workspaces/current/plugin/install/github', {
                body: {
                    repo: repoUrl,
                    version: selectedVersion,
                    package: selectedPackage,
                    plugin_unique_identifier: uniqueIdentifier,
                },
            });
        },
    });
};
exports.useInstallPackageFromGitHub = useInstallPackageFromGitHub;
const useUploadGitHub = (payload) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'uploadGitHub', payload],
        queryFn: () => (0, base_1.post)('/workspaces/current/plugin/upload/github', {
            body: payload,
        }),
        retry: 0,
    });
};
exports.useUploadGitHub = useUploadGitHub;
const useInstallOrUpdate = ({ onSuccess, }) => {
    const { mutateAsync: updatePackageFromMarketPlace } = (0, exports.useUpdatePackageFromMarketPlace)();
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => {
            const { payload, plugin, installedInfo } = data;
            return Promise.all(payload.map(async (item, i) => {
                try {
                    const orgAndName = `${plugin[i]?.org || plugin[i]?.author}/${plugin[i]?.name}`;
                    const installedPayload = installedInfo[orgAndName];
                    const isInstalled = !!installedPayload;
                    let uniqueIdentifier = '';
                    let taskId = '';
                    let isFinishedInstallation = false;
                    if (item.type === 'github') {
                        const data = item;
                        // From local bundle don't have data.value.github_plugin_unique_identifier
                        uniqueIdentifier = data.value.github_plugin_unique_identifier;
                        if (!uniqueIdentifier) {
                            const { unique_identifier } = await (0, base_1.post)('/workspaces/current/plugin/upload/github', {
                                body: {
                                    repo: data.value.repo,
                                    version: data.value.release || data.value.version,
                                    package: data.value.packages || data.value.package,
                                },
                            });
                            uniqueIdentifier = data.value.github_plugin_unique_identifier || unique_identifier;
                            // has the same version, but not installed
                            if (uniqueIdentifier === installedPayload?.uniqueIdentifier) {
                                return {
                                    status: types_1.TaskStatus.success,
                                    taskId: '',
                                    uniqueIdentifier: '',
                                };
                            }
                        }
                        if (!isInstalled) {
                            const { task_id, all_installed } = await (0, base_1.post)('/workspaces/current/plugin/install/github', {
                                body: {
                                    repo: data.value.repo,
                                    version: data.value.release || data.value.version,
                                    package: data.value.packages || data.value.package,
                                    plugin_unique_identifier: uniqueIdentifier,
                                },
                            });
                            taskId = task_id;
                            isFinishedInstallation = all_installed;
                        }
                    }
                    if (item.type === 'marketplace') {
                        const data = item;
                        uniqueIdentifier = data.value.marketplace_plugin_unique_identifier || plugin[i]?.plugin_id;
                        if (uniqueIdentifier === installedPayload?.uniqueIdentifier) {
                            return {
                                status: types_1.TaskStatus.success,
                                taskId: '',
                                uniqueIdentifier: '',
                            };
                        }
                        if (!isInstalled) {
                            const { task_id, all_installed } = await (0, base_1.post)('/workspaces/current/plugin/install/marketplace', {
                                body: {
                                    plugin_unique_identifiers: [uniqueIdentifier],
                                },
                            });
                            taskId = task_id;
                            isFinishedInstallation = all_installed;
                        }
                    }
                    if (item.type === 'package') {
                        const data = item;
                        uniqueIdentifier = data.value.unique_identifier;
                        if (uniqueIdentifier === installedPayload?.uniqueIdentifier) {
                            return {
                                status: types_1.TaskStatus.success,
                                taskId: '',
                                uniqueIdentifier: '',
                            };
                        }
                        if (!isInstalled) {
                            const { task_id, all_installed } = await (0, base_1.post)('/workspaces/current/plugin/install/pkg', {
                                body: {
                                    plugin_unique_identifiers: [uniqueIdentifier],
                                },
                            });
                            taskId = task_id;
                            isFinishedInstallation = all_installed;
                        }
                    }
                    if (isInstalled) {
                        if (item.type === 'package') {
                            await (0, plugins_1.uninstallPlugin)(installedPayload.installedId);
                            const { task_id, all_installed } = await (0, base_1.post)('/workspaces/current/plugin/install/pkg', {
                                body: {
                                    plugin_unique_identifiers: [uniqueIdentifier],
                                },
                            });
                            taskId = task_id;
                            isFinishedInstallation = all_installed;
                        }
                        else {
                            const { task_id, all_installed } = await updatePackageFromMarketPlace({
                                original_plugin_unique_identifier: installedPayload?.uniqueIdentifier,
                                new_plugin_unique_identifier: uniqueIdentifier,
                            });
                            taskId = task_id;
                            isFinishedInstallation = all_installed;
                        }
                    }
                    if (isFinishedInstallation) {
                        return {
                            status: types_1.TaskStatus.success,
                            taskId: '',
                            uniqueIdentifier: '',
                        };
                    }
                    else {
                        return {
                            status: types_1.TaskStatus.running,
                            taskId,
                            uniqueIdentifier,
                        };
                    }
                }
                // eslint-disable-next-line unused-imports/no-unused-vars
                catch (e) {
                    return Promise.resolve({ status: types_1.TaskStatus.failed, taskId: '', uniqueIdentifier: '' });
                }
            }));
        },
        onSuccess,
    });
};
exports.useInstallOrUpdate = useInstallOrUpdate;
const useDebugKey = () => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'debugKey'],
        queryFn: () => (0, base_1.get)('/workspaces/current/plugin/debugging-key'),
    });
};
exports.useDebugKey = useDebugKey;
const useReferenceSettingKey = [NAME_SPACE, 'referenceSettings'];
const useReferenceSettings = () => {
    return (0, react_query_1.useQuery)({
        queryKey: useReferenceSettingKey,
        queryFn: () => (0, base_1.get)('/workspaces/current/plugin/preferences/fetch'),
    });
};
exports.useReferenceSettings = useReferenceSettings;
const useInvalidateReferenceSettings = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return () => {
        queryClient.invalidateQueries({
            queryKey: useReferenceSettingKey,
        });
    };
};
exports.useInvalidateReferenceSettings = useInvalidateReferenceSettings;
const useMutationReferenceSettings = ({ onSuccess, }) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (payload) => {
            return (0, base_1.post)('/workspaces/current/plugin/preferences/change', { body: payload });
        },
        onSuccess,
    });
};
exports.useMutationReferenceSettings = useMutationReferenceSettings;
const useRemoveAutoUpgrade = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: (payload) => {
            return (0, base_1.post)('/workspaces/current/plugin/preferences/autoupgrade/exclude', { body: payload });
        },
    });
};
exports.useRemoveAutoUpgrade = useRemoveAutoUpgrade;
const useMutationPluginsFromMarketplace = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: (pluginsSearchParams) => {
            const { query, sortBy, sortOrder, category, tags, exclude, type, page = 1, pageSize = 40, } = pluginsSearchParams;
            const pluginOrBundle = type === 'bundle' ? 'bundles' : 'plugins';
            return (0, base_1.postMarketplace)(`/${pluginOrBundle}/search/advanced`, {
                body: {
                    page,
                    page_size: pageSize,
                    query,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                    category: category !== 'all' ? category : '',
                    tags,
                    exclude,
                    type,
                },
            });
        },
    });
};
exports.useMutationPluginsFromMarketplace = useMutationPluginsFromMarketplace;
const useFetchPluginsInMarketPlaceByIds = (unique_identifiers, options) => {
    return (0, react_query_1.useQuery)({
        ...options,
        queryKey: [NAME_SPACE, 'fetchPluginsInMarketPlaceByIds', unique_identifiers],
        queryFn: () => (0, base_1.postMarketplace)('/plugins/identifier/batch', {
            body: {
                unique_identifiers,
            },
        }),
        enabled: unique_identifiers?.filter(i => !!i).length > 0,
        retry: 0,
    });
};
exports.useFetchPluginsInMarketPlaceByIds = useFetchPluginsInMarketPlaceByIds;
const useFetchPluginListOrBundleList = (pluginsSearchParams) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'fetchPluginListOrBundleList', pluginsSearchParams],
        queryFn: () => {
            const { query, sortBy, sortOrder, category, tags, exclude, type, page = 1, pageSize = 40, } = pluginsSearchParams;
            const pluginOrBundle = type === 'bundle' ? 'bundles' : 'plugins';
            return (0, base_1.postMarketplace)(`/${pluginOrBundle}/search/advanced`, {
                body: {
                    page,
                    page_size: pageSize,
                    query,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                    category: category !== 'all' ? category : '',
                    tags,
                    exclude,
                    type,
                },
            });
        },
    });
};
exports.useFetchPluginListOrBundleList = useFetchPluginListOrBundleList;
const useFetchPluginsInMarketPlaceByInfo = (infos) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'fetchPluginsInMarketPlaceByInfo', infos],
        queryFn: () => (0, base_1.postMarketplace)('/plugins/versions/batch', {
            body: {
                plugin_tuples: infos.map(info => ({
                    org: info.organization,
                    name: info.plugin,
                    version: info.version,
                })),
            },
        }),
        enabled: infos?.filter(i => !!i).length > 0,
        retry: 0,
    });
};
exports.useFetchPluginsInMarketPlaceByInfo = useFetchPluginsInMarketPlaceByInfo;
const usePluginTaskListKey = [NAME_SPACE, 'pluginTaskList'];
const usePluginTaskList = (category) => {
    const [initialized, setInitialized] = (0, react_1.useState)(false);
    const { canManagement, } = (0, use_reference_setting_1.default)();
    const { refreshPluginList } = (0, use_refresh_plugin_list_1.default)();
    const { data, isFetched, isRefetching, refetch, ...rest } = (0, react_query_1.useQuery)({
        enabled: canManagement,
        queryKey: usePluginTaskListKey,
        queryFn: () => (0, base_1.get)('/workspaces/current/plugin/tasks?page=1&page_size=100'),
        refetchInterval: (lastQuery) => {
            const lastData = lastQuery.state.data;
            const taskDone = lastData?.tasks.every(task => task.status === types_1.TaskStatus.success || task.status === types_1.TaskStatus.failed);
            return taskDone ? false : 5000;
        },
    });
    (0, react_1.useEffect)(() => {
        // After first fetch, refresh plugin list each time all tasks are done
        // Skip initialization period, because the query cache is not updated yet
        if (!initialized || isRefetching)
            return;
        const lastData = (0, object_1.cloneDeep)(data);
        const taskDone = lastData?.tasks.every(task => task.status === types_1.TaskStatus.success || task.status === types_1.TaskStatus.failed);
        const taskAllFailed = lastData?.tasks.every(task => task.status === types_1.TaskStatus.failed);
        if (taskDone && lastData?.tasks.length && !taskAllFailed)
            refreshPluginList(category ? { category } : undefined, !category);
    }, [isRefetching]);
    (0, react_1.useEffect)(() => {
        setInitialized(true);
    }, []);
    const handleRefetch = (0, react_1.useCallback)(() => {
        refetch();
    }, [refetch]);
    return {
        data,
        pluginTasks: data?.tasks || [],
        isFetched,
        handleRefetch,
        ...rest,
    };
};
exports.usePluginTaskList = usePluginTaskList;
const useMutationClearTaskPlugin = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: ({ taskId, pluginId }) => {
            const encodedPluginId = encodeURIComponent(pluginId);
            return (0, base_1.post)(`/workspaces/current/plugin/tasks/${taskId}/delete/${encodedPluginId}`);
        },
    });
};
exports.useMutationClearTaskPlugin = useMutationClearTaskPlugin;
const useMutationClearAllTaskPlugin = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: () => {
            return (0, base_1.post)('/workspaces/current/plugin/tasks/delete_all');
        },
    });
};
exports.useMutationClearAllTaskPlugin = useMutationClearAllTaskPlugin;
const usePluginManifestInfo = (pluginUID) => {
    return (0, react_query_1.useQuery)({
        enabled: !!pluginUID,
        queryKey: [[NAME_SPACE, 'manifest', pluginUID]],
        queryFn: () => (0, base_1.getMarketplace)(`/plugins/${pluginUID}`),
        retry: 0,
    });
};
exports.usePluginManifestInfo = usePluginManifestInfo;
const useDownloadPlugin = (info, needDownload) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'downloadPlugin', info],
        queryFn: () => (0, base_1.getMarketplace)(`/plugins/${info.organization}/${info.pluginName}/${info.version}/download`),
        enabled: needDownload,
        retry: 0,
    });
};
exports.useDownloadPlugin = useDownloadPlugin;
const useMutationCheckDependencies = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: (appId) => {
            return (0, base_1.get)(`/apps/imports/${appId}/check-dependencies`);
        },
    });
};
exports.useMutationCheckDependencies = useMutationCheckDependencies;
const useModelInList = (currentProvider, modelId) => {
    const provider = currentProvider?.provider;
    return (0, react_query_1.useQuery)({
        queryKey: ['modelInList', provider, modelId],
        queryFn: async () => {
            if (!modelId || !provider)
                return false;
            try {
                const modelsData = await (0, common_1.fetchModelProviderModelList)(`/workspaces/current/model-providers/${provider}/models`);
                return !!modelId && !!modelsData.data.find(item => item.model === modelId);
            }
            catch {
                return false;
            }
        },
        enabled: !!modelId && !!provider,
    });
};
exports.useModelInList = useModelInList;
const usePluginInfo = (providerName) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['pluginInfo', providerName],
        queryFn: async () => {
            if (!providerName)
                return null;
            const parts = providerName.split('/');
            const org = parts[0];
            const name = parts[1];
            try {
                const response = await (0, plugins_1.fetchPluginInfoFromMarketPlace)({ org, name });
                return response.data.plugin.category === types_1.PluginCategoryEnum.model ? response.data.plugin : null;
            }
            catch {
                return null;
            }
        },
        enabled: !!providerName,
    });
};
exports.usePluginInfo = usePluginInfo;
const useFetchDynamicOptions = (plugin_id, provider, action, parameter, provider_type, extra) => {
    return (0, react_query_1.useMutation)({
        mutationFn: () => (0, base_1.get)('/workspaces/current/plugin/parameters/dynamic-options', {
            params: {
                plugin_id,
                provider,
                action,
                parameter,
                provider_type,
                ...extra,
            },
        }),
    });
};
exports.useFetchDynamicOptions = useFetchDynamicOptions;
const usePluginReadme = ({ plugin_unique_identifier, language }) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['pluginReadme', plugin_unique_identifier, language],
        queryFn: () => (0, base_1.get)('/workspaces/current/plugin/readme', { params: { plugin_unique_identifier, language } }, { silent: true }),
        enabled: !!plugin_unique_identifier,
        retry: 0,
    });
};
exports.usePluginReadme = usePluginReadme;
const usePluginReadmeAsset = ({ file_name, plugin_unique_identifier }) => {
    const normalizedFileName = file_name?.replace(/(^\.\/_assets\/|^_assets\/)/, '');
    return (0, react_query_1.useQuery)({
        queryKey: ['pluginReadmeAsset', plugin_unique_identifier, normalizedFileName],
        queryFn: () => (0, base_1.get)('/workspaces/current/plugin/asset', { params: { plugin_unique_identifier, file_name: normalizedFileName } }, { silent: true }),
        enabled: !!plugin_unique_identifier && !!file_name && /(^\.\/_assets|^_assets)/.test(file_name),
    });
};
exports.usePluginReadmeAsset = usePluginReadmeAsset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBsdWdpbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtcGx1Z2lucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUE2QkEsdURBSzhCO0FBQzlCLDhDQUE2QztBQUM3QyxpQ0FBd0Q7QUFDeEQsbUhBQXdHO0FBQ3hHLHNFQUErRTtBQUMvRSxzR0FBNEY7QUFDNUYsMERBQStFO0FBQy9FLDZDQUE4RDtBQUM5RCwrQ0FBbUY7QUFDbkYsaUNBQW1FO0FBQ25FLDJDQUEwRDtBQUUxRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUE7QUFFNUIsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLFVBQVUsRUFBRSxxQkFBcUIsQ0FBQyxDQUFBO0FBQzlELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxFQUNoQyxTQUFTLEVBQ1QsT0FBTyxHQUlSLEVBQUUsRUFBRTtJQUNILE9BQU8sSUFBQSxzQkFBUSxFQUE4QjtRQUMzQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDO1FBQ25ELE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLFdBQUksRUFBOEIsbURBQW1ELEVBQUU7WUFDcEcsSUFBSSxFQUFFO2dCQUNKLFVBQVUsRUFBRSxTQUFTO2FBQ3RCO1NBQ0YsQ0FBQztRQUNGLE9BQU87UUFDUCxTQUFTLEVBQUUsQ0FBQyxFQUFFLGVBQWU7S0FDOUIsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBakJZLFFBQUEsaUJBQWlCLHFCQWlCN0I7QUFFRCxNQUFNLG1DQUFtQyxHQUFHLENBQUMsVUFBVSxFQUFFLCtCQUErQixDQUFDLENBQUE7QUFDbEYsTUFBTSxnQ0FBZ0MsR0FBRyxDQUFDLEVBQy9DLFVBQVUsR0FBRyw2QkFBNkIsRUFDMUMsT0FBTyxHQUFHLElBQUksRUFDZCxLQUFLLEdBQUcsRUFBRSxNQUtSLEVBQUUsRUFBRSxFQUFFO0lBQ1IsT0FBTyxJQUFBLHNCQUFRLEVBQVc7UUFDeEIsUUFBUSxFQUFFLENBQUMsR0FBRyxtQ0FBbUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDO1FBQ3JFLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsc0JBQWUsRUFDcEMsZ0JBQWdCLFVBQVUsVUFBVSxFQUNwQztnQkFDRSxJQUFJLEVBQUU7b0JBQ0osS0FBSztpQkFDTjthQUNGLENBQ0YsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBQSwwQkFBa0IsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLENBQUM7UUFDRCxPQUFPO1FBQ1AsU0FBUyxFQUFFLEVBQUUsR0FBRyxJQUFJO0tBQ3JCLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQXpCWSxRQUFBLGdDQUFnQyxvQ0F5QjVDO0FBRU0sTUFBTSwrQkFBK0IsR0FBRyxDQUFDLE9BQWdCLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzlFLE1BQU0sRUFDSixJQUFJLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFDbEIsU0FBUyxHQUNWLEdBQUcsSUFBQSx3Q0FBZ0MsRUFBQztRQUNuQyxVQUFVLEVBQUUsNkJBQTZCO1FBQ3pDLE9BQU87UUFDUCxLQUFLO0tBQ04sQ0FBQyxDQUFBO0lBRUYsT0FBTztRQUNMLE9BQU87UUFDUCxTQUFTO0tBQ1YsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQWRZLFFBQUEsK0JBQStCLG1DQWMzQztBQUVNLE1BQU0sa0NBQWtDLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUNqRixNQUFNLEVBQ0osSUFBSSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQ2xCLFNBQVMsR0FDVixHQUFHLElBQUEsd0NBQWdDLEVBQUM7UUFDbkMsVUFBVSxFQUFFLGdDQUFnQztRQUM1QyxPQUFPO1FBQ1AsS0FBSztLQUNOLENBQUMsQ0FBQTtJQUVGLE9BQU87UUFDTCxPQUFPO1FBQ1AsU0FBUztLQUNWLENBQUE7QUFDSCxDQUFDLENBQUE7QUFkWSxRQUFBLGtDQUFrQyxzQ0FjOUM7QUFFTSxNQUFNLHNCQUFzQixHQUFHLENBQUMsT0FBaUIsRUFBRSxRQUFRLEdBQUcsR0FBRyxFQUFFLEVBQUU7SUFDMUUsTUFBTSxZQUFZLEdBQUcsS0FBSyxFQUFFLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDL0MsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLFVBQUcsRUFDeEIsd0NBQXdDLFNBQVMsY0FBYyxRQUFRLEVBQUUsQ0FDMUUsQ0FBQTtRQUNELE9BQU8sUUFBUSxDQUFBO0lBQ2pCLENBQUMsQ0FBQTtJQUVELE1BQU0sRUFDSixJQUFJLEVBQ0osS0FBSyxFQUNMLGFBQWEsRUFDYixXQUFXLEVBQ1gsa0JBQWtCLEVBQ2xCLFNBQVMsRUFDVCxTQUFTLEdBQ1YsR0FBRyxJQUFBLDhCQUFnQixFQUFDO1FBQ25CLE9BQU8sRUFBRSxDQUFDLE9BQU87UUFDakIsUUFBUSxFQUFFLHlCQUF5QjtRQUNuQyxPQUFPLEVBQUUsWUFBWTtRQUNyQixnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNwQyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFBO1lBQ2pDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7WUFDaEMsTUFBTSxXQUFXLEdBQUcsV0FBVyxHQUFHLFFBQVEsQ0FBQTtZQUUxQyxJQUFJLFdBQVcsSUFBSSxVQUFVO2dCQUMzQixPQUFNO1lBRVIsT0FBTyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1FBQ3hCLENBQUM7UUFDRCxnQkFBZ0IsRUFBRSxDQUFDO0tBQ3BCLENBQUMsQ0FBQTtJQUVGLE1BQU0sT0FBTyxHQUFHLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUMvRCxNQUFNLEtBQUssR0FBRyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUE7SUFFdkMsT0FBTztRQUNMLElBQUksRUFBRSxPQUFPO1lBQ1gsQ0FBQyxDQUFDLFNBQVM7WUFDWCxDQUFDLENBQUM7Z0JBQ0UsT0FBTztnQkFDUCxLQUFLO2FBQ047UUFDTCxVQUFVLEVBQUUsQ0FBQyxXQUFXO1FBQ3hCLFlBQVksRUFBRSxHQUFHLEVBQUU7WUFDakIsYUFBYSxFQUFFLENBQUE7UUFDakIsQ0FBQztRQUNELFNBQVM7UUFDVCxVQUFVLEVBQUUsa0JBQWtCO1FBQzlCLEtBQUs7UUFDTCxTQUFTO0tBQ1YsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQXBEWSxRQUFBLHNCQUFzQiwwQkFvRGxDO0FBRU0sTUFBTSx5QkFBeUIsR0FBRyxDQUFDLFNBQW1CLEVBQUUsRUFBRTtJQUMvRCxPQUFPLElBQUEsc0JBQVEsRUFBaUM7UUFDOUMsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLHdCQUF3QixFQUFFLFNBQVMsQ0FBQztRQUMzRCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxXQUFJLEVBQWlDLGlEQUFpRCxFQUFFO1lBQ3JHLElBQUksRUFBRTtnQkFDSixVQUFVLEVBQUUsU0FBUzthQUN0QjtTQUNGLENBQUM7UUFDRixPQUFPLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNO1FBQzNCLFdBQVcsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtLQUM3RCxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFYWSxRQUFBLHlCQUF5Qiw2QkFXckM7QUFFTSxNQUFNLGdDQUFnQyxHQUFHLEdBQUcsRUFBRTtJQUNuRCxNQUFNLFdBQVcsR0FBRyxJQUFBLDRCQUFjLEdBQUUsQ0FBQTtJQUNwQyxNQUFNLHlCQUF5QixHQUFHLElBQUEsd0NBQTRCLEdBQUUsQ0FBQTtJQUNoRSxPQUFPLEdBQUcsRUFBRTtRQUNWLFdBQVcsQ0FBQyxpQkFBaUIsQ0FDM0I7WUFDRSxRQUFRLEVBQUUseUJBQXlCO1NBQ3BDLENBQ0YsQ0FBQTtRQUNELHlCQUF5QixFQUFFLENBQUE7SUFDN0IsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBWFksUUFBQSxnQ0FBZ0Msb0NBVzVDO0FBRU0sTUFBTSxnQ0FBZ0MsR0FBRyxDQUFDLE9BQThELEVBQUUsRUFBRTtJQUNqSCxPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixHQUFHLE9BQU87UUFDVixVQUFVLEVBQUUsQ0FBQyxnQkFBd0IsRUFBRSxFQUFFO1lBQ3ZDLE9BQU8sSUFBQSxXQUFJLEVBQXlCLGdEQUFnRCxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUseUJBQXlCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3BKLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFQWSxRQUFBLGdDQUFnQyxvQ0FPNUM7QUFFTSxNQUFNLCtCQUErQixHQUFHLENBQUMsT0FBOEQsRUFBRSxFQUFFO0lBQ2hILE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLEdBQUcsT0FBTztRQUNWLFVBQVUsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFO1lBQzNCLE9BQU8sSUFBQSxXQUFJLEVBQXlCLGdEQUFnRCxFQUFFO2dCQUNwRixJQUFJO2FBQ0wsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVRZLFFBQUEsK0JBQStCLG1DQVMzQztBQUVNLE1BQU0sbUNBQW1DLEdBQUcsQ0FBQyxzQkFBOEIsRUFBRSxFQUFFO0lBQ3BGLE9BQU8sSUFBQSxzQkFBUSxFQUFDO1FBQ2QsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDO1FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLFVBQUcsRUFBa0MsNENBQTRDLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSx3QkFBd0IsRUFBRSxzQkFBc0IsRUFBRSxFQUFFLENBQUM7UUFDbkssT0FBTyxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7S0FDbEMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBTlksUUFBQSxtQ0FBbUMsdUNBTS9DO0FBRU0sTUFBTSxzQkFBc0IsR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtJQUN6RCxPQUFPLElBQUEsc0JBQVEsRUFBZ0M7UUFDN0MsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRO1FBQ25CLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDO1FBQzVDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLHFCQUFjLEVBQWdDLFlBQVksUUFBUSxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0tBQ3ZJLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQU5ZLFFBQUEsc0JBQXNCLDBCQU1sQztBQUNNLE1BQU0sZ0NBQWdDLEdBQUcsR0FBRyxFQUFFO0lBQ25ELE1BQU0sV0FBVyxHQUFHLElBQUEsNEJBQWMsR0FBRSxDQUFBO0lBQ3BDLE9BQU8sQ0FBQyxRQUFnQixFQUFFLEVBQUU7UUFDMUIsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDakYsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBTFksUUFBQSxnQ0FBZ0Msb0NBSzVDO0FBRU0sTUFBTSwwQkFBMEIsR0FBRyxHQUFHLEVBQUU7SUFDN0MsT0FBTyxJQUFBLHlCQUFXLEVBQUM7UUFDakIsVUFBVSxFQUFFLENBQUMsZ0JBQXdCLEVBQUUsRUFBRTtZQUN2QyxPQUFPLElBQUEsV0FBSSxFQUF5Qix3Q0FBd0MsRUFBRTtnQkFDNUUsSUFBSSxFQUFFLEVBQUUseUJBQXlCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO2FBQ3hELENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFSWSxRQUFBLDBCQUEwQiw4QkFRdEM7QUFFTSxNQUFNLDJCQUEyQixHQUFHLEdBQUcsRUFBRTtJQUM5QyxPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixVQUFVLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUt6RSxFQUFFLEVBQUU7WUFDSCxPQUFPLElBQUEsV0FBSSxFQUF5QiwyQ0FBMkMsRUFBRTtnQkFDL0UsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxlQUFlO29CQUN4QixPQUFPLEVBQUUsZUFBZTtvQkFDeEIsd0JBQXdCLEVBQUUsZ0JBQWdCO2lCQUMzQzthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFsQlksUUFBQSwyQkFBMkIsK0JBa0J2QztBQUVNLE1BQU0sZUFBZSxHQUFHLENBQUMsT0FJL0IsRUFBRSxFQUFFO0lBQ0gsT0FBTyxJQUFBLHNCQUFRLEVBQUM7UUFDZCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQztRQUMvQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxXQUFJLEVBQXVCLDBDQUEwQyxFQUFFO1lBQ3BGLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQztRQUNGLEtBQUssRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBWlksUUFBQSxlQUFlLG1CQVkzQjtBQUVNLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxFQUNqQyxTQUFTLEdBR1YsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLFdBQVcsRUFBRSw0QkFBNEIsRUFBRSxHQUFHLElBQUEsdUNBQStCLEdBQUUsQ0FBQTtJQUV2RixPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixVQUFVLEVBQUUsQ0FBQyxJQUlaLEVBQUUsRUFBRTtZQUNILE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLElBQUksQ0FBQTtZQUUvQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxJQUFJLENBQUM7b0JBQ0gsTUFBTSxVQUFVLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFBO29CQUM5RSxNQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQTtvQkFDbEQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFBO29CQUN0QyxJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtvQkFDekIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFBO29CQUNmLElBQUksc0JBQXNCLEdBQUcsS0FBSyxDQUFBO29CQUVsQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7d0JBQzNCLE1BQU0sSUFBSSxHQUFHLElBQTBDLENBQUE7d0JBQ3ZELDBFQUEwRTt3QkFDMUUsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywrQkFBZ0MsQ0FBQTt3QkFDOUQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7NEJBQ3RCLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxHQUFHLE1BQU0sSUFBQSxXQUFJLEVBQXVCLDBDQUEwQyxFQUFFO2dDQUN6RyxJQUFJLEVBQUU7b0NBQ0osSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSztvQ0FDdEIsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBUTtvQ0FDbkQsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBUTtpQ0FDckQ7NkJBQ0YsQ0FBQyxDQUFBOzRCQUNGLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsK0JBQWdDLElBQUksaUJBQWlCLENBQUE7NEJBQ25GLDBDQUEwQzs0QkFDMUMsSUFBSSxnQkFBZ0IsS0FBSyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO2dDQUM1RCxPQUFPO29DQUNMLE1BQU0sRUFBRSxrQkFBVSxDQUFDLE9BQU87b0NBQzFCLE1BQU0sRUFBRSxFQUFFO29DQUNWLGdCQUFnQixFQUFFLEVBQUU7aUNBQ3JCLENBQUE7NEJBQ0gsQ0FBQzt3QkFDSCxDQUFDO3dCQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs0QkFDakIsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLElBQUEsV0FBSSxFQUF5QiwyQ0FBMkMsRUFBRTtnQ0FDakgsSUFBSSxFQUFFO29DQUNKLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUs7b0NBQ3RCLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVE7b0NBQ25ELE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVE7b0NBQ3BELHdCQUF3QixFQUFFLGdCQUFnQjtpQ0FDM0M7NkJBQ0YsQ0FBQyxDQUFBOzRCQUNGLE1BQU0sR0FBRyxPQUFPLENBQUE7NEJBQ2hCLHNCQUFzQixHQUFHLGFBQWEsQ0FBQTt3QkFDeEMsQ0FBQztvQkFDSCxDQUFDO29CQUNELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUUsQ0FBQzt3QkFDaEMsTUFBTSxJQUFJLEdBQUcsSUFBMEMsQ0FBQTt3QkFDdkQsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQ0FBcUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFBO3dCQUMzRixJQUFJLGdCQUFnQixLQUFLLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLENBQUM7NEJBQzVELE9BQU87Z0NBQ0wsTUFBTSxFQUFFLGtCQUFVLENBQUMsT0FBTztnQ0FDMUIsTUFBTSxFQUFFLEVBQUU7Z0NBQ1YsZ0JBQWdCLEVBQUUsRUFBRTs2QkFDckIsQ0FBQTt3QkFDSCxDQUFDO3dCQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs0QkFDakIsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLElBQUEsV0FBSSxFQUF5QixnREFBZ0QsRUFBRTtnQ0FDdEgsSUFBSSxFQUFFO29DQUNKLHlCQUF5QixFQUFFLENBQUMsZ0JBQWdCLENBQUM7aUNBQzlDOzZCQUNGLENBQUMsQ0FBQTs0QkFDRixNQUFNLEdBQUcsT0FBTyxDQUFBOzRCQUNoQixzQkFBc0IsR0FBRyxhQUFhLENBQUE7d0JBQ3hDLENBQUM7b0JBQ0gsQ0FBQztvQkFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7d0JBQzVCLE1BQU0sSUFBSSxHQUFHLElBQXlCLENBQUE7d0JBQ3RDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUE7d0JBQy9DLElBQUksZ0JBQWdCLEtBQUssZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQzs0QkFDNUQsT0FBTztnQ0FDTCxNQUFNLEVBQUUsa0JBQVUsQ0FBQyxPQUFPO2dDQUMxQixNQUFNLEVBQUUsRUFBRTtnQ0FDVixnQkFBZ0IsRUFBRSxFQUFFOzZCQUNyQixDQUFBO3dCQUNILENBQUM7d0JBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOzRCQUNqQixNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxHQUFHLE1BQU0sSUFBQSxXQUFJLEVBQXlCLHdDQUF3QyxFQUFFO2dDQUM5RyxJQUFJLEVBQUU7b0NBQ0oseUJBQXlCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQ0FDOUM7NkJBQ0YsQ0FBQyxDQUFBOzRCQUNGLE1BQU0sR0FBRyxPQUFPLENBQUE7NEJBQ2hCLHNCQUFzQixHQUFHLGFBQWEsQ0FBQTt3QkFDeEMsQ0FBQztvQkFDSCxDQUFDO29CQUNELElBQUksV0FBVyxFQUFFLENBQUM7d0JBQ2hCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQzs0QkFDNUIsTUFBTSxJQUFBLHlCQUFlLEVBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUE7NEJBQ25ELE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEdBQUcsTUFBTSxJQUFBLFdBQUksRUFBeUIsd0NBQXdDLEVBQUU7Z0NBQzlHLElBQUksRUFBRTtvQ0FDSix5QkFBeUIsRUFBRSxDQUFDLGdCQUFnQixDQUFDO2lDQUM5Qzs2QkFDRixDQUFDLENBQUE7NEJBQ0YsTUFBTSxHQUFHLE9BQU8sQ0FBQTs0QkFDaEIsc0JBQXNCLEdBQUcsYUFBYSxDQUFBO3dCQUN4QyxDQUFDOzZCQUNJLENBQUM7NEJBQ0osTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLDRCQUE0QixDQUFDO2dDQUNwRSxpQ0FBaUMsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7Z0NBQ3JFLDRCQUE0QixFQUFFLGdCQUFnQjs2QkFDL0MsQ0FBQyxDQUFBOzRCQUNGLE1BQU0sR0FBRyxPQUFPLENBQUE7NEJBQ2hCLHNCQUFzQixHQUFHLGFBQWEsQ0FBQTt3QkFDeEMsQ0FBQztvQkFDSCxDQUFDO29CQUNELElBQUksc0JBQXNCLEVBQUUsQ0FBQzt3QkFDM0IsT0FBTzs0QkFDTCxNQUFNLEVBQUUsa0JBQVUsQ0FBQyxPQUFPOzRCQUMxQixNQUFNLEVBQUUsRUFBRTs0QkFDVixnQkFBZ0IsRUFBRSxFQUFFO3lCQUNyQixDQUFBO29CQUNILENBQUM7eUJBQ0ksQ0FBQzt3QkFDSixPQUFPOzRCQUNMLE1BQU0sRUFBRSxrQkFBVSxDQUFDLE9BQU87NEJBQzFCLE1BQU07NEJBQ04sZ0JBQWdCO3lCQUNqQixDQUFBO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCx5REFBeUQ7Z0JBQ3pELE9BQU8sQ0FBQyxFQUFFLENBQUM7b0JBQ1QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtnQkFDekYsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDTCxDQUFDO1FBQ0QsU0FBUztLQUNWLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQTlJWSxRQUFBLGtCQUFrQixzQkE4STlCO0FBRU0sTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFO0lBQzlCLE9BQU8sSUFBQSxzQkFBUSxFQUFDO1FBQ2QsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUNsQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxVQUFHLEVBQWlCLDBDQUEwQyxDQUFDO0tBQy9FLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQUxZLFFBQUEsV0FBVyxlQUt2QjtBQUVELE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtBQUN6RCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUN2QyxPQUFPLElBQUEsc0JBQVEsRUFBQztRQUNkLFFBQVEsRUFBRSxzQkFBc0I7UUFDaEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEsVUFBRyxFQUFtQiw4Q0FBOEMsQ0FBQztLQUNyRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFMWSxRQUFBLG9CQUFvQix3QkFLaEM7QUFFTSxNQUFNLDhCQUE4QixHQUFHLEdBQUcsRUFBRTtJQUNqRCxNQUFNLFdBQVcsR0FBRyxJQUFBLDRCQUFjLEdBQUUsQ0FBQTtJQUNwQyxPQUFPLEdBQUcsRUFBRTtRQUNWLFdBQVcsQ0FBQyxpQkFBaUIsQ0FDM0I7WUFDRSxRQUFRLEVBQUUsc0JBQXNCO1NBQ2pDLENBQ0YsQ0FBQTtJQUNILENBQUMsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQVRZLFFBQUEsOEJBQThCLGtDQVMxQztBQUVNLE1BQU0sNEJBQTRCLEdBQUcsQ0FBQyxFQUMzQyxTQUFTLEdBR1YsRUFBRSxFQUFFO0lBQ0gsT0FBTyxJQUFBLHlCQUFXLEVBQUM7UUFDakIsVUFBVSxFQUFFLENBQUMsT0FBeUIsRUFBRSxFQUFFO1lBQ3hDLE9BQU8sSUFBQSxXQUFJLEVBQUMsK0NBQStDLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNqRixDQUFDO1FBQ0QsU0FBUztLQUNWLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVhZLFFBQUEsNEJBQTRCLGdDQVd4QztBQUVNLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxFQUFFO0lBQ3ZDLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFVBQVUsRUFBRSxDQUFDLE9BQThCLEVBQUUsRUFBRTtZQUM3QyxPQUFPLElBQUEsV0FBSSxFQUFDLDREQUE0RCxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDOUYsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQU5ZLFFBQUEsb0JBQW9CLHdCQU1oQztBQUVNLE1BQU0saUNBQWlDLEdBQUcsR0FBRyxFQUFFO0lBQ3BELE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFVBQVUsRUFBRSxDQUFDLG1CQUF3QyxFQUFFLEVBQUU7WUFDdkQsTUFBTSxFQUNKLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFDUixJQUFJLEVBQ0osT0FBTyxFQUNQLElBQUksRUFDSixJQUFJLEdBQUcsQ0FBQyxFQUNSLFFBQVEsR0FBRyxFQUFFLEdBQ2QsR0FBRyxtQkFBbUIsQ0FBQTtZQUN2QixNQUFNLGNBQWMsR0FBRyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtZQUNoRSxPQUFPLElBQUEsc0JBQWUsRUFBMkMsSUFBSSxjQUFjLGtCQUFrQixFQUFFO2dCQUNyRyxJQUFJLEVBQUU7b0JBQ0osSUFBSTtvQkFDSixTQUFTLEVBQUUsUUFBUTtvQkFDbkIsS0FBSztvQkFDTCxPQUFPLEVBQUUsTUFBTTtvQkFDZixVQUFVLEVBQUUsU0FBUztvQkFDckIsUUFBUSxFQUFFLFFBQVEsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDNUMsSUFBSTtvQkFDSixPQUFPO29CQUNQLElBQUk7aUJBQ0w7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBOUJZLFFBQUEsaUNBQWlDLHFDQThCN0M7QUFFTSxNQUFNLGlDQUFpQyxHQUFHLENBQUMsa0JBQTRCLEVBQUUsT0FBZ0UsRUFBRSxFQUFFO0lBQ2xKLE9BQU8sSUFBQSxzQkFBUSxFQUFDO1FBQ2QsR0FBRyxPQUFPO1FBQ1YsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLGdDQUFnQyxFQUFFLGtCQUFrQixDQUFDO1FBQzVFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLHNCQUFlLEVBQTJDLDJCQUEyQixFQUFFO1lBQ3BHLElBQUksRUFBRTtnQkFDSixrQkFBa0I7YUFDbkI7U0FDRixDQUFDO1FBQ0YsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUN4RCxLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVpZLFFBQUEsaUNBQWlDLHFDQVk3QztBQUVNLE1BQU0sOEJBQThCLEdBQUcsQ0FBQyxtQkFBd0MsRUFBRSxFQUFFO0lBQ3pGLE9BQU8sSUFBQSxzQkFBUSxFQUFDO1FBQ2QsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLDZCQUE2QixFQUFFLG1CQUFtQixDQUFDO1FBQzFFLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDWixNQUFNLEVBQ0osS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsUUFBUSxFQUNSLElBQUksRUFDSixPQUFPLEVBQ1AsSUFBSSxFQUNKLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLEVBQUUsR0FDZCxHQUFHLG1CQUFtQixDQUFBO1lBQ3ZCLE1BQU0sY0FBYyxHQUFHLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO1lBQ2hFLE9BQU8sSUFBQSxzQkFBZSxFQUEyQyxJQUFJLGNBQWMsa0JBQWtCLEVBQUU7Z0JBQ3JHLElBQUksRUFBRTtvQkFDSixJQUFJO29CQUNKLFNBQVMsRUFBRSxRQUFRO29CQUNuQixLQUFLO29CQUNMLE9BQU8sRUFBRSxNQUFNO29CQUNmLFVBQVUsRUFBRSxTQUFTO29CQUNyQixRQUFRLEVBQUUsUUFBUSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM1QyxJQUFJO29CQUNKLE9BQU87b0JBQ1AsSUFBSTtpQkFDTDthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUEvQlksUUFBQSw4QkFBOEIsa0NBK0IxQztBQUVNLE1BQU0sa0NBQWtDLEdBQUcsQ0FBQyxLQUE0QixFQUFFLEVBQUU7SUFDakYsT0FBTyxJQUFBLHNCQUFRLEVBQUM7UUFDZCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsaUNBQWlDLEVBQUUsS0FBSyxDQUFDO1FBQ2hFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLHNCQUFlLEVBQWlELHlCQUF5QixFQUFFO1lBQ3hHLElBQUksRUFBRTtnQkFDSixhQUFhLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2hDLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWTtvQkFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87aUJBQ3RCLENBQUMsQ0FBQzthQUNKO1NBQ0YsQ0FBQztRQUNGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQzNDLEtBQUssRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBZlksUUFBQSxrQ0FBa0Msc0NBZTlDO0FBRUQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3BELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxRQUFzQyxFQUFFLEVBQUU7SUFDMUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDckQsTUFBTSxFQUNKLGFBQWEsR0FDZCxHQUFHLElBQUEsK0JBQW1CLEdBQUUsQ0FBQTtJQUN6QixNQUFNLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxJQUFBLGlDQUFvQixHQUFFLENBQUE7SUFDcEQsTUFBTSxFQUNKLElBQUksRUFDSixTQUFTLEVBQ1QsWUFBWSxFQUNaLE9BQU8sRUFDUCxHQUFHLElBQUksRUFDUixHQUFHLElBQUEsc0JBQVEsRUFBQztRQUNYLE9BQU8sRUFBRSxhQUFhO1FBQ3RCLFFBQVEsRUFBRSxvQkFBb0I7UUFDOUIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEsVUFBRyxFQUEwQix1REFBdUQsQ0FBQztRQUNwRyxlQUFlLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUM3QixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQTtZQUNyQyxNQUFNLFFBQVEsR0FBRyxRQUFRLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssa0JBQVUsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3ZILE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUNoQyxDQUFDO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLHNFQUFzRTtRQUN0RSx5RUFBeUU7UUFDekUsSUFBSSxDQUFDLFdBQVcsSUFBSSxZQUFZO1lBQzlCLE9BQU07UUFFUixNQUFNLFFBQVEsR0FBRyxJQUFBLGtCQUFTLEVBQUMsSUFBSSxDQUFDLENBQUE7UUFDaEMsTUFBTSxRQUFRLEdBQUcsUUFBUSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLGtCQUFVLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssa0JBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN2SCxNQUFNLGFBQWEsR0FBRyxRQUFRLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssa0JBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN0RixJQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWE7WUFDdEQsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM1RSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO0lBRWxCLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDYixjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRU4sTUFBTSxhQUFhLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNyQyxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7SUFFYixPQUFPO1FBQ0wsSUFBSTtRQUNKLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDOUIsU0FBUztRQUNULGFBQWE7UUFDYixHQUFHLElBQUk7S0FDUixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBbkRZLFFBQUEsaUJBQWlCLHFCQW1EN0I7QUFFTSxNQUFNLDBCQUEwQixHQUFHLEdBQUcsRUFBRTtJQUM3QyxPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixVQUFVLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQXdDLEVBQUUsRUFBRTtZQUN6RSxNQUFNLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNwRCxPQUFPLElBQUEsV0FBSSxFQUF1QixvQ0FBb0MsTUFBTSxXQUFXLGVBQWUsRUFBRSxDQUFDLENBQUE7UUFDM0csQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVBZLFFBQUEsMEJBQTBCLDhCQU90QztBQUVNLE1BQU0sNkJBQTZCLEdBQUcsR0FBRyxFQUFFO0lBQ2hELE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDZixPQUFPLElBQUEsV0FBSSxFQUF1Qiw2Q0FBNkMsQ0FBQyxDQUFBO1FBQ2xGLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFOWSxRQUFBLDZCQUE2QixpQ0FNekM7QUFFTSxNQUFNLHFCQUFxQixHQUFHLENBQUMsU0FBaUIsRUFBRSxFQUFFO0lBQ3pELE9BQU8sSUFBQSxzQkFBUSxFQUFDO1FBQ2QsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTO1FBQ3BCLFFBQVEsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxxQkFBYyxFQUFnRixZQUFZLFNBQVMsRUFBRSxDQUFDO1FBQ3JJLEtBQUssRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBUFksUUFBQSxxQkFBcUIseUJBT2pDO0FBRU0sTUFBTSxpQkFBaUIsR0FBRyxDQUFDLElBQW1FLEVBQUUsWUFBcUIsRUFBRSxFQUFFO0lBQzlILE9BQU8sSUFBQSxzQkFBUSxFQUFDO1FBQ2QsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQztRQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxxQkFBYyxFQUFPLFlBQVksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxPQUFPLFdBQVcsQ0FBQztRQUNoSCxPQUFPLEVBQUUsWUFBWTtRQUNyQixLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVBZLFFBQUEsaUJBQWlCLHFCQU83QjtBQUVNLE1BQU0sNEJBQTRCLEdBQUcsR0FBRyxFQUFFO0lBQy9DLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFVBQVUsRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQzVCLE9BQU8sSUFBQSxVQUFHLEVBQXdDLGlCQUFpQixLQUFLLHFCQUFxQixDQUFDLENBQUE7UUFDaEcsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQU5ZLFFBQUEsNEJBQTRCLGdDQU14QztBQUVNLE1BQU0sY0FBYyxHQUFHLENBQUMsZUFBK0IsRUFBRSxPQUFnQixFQUFFLEVBQUU7SUFDbEYsTUFBTSxRQUFRLEdBQUcsZUFBZSxFQUFFLFFBQVEsQ0FBQTtJQUMxQyxPQUFPLElBQUEsc0JBQVEsRUFBQztRQUNkLFFBQVEsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDO1FBQzVDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsQixJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsUUFBUTtnQkFDdkIsT0FBTyxLQUFLLENBQUE7WUFDZCxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLG9DQUEyQixFQUFDLHVDQUF1QyxRQUFRLFNBQVMsQ0FBQyxDQUFBO2dCQUM5RyxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQTtZQUM1RSxDQUFDO1lBQ0QsTUFBTSxDQUFDO2dCQUNMLE9BQU8sS0FBSyxDQUFBO1lBQ2QsQ0FBQztRQUNILENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsUUFBUTtLQUNqQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFqQlksUUFBQSxjQUFjLGtCQWlCMUI7QUFFTSxNQUFNLGFBQWEsR0FBRyxDQUFDLFlBQXFCLEVBQUUsRUFBRTtJQUNyRCxPQUFPLElBQUEsc0JBQVEsRUFBQztRQUNkLFFBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7UUFDdEMsT0FBTyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxZQUFZO2dCQUNmLE9BQU8sSUFBSSxDQUFBO1lBQ2IsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNyQyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3JCLElBQUksQ0FBQztnQkFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsd0NBQThCLEVBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtnQkFDcEUsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssMEJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1lBQ2pHLENBQUM7WUFDRCxNQUFNLENBQUM7Z0JBQ0wsT0FBTyxJQUFJLENBQUE7WUFDYixDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDLENBQUMsWUFBWTtLQUN4QixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFuQlksUUFBQSxhQUFhLGlCQW1CekI7QUFFTSxNQUFNLHNCQUFzQixHQUFHLENBQUMsU0FBaUIsRUFBRSxRQUFnQixFQUFFLE1BQWMsRUFBRSxTQUFpQixFQUFFLGFBQXNCLEVBQUUsS0FBMkIsRUFBRSxFQUFFO0lBQ3BLLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLFVBQUcsRUFBNEIsdURBQXVELEVBQUU7WUFDeEcsTUFBTSxFQUFFO2dCQUNOLFNBQVM7Z0JBQ1QsUUFBUTtnQkFDUixNQUFNO2dCQUNOLFNBQVM7Z0JBQ1QsYUFBYTtnQkFDYixHQUFHLEtBQUs7YUFDVDtTQUNGLENBQUM7S0FDSCxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFiWSxRQUFBLHNCQUFzQiwwQkFhbEM7QUFFTSxNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxFQUEyRCxFQUFFLEVBQUU7SUFDakksT0FBTyxJQUFBLHNCQUFRLEVBQUM7UUFDZCxRQUFRLEVBQUUsQ0FBQyxjQUFjLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxDQUFDO1FBQzlELE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLFVBQUcsRUFBcUIsbUNBQW1DLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSx3QkFBd0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2pKLE9BQU8sRUFBRSxDQUFDLENBQUMsd0JBQXdCO1FBQ25DLEtBQUssRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBUFksUUFBQSxlQUFlLG1CQU8zQjtBQUVNLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSx3QkFBd0IsRUFBNkQsRUFBRSxFQUFFO0lBQ3pJLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxFQUFFLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNoRixPQUFPLElBQUEsc0JBQVEsRUFBQztRQUNkLFFBQVEsRUFBRSxDQUFDLG1CQUFtQixFQUFFLHdCQUF3QixFQUFFLGtCQUFrQixDQUFDO1FBQzdFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLFVBQUcsRUFBTyxrQ0FBa0MsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLHdCQUF3QixFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDdkosT0FBTyxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLHlCQUF5QixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDaEcsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBUFksUUFBQSxvQkFBb0Isd0JBT2hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNdXRhdGVPcHRpb25zLCBRdWVyeU9wdGlvbnMgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgdHlwZSB7XG4gIEZvcm1PcHRpb24sXG4gIE1vZGVsUHJvdmlkZXIsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB0eXBlIHtcbiAgUGx1Z2luc1NlYXJjaFBhcmFtcyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL21hcmtldHBsYWNlL3R5cGVzJ1xuaW1wb3J0IHR5cGUge1xuICBEZWJ1Z0luZm8gYXMgRGVidWdJbmZvVHlwZXMsXG4gIERlcGVuZGVuY3ksXG4gIEdpdEh1Ykl0ZW1BbmRNYXJrZXRQbGFjZURlcGVuZGVuY3ksXG4gIEluc3RhbGxlZExhdGVzdFZlcnNpb25SZXNwb25zZSxcbiAgSW5zdGFsbGVkUGx1Z2luTGlzdFdpdGhUb3RhbFJlc3BvbnNlLFxuICBJbnN0YWxsUGFja2FnZVJlc3BvbnNlLFxuICBJbnN0YWxsU3RhdHVzUmVzcG9uc2UsXG4gIFBhY2thZ2VEZXBlbmRlbmN5LFxuICBQbHVnaW4sXG4gIFBsdWdpbkRlY2xhcmF0aW9uLFxuICBQbHVnaW5EZXRhaWwsXG4gIFBsdWdpbkluZm9Gcm9tTWFya2V0UGxhY2UsXG4gIFBsdWdpbnNGcm9tTWFya2V0cGxhY2VCeUluZm9SZXNwb25zZSxcbiAgUGx1Z2luc0Zyb21NYXJrZXRwbGFjZVJlc3BvbnNlLFxuICBQbHVnaW5UYXNrLFxuICBSZWZlcmVuY2VTZXR0aW5nLFxuICB1cGxvYWRHaXRIdWJSZXNwb25zZSxcbiAgVmVyc2lvbkluZm8sXG4gIFZlcnNpb25MaXN0UmVzcG9uc2UsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7XG4gIHVzZUluZmluaXRlUXVlcnksXG4gIHVzZU11dGF0aW9uLFxuICB1c2VRdWVyeSxcbiAgdXNlUXVlcnlDbGllbnQsXG59IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gJ2VzLXRvb2xraXQvb2JqZWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB1c2VSZWZyZXNoUGx1Z2luTGlzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvaW5zdGFsbC1wbHVnaW4vaG9va3MvdXNlLXJlZnJlc2gtcGx1Z2luLWxpc3QnXG5pbXBvcnQgeyBnZXRGb3JtYXR0ZWRQbHVnaW4gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvbWFya2V0cGxhY2UvdXRpbHMnXG5pbXBvcnQgdXNlUmVmZXJlbmNlU2V0dGluZyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvcGx1Z2luLXBhZ2UvdXNlLXJlZmVyZW5jZS1zZXR0aW5nJ1xuaW1wb3J0IHsgUGx1Z2luQ2F0ZWdvcnlFbnVtLCBUYXNrU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0IHsgZmV0Y2hNb2RlbFByb3ZpZGVyTW9kZWxMaXN0IH0gZnJvbSAnQC9zZXJ2aWNlL2NvbW1vbidcbmltcG9ydCB7IGZldGNoUGx1Z2luSW5mb0Zyb21NYXJrZXRQbGFjZSwgdW5pbnN0YWxsUGx1Z2luIH0gZnJvbSAnQC9zZXJ2aWNlL3BsdWdpbnMnXG5pbXBvcnQgeyBnZXQsIGdldE1hcmtldHBsYWNlLCBwb3N0LCBwb3N0TWFya2V0cGxhY2UgfSBmcm9tICcuL2Jhc2UnXG5pbXBvcnQgeyB1c2VJbnZhbGlkYXRlQWxsQnVpbHRJblRvb2xzIH0gZnJvbSAnLi91c2UtdG9vbHMnXG5cbmNvbnN0IE5BTUVfU1BBQ0UgPSAncGx1Z2lucydcblxuY29uc3QgdXNlSW5zdGFsbGVkUGx1Z2luTGlzdEtleSA9IFtOQU1FX1NQQUNFLCAnaW5zdGFsbGVkUGx1Z2luTGlzdCddXG5leHBvcnQgY29uc3QgdXNlQ2hlY2tJbnN0YWxsZWQgPSAoe1xuICBwbHVnaW5JZHMsXG4gIGVuYWJsZWQsXG59OiB7XG4gIHBsdWdpbklkczogc3RyaW5nW11cbiAgZW5hYmxlZDogYm9vbGVhblxufSkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8eyBwbHVnaW5zOiBQbHVnaW5EZXRhaWxbXSB9Pih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnY2hlY2tJbnN0YWxsZWQnLCBwbHVnaW5JZHNdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IHBvc3Q8eyBwbHVnaW5zOiBQbHVnaW5EZXRhaWxbXSB9PignL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vbGlzdC9pbnN0YWxsYXRpb25zL2lkcycsIHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcGx1Z2luX2lkczogcGx1Z2luSWRzLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBlbmFibGVkLFxuICAgIHN0YWxlVGltZTogMCwgLy8gYWx3YXlzIGZyZXNoXG4gIH0pXG59XG5cbmNvbnN0IHVzZVJlY29tbWVuZGVkTWFya2V0cGxhY2VQbHVnaW5zS2V5ID0gW05BTUVfU1BBQ0UsICdyZWNvbW1lbmRlZE1hcmtldHBsYWNlUGx1Z2lucyddXG5leHBvcnQgY29uc3QgdXNlUmVjb21tZW5kZWRNYXJrZXRwbGFjZVBsdWdpbnMgPSAoe1xuICBjb2xsZWN0aW9uID0gJ19fcmVjb21tZW5kZWQtcGx1Z2lucy10b29scycsXG4gIGVuYWJsZWQgPSB0cnVlLFxuICBsaW1pdCA9IDE1LFxufToge1xuICBjb2xsZWN0aW9uPzogc3RyaW5nXG4gIGVuYWJsZWQ/OiBib29sZWFuXG4gIGxpbWl0PzogbnVtYmVyXG59ID0ge30pID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5PFBsdWdpbltdPih7XG4gICAgcXVlcnlLZXk6IFsuLi51c2VSZWNvbW1lbmRlZE1hcmtldHBsYWNlUGx1Z2luc0tleSwgY29sbGVjdGlvbiwgbGltaXRdLFxuICAgIHF1ZXJ5Rm46IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcG9zdE1hcmtldHBsYWNlPHsgZGF0YTogeyBwbHVnaW5zOiBQbHVnaW5bXSB9IH0+KFxuICAgICAgICBgL2NvbGxlY3Rpb25zLyR7Y29sbGVjdGlvbn0vcGx1Z2luc2AsXG4gICAgICAgIHtcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBsaW1pdCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucGx1Z2lucy5tYXAocGx1Z2luID0+IGdldEZvcm1hdHRlZFBsdWdpbihwbHVnaW4pKVxuICAgIH0sXG4gICAgZW5hYmxlZCxcbiAgICBzdGFsZVRpbWU6IDYwICogMTAwMCxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUZlYXR1cmVkVG9vbHNSZWNvbW1lbmRhdGlvbnMgPSAoZW5hYmxlZDogYm9vbGVhbiwgbGltaXQgPSAxNSkgPT4ge1xuICBjb25zdCB7XG4gICAgZGF0YTogcGx1Z2lucyA9IFtdLFxuICAgIGlzTG9hZGluZyxcbiAgfSA9IHVzZVJlY29tbWVuZGVkTWFya2V0cGxhY2VQbHVnaW5zKHtcbiAgICBjb2xsZWN0aW9uOiAnX19yZWNvbW1lbmRlZC1wbHVnaW5zLXRvb2xzJyxcbiAgICBlbmFibGVkLFxuICAgIGxpbWl0LFxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgcGx1Z2lucyxcbiAgICBpc0xvYWRpbmcsXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZUZlYXR1cmVkVHJpZ2dlcnNSZWNvbW1lbmRhdGlvbnMgPSAoZW5hYmxlZDogYm9vbGVhbiwgbGltaXQgPSAxNSkgPT4ge1xuICBjb25zdCB7XG4gICAgZGF0YTogcGx1Z2lucyA9IFtdLFxuICAgIGlzTG9hZGluZyxcbiAgfSA9IHVzZVJlY29tbWVuZGVkTWFya2V0cGxhY2VQbHVnaW5zKHtcbiAgICBjb2xsZWN0aW9uOiAnX19yZWNvbW1lbmRlZC1wbHVnaW5zLXRyaWdnZXJzJyxcbiAgICBlbmFibGVkLFxuICAgIGxpbWl0LFxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgcGx1Z2lucyxcbiAgICBpc0xvYWRpbmcsXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZUluc3RhbGxlZFBsdWdpbkxpc3QgPSAoZGlzYWJsZT86IGJvb2xlYW4sIHBhZ2VTaXplID0gMTAwKSA9PiB7XG4gIGNvbnN0IGZldGNoUGx1Z2lucyA9IGFzeW5jICh7IHBhZ2VQYXJhbSA9IDEgfSkgPT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0PEluc3RhbGxlZFBsdWdpbkxpc3RXaXRoVG90YWxSZXNwb25zZT4oXG4gICAgICBgL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vbGlzdD9wYWdlPSR7cGFnZVBhcmFtfSZwYWdlX3NpemU9JHtwYWdlU2l6ZX1gLFxuICAgIClcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICBkYXRhLFxuICAgIGVycm9yLFxuICAgIGZldGNoTmV4dFBhZ2UsXG4gICAgaGFzTmV4dFBhZ2UsXG4gICAgaXNGZXRjaGluZ05leHRQYWdlLFxuICAgIGlzTG9hZGluZyxcbiAgICBpc1N1Y2Nlc3MsXG4gIH0gPSB1c2VJbmZpbml0ZVF1ZXJ5KHtcbiAgICBlbmFibGVkOiAhZGlzYWJsZSxcbiAgICBxdWVyeUtleTogdXNlSW5zdGFsbGVkUGx1Z2luTGlzdEtleSxcbiAgICBxdWVyeUZuOiBmZXRjaFBsdWdpbnMsXG4gICAgZ2V0TmV4dFBhZ2VQYXJhbTogKGxhc3RQYWdlLCBwYWdlcykgPT4ge1xuICAgICAgY29uc3QgdG90YWxJdGVtcyA9IGxhc3RQYWdlLnRvdGFsXG4gICAgICBjb25zdCBjdXJyZW50UGFnZSA9IHBhZ2VzLmxlbmd0aFxuICAgICAgY29uc3QgaXRlbXNMb2FkZWQgPSBjdXJyZW50UGFnZSAqIHBhZ2VTaXplXG5cbiAgICAgIGlmIChpdGVtc0xvYWRlZCA+PSB0b3RhbEl0ZW1zKVxuICAgICAgICByZXR1cm5cblxuICAgICAgcmV0dXJuIGN1cnJlbnRQYWdlICsgMVxuICAgIH0sXG4gICAgaW5pdGlhbFBhZ2VQYXJhbTogMSxcbiAgfSlcblxuICBjb25zdCBwbHVnaW5zID0gZGF0YT8ucGFnZXMuZmxhdE1hcChwYWdlID0+IHBhZ2UucGx1Z2lucykgPz8gW11cbiAgY29uc3QgdG90YWwgPSBkYXRhPy5wYWdlc1swXS50b3RhbCA/PyAwXG5cbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBkaXNhYmxlXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiB7XG4gICAgICAgICAgcGx1Z2lucyxcbiAgICAgICAgICB0b3RhbCxcbiAgICAgICAgfSxcbiAgICBpc0xhc3RQYWdlOiAhaGFzTmV4dFBhZ2UsXG4gICAgbG9hZE5leHRQYWdlOiAoKSA9PiB7XG4gICAgICBmZXRjaE5leHRQYWdlKClcbiAgICB9LFxuICAgIGlzTG9hZGluZyxcbiAgICBpc0ZldGNoaW5nOiBpc0ZldGNoaW5nTmV4dFBhZ2UsXG4gICAgZXJyb3IsXG4gICAgaXNTdWNjZXNzLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbnN0YWxsZWRMYXRlc3RWZXJzaW9uID0gKHBsdWdpbklkczogc3RyaW5nW10pID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5PEluc3RhbGxlZExhdGVzdFZlcnNpb25SZXNwb25zZT4oe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2luc3RhbGxlZExhdGVzdFZlcnNpb24nLCBwbHVnaW5JZHNdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IHBvc3Q8SW5zdGFsbGVkTGF0ZXN0VmVyc2lvblJlc3BvbnNlPignL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vbGlzdC9sYXRlc3QtdmVyc2lvbnMnLCB7XG4gICAgICBib2R5OiB7XG4gICAgICAgIHBsdWdpbl9pZHM6IHBsdWdpbklkcyxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgZW5hYmxlZDogISFwbHVnaW5JZHMubGVuZ3RoLFxuICAgIGluaXRpYWxEYXRhOiBwbHVnaW5JZHMubGVuZ3RoID8gdW5kZWZpbmVkIDogeyB2ZXJzaW9uczoge30gfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUludmFsaWRhdGVJbnN0YWxsZWRQbHVnaW5MaXN0ID0gKCkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcbiAgY29uc3QgaW52YWxpZGF0ZUFsbEJ1aWx0SW5Ub29scyA9IHVzZUludmFsaWRhdGVBbGxCdWlsdEluVG9vbHMoKVxuICByZXR1cm4gKCkgPT4ge1xuICAgIHF1ZXJ5Q2xpZW50LmludmFsaWRhdGVRdWVyaWVzKFxuICAgICAge1xuICAgICAgICBxdWVyeUtleTogdXNlSW5zdGFsbGVkUGx1Z2luTGlzdEtleSxcbiAgICAgIH0sXG4gICAgKVxuICAgIGludmFsaWRhdGVBbGxCdWlsdEluVG9vbHMoKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZSA9IChvcHRpb25zPzogTXV0YXRlT3B0aW9uczxJbnN0YWxsUGFja2FnZVJlc3BvbnNlLCBFcnJvciwgc3RyaW5nPikgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIC4uLm9wdGlvbnMsXG4gICAgbXV0YXRpb25GbjogKHVuaXF1ZUlkZW50aWZpZXI6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIHBvc3Q8SW5zdGFsbFBhY2thZ2VSZXNwb25zZT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL2luc3RhbGwvbWFya2V0cGxhY2UnLCB7IGJvZHk6IHsgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyczogW3VuaXF1ZUlkZW50aWZpZXJdIH0gfSlcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlVXBkYXRlUGFja2FnZUZyb21NYXJrZXRQbGFjZSA9IChvcHRpb25zPzogTXV0YXRlT3B0aW9uczxJbnN0YWxsUGFja2FnZVJlc3BvbnNlLCBFcnJvciwgb2JqZWN0PikgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIC4uLm9wdGlvbnMsXG4gICAgbXV0YXRpb25GbjogKGJvZHk6IG9iamVjdCkgPT4ge1xuICAgICAgcmV0dXJuIHBvc3Q8SW5zdGFsbFBhY2thZ2VSZXNwb25zZT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL3VwZ3JhZGUvbWFya2V0cGxhY2UnLCB7XG4gICAgICAgIGJvZHksXG4gICAgICB9KVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VQbHVnaW5EZWNsYXJhdGlvbkZyb21NYXJrZXRQbGFjZSA9IChwbHVnaW5VbmlxdWVJZGVudGlmaWVyOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5KHtcbiAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdwbHVnaW5EZWNsYXJhdGlvbicsIHBsdWdpblVuaXF1ZUlkZW50aWZpZXJdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDx7IG1hbmlmZXN0OiBQbHVnaW5EZWNsYXJhdGlvbiB9PignL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vbWFya2V0cGxhY2UvcGtnJywgeyBwYXJhbXM6IHsgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiBwbHVnaW5VbmlxdWVJZGVudGlmaWVyIH0gfSksXG4gICAgZW5hYmxlZDogISFwbHVnaW5VbmlxdWVJZGVudGlmaWVyLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlVmVyc2lvbkxpc3RPZlBsdWdpbiA9IChwbHVnaW5JRDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeTx7IGRhdGE6IFZlcnNpb25MaXN0UmVzcG9uc2UgfT4oe1xuICAgIGVuYWJsZWQ6ICEhcGx1Z2luSUQsXG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAndmVyc2lvbnMnLCBwbHVnaW5JRF0sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0TWFya2V0cGxhY2U8eyBkYXRhOiBWZXJzaW9uTGlzdFJlc3BvbnNlIH0+KGAvcGx1Z2lucy8ke3BsdWdpbklEfS92ZXJzaW9uc2AsIHsgcGFyYW1zOiB7IHBhZ2U6IDEsIHBhZ2Vfc2l6ZTogMTAwIH0gfSksXG4gIH0pXG59XG5leHBvcnQgY29uc3QgdXNlSW52YWxpZGF0ZVZlcnNpb25MaXN0T2ZQbHVnaW4gPSAoKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gdXNlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gKHBsdWdpbklEOiBzdHJpbmcpID0+IHtcbiAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyh7IHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ3ZlcnNpb25zJywgcGx1Z2luSURdIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZUluc3RhbGxQYWNrYWdlRnJvbUxvY2FsID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46ICh1bmlxdWVJZGVudGlmaWVyOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBwb3N0PEluc3RhbGxQYWNrYWdlUmVzcG9uc2U+KCcvd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi9pbnN0YWxsL3BrZycsIHtcbiAgICAgICAgYm9keTogeyBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXJzOiBbdW5pcXVlSWRlbnRpZmllcl0gfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUluc3RhbGxQYWNrYWdlRnJvbUdpdEh1YiA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbkZuOiAoeyByZXBvVXJsLCBzZWxlY3RlZFZlcnNpb24sIHNlbGVjdGVkUGFja2FnZSwgdW5pcXVlSWRlbnRpZmllciB9OiB7XG4gICAgICByZXBvVXJsOiBzdHJpbmdcbiAgICAgIHNlbGVjdGVkVmVyc2lvbjogc3RyaW5nXG4gICAgICBzZWxlY3RlZFBhY2thZ2U6IHN0cmluZ1xuICAgICAgdW5pcXVlSWRlbnRpZmllcjogc3RyaW5nXG4gICAgfSkgPT4ge1xuICAgICAgcmV0dXJuIHBvc3Q8SW5zdGFsbFBhY2thZ2VSZXNwb25zZT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL2luc3RhbGwvZ2l0aHViJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgcmVwbzogcmVwb1VybCxcbiAgICAgICAgICB2ZXJzaW9uOiBzZWxlY3RlZFZlcnNpb24sXG4gICAgICAgICAgcGFja2FnZTogc2VsZWN0ZWRQYWNrYWdlLFxuICAgICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogdW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVVwbG9hZEdpdEh1YiA9IChwYXlsb2FkOiB7XG4gIHJlcG86IHN0cmluZ1xuICB2ZXJzaW9uOiBzdHJpbmdcbiAgcGFja2FnZTogc3RyaW5nXG59KSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeSh7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAndXBsb2FkR2l0SHViJywgcGF5bG9hZF0sXG4gICAgcXVlcnlGbjogKCkgPT4gcG9zdDx1cGxvYWRHaXRIdWJSZXNwb25zZT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL3VwbG9hZC9naXRodWInLCB7XG4gICAgICBib2R5OiBwYXlsb2FkLFxuICAgIH0pLFxuICAgIHJldHJ5OiAwLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW5zdGFsbE9yVXBkYXRlID0gKHtcbiAgb25TdWNjZXNzLFxufToge1xuICBvblN1Y2Nlc3M/OiAocmVzOiBJbnN0YWxsU3RhdHVzUmVzcG9uc2VbXSkgPT4gdm9pZFxufSkgPT4ge1xuICBjb25zdCB7IG11dGF0ZUFzeW5jOiB1cGRhdGVQYWNrYWdlRnJvbU1hcmtldFBsYWNlIH0gPSB1c2VVcGRhdGVQYWNrYWdlRnJvbU1hcmtldFBsYWNlKClcblxuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46IChkYXRhOiB7XG4gICAgICBwYXlsb2FkOiBEZXBlbmRlbmN5W11cbiAgICAgIHBsdWdpbjogUGx1Z2luW11cbiAgICAgIGluc3RhbGxlZEluZm86IFJlY29yZDxzdHJpbmcsIFZlcnNpb25JbmZvPlxuICAgIH0pID0+IHtcbiAgICAgIGNvbnN0IHsgcGF5bG9hZCwgcGx1Z2luLCBpbnN0YWxsZWRJbmZvIH0gPSBkYXRhXG5cbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwYXlsb2FkLm1hcChhc3luYyAoaXRlbSwgaSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IG9yZ0FuZE5hbWUgPSBgJHtwbHVnaW5baV0/Lm9yZyB8fCBwbHVnaW5baV0/LmF1dGhvcn0vJHtwbHVnaW5baV0/Lm5hbWV9YFxuICAgICAgICAgIGNvbnN0IGluc3RhbGxlZFBheWxvYWQgPSBpbnN0YWxsZWRJbmZvW29yZ0FuZE5hbWVdXG4gICAgICAgICAgY29uc3QgaXNJbnN0YWxsZWQgPSAhIWluc3RhbGxlZFBheWxvYWRcbiAgICAgICAgICBsZXQgdW5pcXVlSWRlbnRpZmllciA9ICcnXG4gICAgICAgICAgbGV0IHRhc2tJZCA9ICcnXG4gICAgICAgICAgbGV0IGlzRmluaXNoZWRJbnN0YWxsYXRpb24gPSBmYWxzZVxuXG4gICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2dpdGh1YicpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBpdGVtIGFzIEdpdEh1Ykl0ZW1BbmRNYXJrZXRQbGFjZURlcGVuZGVuY3lcbiAgICAgICAgICAgIC8vIEZyb20gbG9jYWwgYnVuZGxlIGRvbid0IGhhdmUgZGF0YS52YWx1ZS5naXRodWJfcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyXG4gICAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyID0gZGF0YS52YWx1ZS5naXRodWJfcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyIVxuICAgICAgICAgICAgaWYgKCF1bmlxdWVJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHsgdW5pcXVlX2lkZW50aWZpZXIgfSA9IGF3YWl0IHBvc3Q8dXBsb2FkR2l0SHViUmVzcG9uc2U+KCcvd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi91cGxvYWQvZ2l0aHViJywge1xuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHJlcG86IGRhdGEudmFsdWUucmVwbyEsXG4gICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBkYXRhLnZhbHVlLnJlbGVhc2UhIHx8IGRhdGEudmFsdWUudmVyc2lvbiEsXG4gICAgICAgICAgICAgICAgICBwYWNrYWdlOiBkYXRhLnZhbHVlLnBhY2thZ2VzISB8fCBkYXRhLnZhbHVlLnBhY2thZ2UhLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXIgPSBkYXRhLnZhbHVlLmdpdGh1Yl9wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIhIHx8IHVuaXF1ZV9pZGVudGlmaWVyXG4gICAgICAgICAgICAgIC8vIGhhcyB0aGUgc2FtZSB2ZXJzaW9uLCBidXQgbm90IGluc3RhbGxlZFxuICAgICAgICAgICAgICBpZiAodW5pcXVlSWRlbnRpZmllciA9PT0gaW5zdGFsbGVkUGF5bG9hZD8udW5pcXVlSWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6IFRhc2tTdGF0dXMuc3VjY2VzcyxcbiAgICAgICAgICAgICAgICAgIHRhc2tJZDogJycsXG4gICAgICAgICAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNJbnN0YWxsZWQpIHtcbiAgICAgICAgICAgICAgY29uc3QgeyB0YXNrX2lkLCBhbGxfaW5zdGFsbGVkIH0gPSBhd2FpdCBwb3N0PEluc3RhbGxQYWNrYWdlUmVzcG9uc2U+KCcvd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi9pbnN0YWxsL2dpdGh1YicsIHtcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICByZXBvOiBkYXRhLnZhbHVlLnJlcG8hLFxuICAgICAgICAgICAgICAgICAgdmVyc2lvbjogZGF0YS52YWx1ZS5yZWxlYXNlISB8fCBkYXRhLnZhbHVlLnZlcnNpb24hLFxuICAgICAgICAgICAgICAgICAgcGFja2FnZTogZGF0YS52YWx1ZS5wYWNrYWdlcyEgfHwgZGF0YS52YWx1ZS5wYWNrYWdlISxcbiAgICAgICAgICAgICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogdW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB0YXNrSWQgPSB0YXNrX2lkXG4gICAgICAgICAgICAgIGlzRmluaXNoZWRJbnN0YWxsYXRpb24gPSBhbGxfaW5zdGFsbGVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdtYXJrZXRwbGFjZScpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBpdGVtIGFzIEdpdEh1Ykl0ZW1BbmRNYXJrZXRQbGFjZURlcGVuZGVuY3lcbiAgICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXIgPSBkYXRhLnZhbHVlLm1hcmtldHBsYWNlX3BsdWdpbl91bmlxdWVfaWRlbnRpZmllciEgfHwgcGx1Z2luW2ldPy5wbHVnaW5faWRcbiAgICAgICAgICAgIGlmICh1bmlxdWVJZGVudGlmaWVyID09PSBpbnN0YWxsZWRQYXlsb2FkPy51bmlxdWVJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBUYXNrU3RhdHVzLnN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgdGFza0lkOiAnJyxcbiAgICAgICAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc0luc3RhbGxlZCkge1xuICAgICAgICAgICAgICBjb25zdCB7IHRhc2tfaWQsIGFsbF9pbnN0YWxsZWQgfSA9IGF3YWl0IHBvc3Q8SW5zdGFsbFBhY2thZ2VSZXNwb25zZT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL2luc3RhbGwvbWFya2V0cGxhY2UnLCB7XG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyczogW3VuaXF1ZUlkZW50aWZpZXJdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRhc2tJZCA9IHRhc2tfaWRcbiAgICAgICAgICAgICAgaXNGaW5pc2hlZEluc3RhbGxhdGlvbiA9IGFsbF9pbnN0YWxsZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ3BhY2thZ2UnKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gaXRlbSBhcyBQYWNrYWdlRGVwZW5kZW5jeVxuICAgICAgICAgICAgdW5pcXVlSWRlbnRpZmllciA9IGRhdGEudmFsdWUudW5pcXVlX2lkZW50aWZpZXJcbiAgICAgICAgICAgIGlmICh1bmlxdWVJZGVudGlmaWVyID09PSBpbnN0YWxsZWRQYXlsb2FkPy51bmlxdWVJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBUYXNrU3RhdHVzLnN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgdGFza0lkOiAnJyxcbiAgICAgICAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc0luc3RhbGxlZCkge1xuICAgICAgICAgICAgICBjb25zdCB7IHRhc2tfaWQsIGFsbF9pbnN0YWxsZWQgfSA9IGF3YWl0IHBvc3Q8SW5zdGFsbFBhY2thZ2VSZXNwb25zZT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL2luc3RhbGwvcGtnJywge1xuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcnM6IFt1bmlxdWVJZGVudGlmaWVyXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB0YXNrSWQgPSB0YXNrX2lkXG4gICAgICAgICAgICAgIGlzRmluaXNoZWRJbnN0YWxsYXRpb24gPSBhbGxfaW5zdGFsbGVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc0luc3RhbGxlZCkge1xuICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ3BhY2thZ2UnKSB7XG4gICAgICAgICAgICAgIGF3YWl0IHVuaW5zdGFsbFBsdWdpbihpbnN0YWxsZWRQYXlsb2FkLmluc3RhbGxlZElkKVxuICAgICAgICAgICAgICBjb25zdCB7IHRhc2tfaWQsIGFsbF9pbnN0YWxsZWQgfSA9IGF3YWl0IHBvc3Q8SW5zdGFsbFBhY2thZ2VSZXNwb25zZT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL2luc3RhbGwvcGtnJywge1xuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcnM6IFt1bmlxdWVJZGVudGlmaWVyXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB0YXNrSWQgPSB0YXNrX2lkXG4gICAgICAgICAgICAgIGlzRmluaXNoZWRJbnN0YWxsYXRpb24gPSBhbGxfaW5zdGFsbGVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgeyB0YXNrX2lkLCBhbGxfaW5zdGFsbGVkIH0gPSBhd2FpdCB1cGRhdGVQYWNrYWdlRnJvbU1hcmtldFBsYWNlKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6IGluc3RhbGxlZFBheWxvYWQ/LnVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgICAgICAgbmV3X3BsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogdW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgdGFza0lkID0gdGFza19pZFxuICAgICAgICAgICAgICBpc0ZpbmlzaGVkSW5zdGFsbGF0aW9uID0gYWxsX2luc3RhbGxlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNGaW5pc2hlZEluc3RhbGxhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3RhdHVzOiBUYXNrU3RhdHVzLnN1Y2Nlc3MsXG4gICAgICAgICAgICAgIHRhc2tJZDogJycsXG4gICAgICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHN0YXR1czogVGFza1N0YXR1cy5ydW5uaW5nLFxuICAgICAgICAgICAgICB0YXNrSWQsXG4gICAgICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bnVzZWQtaW1wb3J0cy9uby11bnVzZWQtdmFyc1xuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBzdGF0dXM6IFRhc2tTdGF0dXMuZmFpbGVkLCB0YXNrSWQ6ICcnLCB1bmlxdWVJZGVudGlmaWVyOiAnJyB9KVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICB9LFxuICAgIG9uU3VjY2VzcyxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURlYnVnS2V5ID0gKCkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnkoe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2RlYnVnS2V5J10sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0PERlYnVnSW5mb1R5cGVzPignL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vZGVidWdnaW5nLWtleScpLFxuICB9KVxufVxuXG5jb25zdCB1c2VSZWZlcmVuY2VTZXR0aW5nS2V5ID0gW05BTUVfU1BBQ0UsICdyZWZlcmVuY2VTZXR0aW5ncyddXG5leHBvcnQgY29uc3QgdXNlUmVmZXJlbmNlU2V0dGluZ3MgPSAoKSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeSh7XG4gICAgcXVlcnlLZXk6IHVzZVJlZmVyZW5jZVNldHRpbmdLZXksXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0PFJlZmVyZW5jZVNldHRpbmc+KCcvd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi9wcmVmZXJlbmNlcy9mZXRjaCcpLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW52YWxpZGF0ZVJlZmVyZW5jZVNldHRpbmdzID0gKCkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuICgpID0+IHtcbiAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyhcbiAgICAgIHtcbiAgICAgICAgcXVlcnlLZXk6IHVzZVJlZmVyZW5jZVNldHRpbmdLZXksXG4gICAgICB9LFxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlTXV0YXRpb25SZWZlcmVuY2VTZXR0aW5ncyA9ICh7XG4gIG9uU3VjY2Vzcyxcbn06IHtcbiAgb25TdWNjZXNzPzogKCkgPT4gdm9pZFxufSkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiBSZWZlcmVuY2VTZXR0aW5nKSA9PiB7XG4gICAgICByZXR1cm4gcG9zdCgnL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vcHJlZmVyZW5jZXMvY2hhbmdlJywgeyBib2R5OiBwYXlsb2FkIH0pXG4gICAgfSxcbiAgICBvblN1Y2Nlc3MsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VSZW1vdmVBdXRvVXBncmFkZSA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbkZuOiAocGF5bG9hZDogeyBwbHVnaW5faWQ6IHN0cmluZyB9KSA9PiB7XG4gICAgICByZXR1cm4gcG9zdCgnL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vcHJlZmVyZW5jZXMvYXV0b3VwZ3JhZGUvZXhjbHVkZScsIHsgYm9keTogcGF5bG9hZCB9KVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VNdXRhdGlvblBsdWdpbnNGcm9tTWFya2V0cGxhY2UgPSAoKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25GbjogKHBsdWdpbnNTZWFyY2hQYXJhbXM6IFBsdWdpbnNTZWFyY2hQYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcXVlcnksXG4gICAgICAgIHNvcnRCeSxcbiAgICAgICAgc29ydE9yZGVyLFxuICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgdGFncyxcbiAgICAgICAgZXhjbHVkZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcGFnZSA9IDEsXG4gICAgICAgIHBhZ2VTaXplID0gNDAsXG4gICAgICB9ID0gcGx1Z2luc1NlYXJjaFBhcmFtc1xuICAgICAgY29uc3QgcGx1Z2luT3JCdW5kbGUgPSB0eXBlID09PSAnYnVuZGxlJyA/ICdidW5kbGVzJyA6ICdwbHVnaW5zJ1xuICAgICAgcmV0dXJuIHBvc3RNYXJrZXRwbGFjZTx7IGRhdGE6IFBsdWdpbnNGcm9tTWFya2V0cGxhY2VSZXNwb25zZSB9PihgLyR7cGx1Z2luT3JCdW5kbGV9L3NlYXJjaC9hZHZhbmNlZGAsIHtcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgcGFnZV9zaXplOiBwYWdlU2l6ZSxcbiAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICBzb3J0X2J5OiBzb3J0QnksXG4gICAgICAgICAgc29ydF9vcmRlcjogc29ydE9yZGVyLFxuICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSAhPT0gJ2FsbCcgPyBjYXRlZ29yeSA6ICcnLFxuICAgICAgICAgIHRhZ3MsXG4gICAgICAgICAgZXhjbHVkZSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlRmV0Y2hQbHVnaW5zSW5NYXJrZXRQbGFjZUJ5SWRzID0gKHVuaXF1ZV9pZGVudGlmaWVyczogc3RyaW5nW10sIG9wdGlvbnM/OiBRdWVyeU9wdGlvbnM8eyBkYXRhOiBQbHVnaW5zRnJvbU1hcmtldHBsYWNlUmVzcG9uc2UgfT4pID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5KHtcbiAgICAuLi5vcHRpb25zLFxuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2ZldGNoUGx1Z2luc0luTWFya2V0UGxhY2VCeUlkcycsIHVuaXF1ZV9pZGVudGlmaWVyc10sXG4gICAgcXVlcnlGbjogKCkgPT4gcG9zdE1hcmtldHBsYWNlPHsgZGF0YTogUGx1Z2luc0Zyb21NYXJrZXRwbGFjZVJlc3BvbnNlIH0+KCcvcGx1Z2lucy9pZGVudGlmaWVyL2JhdGNoJywge1xuICAgICAgYm9keToge1xuICAgICAgICB1bmlxdWVfaWRlbnRpZmllcnMsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGVuYWJsZWQ6IHVuaXF1ZV9pZGVudGlmaWVycz8uZmlsdGVyKGkgPT4gISFpKS5sZW5ndGggPiAwLFxuICAgIHJldHJ5OiAwLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlRmV0Y2hQbHVnaW5MaXN0T3JCdW5kbGVMaXN0ID0gKHBsdWdpbnNTZWFyY2hQYXJhbXM6IFBsdWdpbnNTZWFyY2hQYXJhbXMpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5KHtcbiAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdmZXRjaFBsdWdpbkxpc3RPckJ1bmRsZUxpc3QnLCBwbHVnaW5zU2VhcmNoUGFyYW1zXSxcbiAgICBxdWVyeUZuOiAoKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHF1ZXJ5LFxuICAgICAgICBzb3J0QnksXG4gICAgICAgIHNvcnRPcmRlcixcbiAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgIHRhZ3MsXG4gICAgICAgIGV4Y2x1ZGUsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHBhZ2UgPSAxLFxuICAgICAgICBwYWdlU2l6ZSA9IDQwLFxuICAgICAgfSA9IHBsdWdpbnNTZWFyY2hQYXJhbXNcbiAgICAgIGNvbnN0IHBsdWdpbk9yQnVuZGxlID0gdHlwZSA9PT0gJ2J1bmRsZScgPyAnYnVuZGxlcycgOiAncGx1Z2lucydcbiAgICAgIHJldHVybiBwb3N0TWFya2V0cGxhY2U8eyBkYXRhOiBQbHVnaW5zRnJvbU1hcmtldHBsYWNlUmVzcG9uc2UgfT4oYC8ke3BsdWdpbk9yQnVuZGxlfS9zZWFyY2gvYWR2YW5jZWRgLCB7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBwYWdlLFxuICAgICAgICAgIHBhZ2Vfc2l6ZTogcGFnZVNpemUsXG4gICAgICAgICAgcXVlcnksXG4gICAgICAgICAgc29ydF9ieTogc29ydEJ5LFxuICAgICAgICAgIHNvcnRfb3JkZXI6IHNvcnRPcmRlcixcbiAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnkgIT09ICdhbGwnID8gY2F0ZWdvcnkgOiAnJyxcbiAgICAgICAgICB0YWdzLFxuICAgICAgICAgIGV4Y2x1ZGUsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUZldGNoUGx1Z2luc0luTWFya2V0UGxhY2VCeUluZm8gPSAoaW5mb3M6IFJlY29yZDxzdHJpbmcsIGFueT5bXSkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnkoe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2ZldGNoUGx1Z2luc0luTWFya2V0UGxhY2VCeUluZm8nLCBpbmZvc10sXG4gICAgcXVlcnlGbjogKCkgPT4gcG9zdE1hcmtldHBsYWNlPHsgZGF0YTogUGx1Z2luc0Zyb21NYXJrZXRwbGFjZUJ5SW5mb1Jlc3BvbnNlIH0+KCcvcGx1Z2lucy92ZXJzaW9ucy9iYXRjaCcsIHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcGx1Z2luX3R1cGxlczogaW5mb3MubWFwKGluZm8gPT4gKHtcbiAgICAgICAgICBvcmc6IGluZm8ub3JnYW5pemF0aW9uLFxuICAgICAgICAgIG5hbWU6IGluZm8ucGx1Z2luLFxuICAgICAgICAgIHZlcnNpb246IGluZm8udmVyc2lvbixcbiAgICAgICAgfSkpLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBlbmFibGVkOiBpbmZvcz8uZmlsdGVyKGkgPT4gISFpKS5sZW5ndGggPiAwLFxuICAgIHJldHJ5OiAwLFxuICB9KVxufVxuXG5jb25zdCB1c2VQbHVnaW5UYXNrTGlzdEtleSA9IFtOQU1FX1NQQUNFLCAncGx1Z2luVGFza0xpc3QnXVxuZXhwb3J0IGNvbnN0IHVzZVBsdWdpblRhc2tMaXN0ID0gKGNhdGVnb3J5PzogUGx1Z2luQ2F0ZWdvcnlFbnVtIHwgc3RyaW5nKSA9PiB7XG4gIGNvbnN0IFtpbml0aWFsaXplZCwgc2V0SW5pdGlhbGl6ZWRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHtcbiAgICBjYW5NYW5hZ2VtZW50LFxuICB9ID0gdXNlUmVmZXJlbmNlU2V0dGluZygpXG4gIGNvbnN0IHsgcmVmcmVzaFBsdWdpbkxpc3QgfSA9IHVzZVJlZnJlc2hQbHVnaW5MaXN0KClcbiAgY29uc3Qge1xuICAgIGRhdGEsXG4gICAgaXNGZXRjaGVkLFxuICAgIGlzUmVmZXRjaGluZyxcbiAgICByZWZldGNoLFxuICAgIC4uLnJlc3RcbiAgfSA9IHVzZVF1ZXJ5KHtcbiAgICBlbmFibGVkOiBjYW5NYW5hZ2VtZW50LFxuICAgIHF1ZXJ5S2V5OiB1c2VQbHVnaW5UYXNrTGlzdEtleSxcbiAgICBxdWVyeUZuOiAoKSA9PiBnZXQ8eyB0YXNrczogUGx1Z2luVGFza1tdIH0+KCcvd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi90YXNrcz9wYWdlPTEmcGFnZV9zaXplPTEwMCcpLFxuICAgIHJlZmV0Y2hJbnRlcnZhbDogKGxhc3RRdWVyeSkgPT4ge1xuICAgICAgY29uc3QgbGFzdERhdGEgPSBsYXN0UXVlcnkuc3RhdGUuZGF0YVxuICAgICAgY29uc3QgdGFza0RvbmUgPSBsYXN0RGF0YT8udGFza3MuZXZlcnkodGFzayA9PiB0YXNrLnN0YXR1cyA9PT0gVGFza1N0YXR1cy5zdWNjZXNzIHx8IHRhc2suc3RhdHVzID09PSBUYXNrU3RhdHVzLmZhaWxlZClcbiAgICAgIHJldHVybiB0YXNrRG9uZSA/IGZhbHNlIDogNTAwMFxuICAgIH0sXG4gIH0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBBZnRlciBmaXJzdCBmZXRjaCwgcmVmcmVzaCBwbHVnaW4gbGlzdCBlYWNoIHRpbWUgYWxsIHRhc2tzIGFyZSBkb25lXG4gICAgLy8gU2tpcCBpbml0aWFsaXphdGlvbiBwZXJpb2QsIGJlY2F1c2UgdGhlIHF1ZXJ5IGNhY2hlIGlzIG5vdCB1cGRhdGVkIHlldFxuICAgIGlmICghaW5pdGlhbGl6ZWQgfHwgaXNSZWZldGNoaW5nKVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBsYXN0RGF0YSA9IGNsb25lRGVlcChkYXRhKVxuICAgIGNvbnN0IHRhc2tEb25lID0gbGFzdERhdGE/LnRhc2tzLmV2ZXJ5KHRhc2sgPT4gdGFzay5zdGF0dXMgPT09IFRhc2tTdGF0dXMuc3VjY2VzcyB8fCB0YXNrLnN0YXR1cyA9PT0gVGFza1N0YXR1cy5mYWlsZWQpXG4gICAgY29uc3QgdGFza0FsbEZhaWxlZCA9IGxhc3REYXRhPy50YXNrcy5ldmVyeSh0YXNrID0+IHRhc2suc3RhdHVzID09PSBUYXNrU3RhdHVzLmZhaWxlZClcbiAgICBpZiAodGFza0RvbmUgJiYgbGFzdERhdGE/LnRhc2tzLmxlbmd0aCAmJiAhdGFza0FsbEZhaWxlZClcbiAgICAgIHJlZnJlc2hQbHVnaW5MaXN0KGNhdGVnb3J5ID8geyBjYXRlZ29yeSB9IGFzIGFueSA6IHVuZGVmaW5lZCwgIWNhdGVnb3J5KVxuICB9LCBbaXNSZWZldGNoaW5nXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldEluaXRpYWxpemVkKHRydWUpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZVJlZmV0Y2ggPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgcmVmZXRjaCgpXG4gIH0sIFtyZWZldGNoXSlcblxuICByZXR1cm4ge1xuICAgIGRhdGEsXG4gICAgcGx1Z2luVGFza3M6IGRhdGE/LnRhc2tzIHx8IFtdLFxuICAgIGlzRmV0Y2hlZCxcbiAgICBoYW5kbGVSZWZldGNoLFxuICAgIC4uLnJlc3QsXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZU11dGF0aW9uQ2xlYXJUYXNrUGx1Z2luID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46ICh7IHRhc2tJZCwgcGx1Z2luSWQgfTogeyB0YXNrSWQ6IHN0cmluZywgcGx1Z2luSWQ6IHN0cmluZyB9KSA9PiB7XG4gICAgICBjb25zdCBlbmNvZGVkUGx1Z2luSWQgPSBlbmNvZGVVUklDb21wb25lbnQocGx1Z2luSWQpXG4gICAgICByZXR1cm4gcG9zdDx7IHN1Y2Nlc3M6IGJvb2xlYW4gfT4oYC93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL3Rhc2tzLyR7dGFza0lkfS9kZWxldGUvJHtlbmNvZGVkUGx1Z2luSWR9YClcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlTXV0YXRpb25DbGVhckFsbFRhc2tQbHVnaW4gPSAoKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25GbjogKCkgPT4ge1xuICAgICAgcmV0dXJuIHBvc3Q8eyBzdWNjZXNzOiBib29sZWFuIH0+KCcvd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi90YXNrcy9kZWxldGVfYWxsJylcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlUGx1Z2luTWFuaWZlc3RJbmZvID0gKHBsdWdpblVJRDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeSh7XG4gICAgZW5hYmxlZDogISFwbHVnaW5VSUQsXG4gICAgcXVlcnlLZXk6IFtbTkFNRV9TUEFDRSwgJ21hbmlmZXN0JywgcGx1Z2luVUlEXV0sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0TWFya2V0cGxhY2U8eyBkYXRhOiB7IHBsdWdpbjogUGx1Z2luSW5mb0Zyb21NYXJrZXRQbGFjZSwgdmVyc2lvbjogeyB2ZXJzaW9uOiBzdHJpbmcgfSB9IH0+KGAvcGx1Z2lucy8ke3BsdWdpblVJRH1gKSxcbiAgICByZXRyeTogMCxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURvd25sb2FkUGx1Z2luID0gKGluZm86IHsgb3JnYW5pemF0aW9uOiBzdHJpbmcsIHBsdWdpbk5hbWU6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nIH0sIG5lZWREb3dubG9hZDogYm9vbGVhbikgPT4ge1xuICByZXR1cm4gdXNlUXVlcnkoe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2Rvd25sb2FkUGx1Z2luJywgaW5mb10sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0TWFya2V0cGxhY2U8QmxvYj4oYC9wbHVnaW5zLyR7aW5mby5vcmdhbml6YXRpb259LyR7aW5mby5wbHVnaW5OYW1lfS8ke2luZm8udmVyc2lvbn0vZG93bmxvYWRgKSxcbiAgICBlbmFibGVkOiBuZWVkRG93bmxvYWQsXG4gICAgcmV0cnk6IDAsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VNdXRhdGlvbkNoZWNrRGVwZW5kZW5jaWVzID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46IChhcHBJZDogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0PHsgbGVha2VkX2RlcGVuZGVuY2llczogRGVwZW5kZW5jeVtdIH0+KGAvYXBwcy9pbXBvcnRzLyR7YXBwSWR9L2NoZWNrLWRlcGVuZGVuY2llc2ApXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZU1vZGVsSW5MaXN0ID0gKGN1cnJlbnRQcm92aWRlcj86IE1vZGVsUHJvdmlkZXIsIG1vZGVsSWQ/OiBzdHJpbmcpID0+IHtcbiAgY29uc3QgcHJvdmlkZXIgPSBjdXJyZW50UHJvdmlkZXI/LnByb3ZpZGVyXG4gIHJldHVybiB1c2VRdWVyeSh7XG4gICAgcXVlcnlLZXk6IFsnbW9kZWxJbkxpc3QnLCBwcm92aWRlciwgbW9kZWxJZF0sXG4gICAgcXVlcnlGbjogYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCFtb2RlbElkIHx8ICFwcm92aWRlcilcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtb2RlbHNEYXRhID0gYXdhaXQgZmV0Y2hNb2RlbFByb3ZpZGVyTW9kZWxMaXN0KGAvd29ya3NwYWNlcy9jdXJyZW50L21vZGVsLXByb3ZpZGVycy8ke3Byb3ZpZGVyfS9tb2RlbHNgKVxuICAgICAgICByZXR1cm4gISFtb2RlbElkICYmICEhbW9kZWxzRGF0YS5kYXRhLmZpbmQoaXRlbSA9PiBpdGVtLm1vZGVsID09PSBtb2RlbElkKVxuICAgICAgfVxuICAgICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgIGVuYWJsZWQ6ICEhbW9kZWxJZCAmJiAhIXByb3ZpZGVyLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlUGx1Z2luSW5mbyA9IChwcm92aWRlck5hbWU/OiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5KHtcbiAgICBxdWVyeUtleTogWydwbHVnaW5JbmZvJywgcHJvdmlkZXJOYW1lXSxcbiAgICBxdWVyeUZuOiBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIXByb3ZpZGVyTmFtZSlcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIGNvbnN0IHBhcnRzID0gcHJvdmlkZXJOYW1lLnNwbGl0KCcvJylcbiAgICAgIGNvbnN0IG9yZyA9IHBhcnRzWzBdXG4gICAgICBjb25zdCBuYW1lID0gcGFydHNbMV1cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hQbHVnaW5JbmZvRnJvbU1hcmtldFBsYWNlKHsgb3JnLCBuYW1lIH0pXG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnBsdWdpbi5jYXRlZ29yeSA9PT0gUGx1Z2luQ2F0ZWdvcnlFbnVtLm1vZGVsID8gcmVzcG9uc2UuZGF0YS5wbHVnaW4gOiBudWxsXG4gICAgICB9XG4gICAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSxcbiAgICBlbmFibGVkOiAhIXByb3ZpZGVyTmFtZSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUZldGNoRHluYW1pY09wdGlvbnMgPSAocGx1Z2luX2lkOiBzdHJpbmcsIHByb3ZpZGVyOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nLCBwYXJhbWV0ZXI6IHN0cmluZywgcHJvdmlkZXJfdHlwZT86IHN0cmluZywgZXh0cmE/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25GbjogKCkgPT4gZ2V0PHsgb3B0aW9uczogRm9ybU9wdGlvbltdIH0+KCcvd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi9wYXJhbWV0ZXJzL2R5bmFtaWMtb3B0aW9ucycsIHtcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBwbHVnaW5faWQsXG4gICAgICAgIHByb3ZpZGVyLFxuICAgICAgICBhY3Rpb24sXG4gICAgICAgIHBhcmFtZXRlcixcbiAgICAgICAgcHJvdmlkZXJfdHlwZSxcbiAgICAgICAgLi4uZXh0cmEsXG4gICAgICB9LFxuICAgIH0pLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlUGx1Z2luUmVhZG1lID0gKHsgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyLCBsYW5ndWFnZSB9OiB7IHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogc3RyaW5nLCBsYW5ndWFnZT86IHN0cmluZyB9KSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeSh7XG4gICAgcXVlcnlLZXk6IFsncGx1Z2luUmVhZG1lJywgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyLCBsYW5ndWFnZV0sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0PHsgcmVhZG1lOiBzdHJpbmcgfT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvcGx1Z2luL3JlYWRtZScsIHsgcGFyYW1zOiB7IHBsdWdpbl91bmlxdWVfaWRlbnRpZmllciwgbGFuZ3VhZ2UgfSB9LCB7IHNpbGVudDogdHJ1ZSB9KSxcbiAgICBlbmFibGVkOiAhIXBsdWdpbl91bmlxdWVfaWRlbnRpZmllcixcbiAgICByZXRyeTogMCxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVBsdWdpblJlYWRtZUFzc2V0ID0gKHsgZmlsZV9uYW1lLCBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIgfTogeyBmaWxlX25hbWU/OiBzdHJpbmcsIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcj86IHN0cmluZyB9KSA9PiB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRGaWxlTmFtZSA9IGZpbGVfbmFtZT8ucmVwbGFjZSgvKF5cXC5cXC9fYXNzZXRzXFwvfF5fYXNzZXRzXFwvKS8sICcnKVxuICByZXR1cm4gdXNlUXVlcnkoe1xuICAgIHF1ZXJ5S2V5OiBbJ3BsdWdpblJlYWRtZUFzc2V0JywgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyLCBub3JtYWxpemVkRmlsZU5hbWVdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxCbG9iPignL3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vYXNzZXQnLCB7IHBhcmFtczogeyBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIsIGZpbGVfbmFtZTogbm9ybWFsaXplZEZpbGVOYW1lIH0gfSwgeyBzaWxlbnQ6IHRydWUgfSksXG4gICAgZW5hYmxlZDogISFwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIgJiYgISFmaWxlX25hbWUgJiYgLyheXFwuXFwvX2Fzc2V0c3xeX2Fzc2V0cykvLnRlc3QoZmlsZV9uYW1lKSxcbiAgfSlcbn1cbiJdfQ==