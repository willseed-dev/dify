"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarketplaceListFilterType = exports.getMarketplaceListCondition = exports.getMarketplacePlugins = exports.getMarketplaceCollectionsAndPlugins = exports.getMarketplacePluginsByCollectionId = exports.getPluginDetailLinkInMarketplace = exports.getPluginLinkInMarketplace = exports.getFormattedPlugin = exports.getPluginIconInMarketplace = void 0;
exports.getCollectionsParams = getCollectionsParams;
const types_1 = require("@/app/components/plugins/types");
const config_1 = require("@/config");
const base_1 = require("@/service/base");
const var_1 = require("@/utils/var");
const constants_1 = require("./constants");
const getMarketplaceHeaders = () => new Headers({
    'X-Dify-Version': !config_1.IS_MARKETPLACE ? config_1.APP_VERSION : '999.0.0',
});
const getPluginIconInMarketplace = (plugin) => {
    if (plugin.type === 'bundle')
        return `${config_1.MARKETPLACE_API_PREFIX}/bundles/${plugin.org}/${plugin.name}/icon`;
    return `${config_1.MARKETPLACE_API_PREFIX}/plugins/${plugin.org}/${plugin.name}/icon`;
};
exports.getPluginIconInMarketplace = getPluginIconInMarketplace;
const getFormattedPlugin = (bundle) => {
    if (bundle.type === 'bundle') {
        return {
            ...bundle,
            icon: (0, exports.getPluginIconInMarketplace)(bundle),
            brief: bundle.description,
            // @ts-expect-error I do not have enough information
            label: bundle.labels,
        };
    }
    return {
        ...bundle,
        icon: (0, exports.getPluginIconInMarketplace)(bundle),
    };
};
exports.getFormattedPlugin = getFormattedPlugin;
const getPluginLinkInMarketplace = (plugin, params) => {
    if (plugin.type === 'bundle')
        return (0, var_1.getMarketplaceUrl)(`/bundles/${plugin.org}/${plugin.name}`, params);
    return (0, var_1.getMarketplaceUrl)(`/plugins/${plugin.org}/${plugin.name}`, params);
};
exports.getPluginLinkInMarketplace = getPluginLinkInMarketplace;
const getPluginDetailLinkInMarketplace = (plugin) => {
    if (plugin.type === 'bundle')
        return `/bundles/${plugin.org}/${plugin.name}`;
    return `/plugins/${plugin.org}/${plugin.name}`;
};
exports.getPluginDetailLinkInMarketplace = getPluginDetailLinkInMarketplace;
const getMarketplacePluginsByCollectionId = async (collectionId, query, options) => {
    let plugins = [];
    try {
        const url = `${config_1.MARKETPLACE_API_PREFIX}/collections/${collectionId}/plugins`;
        const headers = getMarketplaceHeaders();
        const marketplaceCollectionPluginsData = await globalThis.fetch(url, {
            cache: 'no-store',
            method: 'POST',
            headers,
            signal: options?.signal,
            body: JSON.stringify({
                category: query?.category,
                exclude: query?.exclude,
                type: query?.type,
            }),
        });
        const marketplaceCollectionPluginsDataJson = await marketplaceCollectionPluginsData.json();
        plugins = (marketplaceCollectionPluginsDataJson.data.plugins || []).map((plugin) => (0, exports.getFormattedPlugin)(plugin));
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {
        plugins = [];
    }
    return plugins;
};
exports.getMarketplacePluginsByCollectionId = getMarketplacePluginsByCollectionId;
const getMarketplaceCollectionsAndPlugins = async (query, options) => {
    let marketplaceCollections = [];
    let marketplaceCollectionPluginsMap = {};
    try {
        let marketplaceUrl = `${config_1.MARKETPLACE_API_PREFIX}/collections?page=1&page_size=100`;
        if (query?.condition)
            marketplaceUrl += `&condition=${query.condition}`;
        if (query?.type)
            marketplaceUrl += `&type=${query.type}`;
        const headers = getMarketplaceHeaders();
        const marketplaceCollectionsData = await globalThis.fetch(marketplaceUrl, {
            headers,
            cache: 'no-store',
            signal: options?.signal,
        });
        const marketplaceCollectionsDataJson = await marketplaceCollectionsData.json();
        marketplaceCollections = marketplaceCollectionsDataJson.data.collections || [];
        await Promise.all(marketplaceCollections.map(async (collection) => {
            const plugins = await (0, exports.getMarketplacePluginsByCollectionId)(collection.name, query, options);
            marketplaceCollectionPluginsMap[collection.name] = plugins;
        }));
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {
        marketplaceCollections = [];
        marketplaceCollectionPluginsMap = {};
    }
    return {
        marketplaceCollections,
        marketplaceCollectionPluginsMap,
    };
};
exports.getMarketplaceCollectionsAndPlugins = getMarketplaceCollectionsAndPlugins;
const getMarketplacePlugins = async (queryParams, pageParam, signal) => {
    if (!queryParams) {
        return {
            plugins: [],
            total: 0,
            page: 1,
            pageSize: 40,
        };
    }
    const { query, sortBy, sortOrder, category, tags, type, pageSize = 40, } = queryParams;
    const pluginOrBundle = type === 'bundle' ? 'bundles' : 'plugins';
    try {
        const res = await (0, base_1.postMarketplace)(`/${pluginOrBundle}/search/advanced`, {
            body: {
                page: pageParam,
                page_size: pageSize,
                query,
                sort_by: sortBy,
                sort_order: sortOrder,
                category: category !== 'all' ? category : '',
                tags,
                type,
            },
            signal,
        });
        const resPlugins = res.data.bundles || res.data.plugins || [];
        return {
            plugins: resPlugins.map(plugin => (0, exports.getFormattedPlugin)(plugin)),
            total: res.data.total,
            page: pageParam,
            pageSize,
        };
    }
    catch {
        return {
            plugins: [],
            total: 0,
            page: pageParam,
            pageSize,
        };
    }
};
exports.getMarketplacePlugins = getMarketplacePlugins;
const getMarketplaceListCondition = (pluginType) => {
    if ([types_1.PluginCategoryEnum.tool, types_1.PluginCategoryEnum.agent, types_1.PluginCategoryEnum.model, types_1.PluginCategoryEnum.datasource, types_1.PluginCategoryEnum.trigger].includes(pluginType))
        return `category=${pluginType}`;
    if (pluginType === types_1.PluginCategoryEnum.extension)
        return 'category=endpoint';
    if (pluginType === 'bundle')
        return 'type=bundle';
    return '';
};
exports.getMarketplaceListCondition = getMarketplaceListCondition;
const getMarketplaceListFilterType = (category) => {
    if (category === constants_1.PLUGIN_TYPE_SEARCH_MAP.all)
        return undefined;
    if (category === constants_1.PLUGIN_TYPE_SEARCH_MAP.bundle)
        return 'bundle';
    return 'plugin';
};
exports.getMarketplaceListFilterType = getMarketplaceListFilterType;
function getCollectionsParams(category) {
    if (category === constants_1.PLUGIN_TYPE_SEARCH_MAP.all) {
        return {};
    }
    return {
        category,
        condition: (0, exports.getMarketplaceListCondition)(category),
        type: (0, exports.getMarketplaceListFilterType)(category),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF3TkEsb0RBU0M7QUExTkQsMERBQW1FO0FBQ25FLHFDQUlpQjtBQUNqQix5Q0FBZ0Q7QUFDaEQscUNBQStDO0FBQy9DLDJDQUFvRDtBQU1wRCxNQUFNLHFCQUFxQixHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDO0lBQzlDLGdCQUFnQixFQUFFLENBQUMsdUJBQWMsQ0FBQyxDQUFDLENBQUMsb0JBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUztDQUM1RCxDQUFDLENBQUE7QUFFSyxNQUFNLDBCQUEwQixHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUU7SUFDM0QsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVE7UUFDMUIsT0FBTyxHQUFHLCtCQUFzQixZQUFZLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksT0FBTyxDQUFBO0lBQzlFLE9BQU8sR0FBRywrQkFBc0IsWUFBWSxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQTtBQUM5RSxDQUFDLENBQUE7QUFKWSxRQUFBLDBCQUEwQiw4QkFJdEM7QUFFTSxNQUFNLGtCQUFrQixHQUFHLENBQUMsTUFBYyxFQUFVLEVBQUU7SUFDM0QsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQzdCLE9BQU87WUFDTCxHQUFHLE1BQU07WUFDVCxJQUFJLEVBQUUsSUFBQSxrQ0FBMEIsRUFBQyxNQUFNLENBQUM7WUFDeEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQ3pCLG9EQUFvRDtZQUNwRCxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU07U0FDckIsQ0FBQTtJQUNILENBQUM7SUFDRCxPQUFPO1FBQ0wsR0FBRyxNQUFNO1FBQ1QsSUFBSSxFQUFFLElBQUEsa0NBQTBCLEVBQUMsTUFBTSxDQUFDO0tBQ3pD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Q0FBQztLQUM3QyxDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQWN0aXZlUGx1Z2luVHlwZSB9IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IHR5cGUge1xuICBDb2xsZWN0aW9uc0FuZFBsdWdpbnNTZWFyY2hQYXJhbXMsXG4gIE1hcmtldHBsYWNlQ29sbGVjdGlvbixcbiAgUGx1Z2luc1NlYXJjaFBhcmFtcyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL21hcmtldHBsYWNlL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQbHVnaW4sIFBsdWdpbnNGcm9tTWFya2V0cGxhY2VSZXNwb25zZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7XG4gIEFQUF9WRVJTSU9OLFxuICBJU19NQVJLRVRQTEFDRSxcbiAgTUFSS0VUUExBQ0VfQVBJX1BSRUZJWCxcbn0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyBwb3N0TWFya2V0cGxhY2UgfSBmcm9tICdAL3NlcnZpY2UvYmFzZSdcbmltcG9ydCB7IGdldE1hcmtldHBsYWNlVXJsIH0gZnJvbSAnQC91dGlscy92YXInXG5pbXBvcnQgeyBQTFVHSU5fVFlQRV9TRUFSQ0hfTUFQIH0gZnJvbSAnLi9jb25zdGFudHMnXG5cbnR5cGUgTWFya2V0cGxhY2VGZXRjaE9wdGlvbnMgPSB7XG4gIHNpZ25hbD86IEFib3J0U2lnbmFsXG59XG5cbmNvbnN0IGdldE1hcmtldHBsYWNlSGVhZGVycyA9ICgpID0+IG5ldyBIZWFkZXJzKHtcbiAgJ1gtRGlmeS1WZXJzaW9uJzogIUlTX01BUktFVFBMQUNFID8gQVBQX1ZFUlNJT04gOiAnOTk5LjAuMCcsXG59KVxuXG5leHBvcnQgY29uc3QgZ2V0UGx1Z2luSWNvbkluTWFya2V0cGxhY2UgPSAocGx1Z2luOiBQbHVnaW4pID0+IHtcbiAgaWYgKHBsdWdpbi50eXBlID09PSAnYnVuZGxlJylcbiAgICByZXR1cm4gYCR7TUFSS0VUUExBQ0VfQVBJX1BSRUZJWH0vYnVuZGxlcy8ke3BsdWdpbi5vcmd9LyR7cGx1Z2luLm5hbWV9L2ljb25gXG4gIHJldHVybiBgJHtNQVJLRVRQTEFDRV9BUElfUFJFRklYfS9wbHVnaW5zLyR7cGx1Z2luLm9yZ30vJHtwbHVnaW4ubmFtZX0vaWNvbmBcbn1cblxuZXhwb3J0IGNvbnN0IGdldEZvcm1hdHRlZFBsdWdpbiA9IChidW5kbGU6IFBsdWdpbik6IFBsdWdpbiA9PiB7XG4gIGlmIChidW5kbGUudHlwZSA9PT0gJ2J1bmRsZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uYnVuZGxlLFxuICAgICAgaWNvbjogZ2V0UGx1Z2luSWNvbkluTWFya2V0cGxhY2UoYnVuZGxlKSxcbiAgICAgIGJyaWVmOiBidW5kbGUuZGVzY3JpcHRpb24sXG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIEkgZG8gbm90IGhhdmUgZW5vdWdoIGluZm9ybWF0aW9uXG4gICAgICBsYWJlbDogYnVuZGxlLmxhYmVscyxcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICAuLi5idW5kbGUsXG4gICAgaWNvbjogZ2V0UGx1Z2luSWNvbkluTWFya2V0cGxhY2UoYnVuZGxlKSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UGx1Z2luTGlua0luTWFya2V0cGxhY2UgPSAocGx1Z2luOiBQbHVnaW4sIHBhcmFtcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZD4pID0+IHtcbiAgaWYgKHBsdWdpbi50eXBlID09PSAnYnVuZGxlJylcbiAgICByZXR1cm4gZ2V0TWFya2V0cGxhY2VVcmwoYC9idW5kbGVzLyR7cGx1Z2luLm9yZ30vJHtwbHVnaW4ubmFtZX1gLCBwYXJhbXMpXG4gIHJldHVybiBnZXRNYXJrZXRwbGFjZVVybChgL3BsdWdpbnMvJHtwbHVnaW4ub3JnfS8ke3BsdWdpbi5uYW1lfWAsIHBhcmFtcylcbn1cblxuZXhwb3J0IGNvbnN0IGdldFBsdWdpbkRldGFpbExpbmtJbk1hcmtldHBsYWNlID0gKHBsdWdpbjogUGx1Z2luKSA9PiB7XG4gIGlmIChwbHVnaW4udHlwZSA9PT0gJ2J1bmRsZScpXG4gICAgcmV0dXJuIGAvYnVuZGxlcy8ke3BsdWdpbi5vcmd9LyR7cGx1Z2luLm5hbWV9YFxuICByZXR1cm4gYC9wbHVnaW5zLyR7cGx1Z2luLm9yZ30vJHtwbHVnaW4ubmFtZX1gXG59XG5cbmV4cG9ydCBjb25zdCBnZXRNYXJrZXRwbGFjZVBsdWdpbnNCeUNvbGxlY3Rpb25JZCA9IGFzeW5jIChcbiAgY29sbGVjdGlvbklkOiBzdHJpbmcsXG4gIHF1ZXJ5PzogQ29sbGVjdGlvbnNBbmRQbHVnaW5zU2VhcmNoUGFyYW1zLFxuICBvcHRpb25zPzogTWFya2V0cGxhY2VGZXRjaE9wdGlvbnMsXG4pID0+IHtcbiAgbGV0IHBsdWdpbnM6IFBsdWdpbltdID0gW11cblxuICB0cnkge1xuICAgIGNvbnN0IHVybCA9IGAke01BUktFVFBMQUNFX0FQSV9QUkVGSVh9L2NvbGxlY3Rpb25zLyR7Y29sbGVjdGlvbklkfS9wbHVnaW5zYFxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRNYXJrZXRwbGFjZUhlYWRlcnMoKVxuICAgIGNvbnN0IG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNEYXRhID0gYXdhaXQgZ2xvYmFsVGhpcy5mZXRjaChcbiAgICAgIHVybCxcbiAgICAgIHtcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBzaWduYWw6IG9wdGlvbnM/LnNpZ25hbCxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNhdGVnb3J5OiBxdWVyeT8uY2F0ZWdvcnksXG4gICAgICAgICAgZXhjbHVkZTogcXVlcnk/LmV4Y2x1ZGUsXG4gICAgICAgICAgdHlwZTogcXVlcnk/LnR5cGUsXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICApXG4gICAgY29uc3QgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc0RhdGFKc29uID0gYXdhaXQgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc0RhdGEuanNvbigpXG4gICAgcGx1Z2lucyA9IChtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zRGF0YUpzb24uZGF0YS5wbHVnaW5zIHx8IFtdKS5tYXAoKHBsdWdpbjogUGx1Z2luKSA9PiBnZXRGb3JtYXR0ZWRQbHVnaW4ocGx1Z2luKSlcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW51c2VkLWltcG9ydHMvbm8tdW51c2VkLXZhcnNcbiAgY2F0Y2ggKGUpIHtcbiAgICBwbHVnaW5zID0gW11cbiAgfVxuXG4gIHJldHVybiBwbHVnaW5zXG59XG5cbmV4cG9ydCBjb25zdCBnZXRNYXJrZXRwbGFjZUNvbGxlY3Rpb25zQW5kUGx1Z2lucyA9IGFzeW5jIChcbiAgcXVlcnk/OiBDb2xsZWN0aW9uc0FuZFBsdWdpbnNTZWFyY2hQYXJhbXMsXG4gIG9wdGlvbnM/OiBNYXJrZXRwbGFjZUZldGNoT3B0aW9ucyxcbikgPT4ge1xuICBsZXQgbWFya2V0cGxhY2VDb2xsZWN0aW9uczogTWFya2V0cGxhY2VDb2xsZWN0aW9uW10gPSBbXVxuICBsZXQgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcDogUmVjb3JkPHN0cmluZywgUGx1Z2luW10+ID0ge31cbiAgdHJ5IHtcbiAgICBsZXQgbWFya2V0cGxhY2VVcmwgPSBgJHtNQVJLRVRQTEFDRV9BUElfUFJFRklYfS9jb2xsZWN0aW9ucz9wYWdlPTEmcGFnZV9zaXplPTEwMGBcbiAgICBpZiAocXVlcnk/LmNvbmRpdGlvbilcbiAgICAgIG1hcmtldHBsYWNlVXJsICs9IGAmY29uZGl0aW9uPSR7cXVlcnkuY29uZGl0aW9ufWBcbiAgICBpZiAocXVlcnk/LnR5cGUpXG4gICAgICBtYXJrZXRwbGFjZVVybCArPSBgJnR5cGU9JHtxdWVyeS50eXBlfWBcbiAgICBjb25zdCBoZWFkZXJzID0gZ2V0TWFya2V0cGxhY2VIZWFkZXJzKClcbiAgICBjb25zdCBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zRGF0YSA9IGF3YWl0IGdsb2JhbFRoaXMuZmV0Y2goXG4gICAgICBtYXJrZXRwbGFjZVVybCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICAgIHNpZ25hbDogb3B0aW9ucz8uc2lnbmFsLFxuICAgICAgfSxcbiAgICApXG4gICAgY29uc3QgbWFya2V0cGxhY2VDb2xsZWN0aW9uc0RhdGFKc29uID0gYXdhaXQgbWFya2V0cGxhY2VDb2xsZWN0aW9uc0RhdGEuanNvbigpXG4gICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucyA9IG1hcmtldHBsYWNlQ29sbGVjdGlvbnNEYXRhSnNvbi5kYXRhLmNvbGxlY3Rpb25zIHx8IFtdXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwobWFya2V0cGxhY2VDb2xsZWN0aW9ucy5tYXAoYXN5bmMgKGNvbGxlY3Rpb246IE1hcmtldHBsYWNlQ29sbGVjdGlvbikgPT4ge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IGF3YWl0IGdldE1hcmtldHBsYWNlUGx1Z2luc0J5Q29sbGVjdGlvbklkKGNvbGxlY3Rpb24ubmFtZSwgcXVlcnksIG9wdGlvbnMpXG5cbiAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXBbY29sbGVjdGlvbi5uYW1lXSA9IHBsdWdpbnNcbiAgICB9KSlcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW51c2VkLWltcG9ydHMvbm8tdW51c2VkLXZhcnNcbiAgY2F0Y2ggKGUpIHtcbiAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zID0gW11cbiAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwID0ge31cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucyxcbiAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRNYXJrZXRwbGFjZVBsdWdpbnMgPSBhc3luYyAoXG4gIHF1ZXJ5UGFyYW1zOiBQbHVnaW5zU2VhcmNoUGFyYW1zIHwgdW5kZWZpbmVkLFxuICBwYWdlUGFyYW06IG51bWJlcixcbiAgc2lnbmFsPzogQWJvcnRTaWduYWwsXG4pID0+IHtcbiAgaWYgKCFxdWVyeVBhcmFtcykge1xuICAgIHJldHVybiB7XG4gICAgICBwbHVnaW5zOiBbXSBhcyBQbHVnaW5bXSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgcGFnZTogMSxcbiAgICAgIHBhZ2VTaXplOiA0MCxcbiAgICB9XG4gIH1cblxuICBjb25zdCB7XG4gICAgcXVlcnksXG4gICAgc29ydEJ5LFxuICAgIHNvcnRPcmRlcixcbiAgICBjYXRlZ29yeSxcbiAgICB0YWdzLFxuICAgIHR5cGUsXG4gICAgcGFnZVNpemUgPSA0MCxcbiAgfSA9IHF1ZXJ5UGFyYW1zXG4gIGNvbnN0IHBsdWdpbk9yQnVuZGxlID0gdHlwZSA9PT0gJ2J1bmRsZScgPyAnYnVuZGxlcycgOiAncGx1Z2lucydcblxuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHBvc3RNYXJrZXRwbGFjZTx7IGRhdGE6IFBsdWdpbnNGcm9tTWFya2V0cGxhY2VSZXNwb25zZSB9PihgLyR7cGx1Z2luT3JCdW5kbGV9L3NlYXJjaC9hZHZhbmNlZGAsIHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcGFnZTogcGFnZVBhcmFtLFxuICAgICAgICBwYWdlX3NpemU6IHBhZ2VTaXplLFxuICAgICAgICBxdWVyeSxcbiAgICAgICAgc29ydF9ieTogc29ydEJ5LFxuICAgICAgICBzb3J0X29yZGVyOiBzb3J0T3JkZXIsXG4gICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSAhPT0gJ2FsbCcgPyBjYXRlZ29yeSA6ICcnLFxuICAgICAgICB0YWdzLFxuICAgICAgICB0eXBlLFxuICAgICAgfSxcbiAgICAgIHNpZ25hbCxcbiAgICB9KVxuICAgIGNvbnN0IHJlc1BsdWdpbnMgPSByZXMuZGF0YS5idW5kbGVzIHx8IHJlcy5kYXRhLnBsdWdpbnMgfHwgW11cblxuICAgIHJldHVybiB7XG4gICAgICBwbHVnaW5zOiByZXNQbHVnaW5zLm1hcChwbHVnaW4gPT4gZ2V0Rm9ybWF0dGVkUGx1Z2luKHBsdWdpbikpLFxuICAgICAgdG90YWw6IHJlcy5kYXRhLnRvdGFsLFxuICAgICAgcGFnZTogcGFnZVBhcmFtLFxuICAgICAgcGFnZVNpemUsXG4gICAgfVxuICB9XG4gIGNhdGNoIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGx1Z2luczogW10sXG4gICAgICB0b3RhbDogMCxcbiAgICAgIHBhZ2U6IHBhZ2VQYXJhbSxcbiAgICAgIHBhZ2VTaXplLFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0TWFya2V0cGxhY2VMaXN0Q29uZGl0aW9uID0gKHBsdWdpblR5cGU6IHN0cmluZykgPT4ge1xuICBpZiAoW1BsdWdpbkNhdGVnb3J5RW51bS50b29sLCBQbHVnaW5DYXRlZ29yeUVudW0uYWdlbnQsIFBsdWdpbkNhdGVnb3J5RW51bS5tb2RlbCwgUGx1Z2luQ2F0ZWdvcnlFbnVtLmRhdGFzb3VyY2UsIFBsdWdpbkNhdGVnb3J5RW51bS50cmlnZ2VyXS5pbmNsdWRlcyhwbHVnaW5UeXBlIGFzIFBsdWdpbkNhdGVnb3J5RW51bSkpXG4gICAgcmV0dXJuIGBjYXRlZ29yeT0ke3BsdWdpblR5cGV9YFxuXG4gIGlmIChwbHVnaW5UeXBlID09PSBQbHVnaW5DYXRlZ29yeUVudW0uZXh0ZW5zaW9uKVxuICAgIHJldHVybiAnY2F0ZWdvcnk9ZW5kcG9pbnQnXG5cbiAgaWYgKHBsdWdpblR5cGUgPT09ICdidW5kbGUnKVxuICAgIHJldHVybiAndHlwZT1idW5kbGUnXG5cbiAgcmV0dXJuICcnXG59XG5cbmV4cG9ydCBjb25zdCBnZXRNYXJrZXRwbGFjZUxpc3RGaWx0ZXJUeXBlID0gKGNhdGVnb3J5OiBBY3RpdmVQbHVnaW5UeXBlKSA9PiB7XG4gIGlmIChjYXRlZ29yeSA9PT0gUExVR0lOX1RZUEVfU0VBUkNIX01BUC5hbGwpXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gIGlmIChjYXRlZ29yeSA9PT0gUExVR0lOX1RZUEVfU0VBUkNIX01BUC5idW5kbGUpXG4gICAgcmV0dXJuICdidW5kbGUnXG5cbiAgcmV0dXJuICdwbHVnaW4nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2xsZWN0aW9uc1BhcmFtcyhjYXRlZ29yeTogQWN0aXZlUGx1Z2luVHlwZSk6IENvbGxlY3Rpb25zQW5kUGx1Z2luc1NlYXJjaFBhcmFtcyB7XG4gIGlmIChjYXRlZ29yeSA9PT0gUExVR0lOX1RZUEVfU0VBUkNIX01BUC5hbGwpIHtcbiAgICByZXR1cm4ge31cbiAgfVxuICByZXR1cm4ge1xuICAgIGNhdGVnb3J5LFxuICAgIGNvbmRpdGlvbjogZ2V0TWFya2V0cGxhY2VMaXN0Q29uZGl0aW9uKGNhdGVnb3J5KSxcbiAgICB0eXBlOiBnZXRNYXJrZXRwbGFjZUxpc3RGaWx0ZXJUeXBlKGNhdGVnb3J5KSxcbiAgfVxufVxuIl19