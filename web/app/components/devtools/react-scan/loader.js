"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactScanLoader = void 0;
const react_1 = require("react");
const config_1 = require("@/config");
const ReactScan = (0, react_1.lazy)(() => Promise.resolve().then(() => require('./scan')).then(module => ({
    default: module.ReactScan,
})));
const ReactScanLoader = () => {
    if (!config_1.IS_DEV)
        return null;
    return (<react_1.Suspense fallback={null}>
      <ReactScan />
    </react_1.Suspense>);
};
exports.ReactScanLoader = ReactScanLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOzs7QUFFWixpQ0FBc0M7QUFDdEMscUNBQWlDO0FBRWpDLE1BQU0sU0FBUyxHQUFHLElBQUEsWUFBSSxFQUFDLEdBQUcsRUFBRSxDQUMxQixxQ0FBTyxRQUFRLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQVM7Q0FDMUIsQ0FBQyxDQUFDLENBQ0osQ0FBQTtBQUVNLE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRTtJQUNsQyxJQUFJLENBQUMsZUFBTTtRQUNULE9BQU8sSUFBSSxDQUFBO0lBRWIsT0FBTyxDQUNMLENBQUMsZ0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDdkI7TUFBQSxDQUFDLFNBQVMsQ0FBQyxBQUFELEVBQ1o7SUFBQSxFQUFFLGdCQUFRLENBQUMsQ0FDWixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBVFksUUFBQSxlQUFlLG1CQVMzQiIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgeyBsYXp5LCBTdXNwZW5zZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgSVNfREVWIH0gZnJvbSAnQC9jb25maWcnXG5cbmNvbnN0IFJlYWN0U2NhbiA9IGxhenkoKCkgPT5cbiAgaW1wb3J0KCcuL3NjYW4nKS50aGVuKG1vZHVsZSA9PiAoe1xuICAgIGRlZmF1bHQ6IG1vZHVsZS5SZWFjdFNjYW4sXG4gIH0pKSxcbilcblxuZXhwb3J0IGNvbnN0IFJlYWN0U2NhbkxvYWRlciA9ICgpID0+IHtcbiAgaWYgKCFJU19ERVYpXG4gICAgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17bnVsbH0+XG4gICAgICA8UmVhY3RTY2FuIC8+XG4gICAgPC9TdXNwZW5zZT5cbiAgKVxufVxuIl19