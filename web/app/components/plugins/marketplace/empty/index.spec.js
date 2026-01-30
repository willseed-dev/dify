"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const index_1 = require("./index");
const line_1 = require("./line");
// ================================
// Mock external dependencies only
// ================================
// Mock i18n translation hook
vitest_1.vi.mock('#i18n', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            // Build full key with namespace prefix if provided
            const fullKey = options?.ns ? `${options.ns}.${key}` : key;
            const translations = {
                'plugin.marketplace.noPluginFound': 'No plugin found',
            };
            return translations[fullKey] || key;
        },
    }),
}));
// Mock useTheme hook with controllable theme value
let mockTheme = 'light';
vitest_1.vi.mock('@/hooks/use-theme', () => ({
    default: () => ({
        theme: mockTheme,
    }),
}));
// ================================
// Line Component Tests
// ================================
(0, vitest_1.describe)('Line', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockTheme = 'light';
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            (0, vitest_1.expect)(container.querySelector('svg')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render SVG element', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toBeInTheDocument();
            (0, vitest_1.expect)(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
        });
    });
    // ================================
    // Light Theme Tests
    // ================================
    (0, vitest_1.describe)('Light Theme', () => {
        (0, vitest_1.beforeEach)(() => {
            mockTheme = 'light';
        });
        (0, vitest_1.it)('should render light mode SVG', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toHaveAttribute('width', '2');
            (0, vitest_1.expect)(svg).toHaveAttribute('height', '241');
            (0, vitest_1.expect)(svg).toHaveAttribute('viewBox', '0 0 2 241');
        });
        (0, vitest_1.it)('should render light mode path with correct d attribute', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const path = container.querySelector('path');
            (0, vitest_1.expect)(path).toHaveAttribute('d', 'M1 0.5L1 240.5');
        });
        (0, vitest_1.it)('should render light mode linear gradient with correct id', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const gradient = container.querySelector('#paint0_linear_1989_74474');
            (0, vitest_1.expect)(gradient).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render light mode gradient with white stop colors', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const stops = container.querySelectorAll('stop');
            (0, vitest_1.expect)(stops.length).toBe(3);
            // First stop - white with 0.01 opacity
            (0, vitest_1.expect)(stops[0]).toHaveAttribute('stop-color', 'white');
            (0, vitest_1.expect)(stops[0]).toHaveAttribute('stop-opacity', '0.01');
            // Middle stop - dark color with 0.08 opacity
            (0, vitest_1.expect)(stops[1]).toHaveAttribute('stop-color', '#101828');
            (0, vitest_1.expect)(stops[1]).toHaveAttribute('stop-opacity', '0.08');
            // Last stop - white with 0.01 opacity
            (0, vitest_1.expect)(stops[2]).toHaveAttribute('stop-color', 'white');
            (0, vitest_1.expect)(stops[2]).toHaveAttribute('stop-opacity', '0.01');
        });
        (0, vitest_1.it)('should apply className to SVG in light mode', () => {
            const { container } = (0, react_1.render)(<line_1.default className="test-class"/>);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toHaveClass('test-class');
        });
    });
    // ================================
    // Dark Theme Tests
    // ================================
    (0, vitest_1.describe)('Dark Theme', () => {
        (0, vitest_1.beforeEach)(() => {
            mockTheme = 'dark';
        });
        (0, vitest_1.it)('should render dark mode SVG', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toHaveAttribute('width', '2');
            (0, vitest_1.expect)(svg).toHaveAttribute('height', '240');
            (0, vitest_1.expect)(svg).toHaveAttribute('viewBox', '0 0 2 240');
        });
        (0, vitest_1.it)('should render dark mode path with correct d attribute', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const path = container.querySelector('path');
            (0, vitest_1.expect)(path).toHaveAttribute('d', 'M1 0L1 240');
        });
        (0, vitest_1.it)('should render dark mode linear gradient with correct id', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const gradient = container.querySelector('#paint0_linear_6295_52176');
            (0, vitest_1.expect)(gradient).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render dark mode gradient stops', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const stops = container.querySelectorAll('stop');
            (0, vitest_1.expect)(stops.length).toBe(3);
            // First stop - no color, 0.01 opacity
            (0, vitest_1.expect)(stops[0]).toHaveAttribute('stop-opacity', '0.01');
            // Middle stop - light color with 0.14 opacity
            (0, vitest_1.expect)(stops[1]).toHaveAttribute('stop-color', '#C8CEDA');
            (0, vitest_1.expect)(stops[1]).toHaveAttribute('stop-opacity', '0.14');
            // Last stop - no color, 0.01 opacity
            (0, vitest_1.expect)(stops[2]).toHaveAttribute('stop-opacity', '0.01');
        });
        (0, vitest_1.it)('should apply className to SVG in dark mode', () => {
            const { container } = (0, react_1.render)(<line_1.default className="dark-test-class"/>);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toHaveClass('dark-test-class');
        });
    });
    // ================================
    // Props Variations Tests
    // ================================
    (0, vitest_1.describe)('Props Variations', () => {
        (0, vitest_1.it)('should handle undefined className', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty string className', () => {
            const { container } = (0, react_1.render)(<line_1.default className=""/>);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle multiple class names', () => {
            const { container } = (0, react_1.render)(<line_1.default className="class-1 class-2 class-3"/>);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toHaveClass('class-1');
            (0, vitest_1.expect)(svg).toHaveClass('class-2');
            (0, vitest_1.expect)(svg).toHaveClass('class-3');
        });
        (0, vitest_1.it)('should handle Tailwind utility classes', () => {
            const { container } = (0, react_1.render)(<line_1.default className="absolute right-[-1px] top-1/2 -translate-y-1/2"/>);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toHaveClass('absolute');
            (0, vitest_1.expect)(svg).toHaveClass('right-[-1px]');
            (0, vitest_1.expect)(svg).toHaveClass('top-1/2');
            (0, vitest_1.expect)(svg).toHaveClass('-translate-y-1/2');
        });
    });
    // ================================
    // Theme Switching Tests
    // ================================
    (0, vitest_1.describe)('Theme Switching', () => {
        (0, vitest_1.it)('should render different SVG dimensions based on theme', () => {
            // Light mode
            mockTheme = 'light';
            const { container: lightContainer, unmount: unmountLight } = (0, react_1.render)(<line_1.default />);
            (0, vitest_1.expect)(lightContainer.querySelector('svg')).toHaveAttribute('height', '241');
            unmountLight();
            // Dark mode
            mockTheme = 'dark';
            const { container: darkContainer } = (0, react_1.render)(<line_1.default />);
            (0, vitest_1.expect)(darkContainer.querySelector('svg')).toHaveAttribute('height', '240');
        });
        (0, vitest_1.it)('should use different gradient IDs based on theme', () => {
            // Light mode
            mockTheme = 'light';
            const { container: lightContainer, unmount: unmountLight } = (0, react_1.render)(<line_1.default />);
            (0, vitest_1.expect)(lightContainer.querySelector('#paint0_linear_1989_74474')).toBeInTheDocument();
            (0, vitest_1.expect)(lightContainer.querySelector('#paint0_linear_6295_52176')).not.toBeInTheDocument();
            unmountLight();
            // Dark mode
            mockTheme = 'dark';
            const { container: darkContainer } = (0, react_1.render)(<line_1.default />);
            (0, vitest_1.expect)(darkContainer.querySelector('#paint0_linear_6295_52176')).toBeInTheDocument();
            (0, vitest_1.expect)(darkContainer.querySelector('#paint0_linear_1989_74474')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle theme value of light explicitly', () => {
            mockTheme = 'light';
            const { container } = (0, react_1.render)(<line_1.default />);
            (0, vitest_1.expect)(container.querySelector('#paint0_linear_1989_74474')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle non-dark theme as light mode', () => {
            mockTheme = 'system';
            const { container } = (0, react_1.render)(<line_1.default />);
            // Non-dark themes should use light mode SVG
            (0, vitest_1.expect)(container.querySelector('svg')).toHaveAttribute('height', '241');
        });
        (0, vitest_1.it)('should render SVG with fill none', () => {
            const { container } = (0, react_1.render)(<line_1.default />);
            const svg = container.querySelector('svg');
            (0, vitest_1.expect)(svg).toHaveAttribute('fill', 'none');
        });
        (0, vitest_1.it)('should render path with gradient stroke', () => {
            mockTheme = 'light';
            const { container } = (0, react_1.render)(<line_1.default />);
            const path = container.querySelector('path');
            (0, vitest_1.expect)(path).toHaveAttribute('stroke', 'url(#paint0_linear_1989_74474)');
        });
        (0, vitest_1.it)('should render dark mode path with gradient stroke', () => {
            mockTheme = 'dark';
            const { container } = (0, react_1.render)(<line_1.default />);
            const path = container.querySelector('path');
            (0, vitest_1.expect)(path).toHaveAttribute('stroke', 'url(#paint0_linear_6295_52176)');
        });
    });
});
// ================================
// Empty Component Tests
// ================================
(0, vitest_1.describe)('Empty', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockTheme = 'light';
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render 16 placeholder cards', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const placeholderCards = container.querySelectorAll('.h-\\[144px\\]');
            (0, vitest_1.expect)(placeholderCards.length).toBe(16);
        });
        (0, vitest_1.it)('should render default no plugin found text', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('No plugin found')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Group icon', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            // Icon wrapper should be present
            const iconWrapper = container.querySelector('.h-14.w-14');
            (0, vitest_1.expect)(iconWrapper).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render four Line components around the icon', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            // Four SVG elements from Line components + 1 Group icon SVG = 5 total
            const svgs = container.querySelectorAll('svg');
            (0, vitest_1.expect)(svgs.length).toBe(5);
        });
        (0, vitest_1.it)('should render center content with absolute positioning', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const centerContent = container.querySelector('.absolute.left-1\\/2.top-1\\/2');
            (0, vitest_1.expect)(centerContent).toBeInTheDocument();
        });
    });
    // ================================
    // Text Prop Tests
    // ================================
    (0, vitest_1.describe)('Text Prop', () => {
        (0, vitest_1.it)('should render custom text when provided', () => {
            (0, react_1.render)(<index_1.default text="Custom empty message"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Custom empty message')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('No plugin found')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render default translation when text is empty string', () => {
            (0, react_1.render)(<index_1.default text=""/>);
            (0, vitest_1.expect)(react_1.screen.getByText('No plugin found')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render default translation when text is undefined', () => {
            (0, react_1.render)(<index_1.default text={undefined}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('No plugin found')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render long custom text', () => {
            const longText = 'This is a very long message that describes why there are no plugins found in the current search results and what the user might want to do next to find what they are looking for';
            (0, react_1.render)(<index_1.default text={longText}/>);
            (0, vitest_1.expect)(react_1.screen.getByText(longText)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render text with special characters', () => {
            (0, react_1.render)(<index_1.default text="No plugins found for query: <search>"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('No plugins found for query: <search>')).toBeInTheDocument();
        });
    });
    // ================================
    // LightCard Prop Tests
    // ================================
    (0, vitest_1.describe)('LightCard Prop', () => {
        (0, vitest_1.it)('should render overlay when lightCard is false', () => {
            const { container } = (0, react_1.render)(<index_1.default lightCard={false}/>);
            const overlay = container.querySelector('.bg-marketplace-plugin-empty');
            (0, vitest_1.expect)(overlay).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render overlay when lightCard is true', () => {
            const { container } = (0, react_1.render)(<index_1.default lightCard/>);
            const overlay = container.querySelector('.bg-marketplace-plugin-empty');
            (0, vitest_1.expect)(overlay).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render overlay by default when lightCard is undefined', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const overlay = container.querySelector('.bg-marketplace-plugin-empty');
            (0, vitest_1.expect)(overlay).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply light card styling to placeholder cards when lightCard is true', () => {
            const { container } = (0, react_1.render)(<index_1.default lightCard/>);
            const placeholderCards = container.querySelectorAll('.bg-background-default-lighter');
            (0, vitest_1.expect)(placeholderCards.length).toBe(16);
        });
        (0, vitest_1.it)('should apply default styling to placeholder cards when lightCard is false', () => {
            const { container } = (0, react_1.render)(<index_1.default lightCard={false}/>);
            const placeholderCards = container.querySelectorAll('.bg-background-section-burn');
            (0, vitest_1.expect)(placeholderCards.length).toBe(16);
        });
        (0, vitest_1.it)('should apply opacity to light card placeholder', () => {
            const { container } = (0, react_1.render)(<index_1.default lightCard/>);
            const placeholderCards = container.querySelectorAll('.opacity-75');
            (0, vitest_1.expect)(placeholderCards.length).toBe(16);
        });
    });
    // ================================
    // ClassName Prop Tests
    // ================================
    (0, vitest_1.describe)('ClassName Prop', () => {
        (0, vitest_1.it)('should apply custom className to container', () => {
            const { container } = (0, react_1.render)(<index_1.default className="custom-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should preserve base classes when adding custom className', () => {
            const { container } = (0, react_1.render)(<index_1.default className="custom-class"/>);
            const element = container.querySelector('.custom-class');
            (0, vitest_1.expect)(element).toHaveClass('relative');
            (0, vitest_1.expect)(element).toHaveClass('flex');
            (0, vitest_1.expect)(element).toHaveClass('h-0');
            (0, vitest_1.expect)(element).toHaveClass('grow');
        });
        (0, vitest_1.it)('should handle empty string className', () => {
            const { container } = (0, react_1.render)(<index_1.default className=""/>);
            (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined className', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const element = container.firstChild;
            (0, vitest_1.expect)(element).toHaveClass('relative');
        });
        (0, vitest_1.it)('should handle multiple custom classes', () => {
            const { container } = (0, react_1.render)(<index_1.default className="class-a class-b class-c"/>);
            const element = container.querySelector('.class-a');
            (0, vitest_1.expect)(element).toHaveClass('class-b');
            (0, vitest_1.expect)(element).toHaveClass('class-c');
        });
    });
    // ================================
    // Placeholder Cards Layout Tests
    // ================================
    (0, vitest_1.describe)('Placeholder Cards Layout', () => {
        (0, vitest_1.it)('should remove right margin on every 4th card', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const cards = container.querySelectorAll('.h-\\[144px\\]');
            // Cards at indices 3, 7, 11, 15 (4th, 8th, 12th, 16th) should have mr-0
            (0, vitest_1.expect)(cards[3]).toHaveClass('mr-0');
            (0, vitest_1.expect)(cards[7]).toHaveClass('mr-0');
            (0, vitest_1.expect)(cards[11]).toHaveClass('mr-0');
            (0, vitest_1.expect)(cards[15]).toHaveClass('mr-0');
        });
        (0, vitest_1.it)('should have margin on cards that are not at the end of row', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const cards = container.querySelectorAll('.h-\\[144px\\]');
            // Cards not at row end should have mr-3
            (0, vitest_1.expect)(cards[0]).toHaveClass('mr-3');
            (0, vitest_1.expect)(cards[1]).toHaveClass('mr-3');
            (0, vitest_1.expect)(cards[2]).toHaveClass('mr-3');
        });
        (0, vitest_1.it)('should remove bottom margin on last row cards', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const cards = container.querySelectorAll('.h-\\[144px\\]');
            // Cards at indices 12, 13, 14, 15 should have mb-0
            (0, vitest_1.expect)(cards[12]).toHaveClass('mb-0');
            (0, vitest_1.expect)(cards[13]).toHaveClass('mb-0');
            (0, vitest_1.expect)(cards[14]).toHaveClass('mb-0');
            (0, vitest_1.expect)(cards[15]).toHaveClass('mb-0');
        });
        (0, vitest_1.it)('should have bottom margin on non-last row cards', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const cards = container.querySelectorAll('.h-\\[144px\\]');
            // Cards at indices 0-11 should have mb-3
            (0, vitest_1.expect)(cards[0]).toHaveClass('mb-3');
            (0, vitest_1.expect)(cards[5]).toHaveClass('mb-3');
            (0, vitest_1.expect)(cards[11]).toHaveClass('mb-3');
        });
        (0, vitest_1.it)('should have correct width calculation for 4 columns', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const cards = container.querySelectorAll('.w-\\[calc\\(\\(100\\%-36px\\)\\/4\\)\\]');
            (0, vitest_1.expect)(cards.length).toBe(16);
        });
        (0, vitest_1.it)('should have rounded corners on cards', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const cards = container.querySelectorAll('.rounded-xl');
            // 16 cards + 1 icon wrapper = 17 rounded-xl elements
            (0, vitest_1.expect)(cards.length).toBeGreaterThanOrEqual(16);
        });
    });
    // ================================
    // Icon Container Tests
    // ================================
    (0, vitest_1.describe)('Icon Container', () => {
        (0, vitest_1.it)('should render icon container with border', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const iconContainer = container.querySelector('.border-dashed');
            (0, vitest_1.expect)(iconContainer).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render icon container with shadow', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const iconContainer = container.querySelector('.shadow-lg');
            (0, vitest_1.expect)(iconContainer).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render icon container centered', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const centerWrapper = container.querySelector('.-translate-x-1\\/2.-translate-y-1\\/2');
            (0, vitest_1.expect)(centerWrapper).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have z-index for center content', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const centerContent = container.querySelector('.z-\\[2\\]');
            (0, vitest_1.expect)(centerContent).toBeInTheDocument();
        });
    });
    // ================================
    // Line Positioning Tests
    // ================================
    (0, vitest_1.describe)('Line Positioning', () => {
        (0, vitest_1.it)('should position Line components correctly around icon', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            // Right line
            const rightLine = container.querySelector('.right-\\[-1px\\]');
            (0, vitest_1.expect)(rightLine).toBeInTheDocument();
            // Left line
            const leftLine = container.querySelector('.left-\\[-1px\\]');
            (0, vitest_1.expect)(leftLine).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have rotated Line components for top and bottom', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const rotatedLines = container.querySelectorAll('.rotate-90');
            (0, vitest_1.expect)(rotatedLines.length).toBe(2);
        });
    });
    // ================================
    // Combined Props Tests
    // ================================
    (0, vitest_1.describe)('Combined Props', () => {
        (0, vitest_1.it)('should handle all props together', () => {
            const { container } = (0, react_1.render)(<index_1.default text="Custom message" lightCard className="custom-wrapper"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Custom message')).toBeInTheDocument();
            (0, vitest_1.expect)(container.querySelector('.custom-wrapper')).toBeInTheDocument();
            (0, vitest_1.expect)(container.querySelector('.bg-marketplace-plugin-empty')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render correctly with lightCard false and custom text', () => {
            const { container } = (0, react_1.render)(<index_1.default text="No results" lightCard={false}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('No results')).toBeInTheDocument();
            (0, vitest_1.expect)(container.querySelector('.bg-marketplace-plugin-empty')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle className with lightCard prop', () => {
            const { container } = (0, react_1.render)(<index_1.default className="test-class" lightCard/>);
            const element = container.querySelector('.test-class');
            (0, vitest_1.expect)(element).toBeInTheDocument();
            // Verify light card styling is applied
            const lightCards = container.querySelectorAll('.bg-background-default-lighter');
            (0, vitest_1.expect)(lightCards.length).toBe(16);
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty props object', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('No plugin found')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with only text prop', () => {
            (0, react_1.render)(<index_1.default text="Only text"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Only text')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with only lightCard prop', () => {
            const { container } = (0, react_1.render)(<index_1.default lightCard/>);
            (0, vitest_1.expect)(container.querySelector('.bg-marketplace-plugin-empty')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with only className prop', () => {
            const { container } = (0, react_1.render)(<index_1.default className="only-class"/>);
            (0, vitest_1.expect)(container.querySelector('.only-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle text with unicode characters', () => {
            (0, react_1.render)(<index_1.default text="没有找到插件 🔍"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('没有找到插件 🔍')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle text with HTML entities', () => {
            (0, react_1.render)(<index_1.default text="No plugins &amp; no results"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('No plugins & no results')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle whitespace-only text', () => {
            const { container } = (0, react_1.render)(<index_1.default text="   "/>);
            // Whitespace-only text is truthy, so it should be rendered
            const textContainer = container.querySelector('.system-md-regular');
            (0, vitest_1.expect)(textContainer).toBeInTheDocument();
            (0, vitest_1.expect)(textContainer?.textContent).toBe('   ');
        });
    });
    // ================================
    // Accessibility Tests
    // ================================
    (0, vitest_1.describe)('Accessibility', () => {
        (0, vitest_1.it)('should have text content visible', () => {
            (0, react_1.render)(<index_1.default text="No plugins available"/>);
            const textElement = react_1.screen.getByText('No plugins available');
            (0, vitest_1.expect)(textElement).toBeVisible();
        });
        (0, vitest_1.it)('should render text in proper container', () => {
            const { container } = (0, react_1.render)(<index_1.default text="Test message"/>);
            const textContainer = container.querySelector('.system-md-regular');
            (0, vitest_1.expect)(textContainer).toBeInTheDocument();
            (0, vitest_1.expect)(textContainer).toHaveTextContent('Test message');
        });
        (0, vitest_1.it)('should center text content', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const textContainer = container.querySelector('.text-center');
            (0, vitest_1.expect)(textContainer).toBeInTheDocument();
        });
    });
    // ================================
    // Overlay Tests
    // ================================
    (0, vitest_1.describe)('Overlay', () => {
        (0, vitest_1.it)('should render overlay with correct z-index', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const overlay = container.querySelector('.z-\\[1\\]');
            (0, vitest_1.expect)(overlay).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render overlay with full coverage', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const overlay = container.querySelector('.inset-0');
            (0, vitest_1.expect)(overlay).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render overlay when lightCard is true', () => {
            const { container } = (0, react_1.render)(<index_1.default lightCard/>);
            const overlay = container.querySelector('.inset-0.z-\\[1\\]');
            (0, vitest_1.expect)(overlay).not.toBeInTheDocument();
        });
    });
});
// ================================
// Integration Tests
// ================================
(0, vitest_1.describe)('Empty and Line Integration', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockTheme = 'light';
    });
    (0, vitest_1.it)('should render Line components with correct theme in Empty', () => {
        const { container } = (0, react_1.render)(<index_1.default />);
        // In light mode, should use light gradient ID
        const lightGradients = container.querySelectorAll('#paint0_linear_1989_74474');
        (0, vitest_1.expect)(lightGradients.length).toBe(4);
    });
    (0, vitest_1.it)('should render Line components with dark theme in Empty', () => {
        mockTheme = 'dark';
        const { container } = (0, react_1.render)(<index_1.default />);
        // In dark mode, should use dark gradient ID
        const darkGradients = container.querySelectorAll('#paint0_linear_6295_52176');
        (0, vitest_1.expect)(darkGradients.length).toBe(4);
    });
    (0, vitest_1.it)('should apply positioning classes to Line components', () => {
        const { container } = (0, react_1.render)(<index_1.default />);
        // Check for Line positioning classes
        (0, vitest_1.expect)(container.querySelector('.right-\\[-1px\\]')).toBeInTheDocument();
        (0, vitest_1.expect)(container.querySelector('.left-\\[-1px\\]')).toBeInTheDocument();
        (0, vitest_1.expect)(container.querySelectorAll('.rotate-90').length).toBe(2);
    });
    (0, vitest_1.it)('should render complete Empty component structure', () => {
        const { container } = (0, react_1.render)(<index_1.default text="Test" lightCard className="test"/>);
        // Container
        (0, vitest_1.expect)(container.querySelector('.test')).toBeInTheDocument();
        // Placeholder cards
        (0, vitest_1.expect)(container.querySelectorAll('.h-\\[144px\\]').length).toBe(16);
        // Icon container
        (0, vitest_1.expect)(container.querySelector('.h-14.w-14')).toBeInTheDocument();
        // Line components (4) + Group icon (1) = 5 SVGs total
        (0, vitest_1.expect)(container.querySelectorAll('svg').length).toBe(5);
        // Text
        (0, vitest_1.expect)(react_1.screen.getByText('Test')).toBeInTheDocument();
        // No overlay for lightCard
        (0, vitest_1.expect)(container.querySelector('.bg-marketplace-plugin-empty')).not.toBeInTheDocument();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXVEO0FBQ3ZELG1DQUE2RDtBQUM3RCxtQ0FBMkI7QUFDM0IsaUNBQXlCO0FBRXpCLG1DQUFtQztBQUNuQyxrQ0FBa0M7QUFDbEMsbUNBQW1DO0FBRW5DLDZCQUE2QjtBQUM3QixXQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RCLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQVcsRUFBRSxPQUF5QixFQUFFLEVBQUU7WUFDNUMsbURBQW1EO1lBQ25ELE1BQU0sT0FBTyxHQUFHLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO1lBQzFELE1BQU0sWUFBWSxHQUEyQjtnQkFDM0Msa0NBQWtDLEVBQUUsaUJBQWlCO2FBQ3RELENBQUE7WUFDRCxPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUE7UUFDckMsQ0FBQztLQUNGLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILG1EQUFtRDtBQUNuRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUE7QUFFdkIsV0FBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2QsS0FBSyxFQUFFLFNBQVM7S0FDakIsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsbUNBQW1DO0FBQ25DLHVCQUF1QjtBQUN2QixtQ0FBbUM7QUFDbkMsSUFBQSxpQkFBUSxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDcEIsSUFBQSxtQkFB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QUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUVwRCwyQkFBMkI7UUFDM0IsSUFBQSxlQUFNLEVBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFDekYsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCBFbXB0eSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IExpbmUgZnJvbSAnLi9saW5lJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXMgb25seVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBpMThuIHRyYW5zbGF0aW9uIGhvb2tcbnZpLm1vY2soJyNpMThuJywgKCkgPT4gKHtcbiAgdXNlVHJhbnNsYXRpb246ICgpID0+ICh7XG4gICAgdDogKGtleTogc3RyaW5nLCBvcHRpb25zPzogeyBucz86IHN0cmluZyB9KSA9PiB7XG4gICAgICAvLyBCdWlsZCBmdWxsIGtleSB3aXRoIG5hbWVzcGFjZSBwcmVmaXggaWYgcHJvdmlkZWRcbiAgICAgIGNvbnN0IGZ1bGxLZXkgPSBvcHRpb25zPy5ucyA/IGAke29wdGlvbnMubnN9LiR7a2V5fWAgOiBrZXlcbiAgICAgIGNvbnN0IHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgJ3BsdWdpbi5tYXJrZXRwbGFjZS5ub1BsdWdpbkZvdW5kJzogJ05vIHBsdWdpbiBmb3VuZCcsXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJhbnNsYXRpb25zW2Z1bGxLZXldIHx8IGtleVxuICAgIH0sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgdXNlVGhlbWUgaG9vayB3aXRoIGNvbnRyb2xsYWJsZSB0aGVtZSB2YWx1ZVxubGV0IG1vY2tUaGVtZSA9ICdsaWdodCdcblxudmkubW9jaygnQC9ob29rcy91c2UtdGhlbWUnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoe1xuICAgIHRoZW1lOiBtb2NrVGhlbWUsXG4gIH0pLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBMaW5lIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdMaW5lJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrVGhlbWUgPSAnbGlnaHQnXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpbmUgLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgU1ZHIGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMaW5lIC8+KVxuXG4gICAgICBjb25zdCBzdmcgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzdmcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzdmcpLnRvSGF2ZUF0dHJpYnV0ZSgneG1sbnMnLCAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTGlnaHQgVGhlbWUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0xpZ2h0IFRoZW1lJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbW9ja1RoZW1lID0gJ2xpZ2h0J1xuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsaWdodCBtb2RlIFNWRycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpbmUgLz4pXG5cbiAgICAgIGNvbnN0IHN2ZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2ZykudG9IYXZlQXR0cmlidXRlKCd3aWR0aCcsICcyJylcbiAgICAgIGV4cGVjdChzdmcpLnRvSGF2ZUF0dHJpYnV0ZSgnaGVpZ2h0JywgJzI0MScpXG4gICAgICBleHBlY3Qoc3ZnKS50b0hhdmVBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIgMjQxJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbGlnaHQgbW9kZSBwYXRoIHdpdGggY29ycmVjdCBkIGF0dHJpYnV0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpbmUgLz4pXG5cbiAgICAgIGNvbnN0IHBhdGggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcigncGF0aCcpXG4gICAgICBleHBlY3QocGF0aCkudG9IYXZlQXR0cmlidXRlKCdkJywgJ00xIDAuNUwxIDI0MC41JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbGlnaHQgbW9kZSBsaW5lYXIgZ3JhZGllbnQgd2l0aCBjb3JyZWN0IGlkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGluZSAvPilcblxuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignI3BhaW50MF9saW5lYXJfMTk4OV83NDQ3NCcpXG4gICAgICBleHBlY3QoZ3JhZGllbnQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbGlnaHQgbW9kZSBncmFkaWVudCB3aXRoIHdoaXRlIHN0b3AgY29sb3JzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGluZSAvPilcblxuICAgICAgY29uc3Qgc3RvcHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc3RvcCcpXG4gICAgICBleHBlY3Qoc3RvcHMubGVuZ3RoKS50b0JlKDMpXG5cbiAgICAgIC8vIEZpcnN0IHN0b3AgLSB3aGl0ZSB3aXRoIDAuMDEgb3BhY2l0eVxuICAgICAgZXhwZWN0KHN0b3BzWzBdKS50b0hhdmVBdHRyaWJ1dGUoJ3N0b3AtY29sb3InLCAnd2hpdGUnKVxuICAgICAgZXhwZWN0KHN0b3BzWzBdKS50b0hhdmVBdHRyaWJ1dGUoJ3N0b3Atb3BhY2l0eScsICcwLjAxJylcblxuICAgICAgLy8gTWlkZGxlIHN0b3AgLSBkYXJrIGNvbG9yIHdpdGggMC4wOCBvcGFjaXR5XG4gICAgICBleHBlY3Qoc3RvcHNbMV0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3RvcC1jb2xvcicsICcjMTAxODI4JylcbiAgICAgIGV4cGVjdChzdG9wc1sxXSkudG9IYXZlQXR0cmlidXRlKCdzdG9wLW9wYWNpdHknLCAnMC4wOCcpXG5cbiAgICAgIC8vIExhc3Qgc3RvcCAtIHdoaXRlIHdpdGggMC4wMSBvcGFjaXR5XG4gICAgICBleHBlY3Qoc3RvcHNbMl0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3RvcC1jb2xvcicsICd3aGl0ZScpXG4gICAgICBleHBlY3Qoc3RvcHNbMl0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3RvcC1vcGFjaXR5JywgJzAuMDEnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNsYXNzTmFtZSB0byBTVkcgaW4gbGlnaHQgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpbmUgY2xhc3NOYW1lPVwidGVzdC1jbGFzc1wiIC8+KVxuXG4gICAgICBjb25zdCBzdmcgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzdmcpLnRvSGF2ZUNsYXNzKCd0ZXN0LWNsYXNzJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIERhcmsgVGhlbWUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0RhcmsgVGhlbWUnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBtb2NrVGhlbWUgPSAnZGFyaydcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGFyayBtb2RlIFNWRycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpbmUgLz4pXG5cbiAgICAgIGNvbnN0IHN2ZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2ZykudG9IYXZlQXR0cmlidXRlKCd3aWR0aCcsICcyJylcbiAgICAgIGV4cGVjdChzdmcpLnRvSGF2ZUF0dHJpYnV0ZSgnaGVpZ2h0JywgJzI0MCcpXG4gICAgICBleHBlY3Qoc3ZnKS50b0hhdmVBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIgMjQwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGFyayBtb2RlIHBhdGggd2l0aCBjb3JyZWN0IGQgYXR0cmlidXRlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGluZSAvPilcblxuICAgICAgY29uc3QgcGF0aCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdwYXRoJylcbiAgICAgIGV4cGVjdChwYXRoKS50b0hhdmVBdHRyaWJ1dGUoJ2QnLCAnTTEgMEwxIDI0MCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRhcmsgbW9kZSBsaW5lYXIgZ3JhZGllbnQgd2l0aCBjb3JyZWN0IGlkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGluZSAvPilcblxuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignI3BhaW50MF9saW5lYXJfNjI5NV81MjE3NicpXG4gICAgICBleHBlY3QoZ3JhZGllbnQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGFyayBtb2RlIGdyYWRpZW50IHN0b3BzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGluZSAvPilcblxuICAgICAgY29uc3Qgc3RvcHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc3RvcCcpXG4gICAgICBleHBlY3Qoc3RvcHMubGVuZ3RoKS50b0JlKDMpXG5cbiAgICAgIC8vIEZpcnN0IHN0b3AgLSBubyBjb2xvciwgMC4wMSBvcGFjaXR5XG4gICAgICBleHBlY3Qoc3RvcHNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3RvcC1vcGFjaXR5JywgJzAuMDEnKVxuXG4gICAgICAvLyBNaWRkbGUgc3RvcCAtIGxpZ2h0IGNvbG9yIHdpdGggMC4xNCBvcGFjaXR5XG4gICAgICBleHBlY3Qoc3RvcHNbMV0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3RvcC1jb2xvcicsICcjQzhDRURBJylcbiAgICAgIGV4cGVjdChzdG9wc1sxXSkudG9IYXZlQXR0cmlidXRlKCdzdG9wLW9wYWNpdHknLCAnMC4xNCcpXG5cbiAgICAgIC8vIExhc3Qgc3RvcCAtIG5vIGNvbG9yLCAwLjAxIG9wYWNpdHlcbiAgICAgIGV4cGVjdChzdG9wc1syXSkudG9IYXZlQXR0cmlidXRlKCdzdG9wLW9wYWNpdHknLCAnMC4wMScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY2xhc3NOYW1lIHRvIFNWRyBpbiBkYXJrIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMaW5lIGNsYXNzTmFtZT1cImRhcmstdGVzdC1jbGFzc1wiIC8+KVxuXG4gICAgICBjb25zdCBzdmcgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzdmcpLnRvSGF2ZUNsYXNzKCdkYXJrLXRlc3QtY2xhc3MnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgY2xhc3NOYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGluZSAvPilcblxuICAgICAgY29uc3Qgc3ZnID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3Qoc3ZnKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMaW5lIGNsYXNzTmFtZT1cIlwiIC8+KVxuXG4gICAgICBjb25zdCBzdmcgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzdmcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgY2xhc3MgbmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMaW5lIGNsYXNzTmFtZT1cImNsYXNzLTEgY2xhc3MtMiBjbGFzcy0zXCIgLz4pXG5cbiAgICAgIGNvbnN0IHN2ZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2ZykudG9IYXZlQ2xhc3MoJ2NsYXNzLTEnKVxuICAgICAgZXhwZWN0KHN2ZykudG9IYXZlQ2xhc3MoJ2NsYXNzLTInKVxuICAgICAgZXhwZWN0KHN2ZykudG9IYXZlQ2xhc3MoJ2NsYXNzLTMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBUYWlsd2luZCB1dGlsaXR5IGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8TGluZSBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC1bLTFweF0gdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yXCIgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHN2ZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2ZykudG9IYXZlQ2xhc3MoJ2Fic29sdXRlJylcbiAgICAgIGV4cGVjdChzdmcpLnRvSGF2ZUNsYXNzKCdyaWdodC1bLTFweF0nKVxuICAgICAgZXhwZWN0KHN2ZykudG9IYXZlQ2xhc3MoJ3RvcC0xLzInKVxuICAgICAgZXhwZWN0KHN2ZykudG9IYXZlQ2xhc3MoJy10cmFuc2xhdGUteS0xLzInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGhlbWUgU3dpdGNoaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdUaGVtZSBTd2l0Y2hpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGlmZmVyZW50IFNWRyBkaW1lbnNpb25zIGJhc2VkIG9uIHRoZW1lJywgKCkgPT4ge1xuICAgICAgLy8gTGlnaHQgbW9kZVxuICAgICAgbW9ja1RoZW1lID0gJ2xpZ2h0J1xuICAgICAgY29uc3QgeyBjb250YWluZXI6IGxpZ2h0Q29udGFpbmVyLCB1bm1vdW50OiB1bm1vdW50TGlnaHQgfSA9IHJlbmRlcig8TGluZSAvPilcbiAgICAgIGV4cGVjdChsaWdodENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKSkudG9IYXZlQXR0cmlidXRlKCdoZWlnaHQnLCAnMjQxJylcbiAgICAgIHVubW91bnRMaWdodCgpXG5cbiAgICAgIC8vIERhcmsgbW9kZVxuICAgICAgbW9ja1RoZW1lID0gJ2RhcmsnXG4gICAgICBjb25zdCB7IGNvbnRhaW5lcjogZGFya0NvbnRhaW5lciB9ID0gcmVuZGVyKDxMaW5lIC8+KVxuICAgICAgZXhwZWN0KGRhcmtDb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvSGF2ZUF0dHJpYnV0ZSgnaGVpZ2h0JywgJzI0MCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGRpZmZlcmVudCBncmFkaWVudCBJRHMgYmFzZWQgb24gdGhlbWUnLCAoKSA9PiB7XG4gICAgICAvLyBMaWdodCBtb2RlXG4gICAgICBtb2NrVGhlbWUgPSAnbGlnaHQnXG4gICAgICBjb25zdCB7IGNvbnRhaW5lcjogbGlnaHRDb250YWluZXIsIHVubW91bnQ6IHVubW91bnRMaWdodCB9ID0gcmVuZGVyKDxMaW5lIC8+KVxuICAgICAgZXhwZWN0KGxpZ2h0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNwYWludDBfbGluZWFyXzE5ODlfNzQ0NzQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGxpZ2h0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNwYWludDBfbGluZWFyXzYyOTVfNTIxNzYnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIHVubW91bnRMaWdodCgpXG5cbiAgICAgIC8vIERhcmsgbW9kZVxuICAgICAgbW9ja1RoZW1lID0gJ2RhcmsnXG4gICAgICBjb25zdCB7IGNvbnRhaW5lcjogZGFya0NvbnRhaW5lciB9ID0gcmVuZGVyKDxMaW5lIC8+KVxuICAgICAgZXhwZWN0KGRhcmtDb250YWluZXIucXVlcnlTZWxlY3RvcignI3BhaW50MF9saW5lYXJfNjI5NV81MjE3NicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoZGFya0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjcGFpbnQwX2xpbmVhcl8xOTg5Xzc0NDc0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRoZW1lIHZhbHVlIG9mIGxpZ2h0IGV4cGxpY2l0bHknLCAoKSA9PiB7XG4gICAgICBtb2NrVGhlbWUgPSAnbGlnaHQnXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMaW5lIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNwYWludDBfbGluZWFyXzE5ODlfNzQ0NzQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBub24tZGFyayB0aGVtZSBhcyBsaWdodCBtb2RlJywgKCkgPT4ge1xuICAgICAgbW9ja1RoZW1lID0gJ3N5c3RlbSdcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpbmUgLz4pXG5cbiAgICAgIC8vIE5vbi1kYXJrIHRoZW1lcyBzaG91bGQgdXNlIGxpZ2h0IG1vZGUgU1ZHXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKS50b0hhdmVBdHRyaWJ1dGUoJ2hlaWdodCcsICcyNDEnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTVkcgd2l0aCBmaWxsIG5vbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMaW5lIC8+KVxuXG4gICAgICBjb25zdCBzdmcgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzdmcpLnRvSGF2ZUF0dHJpYnV0ZSgnZmlsbCcsICdub25lJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGF0aCB3aXRoIGdyYWRpZW50IHN0cm9rZScsICgpID0+IHtcbiAgICAgIG1vY2tUaGVtZSA9ICdsaWdodCdcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpbmUgLz4pXG5cbiAgICAgIGNvbnN0IHBhdGggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcigncGF0aCcpXG4gICAgICBleHBlY3QocGF0aCkudG9IYXZlQXR0cmlidXRlKCdzdHJva2UnLCAndXJsKCNwYWludDBfbGluZWFyXzE5ODlfNzQ0NzQpJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGFyayBtb2RlIHBhdGggd2l0aCBncmFkaWVudCBzdHJva2UnLCAoKSA9PiB7XG4gICAgICBtb2NrVGhlbWUgPSAnZGFyaydcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpbmUgLz4pXG5cbiAgICAgIGNvbnN0IHBhdGggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcigncGF0aCcpXG4gICAgICBleHBlY3QocGF0aCkudG9IYXZlQXR0cmlidXRlKCdzdHJva2UnLCAndXJsKCNwYWludDBfbGluZWFyXzYyOTVfNTIxNzYpJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVtcHR5IENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdFbXB0eScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1RoZW1lID0gJ2xpZ2h0J1xuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIDE2IHBsYWNlaG9sZGVyIGNhcmRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyQ2FyZHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmgtXFxcXFsxNDRweFxcXFxdJylcbiAgICAgIGV4cGVjdChwbGFjZWhvbGRlckNhcmRzLmxlbmd0aCkudG9CZSgxNilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGVmYXVsdCBubyBwbHVnaW4gZm91bmQgdGV4dCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdObyBwbHVnaW4gZm91bmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBHcm91cCBpY29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIC8vIEljb24gd3JhcHBlciBzaG91bGQgYmUgcHJlc2VudFxuICAgICAgY29uc3QgaWNvbldyYXBwZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmgtMTQudy0xNCcpXG4gICAgICBleHBlY3QoaWNvbldyYXBwZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZm91ciBMaW5lIGNvbXBvbmVudHMgYXJvdW5kIHRoZSBpY29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIC8vIEZvdXIgU1ZHIGVsZW1lbnRzIGZyb20gTGluZSBjb21wb25lbnRzICsgMSBHcm91cCBpY29uIFNWRyA9IDUgdG90YWxcbiAgICAgIGNvbnN0IHN2Z3MgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc3ZnJylcbiAgICAgIGV4cGVjdChzdmdzLmxlbmd0aCkudG9CZSg1KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjZW50ZXIgY29udGVudCB3aXRoIGFic29sdXRlIHBvc2l0aW9uaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIGNvbnN0IGNlbnRlckNvbnRlbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmFic29sdXRlLmxlZnQtMVxcXFwvMi50b3AtMVxcXFwvMicpXG4gICAgICBleHBlY3QoY2VudGVyQ29udGVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGV4dCBQcm9wIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdUZXh0IFByb3AnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY3VzdG9tIHRleHQgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RW1wdHkgdGV4dD1cIkN1c3RvbSBlbXB0eSBtZXNzYWdlXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gZW1wdHkgbWVzc2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdObyBwbHVnaW4gZm91bmQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGVmYXVsdCB0cmFuc2xhdGlvbiB3aGVuIHRleHQgaXMgZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxFbXB0eSB0ZXh0PVwiXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdObyBwbHVnaW4gZm91bmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkZWZhdWx0IHRyYW5zbGF0aW9uIHdoZW4gdGV4dCBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEVtcHR5IHRleHQ9e3VuZGVmaW5lZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdObyBwbHVnaW4gZm91bmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsb25nIGN1c3RvbSB0ZXh0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ1RleHQgPSAnVGhpcyBpcyBhIHZlcnkgbG9uZyBtZXNzYWdlIHRoYXQgZGVzY3JpYmVzIHdoeSB0aGVyZSBhcmUgbm8gcGx1Z2lucyBmb3VuZCBpbiB0aGUgY3VycmVudCBzZWFyY2ggcmVzdWx0cyBhbmQgd2hhdCB0aGUgdXNlciBtaWdodCB3YW50IHRvIGRvIG5leHQgdG8gZmluZCB3aGF0IHRoZXkgYXJlIGxvb2tpbmcgZm9yJ1xuICAgICAgcmVuZGVyKDxFbXB0eSB0ZXh0PXtsb25nVGV4dH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdUZXh0KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0ZXh0IHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxFbXB0eSB0ZXh0PVwiTm8gcGx1Z2lucyBmb3VuZCBmb3IgcXVlcnk6IDxzZWFyY2g+XCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdObyBwbHVnaW5zIGZvdW5kIGZvciBxdWVyeTogPHNlYXJjaD4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTGlnaHRDYXJkIFByb3AgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0xpZ2h0Q2FyZCBQcm9wJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG92ZXJsYXkgd2hlbiBsaWdodENhcmQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSBsaWdodENhcmQ9e2ZhbHNlfSAvPilcblxuICAgICAgY29uc3Qgb3ZlcmxheSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYmctbWFya2V0cGxhY2UtcGx1Z2luLWVtcHR5JylcbiAgICAgIGV4cGVjdChvdmVybGF5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBvdmVybGF5IHdoZW4gbGlnaHRDYXJkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSBsaWdodENhcmQgLz4pXG5cbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmJnLW1hcmtldHBsYWNlLXBsdWdpbi1lbXB0eScpXG4gICAgICBleHBlY3Qob3ZlcmxheSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgb3ZlcmxheSBieSBkZWZhdWx0IHdoZW4gbGlnaHRDYXJkIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IC8+KVxuXG4gICAgICBjb25zdCBvdmVybGF5ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1tYXJrZXRwbGFjZS1wbHVnaW4tZW1wdHknKVxuICAgICAgZXhwZWN0KG92ZXJsYXkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBsaWdodCBjYXJkIHN0eWxpbmcgdG8gcGxhY2Vob2xkZXIgY2FyZHMgd2hlbiBsaWdodENhcmQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IGxpZ2h0Q2FyZCAvPilcblxuICAgICAgY29uc3QgcGxhY2Vob2xkZXJDYXJkcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuYmctYmFja2dyb3VuZC1kZWZhdWx0LWxpZ2h0ZXInKVxuICAgICAgZXhwZWN0KHBsYWNlaG9sZGVyQ2FyZHMubGVuZ3RoKS50b0JlKDE2KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGRlZmF1bHQgc3R5bGluZyB0byBwbGFjZWhvbGRlciBjYXJkcyB3aGVuIGxpZ2h0Q2FyZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IGxpZ2h0Q2FyZD17ZmFsc2V9IC8+KVxuXG4gICAgICBjb25zdCBwbGFjZWhvbGRlckNhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5iZy1iYWNrZ3JvdW5kLXNlY3Rpb24tYnVybicpXG4gICAgICBleHBlY3QocGxhY2Vob2xkZXJDYXJkcy5sZW5ndGgpLnRvQmUoMTYpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgb3BhY2l0eSB0byBsaWdodCBjYXJkIHBsYWNlaG9sZGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgbGlnaHRDYXJkIC8+KVxuXG4gICAgICBjb25zdCBwbGFjZWhvbGRlckNhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcGFjaXR5LTc1JylcbiAgICAgIGV4cGVjdChwbGFjZWhvbGRlckNhcmRzLmxlbmd0aCkudG9CZSgxNilcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENsYXNzTmFtZSBQcm9wIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDbGFzc05hbWUgUHJvcCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUgdG8gY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgY2xhc3NOYW1lPVwiY3VzdG9tLWNsYXNzXCIgLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1c3RvbS1jbGFzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgYmFzZSBjbGFzc2VzIHdoZW4gYWRkaW5nIGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSBjbGFzc05hbWU9XCJjdXN0b20tY2xhc3NcIiAvPilcblxuICAgICAgY29uc3QgZWxlbWVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tLWNsYXNzJylcbiAgICAgIGV4cGVjdChlbGVtZW50KS50b0hhdmVDbGFzcygncmVsYXRpdmUnKVxuICAgICAgZXhwZWN0KGVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdmbGV4JylcbiAgICAgIGV4cGVjdChlbGVtZW50KS50b0hhdmVDbGFzcygnaC0wJylcbiAgICAgIGV4cGVjdChlbGVtZW50KS50b0hhdmVDbGFzcygnZ3JvdycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSBjbGFzc05hbWU9XCJcIiAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgY29uc3QgZWxlbWVudCA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3QoZWxlbWVudCkudG9IYXZlQ2xhc3MoJ3JlbGF0aXZlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgY3VzdG9tIGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSBjbGFzc05hbWU9XCJjbGFzcy1hIGNsYXNzLWIgY2xhc3MtY1wiIC8+KVxuXG4gICAgICBjb25zdCBlbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jbGFzcy1hJylcbiAgICAgIGV4cGVjdChlbGVtZW50KS50b0hhdmVDbGFzcygnY2xhc3MtYicpXG4gICAgICBleHBlY3QoZWxlbWVudCkudG9IYXZlQ2xhc3MoJ2NsYXNzLWMnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUGxhY2Vob2xkZXIgQ2FyZHMgTGF5b3V0IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQbGFjZWhvbGRlciBDYXJkcyBMYXlvdXQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgcmlnaHQgbWFyZ2luIG9uIGV2ZXJ5IDR0aCBjYXJkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIGNvbnN0IGNhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oLVxcXFxbMTQ0cHhcXFxcXScpXG5cbiAgICAgIC8vIENhcmRzIGF0IGluZGljZXMgMywgNywgMTEsIDE1ICg0dGgsIDh0aCwgMTJ0aCwgMTZ0aCkgc2hvdWxkIGhhdmUgbXItMFxuICAgICAgZXhwZWN0KGNhcmRzWzNdKS50b0hhdmVDbGFzcygnbXItMCcpXG4gICAgICBleHBlY3QoY2FyZHNbN10pLnRvSGF2ZUNsYXNzKCdtci0wJylcbiAgICAgIGV4cGVjdChjYXJkc1sxMV0pLnRvSGF2ZUNsYXNzKCdtci0wJylcbiAgICAgIGV4cGVjdChjYXJkc1sxNV0pLnRvSGF2ZUNsYXNzKCdtci0wJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG1hcmdpbiBvbiBjYXJkcyB0aGF0IGFyZSBub3QgYXQgdGhlIGVuZCBvZiByb3cnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgY29uc3QgY2FyZHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmgtXFxcXFsxNDRweFxcXFxdJylcblxuICAgICAgLy8gQ2FyZHMgbm90IGF0IHJvdyBlbmQgc2hvdWxkIGhhdmUgbXItM1xuICAgICAgZXhwZWN0KGNhcmRzWzBdKS50b0hhdmVDbGFzcygnbXItMycpXG4gICAgICBleHBlY3QoY2FyZHNbMV0pLnRvSGF2ZUNsYXNzKCdtci0zJylcbiAgICAgIGV4cGVjdChjYXJkc1syXSkudG9IYXZlQ2xhc3MoJ21yLTMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBib3R0b20gbWFyZ2luIG9uIGxhc3Qgcm93IGNhcmRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIGNvbnN0IGNhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oLVxcXFxbMTQ0cHhcXFxcXScpXG5cbiAgICAgIC8vIENhcmRzIGF0IGluZGljZXMgMTIsIDEzLCAxNCwgMTUgc2hvdWxkIGhhdmUgbWItMFxuICAgICAgZXhwZWN0KGNhcmRzWzEyXSkudG9IYXZlQ2xhc3MoJ21iLTAnKVxuICAgICAgZXhwZWN0KGNhcmRzWzEzXSkudG9IYXZlQ2xhc3MoJ21iLTAnKVxuICAgICAgZXhwZWN0KGNhcmRzWzE0XSkudG9IYXZlQ2xhc3MoJ21iLTAnKVxuICAgICAgZXhwZWN0KGNhcmRzWzE1XSkudG9IYXZlQ2xhc3MoJ21iLTAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgYm90dG9tIG1hcmdpbiBvbiBub24tbGFzdCByb3cgY2FyZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgY29uc3QgY2FyZHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmgtXFxcXFsxNDRweFxcXFxdJylcblxuICAgICAgLy8gQ2FyZHMgYXQgaW5kaWNlcyAwLTExIHNob3VsZCBoYXZlIG1iLTNcbiAgICAgIGV4cGVjdChjYXJkc1swXSkudG9IYXZlQ2xhc3MoJ21iLTMnKVxuICAgICAgZXhwZWN0KGNhcmRzWzVdKS50b0hhdmVDbGFzcygnbWItMycpXG4gICAgICBleHBlY3QoY2FyZHNbMTFdKS50b0hhdmVDbGFzcygnbWItMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHdpZHRoIGNhbGN1bGF0aW9uIGZvciA0IGNvbHVtbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgY29uc3QgY2FyZHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnctXFxcXFtjYWxjXFxcXChcXFxcKDEwMFxcXFwlLTM2cHhcXFxcKVxcXFwvNFxcXFwpXFxcXF0nKVxuICAgICAgZXhwZWN0KGNhcmRzLmxlbmd0aCkudG9CZSgxNilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHJvdW5kZWQgY29ybmVycyBvbiBjYXJkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IC8+KVxuXG4gICAgICBjb25zdCBjYXJkcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcucm91bmRlZC14bCcpXG4gICAgICAvLyAxNiBjYXJkcyArIDEgaWNvbiB3cmFwcGVyID0gMTcgcm91bmRlZC14bCBlbGVtZW50c1xuICAgICAgZXhwZWN0KGNhcmRzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgxNilcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEljb24gQ29udGFpbmVyIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJY29uIENvbnRhaW5lcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpY29uIGNvbnRhaW5lciB3aXRoIGJvcmRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IC8+KVxuXG4gICAgICBjb25zdCBpY29uQ29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib3JkZXItZGFzaGVkJylcbiAgICAgIGV4cGVjdChpY29uQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGljb24gY29udGFpbmVyIHdpdGggc2hhZG93JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIGNvbnN0IGljb25Db250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNoYWRvdy1sZycpXG4gICAgICBleHBlY3QoaWNvbkNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpY29uIGNvbnRhaW5lciBjZW50ZXJlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IC8+KVxuXG4gICAgICBjb25zdCBjZW50ZXJXcmFwcGVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy4tdHJhbnNsYXRlLXgtMVxcXFwvMi4tdHJhbnNsYXRlLXktMVxcXFwvMicpXG4gICAgICBleHBlY3QoY2VudGVyV3JhcHBlcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgei1pbmRleCBmb3IgY2VudGVyIGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgY29uc3QgY2VudGVyQ29udGVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuei1cXFxcWzJcXFxcXScpXG4gICAgICBleHBlY3QoY2VudGVyQ29udGVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTGluZSBQb3NpdGlvbmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTGluZSBQb3NpdGlvbmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBvc2l0aW9uIExpbmUgY29tcG9uZW50cyBjb3JyZWN0bHkgYXJvdW5kIGljb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgLy8gUmlnaHQgbGluZVxuICAgICAgY29uc3QgcmlnaHRMaW5lID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5yaWdodC1cXFxcWy0xcHhcXFxcXScpXG4gICAgICBleHBlY3QocmlnaHRMaW5lKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIExlZnQgbGluZVxuICAgICAgY29uc3QgbGVmdExpbmUgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmxlZnQtXFxcXFstMXB4XFxcXF0nKVxuICAgICAgZXhwZWN0KGxlZnRMaW5lKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSByb3RhdGVkIExpbmUgY29tcG9uZW50cyBmb3IgdG9wIGFuZCBib3R0b20nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgY29uc3Qgcm90YXRlZExpbmVzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yb3RhdGUtOTAnKVxuICAgICAgZXhwZWN0KHJvdGF0ZWRMaW5lcy5sZW5ndGgpLnRvQmUoMilcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbWJpbmVkIFByb3BzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21iaW5lZCBQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbGwgcHJvcHMgdG9nZXRoZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RW1wdHlcbiAgICAgICAgICB0ZXh0PVwiQ3VzdG9tIG1lc3NhZ2VcIlxuICAgICAgICAgIGxpZ2h0Q2FyZFxuICAgICAgICAgIGNsYXNzTmFtZT1cImN1c3RvbS13cmFwcGVyXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gbWVzc2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b20td3JhcHBlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1tYXJrZXRwbGFjZS1wbHVnaW4tZW1wdHknKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggbGlnaHRDYXJkIGZhbHNlIGFuZCBjdXN0b20gdGV4dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxFbXB0eSB0ZXh0PVwiTm8gcmVzdWx0c1wiIGxpZ2h0Q2FyZD17ZmFsc2V9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTm8gcmVzdWx0cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1tYXJrZXRwbGFjZS1wbHVnaW4tZW1wdHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjbGFzc05hbWUgd2l0aCBsaWdodENhcmQgcHJvcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxFbXB0eSBjbGFzc05hbWU9XCJ0ZXN0LWNsYXNzXCIgbGlnaHRDYXJkIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBlbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXN0LWNsYXNzJylcbiAgICAgIGV4cGVjdChlbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFZlcmlmeSBsaWdodCBjYXJkIHN0eWxpbmcgaXMgYXBwbGllZFxuICAgICAgY29uc3QgbGlnaHRDYXJkcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuYmctYmFja2dyb3VuZC1kZWZhdWx0LWxpZ2h0ZXInKVxuICAgICAgZXhwZWN0KGxpZ2h0Q2FyZHMubGVuZ3RoKS50b0JlKDE2KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBwcm9wcyBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTm8gcGx1Z2luIGZvdW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBvbmx5IHRleHQgcHJvcCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RW1wdHkgdGV4dD1cIk9ubHkgdGV4dFwiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnT25seSB0ZXh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBvbmx5IGxpZ2h0Q2FyZCBwcm9wJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgbGlnaHRDYXJkIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1tYXJrZXRwbGFjZS1wbHVnaW4tZW1wdHknKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBvbmx5IGNsYXNzTmFtZSBwcm9wJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgY2xhc3NOYW1lPVwib25seS1jbGFzc1wiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vbmx5LWNsYXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdGV4dCB3aXRoIHVuaWNvZGUgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RW1wdHkgdGV4dD1cIuayoeacieaJvuWIsOaPkuS7tiDwn5SNXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCfmsqHmnInmib7liLDmj5Lku7Yg8J+UjScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRleHQgd2l0aCBIVE1MIGVudGl0aWVzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxFbXB0eSB0ZXh0PVwiTm8gcGx1Z2lucyAmYW1wOyBubyByZXN1bHRzXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdObyBwbHVnaW5zICYgbm8gcmVzdWx0cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHdoaXRlc3BhY2Utb25seSB0ZXh0JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgdGV4dD1cIiAgIFwiIC8+KVxuXG4gICAgICAvLyBXaGl0ZXNwYWNlLW9ubHkgdGV4dCBpcyB0cnV0aHksIHNvIGl0IHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgY29uc3QgdGV4dENvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3lzdGVtLW1kLXJlZ3VsYXInKVxuICAgICAgZXhwZWN0KHRleHRDb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdCh0ZXh0Q29udGFpbmVyPy50ZXh0Q29udGVudCkudG9CZSgnICAgJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIHRleHQgY29udGVudCB2aXNpYmxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxFbXB0eSB0ZXh0PVwiTm8gcGx1Z2lucyBhdmFpbGFibGVcIiAvPilcblxuICAgICAgY29uc3QgdGV4dEVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdObyBwbHVnaW5zIGF2YWlsYWJsZScpXG4gICAgICBleHBlY3QodGV4dEVsZW1lbnQpLnRvQmVWaXNpYmxlKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGV4dCBpbiBwcm9wZXIgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgdGV4dD1cIlRlc3QgbWVzc2FnZVwiIC8+KVxuXG4gICAgICBjb25zdCB0ZXh0Q29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zeXN0ZW0tbWQtcmVndWxhcicpXG4gICAgICBleHBlY3QodGV4dENvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHRleHRDb250YWluZXIpLnRvSGF2ZVRleHRDb250ZW50KCdUZXN0IG1lc3NhZ2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNlbnRlciB0ZXh0IGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcblxuICAgICAgY29uc3QgdGV4dENvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC1jZW50ZXInKVxuICAgICAgZXhwZWN0KHRleHRDb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE92ZXJsYXkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ092ZXJsYXknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgb3ZlcmxheSB3aXRoIGNvcnJlY3Qgei1pbmRleCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IC8+KVxuXG4gICAgICBjb25zdCBvdmVybGF5ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy56LVxcXFxbMVxcXFxdJylcbiAgICAgIGV4cGVjdChvdmVybGF5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG92ZXJsYXkgd2l0aCBmdWxsIGNvdmVyYWdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmluc2V0LTAnKVxuICAgICAgZXhwZWN0KG92ZXJsYXkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIG92ZXJsYXkgd2hlbiBsaWdodENhcmQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IGxpZ2h0Q2FyZCAvPilcblxuICAgICAgY29uc3Qgb3ZlcmxheSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuaW5zZXQtMC56LVxcXFxbMVxcXFxdJylcbiAgICAgIGV4cGVjdChvdmVybGF5KS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW50ZWdyYXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRW1wdHkgYW5kIExpbmUgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tUaGVtZSA9ICdsaWdodCdcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciBMaW5lIGNvbXBvbmVudHMgd2l0aCBjb3JyZWN0IHRoZW1lIGluIEVtcHR5JywgKCkgPT4ge1xuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IC8+KVxuXG4gICAgLy8gSW4gbGlnaHQgbW9kZSwgc2hvdWxkIHVzZSBsaWdodCBncmFkaWVudCBJRFxuICAgIGNvbnN0IGxpZ2h0R3JhZGllbnRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJyNwYWludDBfbGluZWFyXzE5ODlfNzQ0NzQnKVxuICAgIGV4cGVjdChsaWdodEdyYWRpZW50cy5sZW5ndGgpLnRvQmUoNClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciBMaW5lIGNvbXBvbmVudHMgd2l0aCBkYXJrIHRoZW1lIGluIEVtcHR5JywgKCkgPT4ge1xuICAgIG1vY2tUaGVtZSA9ICdkYXJrJ1xuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtcHR5IC8+KVxuXG4gICAgLy8gSW4gZGFyayBtb2RlLCBzaG91bGQgdXNlIGRhcmsgZ3JhZGllbnQgSURcbiAgICBjb25zdCBkYXJrR3JhZGllbnRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJyNwYWludDBfbGluZWFyXzYyOTVfNTIxNzYnKVxuICAgIGV4cGVjdChkYXJrR3JhZGllbnRzLmxlbmd0aCkudG9CZSg0KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgYXBwbHkgcG9zaXRpb25pbmcgY2xhc3NlcyB0byBMaW5lIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG5cbiAgICAvLyBDaGVjayBmb3IgTGluZSBwb3NpdGlvbmluZyBjbGFzc2VzXG4gICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcucmlnaHQtXFxcXFstMXB4XFxcXF0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmxlZnQtXFxcXFstMXB4XFxcXF0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnJvdGF0ZS05MCcpLmxlbmd0aCkudG9CZSgyKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIGNvbXBsZXRlIEVtcHR5IGNvbXBvbmVudCBzdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1wdHkgdGV4dD1cIlRlc3RcIiBsaWdodENhcmQgY2xhc3NOYW1lPVwidGVzdFwiIC8+KVxuXG4gICAgLy8gQ29udGFpbmVyXG4gICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGVzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAvLyBQbGFjZWhvbGRlciBjYXJkc1xuICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmgtXFxcXFsxNDRweFxcXFxdJykubGVuZ3RoKS50b0JlKDE2KVxuXG4gICAgLy8gSWNvbiBjb250YWluZXJcbiAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5oLTE0LnctMTQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgLy8gTGluZSBjb21wb25lbnRzICg0KSArIEdyb3VwIGljb24gKDEpID0gNSBTVkdzIHRvdGFsXG4gICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdzdmcnKS5sZW5ndGgpLnRvQmUoNSlcblxuICAgIC8vIFRleHRcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAvLyBObyBvdmVybGF5IGZvciBsaWdodENhcmRcbiAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1tYXJrZXRwbGFjZS1wbHVnaW4tZW1wdHknKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcbn0pXG4iXX0=