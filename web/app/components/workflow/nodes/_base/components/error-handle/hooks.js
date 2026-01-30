"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorHandle = exports.useDefaultValue = void 0;
const react_1 = require("react");
const hooks_1 = require("@/app/components/workflow/hooks");
const types_1 = require("./types");
const utils_1 = require("./utils");
const useDefaultValue = (id) => {
    const { handleNodeDataUpdateWithSyncDraft } = (0, hooks_1.useNodeDataUpdate)();
    const handleFormChange = (0, react_1.useCallback)(({ key, value, type, }, data) => {
        const default_value = data.default_value || [];
        const index = default_value.findIndex(form => form.key === key);
        if (index > -1) {
            const newDefaultValue = [...default_value];
            newDefaultValue[index].value = value;
            handleNodeDataUpdateWithSyncDraft({
                id,
                data: {
                    default_value: newDefaultValue,
                },
            });
            return;
        }
        handleNodeDataUpdateWithSyncDraft({
            id,
            data: {
                default_value: [
                    ...default_value,
                    {
                        key,
                        value,
                        type,
                    },
                ],
            },
        });
    }, [handleNodeDataUpdateWithSyncDraft, id]);
    return {
        handleFormChange,
    };
};
exports.useDefaultValue = useDefaultValue;
const useErrorHandle = (id, data) => {
    const initCollapsed = (0, react_1.useMemo)(() => {
        if (data.error_strategy === types_1.ErrorHandleTypeEnum.none)
            return true;
        return false;
    }, [data.error_strategy]);
    const [collapsed, setCollapsed] = (0, react_1.useState)(initCollapsed);
    const { handleNodeDataUpdateWithSyncDraft } = (0, hooks_1.useNodeDataUpdate)();
    const { handleEdgeDeleteByDeleteBranch } = (0, hooks_1.useEdgesInteractions)();
    const handleErrorHandleTypeChange = (0, react_1.useCallback)((value, data) => {
        if (data.error_strategy === value)
            return;
        if (value === types_1.ErrorHandleTypeEnum.none) {
            handleNodeDataUpdateWithSyncDraft({
                id,
                data: {
                    error_strategy: undefined,
                    default_value: undefined,
                },
            });
            setCollapsed(true);
            handleEdgeDeleteByDeleteBranch(id, types_1.ErrorHandleTypeEnum.failBranch);
        }
        if (value === types_1.ErrorHandleTypeEnum.failBranch) {
            handleNodeDataUpdateWithSyncDraft({
                id,
                data: {
                    error_strategy: value,
                    default_value: undefined,
                },
            });
            setCollapsed(false);
        }
        if (value === types_1.ErrorHandleTypeEnum.defaultValue) {
            handleNodeDataUpdateWithSyncDraft({
                id,
                data: {
                    error_strategy: value,
                    default_value: (0, utils_1.getDefaultValue)(data),
                },
            });
            setCollapsed(false);
            handleEdgeDeleteByDeleteBranch(id, types_1.ErrorHandleTypeEnum.failBranch);
        }
    }, [id, handleNodeDataUpdateWithSyncDraft, handleEdgeDeleteByDeleteBranch]);
    return {
        collapsed,
        setCollapsed,
        handleErrorHandleTypeChange,
    };
};
exports.useErrorHandle = useErrorHandle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSxpQ0FJYztBQUNkLDJEQUd3QztBQUN4QyxtQ0FBNkM7QUFDN0MsbUNBQXlDO0FBRWxDLE1BQU0sZUFBZSxHQUFHLENBQzdCLEVBQVUsRUFDVixFQUFFO0lBQ0YsTUFBTSxFQUFFLGlDQUFpQyxFQUFFLEdBQUcsSUFBQSx5QkFBaUIsR0FBRSxDQUFBO0lBQ2pFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQ25DLEVBQ0UsR0FBRyxFQUNILEtBQUssRUFDTCxJQUFJLEdBQ2EsRUFDbkIsSUFBb0IsRUFDcEIsRUFBRTtRQUNGLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFBO1FBQzlDLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFBO1FBRS9ELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDZixNQUFNLGVBQWUsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUE7WUFDMUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7WUFDcEMsaUNBQWlDLENBQUM7Z0JBQ2hDLEVBQUU7Z0JBQ0YsSUFBSSxFQUFFO29CQUNKLGFBQWEsRUFBRSxlQUFlO2lCQUMvQjthQUNGLENBQUMsQ0FBQTtZQUNGLE9BQU07UUFDUixDQUFDO1FBRUQsaUNBQWlDLENBQUM7WUFDaEMsRUFBRTtZQUNGLElBQUksRUFBRTtnQkFDSixhQUFhLEVBQUU7b0JBQ2IsR0FBRyxhQUFhO29CQUNoQjt3QkFDRSxHQUFHO3dCQUNILEtBQUs7d0JBQ0wsSUFBSTtxQkFDTDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsaUNBQWlDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUUzQyxPQUFPO1FBQ0wsZ0JBQWdCO0tBQ2pCLENBQUE7QUFDSCxDQUFDLENBQUE7QUE3Q1ksUUFBQSxlQUFlLG1CQTZDM0I7QUFFTSxNQUFNLGNBQWMsR0FBRyxDQUM1QixFQUFVLEVBQ1YsSUFBb0IsRUFDcEIsRUFBRTtJQUNGLE1BQU0sYUFBYSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUNqQyxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssMkJBQW1CLENBQUMsSUFBSTtZQUNsRCxPQUFPLElBQUksQ0FBQTtRQUViLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7SUFDekIsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsYUFBYSxDQUFDLENBQUE7SUFDekQsTUFBTSxFQUFFLGlDQUFpQyxFQUFFLEdBQUcsSUFBQSx5QkFBaUIsR0FBRSxDQUFBO0lBQ2pFLE1BQU0sRUFBRSw4QkFBOEIsRUFBRSxHQUFHLElBQUEsNEJBQW9CLEdBQUUsQ0FBQTtJQUVqRSxNQUFNLDJCQUEyQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLEtBQTBCLEVBQUUsSUFBb0IsRUFBRSxFQUFFO1FBQ25HLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxLQUFLO1lBQy9CLE9BQU07UUFFUixJQUFJLEtBQUssS0FBSywyQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QyxpQ0FBaUMsQ0FBQztnQkFDaEMsRUFBRTtnQkFDRixJQUFJLEVBQUU7b0JBQ0osY0FBYyxFQUFFLFNBQVM7b0JBQ3pCLGFBQWEsRUFBRSxTQUFTO2lCQUN6QjthQUNGLENBQUMsQ0FBQTtZQUNGLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNsQiw4QkFBOEIsQ0FBQyxFQUFFLEVBQUUsMkJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDcEUsQ0FBQztRQUVELElBQUksS0FBSyxLQUFLLDJCQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzdDLGlDQUFpQyxDQUFDO2dCQUNoQyxFQUFFO2dCQUNGLElBQUksRUFBRTtvQkFDSixjQUFjLEVBQUUsS0FBSztvQkFDckIsYUFBYSxFQUFFLFNBQVM7aUJBQ3pCO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3JCLENBQUM7UUFFRCxJQUFJLEtBQUssS0FBSywyQkFBbUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUMvQyxpQ0FBaUMsQ0FBQztnQkFDaEMsRUFBRTtnQkFDRixJQUFJLEVBQUU7b0JBQ0osY0FBYyxFQUFFLEtBQUs7b0JBQ3JCLGFBQWEsRUFBRSxJQUFBLHVCQUFlLEVBQUMsSUFBSSxDQUFDO2lCQUNyQzthQUNGLENBQUMsQ0FBQTtZQUNGLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNuQiw4QkFBOEIsQ0FBQyxFQUFFLEVBQUUsMkJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDcEUsQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxpQ0FBaUMsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDLENBQUE7SUFFM0UsT0FBTztRQUNMLFNBQVM7UUFDVCxZQUFZO1FBQ1osMkJBQTJCO0tBQzVCLENBQUE7QUFDSCxDQUFDLENBQUE7QUEzRFksUUFBQSxjQUFjLGtCQTJEMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IERlZmF1bHRWYWx1ZUZvcm0gfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUge1xuICBDb21tb25Ob2RlVHlwZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxuICB1c2VNZW1vLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICB1c2VFZGdlc0ludGVyYWN0aW9ucyxcbiAgdXNlTm9kZURhdGFVcGRhdGUsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MnXG5pbXBvcnQgeyBFcnJvckhhbmRsZVR5cGVFbnVtIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGdldERlZmF1bHRWYWx1ZSB9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBjb25zdCB1c2VEZWZhdWx0VmFsdWUgPSAoXG4gIGlkOiBzdHJpbmcsXG4pID0+IHtcbiAgY29uc3QgeyBoYW5kbGVOb2RlRGF0YVVwZGF0ZVdpdGhTeW5jRHJhZnQgfSA9IHVzZU5vZGVEYXRhVXBkYXRlKClcbiAgY29uc3QgaGFuZGxlRm9ybUNoYW5nZSA9IHVzZUNhbGxiYWNrKChcbiAgICB7XG4gICAgICBrZXksXG4gICAgICB2YWx1ZSxcbiAgICAgIHR5cGUsXG4gICAgfTogRGVmYXVsdFZhbHVlRm9ybSxcbiAgICBkYXRhOiBDb21tb25Ob2RlVHlwZSxcbiAgKSA9PiB7XG4gICAgY29uc3QgZGVmYXVsdF92YWx1ZSA9IGRhdGEuZGVmYXVsdF92YWx1ZSB8fCBbXVxuICAgIGNvbnN0IGluZGV4ID0gZGVmYXVsdF92YWx1ZS5maW5kSW5kZXgoZm9ybSA9PiBmb3JtLmtleSA9PT0ga2V5KVxuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGNvbnN0IG5ld0RlZmF1bHRWYWx1ZSA9IFsuLi5kZWZhdWx0X3ZhbHVlXVxuICAgICAgbmV3RGVmYXVsdFZhbHVlW2luZGV4XS52YWx1ZSA9IHZhbHVlXG4gICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZVdpdGhTeW5jRHJhZnQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRlZmF1bHRfdmFsdWU6IG5ld0RlZmF1bHRWYWx1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZVdpdGhTeW5jRHJhZnQoe1xuICAgICAgaWQsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGRlZmF1bHRfdmFsdWU6IFtcbiAgICAgICAgICAuLi5kZWZhdWx0X3ZhbHVlLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0LCBpZF0pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVGb3JtQ2hhbmdlLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VFcnJvckhhbmRsZSA9IChcbiAgaWQ6IHN0cmluZyxcbiAgZGF0YTogQ29tbW9uTm9kZVR5cGUsXG4pID0+IHtcbiAgY29uc3QgaW5pdENvbGxhcHNlZCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChkYXRhLmVycm9yX3N0cmF0ZWd5ID09PSBFcnJvckhhbmRsZVR5cGVFbnVtLm5vbmUpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sIFtkYXRhLmVycm9yX3N0cmF0ZWd5XSlcbiAgY29uc3QgW2NvbGxhcHNlZCwgc2V0Q29sbGFwc2VkXSA9IHVzZVN0YXRlKGluaXRDb2xsYXBzZWQpXG4gIGNvbnN0IHsgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0IH0gPSB1c2VOb2RlRGF0YVVwZGF0ZSgpXG4gIGNvbnN0IHsgaGFuZGxlRWRnZURlbGV0ZUJ5RGVsZXRlQnJhbmNoIH0gPSB1c2VFZGdlc0ludGVyYWN0aW9ucygpXG5cbiAgY29uc3QgaGFuZGxlRXJyb3JIYW5kbGVUeXBlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHZhbHVlOiBFcnJvckhhbmRsZVR5cGVFbnVtLCBkYXRhOiBDb21tb25Ob2RlVHlwZSkgPT4ge1xuICAgIGlmIChkYXRhLmVycm9yX3N0cmF0ZWd5ID09PSB2YWx1ZSlcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKHZhbHVlID09PSBFcnJvckhhbmRsZVR5cGVFbnVtLm5vbmUpIHtcbiAgICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlV2l0aFN5bmNEcmFmdCh7XG4gICAgICAgIGlkLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3Jfc3RyYXRlZ3k6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkZWZhdWx0X3ZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgc2V0Q29sbGFwc2VkKHRydWUpXG4gICAgICBoYW5kbGVFZGdlRGVsZXRlQnlEZWxldGVCcmFuY2goaWQsIEVycm9ySGFuZGxlVHlwZUVudW0uZmFpbEJyYW5jaClcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IEVycm9ySGFuZGxlVHlwZUVudW0uZmFpbEJyYW5jaCkge1xuICAgICAgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlcnJvcl9zdHJhdGVneTogdmFsdWUsXG4gICAgICAgICAgZGVmYXVsdF92YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIHNldENvbGxhcHNlZChmYWxzZSlcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IEVycm9ySGFuZGxlVHlwZUVudW0uZGVmYXVsdFZhbHVlKSB7XG4gICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZVdpdGhTeW5jRHJhZnQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yX3N0cmF0ZWd5OiB2YWx1ZSxcbiAgICAgICAgICBkZWZhdWx0X3ZhbHVlOiBnZXREZWZhdWx0VmFsdWUoZGF0YSksXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgc2V0Q29sbGFwc2VkKGZhbHNlKVxuICAgICAgaGFuZGxlRWRnZURlbGV0ZUJ5RGVsZXRlQnJhbmNoKGlkLCBFcnJvckhhbmRsZVR5cGVFbnVtLmZhaWxCcmFuY2gpXG4gICAgfVxuICB9LCBbaWQsIGhhbmRsZU5vZGVEYXRhVXBkYXRlV2l0aFN5bmNEcmFmdCwgaGFuZGxlRWRnZURlbGV0ZUJ5RGVsZXRlQnJhbmNoXSlcblxuICByZXR1cm4ge1xuICAgIGNvbGxhcHNlZCxcbiAgICBzZXRDb2xsYXBzZWQsXG4gICAgaGFuZGxlRXJyb3JIYW5kbGVUeXBlQ2hhbmdlLFxuICB9XG59XG4iXX0=