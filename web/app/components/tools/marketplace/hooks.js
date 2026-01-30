"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMarketplace = void 0;
const react_1 = require("react");
const constants_1 = require("@/app/components/plugins/marketplace/constants");
const hooks_1 = require("@/app/components/plugins/marketplace/hooks");
const utils_1 = require("@/app/components/plugins/marketplace/utils");
const types_1 = require("@/app/components/plugins/types");
const use_tools_1 = require("@/service/use-tools");
const useMarketplace = (searchPluginText, filterPluginTags) => {
    const { data: toolProvidersData, isSuccess } = (0, use_tools_1.useAllToolProviders)();
    const exclude = (0, react_1.useMemo)(() => {
        if (isSuccess)
            return toolProvidersData?.filter(toolProvider => !!toolProvider.plugin_id).map(toolProvider => toolProvider.plugin_id);
    }, [isSuccess, toolProvidersData]);
    const { isLoading, marketplaceCollections, marketplaceCollectionPluginsMap, queryMarketplaceCollectionsAndPlugins, } = (0, hooks_1.useMarketplaceCollectionsAndPlugins)();
    const { plugins, resetPlugins, queryPlugins, queryPluginsWithDebounced, isLoading: isPluginsLoading, fetchNextPage, hasNextPage, page: pluginsPage, } = (0, hooks_1.useMarketplacePlugins)();
    const searchPluginTextRef = (0, react_1.useRef)(searchPluginText);
    const filterPluginTagsRef = (0, react_1.useRef)(filterPluginTags);
    (0, react_1.useEffect)(() => {
        searchPluginTextRef.current = searchPluginText;
        filterPluginTagsRef.current = filterPluginTags;
    }, [searchPluginText, filterPluginTags]);
    (0, react_1.useEffect)(() => {
        if ((searchPluginText || filterPluginTags.length) && isSuccess) {
            if (searchPluginText) {
                queryPluginsWithDebounced({
                    category: types_1.PluginCategoryEnum.tool,
                    query: searchPluginText,
                    tags: filterPluginTags,
                    exclude,
                    type: 'plugin',
                });
                return;
            }
            queryPlugins({
                category: types_1.PluginCategoryEnum.tool,
                query: searchPluginText,
                tags: filterPluginTags,
                exclude,
                type: 'plugin',
            });
        }
        else {
            if (isSuccess) {
                queryMarketplaceCollectionsAndPlugins({
                    category: types_1.PluginCategoryEnum.tool,
                    condition: (0, utils_1.getMarketplaceListCondition)(types_1.PluginCategoryEnum.tool),
                    exclude,
                    type: 'plugin',
                });
                resetPlugins();
            }
        }
    }, [searchPluginText, filterPluginTags, queryPlugins, queryMarketplaceCollectionsAndPlugins, queryPluginsWithDebounced, resetPlugins, exclude, isSuccess]);
    const handleScroll = (0, react_1.useCallback)((e) => {
        const target = e.target;
        const { scrollTop, scrollHeight, clientHeight, } = target;
        if (scrollTop + clientHeight >= scrollHeight - constants_1.SCROLL_BOTTOM_THRESHOLD && scrollTop > 0) {
            const searchPluginText = searchPluginTextRef.current;
            const filterPluginTags = filterPluginTagsRef.current;
            if (hasNextPage && (!!searchPluginText || !!filterPluginTags.length))
                fetchNextPage();
        }
    }, [exclude, fetchNextPage, hasNextPage, plugins, queryPlugins]);
    return {
        isLoading: isLoading || isPluginsLoading,
        marketplaceCollections,
        marketplaceCollectionPluginsMap,
        plugins,
        handleScroll,
        page: Math.max(pluginsPage || 0, 1),
    };
};
exports.useMarketplace = useMarketplace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FLYztBQUNkLDhFQUF3RjtBQUN4RixzRUFHbUQ7QUFDbkQsc0VBQXdGO0FBQ3hGLDBEQUFtRTtBQUNuRSxtREFBeUQ7QUFFbEQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxnQkFBd0IsRUFBRSxnQkFBMEIsRUFBRSxFQUFFO0lBQ3JGLE1BQU0sRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSwrQkFBbUIsR0FBRSxDQUFBO0lBQ3BFLE1BQU0sT0FBTyxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUMzQixJQUFJLFNBQVM7WUFDWCxPQUFPLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVUsQ0FBQyxDQUFBO0lBQzNILENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7SUFDbEMsTUFBTSxFQUNKLFNBQVMsRUFDVCxzQkFBc0IsRUFDdEIsK0JBQStCLEVBQy9CLHFDQUFxQyxHQUN0QyxHQUFHLElBQUEsMkNBQW1DLEdBQUUsQ0FBQTtJQUN6QyxNQUFNLEVBQ0osT0FBTyxFQUNQLFlBQVksRUFDWixZQUFZLEVBQ1oseUJBQXlCLEVBQ3pCLFNBQVMsRUFBRSxnQkFBZ0IsRUFDM0IsYUFBYSxFQUNiLFdBQVcsRUFDWCxJQUFJLEVBQUUsV0FBVyxHQUNsQixHQUFHLElBQUEsNkJBQXFCLEdBQUUsQ0FBQTtJQUMzQixNQUFNLG1CQUFtQixHQUFHLElBQUEsY0FBTSxFQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDcEQsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLGNBQU0sRUFBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBRXBELElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDYixtQkFBbUIsQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUE7UUFDOUMsbUJBQW1CLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFBO0lBQ2hELENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtJQUN4QyxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsSUFBSSxDQUFDLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQy9ELElBQUksZ0JBQWdCLEVBQUUsQ0FBQztnQkFDckIseUJBQXlCLENBQUM7b0JBQ3hCLFFBQVEsRUFBRSwwQkFBa0IsQ0FBQyxJQUFJO29CQUNqQyxLQUFLLEVBQUUsZ0JBQWdCO29CQUN2QixJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixPQUFPO29CQUNQLElBQUksRUFBRSxRQUFRO2lCQUNmLENBQUMsQ0FBQTtnQkFDRixPQUFNO1lBQ1IsQ0FBQztZQUNELFlBQVksQ0FBQztnQkFDWCxRQUFRLEVBQUUsMEJBQWtCLENBQUMsSUFBSTtnQkFDakMsS0FBSyxFQUFFLGdCQUFnQjtnQkFDdkIsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsT0FBTztnQkFDUCxJQUFJLEVBQUUsUUFBUTthQUNmLENBQUMsQ0FBQTtRQUNKLENBQUM7YUFDSSxDQUFDO1lBQ0osSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDZCxxQ0FBcUMsQ0FBQztvQkFDcEMsUUFBUSxFQUFFLDBCQUFrQixDQUFDLElBQUk7b0JBQ2pDLFNBQVMsRUFBRSxJQUFBLG1DQUEyQixFQUFDLDBCQUFrQixDQUFDLElBQUksQ0FBQztvQkFDL0QsT0FBTztvQkFDUCxJQUFJLEVBQUUsUUFBUTtpQkFDZixDQUFDLENBQUE7Z0JBQ0YsWUFBWSxFQUFFLENBQUE7WUFDaEIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUscUNBQXFDLEVBQUUseUJBQXlCLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBRTFKLE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLENBQVEsRUFBRSxFQUFFO1FBQzVDLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUF3QixDQUFBO1FBQ3pDLE1BQU0sRUFDSixTQUFTLEVBQ1QsWUFBWSxFQUNaLFlBQVksR0FDYixHQUFHLE1BQU0sQ0FBQTtRQUNWLElBQUksU0FBUyxHQUFHLFlBQVksSUFBSSxZQUFZLEdBQUcsbUNBQXVCLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3hGLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFBO1lBQ3BELE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFBO1lBQ3BELElBQUksV0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xFLGFBQWEsRUFBRSxDQUFBO1FBQ25CLENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQTtJQUVoRSxPQUFPO1FBQ0wsU0FBUyxFQUFFLFNBQVMsSUFBSSxnQkFBZ0I7UUFDeEMsc0JBQXNCO1FBQ3RCLCtCQUErQjtRQUMvQixPQUFPO1FBQ1AsWUFBWTtRQUNaLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BDLENBQUE7QUFDSCxDQUFDLENBQUE7QUFyRlksUUFBQSxjQUFjLGtCQXFGMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICB1c2VDYWxsYmFjayxcbiAgdXNlRWZmZWN0LFxuICB1c2VNZW1vLFxuICB1c2VSZWYsXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU0NST0xMX0JPVFRPTV9USFJFU0hPTEQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvbWFya2V0cGxhY2UvY29uc3RhbnRzJ1xuaW1wb3J0IHtcbiAgdXNlTWFya2V0cGxhY2VDb2xsZWN0aW9uc0FuZFBsdWdpbnMsXG4gIHVzZU1hcmtldHBsYWNlUGx1Z2lucyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL21hcmtldHBsYWNlL2hvb2tzJ1xuaW1wb3J0IHsgZ2V0TWFya2V0cGxhY2VMaXN0Q29uZGl0aW9uIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL21hcmtldHBsYWNlL3V0aWxzJ1xuaW1wb3J0IHsgUGx1Z2luQ2F0ZWdvcnlFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0IHsgdXNlQWxsVG9vbFByb3ZpZGVycyB9IGZyb20gJ0Avc2VydmljZS91c2UtdG9vbHMnXG5cbmV4cG9ydCBjb25zdCB1c2VNYXJrZXRwbGFjZSA9IChzZWFyY2hQbHVnaW5UZXh0OiBzdHJpbmcsIGZpbHRlclBsdWdpblRhZ3M6IHN0cmluZ1tdKSA9PiB7XG4gIGNvbnN0IHsgZGF0YTogdG9vbFByb3ZpZGVyc0RhdGEsIGlzU3VjY2VzcyB9ID0gdXNlQWxsVG9vbFByb3ZpZGVycygpXG4gIGNvbnN0IGV4Y2x1ZGUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoaXNTdWNjZXNzKVxuICAgICAgcmV0dXJuIHRvb2xQcm92aWRlcnNEYXRhPy5maWx0ZXIodG9vbFByb3ZpZGVyID0+ICEhdG9vbFByb3ZpZGVyLnBsdWdpbl9pZCkubWFwKHRvb2xQcm92aWRlciA9PiB0b29sUHJvdmlkZXIucGx1Z2luX2lkISlcbiAgfSwgW2lzU3VjY2VzcywgdG9vbFByb3ZpZGVyc0RhdGFdKVxuICBjb25zdCB7XG4gICAgaXNMb2FkaW5nLFxuICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnMsXG4gICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcCxcbiAgICBxdWVyeU1hcmtldHBsYWNlQ29sbGVjdGlvbnNBbmRQbHVnaW5zLFxuICB9ID0gdXNlTWFya2V0cGxhY2VDb2xsZWN0aW9uc0FuZFBsdWdpbnMoKVxuICBjb25zdCB7XG4gICAgcGx1Z2lucyxcbiAgICByZXNldFBsdWdpbnMsXG4gICAgcXVlcnlQbHVnaW5zLFxuICAgIHF1ZXJ5UGx1Z2luc1dpdGhEZWJvdW5jZWQsXG4gICAgaXNMb2FkaW5nOiBpc1BsdWdpbnNMb2FkaW5nLFxuICAgIGZldGNoTmV4dFBhZ2UsXG4gICAgaGFzTmV4dFBhZ2UsXG4gICAgcGFnZTogcGx1Z2luc1BhZ2UsXG4gIH0gPSB1c2VNYXJrZXRwbGFjZVBsdWdpbnMoKVxuICBjb25zdCBzZWFyY2hQbHVnaW5UZXh0UmVmID0gdXNlUmVmKHNlYXJjaFBsdWdpblRleHQpXG4gIGNvbnN0IGZpbHRlclBsdWdpblRhZ3NSZWYgPSB1c2VSZWYoZmlsdGVyUGx1Z2luVGFncylcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNlYXJjaFBsdWdpblRleHRSZWYuY3VycmVudCA9IHNlYXJjaFBsdWdpblRleHRcbiAgICBmaWx0ZXJQbHVnaW5UYWdzUmVmLmN1cnJlbnQgPSBmaWx0ZXJQbHVnaW5UYWdzXG4gIH0sIFtzZWFyY2hQbHVnaW5UZXh0LCBmaWx0ZXJQbHVnaW5UYWdzXSlcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoKHNlYXJjaFBsdWdpblRleHQgfHwgZmlsdGVyUGx1Z2luVGFncy5sZW5ndGgpICYmIGlzU3VjY2Vzcykge1xuICAgICAgaWYgKHNlYXJjaFBsdWdpblRleHQpIHtcbiAgICAgICAgcXVlcnlQbHVnaW5zV2l0aERlYm91bmNlZCh7XG4gICAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICAgICAgICAgIHF1ZXJ5OiBzZWFyY2hQbHVnaW5UZXh0LFxuICAgICAgICAgIHRhZ3M6IGZpbHRlclBsdWdpblRhZ3MsXG4gICAgICAgICAgZXhjbHVkZSxcbiAgICAgICAgICB0eXBlOiAncGx1Z2luJyxcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBxdWVyeVBsdWdpbnMoe1xuICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICAgIHF1ZXJ5OiBzZWFyY2hQbHVnaW5UZXh0LFxuICAgICAgICB0YWdzOiBmaWx0ZXJQbHVnaW5UYWdzLFxuICAgICAgICBleGNsdWRlLFxuICAgICAgICB0eXBlOiAncGx1Z2luJyxcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGlzU3VjY2Vzcykge1xuICAgICAgICBxdWVyeU1hcmtldHBsYWNlQ29sbGVjdGlvbnNBbmRQbHVnaW5zKHtcbiAgICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICAgICAgY29uZGl0aW9uOiBnZXRNYXJrZXRwbGFjZUxpc3RDb25kaXRpb24oUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wpLFxuICAgICAgICAgIGV4Y2x1ZGUsXG4gICAgICAgICAgdHlwZTogJ3BsdWdpbicsXG4gICAgICAgIH0pXG4gICAgICAgIHJlc2V0UGx1Z2lucygpXG4gICAgICB9XG4gICAgfVxuICB9LCBbc2VhcmNoUGx1Z2luVGV4dCwgZmlsdGVyUGx1Z2luVGFncywgcXVlcnlQbHVnaW5zLCBxdWVyeU1hcmtldHBsYWNlQ29sbGVjdGlvbnNBbmRQbHVnaW5zLCBxdWVyeVBsdWdpbnNXaXRoRGVib3VuY2VkLCByZXNldFBsdWdpbnMsIGV4Y2x1ZGUsIGlzU3VjY2Vzc10pXG5cbiAgY29uc3QgaGFuZGxlU2Nyb2xsID0gdXNlQ2FsbGJhY2soKGU6IEV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERpdkVsZW1lbnRcbiAgICBjb25zdCB7XG4gICAgICBzY3JvbGxUb3AsXG4gICAgICBzY3JvbGxIZWlnaHQsXG4gICAgICBjbGllbnRIZWlnaHQsXG4gICAgfSA9IHRhcmdldFxuICAgIGlmIChzY3JvbGxUb3AgKyBjbGllbnRIZWlnaHQgPj0gc2Nyb2xsSGVpZ2h0IC0gU0NST0xMX0JPVFRPTV9USFJFU0hPTEQgJiYgc2Nyb2xsVG9wID4gMCkge1xuICAgICAgY29uc3Qgc2VhcmNoUGx1Z2luVGV4dCA9IHNlYXJjaFBsdWdpblRleHRSZWYuY3VycmVudFxuICAgICAgY29uc3QgZmlsdGVyUGx1Z2luVGFncyA9IGZpbHRlclBsdWdpblRhZ3NSZWYuY3VycmVudFxuICAgICAgaWYgKGhhc05leHRQYWdlICYmICghIXNlYXJjaFBsdWdpblRleHQgfHwgISFmaWx0ZXJQbHVnaW5UYWdzLmxlbmd0aCkpXG4gICAgICAgIGZldGNoTmV4dFBhZ2UoKVxuICAgIH1cbiAgfSwgW2V4Y2x1ZGUsIGZldGNoTmV4dFBhZ2UsIGhhc05leHRQYWdlLCBwbHVnaW5zLCBxdWVyeVBsdWdpbnNdKVxuXG4gIHJldHVybiB7XG4gICAgaXNMb2FkaW5nOiBpc0xvYWRpbmcgfHwgaXNQbHVnaW5zTG9hZGluZyxcbiAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zLFxuICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXAsXG4gICAgcGx1Z2lucyxcbiAgICBoYW5kbGVTY3JvbGwsXG4gICAgcGFnZTogTWF0aC5tYXgocGx1Z2luc1BhZ2UgfHwgMCwgMSksXG4gIH1cbn1cbiJdfQ==