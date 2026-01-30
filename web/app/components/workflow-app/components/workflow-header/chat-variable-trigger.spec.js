"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const chat_variable_trigger_1 = require("./chat-variable-trigger");
const mockUseNodesReadOnly = vi.fn();
const mockUseIsChatMode = vi.fn();
vi.mock('@/app/components/workflow/hooks', () => ({
    useNodesReadOnly: () => mockUseNodesReadOnly(),
}));
vi.mock('../../hooks', () => ({
    useIsChatMode: () => mockUseIsChatMode(),
}));
vi.mock('@/app/components/workflow/header/chat-variable-button', () => ({
    default: ({ disabled }) => (<button data-testid="chat-variable-button" type="button" disabled={disabled}>
      ChatVariableButton
    </button>),
}));
describe('ChatVariableTrigger', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Verifies conditional rendering when chat mode is off.
    describe('Rendering', () => {
        it('should not render when not in chat mode', () => {
            // Arrange
            mockUseIsChatMode.mockReturnValue(false);
            mockUseNodesReadOnly.mockReturnValue({ nodesReadOnly: false });
            // Act
            (0, react_1.render)(<chat_variable_trigger_1.default />);
            // Assert
            expect(react_1.screen.queryByRole('button', { name: 'ChatVariableButton' })).not.toBeInTheDocument();
        });
    });
    // Verifies the disabled state reflects read-only nodes.
    describe('Props', () => {
        it('should render enabled ChatVariableButton when nodes are editable', () => {
            // Arrange
            mockUseIsChatMode.mockReturnValue(true);
            mockUseNodesReadOnly.mockReturnValue({ nodesReadOnly: false });
            // Act
            (0, react_1.render)(<chat_variable_trigger_1.default />);
            // Assert
            expect(react_1.screen.getByRole('button', { name: 'ChatVariableButton' })).toBeEnabled();
        });
        it('should render disabled ChatVariableButton when nodes are read-only', () => {
            // Arrange
            mockUseIsChatMode.mockReturnValue(true);
            mockUseNodesReadOnly.mockReturnValue({ nodesReadOnly: true });
            // Act
            (0, react_1.render)(<chat_variable_trigger_1.default />);
            // Assert
            expect(react_1.screen.getByRole('button', { name: 'ChatVariableButton' })).toBeDisabled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC12YXJpYWJsZS10cmlnZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGF0LXZhcmlhYmxlLXRyaWdnZXIuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrREFBdUQ7QUFDdkQsbUVBQXlEO0FBRXpELE1BQU0sb0JBQW9CLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3BDLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBRWpDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoRCxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRTtDQUMvQyxDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUIsYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixFQUFFO0NBQ3pDLENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUF5QixFQUFFLEVBQUUsQ0FBQyxDQUNoRCxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDMUU7O0lBQ0YsRUFBRSxNQUFNLENBQUMsQ0FDVjtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUNuQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsd0RBQXdEO0lBQ3hELFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7WUFDakQsVUFBVTtZQUNWLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN4QyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtZQUU5RCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQywrQkFBbUIsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRS9CLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDOUYsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHdEQUF3RDtJQUN4RCxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixFQUFFLENBQUMsa0VBQWtFLEVBQUUsR0FBRyxFQUFFO1lBQzFFLFVBQVU7WUFDVixpQkFBaUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdkMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7WUFFOUQsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsK0JBQW1CLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2xGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9FQUFvRSxFQUFFLEdBQUcsRUFBRTtZQUM1RSxVQUFVO1lBQ1YsaUJBQWlCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3ZDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBRTdELE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLCtCQUFtQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFL0IsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUNuRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgQ2hhdFZhcmlhYmxlVHJpZ2dlciBmcm9tICcuL2NoYXQtdmFyaWFibGUtdHJpZ2dlcidcblxuY29uc3QgbW9ja1VzZU5vZGVzUmVhZE9ubHkgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlSXNDaGF0TW9kZSA9IHZpLmZuKClcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcycsICgpID0+ICh7XG4gIHVzZU5vZGVzUmVhZE9ubHk6ICgpID0+IG1vY2tVc2VOb2Rlc1JlYWRPbmx5KCksXG59KSlcblxudmkubW9jaygnLi4vLi4vaG9va3MnLCAoKSA9PiAoe1xuICB1c2VJc0NoYXRNb2RlOiAoKSA9PiBtb2NrVXNlSXNDaGF0TW9kZSgpLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaGVhZGVyL2NoYXQtdmFyaWFibGUtYnV0dG9uJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgZGlzYWJsZWQgfTogeyBkaXNhYmxlZDogYm9vbGVhbiB9KSA9PiAoXG4gICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImNoYXQtdmFyaWFibGUtYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPXtkaXNhYmxlZH0+XG4gICAgICBDaGF0VmFyaWFibGVCdXR0b25cbiAgICA8L2J1dHRvbj5cbiAgKSxcbn0pKVxuXG5kZXNjcmliZSgnQ2hhdFZhcmlhYmxlVHJpZ2dlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gVmVyaWZpZXMgY29uZGl0aW9uYWwgcmVuZGVyaW5nIHdoZW4gY2hhdCBtb2RlIGlzIG9mZi5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgd2hlbiBub3QgaW4gY2hhdCBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZUlzQ2hhdE1vZGUubW9ja1JldHVyblZhbHVlKGZhbHNlKVxuICAgICAgbW9ja1VzZU5vZGVzUmVhZE9ubHkubW9ja1JldHVyblZhbHVlKHsgbm9kZXNSZWFkT25seTogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENoYXRWYXJpYWJsZVRyaWdnZXIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnQ2hhdFZhcmlhYmxlQnV0dG9uJyB9KSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZlcmlmaWVzIHRoZSBkaXNhYmxlZCBzdGF0ZSByZWZsZWN0cyByZWFkLW9ubHkgbm9kZXMuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlbmFibGVkIENoYXRWYXJpYWJsZUJ1dHRvbiB3aGVuIG5vZGVzIGFyZSBlZGl0YWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VJc0NoYXRNb2RlLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgICAgbW9ja1VzZU5vZGVzUmVhZE9ubHkubW9ja1JldHVyblZhbHVlKHsgbm9kZXNSZWFkT25seTogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENoYXRWYXJpYWJsZVRyaWdnZXIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ0NoYXRWYXJpYWJsZUJ1dHRvbicgfSkpLnRvQmVFbmFibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGlzYWJsZWQgQ2hhdFZhcmlhYmxlQnV0dG9uIHdoZW4gbm9kZXMgYXJlIHJlYWQtb25seScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VJc0NoYXRNb2RlLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgICAgbW9ja1VzZU5vZGVzUmVhZE9ubHkubW9ja1JldHVyblZhbHVlKHsgbm9kZXNSZWFkT25seTogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q2hhdFZhcmlhYmxlVHJpZ2dlciAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnQ2hhdFZhcmlhYmxlQnV0dG9uJyB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==