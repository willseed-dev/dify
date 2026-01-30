"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const hooks_1 = require("@/app/components/workflow/hooks");
const use_node_crud_1 = require("@/app/components/workflow/nodes/_base/hooks/use-node-crud");
const app_context_1 = require("@/context/app-context");
const constants_1 = require("./constants");
const useConfig = (id, payload) => {
    const { nodesReadOnly: readOnly } = (0, hooks_1.useNodesReadOnly)();
    const { userProfile } = (0, app_context_1.useAppContext)();
    const frontendPayload = (0, react_1.useMemo)(() => {
        return {
            ...payload,
            mode: payload.mode || 'visual',
            frequency: payload.frequency || 'daily',
            timezone: payload.timezone || userProfile.timezone || 'UTC',
            visual_config: {
                ...(0, constants_1.getDefaultVisualConfig)(),
                ...payload.visual_config,
            },
        };
    }, [payload, userProfile.timezone]);
    const { inputs, setInputs } = (0, use_node_crud_1.default)(id, frontendPayload);
    const handleModeChange = (0, react_1.useCallback)((mode) => {
        const newInputs = {
            ...inputs,
            mode,
        };
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const handleFrequencyChange = (0, react_1.useCallback)((frequency) => {
        const newInputs = {
            ...inputs,
            frequency,
            visual_config: {
                ...inputs.visual_config,
                ...(frequency === 'hourly') && {
                    on_minute: inputs.visual_config?.on_minute ?? 0,
                },
            },
            cron_expression: undefined,
        };
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const handleCronExpressionChange = (0, react_1.useCallback)((value) => {
        const newInputs = {
            ...inputs,
            cron_expression: value,
            frequency: undefined,
            visual_config: undefined,
        };
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const handleWeekdaysChange = (0, react_1.useCallback)((weekdays) => {
        const newInputs = {
            ...inputs,
            visual_config: {
                ...inputs.visual_config,
                weekdays,
            },
            cron_expression: undefined,
        };
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const handleTimeChange = (0, react_1.useCallback)((time) => {
        const newInputs = {
            ...inputs,
            visual_config: {
                ...inputs.visual_config,
                time,
            },
            cron_expression: undefined,
        };
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const handleOnMinuteChange = (0, react_1.useCallback)((on_minute) => {
        const newInputs = {
            ...inputs,
            visual_config: {
                ...inputs.visual_config,
                on_minute,
            },
            cron_expression: undefined,
        };
        setInputs(newInputs);
    }, [inputs, setInputs]);
    return {
        readOnly,
        inputs,
        setInputs,
        handleModeChange,
        handleFrequencyChange,
        handleCronExpressionChange,
        handleWeekdaysChange,
        handleTimeChange,
        handleOnMinuteChange,
    };
};
exports.default = useConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBNEM7QUFDNUMsMkRBQWtFO0FBQ2xFLDZGQUFtRjtBQUNuRix1REFBcUQ7QUFDckQsMkNBQW9EO0FBRXBELE1BQU0sU0FBUyxHQUFHLENBQUMsRUFBVSxFQUFFLE9BQWdDLEVBQUUsRUFBRTtJQUNqRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUV0RCxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBQSwyQkFBYSxHQUFFLENBQUE7SUFFdkMsTUFBTSxlQUFlLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ25DLE9BQU87WUFDTCxHQUFHLE9BQU87WUFDVixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRO1lBQzlCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU87WUFDdkMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLFFBQVEsSUFBSSxLQUFLO1lBQzNELGFBQWEsRUFBRTtnQkFDYixHQUFHLElBQUEsa0NBQXNCLEdBQUU7Z0JBQzNCLEdBQUcsT0FBTyxDQUFDLGFBQWE7YUFDekI7U0FDRixDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRW5DLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSx1QkFBVyxFQUEwQixFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUE7SUFFdkYsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxJQUFrQixFQUFFLEVBQUU7UUFDMUQsTUFBTSxTQUFTLEdBQUc7WUFDaEIsR0FBRyxNQUFNO1lBQ1QsSUFBSTtTQUNMLENBQUE7UUFDRCxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFdkIsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxTQUE0QixFQUFFLEVBQUU7UUFDekUsTUFBTSxTQUFTLEdBQUc7WUFDaEIsR0FBRyxNQUFNO1lBQ1QsU0FBUztZQUNULGFBQWEsRUFBRTtnQkFDYixHQUFHLE1BQU0sQ0FBQyxhQUFhO2dCQUN2QixHQUFHLENBQUMsU0FBUyxLQUFLLFFBQVEsQ0FBQyxJQUFJO29CQUM3QixTQUFTLEVBQUUsTUFBTSxDQUFDLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQztpQkFDaEQ7YUFDRjtZQUNELGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUE7UUFDRCxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFdkIsTUFBTSwwQkFBMEIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxLQUFhLEVBQUUsRUFBRTtRQUMvRCxNQUFNLFNBQVMsR0FBRztZQUNoQixHQUFHLE1BQU07WUFDVCxlQUFlLEVBQUUsS0FBSztZQUN0QixTQUFTLEVBQUUsU0FBUztZQUNwQixhQUFhLEVBQUUsU0FBUztTQUN6QixDQUFBO1FBQ0QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3RCLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBRXZCLE1BQU0sb0JBQW9CLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsUUFBa0IsRUFBRSxFQUFFO1FBQzlELE1BQU0sU0FBUyxHQUFHO1lBQ2hCLEdBQUcsTUFBTTtZQUNULGFBQWEsRUFBRTtnQkFDYixHQUFHLE1BQU0sQ0FBQyxhQUFhO2dCQUN2QixRQUFRO2FBQ1Q7WUFDRCxlQUFlLEVBQUUsU0FBUztTQUMzQixDQUFBO1FBQ0QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3RCLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBRXZCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDcEQsTUFBTSxTQUFTLEdBQUc7WUFDaEIsR0FBRyxNQUFNO1lBQ1QsYUFBYSxFQUFFO2dCQUNiLEdBQUcsTUFBTSxDQUFDLGFBQWE7Z0JBQ3ZCLElBQUk7YUFDTDtZQUNELGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUE7UUFDRCxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFdkIsTUFBTSxvQkFBb0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxTQUFpQixFQUFFLEVBQUU7UUFDN0QsTUFBTSxTQUFTLEdBQUc7WUFDaEIsR0FBRyxNQUFNO1lBQ1QsYUFBYSxFQUFFO2dCQUNiLEdBQUcsTUFBTSxDQUFDLGFBQWE7Z0JBQ3ZCLFNBQVM7YUFDVjtZQUNELGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUE7UUFDRCxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFdkIsT0FBTztRQUNMLFFBQVE7UUFDUixNQUFNO1FBQ04sU0FBUztRQUNULGdCQUFnQjtRQUNoQixxQkFBcUI7UUFDckIsMEJBQTBCO1FBQzFCLG9CQUFvQjtRQUNwQixnQkFBZ0I7UUFDaEIsb0JBQW9CO0tBQ3JCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNjaGVkdWxlRnJlcXVlbmN5LCBTY2hlZHVsZU1vZGUsIFNjaGVkdWxlVHJpZ2dlck5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VOb2Rlc1JlYWRPbmx5IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcbmltcG9ydCB1c2VOb2RlQ3J1ZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL19iYXNlL2hvb2tzL3VzZS1ub2RlLWNydWQnXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgZ2V0RGVmYXVsdFZpc3VhbENvbmZpZyB9IGZyb20gJy4vY29uc3RhbnRzJ1xuXG5jb25zdCB1c2VDb25maWcgPSAoaWQ6IHN0cmluZywgcGF5bG9hZDogU2NoZWR1bGVUcmlnZ2VyTm9kZVR5cGUpID0+IHtcbiAgY29uc3QgeyBub2Rlc1JlYWRPbmx5OiByZWFkT25seSB9ID0gdXNlTm9kZXNSZWFkT25seSgpXG5cbiAgY29uc3QgeyB1c2VyUHJvZmlsZSB9ID0gdXNlQXBwQ29udGV4dCgpXG5cbiAgY29uc3QgZnJvbnRlbmRQYXlsb2FkID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnBheWxvYWQsXG4gICAgICBtb2RlOiBwYXlsb2FkLm1vZGUgfHwgJ3Zpc3VhbCcsXG4gICAgICBmcmVxdWVuY3k6IHBheWxvYWQuZnJlcXVlbmN5IHx8ICdkYWlseScsXG4gICAgICB0aW1lem9uZTogcGF5bG9hZC50aW1lem9uZSB8fCB1c2VyUHJvZmlsZS50aW1lem9uZSB8fCAnVVRDJyxcbiAgICAgIHZpc3VhbF9jb25maWc6IHtcbiAgICAgICAgLi4uZ2V0RGVmYXVsdFZpc3VhbENvbmZpZygpLFxuICAgICAgICAuLi5wYXlsb2FkLnZpc3VhbF9jb25maWcsXG4gICAgICB9LFxuICAgIH1cbiAgfSwgW3BheWxvYWQsIHVzZXJQcm9maWxlLnRpbWV6b25lXSlcblxuICBjb25zdCB7IGlucHV0cywgc2V0SW5wdXRzIH0gPSB1c2VOb2RlQ3J1ZDxTY2hlZHVsZVRyaWdnZXJOb2RlVHlwZT4oaWQsIGZyb250ZW5kUGF5bG9hZClcblxuICBjb25zdCBoYW5kbGVNb2RlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKG1vZGU6IFNjaGVkdWxlTW9kZSkgPT4ge1xuICAgIGNvbnN0IG5ld0lucHV0cyA9IHtcbiAgICAgIC4uLmlucHV0cyxcbiAgICAgIG1vZGUsXG4gICAgfVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtpbnB1dHMsIHNldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlRnJlcXVlbmN5Q2hhbmdlID0gdXNlQ2FsbGJhY2soKGZyZXF1ZW5jeTogU2NoZWR1bGVGcmVxdWVuY3kpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSB7XG4gICAgICAuLi5pbnB1dHMsXG4gICAgICBmcmVxdWVuY3ksXG4gICAgICB2aXN1YWxfY29uZmlnOiB7XG4gICAgICAgIC4uLmlucHV0cy52aXN1YWxfY29uZmlnLFxuICAgICAgICAuLi4oZnJlcXVlbmN5ID09PSAnaG91cmx5JykgJiYge1xuICAgICAgICAgIG9uX21pbnV0ZTogaW5wdXRzLnZpc3VhbF9jb25maWc/Lm9uX21pbnV0ZSA/PyAwLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNyb25fZXhwcmVzc2lvbjogdW5kZWZpbmVkLFxuICAgIH1cbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbaW5wdXRzLCBzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZUNyb25FeHByZXNzaW9uQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSB7XG4gICAgICAuLi5pbnB1dHMsXG4gICAgICBjcm9uX2V4cHJlc3Npb246IHZhbHVlLFxuICAgICAgZnJlcXVlbmN5OiB1bmRlZmluZWQsXG4gICAgICB2aXN1YWxfY29uZmlnOiB1bmRlZmluZWQsXG4gICAgfVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtpbnB1dHMsIHNldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlV2Vla2RheXNDaGFuZ2UgPSB1c2VDYWxsYmFjaygod2Vla2RheXM6IHN0cmluZ1tdKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0ge1xuICAgICAgLi4uaW5wdXRzLFxuICAgICAgdmlzdWFsX2NvbmZpZzoge1xuICAgICAgICAuLi5pbnB1dHMudmlzdWFsX2NvbmZpZyxcbiAgICAgICAgd2Vla2RheXMsXG4gICAgICB9LFxuICAgICAgY3Jvbl9leHByZXNzaW9uOiB1bmRlZmluZWQsXG4gICAgfVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtpbnB1dHMsIHNldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlVGltZUNoYW5nZSA9IHVzZUNhbGxiYWNrKCh0aW1lOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSB7XG4gICAgICAuLi5pbnB1dHMsXG4gICAgICB2aXN1YWxfY29uZmlnOiB7XG4gICAgICAgIC4uLmlucHV0cy52aXN1YWxfY29uZmlnLFxuICAgICAgICB0aW1lLFxuICAgICAgfSxcbiAgICAgIGNyb25fZXhwcmVzc2lvbjogdW5kZWZpbmVkLFxuICAgIH1cbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbaW5wdXRzLCBzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZU9uTWludXRlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKG9uX21pbnV0ZTogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0ge1xuICAgICAgLi4uaW5wdXRzLFxuICAgICAgdmlzdWFsX2NvbmZpZzoge1xuICAgICAgICAuLi5pbnB1dHMudmlzdWFsX2NvbmZpZyxcbiAgICAgICAgb25fbWludXRlLFxuICAgICAgfSxcbiAgICAgIGNyb25fZXhwcmVzc2lvbjogdW5kZWZpbmVkLFxuICAgIH1cbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbaW5wdXRzLCBzZXRJbnB1dHNdKVxuXG4gIHJldHVybiB7XG4gICAgcmVhZE9ubHksXG4gICAgaW5wdXRzLFxuICAgIHNldElucHV0cyxcbiAgICBoYW5kbGVNb2RlQ2hhbmdlLFxuICAgIGhhbmRsZUZyZXF1ZW5jeUNoYW5nZSxcbiAgICBoYW5kbGVDcm9uRXhwcmVzc2lvbkNoYW5nZSxcbiAgICBoYW5kbGVXZWVrZGF5c0NoYW5nZSxcbiAgICBoYW5kbGVUaW1lQ2hhbmdlLFxuICAgIGhhbmRsZU9uTWludXRlQ2hhbmdlLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUNvbmZpZ1xuIl19