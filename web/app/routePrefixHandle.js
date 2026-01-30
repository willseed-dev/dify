"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoutePrefixHandle;
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const var_1 = require("@/utils/var");
function RoutePrefixHandle() {
    const pathname = (0, navigation_1.usePathname)();
    const handleRouteChange = () => {
        const addPrefixToImg = (e) => {
            const url = new URL(e.src);
            const prefix = url.pathname.slice(0, var_1.basePath.length);
            if (prefix !== var_1.basePath && !url.href.startsWith('blob:') && !url.href.startsWith('data:') && !url.href.startsWith('http')) {
                url.pathname = var_1.basePath + url.pathname;
                e.src = url.toString();
            }
        };
        // create an observer instance
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // listen for newly added img tags
                    mutation.addedNodes.forEach((node) => {
                        if ((node.tagName) === 'IMG')
                            addPrefixToImg(node);
                    });
                }
                else if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
                    // if the src of an existing img tag changes, update the prefix
                    if (mutation.attributeName === 'src')
                        addPrefixToImg(mutation.target);
                }
            }
        });
        // configure observation options
        const config = {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['src'],
        };
        observer.observe(document.body, config);
    };
    (0, react_1.useEffect)(() => {
        if (var_1.basePath)
            handleRouteChange();
    }, [pathname]);
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVQcmVmaXhIYW5kbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZVByZWZpeEhhbmRsZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFNWixvQ0E4Q0M7QUFsREQsZ0RBQTZDO0FBQzdDLGlDQUFpQztBQUNqQyxxQ0FBc0M7QUFFdEMsU0FBd0IsaUJBQWlCO0lBQ3ZDLE1BQU0sUUFBUSxHQUFHLElBQUEsd0JBQVcsR0FBRSxDQUFBO0lBQzlCLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO1FBQzdCLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBbUIsRUFBRSxFQUFFO1lBQzdDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUMxQixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsY0FBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3JELElBQUksTUFBTSxLQUFLLGNBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUMxSCxHQUFHLENBQUMsUUFBUSxHQUFHLGNBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFBO2dCQUN0QyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUN4QixDQUFDO1FBQ0gsQ0FBQyxDQUFBO1FBQ0QsOEJBQThCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN0RCxLQUFLLE1BQU0sUUFBUSxJQUFJLGFBQWEsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFLENBQUM7b0JBQ2xDLGtDQUFrQztvQkFDbEMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTt3QkFDbkMsSUFBSSxDQUFFLElBQW9CLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSzs0QkFDM0MsY0FBYyxDQUFDLElBQXdCLENBQUMsQ0FBQTtvQkFDNUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztxQkFDSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssWUFBWSxJQUFLLFFBQVEsQ0FBQyxNQUFzQixDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUUsQ0FBQztvQkFDOUYsK0RBQStEO29CQUMvRCxJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssS0FBSzt3QkFDbEMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxNQUEwQixDQUFDLENBQUE7Z0JBQ3ZELENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixnQ0FBZ0M7UUFDaEMsTUFBTSxNQUFNLEdBQUc7WUFDYixTQUFTLEVBQUUsSUFBSTtZQUNmLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsZUFBZSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ3pCLENBQUE7UUFFRCxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDekMsQ0FBQyxDQUFBO0lBRUQsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLElBQUksY0FBUTtZQUNWLGlCQUFpQixFQUFFLENBQUE7SUFDdkIsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUVkLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgeyB1c2VQYXRobmFtZSB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgYmFzZVBhdGggfSBmcm9tICdAL3V0aWxzL3ZhcidcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUm91dGVQcmVmaXhIYW5kbGUoKSB7XG4gIGNvbnN0IHBhdGhuYW1lID0gdXNlUGF0aG5hbWUoKVxuICBjb25zdCBoYW5kbGVSb3V0ZUNoYW5nZSA9ICgpID0+IHtcbiAgICBjb25zdCBhZGRQcmVmaXhUb0ltZyA9IChlOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGUuc3JjKVxuICAgICAgY29uc3QgcHJlZml4ID0gdXJsLnBhdGhuYW1lLnNsaWNlKDAsIGJhc2VQYXRoLmxlbmd0aClcbiAgICAgIGlmIChwcmVmaXggIT09IGJhc2VQYXRoICYmICF1cmwuaHJlZi5zdGFydHNXaXRoKCdibG9iOicpICYmICF1cmwuaHJlZi5zdGFydHNXaXRoKCdkYXRhOicpICYmICF1cmwuaHJlZi5zdGFydHNXaXRoKCdodHRwJykpIHtcbiAgICAgICAgdXJsLnBhdGhuYW1lID0gYmFzZVBhdGggKyB1cmwucGF0aG5hbWVcbiAgICAgICAgZS5zcmMgPSB1cmwudG9TdHJpbmcoKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBjcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2VcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnNMaXN0KSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uc0xpc3QpIHtcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgICAgLy8gbGlzdGVuIGZvciBuZXdseSBhZGRlZCBpbWcgdGFnc1xuICAgICAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCgobm9kZSBhcyBIVE1MRWxlbWVudCkudGFnTmFtZSkgPT09ICdJTUcnKVxuICAgICAgICAgICAgICBhZGRQcmVmaXhUb0ltZyhub2RlIGFzIEhUTUxJbWFnZUVsZW1lbnQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtdXRhdGlvbi50eXBlID09PSAnYXR0cmlidXRlcycgJiYgKG11dGF0aW9uLnRhcmdldCBhcyBIVE1MRWxlbWVudCkudGFnTmFtZSA9PT0gJ0lNRycpIHtcbiAgICAgICAgICAvLyBpZiB0aGUgc3JjIG9mIGFuIGV4aXN0aW5nIGltZyB0YWcgY2hhbmdlcywgdXBkYXRlIHRoZSBwcmVmaXhcbiAgICAgICAgICBpZiAobXV0YXRpb24uYXR0cmlidXRlTmFtZSA9PT0gJ3NyYycpXG4gICAgICAgICAgICBhZGRQcmVmaXhUb0ltZyhtdXRhdGlvbi50YXJnZXQgYXMgSFRNTEltYWdlRWxlbWVudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBjb25maWd1cmUgb2JzZXJ2YXRpb24gb3B0aW9uc1xuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ3NyYyddLFxuICAgIH1cblxuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgY29uZmlnKVxuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYmFzZVBhdGgpXG4gICAgICBoYW5kbGVSb3V0ZUNoYW5nZSgpXG4gIH0sIFtwYXRobmFtZV0pXG5cbiAgcmV0dXJuIG51bGxcbn1cbiJdfQ==