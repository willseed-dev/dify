"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
const tab_1 = require("./tab");
// ============================================================================
// Mock External Dependencies
// ============================================================================
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            const ns = options?.ns ? `${options.ns}.` : '';
            return `${ns}${key}`;
        },
    }),
}));
// ============================================================================
// Test Data Factories
// ============================================================================
/**
 * Factory function to create mock WorkflowRunningData
 * Provides complete defaults with optional overrides for flexibility
 */
const createWorkflowRunningData = (overrides) => ({
    task_id: 'test-task-id',
    message_id: 'test-message-id',
    conversation_id: 'test-conversation-id',
    result: {
        workflow_id: 'test-workflow-id',
        inputs: '{}',
        inputs_truncated: false,
        process_data: '{}',
        process_data_truncated: false,
        outputs: '{}',
        outputs_truncated: false,
        status: 'succeeded',
        elapsed_time: 1000,
        total_tokens: 100,
        created_at: Date.now(),
        finished_at: Date.now(),
        steps: 5,
        total_steps: 5,
        ...overrides?.result,
    },
    tracing: overrides?.tracing ?? [],
    ...overrides,
});
// ============================================================================
// Tab Component Tests
// ============================================================================
describe('Tab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests - Verify basic component rendering
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render tab with label correctly', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<tab_1.default isActive={false} label="Test Label" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert
            expect(react_1.screen.getByRole('button', { name: 'Test Label' })).toBeInTheDocument();
        });
        it('should render as button element with correct type', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'button');
        });
    });
    // -------------------------------------------------------------------------
    // Props Tests - Verify different prop combinations
    // -------------------------------------------------------------------------
    describe('Props', () => {
        describe('isActive prop', () => {
            it('should apply active styles when isActive is true', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<tab_1.default isActive={true} label="Active Tab" value="ACTIVE" workflowRunningData={workflowData} onClick={mockOnClick}/>);
                // Assert
                const button = react_1.screen.getByRole('button');
                expect(button).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
                expect(button).toHaveClass('text-text-primary');
            });
            it('should apply inactive styles when isActive is false', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label="Inactive Tab" value="INACTIVE" workflowRunningData={workflowData} onClick={mockOnClick}/>);
                // Assert
                const button = react_1.screen.getByRole('button');
                expect(button).toHaveClass('text-text-tertiary');
                expect(button).toHaveClass('border-transparent');
            });
        });
        describe('label prop', () => {
            it('should display the provided label text', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label="Custom Label Text" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
                // Assert
                expect(react_1.screen.getByText('Custom Label Text')).toBeInTheDocument();
            });
            it('should handle empty label', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label="" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
                expect(react_1.screen.getByRole('button')).toHaveTextContent('');
            });
            it('should handle long label text', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const workflowData = createWorkflowRunningData();
                const longLabel = 'This is a very long label text for testing purposes';
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label={longLabel} value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
                // Assert
                expect(react_1.screen.getByText(longLabel)).toBeInTheDocument();
            });
        });
        describe('value prop', () => {
            it('should pass value to onClick handler when clicked', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const workflowData = createWorkflowRunningData();
                const testValue = 'CUSTOM_VALUE';
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label="Test" value={testValue} workflowRunningData={workflowData} onClick={mockOnClick}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                expect(mockOnClick).toHaveBeenCalledWith(testValue);
            });
        });
        describe('workflowRunningData prop', () => {
            it('should enable button when workflowRunningData is provided', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            });
            it('should disable button when workflowRunningData is undefined', () => {
                // Arrange
                const mockOnClick = vi.fn();
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST" workflowRunningData={undefined} onClick={mockOnClick}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeDisabled();
            });
            it('should apply disabled styles when workflowRunningData is undefined', () => {
                // Arrange
                const mockOnClick = vi.fn();
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST" workflowRunningData={undefined} onClick={mockOnClick}/>);
                // Assert
                const button = react_1.screen.getByRole('button');
                expect(button).toHaveClass('!cursor-not-allowed');
                expect(button).toHaveClass('opacity-30');
            });
            it('should not have disabled styles when workflowRunningData is provided', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
                // Assert
                const button = react_1.screen.getByRole('button');
                expect(button).not.toHaveClass('!cursor-not-allowed');
                expect(button).not.toHaveClass('opacity-30');
            });
        });
    });
    // -------------------------------------------------------------------------
    // Event Handlers Tests - Verify click behavior
    // -------------------------------------------------------------------------
    describe('Event Handlers', () => {
        it('should call onClick with value when clicked', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="RESULT" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(1);
            expect(mockOnClick).toHaveBeenCalledWith('RESULT');
        });
        it('should not call onClick when disabled (no workflowRunningData)', () => {
            // Arrange
            const mockOnClick = vi.fn();
            // Act
            (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST" workflowRunningData={undefined} onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockOnClick).not.toHaveBeenCalled();
        });
        it('should handle multiple clicks correctly', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(3);
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests - Verify React.memo optimization
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should not re-render when props are the same', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            const renderSpy = vi.fn();
            const TabWithSpy = (props) => {
                renderSpy();
                return <tab_1.default {...props}/>;
            };
            const MemoizedTabWithSpy = React.memo(TabWithSpy);
            // Act
            const { rerender } = (0, react_1.render)(<MemoizedTabWithSpy isActive={false} label="Test" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Re-render with same props
            rerender(<MemoizedTabWithSpy isActive={false} label="Test" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert - React.memo should prevent re-render with same props
            expect(renderSpy).toHaveBeenCalledTimes(1);
        });
        it('should re-render when isActive prop changes', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            const { rerender } = (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert initial state
            expect(react_1.screen.getByRole('button')).toHaveClass('text-text-tertiary');
            // Rerender with changed prop
            rerender(<tab_1.default isActive={true} label="Test" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert updated state
            expect(react_1.screen.getByRole('button')).toHaveClass('text-text-primary');
        });
        it('should re-render when label prop changes', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            const { rerender } = (0, react_1.render)(<tab_1.default isActive={false} label="Original Label" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert initial state
            expect(react_1.screen.getByText('Original Label')).toBeInTheDocument();
            // Rerender with changed prop
            rerender(<tab_1.default isActive={false} label="Updated Label" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert updated state
            expect(react_1.screen.getByText('Updated Label')).toBeInTheDocument();
            expect(react_1.screen.queryByText('Original Label')).not.toBeInTheDocument();
        });
        it('should use stable handleClick callback with useCallback', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            const { rerender } = (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="TEST_VALUE" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockOnClick).toHaveBeenCalledWith('TEST_VALUE');
            // Rerender with same value and onClick
            rerender(<tab_1.default isActive={true} label="Test" value="TEST_VALUE" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockOnClick).toHaveBeenCalledTimes(2);
            expect(mockOnClick).toHaveBeenLastCalledWith('TEST_VALUE');
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests - Verify boundary conditions
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle special characters in label', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            const specialLabel = 'Tab <>&"\'';
            // Act
            (0, react_1.render)(<tab_1.default isActive={false} label={specialLabel} value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert
            expect(react_1.screen.getByText(specialLabel)).toBeInTheDocument();
        });
        it('should handle special characters in value', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<tab_1.default isActive={false} label="Test" value="SPECIAL_VALUE_123" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockOnClick).toHaveBeenCalledWith('SPECIAL_VALUE_123');
        });
        it('should handle unicode in label', () => {
            // Arrange
            const mockOnClick = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<tab_1.default isActive={false} label="结果 🚀" value="TEST" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            // Assert
            expect(react_1.screen.getByText('结果 🚀')).toBeInTheDocument();
        });
        it('should combine isActive and disabled states correctly', () => {
            // Arrange
            const mockOnClick = vi.fn();
            // Act - Active but disabled (no workflowRunningData)
            (0, react_1.render)(<tab_1.default isActive={true} label="Test" value="TEST" workflowRunningData={undefined} onClick={mockOnClick}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
            expect(button).toHaveClass('!cursor-not-allowed');
            expect(button).toHaveClass('opacity-30');
        });
    });
});
// ============================================================================
// Tabs Component Tests
// ============================================================================
describe('Tabs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests - Verify basic component rendering
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render all three tabs', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert - Check all three tabs are rendered with i18n keys
            expect(react_1.screen.getByRole('button', { name: 'runLog.result' })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'runLog.detail' })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'runLog.tracing' })).toBeInTheDocument();
        });
        it('should render container with correct styles', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            const { container } = (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert
            const tabsContainer = container.firstChild;
            expect(tabsContainer).toHaveClass('flex');
            expect(tabsContainer).toHaveClass('shrink-0');
            expect(tabsContainer).toHaveClass('items-center');
            expect(tabsContainer).toHaveClass('gap-x-6');
            expect(tabsContainer).toHaveClass('border-b-[0.5px]');
            expect(tabsContainer).toHaveClass('border-divider-subtle');
            expect(tabsContainer).toHaveClass('px-4');
        });
        it('should render exactly three tab buttons', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons).toHaveLength(3);
        });
    });
    // -------------------------------------------------------------------------
    // Props Tests - Verify different prop combinations
    // -------------------------------------------------------------------------
    describe('Props', () => {
        describe('currentTab prop', () => {
            it('should set RESULT tab as active when currentTab is RESULT', () => {
                // Arrange
                const mockSwitchTab = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
                // Assert
                const resultTab = react_1.screen.getByRole('button', { name: 'runLog.result' });
                const detailTab = react_1.screen.getByRole('button', { name: 'runLog.detail' });
                const tracingTab = react_1.screen.getByRole('button', { name: 'runLog.tracing' });
                expect(resultTab).toHaveClass('text-text-primary');
                expect(detailTab).toHaveClass('text-text-tertiary');
                expect(tracingTab).toHaveClass('text-text-tertiary');
            });
            it('should set DETAIL tab as active when currentTab is DETAIL', () => {
                // Arrange
                const mockSwitchTab = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<index_1.default currentTab="DETAIL" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
                // Assert
                const resultTab = react_1.screen.getByRole('button', { name: 'runLog.result' });
                const detailTab = react_1.screen.getByRole('button', { name: 'runLog.detail' });
                const tracingTab = react_1.screen.getByRole('button', { name: 'runLog.tracing' });
                expect(resultTab).toHaveClass('text-text-tertiary');
                expect(detailTab).toHaveClass('text-text-primary');
                expect(tracingTab).toHaveClass('text-text-tertiary');
            });
            it('should set TRACING tab as active when currentTab is TRACING', () => {
                // Arrange
                const mockSwitchTab = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<index_1.default currentTab="TRACING" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
                // Assert
                const resultTab = react_1.screen.getByRole('button', { name: 'runLog.result' });
                const detailTab = react_1.screen.getByRole('button', { name: 'runLog.detail' });
                const tracingTab = react_1.screen.getByRole('button', { name: 'runLog.tracing' });
                expect(resultTab).toHaveClass('text-text-tertiary');
                expect(detailTab).toHaveClass('text-text-tertiary');
                expect(tracingTab).toHaveClass('text-text-primary');
            });
            it('should handle unknown currentTab gracefully', () => {
                // Arrange
                const mockSwitchTab = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<index_1.default currentTab="UNKNOWN" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
                // Assert - All tabs should be inactive
                const resultTab = react_1.screen.getByRole('button', { name: 'runLog.result' });
                const detailTab = react_1.screen.getByRole('button', { name: 'runLog.detail' });
                const tracingTab = react_1.screen.getByRole('button', { name: 'runLog.tracing' });
                expect(resultTab).toHaveClass('text-text-tertiary');
                expect(detailTab).toHaveClass('text-text-tertiary');
                expect(tracingTab).toHaveClass('text-text-tertiary');
            });
        });
        describe('workflowRunningData prop', () => {
            it('should enable all tabs when workflowRunningData is provided', () => {
                // Arrange
                const mockSwitchTab = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
                // Assert
                const buttons = react_1.screen.getAllByRole('button');
                buttons.forEach((button) => {
                    expect(button).not.toBeDisabled();
                });
            });
            it('should disable all tabs when workflowRunningData is undefined', () => {
                // Arrange
                const mockSwitchTab = vi.fn();
                // Act
                (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={undefined} switchTab={mockSwitchTab}/>);
                // Assert
                const buttons = react_1.screen.getAllByRole('button');
                buttons.forEach((button) => {
                    expect(button).toBeDisabled();
                    expect(button).toHaveClass('opacity-30');
                });
            });
            it('should pass workflowRunningData to all Tab components', () => {
                // Arrange
                const mockSwitchTab = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
                // Assert - All tabs should be enabled (workflowRunningData passed)
                const buttons = react_1.screen.getAllByRole('button');
                buttons.forEach((button) => {
                    expect(button).not.toHaveClass('opacity-30');
                });
            });
        });
        describe('switchTab prop', () => {
            it('should pass switchTab function to Tab onClick', () => {
                // Arrange
                const mockSwitchTab = vi.fn();
                const workflowData = createWorkflowRunningData();
                // Act
                (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.detail' }));
                // Assert
                expect(mockSwitchTab).toHaveBeenCalledWith('DETAIL');
            });
        });
    });
    // -------------------------------------------------------------------------
    // Event Handlers Tests - Verify click behavior
    // -------------------------------------------------------------------------
    describe('Event Handlers', () => {
        it('should call switchTab with RESULT when RESULT tab is clicked', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="DETAIL" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.result' }));
            // Assert
            expect(mockSwitchTab).toHaveBeenCalledWith('RESULT');
        });
        it('should call switchTab with DETAIL when DETAIL tab is clicked', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.detail' }));
            // Assert
            expect(mockSwitchTab).toHaveBeenCalledWith('DETAIL');
        });
        it('should call switchTab with TRACING when TRACING tab is clicked', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.tracing' }));
            // Assert
            expect(mockSwitchTab).toHaveBeenCalledWith('TRACING');
        });
        it('should not call switchTab when tabs are disabled', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={undefined} switchTab={mockSwitchTab}/>);
            const buttons = react_1.screen.getAllByRole('button');
            buttons.forEach((button) => {
                react_1.fireEvent.click(button);
            });
            // Assert
            expect(mockSwitchTab).not.toHaveBeenCalled();
        });
        it('should allow clicking the currently active tab', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.result' }));
            // Assert
            expect(mockSwitchTab).toHaveBeenCalledWith('RESULT');
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests - Verify React.memo optimization
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should not re-render when props are the same', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            const renderSpy = vi.fn();
            const TabsWithSpy = (props) => {
                renderSpy();
                return <index_1.default {...props}/>;
            };
            const MemoizedTabsWithSpy = React.memo(TabsWithSpy);
            // Act
            const { rerender } = (0, react_1.render)(<MemoizedTabsWithSpy currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Re-render with same props
            rerender(<MemoizedTabsWithSpy currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert - React.memo should prevent re-render with same props
            expect(renderSpy).toHaveBeenCalledTimes(1);
        });
        it('should re-render when currentTab changes', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert initial state
            expect(react_1.screen.getByRole('button', { name: 'runLog.result' })).toHaveClass('text-text-primary');
            // Rerender with changed prop
            rerender(<index_1.default currentTab="DETAIL" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert updated state
            expect(react_1.screen.getByRole('button', { name: 'runLog.result' })).toHaveClass('text-text-tertiary');
            expect(react_1.screen.getByRole('button', { name: 'runLog.detail' })).toHaveClass('text-text-primary');
        });
        it('should re-render when workflowRunningData changes from undefined to defined', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={undefined} switchTab={mockSwitchTab}/>);
            // Assert initial disabled state
            const buttons = react_1.screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).toBeDisabled();
            });
            // Rerender with workflowRunningData
            rerender(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert enabled state
            const updatedButtons = react_1.screen.getAllByRole('button');
            updatedButtons.forEach((button) => {
                expect(button).not.toBeDisabled();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests - Verify boundary conditions
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty string currentTab', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert - All tabs should be inactive
            const buttons = react_1.screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).toHaveClass('text-text-tertiary');
            });
        });
        it('should handle case-sensitive tab values', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act - lowercase "result" should not match "RESULT"
            (0, react_1.render)(<index_1.default currentTab="result" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert - Result tab should not be active (case mismatch)
            expect(react_1.screen.getByRole('button', { name: 'runLog.result' })).toHaveClass('text-text-tertiary');
        });
        it('should handle whitespace in currentTab', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab=" RESULT " workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert - Should not match due to whitespace
            expect(react_1.screen.getByRole('button', { name: 'runLog.result' })).toHaveClass('text-text-tertiary');
        });
        it('should render correctly with minimal workflowRunningData', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const minimalWorkflowData = {
                result: {
                    inputs_truncated: false,
                    process_data_truncated: false,
                    outputs_truncated: false,
                    status: 'running',
                },
            };
            // Act
            (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={minimalWorkflowData} switchTab={mockSwitchTab}/>);
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).not.toBeDisabled();
            });
        });
        it('should maintain tab order (RESULT, DETAIL, TRACING)', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons[0]).toHaveTextContent('runLog.result');
            expect(buttons[1]).toHaveTextContent('runLog.detail');
            expect(buttons[2]).toHaveTextContent('runLog.tracing');
        });
    });
    // -------------------------------------------------------------------------
    // Integration Tests - Verify Tab and Tabs work together
    // -------------------------------------------------------------------------
    describe('Integration', () => {
        it('should correctly pass all props to child Tab components', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act
            (0, react_1.render)(<index_1.default currentTab="DETAIL" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert - Verify each tab has correct props
            const resultTab = react_1.screen.getByRole('button', { name: 'runLog.result' });
            const detailTab = react_1.screen.getByRole('button', { name: 'runLog.detail' });
            const tracingTab = react_1.screen.getByRole('button', { name: 'runLog.tracing' });
            // Check active states
            expect(resultTab).toHaveClass('text-text-tertiary');
            expect(detailTab).toHaveClass('text-text-primary');
            expect(tracingTab).toHaveClass('text-text-tertiary');
            // Check enabled states
            expect(resultTab).not.toBeDisabled();
            expect(detailTab).not.toBeDisabled();
            expect(tracingTab).not.toBeDisabled();
            // Check click handlers
            react_1.fireEvent.click(resultTab);
            expect(mockSwitchTab).toHaveBeenCalledWith('RESULT');
            react_1.fireEvent.click(tracingTab);
            expect(mockSwitchTab).toHaveBeenCalledWith('TRACING');
        });
        it('should support full tab switching workflow', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            let currentTab = 'RESULT';
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentTab={currentTab} workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Simulate clicking DETAIL tab
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.detail' }));
            expect(mockSwitchTab).toHaveBeenCalledWith('DETAIL');
            // Update currentTab and rerender (simulating parent state update)
            currentTab = 'DETAIL';
            rerender(<index_1.default currentTab={currentTab} workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert DETAIL is now active
            expect(react_1.screen.getByRole('button', { name: 'runLog.detail' })).toHaveClass('text-text-primary');
            // Simulate clicking TRACING tab
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.tracing' }));
            expect(mockSwitchTab).toHaveBeenCalledWith('TRACING');
            // Update currentTab and rerender
            currentTab = 'TRACING';
            rerender(<index_1.default currentTab={currentTab} workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Assert TRACING is now active
            expect(react_1.screen.getByRole('button', { name: 'runLog.tracing' })).toHaveClass('text-text-primary');
        });
        it('should transition from disabled to enabled state', () => {
            // Arrange
            const mockSwitchTab = vi.fn();
            const workflowData = createWorkflowRunningData();
            // Act - Initial disabled state
            const { rerender } = (0, react_1.render)(<index_1.default currentTab="RESULT" workflowRunningData={undefined} switchTab={mockSwitchTab}/>);
            // Try clicking - should not trigger
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.detail' }));
            expect(mockSwitchTab).not.toHaveBeenCalled();
            // Enable tabs
            rerender(<index_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            // Now click should work
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'runLog.detail' }));
            expect(mockSwitchTab).toHaveBeenCalledWith('DETAIL');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixtQ0FBMEI7QUFDMUIsK0JBQXVCO0FBRXZCLCtFQUErRTtBQUMvRSw2QkFBNkI7QUFDN0IsK0VBQStFO0FBRS9FLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUIsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckIsQ0FBQyxFQUFFLENBQUMsR0FBVyxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUM1QyxNQUFNLEVBQUUsR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1lBQzlDLE9BQU8sR0FBRyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUE7UUFDdEIsQ0FBQztLQUNGLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILCtFQUErRTtBQUMvRSxzQkFBc0I7QUFDdEIsK0VBQStFO0FBRS9FOzs7R0FHRztBQUNILE1BQU0seUJBQXlCLEdBQUcsQ0FDaEMsU0FBd0MsRUFDbkIsRUFBRSxDQUFDLENBQUM7SUFDekIsT0FBTyxFQUFFLGNBQWM7SUFDdkIsVUFBVSxFQUFFLGlCQUFpQjtJQUM3QixlQUFlLEVBQUUsc0JBQXNCO0lBQ3ZDLE1BQU0sRUFBRTtRQUNOLFdBQVcsRUFBRSxrQkFBa0I7UUFDL0IsTUFBTSxFQUFFLElBQUk7UUFDWixnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLHNCQUFzQixFQUFFLEtBQUs7UUFDN0IsT0FBTyxFQUFFLElBQUk7UUFDYixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLE1BQU0sRUFBRSxXQUFXO1FBQ25CLFlBQVksRUFBRSxJQUFJ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LENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtZQUU1QyxjQUFjO1lBQ2QsUUFBUSxDQUNOLENBQUMsZUFBSSxDQUNILFVBQVUsQ0FBQyxRQUFRLENBQ25CLG1CQUFtQixDQUFDLENBQUMsWUFBWSxDQUFDLENBQ2xDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUN6QixDQUNILENBQUE7WUFFRCx3QkFBd0I7WUFDeEIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ3RFLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN0RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFdvcmtmbG93UnVubmluZ0RhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBUYWJzIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgVGFiIGZyb20gJy4vdGFiJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG52aS5tb2NrKCdyZWFjdC1pMThuZXh0JywgKCkgPT4gKHtcbiAgdXNlVHJhbnNsYXRpb246ICgpID0+ICh7XG4gICAgdDogKGtleTogc3RyaW5nLCBvcHRpb25zPzogeyBucz86IHN0cmluZyB9KSA9PiB7XG4gICAgICBjb25zdCBucyA9IG9wdGlvbnM/Lm5zID8gYCR7b3B0aW9ucy5uc30uYCA6ICcnXG4gICAgICByZXR1cm4gYCR7bnN9JHtrZXl9YFxuICAgIH0sXG4gIH0pLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBGYWN0b3JpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBtb2NrIFdvcmtmbG93UnVubmluZ0RhdGFcbiAqIFByb3ZpZGVzIGNvbXBsZXRlIGRlZmF1bHRzIHdpdGggb3B0aW9uYWwgb3ZlcnJpZGVzIGZvciBmbGV4aWJpbGl0eVxuICovXG5jb25zdCBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhID0gKFxuICBvdmVycmlkZXM/OiBQYXJ0aWFsPFdvcmtmbG93UnVubmluZ0RhdGE+LFxuKTogV29ya2Zsb3dSdW5uaW5nRGF0YSA9PiAoe1xuICB0YXNrX2lkOiAndGVzdC10YXNrLWlkJyxcbiAgbWVzc2FnZV9pZDogJ3Rlc3QtbWVzc2FnZS1pZCcsXG4gIGNvbnZlcnNhdGlvbl9pZDogJ3Rlc3QtY29udmVyc2F0aW9uLWlkJyxcbiAgcmVzdWx0OiB7XG4gICAgd29ya2Zsb3dfaWQ6ICd0ZXN0LXdvcmtmbG93LWlkJyxcbiAgICBpbnB1dHM6ICd7fScsXG4gICAgaW5wdXRzX3RydW5jYXRlZDogZmFsc2UsXG4gICAgcHJvY2Vzc19kYXRhOiAne30nLFxuICAgIHByb2Nlc3NfZGF0YV90cnVuY2F0ZWQ6IGZhbHNlLFxuICAgIG91dHB1dHM6ICd7fScsXG4gICAgb3V0cHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gICAgZWxhcHNlZF90aW1lOiAxMDAwLFxuICAgIHRvdGFsX3Rva2VuczogMTAwLFxuICAgIGNyZWF0ZWRfYXQ6IERhdGUubm93KCksXG4gICAgZmluaXNoZWRfYXQ6IERhdGUubm93KCksXG4gICAgc3RlcHM6IDUsXG4gICAgdG90YWxfc3RlcHM6IDUsXG4gICAgLi4ub3ZlcnJpZGVzPy5yZXN1bHQsXG4gIH0sXG4gIHRyYWNpbmc6IG92ZXJyaWRlcz8udHJhY2luZyA/PyBbXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGFiIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnVGFiJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0cyAtIFZlcmlmeSBiYXNpYyBjb21wb25lbnQgcmVuZGVyaW5nXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0YWIgd2l0aCBsYWJlbCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICBsYWJlbD1cIlRlc3QgTGFiZWxcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnVGVzdCBMYWJlbCcgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXMgYnV0dG9uIGVsZW1lbnQgd2l0aCBjb3JyZWN0IHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByb3BzIFRlc3RzIC0gVmVyaWZ5IGRpZmZlcmVudCBwcm9wIGNvbWJpbmF0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnaXNBY3RpdmUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgYWN0aXZlIHN0eWxlcyB3aGVuIGlzQWN0aXZlIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPFRhYlxuICAgICAgICAgICAgaXNBY3RpdmU9e3RydWV9XG4gICAgICAgICAgICBsYWJlbD1cIkFjdGl2ZSBUYWJcIlxuICAgICAgICAgICAgdmFsdWU9XCJBQ1RJVkVcIlxuICAgICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ2JvcmRlci11dGlsLWNvbG9ycy1ibHVlLWJyYW5kLWJsdWUtYnJhbmQtNjAwJylcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1wcmltYXJ5JylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgaW5hY3RpdmUgc3R5bGVzIHdoZW4gaXNBY3RpdmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPFRhYlxuICAgICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgICAgbGFiZWw9XCJJbmFjdGl2ZSBUYWJcIlxuICAgICAgICAgICAgdmFsdWU9XCJJTkFDVElWRVwiXG4gICAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9XG4gICAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgICBleHBlY3QoYnV0dG9uKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ2JvcmRlci10cmFuc3BhcmVudCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnbGFiZWwgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGlzcGxheSB0aGUgcHJvdmlkZWQgbGFiZWwgdGV4dCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFiXG4gICAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgICBsYWJlbD1cIkN1c3RvbSBMYWJlbCBUZXh0XCJcbiAgICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9XG4gICAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tIExhYmVsIFRleHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgbGFiZWwnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPFRhYlxuICAgICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgICAgbGFiZWw9XCJcIlxuICAgICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvSGF2ZVRleHRDb250ZW50KCcnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbG9uZyBsYWJlbCB0ZXh0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuICAgICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcbiAgICAgICAgY29uc3QgbG9uZ0xhYmVsID0gJ1RoaXMgaXMgYSB2ZXJ5IGxvbmcgbGFiZWwgdGV4dCBmb3IgdGVzdGluZyBwdXJwb3NlcydcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxUYWJcbiAgICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICAgIGxhYmVsPXtsb25nTGFiZWx9XG4gICAgICAgICAgICB2YWx1ZT1cIlRFU1RcIlxuICAgICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ0xhYmVsKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3ZhbHVlIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3MgdmFsdWUgdG8gb25DbGljayBoYW5kbGVyIHdoZW4gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG4gICAgICAgIGNvbnN0IHRlc3RWYWx1ZSA9ICdDVVNUT01fVkFMVUUnXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFiXG4gICAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgICAgdmFsdWU9e3Rlc3RWYWx1ZX1cbiAgICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0ZXN0VmFsdWUpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnd29ya2Zsb3dSdW5uaW5nRGF0YSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBlbmFibGUgYnV0dG9uIHdoZW4gd29ya2Zsb3dSdW5uaW5nRGF0YSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFiXG4gICAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgYnV0dG9uIHdoZW4gd29ya2Zsb3dSdW5uaW5nRGF0YSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFiXG4gICAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3VuZGVmaW5lZH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgZGlzYWJsZWQgc3R5bGVzIHdoZW4gd29ya2Zsb3dSdW5uaW5nRGF0YSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFiXG4gICAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3VuZGVmaW5lZH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCchY3Vyc29yLW5vdC1hbGxvd2VkJylcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ29wYWNpdHktMzAnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBkaXNhYmxlZCBzdHlsZXMgd2hlbiB3b3JrZmxvd1J1bm5pbmdEYXRhIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuICAgICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxUYWJcbiAgICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICAgIGxhYmVsPVwiVGVzdFwiXG4gICAgICAgICAgICB2YWx1ZT1cIlRFU1RcIlxuICAgICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikubm90LnRvSGF2ZUNsYXNzKCchY3Vyc29yLW5vdC1hbGxvd2VkJylcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikubm90LnRvSGF2ZUNsYXNzKCdvcGFjaXR5LTMwJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEV2ZW50IEhhbmRsZXJzIFRlc3RzIC0gVmVyaWZ5IGNsaWNrIGJlaGF2aW9yXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsaWNrIHdpdGggdmFsdWUgd2hlbiBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0XCJcbiAgICAgICAgICB2YWx1ZT1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnUkVTVUxUJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNsaWNrIHdoZW4gZGlzYWJsZWQgKG5vIHdvcmtmbG93UnVubmluZ0RhdGEpJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFiXG4gICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgIGxhYmVsPVwiVGVzdFwiXG4gICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DbGljaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBjbGlja3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0XCJcbiAgICAgICAgICB2YWx1ZT1cIlRFU1RcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzIC0gVmVyaWZ5IFJlYWN0Lm1lbW8gb3B0aW1pemF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHJlLXJlbmRlciB3aGVuIHByb3BzIGFyZSB0aGUgc2FtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG4gICAgICBjb25zdCByZW5kZXJTcHkgPSB2aS5mbigpXG5cbiAgICAgIGNvbnN0IFRhYldpdGhTcHk6IFJlYWN0LkZDPFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBUYWI+PiA9IChwcm9wcykgPT4ge1xuICAgICAgICByZW5kZXJTcHkoKVxuICAgICAgICByZXR1cm4gPFRhYiB7Li4ucHJvcHN9IC8+XG4gICAgICB9XG4gICAgICBjb25zdCBNZW1vaXplZFRhYldpdGhTcHkgPSBSZWFjdC5tZW1vKFRhYldpdGhTcHkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8TWVtb2l6ZWRUYWJXaXRoU3B5XG4gICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgIGxhYmVsPVwiVGVzdFwiXG4gICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9XG4gICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBSZS1yZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPE1lbW9pemVkVGFiV2l0aFNweVxuICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gUmVhY3QubWVtbyBzaG91bGQgcHJldmVudCByZS1yZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICBleHBlY3QocmVuZGVyU3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1yZW5kZXIgd2hlbiBpc0FjdGl2ZSBwcm9wIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggY2hhbmdlZCBwcm9wXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXt0cnVlfVxuICAgICAgICAgIGxhYmVsPVwiVGVzdFwiXG4gICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9XG4gICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgdXBkYXRlZCBzdGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXByaW1hcnknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIGxhYmVsIHByb3AgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8VGFiXG4gICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgIGxhYmVsPVwiT3JpZ2luYWwgTGFiZWxcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPcmlnaW5hbCBMYWJlbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggY2hhbmdlZCBwcm9wXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICBsYWJlbD1cIlVwZGF0ZWQgTGFiZWxcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IHVwZGF0ZWQgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdVcGRhdGVkIExhYmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ09yaWdpbmFsIExhYmVsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHN0YWJsZSBoYW5kbGVDbGljayBjYWxsYmFjayB3aXRoIHVzZUNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0XCJcbiAgICAgICAgICB2YWx1ZT1cIlRFU1RfVkFMVUVcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcbiAgICAgIGV4cGVjdChtb2NrT25DbGljaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ1RFU1RfVkFMVUUnKVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIHNhbWUgdmFsdWUgYW5kIG9uQ2xpY2tcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8VGFiXG4gICAgICAgICAgaXNBY3RpdmU9e3RydWV9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0XCJcbiAgICAgICAgICB2YWx1ZT1cIlRFU1RfVkFMVUVcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcbiAgICAgIGV4cGVjdChtb2NrT25DbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgICBleHBlY3QobW9ja09uQ2xpY2spLnRvSGF2ZUJlZW5MYXN0Q2FsbGVkV2l0aCgnVEVTVF9WQUxVRScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHMgLSBWZXJpZnkgYm91bmRhcnkgY29uZGl0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBsYWJlbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG4gICAgICBjb25zdCBzcGVjaWFsTGFiZWwgPSAnVGFiIDw+JlwiXFwnJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICBsYWJlbD17c3BlY2lhbExhYmVsfVxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChzcGVjaWFsTGFiZWwpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFiXG4gICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgIGxhYmVsPVwiVGVzdFwiXG4gICAgICAgICAgdmFsdWU9XCJTUEVDSUFMX1ZBTFVFXzEyM1wiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdTUEVDSUFMX1ZBTFVFXzEyMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuaWNvZGUgaW4gbGFiZWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICBsYWJlbD1cIue7k+aenCDwn5qAXCJcbiAgICAgICAgICB2YWx1ZT1cIlRFU1RcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ+e7k+aenCDwn5qAJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21iaW5lIGlzQWN0aXZlIGFuZCBkaXNhYmxlZCBzdGF0ZXMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdCAtIEFjdGl2ZSBidXQgZGlzYWJsZWQgKG5vIHdvcmtmbG93UnVubmluZ0RhdGEpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17dHJ1ZX1cbiAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdib3JkZXItdXRpbC1jb2xvcnMtYmx1ZS1icmFuZC1ibHVlLWJyYW5kLTYwMCcpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0hhdmVDbGFzcygnIWN1cnNvci1ub3QtYWxsb3dlZCcpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0hhdmVDbGFzcygnb3BhY2l0eS0zMCcpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRhYnMgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdUYWJzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0cyAtIFZlcmlmeSBiYXNpYyBjb21wb25lbnQgcmVuZGVyaW5nXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgdGhyZWUgdGFicycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tTd2l0Y2hUYWIgPSB2aS5mbigpXG4gICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGFsbCB0aHJlZSB0YWJzIGFyZSByZW5kZXJlZCB3aXRoIGkxOG4ga2V5c1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5yZXN1bHQnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLmRldGFpbCcgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cudHJhY2luZycgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29udGFpbmVyIHdpdGggY29ycmVjdCBzdHlsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9XG4gICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB0YWJzQ29udGFpbmVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGRcbiAgICAgIGV4cGVjdCh0YWJzQ29udGFpbmVyKS50b0hhdmVDbGFzcygnZmxleCcpXG4gICAgICBleHBlY3QodGFic0NvbnRhaW5lcikudG9IYXZlQ2xhc3MoJ3Nocmluay0wJylcbiAgICAgIGV4cGVjdCh0YWJzQ29udGFpbmVyKS50b0hhdmVDbGFzcygnaXRlbXMtY2VudGVyJylcbiAgICAgIGV4cGVjdCh0YWJzQ29udGFpbmVyKS50b0hhdmVDbGFzcygnZ2FwLXgtNicpXG4gICAgICBleHBlY3QodGFic0NvbnRhaW5lcikudG9IYXZlQ2xhc3MoJ2JvcmRlci1iLVswLjVweF0nKVxuICAgICAgZXhwZWN0KHRhYnNDb250YWluZXIpLnRvSGF2ZUNsYXNzKCdib3JkZXItZGl2aWRlci1zdWJ0bGUnKVxuICAgICAgZXhwZWN0KHRhYnNDb250YWluZXIpLnRvSGF2ZUNsYXNzKCdweC00JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZXhhY3RseSB0aHJlZSB0YWIgYnV0dG9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tTd2l0Y2hUYWIgPSB2aS5mbigpXG4gICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9ucykudG9IYXZlTGVuZ3RoKDMpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByb3BzIFRlc3RzIC0gVmVyaWZ5IGRpZmZlcmVudCBwcm9wIGNvbWJpbmF0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnY3VycmVudFRhYiBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBzZXQgUkVTVUxUIHRhYiBhcyBhY3RpdmUgd2hlbiBjdXJyZW50VGFiIGlzIFJFU1VMVCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxUYWJzXG4gICAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCByZXN1bHRUYWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cucmVzdWx0JyB9KVxuICAgICAgICBjb25zdCBkZXRhaWxUYWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cuZGV0YWlsJyB9KVxuICAgICAgICBjb25zdCB0cmFjaW5nVGFiID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLnRyYWNpbmcnIH0pXG5cbiAgICAgICAgZXhwZWN0KHJlc3VsdFRhYikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1wcmltYXJ5JylcbiAgICAgICAgZXhwZWN0KGRldGFpbFRhYikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgICAgIGV4cGVjdCh0cmFjaW5nVGFiKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2V0IERFVEFJTCB0YWIgYXMgYWN0aXZlIHdoZW4gY3VycmVudFRhYiBpcyBERVRBSUwnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFic1xuICAgICAgICAgICAgY3VycmVudFRhYj1cIkRFVEFJTFwiXG4gICAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9XG4gICAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgcmVzdWx0VGFiID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLnJlc3VsdCcgfSlcbiAgICAgICAgY29uc3QgZGV0YWlsVGFiID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLmRldGFpbCcgfSlcbiAgICAgICAgY29uc3QgdHJhY2luZ1RhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy50cmFjaW5nJyB9KVxuXG4gICAgICAgIGV4cGVjdChyZXN1bHRUYWIpLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtdGVydGlhcnknKVxuICAgICAgICBleHBlY3QoZGV0YWlsVGFiKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXByaW1hcnknKVxuICAgICAgICBleHBlY3QodHJhY2luZ1RhYikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNldCBUUkFDSU5HIHRhYiBhcyBhY3RpdmUgd2hlbiBjdXJyZW50VGFiIGlzIFRSQUNJTkcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFic1xuICAgICAgICAgICAgY3VycmVudFRhYj1cIlRSQUNJTkdcIlxuICAgICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IHJlc3VsdFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5yZXN1bHQnIH0pXG4gICAgICAgIGNvbnN0IGRldGFpbFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5kZXRhaWwnIH0pXG4gICAgICAgIGNvbnN0IHRyYWNpbmdUYWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cudHJhY2luZycgfSlcblxuICAgICAgICBleHBlY3QocmVzdWx0VGFiKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgICAgZXhwZWN0KGRldGFpbFRhYikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgICAgIGV4cGVjdCh0cmFjaW5nVGFiKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXByaW1hcnknKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5rbm93biBjdXJyZW50VGFiIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFic1xuICAgICAgICAgICAgY3VycmVudFRhYj1cIlVOS05PV05cIlxuICAgICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQWxsIHRhYnMgc2hvdWxkIGJlIGluYWN0aXZlXG4gICAgICAgIGNvbnN0IHJlc3VsdFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5yZXN1bHQnIH0pXG4gICAgICAgIGNvbnN0IGRldGFpbFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5kZXRhaWwnIH0pXG4gICAgICAgIGNvbnN0IHRyYWNpbmdUYWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cudHJhY2luZycgfSlcblxuICAgICAgICBleHBlY3QocmVzdWx0VGFiKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgICAgZXhwZWN0KGRldGFpbFRhYikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgICAgIGV4cGVjdCh0cmFjaW5nVGFiKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3b3JrZmxvd1J1bm5pbmdEYXRhIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGVuYWJsZSBhbGwgdGFicyB3aGVuIHdvcmtmbG93UnVubmluZ0RhdGEgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGFic1xuICAgICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9XG4gICAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICAgIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgYWxsIHRhYnMgd2hlbiB3b3JrZmxvd1J1bm5pbmdEYXRhIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPFRhYnNcbiAgICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17dW5kZWZpbmVkfVxuICAgICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgIGV4cGVjdChidXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ29wYWNpdHktMzAnKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHdvcmtmbG93UnVubmluZ0RhdGEgdG8gYWxsIFRhYiBjb21wb25lbnRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tTd2l0Y2hUYWIgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPFRhYnNcbiAgICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQWxsIHRhYnMgc2hvdWxkIGJlIGVuYWJsZWQgKHdvcmtmbG93UnVubmluZ0RhdGEgcGFzc2VkKVxuICAgICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICBleHBlY3QoYnV0dG9uKS5ub3QudG9IYXZlQ2xhc3MoJ29wYWNpdHktMzAnKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3N3aXRjaFRhYiBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHN3aXRjaFRhYiBmdW5jdGlvbiB0byBUYWIgb25DbGljaycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxUYWJzXG4gICAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLmRldGFpbCcgfSkpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrU3dpdGNoVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnREVUQUlMJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEV2ZW50IEhhbmRsZXJzIFRlc3RzIC0gVmVyaWZ5IGNsaWNrIGJlaGF2aW9yXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBzd2l0Y2hUYWIgd2l0aCBSRVNVTFQgd2hlbiBSRVNVTFQgdGFiIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJERVRBSUxcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5yZXN1bHQnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3dpdGNoVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnUkVTVUxUJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHN3aXRjaFRhYiB3aXRoIERFVEFJTCB3aGVuIERFVEFJTCB0YWIgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tTd2l0Y2hUYWIgPSB2aS5mbigpXG4gICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLmRldGFpbCcgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTd2l0Y2hUYWIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdERVRBSUwnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc3dpdGNoVGFiIHdpdGggVFJBQ0lORyB3aGVuIFRSQUNJTkcgdGFiIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy50cmFjaW5nJyB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1N3aXRjaFRhYikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ1RSQUNJTkcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIHN3aXRjaFRhYiB3aGVuIHRhYnMgYXJlIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17dW5kZWZpbmVkfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTd2l0Y2hUYWIpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBjbGlja2luZyB0aGUgY3VycmVudGx5IGFjdGl2ZSB0YWInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5yZXN1bHQnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3dpdGNoVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnUkVTVUxUJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHMgLSBWZXJpZnkgUmVhY3QubWVtbyBvcHRpbWl6YXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3QgcmUtcmVuZGVyIHdoZW4gcHJvcHMgYXJlIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuICAgICAgY29uc3QgcmVuZGVyU3B5ID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCBUYWJzV2l0aFNweTogUmVhY3QuRkM8UmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIFRhYnM+PiA9IChwcm9wcykgPT4ge1xuICAgICAgICByZW5kZXJTcHkoKVxuICAgICAgICByZXR1cm4gPFRhYnMgey4uLnByb3BzfSAvPlxuICAgICAgfVxuICAgICAgY29uc3QgTWVtb2l6ZWRUYWJzV2l0aFNweSA9IFJlYWN0Lm1lbW8oVGFic1dpdGhTcHkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8TWVtb2l6ZWRUYWJzV2l0aFNweVxuICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBSZS1yZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPE1lbW9pemVkVGFic1dpdGhTcHlcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9XG4gICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gUmVhY3QubWVtbyBzaG91bGQgcHJldmVudCByZS1yZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICBleHBlY3QocmVuZGVyU3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1yZW5kZXIgd2hlbiBjdXJyZW50VGFiIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgaW5pdGlhbCBzdGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5yZXN1bHQnIH0pKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXByaW1hcnknKVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIGNoYW5nZWQgcHJvcFxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIkRFVEFJTFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCB1cGRhdGVkIHN0YXRlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLnJlc3VsdCcgfSkpLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtdGVydGlhcnknKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5kZXRhaWwnIH0pKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXByaW1hcnknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIHdvcmtmbG93UnVubmluZ0RhdGEgY2hhbmdlcyBmcm9tIHVuZGVmaW5lZCB0byBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt1bmRlZmluZWR9XG4gICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgZGlzYWJsZWQgc3RhdGVcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggd29ya2Zsb3dSdW5uaW5nRGF0YVxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCBlbmFibGVkIHN0YXRlXG4gICAgICBjb25zdCB1cGRhdGVkQnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICB1cGRhdGVkQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzIC0gVmVyaWZ5IGJvdW5kYXJ5IGNvbmRpdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgY3VycmVudFRhYicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tTd2l0Y2hUYWIgPSB2aS5mbigpXG4gICAgICBjb25zdCB3b3JrZmxvd0RhdGEgPSBjcmVhdGVXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIEFsbCB0YWJzIHNob3VsZCBiZSBpbmFjdGl2ZVxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBleHBlY3QoYnV0dG9uKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNhc2Utc2Vuc2l0aXZlIHRhYiB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdCAtIGxvd2VyY2FzZSBcInJlc3VsdFwiIHNob3VsZCBub3QgbWF0Y2ggXCJSRVNVTFRcIlxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJyZXN1bHRcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBSZXN1bHQgdGFiIHNob3VsZCBub3QgYmUgYWN0aXZlIChjYXNlIG1pc21hdGNoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5yZXN1bHQnIH0pKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgd2hpdGVzcGFjZSBpbiBjdXJyZW50VGFiJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiIFJFU1VMVCBcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IG1hdGNoIGR1ZSB0byB3aGl0ZXNwYWNlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLnJlc3VsdCcgfSkpLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtdGVydGlhcnknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2l0aCBtaW5pbWFsIHdvcmtmbG93UnVubmluZ0RhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3QgbWluaW1hbFdvcmtmbG93RGF0YTogV29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgaW5wdXRzX3RydW5jYXRlZDogZmFsc2UsXG4gICAgICAgICAgcHJvY2Vzc19kYXRhX3RydW5jYXRlZDogZmFsc2UsXG4gICAgICAgICAgb3V0cHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgIHN0YXR1czogJ3J1bm5pbmcnLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXttaW5pbWFsV29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBleHBlY3QoYnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gdGFiIG9yZGVyIChSRVNVTFQsIERFVEFJTCwgVFJBQ0lORyknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnNbMF0pLnRvSGF2ZVRleHRDb250ZW50KCdydW5Mb2cucmVzdWx0JylcbiAgICAgIGV4cGVjdChidXR0b25zWzFdKS50b0hhdmVUZXh0Q29udGVudCgncnVuTG9nLmRldGFpbCcpXG4gICAgICBleHBlY3QoYnV0dG9uc1syXSkudG9IYXZlVGV4dENvbnRlbnQoJ3J1bkxvZy50cmFjaW5nJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHMgLSBWZXJpZnkgVGFiIGFuZCBUYWJzIHdvcmsgdG9nZXRoZXJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgcGFzcyBhbGwgcHJvcHMgdG8gY2hpbGQgVGFiIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJERVRBSUxcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBWZXJpZnkgZWFjaCB0YWIgaGFzIGNvcnJlY3QgcHJvcHNcbiAgICAgIGNvbnN0IHJlc3VsdFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5yZXN1bHQnIH0pXG4gICAgICBjb25zdCBkZXRhaWxUYWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cuZGV0YWlsJyB9KVxuICAgICAgY29uc3QgdHJhY2luZ1RhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy50cmFjaW5nJyB9KVxuXG4gICAgICAvLyBDaGVjayBhY3RpdmUgc3RhdGVzXG4gICAgICBleHBlY3QocmVzdWx0VGFiKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgIGV4cGVjdChkZXRhaWxUYWIpLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtcHJpbWFyeScpXG4gICAgICBleHBlY3QodHJhY2luZ1RhYikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG5cbiAgICAgIC8vIENoZWNrIGVuYWJsZWQgc3RhdGVzXG4gICAgICBleHBlY3QocmVzdWx0VGFiKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIGV4cGVjdChkZXRhaWxUYWIpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgZXhwZWN0KHRyYWNpbmdUYWIpLm5vdC50b0JlRGlzYWJsZWQoKVxuXG4gICAgICAvLyBDaGVjayBjbGljayBoYW5kbGVyc1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJlc3VsdFRhYilcbiAgICAgIGV4cGVjdChtb2NrU3dpdGNoVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnUkVTVUxUJylcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyYWNpbmdUYWIpXG4gICAgICBleHBlY3QobW9ja1N3aXRjaFRhYikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ1RSQUNJTkcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHN1cHBvcnQgZnVsbCB0YWIgc3dpdGNoaW5nIHdvcmtmbG93JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZVdvcmtmbG93UnVubmluZ0RhdGEoKVxuICAgICAgbGV0IGN1cnJlbnRUYWIgPSAnUkVTVUxUJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPXtjdXJyZW50VGFifVxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaW11bGF0ZSBjbGlja2luZyBERVRBSUwgdGFiXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLmRldGFpbCcgfSkpXG4gICAgICBleHBlY3QobW9ja1N3aXRjaFRhYikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ0RFVEFJTCcpXG5cbiAgICAgIC8vIFVwZGF0ZSBjdXJyZW50VGFiIGFuZCByZXJlbmRlciAoc2ltdWxhdGluZyBwYXJlbnQgc3RhdGUgdXBkYXRlKVxuICAgICAgY3VycmVudFRhYiA9ICdERVRBSUwnXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPXtjdXJyZW50VGFifVxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgREVUQUlMIGlzIG5vdyBhY3RpdmVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cuZGV0YWlsJyB9KSkudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1wcmltYXJ5JylcblxuICAgICAgLy8gU2ltdWxhdGUgY2xpY2tpbmcgVFJBQ0lORyB0YWJcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cudHJhY2luZycgfSkpXG4gICAgICBleHBlY3QobW9ja1N3aXRjaFRhYikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ1RSQUNJTkcnKVxuXG4gICAgICAvLyBVcGRhdGUgY3VycmVudFRhYiBhbmQgcmVyZW5kZXJcbiAgICAgIGN1cnJlbnRUYWIgPSAnVFJBQ0lORydcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9e2N1cnJlbnRUYWJ9XG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCBUUkFDSU5HIGlzIG5vdyBhY3RpdmVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdydW5Mb2cudHJhY2luZycgfSkpLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtcHJpbWFyeScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhbnNpdGlvbiBmcm9tIGRpc2FibGVkIHRvIGVuYWJsZWQgc3RhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhID0gY3JlYXRlV29ya2Zsb3dSdW5uaW5nRGF0YSgpXG5cbiAgICAgIC8vIEFjdCAtIEluaXRpYWwgZGlzYWJsZWQgc3RhdGVcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt1bmRlZmluZWR9XG4gICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gVHJ5IGNsaWNraW5nIC0gc2hvdWxkIG5vdCB0cmlnZ2VyXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncnVuTG9nLmRldGFpbCcgfSkpXG4gICAgICBleHBlY3QobW9ja1N3aXRjaFRhYikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAvLyBFbmFibGUgdGFic1xuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIE5vdyBjbGljayBzaG91bGQgd29ya1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3J1bkxvZy5kZXRhaWwnIH0pKVxuICAgICAgZXhwZWN0KG1vY2tTd2l0Y2hUYWIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdERVRBSUwnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19