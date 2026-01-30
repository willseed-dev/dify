"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginAction = void 0;
const i18n_config_1 = require("@/i18n-config");
const base_1 = require("@/service/base");
const card_icon_1 = require("../../plugins/card/base/card-icon");
const utils_1 = require("../../plugins/marketplace/utils");
const parser = (plugins, locale) => {
    return plugins.map((plugin) => {
        return {
            id: plugin.name,
            title: (0, i18n_config_1.renderI18nObject)(plugin.label, locale) || plugin.name,
            description: (0, i18n_config_1.renderI18nObject)(plugin.brief, locale) || '',
            type: 'plugin',
            icon: <card_icon_1.default src={plugin.icon}/>,
            data: plugin,
        };
    });
};
exports.pluginAction = {
    key: '@plugin',
    shortcut: '@plugin',
    title: 'Search Plugins',
    description: 'Search and navigate to your plugins',
    search: async (_, searchTerm = '', locale) => {
        try {
            const response = await (0, base_1.postMarketplace)('/plugins/search/advanced', {
                body: {
                    page: 1,
                    page_size: 10,
                    query: searchTerm,
                    type: 'plugin',
                },
            });
            if (!response?.data?.plugins) {
                console.warn('Plugin search: Unexpected response structure', response);
                return [];
            }
            const list = response.data.plugins.map(plugin => ({
                ...plugin,
                icon: (0, utils_1.getPluginIconInMarketplace)(plugin),
            }));
            return parser(list, locale);
        }
        catch (error) {
            console.warn('Plugin search failed:', error);
            return [];
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGx1Z2luLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwrQ0FBZ0Q7QUFDaEQseUNBQWdEO0FBQ2hELGlFQUFvRDtBQUNwRCwyREFBNEU7QUFFNUUsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFpQixFQUFFLE1BQWMsRUFBd0IsRUFBRTtJQUN6RSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUM1QixPQUFPO1lBQ0wsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2YsS0FBSyxFQUFFLElBQUEsOEJBQWdCLEVBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSTtZQUM1RCxXQUFXLEVBQUUsSUFBQSw4QkFBZ0IsRUFBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDekQsSUFBSSxFQUFFLFFBQWlCO1lBQ3ZCLElBQUksRUFBRSxDQUFDLG1CQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFHO1lBQ2hDLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBRVksUUFBQSxZQUFZLEdBQWU7SUFDdEMsR0FBRyxFQUFFLFNBQVM7SUFDZCxRQUFRLEVBQUUsU0FBUztJQUNuQixLQUFLLEVBQUUsZ0JBQWdCO0lBQ3ZCLFdBQVcsRUFBRSxxQ0FBcUM7SUFDbEQsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUMzQyxJQUFJLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsc0JBQWUsRUFBMkMsMEJBQTBCLEVBQUU7Z0JBQzNHLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsQ0FBQztvQkFDUCxTQUFTLEVBQUUsRUFBRTtvQkFDYixLQUFLLEVBQUUsVUFBVTtvQkFDakIsSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7YUFDRixDQUFDLENBQUE7WUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztnQkFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxRQUFRLENBQUMsQ0FBQTtnQkFDdEUsT0FBTyxFQUFFLENBQUE7WUFDWCxDQUFDO1lBRUQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDaEQsR0FBRyxNQUFNO2dCQUNULElBQUksRUFBRSxJQUFBLGtDQUEwQixFQUFDLE1BQU0sQ0FBQzthQUN6QyxDQUFDLENBQUMsQ0FBQTtZQUNILE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRSxNQUFPLENBQUMsQ0FBQTtRQUM5QixDQUFDO1FBQ0QsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDNUMsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO0lBQ0gsQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFBsdWdpbiwgUGx1Z2luc0Zyb21NYXJrZXRwbGFjZVJlc3BvbnNlIH0gZnJvbSAnLi4vLi4vcGx1Z2lucy90eXBlcydcbmltcG9ydCB0eXBlIHsgQWN0aW9uSXRlbSwgUGx1Z2luU2VhcmNoUmVzdWx0IH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IHJlbmRlckkxOG5PYmplY3QgfSBmcm9tICdAL2kxOG4tY29uZmlnJ1xuaW1wb3J0IHsgcG9zdE1hcmtldHBsYWNlIH0gZnJvbSAnQC9zZXJ2aWNlL2Jhc2UnXG5pbXBvcnQgSWNvbiBmcm9tICcuLi8uLi9wbHVnaW5zL2NhcmQvYmFzZS9jYXJkLWljb24nXG5pbXBvcnQgeyBnZXRQbHVnaW5JY29uSW5NYXJrZXRwbGFjZSB9IGZyb20gJy4uLy4uL3BsdWdpbnMvbWFya2V0cGxhY2UvdXRpbHMnXG5cbmNvbnN0IHBhcnNlciA9IChwbHVnaW5zOiBQbHVnaW5bXSwgbG9jYWxlOiBzdHJpbmcpOiBQbHVnaW5TZWFyY2hSZXN1bHRbXSA9PiB7XG4gIHJldHVybiBwbHVnaW5zLm1hcCgocGx1Z2luKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBwbHVnaW4ubmFtZSxcbiAgICAgIHRpdGxlOiByZW5kZXJJMThuT2JqZWN0KHBsdWdpbi5sYWJlbCwgbG9jYWxlKSB8fCBwbHVnaW4ubmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiByZW5kZXJJMThuT2JqZWN0KHBsdWdpbi5icmllZiwgbG9jYWxlKSB8fCAnJyxcbiAgICAgIHR5cGU6ICdwbHVnaW4nIGFzIGNvbnN0LFxuICAgICAgaWNvbjogPEljb24gc3JjPXtwbHVnaW4uaWNvbn0gLz4sXG4gICAgICBkYXRhOiBwbHVnaW4sXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgcGx1Z2luQWN0aW9uOiBBY3Rpb25JdGVtID0ge1xuICBrZXk6ICdAcGx1Z2luJyxcbiAgc2hvcnRjdXQ6ICdAcGx1Z2luJyxcbiAgdGl0bGU6ICdTZWFyY2ggUGx1Z2lucycsXG4gIGRlc2NyaXB0aW9uOiAnU2VhcmNoIGFuZCBuYXZpZ2F0ZSB0byB5b3VyIHBsdWdpbnMnLFxuICBzZWFyY2g6IGFzeW5jIChfLCBzZWFyY2hUZXJtID0gJycsIGxvY2FsZSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHBvc3RNYXJrZXRwbGFjZTx7IGRhdGE6IFBsdWdpbnNGcm9tTWFya2V0cGxhY2VSZXNwb25zZSB9PignL3BsdWdpbnMvc2VhcmNoL2FkdmFuY2VkJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICBwYWdlX3NpemU6IDEwLFxuICAgICAgICAgIHF1ZXJ5OiBzZWFyY2hUZXJtLFxuICAgICAgICAgIHR5cGU6ICdwbHVnaW4nLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgaWYgKCFyZXNwb25zZT8uZGF0YT8ucGx1Z2lucykge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1BsdWdpbiBzZWFyY2g6IFVuZXhwZWN0ZWQgcmVzcG9uc2Ugc3RydWN0dXJlJywgcmVzcG9uc2UpXG4gICAgICAgIHJldHVybiBbXVxuICAgICAgfVxuXG4gICAgICBjb25zdCBsaXN0ID0gcmVzcG9uc2UuZGF0YS5wbHVnaW5zLm1hcChwbHVnaW4gPT4gKHtcbiAgICAgICAgLi4ucGx1Z2luLFxuICAgICAgICBpY29uOiBnZXRQbHVnaW5JY29uSW5NYXJrZXRwbGFjZShwbHVnaW4pLFxuICAgICAgfSkpXG4gICAgICByZXR1cm4gcGFyc2VyKGxpc3QsIGxvY2FsZSEpXG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS53YXJuKCdQbHVnaW4gc2VhcmNoIGZhaWxlZDonLCBlcnJvcilcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfSxcbn1cbiJdfQ==