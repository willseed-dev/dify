"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNodePluginInstallation = void 0;
const react_1 = require("react");
const types_1 = require("@/app/components/tools/types");
const use_pipeline_1 = require("@/service/use-pipeline");
const use_tools_1 = require("@/service/use-tools");
const use_triggers_1 = require("@/service/use-triggers");
const utils_1 = require("@/utils");
const store_1 = require("../store");
const types_2 = require("../types");
const useToolInstallation = (data) => {
    const builtInQuery = (0, use_tools_1.useAllBuiltInTools)();
    const customQuery = (0, use_tools_1.useAllCustomTools)();
    const workflowQuery = (0, use_tools_1.useAllWorkflowTools)();
    const mcpQuery = (0, use_tools_1.useAllMCPTools)();
    const invalidateTools = (0, use_tools_1.useInvalidToolsByType)(data.provider_type);
    const collectionInfo = (0, react_1.useMemo)(() => {
        switch (data.provider_type) {
            case types_1.CollectionType.builtIn:
                return {
                    list: builtInQuery.data,
                    isLoading: builtInQuery.isLoading,
                };
            case types_1.CollectionType.custom:
                return {
                    list: customQuery.data,
                    isLoading: customQuery.isLoading,
                };
            case types_1.CollectionType.workflow:
                return {
                    list: workflowQuery.data,
                    isLoading: workflowQuery.isLoading,
                };
            case types_1.CollectionType.mcp:
                return {
                    list: mcpQuery.data,
                    isLoading: mcpQuery.isLoading,
                };
            default:
                return undefined;
        }
    }, [
        builtInQuery.data,
        builtInQuery.isLoading,
        customQuery.data,
        customQuery.isLoading,
        data.provider_type,
        mcpQuery.data,
        mcpQuery.isLoading,
        workflowQuery.data,
        workflowQuery.isLoading,
    ]);
    const collection = collectionInfo?.list;
    const isLoading = collectionInfo?.isLoading ?? false;
    const isResolved = !!collectionInfo && !isLoading;
    const matchedCollection = (0, react_1.useMemo)(() => {
        if (!collection || !collection.length)
            return undefined;
        return collection.find((toolWithProvider) => {
            if (data.plugin_id && toolWithProvider.plugin_id === data.plugin_id)
                return true;
            if ((0, utils_1.canFindTool)(toolWithProvider.id, data.provider_id))
                return true;
            if (toolWithProvider.name === data.provider_name)
                return true;
            return false;
        });
    }, [collection, data.plugin_id, data.provider_id, data.provider_name]);
    const uniqueIdentifier = data.plugin_unique_identifier || data.plugin_id || data.provider_id;
    const canInstall = Boolean(data.plugin_unique_identifier);
    const onInstallSuccess = (0, react_1.useCallback)(() => {
        if (invalidateTools)
            invalidateTools();
    }, [invalidateTools]);
    const shouldDim = (!!collectionInfo && !isResolved) || (isResolved && !matchedCollection);
    return {
        isChecking: !!collectionInfo && !isResolved,
        isMissing: isResolved && !matchedCollection,
        uniqueIdentifier,
        canInstall,
        onInstallSuccess,
        shouldDim,
    };
};
const useTriggerInstallation = (data) => {
    const triggerPluginsQuery = (0, use_triggers_1.useAllTriggerPlugins)();
    const invalidateTriggers = (0, use_triggers_1.useInvalidateAllTriggerPlugins)();
    const triggerProviders = triggerPluginsQuery.data;
    const isLoading = triggerPluginsQuery.isLoading;
    const matchedProvider = (0, react_1.useMemo)(() => {
        if (!triggerProviders || !triggerProviders.length)
            return undefined;
        return triggerProviders.find(provider => provider.name === data.provider_name
            || provider.id === data.provider_id
            || (data.plugin_id && provider.plugin_id === data.plugin_id));
    }, [
        data.plugin_id,
        data.provider_id,
        data.provider_name,
        triggerProviders,
    ]);
    const uniqueIdentifier = data.plugin_unique_identifier || data.plugin_id || data.provider_id;
    const canInstall = Boolean(data.plugin_unique_identifier);
    const onInstallSuccess = (0, react_1.useCallback)(() => {
        invalidateTriggers();
    }, [invalidateTriggers]);
    const shouldDim = isLoading || (!isLoading && !!triggerProviders && !matchedProvider);
    return {
        isChecking: isLoading,
        isMissing: !isLoading && !!triggerProviders && !matchedProvider,
        uniqueIdentifier,
        canInstall,
        onInstallSuccess,
        shouldDim,
    };
};
const useDataSourceInstallation = (data) => {
    const dataSourceList = (0, store_1.useStore)(s => s.dataSourceList);
    const invalidateDataSourceList = (0, use_pipeline_1.useInvalidDataSourceList)();
    const matchedPlugin = (0, react_1.useMemo)(() => {
        if (!dataSourceList || !dataSourceList.length)
            return undefined;
        return dataSourceList.find((item) => {
            if (data.plugin_unique_identifier && item.plugin_unique_identifier === data.plugin_unique_identifier)
                return true;
            if (data.plugin_id && item.plugin_id === data.plugin_id)
                return true;
            if (data.provider_name && item.provider === data.provider_name)
                return true;
            return false;
        });
    }, [data.plugin_id, data.plugin_unique_identifier, data.provider_name, dataSourceList]);
    const uniqueIdentifier = data.plugin_unique_identifier || data.plugin_id;
    const canInstall = Boolean(data.plugin_unique_identifier);
    const onInstallSuccess = (0, react_1.useCallback)(() => {
        invalidateDataSourceList();
    }, [invalidateDataSourceList]);
    const hasLoadedList = dataSourceList !== undefined;
    const shouldDim = !hasLoadedList || (hasLoadedList && !matchedPlugin);
    return {
        isChecking: !hasLoadedList,
        isMissing: hasLoadedList && !matchedPlugin,
        uniqueIdentifier,
        canInstall,
        onInstallSuccess,
        shouldDim,
    };
};
const useNodePluginInstallation = (data) => {
    const toolInstallation = useToolInstallation(data);
    const triggerInstallation = useTriggerInstallation(data);
    const dataSourceInstallation = useDataSourceInstallation(data);
    switch (data.type) {
        case types_2.BlockEnum.Tool:
            return toolInstallation;
        case types_2.BlockEnum.TriggerPlugin:
            return triggerInstallation;
        case types_2.BlockEnum.DataSource:
            return dataSourceInstallation;
        default:
            return {
                isChecking: false,
                isMissing: false,
                uniqueIdentifier: undefined,
                canInstall: false,
                onInstallSuccess: () => undefined,
                shouldDim: false,
            };
    }
};
exports.useNodePluginInstallation = useNodePluginInstallation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW5vZGUtcGx1Z2luLWluc3RhbGxhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1ub2RlLXBsdWdpbi1pbnN0YWxsYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsaUNBQTRDO0FBQzVDLHdEQUE2RDtBQUM3RCx5REFBaUU7QUFDakUsbURBTTRCO0FBQzVCLHlEQUcrQjtBQUMvQixtQ0FBcUM7QUFDckMsb0NBQW1DO0FBQ25DLG9DQUFvQztBQVdwQyxNQUFNLG1CQUFtQixHQUFHLENBQUMsSUFBa0IsRUFBcUIsRUFBRTtJQUNwRSxNQUFNLFlBQVksR0FBRyxJQUFBLDhCQUFrQixHQUFFLENBQUE7SUFDekMsTUFBTSxXQUFXLEdBQUcsSUFBQSw2QkFBaUIsR0FBRSxDQUFBO0lBQ3ZDLE1BQU0sYUFBYSxHQUFHLElBQUEsK0JBQW1CLEdBQUUsQ0FBQTtJQUMzQyxNQUFNLFFBQVEsR0FBRyxJQUFBLDBCQUFjLEdBQUUsQ0FBQTtJQUNqQyxNQUFNLGVBQWUsR0FBRyxJQUFBLGlDQUFxQixFQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUVqRSxNQUFNLGNBQWMsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDbEMsUUFBUSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDM0IsS0FBSyxzQkFBYyxDQUFDLE9BQU87Z0JBQ3pCLE9BQU87b0JBQ0wsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJO29CQUN2QixTQUFTLEVBQUUsWUFBWSxDQUFDLFNBQVM7aUJBQ2xDLENBQUE7WUFDSCxLQUFLLHNCQUFjLENBQUMsTUFBTTtnQkFDeEIsT0FBTztvQkFDTCxJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUk7b0JBQ3RCLFNBQVMsRUFBRSxXQUFXLENBQUMsU0FBUztpQkFDakMsQ0FBQTtZQUNILEtBQUssc0JBQWMsQ0FBQyxRQUFRO2dCQUMxQixPQUFPO29CQUNMLElBQUksRUFBRSxhQUFhLENBQUMsSUFB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LEVBQUUsS0FBSztnQkFDaEIsZ0JBQWdCLEVBQUUsU0FBUztnQkFDM0IsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVM7Z0JBQ2pDLFNBQVMsRUFBRSxLQUFLO2FBQ2pCLENBQUE7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBdEJZLFFBQUEseUJBQXlCLDZCQXNCckMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IERhdGFTb3VyY2VOb2RlVHlwZSB9IGZyb20gJy4uL25vZGVzL2RhdGEtc291cmNlL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBUb29sTm9kZVR5cGUgfSBmcm9tICcuLi9ub2Rlcy90b29sL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5UcmlnZ2VyTm9kZVR5cGUgfSBmcm9tICcuLi9ub2Rlcy90cmlnZ2VyLXBsdWdpbi90eXBlcydcbmltcG9ydCB0eXBlIHsgQ29tbW9uTm9kZVR5cGUgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBDb2xsZWN0aW9uVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdHlwZXMnXG5pbXBvcnQgeyB1c2VJbnZhbGlkRGF0YVNvdXJjZUxpc3QgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXBpcGVsaW5lJ1xuaW1wb3J0IHtcbiAgdXNlQWxsQnVpbHRJblRvb2xzLFxuICB1c2VBbGxDdXN0b21Ub29scyxcbiAgdXNlQWxsTUNQVG9vbHMsXG4gIHVzZUFsbFdvcmtmbG93VG9vbHMsXG4gIHVzZUludmFsaWRUb29sc0J5VHlwZSxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10b29scydcbmltcG9ydCB7XG4gIHVzZUFsbFRyaWdnZXJQbHVnaW5zLFxuICB1c2VJbnZhbGlkYXRlQWxsVHJpZ2dlclBsdWdpbnMsXG59IGZyb20gJ0Avc2VydmljZS91c2UtdHJpZ2dlcnMnXG5pbXBvcnQgeyBjYW5GaW5kVG9vbCB9IGZyb20gJ0AvdXRpbHMnXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJy4uL3N0b3JlJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnLi4vdHlwZXMnXG5cbnR5cGUgSW5zdGFsbGF0aW9uU3RhdGUgPSB7XG4gIGlzQ2hlY2tpbmc6IGJvb2xlYW5cbiAgaXNNaXNzaW5nOiBib29sZWFuXG4gIHVuaXF1ZUlkZW50aWZpZXI/OiBzdHJpbmdcbiAgY2FuSW5zdGFsbDogYm9vbGVhblxuICBvbkluc3RhbGxTdWNjZXNzOiAoKSA9PiB2b2lkXG4gIHNob3VsZERpbTogYm9vbGVhblxufVxuXG5jb25zdCB1c2VUb29sSW5zdGFsbGF0aW9uID0gKGRhdGE6IFRvb2xOb2RlVHlwZSk6IEluc3RhbGxhdGlvblN0YXRlID0+IHtcbiAgY29uc3QgYnVpbHRJblF1ZXJ5ID0gdXNlQWxsQnVpbHRJblRvb2xzKClcbiAgY29uc3QgY3VzdG9tUXVlcnkgPSB1c2VBbGxDdXN0b21Ub29scygpXG4gIGNvbnN0IHdvcmtmbG93UXVlcnkgPSB1c2VBbGxXb3JrZmxvd1Rvb2xzKClcbiAgY29uc3QgbWNwUXVlcnkgPSB1c2VBbGxNQ1BUb29scygpXG4gIGNvbnN0IGludmFsaWRhdGVUb29scyA9IHVzZUludmFsaWRUb29sc0J5VHlwZShkYXRhLnByb3ZpZGVyX3R5cGUpXG5cbiAgY29uc3QgY29sbGVjdGlvbkluZm8gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBzd2l0Y2ggKGRhdGEucHJvdmlkZXJfdHlwZSkge1xuICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS5idWlsdEluOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxpc3Q6IGJ1aWx0SW5RdWVyeS5kYXRhLFxuICAgICAgICAgIGlzTG9hZGluZzogYnVpbHRJblF1ZXJ5LmlzTG9hZGluZyxcbiAgICAgICAgfVxuICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS5jdXN0b206XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGlzdDogY3VzdG9tUXVlcnkuZGF0YSxcbiAgICAgICAgICBpc0xvYWRpbmc6IGN1c3RvbVF1ZXJ5LmlzTG9hZGluZyxcbiAgICAgICAgfVxuICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS53b3JrZmxvdzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsaXN0OiB3b3JrZmxvd1F1ZXJ5LmRhdGEsXG4gICAgICAgICAgaXNMb2FkaW5nOiB3b3JrZmxvd1F1ZXJ5LmlzTG9hZGluZyxcbiAgICAgICAgfVxuICAgICAgY2FzZSBDb2xsZWN0aW9uVHlwZS5tY3A6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGlzdDogbWNwUXVlcnkuZGF0YSxcbiAgICAgICAgICBpc0xvYWRpbmc6IG1jcFF1ZXJ5LmlzTG9hZGluZyxcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgfSwgW1xuICAgIGJ1aWx0SW5RdWVyeS5kYXRhLFxuICAgIGJ1aWx0SW5RdWVyeS5pc0xvYWRpbmcsXG4gICAgY3VzdG9tUXVlcnkuZGF0YSxcbiAgICBjdXN0b21RdWVyeS5pc0xvYWRpbmcsXG4gICAgZGF0YS5wcm92aWRlcl90eXBlLFxuICAgIG1jcFF1ZXJ5LmRhdGEsXG4gICAgbWNwUXVlcnkuaXNMb2FkaW5nLFxuICAgIHdvcmtmbG93UXVlcnkuZGF0YSxcbiAgICB3b3JrZmxvd1F1ZXJ5LmlzTG9hZGluZyxcbiAgXSlcblxuICBjb25zdCBjb2xsZWN0aW9uID0gY29sbGVjdGlvbkluZm8/Lmxpc3RcbiAgY29uc3QgaXNMb2FkaW5nID0gY29sbGVjdGlvbkluZm8/LmlzTG9hZGluZyA/PyBmYWxzZVxuICBjb25zdCBpc1Jlc29sdmVkID0gISFjb2xsZWN0aW9uSW5mbyAmJiAhaXNMb2FkaW5nXG5cbiAgY29uc3QgbWF0Y2hlZENvbGxlY3Rpb24gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWNvbGxlY3Rpb24gfHwgIWNvbGxlY3Rpb24ubGVuZ3RoKVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmluZCgodG9vbFdpdGhQcm92aWRlcikgPT4ge1xuICAgICAgaWYgKGRhdGEucGx1Z2luX2lkICYmIHRvb2xXaXRoUHJvdmlkZXIucGx1Z2luX2lkID09PSBkYXRhLnBsdWdpbl9pZClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIGlmIChjYW5GaW5kVG9vbCh0b29sV2l0aFByb3ZpZGVyLmlkLCBkYXRhLnByb3ZpZGVyX2lkKSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIGlmICh0b29sV2l0aFByb3ZpZGVyLm5hbWUgPT09IGRhdGEucHJvdmlkZXJfbmFtZSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG4gIH0sIFtjb2xsZWN0aW9uLCBkYXRhLnBsdWdpbl9pZCwgZGF0YS5wcm92aWRlcl9pZCwgZGF0YS5wcm92aWRlcl9uYW1lXSlcblxuICBjb25zdCB1bmlxdWVJZGVudGlmaWVyID0gZGF0YS5wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIgfHwgZGF0YS5wbHVnaW5faWQgfHwgZGF0YS5wcm92aWRlcl9pZFxuICBjb25zdCBjYW5JbnN0YWxsID0gQm9vbGVhbihkYXRhLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllcilcblxuICBjb25zdCBvbkluc3RhbGxTdWNjZXNzID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChpbnZhbGlkYXRlVG9vbHMpXG4gICAgICBpbnZhbGlkYXRlVG9vbHMoKVxuICB9LCBbaW52YWxpZGF0ZVRvb2xzXSlcblxuICBjb25zdCBzaG91bGREaW0gPSAoISFjb2xsZWN0aW9uSW5mbyAmJiAhaXNSZXNvbHZlZCkgfHwgKGlzUmVzb2x2ZWQgJiYgIW1hdGNoZWRDb2xsZWN0aW9uKVxuXG4gIHJldHVybiB7XG4gICAgaXNDaGVja2luZzogISFjb2xsZWN0aW9uSW5mbyAmJiAhaXNSZXNvbHZlZCxcbiAgICBpc01pc3Npbmc6IGlzUmVzb2x2ZWQgJiYgIW1hdGNoZWRDb2xsZWN0aW9uLFxuICAgIHVuaXF1ZUlkZW50aWZpZXIsXG4gICAgY2FuSW5zdGFsbCxcbiAgICBvbkluc3RhbGxTdWNjZXNzLFxuICAgIHNob3VsZERpbSxcbiAgfVxufVxuXG5jb25zdCB1c2VUcmlnZ2VySW5zdGFsbGF0aW9uID0gKGRhdGE6IFBsdWdpblRyaWdnZXJOb2RlVHlwZSk6IEluc3RhbGxhdGlvblN0YXRlID0+IHtcbiAgY29uc3QgdHJpZ2dlclBsdWdpbnNRdWVyeSA9IHVzZUFsbFRyaWdnZXJQbHVnaW5zKClcbiAgY29uc3QgaW52YWxpZGF0ZVRyaWdnZXJzID0gdXNlSW52YWxpZGF0ZUFsbFRyaWdnZXJQbHVnaW5zKClcblxuICBjb25zdCB0cmlnZ2VyUHJvdmlkZXJzID0gdHJpZ2dlclBsdWdpbnNRdWVyeS5kYXRhXG4gIGNvbnN0IGlzTG9hZGluZyA9IHRyaWdnZXJQbHVnaW5zUXVlcnkuaXNMb2FkaW5nXG5cbiAgY29uc3QgbWF0Y2hlZFByb3ZpZGVyID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCF0cmlnZ2VyUHJvdmlkZXJzIHx8ICF0cmlnZ2VyUHJvdmlkZXJzLmxlbmd0aClcbiAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgIHJldHVybiB0cmlnZ2VyUHJvdmlkZXJzLmZpbmQocHJvdmlkZXIgPT5cbiAgICAgIHByb3ZpZGVyLm5hbWUgPT09IGRhdGEucHJvdmlkZXJfbmFtZVxuICAgICAgfHwgcHJvdmlkZXIuaWQgPT09IGRhdGEucHJvdmlkZXJfaWRcbiAgICAgIHx8IChkYXRhLnBsdWdpbl9pZCAmJiBwcm92aWRlci5wbHVnaW5faWQgPT09IGRhdGEucGx1Z2luX2lkKSxcbiAgICApXG4gIH0sIFtcbiAgICBkYXRhLnBsdWdpbl9pZCxcbiAgICBkYXRhLnByb3ZpZGVyX2lkLFxuICAgIGRhdGEucHJvdmlkZXJfbmFtZSxcbiAgICB0cmlnZ2VyUHJvdmlkZXJzLFxuICBdKVxuXG4gIGNvbnN0IHVuaXF1ZUlkZW50aWZpZXIgPSBkYXRhLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllciB8fCBkYXRhLnBsdWdpbl9pZCB8fCBkYXRhLnByb3ZpZGVyX2lkXG4gIGNvbnN0IGNhbkluc3RhbGwgPSBCb29sZWFuKGRhdGEucGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyKVxuXG4gIGNvbnN0IG9uSW5zdGFsbFN1Y2Nlc3MgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaW52YWxpZGF0ZVRyaWdnZXJzKClcbiAgfSwgW2ludmFsaWRhdGVUcmlnZ2Vyc10pXG5cbiAgY29uc3Qgc2hvdWxkRGltID0gaXNMb2FkaW5nIHx8ICghaXNMb2FkaW5nICYmICEhdHJpZ2dlclByb3ZpZGVycyAmJiAhbWF0Y2hlZFByb3ZpZGVyKVxuXG4gIHJldHVybiB7XG4gICAgaXNDaGVja2luZzogaXNMb2FkaW5nLFxuICAgIGlzTWlzc2luZzogIWlzTG9hZGluZyAmJiAhIXRyaWdnZXJQcm92aWRlcnMgJiYgIW1hdGNoZWRQcm92aWRlcixcbiAgICB1bmlxdWVJZGVudGlmaWVyLFxuICAgIGNhbkluc3RhbGwsXG4gICAgb25JbnN0YWxsU3VjY2VzcyxcbiAgICBzaG91bGREaW0sXG4gIH1cbn1cblxuY29uc3QgdXNlRGF0YVNvdXJjZUluc3RhbGxhdGlvbiA9IChkYXRhOiBEYXRhU291cmNlTm9kZVR5cGUpOiBJbnN0YWxsYXRpb25TdGF0ZSA9PiB7XG4gIGNvbnN0IGRhdGFTb3VyY2VMaXN0ID0gdXNlU3RvcmUocyA9PiBzLmRhdGFTb3VyY2VMaXN0KVxuICBjb25zdCBpbnZhbGlkYXRlRGF0YVNvdXJjZUxpc3QgPSB1c2VJbnZhbGlkRGF0YVNvdXJjZUxpc3QoKVxuXG4gIGNvbnN0IG1hdGNoZWRQbHVnaW4gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWRhdGFTb3VyY2VMaXN0IHx8ICFkYXRhU291cmNlTGlzdC5sZW5ndGgpXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICByZXR1cm4gZGF0YVNvdXJjZUxpc3QuZmluZCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGRhdGEucGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyICYmIGl0ZW0ucGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyID09PSBkYXRhLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllcilcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIGlmIChkYXRhLnBsdWdpbl9pZCAmJiBpdGVtLnBsdWdpbl9pZCA9PT0gZGF0YS5wbHVnaW5faWQpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICBpZiAoZGF0YS5wcm92aWRlcl9uYW1lICYmIGl0ZW0ucHJvdmlkZXIgPT09IGRhdGEucHJvdmlkZXJfbmFtZSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG4gIH0sIFtkYXRhLnBsdWdpbl9pZCwgZGF0YS5wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIsIGRhdGEucHJvdmlkZXJfbmFtZSwgZGF0YVNvdXJjZUxpc3RdKVxuXG4gIGNvbnN0IHVuaXF1ZUlkZW50aWZpZXIgPSBkYXRhLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllciB8fCBkYXRhLnBsdWdpbl9pZFxuICBjb25zdCBjYW5JbnN0YWxsID0gQm9vbGVhbihkYXRhLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllcilcblxuICBjb25zdCBvbkluc3RhbGxTdWNjZXNzID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGludmFsaWRhdGVEYXRhU291cmNlTGlzdCgpXG4gIH0sIFtpbnZhbGlkYXRlRGF0YVNvdXJjZUxpc3RdKVxuXG4gIGNvbnN0IGhhc0xvYWRlZExpc3QgPSBkYXRhU291cmNlTGlzdCAhPT0gdW5kZWZpbmVkXG5cbiAgY29uc3Qgc2hvdWxkRGltID0gIWhhc0xvYWRlZExpc3QgfHwgKGhhc0xvYWRlZExpc3QgJiYgIW1hdGNoZWRQbHVnaW4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc0NoZWNraW5nOiAhaGFzTG9hZGVkTGlzdCxcbiAgICBpc01pc3Npbmc6IGhhc0xvYWRlZExpc3QgJiYgIW1hdGNoZWRQbHVnaW4sXG4gICAgdW5pcXVlSWRlbnRpZmllcixcbiAgICBjYW5JbnN0YWxsLFxuICAgIG9uSW5zdGFsbFN1Y2Nlc3MsXG4gICAgc2hvdWxkRGltLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VOb2RlUGx1Z2luSW5zdGFsbGF0aW9uID0gKGRhdGE6IENvbW1vbk5vZGVUeXBlKTogSW5zdGFsbGF0aW9uU3RhdGUgPT4ge1xuICBjb25zdCB0b29sSW5zdGFsbGF0aW9uID0gdXNlVG9vbEluc3RhbGxhdGlvbihkYXRhIGFzIFRvb2xOb2RlVHlwZSlcbiAgY29uc3QgdHJpZ2dlckluc3RhbGxhdGlvbiA9IHVzZVRyaWdnZXJJbnN0YWxsYXRpb24oZGF0YSBhcyBQbHVnaW5UcmlnZ2VyTm9kZVR5cGUpXG4gIGNvbnN0IGRhdGFTb3VyY2VJbnN0YWxsYXRpb24gPSB1c2VEYXRhU291cmNlSW5zdGFsbGF0aW9uKGRhdGEgYXMgRGF0YVNvdXJjZU5vZGVUeXBlKVxuXG4gIHN3aXRjaCAoZGF0YS50eXBlIGFzIEJsb2NrRW51bSkge1xuICAgIGNhc2UgQmxvY2tFbnVtLlRvb2w6XG4gICAgICByZXR1cm4gdG9vbEluc3RhbGxhdGlvblxuICAgIGNhc2UgQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW46XG4gICAgICByZXR1cm4gdHJpZ2dlckluc3RhbGxhdGlvblxuICAgIGNhc2UgQmxvY2tFbnVtLkRhdGFTb3VyY2U6XG4gICAgICByZXR1cm4gZGF0YVNvdXJjZUluc3RhbGxhdGlvblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc0NoZWNraW5nOiBmYWxzZSxcbiAgICAgICAgaXNNaXNzaW5nOiBmYWxzZSxcbiAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBjYW5JbnN0YWxsOiBmYWxzZSxcbiAgICAgICAgb25JbnN0YWxsU3VjY2VzczogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBzaG91bGREaW06IGZhbHNlLFxuICAgICAgfVxuICB9XG59XG4iXX0=