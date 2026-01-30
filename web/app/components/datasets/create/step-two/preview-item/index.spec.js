"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
// Test data builder for props
const createDefaultProps = (overrides) => ({
    type: index_1.PreviewType.TEXT,
    index: 1,
    content: 'Test content',
    ...overrides,
});
const createQAProps = (overrides) => ({
    type: index_1.PreviewType.QA,
    index: 1,
    qa: {
        question: 'Test question',
        answer: 'Test answer',
    },
    ...overrides,
});
describe('PreviewItem', () => {
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
            expect(react_1.screen.getByText('Test content')).toBeInTheDocument();
        });
        it('should render with TEXT type', () => {
            // Arrange
            const props = createDefaultProps({ content: 'Sample text content' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Sample text content')).toBeInTheDocument();
        });
        it('should render with QA type', () => {
            // Arrange
            const props = createQAProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
            expect(react_1.screen.getByText('A')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test question')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test answer')).toBeInTheDocument();
        });
        it('should render sharp icon (#) with formatted index', () => {
            // Arrange
            const props = createDefaultProps({ index: 5 });
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Index should be padded to 3 digits
            expect(react_1.screen.getByText('005')).toBeInTheDocument();
            // Sharp icon SVG should exist
            const svgElements = container.querySelectorAll('svg');
            expect(svgElements.length).toBeGreaterThanOrEqual(1);
        });
        it('should render character count for TEXT type', () => {
            // Arrange
            const content = 'Hello World'; // 11 characters
            const props = createDefaultProps({ content });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Shows character count with translation key
            expect(react_1.screen.getByText(/11/)).toBeInTheDocument();
            expect(react_1.screen.getByText(/datasetCreation.stepTwo.characters/)).toBeInTheDocument();
        });
        it('should render character count for QA type', () => {
            // Arrange
            const props = createQAProps({
                qa: {
                    question: 'Hello', // 5 characters
                    answer: 'World', // 5 characters - total 10
                },
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Shows combined character count
            expect(react_1.screen.getByText(/10/)).toBeInTheDocument();
        });
        it('should render text icon SVG', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should have SVG icons
            const svgElements = container.querySelectorAll('svg');
            expect(svgElements.length).toBe(2); // Sharp icon and text icon
        });
    });
    // ==========================================
    // Props Testing - Verify all prop variations work correctly
    // ==========================================
    describe('Props', () => {
        describe('type prop', () => {
            it('should render TEXT content when type is TEXT', () => {
                // Arrange
                const props = createDefaultProps({ type: index_1.PreviewType.TEXT, content: 'Text mode content' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Text mode content')).toBeInTheDocument();
                expect(react_1.screen.queryByText('Q')).not.toBeInTheDocument();
                expect(react_1.screen.queryByText('A')).not.toBeInTheDocument();
            });
            it('should render QA content when type is QA', () => {
                // Arrange
                const props = createQAProps({
                    type: index_1.PreviewType.QA,
                    qa: { question: 'My question', answer: 'My answer' },
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Q')).toBeInTheDocument();
                expect(react_1.screen.getByText('A')).toBeInTheDocument();
                expect(react_1.screen.getByText('My question')).toBeInTheDocument();
                expect(react_1.screen.getByText('My answer')).toBeInTheDocument();
            });
            it('should use TEXT as default type when type is "text"', () => {
                // Arrange
                const props = createDefaultProps({ type: 'text', content: 'Default type content' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Default type content')).toBeInTheDocument();
            });
            it('should use QA type when type is "QA"', () => {
                // Arrange
                const props = createQAProps({ type: 'QA' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Q')).toBeInTheDocument();
                expect(react_1.screen.getByText('A')).toBeInTheDocument();
            });
        });
        describe('index prop', () => {
            it.each([
                [1, '001'],
                [5, '005'],
                [10, '010'],
                [99, '099'],
                [100, '100'],
                [999, '999'],
                [1000, '1000'],
            ])('should format index %i as %s', (index, expected) => {
                // Arrange
                const props = createDefaultProps({ index });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(expected)).toBeInTheDocument();
            });
            it('should handle index 0', () => {
                // Arrange
                const props = createDefaultProps({ index: 0 });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('000')).toBeInTheDocument();
            });
            it('should handle large index numbers', () => {
                // Arrange
                const props = createDefaultProps({ index: 12345 });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('12345')).toBeInTheDocument();
            });
        });
        describe('content prop', () => {
            it('should render content when provided', () => {
                // Arrange
                const props = createDefaultProps({ content: 'Custom content here' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Custom content here')).toBeInTheDocument();
            });
            it('should handle multiline content', () => {
                // Arrange
                const multilineContent = 'Line 1\nLine 2\nLine 3';
                const props = createDefaultProps({ content: multilineContent });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Check content is rendered (multiline text is in pre-line div)
                const contentDiv = container.querySelector('[style*="white-space: pre-line"]');
                expect(contentDiv?.textContent).toContain('Line 1');
                expect(contentDiv?.textContent).toContain('Line 2');
                expect(contentDiv?.textContent).toContain('Line 3');
            });
            it('should preserve whitespace with pre-line style', () => {
                // Arrange
                const props = createDefaultProps({ content: 'Text with  spaces' });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Check for whiteSpace: pre-line style
                const contentDiv = container.querySelector('[style*="white-space: pre-line"]');
                expect(contentDiv).toBeInTheDocument();
            });
        });
        describe('qa prop', () => {
            it('should render question and answer when qa is provided', () => {
                // Arrange
                const props = createQAProps({
                    qa: {
                        question: 'What is testing?',
                        answer: 'Testing is verification.',
                    },
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('What is testing?')).toBeInTheDocument();
                expect(react_1.screen.getByText('Testing is verification.')).toBeInTheDocument();
            });
            it('should render Q and A labels', () => {
                // Arrange
                const props = createQAProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Q')).toBeInTheDocument();
                expect(react_1.screen.getByText('A')).toBeInTheDocument();
            });
            it('should handle multiline question', () => {
                // Arrange
                const props = createQAProps({
                    qa: {
                        question: 'Question line 1\nQuestion line 2',
                        answer: 'Answer',
                    },
                });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Check content is in pre-line div
                const preLineDivs = container.querySelectorAll('[style*="white-space: pre-line"]');
                const questionDiv = Array.from(preLineDivs).find(div => div.textContent?.includes('Question line 1'));
                expect(questionDiv).toBeTruthy();
                expect(questionDiv?.textContent).toContain('Question line 2');
            });
            it('should handle multiline answer', () => {
                // Arrange
                const props = createQAProps({
                    qa: {
                        question: 'Question',
                        answer: 'Answer line 1\nAnswer line 2',
                    },
                });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Check content is in pre-line div
                const preLineDivs = container.querySelectorAll('[style*="white-space: pre-line"]');
                const answerDiv = Array.from(preLineDivs).find(div => div.textContent?.includes('Answer line 1'));
                expect(answerDiv).toBeTruthy();
                expect(answerDiv?.textContent).toContain('Answer line 2');
            });
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
            const props = createDefaultProps();
            const renderSpy = vi.fn();
            // Create a wrapper component to track renders
            const TrackedPreviewItem = (trackedProps) => {
                renderSpy();
                return <index_1.default {...trackedProps}/>;
            };
            const MemoizedTracked = React.memo(TrackedPreviewItem);
            // Act
            const { rerender } = (0, react_1.render)(<MemoizedTracked {...props}/>);
            rerender(<MemoizedTracked {...props}/>);
            // Assert - Should only render once due to same props
            expect(renderSpy).toHaveBeenCalledTimes(1);
        });
        it('should re-render when content changes', () => {
            // Arrange
            const props = createDefaultProps({ content: 'Initial content' });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText('Initial content')).toBeInTheDocument();
            rerender(<index_1.default {...props} content="Updated content"/>);
            // Assert
            expect(react_1.screen.getByText('Updated content')).toBeInTheDocument();
        });
        it('should re-render when index changes', () => {
            // Arrange
            const props = createDefaultProps({ index: 1 });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText('001')).toBeInTheDocument();
            rerender(<index_1.default {...props} index={99}/>);
            // Assert
            expect(react_1.screen.getByText('099')).toBeInTheDocument();
        });
        it('should re-render when type changes', () => {
            // Arrange
            const props = createDefaultProps({ type: index_1.PreviewType.TEXT, content: 'Text content' });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText('Text content')).toBeInTheDocument();
            expect(react_1.screen.queryByText('Q')).not.toBeInTheDocument();
            rerender(<index_1.default type={index_1.PreviewType.QA} index={1} qa={{ question: 'Q1', answer: 'A1' }}/>);
            // Assert
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
            expect(react_1.screen.getByText('A')).toBeInTheDocument();
        });
        it('should re-render when qa prop changes', () => {
            // Arrange
            const props = createQAProps({
                qa: { question: 'Original question', answer: 'Original answer' },
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText('Original question')).toBeInTheDocument();
            rerender(<index_1.default {...props} qa={{ question: 'New question', answer: 'New answer' }}/>);
            // Assert
            expect(react_1.screen.getByText('New question')).toBeInTheDocument();
            expect(react_1.screen.getByText('New answer')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases - Test boundary conditions and error handling
    // ==========================================
    describe('Edge Cases', () => {
        describe('Empty/Undefined values', () => {
            it('should handle undefined content gracefully', () => {
                // Arrange
                const props = createDefaultProps({ content: undefined });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should show 0 characters (use more specific text match)
                expect(react_1.screen.getByText(/^0 datasetCreation/)).toBeInTheDocument();
            });
            it('should handle empty string content', () => {
                // Arrange
                const props = createDefaultProps({ content: '' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should show 0 characters (use more specific text match)
                expect(react_1.screen.getByText(/^0 datasetCreation/)).toBeInTheDocument();
            });
            it('should handle undefined qa gracefully', () => {
                // Arrange
                const props = {
                    type: index_1.PreviewType.QA,
                    index: 1,
                    qa: undefined,
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should render Q and A labels but with empty content
                expect(react_1.screen.getByText('Q')).toBeInTheDocument();
                expect(react_1.screen.getByText('A')).toBeInTheDocument();
                // Character count should be 0 (use more specific text match)
                expect(react_1.screen.getByText(/^0 datasetCreation/)).toBeInTheDocument();
            });
            it('should handle undefined question in qa', () => {
                // Arrange
                const props = {
                    type: index_1.PreviewType.QA,
                    index: 1,
                    qa: {
                        question: undefined,
                        answer: 'Only answer',
                    },
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Only answer')).toBeInTheDocument();
            });
            it('should handle undefined answer in qa', () => {
                // Arrange
                const props = {
                    type: index_1.PreviewType.QA,
                    index: 1,
                    qa: {
                        question: 'Only question',
                        answer: undefined,
                    },
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Only question')).toBeInTheDocument();
            });
            it('should handle empty question and answer strings', () => {
                // Arrange
                const props = createQAProps({
                    qa: { question: '', answer: '' },
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should show 0 characters (use more specific text match)
                expect(react_1.screen.getByText(/^0 datasetCreation/)).toBeInTheDocument();
                expect(react_1.screen.getByText('Q')).toBeInTheDocument();
                expect(react_1.screen.getByText('A')).toBeInTheDocument();
            });
        });
        describe('Character count calculation', () => {
            it('should calculate correct character count for TEXT type', () => {
                // Arrange - 'Test' has 4 characters
                const props = createDefaultProps({ content: 'Test' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/4/)).toBeInTheDocument();
            });
            it('should calculate correct character count for QA type (question + answer)', () => {
                // Arrange - 'ABC' (3) + 'DEFGH' (5) = 8 characters
                const props = createQAProps({
                    qa: { question: 'ABC', answer: 'DEFGH' },
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/8/)).toBeInTheDocument();
            });
            it('should count special characters correctly', () => {
                // Arrange - Content with special characters
                const props = createDefaultProps({ content: '你好世界' }); // 4 Chinese characters
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/4/)).toBeInTheDocument();
            });
            it('should count newlines in character count', () => {
                // Arrange - 'a\nb' has 3 characters
                const props = createDefaultProps({ content: 'a\nb' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/3/)).toBeInTheDocument();
            });
            it('should count spaces in character count', () => {
                // Arrange - 'a b' has 3 characters
                const props = createDefaultProps({ content: 'a b' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/3/)).toBeInTheDocument();
            });
        });
        describe('Boundary conditions', () => {
            it('should handle very long content', () => {
                // Arrange
                const longContent = 'A'.repeat(10000);
                const props = createDefaultProps({ content: longContent });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should show correct character count
                expect(react_1.screen.getByText(/10000/)).toBeInTheDocument();
            });
            it('should handle very long index', () => {
                // Arrange
                const props = createDefaultProps({ index: 999999999 });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('999999999')).toBeInTheDocument();
            });
            it('should handle negative index', () => {
                // Arrange
                const props = createDefaultProps({ index: -1 });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - padStart pads from the start, so -1 becomes 0-1
                expect(react_1.screen.getByText('0-1')).toBeInTheDocument();
            });
            it('should handle content with only whitespace', () => {
                // Arrange
                const props = createDefaultProps({ content: '   ' }); // 3 spaces
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/3/)).toBeInTheDocument();
            });
            it('should handle content with HTML-like characters', () => {
                // Arrange
                const props = createDefaultProps({ content: '<div>Test</div>' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should render as text, not HTML
                expect(react_1.screen.getByText('<div>Test</div>')).toBeInTheDocument();
            });
            it('should handle content with emojis', () => {
                // Arrange - Emojis can have complex character lengths
                const props = createDefaultProps({ content: '😀👍' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Emoji length depends on JS string length
                expect(react_1.screen.getByText('😀👍')).toBeInTheDocument();
            });
        });
        describe('Type edge cases', () => {
            it('should ignore qa prop when type is TEXT', () => {
                // Arrange - Both content and qa provided, but type is TEXT
                const props = {
                    type: index_1.PreviewType.TEXT,
                    index: 1,
                    content: 'Text content',
                    qa: { question: 'Should not show', answer: 'Also should not show' },
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Text content')).toBeInTheDocument();
                expect(react_1.screen.queryByText('Should not show')).not.toBeInTheDocument();
                expect(react_1.screen.queryByText('Also should not show')).not.toBeInTheDocument();
            });
            it('should use content length for TEXT type even when qa is provided', () => {
                // Arrange
                const props = {
                    type: index_1.PreviewType.TEXT,
                    index: 1,
                    content: 'Hi', // 2 characters
                    qa: { question: 'Question', answer: 'Answer' }, // Would be 14 characters if used
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should show 2, not 14
                expect(react_1.screen.getByText(/2/)).toBeInTheDocument();
            });
            it('should ignore content prop when type is QA', () => {
                // Arrange
                const props = {
                    type: index_1.PreviewType.QA,
                    index: 1,
                    content: 'Should not display',
                    qa: { question: 'Q text', answer: 'A text' },
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.queryByText('Should not display')).not.toBeInTheDocument();
                expect(react_1.screen.getByText('Q text')).toBeInTheDocument();
                expect(react_1.screen.getByText('A text')).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // PreviewType Enum - Test exported enum values
    // ==========================================
    describe('PreviewType Enum', () => {
        it('should have TEXT value as "text"', () => {
            expect(index_1.PreviewType.TEXT).toBe('text');
        });
        it('should have QA value as "QA"', () => {
            expect(index_1.PreviewType.QA).toBe('QA');
        });
    });
    // ==========================================
    // Styling Tests - Verify correct CSS classes applied
    // ==========================================
    describe('Styling', () => {
        it('should have rounded container with gray background', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const rootDiv = container.firstChild;
            expect(rootDiv).toHaveClass('rounded-xl', 'bg-gray-50', 'p-4');
        });
        it('should have proper header styling', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check header div styling
            const headerDiv = container.querySelector('.flex.h-5.items-center.justify-between');
            expect(headerDiv).toBeInTheDocument();
        });
        it('should have index badge styling', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const indexBadge = container.querySelector('.border.border-gray-200');
            expect(indexBadge).toBeInTheDocument();
            expect(indexBadge).toHaveClass('rounded-md', 'italic', 'font-medium');
        });
        it('should have content area with line-clamp', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const contentArea = container.querySelector('.line-clamp-6');
            expect(contentArea).toBeInTheDocument();
            expect(contentArea).toHaveClass('max-h-[120px]', 'overflow-hidden');
        });
        it('should have Q/A labels with gray color', () => {
            // Arrange
            const props = createQAProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const labels = container.querySelectorAll('.text-gray-400');
            expect(labels.length).toBeGreaterThanOrEqual(2); // Q and A labels
        });
    });
    // ==========================================
    // i18n Translation - Test translation integration
    // ==========================================
    describe('i18n Translation', () => {
        it('should use translation key for characters label', () => {
            // Arrange
            const props = createDefaultProps({ content: 'Test' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - The mock returns the key as-is
            expect(react_1.screen.getByText(/datasetCreation.stepTwo.characters/)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELCtCQUE4QjtBQUM5QixtQ0FBa0Q7QUFFbEQsOEJBQThCO0FBQzlCLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxTQUFzQyxFQUFxQixFQUFFLENBQUMsQ0FBQztJQUN6RixJQUFJLEVBQUUsbUJBQVcsQ0FBQyxJQUFJO0lBQ3RCLEtBQUssRUFBRSxDQUFDO0lBQ1IsT0FBTyxFQUFFLGNBQWM7SUFDdkIsR0FBRyxTQUFTO0NBQ2IsQ0FBQyxDQUFBO0FBRUYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxTQUFzQyxFQUFxQixFQUFFLENBQUMsQ0FBQztJQUNwRixJQUFJLEVBQUUsbUJBQVcsQ0FBQyxFQUFFO0lBQ3BCLEtBQUssRUFBRSxDQUFDO0lBQ1IsRUFBRSxFQUFFO1FBQ0YsUUFBUSxFQUFFLGVBQWU7UUFDekIsTUFBTSxFQUFFLGFBQWE7S0FDdEI7SUFDRCxHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkNBQTZDO0lBQzdDLHVEQUF1RDtJQUN2RCw2Q0FBNkM7SUFDN0MsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtZQUVsQyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFXLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbEMsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FB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QUFvQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3BGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSVByZXZpZXdJdGVtUHJvcHMgfSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJldmlld0l0ZW0sIHsgUHJldmlld1R5cGUgfSBmcm9tICcuL2luZGV4J1xuXG4vLyBUZXN0IGRhdGEgYnVpbGRlciBmb3IgcHJvcHNcbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPElQcmV2aWV3SXRlbVByb3BzPik6IElQcmV2aWV3SXRlbVByb3BzID0+ICh7XG4gIHR5cGU6IFByZXZpZXdUeXBlLlRFWFQsXG4gIGluZGV4OiAxLFxuICBjb250ZW50OiAnVGVzdCBjb250ZW50JyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlUUFQcm9wcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPElQcmV2aWV3SXRlbVByb3BzPik6IElQcmV2aWV3SXRlbVByb3BzID0+ICh7XG4gIHR5cGU6IFByZXZpZXdUeXBlLlFBLFxuICBpbmRleDogMSxcbiAgcWE6IHtcbiAgICBxdWVzdGlvbjogJ1Rlc3QgcXVlc3Rpb24nLFxuICAgIGFuc3dlcjogJ1Rlc3QgYW5zd2VyJyxcbiAgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuZGVzY3JpYmUoJ1ByZXZpZXdJdGVtJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzIC0gVmVyaWZ5IGNvbXBvbmVudCByZW5kZXJzIGNvcnJlY3RseVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBURVhUIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGNvbnRlbnQ6ICdTYW1wbGUgdGV4dCBjb250ZW50JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2FtcGxlIHRleHQgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggUUEgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUUFQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdRJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IHF1ZXN0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IGFuc3dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNoYXJwIGljb24gKCMpIHdpdGggZm9ybWF0dGVkIGluZGV4JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbmRleDogNSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEluZGV4IHNob3VsZCBiZSBwYWRkZWQgdG8gMyBkaWdpdHNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcwMDUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hhcnAgaWNvbiBTVkcgc2hvdWxkIGV4aXN0XG4gICAgICBjb25zdCBzdmdFbGVtZW50cyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2Z0VsZW1lbnRzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGFyYWN0ZXIgY291bnQgZm9yIFRFWFQgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSAnSGVsbG8gV29ybGQnIC8vIDExIGNoYXJhY3RlcnNcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY29udGVudCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvd3MgY2hhcmFjdGVyIGNvdW50IHdpdGggdHJhbnNsYXRpb24ga2V5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMTEvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRDcmVhdGlvbi5zdGVwVHdvLmNoYXJhY3RlcnMvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGFyYWN0ZXIgY291bnQgZm9yIFFBIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVFBUHJvcHMoe1xuICAgICAgICBxYToge1xuICAgICAgICAgIHF1ZXN0aW9uOiAnSGVsbG8nLCAvLyA1IGNoYXJhY3RlcnNcbiAgICAgICAgICBhbnN3ZXI6ICdXb3JsZCcsIC8vIDUgY2hhcmFjdGVycyAtIHRvdGFsIDEwXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvd3MgY29tYmluZWQgY2hhcmFjdGVyIGNvdW50XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMTAvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0ZXh0IGljb24gU1ZHJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBoYXZlIFNWRyBpY29uc1xuICAgICAgY29uc3Qgc3ZnRWxlbWVudHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc3ZnJylcbiAgICAgIGV4cGVjdChzdmdFbGVtZW50cy5sZW5ndGgpLnRvQmUoMikgLy8gU2hhcnAgaWNvbiBhbmQgdGV4dCBpY29uXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZyAtIFZlcmlmeSBhbGwgcHJvcCB2YXJpYXRpb25zIHdvcmsgY29ycmVjdGx5XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3R5cGUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIFRFWFQgY29udGVudCB3aGVuIHR5cGUgaXMgVEVYVCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHR5cGU6IFByZXZpZXdUeXBlLlRFWFQsIGNvbnRlbnQ6ICdUZXh0IG1vZGUgY29udGVudCcgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGV4dCBtb2RlIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdRJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0EnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIFFBIGNvbnRlbnQgd2hlbiB0eXBlIGlzIFFBJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUUFQcm9wcyh7XG4gICAgICAgICAgdHlwZTogUHJldmlld1R5cGUuUUEsXG4gICAgICAgICAgcWE6IHsgcXVlc3Rpb246ICdNeSBxdWVzdGlvbicsIGFuc3dlcjogJ015IGFuc3dlcicgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IHF1ZXN0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IGFuc3dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBURVhUIGFzIGRlZmF1bHQgdHlwZSB3aGVuIHR5cGUgaXMgXCJ0ZXh0XCInLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB0eXBlOiAndGV4dCcgYXMgUHJldmlld1R5cGUsIGNvbnRlbnQ6ICdEZWZhdWx0IHR5cGUgY29udGVudCcgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGVmYXVsdCB0eXBlIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1c2UgUUEgdHlwZSB3aGVuIHR5cGUgaXMgXCJRQVwiJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUUFQcm9wcyh7IHR5cGU6ICdRQScgYXMgUHJldmlld1R5cGUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdpbmRleCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQuZWFjaChbXG4gICAgICAgIFsxLCAnMDAxJ10sXG4gICAgICAgIFs1LCAnMDA1J10sXG4gICAgICAgIFsxMCwgJzAxMCddLFxuICAgICAgICBbOTksICcwOTknXSxcbiAgICAgICAgWzEwMCwgJzEwMCddLFxuICAgICAgICBbOTk5LCAnOTk5J10sXG4gICAgICAgIFsxMDAwLCAnMTAwMCddLFxuICAgICAgXSkoJ3Nob3VsZCBmb3JtYXQgaW5kZXggJWkgYXMgJXMnLCAoaW5kZXgsIGV4cGVjdGVkKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbmRleCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGV4cGVjdGVkKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW5kZXggMCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGluZGV4OiAwIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzAwMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBsYXJnZSBpbmRleCBudW1iZXJzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaW5kZXg6IDEyMzQ1IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEyMzQ1JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdjb250ZW50IHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjb250ZW50IHdoZW4gcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjb250ZW50OiAnQ3VzdG9tIGNvbnRlbnQgaGVyZScgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tIGNvbnRlbnQgaGVyZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aWxpbmUgY29udGVudCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtdWx0aWxpbmVDb250ZW50ID0gJ0xpbmUgMVxcbkxpbmUgMlxcbkxpbmUgMydcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjb250ZW50OiBtdWx0aWxpbmVDb250ZW50IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgY29udGVudCBpcyByZW5kZXJlZCAobXVsdGlsaW5lIHRleHQgaXMgaW4gcHJlLWxpbmUgZGl2KVxuICAgICAgICBjb25zdCBjb250ZW50RGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tzdHlsZSo9XCJ3aGl0ZS1zcGFjZTogcHJlLWxpbmVcIl0nKVxuICAgICAgICBleHBlY3QoY29udGVudERpdj8udGV4dENvbnRlbnQpLnRvQ29udGFpbignTGluZSAxJylcbiAgICAgICAgZXhwZWN0KGNvbnRlbnREaXY/LnRleHRDb250ZW50KS50b0NvbnRhaW4oJ0xpbmUgMicpXG4gICAgICAgIGV4cGVjdChjb250ZW50RGl2Py50ZXh0Q29udGVudCkudG9Db250YWluKCdMaW5lIDMnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSB3aGl0ZXNwYWNlIHdpdGggcHJlLWxpbmUgc3R5bGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjb250ZW50OiAnVGV4dCB3aXRoICBzcGFjZXMnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgZm9yIHdoaXRlU3BhY2U6IHByZS1saW5lIHN0eWxlXG4gICAgICAgIGNvbnN0IGNvbnRlbnREaXYgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW3N0eWxlKj1cIndoaXRlLXNwYWNlOiBwcmUtbGluZVwiXScpXG4gICAgICAgIGV4cGVjdChjb250ZW50RGl2KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgncWEgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHF1ZXN0aW9uIGFuZCBhbnN3ZXIgd2hlbiBxYSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVFBUHJvcHMoe1xuICAgICAgICAgIHFhOiB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ1doYXQgaXMgdGVzdGluZz8nLFxuICAgICAgICAgICAgYW5zd2VyOiAnVGVzdGluZyBpcyB2ZXJpZmljYXRpb24uJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdXaGF0IGlzIHRlc3Rpbmc/JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3RpbmcgaXMgdmVyaWZpY2F0aW9uLicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBRIGFuZCBBIGxhYmVscycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVFBUHJvcHMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdRJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlsaW5lIHF1ZXN0aW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUUFQcm9wcyh7XG4gICAgICAgICAgcWE6IHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAnUXVlc3Rpb24gbGluZSAxXFxuUXVlc3Rpb24gbGluZSAyJyxcbiAgICAgICAgICAgIGFuc3dlcjogJ0Fuc3dlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBDaGVjayBjb250ZW50IGlzIGluIHByZS1saW5lIGRpdlxuICAgICAgICBjb25zdCBwcmVMaW5lRGl2cyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbc3R5bGUqPVwid2hpdGUtc3BhY2U6IHByZS1saW5lXCJdJylcbiAgICAgICAgY29uc3QgcXVlc3Rpb25EaXYgPSBBcnJheS5mcm9tKHByZUxpbmVEaXZzKS5maW5kKGRpdiA9PiBkaXYudGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdRdWVzdGlvbiBsaW5lIDEnKSlcbiAgICAgICAgZXhwZWN0KHF1ZXN0aW9uRGl2KS50b0JlVHJ1dGh5KClcbiAgICAgICAgZXhwZWN0KHF1ZXN0aW9uRGl2Py50ZXh0Q29udGVudCkudG9Db250YWluKCdRdWVzdGlvbiBsaW5lIDInKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlsaW5lIGFuc3dlcicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVFBUHJvcHMoe1xuICAgICAgICAgIHFhOiB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ1F1ZXN0aW9uJyxcbiAgICAgICAgICAgIGFuc3dlcjogJ0Fuc3dlciBsaW5lIDFcXG5BbnN3ZXIgbGluZSAyJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENoZWNrIGNvbnRlbnQgaXMgaW4gcHJlLWxpbmUgZGl2XG4gICAgICAgIGNvbnN0IHByZUxpbmVEaXZzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tzdHlsZSo9XCJ3aGl0ZS1zcGFjZTogcHJlLWxpbmVcIl0nKVxuICAgICAgICBjb25zdCBhbnN3ZXJEaXYgPSBBcnJheS5mcm9tKHByZUxpbmVEaXZzKS5maW5kKGRpdiA9PiBkaXYudGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdBbnN3ZXIgbGluZSAxJykpXG4gICAgICAgIGV4cGVjdChhbnN3ZXJEaXYpLnRvQmVUcnV0aHkoKVxuICAgICAgICBleHBlY3QoYW5zd2VyRGl2Py50ZXh0Q29udGVudCkudG9Db250YWluKCdBbnN3ZXIgbGluZSAyJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29tcG9uZW50IE1lbW9pemF0aW9uIC0gVGVzdCBSZWFjdC5tZW1vIGJlaGF2aW9yXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGNvbXBvbmVudCBoYXMgbWVtbyB3cmFwcGVyXG4gICAgICBleHBlY3QoUHJldmlld0l0ZW0uJCR0eXBlb2YpLnRvQmUoU3ltYm9sLmZvcigncmVhY3QubWVtbycpKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZS1yZW5kZXIgd2hlbiBwcm9wcyByZW1haW4gdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICBjb25zdCByZW5kZXJTcHkgPSB2aS5mbigpXG5cbiAgICAgIC8vIENyZWF0ZSBhIHdyYXBwZXIgY29tcG9uZW50IHRvIHRyYWNrIHJlbmRlcnNcbiAgICAgIGNvbnN0IFRyYWNrZWRQcmV2aWV3SXRlbTogUmVhY3QuRkM8SVByZXZpZXdJdGVtUHJvcHM+ID0gKHRyYWNrZWRQcm9wcykgPT4ge1xuICAgICAgICByZW5kZXJTcHkoKVxuICAgICAgICByZXR1cm4gPFByZXZpZXdJdGVtIHsuLi50cmFja2VkUHJvcHN9IC8+XG4gICAgICB9XG4gICAgICBjb25zdCBNZW1vaXplZFRyYWNrZWQgPSBSZWFjdC5tZW1vKFRyYWNrZWRQcmV2aWV3SXRlbSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE1lbW9pemVkVHJhY2tlZCB7Li4ucHJvcHN9IC8+KVxuICAgICAgcmVyZW5kZXIoPE1lbW9pemVkVHJhY2tlZCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgb25seSByZW5kZXIgb25jZSBkdWUgdG8gc2FtZSBwcm9wc1xuICAgICAgZXhwZWN0KHJlbmRlclNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmUtcmVuZGVyIHdoZW4gY29udGVudCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjb250ZW50OiAnSW5pdGlhbCBjb250ZW50JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdJbml0aWFsIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSBjb250ZW50PVwiVXBkYXRlZCBjb250ZW50XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1VwZGF0ZWQgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmUtcmVuZGVyIHdoZW4gaW5kZXggY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaW5kZXg6IDEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMDAxJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgcmVyZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gaW5kZXg9ezk5fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMDk5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1yZW5kZXIgd2hlbiB0eXBlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHR5cGU6IFByZXZpZXdUeXBlLlRFWFQsIGNvbnRlbnQ6ICdUZXh0IGNvbnRlbnQnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RleHQgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdRJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIHJlcmVuZGVyKDxQcmV2aWV3SXRlbSB0eXBlPXtQcmV2aWV3VHlwZS5RQX0gaW5kZXg9ezF9IHFhPXt7IHF1ZXN0aW9uOiAnUTEnLCBhbnN3ZXI6ICdBMScgfX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIHFhIHByb3AgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUUFQcm9wcyh7XG4gICAgICAgIHFhOiB7IHF1ZXN0aW9uOiAnT3JpZ2luYWwgcXVlc3Rpb24nLCBhbnN3ZXI6ICdPcmlnaW5hbCBhbnN3ZXInIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPcmlnaW5hbCBxdWVzdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIHJlcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IHFhPXt7IHF1ZXN0aW9uOiAnTmV3IHF1ZXN0aW9uJywgYW5zd2VyOiAnTmV3IGFuc3dlcicgfX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05ldyBxdWVzdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTmV3IGFuc3dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyAtIFRlc3QgYm91bmRhcnkgY29uZGl0aW9ucyBhbmQgZXJyb3IgaGFuZGxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdFbXB0eS9VbmRlZmluZWQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGNvbnRlbnQgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGNvbnRlbnQ6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgMCBjaGFyYWN0ZXJzICh1c2UgbW9yZSBzcGVjaWZpYyB0ZXh0IG1hdGNoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvXjAgZGF0YXNldENyZWF0aW9uLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBjb250ZW50JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY29udGVudDogJycgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzaG93IDAgY2hhcmFjdGVycyAodXNlIG1vcmUgc3BlY2lmaWMgdGV4dCBtYXRjaClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL14wIGRhdGFzZXRDcmVhdGlvbi8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcWEgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wczogSVByZXZpZXdJdGVtUHJvcHMgPSB7XG4gICAgICAgICAgdHlwZTogUHJldmlld1R5cGUuUUEsXG4gICAgICAgICAgaW5kZXg6IDEsXG4gICAgICAgICAgcWE6IHVuZGVmaW5lZCxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciBRIGFuZCBBIGxhYmVscyBidXQgd2l0aCBlbXB0eSBjb250ZW50XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdRJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAvLyBDaGFyYWN0ZXIgY291bnQgc2hvdWxkIGJlIDAgKHVzZSBtb3JlIHNwZWNpZmljIHRleHQgbWF0Y2gpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9eMCBkYXRhc2V0Q3JlYXRpb24vKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHF1ZXN0aW9uIGluIHFhJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzOiBJUHJldmlld0l0ZW1Qcm9wcyA9IHtcbiAgICAgICAgICB0eXBlOiBQcmV2aWV3VHlwZS5RQSxcbiAgICAgICAgICBpbmRleDogMSxcbiAgICAgICAgICBxYToge1xuICAgICAgICAgICAgcXVlc3Rpb246IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIHN0cmluZyxcbiAgICAgICAgICAgIGFuc3dlcjogJ09ubHkgYW5zd2VyJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ09ubHkgYW5zd2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBhbnN3ZXIgaW4gcWEnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHM6IElQcmV2aWV3SXRlbVByb3BzID0ge1xuICAgICAgICAgIHR5cGU6IFByZXZpZXdUeXBlLlFBLFxuICAgICAgICAgIGluZGV4OiAxLFxuICAgICAgICAgIHFhOiB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ09ubHkgcXVlc3Rpb24nLFxuICAgICAgICAgICAgYW5zd2VyOiB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBzdHJpbmcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPbmx5IHF1ZXN0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHF1ZXN0aW9uIGFuZCBhbnN3ZXIgc3RyaW5ncycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVFBUHJvcHMoe1xuICAgICAgICAgIHFhOiB7IHF1ZXN0aW9uOiAnJywgYW5zd2VyOiAnJyB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgMCBjaGFyYWN0ZXJzICh1c2UgbW9yZSBzcGVjaWZpYyB0ZXh0IG1hdGNoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvXjAgZGF0YXNldENyZWF0aW9uLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ2hhcmFjdGVyIGNvdW50IGNhbGN1bGF0aW9uJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgY29ycmVjdCBjaGFyYWN0ZXIgY291bnQgZm9yIFRFWFQgdHlwZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAtICdUZXN0JyBoYXMgNCBjaGFyYWN0ZXJzXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY29udGVudDogJ1Rlc3QnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzQvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgY29ycmVjdCBjaGFyYWN0ZXIgY291bnQgZm9yIFFBIHR5cGUgKHF1ZXN0aW9uICsgYW5zd2VyKScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAtICdBQkMnICgzKSArICdERUZHSCcgKDUpID0gOCBjaGFyYWN0ZXJzXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUUFQcm9wcyh7XG4gICAgICAgICAgcWE6IHsgcXVlc3Rpb246ICdBQkMnLCBhbnN3ZXI6ICdERUZHSCcgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvOC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNvdW50IHNwZWNpYWwgY2hhcmFjdGVycyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgLSBDb250ZW50IHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY29udGVudDogJ+S9oOWlveS4lueVjCcgfSkgLy8gNCBDaGluZXNlIGNoYXJhY3RlcnNcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvNC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNvdW50IG5ld2xpbmVzIGluIGNoYXJhY3RlciBjb3VudCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAtICdhXFxuYicgaGFzIDMgY2hhcmFjdGVyc1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGNvbnRlbnQ6ICdhXFxuYicgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNvdW50IHNwYWNlcyBpbiBjaGFyYWN0ZXIgY291bnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgLSAnYSBiJyBoYXMgMyBjaGFyYWN0ZXJzXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY29udGVudDogJ2EgYicgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQm91bmRhcnkgY29uZGl0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBjb250ZW50JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGxvbmdDb250ZW50ID0gJ0EnLnJlcGVhdCgxMDAwMClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjb250ZW50OiBsb25nQ29udGVudCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgY29ycmVjdCBjaGFyYWN0ZXIgY291bnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzEwMDAwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBpbmRleCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGluZGV4OiA5OTk5OTk5OTkgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnOTk5OTk5OTk5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIG5lZ2F0aXZlIGluZGV4JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaW5kZXg6IC0xIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBwYWRTdGFydCBwYWRzIGZyb20gdGhlIHN0YXJ0LCBzbyAtMSBiZWNvbWVzIDAtMVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMC0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbnRlbnQgd2l0aCBvbmx5IHdoaXRlc3BhY2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjb250ZW50OiAnICAgJyB9KSAvLyAzIHNwYWNlc1xuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC8zLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbnRlbnQgd2l0aCBIVE1MLWxpa2UgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGNvbnRlbnQ6ICc8ZGl2PlRlc3Q8L2Rpdj4nIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIGFzIHRleHQsIG5vdCBIVE1MXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc8ZGl2PlRlc3Q8L2Rpdj4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29udGVudCB3aXRoIGVtb2ppcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAtIEVtb2ppcyBjYW4gaGF2ZSBjb21wbGV4IGNoYXJhY3RlciBsZW5ndGhzXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY29udGVudDogJ/CfmIDwn5GNJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gRW1vamkgbGVuZ3RoIGRlcGVuZHMgb24gSlMgc3RyaW5nIGxlbmd0aFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn8J+YgPCfkY0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1R5cGUgZWRnZSBjYXNlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaWdub3JlIHFhIHByb3Agd2hlbiB0eXBlIGlzIFRFWFQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgLSBCb3RoIGNvbnRlbnQgYW5kIHFhIHByb3ZpZGVkLCBidXQgdHlwZSBpcyBURVhUXG4gICAgICAgIGNvbnN0IHByb3BzOiBJUHJldmlld0l0ZW1Qcm9wcyA9IHtcbiAgICAgICAgICB0eXBlOiBQcmV2aWV3VHlwZS5URVhULFxuICAgICAgICAgIGluZGV4OiAxLFxuICAgICAgICAgIGNvbnRlbnQ6ICdUZXh0IGNvbnRlbnQnLFxuICAgICAgICAgIHFhOiB7IHF1ZXN0aW9uOiAnU2hvdWxkIG5vdCBzaG93JywgYW5zd2VyOiAnQWxzbyBzaG91bGQgbm90IHNob3cnIH0sXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGV4dCBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnU2hvdWxkIG5vdCBzaG93JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0Fsc28gc2hvdWxkIG5vdCBzaG93JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBjb250ZW50IGxlbmd0aCBmb3IgVEVYVCB0eXBlIGV2ZW4gd2hlbiBxYSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wczogSVByZXZpZXdJdGVtUHJvcHMgPSB7XG4gICAgICAgICAgdHlwZTogUHJldmlld1R5cGUuVEVYVCxcbiAgICAgICAgICBpbmRleDogMSxcbiAgICAgICAgICBjb250ZW50OiAnSGknLCAvLyAyIGNoYXJhY3RlcnNcbiAgICAgICAgICBxYTogeyBxdWVzdGlvbjogJ1F1ZXN0aW9uJywgYW5zd2VyOiAnQW5zd2VyJyB9LCAvLyBXb3VsZCBiZSAxNCBjaGFyYWN0ZXJzIGlmIHVzZWRcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgMiwgbm90IDE0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC8yLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaWdub3JlIGNvbnRlbnQgcHJvcCB3aGVuIHR5cGUgaXMgUUEnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHM6IElQcmV2aWV3SXRlbVByb3BzID0ge1xuICAgICAgICAgIHR5cGU6IFByZXZpZXdUeXBlLlFBLFxuICAgICAgICAgIGluZGV4OiAxLFxuICAgICAgICAgIGNvbnRlbnQ6ICdTaG91bGQgbm90IGRpc3BsYXknLFxuICAgICAgICAgIHFhOiB7IHF1ZXN0aW9uOiAnUSB0ZXh0JywgYW5zd2VyOiAnQSB0ZXh0JyB9LFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnU2hvdWxkIG5vdCBkaXNwbGF5JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdRIHRleHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQSB0ZXh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJldmlld1R5cGUgRW51bSAtIFRlc3QgZXhwb3J0ZWQgZW51bSB2YWx1ZXNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcmV2aWV3VHlwZSBFbnVtJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBURVhUIHZhbHVlIGFzIFwidGV4dFwiJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KFByZXZpZXdUeXBlLlRFWFQpLnRvQmUoJ3RleHQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgUUEgdmFsdWUgYXMgXCJRQVwiJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KFByZXZpZXdUeXBlLlFBKS50b0JlKCdRQScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3R5bGluZyBUZXN0cyAtIFZlcmlmeSBjb3JyZWN0IENTUyBjbGFzc2VzIGFwcGxpZWRcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdTdHlsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSByb3VuZGVkIGNvbnRhaW5lciB3aXRoIGdyYXkgYmFja2dyb3VuZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHJvb3REaXYgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHJvb3REaXYpLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLXhsJywgJ2JnLWdyYXktNTAnLCAncC00JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHByb3BlciBoZWFkZXIgc3R5bGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayBoZWFkZXIgZGl2IHN0eWxpbmdcbiAgICAgIGNvbnN0IGhlYWRlckRpdiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZmxleC5oLTUuaXRlbXMtY2VudGVyLmp1c3RpZnktYmV0d2VlbicpXG4gICAgICBleHBlY3QoaGVhZGVyRGl2KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBpbmRleCBiYWRnZSBzdHlsaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW5kZXhCYWRnZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYm9yZGVyLmJvcmRlci1ncmF5LTIwMCcpXG4gICAgICBleHBlY3QoaW5kZXhCYWRnZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGluZGV4QmFkZ2UpLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLW1kJywgJ2l0YWxpYycsICdmb250LW1lZGl1bScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb250ZW50IGFyZWEgd2l0aCBsaW5lLWNsYW1wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByZXZpZXdJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY29udGVudEFyZWEgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmxpbmUtY2xhbXAtNicpXG4gICAgICBleHBlY3QoY29udGVudEFyZWEpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250ZW50QXJlYSkudG9IYXZlQ2xhc3MoJ21heC1oLVsxMjBweF0nLCAnb3ZlcmZsb3ctaGlkZGVuJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIFEvQSBsYWJlbHMgd2l0aCBncmF5IGNvbG9yJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVRQVByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQcmV2aWV3SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxhYmVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcudGV4dC1ncmF5LTQwMCcpXG4gICAgICBleHBlY3QobGFiZWxzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgyKSAvLyBRIGFuZCBBIGxhYmVsc1xuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIGkxOG4gVHJhbnNsYXRpb24gLSBUZXN0IHRyYW5zbGF0aW9uIGludGVncmF0aW9uXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnaTE4biBUcmFuc2xhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSB0cmFuc2xhdGlvbiBrZXkgZm9yIGNoYXJhY3RlcnMgbGFiZWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGNvbnRlbnQ6ICdUZXN0JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJldmlld0l0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gVGhlIG1vY2sgcmV0dXJucyB0aGUga2V5IGFzLWlzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldENyZWF0aW9uLnN0ZXBUd28uY2hhcmFjdGVycy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=