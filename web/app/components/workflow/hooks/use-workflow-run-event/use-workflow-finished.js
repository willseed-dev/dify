"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowFinished = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const utils_1 = require("@/app/components/base/file-uploader/utils");
const store_1 = require("@/app/components/workflow/store");
const useWorkflowFinished = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowFinished = (0, react_1.useCallback)((params) => {
        const { data } = params;
        const { workflowRunningData, setWorkflowRunningData, } = workflowStore.getState();
        const isStringOutput = data.outputs && Object.keys(data.outputs).length === 1 && typeof data.outputs[Object.keys(data.outputs)[0]] === 'string';
        setWorkflowRunningData((0, immer_1.produce)(workflowRunningData, (draft) => {
            draft.result = {
                ...draft.result,
                ...data,
                files: (0, utils_1.getFilesInLogs)(data.outputs),
            };
            if (isStringOutput) {
                draft.resultTabActive = true;
                draft.resultText = data.outputs[Object.keys(data.outputs)[0]];
            }
        }));
    }, [workflowStore]);
    return {
        handleWorkflowFinished,
    };
};
exports.useWorkflowFinished = useWorkflowFinished;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LWZpbmlzaGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXdvcmtmbG93LWZpbmlzaGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUErQjtBQUMvQixpQ0FBbUM7QUFDbkMscUVBQTBFO0FBQzFFLDJEQUFrRTtBQUUzRCxNQUFNLG1CQUFtQixHQUFHLEdBQUcsRUFBRTtJQUN0QyxNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFFeEMsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxNQUFnQyxFQUFFLEVBQUU7UUFDOUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQTtRQUN2QixNQUFNLEVBQ0osbUJBQW1CLEVBQ25CLHNCQUFzQixHQUN2QixHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUU1QixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFBO1FBRS9JLHNCQUFzQixDQUFDLElBQUEsZUFBTyxFQUFDLG1CQUFvQixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDN0QsS0FBSyxDQUFDLE1BQU0sR0FBRztnQkFDYixHQUFHLEtBQUssQ0FBQyxNQUFNO2dCQUNmLEdBQUcsSUFBSTtnQkFDUCxLQUFLLEVBQUUsSUFBQSxzQkFBYyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDN0IsQ0FBQTtZQUNSLElBQUksY0FBYyxFQUFFLENBQUM7Z0JBQ25CLEtBQUssQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFBO2dCQUM1QixLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFbkIsT0FBTztRQUNMLHNCQUFzQjtLQUN2QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBNUJZLFFBQUEsbUJBQW1CLHVCQTRCL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFdvcmtmbG93RmluaXNoZWRSZXNwb25zZSB9IGZyb20gJ0AvdHlwZXMvd29ya2Zsb3cnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZ2V0RmlsZXNJbkxvZ3MgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci91dGlscydcbmltcG9ydCB7IHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuXG5leHBvcnQgY29uc3QgdXNlV29ya2Zsb3dGaW5pc2hlZCA9ICgpID0+IHtcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuXG4gIGNvbnN0IGhhbmRsZVdvcmtmbG93RmluaXNoZWQgPSB1c2VDYWxsYmFjaygocGFyYW1zOiBXb3JrZmxvd0ZpbmlzaGVkUmVzcG9uc2UpID0+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHBhcmFtc1xuICAgIGNvbnN0IHtcbiAgICAgIHdvcmtmbG93UnVubmluZ0RhdGEsXG4gICAgICBzZXRXb3JrZmxvd1J1bm5pbmdEYXRhLFxuICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcblxuICAgIGNvbnN0IGlzU3RyaW5nT3V0cHV0ID0gZGF0YS5vdXRwdXRzICYmIE9iamVjdC5rZXlzKGRhdGEub3V0cHV0cykubGVuZ3RoID09PSAxICYmIHR5cGVvZiBkYXRhLm91dHB1dHNbT2JqZWN0LmtleXMoZGF0YS5vdXRwdXRzKVswXV0gPT09ICdzdHJpbmcnXG5cbiAgICBzZXRXb3JrZmxvd1J1bm5pbmdEYXRhKHByb2R1Y2Uod29ya2Zsb3dSdW5uaW5nRGF0YSEsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQucmVzdWx0ID0ge1xuICAgICAgICAuLi5kcmFmdC5yZXN1bHQsXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIGZpbGVzOiBnZXRGaWxlc0luTG9ncyhkYXRhLm91dHB1dHMpLFxuICAgICAgfSBhcyBhbnlcbiAgICAgIGlmIChpc1N0cmluZ091dHB1dCkge1xuICAgICAgICBkcmFmdC5yZXN1bHRUYWJBY3RpdmUgPSB0cnVlXG4gICAgICAgIGRyYWZ0LnJlc3VsdFRleHQgPSBkYXRhLm91dHB1dHNbT2JqZWN0LmtleXMoZGF0YS5vdXRwdXRzKVswXV1cbiAgICAgIH1cbiAgICB9KSlcbiAgfSwgW3dvcmtmbG93U3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlV29ya2Zsb3dGaW5pc2hlZCxcbiAgfVxufVxuIl19