"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRetryDetailShowInSingleRun = exports.useRetryConfig = void 0;
const react_1 = require("react");
const hooks_1 = require("@/app/components/workflow/hooks");
const useRetryConfig = (id) => {
    const { handleNodeDataUpdateWithSyncDraft } = (0, hooks_1.useNodeDataUpdate)();
    const handleRetryConfigChange = (0, react_1.useCallback)((value) => {
        handleNodeDataUpdateWithSyncDraft({
            id,
            data: {
                retry_config: value,
            },
        });
    }, [id, handleNodeDataUpdateWithSyncDraft]);
    return {
        handleRetryConfigChange,
    };
};
exports.useRetryConfig = useRetryConfig;
const useRetryDetailShowInSingleRun = () => {
    const [retryDetails, setRetryDetails] = (0, react_1.useState)();
    const handleRetryDetailsChange = (0, react_1.useCallback)((details) => {
        setRetryDetails(details);
    }, []);
    return {
        retryDetails,
        handleRetryDetailsChange,
    };
};
exports.useRetryDetailShowInSingleRun = useRetryDetailShowInSingleRun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxpQ0FHYztBQUNkLDJEQUV3QztBQUVqQyxNQUFNLGNBQWMsR0FBRyxDQUM1QixFQUFVLEVBQ1YsRUFBRTtJQUNGLE1BQU0sRUFBRSxpQ0FBaUMsRUFBRSxHQUFHLElBQUEseUJBQWlCLEdBQUUsQ0FBQTtJQUVqRSxNQUFNLHVCQUF1QixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLEtBQTJCLEVBQUUsRUFBRTtRQUMxRSxpQ0FBaUMsQ0FBQztZQUNoQyxFQUFFO1lBQ0YsSUFBSSxFQUFFO2dCQUNKLFlBQVksRUFBRSxLQUFLO2FBQ3BCO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLGlDQUFpQyxDQUFDLENBQUMsQ0FBQTtJQUUzQyxPQUFPO1FBQ0wsdUJBQXVCO0tBQ3hCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFqQlksUUFBQSxjQUFjLGtCQWlCMUI7QUFFTSxNQUFNLDZCQUE2QixHQUFHLEdBQUcsRUFBRTtJQUNoRCxNQUFNLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsR0FBNkIsQ0FBQTtJQUU3RSxNQUFNLHdCQUF3QixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE9BQWtDLEVBQUUsRUFBRTtRQUNsRixlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDMUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRU4sT0FBTztRQUNMLFlBQVk7UUFDWix3QkFBd0I7S0FDekIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQVhZLFFBQUEsNkJBQTZCLGlDQVd6QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgV29ya2Zsb3dSZXRyeUNvbmZpZyB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE5vZGVUcmFjaW5nIH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICB1c2VOb2RlRGF0YVVwZGF0ZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcblxuZXhwb3J0IGNvbnN0IHVzZVJldHJ5Q29uZmlnID0gKFxuICBpZDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0IH0gPSB1c2VOb2RlRGF0YVVwZGF0ZSgpXG5cbiAgY29uc3QgaGFuZGxlUmV0cnlDb25maWdDaGFuZ2UgPSB1c2VDYWxsYmFjaygodmFsdWU/OiBXb3JrZmxvd1JldHJ5Q29uZmlnKSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0KHtcbiAgICAgIGlkLFxuICAgICAgZGF0YToge1xuICAgICAgICByZXRyeV9jb25maWc6IHZhbHVlLFxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbaWQsIGhhbmRsZU5vZGVEYXRhVXBkYXRlV2l0aFN5bmNEcmFmdF0pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVSZXRyeUNvbmZpZ0NoYW5nZSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlUmV0cnlEZXRhaWxTaG93SW5TaW5nbGVSdW4gPSAoKSA9PiB7XG4gIGNvbnN0IFtyZXRyeURldGFpbHMsIHNldFJldHJ5RGV0YWlsc10gPSB1c2VTdGF0ZTxOb2RlVHJhY2luZ1tdIHwgdW5kZWZpbmVkPigpXG5cbiAgY29uc3QgaGFuZGxlUmV0cnlEZXRhaWxzQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGRldGFpbHM6IE5vZGVUcmFjaW5nW10gfCB1bmRlZmluZWQpID0+IHtcbiAgICBzZXRSZXRyeURldGFpbHMoZGV0YWlscylcbiAgfSwgW10pXG5cbiAgcmV0dXJuIHtcbiAgICByZXRyeURldGFpbHMsXG4gICAgaGFuZGxlUmV0cnlEZXRhaWxzQ2hhbmdlLFxuICB9XG59XG4iXX0=