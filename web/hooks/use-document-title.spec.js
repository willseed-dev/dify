"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const global_public_context_1 = require("@/context/global-public-context");
/**
 * Test suite for useDocumentTitle hook
 *
 * This hook manages the browser document title with support for:
 * - Custom branding (when enabled in system features)
 * - Default "Dify" branding
 * - Pending state handling (prevents title flicker during loading)
 * - Page-specific titles with automatic suffix
 *
 * Title format: "[Page Title] - [Brand Name]"
 * If no page title: "[Brand Name]"
 */
const feature_1 = require("@/types/feature");
const use_document_title_1 = require("./use-document-title");
vi.mock('@/context/global-public-context', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useIsSystemFeaturesPending: vi.fn(() => false),
    };
});
vi.mock('@/service/common', () => ({
    getSystemFeatures: vi.fn(() => ({ ...feature_1.defaultSystemFeatures })),
}));
/**
 * Test behavior when system features are still loading
 * Title should remain empty to prevent flicker
 */
describe('title should be empty if systemFeatures is pending', () => {
    beforeEach(() => {
        vi.mocked(global_public_context_1.useIsSystemFeaturesPending).mockReturnValue(true);
        (0, react_1.act)(() => {
            global_public_context_1.useGlobalPublicStore.setState({
                systemFeatures: { ...feature_1.defaultSystemFeatures, branding: { ...feature_1.defaultSystemFeatures.branding, enabled: false } },
            });
        });
    });
    /**
     * Test that title stays empty during loading even when a title is provided
     */
    it('document title should be empty if set title', () => {
        (0, react_1.renderHook)(() => (0, use_document_title_1.default)('test'));
        expect(document.title).toBe('');
    });
    /**
     * Test that title stays empty during loading when no title is provided
     */
    it('document title should be empty if not set title', () => {
        (0, react_1.renderHook)(() => (0, use_document_title_1.default)(''));
        expect(document.title).toBe('');
    });
});
/**
 * Test default Dify branding behavior
 * When custom branding is disabled, should use "Dify" as the brand name
 */
describe('use default branding', () => {
    beforeEach(() => {
        vi.mocked(global_public_context_1.useIsSystemFeaturesPending).mockReturnValue(false);
        (0, react_1.act)(() => {
            global_public_context_1.useGlobalPublicStore.setState({
                systemFeatures: { ...feature_1.defaultSystemFeatures, branding: { ...feature_1.defaultSystemFeatures.branding, enabled: false } },
            });
        });
    });
    /**
     * Test title format with page title and default branding
     * Format: "[page] - Dify"
     */
    it('document title should be test-Dify if set title', () => {
        (0, react_1.renderHook)(() => (0, use_document_title_1.default)('test'));
        expect(document.title).toBe('test - Dify');
    });
    /**
     * Test title with only default branding (no page title)
     * Format: "Dify"
     */
    it('document title should be Dify if not set title', () => {
        (0, react_1.renderHook)(() => (0, use_document_title_1.default)(''));
        expect(document.title).toBe('Dify');
    });
});
/**
 * Test custom branding behavior
 * When custom branding is enabled, should use the configured application_title
 */
