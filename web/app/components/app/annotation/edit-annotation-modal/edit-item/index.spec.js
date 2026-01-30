"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const index_1 = require("./index");
describe('EditTitle', () => {
    it('should render title content correctly', () => {
        // Arrange
        const props = { title: 'Test Title' };
        // Act
        (0, react_1.render)(<index_1.EditTitle {...props}/>);
        // Assert
        expect(react_1.screen.getByText(/test title/i)).toBeInTheDocument();
        // Should contain edit icon (svg element)
        expect(document.querySelector('svg')).toBeInTheDocument();
    });
    it('should apply custom className when provided', () => {
        // Arrange
        const props = {
            title: 'Test Title',
            className: 'custom-class',
        };
        // Act
        const { container } = (0, react_1.render)(<index_1.EditTitle {...props}/>);
        // Assert
        expect(react_1.screen.getByText(/test title/i)).toBeInTheDocument();
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
});
describe('EditItem', () => {
    const defaultProps = {
        type: index_1.EditItemType.Query,
        content: 'Test content',
        onSave: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render content correctly', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(/test content/i)).toBeInTheDocument();
            // Should show item name (query or answer)
            expect(react_1.screen.getByText('appAnnotation.editModal.queryName')).toBeInTheDocument();
        });
        it('should render different item types correctly', () => {
            // Arrange
            const props = {
                ...defaultProps,
                type: index_1.EditItemType.Answer,
                content: 'Answer content',
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(/answer content/i)).toBeInTheDocument();
            expect(react_1.screen.getByText('appAnnotation.editModal.answerName')).toBeInTheDocument();
        });
        it('should show edit controls when not readonly', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('common.operation.edit')).toBeInTheDocument();
        });
        it('should hide edit controls when readonly', () => {
            // Arrange
            const props = {
                ...defaultProps,
                readonly: true,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByText('common.operation.edit')).not.toBeInTheDocument();
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should respect readonly prop for edit functionality', () => {
            // Arrange
            const props = {
                ...defaultProps,
                readonly: true,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(/test content/i)).toBeInTheDocument();
            expect(react_1.screen.queryByText('common.operation.edit')).not.toBeInTheDocument();
        });
        it('should display provided content', () => {
            // Arrange
            const props = {
                ...defaultProps,
                content: 'Custom content for testing',
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(/custom content for testing/i)).toBeInTheDocument();
        });
        it('should render appropriate content based on type', () => {
            // Arrange
            const props = {
                ...defaultProps,
                type: index_1.EditItemType.Query,
                content: 'Question content',
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(/question content/i)).toBeInTheDocument();
            expect(react_1.screen.getByText('appAnnotation.editModal.queryName')).toBeInTheDocument();
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should activate edit mode when edit button is clicked', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await user.click(react_1.screen.getByText('common.operation.edit'));
            // Assert
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.save' })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.cancel' })).toBeInTheDocument();
        });
        it('should save new content when save button is clicked', async () => {
            // Arrange
            const mockSave = vi.fn().mockResolvedValue(undefined);
            const props = {
                ...defaultProps,
                onSave: mockSave,
            };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await user.click(react_1.screen.getByText('common.operation.edit'));
            // Type new content
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Updated content');
            // Save
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert
            expect(mockSave).toHaveBeenCalledWith('Updated content');
        });
        it('should exit edit mode when cancel button is clicked', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await user.click(react_1.screen.getByText('common.operation.edit'));
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.cancel' }));
            // Assert
            expect(react_1.screen.queryByRole('textbox')).not.toBeInTheDocument();
            expect(react_1.screen.getByText(/test content/i)).toBeInTheDocument();
        });
        it('should show content preview while typing', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await user.click(react_1.screen.getByText('common.operation.edit'));
            const textarea = react_1.screen.getByRole('textbox');
            await user.type(textarea, 'New content');
            // Assert
            expect(react_1.screen.getByText(/new content/i)).toBeInTheDocument();
        });
        it('should call onSave with correct content when saving', async () => {
            // Arrange
            const mockSave = vi.fn().mockResolvedValue(undefined);
            const props = {
                ...defaultProps,
                onSave: mockSave,
            };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await user.click(react_1.screen.getByText('common.operation.edit'));
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Test save content');
            // Save
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert
            expect(mockSave).toHaveBeenCalledWith('Test save content');
        });
        it('should show delete option and restore original content when delete is clicked', async () => {
            // Arrange
            const mockSave = vi.fn().mockResolvedValue(undefined);
            const props = {
                ...defaultProps,
                onSave: mockSave,
            };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Enter edit mode and change content
            await user.click(react_1.screen.getByText('common.operation.edit'));
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Modified content');
            // Save to trigger content change
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert
            expect(mockSave).toHaveBeenNthCalledWith(1, 'Modified content');
            expect(await react_1.screen.findByText('common.operation.delete')).toBeInTheDocument();
            await user.click(react_1.screen.getByText('common.operation.delete'));
            expect(mockSave).toHaveBeenNthCalledWith(2, 'Test content');
            expect(react_1.screen.queryByText('common.operation.delete')).not.toBeInTheDocument();
        });
        it('should handle keyboard interactions in edit mode', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await user.click(react_1.screen.getByText('common.operation.edit'));
            const textarea = react_1.screen.getByRole('textbox');
            // Test typing
            await user.type(textarea, 'Keyboard test');
            // Assert
            expect(textarea).toHaveValue('Keyboard test');
            expect(react_1.screen.getByText(/keyboard test/i)).toBeInTheDocument();
        });
    });
    // State Management
    describe('State Management', () => {
        it('should reset newContent when content prop changes', async () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Act - Enter edit mode and type something
            const user = user_event_1.default.setup();
            await user.click(react_1.screen.getByText('common.operation.edit'));
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'New content');
            // Rerender with new content prop
            rerender(<index_1.default {...defaultProps} content="Updated content"/>);
            // Assert - Textarea value should be reset due to useEffect
            expect(textarea).toHaveValue('');
        });
        it('should preserve edit state across content changes', async () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const user = user_event_1.default.setup();
            // Act - Enter edit mode
            await user.click(react_1.screen.getByText('common.operation.edit'));
            // Rerender with new content
            rerender(<index_1.default {...defaultProps} content="Updated content"/>);
            // Assert - Should still be in edit mode
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle empty content', () => {
            // Arrange
            const props = {
                ...defaultProps,
                content: '',
            };
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should render without crashing
            // Check that the component renders properly with empty content
            expect(container.querySelector('.grow')).toBeInTheDocument();
            // Should still show edit button
            expect(react_1.screen.getByText('common.operation.edit')).toBeInTheDocument();
        });
        it('should handle very long content', () => {
            // Arrange
            const longContent = 'A'.repeat(1000);
            const props = {
                ...defaultProps,
                content: longContent,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(longContent)).toBeInTheDocument();
        });
        it('should handle content with special characters', () => {
            // Arrange
            const specialContent = 'Content with & < > " \' characters';
            const props = {
                ...defaultProps,
                content: specialContent,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(specialContent)).toBeInTheDocument();
        });
        it('should handle rapid edit/cancel operations', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Rapid edit/cancel operations
            await user.click(react_1.screen.getByText('common.operation.edit'));
            await user.click(react_1.screen.getByText('common.operation.cancel'));
            await user.click(react_1.screen.getByText('common.operation.edit'));
            await user.click(react_1.screen.getByText('common.operation.cancel'));
            // Assert
            expect(react_1.screen.queryByRole('textbox')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('Test content')).toBeInTheDocument();
        });
        it('should handle save failure gracefully in edit mode', async () => {
            // Arrange
            const mockSave = vi.fn().mockRejectedValueOnce(new Error('Save failed'));
            const props = {
                ...defaultProps,
                onSave: mockSave,
            };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Enter edit mode and save (should fail)
            await user.click(react_1.screen.getByText('common.operation.edit'));
            const textarea = react_1.screen.getByRole('textbox');
            await user.type(textarea, 'New content');
            // Save should fail but not throw
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert - Should remain in edit mode when save fails
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.save' })).toBeInTheDocument();
            expect(mockSave).toHaveBeenCalledWith('New content');
        });
        it('should handle delete action failure gracefully', async () => {
            // Arrange
            const mockSave = vi.fn()
                .mockResolvedValueOnce(undefined) // First save succeeds
                .mockRejectedValueOnce(new Error('Delete failed')); // Delete fails
            const props = {
                ...defaultProps,
                onSave: mockSave,
            };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Edit content to show delete button
            await user.click(react_1.screen.getByText('common.operation.edit'));
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Modified content');
            // Save to create new content
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            await react_1.screen.findByText('common.operation.delete');
            // Click delete (should fail but not throw)
            await user.click(react_1.screen.getByText('common.operation.delete'));
            // Assert - Delete action should handle error gracefully
            expect(mockSave).toHaveBeenCalledTimes(2);
            expect(mockSave).toHaveBeenNthCalledWith(1, 'Modified content');
            expect(mockSave).toHaveBeenNthCalledWith(2, 'Test content');
            // When delete fails, the delete button should still be visible (state not changed)
            expect(react_1.screen.getByText('common.operation.delete')).toBeInTheDocument();
            expect(react_1.screen.getByText('Modified content')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXVEO0FBQ3ZELDREQUFtRDtBQUNuRCxtQ0FBMkQ7QUFFM0QsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekIsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxVQUFVO1FBQ1YsTUFBTSxLQUFLLEdBQUcsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUE7UUFFckMsTUFBTTtRQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsaUJBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtRQUVoQyxTQUFTO1FBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNELHlDQUF5QztRQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFDM0QsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELFVBQVU7UUFDVixNQUFNLEtBQUssR0FBRztZQUNaLEtBQUssRUFBRSxZQUFZO1lBQ25CLFNBQVMsRUFBRSxjQUFjO1NBQzFCLENBQUE7UUFFRCxNQUFNO1FBQ04sTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsaUJBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtRQUV0RCxTQUFTO1FBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFD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SUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQTtZQUU3RCx3REFBd0Q7WUFDeEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtZQUMvRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFBO1lBRTNELG1GQUFtRjtZQUNuRixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN2RSxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCBFZGl0SXRlbSwgeyBFZGl0SXRlbVR5cGUsIEVkaXRUaXRsZSB9IGZyb20gJy4vaW5kZXgnXG5cbmRlc2NyaWJlKCdFZGl0VGl0bGUnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcmVuZGVyIHRpdGxlIGNvbnRlbnQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBwcm9wcyA9IHsgdGl0bGU6ICdUZXN0IFRpdGxlJyB9XG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoPEVkaXRUaXRsZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3Rlc3QgdGl0bGUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAvLyBTaG91bGQgY29udGFpbiBlZGl0IGljb24gKHN2ZyBlbGVtZW50KVxuICAgIGV4cGVjdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZSB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgIHRpdGxlOiAnVGVzdCBUaXRsZScsXG4gICAgICBjbGFzc05hbWU6ICdjdXN0b20tY2xhc3MnLFxuICAgIH1cblxuICAgIC8vIEFjdFxuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVkaXRUaXRsZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3Rlc3QgdGl0bGUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b20tY2xhc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ0VkaXRJdGVtJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdHlwZTogRWRpdEl0ZW1UeXBlLlF1ZXJ5LFxuICAgIGNvbnRlbnQ6ICdUZXN0IGNvbnRlbnQnLFxuICAgIG9uU2F2ZTogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFJlbmRlcmluZyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29udGVudCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3Rlc3QgY29udGVudC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIHNob3cgaXRlbSBuYW1lIChxdWVyeSBvciBhbnN3ZXIpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwQW5ub3RhdGlvbi5lZGl0TW9kYWwucXVlcnlOYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGlmZmVyZW50IGl0ZW0gdHlwZXMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgdHlwZTogRWRpdEl0ZW1UeXBlLkFuc3dlcixcbiAgICAgICAgY29udGVudDogJ0Fuc3dlciBjb250ZW50JyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2Fuc3dlciBjb250ZW50L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwQW5ub3RhdGlvbi5lZGl0TW9kYWwuYW5zd2VyTmFtZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlZGl0IGNvbnRyb2xzIHdoZW4gbm90IHJlYWRvbmx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmVkaXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhpZGUgZWRpdCBjb250cm9scyB3aGVuIHJlYWRvbmx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgcmVhZG9ubHk6IHRydWUsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZWRpdCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcHMgdGVzdHMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXNwZWN0IHJlYWRvbmx5IHByb3AgZm9yIGVkaXQgZnVuY3Rpb25hbGl0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEl0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdGVzdCBjb250ZW50L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmVkaXQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHByb3ZpZGVkIGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBjb250ZW50OiAnQ3VzdG9tIGNvbnRlbnQgZm9yIHRlc3RpbmcnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEl0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY3VzdG9tIGNvbnRlbnQgZm9yIHRlc3RpbmcvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXBwcm9wcmlhdGUgY29udGVudCBiYXNlZCBvbiB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgdHlwZTogRWRpdEl0ZW1UeXBlLlF1ZXJ5LFxuICAgICAgICBjb250ZW50OiAnUXVlc3Rpb24gY29udGVudCcsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9xdWVzdGlvbiBjb250ZW50L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwQW5ub3RhdGlvbi5lZGl0TW9kYWwucXVlcnlOYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFjdGl2YXRlIGVkaXQgbW9kZSB3aGVuIGVkaXQgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5lZGl0JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzYXZlIG5ldyBjb250ZW50IHdoZW4gc2F2ZSBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tTYXZlID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBvblNhdmU6IG1vY2tTYXZlLFxuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0SXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmVkaXQnKSlcblxuICAgICAgLy8gVHlwZSBuZXcgY29udGVudFxuICAgICAgY29uc3QgdGV4dGFyZWEgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXIuY2xlYXIodGV4dGFyZWEpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUodGV4dGFyZWEsICdVcGRhdGVkIGNvbnRlbnQnKVxuXG4gICAgICAvLyBTYXZlXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTYXZlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnVXBkYXRlZCBjb250ZW50JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBleGl0IGVkaXQgbW9kZSB3aGVuIGNhbmNlbCBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0SXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmVkaXQnKSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ3RleHRib3gnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC90ZXN0IGNvbnRlbnQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNvbnRlbnQgcHJldmlldyB3aGlsZSB0eXBpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5lZGl0JykpXG5cbiAgICAgIGNvbnN0IHRleHRhcmVhID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUodGV4dGFyZWEsICdOZXcgY29udGVudCcpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL25ldyBjb250ZW50L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblNhdmUgd2l0aCBjb3JyZWN0IGNvbnRlbnQgd2hlbiBzYXZpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU2F2ZSA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgb25TYXZlOiBtb2NrU2F2ZSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5lZGl0JykpXG5cbiAgICAgIGNvbnN0IHRleHRhcmVhID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyLmNsZWFyKHRleHRhcmVhKVxuICAgICAgYXdhaXQgdXNlci50eXBlKHRleHRhcmVhLCAnVGVzdCBzYXZlIGNvbnRlbnQnKVxuXG4gICAgICAvLyBTYXZlXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTYXZlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnVGVzdCBzYXZlIGNvbnRlbnQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZGVsZXRlIG9wdGlvbiBhbmQgcmVzdG9yZSBvcmlnaW5hbCBjb250ZW50IHdoZW4gZGVsZXRlIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU2F2ZSA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgb25TYXZlOiBtb2NrU2F2ZSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEl0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gRW50ZXIgZWRpdCBtb2RlIGFuZCBjaGFuZ2UgY29udGVudFxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmVkaXQnKSlcbiAgICAgIGNvbnN0IHRleHRhcmVhID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyLmNsZWFyKHRleHRhcmVhKVxuICAgICAgYXdhaXQgdXNlci50eXBlKHRleHRhcmVhLCAnTW9kaWZpZWQgY29udGVudCcpXG5cbiAgICAgIC8vIFNhdmUgdG8gdHJpZ2dlciBjb250ZW50IGNoYW5nZVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLnNhdmUnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2F2ZSkudG9IYXZlQmVlbk50aENhbGxlZFdpdGgoMSwgJ01vZGlmaWVkIGNvbnRlbnQnKVxuICAgICAgZXhwZWN0KGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmRlbGV0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5kZWxldGUnKSlcblxuICAgICAgZXhwZWN0KG1vY2tTYXZlKS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgyLCAnVGVzdCBjb250ZW50JylcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZGVsZXRlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGtleWJvYXJkIGludGVyYWN0aW9ucyBpbiBlZGl0IG1vZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5lZGl0JykpXG5cbiAgICAgIGNvbnN0IHRleHRhcmVhID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG5cbiAgICAgIC8vIFRlc3QgdHlwaW5nXG4gICAgICBhd2FpdCB1c2VyLnR5cGUodGV4dGFyZWEsICdLZXlib2FyZCB0ZXN0JylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QodGV4dGFyZWEpLnRvSGF2ZVZhbHVlKCdLZXlib2FyZCB0ZXN0JylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9rZXlib2FyZCB0ZXN0L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50XG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVzZXQgbmV3Q29udGVudCB3aGVuIGNvbnRlbnQgcHJvcCBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxFZGl0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gRW50ZXIgZWRpdCBtb2RlIGFuZCB0eXBlIHNvbWV0aGluZ1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZWRpdCcpKVxuICAgICAgY29uc3QgdGV4dGFyZWEgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXIuY2xlYXIodGV4dGFyZWEpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUodGV4dGFyZWEsICdOZXcgY29udGVudCcpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggbmV3IGNvbnRlbnQgcHJvcFxuICAgICAgcmVyZW5kZXIoPEVkaXRJdGVtIHsuLi5kZWZhdWx0UHJvcHN9IGNvbnRlbnQ9XCJVcGRhdGVkIGNvbnRlbnRcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gVGV4dGFyZWEgdmFsdWUgc2hvdWxkIGJlIHJlc2V0IGR1ZSB0byB1c2VFZmZlY3RcbiAgICAgIGV4cGVjdCh0ZXh0YXJlYSkudG9IYXZlVmFsdWUoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgZWRpdCBzdGF0ZSBhY3Jvc3MgY29udGVudCBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxFZGl0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSAvPilcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3QgLSBFbnRlciBlZGl0IG1vZGVcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5lZGl0JykpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggbmV3IGNvbnRlbnRcbiAgICAgIHJlcmVuZGVyKDxFZGl0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSBjb250ZW50PVwiVXBkYXRlZCBjb250ZW50XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzdGlsbCBiZSBpbiBlZGl0IG1vZGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgQ2FzZXMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBjb250ZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgY29udGVudDogJycsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RWRpdEl0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICAvLyBDaGVjayB0aGF0IHRoZSBjb21wb25lbnQgcmVuZGVycyBwcm9wZXJseSB3aXRoIGVtcHR5IGNvbnRlbnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmdyb3cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIHN0aWxsIHNob3cgZWRpdCBidXR0b25cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmVkaXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgY29udGVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdDb250ZW50ID0gJ0EnLnJlcGVhdCgxMDAwKVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgY29udGVudDogbG9uZ0NvbnRlbnQsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdDb250ZW50KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb250ZW50IHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3BlY2lhbENvbnRlbnQgPSAnQ29udGVudCB3aXRoICYgPCA+IFwiIFxcJyBjaGFyYWN0ZXJzJ1xuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgY29udGVudDogc3BlY2lhbENvbnRlbnQsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxDb250ZW50KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBlZGl0L2NhbmNlbCBvcGVyYXRpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFJhcGlkIGVkaXQvY2FuY2VsIG9wZXJhdGlvbnNcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5lZGl0JykpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJykpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZWRpdCcpKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ3RleHRib3gnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzYXZlIGZhaWx1cmUgZ3JhY2VmdWxseSBpbiBlZGl0IG1vZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU2F2ZSA9IHZpLmZuKCkubW9ja1JlamVjdGVkVmFsdWVPbmNlKG5ldyBFcnJvcignU2F2ZSBmYWlsZWQnKSlcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIG9uU2F2ZTogbW9ja1NhdmUsXG4gICAgICB9XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEVudGVyIGVkaXQgbW9kZSBhbmQgc2F2ZSAoc2hvdWxkIGZhaWwpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZWRpdCcpKVxuICAgICAgY29uc3QgdGV4dGFyZWEgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXIudHlwZSh0ZXh0YXJlYSwgJ05ldyBjb250ZW50JylcblxuICAgICAgLy8gU2F2ZSBzaG91bGQgZmFpbCBidXQgbm90IHRocm93XG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW1haW4gaW4gZWRpdCBtb2RlIHdoZW4gc2F2ZSBmYWlsc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChtb2NrU2F2ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ05ldyBjb250ZW50JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGVsZXRlIGFjdGlvbiBmYWlsdXJlIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU2F2ZSA9IHZpLmZuKClcbiAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh1bmRlZmluZWQpIC8vIEZpcnN0IHNhdmUgc3VjY2VlZHNcbiAgICAgICAgLm1vY2tSZWplY3RlZFZhbHVlT25jZShuZXcgRXJyb3IoJ0RlbGV0ZSBmYWlsZWQnKSkgLy8gRGVsZXRlIGZhaWxzXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBvblNhdmU6IG1vY2tTYXZlLFxuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBFZGl0IGNvbnRlbnQgdG8gc2hvdyBkZWxldGUgYnV0dG9uXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZWRpdCcpKVxuICAgICAgY29uc3QgdGV4dGFyZWEgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXIuY2xlYXIodGV4dGFyZWEpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUodGV4dGFyZWEsICdNb2RpZmllZCBjb250ZW50JylcblxuICAgICAgLy8gU2F2ZSB0byBjcmVhdGUgbmV3IGNvbnRlbnRcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KSlcbiAgICAgIGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmRlbGV0ZScpXG5cbiAgICAgIC8vIENsaWNrIGRlbGV0ZSAoc2hvdWxkIGZhaWwgYnV0IG5vdCB0aHJvdylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5kZWxldGUnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gRGVsZXRlIGFjdGlvbiBzaG91bGQgaGFuZGxlIGVycm9yIGdyYWNlZnVsbHlcbiAgICAgIGV4cGVjdChtb2NrU2F2ZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgICBleHBlY3QobW9ja1NhdmUpLnRvSGF2ZUJlZW5OdGhDYWxsZWRXaXRoKDEsICdNb2RpZmllZCBjb250ZW50JylcbiAgICAgIGV4cGVjdChtb2NrU2F2ZSkudG9IYXZlQmVlbk50aENhbGxlZFdpdGgoMiwgJ1Rlc3QgY29udGVudCcpXG5cbiAgICAgIC8vIFdoZW4gZGVsZXRlIGZhaWxzLCB0aGUgZGVsZXRlIGJ1dHRvbiBzaG91bGQgc3RpbGwgYmUgdmlzaWJsZSAoc3RhdGUgbm90IGNoYW5nZWQpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5kZWxldGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vZGlmaWVkIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19