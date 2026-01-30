"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugins_1 = require("@/service/plugins");
const utils_1 = require("@/utils");
const types_1 = require("../../types");
const INTERVAL = 10 * 1000; // 10 seconds
function checkTaskStatus() {
    let nextStatus = types_1.TaskStatus.running;
    let isStop = false;
    const doCheckStatus = async ({ taskId, pluginUniqueIdentifier, }) => {
        if (isStop) {
            return {
                status: types_1.TaskStatus.success,
            };
        }
        const res = await (0, plugins_1.checkTaskStatus)(taskId);
        const { plugins } = res.task;
        const plugin = plugins.find((p) => p.plugin_unique_identifier === pluginUniqueIdentifier);
        if (!plugin) {
            nextStatus = types_1.TaskStatus.failed;
            return {
                status: types_1.TaskStatus.failed,
                error: 'Plugin package not found',
            };
        }
        nextStatus = plugin.status;
        if (nextStatus === types_1.TaskStatus.running) {
            await (0, utils_1.sleep)(INTERVAL);
            return await doCheckStatus({
                taskId,
                pluginUniqueIdentifier,
            });
        }
        if (nextStatus === types_1.TaskStatus.failed) {
            return {
                status: types_1.TaskStatus.failed,
                error: plugin.message,
            };
        }
        return ({
            status: types_1.TaskStatus.success,
        });
    };
    return {
        check: doCheckStatus,
        stop: () => {
            isStop = true;
        },
    };
}
exports.default = checkTaskStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stdGFzay1zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGVjay10YXNrLXN0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtDQUEyRTtBQUMzRSxtQ0FBK0I7QUFDL0IsdUNBQXdDO0FBRXhDLE1BQU0sUUFBUSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUEsQ0FBQyxhQUFhO0FBT3hDLFNBQVMsZUFBZTtJQUN0QixJQUFJLFVBQVUsR0FBRyxrQkFBVSxDQUFDLE9BQU8sQ0FBQTtJQUNuQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUE7SUFFbEIsTUFBTSxhQUFhLEdBQUcsS0FBSyxFQUFFLEVBQzNCLE1BQU0sRUFDTixzQkFBc0IsR0FDZixFQUFFLEVBQUU7UUFDWCxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsT0FBTztnQkFDTCxNQUFNLEVBQUUsa0JBQVUsQ0FBQyxPQUFPO2FBQzNCLENBQUE7UUFDSCxDQUFDO1FBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLHlCQUFvQixFQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzlDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO1FBQzVCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsS0FBSyxzQkFBc0IsQ0FBQyxDQUFBO1FBQ3ZHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNaLFVBQVUsR0FBRyxrQkFBVSxDQUFDLE1BQU0sQ0FBQTtZQUM5QixPQUFPO2dCQUNMLE1BQU0sRUFBRSxrQkFBVSxDQUFDLE1BQU07Z0JBQ3pCLEtBQUssRUFBRSwwQkFBMEI7YUFDbEMsQ0FBQTtRQUNILENBQUM7UUFDRCxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQTtRQUMxQixJQUFJLFVBQVUsS0FBSyxrQkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RDLE1BQU0sSUFBQSxhQUFLLEVBQUMsUUFBUSxDQUFDLENBQUE7WUFDckIsT0FBTyxNQUFNLGFBQWEsQ0FBQztnQkFDekIsTUFBTTtnQkFDTixzQkFBc0I7YUFDdkIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELElBQUksVUFBVSxLQUFLLGtCQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDckMsT0FBTztnQkFDTCxNQUFNLEVBQUUsa0JBQVUsQ0FBQyxNQUFNO2dCQUN6QixLQUFLLEVBQUUsTUFBTSxDQUFDLE9BQU87YUFDdEIsQ0FBQTtRQUNILENBQUM7UUFDRCxPQUFPLENBQUM7WUFDTixNQUFNLEVBQUUsa0JBQVUsQ0FBQyxPQUFPO1NBQzNCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQTtJQUVELE9BQU87UUFDTCxLQUFLLEVBQUUsYUFBYTtRQUNwQixJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQ1QsTUFBTSxHQUFHLElBQUksQ0FBQTtRQUNmLENBQUM7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGx1Z2luU3RhdHVzIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBjaGVja1Rhc2tTdGF0dXMgYXMgZmV0Y2hDaGVja1Rhc2tTdGF0dXMgfSBmcm9tICdAL3NlcnZpY2UvcGx1Z2lucydcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCB7IFRhc2tTdGF0dXMgfSBmcm9tICcuLi8uLi90eXBlcydcblxuY29uc3QgSU5URVJWQUwgPSAxMCAqIDEwMDAgLy8gMTAgc2Vjb25kc1xuXG50eXBlIFBhcmFtcyA9IHtcbiAgdGFza0lkOiBzdHJpbmdcbiAgcGx1Z2luVW5pcXVlSWRlbnRpZmllcjogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIGNoZWNrVGFza1N0YXR1cygpIHtcbiAgbGV0IG5leHRTdGF0dXMgPSBUYXNrU3RhdHVzLnJ1bm5pbmdcbiAgbGV0IGlzU3RvcCA9IGZhbHNlXG5cbiAgY29uc3QgZG9DaGVja1N0YXR1cyA9IGFzeW5jICh7XG4gICAgdGFza0lkLFxuICAgIHBsdWdpblVuaXF1ZUlkZW50aWZpZXIsXG4gIH06IFBhcmFtcykgPT4ge1xuICAgIGlmIChpc1N0b3ApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1czogVGFza1N0YXR1cy5zdWNjZXNzLFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaENoZWNrVGFza1N0YXR1cyh0YXNrSWQpXG4gICAgY29uc3QgeyBwbHVnaW5zIH0gPSByZXMudGFza1xuICAgIGNvbnN0IHBsdWdpbiA9IHBsdWdpbnMuZmluZCgocDogUGx1Z2luU3RhdHVzKSA9PiBwLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllciA9PT0gcGx1Z2luVW5pcXVlSWRlbnRpZmllcilcbiAgICBpZiAoIXBsdWdpbikge1xuICAgICAgbmV4dFN0YXR1cyA9IFRhc2tTdGF0dXMuZmFpbGVkXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6IFRhc2tTdGF0dXMuZmFpbGVkLFxuICAgICAgICBlcnJvcjogJ1BsdWdpbiBwYWNrYWdlIG5vdCBmb3VuZCcsXG4gICAgICB9XG4gICAgfVxuICAgIG5leHRTdGF0dXMgPSBwbHVnaW4uc3RhdHVzXG4gICAgaWYgKG5leHRTdGF0dXMgPT09IFRhc2tTdGF0dXMucnVubmluZykge1xuICAgICAgYXdhaXQgc2xlZXAoSU5URVJWQUwpXG4gICAgICByZXR1cm4gYXdhaXQgZG9DaGVja1N0YXR1cyh7XG4gICAgICAgIHRhc2tJZCxcbiAgICAgICAgcGx1Z2luVW5pcXVlSWRlbnRpZmllcixcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChuZXh0U3RhdHVzID09PSBUYXNrU3RhdHVzLmZhaWxlZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzOiBUYXNrU3RhdHVzLmZhaWxlZCxcbiAgICAgICAgZXJyb3I6IHBsdWdpbi5tZXNzYWdlLFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHtcbiAgICAgIHN0YXR1czogVGFza1N0YXR1cy5zdWNjZXNzLFxuICAgIH0pXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNoZWNrOiBkb0NoZWNrU3RhdHVzLFxuICAgIHN0b3A6ICgpID0+IHtcbiAgICAgIGlzU3RvcCA9IHRydWVcbiAgICB9LFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNoZWNrVGFza1N0YXR1c1xuIl19