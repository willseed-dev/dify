"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfigsMap = void 0;
const react_1 = require("react");
const store_1 = require("@/app/components/workflow/store");
const app_1 = require("@/types/app");
const common_1 = require("@/types/common");
const useConfigsMap = () => {
    const pipelineId = (0, store_1.useStore)(s => s.pipelineId);
    const fileUploadConfig = (0, store_1.useStore)(s => s.fileUploadConfig);
    return (0, react_1.useMemo)(() => {
        return {
            flowId: pipelineId,
            flowType: common_1.FlowType.ragPipeline,
            fileSettings: {
                image: {
                    enabled: false,
                    detail: app_1.Resolution.high,
                    number_limits: 3,
                    transfer_methods: [app_1.TransferMethod.local_file, app_1.TransferMethod.remote_url],
                },
                fileUploadConfig,
            },
        };
    }, [pipelineId]);
};
exports.useConfigsMap = useConfigsMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZ3MtbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWNvbmZpZ3MtbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUErQjtBQUMvQiwyREFBMEQ7QUFDMUQscUNBQXdEO0FBQ3hELDJDQUF5QztBQUVsQyxNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7SUFDaEMsTUFBTSxVQUFVLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQzlDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDMUQsT0FBTyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDbEIsT0FBTztZQUNMLE1BQU0sRUFBRSxVQUFXO1lBQ25CLFFBQVEsRUFBRSxpQkFBUSxDQUFDLFdBQVc7WUFDOUIsWUFBWSxFQUFFO2dCQUNaLEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsS0FBSztvQkFDZCxNQUFNLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJO29CQUN2QixhQUFhLEVBQUUsQ0FBQztvQkFDaEIsZ0JBQWdCLEVBQUUsQ0FBQyxvQkFBYyxDQUFDLFVBQVUsRUFBRSxvQkFBYyxDQUFDLFVBQVUsQ0FBQztpQkFDekU7Z0JBQ0QsZ0JBQWdCO2FBQ2pCO1NBQ0YsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7QUFDbEIsQ0FBQyxDQUFBO0FBbEJZLFFBQUEsYUFBYSxpQkFrQnpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHsgUmVzb2x1dGlvbiwgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IEZsb3dUeXBlIH0gZnJvbSAnQC90eXBlcy9jb21tb24nXG5cbmV4cG9ydCBjb25zdCB1c2VDb25maWdzTWFwID0gKCkgPT4ge1xuICBjb25zdCBwaXBlbGluZUlkID0gdXNlU3RvcmUocyA9PiBzLnBpcGVsaW5lSWQpXG4gIGNvbnN0IGZpbGVVcGxvYWRDb25maWcgPSB1c2VTdG9yZShzID0+IHMuZmlsZVVwbG9hZENvbmZpZylcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBmbG93SWQ6IHBpcGVsaW5lSWQhLFxuICAgICAgZmxvd1R5cGU6IEZsb3dUeXBlLnJhZ1BpcGVsaW5lLFxuICAgICAgZmlsZVNldHRpbmdzOiB7XG4gICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgZGV0YWlsOiBSZXNvbHV0aW9uLmhpZ2gsXG4gICAgICAgICAgbnVtYmVyX2xpbWl0czogMyxcbiAgICAgICAgICB0cmFuc2Zlcl9tZXRob2RzOiBbVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSwgVHJhbnNmZXJNZXRob2QucmVtb3RlX3VybF0sXG4gICAgICAgIH0sXG4gICAgICAgIGZpbGVVcGxvYWRDb25maWcsXG4gICAgICB9LFxuICAgIH1cbiAgfSwgW3BpcGVsaW5lSWRdKVxufVxuIl19