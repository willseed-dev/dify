"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const use_common_1 = require("@/service/use-common");
const loading_1 = require("./base/loading");
const Splash = () => {
    // would auto redirect to signin page if not logged in
    const { isLoading, data: loginData } = (0, use_common_1.useIsLogin)();
    const isLoggedIn = loginData?.logged_in;
    if (isLoading || !isLoggedIn) {
        return (<div className="fixed inset-0 z-[9999999] flex h-full items-center justify-center bg-background-body">
        <loading_1.default />
      </div>);
    }
    return null;
};
exports.default = React.memo(Splash);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsYXNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3BsYXNoLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUVaLCtCQUE4QjtBQUM5QixxREFBaUQ7QUFDakQsNENBQW9DO0FBRXBDLE1BQU0sTUFBTSxHQUEwQixHQUFHLEVBQUU7SUFDekMsc0RBQXNEO0lBQ3RELE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsdUJBQVUsR0FBRSxDQUFBO0lBQ25ELE1BQU0sVUFBVSxHQUFHLFNBQVMsRUFBRSxTQUFTLENBQUE7SUFFdkMsSUFBSSxTQUFTLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM3QixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNGQUFzRixDQUNuRztRQUFBLENBQUMsaUJBQU8sQ0FBQyxBQUFELEVBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0lBQ0QsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDLCBQcm9wc1dpdGhDaGlsZHJlbiB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VJc0xvZ2luIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgTG9hZGluZyBmcm9tICcuL2Jhc2UvbG9hZGluZydcblxuY29uc3QgU3BsYXNoOiBGQzxQcm9wc1dpdGhDaGlsZHJlbj4gPSAoKSA9PiB7XG4gIC8vIHdvdWxkIGF1dG8gcmVkaXJlY3QgdG8gc2lnbmluIHBhZ2UgaWYgbm90IGxvZ2dlZCBpblxuICBjb25zdCB7IGlzTG9hZGluZywgZGF0YTogbG9naW5EYXRhIH0gPSB1c2VJc0xvZ2luKClcbiAgY29uc3QgaXNMb2dnZWRJbiA9IGxvZ2luRGF0YT8ubG9nZ2VkX2luXG5cbiAgaWYgKGlzTG9hZGluZyB8fCAhaXNMb2dnZWRJbikge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei1bOTk5OTk5OV0gZmxleCBoLWZ1bGwgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWJhY2tncm91bmQtYm9keVwiPlxuICAgICAgICA8TG9hZGluZyAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG4gIHJldHVybiBudWxsXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKFNwbGFzaClcbiJdfQ==