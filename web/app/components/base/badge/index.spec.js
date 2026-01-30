"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
describe('Badge', () => {
    describe('Rendering', () => {
        it('should render as a div element with badge class', () => {
            (0, react_1.render)(<index_1.default>Test Badge</index_1.default>);
            const badge = react_1.screen.getByText('Test Badge');
            expect(badge).toHaveClass('badge');
            expect(badge.tagName).toBe('DIV');
        });
        it.each([
            { children: undefined, label: 'no children' },
            { children: '', label: 'empty string' },
        ])('should render correctly when provided $label', ({ children }) => {
            const { container } = (0, react_1.render)(<index_1.default>{children}</index_1.default>);
            expect(container.firstChild).toHaveClass('badge');
        });
        it('should render React Node children correctly', () => {
            (0, react_1.render)(<index_1.default data-testid="badge-with-icon">
          <span data-testid="custom-icon">🔔</span>
        </index_1.default>);
            expect(react_1.screen.getByTestId('badge-with-icon')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('custom-icon')).toBeInTheDocument();
        });
    });
    describe('size prop', () => {
        it.each([
            { size: undefined, label: 'medium (default)' },
            { size: 's', label: 'small' },
            { size: 'm', label: 'medium' },
            { size: 'l', label: 'large' },
        ])('should render with $label size', ({ size }) => {
            (0, react_1.render)(<index_1.default size={size}>Test</index_1.default>);
            const expectedSize = size || 'm';
            expect(react_1.screen.getByText('Test')).toHaveClass('badge', `badge-${expectedSize}`);
        });
    });
    describe('state prop', () => {
        it.each([
            { state: index_1.BadgeState.Warning, label: 'warning', expectedClass: 'badge-warning' },
            { state: index_1.BadgeState.Accent, label: 'accent', expectedClass: 'badge-accent' },
        ])('should render with $label state', ({ state, expectedClass }) => {
            (0, react_1.render)(<index_1.default state={state}>State Test</index_1.default>);
            expect(react_1.screen.getByText('State Test')).toHaveClass(expectedClass);
        });
        it.each([
            { state: undefined, label: 'default (undefined)' },
            { state: index_1.BadgeState.Default, label: 'default (explicit)' },
        ])('should use default styles when state is $label', ({ state }) => {
            (0, react_1.render)(<index_1.default state={state}>State Test</index_1.default>);
            const badge = react_1.screen.getByText('State Test');
            expect(badge).not.toHaveClass('badge-warning', 'badge-accent');
        });
    });
    describe('iconOnly prop', () => {
        it.each([
            { size: 's', iconOnly: false, label: 'small with text' },
            { size: 's', iconOnly: true, label: 'small icon-only' },
            { size: 'm', iconOnly: false, label: 'medium with text' },
            { size: 'm', iconOnly: true, label: 'medium icon-only' },
            { size: 'l', iconOnly: false, label: 'large with text' },
            { size: 'l', iconOnly: true, label: 'large icon-only' },
        ])('should render correctly for $label', ({ size, iconOnly }) => {
            const { container } = (0, react_1.render)(<index_1.default size={size} iconOnly={iconOnly}>🔔</index_1.default>);
            const badge = react_1.screen.getByText('🔔');
            // Verify badge renders with correct size
            expect(badge).toHaveClass('badge', `badge-${size}`);
            // Verify the badge is in the DOM and contains the content
            expect(badge).toBeInTheDocument();
            expect(container.firstChild).toBe(badge);
        });
        it('should apply icon-only padding when iconOnly is true', () => {
            (0, react_1.render)(<index_1.default iconOnly>🔔</index_1.default>);
            // When iconOnly is true, the badge should have uniform padding (all sides equal)
            const badge = react_1.screen.getByText('🔔');
            expect(badge).toHaveClass('p-1');
        });
        it('should apply asymmetric padding when iconOnly is false', () => {
            (0, react_1.render)(<index_1.default iconOnly={false}>Badge</index_1.default>);
            // When iconOnly is false, the badge should have different horizontal and vertical padding
            const badge = react_1.screen.getByText('Badge');
            expect(badge).toHaveClass('px-[5px]', 'py-[2px]');
        });
    });
    describe('uppercase prop', () => {
        it.each([
            { uppercase: undefined, label: 'default (undefined)', expected: 'system-2xs-medium' },
            { uppercase: false, label: 'explicitly false', expected: 'system-2xs-medium' },
            { uppercase: true, label: 'true', expected: 'system-2xs-medium-uppercase' },
        ])('should apply $expected class when uppercase is $label', ({ uppercase, expected }) => {
            (0, react_1.render)(<index_1.default uppercase={uppercase}>Text</index_1.default>);
            expect(react_1.screen.getByText('Text')).toHaveClass(expected);
        });
    });
    describe('styleCss prop', () => {
        it('should apply custom inline styles correctly', () => {
            const customStyles = {
                backgroundColor: 'rgb(0, 0, 255)',
                color: 'rgb(255, 255, 255)',
                padding: '10px',
            };
            (0, react_1.render)(<index_1.default styleCss={customStyles}>Styled Badge</index_1.default>);
            expect(react_1.screen.getByText('Styled Badge')).toHaveStyle(customStyles);
        });
        it('should apply inline styles without overriding core classes', () => {
            (0, react_1.render)(<index_1.default styleCss={{ backgroundColor: 'rgb(255, 0, 0)', margin: '5px' }}>Custom</index_1.default>);
            const badge = react_1.screen.getByText('Custom');
            expect(badge).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)', margin: '5px' });
            expect(badge).toHaveClass('badge');
        });
    });
    describe('className prop', () => {
        it.each([
            {
                props: { className: 'custom-badge' },
                expected: ['badge', 'custom-badge'],
                label: 'single custom class',
            },
            {
                props: { className: 'custom-class another-class', size: 'l' },
                expected: ['badge', 'badge-l', 'custom-class', 'another-class'],
                label: 'multiple classes with size variant',
            },
        ])('should merge $label with default classes', ({ props, expected }) => {
            (0, react_1.render)(<index_1.default {...props}>Test</index_1.default>);
            expect(react_1.screen.getByText('Test')).toHaveClass(...expected);
        });
    });
    describe('HTML attributes passthrough', () => {
        it.each([
            { attr: 'data-testid', value: 'custom-badge-id', label: 'data attribute' },
            { attr: 'id', value: 'unique-badge', label: 'id attribute' },
            { attr: 'aria-label', value: 'Notification badge', label: 'aria-label' },
            { attr: 'title', value: 'Hover tooltip', label: 'title attribute' },
            { attr: 'role', value: 'status', label: 'ARIA role' },
        ])('should pass through $label correctly', ({ attr, value }) => {
            (0, react_1.render)(<index_1.default {...{ [attr]: value }}>Test</index_1.default>);
            expect(react_1.screen.getByText('Test')).toHaveAttribute(attr, value);
        });
        it('should support multiple HTML attributes simultaneously', () => {
            (0, react_1.render)(<index_1.default data-testid="multi-attr-badge" id="badge-123" aria-label="Status indicator" title="Current status">
          Test
        </index_1.default>);
            const badge = react_1.screen.getByTestId('multi-attr-badge');
            expect(badge).toHaveAttribute('id', 'badge-123');
            expect(badge).toHaveAttribute('aria-label', 'Status indicator');
            expect(badge).toHaveAttribute('title', 'Current status');
        });
    });
    describe('Event handlers', () => {
        it.each([
            { handler: 'onClick', trigger: react_1.fireEvent.click, label: 'click' },
            { handler: 'onMouseEnter', trigger: react_1.fireEvent.mouseEnter, label: 'mouse enter' },
            { handler: 'onMouseLeave', trigger: react_1.fireEvent.mouseLeave, label: 'mouse leave' },
        ])('should trigger $handler when $label occurs', ({ handler, trigger }) => {
            const mockHandler = vi.fn();
            (0, react_1.render)(<index_1.default {...{ [handler]: mockHandler }}>Badge</index_1.default>);
            trigger(react_1.screen.getByText('Badge'));
            expect(mockHandler).toHaveBeenCalledTimes(1);
        });
        it('should handle user interaction flow with multiple events', () => {
            const handlers = {
                onClick: vi.fn(),
                onMouseEnter: vi.fn(),
                onMouseLeave: vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...handlers}>Interactive</index_1.default>);
            const badge = react_1.screen.getByText('Interactive');
            react_1.fireEvent.mouseEnter(badge);
            react_1.fireEvent.click(badge);
            react_1.fireEvent.mouseLeave(badge);
            expect(handlers.onMouseEnter).toHaveBeenCalledTimes(1);
            expect(handlers.onClick).toHaveBeenCalledTimes(1);
            expect(handlers.onMouseLeave).toHaveBeenCalledTimes(1);
        });
        it('should pass event object to handler with correct properties', () => {
            const handleClick = vi.fn();
            (0, react_1.render)(<index_1.default onClick={handleClick}>Event Badge</index_1.default>);
            react_1.fireEvent.click(react_1.screen.getByText('Event Badge'));
            expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({
                type: 'click',
            }));
        });
    });
    describe('Combined props', () => {
        it('should correctly apply all props when used together', () => {
            (0, react_1.render)(<index_1.default size="l" state={index_1.BadgeState.Warning} uppercase className="custom-badge" styleCss={{ backgroundColor: 'rgb(0, 0, 255)' }} data-testid="combined-badge">
          Full Featured
        </index_1.default>);
            const badge = react_1.screen.getByTestId('combined-badge');
            expect(badge).toHaveClass('badge', 'badge-l', 'badge-warning', 'system-2xs-medium-uppercase', 'custom-badge');
            expect(badge).toHaveStyle({ backgroundColor: 'rgb(0, 0, 255)' });
            expect(badge).toHaveTextContent('Full Featured');
        });
        it.each([
            {
                props: { size: 'l', state: index_1.BadgeState.Accent },
                expected: ['badge', 'badge-l', 'badge-accent'],
                label: 'size and state variants',
            },
            {
                props: { iconOnly: true, uppercase: true },
                expected: ['badge', 'system-2xs-medium-uppercase'],
                label: 'iconOnly and uppercase',
            },
        ])('should combine $label correctly', ({ props, expected }) => {
            (0, react_1.render)(<index_1.default {...props}>Test</index_1.default>);
            expect(react_1.screen.getByText('Test')).toHaveClass(...expected);
        });
        it('should handle event handlers with combined props', () => {
            const handleClick = vi.fn();
            (0, react_1.render)(<index_1.default size="s" state={index_1.BadgeState.Warning} onClick={handleClick} className="interactive">
          Test
        </index_1.default>);
            const badge = react_1.screen.getByText('Test');
            expect(badge).toHaveClass('badge', 'badge-s', 'badge-warning', 'interactive');
            react_1.fireEvent.click(badge);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });
    describe('Edge cases', () => {
        it.each([
            { children: 42, text: '42', label: 'numeric value' },
            { children: 0, text: '0', label: 'zero' },
        ])('should render $label correctly', ({ children, text }) => {
            (0, react_1.render)(<index_1.default>{children}</index_1.default>);
            expect(react_1.screen.getByText(text)).toBeInTheDocument();
        });
        it.each([
            { children: null, label: 'null' },
            { children: false, label: 'boolean false' },
        ])('should handle $label children without errors', ({ children }) => {
            const { container } = (0, react_1.render)(<index_1.default>{children}</index_1.default>);
            expect(container.firstChild).toHaveClass('badge');
        });
        it('should render complex nested content correctly', () => {
            (0, react_1.render)(<index_1.default>
          <span data-testid="icon">🔔</span>
          <span data-testid="count">5</span>
        </index_1.default>);
            expect(react_1.screen.getByTestId('icon')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('count')).toBeInTheDocument();
        });
    });
    describe('Component metadata and exports', () => {
        it('should have correct displayName for debugging', () => {
            expect(index_1.default.displayName).toBe('Badge');
        });
        describe('BadgeState enum', () => {
            it.each([
                { key: 'Warning', value: 'warning' },
                { key: 'Accent', value: 'accent' },
                { key: 'Default', value: '' },
            ])('should export $key state with value "$value"', ({ key, value }) => {
                expect(index_1.BadgeState[key]).toBe(value);
            });
        });
        describe('BadgeVariants utility', () => {
            it('should be a function', () => {
                expect(typeof index_1.BadgeVariants).toBe('function');
            });
            it('should generate base badge class with default medium size', () => {
                const result = (0, index_1.BadgeVariants)({});
                expect(result).toContain('badge');
                expect(result).toContain('badge-m');
            });
            it.each([
                { size: 's' },
                { size: 'm' },
                { size: 'l' },
            ])('should generate correct classes for size=$size', ({ size }) => {
                const result = (0, index_1.BadgeVariants)({ size });
                expect(result).toContain('badge');
                expect(result).toContain(`badge-${size}`);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQWtFO0FBQ2xFLG1DQUEwRDtBQUUxRCxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLFVBQVUsRUFBRSxlQUFLLENBQUMsQ0FBQyxDQUFBO1lBRWpDLE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDNUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDTixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUM3QyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTtTQUN4QyxDQUFDLENBQUMsOENBQThDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDbEUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsZUFBSyxDQUFDLENBQUMsQ0FBQTtZQUV2RCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw2Q0FBNkMs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QUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUMzQyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IEJhZGdlLCB7IEJhZGdlU3RhdGUsIEJhZGdlVmFyaWFudHMgfSBmcm9tICcuL2luZGV4J1xuXG5kZXNjcmliZSgnQmFkZ2UnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXMgYSBkaXYgZWxlbWVudCB3aXRoIGJhZGdlIGNsYXNzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxCYWRnZT5UZXN0IEJhZGdlPC9CYWRnZT4pXG5cbiAgICAgIGNvbnN0IGJhZGdlID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBCYWRnZScpXG4gICAgICBleHBlY3QoYmFkZ2UpLnRvSGF2ZUNsYXNzKCdiYWRnZScpXG4gICAgICBleHBlY3QoYmFkZ2UudGFnTmFtZSkudG9CZSgnRElWJylcbiAgICB9KVxuXG4gICAgaXQuZWFjaChbXG4gICAgICB7IGNoaWxkcmVuOiB1bmRlZmluZWQsIGxhYmVsOiAnbm8gY2hpbGRyZW4nIH0sXG4gICAgICB7IGNoaWxkcmVuOiAnJywgbGFiZWw6ICdlbXB0eSBzdHJpbmcnIH0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdoZW4gcHJvdmlkZWQgJGxhYmVsJywgKHsgY2hpbGRyZW4gfSkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QmFkZ2U+e2NoaWxkcmVufTwvQmFkZ2U+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdiYWRnZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFJlYWN0IE5vZGUgY2hpbGRyZW4gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8QmFkZ2UgZGF0YS10ZXN0aWQ9XCJiYWRnZS13aXRoLWljb25cIj5cbiAgICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImN1c3RvbS1pY29uXCI+8J+UlDwvc3Bhbj5cbiAgICAgICAgPC9CYWRnZT4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhZGdlLXdpdGgtaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20taWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2l6ZSBwcm9wJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgeyBzaXplOiB1bmRlZmluZWQsIGxhYmVsOiAnbWVkaXVtIChkZWZhdWx0KScgfSxcbiAgICAgIHsgc2l6ZTogJ3MnLCBsYWJlbDogJ3NtYWxsJyB9LFxuICAgICAgeyBzaXplOiAnbScsIGxhYmVsOiAnbWVkaXVtJyB9LFxuICAgICAgeyBzaXplOiAnbCcsIGxhYmVsOiAnbGFyZ2UnIH0sXG4gICAgXSBhcyBjb25zdCkoJ3Nob3VsZCByZW5kZXIgd2l0aCAkbGFiZWwgc2l6ZScsICh7IHNpemUgfSkgPT4ge1xuICAgICAgcmVuZGVyKDxCYWRnZSBzaXplPXtzaXplfT5UZXN0PC9CYWRnZT4pXG5cbiAgICAgIGNvbnN0IGV4cGVjdGVkU2l6ZSA9IHNpemUgfHwgJ20nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCcpKS50b0hhdmVDbGFzcygnYmFkZ2UnLCBgYmFkZ2UtJHtleHBlY3RlZFNpemV9YClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdzdGF0ZSBwcm9wJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgeyBzdGF0ZTogQmFkZ2VTdGF0ZS5XYXJuaW5nLCBsYWJlbDogJ3dhcm5pbmcnLCBleHBlY3RlZENsYXNzOiAnYmFkZ2Utd2FybmluZycgfSxcbiAgICAgIHsgc3RhdGU6IEJhZGdlU3RhdGUuQWNjZW50LCBsYWJlbDogJ2FjY2VudCcsIGV4cGVjdGVkQ2xhc3M6ICdiYWRnZS1hY2NlbnQnIH0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgd2l0aCAkbGFiZWwgc3RhdGUnLCAoeyBzdGF0ZSwgZXhwZWN0ZWRDbGFzcyB9KSA9PiB7XG4gICAgICByZW5kZXIoPEJhZGdlIHN0YXRlPXtzdGF0ZX0+U3RhdGUgVGVzdDwvQmFkZ2U+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3RhdGUgVGVzdCcpKS50b0hhdmVDbGFzcyhleHBlY3RlZENsYXNzKVxuICAgIH0pXG5cbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgc3RhdGU6IHVuZGVmaW5lZCwgbGFiZWw6ICdkZWZhdWx0ICh1bmRlZmluZWQpJyB9LFxuICAgICAgeyBzdGF0ZTogQmFkZ2VTdGF0ZS5EZWZhdWx0LCBsYWJlbDogJ2RlZmF1bHQgKGV4cGxpY2l0KScgfSxcbiAgICBdKSgnc2hvdWxkIHVzZSBkZWZhdWx0IHN0eWxlcyB3aGVuIHN0YXRlIGlzICRsYWJlbCcsICh7IHN0YXRlIH0pID0+IHtcbiAgICAgIHJlbmRlcig8QmFkZ2Ugc3RhdGU9e3N0YXRlfT5TdGF0ZSBUZXN0PC9CYWRnZT4pXG5cbiAgICAgIGNvbnN0IGJhZGdlID0gc2NyZWVuLmdldEJ5VGV4dCgnU3RhdGUgVGVzdCcpXG4gICAgICBleHBlY3QoYmFkZ2UpLm5vdC50b0hhdmVDbGFzcygnYmFkZ2Utd2FybmluZycsICdiYWRnZS1hY2NlbnQnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2ljb25Pbmx5IHByb3AnLCAoKSA9PiB7XG4gICAgaXQuZWFjaChbXG4gICAgICB7IHNpemU6ICdzJywgaWNvbk9ubHk6IGZhbHNlLCBsYWJlbDogJ3NtYWxsIHdpdGggdGV4dCcgfSxcbiAgICAgIHsgc2l6ZTogJ3MnLCBpY29uT25seTogdHJ1ZSwgbGFiZWw6ICdzbWFsbCBpY29uLW9ubHknIH0sXG4gICAgICB7IHNpemU6ICdtJywgaWNvbk9ubHk6IGZhbHNlLCBsYWJlbDogJ21lZGl1bSB3aXRoIHRleHQnIH0sXG4gICAgICB7IHNpemU6ICdtJywgaWNvbk9ubHk6IHRydWUsIGxhYmVsOiAnbWVkaXVtIGljb24tb25seScgfSxcbiAgICAgIHsgc2l6ZTogJ2wnLCBpY29uT25seTogZmFsc2UsIGxhYmVsOiAnbGFyZ2Ugd2l0aCB0ZXh0JyB9LFxuICAgICAgeyBzaXplOiAnbCcsIGljb25Pbmx5OiB0cnVlLCBsYWJlbDogJ2xhcmdlIGljb24tb25seScgfSxcbiAgICBdIGFzIGNvbnN0KSgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgZm9yICRsYWJlbCcsICh7IHNpemUsIGljb25Pbmx5IH0pID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEJhZGdlIHNpemU9e3NpemV9IGljb25Pbmx5PXtpY29uT25seX0+8J+UlDwvQmFkZ2U+KVxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KCfwn5SUJylcblxuICAgICAgLy8gVmVyaWZ5IGJhZGdlIHJlbmRlcnMgd2l0aCBjb3JyZWN0IHNpemVcbiAgICAgIGV4cGVjdChiYWRnZSkudG9IYXZlQ2xhc3MoJ2JhZGdlJywgYGJhZGdlLSR7c2l6ZX1gKVxuXG4gICAgICAvLyBWZXJpZnkgdGhlIGJhZGdlIGlzIGluIHRoZSBET00gYW5kIGNvbnRhaW5zIHRoZSBjb250ZW50XG4gICAgICBleHBlY3QoYmFkZ2UpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZShiYWRnZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBpY29uLW9ubHkgcGFkZGluZyB3aGVuIGljb25Pbmx5IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEJhZGdlIGljb25Pbmx5PvCflJQ8L0JhZGdlPilcblxuICAgICAgLy8gV2hlbiBpY29uT25seSBpcyB0cnVlLCB0aGUgYmFkZ2Ugc2hvdWxkIGhhdmUgdW5pZm9ybSBwYWRkaW5nIChhbGwgc2lkZXMgZXF1YWwpXG4gICAgICBjb25zdCBiYWRnZSA9IHNjcmVlbi5nZXRCeVRleHQoJ/CflJQnKVxuICAgICAgZXhwZWN0KGJhZGdlKS50b0hhdmVDbGFzcygncC0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBhc3ltbWV0cmljIHBhZGRpbmcgd2hlbiBpY29uT25seSBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8QmFkZ2UgaWNvbk9ubHk9e2ZhbHNlfT5CYWRnZTwvQmFkZ2U+KVxuXG4gICAgICAvLyBXaGVuIGljb25Pbmx5IGlzIGZhbHNlLCB0aGUgYmFkZ2Ugc2hvdWxkIGhhdmUgZGlmZmVyZW50IGhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhZGRpbmdcbiAgICAgIGNvbnN0IGJhZGdlID0gc2NyZWVuLmdldEJ5VGV4dCgnQmFkZ2UnKVxuICAgICAgZXhwZWN0KGJhZGdlKS50b0hhdmVDbGFzcygncHgtWzVweF0nLCAncHktWzJweF0nKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3VwcGVyY2FzZSBwcm9wJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgeyB1cHBlcmNhc2U6IHVuZGVmaW5lZCwgbGFiZWw6ICdkZWZhdWx0ICh1bmRlZmluZWQpJywgZXhwZWN0ZWQ6ICdzeXN0ZW0tMnhzLW1lZGl1bScgfSxcbiAgICAgIHsgdXBwZXJjYXNlOiBmYWxzZSwgbGFiZWw6ICdleHBsaWNpdGx5IGZhbHNlJywgZXhwZWN0ZWQ6ICdzeXN0ZW0tMnhzLW1lZGl1bScgfSxcbiAgICAgIHsgdXBwZXJjYXNlOiB0cnVlLCBsYWJlbDogJ3RydWUnLCBleHBlY3RlZDogJ3N5c3RlbS0yeHMtbWVkaXVtLXVwcGVyY2FzZScgfSxcbiAgICBdKSgnc2hvdWxkIGFwcGx5ICRleHBlY3RlZCBjbGFzcyB3aGVuIHVwcGVyY2FzZSBpcyAkbGFiZWwnLCAoeyB1cHBlcmNhc2UsIGV4cGVjdGVkIH0pID0+IHtcbiAgICAgIHJlbmRlcig8QmFkZ2UgdXBwZXJjYXNlPXt1cHBlcmNhc2V9PlRleHQ8L0JhZGdlPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RleHQnKSkudG9IYXZlQ2xhc3MoZXhwZWN0ZWQpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc3R5bGVDc3MgcHJvcCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBpbmxpbmUgc3R5bGVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1c3RvbVN0eWxlcyA9IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiKDAsIDAsIDI1NSknLFxuICAgICAgICBjb2xvcjogJ3JnYigyNTUsIDI1NSwgMjU1KScsXG4gICAgICAgIHBhZGRpbmc6ICcxMHB4JyxcbiAgICAgIH1cbiAgICAgIHJlbmRlcig8QmFkZ2Ugc3R5bGVDc3M9e2N1c3RvbVN0eWxlc30+U3R5bGVkIEJhZGdlPC9CYWRnZT4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdHlsZWQgQmFkZ2UnKSkudG9IYXZlU3R5bGUoY3VzdG9tU3R5bGVzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGlubGluZSBzdHlsZXMgd2l0aG91dCBvdmVycmlkaW5nIGNvcmUgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8QmFkZ2Ugc3R5bGVDc3M9e3sgYmFja2dyb3VuZENvbG9yOiAncmdiKDI1NSwgMCwgMCknLCBtYXJnaW46ICc1cHgnIH19PkN1c3RvbTwvQmFkZ2U+KVxuXG4gICAgICBjb25zdCBiYWRnZSA9IHNjcmVlbi5nZXRCeVRleHQoJ0N1c3RvbScpXG4gICAgICBleHBlY3QoYmFkZ2UpLnRvSGF2ZVN0eWxlKHsgYmFja2dyb3VuZENvbG9yOiAncmdiKDI1NSwgMCwgMCknLCBtYXJnaW46ICc1cHgnIH0pXG4gICAgICBleHBlY3QoYmFkZ2UpLnRvSGF2ZUNsYXNzKCdiYWRnZScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnY2xhc3NOYW1lIHByb3AnLCAoKSA9PiB7XG4gICAgaXQuZWFjaChbXG4gICAgICB7XG4gICAgICAgIHByb3BzOiB7IGNsYXNzTmFtZTogJ2N1c3RvbS1iYWRnZScgfSxcbiAgICAgICAgZXhwZWN0ZWQ6IFsnYmFkZ2UnLCAnY3VzdG9tLWJhZGdlJ10sXG4gICAgICAgIGxhYmVsOiAnc2luZ2xlIGN1c3RvbSBjbGFzcycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwcm9wczogeyBjbGFzc05hbWU6ICdjdXN0b20tY2xhc3MgYW5vdGhlci1jbGFzcycsIHNpemU6ICdsJyBhcyBjb25zdCB9LFxuICAgICAgICBleHBlY3RlZDogWydiYWRnZScsICdiYWRnZS1sJywgJ2N1c3RvbS1jbGFzcycsICdhbm90aGVyLWNsYXNzJ10sXG4gICAgICAgIGxhYmVsOiAnbXVsdGlwbGUgY2xhc3NlcyB3aXRoIHNpemUgdmFyaWFudCcsXG4gICAgICB9LFxuICAgIF0pKCdzaG91bGQgbWVyZ2UgJGxhYmVsIHdpdGggZGVmYXVsdCBjbGFzc2VzJywgKHsgcHJvcHMsIGV4cGVjdGVkIH0pID0+IHtcbiAgICAgIHJlbmRlcig8QmFkZ2Ugey4uLnByb3BzfT5UZXN0PC9CYWRnZT4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0JykpLnRvSGF2ZUNsYXNzKC4uLmV4cGVjdGVkKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0hUTUwgYXR0cmlidXRlcyBwYXNzdGhyb3VnaCcsICgpID0+IHtcbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgYXR0cjogJ2RhdGEtdGVzdGlkJywgdmFsdWU6ICdjdXN0b20tYmFkZ2UtaWQnLCBsYWJlbDogJ2RhdGEgYXR0cmlidXRlJyB9LFxuICAgICAgeyBhdHRyOiAnaWQnLCB2YWx1ZTogJ3VuaXF1ZS1iYWRnZScsIGxhYmVsOiAnaWQgYXR0cmlidXRlJyB9LFxuICAgICAgeyBhdHRyOiAnYXJpYS1sYWJlbCcsIHZhbHVlOiAnTm90aWZpY2F0aW9uIGJhZGdlJywgbGFiZWw6ICdhcmlhLWxhYmVsJyB9LFxuICAgICAgeyBhdHRyOiAndGl0bGUnLCB2YWx1ZTogJ0hvdmVyIHRvb2x0aXAnLCBsYWJlbDogJ3RpdGxlIGF0dHJpYnV0ZScgfSxcbiAgICAgIHsgYXR0cjogJ3JvbGUnLCB2YWx1ZTogJ3N0YXR1cycsIGxhYmVsOiAnQVJJQSByb2xlJyB9LFxuICAgIF0pKCdzaG91bGQgcGFzcyB0aHJvdWdoICRsYWJlbCBjb3JyZWN0bHknLCAoeyBhdHRyLCB2YWx1ZSB9KSA9PiB7XG4gICAgICByZW5kZXIoPEJhZGdlIHsuLi57IFthdHRyXTogdmFsdWUgfX0+VGVzdDwvQmFkZ2U+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCcpKS50b0hhdmVBdHRyaWJ1dGUoYXR0ciwgdmFsdWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3VwcG9ydCBtdWx0aXBsZSBIVE1MIGF0dHJpYnV0ZXMgc2ltdWx0YW5lb3VzbHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxCYWRnZVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibXVsdGktYXR0ci1iYWRnZVwiXG4gICAgICAgICAgaWQ9XCJiYWRnZS0xMjNcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJTdGF0dXMgaW5kaWNhdG9yXCJcbiAgICAgICAgICB0aXRsZT1cIkN1cnJlbnQgc3RhdHVzXCJcbiAgICAgICAgPlxuICAgICAgICAgIFRlc3RcbiAgICAgICAgPC9CYWRnZT4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGJhZGdlID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtdWx0aS1hdHRyLWJhZGdlJylcbiAgICAgIGV4cGVjdChiYWRnZSkudG9IYXZlQXR0cmlidXRlKCdpZCcsICdiYWRnZS0xMjMnKVxuICAgICAgZXhwZWN0KGJhZGdlKS50b0hhdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnU3RhdHVzIGluZGljYXRvcicpXG4gICAgICBleHBlY3QoYmFkZ2UpLnRvSGF2ZUF0dHJpYnV0ZSgndGl0bGUnLCAnQ3VycmVudCBzdGF0dXMnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0V2ZW50IGhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgeyBoYW5kbGVyOiAnb25DbGljaycsIHRyaWdnZXI6IGZpcmVFdmVudC5jbGljaywgbGFiZWw6ICdjbGljaycgfSxcbiAgICAgIHsgaGFuZGxlcjogJ29uTW91c2VFbnRlcicsIHRyaWdnZXI6IGZpcmVFdmVudC5tb3VzZUVudGVyLCBsYWJlbDogJ21vdXNlIGVudGVyJyB9LFxuICAgICAgeyBoYW5kbGVyOiAnb25Nb3VzZUxlYXZlJywgdHJpZ2dlcjogZmlyZUV2ZW50Lm1vdXNlTGVhdmUsIGxhYmVsOiAnbW91c2UgbGVhdmUnIH0sXG4gICAgXSkoJ3Nob3VsZCB0cmlnZ2VyICRoYW5kbGVyIHdoZW4gJGxhYmVsIG9jY3VycycsICh7IGhhbmRsZXIsIHRyaWdnZXIgfSkgPT4ge1xuICAgICAgY29uc3QgbW9ja0hhbmRsZXIgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEJhZGdlIHsuLi57IFtoYW5kbGVyXTogbW9ja0hhbmRsZXIgfX0+QmFkZ2U8L0JhZGdlPilcblxuICAgICAgdHJpZ2dlcihzY3JlZW4uZ2V0QnlUZXh0KCdCYWRnZScpKVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1c2VyIGludGVyYWN0aW9uIGZsb3cgd2l0aCBtdWx0aXBsZSBldmVudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVycyA9IHtcbiAgICAgICAgb25DbGljazogdmkuZm4oKSxcbiAgICAgICAgb25Nb3VzZUVudGVyOiB2aS5mbigpLFxuICAgICAgICBvbk1vdXNlTGVhdmU6IHZpLmZuKCksXG4gICAgICB9XG4gICAgICByZW5kZXIoPEJhZGdlIHsuLi5oYW5kbGVyc30+SW50ZXJhY3RpdmU8L0JhZGdlPilcblxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KCdJbnRlcmFjdGl2ZScpXG4gICAgICBmaXJlRXZlbnQubW91c2VFbnRlcihiYWRnZSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhiYWRnZSlcbiAgICAgIGZpcmVFdmVudC5tb3VzZUxlYXZlKGJhZGdlKVxuXG4gICAgICBleHBlY3QoaGFuZGxlcnMub25Nb3VzZUVudGVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChoYW5kbGVycy5vbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChoYW5kbGVycy5vbk1vdXNlTGVhdmUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgZXZlbnQgb2JqZWN0IHRvIGhhbmRsZXIgd2l0aCBjb3JyZWN0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8QmFkZ2Ugb25DbGljaz17aGFuZGxlQ2xpY2t9PkV2ZW50IEJhZGdlPC9CYWRnZT4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdFdmVudCBCYWRnZScpKVxuXG4gICAgICBleHBlY3QoaGFuZGxlQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgdHlwZTogJ2NsaWNrJyxcbiAgICAgIH0pKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvbWJpbmVkIHByb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IGFwcGx5IGFsbCBwcm9wcyB3aGVuIHVzZWQgdG9nZXRoZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxCYWRnZVxuICAgICAgICAgIHNpemU9XCJsXCJcbiAgICAgICAgICBzdGF0ZT17QmFkZ2VTdGF0ZS5XYXJuaW5nfVxuICAgICAgICAgIHVwcGVyY2FzZVxuICAgICAgICAgIGNsYXNzTmFtZT1cImN1c3RvbS1iYWRnZVwiXG4gICAgICAgICAgc3R5bGVDc3M9e3sgYmFja2dyb3VuZENvbG9yOiAncmdiKDAsIDAsIDI1NSknIH19XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjb21iaW5lZC1iYWRnZVwiXG4gICAgICAgID5cbiAgICAgICAgICBGdWxsIEZlYXR1cmVkXG4gICAgICAgIDwvQmFkZ2U+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBiYWRnZSA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY29tYmluZWQtYmFkZ2UnKVxuICAgICAgZXhwZWN0KGJhZGdlKS50b0hhdmVDbGFzcygnYmFkZ2UnLCAnYmFkZ2UtbCcsICdiYWRnZS13YXJuaW5nJywgJ3N5c3RlbS0yeHMtbWVkaXVtLXVwcGVyY2FzZScsICdjdXN0b20tYmFkZ2UnKVxuICAgICAgZXhwZWN0KGJhZGdlKS50b0hhdmVTdHlsZSh7IGJhY2tncm91bmRDb2xvcjogJ3JnYigwLCAwLCAyNTUpJyB9KVxuICAgICAgZXhwZWN0KGJhZGdlKS50b0hhdmVUZXh0Q29udGVudCgnRnVsbCBGZWF0dXJlZCcpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAge1xuICAgICAgICBwcm9wczogeyBzaXplOiAnbCcgYXMgY29uc3QsIHN0YXRlOiBCYWRnZVN0YXRlLkFjY2VudCB9LFxuICAgICAgICBleHBlY3RlZDogWydiYWRnZScsICdiYWRnZS1sJywgJ2JhZGdlLWFjY2VudCddLFxuICAgICAgICBsYWJlbDogJ3NpemUgYW5kIHN0YXRlIHZhcmlhbnRzJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHByb3BzOiB7IGljb25Pbmx5OiB0cnVlLCB1cHBlcmNhc2U6IHRydWUgfSxcbiAgICAgICAgZXhwZWN0ZWQ6IFsnYmFkZ2UnLCAnc3lzdGVtLTJ4cy1tZWRpdW0tdXBwZXJjYXNlJ10sXG4gICAgICAgIGxhYmVsOiAnaWNvbk9ubHkgYW5kIHVwcGVyY2FzZScsXG4gICAgICB9LFxuICAgIF0pKCdzaG91bGQgY29tYmluZSAkbGFiZWwgY29ycmVjdGx5JywgKHsgcHJvcHMsIGV4cGVjdGVkIH0pID0+IHtcbiAgICAgIHJlbmRlcig8QmFkZ2Ugey4uLnByb3BzfT5UZXN0PC9CYWRnZT4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0JykpLnRvSGF2ZUNsYXNzKC4uLmV4cGVjdGVkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBldmVudCBoYW5kbGVycyB3aXRoIGNvbWJpbmVkIHByb3BzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaGFuZGxlQ2xpY2sgPSB2aS5mbigpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxCYWRnZSBzaXplPVwic1wiIHN0YXRlPXtCYWRnZVN0YXRlLldhcm5pbmd9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSBjbGFzc05hbWU9XCJpbnRlcmFjdGl2ZVwiPlxuICAgICAgICAgIFRlc3RcbiAgICAgICAgPC9CYWRnZT4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGJhZGdlID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCcpXG4gICAgICBleHBlY3QoYmFkZ2UpLnRvSGF2ZUNsYXNzKCdiYWRnZScsICdiYWRnZS1zJywgJ2JhZGdlLXdhcm5pbmcnLCAnaW50ZXJhY3RpdmUnKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYmFkZ2UpXG4gICAgICBleHBlY3QoaGFuZGxlQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgY2FzZXMnLCAoKSA9PiB7XG4gICAgaXQuZWFjaChbXG4gICAgICB7IGNoaWxkcmVuOiA0MiwgdGV4dDogJzQyJywgbGFiZWw6ICdudW1lcmljIHZhbHVlJyB9LFxuICAgICAgeyBjaGlsZHJlbjogMCwgdGV4dDogJzAnLCBsYWJlbDogJ3plcm8nIH0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgJGxhYmVsIGNvcnJlY3RseScsICh7IGNoaWxkcmVuLCB0ZXh0IH0pID0+IHtcbiAgICAgIHJlbmRlcig8QmFkZ2U+e2NoaWxkcmVufTwvQmFkZ2U+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCh0ZXh0KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgY2hpbGRyZW46IG51bGwsIGxhYmVsOiAnbnVsbCcgfSxcbiAgICAgIHsgY2hpbGRyZW46IGZhbHNlLCBsYWJlbDogJ2Jvb2xlYW4gZmFsc2UnIH0sXG4gICAgXSkoJ3Nob3VsZCBoYW5kbGUgJGxhYmVsIGNoaWxkcmVuIHdpdGhvdXQgZXJyb3JzJywgKHsgY2hpbGRyZW4gfSkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QmFkZ2U+e2NoaWxkcmVufTwvQmFkZ2U+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdiYWRnZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbXBsZXggbmVzdGVkIGNvbnRlbnQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8QmFkZ2U+XG4gICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJpY29uXCI+8J+UlDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImNvdW50XCI+NTwvc3Bhbj5cbiAgICAgICAgPC9CYWRnZT4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY291bnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBtZXRhZGF0YSBhbmQgZXhwb3J0cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBkaXNwbGF5TmFtZSBmb3IgZGVidWdnaW5nJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KEJhZGdlLmRpc3BsYXlOYW1lKS50b0JlKCdCYWRnZScpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdCYWRnZVN0YXRlIGVudW0nLCAoKSA9PiB7XG4gICAgICBpdC5lYWNoKFtcbiAgICAgICAgeyBrZXk6ICdXYXJuaW5nJywgdmFsdWU6ICd3YXJuaW5nJyB9LFxuICAgICAgICB7IGtleTogJ0FjY2VudCcsIHZhbHVlOiAnYWNjZW50JyB9LFxuICAgICAgICB7IGtleTogJ0RlZmF1bHQnLCB2YWx1ZTogJycgfSxcbiAgICAgIF0pKCdzaG91bGQgZXhwb3J0ICRrZXkgc3RhdGUgd2l0aCB2YWx1ZSBcIiR2YWx1ZVwiJywgKHsga2V5LCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgIGV4cGVjdChCYWRnZVN0YXRlW2tleSBhcyBrZXlvZiB0eXBlb2YgQmFkZ2VTdGF0ZV0pLnRvQmUodmFsdWUpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQmFkZ2VWYXJpYW50cyB1dGlsaXR5JywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBiZSBhIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QodHlwZW9mIEJhZGdlVmFyaWFudHMpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZ2VuZXJhdGUgYmFzZSBiYWRnZSBjbGFzcyB3aXRoIGRlZmF1bHQgbWVkaXVtIHNpemUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IEJhZGdlVmFyaWFudHMoe30pXG5cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCdiYWRnZScpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbignYmFkZ2UtbScpXG4gICAgICB9KVxuXG4gICAgICBpdC5lYWNoKFtcbiAgICAgICAgeyBzaXplOiAncycgfSxcbiAgICAgICAgeyBzaXplOiAnbScgfSxcbiAgICAgICAgeyBzaXplOiAnbCcgfSxcbiAgICAgIF0gYXMgY29uc3QpKCdzaG91bGQgZ2VuZXJhdGUgY29ycmVjdCBjbGFzc2VzIGZvciBzaXplPSRzaXplJywgKHsgc2l6ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IEJhZGdlVmFyaWFudHMoeyBzaXplIH0pXG5cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCdiYWRnZScpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbihgYmFkZ2UtJHtzaXplfWApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19