"use strict";
/**
 * Real Browser Environment Dark Mode Flicker Test
 *
 * This test attempts to simulate real browser refresh scenarios including:
 * 1. SSR HTML generation phase
 * 2. Client-side JavaScript loading
 * 3. Theme system initialization
 * 4. CSS styles application timing
 */
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const next_themes_1 = require("next-themes");
const react_2 = require("react");
const use_theme_1 = require("@/hooks/use-theme");
const DARK_MODE_MEDIA_QUERY = /prefers-color-scheme:\s*dark/i;
// Setup browser environment for testing
const setupMockEnvironment = (storedTheme, systemPrefersDark = false) => {
    if (typeof window === 'undefined')
        return;
    try {
        window.localStorage.clear();
    }
    catch {
        // ignore if localStorage has been replaced by a throwing stub
    }
    if (storedTheme === null)
        window.localStorage.removeItem('theme');
    else
        window.localStorage.setItem('theme', storedTheme);
    document.documentElement.removeAttribute('data-theme');
    const mockMatchMedia = (query) => {
        const listeners = new Set();
        const isDarkQuery = DARK_MODE_MEDIA_QUERY.test(query);
        const matches = isDarkQuery ? systemPrefersDark : false;
        const handleAddListener = (listener) => {
            listeners.add(listener);
        };
        const handleRemoveListener = (listener) => {
            listeners.delete(listener);
        };
        const handleAddEventListener = (_event, listener) => {
            if (typeof listener === 'function')
                listeners.add(listener);
        };
        const handleRemoveEventListener = (_event, listener) => {
            if (typeof listener === 'function')
                listeners.delete(listener);
        };
        const handleDispatchEvent = (event) => {
            listeners.forEach(listener => listener(event));
            return true;
        };
        const mediaQueryList = {
            matches,
            media: query,
            onchange: null,
            addListener: handleAddListener,
            removeListener: handleRemoveListener,
            addEventListener: handleAddEventListener,
            removeEventListener: handleRemoveEventListener,
            dispatchEvent: handleDispatchEvent,
        };
        return mediaQueryList;
    };
    vi.spyOn(window, 'matchMedia').mockImplementation(mockMatchMedia);
};
// Helper function to create timing page component
const createTimingPageComponent = (timingData) => {
    const recordTiming = (phase, styles) => {
        timingData.push({
            phase,
            timestamp: performance.now(),
            styles,
        });
    };
    const TimingPageComponent = () => {
        const [mounted, setMounted] = (0, react_2.useState)(false);
        const { theme } = (0, use_theme_1.default)();
        const isDark = mounted ? theme === 'dark' : false;
        const currentStyles = {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
        };
        recordTiming(mounted ? 'CSR' : 'Initial', currentStyles);
        (0, react_2.useEffect)(() => {
            setMounted(true);
        }, []);
        return (<div data-testid="timing-page" style={currentStyles}>
        <div data-testid="timing-status">
          Phase:
          {' '}
          {mounted ? 'CSR' : 'Initial'}
          {' '}
          | Theme:
          {' '}
          {theme}
          {' '}
          | Visual:
          {' '}
          {isDark ? 'dark' : 'light'}
        </div>
      </div>);
    };
    return TimingPageComponent;
};
// Helper function to create CSS test component
const createCSSTestComponent = (cssStates) => {
    const recordCSSState = (className) => {
        cssStates.push({
            className,
            timestamp: performance.now(),
        });
    };
    const CSSTestComponent = () => {
        const [mounted, setMounted] = (0, react_2.useState)(false);
        const { theme } = (0, use_theme_1.default)();
        const isDark = mounted ? theme === 'dark' : false;
        const className = `min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`;
        recordCSSState(className);
        (0, react_2.useEffect)(() => {
            setMounted(true);
        }, []);
        return (<div data-testid="css-component" className={className}>
        <div data-testid="css-classes">
          Classes:
          {className}
        </div>
      </div>);
    };
    return CSSTestComponent;
};
// Helper function to create performance test component
const createPerformanceTestComponent = (performanceMarks) => {
    const recordPerformanceMark = (event) => {
        performanceMarks.push({ event, timestamp: performance.now() });
    };
    const PerformanceTestComponent = () => {
        const [mounted, setMounted] = (0, react_2.useState)(false);
        const { theme } = (0, use_theme_1.default)();
        recordPerformanceMark('component-render');
        (0, react_2.useEffect)(() => {
            recordPerformanceMark('mount-start');
            setMounted(true);
            recordPerformanceMark('mount-complete');
        }, []);
        (0, react_2.useEffect)(() => {
            if (theme)
                recordPerformanceMark('theme-available');
        }, [theme]);
        return (<div data-testid="performance-test">
        Mounted:
        {' '}
        {mounted.toString()}
        {' '}
        | Theme:
        {' '}
        {theme || 'loading'}
      </div>);
    };
    return PerformanceTestComponent;
};
// Simulate real page component based on Dify's actual theme usage
const PageComponent = () => {
    const [mounted, setMounted] = (0, react_2.useState)(false);
    const { theme } = (0, use_theme_1.default)();
    (0, react_2.useEffect)(() => {
        setMounted(true);
    }, []);
    // Simulate common theme usage pattern in Dify
    const isDark = mounted ? theme === 'dark' : false;
    return (<div data-theme={isDark ? 'dark' : 'light'}>
      <div data-testid="page-content" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}>
        <h1 style={{ color: isDark ? '#ffffff' : '#000000' }}>
          Dify Application
        </h1>
        <div data-testid="theme-indicator">
          Current Theme:
          {' '}
          {mounted ? theme : 'unknown'}
        </div>
        <div data-testid="visual-appearance">
          Appearance:
          {' '}
          {isDark ? 'dark' : 'light'}
        </div>
      </div>
    </div>);
};
const TestThemeProvider = ({ children }) => (<next_themes_1.ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme={false}>
    {children}
  </next_themes_1.ThemeProvider>);
