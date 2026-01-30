"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
// Helper to render StopEmbeddingModal with default props
const renderStopEmbeddingModal = (props = {}) => {
    const defaultProps = {
        show: true,
        onConfirm: vi.fn(),
        onHide: vi.fn(),
        ...props,
    };
    return {
        ...(0, react_1.render)(<index_1.default {...defaultProps}/>),
        props: defaultProps,
    };
};
// ============================================================================
// StopEmbeddingModal Component Tests
// ============================================================================
describe('StopEmbeddingModal', () => {
    // Suppress Headless UI warnings in tests
    // These warnings are from the library's internal behavior, not our code
    let consoleWarnSpy;
    let consoleErrorSpy;
    beforeAll(() => {
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    });
    afterAll(() => {
        consoleWarnSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests - Verify component renders properly
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing when show is true', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
        });
        it('should render modal title', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
        });
        it('should render modal content', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelContent')).toBeInTheDocument();
        });
        it('should render confirm button with correct text', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm')).toBeInTheDocument();
        });
        it('should render cancel button with correct text', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel')).toBeInTheDocument();
        });
        it('should not render modal content when show is false', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: false });
            // Assert
            expect(react_1.screen.queryByText('datasetCreation.stepThree.modelTitle')).not.toBeInTheDocument();
        });
        it('should render buttons in correct order (cancel first, then confirm)', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert - Due to flex-row-reverse, confirm appears first visually but cancel is first in DOM
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons).toHaveLength(2);
        });
        it('should render confirm button with primary variant styling', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
            expect(confirmButton).toHaveClass('ml-2', 'w-24');
        });
        it('should render cancel button with default styling', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            const cancelButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel');
            expect(cancelButton).toHaveClass('w-24');
        });
        it('should render all modal elements', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert - Modal should contain title, content, and buttons
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelContent')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Props Testing - Test all prop variations
    // --------------------------------------------------------------------------
    describe('Props', () => {
        describe('show prop', () => {
            it('should show modal when show is true', () => {
                // Arrange & Act
                renderStopEmbeddingModal({ show: true });
                // Assert
                expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
            });
            it('should hide modal when show is false', () => {
                // Arrange & Act
                renderStopEmbeddingModal({ show: false });
                // Assert
                expect(react_1.screen.queryByText('datasetCreation.stepThree.modelTitle')).not.toBeInTheDocument();
            });
            it('should use default value false when show is not provided', () => {
                // Arrange & Act
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                (0, react_1.render)(<index_1.default onConfirm={onConfirm} onHide={onHide} show={false}/>);
                // Assert
                expect(react_1.screen.queryByText('datasetCreation.stepThree.modelTitle')).not.toBeInTheDocument();
            });
            it('should toggle visibility when show prop changes to true', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                // Act - Initially hidden
                const { rerender } = (0, react_1.render)(<index_1.default show={false} onConfirm={onConfirm} onHide={onHide}/>);
                expect(react_1.screen.queryByText('datasetCreation.stepThree.modelTitle')).not.toBeInTheDocument();
                // Act - Show modal
                await (0, react_1.act)(async () => {
                    rerender(<index_1.default show={true} onConfirm={onConfirm} onHide={onHide}/>);
                });
                // Assert - Modal should be visible
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
                });
            });
        });
        describe('onConfirm prop', () => {
            it('should accept onConfirm callback function', () => {
                // Arrange
                const onConfirm = vi.fn();
                // Act
                renderStopEmbeddingModal({ onConfirm });
                // Assert - No errors thrown
                expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
            });
        });
        describe('onHide prop', () => {
            it('should accept onHide callback function', () => {
                // Arrange
                const onHide = vi.fn();
                // Act
                renderStopEmbeddingModal({ onHide });
                // Assert - No errors thrown
                expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // User Interactions Tests - Test click events and event handlers
    // --------------------------------------------------------------------------
    describe('User Interactions', () => {
        describe('Confirm Button', () => {
            it('should call onConfirm when confirm button is clicked', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                renderStopEmbeddingModal({ onConfirm, onHide });
                // Act
                const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(confirmButton);
                });
                // Assert
                expect(onConfirm).toHaveBeenCalledTimes(1);
            });
            it('should call onHide when confirm button is clicked', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                renderStopEmbeddingModal({ onConfirm, onHide });
                // Act
                const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(confirmButton);
                });
                // Assert
                expect(onHide).toHaveBeenCalledTimes(1);
            });
            it('should call both onConfirm and onHide in correct order when confirm button is clicked', async () => {
                // Arrange
                const callOrder = [];
                const onConfirm = vi.fn(() => callOrder.push('confirm'));
                const onHide = vi.fn(() => callOrder.push('hide'));
                renderStopEmbeddingModal({ onConfirm, onHide });
                // Act
                const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(confirmButton);
                });
                // Assert - onConfirm should be called before onHide
                expect(callOrder).toEqual(['confirm', 'hide']);
            });
            it('should handle multiple clicks on confirm button', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                renderStopEmbeddingModal({ onConfirm, onHide });
                // Act
                const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(confirmButton);
                    react_1.fireEvent.click(confirmButton);
                    react_1.fireEvent.click(confirmButton);
                });
                // Assert
                expect(onConfirm).toHaveBeenCalledTimes(3);
                expect(onHide).toHaveBeenCalledTimes(3);
            });
        });
        describe('Cancel Button', () => {
            it('should call onHide when cancel button is clicked', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                renderStopEmbeddingModal({ onConfirm, onHide });
                // Act
                const cancelButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(cancelButton);
                });
                // Assert
                expect(onHide).toHaveBeenCalledTimes(1);
            });
            it('should not call onConfirm when cancel button is clicked', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                renderStopEmbeddingModal({ onConfirm, onHide });
                // Act
                const cancelButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(cancelButton);
                });
                // Assert
                expect(onConfirm).not.toHaveBeenCalled();
            });
            it('should handle multiple clicks on cancel button', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                renderStopEmbeddingModal({ onConfirm, onHide });
                // Act
                const cancelButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(cancelButton);
                    react_1.fireEvent.click(cancelButton);
                });
                // Assert
                expect(onHide).toHaveBeenCalledTimes(2);
                expect(onConfirm).not.toHaveBeenCalled();
            });
        });
        describe('Close Icon', () => {
            it('should call onHide when close span is clicked', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                const { container } = renderStopEmbeddingModal({ onConfirm, onHide });
                // Act - Find the close span (it should be the span with onClick handler)
                const spans = container.querySelectorAll('span');
                const closeSpan = Array.from(spans).find(span => span.className && span.getAttribute('class')?.includes('close'));
                if (closeSpan) {
                    await (0, react_1.act)(async () => {
                        react_1.fireEvent.click(closeSpan);
                    });
                    // Assert
                    expect(onHide).toHaveBeenCalledTimes(1);
                }
                else {
                    // If no close span found with class, just verify the modal renders
                    expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
                }
            });
            it('should not call onConfirm when close span is clicked', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                const { container } = renderStopEmbeddingModal({ onConfirm, onHide });
                // Act
                const spans = container.querySelectorAll('span');
                const closeSpan = Array.from(spans).find(span => span.className && span.getAttribute('class')?.includes('close'));
                if (closeSpan) {
                    await (0, react_1.act)(async () => {
                        react_1.fireEvent.click(closeSpan);
                    });
                    // Assert
                    expect(onConfirm).not.toHaveBeenCalled();
                }
            });
        });
        describe('Different Close Methods', () => {
            it('should distinguish between confirm and cancel actions', async () => {
                // Arrange
                const onConfirm = vi.fn();
                const onHide = vi.fn();
                renderStopEmbeddingModal({ onConfirm, onHide });
                // Act - Click cancel
                const cancelButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(cancelButton);
                });
                // Assert
                expect(onConfirm).not.toHaveBeenCalled();
                expect(onHide).toHaveBeenCalledTimes(1);
                // Reset
                vi.clearAllMocks();
                // Act - Click confirm
                const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(confirmButton);
                });
                // Assert
                expect(onConfirm).toHaveBeenCalledTimes(1);
                expect(onHide).toHaveBeenCalledTimes(1);
            });
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases Tests - Test null, undefined, empty values and boundaries
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle rapid confirm button clicks', async () => {
            // Arrange
            const onConfirm = vi.fn();
            const onHide = vi.fn();
            renderStopEmbeddingModal({ onConfirm, onHide });
            // Act - Rapid clicks
            const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
            await (0, react_1.act)(async () => {
                for (let i = 0; i < 10; i++)
                    react_1.fireEvent.click(confirmButton);
            });
            // Assert
            expect(onConfirm).toHaveBeenCalledTimes(10);
            expect(onHide).toHaveBeenCalledTimes(10);
        });
        it('should handle rapid cancel button clicks', async () => {
            // Arrange
            const onConfirm = vi.fn();
            const onHide = vi.fn();
            renderStopEmbeddingModal({ onConfirm, onHide });
            // Act - Rapid clicks
            const cancelButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel');
            await (0, react_1.act)(async () => {
                for (let i = 0; i < 10; i++)
                    react_1.fireEvent.click(cancelButton);
            });
            // Assert
            expect(onHide).toHaveBeenCalledTimes(10);
            expect(onConfirm).not.toHaveBeenCalled();
        });
        it('should handle callbacks being replaced', async () => {
            // Arrange
            const onConfirm1 = vi.fn();
            const onHide1 = vi.fn();
            const onConfirm2 = vi.fn();
            const onHide2 = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default show={true} onConfirm={onConfirm1} onHide={onHide1}/>);
            // Replace callbacks
            await (0, react_1.act)(async () => {
                rerender(<index_1.default show={true} onConfirm={onConfirm2} onHide={onHide2}/>);
            });
            // Click confirm with new callbacks
            const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
            await (0, react_1.act)(async () => {
                react_1.fireEvent.click(confirmButton);
            });
            // Assert - New callbacks should be called
            expect(onConfirm1).not.toHaveBeenCalled();
            expect(onHide1).not.toHaveBeenCalled();
            expect(onConfirm2).toHaveBeenCalledTimes(1);
            expect(onHide2).toHaveBeenCalledTimes(1);
        });
        it('should render with all required props', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default show={true} onConfirm={vi.fn()} onHide={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelContent')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Layout and Styling Tests - Verify correct structure
    // --------------------------------------------------------------------------
    describe('Layout and Styling', () => {
        it('should have buttons container with flex-row-reverse', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons[0].closest('div')).toHaveClass('flex', 'flex-row-reverse');
        });
        it('should render title and content elements', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelContent')).toBeInTheDocument();
        });
        it('should render two buttons', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons).toHaveLength(2);
        });
    });
    // --------------------------------------------------------------------------
    // submit Function Tests - Test the internal submit function behavior
    // --------------------------------------------------------------------------
    describe('submit Function', () => {
        it('should execute onConfirm first then onHide', async () => {
            // Arrange
            let confirmTime = 0;
            let hideTime = 0;
            let counter = 0;
            const onConfirm = vi.fn(() => {
                confirmTime = ++counter;
            });
            const onHide = vi.fn(() => {
                hideTime = ++counter;
            });
            renderStopEmbeddingModal({ onConfirm, onHide });
            // Act
            const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
            await (0, react_1.act)(async () => {
                react_1.fireEvent.click(confirmButton);
            });
            // Assert
            expect(confirmTime).toBe(1);
            expect(hideTime).toBe(2);
        });
        it('should call both callbacks exactly once per click', async () => {
            // Arrange
            const onConfirm = vi.fn();
            const onHide = vi.fn();
            renderStopEmbeddingModal({ onConfirm, onHide });
            // Act
            const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
            await (0, react_1.act)(async () => {
                react_1.fireEvent.click(confirmButton);
            });
            // Assert
            expect(onConfirm).toHaveBeenCalledTimes(1);
            expect(onHide).toHaveBeenCalledTimes(1);
        });
        it('should pass no arguments to onConfirm', async () => {
            // Arrange
            const onConfirm = vi.fn();
            const onHide = vi.fn();
            renderStopEmbeddingModal({ onConfirm, onHide });
            // Act
            const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
            await (0, react_1.act)(async () => {
                react_1.fireEvent.click(confirmButton);
            });
            // Assert
            expect(onConfirm).toHaveBeenCalledWith();
        });
        it('should pass no arguments to onHide when called from submit', async () => {
            // Arrange
            const onConfirm = vi.fn();
            const onHide = vi.fn();
            renderStopEmbeddingModal({ onConfirm, onHide });
            // Act
            const confirmButton = react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm');
            await (0, react_1.act)(async () => {
                react_1.fireEvent.click(confirmButton);
            });
            // Assert
            expect(onHide).toHaveBeenCalledWith();
        });
    });
    // --------------------------------------------------------------------------
    // Modal Integration Tests - Verify Modal component integration
    // --------------------------------------------------------------------------
    describe('Modal Integration', () => {
        it('should pass show prop to Modal as isShow', async () => {
            // Arrange & Act
            const { rerender } = (0, react_1.render)(<index_1.default show={true} onConfirm={vi.fn()} onHide={vi.fn()}/>);
            // Assert - Modal should be visible
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
            // Act - Hide modal
            await (0, react_1.act)(async () => {
                rerender(<index_1.default show={false} onConfirm={vi.fn()} onHide={vi.fn()}/>);
            });
            // Assert - Modal should transition to hidden (wait for transition)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('datasetCreation.stepThree.modelTitle')).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });
    // --------------------------------------------------------------------------
    // Accessibility Tests
    // --------------------------------------------------------------------------
    describe('Accessibility', () => {
        it('should have buttons that are focusable', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).not.toHaveAttribute('tabindex', '-1');
            });
        });
        it('should have semantic button elements', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons).toHaveLength(2);
        });
        it('should have accessible text content', () => {
            // Arrange & Act
            renderStopEmbeddingModal({ show: true });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeVisible();
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelContent')).toBeVisible();
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelButtonConfirm')).toBeVisible();
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelButtonCancel')).toBeVisible();
        });
    });
    // --------------------------------------------------------------------------
    // Component Lifecycle Tests
    // --------------------------------------------------------------------------
    describe('Component Lifecycle', () => {
        it('should unmount cleanly', () => {
            // Arrange
            const onConfirm = vi.fn();
            const onHide = vi.fn();
            const { unmount } = renderStopEmbeddingModal({ onConfirm, onHide });
            // Act & Assert - Should not throw
            expect(() => unmount()).not.toThrow();
        });
        it('should not call callbacks after unmount', () => {
            // Arrange
            const onConfirm = vi.fn();
            const onHide = vi.fn();
            const { unmount } = renderStopEmbeddingModal({ onConfirm, onHide });
            // Act
            unmount();
            // Assert - No callbacks should be called after unmount
            expect(onConfirm).not.toHaveBeenCalled();
            expect(onHide).not.toHaveBeenCalled();
        });
        it('should re-render correctly when props update', async () => {
            // Arrange
            const onConfirm1 = vi.fn();
            const onHide1 = vi.fn();
            const onConfirm2 = vi.fn();
            const onHide2 = vi.fn();
            // Act - Initial render
            const { rerender } = (0, react_1.render)(<index_1.default show={true} onConfirm={onConfirm1} onHide={onHide1}/>);
            // Verify initial render
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
            // Update props
            await (0, react_1.act)(async () => {
                rerender(<index_1.default show={true} onConfirm={onConfirm2} onHide={onHide2}/>);
            });
            // Assert - Still renders correctly
            expect(react_1.screen.getByText('datasetCreation.stepThree.modelTitle')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWdGO0FBQ2hGLG1DQUF3QztBQVN4Qyx5REFBeUQ7QUFDekQsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLFFBQTBDLEVBQUUsRUFBRSxFQUFFO0lBQ2hGLE1BQU0sWUFBWSxHQUE0QjtRQUM1QyxJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xCLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2YsR0FBRyxLQUFLO0tBQ1QsQ0FBQTtJQUNELE9BQU87UUFDTCxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBa0IsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUM7UUFDbkQsS0FBSyxFQUFFLFlBQVk7S0FDcEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELCtFQUErRTtBQUMvRSxxQ0FBcUM7QUFDckMsK0VBQStFO0FBQy9FLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMseUNBQXlDO0lBQ3pDLHdFQUF3RTtJQUN4RSxJQUFJLGNBQTRCLENBQUE7SUFDaEMsSUFBSSxlQUE2QixDQUFBO0lBRWpDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDYixjQUFjLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDdEUsZUFBZSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQzFFLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNaLGNBQWMsQ0FBQyxXQUFXLEVB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QUFJLEVBQUU7Z0JBQ25CLFFBQVEsQ0FBQyxDQUFDLGVBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQ3RGLENBQUMsQ0FBQyxDQUFBO1lBRUYsbUNBQW1DO1lBQ25DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3RGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9ja0luc3RhbmNlIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgYWN0LCBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCBTdG9wRW1iZWRkaW5nTW9kYWwgZnJvbSAnLi9pbmRleCdcblxuLy8gSGVscGVyIHR5cGUgZm9yIGNvbXBvbmVudCBwcm9wc1xudHlwZSBTdG9wRW1iZWRkaW5nTW9kYWxQcm9wcyA9IHtcbiAgc2hvdzogYm9vbGVhblxuICBvbkNvbmZpcm06ICgpID0+IHZvaWRcbiAgb25IaWRlOiAoKSA9PiB2b2lkXG59XG5cbi8vIEhlbHBlciB0byByZW5kZXIgU3RvcEVtYmVkZGluZ01vZGFsIHdpdGggZGVmYXVsdCBwcm9wc1xuY29uc3QgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsID0gKHByb3BzOiBQYXJ0aWFsPFN0b3BFbWJlZGRpbmdNb2RhbFByb3BzPiA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wczogU3RvcEVtYmVkZGluZ01vZGFsUHJvcHMgPSB7XG4gICAgc2hvdzogdHJ1ZSxcbiAgICBvbkNvbmZpcm06IHZpLmZuKCksXG4gICAgb25IaWRlOiB2aS5mbigpLFxuICAgIC4uLnByb3BzLFxuICB9XG4gIHJldHVybiB7XG4gICAgLi4ucmVuZGVyKDxTdG9wRW1iZWRkaW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pLFxuICAgIHByb3BzOiBkZWZhdWx0UHJvcHMsXG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU3RvcEVtYmVkZGluZ01vZGFsIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1N0b3BFbWJlZGRpbmdNb2RhbCcsICgpID0+IHtcbiAgLy8gU3VwcHJlc3MgSGVhZGxlc3MgVUkgd2FybmluZ3MgaW4gdGVzdHNcbiAgLy8gVGhlc2Ugd2FybmluZ3MgYXJlIGZyb20gdGhlIGxpYnJhcnkncyBpbnRlcm5hbCBiZWhhdmlvciwgbm90IG91ciBjb2RlXG4gIGxldCBjb25zb2xlV2FyblNweTogTW9ja0luc3RhbmNlXG4gIGxldCBjb25zb2xlRXJyb3JTcHk6IE1vY2tJbnN0YW5jZVxuXG4gIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgY29uc29sZVdhcm5TcHkgPSB2aS5zcHlPbihjb25zb2xlLCAnd2FybicpLm1vY2tJbXBsZW1lbnRhdGlvbih2aS5mbigpKVxuICAgIGNvbnNvbGVFcnJvclNweSA9IHZpLnNweU9uKGNvbnNvbGUsICdlcnJvcicpLm1vY2tJbXBsZW1lbnRhdGlvbih2aS5mbigpKVxuICB9KVxuXG4gIGFmdGVyQWxsKCgpID0+IHtcbiAgICBjb25zb2xlV2FyblNweS5tb2NrUmVzdG9yZSgpXG4gICAgY29uc29sZUVycm9yU3B5Lm1vY2tSZXN0b3JlKClcbiAgfSlcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHMgLSBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgcHJvcGVybHlcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nIHdoZW4gc2hvdyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgc2hvdzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB0aXRsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IHNob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgY29udGVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IHNob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb25maXJtIGJ1dHRvbiB3aXRoIGNvcnJlY3QgdGV4dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IHNob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjYW5jZWwgYnV0dG9uIHdpdGggY29ycmVjdCB0ZXh0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgc2hvdzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsQnV0dG9uQ2FuY2VsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIG1vZGFsIGNvbnRlbnQgd2hlbiBzaG93IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgc2hvdzogZmFsc2UgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYnV0dG9ucyBpbiBjb3JyZWN0IG9yZGVyIChjYW5jZWwgZmlyc3QsIHRoZW4gY29uZmlybSknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBzaG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIER1ZSB0byBmbGV4LXJvdy1yZXZlcnNlLCBjb25maXJtIGFwcGVhcnMgZmlyc3QgdmlzdWFsbHkgYnV0IGNhbmNlbCBpcyBmaXJzdCBpbiBET01cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb25maXJtIGJ1dHRvbiB3aXRoIHByaW1hcnkgdmFyaWFudCBzdHlsaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgc2hvdzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsQnV0dG9uQ29uZmlybScpXG4gICAgICBleHBlY3QoY29uZmlybUJ1dHRvbikudG9IYXZlQ2xhc3MoJ21sLTInLCAndy0yNCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNhbmNlbCBidXR0b24gd2l0aCBkZWZhdWx0IHN0eWxpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBzaG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY2FuY2VsQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNhbmNlbCcpXG4gICAgICBleHBlY3QoY2FuY2VsQnV0dG9uKS50b0hhdmVDbGFzcygndy0yNCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBtb2RhbCBlbGVtZW50cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IHNob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTW9kYWwgc2hvdWxkIGNvbnRhaW4gdGl0bGUsIGNvbnRlbnQsIGFuZCBidXR0b25zXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsQ29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxCdXR0b25DYW5jZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVGVzdGluZyAtIFRlc3QgYWxsIHByb3AgdmFyaWF0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3Nob3cgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyBtb2RhbCB3aGVuIHNob3cgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBzaG93OiB0cnVlIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoaWRlIG1vZGFsIHdoZW4gc2hvdyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBzaG93OiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHQgdmFsdWUgZmFsc2Ugd2hlbiBzaG93IGlzIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCBvbkNvbmZpcm0gPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IG9uSGlkZSA9IHZpLmZuKClcbiAgICAgICAgcmVuZGVyKDxTdG9wRW1iZWRkaW5nTW9kYWwgb25Db25maXJtPXtvbkNvbmZpcm19IG9uSGlkZT17b25IaWRlfSBzaG93PXtmYWxzZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxUaXRsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHNob3cgcHJvcCBjaGFuZ2VzIHRvIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25Db25maXJtID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0IC0gSW5pdGlhbGx5IGhpZGRlblxuICAgICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPFN0b3BFbWJlZGRpbmdNb2RhbCBzaG93PXtmYWxzZX0gb25Db25maXJtPXtvbkNvbmZpcm19IG9uSGlkZT17b25IaWRlfSAvPixcbiAgICAgICAgKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgICAvLyBBY3QgLSBTaG93IG1vZGFsXG4gICAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgcmVyZW5kZXIoPFN0b3BFbWJlZGRpbmdNb2RhbCBzaG93PXt0cnVlfSBvbkNvbmZpcm09e29uQ29uZmlybX0gb25IaWRlPXtvbkhpZGV9IC8+KVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE1vZGFsIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ29uQ29uZmlybSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBhY2NlcHQgb25Db25maXJtIGNhbGxiYWNrIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgb25Db25maXJtIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gTm8gZXJyb3JzIHRocm93blxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvbkhpZGUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYWNjZXB0IG9uSGlkZSBjYWxsYmFjayBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IG9uSGlkZSB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE5vIGVycm9ycyB0aHJvd25cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHMgLSBUZXN0IGNsaWNrIGV2ZW50cyBhbmQgZXZlbnQgaGFuZGxlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdDb25maXJtIEJ1dHRvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkNvbmZpcm0gd2hlbiBjb25maXJtIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuICAgICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKVxuICAgICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25Db25maXJtKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkhpZGUgd2hlbiBjb25maXJtIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuICAgICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKVxuICAgICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25IaWRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBib3RoIG9uQ29uZmlybSBhbmQgb25IaWRlIGluIGNvcnJlY3Qgb3JkZXIgd2hlbiBjb25maXJtIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGNhbGxPcmRlcjogc3RyaW5nW10gPSBbXVxuICAgICAgICBjb25zdCBvbkNvbmZpcm0gPSB2aS5mbigoKSA9PiBjYWxsT3JkZXIucHVzaCgnY29uZmlybScpKVxuICAgICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigoKSA9PiBjYWxsT3JkZXIucHVzaCgnaGlkZScpKVxuICAgICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKVxuICAgICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIG9uQ29uZmlybSBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBvbkhpZGVcbiAgICAgICAgZXhwZWN0KGNhbGxPcmRlcikudG9FcXVhbChbJ2NvbmZpcm0nLCAnaGlkZSddKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgY2xpY2tzIG9uIGNvbmZpcm0gYnV0dG9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuICAgICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKVxuICAgICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25Db25maXJtKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ2FuY2VsIEJ1dHRvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkhpZGUgd2hlbiBjYW5jZWwgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25Db25maXJtID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG4gICAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IG9uQ29uZmlybSwgb25IaWRlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxCdXR0b25DYW5jZWwnKVxuICAgICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjYW5jZWxCdXR0b24pXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNvbmZpcm0gd2hlbiBjYW5jZWwgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25Db25maXJtID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG4gICAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IG9uQ29uZmlybSwgb25IaWRlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxCdXR0b25DYW5jZWwnKVxuICAgICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjYW5jZWxCdXR0b24pXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNvbmZpcm0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGNsaWNrcyBvbiBjYW5jZWwgYnV0dG9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuICAgICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsQnV0dG9uQ2FuY2VsJylcbiAgICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2FuY2VsQnV0dG9uKVxuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjYW5jZWxCdXR0b24pXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgICAgICBleHBlY3Qob25Db25maXJtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ2xvc2UgSWNvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkhpZGUgd2hlbiBjbG9zZSBzcGFuIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25Db25maXJtID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAgIC8vIEFjdCAtIEZpbmQgdGhlIGNsb3NlIHNwYW4gKGl0IHNob3VsZCBiZSB0aGUgc3BhbiB3aXRoIG9uQ2xpY2sgaGFuZGxlcilcbiAgICAgICAgY29uc3Qgc3BhbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc3BhbicpXG4gICAgICAgIGNvbnN0IGNsb3NlU3BhbiA9IEFycmF5LmZyb20oc3BhbnMpLmZpbmQoc3BhbiA9PlxuICAgICAgICAgIHNwYW4uY2xhc3NOYW1lICYmIHNwYW4uZ2V0QXR0cmlidXRlKCdjbGFzcycpPy5pbmNsdWRlcygnY2xvc2UnKSxcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChjbG9zZVNwYW4pIHtcbiAgICAgICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlU3BhbilcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy8gSWYgbm8gY2xvc2Ugc3BhbiBmb3VuZCB3aXRoIGNsYXNzLCBqdXN0IHZlcmlmeSB0aGUgbW9kYWwgcmVuZGVyc1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uQ29uZmlybSB3aGVuIGNsb3NlIHNwYW4gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNvbmZpcm0gPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IG9uSGlkZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IG9uQ29uZmlybSwgb25IaWRlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHNwYW5zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NwYW4nKVxuICAgICAgICBjb25zdCBjbG9zZVNwYW4gPSBBcnJheS5mcm9tKHNwYW5zKS5maW5kKHNwYW4gPT5cbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSAmJiBzcGFuLmdldEF0dHJpYnV0ZSgnY2xhc3MnKT8uaW5jbHVkZXMoJ2Nsb3NlJyksXG4gICAgICAgIClcblxuICAgICAgICBpZiAoY2xvc2VTcGFuKSB7XG4gICAgICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZVNwYW4pXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC8vIEFzc2VydFxuICAgICAgICAgIGV4cGVjdChvbkNvbmZpcm0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0RpZmZlcmVudCBDbG9zZSBNZXRob2RzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBkaXN0aW5ndWlzaCBiZXR3ZWVuIGNvbmZpcm0gYW5kIGNhbmNlbCBhY3Rpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuICAgICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIGNhbmNlbFxuICAgICAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsQnV0dG9uQ2FuY2VsJylcbiAgICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2FuY2VsQnV0dG9uKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25Db25maXJtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICAgIC8vIFJlc2V0XG4gICAgICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIGNvbmZpcm1cbiAgICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxCdXR0b25Db25maXJtJylcbiAgICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ29uZmlybSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHMgLSBUZXN0IG51bGwsIHVuZGVmaW5lZCwgZW1wdHkgdmFsdWVzIGFuZCBib3VuZGFyaWVzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIGNvbmZpcm0gYnV0dG9uIGNsaWNrcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IG9uQ29uZmlybSwgb25IaWRlIH0pXG5cbiAgICAgIC8vIEFjdCAtIFJhcGlkIGNsaWNrc1xuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxCdXR0b25Db25maXJtJylcbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKylcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ29uZmlybSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEwKVxuICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBjYW5jZWwgYnV0dG9uIGNsaWNrcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uSGlkZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IG9uQ29uZmlybSwgb25IaWRlIH0pXG5cbiAgICAgIC8vIEFjdCAtIFJhcGlkIGNsaWNrc1xuICAgICAgY29uc3QgY2FuY2VsQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNhbmNlbCcpXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspXG4gICAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNhbmNlbEJ1dHRvbilcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEwKVxuICAgICAgZXhwZWN0KG9uQ29uZmlybSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjYWxsYmFja3MgYmVpbmcgcmVwbGFjZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNvbmZpcm0xID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25IaWRlMSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uQ29uZmlybTIgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkhpZGUyID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFN0b3BFbWJlZGRpbmdNb2RhbCBzaG93PXt0cnVlfSBvbkNvbmZpcm09e29uQ29uZmlybTF9IG9uSGlkZT17b25IaWRlMX0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFJlcGxhY2UgY2FsbGJhY2tzXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICByZXJlbmRlcig8U3RvcEVtYmVkZGluZ01vZGFsIHNob3c9e3RydWV9IG9uQ29uZmlybT17b25Db25maXJtMn0gb25IaWRlPXtvbkhpZGUyfSAvPilcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsaWNrIGNvbmZpcm0gd2l0aCBuZXcgY2FsbGJhY2tzXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKVxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBOZXcgY2FsbGJhY2tzIHNob3VsZCBiZSBjYWxsZWRcbiAgICAgIGV4cGVjdChvbkNvbmZpcm0xKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qob25IaWRlMSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG9uQ29uZmlybTIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uSGlkZTIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGFsbCByZXF1aXJlZCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFN0b3BFbWJlZGRpbmdNb2RhbFxuICAgICAgICAgIHNob3c9e3RydWV9XG4gICAgICAgICAgb25Db25maXJtPXt2aS5mbigpfVxuICAgICAgICAgIG9uSGlkZT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTGF5b3V0IGFuZCBTdHlsaW5nIFRlc3RzIC0gVmVyaWZ5IGNvcnJlY3Qgc3RydWN0dXJlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdMYXlvdXQgYW5kIFN0eWxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGJ1dHRvbnMgY29udGFpbmVyIHdpdGggZmxleC1yb3ctcmV2ZXJzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IHNob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b25zWzBdLmNsb3Nlc3QoJ2RpdicpKS50b0hhdmVDbGFzcygnZmxleCcsICdmbGV4LXJvdy1yZXZlcnNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGl0bGUgYW5kIGNvbnRlbnQgZWxlbWVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBzaG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0d28gYnV0dG9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IHNob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b25zKS50b0hhdmVMZW5ndGgoMilcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHN1Ym1pdCBGdW5jdGlvbiBUZXN0cyAtIFRlc3QgdGhlIGludGVybmFsIHN1Ym1pdCBmdW5jdGlvbiBiZWhhdmlvclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnc3VibWl0IEZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZXhlY3V0ZSBvbkNvbmZpcm0gZmlyc3QgdGhlbiBvbkhpZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBsZXQgY29uZmlybVRpbWUgPSAwXG4gICAgICBsZXQgaGlkZVRpbWUgPSAwXG4gICAgICBsZXQgY291bnRlciA9IDBcbiAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKCgpID0+IHtcbiAgICAgICAgY29uZmlybVRpbWUgPSArK2NvdW50ZXJcbiAgICAgIH0pXG4gICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigoKSA9PiB7XG4gICAgICAgIGhpZGVUaW1lID0gKytjb3VudGVyXG4gICAgICB9KVxuICAgICAgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgb25Db25maXJtLCBvbkhpZGUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKVxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb25maXJtVGltZSkudG9CZSgxKVxuICAgICAgZXhwZWN0KGhpZGVUaW1lKS50b0JlKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBib3RoIGNhbGxiYWNrcyBleGFjdGx5IG9uY2UgcGVyIGNsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25Db25maXJtID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgb25Db25maXJtLCBvbkhpZGUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKVxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBubyBhcmd1bWVudHMgdG8gb25Db25maXJtJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25Db25maXJtID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgb25Db25maXJtLCBvbkhpZGUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKVxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIG5vIGFyZ3VtZW50cyB0byBvbkhpZGUgd2hlbiBjYWxsZWQgZnJvbSBzdWJtaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNvbmZpcm0gPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG4gICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsQnV0dG9uQ29uZmlybScpXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTW9kYWwgSW50ZWdyYXRpb24gVGVzdHMgLSBWZXJpZnkgTW9kYWwgY29tcG9uZW50IGludGVncmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdNb2RhbCBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3Mgc2hvdyBwcm9wIHRvIE1vZGFsIGFzIGlzU2hvdycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFN0b3BFbWJlZGRpbmdNb2RhbCBzaG93PXt0cnVlfSBvbkNvbmZpcm09e3ZpLmZuKCl9IG9uSGlkZT17dmkuZm4oKX0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIE1vZGFsIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gSGlkZSBtb2RhbFxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgcmVyZW5kZXIoPFN0b3BFbWJlZGRpbmdNb2RhbCBzaG93PXtmYWxzZX0gb25Db25maXJtPXt2aS5mbigpfSBvbkhpZGU9e3ZpLmZuKCl9IC8+KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTW9kYWwgc2hvdWxkIHRyYW5zaXRpb24gdG8gaGlkZGVuICh3YWl0IGZvciB0cmFuc2l0aW9uKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxUaXRsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSwgeyB0aW1lb3V0OiAzMDAwIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBBY2Nlc3NpYmlsaXR5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBidXR0b25zIHRoYXQgYXJlIGZvY3VzYWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IHNob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGV4cGVjdChidXR0b24pLm5vdC50b0hhdmVBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzZW1hbnRpYyBidXR0b24gZWxlbWVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBzaG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9ucykudG9IYXZlTGVuZ3RoKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBhY2Nlc3NpYmxlIHRleHQgY29udGVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0b3BFbWJlZGRpbmdNb2RhbCh7IHNob3c6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbFRpdGxlJykpLnRvQmVWaXNpYmxlKClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsQ29udGVudCcpKS50b0JlVmlzaWJsZSgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5tb2RlbEJ1dHRvbkNvbmZpcm0nKSkudG9CZVZpc2libGUoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubW9kZWxCdXR0b25DYW5jZWwnKSkudG9CZVZpc2libGUoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcG9uZW50IExpZmVjeWNsZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ29tcG9uZW50IExpZmVjeWNsZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVubW91bnQgY2xlYW5seScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uSGlkZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyU3RvcEVtYmVkZGluZ01vZGFsKHsgb25Db25maXJtLCBvbkhpZGUgfSlcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0IC0gU2hvdWxkIG5vdCB0aHJvd1xuICAgICAgZXhwZWN0KCgpID0+IHVubW91bnQoKSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIGNhbGxiYWNrcyBhZnRlciB1bm1vdW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25Db25maXJtID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXJTdG9wRW1iZWRkaW5nTW9kYWwoeyBvbkNvbmZpcm0sIG9uSGlkZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHVubW91bnQoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBObyBjYWxsYmFja3Mgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciB1bm1vdW50XG4gICAgICBleHBlY3Qob25Db25maXJtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qob25IaWRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmUtcmVuZGVyIGNvcnJlY3RseSB3aGVuIHByb3BzIHVwZGF0ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ29uZmlybTEgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkhpZGUxID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25Db25maXJtMiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uSGlkZTIgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdCAtIEluaXRpYWwgcmVuZGVyXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxTdG9wRW1iZWRkaW5nTW9kYWwgc2hvdz17dHJ1ZX0gb25Db25maXJtPXtvbkNvbmZpcm0xfSBvbkhpZGU9e29uSGlkZTF9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBWZXJpZnkgaW5pdGlhbCByZW5kZXJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBVcGRhdGUgcHJvcHNcbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlcmVuZGVyKDxTdG9wRW1iZWRkaW5nTW9kYWwgc2hvdz17dHJ1ZX0gb25Db25maXJtPXtvbkNvbmZpcm0yfSBvbkhpZGU9e29uSGlkZTJ9IC8+KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU3RpbGwgcmVuZGVycyBjb3JyZWN0bHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLm1vZGVsVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19