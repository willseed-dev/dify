"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const toast_1 = require("@/app/components/base/toast");
const index_1 = require("./index");
const { mockAddAnnotation, mockEditAnnotation } = vi.hoisted(() => ({
    mockAddAnnotation: vi.fn(),
    mockEditAnnotation: vi.fn(),
}));
// Mock only external dependencies
vi.mock('@/service/annotation', () => ({
    addAnnotation: mockAddAnnotation,
    editAnnotation: mockEditAnnotation,
}));
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        plan: {
            usage: { annotatedResponse: 5 },
            total: { annotatedResponse: 10 },
        },
        enableBilling: true,
    }),
}));
vi.mock('@/hooks/use-timestamp', () => ({
    default: () => ({
        formatTime: () => '2023-12-01 10:30:00',
    }),
}));
// Note: i18n is automatically mocked by Vitest via web/vitest.setup.ts
vi.mock('@/app/components/billing/annotation-full', () => ({
    default: () => <div data-testid="annotation-full"/>,
}));
const toastWithNotify = toast_1.default;
const toastNotifySpy = vi.spyOn(toastWithNotify, 'notify').mockReturnValue({ clear: vi.fn() });
describe('EditAnnotationModal', () => {
    const defaultProps = {
        isShow: true,
        onHide: vi.fn(),
        appId: 'test-app-id',
        query: 'Test query',
        answer: 'Test answer',
        onEdited: vi.fn(),
        onAdded: vi.fn(),
        onRemove: vi.fn(),
    };
    afterAll(() => {
        toastNotifySpy.mockRestore();
    });
    beforeEach(() => {
        vi.clearAllMocks();
        mockAddAnnotation.mockResolvedValue({
            id: 'test-id',
            account: { name: 'Test User' },
        });
        mockEditAnnotation.mockResolvedValue({});
    });
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render modal when isShow is true', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check for modal title as it appears in the mock
            expect(react_1.screen.getByText('appAnnotation.editModal.title')).toBeInTheDocument();
        });
        it('should not render modal when isShow is false', () => {
            // Arrange
            const props = { ...defaultProps, isShow: false };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByText('appAnnotation.editModal.title')).not.toBeInTheDocument();
        });
        it('should display query and answer sections', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Look for query and answer content
            expect(react_1.screen.getByText('Test query')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test answer')).toBeInTheDocument();
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should handle different query and answer content', () => {
            // Arrange
            const props = {
                ...defaultProps,
                query: 'Custom query content',
                answer: 'Custom answer content',
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check content is displayed
            expect(react_1.screen.getByText('Custom query content')).toBeInTheDocument();
            expect(react_1.screen.getByText('Custom answer content')).toBeInTheDocument();
        });
        it('should show remove option when annotationId is provided', () => {
            // Arrange
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Remove option should be present (using pattern)
            expect(react_1.screen.getByText('appAnnotation.editModal.removeThisCache')).toBeInTheDocument();
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should enable editing for query and answer sections', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Edit links should be visible (using text content)
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            expect(editLinks).toHaveLength(2);
        });
        it('should show remove option when annotationId is provided', () => {
            // Arrange
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('appAnnotation.editModal.removeThisCache')).toBeInTheDocument();
        });
        it('should save content when edited', async () => {
            // Arrange
            const mockOnAdded = vi.fn();
            const props = {
                ...defaultProps,
                onAdded: mockOnAdded,
            };
            const user = user_event_1.default.setup();
            // Mock API response
            mockAddAnnotation.mockResolvedValueOnce({
                id: 'test-annotation-id',
                account: { name: 'Test User' },
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Find and click edit link for query
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            await user.click(editLinks[0]);
            // Find textarea and enter new content
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'New query content');
            // Click save button
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            expect(mockAddAnnotation).toHaveBeenCalledWith('test-app-id', {
                question: 'New query content',
                answer: 'Test answer',
                message_id: undefined,
            });
        });
    });
    // API Calls
    describe('API Calls', () => {
        it('should call addAnnotation when saving new annotation', async () => {
            // Arrange
            const mockOnAdded = vi.fn();
            const props = {
                ...defaultProps,
                onAdded: mockOnAdded,
            };
            const user = user_event_1.default.setup();
            // Mock the API response
            mockAddAnnotation.mockResolvedValueOnce({
                id: 'test-annotation-id',
                account: { name: 'Test User' },
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Edit query content
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            await user.click(editLinks[0]);
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Updated query');
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            expect(mockAddAnnotation).toHaveBeenCalledWith('test-app-id', {
                question: 'Updated query',
                answer: 'Test answer',
                message_id: undefined,
            });
        });
        it('should call editAnnotation when updating existing annotation', async () => {
            // Arrange
            const mockOnEdited = vi.fn();
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
                messageId: 'test-message-id',
                onEdited: mockOnEdited,
            };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Edit query content
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            await user.click(editLinks[0]);
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Modified query');
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            expect(mockEditAnnotation).toHaveBeenCalledWith('test-app-id', 'test-annotation-id', {
                message_id: 'test-message-id',
                question: 'Modified query',
                answer: 'Test answer',
            });
        });
    });
    // State Management
    describe('State Management', () => {
        it('should initialize with closed confirm modal', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Confirm dialog should not be visible initially
            expect(react_1.screen.queryByText('appDebug.feature.annotation.removeConfirm')).not.toBeInTheDocument();
        });
        it('should show confirm modal when remove is clicked', async () => {
            // Arrange
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
            };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await user.click(react_1.screen.getByText('appAnnotation.editModal.removeThisCache'));
            // Assert - Confirmation dialog should appear
            expect(react_1.screen.getByText('appDebug.feature.annotation.removeConfirm')).toBeInTheDocument();
        });
        it('should call onRemove when removal is confirmed', async () => {
            // Arrange
            const mockOnRemove = vi.fn();
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
                onRemove: mockOnRemove,
            };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Click remove
            await user.click(react_1.screen.getByText('appAnnotation.editModal.removeThisCache'));
            // Click confirm
            const confirmButton = react_1.screen.getByRole('button', { name: 'common.operation.confirm' });
            await user.click(confirmButton);
            // Assert
            expect(mockOnRemove).toHaveBeenCalled();
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle empty query and answer', () => {
            // Arrange
            const props = {
                ...defaultProps,
                query: '',
                answer: '',
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('appAnnotation.editModal.title')).toBeInTheDocument();
        });
        it('should handle very long content', () => {
            // Arrange
            const longQuery = 'Q'.repeat(1000);
            const longAnswer = 'A'.repeat(1000);
            const props = {
                ...defaultProps,
                query: longQuery,
                answer: longAnswer,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(longQuery)).toBeInTheDocument();
            expect(react_1.screen.getByText(longAnswer)).toBeInTheDocument();
        });
        it('should handle special characters in content', () => {
            // Arrange
            const specialQuery = 'Query with & < > " \' characters';
            const specialAnswer = 'Answer with & < > " \' characters';
            const props = {
                ...defaultProps,
                query: specialQuery,
                answer: specialAnswer,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(specialQuery)).toBeInTheDocument();
            expect(react_1.screen.getByText(specialAnswer)).toBeInTheDocument();
        });
        it('should handle onlyEditResponse prop', () => {
            // Arrange
            const props = {
                ...defaultProps,
                onlyEditResponse: true,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Query should be readonly, answer should be editable
            const editLinks = react_1.screen.queryAllByText(/common\.operation\.edit/i);
            expect(editLinks).toHaveLength(1); // Only answer should have edit button
        });
    });
    // Error Handling (CRITICAL for coverage)
    describe('Error Handling', () => {
        it('should show error toast and skip callbacks when addAnnotation fails', async () => {
            // Arrange
            const mockOnAdded = vi.fn();
            const props = {
                ...defaultProps,
                onAdded: mockOnAdded,
            };
            const user = user_event_1.default.setup();
            // Mock API failure
            mockAddAnnotation.mockRejectedValueOnce(new Error('API Error'));
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Find and click edit link for query
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            await user.click(editLinks[0]);
            // Find textarea and enter new content
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'New query content');
            // Click save button
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    message: 'API Error',
                    type: 'error',
                });
            });
            expect(mockOnAdded).not.toHaveBeenCalled();
            // Verify edit mode remains open (textarea should still be visible)
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.save' })).toBeInTheDocument();
        });
        it('should show fallback error message when addAnnotation error has no message', async () => {
            // Arrange
            const mockOnAdded = vi.fn();
            const props = {
                ...defaultProps,
                onAdded: mockOnAdded,
            };
            const user = user_event_1.default.setup();
            mockAddAnnotation.mockRejectedValueOnce({});
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            await user.click(editLinks[0]);
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'New query content');
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    message: 'common.api.actionFailed',
                    type: 'error',
                });
            });
            expect(mockOnAdded).not.toHaveBeenCalled();
            // Verify edit mode remains open (textarea should still be visible)
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.save' })).toBeInTheDocument();
        });
        it('should show error toast and skip callbacks when editAnnotation fails', async () => {
            // Arrange
            const mockOnEdited = vi.fn();
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
                messageId: 'test-message-id',
                onEdited: mockOnEdited,
            };
            const user = user_event_1.default.setup();
            // Mock API failure
            mockEditAnnotation.mockRejectedValueOnce(new Error('API Error'));
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Edit query content
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            await user.click(editLinks[0]);
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Modified query');
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    message: 'API Error',
                    type: 'error',
                });
            });
            expect(mockOnEdited).not.toHaveBeenCalled();
            // Verify edit mode remains open (textarea should still be visible)
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.save' })).toBeInTheDocument();
        });
        it('should show fallback error message when editAnnotation error is not an Error instance', async () => {
            // Arrange
            const mockOnEdited = vi.fn();
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
                messageId: 'test-message-id',
                onEdited: mockOnEdited,
            };
            const user = user_event_1.default.setup();
            mockEditAnnotation.mockRejectedValueOnce('oops');
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            await user.click(editLinks[0]);
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Modified query');
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    message: 'common.api.actionFailed',
                    type: 'error',
                });
            });
            expect(mockOnEdited).not.toHaveBeenCalled();
            // Verify edit mode remains open (textarea should still be visible)
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.save' })).toBeInTheDocument();
        });
    });
    // Billing & Plan Features
    describe('Billing & Plan Features', () => {
        it('should show createdAt time when provided', () => {
            // Arrange
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
                createdAt: 1701381000, // 2023-12-01 10:30:00
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check that the formatted time appears somewhere in the component
            const container = react_1.screen.getByRole('dialog');
            expect(container).toHaveTextContent('2023-12-01 10:30:00');
        });
        it('should not show createdAt when not provided', () => {
            // Arrange
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
                // createdAt is undefined
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should not contain any timestamp
            const container = react_1.screen.getByRole('dialog');
            expect(container).not.toHaveTextContent('2023-12-01 10:30:00');
        });
        it('should display remove section when annotationId exists', () => {
            // Arrange
            const props = {
                ...defaultProps,
                annotationId: 'test-annotation-id',
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should have remove functionality
            expect(react_1.screen.getByText('appAnnotation.editModal.removeThisCache')).toBeInTheDocument();
        });
    });
    // Toast Notifications (Success)
    describe('Toast Notifications', () => {
        it('should show success notification when save operation completes', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const editLinks = react_1.screen.getAllByText(/common\.operation\.edit/i);
            await user.click(editLinks[0]);
            const textarea = react_1.screen.getByRole('textbox');
            await user.clear(textarea);
            await user.type(textarea, 'Updated query');
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    message: 'common.api.actionSuccess',
                    type: 'success',
                });
            });
        });
    });
    // React.memo Performance Testing
    describe('React.memo Performance', () => {
        it('should not re-render when props are the same', () => {
            // Arrange
            const props = { ...defaultProps };
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Re-render with same props
            rerender(<index_1.default {...props}/>);
            // Assert - Component should still be visible (no errors thrown)
            expect(react_1.screen.getByText('appAnnotation.editModal.title')).toBeInTheDocument();
        });
        it('should re-render when props change', () => {
            // Arrange
            const props = { ...defaultProps };
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Re-render with different props
            const newProps = { ...props, query: 'New query content' };
            rerender(<index_1.default {...newProps}/>);
            // Assert - Should show new content
            expect(react_1.screen.getByText('New query content')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWdFO0FBQ2hFLDREQUFtRDtBQUNuRCx1REFBK0M7QUFDL0MsbUNBQXlDO0FBRXpDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNsRSxpQkFBaUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzFCLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDNUIsQ0FBQyxDQUFDLENBQUE7QUFFSCxrQ0FBa0M7QUFDbEMsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLGFBQWEsRUFBRSxpQkFBaUI7SUFDaEMsY0FBYyxFQUFFLGtCQUFrQjtDQUNuQyxDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMzQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksRUFBRTtZQUNKLEtBQUssRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUMsRUFBRTtZQUMvQixLQUFLLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEVBQUU7U0FDakM7UUFDRCxhQUFhLEVBQUUsSUFBSTtLQUNwQixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDZCxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMscUJBQXFCO0tBQ3hDLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILHVFQUF1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Q0FBQTtZQUNqQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9ELHVDQUF1QztZQUN2QyxNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxDQUFBO1lBQ3pELFFBQVEsQ0FBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxRQUFRLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFL0MsbUNBQW1DO1lBQ25DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ25FLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSVRvYXN0UHJvcHMsIFRvYXN0SGFuZGxlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IEVkaXRBbm5vdGF0aW9uTW9kYWwgZnJvbSAnLi9pbmRleCdcblxuY29uc3QgeyBtb2NrQWRkQW5ub3RhdGlvbiwgbW9ja0VkaXRBbm5vdGF0aW9uIH0gPSB2aS5ob2lzdGVkKCgpID0+ICh7XG4gIG1vY2tBZGRBbm5vdGF0aW9uOiB2aS5mbigpLFxuICBtb2NrRWRpdEFubm90YXRpb246IHZpLmZuKCksXG59KSlcblxuLy8gTW9jayBvbmx5IGV4dGVybmFsIGRlcGVuZGVuY2llc1xudmkubW9jaygnQC9zZXJ2aWNlL2Fubm90YXRpb24nLCAoKSA9PiAoe1xuICBhZGRBbm5vdGF0aW9uOiBtb2NrQWRkQW5ub3RhdGlvbixcbiAgZWRpdEFubm90YXRpb246IG1vY2tFZGl0QW5ub3RhdGlvbixcbn0pKVxuXG52aS5tb2NrKCdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCcsICgpID0+ICh7XG4gIHVzZVByb3ZpZGVyQ29udGV4dDogKCkgPT4gKHtcbiAgICBwbGFuOiB7XG4gICAgICB1c2FnZTogeyBhbm5vdGF0ZWRSZXNwb25zZTogNSB9LFxuICAgICAgdG90YWw6IHsgYW5ub3RhdGVkUmVzcG9uc2U6IDEwIH0sXG4gICAgfSxcbiAgICBlbmFibGVCaWxsaW5nOiB0cnVlLFxuICB9KSxcbn0pKVxuXG52aS5tb2NrKCdAL2hvb2tzL3VzZS10aW1lc3RhbXAnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoe1xuICAgIGZvcm1hdFRpbWU6ICgpID0+ICcyMDIzLTEyLTAxIDEwOjMwOjAwJyxcbiAgfSksXG59KSlcblxuLy8gTm90ZTogaTE4biBpcyBhdXRvbWF0aWNhbGx5IG1vY2tlZCBieSBWaXRlc3QgdmlhIHdlYi92aXRlc3Quc2V0dXAudHNcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL2Fubm90YXRpb24tZnVsbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IDxkaXYgZGF0YS10ZXN0aWQ9XCJhbm5vdGF0aW9uLWZ1bGxcIiAvPixcbn0pKVxuXG50eXBlIFRvYXN0Tm90aWZ5UHJvcHMgPSBQaWNrPElUb2FzdFByb3BzLCAndHlwZScgfCAnc2l6ZScgfCAnbWVzc2FnZScgfCAnZHVyYXRpb24nIHwgJ2NsYXNzTmFtZScgfCAnY3VzdG9tQ29tcG9uZW50JyB8ICdvbkNsb3NlJz5cbnR5cGUgVG9hc3RXaXRoTm90aWZ5ID0gdHlwZW9mIFRvYXN0ICYgeyBub3RpZnk6IChwcm9wczogVG9hc3ROb3RpZnlQcm9wcykgPT4gVG9hc3RIYW5kbGUgfVxuY29uc3QgdG9hc3RXaXRoTm90aWZ5ID0gVG9hc3QgYXMgdW5rbm93biBhcyBUb2FzdFdpdGhOb3RpZnlcbmNvbnN0IHRvYXN0Tm90aWZ5U3B5ID0gdmkuc3B5T24odG9hc3RXaXRoTm90aWZ5LCAnbm90aWZ5JykubW9ja1JldHVyblZhbHVlKHsgY2xlYXI6IHZpLmZuKCkgfSlcblxuZGVzY3JpYmUoJ0VkaXRBbm5vdGF0aW9uTW9kYWwnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBpc1Nob3c6IHRydWUsXG4gICAgb25IaWRlOiB2aS5mbigpLFxuICAgIGFwcElkOiAndGVzdC1hcHAtaWQnLFxuICAgIHF1ZXJ5OiAnVGVzdCBxdWVyeScsXG4gICAgYW5zd2VyOiAnVGVzdCBhbnN3ZXInLFxuICAgIG9uRWRpdGVkOiB2aS5mbigpLFxuICAgIG9uQWRkZWQ6IHZpLmZuKCksXG4gICAgb25SZW1vdmU6IHZpLmZuKCksXG4gIH1cblxuICBhZnRlckFsbCgoKSA9PiB7XG4gICAgdG9hc3ROb3RpZnlTcHkubW9ja1Jlc3RvcmUoKVxuICB9KVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tBZGRBbm5vdGF0aW9uLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgIGlkOiAndGVzdC1pZCcsXG4gICAgICBhY2NvdW50OiB7IG5hbWU6ICdUZXN0IFVzZXInIH0sXG4gICAgfSlcbiAgICBtb2NrRWRpdEFubm90YXRpb24ubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIHRlc3RzIChSRVFVSVJFRClcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aGVuIGlzU2hvdyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0QW5ub3RhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciBtb2RhbCB0aXRsZSBhcyBpdCBhcHBlYXJzIGluIHRoZSBtb2NrXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwQW5ub3RhdGlvbi5lZGl0TW9kYWwudGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgbW9kYWwgd2hlbiBpc1Nob3cgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzLCBpc1Nob3c6IGZhbHNlIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdhcHBBbm5vdGF0aW9uLmVkaXRNb2RhbC50aXRsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgcXVlcnkgYW5kIGFuc3dlciBzZWN0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEFubm90YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBMb29rIGZvciBxdWVyeSBhbmQgYW5zd2VyIGNvbnRlbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IHF1ZXJ5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IGFuc3dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBQcm9wcyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaWZmZXJlbnQgcXVlcnkgYW5kIGFuc3dlciBjb250ZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgcXVlcnk6ICdDdXN0b20gcXVlcnkgY29udGVudCcsXG4gICAgICAgIGFuc3dlcjogJ0N1c3RvbSBhbnN3ZXIgY29udGVudCcsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0QW5ub3RhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGNvbnRlbnQgaXMgZGlzcGxheWVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tIHF1ZXJ5IGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0N1c3RvbSBhbnN3ZXIgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyByZW1vdmUgb3B0aW9uIHdoZW4gYW5ub3RhdGlvbklkIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgYW5ub3RhdGlvbklkOiAndGVzdC1hbm5vdGF0aW9uLWlkJyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUmVtb3ZlIG9wdGlvbiBzaG91bGQgYmUgcHJlc2VudCAodXNpbmcgcGF0dGVybilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBBbm5vdGF0aW9uLmVkaXRNb2RhbC5yZW1vdmVUaGlzQ2FjaGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnNcbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZW5hYmxlIGVkaXRpbmcgZm9yIHF1ZXJ5IGFuZCBhbnN3ZXIgc2VjdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gRWRpdCBsaW5rcyBzaG91bGQgYmUgdmlzaWJsZSAodXNpbmcgdGV4dCBjb250ZW50KVxuICAgICAgY29uc3QgZWRpdExpbmtzID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvY29tbW9uXFwub3BlcmF0aW9uXFwuZWRpdC9pKVxuICAgICAgZXhwZWN0KGVkaXRMaW5rcykudG9IYXZlTGVuZ3RoKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyByZW1vdmUgb3B0aW9uIHdoZW4gYW5ub3RhdGlvbklkIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgYW5ub3RhdGlvbklkOiAndGVzdC1hbm5vdGF0aW9uLWlkJyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwQW5ub3RhdGlvbi5lZGl0TW9kYWwucmVtb3ZlVGhpc0NhY2hlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzYXZlIGNvbnRlbnQgd2hlbiBlZGl0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25BZGRlZCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIG9uQWRkZWQ6IG1vY2tPbkFkZGVkLFxuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIE1vY2sgQVBJIHJlc3BvbnNlXG4gICAgICBtb2NrQWRkQW5ub3RhdGlvbi5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBpZDogJ3Rlc3QtYW5ub3RhdGlvbi1pZCcsXG4gICAgICAgIGFjY291bnQ6IHsgbmFtZTogJ1Rlc3QgVXNlcicgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0QW5ub3RhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEZpbmQgYW5kIGNsaWNrIGVkaXQgbGluayBmb3IgcXVlcnlcbiAgICAgIGNvbnN0IGVkaXRMaW5rcyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL2NvbW1vblxcLm9wZXJhdGlvblxcLmVkaXQvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soZWRpdExpbmtzWzBdKVxuXG4gICAgICAvLyBGaW5kIHRleHRhcmVhIGFuZCBlbnRlciBuZXcgY29udGVudFxuICAgICAgY29uc3QgdGV4dGFyZWEgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXIuY2xlYXIodGV4dGFyZWEpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUodGV4dGFyZWEsICdOZXcgcXVlcnkgY29udGVudCcpXG5cbiAgICAgIC8vIENsaWNrIHNhdmUgYnV0dG9uXG4gICAgICBjb25zdCBzYXZlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzYXZlQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrQWRkQW5ub3RhdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3QtYXBwLWlkJywge1xuICAgICAgICBxdWVzdGlvbjogJ05ldyBxdWVyeSBjb250ZW50JyxcbiAgICAgICAgYW5zd2VyOiAnVGVzdCBhbnN3ZXInLFxuICAgICAgICBtZXNzYWdlX2lkOiB1bmRlZmluZWQsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQVBJIENhbGxzXG4gIGRlc2NyaWJlKCdBUEkgQ2FsbHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGFkZEFubm90YXRpb24gd2hlbiBzYXZpbmcgbmV3IGFubm90YXRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25BZGRlZCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIG9uQWRkZWQ6IG1vY2tPbkFkZGVkLFxuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIE1vY2sgdGhlIEFQSSByZXNwb25zZVxuICAgICAgbW9ja0FkZEFubm90YXRpb24ubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgaWQ6ICd0ZXN0LWFubm90YXRpb24taWQnLFxuICAgICAgICBhY2NvdW50OiB7IG5hbWU6ICdUZXN0IFVzZXInIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEFubm90YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBFZGl0IHF1ZXJ5IGNvbnRlbnRcbiAgICAgIGNvbnN0IGVkaXRMaW5rcyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL2NvbW1vblxcLm9wZXJhdGlvblxcLmVkaXQvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soZWRpdExpbmtzWzBdKVxuXG4gICAgICBjb25zdCB0ZXh0YXJlYSA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlci5jbGVhcih0ZXh0YXJlYSlcbiAgICAgIGF3YWl0IHVzZXIudHlwZSh0ZXh0YXJlYSwgJ1VwZGF0ZWQgcXVlcnknKVxuXG4gICAgICBjb25zdCBzYXZlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzYXZlQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrQWRkQW5ub3RhdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3QtYXBwLWlkJywge1xuICAgICAgICBxdWVzdGlvbjogJ1VwZGF0ZWQgcXVlcnknLFxuICAgICAgICBhbnN3ZXI6ICdUZXN0IGFuc3dlcicsXG4gICAgICAgIG1lc3NhZ2VfaWQ6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBlZGl0QW5ub3RhdGlvbiB3aGVuIHVwZGF0aW5nIGV4aXN0aW5nIGFubm90YXRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25FZGl0ZWQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBhbm5vdGF0aW9uSWQ6ICd0ZXN0LWFubm90YXRpb24taWQnLFxuICAgICAgICBtZXNzYWdlSWQ6ICd0ZXN0LW1lc3NhZ2UtaWQnLFxuICAgICAgICBvbkVkaXRlZDogbW9ja09uRWRpdGVkLFxuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0QW5ub3RhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEVkaXQgcXVlcnkgY29udGVudFxuICAgICAgY29uc3QgZWRpdExpbmtzID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvY29tbW9uXFwub3BlcmF0aW9uXFwuZWRpdC9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhlZGl0TGlua3NbMF0pXG5cbiAgICAgIGNvbnN0IHRleHRhcmVhID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyLmNsZWFyKHRleHRhcmVhKVxuICAgICAgYXdhaXQgdXNlci50eXBlKHRleHRhcmVhLCAnTW9kaWZpZWQgcXVlcnknKVxuXG4gICAgICBjb25zdCBzYXZlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzYXZlQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrRWRpdEFubm90YXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAndGVzdC1hcHAtaWQnLFxuICAgICAgICAndGVzdC1hbm5vdGF0aW9uLWlkJyxcbiAgICAgICAge1xuICAgICAgICAgIG1lc3NhZ2VfaWQ6ICd0ZXN0LW1lc3NhZ2UtaWQnLFxuICAgICAgICAgIHF1ZXN0aW9uOiAnTW9kaWZpZWQgcXVlcnknLFxuICAgICAgICAgIGFuc3dlcjogJ1Rlc3QgYW5zd2VyJyxcbiAgICAgICAgfSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFN0YXRlIE1hbmFnZW1lbnRcbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggY2xvc2VkIGNvbmZpcm0gbW9kYWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29uZmlybSBkaWFsb2cgc2hvdWxkIG5vdCBiZSB2aXNpYmxlIGluaXRpYWxseVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYXBwRGVidWcuZmVhdHVyZS5hbm5vdGF0aW9uLnJlbW92ZUNvbmZpcm0nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNvbmZpcm0gbW9kYWwgd2hlbiByZW1vdmUgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIGFubm90YXRpb25JZDogJ3Rlc3QtYW5ub3RhdGlvbi1pZCcsXG4gICAgICB9XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnYXBwQW5ub3RhdGlvbi5lZGl0TW9kYWwucmVtb3ZlVGhpc0NhY2hlJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbmZpcm1hdGlvbiBkaWFsb2cgc2hvdWxkIGFwcGVhclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcERlYnVnLmZlYXR1cmUuYW5ub3RhdGlvbi5yZW1vdmVDb25maXJtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uUmVtb3ZlIHdoZW4gcmVtb3ZhbCBpcyBjb25maXJtZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25SZW1vdmUgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBhbm5vdGF0aW9uSWQ6ICd0ZXN0LWFubm90YXRpb24taWQnLFxuICAgICAgICBvblJlbW92ZTogbW9ja09uUmVtb3ZlLFxuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0QW5ub3RhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIENsaWNrIHJlbW92ZVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHBBbm5vdGF0aW9uLmVkaXRNb2RhbC5yZW1vdmVUaGlzQ2FjaGUnKSlcblxuICAgICAgLy8gQ2xpY2sgY29uZmlybVxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY29uZmlybScgfSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uUmVtb3ZlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgQ2FzZXMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBxdWVyeSBhbmQgYW5zd2VyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgcXVlcnk6ICcnLFxuICAgICAgICBhbnN3ZXI6ICcnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEFubm90YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBBbm5vdGF0aW9uLmVkaXRNb2RhbC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBjb250ZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ1F1ZXJ5ID0gJ1EnLnJlcGVhdCgxMDAwKVxuICAgICAgY29uc3QgbG9uZ0Fuc3dlciA9ICdBJy5yZXBlYXQoMTAwMClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIHF1ZXJ5OiBsb25nUXVlcnksXG4gICAgICAgIGFuc3dlcjogbG9uZ0Fuc3dlcixcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nUXVlcnkpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nQW5zd2VyKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gY29udGVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNwZWNpYWxRdWVyeSA9ICdRdWVyeSB3aXRoICYgPCA+IFwiIFxcJyBjaGFyYWN0ZXJzJ1xuICAgICAgY29uc3Qgc3BlY2lhbEFuc3dlciA9ICdBbnN3ZXIgd2l0aCAmIDwgPiBcIiBcXCcgY2hhcmFjdGVycydcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIHF1ZXJ5OiBzcGVjaWFsUXVlcnksXG4gICAgICAgIGFuc3dlcjogc3BlY2lhbEFuc3dlcixcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChzcGVjaWFsUXVlcnkpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChzcGVjaWFsQW5zd2VyKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvbmx5RWRpdFJlc3BvbnNlIHByb3AnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBvbmx5RWRpdFJlc3BvbnNlOiB0cnVlLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEFubm90YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBRdWVyeSBzaG91bGQgYmUgcmVhZG9ubHksIGFuc3dlciBzaG91bGQgYmUgZWRpdGFibGVcbiAgICAgIGNvbnN0IGVkaXRMaW5rcyA9IHNjcmVlbi5xdWVyeUFsbEJ5VGV4dCgvY29tbW9uXFwub3BlcmF0aW9uXFwuZWRpdC9pKVxuICAgICAgZXhwZWN0KGVkaXRMaW5rcykudG9IYXZlTGVuZ3RoKDEpIC8vIE9ubHkgYW5zd2VyIHNob3VsZCBoYXZlIGVkaXQgYnV0dG9uXG4gICAgfSlcbiAgfSlcblxuICAvLyBFcnJvciBIYW5kbGluZyAoQ1JJVElDQUwgZm9yIGNvdmVyYWdlKVxuICBkZXNjcmliZSgnRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHRvYXN0IGFuZCBza2lwIGNhbGxiYWNrcyB3aGVuIGFkZEFubm90YXRpb24gZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25BZGRlZCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIG9uQWRkZWQ6IG1vY2tPbkFkZGVkLFxuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIE1vY2sgQVBJIGZhaWx1cmVcbiAgICAgIG1vY2tBZGRBbm5vdGF0aW9uLm1vY2tSZWplY3RlZFZhbHVlT25jZShuZXcgRXJyb3IoJ0FQSSBFcnJvcicpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEFubm90YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBGaW5kIGFuZCBjbGljayBlZGl0IGxpbmsgZm9yIHF1ZXJ5XG4gICAgICBjb25zdCBlZGl0TGlua3MgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KC9jb21tb25cXC5vcGVyYXRpb25cXC5lZGl0L2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGVkaXRMaW5rc1swXSlcblxuICAgICAgLy8gRmluZCB0ZXh0YXJlYSBhbmQgZW50ZXIgbmV3IGNvbnRlbnRcbiAgICAgIGNvbnN0IHRleHRhcmVhID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyLmNsZWFyKHRleHRhcmVhKVxuICAgICAgYXdhaXQgdXNlci50eXBlKHRleHRhcmVhLCAnTmV3IHF1ZXJ5IGNvbnRlbnQnKVxuXG4gICAgICAvLyBDbGljayBzYXZlIGJ1dHRvblxuICAgICAgY29uc3Qgc2F2ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2F2ZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHRvYXN0Tm90aWZ5U3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgbWVzc2FnZTogJ0FQSSBFcnJvcicsXG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBleHBlY3QobW9ja09uQWRkZWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgLy8gVmVyaWZ5IGVkaXQgbW9kZSByZW1haW5zIG9wZW4gKHRleHRhcmVhIHNob3VsZCBzdGlsbCBiZSB2aXNpYmxlKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGZhbGxiYWNrIGVycm9yIG1lc3NhZ2Ugd2hlbiBhZGRBbm5vdGF0aW9uIGVycm9yIGhhcyBubyBtZXNzYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQWRkZWQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBvbkFkZGVkOiBtb2NrT25BZGRlZCxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICBtb2NrQWRkQW5ub3RhdGlvbi5tb2NrUmVqZWN0ZWRWYWx1ZU9uY2Uoe30pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0QW5ub3RhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGVkaXRMaW5rcyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL2NvbW1vblxcLm9wZXJhdGlvblxcLmVkaXQvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soZWRpdExpbmtzWzBdKVxuXG4gICAgICBjb25zdCB0ZXh0YXJlYSA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlci5jbGVhcih0ZXh0YXJlYSlcbiAgICAgIGF3YWl0IHVzZXIudHlwZSh0ZXh0YXJlYSwgJ05ldyBxdWVyeSBjb250ZW50JylcblxuICAgICAgY29uc3Qgc2F2ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2F2ZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHRvYXN0Tm90aWZ5U3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgbWVzc2FnZTogJ2NvbW1vbi5hcGkuYWN0aW9uRmFpbGVkJyxcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChtb2NrT25BZGRlZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAvLyBWZXJpZnkgZWRpdCBtb2RlIHJlbWFpbnMgb3BlbiAodGV4dGFyZWEgc2hvdWxkIHN0aWxsIGJlIHZpc2libGUpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgdG9hc3QgYW5kIHNraXAgY2FsbGJhY2tzIHdoZW4gZWRpdEFubm90YXRpb24gZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25FZGl0ZWQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBhbm5vdGF0aW9uSWQ6ICd0ZXN0LWFubm90YXRpb24taWQnLFxuICAgICAgICBtZXNzYWdlSWQ6ICd0ZXN0LW1lc3NhZ2UtaWQnLFxuICAgICAgICBvbkVkaXRlZDogbW9ja09uRWRpdGVkLFxuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIE1vY2sgQVBJIGZhaWx1cmVcbiAgICAgIG1vY2tFZGl0QW5ub3RhdGlvbi5tb2NrUmVqZWN0ZWRWYWx1ZU9uY2UobmV3IEVycm9yKCdBUEkgRXJyb3InKSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gRWRpdCBxdWVyeSBjb250ZW50XG4gICAgICBjb25zdCBlZGl0TGlua3MgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KC9jb21tb25cXC5vcGVyYXRpb25cXC5lZGl0L2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGVkaXRMaW5rc1swXSlcblxuICAgICAgY29uc3QgdGV4dGFyZWEgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXIuY2xlYXIodGV4dGFyZWEpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUodGV4dGFyZWEsICdNb2RpZmllZCBxdWVyeScpXG5cbiAgICAgIGNvbnN0IHNhdmVCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLnNhdmUnIH0pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh0b2FzdE5vdGlmeVNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIG1lc3NhZ2U6ICdBUEkgRXJyb3InLFxuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG1vY2tPbkVkaXRlZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAvLyBWZXJpZnkgZWRpdCBtb2RlIHJlbWFpbnMgb3BlbiAodGV4dGFyZWEgc2hvdWxkIHN0aWxsIGJlIHZpc2libGUpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZmFsbGJhY2sgZXJyb3IgbWVzc2FnZSB3aGVuIGVkaXRBbm5vdGF0aW9uIGVycm9yIGlzIG5vdCBhbiBFcnJvciBpbnN0YW5jZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkVkaXRlZCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIGFubm90YXRpb25JZDogJ3Rlc3QtYW5ub3RhdGlvbi1pZCcsXG4gICAgICAgIG1lc3NhZ2VJZDogJ3Rlc3QtbWVzc2FnZS1pZCcsXG4gICAgICAgIG9uRWRpdGVkOiBtb2NrT25FZGl0ZWQsXG4gICAgICB9XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgbW9ja0VkaXRBbm5vdGF0aW9uLm1vY2tSZWplY3RlZFZhbHVlT25jZSgnb29wcycpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFZGl0QW5ub3RhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGVkaXRMaW5rcyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL2NvbW1vblxcLm9wZXJhdGlvblxcLmVkaXQvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soZWRpdExpbmtzWzBdKVxuXG4gICAgICBjb25zdCB0ZXh0YXJlYSA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlci5jbGVhcih0ZXh0YXJlYSlcbiAgICAgIGF3YWl0IHVzZXIudHlwZSh0ZXh0YXJlYSwgJ01vZGlmaWVkIHF1ZXJ5JylcblxuICAgICAgY29uc3Qgc2F2ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2F2ZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHRvYXN0Tm90aWZ5U3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgbWVzc2FnZTogJ2NvbW1vbi5hcGkuYWN0aW9uRmFpbGVkJyxcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChtb2NrT25FZGl0ZWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgLy8gVmVyaWZ5IGVkaXQgbW9kZSByZW1haW5zIG9wZW4gKHRleHRhcmVhIHNob3VsZCBzdGlsbCBiZSB2aXNpYmxlKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEJpbGxpbmcgJiBQbGFuIEZlYXR1cmVzXG4gIGRlc2NyaWJlKCdCaWxsaW5nICYgUGxhbiBGZWF0dXJlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgY3JlYXRlZEF0IHRpbWUgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIGFubm90YXRpb25JZDogJ3Rlc3QtYW5ub3RhdGlvbi1pZCcsXG4gICAgICAgIGNyZWF0ZWRBdDogMTcwMTM4MTAwMCwgLy8gMjAyMy0xMi0wMSAxMDozMDowMFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RWRpdEFubm90YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayB0aGF0IHRoZSBmb3JtYXR0ZWQgdGltZSBhcHBlYXJzIHNvbWV3aGVyZSBpbiB0aGUgY29tcG9uZW50XG4gICAgICBjb25zdCBjb250YWluZXIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdkaWFsb2cnKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9IYXZlVGV4dENvbnRlbnQoJzIwMjMtMTItMDEgMTA6MzA6MDAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGNyZWF0ZWRBdCB3aGVuIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIGFubm90YXRpb25JZDogJ3Rlc3QtYW5ub3RhdGlvbi1pZCcsXG4gICAgICAgIC8vIGNyZWF0ZWRBdCBpcyB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIG5vdCBjb250YWluIGFueSB0aW1lc3RhbXBcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpXG4gICAgICBleHBlY3QoY29udGFpbmVyKS5ub3QudG9IYXZlVGV4dENvbnRlbnQoJzIwMjMtMTItMDEgMTA6MzA6MDAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgcmVtb3ZlIHNlY3Rpb24gd2hlbiBhbm5vdGF0aW9uSWQgZXhpc3RzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgYW5ub3RhdGlvbklkOiAndGVzdC1hbm5vdGF0aW9uLWlkJyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGhhdmUgcmVtb3ZlIGZ1bmN0aW9uYWxpdHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBBbm5vdGF0aW9uLmVkaXRNb2RhbC5yZW1vdmVUaGlzQ2FjaGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVG9hc3QgTm90aWZpY2F0aW9ucyAoU3VjY2VzcylcbiAgZGVzY3JpYmUoJ1RvYXN0IE5vdGlmaWNhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHN1Y2Nlc3Mgbm90aWZpY2F0aW9uIHdoZW4gc2F2ZSBvcGVyYXRpb24gY29tcGxldGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgY29uc3QgZWRpdExpbmtzID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvY29tbW9uXFwub3BlcmF0aW9uXFwuZWRpdC9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhlZGl0TGlua3NbMF0pXG5cbiAgICAgIGNvbnN0IHRleHRhcmVhID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyLmNsZWFyKHRleHRhcmVhKVxuICAgICAgYXdhaXQgdXNlci50eXBlKHRleHRhcmVhLCAnVXBkYXRlZCBxdWVyeScpXG5cbiAgICAgIGNvbnN0IHNhdmVCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLnNhdmUnIH0pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh0b2FzdE5vdGlmeVNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIG1lc3NhZ2U6ICdjb21tb24uYXBpLmFjdGlvblN1Y2Nlc3MnLFxuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBSZWFjdC5tZW1vIFBlcmZvcm1hbmNlIFRlc3RpbmdcbiAgZGVzY3JpYmUoJ1JlYWN0Lm1lbW8gUGVyZm9ybWFuY2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3QgcmUtcmVuZGVyIHdoZW4gcHJvcHMgYXJlIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gUmUtcmVuZGVyIHdpdGggc2FtZSBwcm9wc1xuICAgICAgcmVyZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCBzdGlsbCBiZSB2aXNpYmxlIChubyBlcnJvcnMgdGhyb3duKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcEFubm90YXRpb24uZWRpdE1vZGFsLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1yZW5kZXIgd2hlbiBwcm9wcyBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8RWRpdEFubm90YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBSZS1yZW5kZXIgd2l0aCBkaWZmZXJlbnQgcHJvcHNcbiAgICAgIGNvbnN0IG5ld1Byb3BzID0geyAuLi5wcm9wcywgcXVlcnk6ICdOZXcgcXVlcnkgY29udGVudCcgfVxuICAgICAgcmVyZW5kZXIoPEVkaXRBbm5vdGF0aW9uTW9kYWwgey4uLm5ld1Byb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgbmV3IGNvbnRlbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdOZXcgcXVlcnkgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=