"use strict";
/**
 * MCP (Model Context Protocol) utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldUseMcpIconForAppIcon = exports.shouldUseMcpIcon = void 0;
/**
 * Determines if the MCP icon should be used based on the icon source
 * @param src - The icon source, can be a string URL or an object with content and background
 * @returns true if the MCP icon should be used (when it's an emoji object with 🔗 content)
 */
const shouldUseMcpIcon = (src) => {
    return typeof src === 'object' && src?.content === '🔗';
};
exports.shouldUseMcpIcon = shouldUseMcpIcon;
/**
 * Checks if an app icon should use the MCP icon
 * @param iconType - The type of icon ('emoji' | 'image')
 * @param icon - The icon content (emoji or file ID)
 * @returns true if the MCP icon should be used
 */
const shouldUseMcpIconForAppIcon = (iconType, icon) => {
    return iconType === 'emoji' && icon === '🔗';
};
exports.shouldUseMcpIconForAppIcon = shouldUseMcpIconForAppIcon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWNwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBRUg7Ozs7R0FJRztBQUNJLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxHQUFRLEVBQVcsRUFBRTtJQUNwRCxPQUFPLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLEVBQUUsT0FBTyxLQUFLLElBQUksQ0FBQTtBQUN6RCxDQUFDLENBQUE7QUFGWSxRQUFBLGdCQUFnQixvQkFFNUI7QUFFRDs7Ozs7R0FLRztBQUNJLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxRQUFnQixFQUFFLElBQVksRUFBVyxFQUFFO0lBQ3BGLE9BQU8sUUFBUSxLQUFLLE9BQU8sSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFBO0FBQzlDLENBQUMsQ0FBQTtBQUZZLFFBQUEsMEJBQTBCLDhCQUV0QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTUNQIChNb2RlbCBDb250ZXh0IFByb3RvY29sKSB1dGlsaXR5IGZ1bmN0aW9uc1xuICovXG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiB0aGUgTUNQIGljb24gc2hvdWxkIGJlIHVzZWQgYmFzZWQgb24gdGhlIGljb24gc291cmNlXG4gKiBAcGFyYW0gc3JjIC0gVGhlIGljb24gc291cmNlLCBjYW4gYmUgYSBzdHJpbmcgVVJMIG9yIGFuIG9iamVjdCB3aXRoIGNvbnRlbnQgYW5kIGJhY2tncm91bmRcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIE1DUCBpY29uIHNob3VsZCBiZSB1c2VkICh3aGVuIGl0J3MgYW4gZW1vamkgb2JqZWN0IHdpdGgg8J+UlyBjb250ZW50KVxuICovXG5leHBvcnQgY29uc3Qgc2hvdWxkVXNlTWNwSWNvbiA9IChzcmM6IGFueSk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gdHlwZW9mIHNyYyA9PT0gJ29iamVjdCcgJiYgc3JjPy5jb250ZW50ID09PSAn8J+Ulydcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYW4gYXBwIGljb24gc2hvdWxkIHVzZSB0aGUgTUNQIGljb25cbiAqIEBwYXJhbSBpY29uVHlwZSAtIFRoZSB0eXBlIG9mIGljb24gKCdlbW9qaScgfCAnaW1hZ2UnKVxuICogQHBhcmFtIGljb24gLSBUaGUgaWNvbiBjb250ZW50IChlbW9qaSBvciBmaWxlIElEKVxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgTUNQIGljb24gc2hvdWxkIGJlIHVzZWRcbiAqL1xuZXhwb3J0IGNvbnN0IHNob3VsZFVzZU1jcEljb25Gb3JBcHBJY29uID0gKGljb25UeXBlOiBzdHJpbmcsIGljb246IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaWNvblR5cGUgPT09ICdlbW9qaScgJiYgaWNvbiA9PT0gJ/CflJcnXG59XG4iXX0=