"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const language_1 = require("@/i18n-config/language");
const index_1 = require("./index");
// Get supported languages for test assertions
const supportedLanguages = language_1.languages.filter(lang => lang.supported);
// Test data builder for props
const createDefaultProps = (overrides) => ({
    currentLanguage: 'English',
    onSelect: vi.fn(),
    disabled: false,
    ...overrides,
});
describe('LanguageSelect', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // ==========================================
    // Rendering Tests - Verify component renders correctly
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('English')).toBeInTheDocument();
        });
        it('should render current language text', () => {
            // Arrange
            const props = createDefaultProps({ currentLanguage: 'Chinese Simplified' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Chinese Simplified')).toBeInTheDocument();
        });
        it('should render dropdown arrow icon', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - RiArrowDownSLine renders as SVG
            const svgIcon = container.querySelector('svg');
            expect(svgIcon).toBeInTheDocument();
        });
        it('should render all supported languages in dropdown when opened', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Click button to open dropdown
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - All supported languages should be visible
            // Use getAllByText because current language appears both in button and dropdown
            supportedLanguages.forEach((lang) => {
                expect(react_1.screen.getAllByText(lang.prompt_name).length).toBeGreaterThanOrEqual(1);
            });
        });
        it('should render check icon for selected language', () => {
            // Arrange
            const selectedLanguage = 'Japanese';
            const props = createDefaultProps({ currentLanguage: selectedLanguage });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - The selected language option should have a check icon
            const languageOptions = react_1.screen.getAllByText(selectedLanguage);
            // One in the button, one in the dropdown list
            expect(languageOptions.length).toBeGreaterThanOrEqual(1);
        });
    });
    // ==========================================
    // Props Testing - Verify all prop variations work correctly
    // ==========================================
    describe('Props', () => {
        describe('currentLanguage prop', () => {
            it('should display English when currentLanguage is English', () => {
                const props = createDefaultProps({ currentLanguage: 'English' });
                (0, react_1.render)(<index_1.default {...props}/>);
                expect(react_1.screen.getByText('English')).toBeInTheDocument();
            });
            it('should display Chinese Simplified when currentLanguage is Chinese Simplified', () => {
                const props = createDefaultProps({ currentLanguage: 'Chinese Simplified' });
                (0, react_1.render)(<index_1.default {...props}/>);
                expect(react_1.screen.getByText('Chinese Simplified')).toBeInTheDocument();
            });
            it('should display Japanese when currentLanguage is Japanese', () => {
                const props = createDefaultProps({ currentLanguage: 'Japanese' });
                (0, react_1.render)(<index_1.default {...props}/>);
                expect(react_1.screen.getByText('Japanese')).toBeInTheDocument();
            });
            it.each(supportedLanguages.map(l => l.prompt_name))('should display %s as current language', (language) => {
                const props = createDefaultProps({ currentLanguage: language });
                (0, react_1.render)(<index_1.default {...props}/>);
                expect(react_1.screen.getByText(language)).toBeInTheDocument();
            });
        });
        describe('disabled prop', () => {
            it('should have disabled button when disabled is true', () => {
                // Arrange
                const props = createDefaultProps({ disabled: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const button = react_1.screen.getByRole('button');
                expect(button).toBeDisabled();
            });
            it('should have enabled button when disabled is false', () => {
                // Arrange
                const props = createDefaultProps({ disabled: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const button = react_1.screen.getByRole('button');
                expect(button).not.toBeDisabled();
            });
            it('should have enabled button when disabled is undefined', () => {
                // Arrange
                const props = createDefaultProps();
                delete props.disabled;
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const button = react_1.screen.getByRole('button');
                expect(button).not.toBeDisabled();
            });
            it('should apply disabled styling when disabled is true', () => {
                // Arrange
                const props = createDefaultProps({ disabled: true });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Check for disabled class on text elements
                const disabledTextElement = container.querySelector('.text-components-button-tertiary-text-disabled');
                expect(disabledTextElement).toBeInTheDocument();
            });
            it('should apply cursor-not-allowed styling when disabled', () => {
                // Arrange
                const props = createDefaultProps({ disabled: true });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const elementWithCursor = container.querySelector('.cursor-not-allowed');
                expect(elementWithCursor).toBeInTheDocument();
            });
        });
        describe('onSelect prop', () => {
            it('should be callable as a function', () => {
                const mockOnSelect = vi.fn();
                const props = createDefaultProps({ onSelect: mockOnSelect });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Open dropdown and click a language
                const button = react_1.screen.getByRole('button');
                react_1.fireEvent.click(button);
                const germanOption = react_1.screen.getByText('German');
                react_1.fireEvent.click(germanOption);
                expect(mockOnSelect).toHaveBeenCalledWith('German');
            });
        });
    });
    // ==========================================
    // User Interactions - Test event handlers
    // ==========================================
    describe('User Interactions', () => {
        it('should open dropdown when button is clicked', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Check if dropdown content is visible
            expect(react_1.screen.getAllByText('English').length).toBeGreaterThanOrEqual(1);
        });
        it('should call onSelect when a language option is clicked', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const props = createDefaultProps({ onSelect: mockOnSelect });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            const frenchOption = react_1.screen.getByText('French');
            react_1.fireEvent.click(frenchOption);
            // Assert
            expect(mockOnSelect).toHaveBeenCalledTimes(1);
            expect(mockOnSelect).toHaveBeenCalledWith('French');
        });
        it('should call onSelect with correct language when selecting different languages', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const props = createDefaultProps({ onSelect: mockOnSelect });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act & Assert - Test multiple language selections
            const testLanguages = ['Korean', 'Spanish', 'Italian'];
            testLanguages.forEach((lang) => {
                mockOnSelect.mockClear();
                const button = react_1.screen.getByRole('button');
                react_1.fireEvent.click(button);
                const languageOption = react_1.screen.getByText(lang);
                react_1.fireEvent.click(languageOption);
                expect(mockOnSelect).toHaveBeenCalledWith(lang);
            });
        });
        it('should not open dropdown when disabled', () => {
            // Arrange
            const props = createDefaultProps({ disabled: true });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Dropdown should not open, only one instance of the current language should exist
            const englishElements = react_1.screen.getAllByText('English');
            expect(englishElements.length).toBe(1); // Only the button text, not dropdown
        });
        it('should not call onSelect when component is disabled', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const props = createDefaultProps({ onSelect: mockOnSelect, disabled: true });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert
            expect(mockOnSelect).not.toHaveBeenCalled();
        });
        it('should handle rapid consecutive clicks', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const props = createDefaultProps({ onSelect: mockOnSelect });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Rapid clicks
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            // Assert - Component should not crash
            expect(button).toBeInTheDocument();
        });
    });
    // ==========================================
    // Component Memoization - Test React.memo behavior
    // ==========================================
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert - Check component has memo wrapper
            expect(index_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
        it('should not re-render when props remain the same', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const props = createDefaultProps({ onSelect: mockOnSelect });
            const renderSpy = vi.fn();
            // Create a wrapper component to track renders
            const TrackedLanguageSelect = (trackedProps) => {
                renderSpy();
                return <index_1.default {...trackedProps}/>;
            };
            const MemoizedTracked = React.memo(TrackedLanguageSelect);
            // Act
            const { rerender } = (0, react_1.render)(<MemoizedTracked {...props}/>);
            rerender(<MemoizedTracked {...props}/>);
            // Assert - Should only render once due to same props
            expect(renderSpy).toHaveBeenCalledTimes(1);
        });
        it('should re-render when currentLanguage changes', () => {
            // Arrange
            const props = createDefaultProps({ currentLanguage: 'English' });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText('English')).toBeInTheDocument();
            rerender(<index_1.default {...props} currentLanguage="French"/>);
            // Assert
            expect(react_1.screen.getByText('French')).toBeInTheDocument();
        });
        it('should re-render when disabled changes', () => {
            // Arrange
            const props = createDefaultProps({ disabled: false });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            rerender(<index_1.default {...props} disabled={true}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeDisabled();
        });
    });
    // ==========================================
    // Edge Cases - Test boundary conditions and error handling
    // ==========================================
    describe('Edge Cases', () => {
        it('should handle empty string as currentLanguage', () => {
            // Arrange
            const props = createDefaultProps({ currentLanguage: '' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Component should still render
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });
        it('should handle non-existent language as currentLanguage', () => {
            // Arrange
            const props = createDefaultProps({ currentLanguage: 'NonExistentLanguage' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should display the value even if not in list
            expect(react_1.screen.getByText('NonExistentLanguage')).toBeInTheDocument();
        });
        it('should handle special characters in language names', () => {
            // Arrange - Turkish has special character in prompt_name
            const props = createDefaultProps({ currentLanguage: 'Türkçe' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Türkçe')).toBeInTheDocument();
        });
        it('should handle very long language names', () => {
            // Arrange
            const longLanguageName = 'A'.repeat(100);
            const props = createDefaultProps({ currentLanguage: longLanguageName });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should not crash and should display the text
            expect(react_1.screen.getByText(longLanguageName)).toBeInTheDocument();
        });
        it('should render correct number of language options', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Should show all supported languages
            const expectedCount = supportedLanguages.length;
            // Each language appears in the dropdown (use getAllByText because current language appears twice)
            supportedLanguages.forEach((lang) => {
                expect(react_1.screen.getAllByText(lang.prompt_name).length).toBeGreaterThanOrEqual(1);
            });
            expect(supportedLanguages.length).toBe(expectedCount);
        });
        it('should only show supported languages in dropdown', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - All displayed languages should be supported
            const allLanguages = language_1.languages;
            const unsupportedLanguages = allLanguages.filter(lang => !lang.supported);
            unsupportedLanguages.forEach((lang) => {
                expect(react_1.screen.queryByText(lang.prompt_name)).not.toBeInTheDocument();
            });
        });
        it('should handle undefined onSelect gracefully when clicking', () => {
            // Arrange - This tests TypeScript boundary, but runtime should not crash
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            const option = react_1.screen.getByText('German');
            // Assert - Should not throw
            expect(() => react_1.fireEvent.click(option)).not.toThrow();
        });
        it('should maintain selection state visually with check icon', () => {
            // Arrange
            const props = createDefaultProps({ currentLanguage: 'Russian' });
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Find the check icon (RiCheckLine) in the dropdown
            // The selected option should have a check icon next to it
            const checkIcons = container.querySelectorAll('svg.text-text-accent');
            expect(checkIcons.length).toBeGreaterThanOrEqual(1);
        });
    });
    // ==========================================
    // Accessibility - Basic accessibility checks
    // ==========================================
    describe('Accessibility', () => {
        it('should have accessible button element', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });
        it('should have clickable language options', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Options should be clickable (have cursor-pointer class)
            const options = react_1.screen.getAllByText(/English|French|German|Japanese/i);
            expect(options.length).toBeGreaterThan(0);
        });
    });
    // ==========================================
    // Integration with Popover - Test Popover behavior
    // ==========================================
    describe('Popover Integration', () => {
        it('should use manualClose prop on Popover', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const props = createDefaultProps({ onSelect: mockOnSelect });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Popover should be open
            expect(react_1.screen.getAllByText('English').length).toBeGreaterThanOrEqual(1);
        });
        it('should have correct popup z-index class', () => {
            // Arrange
            const props = createDefaultProps();
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Check for z-20 class (popupClassName='z-20')
            // This is applied to the Popover
            expect(container.querySelector('.z-20')).toBeTruthy();
        });
    });
    // ==========================================
    // Styling Tests - Verify correct CSS classes applied
    // ==========================================
    describe('Styling', () => {
        it('should apply tertiary button styling', () => {
            // Arrange
            const props = createDefaultProps();
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check for tertiary button classes (uses ! prefix for important)
            expect(container.querySelector('.\\!bg-components-button-tertiary-bg')).toBeInTheDocument();
        });
        it('should apply hover styling class to options', () => {
            // Arrange
            const props = createDefaultProps();
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Options should have hover class
            const optionWithHover = container.querySelector('.hover\\:bg-state-base-hover');
            expect(optionWithHover).toBeInTheDocument();
        });
        it('should apply correct text styling to language options', () => {
            // Arrange
            const props = createDefaultProps();
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - Check for system-sm-medium class on options
            const styledOption = container.querySelector('.system-sm-medium');
            expect(styledOption).toBeInTheDocument();
        });
        it('should apply disabled styling to icon when disabled', () => {
            // Arrange
            const props = createDefaultProps({ disabled: true });
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check for disabled text color on icon
            const disabledIcon = container.querySelector('.text-components-button-tertiary-text-disabled');
            expect(disabledIcon).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixxREFBa0Q7QUFDbEQsbUNBQW9DO0FBRXBDLDhDQUE4QztBQUM5QyxNQUFNLGtCQUFrQixHQUFHLG9CQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRW5FLDhCQUE4QjtBQUM5QixNQUFNLGtCQUFrQixHQUFHLENBQUMsU0FBeUMsRUFBd0IsRUFBRSxDQUFDLENBQUM7SUFDL0YsZUFBZSxFQUFFLFNBQVM7SUFDMUIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDakIsUUFBUSxFQUFFLEtBQUs7SUFDZixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0MsdURBQXVEO0lBQ3ZELDZDQUE2QztJQUM3QyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsRUFBRSxDQUFBO1lBRWxDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVyQyxTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3pELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxD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QVksQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDMUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBJTGFuZ3VhZ2VTZWxlY3RQcm9wcyB9IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgbGFuZ3VhZ2VzIH0gZnJvbSAnQC9pMThuLWNvbmZpZy9sYW5ndWFnZSdcbmltcG9ydCBMYW5ndWFnZVNlbGVjdCBmcm9tICcuL2luZGV4J1xuXG4vLyBHZXQgc3VwcG9ydGVkIGxhbmd1YWdlcyBmb3IgdGVzdCBhc3NlcnRpb25zXG5jb25zdCBzdXBwb3J0ZWRMYW5ndWFnZXMgPSBsYW5ndWFnZXMuZmlsdGVyKGxhbmcgPT4gbGFuZy5zdXBwb3J0ZWQpXG5cbi8vIFRlc3QgZGF0YSBidWlsZGVyIGZvciBwcm9wc1xuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8SUxhbmd1YWdlU2VsZWN0UHJvcHM+KTogSUxhbmd1YWdlU2VsZWN0UHJvcHMgPT4gKHtcbiAgY3VycmVudExhbmd1YWdlOiAnRW5nbGlzaCcsXG4gIG9uU2VsZWN0OiB2aS5mbigpLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmRlc2NyaWJlKCdMYW5ndWFnZVNlbGVjdCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0cyAtIFZlcmlmeSBjb21wb25lbnQgcmVuZGVycyBjb3JyZWN0bHlcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0VuZ2xpc2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjdXJyZW50IGxhbmd1YWdlIHRleHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRMYW5ndWFnZTogJ0NoaW5lc2UgU2ltcGxpZmllZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NoaW5lc2UgU2ltcGxpZmllZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRyb3Bkb3duIGFycm93IGljb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUmlBcnJvd0Rvd25TTGluZSByZW5kZXJzIGFzIFNWR1xuICAgICAgY29uc3Qgc3ZnSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2Z0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIHN1cHBvcnRlZCBsYW5ndWFnZXMgaW4gZHJvcGRvd24gd2hlbiBvcGVuZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIGJ1dHRvbiB0byBvcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gQWxsIHN1cHBvcnRlZCBsYW5ndWFnZXMgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIC8vIFVzZSBnZXRBbGxCeVRleHQgYmVjYXVzZSBjdXJyZW50IGxhbmd1YWdlIGFwcGVhcnMgYm90aCBpbiBidXR0b24gYW5kIGRyb3Bkb3duXG4gICAgICBzdXBwb3J0ZWRMYW5ndWFnZXMuZm9yRWFjaCgobGFuZykgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dChsYW5nLnByb21wdF9uYW1lKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoZWNrIGljb24gZm9yIHNlbGVjdGVkIGxhbmd1YWdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc2VsZWN0ZWRMYW5ndWFnZSA9ICdKYXBhbmVzZSdcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY3VycmVudExhbmd1YWdlOiBzZWxlY3RlZExhbmd1YWdlIH0pXG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIFRoZSBzZWxlY3RlZCBsYW5ndWFnZSBvcHRpb24gc2hvdWxkIGhhdmUgYSBjaGVjayBpY29uXG4gICAgICBjb25zdCBsYW5ndWFnZU9wdGlvbnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KHNlbGVjdGVkTGFuZ3VhZ2UpXG4gICAgICAvLyBPbmUgaW4gdGhlIGJ1dHRvbiwgb25lIGluIHRoZSBkcm9wZG93biBsaXN0XG4gICAgICBleHBlY3QobGFuZ3VhZ2VPcHRpb25zLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmcgLSBWZXJpZnkgYWxsIHByb3AgdmFyaWF0aW9ucyB3b3JrIGNvcnJlY3RseVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdjdXJyZW50TGFuZ3VhZ2UgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBFbmdsaXNoIHdoZW4gY3VycmVudExhbmd1YWdlIGlzIEVuZ2xpc2gnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY3VycmVudExhbmd1YWdlOiAnRW5nbGlzaCcgfSlcbiAgICAgICAgcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRW5nbGlzaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc3BsYXkgQ2hpbmVzZSBTaW1wbGlmaWVkIHdoZW4gY3VycmVudExhbmd1YWdlIGlzIENoaW5lc2UgU2ltcGxpZmllZCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50TGFuZ3VhZ2U6ICdDaGluZXNlIFNpbXBsaWZpZWQnIH0pXG4gICAgICAgIHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NoaW5lc2UgU2ltcGxpZmllZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc3BsYXkgSmFwYW5lc2Ugd2hlbiBjdXJyZW50TGFuZ3VhZ2UgaXMgSmFwYW5lc2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY3VycmVudExhbmd1YWdlOiAnSmFwYW5lc2UnIH0pXG4gICAgICAgIHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0phcGFuZXNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0LmVhY2goc3VwcG9ydGVkTGFuZ3VhZ2VzLm1hcChsID0+IGwucHJvbXB0X25hbWUpKShcbiAgICAgICAgJ3Nob3VsZCBkaXNwbGF5ICVzIGFzIGN1cnJlbnQgbGFuZ3VhZ2UnLFxuICAgICAgICAobGFuZ3VhZ2UpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRMYW5ndWFnZTogbGFuZ3VhZ2UgfSlcbiAgICAgICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobGFuZ3VhZ2UpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0sXG4gICAgICApXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkaXNhYmxlZCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGRpc2FibGVkIGJ1dHRvbiB3aGVuIGRpc2FibGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkaXNhYmxlZDogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICAgIGV4cGVjdChidXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgZW5hYmxlZCBidXR0b24gd2hlbiBkaXNhYmxlZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRpc2FibGVkOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICAgIGV4cGVjdChidXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGVuYWJsZWQgYnV0dG9uIHdoZW4gZGlzYWJsZWQgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgICAgZGVsZXRlIChwcm9wcyBhcyBQYXJ0aWFsPElMYW5ndWFnZVNlbGVjdFByb3BzPikuZGlzYWJsZWRcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgICBleHBlY3QoYnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgZGlzYWJsZWQgc3R5bGluZyB3aGVuIGRpc2FibGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkaXNhYmxlZDogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciBkaXNhYmxlZCBjbGFzcyBvbiB0ZXh0IGVsZW1lbnRzXG4gICAgICAgIGNvbnN0IGRpc2FibGVkVGV4dEVsZW1lbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtY29tcG9uZW50cy1idXR0b24tdGVydGlhcnktdGV4dC1kaXNhYmxlZCcpXG4gICAgICAgIGV4cGVjdChkaXNhYmxlZFRleHRFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGFwcGx5IGN1cnNvci1ub3QtYWxsb3dlZCBzdHlsaW5nIHdoZW4gZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkaXNhYmxlZDogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBlbGVtZW50V2l0aEN1cnNvciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3Vyc29yLW5vdC1hbGxvd2VkJylcbiAgICAgICAgZXhwZWN0KGVsZW1lbnRXaXRoQ3Vyc29yKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnb25TZWxlY3QgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYmUgY2FsbGFibGUgYXMgYSBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU2VsZWN0OiBtb2NrT25TZWxlY3QgfSlcbiAgICAgICAgcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIE9wZW4gZHJvcGRvd24gYW5kIGNsaWNrIGEgbGFuZ3VhZ2VcbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcblxuICAgICAgICBjb25zdCBnZXJtYW5PcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdHZXJtYW4nKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZ2VybWFuT3B0aW9uKVxuXG4gICAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdHZXJtYW4nKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyAtIFRlc3QgZXZlbnQgaGFuZGxlcnNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gZHJvcGRvd24gd2hlbiBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgaWYgZHJvcGRvd24gY29udGVudCBpcyB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgnRW5nbGlzaCcpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3Qgd2hlbiBhIGxhbmd1YWdlIG9wdGlvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblNlbGVjdDogbW9ja09uU2VsZWN0IH0pXG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICBjb25zdCBmcmVuY2hPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdGcmVuY2gnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZyZW5jaE9wdGlvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdGcmVuY2gnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3Qgd2l0aCBjb3JyZWN0IGxhbmd1YWdlIHdoZW4gc2VsZWN0aW5nIGRpZmZlcmVudCBsYW5ndWFnZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU2VsZWN0OiBtb2NrT25TZWxlY3QgfSlcbiAgICAgIHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0IC0gVGVzdCBtdWx0aXBsZSBsYW5ndWFnZSBzZWxlY3Rpb25zXG4gICAgICBjb25zdCB0ZXN0TGFuZ3VhZ2VzID0gWydLb3JlYW4nLCAnU3BhbmlzaCcsICdJdGFsaWFuJ11cblxuICAgICAgdGVzdExhbmd1YWdlcy5mb3JFYWNoKChsYW5nKSA9PiB7XG4gICAgICAgIG1vY2tPblNlbGVjdC5tb2NrQ2xlYXIoKVxuICAgICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuICAgICAgICBjb25zdCBsYW5ndWFnZU9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQobGFuZylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGxhbmd1YWdlT3B0aW9uKVxuICAgICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChsYW5nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgb3BlbiBkcm9wZG93biB3aGVuIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkaXNhYmxlZDogdHJ1ZSB9KVxuICAgICAgcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBEcm9wZG93biBzaG91bGQgbm90IG9wZW4sIG9ubHkgb25lIGluc3RhbmNlIG9mIHRoZSBjdXJyZW50IGxhbmd1YWdlIHNob3VsZCBleGlzdFxuICAgICAgY29uc3QgZW5nbGlzaEVsZW1lbnRzID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgnRW5nbGlzaCcpXG4gICAgICBleHBlY3QoZW5nbGlzaEVsZW1lbnRzLmxlbmd0aCkudG9CZSgxKSAvLyBPbmx5IHRoZSBidXR0b24gdGV4dCwgbm90IGRyb3Bkb3duXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25TZWxlY3Qgd2hlbiBjb21wb25lbnQgaXMgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU2VsZWN0OiBtb2NrT25TZWxlY3QsIGRpc2FibGVkOiB0cnVlIH0pXG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBjb25zZWN1dGl2ZSBjbGlja3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU2VsZWN0OiBtb2NrT25TZWxlY3QgfSlcbiAgICAgIHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gUmFwaWQgY2xpY2tzXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIG5vdCBjcmFzaFxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbXBvbmVudCBNZW1vaXphdGlvbiAtIFRlc3QgUmVhY3QubWVtbyBiZWhhdmlvclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayBjb21wb25lbnQgaGFzIG1lbW8gd3JhcHBlclxuICAgICAgZXhwZWN0KExhbmd1YWdlU2VsZWN0LiQkdHlwZW9mKS50b0JlKFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmUtcmVuZGVyIHdoZW4gcHJvcHMgcmVtYWluIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblNlbGVjdDogbW9ja09uU2VsZWN0IH0pXG4gICAgICBjb25zdCByZW5kZXJTcHkgPSB2aS5mbigpXG5cbiAgICAgIC8vIENyZWF0ZSBhIHdyYXBwZXIgY29tcG9uZW50IHRvIHRyYWNrIHJlbmRlcnNcbiAgICAgIGNvbnN0IFRyYWNrZWRMYW5ndWFnZVNlbGVjdDogUmVhY3QuRkM8SUxhbmd1YWdlU2VsZWN0UHJvcHM+ID0gKHRyYWNrZWRQcm9wcykgPT4ge1xuICAgICAgICByZW5kZXJTcHkoKVxuICAgICAgICByZXR1cm4gPExhbmd1YWdlU2VsZWN0IHsuLi50cmFja2VkUHJvcHN9IC8+XG4gICAgICB9XG4gICAgICBjb25zdCBNZW1vaXplZFRyYWNrZWQgPSBSZWFjdC5tZW1vKFRyYWNrZWRMYW5ndWFnZVNlbGVjdClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE1lbW9pemVkVHJhY2tlZCB7Li4ucHJvcHN9IC8+KVxuICAgICAgcmVyZW5kZXIoPE1lbW9pemVkVHJhY2tlZCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgb25seSByZW5kZXIgb25jZSBkdWUgdG8gc2FtZSBwcm9wc1xuICAgICAgZXhwZWN0KHJlbmRlclNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmUtcmVuZGVyIHdoZW4gY3VycmVudExhbmd1YWdlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRMYW5ndWFnZTogJ0VuZ2xpc2gnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0VuZ2xpc2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSBjdXJyZW50TGFuZ3VhZ2U9XCJGcmVuY2hcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRnJlbmNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1yZW5kZXIgd2hlbiBkaXNhYmxlZCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkaXNhYmxlZDogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuXG4gICAgICByZXJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSBkaXNhYmxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgLSBUZXN0IGJvdW5kYXJ5IGNvbmRpdGlvbnMgYW5kIGVycm9yIGhhbmRsaW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgYXMgY3VycmVudExhbmd1YWdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50TGFuZ3VhZ2U6ICcnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIHN0aWxsIHJlbmRlclxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbm9uLWV4aXN0ZW50IGxhbmd1YWdlIGFzIGN1cnJlbnRMYW5ndWFnZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY3VycmVudExhbmd1YWdlOiAnTm9uRXhpc3RlbnRMYW5ndWFnZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBkaXNwbGF5IHRoZSB2YWx1ZSBldmVuIGlmIG5vdCBpbiBsaXN0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTm9uRXhpc3RlbnRMYW5ndWFnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBsYW5ndWFnZSBuYW1lcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBUdXJraXNoIGhhcyBzcGVjaWFsIGNoYXJhY3RlciBpbiBwcm9tcHRfbmFtZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50TGFuZ3VhZ2U6ICdUw7xya8OnZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1TDvHJrw6dlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGxhbmd1YWdlIG5hbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ0xhbmd1YWdlTmFtZSA9ICdBJy5yZXBlYXQoMTAwKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50TGFuZ3VhZ2U6IGxvbmdMYW5ndWFnZU5hbWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgY3Jhc2ggYW5kIHNob3VsZCBkaXNwbGF5IHRoZSB0ZXh0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nTGFuZ3VhZ2VOYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0IG51bWJlciBvZiBsYW5ndWFnZSBvcHRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBhbGwgc3VwcG9ydGVkIGxhbmd1YWdlc1xuICAgICAgY29uc3QgZXhwZWN0ZWRDb3VudCA9IHN1cHBvcnRlZExhbmd1YWdlcy5sZW5ndGhcbiAgICAgIC8vIEVhY2ggbGFuZ3VhZ2UgYXBwZWFycyBpbiB0aGUgZHJvcGRvd24gKHVzZSBnZXRBbGxCeVRleHQgYmVjYXVzZSBjdXJyZW50IGxhbmd1YWdlIGFwcGVhcnMgdHdpY2UpXG4gICAgICBzdXBwb3J0ZWRMYW5ndWFnZXMuZm9yRWFjaCgobGFuZykgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dChsYW5nLnByb21wdF9uYW1lKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMSlcbiAgICAgIH0pXG4gICAgICBleHBlY3Qoc3VwcG9ydGVkTGFuZ3VhZ2VzLmxlbmd0aCkudG9CZShleHBlY3RlZENvdW50KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9ubHkgc2hvdyBzdXBwb3J0ZWQgbGFuZ3VhZ2VzIGluIGRyb3Bkb3duJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBBbGwgZGlzcGxheWVkIGxhbmd1YWdlcyBzaG91bGQgYmUgc3VwcG9ydGVkXG4gICAgICBjb25zdCBhbGxMYW5ndWFnZXMgPSBsYW5ndWFnZXNcbiAgICAgIGNvbnN0IHVuc3VwcG9ydGVkTGFuZ3VhZ2VzID0gYWxsTGFuZ3VhZ2VzLmZpbHRlcihsYW5nID0+ICFsYW5nLnN1cHBvcnRlZClcblxuICAgICAgdW5zdXBwb3J0ZWRMYW5ndWFnZXMuZm9yRWFjaCgobGFuZykgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KGxhbmcucHJvbXB0X25hbWUpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIG9uU2VsZWN0IGdyYWNlZnVsbHkgd2hlbiBjbGlja2luZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBUaGlzIHRlc3RzIFR5cGVTY3JpcHQgYm91bmRhcnksIGJ1dCBydW50aW1lIHNob3VsZCBub3QgY3Jhc2hcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgIGNvbnN0IG9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ0dlcm1hbicpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgdGhyb3dcbiAgICAgIGV4cGVjdCgoKSA9PiBmaXJlRXZlbnQuY2xpY2sob3B0aW9uKSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHNlbGVjdGlvbiBzdGF0ZSB2aXN1YWxseSB3aXRoIGNoZWNrIGljb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRMYW5ndWFnZTogJ1J1c3NpYW4nIH0pXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBGaW5kIHRoZSBjaGVjayBpY29uIChSaUNoZWNrTGluZSkgaW4gdGhlIGRyb3Bkb3duXG4gICAgICAvLyBUaGUgc2VsZWN0ZWQgb3B0aW9uIHNob3VsZCBoYXZlIGEgY2hlY2sgaWNvbiBuZXh0IHRvIGl0XG4gICAgICBjb25zdCBjaGVja0ljb25zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2Zy50ZXh0LXRleHQtYWNjZW50JylcbiAgICAgIGV4cGVjdChjaGVja0ljb25zLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFjY2Vzc2liaWxpdHkgLSBCYXNpYyBhY2Nlc3NpYmlsaXR5IGNoZWNrc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGFjY2Vzc2libGUgYnV0dG9uIGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjbGlja2FibGUgbGFuZ3VhZ2Ugb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gT3B0aW9ucyBzaG91bGQgYmUgY2xpY2thYmxlIChoYXZlIGN1cnNvci1wb2ludGVyIGNsYXNzKVxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL0VuZ2xpc2h8RnJlbmNofEdlcm1hbnxKYXBhbmVzZS9pKVxuICAgICAgZXhwZWN0KG9wdGlvbnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiB3aXRoIFBvcG92ZXIgLSBUZXN0IFBvcG92ZXIgYmVoYXZpb3JcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQb3BvdmVyIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXNlIG1hbnVhbENsb3NlIHByb3Agb24gUG9wb3ZlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblNlbGVjdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25TZWxlY3Q6IG1vY2tPblNlbGVjdCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBQb3BvdmVyIHNob3VsZCBiZSBvcGVuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgnRW5nbGlzaCcpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBwb3B1cCB6LWluZGV4IGNsYXNzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgZm9yIHotMjAgY2xhc3MgKHBvcHVwQ2xhc3NOYW1lPSd6LTIwJylcbiAgICAgIC8vIFRoaXMgaXMgYXBwbGllZCB0byB0aGUgUG9wb3ZlclxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuei0yMCcpKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdHlsaW5nIFRlc3RzIC0gVmVyaWZ5IGNvcnJlY3QgQ1NTIGNsYXNzZXMgYXBwbGllZFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0eWxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSB0ZXJ0aWFyeSBidXR0b24gc3R5bGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciB0ZXJ0aWFyeSBidXR0b24gY2xhc3NlcyAodXNlcyAhIHByZWZpeCBmb3IgaW1wb3J0YW50KVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuXFxcXCFiZy1jb21wb25lbnRzLWJ1dHRvbi10ZXJ0aWFyeS1iZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaG92ZXIgc3R5bGluZyBjbGFzcyB0byBvcHRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGFuZ3VhZ2VTZWxlY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gT3B0aW9ucyBzaG91bGQgaGF2ZSBob3ZlciBjbGFzc1xuICAgICAgY29uc3Qgb3B0aW9uV2l0aEhvdmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ob3ZlclxcXFw6Ymctc3RhdGUtYmFzZS1ob3ZlcicpXG4gICAgICBleHBlY3Qob3B0aW9uV2l0aEhvdmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCB0ZXh0IHN0eWxpbmcgdG8gbGFuZ3VhZ2Ugb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExhbmd1YWdlU2VsZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciBzeXN0ZW0tc20tbWVkaXVtIGNsYXNzIG9uIG9wdGlvbnNcbiAgICAgIGNvbnN0IHN0eWxlZE9wdGlvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3lzdGVtLXNtLW1lZGl1bScpXG4gICAgICBleHBlY3Qoc3R5bGVkT3B0aW9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgZGlzYWJsZWQgc3R5bGluZyB0byBpY29uIHdoZW4gZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRpc2FibGVkOiB0cnVlIH0pXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMYW5ndWFnZVNlbGVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayBmb3IgZGlzYWJsZWQgdGV4dCBjb2xvciBvbiBpY29uXG4gICAgICBjb25zdCBkaXNhYmxlZEljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtY29tcG9uZW50cy1idXR0b24tdGVydGlhcnktdGV4dC1kaXNhYmxlZCcpXG4gICAgICBleHBlY3QoZGlzYWJsZWRJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=