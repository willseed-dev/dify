"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_plugins_1 = require("@/service/use-plugins");
const useCheckInstalled = (props) => {
    const { data, isLoading, error } = (0, use_plugins_1.useCheckInstalled)(props);
    const installedInfo = (0, react_1.useMemo)(() => {
        if (!data)
            return undefined;
        const res = {};
        data?.plugins.forEach((plugin) => {
            res[plugin.plugin_id] = {
                installedId: plugin.id,
                installedVersion: plugin.declaration.version,
                uniqueIdentifier: plugin.plugin_unique_identifier,
            };
        });
        return res;
    }, [data]);
    return {
        installedInfo,
        isLoading,
        error,
    };
};
exports.default = useCheckInstalled;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNoZWNrLWluc3RhbGxlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jaGVjay1pbnN0YWxsZWQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsaUNBQStCO0FBQy9CLHVEQUFnRjtBQU1oRixNQUFNLGlCQUFpQixHQUFHLENBQUMsS0FBWSxFQUFFLEVBQUU7SUFDekMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBQSwrQkFBbUIsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUU3RCxNQUFNLGFBQWEsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDakMsSUFBSSxDQUFDLElBQUk7WUFDUCxPQUFPLFNBQVMsQ0FBQTtRQUVsQixNQUFNLEdBQUcsR0FBZ0MsRUFBRSxDQUFBO1FBQzNDLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRztnQkFDdEIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QixnQkFBZ0IsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU87Z0JBQzVDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyx3QkFBd0I7YUFDbEQsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxHQUFHLENBQUE7SUFDWixDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ1YsT0FBTztRQUNMLGFBQWE7UUFDYixTQUFTO1FBQ1QsS0FBSztLQUNOLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxpQkFBaUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVmVyc2lvbkluZm8gfSBmcm9tICcuLi8uLi90eXBlcydcblxuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2hlY2tJbnN0YWxsZWQgYXMgdXNlRG9DaGVja0luc3RhbGxlZCB9IGZyb20gJ0Avc2VydmljZS91c2UtcGx1Z2lucydcblxudHlwZSBQcm9wcyA9IHtcbiAgcGx1Z2luSWRzOiBzdHJpbmdbXVxuICBlbmFibGVkOiBib29sZWFuXG59XG5jb25zdCB1c2VDaGVja0luc3RhbGxlZCA9IChwcm9wczogUHJvcHMpID0+IHtcbiAgY29uc3QgeyBkYXRhLCBpc0xvYWRpbmcsIGVycm9yIH0gPSB1c2VEb0NoZWNrSW5zdGFsbGVkKHByb3BzKVxuXG4gIGNvbnN0IGluc3RhbGxlZEluZm8gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBjb25zdCByZXM6IFJlY29yZDxzdHJpbmcsIFZlcnNpb25JbmZvPiA9IHt9XG4gICAgZGF0YT8ucGx1Z2lucy5mb3JFYWNoKChwbHVnaW4pID0+IHtcbiAgICAgIHJlc1twbHVnaW4ucGx1Z2luX2lkXSA9IHtcbiAgICAgICAgaW5zdGFsbGVkSWQ6IHBsdWdpbi5pZCxcbiAgICAgICAgaW5zdGFsbGVkVmVyc2lvbjogcGx1Z2luLmRlY2xhcmF0aW9uLnZlcnNpb24sXG4gICAgICAgIHVuaXF1ZUlkZW50aWZpZXI6IHBsdWdpbi5wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIsXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gcmVzXG4gIH0sIFtkYXRhXSlcbiAgcmV0dXJuIHtcbiAgICBpbnN0YWxsZWRJbmZvLFxuICAgIGlzTG9hZGluZyxcbiAgICBlcnJvcixcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VDaGVja0luc3RhbGxlZFxuIl19