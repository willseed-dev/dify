"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMarketplaceAllPlugins = void 0;
const react_1 = require("react");
const hooks_1 = require("@/app/components/plugins/marketplace/hooks");
const types_1 = require("@/app/components/plugins/types");
const useMarketplaceAllPlugins = (providers, searchText) => {
    const exclude = (0, react_1.useMemo)(() => {
        return providers.map(provider => provider.plugin_id);
    }, [providers]);
    const { plugins: collectionPlugins = [], isLoading: isCollectionLoading, } = (0, hooks_1.useMarketplacePluginsByCollectionId)('__datasource-settings-pinned-datasources');
    const { plugins, queryPlugins, queryPluginsWithDebounced, isLoading: isPluginsLoading, } = (0, hooks_1.useMarketplacePlugins)();
    (0, react_1.useEffect)(() => {
        if (searchText) {
            queryPluginsWithDebounced({
                query: searchText,
                category: types_1.PluginCategoryEnum.datasource,
                exclude,
                type: 'plugin',
                sortBy: 'install_count',
                sortOrder: 'DESC',
            });
        }
        else {
            queryPlugins({
                query: '',
                category: types_1.PluginCategoryEnum.datasource,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW1hcmtldHBsYWNlLWFsbC1wbHVnaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLW1hcmtldHBsYWNlLWFsbC1wbHVnaW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUdjO0FBQ2Qsc0VBR21EO0FBQ25ELDBEQUFtRTtBQUU1RCxNQUFNLHdCQUF3QixHQUFHLENBQUMsU0FBZ0IsRUFBRSxVQUFrQixFQUFFLEVBQUU7SUFDL0UsTUFBTSxPQUFPLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQzNCLE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN0RCxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBQ2YsTUFBTSxFQUNKLE9BQU8sRUFBRSxpQkFBaUIsR0FBRyxFQUFFLEVBQy9CLFNBQVMsRUFBRSxtQkFBbUIsR0FDL0IsR0FBRyxJQUFBLDJDQUFtQyxFQUFDLDBDQUEwQyxDQUFDLENBQUE7SUFDbkYsTUFBTSxFQUNKLE9BQU8sRUFDUCxZQUFZLEVBQ1oseUJBQXlCLEVBQ3pCLFNBQVMsRUFBRSxnQkFBZ0IsR0FDNUIsR0FBRyxJQUFBLDZCQUFxQixHQUFFLENBQUE7SUFFM0IsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLElBQUksVUFBVSxFQUFFLENBQUM7WUFDZix5QkFBeUIsQ0FBQztnQkFDeEIsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLFFBQVEsRUFBRSwwQkFBa0IsQ0FBQyxVQUFVO2dCQUN2QyxPQUFPO2dCQUNQLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxlQUFlO2dCQUN2QixTQUFTLEVBQUUsTUFBTTthQUNsQixDQUFDLENBQUE7UUFDSixDQUFDO2FBQ0ksQ0FBQztZQUNKLFlBQVksQ0FBQztnQkFDWCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxRQUFRLEVBQUUsMEJBQWtCLENBQUMsVUFBVTtnQkFDdkMsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsT0FBTztnQkFDUCxNQUFNLEVBQUUsZUFBZTtnQkFDdkIsU0FBUyxFQUFFLE1BQU07YUFDbEIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSx5QkFBeUIsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUVsRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDOUIsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBRTFGLElBQUksT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3hDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFFekIsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUM7b0JBQ3JGLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDM0IsQ0FBQztRQUNILENBQUM7UUFFRCxPQUFPLFVBQVUsQ0FBQTtJQUNuQixDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUV6QyxPQUFPO1FBQ0wsT0FBTyxFQUFFLFVBQVU7UUFDbkIsU0FBUyxFQUFFLG1CQUFtQixJQUFJLGdCQUFnQjtLQUNuRCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBMURZLFFBQUEsd0JBQXdCLDRCQTBEcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICB1c2VFZmZlY3QsXG4gIHVzZU1lbW8sXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgdXNlTWFya2V0cGxhY2VQbHVnaW5zLFxuICB1c2VNYXJrZXRwbGFjZVBsdWdpbnNCeUNvbGxlY3Rpb25JZCxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL21hcmtldHBsYWNlL2hvb2tzJ1xuaW1wb3J0IHsgUGx1Z2luQ2F0ZWdvcnlFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgdXNlTWFya2V0cGxhY2VBbGxQbHVnaW5zID0gKHByb3ZpZGVyczogYW55W10sIHNlYXJjaFRleHQ6IHN0cmluZykgPT4ge1xuICBjb25zdCBleGNsdWRlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHByb3ZpZGVycy5tYXAocHJvdmlkZXIgPT4gcHJvdmlkZXIucGx1Z2luX2lkKVxuICB9LCBbcHJvdmlkZXJzXSlcbiAgY29uc3Qge1xuICAgIHBsdWdpbnM6IGNvbGxlY3Rpb25QbHVnaW5zID0gW10sXG4gICAgaXNMb2FkaW5nOiBpc0NvbGxlY3Rpb25Mb2FkaW5nLFxuICB9ID0gdXNlTWFya2V0cGxhY2VQbHVnaW5zQnlDb2xsZWN0aW9uSWQoJ19fZGF0YXNvdXJjZS1zZXR0aW5ncy1waW5uZWQtZGF0YXNvdXJjZXMnKVxuICBjb25zdCB7XG4gICAgcGx1Z2lucyxcbiAgICBxdWVyeVBsdWdpbnMsXG4gICAgcXVlcnlQbHVnaW5zV2l0aERlYm91bmNlZCxcbiAgICBpc0xvYWRpbmc6IGlzUGx1Z2luc0xvYWRpbmcsXG4gIH0gPSB1c2VNYXJrZXRwbGFjZVBsdWdpbnMoKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNlYXJjaFRleHQpIHtcbiAgICAgIHF1ZXJ5UGx1Z2luc1dpdGhEZWJvdW5jZWQoe1xuICAgICAgICBxdWVyeTogc2VhcmNoVGV4dCxcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5kYXRhc291cmNlLFxuICAgICAgICBleGNsdWRlLFxuICAgICAgICB0eXBlOiAncGx1Z2luJyxcbiAgICAgICAgc29ydEJ5OiAnaW5zdGFsbF9jb3VudCcsXG4gICAgICAgIHNvcnRPcmRlcjogJ0RFU0MnLFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBxdWVyeVBsdWdpbnMoe1xuICAgICAgICBxdWVyeTogJycsXG4gICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0uZGF0YXNvdXJjZSxcbiAgICAgICAgdHlwZTogJ3BsdWdpbicsXG4gICAgICAgIHBhZ2VTaXplOiAxMDAwLFxuICAgICAgICBleGNsdWRlLFxuICAgICAgICBzb3J0Qnk6ICdpbnN0YWxsX2NvdW50JyxcbiAgICAgICAgc29ydE9yZGVyOiAnREVTQycsXG4gICAgICB9KVxuICAgIH1cbiAgfSwgW3F1ZXJ5UGx1Z2lucywgcXVlcnlQbHVnaW5zV2l0aERlYm91bmNlZCwgc2VhcmNoVGV4dCwgZXhjbHVkZV0pXG5cbiAgY29uc3QgYWxsUGx1Z2lucyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGFsbFBsdWdpbnMgPSBjb2xsZWN0aW9uUGx1Z2lucy5maWx0ZXIocGx1Z2luID0+ICFleGNsdWRlLmluY2x1ZGVzKHBsdWdpbi5wbHVnaW5faWQpKVxuXG4gICAgaWYgKHBsdWdpbnM/Lmxlbmd0aCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IHBsdWdpbnNbaV1cblxuICAgICAgICBpZiAocGx1Z2luLnR5cGUgIT09ICdidW5kbGUnICYmICFhbGxQbHVnaW5zLmZpbmQocCA9PiBwLnBsdWdpbl9pZCA9PT0gcGx1Z2luLnBsdWdpbl9pZCkpXG4gICAgICAgICAgYWxsUGx1Z2lucy5wdXNoKHBsdWdpbilcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYWxsUGx1Z2luc1xuICB9LCBbcGx1Z2lucywgY29sbGVjdGlvblBsdWdpbnMsIGV4Y2x1ZGVdKVxuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogYWxsUGx1Z2lucyxcbiAgICBpc0xvYWRpbmc6IGlzQ29sbGVjdGlvbkxvYWRpbmcgfHwgaXNQbHVnaW5zTG9hZGluZyxcbiAgfVxufVxuIl19