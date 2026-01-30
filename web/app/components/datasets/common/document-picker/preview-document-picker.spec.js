"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const preview_document_picker_1 = require("./preview-document-picker");
// Override shared i18n mock for custom translations
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, params) => {
            if (key === 'preprocessDocument' && params?.num)
                return `${params.num} files`;
            const prefix = params?.ns ? `${params.ns}.` : '';
            return `${prefix}${key}`;
        },
    }),
}));
// Mock portal-to-follow-elem - always render content for testing
vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open }) => (<div data-testid="portal-elem" data-open={String(open || false)}>
      {children}
    </div>),
    PortalToFollowElemTrigger: ({ children, onClick }) => (<div data-testid="portal-trigger" onClick={onClick}>
      {children}
    </div>),
    // Always render content to allow testing document selection
    PortalToFollowElemContent: ({ children, className }) => (<div data-testid="portal-content" className={className}>
      {children}
    </div>),
}));
// Mock icons
vi.mock('@remixicon/react', () => ({
    RiArrowDownSLine: () => <span data-testid="arrow-icon">↓</span>,
    RiFile3Fill: () => <span data-testid="file-icon">📄</span>,
    RiFileCodeFill: () => <span data-testid="file-code-icon">📄</span>,
    RiFileExcelFill: () => <span data-testid="file-excel-icon">📄</span>,
    RiFileGifFill: () => <span data-testid="file-gif-icon">📄</span>,
    RiFileImageFill: () => <span data-testid="file-image-icon">📄</span>,
    RiFileMusicFill: () => <span data-testid="file-music-icon">📄</span>,
    RiFilePdf2Fill: () => <span data-testid="file-pdf-icon">📄</span>,
    RiFilePpt2Fill: () => <span data-testid="file-ppt-icon">📄</span>,
    RiFileTextFill: () => <span data-testid="file-text-icon">📄</span>,
    RiFileVideoFill: () => <span data-testid="file-video-icon">📄</span>,
    RiFileWordFill: () => <span data-testid="file-word-icon">📄</span>,
    RiMarkdownFill: () => <span data-testid="file-markdown-icon">📄</span>,
}));
// Factory function to create mock DocumentItem
const createMockDocumentItem = (overrides = {}) => ({
    id: `doc-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Test Document',
    extension: 'txt',
    ...overrides,
});
// Factory function to create multiple document items
const createMockDocumentList = (count) => {
    return Array.from({ length: count }, (_, index) => createMockDocumentItem({
        id: `doc-${index + 1}`,
        name: `Document ${index + 1}`,
        extension: index % 2 === 0 ? 'pdf' : 'txt',
    }));
};
// Factory function to create default props
const createDefaultProps = (overrides = {}) => ({
    value: createMockDocumentItem({ id: 'selected-doc', name: 'Selected Document' }),
    files: createMockDocumentList(3),
    onChange: vi.fn(),
    ...overrides,
});
// Helper to render component with default props
const renderComponent = (props = {}) => {
    const defaultProps = createDefaultProps(props);
    return {
        ...(0, react_1.render)(<preview_document_picker_1.default {...defaultProps}/>),
        props: defaultProps,
    };
};
describe('PreviewDocumentPicker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for basic rendering
    describe('Rendering', () => {
        it('should render without crashing', () => {
            renderComponent();
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should render document name from value prop', () => {
            renderComponent({
                value: createMockDocumentItem({ name: 'My Document' }),
            });
            expect(react_1.screen.getByText('My Document')).toBeInTheDocument();
        });
        it('should render placeholder when name is empty', () => {
            renderComponent({
                value: createMockDocumentItem({ name: '' }),
            });
            expect(react_1.screen.getByText('--')).toBeInTheDocument();
        });
        it('should render placeholder when name is undefined', () => {
            renderComponent({
                value: { id: 'doc-1', extension: 'txt' },
            });
            expect(react_1.screen.getByText('--')).toBeInTheDocument();
        });
        it('should render arrow icon', () => {
            renderComponent();
            expect(react_1.screen.getByTestId('arrow-icon')).toBeInTheDocument();
        });
        it('should render file icon', () => {
            renderComponent({
                value: createMockDocumentItem({ extension: 'txt' }),
                files: [], // Use empty files to avoid duplicate icons
            });
            expect(react_1.screen.getByTestId('file-text-icon')).toBeInTheDocument();
        });
        it('should render pdf icon for pdf extension', () => {
            renderComponent({
                value: createMockDocumentItem({ extension: 'pdf' }),
                files: [], // Use empty files to avoid duplicate icons
            });
            expect(react_1.screen.getByTestId('file-pdf-icon')).toBeInTheDocument();
        });
    });
    // Tests for props handling
    describe('Props', () => {
        it('should accept required props', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<preview_document_picker_1.default {...props}/>);
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should apply className to trigger element', () => {
            renderComponent({ className: 'custom-class' });
            const trigger = react_1.screen.getByTestId('portal-trigger');
            const innerDiv = trigger.querySelector('.custom-class');
            expect(innerDiv).toBeInTheDocument();
        });
        it('should handle empty files array', () => {
            // Component should render without crashing with empty files
            renderComponent({ files: [] });
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle single file', () => {
            // Component should accept single file
            renderComponent({
                files: [createMockDocumentItem({ id: 'single-doc', name: 'Single File' })],
            });
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle multiple files', () => {
            // Component should accept multiple files
            renderComponent({
                files: createMockDocumentList(5),
            });
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should use value.extension for file icon', () => {
            renderComponent({
                value: createMockDocumentItem({ name: 'test.docx', extension: 'docx' }),
            });
            expect(react_1.screen.getByTestId('file-word-icon')).toBeInTheDocument();
        });
    });
    // Tests for state management
    describe('State Management', () => {
        it('should initialize with popup closed', () => {
            renderComponent();
            expect(react_1.screen.getByTestId('portal-elem')).toHaveAttribute('data-open', 'false');
        });
        it('should toggle popup when trigger is clicked', () => {
            renderComponent();
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            expect(trigger).toBeInTheDocument();
        });
        it('should render portal content for document selection', () => {
            renderComponent();
            // Portal content is always rendered in our mock for testing
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
    });
    // Tests for callback stability and memoization
    describe('Callback Stability', () => {
        it('should maintain stable onChange callback when value changes', () => {
            const onChange = vi.fn();
            const value1 = createMockDocumentItem({ id: 'doc-1', name: 'Doc 1' });
            const value2 = createMockDocumentItem({ id: 'doc-2', name: 'Doc 2' });
            const { rerender } = (0, react_1.render)(<preview_document_picker_1.default value={value1} files={createMockDocumentList(3)} onChange={onChange}/>);
            rerender(<preview_document_picker_1.default value={value2} files={createMockDocumentList(3)} onChange={onChange}/>);
            expect(react_1.screen.getByText('Doc 2')).toBeInTheDocument();
        });
        it('should use updated onChange callback after rerender', () => {
            const onChange1 = vi.fn();
            const onChange2 = vi.fn();
            const value = createMockDocumentItem();
            const files = createMockDocumentList(3);
            const { rerender } = (0, react_1.render)(<preview_document_picker_1.default value={value} files={files} onChange={onChange1}/>);
            rerender(<preview_document_picker_1.default value={value} files={files} onChange={onChange2}/>);
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
    });
    // Tests for component memoization
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(preview_document_picker_1.default.$$typeof).toBeDefined();
        });
        it('should not re-render when props are the same', () => {
            const onChange = vi.fn();
            const value = createMockDocumentItem();
            const files = createMockDocumentList(3);
            const { rerender } = (0, react_1.render)(<preview_document_picker_1.default value={value} files={files} onChange={onChange}/>);
            rerender(<preview_document_picker_1.default value={value} files={files} onChange={onChange}/>);
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
    });
    // Tests for user interactions
    describe('User Interactions', () => {
        it('should toggle popup when trigger is clicked', () => {
            renderComponent();
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            expect(trigger).toBeInTheDocument();
        });
        it('should render document list with files', () => {
            const files = createMockDocumentList(3);
            renderComponent({ files });
            // Documents should be visible in the list
            expect(react_1.screen.getByText('Document 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Document 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Document 3')).toBeInTheDocument();
        });
        it('should call onChange when document is selected', () => {
            const onChange = vi.fn();
            const files = createMockDocumentList(3);
            renderComponent({ files, onChange });
            // Click on a document
            react_1.fireEvent.click(react_1.screen.getByText('Document 2'));
            // handleChange should call onChange with the selected item
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(files[1]);
        });
        it('should handle rapid toggle clicks', () => {
            renderComponent();
            const trigger = react_1.screen.getByTestId('portal-trigger');
            // Rapid clicks
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            expect(trigger).toBeInTheDocument();
        });
    });
    // Tests for edge cases
    describe('Edge Cases', () => {
        it('should handle null value properties gracefully', () => {
            renderComponent({
                value: { id: 'doc-1', name: '', extension: '' },
            });
            expect(react_1.screen.getByText('--')).toBeInTheDocument();
        });
        it('should render when value prop is omitted (optional)', () => {
            const files = createMockDocumentList(2);
            const onChange = vi.fn();
            // Do not pass `value` at all to verify optional behavior
            (0, react_1.render)(<preview_document_picker_1.default files={files} onChange={onChange}/>);
            // Renders placeholder for missing name
            expect(react_1.screen.getByText('--')).toBeInTheDocument();
            // Portal wrapper renders
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle empty files array', () => {
            renderComponent({ files: [] });
            // Component should render without crashing
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle very long document names', () => {
            const longName = 'A'.repeat(500);
            renderComponent({
                value: createMockDocumentItem({ name: longName }),
            });
            expect(react_1.screen.getByText(longName)).toBeInTheDocument();
        });
        it('should handle special characters in document name', () => {
            const specialName = '<script>alert("xss")</script>';
            renderComponent({
                value: createMockDocumentItem({ name: specialName }),
            });
            expect(react_1.screen.getByText(specialName)).toBeInTheDocument();
        });
        it('should handle undefined files prop', () => {
            // Test edge case where files might be undefined at runtime
            const props = createDefaultProps();
            // @ts-expect-error - Testing runtime edge case
            props.files = undefined;
            (0, react_1.render)(<preview_document_picker_1.default {...props}/>);
            // Component should render without crashing
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle large number of files', () => {
            const manyFiles = createMockDocumentList(100);
            renderComponent({ files: manyFiles });
            // Component should accept large files array
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle files with same name but different extensions', () => {
            const files = [
                createMockDocumentItem({ id: 'doc-1', name: 'document', extension: 'pdf' }),
                createMockDocumentItem({ id: 'doc-2', name: 'document', extension: 'txt' }),
            ];
            renderComponent({ files });
            // Component should handle duplicate names
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
    });
    // Tests for prop variations
    describe('Prop Variations', () => {
        describe('value variations', () => {
            it('should handle value with all fields', () => {
                renderComponent({
                    value: {
                        id: 'full-doc',
                        name: 'Full Document',
                        extension: 'pdf',
                    },
                });
                expect(react_1.screen.getByText('Full Document')).toBeInTheDocument();
            });
            it('should handle value with minimal fields', () => {
                renderComponent({
                    value: { id: 'minimal', name: '', extension: '' },
                });
                expect(react_1.screen.getByText('--')).toBeInTheDocument();
            });
        });
        describe('files variations', () => {
            it('should handle single file', () => {
                renderComponent({
                    files: [createMockDocumentItem({ name: 'Single' })],
                });
                expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
            it('should handle two files', () => {
                renderComponent({
                    files: createMockDocumentList(2),
                });
                expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
            it('should handle many files', () => {
                renderComponent({
                    files: createMockDocumentList(50),
                });
                expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
        });
        describe('className variations', () => {
            it('should apply custom className', () => {
                renderComponent({ className: 'my-custom-class' });
                const trigger = react_1.screen.getByTestId('portal-trigger');
                expect(trigger.querySelector('.my-custom-class')).toBeInTheDocument();
            });
            it('should work without className', () => {
                renderComponent({ className: undefined });
                expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
            });
            it('should handle multiple class names', () => {
                renderComponent({ className: 'class-one class-two' });
                const trigger = react_1.screen.getByTestId('portal-trigger');
                const element = trigger.querySelector('.class-one');
                expect(element).toBeInTheDocument();
                expect(element).toHaveClass('class-two');
            });
        });
        describe('extension variations', () => {
            const extensions = [
                { ext: 'txt', icon: 'file-text-icon' },
                { ext: 'pdf', icon: 'file-pdf-icon' },
                { ext: 'docx', icon: 'file-word-icon' },
                { ext: 'xlsx', icon: 'file-excel-icon' },
                { ext: 'md', icon: 'file-markdown-icon' },
            ];
            it.each(extensions)('should render correct icon for $ext extension', ({ ext, icon }) => {
                renderComponent({
                    value: createMockDocumentItem({ extension: ext }),
                    files: [], // Use empty files to avoid duplicate icons
                });
                expect(react_1.screen.getByTestId(icon)).toBeInTheDocument();
            });
        });
    });
    // Tests for document list rendering
    describe('Document List Rendering', () => {
        it('should render all documents in the list', () => {
            const files = createMockDocumentList(5);
            renderComponent({ files });
            // All documents should be visible
            files.forEach((file) => {
                expect(react_1.screen.getByText(file.name)).toBeInTheDocument();
            });
        });
        it('should pass onChange handler to DocumentList', () => {
            const onChange = vi.fn();
            const files = createMockDocumentList(3);
            renderComponent({ files, onChange });
            // Click on first document
            react_1.fireEvent.click(react_1.screen.getByText('Document 1'));
            expect(onChange).toHaveBeenCalledWith(files[0]);
        });
        it('should show count header only for multiple files', () => {
            // Single file - no header
            const { rerender } = (0, react_1.render)(<preview_document_picker_1.default value={createMockDocumentItem()} files={[createMockDocumentItem({ name: 'Single File' })]} onChange={vi.fn()}/>);
            expect(react_1.screen.queryByText(/files/)).not.toBeInTheDocument();
            // Multiple files - show header
            rerender(<preview_document_picker_1.default value={createMockDocumentItem()} files={createMockDocumentList(3)} onChange={vi.fn()}/>);
            expect(react_1.screen.getByText('3 files')).toBeInTheDocument();
        });
    });
    // Tests for visual states
    describe('Visual States', () => {
        it('should apply hover styles on trigger', () => {
            renderComponent();
            const trigger = react_1.screen.getByTestId('portal-trigger');
            const innerDiv = trigger.querySelector('.hover\\:bg-state-base-hover');
            expect(innerDiv).toBeInTheDocument();
        });
        it('should have truncate class for long names', () => {
            renderComponent({
                value: createMockDocumentItem({ name: 'Very Long Document Name' }),
            });
            const nameElement = react_1.screen.getByText('Very Long Document Name');
            expect(nameElement).toHaveClass('truncate');
        });
        it('should have max-width on name element', () => {
            renderComponent({
                value: createMockDocumentItem({ name: 'Test' }),
            });
            const nameElement = react_1.screen.getByText('Test');
            expect(nameElement).toHaveClass('max-w-[200px]');
        });
    });
    // Tests for handleChange callback
    describe('handleChange Callback', () => {
        it('should call onChange with selected document item', () => {
            const onChange = vi.fn();
            const files = createMockDocumentList(3);
            renderComponent({ files, onChange });
            // Click first document
            react_1.fireEvent.click(react_1.screen.getByText('Document 1'));
            expect(onChange).toHaveBeenCalledWith(files[0]);
        });
        it('should handle different document items in files', () => {
            const onChange = vi.fn();
            const customFiles = [
                { id: 'custom-1', name: 'Custom File 1', extension: 'pdf' },
                { id: 'custom-2', name: 'Custom File 2', extension: 'txt' },
            ];
            renderComponent({ files: customFiles, onChange });
            // Click on first custom file
            react_1.fireEvent.click(react_1.screen.getByText('Custom File 1'));
            expect(onChange).toHaveBeenCalledWith(customFiles[0]);
            // Click on second custom file
            react_1.fireEvent.click(react_1.screen.getByText('Custom File 2'));
            expect(onChange).toHaveBeenCalledWith(customFiles[1]);
        });
        it('should work with multiple sequential selections', () => {
            const onChange = vi.fn();
            const files = createMockDocumentList(3);
            renderComponent({ files, onChange });
            // Select multiple documents sequentially
            react_1.fireEvent.click(react_1.screen.getByText('Document 1'));
            react_1.fireEvent.click(react_1.screen.getByText('Document 3'));
            react_1.fireEvent.click(react_1.screen.getByText('Document 2'));
            expect(onChange).toHaveBeenCalledTimes(3);
            expect(onChange).toHaveBeenNthCalledWith(1, files[0]);
            expect(onChange).toHaveBeenNthCalledWith(2, files[2]);
            expect(onChange).toHaveBeenNthCalledWith(3, files[1]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlldy1kb2N1bWVudC1waWNrZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByZXZpZXctZG9jdW1lbnQtcGlja2VyLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5Qix1RUFBNkQ7QUFFN0Qsb0RBQW9EO0FBQ3BELEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUIsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckIsQ0FBQyxFQUFFLENBQUMsR0FBVyxFQUFFLE1BQWdDLEVBQUUsRUFBRTtZQUNuRCxJQUFJLEdBQUcsS0FBSyxvQkFBb0IsSUFBSSxNQUFNLEVBQUUsR0FBRztnQkFDN0MsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQTtZQUU5QixNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1lBQ2hELE9BQU8sR0FBRyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUE7UUFDMUIsQ0FBQztLQUNGLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILGlFQUFpRTtBQUNqRSxFQUFFLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUQsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBR3BDLEVBQUUsRUFBRSxDQUFDLENBQ0osQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQzlEO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QseUJBQXlCLEVBQUUsQ0FB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WSxDQUFDLENBQUMsQ0FBQTtZQUMvQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7WUFFL0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDckQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNyRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRG9jdW1lbnRJdGVtIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFByZXZpZXdEb2N1bWVudFBpY2tlciBmcm9tICcuL3ByZXZpZXctZG9jdW1lbnQtcGlja2VyJ1xuXG4vLyBPdmVycmlkZSBzaGFyZWQgaTE4biBtb2NrIGZvciBjdXN0b20gdHJhbnNsYXRpb25zXG52aS5tb2NrKCdyZWFjdC1pMThuZXh0JywgKCkgPT4gKHtcbiAgdXNlVHJhbnNsYXRpb246ICgpID0+ICh7XG4gICAgdDogKGtleTogc3RyaW5nLCBwYXJhbXM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ3ByZXByb2Nlc3NEb2N1bWVudCcgJiYgcGFyYW1zPy5udW0pXG4gICAgICAgIHJldHVybiBgJHtwYXJhbXMubnVtfSBmaWxlc2BcblxuICAgICAgY29uc3QgcHJlZml4ID0gcGFyYW1zPy5ucyA/IGAke3BhcmFtcy5uc30uYCA6ICcnXG4gICAgICByZXR1cm4gYCR7cHJlZml4fSR7a2V5fWBcbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHBvcnRhbC10by1mb2xsb3ctZWxlbSAtIGFsd2F5cyByZW5kZXIgY29udGVudCBmb3IgdGVzdGluZ1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbScsICgpID0+ICh7XG4gIFBvcnRhbFRvRm9sbG93RWxlbTogKHsgY2hpbGRyZW4sIG9wZW4gfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBvcGVuPzogYm9vbGVhblxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1lbGVtXCIgZGF0YS1vcGVuPXtTdHJpbmcob3BlbiB8fCBmYWxzZSl9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyOiAoeyBjaGlsZHJlbiwgb25DbGljayB9OiB7XG4gICAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZVxuICAgIG9uQ2xpY2s/OiAoKSA9PiB2b2lkXG4gIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLXRyaWdnZXJcIiBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKSxcbiAgLy8gQWx3YXlzIHJlbmRlciBjb250ZW50IHRvIGFsbG93IHRlc3RpbmcgZG9jdW1lbnQgc2VsZWN0aW9uXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ6ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtY29udGVudFwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIGljb25zXG52aS5tb2NrKCdAcmVtaXhpY29uL3JlYWN0JywgKCkgPT4gKHtcbiAgUmlBcnJvd0Rvd25TTGluZTogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJhcnJvdy1pY29uXCI+4oaTPC9zcGFuPixcbiAgUmlGaWxlM0ZpbGw6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpRmlsZUNvZGVGaWxsOiAoKSA9PiA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtY29kZS1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpRmlsZUV4Y2VsRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLWV4Y2VsLWljb25cIj7wn5OEPC9zcGFuPixcbiAgUmlGaWxlR2lmRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLWdpZi1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpRmlsZUltYWdlRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLWltYWdlLWljb25cIj7wn5OEPC9zcGFuPixcbiAgUmlGaWxlTXVzaWNGaWxsOiAoKSA9PiA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtbXVzaWMtaWNvblwiPvCfk4Q8L3NwYW4+LFxuICBSaUZpbGVQZGYyRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLXBkZi1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpRmlsZVBwdDJGaWxsOiAoKSA9PiA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtcHB0LWljb25cIj7wn5OEPC9zcGFuPixcbiAgUmlGaWxlVGV4dEZpbGw6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS10ZXh0LWljb25cIj7wn5OEPC9zcGFuPixcbiAgUmlGaWxlVmlkZW9GaWxsOiAoKSA9PiA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtdmlkZW8taWNvblwiPvCfk4Q8L3NwYW4+LFxuICBSaUZpbGVXb3JkRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLXdvcmQtaWNvblwiPvCfk4Q8L3NwYW4+LFxuICBSaU1hcmtkb3duRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLW1hcmtkb3duLWljb25cIj7wn5OEPC9zcGFuPixcbn0pKVxuXG4vLyBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBtb2NrIERvY3VtZW50SXRlbVxuY29uc3QgY3JlYXRlTW9ja0RvY3VtZW50SXRlbSA9IChvdmVycmlkZXM6IFBhcnRpYWw8RG9jdW1lbnRJdGVtPiA9IHt9KTogRG9jdW1lbnRJdGVtID0+ICh7XG4gIGlkOiBgZG9jLSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpfWAsXG4gIG5hbWU6ICdUZXN0IERvY3VtZW50JyxcbiAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgbXVsdGlwbGUgZG9jdW1lbnQgaXRlbXNcbmNvbnN0IGNyZWF0ZU1vY2tEb2N1bWVudExpc3QgPSAoY291bnQ6IG51bWJlcik6IERvY3VtZW50SXRlbVtdID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpbmRleCkgPT5cbiAgICBjcmVhdGVNb2NrRG9jdW1lbnRJdGVtKHtcbiAgICAgIGlkOiBgZG9jLSR7aW5kZXggKyAxfWAsXG4gICAgICBuYW1lOiBgRG9jdW1lbnQgJHtpbmRleCArIDF9YCxcbiAgICAgIGV4dGVuc2lvbjogaW5kZXggJSAyID09PSAwID8gJ3BkZicgOiAndHh0JyxcbiAgICB9KSlcbn1cblxuLy8gRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgZGVmYXVsdCBwcm9wc1xuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDxSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgUHJldmlld0RvY3VtZW50UGlja2VyPj4gPSB7fSkgPT4gKHtcbiAgdmFsdWU6IGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBpZDogJ3NlbGVjdGVkLWRvYycsIG5hbWU6ICdTZWxlY3RlZCBEb2N1bWVudCcgfSksXG4gIGZpbGVzOiBjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDMpLFxuICBvbkNoYW5nZTogdmkuZm4oKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gSGVscGVyIHRvIHJlbmRlciBjb21wb25lbnQgd2l0aCBkZWZhdWx0IHByb3BzXG5jb25zdCByZW5kZXJDb21wb25lbnQgPSAocHJvcHM6IFBhcnRpYWw8UmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIFByZXZpZXdEb2N1bWVudFBpY2tlcj4+ID0ge30pID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHByb3BzKVxuICByZXR1cm4ge1xuICAgIC4uLnJlbmRlcig8UHJldmlld0RvY3VtZW50UGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IC8+KSxcbiAgICBwcm9wczogZGVmYXVsdFByb3BzLFxuICB9XG59XG5cbmRlc2NyaWJlKCdQcmV2aWV3RG9jdW1lbnRQaWNrZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBiYXNpYyByZW5kZXJpbmdcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkb2N1bWVudCBuYW1lIGZyb20gdmFsdWUgcHJvcCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrRG9jdW1lbnRJdGVtKHsgbmFtZTogJ015IERvY3VtZW50JyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNeSBEb2N1bWVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsYWNlaG9sZGVyIHdoZW4gbmFtZSBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrRG9jdW1lbnRJdGVtKHsgbmFtZTogJycgfSksXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnLS0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwbGFjZWhvbGRlciB3aGVuIG5hbWUgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHsgaWQ6ICdkb2MtMScsIGV4dGVuc2lvbjogJ3R4dCcgfSBhcyBEb2N1bWVudEl0ZW0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnLS0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhcnJvdyBpY29uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYXJyb3ctaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZpbGUgaWNvbicsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrRG9jdW1lbnRJdGVtKHsgZXh0ZW5zaW9uOiAndHh0JyB9KSxcbiAgICAgICAgZmlsZXM6IFtdLCAvLyBVc2UgZW1wdHkgZmlsZXMgdG8gYXZvaWQgZHVwbGljYXRlIGljb25zXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLXRleHQtaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBkZiBpY29uIGZvciBwZGYgZXh0ZW5zaW9uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBleHRlbnNpb246ICdwZGYnIH0pLFxuICAgICAgICBmaWxlczogW10sIC8vIFVzZSBlbXB0eSBmaWxlcyB0byBhdm9pZCBkdXBsaWNhdGUgaWNvbnNcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtcGRmLWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHByb3BzIGhhbmRsaW5nXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFjY2VwdCByZXF1aXJlZCBwcm9wcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8UHJldmlld0RvY3VtZW50UGlja2VyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjbGFzc05hbWUgdG8gdHJpZ2dlciBlbGVtZW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgY2xhc3NOYW1lOiAnY3VzdG9tLWNsYXNzJyB9KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBjb25zdCBpbm5lckRpdiA9IHRyaWdnZXIucXVlcnlTZWxlY3RvcignLmN1c3RvbS1jbGFzcycpXG4gICAgICBleHBlY3QoaW5uZXJEaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZmlsZXMgYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBDb21wb25lbnQgc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nIHdpdGggZW1wdHkgZmlsZXNcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGZpbGVzOiBbXSB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNpbmdsZSBmaWxlJywgKCkgPT4ge1xuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCBhY2NlcHQgc2luZ2xlIGZpbGVcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIGZpbGVzOiBbY3JlYXRlTW9ja0RvY3VtZW50SXRlbSh7IGlkOiAnc2luZ2xlLWRvYycsIG5hbWU6ICdTaW5nbGUgRmlsZScgfSldLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBmaWxlcycsICgpID0+IHtcbiAgICAgIC8vIENvbXBvbmVudCBzaG91bGQgYWNjZXB0IG11bHRpcGxlIGZpbGVzXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICBmaWxlczogY3JlYXRlTW9ja0RvY3VtZW50TGlzdCg1KSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgdmFsdWUuZXh0ZW5zaW9uIGZvciBmaWxlIGljb24nLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja0RvY3VtZW50SXRlbSh7IG5hbWU6ICd0ZXN0LmRvY3gnLCBleHRlbnNpb246ICdkb2N4JyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtd29yZC1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBzdGF0ZSBtYW5hZ2VtZW50XG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIHBvcHVwIGNsb3NlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1vcGVuJywgJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0b2dnbGUgcG9wdXAgd2hlbiB0cmlnZ2VyIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcG9ydGFsIGNvbnRlbnQgZm9yIGRvY3VtZW50IHNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIFBvcnRhbCBjb250ZW50IGlzIGFsd2F5cyByZW5kZXJlZCBpbiBvdXIgbW9jayBmb3IgdGVzdGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGNhbGxiYWNrIHN0YWJpbGl0eSBhbmQgbWVtb2l6YXRpb25cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBvbkNoYW5nZSBjYWxsYmFjayB3aGVuIHZhbHVlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhbHVlMSA9IGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBpZDogJ2RvYy0xJywgbmFtZTogJ0RvYyAxJyB9KVxuICAgICAgY29uc3QgdmFsdWUyID0gY3JlYXRlTW9ja0RvY3VtZW50SXRlbSh7IGlkOiAnZG9jLTInLCBuYW1lOiAnRG9jIDInIH0pXG5cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFByZXZpZXdEb2N1bWVudFBpY2tlclxuICAgICAgICAgIHZhbHVlPXt2YWx1ZTF9XG4gICAgICAgICAgZmlsZXM9e2NyZWF0ZU1vY2tEb2N1bWVudExpc3QoMyl9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxQcmV2aWV3RG9jdW1lbnRQaWNrZXJcbiAgICAgICAgICB2YWx1ZT17dmFsdWUyfVxuICAgICAgICAgIGZpbGVzPXtjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDMpfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEb2MgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHVwZGF0ZWQgb25DaGFuZ2UgY2FsbGJhY2sgYWZ0ZXIgcmVyZW5kZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZTEgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkNoYW5nZTIgPSB2aS5mbigpXG4gICAgICBjb25zdCB2YWx1ZSA9IGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oKVxuICAgICAgY29uc3QgZmlsZXMgPSBjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDMpXG5cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFByZXZpZXdEb2N1bWVudFBpY2tlciB2YWx1ZT17dmFsdWV9IGZpbGVzPXtmaWxlc30gb25DaGFuZ2U9e29uQ2hhbmdlMX0gLz4sXG4gICAgICApXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UHJldmlld0RvY3VtZW50UGlja2VyIHZhbHVlPXt2YWx1ZX0gZmlsZXM9e2ZpbGVzfSBvbkNoYW5nZT17b25DaGFuZ2UyfSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGNvbXBvbmVudCBtZW1vaXphdGlvblxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKFByZXZpZXdEb2N1bWVudFBpY2tlciBhcyBhbnkpLiQkdHlwZW9mKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlLXJlbmRlciB3aGVuIHByb3BzIGFyZSB0aGUgc2FtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgdmFsdWUgPSBjcmVhdGVNb2NrRG9jdW1lbnRJdGVtKClcbiAgICAgIGNvbnN0IGZpbGVzID0gY3JlYXRlTW9ja0RvY3VtZW50TGlzdCgzKVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxQcmV2aWV3RG9jdW1lbnRQaWNrZXIgdmFsdWU9e3ZhbHVlfSBmaWxlcz17ZmlsZXN9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4sXG4gICAgICApXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UHJldmlld0RvY3VtZW50UGlja2VyIHZhbHVlPXt2YWx1ZX0gZmlsZXM9e2ZpbGVzfSBvbkNoYW5nZT17b25DaGFuZ2V9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgdXNlciBpbnRlcmFjdGlvbnNcbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdG9nZ2xlIHBvcHVwIHdoZW4gdHJpZ2dlciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRvY3VtZW50IGxpc3Qgd2l0aCBmaWxlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVzID0gY3JlYXRlTW9ja0RvY3VtZW50TGlzdCgzKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgZmlsZXMgfSlcblxuICAgICAgLy8gRG9jdW1lbnRzIHNob3VsZCBiZSB2aXNpYmxlIGluIHRoZSBsaXN0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnQgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnQgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnQgMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aGVuIGRvY3VtZW50IGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBmaWxlcyA9IGNyZWF0ZU1vY2tEb2N1bWVudExpc3QoMylcblxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgZmlsZXMsIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIENsaWNrIG9uIGEgZG9jdW1lbnRcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdEb2N1bWVudCAyJykpXG5cbiAgICAgIC8vIGhhbmRsZUNoYW5nZSBzaG91bGQgY2FsbCBvbkNoYW5nZSB3aXRoIHRoZSBzZWxlY3RlZCBpdGVtXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlc1sxXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmFwaWQgdG9nZ2xlIGNsaWNrcycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcblxuICAgICAgLy8gUmFwaWQgY2xpY2tzXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBlZGdlIGNhc2VzXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgdmFsdWUgcHJvcGVydGllcyBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHsgaWQ6ICdkb2MtMScsIG5hbWU6ICcnLCBleHRlbnNpb246ICcnIH0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnLS0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aGVuIHZhbHVlIHByb3AgaXMgb21pdHRlZCAob3B0aW9uYWwpJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDIpXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIC8vIERvIG5vdCBwYXNzIGB2YWx1ZWAgYXQgYWxsIHRvIHZlcmlmeSBvcHRpb25hbCBiZWhhdmlvclxuICAgICAgcmVuZGVyKDxQcmV2aWV3RG9jdW1lbnRQaWNrZXIgZmlsZXM9e2ZpbGVzfSBvbkNoYW5nZT17b25DaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBSZW5kZXJzIHBsYWNlaG9sZGVyIGZvciBtaXNzaW5nIG5hbWVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCctLScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBQb3J0YWwgd3JhcHBlciByZW5kZXJzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGZpbGVzIGFycmF5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgZmlsZXM6IFtdIH0pXG5cbiAgICAgIC8vIENvbXBvbmVudCBzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGRvY3VtZW50IG5hbWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ05hbWUgPSAnQScucmVwZWF0KDUwMClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrRG9jdW1lbnRJdGVtKHsgbmFtZTogbG9uZ05hbWUgfSksXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nTmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGRvY3VtZW50IG5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjaWFsTmFtZSA9ICc8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+J1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBuYW1lOiBzcGVjaWFsTmFtZSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxOYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgZmlsZXMgcHJvcCcsICgpID0+IHtcbiAgICAgIC8vIFRlc3QgZWRnZSBjYXNlIHdoZXJlIGZpbGVzIG1pZ2h0IGJlIHVuZGVmaW5lZCBhdCBydW50aW1lXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIC0gVGVzdGluZyBydW50aW1lIGVkZ2UgY2FzZVxuICAgICAgcHJvcHMuZmlsZXMgPSB1bmRlZmluZWRcblxuICAgICAgcmVuZGVyKDxQcmV2aWV3RG9jdW1lbnRQaWNrZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsYXJnZSBudW1iZXIgb2YgZmlsZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYW55RmlsZXMgPSBjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDEwMClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGZpbGVzOiBtYW55RmlsZXMgfSlcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCBhY2NlcHQgbGFyZ2UgZmlsZXMgYXJyYXlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZXMgd2l0aCBzYW1lIG5hbWUgYnV0IGRpZmZlcmVudCBleHRlbnNpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBpZDogJ2RvYy0xJywgbmFtZTogJ2RvY3VtZW50JywgZXh0ZW5zaW9uOiAncGRmJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0RvY3VtZW50SXRlbSh7IGlkOiAnZG9jLTInLCBuYW1lOiAnZG9jdW1lbnQnLCBleHRlbnNpb246ICd0eHQnIH0pLFxuICAgICAgXVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgZmlsZXMgfSlcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCBoYW5kbGUgZHVwbGljYXRlIG5hbWVzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgcHJvcCB2YXJpYXRpb25zXG4gIGRlc2NyaWJlKCdQcm9wIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3ZhbHVlIHZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB2YWx1ZSB3aXRoIGFsbCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIGlkOiAnZnVsbC1kb2MnLFxuICAgICAgICAgICAgbmFtZTogJ0Z1bGwgRG9jdW1lbnQnLFxuICAgICAgICAgICAgZXh0ZW5zaW9uOiAncGRmJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdGdWxsIERvY3VtZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhbHVlIHdpdGggbWluaW1hbCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgICAgdmFsdWU6IHsgaWQ6ICdtaW5pbWFsJywgbmFtZTogJycsIGV4dGVuc2lvbjogJycgfSxcbiAgICAgICAgfSlcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnLS0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2ZpbGVzIHZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBzaW5nbGUgZmlsZScsICgpID0+IHtcbiAgICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgICBmaWxlczogW2NyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBuYW1lOiAnU2luZ2xlJyB9KV0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdHdvIGZpbGVzJywgKCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICAgIGZpbGVzOiBjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDIpLFxuICAgICAgICB9KVxuXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIG1hbnkgZmlsZXMnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgICAgZmlsZXM6IGNyZWF0ZU1vY2tEb2N1bWVudExpc3QoNTApLFxuICAgICAgICB9KVxuXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdjbGFzc05hbWUgdmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgICAgcmVuZGVyQ29tcG9uZW50KHsgY2xhc3NOYW1lOiAnbXktY3VzdG9tLWNsYXNzJyB9KVxuXG4gICAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgICAgZXhwZWN0KHRyaWdnZXIucXVlcnlTZWxlY3RvcignLm15LWN1c3RvbS1jbGFzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aG91dCBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7IGNsYXNzTmFtZTogdW5kZWZpbmVkIH0pXG5cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgY2xhc3MgbmFtZXMnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7IGNsYXNzTmFtZTogJ2NsYXNzLW9uZSBjbGFzcy10d28nIH0pXG5cbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdHJpZ2dlci5xdWVyeVNlbGVjdG9yKCcuY2xhc3Mtb25lJylcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdjbGFzcy10d28nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2V4dGVuc2lvbiB2YXJpYXRpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXh0ZW5zaW9ucyA9IFtcbiAgICAgICAgeyBleHQ6ICd0eHQnLCBpY29uOiAnZmlsZS10ZXh0LWljb24nIH0sXG4gICAgICAgIHsgZXh0OiAncGRmJywgaWNvbjogJ2ZpbGUtcGRmLWljb24nIH0sXG4gICAgICAgIHsgZXh0OiAnZG9jeCcsIGljb246ICdmaWxlLXdvcmQtaWNvbicgfSxcbiAgICAgICAgeyBleHQ6ICd4bHN4JywgaWNvbjogJ2ZpbGUtZXhjZWwtaWNvbicgfSxcbiAgICAgICAgeyBleHQ6ICdtZCcsIGljb246ICdmaWxlLW1hcmtkb3duLWljb24nIH0sXG4gICAgICBdXG5cbiAgICAgIGl0LmVhY2goZXh0ZW5zaW9ucykoJ3Nob3VsZCByZW5kZXIgY29ycmVjdCBpY29uIGZvciAkZXh0IGV4dGVuc2lvbicsICh7IGV4dCwgaWNvbiB9KSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBleHRlbnNpb246IGV4dCB9KSxcbiAgICAgICAgICBmaWxlczogW10sIC8vIFVzZSBlbXB0eSBmaWxlcyB0byBhdm9pZCBkdXBsaWNhdGUgaWNvbnNcbiAgICAgICAgfSlcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKGljb24pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGRvY3VtZW50IGxpc3QgcmVuZGVyaW5nXG4gIGRlc2NyaWJlKCdEb2N1bWVudCBMaXN0IFJlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgZG9jdW1lbnRzIGluIHRoZSBsaXN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDUpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBmaWxlcyB9KVxuXG4gICAgICAvLyBBbGwgZG9jdW1lbnRzIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGZpbGUubmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBvbkNoYW5nZSBoYW5kbGVyIHRvIERvY3VtZW50TGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZmlsZXMgPSBjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDMpXG5cbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGZpbGVzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBDbGljayBvbiBmaXJzdCBkb2N1bWVudFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RvY3VtZW50IDEnKSlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlc1swXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNvdW50IGhlYWRlciBvbmx5IGZvciBtdWx0aXBsZSBmaWxlcycsICgpID0+IHtcbiAgICAgIC8vIFNpbmdsZSBmaWxlIC0gbm8gaGVhZGVyXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxQcmV2aWV3RG9jdW1lbnRQaWNrZXJcbiAgICAgICAgICB2YWx1ZT17Y3JlYXRlTW9ja0RvY3VtZW50SXRlbSgpfVxuICAgICAgICAgIGZpbGVzPXtbY3JlYXRlTW9ja0RvY3VtZW50SXRlbSh7IG5hbWU6ICdTaW5nbGUgRmlsZScgfSldfVxuICAgICAgICAgIG9uQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL2ZpbGVzLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIE11bHRpcGxlIGZpbGVzIC0gc2hvdyBoZWFkZXJcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UHJldmlld0RvY3VtZW50UGlja2VyXG4gICAgICAgICAgdmFsdWU9e2NyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oKX1cbiAgICAgICAgICBmaWxlcz17Y3JlYXRlTW9ja0RvY3VtZW50TGlzdCgzKX1cbiAgICAgICAgICBvbkNoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMyBmaWxlcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgdmlzdWFsIHN0YXRlc1xuICBkZXNjcmliZSgnVmlzdWFsIFN0YXRlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGhvdmVyIHN0eWxlcyBvbiB0cmlnZ2VyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgY29uc3QgaW5uZXJEaXYgPSB0cmlnZ2VyLnF1ZXJ5U2VsZWN0b3IoJy5ob3ZlclxcXFw6Ymctc3RhdGUtYmFzZS1ob3ZlcicpXG4gICAgICBleHBlY3QoaW5uZXJEaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHRydW5jYXRlIGNsYXNzIGZvciBsb25nIG5hbWVzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBuYW1lOiAnVmVyeSBMb25nIERvY3VtZW50IE5hbWUnIH0pLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgbmFtZUVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdWZXJ5IExvbmcgRG9jdW1lbnQgTmFtZScpXG4gICAgICBleHBlY3QobmFtZUVsZW1lbnQpLnRvSGF2ZUNsYXNzKCd0cnVuY2F0ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBtYXgtd2lkdGggb24gbmFtZSBlbGVtZW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tEb2N1bWVudEl0ZW0oeyBuYW1lOiAnVGVzdCcgfSksXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBuYW1lRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QnKVxuICAgICAgZXhwZWN0KG5hbWVFbGVtZW50KS50b0hhdmVDbGFzcygnbWF4LXctWzIwMHB4XScpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgaGFuZGxlQ2hhbmdlIGNhbGxiYWNrXG4gIGRlc2NyaWJlKCdoYW5kbGVDaGFuZ2UgQ2FsbGJhY2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggc2VsZWN0ZWQgZG9jdW1lbnQgaXRlbScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZmlsZXMgPSBjcmVhdGVNb2NrRG9jdW1lbnRMaXN0KDMpXG5cbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGZpbGVzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBDbGljayBmaXJzdCBkb2N1bWVudFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RvY3VtZW50IDEnKSlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlc1swXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IGRvY3VtZW50IGl0ZW1zIGluIGZpbGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBjdXN0b21GaWxlcyA9IFtcbiAgICAgICAgeyBpZDogJ2N1c3RvbS0xJywgbmFtZTogJ0N1c3RvbSBGaWxlIDEnLCBleHRlbnNpb246ICdwZGYnIH0sXG4gICAgICAgIHsgaWQ6ICdjdXN0b20tMicsIG5hbWU6ICdDdXN0b20gRmlsZSAyJywgZXh0ZW5zaW9uOiAndHh0JyB9LFxuICAgICAgXVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBmaWxlczogY3VzdG9tRmlsZXMsIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIENsaWNrIG9uIGZpcnN0IGN1c3RvbSBmaWxlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tIEZpbGUgMScpKVxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjdXN0b21GaWxlc1swXSlcblxuICAgICAgLy8gQ2xpY2sgb24gc2Vjb25kIGN1c3RvbSBmaWxlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tIEZpbGUgMicpKVxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjdXN0b21GaWxlc1sxXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggbXVsdGlwbGUgc2VxdWVudGlhbCBzZWxlY3Rpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBmaWxlcyA9IGNyZWF0ZU1vY2tEb2N1bWVudExpc3QoMylcblxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgZmlsZXMsIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIFNlbGVjdCBtdWx0aXBsZSBkb2N1bWVudHMgc2VxdWVudGlhbGx5XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnQgMScpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RvY3VtZW50IDMnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdEb2N1bWVudCAyJykpXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5OdGhDYWxsZWRXaXRoKDEsIGZpbGVzWzBdKVxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgyLCBmaWxlc1syXSlcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbk50aENhbGxlZFdpdGgoMywgZmlsZXNbMV0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=