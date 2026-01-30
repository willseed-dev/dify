"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const React = require("react");
const react_1 = require("react");
const app_unavailable_1 = require("@/app/components/base/app-unavailable");
const loading_1 = require("@/app/components/base/loading");
const toast_1 = require("@/app/components/base/toast");
const global_public_context_1 = require("@/context/global-public-context");
const share_1 = require("@/service/share");
const feature_1 = require("@/types/feature");
const ExternalMemberSSOAuth = () => {
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const searchParams = (0, navigation_1.useSearchParams)();
    const router = (0, navigation_1.useRouter)();
    const redirectUrl = searchParams.get('redirect_url');
    const showErrorToast = (message) => {
        toast_1.default.notify({
            type: 'error',
            message,
        });
    };
    const getAppCodeFromRedirectUrl = (0, react_1.useCallback)(() => {
        if (!redirectUrl)
            return null;
        const url = new URL(`${window.location.origin}${decodeURIComponent(redirectUrl)}`);
        const appCode = url.pathname.split('/').pop();
        if (!appCode)
            return null;
        return appCode;
    }, [redirectUrl]);
    const handleSSOLogin = (0, react_1.useCallback)(async () => {
        const appCode = getAppCodeFromRedirectUrl();
        if (!appCode || !redirectUrl) {
            showErrorToast('redirect url or app code is invalid.');
            return;
        }
        switch (systemFeatures.webapp_auth.sso_config.protocol) {
            case feature_1.SSOProtocol.SAML: {
                const samlRes = await (0, share_1.fetchWebSAMLSSOUrl)(appCode, redirectUrl);
                router.push(samlRes.url);
                break;
            }
            case feature_1.SSOProtocol.OIDC: {
                const oidcRes = await (0, share_1.fetchWebOIDCSSOUrl)(appCode, redirectUrl);
                router.push(oidcRes.url);
                break;
            }
            case feature_1.SSOProtocol.OAuth2: {
                const oauth2Res = await (0, share_1.fetchWebOAuth2SSOUrl)(appCode, redirectUrl);
                router.push(oauth2Res.url);
                break;
            }
            case '':
                break;
            default:
                showErrorToast('SSO protocol is not supported.');
        }
    }, [getAppCodeFromRedirectUrl, redirectUrl, router, systemFeatures.webapp_auth.sso_config.protocol]);
    (0, react_1.useEffect)(() => {
        handleSSOLogin();
    }, [handleSSOLogin]);
    if (!systemFeatures.webapp_auth.sso_config.protocol) {
        return (<div className="flex h-full items-center justify-center">
        <app_unavailable_1.default code={403} unknownReason="sso protocol is invalid."/>
      </div>);
    }
    return (<div className="flex h-full items-center justify-center">
      <loading_1.default />
    </div>);
};
exports.default = React.memo(ExternalMemberSSOAuth);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJuYWwtbWVtYmVyLXNzby1hdXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXh0ZXJuYWwtbWVtYmVyLXNzby1hdXRoLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUNaLGdEQUE0RDtBQUM1RCwrQkFBOEI7QUFDOUIsaUNBQThDO0FBQzlDLDJFQUFrRTtBQUNsRSwyREFBbUQ7QUFDbkQsdURBQStDO0FBQy9DLDJFQUFzRTtBQUN0RSwyQ0FBOEY7QUFDOUYsNkNBQTZDO0FBRTdDLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxFQUFFO0lBQ2pDLE1BQU0sY0FBYyxHQUFHLElBQUEsNENBQW9CLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDbEUsTUFBTSxZQUFZLEdBQUcsSUFBQSw0QkFBZSxHQUFFLENBQUE7SUFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUE7SUFFMUIsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUVwRCxNQUFNLGNBQWMsR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFFO1FBQ3pDLGVBQUssQ0FBQyxNQUFNLENBQUM7WUFDWCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU87U0FDUixDQUFDLENBQUE7SUFDSixDQUFDLENBQUE7SUFFRCxNQUFNLHlCQUF5QixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDakQsSUFBSSxDQUFDLFdBQVc7WUFDZCxPQUFPLElBQUksQ0FBQTtRQUNiLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2xGLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQzdDLElBQUksQ0FBQyxPQUFPO1lBQ1YsT0FBTyxJQUFJLENBQUE7UUFFYixPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO0lBRWpCLE1BQU0sY0FBYyxHQUFHLElBQUEsbUJBQVcsRUFBQyxLQUFLLElBQUksRUFBRTtRQUM1QyxNQUFNLE9BQU8sR0FBRyx5QkFBeUIsRUFBRSxDQUFBO1FBQzNDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM3QixjQUFjLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtZQUN0RCxPQUFNO1FBQ1IsQ0FBQztRQUVELFFBQVEsY0FBYyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkQsS0FBSyxxQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSwwQkFBa0IsRUFBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7Z0JBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUN4QixNQUFLO1lBQ1AsQ0FBQztZQUNELEtBQUsscUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUEsMEJBQWtCLEVBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO2dCQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDeEIsTUFBSztZQUNQLENBQUM7WUFDRCxLQUFLLHFCQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFBLDRCQUFvQixFQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtnQkFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzFCLE1BQUs7WUFDUCxDQUFDO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLE1BQUs7WUFDUDtnQkFDRSxjQUFjLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtRQUNwRCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMseUJBQXlCLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRXBHLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDYixjQUFjLEVBQUUsQ0FBQTtJQUNsQixDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFBO0lBRXBCLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlDQUF5QyxDQUN0RDtRQUFBLENBQUMseUJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLEVBQ3JFO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0lBQ0gsQ0FBQztJQUVELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQ3REO01BQUEsQ0FBQyxpQkFBTyxDQUFDLEFBQUQsRUFDVjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHsgdXNlUm91dGVyLCB1c2VTZWFyY2hQYXJhbXMgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBBcHBVbmF2YWlsYWJsZSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYXBwLXVuYXZhaWxhYmxlJ1xuaW1wb3J0IExvYWRpbmcgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2xvYWRpbmcnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgdXNlR2xvYmFsUHVibGljU3RvcmUgfSBmcm9tICdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0J1xuaW1wb3J0IHsgZmV0Y2hXZWJPQXV0aDJTU09VcmwsIGZldGNoV2ViT0lEQ1NTT1VybCwgZmV0Y2hXZWJTQU1MU1NPVXJsIH0gZnJvbSAnQC9zZXJ2aWNlL3NoYXJlJ1xuaW1wb3J0IHsgU1NPUHJvdG9jb2wgfSBmcm9tICdAL3R5cGVzL2ZlYXR1cmUnXG5cbmNvbnN0IEV4dGVybmFsTWVtYmVyU1NPQXV0aCA9ICgpID0+IHtcbiAgY29uc3Qgc3lzdGVtRmVhdHVyZXMgPSB1c2VHbG9iYWxQdWJsaWNTdG9yZShzID0+IHMuc3lzdGVtRmVhdHVyZXMpXG4gIGNvbnN0IHNlYXJjaFBhcmFtcyA9IHVzZVNlYXJjaFBhcmFtcygpXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXG5cbiAgY29uc3QgcmVkaXJlY3RVcmwgPSBzZWFyY2hQYXJhbXMuZ2V0KCdyZWRpcmVjdF91cmwnKVxuXG4gIGNvbnN0IHNob3dFcnJvclRvYXN0ID0gKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZSxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgZ2V0QXBwQ29kZUZyb21SZWRpcmVjdFVybCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoIXJlZGlyZWN0VXJsKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHtkZWNvZGVVUklDb21wb25lbnQocmVkaXJlY3RVcmwpfWApXG4gICAgY29uc3QgYXBwQ29kZSA9IHVybC5wYXRobmFtZS5zcGxpdCgnLycpLnBvcCgpXG4gICAgaWYgKCFhcHBDb2RlKVxuICAgICAgcmV0dXJuIG51bGxcblxuICAgIHJldHVybiBhcHBDb2RlXG4gIH0sIFtyZWRpcmVjdFVybF0pXG5cbiAgY29uc3QgaGFuZGxlU1NPTG9naW4gPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYXBwQ29kZSA9IGdldEFwcENvZGVGcm9tUmVkaXJlY3RVcmwoKVxuICAgIGlmICghYXBwQ29kZSB8fCAhcmVkaXJlY3RVcmwpIHtcbiAgICAgIHNob3dFcnJvclRvYXN0KCdyZWRpcmVjdCB1cmwgb3IgYXBwIGNvZGUgaXMgaW52YWxpZC4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc3dpdGNoIChzeXN0ZW1GZWF0dXJlcy53ZWJhcHBfYXV0aC5zc29fY29uZmlnLnByb3RvY29sKSB7XG4gICAgICBjYXNlIFNTT1Byb3RvY29sLlNBTUw6IHtcbiAgICAgICAgY29uc3Qgc2FtbFJlcyA9IGF3YWl0IGZldGNoV2ViU0FNTFNTT1VybChhcHBDb2RlLCByZWRpcmVjdFVybClcbiAgICAgICAgcm91dGVyLnB1c2goc2FtbFJlcy51cmwpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIFNTT1Byb3RvY29sLk9JREM6IHtcbiAgICAgICAgY29uc3Qgb2lkY1JlcyA9IGF3YWl0IGZldGNoV2ViT0lEQ1NTT1VybChhcHBDb2RlLCByZWRpcmVjdFVybClcbiAgICAgICAgcm91dGVyLnB1c2gob2lkY1Jlcy51cmwpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIFNTT1Byb3RvY29sLk9BdXRoMjoge1xuICAgICAgICBjb25zdCBvYXV0aDJSZXMgPSBhd2FpdCBmZXRjaFdlYk9BdXRoMlNTT1VybChhcHBDb2RlLCByZWRpcmVjdFVybClcbiAgICAgICAgcm91dGVyLnB1c2gob2F1dGgyUmVzLnVybClcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgJyc6XG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzaG93RXJyb3JUb2FzdCgnU1NPIHByb3RvY29sIGlzIG5vdCBzdXBwb3J0ZWQuJylcbiAgICB9XG4gIH0sIFtnZXRBcHBDb2RlRnJvbVJlZGlyZWN0VXJsLCByZWRpcmVjdFVybCwgcm91dGVyLCBzeXN0ZW1GZWF0dXJlcy53ZWJhcHBfYXV0aC5zc29fY29uZmlnLnByb3RvY29sXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGhhbmRsZVNTT0xvZ2luKClcbiAgfSwgW2hhbmRsZVNTT0xvZ2luXSlcblxuICBpZiAoIXN5c3RlbUZlYXR1cmVzLndlYmFwcF9hdXRoLnNzb19jb25maWcucHJvdG9jb2wpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtZnVsbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgPEFwcFVuYXZhaWxhYmxlIGNvZGU9ezQwM30gdW5rbm93blJlYXNvbj1cInNzbyBwcm90b2NvbCBpcyBpbnZhbGlkLlwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XG4gICAgICA8TG9hZGluZyAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oRXh0ZXJuYWxNZW1iZXJTU09BdXRoKVxuIl19