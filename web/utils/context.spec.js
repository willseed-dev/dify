"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
/**
 * Test suite for React context creation utilities
 *
 * This module provides helper functions to create React contexts with better type safety
 * and automatic error handling when context is used outside of its provider.
 *
 * Two variants are provided:
 * - createCtx: Standard React context using useContext/createContext
 * - createSelectorCtx: Context with selector support using use-context-selector library
 */
const React = require("react");
const context_1 = require("./context");
describe('Context Utilities', () => {
    describe('createCtx', () => {
        /**
         * Test that createCtx creates a valid context with provider and hook
         * The function should return a tuple with [Provider, useContextValue, Context]
         * plus named properties for easier access
         */
        it('should create context with provider and hook', () => {
            const [Provider, useTestContext, Context] = (0, context_1.createCtx)({
                name: 'Test',
            });
            expect(Provider).toBeDefined();
            expect(useTestContext).toBeDefined();
            expect(Context).toBeDefined();
        });
        /**
         * Test that the context hook returns the provided value correctly
         * when used within the context provider
         */
        it('should provide and consume context value', () => {
            const [Provider, useTestContext] = (0, context_1.createCtx)({
                name: 'Test',
            });
            const testValue = { value: 'test-value' };
            const wrapper = ({ children }) => React.createElement(Provider, { value: testValue }, children);
            const { result } = (0, react_1.renderHook)(() => useTestContext(), { wrapper });
            expect(result.current).toEqual(testValue);
        });
        /**
         * Test that accessing context outside of provider throws an error
         * This ensures developers are notified when they forget to wrap components
         */
        it('should throw error when used outside provider', () => {
            const [, useTestContext] = (0, context_1.createCtx)({
                name: 'Test',
            });
            // Suppress console.error for this test
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(() => {
                (0, react_1.renderHook)(() => useTestContext());
            }).toThrow('No Test context found.');
            consoleError.mockRestore();
        });
        /**
         * Test that context works with default values
         * When a default value is provided, it should be accessible without a provider
         */
        it('should use default value when provided', () => {
            const defaultValue = { value: 'default' };
            const [, useTestContext] = (0, context_1.createCtx)({
                name: 'Test',
                defaultValue,
            });
            const { result } = (0, react_1.renderHook)(() => useTestContext());
            expect(result.current).toEqual(defaultValue);
        });
        /**
         * Test that the returned tuple has named properties for convenience
         * This allows destructuring or property access based on preference
         */
        it('should expose named properties', () => {
            const result = (0, context_1.createCtx)({ name: 'Test' });
            expect(result.provider).toBe(result[0]);
            expect(result.useContextValue).toBe(result[1]);
            expect(result.context).toBe(result[2]);
        });
        /**
         * Test context with complex data types
         * Ensures type safety is maintained with nested objects and arrays
         */
        it('should handle complex context values', () => {
            const [Provider, useComplexContext] = (0, context_1.createCtx)({
                name: 'Complex',
            });
            const complexValue = {
                user: { id: '123', name: 'Test User' },
                settings: { theme: 'dark', locale: 'en-US' },
                actions: [
                    () => { },
                    () => { },
                ],
            };
            const wrapper = ({ children }) => React.createElement(Provider, { value: complexValue }, children);
            const { result } = (0, react_1.renderHook)(() => useComplexContext(), { wrapper });
            expect(result.current).toEqual(complexValue);
            expect(result.current.user.id).toBe('123');
            expect(result.current.settings.theme).toBe('dark');
            expect(result.current.actions).toHaveLength(2);
        });
        /**
         * Test that context updates propagate to consumers
         * When provider value changes, hooks should receive the new value
         */
        it('should update when context value changes', () => {
            const [Provider, useTestContext] = (0, context_1.createCtx)({
                name: 'Test',
            });
            let value = { count: 0 };
            const wrapper = ({ children }) => React.createElement(Provider, { value }, children);
            const { result, rerender } = (0, react_1.renderHook)(() => useTestContext(), { wrapper });
            expect(result.current.count).toBe(0);
            value = { count: 5 };
            rerender();
            expect(result.current.count).toBe(5);
        });
    });
    describe('createSelectorCtx', () => {
        /**
         * Test that createSelectorCtx creates a valid context with selector support
         * This variant uses use-context-selector for optimized re-renders
         */
        it('should create selector context with provider and hook', () => {
            const [Provider, useTestContext, Context] = (0, context_1.createSelectorCtx)({
                name: 'SelectorTest',
            });
            expect(Provider).toBeDefined();
            expect(useTestContext).toBeDefined();
            expect(Context).toBeDefined();
        });
        /**
         * Test that selector context provides and consumes values correctly
         * The API should be identical to createCtx for basic usage
         */
        it('should provide and consume context value with selector', () => {
            const [Provider, useTestContext] = (0, context_1.createSelectorCtx)({
                name: 'SelectorTest',
            });
            const testValue = { value: 'selector-test' };
            const wrapper = ({ children }) => React.createElement(Provider, { value: testValue }, children);
            const { result } = (0, react_1.renderHook)(() => useTestContext(), { wrapper });
            expect(result.current).toEqual(testValue);
        });
        /**
         * Test error handling for selector context
         * Should throw error when used outside provider, same as createCtx
         */
        it('should throw error when used outside provider', () => {
            const [, useTestContext] = (0, context_1.createSelectorCtx)({
                name: 'SelectorTest',
            });
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(() => {
                (0, react_1.renderHook)(() => useTestContext());
            }).toThrow('No SelectorTest context found.');
            consoleError.mockRestore();
        });
        /**
         * Test that selector context works with default values
         */
        it('should use default value when provided', () => {
            const defaultValue = { value: 'selector-default' };
            const [, useTestContext] = (0, context_1.createSelectorCtx)({
                name: 'SelectorTest',
                defaultValue,
            });
            const { result } = (0, react_1.renderHook)(() => useTestContext());
            expect(result.current).toEqual(defaultValue);
        });
    });
    describe('Context without name', () => {
        /**
         * Test that contexts can be created without a name
         * The error message should use a generic fallback
         */
        it('should create context without name and show generic error', () => {
            const [, useTestContext] = (0, context_1.createCtx)();
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(() => {
                (0, react_1.renderHook)(() => useTestContext());
            }).toThrow('No related context found.');
            consoleError.mockRestore();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udGV4dC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQW1EO0FBQ25EOzs7Ozs7Ozs7R0FTRztBQUNILCtCQUE4QjtBQUM5Qix1Q0FBd0Q7QUFFeEQsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6Qjs7OztXQUlHO1FBQ0gsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUV0RCxNQUFNLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFBLG1CQUFTLEVBQW1CO2dCQUN0RSxJQUFJLEVBQUUsTUFBTTthQUNiLENBQUMsQ0FBQTtZQUVGLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUM5QixNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7WUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQy9CLENBQUMsQ0FBQyxDQUFBO1FBRUY7OztXQUdHO1FBQ0gsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtZQUVsRCxNQUFNLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxHQUFHLElBQUEsbUJBQVMsRUFBbUI7Z0JBQzdELElBQUksRUFBRSxNQUFNO2FBQ2IsQ0FBQyxDQUFBO1lBRUYsTUFBTSxTQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUE7WUFFekMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBaUMsRUFBRSxFQUFFLENBQzlELEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1lBRS9ELE1BQU0sRUFBRSxNQUFN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Q2IsQ0FBQyxDQUFBO1lBRUYsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO1lBRXJELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDOzs7V0FHRztRQUNILEVBQUUsQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7WUFFbkUsTUFBTSxDQUFDLEVBQUUsY0FBYyxDQUFDLEdBQUcsSUFBQSxtQkFBUyxHQUFvQixDQUFBO1lBRXhELE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxHQUF3QixDQUFDLENBQUMsQ0FBQTtZQUVsRyxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO1lBRXZDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXJIb29rIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbi8qKlxuICogVGVzdCBzdWl0ZSBmb3IgUmVhY3QgY29udGV4dCBjcmVhdGlvbiB1dGlsaXRpZXNcbiAqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBoZWxwZXIgZnVuY3Rpb25zIHRvIGNyZWF0ZSBSZWFjdCBjb250ZXh0cyB3aXRoIGJldHRlciB0eXBlIHNhZmV0eVxuICogYW5kIGF1dG9tYXRpYyBlcnJvciBoYW5kbGluZyB3aGVuIGNvbnRleHQgaXMgdXNlZCBvdXRzaWRlIG9mIGl0cyBwcm92aWRlci5cbiAqXG4gKiBUd28gdmFyaWFudHMgYXJlIHByb3ZpZGVkOlxuICogLSBjcmVhdGVDdHg6IFN0YW5kYXJkIFJlYWN0IGNvbnRleHQgdXNpbmcgdXNlQ29udGV4dC9jcmVhdGVDb250ZXh0XG4gKiAtIGNyZWF0ZVNlbGVjdG9yQ3R4OiBDb250ZXh0IHdpdGggc2VsZWN0b3Igc3VwcG9ydCB1c2luZyB1c2UtY29udGV4dC1zZWxlY3RvciBsaWJyYXJ5XG4gKi9cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY3JlYXRlQ3R4LCBjcmVhdGVTZWxlY3RvckN0eCB9IGZyb20gJy4vY29udGV4dCdcblxuZGVzY3JpYmUoJ0NvbnRleHQgVXRpbGl0aWVzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY3JlYXRlQ3R4JywgKCkgPT4ge1xuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCBjcmVhdGVDdHggY3JlYXRlcyBhIHZhbGlkIGNvbnRleHQgd2l0aCBwcm92aWRlciBhbmQgaG9va1xuICAgICAqIFRoZSBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIGEgdHVwbGUgd2l0aCBbUHJvdmlkZXIsIHVzZUNvbnRleHRWYWx1ZSwgQ29udGV4dF1cbiAgICAgKiBwbHVzIG5hbWVkIHByb3BlcnRpZXMgZm9yIGVhc2llciBhY2Nlc3NcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBjb250ZXh0IHdpdGggcHJvdmlkZXIgYW5kIGhvb2snLCAoKSA9PiB7XG4gICAgICB0eXBlIFRlc3RDb250ZXh0VmFsdWUgPSB7IHZhbHVlOiBzdHJpbmcgfVxuICAgICAgY29uc3QgW1Byb3ZpZGVyLCB1c2VUZXN0Q29udGV4dCwgQ29udGV4dF0gPSBjcmVhdGVDdHg8VGVzdENvbnRleHRWYWx1ZT4oe1xuICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QoUHJvdmlkZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCh1c2VUZXN0Q29udGV4dCkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KENvbnRleHQpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IHRoZSBjb250ZXh0IGhvb2sgcmV0dXJucyB0aGUgcHJvdmlkZWQgdmFsdWUgY29ycmVjdGx5XG4gICAgICogd2hlbiB1c2VkIHdpdGhpbiB0aGUgY29udGV4dCBwcm92aWRlclxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgcHJvdmlkZSBhbmQgY29uc3VtZSBjb250ZXh0IHZhbHVlJywgKCkgPT4ge1xuICAgICAgdHlwZSBUZXN0Q29udGV4dFZhbHVlID0geyB2YWx1ZTogc3RyaW5nIH1cbiAgICAgIGNvbnN0IFtQcm92aWRlciwgdXNlVGVzdENvbnRleHRdID0gY3JlYXRlQ3R4PFRlc3RDb250ZXh0VmFsdWU+KHtcbiAgICAgICAgbmFtZTogJ1Rlc3QnLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgdGVzdFZhbHVlID0geyB2YWx1ZTogJ3Rlc3QtdmFsdWUnIH1cblxuICAgICAgY29uc3Qgd3JhcHBlciA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3ZpZGVyLCB7IHZhbHVlOiB0ZXN0VmFsdWUgfSwgY2hpbGRyZW4pXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVRlc3RDb250ZXh0KCksIHsgd3JhcHBlciB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvRXF1YWwodGVzdFZhbHVlKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgYWNjZXNzaW5nIGNvbnRleHQgb3V0c2lkZSBvZiBwcm92aWRlciB0aHJvd3MgYW4gZXJyb3JcbiAgICAgKiBUaGlzIGVuc3VyZXMgZGV2ZWxvcGVycyBhcmUgbm90aWZpZWQgd2hlbiB0aGV5IGZvcmdldCB0byB3cmFwIGNvbXBvbmVudHNcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHRocm93IGVycm9yIHdoZW4gdXNlZCBvdXRzaWRlIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgICAgdHlwZSBUZXN0Q29udGV4dFZhbHVlID0geyB2YWx1ZTogc3RyaW5nIH1cbiAgICAgIGNvbnN0IFssIHVzZVRlc3RDb250ZXh0XSA9IGNyZWF0ZUN0eDxUZXN0Q29udGV4dFZhbHVlPih7XG4gICAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFN1cHByZXNzIGNvbnNvbGUuZXJyb3IgZm9yIHRoaXMgdGVzdFxuICAgICAgY29uc3QgY29uc29sZUVycm9yID0gdmkuc3B5T24oY29uc29sZSwgJ2Vycm9yJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHsgLyogc3VwcHJlc3MgZXJyb3IgKi8gfSlcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVySG9vaygoKSA9PiB1c2VUZXN0Q29udGV4dCgpKVxuICAgICAgfSkudG9UaHJvdygnTm8gVGVzdCBjb250ZXh0IGZvdW5kLicpXG5cbiAgICAgIGNvbnNvbGVFcnJvci5tb2NrUmVzdG9yZSgpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCBjb250ZXh0IHdvcmtzIHdpdGggZGVmYXVsdCB2YWx1ZXNcbiAgICAgKiBXaGVuIGEgZGVmYXVsdCB2YWx1ZSBpcyBwcm92aWRlZCwgaXQgc2hvdWxkIGJlIGFjY2Vzc2libGUgd2l0aG91dCBhIHByb3ZpZGVyXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCB2YWx1ZSB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgdHlwZSBUZXN0Q29udGV4dFZhbHVlID0geyB2YWx1ZTogc3RyaW5nIH1cbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IHsgdmFsdWU6ICdkZWZhdWx0JyB9XG4gICAgICBjb25zdCBbLCB1c2VUZXN0Q29udGV4dF0gPSBjcmVhdGVDdHg8VGVzdENvbnRleHRWYWx1ZT4oe1xuICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgIGRlZmF1bHRWYWx1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVRlc3RDb250ZXh0KCkpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9FcXVhbChkZWZhdWx0VmFsdWUpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCB0aGUgcmV0dXJuZWQgdHVwbGUgaGFzIG5hbWVkIHByb3BlcnRpZXMgZm9yIGNvbnZlbmllbmNlXG4gICAgICogVGhpcyBhbGxvd3MgZGVzdHJ1Y3R1cmluZyBvciBwcm9wZXJ0eSBhY2Nlc3MgYmFzZWQgb24gcHJlZmVyZW5jZVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZXhwb3NlIG5hbWVkIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICB0eXBlIFRlc3RDb250ZXh0VmFsdWUgPSB7IHZhbHVlOiBzdHJpbmcgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlQ3R4PFRlc3RDb250ZXh0VmFsdWU+KHsgbmFtZTogJ1Rlc3QnIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQucHJvdmlkZXIpLnRvQmUocmVzdWx0WzBdKVxuICAgICAgZXhwZWN0KHJlc3VsdC51c2VDb250ZXh0VmFsdWUpLnRvQmUocmVzdWx0WzFdKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jb250ZXh0KS50b0JlKHJlc3VsdFsyXSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb250ZXh0IHdpdGggY29tcGxleCBkYXRhIHR5cGVzXG4gICAgICogRW5zdXJlcyB0eXBlIHNhZmV0eSBpcyBtYWludGFpbmVkIHdpdGggbmVzdGVkIG9iamVjdHMgYW5kIGFycmF5c1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbXBsZXggY29udGV4dCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICB0eXBlIENvbXBsZXhDb250ZXh0ID0ge1xuICAgICAgICB1c2VyOiB7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB9XG4gICAgICAgIHNldHRpbmdzOiB7IHRoZW1lOiBzdHJpbmcsIGxvY2FsZTogc3RyaW5nIH1cbiAgICAgICAgYWN0aW9uczogQXJyYXk8KCkgPT4gdm9pZD5cbiAgICAgIH1cblxuICAgICAgY29uc3QgW1Byb3ZpZGVyLCB1c2VDb21wbGV4Q29udGV4dF0gPSBjcmVhdGVDdHg8Q29tcGxleENvbnRleHQ+KHtcbiAgICAgICAgbmFtZTogJ0NvbXBsZXgnLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgY29tcGxleFZhbHVlOiBDb21wbGV4Q29udGV4dCA9IHtcbiAgICAgICAgdXNlcjogeyBpZDogJzEyMycsIG5hbWU6ICdUZXN0IFVzZXInIH0sXG4gICAgICAgIHNldHRpbmdzOiB7IHRoZW1lOiAnZGFyaycsIGxvY2FsZTogJ2VuLVVTJyB9LFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgKCkgPT4geyAvKiBlbXB0eSBhY3Rpb24gMSAqLyB9LFxuICAgICAgICAgICgpID0+IHsgLyogZW1wdHkgYWN0aW9uIDIgKi8gfSxcbiAgICAgICAgXSxcbiAgICAgIH1cblxuICAgICAgY29uc3Qgd3JhcHBlciA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3ZpZGVyLCB7IHZhbHVlOiBjb21wbGV4VmFsdWUgfSwgY2hpbGRyZW4pXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUNvbXBsZXhDb250ZXh0KCksIHsgd3JhcHBlciB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvRXF1YWwoY29tcGxleFZhbHVlKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnVzZXIuaWQpLnRvQmUoJzEyMycpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2V0dGluZ3MudGhlbWUpLnRvQmUoJ2RhcmsnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmFjdGlvbnMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgY29udGV4dCB1cGRhdGVzIHByb3BhZ2F0ZSB0byBjb25zdW1lcnNcbiAgICAgKiBXaGVuIHByb3ZpZGVyIHZhbHVlIGNoYW5nZXMsIGhvb2tzIHNob3VsZCByZWNlaXZlIHRoZSBuZXcgdmFsdWVcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB3aGVuIGNvbnRleHQgdmFsdWUgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIHR5cGUgVGVzdENvbnRleHRWYWx1ZSA9IHsgY291bnQ6IG51bWJlciB9XG4gICAgICBjb25zdCBbUHJvdmlkZXIsIHVzZVRlc3RDb250ZXh0XSA9IGNyZWF0ZUN0eDxUZXN0Q29udGV4dFZhbHVlPih7XG4gICAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgIH0pXG5cbiAgICAgIGxldCB2YWx1ZSA9IHsgY291bnQ6IDAgfVxuICAgICAgY29uc3Qgd3JhcHBlciA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3ZpZGVyLCB7IHZhbHVlIH0sIGNoaWxkcmVuKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCwgcmVyZW5kZXIgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlVGVzdENvbnRleHQoKSwgeyB3cmFwcGVyIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jb3VudCkudG9CZSgwKVxuXG4gICAgICB2YWx1ZSA9IHsgY291bnQ6IDUgfVxuICAgICAgcmVyZW5kZXIoKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY291bnQpLnRvQmUoNSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdjcmVhdGVTZWxlY3RvckN0eCcsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgY3JlYXRlU2VsZWN0b3JDdHggY3JlYXRlcyBhIHZhbGlkIGNvbnRleHQgd2l0aCBzZWxlY3RvciBzdXBwb3J0XG4gICAgICogVGhpcyB2YXJpYW50IHVzZXMgdXNlLWNvbnRleHQtc2VsZWN0b3IgZm9yIG9wdGltaXplZCByZS1yZW5kZXJzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgc2VsZWN0b3IgY29udGV4dCB3aXRoIHByb3ZpZGVyIGFuZCBob29rJywgKCkgPT4ge1xuICAgICAgdHlwZSBUZXN0Q29udGV4dFZhbHVlID0geyB2YWx1ZTogc3RyaW5nIH1cbiAgICAgIGNvbnN0IFtQcm92aWRlciwgdXNlVGVzdENvbnRleHQsIENvbnRleHRdID0gY3JlYXRlU2VsZWN0b3JDdHg8VGVzdENvbnRleHRWYWx1ZT4oe1xuICAgICAgICBuYW1lOiAnU2VsZWN0b3JUZXN0JyxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChQcm92aWRlcikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHVzZVRlc3RDb250ZXh0KS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoQ29udGV4dCkudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgc2VsZWN0b3IgY29udGV4dCBwcm92aWRlcyBhbmQgY29uc3VtZXMgdmFsdWVzIGNvcnJlY3RseVxuICAgICAqIFRoZSBBUEkgc2hvdWxkIGJlIGlkZW50aWNhbCB0byBjcmVhdGVDdHggZm9yIGJhc2ljIHVzYWdlXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBwcm92aWRlIGFuZCBjb25zdW1lIGNvbnRleHQgdmFsdWUgd2l0aCBzZWxlY3RvcicsICgpID0+IHtcbiAgICAgIHR5cGUgVGVzdENvbnRleHRWYWx1ZSA9IHsgdmFsdWU6IHN0cmluZyB9XG4gICAgICBjb25zdCBbUHJvdmlkZXIsIHVzZVRlc3RDb250ZXh0XSA9IGNyZWF0ZVNlbGVjdG9yQ3R4PFRlc3RDb250ZXh0VmFsdWU+KHtcbiAgICAgICAgbmFtZTogJ1NlbGVjdG9yVGVzdCcsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB0ZXN0VmFsdWUgPSB7IHZhbHVlOiAnc2VsZWN0b3ItdGVzdCcgfVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pID0+XG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvdmlkZXIsIHsgdmFsdWU6IHRlc3RWYWx1ZSB9LCBjaGlsZHJlbilcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlVGVzdENvbnRleHQoKSwgeyB3cmFwcGVyIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9FcXVhbCh0ZXN0VmFsdWUpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgZXJyb3IgaGFuZGxpbmcgZm9yIHNlbGVjdG9yIGNvbnRleHRcbiAgICAgKiBTaG91bGQgdGhyb3cgZXJyb3Igd2hlbiB1c2VkIG91dHNpZGUgcHJvdmlkZXIsIHNhbWUgYXMgY3JlYXRlQ3R4XG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCB0aHJvdyBlcnJvciB3aGVuIHVzZWQgb3V0c2lkZSBwcm92aWRlcicsICgpID0+IHtcbiAgICAgIHR5cGUgVGVzdENvbnRleHRWYWx1ZSA9IHsgdmFsdWU6IHN0cmluZyB9XG4gICAgICBjb25zdCBbLCB1c2VUZXN0Q29udGV4dF0gPSBjcmVhdGVTZWxlY3RvckN0eDxUZXN0Q29udGV4dFZhbHVlPih7XG4gICAgICAgIG5hbWU6ICdTZWxlY3RvclRlc3QnLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgY29uc29sZUVycm9yID0gdmkuc3B5T24oY29uc29sZSwgJ2Vycm9yJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHsgLyogc3VwcHJlc3MgZXJyb3IgKi8gfSlcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVySG9vaygoKSA9PiB1c2VUZXN0Q29udGV4dCgpKVxuICAgICAgfSkudG9UaHJvdygnTm8gU2VsZWN0b3JUZXN0IGNvbnRleHQgZm91bmQuJylcblxuICAgICAgY29uc29sZUVycm9yLm1vY2tSZXN0b3JlKClcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IHNlbGVjdG9yIGNvbnRleHQgd29ya3Mgd2l0aCBkZWZhdWx0IHZhbHVlc1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHQgdmFsdWUgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIHR5cGUgVGVzdENvbnRleHRWYWx1ZSA9IHsgdmFsdWU6IHN0cmluZyB9XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSB7IHZhbHVlOiAnc2VsZWN0b3ItZGVmYXVsdCcgfVxuICAgICAgY29uc3QgWywgdXNlVGVzdENvbnRleHRdID0gY3JlYXRlU2VsZWN0b3JDdHg8VGVzdENvbnRleHRWYWx1ZT4oe1xuICAgICAgICBuYW1lOiAnU2VsZWN0b3JUZXN0JyxcbiAgICAgICAgZGVmYXVsdFZhbHVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlVGVzdENvbnRleHQoKSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0VxdWFsKGRlZmF1bHRWYWx1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDb250ZXh0IHdpdGhvdXQgbmFtZScsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgY29udGV4dHMgY2FuIGJlIGNyZWF0ZWQgd2l0aG91dCBhIG5hbWVcbiAgICAgKiBUaGUgZXJyb3IgbWVzc2FnZSBzaG91bGQgdXNlIGEgZ2VuZXJpYyBmYWxsYmFja1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgY3JlYXRlIGNvbnRleHQgd2l0aG91dCBuYW1lIGFuZCBzaG93IGdlbmVyaWMgZXJyb3InLCAoKSA9PiB7XG4gICAgICB0eXBlIFRlc3RDb250ZXh0VmFsdWUgPSB7IHZhbHVlOiBzdHJpbmcgfVxuICAgICAgY29uc3QgWywgdXNlVGVzdENvbnRleHRdID0gY3JlYXRlQ3R4PFRlc3RDb250ZXh0VmFsdWU+KClcblxuICAgICAgY29uc3QgY29uc29sZUVycm9yID0gdmkuc3B5T24oY29uc29sZSwgJ2Vycm9yJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHsgLyogc3VwcHJlc3MgZXJyb3IgKi8gfSlcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVySG9vaygoKSA9PiB1c2VUZXN0Q29udGV4dCgpKVxuICAgICAgfSkudG9UaHJvdygnTm8gcmVsYXRlZCBjb250ZXh0IGZvdW5kLicpXG5cbiAgICAgIGNvbnNvbGVFcnJvci5tb2NrUmVzdG9yZSgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=