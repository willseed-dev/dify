"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDocumentTitle;
const ahooks_1 = require("ahooks");
const react_1 = require("react");
const global_public_context_1 = require("@/context/global-public-context");
const var_1 = require("@/utils/var");
function useDocumentTitle(title) {
    const isPending = (0, global_public_context_1.useIsSystemFeaturesPending)();
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const prefix = title ? `${title} - ` : '';
    let titleStr = '';
    let favicon = '';
    if (isPending === false) {
        if (systemFeatures.branding.enabled) {
            titleStr = `${prefix}${systemFeatures.branding.application_title}`;
            favicon = systemFeatures.branding.favicon;
        }
        else {
            titleStr = `${prefix}Dify`;
            favicon = `${var_1.basePath}/favicon.ico`;
        }
    }
    (0, ahooks_1.useTitle)(titleStr);
    (0, react_1.useEffect)(() => {
        let apple = null;
        if (systemFeatures.branding.favicon) {
            document
                .querySelectorAll('link[rel=\'icon\'], link[rel=\'shortcut icon\'], link[rel=\'apple-touch-icon\'], link[rel=\'mask-icon\']')
                .forEach(n => n.parentNode?.removeChild(n));
            apple = document.createElement('link');
            apple.rel = 'apple-touch-icon';
            apple.href = systemFeatures.branding.favicon;
            document.head.appendChild(apple);
        }
        return () => {
            apple?.remove();
        };
    }, [systemFeatures.branding.favicon]);
    (0, ahooks_1.useFavicon)(favicon);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWRvY3VtZW50LXRpdGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWRvY3VtZW50LXRpdGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBTVosbUNBcUNDO0FBMUNELG1DQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMsMkVBQWtHO0FBQ2xHLHFDQUFzQztBQUV0QyxTQUF3QixnQkFBZ0IsQ0FBQyxLQUFhO0lBQ3BELE1BQU0sU0FBUyxHQUFHLElBQUEsa0RBQTBCLEdBQUUsQ0FBQTtJQUM5QyxNQUFNLGNBQWMsR0FBRyxJQUFBLDRDQUFvQixFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQ3pDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQTtJQUNqQixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7SUFDaEIsSUFBSSxTQUFTLEtBQUssS0FBSyxFQUFFLENBQUM7UUFDeEIsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLFFBQVEsR0FBRyxHQUFHLE1BQU0sR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbEUsT0FBTyxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFBO1FBQzNDLENBQUM7YUFDSSxDQUFDO1lBQ0osUUFBUSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUE7WUFDMUIsT0FBTyxHQUFHLEdBQUcsY0FBUSxjQUFjLENBQUE7UUFDckMsQ0FBQztJQUNILENBQUM7SUFDRCxJQUFBLGlCQUFRLEVBQUMsUUFBUSxDQUFDLENBQUE7SUFDbEIsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLElBQUksS0FBSyxHQUEyQixJQUFJLENBQUE7UUFDeEMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLFFBQVE7aUJBQ0wsZ0JBQWdCLENBQ2YsMEdBQTBHLENBQzNHO2lCQUNBLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFN0MsS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDdEMsS0FBSyxDQUFDLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQTtZQUM5QixLQUFLLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFBO1lBQzVDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2xDLENBQUM7UUFFRCxPQUFPLEdBQUcsRUFBRTtZQUNWLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQTtRQUNqQixDQUFDLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7SUFDckMsSUFBQSxtQkFBVSxFQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB7IHVzZUZhdmljb24sIHVzZVRpdGxlIH0gZnJvbSAnYWhvb2tzJ1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VHbG9iYWxQdWJsaWNTdG9yZSwgdXNlSXNTeXN0ZW1GZWF0dXJlc1BlbmRpbmcgfSBmcm9tICdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0J1xuaW1wb3J0IHsgYmFzZVBhdGggfSBmcm9tICdAL3V0aWxzL3ZhcidcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlRG9jdW1lbnRUaXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gIGNvbnN0IGlzUGVuZGluZyA9IHVzZUlzU3lzdGVtRmVhdHVyZXNQZW5kaW5nKClcbiAgY29uc3Qgc3lzdGVtRmVhdHVyZXMgPSB1c2VHbG9iYWxQdWJsaWNTdG9yZShzID0+IHMuc3lzdGVtRmVhdHVyZXMpXG4gIGNvbnN0IHByZWZpeCA9IHRpdGxlID8gYCR7dGl0bGV9IC0gYCA6ICcnXG4gIGxldCB0aXRsZVN0ciA9ICcnXG4gIGxldCBmYXZpY29uID0gJydcbiAgaWYgKGlzUGVuZGluZyA9PT0gZmFsc2UpIHtcbiAgICBpZiAoc3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcuZW5hYmxlZCkge1xuICAgICAgdGl0bGVTdHIgPSBgJHtwcmVmaXh9JHtzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy5hcHBsaWNhdGlvbl90aXRsZX1gXG4gICAgICBmYXZpY29uID0gc3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcuZmF2aWNvblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRpdGxlU3RyID0gYCR7cHJlZml4fURpZnlgXG4gICAgICBmYXZpY29uID0gYCR7YmFzZVBhdGh9L2Zhdmljb24uaWNvYFxuICAgIH1cbiAgfVxuICB1c2VUaXRsZSh0aXRsZVN0cilcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgYXBwbGU6IEhUTUxMaW5rRWxlbWVudCB8IG51bGwgPSBudWxsXG4gICAgaWYgKHN5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLmZhdmljb24pIHtcbiAgICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICdsaW5rW3JlbD1cXCdpY29uXFwnXSwgbGlua1tyZWw9XFwnc2hvcnRjdXQgaWNvblxcJ10sIGxpbmtbcmVsPVxcJ2FwcGxlLXRvdWNoLWljb25cXCddLCBsaW5rW3JlbD1cXCdtYXNrLWljb25cXCddJyxcbiAgICAgICAgKVxuICAgICAgICAuZm9yRWFjaChuID0+IG4ucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQobikpXG5cbiAgICAgIGFwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpXG4gICAgICBhcHBsZS5yZWwgPSAnYXBwbGUtdG91Y2gtaWNvbidcbiAgICAgIGFwcGxlLmhyZWYgPSBzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy5mYXZpY29uXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGFwcGxlKVxuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBhcHBsZT8ucmVtb3ZlKClcbiAgICB9XG4gIH0sIFtzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy5mYXZpY29uXSlcbiAgdXNlRmF2aWNvbihmYXZpY29uKVxufVxuIl19