"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertRepoToUrl = exports.parseGitHubUrl = exports.pluginManifestInMarketToPluginProps = exports.pluginManifestToCardPluginProps = void 0;
const compat_1 = require("es-toolkit/compat");
const pluginManifestToCardPluginProps = (pluginManifest) => {
    return {
        plugin_id: pluginManifest.plugin_unique_identifier,
        type: pluginManifest.category,
        category: pluginManifest.category,
        name: pluginManifest.name,
        version: pluginManifest.version,
        latest_version: '',
        latest_package_identifier: '',
        org: pluginManifest.author,
        author: pluginManifest.author,
        label: pluginManifest.label,
        brief: pluginManifest.description,
        description: pluginManifest.description,
        icon: pluginManifest.icon,
        icon_dark: pluginManifest.icon_dark,
        verified: pluginManifest.verified,
        introduction: '',
        repository: '',
        install_count: 0,
        endpoint: {
            settings: [],
        },
        tags: pluginManifest.tags.map(tag => ({ name: tag })),
        badges: [],
        verification: { authorized_category: 'langgenius' },
        from: 'package',
    };
};
exports.pluginManifestToCardPluginProps = pluginManifestToCardPluginProps;
const pluginManifestInMarketToPluginProps = (pluginManifest) => {
    return {
        plugin_id: pluginManifest.plugin_unique_identifier,
        type: pluginManifest.category,
        category: pluginManifest.category,
        name: pluginManifest.name,
        version: pluginManifest.latest_version,
        latest_version: pluginManifest.latest_version,
        latest_package_identifier: '',
        org: pluginManifest.org,
        label: pluginManifest.label,
        brief: pluginManifest.brief,
        description: pluginManifest.brief,
        icon: pluginManifest.icon,
        verified: true,
        introduction: pluginManifest.introduction,
        repository: '',
        install_count: 0,
        endpoint: {
            settings: [],
        },
        tags: [],
        badges: pluginManifest.badges,
        verification: (0, compat_1.isEmpty)(pluginManifest.verification) ? { authorized_category: 'langgenius' } : pluginManifest.verification,
        from: pluginManifest.from,
    };
};
exports.pluginManifestInMarketToPluginProps = pluginManifestInMarketToPluginProps;
const parseGitHubUrl = (url) => {
    const githubUrlRegex = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/;
    const match = githubUrlRegex.exec(url);
    return match ? { isValid: true, owner: match[1], repo: match[2] } : { isValid: false };
};
exports.parseGitHubUrl = parseGitHubUrl;
const convertRepoToUrl = (repo) => {
    return repo ? `https://github.com/${repo}` : '';
};
exports.convertRepoToUrl = convertRepoToUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw4Q0FBMkM7QUFFcEMsTUFBTSwrQkFBK0IsR0FBRyxDQUFDLGNBQWlDLEVBQVUsRUFBRTtJQUMzRixPQUFPO1FBQ0wsU0FBUyxFQUFFLGNBQWMsQ0FBQyx3QkFBd0I7UUFDbEQsSUFBSSxFQUFFLGNBQWMsQ0FBQyxRQUEwQjtRQUMvQyxRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO1FBQ3pCLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTztRQUMvQixjQUFjLEVBQUUsRUFBRTtRQUNsQix5QkFBeUIsRUFBRSxFQUFFO1FBQzdCLEdBQUcsRUFBRSxjQUFjLENBQUMsTUFBTTtRQUMxQixNQUFNLEVBQUUsY0FBYyxDQUFDLE1BQU07UUFDN0IsS0FBSyxFQUFFLGNBQWMsQ0FBQyxLQUFLO1FBQzNCLEtBQUssRUFBRSxjQUFjLENBQUMsV0FBVztRQUNqQyxXQUFXLEVBQUUsY0FBYyxDQUFDLFdBQVc7UUFDdkMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO1FBQ3pCLFNBQVMsRUFBRSxjQUFjLENBQUMsU0FBUztRQUNuQyxRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsWUFBWSxFQUFFLEVBQUU7UUFDaEIsVUFBVSxFQUFFLEVBQUU7UUFDZCxhQUFhLEVBQUUsQ0FBQztRQUNoQixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsRUFBRTtTQUNiO1FBQ0QsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sRUFBRSxFQUFFO1FBQ1YsWUFBWSxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFFO1FBQ25ELElBQUksRUFBRSxTQUFTO0tBQ2hCLENBQUE7QUFDSCxDQUFDLENBQUE7QUE1QlksUUFBQSwrQkFBK0IsbUNBNEIzQztBQUVNLE1BQU0sbUNBQW1DLEdBQUcsQ0FBQyxjQUFzQyxFQUFVLEVBQUU7SUFDcEcsT0FBTztRQUNMLFNBQVMsRUFBRSxjQUFjLENBQUMsd0JBQXdCO1FBQ2xELElBQUksRUFBRSxjQUFjLENBQUMsUUFBMEI7UUFDL0MsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRO1FBQ2pDLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSTtRQUN6QixPQUFPLEVBQUUsY0FBYyxDQUFDLGNBQWM7UUFDdEMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxjQUFjO1FBQzdDLHlCQUF5QixFQUFFLEVBQUU7UUFDN0IsR0FBRyxFQUFFLGNBQWMsQ0FBQyxHQUFHO1FBQ3ZCLEtBQUssRUFBRSxjQUFjLENBQUMsS0FBSztRQUMzQixLQUFLLEVBQUUsY0FBYyxDQUFDLEtBQUs7UUFDM0IsV0FBVyxFQUFFLGNBQWMsQ0FBQyxLQUFLO1FBQ2pDLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSTtRQUN6QixRQUFRLEVBQUUsSUFBSTtRQUNkLFlBQVksRUFBRSxjQUFjLENBQUMsWUFBWTtRQUN6QyxVQUFVLEVBQUUsRUFBRTtRQUNkLGFBQWEsRUFBRSxDQUFDO1FBQ2hCLFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxFQUFFO1NBQ2I7UUFDRCxJQUFJLEVBQUUsRUFBRTtRQUNSLE1BQU0sRUFBRSxjQUFjLENBQUMsTUFBTTtRQUM3QixZQUFZLEVBQUUsSUFBQSxnQkFBTyxFQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFlBQVk7UUFDeEgsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO0tBQzFCLENBQUE7QUFDSCxDQUFDLENBQUE7QUExQlksUUFBQSxtQ0FBbUMsdUNBMEIvQztBQUVNLE1BQU0sY0FBYyxHQUFHLENBQUMsR0FBVyxFQUFpQixFQUFFO0lBQzNELE1BQU0sY0FBYyxHQUFHLDhDQUE4QyxDQUFBO0lBQ3JFLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDdEMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDeEYsQ0FBQyxDQUFBO0FBSlksUUFBQSxjQUFjLGtCQUkxQjtBQUVNLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUMvQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsc0JBQXNCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7QUFDakQsQ0FBQyxDQUFBO0FBRlksUUFBQSxnQkFBZ0Isb0JBRTVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQbHVnaW4sIFBsdWdpbkRlY2xhcmF0aW9uLCBQbHVnaW5NYW5pZmVzdEluTWFya2V0IH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEdpdEh1YlVybEluZm8gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvdHlwZXMnXG5pbXBvcnQgeyBpc0VtcHR5IH0gZnJvbSAnZXMtdG9vbGtpdC9jb21wYXQnXG5cbmV4cG9ydCBjb25zdCBwbHVnaW5NYW5pZmVzdFRvQ2FyZFBsdWdpblByb3BzID0gKHBsdWdpbk1hbmlmZXN0OiBQbHVnaW5EZWNsYXJhdGlvbik6IFBsdWdpbiA9PiB7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luX2lkOiBwbHVnaW5NYW5pZmVzdC5wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIsXG4gICAgdHlwZTogcGx1Z2luTWFuaWZlc3QuY2F0ZWdvcnkgYXMgUGx1Z2luWyd0eXBlJ10sXG4gICAgY2F0ZWdvcnk6IHBsdWdpbk1hbmlmZXN0LmNhdGVnb3J5LFxuICAgIG5hbWU6IHBsdWdpbk1hbmlmZXN0Lm5hbWUsXG4gICAgdmVyc2lvbjogcGx1Z2luTWFuaWZlc3QudmVyc2lvbixcbiAgICBsYXRlc3RfdmVyc2lvbjogJycsXG4gICAgbGF0ZXN0X3BhY2thZ2VfaWRlbnRpZmllcjogJycsXG4gICAgb3JnOiBwbHVnaW5NYW5pZmVzdC5hdXRob3IsXG4gICAgYXV0aG9yOiBwbHVnaW5NYW5pZmVzdC5hdXRob3IsXG4gICAgbGFiZWw6IHBsdWdpbk1hbmlmZXN0LmxhYmVsLFxuICAgIGJyaWVmOiBwbHVnaW5NYW5pZmVzdC5kZXNjcmlwdGlvbixcbiAgICBkZXNjcmlwdGlvbjogcGx1Z2luTWFuaWZlc3QuZGVzY3JpcHRpb24sXG4gICAgaWNvbjogcGx1Z2luTWFuaWZlc3QuaWNvbixcbiAgICBpY29uX2Rhcms6IHBsdWdpbk1hbmlmZXN0Lmljb25fZGFyayxcbiAgICB2ZXJpZmllZDogcGx1Z2luTWFuaWZlc3QudmVyaWZpZWQsXG4gICAgaW50cm9kdWN0aW9uOiAnJyxcbiAgICByZXBvc2l0b3J5OiAnJyxcbiAgICBpbnN0YWxsX2NvdW50OiAwLFxuICAgIGVuZHBvaW50OiB7XG4gICAgICBzZXR0aW5nczogW10sXG4gICAgfSxcbiAgICB0YWdzOiBwbHVnaW5NYW5pZmVzdC50YWdzLm1hcCh0YWcgPT4gKHsgbmFtZTogdGFnIH0pKSxcbiAgICBiYWRnZXM6IFtdLFxuICAgIHZlcmlmaWNhdGlvbjogeyBhdXRob3JpemVkX2NhdGVnb3J5OiAnbGFuZ2dlbml1cycgfSxcbiAgICBmcm9tOiAncGFja2FnZScsXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHBsdWdpbk1hbmlmZXN0SW5NYXJrZXRUb1BsdWdpblByb3BzID0gKHBsdWdpbk1hbmlmZXN0OiBQbHVnaW5NYW5pZmVzdEluTWFya2V0KTogUGx1Z2luID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5faWQ6IHBsdWdpbk1hbmlmZXN0LnBsdWdpbl91bmlxdWVfaWRlbnRpZmllcixcbiAgICB0eXBlOiBwbHVnaW5NYW5pZmVzdC5jYXRlZ29yeSBhcyBQbHVnaW5bJ3R5cGUnXSxcbiAgICBjYXRlZ29yeTogcGx1Z2luTWFuaWZlc3QuY2F0ZWdvcnksXG4gICAgbmFtZTogcGx1Z2luTWFuaWZlc3QubmFtZSxcbiAgICB2ZXJzaW9uOiBwbHVnaW5NYW5pZmVzdC5sYXRlc3RfdmVyc2lvbixcbiAgICBsYXRlc3RfdmVyc2lvbjogcGx1Z2luTWFuaWZlc3QubGF0ZXN0X3ZlcnNpb24sXG4gICAgbGF0ZXN0X3BhY2thZ2VfaWRlbnRpZmllcjogJycsXG4gICAgb3JnOiBwbHVnaW5NYW5pZmVzdC5vcmcsXG4gICAgbGFiZWw6IHBsdWdpbk1hbmlmZXN0LmxhYmVsLFxuICAgIGJyaWVmOiBwbHVnaW5NYW5pZmVzdC5icmllZixcbiAgICBkZXNjcmlwdGlvbjogcGx1Z2luTWFuaWZlc3QuYnJpZWYsXG4gICAgaWNvbjogcGx1Z2luTWFuaWZlc3QuaWNvbixcbiAgICB2ZXJpZmllZDogdHJ1ZSxcbiAgICBpbnRyb2R1Y3Rpb246IHBsdWdpbk1hbmlmZXN0LmludHJvZHVjdGlvbixcbiAgICByZXBvc2l0b3J5OiAnJyxcbiAgICBpbnN0YWxsX2NvdW50OiAwLFxuICAgIGVuZHBvaW50OiB7XG4gICAgICBzZXR0aW5nczogW10sXG4gICAgfSxcbiAgICB0YWdzOiBbXSxcbiAgICBiYWRnZXM6IHBsdWdpbk1hbmlmZXN0LmJhZGdlcyxcbiAgICB2ZXJpZmljYXRpb246IGlzRW1wdHkocGx1Z2luTWFuaWZlc3QudmVyaWZpY2F0aW9uKSA/IHsgYXV0aG9yaXplZF9jYXRlZ29yeTogJ2xhbmdnZW5pdXMnIH0gOiBwbHVnaW5NYW5pZmVzdC52ZXJpZmljYXRpb24sXG4gICAgZnJvbTogcGx1Z2luTWFuaWZlc3QuZnJvbSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcGFyc2VHaXRIdWJVcmwgPSAodXJsOiBzdHJpbmcpOiBHaXRIdWJVcmxJbmZvID0+IHtcbiAgY29uc3QgZ2l0aHViVXJsUmVnZXggPSAvXmh0dHBzOlxcL1xcL2dpdGh1YlxcLmNvbVxcLyhbXi9dKylcXC8oW14vXSspXFwvPyQvXG4gIGNvbnN0IG1hdGNoID0gZ2l0aHViVXJsUmVnZXguZXhlYyh1cmwpXG4gIHJldHVybiBtYXRjaCA/IHsgaXNWYWxpZDogdHJ1ZSwgb3duZXI6IG1hdGNoWzFdLCByZXBvOiBtYXRjaFsyXSB9IDogeyBpc1ZhbGlkOiBmYWxzZSB9XG59XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0UmVwb1RvVXJsID0gKHJlcG86IHN0cmluZykgPT4ge1xuICByZXR1cm4gcmVwbyA/IGBodHRwczovL2dpdGh1Yi5jb20vJHtyZXBvfWAgOiAnJ1xufVxuIl19