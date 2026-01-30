"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactScan = ReactScan;
const react_1 = require("react");
const react_scan_1 = require("react-scan");
const config_1 = require("@/config");
function ReactScan() {
    (0, react_1.useEffect)(() => {
        if (config_1.IS_DEV) {
            (0, react_scan_1.scan)({
                enabled: true,
                // HACK: react-scan's getIsProduction() incorrectly detects Next.js dev as production
                // because Next.js devtools overlay uses production React build
                // Issue: https://github.com/aidenybai/react-scan/issues/402
                // TODO: remove this option after upstream fix
                dangerouslyForceRunInProduction: true,
            });
        }
    }, []);
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjYW4udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBTVosOEJBZUM7QUFuQkQsaUNBQWlDO0FBQ2pDLDJDQUFpQztBQUNqQyxxQ0FBaUM7QUFFakMsU0FBZ0IsU0FBUztJQUN2QixJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUNYLElBQUEsaUJBQUksRUFBQztnQkFDSCxPQUFPLEVBQUUsSUFBSTtnQkFDYixxRkFBcUY7Z0JBQ3JGLCtEQUErRDtnQkFDL0QsNERBQTREO2dCQUM1RCw4Q0FBOEM7Z0JBQzlDLCtCQUErQixFQUFFLElBQUk7YUFDdEMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztJQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUVOLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHNjYW4gfSBmcm9tICdyZWFjdC1zY2FuJ1xuaW1wb3J0IHsgSVNfREVWIH0gZnJvbSAnQC9jb25maWcnXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFjdFNjYW4oKSB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKElTX0RFVikge1xuICAgICAgc2Nhbih7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIC8vIEhBQ0s6IHJlYWN0LXNjYW4ncyBnZXRJc1Byb2R1Y3Rpb24oKSBpbmNvcnJlY3RseSBkZXRlY3RzIE5leHQuanMgZGV2IGFzIHByb2R1Y3Rpb25cbiAgICAgICAgLy8gYmVjYXVzZSBOZXh0LmpzIGRldnRvb2xzIG92ZXJsYXkgdXNlcyBwcm9kdWN0aW9uIFJlYWN0IGJ1aWxkXG4gICAgICAgIC8vIElzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYWlkZW55YmFpL3JlYWN0LXNjYW4vaXNzdWVzLzQwMlxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgdGhpcyBvcHRpb24gYWZ0ZXIgdXBzdHJlYW0gZml4XG4gICAgICAgIGRhbmdlcm91c2x5Rm9yY2VSdW5JblByb2R1Y3Rpb246IHRydWUsXG4gICAgICB9KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgcmV0dXJuIG51bGxcbn1cbiJdfQ==