describe('use specific branding', () => {
    beforeEach(() => {
        vi.mocked(global_public_context_1.useIsSystemFeaturesPending).mockReturnValue(false);
        (0, react_1.act)(() => {
            global_public_context_1.useGlobalPublicStore.setState({
                systemFeatures: { ...feature_1.defaultSystemFeatures, branding: { ...feature_1.defaultSystemFeatures.branding, enabled: true, application_title: 'Test' } },
            });
        });
    });
    /**
     * Test title format with page title and custom branding
     * Format: "[page] - [Custom Brand]"
     */
    it('document title should be test-Test if set title', () => {
        (0, react_1.renderHook)(() => (0, use_document_title_1.default)('test'));
        expect(document.title).toBe('test - Test');
    });
    /**
     * Test title with only custom branding (no page title)
     * Format: "[Custom Brand]"
     */
    it('document title should be Test if not set title', () => {
        (0, react_1.renderHook)(() => (0, use_document_title_1.default)(''));
        expect(document.title).toBe('Test');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWRvY3VtZW50LXRpdGxlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtZG9jdW1lbnQtdGl0bGUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUF3RDtBQUN4RCwyRUFBa0c7QUFDbEc7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCw2Q0FBdUQ7QUFDdkQsNkRBQW1EO0FBRW5ELEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxFQUFFO0lBQ2xFLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxFQUFvRCxDQUFBO0lBQ3ZGLE9BQU87UUFDTCxHQUFHLE1BQU07UUFDVCwwQkFBMEIsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUMvQyxDQUFBO0FBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFRixFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRywrQkFBcUIsRUFBRSxDQUFDLENBQUM7Q0FDL0QsQ0FBQyxDQUFDLENBQUE7QUFFSDs7O0dBR0c7QUFDSCxRQUFRLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO0lBQ2xFLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsTUFBTSxDQUFDLGtEQUEwQixDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNELElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtZQUNQLDRDQUFvQixDQUFDLFFBQVEsQ0FBQztnQkFDNUIsY0FBYyxFQUFFLEVBQUUsR0FBRywrQkFBcUIsRUFBRSxRQUFRLEVBQUUsRUFBRSxHQUFHLCtCQUFxQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7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QUE7UUFDMUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDNUMsQ0FBQyxDQUFDLENBQUE7SUFFRjs7O09BR0c7SUFDSCxFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1FBQ3hELElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLDRCQUFnQixFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDckMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFjdCwgcmVuZGVySG9vayB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyB1c2VHbG9iYWxQdWJsaWNTdG9yZSwgdXNlSXNTeXN0ZW1GZWF0dXJlc1BlbmRpbmcgfSBmcm9tICdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0J1xuLyoqXG4gKiBUZXN0IHN1aXRlIGZvciB1c2VEb2N1bWVudFRpdGxlIGhvb2tcbiAqXG4gKiBUaGlzIGhvb2sgbWFuYWdlcyB0aGUgYnJvd3NlciBkb2N1bWVudCB0aXRsZSB3aXRoIHN1cHBvcnQgZm9yOlxuICogLSBDdXN0b20gYnJhbmRpbmcgKHdoZW4gZW5hYmxlZCBpbiBzeXN0ZW0gZmVhdHVyZXMpXG4gKiAtIERlZmF1bHQgXCJEaWZ5XCIgYnJhbmRpbmdcbiAqIC0gUGVuZGluZyBzdGF0ZSBoYW5kbGluZyAocHJldmVudHMgdGl0bGUgZmxpY2tlciBkdXJpbmcgbG9hZGluZylcbiAqIC0gUGFnZS1zcGVjaWZpYyB0aXRsZXMgd2l0aCBhdXRvbWF0aWMgc3VmZml4XG4gKlxuICogVGl0bGUgZm9ybWF0OiBcIltQYWdlIFRpdGxlXSAtIFtCcmFuZCBOYW1lXVwiXG4gKiBJZiBubyBwYWdlIHRpdGxlOiBcIltCcmFuZCBOYW1lXVwiXG4gKi9cbmltcG9ydCB7IGRlZmF1bHRTeXN0ZW1GZWF0dXJlcyB9IGZyb20gJ0AvdHlwZXMvZmVhdHVyZSdcbmltcG9ydCB1c2VEb2N1bWVudFRpdGxlIGZyb20gJy4vdXNlLWRvY3VtZW50LXRpdGxlJ1xuXG52aS5tb2NrKCdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0JywgYXN5bmMgKGltcG9ydE9yaWdpbmFsKSA9PiB7XG4gIGNvbnN0IGFjdHVhbCA9IGF3YWl0IGltcG9ydE9yaWdpbmFsPHR5cGVvZiBpbXBvcnQoJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnKT4oKVxuICByZXR1cm4ge1xuICAgIC4uLmFjdHVhbCxcbiAgICB1c2VJc1N5c3RlbUZlYXR1cmVzUGVuZGluZzogdmkuZm4oKCkgPT4gZmFsc2UpLFxuICB9XG59KVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvY29tbW9uJywgKCkgPT4gKHtcbiAgZ2V0U3lzdGVtRmVhdHVyZXM6IHZpLmZuKCgpID0+ICh7IC4uLmRlZmF1bHRTeXN0ZW1GZWF0dXJlcyB9KSksXG59KSlcblxuLyoqXG4gKiBUZXN0IGJlaGF2aW9yIHdoZW4gc3lzdGVtIGZlYXR1cmVzIGFyZSBzdGlsbCBsb2FkaW5nXG4gKiBUaXRsZSBzaG91bGQgcmVtYWluIGVtcHR5IHRvIHByZXZlbnQgZmxpY2tlclxuICovXG5kZXNjcmliZSgndGl0bGUgc2hvdWxkIGJlIGVtcHR5IGlmIHN5c3RlbUZlYXR1cmVzIGlzIHBlbmRpbmcnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLm1vY2tlZCh1c2VJc1N5c3RlbUZlYXR1cmVzUGVuZGluZykubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgYWN0KCgpID0+IHtcbiAgICAgIHVzZUdsb2JhbFB1YmxpY1N0b3JlLnNldFN0YXRlKHtcbiAgICAgICAgc3lzdGVtRmVhdHVyZXM6IHsgLi4uZGVmYXVsdFN5c3RlbUZlYXR1cmVzLCBicmFuZGluZzogeyAuLi5kZWZhdWx0U3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcsIGVuYWJsZWQ6IGZhbHNlIH0gfSxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbiAgLyoqXG4gICAqIFRlc3QgdGhhdCB0aXRsZSBzdGF5cyBlbXB0eSBkdXJpbmcgbG9hZGluZyBldmVuIHdoZW4gYSB0aXRsZSBpcyBwcm92aWRlZFxuICAgKi9cbiAgaXQoJ2RvY3VtZW50IHRpdGxlIHNob3VsZCBiZSBlbXB0eSBpZiBzZXQgdGl0bGUnLCAoKSA9PiB7XG4gICAgcmVuZGVySG9vaygoKSA9PiB1c2VEb2N1bWVudFRpdGxlKCd0ZXN0JykpXG4gICAgZXhwZWN0KGRvY3VtZW50LnRpdGxlKS50b0JlKCcnKVxuICB9KVxuICAvKipcbiAgICogVGVzdCB0aGF0IHRpdGxlIHN0YXlzIGVtcHR5IGR1cmluZyBsb2FkaW5nIHdoZW4gbm8gdGl0bGUgaXMgcHJvdmlkZWRcbiAgICovXG4gIGl0KCdkb2N1bWVudCB0aXRsZSBzaG91bGQgYmUgZW1wdHkgaWYgbm90IHNldCB0aXRsZScsICgpID0+IHtcbiAgICByZW5kZXJIb29rKCgpID0+IHVzZURvY3VtZW50VGl0bGUoJycpKVxuICAgIGV4cGVjdChkb2N1bWVudC50aXRsZSkudG9CZSgnJylcbiAgfSlcbn0pXG5cbi8qKlxuICogVGVzdCBkZWZhdWx0IERpZnkgYnJhbmRpbmcgYmVoYXZpb3JcbiAqIFdoZW4gY3VzdG9tIGJyYW5kaW5nIGlzIGRpc2FibGVkLCBzaG91bGQgdXNlIFwiRGlmeVwiIGFzIHRoZSBicmFuZCBuYW1lXG4gKi9cbmRlc2NyaWJlKCd1c2UgZGVmYXVsdCBicmFuZGluZycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkubW9ja2VkKHVzZUlzU3lzdGVtRmVhdHVyZXNQZW5kaW5nKS5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gICAgYWN0KCgpID0+IHtcbiAgICAgIHVzZUdsb2JhbFB1YmxpY1N0b3JlLnNldFN0YXRlKHtcbiAgICAgICAgc3lzdGVtRmVhdHVyZXM6IHsgLi4uZGVmYXVsdFN5c3RlbUZlYXR1cmVzLCBicmFuZGluZzogeyAuLi5kZWZhdWx0U3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcsIGVuYWJsZWQ6IGZhbHNlIH0gfSxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbiAgLyoqXG4gICAqIFRlc3QgdGl0bGUgZm9ybWF0IHdpdGggcGFnZSB0aXRsZSBhbmQgZGVmYXVsdCBicmFuZGluZ1xuICAgKiBGb3JtYXQ6IFwiW3BhZ2VdIC0gRGlmeVwiXG4gICAqL1xuICBpdCgnZG9jdW1lbnQgdGl0bGUgc2hvdWxkIGJlIHRlc3QtRGlmeSBpZiBzZXQgdGl0bGUnLCAoKSA9PiB7XG4gICAgcmVuZGVySG9vaygoKSA9PiB1c2VEb2N1bWVudFRpdGxlKCd0ZXN0JykpXG4gICAgZXhwZWN0KGRvY3VtZW50LnRpdGxlKS50b0JlKCd0ZXN0IC0gRGlmeScpXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3QgdGl0bGUgd2l0aCBvbmx5IGRlZmF1bHQgYnJhbmRpbmcgKG5vIHBhZ2UgdGl0bGUpXG4gICAqIEZvcm1hdDogXCJEaWZ5XCJcbiAgICovXG4gIGl0KCdkb2N1bWVudCB0aXRsZSBzaG91bGQgYmUgRGlmeSBpZiBub3Qgc2V0IHRpdGxlJywgKCkgPT4ge1xuICAgIHJlbmRlckhvb2soKCkgPT4gdXNlRG9jdW1lbnRUaXRsZSgnJykpXG4gICAgZXhwZWN0KGRvY3VtZW50LnRpdGxlKS50b0JlKCdEaWZ5JylcbiAgfSlcbn0pXG5cbi8qKlxuICogVGVzdCBjdXN0b20gYnJhbmRpbmcgYmVoYXZpb3JcbiAqIFdoZW4gY3VzdG9tIGJyYW5kaW5nIGlzIGVuYWJsZWQsIHNob3VsZCB1c2UgdGhlIGNvbmZpZ3VyZWQgYXBwbGljYXRpb25fdGl0bGVcbiAqL1xuZGVzY3JpYmUoJ3VzZSBzcGVjaWZpYyBicmFuZGluZycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkubW9ja2VkKHVzZUlzU3lzdGVtRmVhdHVyZXNQZW5kaW5nKS5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gICAgYWN0KCgpID0+IHtcbiAgICAgIHVzZUdsb2JhbFB1YmxpY1N0b3JlLnNldFN0YXRlKHtcbiAgICAgICAgc3lzdGVtRmVhdHVyZXM6IHsgLi4uZGVmYXVsdFN5c3RlbUZlYXR1cmVzLCBicmFuZGluZzogeyAuLi5kZWZhdWx0U3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcsIGVuYWJsZWQ6IHRydWUsIGFwcGxpY2F0aW9uX3RpdGxlOiAnVGVzdCcgfSB9LFxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuICAvKipcbiAgICogVGVzdCB0aXRsZSBmb3JtYXQgd2l0aCBwYWdlIHRpdGxlIGFuZCBjdXN0b20gYnJhbmRpbmdcbiAgICogRm9ybWF0OiBcIltwYWdlXSAtIFtDdXN0b20gQnJhbmRdXCJcbiAgICovXG4gIGl0KCdkb2N1bWVudCB0aXRsZSBzaG91bGQgYmUgdGVzdC1UZXN0IGlmIHNldCB0aXRsZScsICgpID0+IHtcbiAgICByZW5kZXJIb29rKCgpID0+IHVzZURvY3VtZW50VGl0bGUoJ3Rlc3QnKSlcbiAgICBleHBlY3QoZG9jdW1lbnQudGl0bGUpLnRvQmUoJ3Rlc3QgLSBUZXN0JylcbiAgfSlcblxuICAvKipcbiAgICogVGVzdCB0aXRsZSB3aXRoIG9ubHkgY3VzdG9tIGJyYW5kaW5nIChubyBwYWdlIHRpdGxlKVxuICAgKiBGb3JtYXQ6IFwiW0N1c3RvbSBCcmFuZF1cIlxuICAgKi9cbiAgaXQoJ2RvY3VtZW50IHRpdGxlIHNob3VsZCBiZSBUZXN0IGlmIG5vdCBzZXQgdGl0bGUnLCAoKSA9PiB7XG4gICAgcmVuZGVySG9vaygoKSA9PiB1c2VEb2N1bWVudFRpdGxlKCcnKSlcbiAgICBleHBlY3QoZG9jdW1lbnQudGl0bGUpLnRvQmUoJ1Rlc3QnKVxuICB9KVxufSlcbiJdfQ==