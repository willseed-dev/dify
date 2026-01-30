"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const index_1 = require("./index");
// ================================
// Mock external dependencies
// ================================
// Track mock locale for testing
let mockDefaultLocale = 'en-US';
// Mock translations with realistic values
const pluginTranslations = {
    'marketplace.empower': 'Empower your AI development',
    'marketplace.discover': 'Discover',
    'marketplace.difyMarketplace': 'Dify Marketplace',
    'marketplace.and': 'and',
    'category.models': 'Models',
    'category.tools': 'Tools',
    'category.datasources': 'Data Sources',
    'category.triggers': 'Triggers',
    'category.agents': 'Agent Strategies',
    'category.extensions': 'Extensions',
    'category.bundles': 'Bundles',
};
const commonTranslations = {
    'operation.in': 'in',
};
// Mock i18n hooks
vitest_1.vi.mock('#i18n', () => ({
    useLocale: vitest_1.vi.fn(() => mockDefaultLocale),
    useTranslation: vitest_1.vi.fn((ns) => ({
        t: (key) => {
            if (ns === 'plugin')
                return pluginTranslations[key] || key;
            if (ns === 'common')
                return commonTranslations[key] || key;
            return key;
        },
    })),
}));
// ================================
// Description Component Tests
// ================================
(0, vitest_1.describe)('Description', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockDefaultLocale = 'en-US';
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render h1 heading with empower text', () => {
            (0, react_1.render)(<index_1.default />);
            const heading = react_1.screen.getByRole('heading', { level: 1 });
            (0, vitest_1.expect)(heading).toBeInTheDocument();
            (0, vitest_1.expect)(heading).toHaveTextContent('Empower your AI development');
        });
        (0, vitest_1.it)('should render h2 subheading', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply correct CSS classes to h1', () => {
            (0, react_1.render)(<index_1.default />);
            const heading = react_1.screen.getByRole('heading', { level: 1 });
            (0, vitest_1.expect)(heading).toHaveClass('title-4xl-semi-bold');
            (0, vitest_1.expect)(heading).toHaveClass('mb-2');
            (0, vitest_1.expect)(heading).toHaveClass('text-center');
            (0, vitest_1.expect)(heading).toHaveClass('text-text-primary');
        });
        (0, vitest_1.it)('should apply correct CSS classes to h2', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading).toHaveClass('body-md-regular');
            (0, vitest_1.expect)(subheading).toHaveClass('text-center');
            (0, vitest_1.expect)(subheading).toHaveClass('text-text-tertiary');
        });
    });
    // ================================
    // Non-Chinese Locale Rendering Tests
    // ================================
    (0, vitest_1.describe)('Non-Chinese Locale Rendering', () => {
        (0, vitest_1.beforeEach)(() => {
            mockDefaultLocale = 'en-US';
        });
        (0, vitest_1.it)('should render discover text for en-US locale', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText(/Discover/)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render all category names', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Tools')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Data Sources')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Triggers')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Agent Strategies')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Extensions')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Bundles')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render "and" conjunction text', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading.textContent).toContain('and');
        });
        (0, vitest_1.it)('should render "in" preposition at the end for non-Chinese locales', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('in')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Dify Marketplace text at the end for non-Chinese locales', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading.textContent).toContain('Dify Marketplace');
        });
        (0, vitest_1.it)('should render category spans with styled underline effect', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const styledSpans = container.querySelectorAll('.body-md-medium.relative.z-\\[1\\]');
            // 7 category spans (models, tools, datasources, triggers, agents, extensions, bundles)
            (0, vitest_1.expect)(styledSpans.length).toBe(7);
        });
        (0, vitest_1.it)('should apply text-text-secondary class to category spans', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const styledSpans = container.querySelectorAll('.text-text-secondary');
            (0, vitest_1.expect)(styledSpans.length).toBeGreaterThanOrEqual(7);
        });
    });
    // ================================
    // Chinese (zh-Hans) Locale Rendering Tests
    // ================================
    (0, vitest_1.describe)('Chinese (zh-Hans) Locale Rendering', () => {
        (0, vitest_1.beforeEach)(() => {
            mockDefaultLocale = 'zh-Hans';
        });
        (0, vitest_1.it)('should render "in" text at the beginning for zh-Hans locale', () => {
            (0, react_1.render)(<index_1.default />);
            // In zh-Hans mode, "in" appears at the beginning
            const inElements = react_1.screen.getAllByText('in');
            (0, vitest_1.expect)(inElements.length).toBeGreaterThanOrEqual(1);
        });
        (0, vitest_1.it)('should render Dify Marketplace text for zh-Hans locale', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading.textContent).toContain('Dify Marketplace');
        });
        (0, vitest_1.it)('should render discover text for zh-Hans locale', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText(/Discover/)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render all categories for zh-Hans locale', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Tools')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Data Sources')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Triggers')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Agent Strategies')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Extensions')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Bundles')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render both zh-Hans specific elements and shared elements', () => {
            (0, react_1.render)(<index_1.default />);
            // zh-Hans has specific element order: "in" -> Dify Marketplace -> Discover
            // then the same category list with "and" -> Bundles
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading.textContent).toContain('and');
        });
    });
    // ================================
    // Locale Variations Tests
    // ================================
    (0, vitest_1.describe)('Locale Variations', () => {
        (0, vitest_1.it)('should use en-US locale by default', () => {
            mockDefaultLocale = 'en-US';
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Empower your AI development')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle ja-JP locale as non-Chinese', () => {
            mockDefaultLocale = 'ja-JP';
            (0, react_1.render)(<index_1.default />);
            // Should render in non-Chinese format (discover first, then "in Dify Marketplace" at end)
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading.textContent).toContain('Dify Marketplace');
        });
        (0, vitest_1.it)('should handle ko-KR locale as non-Chinese', () => {
            mockDefaultLocale = 'ko-KR';
            (0, react_1.render)(<index_1.default />);
            // Should render in non-Chinese format
            (0, vitest_1.expect)(react_1.screen.getByText('Empower your AI development')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle de-DE locale as non-Chinese', () => {
            mockDefaultLocale = 'de-DE';
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Empower your AI development')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle fr-FR locale as non-Chinese', () => {
            mockDefaultLocale = 'fr-FR';
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Empower your AI development')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle pt-BR locale as non-Chinese', () => {
            mockDefaultLocale = 'pt-BR';
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Empower your AI development')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle es-ES locale as non-Chinese', () => {
            mockDefaultLocale = 'es-ES';
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Empower your AI development')).toBeInTheDocument();
        });
    });
    // ================================
    // Conditional Rendering Tests
    // ================================
    (0, vitest_1.describe)('Conditional Rendering', () => {
        (0, vitest_1.it)('should render zh-Hans specific content when locale is zh-Hans', () => {
            mockDefaultLocale = 'zh-Hans';
            const { container } = (0, react_1.render)(<index_1.default />);
            // zh-Hans has additional span with mr-1 before "in" text at the start
            const mrSpan = container.querySelector('span.mr-1');
            (0, vitest_1.expect)(mrSpan).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render non-Chinese specific content when locale is not zh-Hans', () => {
            mockDefaultLocale = 'en-US';
            (0, react_1.render)(<index_1.default />);
            // Non-Chinese has "in" and "Dify Marketplace" at the end
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading.textContent).toContain('Dify Marketplace');
        });
        (0, vitest_1.it)('should not render zh-Hans intro content for non-Chinese locales', () => {
            mockDefaultLocale = 'en-US';
            (0, react_1.render)(<index_1.default />);
            // For en-US, the order should be Discover ... in Dify Marketplace
            // The "in" text should only appear once at the end
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            const content = subheading.textContent || '';
            // "in" should appear after "Bundles" and before "Dify Marketplace"
            const bundlesIndex = content.indexOf('Bundles');
            const inIndex = content.indexOf('in');
            const marketplaceIndex = content.indexOf('Dify Marketplace');
            (0, vitest_1.expect)(bundlesIndex).toBeLessThan(inIndex);
            (0, vitest_1.expect)(inIndex).toBeLessThan(marketplaceIndex);
        });
        (0, vitest_1.it)('should render zh-Hans with proper word order', () => {
            mockDefaultLocale = 'zh-Hans';
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            const content = subheading.textContent || '';
            // zh-Hans order: in -> Dify Marketplace -> Discover -> categories
            const inIndex = content.indexOf('in');
            const marketplaceIndex = content.indexOf('Dify Marketplace');
            const discoverIndex = content.indexOf('Discover');
            (0, vitest_1.expect)(inIndex).toBeLessThan(marketplaceIndex);
            (0, vitest_1.expect)(marketplaceIndex).toBeLessThan(discoverIndex);
        });
    });
    // ================================
    // Category Styling Tests
    // ================================
    (0, vitest_1.describe)('Category Styling', () => {
        (0, vitest_1.it)('should apply underline effect with after pseudo-element styling', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const categorySpan = container.querySelector('.after\\:absolute');
            (0, vitest_1.expect)(categorySpan).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply correct after pseudo-element classes', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            // Check for the specific after pseudo-element classes
            const categorySpans = container.querySelectorAll('.after\\:bottom-\\[1\\.5px\\]');
            (0, vitest_1.expect)(categorySpans.length).toBe(7);
        });
        (0, vitest_1.it)('should apply full width to after element', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const categorySpans = container.querySelectorAll('.after\\:w-full');
            (0, vitest_1.expect)(categorySpans.length).toBe(7);
        });
        (0, vitest_1.it)('should apply correct height to after element', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const categorySpans = container.querySelectorAll('.after\\:h-2');
            (0, vitest_1.expect)(categorySpans.length).toBe(7);
        });
        (0, vitest_1.it)('should apply bg-text-text-selected to after element', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const categorySpans = container.querySelectorAll('.after\\:bg-text-text-selected');
            (0, vitest_1.expect)(categorySpans.length).toBe(7);
        });
        (0, vitest_1.it)('should have z-index 1 on category spans', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const categorySpans = container.querySelectorAll('.z-\\[1\\]');
            (0, vitest_1.expect)(categorySpans.length).toBe(7);
        });
        (0, vitest_1.it)('should apply left margin to category spans', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const categorySpans = container.querySelectorAll('.ml-1');
            (0, vitest_1.expect)(categorySpans.length).toBeGreaterThanOrEqual(7);
        });
        (0, vitest_1.it)('should apply both left and right margin to specific spans', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            // Extensions and Bundles spans have both ml-1 and mr-1
            const extensionsBundlesSpans = container.querySelectorAll('.ml-1.mr-1');
            (0, vitest_1.expect)(extensionsBundlesSpans.length).toBe(2);
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should render fragment as root element', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            // Fragment renders h1 and h2 as direct children
            (0, vitest_1.expect)(container.querySelector('h1')).toBeInTheDocument();
            (0, vitest_1.expect)(container.querySelector('h2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle zh-Hant as non-Chinese simplified', () => {
            mockDefaultLocale = 'zh-Hant';
            (0, react_1.render)(<index_1.default />);
            // zh-Hant is different from zh-Hans, should use non-Chinese format
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            const content = subheading.textContent || '';
            // Check that "Dify Marketplace" appears at the end (non-Chinese format)
            const discoverIndex = content.indexOf('Discover');
            const marketplaceIndex = content.indexOf('Dify Marketplace');
            // For non-Chinese locales, Discover should come before Dify Marketplace
            (0, vitest_1.expect)(discoverIndex).toBeLessThan(marketplaceIndex);
        });
    });
    // ================================
    // Content Structure Tests
    // ================================
    (0, vitest_1.describe)('Content Structure', () => {
        (0, vitest_1.it)('should have comma separators between categories', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            const content = subheading.textContent || '';
            // Commas should exist between categories
            (0, vitest_1.expect)(content).toMatch(/Models[^\n\r,\u2028\u2029]*,.*Tools[^\n\r,\u2028\u2029]*,.*Data Sources[^\n\r,\u2028\u2029]*,.*Triggers[^\n\r,\u2028\u2029]*,.*Agent Strategies[^\n\r,\u2028\u2029]*,.*Extensions/);
        });
        (0, vitest_1.it)('should have "and" before last category (Bundles)', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            const content = subheading.textContent || '';
            // "and" should appear before Bundles
            const andIndex = content.indexOf('and');
            const bundlesIndex = content.indexOf('Bundles');
            (0, vitest_1.expect)(andIndex).toBeLessThan(bundlesIndex);
        });
        (0, vitest_1.it)('should render all text elements in correct order for en-US', () => {
            mockDefaultLocale = 'en-US';
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            const content = subheading.textContent || '';
            const expectedOrder = [
                'Discover',
                'Models',
                'Tools',
                'Data Sources',
                'Triggers',
                'Agent Strategies',
                'Extensions',
                'and',
                'Bundles',
                'in',
                'Dify Marketplace',
            ];
            let lastIndex = -1;
            for (const text of expectedOrder) {
                const currentIndex = content.indexOf(text);
                (0, vitest_1.expect)(currentIndex).toBeGreaterThan(lastIndex);
                lastIndex = currentIndex;
            }
        });
        (0, vitest_1.it)('should render all text elements in correct order for zh-Hans', () => {
            mockDefaultLocale = 'zh-Hans';
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            const content = subheading.textContent || '';
            // zh-Hans order: in -> Dify Marketplace -> Discover -> categories -> and -> Bundles
            const inIndex = content.indexOf('in');
            const marketplaceIndex = content.indexOf('Dify Marketplace');
            const discoverIndex = content.indexOf('Discover');
            const modelsIndex = content.indexOf('Models');
            (0, vitest_1.expect)(inIndex).toBeLessThan(marketplaceIndex);
            (0, vitest_1.expect)(marketplaceIndex).toBeLessThan(discoverIndex);
            (0, vitest_1.expect)(discoverIndex).toBeLessThan(modelsIndex);
        });
    });
    // ================================
    // Layout Tests
    // ================================
    (0, vitest_1.describe)('Layout', () => {
        (0, vitest_1.it)('should have shrink-0 on h1 heading', () => {
            (0, react_1.render)(<index_1.default />);
            const heading = react_1.screen.getByRole('heading', { level: 1 });
            (0, vitest_1.expect)(heading).toHaveClass('shrink-0');
        });
        (0, vitest_1.it)('should have shrink-0 on h2 subheading', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading).toHaveClass('shrink-0');
        });
        (0, vitest_1.it)('should have flex layout on h2', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading).toHaveClass('flex');
        });
        (0, vitest_1.it)('should have items-center on h2', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading).toHaveClass('items-center');
        });
        (0, vitest_1.it)('should have justify-center on h2', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading).toHaveClass('justify-center');
        });
    });
    // ================================
    // Accessibility Tests
    // ================================
    (0, vitest_1.describe)('Accessibility', () => {
        (0, vitest_1.it)('should have proper heading hierarchy', () => {
            (0, react_1.render)(<index_1.default />);
            const h1 = react_1.screen.getByRole('heading', { level: 1 });
            const h2 = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(h1).toBeInTheDocument();
            (0, vitest_1.expect)(h2).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have readable text content', () => {
            (0, react_1.render)(<index_1.default />);
            const h1 = react_1.screen.getByRole('heading', { level: 1 });
            (0, vitest_1.expect)(h1.textContent).not.toBe('');
        });
        (0, vitest_1.it)('should have visible h1 heading', () => {
            (0, react_1.render)(<index_1.default />);
            const heading = react_1.screen.getByRole('heading', { level: 1 });
            (0, vitest_1.expect)(heading).toBeVisible();
        });
        (0, vitest_1.it)('should have visible h2 heading', () => {
            (0, react_1.render)(<index_1.default />);
            const subheading = react_1.screen.getByRole('heading', { level: 2 });
            (0, vitest_1.expect)(subheading).toBeVisible();
        });
    });
});
// ================================
// Integration Tests
// ================================
(0, vitest_1.describe)('Description Integration', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockDefaultLocale = 'en-US';
    });
    (0, vitest_1.it)('should render complete component structure', () => {
        const { container } = (0, react_1.render)(<index_1.default />);
        // Main headings
        (0, vitest_1.expect)(container.querySelector('h1')).toBeInTheDocument();
        (0, vitest_1.expect)(container.querySelector('h2')).toBeInTheDocument();
        // All category spans
        const categorySpans = container.querySelectorAll('.body-md-medium');
        (0, vitest_1.expect)(categorySpans.length).toBe(7);
    });
    (0, vitest_1.it)('should render complete zh-Hans structure', () => {
        mockDefaultLocale = 'zh-Hans';
        const { container } = (0, react_1.render)(<index_1.default />);
        // Main headings
        (0, vitest_1.expect)(container.querySelector('h1')).toBeInTheDocument();
        (0, vitest_1.expect)(container.querySelector('h2')).toBeInTheDocument();
        // All category spans
        const categorySpans = container.querySelectorAll('.body-md-medium');
        (0, vitest_1.expect)(categorySpans.length).toBe(7);
    });
    (0, vitest_1.it)('should correctly differentiate between zh-Hans and en-US layouts', () => {
        // Render en-US
        mockDefaultLocale = 'en-US';
        const { container: enContainer, unmount: unmountEn } = (0, react_1.render)(<index_1.default />);
        const enContent = enContainer.querySelector('h2')?.textContent || '';
        unmountEn();
        // Render zh-Hans
        mockDefaultLocale = 'zh-Hans';
        const { container: zhContainer } = (0, react_1.render)(<index_1.default />);
        const zhContent = zhContainer.querySelector('h2')?.textContent || '';
        // Both should have all categories
        (0, vitest_1.expect)(enContent).toContain('Models');
        (0, vitest_1.expect)(zhContent).toContain('Models');
        // But order should differ
        const enMarketplaceIndex = enContent.indexOf('Dify Marketplace');
        const enDiscoverIndex = enContent.indexOf('Discover');
        const zhMarketplaceIndex = zhContent.indexOf('Dify Marketplace');
        const zhDiscoverIndex = zhContent.indexOf('Discover');
        // en-US: Discover comes before Dify Marketplace
        (0, vitest_1.expect)(enDiscoverIndex).toBeLessThan(enMarketplaceIndex);
        // zh-Hans: Dify Marketplace comes before Discover
        (0, vitest_1.expect)(zhMarketplaceIndex).toBeLessThan(zhDiscoverIndex);
    });
    (0, vitest_1.it)('should maintain consistent styling across locales', () => {
        // Render en-US
        mockDefaultLocale = 'en-US';
        const { container: enContainer, unmount: unmountEn } = (0, react_1.render)(<index_1.default />);
        const enCategoryCount = enContainer.querySelectorAll('.body-md-medium').length;
        unmountEn();
        // Render zh-Hans
        mockDefaultLocale = 'zh-Hans';
        const { container: zhContainer } = (0, react_1.render)(<index_1.default />);
        const zhCategoryCount = zhContainer.querySelectorAll('.body-md-medium').length;
        // Both should have same number of styled category spans
        (0, vitest_1.expect)(enCategoryCount).toBe(zhCategoryCount);
        (0, vitest_1.expect)(enCategoryCount).toBe(7);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXVEO0FBQ3ZELG1DQUE2RDtBQUM3RCxtQ0FBaUM7QUFFakMsbUNBQW1DO0FBQ25DLDZCQUE2QjtBQUM3QixtQ0FBbUM7QUFFbkMsZ0NBQWdDO0FBQ2hDLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFBO0FBRS9CLDBDQUEwQztBQUMxQyxNQUFNLGtCQUFrQixHQUEyQjtJQUNqRCxxQkFBcUIsRUFBRSw2QkFBNkI7SUFDcEQsc0JBQXNCLEVBQUUsVUFBVTtJQUNsQyw2QkFBNkIsRUFBRSxrQkFBa0I7SUFDakQsaUJBQWlCLEVBQUUsS0FBSztJQUN4QixpQkFBaUIsRUFBRSxRQUFRO0lBQzNCLGdCQUFnQixFQUFFLE9BQU87SUFDekIsc0JBQXNCLEVBQUUsY0FBYztJQUN0QyxtQkFBbUIsRUFBRSxVQUFVO0lBQy9CLGlCQUFpQixFQUFFLGtCQUFrQjtJQUNyQyxxQkFBcUIsRUFBRSxZQUFZO0lBQ25DLGtCQUFrQixFQUFFLFNBQVM7Q0FDOUIsQ0FBQTtBQUVELE1BQU0sa0JBQWtCLEdBQTJCO0lBQ2pELGNBQWMsRUFBRSxJQUFJO0NBQ3JCLENBQUE7QUFFRCxrQkFBa0I7QUFDbEIsV0FBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN0QixTQUFTLEVBQUUsV0FBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUN6QyxjQUFjLEVBQUUsV0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDLEVBQUUsQ0FBQyxHQUFXLEVBQUUsRUFBRTtZQUNqQixJQUFJLEVBQUUsS0FBSyxRQUFRO2dCQUNqQixPQUFPLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQTtZ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QUMsQ0FBQyxNQUFNLENBQUE7UUFDOUUsU0FBUyxFQUFFLENBQUE7UUFFWCxpQkFBaUI7UUFDakIsaUJBQWlCLEdBQUcsU0FBUyxDQUFBO1FBQzdCLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFXLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtRQUMxRCxNQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUE7UUFFOUUsd0RBQXdEO1FBQ3hELElBQUEsZUFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUM3QyxJQUFBLGVBQU0sRUFBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDakMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCBEZXNjcmlwdGlvbiBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIFRyYWNrIG1vY2sgbG9jYWxlIGZvciB0ZXN0aW5nXG5sZXQgbW9ja0RlZmF1bHRMb2NhbGUgPSAnZW4tVVMnXG5cbi8vIE1vY2sgdHJhbnNsYXRpb25zIHdpdGggcmVhbGlzdGljIHZhbHVlc1xuY29uc3QgcGx1Z2luVHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnbWFya2V0cGxhY2UuZW1wb3dlcic6ICdFbXBvd2VyIHlvdXIgQUkgZGV2ZWxvcG1lbnQnLFxuICAnbWFya2V0cGxhY2UuZGlzY292ZXInOiAnRGlzY292ZXInLFxuICAnbWFya2V0cGxhY2UuZGlmeU1hcmtldHBsYWNlJzogJ0RpZnkgTWFya2V0cGxhY2UnLFxuICAnbWFya2V0cGxhY2UuYW5kJzogJ2FuZCcsXG4gICdjYXRlZ29yeS5tb2RlbHMnOiAnTW9kZWxzJyxcbiAgJ2NhdGVnb3J5LnRvb2xzJzogJ1Rvb2xzJyxcbiAgJ2NhdGVnb3J5LmRhdGFzb3VyY2VzJzogJ0RhdGEgU291cmNlcycsXG4gICdjYXRlZ29yeS50cmlnZ2Vycyc6ICdUcmlnZ2VycycsXG4gICdjYXRlZ29yeS5hZ2VudHMnOiAnQWdlbnQgU3RyYXRlZ2llcycsXG4gICdjYXRlZ29yeS5leHRlbnNpb25zJzogJ0V4dGVuc2lvbnMnLFxuICAnY2F0ZWdvcnkuYnVuZGxlcyc6ICdCdW5kbGVzJyxcbn1cblxuY29uc3QgY29tbW9uVHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnb3BlcmF0aW9uLmluJzogJ2luJyxcbn1cblxuLy8gTW9jayBpMThuIGhvb2tzXG52aS5tb2NrKCcjaTE4bicsICgpID0+ICh7XG4gIHVzZUxvY2FsZTogdmkuZm4oKCkgPT4gbW9ja0RlZmF1bHRMb2NhbGUpLFxuICB1c2VUcmFuc2xhdGlvbjogdmkuZm4oKG5zOiBzdHJpbmcpID0+ICh7XG4gICAgdDogKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAobnMgPT09ICdwbHVnaW4nKVxuICAgICAgICByZXR1cm4gcGx1Z2luVHJhbnNsYXRpb25zW2tleV0gfHwga2V5XG4gICAgICBpZiAobnMgPT09ICdjb21tb24nKVxuICAgICAgICByZXR1cm4gY29tbW9uVHJhbnNsYXRpb25zW2tleV0gfHwga2V5XG4gICAgICByZXR1cm4ga2V5XG4gICAgfSxcbiAgfSkpLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBEZXNjcmlwdGlvbiBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ2VuLVVTJ1xuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGgxIGhlYWRpbmcgd2l0aCBlbXBvd2VyIHRleHQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBoZWFkaW5nID0gc2NyZWVuLmdldEJ5Um9sZSgnaGVhZGluZycsIHsgbGV2ZWw6IDEgfSlcbiAgICAgIGV4cGVjdChoZWFkaW5nKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoaGVhZGluZykudG9IYXZlVGV4dENvbnRlbnQoJ0VtcG93ZXIgeW91ciBBSSBkZXZlbG9wbWVudCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGgyIHN1YmhlYWRpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBzdWJoZWFkaW5nID0gc2NyZWVuLmdldEJ5Um9sZSgnaGVhZGluZycsIHsgbGV2ZWw6IDIgfSlcbiAgICAgIGV4cGVjdChzdWJoZWFkaW5nKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBDU1MgY2xhc3NlcyB0byBoMScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMSB9KVxuICAgICAgZXhwZWN0KGhlYWRpbmcpLnRvSGF2ZUNsYXNzKCd0aXRsZS00eGwtc2VtaS1ib2xkJylcbiAgICAgIGV4cGVjdChoZWFkaW5nKS50b0hhdmVDbGFzcygnbWItMicpXG4gICAgICBleHBlY3QoaGVhZGluZykudG9IYXZlQ2xhc3MoJ3RleHQtY2VudGVyJylcbiAgICAgIGV4cGVjdChoZWFkaW5nKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXByaW1hcnknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3QgQ1NTIGNsYXNzZXMgdG8gaDInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBzdWJoZWFkaW5nID0gc2NyZWVuLmdldEJ5Um9sZSgnaGVhZGluZycsIHsgbGV2ZWw6IDIgfSlcbiAgICAgIGV4cGVjdChzdWJoZWFkaW5nKS50b0hhdmVDbGFzcygnYm9keS1tZC1yZWd1bGFyJylcbiAgICAgIGV4cGVjdChzdWJoZWFkaW5nKS50b0hhdmVDbGFzcygndGV4dC1jZW50ZXInKVxuICAgICAgZXhwZWN0KHN1YmhlYWRpbmcpLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtdGVydGlhcnknKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTm9uLUNoaW5lc2UgTG9jYWxlIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTm9uLUNoaW5lc2UgTG9jYWxlIFJlbmRlcmluZycsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ2VuLVVTJ1xuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkaXNjb3ZlciB0ZXh0IGZvciBlbi1VUyBsb2NhbGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvRGlzY292ZXIvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgY2F0ZWdvcnkgbmFtZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWxzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUb29scycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2VzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUcmlnZ2VycycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQWdlbnQgU3RyYXRlZ2llcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRXh0ZW5zaW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQnVuZGxlcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFwiYW5kXCIgY29uanVuY3Rpb24gdGV4dCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgZXhwZWN0KHN1YmhlYWRpbmcudGV4dENvbnRlbnQpLnRvQ29udGFpbignYW5kJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgXCJpblwiIHByZXBvc2l0aW9uIGF0IHRoZSBlbmQgZm9yIG5vbi1DaGluZXNlIGxvY2FsZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBEaWZ5IE1hcmtldHBsYWNlIHRleHQgYXQgdGhlIGVuZCBmb3Igbm9uLUNoaW5lc2UgbG9jYWxlcycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgZXhwZWN0KHN1YmhlYWRpbmcudGV4dENvbnRlbnQpLnRvQ29udGFpbignRGlmeSBNYXJrZXRwbGFjZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNhdGVnb3J5IHNwYW5zIHdpdGggc3R5bGVkIHVuZGVybGluZSBlZmZlY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgY29uc3Qgc3R5bGVkU3BhbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmJvZHktbWQtbWVkaXVtLnJlbGF0aXZlLnotXFxcXFsxXFxcXF0nKVxuICAgICAgLy8gNyBjYXRlZ29yeSBzcGFucyAobW9kZWxzLCB0b29scywgZGF0YXNvdXJjZXMsIHRyaWdnZXJzLCBhZ2VudHMsIGV4dGVuc2lvbnMsIGJ1bmRsZXMpXG4gICAgICBleHBlY3Qoc3R5bGVkU3BhbnMubGVuZ3RoKS50b0JlKDcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgdGV4dC10ZXh0LXNlY29uZGFyeSBjbGFzcyB0byBjYXRlZ29yeSBzcGFucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBzdHlsZWRTcGFucyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcudGV4dC10ZXh0LXNlY29uZGFyeScpXG4gICAgICBleHBlY3Qoc3R5bGVkU3BhbnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDaGluZXNlICh6aC1IYW5zKSBMb2NhbGUgUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDaGluZXNlICh6aC1IYW5zKSBMb2NhbGUgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbW9ja0RlZmF1bHRMb2NhbGUgPSAnemgtSGFucydcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgXCJpblwiIHRleHQgYXQgdGhlIGJlZ2lubmluZyBmb3IgemgtSGFucyBsb2NhbGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICAvLyBJbiB6aC1IYW5zIG1vZGUsIFwiaW5cIiBhcHBlYXJzIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAgIGNvbnN0IGluRWxlbWVudHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdpbicpXG4gICAgICBleHBlY3QoaW5FbGVtZW50cy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRGlmeSBNYXJrZXRwbGFjZSB0ZXh0IGZvciB6aC1IYW5zIGxvY2FsZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgZXhwZWN0KHN1YmhlYWRpbmcudGV4dENvbnRlbnQpLnRvQ29udGFpbignRGlmeSBNYXJrZXRwbGFjZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRpc2NvdmVyIHRleHQgZm9yIHpoLUhhbnMgbG9jYWxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0Rpc2NvdmVyLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGNhdGVnb3JpZXMgZm9yIHpoLUhhbnMgbG9jYWxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vZGVscycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVG9vbHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVHJpZ2dlcnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50IFN0cmF0ZWdpZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0V4dGVuc2lvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0J1bmRsZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBib3RoIHpoLUhhbnMgc3BlY2lmaWMgZWxlbWVudHMgYW5kIHNoYXJlZCBlbGVtZW50cycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIC8vIHpoLUhhbnMgaGFzIHNwZWNpZmljIGVsZW1lbnQgb3JkZXI6IFwiaW5cIiAtPiBEaWZ5IE1hcmtldHBsYWNlIC0+IERpc2NvdmVyXG4gICAgICAvLyB0aGVuIHRoZSBzYW1lIGNhdGVnb3J5IGxpc3Qgd2l0aCBcImFuZFwiIC0+IEJ1bmRsZXNcbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgZXhwZWN0KHN1YmhlYWRpbmcudGV4dENvbnRlbnQpLnRvQ29udGFpbignYW5kJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIExvY2FsZSBWYXJpYXRpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdMb2NhbGUgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBlbi1VUyBsb2NhbGUgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ2VuLVVTJ1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0VtcG93ZXIgeW91ciBBSSBkZXZlbG9wbWVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGphLUpQIGxvY2FsZSBhcyBub24tQ2hpbmVzZScsICgpID0+IHtcbiAgICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ2phLUpQJ1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBpbiBub24tQ2hpbmVzZSBmb3JtYXQgKGRpc2NvdmVyIGZpcnN0LCB0aGVuIFwiaW4gRGlmeSBNYXJrZXRwbGFjZVwiIGF0IGVuZClcbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgZXhwZWN0KHN1YmhlYWRpbmcudGV4dENvbnRlbnQpLnRvQ29udGFpbignRGlmeSBNYXJrZXRwbGFjZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGtvLUtSIGxvY2FsZSBhcyBub24tQ2hpbmVzZScsICgpID0+IHtcbiAgICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ2tvLUtSJ1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBpbiBub24tQ2hpbmVzZSBmb3JtYXRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdFbXBvd2VyIHlvdXIgQUkgZGV2ZWxvcG1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkZS1ERSBsb2NhbGUgYXMgbm9uLUNoaW5lc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICdkZS1ERSdcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdFbXBvd2VyIHlvdXIgQUkgZGV2ZWxvcG1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBmci1GUiBsb2NhbGUgYXMgbm9uLUNoaW5lc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICdmci1GUidcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdFbXBvd2VyIHlvdXIgQUkgZGV2ZWxvcG1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwdC1CUiBsb2NhbGUgYXMgbm9uLUNoaW5lc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICdwdC1CUidcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdFbXBvd2VyIHlvdXIgQUkgZGV2ZWxvcG1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlcy1FUyBsb2NhbGUgYXMgbm9uLUNoaW5lc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICdlcy1FUydcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdFbXBvd2VyIHlvdXIgQUkgZGV2ZWxvcG1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29uZGl0aW9uYWwgUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb25kaXRpb25hbCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgemgtSGFucyBzcGVjaWZpYyBjb250ZW50IHdoZW4gbG9jYWxlIGlzIHpoLUhhbnMnLCAoKSA9PiB7XG4gICAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICd6aC1IYW5zJ1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIC8vIHpoLUhhbnMgaGFzIGFkZGl0aW9uYWwgc3BhbiB3aXRoIG1yLTEgYmVmb3JlIFwiaW5cIiB0ZXh0IGF0IHRoZSBzdGFydFxuICAgICAgY29uc3QgbXJTcGFuID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4ubXItMScpXG4gICAgICBleHBlY3QobXJTcGFuKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG5vbi1DaGluZXNlIHNwZWNpZmljIGNvbnRlbnQgd2hlbiBsb2NhbGUgaXMgbm90IHpoLUhhbnMnLCAoKSA9PiB7XG4gICAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICdlbi1VUydcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIC8vIE5vbi1DaGluZXNlIGhhcyBcImluXCIgYW5kIFwiRGlmeSBNYXJrZXRwbGFjZVwiIGF0IHRoZSBlbmRcbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgZXhwZWN0KHN1YmhlYWRpbmcudGV4dENvbnRlbnQpLnRvQ29udGFpbignRGlmeSBNYXJrZXRwbGFjZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB6aC1IYW5zIGludHJvIGNvbnRlbnQgZm9yIG5vbi1DaGluZXNlIGxvY2FsZXMnLCAoKSA9PiB7XG4gICAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICdlbi1VUydcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIC8vIEZvciBlbi1VUywgdGhlIG9yZGVyIHNob3VsZCBiZSBEaXNjb3ZlciAuLi4gaW4gRGlmeSBNYXJrZXRwbGFjZVxuICAgICAgLy8gVGhlIFwiaW5cIiB0ZXh0IHNob3VsZCBvbmx5IGFwcGVhciBvbmNlIGF0IHRoZSBlbmRcbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgY29uc3QgY29udGVudCA9IHN1YmhlYWRpbmcudGV4dENvbnRlbnQgfHwgJydcblxuICAgICAgLy8gXCJpblwiIHNob3VsZCBhcHBlYXIgYWZ0ZXIgXCJCdW5kbGVzXCIgYW5kIGJlZm9yZSBcIkRpZnkgTWFya2V0cGxhY2VcIlxuICAgICAgY29uc3QgYnVuZGxlc0luZGV4ID0gY29udGVudC5pbmRleE9mKCdCdW5kbGVzJylcbiAgICAgIGNvbnN0IGluSW5kZXggPSBjb250ZW50LmluZGV4T2YoJ2luJylcbiAgICAgIGNvbnN0IG1hcmtldHBsYWNlSW5kZXggPSBjb250ZW50LmluZGV4T2YoJ0RpZnkgTWFya2V0cGxhY2UnKVxuXG4gICAgICBleHBlY3QoYnVuZGxlc0luZGV4KS50b0JlTGVzc1RoYW4oaW5JbmRleClcbiAgICAgIGV4cGVjdChpbkluZGV4KS50b0JlTGVzc1RoYW4obWFya2V0cGxhY2VJbmRleClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgemgtSGFucyB3aXRoIHByb3BlciB3b3JkIG9yZGVyJywgKCkgPT4ge1xuICAgICAgbW9ja0RlZmF1bHRMb2NhbGUgPSAnemgtSGFucydcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgY29uc3QgY29udGVudCA9IHN1YmhlYWRpbmcudGV4dENvbnRlbnQgfHwgJydcblxuICAgICAgLy8gemgtSGFucyBvcmRlcjogaW4gLT4gRGlmeSBNYXJrZXRwbGFjZSAtPiBEaXNjb3ZlciAtPiBjYXRlZ29yaWVzXG4gICAgICBjb25zdCBpbkluZGV4ID0gY29udGVudC5pbmRleE9mKCdpbicpXG4gICAgICBjb25zdCBtYXJrZXRwbGFjZUluZGV4ID0gY29udGVudC5pbmRleE9mKCdEaWZ5IE1hcmtldHBsYWNlJylcbiAgICAgIGNvbnN0IGRpc2NvdmVySW5kZXggPSBjb250ZW50LmluZGV4T2YoJ0Rpc2NvdmVyJylcblxuICAgICAgZXhwZWN0KGluSW5kZXgpLnRvQmVMZXNzVGhhbihtYXJrZXRwbGFjZUluZGV4KVxuICAgICAgZXhwZWN0KG1hcmtldHBsYWNlSW5kZXgpLnRvQmVMZXNzVGhhbihkaXNjb3ZlckluZGV4KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ2F0ZWdvcnkgU3R5bGluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2F0ZWdvcnkgU3R5bGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IHVuZGVybGluZSBlZmZlY3Qgd2l0aCBhZnRlciBwc2V1ZG8tZWxlbWVudCBzdHlsaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IGNhdGVnb3J5U3BhbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYWZ0ZXJcXFxcOmFic29sdXRlJylcbiAgICAgIGV4cGVjdChjYXRlZ29yeVNwYW4pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjb3JyZWN0IGFmdGVyIHBzZXVkby1lbGVtZW50IGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgLy8gQ2hlY2sgZm9yIHRoZSBzcGVjaWZpYyBhZnRlciBwc2V1ZG8tZWxlbWVudCBjbGFzc2VzXG4gICAgICBjb25zdCBjYXRlZ29yeVNwYW5zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hZnRlclxcXFw6Ym90dG9tLVxcXFxbMVxcXFwuNXB4XFxcXF0nKVxuICAgICAgZXhwZWN0KGNhdGVnb3J5U3BhbnMubGVuZ3RoKS50b0JlKDcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgZnVsbCB3aWR0aCB0byBhZnRlciBlbGVtZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IGNhdGVnb3J5U3BhbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmFmdGVyXFxcXDp3LWZ1bGwnKVxuICAgICAgZXhwZWN0KGNhdGVnb3J5U3BhbnMubGVuZ3RoKS50b0JlKDcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBoZWlnaHQgdG8gYWZ0ZXIgZWxlbWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBjYXRlZ29yeVNwYW5zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hZnRlclxcXFw6aC0yJylcbiAgICAgIGV4cGVjdChjYXRlZ29yeVNwYW5zLmxlbmd0aCkudG9CZSg3KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGJnLXRleHQtdGV4dC1zZWxlY3RlZCB0byBhZnRlciBlbGVtZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IGNhdGVnb3J5U3BhbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmFmdGVyXFxcXDpiZy10ZXh0LXRleHQtc2VsZWN0ZWQnKVxuICAgICAgZXhwZWN0KGNhdGVnb3J5U3BhbnMubGVuZ3RoKS50b0JlKDcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB6LWluZGV4IDEgb24gY2F0ZWdvcnkgc3BhbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgY29uc3QgY2F0ZWdvcnlTcGFucyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuei1cXFxcWzFcXFxcXScpXG4gICAgICBleHBlY3QoY2F0ZWdvcnlTcGFucy5sZW5ndGgpLnRvQmUoNylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBsZWZ0IG1hcmdpbiB0byBjYXRlZ29yeSBzcGFucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBjYXRlZ29yeVNwYW5zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tbC0xJylcbiAgICAgIGV4cGVjdChjYXRlZ29yeVNwYW5zLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCg3KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGJvdGggbGVmdCBhbmQgcmlnaHQgbWFyZ2luIHRvIHNwZWNpZmljIHNwYW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIC8vIEV4dGVuc2lvbnMgYW5kIEJ1bmRsZXMgc3BhbnMgaGF2ZSBib3RoIG1sLTEgYW5kIG1yLTFcbiAgICAgIGNvbnN0IGV4dGVuc2lvbnNCdW5kbGVzU3BhbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1sLTEubXItMScpXG4gICAgICBleHBlY3QoZXh0ZW5zaW9uc0J1bmRsZXNTcGFucy5sZW5ndGgpLnRvQmUoMilcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZnJhZ21lbnQgYXMgcm9vdCBlbGVtZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIC8vIEZyYWdtZW50IHJlbmRlcnMgaDEgYW5kIGgyIGFzIGRpcmVjdCBjaGlsZHJlblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdoMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2gyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgemgtSGFudCBhcyBub24tQ2hpbmVzZSBzaW1wbGlmaWVkJywgKCkgPT4ge1xuICAgICAgbW9ja0RlZmF1bHRMb2NhbGUgPSAnemgtSGFudCdcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIC8vIHpoLUhhbnQgaXMgZGlmZmVyZW50IGZyb20gemgtSGFucywgc2hvdWxkIHVzZSBub24tQ2hpbmVzZSBmb3JtYXRcbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgY29uc3QgY29udGVudCA9IHN1YmhlYWRpbmcudGV4dENvbnRlbnQgfHwgJydcblxuICAgICAgLy8gQ2hlY2sgdGhhdCBcIkRpZnkgTWFya2V0cGxhY2VcIiBhcHBlYXJzIGF0IHRoZSBlbmQgKG5vbi1DaGluZXNlIGZvcm1hdClcbiAgICAgIGNvbnN0IGRpc2NvdmVySW5kZXggPSBjb250ZW50LmluZGV4T2YoJ0Rpc2NvdmVyJylcbiAgICAgIGNvbnN0IG1hcmtldHBsYWNlSW5kZXggPSBjb250ZW50LmluZGV4T2YoJ0RpZnkgTWFya2V0cGxhY2UnKVxuXG4gICAgICAvLyBGb3Igbm9uLUNoaW5lc2UgbG9jYWxlcywgRGlzY292ZXIgc2hvdWxkIGNvbWUgYmVmb3JlIERpZnkgTWFya2V0cGxhY2VcbiAgICAgIGV4cGVjdChkaXNjb3ZlckluZGV4KS50b0JlTGVzc1RoYW4obWFya2V0cGxhY2VJbmRleClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbnRlbnQgU3RydWN0dXJlIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb250ZW50IFN0cnVjdHVyZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgY29tbWEgc2VwYXJhdG9ycyBiZXR3ZWVuIGNhdGVnb3JpZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBzdWJoZWFkaW5nID0gc2NyZWVuLmdldEJ5Um9sZSgnaGVhZGluZycsIHsgbGV2ZWw6IDIgfSlcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdWJoZWFkaW5nLnRleHRDb250ZW50IHx8ICcnXG5cbiAgICAgIC8vIENvbW1hcyBzaG91bGQgZXhpc3QgYmV0d2VlbiBjYXRlZ29yaWVzXG4gICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvTW9kZWxzW15cXG5cXHIsXFx1MjAyOFxcdTIwMjldKiwuKlRvb2xzW15cXG5cXHIsXFx1MjAyOFxcdTIwMjldKiwuKkRhdGEgU291cmNlc1teXFxuXFxyLFxcdTIwMjhcXHUyMDI5XSosLipUcmlnZ2Vyc1teXFxuXFxyLFxcdTIwMjhcXHUyMDI5XSosLipBZ2VudCBTdHJhdGVnaWVzW15cXG5cXHIsXFx1MjAyOFxcdTIwMjldKiwuKkV4dGVuc2lvbnMvKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgXCJhbmRcIiBiZWZvcmUgbGFzdCBjYXRlZ29yeSAoQnVuZGxlcyknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBzdWJoZWFkaW5nID0gc2NyZWVuLmdldEJ5Um9sZSgnaGVhZGluZycsIHsgbGV2ZWw6IDIgfSlcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdWJoZWFkaW5nLnRleHRDb250ZW50IHx8ICcnXG5cbiAgICAgIC8vIFwiYW5kXCIgc2hvdWxkIGFwcGVhciBiZWZvcmUgQnVuZGxlc1xuICAgICAgY29uc3QgYW5kSW5kZXggPSBjb250ZW50LmluZGV4T2YoJ2FuZCcpXG4gICAgICBjb25zdCBidW5kbGVzSW5kZXggPSBjb250ZW50LmluZGV4T2YoJ0J1bmRsZXMnKVxuXG4gICAgICBleHBlY3QoYW5kSW5kZXgpLnRvQmVMZXNzVGhhbihidW5kbGVzSW5kZXgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCB0ZXh0IGVsZW1lbnRzIGluIGNvcnJlY3Qgb3JkZXIgZm9yIGVuLVVTJywgKCkgPT4ge1xuICAgICAgbW9ja0RlZmF1bHRMb2NhbGUgPSAnZW4tVVMnXG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBzdWJoZWFkaW5nID0gc2NyZWVuLmdldEJ5Um9sZSgnaGVhZGluZycsIHsgbGV2ZWw6IDIgfSlcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdWJoZWFkaW5nLnRleHRDb250ZW50IHx8ICcnXG5cbiAgICAgIGNvbnN0IGV4cGVjdGVkT3JkZXIgPSBbXG4gICAgICAgICdEaXNjb3ZlcicsXG4gICAgICAgICdNb2RlbHMnLFxuICAgICAgICAnVG9vbHMnLFxuICAgICAgICAnRGF0YSBTb3VyY2VzJyxcbiAgICAgICAgJ1RyaWdnZXJzJyxcbiAgICAgICAgJ0FnZW50IFN0cmF0ZWdpZXMnLFxuICAgICAgICAnRXh0ZW5zaW9ucycsXG4gICAgICAgICdhbmQnLFxuICAgICAgICAnQnVuZGxlcycsXG4gICAgICAgICdpbicsXG4gICAgICAgICdEaWZ5IE1hcmtldHBsYWNlJyxcbiAgICAgIF1cblxuICAgICAgbGV0IGxhc3RJbmRleCA9IC0xXG4gICAgICBmb3IgKGNvbnN0IHRleHQgb2YgZXhwZWN0ZWRPcmRlcikge1xuICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBjb250ZW50LmluZGV4T2YodGV4dClcbiAgICAgICAgZXhwZWN0KGN1cnJlbnRJbmRleCkudG9CZUdyZWF0ZXJUaGFuKGxhc3RJbmRleClcbiAgICAgICAgbGFzdEluZGV4ID0gY3VycmVudEluZGV4XG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCB0ZXh0IGVsZW1lbnRzIGluIGNvcnJlY3Qgb3JkZXIgZm9yIHpoLUhhbnMnLCAoKSA9PiB7XG4gICAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICd6aC1IYW5zJ1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgY29uc3Qgc3ViaGVhZGluZyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAyIH0pXG4gICAgICBjb25zdCBjb250ZW50ID0gc3ViaGVhZGluZy50ZXh0Q29udGVudCB8fCAnJ1xuXG4gICAgICAvLyB6aC1IYW5zIG9yZGVyOiBpbiAtPiBEaWZ5IE1hcmtldHBsYWNlIC0+IERpc2NvdmVyIC0+IGNhdGVnb3JpZXMgLT4gYW5kIC0+IEJ1bmRsZXNcbiAgICAgIGNvbnN0IGluSW5kZXggPSBjb250ZW50LmluZGV4T2YoJ2luJylcbiAgICAgIGNvbnN0IG1hcmtldHBsYWNlSW5kZXggPSBjb250ZW50LmluZGV4T2YoJ0RpZnkgTWFya2V0cGxhY2UnKVxuICAgICAgY29uc3QgZGlzY292ZXJJbmRleCA9IGNvbnRlbnQuaW5kZXhPZignRGlzY292ZXInKVxuICAgICAgY29uc3QgbW9kZWxzSW5kZXggPSBjb250ZW50LmluZGV4T2YoJ01vZGVscycpXG5cbiAgICAgIGV4cGVjdChpbkluZGV4KS50b0JlTGVzc1RoYW4obWFya2V0cGxhY2VJbmRleClcbiAgICAgIGV4cGVjdChtYXJrZXRwbGFjZUluZGV4KS50b0JlTGVzc1RoYW4oZGlzY292ZXJJbmRleClcbiAgICAgIGV4cGVjdChkaXNjb3ZlckluZGV4KS50b0JlTGVzc1RoYW4obW9kZWxzSW5kZXgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBMYXlvdXQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0xheW91dCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgc2hyaW5rLTAgb24gaDEgaGVhZGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMSB9KVxuICAgICAgZXhwZWN0KGhlYWRpbmcpLnRvSGF2ZUNsYXNzKCdzaHJpbmstMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzaHJpbmstMCBvbiBoMiBzdWJoZWFkaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgY29uc3Qgc3ViaGVhZGluZyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAyIH0pXG4gICAgICBleHBlY3Qoc3ViaGVhZGluZykudG9IYXZlQ2xhc3MoJ3Nocmluay0wJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGZsZXggbGF5b3V0IG9uIGgyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgY29uc3Qgc3ViaGVhZGluZyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAyIH0pXG4gICAgICBleHBlY3Qoc3ViaGVhZGluZykudG9IYXZlQ2xhc3MoJ2ZsZXgnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgaXRlbXMtY2VudGVyIG9uIGgyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgY29uc3Qgc3ViaGVhZGluZyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAyIH0pXG4gICAgICBleHBlY3Qoc3ViaGVhZGluZykudG9IYXZlQ2xhc3MoJ2l0ZW1zLWNlbnRlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBqdXN0aWZ5LWNlbnRlciBvbiBoMicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAgIGNvbnN0IHN1YmhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KVxuICAgICAgZXhwZWN0KHN1YmhlYWRpbmcpLnRvSGF2ZUNsYXNzKCdqdXN0aWZ5LWNlbnRlcicpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBY2Nlc3NpYmlsaXR5IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgaGVhZGluZyBoaWVyYXJjaHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBoMSA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAxIH0pXG4gICAgICBjb25zdCBoMiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAyIH0pXG5cbiAgICAgIGV4cGVjdChoMSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGgyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSByZWFkYWJsZSB0ZXh0IGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuXG4gICAgICBjb25zdCBoMSA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAxIH0pXG4gICAgICBleHBlY3QoaDEudGV4dENvbnRlbnQpLm5vdC50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgdmlzaWJsZSBoMSBoZWFkaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgY29uc3QgaGVhZGluZyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAxIH0pXG4gICAgICBleHBlY3QoaGVhZGluZykudG9CZVZpc2libGUoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgdmlzaWJsZSBoMiBoZWFkaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgICAgY29uc3Qgc3ViaGVhZGluZyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2hlYWRpbmcnLCB7IGxldmVsOiAyIH0pXG4gICAgICBleHBlY3Qoc3ViaGVhZGluZykudG9CZVZpc2libGUoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW50ZWdyYXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRGVzY3JpcHRpb24gSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ2VuLVVTJ1xuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIGNvbXBsZXRlIGNvbXBvbmVudCBzdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RGVzY3JpcHRpb24gLz4pXG5cbiAgICAvLyBNYWluIGhlYWRpbmdzXG4gICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdoMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdoMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAvLyBBbGwgY2F0ZWdvcnkgc3BhbnNcbiAgICBjb25zdCBjYXRlZ29yeVNwYW5zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2R5LW1kLW1lZGl1bScpXG4gICAgZXhwZWN0KGNhdGVnb3J5U3BhbnMubGVuZ3RoKS50b0JlKDcpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgY29tcGxldGUgemgtSGFucyBzdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgbW9ja0RlZmF1bHRMb2NhbGUgPSAnemgtSGFucydcbiAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcblxuICAgIC8vIE1haW4gaGVhZGluZ3NcbiAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2gxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2gyJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgIC8vIEFsbCBjYXRlZ29yeSBzcGFuc1xuICAgIGNvbnN0IGNhdGVnb3J5U3BhbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmJvZHktbWQtbWVkaXVtJylcbiAgICBleHBlY3QoY2F0ZWdvcnlTcGFucy5sZW5ndGgpLnRvQmUoNylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNvcnJlY3RseSBkaWZmZXJlbnRpYXRlIGJldHdlZW4gemgtSGFucyBhbmQgZW4tVVMgbGF5b3V0cycsICgpID0+IHtcbiAgICAvLyBSZW5kZXIgZW4tVVNcbiAgICBtb2NrRGVmYXVsdExvY2FsZSA9ICdlbi1VUydcbiAgICBjb25zdCB7IGNvbnRhaW5lcjogZW5Db250YWluZXIsIHVubW91bnQ6IHVubW91bnRFbiB9ID0gcmVuZGVyKDxEZXNjcmlwdGlvbiAvPilcbiAgICBjb25zdCBlbkNvbnRlbnQgPSBlbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdoMicpPy50ZXh0Q29udGVudCB8fCAnJ1xuICAgIHVubW91bnRFbigpXG5cbiAgICAvLyBSZW5kZXIgemgtSGFuc1xuICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ3poLUhhbnMnXG4gICAgY29uc3QgeyBjb250YWluZXI6IHpoQ29udGFpbmVyIH0gPSByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuICAgIGNvbnN0IHpoQ29udGVudCA9IHpoQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2gyJyk/LnRleHRDb250ZW50IHx8ICcnXG5cbiAgICAvLyBCb3RoIHNob3VsZCBoYXZlIGFsbCBjYXRlZ29yaWVzXG4gICAgZXhwZWN0KGVuQ29udGVudCkudG9Db250YWluKCdNb2RlbHMnKVxuICAgIGV4cGVjdCh6aENvbnRlbnQpLnRvQ29udGFpbignTW9kZWxzJylcblxuICAgIC8vIEJ1dCBvcmRlciBzaG91bGQgZGlmZmVyXG4gICAgY29uc3QgZW5NYXJrZXRwbGFjZUluZGV4ID0gZW5Db250ZW50LmluZGV4T2YoJ0RpZnkgTWFya2V0cGxhY2UnKVxuICAgIGNvbnN0IGVuRGlzY292ZXJJbmRleCA9IGVuQ29udGVudC5pbmRleE9mKCdEaXNjb3ZlcicpXG4gICAgY29uc3QgemhNYXJrZXRwbGFjZUluZGV4ID0gemhDb250ZW50LmluZGV4T2YoJ0RpZnkgTWFya2V0cGxhY2UnKVxuICAgIGNvbnN0IHpoRGlzY292ZXJJbmRleCA9IHpoQ29udGVudC5pbmRleE9mKCdEaXNjb3ZlcicpXG5cbiAgICAvLyBlbi1VUzogRGlzY292ZXIgY29tZXMgYmVmb3JlIERpZnkgTWFya2V0cGxhY2VcbiAgICBleHBlY3QoZW5EaXNjb3ZlckluZGV4KS50b0JlTGVzc1RoYW4oZW5NYXJrZXRwbGFjZUluZGV4KVxuXG4gICAgLy8gemgtSGFuczogRGlmeSBNYXJrZXRwbGFjZSBjb21lcyBiZWZvcmUgRGlzY292ZXJcbiAgICBleHBlY3QoemhNYXJrZXRwbGFjZUluZGV4KS50b0JlTGVzc1RoYW4oemhEaXNjb3ZlckluZGV4KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbWFpbnRhaW4gY29uc2lzdGVudCBzdHlsaW5nIGFjcm9zcyBsb2NhbGVzJywgKCkgPT4ge1xuICAgIC8vIFJlbmRlciBlbi1VU1xuICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ2VuLVVTJ1xuICAgIGNvbnN0IHsgY29udGFpbmVyOiBlbkNvbnRhaW5lciwgdW5tb3VudDogdW5tb3VudEVuIH0gPSByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuICAgIGNvbnN0IGVuQ2F0ZWdvcnlDb3VudCA9IGVuQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2R5LW1kLW1lZGl1bScpLmxlbmd0aFxuICAgIHVubW91bnRFbigpXG5cbiAgICAvLyBSZW5kZXIgemgtSGFuc1xuICAgIG1vY2tEZWZhdWx0TG9jYWxlID0gJ3poLUhhbnMnXG4gICAgY29uc3QgeyBjb250YWluZXI6IHpoQ29udGFpbmVyIH0gPSByZW5kZXIoPERlc2NyaXB0aW9uIC8+KVxuICAgIGNvbnN0IHpoQ2F0ZWdvcnlDb3VudCA9IHpoQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2R5LW1kLW1lZGl1bScpLmxlbmd0aFxuXG4gICAgLy8gQm90aCBzaG91bGQgaGF2ZSBzYW1lIG51bWJlciBvZiBzdHlsZWQgY2F0ZWdvcnkgc3BhbnNcbiAgICBleHBlY3QoZW5DYXRlZ29yeUNvdW50KS50b0JlKHpoQ2F0ZWdvcnlDb3VudClcbiAgICBleHBlY3QoZW5DYXRlZ29yeUNvdW50KS50b0JlKDcpXG4gIH0pXG59KVxuIl19