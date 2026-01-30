"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const start_node_option_1 = require("./start-node-option");
describe('StartNodeOption', () => {
    const mockOnClick = vi.fn();
    const defaultProps = {
        icon: <div data-testid="test-icon">Icon</div>,
        title: 'Test Title',
        description: 'Test description for the option',
        onClick: mockOnClick,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Helper function to render component
    const renderComponent = (props = {}) => {
        return (0, react_1.render)(<start_node_option_1.default {...defaultProps} {...props}/>);
    };
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('Test Title')).toBeInTheDocument();
        });
        it('should render icon correctly', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByTestId('test-icon')).toBeInTheDocument();
            expect(react_1.screen.getByText('Icon')).toBeInTheDocument();
        });
        it('should render title correctly', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const title = react_1.screen.getByText('Test Title');
            expect(title).toBeInTheDocument();
            expect(title).toHaveClass('system-md-semi-bold');
            expect(title).toHaveClass('text-text-primary');
        });
        it('should render description correctly', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const description = react_1.screen.getByText('Test description for the option');
            expect(description).toBeInTheDocument();
            expect(description).toHaveClass('system-xs-regular');
            expect(description).toHaveClass('text-text-tertiary');
        });
        it('should be rendered as a clickable card', () => {
            // Arrange & Act
            const { container } = renderComponent();
            // Assert
            const card = container.querySelector('.cursor-pointer');
            expect(card).toBeInTheDocument();
            // Check that it has cursor-pointer class to indicate clickability
            expect(card).toHaveClass('cursor-pointer');
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should render with subtitle when provided', () => {
            // Arrange & Act
            renderComponent({ subtitle: 'Optional Subtitle' });
            // Assert
            expect(react_1.screen.getByText('Optional Subtitle')).toBeInTheDocument();
        });
        it('should not render subtitle when not provided', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            const titleElement = react_1.screen.getByText('Test Title').parentElement;
            expect(titleElement).not.toHaveTextContent('Optional Subtitle');
        });
        it('should render subtitle with correct styling', () => {
            // Arrange & Act
            renderComponent({ subtitle: 'Subtitle Text' });
            // Assert
            const subtitle = react_1.screen.getByText('Subtitle Text');
            expect(subtitle).toHaveClass('system-md-regular');
            expect(subtitle).toHaveClass('text-text-quaternary');
        });
        it('should render custom icon component', () => {
            // Arrange
            const customIcon = <svg data-testid="custom-svg">Custom</svg>;
            // Act
            renderComponent({ icon: customIcon });
            // Assert
            expect(react_1.screen.getByTestId('custom-svg')).toBeInTheDocument();
        });
        it('should render long title correctly', () => {
            // Arrange
            const longTitle = 'This is a very long title that should still render correctly';
            // Act
            renderComponent({ title: longTitle });
            // Assert
            expect(react_1.screen.getByText(longTitle)).toBeInTheDocument();
        });
        it('should render long description correctly', () => {
            // Arrange
            const longDescription = 'This is a very long description that explains the option in great detail and should still render correctly within the component layout';
            // Act
            renderComponent({ description: longDescription });
            // Assert
            expect(react_1.screen.getByText(longDescription)).toBeInTheDocument();
        });
        it('should render with proper layout structure', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('Test Title')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test description for the option')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('test-icon')).toBeInTheDocument();
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should call onClick when card is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const card = react_1.screen.getByText('Test Title').closest('div[class*="cursor-pointer"]');
            await user.click(card);
            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
        it('should call onClick when icon is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const icon = react_1.screen.getByTestId('test-icon');
            await user.click(icon);
            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
        it('should call onClick when title is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const title = react_1.screen.getByText('Test Title');
            await user.click(title);
            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
        it('should call onClick when description is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const description = react_1.screen.getByText('Test description for the option');
            await user.click(description);
            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
        it('should handle multiple rapid clicks', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const card = react_1.screen.getByText('Test Title').closest('div[class*="cursor-pointer"]');
            await user.click(card);
            await user.click(card);
            await user.click(card);
            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(3);
        });
        it('should not throw error if onClick is undefined', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ onClick: undefined });
            // Act & Assert
            const card = react_1.screen.getByText('Test Title').closest('div[class*="cursor-pointer"]');
            await expect(user.click(card)).resolves.not.toThrow();
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle empty string title', () => {
            // Arrange & Act
            renderComponent({ title: '' });
            // Assert
            const titleContainer = react_1.screen.getByText('Test description for the option').parentElement?.parentElement;
            expect(titleContainer).toBeInTheDocument();
        });
        it('should handle empty string description', () => {
            // Arrange & Act
            renderComponent({ description: '' });
            // Assert
            expect(react_1.screen.getByText('Test Title')).toBeInTheDocument();
        });
        it('should handle undefined subtitle gracefully', () => {
            // Arrange & Act
            renderComponent({ subtitle: undefined });
            // Assert
            expect(react_1.screen.getByText('Test Title')).toBeInTheDocument();
        });
        it('should handle empty string subtitle', () => {
            // Arrange & Act
            renderComponent({ subtitle: '' });
            // Assert
            // Empty subtitle should still render but be empty
            expect(react_1.screen.getByText('Test Title')).toBeInTheDocument();
        });
        it('should handle null subtitle', () => {
            // Arrange & Act
            renderComponent({ subtitle: null });
            // Assert
            expect(react_1.screen.getByText('Test Title')).toBeInTheDocument();
        });
        it('should render with subtitle containing special characters', () => {
            // Arrange
            const specialSubtitle = '(optional) - [Beta]';
            // Act
            renderComponent({ subtitle: specialSubtitle });
            // Assert
            expect(react_1.screen.getByText(specialSubtitle)).toBeInTheDocument();
        });
        it('should render with title and subtitle together', () => {
            // Arrange & Act
            const { container } = renderComponent({
                title: 'Main Title',
                subtitle: 'Secondary Text',
            });
            // Assert
            expect(react_1.screen.getByText('Main Title')).toBeInTheDocument();
            expect(react_1.screen.getByText('Secondary Text')).toBeInTheDocument();
            // Both should be in the same heading element
            const heading = container.querySelector('h3');
            expect(heading).toHaveTextContent('Main Title');
            expect(heading).toHaveTextContent('Secondary Text');
        });
    });
    // Accessibility Tests
    describe('Accessibility', () => {
        it('should have semantic heading structure', () => {
            // Arrange & Act
            const { container } = renderComponent();
            // Assert
            const heading = container.querySelector('h3');
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent('Test Title');
        });
        it('should have semantic paragraph for description', () => {
            // Arrange & Act
            const { container } = renderComponent();
            // Assert
            const paragraph = container.querySelector('p');
            expect(paragraph).toBeInTheDocument();
            expect(paragraph).toHaveTextContent('Test description for the option');
        });
        it('should have proper cursor style for accessibility', () => {
            // Arrange & Act
            const { container } = renderComponent();
            // Assert
            const card = container.querySelector('.cursor-pointer');
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass('cursor-pointer');
        });
    });
    // Additional Edge Cases
    describe('Additional Edge Cases', () => {
        it('should handle click when onClick handler is missing', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ onClick: undefined });
            // Act & Assert - Should not throw error
            const card = react_1.screen.getByText('Test Title').closest('div[class*="cursor-pointer"]');
            await expect(user.click(card)).resolves.not.toThrow();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnQtbm9kZS1vcHRpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXJ0LW5vZGUtb3B0aW9uLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXVEO0FBQ3ZELDREQUFtRDtBQUNuRCwrQkFBOEI7QUFDOUIsMkRBQWlEO0FBRWpELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0lBQzNCLE1BQU0sWUFBWSxHQUFHO1FBQ25CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7UUFDN0MsS0FBSyxFQUFFLFlBQVk7UUFDbkIsV0FBVyxFQUFFLGlDQUFpQztRQUM5QyxPQUFPLEVBQUUsV0FBVztLQUNyQixDQUFBO0lBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLHNDQUFzQztJQUN0QyxNQUFNLGVBQWUsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRTtRQUNyQyxPQUFPLElBQUEsY0FBTSxFQUFDLENBQUMsMkJBQWUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO0lBQ2pFLENBQUMsQ0FBQTtJQUVELDZCQUE2QjtJQUM3QixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLGdCQUFnQjtZQUNoQixlQUFlLEVBQUUsQ0FBQTtZQUVqQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzVELENBQUMsQ0FBQyxD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QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDNUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHdCQUF3QjtJQUN4QixRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNuRSxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixlQUFlLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtZQUV2Qyx3Q0FBd0M7WUFDeEMsTUFBTSxJQUFJLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQTtZQUNuRixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFN0YXJ0Tm9kZU9wdGlvbiBmcm9tICcuL3N0YXJ0LW5vZGUtb3B0aW9uJ1xuXG5kZXNjcmliZSgnU3RhcnROb2RlT3B0aW9uJywgKCkgPT4ge1xuICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIGljb246IDxkaXYgZGF0YS10ZXN0aWQ9XCJ0ZXN0LWljb25cIj5JY29uPC9kaXY+LFxuICAgIHRpdGxlOiAnVGVzdCBUaXRsZScsXG4gICAgZGVzY3JpcHRpb246ICdUZXN0IGRlc2NyaXB0aW9uIGZvciB0aGUgb3B0aW9uJyxcbiAgICBvbkNsaWNrOiBtb2NrT25DbGljayxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byByZW5kZXIgY29tcG9uZW50XG4gIGNvbnN0IHJlbmRlckNvbXBvbmVudCA9IChwcm9wcyA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIHJlbmRlcig8U3RhcnROb2RlT3B0aW9uIHsuLi5kZWZhdWx0UHJvcHN9IHsuLi5wcm9wc30gLz4pXG4gIH1cblxuICAvLyBSZW5kZXJpbmcgdGVzdHMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaWNvbiBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Rlc3QtaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnSWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRpdGxlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdGl0bGUgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFRpdGxlJylcbiAgICAgIGV4cGVjdCh0aXRsZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHRpdGxlKS50b0hhdmVDbGFzcygnc3lzdGVtLW1kLXNlbWktYm9sZCcpXG4gICAgICBleHBlY3QodGl0bGUpLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtcHJpbWFyeScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRlc2NyaXB0aW9uIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IGRlc2NyaXB0aW9uIGZvciB0aGUgb3B0aW9uJylcbiAgICAgIGV4cGVjdChkZXNjcmlwdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGRlc2NyaXB0aW9uKS50b0hhdmVDbGFzcygnc3lzdGVtLXhzLXJlZ3VsYXInKVxuICAgICAgZXhwZWN0KGRlc2NyaXB0aW9uKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBiZSByZW5kZXJlZCBhcyBhIGNsaWNrYWJsZSBjYXJkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY2FyZCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3Vyc29yLXBvaW50ZXInKVxuICAgICAgZXhwZWN0KGNhcmQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIENoZWNrIHRoYXQgaXQgaGFzIGN1cnNvci1wb2ludGVyIGNsYXNzIHRvIGluZGljYXRlIGNsaWNrYWJpbGl0eVxuICAgICAgZXhwZWN0KGNhcmQpLnRvSGF2ZUNsYXNzKCdjdXJzb3ItcG9pbnRlcicpXG4gICAgfSlcbiAgfSlcblxuICAvLyBQcm9wcyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHN1YnRpdGxlIHdoZW4gcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBzdWJ0aXRsZTogJ09wdGlvbmFsIFN1YnRpdGxlJyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPcHRpb25hbCBTdWJ0aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzdWJ0aXRsZSB3aGVuIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdGl0bGVFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBUaXRsZScpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdCh0aXRsZUVsZW1lbnQpLm5vdC50b0hhdmVUZXh0Q29udGVudCgnT3B0aW9uYWwgU3VidGl0bGUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdWJ0aXRsZSB3aXRoIGNvcnJlY3Qgc3R5bGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHN1YnRpdGxlOiAnU3VidGl0bGUgVGV4dCcgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzdWJ0aXRsZSA9IHNjcmVlbi5nZXRCeVRleHQoJ1N1YnRpdGxlIFRleHQnKVxuICAgICAgZXhwZWN0KHN1YnRpdGxlKS50b0hhdmVDbGFzcygnc3lzdGVtLW1kLXJlZ3VsYXInKVxuICAgICAgZXhwZWN0KHN1YnRpdGxlKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjdXN0b20gaWNvbiBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjdXN0b21JY29uID0gPHN2ZyBkYXRhLXRlc3RpZD1cImN1c3RvbS1zdmdcIj5DdXN0b208L3N2Zz5cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpY29uOiBjdXN0b21JY29uIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXN2ZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxvbmcgdGl0bGUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ1RpdGxlID0gJ1RoaXMgaXMgYSB2ZXJ5IGxvbmcgdGl0bGUgdGhhdCBzaG91bGQgc3RpbGwgcmVuZGVyIGNvcnJlY3RseSdcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB0aXRsZTogbG9uZ1RpdGxlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ1RpdGxlKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsb25nIGRlc2NyaXB0aW9uIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdEZXNjcmlwdGlvbiA9ICdUaGlzIGlzIGEgdmVyeSBsb25nIGRlc2NyaXB0aW9uIHRoYXQgZXhwbGFpbnMgdGhlIG9wdGlvbiBpbiBncmVhdCBkZXRhaWwgYW5kIHNob3VsZCBzdGlsbCByZW5kZXIgY29ycmVjdGx5IHdpdGhpbiB0aGUgY29tcG9uZW50IGxheW91dCdcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBkZXNjcmlwdGlvbjogbG9uZ0Rlc2NyaXB0aW9uIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ0Rlc2NyaXB0aW9uKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHByb3BlciBsYXlvdXQgc3RydWN0dXJlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBkZXNjcmlwdGlvbiBmb3IgdGhlIG9wdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0ZXN0LWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnNcbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsaWNrIHdoZW4gY2FyZCBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNhcmQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2FyZCEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xpY2sgd2hlbiBpY29uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgaWNvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgndGVzdC1pY29uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soaWNvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbGljayB3aGVuIHRpdGxlIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdGl0bGUgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFRpdGxlJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodGl0bGUpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xpY2sgd2hlbiBkZXNjcmlwdGlvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBkZXNjcmlwdGlvbiBmb3IgdGhlIG9wdGlvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGRlc2NyaXB0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIHJhcGlkIGNsaWNrcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjYXJkID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBUaXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNhcmQhKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjYXJkISlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2FyZCEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdGhyb3cgZXJyb3IgaWYgb25DbGljayBpcyB1bmRlZmluZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ2xpY2s6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgIGNvbnN0IGNhcmQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGF3YWl0IGV4cGVjdCh1c2VyLmNsaWNrKGNhcmQhKSkucmVzb2x2ZXMubm90LnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRWRnZSBDYXNlcyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyB0aXRsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHRpdGxlOiAnJyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRpdGxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBkZXNjcmlwdGlvbiBmb3IgdGhlIG9wdGlvbicpLnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdCh0aXRsZUNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgZGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBkZXNjcmlwdGlvbjogJycgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBzdWJ0aXRsZSBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgc3VidGl0bGU6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIHN1YnRpdGxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgc3VidGl0bGU6ICcnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgLy8gRW1wdHkgc3VidGl0bGUgc2hvdWxkIHN0aWxsIHJlbmRlciBidXQgYmUgZW1wdHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBzdWJ0aXRsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHN1YnRpdGxlOiBudWxsIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHN1YnRpdGxlIGNvbnRhaW5pbmcgc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3BlY2lhbFN1YnRpdGxlID0gJyhvcHRpb25hbCkgLSBbQmV0YV0nXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgc3VidGl0bGU6IHNwZWNpYWxTdWJ0aXRsZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxTdWJ0aXRsZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCB0aXRsZSBhbmQgc3VidGl0bGUgdG9nZXRoZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdGl0bGU6ICdNYWluIFRpdGxlJyxcbiAgICAgICAgc3VidGl0bGU6ICdTZWNvbmRhcnkgVGV4dCcsXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNYWluIFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTZWNvbmRhcnkgVGV4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEJvdGggc2hvdWxkIGJlIGluIHRoZSBzYW1lIGhlYWRpbmcgZWxlbWVudFxuICAgICAgY29uc3QgaGVhZGluZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdoMycpXG4gICAgICBleHBlY3QoaGVhZGluZykudG9IYXZlVGV4dENvbnRlbnQoJ01haW4gVGl0bGUnKVxuICAgICAgZXhwZWN0KGhlYWRpbmcpLnRvSGF2ZVRleHRDb250ZW50KCdTZWNvbmRhcnkgVGV4dCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyBBY2Nlc3NpYmlsaXR5IFRlc3RzXG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBzZW1hbnRpYyBoZWFkaW5nIHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignaDMnKVxuICAgICAgZXhwZWN0KGhlYWRpbmcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChoZWFkaW5nKS50b0hhdmVUZXh0Q29udGVudCgnVGVzdCBUaXRsZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzZW1hbnRpYyBwYXJhZ3JhcGggZm9yIGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcGFyYWdyYXBoID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3AnKVxuICAgICAgZXhwZWN0KHBhcmFncmFwaCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHBhcmFncmFwaCkudG9IYXZlVGV4dENvbnRlbnQoJ1Rlc3QgZGVzY3JpcHRpb24gZm9yIHRoZSBvcHRpb24nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIGN1cnNvciBzdHlsZSBmb3IgYWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNhcmQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1cnNvci1wb2ludGVyJylcbiAgICAgIGV4cGVjdChjYXJkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY2FyZCkudG9IYXZlQ2xhc3MoJ2N1cnNvci1wb2ludGVyJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIEFkZGl0aW9uYWwgRWRnZSBDYXNlc1xuICBkZXNjcmliZSgnQWRkaXRpb25hbCBFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNsaWNrIHdoZW4gb25DbGljayBoYW5kbGVyIGlzIG1pc3NpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ2xpY2s6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBTaG91bGQgbm90IHRocm93IGVycm9yXG4gICAgICBjb25zdCBjYXJkID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBUaXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBhd2FpdCBleHBlY3QodXNlci5jbGljayhjYXJkISkpLnJlc29sdmVzLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==