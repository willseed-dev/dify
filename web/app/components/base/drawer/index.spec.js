"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
// Capture dialog onClose for testing
let capturedDialogOnClose = null;
// Mock @headlessui/react
vi.mock('@headlessui/react', () => ({
    Dialog: ({ children, open, onClose, className, unmount }) => {
        capturedDialogOnClose = onClose;
        if (!open)
            return null;
        return (<div data-testid="dialog" data-open={open} data-unmount={unmount} className={className} role="dialog">
        {children}
      </div>);
    },
    DialogBackdrop: ({ children, className, onClick }) => (<div data-testid="dialog-backdrop" className={className} onClick={onClick}>
      {children}
    </div>),
    DialogTitle: ({ children, as: _as, className, ...props }) => (<div data-testid="dialog-title" className={className} {...props}>
      {children}
    </div>),
}));
// Mock XMarkIcon
vi.mock('@heroicons/react/24/outline', () => ({
    XMarkIcon: ({ className, onClick }) => (<svg data-testid="close-icon" className={className} onClick={onClick}/>),
}));
// Helper function to render Drawer with default props
const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div data-testid="drawer-content">Content</div>,
};
const renderDrawer = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    return (0, react_1.render)(<index_1.default {...mergedProps}/>);
};
describe('Drawer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        capturedDialogOnClose = null;
    });
    // Basic rendering tests
    describe('Rendering', () => {
        it('should render when isOpen is true', () => {
            // Arrange & Act
            renderDrawer({ isOpen: true });
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('drawer-content')).toBeInTheDocument();
        });
        it('should not render when isOpen is false', () => {
            // Arrange & Act
            renderDrawer({ isOpen: false });
            // Assert
            expect(react_1.screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        it('should render children content', () => {
            // Arrange
            const childContent = <p data-testid="custom-child">Custom Content</p>;
            // Act
            renderDrawer({ children: childContent });
            // Assert
            expect(react_1.screen.getByTestId('custom-child')).toBeInTheDocument();
            expect(react_1.screen.getByText('Custom Content')).toBeInTheDocument();
        });
    });
    // Title and description tests
    describe('Title and Description', () => {
        it('should render title when provided', () => {
            // Arrange & Act
            renderDrawer({ title: 'Test Title' });
            // Assert
            expect(react_1.screen.getByText('Test Title')).toBeInTheDocument();
        });
        it('should not render title when not provided', () => {
            // Arrange & Act
            renderDrawer({ title: '' });
            // Assert
            const titles = react_1.screen.queryAllByTestId('dialog-title');
            const titleWithText = titles.find(el => el.textContent !== '');
            expect(titleWithText).toBeUndefined();
        });
        it('should render description when provided', () => {
            // Arrange & Act
            renderDrawer({ description: 'Test Description' });
            // Assert
            expect(react_1.screen.getByText('Test Description')).toBeInTheDocument();
        });
        it('should not render description when not provided', () => {
            // Arrange & Act
            renderDrawer({ description: '' });
            // Assert
            expect(react_1.screen.queryByText('Test Description')).not.toBeInTheDocument();
        });
        it('should render both title and description together', () => {
            // Arrange & Act
            renderDrawer({
                title: 'My Title',
                description: 'My Description',
            });
            // Assert
            expect(react_1.screen.getByText('My Title')).toBeInTheDocument();
            expect(react_1.screen.getByText('My Description')).toBeInTheDocument();
        });
    });
    // Close button tests
    describe('Close Button', () => {
        it('should render close icon when showClose is true', () => {
            // Arrange & Act
            renderDrawer({ showClose: true });
            // Assert
            expect(react_1.screen.getByTestId('close-icon')).toBeInTheDocument();
        });
        it('should not render close icon when showClose is false', () => {
            // Arrange & Act
            renderDrawer({ showClose: false });
            // Assert
            expect(react_1.screen.queryByTestId('close-icon')).not.toBeInTheDocument();
        });
        it('should not render close icon by default', () => {
            // Arrange & Act
            renderDrawer({});
            // Assert
            expect(react_1.screen.queryByTestId('close-icon')).not.toBeInTheDocument();
        });
        it('should call onClose when close icon is clicked', () => {
            // Arrange
            const onClose = vi.fn();
            renderDrawer({ showClose: true, onClose });
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('close-icon'));
            // Assert
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });
    // Backdrop/Mask tests
    describe('Backdrop and Mask', () => {
        it('should render backdrop when noOverlay is false', () => {
            // Arrange & Act
            renderDrawer({ noOverlay: false });
            // Assert
            expect(react_1.screen.getByTestId('dialog-backdrop')).toBeInTheDocument();
        });
        it('should not render backdrop when noOverlay is true', () => {
            // Arrange & Act
            renderDrawer({ noOverlay: true });
            // Assert
            expect(react_1.screen.queryByTestId('dialog-backdrop')).not.toBeInTheDocument();
        });
        it('should apply mask background when mask is true', () => {
            // Arrange & Act
            renderDrawer({ mask: true });
            // Assert
            const backdrop = react_1.screen.getByTestId('dialog-backdrop');
            expect(backdrop.className).toContain('bg-black/30');
        });
        it('should not apply mask background when mask is false', () => {
            // Arrange & Act
            renderDrawer({ mask: false });
            // Assert
            const backdrop = react_1.screen.getByTestId('dialog-backdrop');
            expect(backdrop.className).not.toContain('bg-black/30');
        });
        it('should call onClose when backdrop is clicked and clickOutsideNotOpen is false', () => {
            // Arrange
            const onClose = vi.fn();
            renderDrawer({ onClose, clickOutsideNotOpen: false });
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('dialog-backdrop'));
            // Assert
            expect(onClose).toHaveBeenCalledTimes(1);
        });
        it('should not call onClose when backdrop is clicked and clickOutsideNotOpen is true', () => {
            // Arrange
            const onClose = vi.fn();
            renderDrawer({ onClose, clickOutsideNotOpen: true });
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('dialog-backdrop'));
            // Assert
            expect(onClose).not.toHaveBeenCalled();
        });
    });
    // Footer tests
    describe('Footer', () => {
        it('should render default footer with cancel and save buttons when footer is undefined', () => {
            // Arrange & Act
            renderDrawer({ footer: undefined });
            // Assert
            expect(react_1.screen.getByText('common.operation.cancel')).toBeInTheDocument();
            expect(react_1.screen.getByText('common.operation.save')).toBeInTheDocument();
        });
        it('should not render footer when footer is null', () => {
            // Arrange & Act
            renderDrawer({ footer: null });
            // Assert
            expect(react_1.screen.queryByText('common.operation.cancel')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('common.operation.save')).not.toBeInTheDocument();
        });
        it('should render custom footer when provided', () => {
            // Arrange
            const customFooter = <div data-testid="custom-footer">Custom Footer</div>;
            // Act
            renderDrawer({ footer: customFooter });
            // Assert
            expect(react_1.screen.getByTestId('custom-footer')).toBeInTheDocument();
            expect(react_1.screen.queryByText('common.operation.cancel')).not.toBeInTheDocument();
        });
        it('should call onCancel when cancel button is clicked', () => {
            // Arrange
            const onCancel = vi.fn();
            renderDrawer({ onCancel });
            // Act
            const cancelButton = react_1.screen.getByText('common.operation.cancel');
            react_1.fireEvent.click(cancelButton);
            // Assert
            expect(onCancel).toHaveBeenCalledTimes(1);
        });
        it('should call onOk when save button is clicked', () => {
            // Arrange
            const onOk = vi.fn();
            renderDrawer({ onOk });
            // Act
            const saveButton = react_1.screen.getByText('common.operation.save');
            react_1.fireEvent.click(saveButton);
            // Assert
            expect(onOk).toHaveBeenCalledTimes(1);
        });
        it('should not throw when onCancel is not provided and cancel is clicked', () => {
            // Arrange
            renderDrawer({ onCancel: undefined });
            // Act & Assert
            expect(() => {
                react_1.fireEvent.click(react_1.screen.getByText('common.operation.cancel'));
            }).not.toThrow();
        });
        it('should not throw when onOk is not provided and save is clicked', () => {
            // Arrange
            renderDrawer({ onOk: undefined });
            // Act & Assert
            expect(() => {
                react_1.fireEvent.click(react_1.screen.getByText('common.operation.save'));
            }).not.toThrow();
        });
    });
    // Custom className tests
    describe('Custom ClassNames', () => {
        it('should apply custom dialogClassName', () => {
            // Arrange & Act
            renderDrawer({ dialogClassName: 'custom-dialog-class' });
            // Assert
            expect(react_1.screen.getByRole('dialog').className).toContain('custom-dialog-class');
        });
        it('should apply custom dialogBackdropClassName', () => {
            // Arrange & Act
            renderDrawer({ dialogBackdropClassName: 'custom-backdrop-class' });
            // Assert
            expect(react_1.screen.getByTestId('dialog-backdrop').className).toContain('custom-backdrop-class');
        });
        it('should apply custom containerClassName', () => {
            // Arrange & Act
            const { container } = renderDrawer({ containerClassName: 'custom-container-class' });
            // Assert
            const containerDiv = container.querySelector('.custom-container-class');
            expect(containerDiv).toBeInTheDocument();
        });
        it('should apply custom panelClassName', () => {
            // Arrange & Act
            const { container } = renderDrawer({ panelClassName: 'custom-panel-class' });
            // Assert
            const panelDiv = container.querySelector('.custom-panel-class');
            expect(panelDiv).toBeInTheDocument();
        });
    });
    // Position tests
    describe('Position', () => {
        it('should apply center position class when positionCenter is true', () => {
            // Arrange & Act
            const { container } = renderDrawer({ positionCenter: true });
            // Assert
            const containerDiv = container.querySelector('.\\!justify-center');
            expect(containerDiv).toBeInTheDocument();
        });
        it('should use end position by default when positionCenter is false', () => {
            // Arrange & Act
            const { container } = renderDrawer({ positionCenter: false });
            // Assert
            const containerDiv = container.querySelector('.justify-end');
            expect(containerDiv).toBeInTheDocument();
        });
    });
    // Unmount prop tests
    describe('Unmount Prop', () => {
        it('should pass unmount prop to Dialog component', () => {
            // Arrange & Act
            renderDrawer({ unmount: true });
            // Assert
            expect(react_1.screen.getByTestId('dialog').getAttribute('data-unmount')).toBe('true');
        });
        it('should default unmount to false', () => {
            // Arrange & Act
            renderDrawer({});
            // Assert
            expect(react_1.screen.getByTestId('dialog').getAttribute('data-unmount')).toBe('false');
        });
    });
    // Edge cases
    describe('Edge Cases', () => {
        it('should handle empty string title', () => {
            // Arrange & Act
            renderDrawer({ title: '' });
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('should handle empty string description', () => {
            // Arrange & Act
            renderDrawer({ description: '' });
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('should handle special characters in title', () => {
            // Arrange
            const specialTitle = '<script>alert("xss")</script>';
            // Act
            renderDrawer({ title: specialTitle });
            // Assert
            expect(react_1.screen.getByText(specialTitle)).toBeInTheDocument();
        });
        it('should handle very long title', () => {
            // Arrange
            const longTitle = 'A'.repeat(500);
            // Act
            renderDrawer({ title: longTitle });
            // Assert
            expect(react_1.screen.getByText(longTitle)).toBeInTheDocument();
        });
        it('should handle complex children with multiple elements', () => {
            // Arrange
            const complexChildren = (<div data-testid="complex-children">
          <h1>Heading</h1>
          <p>Paragraph</p>
          <input data-testid="input-element"/>
          <button data-testid="button-element">Button</button>
        </div>);
            // Act
            renderDrawer({ children: complexChildren });
            // Assert
            expect(react_1.screen.getByTestId('complex-children')).toBeInTheDocument();
            expect(react_1.screen.getByText('Heading')).toBeInTheDocument();
            expect(react_1.screen.getByText('Paragraph')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('input-element')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('button-element')).toBeInTheDocument();
        });
        it('should handle null children gracefully', () => {
            // Arrange & Act
            renderDrawer({ children: null });
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('should handle undefined footer without crashing', () => {
            // Arrange & Act
            renderDrawer({ footer: undefined });
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('should handle rapid open/close toggles', () => {
            // Arrange
            const onClose = vi.fn();
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} isOpen={true} onClose={onClose}>
          <div>Content</div>
        </index_1.default>);
            // Act - Toggle multiple times
            rerender(<index_1.default {...defaultProps} isOpen={false} onClose={onClose}>
          <div>Content</div>
        </index_1.default>);
            rerender(<index_1.default {...defaultProps} isOpen={true} onClose={onClose}>
          <div>Content</div>
        </index_1.default>);
            rerender(<index_1.default {...defaultProps} isOpen={false} onClose={onClose}>
          <div>Content</div>
        </index_1.default>);
            // Assert
            expect(react_1.screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
    // Combined prop scenarios
    describe('Combined Prop Scenarios', () => {
        it('should render with all optional props', () => {
            // Arrange & Act
            renderDrawer({
                title: 'Full Feature Title',
                description: 'Full Feature Description',
                dialogClassName: 'custom-dialog',
                dialogBackdropClassName: 'custom-backdrop',
                containerClassName: 'custom-container',
                panelClassName: 'custom-panel',
                showClose: true,
                mask: true,
                positionCenter: true,
                unmount: true,
                noOverlay: false,
                footer: <div data-testid="custom-full-footer">Footer</div>,
            });
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
            expect(react_1.screen.getByText('Full Feature Title')).toBeInTheDocument();
            expect(react_1.screen.getByText('Full Feature Description')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('close-icon')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('custom-full-footer')).toBeInTheDocument();
        });
        it('should render minimal drawer with only required props', () => {
            // Arrange
            const minimalProps = {
                isOpen: true,
                onClose: vi.fn(),
                children: <div>Minimal Content</div>,
            };
            // Act
            (0, react_1.render)(<index_1.default {...minimalProps}/>);
            // Assert
            expect(react_1.screen.getByRole('dialog')).toBeInTheDocument();
            expect(react_1.screen.getByText('Minimal Content')).toBeInTheDocument();
        });
        it('should handle showClose with title simultaneously', () => {
            // Arrange & Act
            renderDrawer({
                title: 'Title with Close',
                showClose: true,
            });
            // Assert
            expect(react_1.screen.getByText('Title with Close')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('close-icon')).toBeInTheDocument();
        });
        it('should handle noOverlay with clickOutsideNotOpen', () => {
            // Arrange
            const onClose = vi.fn();
            // Act
            renderDrawer({
                noOverlay: true,
                clickOutsideNotOpen: true,
                onClose,
            });
            // Assert - backdrop should not exist
            expect(react_1.screen.queryByTestId('dialog-backdrop')).not.toBeInTheDocument();
        });
    });
    // Dialog onClose callback tests (e.g., Escape key)
    describe('Dialog onClose Callback', () => {
        it('should call onClose when Dialog triggers close and clickOutsideNotOpen is false', () => {
            // Arrange
            const onClose = vi.fn();
            renderDrawer({ onClose, clickOutsideNotOpen: false });
            // Act - Simulate Dialog's onClose (e.g., pressing Escape)
            capturedDialogOnClose?.();
            // Assert
            expect(onClose).toHaveBeenCalledTimes(1);
        });
        it('should not call onClose when Dialog triggers close and clickOutsideNotOpen is true', () => {
            // Arrange
            const onClose = vi.fn();
            renderDrawer({ onClose, clickOutsideNotOpen: true });
            // Act - Simulate Dialog's onClose (e.g., pressing Escape)
            capturedDialogOnClose?.();
            // Assert
            expect(onClose).not.toHaveBeenCalled();
        });
        it('should call onClose by default when Dialog triggers close', () => {
            // Arrange
            const onClose = vi.fn();
            renderDrawer({ onClose });
            // Act
            capturedDialogOnClose?.();
            // Assert
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });
    // Event handler interaction tests
    describe('Event Handler Interactions', () => {
        it('should handle multiple consecutive close icon clicks', () => {
            // Arrange
            const onClose = vi.fn();
            renderDrawer({ showClose: true, onClose });
            // Act
            const closeIcon = react_1.screen.getByTestId('close-icon');
            react_1.fireEvent.click(closeIcon);
            react_1.fireEvent.click(closeIcon);
            react_1.fireEvent.click(closeIcon);
            // Assert
            expect(onClose).toHaveBeenCalledTimes(3);
        });
        it('should handle onCancel and onOk being the same function', () => {
            // Arrange
            const handler = vi.fn();
            renderDrawer({ onCancel: handler, onOk: handler });
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.cancel'));
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.save'));
            // Assert
            expect(handler).toHaveBeenCalledTimes(2);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixtQ0FBNEI7QUFFNUIscUNBQXFDO0FBQ3JDLElBQUkscUJBQXFCLEdBQXdCLElBQUksQ0FBQTtBQUVyRCx5QkFBeUI7QUFDekIsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFNckQsRUFBRSxFQUFFO1FBQ0gscUJBQXFCLEdBQUcsT0FBTyxDQUFBO1FBQy9CLElBQUksQ0FBQyxJQUFJO1lBQ1AsT0FBTyxJQUFJLENBQUE7UUFDYixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsV0FBVyxDQUFDLFFBQVEsQ0FDcEIsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2hCLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUN0QixTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDckIsSUFBSSxDQUFDLFFBQVEsQ0FFYjtRQUFBLENBQUMsUUFBUSxDQUNYO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0lBQ0gsQ0FBQztJQUNELGNBQWMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBSTlDLEVBQUUsRUFBRSxDQUFDLENBQ0osQ0FBQyxHQUFHLENBQ0YsV0FBVyxDQUFDLGlCQUFpQixDQUM3QixTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDckIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBRWpCO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QsV0FBVyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFB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QUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUE7WUFFMUQsU0FBUztZQUNULE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMxQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IElEcmF3ZXJQcm9wcyB9IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IERyYXdlciBmcm9tICcuL2luZGV4J1xuXG4vLyBDYXB0dXJlIGRpYWxvZyBvbkNsb3NlIGZvciB0ZXN0aW5nXG5sZXQgY2FwdHVyZWREaWFsb2dPbkNsb3NlOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuXG4vLyBNb2NrIEBoZWFkbGVzc3VpL3JlYWN0XG52aS5tb2NrKCdAaGVhZGxlc3N1aS9yZWFjdCcsICgpID0+ICh7XG4gIERpYWxvZzogKHsgY2hpbGRyZW4sIG9wZW4sIG9uQ2xvc2UsIGNsYXNzTmFtZSwgdW5tb3VudCB9OiB7XG4gICAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZVxuICAgIG9wZW46IGJvb2xlYW5cbiAgICBvbkNsb3NlOiAoKSA9PiB2b2lkXG4gICAgY2xhc3NOYW1lOiBzdHJpbmdcbiAgICB1bm1vdW50OiBib29sZWFuXG4gIH0pID0+IHtcbiAgICBjYXB0dXJlZERpYWxvZ09uQ2xvc2UgPSBvbkNsb3NlXG4gICAgaWYgKCFvcGVuKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBkYXRhLXRlc3RpZD1cImRpYWxvZ1wiXG4gICAgICAgIGRhdGEtb3Blbj17b3Blbn1cbiAgICAgICAgZGF0YS11bm1vdW50PXt1bm1vdW50fVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbiAgRGlhbG9nQmFja2Ryb3A6ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIG9uQ2xpY2sgfToge1xuICAgIGNoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlXG4gICAgY2xhc3NOYW1lOiBzdHJpbmdcbiAgICBvbkNsaWNrOiAoKSA9PiB2b2lkXG4gIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD1cImRpYWxvZy1iYWNrZHJvcFwiXG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBEaWFsb2dUaXRsZTogKHsgY2hpbGRyZW4sIGFzOiBfYXMsIGNsYXNzTmFtZSwgLi4ucHJvcHMgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBhcz86IHN0cmluZ1xuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImRpYWxvZy10aXRsZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSB7Li4ucHJvcHN9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgWE1hcmtJY29uXG52aS5tb2NrKCdAaGVyb2ljb25zL3JlYWN0LzI0L291dGxpbmUnLCAoKSA9PiAoe1xuICBYTWFya0ljb246ICh7IGNsYXNzTmFtZSwgb25DbGljayB9OiB7IGNsYXNzTmFtZTogc3RyaW5nLCBvbkNsaWNrPzogKCkgPT4gdm9pZCB9KSA9PiAoXG4gICAgPHN2ZyBkYXRhLXRlc3RpZD1cImNsb3NlLWljb25cIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gb25DbGljaz17b25DbGlja30gLz5cbiAgKSxcbn0pKVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gcmVuZGVyIERyYXdlciB3aXRoIGRlZmF1bHQgcHJvcHNcbmNvbnN0IGRlZmF1bHRQcm9wczogSURyYXdlclByb3BzID0ge1xuICBpc09wZW46IHRydWUsXG4gIG9uQ2xvc2U6IHZpLmZuKCksXG4gIGNoaWxkcmVuOiA8ZGl2IGRhdGEtdGVzdGlkPVwiZHJhd2VyLWNvbnRlbnRcIj5Db250ZW50PC9kaXY+LFxufVxuXG5jb25zdCByZW5kZXJEcmF3ZXIgPSAocHJvcHM6IFBhcnRpYWw8SURyYXdlclByb3BzPiA9IHt9KSA9PiB7XG4gIGNvbnN0IG1lcmdlZFByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMsIC4uLnByb3BzIH1cbiAgcmV0dXJuIHJlbmRlcig8RHJhd2VyIHsuLi5tZXJnZWRQcm9wc30gLz4pXG59XG5cbmRlc2NyaWJlKCdEcmF3ZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIGNhcHR1cmVkRGlhbG9nT25DbG9zZSA9IG51bGxcbiAgfSlcblxuICAvLyBCYXNpYyByZW5kZXJpbmcgdGVzdHNcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aGVuIGlzT3BlbiBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHsgaXNPcGVuOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkcmF3ZXItY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB3aGVuIGlzT3BlbiBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGlzT3BlbjogZmFsc2UgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdkaWFsb2cnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2hpbGRyZW4gY29udGVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNoaWxkQ29udGVudCA9IDxwIGRhdGEtdGVzdGlkPVwiY3VzdG9tLWNoaWxkXCI+Q3VzdG9tIENvbnRlbnQ8L3A+XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHsgY2hpbGRyZW46IGNoaWxkQ29udGVudCB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1jaGlsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tIENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGl0bGUgYW5kIGRlc2NyaXB0aW9uIHRlc3RzXG4gIGRlc2NyaWJlKCdUaXRsZSBhbmQgRGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGl0bGUgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IHRpdGxlOiAnVGVzdCBUaXRsZScgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB0aXRsZSB3aGVuIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IHRpdGxlOiAnJyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRpdGxlcyA9IHNjcmVlbi5xdWVyeUFsbEJ5VGVzdElkKCdkaWFsb2ctdGl0bGUnKVxuICAgICAgY29uc3QgdGl0bGVXaXRoVGV4dCA9IHRpdGxlcy5maW5kKGVsID0+IGVsLnRleHRDb250ZW50ICE9PSAnJylcbiAgICAgIGV4cGVjdCh0aXRsZVdpdGhUZXh0KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGVzY3JpcHRpb24gd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGRlc2NyaXB0aW9uOiAnVGVzdCBEZXNjcmlwdGlvbicgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBEZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBkZXNjcmlwdGlvbiB3aGVuIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGRlc2NyaXB0aW9uOiAnJyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ1Rlc3QgRGVzY3JpcHRpb24nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYm90aCB0aXRsZSBhbmQgZGVzY3JpcHRpb24gdG9nZXRoZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJEcmF3ZXIoe1xuICAgICAgICB0aXRsZTogJ015IFRpdGxlJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdNeSBEZXNjcmlwdGlvbicsXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNeSBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTXkgRGVzY3JpcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQ2xvc2UgYnV0dG9uIHRlc3RzXG4gIGRlc2NyaWJlKCdDbG9zZSBCdXR0b24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xvc2UgaWNvbiB3aGVuIHNob3dDbG9zZSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHsgc2hvd0Nsb3NlOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2xvc2UtaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBjbG9zZSBpY29uIHdoZW4gc2hvd0Nsb3NlIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHsgc2hvd0Nsb3NlOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY2xvc2UtaWNvbicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgY2xvc2UgaWNvbiBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHt9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY2xvc2UtaWNvbicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIGNsb3NlIGljb24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJEcmF3ZXIoeyBzaG93Q2xvc2U6IHRydWUsIG9uQ2xvc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1pY29uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQmFja2Ryb3AvTWFzayB0ZXN0c1xuICBkZXNjcmliZSgnQmFja2Ryb3AgYW5kIE1hc2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYmFja2Ryb3Agd2hlbiBub092ZXJsYXkgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJEcmF3ZXIoeyBub092ZXJsYXk6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZGlhbG9nLWJhY2tkcm9wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGJhY2tkcm9wIHdoZW4gbm9PdmVybGF5IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJEcmF3ZXIoeyBub092ZXJsYXk6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2RpYWxvZy1iYWNrZHJvcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IG1hc2sgYmFja2dyb3VuZCB3aGVuIG1hc2sgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IG1hc2s6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZGlhbG9nLWJhY2tkcm9wJylcbiAgICAgIGV4cGVjdChiYWNrZHJvcC5jbGFzc05hbWUpLnRvQ29udGFpbignYmctYmxhY2svMzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBhcHBseSBtYXNrIGJhY2tncm91bmQgd2hlbiBtYXNrIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHsgbWFzazogZmFsc2UgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZGlhbG9nLWJhY2tkcm9wJylcbiAgICAgIGV4cGVjdChiYWNrZHJvcC5jbGFzc05hbWUpLm5vdC50b0NvbnRhaW4oJ2JnLWJsYWNrLzMwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBiYWNrZHJvcCBpcyBjbGlja2VkIGFuZCBjbGlja091dHNpZGVOb3RPcGVuIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckRyYXdlcih7IG9uQ2xvc2UsIGNsaWNrT3V0c2lkZU5vdE9wZW46IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZGlhbG9nLWJhY2tkcm9wJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uQ2xvc2Ugd2hlbiBiYWNrZHJvcCBpcyBjbGlja2VkIGFuZCBjbGlja091dHNpZGVOb3RPcGVuIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyRHJhd2VyKHsgb25DbG9zZSwgY2xpY2tPdXRzaWRlTm90T3BlbjogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RpYWxvZy1iYWNrZHJvcCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNsb3NlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBGb290ZXIgdGVzdHNcbiAgZGVzY3JpYmUoJ0Zvb3RlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkZWZhdWx0IGZvb3RlciB3aXRoIGNhbmNlbCBhbmQgc2F2ZSBidXR0b25zIHdoZW4gZm9vdGVyIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGZvb3RlcjogdW5kZWZpbmVkIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNhdmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgZm9vdGVyIHdoZW4gZm9vdGVyIGlzIG51bGwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJEcmF3ZXIoeyBmb290ZXI6IG51bGwgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zYXZlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGN1c3RvbSBmb290ZXIgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGN1c3RvbUZvb3RlciA9IDxkaXYgZGF0YS10ZXN0aWQ9XCJjdXN0b20tZm9vdGVyXCI+Q3VzdG9tIEZvb3RlcjwvZGl2PlxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGZvb3RlcjogY3VzdG9tRm9vdGVyIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLWZvb3RlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DYW5jZWwgd2hlbiBjYW5jZWwgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNhbmNlbCA9IHZpLmZuKClcbiAgICAgIHJlbmRlckRyYXdlcih7IG9uQ2FuY2VsIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgY2FuY2VsQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNhbmNlbEJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DYW5jZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25PayB3aGVuIHNhdmUgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbk9rID0gdmkuZm4oKVxuICAgICAgcmVuZGVyRHJhd2VyKHsgb25PayB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHNhdmVCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNhdmUnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uT2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0aHJvdyB3aGVuIG9uQ2FuY2VsIGlzIG5vdCBwcm92aWRlZCBhbmQgY2FuY2VsIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJEcmF3ZXIoeyBvbkNhbmNlbDogdW5kZWZpbmVkIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJykpXG4gICAgICB9KS5ub3QudG9UaHJvdygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHRocm93IHdoZW4gb25PayBpcyBub3QgcHJvdmlkZWQgYW5kIHNhdmUgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlckRyYXdlcih7IG9uT2s6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNhdmUnKSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEN1c3RvbSBjbGFzc05hbWUgdGVzdHNcbiAgZGVzY3JpYmUoJ0N1c3RvbSBDbGFzc05hbWVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGRpYWxvZ0NsYXNzTmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGRpYWxvZ0NsYXNzTmFtZTogJ2N1c3RvbS1kaWFsb2ctY2xhc3MnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpLmNsYXNzTmFtZSkudG9Db250YWluKCdjdXN0b20tZGlhbG9nLWNsYXNzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gZGlhbG9nQmFja2Ryb3BDbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJEcmF3ZXIoeyBkaWFsb2dCYWNrZHJvcENsYXNzTmFtZTogJ2N1c3RvbS1iYWNrZHJvcC1jbGFzcycgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkaWFsb2ctYmFja2Ryb3AnKS5jbGFzc05hbWUpLnRvQ29udGFpbignY3VzdG9tLWJhY2tkcm9wLWNsYXNzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gY29udGFpbmVyQ2xhc3NOYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckRyYXdlcih7IGNvbnRhaW5lckNsYXNzTmFtZTogJ2N1c3RvbS1jb250YWluZXItY2xhc3MnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY29udGFpbmVyRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b20tY29udGFpbmVyLWNsYXNzJylcbiAgICAgIGV4cGVjdChjb250YWluZXJEaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gcGFuZWxDbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRHJhd2VyKHsgcGFuZWxDbGFzc05hbWU6ICdjdXN0b20tcGFuZWwtY2xhc3MnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcGFuZWxEaXYgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1c3RvbS1wYW5lbC1jbGFzcycpXG4gICAgICBleHBlY3QocGFuZWxEaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFBvc2l0aW9uIHRlc3RzXG4gIGRlc2NyaWJlKCdQb3NpdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNlbnRlciBwb3NpdGlvbiBjbGFzcyB3aGVuIHBvc2l0aW9uQ2VudGVyIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRHJhd2VyKHsgcG9zaXRpb25DZW50ZXI6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjb250YWluZXJEaXYgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLlxcXFwhanVzdGlmeS1jZW50ZXInKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lckRpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBlbmQgcG9zaXRpb24gYnkgZGVmYXVsdCB3aGVuIHBvc2l0aW9uQ2VudGVyIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckRyYXdlcih7IHBvc2l0aW9uQ2VudGVyOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNvbnRhaW5lckRpdiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuanVzdGlmeS1lbmQnKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lckRpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVW5tb3VudCBwcm9wIHRlc3RzXG4gIGRlc2NyaWJlKCdVbm1vdW50IFByb3AnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIHVubW91bnQgcHJvcCB0byBEaWFsb2cgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHsgdW5tb3VudDogdHJ1ZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RpYWxvZycpLmdldEF0dHJpYnV0ZSgnZGF0YS11bm1vdW50JykpLnRvQmUoJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRlZmF1bHQgdW5tb3VudCB0byBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7fSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkaWFsb2cnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdW5tb3VudCcpKS50b0JlKCdmYWxzZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyBFZGdlIGNhc2VzXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyB0aXRsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IHRpdGxlOiAnJyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdkaWFsb2cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgZGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJEcmF3ZXIoeyBkZXNjcmlwdGlvbjogJycgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnZGlhbG9nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHRpdGxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3BlY2lhbFRpdGxlID0gJzxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHsgdGl0bGU6IHNwZWNpYWxUaXRsZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxUaXRsZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIHRpdGxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ1RpdGxlID0gJ0EnLnJlcGVhdCg1MDApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHsgdGl0bGU6IGxvbmdUaXRsZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdUaXRsZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tcGxleCBjaGlsZHJlbiB3aXRoIG11bHRpcGxlIGVsZW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29tcGxleENoaWxkcmVuID0gKFxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY29tcGxleC1jaGlsZHJlblwiPlxuICAgICAgICAgIDxoMT5IZWFkaW5nPC9oMT5cbiAgICAgICAgICA8cD5QYXJhZ3JhcGg8L3A+XG4gICAgICAgICAgPGlucHV0IGRhdGEtdGVzdGlkPVwiaW5wdXQtZWxlbWVudFwiIC8+XG4gICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImJ1dHRvbi1lbGVtZW50XCI+QnV0dG9uPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGNoaWxkcmVuOiBjb21wbGV4Q2hpbGRyZW4gfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb21wbGV4LWNoaWxkcmVuJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdIZWFkaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQYXJhZ3JhcGgnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtZWxlbWVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdidXR0b24tZWxlbWVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgY2hpbGRyZW4gZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGNoaWxkcmVuOiBudWxsIGFzIHVua25vd24gYXMgUmVhY3QuUmVhY3ROb2RlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBmb290ZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckRyYXdlcih7IGZvb3RlcjogdW5kZWZpbmVkIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIG9wZW4vY2xvc2UgdG9nZ2xlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxEcmF3ZXIgey4uLmRlZmF1bHRQcm9wc30gaXNPcGVuPXt0cnVlfSBvbkNsb3NlPXtvbkNsb3NlfT5cbiAgICAgICAgICA8ZGl2PkNvbnRlbnQ8L2Rpdj5cbiAgICAgICAgPC9EcmF3ZXI+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3QgLSBUb2dnbGUgbXVsdGlwbGUgdGltZXNcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8RHJhd2VyIHsuLi5kZWZhdWx0UHJvcHN9IGlzT3Blbj17ZmFsc2V9IG9uQ2xvc2U9e29uQ2xvc2V9PlxuICAgICAgICAgIDxkaXY+Q29udGVudDwvZGl2PlxuICAgICAgICA8L0RyYXdlcj4sXG4gICAgICApXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPERyYXdlciB7Li4uZGVmYXVsdFByb3BzfSBpc09wZW49e3RydWV9IG9uQ2xvc2U9e29uQ2xvc2V9PlxuICAgICAgICAgIDxkaXY+Q29udGVudDwvZGl2PlxuICAgICAgICA8L0RyYXdlcj4sXG4gICAgICApXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPERyYXdlciB7Li4uZGVmYXVsdFByb3BzfSBpc09wZW49e2ZhbHNlfSBvbkNsb3NlPXtvbkNsb3NlfT5cbiAgICAgICAgICA8ZGl2PkNvbnRlbnQ8L2Rpdj5cbiAgICAgICAgPC9EcmF3ZXI+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2RpYWxvZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQ29tYmluZWQgcHJvcCBzY2VuYXJpb3NcbiAgZGVzY3JpYmUoJ0NvbWJpbmVkIFByb3AgU2NlbmFyaW9zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggYWxsIG9wdGlvbmFsIHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRHJhd2VyKHtcbiAgICAgICAgdGl0bGU6ICdGdWxsIEZlYXR1cmUgVGl0bGUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0Z1bGwgRmVhdHVyZSBEZXNjcmlwdGlvbicsXG4gICAgICAgIGRpYWxvZ0NsYXNzTmFtZTogJ2N1c3RvbS1kaWFsb2cnLFxuICAgICAgICBkaWFsb2dCYWNrZHJvcENsYXNzTmFtZTogJ2N1c3RvbS1iYWNrZHJvcCcsXG4gICAgICAgIGNvbnRhaW5lckNsYXNzTmFtZTogJ2N1c3RvbS1jb250YWluZXInLFxuICAgICAgICBwYW5lbENsYXNzTmFtZTogJ2N1c3RvbS1wYW5lbCcsXG4gICAgICAgIHNob3dDbG9zZTogdHJ1ZSxcbiAgICAgICAgbWFzazogdHJ1ZSxcbiAgICAgICAgcG9zaXRpb25DZW50ZXI6IHRydWUsXG4gICAgICAgIHVubW91bnQ6IHRydWUsXG4gICAgICAgIG5vT3ZlcmxheTogZmFsc2UsXG4gICAgICAgIGZvb3RlcjogPGRpdiBkYXRhLXRlc3RpZD1cImN1c3RvbS1mdWxsLWZvb3RlclwiPkZvb3RlcjwvZGl2PixcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRnVsbCBGZWF0dXJlIFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdGdWxsIEZlYXR1cmUgRGVzY3JpcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2xvc2UtaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tZnVsbC1mb290ZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtaW5pbWFsIGRyYXdlciB3aXRoIG9ubHkgcmVxdWlyZWQgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtaW5pbWFsUHJvcHM6IElEcmF3ZXJQcm9wcyA9IHtcbiAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBjaGlsZHJlbjogPGRpdj5NaW5pbWFsIENvbnRlbnQ8L2Rpdj4sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxEcmF3ZXIgey4uLm1pbmltYWxQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTWluaW1hbCBDb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2hvd0Nsb3NlIHdpdGggdGl0bGUgc2ltdWx0YW5lb3VzbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJEcmF3ZXIoe1xuICAgICAgICB0aXRsZTogJ1RpdGxlIHdpdGggQ2xvc2UnLFxuICAgICAgICBzaG93Q2xvc2U6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUaXRsZSB3aXRoIENsb3NlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nsb3NlLWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBub092ZXJsYXkgd2l0aCBjbGlja091dHNpZGVOb3RPcGVuJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJEcmF3ZXIoe1xuICAgICAgICBub092ZXJsYXk6IHRydWUsXG4gICAgICAgIGNsaWNrT3V0c2lkZU5vdE9wZW46IHRydWUsXG4gICAgICAgIG9uQ2xvc2UsXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBiYWNrZHJvcCBzaG91bGQgbm90IGV4aXN0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2RpYWxvZy1iYWNrZHJvcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRGlhbG9nIG9uQ2xvc2UgY2FsbGJhY2sgdGVzdHMgKGUuZy4sIEVzY2FwZSBrZXkpXG4gIGRlc2NyaWJlKCdEaWFsb2cgb25DbG9zZSBDYWxsYmFjaycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIERpYWxvZyB0cmlnZ2VycyBjbG9zZSBhbmQgY2xpY2tPdXRzaWRlTm90T3BlbiBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJEcmF3ZXIoeyBvbkNsb3NlLCBjbGlja091dHNpZGVOb3RPcGVuOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3QgLSBTaW11bGF0ZSBEaWFsb2cncyBvbkNsb3NlIChlLmcuLCBwcmVzc2luZyBFc2NhcGUpXG4gICAgICBjYXB0dXJlZERpYWxvZ09uQ2xvc2U/LigpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uQ2xvc2Ugd2hlbiBEaWFsb2cgdHJpZ2dlcnMgY2xvc2UgYW5kIGNsaWNrT3V0c2lkZU5vdE9wZW4gaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJEcmF3ZXIoeyBvbkNsb3NlLCBjbGlja091dHNpZGVOb3RPcGVuOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdCAtIFNpbXVsYXRlIERpYWxvZydzIG9uQ2xvc2UgKGUuZy4sIHByZXNzaW5nIEVzY2FwZSlcbiAgICAgIGNhcHR1cmVkRGlhbG9nT25DbG9zZT8uKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DbG9zZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSBieSBkZWZhdWx0IHdoZW4gRGlhbG9nIHRyaWdnZXJzIGNsb3NlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckRyYXdlcih7IG9uQ2xvc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjYXB0dXJlZERpYWxvZ09uQ2xvc2U/LigpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRXZlbnQgaGFuZGxlciBpbnRlcmFjdGlvbiB0ZXN0c1xuICBkZXNjcmliZSgnRXZlbnQgSGFuZGxlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgY29uc2VjdXRpdmUgY2xvc2UgaWNvbiBjbGlja3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyRHJhd2VyKHsgc2hvd0Nsb3NlOiB0cnVlLCBvbkNsb3NlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgY2xvc2VJY29uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1pY29uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUljb24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2xvc2VJY29uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlSWNvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9uQ2FuY2VsIGFuZCBvbk9rIGJlaW5nIHRoZSBzYW1lIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlciA9IHZpLmZuKClcbiAgICAgIHJlbmRlckRyYXdlcih7IG9uQ2FuY2VsOiBoYW5kbGVyLCBvbk9rOiBoYW5kbGVyIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zYXZlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIH0pXG4gIH0pXG59KVxuIl19