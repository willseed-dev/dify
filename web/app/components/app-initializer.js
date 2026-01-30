"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInitializer = void 0;
const js_cookie_1 = require("js-cookie");
const navigation_1 = require("next/navigation");
const nuqs_1 = require("nuqs");
const react_1 = require("react");
const constants_1 = require("@/app/education-apply/constants");
const gtag_1 = require("@/utils/gtag");
const setup_status_1 = require("@/utils/setup-status");
const post_login_redirect_1 = require("../signin/utils/post-login-redirect");
const amplitude_1 = require("./base/amplitude");
const AppInitializer = ({ children, }) => {
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    // Tokens are now stored in cookies, no need to check localStorage
    const pathname = (0, navigation_1.usePathname)();
    const [init, setInit] = (0, react_1.useState)(false);
    const [oauthNewUser, setOauthNewUser] = (0, nuqs_1.useQueryState)('oauth_new_user', nuqs_1.parseAsString.withOptions({ history: 'replace' }));
    const isSetupFinished = (0, react_1.useCallback)(async () => {
        try {
            const setUpStatus = await (0, setup_status_1.fetchSetupStatusWithCache)();
            return setUpStatus.step === 'finished';
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }, []);
    (0, react_1.useEffect)(() => {
        (async () => {
            const action = searchParams.get('action');
            if (oauthNewUser === 'true') {
                let utmInfo = null;
                const utmInfoStr = js_cookie_1.default.get('utm_info');
                if (utmInfoStr) {
                    try {
                        utmInfo = JSON.parse(utmInfoStr);
                    }
                    catch (e) {
                        console.error('Failed to parse utm_info cookie:', e);
                    }
                }
                // Track registration event with UTM params
                (0, amplitude_1.trackEvent)(utmInfo ? 'user_registration_success_with_utm' : 'user_registration_success', {
                    method: 'oauth',
                    ...utmInfo,
                });
                (0, gtag_1.sendGAEvent)(utmInfo ? 'user_registration_success_with_utm' : 'user_registration_success', {
                    method: 'oauth',
                    ...utmInfo,
                });
                // Clean up: remove utm_info cookie and URL params
                js_cookie_1.default.remove('utm_info');
                setOauthNewUser(null);
            }
            if (action === constants_1.EDUCATION_VERIFY_URL_SEARCHPARAMS_ACTION)
                localStorage.setItem(constants_1.EDUCATION_VERIFYING_LOCALSTORAGE_ITEM, 'yes');
            try {
                const isFinished = await isSetupFinished();
                if (!isFinished) {
                    router.replace('/install');
                    return;
                }
                const redirectUrl = (0, post_login_redirect_1.resolvePostLoginRedirect)(searchParams);
                if (redirectUrl) {
                    location.replace(redirectUrl);
                    return;
                }
                setInit(true);
            }
            catch {
                router.replace('/signin');
            }
        })();
    }, [isSetupFinished, router, pathname, searchParams, oauthNewUser, setOauthNewUser]);
    return init ? children : null;
};
exports.AppInitializer = AppInitializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWluaXRpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLWluaXRpYWxpemVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOzs7QUFHWix5Q0FBK0I7QUFDL0IsZ0RBQXlFO0FBQ3pFLCtCQUFtRDtBQUNuRCxpQ0FBd0Q7QUFDeEQsK0RBR3dDO0FBQ3hDLHVDQUEwQztBQUMxQyx1REFBZ0U7QUFDaEUsNkVBQThFO0FBQzlFLGdEQUE2QztBQU10QyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQzdCLFFBQVEsR0FDWSxFQUFFLEVBQUU7SUFDeEIsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUE7SUFDMUIsTUFBTSxZQUFZLEdBQUcsSUFBQSw0QkFBZSxHQUFFLENBQUE7SUFDdEMsa0VBQWtFO0lBQ2xFLE1BQU0sUUFBUSxHQUFHLElBQUEsd0JBQVcsR0FBRSxDQUFBO0lBQzlCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3ZDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLEdBQUcsSUFBQSxvQkFBYSxFQUNuRCxnQkFBZ0IsRUFDaEIsb0JBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FDbEQsQ0FBQTtJQUVELE1BQU0sZUFBZSxHQUFHLElBQUEsbUJBQVcsRUFBQyxLQUFLLElBQUksRUFBRTtRQUM3QyxJQUFJLENBQUM7WUFDSCxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUEsd0NBQXlCLEdBQUUsQ0FBQTtZQUNyRCxPQUFPLFdBQVcsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFBO1FBQ3hDLENBQUM7UUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNwQixPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUM7SUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFTixJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNWLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7WUFFekMsSUFBSSxZQUFZLEtBQUssTUFBTSxFQUFFLENBQUM7Z0JBQzVCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQTtnQkFDbEIsTUFBTSxVQUFVLEdBQUcsbUJBQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQzFDLElBQUksVUFBVSxFQUFFLENBQUM7b0JBQ2YsSUFBSSxDQUFDO3dCQUNILE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO29CQUNsQyxDQUFDO29CQUNELE9BQU8sQ0FBQyxFQUFFLENBQUM7d0JBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQTtvQkFDdEQsQ0FBQztnQkFDSCxDQUFDO2dCQUVELDJDQUEyQztnQkFDM0MsSUFBQSxzQkFBVSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFO29CQUN2RixNQUFNLEVBQUUsT0FBTztvQkFDZixHQUFHLE9BQU87aUJBQ1gsQ0FBQyxDQUFBO2dCQUVGLElBQUEsa0JBQVcsRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsRUFBRTtvQkFDeEYsTUFBTSxFQUFFLE9BQU87b0JBQ2YsR0FBRyxPQUFPO2lCQUNYLENBQUMsQ0FBQTtnQkFFRixrREFBa0Q7Z0JBQ2xELG1CQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUMxQixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdkIsQ0FBQztZQUVELElBQUksTUFBTSxLQUFLLG9EQUF3QztnQkFDckQsWUFBWSxDQUFDLE9BQU8sQ0FBQyxpREFBcUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUVwRSxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxVQUFVLEdBQUcsTUFBTSxlQUFlLEVBQUUsQ0FBQTtnQkFDMUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUNoQixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO29CQUMxQixPQUFNO2dCQUNSLENBQUM7Z0JBRUQsTUFBTSxXQUFXLEdBQUcsSUFBQSw4Q0FBd0IsRUFBQyxZQUFZLENBQUMsQ0FBQTtnQkFDMUQsSUFBSSxXQUFXLEVBQUUsQ0FBQztvQkFDaEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtvQkFDN0IsT0FBTTtnQkFDUixDQUFDO2dCQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNmLENBQUM7WUFDRCxNQUFNLENBQUM7Z0JBQ0wsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUMzQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNOLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQTtJQUVwRixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7QUFDL0IsQ0FBQyxDQUFBO0FBakZZLFFBQUEsY0FBYyxrQkFpRjFCIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29va2llcyBmcm9tICdqcy1jb29raWUnXG5pbXBvcnQgeyB1c2VQYXRobmFtZSwgdXNlUm91dGVyLCB1c2VTZWFyY2hQYXJhbXMgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgeyBwYXJzZUFzU3RyaW5nLCB1c2VRdWVyeVN0YXRlIH0gZnJvbSAnbnVxcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBFRFVDQVRJT05fVkVSSUZZX1VSTF9TRUFSQ0hQQVJBTVNfQUNUSU9OLFxuICBFRFVDQVRJT05fVkVSSUZZSU5HX0xPQ0FMU1RPUkFHRV9JVEVNLFxufSBmcm9tICdAL2FwcC9lZHVjYXRpb24tYXBwbHkvY29uc3RhbnRzJ1xuaW1wb3J0IHsgc2VuZEdBRXZlbnQgfSBmcm9tICdAL3V0aWxzL2d0YWcnXG5pbXBvcnQgeyBmZXRjaFNldHVwU3RhdHVzV2l0aENhY2hlIH0gZnJvbSAnQC91dGlscy9zZXR1cC1zdGF0dXMnXG5pbXBvcnQgeyByZXNvbHZlUG9zdExvZ2luUmVkaXJlY3QgfSBmcm9tICcuLi9zaWduaW4vdXRpbHMvcG9zdC1sb2dpbi1yZWRpcmVjdCdcbmltcG9ydCB7IHRyYWNrRXZlbnQgfSBmcm9tICcuL2Jhc2UvYW1wbGl0dWRlJ1xuXG50eXBlIEFwcEluaXRpYWxpemVyUHJvcHMgPSB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGVcbn1cblxuZXhwb3J0IGNvbnN0IEFwcEluaXRpYWxpemVyID0gKHtcbiAgY2hpbGRyZW4sXG59OiBBcHBJbml0aWFsaXplclByb3BzKSA9PiB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXG4gIGNvbnN0IHNlYXJjaFBhcmFtcyA9IHVzZVNlYXJjaFBhcmFtcygpXG4gIC8vIFRva2VucyBhcmUgbm93IHN0b3JlZCBpbiBjb29raWVzLCBubyBuZWVkIHRvIGNoZWNrIGxvY2FsU3RvcmFnZVxuICBjb25zdCBwYXRobmFtZSA9IHVzZVBhdGhuYW1lKClcbiAgY29uc3QgW2luaXQsIHNldEluaXRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtvYXV0aE5ld1VzZXIsIHNldE9hdXRoTmV3VXNlcl0gPSB1c2VRdWVyeVN0YXRlKFxuICAgICdvYXV0aF9uZXdfdXNlcicsXG4gICAgcGFyc2VBc1N0cmluZy53aXRoT3B0aW9ucyh7IGhpc3Rvcnk6ICdyZXBsYWNlJyB9KSxcbiAgKVxuXG4gIGNvbnN0IGlzU2V0dXBGaW5pc2hlZCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2V0VXBTdGF0dXMgPSBhd2FpdCBmZXRjaFNldHVwU3RhdHVzV2l0aENhY2hlKClcbiAgICAgIHJldHVybiBzZXRVcFN0YXR1cy5zdGVwID09PSAnZmluaXNoZWQnXG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gc2VhcmNoUGFyYW1zLmdldCgnYWN0aW9uJylcblxuICAgICAgaWYgKG9hdXRoTmV3VXNlciA9PT0gJ3RydWUnKSB7XG4gICAgICAgIGxldCB1dG1JbmZvID0gbnVsbFxuICAgICAgICBjb25zdCB1dG1JbmZvU3RyID0gQ29va2llcy5nZXQoJ3V0bV9pbmZvJylcbiAgICAgICAgaWYgKHV0bUluZm9TdHIpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdXRtSW5mbyA9IEpTT04ucGFyc2UodXRtSW5mb1N0cilcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSB1dG1faW5mbyBjb29raWU6JywgZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUcmFjayByZWdpc3RyYXRpb24gZXZlbnQgd2l0aCBVVE0gcGFyYW1zXG4gICAgICAgIHRyYWNrRXZlbnQodXRtSW5mbyA/ICd1c2VyX3JlZ2lzdHJhdGlvbl9zdWNjZXNzX3dpdGhfdXRtJyA6ICd1c2VyX3JlZ2lzdHJhdGlvbl9zdWNjZXNzJywge1xuICAgICAgICAgIG1ldGhvZDogJ29hdXRoJyxcbiAgICAgICAgICAuLi51dG1JbmZvLFxuICAgICAgICB9KVxuXG4gICAgICAgIHNlbmRHQUV2ZW50KHV0bUluZm8gPyAndXNlcl9yZWdpc3RyYXRpb25fc3VjY2Vzc193aXRoX3V0bScgOiAndXNlcl9yZWdpc3RyYXRpb25fc3VjY2VzcycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdvYXV0aCcsXG4gICAgICAgICAgLi4udXRtSW5mbyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBDbGVhbiB1cDogcmVtb3ZlIHV0bV9pbmZvIGNvb2tpZSBhbmQgVVJMIHBhcmFtc1xuICAgICAgICBDb29raWVzLnJlbW92ZSgndXRtX2luZm8nKVxuICAgICAgICBzZXRPYXV0aE5ld1VzZXIobnVsbClcbiAgICAgIH1cblxuICAgICAgaWYgKGFjdGlvbiA9PT0gRURVQ0FUSU9OX1ZFUklGWV9VUkxfU0VBUkNIUEFSQU1TX0FDVElPTilcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oRURVQ0FUSU9OX1ZFUklGWUlOR19MT0NBTFNUT1JBR0VfSVRFTSwgJ3llcycpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGlzRmluaXNoZWQgPSBhd2FpdCBpc1NldHVwRmluaXNoZWQoKVxuICAgICAgICBpZiAoIWlzRmluaXNoZWQpIHtcbiAgICAgICAgICByb3V0ZXIucmVwbGFjZSgnL2luc3RhbGwnKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVkaXJlY3RVcmwgPSByZXNvbHZlUG9zdExvZ2luUmVkaXJlY3Qoc2VhcmNoUGFyYW1zKVxuICAgICAgICBpZiAocmVkaXJlY3RVcmwpIHtcbiAgICAgICAgICBsb2NhdGlvbi5yZXBsYWNlKHJlZGlyZWN0VXJsKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgc2V0SW5pdCh0cnVlKVxuICAgICAgfVxuICAgICAgY2F0Y2gge1xuICAgICAgICByb3V0ZXIucmVwbGFjZSgnL3NpZ25pbicpXG4gICAgICB9XG4gICAgfSkoKVxuICB9LCBbaXNTZXR1cEZpbmlzaGVkLCByb3V0ZXIsIHBhdGhuYW1lLCBzZWFyY2hQYXJhbXMsIG9hdXRoTmV3VXNlciwgc2V0T2F1dGhOZXdVc2VyXSlcblxuICByZXR1cm4gaW5pdCA/IGNoaWxkcmVuIDogbnVsbFxufVxuIl19