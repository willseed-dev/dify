"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const types_1 = require("@/app/components/workflow/types");
const index_1 = require("./index");
// Mock Modal component
vi.mock('@/app/components/base/modal', () => ({
    default: function MockModal({ isShow, onClose, children, closable, }) {
        if (!isShow)
            return null;
        return (<div data-testid="modal" role="dialog">
        {closable && (<button data-testid="modal-close-button" onClick={onClose}>
            Close
          </button>)}
        {children}
      </div>);
    },
}));
// Mock useDocLink hook
vi.mock('@/context/i18n', () => ({
    useDocLink: () => (path) => `https://docs.example.com${path}`,
}));
// Mock StartNodeSelectionPanel (using real component would be better for integration,
// but for this test we'll mock to control behavior)
vi.mock('./start-node-selection-panel', () => ({
    default: function MockStartNodeSelectionPanel({ onSelectUserInput, onSelectTrigger, }) {
        return (<div data-testid="start-node-selection-panel">
        <button data-testid="select-user-input" onClick={onSelectUserInput}>
          Select User Input
        </button>
        <button data-testid="select-trigger-schedule" onClick={() => onSelectTrigger(types_1.BlockEnum.TriggerSchedule)}>
          Select Trigger Schedule
        </button>
        <button data-testid="select-trigger-webhook" onClick={() => onSelectTrigger(types_1.BlockEnum.TriggerWebhook, { config: 'test' })}>
          Select Trigger Webhook
        </button>
      </div>);
    },
}));
describe('WorkflowOnboardingModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSelectStartNode = vi.fn();
    const defaultProps = {
        isShow: true,
        onClose: mockOnClose,
        onSelectStartNode: mockOnSelectStartNode,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Helper function to render component
    const renderComponent = (props = {}) => {
        return (0, react_1.render)(<index_1.default {...defaultProps} {...props}/>);
    };
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('should render modal when isShow is true', () => {
            // Arrange & Act
            renderComponent({ isShow: true });
            // Assert
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
        it('should not render modal when isShow is false', () => {
            // Arrange & Act
            renderComponent({ isShow: false });
            // Assert
            expect(react_1.screen.queryByTestId('modal')).not.toBeInTheDocument();
        });
        it('should render modal title', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.title')).toBeInTheDocument();
        });
        it('should render modal description', () => {
            // Arrange & Act
            const { container } = renderComponent();
            // Assert - Check both parts of description (separated by link)
            const descriptionDiv = container.querySelector('.body-xs-regular.leading-4');
            expect(descriptionDiv).toBeInTheDocument();
            expect(descriptionDiv).toHaveTextContent('workflow.onboarding.description');
            expect(descriptionDiv).toHaveTextContent('workflow.onboarding.aboutStartNode');
        });
        it('should render learn more link', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const learnMoreLink = react_1.screen.getByText('workflow.onboarding.learnMore');
            expect(learnMoreLink).toBeInTheDocument();
            expect(learnMoreLink.closest('a')).toHaveAttribute('href', 'https://docs.example.com/guides/workflow/node/start');
            expect(learnMoreLink.closest('a')).toHaveAttribute('target', '_blank');
            expect(learnMoreLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
        });
        it('should render StartNodeSelectionPanel', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByTestId('start-node-selection-panel')).toBeInTheDocument();
        });
        it('should render ESC tip when modal is shown', () => {
            // Arrange & Act
            renderComponent({ isShow: true });
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.escTip.press')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.escTip.key')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.escTip.toDismiss')).toBeInTheDocument();
        });
        it('should not render ESC tip when modal is hidden', () => {
            // Arrange & Act
            renderComponent({ isShow: false });
            // Assert
            expect(react_1.screen.queryByText('workflow.onboarding.escTip.press')).not.toBeInTheDocument();
        });
        it('should have correct styling for title', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const title = react_1.screen.getByText('workflow.onboarding.title');
            expect(title).toHaveClass('title-2xl-semi-bold');
            expect(title).toHaveClass('text-text-primary');
        });
        it('should have modal close button', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByTestId('modal-close-button')).toBeInTheDocument();
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should accept isShow prop', () => {
            // Arrange & Act
            const { rerender } = renderComponent({ isShow: false });
            // Assert
            expect(react_1.screen.queryByTestId('modal')).not.toBeInTheDocument();
            // Act
            rerender(<index_1.default {...defaultProps} isShow={true}/>);
            // Assert
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
        it('should accept onClose prop', () => {
            // Arrange
            const customOnClose = vi.fn();
            // Act
            renderComponent({ onClose: customOnClose });
            // Assert
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
        it('should accept onSelectStartNode prop', () => {
            // Arrange
            const customHandler = vi.fn();
            // Act
            renderComponent({ onSelectStartNode: customHandler });
            // Assert
            expect(react_1.screen.getByTestId('start-node-selection-panel')).toBeInTheDocument();
        });
        it('should handle undefined onClose gracefully', () => {
            // Arrange & Act
            expect(() => {
                renderComponent({ onClose: undefined });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
        it('should handle undefined onSelectStartNode gracefully', () => {
            // Arrange & Act
            expect(() => {
                renderComponent({ onSelectStartNode: undefined });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
    });
    // User Interactions - Start Node Selection
    describe('User Interactions - Start Node Selection', () => {
        it('should call onSelectStartNode with Start block when user input is selected', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const userInputButton = react_1.screen.getByTestId('select-user-input');
            await user.click(userInputButton);
            // Assert
            expect(mockOnSelectStartNode).toHaveBeenCalledTimes(1);
            expect(mockOnSelectStartNode).toHaveBeenCalledWith(types_1.BlockEnum.Start);
        });
        it('should call onClose after selecting user input', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const userInputButton = react_1.screen.getByTestId('select-user-input');
            await user.click(userInputButton);
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('should call onSelectStartNode with trigger type when trigger is selected', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const triggerButton = react_1.screen.getByTestId('select-trigger-schedule');
            await user.click(triggerButton);
            // Assert
            expect(mockOnSelectStartNode).toHaveBeenCalledTimes(1);
            expect(mockOnSelectStartNode).toHaveBeenCalledWith(types_1.BlockEnum.TriggerSchedule, undefined);
        });
        it('should call onClose after selecting trigger', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const triggerButton = react_1.screen.getByTestId('select-trigger-schedule');
            await user.click(triggerButton);
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('should pass tool config when selecting trigger with config', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const webhookButton = react_1.screen.getByTestId('select-trigger-webhook');
            await user.click(webhookButton);
            // Assert
            expect(mockOnSelectStartNode).toHaveBeenCalledTimes(1);
            expect(mockOnSelectStartNode).toHaveBeenCalledWith(types_1.BlockEnum.TriggerWebhook, { config: 'test' });
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });
    // User Interactions - Modal Close
    describe('User Interactions - Modal Close', () => {
        it('should call onClose when close button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const closeButton = react_1.screen.getByTestId('modal-close-button');
            await user.click(closeButton);
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('should not call onSelectStartNode when closing without selection', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const closeButton = react_1.screen.getByTestId('modal-close-button');
            await user.click(closeButton);
            // Assert
            expect(mockOnSelectStartNode).not.toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });
    // Keyboard Event Handling
    describe('Keyboard Event Handling', () => {
        it('should call onClose when ESC key is pressed', () => {
            // Arrange
            renderComponent({ isShow: true });
            // Act
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('should not call onClose when other keys are pressed', () => {
            // Arrange
            renderComponent({ isShow: true });
            // Act
            react_1.fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
            react_1.fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
            react_1.fireEvent.keyDown(document, { key: 'a', code: 'KeyA' });
            // Assert
            expect(mockOnClose).not.toHaveBeenCalled();
        });
        it('should not call onClose when ESC is pressed but modal is hidden', () => {
            // Arrange
            renderComponent({ isShow: false });
            // Act
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            // Assert
            expect(mockOnClose).not.toHaveBeenCalled();
        });
        it('should clean up event listener on unmount', () => {
            // Arrange
            const { unmount } = renderComponent({ isShow: true });
            // Act
            unmount();
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            // Assert
            expect(mockOnClose).not.toHaveBeenCalled();
        });
        it('should update event listener when isShow changes', () => {
            // Arrange
            const { rerender } = renderComponent({ isShow: true });
            // Act - Press ESC when shown
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
            // Act - Hide modal and clear mock
            mockOnClose.mockClear();
            rerender(<index_1.default {...defaultProps} isShow={false}/>);
            // Act - Press ESC when hidden
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            // Assert
            expect(mockOnClose).not.toHaveBeenCalled();
        });
        it('should handle multiple ESC key presses', () => {
            // Arrange
            renderComponent({ isShow: true });
            // Act
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(3);
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle rapid modal show/hide toggling', async () => {
            // Arrange
            const { rerender } = renderComponent({ isShow: false });
            // Assert
            expect(react_1.screen.queryByTestId('modal')).not.toBeInTheDocument();
            // Act
            rerender(<index_1.default {...defaultProps} isShow={true}/>);
            // Assert
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
            // Act
            rerender(<index_1.default {...defaultProps} isShow={false}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('modal')).not.toBeInTheDocument();
            });
        });
        it('should handle selecting multiple nodes in sequence', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const { rerender } = renderComponent();
            // Act - Select user input
            await user.click(react_1.screen.getByTestId('select-user-input'));
            // Assert
            expect(mockOnSelectStartNode).toHaveBeenCalledWith(types_1.BlockEnum.Start);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
            // Act - Re-show modal and select trigger
            mockOnClose.mockClear();
            mockOnSelectStartNode.mockClear();
            rerender(<index_1.default {...defaultProps} isShow={true}/>);
            await user.click(react_1.screen.getByTestId('select-trigger-schedule'));
            // Assert
            expect(mockOnSelectStartNode).toHaveBeenCalledWith(types_1.BlockEnum.TriggerSchedule, undefined);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('should handle prop updates correctly', () => {
            // Arrange
            const { rerender } = renderComponent({ isShow: true });
            // Assert
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
            // Act - Update props
            const newOnClose = vi.fn();
            const newOnSelectStartNode = vi.fn();
            rerender(<index_1.default isShow={true} onClose={newOnClose} onSelectStartNode={newOnSelectStartNode}/>);
            // Assert - Modal still renders with new props
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
        it('should handle onClose being called multiple times', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            await user.click(react_1.screen.getByTestId('modal-close-button'));
            await user.click(react_1.screen.getByTestId('modal-close-button'));
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(2);
        });
        it('should maintain modal state when props change', () => {
            // Arrange
            const { rerender } = renderComponent({ isShow: true });
            // Assert
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
            // Act - Change onClose handler
            const newOnClose = vi.fn();
            rerender(<index_1.default {...defaultProps} isShow={true} onClose={newOnClose}/>);
            // Assert - Modal should still be visible
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
    });
    // Accessibility Tests
    describe('Accessibility', () => {
        it('should have dialog role', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('should have proper heading hierarchy', () => {
            // Arrange & Act
            const { container } = renderComponent();
            // Assert
            const heading = container.querySelector('h3');
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent('workflow.onboarding.title');
        });
        it('should have external link with proper attributes', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const link = react_1.screen.getByText('workflow.onboarding.learnMore').closest('a');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
        it('should have keyboard navigation support via ESC key', () => {
            // Arrange
            renderComponent({ isShow: true });
            // Act
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('should have visible ESC key hint', () => {
            // Arrange & Act
            renderComponent({ isShow: true });
            // Assert
            const escKey = react_1.screen.getByText('workflow.onboarding.escTip.key');
            expect(escKey.closest('kbd')).toBeInTheDocument();
            expect(escKey.closest('kbd')).toHaveClass('system-kbd');
        });
        it('should have descriptive text for ESC functionality', () => {
            // Arrange & Act
            renderComponent({ isShow: true });
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.escTip.press')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.escTip.toDismiss')).toBeInTheDocument();
        });
        it('should have proper text color classes', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const title = react_1.screen.getByText('workflow.onboarding.title');
            expect(title).toHaveClass('text-text-primary');
        });
        it('should have underlined learn more link', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const link = react_1.screen.getByText('workflow.onboarding.learnMore').closest('a');
            expect(link).toHaveClass('underline');
            expect(link).toHaveClass('cursor-pointer');
        });
    });
    // Integration Tests
    describe('Integration', () => {
        it('should complete full flow of selecting user input node', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Assert - Initial state
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.title')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('start-node-selection-panel')).toBeInTheDocument();
            // Act - Select user input
            await user.click(react_1.screen.getByTestId('select-user-input'));
            // Assert - Callbacks called
            expect(mockOnSelectStartNode).toHaveBeenCalledWith(types_1.BlockEnum.Start);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('should complete full flow of selecting trigger node', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Assert - Initial state
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
            // Act - Select trigger
            await user.click(react_1.screen.getByTestId('select-trigger-webhook'));
            // Assert - Callbacks called with config
            expect(mockOnSelectStartNode).toHaveBeenCalledWith(types_1.BlockEnum.TriggerWebhook, { config: 'test' });
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('should render all components in correct hierarchy', () => {
            // Arrange & Act
            const { container } = renderComponent();
            // Assert - Modal is the root
            expect(react_1.screen.getByTestId('modal')).toBeInTheDocument();
            // Assert - Header elements
            const heading = container.querySelector('h3');
            expect(heading).toBeInTheDocument();
            // Assert - Description with link
            expect(react_1.screen.getByText('workflow.onboarding.learnMore').closest('a')).toBeInTheDocument();
            // Assert - Selection panel
            expect(react_1.screen.getByTestId('start-node-selection-panel')).toBeInTheDocument();
            // Assert - ESC tip
            expect(react_1.screen.getByText('workflow.onboarding.escTip.key')).toBeInTheDocument();
        });
        it('should coordinate between keyboard and click interactions', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Click close button
            await user.click(react_1.screen.getByTestId('modal-close-button'));
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
            // Act - Clear and try ESC key
            mockOnClose.mockClear();
            react_1.fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTJFO0FBQzNFLDREQUFtRDtBQUNuRCwrQkFBOEI7QUFDOUIsMkRBQTJEO0FBQzNELG1DQUE2QztBQUU3Qyx1QkFBdUI7QUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sRUFBRSxTQUFTLFNBQVMsQ0FBQyxFQUMxQixNQUFNLEVBQ04sT0FBTyxFQUNQLFFBQVEsRUFDUixRQUFRLEdBQ0o7UUFDSixJQUFJLENBQUMsTUFBTTtZQUNULE9BQU8sSUFBSSxDQUFBO1FBRWIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FDcEM7UUFBQSxDQUFDLFFBQVEsSUFBSSxDQUNYLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDeEQ7O1VBQ0YsRUFBRSxNQUFNLENBQUMsQ0FDVixDQUNEO1FBQUEsQ0FBQyxRQUFRLENBQ1g7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCx1QkFBdUI7QUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsMkJBQTJCLElBQUksRUFBRTtDQUN0RSxDQUFDLENBQUMsQ0FBQTtBQUVILHNGQUFzRjtBQUN0RixvREFBb0Q7QUFDcEQsRUFBRSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLE9BQU8sRUFBRSxTQUFT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QyxDQUFBO1lBRTFELFNBQVM7WUFDVCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFNUMsOEJBQThCO1lBQzlCLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUN2QixpQkFBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRTlELFNBQVM7WUFDVCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCBXb3JrZmxvd09uYm9hcmRpbmdNb2RhbCBmcm9tICcuL2luZGV4J1xuXG4vLyBNb2NrIE1vZGFsIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL21vZGFsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogZnVuY3Rpb24gTW9ja01vZGFsKHtcbiAgICBpc1Nob3csXG4gICAgb25DbG9zZSxcbiAgICBjaGlsZHJlbixcbiAgICBjbG9zYWJsZSxcbiAgfTogYW55KSB7XG4gICAgaWYgKCFpc1Nob3cpXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtb2RhbFwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgICAge2Nsb3NhYmxlICYmIChcbiAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2xvc2UtYnV0dG9uXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICBDbG9zZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApfVxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KSlcblxuLy8gTW9jayB1c2VEb2NMaW5rIGhvb2tcbnZpLm1vY2soJ0AvY29udGV4dC9pMThuJywgKCkgPT4gKHtcbiAgdXNlRG9jTGluazogKCkgPT4gKHBhdGg6IHN0cmluZykgPT4gYGh0dHBzOi8vZG9jcy5leGFtcGxlLmNvbSR7cGF0aH1gLFxufSkpXG5cbi8vIE1vY2sgU3RhcnROb2RlU2VsZWN0aW9uUGFuZWwgKHVzaW5nIHJlYWwgY29tcG9uZW50IHdvdWxkIGJlIGJldHRlciBmb3IgaW50ZWdyYXRpb24sXG4vLyBidXQgZm9yIHRoaXMgdGVzdCB3ZSdsbCBtb2NrIHRvIGNvbnRyb2wgYmVoYXZpb3IpXG52aS5tb2NrKCcuL3N0YXJ0LW5vZGUtc2VsZWN0aW9uLXBhbmVsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogZnVuY3Rpb24gTW9ja1N0YXJ0Tm9kZVNlbGVjdGlvblBhbmVsKHtcbiAgICBvblNlbGVjdFVzZXJJbnB1dCxcbiAgICBvblNlbGVjdFRyaWdnZXIsXG4gIH06IGFueSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic3RhcnQtbm9kZS1zZWxlY3Rpb24tcGFuZWxcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInNlbGVjdC11c2VyLWlucHV0XCIgb25DbGljaz17b25TZWxlY3RVc2VySW5wdXR9PlxuICAgICAgICAgIFNlbGVjdCBVc2VyIElucHV0XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWxlY3QtdHJpZ2dlci1zY2hlZHVsZVwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3RUcmlnZ2VyKEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUpfVxuICAgICAgICA+XG4gICAgICAgICAgU2VsZWN0IFRyaWdnZXIgU2NoZWR1bGVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlbGVjdC10cmlnZ2VyLXdlYmhvb2tcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0VHJpZ2dlcihCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2ssIHsgY29uZmlnOiAndGVzdCcgfSl9XG4gICAgICAgID5cbiAgICAgICAgICBTZWxlY3QgVHJpZ2dlciBXZWJob29rXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufSkpXG5cbmRlc2NyaWJlKCdXb3JrZmxvd09uYm9hcmRpbmdNb2RhbCcsICgpID0+IHtcbiAgY29uc3QgbW9ja09uQ2xvc2UgPSB2aS5mbigpXG4gIGNvbnN0IG1vY2tPblNlbGVjdFN0YXJ0Tm9kZSA9IHZpLmZuKClcblxuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaXNTaG93OiB0cnVlLFxuICAgIG9uQ2xvc2U6IG1vY2tPbkNsb3NlLFxuICAgIG9uU2VsZWN0U3RhcnROb2RlOiBtb2NrT25TZWxlY3RTdGFydE5vZGUsXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gcmVuZGVyIGNvbXBvbmVudFxuICBjb25zdCByZW5kZXJDb21wb25lbnQgPSAocHJvcHMgPSB7fSkgPT4ge1xuICAgIHJldHVybiByZW5kZXIoPFdvcmtmbG93T25ib2FyZGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IHsuLi5wcm9wc30gLz4pXG4gIH1cblxuICAvLyBSZW5kZXJpbmcgdGVzdHMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdkaWFsb2cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aGVuIGlzU2hvdyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgaXNTaG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgbW9kYWwgd2hlbiBpc1Nob3cgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdtb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB0aXRsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayBib3RoIHBhcnRzIG9mIGRlc2NyaXB0aW9uIChzZXBhcmF0ZWQgYnkgbGluaylcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5LXhzLXJlZ3VsYXIubGVhZGluZy00JylcbiAgICAgIGV4cGVjdChkZXNjcmlwdGlvbkRpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGRlc2NyaXB0aW9uRGl2KS50b0hhdmVUZXh0Q29udGVudCgnd29ya2Zsb3cub25ib2FyZGluZy5kZXNjcmlwdGlvbicpXG4gICAgICBleHBlY3QoZGVzY3JpcHRpb25EaXYpLnRvSGF2ZVRleHRDb250ZW50KCd3b3JrZmxvdy5vbmJvYXJkaW5nLmFib3V0U3RhcnROb2RlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbGVhcm4gbW9yZSBsaW5rJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsZWFybk1vcmVMaW5rID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy5sZWFybk1vcmUnKVxuICAgICAgZXhwZWN0KGxlYXJuTW9yZUxpbmspLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChsZWFybk1vcmVMaW5rLmNsb3Nlc3QoJ2EnKSkudG9IYXZlQXR0cmlidXRlKCdocmVmJywgJ2h0dHBzOi8vZG9jcy5leGFtcGxlLmNvbS9ndWlkZXMvd29ya2Zsb3cvbm9kZS9zdGFydCcpXG4gICAgICBleHBlY3QobGVhcm5Nb3JlTGluay5jbG9zZXN0KCdhJykpLnRvSGF2ZUF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICBleHBlY3QobGVhcm5Nb3JlTGluay5jbG9zZXN0KCdhJykpLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTdGFydE5vZGVTZWxlY3Rpb25QYW5lbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhcnQtbm9kZS1zZWxlY3Rpb24tcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBFU0MgdGlwIHdoZW4gbW9kYWwgaXMgc2hvd24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy5lc2NUaXAucHJlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcuZXNjVGlwLmtleScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy5lc2NUaXAudG9EaXNtaXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIEVTQyB0aXAgd2hlbiBtb2RhbCBpcyBoaWRkZW4nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy5lc2NUaXAucHJlc3MnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3Qgc3R5bGluZyBmb3IgdGl0bGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRpdGxlID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy50aXRsZScpXG4gICAgICBleHBlY3QodGl0bGUpLnRvSGF2ZUNsYXNzKCd0aXRsZS0yeGwtc2VtaS1ib2xkJylcbiAgICAgIGV4cGVjdCh0aXRsZSkudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1wcmltYXJ5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG1vZGFsIGNsb3NlIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY2xvc2UtYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFByb3BzIHRlc3RzIChSRVFVSVJFRClcbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYWNjZXB0IGlzU2hvdyBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyQ29tcG9uZW50KHsgaXNTaG93OiBmYWxzZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICByZXJlbmRlcig8V29ya2Zsb3dPbmJvYXJkaW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gaXNTaG93PXt0cnVlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWNjZXB0IG9uQ2xvc2UgcHJvcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGN1c3RvbU9uQ2xvc2UgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25DbG9zZTogY3VzdG9tT25DbG9zZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgb25TZWxlY3RTdGFydE5vZGUgcHJvcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGN1c3RvbUhhbmRsZXIgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25TZWxlY3RTdGFydE5vZGU6IGN1c3RvbUhhbmRsZXIgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGFydC1ub2RlLXNlbGVjdGlvbi1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBvbkNsb3NlIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNsb3NlOiB1bmRlZmluZWQgfSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBvblNlbGVjdFN0YXJ0Tm9kZSBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25TZWxlY3RTdGFydE5vZGU6IHVuZGVmaW5lZCB9KVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIC0gU3RhcnQgTm9kZSBTZWxlY3Rpb25cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zIC0gU3RhcnQgTm9kZSBTZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2VsZWN0U3RhcnROb2RlIHdpdGggU3RhcnQgYmxvY2sgd2hlbiB1c2VyIGlucHV0IGlzIHNlbGVjdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHVzZXJJbnB1dEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXVzZXItaW5wdXQnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh1c2VySW5wdXRCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdFN0YXJ0Tm9kZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0U3RhcnROb2RlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChCbG9ja0VudW0uU3RhcnQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsb3NlIGFmdGVyIHNlbGVjdGluZyB1c2VyIGlucHV0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHVzZXJJbnB1dEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXVzZXItaW5wdXQnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh1c2VySW5wdXRCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2VsZWN0U3RhcnROb2RlIHdpdGggdHJpZ2dlciB0eXBlIHdoZW4gdHJpZ2dlciBpcyBzZWxlY3RlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0cmlnZ2VyQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtdHJpZ2dlci1zY2hlZHVsZScpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXJCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdFN0YXJ0Tm9kZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0U3RhcnROb2RlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlLCB1bmRlZmluZWQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsb3NlIGFmdGVyIHNlbGVjdGluZyB0cmlnZ2VyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHRyaWdnZXJCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC10cmlnZ2VyLXNjaGVkdWxlJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlckJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgdG9vbCBjb25maWcgd2hlbiBzZWxlY3RpbmcgdHJpZ2dlciB3aXRoIGNvbmZpZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB3ZWJob29rQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtdHJpZ2dlci13ZWJob29rJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sod2ViaG9va0J1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0U3RhcnROb2RlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RTdGFydE5vZGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vaywgeyBjb25maWc6ICd0ZXN0JyB9KVxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIC0gTW9kYWwgQ2xvc2VcbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zIC0gTW9kYWwgQ2xvc2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBjbG9zZSBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY2xvc2UtYnV0dG9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2xvc2VCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvblNlbGVjdFN0YXJ0Tm9kZSB3aGVuIGNsb3Npbmcgd2l0aG91dCBzZWxlY3Rpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNsb3NlLWJ1dHRvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNsb3NlQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RTdGFydE5vZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrT25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyBLZXlib2FyZCBFdmVudCBIYW5kbGluZ1xuICBkZXNjcmliZSgnS2V5Ym9hcmQgRXZlbnQgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBFU0Mga2V5IGlzIHByZXNzZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQua2V5RG93bihkb2N1bWVudCwgeyBrZXk6ICdFc2NhcGUnLCBjb2RlOiAnRXNjYXBlJyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25DbG9zZSB3aGVuIG90aGVyIGtleXMgYXJlIHByZXNzZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQua2V5RG93bihkb2N1bWVudCwgeyBrZXk6ICdFbnRlcicsIGNvZGU6ICdFbnRlcicgfSlcbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKGRvY3VtZW50LCB7IGtleTogJ1RhYicsIGNvZGU6ICdUYWInIH0pXG4gICAgICBmaXJlRXZlbnQua2V5RG93bihkb2N1bWVudCwgeyBrZXk6ICdhJywgY29kZTogJ0tleUEnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25DbG9zZSB3aGVuIEVTQyBpcyBwcmVzc2VkIGJ1dCBtb2RhbCBpcyBoaWRkZW4nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmtleURvd24oZG9jdW1lbnQsIHsga2V5OiAnRXNjYXBlJywgY29kZTogJ0VzY2FwZScgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ2xvc2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbGVhbiB1cCBldmVudCBsaXN0ZW5lciBvbiB1bm1vdW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICB1bm1vdW50KClcbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKGRvY3VtZW50LCB7IGtleTogJ0VzY2FwZScsIGNvZGU6ICdFc2NhcGUnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGV2ZW50IGxpc3RlbmVyIHdoZW4gaXNTaG93IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IHRydWUgfSlcblxuICAgICAgLy8gQWN0IC0gUHJlc3MgRVNDIHdoZW4gc2hvd25cbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKGRvY3VtZW50LCB7IGtleTogJ0VzY2FwZScsIGNvZGU6ICdFc2NhcGUnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgICAgLy8gQWN0IC0gSGlkZSBtb2RhbCBhbmQgY2xlYXIgbW9ja1xuICAgICAgbW9ja09uQ2xvc2UubW9ja0NsZWFyKClcbiAgICAgIHJlcmVuZGVyKDxXb3JrZmxvd09uYm9hcmRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBpc1Nob3c9e2ZhbHNlfSAvPilcblxuICAgICAgLy8gQWN0IC0gUHJlc3MgRVNDIHdoZW4gaGlkZGVuXG4gICAgICBmaXJlRXZlbnQua2V5RG93bihkb2N1bWVudCwgeyBrZXk6ICdFc2NhcGUnLCBjb2RlOiAnRXNjYXBlJyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DbG9zZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBFU0Mga2V5IHByZXNzZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQua2V5RG93bihkb2N1bWVudCwgeyBrZXk6ICdFc2NhcGUnLCBjb2RlOiAnRXNjYXBlJyB9KVxuICAgICAgZmlyZUV2ZW50LmtleURvd24oZG9jdW1lbnQsIHsga2V5OiAnRXNjYXBlJywgY29kZTogJ0VzY2FwZScgfSlcbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKGRvY3VtZW50LCB7IGtleTogJ0VzY2FwZScsIGNvZGU6ICdFc2NhcGUnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgQ2FzZXMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBtb2RhbCBzaG93L2hpZGUgdG9nZ2xpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJDb21wb25lbnQoeyBpc1Nob3c6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdtb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKDxXb3JrZmxvd09uYm9hcmRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBpc1Nob3c9e3RydWV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICByZXJlbmRlcig8V29ya2Zsb3dPbmJvYXJkaW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gaXNTaG93PXtmYWxzZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNlbGVjdGluZyBtdWx0aXBsZSBub2RlcyBpbiBzZXF1ZW5jZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0IC0gU2VsZWN0IHVzZXIgaW5wdXRcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtdXNlci1pbnB1dCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RTdGFydE5vZGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKEJsb2NrRW51bS5TdGFydClcbiAgICAgIGV4cGVjdChtb2NrT25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cbiAgICAgIC8vIEFjdCAtIFJlLXNob3cgbW9kYWwgYW5kIHNlbGVjdCB0cmlnZ2VyXG4gICAgICBtb2NrT25DbG9zZS5tb2NrQ2xlYXIoKVxuICAgICAgbW9ja09uU2VsZWN0U3RhcnROb2RlLm1vY2tDbGVhcigpXG4gICAgICByZXJlbmRlcig8V29ya2Zsb3dPbmJvYXJkaW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gaXNTaG93PXt0cnVlfSAvPilcblxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC10cmlnZ2VyLXNjaGVkdWxlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdFN0YXJ0Tm9kZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZSwgdW5kZWZpbmVkKVxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcHJvcCB1cGRhdGVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlckNvbXBvbmVudCh7IGlzU2hvdzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gVXBkYXRlIHByb3BzXG4gICAgICBjb25zdCBuZXdPbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbmV3T25TZWxlY3RTdGFydE5vZGUgPSB2aS5mbigpXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93T25ib2FyZGluZ01vZGFsXG4gICAgICAgICAgaXNTaG93PXt0cnVlfVxuICAgICAgICAgIG9uQ2xvc2U9e25ld09uQ2xvc2V9XG4gICAgICAgICAgb25TZWxlY3RTdGFydE5vZGU9e25ld09uU2VsZWN0U3RhcnROb2RlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gTW9kYWwgc3RpbGwgcmVuZGVycyB3aXRoIG5ldyBwcm9wc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvbkNsb3NlIGJlaW5nIGNhbGxlZCBtdWx0aXBsZSB0aW1lcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY2xvc2UtYnV0dG9uJykpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY2xvc2UtYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBtb2RhbCBzdGF0ZSB3aGVuIHByb3BzIGNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlckNvbXBvbmVudCh7IGlzU2hvdzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gQ2hhbmdlIG9uQ2xvc2UgaGFuZGxlclxuICAgICAgY29uc3QgbmV3T25DbG9zZSA9IHZpLmZuKClcbiAgICAgIHJlcmVuZGVyKDxXb3JrZmxvd09uYm9hcmRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBpc1Nob3c9e3RydWV9IG9uQ2xvc2U9e25ld09uQ2xvc2V9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBNb2RhbCBzaG91bGQgc3RpbGwgYmUgdmlzaWJsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQWNjZXNzaWJpbGl0eSBUZXN0c1xuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgZGlhbG9nIHJvbGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdkaWFsb2cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIGhlYWRpbmcgaGllcmFyY2h5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaGVhZGluZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdoMycpXG4gICAgICBleHBlY3QoaGVhZGluZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGhlYWRpbmcpLnRvSGF2ZVRleHRDb250ZW50KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRpdGxlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGV4dGVybmFsIGxpbmsgd2l0aCBwcm9wZXIgYXR0cmlidXRlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGluayA9IHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcubGVhcm5Nb3JlJykuY2xvc2VzdCgnYScpXG4gICAgICBleHBlY3QobGluaykudG9IYXZlQXR0cmlidXRlKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3JlbCcsICdub29wZW5lciBub3JlZmVycmVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGtleWJvYXJkIG5hdmlnYXRpb24gc3VwcG9ydCB2aWEgRVNDIGtleScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGlzU2hvdzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKGRvY3VtZW50LCB7IGtleTogJ0VzY2FwZScsIGNvZGU6ICdFc2NhcGUnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHZpc2libGUgRVNDIGtleSBoaW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgaXNTaG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZXNjS2V5ID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy5lc2NUaXAua2V5JylcbiAgICAgIGV4cGVjdChlc2NLZXkuY2xvc2VzdCgna2JkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChlc2NLZXkuY2xvc2VzdCgna2JkJykpLnRvSGF2ZUNsYXNzKCdzeXN0ZW0ta2JkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGRlc2NyaXB0aXZlIHRleHQgZm9yIEVTQyBmdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgaXNTaG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcuZXNjVGlwLnByZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLmVzY1RpcC50b0Rpc21pc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIHRleHQgY29sb3IgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdGl0bGUgPSBzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRpdGxlJylcbiAgICAgIGV4cGVjdCh0aXRsZSkudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1wcmltYXJ5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHVuZGVybGluZWQgbGVhcm4gbW9yZSBsaW5rJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsaW5rID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy5sZWFybk1vcmUnKS5jbG9zZXN0KCdhJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVDbGFzcygndW5kZXJsaW5lJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVDbGFzcygnY3Vyc29yLXBvaW50ZXInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29tcGxldGUgZnVsbCBmbG93IG9mIHNlbGVjdGluZyB1c2VyIGlucHV0IG5vZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWwgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0YXJ0LW5vZGUtc2VsZWN0aW9uLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gU2VsZWN0IHVzZXIgaW5wdXRcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtdXNlci1pbnB1dCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDYWxsYmFja3MgY2FsbGVkXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0U3RhcnROb2RlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChCbG9ja0VudW0uU3RhcnQpXG4gICAgICBleHBlY3QobW9ja09uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgZmxvdyBvZiBzZWxlY3RpbmcgdHJpZ2dlciBub2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbml0aWFsIHN0YXRlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCB0cmlnZ2VyXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXRyaWdnZXItd2ViaG9vaycpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDYWxsYmFja3MgY2FsbGVkIHdpdGggY29uZmlnXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0U3RhcnROb2RlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2ssIHsgY29uZmlnOiAndGVzdCcgfSlcbiAgICAgIGV4cGVjdChtb2NrT25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBjb21wb25lbnRzIGluIGNvcnJlY3QgaGllcmFyY2h5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydCAtIE1vZGFsIGlzIHRoZSByb290XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFzc2VydCAtIEhlYWRlciBlbGVtZW50c1xuICAgICAgY29uc3QgaGVhZGluZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdoMycpXG4gICAgICBleHBlY3QoaGVhZGluZykudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBEZXNjcmlwdGlvbiB3aXRoIGxpbmtcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLmxlYXJuTW9yZScpLmNsb3Nlc3QoJ2EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTZWxlY3Rpb24gcGFuZWxcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0YXJ0LW5vZGUtc2VsZWN0aW9uLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQXNzZXJ0IC0gRVNDIHRpcFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcuZXNjVGlwLmtleScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29vcmRpbmF0ZSBiZXR3ZWVuIGtleWJvYXJkIGFuZCBjbGljayBpbnRlcmFjdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIGNsb3NlIGJ1dHRvblxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNsb3NlLWJ1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cbiAgICAgIC8vIEFjdCAtIENsZWFyIGFuZCB0cnkgRVNDIGtleVxuICAgICAgbW9ja09uQ2xvc2UubW9ja0NsZWFyKClcbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKGRvY3VtZW50LCB7IGtleTogJ0VzY2FwZScsIGNvZGU6ICdFc2NhcGUnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==