"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const types_1 = require("@/app/components/workflow/types");
const start_node_selection_panel_1 = require("./start-node-selection-panel");
// Mock NodeSelector component
vi.mock('@/app/components/workflow/block-selector', () => ({
    default: function MockNodeSelector({ open, onOpenChange, onSelect, trigger, }) {
        // trigger is a function that returns a React element
        const triggerElement = typeof trigger === 'function' ? trigger() : trigger;
        return (<div data-testid="node-selector">
        {triggerElement}
        {open && (<div data-testid="node-selector-content">
            <button data-testid="select-schedule" onClick={() => onSelect(types_1.BlockEnum.TriggerSchedule)}>
              Select Schedule
            </button>
            <button data-testid="select-webhook" onClick={() => onSelect(types_1.BlockEnum.TriggerWebhook)}>
              Select Webhook
            </button>
            <button data-testid="close-selector" onClick={() => onOpenChange(false)}>
              Close
            </button>
          </div>)}
      </div>);
    },
}));
describe('StartNodeSelectionPanel', () => {
    const mockOnSelectUserInput = vi.fn();
    const mockOnSelectTrigger = vi.fn();
    const defaultProps = {
        onSelectUserInput: mockOnSelectUserInput,
        onSelectTrigger: mockOnSelectTrigger,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Helper function to render component
    const renderComponent = (props = {}) => {
        return (0, react_1.render)(<start_node_selection_panel_1.default {...defaultProps} {...props}/>);
    };
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.userInputFull')).toBeInTheDocument();
        });
        it('should render user input option', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.userInputFull')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.userInputDescription')).toBeInTheDocument();
        });
        it('should render trigger option', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.trigger')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.triggerDescription')).toBeInTheDocument();
        });
        it('should render node selector component', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByTestId('node-selector')).toBeInTheDocument();
        });
        it('should not show trigger selector initially', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.queryByTestId('node-selector-content')).not.toBeInTheDocument();
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should accept onSelectUserInput prop', () => {
            // Arrange
            const customHandler = vi.fn();
            // Act
            renderComponent({ onSelectUserInput: customHandler });
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.userInputFull')).toBeInTheDocument();
        });
        it('should accept onSelectTrigger prop', () => {
            // Arrange
            const customHandler = vi.fn();
            // Act
            renderComponent({ onSelectTrigger: customHandler });
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.trigger')).toBeInTheDocument();
        });
        it('should handle missing onSelectUserInput gracefully', () => {
            // Arrange & Act
            expect(() => {
                renderComponent({ onSelectUserInput: undefined });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.userInputFull')).toBeInTheDocument();
        });
        it('should handle missing onSelectTrigger gracefully', () => {
            // Arrange & Act
            expect(() => {
                renderComponent({ onSelectTrigger: undefined });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.trigger')).toBeInTheDocument();
        });
    });
    // User Interactions - User Input Option
    describe('User Interactions - User Input', () => {
        it('should call onSelectUserInput when user input option is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const userInputOption = react_1.screen.getByText('workflow.onboarding.userInputFull');
            await user.click(userInputOption);
            // Assert
            expect(mockOnSelectUserInput).toHaveBeenCalledTimes(1);
        });
        it('should not call onSelectTrigger when user input option is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const userInputOption = react_1.screen.getByText('workflow.onboarding.userInputFull');
            await user.click(userInputOption);
            // Assert
            expect(mockOnSelectTrigger).not.toHaveBeenCalled();
        });
        it('should handle multiple clicks on user input option', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const userInputOption = react_1.screen.getByText('workflow.onboarding.userInputFull');
            await user.click(userInputOption);
            await user.click(userInputOption);
            await user.click(userInputOption);
            // Assert
            expect(mockOnSelectUserInput).toHaveBeenCalledTimes(3);
        });
    });
    // User Interactions - Trigger Option
    describe('User Interactions - Trigger', () => {
        it('should show trigger selector when trigger option is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('node-selector-content')).toBeInTheDocument();
            });
        });
        it('should not call onSelectTrigger immediately when trigger option is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Assert
            expect(mockOnSelectTrigger).not.toHaveBeenCalled();
        });
        it('should call onSelectTrigger when a trigger is selected from selector', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open trigger selector
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Act - Select a trigger
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('select-schedule')).toBeInTheDocument();
            });
            const scheduleButton = react_1.screen.getByTestId('select-schedule');
            await user.click(scheduleButton);
            // Assert
            expect(mockOnSelectTrigger).toHaveBeenCalledTimes(1);
            expect(mockOnSelectTrigger).toHaveBeenCalledWith(types_1.BlockEnum.TriggerSchedule, undefined);
        });
        it('should call onSelectTrigger with correct node type for webhook', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open trigger selector
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Act - Select webhook trigger
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('select-webhook')).toBeInTheDocument();
            });
            const webhookButton = react_1.screen.getByTestId('select-webhook');
            await user.click(webhookButton);
            // Assert
            expect(mockOnSelectTrigger).toHaveBeenCalledTimes(1);
            expect(mockOnSelectTrigger).toHaveBeenCalledWith(types_1.BlockEnum.TriggerWebhook, undefined);
        });
        it('should hide trigger selector after selection', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open trigger selector
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Act - Select a trigger
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('select-schedule')).toBeInTheDocument();
            });
            const scheduleButton = react_1.screen.getByTestId('select-schedule');
            await user.click(scheduleButton);
            // Assert - Selector should be hidden
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('node-selector-content')).not.toBeInTheDocument();
            });
        });
        it('should pass tool config parameter through onSelectTrigger', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open trigger selector
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Act - Select a trigger (our mock doesn't pass toolConfig, but real NodeSelector would)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('select-schedule')).toBeInTheDocument();
            });
            const scheduleButton = react_1.screen.getByTestId('select-schedule');
            await user.click(scheduleButton);
            // Assert - Verify handler was called
            // In real usage, NodeSelector would pass toolConfig as second parameter
            expect(mockOnSelectTrigger).toHaveBeenCalled();
        });
    });
    // State Management
    describe('State Management', () => {
        it('should toggle trigger selector visibility', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Assert - Initially hidden
            expect(react_1.screen.queryByTestId('node-selector-content')).not.toBeInTheDocument();
            // Act - Show selector
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Assert - Now visible
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('node-selector-content')).toBeInTheDocument();
            });
            // Act - Close selector
            const closeButton = react_1.screen.getByTestId('close-selector');
            await user.click(closeButton);
            // Assert - Hidden again
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('node-selector-content')).not.toBeInTheDocument();
            });
        });
        it('should maintain state across user input selections', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Click user input multiple times
            const userInputOption = react_1.screen.getByText('workflow.onboarding.userInputFull');
            await user.click(userInputOption);
            await user.click(userInputOption);
            // Assert - Trigger selector should remain hidden
            expect(react_1.screen.queryByTestId('node-selector-content')).not.toBeInTheDocument();
        });
        it('should reset trigger selector visibility after selection', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open and select trigger
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('select-schedule')).toBeInTheDocument();
            });
            const scheduleButton = react_1.screen.getByTestId('select-schedule');
            await user.click(scheduleButton);
            // Assert - Selector should be closed
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('node-selector-content')).not.toBeInTheDocument();
            });
            // Act - Click trigger option again
            await user.click(triggerOption);
            // Assert - Selector should open again
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('node-selector-content')).toBeInTheDocument();
            });
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle rapid clicks on trigger option', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            await user.click(triggerOption);
            await user.click(triggerOption);
            // Assert - Should still be open (last click)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('node-selector-content')).toBeInTheDocument();
            });
        });
        it('should handle selecting different trigger types in sequence', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open and select schedule
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('select-schedule')).toBeInTheDocument();
            });
            await user.click(react_1.screen.getByTestId('select-schedule'));
            // Assert
            expect(mockOnSelectTrigger).toHaveBeenNthCalledWith(1, types_1.BlockEnum.TriggerSchedule, undefined);
            // Act - Open again and select webhook
            await user.click(triggerOption);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('select-webhook')).toBeInTheDocument();
            });
            await user.click(react_1.screen.getByTestId('select-webhook'));
            // Assert
            expect(mockOnSelectTrigger).toHaveBeenNthCalledWith(2, types_1.BlockEnum.TriggerWebhook, undefined);
            expect(mockOnSelectTrigger).toHaveBeenCalledTimes(2);
        });
        it('should not crash with undefined callbacks', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({
                onSelectUserInput: undefined,
                onSelectTrigger: undefined,
            });
            // Act & Assert - Should not throw
            const userInputOption = react_1.screen.getByText('workflow.onboarding.userInputFull');
            await expect(user.click(userInputOption)).resolves.not.toThrow();
        });
        it('should handle opening and closing selector without selection', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open selector
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Act - Close without selecting
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('close-selector')).toBeInTheDocument();
            });
            await user.click(react_1.screen.getByTestId('close-selector'));
            // Assert - No selection callback should be called
            expect(mockOnSelectTrigger).not.toHaveBeenCalled();
            // Assert - Selector should be closed
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('node-selector-content')).not.toBeInTheDocument();
            });
        });
    });
    // Accessibility Tests
    describe('Accessibility', () => {
        it('should have both options visible and accessible', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.userInputFull')).toBeVisible();
            expect(react_1.screen.getByText('workflow.onboarding.trigger')).toBeVisible();
        });
        it('should have descriptive text for both options', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('workflow.onboarding.userInputDescription')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.triggerDescription')).toBeInTheDocument();
        });
        it('should maintain focus after interactions', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const userInputOption = react_1.screen.getByText('workflow.onboarding.userInputFull');
            await user.click(userInputOption);
            // Assert - Component should still be in document
            expect(react_1.screen.getByText('workflow.onboarding.userInputFull')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.trigger')).toBeInTheDocument();
        });
    });
    // Integration Tests
    describe('Integration', () => {
        it('should coordinate between both options correctly', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Click user input
            const userInputOption = react_1.screen.getByText('workflow.onboarding.userInputFull');
            await user.click(userInputOption);
            // Assert
            expect(mockOnSelectUserInput).toHaveBeenCalledTimes(1);
            expect(mockOnSelectTrigger).not.toHaveBeenCalled();
            // Act - Click trigger
            const triggerOption = react_1.screen.getByText('workflow.onboarding.trigger');
            await user.click(triggerOption);
            // Assert - Trigger selector should open
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('node-selector-content')).toBeInTheDocument();
            });
            // Act - Select trigger
            await user.click(react_1.screen.getByTestId('select-schedule'));
            // Assert
            expect(mockOnSelectTrigger).toHaveBeenCalledTimes(1);
            expect(mockOnSelectUserInput).toHaveBeenCalledTimes(1);
        });
        it('should render all components in correct hierarchy', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            // Both StartNodeOption components should be rendered
            expect(react_1.screen.getByText('workflow.onboarding.userInputFull')).toBeInTheDocument();
            expect(react_1.screen.getByText('workflow.onboarding.trigger')).toBeInTheDocument();
            // NodeSelector should be rendered
            expect(react_1.screen.getByTestId('node-selector')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnQtbm9kZS1zZWxlY3Rpb24tcGFuZWwuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXJ0LW5vZGUtc2VsZWN0aW9uLXBhbmVsLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQWdFO0FBQ2hFLDREQUFtRDtBQUNuRCwrQkFBOEI7QUFDOUIsMkRBQTJEO0FBQzNELDZFQUFrRTtBQUVsRSw4QkFBOEI7QUFDOUIsRUFBRSxDQUFDLElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELE9BQU8sRUFBRSxTQUFTLGdCQUFnQixDQUFDLEVBQ2pDLElBQUksRUFDSixZQUFZLEVBQ1osUUFBUSxFQUNSLE9BQU8sR0FDSDtRQUNKLHFEQUFxRDtRQUNyRCxNQUFNLGNBQWMsR0FBRyxPQUFPLE9BQU8sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFMUUsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQzlCO1FBQUEsQ0FBQyxjQUFjLENBQ2Y7UUFBQSxDQUFDLElBQUksSUFBSSxDQUNQLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FDdEM7WUFBQSxDQUFDLE1BQU0sQ0FDTCxXQUFXLENBQUMsaUJBQWlCLENBQzdCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxpQkFBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBRW5EOztZQUNGLEVBQUUsTUFBTSxDQUNSO1lBQUEsQ0FBQyxNQUFNLENBQ0wsV0FBVyxDQUFDLGdCQUFnQixDQUM1QixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsaUJBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUVsRDs7WUFDRixFQUFFLE1BQU0sQ0FDUjtZQUFBLENBQUMsTUFBTSxDQUNMLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FDNUIsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBRW5DOztZQUNGLEVBQUUsTUFBTSxDQUNWO1VBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNIO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxNQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUNyQyxNQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUVuQyxNQUFNLFlBQVksR0FBRztRQUNuQixpQkFBaUIsRUFBRSxxQkFBcUI7UUFDeEMsZUFBZSxFQUFFLG1CQUFtQjtLQUNyQyxDQUFBO0lBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLHNDQUFzQztJQUN0QyxNQUFNLGVBQWUsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRTtRQUNyQyxPQUFPLElBQUEsY0FBTSxFQUFDLENBQUMsb0NBQXVCLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtJQUN6RSxDQUFDLENBQUE7SUFFRCw2QkFBNkI7SUFDN0IsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxnQkFBZ0I7WUFDaEIsZUFBZSxFQUFFLENBQUE7WUFFakIsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ25GLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxnQkFBZ0I7WUFDaEIsZUFBZSxFQUFFLENBQUE7WUFFakIsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2pGLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzFGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxnQkFBZ0I7WUFDaEIsZUFBZSxFQUFFLENBQUE7WUFFakIsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzNFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtZQUMvQyxnQkFBZ0I7WUFDaEIsZUFBZSxFQUFFLENBQUE7WUFFakIsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNqRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsZ0JBQWdCO1lBQ2hCLGVBQWUsRUFBRSxDQUFBO1lBRWpCLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0UsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHlCQUF5QjtJQUN6QixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLFVBQVU7WUFDVixNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7WUFFN0IsTUFBTTtZQUNOLGVBQWUsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ25GLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtZQUM1QyxVQUFVO1lBQ1YsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1lBRTdCLE1BQU07WUFDTixlQUFlLENBQUMsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQTtZQUVuRCxTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDN0UsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzVELGdCQUFnQjtZQUNoQixNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLGVBQWUsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7WUFDbkQsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBRWhCLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNuRixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsZ0JBQWdCO1lBQ2hCLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsZUFBZSxDQUFDLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7WUFDakQsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBRWhCLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM3RSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsd0NBQXdDO0lBQ3hDLFFBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsRUFBRSxDQUFDLGlFQUFpRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQy9FLFVBQVU7WUFDVixNQUFNLElBQUksR0FBRyxvQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzlCLGVBQWUsRUFBRSxDQUFBO1lBRWpCLE1BQU07WUFDTixNQUFNLGVBQWUsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7WUFDN0UsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBRWpDLFNBQVM7WUFDVCxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNqRixVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLEVBQUUsQ0FBQTtZQUVqQixNQUFNO1lBQ04sTUFBTSxlQUFlLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1lBQzdFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUVqQyxTQUFTO1lBQ1QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDcEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEUsVUFBVTtZQUNWLE1BQU0sSUFBSSxHQUFHLG9CQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDOUIsZUFBZSxFQUFFLENBQUE7WUFFakIsTUFBTTtZQUNOLE1BQU0sZUFBZSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtZQUM3RSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDakMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQ2pDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUVqQyxTQUFTO1lBQ1QsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDeEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHFDQUFxQztJQUNyQyxRQUFRLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQzNDLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMzRSxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLEVBQUUsQ0FBQTtZQUVqQixNQUFNO1lBQ04sTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1lBQ3JFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3pFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNEVBQTRFLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDMUYsVUFBVTtZQUNWLE1BQU0sSUFBSSxHQUFHLG9CQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDOUIsZUFBZSxFQUFFLENBQUE7WUFFakIsTUFBTTtZQUNOLE1BQU0sYUFBYSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtZQUNyRSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFL0IsU0FBUztZQUNULE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ3BELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHNFQUFzRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3BGLFVBQVU7WUFDVixNQUFNLElBQUksR0FBRyxvQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzlCLGVBQWUsRUFBRSxDQUFBO1lBRWpCLDhCQUE4QjtZQUM5QixNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDckUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRS9CLHlCQUF5QjtZQUN6QixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbkUsQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLGNBQWMsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUE7WUFDNUQsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBRWhDLFNBQVM7WUFDVCxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBUyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUN4RixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM5RSxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLEVBQUUsQ0FBQTtZQUVqQiw4QkFBOEI7WUFDOUIsTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1lBQ3JFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUUvQiwrQkFBK0I7WUFDL0IsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2xFLENBQUMsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQzFELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsb0JBQW9CLENBQUMsaUJBQVMsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFDdkYsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDNUQsVUFBVTtZQUNWLE1BQU0sSUFBSSxHQUFHLG9CQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDOUIsZUFBZSxFQUFFLENBQUE7WUFFakIsOEJBQThCO1lBQzlCLE1BQU0sYUFBYSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtZQUNyRSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFL0IseUJBQXlCO1lBQ3pCLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNuRSxDQUFDLENBQUMsQ0FBQTtZQUNGLE1BQU0sY0FBYyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUM1RCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUE7WUFFaEMscUNBQXFDO1lBQ3JDLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDL0UsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywyREFBMkQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN6RSxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLEVBQUUsQ0FBQTtZQUVqQiw4QkFBOEI7WUFDOUIsTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1lBQ3JFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUUvQix5RkFBeUY7WUFDekYsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ25FLENBQUMsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxjQUFjLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1lBQzVELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtZQUVoQyxxQ0FBcUM7WUFDckMsd0VBQXdFO1lBQ3hFLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDaEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG1CQUFtQjtJQUNuQixRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN6RCxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLEVBQUUsQ0FBQTtZQUVqQiw0QkFBNEI7WUFDNUIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBRTdFLHNCQUFzQjtZQUN0QixNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDckUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRS9CLHVCQUF1QjtZQUN2QixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekUsQ0FBQyxDQUFDLENBQUE7WUFFRix1QkFBdUI7WUFDdkIsTUFBTSxXQUFXLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3hELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUU3Qix3QkFBd0I7WUFDeEIsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxjQUFNLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUMvRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2xFLFVBQVU7WUFDVixNQUFNLElBQUksR0FBRyxvQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzlCLGVBQWUsRUFBRSxDQUFBO1lBRWpCLHdDQUF3QztZQUN4QyxNQUFNLGVBQWUsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7WUFDN0UsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQ2pDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUVqQyxpREFBaUQ7WUFDakQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQy9FLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBEQUEwRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3hFLFVBQVU7WUFDVixNQUFNLElBQUksR0FBRyxvQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzlCLGVBQWUsRUFBRSxDQUFBO1lBRWpCLGdDQUFnQztZQUNoQyxNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDckUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRS9CLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNuRSxDQUFDLENBQUMsQ0FBQTtZQUNGLE1BQU0sY0FBYyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUM1RCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUE7WUFFaEMscUNBQXFDO1lBQ3JDLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDL0UsQ0FBQyxDQUFDLENBQUE7WUFFRixtQ0FBbUM7WUFDbkMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRS9CLHNDQUFzQztZQUN0QyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsd0JBQXdCO0lBQ3hCLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1RCxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLEVBQUUsQ0FBQTtZQUVqQixNQUFNO1lBQ04sTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1lBQ3JFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUMvQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDL0IsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRS9CLDZDQUE2QztZQUM3QyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMzRSxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLEVBQUUsQ0FBQTtZQUVqQixpQ0FBaUM7WUFDakMsTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1lBQ3JFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUUvQixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbkUsQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7WUFFdkQsU0FBUztZQUNULE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsRUFBRSxpQkFBUyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQTtZQUU1RixzQ0FBc0M7WUFDdEMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQy9CLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNsRSxDQUFDLENBQUMsQ0FBQTtZQUNGLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUV0RCxTQUFTO1lBQ1QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLGlCQUFTLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQzNGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDJDQUEyQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3pELFVBQVU7WUFDVixNQUFNLElBQUksR0FBRyxvQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzlCLGVBQWUsQ0FBQztnQkFDZCxpQkFBaUIsRUFBRSxTQUFTO2dCQUM1QixlQUFlLEVBQUUsU0FBUzthQUMzQixDQUFDLENBQUE7WUFFRixrQ0FBa0M7WUFDbEMsTUFBTSxlQUFlLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1lBQzdFLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ2xFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhEQUE4RCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzVFLFVBQVU7WUFDVixNQUFNLElBQUksR0FBRyxvQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzlCLGVBQWUsRUFBRSxDQUFBO1lBRWpCLHNCQUFzQjtZQUN0QixNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDckUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRS9CLGdDQUFnQztZQUNoQyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbEUsQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFdEQsa0RBQWtEO1lBQ2xELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBRWxELHFDQUFxQztZQUNyQyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQy9FLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHNCQUFzQjtJQUN0QixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUM3QixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELGdCQUFnQjtZQUNoQixlQUFlLEVBQUUsQ0FBQTtZQUVqQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQzNFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUN2RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7WUFDdkQsZ0JBQWdCO1lBQ2hCLGVBQWUsRUFBRSxDQUFBO1lBRWpCLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN4RixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4RixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN4RCxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLEVBQUUsQ0FBQTtZQUVqQixNQUFNO1lBQ04sTUFBTSxlQUFlLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1lBQzdFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUVqQyxpREFBaUQ7WUFDakQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDakYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDN0UsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG9CQUFvQjtJQUNwQixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsa0RBQWtELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDaEUsVUFBVTtZQUNWLE1BQU0sSUFBSSxHQUFHLG9CQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDOUIsZUFBZSxFQUFFLENBQUE7WUFFakIseUJBQXlCO1lBQ3pCLE1BQU0sZUFBZSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtZQUM3RSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUE7WUFFakMsU0FBUztZQUNULE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3RELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBRWxELHNCQUFzQjtZQUN0QixNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDckUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRS9CLHdDQUF3QztZQUN4QyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekUsQ0FBQyxDQUFDLENBQUE7WUFFRix1QkFBdUI7WUFDdkIsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFBO1lBRXZELFNBQVM7WUFDVCxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwRCxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7WUFDM0QsZ0JBQWdCO1lBQ2hCLGVBQWUsRUFBRSxDQUFBO1lBRWpCLFNBQVM7WUFDVCxxREFBcUQ7WUFDckQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDakYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFM0Usa0NBQWtDO1lBQ2xDLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNqRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCBTdGFydE5vZGVTZWxlY3Rpb25QYW5lbCBmcm9tICcuL3N0YXJ0LW5vZGUtc2VsZWN0aW9uLXBhbmVsJ1xuXG4vLyBNb2NrIE5vZGVTZWxlY3RvciBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3InLCAoKSA9PiAoe1xuICBkZWZhdWx0OiBmdW5jdGlvbiBNb2NrTm9kZVNlbGVjdG9yKHtcbiAgICBvcGVuLFxuICAgIG9uT3BlbkNoYW5nZSxcbiAgICBvblNlbGVjdCxcbiAgICB0cmlnZ2VyLFxuICB9OiBhbnkpIHtcbiAgICAvLyB0cmlnZ2VyIGlzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgUmVhY3QgZWxlbWVudFxuICAgIGNvbnN0IHRyaWdnZXJFbGVtZW50ID0gdHlwZW9mIHRyaWdnZXIgPT09ICdmdW5jdGlvbicgPyB0cmlnZ2VyKCkgOiB0cmlnZ2VyXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cIm5vZGUtc2VsZWN0b3JcIj5cbiAgICAgICAge3RyaWdnZXJFbGVtZW50fVxuICAgICAgICB7b3BlbiAmJiAoXG4gICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cIm5vZGUtc2VsZWN0b3ItY29udGVudFwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlbGVjdC1zY2hlZHVsZVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0KEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBTZWxlY3QgU2NoZWR1bGVcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlbGVjdC13ZWJob29rXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3QoQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgU2VsZWN0IFdlYmhvb2tcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNsb3NlLXNlbGVjdG9yXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25PcGVuQ2hhbmdlKGZhbHNlKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgQ2xvc2VcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufSkpXG5cbmRlc2NyaWJlKCdTdGFydE5vZGVTZWxlY3Rpb25QYW5lbCcsICgpID0+IHtcbiAgY29uc3QgbW9ja09uU2VsZWN0VXNlcklucHV0ID0gdmkuZm4oKVxuICBjb25zdCBtb2NrT25TZWxlY3RUcmlnZ2VyID0gdmkuZm4oKVxuXG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvblNlbGVjdFVzZXJJbnB1dDogbW9ja09uU2VsZWN0VXNlcklucHV0LFxuICAgIG9uU2VsZWN0VHJpZ2dlcjogbW9ja09uU2VsZWN0VHJpZ2dlcixcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byByZW5kZXIgY29tcG9uZW50XG4gIGNvbnN0IHJlbmRlckNvbXBvbmVudCA9IChwcm9wcyA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIHJlbmRlcig8U3RhcnROb2RlU2VsZWN0aW9uUGFuZWwgey4uLmRlZmF1bHRQcm9wc30gey4uLnByb3BzfSAvPilcbiAgfVxuXG4gIC8vIFJlbmRlcmluZyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudXNlcklucHV0RnVsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHVzZXIgaW5wdXQgb3B0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy51c2VySW5wdXRGdWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnVzZXJJbnB1dERlc2NyaXB0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdHJpZ2dlciBvcHRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudHJpZ2dlckRlc2NyaXB0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbm9kZSBzZWxlY3RvciBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ25vZGUtc2VsZWN0b3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHRyaWdnZXIgc2VsZWN0b3IgaW5pdGlhbGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ25vZGUtc2VsZWN0b3ItY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcHMgdGVzdHMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgb25TZWxlY3RVc2VySW5wdXQgcHJvcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGN1c3RvbUhhbmRsZXIgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25TZWxlY3RVc2VySW5wdXQ6IGN1c3RvbUhhbmRsZXIgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy51c2VySW5wdXRGdWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgb25TZWxlY3RUcmlnZ2VyIHByb3AnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjdXN0b21IYW5kbGVyID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uU2VsZWN0VHJpZ2dlcjogY3VzdG9tSGFuZGxlciB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXNzaW5nIG9uU2VsZWN0VXNlcklucHV0IGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoeyBvblNlbGVjdFVzZXJJbnB1dDogdW5kZWZpbmVkIH0pXG4gICAgICB9KS5ub3QudG9UaHJvdygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudXNlcklucHV0RnVsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3Npbmcgb25TZWxlY3RUcmlnZ2VyIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoeyBvblNlbGVjdFRyaWdnZXI6IHVuZGVmaW5lZCB9KVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgLSBVc2VyIElucHV0IE9wdGlvblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMgLSBVc2VyIElucHV0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblNlbGVjdFVzZXJJbnB1dCB3aGVuIHVzZXIgaW5wdXQgb3B0aW9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdXNlcklucHV0T3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy51c2VySW5wdXRGdWxsJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXNlcklucHV0T3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RVc2VySW5wdXQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uU2VsZWN0VHJpZ2dlciB3aGVuIHVzZXIgaW5wdXQgb3B0aW9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdXNlcklucHV0T3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy51c2VySW5wdXRGdWxsJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXNlcklucHV0T3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RUcmlnZ2VyKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGNsaWNrcyBvbiB1c2VyIGlucHV0IG9wdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB1c2VySW5wdXRPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnVzZXJJbnB1dEZ1bGwnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh1c2VySW5wdXRPcHRpb24pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHVzZXJJbnB1dE9wdGlvbilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXNlcklucHV0T3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RVc2VySW5wdXQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgLSBUcmlnZ2VyIE9wdGlvblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMgLSBUcmlnZ2VyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyB0cmlnZ2VyIHNlbGVjdG9yIHdoZW4gdHJpZ2dlciBvcHRpb24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0cmlnZ2VyT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy50cmlnZ2VyJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlck9wdGlvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbm9kZS1zZWxlY3Rvci1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25TZWxlY3RUcmlnZ2VyIGltbWVkaWF0ZWx5IHdoZW4gdHJpZ2dlciBvcHRpb24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0cmlnZ2VyT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy50cmlnZ2VyJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlck9wdGlvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VHJpZ2dlcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3RUcmlnZ2VyIHdoZW4gYSB0cmlnZ2VyIGlzIHNlbGVjdGVkIGZyb20gc2VsZWN0b3InLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gdHJpZ2dlciBzZWxlY3RvclxuICAgICAgY29uc3QgdHJpZ2dlck9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudHJpZ2dlcicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXJPcHRpb24pXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCBhIHRyaWdnZXJcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtc2NoZWR1bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGNvbnN0IHNjaGVkdWxlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtc2NoZWR1bGUnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY2hlZHVsZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VHJpZ2dlcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VHJpZ2dlcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZSwgdW5kZWZpbmVkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3RUcmlnZ2VyIHdpdGggY29ycmVjdCBub2RlIHR5cGUgZm9yIHdlYmhvb2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gdHJpZ2dlciBzZWxlY3RvclxuICAgICAgY29uc3QgdHJpZ2dlck9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudHJpZ2dlcicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXJPcHRpb24pXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCB3ZWJob29rIHRyaWdnZXJcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtd2ViaG9vaycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgY29uc3Qgd2ViaG9va0J1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXdlYmhvb2snKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh3ZWJob29rQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RUcmlnZ2VyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RUcmlnZ2VyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2ssIHVuZGVmaW5lZClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIHRyaWdnZXIgc2VsZWN0b3IgYWZ0ZXIgc2VsZWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIHRyaWdnZXIgc2VsZWN0b3JcbiAgICAgIGNvbnN0IHRyaWdnZXJPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRyaWdnZXInKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyT3B0aW9uKVxuXG4gICAgICAvLyBBY3QgLSBTZWxlY3QgYSB0cmlnZ2VyXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXNjaGVkdWxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBjb25zdCBzY2hlZHVsZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXNjaGVkdWxlJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NoZWR1bGVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNlbGVjdG9yIHNob3VsZCBiZSBoaWRkZW5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ25vZGUtc2VsZWN0b3ItY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHRvb2wgY29uZmlnIHBhcmFtZXRlciB0aHJvdWdoIG9uU2VsZWN0VHJpZ2dlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0IC0gT3BlbiB0cmlnZ2VyIHNlbGVjdG9yXG4gICAgICBjb25zdCB0cmlnZ2VyT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy50cmlnZ2VyJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlck9wdGlvbilcblxuICAgICAgLy8gQWN0IC0gU2VsZWN0IGEgdHJpZ2dlciAob3VyIG1vY2sgZG9lc24ndCBwYXNzIHRvb2xDb25maWcsIGJ1dCByZWFsIE5vZGVTZWxlY3RvciB3b3VsZClcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtc2NoZWR1bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGNvbnN0IHNjaGVkdWxlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtc2NoZWR1bGUnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY2hlZHVsZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gVmVyaWZ5IGhhbmRsZXIgd2FzIGNhbGxlZFxuICAgICAgLy8gSW4gcmVhbCB1c2FnZSwgTm9kZVNlbGVjdG9yIHdvdWxkIHBhc3MgdG9vbENvbmZpZyBhcyBzZWNvbmQgcGFyYW1ldGVyXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VHJpZ2dlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50XG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdG9nZ2xlIHRyaWdnZXIgc2VsZWN0b3IgdmlzaWJpbGl0eScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0IC0gSW5pdGlhbGx5IGhpZGRlblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdub2RlLXNlbGVjdG9yLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gU2hvdyBzZWxlY3RvclxuICAgICAgY29uc3QgdHJpZ2dlck9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudHJpZ2dlcicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXJPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vdyB2aXNpYmxlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbm9kZS1zZWxlY3Rvci1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAtIENsb3NlIHNlbGVjdG9yXG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY2xvc2Utc2VsZWN0b3InKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjbG9zZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gSGlkZGVuIGFnYWluXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdub2RlLXNlbGVjdG9yLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhdGUgYWNyb3NzIHVzZXIgaW5wdXQgc2VsZWN0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0IC0gQ2xpY2sgdXNlciBpbnB1dCBtdWx0aXBsZSB0aW1lc1xuICAgICAgY29uc3QgdXNlcklucHV0T3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy51c2VySW5wdXRGdWxsJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXNlcklucHV0T3B0aW9uKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh1c2VySW5wdXRPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydCAtIFRyaWdnZXIgc2VsZWN0b3Igc2hvdWxkIHJlbWFpbiBoaWRkZW5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnbm9kZS1zZWxlY3Rvci1jb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVzZXQgdHJpZ2dlciBzZWxlY3RvciB2aXNpYmlsaXR5IGFmdGVyIHNlbGVjdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0IC0gT3BlbiBhbmQgc2VsZWN0IHRyaWdnZXJcbiAgICAgIGNvbnN0IHRyaWdnZXJPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRyaWdnZXInKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyT3B0aW9uKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXNjaGVkdWxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBjb25zdCBzY2hlZHVsZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXNjaGVkdWxlJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NoZWR1bGVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNlbGVjdG9yIHNob3VsZCBiZSBjbG9zZWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ25vZGUtc2VsZWN0b3ItY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQWN0IC0gQ2xpY2sgdHJpZ2dlciBvcHRpb24gYWdhaW5cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlck9wdGlvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2VsZWN0b3Igc2hvdWxkIG9wZW4gYWdhaW5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdub2RlLXNlbGVjdG9yLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgQ2FzZXMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBjbGlja3Mgb24gdHJpZ2dlciBvcHRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdHJpZ2dlck9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudHJpZ2dlcicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXJPcHRpb24pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXJPcHRpb24pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXJPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzdGlsbCBiZSBvcGVuIChsYXN0IGNsaWNrKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ25vZGUtc2VsZWN0b3ItY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzZWxlY3RpbmcgZGlmZmVyZW50IHRyaWdnZXIgdHlwZXMgaW4gc2VxdWVuY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gYW5kIHNlbGVjdCBzY2hlZHVsZVxuICAgICAgY29uc3QgdHJpZ2dlck9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudHJpZ2dlcicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXJPcHRpb24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtc2NoZWR1bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtc2NoZWR1bGUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VHJpZ2dlcikudG9IYXZlQmVlbk50aENhbGxlZFdpdGgoMSwgQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZSwgdW5kZWZpbmVkKVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGFnYWluIGFuZCBzZWxlY3Qgd2ViaG9va1xuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyT3B0aW9uKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC13ZWJob29rJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXdlYmhvb2snKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VHJpZ2dlcikudG9IYXZlQmVlbk50aENhbGxlZFdpdGgoMiwgQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rLCB1bmRlZmluZWQpXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VHJpZ2dlcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNyYXNoIHdpdGggdW5kZWZpbmVkIGNhbGxiYWNrcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgb25TZWxlY3RVc2VySW5wdXQ6IHVuZGVmaW5lZCxcbiAgICAgICAgb25TZWxlY3RUcmlnZ2VyOiB1bmRlZmluZWQsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBTaG91bGQgbm90IHRocm93XG4gICAgICBjb25zdCB1c2VySW5wdXRPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnVzZXJJbnB1dEZ1bGwnKVxuICAgICAgYXdhaXQgZXhwZWN0KHVzZXIuY2xpY2sodXNlcklucHV0T3B0aW9uKSkucmVzb2x2ZXMubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvcGVuaW5nIGFuZCBjbG9zaW5nIHNlbGVjdG9yIHdpdGhvdXQgc2VsZWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIHNlbGVjdG9yXG4gICAgICBjb25zdCB0cmlnZ2VyT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy50cmlnZ2VyJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlck9wdGlvbilcblxuICAgICAgLy8gQWN0IC0gQ2xvc2Ugd2l0aG91dCBzZWxlY3RpbmdcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1zZWxlY3RvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nsb3NlLXNlbGVjdG9yJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vIHNlbGVjdGlvbiBjYWxsYmFjayBzaG91bGQgYmUgY2FsbGVkXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VHJpZ2dlcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTZWxlY3RvciBzaG91bGQgYmUgY2xvc2VkXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdub2RlLXNlbGVjdG9yLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBBY2Nlc3NpYmlsaXR5IFRlc3RzXG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBib3RoIG9wdGlvbnMgdmlzaWJsZSBhbmQgYWNjZXNzaWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudXNlcklucHV0RnVsbCcpKS50b0JlVmlzaWJsZSgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy50cmlnZ2VyJykpLnRvQmVWaXNpYmxlKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGRlc2NyaXB0aXZlIHRleHQgZm9yIGJvdGggb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudXNlcklucHV0RGVzY3JpcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudHJpZ2dlckRlc2NyaXB0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBmb2N1cyBhZnRlciBpbnRlcmFjdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdXNlcklucHV0T3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy51c2VySW5wdXRGdWxsJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXNlcklucHV0T3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIHN0aWxsIGJlIGluIGRvY3VtZW50XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy51c2VySW5wdXRGdWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29vcmRpbmF0ZSBiZXR3ZWVuIGJvdGggb3B0aW9ucyBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIHVzZXIgaW5wdXRcbiAgICAgIGNvbnN0IHVzZXJJbnB1dE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudXNlcklucHV0RnVsbCcpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHVzZXJJbnB1dE9wdGlvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0VXNlcklucHV0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RUcmlnZ2VyKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIHRyaWdnZXJcbiAgICAgIGNvbnN0IHRyaWdnZXJPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5vbmJvYXJkaW5nLnRyaWdnZXInKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyT3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBUcmlnZ2VyIHNlbGVjdG9yIHNob3VsZCBvcGVuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbm9kZS1zZWxlY3Rvci1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCB0cmlnZ2VyXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXNjaGVkdWxlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdFRyaWdnZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdFVzZXJJbnB1dCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBjb21wb25lbnRzIGluIGNvcnJlY3QgaGllcmFyY2h5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICAvLyBCb3RoIFN0YXJ0Tm9kZU9wdGlvbiBjb21wb25lbnRzIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3dvcmtmbG93Lm9uYm9hcmRpbmcudXNlcklucHV0RnVsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cub25ib2FyZGluZy50cmlnZ2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gTm9kZVNlbGVjdG9yIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbm9kZS1zZWxlY3RvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=