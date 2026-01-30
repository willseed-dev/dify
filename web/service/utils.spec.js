"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@/types/common");
/**
 * Test suite for service utility functions
 *
 * This module provides utilities for working with different flow types in the application.
 * Flow types determine the API endpoint prefix used for various operations.
 *
 * Key concepts:
 * - FlowType.appFlow: Standard application workflows (prefix: 'apps')
 * - FlowType.ragPipeline: RAG (Retrieval-Augmented Generation) pipelines (prefix: 'rag/pipelines')
 *
 * The getFlowPrefix function maps flow types to their corresponding API path prefixes,
 * with a fallback to 'apps' for undefined or unknown flow types.
 */
const utils_1 = require("./utils");
describe('Service Utils', () => {
    describe('flowPrefixMap', () => {
        /**
         * Test that the flowPrefixMap object contains the expected mappings
         * This ensures the mapping configuration is correct
         */
        it('should have correct flow type to prefix mappings', () => {
            expect(utils_1.flowPrefixMap[common_1.FlowType.appFlow]).toBe('apps');
            expect(utils_1.flowPrefixMap[common_1.FlowType.ragPipeline]).toBe('rag/pipelines');
        });
        /**
         * Test that the map only contains the expected flow types
         * This helps catch unintended additions to the mapping
         */
        it('should contain exactly two flow type mappings', () => {
            const keys = Object.keys(utils_1.flowPrefixMap);
            expect(keys).toHaveLength(2);
        });
    });
    describe('getFlowPrefix', () => {
        /**
         * Test that appFlow type returns the correct prefix
         * This is the most common flow type for standard application workflows
         */
        it('should return "apps" for appFlow type', () => {
            const result = (0, utils_1.getFlowPrefix)(common_1.FlowType.appFlow);
            expect(result).toBe('apps');
        });
        /**
         * Test that ragPipeline type returns the correct prefix
         * RAG pipelines have a different API structure with nested paths
         */
        it('should return "rag/pipelines" for ragPipeline type', () => {
            const result = (0, utils_1.getFlowPrefix)(common_1.FlowType.ragPipeline);
            expect(result).toBe('rag/pipelines');
        });
        /**
         * Test fallback behavior when no flow type is provided
         * Should default to 'apps' prefix for backward compatibility
         */
        it('should return "apps" when flow type is undefined', () => {
            const result = (0, utils_1.getFlowPrefix)(undefined);
            expect(result).toBe('apps');
        });
        /**
         * Test fallback behavior for unknown flow types
         * Any unrecognized flow type should default to 'apps'
         */
        it('should return "apps" for unknown flow type', () => {
            // Cast to FlowType to test the fallback behavior
            const unknownType = 'unknown';
            const result = (0, utils_1.getFlowPrefix)(unknownType);
            expect(result).toBe('apps');
        });
        /**
         * Test that the function handles null gracefully
         * Null should be treated the same as undefined
         */
        it('should return "apps" when flow type is null', () => {
            const result = (0, utils_1.getFlowPrefix)(null);
            expect(result).toBe('apps');
        });
        /**
         * Test consistency with flowPrefixMap
         * The function should return the same values as direct map access
         */
        it('should return values consistent with flowPrefixMap', () => {
            expect((0, utils_1.getFlowPrefix)(common_1.FlowType.appFlow)).toBe(utils_1.flowPrefixMap[common_1.FlowType.appFlow]);
            expect((0, utils_1.getFlowPrefix)(common_1.FlowType.ragPipeline)).toBe(utils_1.flowPrefixMap[common_1.FlowType.ragPipeline]);
        });
    });
    describe('Integration scenarios', () => {
        /**
         * Test typical usage pattern in API path construction
         * This demonstrates how the function is used in real application code
         */
        it('should construct correct API paths for different flow types', () => {
            const appId = '123';
            // App flow path construction
            const appFlowPath = `/${(0, utils_1.getFlowPrefix)(common_1.FlowType.appFlow)}/${appId}`;
            expect(appFlowPath).toBe('/apps/123');
            // RAG pipeline path construction
            const ragPipelinePath = `/${(0, utils_1.getFlowPrefix)(common_1.FlowType.ragPipeline)}/${appId}`;
            expect(ragPipelinePath).toBe('/rag/pipelines/123');
        });
        /**
         * Test that the function can be used in conditional logic
         * Common pattern for determining which API endpoint to use
         */
        it('should support conditional API routing logic', () => {
            const determineEndpoint = (flowType, resourceId) => {
                const prefix = (0, utils_1.getFlowPrefix)(flowType);
                return `/${prefix}/${resourceId || 'default'}`;
            };
            expect(determineEndpoint(common_1.FlowType.appFlow, 'app-1')).toBe('/apps/app-1');
            expect(determineEndpoint(common_1.FlowType.ragPipeline, 'pipeline-1')).toBe('/rag/pipelines/pipeline-1');
            expect(determineEndpoint(undefined, 'fallback')).toBe('/apps/fallback');
        });
        /**
         * Test behavior with empty string flow type
         * Empty strings should fall back to default
         */
        it('should handle empty string as flow type', () => {
            const result = (0, utils_1.getFlowPrefix)('');
            expect(result).toBe('apps');
        });
    });
    describe('Type safety', () => {
        /**
         * Test that all FlowType enum values are handled
         * This ensures we don't miss any flow types in the mapping
         */
        it('should handle all FlowType enum values', () => {
            // Get all enum values
            const flowTypes = Object.values(common_1.FlowType);
            // Each flow type should return a valid prefix
            flowTypes.forEach((flowType) => {
                const prefix = (0, utils_1.getFlowPrefix)(flowType);
                expect(prefix).toBeTruthy();
                expect(typeof prefix).toBe('string');
                expect(prefix.length).toBeGreaterThan(0);
            });
        });
        /**
         * Test that returned prefixes are valid path segments
         * Prefixes should not contain leading/trailing slashes or invalid characters
         */
        it('should return valid path segments without leading/trailing slashes', () => {
            const appFlowPrefix = (0, utils_1.getFlowPrefix)(common_1.FlowType.appFlow);
            const ragPipelinePrefix = (0, utils_1.getFlowPrefix)(common_1.FlowType.ragPipeline);
            expect(appFlowPrefix).not.toMatch(/^\//);
            expect(appFlowPrefix).not.toMatch(/\/$/);
            expect(ragPipelinePrefix).not.toMatch(/^\//);
            expect(ragPipelinePrefix).not.toMatch(/\/$/);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBeUM7QUFDekM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsbUNBQXNEO0FBRXRELFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCOzs7V0FHRztRQUNILEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsTUFBTSxDQUFDLHFCQUFhLENBQUMsaUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNwRCxNQUFNLENBQUMscUJBQWEsQ0FBQyxpQkFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQ25FLENBQUMsQ0FBQyxDQUFBO1FBRUY7OztXQUdHO1FBQ0gsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFhLENBQUMsQ0FBQTtZQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUM3Qjs7O1dBR0c7UUFDSCxFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUEscUJBQWEsRUFBQyxpQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDN0IsQ0FBQyxDQUFDLENBQUE7UUFFRjs7O1dBR0c7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QUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGOzs7V0FHRztRQUNILEVBQUUsQ0FBQyxvRUFBb0UsRUFBRSxHQUFHLEVBQUU7WUFDNUUsTUFBTSxhQUFhLEdBQUcsSUFBQSxxQkFBYSxFQUFDLGlCQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDckQsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLHFCQUFhLEVBQUMsaUJBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUU3RCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN4QyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN4QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzVDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDOUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmxvd1R5cGUgfSBmcm9tICdAL3R5cGVzL2NvbW1vbidcbi8qKlxuICogVGVzdCBzdWl0ZSBmb3Igc2VydmljZSB1dGlsaXR5IGZ1bmN0aW9uc1xuICpcbiAqIFRoaXMgbW9kdWxlIHByb3ZpZGVzIHV0aWxpdGllcyBmb3Igd29ya2luZyB3aXRoIGRpZmZlcmVudCBmbG93IHR5cGVzIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqIEZsb3cgdHlwZXMgZGV0ZXJtaW5lIHRoZSBBUEkgZW5kcG9pbnQgcHJlZml4IHVzZWQgZm9yIHZhcmlvdXMgb3BlcmF0aW9ucy5cbiAqXG4gKiBLZXkgY29uY2VwdHM6XG4gKiAtIEZsb3dUeXBlLmFwcEZsb3c6IFN0YW5kYXJkIGFwcGxpY2F0aW9uIHdvcmtmbG93cyAocHJlZml4OiAnYXBwcycpXG4gKiAtIEZsb3dUeXBlLnJhZ1BpcGVsaW5lOiBSQUcgKFJldHJpZXZhbC1BdWdtZW50ZWQgR2VuZXJhdGlvbikgcGlwZWxpbmVzIChwcmVmaXg6ICdyYWcvcGlwZWxpbmVzJylcbiAqXG4gKiBUaGUgZ2V0Rmxvd1ByZWZpeCBmdW5jdGlvbiBtYXBzIGZsb3cgdHlwZXMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBBUEkgcGF0aCBwcmVmaXhlcyxcbiAqIHdpdGggYSBmYWxsYmFjayB0byAnYXBwcycgZm9yIHVuZGVmaW5lZCBvciB1bmtub3duIGZsb3cgdHlwZXMuXG4gKi9cbmltcG9ydCB7IGZsb3dQcmVmaXhNYXAsIGdldEZsb3dQcmVmaXggfSBmcm9tICcuL3V0aWxzJ1xuXG5kZXNjcmliZSgnU2VydmljZSBVdGlscycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2Zsb3dQcmVmaXhNYXAnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IHRoZSBmbG93UHJlZml4TWFwIG9iamVjdCBjb250YWlucyB0aGUgZXhwZWN0ZWQgbWFwcGluZ3NcbiAgICAgKiBUaGlzIGVuc3VyZXMgdGhlIG1hcHBpbmcgY29uZmlndXJhdGlvbiBpcyBjb3JyZWN0XG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgZmxvdyB0eXBlIHRvIHByZWZpeCBtYXBwaW5ncycsICgpID0+IHtcbiAgICAgIGV4cGVjdChmbG93UHJlZml4TWFwW0Zsb3dUeXBlLmFwcEZsb3ddKS50b0JlKCdhcHBzJylcbiAgICAgIGV4cGVjdChmbG93UHJlZml4TWFwW0Zsb3dUeXBlLnJhZ1BpcGVsaW5lXSkudG9CZSgncmFnL3BpcGVsaW5lcycpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCB0aGUgbWFwIG9ubHkgY29udGFpbnMgdGhlIGV4cGVjdGVkIGZsb3cgdHlwZXNcbiAgICAgKiBUaGlzIGhlbHBzIGNhdGNoIHVuaW50ZW5kZWQgYWRkaXRpb25zIHRvIHRoZSBtYXBwaW5nXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb250YWluIGV4YWN0bHkgdHdvIGZsb3cgdHlwZSBtYXBwaW5ncycsICgpID0+IHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhmbG93UHJlZml4TWFwKVxuICAgICAgZXhwZWN0KGtleXMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldEZsb3dQcmVmaXgnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IGFwcEZsb3cgdHlwZSByZXR1cm5zIHRoZSBjb3JyZWN0IHByZWZpeFxuICAgICAqIFRoaXMgaXMgdGhlIG1vc3QgY29tbW9uIGZsb3cgdHlwZSBmb3Igc3RhbmRhcmQgYXBwbGljYXRpb24gd29ya2Zsb3dzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gXCJhcHBzXCIgZm9yIGFwcEZsb3cgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEZsb3dQcmVmaXgoRmxvd1R5cGUuYXBwRmxvdylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoJ2FwcHMnKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgcmFnUGlwZWxpbmUgdHlwZSByZXR1cm5zIHRoZSBjb3JyZWN0IHByZWZpeFxuICAgICAqIFJBRyBwaXBlbGluZXMgaGF2ZSBhIGRpZmZlcmVudCBBUEkgc3RydWN0dXJlIHdpdGggbmVzdGVkIHBhdGhzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gXCJyYWcvcGlwZWxpbmVzXCIgZm9yIHJhZ1BpcGVsaW5lIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRGbG93UHJlZml4KEZsb3dUeXBlLnJhZ1BpcGVsaW5lKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgncmFnL3BpcGVsaW5lcycpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgZmFsbGJhY2sgYmVoYXZpb3Igd2hlbiBubyBmbG93IHR5cGUgaXMgcHJvdmlkZWRcbiAgICAgKiBTaG91bGQgZGVmYXVsdCB0byAnYXBwcycgcHJlZml4IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gXCJhcHBzXCIgd2hlbiBmbG93IHR5cGUgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0Rmxvd1ByZWZpeCh1bmRlZmluZWQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCdhcHBzJylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBmYWxsYmFjayBiZWhhdmlvciBmb3IgdW5rbm93biBmbG93IHR5cGVzXG4gICAgICogQW55IHVucmVjb2duaXplZCBmbG93IHR5cGUgc2hvdWxkIGRlZmF1bHQgdG8gJ2FwcHMnXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gXCJhcHBzXCIgZm9yIHVua25vd24gZmxvdyB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQ2FzdCB0byBGbG93VHlwZSB0byB0ZXN0IHRoZSBmYWxsYmFjayBiZWhhdmlvclxuICAgICAgY29uc3QgdW5rbm93blR5cGUgPSAndW5rbm93bicgYXMgRmxvd1R5cGVcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEZsb3dQcmVmaXgodW5rbm93blR5cGUpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCdhcHBzJylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IHRoZSBmdW5jdGlvbiBoYW5kbGVzIG51bGwgZ3JhY2VmdWxseVxuICAgICAqIE51bGwgc2hvdWxkIGJlIHRyZWF0ZWQgdGhlIHNhbWUgYXMgdW5kZWZpbmVkXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gXCJhcHBzXCIgd2hlbiBmbG93IHR5cGUgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEZsb3dQcmVmaXgobnVsbCBhcyBhbnkpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCdhcHBzJylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb25zaXN0ZW5jeSB3aXRoIGZsb3dQcmVmaXhNYXBcbiAgICAgKiBUaGUgZnVuY3Rpb24gc2hvdWxkIHJldHVybiB0aGUgc2FtZSB2YWx1ZXMgYXMgZGlyZWN0IG1hcCBhY2Nlc3NcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHJldHVybiB2YWx1ZXMgY29uc2lzdGVudCB3aXRoIGZsb3dQcmVmaXhNYXAnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0Rmxvd1ByZWZpeChGbG93VHlwZS5hcHBGbG93KSkudG9CZShmbG93UHJlZml4TWFwW0Zsb3dUeXBlLmFwcEZsb3ddKVxuICAgICAgZXhwZWN0KGdldEZsb3dQcmVmaXgoRmxvd1R5cGUucmFnUGlwZWxpbmUpKS50b0JlKGZsb3dQcmVmaXhNYXBbRmxvd1R5cGUucmFnUGlwZWxpbmVdKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uIHNjZW5hcmlvcycsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0IHR5cGljYWwgdXNhZ2UgcGF0dGVybiBpbiBBUEkgcGF0aCBjb25zdHJ1Y3Rpb25cbiAgICAgKiBUaGlzIGRlbW9uc3RyYXRlcyBob3cgdGhlIGZ1bmN0aW9uIGlzIHVzZWQgaW4gcmVhbCBhcHBsaWNhdGlvbiBjb2RlXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb25zdHJ1Y3QgY29ycmVjdCBBUEkgcGF0aHMgZm9yIGRpZmZlcmVudCBmbG93IHR5cGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwSWQgPSAnMTIzJ1xuXG4gICAgICAvLyBBcHAgZmxvdyBwYXRoIGNvbnN0cnVjdGlvblxuICAgICAgY29uc3QgYXBwRmxvd1BhdGggPSBgLyR7Z2V0Rmxvd1ByZWZpeChGbG93VHlwZS5hcHBGbG93KX0vJHthcHBJZH1gXG4gICAgICBleHBlY3QoYXBwRmxvd1BhdGgpLnRvQmUoJy9hcHBzLzEyMycpXG5cbiAgICAgIC8vIFJBRyBwaXBlbGluZSBwYXRoIGNvbnN0cnVjdGlvblxuICAgICAgY29uc3QgcmFnUGlwZWxpbmVQYXRoID0gYC8ke2dldEZsb3dQcmVmaXgoRmxvd1R5cGUucmFnUGlwZWxpbmUpfS8ke2FwcElkfWBcbiAgICAgIGV4cGVjdChyYWdQaXBlbGluZVBhdGgpLnRvQmUoJy9yYWcvcGlwZWxpbmVzLzEyMycpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCB0aGUgZnVuY3Rpb24gY2FuIGJlIHVzZWQgaW4gY29uZGl0aW9uYWwgbG9naWNcbiAgICAgKiBDb21tb24gcGF0dGVybiBmb3IgZGV0ZXJtaW5pbmcgd2hpY2ggQVBJIGVuZHBvaW50IHRvIHVzZVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgc3VwcG9ydCBjb25kaXRpb25hbCBBUEkgcm91dGluZyBsb2dpYycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGVybWluZUVuZHBvaW50ID0gKGZsb3dUeXBlPzogRmxvd1R5cGUsIHJlc291cmNlSWQ/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gZ2V0Rmxvd1ByZWZpeChmbG93VHlwZSlcbiAgICAgICAgcmV0dXJuIGAvJHtwcmVmaXh9LyR7cmVzb3VyY2VJZCB8fCAnZGVmYXVsdCd9YFxuICAgICAgfVxuXG4gICAgICBleHBlY3QoZGV0ZXJtaW5lRW5kcG9pbnQoRmxvd1R5cGUuYXBwRmxvdywgJ2FwcC0xJykpLnRvQmUoJy9hcHBzL2FwcC0xJylcbiAgICAgIGV4cGVjdChkZXRlcm1pbmVFbmRwb2ludChGbG93VHlwZS5yYWdQaXBlbGluZSwgJ3BpcGVsaW5lLTEnKSkudG9CZSgnL3JhZy9waXBlbGluZXMvcGlwZWxpbmUtMScpXG4gICAgICBleHBlY3QoZGV0ZXJtaW5lRW5kcG9pbnQodW5kZWZpbmVkLCAnZmFsbGJhY2snKSkudG9CZSgnL2FwcHMvZmFsbGJhY2snKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGJlaGF2aW9yIHdpdGggZW1wdHkgc3RyaW5nIGZsb3cgdHlwZVxuICAgICAqIEVtcHR5IHN0cmluZ3Mgc2hvdWxkIGZhbGwgYmFjayB0byBkZWZhdWx0XG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIGFzIGZsb3cgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEZsb3dQcmVmaXgoJycgYXMgYW55KVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgnYXBwcycpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVHlwZSBzYWZldHknLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IGFsbCBGbG93VHlwZSBlbnVtIHZhbHVlcyBhcmUgaGFuZGxlZFxuICAgICAqIFRoaXMgZW5zdXJlcyB3ZSBkb24ndCBtaXNzIGFueSBmbG93IHR5cGVzIGluIHRoZSBtYXBwaW5nXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWxsIEZsb3dUeXBlIGVudW0gdmFsdWVzJywgKCkgPT4ge1xuICAgICAgLy8gR2V0IGFsbCBlbnVtIHZhbHVlc1xuICAgICAgY29uc3QgZmxvd1R5cGVzID0gT2JqZWN0LnZhbHVlcyhGbG93VHlwZSlcblxuICAgICAgLy8gRWFjaCBmbG93IHR5cGUgc2hvdWxkIHJldHVybiBhIHZhbGlkIHByZWZpeFxuICAgICAgZmxvd1R5cGVzLmZvckVhY2goKGZsb3dUeXBlKSA9PiB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGdldEZsb3dQcmVmaXgoZmxvd1R5cGUpXG4gICAgICAgIGV4cGVjdChwcmVmaXgpLnRvQmVUcnV0aHkoKVxuICAgICAgICBleHBlY3QodHlwZW9mIHByZWZpeCkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgZXhwZWN0KHByZWZpeC5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IHJldHVybmVkIHByZWZpeGVzIGFyZSB2YWxpZCBwYXRoIHNlZ21lbnRzXG4gICAgICogUHJlZml4ZXMgc2hvdWxkIG5vdCBjb250YWluIGxlYWRpbmcvdHJhaWxpbmcgc2xhc2hlcyBvciBpbnZhbGlkIGNoYXJhY3RlcnNcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHJldHVybiB2YWxpZCBwYXRoIHNlZ21lbnRzIHdpdGhvdXQgbGVhZGluZy90cmFpbGluZyBzbGFzaGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwRmxvd1ByZWZpeCA9IGdldEZsb3dQcmVmaXgoRmxvd1R5cGUuYXBwRmxvdylcbiAgICAgIGNvbnN0IHJhZ1BpcGVsaW5lUHJlZml4ID0gZ2V0Rmxvd1ByZWZpeChGbG93VHlwZS5yYWdQaXBlbGluZSlcblxuICAgICAgZXhwZWN0KGFwcEZsb3dQcmVmaXgpLm5vdC50b01hdGNoKC9eXFwvLylcbiAgICAgIGV4cGVjdChhcHBGbG93UHJlZml4KS5ub3QudG9NYXRjaCgvXFwvJC8pXG4gICAgICBleHBlY3QocmFnUGlwZWxpbmVQcmVmaXgpLm5vdC50b01hdGNoKC9eXFwvLylcbiAgICAgIGV4cGVjdChyYWdQaXBlbGluZVByZWZpeCkubm90LnRvTWF0Y2goL1xcLyQvKVxuICAgIH0pXG4gIH0pXG59KVxuIl19