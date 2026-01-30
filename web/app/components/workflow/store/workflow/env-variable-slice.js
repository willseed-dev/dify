"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnvVariableSlice = void 0;
const createEnvVariableSlice = (set) => {
    const hideAllPanel = {
        showDebugAndPreviewPanel: false,
        showEnvPanel: false,
        showChatVariablePanel: false,
        showGlobalVariablePanel: false,
    };
    return ({
        showEnvPanel: false,
        setShowEnvPanel: showEnvPanel => set(() => {
            if (showEnvPanel)
                return { ...hideAllPanel, showEnvPanel: true };
            else
                return { showEnvPanel: false };
        }),
        environmentVariables: [],
        setEnvironmentVariables: environmentVariables => set(() => ({ environmentVariables })),
        envSecrets: {},
        setEnvSecrets: envSecrets => set(() => ({ envSecrets })),
    });
};
exports.createEnvVariableSlice = createEnvVariableSlice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52LXZhcmlhYmxlLXNsaWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52LXZhcmlhYmxlLXNsaWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVlPLE1BQU0sc0JBQXNCLEdBQXdDLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDakYsTUFBTSxZQUFZLEdBQUc7UUFDbkIsd0JBQXdCLEVBQUUsS0FBSztRQUMvQixZQUFZLEVBQUUsS0FBSztRQUNuQixxQkFBcUIsRUFBRSxLQUFLO1FBQzVCLHVCQUF1QixFQUFFLEtBQUs7S0FDL0IsQ0FBQTtJQUNELE9BQU8sQ0FBQztRQUNOLFlBQVksRUFBRSxLQUFLO1FBQ25CLGVBQWUsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDeEMsSUFBSSxZQUFZO2dCQUNkLE9BQU8sRUFBRSxHQUFHLFlBQVksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUE7O2dCQUU5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFBO1FBQ2xDLENBQUMsQ0FBQztRQUNGLG9CQUFvQixFQUFFLEVBQUU7UUFDeEIsdUJBQXVCLEVBQUUsb0JBQW9CLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLFVBQVUsRUFBRSxFQUFFO1FBQ2QsYUFBYSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQ3pELENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQXBCWSxRQUFBLHNCQUFzQiwwQkFvQmxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTdGF0ZUNyZWF0b3IgfSBmcm9tICd6dXN0YW5kJ1xuaW1wb3J0IHR5cGUgeyBFbnZpcm9ubWVudFZhcmlhYmxlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcblxuZXhwb3J0IHR5cGUgRW52VmFyaWFibGVTbGljZVNoYXBlID0ge1xuICBzaG93RW52UGFuZWw6IGJvb2xlYW5cbiAgc2V0U2hvd0VudlBhbmVsOiAoc2hvd0VudlBhbmVsOiBib29sZWFuKSA9PiB2b2lkXG4gIGVudmlyb25tZW50VmFyaWFibGVzOiBFbnZpcm9ubWVudFZhcmlhYmxlW11cbiAgc2V0RW52aXJvbm1lbnRWYXJpYWJsZXM6IChlbnZpcm9ubWVudFZhcmlhYmxlczogRW52aXJvbm1lbnRWYXJpYWJsZVtdKSA9PiB2b2lkXG4gIGVudlNlY3JldHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbiAgc2V0RW52U2VjcmV0czogKGVudlNlY3JldHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHZvaWRcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVudlZhcmlhYmxlU2xpY2U6IFN0YXRlQ3JlYXRvcjxFbnZWYXJpYWJsZVNsaWNlU2hhcGU+ID0gKHNldCkgPT4ge1xuICBjb25zdCBoaWRlQWxsUGFuZWwgPSB7XG4gICAgc2hvd0RlYnVnQW5kUHJldmlld1BhbmVsOiBmYWxzZSxcbiAgICBzaG93RW52UGFuZWw6IGZhbHNlLFxuICAgIHNob3dDaGF0VmFyaWFibGVQYW5lbDogZmFsc2UsXG4gICAgc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWw6IGZhbHNlLFxuICB9XG4gIHJldHVybiAoe1xuICAgIHNob3dFbnZQYW5lbDogZmFsc2UsXG4gICAgc2V0U2hvd0VudlBhbmVsOiBzaG93RW52UGFuZWwgPT4gc2V0KCgpID0+IHtcbiAgICAgIGlmIChzaG93RW52UGFuZWwpXG4gICAgICAgIHJldHVybiB7IC4uLmhpZGVBbGxQYW5lbCwgc2hvd0VudlBhbmVsOiB0cnVlIH1cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHsgc2hvd0VudlBhbmVsOiBmYWxzZSB9XG4gICAgfSksXG4gICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IFtdLFxuICAgIHNldEVudmlyb25tZW50VmFyaWFibGVzOiBlbnZpcm9ubWVudFZhcmlhYmxlcyA9PiBzZXQoKCkgPT4gKHsgZW52aXJvbm1lbnRWYXJpYWJsZXMgfSkpLFxuICAgIGVudlNlY3JldHM6IHt9LFxuICAgIHNldEVudlNlY3JldHM6IGVudlNlY3JldHMgPT4gc2V0KCgpID0+ICh7IGVudlNlY3JldHMgfSkpLFxuICB9KVxufVxuIl19