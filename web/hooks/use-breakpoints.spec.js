"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test suite for useBreakpoints hook
 *
 * This hook provides responsive breakpoint detection based on window width.
 * It listens to window resize events and returns the current media type.
 *
 * Breakpoint definitions:
 * - mobile: width <= 640px
 * - tablet: 640px < width <= 768px
 * - pc: width > 768px
 *
 * The hook automatically updates when the window is resized and cleans up
 * event listeners on unmount to prevent memory leaks.
 */
const react_1 = require("@testing-library/react");
const use_breakpoints_1 = require("./use-breakpoints");
describe('useBreakpoints', () => {
    const originalInnerWidth = window.innerWidth;
    /**
     * Helper function to simulate window resize events
     * Updates window.innerWidth and dispatches a resize event
     */
    const fireResize = (width) => {
        window.innerWidth = width;
        (0, react_1.act)(() => {
            window.dispatchEvent(new Event('resize'));
        });
    };
    /**
     * Restore the original innerWidth after all tests
     * Ensures tests don't affect each other or the test environment
     */
    afterAll(() => {
        window.innerWidth = originalInnerWidth;
    });
    /**
     * Test mobile breakpoint detection
     * Mobile devices have width <= 640px
     */
    it('should return mobile for width <= 640px', () => {
        // Mock window.innerWidth for mobile
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 640,
        });
        const { result } = (0, react_1.renderHook)(() => (0, use_breakpoints_1.default)());
        expect(result.current).toBe(use_breakpoints_1.MediaType.mobile);
    });
    /**
     * Test tablet breakpoint detection
     * Tablet devices have width between 640px and 768px
     */
    it('should return tablet for width > 640px and <= 768px', () => {
        // Mock window.innerWidth for tablet
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 768,
        });
        const { result } = (0, react_1.renderHook)(() => (0, use_breakpoints_1.default)());
        expect(result.current).toBe(use_breakpoints_1.MediaType.tablet);
    });
    /**
     * Test desktop/PC breakpoint detection
     * Desktop devices have width > 768px
     */
    it('should return pc for width > 768px', () => {
        // Mock window.innerWidth for pc
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        const { result } = (0, react_1.renderHook)(() => (0, use_breakpoints_1.default)());
        expect(result.current).toBe(use_breakpoints_1.MediaType.pc);
    });
    /**
     * Test dynamic breakpoint updates on window resize
     * The hook should react to window resize events and update the media type
     */
    it('should update media type when window resizes', () => {
        // Start with desktop
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        const { result } = (0, react_1.renderHook)(() => (0, use_breakpoints_1.default)());
        expect(result.current).toBe(use_breakpoints_1.MediaType.pc);
        // Resize to tablet
        fireResize(768);
        expect(result.current).toBe(use_breakpoints_1.MediaType.tablet);
        // Resize to mobile
        fireResize(600);
        expect(result.current).toBe(use_breakpoints_1.MediaType.mobile);
    });
    /**
     * Test proper cleanup of event listeners
     * Ensures no memory leaks by removing resize listeners on unmount
     */
    it('should clean up event listeners on unmount', () => {
        // Spy on addEventListener and removeEventListener
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = (0, react_1.renderHook)(() => (0, use_breakpoints_1.default)());
        // Unmount should trigger cleanup
        unmount();
        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        // Clean up spies
        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWJyZWFrcG9pbnRzLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtYnJlYWtwb2ludHMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxrREFBd0Q7QUFDeEQsdURBQTZEO0FBRTdELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFBO0lBRTVDOzs7T0FHRztJQUNILE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7UUFDbkMsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7UUFDekIsSUFBQSxXQUFHLEVBQUMsR0FBRyxFQUFFO1lBQ1AsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzNDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFBO0lBRUQ7OztPQUdHO0lBQ0gsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNaLE1BQU0sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUE7SUFDeEMsQ0FBQyxDQUFDLENBQUE7SUFFRjs7O09BR0c7SUFDSCxFQUFFLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELG9DQUFvQztRQUNwQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUU7WUFDMUMsUUFBUSxFQUFFLElBQUk7WUFDZCxZQUFZLEVBQUUsSUFBSTtZQUNsQixLQUFLLEVBQUUsR0FBRztTQUNYLENBQUMsQ0FBQTtRQUVGLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBYyxHQUFFLENBQUMsQ0FBQTtRQUNyRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9DLENBQUMsQ0FBQyxDQUFBO0lBRUY7OztPQUdHO0lBQ0gsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtRQUM3RCxvQ0FBb0M7UUFDcEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFO1lBQzFDLFFBQVEsRUFBRSxJQUFJO1lBQ2QsWUFBWSxFQUFFLElBQUk7WUFDbEIsS0FBSyxFQUFFLEdBQUc7U0FDWCxDQUFDLENBQUE7UUFFRixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQWMsR0FBRSxDQUFDLENBQUE7UUFDckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsMkJBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMvQyxDQUFDLENBQUMsQ0FBQTtJQUVGOzs7T0FHRztJQUNILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsZ0NBQWdDO1FBQ2hDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRTtZQUMxQyxRQUFRLEVBQUUsSUFBSTtZQUNkLFlBQVksRUFBRSxJQUFJO1lBQ2xCLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFBO1FBRUYsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlCQUFjLEdBQUUsQ0FBQyxDQUFBO1FBQ3JELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLDJCQUFTLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDM0MsQ0FBQyxDQUFDLENBQUE7SUFFRjs7O09BR0c7SUFDSCxFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELHFCQUFxQjtRQUNyQixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUU7WUFDMUMsUUFBUSxFQUFFLElBQUk7WUFDZCxZQUFZLEVBQUUsSUFBSTtZQUNsQixLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUMsQ0FBQTtRQUVGLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBYyxHQUFFLENBQUMsQ0FBQTtRQUNyRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRXpDLG1CQUFtQjtRQUNuQixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDZixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRTdDLG1CQUFtQjtRQUNuQixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDZixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9DLENBQUMsQ0FBQyxDQUFBO0lBRUY7OztPQUdHO0lBQ0gsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUNwRCxrREFBa0Q7UUFDbEQsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO1FBQ2hFLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUscUJBQXFCLENBQUMsQ0FBQTtRQUV0RSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQWMsR0FBRSxDQUFDLENBQUE7UUFFdEQsaUNBQWlDO1FBQ2pDLE9BQU8sRUFBRSxDQUFBO1FBRVQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUNoRixNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBRW5GLGlCQUFpQjtRQUNqQixtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNqQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUN0QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0IHN1aXRlIGZvciB1c2VCcmVha3BvaW50cyBob29rXG4gKlxuICogVGhpcyBob29rIHByb3ZpZGVzIHJlc3BvbnNpdmUgYnJlYWtwb2ludCBkZXRlY3Rpb24gYmFzZWQgb24gd2luZG93IHdpZHRoLlxuICogSXQgbGlzdGVucyB0byB3aW5kb3cgcmVzaXplIGV2ZW50cyBhbmQgcmV0dXJucyB0aGUgY3VycmVudCBtZWRpYSB0eXBlLlxuICpcbiAqIEJyZWFrcG9pbnQgZGVmaW5pdGlvbnM6XG4gKiAtIG1vYmlsZTogd2lkdGggPD0gNjQwcHhcbiAqIC0gdGFibGV0OiA2NDBweCA8IHdpZHRoIDw9IDc2OHB4XG4gKiAtIHBjOiB3aWR0aCA+IDc2OHB4XG4gKlxuICogVGhlIGhvb2sgYXV0b21hdGljYWxseSB1cGRhdGVzIHdoZW4gdGhlIHdpbmRvdyBpcyByZXNpemVkIGFuZCBjbGVhbnMgdXBcbiAqIGV2ZW50IGxpc3RlbmVycyBvbiB1bm1vdW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLlxuICovXG5pbXBvcnQgeyBhY3QsIHJlbmRlckhvb2sgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZUJyZWFrcG9pbnRzLCB7IE1lZGlhVHlwZSB9IGZyb20gJy4vdXNlLWJyZWFrcG9pbnRzJ1xuXG5kZXNjcmliZSgndXNlQnJlYWtwb2ludHMnLCAoKSA9PiB7XG4gIGNvbnN0IG9yaWdpbmFsSW5uZXJXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG5cbiAgLyoqXG4gICAqIEhlbHBlciBmdW5jdGlvbiB0byBzaW11bGF0ZSB3aW5kb3cgcmVzaXplIGV2ZW50c1xuICAgKiBVcGRhdGVzIHdpbmRvdy5pbm5lcldpZHRoIGFuZCBkaXNwYXRjaGVzIGEgcmVzaXplIGV2ZW50XG4gICAqL1xuICBjb25zdCBmaXJlUmVzaXplID0gKHdpZHRoOiBudW1iZXIpID0+IHtcbiAgICB3aW5kb3cuaW5uZXJXaWR0aCA9IHdpZHRoXG4gICAgYWN0KCgpID0+IHtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlIHRoZSBvcmlnaW5hbCBpbm5lcldpZHRoIGFmdGVyIGFsbCB0ZXN0c1xuICAgKiBFbnN1cmVzIHRlc3RzIGRvbid0IGFmZmVjdCBlYWNoIG90aGVyIG9yIHRoZSB0ZXN0IGVudmlyb25tZW50XG4gICAqL1xuICBhZnRlckFsbCgoKSA9PiB7XG4gICAgd2luZG93LmlubmVyV2lkdGggPSBvcmlnaW5hbElubmVyV2lkdGhcbiAgfSlcblxuICAvKipcbiAgICogVGVzdCBtb2JpbGUgYnJlYWtwb2ludCBkZXRlY3Rpb25cbiAgICogTW9iaWxlIGRldmljZXMgaGF2ZSB3aWR0aCA8PSA2NDBweFxuICAgKi9cbiAgaXQoJ3Nob3VsZCByZXR1cm4gbW9iaWxlIGZvciB3aWR0aCA8PSA2NDBweCcsICgpID0+IHtcbiAgICAvLyBNb2NrIHdpbmRvdy5pbm5lcldpZHRoIGZvciBtb2JpbGVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnaW5uZXJXaWR0aCcsIHtcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IDY0MCxcbiAgICB9KVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlQnJlYWtwb2ludHMoKSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQmUoTWVkaWFUeXBlLm1vYmlsZSlcbiAgfSlcblxuICAvKipcbiAgICogVGVzdCB0YWJsZXQgYnJlYWtwb2ludCBkZXRlY3Rpb25cbiAgICogVGFibGV0IGRldmljZXMgaGF2ZSB3aWR0aCBiZXR3ZWVuIDY0MHB4IGFuZCA3NjhweFxuICAgKi9cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGFibGV0IGZvciB3aWR0aCA+IDY0MHB4IGFuZCA8PSA3NjhweCcsICgpID0+IHtcbiAgICAvLyBNb2NrIHdpbmRvdy5pbm5lcldpZHRoIGZvciB0YWJsZXRcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnaW5uZXJXaWR0aCcsIHtcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IDc2OCxcbiAgICB9KVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlQnJlYWtwb2ludHMoKSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQmUoTWVkaWFUeXBlLnRhYmxldClcbiAgfSlcblxuICAvKipcbiAgICogVGVzdCBkZXNrdG9wL1BDIGJyZWFrcG9pbnQgZGV0ZWN0aW9uXG4gICAqIERlc2t0b3AgZGV2aWNlcyBoYXZlIHdpZHRoID4gNzY4cHhcbiAgICovXG4gIGl0KCdzaG91bGQgcmV0dXJuIHBjIGZvciB3aWR0aCA+IDc2OHB4JywgKCkgPT4ge1xuICAgIC8vIE1vY2sgd2luZG93LmlubmVyV2lkdGggZm9yIHBjXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2lubmVyV2lkdGgnLCB7XG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAxMDI0LFxuICAgIH0pXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VCcmVha3BvaW50cygpKVxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9CZShNZWRpYVR5cGUucGMpXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3QgZHluYW1pYyBicmVha3BvaW50IHVwZGF0ZXMgb24gd2luZG93IHJlc2l6ZVxuICAgKiBUaGUgaG9vayBzaG91bGQgcmVhY3QgdG8gd2luZG93IHJlc2l6ZSBldmVudHMgYW5kIHVwZGF0ZSB0aGUgbWVkaWEgdHlwZVxuICAgKi9cbiAgaXQoJ3Nob3VsZCB1cGRhdGUgbWVkaWEgdHlwZSB3aGVuIHdpbmRvdyByZXNpemVzJywgKCkgPT4ge1xuICAgIC8vIFN0YXJ0IHdpdGggZGVza3RvcFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdpbm5lcldpZHRoJywge1xuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogMTAyNCxcbiAgICB9KVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlQnJlYWtwb2ludHMoKSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQmUoTWVkaWFUeXBlLnBjKVxuXG4gICAgLy8gUmVzaXplIHRvIHRhYmxldFxuICAgIGZpcmVSZXNpemUoNzY4KVxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9CZShNZWRpYVR5cGUudGFibGV0KVxuXG4gICAgLy8gUmVzaXplIHRvIG1vYmlsZVxuICAgIGZpcmVSZXNpemUoNjAwKVxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9CZShNZWRpYVR5cGUubW9iaWxlKVxuICB9KVxuXG4gIC8qKlxuICAgKiBUZXN0IHByb3BlciBjbGVhbnVwIG9mIGV2ZW50IGxpc3RlbmVyc1xuICAgKiBFbnN1cmVzIG5vIG1lbW9yeSBsZWFrcyBieSByZW1vdmluZyByZXNpemUgbGlzdGVuZXJzIG9uIHVubW91bnRcbiAgICovXG4gIGl0KCdzaG91bGQgY2xlYW4gdXAgZXZlbnQgbGlzdGVuZXJzIG9uIHVubW91bnQnLCAoKSA9PiB7XG4gICAgLy8gU3B5IG9uIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICBjb25zdCBhZGRFdmVudExpc3RlbmVyU3B5ID0gdmkuc3B5T24od2luZG93LCAnYWRkRXZlbnRMaXN0ZW5lcicpXG4gICAgY29uc3QgcmVtb3ZlRXZlbnRMaXN0ZW5lclNweSA9IHZpLnNweU9uKHdpbmRvdywgJ3JlbW92ZUV2ZW50TGlzdGVuZXInKVxuXG4gICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUJyZWFrcG9pbnRzKCkpXG5cbiAgICAvLyBVbm1vdW50IHNob3VsZCB0cmlnZ2VyIGNsZWFudXBcbiAgICB1bm1vdW50KClcblxuICAgIGV4cGVjdChhZGRFdmVudExpc3RlbmVyU3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncmVzaXplJywgZXhwZWN0LmFueShGdW5jdGlvbikpXG4gICAgZXhwZWN0KHJlbW92ZUV2ZW50TGlzdGVuZXJTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdyZXNpemUnLCBleHBlY3QuYW55KEZ1bmN0aW9uKSlcblxuICAgIC8vIENsZWFuIHVwIHNwaWVzXG4gICAgYWRkRXZlbnRMaXN0ZW5lclNweS5tb2NrUmVzdG9yZSgpXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lclNweS5tb2NrUmVzdG9yZSgpXG4gIH0pXG59KVxuIl19