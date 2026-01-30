"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
// Mock ToastContext - required to verify notifications
const mockNotify = vi.fn();
vi.mock('use-context-selector', async (importOriginal) => ({
    ...await importOriginal(),
    useContext: () => ({ notify: mockNotify }),
}));
// Mock document service hooks - required to avoid real API calls
const mockEnableDocument = vi.fn();
const mockDisableDocument = vi.fn();
const mockDeleteDocument = vi.fn();
vi.mock('@/service/knowledge/use-document', () => ({
    useDocumentEnable: () => ({ mutateAsync: mockEnableDocument }),
    useDocumentDisable: () => ({ mutateAsync: mockDisableDocument }),
    useDocumentDelete: () => ({ mutateAsync: mockDeleteDocument }),
}));
// Mock useDebounceFn to execute immediately for testing
vi.mock('ahooks', async (importOriginal) => ({
    ...await importOriginal(),
    useDebounceFn: (fn) => ({ run: fn }),
}));
// Test utilities
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});
const renderWithProviders = (ui) => {
    const queryClient = createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
      {ui}
    </react_query_1.QueryClientProvider>);
};
// Factory functions for test data
const createDetailProps = (overrides = {}) => ({
    enabled: false,
    archived: false,
    id: 'doc-123',
    ...overrides,
});
describe('StatusItem', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockEnableDocument.mockResolvedValue({ result: 'success' });
        mockDisableDocument.mockResolvedValue({ result: 'success' });
        mockDeleteDocument.mockResolvedValue({ result: 'success' });
    });
    // ==================== Rendering Tests ====================
    // Test basic rendering with different status values
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="available"/>);
            // Assert - check indicator element exists (real Indicator component)
            const indicator = react_1.screen.getByTestId('status-indicator');
            expect(indicator).toBeInTheDocument();
        });
        it.each([
            ['queuing', 'bg-components-badge-status-light-warning-bg'],
            ['indexing', 'bg-components-badge-status-light-normal-bg'],
            ['paused', 'bg-components-badge-status-light-warning-bg'],
            ['error', 'bg-components-badge-status-light-error-bg'],
            ['available', 'bg-components-badge-status-light-success-bg'],
            ['enabled', 'bg-components-badge-status-light-success-bg'],
            ['disabled', 'bg-components-badge-status-light-disabled-bg'],
            ['archived', 'bg-components-badge-status-light-disabled-bg'],
        ])('should render status "%s" with correct indicator background', (status, expectedBg) => {
            // Arrange & Act
            renderWithProviders(<index_1.default status={status}/>);
            // Assert
            const indicator = react_1.screen.getByTestId('status-indicator');
            expect(indicator).toHaveClass(expectedBg);
        });
        it('should render status text from translation', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="available"/>);
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.list.status.available')).toBeInTheDocument();
        });
        it('should handle case-insensitive status', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status={'AVAILABLE'}/>);
            // Assert
            const indicator = react_1.screen.getByTestId('status-indicator');
            expect(indicator).toHaveClass('bg-components-badge-status-light-success-bg');
        });
    });
    // ==================== Props Testing ====================
    // Test all prop variations and combinations
    describe('Props', () => {
        // reverse prop tests
        describe('reverse prop', () => {
            it('should apply default layout when reverse is false', () => {
                // Arrange & Act
                const { container } = renderWithProviders(<index_1.default status="available" reverse={false}/>);
                // Assert
                const wrapper = container.firstChild;
                expect(wrapper).not.toHaveClass('flex-row-reverse');
            });
            it('should apply reversed layout when reverse is true', () => {
                // Arrange & Act
                const { container } = renderWithProviders(<index_1.default status="available" reverse/>);
                // Assert
                const wrapper = container.firstChild;
                expect(wrapper).toHaveClass('flex-row-reverse');
            });
            it('should apply ml-2 to indicator when reversed', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" reverse/>);
                // Assert
                const indicator = react_1.screen.getByTestId('status-indicator');
                expect(indicator).toHaveClass('ml-2');
            });
            it('should apply mr-2 to indicator when not reversed', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" reverse={false}/>);
                // Assert
                const indicator = react_1.screen.getByTestId('status-indicator');
                expect(indicator).toHaveClass('mr-2');
            });
        });
        // scene prop tests
        describe('scene prop', () => {
            it('should not render switch in list scene', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" scene="list" detail={createDetailProps()}/>);
                // Assert - Switch renders as a button element
                expect(react_1.screen.queryByRole('switch')).not.toBeInTheDocument();
            });
            it('should render switch in detail scene', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" scene="detail" detail={createDetailProps()}/>);
                // Assert
                expect(react_1.screen.getByRole('switch')).toBeInTheDocument();
            });
            it('should default to list scene', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" detail={createDetailProps()}/>);
                // Assert
                expect(react_1.screen.queryByRole('switch')).not.toBeInTheDocument();
            });
        });
        // textCls prop tests
        describe('textCls prop', () => {
            it('should apply custom text class', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" textCls="custom-text-class"/>);
                // Assert
                const statusText = react_1.screen.getByText('datasetDocuments.list.status.available');
                expect(statusText).toHaveClass('custom-text-class');
            });
            it('should default to empty string', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available"/>);
                // Assert
                const statusText = react_1.screen.getByText('datasetDocuments.list.status.available');
                expect(statusText).toHaveClass('text-sm');
            });
        });
        // errorMessage prop tests
        describe('errorMessage prop', () => {
            it('should render tooltip trigger when errorMessage is provided', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="error" errorMessage="Something went wrong"/>);
                // Assert - tooltip trigger element should exist
                const tooltipTrigger = react_1.screen.getByTestId('error-tooltip-trigger');
                expect(tooltipTrigger).toBeInTheDocument();
            });
            it('should show error message on hover', async () => {
                // Arrange
                renderWithProviders(<index_1.default status="error" errorMessage="Something went wrong"/>);
                // Act - hover the tooltip trigger
                const tooltipTrigger = react_1.screen.getByTestId('error-tooltip-trigger');
                react_1.fireEvent.mouseEnter(tooltipTrigger);
                // Assert - wait for tooltip content to appear
                expect(await react_1.screen.findByText('Something went wrong')).toBeInTheDocument();
            });
            it('should not render tooltip trigger when errorMessage is not provided', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="error"/>);
                // Assert - tooltip trigger should not exist
                const tooltipTrigger = react_1.screen.queryByTestId('error-tooltip-trigger');
                expect(tooltipTrigger).not.toBeInTheDocument();
            });
            it('should not render tooltip trigger when errorMessage is empty', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="error" errorMessage=""/>);
                // Assert - tooltip trigger should not exist
                const tooltipTrigger = react_1.screen.queryByTestId('error-tooltip-trigger');
                expect(tooltipTrigger).not.toBeInTheDocument();
            });
        });
        // detail prop tests
        describe('detail prop', () => {
            it('should use default values when detail is undefined', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" scene="detail"/>);
                // Assert - switch should be unchecked (defaultValue = false when archived = false and enabled = false)
                const switchEl = react_1.screen.getByRole('switch');
                expect(switchEl).toHaveAttribute('aria-checked', 'false');
            });
            it('should use enabled value from detail', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" scene="detail" detail={createDetailProps({ enabled: true })}/>);
                // Assert
                const switchEl = react_1.screen.getByRole('switch');
                expect(switchEl).toHaveAttribute('aria-checked', 'true');
            });
            it('should set switch to false when archived regardless of enabled', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default status="available" scene="detail" detail={createDetailProps({ enabled: true, archived: true })}/>);
                // Assert - archived overrides enabled, defaultValue becomes false
                const switchEl = react_1.screen.getByRole('switch');
                expect(switchEl).toHaveAttribute('aria-checked', 'false');
            });
        });
    });
    // ==================== Memoization Tests ====================
    // Test useMemo logic for embedding status (disables switch)
    describe('Memoization', () => {
        it.each([
            ['queuing', true],
            ['indexing', true],
            ['paused', true],
            ['available', false],
            ['enabled', false],
            ['disabled', false],
            ['archived', false],
            ['error', false],
        ])('should correctly identify embedding status for "%s" - disabled: %s', (status, isEmbedding) => {
            // Arrange & Act
            renderWithProviders(<index_1.default status={status} scene="detail" detail={createDetailProps()}/>);
            // Assert - check if switch is visually disabled (via CSS classes)
            // The Switch component uses CSS classes for disabled state, not the native disabled attribute
            const switchEl = react_1.screen.getByRole('switch');
            if (isEmbedding)
                expect(switchEl).toHaveClass('!cursor-not-allowed', '!opacity-50');
            else
                expect(switchEl).not.toHaveClass('!cursor-not-allowed');
        });
        it('should disable switch when archived', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="available" scene="detail" detail={createDetailProps({ archived: true })}/>);
            // Assert - visually disabled via CSS classes
            const switchEl = react_1.screen.getByRole('switch');
            expect(switchEl).toHaveClass('!cursor-not-allowed', '!opacity-50');
        });
        it('should disable switch when both embedding and archived', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="indexing" scene="detail" detail={createDetailProps({ archived: true })}/>);
            // Assert - visually disabled via CSS classes
            const switchEl = react_1.screen.getByRole('switch');
            expect(switchEl).toHaveClass('!cursor-not-allowed', '!opacity-50');
        });
    });
    // ==================== Switch Toggle Tests ====================
    // Test Switch toggle interactions
    describe('Switch Toggle', () => {
        it('should call enable operation when switch is toggled on', async () => {
            // Arrange
            const mockOnUpdate = vi.fn();
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false })} datasetId="dataset-123" onUpdate={mockOnUpdate}/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockEnableDocument).toHaveBeenCalledWith({
                    datasetId: 'dataset-123',
                    documentId: 'doc-123',
                });
            });
        });
        it('should call disable operation when switch is toggled off', async () => {
            // Arrange
            const mockOnUpdate = vi.fn();
            renderWithProviders(<index_1.default status="enabled" scene="detail" detail={createDetailProps({ enabled: true })} datasetId="dataset-123" onUpdate={mockOnUpdate}/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockDisableDocument).toHaveBeenCalledWith({
                    datasetId: 'dataset-123',
                    documentId: 'doc-123',
                });
            });
        });
        it('should not call any operation when archived', () => {
            // Arrange
            renderWithProviders(<index_1.default status="available" scene="detail" detail={createDetailProps({ archived: true })} datasetId="dataset-123"/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            expect(mockEnableDocument).not.toHaveBeenCalled();
            expect(mockDisableDocument).not.toHaveBeenCalled();
        });
        it('should render switch as checked when enabled is true', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="enabled" scene="detail" detail={createDetailProps({ enabled: true })} datasetId="dataset-123"/>);
            // Assert - verify switch shows checked state
            const switchEl = react_1.screen.getByRole('switch');
            expect(switchEl).toHaveAttribute('aria-checked', 'true');
        });
        it('should render switch as unchecked when enabled is false', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false })} datasetId="dataset-123"/>);
            // Assert - verify switch shows unchecked state
            const switchEl = react_1.screen.getByRole('switch');
            expect(switchEl).toHaveAttribute('aria-checked', 'false');
        });
        it('should skip enable operation when props.enabled is true (guard branch)', () => {
            // Covers guard condition: if (operationName === 'enable' && enabled) return
            // Note: The guard checks props.enabled, NOT the Switch's internal UI state.
            // This prevents redundant API calls when the UI toggles back to a state
            // that already matches the server-side data (props haven't been updated yet).
            const mockOnUpdate = vi.fn();
            renderWithProviders(<index_1.default status="enabled" scene="detail" detail={createDetailProps({ enabled: true })} datasetId="dataset-123" onUpdate={mockOnUpdate}/>);
            const switchEl = react_1.screen.getByRole('switch');
            // First click: Switch UI toggles OFF, calls disable (props.enabled=true, so allowed)
            react_1.fireEvent.click(switchEl);
            // Second click: Switch UI toggles ON, tries to call enable
            // BUT props.enabled is still true (not updated), so guard skips the API call
            react_1.fireEvent.click(switchEl);
            // Assert - disable was called once, enable was skipped because props.enabled=true
            expect(mockDisableDocument).toHaveBeenCalledTimes(1);
            expect(mockEnableDocument).not.toHaveBeenCalled();
        });
        it('should skip disable operation when props.enabled is false (guard branch)', () => {
            // Covers guard condition: if (operationName === 'disable' && !enabled) return
            // Note: The guard checks props.enabled, NOT the Switch's internal UI state.
            // This prevents redundant API calls when the UI toggles back to a state
            // that already matches the server-side data (props haven't been updated yet).
            const mockOnUpdate = vi.fn();
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false })} datasetId="dataset-123" onUpdate={mockOnUpdate}/>);
            const switchEl = react_1.screen.getByRole('switch');
            // First click: Switch UI toggles ON, calls enable (props.enabled=false, so allowed)
            react_1.fireEvent.click(switchEl);
            // Second click: Switch UI toggles OFF, tries to call disable
            // BUT props.enabled is still false (not updated), so guard skips the API call
            react_1.fireEvent.click(switchEl);
            // Assert - enable was called once, disable was skipped because props.enabled=false
            expect(mockEnableDocument).toHaveBeenCalledTimes(1);
            expect(mockDisableDocument).not.toHaveBeenCalled();
        });
    });
    // ==================== onUpdate Callback Tests ====================
    // Test onUpdate callback behavior
    describe('onUpdate Callback', () => {
        it('should call onUpdate with operation name on successful enable', async () => {
            // Arrange
            const mockOnUpdate = vi.fn();
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false })} datasetId="dataset-123" onUpdate={mockOnUpdate}/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith('enable');
            });
        });
        it('should call onUpdate with operation name on successful disable', async () => {
            // Arrange
            const mockOnUpdate = vi.fn();
            renderWithProviders(<index_1.default status="enabled" scene="detail" detail={createDetailProps({ enabled: true })} datasetId="dataset-123" onUpdate={mockOnUpdate}/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith('disable');
            });
        });
        it('should not call onUpdate when operation fails', async () => {
            // Arrange
            mockEnableDocument.mockRejectedValue(new Error('API Error'));
            const mockOnUpdate = vi.fn();
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false })} datasetId="dataset-123" onUpdate={mockOnUpdate}/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'common.actionMsg.modifiedUnsuccessfully',
                });
            });
            expect(mockOnUpdate).not.toHaveBeenCalled();
        });
        it('should not throw when onUpdate is not provided', () => {
            // Arrange
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false })} datasetId="dataset-123"/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            // Assert - should not throw
            expect(() => react_1.fireEvent.click(switchEl)).not.toThrow();
        });
    });
    // ==================== API Calls ====================
    // Test API operations and toast notifications
    describe('API Operations', () => {
        it('should show success toast on successful operation', async () => {
            // Arrange
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false })} datasetId="dataset-123"/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'success',
                    message: 'common.actionMsg.modifiedSuccessfully',
                });
            });
        });
        it('should show error toast on failed operation', async () => {
            // Arrange
            mockDisableDocument.mockRejectedValue(new Error('Network error'));
            renderWithProviders(<index_1.default status="enabled" scene="detail" detail={createDetailProps({ enabled: true })} datasetId="dataset-123"/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'common.actionMsg.modifiedUnsuccessfully',
                });
            });
        });
        it('should pass correct parameters to enable API', async () => {
            // Arrange
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false, id: 'test-doc-id' })} datasetId="test-dataset-id"/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockEnableDocument).toHaveBeenCalledWith({
                    datasetId: 'test-dataset-id',
                    documentId: 'test-doc-id',
                });
            });
        });
        it('should pass correct parameters to disable API', async () => {
            // Arrange
            renderWithProviders(<index_1.default status="enabled" scene="detail" detail={createDetailProps({ enabled: true, id: 'test-doc-456' })} datasetId="test-dataset-456"/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockDisableDocument).toHaveBeenCalledWith({
                    datasetId: 'test-dataset-456',
                    documentId: 'test-doc-456',
                });
            });
        });
    });
    // ==================== Edge Cases ====================
    // Test boundary conditions and unusual inputs
    describe('Edge Cases', () => {
        it('should handle empty datasetId', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="available" scene="detail" detail={createDetailProps()}/>);
            // Assert - should render without errors
            expect(react_1.screen.getByRole('switch')).toBeInTheDocument();
        });
        it('should handle undefined detail gracefully', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="available" scene="detail" detail={undefined}/>);
            // Assert
            const switchEl = react_1.screen.getByRole('switch');
            expect(switchEl).toHaveAttribute('aria-checked', 'false');
        });
        it('should handle empty string id in detail', async () => {
            // Arrange
            renderWithProviders(<index_1.default status="disabled" scene="detail" detail={createDetailProps({ enabled: false, id: '' })} datasetId="dataset-123"/>);
            // Act
            const switchEl = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchEl);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockEnableDocument).toHaveBeenCalledWith({
                    datasetId: 'dataset-123',
                    documentId: '',
                });
            });
        });
        it('should handle very long error messages', async () => {
            // Arrange
            const longErrorMessage = 'A'.repeat(500);
            renderWithProviders(<index_1.default status="error" errorMessage={longErrorMessage}/>);
            // Act - hover to show tooltip
            const tooltipTrigger = react_1.screen.getByTestId('error-tooltip-trigger');
            react_1.fireEvent.mouseEnter(tooltipTrigger);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(longErrorMessage)).toBeInTheDocument();
            });
        });
        it('should handle special characters in error message', async () => {
            // Arrange
            const specialChars = '<script>alert("xss")</script> & < > " \'';
            renderWithProviders(<index_1.default status="error" errorMessage={specialChars}/>);
            // Act - hover to show tooltip
            const tooltipTrigger = react_1.screen.getByTestId('error-tooltip-trigger');
            react_1.fireEvent.mouseEnter(tooltipTrigger);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(specialChars)).toBeInTheDocument();
            });
        });
        it('should handle all status types in sequence', () => {
            // Arrange
            const statuses = [
                'queuing',
                'indexing',
                'paused',
                'error',
                'available',
                'enabled',
                'disabled',
                'archived',
            ];
            // Act & Assert
            statuses.forEach((status) => {
                const { unmount } = renderWithProviders(<index_1.default status={status}/>);
                const indicator = react_1.screen.getByTestId('status-indicator');
                expect(indicator).toBeInTheDocument();
                unmount();
            });
        });
    });
    // ==================== Component Memoization ====================
    // Test React.memo behavior
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert
            expect(index_1.default).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
        it('should render correctly with same props', () => {
            // Arrange
            const props = {
                status: 'available',
                scene: 'detail',
                detail: createDetailProps(),
            };
            // Act
            const { rerender } = renderWithProviders(<index_1.default {...props}/>);
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...props}/>
        </react_query_1.QueryClientProvider>);
            // Assert
            const indicator = react_1.screen.getByTestId('status-indicator');
            expect(indicator).toBeInTheDocument();
        });
        it('should update when status prop changes', () => {
            // Arrange
            const { rerender } = renderWithProviders(<index_1.default status="available"/>);
            // Assert initial - green/success background
            let indicator = react_1.screen.getByTestId('status-indicator');
            expect(indicator).toHaveClass('bg-components-badge-status-light-success-bg');
            // Act
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default status="error"/>
        </react_query_1.QueryClientProvider>);
            // Assert updated - red/error background
            indicator = react_1.screen.getByTestId('status-indicator');
            expect(indicator).toHaveClass('bg-components-badge-status-light-error-bg');
        });
    });
    // ==================== Styling Tests ====================
    // Test CSS classes and styling
    describe('Styling', () => {
        it('should apply correct status text color for green status', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="available"/>);
            // Assert
            const statusText = react_1.screen.getByText('datasetDocuments.list.status.available');
            expect(statusText).toHaveClass('text-util-colors-green-green-600');
        });
        it('should apply correct status text color for red status', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="error"/>);
            // Assert
            const statusText = react_1.screen.getByText('datasetDocuments.list.status.error');
            expect(statusText).toHaveClass('text-util-colors-red-red-600');
        });
        it('should apply correct status text color for orange status', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="queuing"/>);
            // Assert
            const statusText = react_1.screen.getByText('datasetDocuments.list.status.queuing');
            expect(statusText).toHaveClass('text-util-colors-warning-warning-600');
        });
        it('should apply correct status text color for blue status', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="indexing"/>);
            // Assert
            const statusText = react_1.screen.getByText('datasetDocuments.list.status.indexing');
            expect(statusText).toHaveClass('text-util-colors-blue-light-blue-light-600');
        });
        it('should apply correct status text color for gray status', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="disabled"/>);
            // Assert
            const statusText = react_1.screen.getByText('datasetDocuments.list.status.disabled');
            expect(statusText).toHaveClass('text-text-tertiary');
        });
        it('should render switch with md size in detail scene', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default status="available" scene="detail" detail={createDetailProps()}/>);
            // Assert - check switch has the md size class (h-4 w-7)
            const switchEl = react_1.screen.getByRole('switch');
            expect(switchEl).toHaveClass('h-4', 'w-7');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdURBQXdFO0FBQ3hFLGtEQUEyRTtBQUMzRSxtQ0FBZ0M7QUFFaEMsdURBQXVEO0FBQ3ZELE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMxQixFQUFFLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBQyxjQUFjLEVBQUMsRUFBRSxDQUFDLENBQUM7SUFDdkQsR0FBRyxNQUFNLGNBQWMsRUFBeUM7SUFDaEUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLENBQUM7Q0FDM0MsQ0FBQyxDQUFDLENBQUE7QUFFSCxpRUFBaUU7QUFDakUsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDbEMsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDbkMsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFbEMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQztJQUM5RCxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLENBQUM7SUFDaEUsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxDQUFDO0NBQy9ELENBQUMsQ0FBQyxDQUFBO0FBRUgsd0RBQXdEO0FBQ3hELEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxjQUFjLEVB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LENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRG9jdW1lbnREaXNwbGF5U3RhdHVzIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IFN0YXR1c0l0ZW0gZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayBUb2FzdENvbnRleHQgLSByZXF1aXJlZCB0byB2ZXJpZnkgbm90aWZpY2F0aW9uc1xuY29uc3QgbW9ja05vdGlmeSA9IHZpLmZuKClcbnZpLm1vY2soJ3VzZS1jb250ZXh0LXNlbGVjdG9yJywgYXN5bmMgaW1wb3J0T3JpZ2luYWwgPT4gKHtcbiAgLi4uYXdhaXQgaW1wb3J0T3JpZ2luYWw8dHlwZW9mIGltcG9ydCgndXNlLWNvbnRleHQtc2VsZWN0b3InKT4oKSxcbiAgdXNlQ29udGV4dDogKCkgPT4gKHsgbm90aWZ5OiBtb2NrTm90aWZ5IH0pLFxufSkpXG5cbi8vIE1vY2sgZG9jdW1lbnQgc2VydmljZSBob29rcyAtIHJlcXVpcmVkIHRvIGF2b2lkIHJlYWwgQVBJIGNhbGxzXG5jb25zdCBtb2NrRW5hYmxlRG9jdW1lbnQgPSB2aS5mbigpXG5jb25zdCBtb2NrRGlzYWJsZURvY3VtZW50ID0gdmkuZm4oKVxuY29uc3QgbW9ja0RlbGV0ZURvY3VtZW50ID0gdmkuZm4oKVxuXG52aS5tb2NrKCdAL3NlcnZpY2Uva25vd2xlZGdlL3VzZS1kb2N1bWVudCcsICgpID0+ICh7XG4gIHVzZURvY3VtZW50RW5hYmxlOiAoKSA9PiAoeyBtdXRhdGVBc3luYzogbW9ja0VuYWJsZURvY3VtZW50IH0pLFxuICB1c2VEb2N1bWVudERpc2FibGU6ICgpID0+ICh7IG11dGF0ZUFzeW5jOiBtb2NrRGlzYWJsZURvY3VtZW50IH0pLFxuICB1c2VEb2N1bWVudERlbGV0ZTogKCkgPT4gKHsgbXV0YXRlQXN5bmM6IG1vY2tEZWxldGVEb2N1bWVudCB9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZURlYm91bmNlRm4gdG8gZXhlY3V0ZSBpbW1lZGlhdGVseSBmb3IgdGVzdGluZ1xudmkubW9jaygnYWhvb2tzJywgYXN5bmMgaW1wb3J0T3JpZ2luYWwgPT4gKHtcbiAgLi4uYXdhaXQgaW1wb3J0T3JpZ2luYWw8dHlwZW9mIGltcG9ydCgnYWhvb2tzJyk+KCksXG4gIHVzZURlYm91bmNlRm46IChmbjogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdm9pZCkgPT4gKHsgcnVuOiBmbiB9KSxcbn0pKVxuXG4vLyBUZXN0IHV0aWxpdGllc1xuY29uc3QgY3JlYXRlUXVlcnlDbGllbnQgPSAoKSA9PlxuICBuZXcgUXVlcnlDbGllbnQoe1xuICAgIGRlZmF1bHRPcHRpb25zOiB7XG4gICAgICBxdWVyaWVzOiB7IHJldHJ5OiBmYWxzZSB9LFxuICAgICAgbXV0YXRpb25zOiB7IHJldHJ5OiBmYWxzZSB9LFxuICAgIH0sXG4gIH0pXG5cbmNvbnN0IHJlbmRlcldpdGhQcm92aWRlcnMgPSAodWk6IFJlYWN0LlJlYWN0RWxlbWVudCkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IGNyZWF0ZVF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuIHJlbmRlcihcbiAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgIHt1aX1cbiAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICApXG59XG5cbi8vIEZhY3RvcnkgZnVuY3Rpb25zIGZvciB0ZXN0IGRhdGFcbmNvbnN0IGNyZWF0ZURldGFpbFByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDx7XG4gIGVuYWJsZWQ6IGJvb2xlYW5cbiAgYXJjaGl2ZWQ6IGJvb2xlYW5cbiAgaWQ6IHN0cmluZ1xufT4gPSB7fSkgPT4gKHtcbiAgZW5hYmxlZDogZmFsc2UsXG4gIGFyY2hpdmVkOiBmYWxzZSxcbiAgaWQ6ICdkb2MtMTIzJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuZGVzY3JpYmUoJ1N0YXR1c0l0ZW0nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tFbmFibGVEb2N1bWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHJlc3VsdDogJ3N1Y2Nlc3MnIH0pXG4gICAgbW9ja0Rpc2FibGVEb2N1bWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHJlc3VsdDogJ3N1Y2Nlc3MnIH0pXG4gICAgbW9ja0RlbGV0ZURvY3VtZW50Lm1vY2tSZXNvbHZlZFZhbHVlKHsgcmVzdWx0OiAnc3VjY2VzcycgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBSZW5kZXJpbmcgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGVzdCBiYXNpYyByZW5kZXJpbmcgd2l0aCBkaWZmZXJlbnQgc3RhdHVzIHZhbHVlc1xuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxTdGF0dXNJdGVtIHN0YXR1cz1cImF2YWlsYWJsZVwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBjaGVjayBpbmRpY2F0b3IgZWxlbWVudCBleGlzdHMgKHJlYWwgSW5kaWNhdG9yIGNvbXBvbmVudClcbiAgICAgIGNvbnN0IGluZGljYXRvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhdHVzLWluZGljYXRvcicpXG4gICAgICBleHBlY3QoaW5kaWNhdG9yKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgWydxdWV1aW5nJywgJ2JnLWNvbXBvbmVudHMtYmFkZ2Utc3RhdHVzLWxpZ2h0LXdhcm5pbmctYmcnXSxcbiAgICAgIFsnaW5kZXhpbmcnLCAnYmctY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtbm9ybWFsLWJnJ10sXG4gICAgICBbJ3BhdXNlZCcsICdiZy1jb21wb25lbnRzLWJhZGdlLXN0YXR1cy1saWdodC13YXJuaW5nLWJnJ10sXG4gICAgICBbJ2Vycm9yJywgJ2JnLWNvbXBvbmVudHMtYmFkZ2Utc3RhdHVzLWxpZ2h0LWVycm9yLWJnJ10sXG4gICAgICBbJ2F2YWlsYWJsZScsICdiZy1jb21wb25lbnRzLWJhZGdlLXN0YXR1cy1saWdodC1zdWNjZXNzLWJnJ10sXG4gICAgICBbJ2VuYWJsZWQnLCAnYmctY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtc3VjY2Vzcy1iZyddLFxuICAgICAgWydkaXNhYmxlZCcsICdiZy1jb21wb25lbnRzLWJhZGdlLXN0YXR1cy1saWdodC1kaXNhYmxlZC1iZyddLFxuICAgICAgWydhcmNoaXZlZCcsICdiZy1jb21wb25lbnRzLWJhZGdlLXN0YXR1cy1saWdodC1kaXNhYmxlZC1iZyddLFxuICAgIF0gYXMgY29uc3QpKCdzaG91bGQgcmVuZGVyIHN0YXR1cyBcIiVzXCIgd2l0aCBjb3JyZWN0IGluZGljYXRvciBiYWNrZ3JvdW5kJywgKHN0YXR1cywgZXhwZWN0ZWRCZykgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8U3RhdHVzSXRlbSBzdGF0dXM9e3N0YXR1c30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW5kaWNhdG9yID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzdGF0dXMtaW5kaWNhdG9yJylcbiAgICAgIGV4cGVjdChpbmRpY2F0b3IpLnRvSGF2ZUNsYXNzKGV4cGVjdGVkQmcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHN0YXR1cyB0ZXh0IGZyb20gdHJhbnNsYXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxTdGF0dXNJdGVtIHN0YXR1cz1cImF2YWlsYWJsZVwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0RG9jdW1lbnRzLmxpc3Quc3RhdHVzLmF2YWlsYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNhc2UtaW5zZW5zaXRpdmUgc3RhdHVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPFN0YXR1c0l0ZW0gc3RhdHVzPXsnQVZBSUxBQkxFJyBhcyBEb2N1bWVudERpc3BsYXlTdGF0dXN9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGluZGljYXRvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhdHVzLWluZGljYXRvcicpXG4gICAgICBleHBlY3QoaW5kaWNhdG9yKS50b0hhdmVDbGFzcygnYmctY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtc3VjY2Vzcy1iZycpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBQcm9wcyBUZXN0aW5nID09PT09PT09PT09PT09PT09PT09XG4gIC8vIFRlc3QgYWxsIHByb3AgdmFyaWF0aW9ucyBhbmQgY29tYmluYXRpb25zXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICAvLyByZXZlcnNlIHByb3AgdGVzdHNcbiAgICBkZXNjcmliZSgncmV2ZXJzZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBhcHBseSBkZWZhdWx0IGxheW91dCB3aGVuIHJldmVyc2UgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPFN0YXR1c0l0ZW0gc3RhdHVzPVwiYXZhaWxhYmxlXCIgcmV2ZXJzZT17ZmFsc2V9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgZXhwZWN0KHdyYXBwZXIpLm5vdC50b0hhdmVDbGFzcygnZmxleC1yb3ctcmV2ZXJzZScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGFwcGx5IHJldmVyc2VkIGxheW91dCB3aGVuIHJldmVyc2UgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8U3RhdHVzSXRlbSBzdGF0dXM9XCJhdmFpbGFibGVcIiByZXZlcnNlIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdmbGV4LXJvdy1yZXZlcnNlJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgbWwtMiB0byBpbmRpY2F0b3Igd2hlbiByZXZlcnNlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxTdGF0dXNJdGVtIHN0YXR1cz1cImF2YWlsYWJsZVwiIHJldmVyc2UgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGluZGljYXRvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhdHVzLWluZGljYXRvcicpXG4gICAgICAgIGV4cGVjdChpbmRpY2F0b3IpLnRvSGF2ZUNsYXNzKCdtbC0yJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgbXItMiB0byBpbmRpY2F0b3Igd2hlbiBub3QgcmV2ZXJzZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8U3RhdHVzSXRlbSBzdGF0dXM9XCJhdmFpbGFibGVcIiByZXZlcnNlPXtmYWxzZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGluZGljYXRvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhdHVzLWluZGljYXRvcicpXG4gICAgICAgIGV4cGVjdChpbmRpY2F0b3IpLnRvSGF2ZUNsYXNzKCdtci0yJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIHNjZW5lIHByb3AgdGVzdHNcbiAgICBkZXNjcmliZSgnc2NlbmUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzd2l0Y2ggaW4gbGlzdCBzY2VuZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgICBzdGF0dXM9XCJhdmFpbGFibGVcIlxuICAgICAgICAgICAgc2NlbmU9XCJsaXN0XCJcbiAgICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFN3aXRjaCByZW5kZXJzIGFzIGEgYnV0dG9uIGVsZW1lbnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnc3dpdGNoJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBzd2l0Y2ggaW4gZGV0YWlsIHNjZW5lJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPFN0YXR1c0l0ZW1cbiAgICAgICAgICAgIHN0YXR1cz1cImF2YWlsYWJsZVwiXG4gICAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgICBkZXRhaWw9e2NyZWF0ZURldGFpbFByb3BzKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRlZmF1bHQgdG8gbGlzdCBzY2VuZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgICBzdGF0dXM9XCJhdmFpbGFibGVcIlxuICAgICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcygpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ3N3aXRjaCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gdGV4dENscyBwcm9wIHRlc3RzXG4gICAgZGVzY3JpYmUoJ3RleHRDbHMgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIHRleHQgY2xhc3MnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8U3RhdHVzSXRlbSBzdGF0dXM9XCJhdmFpbGFibGVcIiB0ZXh0Q2xzPVwiY3VzdG9tLXRleHQtY2xhc3NcIiAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBzdGF0dXNUZXh0ID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldERvY3VtZW50cy5saXN0LnN0YXR1cy5hdmFpbGFibGUnKVxuICAgICAgICBleHBlY3Qoc3RhdHVzVGV4dCkudG9IYXZlQ2xhc3MoJ2N1c3RvbS10ZXh0LWNsYXNzJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGVmYXVsdCB0byBlbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8U3RhdHVzSXRlbSBzdGF0dXM9XCJhdmFpbGFibGVcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMubGlzdC5zdGF0dXMuYXZhaWxhYmxlJylcbiAgICAgICAgZXhwZWN0KHN0YXR1c1RleHQpLnRvSGF2ZUNsYXNzKCd0ZXh0LXNtJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIGVycm9yTWVzc2FnZSBwcm9wIHRlc3RzXG4gICAgZGVzY3JpYmUoJ2Vycm9yTWVzc2FnZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgdG9vbHRpcCB0cmlnZ2VyIHdoZW4gZXJyb3JNZXNzYWdlIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPFN0YXR1c0l0ZW0gc3RhdHVzPVwiZXJyb3JcIiBlcnJvck1lc3NhZ2U9XCJTb21ldGhpbmcgd2VudCB3cm9uZ1wiIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gdG9vbHRpcCB0cmlnZ2VyIGVsZW1lbnQgc2hvdWxkIGV4aXN0XG4gICAgICAgIGNvbnN0IHRvb2x0aXBUcmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdlcnJvci10b29sdGlwLXRyaWdnZXInKVxuICAgICAgICBleHBlY3QodG9vbHRpcFRyaWdnZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBtZXNzYWdlIG9uIGhvdmVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPFN0YXR1c0l0ZW0gc3RhdHVzPVwiZXJyb3JcIiBlcnJvck1lc3NhZ2U9XCJTb21ldGhpbmcgd2VudCB3cm9uZ1wiIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQWN0IC0gaG92ZXIgdGhlIHRvb2x0aXAgdHJpZ2dlclxuICAgICAgICBjb25zdCB0b29sdGlwVHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZXJyb3ItdG9vbHRpcC10cmlnZ2VyJylcbiAgICAgICAgZmlyZUV2ZW50Lm1vdXNlRW50ZXIodG9vbHRpcFRyaWdnZXIpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gd2FpdCBmb3IgdG9vbHRpcCBjb250ZW50IHRvIGFwcGVhclxuICAgICAgICBleHBlY3QoYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ1NvbWV0aGluZyB3ZW50IHdyb25nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB0b29sdGlwIHRyaWdnZXIgd2hlbiBlcnJvck1lc3NhZ2UgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFN0YXR1c0l0ZW0gc3RhdHVzPVwiZXJyb3JcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSB0b29sdGlwIHRyaWdnZXIgc2hvdWxkIG5vdCBleGlzdFxuICAgICAgICBjb25zdCB0b29sdGlwVHJpZ2dlciA9IHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdlcnJvci10b29sdGlwLXRyaWdnZXInKVxuICAgICAgICBleHBlY3QodG9vbHRpcFRyaWdnZXIpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgdG9vbHRpcCB0cmlnZ2VyIHdoZW4gZXJyb3JNZXNzYWdlIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFN0YXR1c0l0ZW0gc3RhdHVzPVwiZXJyb3JcIiBlcnJvck1lc3NhZ2U9XCJcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSB0b29sdGlwIHRyaWdnZXIgc2hvdWxkIG5vdCBleGlzdFxuICAgICAgICBjb25zdCB0b29sdGlwVHJpZ2dlciA9IHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdlcnJvci10b29sdGlwLXRyaWdnZXInKVxuICAgICAgICBleHBlY3QodG9vbHRpcFRyaWdnZXIpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBkZXRhaWwgcHJvcCB0ZXN0c1xuICAgIGRlc2NyaWJlKCdkZXRhaWwgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHQgdmFsdWVzIHdoZW4gZGV0YWlsIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxTdGF0dXNJdGVtIHN0YXR1cz1cImF2YWlsYWJsZVwiIHNjZW5lPVwiZGV0YWlsXCIgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnQgLSBzd2l0Y2ggc2hvdWxkIGJlIHVuY2hlY2tlZCAoZGVmYXVsdFZhbHVlID0gZmFsc2Ugd2hlbiBhcmNoaXZlZCA9IGZhbHNlIGFuZCBlbmFibGVkID0gZmFsc2UpXG4gICAgICAgIGNvbnN0IHN3aXRjaEVsID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgICAgZXhwZWN0KHN3aXRjaEVsKS50b0hhdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcsICdmYWxzZScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBlbmFibGVkIHZhbHVlIGZyb20gZGV0YWlsJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPFN0YXR1c0l0ZW1cbiAgICAgICAgICAgIHN0YXR1cz1cImF2YWlsYWJsZVwiXG4gICAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgICBkZXRhaWw9e2NyZWF0ZURldGFpbFByb3BzKHsgZW5hYmxlZDogdHJ1ZSB9KX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICAgIGV4cGVjdChzd2l0Y2hFbCkudG9IYXZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnLCAndHJ1ZScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNldCBzd2l0Y2ggdG8gZmFsc2Ugd2hlbiBhcmNoaXZlZCByZWdhcmRsZXNzIG9mIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgICAgc3RhdHVzPVwiYXZhaWxhYmxlXCJcbiAgICAgICAgICAgIHNjZW5lPVwiZGV0YWlsXCJcbiAgICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoeyBlbmFibGVkOiB0cnVlLCBhcmNoaXZlZDogdHJ1ZSB9KX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGFyY2hpdmVkIG92ZXJyaWRlcyBlbmFibGVkLCBkZWZhdWx0VmFsdWUgYmVjb21lcyBmYWxzZVxuICAgICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICAgIGV4cGVjdChzd2l0Y2hFbCkudG9IYXZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnLCAnZmFsc2UnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IE1lbW9pemF0aW9uIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIC8vIFRlc3QgdXNlTWVtbyBsb2dpYyBmb3IgZW1iZWRkaW5nIHN0YXR1cyAoZGlzYWJsZXMgc3dpdGNoKVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQuZWFjaChbXG4gICAgICBbJ3F1ZXVpbmcnLCB0cnVlXSxcbiAgICAgIFsnaW5kZXhpbmcnLCB0cnVlXSxcbiAgICAgIFsncGF1c2VkJywgdHJ1ZV0sXG4gICAgICBbJ2F2YWlsYWJsZScsIGZhbHNlXSxcbiAgICAgIFsnZW5hYmxlZCcsIGZhbHNlXSxcbiAgICAgIFsnZGlzYWJsZWQnLCBmYWxzZV0sXG4gICAgICBbJ2FyY2hpdmVkJywgZmFsc2VdLFxuICAgICAgWydlcnJvcicsIGZhbHNlXSxcbiAgICBdIGFzIGNvbnN0KSgnc2hvdWxkIGNvcnJlY3RseSBpZGVudGlmeSBlbWJlZGRpbmcgc3RhdHVzIGZvciBcIiVzXCIgLSBkaXNhYmxlZDogJXMnLCAoc3RhdHVzLCBpc0VtYmVkZGluZykgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPFN0YXR1c0l0ZW1cbiAgICAgICAgICBzdGF0dXM9e3N0YXR1c31cbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcygpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gY2hlY2sgaWYgc3dpdGNoIGlzIHZpc3VhbGx5IGRpc2FibGVkICh2aWEgQ1NTIGNsYXNzZXMpXG4gICAgICAvLyBUaGUgU3dpdGNoIGNvbXBvbmVudCB1c2VzIENTUyBjbGFzc2VzIGZvciBkaXNhYmxlZCBzdGF0ZSwgbm90IHRoZSBuYXRpdmUgZGlzYWJsZWQgYXR0cmlidXRlXG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBpZiAoaXNFbWJlZGRpbmcpXG4gICAgICAgIGV4cGVjdChzd2l0Y2hFbCkudG9IYXZlQ2xhc3MoJyFjdXJzb3Itbm90LWFsbG93ZWQnLCAnIW9wYWNpdHktNTAnKVxuICAgICAgZWxzZVxuICAgICAgICBleHBlY3Qoc3dpdGNoRWwpLm5vdC50b0hhdmVDbGFzcygnIWN1cnNvci1ub3QtYWxsb3dlZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBzd2l0Y2ggd2hlbiBhcmNoaXZlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgc3RhdHVzPVwiYXZhaWxhYmxlXCJcbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcyh7IGFyY2hpdmVkOiB0cnVlIH0pfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gdmlzdWFsbHkgZGlzYWJsZWQgdmlhIENTUyBjbGFzc2VzXG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBleHBlY3Qoc3dpdGNoRWwpLnRvSGF2ZUNsYXNzKCchY3Vyc29yLW5vdC1hbGxvd2VkJywgJyFvcGFjaXR5LTUwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHN3aXRjaCB3aGVuIGJvdGggZW1iZWRkaW5nIGFuZCBhcmNoaXZlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgc3RhdHVzPVwiaW5kZXhpbmdcIlxuICAgICAgICAgIHNjZW5lPVwiZGV0YWlsXCJcbiAgICAgICAgICBkZXRhaWw9e2NyZWF0ZURldGFpbFByb3BzKHsgYXJjaGl2ZWQ6IHRydWUgfSl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSB2aXN1YWxseSBkaXNhYmxlZCB2aWEgQ1NTIGNsYXNzZXNcbiAgICAgIGNvbnN0IHN3aXRjaEVsID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGV4cGVjdChzd2l0Y2hFbCkudG9IYXZlQ2xhc3MoJyFjdXJzb3Itbm90LWFsbG93ZWQnLCAnIW9wYWNpdHktNTAnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gU3dpdGNoIFRvZ2dsZSBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUZXN0IFN3aXRjaCB0b2dnbGUgaW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdTd2l0Y2ggVG9nZ2xlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBlbmFibGUgb3BlcmF0aW9uIHdoZW4gc3dpdGNoIGlzIHRvZ2dsZWQgb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25VcGRhdGUgPSB2aS5mbigpXG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImRpc2FibGVkXCJcbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcyh7IGVuYWJsZWQ6IGZhbHNlIH0pfVxuICAgICAgICAgIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCJcbiAgICAgICAgICBvblVwZGF0ZT17bW9ja09uVXBkYXRlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc3dpdGNoRWwpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRW5hYmxlRG9jdW1lbnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBkYXRhc2V0SWQ6ICdkYXRhc2V0LTEyMycsXG4gICAgICAgICAgZG9jdW1lbnRJZDogJ2RvYy0xMjMnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGRpc2FibGUgb3BlcmF0aW9uIHdoZW4gc3dpdGNoIGlzIHRvZ2dsZWQgb2ZmJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uVXBkYXRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPFN0YXR1c0l0ZW1cbiAgICAgICAgICBzdGF0dXM9XCJlbmFibGVkXCJcbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcyh7IGVuYWJsZWQ6IHRydWUgfSl9XG4gICAgICAgICAgZGF0YXNldElkPVwiZGF0YXNldC0xMjNcIlxuICAgICAgICAgIG9uVXBkYXRlPXttb2NrT25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHN3aXRjaEVsID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzd2l0Y2hFbClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tEaXNhYmxlRG9jdW1lbnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBkYXRhc2V0SWQ6ICdkYXRhc2V0LTEyMycsXG4gICAgICAgICAgZG9jdW1lbnRJZDogJ2RvYy0xMjMnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBhbnkgb3BlcmF0aW9uIHdoZW4gYXJjaGl2ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImF2YWlsYWJsZVwiXG4gICAgICAgICAgc2NlbmU9XCJkZXRhaWxcIlxuICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoeyBhcmNoaXZlZDogdHJ1ZSB9KX1cbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHN3aXRjaEVsID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzd2l0Y2hFbClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0VuYWJsZURvY3VtZW50KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobW9ja0Rpc2FibGVEb2N1bWVudCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzd2l0Y2ggYXMgY2hlY2tlZCB3aGVuIGVuYWJsZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgc3RhdHVzPVwiZW5hYmxlZFwiXG4gICAgICAgICAgc2NlbmU9XCJkZXRhaWxcIlxuICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoeyBlbmFibGVkOiB0cnVlIH0pfVxuICAgICAgICAgIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHZlcmlmeSBzd2l0Y2ggc2hvd3MgY2hlY2tlZCBzdGF0ZVxuICAgICAgY29uc3Qgc3dpdGNoRWwgPSBzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKVxuICAgICAgZXhwZWN0KHN3aXRjaEVsKS50b0hhdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc3dpdGNoIGFzIHVuY2hlY2tlZCB3aGVuIGVuYWJsZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImRpc2FibGVkXCJcbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcyh7IGVuYWJsZWQ6IGZhbHNlIH0pfVxuICAgICAgICAgIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHZlcmlmeSBzd2l0Y2ggc2hvd3MgdW5jaGVja2VkIHN0YXRlXG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBleHBlY3Qoc3dpdGNoRWwpLnRvSGF2ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJywgJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBza2lwIGVuYWJsZSBvcGVyYXRpb24gd2hlbiBwcm9wcy5lbmFibGVkIGlzIHRydWUgKGd1YXJkIGJyYW5jaCknLCAoKSA9PiB7XG4gICAgICAvLyBDb3ZlcnMgZ3VhcmQgY29uZGl0aW9uOiBpZiAob3BlcmF0aW9uTmFtZSA9PT0gJ2VuYWJsZScgJiYgZW5hYmxlZCkgcmV0dXJuXG4gICAgICAvLyBOb3RlOiBUaGUgZ3VhcmQgY2hlY2tzIHByb3BzLmVuYWJsZWQsIE5PVCB0aGUgU3dpdGNoJ3MgaW50ZXJuYWwgVUkgc3RhdGUuXG4gICAgICAvLyBUaGlzIHByZXZlbnRzIHJlZHVuZGFudCBBUEkgY2FsbHMgd2hlbiB0aGUgVUkgdG9nZ2xlcyBiYWNrIHRvIGEgc3RhdGVcbiAgICAgIC8vIHRoYXQgYWxyZWFkeSBtYXRjaGVzIHRoZSBzZXJ2ZXItc2lkZSBkYXRhIChwcm9wcyBoYXZlbid0IGJlZW4gdXBkYXRlZCB5ZXQpLlxuICAgICAgY29uc3QgbW9ja09uVXBkYXRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPFN0YXR1c0l0ZW1cbiAgICAgICAgICBzdGF0dXM9XCJlbmFibGVkXCJcbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcyh7IGVuYWJsZWQ6IHRydWUgfSl9XG4gICAgICAgICAgZGF0YXNldElkPVwiZGF0YXNldC0xMjNcIlxuICAgICAgICAgIG9uVXBkYXRlPXttb2NrT25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICAvLyBGaXJzdCBjbGljazogU3dpdGNoIFVJIHRvZ2dsZXMgT0ZGLCBjYWxscyBkaXNhYmxlIChwcm9wcy5lbmFibGVkPXRydWUsIHNvIGFsbG93ZWQpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc3dpdGNoRWwpXG4gICAgICAvLyBTZWNvbmQgY2xpY2s6IFN3aXRjaCBVSSB0b2dnbGVzIE9OLCB0cmllcyB0byBjYWxsIGVuYWJsZVxuICAgICAgLy8gQlVUIHByb3BzLmVuYWJsZWQgaXMgc3RpbGwgdHJ1ZSAobm90IHVwZGF0ZWQpLCBzbyBndWFyZCBza2lwcyB0aGUgQVBJIGNhbGxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzd2l0Y2hFbClcblxuICAgICAgLy8gQXNzZXJ0IC0gZGlzYWJsZSB3YXMgY2FsbGVkIG9uY2UsIGVuYWJsZSB3YXMgc2tpcHBlZCBiZWNhdXNlIHByb3BzLmVuYWJsZWQ9dHJ1ZVxuICAgICAgZXhwZWN0KG1vY2tEaXNhYmxlRG9jdW1lbnQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tFbmFibGVEb2N1bWVudCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNraXAgZGlzYWJsZSBvcGVyYXRpb24gd2hlbiBwcm9wcy5lbmFibGVkIGlzIGZhbHNlIChndWFyZCBicmFuY2gpJywgKCkgPT4ge1xuICAgICAgLy8gQ292ZXJzIGd1YXJkIGNvbmRpdGlvbjogaWYgKG9wZXJhdGlvbk5hbWUgPT09ICdkaXNhYmxlJyAmJiAhZW5hYmxlZCkgcmV0dXJuXG4gICAgICAvLyBOb3RlOiBUaGUgZ3VhcmQgY2hlY2tzIHByb3BzLmVuYWJsZWQsIE5PVCB0aGUgU3dpdGNoJ3MgaW50ZXJuYWwgVUkgc3RhdGUuXG4gICAgICAvLyBUaGlzIHByZXZlbnRzIHJlZHVuZGFudCBBUEkgY2FsbHMgd2hlbiB0aGUgVUkgdG9nZ2xlcyBiYWNrIHRvIGEgc3RhdGVcbiAgICAgIC8vIHRoYXQgYWxyZWFkeSBtYXRjaGVzIHRoZSBzZXJ2ZXItc2lkZSBkYXRhIChwcm9wcyBoYXZlbid0IGJlZW4gdXBkYXRlZCB5ZXQpLlxuICAgICAgY29uc3QgbW9ja09uVXBkYXRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPFN0YXR1c0l0ZW1cbiAgICAgICAgICBzdGF0dXM9XCJkaXNhYmxlZFwiXG4gICAgICAgICAgc2NlbmU9XCJkZXRhaWxcIlxuICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoeyBlbmFibGVkOiBmYWxzZSB9KX1cbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiXG4gICAgICAgICAgb25VcGRhdGU9e21vY2tPblVwZGF0ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHN3aXRjaEVsID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIC8vIEZpcnN0IGNsaWNrOiBTd2l0Y2ggVUkgdG9nZ2xlcyBPTiwgY2FsbHMgZW5hYmxlIChwcm9wcy5lbmFibGVkPWZhbHNlLCBzbyBhbGxvd2VkKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHN3aXRjaEVsKVxuICAgICAgLy8gU2Vjb25kIGNsaWNrOiBTd2l0Y2ggVUkgdG9nZ2xlcyBPRkYsIHRyaWVzIHRvIGNhbGwgZGlzYWJsZVxuICAgICAgLy8gQlVUIHByb3BzLmVuYWJsZWQgaXMgc3RpbGwgZmFsc2UgKG5vdCB1cGRhdGVkKSwgc28gZ3VhcmQgc2tpcHMgdGhlIEFQSSBjYWxsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc3dpdGNoRWwpXG5cbiAgICAgIC8vIEFzc2VydCAtIGVuYWJsZSB3YXMgY2FsbGVkIG9uY2UsIGRpc2FibGUgd2FzIHNraXBwZWQgYmVjYXVzZSBwcm9wcy5lbmFibGVkPWZhbHNlXG4gICAgICBleHBlY3QobW9ja0VuYWJsZURvY3VtZW50KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrRGlzYWJsZURvY3VtZW50KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBvblVwZGF0ZSBDYWxsYmFjayBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUZXN0IG9uVXBkYXRlIGNhbGxiYWNrIGJlaGF2aW9yXG4gIGRlc2NyaWJlKCdvblVwZGF0ZSBDYWxsYmFjaycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25VcGRhdGUgd2l0aCBvcGVyYXRpb24gbmFtZSBvbiBzdWNjZXNzZnVsIGVuYWJsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblVwZGF0ZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgc3RhdHVzPVwiZGlzYWJsZWRcIlxuICAgICAgICAgIHNjZW5lPVwiZGV0YWlsXCJcbiAgICAgICAgICBkZXRhaWw9e2NyZWF0ZURldGFpbFByb3BzKHsgZW5hYmxlZDogZmFsc2UgfSl9XG4gICAgICAgICAgZGF0YXNldElkPVwiZGF0YXNldC0xMjNcIlxuICAgICAgICAgIG9uVXBkYXRlPXttb2NrT25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHN3aXRjaEVsID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzd2l0Y2hFbClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tPblVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2VuYWJsZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25VcGRhdGUgd2l0aCBvcGVyYXRpb24gbmFtZSBvbiBzdWNjZXNzZnVsIGRpc2FibGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25VcGRhdGUgPSB2aS5mbigpXG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImVuYWJsZWRcIlxuICAgICAgICAgIHNjZW5lPVwiZGV0YWlsXCJcbiAgICAgICAgICBkZXRhaWw9e2NyZWF0ZURldGFpbFByb3BzKHsgZW5hYmxlZDogdHJ1ZSB9KX1cbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiXG4gICAgICAgICAgb25VcGRhdGU9e21vY2tPblVwZGF0ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3Qgc3dpdGNoRWwgPSBzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHN3aXRjaEVsKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja09uVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZGlzYWJsZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uVXBkYXRlIHdoZW4gb3BlcmF0aW9uIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0VuYWJsZURvY3VtZW50Lm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignQVBJIEVycm9yJykpXG4gICAgICBjb25zdCBtb2NrT25VcGRhdGUgPSB2aS5mbigpXG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImRpc2FibGVkXCJcbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcyh7IGVuYWJsZWQ6IGZhbHNlIH0pfVxuICAgICAgICAgIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCJcbiAgICAgICAgICBvblVwZGF0ZT17bW9ja09uVXBkYXRlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc3dpdGNoRWwpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnY29tbW9uLmFjdGlvbk1zZy5tb2RpZmllZFVuc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBleHBlY3QobW9ja09uVXBkYXRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHRocm93IHdoZW4gb25VcGRhdGUgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPFN0YXR1c0l0ZW1cbiAgICAgICAgICBzdGF0dXM9XCJkaXNhYmxlZFwiXG4gICAgICAgICAgc2NlbmU9XCJkZXRhaWxcIlxuICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoeyBlbmFibGVkOiBmYWxzZSB9KX1cbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHN3aXRjaEVsID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIG5vdCB0aHJvd1xuICAgICAgZXhwZWN0KCgpID0+IGZpcmVFdmVudC5jbGljayhzd2l0Y2hFbCkpLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEFQSSBDYWxscyA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUZXN0IEFQSSBvcGVyYXRpb25zIGFuZCB0b2FzdCBub3RpZmljYXRpb25zXG4gIGRlc2NyaWJlKCdBUEkgT3BlcmF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgc3VjY2VzcyB0b2FzdCBvbiBzdWNjZXNzZnVsIG9wZXJhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgc3RhdHVzPVwiZGlzYWJsZWRcIlxuICAgICAgICAgIHNjZW5lPVwiZGV0YWlsXCJcbiAgICAgICAgICBkZXRhaWw9e2NyZWF0ZURldGFpbFByb3BzKHsgZW5hYmxlZDogZmFsc2UgfSl9XG4gICAgICAgICAgZGF0YXNldElkPVwiZGF0YXNldC0xMjNcIlxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc3dpdGNoRWwpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdjb21tb24uYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB0b2FzdCBvbiBmYWlsZWQgb3BlcmF0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0Rpc2FibGVEb2N1bWVudC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ05ldHdvcmsgZXJyb3InKSlcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgc3RhdHVzPVwiZW5hYmxlZFwiXG4gICAgICAgICAgc2NlbmU9XCJkZXRhaWxcIlxuICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoeyBlbmFibGVkOiB0cnVlIH0pfVxuICAgICAgICAgIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3Qgc3dpdGNoRWwgPSBzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHN3aXRjaEVsKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ2NvbW1vbi5hY3Rpb25Nc2cubW9kaWZpZWRVbnN1Y2Nlc3NmdWxseScsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCBwYXJhbWV0ZXJzIHRvIGVuYWJsZSBBUEknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImRpc2FibGVkXCJcbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcyh7IGVuYWJsZWQ6IGZhbHNlLCBpZDogJ3Rlc3QtZG9jLWlkJyB9KX1cbiAgICAgICAgICBkYXRhc2V0SWQ9XCJ0ZXN0LWRhdGFzZXQtaWRcIlxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc3dpdGNoRWwpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRW5hYmxlRG9jdW1lbnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBkYXRhc2V0SWQ6ICd0ZXN0LWRhdGFzZXQtaWQnLFxuICAgICAgICAgIGRvY3VtZW50SWQ6ICd0ZXN0LWRvYy1pZCcsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCBwYXJhbWV0ZXJzIHRvIGRpc2FibGUgQVBJJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPFN0YXR1c0l0ZW1cbiAgICAgICAgICBzdGF0dXM9XCJlbmFibGVkXCJcbiAgICAgICAgICBzY2VuZT1cImRldGFpbFwiXG4gICAgICAgICAgZGV0YWlsPXtjcmVhdGVEZXRhaWxQcm9wcyh7IGVuYWJsZWQ6IHRydWUsIGlkOiAndGVzdC1kb2MtNDU2JyB9KX1cbiAgICAgICAgICBkYXRhc2V0SWQ9XCJ0ZXN0LWRhdGFzZXQtNDU2XCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3Qgc3dpdGNoRWwgPSBzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHN3aXRjaEVsKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0Rpc2FibGVEb2N1bWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIGRhdGFzZXRJZDogJ3Rlc3QtZGF0YXNldC00NTYnLFxuICAgICAgICAgIGRvY3VtZW50SWQ6ICd0ZXN0LWRvYy00NTYnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEVkZ2UgQ2FzZXMgPT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGVzdCBib3VuZGFyeSBjb25kaXRpb25zIGFuZCB1bnVzdWFsIGlucHV0c1xuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkYXRhc2V0SWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImF2YWlsYWJsZVwiXG4gICAgICAgICAgc2NlbmU9XCJkZXRhaWxcIlxuICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgZGV0YWlsIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImF2YWlsYWJsZVwiXG4gICAgICAgICAgc2NlbmU9XCJkZXRhaWxcIlxuICAgICAgICAgIGRldGFpbD17dW5kZWZpbmVkfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBleHBlY3Qoc3dpdGNoRWwpLnRvSGF2ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJywgJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIGlkIGluIGRldGFpbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxTdGF0dXNJdGVtXG4gICAgICAgICAgc3RhdHVzPVwiZGlzYWJsZWRcIlxuICAgICAgICAgIHNjZW5lPVwiZGV0YWlsXCJcbiAgICAgICAgICBkZXRhaWw9e2NyZWF0ZURldGFpbFByb3BzKHsgZW5hYmxlZDogZmFsc2UsIGlkOiAnJyB9KX1cbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHN3aXRjaEVsID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzd2l0Y2hFbClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tFbmFibGVEb2N1bWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIGRhdGFzZXRJZDogJ2RhdGFzZXQtMTIzJyxcbiAgICAgICAgICBkb2N1bWVudElkOiAnJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBlcnJvciBtZXNzYWdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdFcnJvck1lc3NhZ2UgPSAnQScucmVwZWF0KDUwMClcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxTdGF0dXNJdGVtIHN0YXR1cz1cImVycm9yXCIgZXJyb3JNZXNzYWdlPXtsb25nRXJyb3JNZXNzYWdlfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0IC0gaG92ZXIgdG8gc2hvdyB0b29sdGlwXG4gICAgICBjb25zdCB0b29sdGlwVHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZXJyb3ItdG9vbHRpcC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5tb3VzZUVudGVyKHRvb2x0aXBUcmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nRXJyb3JNZXNzYWdlKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGVycm9yIG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzcGVjaWFsQ2hhcnMgPSAnPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PiAmIDwgPiBcIiBcXCcnXG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbSBzdGF0dXM9XCJlcnJvclwiIGVycm9yTWVzc2FnZT17c3BlY2lhbENoYXJzfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0IC0gaG92ZXIgdG8gc2hvdyB0b29sdGlwXG4gICAgICBjb25zdCB0b29sdGlwVHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZXJyb3ItdG9vbHRpcC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5tb3VzZUVudGVyKHRvb2x0aXBUcmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChzcGVjaWFsQ2hhcnMpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbGwgc3RhdHVzIHR5cGVzIGluIHNlcXVlbmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3RhdHVzZXM6IERvY3VtZW50RGlzcGxheVN0YXR1c1tdID0gW1xuICAgICAgICAncXVldWluZycsXG4gICAgICAgICdpbmRleGluZycsXG4gICAgICAgICdwYXVzZWQnLFxuICAgICAgICAnZXJyb3InLFxuICAgICAgICAnYXZhaWxhYmxlJyxcbiAgICAgICAgJ2VuYWJsZWQnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnYXJjaGl2ZWQnLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgIHN0YXR1c2VzLmZvckVhY2goKHN0YXR1cykgPT4ge1xuICAgICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPFN0YXR1c0l0ZW0gc3RhdHVzPXtzdGF0dXN9IC8+KVxuICAgICAgICBjb25zdCBpbmRpY2F0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0YXR1cy1pbmRpY2F0b3InKVxuICAgICAgICBleHBlY3QoaW5kaWNhdG9yKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIHVubW91bnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IENvbXBvbmVudCBNZW1vaXphdGlvbiA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUZXN0IFJlYWN0Lm1lbW8gYmVoYXZpb3JcbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoU3RhdHVzSXRlbSkudG9IYXZlUHJvcGVydHkoJyQkdHlwZW9mJywgU3ltYm9sLmZvcigncmVhY3QubWVtbycpKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2l0aCBzYW1lIHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIHN0YXR1czogJ2F2YWlsYWJsZScgYXMgY29uc3QsXG4gICAgICAgIHNjZW5lOiAnZGV0YWlsJyBhcyBjb25zdCxcbiAgICAgICAgZGV0YWlsOiBjcmVhdGVEZXRhaWxQcm9wcygpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPFN0YXR1c0l0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e2NyZWF0ZVF1ZXJ5Q2xpZW50KCl9PlxuICAgICAgICAgIDxTdGF0dXNJdGVtIHsuLi5wcm9wc30gLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbmRpY2F0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0YXR1cy1pbmRpY2F0b3InKVxuICAgICAgZXhwZWN0KGluZGljYXRvcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB3aGVuIHN0YXR1cyBwcm9wIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxTdGF0dXNJdGVtIHN0YXR1cz1cImF2YWlsYWJsZVwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgaW5pdGlhbCAtIGdyZWVuL3N1Y2Nlc3MgYmFja2dyb3VuZFxuICAgICAgbGV0IGluZGljYXRvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhdHVzLWluZGljYXRvcicpXG4gICAgICBleHBlY3QoaW5kaWNhdG9yKS50b0hhdmVDbGFzcygnYmctY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtc3VjY2Vzcy1iZycpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17Y3JlYXRlUXVlcnlDbGllbnQoKX0+XG4gICAgICAgICAgPFN0YXR1c0l0ZW0gc3RhdHVzPVwiZXJyb3JcIiAvPlxuICAgICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgdXBkYXRlZCAtIHJlZC9lcnJvciBiYWNrZ3JvdW5kXG4gICAgICBpbmRpY2F0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0YXR1cy1pbmRpY2F0b3InKVxuICAgICAgZXhwZWN0KGluZGljYXRvcikudG9IYXZlQ2xhc3MoJ2JnLWNvbXBvbmVudHMtYmFkZ2Utc3RhdHVzLWxpZ2h0LWVycm9yLWJnJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFN0eWxpbmcgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGVzdCBDU1MgY2xhc3NlcyBhbmQgc3R5bGluZ1xuICBkZXNjcmliZSgnU3R5bGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3Qgc3RhdHVzIHRleHQgY29sb3IgZm9yIGdyZWVuIHN0YXR1cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFN0YXR1c0l0ZW0gc3RhdHVzPVwiYXZhaWxhYmxlXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMubGlzdC5zdGF0dXMuYXZhaWxhYmxlJylcbiAgICAgIGV4cGVjdChzdGF0dXNUZXh0KS50b0hhdmVDbGFzcygndGV4dC11dGlsLWNvbG9ycy1ncmVlbi1ncmVlbi02MDAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3Qgc3RhdHVzIHRleHQgY29sb3IgZm9yIHJlZCBzdGF0dXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxTdGF0dXNJdGVtIHN0YXR1cz1cImVycm9yXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMubGlzdC5zdGF0dXMuZXJyb3InKVxuICAgICAgZXhwZWN0KHN0YXR1c1RleHQpLnRvSGF2ZUNsYXNzKCd0ZXh0LXV0aWwtY29sb3JzLXJlZC1yZWQtNjAwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjb3JyZWN0IHN0YXR1cyB0ZXh0IGNvbG9yIGZvciBvcmFuZ2Ugc3RhdHVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8U3RhdHVzSXRlbSBzdGF0dXM9XCJxdWV1aW5nXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMubGlzdC5zdGF0dXMucXVldWluZycpXG4gICAgICBleHBlY3Qoc3RhdHVzVGV4dCkudG9IYXZlQ2xhc3MoJ3RleHQtdXRpbC1jb2xvcnMtd2FybmluZy13YXJuaW5nLTYwMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBzdGF0dXMgdGV4dCBjb2xvciBmb3IgYmx1ZSBzdGF0dXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxTdGF0dXNJdGVtIHN0YXR1cz1cImluZGV4aW5nXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMubGlzdC5zdGF0dXMuaW5kZXhpbmcnKVxuICAgICAgZXhwZWN0KHN0YXR1c1RleHQpLnRvSGF2ZUNsYXNzKCd0ZXh0LXV0aWwtY29sb3JzLWJsdWUtbGlnaHQtYmx1ZS1saWdodC02MDAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3Qgc3RhdHVzIHRleHQgY29sb3IgZm9yIGdyYXkgc3RhdHVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8U3RhdHVzSXRlbSBzdGF0dXM9XCJkaXNhYmxlZFwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0RG9jdW1lbnRzLmxpc3Quc3RhdHVzLmRpc2FibGVkJylcbiAgICAgIGV4cGVjdChzdGF0dXNUZXh0KS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc3dpdGNoIHdpdGggbWQgc2l6ZSBpbiBkZXRhaWwgc2NlbmUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8U3RhdHVzSXRlbVxuICAgICAgICAgIHN0YXR1cz1cImF2YWlsYWJsZVwiXG4gICAgICAgICAgc2NlbmU9XCJkZXRhaWxcIlxuICAgICAgICAgIGRldGFpbD17Y3JlYXRlRGV0YWlsUHJvcHMoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGNoZWNrIHN3aXRjaCBoYXMgdGhlIG1kIHNpemUgY2xhc3MgKGgtNCB3LTcpXG4gICAgICBjb25zdCBzd2l0Y2hFbCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBleHBlY3Qoc3dpdGNoRWwpLnRvSGF2ZUNsYXNzKCdoLTQnLCAndy03JylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==