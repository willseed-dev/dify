"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAmplitudeEnabled = void 0;
const amplitude = require("@amplitude/analytics-browser");
const plugin_session_replay_browser_1 = require("@amplitude/plugin-session-replay-browser");
const React = require("react");
const react_1 = require("react");
const config_1 = require("@/config");
// Check if Amplitude should be enabled
const isAmplitudeEnabled = () => {
    return config_1.IS_CLOUD_EDITION && !!config_1.AMPLITUDE_API_KEY;
};
exports.isAmplitudeEnabled = isAmplitudeEnabled;
// Map URL pathname to English page name for consistent Amplitude tracking
const getEnglishPageName = (pathname) => {
    // Remove leading slash and get the first segment
    const segments = pathname.replace(/^\//, '').split('/');
    const firstSegment = segments[0] || 'home';
    const pageNameMap = {
        '': 'Home',
        'apps': 'Studio',
        'datasets': 'Knowledge',
        'explore': 'Explore',
        'tools': 'Tools',
        'account': 'Account',
        'signin': 'Sign In',
        'signup': 'Sign Up',
    };
    return pageNameMap[firstSegment] || firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
};
// Enrichment plugin to override page title with English name for page view events
const pageNameEnrichmentPlugin = () => {
    return {
        name: 'page-name-enrichment',
        type: 'enrichment',
        setup: async () => undefined,
        execute: async (event) => {
            // Only modify page view events
            if (event.event_type === '[Amplitude] Page Viewed' && event.event_properties) {
                const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
                event.event_properties['[Amplitude] Page Title'] = getEnglishPageName(pathname);
            }
            return event;
        },
    };
};
const AmplitudeProvider = ({ sessionReplaySampleRate = 0.5, }) => {
    (0, react_1.useEffect)(() => {
        // Only enable in Saas edition with valid API key
        if (!(0, exports.isAmplitudeEnabled)())
            return;
        // Initialize Amplitude
        amplitude.init(config_1.AMPLITUDE_API_KEY, {
            defaultTracking: {
                sessions: true,
                pageViews: true,
                formInteractions: true,
                fileDownloads: true,
                attribution: true,
            },
        });
        // Add page name enrichment plugin to override page title with English name
        amplitude.add(pageNameEnrichmentPlugin());
        // Add Session Replay plugin
        const sessionReplay = (0, plugin_session_replay_browser_1.sessionReplayPlugin)({
            sampleRate: sessionReplaySampleRate,
        });
        amplitude.add(sessionReplay);
    }, []);
    // This is a client component that renders nothing
    return null;
};
exports.default = React.memo(AmplitudeProvider);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW1wbGl0dWRlUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJBbXBsaXR1ZGVQcm92aWRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBR1osMERBQXlEO0FBQ3pELDRGQUE4RTtBQUM5RSwrQkFBOEI7QUFDOUIsaUNBQWlDO0FBQ2pDLHFDQUE4RDtBQU05RCx1Q0FBdUM7QUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUU7SUFDckMsT0FBTyx5QkFBZ0IsSUFBSSxDQUFDLENBQUMsMEJBQWlCLENBQUE7QUFDaEQsQ0FBQyxDQUFBO0FBRlksUUFBQSxrQkFBa0Isc0JBRTlCO0FBRUQsMEVBQTBFO0FBQzFFLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxRQUFnQixFQUFVLEVBQUU7SUFDdEQsaURBQWlEO0lBQ2pELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN2RCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFBO0lBRTFDLE1BQU0sV0FBVyxHQUEyQjtRQUMxQyxFQUFFLEVBQUUsTUFBTTtRQUNWLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFFBQVEsRUFBRSxTQUFTO0tBQ3BCLENBQUE7SUFFRCxPQUFPLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEcsQ0FBQyxDQUFBO0FBRUQsa0ZBQWtGO0FBQ2xGLE1BQU0sd0JBQXdCLEdBQUcsR0FBcUMsRUFBRTtJQUN0RSxPQUFPO1FBQ0wsSUFBSSxFQUFFLHNCQUFzQjtRQUM1QixJQUFJLEVBQUUsWUFBWTtRQUNsQixLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQyxTQUFTO1FBQzVCLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBNEIsRUFBRSxFQUFFO1lBQzlDLCtCQUErQjtZQUMvQixJQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUsseUJBQXlCLElBQUksS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQzdFLE1BQU0sUUFBUSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtnQkFDOUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHdCQUF3QixDQUFDLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDakYsQ0FBQztZQUNELE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztLQUNGLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLGlCQUFpQixHQUF3QixDQUFDLEVBQzlDLHVCQUF1QixHQUFHLEdBQUcsR0FDOUIsRUFBRSxFQUFFO0lBQ0gsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsSUFBQSwwQkFBa0IsR0FBRTtZQUN2QixPQUFNO1FBRVIsdUJBQXVCO1FBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQWlCLEVBQUU7WUFDaEMsZUFBZSxFQUFFO2dCQUNmLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFNBQVMsRUFBRSxJQUFJO2dCQUNmLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixXQUFXLEVBQUUsSUFBSTthQUNsQjtTQUNGLENBQUMsQ0FBQTtRQUVGLDJFQUEyRTtRQUMzRSxTQUFTLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQTtRQUV6Qyw0QkFBNEI7UUFDNUIsTUFBTSxhQUFhLEdBQUcsSUFBQSxtREFBbUIsRUFBQztZQUN4QyxVQUFVLEVBQUUsdUJBQXVCO1NBQ3BDLENBQUMsQ0FBQTtRQUNGLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDOUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRU4sa0RBQWtEO0lBQ2xELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCAqIGFzIGFtcGxpdHVkZSBmcm9tICdAYW1wbGl0dWRlL2FuYWx5dGljcy1icm93c2VyJ1xuaW1wb3J0IHsgc2Vzc2lvblJlcGxheVBsdWdpbiB9IGZyb20gJ0BhbXBsaXR1ZGUvcGx1Z2luLXNlc3Npb24tcmVwbGF5LWJyb3dzZXInXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQU1QTElUVURFX0FQSV9LRVksIElTX0NMT1VEX0VESVRJT04gfSBmcm9tICdAL2NvbmZpZydcblxuZXhwb3J0IHR5cGUgSUFtcGxpdHVkZVByb3BzID0ge1xuICBzZXNzaW9uUmVwbGF5U2FtcGxlUmF0ZT86IG51bWJlclxufVxuXG4vLyBDaGVjayBpZiBBbXBsaXR1ZGUgc2hvdWxkIGJlIGVuYWJsZWRcbmV4cG9ydCBjb25zdCBpc0FtcGxpdHVkZUVuYWJsZWQgPSAoKSA9PiB7XG4gIHJldHVybiBJU19DTE9VRF9FRElUSU9OICYmICEhQU1QTElUVURFX0FQSV9LRVlcbn1cblxuLy8gTWFwIFVSTCBwYXRobmFtZSB0byBFbmdsaXNoIHBhZ2UgbmFtZSBmb3IgY29uc2lzdGVudCBBbXBsaXR1ZGUgdHJhY2tpbmdcbmNvbnN0IGdldEVuZ2xpc2hQYWdlTmFtZSA9IChwYXRobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgLy8gUmVtb3ZlIGxlYWRpbmcgc2xhc2ggYW5kIGdldCB0aGUgZmlyc3Qgc2VnbWVudFxuICBjb25zdCBzZWdtZW50cyA9IHBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykuc3BsaXQoJy8nKVxuICBjb25zdCBmaXJzdFNlZ21lbnQgPSBzZWdtZW50c1swXSB8fCAnaG9tZSdcblxuICBjb25zdCBwYWdlTmFtZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAnJzogJ0hvbWUnLFxuICAgICdhcHBzJzogJ1N0dWRpbycsXG4gICAgJ2RhdGFzZXRzJzogJ0tub3dsZWRnZScsXG4gICAgJ2V4cGxvcmUnOiAnRXhwbG9yZScsXG4gICAgJ3Rvb2xzJzogJ1Rvb2xzJyxcbiAgICAnYWNjb3VudCc6ICdBY2NvdW50JyxcbiAgICAnc2lnbmluJzogJ1NpZ24gSW4nLFxuICAgICdzaWdudXAnOiAnU2lnbiBVcCcsXG4gIH1cblxuICByZXR1cm4gcGFnZU5hbWVNYXBbZmlyc3RTZWdtZW50XSB8fCBmaXJzdFNlZ21lbnQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmaXJzdFNlZ21lbnQuc2xpY2UoMSlcbn1cblxuLy8gRW5yaWNobWVudCBwbHVnaW4gdG8gb3ZlcnJpZGUgcGFnZSB0aXRsZSB3aXRoIEVuZ2xpc2ggbmFtZSBmb3IgcGFnZSB2aWV3IGV2ZW50c1xuY29uc3QgcGFnZU5hbWVFbnJpY2htZW50UGx1Z2luID0gKCk6IGFtcGxpdHVkZS5UeXBlcy5FbnJpY2htZW50UGx1Z2luID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAncGFnZS1uYW1lLWVucmljaG1lbnQnLFxuICAgIHR5cGU6ICdlbnJpY2htZW50JyxcbiAgICBzZXR1cDogYXN5bmMgKCkgPT4gdW5kZWZpbmVkLFxuICAgIGV4ZWN1dGU6IGFzeW5jIChldmVudDogYW1wbGl0dWRlLlR5cGVzLkV2ZW50KSA9PiB7XG4gICAgICAvLyBPbmx5IG1vZGlmeSBwYWdlIHZpZXcgZXZlbnRzXG4gICAgICBpZiAoZXZlbnQuZXZlbnRfdHlwZSA9PT0gJ1tBbXBsaXR1ZGVdIFBhZ2UgVmlld2VkJyAmJiBldmVudC5ldmVudF9wcm9wZXJ0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBhdGhuYW1lID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgOiAnJ1xuICAgICAgICBldmVudC5ldmVudF9wcm9wZXJ0aWVzWydbQW1wbGl0dWRlXSBQYWdlIFRpdGxlJ10gPSBnZXRFbmdsaXNoUGFnZU5hbWUocGF0aG5hbWUpXG4gICAgICB9XG4gICAgICByZXR1cm4gZXZlbnRcbiAgICB9LFxuICB9XG59XG5cbmNvbnN0IEFtcGxpdHVkZVByb3ZpZGVyOiBGQzxJQW1wbGl0dWRlUHJvcHM+ID0gKHtcbiAgc2Vzc2lvblJlcGxheVNhbXBsZVJhdGUgPSAwLjUsXG59KSA9PiB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gT25seSBlbmFibGUgaW4gU2FhcyBlZGl0aW9uIHdpdGggdmFsaWQgQVBJIGtleVxuICAgIGlmICghaXNBbXBsaXR1ZGVFbmFibGVkKCkpXG4gICAgICByZXR1cm5cblxuICAgIC8vIEluaXRpYWxpemUgQW1wbGl0dWRlXG4gICAgYW1wbGl0dWRlLmluaXQoQU1QTElUVURFX0FQSV9LRVksIHtcbiAgICAgIGRlZmF1bHRUcmFja2luZzoge1xuICAgICAgICBzZXNzaW9uczogdHJ1ZSxcbiAgICAgICAgcGFnZVZpZXdzOiB0cnVlLFxuICAgICAgICBmb3JtSW50ZXJhY3Rpb25zOiB0cnVlLFxuICAgICAgICBmaWxlRG93bmxvYWRzOiB0cnVlLFxuICAgICAgICBhdHRyaWJ1dGlvbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIEFkZCBwYWdlIG5hbWUgZW5yaWNobWVudCBwbHVnaW4gdG8gb3ZlcnJpZGUgcGFnZSB0aXRsZSB3aXRoIEVuZ2xpc2ggbmFtZVxuICAgIGFtcGxpdHVkZS5hZGQocGFnZU5hbWVFbnJpY2htZW50UGx1Z2luKCkpXG5cbiAgICAvLyBBZGQgU2Vzc2lvbiBSZXBsYXkgcGx1Z2luXG4gICAgY29uc3Qgc2Vzc2lvblJlcGxheSA9IHNlc3Npb25SZXBsYXlQbHVnaW4oe1xuICAgICAgc2FtcGxlUmF0ZTogc2Vzc2lvblJlcGxheVNhbXBsZVJhdGUsXG4gICAgfSlcbiAgICBhbXBsaXR1ZGUuYWRkKHNlc3Npb25SZXBsYXkpXG4gIH0sIFtdKVxuXG4gIC8vIFRoaXMgaXMgYSBjbGllbnQgY29tcG9uZW50IHRoYXQgcmVuZGVycyBub3RoaW5nXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQW1wbGl0dWRlUHJvdmlkZXIpXG4iXX0=