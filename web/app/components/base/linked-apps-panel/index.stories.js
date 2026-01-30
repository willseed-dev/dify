"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mobile = exports.Desktop = void 0;
const app_1 = require("@/types/app");
const _1 = require(".");
const mockRelatedApps = [
    {
        id: 'app-cx',
        name: 'Customer Support Assistant',
        mode: app_1.AppModeEnum.CHAT,
        icon_type: 'emoji',
        icon: '\u{1F4AC}',
        icon_background: '#EEF2FF',
        icon_url: '',
    },
    {
        id: 'app-ops',
        name: 'Ops Workflow Orchestrator',
        mode: app_1.AppModeEnum.WORKFLOW,
        icon_type: 'emoji',
        icon: '\u{1F6E0}\u{FE0F}',
        icon_background: '#ECFDF3',
        icon_url: '',
    },
    {
        id: 'app-research',
        name: 'Research Synthesizer',
        mode: app_1.AppModeEnum.ADVANCED_CHAT,
        icon_type: 'emoji',
        icon: '\u{1F9E0}',
        icon_background: '#FDF2FA',
        icon_url: '',
    },
];
const meta = {
    title: 'Base/Feedback/LinkedAppsPanel',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Shows a curated list of related applications, pairing each app icon with quick navigation links.',
            },
        },
    },
    args: {
        relatedApps: mockRelatedApps,
        isMobile: false,
    },
    argTypes: {
        isMobile: {
            control: 'boolean',
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Desktop = {};
exports.Mobile = {
    args: {
        isMobile: true,
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile2',
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHFDQUF5QztBQUN6Qyx3QkFBK0I7QUFFL0IsTUFBTSxlQUFlLEdBQWlCO0lBQ3BDO1FBQ0UsRUFBRSxFQUFFLFFBQVE7UUFDWixJQUFJLEVBQUUsNEJBQTRCO1FBQ2xDLElBQUksRUFBRSxpQkFBVyxDQUFDLElBQUk7UUFDdEIsU0FBUyxFQUFFLE9BQU87UUFDbEIsSUFBSSxFQUFFLFdBQVc7UUFDakIsZUFBZSxFQUFFLFNBQVM7UUFDMUIsUUFBUSxFQUFFLEVBQUU7S0FDYjtJQUNEO1FBQ0UsRUFBRSxFQUFFLFNBQVM7UUFDYixJQUFJLEVBQUUsMkJBQTJCO1FBQ2pDLElBQUksRUFBRSxpQkFBVyxDQUFDLFFBQVE7UUFDMUIsU0FBUyxFQUFFLE9BQU87UUFDbEIsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixlQUFlLEVBQUUsU0FBUztRQUMxQixRQUFRLEVBQUUsRUFBRTtLQUNiO0lBQ0Q7UUFDRSxFQUFFLEVBQUUsY0FBYztRQUNsQixJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLElBQUksRUFBRSxpQkFBVyxDQUFDLGFBQWE7UUFDL0IsU0FBUyxFQUFFLE9BQU87UUFDbEIsSUFBSSxFQUFFLFdBQVc7UUFDakIsZUFBZSxFQUFFLFNBQVM7UUFDMUIsUUFBUSxFQUFFLEVBQUU7S0FDYjtDQUNGLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSwrQkFBK0I7SUFDdEMsU0FBUyxFQUFFLFVBQWU7SUFDMUIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxrR0FBa0c7YUFDOUc7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osV0FBVyxFQUFFLGVBQWU7UUFDNUIsUUFBUSxFQUFFLEtBQUs7S0FDaEI7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsU0FBUztTQUNuQjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ29CLENBQUE7QUFFeEMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxPQUFPLEdBQVUsRUFBRSxDQUFBO0FBRW5CLFFBQUEsTUFBTSxHQUFVO0lBQzNCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxVQUFVLEVBQUU7UUFDVixRQUFRLEVBQUU7WUFDUixlQUFlLEVBQUUsU0FBUztTQUMzQjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB0eXBlIHsgUmVsYXRlZEFwcCB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgQXBwTW9kZUVudW0gfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCBMaW5rZWRBcHBzUGFuZWwgZnJvbSAnLidcblxuY29uc3QgbW9ja1JlbGF0ZWRBcHBzOiBSZWxhdGVkQXBwW10gPSBbXG4gIHtcbiAgICBpZDogJ2FwcC1jeCcsXG4gICAgbmFtZTogJ0N1c3RvbWVyIFN1cHBvcnQgQXNzaXN0YW50JyxcbiAgICBtb2RlOiBBcHBNb2RlRW51bS5DSEFULFxuICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICBpY29uOiAnXFx1ezFGNEFDfScsXG4gICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0VFRjJGRicsXG4gICAgaWNvbl91cmw6ICcnLFxuICB9LFxuICB7XG4gICAgaWQ6ICdhcHAtb3BzJyxcbiAgICBuYW1lOiAnT3BzIFdvcmtmbG93IE9yY2hlc3RyYXRvcicsXG4gICAgbW9kZTogQXBwTW9kZUVudW0uV09SS0ZMT1csXG4gICAgaWNvbl90eXBlOiAnZW1vamknLFxuICAgIGljb246ICdcXHV7MUY2RTB9XFx1e0ZFMEZ9JyxcbiAgICBpY29uX2JhY2tncm91bmQ6ICcjRUNGREYzJyxcbiAgICBpY29uX3VybDogJycsXG4gIH0sXG4gIHtcbiAgICBpZDogJ2FwcC1yZXNlYXJjaCcsXG4gICAgbmFtZTogJ1Jlc2VhcmNoIFN5bnRoZXNpemVyJyxcbiAgICBtb2RlOiBBcHBNb2RlRW51bS5BRFZBTkNFRF9DSEFULFxuICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICBpY29uOiAnXFx1ezFGOUUwfScsXG4gICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZERjJGQScsXG4gICAgaWNvbl91cmw6ICcnLFxuICB9LFxuXVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRmVlZGJhY2svTGlua2VkQXBwc1BhbmVsJyxcbiAgY29tcG9uZW50OiBMaW5rZWRBcHBzUGFuZWwsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnU2hvd3MgYSBjdXJhdGVkIGxpc3Qgb2YgcmVsYXRlZCBhcHBsaWNhdGlvbnMsIHBhaXJpbmcgZWFjaCBhcHAgaWNvbiB3aXRoIHF1aWNrIG5hdmlnYXRpb24gbGlua3MuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHJlbGF0ZWRBcHBzOiBtb2NrUmVsYXRlZEFwcHMsXG4gICAgaXNNb2JpbGU6IGZhbHNlLFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIGlzTW9iaWxlOiB7XG4gICAgICBjb250cm9sOiAnYm9vbGVhbicsXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgTGlua2VkQXBwc1BhbmVsPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBEZXNrdG9wOiBTdG9yeSA9IHt9XG5cbmV4cG9ydCBjb25zdCBNb2JpbGU6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgaXNNb2JpbGU6IHRydWUsXG4gIH0sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICB2aWV3cG9ydDoge1xuICAgICAgZGVmYXVsdFZpZXdwb3J0OiAnbW9iaWxlMicsXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==