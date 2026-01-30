"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const datasets_1 = require("@/service/datasets");
const index_1 = require("./index");
// Mock next/navigation
const mockRouterBack = vi.fn();
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        back: mockRouterBack,
        replace: mockReplace,
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));
// Mock useDocLink hook
vi.mock('@/context/i18n', () => ({
    useDocLink: () => (path) => `https://docs.dify.ai/en${path || ''}`,
}));
// Mock toast context
const mockNotify = vi.fn();
vi.mock('@/app/components/base/toast', () => ({
    useToastContext: () => ({
        notify: mockNotify,
    }),
}));
// Mock modal context
vi.mock('@/context/modal-context', () => ({
    useModalContext: () => ({
        setShowExternalKnowledgeAPIModal: vi.fn(),
    }),
}));
// Mock API service
vi.mock('@/service/datasets', () => ({
    createExternalKnowledgeBase: vi.fn(),
}));
// Factory function to create mock ExternalAPIItem
const createMockExternalAPIItem = (overrides = {}) => ({
    id: 'api-default',
    tenant_id: 'tenant-1',
    name: 'Default API',
    description: 'Default API description',
    settings: {
        endpoint: 'https://api.example.com',
        api_key: 'test-api-key',
    },
    dataset_bindings: [],
    created_by: 'user-1',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
});
// Default mock API list
const createDefaultMockApiList = () => [
    createMockExternalAPIItem({
        id: 'api-1',
        name: 'Test API 1',
        settings: { endpoint: 'https://api1.example.com', api_key: 'key-1' },
    }),
    createMockExternalAPIItem({
        id: 'api-2',
        name: 'Test API 2',
        settings: { endpoint: 'https://api2.example.com', api_key: 'key-2' },
    }),
];
let mockExternalKnowledgeApiList = createDefaultMockApiList();
vi.mock('@/context/external-knowledge-api-context', () => ({
    useExternalKnowledgeApi: () => ({
        externalKnowledgeApiList: mockExternalKnowledgeApiList,
        mutateExternalKnowledgeApis: vi.fn(),
        isLoading: false,
    }),
}));
// Suppress console.error helper
const suppressConsoleError = () => vi.spyOn(console, 'error').mockImplementation(vi.fn());
// Helper to create a pending promise with external resolver
function createPendingPromise() {
    let resolve = vi.fn();
    const promise = new Promise((r) => {
        resolve = r;
    });
    return { promise, resolve };
}
// Helper to fill required form fields and submit
async function fillFormAndSubmit(user) {
    const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
    const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
    react_1.fireEvent.change(nameInput, { target: { value: 'Test Knowledge Base' } });
    react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'kb-123' } });
    // Wait for button to be enabled
    await (0, react_1.waitFor)(() => {
        const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
        expect(connectButton).not.toBeDisabled();
    });
    const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
    await user.click(connectButton);
}
describe('ExternalKnowledgeBaseConnector', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockExternalKnowledgeApiList = createDefaultMockApiList();
        datasets_1.createExternalKnowledgeBase.mockResolvedValue({ id: 'new-kb-id' });
    });
    // Tests for rendering with real ExternalKnowledgeBaseCreate component
    describe('Rendering', () => {
        it('should render the create form with all required elements', () => {
            (0, react_1.render)(<index_1.default />);
            // Verify main title and form elements
            expect(react_1.screen.getByText('dataset.connectDataset')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.externalKnowledgeName')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.externalKnowledgeId')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.retrievalSettings')).toBeInTheDocument();
            // Verify buttons
            expect(react_1.screen.getByText('dataset.externalKnowledgeForm.cancel')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.externalKnowledgeForm.connect')).toBeInTheDocument();
        });
        it('should render connect button disabled initially', () => {
            (0, react_1.render)(<index_1.default />);
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeDisabled();
        });
    });
    // Tests for API success flow
    describe('API Success Flow', () => {
        it('should call API and show success notification when form is submitted', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<index_1.default />);
            await fillFormAndSubmit(user);
            // Verify API was called with form data
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createExternalKnowledgeBase).toHaveBeenCalledWith({
                    body: expect.objectContaining({
                        name: 'Test Knowledge Base',
                        external_knowledge_id: 'kb-123',
                        external_knowledge_api_id: 'api-1',
                        provider: 'external',
                    }),
                });
            });
            // Verify success notification
            expect(mockNotify).toHaveBeenCalledWith({
                type: 'success',
                message: 'External Knowledge Base Connected Successfully',
            });
            // Verify navigation back
            expect(mockRouterBack).toHaveBeenCalledTimes(1);
        });
        it('should include retrieval settings in API call', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<index_1.default />);
            await fillFormAndSubmit(user);
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createExternalKnowledgeBase).toHaveBeenCalledWith({
                    body: expect.objectContaining({
                        external_retrieval_model: expect.objectContaining({
                            top_k: 4,
                            score_threshold: 0.5,
                            score_threshold_enabled: false,
                        }),
                    }),
                });
            });
        });
    });
    // Tests for API error flow
    describe('API Error Flow', () => {
        it('should show error notification when API fails', async () => {
            const user = user_event_1.default.setup();
            const consoleErrorSpy = suppressConsoleError();
            datasets_1.createExternalKnowledgeBase.mockRejectedValue(new Error('Network Error'));
            (0, react_1.render)(<index_1.default />);
            await fillFormAndSubmit(user);
            // Verify error notification
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'Failed to connect External Knowledge Base',
                });
            });
            // Verify no navigation
            expect(mockRouterBack).not.toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });
        it('should show error notification when API returns invalid result', async () => {
            const user = user_event_1.default.setup();
            const consoleErrorSpy = suppressConsoleError();
            datasets_1.createExternalKnowledgeBase.mockResolvedValue({});
            (0, react_1.render)(<index_1.default />);
            await fillFormAndSubmit(user);
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'Failed to connect External Knowledge Base',
                });
            });
            expect(mockRouterBack).not.toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });
    });
    // Tests for loading state
    describe('Loading State', () => {
        it('should show loading state during API call', async () => {
            const user = user_event_1.default.setup();
            // Create a promise that won't resolve immediately
            const { promise, resolve: resolvePromise } = createPendingPromise();
            datasets_1.createExternalKnowledgeBase.mockReturnValue(promise);
            (0, react_1.render)(<index_1.default />);
            // Fill form
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'kb-1' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            // Click connect
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            // Button should show loading (the real Button component has loading prop)
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createExternalKnowledgeBase).toHaveBeenCalled();
            });
            // Resolve the promise
            resolvePromise({ id: 'new-id' });
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'success',
                    message: 'External Knowledge Base Connected Successfully',
                });
            });
        });
    });
    // Tests for form validation (integration with real create component)
    describe('Form Validation', () => {
        it('should keep button disabled when only name is filled', () => {
            (0, react_1.render)(<index_1.default />);
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeDisabled();
        });
        it('should keep button disabled when only knowledge id is filled', () => {
            (0, react_1.render)(<index_1.default />);
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'kb-1' } });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeDisabled();
        });
        it('should enable button when all required fields are filled', async () => {
            (0, react_1.render)(<index_1.default />);
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'kb-1' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
        });
    });
    // Tests for user interactions
    describe('User Interactions', () => {
        it('should allow typing in form fields', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<index_1.default />);
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const descriptionInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeDescriptionPlaceholder');
            await user.type(nameInput, 'My Knowledge Base');
            await user.type(descriptionInput, 'My Description');
            expect(nameInput.value).toBe('My Knowledge Base');
            expect(descriptionInput.value).toBe('My Description');
        });
        it('should handle cancel button click', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<index_1.default />);
            const cancelButton = react_1.screen.getByText('dataset.externalKnowledgeForm.cancel').closest('button');
            await user.click(cancelButton);
            expect(mockReplace).toHaveBeenCalledWith('/datasets');
        });
        it('should handle back button click', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<index_1.default />);
            const buttons = react_1.screen.getAllByRole('button');
            const backButton = buttons.find(btn => btn.classList.contains('rounded-full'));
            await user.click(backButton);
            expect(mockReplace).toHaveBeenCalledWith('/datasets');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLDREQUFtRDtBQUNuRCxpREFBZ0U7QUFDaEUsbUNBQW9EO0FBRXBELHVCQUF1QjtBQUN2QixNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDOUIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzNCLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNoQixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsV0FBVztRQUNwQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ2pCLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILHVCQUF1QjtBQUN2QixFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBYSxFQUFFLEVBQUUsQ0FBQywwQkFBMEIsSUFBSSxJQUFJLEVBQUUsRUFBRTtDQUM1RSxDQUFDLENBQUMsQ0FBQTtBQUVILHFCQUFxQjtBQUNyQixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUIsRUFBRSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxVQUFVO0tBQ25CLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILHFCQUFxQjtBQUNyQixFQUFF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LENBQUMsQ0FBQTtZQUM5RSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVyxDQUFDLENBQUE7WUFFN0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ3ZELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9jayB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB0eXBlIHsgRXh0ZXJuYWxBUElJdGVtIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB1c2VyRXZlbnQgZnJvbSAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50J1xuaW1wb3J0IHsgY3JlYXRlRXh0ZXJuYWxLbm93bGVkZ2VCYXNlIH0gZnJvbSAnQC9zZXJ2aWNlL2RhdGFzZXRzJ1xuaW1wb3J0IEV4dGVybmFsS25vd2xlZGdlQmFzZUNvbm5lY3RvciBmcm9tICcuL2luZGV4J1xuXG4vLyBNb2NrIG5leHQvbmF2aWdhdGlvblxuY29uc3QgbW9ja1JvdXRlckJhY2sgPSB2aS5mbigpXG5jb25zdCBtb2NrUmVwbGFjZSA9IHZpLmZuKClcbnZpLm1vY2soJ25leHQvbmF2aWdhdGlvbicsICgpID0+ICh7XG4gIHVzZVJvdXRlcjogKCkgPT4gKHtcbiAgICBiYWNrOiBtb2NrUm91dGVyQmFjayxcbiAgICByZXBsYWNlOiBtb2NrUmVwbGFjZSxcbiAgICBwdXNoOiB2aS5mbigpLFxuICAgIHJlZnJlc2g6IHZpLmZuKCksXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgdXNlRG9jTGluayBob29rXG52aS5tb2NrKCdAL2NvbnRleHQvaTE4bicsICgpID0+ICh7XG4gIHVzZURvY0xpbms6ICgpID0+IChwYXRoPzogc3RyaW5nKSA9PiBgaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4ke3BhdGggfHwgJyd9YCxcbn0pKVxuXG4vLyBNb2NrIHRvYXN0IGNvbnRleHRcbmNvbnN0IG1vY2tOb3RpZnkgPSB2aS5mbigpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICB1c2VUb2FzdENvbnRleHQ6ICgpID0+ICh7XG4gICAgbm90aWZ5OiBtb2NrTm90aWZ5LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIG1vZGFsIGNvbnRleHRcbnZpLm1vY2soJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlTW9kYWxDb250ZXh0OiAoKSA9PiAoe1xuICAgIHNldFNob3dFeHRlcm5hbEtub3dsZWRnZUFQSU1vZGFsOiB2aS5mbigpLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIEFQSSBzZXJ2aWNlXG52aS5tb2NrKCdAL3NlcnZpY2UvZGF0YXNldHMnLCAoKSA9PiAoe1xuICBjcmVhdGVFeHRlcm5hbEtub3dsZWRnZUJhc2U6IHZpLmZuKCksXG59KSlcblxuLy8gRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgbW9jayBFeHRlcm5hbEFQSUl0ZW1cbmNvbnN0IGNyZWF0ZU1vY2tFeHRlcm5hbEFQSUl0ZW0gPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPEV4dGVybmFsQVBJSXRlbT4gPSB7fSk6IEV4dGVybmFsQVBJSXRlbSA9PiAoe1xuICBpZDogJ2FwaS1kZWZhdWx0JyxcbiAgdGVuYW50X2lkOiAndGVuYW50LTEnLFxuICBuYW1lOiAnRGVmYXVsdCBBUEknLFxuICBkZXNjcmlwdGlvbjogJ0RlZmF1bHQgQVBJIGRlc2NyaXB0aW9uJyxcbiAgc2V0dGluZ3M6IHtcbiAgICBlbmRwb2ludDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tJyxcbiAgICBhcGlfa2V5OiAndGVzdC1hcGkta2V5JyxcbiAgfSxcbiAgZGF0YXNldF9iaW5kaW5nczogW10sXG4gIGNyZWF0ZWRfYnk6ICd1c2VyLTEnLFxuICBjcmVhdGVkX2F0OiAnMjAyNC0wMS0wMVQwMDowMDowMFonLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBEZWZhdWx0IG1vY2sgQVBJIGxpc3RcbmNvbnN0IGNyZWF0ZURlZmF1bHRNb2NrQXBpTGlzdCA9ICgpOiBFeHRlcm5hbEFQSUl0ZW1bXSA9PiBbXG4gIGNyZWF0ZU1vY2tFeHRlcm5hbEFQSUl0ZW0oe1xuICAgIGlkOiAnYXBpLTEnLFxuICAgIG5hbWU6ICdUZXN0IEFQSSAxJyxcbiAgICBzZXR0aW5nczogeyBlbmRwb2ludDogJ2h0dHBzOi8vYXBpMS5leGFtcGxlLmNvbScsIGFwaV9rZXk6ICdrZXktMScgfSxcbiAgfSksXG4gIGNyZWF0ZU1vY2tFeHRlcm5hbEFQSUl0ZW0oe1xuICAgIGlkOiAnYXBpLTInLFxuICAgIG5hbWU6ICdUZXN0IEFQSSAyJyxcbiAgICBzZXR0aW5nczogeyBlbmRwb2ludDogJ2h0dHBzOi8vYXBpMi5leGFtcGxlLmNvbScsIGFwaV9rZXk6ICdrZXktMicgfSxcbiAgfSksXG5dXG5cbmxldCBtb2NrRXh0ZXJuYWxLbm93bGVkZ2VBcGlMaXN0OiBFeHRlcm5hbEFQSUl0ZW1bXSA9IGNyZWF0ZURlZmF1bHRNb2NrQXBpTGlzdCgpXG5cbnZpLm1vY2soJ0AvY29udGV4dC9leHRlcm5hbC1rbm93bGVkZ2UtYXBpLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VFeHRlcm5hbEtub3dsZWRnZUFwaTogKCkgPT4gKHtcbiAgICBleHRlcm5hbEtub3dsZWRnZUFwaUxpc3Q6IG1vY2tFeHRlcm5hbEtub3dsZWRnZUFwaUxpc3QsXG4gICAgbXV0YXRlRXh0ZXJuYWxLbm93bGVkZ2VBcGlzOiB2aS5mbigpLFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gIH0pLFxufSkpXG5cbi8vIFN1cHByZXNzIGNvbnNvbGUuZXJyb3IgaGVscGVyXG5jb25zdCBzdXBwcmVzc0NvbnNvbGVFcnJvciA9ICgpID0+IHZpLnNweU9uKGNvbnNvbGUsICdlcnJvcicpLm1vY2tJbXBsZW1lbnRhdGlvbih2aS5mbigpKVxuXG4vLyBIZWxwZXIgdG8gY3JlYXRlIGEgcGVuZGluZyBwcm9taXNlIHdpdGggZXh0ZXJuYWwgcmVzb2x2ZXJcbmZ1bmN0aW9uIGNyZWF0ZVBlbmRpbmdQcm9taXNlPFQ+KCkge1xuICBsZXQgcmVzb2x2ZTogKHZhbHVlOiBUKSA9PiB2b2lkID0gdmkuZm4oKVxuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2U8VD4oKHIpID0+IHtcbiAgICByZXNvbHZlID0gclxuICB9KVxuICByZXR1cm4geyBwcm9taXNlLCByZXNvbHZlIH1cbn1cblxuLy8gSGVscGVyIHRvIGZpbGwgcmVxdWlyZWQgZm9ybSBmaWVsZHMgYW5kIHN1Ym1pdFxuYXN5bmMgZnVuY3Rpb24gZmlsbEZvcm1BbmRTdWJtaXQodXNlcjogUmV0dXJuVHlwZTx0eXBlb2YgdXNlckV2ZW50LnNldHVwPikge1xuICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICBjb25zdCBrbm93bGVkZ2VJZElucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlSWRQbGFjZWhvbGRlcicpXG5cbiAgZmlyZUV2ZW50LmNoYW5nZShuYW1lSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCBLbm93bGVkZ2UgQmFzZScgfSB9KVxuICBmaXJlRXZlbnQuY2hhbmdlKGtub3dsZWRnZUlkSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAna2ItMTIzJyB9IH0pXG5cbiAgLy8gV2FpdCBmb3IgYnV0dG9uIHRvIGJlIGVuYWJsZWRcbiAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgIGV4cGVjdChjb25uZWN0QnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgfSlcblxuICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gIGF3YWl0IHVzZXIuY2xpY2soY29ubmVjdEJ1dHRvbiEpXG59XG5cbmRlc2NyaWJlKCdFeHRlcm5hbEtub3dsZWRnZUJhc2VDb25uZWN0b3InLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tFeHRlcm5hbEtub3dsZWRnZUFwaUxpc3QgPSBjcmVhdGVEZWZhdWx0TW9ja0FwaUxpc3QoKVxuICAgIDsoY3JlYXRlRXh0ZXJuYWxLbm93bGVkZ2VCYXNlIGFzIE1vY2spLm1vY2tSZXNvbHZlZFZhbHVlKHsgaWQ6ICduZXcta2ItaWQnIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHJlbmRlcmluZyB3aXRoIHJlYWwgRXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ3JlYXRlIGNvbXBvbmVudFxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBjcmVhdGUgZm9ybSB3aXRoIGFsbCByZXF1aXJlZCBlbGVtZW50cycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ29ubmVjdG9yIC8+KVxuXG4gICAgICAvLyBWZXJpZnkgbWFpbiB0aXRsZSBhbmQgZm9ybSBlbGVtZW50c1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuY29ubmVjdERhdGFzZXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlSWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsU2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBWZXJpZnkgYnV0dG9uc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNhbmNlbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbm5lY3QgYnV0dG9uIGRpc2FibGVkIGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ29ubmVjdG9yIC8+KVxuXG4gICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBBUEkgc3VjY2VzcyBmbG93XG4gIGRlc2NyaWJlKCdBUEkgU3VjY2VzcyBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBBUEkgYW5kIHNob3cgc3VjY2VzcyBub3RpZmljYXRpb24gd2hlbiBmb3JtIGlzIHN1Ym1pdHRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyKDxFeHRlcm5hbEtub3dsZWRnZUJhc2VDb25uZWN0b3IgLz4pXG5cbiAgICAgIGF3YWl0IGZpbGxGb3JtQW5kU3VibWl0KHVzZXIpXG5cbiAgICAgIC8vIFZlcmlmeSBBUEkgd2FzIGNhbGxlZCB3aXRoIGZvcm0gZGF0YVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjcmVhdGVFeHRlcm5hbEtub3dsZWRnZUJhc2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBib2R5OiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBuYW1lOiAnVGVzdCBLbm93bGVkZ2UgQmFzZScsXG4gICAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfaWQ6ICdrYi0xMjMnLFxuICAgICAgICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9pZDogJ2FwaS0xJyxcbiAgICAgICAgICAgIHByb3ZpZGVyOiAnZXh0ZXJuYWwnLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8gVmVyaWZ5IHN1Y2Nlc3Mgbm90aWZpY2F0aW9uXG4gICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6ICdFeHRlcm5hbCBLbm93bGVkZ2UgQmFzZSBDb25uZWN0ZWQgU3VjY2Vzc2Z1bGx5JyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFZlcmlmeSBuYXZpZ2F0aW9uIGJhY2tcbiAgICAgIGV4cGVjdChtb2NrUm91dGVyQmFjaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSByZXRyaWV2YWwgc2V0dGluZ3MgaW4gQVBJIGNhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlcig8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ29ubmVjdG9yIC8+KVxuXG4gICAgICBhd2FpdCBmaWxsRm9ybUFuZFN1Ym1pdCh1c2VyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNyZWF0ZUV4dGVybmFsS25vd2xlZGdlQmFzZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIGJvZHk6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGV4dGVybmFsX3JldHJpZXZhbF9tb2RlbDogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICB0b3BfazogNCxcbiAgICAgICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICAgICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBBUEkgZXJyb3IgZmxvd1xuICBkZXNjcmliZSgnQVBJIEVycm9yIEZsb3cnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIG5vdGlmaWNhdGlvbiB3aGVuIEFQSSBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgY29uc29sZUVycm9yU3B5ID0gc3VwcHJlc3NDb25zb2xlRXJyb3IoKVxuICAgICAgOyhjcmVhdGVFeHRlcm5hbEtub3dsZWRnZUJhc2UgYXMgTW9jaykubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdOZXR3b3JrIEVycm9yJykpXG5cbiAgICAgIHJlbmRlcig8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ29ubmVjdG9yIC8+KVxuXG4gICAgICBhd2FpdCBmaWxsRm9ybUFuZFN1Ym1pdCh1c2VyKVxuXG4gICAgICAvLyBWZXJpZnkgZXJyb3Igbm90aWZpY2F0aW9uXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdGYWlsZWQgdG8gY29ubmVjdCBFeHRlcm5hbCBLbm93bGVkZ2UgQmFzZScsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBWZXJpZnkgbm8gbmF2aWdhdGlvblxuICAgICAgZXhwZWN0KG1vY2tSb3V0ZXJCYWNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGNvbnNvbGVFcnJvclNweS5tb2NrUmVzdG9yZSgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBub3RpZmljYXRpb24gd2hlbiBBUEkgcmV0dXJucyBpbnZhbGlkIHJlc3VsdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgY29uc29sZUVycm9yU3B5ID0gc3VwcHJlc3NDb25zb2xlRXJyb3IoKVxuICAgICAgOyhjcmVhdGVFeHRlcm5hbEtub3dsZWRnZUJhc2UgYXMgTW9jaykubW9ja1Jlc29sdmVkVmFsdWUoe30pXG5cbiAgICAgIHJlbmRlcig8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ29ubmVjdG9yIC8+KVxuXG4gICAgICBhd2FpdCBmaWxsRm9ybUFuZFN1Ym1pdCh1c2VyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdGYWlsZWQgdG8gY29ubmVjdCBFeHRlcm5hbCBLbm93bGVkZ2UgQmFzZScsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja1JvdXRlckJhY2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgY29uc29sZUVycm9yU3B5Lm1vY2tSZXN0b3JlKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBsb2FkaW5nIHN0YXRlXG4gIGRlc2NyaWJlKCdMb2FkaW5nIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBsb2FkaW5nIHN0YXRlIGR1cmluZyBBUEkgY2FsbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBDcmVhdGUgYSBwcm9taXNlIHRoYXQgd29uJ3QgcmVzb2x2ZSBpbW1lZGlhdGVseVxuICAgICAgY29uc3QgeyBwcm9taXNlLCByZXNvbHZlOiByZXNvbHZlUHJvbWlzZSB9ID0gY3JlYXRlUGVuZGluZ1Byb21pc2U8eyBpZDogc3RyaW5nIH0+KClcbiAgICAgIDsoY3JlYXRlRXh0ZXJuYWxLbm93bGVkZ2VCYXNlIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZShwcm9taXNlKVxuXG4gICAgICByZW5kZXIoPEV4dGVybmFsS25vd2xlZGdlQmFzZUNvbm5lY3RvciAvPilcblxuICAgICAgLy8gRmlsbCBmb3JtXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShuYW1lSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShrbm93bGVkZ2VJZElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2tiLTEnIH0gfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2xpY2sgY29ubmVjdFxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjb25uZWN0QnV0dG9uISlcblxuICAgICAgLy8gQnV0dG9uIHNob3VsZCBzaG93IGxvYWRpbmcgKHRoZSByZWFsIEJ1dHRvbiBjb21wb25lbnQgaGFzIGxvYWRpbmcgcHJvcClcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY3JlYXRlRXh0ZXJuYWxLbm93bGVkZ2VCYXNlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlc29sdmUgdGhlIHByb21pc2VcbiAgICAgIHJlc29sdmVQcm9taXNlKHsgaWQ6ICduZXctaWQnIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICBtZXNzYWdlOiAnRXh0ZXJuYWwgS25vd2xlZGdlIEJhc2UgQ29ubmVjdGVkIFN1Y2Nlc3NmdWxseScsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGZvcm0gdmFsaWRhdGlvbiAoaW50ZWdyYXRpb24gd2l0aCByZWFsIGNyZWF0ZSBjb21wb25lbnQpXG4gIGRlc2NyaWJlKCdGb3JtIFZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBrZWVwIGJ1dHRvbiBkaXNhYmxlZCB3aGVuIG9ubHkgbmFtZSBpcyBmaWxsZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEV4dGVybmFsS25vd2xlZGdlQmFzZUNvbm5lY3RvciAvPilcblxuICAgICAgY29uc3QgbmFtZUlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlTmFtZVBsYWNlaG9sZGVyJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QnIH0gfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQga2VlcCBidXR0b24gZGlzYWJsZWQgd2hlbiBvbmx5IGtub3dsZWRnZSBpZCBpcyBmaWxsZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEV4dGVybmFsS25vd2xlZGdlQmFzZUNvbm5lY3RvciAvPilcblxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShrbm93bGVkZ2VJZElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2tiLTEnIH0gfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZW5hYmxlIGJ1dHRvbiB3aGVuIGFsbCByZXF1aXJlZCBmaWVsZHMgYXJlIGZpbGxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ29ubmVjdG9yIC8+KVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKG5hbWVJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdUZXN0JyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGtub3dsZWRnZUlkSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAna2ItMScgfSB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHVzZXIgaW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFsbG93IHR5cGluZyBpbiBmb3JtIGZpZWxkcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyKDxFeHRlcm5hbEtub3dsZWRnZUJhc2VDb25uZWN0b3IgLz4pXG5cbiAgICAgIGNvbnN0IG5hbWVJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZU5hbWVQbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRGVzY3JpcHRpb25QbGFjZWhvbGRlcicpXG5cbiAgICAgIGF3YWl0IHVzZXIudHlwZShuYW1lSW5wdXQsICdNeSBLbm93bGVkZ2UgQmFzZScpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUoZGVzY3JpcHRpb25JbnB1dCwgJ015IERlc2NyaXB0aW9uJylcblxuICAgICAgZXhwZWN0KChuYW1lSW5wdXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpLnRvQmUoJ015IEtub3dsZWRnZSBCYXNlJylcbiAgICAgIGV4cGVjdCgoZGVzY3JpcHRpb25JbnB1dCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZSkudG9CZSgnTXkgRGVzY3JpcHRpb24nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjYW5jZWwgYnV0dG9uIGNsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXIoPEV4dGVybmFsS25vd2xlZGdlQmFzZUNvbm5lY3RvciAvPilcblxuICAgICAgY29uc3QgY2FuY2VsQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY2FuY2VsJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2FuY2VsQnV0dG9uISlcblxuICAgICAgZXhwZWN0KG1vY2tSZXBsYWNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYmFjayBidXR0b24gY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlcig8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ29ubmVjdG9yIC8+KVxuXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGNvbnN0IGJhY2tCdXR0b24gPSBidXR0b25zLmZpbmQoYnRuID0+IGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ3JvdW5kZWQtZnVsbCcpKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhiYWNrQnV0dG9uISlcblxuICAgICAgZXhwZWN0KG1vY2tSZXBsYWNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==