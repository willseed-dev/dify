"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const var_picker_1 = require("./var-picker");
// Mock external dependencies only
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/test',
}));
vi.mock('@/app/components/base/portal-to-follow-elem', () => {
    const PortalContext = React.createContext({ open: false });
    const PortalToFollowElem = ({ children, open }) => {
        return (<PortalContext.Provider value={{ open: !!open }}>
        <div data-testid="portal">{children}</div>
      </PortalContext.Provider>);
    };
    const PortalToFollowElemContent = ({ children, ...props }) => {
        const { open } = React.useContext(PortalContext);
        if (!open)
            return null;
        return (<div data-testid="portal-content" {...props}>
        {children}
      </div>);
    };
    const PortalToFollowElemTrigger = ({ children, asChild, ...props }) => {
        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children, {
                ...props,
                'data-testid': 'portal-trigger',
            });
        }
        return (<div data-testid="portal-trigger" {...props}>
        {children}
      </div>);
    };
    return {
        PortalToFollowElem,
        PortalToFollowElemContent,
        PortalToFollowElemTrigger,
    };
});
describe('VarPicker', () => {
    const mockOptions = [
        { name: 'Variable 1', value: 'var1', type: 'string' },
        { name: 'Variable 2', value: 'var2', type: 'number' },
        { name: 'Variable 3', value: 'var3', type: 'boolean' },
    ];
    const defaultProps = {
        value: 'var1',
        options: mockOptions,
        onChange: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render variable picker with dropdown trigger', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
            expect(react_1.screen.getByText('var1')).toBeInTheDocument();
        });
        it('should display selected variable with type icon when value is provided', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('var1')).toBeInTheDocument();
            expect(react_1.screen.getByText('{{')).toBeInTheDocument();
            expect(react_1.screen.getByText('}}')).toBeInTheDocument();
            // IconTypeIcon should be rendered (check for svg icon)
            expect(document.querySelector('svg')).toBeInTheDocument();
        });
        it('should show placeholder text when no value is selected', () => {
            // Arrange
            const props = {
                ...defaultProps,
                value: undefined,
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByText('var1')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('appDebug.feature.dataSet.queryVariable.choosePlaceholder')).toBeInTheDocument();
        });
        it('should display custom tip message when notSelectedVarTip is provided', () => {
            // Arrange
            const props = {
                ...defaultProps,
                value: undefined,
                notSelectedVarTip: 'Select a variable',
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Select a variable')).toBeInTheDocument();
        });
        it('should render dropdown indicator icon', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert - Trigger should be present
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should apply custom className to wrapper', () => {
            // Arrange
            const props = {
                ...defaultProps,
                className: 'custom-class',
            };
            // Act
            const { container } = (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(container.querySelector('.custom-class')).toBeInTheDocument();
        });
        it('should apply custom triggerClassName to trigger button', () => {
            // Arrange
            const props = {
                ...defaultProps,
                triggerClassName: 'custom-trigger-class',
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('portal-trigger')).toHaveClass('custom-trigger-class');
        });
        it('should display selected value with proper formatting', () => {
            // Arrange
            const props = {
                ...defaultProps,
                value: 'customVar',
                options: [
                    { name: 'Custom Variable', value: 'customVar', type: 'string' },
                ],
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('customVar')).toBeInTheDocument();
            expect(react_1.screen.getByText('{{')).toBeInTheDocument();
            expect(react_1.screen.getByText('}}')).toBeInTheDocument();
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should open dropdown when clicking the trigger button', async () => {
            // Arrange
            const onChange = vi.fn();
            const props = { ...defaultProps, onChange };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            await user.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
        it('should call onChange and close dropdown when selecting an option', async () => {
            // Arrange
            const onChange = vi.fn();
            const props = { ...defaultProps, onChange };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Open dropdown
            await user.click(react_1.screen.getByTestId('portal-trigger'));
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            // Select a different option
            const options = react_1.screen.getAllByText('var2');
            expect(options.length).toBeGreaterThan(0);
            await user.click(options[0]);
            // Assert
            expect(onChange).toHaveBeenCalledWith('var2');
            expect(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
        });
        it('should toggle dropdown when clicking trigger button multiple times', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            // Open dropdown
            await user.click(trigger);
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            // Close dropdown
            await user.click(trigger);
            expect(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
        });
    });
    // State Management
    describe('State Management', () => {
        it('should initialize with closed dropdown', () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
        });
        it('should toggle dropdown state on trigger click', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            expect(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
            // Open dropdown
            await user.click(trigger);
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            // Close dropdown
            await user.click(trigger);
            expect(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
        });
        it('should preserve selected value when dropdown is closed without selection', async () => {
            // Arrange
            const props = { ...defaultProps };
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Open and close dropdown without selecting anything
            const trigger = react_1.screen.getByTestId('portal-trigger');
            await user.click(trigger);
            await user.click(trigger);
            // Assert
            expect(react_1.screen.getByText('var1')).toBeInTheDocument(); // Original value still displayed
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle undefined value gracefully', () => {
            // Arrange
            const props = {
                ...defaultProps,
                value: undefined,
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('appDebug.feature.dataSet.queryVariable.choosePlaceholder')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
        });
        it('should handle empty options array', () => {
            // Arrange
            const props = {
                ...defaultProps,
                options: [],
                value: undefined,
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
            expect(react_1.screen.getByText('appDebug.feature.dataSet.queryVariable.choosePlaceholder')).toBeInTheDocument();
        });
        it('should handle null value without crashing', () => {
            // Arrange
            const props = {
                ...defaultProps,
                value: undefined,
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('appDebug.feature.dataSet.queryVariable.choosePlaceholder')).toBeInTheDocument();
        });
        it('should handle variable names with special characters safely', () => {
            // Arrange
            const props = {
                ...defaultProps,
                options: [
                    { name: 'Variable with & < > " \' characters', value: 'specialVar', type: 'string' },
                ],
                value: 'specialVar',
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('specialVar')).toBeInTheDocument();
        });
        it('should handle long variable names', () => {
            // Arrange
            const props = {
                ...defaultProps,
                options: [
                    { name: 'A very long variable name that should be truncated', value: 'longVar', type: 'string' },
                ],
                value: 'longVar',
            };
            // Act
            (0, react_1.render)(<var_picker_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('longVar')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyLXBpY2tlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFyLXBpY2tlci5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUF1RDtBQUN2RCw0REFBbUQ7QUFDbkQsK0JBQThCO0FBQzlCLDZDQUFvQztBQUVwQyxrQ0FBa0M7QUFDbEMsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3BDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPO0NBQzNCLENBQUMsQ0FBQyxDQUFBO0FBVUgsRUFBRSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7SUFDMUQsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBRTFELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQTJCLEVBQUUsRUFBRTtRQUN6RSxPQUFPLENBQ0wsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUM5QztRQUFBLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQzNDO01BQUEsRUFBRSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQzFCLENBQUE7SUFDSCxDQUFDLENBQUE7SUFFRCxNQUFNLHlCQUF5QixHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxLQUFLLEVBQWtDLEVBQUUsRUFBRTtRQUMzRixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFD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LEVBQUU7aUJBQ3JGO2dCQUNELEtBQUssRUFBRSxZQUFZO2FBQ3BCLENBQUE7WUFFRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxvQkFBUyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRWhDLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1lBQzNDLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRztnQkFDWixHQUFHLFlBQVk7Z0JBQ2YsT0FBTyxFQUFFO29CQUNQLEVBQUUsSUFBSSxFQUFFLG9EQUFvRCxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtpQkFDakc7Z0JBQ0QsS0FBSyxFQUFFLFNBQVM7YUFDakIsQ0FBQTtZQUVELE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLG9CQUFTLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFaEMsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN2RCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi92YXItcGlja2VyJ1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBWYXJQaWNrZXIgZnJvbSAnLi92YXItcGlja2VyJ1xuXG4vLyBNb2NrIGV4dGVybmFsIGRlcGVuZGVuY2llcyBvbmx5XG52aS5tb2NrKCduZXh0L25hdmlnYXRpb24nLCAoKSA9PiAoe1xuICB1c2VSb3V0ZXI6ICgpID0+ICh7IHB1c2g6IHZpLmZuKCkgfSksXG4gIHVzZVBhdGhuYW1lOiAoKSA9PiAnL3Rlc3QnLFxufSkpXG5cbnR5cGUgUG9ydGFsVG9Gb2xsb3dFbGVtUHJvcHMgPSB7XG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgb3Blbj86IGJvb2xlYW5cbiAgb25PcGVuQ2hhbmdlPzogKG9wZW46IGJvb2xlYW4pID0+IHZvaWRcbn1cbnR5cGUgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlclByb3BzID0gUmVhY3QuSFRNTEF0dHJpYnV0ZXM8SFRNTEVsZW1lbnQ+ICYgeyBjaGlsZHJlbj86IFJlYWN0LlJlYWN0Tm9kZSwgYXNDaGlsZD86IGJvb2xlYW4gfVxudHlwZSBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50UHJvcHMgPSBSZWFjdC5IVE1MQXR0cmlidXRlczxIVE1MRGl2RWxlbWVudD4gJiB7IGNoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlIH1cblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbScsICgpID0+IHtcbiAgY29uc3QgUG9ydGFsQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQoeyBvcGVuOiBmYWxzZSB9KVxuXG4gIGNvbnN0IFBvcnRhbFRvRm9sbG93RWxlbSA9ICh7IGNoaWxkcmVuLCBvcGVuIH06IFBvcnRhbFRvRm9sbG93RWxlbVByb3BzKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxQb3J0YWxDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IG9wZW46ICEhb3BlbiB9fT5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbFwiPntjaGlsZHJlbn08L2Rpdj5cbiAgICAgIDwvUG9ydGFsQ29udGV4dC5Qcm92aWRlcj5cbiAgICApXG4gIH1cblxuICBjb25zdCBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50ID0gKHsgY2hpbGRyZW4sIC4uLnByb3BzIH06IFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnRQcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgb3BlbiB9ID0gUmVhY3QudXNlQ29udGV4dChQb3J0YWxDb250ZXh0KVxuICAgIGlmICghb3BlbilcbiAgICAgIHJldHVybiBudWxsXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtY29udGVudFwiIHsuLi5wcm9wc30+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIgPSAoeyBjaGlsZHJlbiwgYXNDaGlsZCwgLi4ucHJvcHMgfTogUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlclByb3BzKSA9PiB7XG4gICAgaWYgKGFzQ2hpbGQgJiYgUmVhY3QuaXNWYWxpZEVsZW1lbnQoY2hpbGRyZW4pKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkcmVuLCB7XG4gICAgICAgIC4uLnByb3BzLFxuICAgICAgICAnZGF0YS10ZXN0aWQnOiAncG9ydGFsLXRyaWdnZXInLFxuICAgICAgfSBhcyBSZWFjdC5IVE1MQXR0cmlidXRlczxIVE1MRWxlbWVudD4pXG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLXRyaWdnZXJcIiB7Li4ucHJvcHN9PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4ge1xuICAgIFBvcnRhbFRvRm9sbG93RWxlbSxcbiAgICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50LFxuICAgIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIsXG4gIH1cbn0pXG5cbmRlc2NyaWJlKCdWYXJQaWNrZXInLCAoKSA9PiB7XG4gIGNvbnN0IG1vY2tPcHRpb25zOiBQcm9wc1snb3B0aW9ucyddID0gW1xuICAgIHsgbmFtZTogJ1ZhcmlhYmxlIDEnLCB2YWx1ZTogJ3ZhcjEnLCB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIHsgbmFtZTogJ1ZhcmlhYmxlIDInLCB2YWx1ZTogJ3ZhcjInLCB0eXBlOiAnbnVtYmVyJyB9LFxuICAgIHsgbmFtZTogJ1ZhcmlhYmxlIDMnLCB2YWx1ZTogJ3ZhcjMnLCB0eXBlOiAnYm9vbGVhbicgfSxcbiAgXVxuXG4gIGNvbnN0IGRlZmF1bHRQcm9wczogUHJvcHMgPSB7XG4gICAgdmFsdWU6ICd2YXIxJyxcbiAgICBvcHRpb25zOiBtb2NrT3B0aW9ucyxcbiAgICBvbkNoYW5nZTogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFJlbmRlcmluZyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdmFyaWFibGUgcGlja2VyIHdpdGggZHJvcGRvd24gdHJpZ2dlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VmFyUGlja2VyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3ZhcjEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgc2VsZWN0ZWQgdmFyaWFibGUgd2l0aCB0eXBlIGljb24gd2hlbiB2YWx1ZSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VmFyUGlja2VyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3ZhcjEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3t7JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd9fScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBJY29uVHlwZUljb24gc2hvdWxkIGJlIHJlbmRlcmVkIChjaGVjayBmb3Igc3ZnIGljb24pXG4gICAgICBleHBlY3QoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHBsYWNlaG9sZGVyIHRleHQgd2hlbiBubyB2YWx1ZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxWYXJQaWNrZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCd2YXIxJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwRGVidWcuZmVhdHVyZS5kYXRhU2V0LnF1ZXJ5VmFyaWFibGUuY2hvb3NlUGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY3VzdG9tIHRpcCBtZXNzYWdlIHdoZW4gbm90U2VsZWN0ZWRWYXJUaXAgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICBub3RTZWxlY3RlZFZhclRpcDogJ1NlbGVjdCBhIHZhcmlhYmxlJyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFZhclBpY2tlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTZWxlY3QgYSB2YXJpYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRyb3Bkb3duIGluZGljYXRvciBpY29uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxWYXJQaWNrZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gVHJpZ2dlciBzaG91bGQgYmUgcHJlc2VudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcHMgdGVzdHMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gY2xhc3NOYW1lIHRvIHdyYXBwZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBjbGFzc05hbWU6ICdjdXN0b20tY2xhc3MnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFZhclBpY2tlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1c3RvbS1jbGFzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIHRyaWdnZXJDbGFzc05hbWUgdG8gdHJpZ2dlciBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICB0cmlnZ2VyQ2xhc3NOYW1lOiAnY3VzdG9tLXRyaWdnZXItY2xhc3MnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VmFyUGlja2VyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkudG9IYXZlQ2xhc3MoJ2N1c3RvbS10cmlnZ2VyLWNsYXNzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHNlbGVjdGVkIHZhbHVlIHdpdGggcHJvcGVyIGZvcm1hdHRpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICB2YWx1ZTogJ2N1c3RvbVZhcicsXG4gICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICB7IG5hbWU6ICdDdXN0b20gVmFyaWFibGUnLCB2YWx1ZTogJ2N1c3RvbVZhcicsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIF0sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxWYXJQaWNrZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY3VzdG9tVmFyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd7eycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnfX0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnNcbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb3BlbiBkcm9wZG93biB3aGVuIGNsaWNraW5nIHRoZSB0cmlnZ2VyIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgb25DaGFuZ2UgfVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxWYXJQaWNrZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIGFuZCBjbG9zZSBkcm9wZG93biB3aGVuIHNlbGVjdGluZyBhbiBvcHRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMsIG9uQ2hhbmdlIH1cbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VmFyUGlja2VyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIE9wZW4gZHJvcGRvd25cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBTZWxlY3QgYSBkaWZmZXJlbnQgb3B0aW9uXG4gICAgICBjb25zdCBvcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgndmFyMicpXG4gICAgICBleHBlY3Qob3B0aW9ucy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhvcHRpb25zWzBdKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3ZhcjInKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBkcm9wZG93biB3aGVuIGNsaWNraW5nIHRyaWdnZXIgYnV0dG9uIG11bHRpcGxlIHRpbWVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFZhclBpY2tlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG5cbiAgICAgIC8vIE9wZW4gZHJvcGRvd25cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2xvc2UgZHJvcGRvd25cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFN0YXRlIE1hbmFnZW1lbnRcbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggY2xvc2VkIGRyb3Bkb3duJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxWYXJQaWNrZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdG9nZ2xlIGRyb3Bkb3duIHN0YXRlIG9uIHRyaWdnZXIgY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VmFyUGlja2VyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gT3BlbiBkcm9wZG93blxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDbG9zZSBkcm9wZG93blxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIHNlbGVjdGVkIHZhbHVlIHdoZW4gZHJvcGRvd24gaXMgY2xvc2VkIHdpdGhvdXQgc2VsZWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFZhclBpY2tlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBPcGVuIGFuZCBjbG9zZSBkcm9wZG93biB3aXRob3V0IHNlbGVjdGluZyBhbnl0aGluZ1xuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd2YXIxJykpLnRvQmVJblRoZURvY3VtZW50KCkgLy8gT3JpZ2luYWwgdmFsdWUgc3RpbGwgZGlzcGxheWVkXG4gICAgfSlcbiAgfSlcblxuICAvLyBFZGdlIENhc2VzIChSRVFVSVJFRClcbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHZhbHVlIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VmFyUGlja2VyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcERlYnVnLmZlYXR1cmUuZGF0YVNldC5xdWVyeVZhcmlhYmxlLmNob29zZVBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgb3B0aW9ucyBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VmFyUGlja2VyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcERlYnVnLmZlYXR1cmUuZGF0YVNldC5xdWVyeVZhcmlhYmxlLmNob29zZVBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCB2YWx1ZSB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFZhclBpY2tlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBEZWJ1Zy5mZWF0dXJlLmRhdGFTZXQucXVlcnlWYXJpYWJsZS5jaG9vc2VQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhcmlhYmxlIG5hbWVzIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzIHNhZmVseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICB7IG5hbWU6ICdWYXJpYWJsZSB3aXRoICYgPCA+IFwiIFxcJyBjaGFyYWN0ZXJzJywgdmFsdWU6ICdzcGVjaWFsVmFyJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdmFsdWU6ICdzcGVjaWFsVmFyJyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFZhclBpY2tlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdzcGVjaWFsVmFyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbG9uZyB2YXJpYWJsZSBuYW1lcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICB7IG5hbWU6ICdBIHZlcnkgbG9uZyB2YXJpYWJsZSBuYW1lIHRoYXQgc2hvdWxkIGJlIHRydW5jYXRlZCcsIHZhbHVlOiAnbG9uZ1ZhcicsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHZhbHVlOiAnbG9uZ1ZhcicsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxWYXJQaWNrZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbG9uZ1ZhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=