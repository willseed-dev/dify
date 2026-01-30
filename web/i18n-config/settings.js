"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitOptions = getInitOptions;
const resources_1 = require("./resources");
function getInitOptions() {
    return {
        // We do not have en for fallback
        load: 'currentOnly',
        fallbackLng: 'en-US',
        partialBundledLanguages: true,
        keySeparator: false,
        ns: resources_1.namespacesCamelCase,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHdDQVNDO0FBWEQsMkNBQWlEO0FBRWpELFNBQWdCLGNBQWM7SUFDNUIsT0FBTztRQUNMLGlDQUFpQztRQUNqQyxJQUFJLEVBQUUsYUFBYTtRQUNuQixXQUFXLEVBQUUsT0FBTztRQUNwQix1QkFBdUIsRUFBRSxJQUFJO1FBQzdCLFlBQVksRUFBRSxLQUFLO1FBQ25CLEVBQUUsRUFBRSwrQkFBbUI7S0FDeEIsQ0FBQTtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEluaXRPcHRpb25zIH0gZnJvbSAnaTE4bmV4dCdcbmltcG9ydCB7IG5hbWVzcGFjZXNDYW1lbENhc2UgfSBmcm9tICcuL3Jlc291cmNlcydcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRPcHRpb25zKCk6IEluaXRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICAvLyBXZSBkbyBub3QgaGF2ZSBlbiBmb3IgZmFsbGJhY2tcbiAgICBsb2FkOiAnY3VycmVudE9ubHknLFxuICAgIGZhbGxiYWNrTG5nOiAnZW4tVVMnLFxuICAgIHBhcnRpYWxCdW5kbGVkTGFuZ3VhZ2VzOiB0cnVlLFxuICAgIGtleVNlcGFyYXRvcjogZmFsc2UsXG4gICAgbnM6IG5hbWVzcGFjZXNDYW1lbENhc2UsXG4gIH1cbn1cbiJdfQ==