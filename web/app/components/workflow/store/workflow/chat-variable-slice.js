"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatVariableSlice = void 0;
const createChatVariableSlice = (set) => {
    const hideAllPanel = {
        showDebugAndPreviewPanel: false,
        showEnvPanel: false,
        showChatVariablePanel: false,
        showGlobalVariablePanel: false,
    };
    return ({
        showChatVariablePanel: false,
        setShowChatVariablePanel: showChatVariablePanel => set(() => {
            if (showChatVariablePanel)
                return { ...hideAllPanel, showChatVariablePanel: true };
            else
                return { showChatVariablePanel: false };
        }),
        showGlobalVariablePanel: false,
        setShowGlobalVariablePanel: showGlobalVariablePanel => set(() => {
            if (showGlobalVariablePanel)
                return { ...hideAllPanel, showGlobalVariablePanel: true };
            else
                return { showGlobalVariablePanel: false };
        }),
        conversationVariables: [],
        setConversationVariables: conversationVariables => set(() => ({ conversationVariables })),
    });
};
exports.createChatVariableSlice = createChatVariableSlice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC12YXJpYWJsZS1zbGljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNoYXQtdmFyaWFibGUtc2xpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBWU8sTUFBTSx1QkFBdUIsR0FBeUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNuRixNQUFNLFlBQVksR0FBRztRQUNuQix3QkFBd0IsRUFBRSxLQUFLO1FBQy9CLFlBQVksRUFBRSxLQUFLO1FBQ25CLHFCQUFxQixFQUFFLEtBQUs7UUFDNUIsdUJBQXVCLEVBQUUsS0FBSztLQUMvQixDQUFBO0lBRUQsT0FBTyxDQUFDO1FBQ04scUJBQXFCLEVBQUUsS0FBSztRQUM1Qix3QkFBd0IsRUFBRSxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUMxRCxJQUFJLHFCQUFxQjtnQkFDdkIsT0FBTyxFQUFFLEdBQUcsWUFBWSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxDQUFBOztnQkFFdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLEtBQUssRUFBRSxDQUFBO1FBQzNDLENBQUMsQ0FBQztRQUNGLHVCQUF1QixFQUFFLEtBQUs7UUFDOUIsMEJBQTBCLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDOUQsSUFBSSx1QkFBdUI7Z0JBQ3pCLE9BQU8sRUFBRSxHQUFHLFlBQVksRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsQ0FBQTs7Z0JBRXpELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsQ0FBQTtRQUM3QyxDQUFDLENBQUM7UUFDRixxQkFBcUIsRUFBRSxFQUFFO1FBQ3pCLHdCQUF3QixFQUFFLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLHFCQUFxQixFQUFFLENBQUMsQ0FBQztLQUMxRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUExQlksUUFBQSx1QkFBdUIsMkJBMEJuQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU3RhdGVDcmVhdG9yIH0gZnJvbSAnenVzdGFuZCdcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uVmFyaWFibGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG5leHBvcnQgdHlwZSBDaGF0VmFyaWFibGVTbGljZVNoYXBlID0ge1xuICBzaG93Q2hhdFZhcmlhYmxlUGFuZWw6IGJvb2xlYW5cbiAgc2V0U2hvd0NoYXRWYXJpYWJsZVBhbmVsOiAoc2hvd0NoYXRWYXJpYWJsZVBhbmVsOiBib29sZWFuKSA9PiB2b2lkXG4gIHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiBib29sZWFuXG4gIHNldFNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiAoc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWw6IGJvb2xlYW4pID0+IHZvaWRcbiAgY29udmVyc2F0aW9uVmFyaWFibGVzOiBDb252ZXJzYXRpb25WYXJpYWJsZVtdXG4gIHNldENvbnZlcnNhdGlvblZhcmlhYmxlczogKGNvbnZlcnNhdGlvblZhcmlhYmxlczogQ29udmVyc2F0aW9uVmFyaWFibGVbXSkgPT4gdm9pZFxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlQ2hhdFZhcmlhYmxlU2xpY2U6IFN0YXRlQ3JlYXRvcjxDaGF0VmFyaWFibGVTbGljZVNoYXBlPiA9IChzZXQpID0+IHtcbiAgY29uc3QgaGlkZUFsbFBhbmVsID0ge1xuICAgIHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbDogZmFsc2UsXG4gICAgc2hvd0VudlBhbmVsOiBmYWxzZSxcbiAgICBzaG93Q2hhdFZhcmlhYmxlUGFuZWw6IGZhbHNlLFxuICAgIHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiBmYWxzZSxcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIHNob3dDaGF0VmFyaWFibGVQYW5lbDogZmFsc2UsXG4gICAgc2V0U2hvd0NoYXRWYXJpYWJsZVBhbmVsOiBzaG93Q2hhdFZhcmlhYmxlUGFuZWwgPT4gc2V0KCgpID0+IHtcbiAgICAgIGlmIChzaG93Q2hhdFZhcmlhYmxlUGFuZWwpXG4gICAgICAgIHJldHVybiB7IC4uLmhpZGVBbGxQYW5lbCwgc2hvd0NoYXRWYXJpYWJsZVBhbmVsOiB0cnVlIH1cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHsgc2hvd0NoYXRWYXJpYWJsZVBhbmVsOiBmYWxzZSB9XG4gICAgfSksXG4gICAgc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWw6IGZhbHNlLFxuICAgIHNldFNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiBzaG93R2xvYmFsVmFyaWFibGVQYW5lbCA9PiBzZXQoKCkgPT4ge1xuICAgICAgaWYgKHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsKVxuICAgICAgICByZXR1cm4geyAuLi5oaWRlQWxsUGFuZWwsIHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiB0cnVlIH1cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHsgc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWw6IGZhbHNlIH1cbiAgICB9KSxcbiAgICBjb252ZXJzYXRpb25WYXJpYWJsZXM6IFtdLFxuICAgIHNldENvbnZlcnNhdGlvblZhcmlhYmxlczogY29udmVyc2F0aW9uVmFyaWFibGVzID0+IHNldCgoKSA9PiAoeyBjb252ZXJzYXRpb25WYXJpYWJsZXMgfSkpLFxuICB9KVxufVxuIl19