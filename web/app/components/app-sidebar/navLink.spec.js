"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const navLink_1 = require("./navLink");
// Mock Next.js navigation
vi.mock('next/navigation', () => ({
    useSelectedLayoutSegment: () => 'overview',
}));
// Mock Next.js Link component
vi.mock('next/link', () => ({
    default: function MockLink({ children, href, className, title }) {
        return (<a href={href} className={className} title={title} data-testid="nav-link">
        {children}
      </a>);
    },
}));
// Mock RemixIcon components
const MockIcon = ({ className }) => (<svg className={className} data-testid="nav-icon"/>);
describe('NavLink Animation and Layout Issues', () => {
    const mockProps = {
        name: 'Orchestrate',
        href: '/app/123/workflow',
        iconMap: {
            selected: MockIcon,
            normal: MockIcon,
        },
    };
    beforeEach(() => {
        // Mock getComputedStyle for transition testing
        Object.defineProperty(window, 'getComputedStyle', {
            value: vi.fn((element) => {
                const isExpanded = element.getAttribute('data-mode') === 'expand';
                return {
                    transition: 'all 0.3s ease',
                    opacity: isExpanded ? '1' : '0',
                    width: isExpanded ? 'auto' : '0px',
                    overflow: 'hidden',
                    paddingLeft: isExpanded ? '12px' : '10px', // px-3 vs px-2.5
                    paddingRight: isExpanded ? '12px' : '10px',
                };
            }),
            writable: true,
        });
    });
    describe('Text Squeeze Animation Issue', () => {
        it('should show text squeeze effect when switching from collapse to expand', async () => {
            const { rerender } = (0, react_1.render)(<navLink_1.default {...mockProps} mode="collapse"/>);
            // In collapse mode, text should be in DOM but hidden via CSS
            const textElement = react_1.screen.getByText('Orchestrate');
            expect(textElement).toBeInTheDocument();
            expect(textElement).toHaveClass('opacity-0');
            expect(textElement).toHaveClass('max-w-0');
            expect(textElement).toHaveClass('overflow-hidden');
            // Icon should still be present
            expect(react_1.screen.getByTestId('nav-icon')).toBeInTheDocument();
            // Check consistent padding in collapse mode
            const linkElement = react_1.screen.getByTestId('nav-link');
            expect(linkElement).toHaveClass('pl-3');
            expect(linkElement).toHaveClass('pr-1');
            // Switch to expand mode - should have smooth text transition
            rerender(<navLink_1.default {...mockProps} mode="expand"/>);
            // Text should now be visible with opacity animation
            expect(react_1.screen.getByText('Orchestrate')).toBeInTheDocument();
            // Check padding remains consistent - no layout shift
            expect(linkElement).toHaveClass('pl-3');
            expect(linkElement).toHaveClass('pr-1');
            // Fixed: text now uses max-width animation instead of abrupt show/hide
            const expandedTextElement = react_1.screen.getByText('Orchestrate');
            expect(expandedTextElement).toBeInTheDocument();
            expect(expandedTextElement).toHaveClass('max-w-none');
            expect(expandedTextElement).toHaveClass('opacity-100');
            // The fix provides:
            // - Opacity transition from 0 to 1
            // - Max-width transition from 0 to none (prevents squashing)
            // - No layout shift from consistent padding
        });
        it('should maintain icon position consistency using wrapper div', () => {
            const { rerender } = (0, react_1.render)(<navLink_1.default {...mockProps} mode="collapse"/>);
            const iconElement = react_1.screen.getByTestId('nav-icon');
            const iconWrapper = iconElement.parentElement;
            // Icon wrapper should have -ml-1 micro-adjustment in collapse mode for centering
            expect(iconWrapper).toHaveClass('-ml-1');
            rerender(<navLink_1.default {...mockProps} mode="expand"/>);
            // In expand mode, wrapper should not have the micro-adjustment
            const expandedIconWrapper = react_1.screen.getByTestId('nav-icon').parentElement;
            expect(expandedIconWrapper).not.toHaveClass('-ml-1');
            // Icon itself maintains consistent classes - no margin changes
            expect(iconElement).toHaveClass('h-4');
            expect(iconElement).toHaveClass('w-4');
            expect(iconElement).toHaveClass('shrink-0');
            // This wrapper approach eliminates the icon margin shift issue
        });
        it('should provide smooth text transition with max-width animation', () => {
            const { rerender } = (0, react_1.render)(<navLink_1.default {...mockProps} mode="collapse"/>);
            // Text is always in DOM but controlled via CSS classes
            const collapsedText = react_1.screen.getByText('Orchestrate');
            expect(collapsedText).toBeInTheDocument();
            expect(collapsedText).toHaveClass('opacity-0');
            expect(collapsedText).toHaveClass('max-w-0');
            expect(collapsedText).toHaveClass('overflow-hidden');
            rerender(<navLink_1.default {...mockProps} mode="expand"/>);
            // Text smoothly transitions to visible state
            const expandedText = react_1.screen.getByText('Orchestrate');
            expect(expandedText).toBeInTheDocument();
            expect(expandedText).toHaveClass('opacity-100');
            expect(expandedText).toHaveClass('max-w-none');
            // Fixed: Always present in DOM with smooth CSS transitions
            // instead of abrupt conditional rendering
        });
    });
    describe('Layout Consistency Improvements', () => {
        it('should maintain consistent padding across all states', () => {
            const { rerender } = (0, react_1.render)(<navLink_1.default {...mockProps} mode="collapse"/>);
            const linkElement = react_1.screen.getByTestId('nav-link');
            // Consistent padding in collapsed state
            expect(linkElement).toHaveClass('pl-3');
            expect(linkElement).toHaveClass('pr-1');
            rerender(<navLink_1.default {...mockProps} mode="expand"/>);
            // Same padding in expanded state - no layout shift
            expect(linkElement).toHaveClass('pl-3');
            expect(linkElement).toHaveClass('pr-1');
            // This consistency eliminates the layout shift issue
        });
        it('should use wrapper-based icon positioning instead of margin changes', () => {
            const { rerender } = (0, react_1.render)(<navLink_1.default {...mockProps} mode="collapse"/>);
            const iconElement = react_1.screen.getByTestId('nav-icon');
            const iconWrapper = iconElement.parentElement;
            // Collapsed: wrapper has micro-adjustment for centering
            expect(iconWrapper).toHaveClass('-ml-1');
            // Icon itself has consistent classes
            expect(iconElement).toHaveClass('h-4');
            expect(iconElement).toHaveClass('w-4');
            expect(iconElement).toHaveClass('shrink-0');
            rerender(<navLink_1.default {...mockProps} mode="expand"/>);
            const expandedIconWrapper = react_1.screen.getByTestId('nav-icon').parentElement;
            // Expanded: no wrapper adjustment needed
            expect(expandedIconWrapper).not.toHaveClass('-ml-1');
            // Icon classes remain consistent - no margin shifts
            expect(iconElement).toHaveClass('h-4');
            expect(iconElement).toHaveClass('w-4');
            expect(iconElement).toHaveClass('shrink-0');
        });
    });
    describe('Active State Handling', () => {
        it('should handle active state correctly in both modes', () => {
            // Test non-active state
            const { rerender } = (0, react_1.render)(<navLink_1.default {...mockProps} mode="collapse"/>);
            let linkElement = react_1.screen.getByTestId('nav-link');
            expect(linkElement).not.toHaveClass('bg-components-menu-item-bg-active');
            // Test with active state (when href matches current segment)
            const activeProps = {
                ...mockProps,
                href: '/app/123/overview', // matches mocked segment
            };
            rerender(<navLink_1.default {...activeProps} mode="expand"/>);
            linkElement = react_1.screen.getByTestId('nav-link');
            expect(linkElement).toHaveClass('bg-components-menu-item-bg-active');
            expect(linkElement).toHaveClass('text-text-accent-light-mode-only');
        });
    });
    describe('Text Animation Classes', () => {
        it('should have proper text classes in collapsed mode', () => {
            (0, react_1.render)(<navLink_1.default {...mockProps} mode="collapse"/>);
            const textElement = react_1.screen.getByText('Orchestrate');
            expect(textElement).toHaveClass('overflow-hidden');
            expect(textElement).toHaveClass('whitespace-nowrap');
            expect(textElement).toHaveClass('transition-all');
            expect(textElement).toHaveClass('duration-200');
            expect(textElement).toHaveClass('ease-in-out');
            expect(textElement).toHaveClass('ml-0');
            expect(textElement).toHaveClass('max-w-0');
            expect(textElement).toHaveClass('opacity-0');
        });
        it('should have proper text classes in expanded mode', () => {
            (0, react_1.render)(<navLink_1.default {...mockProps} mode="expand"/>);
            const textElement = react_1.screen.getByText('Orchestrate');
            expect(textElement).toHaveClass('overflow-hidden');
            expect(textElement).toHaveClass('whitespace-nowrap');
            expect(textElement).toHaveClass('transition-all');
            expect(textElement).toHaveClass('duration-200');
            expect(textElement).toHaveClass('ease-in-out');
            expect(textElement).toHaveClass('ml-2');
            expect(textElement).toHaveClass('max-w-none');
            expect(textElement).toHaveClass('opacity-100');
        });
    });
    describe('Disabled State', () => {
        it('should render as button when disabled', () => {
            (0, react_1.render)(<navLink_1.default {...mockProps} mode="expand" disabled={true}/>);
            const buttonElement = react_1.screen.getByRole('button');
            expect(buttonElement).toBeInTheDocument();
            expect(buttonElement).toBeDisabled();
            expect(buttonElement).toHaveClass('cursor-not-allowed');
            expect(buttonElement).toHaveClass('opacity-30');
        });
        it('should maintain consistent styling in disabled state', () => {
            (0, react_1.render)(<navLink_1.default {...mockProps} mode="collapse" disabled={true}/>);
            const buttonElement = react_1.screen.getByRole('button');
            expect(buttonElement).toHaveClass('pl-3');
            expect(buttonElement).toHaveClass('pr-1');
            const iconWrapper = react_1.screen.getByTestId('nav-icon').parentElement;
            expect(iconWrapper).toHaveClass('-ml-1');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2TGluay5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmF2TGluay5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUF1RDtBQUN2RCwrQkFBOEI7QUFDOUIsdUNBQStCO0FBRS9CLDBCQUEwQjtBQUMxQixFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVTtDQUMzQyxDQUFDLENBQUMsQ0FBQTtBQUVILDhCQUE4QjtBQUM5QixFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sRUFBRSxTQUFTLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBTztRQUNsRSxPQUFPLENBQ0wsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FDdkU7UUFBQSxDQUFDLFFBQVEsQ0FDWDtNQUFBLEVBQUUsQ0FBQyxDQUFDLENBQ0wsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILDRCQUE0QjtBQUM1QixNQUFNLFFBQVEsR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUEwQixFQUFFLEVBQUUsQ0FBQyxDQUMxRCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFHLENBQ3JELENBQUE7QUFFRCxRQUFRLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO0lBQ25ELE1BQU0sU0FBUyxHQUFpQjtRQUM5QixJQUFJLEVBQUUsYUFBYTtRQUNuQixJQUFJLEVBQUUsbUJBQW1CO1FB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QUFDLGFBQWEsQ0FBQTtZQUNoRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmF2TGlua1Byb3BzIH0gZnJvbSAnLi9uYXZMaW5rJ1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgTmF2TGluayBmcm9tICcuL25hdkxpbmsnXG5cbi8vIE1vY2sgTmV4dC5qcyBuYXZpZ2F0aW9uXG52aS5tb2NrKCduZXh0L25hdmlnYXRpb24nLCAoKSA9PiAoe1xuICB1c2VTZWxlY3RlZExheW91dFNlZ21lbnQ6ICgpID0+ICdvdmVydmlldycsXG59KSlcblxuLy8gTW9jayBOZXh0LmpzIExpbmsgY29tcG9uZW50XG52aS5tb2NrKCduZXh0L2xpbmsnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiBmdW5jdGlvbiBNb2NrTGluayh7IGNoaWxkcmVuLCBocmVmLCBjbGFzc05hbWUsIHRpdGxlIH06IGFueSkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBocmVmPXtocmVmfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gdGl0bGU9e3RpdGxlfSBkYXRhLXRlc3RpZD1cIm5hdi1saW5rXCI+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvYT5cbiAgICApXG4gIH0sXG59KSlcblxuLy8gTW9jayBSZW1peEljb24gY29tcG9uZW50c1xuY29uc3QgTW9ja0ljb24gPSAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICA8c3ZnIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBkYXRhLXRlc3RpZD1cIm5hdi1pY29uXCIgLz5cbilcblxuZGVzY3JpYmUoJ05hdkxpbmsgQW5pbWF0aW9uIGFuZCBMYXlvdXQgSXNzdWVzJywgKCkgPT4ge1xuICBjb25zdCBtb2NrUHJvcHM6IE5hdkxpbmtQcm9wcyA9IHtcbiAgICBuYW1lOiAnT3JjaGVzdHJhdGUnLFxuICAgIGhyZWY6ICcvYXBwLzEyMy93b3JrZmxvdycsXG4gICAgaWNvbk1hcDoge1xuICAgICAgc2VsZWN0ZWQ6IE1vY2tJY29uLFxuICAgICAgbm9ybWFsOiBNb2NrSWNvbixcbiAgICB9LFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgLy8gTW9jayBnZXRDb21wdXRlZFN0eWxlIGZvciB0cmFuc2l0aW9uIHRlc3RpbmdcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnZ2V0Q29tcHV0ZWRTdHlsZScsIHtcbiAgICAgIHZhbHVlOiB2aS5mbigoZWxlbWVudCkgPT4ge1xuICAgICAgICBjb25zdCBpc0V4cGFuZGVkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kZScpID09PSAnZXhwYW5kJ1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4zcyBlYXNlJyxcbiAgICAgICAgICBvcGFjaXR5OiBpc0V4cGFuZGVkID8gJzEnIDogJzAnLFxuICAgICAgICAgIHdpZHRoOiBpc0V4cGFuZGVkID8gJ2F1dG8nIDogJzBweCcsXG4gICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgIHBhZGRpbmdMZWZ0OiBpc0V4cGFuZGVkID8gJzEycHgnIDogJzEwcHgnLCAvLyBweC0zIHZzIHB4LTIuNVxuICAgICAgICAgIHBhZGRpbmdSaWdodDogaXNFeHBhbmRlZCA/ICcxMnB4JyA6ICcxMHB4JyxcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdUZXh0IFNxdWVlemUgQW5pbWF0aW9uIElzc3VlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyB0ZXh0IHNxdWVlemUgZWZmZWN0IHdoZW4gc3dpdGNoaW5nIGZyb20gY29sbGFwc2UgdG8gZXhwYW5kJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxOYXZMaW5rIHsuLi5tb2NrUHJvcHN9IG1vZGU9XCJjb2xsYXBzZVwiIC8+KVxuXG4gICAgICAvLyBJbiBjb2xsYXBzZSBtb2RlLCB0ZXh0IHNob3VsZCBiZSBpbiBET00gYnV0IGhpZGRlbiB2aWEgQ1NTXG4gICAgICBjb25zdCB0ZXh0RWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ09yY2hlc3RyYXRlJylcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnb3BhY2l0eS0wJylcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9IYXZlQ2xhc3MoJ21heC13LTAnKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJylcblxuICAgICAgLy8gSWNvbiBzaG91bGQgc3RpbGwgYmUgcHJlc2VudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbmF2LWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDaGVjayBjb25zaXN0ZW50IHBhZGRpbmcgaW4gY29sbGFwc2UgbW9kZVxuICAgICAgY29uc3QgbGlua0VsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ25hdi1saW5rJylcbiAgICAgIGV4cGVjdChsaW5rRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3BsLTMnKVxuICAgICAgZXhwZWN0KGxpbmtFbGVtZW50KS50b0hhdmVDbGFzcygncHItMScpXG5cbiAgICAgIC8vIFN3aXRjaCB0byBleHBhbmQgbW9kZSAtIHNob3VsZCBoYXZlIHNtb290aCB0ZXh0IHRyYW5zaXRpb25cbiAgICAgIHJlcmVuZGVyKDxOYXZMaW5rIHsuLi5tb2NrUHJvcHN9IG1vZGU9XCJleHBhbmRcIiAvPilcblxuICAgICAgLy8gVGV4dCBzaG91bGQgbm93IGJlIHZpc2libGUgd2l0aCBvcGFjaXR5IGFuaW1hdGlvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ09yY2hlc3RyYXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2hlY2sgcGFkZGluZyByZW1haW5zIGNvbnNpc3RlbnQgLSBubyBsYXlvdXQgc2hpZnRcbiAgICAgIGV4cGVjdChsaW5rRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3BsLTMnKVxuICAgICAgZXhwZWN0KGxpbmtFbGVtZW50KS50b0hhdmVDbGFzcygncHItMScpXG5cbiAgICAgIC8vIEZpeGVkOiB0ZXh0IG5vdyB1c2VzIG1heC13aWR0aCBhbmltYXRpb24gaW5zdGVhZCBvZiBhYnJ1cHQgc2hvdy9oaWRlXG4gICAgICBjb25zdCBleHBhbmRlZFRleHRFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgnT3JjaGVzdHJhdGUnKVxuICAgICAgZXhwZWN0KGV4cGFuZGVkVGV4dEVsZW1lbnQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChleHBhbmRlZFRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnbWF4LXctbm9uZScpXG4gICAgICBleHBlY3QoZXhwYW5kZWRUZXh0RWxlbWVudCkudG9IYXZlQ2xhc3MoJ29wYWNpdHktMTAwJylcblxuICAgICAgLy8gVGhlIGZpeCBwcm92aWRlczpcbiAgICAgIC8vIC0gT3BhY2l0eSB0cmFuc2l0aW9uIGZyb20gMCB0byAxXG4gICAgICAvLyAtIE1heC13aWR0aCB0cmFuc2l0aW9uIGZyb20gMCB0byBub25lIChwcmV2ZW50cyBzcXVhc2hpbmcpXG4gICAgICAvLyAtIE5vIGxheW91dCBzaGlmdCBmcm9tIGNvbnNpc3RlbnQgcGFkZGluZ1xuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGljb24gcG9zaXRpb24gY29uc2lzdGVuY3kgdXNpbmcgd3JhcHBlciBkaXYnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE5hdkxpbmsgey4uLm1vY2tQcm9wc30gbW9kZT1cImNvbGxhcHNlXCIgLz4pXG5cbiAgICAgIGNvbnN0IGljb25FbGVtZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCduYXYtaWNvbicpXG4gICAgICBjb25zdCBpY29uV3JhcHBlciA9IGljb25FbGVtZW50LnBhcmVudEVsZW1lbnRcblxuICAgICAgLy8gSWNvbiB3cmFwcGVyIHNob3VsZCBoYXZlIC1tbC0xIG1pY3JvLWFkanVzdG1lbnQgaW4gY29sbGFwc2UgbW9kZSBmb3IgY2VudGVyaW5nXG4gICAgICBleHBlY3QoaWNvbldyYXBwZXIpLnRvSGF2ZUNsYXNzKCctbWwtMScpXG5cbiAgICAgIHJlcmVuZGVyKDxOYXZMaW5rIHsuLi5tb2NrUHJvcHN9IG1vZGU9XCJleHBhbmRcIiAvPilcblxuICAgICAgLy8gSW4gZXhwYW5kIG1vZGUsIHdyYXBwZXIgc2hvdWxkIG5vdCBoYXZlIHRoZSBtaWNyby1hZGp1c3RtZW50XG4gICAgICBjb25zdCBleHBhbmRlZEljb25XcmFwcGVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCduYXYtaWNvbicpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdChleHBhbmRlZEljb25XcmFwcGVyKS5ub3QudG9IYXZlQ2xhc3MoJy1tbC0xJylcblxuICAgICAgLy8gSWNvbiBpdHNlbGYgbWFpbnRhaW5zIGNvbnNpc3RlbnQgY2xhc3NlcyAtIG5vIG1hcmdpbiBjaGFuZ2VzXG4gICAgICBleHBlY3QoaWNvbkVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdoLTQnKVxuICAgICAgZXhwZWN0KGljb25FbGVtZW50KS50b0hhdmVDbGFzcygndy00JylcbiAgICAgIGV4cGVjdChpY29uRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3Nocmluay0wJylcblxuICAgICAgLy8gVGhpcyB3cmFwcGVyIGFwcHJvYWNoIGVsaW1pbmF0ZXMgdGhlIGljb24gbWFyZ2luIHNoaWZ0IGlzc3VlXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJvdmlkZSBzbW9vdGggdGV4dCB0cmFuc2l0aW9uIHdpdGggbWF4LXdpZHRoIGFuaW1hdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8TmF2TGluayB7Li4ubW9ja1Byb3BzfSBtb2RlPVwiY29sbGFwc2VcIiAvPilcblxuICAgICAgLy8gVGV4dCBpcyBhbHdheXMgaW4gRE9NIGJ1dCBjb250cm9sbGVkIHZpYSBDU1MgY2xhc3Nlc1xuICAgICAgY29uc3QgY29sbGFwc2VkVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoJ09yY2hlc3RyYXRlJylcbiAgICAgIGV4cGVjdChjb2xsYXBzZWRUZXh0KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29sbGFwc2VkVGV4dCkudG9IYXZlQ2xhc3MoJ29wYWNpdHktMCcpXG4gICAgICBleHBlY3QoY29sbGFwc2VkVGV4dCkudG9IYXZlQ2xhc3MoJ21heC13LTAnKVxuICAgICAgZXhwZWN0KGNvbGxhcHNlZFRleHQpLnRvSGF2ZUNsYXNzKCdvdmVyZmxvdy1oaWRkZW4nKVxuXG4gICAgICByZXJlbmRlcig8TmF2TGluayB7Li4ubW9ja1Byb3BzfSBtb2RlPVwiZXhwYW5kXCIgLz4pXG5cbiAgICAgIC8vIFRleHQgc21vb3RobHkgdHJhbnNpdGlvbnMgdG8gdmlzaWJsZSBzdGF0ZVxuICAgICAgY29uc3QgZXhwYW5kZWRUZXh0ID0gc2NyZWVuLmdldEJ5VGV4dCgnT3JjaGVzdHJhdGUnKVxuICAgICAgZXhwZWN0KGV4cGFuZGVkVGV4dCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGV4cGFuZGVkVGV4dCkudG9IYXZlQ2xhc3MoJ29wYWNpdHktMTAwJylcbiAgICAgIGV4cGVjdChleHBhbmRlZFRleHQpLnRvSGF2ZUNsYXNzKCdtYXgtdy1ub25lJylcblxuICAgICAgLy8gRml4ZWQ6IEFsd2F5cyBwcmVzZW50IGluIERPTSB3aXRoIHNtb290aCBDU1MgdHJhbnNpdGlvbnNcbiAgICAgIC8vIGluc3RlYWQgb2YgYWJydXB0IGNvbmRpdGlvbmFsIHJlbmRlcmluZ1xuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0xheW91dCBDb25zaXN0ZW5jeSBJbXByb3ZlbWVudHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBjb25zaXN0ZW50IHBhZGRpbmcgYWNyb3NzIGFsbCBzdGF0ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE5hdkxpbmsgey4uLm1vY2tQcm9wc30gbW9kZT1cImNvbGxhcHNlXCIgLz4pXG5cbiAgICAgIGNvbnN0IGxpbmtFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCduYXYtbGluaycpXG5cbiAgICAgIC8vIENvbnNpc3RlbnQgcGFkZGluZyBpbiBjb2xsYXBzZWQgc3RhdGVcbiAgICAgIGV4cGVjdChsaW5rRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3BsLTMnKVxuICAgICAgZXhwZWN0KGxpbmtFbGVtZW50KS50b0hhdmVDbGFzcygncHItMScpXG5cbiAgICAgIHJlcmVuZGVyKDxOYXZMaW5rIHsuLi5tb2NrUHJvcHN9IG1vZGU9XCJleHBhbmRcIiAvPilcblxuICAgICAgLy8gU2FtZSBwYWRkaW5nIGluIGV4cGFuZGVkIHN0YXRlIC0gbm8gbGF5b3V0IHNoaWZ0XG4gICAgICBleHBlY3QobGlua0VsZW1lbnQpLnRvSGF2ZUNsYXNzKCdwbC0zJylcbiAgICAgIGV4cGVjdChsaW5rRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3ByLTEnKVxuXG4gICAgICAvLyBUaGlzIGNvbnNpc3RlbmN5IGVsaW1pbmF0ZXMgdGhlIGxheW91dCBzaGlmdCBpc3N1ZVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSB3cmFwcGVyLWJhc2VkIGljb24gcG9zaXRpb25pbmcgaW5zdGVhZCBvZiBtYXJnaW4gY2hhbmdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8TmF2TGluayB7Li4ubW9ja1Byb3BzfSBtb2RlPVwiY29sbGFwc2VcIiAvPilcblxuICAgICAgY29uc3QgaWNvbkVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ25hdi1pY29uJylcbiAgICAgIGNvbnN0IGljb25XcmFwcGVyID0gaWNvbkVsZW1lbnQucGFyZW50RWxlbWVudFxuXG4gICAgICAvLyBDb2xsYXBzZWQ6IHdyYXBwZXIgaGFzIG1pY3JvLWFkanVzdG1lbnQgZm9yIGNlbnRlcmluZ1xuICAgICAgZXhwZWN0KGljb25XcmFwcGVyKS50b0hhdmVDbGFzcygnLW1sLTEnKVxuXG4gICAgICAvLyBJY29uIGl0c2VsZiBoYXMgY29uc2lzdGVudCBjbGFzc2VzXG4gICAgICBleHBlY3QoaWNvbkVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdoLTQnKVxuICAgICAgZXhwZWN0KGljb25FbGVtZW50KS50b0hhdmVDbGFzcygndy00JylcbiAgICAgIGV4cGVjdChpY29uRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3Nocmluay0wJylcblxuICAgICAgcmVyZW5kZXIoPE5hdkxpbmsgey4uLm1vY2tQcm9wc30gbW9kZT1cImV4cGFuZFwiIC8+KVxuXG4gICAgICBjb25zdCBleHBhbmRlZEljb25XcmFwcGVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCduYXYtaWNvbicpLnBhcmVudEVsZW1lbnRcblxuICAgICAgLy8gRXhwYW5kZWQ6IG5vIHdyYXBwZXIgYWRqdXN0bWVudCBuZWVkZWRcbiAgICAgIGV4cGVjdChleHBhbmRlZEljb25XcmFwcGVyKS5ub3QudG9IYXZlQ2xhc3MoJy1tbC0xJylcblxuICAgICAgLy8gSWNvbiBjbGFzc2VzIHJlbWFpbiBjb25zaXN0ZW50IC0gbm8gbWFyZ2luIHNoaWZ0c1xuICAgICAgZXhwZWN0KGljb25FbGVtZW50KS50b0hhdmVDbGFzcygnaC00JylcbiAgICAgIGV4cGVjdChpY29uRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3ctNCcpXG4gICAgICBleHBlY3QoaWNvbkVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdzaHJpbmstMCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQWN0aXZlIFN0YXRlIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFjdGl2ZSBzdGF0ZSBjb3JyZWN0bHkgaW4gYm90aCBtb2RlcycsICgpID0+IHtcbiAgICAgIC8vIFRlc3Qgbm9uLWFjdGl2ZSBzdGF0ZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxOYXZMaW5rIHsuLi5tb2NrUHJvcHN9IG1vZGU9XCJjb2xsYXBzZVwiIC8+KVxuXG4gICAgICBsZXQgbGlua0VsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ25hdi1saW5rJylcbiAgICAgIGV4cGVjdChsaW5rRWxlbWVudCkubm90LnRvSGF2ZUNsYXNzKCdiZy1jb21wb25lbnRzLW1lbnUtaXRlbS1iZy1hY3RpdmUnKVxuXG4gICAgICAvLyBUZXN0IHdpdGggYWN0aXZlIHN0YXRlICh3aGVuIGhyZWYgbWF0Y2hlcyBjdXJyZW50IHNlZ21lbnQpXG4gICAgICBjb25zdCBhY3RpdmVQcm9wcyA9IHtcbiAgICAgICAgLi4ubW9ja1Byb3BzLFxuICAgICAgICBocmVmOiAnL2FwcC8xMjMvb3ZlcnZpZXcnLCAvLyBtYXRjaGVzIG1vY2tlZCBzZWdtZW50XG4gICAgICB9XG5cbiAgICAgIHJlcmVuZGVyKDxOYXZMaW5rIHsuLi5hY3RpdmVQcm9wc30gbW9kZT1cImV4cGFuZFwiIC8+KVxuXG4gICAgICBsaW5rRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnbmF2LWxpbmsnKVxuICAgICAgZXhwZWN0KGxpbmtFbGVtZW50KS50b0hhdmVDbGFzcygnYmctY29tcG9uZW50cy1tZW51LWl0ZW0tYmctYWN0aXZlJylcbiAgICAgIGV4cGVjdChsaW5rRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1hY2NlbnQtbGlnaHQtbW9kZS1vbmx5JylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdUZXh0IEFuaW1hdGlvbiBDbGFzc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgdGV4dCBjbGFzc2VzIGluIGNvbGxhcHNlZCBtb2RlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxOYXZMaW5rIHsuLi5tb2NrUHJvcHN9IG1vZGU9XCJjb2xsYXBzZVwiIC8+KVxuXG4gICAgICBjb25zdCB0ZXh0RWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ09yY2hlc3RyYXRlJylcblxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJylcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9IYXZlQ2xhc3MoJ3doaXRlc3BhY2Utbm93cmFwJylcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9IYXZlQ2xhc3MoJ3RyYW5zaXRpb24tYWxsJylcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9IYXZlQ2xhc3MoJ2R1cmF0aW9uLTIwMCcpXG4gICAgICBleHBlY3QodGV4dEVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdlYXNlLWluLW91dCcpXG4gICAgICBleHBlY3QodGV4dEVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdtbC0wJylcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9IYXZlQ2xhc3MoJ21heC13LTAnKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnb3BhY2l0eS0wJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHByb3BlciB0ZXh0IGNsYXNzZXMgaW4gZXhwYW5kZWQgbW9kZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TmF2TGluayB7Li4ubW9ja1Byb3BzfSBtb2RlPVwiZXhwYW5kXCIgLz4pXG5cbiAgICAgIGNvbnN0IHRleHRFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgnT3JjaGVzdHJhdGUnKVxuXG4gICAgICBleHBlY3QodGV4dEVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdvdmVyZmxvdy1oaWRkZW4nKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnd2hpdGVzcGFjZS1ub3dyYXAnKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygndHJhbnNpdGlvbi1hbGwnKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnZHVyYXRpb24tMjAwJylcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9IYXZlQ2xhc3MoJ2Vhc2UtaW4tb3V0JylcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9IYXZlQ2xhc3MoJ21sLTInKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnbWF4LXctbm9uZScpXG4gICAgICBleHBlY3QodGV4dEVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdvcGFjaXR5LTEwMCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRGlzYWJsZWQgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXMgYnV0dG9uIHdoZW4gZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPE5hdkxpbmsgey4uLm1vY2tQcm9wc30gbW9kZT1cImV4cGFuZFwiIGRpc2FibGVkPXt0cnVlfSAvPilcblxuICAgICAgY29uc3QgYnV0dG9uRWxlbWVudCA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uRWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGJ1dHRvbkVsZW1lbnQpLnRvQmVEaXNhYmxlZCgpXG4gICAgICBleHBlY3QoYnV0dG9uRWxlbWVudCkudG9IYXZlQ2xhc3MoJ2N1cnNvci1ub3QtYWxsb3dlZCcpXG4gICAgICBleHBlY3QoYnV0dG9uRWxlbWVudCkudG9IYXZlQ2xhc3MoJ29wYWNpdHktMzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGNvbnNpc3RlbnQgc3R5bGluZyBpbiBkaXNhYmxlZCBzdGF0ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TmF2TGluayB7Li4ubW9ja1Byb3BzfSBtb2RlPVwiY29sbGFwc2VcIiBkaXNhYmxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbkVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbkVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdwbC0zJylcbiAgICAgIGV4cGVjdChidXR0b25FbGVtZW50KS50b0hhdmVDbGFzcygncHItMScpXG5cbiAgICAgIGNvbnN0IGljb25XcmFwcGVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCduYXYtaWNvbicpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdChpY29uV3JhcHBlcikudG9IYXZlQ2xhc3MoJy1tbC0xJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==