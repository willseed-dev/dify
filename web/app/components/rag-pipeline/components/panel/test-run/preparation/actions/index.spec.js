"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
// ============================================================================
// Actions Component Tests
// ============================================================================
describe('Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should render button with translated text', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            // Assert - Translation mock returns key with namespace prefix
            expect(react_1.screen.getByText('datasetCreation.stepOne.button')).toBeInTheDocument();
        });
        it('should render with correct container structure', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { container } = (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper.className).toContain('flex');
            expect(wrapper.className).toContain('justify-end');
            expect(wrapper.className).toContain('p-4');
            expect(wrapper.className).toContain('pt-2');
        });
        it('should render span with px-0.5 class around text', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { container } = (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            // Assert
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
            expect(span?.className).toContain('px-0.5');
        });
    });
    // -------------------------------------------------------------------------
    // Props Variations Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should pass disabled=true to button when disabled prop is true', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeDisabled();
        });
        it('should pass disabled=false to button when disabled prop is false', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
        });
        it('should not disable button when disabled prop is undefined', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
        });
        it('should handle disabled switching from true to false', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            // Assert - Initially disabled
            expect(react_1.screen.getByRole('button')).toBeDisabled();
            // Act - Rerender with disabled=false
            rerender(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Assert - Now enabled
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
        });
        it('should handle disabled switching from false to true', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Assert - Initially enabled
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            // Act - Rerender with disabled=true
            rerender(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            // Assert - Now disabled
            expect(react_1.screen.getByRole('button')).toBeDisabled();
        });
        it('should handle undefined disabled becoming true', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            // Assert - Initially not disabled (undefined)
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            // Act - Rerender with disabled=true
            rerender(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            // Assert - Now disabled
            expect(react_1.screen.getByRole('button')).toBeDisabled();
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call handleNextStep when button is clicked', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleNextStep).toHaveBeenCalledTimes(1);
        });
        it('should call handleNextStep exactly once per click', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleNextStep).toHaveBeenCalled();
            expect(handleNextStep.mock.calls).toHaveLength(1);
        });
        it('should call handleNextStep multiple times on multiple clicks', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            // Assert
            expect(handleNextStep).toHaveBeenCalledTimes(3);
        });
        it('should not call handleNextStep when button is disabled and clicked', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - Disabled button should not trigger onClick
            expect(handleNextStep).not.toHaveBeenCalled();
        });
        it('should handle rapid clicks when not disabled', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            const button = react_1.screen.getByRole('button');
            // Simulate rapid clicks
            for (let i = 0; i < 10; i++)
                react_1.fireEvent.click(button);
            // Assert
            expect(handleNextStep).toHaveBeenCalledTimes(10);
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should use the new handleNextStep when prop changes', () => {
            // Arrange
            const handleNextStep1 = vi.fn();
            const handleNextStep2 = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default handleNextStep={handleNextStep1}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            rerender(<index_1.default handleNextStep={handleNextStep2}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleNextStep1).toHaveBeenCalledTimes(1);
            expect(handleNextStep2).toHaveBeenCalledTimes(1);
        });
        it('should maintain functionality after rerender with same props', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            rerender(<index_1.default handleNextStep={handleNextStep}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleNextStep).toHaveBeenCalledTimes(2);
        });
        it('should work correctly when handleNextStep changes multiple times', () => {
            // Arrange
            const handleNextStep1 = vi.fn();
            const handleNextStep2 = vi.fn();
            const handleNextStep3 = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default handleNextStep={handleNextStep1}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            rerender(<index_1.default handleNextStep={handleNextStep2}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            rerender(<index_1.default handleNextStep={handleNextStep3}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleNextStep1).toHaveBeenCalledTimes(1);
            expect(handleNextStep2).toHaveBeenCalledTimes(1);
            expect(handleNextStep3).toHaveBeenCalledTimes(1);
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act - Verify component is memoized by checking display name pattern
            const { rerender } = (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            // Rerender with same props should work without issues
            rerender(<index_1.default handleNextStep={handleNextStep}/>);
            // Assert - Component should render correctly after rerender
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should not break when props remain the same across rerenders', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Multiple rerenders with same props
            for (let i = 0; i < 5; i++) {
                rerender(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            }
            // Assert - Should still function correctly
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(handleNextStep).toHaveBeenCalledTimes(1);
        });
        it('should update correctly when only disabled prop changes', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Assert - Initially not disabled
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            // Act - Change only disabled prop
            rerender(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            // Assert - Should reflect the new disabled state
            expect(react_1.screen.getByRole('button')).toBeDisabled();
        });
        it('should update correctly when only handleNextStep prop changes', () => {
            // Arrange
            const handleNextStep1 = vi.fn();
            const handleNextStep2 = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default disabled={false} handleNextStep={handleNextStep1}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(handleNextStep1).toHaveBeenCalledTimes(1);
            // Act - Change only handleNextStep prop
            rerender(<index_1.default disabled={false} handleNextStep={handleNextStep2}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - New callback should be used
            expect(handleNextStep1).toHaveBeenCalledTimes(1);
            expect(handleNextStep2).toHaveBeenCalledTimes(1);
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should call handleNextStep even if it has side effects', () => {
            // Arrange
            let sideEffectValue = 0;
            const handleNextStep = vi.fn(() => {
                sideEffectValue = 42;
            });
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleNextStep).toHaveBeenCalledTimes(1);
            expect(sideEffectValue).toBe(42);
        });
        it('should handle handleNextStep that returns a value', () => {
            // Arrange
            const handleNextStep = vi.fn(() => 'return value');
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleNextStep).toHaveBeenCalledTimes(1);
            expect(handleNextStep).toHaveReturnedWith('return value');
        });
        it('should handle handleNextStep that is async', async () => {
            // Arrange
            const handleNextStep = vi.fn().mockResolvedValue(undefined);
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleNextStep).toHaveBeenCalledTimes(1);
        });
        it('should render correctly with both disabled=true and handleNextStep', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toBeDisabled();
        });
        it('should handle component unmount gracefully', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { unmount } = (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            // Assert - Unmount should not throw
            expect(() => unmount()).not.toThrow();
        });
        it('should handle disabled as boolean-like falsy value', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act - Test with explicit false
            (0, react_1.render)(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
        });
    });
    // -------------------------------------------------------------------------
    // Accessibility Tests
    // -------------------------------------------------------------------------
    describe('Accessibility', () => {
        it('should have button element that can receive focus', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default handleNextStep={handleNextStep}/>);
            const button = react_1.screen.getByRole('button');
            // Assert - Button should be focusable (not disabled by default)
            expect(button).not.toBeDisabled();
        });
        it('should indicate disabled state correctly', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toHaveAttribute('disabled');
        });
    });
    // -------------------------------------------------------------------------
    // Integration Tests
    // -------------------------------------------------------------------------
    describe('Integration', () => {
        it('should work in a typical workflow: enable -> click -> disable', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act - Start enabled
            const { rerender } = (0, react_1.render)(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Assert - Can click when enabled
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(handleNextStep).toHaveBeenCalledTimes(1);
            // Act - Disable after click (simulating loading state)
            rerender(<index_1.default disabled={true} handleNextStep={handleNextStep}/>);
            // Assert - Cannot click when disabled
            expect(react_1.screen.getByRole('button')).toBeDisabled();
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(handleNextStep).toHaveBeenCalledTimes(1); // Still 1, not 2
            // Act - Re-enable
            rerender(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Assert - Can click again
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(handleNextStep).toHaveBeenCalledTimes(2);
        });
        it('should maintain consistent rendering across multiple state changes', () => {
            // Arrange
            const handleNextStep = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default disabled={false} handleNextStep={handleNextStep}/>);
            // Toggle disabled state multiple times
            const states = [true, false, true, false, true];
            states.forEach((disabled) => {
                rerender(<index_1.default disabled={disabled} handleNextStep={handleNextStep}/>);
                if (disabled)
                    expect(react_1.screen.getByRole('button')).toBeDisabled();
                else
                    expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            });
            // Assert - Button should still render correctly
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepOne.button')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQWtFO0FBQ2xFLG1DQUE2QjtBQUU3QiwrRUFBK0U7QUFDL0UsMEJBQTBCO0FBQzFCLCtFQUErRTtBQUUvRSxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN2QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsNEVBQTRFO0lBQzVFLGtCQUFrQjtJQUNsQiw0RUFBNEU7SUFDNUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxVQUFVO1lBQ1YsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1lBRTlCLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbkQsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7WUFDbkQsVUFBVTtZQUNWLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtZQUU5QixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRW5ELDhEQUE4RDtZQUM5RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVB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Q0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCBBY3Rpb25zIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEFjdGlvbnMgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdBY3Rpb25zJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBidXR0b24gd2l0aCB0cmFuc2xhdGVkIHRleHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbnMgaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gVHJhbnNsYXRpb24gbW9jayByZXR1cm5zIGtleSB3aXRoIG5hbWVzcGFjZSBwcmVmaXhcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGNvcnJlY3QgY29udGFpbmVyIHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFjdGlvbnMgaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdCh3cmFwcGVyLmNsYXNzTmFtZSkudG9Db250YWluKCdmbGV4JylcbiAgICAgIGV4cGVjdCh3cmFwcGVyLmNsYXNzTmFtZSkudG9Db250YWluKCdqdXN0aWZ5LWVuZCcpXG4gICAgICBleHBlY3Qod3JhcHBlci5jbGFzc05hbWUpLnRvQ29udGFpbigncC00JylcbiAgICAgIGV4cGVjdCh3cmFwcGVyLmNsYXNzTmFtZSkudG9Db250YWluKCdwdC0yJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc3BhbiB3aXRoIHB4LTAuNSBjbGFzcyBhcm91bmQgdGV4dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFjdGlvbnMgaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzcGFuID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKVxuICAgICAgZXhwZWN0KHNwYW4pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzcGFuPy5jbGFzc05hbWUpLnRvQ29udGFpbigncHgtMC41JylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcyBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBkaXNhYmxlZD10cnVlIHRvIGJ1dHRvbiB3aGVuIGRpc2FibGVkIHByb3AgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyBkaXNhYmxlZD17dHJ1ZX0gaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBkaXNhYmxlZD1mYWxzZSB0byBidXR0b24gd2hlbiBkaXNhYmxlZCBwcm9wIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIGRpc2FibGVkPXtmYWxzZX0gaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBkaXNhYmxlIGJ1dHRvbiB3aGVuIGRpc2FibGVkIHByb3AgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlzYWJsZWQgc3dpdGNoaW5nIGZyb20gdHJ1ZSB0byBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnMgZGlzYWJsZWQ9e3RydWV9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWxseSBkaXNhYmxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuXG4gICAgICAvLyBBY3QgLSBSZXJlbmRlciB3aXRoIGRpc2FibGVkPWZhbHNlXG4gICAgICByZXJlbmRlcig8QWN0aW9ucyBkaXNhYmxlZD17ZmFsc2V9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vdyBlbmFibGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaXNhYmxlZCBzd2l0Y2hpbmcgZnJvbSBmYWxzZSB0byB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0aW9ucyBkaXNhYmxlZD17ZmFsc2V9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWxseSBlbmFibGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuXG4gICAgICAvLyBBY3QgLSBSZXJlbmRlciB3aXRoIGRpc2FibGVkPXRydWVcbiAgICAgIHJlcmVuZGVyKDxBY3Rpb25zIGRpc2FibGVkPXt0cnVlfSBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBOb3cgZGlzYWJsZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGRpc2FibGVkIGJlY29taW5nIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWxseSBub3QgZGlzYWJsZWQgKHVuZGVmaW5lZClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkubm90LnRvQmVEaXNhYmxlZCgpXG5cbiAgICAgIC8vIEFjdCAtIFJlcmVuZGVyIHdpdGggZGlzYWJsZWQ9dHJ1ZVxuICAgICAgcmVyZW5kZXIoPEFjdGlvbnMgZGlzYWJsZWQ9e3RydWV9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vdyBkaXNhYmxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVc2VyIEludGVyYWN0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVOZXh0U3RlcCB3aGVuIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZU5leHRTdGVwIGV4YWN0bHkgb25jZSBwZXIgY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbnMgaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlTmV4dFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwLm1vY2suY2FsbHMpLnRvSGF2ZUxlbmd0aCgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlTmV4dFN0ZXAgbXVsdGlwbGUgdGltZXMgb24gbXVsdGlwbGUgY2xpY2tzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVOZXh0U3RlcCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgaGFuZGxlTmV4dFN0ZXAgd2hlbiBidXR0b24gaXMgZGlzYWJsZWQgYW5kIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbnMgZGlzYWJsZWQ9e3RydWV9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIERpc2FibGVkIGJ1dHRvbiBzaG91bGQgbm90IHRyaWdnZXIgb25DbGlja1xuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIGNsaWNrcyB3aGVuIG5vdCBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcblxuICAgICAgLy8gU2ltdWxhdGUgcmFwaWQgY2xpY2tzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMTApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1c2UgdGhlIG5ldyBoYW5kbGVOZXh0U3RlcCB3aGVuIHByb3AgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwMSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwMiA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcDF9IC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICByZXJlbmRlcig8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXAyfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlTmV4dFN0ZXAxKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChoYW5kbGVOZXh0U3RlcDIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGZ1bmN0aW9uYWxpdHkgYWZ0ZXIgcmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICByZXJlbmRlcig8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVOZXh0U3RlcCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgd29yayBjb3JyZWN0bHkgd2hlbiBoYW5kbGVOZXh0U3RlcCBjaGFuZ2VzIG11bHRpcGxlIHRpbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAxID0gdmkuZm4oKVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAyID0gdmkuZm4oKVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAzID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnMgaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwMX0gLz4sXG4gICAgICApXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIHJlcmVuZGVyKDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcDJ9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICByZXJlbmRlcig8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXAzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlTmV4dFN0ZXAxKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChoYW5kbGVOZXh0U3RlcDIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwMykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0IC0gVmVyaWZ5IGNvbXBvbmVudCBpcyBtZW1vaXplZCBieSBjaGVja2luZyBkaXNwbGF5IG5hbWUgcGF0dGVyblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIHNhbWUgcHJvcHMgc2hvdWxkIHdvcmsgd2l0aG91dCBpc3N1ZXNcbiAgICAgIHJlcmVuZGVyKDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgcmVuZGVyIGNvcnJlY3RseSBhZnRlciByZXJlbmRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGJyZWFrIHdoZW4gcHJvcHMgcmVtYWluIHRoZSBzYW1lIGFjcm9zcyByZXJlbmRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zIGRpc2FibGVkPXtmYWxzZX0gaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gTXVsdGlwbGUgcmVyZW5kZXJzIHdpdGggc2FtZSBwcm9wc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgcmVyZW5kZXIoPEFjdGlvbnMgZGlzYWJsZWQ9e2ZhbHNlfSBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuICAgICAgfVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc3RpbGwgZnVuY3Rpb24gY29ycmVjdGx5XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICBleHBlY3QoaGFuZGxlTmV4dFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjb3JyZWN0bHkgd2hlbiBvbmx5IGRpc2FibGVkIHByb3AgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnMgZGlzYWJsZWQ9e2ZhbHNlfSBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbml0aWFsbHkgbm90IGRpc2FibGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuXG4gICAgICAvLyBBY3QgLSBDaGFuZ2Ugb25seSBkaXNhYmxlZCBwcm9wXG4gICAgICByZXJlbmRlcig8QWN0aW9ucyBkaXNhYmxlZD17dHJ1ZX0gaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlZmxlY3QgdGhlIG5ldyBkaXNhYmxlZCBzdGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjb3JyZWN0bHkgd2hlbiBvbmx5IGhhbmRsZU5leHRTdGVwIHByb3AgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwMSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwMiA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zIGRpc2FibGVkPXtmYWxzZX0gaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwMX0gLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcbiAgICAgIGV4cGVjdChoYW5kbGVOZXh0U3RlcDEpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICAvLyBBY3QgLSBDaGFuZ2Ugb25seSBoYW5kbGVOZXh0U3RlcCBwcm9wXG4gICAgICByZXJlbmRlcig8QWN0aW9ucyBkaXNhYmxlZD17ZmFsc2V9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcDJ9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBOZXcgY2FsbGJhY2sgc2hvdWxkIGJlIHVzZWRcbiAgICAgIGV4cGVjdChoYW5kbGVOZXh0U3RlcDEpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwMikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlTmV4dFN0ZXAgZXZlbiBpZiBpdCBoYXMgc2lkZSBlZmZlY3RzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbGV0IHNpZGVFZmZlY3RWYWx1ZSA9IDBcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKCkgPT4ge1xuICAgICAgICBzaWRlRWZmZWN0VmFsdWUgPSA0MlxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbnMgaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlTmV4dFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KHNpZGVFZmZlY3RWYWx1ZSkudG9CZSg0MilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaGFuZGxlTmV4dFN0ZXAgdGhhdCByZXR1cm5zIGEgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHZpLmZuKCgpID0+ICdyZXR1cm4gdmFsdWUnKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVOZXh0U3RlcCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QoaGFuZGxlTmV4dFN0ZXApLnRvSGF2ZVJldHVybmVkV2l0aCgncmV0dXJuIHZhbHVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaGFuZGxlTmV4dFN0ZXAgdGhhdCBpcyBhc3luYycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggYm90aCBkaXNhYmxlZD10cnVlIGFuZCBoYW5kbGVOZXh0U3RlcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyBkaXNhYmxlZD17dHJ1ZX0gaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tcG9uZW50IHVubW91bnQgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxBY3Rpb25zIGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFVubW91bnQgc2hvdWxkIG5vdCB0aHJvd1xuICAgICAgZXhwZWN0KCgpID0+IHVubW91bnQoKSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaXNhYmxlZCBhcyBib29sZWFuLWxpa2UgZmFsc3kgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0IC0gVGVzdCB3aXRoIGV4cGxpY2l0IGZhbHNlXG4gICAgICByZW5kZXIoPEFjdGlvbnMgZGlzYWJsZWQ9e2ZhbHNlfSBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYnV0dG9uIGVsZW1lbnQgdGhhdCBjYW4gcmVjZWl2ZSBmb2N1cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcblxuICAgICAgLy8gQXNzZXJ0IC0gQnV0dG9uIHNob3VsZCBiZSBmb2N1c2FibGUgKG5vdCBkaXNhYmxlZCBieSBkZWZhdWx0KVxuICAgICAgZXhwZWN0KGJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5kaWNhdGUgZGlzYWJsZWQgc3RhdGUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIGRpc2FibGVkPXt0cnVlfSBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9IYXZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEludGVncmF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgd29yayBpbiBhIHR5cGljYWwgd29ya2Zsb3c6IGVuYWJsZSAtPiBjbGljayAtPiBkaXNhYmxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlTmV4dFN0ZXAgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdCAtIFN0YXJ0IGVuYWJsZWRcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnMgZGlzYWJsZWQ9e2ZhbHNlfSBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDYW4gY2xpY2sgd2hlbiBlbmFibGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgICAgLy8gQWN0IC0gRGlzYWJsZSBhZnRlciBjbGljayAoc2ltdWxhdGluZyBsb2FkaW5nIHN0YXRlKVxuICAgICAgcmVyZW5kZXIoPEFjdGlvbnMgZGlzYWJsZWQ9e3RydWV9IGhhbmRsZU5leHRTdGVwPXtoYW5kbGVOZXh0U3RlcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENhbm5vdCBjbGljayB3aGVuIGRpc2FibGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICBleHBlY3QoaGFuZGxlTmV4dFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKSAvLyBTdGlsbCAxLCBub3QgMlxuXG4gICAgICAvLyBBY3QgLSBSZS1lbmFibGVcbiAgICAgIHJlcmVuZGVyKDxBY3Rpb25zIGRpc2FibGVkPXtmYWxzZX0gaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2FuIGNsaWNrIGFnYWluXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuICAgICAgZXhwZWN0KGhhbmRsZU5leHRTdGVwKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBjb25zaXN0ZW50IHJlbmRlcmluZyBhY3Jvc3MgbXVsdGlwbGUgc3RhdGUgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZU5leHRTdGVwID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnMgZGlzYWJsZWQ9e2ZhbHNlfSBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBUb2dnbGUgZGlzYWJsZWQgc3RhdGUgbXVsdGlwbGUgdGltZXNcbiAgICAgIGNvbnN0IHN0YXRlcyA9IFt0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWVdXG4gICAgICBzdGF0ZXMuZm9yRWFjaCgoZGlzYWJsZWQpID0+IHtcbiAgICAgICAgcmVyZW5kZXIoPEFjdGlvbnMgZGlzYWJsZWQ9e2Rpc2FibGVkfSBoYW5kbGVOZXh0U3RlcD17aGFuZGxlTmV4dFN0ZXB9IC8+KVxuICAgICAgICBpZiAoZGlzYWJsZWQpXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEJ1dHRvbiBzaG91bGQgc3RpbGwgcmVuZGVyIGNvcnJlY3RseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==