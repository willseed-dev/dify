"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const react_1 = require("react");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const app_1 = require("@/types/app");
const use_workflow_1 = require("./use-workflow");
const useConfigVision = (model, { payload = {
    enabled: false,
}, onChange, }) => {
    const { currentModel: currModel, } = (0, hooks_1.useTextGenerationCurrentProviderAndModelAndModelList)({
        provider: model.provider,
        model: model.name,
    });
    const isChatMode = (0, use_workflow_1.useIsChatMode)();
    const getIsVisionModel = (0, react_1.useCallback)(() => {
        return !!currModel?.features?.includes(declarations_1.ModelFeatureEnum.vision);
    }, [currModel]);
    const isVisionModel = getIsVisionModel();
    const handleVisionResolutionEnabledChange = (0, react_1.useCallback)((enabled) => {
        const newPayload = (0, immer_1.produce)(payload, (draft) => {
            draft.enabled = enabled;
            if (enabled && isChatMode) {
                draft.configs = {
                    detail: app_1.Resolution.high,
                    variable_selector: ['sys', 'files'],
                };
            }
            else if (!enabled) {
                delete draft.configs;
            }
        });
        onChange(newPayload);
    }, [isChatMode, onChange, payload]);
    const handleVisionResolutionChange = (0, react_1.useCallback)((config) => {
        const newPayload = (0, immer_1.produce)(payload, (draft) => {
            draft.configs = config;
        });
        onChange(newPayload);
    }, [onChange, payload]);
    const handleModelChanged = (0, react_1.useCallback)(() => {
        const isVisionModel = getIsVisionModel();
        if (!isVisionModel) {
            handleVisionResolutionEnabledChange(false);
            return;
        }
        if (payload.enabled) {
            onChange({
                enabled: true,
                configs: {
                    detail: app_1.Resolution.high,
                    variable_selector: [],
                },
            });
        }
    }, [getIsVisionModel, handleVisionResolutionEnabledChange, onChange, payload.enabled]);
    return {
        isVisionModel,
        handleVisionResolutionEnabledChange,
        handleVisionResolutionChange,
        handleModelChanged,
    };
};
exports.default = useConfigVision;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZy12aXNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtY29uZmlnLXZpc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlDQUErQjtBQUMvQixpQ0FBbUM7QUFDbkMsMkdBRWlGO0FBQ2pGLDZGQUF3STtBQUN4SSxxQ0FBd0M7QUFDeEMsaURBQThDO0FBVzlDLE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBa0IsRUFBRSxFQUMzQyxPQUFPLEdBQUc7SUFDUixPQUFPLEVBQUUsS0FBSztDQUNmLEVBQ0QsUUFBUSxHQUNELEVBQUUsRUFBRTtJQUNYLE1BQU0sRUFDSixZQUFZLEVBQUUsU0FBUyxHQUN4QixHQUFHLElBQUEsNERBQW9ELEVBQ3REO1FBQ0UsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1FBQ3hCLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSTtLQUNsQixDQUNGLENBQUE7SUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFBLDRCQUFhLEdBQUUsQ0FBQTtJQUVsQyxNQUFNLGdCQUFnQixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDeEMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsK0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDakUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUVmLE1BQU0sYUFBYSxHQUFHLGdCQUFnQixFQUFFLENBQUE7SUFFeEMsTUFBTSxtQ0FBbUMsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDM0UsTUFBTSxVQUFVLEdBQUcsSUFBQSxlQUFPLEVBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDNUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7WUFDdkIsSUFBSSxPQUFPLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQzFCLEtBQUssQ0FBQyxPQUFPLEdBQUc7b0JBQ2QsTUFBTSxFQUFFLGdCQUFVLENBQUMsSUFBSTtvQkFDdkIsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO2lCQUNwQyxDQUFBO1lBQ0gsQ0FBQztpQkFDSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2xCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQTtZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDRixRQUFRLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRW5DLE1BQU0sNEJBQTRCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBcUIsRUFBRSxFQUFFO1FBQ3pFLE1BQU0sVUFBVSxHQUFHLElBQUEsZUFBTyxFQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzVDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO1FBQ3hCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ3RCLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRXZCLE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUMxQyxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ3hDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNuQixtQ0FBbUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMxQyxPQUFNO1FBQ1IsQ0FBQztRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BCLFFBQVEsQ0FBQztnQkFDUCxPQUFPLEVBQUUsSUFBSTtnQkFDYixPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFLGdCQUFVLENBQUMsSUFBSTtvQkFDdkIsaUJBQWlCLEVBQUUsRUFBRTtpQkFDdEI7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsbUNBQW1DLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRXRGLE9BQU87UUFDTCxhQUFhO1FBQ2IsbUNBQW1DO1FBQ25DLDRCQUE0QjtRQUM1QixrQkFBa0I7S0FDbkIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9kZWxDb25maWcsIFZpc2lvblNldHRpbmcgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIE1vZGVsRmVhdHVyZUVudW0sXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IHVzZVRleHRHZW5lcmF0aW9uQ3VycmVudFByb3ZpZGVyQW5kTW9kZWxBbmRNb2RlbExpc3QgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcydcbmltcG9ydCB7IFJlc29sdXRpb24gfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IHVzZUlzQ2hhdE1vZGUgfSBmcm9tICcuL3VzZS13b3JrZmxvdydcblxudHlwZSBQYXlsb2FkID0ge1xuICBlbmFibGVkOiBib29sZWFuXG4gIGNvbmZpZ3M/OiBWaXNpb25TZXR0aW5nXG59XG5cbnR5cGUgUGFyYW1zID0ge1xuICBwYXlsb2FkOiBQYXlsb2FkXG4gIG9uQ2hhbmdlOiAocGF5bG9hZDogUGF5bG9hZCkgPT4gdm9pZFxufVxuY29uc3QgdXNlQ29uZmlnVmlzaW9uID0gKG1vZGVsOiBNb2RlbENvbmZpZywge1xuICBwYXlsb2FkID0ge1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICB9LFxuICBvbkNoYW5nZSxcbn06IFBhcmFtcykgPT4ge1xuICBjb25zdCB7XG4gICAgY3VycmVudE1vZGVsOiBjdXJyTW9kZWwsXG4gIH0gPSB1c2VUZXh0R2VuZXJhdGlvbkN1cnJlbnRQcm92aWRlckFuZE1vZGVsQW5kTW9kZWxMaXN0KFxuICAgIHtcbiAgICAgIHByb3ZpZGVyOiBtb2RlbC5wcm92aWRlcixcbiAgICAgIG1vZGVsOiBtb2RlbC5uYW1lLFxuICAgIH0sXG4gIClcblxuICBjb25zdCBpc0NoYXRNb2RlID0gdXNlSXNDaGF0TW9kZSgpXG5cbiAgY29uc3QgZ2V0SXNWaXNpb25Nb2RlbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICByZXR1cm4gISFjdXJyTW9kZWw/LmZlYXR1cmVzPy5pbmNsdWRlcyhNb2RlbEZlYXR1cmVFbnVtLnZpc2lvbilcbiAgfSwgW2N1cnJNb2RlbF0pXG5cbiAgY29uc3QgaXNWaXNpb25Nb2RlbCA9IGdldElzVmlzaW9uTW9kZWwoKVxuXG4gIGNvbnN0IGhhbmRsZVZpc2lvblJlc29sdXRpb25FbmFibGVkQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGVuYWJsZWQ6IGJvb2xlYW4pID0+IHtcbiAgICBjb25zdCBuZXdQYXlsb2FkID0gcHJvZHVjZShwYXlsb2FkLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmVuYWJsZWQgPSBlbmFibGVkXG4gICAgICBpZiAoZW5hYmxlZCAmJiBpc0NoYXRNb2RlKSB7XG4gICAgICAgIGRyYWZ0LmNvbmZpZ3MgPSB7XG4gICAgICAgICAgZGV0YWlsOiBSZXNvbHV0aW9uLmhpZ2gsXG4gICAgICAgICAgdmFyaWFibGVfc2VsZWN0b3I6IFsnc3lzJywgJ2ZpbGVzJ10sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFlbmFibGVkKSB7XG4gICAgICAgIGRlbGV0ZSBkcmFmdC5jb25maWdzXG4gICAgICB9XG4gICAgfSlcbiAgICBvbkNoYW5nZShuZXdQYXlsb2FkKVxuICB9LCBbaXNDaGF0TW9kZSwgb25DaGFuZ2UsIHBheWxvYWRdKVxuXG4gIGNvbnN0IGhhbmRsZVZpc2lvblJlc29sdXRpb25DaGFuZ2UgPSB1c2VDYWxsYmFjaygoY29uZmlnOiBWaXNpb25TZXR0aW5nKSA9PiB7XG4gICAgY29uc3QgbmV3UGF5bG9hZCA9IHByb2R1Y2UocGF5bG9hZCwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5jb25maWdzID0gY29uZmlnXG4gICAgfSlcbiAgICBvbkNoYW5nZShuZXdQYXlsb2FkKVxuICB9LCBbb25DaGFuZ2UsIHBheWxvYWRdKVxuXG4gIGNvbnN0IGhhbmRsZU1vZGVsQ2hhbmdlZCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBpc1Zpc2lvbk1vZGVsID0gZ2V0SXNWaXNpb25Nb2RlbCgpXG4gICAgaWYgKCFpc1Zpc2lvbk1vZGVsKSB7XG4gICAgICBoYW5kbGVWaXNpb25SZXNvbHV0aW9uRW5hYmxlZENoYW5nZShmYWxzZSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAocGF5bG9hZC5lbmFibGVkKSB7XG4gICAgICBvbkNoYW5nZSh7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGNvbmZpZ3M6IHtcbiAgICAgICAgICBkZXRhaWw6IFJlc29sdXRpb24uaGlnaCxcbiAgICAgICAgICB2YXJpYWJsZV9zZWxlY3RvcjogW10sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgfSwgW2dldElzVmlzaW9uTW9kZWwsIGhhbmRsZVZpc2lvblJlc29sdXRpb25FbmFibGVkQ2hhbmdlLCBvbkNoYW5nZSwgcGF5bG9hZC5lbmFibGVkXSlcblxuICByZXR1cm4ge1xuICAgIGlzVmlzaW9uTW9kZWwsXG4gICAgaGFuZGxlVmlzaW9uUmVzb2x1dGlvbkVuYWJsZWRDaGFuZ2UsXG4gICAgaGFuZGxlVmlzaW9uUmVzb2x1dGlvbkNoYW5nZSxcbiAgICBoYW5kbGVNb2RlbENoYW5nZWQsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQ29uZmlnVmlzaW9uXG4iXX0=