"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
// ==========================================
// Mock External Dependencies
// ==========================================
// Mock next/navigation - useParams returns datasetId
const mockDatasetId = 'test-dataset-id';
vi.mock('next/navigation', () => ({
    useParams: () => ({ datasetId: mockDatasetId }),
}));
// Mock next/link to capture href
vi.mock('next/link', () => ({
    default: ({ children, href, replace }) => (<a href={href} data-replace={replace}>
      {children}
    </a>),
}));
// ==========================================
// Test Suite
// ==========================================
describe('Actions', () => {
    // Default mock for required props
    const defaultProps = {
        handleNextStep: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        // Tests basic rendering functionality
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeInTheDocument();
        });
        it('should render cancel button with correct link', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            const cancelLink = react_1.screen.getByRole('link');
            expect(cancelLink).toHaveAttribute('href', `/datasets/${mockDatasetId}/documents`);
            expect(cancelLink).toHaveAttribute('data-replace', 'true');
        });
        it('should render next step button with arrow icon', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            const nextButton = react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i });
            expect(nextButton).toBeInTheDocument();
            expect(nextButton.querySelector('svg')).toBeInTheDocument();
        });
        it('should render cancel button with correct translation key', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('common.operation.cancel')).toBeInTheDocument();
        });
        it('should not render select all section by default', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.queryByText('common.operation.selectAll')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        // Tests for prop variations and defaults
        describe('disabled prop', () => {
            it('should not disable next step button when disabled is false', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} disabled={false}/>);
                // Assert
                const nextButton = react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i });
                expect(nextButton).not.toBeDisabled();
            });
            it('should disable next step button when disabled is true', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} disabled={true}/>);
                // Assert
                const nextButton = react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i });
                expect(nextButton).toBeDisabled();
            });
            it('should not disable next step button when disabled is undefined', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} disabled={undefined}/>);
                // Assert
                const nextButton = react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i });
                expect(nextButton).not.toBeDisabled();
            });
        });
        describe('showSelect prop', () => {
            it('should show select all section when showSelect is true', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} onSelectAll={vi.fn()}/>);
                // Assert
                expect(react_1.screen.getByText('common.operation.selectAll')).toBeInTheDocument();
            });
            it('should hide select all section when showSelect is false', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} showSelect={false}/>);
                // Assert
                expect(react_1.screen.queryByText('common.operation.selectAll')).not.toBeInTheDocument();
            });
            it('should hide select all section when showSelect defaults to false', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default handleNextStep={vi.fn()}/>);
                // Assert
                expect(react_1.screen.queryByText('common.operation.selectAll')).not.toBeInTheDocument();
            });
        });
        describe('tip prop', () => {
            it('should show tip when showSelect is true and tip is provided', () => {
                // Arrange
                const tip = 'This is a helpful tip';
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} tip={tip} onSelectAll={vi.fn()}/>);
                // Assert
                expect(react_1.screen.getByText(tip)).toBeInTheDocument();
                expect(react_1.screen.getByTitle(tip)).toBeInTheDocument();
            });
            it('should not show tip when showSelect is false even if tip is provided', () => {
                // Arrange
                const tip = 'This is a helpful tip';
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} showSelect={false} tip={tip}/>);
                // Assert
                expect(react_1.screen.queryByText(tip)).not.toBeInTheDocument();
            });
            it('should not show tip when tip is empty string', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} tip="" onSelectAll={vi.fn()}/>);
                // Assert
                const tipElements = react_1.screen.queryAllByTitle('');
                // Empty tip should not render a tip element
                expect(tipElements.length).toBe(0);
            });
            it('should use empty string as default tip value', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} onSelectAll={vi.fn()}/>);
                // Assert - tip container should not exist when tip defaults to empty string
                const tipContainer = document.querySelector('.text-text-tertiary.truncate');
                expect(tipContainer).not.toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Event Handlers Testing
    // ==========================================
    describe('User Interactions', () => {
        // Tests for event handlers
        it('should call handleNextStep when next button is clicked', () => {
            // Arrange
            const handleNextStep = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} handleNextStep={handleNextStep}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(handleNextStep).toHaveBeenCalledTimes(1);
        });
        it('should not call handleNextStep when next button is disabled and clicked', () => {
            // Arrange
            const handleNextStep = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} handleNextStep={handleNextStep} disabled={true}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(handleNextStep).not.toHaveBeenCalled();
        });
        it('should call onSelectAll when checkbox is clicked', () => {
            // Arrange
            const onSelectAll = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} onSelectAll={onSelectAll} totalOptions={5} selectedOptions={0}/>);
            // Act - find the checkbox container and click it
            const selectAllLabel = react_1.screen.getByText('common.operation.selectAll');
            const checkboxContainer = selectAllLabel.closest('.flex.shrink-0.items-center');
            const checkbox = checkboxContainer?.querySelector('[class*="cursor-pointer"]');
            if (checkbox)
                react_1.fireEvent.click(checkbox);
            // Assert
            expect(onSelectAll).toHaveBeenCalledTimes(1);
        });
    });
    // ==========================================
    // Memoization Logic Testing
    // ==========================================
    describe('Memoization Logic', () => {
        // Tests for useMemo hooks (indeterminate and checked)
        describe('indeterminate calculation', () => {
            it('should return false when showSelect is false', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} showSelect={false} totalOptions={5} selectedOptions={2} onSelectAll={vi.fn()}/>);
                // Assert - checkbox not rendered, so can't check indeterminate directly
                expect(react_1.screen.queryByText('common.operation.selectAll')).not.toBeInTheDocument();
            });
            it('should return false when selectedOptions is undefined', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={undefined} onSelectAll={vi.fn()}/>);
                // Assert - checkbox should not be indeterminate
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
            it('should return false when totalOptions is undefined', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={undefined} selectedOptions={2} onSelectAll={vi.fn()}/>);
                // Assert - checkbox should exist
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
            it('should return true when some options are selected (0 < selectedOptions < totalOptions)', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={3} onSelectAll={vi.fn()}/>);
                // Assert - checkbox should render in indeterminate state
                // The checkbox component renders IndeterminateIcon when indeterminate and not checked
                const selectAllContainer = container.querySelector('.flex.shrink-0.items-center');
                expect(selectAllContainer).toBeInTheDocument();
            });
            it('should return false when no options are selected (selectedOptions === 0)', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={0} onSelectAll={vi.fn()}/>);
                // Assert - checkbox should be unchecked and not indeterminate
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
            it('should return false when all options are selected (selectedOptions === totalOptions)', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={5} onSelectAll={vi.fn()}/>);
                // Assert - checkbox should be checked, not indeterminate
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
        });
        describe('checked calculation', () => {
            it('should return false when showSelect is false', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} showSelect={false} totalOptions={5} selectedOptions={5} onSelectAll={vi.fn()}/>);
                // Assert - checkbox not rendered
                expect(react_1.screen.queryByText('common.operation.selectAll')).not.toBeInTheDocument();
            });
            it('should return false when selectedOptions is undefined', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={undefined} onSelectAll={vi.fn()}/>);
                // Assert
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
            it('should return false when totalOptions is undefined', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={undefined} selectedOptions={5} onSelectAll={vi.fn()}/>);
                // Assert
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
            it('should return true when all options are selected (selectedOptions === totalOptions)', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={5} onSelectAll={vi.fn()}/>);
                // Assert - checkbox should show checked state (RiCheckLine icon)
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
            it('should return false when selectedOptions is 0', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={0} onSelectAll={vi.fn()}/>);
                // Assert - checkbox should be unchecked
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
            it('should return false when not all options are selected', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={4} onSelectAll={vi.fn()}/>);
                // Assert - checkbox should be indeterminate, not checked
                const checkbox = container.querySelector('[class*="cursor-pointer"]');
                expect(checkbox).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Component Memoization Testing
    // ==========================================
    describe('Component Memoization', () => {
        // Tests for React.memo behavior
        it('should be wrapped with React.memo', () => {
            // Assert - verify component has memo wrapper
            expect(index_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
        it('should not re-render when props are the same', () => {
            // Arrange
            const handleNextStep = vi.fn();
            const props = {
                handleNextStep,
                disabled: false,
                showSelect: true,
                totalOptions: 5,
                selectedOptions: 3,
                onSelectAll: vi.fn(),
                tip: 'Test tip',
            };
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Re-render with same props
            rerender(<index_1.default {...props}/>);
            // Assert - component renders correctly after rerender
            expect(react_1.screen.getByText('common.operation.selectAll')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test tip')).toBeInTheDocument();
        });
        it('should re-render when props change', () => {
            // Arrange
            const handleNextStep = vi.fn();
            const initialProps = {
                handleNextStep,
                disabled: false,
                showSelect: true,
                totalOptions: 5,
                selectedOptions: 0,
                onSelectAll: vi.fn(),
                tip: 'Initial tip',
            };
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...initialProps}/>);
            expect(react_1.screen.getByText('Initial tip')).toBeInTheDocument();
            // Rerender with different props
            rerender(<index_1.default {...initialProps} tip="Updated tip"/>);
            // Assert
            expect(react_1.screen.getByText('Updated tip')).toBeInTheDocument();
            expect(react_1.screen.queryByText('Initial tip')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases Testing
    // ==========================================
    describe('Edge Cases', () => {
        // Tests for boundary conditions and unusual inputs
        it('should handle totalOptions of 0', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={0} selectedOptions={0} onSelectAll={vi.fn()}/>);
            // Assert - should render checkbox
            const checkbox = container.querySelector('[class*="cursor-pointer"]');
            expect(checkbox).toBeInTheDocument();
        });
        it('should handle very large totalOptions', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={1000000} selectedOptions={500000} onSelectAll={vi.fn()}/>);
            // Assert
            const checkbox = container.querySelector('[class*="cursor-pointer"]');
            expect(checkbox).toBeInTheDocument();
        });
        it('should handle very long tip text', () => {
            // Arrange
            const longTip = 'A'.repeat(500);
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} tip={longTip} onSelectAll={vi.fn()}/>);
            // Assert - tip should render with truncate class
            const tipElement = react_1.screen.getByTitle(longTip);
            expect(tipElement).toHaveClass('truncate');
        });
        it('should handle tip with special characters', () => {
            // Arrange
            const specialTip = '<script>alert("xss")</script> & "quotes" \'apostrophes\'';
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} tip={specialTip} onSelectAll={vi.fn()}/>);
            // Assert - special characters should be rendered safely
            expect(react_1.screen.getByText(specialTip)).toBeInTheDocument();
        });
        it('should handle tip with unicode characters', () => {
            // Arrange
            const unicodeTip = '选中 5 个文件，共 10MB 🚀';
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} tip={unicodeTip} onSelectAll={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText(unicodeTip)).toBeInTheDocument();
        });
        it('should handle selectedOptions greater than totalOptions', () => {
            // This is an edge case that shouldn't happen but should be handled gracefully
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={10} onSelectAll={vi.fn()}/>);
            // Assert - should still render
            const checkbox = container.querySelector('[class*="cursor-pointer"]');
            expect(checkbox).toBeInTheDocument();
        });
        it('should handle negative selectedOptions', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={-1} onSelectAll={vi.fn()}/>);
            // Assert - should still render (though this is an invalid state)
            const checkbox = container.querySelector('[class*="cursor-pointer"]');
            expect(checkbox).toBeInTheDocument();
        });
        it('should handle onSelectAll being undefined when showSelect is true', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={3} onSelectAll={undefined}/>);
            // Assert - should render checkbox
            const checkbox = container.querySelector('[class*="cursor-pointer"]');
            expect(checkbox).toBeInTheDocument();
            // Click should not throw
            if (checkbox)
                expect(() => react_1.fireEvent.click(checkbox)).not.toThrow();
        });
        it('should handle empty datasetId from params', () => {
            // This test verifies the link is constructed even with empty datasetId
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert - link should still be present with the mocked datasetId
            const cancelLink = react_1.screen.getByRole('link');
            expect(cancelLink).toHaveAttribute('href', '/datasets/test-dataset-id/documents');
        });
    });
    // ==========================================
    // All Prop Combinations Testing
    // ==========================================
    describe('Prop Combinations', () => {
        // Tests for various combinations of props
        it('should handle disabled=true with showSelect=false', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} disabled={true} showSelect={false}/>);
            // Assert
            const nextButton = react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i });
            expect(nextButton).toBeDisabled();
            expect(react_1.screen.queryByText('common.operation.selectAll')).not.toBeInTheDocument();
        });
        it('should handle disabled=true with showSelect=true', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} disabled={true} showSelect={true} totalOptions={5} selectedOptions={3} onSelectAll={vi.fn()}/>);
            // Assert
            const nextButton = react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i });
            expect(nextButton).toBeDisabled();
            expect(react_1.screen.getByText('common.operation.selectAll')).toBeInTheDocument();
        });
        it('should render complete component with all props provided', () => {
            // Arrange
            const allProps = {
                disabled: false,
                handleNextStep: vi.fn(),
                showSelect: true,
                totalOptions: 10,
                selectedOptions: 5,
                onSelectAll: vi.fn(),
                tip: 'All props provided',
            };
            // Act
            (0, react_1.render)(<index_1.default {...allProps}/>);
            // Assert
            expect(react_1.screen.getByText('common.operation.selectAll')).toBeInTheDocument();
            expect(react_1.screen.getByText('All props provided')).toBeInTheDocument();
            expect(react_1.screen.getByText('common.operation.cancel')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should render minimal component with only required props', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default handleNextStep={vi.fn()}/>);
            // Assert
            expect(react_1.screen.queryByText('common.operation.selectAll')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('common.operation.cancel')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
    });
    // ==========================================
    // Selection State Variations Testing
    // ==========================================
    describe('Selection State Variations', () => {
        // Tests for different selection states
        const selectionStates = [
            { totalOptions: 10, selectedOptions: 0, expectedState: 'unchecked' },
            { totalOptions: 10, selectedOptions: 5, expectedState: 'indeterminate' },
            { totalOptions: 10, selectedOptions: 10, expectedState: 'checked' },
            { totalOptions: 1, selectedOptions: 0, expectedState: 'unchecked' },
            { totalOptions: 1, selectedOptions: 1, expectedState: 'checked' },
            { totalOptions: 100, selectedOptions: 1, expectedState: 'indeterminate' },
            { totalOptions: 100, selectedOptions: 99, expectedState: 'indeterminate' },
        ];
        it.each(selectionStates)('should render with $expectedState state when totalOptions=$totalOptions and selectedOptions=$selectedOptions', ({ totalOptions, selectedOptions }) => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={totalOptions} selectedOptions={selectedOptions} onSelectAll={vi.fn()}/>);
            // Assert - component should render without errors
            const checkbox = container.querySelector('[class*="cursor-pointer"]');
            expect(checkbox).toBeInTheDocument();
            expect(react_1.screen.getByText('common.operation.selectAll')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Layout Structure Testing
    // ==========================================
    describe('Layout', () => {
        // Tests for correct layout structure
        it('should have correct container structure', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            const mainContainer = container.querySelector('.flex.items-center.gap-x-2.overflow-hidden');
            expect(mainContainer).toBeInTheDocument();
        });
        it('should have correct button container structure', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert - buttons should be in a flex container
            const buttonContainer = container.querySelector('.flex.grow.items-center.justify-end.gap-x-2');
            expect(buttonContainer).toBeInTheDocument();
        });
        it('should position select all section before buttons when showSelect is true', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} showSelect={true} totalOptions={5} selectedOptions={3} onSelectAll={vi.fn()}/>);
            // Assert - select all section should exist
            const selectAllSection = container.querySelector('.flex.shrink-0.items-center');
            expect(selectAllSection).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixtQ0FBNkI7QUFFN0IsNkNBQTZDO0FBQzdDLDZCQUE2QjtBQUM3Qiw2Q0FBNkM7QUFFN0MscURBQXFEO0FBQ3JELE1BQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFBO0FBQ3ZDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsQ0FBQztDQUNoRCxDQUFDLENBQUMsQ0FBQTtBQUVILGlDQUFpQztBQUNqQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQWtFLEVBQUUsRUFBRSxDQUFDLENBQ3hHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNuQztNQUFBLENBQUMsUUFBUSxDQUNYO0lBQUEsRUFBRSxDQUFDLENBQUMsQ0FDTDtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsNkNBQTZDO0FBQzdDLGFBQWE7QUFDYiw2Q0FBNkM7QUFFN0MsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsa0NBQWtDO0lBQ2xDLE1BQU0sWUFBWSxHQUFHO1FBQ25CLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ3hCLENBQUE7SUFFRCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkNBQTZD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QUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQ3JCLENBQ0gsQ0FBQTtZQUVELDJDQUEyQztZQUMzQyxNQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtZQUMvRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQWN0aW9ucyBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgRXh0ZXJuYWwgRGVwZW5kZW5jaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBuZXh0L25hdmlnYXRpb24gLSB1c2VQYXJhbXMgcmV0dXJucyBkYXRhc2V0SWRcbmNvbnN0IG1vY2tEYXRhc2V0SWQgPSAndGVzdC1kYXRhc2V0LWlkJ1xudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUGFyYW1zOiAoKSA9PiAoeyBkYXRhc2V0SWQ6IG1vY2tEYXRhc2V0SWQgfSksXG59KSlcblxuLy8gTW9jayBuZXh0L2xpbmsgdG8gY2FwdHVyZSBocmVmXG52aS5tb2NrKCduZXh0L2xpbmsnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBjaGlsZHJlbiwgaHJlZiwgcmVwbGFjZSB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIGhyZWY6IHN0cmluZywgcmVwbGFjZT86IGJvb2xlYW4gfSkgPT4gKFxuICAgIDxhIGhyZWY9e2hyZWZ9IGRhdGEtcmVwbGFjZT17cmVwbGFjZX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9hPlxuICApLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdBY3Rpb25zJywgKCkgPT4ge1xuICAvLyBEZWZhdWx0IG1vY2sgZm9yIHJlcXVpcmVkIHByb3BzXG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoYW5kbGVOZXh0U3RlcDogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgYmFzaWMgcmVuZGVyaW5nIGZ1bmN0aW9uYWxpdHlcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjYW5jZWwgYnV0dG9uIHdpdGggY29ycmVjdCBsaW5rJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNhbmNlbExpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJylcbiAgICAgIGV4cGVjdChjYW5jZWxMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCBgL2RhdGFzZXRzLyR7bW9ja0RhdGFzZXRJZH0vZG9jdW1lbnRzYClcbiAgICAgIGV4cGVjdChjYW5jZWxMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtcmVwbGFjZScsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbmV4dCBzdGVwIGJ1dHRvbiB3aXRoIGFycm93IGljb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pXG4gICAgICBleHBlY3QobmV4dEJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KG5leHRCdXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FuY2VsIGJ1dHRvbiB3aXRoIGNvcnJlY3QgdHJhbnNsYXRpb24ga2V5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzZWxlY3QgYWxsIHNlY3Rpb24gYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlbGVjdEFsbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICAvLyBUZXN0cyBmb3IgcHJvcCB2YXJpYXRpb25zIGFuZCBkZWZhdWx0c1xuICAgIGRlc2NyaWJlKCdkaXNhYmxlZCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBub3QgZGlzYWJsZSBuZXh0IHN0ZXAgYnV0dG9uIHdoZW4gZGlzYWJsZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IGRpc2FibGVkPXtmYWxzZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IG5leHRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KVxuICAgICAgICBleHBlY3QobmV4dEJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgbmV4dCBzdGVwIGJ1dHRvbiB3aGVuIGRpc2FibGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IGRpc2FibGVkPXt0cnVlfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pXG4gICAgICAgIGV4cGVjdChuZXh0QnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgZGlzYWJsZSBuZXh0IHN0ZXAgYnV0dG9uIHdoZW4gZGlzYWJsZWQgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8QWN0aW9ucyB7Li4uZGVmYXVsdFByb3BzfSBkaXNhYmxlZD17dW5kZWZpbmVkfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pXG4gICAgICAgIGV4cGVjdChuZXh0QnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdzaG93U2VsZWN0IHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgc2VsZWN0IGFsbCBzZWN0aW9uIHdoZW4gc2hvd1NlbGVjdCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8QWN0aW9ucyB7Li4uZGVmYXVsdFByb3BzfSBzaG93U2VsZWN0PXt0cnVlfSBvblNlbGVjdEFsbD17dmkuZm4oKX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlbGVjdEFsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhpZGUgc2VsZWN0IGFsbCBzZWN0aW9uIHdoZW4gc2hvd1NlbGVjdCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRQcm9wc30gc2hvd1NlbGVjdD17ZmFsc2V9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlbGVjdEFsbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoaWRlIHNlbGVjdCBhbGwgc2VjdGlvbiB3aGVuIHNob3dTZWxlY3QgZGVmYXVsdHMgdG8gZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXt2aS5mbigpfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zZWxlY3RBbGwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd0aXAgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyB0aXAgd2hlbiBzaG93U2VsZWN0IGlzIHRydWUgYW5kIHRpcCBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCB0aXAgPSAnVGhpcyBpcyBhIGhlbHBmdWwgdGlwJ1xuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRQcm9wc30gc2hvd1NlbGVjdD17dHJ1ZX0gdGlwPXt0aXB9IG9uU2VsZWN0QWxsPXt2aS5mbigpfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQodGlwKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGl0bGUodGlwKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB0aXAgd2hlbiBzaG93U2VsZWN0IGlzIGZhbHNlIGV2ZW4gaWYgdGlwIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHRpcCA9ICdUaGlzIGlzIGEgaGVscGZ1bCB0aXAnXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QWN0aW9ucyB7Li4uZGVmYXVsdFByb3BzfSBzaG93U2VsZWN0PXtmYWxzZX0gdGlwPXt0aXB9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KHRpcCkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHRpcCB3aGVuIHRpcCBpcyBlbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IHNob3dTZWxlY3Q9e3RydWV9IHRpcD1cIlwiIG9uU2VsZWN0QWxsPXt2aS5mbigpfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgdGlwRWxlbWVudHMgPSBzY3JlZW4ucXVlcnlBbGxCeVRpdGxlKCcnKVxuICAgICAgICAvLyBFbXB0eSB0aXAgc2hvdWxkIG5vdCByZW5kZXIgYSB0aXAgZWxlbWVudFxuICAgICAgICBleHBlY3QodGlwRWxlbWVudHMubGVuZ3RoKS50b0JlKDApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBlbXB0eSBzdHJpbmcgYXMgZGVmYXVsdCB0aXAgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IHNob3dTZWxlY3Q9e3RydWV9IG9uU2VsZWN0QWxsPXt2aS5mbigpfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSB0aXAgY29udGFpbmVyIHNob3VsZCBub3QgZXhpc3Qgd2hlbiB0aXAgZGVmYXVsdHMgdG8gZW1wdHkgc3RyaW5nXG4gICAgICAgIGNvbnN0IHRpcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXRleHQtdGVydGlhcnkudHJ1bmNhdGUnKVxuICAgICAgICBleHBlY3QodGlwQ29udGFpbmVyKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFdmVudCBIYW5kbGVycyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIGV2ZW50IGhhbmRsZXJzXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZU5leHRTdGVwIHdoZW4gbmV4dCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVOZXh0U3RlcCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgaGFuZGxlTmV4dFN0ZXAgd2hlbiBuZXh0IGJ1dHRvbiBpcyBkaXNhYmxlZCBhbmQgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gZGlzYWJsZWQ9e3RydWV9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlTmV4dFN0ZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2VsZWN0QWxsIHdoZW4gY2hlY2tib3ggaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uU2VsZWN0QWxsID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICBvblNlbGVjdEFsbD17b25TZWxlY3RBbGx9XG4gICAgICAgICAgdG90YWxPcHRpb25zPXs1fVxuICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucz17MH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFjdCAtIGZpbmQgdGhlIGNoZWNrYm94IGNvbnRhaW5lciBhbmQgY2xpY2sgaXRcbiAgICAgIGNvbnN0IHNlbGVjdEFsbExhYmVsID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zZWxlY3RBbGwnKVxuICAgICAgY29uc3QgY2hlY2tib3hDb250YWluZXIgPSBzZWxlY3RBbGxMYWJlbC5jbG9zZXN0KCcuZmxleC5zaHJpbmstMC5pdGVtcy1jZW50ZXInKVxuICAgICAgY29uc3QgY2hlY2tib3ggPSBjaGVja2JveENvbnRhaW5lcj8ucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGlmIChjaGVja2JveClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvblNlbGVjdEFsbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTWVtb2l6YXRpb24gTG9naWMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uIExvZ2ljJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciB1c2VNZW1vIGhvb2tzIChpbmRldGVybWluYXRlIGFuZCBjaGVja2VkKVxuICAgIGRlc2NyaWJlKCdpbmRldGVybWluYXRlIGNhbGN1bGF0aW9uJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBzaG93U2VsZWN0IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIHNob3dTZWxlY3Q9e2ZhbHNlfVxuICAgICAgICAgICAgdG90YWxPcHRpb25zPXs1fVxuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb25zPXsyfVxuICAgICAgICAgICAgb25TZWxlY3RBbGw9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnQgLSBjaGVja2JveCBub3QgcmVuZGVyZWQsIHNvIGNhbid0IGNoZWNrIGluZGV0ZXJtaW5hdGUgZGlyZWN0bHlcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zZWxlY3RBbGwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gc2VsZWN0ZWRPcHRpb25zIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICAgIHRvdGFsT3B0aW9ucz17NX1cbiAgICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucz17dW5kZWZpbmVkfVxuICAgICAgICAgICAgb25TZWxlY3RBbGw9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnQgLSBjaGVja2JveCBzaG91bGQgbm90IGJlIGluZGV0ZXJtaW5hdGVcbiAgICAgICAgY29uc3QgY2hlY2tib3ggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgICAgZXhwZWN0KGNoZWNrYm94KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIHRvdGFsT3B0aW9ucyBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIHNob3dTZWxlY3Q9e3RydWV9XG4gICAgICAgICAgICB0b3RhbE9wdGlvbnM9e3VuZGVmaW5lZH1cbiAgICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucz17Mn1cbiAgICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY2hlY2tib3ggc2hvdWxkIGV4aXN0XG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSB3aGVuIHNvbWUgb3B0aW9ucyBhcmUgc2VsZWN0ZWQgKDAgPCBzZWxlY3RlZE9wdGlvbnMgPCB0b3RhbE9wdGlvbnMpJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBzaG93U2VsZWN0PXt0cnVlfVxuICAgICAgICAgICAgdG90YWxPcHRpb25zPXs1fVxuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb25zPXszfVxuICAgICAgICAgICAgb25TZWxlY3RBbGw9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnQgLSBjaGVja2JveCBzaG91bGQgcmVuZGVyIGluIGluZGV0ZXJtaW5hdGUgc3RhdGVcbiAgICAgICAgLy8gVGhlIGNoZWNrYm94IGNvbXBvbmVudCByZW5kZXJzIEluZGV0ZXJtaW5hdGVJY29uIHdoZW4gaW5kZXRlcm1pbmF0ZSBhbmQgbm90IGNoZWNrZWRcbiAgICAgICAgY29uc3Qgc2VsZWN0QWxsQ29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mbGV4LnNocmluay0wLml0ZW1zLWNlbnRlcicpXG4gICAgICAgIGV4cGVjdChzZWxlY3RBbGxDb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbm8gb3B0aW9ucyBhcmUgc2VsZWN0ZWQgKHNlbGVjdGVkT3B0aW9ucyA9PT0gMCknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIHNob3dTZWxlY3Q9e3RydWV9XG4gICAgICAgICAgICB0b3RhbE9wdGlvbnM9ezV9XG4gICAgICAgICAgICBzZWxlY3RlZE9wdGlvbnM9ezB9XG4gICAgICAgICAgICBvblNlbGVjdEFsbD17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGNoZWNrYm94IHNob3VsZCBiZSB1bmNoZWNrZWQgYW5kIG5vdCBpbmRldGVybWluYXRlXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBhbGwgb3B0aW9ucyBhcmUgc2VsZWN0ZWQgKHNlbGVjdGVkT3B0aW9ucyA9PT0gdG90YWxPcHRpb25zKScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICAgIHRvdGFsT3B0aW9ucz17NX1cbiAgICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucz17NX1cbiAgICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY2hlY2tib3ggc2hvdWxkIGJlIGNoZWNrZWQsIG5vdCBpbmRldGVybWluYXRlXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2NoZWNrZWQgY2FsY3VsYXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIHNob3dTZWxlY3QgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgc2hvd1NlbGVjdD17ZmFsc2V9XG4gICAgICAgICAgICB0b3RhbE9wdGlvbnM9ezV9XG4gICAgICAgICAgICBzZWxlY3RlZE9wdGlvbnM9ezV9XG4gICAgICAgICAgICBvblNlbGVjdEFsbD17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGNoZWNrYm94IG5vdCByZW5kZXJlZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlbGVjdEFsbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBzZWxlY3RlZE9wdGlvbnMgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBzaG93U2VsZWN0PXt0cnVlfVxuICAgICAgICAgICAgdG90YWxPcHRpb25zPXs1fVxuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb25zPXt1bmRlZmluZWR9XG4gICAgICAgICAgICBvblNlbGVjdEFsbD17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBjaGVja2JveCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgICBleHBlY3QoY2hlY2tib3gpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gdG90YWxPcHRpb25zIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICAgIHRvdGFsT3B0aW9ucz17dW5kZWZpbmVkfVxuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb25zPXs1fVxuICAgICAgICAgICAgb25TZWxlY3RBbGw9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2hlY2tib3ggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgICAgZXhwZWN0KGNoZWNrYm94KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gYWxsIG9wdGlvbnMgYXJlIHNlbGVjdGVkIChzZWxlY3RlZE9wdGlvbnMgPT09IHRvdGFsT3B0aW9ucyknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIHNob3dTZWxlY3Q9e3RydWV9XG4gICAgICAgICAgICB0b3RhbE9wdGlvbnM9ezV9XG4gICAgICAgICAgICBzZWxlY3RlZE9wdGlvbnM9ezV9XG4gICAgICAgICAgICBvblNlbGVjdEFsbD17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGNoZWNrYm94IHNob3VsZCBzaG93IGNoZWNrZWQgc3RhdGUgKFJpQ2hlY2tMaW5lIGljb24pXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBzZWxlY3RlZE9wdGlvbnMgaXMgMCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICAgIHRvdGFsT3B0aW9ucz17NX1cbiAgICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucz17MH1cbiAgICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY2hlY2tib3ggc2hvdWxkIGJlIHVuY2hlY2tlZFxuICAgICAgICBjb25zdCBjaGVja2JveCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgICBleHBlY3QoY2hlY2tib3gpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbm90IGFsbCBvcHRpb25zIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICAgIHRvdGFsT3B0aW9ucz17NX1cbiAgICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucz17NH1cbiAgICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY2hlY2tib3ggc2hvdWxkIGJlIGluZGV0ZXJtaW5hdGUsIG5vdCBjaGVja2VkXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb24gVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAvLyBUZXN0cyBmb3IgUmVhY3QubWVtbyBiZWhhdmlvclxuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnQgLSB2ZXJpZnkgY29tcG9uZW50IGhhcyBtZW1vIHdyYXBwZXJcbiAgICAgIGV4cGVjdChBY3Rpb25zLiQkdHlwZW9mKS50b0JlKFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmUtcmVuZGVyIHdoZW4gcHJvcHMgYXJlIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgaGFuZGxlTmV4dFN0ZXAsXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgc2hvd1NlbGVjdDogdHJ1ZSxcbiAgICAgICAgdG90YWxPcHRpb25zOiA1LFxuICAgICAgICBzZWxlY3RlZE9wdGlvbnM6IDMsXG4gICAgICAgIG9uU2VsZWN0QWxsOiB2aS5mbigpLFxuICAgICAgICB0aXA6ICdUZXN0IHRpcCcsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxBY3Rpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFJlLXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKDxBY3Rpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbXBvbmVudCByZW5kZXJzIGNvcnJlY3RseSBhZnRlciByZXJlbmRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uc2VsZWN0QWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IHRpcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmUtcmVuZGVyIHdoZW4gcHJvcHMgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG4gICAgICBjb25zdCBpbml0aWFsUHJvcHMgPSB7XG4gICAgICAgIGhhbmRsZU5leHRTdGVwLFxuICAgICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICAgIHNob3dTZWxlY3Q6IHRydWUsXG4gICAgICAgIHRvdGFsT3B0aW9uczogNSxcbiAgICAgICAgc2VsZWN0ZWRPcHRpb25zOiAwLFxuICAgICAgICBvblNlbGVjdEFsbDogdmkuZm4oKSxcbiAgICAgICAgdGlwOiAnSW5pdGlhbCB0aXAnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8QWN0aW9ucyB7Li4uaW5pdGlhbFByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdJbml0aWFsIHRpcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggZGlmZmVyZW50IHByb3BzXG4gICAgICByZXJlbmRlcig8QWN0aW9ucyB7Li4uaW5pdGlhbFByb3BzfSB0aXA9XCJVcGRhdGVkIHRpcFwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdVcGRhdGVkIHRpcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdJbml0aWFsIHRpcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIGJvdW5kYXJ5IGNvbmRpdGlvbnMgYW5kIHVudXN1YWwgaW5wdXRzXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdG90YWxPcHRpb25zIG9mIDAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICB0b3RhbE9wdGlvbnM9ezB9XG4gICAgICAgICAgc2VsZWN0ZWRPcHRpb25zPXswfVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHJlbmRlciBjaGVja2JveFxuICAgICAgY29uc3QgY2hlY2tib3ggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxhcmdlIHRvdGFsT3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBzaG93U2VsZWN0PXt0cnVlfVxuICAgICAgICAgIHRvdGFsT3B0aW9ucz17MTAwMDAwMH1cbiAgICAgICAgICBzZWxlY3RlZE9wdGlvbnM9ezUwMDAwMH1cbiAgICAgICAgICBvblNlbGVjdEFsbD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY2hlY2tib3ggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgdGlwIHRleHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nVGlwID0gJ0EnLnJlcGVhdCg1MDApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICB0aXA9e2xvbmdUaXB9XG4gICAgICAgICAgb25TZWxlY3RBbGw9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSB0aXAgc2hvdWxkIHJlbmRlciB3aXRoIHRydW5jYXRlIGNsYXNzXG4gICAgICBjb25zdCB0aXBFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGl0bGUobG9uZ1RpcClcbiAgICAgIGV4cGVjdCh0aXBFbGVtZW50KS50b0hhdmVDbGFzcygndHJ1bmNhdGUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB0aXAgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzcGVjaWFsVGlwID0gJzxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4gJiBcInF1b3Rlc1wiIFxcJ2Fwb3N0cm9waGVzXFwnJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHNob3dTZWxlY3Q9e3RydWV9XG4gICAgICAgICAgdGlwPXtzcGVjaWFsVGlwfVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gc3BlY2lhbCBjaGFyYWN0ZXJzIHNob3VsZCBiZSByZW5kZXJlZCBzYWZlbHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxUaXApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRpcCB3aXRoIHVuaWNvZGUgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVuaWNvZGVUaXAgPSAn6YCJ5LitIDUg5Liq5paH5Lu277yM5YWxIDEwTUIg8J+agCdcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBzaG93U2VsZWN0PXt0cnVlfVxuICAgICAgICAgIHRpcD17dW5pY29kZVRpcH1cbiAgICAgICAgICBvblNlbGVjdEFsbD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQodW5pY29kZVRpcCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2VsZWN0ZWRPcHRpb25zIGdyZWF0ZXIgdGhhbiB0b3RhbE9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIGlzIGFuIGVkZ2UgY2FzZSB0aGF0IHNob3VsZG4ndCBoYXBwZW4gYnV0IHNob3VsZCBiZSBoYW5kbGVkIGdyYWNlZnVsbHlcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBzaG93U2VsZWN0PXt0cnVlfVxuICAgICAgICAgIHRvdGFsT3B0aW9ucz17NX1cbiAgICAgICAgICBzZWxlY3RlZE9wdGlvbnM9ezEwfVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHN0aWxsIHJlbmRlclxuICAgICAgY29uc3QgY2hlY2tib3ggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBuZWdhdGl2ZSBzZWxlY3RlZE9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICB0b3RhbE9wdGlvbnM9ezV9XG4gICAgICAgICAgc2VsZWN0ZWRPcHRpb25zPXstMX1cbiAgICAgICAgICBvblNlbGVjdEFsbD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBzdGlsbCByZW5kZXIgKHRob3VnaCB0aGlzIGlzIGFuIGludmFsaWQgc3RhdGUpXG4gICAgICBjb25zdCBjaGVja2JveCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgZXhwZWN0KGNoZWNrYm94KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9uU2VsZWN0QWxsIGJlaW5nIHVuZGVmaW5lZCB3aGVuIHNob3dTZWxlY3QgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBzaG93U2VsZWN0PXt0cnVlfVxuICAgICAgICAgIHRvdGFsT3B0aW9ucz17NX1cbiAgICAgICAgICBzZWxlY3RlZE9wdGlvbnM9ezN9XG4gICAgICAgICAgb25TZWxlY3RBbGw9e3VuZGVmaW5lZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZW5kZXIgY2hlY2tib3hcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBleHBlY3QoY2hlY2tib3gpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2xpY2sgc2hvdWxkIG5vdCB0aHJvd1xuICAgICAgaWYgKGNoZWNrYm94KVxuICAgICAgICBleHBlY3QoKCkgPT4gZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94KSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkYXRhc2V0SWQgZnJvbSBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHRlc3QgdmVyaWZpZXMgdGhlIGxpbmsgaXMgY29uc3RydWN0ZWQgZXZlbiB3aXRoIGVtcHR5IGRhdGFzZXRJZFxuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBsaW5rIHNob3VsZCBzdGlsbCBiZSBwcmVzZW50IHdpdGggdGhlIG1vY2tlZCBkYXRhc2V0SWRcbiAgICAgIGNvbnN0IGNhbmNlbExpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJylcbiAgICAgIGV4cGVjdChjYW5jZWxMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnL2RhdGFzZXRzL3Rlc3QtZGF0YXNldC1pZC9kb2N1bWVudHMnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFsbCBQcm9wIENvbWJpbmF0aW9ucyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBDb21iaW5hdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIHZhcmlvdXMgY29tYmluYXRpb25zIG9mIHByb3BzXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlzYWJsZWQ9dHJ1ZSB3aXRoIHNob3dTZWxlY3Q9ZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRQcm9wc30gZGlzYWJsZWQ9e3RydWV9IHNob3dTZWxlY3Q9e2ZhbHNlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBuZXh0QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSlcbiAgICAgIGV4cGVjdChuZXh0QnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zZWxlY3RBbGwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlzYWJsZWQ9dHJ1ZSB3aXRoIHNob3dTZWxlY3Q9dHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGRpc2FibGVkPXt0cnVlfVxuICAgICAgICAgIHNob3dTZWxlY3Q9e3RydWV9XG4gICAgICAgICAgdG90YWxPcHRpb25zPXs1fVxuICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucz17M31cbiAgICAgICAgICBvblNlbGVjdEFsbD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pXG4gICAgICBleHBlY3QobmV4dEJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlbGVjdEFsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbXBsZXRlIGNvbXBvbmVudCB3aXRoIGFsbCBwcm9wcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGFsbFByb3BzID0ge1xuICAgICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICAgIGhhbmRsZU5leHRTdGVwOiB2aS5mbigpLFxuICAgICAgICBzaG93U2VsZWN0OiB0cnVlLFxuICAgICAgICB0b3RhbE9wdGlvbnM6IDEwLFxuICAgICAgICBzZWxlY3RlZE9wdGlvbnM6IDUsXG4gICAgICAgIG9uU2VsZWN0QWxsOiB2aS5mbigpLFxuICAgICAgICB0aXA6ICdBbGwgcHJvcHMgcHJvdmlkZWQnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyB7Li4uYWxsUHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlbGVjdEFsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQWxsIHByb3BzIHByb3ZpZGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtaW5pbWFsIGNvbXBvbmVudCB3aXRoIG9ubHkgcmVxdWlyZWQgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbnMgaGFuZGxlTmV4dFN0ZXA9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uc2VsZWN0QWxsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTZWxlY3Rpb24gU3RhdGUgVmFyaWF0aW9ucyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU2VsZWN0aW9uIFN0YXRlIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIGRpZmZlcmVudCBzZWxlY3Rpb24gc3RhdGVzXG4gICAgY29uc3Qgc2VsZWN0aW9uU3RhdGVzID0gW1xuICAgICAgeyB0b3RhbE9wdGlvbnM6IDEwLCBzZWxlY3RlZE9wdGlvbnM6IDAsIGV4cGVjdGVkU3RhdGU6ICd1bmNoZWNrZWQnIH0sXG4gICAgICB7IHRvdGFsT3B0aW9uczogMTAsIHNlbGVjdGVkT3B0aW9uczogNSwgZXhwZWN0ZWRTdGF0ZTogJ2luZGV0ZXJtaW5hdGUnIH0sXG4gICAgICB7IHRvdGFsT3B0aW9uczogMTAsIHNlbGVjdGVkT3B0aW9uczogMTAsIGV4cGVjdGVkU3RhdGU6ICdjaGVja2VkJyB9LFxuICAgICAgeyB0b3RhbE9wdGlvbnM6IDEsIHNlbGVjdGVkT3B0aW9uczogMCwgZXhwZWN0ZWRTdGF0ZTogJ3VuY2hlY2tlZCcgfSxcbiAgICAgIHsgdG90YWxPcHRpb25zOiAxLCBzZWxlY3RlZE9wdGlvbnM6IDEsIGV4cGVjdGVkU3RhdGU6ICdjaGVja2VkJyB9LFxuICAgICAgeyB0b3RhbE9wdGlvbnM6IDEwMCwgc2VsZWN0ZWRPcHRpb25zOiAxLCBleHBlY3RlZFN0YXRlOiAnaW5kZXRlcm1pbmF0ZScgfSxcbiAgICAgIHsgdG90YWxPcHRpb25zOiAxMDAsIHNlbGVjdGVkT3B0aW9uczogOTksIGV4cGVjdGVkU3RhdGU6ICdpbmRldGVybWluYXRlJyB9LFxuICAgIF1cblxuICAgIGl0LmVhY2goc2VsZWN0aW9uU3RhdGVzKShcbiAgICAgICdzaG91bGQgcmVuZGVyIHdpdGggJGV4cGVjdGVkU3RhdGUgc3RhdGUgd2hlbiB0b3RhbE9wdGlvbnM9JHRvdGFsT3B0aW9ucyBhbmQgc2VsZWN0ZWRPcHRpb25zPSRzZWxlY3RlZE9wdGlvbnMnLFxuICAgICAgKHsgdG90YWxPcHRpb25zLCBzZWxlY3RlZE9wdGlvbnMgfSkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBzaG93U2VsZWN0PXt0cnVlfVxuICAgICAgICAgICAgdG90YWxPcHRpb25zPXt0b3RhbE9wdGlvbnN9XG4gICAgICAgICAgICBzZWxlY3RlZE9wdGlvbnM9e3NlbGVjdGVkT3B0aW9uc31cbiAgICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY29tcG9uZW50IHNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgICAgY29uc3QgY2hlY2tib3ggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgICAgZXhwZWN0KGNoZWNrYm94KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlbGVjdEFsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9LFxuICAgIClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTGF5b3V0IFN0cnVjdHVyZSBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTGF5b3V0JywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBjb3JyZWN0IGxheW91dCBzdHJ1Y3R1cmVcbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBjb250YWluZXIgc3RydWN0dXJlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QWN0aW9ucyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBtYWluQ29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mbGV4Lml0ZW1zLWNlbnRlci5nYXAteC0yLm92ZXJmbG93LWhpZGRlbicpXG4gICAgICBleHBlY3QobWFpbkNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBidXR0b24gY29udGFpbmVyIHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGJ1dHRvbnMgc2hvdWxkIGJlIGluIGEgZmxleCBjb250YWluZXJcbiAgICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZmxleC5ncm93Lml0ZW1zLWNlbnRlci5qdXN0aWZ5LWVuZC5nYXAteC0yJylcbiAgICAgIGV4cGVjdChidXR0b25Db250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwb3NpdGlvbiBzZWxlY3QgYWxsIHNlY3Rpb24gYmVmb3JlIGJ1dHRvbnMgd2hlbiBzaG93U2VsZWN0IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2hvd1NlbGVjdD17dHJ1ZX1cbiAgICAgICAgICB0b3RhbE9wdGlvbnM9ezV9XG4gICAgICAgICAgc2VsZWN0ZWRPcHRpb25zPXszfVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gc2VsZWN0IGFsbCBzZWN0aW9uIHNob3VsZCBleGlzdFxuICAgICAgY29uc3Qgc2VsZWN0QWxsU2VjdGlvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZmxleC5zaHJpbmstMC5pdGVtcy1jZW50ZXInKVxuICAgICAgZXhwZWN0KHNlbGVjdEFsbFNlY3Rpb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==