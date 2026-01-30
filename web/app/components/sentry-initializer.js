"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = require("@sentry/react");
const react_1 = require("react");
const config_1 = require("@/config");
const SentryInitializer = ({ children, }) => {
    (0, react_1.useEffect)(() => {
        const SENTRY_DSN = document?.body?.getAttribute('data-public-sentry-dsn');
        if (!config_1.IS_DEV && SENTRY_DSN) {
            Sentry.init({
                dsn: SENTRY_DSN,
                integrations: [
                    Sentry.browserTracingIntegration(),
                    Sentry.replayIntegration(),
                ],
                tracesSampleRate: 0.1,
                replaysSessionSampleRate: 0.1,
                replaysOnErrorSampleRate: 1.0,
            });
        }
    }, []);
    return children;
};
exports.default = SentryInitializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VudHJ5LWluaXRpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VudHJ5LWluaXRpYWxpemVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUVaLHdDQUF1QztBQUN2QyxpQ0FBaUM7QUFFakMscUNBQWlDO0FBRWpDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxFQUN6QixRQUFRLEdBQ3lCLEVBQUUsRUFBRTtJQUNyQyxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsTUFBTSxVQUFVLEdBQUcsUUFBUSxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtRQUN6RSxJQUFJLENBQUMsZUFBTSxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLFVBQVU7Z0JBQ2YsWUFBWSxFQUFFO29CQUNaLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTtvQkFDbEMsTUFBTSxDQUFDLGlCQUFpQixFQUFFO2lCQUMzQjtnQkFDRCxnQkFBZ0IsRUFBRSxHQUFHO2dCQUNyQix3QkFBd0IsRUFBRSxHQUFHO2dCQUM3Qix3QkFBd0IsRUFBRSxHQUFHO2FBQzlCLENBQUMsQ0FBQTtRQUNKLENBQUM7SUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDTixPQUFPLFFBQVEsQ0FBQTtBQUNqQixDQUFDLENBQUE7QUFFRCxrQkFBZSxpQkFBaUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgKiBhcyBTZW50cnkgZnJvbSAnQHNlbnRyeS9yZWFjdCdcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgeyBJU19ERVYgfSBmcm9tICdAL2NvbmZpZydcblxuY29uc3QgU2VudHJ5SW5pdGlhbGl6ZXIgPSAoe1xuICBjaGlsZHJlbixcbn06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0RWxlbWVudCB9KSA9PiB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgU0VOVFJZX0RTTiA9IGRvY3VtZW50Py5ib2R5Py5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHVibGljLXNlbnRyeS1kc24nKVxuICAgIGlmICghSVNfREVWICYmIFNFTlRSWV9EU04pIHtcbiAgICAgIFNlbnRyeS5pbml0KHtcbiAgICAgICAgZHNuOiBTRU5UUllfRFNOLFxuICAgICAgICBpbnRlZ3JhdGlvbnM6IFtcbiAgICAgICAgICBTZW50cnkuYnJvd3NlclRyYWNpbmdJbnRlZ3JhdGlvbigpLFxuICAgICAgICAgIFNlbnRyeS5yZXBsYXlJbnRlZ3JhdGlvbigpLFxuICAgICAgICBdLFxuICAgICAgICB0cmFjZXNTYW1wbGVSYXRlOiAwLjEsXG4gICAgICAgIHJlcGxheXNTZXNzaW9uU2FtcGxlUmF0ZTogMC4xLFxuICAgICAgICByZXBsYXlzT25FcnJvclNhbXBsZVJhdGU6IDEuMCxcbiAgICAgIH0pXG4gICAgfVxuICB9LCBbXSlcbiAgcmV0dXJuIGNoaWxkcmVuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlbnRyeUluaXRpYWxpemVyXG4iXX0=