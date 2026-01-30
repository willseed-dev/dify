"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.openOAuthPopup = exports.useOAuthCallback = void 0;
const react_1 = require("react");
const urlValidation_1 = require("@/utils/urlValidation");
const useOAuthCallback = () => {
    (0, react_1.useEffect)(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const subscriptionId = urlParams.get('subscription_id');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        if (window.opener) {
            // Use window.opener.origin instead of '*' for security
            const targetOrigin = window.opener?.origin || '*';
            if (subscriptionId) {
                window.opener.postMessage({
                    type: 'oauth_callback',
                    success: true,
                    subscriptionId,
                }, targetOrigin);
            }
            else if (error) {
                window.opener.postMessage({
                    type: 'oauth_callback',
                    success: false,
                    error,
                    errorDescription,
                }, targetOrigin);
            }
            else {
                window.opener.postMessage({
                    type: 'oauth_callback',
                }, targetOrigin);
            }
            window.close();
        }
    }, []);
};
exports.useOAuthCallback = useOAuthCallback;
const openOAuthPopup = (url, callback) => {
    const width = 600;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    (0, urlValidation_1.validateRedirectUrl)(url);
    const popup = window.open(url, 'OAuth', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);
    const handleMessage = (event) => {
        if (event.data?.type === 'oauth_callback') {
            window.removeEventListener('message', handleMessage);
            callback(event.data);
        }
    };
    window.addEventListener('message', handleMessage);
    // Fallback for window close detection
    const checkClosed = setInterval(() => {
        if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);
            callback();
        }
    }, 1000);
    return popup;
};
exports.openOAuthPopup = openOAuthPopup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW9hdXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLW9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7OztBQUNaLGlDQUFpQztBQUNqQyx5REFBMkQ7QUFFcEQsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUU7SUFDbkMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLE1BQU0sU0FBUyxHQUFHLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDN0QsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBQ3ZELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDcEMsTUFBTSxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFFM0QsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbEIsdURBQXVEO1lBQ3ZELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLEdBQUcsQ0FBQTtZQUVqRCxJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztvQkFDeEIsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsY0FBYztpQkFDZixFQUFFLFlBQVksQ0FBQyxDQUFBO1lBQ2xCLENBQUM7aUJBQ0ksSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztvQkFDeEIsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSztvQkFDTCxnQkFBZ0I7aUJBQ2pCLEVBQUUsWUFBWSxDQUFDLENBQUE7WUFDbEIsQ0FBQztpQkFDSSxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO29CQUN4QixJQUFJLEVBQUUsZ0JBQWdCO2lCQUN2QixFQUFFLFlBQVksQ0FBQyxDQUFBO1lBQ2xCLENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDaEIsQ0FBQztJQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNSLENBQUMsQ0FBQTtBQWxDWSxRQUFBLGdCQUFnQixvQkFrQzVCO0FBRU0sTUFBTSxjQUFjLEdBQUcsQ0FBQyxHQUFXLEVBQUUsUUFBOEIsRUFBRSxFQUFFO0lBQzVFLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQTtJQUNqQixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUE7SUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzdELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUU5RCxJQUFBLG1DQUFtQixFQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3ZCLEdBQUcsRUFDSCxPQUFPLEVBQ1AsU0FBUyxLQUFLLFdBQVcsTUFBTSxTQUFTLElBQUksUUFBUSxHQUFHLGlCQUFpQixDQUN6RSxDQUFBO0lBRUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUU7UUFDNUMsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUE7WUFDcEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN0QixDQUFDO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQTtJQUVqRCxzQ0FBc0M7SUFDdEMsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtRQUNuQyxJQUFJLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUNsQixhQUFhLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDMUIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQTtZQUNwRCxRQUFRLEVBQUUsQ0FBQTtRQUNaLENBQUM7SUFDSCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFFUixPQUFPLEtBQUssQ0FBQTtBQUNkLENBQUMsQ0FBQTtBQWhDWSxRQUFBLGNBQWMsa0JBZ0MxQiIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB2YWxpZGF0ZVJlZGlyZWN0VXJsIH0gZnJvbSAnQC91dGlscy91cmxWYWxpZGF0aW9uJ1xuXG5leHBvcnQgY29uc3QgdXNlT0F1dGhDYWxsYmFjayA9ICgpID0+IHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uSWQgPSB1cmxQYXJhbXMuZ2V0KCdzdWJzY3JpcHRpb25faWQnKVxuICAgIGNvbnN0IGVycm9yID0gdXJsUGFyYW1zLmdldCgnZXJyb3InKVxuICAgIGNvbnN0IGVycm9yRGVzY3JpcHRpb24gPSB1cmxQYXJhbXMuZ2V0KCdlcnJvcl9kZXNjcmlwdGlvbicpXG5cbiAgICBpZiAod2luZG93Lm9wZW5lcikge1xuICAgICAgLy8gVXNlIHdpbmRvdy5vcGVuZXIub3JpZ2luIGluc3RlYWQgb2YgJyonIGZvciBzZWN1cml0eVxuICAgICAgY29uc3QgdGFyZ2V0T3JpZ2luID0gd2luZG93Lm9wZW5lcj8ub3JpZ2luIHx8ICcqJ1xuXG4gICAgICBpZiAoc3Vic2NyaXB0aW9uSWQpIHtcbiAgICAgICAgd2luZG93Lm9wZW5lci5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgdHlwZTogJ29hdXRoX2NhbGxiYWNrJyxcbiAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgIHN1YnNjcmlwdGlvbklkLFxuICAgICAgICB9LCB0YXJnZXRPcmlnaW4pXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChlcnJvcikge1xuICAgICAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICB0eXBlOiAnb2F1dGhfY2FsbGJhY2snLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGVycm9yLFxuICAgICAgICAgIGVycm9yRGVzY3JpcHRpb24sXG4gICAgICAgIH0sIHRhcmdldE9yaWdpbilcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICB0eXBlOiAnb2F1dGhfY2FsbGJhY2snLFxuICAgICAgICB9LCB0YXJnZXRPcmlnaW4pXG4gICAgICB9XG4gICAgICB3aW5kb3cuY2xvc2UoKVxuICAgIH1cbiAgfSwgW10pXG59XG5cbmV4cG9ydCBjb25zdCBvcGVuT0F1dGhQb3B1cCA9ICh1cmw6IHN0cmluZywgY2FsbGJhY2s6IChkYXRhPzogYW55KSA9PiB2b2lkKSA9PiB7XG4gIGNvbnN0IHdpZHRoID0gNjAwXG4gIGNvbnN0IGhlaWdodCA9IDYwMFxuICBjb25zdCBsZWZ0ID0gd2luZG93LnNjcmVlblggKyAod2luZG93Lm91dGVyV2lkdGggLSB3aWR0aCkgLyAyXG4gIGNvbnN0IHRvcCA9IHdpbmRvdy5zY3JlZW5ZICsgKHdpbmRvdy5vdXRlckhlaWdodCAtIGhlaWdodCkgLyAyXG5cbiAgdmFsaWRhdGVSZWRpcmVjdFVybCh1cmwpXG4gIGNvbnN0IHBvcHVwID0gd2luZG93Lm9wZW4oXG4gICAgdXJsLFxuICAgICdPQXV0aCcsXG4gICAgYHdpZHRoPSR7d2lkdGh9LGhlaWdodD0ke2hlaWdodH0sbGVmdD0ke2xlZnR9LHRvcD0ke3RvcH0sc2Nyb2xsYmFycz15ZXNgLFxuICApXG5cbiAgY29uc3QgaGFuZGxlTWVzc2FnZSA9IChldmVudDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmRhdGE/LnR5cGUgPT09ICdvYXV0aF9jYWxsYmFjaycpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlTWVzc2FnZSlcbiAgICAgIGNhbGxiYWNrKGV2ZW50LmRhdGEpXG4gICAgfVxuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kbGVNZXNzYWdlKVxuXG4gIC8vIEZhbGxiYWNrIGZvciB3aW5kb3cgY2xvc2UgZGV0ZWN0aW9uXG4gIGNvbnN0IGNoZWNrQ2xvc2VkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGlmIChwb3B1cD8uY2xvc2VkKSB7XG4gICAgICBjbGVhckludGVydmFsKGNoZWNrQ2xvc2VkKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kbGVNZXNzYWdlKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfSwgMTAwMClcblxuICByZXR1cm4gcG9wdXBcbn1cbiJdfQ==