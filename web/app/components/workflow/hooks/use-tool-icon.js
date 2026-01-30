"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetToolIcon = exports.useToolIcon = void 0;
const react_1 = require("react");
const types_1 = require("@/app/components/tools/types");
const use_theme_1 = require("@/hooks/use-theme");
const use_tools_1 = require("@/service/use-tools");
const use_triggers_1 = require("@/service/use-triggers");
const utils_1 = require("@/utils");
const store_1 = require("../store");
const types_2 = require("../types");
const isTriggerPluginNode = (data) => data.type === types_2.BlockEnum.TriggerPlugin;
const isToolNode = (data) => data.type === types_2.BlockEnum.Tool;
const isDataSourceNode = (data) => data.type === types_2.BlockEnum.DataSource;
const resolveIconByTheme = (currentTheme, icon, iconDark) => {
    if (currentTheme === 'dark' && iconDark)
        return iconDark;
    return icon;
};
const findTriggerPluginIcon = (identifiers, triggers, currentTheme) => {
    const targetTriggers = triggers || [];
    for (const identifier of identifiers) {
        if (!identifier)
            continue;
        const matched = targetTriggers.find(trigger => trigger.id === identifier || (0, utils_1.canFindTool)(trigger.id, identifier));
        if (matched)
            return resolveIconByTheme(currentTheme, matched.icon, matched.icon_dark);
    }
    return undefined;
};
const useToolIcon = (data) => {
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const { data: mcpTools } = (0, use_tools_1.useAllMCPTools)();
    const dataSourceList = (0, store_1.useStore)(s => s.dataSourceList);
    const { data: triggerPlugins } = (0, use_triggers_1.useAllTriggerPlugins)();
    const { theme } = (0, use_theme_1.default)();
    const toolIcon = (0, react_1.useMemo)(() => {
        if (!data)
            return '';
        if (isTriggerPluginNode(data)) {
            const icon = findTriggerPluginIcon([
                data.plugin_id,
                data.provider_id,
                data.provider_name,
            ], triggerPlugins, theme);
            if (icon)
                return icon;
        }
        if (isToolNode(data)) {
            let primaryCollection;
            switch (data.provider_type) {
                case types_1.CollectionType.custom:
                    primaryCollection = customTools;
                    break;
                case types_1.CollectionType.mcp:
                    primaryCollection = mcpTools;
                    break;
                case types_1.CollectionType.workflow:
                    primaryCollection = workflowTools;
                    break;
                case types_1.CollectionType.builtIn:
                default:
                    primaryCollection = buildInTools;
                    break;
            }
            const collectionsToSearch = [
                primaryCollection,
                buildInTools,
                customTools,
                workflowTools,
                mcpTools,
            ];
            const seen = new Set();
            for (const collection of collectionsToSearch) {
                if (!collection || seen.has(collection))
                    continue;
                seen.add(collection);
                const matched = collection.find((toolWithProvider) => {
                    if ((0, utils_1.canFindTool)(toolWithProvider.id, data.provider_id))
                        return true;
                    if (data.plugin_id && toolWithProvider.plugin_id === data.plugin_id)
                        return true;
                    return data.provider_name === toolWithProvider.name;
                });
                if (matched) {
                    const icon = resolveIconByTheme(theme, matched.icon, matched.icon_dark);
                    if (icon)
                        return icon;
                }
            }
            const fallbackIcon = resolveIconByTheme(theme, data.provider_icon, data.provider_icon_dark);
            if (fallbackIcon)
                return fallbackIcon;
            return '';
        }
        if (isDataSourceNode(data))
            return dataSourceList?.find(toolWithProvider => toolWithProvider.plugin_id === data.plugin_id)?.icon || '';
        return '';
    }, [data, dataSourceList, buildInTools, customTools, workflowTools, mcpTools, triggerPlugins, theme]);
    return toolIcon;
};
exports.useToolIcon = useToolIcon;
const useGetToolIcon = () => {
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const { data: mcpTools } = (0, use_tools_1.useAllMCPTools)();
    const { data: triggerPlugins } = (0, use_triggers_1.useAllTriggerPlugins)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { theme } = (0, use_theme_1.default)();
    const getToolIcon = (0, react_1.useCallback)((data) => {
        const { buildInTools: storeBuiltInTools, customTools: storeCustomTools, workflowTools: storeWorkflowTools, mcpTools: storeMcpTools, dataSourceList, } = workflowStore.getState();
        if (isTriggerPluginNode(data)) {
            return findTriggerPluginIcon([
                data.plugin_id,
                data.provider_id,
                data.provider_name,
            ], triggerPlugins, theme);
        }
        if (isToolNode(data)) {
            const primaryCollection = (() => {
                switch (data.provider_type) {
                    case types_1.CollectionType.custom:
                        return storeCustomTools ?? customTools;
                    case types_1.CollectionType.mcp:
                        return storeMcpTools ?? mcpTools;
                    case types_1.CollectionType.workflow:
                        return storeWorkflowTools ?? workflowTools;
                    case types_1.CollectionType.builtIn:
                    default:
                        return storeBuiltInTools ?? buildInTools;
                }
            })();
            const collectionsToSearch = [
                primaryCollection,
                storeBuiltInTools ?? buildInTools,
                storeCustomTools ?? customTools,
                storeWorkflowTools ?? workflowTools,
                storeMcpTools ?? mcpTools,
            ];
            const seen = new Set();
            for (const collection of collectionsToSearch) {
                if (!collection || seen.has(collection))
                    continue;
                seen.add(collection);
                const matched = collection.find((toolWithProvider) => {
                    if ((0, utils_1.canFindTool)(toolWithProvider.id, data.provider_id))
                        return true;
                    if (data.plugin_id && toolWithProvider.plugin_id === data.plugin_id)
                        return true;
                    return data.provider_name === toolWithProvider.name;
                });
                if (matched) {
                    const icon = resolveIconByTheme(theme, matched.icon, matched.icon_dark);
                    if (icon)
                        return icon;
                }
            }
            const fallbackIcon = resolveIconByTheme(theme, data.provider_icon, data.provider_icon_dark);
            if (fallbackIcon)
                return fallbackIcon;
            return undefined;
        }
        if (isDataSourceNode(data))
            return dataSourceList?.find(toolWithProvider => toolWithProvider.plugin_id === data.plugin_id)?.icon;
        return undefined;
    }, [workflowStore, triggerPlugins, buildInTools, customTools, workflowTools, mcpTools, theme]);
    return getToolIcon;
};
exports.useGetToolIcon = useGetToolIcon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXRvb2wtaWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS10b29sLWljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0EsaUNBQTRDO0FBQzVDLHdEQUE2RDtBQUM3RCxpREFBd0M7QUFDeEMsbURBSzRCO0FBQzVCLHlEQUE2RDtBQUM3RCxtQ0FBcUM7QUFDckMsb0NBQXFEO0FBQ3JELG9DQUFvQztBQUVwQyxNQUFNLG1CQUFtQixHQUFHLENBQUMsSUFBa0IsRUFBaUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxhQUFhLENBQUE7QUFFeEgsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFrQixFQUF3QixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBUyxDQUFDLElBQUksQ0FBQTtBQUU3RixNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBa0IsRUFBOEIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxVQUFVLENBQUE7QUFJL0csTUFBTSxrQkFBa0IsR0FBRyxDQUN6QixZQUFnQyxFQUNoQyxJQUFnQixFQUNoQixRQUFvQixFQUNwQixFQUFFO0lBQ0YsSUFBSSxZQUFZLEtBQUssTUFBTSxJQUFJLFFBQVE7UUFDckMsT0FBTyxRQUFRLENBQUE7SUFDakIsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDLENBQUE7QUFFRCxNQUFNLHFCQUFxQixHQUFHLENBQzVCLFdBQW1DLEVBQ25DLFFBQTJDLEVBQzNDLFlBQXFCLEVBQ3JCLEVBQUU7SUFDRixNQUFNLGNBQWMsR0FBRyxRQUFRLElBQUksRUFBRSxDQUFBO0lBQ3JDLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVU7WUFDYixTQUFRO1FBQ1YsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxF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Q2IsT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLGdCQUFnQixDQUFDLElBQUksQ0FBQTtnQkFDckQsQ0FBQyxDQUFDLENBQUE7Z0JBQ0YsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDWixNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7b0JBQ3ZFLElBQUksSUFBSTt3QkFDTixPQUFPLElBQUksQ0FBQTtnQkFDZixDQUFDO1lBQ0gsQ0FBQztZQUVELE1BQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1lBQzNGLElBQUksWUFBWTtnQkFDZCxPQUFPLFlBQVksQ0FBQTtZQUVyQixPQUFPLFNBQVMsQ0FBQTtRQUNsQixDQUFDO1FBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7WUFDeEIsT0FBTyxjQUFjLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQTtRQUV0RyxPQUFPLFNBQVMsQ0FBQTtJQUNsQixDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBRTlGLE9BQU8sV0FBVyxDQUFBO0FBQ3BCLENBQUMsQ0FBQTtBQXRGWSxRQUFBLGNBQWMsa0JBc0YxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVHJpZ2dlcldpdGhQcm92aWRlciB9IGZyb20gJy4uL2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlTm9kZVR5cGUgfSBmcm9tICcuLi9ub2Rlcy9kYXRhLXNvdXJjZS90eXBlcydcbmltcG9ydCB0eXBlIHsgVG9vbE5vZGVUeXBlIH0gZnJvbSAnLi4vbm9kZXMvdG9vbC90eXBlcydcbmltcG9ydCB0eXBlIHsgUGx1Z2luVHJpZ2dlck5vZGVUeXBlIH0gZnJvbSAnLi4vbm9kZXMvdHJpZ2dlci1wbHVnaW4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE5vZGUsIFRvb2xXaXRoUHJvdmlkZXIgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBDb2xsZWN0aW9uVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdHlwZXMnXG5pbXBvcnQgdXNlVGhlbWUgZnJvbSAnQC9ob29rcy91c2UtdGhlbWUnXG5pbXBvcnQge1xuICB1c2VBbGxCdWlsdEluVG9vbHMsXG4gIHVzZUFsbEN1c3RvbVRvb2xzLFxuICB1c2VBbGxNQ1BUb29scyxcbiAgdXNlQWxsV29ya2Zsb3dUb29scyxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10b29scydcbmltcG9ydCB7IHVzZUFsbFRyaWdnZXJQbHVnaW5zIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10cmlnZ2VycydcbmltcG9ydCB7IGNhbkZpbmRUb29sIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCB7IHVzZVN0b3JlLCB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnLi4vc3RvcmUnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICcuLi90eXBlcydcblxuY29uc3QgaXNUcmlnZ2VyUGx1Z2luTm9kZSA9IChkYXRhOiBOb2RlWydkYXRhJ10pOiBkYXRhIGlzIFBsdWdpblRyaWdnZXJOb2RlVHlwZSA9PiBkYXRhLnR5cGUgPT09IEJsb2NrRW51bS5UcmlnZ2VyUGx1Z2luXG5cbmNvbnN0IGlzVG9vbE5vZGUgPSAoZGF0YTogTm9kZVsnZGF0YSddKTogZGF0YSBpcyBUb29sTm9kZVR5cGUgPT4gZGF0YS50eXBlID09PSBCbG9ja0VudW0uVG9vbFxuXG5jb25zdCBpc0RhdGFTb3VyY2VOb2RlID0gKGRhdGE6IE5vZGVbJ2RhdGEnXSk6IGRhdGEgaXMgRGF0YVNvdXJjZU5vZGVUeXBlID0+IGRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2VcblxudHlwZSBJY29uVmFsdWUgPSBUb29sV2l0aFByb3ZpZGVyWydpY29uJ11cblxuY29uc3QgcmVzb2x2ZUljb25CeVRoZW1lID0gKFxuICBjdXJyZW50VGhlbWU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgaWNvbj86IEljb25WYWx1ZSxcbiAgaWNvbkRhcms/OiBJY29uVmFsdWUsXG4pID0+IHtcbiAgaWYgKGN1cnJlbnRUaGVtZSA9PT0gJ2RhcmsnICYmIGljb25EYXJrKVxuICAgIHJldHVybiBpY29uRGFya1xuICByZXR1cm4gaWNvblxufVxuXG5jb25zdCBmaW5kVHJpZ2dlclBsdWdpbkljb24gPSAoXG4gIGlkZW50aWZpZXJzOiAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdLFxuICB0cmlnZ2VyczogVHJpZ2dlcldpdGhQcm92aWRlcltdIHwgdW5kZWZpbmVkLFxuICBjdXJyZW50VGhlbWU/OiBzdHJpbmcsXG4pID0+IHtcbiAgY29uc3QgdGFyZ2V0VHJpZ2dlcnMgPSB0cmlnZ2VycyB8fCBbXVxuICBmb3IgKGNvbnN0IGlkZW50aWZpZXIgb2YgaWRlbnRpZmllcnMpIHtcbiAgICBpZiAoIWlkZW50aWZpZXIpXG4gICAgICBjb250aW51ZVxuICAgIGNvbnN0IG1hdGNoZWQgPSB0YXJnZXRUcmlnZ2Vycy5maW5kKHRyaWdnZXIgPT4gdHJpZ2dlci5pZCA9PT0gaWRlbnRpZmllciB8fCBjYW5GaW5kVG9vbCh0cmlnZ2VyLmlkLCBpZGVudGlmaWVyKSlcbiAgICBpZiAobWF0Y2hlZClcbiAgICAgIHJldHVybiByZXNvbHZlSWNvbkJ5VGhlbWUoY3VycmVudFRoZW1lLCBtYXRjaGVkLmljb24sIG1hdGNoZWQuaWNvbl9kYXJrKVxuICB9XG4gIHJldHVybiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVRvb2xJY29uID0gKGRhdGE/OiBOb2RlWydkYXRhJ10pID0+IHtcbiAgY29uc3QgeyBkYXRhOiBidWlsZEluVG9vbHMgfSA9IHVzZUFsbEJ1aWx0SW5Ub29scygpXG4gIGNvbnN0IHsgZGF0YTogY3VzdG9tVG9vbHMgfSA9IHVzZUFsbEN1c3RvbVRvb2xzKClcbiAgY29uc3QgeyBkYXRhOiB3b3JrZmxvd1Rvb2xzIH0gPSB1c2VBbGxXb3JrZmxvd1Rvb2xzKClcbiAgY29uc3QgeyBkYXRhOiBtY3BUb29scyB9ID0gdXNlQWxsTUNQVG9vbHMoKVxuICBjb25zdCBkYXRhU291cmNlTGlzdCA9IHVzZVN0b3JlKHMgPT4gcy5kYXRhU291cmNlTGlzdClcbiAgY29uc3QgeyBkYXRhOiB0cmlnZ2VyUGx1Z2lucyB9ID0gdXNlQWxsVHJpZ2dlclBsdWdpbnMoKVxuICBjb25zdCB7IHRoZW1lIH0gPSB1c2VUaGVtZSgpXG5cbiAgY29uc3QgdG9vbEljb24gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm4gJydcblxuICAgIGlmIChpc1RyaWdnZXJQbHVnaW5Ob2RlKGRhdGEpKSB7XG4gICAgICBjb25zdCBpY29uID0gZmluZFRyaWdnZXJQbHVnaW5JY29uKFxuICAgICAgICBbXG4gICAgICAgICAgZGF0YS5wbHVnaW5faWQsXG4gICAgICAgICAgZGF0YS5wcm92aWRlcl9pZCxcbiAgICAgICAgICBkYXRhLnByb3ZpZGVyX25hbWUsXG4gICAgICAgIF0sXG4gICAgICAgIHRyaWdnZXJQbHVnaW5zLFxuICAgICAgICB0aGVtZSxcbiAgICAgIClcbiAgICAgIGlmIChpY29uKVxuICAgICAgICByZXR1cm4gaWNvblxuICAgIH1cblxuICAgIGlmIChpc1Rvb2xOb2RlKGRhdGEpKSB7XG4gICAgICBsZXQgcHJpbWFyeUNvbGxlY3Rpb246IFRvb2xXaXRoUHJvdmlkZXJbXSB8IHVuZGVmaW5lZFxuICAgICAgc3dpdGNoIChkYXRhLnByb3ZpZGVyX3R5cGUpIHtcbiAgICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS5jdXN0b206XG4gICAgICAgICAgcHJpbWFyeUNvbGxlY3Rpb24gPSBjdXN0b21Ub29sc1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgQ29sbGVjdGlvblR5cGUubWNwOlxuICAgICAgICAgIHByaW1hcnlDb2xsZWN0aW9uID0gbWNwVG9vbHNcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIENvbGxlY3Rpb25UeXBlLndvcmtmbG93OlxuICAgICAgICAgIHByaW1hcnlDb2xsZWN0aW9uID0gd29ya2Zsb3dUb29sc1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgQ29sbGVjdGlvblR5cGUuYnVpbHRJbjpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBwcmltYXJ5Q29sbGVjdGlvbiA9IGJ1aWxkSW5Ub29sc1xuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbGxlY3Rpb25zVG9TZWFyY2ggPSBbXG4gICAgICAgIHByaW1hcnlDb2xsZWN0aW9uLFxuICAgICAgICBidWlsZEluVG9vbHMsXG4gICAgICAgIGN1c3RvbVRvb2xzLFxuICAgICAgICB3b3JrZmxvd1Rvb2xzLFxuICAgICAgICBtY3BUb29scyxcbiAgICAgIF0gYXMgQXJyYXk8VG9vbFdpdGhQcm92aWRlcltdIHwgdW5kZWZpbmVkPlxuXG4gICAgICBjb25zdCBzZWVuID0gbmV3IFNldDxUb29sV2l0aFByb3ZpZGVyW10+KClcbiAgICAgIGZvciAoY29uc3QgY29sbGVjdGlvbiBvZiBjb2xsZWN0aW9uc1RvU2VhcmNoKSB7XG4gICAgICAgIGlmICghY29sbGVjdGlvbiB8fCBzZWVuLmhhcyhjb2xsZWN0aW9uKSlcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICBzZWVuLmFkZChjb2xsZWN0aW9uKVxuICAgICAgICBjb25zdCBtYXRjaGVkID0gY29sbGVjdGlvbi5maW5kKCh0b29sV2l0aFByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgaWYgKGNhbkZpbmRUb29sKHRvb2xXaXRoUHJvdmlkZXIuaWQsIGRhdGEucHJvdmlkZXJfaWQpKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICBpZiAoZGF0YS5wbHVnaW5faWQgJiYgdG9vbFdpdGhQcm92aWRlci5wbHVnaW5faWQgPT09IGRhdGEucGx1Z2luX2lkKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICByZXR1cm4gZGF0YS5wcm92aWRlcl9uYW1lID09PSB0b29sV2l0aFByb3ZpZGVyLm5hbWVcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICBjb25zdCBpY29uID0gcmVzb2x2ZUljb25CeVRoZW1lKHRoZW1lLCBtYXRjaGVkLmljb24sIG1hdGNoZWQuaWNvbl9kYXJrKVxuICAgICAgICAgIGlmIChpY29uKVxuICAgICAgICAgICAgcmV0dXJuIGljb25cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBmYWxsYmFja0ljb24gPSByZXNvbHZlSWNvbkJ5VGhlbWUodGhlbWUsIGRhdGEucHJvdmlkZXJfaWNvbiwgZGF0YS5wcm92aWRlcl9pY29uX2RhcmspXG4gICAgICBpZiAoZmFsbGJhY2tJY29uKVxuICAgICAgICByZXR1cm4gZmFsbGJhY2tJY29uXG5cbiAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIGlmIChpc0RhdGFTb3VyY2VOb2RlKGRhdGEpKVxuICAgICAgcmV0dXJuIGRhdGFTb3VyY2VMaXN0Py5maW5kKHRvb2xXaXRoUHJvdmlkZXIgPT4gdG9vbFdpdGhQcm92aWRlci5wbHVnaW5faWQgPT09IGRhdGEucGx1Z2luX2lkKT8uaWNvbiB8fCAnJ1xuXG4gICAgcmV0dXJuICcnXG4gIH0sIFtkYXRhLCBkYXRhU291cmNlTGlzdCwgYnVpbGRJblRvb2xzLCBjdXN0b21Ub29scywgd29ya2Zsb3dUb29scywgbWNwVG9vbHMsIHRyaWdnZXJQbHVnaW5zLCB0aGVtZV0pXG5cbiAgcmV0dXJuIHRvb2xJY29uXG59XG5cbmV4cG9ydCBjb25zdCB1c2VHZXRUb29sSWNvbiA9ICgpID0+IHtcbiAgY29uc3QgeyBkYXRhOiBidWlsZEluVG9vbHMgfSA9IHVzZUFsbEJ1aWx0SW5Ub29scygpXG4gIGNvbnN0IHsgZGF0YTogY3VzdG9tVG9vbHMgfSA9IHVzZUFsbEN1c3RvbVRvb2xzKClcbiAgY29uc3QgeyBkYXRhOiB3b3JrZmxvd1Rvb2xzIH0gPSB1c2VBbGxXb3JrZmxvd1Rvb2xzKClcbiAgY29uc3QgeyBkYXRhOiBtY3BUb29scyB9ID0gdXNlQWxsTUNQVG9vbHMoKVxuICBjb25zdCB7IGRhdGE6IHRyaWdnZXJQbHVnaW5zIH0gPSB1c2VBbGxUcmlnZ2VyUGx1Z2lucygpXG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3QgeyB0aGVtZSB9ID0gdXNlVGhlbWUoKVxuXG4gIGNvbnN0IGdldFRvb2xJY29uID0gdXNlQ2FsbGJhY2soKGRhdGE6IE5vZGVbJ2RhdGEnXSkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGJ1aWxkSW5Ub29sczogc3RvcmVCdWlsdEluVG9vbHMsXG4gICAgICBjdXN0b21Ub29sczogc3RvcmVDdXN0b21Ub29scyxcbiAgICAgIHdvcmtmbG93VG9vbHM6IHN0b3JlV29ya2Zsb3dUb29scyxcbiAgICAgIG1jcFRvb2xzOiBzdG9yZU1jcFRvb2xzLFxuICAgICAgZGF0YVNvdXJjZUxpc3QsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKGlzVHJpZ2dlclBsdWdpbk5vZGUoZGF0YSkpIHtcbiAgICAgIHJldHVybiBmaW5kVHJpZ2dlclBsdWdpbkljb24oXG4gICAgICAgIFtcbiAgICAgICAgICBkYXRhLnBsdWdpbl9pZCxcbiAgICAgICAgICBkYXRhLnByb3ZpZGVyX2lkLFxuICAgICAgICAgIGRhdGEucHJvdmlkZXJfbmFtZSxcbiAgICAgICAgXSxcbiAgICAgICAgdHJpZ2dlclBsdWdpbnMsXG4gICAgICAgIHRoZW1lLFxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChpc1Rvb2xOb2RlKGRhdGEpKSB7XG4gICAgICBjb25zdCBwcmltYXJ5Q29sbGVjdGlvbiA9ICgoKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoZGF0YS5wcm92aWRlcl90eXBlKSB7XG4gICAgICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS5jdXN0b206XG4gICAgICAgICAgICByZXR1cm4gc3RvcmVDdXN0b21Ub29scyA/PyBjdXN0b21Ub29sc1xuICAgICAgICAgIGNhc2UgQ29sbGVjdGlvblR5cGUubWNwOlxuICAgICAgICAgICAgcmV0dXJuIHN0b3JlTWNwVG9vbHMgPz8gbWNwVG9vbHNcbiAgICAgICAgICBjYXNlIENvbGxlY3Rpb25UeXBlLndvcmtmbG93OlxuICAgICAgICAgICAgcmV0dXJuIHN0b3JlV29ya2Zsb3dUb29scyA/PyB3b3JrZmxvd1Rvb2xzXG4gICAgICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS5idWlsdEluOlxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RvcmVCdWlsdEluVG9vbHMgPz8gYnVpbGRJblRvb2xzXG4gICAgICAgIH1cbiAgICAgIH0pKClcblxuICAgICAgY29uc3QgY29sbGVjdGlvbnNUb1NlYXJjaCA9IFtcbiAgICAgICAgcHJpbWFyeUNvbGxlY3Rpb24sXG4gICAgICAgIHN0b3JlQnVpbHRJblRvb2xzID8/IGJ1aWxkSW5Ub29scyxcbiAgICAgICAgc3RvcmVDdXN0b21Ub29scyA/PyBjdXN0b21Ub29scyxcbiAgICAgICAgc3RvcmVXb3JrZmxvd1Rvb2xzID8/IHdvcmtmbG93VG9vbHMsXG4gICAgICAgIHN0b3JlTWNwVG9vbHMgPz8gbWNwVG9vbHMsXG4gICAgICBdIGFzIEFycmF5PFRvb2xXaXRoUHJvdmlkZXJbXSB8IHVuZGVmaW5lZD5cblxuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8VG9vbFdpdGhQcm92aWRlcltdPigpXG4gICAgICBmb3IgKGNvbnN0IGNvbGxlY3Rpb24gb2YgY29sbGVjdGlvbnNUb1NlYXJjaCkge1xuICAgICAgICBpZiAoIWNvbGxlY3Rpb24gfHwgc2Vlbi5oYXMoY29sbGVjdGlvbikpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgc2Vlbi5hZGQoY29sbGVjdGlvbilcbiAgICAgICAgY29uc3QgbWF0Y2hlZCA9IGNvbGxlY3Rpb24uZmluZCgodG9vbFdpdGhQcm92aWRlcikgPT4ge1xuICAgICAgICAgIGlmIChjYW5GaW5kVG9vbCh0b29sV2l0aFByb3ZpZGVyLmlkLCBkYXRhLnByb3ZpZGVyX2lkKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgaWYgKGRhdGEucGx1Z2luX2lkICYmIHRvb2xXaXRoUHJvdmlkZXIucGx1Z2luX2lkID09PSBkYXRhLnBsdWdpbl9pZClcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgcmV0dXJuIGRhdGEucHJvdmlkZXJfbmFtZSA9PT0gdG9vbFdpdGhQcm92aWRlci5uYW1lXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgICAgY29uc3QgaWNvbiA9IHJlc29sdmVJY29uQnlUaGVtZSh0aGVtZSwgbWF0Y2hlZC5pY29uLCBtYXRjaGVkLmljb25fZGFyaylcbiAgICAgICAgICBpZiAoaWNvbilcbiAgICAgICAgICAgIHJldHVybiBpY29uXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZmFsbGJhY2tJY29uID0gcmVzb2x2ZUljb25CeVRoZW1lKHRoZW1lLCBkYXRhLnByb3ZpZGVyX2ljb24sIGRhdGEucHJvdmlkZXJfaWNvbl9kYXJrKVxuICAgICAgaWYgKGZhbGxiYWNrSWNvbilcbiAgICAgICAgcmV0dXJuIGZhbGxiYWNrSWNvblxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgaWYgKGlzRGF0YVNvdXJjZU5vZGUoZGF0YSkpXG4gICAgICByZXR1cm4gZGF0YVNvdXJjZUxpc3Q/LmZpbmQodG9vbFdpdGhQcm92aWRlciA9PiB0b29sV2l0aFByb3ZpZGVyLnBsdWdpbl9pZCA9PT0gZGF0YS5wbHVnaW5faWQpPy5pY29uXG5cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH0sIFt3b3JrZmxvd1N0b3JlLCB0cmlnZ2VyUGx1Z2lucywgYnVpbGRJblRvb2xzLCBjdXN0b21Ub29scywgd29ya2Zsb3dUb29scywgbWNwVG9vbHMsIHRoZW1lXSlcblxuICByZXR1cm4gZ2V0VG9vbEljb25cbn1cbiJdfQ==