"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const index_1 = require("./index");
// Test utilities
const defaultProps = {
    show: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
};
const renderComponent = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    return (0, react_1.render)(<index_1.default {...mergedProps}/>);
};
describe('ConfirmModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('should render when show prop is true', () => {
            // Arrange & Act
            renderComponent({ show: true });
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('should not render when show prop is false', () => {
            // Arrange & Act
            renderComponent({ show: false });
            // Assert
            expect(react_1.screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        it('should render warning icon with proper styling', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const iconContainer = document.querySelector('.rounded-xl');
            expect(iconContainer).toBeInTheDocument();
            expect(iconContainer).toHaveClass('border-[0.5px]');
            expect(iconContainer).toHaveClass('bg-background-section');
        });
        it('should render translated title and description', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('tools.createTool.confirmTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('tools.createTool.confirmTip')).toBeInTheDocument();
        });
        it('should render action buttons with translated text', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('common.operation.cancel')).toBeInTheDocument();
            expect(react_1.screen.getByText('common.operation.confirm')).toBeInTheDocument();
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should handle missing onConfirm prop gracefully', () => {
            // Arrange & Act - Should not crash when onConfirm is undefined
            expect(() => {
                renderComponent({ onConfirm: undefined });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
            expect(react_1.screen.getByText('common.operation.confirm')).toBeInTheDocument();
        });
        it('should apply default styling and width constraints', () => {
            // Arrange & Act
            renderComponent();
            // Assert - Check for the dialog panel with modal content
            // The real modal structure has nested divs, we need to find the one with our classes
            const dialogContent = document.querySelector('.relative.rounded-2xl');
            expect(dialogContent).toBeInTheDocument();
            expect(dialogContent).toHaveClass('w-[600px]');
            expect(dialogContent).toHaveClass('max-w-[600px]');
            expect(dialogContent).toHaveClass('p-8');
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should call onClose when close button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onClose = vi.fn();
            renderComponent({ onClose });
            // Act - Find the close button and click it
            const closeButton = document.querySelector('.cursor-pointer');
            expect(closeButton).toBeInTheDocument(); // Ensure the button is found before clicking
            await user.click(closeButton);
            // Assert
            expect(onClose).toHaveBeenCalledTimes(1);
        });
        it('should call onClose when cancel button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onClose = vi.fn();
            renderComponent({ onClose });
            // Act
            const cancelButton = react_1.screen.getByText('common.operation.cancel');
            await user.click(cancelButton);
            // Assert
            expect(onClose).toHaveBeenCalledTimes(1);
        });
        it('should call onConfirm when confirm button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onConfirm = vi.fn();
            renderComponent({ onConfirm });
            // Act
            const confirmButton = react_1.screen.getByText('common.operation.confirm');
            await user.click(confirmButton);
            // Assert
            expect(onConfirm).toHaveBeenCalledTimes(1);
        });
        it('should not throw error when confirm button is clicked without onConfirm', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ onConfirm: undefined });
            const confirmButton = react_1.screen.getByText('common.operation.confirm');
            // Act & Assert - This will fail the test if user.click throws an unhandled error
            await user.click(confirmButton);
        });
        it('should have correct button variants', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const confirmButton = react_1.screen.getByText('common.operation.confirm');
            expect(confirmButton).toHaveClass('btn-warning');
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle rapid show/hide toggling', async () => {
            // Arrange
            const { rerender } = renderComponent({ show: false });
            // Assert - Initially not shown
            expect(react_1.screen.queryByRole('dialog')).not.toBeInTheDocument();
            // Act - Show modal
            await (0, react_1.act)(async () => {
                rerender(<index_1.default {...defaultProps} show={true}/>);
            });
            // Assert - Now shown
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
            // Act - Hide modal again
            await (0, react_1.act)(async () => {
                rerender(<index_1.default {...defaultProps} show={false}/>);
            });
            // Assert - Hidden again (wait for transition to complete)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByRole('dialog')).not.toBeInTheDocument();
            });
        });
        it('should handle multiple quick clicks on close button', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onClose = vi.fn();
            renderComponent({ onClose });
            const closeButton = document.querySelector('.cursor-pointer');
            expect(closeButton).toBeInTheDocument(); // Ensure the button is found before clicking
            // Act
            await user.click(closeButton);
            await user.click(closeButton);
            await user.click(closeButton);
            // Assert
            expect(onClose).toHaveBeenCalledTimes(3);
        });
        it('should handle multiple quick clicks on confirm button', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onConfirm = vi.fn();
            renderComponent({ onConfirm });
            // Act
            const confirmButton = react_1.screen.getByText('common.operation.confirm');
            await user.click(confirmButton);
            await user.click(confirmButton);
            await user.click(confirmButton);
            // Assert
            expect(onConfirm).toHaveBeenCalledTimes(3);
        });
        it('should handle multiple quick clicks on cancel button', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onClose = vi.fn();
            renderComponent({ onClose });
            // Act - Click cancel button twice
            const cancelButton = react_1.screen.getByText('common.operation.cancel');
            await user.click(cancelButton);
            await user.click(cancelButton);
            // Assert
            expect(onClose).toHaveBeenCalledTimes(2);
        });
    });
    // Accessibility tests
    describe('Accessibility', () => {
        it('should have proper button roles', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons).toHaveLength(2);
            expect(buttons[0]).toHaveTextContent('common.operation.cancel');
            expect(buttons[1]).toHaveTextContent('common.operation.confirm');
        });
        it('should have proper text hierarchy', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const title = react_1.screen.getByText('tools.createTool.confirmTitle');
            expect(title).toBeInTheDocument();
            const description = react_1.screen.getByText('tools.createTool.confirmTip');
            expect(description).toBeInTheDocument();
        });
        it('should have focusable interactive elements', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).toBeEnabled();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXFFO0FBQ3JFLDREQUFtRDtBQUNuRCwrQkFBOEI7QUFDOUIsbUNBQWtDO0FBRWxDLGlCQUFpQjtBQUNqQixNQUFNLFlBQVksR0FBRztJQUNuQixJQUFJLEVBQUUsSUFBSTtJQUNWLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2hCLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ25CLENBQUE7QUFFRCxNQUFNLGVBQWUsR0FBRyxDQUFDLFFBQTRELEVBQUUsRUFBRSxFQUFFO0lBQ3pGLE1BQU0sV0FBVyxHQUFHLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQTtJQUNqRCxPQUFPLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLElBQUksV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFBO0FBQ2xELENBQUMsQ0FBQTtBQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRiw2QkFBNkI7SUFDN0IsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxnQkFBZ0I7WUFDaEIsZUFBZSxFQUFFLENBQUE7WUFFakIsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDOUMsZ0JBQWdCO1lBQ2hCLGVBQWUsQ0FBQyxFQUFFLElBQUks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Q29udGVudCI6WyJpbXBvcnQgeyBhY3QsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB1c2VyRXZlbnQgZnJvbSAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29uZmlybU1vZGFsIGZyb20gJy4vaW5kZXgnXG5cbi8vIFRlc3QgdXRpbGl0aWVzXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIHNob3c6IHRydWUsXG4gIG9uQ2xvc2U6IHZpLmZuKCksXG4gIG9uQ29uZmlybTogdmkuZm4oKSxcbn1cblxuY29uc3QgcmVuZGVyQ29tcG9uZW50ID0gKHByb3BzOiBQYXJ0aWFsPFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBDb25maXJtTW9kYWw+PiA9IHt9KSA9PiB7XG4gIGNvbnN0IG1lcmdlZFByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMsIC4uLnByb3BzIH1cbiAgcmV0dXJuIHJlbmRlcig8Q29uZmlybU1vZGFsIHsuLi5tZXJnZWRQcm9wc30gLz4pXG59XG5cbmRlc2NyaWJlKCdDb25maXJtTW9kYWwnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFJlbmRlcmluZyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdoZW4gc2hvdyBwcm9wIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBzaG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB3aGVuIHNob3cgcHJvcCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHNob3c6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnZGlhbG9nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdhcm5pbmcgaWNvbiB3aXRoIHByb3BlciBzdHlsaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpY29uQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvdW5kZWQteGwnKVxuICAgICAgZXhwZWN0KGljb25Db250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChpY29uQ29udGFpbmVyKS50b0hhdmVDbGFzcygnYm9yZGVyLVswLjVweF0nKVxuICAgICAgZXhwZWN0KGljb25Db250YWluZXIpLnRvSGF2ZUNsYXNzKCdiZy1iYWNrZ3JvdW5kLXNlY3Rpb24nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0cmFuc2xhdGVkIHRpdGxlIGFuZCBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rvb2xzLmNyZWF0ZVRvb2wuY29uZmlybVRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd0b29scy5jcmVhdGVUb29sLmNvbmZpcm1UaXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhY3Rpb24gYnV0dG9ucyB3aXRoIHRyYW5zbGF0ZWQgdGV4dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNvbmZpcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcHMgdGVzdHMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBvbkNvbmZpcm0gcHJvcCBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdCAtIFNob3VsZCBub3QgY3Jhc2ggd2hlbiBvbkNvbmZpcm0gaXMgdW5kZWZpbmVkXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNvbmZpcm06IHVuZGVmaW5lZCB9KVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdkaWFsb2cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY29uZmlybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgZGVmYXVsdCBzdHlsaW5nIGFuZCB3aWR0aCBjb25zdHJhaW50cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciB0aGUgZGlhbG9nIHBhbmVsIHdpdGggbW9kYWwgY29udGVudFxuICAgICAgLy8gVGhlIHJlYWwgbW9kYWwgc3RydWN0dXJlIGhhcyBuZXN0ZWQgZGl2cywgd2UgbmVlZCB0byBmaW5kIHRoZSBvbmUgd2l0aCBvdXIgY2xhc3Nlc1xuICAgICAgY29uc3QgZGlhbG9nQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWxhdGl2ZS5yb3VuZGVkLTJ4bCcpXG4gICAgICBleHBlY3QoZGlhbG9nQ29udGVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGRpYWxvZ0NvbnRlbnQpLnRvSGF2ZUNsYXNzKCd3LVs2MDBweF0nKVxuICAgICAgZXhwZWN0KGRpYWxvZ0NvbnRlbnQpLnRvSGF2ZUNsYXNzKCdtYXgtdy1bNjAwcHhdJylcbiAgICAgIGV4cGVjdChkaWFsb2dDb250ZW50KS50b0hhdmVDbGFzcygncC04JylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25DbG9zZSB9KVxuXG4gICAgICAvLyBBY3QgLSBGaW5kIHRoZSBjbG9zZSBidXR0b24gYW5kIGNsaWNrIGl0XG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJzb3ItcG9pbnRlcicpXG4gICAgICBleHBlY3QoY2xvc2VCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KCkgLy8gRW5zdXJlIHRoZSBidXR0b24gaXMgZm91bmQgYmVmb3JlIGNsaWNraW5nXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNsb3NlQnV0dG9uISlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsb3NlIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25DbG9zZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2FuY2VsQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ29uZmlybSB3aGVuIGNvbmZpcm0gYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ29uZmlybSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNvbmZpcm0nKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0aHJvdyBlcnJvciB3aGVuIGNvbmZpcm0gYnV0dG9uIGlzIGNsaWNrZWQgd2l0aG91dCBvbkNvbmZpcm0nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ29uZmlybTogdW5kZWZpbmVkIH0pXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5jb25maXJtJylcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0IC0gVGhpcyB3aWxsIGZhaWwgdGhlIHRlc3QgaWYgdXNlci5jbGljayB0aHJvd3MgYW4gdW5oYW5kbGVkIGVycm9yXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbmZpcm1CdXR0b24pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGJ1dHRvbiB2YXJpYW50cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY29uZmlybScpXG4gICAgICBleHBlY3QoY29uZmlybUJ1dHRvbikudG9IYXZlQ2xhc3MoJ2J0bi13YXJuaW5nJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgQ2FzZXMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBzaG93L2hpZGUgdG9nZ2xpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJDb21wb25lbnQoeyBzaG93OiBmYWxzZSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbml0aWFsbHkgbm90IHNob3duXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdkaWFsb2cnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gU2hvdyBtb2RhbFxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgcmVyZW5kZXIoPENvbmZpcm1Nb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBzaG93PXt0cnVlfSAvPilcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vdyBzaG93blxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIEhpZGUgbW9kYWwgYWdhaW5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlcmVuZGVyKDxDb25maXJtTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gc2hvdz17ZmFsc2V9IC8+KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gSGlkZGVuIGFnYWluICh3YWl0IGZvciB0cmFuc2l0aW9uIHRvIGNvbXBsZXRlKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2RpYWxvZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgcXVpY2sgY2xpY2tzIG9uIGNsb3NlIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ2xvc2UgfSlcblxuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3Vyc29yLXBvaW50ZXInKVxuICAgICAgZXhwZWN0KGNsb3NlQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpIC8vIEVuc3VyZSB0aGUgYnV0dG9uIGlzIGZvdW5kIGJlZm9yZSBjbGlja2luZ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2xvc2VCdXR0b24hKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjbG9zZUJ1dHRvbiEpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNsb3NlQnV0dG9uISlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIHF1aWNrIGNsaWNrcyBvbiBjb25maXJtIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgb25Db25maXJtID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25Db25maXJtIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY29uZmlybScpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbmZpcm1CdXR0b24pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbmZpcm1CdXR0b24pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ29uZmlybSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIHF1aWNrIGNsaWNrcyBvbiBjYW5jZWwgYnV0dG9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25DbG9zZSB9KVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBjYW5jZWwgYnV0dG9uIHR3aWNlXG4gICAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNhbmNlbEJ1dHRvbilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2FuY2VsQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuICB9KVxuXG4gIC8vIEFjY2Vzc2liaWxpdHkgdGVzdHNcbiAgZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIHByb3BlciBidXR0b24gcm9sZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgICAgZXhwZWN0KGJ1dHRvbnNbMF0pLnRvSGF2ZVRleHRDb250ZW50KCdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcpXG4gICAgICBleHBlY3QoYnV0dG9uc1sxXSkudG9IYXZlVGV4dENvbnRlbnQoJ2NvbW1vbi5vcGVyYXRpb24uY29uZmlybScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgdGV4dCBoaWVyYXJjaHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRpdGxlID0gc2NyZWVuLmdldEJ5VGV4dCgndG9vbHMuY3JlYXRlVG9vbC5jb25maXJtVGl0bGUnKVxuICAgICAgZXhwZWN0KHRpdGxlKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgndG9vbHMuY3JlYXRlVG9vbC5jb25maXJtVGlwJylcbiAgICAgIGV4cGVjdChkZXNjcmlwdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgZm9jdXNhYmxlIGludGVyYWN0aXZlIGVsZW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGV4cGVjdChidXR0b24pLnRvQmVFbmFibGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=