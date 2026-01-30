"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessTokenOrRelogin = refreshAccessTokenOrRelogin;
const config_1 = require("@/config");
const utils_1 = require("@/utils");
const LOCAL_STORAGE_KEY = 'is_other_tab_refreshing';
let isRefreshing = false;
function waitUntilTokenRefreshed() {
    return new Promise((resolve) => {
        function _check() {
            const isRefreshingSign = globalThis.localStorage.getItem(LOCAL_STORAGE_KEY);
            if ((isRefreshingSign && isRefreshingSign === '1') || isRefreshing) {
                setTimeout(() => {
                    _check();
                }, 1000);
            }
            else {
                resolve();
            }
        }
        _check();
    });
}
const isRefreshingSignAvailable = function (delta) {
    const nowTime = new Date().getTime();
    const lastTime = globalThis.localStorage.getItem('last_refresh_time') || '0';
    return nowTime - Number.parseInt(lastTime) <= delta;
};
// only one request can send
async function getNewAccessToken(timeout) {
    try {
        const isRefreshingSign = globalThis.localStorage.getItem(LOCAL_STORAGE_KEY);
        if ((isRefreshingSign && isRefreshingSign === '1' && isRefreshingSignAvailable(timeout)) || isRefreshing) {
            await waitUntilTokenRefreshed();
        }
        else {
            isRefreshing = true;
            globalThis.localStorage.setItem(LOCAL_STORAGE_KEY, '1');
            globalThis.localStorage.setItem('last_refresh_time', new Date().getTime().toString());
            globalThis.addEventListener('beforeunload', releaseRefreshLock);
            // Do not use baseFetch to refresh tokens.
            // If a 401 response occurs and baseFetch itself attempts to refresh the token,
            // it can lead to an infinite loop if the refresh attempt also returns 401.
            // To avoid this, handle token refresh separately in a dedicated function
            // that does not call baseFetch and uses a single retry mechanism.
            const [error, ret] = await (0, utils_1.fetchWithRetry)(globalThis.fetch(`${config_1.API_PREFIX}/refresh-token`, {
                method: 'POST',
                credentials: 'include', // Important: include cookies in the request
                headers: {
                    'Content-Type': 'application/json;utf-8',
                },
                // No body needed - refresh token is in cookie
            }));
            if (error) {
                return Promise.reject(error);
            }
            else {
                if (ret.status === 401)
                    return Promise.reject(ret);
            }
        }
    }
    catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
    finally {
        releaseRefreshLock();
    }
}
function releaseRefreshLock() {
    // Always clear the refresh lock to avoid cross-tab deadlocks.
    // This is safe to call multiple times and from tabs that were only waiting.
    isRefreshing = false;
    globalThis.localStorage.removeItem(LOCAL_STORAGE_KEY);
    globalThis.localStorage.removeItem('last_refresh_time');
    globalThis.removeEventListener('beforeunload', releaseRefreshLock);
}
async function refreshAccessTokenOrRelogin(timeout) {
    return Promise.race([new Promise((resolve, reject) => setTimeout(() => {
            releaseRefreshLock();
            reject(new Error('request timeout'));
        }, timeout)), getNewAccessToken(timeout)]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC10b2tlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlZnJlc2gtdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFrRkEsa0VBS0M7QUF2RkQscUNBQXFDO0FBQ3JDLG1DQUF3QztBQUV4QyxNQUFNLGlCQUFpQixHQUFHLHlCQUF5QixDQUFBO0FBRW5ELElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQTtBQUN4QixTQUFTLHVCQUF1QjtJQUM5QixPQUFPLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDbkMsU0FBUyxNQUFNO1lBQ2IsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1lBQzNFLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxnQkFBZ0IsS0FBSyxHQUFHLENBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDbkUsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDZCxNQUFNLEVBQUUsQ0FBQTtnQkFDVixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDVixDQUFDO2lCQUNJLENBQUM7Z0JBQ0osT0FBTyxFQUFFLENBQUE7WUFDWCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sRUFBRSxDQUFBO0lBQ1YsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsTUFBTSx5QkFBeUIsR0FBRyxVQUFVLEtBQWE7SUFDdkQsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNwQyxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQTtJQUM1RSxPQUFPLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQTtBQUNyRCxDQUFDLENBQUE7QUFFRCw0QkFBNEI7QUFDNUIsS0FBSyxVQUFVLGlCQUFpQixDQUFDLE9BQWU7SUFDOUMsSUFBSSxDQUFDO1FBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBQzNFLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxnQkFBZ0IsS0FBSyxHQUFHLElBQUkseUJBQXlCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUN6RyxNQUFNLHVCQUF1QixFQUFFLENBQUE7UUFDakMsQ0FBQzthQUNJLENBQUM7WUFDSixZQUFZLEdBQUcsSUFBSSxDQUFBO1lBQ25CLFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ3ZELFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUNyRixVQUFVLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUE7WUFFL0QsMENBQTBDO1lBQzFDLCtFQUErRTtZQUMvRSwyRUFBMkU7WUFDM0UseUVBQXlFO1lBQ3pFLGtFQUFrRTtZQUNsRSxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sSUFBQSxzQkFBYyxFQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxtQkFBVSxnQkFBZ0IsRUFBRTtnQkFDeEYsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsV0FBVyxFQUFFLFNBQVMsRUFBRSw0Q0FBNEM7Z0JBQ3BFLE9BQU8sRUFBRTtvQkFDUCxjQUFjLEVBQUUsd0JBQXdCO2lCQUN6QztnQkFDRCw4Q0FBOEM7YUFDL0MsQ0FBQyxDQUFDLENBQUE7WUFDSCxJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUNWLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUM5QixDQUFDO2lCQUNJLENBQUM7Z0JBQ0osSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUc7b0JBQ3BCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM5QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDOUIsQ0FBQztZQUNPLENBQUM7UUFDUCxrQkFBa0IsRUFBRSxDQUFBO0lBQ3RCLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxrQkFBa0I7SUFDekIsOERBQThEO0lBQzlELDRFQUE0RTtJQUM1RSxZQUFZLEdBQUcsS0FBSyxDQUFBO0lBQ3BCLFVBQVUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFDckQsVUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtJQUN2RCxVQUFVLENBQUMsbUJBQW1CLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUE7QUFDcEUsQ0FBQztBQUVNLEtBQUssVUFBVSwyQkFBMkIsQ0FBQyxPQUFlO0lBQy9ELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUMxRSxrQkFBa0IsRUFBRSxDQUFBO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7UUFDdEMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElfUFJFRklYIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyBmZXRjaFdpdGhSZXRyeSB9IGZyb20gJ0AvdXRpbHMnXG5cbmNvbnN0IExPQ0FMX1NUT1JBR0VfS0VZID0gJ2lzX290aGVyX3RhYl9yZWZyZXNoaW5nJ1xuXG5sZXQgaXNSZWZyZXNoaW5nID0gZmFsc2VcbmZ1bmN0aW9uIHdhaXRVbnRpbFRva2VuUmVmcmVzaGVkKCkge1xuICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICBmdW5jdGlvbiBfY2hlY2soKSB7XG4gICAgICBjb25zdCBpc1JlZnJlc2hpbmdTaWduID0gZ2xvYmFsVGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9TVE9SQUdFX0tFWSlcbiAgICAgIGlmICgoaXNSZWZyZXNoaW5nU2lnbiAmJiBpc1JlZnJlc2hpbmdTaWduID09PSAnMScpIHx8IGlzUmVmcmVzaGluZykge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBfY2hlY2soKVxuICAgICAgICB9LCAxMDAwKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuICAgIH1cbiAgICBfY2hlY2soKVxuICB9KVxufVxuXG5jb25zdCBpc1JlZnJlc2hpbmdTaWduQXZhaWxhYmxlID0gZnVuY3Rpb24gKGRlbHRhOiBudW1iZXIpIHtcbiAgY29uc3Qgbm93VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gIGNvbnN0IGxhc3RUaW1lID0gZ2xvYmFsVGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdF9yZWZyZXNoX3RpbWUnKSB8fCAnMCdcbiAgcmV0dXJuIG5vd1RpbWUgLSBOdW1iZXIucGFyc2VJbnQobGFzdFRpbWUpIDw9IGRlbHRhXG59XG5cbi8vIG9ubHkgb25lIHJlcXVlc3QgY2FuIHNlbmRcbmFzeW5jIGZ1bmN0aW9uIGdldE5ld0FjY2Vzc1Rva2VuKHRpbWVvdXQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlzUmVmcmVzaGluZ1NpZ24gPSBnbG9iYWxUaGlzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKExPQ0FMX1NUT1JBR0VfS0VZKVxuICAgIGlmICgoaXNSZWZyZXNoaW5nU2lnbiAmJiBpc1JlZnJlc2hpbmdTaWduID09PSAnMScgJiYgaXNSZWZyZXNoaW5nU2lnbkF2YWlsYWJsZSh0aW1lb3V0KSkgfHwgaXNSZWZyZXNoaW5nKSB7XG4gICAgICBhd2FpdCB3YWl0VW50aWxUb2tlblJlZnJlc2hlZCgpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaXNSZWZyZXNoaW5nID0gdHJ1ZVxuICAgICAgZ2xvYmFsVGhpcy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShMT0NBTF9TVE9SQUdFX0tFWSwgJzEnKVxuICAgICAgZ2xvYmFsVGhpcy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdF9yZWZyZXNoX3RpbWUnLCBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpKVxuICAgICAgZ2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCByZWxlYXNlUmVmcmVzaExvY2spXG5cbiAgICAgIC8vIERvIG5vdCB1c2UgYmFzZUZldGNoIHRvIHJlZnJlc2ggdG9rZW5zLlxuICAgICAgLy8gSWYgYSA0MDEgcmVzcG9uc2Ugb2NjdXJzIGFuZCBiYXNlRmV0Y2ggaXRzZWxmIGF0dGVtcHRzIHRvIHJlZnJlc2ggdGhlIHRva2VuLFxuICAgICAgLy8gaXQgY2FuIGxlYWQgdG8gYW4gaW5maW5pdGUgbG9vcCBpZiB0aGUgcmVmcmVzaCBhdHRlbXB0IGFsc28gcmV0dXJucyA0MDEuXG4gICAgICAvLyBUbyBhdm9pZCB0aGlzLCBoYW5kbGUgdG9rZW4gcmVmcmVzaCBzZXBhcmF0ZWx5IGluIGEgZGVkaWNhdGVkIGZ1bmN0aW9uXG4gICAgICAvLyB0aGF0IGRvZXMgbm90IGNhbGwgYmFzZUZldGNoIGFuZCB1c2VzIGEgc2luZ2xlIHJldHJ5IG1lY2hhbmlzbS5cbiAgICAgIGNvbnN0IFtlcnJvciwgcmV0XSA9IGF3YWl0IGZldGNoV2l0aFJldHJ5KGdsb2JhbFRoaXMuZmV0Y2goYCR7QVBJX1BSRUZJWH0vcmVmcmVzaC10b2tlbmAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsIC8vIEltcG9ydGFudDogaW5jbHVkZSBjb29raWVzIGluIHRoZSByZXF1ZXN0XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247dXRmLTgnLFxuICAgICAgICB9LFxuICAgICAgICAvLyBObyBib2R5IG5lZWRlZCAtIHJlZnJlc2ggdG9rZW4gaXMgaW4gY29va2llXG4gICAgICB9KSlcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKHJldC5zdGF0dXMgPT09IDQwMSlcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmV0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcilcbiAgfVxuICBmaW5hbGx5IHtcbiAgICByZWxlYXNlUmVmcmVzaExvY2soKVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbGVhc2VSZWZyZXNoTG9jaygpIHtcbiAgLy8gQWx3YXlzIGNsZWFyIHRoZSByZWZyZXNoIGxvY2sgdG8gYXZvaWQgY3Jvc3MtdGFiIGRlYWRsb2Nrcy5cbiAgLy8gVGhpcyBpcyBzYWZlIHRvIGNhbGwgbXVsdGlwbGUgdGltZXMgYW5kIGZyb20gdGFicyB0aGF0IHdlcmUgb25seSB3YWl0aW5nLlxuICBpc1JlZnJlc2hpbmcgPSBmYWxzZVxuICBnbG9iYWxUaGlzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKExPQ0FMX1NUT1JBR0VfS0VZKVxuICBnbG9iYWxUaGlzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdsYXN0X3JlZnJlc2hfdGltZScpXG4gIGdsb2JhbFRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgcmVsZWFzZVJlZnJlc2hMb2NrKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVmcmVzaEFjY2Vzc1Rva2VuT3JSZWxvZ2luKHRpbWVvdXQ6IG51bWJlcikge1xuICByZXR1cm4gUHJvbWlzZS5yYWNlKFtuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICByZWxlYXNlUmVmcmVzaExvY2soKVxuICAgIHJlamVjdChuZXcgRXJyb3IoJ3JlcXVlc3QgdGltZW91dCcpKVxuICB9LCB0aW1lb3V0KSksIGdldE5ld0FjY2Vzc1Rva2VuKHRpbWVvdXQpXSlcbn1cbiJdfQ==