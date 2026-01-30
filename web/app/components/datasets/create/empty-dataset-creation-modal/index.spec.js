"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const datasets_1 = require("@/service/datasets");
const use_dataset_1 = require("@/service/knowledge/use-dataset");
const index_1 = require("./index");
// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));
// Mock createEmptyDataset API
vi.mock('@/service/datasets', () => ({
    createEmptyDataset: vi.fn(),
}));
// Mock useInvalidDatasetList hook
vi.mock('@/service/knowledge/use-dataset', () => ({
    useInvalidDatasetList: vi.fn(),
}));
// Mock ToastContext - need to mock both createContext and useContext from use-context-selector
const mockNotify = vi.fn();
vi.mock('use-context-selector', () => ({
    createContext: vi.fn(() => ({
        Provider: ({ children }) => children,
    })),
    useContext: vi.fn(() => ({ notify: mockNotify })),
}));
// Type cast mocked functions
const mockCreateEmptyDataset = datasets_1.createEmptyDataset;
const mockInvalidDatasetList = vi.fn();
const mockUseInvalidDatasetList = use_dataset_1.useInvalidDatasetList;
// Test data builder for props
const createDefaultProps = (overrides) => ({
    show: true,
    onHide: vi.fn(),
    ...overrides,
});
describe('EmptyDatasetCreationModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseInvalidDatasetList.mockReturnValue(mockInvalidDatasetList);
        mockCreateEmptyDataset.mockResolvedValue({
            id: 'dataset-123',
            name: 'Test Dataset',
        });
    });
    // ==========================================
    // Rendering Tests - Verify component renders correctly
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing when show is true', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check modal title is rendered
            expect(react_1.screen.getByText('datasetCreation.stepOne.modal.title')).toBeInTheDocument();
        });
        it('should render modal with correct elements', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.modal.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepOne.modal.tip')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepOne.modal.input')).toBeInTheDocument();
            expect(react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepOne.modal.cancelButton')).toBeInTheDocument();
        });
        it('should render input with empty value initially', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            expect(input.value).toBe('');
        });
        it('should not render modal content when show is false', () => {
            // Arrange
            const props = createDefaultProps({ show: false });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Modal should not be visible (check for absence of title)
            expect(react_1.screen.queryByText('datasetCreation.stepOne.modal.title')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing - Verify all prop variations work correctly
    // ==========================================
    describe('Props', () => {
        describe('show prop', () => {
            it('should show modal when show is true', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default show={true} onHide={vi.fn()}/>);
                // Assert
                expect(react_1.screen.getByText('datasetCreation.stepOne.modal.title')).toBeInTheDocument();
            });
            it('should hide modal when show is false', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default show={false} onHide={vi.fn()}/>);
                // Assert
                expect(react_1.screen.queryByText('datasetCreation.stepOne.modal.title')).not.toBeInTheDocument();
            });
            it('should toggle visibility when show prop changes', () => {
                // Arrange
                const onHide = vi.fn();
                const { rerender } = (0, react_1.render)(<index_1.default show={false} onHide={onHide}/>);
                // Act & Assert - Initially hidden
                expect(react_1.screen.queryByText('datasetCreation.stepOne.modal.title')).not.toBeInTheDocument();
                // Act & Assert - Show modal
                rerender(<index_1.default show={true} onHide={onHide}/>);
                expect(react_1.screen.getByText('datasetCreation.stepOne.modal.title')).toBeInTheDocument();
            });
        });
        describe('onHide prop', () => {
            it('should call onHide when cancel button is clicked', () => {
                // Arrange
                const mockOnHide = vi.fn();
                (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
                // Act
                const cancelButton = react_1.screen.getByText('datasetCreation.stepOne.modal.cancelButton');
                react_1.fireEvent.click(cancelButton);
                // Assert
                expect(mockOnHide).toHaveBeenCalledTimes(1);
            });
            it('should call onHide when close icon is clicked', async () => {
                // Arrange
                const mockOnHide = vi.fn();
                (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
                // Act - Wait for modal to be rendered, then find the close span
                // The close span is located in the modalHeader div, next to the title
                const titleElement = await react_1.screen.findByText('datasetCreation.stepOne.modal.title');
                const headerDiv = titleElement.parentElement;
                const closeButton = headerDiv?.querySelector('span');
                expect(closeButton).toBeInTheDocument();
                react_1.fireEvent.click(closeButton);
                // Assert
                expect(mockOnHide).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ==========================================
    // State Management - Test input state updates
    // ==========================================
    describe('State Management', () => {
        it('should update input value when user types', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'My Dataset' } });
            // Assert
            expect(input.value).toBe('My Dataset');
        });
        it('should persist input value when modal is hidden and shown again via rerender', () => {
            // Arrange
            const onHide = vi.fn();
            const { rerender } = (0, react_1.render)(<index_1.default show={true} onHide={onHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            // Act - Type in input
            react_1.fireEvent.change(input, { target: { value: 'Test Dataset' } });
            expect(input.value).toBe('Test Dataset');
            // Hide and show modal via rerender (component is not unmounted, state persists)
            rerender(<index_1.default show={false} onHide={onHide}/>);
            rerender(<index_1.default show={true} onHide={onHide}/>);
            // Assert - Input value persists because component state is preserved during rerender
            const newInput = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            expect(newInput.value).toBe('Test Dataset');
        });
        it('should handle consecutive input changes', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            // Act & Assert
            react_1.fireEvent.change(input, { target: { value: 'A' } });
            expect(input.value).toBe('A');
            react_1.fireEvent.change(input, { target: { value: 'AB' } });
            expect(input.value).toBe('AB');
            react_1.fireEvent.change(input, { target: { value: 'ABC' } });
            expect(input.value).toBe('ABC');
        });
    });
    // ==========================================
    // User Interactions - Test event handlers
    // ==========================================
    describe('User Interactions', () => {
        it('should submit form when confirm button is clicked with valid input', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Valid Dataset Name' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: 'Valid Dataset Name' });
            });
        });
        it('should show error notification when input is empty', async () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Click confirm without entering a name
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'datasetCreation.stepOne.modal.nameNotEmpty',
                });
            });
            expect(mockCreateEmptyDataset).not.toHaveBeenCalled();
        });
        it('should show error notification when input exceeds 40 characters', async () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Enter a name longer than 40 characters
            const longName = 'A'.repeat(41);
            react_1.fireEvent.change(input, { target: { value: longName } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'datasetCreation.stepOne.modal.nameLengthInvalid',
                });
            });
            expect(mockCreateEmptyDataset).not.toHaveBeenCalled();
        });
        it('should allow exactly 40 characters', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Enter exactly 40 characters
            const exactLengthName = 'A'.repeat(40);
            react_1.fireEvent.change(input, { target: { value: exactLengthName } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: exactLengthName });
            });
        });
        it('should close modal on cancel button click', () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const cancelButton = react_1.screen.getByText('datasetCreation.stepOne.modal.cancelButton');
            // Act
            react_1.fireEvent.click(cancelButton);
            // Assert
            expect(mockOnHide).toHaveBeenCalledTimes(1);
        });
    });
    // ==========================================
    // API Calls - Test API interactions
    // ==========================================
    describe('API Calls', () => {
        it('should call createEmptyDataset with correct parameters', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'New Dataset' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: 'New Dataset' });
            });
        });
        it('should call invalidDatasetList after successful creation', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Test Dataset' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockInvalidDatasetList).toHaveBeenCalled();
            });
        });
        it('should call onHide after successful creation', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Test Dataset' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockOnHide).toHaveBeenCalled();
            });
        });
        it('should show error notification on API failure', async () => {
            // Arrange
            mockCreateEmptyDataset.mockRejectedValue(new Error('API Error'));
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Test Dataset' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'datasetCreation.stepOne.modal.failed',
                });
            });
        });
        it('should not call onHide on API failure', async () => {
            // Arrange
            mockCreateEmptyDataset.mockRejectedValue(new Error('API Error'));
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Test Dataset' } });
            react_1.fireEvent.click(confirmButton);
            // Assert - Wait for API call to complete
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalled();
            });
            // onHide should not be called on failure
            expect(mockOnHide).not.toHaveBeenCalled();
        });
        it('should not invalidate dataset list on API failure', async () => {
            // Arrange
            mockCreateEmptyDataset.mockRejectedValue(new Error('API Error'));
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Test Dataset' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalled();
            });
            expect(mockInvalidDatasetList).not.toHaveBeenCalled();
        });
    });
    // ==========================================
    // Router Navigation - Test Next.js router
    // ==========================================
    describe('Router Navigation', () => {
        it('should navigate to dataset documents page after successful creation', async () => {
            // Arrange
            mockCreateEmptyDataset.mockResolvedValue({
                id: 'test-dataset-456',
                name: 'Test',
            });
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Test' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockPush).toHaveBeenCalledWith('/datasets/test-dataset-456/documents');
            });
        });
        it('should not navigate on validation error', async () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Click confirm with empty input
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalled();
            });
            expect(mockPush).not.toHaveBeenCalled();
        });
        it('should not navigate on API error', async () => {
            // Arrange
            mockCreateEmptyDataset.mockRejectedValue(new Error('API Error'));
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Test' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalled();
            });
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
    // ==========================================
    // Edge Cases - Test boundary conditions and error handling
    // ==========================================
    describe('Edge Cases', () => {
        it('should handle whitespace-only input as valid (component behavior)', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Enter whitespace only
            react_1.fireEvent.change(input, { target: { value: '   ' } });
            react_1.fireEvent.click(confirmButton);
            // Assert - Current implementation treats whitespace as valid input
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: '   ' });
            });
        });
        it('should handle special characters in input', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Test @#$% Dataset!' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: 'Test @#$% Dataset!' });
            });
        });
        it('should handle Unicode characters in input', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: '数据集测试 🚀' } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: '数据集测试 🚀' });
            });
        });
        it('should handle input at exactly 40 character boundary', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Test boundary: 40 characters is valid
            const name40Chars = 'A'.repeat(40);
            react_1.fireEvent.change(input, { target: { value: name40Chars } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: name40Chars });
            });
        });
        it('should reject input at 41 character boundary', async () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Test boundary: 41 characters is invalid
            const name41Chars = 'A'.repeat(41);
            react_1.fireEvent.change(input, { target: { value: name41Chars } });
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'datasetCreation.stepOne.modal.nameLengthInvalid',
                });
            });
            expect(mockCreateEmptyDataset).not.toHaveBeenCalled();
        });
        it('should handle rapid consecutive submits', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Rapid clicks
            react_1.fireEvent.change(input, { target: { value: 'Test' } });
            react_1.fireEvent.click(confirmButton);
            react_1.fireEvent.click(confirmButton);
            react_1.fireEvent.click(confirmButton);
            // Assert - API will be called multiple times (no debounce in current implementation)
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalled();
            });
        });
        it('should handle input with leading/trailing spaces', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: '  Dataset Name  ' } });
            react_1.fireEvent.click(confirmButton);
            // Assert - Current implementation does not trim spaces
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: '  Dataset Name  ' });
            });
        });
        it('should handle newline characters in input (browser strips newlines)', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Line1\nLine2' } });
            react_1.fireEvent.click(confirmButton);
            // Assert - HTML input elements strip newline characters (expected browser behavior)
            await (0, react_1.waitFor)(() => {
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: 'Line1Line2' });
            });
        });
    });
    // ==========================================
    // Validation Tests - Test input validation
    // ==========================================
    describe('Validation', () => {
        it('should not submit when input is empty string', async () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.click(confirmButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'datasetCreation.stepOne.modal.nameNotEmpty',
                });
            });
        });
        it('should validate length before calling API', async () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'A'.repeat(50) } });
            react_1.fireEvent.click(confirmButton);
            // Assert - Should show error before API call
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'datasetCreation.stepOne.modal.nameLengthInvalid',
                });
            });
            expect(mockCreateEmptyDataset).not.toHaveBeenCalled();
        });
        it('should validate empty string before length check', async () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act - Don't enter anything
            react_1.fireEvent.click(confirmButton);
            // Assert - Should show empty error, not length error
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'datasetCreation.stepOne.modal.nameNotEmpty',
                });
            });
        });
    });
    // ==========================================
    // Integration Tests - Test complete flows
    // ==========================================
    describe('Integration', () => {
        it('should complete full successful creation flow', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            mockCreateEmptyDataset.mockResolvedValue({
                id: 'new-id-789',
                name: 'Complete Flow Test',
            });
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Complete Flow Test' } });
            react_1.fireEvent.click(confirmButton);
            // Assert - Verify complete flow
            await (0, react_1.waitFor)(() => {
                // 1. API called
                expect(mockCreateEmptyDataset).toHaveBeenCalledWith({ name: 'Complete Flow Test' });
                // 2. Dataset list invalidated
                expect(mockInvalidDatasetList).toHaveBeenCalled();
                // 3. Modal closed
                expect(mockOnHide).toHaveBeenCalled();
                // 4. Navigation happened
                expect(mockPush).toHaveBeenCalledWith('/datasets/new-id-789/documents');
            });
        });
        it('should handle error flow correctly', async () => {
            // Arrange
            const mockOnHide = vi.fn();
            mockCreateEmptyDataset.mockRejectedValue(new Error('Server Error'));
            (0, react_1.render)(<index_1.default show={true} onHide={mockOnHide}/>);
            const input = react_1.screen.getByPlaceholderText('datasetCreation.stepOne.modal.placeholder');
            const confirmButton = react_1.screen.getByText('datasetCreation.stepOne.modal.confirmButton');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'Error Test' } });
            react_1.fireEvent.click(confirmButton);
            // Assert - Verify error handling
            await (0, react_1.waitFor)(() => {
                // 1. API was called
                expect(mockCreateEmptyDataset).toHaveBeenCalled();
                // 2. Error notification shown
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'datasetCreation.stepOne.modal.failed',
                });
            });
            // 3. These should NOT happen on error
            expect(mockInvalidDatasetList).not.toHaveBeenCalled();
            expect(mockOnHide).not.toHaveBeenCalled();
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixpREFBdUQ7QUFDdkQsaUVBQXVFO0FBQ3ZFLG1DQUErQztBQUUvQyxzQkFBc0I7QUFDdEIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNoQixJQUFJLEVBQUUsUUFBUTtLQUNmLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILDhCQUE4QjtBQUM5QixFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbkMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUM1QixDQUFDLENBQUMsQ0FBQTtBQUVILGtDQUFrQztBQUNsQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQscUJBQXFCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUMvQixDQUFDLENBQUMsQ0FBQTtBQUVILCtGQUErRjtBQUMvRixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUIsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDMUIsUUFBUSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQWlDLEVBQUUsRUFBRSxDQUFDLFFBQVE7S0FDcEUsQ0FBQyxDQUFDO0lBQ0gsVUFBVSxFQUFFLEVBQUUsQ0FB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QUNOLGlCQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDNUQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFOUIsaUNBQWlDO1lBQ2pDLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixvQkFBb0I7Z0JBQ3BCLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7Z0JBQ2pELDhCQUE4QjtnQkFDOUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO29CQUN0QyxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsc0NBQXNDO2lCQUNoRCxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtZQUVGLHNDQUFzQztZQUN0QyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtZQUNyRCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ3pDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9ja2VkRnVuY3Rpb24gfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY3JlYXRlRW1wdHlEYXRhc2V0IH0gZnJvbSAnQC9zZXJ2aWNlL2RhdGFzZXRzJ1xuaW1wb3J0IHsgdXNlSW52YWxpZERhdGFzZXRMaXN0IH0gZnJvbSAnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZGF0YXNldCdcbmltcG9ydCBFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIGZyb20gJy4vaW5kZXgnXG5cbi8vIE1vY2sgTmV4dC5qcyByb3V0ZXJcbmNvbnN0IG1vY2tQdXNoID0gdmkuZm4oKVxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUm91dGVyOiAoKSA9PiAoe1xuICAgIHB1c2g6IG1vY2tQdXNoLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGNyZWF0ZUVtcHR5RGF0YXNldCBBUElcbnZpLm1vY2soJ0Avc2VydmljZS9kYXRhc2V0cycsICgpID0+ICh7XG4gIGNyZWF0ZUVtcHR5RGF0YXNldDogdmkuZm4oKSxcbn0pKVxuXG4vLyBNb2NrIHVzZUludmFsaWREYXRhc2V0TGlzdCBob29rXG52aS5tb2NrKCdAL3NlcnZpY2Uva25vd2xlZGdlL3VzZS1kYXRhc2V0JywgKCkgPT4gKHtcbiAgdXNlSW52YWxpZERhdGFzZXRMaXN0OiB2aS5mbigpLFxufSkpXG5cbi8vIE1vY2sgVG9hc3RDb250ZXh0IC0gbmVlZCB0byBtb2NrIGJvdGggY3JlYXRlQ29udGV4dCBhbmQgdXNlQ29udGV4dCBmcm9tIHVzZS1jb250ZXh0LXNlbGVjdG9yXG5jb25zdCBtb2NrTm90aWZ5ID0gdmkuZm4oKVxudmkubW9jaygndXNlLWNvbnRleHQtc2VsZWN0b3InLCAoKSA9PiAoe1xuICBjcmVhdGVDb250ZXh0OiB2aS5mbigoKSA9PiAoe1xuICAgIFByb3ZpZGVyOiAoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfSkgPT4gY2hpbGRyZW4sXG4gIH0pKSxcbiAgdXNlQ29udGV4dDogdmkuZm4oKCkgPT4gKHsgbm90aWZ5OiBtb2NrTm90aWZ5IH0pKSxcbn0pKVxuXG4vLyBUeXBlIGNhc3QgbW9ja2VkIGZ1bmN0aW9uc1xuY29uc3QgbW9ja0NyZWF0ZUVtcHR5RGF0YXNldCA9IGNyZWF0ZUVtcHR5RGF0YXNldCBhcyBNb2NrZWRGdW5jdGlvbjx0eXBlb2YgY3JlYXRlRW1wdHlEYXRhc2V0PlxuY29uc3QgbW9ja0ludmFsaWREYXRhc2V0TGlzdCA9IHZpLmZuKClcbmNvbnN0IG1vY2tVc2VJbnZhbGlkRGF0YXNldExpc3QgPSB1c2VJbnZhbGlkRGF0YXNldExpc3QgYXMgTW9ja2VkRnVuY3Rpb248dHlwZW9mIHVzZUludmFsaWREYXRhc2V0TGlzdD5cblxuLy8gVGVzdCBkYXRhIGJ1aWxkZXIgZm9yIHByb3BzXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAob3ZlcnJpZGVzPzogUGFydGlhbDx7IHNob3c6IGJvb2xlYW4sIG9uSGlkZTogKCkgPT4gdm9pZCB9PikgPT4gKHtcbiAgc2hvdzogdHJ1ZSxcbiAgb25IaWRlOiB2aS5mbigpLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5kZXNjcmliZSgnRW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1VzZUludmFsaWREYXRhc2V0TGlzdC5tb2NrUmV0dXJuVmFsdWUobW9ja0ludmFsaWREYXRhc2V0TGlzdClcbiAgICBtb2NrQ3JlYXRlRW1wdHlEYXRhc2V0Lm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgIGlkOiAnZGF0YXNldC0xMjMnLFxuICAgICAgbmFtZTogJ1Rlc3QgRGF0YXNldCcsXG4gICAgfSBhcyBSZXR1cm5UeXBlPHR5cGVvZiBjcmVhdGVFbXB0eURhdGFzZXQ+IGV4dGVuZHMgUHJvbWlzZTxpbmZlciBUPiA/IFQgOiBuZXZlcilcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzIC0gVmVyaWZ5IGNvbXBvbmVudCByZW5kZXJzIGNvcnJlY3RseVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nIHdoZW4gc2hvdyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayBtb2RhbCB0aXRsZSBpcyByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgd2l0aCBjb3JyZWN0IGVsZW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwudGlwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5pbnB1dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5wbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuY29uZmlybUJ1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuY2FuY2VsQnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaW5wdXQgd2l0aCBlbXB0eSB2YWx1ZSBpbml0aWFsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJykgYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgZXhwZWN0KGlucHV0LnZhbHVlKS50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgbW9kYWwgY29udGVudCB3aGVuIHNob3cgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHNob3c6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE1vZGFsIHNob3VsZCBub3QgYmUgdmlzaWJsZSAoY2hlY2sgZm9yIGFic2VuY2Ugb2YgdGl0bGUpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC50aXRsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmcgLSBWZXJpZnkgYWxsIHByb3AgdmFyaWF0aW9ucyB3b3JrIGNvcnJlY3RseVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdzaG93IHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgbW9kYWwgd2hlbiBzaG93IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhpZGUgbW9kYWwgd2hlbiBzaG93IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXtmYWxzZX0gb25IaWRlPXt2aS5mbigpfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwudGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiBzaG93IHByb3AgY2hhbmdlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXtmYWxzZX0gb25IaWRlPXtvbkhpZGV9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAmIEFzc2VydCAtIEluaXRpYWxseSBoaWRkZW5cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwudGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgICAvLyBBY3QgJiBBc3NlcnQgLSBTaG93IG1vZGFsXG4gICAgICAgIHJlcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17b25IaWRlfSAvPilcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvbkhpZGUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkhpZGUgd2hlbiBjYW5jZWwgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNhbmNlbEJ1dHRvbicpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhjYW5jZWxCdXR0b24pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25IaWRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkhpZGUgd2hlbiBjbG9zZSBpY29uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gV2FpdCBmb3IgbW9kYWwgdG8gYmUgcmVuZGVyZWQsIHRoZW4gZmluZCB0aGUgY2xvc2Ugc3BhblxuICAgICAgICAvLyBUaGUgY2xvc2Ugc3BhbiBpcyBsb2NhdGVkIGluIHRoZSBtb2RhbEhlYWRlciBkaXYsIG5leHQgdG8gdGhlIHRpdGxlXG4gICAgICAgIGNvbnN0IHRpdGxlRWxlbWVudCA9IGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC50aXRsZScpXG4gICAgICAgIGNvbnN0IGhlYWRlckRpdiA9IHRpdGxlRWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gaGVhZGVyRGl2Py5xdWVyeVNlbGVjdG9yKCdzcGFuJylcblxuICAgICAgICBleHBlY3QoY2xvc2VCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlQnV0dG9uISlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IC0gVGVzdCBpbnB1dCBzdGF0ZSB1cGRhdGVzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBpbnB1dCB2YWx1ZSB3aGVuIHVzZXIgdHlwZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5wbGFjZWhvbGRlcicpIGFzIEhUTUxJbnB1dEVsZW1lbnRcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ015IERhdGFzZXQnIH0gfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaW5wdXQudmFsdWUpLnRvQmUoJ015IERhdGFzZXQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBlcnNpc3QgaW5wdXQgdmFsdWUgd2hlbiBtb2RhbCBpcyBoaWRkZW4gYW5kIHNob3duIGFnYWluIHZpYSByZXJlbmRlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uSGlkZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXt0cnVlfSBvbkhpZGU9e29uSGlkZX0gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5cbiAgICAgIC8vIEFjdCAtIFR5cGUgaW4gaW5wdXRcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCBEYXRhc2V0JyB9IH0pXG4gICAgICBleHBlY3QoaW5wdXQudmFsdWUpLnRvQmUoJ1Rlc3QgRGF0YXNldCcpXG5cbiAgICAgIC8vIEhpZGUgYW5kIHNob3cgbW9kYWwgdmlhIHJlcmVuZGVyIChjb21wb25lbnQgaXMgbm90IHVubW91bnRlZCwgc3RhdGUgcGVyc2lzdHMpXG4gICAgICByZXJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXtmYWxzZX0gb25IaWRlPXtvbkhpZGV9IC8+KVxuICAgICAgcmVyZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgc2hvdz17dHJ1ZX0gb25IaWRlPXtvbkhpZGV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbnB1dCB2YWx1ZSBwZXJzaXN0cyBiZWNhdXNlIGNvbXBvbmVudCBzdGF0ZSBpcyBwcmVzZXJ2ZWQgZHVyaW5nIHJlcmVuZGVyXG4gICAgICBjb25zdCBuZXdJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKSBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICBleHBlY3QobmV3SW5wdXQudmFsdWUpLnRvQmUoJ1Rlc3QgRGF0YXNldCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbnNlY3V0aXZlIGlucHV0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5wbGFjZWhvbGRlcicpIGFzIEhUTUxJbnB1dEVsZW1lbnRcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ0EnIH0gfSlcbiAgICAgIGV4cGVjdChpbnB1dC52YWx1ZSkudG9CZSgnQScpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnQUInIH0gfSlcbiAgICAgIGV4cGVjdChpbnB1dC52YWx1ZSkudG9CZSgnQUInKVxuXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ0FCQycgfSB9KVxuICAgICAgZXhwZWN0KGlucHV0LnZhbHVlKS50b0JlKCdBQkMnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIC0gVGVzdCBldmVudCBoYW5kbGVyc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc3VibWl0IGZvcm0gd2hlbiBjb25maXJtIGJ1dHRvbiBpcyBjbGlja2VkIHdpdGggdmFsaWQgaW5wdXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25IaWRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVmFsaWQgRGF0YXNldCBOYW1lJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVFbXB0eURhdGFzZXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgbmFtZTogJ1ZhbGlkIERhdGFzZXQgTmFtZScgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBub3RpZmljYXRpb24gd2hlbiBpbnB1dCBpcyBlbXB0eScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBjb25maXJtIHdpdGhvdXQgZW50ZXJpbmcgYSBuYW1lXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5uYW1lTm90RW1wdHknLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChtb2NrQ3JlYXRlRW1wdHlEYXRhc2V0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBub3RpZmljYXRpb24gd2hlbiBpbnB1dCBleGNlZWRzIDQwIGNoYXJhY3RlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5wbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuY29uZmlybUJ1dHRvbicpXG5cbiAgICAgIC8vIEFjdCAtIEVudGVyIGEgbmFtZSBsb25nZXIgdGhhbiA0MCBjaGFyYWN0ZXJzXG4gICAgICBjb25zdCBsb25nTmFtZSA9ICdBJy5yZXBlYXQoNDEpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogbG9uZ05hbWUgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwubmFtZUxlbmd0aEludmFsaWQnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChtb2NrQ3JlYXRlRW1wdHlEYXRhc2V0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgZXhhY3RseSA0MCBjaGFyYWN0ZXJzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXt0cnVlfSBvbkhpZGU9e21vY2tPbkhpZGV9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0IC0gRW50ZXIgZXhhY3RseSA0MCBjaGFyYWN0ZXJzXG4gICAgICBjb25zdCBleGFjdExlbmd0aE5hbWUgPSAnQScucmVwZWF0KDQwKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6IGV4YWN0TGVuZ3RoTmFtZSB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVFbXB0eURhdGFzZXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgbmFtZTogZXhhY3RMZW5ndGhOYW1lIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIG1vZGFsIG9uIGNhbmNlbCBidXR0b24gY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25IaWRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG4gICAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jYW5jZWxCdXR0b24nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhjYW5jZWxCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFQSSBDYWxscyAtIFRlc3QgQVBJIGludGVyYWN0aW9uc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FQSSBDYWxscycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgY3JlYXRlRW1wdHlEYXRhc2V0IHdpdGggY29ycmVjdCBwYXJhbWV0ZXJzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXt0cnVlfSBvbkhpZGU9e21vY2tPbkhpZGV9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ05ldyBEYXRhc2V0JyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVFbXB0eURhdGFzZXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgbmFtZTogJ05ldyBEYXRhc2V0JyB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGludmFsaWREYXRhc2V0TGlzdCBhZnRlciBzdWNjZXNzZnVsIGNyZWF0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXt0cnVlfSBvbkhpZGU9e21vY2tPbkhpZGV9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QgRGF0YXNldCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW52YWxpZERhdGFzZXRMaXN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkhpZGUgYWZ0ZXIgc3VjY2Vzc2Z1bCBjcmVhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkhpZGUgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgc2hvdz17dHJ1ZX0gb25IaWRlPXttb2NrT25IaWRlfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5wbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuY29uZmlybUJ1dHRvbicpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdUZXN0IERhdGFzZXQnIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja09uSGlkZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3Igbm90aWZpY2F0aW9uIG9uIEFQSSBmYWlsdXJlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0NyZWF0ZUVtcHR5RGF0YXNldC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0FQSSBFcnJvcicpKVxuICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXt0cnVlfSBvbkhpZGU9e21vY2tPbkhpZGV9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QgRGF0YXNldCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuZmFpbGVkJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25IaWRlIG9uIEFQSSBmYWlsdXJlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0NyZWF0ZUVtcHR5RGF0YXNldC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0FQSSBFcnJvcicpKVxuICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXt0cnVlfSBvbkhpZGU9e21vY2tPbkhpZGV9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QgRGF0YXNldCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIFdhaXQgZm9yIEFQSSBjYWxsIHRvIGNvbXBsZXRlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVFbXB0eURhdGFzZXQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICAgIC8vIG9uSGlkZSBzaG91bGQgbm90IGJlIGNhbGxlZCBvbiBmYWlsdXJlXG4gICAgICBleHBlY3QobW9ja09uSGlkZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBpbnZhbGlkYXRlIGRhdGFzZXQgbGlzdCBvbiBBUEkgZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tDcmVhdGVFbXB0eURhdGFzZXQubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdBUEkgRXJyb3InKSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QgRGF0YXNldCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgICBleHBlY3QobW9ja0ludmFsaWREYXRhc2V0TGlzdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJvdXRlciBOYXZpZ2F0aW9uIC0gVGVzdCBOZXh0LmpzIHJvdXRlclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JvdXRlciBOYXZpZ2F0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbmF2aWdhdGUgdG8gZGF0YXNldCBkb2N1bWVudHMgcGFnZSBhZnRlciBzdWNjZXNzZnVsIGNyZWF0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0NyZWF0ZUVtcHR5RGF0YXNldC5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgIGlkOiAndGVzdC1kYXRhc2V0LTQ1NicsXG4gICAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgIH0gYXMgUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlRW1wdHlEYXRhc2V0PiBleHRlbmRzIFByb21pc2U8aW5mZXIgVD4gPyBUIDogbmV2ZXIpXG4gICAgICBjb25zdCBtb2NrT25IaWRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrUHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy90ZXN0LWRhdGFzZXQtNDU2L2RvY3VtZW50cycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBuYXZpZ2F0ZSBvbiB2YWxpZGF0aW9uIGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuY29uZmlybUJ1dHRvbicpXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIGNvbmZpcm0gd2l0aCBlbXB0eSBpbnB1dFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgICBleHBlY3QobW9ja1B1c2gpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgbmF2aWdhdGUgb24gQVBJIGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0NyZWF0ZUVtcHR5RGF0YXNldC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0FQSSBFcnJvcicpKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgICBleHBlY3QobW9ja1B1c2gpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIC0gVGVzdCBib3VuZGFyeSBjb25kaXRpb25zIGFuZCBlcnJvciBoYW5kbGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgd2hpdGVzcGFjZS1vbmx5IGlucHV0IGFzIHZhbGlkIChjb21wb25lbnQgYmVoYXZpb3IpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXt0cnVlfSBvbkhpZGU9e21vY2tPbkhpZGV9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0IC0gRW50ZXIgd2hpdGVzcGFjZSBvbmx5XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJyAgICcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIEN1cnJlbnQgaW1wbGVtZW50YXRpb24gdHJlYXRzIHdoaXRlc3BhY2UgYXMgdmFsaWQgaW5wdXRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZUVtcHR5RGF0YXNldCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBuYW1lOiAnICAgJyB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGlucHV0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCBzaG93PXt0cnVlfSBvbkhpZGU9e21vY2tPbkhpZGV9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ1Rlc3QgQCMkJSBEYXRhc2V0IScgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlRW1wdHlEYXRhc2V0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IG5hbWU6ICdUZXN0IEAjJCUgRGF0YXNldCEnIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBVbmljb2RlIGNoYXJhY3RlcnMgaW4gaW5wdXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25IaWRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAn5pWw5o2u6ZuG5rWL6K+VIPCfmoAnIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZUVtcHR5RGF0YXNldCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBuYW1lOiAn5pWw5o2u6ZuG5rWL6K+VIPCfmoAnIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBpbnB1dCBhdCBleGFjdGx5IDQwIGNoYXJhY3RlciBib3VuZGFyeScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkhpZGUgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgc2hvdz17dHJ1ZX0gb25IaWRlPXttb2NrT25IaWRlfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5wbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuY29uZmlybUJ1dHRvbicpXG5cbiAgICAgIC8vIEFjdCAtIFRlc3QgYm91bmRhcnk6IDQwIGNoYXJhY3RlcnMgaXMgdmFsaWRcbiAgICAgIGNvbnN0IG5hbWU0MENoYXJzID0gJ0EnLnJlcGVhdCg0MClcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiBuYW1lNDBDaGFycyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVFbXB0eURhdGFzZXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgbmFtZTogbmFtZTQwQ2hhcnMgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVqZWN0IGlucHV0IGF0IDQxIGNoYXJhY3RlciBib3VuZGFyeScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLnBsYWNlaG9sZGVyJylcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0IC0gVGVzdCBib3VuZGFyeTogNDEgY2hhcmFjdGVycyBpcyBpbnZhbGlkXG4gICAgICBjb25zdCBuYW1lNDFDaGFycyA9ICdBJy5yZXBlYXQoNDEpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogbmFtZTQxQ2hhcnMgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwubmFtZUxlbmd0aEludmFsaWQnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChtb2NrQ3JlYXRlRW1wdHlEYXRhc2V0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIGNvbnNlY3V0aXZlIHN1Ym1pdHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25IaWRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3QgLSBSYXBpZCBjbGlja3NcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBBUEkgd2lsbCBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMgKG5vIGRlYm91bmNlIGluIGN1cnJlbnQgaW1wbGVtZW50YXRpb24pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVFbXB0eURhdGFzZXQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW5wdXQgd2l0aCBsZWFkaW5nL3RyYWlsaW5nIHNwYWNlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkhpZGUgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgc2hvdz17dHJ1ZX0gb25IaWRlPXttb2NrT25IaWRlfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5wbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuY29uZmlybUJ1dHRvbicpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICcgIERhdGFzZXQgTmFtZSAgJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ3VycmVudCBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCB0cmltIHNwYWNlc1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlRW1wdHlEYXRhc2V0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IG5hbWU6ICcgIERhdGFzZXQgTmFtZSAgJyB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbmV3bGluZSBjaGFyYWN0ZXJzIGluIGlucHV0IChicm93c2VyIHN0cmlwcyBuZXdsaW5lcyknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25IaWRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnTGluZTFcXG5MaW5lMicgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIEhUTUwgaW5wdXQgZWxlbWVudHMgc3RyaXAgbmV3bGluZSBjaGFyYWN0ZXJzIChleHBlY3RlZCBicm93c2VyIGJlaGF2aW9yKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlRW1wdHlEYXRhc2V0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IG5hbWU6ICdMaW5lMUxpbmUyJyB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBWYWxpZGF0aW9uIFRlc3RzIC0gVGVzdCBpbnB1dCB2YWxpZGF0aW9uXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVmFsaWRhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCBzdWJtaXQgd2hlbiBpbnB1dCBpcyBlbXB0eSBzdHJpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5jb25maXJtQnV0dG9uJylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5uYW1lTm90RW1wdHknLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBsZW5ndGggYmVmb3JlIGNhbGxpbmcgQVBJJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnQScucmVwZWF0KDUwKSB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgZXJyb3IgYmVmb3JlIEFQSSBjYWxsXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5uYW1lTGVuZ3RoSW52YWxpZCcsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG1vY2tDcmVhdGVFbXB0eURhdGFzZXQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBlbXB0eSBzdHJpbmcgYmVmb3JlIGxlbmd0aCBjaGVjaycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8RW1wdHlEYXRhc2V0Q3JlYXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3QgLSBEb24ndCBlbnRlciBhbnl0aGluZ1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzaG93IGVtcHR5IGVycm9yLCBub3QgbGVuZ3RoIGVycm9yXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5uYW1lTm90RW1wdHknLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0cyAtIFRlc3QgY29tcGxldGUgZmxvd3NcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgc3VjY2Vzc2Z1bCBjcmVhdGlvbiBmbG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uSGlkZSA9IHZpLmZuKClcbiAgICAgIG1vY2tDcmVhdGVFbXB0eURhdGFzZXQubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICBpZDogJ25ldy1pZC03ODknLFxuICAgICAgICBuYW1lOiAnQ29tcGxldGUgRmxvdyBUZXN0JyxcbiAgICAgIH0gYXMgUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlRW1wdHlEYXRhc2V0PiBleHRlbmRzIFByb21pc2U8aW5mZXIgVD4gPyBUIDogbmV2ZXIpXG4gICAgICByZW5kZXIoPEVtcHR5RGF0YXNldENyZWF0aW9uTW9kYWwgc2hvdz17dHJ1ZX0gb25IaWRlPXttb2NrT25IaWRlfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5tb2RhbC5wbGFjZWhvbGRlcicpXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuY29uZmlybUJ1dHRvbicpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdDb21wbGV0ZSBGbG93IFRlc3QnIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBWZXJpZnkgY29tcGxldGUgZmxvd1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vIDEuIEFQSSBjYWxsZWRcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVFbXB0eURhdGFzZXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgbmFtZTogJ0NvbXBsZXRlIEZsb3cgVGVzdCcgfSlcbiAgICAgICAgLy8gMi4gRGF0YXNldCBsaXN0IGludmFsaWRhdGVkXG4gICAgICAgIGV4cGVjdChtb2NrSW52YWxpZERhdGFzZXRMaXN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgLy8gMy4gTW9kYWwgY2xvc2VkXG4gICAgICAgIGV4cGVjdChtb2NrT25IaWRlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgLy8gNC4gTmF2aWdhdGlvbiBoYXBwZW5lZFxuICAgICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvbmV3LWlkLTc4OS9kb2N1bWVudHMnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZXJyb3IgZmxvdyBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25IaWRlID0gdmkuZm4oKVxuICAgICAgbW9ja0NyZWF0ZUVtcHR5RGF0YXNldC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ1NlcnZlciBFcnJvcicpKVxuICAgICAgcmVuZGVyKDxFbXB0eURhdGFzZXRDcmVhdGlvbk1vZGFsIHNob3c9e3RydWV9IG9uSGlkZT17bW9ja09uSGlkZX0gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwucGxhY2Vob2xkZXInKVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm1vZGFsLmNvbmZpcm1CdXR0b24nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnRXJyb3IgVGVzdCcgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIFZlcmlmeSBlcnJvciBoYW5kbGluZ1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vIDEuIEFQSSB3YXMgY2FsbGVkXG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlRW1wdHlEYXRhc2V0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgLy8gMi4gRXJyb3Igbm90aWZpY2F0aW9uIHNob3duXG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubW9kYWwuZmFpbGVkJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIDMuIFRoZXNlIHNob3VsZCBOT1QgaGFwcGVuIG9uIGVycm9yXG4gICAgICBleHBlY3QobW9ja0ludmFsaWREYXRhc2V0TGlzdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG1vY2tPbkhpZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrUHVzaCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19