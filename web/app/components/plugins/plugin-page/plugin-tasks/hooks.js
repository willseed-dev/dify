"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePluginTaskStatus = void 0;
const react_1 = require("react");
const types_1 = require("@/app/components/plugins/types");
const use_plugins_1 = require("@/service/use-plugins");
const usePluginTaskStatus = () => {
    const { pluginTasks, handleRefetch, } = (0, use_plugins_1.usePluginTaskList)();
    const { mutateAsync } = (0, use_plugins_1.useMutationClearTaskPlugin)();
    const allPlugins = pluginTasks.map(task => task.plugins.map((plugin) => {
        return {
            ...plugin,
            taskId: task.id,
        };
    })).flat();
    const errorPlugins = [];
    const successPlugins = [];
    const runningPlugins = [];
    allPlugins.forEach((plugin) => {
        if (plugin.status === types_1.TaskStatus.running)
            runningPlugins.push(plugin);
        if (plugin.status === types_1.TaskStatus.failed)
            errorPlugins.push(plugin);
        if (plugin.status === types_1.TaskStatus.success)
            successPlugins.push(plugin);
    });
    const handleClearErrorPlugin = (0, react_1.useCallback)(async (taskId, pluginId) => {
        await mutateAsync({
            taskId,
            pluginId,
        });
        handleRefetch();
    }, [mutateAsync, handleRefetch]);
    const totalPluginsLength = allPlugins.length;
    const runningPluginsLength = runningPlugins.length;
    const errorPluginsLength = errorPlugins.length;
    const successPluginsLength = successPlugins.length;
    const isInstalling = runningPluginsLength > 0 && errorPluginsLength === 0 && successPluginsLength === 0;
    const isInstallingWithSuccess = runningPluginsLength > 0 && successPluginsLength > 0 && errorPluginsLength === 0;
    const isInstallingWithError = runningPluginsLength > 0 && errorPluginsLength > 0;
    const isSuccess = successPluginsLength === totalPluginsLength && totalPluginsLength > 0;
    const isFailed = runningPluginsLength === 0 && (errorPluginsLength + successPluginsLength) === totalPluginsLength && totalPluginsLength > 0 && errorPluginsLength > 0;
    return {
        errorPlugins,
        successPlugins,
        runningPlugins,
        runningPluginsLength,
        errorPluginsLength,
        successPluginsLength,
        totalPluginsLength,
        isInstalling,
        isInstallingWithSuccess,
        isInstallingWithError,
        isSuccess,
        isFailed,
        handleClearErrorPlugin,
    };
};
exports.usePluginTaskStatus = usePluginTaskStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FFYztBQUNkLDBEQUEyRDtBQUMzRCx1REFHOEI7QUFFdkIsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLEVBQUU7SUFDdEMsTUFBTSxFQUNKLFdBQVcsRUFDWCxhQUFhLEdBQ2QsR0FBRyxJQUFBLCtCQUFpQixHQUFFLENBQUE7SUFDdkIsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUEsd0NBQTBCLEdBQUUsQ0FBQTtJQUNwRCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNyRSxPQUFPO1lBQ0wsR0FBRyxNQUFNO1lBQ1QsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1NBQ2hCLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ1YsTUFBTSxZQUFZLEdBQW1CLEVBQUUsQ0FBQTtJQUN2QyxNQUFNLGNBQWMsR0FBbUIsRUFBRSxDQUFBO0lBQ3pDLE1BQU0sY0FBYyxHQUFtQixFQUFFLENBQUE7SUFFekMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQzVCLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxrQkFBVSxDQUFDLE9BQU87WUFDdEMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM3QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssa0JBQVUsQ0FBQyxNQUFNO1lBQ3JDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDM0IsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLGtCQUFVLENBQUMsT0FBTztZQUN0QyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9CLENBQUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsS0FBSyxFQUFFLE1BQWMsRUFBRSxRQUFnQixFQUFFLEVBQUU7UUFDcEYsTUFBTSxXQUFXLENBQUM7WUFDaEIsTUFBTTtZQUNOLFFBQVE7U0FDVCxDQUFDLENBQUE7UUFDRixhQUFhLEVBQUUsQ0FBQTtJQUNqQixDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUNoQyxNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUE7SUFDNUMsTUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFBO0lBQ2xELE1BQU0sa0JBQWtCLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQTtJQUM5QyxNQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUE7SUFFbEQsTUFBTSxZQUFZLEdBQUcsb0JBQW9CLEdBQUcsQ0FBQyxJQUFJLGtCQUFrQixLQUFLLENBQUMsSUFBSSxvQkFBb0IsS0FBSyxDQUFDLENBQUE7SUFDdkcsTUFBTSx1QkFBdUIsR0FBRyxvQkFBb0IsR0FBRyxDQUFDLElBQUksb0JBQW9CLEdBQUcsQ0FBQyxJQUFJLGtCQUFrQixLQUFLLENBQUMsQ0FBQTtJQUNoSCxNQUFNLHFCQUFxQixHQUFHLG9CQUFvQixHQUFHLENBQUMsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUE7SUFDaEYsTUFBTSxTQUFTLEdBQUcsb0JBQW9CLEtBQUssa0JBQWtCLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFBO0lBQ3ZGLE1BQU0sUUFBUSxHQUFHLG9CQUFvQixLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDLEtBQUssa0JBQWtCLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxJQUFJLGtCQUFrQixHQUFHLENBQUMsQ0FBQTtJQUVySyxPQUFPO1FBQ0wsWUFBWTtRQUNaLGNBQWM7UUFDZCxjQUFjO1FBQ2Qsb0JBQW9CO1FBQ3BCLGtCQUFrQjtRQUNsQixvQkFBb0I7UUFDcEIsa0JBQWtCO1FBQ2xCLFlBQVk7UUFDWix1QkFBdUI7UUFDdkIscUJBQXFCO1FBQ3JCLFNBQVM7UUFDVCxRQUFRO1FBQ1Isc0JBQXNCO0tBQ3ZCLENBQUE7QUFDSCxDQUFDLENBQUE7QUExRFksUUFBQSxtQkFBbUIsdUJBMEQvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGx1Z2luU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0IHtcbiAgdXNlQ2FsbGJhY2ssXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgVGFza1N0YXR1cyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7XG4gIHVzZU11dGF0aW9uQ2xlYXJUYXNrUGx1Z2luLFxuICB1c2VQbHVnaW5UYXNrTGlzdCxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJ1xuXG5leHBvcnQgY29uc3QgdXNlUGx1Z2luVGFza1N0YXR1cyA9ICgpID0+IHtcbiAgY29uc3Qge1xuICAgIHBsdWdpblRhc2tzLFxuICAgIGhhbmRsZVJlZmV0Y2gsXG4gIH0gPSB1c2VQbHVnaW5UYXNrTGlzdCgpXG4gIGNvbnN0IHsgbXV0YXRlQXN5bmMgfSA9IHVzZU11dGF0aW9uQ2xlYXJUYXNrUGx1Z2luKClcbiAgY29uc3QgYWxsUGx1Z2lucyA9IHBsdWdpblRhc2tzLm1hcCh0YXNrID0+IHRhc2sucGx1Z2lucy5tYXAoKHBsdWdpbikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5wbHVnaW4sXG4gICAgICB0YXNrSWQ6IHRhc2suaWQsXG4gICAgfVxuICB9KSkuZmxhdCgpXG4gIGNvbnN0IGVycm9yUGx1Z2luczogUGx1Z2luU3RhdHVzW10gPSBbXVxuICBjb25zdCBzdWNjZXNzUGx1Z2luczogUGx1Z2luU3RhdHVzW10gPSBbXVxuICBjb25zdCBydW5uaW5nUGx1Z2luczogUGx1Z2luU3RhdHVzW10gPSBbXVxuXG4gIGFsbFBsdWdpbnMuZm9yRWFjaCgocGx1Z2luKSA9PiB7XG4gICAgaWYgKHBsdWdpbi5zdGF0dXMgPT09IFRhc2tTdGF0dXMucnVubmluZylcbiAgICAgIHJ1bm5pbmdQbHVnaW5zLnB1c2gocGx1Z2luKVxuICAgIGlmIChwbHVnaW4uc3RhdHVzID09PSBUYXNrU3RhdHVzLmZhaWxlZClcbiAgICAgIGVycm9yUGx1Z2lucy5wdXNoKHBsdWdpbilcbiAgICBpZiAocGx1Z2luLnN0YXR1cyA9PT0gVGFza1N0YXR1cy5zdWNjZXNzKVxuICAgICAgc3VjY2Vzc1BsdWdpbnMucHVzaChwbHVnaW4pXG4gIH0pXG5cbiAgY29uc3QgaGFuZGxlQ2xlYXJFcnJvclBsdWdpbiA9IHVzZUNhbGxiYWNrKGFzeW5jICh0YXNrSWQ6IHN0cmluZywgcGx1Z2luSWQ6IHN0cmluZykgPT4ge1xuICAgIGF3YWl0IG11dGF0ZUFzeW5jKHtcbiAgICAgIHRhc2tJZCxcbiAgICAgIHBsdWdpbklkLFxuICAgIH0pXG4gICAgaGFuZGxlUmVmZXRjaCgpXG4gIH0sIFttdXRhdGVBc3luYywgaGFuZGxlUmVmZXRjaF0pXG4gIGNvbnN0IHRvdGFsUGx1Z2luc0xlbmd0aCA9IGFsbFBsdWdpbnMubGVuZ3RoXG4gIGNvbnN0IHJ1bm5pbmdQbHVnaW5zTGVuZ3RoID0gcnVubmluZ1BsdWdpbnMubGVuZ3RoXG4gIGNvbnN0IGVycm9yUGx1Z2luc0xlbmd0aCA9IGVycm9yUGx1Z2lucy5sZW5ndGhcbiAgY29uc3Qgc3VjY2Vzc1BsdWdpbnNMZW5ndGggPSBzdWNjZXNzUGx1Z2lucy5sZW5ndGhcblxuICBjb25zdCBpc0luc3RhbGxpbmcgPSBydW5uaW5nUGx1Z2luc0xlbmd0aCA+IDAgJiYgZXJyb3JQbHVnaW5zTGVuZ3RoID09PSAwICYmIHN1Y2Nlc3NQbHVnaW5zTGVuZ3RoID09PSAwXG4gIGNvbnN0IGlzSW5zdGFsbGluZ1dpdGhTdWNjZXNzID0gcnVubmluZ1BsdWdpbnNMZW5ndGggPiAwICYmIHN1Y2Nlc3NQbHVnaW5zTGVuZ3RoID4gMCAmJiBlcnJvclBsdWdpbnNMZW5ndGggPT09IDBcbiAgY29uc3QgaXNJbnN0YWxsaW5nV2l0aEVycm9yID0gcnVubmluZ1BsdWdpbnNMZW5ndGggPiAwICYmIGVycm9yUGx1Z2luc0xlbmd0aCA+IDBcbiAgY29uc3QgaXNTdWNjZXNzID0gc3VjY2Vzc1BsdWdpbnNMZW5ndGggPT09IHRvdGFsUGx1Z2luc0xlbmd0aCAmJiB0b3RhbFBsdWdpbnNMZW5ndGggPiAwXG4gIGNvbnN0IGlzRmFpbGVkID0gcnVubmluZ1BsdWdpbnNMZW5ndGggPT09IDAgJiYgKGVycm9yUGx1Z2luc0xlbmd0aCArIHN1Y2Nlc3NQbHVnaW5zTGVuZ3RoKSA9PT0gdG90YWxQbHVnaW5zTGVuZ3RoICYmIHRvdGFsUGx1Z2luc0xlbmd0aCA+IDAgJiYgZXJyb3JQbHVnaW5zTGVuZ3RoID4gMFxuXG4gIHJldHVybiB7XG4gICAgZXJyb3JQbHVnaW5zLFxuICAgIHN1Y2Nlc3NQbHVnaW5zLFxuICAgIHJ1bm5pbmdQbHVnaW5zLFxuICAgIHJ1bm5pbmdQbHVnaW5zTGVuZ3RoLFxuICAgIGVycm9yUGx1Z2luc0xlbmd0aCxcbiAgICBzdWNjZXNzUGx1Z2luc0xlbmd0aCxcbiAgICB0b3RhbFBsdWdpbnNMZW5ndGgsXG4gICAgaXNJbnN0YWxsaW5nLFxuICAgIGlzSW5zdGFsbGluZ1dpdGhTdWNjZXNzLFxuICAgIGlzSW5zdGFsbGluZ1dpdGhFcnJvcixcbiAgICBpc1N1Y2Nlc3MsXG4gICAgaXNGYWlsZWQsXG4gICAgaGFuZGxlQ2xlYXJFcnJvclBsdWdpbixcbiAgfVxufVxuIl19