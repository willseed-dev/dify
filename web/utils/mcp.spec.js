"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test suite for MCP (Model Context Protocol) utility functions
 * Tests icon detection logic for MCP-related features
 */
const mcp_1 = require("./mcp");
describe('mcp', () => {
    /**
     * Tests shouldUseMcpIcon function which determines if the MCP icon
     * should be used based on the icon source format
     */
    describe('shouldUseMcpIcon', () => {
        /**
         * The link emoji (🔗) is used as a special marker for MCP icons
         */
        it('returns true for emoji object with 🔗 content', () => {
            const src = { content: '🔗', background: '#fff' };
            expect((0, mcp_1.shouldUseMcpIcon)(src)).toBe(true);
        });
        it('returns false for emoji object with different content', () => {
            const src = { content: '🎉', background: '#fff' };
            expect((0, mcp_1.shouldUseMcpIcon)(src)).toBe(false);
        });
        it('returns false for string URL', () => {
            const src = 'https://example.com/icon.png';
            expect((0, mcp_1.shouldUseMcpIcon)(src)).toBe(false);
        });
        it('returns false for null', () => {
            expect((0, mcp_1.shouldUseMcpIcon)(null)).toBe(false);
        });
        it('returns false for undefined', () => {
            expect((0, mcp_1.shouldUseMcpIcon)(undefined)).toBe(false);
        });
        it('returns false for empty object', () => {
            expect((0, mcp_1.shouldUseMcpIcon)({})).toBe(false);
        });
        it('returns false for object without content property', () => {
            const src = { background: '#fff' };
            expect((0, mcp_1.shouldUseMcpIcon)(src)).toBe(false);
        });
        it('returns false for object with null content', () => {
            const src = { content: null, background: '#fff' };
            expect((0, mcp_1.shouldUseMcpIcon)(src)).toBe(false);
        });
    });
    /**
     * Tests shouldUseMcpIconForAppIcon function which checks if an app icon
     * should use the MCP icon based on icon type and content
     */
    describe('shouldUseMcpIconForAppIcon', () => {
        /**
         * MCP icon should only be used when both conditions are met:
         * - Icon type is 'emoji'
         * - Icon content is the link emoji (🔗)
         */
        it('returns true when iconType is emoji and icon is 🔗', () => {
            expect((0, mcp_1.shouldUseMcpIconForAppIcon)('emoji', '🔗')).toBe(true);
        });
        it('returns false when iconType is emoji but icon is different', () => {
            expect((0, mcp_1.shouldUseMcpIconForAppIcon)('emoji', '🎉')).toBe(false);
        });
        it('returns false when iconType is image', () => {
            expect((0, mcp_1.shouldUseMcpIconForAppIcon)('image', '🔗')).toBe(false);
        });
        it('returns false when iconType is image and icon is different', () => {
            expect((0, mcp_1.shouldUseMcpIconForAppIcon)('image', 'file-id-123')).toBe(false);
        });
        it('returns false for empty strings', () => {
            expect((0, mcp_1.shouldUseMcpIconForAppIcon)('', '')).toBe(false);
        });
        it('returns false when iconType is empty but icon is 🔗', () => {
            expect((0, mcp_1.shouldUseMcpIconForAppIcon)('', '🔗')).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtY3Auc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILCtCQUFvRTtBQUVwRSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUNuQjs7O09BR0c7SUFDSCxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDOztXQUVHO1FBQ0gsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxNQUFNLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFBO1lBQ2pELE1BQU0sQ0FBQyxJQUFBLHNCQUFnQixFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxNQUFNLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFBO1lBQ2pELE1BQU0sQ0FBQyxJQUFBLHNCQUFnQixFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzNDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLEdBQUcsR0FBRyw4QkFBOEIsQ0FBQTtZQUMxQyxNQUFNLENBQUMsSUFBQSxzQkFBZ0IsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMzQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7WUFDaEMsTUFBTSxDQUFDLElBQUEsc0JBQWdCLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDNUMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLE1BQU0sQ0FBQyxJQUFBLHNCQUFnQixFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxNQUFNLENBQUMsSUFBQSxzQkFBZ0IsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMxQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7WUFDM0QsTUFBTSxHQUFHLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUE7WUFDbEMsTUFBTSxDQUFDLElBQUEsc0JBQWdCLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0MsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1lBQ3BELE1BQU0sR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUE7WUFDakQsTUFBTSxDQUFDLElBQUEsc0JBQWdCLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0MsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGOzs7T0FHRztJQUNILFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDMUM7Ozs7V0FJRztRQUNILEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDNUQsTUFBTSxDQUFDLElBQUEsZ0NBQTBCLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzlELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtZQUNwRSxNQUFNLENBQUMsSUFBQSxnQ0FBMEIsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDL0QsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLE1BQU0sQ0FBQyxJQUFBLGdDQUEwQixFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMvRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7WUFDcEUsTUFBTSxDQUFDLElBQUEsZ0NBQTBCLEVBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxNQUFNLENBQUMsSUFBQSxnQ0FBMEIsRUFBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1lBQzdELE1BQU0sQ0FBQyxJQUFBLGdDQUEwQixFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMxRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3Qgc3VpdGUgZm9yIE1DUCAoTW9kZWwgQ29udGV4dCBQcm90b2NvbCkgdXRpbGl0eSBmdW5jdGlvbnNcbiAqIFRlc3RzIGljb24gZGV0ZWN0aW9uIGxvZ2ljIGZvciBNQ1AtcmVsYXRlZCBmZWF0dXJlc1xuICovXG5pbXBvcnQgeyBzaG91bGRVc2VNY3BJY29uLCBzaG91bGRVc2VNY3BJY29uRm9yQXBwSWNvbiB9IGZyb20gJy4vbWNwJ1xuXG5kZXNjcmliZSgnbWNwJywgKCkgPT4ge1xuICAvKipcbiAgICogVGVzdHMgc2hvdWxkVXNlTWNwSWNvbiBmdW5jdGlvbiB3aGljaCBkZXRlcm1pbmVzIGlmIHRoZSBNQ1AgaWNvblxuICAgKiBzaG91bGQgYmUgdXNlZCBiYXNlZCBvbiB0aGUgaWNvbiBzb3VyY2UgZm9ybWF0XG4gICAqL1xuICBkZXNjcmliZSgnc2hvdWxkVXNlTWNwSWNvbicsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUaGUgbGluayBlbW9qaSAo8J+UlykgaXMgdXNlZCBhcyBhIHNwZWNpYWwgbWFya2VyIGZvciBNQ1AgaWNvbnNcbiAgICAgKi9cbiAgICBpdCgncmV0dXJucyB0cnVlIGZvciBlbW9qaSBvYmplY3Qgd2l0aCDwn5SXIGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcmMgPSB7IGNvbnRlbnQ6ICfwn5SXJywgYmFja2dyb3VuZDogJyNmZmYnIH1cbiAgICAgIGV4cGVjdChzaG91bGRVc2VNY3BJY29uKHNyYykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIGVtb2ppIG9iamVjdCB3aXRoIGRpZmZlcmVudCBjb250ZW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0geyBjb250ZW50OiAn8J+OiScsIGJhY2tncm91bmQ6ICcjZmZmJyB9XG4gICAgICBleHBlY3Qoc2hvdWxkVXNlTWNwSWNvbihzcmMpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3Igc3RyaW5nIFVSTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9ICdodHRwczovL2V4YW1wbGUuY29tL2ljb24ucG5nJ1xuICAgICAgZXhwZWN0KHNob3VsZFVzZU1jcEljb24oc3JjKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIG51bGwnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc2hvdWxkVXNlTWNwSWNvbihudWxsKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChzaG91bGRVc2VNY3BJY29uKHVuZGVmaW5lZCkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBlbXB0eSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc2hvdWxkVXNlTWNwSWNvbih7fSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBvYmplY3Qgd2l0aG91dCBjb250ZW50IHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0geyBiYWNrZ3JvdW5kOiAnI2ZmZicgfVxuICAgICAgZXhwZWN0KHNob3VsZFVzZU1jcEljb24oc3JjKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIG9iamVjdCB3aXRoIG51bGwgY29udGVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9IHsgY29udGVudDogbnVsbCwgYmFja2dyb3VuZDogJyNmZmYnIH1cbiAgICAgIGV4cGVjdChzaG91bGRVc2VNY3BJY29uKHNyYykpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICAvKipcbiAgICogVGVzdHMgc2hvdWxkVXNlTWNwSWNvbkZvckFwcEljb24gZnVuY3Rpb24gd2hpY2ggY2hlY2tzIGlmIGFuIGFwcCBpY29uXG4gICAqIHNob3VsZCB1c2UgdGhlIE1DUCBpY29uIGJhc2VkIG9uIGljb24gdHlwZSBhbmQgY29udGVudFxuICAgKi9cbiAgZGVzY3JpYmUoJ3Nob3VsZFVzZU1jcEljb25Gb3JBcHBJY29uJywgKCkgPT4ge1xuICAgIC8qKlxuICAgICAqIE1DUCBpY29uIHNob3VsZCBvbmx5IGJlIHVzZWQgd2hlbiBib3RoIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAgICAgKiAtIEljb24gdHlwZSBpcyAnZW1vamknXG4gICAgICogLSBJY29uIGNvbnRlbnQgaXMgdGhlIGxpbmsgZW1vamkgKPCflJcpXG4gICAgICovXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIGljb25UeXBlIGlzIGVtb2ppIGFuZCBpY29uIGlzIPCflJcnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc2hvdWxkVXNlTWNwSWNvbkZvckFwcEljb24oJ2Vtb2ppJywgJ/CflJcnKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIGljb25UeXBlIGlzIGVtb2ppIGJ1dCBpY29uIGlzIGRpZmZlcmVudCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChzaG91bGRVc2VNY3BJY29uRm9yQXBwSWNvbignZW1vamknLCAn8J+OiScpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIGljb25UeXBlIGlzIGltYWdlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHNob3VsZFVzZU1jcEljb25Gb3JBcHBJY29uKCdpbWFnZScsICfwn5SXJykpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gaWNvblR5cGUgaXMgaW1hZ2UgYW5kIGljb24gaXMgZGlmZmVyZW50JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHNob3VsZFVzZU1jcEljb25Gb3JBcHBJY29uKCdpbWFnZScsICdmaWxlLWlkLTEyMycpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgZW1wdHkgc3RyaW5ncycsICgpID0+IHtcbiAgICAgIGV4cGVjdChzaG91bGRVc2VNY3BJY29uRm9yQXBwSWNvbignJywgJycpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIGljb25UeXBlIGlzIGVtcHR5IGJ1dCBpY29uIGlzIPCflJcnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc2hvdWxkVXNlTWNwSWNvbkZvckFwcEljb24oJycsICfwn5SXJykpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=