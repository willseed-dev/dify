"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const url_input_1 = require("./base/url-input");
// Mock doc link context
vi.mock('@/context/i18n', () => ({
    useDocLink: () => () => 'https://docs.example.com',
}));
// ============================================================================
// UrlInput Component Tests
// ============================================================================
describe('UrlInput', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Helper to create default props for UrlInput
    const createUrlInputProps = (overrides = {}) => ({
        isRunning: false,
        onRun: vi.fn(),
        ...overrides,
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createUrlInputProps();
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
        });
        it('should render input with placeholder from docLink', () => {
            // Arrange
            const props = createUrlInputProps();
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByRole('textbox');
            expect(input).toHaveAttribute('placeholder', 'https://docs.example.com');
        });
        it('should render run button with correct text when not running', () => {
            // Arrange
            const props = createUrlInputProps({ isRunning: false });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
        });
        it('should render button without text when running', () => {
            // Arrange
            const props = createUrlInputProps({ isRunning: true });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            // Assert - find button by data-testid when in loading state
            const runButton = react_1.screen.getByTestId('url-input-run-button');
            expect(runButton).toBeInTheDocument();
            // Button text should be empty when running
            expect(runButton).not.toHaveTextContent(/run/i);
        });
        it('should show loading state on button when running', () => {
            // Arrange
            const onRun = vi.fn();
            const props = createUrlInputProps({ isRunning: true, onRun });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            // Assert - find button by data-testid when in loading state
            const runButton = react_1.screen.getByTestId('url-input-run-button');
            expect(runButton).toBeInTheDocument();
            // Verify button is empty (loading state removes text)
            expect(runButton).not.toHaveTextContent(/run/i);
            // Verify clicking doesn't trigger onRun when loading
            react_1.fireEvent.click(runButton);
            expect(onRun).not.toHaveBeenCalled();
        });
    });
    // --------------------------------------------------------------------------
    // User Input Tests
    // --------------------------------------------------------------------------
    describe('User Input', () => {
        it('should update URL value when user types', async () => {
            // Arrange
            const props = createUrlInputProps();
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://test.com');
            // Assert
            expect(input).toHaveValue('https://test.com');
        });
        it('should handle URL input clearing', async () => {
            // Arrange
            const props = createUrlInputProps();
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://test.com');
            await user_event_1.default.clear(input);
            // Assert
            expect(input).toHaveValue('');
        });
        it('should handle special characters in URL', async () => {
            // Arrange
            const props = createUrlInputProps();
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com/path?query=value&foo=bar');
            // Assert
            expect(input).toHaveValue('https://example.com/path?query=value&foo=bar');
        });
    });
    // --------------------------------------------------------------------------
    // Button Click Tests
    // --------------------------------------------------------------------------
    describe('Button Click', () => {
        it('should call onRun with URL when button is clicked', async () => {
            // Arrange
            const onRun = vi.fn();
            const props = createUrlInputProps({ onRun });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://run-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            expect(onRun).toHaveBeenCalledWith('https://run-test.com');
            expect(onRun).toHaveBeenCalledTimes(1);
        });
        it('should call onRun with empty string if no URL entered', async () => {
            // Arrange
            const onRun = vi.fn();
            const props = createUrlInputProps({ onRun });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            expect(onRun).toHaveBeenCalledWith('');
        });
        it('should not call onRun when isRunning is true', async () => {
            // Arrange
            const onRun = vi.fn();
            const props = createUrlInputProps({ onRun, isRunning: true });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const runButton = react_1.screen.getByTestId('url-input-run-button');
            react_1.fireEvent.click(runButton);
            // Assert
            expect(onRun).not.toHaveBeenCalled();
        });
        it('should not call onRun when already running', async () => {
            // Arrange
            const onRun = vi.fn();
            // First render with isRunning=false, type URL, then rerender with isRunning=true
            const { rerender } = (0, react_1.render)(<url_input_1.default isRunning={false} onRun={onRun}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://test.com');
            // Rerender with isRunning=true to simulate a running state
            rerender(<url_input_1.default isRunning={true} onRun={onRun}/>);
            // Find and click the button by data-testid (loading state has no text)
            const runButton = react_1.screen.getByTestId('url-input-run-button');
            react_1.fireEvent.click(runButton);
            // Assert - onRun should not be called due to early return at line 28
            expect(onRun).not.toHaveBeenCalled();
        });
        it('should prevent multiple clicks when already running', async () => {
            // Arrange
            const onRun = vi.fn();
            const props = createUrlInputProps({ onRun, isRunning: true });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const runButton = react_1.screen.getByTestId('url-input-run-button');
            react_1.fireEvent.click(runButton);
            react_1.fireEvent.click(runButton);
            react_1.fireEvent.click(runButton);
            // Assert
            expect(onRun).not.toHaveBeenCalled();
        });
    });
    // --------------------------------------------------------------------------
    // Props Tests
    // --------------------------------------------------------------------------
    describe('Props', () => {
        it('should respond to isRunning prop change', () => {
            // Arrange
            const props = createUrlInputProps({ isRunning: false });
            // Act
            const { rerender } = (0, react_1.render)(<url_input_1.default {...props}/>);
            expect(react_1.screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
            // Change isRunning to true
            rerender(<url_input_1.default {...props} isRunning={true}/>);
            // Assert - find button by data-testid and verify it's now in loading state
            const runButton = react_1.screen.getByTestId('url-input-run-button');
            expect(runButton).toBeInTheDocument();
            // When loading, the button text should be empty
            expect(runButton).not.toHaveTextContent(/run/i);
        });
        it('should call updated onRun callback after prop change', async () => {
            // Arrange
            const onRun1 = vi.fn();
            const onRun2 = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<url_input_1.default isRunning={false} onRun={onRun1}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://first.com');
            // Change onRun callback
            rerender(<url_input_1.default isRunning={false} onRun={onRun2}/>);
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - new callback should be called
            expect(onRun1).not.toHaveBeenCalled();
            expect(onRun2).toHaveBeenCalledWith('https://first.com');
        });
    });
    // --------------------------------------------------------------------------
    // Callback Stability Tests
    // --------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should use memoized handleUrlChange callback', async () => {
            // Arrange
            const props = createUrlInputProps();
            // Act
            const { rerender } = (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'a');
            // Rerender with same props
            rerender(<url_input_1.default {...props}/>);
            await user_event_1.default.type(input, 'b');
            // Assert - input should work correctly across rerenders
            expect(input).toHaveValue('ab');
        });
        it('should maintain URL state across rerenders', async () => {
            // Arrange
            const props = createUrlInputProps();
            // Act
            const { rerender } = (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://stable.com');
            // Rerender
            rerender(<url_input_1.default {...props}/>);
            // Assert - URL should be maintained
            expect(input).toHaveValue('https://stable.com');
        });
    });
    // --------------------------------------------------------------------------
    // Component Memoization Tests
    // --------------------------------------------------------------------------
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert
            expect(url_input_1.default.$$typeof).toBeDefined();
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases Tests
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle very long URLs', async () => {
            // Arrange
            const props = createUrlInputProps();
            const longUrl = `https://example.com/${'a'.repeat(1000)}`;
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, longUrl);
            // Assert
            expect(input).toHaveValue(longUrl);
        });
        it('should handle URLs with unicode characters', async () => {
            // Arrange
            const props = createUrlInputProps();
            const unicodeUrl = 'https://example.com/路径/测试';
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, unicodeUrl);
            // Assert
            expect(input).toHaveValue(unicodeUrl);
        });
        it('should handle rapid typing', async () => {
            // Arrange
            const props = createUrlInputProps();
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://rapid.com', { delay: 1 });
            // Assert
            expect(input).toHaveValue('https://rapid.com');
        });
        it('should handle keyboard enter to trigger run', async () => {
            // Arrange - Note: This tests if the button can be activated via keyboard
            const onRun = vi.fn();
            const props = createUrlInputProps({ onRun });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://enter.com');
            // Focus button and press enter
            const button = react_1.screen.getByRole('button', { name: /run/i });
            button.focus();
            await user_event_1.default.keyboard('{Enter}');
            // Assert
            expect(onRun).toHaveBeenCalledWith('https://enter.com');
        });
        it('should handle empty URL submission', async () => {
            // Arrange
            const onRun = vi.fn();
            const props = createUrlInputProps({ onRun });
            // Act
            (0, react_1.render)(<url_input_1.default {...props}/>);
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should call with empty string
            expect(onRun).toHaveBeenCalledWith('');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUFrRTtBQUNsRSw0REFBbUQ7QUFDbkQsZ0RBQXVDO0FBRXZDLHdCQUF3QjtBQUN4QixFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLDBCQUEwQjtDQUNuRCxDQUFDLENBQUMsQ0FBQTtBQUVILCtFQUErRTtBQUMvRSwyQkFBMkI7QUFDM0IsK0VBQStFO0FBRS9FLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRiw4Q0FBOEM7SUFDOUMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFlBQXFELEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RixTQUFTLEVBQUUsS0FBSztRQUNoQixLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNkLEdBQUcsU0FBUztLQUNiLENBQUMsQ0FBQTtJQUVGLDZFQUE2RTtJQUM3RSxrQkFBa0I7SUFDbEIsNkVBQTZFO0lBQzdFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFFbkMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsbUJBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxp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QTtZQUMvQixNQUFNLG9CQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUVuRSx5Q0FBeUM7WUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3hDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgVXJsSW5wdXQgZnJvbSAnLi9iYXNlL3VybC1pbnB1dCdcblxuLy8gTW9jayBkb2MgbGluayBjb250ZXh0XG52aS5tb2NrKCdAL2NvbnRleHQvaTE4bicsICgpID0+ICh7XG4gIHVzZURvY0xpbms6ICgpID0+ICgpID0+ICdodHRwczovL2RvY3MuZXhhbXBsZS5jb20nLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFVybElucHV0IENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnVXJsSW5wdXQnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIEhlbHBlciB0byBjcmVhdGUgZGVmYXVsdCBwcm9wcyBmb3IgVXJsSW5wdXRcbiAgY29uc3QgY3JlYXRlVXJsSW5wdXRQcm9wcyA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGFyYW1ldGVyczx0eXBlb2YgVXJsSW5wdXQ+WzBdPiA9IHt9KSA9PiAoe1xuICAgIGlzUnVubmluZzogZmFsc2UsXG4gICAgb25SdW46IHZpLmZuKCksXG4gICAgLi4ub3ZlcnJpZGVzLFxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVVybElucHV0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXJsSW5wdXQgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaW5wdXQgd2l0aCBwbGFjZWhvbGRlciBmcm9tIGRvY0xpbmsnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVVybElucHV0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXJsSW5wdXQgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgZXhwZWN0KGlucHV0KS50b0hhdmVBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ2h0dHBzOi8vZG9jcy5leGFtcGxlLmNvbScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHJ1biBidXR0b24gd2l0aCBjb3JyZWN0IHRleHQgd2hlbiBub3QgcnVubmluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlVXJsSW5wdXRQcm9wcyh7IGlzUnVubmluZzogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVybElucHV0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJ1dHRvbiB3aXRob3V0IHRleHQgd2hlbiBydW5uaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVVcmxJbnB1dFByb3BzKHsgaXNSdW5uaW5nOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBmaW5kIGJ1dHRvbiBieSBkYXRhLXRlc3RpZCB3aGVuIGluIGxvYWRpbmcgc3RhdGVcbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgndXJsLWlucHV0LXJ1bi1idXR0b24nKVxuICAgICAgZXhwZWN0KHJ1bkJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gQnV0dG9uIHRleHQgc2hvdWxkIGJlIGVtcHR5IHdoZW4gcnVubmluZ1xuICAgICAgZXhwZWN0KHJ1bkJ1dHRvbikubm90LnRvSGF2ZVRleHRDb250ZW50KC9ydW4vaSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgc3RhdGUgb24gYnV0dG9uIHdoZW4gcnVubmluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uUnVuID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVVcmxJbnB1dFByb3BzKHsgaXNSdW5uaW5nOiB0cnVlLCBvblJ1biB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXJsSW5wdXQgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gZmluZCBidXR0b24gYnkgZGF0YS10ZXN0aWQgd2hlbiBpbiBsb2FkaW5nIHN0YXRlXG4gICAgICBjb25zdCBydW5CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3VybC1pbnB1dC1ydW4tYnV0dG9uJylcbiAgICAgIGV4cGVjdChydW5CdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gVmVyaWZ5IGJ1dHRvbiBpcyBlbXB0eSAobG9hZGluZyBzdGF0ZSByZW1vdmVzIHRleHQpXG4gICAgICBleHBlY3QocnVuQnV0dG9uKS5ub3QudG9IYXZlVGV4dENvbnRlbnQoL3J1bi9pKVxuXG4gICAgICAvLyBWZXJpZnkgY2xpY2tpbmcgZG9lc24ndCB0cmlnZ2VyIG9uUnVuIHdoZW4gbG9hZGluZ1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJ1bkJ1dHRvbilcbiAgICAgIGV4cGVjdChvblJ1bikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnB1dCBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnB1dCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBVUkwgdmFsdWUgd2hlbiB1c2VyIHR5cGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVVcmxJbnB1dFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVybElucHV0IHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3Rlc3QuY29tJylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCdodHRwczovL3Rlc3QuY29tJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgVVJMIGlucHV0IGNsZWFyaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVVcmxJbnB1dFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVybElucHV0IHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3Rlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGVhcihpbnB1dClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gVVJMJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVVcmxJbnB1dFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVybElucHV0IHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tL3BhdGg/cXVlcnk9dmFsdWUmZm9vPWJhcicpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGlucHV0KS50b0hhdmVWYWx1ZSgnaHR0cHM6Ly9leGFtcGxlLmNvbS9wYXRoP3F1ZXJ5PXZhbHVlJmZvbz1iYXInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQnV0dG9uIENsaWNrIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdCdXR0b24gQ2xpY2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uUnVuIHdpdGggVVJMIHdoZW4gYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblJ1biA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlVXJsSW5wdXRQcm9wcyh7IG9uUnVuIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9ydW4tdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvblJ1bikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2h0dHBzOi8vcnVuLXRlc3QuY29tJylcbiAgICAgIGV4cGVjdChvblJ1bikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblJ1biB3aXRoIGVtcHR5IHN0cmluZyBpZiBubyBVUkwgZW50ZXJlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uUnVuID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVVcmxJbnB1dFByb3BzKHsgb25SdW4gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVybElucHV0IHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUnVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvblJ1biB3aGVuIGlzUnVubmluZyBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25SdW4gPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVVybElucHV0UHJvcHMoeyBvblJ1biwgaXNSdW5uaW5nOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgcnVuQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCd1cmwtaW5wdXQtcnVuLWJ1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2socnVuQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvblJ1bikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uUnVuIHdoZW4gYWxyZWFkeSBydW5uaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25SdW4gPSB2aS5mbigpXG5cbiAgICAgIC8vIEZpcnN0IHJlbmRlciB3aXRoIGlzUnVubmluZz1mYWxzZSwgdHlwZSBVUkwsIHRoZW4gcmVyZW5kZXIgd2l0aCBpc1J1bm5pbmc9dHJ1ZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxVcmxJbnB1dCBpc1J1bm5pbmc9e2ZhbHNlfSBvblJ1bj17b25SdW59IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly90ZXN0LmNvbScpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggaXNSdW5uaW5nPXRydWUgdG8gc2ltdWxhdGUgYSBydW5uaW5nIHN0YXRlXG4gICAgICByZXJlbmRlcig8VXJsSW5wdXQgaXNSdW5uaW5nPXt0cnVlfSBvblJ1bj17b25SdW59IC8+KVxuXG4gICAgICAvLyBGaW5kIGFuZCBjbGljayB0aGUgYnV0dG9uIGJ5IGRhdGEtdGVzdGlkIChsb2FkaW5nIHN0YXRlIGhhcyBubyB0ZXh0KVxuICAgICAgY29uc3QgcnVuQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCd1cmwtaW5wdXQtcnVuLWJ1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2socnVuQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBvblJ1biBzaG91bGQgbm90IGJlIGNhbGxlZCBkdWUgdG8gZWFybHkgcmV0dXJuIGF0IGxpbmUgMjhcbiAgICAgIGV4cGVjdChvblJ1bikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXZlbnQgbXVsdGlwbGUgY2xpY2tzIHdoZW4gYWxyZWFkeSBydW5uaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25SdW4gPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVVybElucHV0UHJvcHMoeyBvblJ1biwgaXNSdW5uaW5nOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgcnVuQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCd1cmwtaW5wdXQtcnVuLWJ1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2socnVuQnV0dG9uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJ1bkJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhydW5CdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUnVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXNwb25kIHRvIGlzUnVubmluZyBwcm9wIGNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlVXJsSW5wdXRQcm9wcyh7IGlzUnVubmluZzogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFVybElucHV0IHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2hhbmdlIGlzUnVubmluZyB0byB0cnVlXG4gICAgICByZXJlbmRlcig8VXJsSW5wdXQgey4uLnByb3BzfSBpc1J1bm5pbmc9e3RydWV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBmaW5kIGJ1dHRvbiBieSBkYXRhLXRlc3RpZCBhbmQgdmVyaWZ5IGl0J3Mgbm93IGluIGxvYWRpbmcgc3RhdGVcbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgndXJsLWlucHV0LXJ1bi1idXR0b24nKVxuICAgICAgZXhwZWN0KHJ1bkJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gV2hlbiBsb2FkaW5nLCB0aGUgYnV0dG9uIHRleHQgc2hvdWxkIGJlIGVtcHR5XG4gICAgICBleHBlY3QocnVuQnV0dG9uKS5ub3QudG9IYXZlVGV4dENvbnRlbnQoL3J1bi9pKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdXBkYXRlZCBvblJ1biBjYWxsYmFjayBhZnRlciBwcm9wIGNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uUnVuMSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uUnVuMiA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFVybElucHV0IGlzUnVubmluZz17ZmFsc2V9IG9uUnVuPXtvblJ1bjF9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9maXJzdC5jb20nKVxuXG4gICAgICAvLyBDaGFuZ2Ugb25SdW4gY2FsbGJhY2tcbiAgICAgIHJlcmVuZGVyKDxVcmxJbnB1dCBpc1J1bm5pbmc9e2ZhbHNlfSBvblJ1bj17b25SdW4yfSAvPilcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gbmV3IGNhbGxiYWNrIHNob3VsZCBiZSBjYWxsZWRcbiAgICAgIGV4cGVjdChvblJ1bjEpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvblJ1bjIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdodHRwczovL2ZpcnN0LmNvbScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBtZW1vaXplZCBoYW5kbGVVcmxDaGFuZ2UgY2FsbGJhY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVVybElucHV0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8VXJsSW5wdXQgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2EnKVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdiJylcblxuICAgICAgLy8gQXNzZXJ0IC0gaW5wdXQgc2hvdWxkIHdvcmsgY29ycmVjdGx5IGFjcm9zcyByZXJlbmRlcnNcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ2FiJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBVUkwgc3RhdGUgYWNyb3NzIHJlcmVuZGVycycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlVXJsSW5wdXRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9zdGFibGUuY29tJylcblxuICAgICAgLy8gUmVyZW5kZXJcbiAgICAgIHJlcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBVUkwgc2hvdWxkIGJlIG1haW50YWluZWRcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ2h0dHBzOi8vc3RhYmxlLmNvbScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoVXJsSW5wdXQuJCR0eXBlb2YpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIFVSTHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVVybElucHV0UHJvcHMoKVxuICAgICAgY29uc3QgbG9uZ1VybCA9IGBodHRwczovL2V4YW1wbGUuY29tLyR7J2EnLnJlcGVhdCgxMDAwKX1gXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCBsb25nVXJsKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUobG9uZ1VybClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgVVJMcyB3aXRoIHVuaWNvZGUgY2hhcmFjdGVycycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlVXJsSW5wdXRQcm9wcygpXG4gICAgICBjb25zdCB1bmljb2RlVXJsID0gJ2h0dHBzOi8vZXhhbXBsZS5jb20v6Lev5b6EL+a1i+ivlSdcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVybElucHV0IHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsIHVuaWNvZGVVcmwpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGlucHV0KS50b0hhdmVWYWx1ZSh1bmljb2RlVXJsKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCB0eXBpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVVybElucHV0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXJsSW5wdXQgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vcmFwaWQuY29tJywgeyBkZWxheTogMSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ2h0dHBzOi8vcmFwaWQuY29tJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUga2V5Ym9hcmQgZW50ZXIgdG8gdHJpZ2dlciBydW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gTm90ZTogVGhpcyB0ZXN0cyBpZiB0aGUgYnV0dG9uIGNhbiBiZSBhY3RpdmF0ZWQgdmlhIGtleWJvYXJkXG4gICAgICBjb25zdCBvblJ1biA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlVXJsSW5wdXRQcm9wcyh7IG9uUnVuIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcmxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9lbnRlci5jb20nKVxuXG4gICAgICAvLyBGb2N1cyBidXR0b24gYW5kIHByZXNzIGVudGVyXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KVxuICAgICAgYnV0dG9uLmZvY3VzKClcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5rZXlib2FyZCgne0VudGVyfScpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUnVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnaHR0cHM6Ly9lbnRlci5jb20nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBVUkwgc3VibWlzc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uUnVuID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVVcmxJbnB1dFByb3BzKHsgb25SdW4gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVybElucHV0IHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBjYWxsIHdpdGggZW1wdHkgc3RyaW5nXG4gICAgICBleHBlY3Qob25SdW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19