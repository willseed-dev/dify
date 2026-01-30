"use strict";
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
Object.defineProperty(exports, "__esModule", { value: true });
const serwist_1 = require("serwist");
const scopePathname = new URL(self.registration.scope).pathname;
const basePath = scopePathname.replace(/\/serwist\/$/, '').replace(/\/$/, '');
const offlineUrl = `${basePath}/_offline.html`;
const serwist = new serwist_1.Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            matcher: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: new serwist_1.CacheFirst({
                cacheName: 'google-fonts',
                plugins: [
                    new serwist_1.CacheableResponsePlugin({ statuses: [0, 200] }),
                    new serwist_1.ExpirationPlugin({
                        maxEntries: 4,
                        maxAgeSeconds: 365 * 24 * 60 * 60,
                    }),
                ],
            }),
        },
        {
            matcher: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: new serwist_1.CacheFirst({
                cacheName: 'google-fonts-webfonts',
                plugins: [
                    new serwist_1.CacheableResponsePlugin({ statuses: [0, 200] }),
                    new serwist_1.ExpirationPlugin({
                        maxEntries: 4,
                        maxAgeSeconds: 365 * 24 * 60 * 60,
                    }),
                ],
            }),
        },
        {
            matcher: ({ request }) => request.destination === 'image',
            handler: new serwist_1.CacheFirst({
                cacheName: 'images',
                plugins: [
                    new serwist_1.CacheableResponsePlugin({ statuses: [0, 200] }),
                    new serwist_1.ExpirationPlugin({
                        maxEntries: 64,
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                    }),
                ],
            }),
        },
        {
            matcher: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: new serwist_1.StaleWhileRevalidate({
                cacheName: 'static-resources',
                plugins: [
                    new serwist_1.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 24 * 60 * 60,
                    }),
                ],
            }),
        },
        {
            matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/api/'),
            handler: new serwist_1.NetworkFirst({
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                plugins: [
                    new serwist_1.ExpirationPlugin({
                        maxEntries: 16,
                        maxAgeSeconds: 60 * 60,
                    }),
                ],
            }),
        },
    ],
    fallbacks: {
        entries: [
            {
                url: offlineUrl,
                matcher({ request }) {
                    return request.destination === 'document';
                },
            },
        ],
    },
});
serwist.addEventListeners();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLDhCQUE4QjtBQUM5QixpQ0FBaUM7O0FBR2pDLHFDQUE0SDtBQVc1SCxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQTtBQUMvRCxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzdFLE1BQU0sVUFBVSxHQUFHLEdBQUcsUUFBUSxnQkFBZ0IsQ0FBQTtBQUU5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUM7SUFDMUIsZUFBZSxFQUFFLElBQUksQ0FBQyxhQUFhO0lBQ25DLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsY0FBYyxFQUFFO1FBQ2Q7WUFDRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLDhCQUE4QjtZQUNuRSxPQUFPLEVBQUUsSUFBSSxvQkFBVSxDQUFDO2dCQUN0QixTQUFTLEVBQUUsY0FBYztnQkFDekIsT0FBTyxFQUFFO29CQUNQLElBQUksaUNBQXVCLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztvQkFDbkQsSUFBSSwwQkFBZ0IsQ0FBQzt3QkFDbkIsVUFBVSxFQUFFLENBQUM7d0JBQ2IsYUFBYSxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7cUJBQ2xDLENBQUM7aUJBQ0g7YUFDRixDQUFDO1NBQ0g7UUFDRDtZQUNFLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssMkJBQTJCO1lBQ2hFLE9BQU8sRUFBRSxJQUFJLG9CQUFVLENBQUM7Z0JBQ3RCLFNBQVMsRUFBRSx1QkFBdUI7Z0JBQ2xDLE9BQU8sRUFBRTtvQkFDUCxJQUFJLGlDQUF1QixDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7b0JBQ25ELElBQUksMEJBQWdCLENBQUM7d0JBQ25CLFVBQVUsRUFBRSxDQUFDO3dCQUNiLGFBQWEsRUFBRSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO3FCQUNsQyxDQUFDO2lCQUNIO2FBQ0YsQ0FBQztTQUNIO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxLQUFLLE9BQU87WUFDekQsT0FBTyxFQUFFLElBQUksb0JBQVUsQ0FBQztnQkFDdEIsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLE9BQU8sRUFBRTtvQkFDUCxJQUFJLGlDQUF1QixDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7b0JBQ25ELElBQUksMEJBQWdCLENBQUM7d0JBQ25CLFVBQVUsRUFBRSxFQUFFO3dCQUNkLGFBQWEsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO3FCQUNqQyxDQUFDO2lCQUNIO2FBQ0YsQ0FBQztTQUNIO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxLQUFLLE9BQU87WUFDN0YsT0FBTyxFQUFFLElBQUksOEJBQW9CLENBQUM7Z0JBQ2hDLFNBQVMsRUFBRSxrQkFBa0I7Z0JBQzdCLE9BQU8sRUFBRTtvQkFDUCxJQUFJLDBCQUFnQixDQUFDO3dCQUNuQixVQUFVLEVBQUUsRUFBRTt3QkFDZCxhQUFhLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO3FCQUM1QixDQUFDO2lCQUNIO2FBQ0YsQ0FBQztTQUNIO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUNoRixPQUFPLEVBQUUsSUFBSSxzQkFBWSxDQUFDO2dCQUN4QixTQUFTLEVBQUUsV0FBVztnQkFDdEIscUJBQXFCLEVBQUUsRUFBRTtnQkFDekIsT0FBTyxFQUFFO29CQUNQLElBQUksMEJBQWdCLENBQUM7d0JBQ25CLFVBQVUsRUFBRSxFQUFFO3dCQUNkLGFBQWEsRUFBRSxFQUFFLEdBQUcsRUFBRTtxQkFDdkIsQ0FBQztpQkFDSDthQUNGLENBQUM7U0FDSDtLQUNGO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsR0FBRyxFQUFFLFVBQVU7Z0JBQ2YsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFO29CQUNqQixPQUFPLE9BQU8sQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFBO2dCQUMzQyxDQUFDO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBuby1kZWZhdWx0LWxpYj1cInRydWVcIiAvPlxuLy8vIDxyZWZlcmVuY2UgbGliPVwiZXNuZXh0XCIgLz5cbi8vLyA8cmVmZXJlbmNlIGxpYj1cIndlYndvcmtlclwiIC8+XG5cbmltcG9ydCB0eXBlIHsgUHJlY2FjaGVFbnRyeSwgU2Vyd2lzdEdsb2JhbENvbmZpZyB9IGZyb20gJ3Nlcndpc3QnXG5pbXBvcnQgeyBDYWNoZWFibGVSZXNwb25zZVBsdWdpbiwgQ2FjaGVGaXJzdCwgRXhwaXJhdGlvblBsdWdpbiwgTmV0d29ya0ZpcnN0LCBTZXJ3aXN0LCBTdGFsZVdoaWxlUmV2YWxpZGF0ZSB9IGZyb20gJ3Nlcndpc3QnXG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHRzL2NvbnNpc3RlbnQtdHlwZS1kZWZpbml0aW9uc1xuICBpbnRlcmZhY2UgV29ya2VyR2xvYmFsU2NvcGUgZXh0ZW5kcyBTZXJ3aXN0R2xvYmFsQ29uZmlnIHtcbiAgICBfX1NXX01BTklGRVNUOiAoUHJlY2FjaGVFbnRyeSB8IHN0cmluZylbXSB8IHVuZGVmaW5lZFxuICB9XG59XG5cbmRlY2xhcmUgY29uc3Qgc2VsZjogU2VydmljZVdvcmtlckdsb2JhbFNjb3BlXG5cbmNvbnN0IHNjb3BlUGF0aG5hbWUgPSBuZXcgVVJMKHNlbGYucmVnaXN0cmF0aW9uLnNjb3BlKS5wYXRobmFtZVxuY29uc3QgYmFzZVBhdGggPSBzY29wZVBhdGhuYW1lLnJlcGxhY2UoL1xcL3Nlcndpc3RcXC8kLywgJycpLnJlcGxhY2UoL1xcLyQvLCAnJylcbmNvbnN0IG9mZmxpbmVVcmwgPSBgJHtiYXNlUGF0aH0vX29mZmxpbmUuaHRtbGBcblxuY29uc3Qgc2Vyd2lzdCA9IG5ldyBTZXJ3aXN0KHtcbiAgcHJlY2FjaGVFbnRyaWVzOiBzZWxmLl9fU1dfTUFOSUZFU1QsXG4gIHNraXBXYWl0aW5nOiB0cnVlLFxuICBjbGllbnRzQ2xhaW06IHRydWUsXG4gIG5hdmlnYXRpb25QcmVsb2FkOiB0cnVlLFxuICBydW50aW1lQ2FjaGluZzogW1xuICAgIHtcbiAgICAgIG1hdGNoZXI6ICh7IHVybCB9KSA9PiB1cmwub3JpZ2luID09PSAnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbScsXG4gICAgICBoYW5kbGVyOiBuZXcgQ2FjaGVGaXJzdCh7XG4gICAgICAgIGNhY2hlTmFtZTogJ2dvb2dsZS1mb250cycsXG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICBuZXcgQ2FjaGVhYmxlUmVzcG9uc2VQbHVnaW4oeyBzdGF0dXNlczogWzAsIDIwMF0gfSksXG4gICAgICAgICAgbmV3IEV4cGlyYXRpb25QbHVnaW4oe1xuICAgICAgICAgICAgbWF4RW50cmllczogNCxcbiAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDM2NSAqIDI0ICogNjAgKiA2MCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0sXG4gICAge1xuICAgICAgbWF0Y2hlcjogKHsgdXJsIH0pID0+IHVybC5vcmlnaW4gPT09ICdodHRwczovL2ZvbnRzLmdzdGF0aWMuY29tJyxcbiAgICAgIGhhbmRsZXI6IG5ldyBDYWNoZUZpcnN0KHtcbiAgICAgICAgY2FjaGVOYW1lOiAnZ29vZ2xlLWZvbnRzLXdlYmZvbnRzJyxcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIG5ldyBDYWNoZWFibGVSZXNwb25zZVBsdWdpbih7IHN0YXR1c2VzOiBbMCwgMjAwXSB9KSxcbiAgICAgICAgICBuZXcgRXhwaXJhdGlvblBsdWdpbih7XG4gICAgICAgICAgICBtYXhFbnRyaWVzOiA0LFxuICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogMzY1ICogMjQgKiA2MCAqIDYwLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSxcbiAgICB7XG4gICAgICBtYXRjaGVyOiAoeyByZXF1ZXN0IH0pID0+IHJlcXVlc3QuZGVzdGluYXRpb24gPT09ICdpbWFnZScsXG4gICAgICBoYW5kbGVyOiBuZXcgQ2FjaGVGaXJzdCh7XG4gICAgICAgIGNhY2hlTmFtZTogJ2ltYWdlcycsXG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICBuZXcgQ2FjaGVhYmxlUmVzcG9uc2VQbHVnaW4oeyBzdGF0dXNlczogWzAsIDIwMF0gfSksXG4gICAgICAgICAgbmV3IEV4cGlyYXRpb25QbHVnaW4oe1xuICAgICAgICAgICAgbWF4RW50cmllczogNjQsXG4gICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAzMCAqIDI0ICogNjAgKiA2MCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0sXG4gICAge1xuICAgICAgbWF0Y2hlcjogKHsgcmVxdWVzdCB9KSA9PiByZXF1ZXN0LmRlc3RpbmF0aW9uID09PSAnc2NyaXB0JyB8fCByZXF1ZXN0LmRlc3RpbmF0aW9uID09PSAnc3R5bGUnLFxuICAgICAgaGFuZGxlcjogbmV3IFN0YWxlV2hpbGVSZXZhbGlkYXRlKHtcbiAgICAgICAgY2FjaGVOYW1lOiAnc3RhdGljLXJlc291cmNlcycsXG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICBuZXcgRXhwaXJhdGlvblBsdWdpbih7XG4gICAgICAgICAgICBtYXhFbnRyaWVzOiAzMixcbiAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDI0ICogNjAgKiA2MCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0sXG4gICAge1xuICAgICAgbWF0Y2hlcjogKHsgdXJsLCBzYW1lT3JpZ2luIH0pID0+IHNhbWVPcmlnaW4gJiYgdXJsLnBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9hcGkvJyksXG4gICAgICBoYW5kbGVyOiBuZXcgTmV0d29ya0ZpcnN0KHtcbiAgICAgICAgY2FjaGVOYW1lOiAnYXBpLWNhY2hlJyxcbiAgICAgICAgbmV0d29ya1RpbWVvdXRTZWNvbmRzOiAxMCxcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIG5ldyBFeHBpcmF0aW9uUGx1Z2luKHtcbiAgICAgICAgICAgIG1heEVudHJpZXM6IDE2LFxuICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIF0sXG4gIGZhbGxiYWNrczoge1xuICAgIGVudHJpZXM6IFtcbiAgICAgIHtcbiAgICAgICAgdXJsOiBvZmZsaW5lVXJsLFxuICAgICAgICBtYXRjaGVyKHsgcmVxdWVzdCB9KSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVzdGluYXRpb24gPT09ICdkb2N1bWVudCdcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbn0pXG5cbnNlcndpc3QuYWRkRXZlbnRMaXN0ZW5lcnMoKVxuIl19