"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
// Mock next/link to capture href values
vi.mock('next/link', () => ({
    default: ({ children, href, replace, className }) => (<a href={href} data-replace={replace} className={className} data-testid="back-link">
      {children}
    </a>),
}));
// Helper to render TopBar with default props
const renderTopBar = (props = {}) => {
    const defaultProps = {
        activeIndex: 0,
        ...props,
    };
    return {
        ...(0, react_1.render)(<index_1.TopBar {...defaultProps}/>),
        props: defaultProps,
    };
};
// ============================================================================
// TopBar Component Tests
// ============================================================================
describe('TopBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests - Verify component renders properly
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderTopBar();
            // Assert
            expect(react_1.screen.getByTestId('back-link')).toBeInTheDocument();
        });
        it('should render back link with arrow icon', () => {
            // Arrange & Act
            const { container } = renderTopBar();
            // Assert
            const backLink = react_1.screen.getByTestId('back-link');
            expect(backLink).toBeInTheDocument();
            // Check for the arrow icon (svg element)
            const arrowIcon = container.querySelector('svg');
            expect(arrowIcon).toBeInTheDocument();
        });
        it('should render fallback route text', () => {
            // Arrange & Act
            renderTopBar();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.steps.header.fallbackRoute')).toBeInTheDocument();
        });
        it('should render Stepper component with 3 steps', () => {
            // Arrange & Act
            renderTopBar({ activeIndex: 0 });
            // Assert - Check for step translations
            expect(react_1.screen.getByText('datasetCreation.steps.one')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.steps.two')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.steps.three')).toBeInTheDocument();
        });
        it('should apply default container classes', () => {
            // Arrange & Act
            const { container } = renderTopBar();
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('relative');
            expect(wrapper).toHaveClass('flex');
            expect(wrapper).toHaveClass('h-[52px]');
            expect(wrapper).toHaveClass('shrink-0');
            expect(wrapper).toHaveClass('items-center');
            expect(wrapper).toHaveClass('justify-between');
            expect(wrapper).toHaveClass('border-b');
            expect(wrapper).toHaveClass('border-b-divider-subtle');
        });
    });
    // --------------------------------------------------------------------------
    // Props Testing - Test all prop variations
    // --------------------------------------------------------------------------
    describe('Props', () => {
        describe('className prop', () => {
            it('should apply custom className when provided', () => {
                // Arrange & Act
                const { container } = renderTopBar({ className: 'custom-class' });
                // Assert
                const wrapper = container.firstChild;
                expect(wrapper).toHaveClass('custom-class');
            });
            it('should merge custom className with default classes', () => {
                // Arrange & Act
                const { container } = renderTopBar({ className: 'my-custom-class another-class' });
                // Assert
                const wrapper = container.firstChild;
                expect(wrapper).toHaveClass('relative');
                expect(wrapper).toHaveClass('flex');
                expect(wrapper).toHaveClass('my-custom-class');
                expect(wrapper).toHaveClass('another-class');
            });
            it('should render correctly without className', () => {
                // Arrange & Act
                const { container } = renderTopBar({ className: undefined });
                // Assert
                const wrapper = container.firstChild;
                expect(wrapper).toHaveClass('relative');
                expect(wrapper).toHaveClass('flex');
            });
            it('should handle empty string className', () => {
                // Arrange & Act
                const { container } = renderTopBar({ className: '' });
                // Assert
                const wrapper = container.firstChild;
                expect(wrapper).toHaveClass('relative');
            });
        });
        describe('datasetId prop', () => {
            it('should set fallback route to /datasets when datasetId is undefined', () => {
                // Arrange & Act
                renderTopBar({ datasetId: undefined });
                // Assert
                const backLink = react_1.screen.getByTestId('back-link');
                expect(backLink).toHaveAttribute('href', '/datasets');
            });
            it('should set fallback route to /datasets/:id/documents when datasetId is provided', () => {
                // Arrange & Act
                renderTopBar({ datasetId: 'dataset-123' });
                // Assert
                const backLink = react_1.screen.getByTestId('back-link');
                expect(backLink).toHaveAttribute('href', '/datasets/dataset-123/documents');
            });
            it('should handle various datasetId formats', () => {
                // Arrange & Act
                renderTopBar({ datasetId: 'abc-def-ghi-123' });
                // Assert
                const backLink = react_1.screen.getByTestId('back-link');
                expect(backLink).toHaveAttribute('href', '/datasets/abc-def-ghi-123/documents');
            });
            it('should handle empty string datasetId', () => {
                // Arrange & Act
                renderTopBar({ datasetId: '' });
                // Assert - Empty string is falsy, so fallback to /datasets
                const backLink = react_1.screen.getByTestId('back-link');
                expect(backLink).toHaveAttribute('href', '/datasets');
            });
        });
        describe('activeIndex prop', () => {
            it('should pass activeIndex to Stepper component (index 0)', () => {
                // Arrange & Act
                const { container } = renderTopBar({ activeIndex: 0 });
                // Assert - First step should be active (has specific styling)
                const steps = container.querySelectorAll('[class*="system-2xs-semibold-uppercase"]');
                expect(steps.length).toBeGreaterThan(0);
            });
            it('should pass activeIndex to Stepper component (index 1)', () => {
                // Arrange & Act
                renderTopBar({ activeIndex: 1 });
                // Assert - Stepper is rendered with correct props
                expect(react_1.screen.getByText('datasetCreation.steps.one')).toBeInTheDocument();
                expect(react_1.screen.getByText('datasetCreation.steps.two')).toBeInTheDocument();
            });
            it('should pass activeIndex to Stepper component (index 2)', () => {
                // Arrange & Act
                renderTopBar({ activeIndex: 2 });
                // Assert
                expect(react_1.screen.getByText('datasetCreation.steps.three')).toBeInTheDocument();
            });
            it('should handle edge case activeIndex of -1', () => {
                // Arrange & Act
                const { container } = renderTopBar({ activeIndex: -1 });
                // Assert - Component should render without crashing
                expect(container.firstChild).toBeInTheDocument();
            });
            it('should handle edge case activeIndex beyond steps length', () => {
                // Arrange & Act
                const { container } = renderTopBar({ activeIndex: 10 });
                // Assert - Component should render without crashing
                expect(container.firstChild).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests - Test useMemo logic and dependencies
    // --------------------------------------------------------------------------
    describe('Memoization Logic', () => {
        it('should compute fallbackRoute based on datasetId', () => {
            // Arrange & Act - With datasetId
            const { rerender } = (0, react_1.render)(<index_1.TopBar activeIndex={0} datasetId="test-id"/>);
            // Assert
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets/test-id/documents');
            // Act - Rerender with different datasetId
            rerender(<index_1.TopBar activeIndex={0} datasetId="new-id"/>);
            // Assert - Route should update
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets/new-id/documents');
        });
        it('should update fallbackRoute when datasetId changes from undefined to defined', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.TopBar activeIndex={0}/>);
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets');
            // Act
            rerender(<index_1.TopBar activeIndex={0} datasetId="new-dataset"/>);
            // Assert
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets/new-dataset/documents');
        });
        it('should update fallbackRoute when datasetId changes from defined to undefined', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.TopBar activeIndex={0} datasetId="existing-id"/>);
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets/existing-id/documents');
            // Act
            rerender(<index_1.TopBar activeIndex={0} datasetId={undefined}/>);
            // Assert
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets');
        });
        it('should not change fallbackRoute when activeIndex changes but datasetId stays same', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.TopBar activeIndex={0} datasetId="stable-id"/>);
            const initialHref = react_1.screen.getByTestId('back-link').getAttribute('href');
            // Act
            rerender(<index_1.TopBar activeIndex={1} datasetId="stable-id"/>);
            // Assert - href should remain the same
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', initialHref);
        });
        it('should not change fallbackRoute when className changes but datasetId stays same', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.TopBar activeIndex={0} datasetId="stable-id" className="class-1"/>);
            const initialHref = react_1.screen.getByTestId('back-link').getAttribute('href');
            // Act
            rerender(<index_1.TopBar activeIndex={0} datasetId="stable-id" className="class-2"/>);
            // Assert - href should remain the same
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', initialHref);
        });
    });
    // --------------------------------------------------------------------------
    // Link Component Tests
    // --------------------------------------------------------------------------
    describe('Link Component', () => {
        it('should render Link with replace prop', () => {
            // Arrange & Act
            renderTopBar();
            // Assert
            const backLink = react_1.screen.getByTestId('back-link');
            expect(backLink).toHaveAttribute('data-replace', 'true');
        });
        it('should render Link with correct classes', () => {
            // Arrange & Act
            renderTopBar();
            // Assert
            const backLink = react_1.screen.getByTestId('back-link');
            expect(backLink).toHaveClass('inline-flex');
            expect(backLink).toHaveClass('h-12');
            expect(backLink).toHaveClass('items-center');
            expect(backLink).toHaveClass('justify-start');
            expect(backLink).toHaveClass('gap-1');
            expect(backLink).toHaveClass('py-2');
            expect(backLink).toHaveClass('pl-2');
            expect(backLink).toHaveClass('pr-6');
        });
    });
    // --------------------------------------------------------------------------
    // STEP_T_MAP Tests - Verify step translations
    // --------------------------------------------------------------------------
    describe('STEP_T_MAP Translations', () => {
        it('should render step one translation', () => {
            // Arrange & Act
            renderTopBar({ activeIndex: 0 });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.steps.one')).toBeInTheDocument();
        });
        it('should render step two translation', () => {
            // Arrange & Act
            renderTopBar({ activeIndex: 1 });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.steps.two')).toBeInTheDocument();
        });
        it('should render step three translation', () => {
            // Arrange & Act
            renderTopBar({ activeIndex: 2 });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.steps.three')).toBeInTheDocument();
        });
        it('should render all three step translations', () => {
            // Arrange & Act
            renderTopBar({ activeIndex: 0 });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.steps.one')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.steps.two')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.steps.three')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases and Error Handling Tests
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle special characters in datasetId', () => {
            // Arrange & Act
            renderTopBar({ datasetId: 'dataset-with-special_chars.123' });
            // Assert
            const backLink = react_1.screen.getByTestId('back-link');
            expect(backLink).toHaveAttribute('href', '/datasets/dataset-with-special_chars.123/documents');
        });
        it('should handle very long datasetId', () => {
            // Arrange
            const longId = 'a'.repeat(100);
            // Act
            renderTopBar({ datasetId: longId });
            // Assert
            const backLink = react_1.screen.getByTestId('back-link');
            expect(backLink).toHaveAttribute('href', `/datasets/${longId}/documents`);
        });
        it('should handle UUID format datasetId', () => {
            // Arrange
            const uuid = '550e8400-e29b-41d4-a716-446655440000';
            // Act
            renderTopBar({ datasetId: uuid });
            // Assert
            const backLink = react_1.screen.getByTestId('back-link');
            expect(backLink).toHaveAttribute('href', `/datasets/${uuid}/documents`);
        });
        it('should handle whitespace in className', () => {
            // Arrange & Act
            const { container } = renderTopBar({ className: '  spaced-class  ' });
            // Assert - classNames utility handles whitespace
            const wrapper = container.firstChild;
            expect(wrapper).toBeInTheDocument();
        });
        it('should render correctly with all props provided', () => {
            // Arrange & Act
            const { container } = renderTopBar({
                className: 'custom-class',
                datasetId: 'full-props-id',
                activeIndex: 2,
            });
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('custom-class');
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets/full-props-id/documents');
        });
        it('should render correctly with minimal props (only activeIndex)', () => {
            // Arrange & Act
            const { container } = renderTopBar({ activeIndex: 0 });
            // Assert
            expect(container.firstChild).toBeInTheDocument();
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets');
        });
    });
    // --------------------------------------------------------------------------
    // Stepper Integration Tests
    // --------------------------------------------------------------------------
    describe('Stepper Integration', () => {
        it('should pass steps array with correct structure to Stepper', () => {
            // Arrange & Act
            renderTopBar({ activeIndex: 0 });
            // Assert - All step names should be rendered
            const stepOne = react_1.screen.getByText('datasetCreation.steps.one');
            const stepTwo = react_1.screen.getByText('datasetCreation.steps.two');
            const stepThree = react_1.screen.getByText('datasetCreation.steps.three');
            expect(stepOne).toBeInTheDocument();
            expect(stepTwo).toBeInTheDocument();
            expect(stepThree).toBeInTheDocument();
        });
        it('should render Stepper in centered position', () => {
            // Arrange & Act
            const { container } = renderTopBar({ activeIndex: 0 });
            // Assert - Check for centered positioning classes
            const centeredContainer = container.querySelector('.absolute.left-1\\/2.top-1\\/2.-translate-x-1\\/2.-translate-y-1\\/2');
            expect(centeredContainer).toBeInTheDocument();
        });
        it('should render step dividers between steps', () => {
            // Arrange & Act
            const { container } = renderTopBar({ activeIndex: 0 });
            // Assert - Check for dividers (h-px w-4 bg-divider-deep)
            const dividers = container.querySelectorAll('.h-px.w-4.bg-divider-deep');
            expect(dividers.length).toBe(2); // 2 dividers between 3 steps
        });
    });
    // --------------------------------------------------------------------------
    // Accessibility Tests
    // --------------------------------------------------------------------------
    describe('Accessibility', () => {
        it('should have accessible back link', () => {
            // Arrange & Act
            renderTopBar();
            // Assert
            const backLink = react_1.screen.getByTestId('back-link');
            expect(backLink).toBeInTheDocument();
            // Link should have visible text
            expect(react_1.screen.getByText('datasetCreation.steps.header.fallbackRoute')).toBeInTheDocument();
        });
        it('should have visible arrow icon in back link', () => {
            // Arrange & Act
            const { container } = renderTopBar();
            // Assert - Arrow icon should be visible
            const arrowIcon = container.querySelector('svg');
            expect(arrowIcon).toBeInTheDocument();
            expect(arrowIcon).toHaveClass('text-text-primary');
        });
    });
    // --------------------------------------------------------------------------
    // Re-render Tests
    // --------------------------------------------------------------------------
    describe('Re-render Behavior', () => {
        it('should update activeIndex on re-render', () => {
            // Arrange
            const { rerender, container } = (0, react_1.render)(<index_1.TopBar activeIndex={0}/>);
            // Initial check
            expect(container.firstChild).toBeInTheDocument();
            // Act - Update activeIndex
            rerender(<index_1.TopBar activeIndex={1}/>);
            // Assert - Component should still render
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should update className on re-render', () => {
            // Arrange
            const { rerender, container } = (0, react_1.render)(<index_1.TopBar activeIndex={0} className="initial-class"/>);
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('initial-class');
            // Act
            rerender(<index_1.TopBar activeIndex={0} className="updated-class"/>);
            // Assert
            expect(wrapper).toHaveClass('updated-class');
            expect(wrapper).not.toHaveClass('initial-class');
        });
        it('should handle multiple rapid re-renders', () => {
            // Arrange
            const { rerender, container } = (0, react_1.render)(<index_1.TopBar activeIndex={0}/>);
            // Act - Multiple rapid re-renders
            rerender(<index_1.TopBar activeIndex={1}/>);
            rerender(<index_1.TopBar activeIndex={2}/>);
            rerender(<index_1.TopBar activeIndex={0} datasetId="new-id"/>);
            rerender(<index_1.TopBar activeIndex={1} datasetId="another-id" className="new-class"/>);
            // Assert - Component should be stable
            expect(container.firstChild).toBeInTheDocument();
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('new-class');
            expect(react_1.screen.getByTestId('back-link')).toHaveAttribute('href', '/datasets/another-id/documents');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELG1DQUFnQztBQUVoQyx3Q0FBd0M7QUFDeEMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMxQixPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBc0YsRUFBRSxFQUFFLENBQUMsQ0FDdkksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FDakY7TUFBQSxDQUFDLFFBQVEsQ0FDWDtJQUFBLEVBQUUsQ0FBQyxDQUFDLENBQ0w7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILDZDQUE2QztBQUM3QyxNQUFNLFlBQVksR0FBRyxDQUFDLFFBQThCLEVBQUUsRUFBRSxFQUFFO0lBQ3hELE1BQU0sWUFBWSxHQUFnQjtRQUNoQyxXQUFXLEVBQUUsQ0FBQztRQUNkLEdBQUcsS0FBSztLQUNULENBQUE7SUFDRCxPQUFPO1FBQ0wsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGNBQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUM7UUFDdkMsS0FBSyxFQUFFLFlBQVk7S0FDcEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELCtFQUErRTtBQUMvRSx5QkFBeUI7QUFDekIsK0VBQStFO0FBQy9FLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRiw2RUFBNkU7SUFDN0Usc0RB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Y0FBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRyxDQUFDLENBQUE7WUFFakYsc0NBQXNDO1lBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNoRCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsVUFBeUIsQ0FBQTtZQUNuRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ3hDLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFBO1FBQ25HLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVG9wQmFyUHJvcHMgfSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgVG9wQmFyIH0gZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayBuZXh0L2xpbmsgdG8gY2FwdHVyZSBocmVmIHZhbHVlc1xudmkubW9jaygnbmV4dC9saW5rJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY2hpbGRyZW4sIGhyZWYsIHJlcGxhY2UsIGNsYXNzTmFtZSB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIGhyZWY6IHN0cmluZywgcmVwbGFjZT86IGJvb2xlYW4sIGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPGEgaHJlZj17aHJlZn0gZGF0YS1yZXBsYWNlPXtyZXBsYWNlfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gZGF0YS10ZXN0aWQ9XCJiYWNrLWxpbmtcIj5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2E+XG4gICksXG59KSlcblxuLy8gSGVscGVyIHRvIHJlbmRlciBUb3BCYXIgd2l0aCBkZWZhdWx0IHByb3BzXG5jb25zdCByZW5kZXJUb3BCYXIgPSAocHJvcHM6IFBhcnRpYWw8VG9wQmFyUHJvcHM+ID0ge30pID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzOiBUb3BCYXJQcm9wcyA9IHtcbiAgICBhY3RpdmVJbmRleDogMCxcbiAgICAuLi5wcm9wcyxcbiAgfVxuICByZXR1cm4ge1xuICAgIC4uLnJlbmRlcig8VG9wQmFyIHsuLi5kZWZhdWx0UHJvcHN9IC8+KSxcbiAgICBwcm9wczogZGVmYXVsdFByb3BzLFxuICB9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRvcEJhciBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdUb3BCYXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0cyAtIFZlcmlmeSBjb21wb25lbnQgcmVuZGVycyBwcm9wZXJseVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJUb3BCYXIoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJhY2sgbGluayB3aXRoIGFycm93IGljb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyVG9wQmFyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBiYWNrTGluayA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1saW5rJylcbiAgICAgIGV4cGVjdChiYWNrTGluaykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gQ2hlY2sgZm9yIHRoZSBhcnJvdyBpY29uIChzdmcgZWxlbWVudClcbiAgICAgIGNvbnN0IGFycm93SWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KGFycm93SWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmYWxsYmFjayByb3V0ZSB0ZXh0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyVG9wQmFyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLmhlYWRlci5mYWxsYmFja1JvdXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgU3RlcHBlciBjb21wb25lbnQgd2l0aCAzIHN0ZXBzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyVG9wQmFyKHsgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgZm9yIHN0ZXAgdHJhbnNsYXRpb25zXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLm9uZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLnR3bycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLnRocmVlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBkZWZhdWx0IGNvbnRhaW5lciBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclRvcEJhcigpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ3JlbGF0aXZlJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnZmxleCcpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2gtWzUycHhdJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnc2hyaW5rLTAnKVxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdpdGVtcy1jZW50ZXInKVxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdqdXN0aWZ5LWJldHdlZW4nKVxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdib3JkZXItYicpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2JvcmRlci1iLWRpdmlkZXItc3VidGxlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByb3BzIFRlc3RpbmcgLSBUZXN0IGFsbCBwcm9wIHZhcmlhdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdjbGFzc05hbWUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZSB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJUb3BCYXIoeyBjbGFzc05hbWU6ICdjdXN0b20tY2xhc3MnIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2N1c3RvbS1jbGFzcycpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG1lcmdlIGN1c3RvbSBjbGFzc05hbWUgd2l0aCBkZWZhdWx0IGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclRvcEJhcih7IGNsYXNzTmFtZTogJ215LWN1c3RvbS1jbGFzcyBhbm90aGVyLWNsYXNzJyB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdyZWxhdGl2ZScpXG4gICAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnZmxleCcpXG4gICAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnbXktY3VzdG9tLWNsYXNzJylcbiAgICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdhbm90aGVyLWNsYXNzJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRob3V0IGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyVG9wQmFyKHsgY2xhc3NOYW1lOiB1bmRlZmluZWQgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygncmVsYXRpdmUnKVxuICAgICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2ZsZXgnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyVG9wQmFyKHsgY2xhc3NOYW1lOiAnJyB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdyZWxhdGl2ZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZGF0YXNldElkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNldCBmYWxsYmFjayByb3V0ZSB0byAvZGF0YXNldHMgd2hlbiBkYXRhc2V0SWQgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlclRvcEJhcih7IGRhdGFzZXRJZDogdW5kZWZpbmVkIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGJhY2tMaW5rID0gc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWxpbmsnKVxuICAgICAgICBleHBlY3QoYmFja0xpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICcvZGF0YXNldHMnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzZXQgZmFsbGJhY2sgcm91dGUgdG8gL2RhdGFzZXRzLzppZC9kb2N1bWVudHMgd2hlbiBkYXRhc2V0SWQgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyVG9wQmFyKHsgZGF0YXNldElkOiAnZGF0YXNldC0xMjMnIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGJhY2tMaW5rID0gc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWxpbmsnKVxuICAgICAgICBleHBlY3QoYmFja0xpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICcvZGF0YXNldHMvZGF0YXNldC0xMjMvZG9jdW1lbnRzJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhcmlvdXMgZGF0YXNldElkIGZvcm1hdHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyVG9wQmFyKHsgZGF0YXNldElkOiAnYWJjLWRlZi1naGktMTIzJyB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBiYWNrTGluayA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1saW5rJylcbiAgICAgICAgZXhwZWN0KGJhY2tMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnL2RhdGFzZXRzL2FiYy1kZWYtZ2hpLTEyMy9kb2N1bWVudHMnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIGRhdGFzZXRJZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJUb3BCYXIoeyBkYXRhc2V0SWQ6ICcnIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gRW1wdHkgc3RyaW5nIGlzIGZhbHN5LCBzbyBmYWxsYmFjayB0byAvZGF0YXNldHNcbiAgICAgICAgY29uc3QgYmFja0xpbmsgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpXG4gICAgICAgIGV4cGVjdChiYWNrTGluaykudG9IYXZlQXR0cmlidXRlKCdocmVmJywgJy9kYXRhc2V0cycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnYWN0aXZlSW5kZXggcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBhY3RpdmVJbmRleCB0byBTdGVwcGVyIGNvbXBvbmVudCAoaW5kZXggMCknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclRvcEJhcih7IGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gRmlyc3Qgc3RlcCBzaG91bGQgYmUgYWN0aXZlIChoYXMgc3BlY2lmaWMgc3R5bGluZylcbiAgICAgICAgY29uc3Qgc3RlcHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzKj1cInN5c3RlbS0yeHMtc2VtaWJvbGQtdXBwZXJjYXNlXCJdJylcbiAgICAgICAgZXhwZWN0KHN0ZXBzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3MgYWN0aXZlSW5kZXggdG8gU3RlcHBlciBjb21wb25lbnQgKGluZGV4IDEpJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlclRvcEJhcih7IGFjdGl2ZUluZGV4OiAxIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU3RlcHBlciBpcyByZW5kZXJlZCB3aXRoIGNvcnJlY3QgcHJvcHNcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwcy5vbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLnR3bycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3MgYWN0aXZlSW5kZXggdG8gU3RlcHBlciBjb21wb25lbnQgKGluZGV4IDIpJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlclRvcEJhcih7IGFjdGl2ZUluZGV4OiAyIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcHMudGhyZWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZWRnZSBjYXNlIGFjdGl2ZUluZGV4IG9mIC0xJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJUb3BCYXIoeyBhY3RpdmVJbmRleDogLTEgfSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZWRnZSBjYXNlIGFjdGl2ZUluZGV4IGJleW9uZCBzdGVwcyBsZW5ndGgnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclRvcEJhcih7IGFjdGl2ZUluZGV4OiAxMCB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHMgLSBUZXN0IHVzZU1lbW8gbG9naWMgYW5kIGRlcGVuZGVuY2llc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gTG9naWMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGZhbGxiYWNrUm91dGUgYmFzZWQgb24gZGF0YXNldElkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdCAtIFdpdGggZGF0YXNldElkXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFRvcEJhciBhY3RpdmVJbmRleD17MH0gZGF0YXNldElkPVwidGVzdC1pZFwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnL2RhdGFzZXRzL3Rlc3QtaWQvZG9jdW1lbnRzJylcblxuICAgICAgLy8gQWN0IC0gUmVyZW5kZXIgd2l0aCBkaWZmZXJlbnQgZGF0YXNldElkXG4gICAgICByZXJlbmRlcig8VG9wQmFyIGFjdGl2ZUluZGV4PXswfSBkYXRhc2V0SWQ9XCJuZXctaWRcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUm91dGUgc2hvdWxkIHVwZGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1saW5rJykpLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICcvZGF0YXNldHMvbmV3LWlkL2RvY3VtZW50cycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGZhbGxiYWNrUm91dGUgd2hlbiBkYXRhc2V0SWQgY2hhbmdlcyBmcm9tIHVuZGVmaW5lZCB0byBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxUb3BCYXIgYWN0aXZlSW5kZXg9ezB9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1saW5rJykpLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICcvZGF0YXNldHMnKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKDxUb3BCYXIgYWN0aXZlSW5kZXg9ezB9IGRhdGFzZXRJZD1cIm5ldy1kYXRhc2V0XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1saW5rJykpLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICcvZGF0YXNldHMvbmV3LWRhdGFzZXQvZG9jdW1lbnRzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgZmFsbGJhY2tSb3V0ZSB3aGVuIGRhdGFzZXRJZCBjaGFuZ2VzIGZyb20gZGVmaW5lZCB0byB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFRvcEJhciBhY3RpdmVJbmRleD17MH0gZGF0YXNldElkPVwiZXhpc3RpbmctaWRcIiAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnL2RhdGFzZXRzL2V4aXN0aW5nLWlkL2RvY3VtZW50cycpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVyZW5kZXIoPFRvcEJhciBhY3RpdmVJbmRleD17MH0gZGF0YXNldElkPXt1bmRlZmluZWR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnL2RhdGFzZXRzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2hhbmdlIGZhbGxiYWNrUm91dGUgd2hlbiBhY3RpdmVJbmRleCBjaGFuZ2VzIGJ1dCBkYXRhc2V0SWQgc3RheXMgc2FtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8VG9wQmFyIGFjdGl2ZUluZGV4PXswfSBkYXRhc2V0SWQ9XCJzdGFibGUtaWRcIiAvPilcbiAgICAgIGNvbnN0IGluaXRpYWxIcmVmID0gc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWxpbmsnKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKDxUb3BCYXIgYWN0aXZlSW5kZXg9ezF9IGRhdGFzZXRJZD1cInN0YWJsZS1pZFwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBocmVmIHNob3VsZCByZW1haW4gdGhlIHNhbWVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCBpbml0aWFsSHJlZilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2hhbmdlIGZhbGxiYWNrUm91dGUgd2hlbiBjbGFzc05hbWUgY2hhbmdlcyBidXQgZGF0YXNldElkIHN0YXlzIHNhbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFRvcEJhciBhY3RpdmVJbmRleD17MH0gZGF0YXNldElkPVwic3RhYmxlLWlkXCIgY2xhc3NOYW1lPVwiY2xhc3MtMVwiIC8+KVxuICAgICAgY29uc3QgaW5pdGlhbEhyZWYgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpLmdldEF0dHJpYnV0ZSgnaHJlZicpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVyZW5kZXIoPFRvcEJhciBhY3RpdmVJbmRleD17MH0gZGF0YXNldElkPVwic3RhYmxlLWlkXCIgY2xhc3NOYW1lPVwiY2xhc3MtMlwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBocmVmIHNob3VsZCByZW1haW4gdGhlIHNhbWVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCBpbml0aWFsSHJlZilcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIExpbmsgQ29tcG9uZW50IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdMaW5rIENvbXBvbmVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBMaW5rIHdpdGggcmVwbGFjZSBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyVG9wQmFyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBiYWNrTGluayA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1saW5rJylcbiAgICAgIGV4cGVjdChiYWNrTGluaykudG9IYXZlQXR0cmlidXRlKCdkYXRhLXJlcGxhY2UnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIExpbmsgd2l0aCBjb3JyZWN0IGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJUb3BCYXIoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJhY2tMaW5rID0gc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWxpbmsnKVxuICAgICAgZXhwZWN0KGJhY2tMaW5rKS50b0hhdmVDbGFzcygnaW5saW5lLWZsZXgnKVxuICAgICAgZXhwZWN0KGJhY2tMaW5rKS50b0hhdmVDbGFzcygnaC0xMicpXG4gICAgICBleHBlY3QoYmFja0xpbmspLnRvSGF2ZUNsYXNzKCdpdGVtcy1jZW50ZXInKVxuICAgICAgZXhwZWN0KGJhY2tMaW5rKS50b0hhdmVDbGFzcygnanVzdGlmeS1zdGFydCcpXG4gICAgICBleHBlY3QoYmFja0xpbmspLnRvSGF2ZUNsYXNzKCdnYXAtMScpXG4gICAgICBleHBlY3QoYmFja0xpbmspLnRvSGF2ZUNsYXNzKCdweS0yJylcbiAgICAgIGV4cGVjdChiYWNrTGluaykudG9IYXZlQ2xhc3MoJ3BsLTInKVxuICAgICAgZXhwZWN0KGJhY2tMaW5rKS50b0hhdmVDbGFzcygncHItNicpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTVEVQX1RfTUFQIFRlc3RzIC0gVmVyaWZ5IHN0ZXAgdHJhbnNsYXRpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTVEVQX1RfTUFQIFRyYW5zbGF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdGVwIG9uZSB0cmFuc2xhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclRvcEJhcih7IGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwcy5vbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdGVwIHR3byB0cmFuc2xhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclRvcEJhcih7IGFjdGl2ZUluZGV4OiAxIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwcy50d28nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdGVwIHRocmVlIHRyYW5zbGF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyVG9wQmFyKHsgYWN0aXZlSW5kZXg6IDIgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLnRocmVlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIHRocmVlIHN0ZXAgdHJhbnNsYXRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyVG9wQmFyKHsgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLm9uZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLnR3bycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBzLnRocmVlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBkYXRhc2V0SWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJUb3BCYXIoeyBkYXRhc2V0SWQ6ICdkYXRhc2V0LXdpdGgtc3BlY2lhbF9jaGFycy4xMjMnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYmFja0xpbmsgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stbGluaycpXG4gICAgICBleHBlY3QoYmFja0xpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICcvZGF0YXNldHMvZGF0YXNldC13aXRoLXNwZWNpYWxfY2hhcnMuMTIzL2RvY3VtZW50cycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBkYXRhc2V0SWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nSWQgPSAnYScucmVwZWF0KDEwMClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJUb3BCYXIoeyBkYXRhc2V0SWQ6IGxvbmdJZCB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJhY2tMaW5rID0gc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWxpbmsnKVxuICAgICAgZXhwZWN0KGJhY2tMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCBgL2RhdGFzZXRzLyR7bG9uZ0lkfS9kb2N1bWVudHNgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBVVUlEIGZvcm1hdCBkYXRhc2V0SWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1dWlkID0gJzU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCdcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJUb3BCYXIoeyBkYXRhc2V0SWQ6IHV1aWQgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBiYWNrTGluayA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1saW5rJylcbiAgICAgIGV4cGVjdChiYWNrTGluaykudG9IYXZlQXR0cmlidXRlKCdocmVmJywgYC9kYXRhc2V0cy8ke3V1aWR9L2RvY3VtZW50c2ApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHdoaXRlc3BhY2UgaW4gY2xhc3NOYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclRvcEJhcih7IGNsYXNzTmFtZTogJyAgc3BhY2VkLWNsYXNzICAnIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNsYXNzTmFtZXMgdXRpbGl0eSBoYW5kbGVzIHdoaXRlc3BhY2VcbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggYWxsIHByb3BzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclRvcEJhcih7XG4gICAgICAgIGNsYXNzTmFtZTogJ2N1c3RvbS1jbGFzcycsXG4gICAgICAgIGRhdGFzZXRJZDogJ2Z1bGwtcHJvcHMtaWQnLFxuICAgICAgICBhY3RpdmVJbmRleDogMixcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2N1c3RvbS1jbGFzcycpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWxpbmsnKSkudG9IYXZlQXR0cmlidXRlKCdocmVmJywgJy9kYXRhc2V0cy9mdWxsLXByb3BzLWlkL2RvY3VtZW50cycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIG1pbmltYWwgcHJvcHMgKG9ubHkgYWN0aXZlSW5kZXgpJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclRvcEJhcih7IGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWxpbmsnKSkudG9IYXZlQXR0cmlidXRlKCdocmVmJywgJy9kYXRhc2V0cycpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTdGVwcGVyIEludGVncmF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTdGVwcGVyIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBzdGVwcyBhcnJheSB3aXRoIGNvcnJlY3Qgc3RydWN0dXJlIHRvIFN0ZXBwZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJUb3BCYXIoeyBhY3RpdmVJbmRleDogMCB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBBbGwgc3RlcCBuYW1lcyBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGNvbnN0IHN0ZXBPbmUgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcHMub25lJylcbiAgICAgIGNvbnN0IHN0ZXBUd28gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcHMudHdvJylcbiAgICAgIGNvbnN0IHN0ZXBUaHJlZSA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwcy50aHJlZScpXG5cbiAgICAgIGV4cGVjdChzdGVwT25lKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc3RlcFR3bykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHN0ZXBUaHJlZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTdGVwcGVyIGluIGNlbnRlcmVkIHBvc2l0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclRvcEJhcih7IGFjdGl2ZUluZGV4OiAwIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciBjZW50ZXJlZCBwb3NpdGlvbmluZyBjbGFzc2VzXG4gICAgICBjb25zdCBjZW50ZXJlZENvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYWJzb2x1dGUubGVmdC0xXFxcXC8yLnRvcC0xXFxcXC8yLi10cmFuc2xhdGUteC0xXFxcXC8yLi10cmFuc2xhdGUteS0xXFxcXC8yJylcbiAgICAgIGV4cGVjdChjZW50ZXJlZENvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdGVwIGRpdmlkZXJzIGJldHdlZW4gc3RlcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyVG9wQmFyKHsgYWN0aXZlSW5kZXg6IDAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgZm9yIGRpdmlkZXJzIChoLXB4IHctNCBiZy1kaXZpZGVyLWRlZXApXG4gICAgICBjb25zdCBkaXZpZGVycyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuaC1weC53LTQuYmctZGl2aWRlci1kZWVwJylcbiAgICAgIGV4cGVjdChkaXZpZGVycy5sZW5ndGgpLnRvQmUoMikgLy8gMiBkaXZpZGVycyBiZXR3ZWVuIDMgc3RlcHNcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGFjY2Vzc2libGUgYmFjayBsaW5rJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyVG9wQmFyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBiYWNrTGluayA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1saW5rJylcbiAgICAgIGV4cGVjdChiYWNrTGluaykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gTGluayBzaG91bGQgaGF2ZSB2aXNpYmxlIHRleHRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcHMuaGVhZGVyLmZhbGxiYWNrUm91dGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgdmlzaWJsZSBhcnJvdyBpY29uIGluIGJhY2sgbGluaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJUb3BCYXIoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBBcnJvdyBpY29uIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBjb25zdCBhcnJvd0ljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChhcnJvd0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChhcnJvd0ljb24pLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtcHJpbWFyeScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZS1yZW5kZXIgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlLXJlbmRlciBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBhY3RpdmVJbmRleCBvbiByZS1yZW5kZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyLCBjb250YWluZXIgfSA9IHJlbmRlcig8VG9wQmFyIGFjdGl2ZUluZGV4PXswfSAvPilcblxuICAgICAgLy8gSW5pdGlhbCBjaGVja1xuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIFVwZGF0ZSBhY3RpdmVJbmRleFxuICAgICAgcmVyZW5kZXIoPFRvcEJhciBhY3RpdmVJbmRleD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgc3RpbGwgcmVuZGVyXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgY2xhc3NOYW1lIG9uIHJlLXJlbmRlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIsIGNvbnRhaW5lciB9ID0gcmVuZGVyKDxUb3BCYXIgYWN0aXZlSW5kZXg9ezB9IGNsYXNzTmFtZT1cImluaXRpYWwtY2xhc3NcIiAvPilcbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdpbml0aWFsLWNsYXNzJylcblxuICAgICAgLy8gQWN0XG4gICAgICByZXJlbmRlcig8VG9wQmFyIGFjdGl2ZUluZGV4PXswfSBjbGFzc05hbWU9XCJ1cGRhdGVkLWNsYXNzXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCd1cGRhdGVkLWNsYXNzJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS5ub3QudG9IYXZlQ2xhc3MoJ2luaXRpYWwtY2xhc3MnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSByYXBpZCByZS1yZW5kZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciwgY29udGFpbmVyIH0gPSByZW5kZXIoPFRvcEJhciBhY3RpdmVJbmRleD17MH0gLz4pXG5cbiAgICAgIC8vIEFjdCAtIE11bHRpcGxlIHJhcGlkIHJlLXJlbmRlcnNcbiAgICAgIHJlcmVuZGVyKDxUb3BCYXIgYWN0aXZlSW5kZXg9ezF9IC8+KVxuICAgICAgcmVyZW5kZXIoPFRvcEJhciBhY3RpdmVJbmRleD17Mn0gLz4pXG4gICAgICByZXJlbmRlcig8VG9wQmFyIGFjdGl2ZUluZGV4PXswfSBkYXRhc2V0SWQ9XCJuZXctaWRcIiAvPilcbiAgICAgIHJlcmVuZGVyKDxUb3BCYXIgYWN0aXZlSW5kZXg9ezF9IGRhdGFzZXRJZD1cImFub3RoZXItaWRcIiBjbGFzc05hbWU9XCJuZXctY2xhc3NcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCBiZSBzdGFibGVcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ25ldy1jbGFzcycpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWxpbmsnKSkudG9IYXZlQXR0cmlidXRlKCdocmVmJywgJy9kYXRhc2V0cy9hbm90aGVyLWlkL2RvY3VtZW50cycpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=