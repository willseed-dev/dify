"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
const NECESSARY_DOMAIN = '*.sentry.io http://localhost:* http://127.0.0.1:* https://analytics.google.com googletagmanager.com *.googletagmanager.com https://www.google-analytics.com https://api.github.com https://api2.amplitude.com *.amplitude.com';
const wrapResponseWithXFrameOptions = (response, pathname) => {
    // prevent clickjacking: https://owasp.org/www-community/attacks/Clickjacking
    // Chatbot page should be allowed to be embedded in iframe. It's a feature
    if (process.env.NEXT_PUBLIC_ALLOW_EMBED !== 'true' && !pathname.startsWith('/chat') && !pathname.startsWith('/workflow') && !pathname.startsWith('/completion') && !pathname.startsWith('/webapp-signin'))
        response.headers.set('X-Frame-Options', 'DENY');
    return response;
};
function middleware(request) {
    const { pathname } = request.nextUrl;
    const requestHeaders = new Headers(request.headers);
    const response = server_1.NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    const isWhiteListEnabled = !!process.env.NEXT_PUBLIC_CSP_WHITELIST && process.env.NODE_ENV === 'production';
    if (!isWhiteListEnabled)
        return wrapResponseWithXFrameOptions(response, pathname);
    const whiteList = `${process.env.NEXT_PUBLIC_CSP_WHITELIST} ${NECESSARY_DOMAIN}`;
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const csp = `'nonce-${nonce}'`;
    const scheme_source = 'data: mediastream: blob: filesystem:';
    const cspHeader = `
    default-src 'self' ${scheme_source} ${csp} ${whiteList};
    connect-src 'self' ${scheme_source} ${csp} ${whiteList};
    script-src 'self' ${scheme_source} ${csp} ${whiteList};
    style-src 'self' 'unsafe-inline' ${scheme_source} ${whiteList};
    worker-src 'self' ${scheme_source} ${csp} ${whiteList};
    media-src 'self' ${scheme_source} ${csp} ${whiteList};
    img-src * data: blob:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
`;
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim();
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
    return wrapResponseWithXFrameOptions(response, pathname);
}
exports.config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            // source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            source: '/((?!_next/static|_next/image|favicon.ico).*)',
            // source: '/(.*)',
            // missing: [
            //   { type: 'header', key: 'next-router-prefetch' },
            //   { type: 'header', key: 'purpose', value: 'prefetch' },
            // ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBYUEsZ0NBbURDO0FBL0RELHdDQUEwQztBQUUxQyxNQUFNLGdCQUFnQixHQUFHLCtOQUErTixDQUFBO0FBRXhQLE1BQU0sNkJBQTZCLEdBQUcsQ0FBQyxRQUFzQixFQUFFLFFBQWdCLEVBQUUsRUFBRTtJQUNqRiw2RUFBNkU7SUFDN0UsMEVBQTBFO0lBQzFFLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsS0FBSyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQ3ZNLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBRWpELE9BQU8sUUFBUSxDQUFBO0FBQ2pCLENBQUMsQ0FBQTtBQUNELFNBQWdCLFVBQVUsQ0FBQyxPQUFvQjtJQUM3QyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQTtJQUNwQyxNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDbkQsTUFBTSxRQUFRLEdBQUcscUJBQVksQ0FBQyxJQUFJLENBQUM7UUFDakMsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLGNBQWM7U0FDeEI7S0FDRixDQUFDLENBQUE7SUFFRixNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksQ0FBQTtJQUMzRyxJQUFJLENBQUMsa0JBQWtCO1FBQ3JCLE9BQU8sNkJBQTZCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBRTFELE1BQU0sU0FBUyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsSUFBSSxnQkFBZ0IsRUFBRSxDQUFBO0lBQ2hGLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ2pFLE1BQU0sR0FBRyxHQUFHLFVBQVUsS0FBSyxHQUFHLENBQUE7SUFFOUIsTUFBTSxhQUFhLEdBQUcsc0NBQXNDLENBQUE7SUFFNUQsTUFBTSxTQUFTLEdBQUc7eUJBQ0ssYUFBYSxJQUFJLEdBQUcsSUFBSSxTQUFTO3lCQUNqQyxhQUFhLElBQUksR0FBRyxJQUFJLFNBQVM7d0JBQ2xDLGFBQWEsSUFBSSxHQUFHLElBQUksU0FBUzt1Q0FDbEIsYUFBYSxJQUFJLFNBQVM7d0JBQ3pDLGFBQWEsSUFBSSxHQUFHLElBQUksU0FBUzt1QkFDbEMsYUFBYSxJQUFJLEdBQUcsSUFBSSxTQUFTOzs7Ozs7O0NBT3ZELENBQUE7SUFDQyx3Q0FBd0M7SUFDeEMsTUFBTSxnQ0FBZ0MsR0FBRyxTQUFTO1NBQy9DLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDO1NBQ3ZCLElBQUksRUFBRSxDQUFBO0lBRVQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFFcEMsY0FBYyxDQUFDLEdBQUcsQ0FDaEIseUJBQXlCLEVBQ3pCLGdDQUFnQyxDQUNqQyxDQUFBO0lBRUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQ2xCLHlCQUF5QixFQUN6QixnQ0FBZ0MsQ0FDakMsQ0FBQTtJQUVELE9BQU8sNkJBQTZCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQzFELENBQUM7QUFFWSxRQUFBLE1BQU0sR0FBRztJQUNwQixPQUFPLEVBQUU7UUFDUDs7Ozs7O1dBTUc7UUFDSDtZQUNFLCtEQUErRDtZQUMvRCxNQUFNLEVBQUUsK0NBQStDO1lBQ3ZELG1CQUFtQjtZQUNuQixhQUFhO1lBQ2IscURBQXFEO1lBQ3JELDJEQUEyRDtZQUMzRCxLQUFLO1NBQ047S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5leHRSZXF1ZXN0IH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcblxuY29uc3QgTkVDRVNTQVJZX0RPTUFJTiA9ICcqLnNlbnRyeS5pbyBodHRwOi8vbG9jYWxob3N0OiogaHR0cDovLzEyNy4wLjAuMToqIGh0dHBzOi8vYW5hbHl0aWNzLmdvb2dsZS5jb20gZ29vZ2xldGFnbWFuYWdlci5jb20gKi5nb29nbGV0YWdtYW5hZ2VyLmNvbSBodHRwczovL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbSBodHRwczovL2FwaS5naXRodWIuY29tIGh0dHBzOi8vYXBpMi5hbXBsaXR1ZGUuY29tICouYW1wbGl0dWRlLmNvbSdcblxuY29uc3Qgd3JhcFJlc3BvbnNlV2l0aFhGcmFtZU9wdGlvbnMgPSAocmVzcG9uc2U6IE5leHRSZXNwb25zZSwgcGF0aG5hbWU6IHN0cmluZykgPT4ge1xuICAvLyBwcmV2ZW50IGNsaWNramFja2luZzogaHR0cHM6Ly9vd2FzcC5vcmcvd3d3LWNvbW11bml0eS9hdHRhY2tzL0NsaWNramFja2luZ1xuICAvLyBDaGF0Ym90IHBhZ2Ugc2hvdWxkIGJlIGFsbG93ZWQgdG8gYmUgZW1iZWRkZWQgaW4gaWZyYW1lLiBJdCdzIGEgZmVhdHVyZVxuICBpZiAocHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQUxMT1dfRU1CRUQgIT09ICd0cnVlJyAmJiAhcGF0aG5hbWUuc3RhcnRzV2l0aCgnL2NoYXQnKSAmJiAhcGF0aG5hbWUuc3RhcnRzV2l0aCgnL3dvcmtmbG93JykgJiYgIXBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9jb21wbGV0aW9uJykgJiYgIXBhdGhuYW1lLnN0YXJ0c1dpdGgoJy93ZWJhcHAtc2lnbmluJykpXG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ1gtRnJhbWUtT3B0aW9ucycsICdERU5ZJylcblxuICByZXR1cm4gcmVzcG9uc2Vcbn1cbmV4cG9ydCBmdW5jdGlvbiBtaWRkbGV3YXJlKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIGNvbnN0IHsgcGF0aG5hbWUgfSA9IHJlcXVlc3QubmV4dFVybFxuICBjb25zdCByZXF1ZXN0SGVhZGVycyA9IG5ldyBIZWFkZXJzKHJlcXVlc3QuaGVhZGVycylcbiAgY29uc3QgcmVzcG9uc2UgPSBOZXh0UmVzcG9uc2UubmV4dCh7XG4gICAgcmVxdWVzdDoge1xuICAgICAgaGVhZGVyczogcmVxdWVzdEhlYWRlcnMsXG4gICAgfSxcbiAgfSlcblxuICBjb25zdCBpc1doaXRlTGlzdEVuYWJsZWQgPSAhIXByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0NTUF9XSElURUxJU1QgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xuICBpZiAoIWlzV2hpdGVMaXN0RW5hYmxlZClcbiAgICByZXR1cm4gd3JhcFJlc3BvbnNlV2l0aFhGcmFtZU9wdGlvbnMocmVzcG9uc2UsIHBhdGhuYW1lKVxuXG4gIGNvbnN0IHdoaXRlTGlzdCA9IGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0NTUF9XSElURUxJU1R9ICR7TkVDRVNTQVJZX0RPTUFJTn1gXG4gIGNvbnN0IG5vbmNlID0gQnVmZmVyLmZyb20oY3J5cHRvLnJhbmRvbVVVSUQoKSkudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gIGNvbnN0IGNzcCA9IGAnbm9uY2UtJHtub25jZX0nYFxuXG4gIGNvbnN0IHNjaGVtZV9zb3VyY2UgPSAnZGF0YTogbWVkaWFzdHJlYW06IGJsb2I6IGZpbGVzeXN0ZW06J1xuXG4gIGNvbnN0IGNzcEhlYWRlciA9IGBcbiAgICBkZWZhdWx0LXNyYyAnc2VsZicgJHtzY2hlbWVfc291cmNlfSAke2NzcH0gJHt3aGl0ZUxpc3R9O1xuICAgIGNvbm5lY3Qtc3JjICdzZWxmJyAke3NjaGVtZV9zb3VyY2V9ICR7Y3NwfSAke3doaXRlTGlzdH07XG4gICAgc2NyaXB0LXNyYyAnc2VsZicgJHtzY2hlbWVfc291cmNlfSAke2NzcH0gJHt3aGl0ZUxpc3R9O1xuICAgIHN0eWxlLXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnICR7c2NoZW1lX3NvdXJjZX0gJHt3aGl0ZUxpc3R9O1xuICAgIHdvcmtlci1zcmMgJ3NlbGYnICR7c2NoZW1lX3NvdXJjZX0gJHtjc3B9ICR7d2hpdGVMaXN0fTtcbiAgICBtZWRpYS1zcmMgJ3NlbGYnICR7c2NoZW1lX3NvdXJjZX0gJHtjc3B9ICR7d2hpdGVMaXN0fTtcbiAgICBpbWctc3JjICogZGF0YTogYmxvYjo7XG4gICAgZm9udC1zcmMgJ3NlbGYnO1xuICAgIG9iamVjdC1zcmMgJ25vbmUnO1xuICAgIGJhc2UtdXJpICdzZWxmJztcbiAgICBmb3JtLWFjdGlvbiAnc2VsZic7XG4gICAgdXBncmFkZS1pbnNlY3VyZS1yZXF1ZXN0cztcbmBcbiAgLy8gUmVwbGFjZSBuZXdsaW5lIGNoYXJhY3RlcnMgYW5kIHNwYWNlc1xuICBjb25zdCBjb250ZW50U2VjdXJpdHlQb2xpY3lIZWFkZXJWYWx1ZSA9IGNzcEhlYWRlclxuICAgIC5yZXBsYWNlKC9cXHN7Mix9L2csICcgJylcbiAgICAudHJpbSgpXG5cbiAgcmVxdWVzdEhlYWRlcnMuc2V0KCd4LW5vbmNlJywgbm9uY2UpXG5cbiAgcmVxdWVzdEhlYWRlcnMuc2V0KFxuICAgICdDb250ZW50LVNlY3VyaXR5LVBvbGljeScsXG4gICAgY29udGVudFNlY3VyaXR5UG9saWN5SGVhZGVyVmFsdWUsXG4gIClcblxuICByZXNwb25zZS5oZWFkZXJzLnNldChcbiAgICAnQ29udGVudC1TZWN1cml0eS1Qb2xpY3knLFxuICAgIGNvbnRlbnRTZWN1cml0eVBvbGljeUhlYWRlclZhbHVlLFxuICApXG5cbiAgcmV0dXJuIHdyYXBSZXNwb25zZVdpdGhYRnJhbWVPcHRpb25zKHJlc3BvbnNlLCBwYXRobmFtZSlcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgbWF0Y2hlcjogW1xuICAgIC8qXG4gICAgICogTWF0Y2ggYWxsIHJlcXVlc3QgcGF0aHMgZXhjZXB0IGZvciB0aGUgb25lcyBzdGFydGluZyB3aXRoOlxuICAgICAqIC0gYXBpIChBUEkgcm91dGVzKVxuICAgICAqIC0gX25leHQvc3RhdGljIChzdGF0aWMgZmlsZXMpXG4gICAgICogLSBfbmV4dC9pbWFnZSAoaW1hZ2Ugb3B0aW1pemF0aW9uIGZpbGVzKVxuICAgICAqIC0gZmF2aWNvbi5pY28gKGZhdmljb24gZmlsZSlcbiAgICAgKi9cbiAgICB7XG4gICAgICAvLyBzb3VyY2U6ICcvKCg/IWFwaXxfbmV4dC9zdGF0aWN8X25leHQvaW1hZ2V8ZmF2aWNvbi5pY28pLiopJyxcbiAgICAgIHNvdXJjZTogJy8oKD8hX25leHQvc3RhdGljfF9uZXh0L2ltYWdlfGZhdmljb24uaWNvKS4qKScsXG4gICAgICAvLyBzb3VyY2U6ICcvKC4qKScsXG4gICAgICAvLyBtaXNzaW5nOiBbXG4gICAgICAvLyAgIHsgdHlwZTogJ2hlYWRlcicsIGtleTogJ25leHQtcm91dGVyLXByZWZldGNoJyB9LFxuICAgICAgLy8gICB7IHR5cGU6ICdoZWFkZXInLCBrZXk6ICdwdXJwb3NlJywgdmFsdWU6ICdwcmVmZXRjaCcgfSxcbiAgICAgIC8vIF0sXG4gICAgfSxcbiAgXSxcbn1cbiJdfQ==