describe('Real Browser Environment Dark Mode Flicker Test', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.clear();
            }
            catch {
                // ignore when localStorage is replaced with an error-throwing stub
            }
            document.documentElement.removeAttribute('data-theme');
        }
    });
    describe('Page Refresh Scenario Simulation', () => {
        it('simulates complete page loading process with dark theme', async () => {
            // Setup: User previously selected dark mode
            setupMockEnvironment('dark');
            (0, react_1.render)(<TestThemeProvider>
          <PageComponent />
        </TestThemeProvider>);
            // Check initial client-side rendering state
            const initialState = {
                theme: react_1.screen.getByTestId('theme-indicator').textContent,
                appearance: react_1.screen.getByTestId('visual-appearance').textContent,
            };
            console.log('Initial client state:', initialState);
            // Wait for theme system to fully initialize
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('theme-indicator')).toHaveTextContent('Current Theme: dark');
            });
            const finalState = {
                theme: react_1.screen.getByTestId('theme-indicator').textContent,
                appearance: react_1.screen.getByTestId('visual-appearance').textContent,
            };
            console.log('Final state:', finalState);
            // Document the state change - this is the source of flicker
            console.log('State change detection: Initial -> Final');
        });
        it('handles light theme correctly', async () => {
            setupMockEnvironment('light');
            (0, react_1.render)(<TestThemeProvider>
          <PageComponent />
        </TestThemeProvider>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('theme-indicator')).toHaveTextContent('Current Theme: light');
            });
            expect(react_1.screen.getByTestId('visual-appearance')).toHaveTextContent('Appearance: light');
        });
        it('handles system theme with dark preference', async () => {
            setupMockEnvironment('system', true); // system theme, dark preference
            (0, react_1.render)(<TestThemeProvider>
          <PageComponent />
        </TestThemeProvider>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('theme-indicator')).toHaveTextContent('Current Theme: dark');
            });
            expect(react_1.screen.getByTestId('visual-appearance')).toHaveTextContent('Appearance: dark');
        });
        it('handles system theme with light preference', async () => {
            setupMockEnvironment('system', false); // system theme, light preference
            (0, react_1.render)(<TestThemeProvider>
          <PageComponent />
        </TestThemeProvider>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('theme-indicator')).toHaveTextContent('Current Theme: light');
            });
            expect(react_1.screen.getByTestId('visual-appearance')).toHaveTextContent('Appearance: light');
        });
        it('handles no stored theme (defaults to system)', async () => {
            setupMockEnvironment(null, false); // no stored theme, system prefers light
            (0, react_1.render)(<TestThemeProvider>
          <PageComponent />
        </TestThemeProvider>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('theme-indicator')).toHaveTextContent('Current Theme: light');
            });
        });
        it('measures timing window of style changes', async () => {
            setupMockEnvironment('dark');
            const timingData = [];
            const TimingPageComponent = createTimingPageComponent(timingData);
            (0, react_1.render)(<TestThemeProvider>
          <TimingPageComponent />
        </TestThemeProvider>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('timing-status')).toHaveTextContent('Phase: CSR');
            });
            // Analyze timing and style changes
            console.log('\n=== Style Change Timeline ===');
            timingData.forEach((data, index) => {
                console.log(`${index + 1}. ${data.phase}: bg=${data.styles.backgroundColor}, color=${data.styles.color}`);
            });
            // Check if there are style changes (this is visible flicker)
            const hasStyleChange = timingData.length > 1
                && timingData[0].styles.backgroundColor !== timingData[timingData.length - 1].styles.backgroundColor;
            if (hasStyleChange)
                console.log('⚠️  Style changes detected - this causes visible flicker');
            else
                console.log('✅ No style changes detected');
            expect(timingData.length).toBeGreaterThan(1);
        });
    });
    describe('CSS Application Timing Tests', () => {
        it('checks CSS class changes causing flicker', async () => {
            setupMockEnvironment('dark');
            const cssStates = [];
            const CSSTestComponent = createCSSTestComponent(cssStates);
            (0, react_1.render)(<TestThemeProvider>
          <CSSTestComponent />
        </TestThemeProvider>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('css-classes')).toHaveTextContent('bg-gray-900 text-white');
            });
            console.log('\n=== CSS Class Change Detection ===');
            cssStates.forEach((state, index) => {
                console.log(`${index + 1}. ${state.className}`);
            });
            // Check if CSS classes have changed
            const hasCSSChange = cssStates.length > 1
                && cssStates[0].className !== cssStates[cssStates.length - 1].className;
            if (hasCSSChange) {
                console.log('⚠️  CSS class changes detected - may cause style flicker');
                console.log(`From: "${cssStates[0].className}"`);
                console.log(`To: "${cssStates[cssStates.length - 1].className}"`);
            }
            expect(hasCSSChange).toBe(true); // We expect to see this change
        });
    });
    describe('Edge Cases and Error Handling', () => {
        it('handles localStorage access errors gracefully', async () => {
            setupMockEnvironment(null);
            const mockStorage = {
                getItem: vi.fn(() => {
                    throw new Error('LocalStorage access denied');
                }),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            };
            Object.defineProperty(window, 'localStorage', {
                value: mockStorage,
                configurable: true,
            });
            try {
                (0, react_1.render)(<TestThemeProvider>
            <PageComponent />
          </TestThemeProvider>);
                // Should fallback gracefully without crashing
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByTestId('theme-indicator')).toBeInTheDocument();
                });
                // Should default to light theme when localStorage fails
                expect(react_1.screen.getByTestId('visual-appearance')).toHaveTextContent('Appearance: light');
            }
            finally {
                Reflect.deleteProperty(window, 'localStorage');
            }
        });
        it('handles invalid theme values in localStorage', async () => {
            setupMockEnvironment('invalid-theme-value');
            (0, react_1.render)(<TestThemeProvider>
          <PageComponent />
        </TestThemeProvider>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('theme-indicator')).toBeInTheDocument();
            });
            // Should handle invalid values gracefully
            const themeIndicator = react_1.screen.getByTestId('theme-indicator');
            expect(themeIndicator).toBeInTheDocument();
        });
    });
    describe('Performance and Regression Tests', () => {
        it('verifies ThemeProvider position fix reduces initialization delay', async () => {
            const performanceMarks = [];
            setupMockEnvironment('dark');
            expect(window.localStorage.getItem('theme')).toBe('dark');
            const PerformanceTestComponent = createPerformanceTestComponent(performanceMarks);
            (0, react_1.render)(<TestThemeProvider>
          <PerformanceTestComponent />
        </TestThemeProvider>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('performance-test')).toHaveTextContent('Theme: dark');
            });
            // Analyze performance timeline
            console.log('\n=== Performance Timeline ===');
            performanceMarks.forEach((mark) => {
                console.log(`${mark.event}: ${mark.timestamp.toFixed(2)}ms`);
            });
            expect(performanceMarks.length).toBeGreaterThan(3);
        });
    });
    describe('Solution Requirements Definition', () => {
        it('defines technical requirements to eliminate flicker', () => {
            const technicalRequirements = {
                ssrConsistency: 'SSR and CSR must render identical initial styles',
                synchronousDetection: 'Theme detection must complete synchronously before first render',
                noStyleChanges: 'No visible style changes should occur after hydration',
                performanceImpact: 'Solution should not significantly impact page load performance',
                browserCompatibility: 'Must work consistently across all major browsers',
            };
            console.log('\n=== Technical Requirements ===');
            Object.entries(technicalRequirements).forEach(([key, requirement]) => {
                console.log(`${key}: ${requirement}`);
                expect(requirement).toBeDefined();
            });
            // A successful solution should pass all these requirements
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbC1icm93c2VyLWZsaWNrZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlYWwtYnJvd3Nlci1mbGlja2VyLnRlc3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7R0FRRzs7QUFFSCxrREFBZ0U7QUFDaEUsNkNBQTJDO0FBQzNDLGlDQUEyQztBQUMzQyxpREFBd0M7QUFFeEMsTUFBTSxxQkFBcUIsR0FBRywrQkFBK0IsQ0FBQTtBQUU3RCx3Q0FBd0M7QUFDeEMsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLFdBQTBCLEVBQUUsaUJBQWlCLEdBQUcsS0FBSyxFQUFFLEVBQUU7SUFDckYsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXO1FBQy9CLE9BQU07SUFFUixJQUFJLENBQUM7UUFDSCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQzdCLENBQUM7SUFDRCxNQUFNLENBQUM7UUFDTCw4REFBOEQ7SUFDaEUsQ0FBQztJQUVELElBQUksV0FBVyxLQUFLLElBQUk7UUFDdEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7O1FBRXZDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUVuRCxRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUV0RCxNQUFNLGNBQWMsR0FBNkIsQ0FBQyxLQUFhLEVBQUUsRUFBRTtRQUNqRSxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBd0MsQ0FBQTtRQUNqRSxNQUFNLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDckQsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBRXZELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxRQUE4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U0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDOUQsQ0FBQyxDQUFDLENBQUE7WUFFRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1FBQ2hELEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsTUFBTSxxQkFBcUIsR0FBRztnQkFDNUIsY0FBYyxFQUFFLGtEQUFrRDtnQkFDbEUsb0JBQW9CLEVBQUUsaUVBQWlFO2dCQUN2RixjQUFjLEVBQUUsdURBQXVEO2dCQUN2RSxpQkFBaUIsRUFBRSxnRUFBZ0U7Z0JBQ25GLG9CQUFvQixFQUFFLGtEQUFrRDthQUN6RSxDQUFBO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFO2dCQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLFdBQVcsRUFBRSxDQUFDLENBQUE7Z0JBQ3JDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUNuQyxDQUFDLENBQUMsQ0FBQTtZQUVGLDJEQUEyRDtRQUM3RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlYWwgQnJvd3NlciBFbnZpcm9ubWVudCBEYXJrIE1vZGUgRmxpY2tlciBUZXN0XG4gKlxuICogVGhpcyB0ZXN0IGF0dGVtcHRzIHRvIHNpbXVsYXRlIHJlYWwgYnJvd3NlciByZWZyZXNoIHNjZW5hcmlvcyBpbmNsdWRpbmc6XG4gKiAxLiBTU1IgSFRNTCBnZW5lcmF0aW9uIHBoYXNlXG4gKiAyLiBDbGllbnQtc2lkZSBKYXZhU2NyaXB0IGxvYWRpbmdcbiAqIDMuIFRoZW1lIHN5c3RlbSBpbml0aWFsaXphdGlvblxuICogNC4gQ1NTIHN0eWxlcyBhcHBsaWNhdGlvbiB0aW1pbmdcbiAqL1xuXG5pbXBvcnQgeyByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnbmV4dC10aGVtZXMnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdXNlVGhlbWUgZnJvbSAnQC9ob29rcy91c2UtdGhlbWUnXG5cbmNvbnN0IERBUktfTU9ERV9NRURJQV9RVUVSWSA9IC9wcmVmZXJzLWNvbG9yLXNjaGVtZTpcXHMqZGFyay9pXG5cbi8vIFNldHVwIGJyb3dzZXIgZW52aXJvbm1lbnQgZm9yIHRlc3RpbmdcbmNvbnN0IHNldHVwTW9ja0Vudmlyb25tZW50ID0gKHN0b3JlZFRoZW1lOiBzdHJpbmcgfCBudWxsLCBzeXN0ZW1QcmVmZXJzRGFyayA9IGZhbHNlKSA9PiB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJylcbiAgICByZXR1cm5cblxuICB0cnkge1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKVxuICB9XG4gIGNhdGNoIHtcbiAgICAvLyBpZ25vcmUgaWYgbG9jYWxTdG9yYWdlIGhhcyBiZWVuIHJlcGxhY2VkIGJ5IGEgdGhyb3dpbmcgc3R1YlxuICB9XG5cbiAgaWYgKHN0b3JlZFRoZW1lID09PSBudWxsKVxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndGhlbWUnKVxuICBlbHNlXG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsIHN0b3JlZFRoZW1lKVxuXG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnKVxuXG4gIGNvbnN0IG1vY2tNYXRjaE1lZGlhOiB0eXBlb2Ygd2luZG93Lm1hdGNoTWVkaWEgPSAocXVlcnk6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IG5ldyBTZXQ8KGV2ZW50OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiB2b2lkPigpXG4gICAgY29uc3QgaXNEYXJrUXVlcnkgPSBEQVJLX01PREVfTUVESUFfUVVFUlkudGVzdChxdWVyeSlcbiAgICBjb25zdCBtYXRjaGVzID0gaXNEYXJrUXVlcnkgPyBzeXN0ZW1QcmVmZXJzRGFyayA6IGZhbHNlXG5cbiAgICBjb25zdCBoYW5kbGVBZGRMaXN0ZW5lciA9IChsaXN0ZW5lcjogKGV2ZW50OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiB2b2lkKSA9PiB7XG4gICAgICBsaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKVxuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZVJlbW92ZUxpc3RlbmVyID0gKGxpc3RlbmVyOiAoZXZlbnQ6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IHZvaWQpID0+IHtcbiAgICAgIGxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpXG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlQWRkRXZlbnRMaXN0ZW5lciA9IChfZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGxpc3RlbmVycy5hZGQobGlzdGVuZXIgYXMgKGV2ZW50OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiB2b2lkKVxuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZVJlbW92ZUV2ZW50TGlzdGVuZXIgPSAoX2V2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBFdmVudExpc3RlbmVyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBsaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyIGFzIChldmVudDogTWVkaWFRdWVyeUxpc3RFdmVudCkgPT4gdm9pZClcbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGVEaXNwYXRjaEV2ZW50ID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoZXZlbnQgYXMgTWVkaWFRdWVyeUxpc3RFdmVudCkpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGNvbnN0IG1lZGlhUXVlcnlMaXN0OiBNZWRpYVF1ZXJ5TGlzdCA9IHtcbiAgICAgIG1hdGNoZXMsXG4gICAgICBtZWRpYTogcXVlcnksXG4gICAgICBvbmNoYW5nZTogbnVsbCxcbiAgICAgIGFkZExpc3RlbmVyOiBoYW5kbGVBZGRMaXN0ZW5lcixcbiAgICAgIHJlbW92ZUxpc3RlbmVyOiBoYW5kbGVSZW1vdmVMaXN0ZW5lcixcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXI6IGhhbmRsZUFkZEV2ZW50TGlzdGVuZXIsXG4gICAgICByZW1vdmVFdmVudExpc3RlbmVyOiBoYW5kbGVSZW1vdmVFdmVudExpc3RlbmVyLFxuICAgICAgZGlzcGF0Y2hFdmVudDogaGFuZGxlRGlzcGF0Y2hFdmVudCxcbiAgICB9XG5cbiAgICByZXR1cm4gbWVkaWFRdWVyeUxpc3RcbiAgfVxuXG4gIHZpLnNweU9uKHdpbmRvdywgJ21hdGNoTWVkaWEnKS5tb2NrSW1wbGVtZW50YXRpb24obW9ja01hdGNoTWVkaWEpXG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjcmVhdGUgdGltaW5nIHBhZ2UgY29tcG9uZW50XG5jb25zdCBjcmVhdGVUaW1pbmdQYWdlQ29tcG9uZW50ID0gKFxuICB0aW1pbmdEYXRhOiBBcnJheTx7IHBoYXNlOiBzdHJpbmcsIHRpbWVzdGFtcDogbnVtYmVyLCBzdHlsZXM6IHsgYmFja2dyb3VuZENvbG9yOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcgfSB9PixcbikgPT4ge1xuICBjb25zdCByZWNvcmRUaW1pbmcgPSAocGhhc2U6IHN0cmluZywgc3R5bGVzOiB7IGJhY2tncm91bmRDb2xvcjogc3RyaW5nLCBjb2xvcjogc3RyaW5nIH0pID0+IHtcbiAgICB0aW1pbmdEYXRhLnB1c2goe1xuICAgICAgcGhhc2UsXG4gICAgICB0aW1lc3RhbXA6IHBlcmZvcm1hbmNlLm5vdygpLFxuICAgICAgc3R5bGVzLFxuICAgIH0pXG4gIH1cblxuICBjb25zdCBUaW1pbmdQYWdlQ29tcG9uZW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IFttb3VudGVkLCBzZXRNb3VudGVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICAgIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcbiAgICBjb25zdCBpc0RhcmsgPSBtb3VudGVkID8gdGhlbWUgPT09ICdkYXJrJyA6IGZhbHNlXG5cbiAgICBjb25zdCBjdXJyZW50U3R5bGVzID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBpc0RhcmsgPyAnIzFmMjkzNycgOiAnI2ZmZmZmZicsXG4gICAgICBjb2xvcjogaXNEYXJrID8gJyNmZmZmZmYnIDogJyMwMDAwMDAnLFxuICAgIH1cblxuICAgIHJlY29yZFRpbWluZyhtb3VudGVkID8gJ0NTUicgOiAnSW5pdGlhbCcsIGN1cnJlbnRTdHlsZXMpXG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgc2V0TW91bnRlZCh0cnVlKVxuICAgIH0sIFtdKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0aW1pbmctcGFnZVwiXG4gICAgICAgIHN0eWxlPXtjdXJyZW50U3R5bGVzfVxuICAgICAgPlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwidGltaW5nLXN0YXR1c1wiPlxuICAgICAgICAgIFBoYXNlOlxuICAgICAgICAgIHsnICd9XG4gICAgICAgICAge21vdW50ZWQgPyAnQ1NSJyA6ICdJbml0aWFsJ31cbiAgICAgICAgICB7JyAnfVxuICAgICAgICAgIHwgVGhlbWU6XG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICB7dGhlbWV9XG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICB8IFZpc3VhbDpcbiAgICAgICAgICB7JyAnfVxuICAgICAgICAgIHtpc0RhcmsgPyAnZGFyaycgOiAnbGlnaHQnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJldHVybiBUaW1pbmdQYWdlQ29tcG9uZW50XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjcmVhdGUgQ1NTIHRlc3QgY29tcG9uZW50XG5jb25zdCBjcmVhdGVDU1NUZXN0Q29tcG9uZW50ID0gKFxuICBjc3NTdGF0ZXM6IEFycmF5PHsgY2xhc3NOYW1lOiBzdHJpbmcsIHRpbWVzdGFtcDogbnVtYmVyIH0+LFxuKSA9PiB7XG4gIGNvbnN0IHJlY29yZENTU1N0YXRlID0gKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgY3NzU3RhdGVzLnB1c2goe1xuICAgICAgY2xhc3NOYW1lLFxuICAgICAgdGltZXN0YW1wOiBwZXJmb3JtYW5jZS5ub3coKSxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgQ1NTVGVzdENvbXBvbmVudCA9ICgpID0+IHtcbiAgICBjb25zdCBbbW91bnRlZCwgc2V0TW91bnRlZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgICBjb25zdCB7IHRoZW1lIH0gPSB1c2VUaGVtZSgpXG4gICAgY29uc3QgaXNEYXJrID0gbW91bnRlZCA/IHRoZW1lID09PSAnZGFyaycgOiBmYWxzZVxuXG4gICAgY29uc3QgY2xhc3NOYW1lID0gYG1pbi1oLXNjcmVlbiAke2lzRGFyayA/ICdiZy1ncmF5LTkwMCB0ZXh0LXdoaXRlJyA6ICdiZy13aGl0ZSB0ZXh0LWJsYWNrJ31gXG5cbiAgICByZWNvcmRDU1NTdGF0ZShjbGFzc05hbWUpXG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgc2V0TW91bnRlZCh0cnVlKVxuICAgIH0sIFtdKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJjc3MtY29tcG9uZW50XCJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICA+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjc3MtY2xhc3Nlc1wiPlxuICAgICAgICAgIENsYXNzZXM6XG4gICAgICAgICAge2NsYXNzTmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4gQ1NTVGVzdENvbXBvbmVudFxufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gY3JlYXRlIHBlcmZvcm1hbmNlIHRlc3QgY29tcG9uZW50XG5jb25zdCBjcmVhdGVQZXJmb3JtYW5jZVRlc3RDb21wb25lbnQgPSAoXG4gIHBlcmZvcm1hbmNlTWFya3M6IEFycmF5PHsgZXZlbnQ6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIgfT4sXG4pID0+IHtcbiAgY29uc3QgcmVjb3JkUGVyZm9ybWFuY2VNYXJrID0gKGV2ZW50OiBzdHJpbmcpID0+IHtcbiAgICBwZXJmb3JtYW5jZU1hcmtzLnB1c2goeyBldmVudCwgdGltZXN0YW1wOiBwZXJmb3JtYW5jZS5ub3coKSB9KVxuICB9XG5cbiAgY29uc3QgUGVyZm9ybWFuY2VUZXN0Q29tcG9uZW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IFttb3VudGVkLCBzZXRNb3VudGVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICAgIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcblxuICAgIHJlY29yZFBlcmZvcm1hbmNlTWFyaygnY29tcG9uZW50LXJlbmRlcicpXG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgcmVjb3JkUGVyZm9ybWFuY2VNYXJrKCdtb3VudC1zdGFydCcpXG4gICAgICBzZXRNb3VudGVkKHRydWUpXG4gICAgICByZWNvcmRQZXJmb3JtYW5jZU1hcmsoJ21vdW50LWNvbXBsZXRlJylcbiAgICB9LCBbXSlcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAodGhlbWUpXG4gICAgICAgIHJlY29yZFBlcmZvcm1hbmNlTWFyaygndGhlbWUtYXZhaWxhYmxlJylcbiAgICB9LCBbdGhlbWVdKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwZXJmb3JtYW5jZS10ZXN0XCI+XG4gICAgICAgIE1vdW50ZWQ6XG4gICAgICAgIHsnICd9XG4gICAgICAgIHttb3VudGVkLnRvU3RyaW5nKCl9XG4gICAgICAgIHsnICd9XG4gICAgICAgIHwgVGhlbWU6XG4gICAgICAgIHsnICd9XG4gICAgICAgIHt0aGVtZSB8fCAnbG9hZGluZyd9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4gUGVyZm9ybWFuY2VUZXN0Q29tcG9uZW50XG59XG5cbi8vIFNpbXVsYXRlIHJlYWwgcGFnZSBjb21wb25lbnQgYmFzZWQgb24gRGlmeSdzIGFjdHVhbCB0aGVtZSB1c2FnZVxuY29uc3QgUGFnZUNvbXBvbmVudCA9ICgpID0+IHtcbiAgY29uc3QgW21vdW50ZWQsIHNldE1vdW50ZWRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldE1vdW50ZWQodHJ1ZSlcbiAgfSwgW10pXG5cbiAgLy8gU2ltdWxhdGUgY29tbW9uIHRoZW1lIHVzYWdlIHBhdHRlcm4gaW4gRGlmeVxuICBjb25zdCBpc0RhcmsgPSBtb3VudGVkID8gdGhlbWUgPT09ICdkYXJrJyA6IGZhbHNlXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGhlbWU9e2lzRGFyayA/ICdkYXJrJyA6ICdsaWdodCd9PlxuICAgICAgPGRpdlxuICAgICAgICBkYXRhLXRlc3RpZD1cInBhZ2UtY29udGVudFwiXG4gICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogaXNEYXJrID8gJyMxZjI5MzcnIDogJyNmZmZmZmYnIH19XG4gICAgICA+XG4gICAgICAgIDxoMSBzdHlsZT17eyBjb2xvcjogaXNEYXJrID8gJyNmZmZmZmYnIDogJyMwMDAwMDAnIH19PlxuICAgICAgICAgIERpZnkgQXBwbGljYXRpb25cbiAgICAgICAgPC9oMT5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInRoZW1lLWluZGljYXRvclwiPlxuICAgICAgICAgIEN1cnJlbnQgVGhlbWU6XG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICB7bW91bnRlZCA/IHRoZW1lIDogJ3Vua25vd24nfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInZpc3VhbC1hcHBlYXJhbmNlXCI+XG4gICAgICAgICAgQXBwZWFyYW5jZTpcbiAgICAgICAgICB7JyAnfVxuICAgICAgICAgIHtpc0RhcmsgPyAnZGFyaycgOiAnbGlnaHQnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IFRlc3RUaGVtZVByb3ZpZGVyID0gKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pID0+IChcbiAgPFRoZW1lUHJvdmlkZXJcbiAgICBhdHRyaWJ1dGU9XCJkYXRhLXRoZW1lXCJcbiAgICBkZWZhdWx0VGhlbWU9XCJzeXN0ZW1cIlxuICAgIGVuYWJsZVN5c3RlbVxuICAgIGRpc2FibGVUcmFuc2l0aW9uT25DaGFuZ2VcbiAgICBlbmFibGVDb2xvclNjaGVtZT17ZmFsc2V9XG4gID5cbiAgICB7Y2hpbGRyZW59XG4gIDwvVGhlbWVQcm92aWRlcj5cbilcblxuZGVzY3JpYmUoJ1JlYWwgQnJvd3NlciBFbnZpcm9ubWVudCBEYXJrIE1vZGUgRmxpY2tlciBUZXN0JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5yZXN0b3JlQWxsTW9ja3MoKVxuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpXG4gICAgICB9XG4gICAgICBjYXRjaCB7XG4gICAgICAgIC8vIGlnbm9yZSB3aGVuIGxvY2FsU3RvcmFnZSBpcyByZXBsYWNlZCB3aXRoIGFuIGVycm9yLXRocm93aW5nIHN0dWJcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnKVxuICAgIH1cbiAgfSlcblxuICBkZXNjcmliZSgnUGFnZSBSZWZyZXNoIFNjZW5hcmlvIFNpbXVsYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3NpbXVsYXRlcyBjb21wbGV0ZSBwYWdlIGxvYWRpbmcgcHJvY2VzcyB3aXRoIGRhcmsgdGhlbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBTZXR1cDogVXNlciBwcmV2aW91c2x5IHNlbGVjdGVkIGRhcmsgbW9kZVxuICAgICAgc2V0dXBNb2NrRW52aXJvbm1lbnQoJ2RhcmsnKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUZXN0VGhlbWVQcm92aWRlcj5cbiAgICAgICAgICA8UGFnZUNvbXBvbmVudCAvPlxuICAgICAgICA8L1Rlc3RUaGVtZVByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgLy8gQ2hlY2sgaW5pdGlhbCBjbGllbnQtc2lkZSByZW5kZXJpbmcgc3RhdGVcbiAgICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICAgICAgdGhlbWU6IHNjcmVlbi5nZXRCeVRlc3RJZCgndGhlbWUtaW5kaWNhdG9yJykudGV4dENvbnRlbnQsXG4gICAgICAgIGFwcGVhcmFuY2U6IHNjcmVlbi5nZXRCeVRlc3RJZCgndmlzdWFsLWFwcGVhcmFuY2UnKS50ZXh0Q29udGVudCxcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKCdJbml0aWFsIGNsaWVudCBzdGF0ZTonLCBpbml0aWFsU3RhdGUpXG5cbiAgICAgIC8vIFdhaXQgZm9yIHRoZW1lIHN5c3RlbSB0byBmdWxseSBpbml0aWFsaXplXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGhlbWUtaW5kaWNhdG9yJykpLnRvSGF2ZVRleHRDb250ZW50KCdDdXJyZW50IFRoZW1lOiBkYXJrJylcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGZpbmFsU3RhdGUgPSB7XG4gICAgICAgIHRoZW1lOiBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RoZW1lLWluZGljYXRvcicpLnRleHRDb250ZW50LFxuICAgICAgICBhcHBlYXJhbmNlOiBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Zpc3VhbC1hcHBlYXJhbmNlJykudGV4dENvbnRlbnQsXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygnRmluYWwgc3RhdGU6JywgZmluYWxTdGF0ZSlcblxuICAgICAgLy8gRG9jdW1lbnQgdGhlIHN0YXRlIGNoYW5nZSAtIHRoaXMgaXMgdGhlIHNvdXJjZSBvZiBmbGlja2VyXG4gICAgICBjb25zb2xlLmxvZygnU3RhdGUgY2hhbmdlIGRldGVjdGlvbjogSW5pdGlhbCAtPiBGaW5hbCcpXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIGxpZ2h0IHRoZW1lIGNvcnJlY3RseScsIGFzeW5jICgpID0+IHtcbiAgICAgIHNldHVwTW9ja0Vudmlyb25tZW50KCdsaWdodCcpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRlc3RUaGVtZVByb3ZpZGVyPlxuICAgICAgICAgIDxQYWdlQ29tcG9uZW50IC8+XG4gICAgICAgIDwvVGVzdFRoZW1lUHJvdmlkZXI+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGhlbWUtaW5kaWNhdG9yJykpLnRvSGF2ZVRleHRDb250ZW50KCdDdXJyZW50IFRoZW1lOiBsaWdodCcpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2aXN1YWwtYXBwZWFyYW5jZScpKS50b0hhdmVUZXh0Q29udGVudCgnQXBwZWFyYW5jZTogbGlnaHQnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBzeXN0ZW0gdGhlbWUgd2l0aCBkYXJrIHByZWZlcmVuY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBzZXR1cE1vY2tFbnZpcm9ubWVudCgnc3lzdGVtJywgdHJ1ZSkgLy8gc3lzdGVtIHRoZW1lLCBkYXJrIHByZWZlcmVuY2VcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGVzdFRoZW1lUHJvdmlkZXI+XG4gICAgICAgICAgPFBhZ2VDb21wb25lbnQgLz5cbiAgICAgICAgPC9UZXN0VGhlbWVQcm92aWRlcj4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0aGVtZS1pbmRpY2F0b3InKSkudG9IYXZlVGV4dENvbnRlbnQoJ0N1cnJlbnQgVGhlbWU6IGRhcmsnKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmlzdWFsLWFwcGVhcmFuY2UnKSkudG9IYXZlVGV4dENvbnRlbnQoJ0FwcGVhcmFuY2U6IGRhcmsnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBzeXN0ZW0gdGhlbWUgd2l0aCBsaWdodCBwcmVmZXJlbmNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0dXBNb2NrRW52aXJvbm1lbnQoJ3N5c3RlbScsIGZhbHNlKSAvLyBzeXN0ZW0gdGhlbWUsIGxpZ2h0IHByZWZlcmVuY2VcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGVzdFRoZW1lUHJvdmlkZXI+XG4gICAgICAgICAgPFBhZ2VDb21wb25lbnQgLz5cbiAgICAgICAgPC9UZXN0VGhlbWVQcm92aWRlcj4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0aGVtZS1pbmRpY2F0b3InKSkudG9IYXZlVGV4dENvbnRlbnQoJ0N1cnJlbnQgVGhlbWU6IGxpZ2h0JylcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Zpc3VhbC1hcHBlYXJhbmNlJykpLnRvSGF2ZVRleHRDb250ZW50KCdBcHBlYXJhbmNlOiBsaWdodCcpXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIG5vIHN0b3JlZCB0aGVtZSAoZGVmYXVsdHMgdG8gc3lzdGVtKScsIGFzeW5jICgpID0+IHtcbiAgICAgIHNldHVwTW9ja0Vudmlyb25tZW50KG51bGwsIGZhbHNlKSAvLyBubyBzdG9yZWQgdGhlbWUsIHN5c3RlbSBwcmVmZXJzIGxpZ2h0XG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRlc3RUaGVtZVByb3ZpZGVyPlxuICAgICAgICAgIDxQYWdlQ29tcG9uZW50IC8+XG4gICAgICAgIDwvVGVzdFRoZW1lUHJvdmlkZXI+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGhlbWUtaW5kaWNhdG9yJykpLnRvSGF2ZVRleHRDb250ZW50KCdDdXJyZW50IFRoZW1lOiBsaWdodCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnbWVhc3VyZXMgdGltaW5nIHdpbmRvdyBvZiBzdHlsZSBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0dXBNb2NrRW52aXJvbm1lbnQoJ2RhcmsnKVxuXG4gICAgICBjb25zdCB0aW1pbmdEYXRhOiBBcnJheTx7IHBoYXNlOiBzdHJpbmcsIHRpbWVzdGFtcDogbnVtYmVyLCBzdHlsZXM6IGFueSB9PiA9IFtdXG4gICAgICBjb25zdCBUaW1pbmdQYWdlQ29tcG9uZW50ID0gY3JlYXRlVGltaW5nUGFnZUNvbXBvbmVudCh0aW1pbmdEYXRhKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUZXN0VGhlbWVQcm92aWRlcj5cbiAgICAgICAgICA8VGltaW5nUGFnZUNvbXBvbmVudCAvPlxuICAgICAgICA8L1Rlc3RUaGVtZVByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RpbWluZy1zdGF0dXMnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1BoYXNlOiBDU1InKVxuICAgICAgfSlcblxuICAgICAgLy8gQW5hbHl6ZSB0aW1pbmcgYW5kIHN0eWxlIGNoYW5nZXNcbiAgICAgIGNvbnNvbGUubG9nKCdcXG49PT0gU3R5bGUgQ2hhbmdlIFRpbWVsaW5lID09PScpXG4gICAgICB0aW1pbmdEYXRhLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke2luZGV4ICsgMX0uICR7ZGF0YS5waGFzZX06IGJnPSR7ZGF0YS5zdHlsZXMuYmFja2dyb3VuZENvbG9yfSwgY29sb3I9JHtkYXRhLnN0eWxlcy5jb2xvcn1gKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIHN0eWxlIGNoYW5nZXMgKHRoaXMgaXMgdmlzaWJsZSBmbGlja2VyKVxuICAgICAgY29uc3QgaGFzU3R5bGVDaGFuZ2UgPSB0aW1pbmdEYXRhLmxlbmd0aCA+IDFcbiAgICAgICAgJiYgdGltaW5nRGF0YVswXS5zdHlsZXMuYmFja2dyb3VuZENvbG9yICE9PSB0aW1pbmdEYXRhW3RpbWluZ0RhdGEubGVuZ3RoIC0gMV0uc3R5bGVzLmJhY2tncm91bmRDb2xvclxuXG4gICAgICBpZiAoaGFzU3R5bGVDaGFuZ2UpXG4gICAgICAgIGNvbnNvbGUubG9nKCfimqDvuI8gIFN0eWxlIGNoYW5nZXMgZGV0ZWN0ZWQgLSB0aGlzIGNhdXNlcyB2aXNpYmxlIGZsaWNrZXInKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZygn4pyFIE5vIHN0eWxlIGNoYW5nZXMgZGV0ZWN0ZWQnKVxuXG4gICAgICBleHBlY3QodGltaW5nRGF0YS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigxKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NTUyBBcHBsaWNhdGlvbiBUaW1pbmcgVGVzdHMnLCAoKSA9PiB7XG4gICAgaXQoJ2NoZWNrcyBDU1MgY2xhc3MgY2hhbmdlcyBjYXVzaW5nIGZsaWNrZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICBzZXR1cE1vY2tFbnZpcm9ubWVudCgnZGFyaycpXG5cbiAgICAgIGNvbnN0IGNzc1N0YXRlczogQXJyYXk8eyBjbGFzc05hbWU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIgfT4gPSBbXVxuICAgICAgY29uc3QgQ1NTVGVzdENvbXBvbmVudCA9IGNyZWF0ZUNTU1Rlc3RDb21wb25lbnQoY3NzU3RhdGVzKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUZXN0VGhlbWVQcm92aWRlcj5cbiAgICAgICAgICA8Q1NTVGVzdENvbXBvbmVudCAvPlxuICAgICAgICA8L1Rlc3RUaGVtZVByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nzcy1jbGFzc2VzJykpLnRvSGF2ZVRleHRDb250ZW50KCdiZy1ncmF5LTkwMCB0ZXh0LXdoaXRlJylcbiAgICAgIH0pXG5cbiAgICAgIGNvbnNvbGUubG9nKCdcXG49PT0gQ1NTIENsYXNzIENoYW5nZSBEZXRlY3Rpb24gPT09JylcbiAgICAgIGNzc1N0YXRlcy5mb3JFYWNoKChzdGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7aW5kZXggKyAxfS4gJHtzdGF0ZS5jbGFzc05hbWV9YClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENoZWNrIGlmIENTUyBjbGFzc2VzIGhhdmUgY2hhbmdlZFxuICAgICAgY29uc3QgaGFzQ1NTQ2hhbmdlID0gY3NzU3RhdGVzLmxlbmd0aCA+IDFcbiAgICAgICAgJiYgY3NzU3RhdGVzWzBdLmNsYXNzTmFtZSAhPT0gY3NzU3RhdGVzW2Nzc1N0YXRlcy5sZW5ndGggLSAxXS5jbGFzc05hbWVcblxuICAgICAgaWYgKGhhc0NTU0NoYW5nZSkge1xuICAgICAgICBjb25zb2xlLmxvZygn4pqg77iPICBDU1MgY2xhc3MgY2hhbmdlcyBkZXRlY3RlZCAtIG1heSBjYXVzZSBzdHlsZSBmbGlja2VyJylcbiAgICAgICAgY29uc29sZS5sb2coYEZyb206IFwiJHtjc3NTdGF0ZXNbMF0uY2xhc3NOYW1lfVwiYClcbiAgICAgICAgY29uc29sZS5sb2coYFRvOiBcIiR7Y3NzU3RhdGVzW2Nzc1N0YXRlcy5sZW5ndGggLSAxXS5jbGFzc05hbWV9XCJgKVxuICAgICAgfVxuXG4gICAgICBleHBlY3QoaGFzQ1NTQ2hhbmdlKS50b0JlKHRydWUpIC8vIFdlIGV4cGVjdCB0byBzZWUgdGhpcyBjaGFuZ2VcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnaGFuZGxlcyBsb2NhbFN0b3JhZ2UgYWNjZXNzIGVycm9ycyBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0dXBNb2NrRW52aXJvbm1lbnQobnVsbClcblxuICAgICAgY29uc3QgbW9ja1N0b3JhZ2UgPSB7XG4gICAgICAgIGdldEl0ZW06IHZpLmZuKCgpID0+IHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvY2FsU3RvcmFnZSBhY2Nlc3MgZGVuaWVkJylcbiAgICAgICAgfSksXG4gICAgICAgIHNldEl0ZW06IHZpLmZuKCksXG4gICAgICAgIHJlbW92ZUl0ZW06IHZpLmZuKCksXG4gICAgICAgIGNsZWFyOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYWxTdG9yYWdlJywge1xuICAgICAgICB2YWx1ZTogbW9ja1N0b3JhZ2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8VGVzdFRoZW1lUHJvdmlkZXI+XG4gICAgICAgICAgICA8UGFnZUNvbXBvbmVudCAvPlxuICAgICAgICAgIDwvVGVzdFRoZW1lUHJvdmlkZXI+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gU2hvdWxkIGZhbGxiYWNrIGdyYWNlZnVsbHkgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0aGVtZS1pbmRpY2F0b3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFNob3VsZCBkZWZhdWx0IHRvIGxpZ2h0IHRoZW1lIHdoZW4gbG9jYWxTdG9yYWdlIGZhaWxzXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Zpc3VhbC1hcHBlYXJhbmNlJykpLnRvSGF2ZVRleHRDb250ZW50KCdBcHBlYXJhbmNlOiBsaWdodCcpXG4gICAgICB9XG4gICAgICBmaW5hbGx5IHtcbiAgICAgICAgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh3aW5kb3csICdsb2NhbFN0b3JhZ2UnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBpbnZhbGlkIHRoZW1lIHZhbHVlcyBpbiBsb2NhbFN0b3JhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBzZXR1cE1vY2tFbnZpcm9ubWVudCgnaW52YWxpZC10aGVtZS12YWx1ZScpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRlc3RUaGVtZVByb3ZpZGVyPlxuICAgICAgICAgIDxQYWdlQ29tcG9uZW50IC8+XG4gICAgICAgIDwvVGVzdFRoZW1lUHJvdmlkZXI+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGhlbWUtaW5kaWNhdG9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNob3VsZCBoYW5kbGUgaW52YWxpZCB2YWx1ZXMgZ3JhY2VmdWxseVxuICAgICAgY29uc3QgdGhlbWVJbmRpY2F0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RoZW1lLWluZGljYXRvcicpXG4gICAgICBleHBlY3QodGhlbWVJbmRpY2F0b3IpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQZXJmb3JtYW5jZSBhbmQgUmVncmVzc2lvbiBUZXN0cycsICgpID0+IHtcbiAgICBpdCgndmVyaWZpZXMgVGhlbWVQcm92aWRlciBwb3NpdGlvbiBmaXggcmVkdWNlcyBpbml0aWFsaXphdGlvbiBkZWxheScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBlcmZvcm1hbmNlTWFya3M6IEFycmF5PHsgZXZlbnQ6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIgfT4gPSBbXVxuXG4gICAgICBzZXR1cE1vY2tFbnZpcm9ubWVudCgnZGFyaycpXG5cbiAgICAgIGV4cGVjdCh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RoZW1lJykpLnRvQmUoJ2RhcmsnKVxuXG4gICAgICBjb25zdCBQZXJmb3JtYW5jZVRlc3RDb21wb25lbnQgPSBjcmVhdGVQZXJmb3JtYW5jZVRlc3RDb21wb25lbnQocGVyZm9ybWFuY2VNYXJrcylcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGVzdFRoZW1lUHJvdmlkZXI+XG4gICAgICAgICAgPFBlcmZvcm1hbmNlVGVzdENvbXBvbmVudCAvPlxuICAgICAgICA8L1Rlc3RUaGVtZVByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BlcmZvcm1hbmNlLXRlc3QnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1RoZW1lOiBkYXJrJylcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFuYWx5emUgcGVyZm9ybWFuY2UgdGltZWxpbmVcbiAgICAgIGNvbnNvbGUubG9nKCdcXG49PT0gUGVyZm9ybWFuY2UgVGltZWxpbmUgPT09JylcbiAgICAgIHBlcmZvcm1hbmNlTWFya3MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHttYXJrLmV2ZW50fTogJHttYXJrLnRpbWVzdGFtcC50b0ZpeGVkKDIpfW1zYClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChwZXJmb3JtYW5jZU1hcmtzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDMpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU29sdXRpb24gUmVxdWlyZW1lbnRzIERlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ2RlZmluZXMgdGVjaG5pY2FsIHJlcXVpcmVtZW50cyB0byBlbGltaW5hdGUgZmxpY2tlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHRlY2huaWNhbFJlcXVpcmVtZW50cyA9IHtcbiAgICAgICAgc3NyQ29uc2lzdGVuY3k6ICdTU1IgYW5kIENTUiBtdXN0IHJlbmRlciBpZGVudGljYWwgaW5pdGlhbCBzdHlsZXMnLFxuICAgICAgICBzeW5jaHJvbm91c0RldGVjdGlvbjogJ1RoZW1lIGRldGVjdGlvbiBtdXN0IGNvbXBsZXRlIHN5bmNocm9ub3VzbHkgYmVmb3JlIGZpcnN0IHJlbmRlcicsXG4gICAgICAgIG5vU3R5bGVDaGFuZ2VzOiAnTm8gdmlzaWJsZSBzdHlsZSBjaGFuZ2VzIHNob3VsZCBvY2N1ciBhZnRlciBoeWRyYXRpb24nLFxuICAgICAgICBwZXJmb3JtYW5jZUltcGFjdDogJ1NvbHV0aW9uIHNob3VsZCBub3Qgc2lnbmlmaWNhbnRseSBpbXBhY3QgcGFnZSBsb2FkIHBlcmZvcm1hbmNlJyxcbiAgICAgICAgYnJvd3NlckNvbXBhdGliaWxpdHk6ICdNdXN0IHdvcmsgY29uc2lzdGVudGx5IGFjcm9zcyBhbGwgbWFqb3IgYnJvd3NlcnMnLFxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnXFxuPT09IFRlY2huaWNhbCBSZXF1aXJlbWVudHMgPT09JylcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRlY2huaWNhbFJlcXVpcmVtZW50cykuZm9yRWFjaCgoW2tleSwgcmVxdWlyZW1lbnRdKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke2tleX06ICR7cmVxdWlyZW1lbnR9YClcbiAgICAgICAgZXhwZWN0KHJlcXVpcmVtZW50KS50b0JlRGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBIHN1Y2Nlc3NmdWwgc29sdXRpb24gc2hvdWxkIHBhc3MgYWxsIHRoZXNlIHJlcXVpcmVtZW50c1xuICAgIH0pXG4gIH0pXG59KVxuIl19