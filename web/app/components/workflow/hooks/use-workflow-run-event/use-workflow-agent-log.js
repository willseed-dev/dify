"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowAgentLog = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const store_1 = require("@/app/components/workflow/store");
const useWorkflowAgentLog = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowAgentLog = (0, react_1.useCallback)((params) => {
        const { data } = params;
        const { workflowRunningData, setWorkflowRunningData, } = workflowStore.getState();
        setWorkflowRunningData((0, immer_1.produce)(workflowRunningData, (draft) => {
            const currentIndex = draft.tracing.findIndex(item => item.node_id === data.node_id);
            if (currentIndex > -1) {
                const current = draft.tracing[currentIndex];
                if (current.execution_metadata) {
                    if (current.execution_metadata.agent_log) {
                        const currentLogIndex = current.execution_metadata.agent_log.findIndex(log => log.message_id === data.message_id);
                        if (currentLogIndex > -1) {
                            current.execution_metadata.agent_log[currentLogIndex] = {
                                ...current.execution_metadata.agent_log[currentLogIndex],
                                ...data,
                            };
                        }
                        else {
                            current.execution_metadata.agent_log.push(data);
                        }
                    }
                    else {
                        current.execution_metadata.agent_log = [data];
                    }
                }
                else {
                    current.execution_metadata = {
                        agent_log: [data],
                    };
                }
            }
        }));
    }, [workflowStore]);
    return {
        handleWorkflowAgentLog,
    };
};
exports.useWorkflowAgentLog = useWorkflowAgentLog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LWFnZW50LWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS13b3JrZmxvdy1hZ2VudC1sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQStCO0FBQy9CLGlDQUFtQztBQUNuQywyREFBa0U7QUFFM0QsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLEVBQUU7SUFDdEMsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBRXhDLE1BQU0sc0JBQXNCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBd0IsRUFBRSxFQUFFO1FBQ3RFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUE7UUFDdkIsTUFBTSxFQUNKLG1CQUFtQixFQUNuQixzQkFBc0IsR0FDdkIsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFNUIsc0JBQXNCLENBQUMsSUFBQSxlQUFPLEVBQUMsbUJBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUM3RCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3BGLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7Z0JBRTVDLElBQUksT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7b0JBQy9CLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUN6QyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO3dCQUNqSCxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDOzRCQUN6QixPQUFPLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxHQUFHO2dDQUN0RCxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDO2dDQUN4RCxHQUFHLElBQUk7NkJBQ1IsQ0FBQTt3QkFDSCxDQUFDOzZCQUNJLENBQUM7NEJBQ0osT0FBTyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7d0JBQ2pELENBQUM7b0JBQ0gsQ0FBQzt5QkFDSSxDQUFDO3dCQUNKLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtvQkFDL0MsQ0FBQztnQkFDSCxDQUFDO3FCQUNJLENBQUM7b0JBQ0osT0FBTyxDQUFDLGtCQUFrQixHQUFHO3dCQUMzQixTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUM7cUJBQ1gsQ0FBQTtnQkFDVixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBRW5CLE9BQU87UUFDTCxzQkFBc0I7S0FDdkIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQTVDWSxRQUFBLG1CQUFtQix1QkE0Qy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBZ2VudExvZ1Jlc3BvbnNlIH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcblxuZXhwb3J0IGNvbnN0IHVzZVdvcmtmbG93QWdlbnRMb2cgPSAoKSA9PiB7XG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcblxuICBjb25zdCBoYW5kbGVXb3JrZmxvd0FnZW50TG9nID0gdXNlQ2FsbGJhY2soKHBhcmFtczogQWdlbnRMb2dSZXNwb25zZSkgPT4ge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gcGFyYW1zXG4gICAgY29uc3Qge1xuICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YSxcbiAgICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgc2V0V29ya2Zsb3dSdW5uaW5nRGF0YShwcm9kdWNlKHdvcmtmbG93UnVubmluZ0RhdGEhLCAoZHJhZnQpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGRyYWZ0LnRyYWNpbmchLmZpbmRJbmRleChpdGVtID0+IGl0ZW0ubm9kZV9pZCA9PT0gZGF0YS5ub2RlX2lkKVxuICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IC0xKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBkcmFmdC50cmFjaW5nIVtjdXJyZW50SW5kZXhdXG5cbiAgICAgICAgaWYgKGN1cnJlbnQuZXhlY3V0aW9uX21ldGFkYXRhKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnQuZXhlY3V0aW9uX21ldGFkYXRhLmFnZW50X2xvZykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudExvZ0luZGV4ID0gY3VycmVudC5leGVjdXRpb25fbWV0YWRhdGEuYWdlbnRfbG9nLmZpbmRJbmRleChsb2cgPT4gbG9nLm1lc3NhZ2VfaWQgPT09IGRhdGEubWVzc2FnZV9pZClcbiAgICAgICAgICAgIGlmIChjdXJyZW50TG9nSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICBjdXJyZW50LmV4ZWN1dGlvbl9tZXRhZGF0YS5hZ2VudF9sb2dbY3VycmVudExvZ0luZGV4XSA9IHtcbiAgICAgICAgICAgICAgICAuLi5jdXJyZW50LmV4ZWN1dGlvbl9tZXRhZGF0YS5hZ2VudF9sb2dbY3VycmVudExvZ0luZGV4XSxcbiAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgY3VycmVudC5leGVjdXRpb25fbWV0YWRhdGEuYWdlbnRfbG9nLnB1c2goZGF0YSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50LmV4ZWN1dGlvbl9tZXRhZGF0YS5hZ2VudF9sb2cgPSBbZGF0YV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY3VycmVudC5leGVjdXRpb25fbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBhZ2VudF9sb2c6IFtkYXRhXSxcbiAgICAgICAgICB9IGFzIGFueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkpXG4gIH0sIFt3b3JrZmxvd1N0b3JlXSlcblxuICByZXR1cm4ge1xuICAgIGhhbmRsZVdvcmtmbG93QWdlbnRMb2csXG4gIH1cbn1cbiJdfQ==