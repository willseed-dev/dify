"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
const step_1 = require("./step");
// Test data factory for creating steps
const createStep = (overrides = {}) => ({
    name: 'Test Step',
    ...overrides,
});
const createSteps = (count, namePrefix = 'Step') => Array.from({ length: count }, (_, i) => createStep({ name: `${namePrefix} ${i + 1}` }));
// Helper to render Stepper with default props
const renderStepper = (props = {}) => {
    const defaultProps = {
        steps: createSteps(3),
        activeIndex: 0,
        ...props,
    };
    return (0, react_1.render)(<index_1.Stepper {...defaultProps}/>);
};
// Helper to render StepperStep with default props
const renderStepperStep = (props = {}) => {
    const defaultProps = {
        name: 'Test Step',
        index: 0,
        activeIndex: 0,
        ...props,
    };
    return (0, react_1.render)(<step_1.StepperStep {...defaultProps}/>);
};
// ============================================================================
// Stepper Component Tests
// ============================================================================
describe('Stepper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests - Verify component renders properly with various inputs
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderStepper();
            // Assert
            expect(react_1.screen.getByText('Step 1')).toBeInTheDocument();
        });
        it('should render all step names', () => {
            // Arrange
            const steps = createSteps(3, 'Custom Step');
            // Act
            renderStepper({ steps });
            // Assert
            expect(react_1.screen.getByText('Custom Step 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Custom Step 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Custom Step 3')).toBeInTheDocument();
        });
        it('should render dividers between steps', () => {
            // Arrange
            const steps = createSteps(3);
            // Act
            const { container } = renderStepper({ steps });
            // Assert - Should have 2 dividers for 3 steps
            const dividers = container.querySelectorAll('.bg-divider-deep');
            expect(dividers.length).toBe(2);
        });
        it('should not render divider after last step', () => {
            // Arrange
            const steps = createSteps(2);
            // Act
            const { container } = renderStepper({ steps });
            // Assert - Should have 1 divider for 2 steps
            const dividers = container.querySelectorAll('.bg-divider-deep');
            expect(dividers.length).toBe(1);
        });
        it('should render with flex container layout', () => {
            // Arrange & Act
            const { container } = renderStepper();
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex', 'items-center', 'gap-3');
        });
    });
    // --------------------------------------------------------------------------
    // Props Testing - Test all prop variations and combinations
    // --------------------------------------------------------------------------
    describe('Props', () => {
        describe('steps prop', () => {
            it('should render correct number of steps', () => {
                // Arrange
                const steps = createSteps(5);
                // Act
                renderStepper({ steps });
                // Assert
                expect(react_1.screen.getByText('Step 1')).toBeInTheDocument();
                expect(react_1.screen.getByText('Step 2')).toBeInTheDocument();
                expect(react_1.screen.getByText('Step 3')).toBeInTheDocument();
                expect(react_1.screen.getByText('Step 4')).toBeInTheDocument();
                expect(react_1.screen.getByText('Step 5')).toBeInTheDocument();
            });
            it('should handle single step correctly', () => {
                // Arrange
                const steps = [createStep({ name: 'Only Step' })];
                // Act
                const { container } = renderStepper({ steps, activeIndex: 0 });
                // Assert
                expect(react_1.screen.getByText('Only Step')).toBeInTheDocument();
                // No dividers for single step
                const dividers = container.querySelectorAll('.bg-divider-deep');
                expect(dividers.length).toBe(0);
            });
            it('should handle steps with long names', () => {
                // Arrange
                const longName = 'This is a very long step name that might overflow';
                const steps = [createStep({ name: longName })];
                // Act
                renderStepper({ steps, activeIndex: 0 });
                // Assert
                expect(react_1.screen.getByText(longName)).toBeInTheDocument();
            });
            it('should handle steps with special characters', () => {
                // Arrange
                const steps = [
                    createStep({ name: 'Step & Configuration' }),
                    createStep({ name: 'Step <Preview>' }),
                    createStep({ name: 'Step "Complete"' }),
                ];
                // Act
                renderStepper({ steps, activeIndex: 0 });
                // Assert
                expect(react_1.screen.getByText('Step & Configuration')).toBeInTheDocument();
                expect(react_1.screen.getByText('Step <Preview>')).toBeInTheDocument();
                expect(react_1.screen.getByText('Step "Complete"')).toBeInTheDocument();
            });
        });
        describe('activeIndex prop', () => {
            it('should highlight first step when activeIndex is 0', () => {
                // Arrange & Act
                renderStepper({ activeIndex: 0 });
                // Assert - First step should show "STEP 1" label
                expect(react_1.screen.getByText('STEP 1')).toBeInTheDocument();
            });
            it('should highlight second step when activeIndex is 1', () => {
                // Arrange & Act
                renderStepper({ activeIndex: 1 });
                // Assert - Second step should show "STEP 2" label
                expect(react_1.screen.getByText('STEP 2')).toBeInTheDocument();
            });
            it('should highlight last step when activeIndex equals steps length - 1', () => {
                // Arrange
                const steps = createSteps(3);
                // Act
                renderStepper({ steps, activeIndex: 2 });
                // Assert - Third step should show "STEP 3" label
                expect(react_1.screen.getByText('STEP 3')).toBeInTheDocument();
            });
            it('should show completed steps with number only (no STEP prefix)', () => {
                // Arrange
                const steps = createSteps(3);
                // Act
                renderStepper({ steps, activeIndex: 2 });
                // Assert - Completed steps show just the number
                expect(react_1.screen.getByText('1')).toBeInTheDocument();
                expect(react_1.screen.getByText('2')).toBeInTheDocument();
                expect(react_1.screen.getByText('STEP 3')).toBeInTheDocument();
            });
            it('should show disabled steps with number only (no STEP prefix)', () => {
                // Arrange
                const steps = createSteps(3);
                // Act
                renderStepper({ steps, activeIndex: 0 });
                // Assert - Disabled steps show just the number
                expect(react_1.screen.getByText('STEP 1')).toBeInTheDocument();
                expect(react_1.screen.getByText('2')).toBeInTheDocument();
                expect(react_1.screen.getByText('3')).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases - Test boundary conditions and unexpected inputs
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty steps array', () => {
            // Arrange & Act
            const { container } = renderStepper({ steps: [] });
            // Assert - Container should render but be empty
            expect(container.firstChild).toBeInTheDocument();
            expect(container.firstChild?.childNodes.length).toBe(0);
        });
        it('should handle activeIndex greater than steps length', () => {
            // Arrange
            const steps = createSteps(2);
            // Act - activeIndex 5 is beyond array bounds
            renderStepper({ steps, activeIndex: 5 });
            // Assert - All steps should render as completed (since activeIndex > all indices)
            expect(react_1.screen.getByText('1')).toBeInTheDocument();
            expect(react_1.screen.getByText('2')).toBeInTheDocument();
        });
        it('should handle negative activeIndex', () => {
            // Arrange
            const steps = createSteps(2);
            // Act - negative activeIndex
            renderStepper({ steps, activeIndex: -1 });
            // Assert - All steps should render as disabled (since activeIndex < all indices)
            expect(react_1.screen.getByText('1')).toBeInTheDocument();
            expect(react_1.screen.getByText('2')).toBeInTheDocument();
        });
        it('should handle large number of steps', () => {
            // Arrange
            const steps = createSteps(10);
            // Act
            const { container } = renderStepper({ steps, activeIndex: 5 });
            // Assert
            expect(react_1.screen.getByText('STEP 6')).toBeInTheDocument();
            // Should have 9 dividers for 10 steps
            const dividers = container.querySelectorAll('.bg-divider-deep');
            expect(dividers.length).toBe(9);
        });
        it('should handle steps with empty name', () => {
            // Arrange
            const steps = [createStep({ name: '' })];
            // Act
            const { container } = renderStepper({ steps, activeIndex: 0 });
            // Assert - Should still render the step structure
            expect(react_1.screen.getByText('STEP 1')).toBeInTheDocument();
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Integration - Test step state combinations
    // --------------------------------------------------------------------------
    describe('Step States', () => {
        it('should render mixed states: completed, active, disabled', () => {
            // Arrange
            const steps = createSteps(5);
            // Act
            renderStepper({ steps, activeIndex: 2 });
            // Assert
            // Steps 1-2 are completed (show number only)
            expect(react_1.screen.getByText('1')).toBeInTheDocument();
            expect(react_1.screen.getByText('2')).toBeInTheDocument();
            // Step 3 is active (shows STEP prefix)
            expect(react_1.screen.getByText('STEP 3')).toBeInTheDocument();
            // Steps 4-5 are disabled (show number only)
            expect(react_1.screen.getByText('4')).toBeInTheDocument();
            expect(react_1.screen.getByText('5')).toBeInTheDocument();
        });
        it('should transition through all states correctly', () => {
            // Arrange
            const steps = createSteps(3);
            // Act & Assert - Step 1 active
            const { rerender } = (0, react_1.render)(<index_1.Stepper steps={steps} activeIndex={0}/>);
            expect(react_1.screen.getByText('STEP 1')).toBeInTheDocument();
            // Step 2 active
            rerender(<index_1.Stepper steps={steps} activeIndex={1}/>);
            expect(react_1.screen.getByText('1')).toBeInTheDocument();
            expect(react_1.screen.getByText('STEP 2')).toBeInTheDocument();
            // Step 3 active
            rerender(<index_1.Stepper steps={steps} activeIndex={2}/>);
            expect(react_1.screen.getByText('1')).toBeInTheDocument();
            expect(react_1.screen.getByText('2')).toBeInTheDocument();
            expect(react_1.screen.getByText('STEP 3')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// StepperStep Component Tests
// ============================================================================
describe('StepperStep', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderStepperStep();
            // Assert
            expect(react_1.screen.getByText('Test Step')).toBeInTheDocument();
        });
        it('should render step name', () => {
            // Arrange & Act
            renderStepperStep({ name: 'Configure Dataset' });
            // Assert
            expect(react_1.screen.getByText('Configure Dataset')).toBeInTheDocument();
        });
        it('should render with flex container layout', () => {
            // Arrange & Act
            const { container } = renderStepperStep();
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex', 'items-center', 'gap-2');
        });
    });
    // --------------------------------------------------------------------------
    // Active State Tests
    // --------------------------------------------------------------------------
    describe('Active State', () => {
        it('should show STEP prefix when active', () => {
            // Arrange & Act
            renderStepperStep({ index: 0, activeIndex: 0 });
            // Assert
            expect(react_1.screen.getByText('STEP 1')).toBeInTheDocument();
        });
        it('should apply active styles to label container', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 0, activeIndex: 0 });
            // Assert
            const labelContainer = container.querySelector('.bg-state-accent-solid');
            expect(labelContainer).toBeInTheDocument();
            expect(labelContainer).toHaveClass('px-2');
        });
        it('should apply active text color to label', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 0, activeIndex: 0 });
            // Assert
            const label = container.querySelector('.text-text-primary-on-surface');
            expect(label).toBeInTheDocument();
        });
        it('should apply accent text color to name when active', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 0, activeIndex: 0 });
            // Assert
            const nameElement = container.querySelector('.text-text-accent');
            expect(nameElement).toBeInTheDocument();
            expect(nameElement).toHaveClass('system-xs-semibold-uppercase');
        });
        it('should calculate active correctly for different indices', () => {
            // Test index 1 with activeIndex 1
            const { rerender } = (0, react_1.render)(<step_1.StepperStep name="Step" index={1} activeIndex={1}/>);
            expect(react_1.screen.getByText('STEP 2')).toBeInTheDocument();
            // Test index 5 with activeIndex 5
            rerender(<step_1.StepperStep name="Step" index={5} activeIndex={5}/>);
            expect(react_1.screen.getByText('STEP 6')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Completed State Tests (index < activeIndex)
    // --------------------------------------------------------------------------
    describe('Completed State', () => {
        it('should show number only when completed (not active)', () => {
            // Arrange & Act
            renderStepperStep({ index: 0, activeIndex: 1 });
            // Assert
            expect(react_1.screen.getByText('1')).toBeInTheDocument();
            expect(react_1.screen.queryByText('STEP 1')).not.toBeInTheDocument();
        });
        it('should apply completed styles to label container', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 0, activeIndex: 1 });
            // Assert
            const labelContainer = container.querySelector('.border-text-quaternary');
            expect(labelContainer).toBeInTheDocument();
            expect(labelContainer).toHaveClass('w-5');
        });
        it('should apply tertiary text color to label when completed', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 0, activeIndex: 1 });
            // Assert
            const label = container.querySelector('.text-text-tertiary');
            expect(label).toBeInTheDocument();
        });
        it('should apply tertiary text color to name when completed', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 0, activeIndex: 2 });
            // Assert
            const nameElements = container.querySelectorAll('.text-text-tertiary');
            expect(nameElements.length).toBeGreaterThan(0);
        });
    });
    // --------------------------------------------------------------------------
    // Disabled State Tests (index > activeIndex)
    // --------------------------------------------------------------------------
    describe('Disabled State', () => {
        it('should show number only when disabled', () => {
            // Arrange & Act
            renderStepperStep({ index: 2, activeIndex: 0 });
            // Assert
            expect(react_1.screen.getByText('3')).toBeInTheDocument();
            expect(react_1.screen.queryByText('STEP 3')).not.toBeInTheDocument();
        });
        it('should apply disabled styles to label container', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 2, activeIndex: 0 });
            // Assert
            const labelContainer = container.querySelector('.border-divider-deep');
            expect(labelContainer).toBeInTheDocument();
            expect(labelContainer).toHaveClass('w-5');
        });
        it('should apply quaternary text color to label when disabled', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 2, activeIndex: 0 });
            // Assert
            const label = container.querySelector('.text-text-quaternary');
            expect(label).toBeInTheDocument();
        });
        it('should apply quaternary text color to name when disabled', () => {
            // Arrange & Act
            const { container } = renderStepperStep({ index: 2, activeIndex: 0 });
            // Assert
            const nameElements = container.querySelectorAll('.text-text-quaternary');
            expect(nameElements.length).toBeGreaterThan(0);
        });
    });
    // --------------------------------------------------------------------------
    // Props Testing
    // --------------------------------------------------------------------------
    describe('Props', () => {
        describe('name prop', () => {
            it('should render provided name', () => {
                // Arrange & Act
                renderStepperStep({ name: 'Custom Name' });
                // Assert
                expect(react_1.screen.getByText('Custom Name')).toBeInTheDocument();
            });
            it('should handle empty name', () => {
                // Arrange & Act
                const { container } = renderStepperStep({ name: '' });
                // Assert - Label should still render
                expect(react_1.screen.getByText('STEP 1')).toBeInTheDocument();
                expect(container.firstChild).toBeInTheDocument();
            });
            it('should handle name with whitespace', () => {
                // Arrange & Act
                renderStepperStep({ name: '  Padded Name  ' });
                // Assert
                expect(react_1.screen.getByText('Padded Name')).toBeInTheDocument();
            });
        });
        describe('index prop', () => {
            it('should display correct 1-based number for index 0', () => {
                // Arrange & Act
                renderStepperStep({ index: 0, activeIndex: 0 });
                // Assert
                expect(react_1.screen.getByText('STEP 1')).toBeInTheDocument();
            });
            it('should display correct 1-based number for index 9', () => {
                // Arrange & Act
                renderStepperStep({ index: 9, activeIndex: 9 });
                // Assert
                expect(react_1.screen.getByText('STEP 10')).toBeInTheDocument();
            });
            it('should handle large index values', () => {
                // Arrange & Act
                renderStepperStep({ index: 99, activeIndex: 99 });
                // Assert
                expect(react_1.screen.getByText('STEP 100')).toBeInTheDocument();
            });
        });
        describe('activeIndex prop', () => {
            it('should determine state based on activeIndex comparison', () => {
                // Active: index === activeIndex
                const { rerender } = (0, react_1.render)(<step_1.StepperStep name="Step" index={1} activeIndex={1}/>);
                expect(react_1.screen.getByText('STEP 2')).toBeInTheDocument();
                // Completed: index < activeIndex
                rerender(<step_1.StepperStep name="Step" index={1} activeIndex={2}/>);
                expect(react_1.screen.getByText('2')).toBeInTheDocument();
                // Disabled: index > activeIndex
                rerender(<step_1.StepperStep name="Step" index={1} activeIndex={0}/>);
                expect(react_1.screen.getByText('2')).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle zero index correctly', () => {
            // Arrange & Act
            renderStepperStep({ index: 0, activeIndex: 0 });
            // Assert
            expect(react_1.screen.getByText('STEP 1')).toBeInTheDocument();
        });
        it('should handle negative activeIndex', () => {
            // Arrange & Act
            renderStepperStep({ index: 0, activeIndex: -1 });
            // Assert - Step should be disabled (index > activeIndex)
            expect(react_1.screen.getByText('1')).toBeInTheDocument();
        });
        it('should handle equal boundary (index equals activeIndex)', () => {
            // Arrange & Act
            renderStepperStep({ index: 5, activeIndex: 5 });
            // Assert - Should be active
            expect(react_1.screen.getByText('STEP 6')).toBeInTheDocument();
        });
        it('should handle name with HTML-like content safely', () => {
            // Arrange & Act
            renderStepperStep({ name: '<script>alert("xss")</script>' });
            // Assert - Should render as text, not execute
            expect(react_1.screen.getByText('<script>alert("xss")</script>')).toBeInTheDocument();
        });
        it('should handle name with unicode characters', () => {
            // Arrange & Act
            renderStepperStep({ name: 'Step 数据 🚀' });
            // Assert
            expect(react_1.screen.getByText('Step 数据 🚀')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Style Classes Verification
    // --------------------------------------------------------------------------
    describe('Style Classes', () => {
        it('should apply correct typography classes to label', () => {
            // Arrange & Act
            const { container } = renderStepperStep();
            // Assert
            const label = container.querySelector('.system-2xs-semibold-uppercase');
            expect(label).toBeInTheDocument();
        });
        it('should apply correct typography classes to name', () => {
            // Arrange & Act
            const { container } = renderStepperStep();
            // Assert
            const name = container.querySelector('.system-xs-medium-uppercase');
            expect(name).toBeInTheDocument();
        });
        it('should have rounded pill shape for label container', () => {
            // Arrange & Act
            const { container } = renderStepperStep();
            // Assert
            const labelContainer = container.querySelector('.rounded-3xl');
            expect(labelContainer).toBeInTheDocument();
        });
        it('should apply h-5 height to label container', () => {
            // Arrange & Act
            const { container } = renderStepperStep();
            // Assert
            const labelContainer = container.querySelector('.h-5');
            expect(labelContainer).toBeInTheDocument();
        });
    });
});
// ============================================================================
// Integration Tests - Stepper and StepperStep working together
// ============================================================================
describe('Stepper Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should pass correct props to each StepperStep', () => {
        // Arrange
        const steps = [
            createStep({ name: 'First' }),
            createStep({ name: 'Second' }),
            createStep({ name: 'Third' }),
        ];
        // Act
        renderStepper({ steps, activeIndex: 1 });
        // Assert - Each step receives correct index and displays correctly
        expect(react_1.screen.getByText('1')).toBeInTheDocument(); // Completed
        expect(react_1.screen.getByText('First')).toBeInTheDocument();
        expect(react_1.screen.getByText('STEP 2')).toBeInTheDocument(); // Active
        expect(react_1.screen.getByText('Second')).toBeInTheDocument();
        expect(react_1.screen.getByText('3')).toBeInTheDocument(); // Disabled
        expect(react_1.screen.getByText('Third')).toBeInTheDocument();
    });
    it('should maintain correct visual hierarchy across steps', () => {
        // Arrange
        const steps = createSteps(4);
        // Act
        const { container } = renderStepper({ steps, activeIndex: 2 });
        // Assert - Check visual hierarchy
        // Completed steps (0, 1) have border-text-quaternary
        const completedLabels = container.querySelectorAll('.border-text-quaternary');
        expect(completedLabels.length).toBe(2);
        // Active step has bg-state-accent-solid
        const activeLabel = container.querySelector('.bg-state-accent-solid');
        expect(activeLabel).toBeInTheDocument();
        // Disabled step (3) has border-divider-deep
        const disabledLabels = container.querySelectorAll('.border-divider-deep');
        expect(disabledLabels.length).toBe(1);
    });
    it('should render correctly with dynamic step updates', () => {
        // Arrange
        const initialSteps = createSteps(2);
        // Act
        const { rerender } = (0, react_1.render)(<index_1.Stepper steps={initialSteps} activeIndex={0}/>);
        expect(react_1.screen.getByText('Step 1')).toBeInTheDocument();
        expect(react_1.screen.getByText('Step 2')).toBeInTheDocument();
        // Update with more steps
        const updatedSteps = createSteps(4);
        rerender(<index_1.Stepper steps={updatedSteps} activeIndex={2}/>);
        // Assert
        expect(react_1.screen.getByText('STEP 3')).toBeInTheDocument();
        expect(react_1.screen.getByText('Step 4')).toBeInTheDocument();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQXVEO0FBQ3ZELG1DQUFpQztBQUNqQyxpQ0FBb0M7QUFFcEMsdUNBQXVDO0FBQ3ZDLE1BQU0sVUFBVSxHQUFHLENBQUMsWUFBMkIsRUFBRSxFQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzNELElBQUksRUFBRSxXQUFXO0lBQ2pCLEdBQUcsU0FBUztDQUNiLENBQUMsQ0FBQTtBQUVGLE1BQU0sV0FBVyxHQUFHLENBQUMsS0FBYSxFQUFFLFVBQVUsR0FBRyxNQUFNLEVBQVUsRUFBRSxDQUNqRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUV6Riw4Q0FBOEM7QUFDOUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUErQixFQUFFLEVBQUUsRUFBRTtJQUMxRCxNQUFNLFlBQVksR0FBaUI7UUFDakMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDckIsV0FBVyxFQUFFLENBQUM7UUFDZCxHQUFHLEtBQUs7S0FDVCxDQUFBO0lBQ0QsT0FBTyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQU8sQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtBQUM5QyxDQUFDLENBQUE7QUFFRCxrREFBa0Q7QUFDbEQsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFFBQW1DLEVBQUUsRUFBRSxFQUFFO0lBQ2xFLE1BQU0sWUFBWSxHQUFxQjtRQUNyQyxJQUFJLEVBQUUsV0FBVztRQUNqQixLQUFLLEVBQUUsQ0FBQztRQUNSLFdBQVcsRUFBRSxDQUFDO1FBQ2QsR0FB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RyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFbkMsTUFBTTtRQUNOLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRyxDQUFDLENBQUE7UUFDN0UsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3RELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUV0RCx5QkFBeUI7UUFDekIsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25DLFFBQVEsQ0FBQyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRyxDQUFDLENBQUE7UUFFMUQsU0FBUztRQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN0RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFDeEQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU3RlcHBlclByb3BzIH0gZnJvbSAnLi9pbmRleCdcbmltcG9ydCB0eXBlIHsgU3RlcCwgU3RlcHBlclN0ZXBQcm9wcyB9IGZyb20gJy4vc3RlcCdcbmltcG9ydCB7IHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IFN0ZXBwZXIgfSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgU3RlcHBlclN0ZXAgfSBmcm9tICcuL3N0ZXAnXG5cbi8vIFRlc3QgZGF0YSBmYWN0b3J5IGZvciBjcmVhdGluZyBzdGVwc1xuY29uc3QgY3JlYXRlU3RlcCA9IChvdmVycmlkZXM6IFBhcnRpYWw8U3RlcD4gPSB7fSk6IFN0ZXAgPT4gKHtcbiAgbmFtZTogJ1Rlc3QgU3RlcCcsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZVN0ZXBzID0gKGNvdW50OiBudW1iZXIsIG5hbWVQcmVmaXggPSAnU3RlcCcpOiBTdGVwW10gPT5cbiAgQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+IGNyZWF0ZVN0ZXAoeyBuYW1lOiBgJHtuYW1lUHJlZml4fSAke2kgKyAxfWAgfSkpXG5cbi8vIEhlbHBlciB0byByZW5kZXIgU3RlcHBlciB3aXRoIGRlZmF1bHQgcHJvcHNcbmNvbnN0IHJlbmRlclN0ZXBwZXIgPSAocHJvcHM6IFBhcnRpYWw8U3RlcHBlclByb3BzPiA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wczogU3RlcHBlclByb3BzID0ge1xuICAgIHN0ZXBzOiBjcmVhdGVTdGVwcygzKSxcbiAgICBhY3RpdmVJbmRleDogMCxcbiAgICAuLi5wcm9wcyxcbiAgfVxuICByZXR1cm4gcmVuZGVyKDxTdGVwcGVyIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxufVxuXG4vLyBIZWxwZXIgdG8gcmVuZGVyIFN0ZXBwZXJTdGVwIHdpdGggZGVmYXVsdCBwcm9wc1xuY29uc3QgcmVuZGVyU3RlcHBlclN0ZXAgPSAocHJvcHM6IFBhcnRpYWw8U3RlcHBlclN0ZXBQcm9wcz4gPSB7fSkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHM6IFN0ZXBwZXJTdGVwUHJvcHMgPSB7XG4gICAgbmFtZTogJ1Rlc3QgU3RlcCcsXG4gICAgaW5kZXg6IDAsXG4gICAgYWN0aXZlSW5kZXg6IDAsXG4gICAgLi4ucHJvcHMsXG4gIH1cbiAgcmV0dXJuIHJlbmRlcig8U3RlcHBlclN0ZXAgey4uLmRlZmF1bHRQcm9wc30gLz4pXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFN0ZXBwZXIgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnU3RlcHBlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzIC0gVmVyaWZ5IGNvbXBvbmVudCByZW5kZXJzIHByb3Blcmx5IHdpdGggdmFyaW91cyBpbnB1dHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcHBlcigpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBzdGVwIG5hbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3RlcHMgPSBjcmVhdGVTdGVwcygzLCAnQ3VzdG9tIFN0ZXAnKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlclN0ZXBwZXIoeyBzdGVwcyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gU3RlcCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gU3RlcCAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gU3RlcCAzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGl2aWRlcnMgYmV0d2VlbiBzdGVwcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHN0ZXBzID0gY3JlYXRlU3RlcHMoMylcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcHBlcih7IHN0ZXBzIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBoYXZlIDIgZGl2aWRlcnMgZm9yIDMgc3RlcHNcbiAgICAgIGNvbnN0IGRpdmlkZXJzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5iZy1kaXZpZGVyLWRlZXAnKVxuICAgICAgZXhwZWN0KGRpdmlkZXJzLmxlbmd0aCkudG9CZSgyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgZGl2aWRlciBhZnRlciBsYXN0IHN0ZXAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzdGVwcyA9IGNyZWF0ZVN0ZXBzKDIpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBwZXIoeyBzdGVwcyB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgaGF2ZSAxIGRpdmlkZXIgZm9yIDIgc3RlcHNcbiAgICAgIGNvbnN0IGRpdmlkZXJzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5iZy1kaXZpZGVyLWRlZXAnKVxuICAgICAgZXhwZWN0KGRpdmlkZXJzLmxlbmd0aCkudG9CZSgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGZsZXggY29udGFpbmVyIGxheW91dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwcGVyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnZmxleCcsICdpdGVtcy1jZW50ZXInLCAnZ2FwLTMnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVGVzdGluZyAtIFRlc3QgYWxsIHByb3AgdmFyaWF0aW9ucyBhbmQgY29tYmluYXRpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnc3RlcHMgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcnJlY3QgbnVtYmVyIG9mIHN0ZXBzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHN0ZXBzID0gY3JlYXRlU3RlcHMoNSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyU3RlcHBlcih7IHN0ZXBzIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdGVwIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3RlcCAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdGVwIDQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3RlcCA1JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHNpbmdsZSBzdGVwIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBzdGVwcyA9IFtjcmVhdGVTdGVwKHsgbmFtZTogJ09ubHkgU3RlcCcgfSldXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPbmx5IFN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAvLyBObyBkaXZpZGVycyBmb3Igc2luZ2xlIHN0ZXBcbiAgICAgICAgY29uc3QgZGl2aWRlcnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmJnLWRpdmlkZXItZGVlcCcpXG4gICAgICAgIGV4cGVjdChkaXZpZGVycy5sZW5ndGgpLnRvQmUoMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHN0ZXBzIHdpdGggbG9uZyBuYW1lcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBsb25nTmFtZSA9ICdUaGlzIGlzIGEgdmVyeSBsb25nIHN0ZXAgbmFtZSB0aGF0IG1pZ2h0IG92ZXJmbG93J1xuICAgICAgICBjb25zdCBzdGVwcyA9IFtjcmVhdGVTdGVwKHsgbmFtZTogbG9uZ05hbWUgfSldXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlclN0ZXBwZXIoeyBzdGVwcywgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ05hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdGVwcyB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBzdGVwcyA9IFtcbiAgICAgICAgICBjcmVhdGVTdGVwKHsgbmFtZTogJ1N0ZXAgJiBDb25maWd1cmF0aW9uJyB9KSxcbiAgICAgICAgICBjcmVhdGVTdGVwKHsgbmFtZTogJ1N0ZXAgPFByZXZpZXc+JyB9KSxcbiAgICAgICAgICBjcmVhdGVTdGVwKHsgbmFtZTogJ1N0ZXAgXCJDb21wbGV0ZVwiJyB9KSxcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdGVwICYgQ29uZmlndXJhdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdGVwIDxQcmV2aWV3PicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdGVwIFwiQ29tcGxldGVcIicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnYWN0aXZlSW5kZXggcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGlnaGxpZ2h0IGZpcnN0IHN0ZXAgd2hlbiBhY3RpdmVJbmRleCBpcyAwJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlclN0ZXBwZXIoeyBhY3RpdmVJbmRleDogMCB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEZpcnN0IHN0ZXAgc2hvdWxkIHNob3cgXCJTVEVQIDFcIiBsYWJlbFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU1RFUCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGlnaGxpZ2h0IHNlY29uZCBzdGVwIHdoZW4gYWN0aXZlSW5kZXggaXMgMScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJTdGVwcGVyKHsgYWN0aXZlSW5kZXg6IDEgfSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBTZWNvbmQgc3RlcCBzaG91bGQgc2hvdyBcIlNURVAgMlwiIGxhYmVsXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTVEVQIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoaWdobGlnaHQgbGFzdCBzdGVwIHdoZW4gYWN0aXZlSW5kZXggZXF1YWxzIHN0ZXBzIGxlbmd0aCAtIDEnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgc3RlcHMgPSBjcmVhdGVTdGVwcygzKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiAyIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gVGhpcmQgc3RlcCBzaG91bGQgc2hvdyBcIlNURVAgM1wiIGxhYmVsXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTVEVQIDMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGNvbXBsZXRlZCBzdGVwcyB3aXRoIG51bWJlciBvbmx5IChubyBTVEVQIHByZWZpeCknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgc3RlcHMgPSBjcmVhdGVTdGVwcygzKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiAyIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQ29tcGxldGVkIHN0ZXBzIHNob3cganVzdCB0aGUgbnVtYmVyXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU1RFUCAzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBkaXNhYmxlZCBzdGVwcyB3aXRoIG51bWJlciBvbmx5IChubyBTVEVQIHByZWZpeCknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgc3RlcHMgPSBjcmVhdGVTdGVwcygzKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gRGlzYWJsZWQgc3RlcHMgc2hvdyBqdXN0IHRoZSBudW1iZXJcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgLSBUZXN0IGJvdW5kYXJ5IGNvbmRpdGlvbnMgYW5kIHVuZXhwZWN0ZWQgaW5wdXRzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0ZXBzIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBwZXIoeyBzdGVwczogW10gfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29udGFpbmVyIHNob3VsZCByZW5kZXIgYnV0IGJlIGVtcHR5XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZD8uY2hpbGROb2Rlcy5sZW5ndGgpLnRvQmUoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWN0aXZlSW5kZXggZ3JlYXRlciB0aGFuIHN0ZXBzIGxlbmd0aCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHN0ZXBzID0gY3JlYXRlU3RlcHMoMilcblxuICAgICAgLy8gQWN0IC0gYWN0aXZlSW5kZXggNSBpcyBiZXlvbmQgYXJyYXkgYm91bmRzXG4gICAgICByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiA1IH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEFsbCBzdGVwcyBzaG91bGQgcmVuZGVyIGFzIGNvbXBsZXRlZCAoc2luY2UgYWN0aXZlSW5kZXggPiBhbGwgaW5kaWNlcylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbmVnYXRpdmUgYWN0aXZlSW5kZXgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzdGVwcyA9IGNyZWF0ZVN0ZXBzKDIpXG5cbiAgICAgIC8vIEFjdCAtIG5lZ2F0aXZlIGFjdGl2ZUluZGV4XG4gICAgICByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiAtMSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBBbGwgc3RlcHMgc2hvdWxkIHJlbmRlciBhcyBkaXNhYmxlZCAoc2luY2UgYWN0aXZlSW5kZXggPCBhbGwgaW5kaWNlcylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgbnVtYmVyIG9mIHN0ZXBzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3RlcHMgPSBjcmVhdGVTdGVwcygxMClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcHBlcih7IHN0ZXBzLCBhY3RpdmVJbmRleDogNSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTVEVQIDYnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIGhhdmUgOSBkaXZpZGVycyBmb3IgMTAgc3RlcHNcbiAgICAgIGNvbnN0IGRpdmlkZXJzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5iZy1kaXZpZGVyLWRlZXAnKVxuICAgICAgZXhwZWN0KGRpdmlkZXJzLmxlbmd0aCkudG9CZSg5KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdGVwcyB3aXRoIGVtcHR5IG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzdGVwcyA9IFtjcmVhdGVTdGVwKHsgbmFtZTogJycgfSldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBwZXIoeyBzdGVwcywgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHN0aWxsIHJlbmRlciB0aGUgc3RlcCBzdHJ1Y3R1cmVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTVEVQIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbnRlZ3JhdGlvbiAtIFRlc3Qgc3RlcCBzdGF0ZSBjb21iaW5hdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0ZXAgU3RhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1peGVkIHN0YXRlczogY29tcGxldGVkLCBhY3RpdmUsIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3RlcHMgPSBjcmVhdGVTdGVwcyg1KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlclN0ZXBwZXIoeyBzdGVwcywgYWN0aXZlSW5kZXg6IDIgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICAvLyBTdGVwcyAxLTIgYXJlIGNvbXBsZXRlZCAoc2hvdyBudW1iZXIgb25seSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIFN0ZXAgMyBpcyBhY3RpdmUgKHNob3dzIFNURVAgcHJlZml4KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBTdGVwcyA0LTUgYXJlIGRpc2FibGVkIChzaG93IG51bWJlciBvbmx5KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gdGhyb3VnaCBhbGwgc3RhdGVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHN0ZXBzID0gY3JlYXRlU3RlcHMoMylcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0IC0gU3RlcCAxIGFjdGl2ZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxTdGVwcGVyIHN0ZXBzPXtzdGVwc30gYWN0aXZlSW5kZXg9ezB9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFN0ZXAgMiBhY3RpdmVcbiAgICAgIHJlcmVuZGVyKDxTdGVwcGVyIHN0ZXBzPXtzdGVwc30gYWN0aXZlSW5kZXg9ezF9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFN0ZXAgMyBhY3RpdmVcbiAgICAgIHJlcmVuZGVyKDxTdGVwcGVyIHN0ZXBzPXtzdGVwc30gYWN0aXZlSW5kZXg9ezJ9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFN0ZXBwZXJTdGVwIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1N0ZXBwZXJTdGVwJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcHBlclN0ZXAoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdGVwIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdGVwcGVyU3RlcCh7IG5hbWU6ICdDb25maWd1cmUgRGF0YXNldCcgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ29uZmlndXJlIERhdGFzZXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGZsZXggY29udGFpbmVyIGxheW91dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwcGVyU3RlcCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2ZsZXgnLCAnaXRlbXMtY2VudGVyJywgJ2dhcC0yJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFjdGl2ZSBTdGF0ZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQWN0aXZlIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBTVEVQIHByZWZpeCB3aGVuIGFjdGl2ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0ZXBwZXJTdGVwKHsgaW5kZXg6IDAsIGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgYWN0aXZlIHN0eWxlcyB0byBsYWJlbCBjb250YWluZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcHBlclN0ZXAoeyBpbmRleDogMCwgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYWJlbENvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYmctc3RhdGUtYWNjZW50LXNvbGlkJylcbiAgICAgIGV4cGVjdChsYWJlbENvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGxhYmVsQ29udGFpbmVyKS50b0hhdmVDbGFzcygncHgtMicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgYWN0aXZlIHRleHQgY29sb3IgdG8gbGFiZWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcHBlclN0ZXAoeyBpbmRleDogMCwgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYWJlbCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXByaW1hcnktb24tc3VyZmFjZScpXG4gICAgICBleHBlY3QobGFiZWwpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBhY2NlbnQgdGV4dCBjb2xvciB0byBuYW1lIHdoZW4gYWN0aXZlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBwZXJTdGVwKHsgaW5kZXg6IDAsIGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbmFtZUVsZW1lbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtdGV4dC1hY2NlbnQnKVxuICAgICAgZXhwZWN0KG5hbWVFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QobmFtZUVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdzeXN0ZW0teHMtc2VtaWJvbGQtdXBwZXJjYXNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgYWN0aXZlIGNvcnJlY3RseSBmb3IgZGlmZmVyZW50IGluZGljZXMnLCAoKSA9PiB7XG4gICAgICAvLyBUZXN0IGluZGV4IDEgd2l0aCBhY3RpdmVJbmRleCAxXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxTdGVwcGVyU3RlcCBuYW1lPVwiU3RlcFwiIGluZGV4PXsxfSBhY3RpdmVJbmRleD17MX0gLz4sXG4gICAgICApXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU1RFUCAyJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gVGVzdCBpbmRleCA1IHdpdGggYWN0aXZlSW5kZXggNVxuICAgICAgcmVyZW5kZXIoPFN0ZXBwZXJTdGVwIG5hbWU9XCJTdGVwXCIgaW5kZXg9ezV9IGFjdGl2ZUluZGV4PXs1fSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTVEVQIDYnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcGxldGVkIFN0YXRlIFRlc3RzIChpbmRleCA8IGFjdGl2ZUluZGV4KVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ29tcGxldGVkIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBudW1iZXIgb25seSB3aGVuIGNvbXBsZXRlZCAobm90IGFjdGl2ZSknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdGVwcGVyU3RlcCh7IGluZGV4OiAwLCBhY3RpdmVJbmRleDogMSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ1NURVAgMScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvbXBsZXRlZCBzdHlsZXMgdG8gbGFiZWwgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBwZXJTdGVwKHsgaW5kZXg6IDAsIGFjdGl2ZUluZGV4OiAxIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGFiZWxDb250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmJvcmRlci10ZXh0LXF1YXRlcm5hcnknKVxuICAgICAgZXhwZWN0KGxhYmVsQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QobGFiZWxDb250YWluZXIpLnRvSGF2ZUNsYXNzKCd3LTUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHRlcnRpYXJ5IHRleHQgY29sb3IgdG8gbGFiZWwgd2hlbiBjb21wbGV0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcHBlclN0ZXAoeyBpbmRleDogMCwgYWN0aXZlSW5kZXg6IDEgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYWJlbCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgIGV4cGVjdChsYWJlbCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHRlcnRpYXJ5IHRleHQgY29sb3IgdG8gbmFtZSB3aGVuIGNvbXBsZXRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwcGVyU3RlcCh7IGluZGV4OiAwLCBhY3RpdmVJbmRleDogMiB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IG5hbWVFbGVtZW50cyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcudGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgIGV4cGVjdChuYW1lRWxlbWVudHMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERpc2FibGVkIFN0YXRlIFRlc3RzIChpbmRleCA+IGFjdGl2ZUluZGV4KVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRGlzYWJsZWQgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IG51bWJlciBvbmx5IHdoZW4gZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdGVwcGVyU3RlcCh7IGluZGV4OiAyLCBhY3RpdmVJbmRleDogMCB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCczJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ1NURVAgMycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGRpc2FibGVkIHN0eWxlcyB0byBsYWJlbCBjb250YWluZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcHBlclN0ZXAoeyBpbmRleDogMiwgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYWJlbENvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYm9yZGVyLWRpdmlkZXItZGVlcCcpXG4gICAgICBleHBlY3QobGFiZWxDb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChsYWJlbENvbnRhaW5lcikudG9IYXZlQ2xhc3MoJ3ctNScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgcXVhdGVybmFyeSB0ZXh0IGNvbG9yIHRvIGxhYmVsIHdoZW4gZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcHBlclN0ZXAoeyBpbmRleDogMiwgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYWJlbCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgICAgZXhwZWN0KGxhYmVsKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgcXVhdGVybmFyeSB0ZXh0IGNvbG9yIHRvIG5hbWUgd2hlbiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwcGVyU3RlcCh7IGluZGV4OiAyLCBhY3RpdmVJbmRleDogMCB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IG5hbWVFbGVtZW50cyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcudGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgICAgZXhwZWN0KG5hbWVFbGVtZW50cy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ25hbWUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHByb3ZpZGVkIG5hbWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyU3RlcHBlclN0ZXAoeyBuYW1lOiAnQ3VzdG9tIE5hbWUnIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gTmFtZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBuYW1lJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwcGVyU3RlcCh7IG5hbWU6ICcnIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gTGFiZWwgc2hvdWxkIHN0aWxsIHJlbmRlclxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU1RFUCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBuYW1lIHdpdGggd2hpdGVzcGFjZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJTdGVwcGVyU3RlcCh7IG5hbWU6ICcgIFBhZGRlZCBOYW1lICAnIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQYWRkZWQgTmFtZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaW5kZXggcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IDEtYmFzZWQgbnVtYmVyIGZvciBpbmRleCAwJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlclN0ZXBwZXJTdGVwKHsgaW5kZXg6IDAsIGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTVEVQIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3QgMS1iYXNlZCBudW1iZXIgZm9yIGluZGV4IDknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyU3RlcHBlclN0ZXAoeyBpbmRleDogOSwgYWN0aXZlSW5kZXg6IDkgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMTAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgaW5kZXggdmFsdWVzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlclN0ZXBwZXJTdGVwKHsgaW5kZXg6IDk5LCBhY3RpdmVJbmRleDogOTkgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMTAwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdhY3RpdmVJbmRleCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBkZXRlcm1pbmUgc3RhdGUgYmFzZWQgb24gYWN0aXZlSW5kZXggY29tcGFyaXNvbicsICgpID0+IHtcbiAgICAgICAgLy8gQWN0aXZlOiBpbmRleCA9PT0gYWN0aXZlSW5kZXhcbiAgICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxTdGVwcGVyU3RlcCBuYW1lPVwiU3RlcFwiIGluZGV4PXsxfSBhY3RpdmVJbmRleD17MX0gLz4sXG4gICAgICAgIClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgICAgLy8gQ29tcGxldGVkOiBpbmRleCA8IGFjdGl2ZUluZGV4XG4gICAgICAgIHJlcmVuZGVyKDxTdGVwcGVyU3RlcCBuYW1lPVwiU3RlcFwiIGluZGV4PXsxfSBhY3RpdmVJbmRleD17Mn0gLz4pXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcyJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgICAvLyBEaXNhYmxlZDogaW5kZXggPiBhY3RpdmVJbmRleFxuICAgICAgICByZXJlbmRlcig8U3RlcHBlclN0ZXAgbmFtZT1cIlN0ZXBcIiBpbmRleD17MX0gYWN0aXZlSW5kZXg9ezB9IC8+KVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB6ZXJvIGluZGV4IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0ZXBwZXJTdGVwKHsgaW5kZXg6IDAsIGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG5lZ2F0aXZlIGFjdGl2ZUluZGV4JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcHBlclN0ZXAoeyBpbmRleDogMCwgYWN0aXZlSW5kZXg6IC0xIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFN0ZXAgc2hvdWxkIGJlIGRpc2FibGVkIChpbmRleCA+IGFjdGl2ZUluZGV4KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlcXVhbCBib3VuZGFyeSAoaW5kZXggZXF1YWxzIGFjdGl2ZUluZGV4KScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0ZXBwZXJTdGVwKHsgaW5kZXg6IDUsIGFjdGl2ZUluZGV4OiA1IH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBiZSBhY3RpdmVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTVEVQIDYnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBuYW1lIHdpdGggSFRNTC1saWtlIGNvbnRlbnQgc2FmZWx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcHBlclN0ZXAoeyBuYW1lOiAnPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PicgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciBhcyB0ZXh0LCBub3QgZXhlY3V0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBuYW1lIHdpdGggdW5pY29kZSBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcHBlclN0ZXAoeyBuYW1lOiAnU3RlcCDmlbDmja4g8J+agCcgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3RlcCDmlbDmja4g8J+agCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTdHlsZSBDbGFzc2VzIFZlcmlmaWNhdGlvblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnU3R5bGUgQ2xhc3NlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3QgdHlwb2dyYXBoeSBjbGFzc2VzIHRvIGxhYmVsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBwZXJTdGVwKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYWJlbCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3lzdGVtLTJ4cy1zZW1pYm9sZC11cHBlcmNhc2UnKVxuICAgICAgZXhwZWN0KGxhYmVsKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCB0eXBvZ3JhcGh5IGNsYXNzZXMgdG8gbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwcGVyU3RlcCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbmFtZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3lzdGVtLXhzLW1lZGl1bS11cHBlcmNhc2UnKVxuICAgICAgZXhwZWN0KG5hbWUpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHJvdW5kZWQgcGlsbCBzaGFwZSBmb3IgbGFiZWwgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBwZXJTdGVwKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYWJlbENvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcucm91bmRlZC0zeGwnKVxuICAgICAgZXhwZWN0KGxhYmVsQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaC01IGhlaWdodCB0byBsYWJlbCBjb250YWluZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcHBlclN0ZXAoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxhYmVsQ29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5oLTUnKVxuICAgICAgZXhwZWN0KGxhYmVsQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEludGVncmF0aW9uIFRlc3RzIC0gU3RlcHBlciBhbmQgU3RlcHBlclN0ZXAgd29ya2luZyB0b2dldGhlclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1N0ZXBwZXIgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IHByb3BzIHRvIGVhY2ggU3RlcHBlclN0ZXAnLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IHN0ZXBzID0gW1xuICAgICAgY3JlYXRlU3RlcCh7IG5hbWU6ICdGaXJzdCcgfSksXG4gICAgICBjcmVhdGVTdGVwKHsgbmFtZTogJ1NlY29uZCcgfSksXG4gICAgICBjcmVhdGVTdGVwKHsgbmFtZTogJ1RoaXJkJyB9KSxcbiAgICBdXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiAxIH0pXG5cbiAgICAvLyBBc3NlcnQgLSBFYWNoIHN0ZXAgcmVjZWl2ZXMgY29ycmVjdCBpbmRleCBhbmQgZGlzcGxheXMgY29ycmVjdGx5XG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKSAvLyBDb21wbGV0ZWRcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRmlyc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTVEVQIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKSAvLyBBY3RpdmVcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2Vjb25kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMycpKS50b0JlSW5UaGVEb2N1bWVudCgpIC8vIERpc2FibGVkXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RoaXJkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIG1haW50YWluIGNvcnJlY3QgdmlzdWFsIGhpZXJhcmNoeSBhY3Jvc3Mgc3RlcHMnLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IHN0ZXBzID0gY3JlYXRlU3RlcHMoNClcblxuICAgIC8vIEFjdFxuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwcGVyKHsgc3RlcHMsIGFjdGl2ZUluZGV4OiAyIH0pXG5cbiAgICAvLyBBc3NlcnQgLSBDaGVjayB2aXN1YWwgaGllcmFyY2h5XG4gICAgLy8gQ29tcGxldGVkIHN0ZXBzICgwLCAxKSBoYXZlIGJvcmRlci10ZXh0LXF1YXRlcm5hcnlcbiAgICBjb25zdCBjb21wbGV0ZWRMYWJlbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmJvcmRlci10ZXh0LXF1YXRlcm5hcnknKVxuICAgIGV4cGVjdChjb21wbGV0ZWRMYWJlbHMubGVuZ3RoKS50b0JlKDIpXG5cbiAgICAvLyBBY3RpdmUgc3RlcCBoYXMgYmctc3RhdGUtYWNjZW50LXNvbGlkXG4gICAgY29uc3QgYWN0aXZlTGFiZWwgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmJnLXN0YXRlLWFjY2VudC1zb2xpZCcpXG4gICAgZXhwZWN0KGFjdGl2ZUxhYmVsKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAvLyBEaXNhYmxlZCBzdGVwICgzKSBoYXMgYm9yZGVyLWRpdmlkZXItZGVlcFxuICAgIGNvbnN0IGRpc2FibGVkTGFiZWxzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3JkZXItZGl2aWRlci1kZWVwJylcbiAgICBleHBlY3QoZGlzYWJsZWRMYWJlbHMubGVuZ3RoKS50b0JlKDEpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggZHluYW1pYyBzdGVwIHVwZGF0ZXMnLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IGluaXRpYWxTdGVwcyA9IGNyZWF0ZVN0ZXBzKDIpXG5cbiAgICAvLyBBY3RcbiAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFN0ZXBwZXIgc3RlcHM9e2luaXRpYWxTdGVwc30gYWN0aXZlSW5kZXg9ezB9IC8+KVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdGVwIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdGVwIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgLy8gVXBkYXRlIHdpdGggbW9yZSBzdGVwc1xuICAgIGNvbnN0IHVwZGF0ZWRTdGVwcyA9IGNyZWF0ZVN0ZXBzKDQpXG4gICAgcmVyZW5kZXIoPFN0ZXBwZXIgc3RlcHM9e3VwZGF0ZWRTdGVwc30gYWN0aXZlSW5kZXg9ezJ9IC8+KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NURVAgMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgNCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG59KVxuIl19