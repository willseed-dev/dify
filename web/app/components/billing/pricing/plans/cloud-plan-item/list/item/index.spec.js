"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
describe('Item', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering the plan item row
    describe('Rendering', () => {
        it('should render the provided label when tooltip is absent', () => {
            // Arrange
            const label = 'Monthly credits';
            // Act
            const { container } = (0, react_1.render)(<index_1.default label={label}/>);
            // Assert
            expect(react_1.screen.getByText(label)).toBeInTheDocument();
            expect(container.querySelector('.group')).toBeNull();
        });
    });
    // Toggling the optional tooltip indicator
    describe('Tooltip behavior', () => {
        it('should render tooltip content when tooltip text is provided', () => {
            // Arrange
            const label = 'Workspace seats';
            const tooltip = 'Seats define how many teammates can join the workspace.';
            // Act
            const { container } = (0, react_1.render)(<index_1.default label={label} tooltip={tooltip}/>);
            // Assert
            expect(react_1.screen.getByText(label)).toBeInTheDocument();
            expect(react_1.screen.getByText(tooltip)).toBeInTheDocument();
            expect(container.querySelector('.group')).not.toBeNull();
        });
        it('should treat an empty tooltip string as absent', () => {
            // Arrange
            const label = 'Vector storage';
            // Act
            const { container } = (0, react_1.render)(<index_1.default label={label} tooltip=""/>);
            // Assert
            expect(react_1.screen.getByText(label)).toBeInTheDocument();
            expect(container.querySelector('.group')).toBeNull();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXVEO0FBQ3ZELG1DQUEwQjtBQUUxQixRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsOEJBQThCO0lBQzlCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7WUFDakUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFBO1lBRS9CLE1BQU07WUFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBELFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUN0RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsMENBQTBDO0lBQzFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUNyRSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUE7WUFDL0IsTUFBTSxPQUFPLEdBQUcseURBQXlELENBQUE7WUFFekUsTUFBTTtZQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFdEUsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNuRCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDckQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1lBQ3hELFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQTtZQUU5QixNQUFNO1lBQ04sTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUcsQ0FBQyxDQUFBO1lBRS9ELFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUN0RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgSXRlbSBmcm9tICcuL2luZGV4J1xuXG5kZXNjcmliZSgnSXRlbScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIHRoZSBwbGFuIGl0ZW0gcm93XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGhlIHByb3ZpZGVkIGxhYmVsIHdoZW4gdG9vbHRpcCBpcyBhYnNlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsYWJlbCA9ICdNb250aGx5IGNyZWRpdHMnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SXRlbSBsYWJlbD17bGFiZWx9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxhYmVsKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZ3JvdXAnKSkudG9CZU51bGwoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVG9nZ2xpbmcgdGhlIG9wdGlvbmFsIHRvb2x0aXAgaW5kaWNhdG9yXG4gIGRlc2NyaWJlKCdUb29sdGlwIGJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRvb2x0aXAgY29udGVudCB3aGVuIHRvb2x0aXAgdGV4dCBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxhYmVsID0gJ1dvcmtzcGFjZSBzZWF0cydcbiAgICAgIGNvbnN0IHRvb2x0aXAgPSAnU2VhdHMgZGVmaW5lIGhvdyBtYW55IHRlYW1tYXRlcyBjYW4gam9pbiB0aGUgd29ya3NwYWNlLidcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJdGVtIGxhYmVsPXtsYWJlbH0gdG9vbHRpcD17dG9vbHRpcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobGFiZWwpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCh0b29sdGlwKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZ3JvdXAnKSkubm90LnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmVhdCBhbiBlbXB0eSB0b29sdGlwIHN0cmluZyBhcyBhYnNlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsYWJlbCA9ICdWZWN0b3Igc3RvcmFnZSdcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJdGVtIGxhYmVsPXtsYWJlbH0gdG9vbHRpcD1cIlwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxhYmVsKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZ3JvdXAnKSkudG9CZU51bGwoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19