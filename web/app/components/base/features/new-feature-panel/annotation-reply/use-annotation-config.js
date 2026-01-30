"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const React = require("react");
const react_1 = require("react");
const type_1 = require("@/app/components/app/annotation/type");
const config_1 = require("@/config");
const provider_context_1 = require("@/context/provider-context");
const annotation_1 = require("@/service/annotation");
const utils_1 = require("@/utils");
const useAnnotationConfig = ({ appId, annotationConfig, setAnnotationConfig, }) => {
    const { plan, enableBilling } = (0, provider_context_1.useProviderContext)();
    const isAnnotationFull = (enableBilling && plan.usage.annotatedResponse >= plan.total.annotatedResponse);
    const [isShowAnnotationFullModal, setIsShowAnnotationFullModal] = (0, react_1.useState)(false);
    const [isShowAnnotationConfigInit, doSetIsShowAnnotationConfigInit] = React.useState(false);
    const setIsShowAnnotationConfigInit = (isShow) => {
        if (isShow) {
            if (isAnnotationFull) {
                setIsShowAnnotationFullModal(true);
                return;
            }
        }
        doSetIsShowAnnotationConfigInit(isShow);
    };
    const ensureJobCompleted = async (jobId, status) => {
        let isCompleted = false;
        while (!isCompleted) {
            const res = await (0, annotation_1.queryAnnotationJobStatus)(appId, status, jobId);
            isCompleted = res.job_status === type_1.JobStatus.completed;
            if (isCompleted)
                break;
            await (0, utils_1.sleep)(2000);
        }
    };
    const handleEnableAnnotation = async (embeddingModel, score) => {
        if (isAnnotationFull)
            return;
        const { job_id: jobId } = await (0, annotation_1.updateAnnotationStatus)(appId, type_1.AnnotationEnableStatus.enable, embeddingModel, score);
        await ensureJobCompleted(jobId, type_1.AnnotationEnableStatus.enable);
        setAnnotationConfig((0, immer_1.produce)(annotationConfig, (draft) => {
            draft.enabled = true;
            draft.embedding_model = embeddingModel;
            if (!draft.score_threshold)
                draft.score_threshold = config_1.ANNOTATION_DEFAULT.score_threshold;
        }));
    };
    const setScore = (score, embeddingModel) => {
        setAnnotationConfig((0, immer_1.produce)(annotationConfig, (draft) => {
            draft.score_threshold = score;
            if (embeddingModel)
                draft.embedding_model = embeddingModel;
        }));
    };
    const handleDisableAnnotation = async (embeddingModel) => {
        if (!annotationConfig.enabled)
            return;
        await (0, annotation_1.updateAnnotationStatus)(appId, type_1.AnnotationEnableStatus.disable, embeddingModel);
        setAnnotationConfig((0, immer_1.produce)(annotationConfig, (draft) => {
            draft.enabled = false;
        }));
    };
    return {
        handleEnableAnnotation,
        handleDisableAnnotation,
        isShowAnnotationConfigInit,
        setIsShowAnnotationConfigInit,
        isShowAnnotationFullModal,
        setIsShowAnnotationFullModal,
        setScore,
    };
};
exports.default = useAnnotationConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWFubm90YXRpb24tY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWFubm90YXRpb24tY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsaUNBQStCO0FBQy9CLCtCQUE4QjtBQUM5QixpQ0FBZ0M7QUFDaEMsK0RBQXdGO0FBQ3hGLHFDQUE2QztBQUM3QyxpRUFBK0Q7QUFDL0QscURBQXVGO0FBQ3ZGLG1DQUErQjtBQU8vQixNQUFNLG1CQUFtQixHQUFHLENBQUMsRUFDM0IsS0FBSyxFQUNMLGdCQUFnQixFQUNoQixtQkFBbUIsR0FDWixFQUFFLEVBQUU7SUFDWCxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxHQUFHLElBQUEscUNBQWtCLEdBQUUsQ0FBQTtJQUNwRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBQ3hHLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSw0QkFBNEIsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUNqRixNQUFNLENBQUMsMEJBQTBCLEVBQUUsK0JBQStCLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzNGLE1BQU0sNkJBQTZCLEdBQUcsQ0FBQyxNQUFlLEVBQUUsRUFBRTtRQUN4RCxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNyQiw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDbEMsT0FBTTtZQUNSLENBQUM7UUFDSCxDQUFDO1FBQ0QsK0JBQStCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDekMsQ0FBQyxDQUFBO0lBQ0QsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLEVBQUUsS0FBYSxFQUFFLE1BQThCLEVBQUUsRUFBRTtRQUNqRixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDdkIsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sR0FBRyxHQUFRLE1BQU0sSUFBQSxxQ0FBd0IsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQ3JFLFdBQVcsR0FBRyxHQUFHLENBQUMsVUFBVSxLQUFLLGdCQUFTLENBQUMsU0FBUyxDQUFBO1lBQ3BELElBQUksV0FBVztnQkFDYixNQUFLO1lBRVAsTUFBTSxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsQ0FBQTtRQUNuQixDQUFDO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsTUFBTSxzQkFBc0IsR0FBRyxLQUFLLEVBQUUsY0FBb0MsRUFBRSxLQUFjLEVBQUUsRUFBRTtRQUM1RixJQUFJLGdCQUFnQjtZQUNsQixPQUFNO1FBRVIsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBUSxNQUFNLElBQUEsbUNBQXNCLEVBQUMsS0FBSyxFQUFFLDZCQUFzQixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDeEgsTUFBTSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsNkJBQXNCLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDOUQsbUJBQW1CLENBQUMsSUFBQSxlQUFPLEVBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUE0QixFQUFFLEVBQUU7WUFDN0UsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7WUFDcEIsS0FBSyxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUE7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlO2dCQUN4QixLQUFLLENBQUMsZUFBZSxHQUFHLDJCQUFrQixDQUFDLGVBQWUsQ0FBQTtRQUM5RCxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxDQUFBO0lBRUQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFhLEVBQUUsY0FBcUMsRUFBRSxFQUFFO1FBQ3hFLG1CQUFtQixDQUFDLElBQUEsZUFBTyxFQUFDLGdCQUFnQixFQUFFLENBQUMsS0FBNEIsRUFBRSxFQUFFO1lBQzdFLEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFBO1lBQzdCLElBQUksY0FBYztnQkFDaEIsS0FBSyxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUE7UUFDMUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUMsQ0FBQTtJQUVELE1BQU0sdUJBQXVCLEdBQUcsS0FBSyxFQUFFLGNBQW9DLEVBQUUsRUFBRTtRQUM3RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTztZQUMzQixPQUFNO1FBRVIsTUFBTSxJQUFBLG1DQUFzQixFQUFDLEtBQUssRUFBRSw2QkFBc0IsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFDbkYsbUJBQW1CLENBQUMsSUFBQSxlQUFPLEVBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUE0QixFQUFFLEVBQUU7WUFDN0UsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUMsQ0FBQTtJQUVELE9BQU87UUFDTCxzQkFBc0I7UUFDdEIsdUJBQXVCO1FBQ3ZCLDBCQUEwQjtRQUMxQiw2QkFBNkI7UUFDN0IseUJBQXlCO1FBQ3pCLDRCQUE0QjtRQUM1QixRQUFRO0tBQ1QsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLG1CQUFtQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBFbWJlZGRpbmdNb2RlbENvbmZpZyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL2Fubm90YXRpb24vdHlwZSdcbmltcG9ydCB0eXBlIHsgQW5ub3RhdGlvblJlcGx5Q29uZmlnIH0gZnJvbSAnQC9tb2RlbHMvZGVidWcnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBBbm5vdGF0aW9uRW5hYmxlU3RhdHVzLCBKb2JTdGF0dXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9hbm5vdGF0aW9uL3R5cGUnXG5pbXBvcnQgeyBBTk5PVEFUSU9OX0RFRkFVTFQgfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IHVzZVByb3ZpZGVyQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0J1xuaW1wb3J0IHsgcXVlcnlBbm5vdGF0aW9uSm9iU3RhdHVzLCB1cGRhdGVBbm5vdGF0aW9uU3RhdHVzIH0gZnJvbSAnQC9zZXJ2aWNlL2Fubm90YXRpb24nXG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gJ0AvdXRpbHMnXG5cbnR5cGUgUGFyYW1zID0ge1xuICBhcHBJZDogc3RyaW5nXG4gIGFubm90YXRpb25Db25maWc6IEFubm90YXRpb25SZXBseUNvbmZpZ1xuICBzZXRBbm5vdGF0aW9uQ29uZmlnOiAoYW5ub3RhdGlvbkNvbmZpZzogQW5ub3RhdGlvblJlcGx5Q29uZmlnKSA9PiB2b2lkXG59XG5jb25zdCB1c2VBbm5vdGF0aW9uQ29uZmlnID0gKHtcbiAgYXBwSWQsXG4gIGFubm90YXRpb25Db25maWcsXG4gIHNldEFubm90YXRpb25Db25maWcsXG59OiBQYXJhbXMpID0+IHtcbiAgY29uc3QgeyBwbGFuLCBlbmFibGVCaWxsaW5nIH0gPSB1c2VQcm92aWRlckNvbnRleHQoKVxuICBjb25zdCBpc0Fubm90YXRpb25GdWxsID0gKGVuYWJsZUJpbGxpbmcgJiYgcGxhbi51c2FnZS5hbm5vdGF0ZWRSZXNwb25zZSA+PSBwbGFuLnRvdGFsLmFubm90YXRlZFJlc3BvbnNlKVxuICBjb25zdCBbaXNTaG93QW5ub3RhdGlvbkZ1bGxNb2RhbCwgc2V0SXNTaG93QW5ub3RhdGlvbkZ1bGxNb2RhbF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2lzU2hvd0Fubm90YXRpb25Db25maWdJbml0LCBkb1NldElzU2hvd0Fubm90YXRpb25Db25maWdJbml0XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBzZXRJc1Nob3dBbm5vdGF0aW9uQ29uZmlnSW5pdCA9IChpc1Nob3c6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoaXNTaG93KSB7XG4gICAgICBpZiAoaXNBbm5vdGF0aW9uRnVsbCkge1xuICAgICAgICBzZXRJc1Nob3dBbm5vdGF0aW9uRnVsbE1vZGFsKHRydWUpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgICBkb1NldElzU2hvd0Fubm90YXRpb25Db25maWdJbml0KGlzU2hvdylcbiAgfVxuICBjb25zdCBlbnN1cmVKb2JDb21wbGV0ZWQgPSBhc3luYyAoam9iSWQ6IHN0cmluZywgc3RhdHVzOiBBbm5vdGF0aW9uRW5hYmxlU3RhdHVzKSA9PiB7XG4gICAgbGV0IGlzQ29tcGxldGVkID0gZmFsc2VcbiAgICB3aGlsZSAoIWlzQ29tcGxldGVkKSB7XG4gICAgICBjb25zdCByZXM6IGFueSA9IGF3YWl0IHF1ZXJ5QW5ub3RhdGlvbkpvYlN0YXR1cyhhcHBJZCwgc3RhdHVzLCBqb2JJZClcbiAgICAgIGlzQ29tcGxldGVkID0gcmVzLmpvYl9zdGF0dXMgPT09IEpvYlN0YXR1cy5jb21wbGV0ZWRcbiAgICAgIGlmIChpc0NvbXBsZXRlZClcbiAgICAgICAgYnJlYWtcblxuICAgICAgYXdhaXQgc2xlZXAoMjAwMClcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYW5kbGVFbmFibGVBbm5vdGF0aW9uID0gYXN5bmMgKGVtYmVkZGluZ01vZGVsOiBFbWJlZGRpbmdNb2RlbENvbmZpZywgc2NvcmU/OiBudW1iZXIpID0+IHtcbiAgICBpZiAoaXNBbm5vdGF0aW9uRnVsbClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgeyBqb2JfaWQ6IGpvYklkIH06IGFueSA9IGF3YWl0IHVwZGF0ZUFubm90YXRpb25TdGF0dXMoYXBwSWQsIEFubm90YXRpb25FbmFibGVTdGF0dXMuZW5hYmxlLCBlbWJlZGRpbmdNb2RlbCwgc2NvcmUpXG4gICAgYXdhaXQgZW5zdXJlSm9iQ29tcGxldGVkKGpvYklkLCBBbm5vdGF0aW9uRW5hYmxlU3RhdHVzLmVuYWJsZSlcbiAgICBzZXRBbm5vdGF0aW9uQ29uZmlnKHByb2R1Y2UoYW5ub3RhdGlvbkNvbmZpZywgKGRyYWZ0OiBBbm5vdGF0aW9uUmVwbHlDb25maWcpID0+IHtcbiAgICAgIGRyYWZ0LmVuYWJsZWQgPSB0cnVlXG4gICAgICBkcmFmdC5lbWJlZGRpbmdfbW9kZWwgPSBlbWJlZGRpbmdNb2RlbFxuICAgICAgaWYgKCFkcmFmdC5zY29yZV90aHJlc2hvbGQpXG4gICAgICAgIGRyYWZ0LnNjb3JlX3RocmVzaG9sZCA9IEFOTk9UQVRJT05fREVGQVVMVC5zY29yZV90aHJlc2hvbGRcbiAgICB9KSlcbiAgfVxuXG4gIGNvbnN0IHNldFNjb3JlID0gKHNjb3JlOiBudW1iZXIsIGVtYmVkZGluZ01vZGVsPzogRW1iZWRkaW5nTW9kZWxDb25maWcpID0+IHtcbiAgICBzZXRBbm5vdGF0aW9uQ29uZmlnKHByb2R1Y2UoYW5ub3RhdGlvbkNvbmZpZywgKGRyYWZ0OiBBbm5vdGF0aW9uUmVwbHlDb25maWcpID0+IHtcbiAgICAgIGRyYWZ0LnNjb3JlX3RocmVzaG9sZCA9IHNjb3JlXG4gICAgICBpZiAoZW1iZWRkaW5nTW9kZWwpXG4gICAgICAgIGRyYWZ0LmVtYmVkZGluZ19tb2RlbCA9IGVtYmVkZGluZ01vZGVsXG4gICAgfSkpXG4gIH1cblxuICBjb25zdCBoYW5kbGVEaXNhYmxlQW5ub3RhdGlvbiA9IGFzeW5jIChlbWJlZGRpbmdNb2RlbDogRW1iZWRkaW5nTW9kZWxDb25maWcpID0+IHtcbiAgICBpZiAoIWFubm90YXRpb25Db25maWcuZW5hYmxlZClcbiAgICAgIHJldHVyblxuXG4gICAgYXdhaXQgdXBkYXRlQW5ub3RhdGlvblN0YXR1cyhhcHBJZCwgQW5ub3RhdGlvbkVuYWJsZVN0YXR1cy5kaXNhYmxlLCBlbWJlZGRpbmdNb2RlbClcbiAgICBzZXRBbm5vdGF0aW9uQ29uZmlnKHByb2R1Y2UoYW5ub3RhdGlvbkNvbmZpZywgKGRyYWZ0OiBBbm5vdGF0aW9uUmVwbHlDb25maWcpID0+IHtcbiAgICAgIGRyYWZ0LmVuYWJsZWQgPSBmYWxzZVxuICAgIH0pKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVFbmFibGVBbm5vdGF0aW9uLFxuICAgIGhhbmRsZURpc2FibGVBbm5vdGF0aW9uLFxuICAgIGlzU2hvd0Fubm90YXRpb25Db25maWdJbml0LFxuICAgIHNldElzU2hvd0Fubm90YXRpb25Db25maWdJbml0LFxuICAgIGlzU2hvd0Fubm90YXRpb25GdWxsTW9kYWwsXG4gICAgc2V0SXNTaG93QW5ub3RhdGlvbkZ1bGxNb2RhbCxcbiAgICBzZXRTY29yZSxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VBbm5vdGF0aW9uQ29uZmlnXG4iXX0=