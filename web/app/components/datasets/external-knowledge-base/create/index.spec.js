"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const index_1 = require("./index");
const RetrievalSettings_1 = require("./RetrievalSettings");
// Mock next/navigation
const mockReplace = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: mockReplace,
        push: vi.fn(),
        refresh: mockRefresh,
    }),
}));
// Mock useDocLink hook
vi.mock('@/context/i18n', () => ({
    useDocLink: () => (path) => `https://docs.dify.ai/en${path || ''}`,
}));
// Mock external context providers (these are external dependencies)
const mockSetShowExternalKnowledgeAPIModal = vi.fn();
vi.mock('@/context/modal-context', () => ({
    useModalContext: () => ({
        setShowExternalKnowledgeAPIModal: mockSetShowExternalKnowledgeAPIModal,
    }),
}));
// Factory function to create mock ExternalAPIItem (following project conventions)
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
const mockMutateExternalKnowledgeApis = vi.fn();
let mockExternalKnowledgeApiList = createDefaultMockApiList();
vi.mock('@/context/external-knowledge-api-context', () => ({
    useExternalKnowledgeApi: () => ({
        externalKnowledgeApiList: mockExternalKnowledgeApiList,
        mutateExternalKnowledgeApis: mockMutateExternalKnowledgeApis,
        isLoading: false,
    }),
}));
// Helper to render component with default props
const renderComponent = (props = {}) => {
    const defaultProps = {
        onConnect: vi.fn(),
        loading: false,
    };
    return (0, react_1.render)(<index_1.default {...defaultProps} {...props}/>);
};
describe('ExternalKnowledgeBaseCreate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset API list to default using factory function
        mockExternalKnowledgeApiList = createDefaultMockApiList();
    });
    // Tests for basic rendering
    describe('Rendering', () => {
        it('should render without crashing', () => {
            renderComponent();
            expect(react_1.screen.getByText('dataset.connectDataset')).toBeInTheDocument();
        });
        it('should render KnowledgeBaseInfo component with correct labels', () => {
            renderComponent();
            // KnowledgeBaseInfo renders these labels
            expect(react_1.screen.getByText('dataset.externalKnowledgeName')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.externalKnowledgeDescription')).toBeInTheDocument();
        });
        it('should render ExternalApiSelection component', () => {
            renderComponent();
            // ExternalApiSelection renders this label
            expect(react_1.screen.getByText('dataset.externalAPIPanelTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.externalKnowledgeId')).toBeInTheDocument();
        });
        it('should render RetrievalSettings component', () => {
            renderComponent();
            // RetrievalSettings renders this label
            expect(react_1.screen.getByText('dataset.retrievalSettings')).toBeInTheDocument();
        });
        it('should render InfoPanel component', () => {
            renderComponent();
            // InfoPanel renders these texts
            expect(react_1.screen.getByText('dataset.connectDatasetIntro.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.connectDatasetIntro.learnMore')).toBeInTheDocument();
        });
        it('should render helper text with translation keys', () => {
            renderComponent();
            expect(react_1.screen.getByText('dataset.connectHelper.helper1')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.connectHelper.helper2')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.connectHelper.helper3')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.connectHelper.helper4')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.connectHelper.helper5')).toBeInTheDocument();
        });
        it('should render cancel and connect buttons', () => {
            renderComponent();
            expect(react_1.screen.getByText('dataset.externalKnowledgeForm.cancel')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.externalKnowledgeForm.connect')).toBeInTheDocument();
        });
        it('should render documentation link with correct href', () => {
            renderComponent();
            const docLink = react_1.screen.getByText('dataset.connectHelper.helper4');
            expect(docLink).toHaveAttribute('href', 'https://docs.dify.ai/en/guides/knowledge-base/connect-external-knowledge-base');
            expect(docLink).toHaveAttribute('target', '_blank');
            expect(docLink).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });
    // Tests for props handling
    describe('Props', () => {
        it('should pass loading prop to connect button', () => {
            renderComponent({ loading: true });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeInTheDocument();
        });
        it('should call onConnect with form data when connect button is clicked', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            // Fill in name field (using the actual Input component)
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test Knowledge Base' } });
            // Fill in external knowledge id
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'knowledge-456' } });
            // Wait for useEffect to auto-select the first API
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Test Knowledge Base',
                external_knowledge_id: 'knowledge-456',
                external_knowledge_api_id: 'api-1', // Auto-selected first API
                provider: 'external',
            }));
        });
        it('should not call onConnect when form is invalid and button is disabled', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeDisabled();
            await user.click(connectButton);
            expect(onConnect).not.toHaveBeenCalled();
        });
    });
    // Tests for state management with real child components
    describe('State Management', () => {
        it('should initialize form data with default values', () => {
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const descriptionInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeDescriptionPlaceholder');
            expect(nameInput.value).toBe('');
            expect(descriptionInput.value).toBe('');
        });
        it('should update name when input changes', () => {
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'New Name' } });
            expect(nameInput.value).toBe('New Name');
        });
        it('should update description when textarea changes', () => {
            renderComponent();
            const descriptionInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeDescriptionPlaceholder');
            react_1.fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
            expect(descriptionInput.value).toBe('New Description');
        });
        it('should update external_knowledge_id when input changes', () => {
            renderComponent();
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'new-knowledge-id' } });
            expect(knowledgeIdInput.value).toBe('new-knowledge-id');
        });
        it('should apply filled text style when description has value', () => {
            renderComponent();
            const descriptionInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeDescriptionPlaceholder');
            // Initially empty - should have placeholder style
            expect(descriptionInput.className).toContain('text-components-input-text-placeholder');
            // Add description - should have filled style
            react_1.fireEvent.change(descriptionInput, { target: { value: 'Some description' } });
            expect(descriptionInput.className).toContain('text-components-input-text-filled');
        });
        it('should apply placeholder text style when description is empty', () => {
            renderComponent();
            const descriptionInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeDescriptionPlaceholder');
            // Add then clear description
            react_1.fireEvent.change(descriptionInput, { target: { value: 'Some description' } });
            react_1.fireEvent.change(descriptionInput, { target: { value: '' } });
            expect(descriptionInput.className).toContain('text-components-input-text-placeholder');
        });
    });
    // Tests for form validation
    describe('Form Validation', () => {
        it('should disable connect button when name is empty', async () => {
            renderComponent();
            // Fill knowledge id but not name
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'knowledge-456' } });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeDisabled();
        });
        it('should disable connect button when name is only whitespace', async () => {
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: '   ' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'knowledge-456' } });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeDisabled();
        });
        it('should disable connect button when external_knowledge_id is empty', () => {
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test Name' } });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeDisabled();
        });
        it('should enable connect button when all required fields are filled', async () => {
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test Name' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'knowledge-456' } });
            // Wait for auto-selection of API
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
        });
    });
    // Tests for user interactions
    describe('User Interactions', () => {
        it('should navigate back when back button is clicked', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            const buttons = react_1.screen.getAllByRole('button');
            const backButton = buttons.find(btn => btn.classList.contains('rounded-full'));
            await user.click(backButton);
            expect(mockReplace).toHaveBeenCalledWith('/datasets');
        });
        it('should navigate back when cancel button is clicked', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            const cancelButton = react_1.screen.getByText('dataset.externalKnowledgeForm.cancel').closest('button');
            await user.click(cancelButton);
            expect(mockReplace).toHaveBeenCalledWith('/datasets');
        });
        it('should call onConnect with complete form data when connect is clicked', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            // Fill all fields using real components
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const descriptionInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeDescriptionPlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'My Knowledge Base' } });
            react_1.fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'knowledge-abc' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                name: 'My Knowledge Base',
                description: 'Test description',
                external_knowledge_id: 'knowledge-abc',
                provider: 'external',
            }));
        });
        it('should allow user to type in all input fields', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const descriptionInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeDescriptionPlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            await user.type(nameInput, 'Typed Name');
            await user.type(descriptionInput, 'Typed Description');
            await user.type(knowledgeIdInput, 'typed-knowledge');
            expect(nameInput.value).toBe('Typed Name');
            expect(descriptionInput.value).toBe('Typed Description');
            expect(knowledgeIdInput.value).toBe('typed-knowledge');
        });
    });
    // Tests for ExternalApiSelection integration
    describe('ExternalApiSelection Integration', () => {
        it('should auto-select first API when API list is available', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'kb-1' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            // Should have auto-selected the first API
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                external_knowledge_api_id: 'api-1',
            }));
        });
        it('should display API selector when APIs are available', () => {
            renderComponent();
            // The ExternalApiSelect should show the first selected API name
            expect(react_1.screen.getByText('Test API 1')).toBeInTheDocument();
        });
        it('should allow selecting different API from dropdown', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            // Click on the API selector to open dropdown
            const apiSelector = react_1.screen.getByText('Test API 1');
            await user.click(apiSelector);
            // Select the second API
            const secondApi = react_1.screen.getByText('Test API 2');
            await user.click(secondApi);
            // Fill required fields
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'kb-1' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            // Should have selected the second API
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                external_knowledge_api_id: 'api-2',
            }));
        });
        it('should show add API button when no APIs are available', () => {
            // Set empty API list
            mockExternalKnowledgeApiList = [];
            renderComponent();
            // Should show "no external knowledge" button
            expect(react_1.screen.getByText('dataset.noExternalKnowledge')).toBeInTheDocument();
        });
        it('should open add API modal when add button is clicked', async () => {
            const user = user_event_1.default.setup();
            // Set empty API list
            mockExternalKnowledgeApiList = [];
            renderComponent();
            // Click the add button
            const addButton = react_1.screen.getByText('dataset.noExternalKnowledge').closest('button');
            await user.click(addButton);
            // Should call the modal context function
            expect(mockSetShowExternalKnowledgeAPIModal).toHaveBeenCalledWith(expect.objectContaining({
                payload: { name: '', settings: { endpoint: '', api_key: '' } },
                isEditMode: false,
            }));
        });
        it('should call mutate and router.refresh on modal save callback', async () => {
            const user = user_event_1.default.setup();
            // Set empty API list
            mockExternalKnowledgeApiList = [];
            renderComponent();
            // Click the add button
            const addButton = react_1.screen.getByText('dataset.noExternalKnowledge').closest('button');
            await user.click(addButton);
            // Get the callback and invoke it
            const modalCall = mockSetShowExternalKnowledgeAPIModal.mock.calls[0][0];
            await modalCall.onSaveCallback();
            expect(mockMutateExternalKnowledgeApis).toHaveBeenCalled();
            expect(mockRefresh).toHaveBeenCalled();
        });
        it('should call mutate on modal cancel callback', async () => {
            const user = user_event_1.default.setup();
            // Set empty API list
            mockExternalKnowledgeApiList = [];
            renderComponent();
            // Click the add button
            const addButton = react_1.screen.getByText('dataset.noExternalKnowledge').closest('button');
            await user.click(addButton);
            // Get the callback and invoke it
            const modalCall = mockSetShowExternalKnowledgeAPIModal.mock.calls[0][0];
            modalCall.onCancelCallback();
            expect(mockMutateExternalKnowledgeApis).toHaveBeenCalled();
        });
        it('should display API URL in dropdown', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            // Click on the API selector to open dropdown
            const apiSelector = react_1.screen.getByText('Test API 1');
            await user.click(apiSelector);
            // Should show API URLs
            expect(react_1.screen.getByText('https://api1.example.com')).toBeInTheDocument();
            expect(react_1.screen.getByText('https://api2.example.com')).toBeInTheDocument();
        });
        it('should show create new API option in dropdown', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            // Click on the API selector to open dropdown
            const apiSelector = react_1.screen.getByText('Test API 1');
            await user.click(apiSelector);
            // Should show create new API option
            expect(react_1.screen.getByText('dataset.createNewExternalAPI')).toBeInTheDocument();
        });
        it('should open add API modal when clicking create new API in dropdown', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            // Click on the API selector to open dropdown
            const apiSelector = react_1.screen.getByText('Test API 1');
            await user.click(apiSelector);
            // Click on create new API option
            const createNewApiOption = react_1.screen.getByText('dataset.createNewExternalAPI');
            await user.click(createNewApiOption);
            // Should call the modal context function
            expect(mockSetShowExternalKnowledgeAPIModal).toHaveBeenCalledWith(expect.objectContaining({
                payload: { name: '', settings: { endpoint: '', api_key: '' } },
                isEditMode: false,
            }));
        });
        it('should call mutate and refresh on save callback from ExternalApiSelect dropdown', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            // Click on the API selector to open dropdown
            const apiSelector = react_1.screen.getByText('Test API 1');
            await user.click(apiSelector);
            // Click on create new API option
            const createNewApiOption = react_1.screen.getByText('dataset.createNewExternalAPI');
            await user.click(createNewApiOption);
            // Get the callback from the modal call and invoke it
            const modalCall = mockSetShowExternalKnowledgeAPIModal.mock.calls[0][0];
            await modalCall.onSaveCallback();
            expect(mockMutateExternalKnowledgeApis).toHaveBeenCalled();
            expect(mockRefresh).toHaveBeenCalled();
        });
        it('should call mutate on cancel callback from ExternalApiSelect dropdown', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            // Click on the API selector to open dropdown
            const apiSelector = react_1.screen.getByText('Test API 1');
            await user.click(apiSelector);
            // Click on create new API option
            const createNewApiOption = react_1.screen.getByText('dataset.createNewExternalAPI');
            await user.click(createNewApiOption);
            // Get the callback from the modal call and invoke it
            const modalCall = mockSetShowExternalKnowledgeAPIModal.mock.calls[0][0];
            modalCall.onCancelCallback();
            expect(mockMutateExternalKnowledgeApis).toHaveBeenCalled();
        });
        it('should close dropdown after selecting an API', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            // Click on the API selector to open dropdown
            const apiSelector = react_1.screen.getByText('Test API 1');
            await user.click(apiSelector);
            // Dropdown should be open - API URLs visible
            expect(react_1.screen.getByText('https://api1.example.com')).toBeInTheDocument();
            // Select the second API
            const secondApi = react_1.screen.getByText('Test API 2');
            await user.click(secondApi);
            // Dropdown should be closed - API URLs not visible
            expect(react_1.screen.queryByText('https://api1.example.com')).not.toBeInTheDocument();
        });
        it('should toggle dropdown open/close on selector click', async () => {
            const user = user_event_1.default.setup();
            renderComponent();
            // Click to open
            const apiSelector = react_1.screen.getByText('Test API 1');
            await user.click(apiSelector);
            expect(react_1.screen.getByText('https://api1.example.com')).toBeInTheDocument();
            // Click again to close
            await user.click(apiSelector);
            expect(react_1.screen.queryByText('https://api1.example.com')).not.toBeInTheDocument();
        });
    });
    // Tests for callback stability
    describe('Callback Stability', () => {
        it('should maintain stable navBackHandle callback reference', async () => {
            const user = user_event_1.default.setup();
            const { rerender } = (0, react_1.render)(<index_1.default onConnect={vi.fn()} loading={false}/>);
            const buttons = react_1.screen.getAllByRole('button');
            const backButton = buttons.find(btn => btn.classList.contains('rounded-full'));
            await user.click(backButton);
            expect(mockReplace).toHaveBeenCalledTimes(1);
            rerender(<index_1.default onConnect={vi.fn()} loading={false}/>);
            await user.click(backButton);
            expect(mockReplace).toHaveBeenCalledTimes(2);
        });
        it('should not recreate handlers on prop changes', async () => {
            const user = user_event_1.default.setup();
            const onConnect1 = vi.fn();
            const onConnect2 = vi.fn();
            const { rerender } = (0, react_1.render)(<index_1.default onConnect={onConnect1} loading={false}/>);
            // Fill form
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'knowledge' } });
            // Rerender with new callback
            rerender(<index_1.default onConnect={onConnect2} loading={false}/>);
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            // Should use the new callback
            expect(onConnect1).not.toHaveBeenCalled();
            expect(onConnect2).toHaveBeenCalled();
        });
    });
    // Tests for edge cases
    describe('Edge Cases', () => {
        it('should handle empty description gracefully', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'knowledge' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                description: '',
            }));
        });
        it('should handle special characters in name', () => {
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const specialName = 'Test <script>alert("xss")</script> Name';
            react_1.fireEvent.change(nameInput, { target: { value: specialName } });
            expect(nameInput.value).toBe(specialName);
        });
        it('should handle very long input values', () => {
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const longName = 'A'.repeat(1000);
            react_1.fireEvent.change(nameInput, { target: { value: longName } });
            expect(nameInput.value).toBe(longName);
        });
        it('should handle rapid sequential updates', () => {
            renderComponent();
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            // Rapid updates
            for (let i = 0; i < 10; i++)
                react_1.fireEvent.change(nameInput, { target: { value: `Name ${i}` } });
            expect(nameInput.value).toBe('Name 9');
        });
        it('should preserve provider value as external', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'knowledge' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                provider: 'external',
            }));
        });
    });
    // Tests for loading state
    describe('Loading State', () => {
        it('should pass loading state to connect button', () => {
            renderComponent({ loading: true });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeInTheDocument();
        });
        it('should render correctly when not loading', () => {
            renderComponent({ loading: false });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            expect(connectButton).toBeInTheDocument();
        });
    });
    // Tests for RetrievalSettings integration
    describe('RetrievalSettings Integration', () => {
        it('should toggle score threshold enabled when switch is clicked', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            // Find and click the switch for score threshold
            const switches = react_1.screen.getAllByRole('switch');
            const scoreThresholdSwitch = switches[0]; // The score threshold switch
            await user.click(scoreThresholdSwitch);
            // Fill required fields
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'kb-1' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                external_retrieval_model: expect.objectContaining({
                    score_threshold_enabled: true,
                }),
            }));
        });
        it('should display retrieval settings labels', () => {
            renderComponent();
            // Should show the retrieval settings section title
            expect(react_1.screen.getByText('dataset.retrievalSettings')).toBeInTheDocument();
            // Should show Top K and Score Threshold labels
            expect(react_1.screen.getByText('appDebug.datasetConfig.top_k')).toBeInTheDocument();
            expect(react_1.screen.getByText('appDebug.datasetConfig.score_threshold')).toBeInTheDocument();
        });
    });
    // Direct unit tests for RetrievalSettings component to cover all branches
    describe('RetrievalSettings Component Direct Tests', () => {
        it('should render with isInHitTesting mode', () => {
            const onChange = vi.fn();
            (0, react_1.render)(<RetrievalSettings_1.default topK={4} scoreThreshold={0.5} scoreThresholdEnabled={false} onChange={onChange} isInHitTesting={true}/>);
            // In hit testing mode, the title should not be shown
            expect(react_1.screen.queryByText('dataset.retrievalSettings')).not.toBeInTheDocument();
        });
        it('should render with isInRetrievalSetting mode', () => {
            const onChange = vi.fn();
            (0, react_1.render)(<RetrievalSettings_1.default topK={4} scoreThreshold={0.5} scoreThresholdEnabled={false} onChange={onChange} isInRetrievalSetting={true}/>);
            // In retrieval setting mode, the title should not be shown
            expect(react_1.screen.queryByText('dataset.retrievalSettings')).not.toBeInTheDocument();
        });
        it('should call onChange with score_threshold_enabled when switch is toggled', async () => {
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            (0, react_1.render)(<RetrievalSettings_1.default topK={4} scoreThreshold={0.5} scoreThresholdEnabled={false} onChange={onChange}/>);
            // Find and click the switch
            const switches = react_1.screen.getAllByRole('switch');
            await user.click(switches[0]);
            expect(onChange).toHaveBeenCalledWith({ score_threshold_enabled: true });
        });
        it('should call onChange with top_k when top k value changes', () => {
            const onChange = vi.fn();
            (0, react_1.render)(<RetrievalSettings_1.default topK={4} scoreThreshold={0.5} scoreThresholdEnabled={false} onChange={onChange}/>);
            // The TopKItem should render an input
            const inputs = react_1.screen.getAllByRole('spinbutton');
            const topKInput = inputs[0];
            react_1.fireEvent.change(topKInput, { target: { value: '8' } });
            expect(onChange).toHaveBeenCalledWith({ top_k: 8 });
        });
        it('should call onChange with score_threshold when threshold value changes', () => {
            const onChange = vi.fn();
            (0, react_1.render)(<RetrievalSettings_1.default topK={4} scoreThreshold={0.5} scoreThresholdEnabled={true} onChange={onChange}/>);
            // The ScoreThresholdItem should render an input
            const inputs = react_1.screen.getAllByRole('spinbutton');
            const scoreThresholdInput = inputs[1];
            react_1.fireEvent.change(scoreThresholdInput, { target: { value: '0.8' } });
            expect(onChange).toHaveBeenCalledWith({ score_threshold: 0.8 });
        });
    });
    // Tests for complete form submission flow
    describe('Complete Form Submission Flow', () => {
        it('should submit form with all default retrieval settings', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Test KB' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'kb-1' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            expect(onConnect).toHaveBeenCalledWith({
                name: 'Test KB',
                description: '',
                external_knowledge_api_id: 'api-1',
                external_knowledge_id: 'kb-1',
                external_retrieval_model: {
                    top_k: 4,
                    score_threshold: 0.5,
                    score_threshold_enabled: false,
                },
                provider: 'external',
            });
        });
        it('should submit form with modified retrieval settings', async () => {
            const user = user_event_1.default.setup();
            const onConnect = vi.fn();
            renderComponent({ onConnect });
            // Toggle score threshold switch
            const switches = react_1.screen.getAllByRole('switch');
            const scoreThresholdSwitch = switches[0];
            await user.click(scoreThresholdSwitch);
            // Fill required fields
            const nameInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeNamePlaceholder');
            const knowledgeIdInput = react_1.screen.getByPlaceholderText('dataset.externalKnowledgeIdPlaceholder');
            react_1.fireEvent.change(nameInput, { target: { value: 'Custom KB' } });
            react_1.fireEvent.change(knowledgeIdInput, { target: { value: 'custom-kb' } });
            await (0, react_1.waitFor)(() => {
                const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
                expect(connectButton).not.toBeDisabled();
            });
            const connectButton = react_1.screen.getByText('dataset.externalKnowledgeForm.connect').closest('button');
            await user.click(connectButton);
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Custom KB',
                external_retrieval_model: expect.objectContaining({
                    score_threshold_enabled: true,
                }),
            }));
        });
    });
    // Tests for accessibility
    describe('Accessibility', () => {
        it('should have accessible buttons', () => {
            renderComponent();
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThanOrEqual(3); // back, cancel, connect
        });
        it('should have proper link attributes for external links', () => {
            renderComponent();
            const externalLink = react_1.screen.getByText('dataset.connectHelper.helper4');
            expect(externalLink.tagName).toBe('A');
            expect(externalLink).toHaveAttribute('target', '_blank');
            expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
        });
        it('should have labels for form inputs', () => {
            renderComponent();
            // Check labels exist
            expect(react_1.screen.getByText('dataset.externalKnowledgeName')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.externalKnowledgeDescription')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.externalKnowledgeId')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLDREQUFtRDtBQUNuRCwrQkFBOEI7QUFDOUIsbUNBQWlEO0FBQ2pELDJEQUFtRDtBQUVuRCx1QkFBdUI7QUFDdkIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzNCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMzQixFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDaEIsT0FBTyxFQUFFLFdBQVc7UUFDcEIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUUsV0FBVztLQUNyQixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCx1QkFBdUI7QUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQWEsRUFBRSxFQUFFLENBQUMsMEJBQTBCLElBQUksSUFBSSxFQUFFLEVBQUU7Q0FDNUUsQ0FBQyxDQUFDLENBQUE7QUFFSCxvRUFBb0U7QUFDcEUsTUFBTSxvQ0FBb0MsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDcEQsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLGdDQUFnQyxFQUFFLG9DQUFvQztLQUN2RSxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxrRkFBa0Y7QUFDbEYsTUFBTSx5QkFBeUIsR0FBRyxDQUFD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QUFlLEVBQUUsQ0FBQTtZQUVqQixxQkFBcUI7WUFDckIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDN0UsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDcEYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDN0UsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBFeHRlcm5hbEFQSUl0ZW0gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBFeHRlcm5hbEtub3dsZWRnZUJhc2VDcmVhdGUgZnJvbSAnLi9pbmRleCdcbmltcG9ydCBSZXRyaWV2YWxTZXR0aW5ncyBmcm9tICcuL1JldHJpZXZhbFNldHRpbmdzJ1xuXG4vLyBNb2NrIG5leHQvbmF2aWdhdGlvblxuY29uc3QgbW9ja1JlcGxhY2UgPSB2aS5mbigpXG5jb25zdCBtb2NrUmVmcmVzaCA9IHZpLmZuKClcbnZpLm1vY2soJ25leHQvbmF2aWdhdGlvbicsICgpID0+ICh7XG4gIHVzZVJvdXRlcjogKCkgPT4gKHtcbiAgICByZXBsYWNlOiBtb2NrUmVwbGFjZSxcbiAgICBwdXNoOiB2aS5mbigpLFxuICAgIHJlZnJlc2g6IG1vY2tSZWZyZXNoLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZURvY0xpbmsgaG9va1xudmkubW9jaygnQC9jb250ZXh0L2kxOG4nLCAoKSA9PiAoe1xuICB1c2VEb2NMaW5rOiAoKSA9PiAocGF0aD86IHN0cmluZykgPT4gYGh0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuJHtwYXRoIHx8ICcnfWAsXG59KSlcblxuLy8gTW9jayBleHRlcm5hbCBjb250ZXh0IHByb3ZpZGVycyAodGhlc2UgYXJlIGV4dGVybmFsIGRlcGVuZGVuY2llcylcbmNvbnN0IG1vY2tTZXRTaG93RXh0ZXJuYWxLbm93bGVkZ2VBUElNb2RhbCA9IHZpLmZuKClcbnZpLm1vY2soJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlTW9kYWxDb250ZXh0OiAoKSA9PiAoe1xuICAgIHNldFNob3dFeHRlcm5hbEtub3dsZWRnZUFQSU1vZGFsOiBtb2NrU2V0U2hvd0V4dGVybmFsS25vd2xlZGdlQVBJTW9kYWwsXG4gIH0pLFxufSkpXG5cbi8vIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIG1vY2sgRXh0ZXJuYWxBUElJdGVtIChmb2xsb3dpbmcgcHJvamVjdCBjb252ZW50aW9ucylcbmNvbnN0IGNyZWF0ZU1vY2tFeHRlcm5hbEFQSUl0ZW0gPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPEV4dGVybmFsQVBJSXRlbT4gPSB7fSk6IEV4dGVybmFsQVBJSXRlbSA9PiAoe1xuICBpZDogJ2FwaS1kZWZhdWx0JyxcbiAgdGVuYW50X2lkOiAndGVuYW50LTEnLFxuICBuYW1lOiAnRGVmYXVsdCBBUEknLFxuICBkZXNjcmlwdGlvbjogJ0RlZmF1bHQgQVBJIGRlc2NyaXB0aW9uJyxcbiAgc2V0dGluZ3M6IHtcbiAgICBlbmRwb2ludDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tJyxcbiAgICBhcGlfa2V5OiAndGVzdC1hcGkta2V5JyxcbiAgfSxcbiAgZGF0YXNldF9iaW5kaW5nczogW10sXG4gIGNyZWF0ZWRfYnk6ICd1c2VyLTEnLFxuICBjcmVhdGVkX2F0OiAnMjAyNC0wMS0wMVQwMDowMDowMFonLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBEZWZhdWx0IG1vY2sgQVBJIGxpc3RcbmNvbnN0IGNyZWF0ZURlZmF1bHRNb2NrQXBpTGlzdCA9ICgpOiBFeHRlcm5hbEFQSUl0ZW1bXSA9PiBbXG4gIGNyZWF0ZU1vY2tFeHRlcm5hbEFQSUl0ZW0oe1xuICAgIGlkOiAnYXBpLTEnLFxuICAgIG5hbWU6ICdUZXN0IEFQSSAxJyxcbiAgICBzZXR0aW5nczogeyBlbmRwb2ludDogJ2h0dHBzOi8vYXBpMS5leGFtcGxlLmNvbScsIGFwaV9rZXk6ICdrZXktMScgfSxcbiAgfSksXG4gIGNyZWF0ZU1vY2tFeHRlcm5hbEFQSUl0ZW0oe1xuICAgIGlkOiAnYXBpLTInLFxuICAgIG5hbWU6ICdUZXN0IEFQSSAyJyxcbiAgICBzZXR0aW5nczogeyBlbmRwb2ludDogJ2h0dHBzOi8vYXBpMi5leGFtcGxlLmNvbScsIGFwaV9rZXk6ICdrZXktMicgfSxcbiAgfSksXG5dXG5cbmNvbnN0IG1vY2tNdXRhdGVFeHRlcm5hbEtub3dsZWRnZUFwaXMgPSB2aS5mbigpXG5sZXQgbW9ja0V4dGVybmFsS25vd2xlZGdlQXBpTGlzdDogRXh0ZXJuYWxBUElJdGVtW10gPSBjcmVhdGVEZWZhdWx0TW9ja0FwaUxpc3QoKVxuXG52aS5tb2NrKCdAL2NvbnRleHQvZXh0ZXJuYWwta25vd2xlZGdlLWFwaS1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlRXh0ZXJuYWxLbm93bGVkZ2VBcGk6ICgpID0+ICh7XG4gICAgZXh0ZXJuYWxLbm93bGVkZ2VBcGlMaXN0OiBtb2NrRXh0ZXJuYWxLbm93bGVkZ2VBcGlMaXN0LFxuICAgIG11dGF0ZUV4dGVybmFsS25vd2xlZGdlQXBpczogbW9ja011dGF0ZUV4dGVybmFsS25vd2xlZGdlQXBpcyxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICB9KSxcbn0pKVxuXG4vLyBIZWxwZXIgdG8gcmVuZGVyIGNvbXBvbmVudCB3aXRoIGRlZmF1bHQgcHJvcHNcbmNvbnN0IHJlbmRlckNvbXBvbmVudCA9IChwcm9wczogUGFydGlhbDxSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgRXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ3JlYXRlPj4gPSB7fSkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25Db25uZWN0OiB2aS5mbigpLFxuICAgIGxvYWRpbmc6IGZhbHNlLFxuICB9XG4gIHJldHVybiByZW5kZXIoPEV4dGVybmFsS25vd2xlZGdlQmFzZUNyZWF0ZSB7Li4uZGVmYXVsdFByb3BzfSB7Li4ucHJvcHN9IC8+KVxufVxuXG5kZXNjcmliZSgnRXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ3JlYXRlJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICAvLyBSZXNldCBBUEkgbGlzdCB0byBkZWZhdWx0IHVzaW5nIGZhY3RvcnkgZnVuY3Rpb25cbiAgICBtb2NrRXh0ZXJuYWxLbm93bGVkZ2VBcGlMaXN0ID0gY3JlYXRlRGVmYXVsdE1vY2tBcGlMaXN0KClcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgYmFzaWMgcmVuZGVyaW5nXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmNvbm5lY3REYXRhc2V0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgS25vd2xlZGdlQmFzZUluZm8gY29tcG9uZW50IHdpdGggY29ycmVjdCBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBLbm93bGVkZ2VCYXNlSW5mbyByZW5kZXJzIHRoZXNlIGxhYmVsc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRGVzY3JpcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBFeHRlcm5hbEFwaVNlbGVjdGlvbiBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBFeHRlcm5hbEFwaVNlbGVjdGlvbiByZW5kZXJzIHRoaXMgbGFiZWxcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsQVBJUGFuZWxUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUmV0cmlldmFsU2V0dGluZ3MgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gUmV0cmlldmFsU2V0dGluZ3MgcmVuZGVycyB0aGlzIGxhYmVsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWxTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEluZm9QYW5lbCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBJbmZvUGFuZWwgcmVuZGVycyB0aGVzZSB0ZXh0c1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuY29ubmVjdERhdGFzZXRJbnRyby50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5jb25uZWN0RGF0YXNldEludHJvLmxlYXJuTW9yZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGhlbHBlciB0ZXh0IHdpdGggdHJhbnNsYXRpb24ga2V5cycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmNvbm5lY3RIZWxwZXIuaGVscGVyMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5jb25uZWN0SGVscGVyLmhlbHBlcjInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuY29ubmVjdEhlbHBlci5oZWxwZXIzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmNvbm5lY3RIZWxwZXIuaGVscGVyNCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5jb25uZWN0SGVscGVyLmhlbHBlcjUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjYW5jZWwgYW5kIGNvbm5lY3QgYnV0dG9ucycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jYW5jZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkb2N1bWVudGF0aW9uIGxpbmsgd2l0aCBjb3JyZWN0IGhyZWYnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBkb2NMaW5rID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5jb25uZWN0SGVscGVyLmhlbHBlcjQnKVxuICAgICAgZXhwZWN0KGRvY0xpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2RvY3MuZGlmeS5haS9lbi9ndWlkZXMva25vd2xlZGdlLWJhc2UvY29ubmVjdC1leHRlcm5hbC1rbm93bGVkZ2UtYmFzZScpXG4gICAgICBleHBlY3QoZG9jTGluaykudG9IYXZlQXR0cmlidXRlKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICAgIGV4cGVjdChkb2NMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3JlbCcsICdub29wZW5lciBub3JlZmVycmVyJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBwcm9wcyBoYW5kbGluZ1xuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGxvYWRpbmcgcHJvcCB0byBjb25uZWN0IGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGxvYWRpbmc6IHRydWUgfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ29ubmVjdCB3aXRoIGZvcm0gZGF0YSB3aGVuIGNvbm5lY3QgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ29ubmVjdCA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ29ubmVjdCB9KVxuXG4gICAgICAvLyBGaWxsIGluIG5hbWUgZmllbGQgKHVzaW5nIHRoZSBhY3R1YWwgSW5wdXQgY29tcG9uZW50KVxuICAgICAgY29uc3QgbmFtZUlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlTmFtZVBsYWNlaG9sZGVyJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QgS25vd2xlZGdlIEJhc2UnIH0gfSlcblxuICAgICAgLy8gRmlsbCBpbiBleHRlcm5hbCBrbm93bGVkZ2UgaWRcbiAgICAgIGNvbnN0IGtub3dsZWRnZUlkSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VJZFBsYWNlaG9sZGVyJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoa25vd2xlZGdlSWRJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdrbm93bGVkZ2UtNDU2JyB9IH0pXG5cbiAgICAgIC8vIFdhaXQgZm9yIHVzZUVmZmVjdCB0byBhdXRvLXNlbGVjdCB0aGUgZmlyc3QgQVBJXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbm5lY3RCdXR0b24hKVxuXG4gICAgICBleHBlY3Qob25Db25uZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIG5hbWU6ICdUZXN0IEtub3dsZWRnZSBCYXNlJyxcbiAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfaWQ6ICdrbm93bGVkZ2UtNDU2JyxcbiAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX2lkOiAnYXBpLTEnLCAvLyBBdXRvLXNlbGVjdGVkIGZpcnN0IEFQSVxuICAgICAgICAgIHByb3ZpZGVyOiAnZXh0ZXJuYWwnLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNvbm5lY3Qgd2hlbiBmb3JtIGlzIGludmFsaWQgYW5kIGJ1dHRvbiBpcyBkaXNhYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgb25Db25uZWN0ID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25Db25uZWN0IH0pXG5cbiAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChjb25uZWN0QnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbm5lY3RCdXR0b24hKVxuICAgICAgZXhwZWN0KG9uQ29ubmVjdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHN0YXRlIG1hbmFnZW1lbnQgd2l0aCByZWFsIGNoaWxkIGNvbXBvbmVudHNcbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIGZvcm0gZGF0YSB3aXRoIGRlZmF1bHQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgbmFtZUlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlTmFtZVBsYWNlaG9sZGVyJykgYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZURlc2NyaXB0aW9uUGxhY2Vob2xkZXInKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50XG5cbiAgICAgIGV4cGVjdChuYW1lSW5wdXQudmFsdWUpLnRvQmUoJycpXG4gICAgICBleHBlY3QoZGVzY3JpcHRpb25JbnB1dC52YWx1ZSkudG9CZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgbmFtZSB3aGVuIGlucHV0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShuYW1lSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnTmV3IE5hbWUnIH0gfSlcblxuICAgICAgZXhwZWN0KChuYW1lSW5wdXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpLnRvQmUoJ05ldyBOYW1lJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgZGVzY3JpcHRpb24gd2hlbiB0ZXh0YXJlYSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZURlc2NyaXB0aW9uUGxhY2Vob2xkZXInKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShkZXNjcmlwdGlvbklucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ05ldyBEZXNjcmlwdGlvbicgfSB9KVxuXG4gICAgICBleHBlY3QoKGRlc2NyaXB0aW9uSW5wdXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudCkudmFsdWUpLnRvQmUoJ05ldyBEZXNjcmlwdGlvbicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGV4dGVybmFsX2tub3dsZWRnZV9pZCB3aGVuIGlucHV0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBrbm93bGVkZ2VJZElucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlSWRQbGFjZWhvbGRlcicpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGtub3dsZWRnZUlkSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnbmV3LWtub3dsZWRnZS1pZCcgfSB9KVxuXG4gICAgICBleHBlY3QoKGtub3dsZWRnZUlkSW5wdXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpLnRvQmUoJ25ldy1rbm93bGVkZ2UtaWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGZpbGxlZCB0ZXh0IHN0eWxlIHdoZW4gZGVzY3JpcHRpb24gaGFzIHZhbHVlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZURlc2NyaXB0aW9uUGxhY2Vob2xkZXInKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50XG5cbiAgICAgIC8vIEluaXRpYWxseSBlbXB0eSAtIHNob3VsZCBoYXZlIHBsYWNlaG9sZGVyIHN0eWxlXG4gICAgICBleHBlY3QoZGVzY3JpcHRpb25JbnB1dC5jbGFzc05hbWUpLnRvQ29udGFpbigndGV4dC1jb21wb25lbnRzLWlucHV0LXRleHQtcGxhY2Vob2xkZXInKVxuXG4gICAgICAvLyBBZGQgZGVzY3JpcHRpb24gLSBzaG91bGQgaGF2ZSBmaWxsZWQgc3R5bGVcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoZGVzY3JpcHRpb25JbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdTb21lIGRlc2NyaXB0aW9uJyB9IH0pXG4gICAgICBleHBlY3QoZGVzY3JpcHRpb25JbnB1dC5jbGFzc05hbWUpLnRvQ29udGFpbigndGV4dC1jb21wb25lbnRzLWlucHV0LXRleHQtZmlsbGVkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBwbGFjZWhvbGRlciB0ZXh0IHN0eWxlIHdoZW4gZGVzY3JpcHRpb24gaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRGVzY3JpcHRpb25QbGFjZWhvbGRlcicpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnRcblxuICAgICAgLy8gQWRkIHRoZW4gY2xlYXIgZGVzY3JpcHRpb25cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoZGVzY3JpcHRpb25JbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdTb21lIGRlc2NyaXB0aW9uJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGRlc2NyaXB0aW9uSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnJyB9IH0pXG5cbiAgICAgIGV4cGVjdChkZXNjcmlwdGlvbklucHV0LmNsYXNzTmFtZSkudG9Db250YWluKCd0ZXh0LWNvbXBvbmVudHMtaW5wdXQtdGV4dC1wbGFjZWhvbGRlcicpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgZm9ybSB2YWxpZGF0aW9uXG4gIGRlc2NyaWJlKCdGb3JtIFZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGNvbm5lY3QgYnV0dG9uIHdoZW4gbmFtZSBpcyBlbXB0eScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEZpbGwga25vd2xlZGdlIGlkIGJ1dCBub3QgbmFtZVxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShrbm93bGVkZ2VJZElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2tub3dsZWRnZS00NTYnIH0gfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBjb25uZWN0IGJ1dHRvbiB3aGVuIG5hbWUgaXMgb25seSB3aGl0ZXNwYWNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgbmFtZUlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlTmFtZVBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGtub3dsZWRnZUlkSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VJZFBsYWNlaG9sZGVyJylcblxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShuYW1lSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnICAgJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGtub3dsZWRnZUlkSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAna25vd2xlZGdlLTQ1NicgfSB9KVxuXG4gICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGNvbm5lY3QgYnV0dG9uIHdoZW4gZXh0ZXJuYWxfa25vd2xlZGdlX2lkIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgbmFtZUlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlTmFtZVBsYWNlaG9sZGVyJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QgTmFtZScgfSB9KVxuXG4gICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBlbmFibGUgY29ubmVjdCBidXR0b24gd2hlbiBhbGwgcmVxdWlyZWQgZmllbGRzIGFyZSBmaWxsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKG5hbWVJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdUZXN0IE5hbWUnIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoa25vd2xlZGdlSWRJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdrbm93bGVkZ2UtNDU2JyB9IH0pXG5cbiAgICAgIC8vIFdhaXQgZm9yIGF1dG8tc2VsZWN0aW9uIG9mIEFQSVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciB1c2VyIGludGVyYWN0aW9uc1xuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBuYXZpZ2F0ZSBiYWNrIHdoZW4gYmFjayBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBjb25zdCBiYWNrQnV0dG9uID0gYnV0dG9ucy5maW5kKGJ0biA9PiBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdyb3VuZGVkLWZ1bGwnKSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYmFja0J1dHRvbiEpXG5cbiAgICAgIGV4cGVjdChtb2NrUmVwbGFjZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbmF2aWdhdGUgYmFjayB3aGVuIGNhbmNlbCBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgY2FuY2VsQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY2FuY2VsJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2FuY2VsQnV0dG9uISlcblxuICAgICAgZXhwZWN0KG1vY2tSZXBsYWNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ29ubmVjdCB3aXRoIGNvbXBsZXRlIGZvcm0gZGF0YSB3aGVuIGNvbm5lY3QgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgb25Db25uZWN0ID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25Db25uZWN0IH0pXG5cbiAgICAgIC8vIEZpbGwgYWxsIGZpZWxkcyB1c2luZyByZWFsIGNvbXBvbmVudHNcbiAgICAgIGNvbnN0IG5hbWVJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZU5hbWVQbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRGVzY3JpcHRpb25QbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBrbm93bGVkZ2VJZElucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlSWRQbGFjZWhvbGRlcicpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ015IEtub3dsZWRnZSBCYXNlJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGRlc2NyaXB0aW9uSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCBkZXNjcmlwdGlvbicgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShrbm93bGVkZ2VJZElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2tub3dsZWRnZS1hYmMnIH0gfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjb25uZWN0QnV0dG9uISlcblxuICAgICAgZXhwZWN0KG9uQ29ubmVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBuYW1lOiAnTXkgS25vd2xlZGdlIEJhc2UnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gICAgICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2lkOiAna25vd2xlZGdlLWFiYycsXG4gICAgICAgICAgcHJvdmlkZXI6ICdleHRlcm5hbCcsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHVzZXIgdG8gdHlwZSBpbiBhbGwgaW5wdXQgZmllbGRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZURlc2NyaXB0aW9uUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuXG4gICAgICBhd2FpdCB1c2VyLnR5cGUobmFtZUlucHV0LCAnVHlwZWQgTmFtZScpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUoZGVzY3JpcHRpb25JbnB1dCwgJ1R5cGVkIERlc2NyaXB0aW9uJylcbiAgICAgIGF3YWl0IHVzZXIudHlwZShrbm93bGVkZ2VJZElucHV0LCAndHlwZWQta25vd2xlZGdlJylcblxuICAgICAgZXhwZWN0KChuYW1lSW5wdXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpLnRvQmUoJ1R5cGVkIE5hbWUnKVxuICAgICAgZXhwZWN0KChkZXNjcmlwdGlvbklucHV0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlKS50b0JlKCdUeXBlZCBEZXNjcmlwdGlvbicpXG4gICAgICBleHBlY3QoKGtub3dsZWRnZUlkSW5wdXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpLnRvQmUoJ3R5cGVkLWtub3dsZWRnZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgRXh0ZXJuYWxBcGlTZWxlY3Rpb24gaW50ZWdyYXRpb25cbiAgZGVzY3JpYmUoJ0V4dGVybmFsQXBpU2VsZWN0aW9uIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXV0by1zZWxlY3QgZmlyc3QgQVBJIHdoZW4gQVBJIGxpc3QgaXMgYXZhaWxhYmxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNvbm5lY3QgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNvbm5lY3QgfSlcblxuICAgICAgY29uc3QgbmFtZUlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlTmFtZVBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGtub3dsZWRnZUlkSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VJZFBsYWNlaG9sZGVyJylcblxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShuYW1lSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShrbm93bGVkZ2VJZElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2tiLTEnIH0gfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjb25uZWN0QnV0dG9uISlcblxuICAgICAgLy8gU2hvdWxkIGhhdmUgYXV0by1zZWxlY3RlZCB0aGUgZmlyc3QgQVBJXG4gICAgICBleHBlY3Qob25Db25uZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfaWQ6ICdhcGktMScsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgQVBJIHNlbGVjdG9yIHdoZW4gQVBJcyBhcmUgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gVGhlIEV4dGVybmFsQXBpU2VsZWN0IHNob3VsZCBzaG93IHRoZSBmaXJzdCBzZWxlY3RlZCBBUEkgbmFtZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQVBJIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHNlbGVjdGluZyBkaWZmZXJlbnQgQVBJIGZyb20gZHJvcGRvd24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ29ubmVjdCA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ29ubmVjdCB9KVxuXG4gICAgICAvLyBDbGljayBvbiB0aGUgQVBJIHNlbGVjdG9yIHRvIG9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IGFwaVNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBBUEkgMScpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFwaVNlbGVjdG9yKVxuXG4gICAgICAvLyBTZWxlY3QgdGhlIHNlY29uZCBBUElcbiAgICAgIGNvbnN0IHNlY29uZEFwaSA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQVBJIDInKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzZWNvbmRBcGkpXG5cbiAgICAgIC8vIEZpbGwgcmVxdWlyZWQgZmllbGRzXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKG5hbWVJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdUZXN0JyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGtub3dsZWRnZUlkSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAna2ItMScgfSB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbm5lY3RCdXR0b24hKVxuXG4gICAgICAvLyBTaG91bGQgaGF2ZSBzZWxlY3RlZCB0aGUgc2Vjb25kIEFQSVxuICAgICAgZXhwZWN0KG9uQ29ubmVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX2lkOiAnYXBpLTInLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGFkZCBBUEkgYnV0dG9uIHdoZW4gbm8gQVBJcyBhcmUgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgLy8gU2V0IGVtcHR5IEFQSSBsaXN0XG4gICAgICBtb2NrRXh0ZXJuYWxLbm93bGVkZ2VBcGlMaXN0ID0gW11cbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIFNob3VsZCBzaG93IFwibm8gZXh0ZXJuYWwga25vd2xlZGdlXCIgYnV0dG9uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5ub0V4dGVybmFsS25vd2xlZGdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIGFkZCBBUEkgbW9kYWwgd2hlbiBhZGQgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIC8vIFNldCBlbXB0eSBBUEkgbGlzdFxuICAgICAgbW9ja0V4dGVybmFsS25vd2xlZGdlQXBpTGlzdCA9IFtdXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBDbGljayB0aGUgYWRkIGJ1dHRvblxuICAgICAgY29uc3QgYWRkQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5ub0V4dGVybmFsS25vd2xlZGdlJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYWRkQnV0dG9uISlcblxuICAgICAgLy8gU2hvdWxkIGNhbGwgdGhlIG1vZGFsIGNvbnRleHQgZnVuY3Rpb25cbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0V4dGVybmFsS25vd2xlZGdlQVBJTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcGF5bG9hZDogeyBuYW1lOiAnJywgc2V0dGluZ3M6IHsgZW5kcG9pbnQ6ICcnLCBhcGlfa2V5OiAnJyB9IH0sXG4gICAgICAgICAgaXNFZGl0TW9kZTogZmFsc2UsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgbXV0YXRlIGFuZCByb3V0ZXIucmVmcmVzaCBvbiBtb2RhbCBzYXZlIGNhbGxiYWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICAvLyBTZXQgZW1wdHkgQVBJIGxpc3RcbiAgICAgIG1vY2tFeHRlcm5hbEtub3dsZWRnZUFwaUxpc3QgPSBbXVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQ2xpY2sgdGhlIGFkZCBidXR0b25cbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQubm9FeHRlcm5hbEtub3dsZWRnZScpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFkZEJ1dHRvbiEpXG5cbiAgICAgIC8vIEdldCB0aGUgY2FsbGJhY2sgYW5kIGludm9rZSBpdFxuICAgICAgY29uc3QgbW9kYWxDYWxsID0gbW9ja1NldFNob3dFeHRlcm5hbEtub3dsZWRnZUFQSU1vZGFsLm1vY2suY2FsbHNbMF1bMF1cbiAgICAgIGF3YWl0IG1vZGFsQ2FsbC5vblNhdmVDYWxsYmFjaygpXG5cbiAgICAgIGV4cGVjdChtb2NrTXV0YXRlRXh0ZXJuYWxLbm93bGVkZ2VBcGlzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrUmVmcmVzaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBtdXRhdGUgb24gbW9kYWwgY2FuY2VsIGNhbGxiYWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICAvLyBTZXQgZW1wdHkgQVBJIGxpc3RcbiAgICAgIG1vY2tFeHRlcm5hbEtub3dsZWRnZUFwaUxpc3QgPSBbXVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQ2xpY2sgdGhlIGFkZCBidXR0b25cbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQubm9FeHRlcm5hbEtub3dsZWRnZScpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFkZEJ1dHRvbiEpXG5cbiAgICAgIC8vIEdldCB0aGUgY2FsbGJhY2sgYW5kIGludm9rZSBpdFxuICAgICAgY29uc3QgbW9kYWxDYWxsID0gbW9ja1NldFNob3dFeHRlcm5hbEtub3dsZWRnZUFQSU1vZGFsLm1vY2suY2FsbHNbMF1bMF1cbiAgICAgIG1vZGFsQ2FsbC5vbkNhbmNlbENhbGxiYWNrKClcblxuICAgICAgZXhwZWN0KG1vY2tNdXRhdGVFeHRlcm5hbEtub3dsZWRnZUFwaXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgQVBJIFVSTCBpbiBkcm9wZG93bicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQ2xpY2sgb24gdGhlIEFQSSBzZWxlY3RvciB0byBvcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCBhcGlTZWxlY3RvciA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQVBJIDEnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhcGlTZWxlY3RvcilcblxuICAgICAgLy8gU2hvdWxkIHNob3cgQVBJIFVSTHNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL2FwaTEuZXhhbXBsZS5jb20nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2h0dHBzOi8vYXBpMi5leGFtcGxlLmNvbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjcmVhdGUgbmV3IEFQSSBvcHRpb24gaW4gZHJvcGRvd24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIENsaWNrIG9uIHRoZSBBUEkgc2VsZWN0b3IgdG8gb3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgYXBpU2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IEFQSSAxJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYXBpU2VsZWN0b3IpXG5cbiAgICAgIC8vIFNob3VsZCBzaG93IGNyZWF0ZSBuZXcgQVBJIG9wdGlvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuY3JlYXRlTmV3RXh0ZXJuYWxBUEknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9wZW4gYWRkIEFQSSBtb2RhbCB3aGVuIGNsaWNraW5nIGNyZWF0ZSBuZXcgQVBJIGluIGRyb3Bkb3duJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBDbGljayBvbiB0aGUgQVBJIHNlbGVjdG9yIHRvIG9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IGFwaVNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBBUEkgMScpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFwaVNlbGVjdG9yKVxuXG4gICAgICAvLyBDbGljayBvbiBjcmVhdGUgbmV3IEFQSSBvcHRpb25cbiAgICAgIGNvbnN0IGNyZWF0ZU5ld0FwaU9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuY3JlYXRlTmV3RXh0ZXJuYWxBUEknKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjcmVhdGVOZXdBcGlPcHRpb24pXG5cbiAgICAgIC8vIFNob3VsZCBjYWxsIHRoZSBtb2RhbCBjb250ZXh0IGZ1bmN0aW9uXG4gICAgICBleHBlY3QobW9ja1NldFNob3dFeHRlcm5hbEtub3dsZWRnZUFQSU1vZGFsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHBheWxvYWQ6IHsgbmFtZTogJycsIHNldHRpbmdzOiB7IGVuZHBvaW50OiAnJywgYXBpX2tleTogJycgfSB9LFxuICAgICAgICAgIGlzRWRpdE1vZGU6IGZhbHNlLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG11dGF0ZSBhbmQgcmVmcmVzaCBvbiBzYXZlIGNhbGxiYWNrIGZyb20gRXh0ZXJuYWxBcGlTZWxlY3QgZHJvcGRvd24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIENsaWNrIG9uIHRoZSBBUEkgc2VsZWN0b3IgdG8gb3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgYXBpU2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IEFQSSAxJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYXBpU2VsZWN0b3IpXG5cbiAgICAgIC8vIENsaWNrIG9uIGNyZWF0ZSBuZXcgQVBJIG9wdGlvblxuICAgICAgY29uc3QgY3JlYXRlTmV3QXBpT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5jcmVhdGVOZXdFeHRlcm5hbEFQSScpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNyZWF0ZU5ld0FwaU9wdGlvbilcblxuICAgICAgLy8gR2V0IHRoZSBjYWxsYmFjayBmcm9tIHRoZSBtb2RhbCBjYWxsIGFuZCBpbnZva2UgaXRcbiAgICAgIGNvbnN0IG1vZGFsQ2FsbCA9IG1vY2tTZXRTaG93RXh0ZXJuYWxLbm93bGVkZ2VBUElNb2RhbC5tb2NrLmNhbGxzWzBdWzBdXG4gICAgICBhd2FpdCBtb2RhbENhbGwub25TYXZlQ2FsbGJhY2soKVxuXG4gICAgICBleHBlY3QobW9ja011dGF0ZUV4dGVybmFsS25vd2xlZGdlQXBpcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobW9ja1JlZnJlc2gpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgbXV0YXRlIG9uIGNhbmNlbCBjYWxsYmFjayBmcm9tIEV4dGVybmFsQXBpU2VsZWN0IGRyb3Bkb3duJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBDbGljayBvbiB0aGUgQVBJIHNlbGVjdG9yIHRvIG9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IGFwaVNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBBUEkgMScpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFwaVNlbGVjdG9yKVxuXG4gICAgICAvLyBDbGljayBvbiBjcmVhdGUgbmV3IEFQSSBvcHRpb25cbiAgICAgIGNvbnN0IGNyZWF0ZU5ld0FwaU9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuY3JlYXRlTmV3RXh0ZXJuYWxBUEknKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjcmVhdGVOZXdBcGlPcHRpb24pXG5cbiAgICAgIC8vIEdldCB0aGUgY2FsbGJhY2sgZnJvbSB0aGUgbW9kYWwgY2FsbCBhbmQgaW52b2tlIGl0XG4gICAgICBjb25zdCBtb2RhbENhbGwgPSBtb2NrU2V0U2hvd0V4dGVybmFsS25vd2xlZGdlQVBJTW9kYWwubW9jay5jYWxsc1swXVswXVxuICAgICAgbW9kYWxDYWxsLm9uQ2FuY2VsQ2FsbGJhY2soKVxuXG4gICAgICBleHBlY3QobW9ja011dGF0ZUV4dGVybmFsS25vd2xlZGdlQXBpcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgZHJvcGRvd24gYWZ0ZXIgc2VsZWN0aW5nIGFuIEFQSScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQ2xpY2sgb24gdGhlIEFQSSBzZWxlY3RvciB0byBvcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCBhcGlTZWxlY3RvciA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQVBJIDEnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhcGlTZWxlY3RvcilcblxuICAgICAgLy8gRHJvcGRvd24gc2hvdWxkIGJlIG9wZW4gLSBBUEkgVVJMcyB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnaHR0cHM6Ly9hcGkxLmV4YW1wbGUuY29tJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gU2VsZWN0IHRoZSBzZWNvbmQgQVBJXG4gICAgICBjb25zdCBzZWNvbmRBcGkgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IEFQSSAyJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2Vjb25kQXBpKVxuXG4gICAgICAvLyBEcm9wZG93biBzaG91bGQgYmUgY2xvc2VkIC0gQVBJIFVSTHMgbm90IHZpc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2h0dHBzOi8vYXBpMS5leGFtcGxlLmNvbScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBkcm9wZG93biBvcGVuL2Nsb3NlIG9uIHNlbGVjdG9yIGNsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBDbGljayB0byBvcGVuXG4gICAgICBjb25zdCBhcGlTZWxlY3RvciA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQVBJIDEnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhcGlTZWxlY3RvcilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL2FwaTEuZXhhbXBsZS5jb20nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDbGljayBhZ2FpbiB0byBjbG9zZVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhcGlTZWxlY3RvcilcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2h0dHBzOi8vYXBpMS5leGFtcGxlLmNvbScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGNhbGxiYWNrIHN0YWJpbGl0eVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIG5hdkJhY2tIYW5kbGUgY2FsbGJhY2sgcmVmZXJlbmNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxFeHRlcm5hbEtub3dsZWRnZUJhc2VDcmVhdGUgb25Db25uZWN0PXt2aS5mbigpfSBsb2FkaW5nPXtmYWxzZX0gLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgY29uc3QgYmFja0J1dHRvbiA9IGJ1dHRvbnMuZmluZChidG4gPT4gYnRuLmNsYXNzTGlzdC5jb250YWlucygncm91bmRlZC1mdWxsJykpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGJhY2tCdXR0b24hKVxuXG4gICAgICBleHBlY3QobW9ja1JlcGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICByZXJlbmRlcig8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ3JlYXRlIG9uQ29ubmVjdD17dmkuZm4oKX0gbG9hZGluZz17ZmFsc2V9IC8+KVxuXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGJhY2tCdXR0b24hKVxuICAgICAgZXhwZWN0KG1vY2tSZXBsYWNlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVjcmVhdGUgaGFuZGxlcnMgb24gcHJvcCBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNvbm5lY3QxID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25Db25uZWN0MiA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ3JlYXRlIG9uQ29ubmVjdD17b25Db25uZWN0MX0gbG9hZGluZz17ZmFsc2V9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBGaWxsIGZvcm1cbiAgICAgIGNvbnN0IG5hbWVJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZU5hbWVQbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBrbm93bGVkZ2VJZElucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlSWRQbGFjZWhvbGRlcicpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QnIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoa25vd2xlZGdlSWRJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdrbm93bGVkZ2UnIH0gfSlcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBuZXcgY2FsbGJhY2tcbiAgICAgIHJlcmVuZGVyKDxFeHRlcm5hbEtub3dsZWRnZUJhc2VDcmVhdGUgb25Db25uZWN0PXtvbkNvbm5lY3QyfSBsb2FkaW5nPXtmYWxzZX0gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICAgIGV4cGVjdChjb25uZWN0QnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY29ubmVjdEJ1dHRvbiEpXG5cbiAgICAgIC8vIFNob3VsZCB1c2UgdGhlIG5ldyBjYWxsYmFja1xuICAgICAgZXhwZWN0KG9uQ29ubmVjdDEpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvbkNvbm5lY3QyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBlZGdlIGNhc2VzXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRlc2NyaXB0aW9uIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ29ubmVjdCA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ29ubmVjdCB9KVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKG5hbWVJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdUZXN0JyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGtub3dsZWRnZUlkSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAna25vd2xlZGdlJyB9IH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICAgIGV4cGVjdChjb25uZWN0QnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY29ubmVjdEJ1dHRvbiEpXG5cbiAgICAgIGV4cGVjdChvbkNvbm5lY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIG5hbWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3Qgc3BlY2lhbE5hbWUgPSAnVGVzdCA8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+IE5hbWUnXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogc3BlY2lhbE5hbWUgfSB9KVxuXG4gICAgICBleHBlY3QoKG5hbWVJbnB1dCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSkudG9CZShzcGVjaWFsTmFtZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGlucHV0IHZhbHVlcycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGNvbnN0IG5hbWVJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZU5hbWVQbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBsb25nTmFtZSA9ICdBJy5yZXBlYXQoMTAwMClcblxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShuYW1lSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiBsb25nTmFtZSB9IH0pXG5cbiAgICAgIGV4cGVjdCgobmFtZUlucHV0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKS50b0JlKGxvbmdOYW1lKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBzZXF1ZW50aWFsIHVwZGF0ZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuXG4gICAgICAvLyBSYXBpZCB1cGRhdGVzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspXG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogYE5hbWUgJHtpfWAgfSB9KVxuXG4gICAgICBleHBlY3QoKG5hbWVJbnB1dCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSkudG9CZSgnTmFtZSA5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBwcm92aWRlciB2YWx1ZSBhcyBleHRlcm5hbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgb25Db25uZWN0ID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25Db25uZWN0IH0pXG5cbiAgICAgIGNvbnN0IG5hbWVJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZU5hbWVQbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBrbm93bGVkZ2VJZElucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlSWRQbGFjZWhvbGRlcicpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QnIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoa25vd2xlZGdlSWRJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdrbm93bGVkZ2UnIH0gfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjb25uZWN0QnV0dG9uISlcblxuICAgICAgZXhwZWN0KG9uQ29ubmVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBwcm92aWRlcjogJ2V4dGVybmFsJyxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgbG9hZGluZyBzdGF0ZVxuICBkZXNjcmliZSgnTG9hZGluZyBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgbG9hZGluZyBzdGF0ZSB0byBjb25uZWN0IGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGxvYWRpbmc6IHRydWUgfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdoZW4gbm90IGxvYWRpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBsb2FkaW5nOiBmYWxzZSB9KVxuXG4gICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIFJldHJpZXZhbFNldHRpbmdzIGludGVncmF0aW9uXG4gIGRlc2NyaWJlKCdSZXRyaWV2YWxTZXR0aW5ncyBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBzY29yZSB0aHJlc2hvbGQgZW5hYmxlZCB3aGVuIHN3aXRjaCBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNvbm5lY3QgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNvbm5lY3QgfSlcblxuICAgICAgLy8gRmluZCBhbmQgY2xpY2sgdGhlIHN3aXRjaCBmb3Igc2NvcmUgdGhyZXNob2xkXG4gICAgICBjb25zdCBzd2l0Y2hlcyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBjb25zdCBzY29yZVRocmVzaG9sZFN3aXRjaCA9IHN3aXRjaGVzWzBdIC8vIFRoZSBzY29yZSB0aHJlc2hvbGQgc3dpdGNoXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjb3JlVGhyZXNob2xkU3dpdGNoKVxuXG4gICAgICAvLyBGaWxsIHJlcXVpcmVkIGZpZWxkc1xuICAgICAgY29uc3QgbmFtZUlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlTmFtZVBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGtub3dsZWRnZUlkSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VJZFBsYWNlaG9sZGVyJylcblxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShuYW1lSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShrbm93bGVkZ2VJZElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2tiLTEnIH0gfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRm9ybS5jb25uZWN0JykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGNvbm5lY3RCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjb25uZWN0QnV0dG9uISlcblxuICAgICAgZXhwZWN0KG9uQ29ubmVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBleHRlcm5hbF9yZXRyaWV2YWxfbW9kZWw6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiB0cnVlLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHJldHJpZXZhbCBzZXR0aW5ncyBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBTaG91bGQgc2hvdyB0aGUgcmV0cmlldmFsIHNldHRpbmdzIHNlY3Rpb24gdGl0bGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbFNldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIFNob3VsZCBzaG93IFRvcCBLIGFuZCBTY29yZSBUaHJlc2hvbGQgbGFiZWxzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwRGVidWcuZGF0YXNldENvbmZpZy50b3BfaycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwRGVidWcuZGF0YXNldENvbmZpZy5zY29yZV90aHJlc2hvbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRGlyZWN0IHVuaXQgdGVzdHMgZm9yIFJldHJpZXZhbFNldHRpbmdzIGNvbXBvbmVudCB0byBjb3ZlciBhbGwgYnJhbmNoZXNcbiAgZGVzY3JpYmUoJ1JldHJpZXZhbFNldHRpbmdzIENvbXBvbmVudCBEaXJlY3QgVGVzdHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBpc0luSGl0VGVzdGluZyBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXRyaWV2YWxTZXR0aW5nc1xuICAgICAgICAgIHRvcEs9ezR9XG4gICAgICAgICAgc2NvcmVUaHJlc2hvbGQ9ezAuNX1cbiAgICAgICAgICBzY29yZVRocmVzaG9sZEVuYWJsZWQ9e2ZhbHNlfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICBpc0luSGl0VGVzdGluZz17dHJ1ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEluIGhpdCB0ZXN0aW5nIG1vZGUsIHRoZSB0aXRsZSBzaG91bGQgbm90IGJlIHNob3duXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbFNldHRpbmdzJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggaXNJblJldHJpZXZhbFNldHRpbmcgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UmV0cmlldmFsU2V0dGluZ3NcbiAgICAgICAgICB0b3BLPXs0fVxuICAgICAgICAgIHNjb3JlVGhyZXNob2xkPXswLjV9XG4gICAgICAgICAgc2NvcmVUaHJlc2hvbGRFbmFibGVkPXtmYWxzZX1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgaXNJblJldHJpZXZhbFNldHRpbmc9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBJbiByZXRyaWV2YWwgc2V0dGluZyBtb2RlLCB0aGUgdGl0bGUgc2hvdWxkIG5vdCBiZSBzaG93blxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWxTZXR0aW5ncycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2l0aCBzY29yZV90aHJlc2hvbGRfZW5hYmxlZCB3aGVuIHN3aXRjaCBpcyB0b2dnbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJldHJpZXZhbFNldHRpbmdzXG4gICAgICAgICAgdG9wSz17NH1cbiAgICAgICAgICBzY29yZVRocmVzaG9sZD17MC41fVxuICAgICAgICAgIHNjb3JlVGhyZXNob2xkRW5hYmxlZD17ZmFsc2V9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gRmluZCBhbmQgY2xpY2sgdGhlIHN3aXRjaFxuICAgICAgY29uc3Qgc3dpdGNoZXMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdzd2l0Y2gnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzd2l0Y2hlc1swXSlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiB0cnVlIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aXRoIHRvcF9rIHdoZW4gdG9wIGsgdmFsdWUgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UmV0cmlldmFsU2V0dGluZ3NcbiAgICAgICAgICB0b3BLPXs0fVxuICAgICAgICAgIHNjb3JlVGhyZXNob2xkPXswLjV9XG4gICAgICAgICAgc2NvcmVUaHJlc2hvbGRFbmFibGVkPXtmYWxzZX1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBUaGUgVG9wS0l0ZW0gc2hvdWxkIHJlbmRlciBhbiBpbnB1dFxuICAgICAgY29uc3QgaW5wdXRzID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnc3BpbmJ1dHRvbicpXG4gICAgICBjb25zdCB0b3BLSW5wdXQgPSBpbnB1dHNbMF1cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UodG9wS0lucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJzgnIH0gfSlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IHRvcF9rOiA4IH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aXRoIHNjb3JlX3RocmVzaG9sZCB3aGVuIHRocmVzaG9sZCB2YWx1ZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXRyaWV2YWxTZXR0aW5nc1xuICAgICAgICAgIHRvcEs9ezR9XG4gICAgICAgICAgc2NvcmVUaHJlc2hvbGQ9ezAuNX1cbiAgICAgICAgICBzY29yZVRocmVzaG9sZEVuYWJsZWQ9e3RydWV9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gVGhlIFNjb3JlVGhyZXNob2xkSXRlbSBzaG91bGQgcmVuZGVyIGFuIGlucHV0XG4gICAgICBjb25zdCBpbnB1dHMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdzcGluYnV0dG9uJylcbiAgICAgIGNvbnN0IHNjb3JlVGhyZXNob2xkSW5wdXQgPSBpbnB1dHNbMV1cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2NvcmVUaHJlc2hvbGRJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICcwLjgnIH0gfSlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IHNjb3JlX3RocmVzaG9sZDogMC44IH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgY29tcGxldGUgZm9ybSBzdWJtaXNzaW9uIGZsb3dcbiAgZGVzY3JpYmUoJ0NvbXBsZXRlIEZvcm0gU3VibWlzc2lvbiBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc3VibWl0IGZvcm0gd2l0aCBhbGwgZGVmYXVsdCByZXRyaWV2YWwgc2V0dGluZ3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ29ubmVjdCA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ29ubmVjdCB9KVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lUGxhY2Vob2xkZXInKVxuICAgICAgY29uc3Qga25vd2xlZGdlSWRJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUlkUGxhY2Vob2xkZXInKVxuXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKG5hbWVJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdUZXN0IEtCJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGtub3dsZWRnZUlkSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAna2ItMScgfSB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbm5lY3RCdXR0b24hKVxuXG4gICAgICBleHBlY3Qob25Db25uZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIG5hbWU6ICdUZXN0IEtCJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX2lkOiAnYXBpLTEnLFxuICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfaWQ6ICdrYi0xJyxcbiAgICAgICAgZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICAgICAgdG9wX2s6IDQsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBwcm92aWRlcjogJ2V4dGVybmFsJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3VibWl0IGZvcm0gd2l0aCBtb2RpZmllZCByZXRyaWV2YWwgc2V0dGluZ3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ29ubmVjdCA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ29ubmVjdCB9KVxuXG4gICAgICAvLyBUb2dnbGUgc2NvcmUgdGhyZXNob2xkIHN3aXRjaFxuICAgICAgY29uc3Qgc3dpdGNoZXMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdzd2l0Y2gnKVxuICAgICAgY29uc3Qgc2NvcmVUaHJlc2hvbGRTd2l0Y2ggPSBzd2l0Y2hlc1swXVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY29yZVRocmVzaG9sZFN3aXRjaClcblxuICAgICAgLy8gRmlsbCByZXF1aXJlZCBmaWVsZHNcbiAgICAgIGNvbnN0IG5hbWVJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZU5hbWVQbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBrbm93bGVkZ2VJZElucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlSWRQbGFjZWhvbGRlcicpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobmFtZUlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ0N1c3RvbSBLQicgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShrbm93bGVkZ2VJZElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2N1c3RvbS1rYicgfSB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VGb3JtLmNvbm5lY3QnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgICBleHBlY3QoY29ubmVjdEJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5leHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbm5lY3RCdXR0b24hKVxuXG4gICAgICBleHBlY3Qob25Db25uZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIG5hbWU6ICdDdXN0b20gS0InLFxuICAgICAgICAgIGV4dGVybmFsX3JldHJpZXZhbF9tb2RlbDogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGFjY2Vzc2liaWxpdHlcbiAgZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGFjY2Vzc2libGUgYnV0dG9ucycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDMpIC8vIGJhY2ssIGNhbmNlbCwgY29ubmVjdFxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIGxpbmsgYXR0cmlidXRlcyBmb3IgZXh0ZXJuYWwgbGlua3MnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCBleHRlcm5hbExpbmsgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmNvbm5lY3RIZWxwZXIuaGVscGVyNCcpXG4gICAgICBleHBlY3QoZXh0ZXJuYWxMaW5rLnRhZ05hbWUpLnRvQmUoJ0EnKVxuICAgICAgZXhwZWN0KGV4dGVybmFsTGluaykudG9IYXZlQXR0cmlidXRlKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICAgIGV4cGVjdChleHRlcm5hbExpbmspLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgbGFiZWxzIGZvciBmb3JtIGlucHV0cycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIENoZWNrIGxhYmVscyBleGlzdFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VOYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmV4dGVybmFsS25vd2xlZGdlRGVzY3JpcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuZXh0ZXJuYWxLbm93bGVkZ2VJZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=