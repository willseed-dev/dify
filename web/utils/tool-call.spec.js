"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
/**
 * Test suite for tool call utility functions
 * Tests detection of function/tool call support in AI models
 */
const tool_call_1 = require("./tool-call");
describe('tool-call', () => {
    /**
     * Tests supportFunctionCall which checks if a model supports any form of
     * function calling (toolCall, multiToolCall, or streamToolCall)
     */
    describe('supportFunctionCall', () => {
        /**
         * Tests detection of basic tool call support
         */
        it('returns true when features include toolCall', () => {
            const features = [declarations_1.ModelFeatureEnum.toolCall];
            expect((0, tool_call_1.supportFunctionCall)(features)).toBe(true);
        });
        /**
         * Tests detection of multi-tool call support (calling multiple tools in one request)
         */
        it('returns true when features include multiToolCall', () => {
            const features = [declarations_1.ModelFeatureEnum.multiToolCall];
            expect((0, tool_call_1.supportFunctionCall)(features)).toBe(true);
        });
        /**
         * Tests detection of streaming tool call support
         */
        it('returns true when features include streamToolCall', () => {
            const features = [declarations_1.ModelFeatureEnum.streamToolCall];
            expect((0, tool_call_1.supportFunctionCall)(features)).toBe(true);
        });
        it('returns true when features include multiple tool call types', () => {
            const features = [
                declarations_1.ModelFeatureEnum.toolCall,
                declarations_1.ModelFeatureEnum.multiToolCall,
                declarations_1.ModelFeatureEnum.streamToolCall,
            ];
            expect((0, tool_call_1.supportFunctionCall)(features)).toBe(true);
        });
        /**
         * Tests that tool call support is detected even when mixed with other features
         */
        it('returns true when features include tool call among other features', () => {
            const features = [
                declarations_1.ModelFeatureEnum.agentThought,
                declarations_1.ModelFeatureEnum.toolCall,
                declarations_1.ModelFeatureEnum.vision,
            ];
            expect((0, tool_call_1.supportFunctionCall)(features)).toBe(true);
        });
        /**
         * Tests that false is returned when no tool call features are present
         */
        it('returns false when features do not include any tool call type', () => {
            const features = [declarations_1.ModelFeatureEnum.agentThought, declarations_1.ModelFeatureEnum.vision];
            expect((0, tool_call_1.supportFunctionCall)(features)).toBe(false);
        });
        it('returns false for empty array', () => {
            expect((0, tool_call_1.supportFunctionCall)([])).toBe(false);
        });
        it('returns false for undefined', () => {
            expect((0, tool_call_1.supportFunctionCall)(undefined)).toBe(false);
        });
        it('returns false for null', () => {
            expect((0, tool_call_1.supportFunctionCall)(null)).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbC1jYWxsLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b29sLWNhbGwuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJHQUEyRztBQUMzRzs7O0dBR0c7QUFDSCwyQ0FBaUQ7QUFFakQsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekI7OztPQUdHO0lBQ0gsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUNuQzs7V0FFRztRQUNILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7WUFDckQsTUFBTSxRQUFRLEdBQUcsQ0FBQywrQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM1QyxNQUFNLENBQUMsSUFBQSwrQkFBbUIsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUMsQ0FBQTtRQUVGOztXQUVHO1FBQ0gsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxNQUFNLFFBQVEsR0FBRyxDQUFDLCtCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQ2pELE1BQU0sQ0FBQyxJQUFBLCtCQUFtQixFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO1FBRUY7O1dBRUc7UUFDSCxFQUFFLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1lBQzNELE1BQU0sUUFBUSxHQUFHLENBQUMsK0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUE7WUFDbEQsTUFBTSxDQUFDLElBQUEsK0JBQW1CLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1lBQ3JFLE1BQU0sUUFBUSxHQUFHO2dCQUNmLCtCQUFnQixDQUFDLFFBQVE7Z0JBQ3pCLCtCQUFnQixDQUFDLGFBQWE7Z0JBQzlCLCtCQUFnQixDQUFDLGNBQWM7YUFDaEMsQ0FBQTtZQUNELE1BQU0sQ0FBQyxJQUFBLCtCQUFtQixFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO1FBRUY7O1dBRUc7UUFDSCxFQUFFLENBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFO1lBQzNFLE1BQU0sUUFBUSxHQUFHO2dCQUNmLCtCQUFnQixDQUFDLFlBQVk7Z0JBQzdCLCtCQUFnQixDQUFDLFFBQVE7Z0JBQ3pCLCtCQUFnQixDQUFDLE1BQU07YUFDeEIsQ0FBQTtZQUNELE1BQU0sQ0FBQyxJQUFBLCtCQUFtQixFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO1FBRUY7O1dBRUc7UUFDSCxFQUFFLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3ZFLE1BQU0sUUFBUSxHQUFHLENBQUMsK0JBQWdCLENBQUMsWUFBWSxFQUFFLCtCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3pFLE1BQU0sQ0FBQyxJQUFBLCtCQUFtQixFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25ELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtZQUN2QyxNQUFNLENBQUMsSUFBQSwrQkFBbUIsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7WUFDckMsTUFBTSxDQUFDLElBQUEsK0JBQW1CLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDcEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sQ0FBQyxJQUFBLCtCQUFtQixFQUFDLElBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZGVsRmVhdHVyZUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9kZWNsYXJhdGlvbnMnXG4vKipcbiAqIFRlc3Qgc3VpdGUgZm9yIHRvb2wgY2FsbCB1dGlsaXR5IGZ1bmN0aW9uc1xuICogVGVzdHMgZGV0ZWN0aW9uIG9mIGZ1bmN0aW9uL3Rvb2wgY2FsbCBzdXBwb3J0IGluIEFJIG1vZGVsc1xuICovXG5pbXBvcnQgeyBzdXBwb3J0RnVuY3Rpb25DYWxsIH0gZnJvbSAnLi90b29sLWNhbGwnXG5cbmRlc2NyaWJlKCd0b29sLWNhbGwnLCAoKSA9PiB7XG4gIC8qKlxuICAgKiBUZXN0cyBzdXBwb3J0RnVuY3Rpb25DYWxsIHdoaWNoIGNoZWNrcyBpZiBhIG1vZGVsIHN1cHBvcnRzIGFueSBmb3JtIG9mXG4gICAqIGZ1bmN0aW9uIGNhbGxpbmcgKHRvb2xDYWxsLCBtdWx0aVRvb2xDYWxsLCBvciBzdHJlYW1Ub29sQ2FsbClcbiAgICovXG4gIGRlc2NyaWJlKCdzdXBwb3J0RnVuY3Rpb25DYWxsJywgKCkgPT4ge1xuICAgIC8qKlxuICAgICAqIFRlc3RzIGRldGVjdGlvbiBvZiBiYXNpYyB0b29sIGNhbGwgc3VwcG9ydFxuICAgICAqL1xuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBmZWF0dXJlcyBpbmNsdWRlIHRvb2xDYWxsJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmVhdHVyZXMgPSBbTW9kZWxGZWF0dXJlRW51bS50b29sQ2FsbF1cbiAgICAgIGV4cGVjdChzdXBwb3J0RnVuY3Rpb25DYWxsKGZlYXR1cmVzKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBkZXRlY3Rpb24gb2YgbXVsdGktdG9vbCBjYWxsIHN1cHBvcnQgKGNhbGxpbmcgbXVsdGlwbGUgdG9vbHMgaW4gb25lIHJlcXVlc3QpXG4gICAgICovXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIGZlYXR1cmVzIGluY2x1ZGUgbXVsdGlUb29sQ2FsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZlYXR1cmVzID0gW01vZGVsRmVhdHVyZUVudW0ubXVsdGlUb29sQ2FsbF1cbiAgICAgIGV4cGVjdChzdXBwb3J0RnVuY3Rpb25DYWxsKGZlYXR1cmVzKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBkZXRlY3Rpb24gb2Ygc3RyZWFtaW5nIHRvb2wgY2FsbCBzdXBwb3J0XG4gICAgICovXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIGZlYXR1cmVzIGluY2x1ZGUgc3RyZWFtVG9vbENhbGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmZWF0dXJlcyA9IFtNb2RlbEZlYXR1cmVFbnVtLnN0cmVhbVRvb2xDYWxsXVxuICAgICAgZXhwZWN0KHN1cHBvcnRGdW5jdGlvbkNhbGwoZmVhdHVyZXMpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBmZWF0dXJlcyBpbmNsdWRlIG11bHRpcGxlIHRvb2wgY2FsbCB0eXBlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZlYXR1cmVzID0gW1xuICAgICAgICBNb2RlbEZlYXR1cmVFbnVtLnRvb2xDYWxsLFxuICAgICAgICBNb2RlbEZlYXR1cmVFbnVtLm11bHRpVG9vbENhbGwsXG4gICAgICAgIE1vZGVsRmVhdHVyZUVudW0uc3RyZWFtVG9vbENhbGwsXG4gICAgICBdXG4gICAgICBleHBlY3Qoc3VwcG9ydEZ1bmN0aW9uQ2FsbChmZWF0dXJlcykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgdGhhdCB0b29sIGNhbGwgc3VwcG9ydCBpcyBkZXRlY3RlZCBldmVuIHdoZW4gbWl4ZWQgd2l0aCBvdGhlciBmZWF0dXJlc1xuICAgICAqL1xuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBmZWF0dXJlcyBpbmNsdWRlIHRvb2wgY2FsbCBhbW9uZyBvdGhlciBmZWF0dXJlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZlYXR1cmVzID0gW1xuICAgICAgICBNb2RlbEZlYXR1cmVFbnVtLmFnZW50VGhvdWdodCxcbiAgICAgICAgTW9kZWxGZWF0dXJlRW51bS50b29sQ2FsbCxcbiAgICAgICAgTW9kZWxGZWF0dXJlRW51bS52aXNpb24sXG4gICAgICBdXG4gICAgICBleHBlY3Qoc3VwcG9ydEZ1bmN0aW9uQ2FsbChmZWF0dXJlcykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgdGhhdCBmYWxzZSBpcyByZXR1cm5lZCB3aGVuIG5vIHRvb2wgY2FsbCBmZWF0dXJlcyBhcmUgcHJlc2VudFxuICAgICAqL1xuICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gZmVhdHVyZXMgZG8gbm90IGluY2x1ZGUgYW55IHRvb2wgY2FsbCB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmVhdHVyZXMgPSBbTW9kZWxGZWF0dXJlRW51bS5hZ2VudFRob3VnaHQsIE1vZGVsRmVhdHVyZUVudW0udmlzaW9uXVxuICAgICAgZXhwZWN0KHN1cHBvcnRGdW5jdGlvbkNhbGwoZmVhdHVyZXMpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgZW1wdHkgYXJyYXknLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3VwcG9ydEZ1bmN0aW9uQ2FsbChbXSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3VwcG9ydEZ1bmN0aW9uQ2FsbCh1bmRlZmluZWQpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgbnVsbCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChzdXBwb3J0RnVuY3Rpb25DYWxsKG51bGwgYXMgYW55KSkudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==