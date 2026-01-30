"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const echarts_for_react_1 = require("echarts-for-react");
const dynamic_1 = require("next/dynamic");
const react_1 = require("react");
const react_syntax_highlighter_1 = require("react-syntax-highlighter");
const hljs_1 = require("react-syntax-highlighter/dist/esm/styles/hljs");
const action_button_1 = require("@/app/components/base/action-button");
const copy_icon_1 = require("@/app/components/base/copy-icon");
const music_1 = require("@/app/components/base/markdown-blocks/music");
const error_boundary_1 = require("@/app/components/base/markdown/error-boundary");
const svg_1 = require("@/app/components/base/svg");
const use_theme_1 = require("@/hooks/use-theme");
const app_1 = require("@/types/app");
const svg_gallery_1 = require("../svg-gallery"); // Assumes svg-gallery.tsx is in /base directory
const Flowchart = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/base/mermaid')), { ssr: false });
// Available language https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD
const capitalizationLanguageNameMap = {
    sql: 'SQL',
    javascript: 'JavaScript',
    java: 'Java',
    typescript: 'TypeScript',
    vbscript: 'VBScript',
    css: 'CSS',
    html: 'HTML',
    xml: 'XML',
    php: 'PHP',
    python: 'Python',
    yaml: 'Yaml',
    mermaid: 'Mermaid',
    markdown: 'MarkDown',
    makefile: 'MakeFile',
    echarts: 'ECharts',
    shell: 'Shell',
    powershell: 'PowerShell',
    json: 'JSON',
    latex: 'Latex',
    svg: 'SVG',
    abc: 'ABC',
};
const getCorrectCapitalizationLanguageName = (language) => {
    if (!language)
        return 'Plain';
    if (language in capitalizationLanguageNameMap)
        return capitalizationLanguageNameMap[language];
    return language.charAt(0).toUpperCase() + language.substring(1);
};
const CodeBlock = (0, react_1.memo)(({ inline, className, children = '', ...props }) => {
    const { theme } = (0, use_theme_1.default)();
    const [isSVG, setIsSVG] = (0, react_1.useState)(true);
    const [chartState, setChartState] = (0, react_1.useState)('loading');
    const [finalChartOption, setFinalChartOption] = (0, react_1.useState)(null);
    const echartsRef = (0, react_1.useRef)(null);
    const contentRef = (0, react_1.useRef)('');
    const processedRef = (0, react_1.useRef)(false); // Track if content was successfully processed
    const isInitialRenderRef = (0, react_1.useRef)(true); // Track if this is initial render
    const chartInstanceRef = (0, react_1.useRef)(null); // Direct reference to ECharts instance
    const resizeTimerRef = (0, react_1.useRef)(null); // For debounce handling
    const finishedEventCountRef = (0, react_1.useRef)(0); // Track finished event trigger count
    const match = /language-(\w+)/.exec(className || '');
    const language = match?.[1];
    const languageShowName = getCorrectCapitalizationLanguageName(language || '');
    const isDarkMode = theme === app_1.Theme.dark;
    const echartsStyle = (0, react_1.useMemo)(() => ({
        height: '350px',
        width: '100%',
    }), []);
    const echartsOpts = (0, react_1.useMemo)(() => ({
        renderer: 'canvas',
        width: 'auto',
    }), []);
    // Debounce resize operations
    const debouncedResize = (0, react_1.useCallback)(() => {
        if (resizeTimerRef.current)
            clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = setTimeout(() => {
            if (chartInstanceRef.current)
                chartInstanceRef.current.resize();
            resizeTimerRef.current = null;
        }, 200);
    }, []);
    // Handle ECharts instance initialization
    const handleChartReady = (0, react_1.useCallback)((instance) => {
        chartInstanceRef.current = instance;
        // Force resize to ensure timeline displays correctly
        setTimeout(() => {
            if (chartInstanceRef.current)
                chartInstanceRef.current.resize();
        }, 200);
    }, []);
    // Store event handlers in useMemo to avoid recreating them
    const echartsEvents = (0, react_1.useMemo)(() => ({
        finished: (_params) => {
            // Limit finished event frequency to avoid infinite loops
            finishedEventCountRef.current++;
            if (finishedEventCountRef.current > 3) {
                // Stop processing after 3 times to avoid infinite loops
                return;
            }
            if (chartInstanceRef.current) {
                // Use debounced resize
                debouncedResize();
            }
        },
    }), [debouncedResize]);
    // Handle container resize for echarts
    (0, react_1.useEffect)(() => {
        if (language !== 'echarts' || !chartInstanceRef.current)
            return;
        const handleResize = () => {
            if (chartInstanceRef.current)
                // Use debounced resize
                debouncedResize();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimerRef.current)
                clearTimeout(resizeTimerRef.current);
        };
    }, [language, debouncedResize]);
    // Process chart data when content changes
    (0, react_1.useEffect)(() => {
        // Only process echarts content
        if (language !== 'echarts')
            return;
        // Reset state when new content is detected
        if (!contentRef.current) {
            setChartState('loading');
            processedRef.current = false;
        }
        const newContent = String(children).replace(/\n$/, '');
        // Skip if content hasn't changed
        if (contentRef.current === newContent)
            return;
        contentRef.current = newContent;
        const trimmedContent = newContent.trim();
        if (!trimmedContent)
            return;
        // Detect if this is historical data (already complete)
        // Historical data typically comes as a complete code block with complete JSON
        const isCompleteJson = (trimmedContent.startsWith('{') && trimmedContent.endsWith('}')
            && trimmedContent.split('{').length === trimmedContent.split('}').length)
            || (trimmedContent.startsWith('[') && trimmedContent.endsWith(']')
                && trimmedContent.split('[').length === trimmedContent.split(']').length);
        // If the JSON structure looks complete, try to parse it right away
        if (isCompleteJson && !processedRef.current) {
            try {
                const parsed = JSON.parse(trimmedContent);
                if (typeof parsed === 'object' && parsed !== null) {
                    setFinalChartOption(parsed);
                    setChartState('success');
                    processedRef.current = true;
                    return;
                }
            }
            catch {
                try {
                    // eslint-disable-next-line no-new-func, sonarjs/code-eval
                    const result = new Function(`return ${trimmedContent}`)();
                    if (typeof result === 'object' && result !== null) {
                        setFinalChartOption(result);
                        setChartState('success');
                        processedRef.current = true;
                        return;
                    }
                }
                catch {
                    // If we have a complete JSON structure but it doesn't parse,
                    // it's likely an error rather than incomplete data
                    setChartState('error');
                    processedRef.current = true;
                    return;
                }
            }
        }
        // If we get here, either the JSON isn't complete yet, or we failed to parse it
        // Check more conditions for streaming data
        const isIncomplete = trimmedContent.length < 5
            || (trimmedContent.startsWith('{')
                && (!trimmedContent.endsWith('}')
                    || trimmedContent.split('{').length !== trimmedContent.split('}').length))
            || (trimmedContent.startsWith('[')
                && (!trimmedContent.endsWith(']')
                    || trimmedContent.split('[').length !== trimmedContent.split('}').length))
            || (trimmedContent.split('"').length % 2 !== 1)
            || (trimmedContent.includes('{"') && !trimmedContent.includes('"}'));
        // Only try to parse streaming data if it looks complete and hasn't been processed
        if (!isIncomplete && !processedRef.current) {
            let isValidOption = false;
            try {
                const parsed = JSON.parse(trimmedContent);
                if (typeof parsed === 'object' && parsed !== null) {
                    setFinalChartOption(parsed);
                    isValidOption = true;
                }
            }
            catch {
                try {
                    // eslint-disable-next-line no-new-func, sonarjs/code-eval
                    const result = new Function(`return ${trimmedContent}`)();
                    if (typeof result === 'object' && result !== null) {
                        setFinalChartOption(result);
                        isValidOption = true;
                    }
                }
                catch {
                    // Both parsing methods failed, but content looks complete
                    setChartState('error');
                    processedRef.current = true;
                }
            }
            if (isValidOption) {
                setChartState('success');
                processedRef.current = true;
            }
        }
    }, [language, children]);
    // Cache rendered content to avoid unnecessary re-renders
    const renderCodeContent = (0, react_1.useMemo)(() => {
        const content = String(children).replace(/\n$/, '');
        switch (language) {
            case 'mermaid':
                return <Flowchart PrimitiveCode={content} theme={theme}/>;
            case 'echarts': {
                // Loading state: show loading indicator
                if (chartState === 'loading') {
                    return (<div style={{
                            minHeight: '350px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                            backgroundColor: isDarkMode ? 'var(--color-components-input-bg-normal)' : 'transparent',
                            color: 'var(--color-text-secondary)',
                        }}>
              <div style={{
                            marginBottom: '12px',
                            width: '24px',
                            height: '24px',
                        }}>
                {/* Rotating spinner that works in both light and dark modes */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1.5s linear infinite' }}>
                  <style>
                    {`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                  <circle opacity="0.2" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2C6.47715 2 2 6.47715 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{
                            fontFamily: 'var(--font-family)',
                            fontSize: '14px',
                        }}>
                Chart loading...
              </div>
            </div>);
                }
                // Success state: show the chart
                if (chartState === 'success' && finalChartOption) {
                    // Reset finished event counter
                    finishedEventCountRef.current = 0;
                    return (<div style={{
                            minWidth: '300px',
                            minHeight: '350px',
                            width: '100%',
                            overflowX: 'auto',
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                            transition: 'background-color 0.3s ease',
                        }}>
              <error_boundary_1.default>
                <echarts_for_react_1.default ref={(e) => {
                            if (e && isInitialRenderRef.current) {
                                echartsRef.current = e;
                                isInitialRenderRef.current = false;
                            }
                        }} option={finalChartOption} style={echartsStyle} theme={isDarkMode ? 'dark' : undefined} opts={echartsOpts} notMerge={false} lazyUpdate={false} onEvents={echartsEvents} onChartReady={handleChartReady}/>
              </error_boundary_1.default>
            </div>);
                }
                // Error state: show error message
                const errorOption = {
                    title: {
                        text: 'ECharts error - Wrong option.',
                    },
                };
                return (<div style={{
                        minWidth: '300px',
                        minHeight: '350px',
                        width: '100%',
                        overflowX: 'auto',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                        transition: 'background-color 0.3s ease',
                    }}>
            <error_boundary_1.default>
              <echarts_for_react_1.default ref={echartsRef} option={errorOption} style={echartsStyle} theme={isDarkMode ? 'dark' : undefined} opts={echartsOpts} notMerge={true}/>
            </error_boundary_1.default>
          </div>);
            }
            case 'svg':
                if (isSVG) {
                    return (<error_boundary_1.default>
              <svg_gallery_1.default content={content}/>
            </error_boundary_1.default>);
                }
                break;
            case 'abc':
                return (<error_boundary_1.default>
            <music_1.default children={content}/>
          </error_boundary_1.default>);
            default:
                return (<react_syntax_highlighter_1.default {...props} style={theme === app_1.Theme.light ? hljs_1.atelierHeathLight : hljs_1.atelierHeathDark} customStyle={{
                        paddingLeft: 12,
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                        backgroundColor: 'var(--color-components-input-bg-normal)',
                    }} language={match?.[1]} showLineNumbers PreTag="div">
            {content}
          </react_syntax_highlighter_1.default>);
        }
    }, [children, language, isSVG, finalChartOption, props, theme, match, chartState, isDarkMode, echartsStyle, echartsOpts, handleChartReady, echartsEvents]);
    if (inline || !match)
        return <code {...props} className={className}>{children}</code>;
    return (<div className="relative">
      <div className="flex h-8 items-center justify-between rounded-t-[10px] border-b border-divider-subtle bg-components-input-bg-normal p-1 pl-3">
        <div className="system-xs-semibold-uppercase text-text-secondary">{languageShowName}</div>
        <div className="flex items-center gap-1">
          {language === 'svg' && <svg_1.default isSVG={isSVG} setIsSVG={setIsSVG}/>}
          <action_button_1.default>
            <copy_icon_1.default content={String(children).replace(/\n$/, '')}/>
          </action_button_1.default>
        </div>
      </div>
      {renderCodeContent}
    </div>);
});
CodeBlock.displayName = 'CodeBlock';
exports.default = CodeBlock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1ibG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGUtYmxvY2sudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseURBQTRDO0FBQzVDLDBDQUFrQztBQUNsQyxpQ0FBK0U7QUFDL0UsdUVBQXdEO0FBQ3hELHdFQUdzRDtBQUN0RCx1RUFBOEQ7QUFDOUQsK0RBQXNEO0FBQ3RELHVFQUF1RTtBQUN2RSxrRkFBeUU7QUFDekUsbURBQThDO0FBQzlDLGlEQUF3QztBQUN4QyxxQ0FBbUM7QUFDbkMsZ0RBQXdDLENBQUMsZ0RBQWdEO0FBRXpGLE1BQU0sU0FBUyxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsK0JBQStCLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBRXhGLGtJQUFrSTtBQUNsSSxNQUFNLDZCQUE2QixHQUEyQjtJQUM1RCxHQUFHLEVBQUUsS0FBSztJQUNWLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLElBQUksRUFBRSxNQUFNO0lBQ1osVUFBVSxFQUFFLFlBQVk7SUFDeEIsUUFBUSxFQUFFLFVBQVU7SUFDcEIsR0FBRyxFQUFFLEtBQUs7SUFDVixJQUFJLEVBQUUsTUFBTTtJQUNaLEdBQUcsRUFBRSxLQUFLO0lBQ1YsR0FBRyxFQUFFLEtBQUs7SUFDVixNQUFNLEVBQUUsUUFBUTtJQUNoQixJQUFJLEVBQUUsTUFBTTtJQUNaLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLEtBQUssRUFBRSxPQUFPO0lBQ2QsVUFBVSxFQUFFLFlBQVk7SUFDeEIsSUFBSSxFQUFFLE1BQU07SUFDWixLQUFLLEVBQUUsT0FBTztJQUNkLEdBQUcsRUFBRSxLQUFLO0lBQ1YsR0FBRyxFQUFFLEtBQUs7Q0FDWCxDQUFBO0FBQ0QsTUFBTSxvQ0FBb0MsR0FBRyxDQUFDLFFBQWdC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QUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFDLENBQUE7QUFDRixTQUFTLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUVuQyxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3RFY2hhcnRzIGZyb20gJ2VjaGFydHMtZm9yLXJlYWN0J1xuaW1wb3J0IGR5bmFtaWMgZnJvbSAnbmV4dC9keW5hbWljJ1xuaW1wb3J0IHsgbWVtbywgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFN5bnRheEhpZ2hsaWdodGVyIGZyb20gJ3JlYWN0LXN5bnRheC1oaWdobGlnaHRlcidcbmltcG9ydCB7XG4gIGF0ZWxpZXJIZWF0aERhcmssXG4gIGF0ZWxpZXJIZWF0aExpZ2h0LFxufSBmcm9tICdyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXIvZGlzdC9lc20vc3R5bGVzL2hsanMnXG5pbXBvcnQgQWN0aW9uQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hY3Rpb24tYnV0dG9uJ1xuaW1wb3J0IENvcHlJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jb3B5LWljb24nXG5pbXBvcnQgTWFya2Rvd25NdXNpYyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbWFya2Rvd24tYmxvY2tzL211c2ljJ1xuaW1wb3J0IEVycm9yQm91bmRhcnkgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL21hcmtkb3duL2Vycm9yLWJvdW5kYXJ5J1xuaW1wb3J0IFNWR0J0biBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc3ZnJ1xuaW1wb3J0IHVzZVRoZW1lIGZyb20gJ0AvaG9va3MvdXNlLXRoZW1lJ1xuaW1wb3J0IHsgVGhlbWUgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCBTVkdSZW5kZXJlciBmcm9tICcuLi9zdmctZ2FsbGVyeScgLy8gQXNzdW1lcyBzdmctZ2FsbGVyeS50c3ggaXMgaW4gL2Jhc2UgZGlyZWN0b3J5XG5cbmNvbnN0IEZsb3djaGFydCA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbWVybWFpZCcpLCB7IHNzcjogZmFsc2UgfSlcblxuLy8gQXZhaWxhYmxlIGxhbmd1YWdlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXIvcmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyL2Jsb2IvbWFzdGVyL0FWQUlMQUJMRV9MQU5HVUFHRVNfSExKUy5NRFxuY29uc3QgY2FwaXRhbGl6YXRpb25MYW5ndWFnZU5hbWVNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIHNxbDogJ1NRTCcsXG4gIGphdmFzY3JpcHQ6ICdKYXZhU2NyaXB0JyxcbiAgamF2YTogJ0phdmEnLFxuICB0eXBlc2NyaXB0OiAnVHlwZVNjcmlwdCcsXG4gIHZic2NyaXB0OiAnVkJTY3JpcHQnLFxuICBjc3M6ICdDU1MnLFxuICBodG1sOiAnSFRNTCcsXG4gIHhtbDogJ1hNTCcsXG4gIHBocDogJ1BIUCcsXG4gIHB5dGhvbjogJ1B5dGhvbicsXG4gIHlhbWw6ICdZYW1sJyxcbiAgbWVybWFpZDogJ01lcm1haWQnLFxuICBtYXJrZG93bjogJ01hcmtEb3duJyxcbiAgbWFrZWZpbGU6ICdNYWtlRmlsZScsXG4gIGVjaGFydHM6ICdFQ2hhcnRzJyxcbiAgc2hlbGw6ICdTaGVsbCcsXG4gIHBvd2Vyc2hlbGw6ICdQb3dlclNoZWxsJyxcbiAganNvbjogJ0pTT04nLFxuICBsYXRleDogJ0xhdGV4JyxcbiAgc3ZnOiAnU1ZHJyxcbiAgYWJjOiAnQUJDJyxcbn1cbmNvbnN0IGdldENvcnJlY3RDYXBpdGFsaXphdGlvbkxhbmd1YWdlTmFtZSA9IChsYW5ndWFnZTogc3RyaW5nKSA9PiB7XG4gIGlmICghbGFuZ3VhZ2UpXG4gICAgcmV0dXJuICdQbGFpbidcblxuICBpZiAobGFuZ3VhZ2UgaW4gY2FwaXRhbGl6YXRpb25MYW5ndWFnZU5hbWVNYXApXG4gICAgcmV0dXJuIGNhcGl0YWxpemF0aW9uTGFuZ3VhZ2VOYW1lTWFwW2xhbmd1YWdlXVxuXG4gIHJldHVybiBsYW5ndWFnZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGxhbmd1YWdlLnN1YnN0cmluZygxKVxufVxuXG4vLyAqKkFkZCBjb2RlIGJsb2NrXG4vLyBBdm9pZCBlcnJvciAjMTg1IChNYXhpbXVtIHVwZGF0ZSBkZXB0aCBleGNlZWRlZC5cbi8vIFRoaXMgY2FuIGhhcHBlbiB3aGVuIGEgY29tcG9uZW50IHJlcGVhdGVkbHkgY2FsbHMgc2V0U3RhdGUgaW5zaWRlIGNvbXBvbmVudFdpbGxVcGRhdGUgb3IgY29tcG9uZW50RGlkVXBkYXRlLlxuLy8gUmVhY3QgbGltaXRzIHRoZSBudW1iZXIgb2YgbmVzdGVkIHVwZGF0ZXMgdG8gcHJldmVudCBpbmZpbml0ZSBsb29wcy4pXG4vLyBSZWZlcmVuY2UgQTogaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL2Vycm9yLWRlY29kZXIuaHRtbD9pbnZhcmlhbnQ9MTg1XG4vLyBSZWZlcmVuY2UgQjE6IGh0dHBzOi8vcmVhY3QuZGV2L3JlZmVyZW5jZS9yZWFjdC9tZW1vXG4vLyBSZWZlcmVuY2UgQjI6IGh0dHBzOi8vcmVhY3QuZGV2L3JlZmVyZW5jZS9yZWFjdC91c2VNZW1vXG4vLyAqKioqXG4vLyBUaGUgb3JpZ2luYWwgZXJyb3IgdGhhdCBvY2N1cnJlZCBpbiB0aGUgc3RyZWFtaW5nIHJlc3BvbnNlIGR1cmluZyB0aGUgY29udmVyc2F0aW9uOlxuLy8gRXJyb3I6IE1pbmlmaWVkIFJlYWN0IGVycm9yIDE4NTtcbi8vIHZpc2l0IGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9lcnJvci1kZWNvZGVyLmh0bWw/aW52YXJpYW50PTE4NSBmb3IgdGhlIGZ1bGwgbWVzc2FnZVxuLy8gb3IgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50IGZvciBmdWxsIGVycm9ycyBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLlxuXG4vLyBEZWZpbmUgRUNoYXJ0cyBldmVudCBwYXJhbWV0ZXIgdHlwZXNcbnR5cGUgRUNoYXJ0c0V2ZW50UGFyYW1zID0ge1xuICB0eXBlOiBzdHJpbmdcbiAgc2VyaWVzSW5kZXg/OiBudW1iZXJcbiAgZGF0YUluZGV4PzogbnVtYmVyXG4gIG5hbWU/OiBzdHJpbmdcbiAgdmFsdWU/OiBhbnlcbiAgY3VycmVudEluZGV4PzogbnVtYmVyIC8vIEFkZGVkIGZvciB0aW1lbGluZSBldmVudHNcbiAgW2tleTogc3RyaW5nXTogYW55XG59XG5cbmNvbnN0IENvZGVCbG9jazogYW55ID0gbWVtbygoeyBpbmxpbmUsIGNsYXNzTmFtZSwgY2hpbGRyZW4gPSAnJywgLi4ucHJvcHMgfTogYW55KSA9PiB7XG4gIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcbiAgY29uc3QgW2lzU1ZHLCBzZXRJc1NWR10gPSB1c2VTdGF0ZSh0cnVlKVxuICBjb25zdCBbY2hhcnRTdGF0ZSwgc2V0Q2hhcnRTdGF0ZV0gPSB1c2VTdGF0ZTwnbG9hZGluZycgfCAnc3VjY2VzcycgfCAnZXJyb3InPignbG9hZGluZycpXG4gIGNvbnN0IFtmaW5hbENoYXJ0T3B0aW9uLCBzZXRGaW5hbENoYXJ0T3B0aW9uXSA9IHVzZVN0YXRlPGFueT4obnVsbClcbiAgY29uc3QgZWNoYXJ0c1JlZiA9IHVzZVJlZjxhbnk+KG51bGwpXG4gIGNvbnN0IGNvbnRlbnRSZWYgPSB1c2VSZWY8c3RyaW5nPignJylcbiAgY29uc3QgcHJvY2Vzc2VkUmVmID0gdXNlUmVmPGJvb2xlYW4+KGZhbHNlKSAvLyBUcmFjayBpZiBjb250ZW50IHdhcyBzdWNjZXNzZnVsbHkgcHJvY2Vzc2VkXG4gIGNvbnN0IGlzSW5pdGlhbFJlbmRlclJlZiA9IHVzZVJlZjxib29sZWFuPih0cnVlKSAvLyBUcmFjayBpZiB0aGlzIGlzIGluaXRpYWwgcmVuZGVyXG4gIGNvbnN0IGNoYXJ0SW5zdGFuY2VSZWYgPSB1c2VSZWY8YW55PihudWxsKSAvLyBEaXJlY3QgcmVmZXJlbmNlIHRvIEVDaGFydHMgaW5zdGFuY2VcbiAgY29uc3QgcmVzaXplVGltZXJSZWYgPSB1c2VSZWY8Tm9kZUpTLlRpbWVvdXQgfCBudWxsPihudWxsKSAvLyBGb3IgZGVib3VuY2UgaGFuZGxpbmdcbiAgY29uc3QgZmluaXNoZWRFdmVudENvdW50UmVmID0gdXNlUmVmPG51bWJlcj4oMCkgLy8gVHJhY2sgZmluaXNoZWQgZXZlbnQgdHJpZ2dlciBjb3VudFxuICBjb25zdCBtYXRjaCA9IC9sYW5ndWFnZS0oXFx3KykvLmV4ZWMoY2xhc3NOYW1lIHx8ICcnKVxuICBjb25zdCBsYW5ndWFnZSA9IG1hdGNoPy5bMV1cbiAgY29uc3QgbGFuZ3VhZ2VTaG93TmFtZSA9IGdldENvcnJlY3RDYXBpdGFsaXphdGlvbkxhbmd1YWdlTmFtZShsYW5ndWFnZSB8fCAnJylcbiAgY29uc3QgaXNEYXJrTW9kZSA9IHRoZW1lID09PSBUaGVtZS5kYXJrXG5cbiAgY29uc3QgZWNoYXJ0c1N0eWxlID0gdXNlTWVtbygoKSA9PiAoe1xuICAgIGhlaWdodDogJzM1MHB4JyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICB9KSwgW10pXG5cbiAgY29uc3QgZWNoYXJ0c09wdHMgPSB1c2VNZW1vKCgpID0+ICh7XG4gICAgcmVuZGVyZXI6ICdjYW52YXMnLFxuICAgIHdpZHRoOiAnYXV0bycsXG4gIH0pIGFzIGFueSwgW10pXG5cbiAgLy8gRGVib3VuY2UgcmVzaXplIG9wZXJhdGlvbnNcbiAgY29uc3QgZGVib3VuY2VkUmVzaXplID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChyZXNpemVUaW1lclJlZi5jdXJyZW50KVxuICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyUmVmLmN1cnJlbnQpXG5cbiAgICByZXNpemVUaW1lclJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoY2hhcnRJbnN0YW5jZVJlZi5jdXJyZW50KVxuICAgICAgICBjaGFydEluc3RhbmNlUmVmLmN1cnJlbnQucmVzaXplKClcbiAgICAgIHJlc2l6ZVRpbWVyUmVmLmN1cnJlbnQgPSBudWxsXG4gICAgfSwgMjAwKVxuICB9LCBbXSlcblxuICAvLyBIYW5kbGUgRUNoYXJ0cyBpbnN0YW5jZSBpbml0aWFsaXphdGlvblxuICBjb25zdCBoYW5kbGVDaGFydFJlYWR5ID0gdXNlQ2FsbGJhY2soKGluc3RhbmNlOiBhbnkpID0+IHtcbiAgICBjaGFydEluc3RhbmNlUmVmLmN1cnJlbnQgPSBpbnN0YW5jZVxuXG4gICAgLy8gRm9yY2UgcmVzaXplIHRvIGVuc3VyZSB0aW1lbGluZSBkaXNwbGF5cyBjb3JyZWN0bHlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChjaGFydEluc3RhbmNlUmVmLmN1cnJlbnQpXG4gICAgICAgIGNoYXJ0SW5zdGFuY2VSZWYuY3VycmVudC5yZXNpemUoKVxuICAgIH0sIDIwMClcbiAgfSwgW10pXG5cbiAgLy8gU3RvcmUgZXZlbnQgaGFuZGxlcnMgaW4gdXNlTWVtbyB0byBhdm9pZCByZWNyZWF0aW5nIHRoZW1cbiAgY29uc3QgZWNoYXJ0c0V2ZW50cyA9IHVzZU1lbW8oKCkgPT4gKHtcbiAgICBmaW5pc2hlZDogKF9wYXJhbXM6IEVDaGFydHNFdmVudFBhcmFtcykgPT4ge1xuICAgICAgLy8gTGltaXQgZmluaXNoZWQgZXZlbnQgZnJlcXVlbmN5IHRvIGF2b2lkIGluZmluaXRlIGxvb3BzXG4gICAgICBmaW5pc2hlZEV2ZW50Q291bnRSZWYuY3VycmVudCsrXG4gICAgICBpZiAoZmluaXNoZWRFdmVudENvdW50UmVmLmN1cnJlbnQgPiAzKSB7XG4gICAgICAgIC8vIFN0b3AgcHJvY2Vzc2luZyBhZnRlciAzIHRpbWVzIHRvIGF2b2lkIGluZmluaXRlIGxvb3BzXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoY2hhcnRJbnN0YW5jZVJlZi5jdXJyZW50KSB7XG4gICAgICAgIC8vIFVzZSBkZWJvdW5jZWQgcmVzaXplXG4gICAgICAgIGRlYm91bmNlZFJlc2l6ZSgpXG4gICAgICB9XG4gICAgfSxcbiAgfSksIFtkZWJvdW5jZWRSZXNpemVdKVxuXG4gIC8vIEhhbmRsZSBjb250YWluZXIgcmVzaXplIGZvciBlY2hhcnRzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGxhbmd1YWdlICE9PSAnZWNoYXJ0cycgfHwgIWNoYXJ0SW5zdGFuY2VSZWYuY3VycmVudClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgaGFuZGxlUmVzaXplID0gKCkgPT4ge1xuICAgICAgaWYgKGNoYXJ0SW5zdGFuY2VSZWYuY3VycmVudClcbiAgICAgICAgLy8gVXNlIGRlYm91bmNlZCByZXNpemVcbiAgICAgICAgZGVib3VuY2VkUmVzaXplKClcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpXG4gICAgICBpZiAocmVzaXplVGltZXJSZWYuY3VycmVudClcbiAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyUmVmLmN1cnJlbnQpXG4gICAgfVxuICB9LCBbbGFuZ3VhZ2UsIGRlYm91bmNlZFJlc2l6ZV0pXG4gIC8vIFByb2Nlc3MgY2hhcnQgZGF0YSB3aGVuIGNvbnRlbnQgY2hhbmdlc1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIE9ubHkgcHJvY2VzcyBlY2hhcnRzIGNvbnRlbnRcbiAgICBpZiAobGFuZ3VhZ2UgIT09ICdlY2hhcnRzJylcbiAgICAgIHJldHVyblxuXG4gICAgLy8gUmVzZXQgc3RhdGUgd2hlbiBuZXcgY29udGVudCBpcyBkZXRlY3RlZFxuICAgIGlmICghY29udGVudFJlZi5jdXJyZW50KSB7XG4gICAgICBzZXRDaGFydFN0YXRlKCdsb2FkaW5nJylcbiAgICAgIHByb2Nlc3NlZFJlZi5jdXJyZW50ID0gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCBuZXdDb250ZW50ID0gU3RyaW5nKGNoaWxkcmVuKS5yZXBsYWNlKC9cXG4kLywgJycpXG5cbiAgICAvLyBTa2lwIGlmIGNvbnRlbnQgaGFzbid0IGNoYW5nZWRcbiAgICBpZiAoY29udGVudFJlZi5jdXJyZW50ID09PSBuZXdDb250ZW50KVxuICAgICAgcmV0dXJuXG4gICAgY29udGVudFJlZi5jdXJyZW50ID0gbmV3Q29udGVudFxuXG4gICAgY29uc3QgdHJpbW1lZENvbnRlbnQgPSBuZXdDb250ZW50LnRyaW0oKVxuICAgIGlmICghdHJpbW1lZENvbnRlbnQpXG4gICAgICByZXR1cm5cblxuICAgIC8vIERldGVjdCBpZiB0aGlzIGlzIGhpc3RvcmljYWwgZGF0YSAoYWxyZWFkeSBjb21wbGV0ZSlcbiAgICAvLyBIaXN0b3JpY2FsIGRhdGEgdHlwaWNhbGx5IGNvbWVzIGFzIGEgY29tcGxldGUgY29kZSBibG9jayB3aXRoIGNvbXBsZXRlIEpTT05cbiAgICBjb25zdCBpc0NvbXBsZXRlSnNvblxuICAgICAgPSAodHJpbW1lZENvbnRlbnQuc3RhcnRzV2l0aCgneycpICYmIHRyaW1tZWRDb250ZW50LmVuZHNXaXRoKCd9JylcbiAgICAgICAgJiYgdHJpbW1lZENvbnRlbnQuc3BsaXQoJ3snKS5sZW5ndGggPT09IHRyaW1tZWRDb250ZW50LnNwbGl0KCd9JykubGVuZ3RoKVxuICAgICAgfHwgKHRyaW1tZWRDb250ZW50LnN0YXJ0c1dpdGgoJ1snKSAmJiB0cmltbWVkQ29udGVudC5lbmRzV2l0aCgnXScpXG4gICAgICAgICYmIHRyaW1tZWRDb250ZW50LnNwbGl0KCdbJykubGVuZ3RoID09PSB0cmltbWVkQ29udGVudC5zcGxpdCgnXScpLmxlbmd0aClcblxuICAgIC8vIElmIHRoZSBKU09OIHN0cnVjdHVyZSBsb29rcyBjb21wbGV0ZSwgdHJ5IHRvIHBhcnNlIGl0IHJpZ2h0IGF3YXlcbiAgICBpZiAoaXNDb21wbGV0ZUpzb24gJiYgIXByb2Nlc3NlZFJlZi5jdXJyZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHRyaW1tZWRDb250ZW50KVxuICAgICAgICBpZiAodHlwZW9mIHBhcnNlZCA9PT0gJ29iamVjdCcgJiYgcGFyc2VkICE9PSBudWxsKSB7XG4gICAgICAgICAgc2V0RmluYWxDaGFydE9wdGlvbihwYXJzZWQpXG4gICAgICAgICAgc2V0Q2hhcnRTdGF0ZSgnc3VjY2VzcycpXG4gICAgICAgICAgcHJvY2Vzc2VkUmVmLmN1cnJlbnQgPSB0cnVlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhdGNoIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMsIHNvbmFyanMvY29kZS1ldmFsXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IEZ1bmN0aW9uKGByZXR1cm4gJHt0cmltbWVkQ29udGVudH1gKSgpXG4gICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnICYmIHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgc2V0RmluYWxDaGFydE9wdGlvbihyZXN1bHQpXG4gICAgICAgICAgICBzZXRDaGFydFN0YXRlKCdzdWNjZXNzJylcbiAgICAgICAgICAgIHByb2Nlc3NlZFJlZi5jdXJyZW50ID0gdHJ1ZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgY29tcGxldGUgSlNPTiBzdHJ1Y3R1cmUgYnV0IGl0IGRvZXNuJ3QgcGFyc2UsXG4gICAgICAgICAgLy8gaXQncyBsaWtlbHkgYW4gZXJyb3IgcmF0aGVyIHRoYW4gaW5jb21wbGV0ZSBkYXRhXG4gICAgICAgICAgc2V0Q2hhcnRTdGF0ZSgnZXJyb3InKVxuICAgICAgICAgIHByb2Nlc3NlZFJlZi5jdXJyZW50ID0gdHJ1ZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgZ2V0IGhlcmUsIGVpdGhlciB0aGUgSlNPTiBpc24ndCBjb21wbGV0ZSB5ZXQsIG9yIHdlIGZhaWxlZCB0byBwYXJzZSBpdFxuICAgIC8vIENoZWNrIG1vcmUgY29uZGl0aW9ucyBmb3Igc3RyZWFtaW5nIGRhdGFcbiAgICBjb25zdCBpc0luY29tcGxldGVcbiAgICAgID0gdHJpbW1lZENvbnRlbnQubGVuZ3RoIDwgNVxuICAgICAgICB8fCAodHJpbW1lZENvbnRlbnQuc3RhcnRzV2l0aCgneycpXG4gICAgICAgICAgJiYgKCF0cmltbWVkQ29udGVudC5lbmRzV2l0aCgnfScpXG4gICAgICAgICAgICB8fCB0cmltbWVkQ29udGVudC5zcGxpdCgneycpLmxlbmd0aCAhPT0gdHJpbW1lZENvbnRlbnQuc3BsaXQoJ30nKS5sZW5ndGgpKVxuICAgICAgICAgIHx8ICh0cmltbWVkQ29udGVudC5zdGFydHNXaXRoKCdbJylcbiAgICAgICAgICAgICYmICghdHJpbW1lZENvbnRlbnQuZW5kc1dpdGgoJ10nKVxuICAgICAgICAgICAgICB8fCB0cmltbWVkQ29udGVudC5zcGxpdCgnWycpLmxlbmd0aCAhPT0gdHJpbW1lZENvbnRlbnQuc3BsaXQoJ30nKS5sZW5ndGgpKVxuICAgICAgICAgICAgfHwgKHRyaW1tZWRDb250ZW50LnNwbGl0KCdcIicpLmxlbmd0aCAlIDIgIT09IDEpXG4gICAgICAgICAgICB8fCAodHJpbW1lZENvbnRlbnQuaW5jbHVkZXMoJ3tcIicpICYmICF0cmltbWVkQ29udGVudC5pbmNsdWRlcygnXCJ9JykpXG5cbiAgICAvLyBPbmx5IHRyeSB0byBwYXJzZSBzdHJlYW1pbmcgZGF0YSBpZiBpdCBsb29rcyBjb21wbGV0ZSBhbmQgaGFzbid0IGJlZW4gcHJvY2Vzc2VkXG4gICAgaWYgKCFpc0luY29tcGxldGUgJiYgIXByb2Nlc3NlZFJlZi5jdXJyZW50KSB7XG4gICAgICBsZXQgaXNWYWxpZE9wdGlvbiA9IGZhbHNlXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UodHJpbW1lZENvbnRlbnQpXG4gICAgICAgIGlmICh0eXBlb2YgcGFyc2VkID09PSAnb2JqZWN0JyAmJiBwYXJzZWQgIT09IG51bGwpIHtcbiAgICAgICAgICBzZXRGaW5hbENoYXJ0T3B0aW9uKHBhcnNlZClcbiAgICAgICAgICBpc1ZhbGlkT3B0aW9uID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYXRjaCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jLCBzb25hcmpzL2NvZGUtZXZhbFxuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBGdW5jdGlvbihgcmV0dXJuICR7dHJpbW1lZENvbnRlbnR9YCkoKVxuICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JyAmJiByZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHNldEZpbmFsQ2hhcnRPcHRpb24ocmVzdWx0KVxuICAgICAgICAgICAgaXNWYWxpZE9wdGlvbiA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgIC8vIEJvdGggcGFyc2luZyBtZXRob2RzIGZhaWxlZCwgYnV0IGNvbnRlbnQgbG9va3MgY29tcGxldGVcbiAgICAgICAgICBzZXRDaGFydFN0YXRlKCdlcnJvcicpXG4gICAgICAgICAgcHJvY2Vzc2VkUmVmLmN1cnJlbnQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzVmFsaWRPcHRpb24pIHtcbiAgICAgICAgc2V0Q2hhcnRTdGF0ZSgnc3VjY2VzcycpXG4gICAgICAgIHByb2Nlc3NlZFJlZi5jdXJyZW50ID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfSwgW2xhbmd1YWdlLCBjaGlsZHJlbl0pXG5cbiAgLy8gQ2FjaGUgcmVuZGVyZWQgY29udGVudCB0byBhdm9pZCB1bm5lY2Vzc2FyeSByZS1yZW5kZXJzXG4gIGNvbnN0IHJlbmRlckNvZGVDb250ZW50ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgY29udGVudCA9IFN0cmluZyhjaGlsZHJlbikucmVwbGFjZSgvXFxuJC8sICcnKVxuICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgIGNhc2UgJ21lcm1haWQnOlxuICAgICAgICByZXR1cm4gPEZsb3djaGFydCBQcmltaXRpdmVDb2RlPXtjb250ZW50fSB0aGVtZT17dGhlbWUgYXMgJ2xpZ2h0JyB8ICdkYXJrJ30gLz5cbiAgICAgIGNhc2UgJ2VjaGFydHMnOiB7XG4gICAgICAgIC8vIExvYWRpbmcgc3RhdGU6IHNob3cgbG9hZGluZyBpbmRpY2F0b3JcbiAgICAgICAgaWYgKGNoYXJ0U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1pbkhlaWdodDogJzM1MHB4JyxcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGlzRGFya01vZGUgPyAndmFyKC0tY29sb3ItY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwpJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tY29sb3ItdGV4dC1zZWNvbmRhcnkpJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxMnB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzI0cHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI0cHgnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgey8qIFJvdGF0aW5nIHNwaW5uZXIgdGhhdCB3b3JrcyBpbiBib3RoIGxpZ2h0IGFuZCBkYXJrIG1vZGVzICovfVxuICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHN0eWxlPXt7IGFuaW1hdGlvbjogJ3NwaW4gMS41cyBsaW5lYXIgaW5maW5pdGUnIH19PlxuICAgICAgICAgICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgICAgICAgICAgICB7YFxuICAgICAgICAgICAgICAgICAgICAgIEBrZXlmcmFtZXMgc3BpbiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAwJSB7IHRyYW5zZm9ybTogcm90YXRlKDBkZWcpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAxMDAlIHsgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYH1cbiAgICAgICAgICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgICAgICAgICA8Y2lyY2xlIG9wYWNpdHk9XCIwLjJcIiBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIC8+XG4gICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDJDNi40NzcxNSAyIDIgNi40NzcxNSAyIDEyXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgLz5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1mYW1pbHkpJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgQ2hhcnQgbG9hZGluZy4uLlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1Y2Nlc3Mgc3RhdGU6IHNob3cgdGhlIGNoYXJ0XG4gICAgICAgIGlmIChjaGFydFN0YXRlID09PSAnc3VjY2VzcycgJiYgZmluYWxDaGFydE9wdGlvbikge1xuICAgICAgICAgIC8vIFJlc2V0IGZpbmlzaGVkIGV2ZW50IGNvdW50ZXJcbiAgICAgICAgICBmaW5pc2hlZEV2ZW50Q291bnRSZWYuY3VycmVudCA9IDBcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1pbldpZHRoOiAnMzAwcHgnLFxuICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICczNTBweCcsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIG92ZXJmbG93WDogJ2F1dG8nLFxuICAgICAgICAgICAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiAnMTBweCcsXG4gICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiAnMTBweCcsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246ICdiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8RXJyb3JCb3VuZGFyeT5cbiAgICAgICAgICAgICAgICA8UmVhY3RFY2hhcnRzXG4gICAgICAgICAgICAgICAgICByZWY9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlICYmIGlzSW5pdGlhbFJlbmRlclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgZWNoYXJ0c1JlZi5jdXJyZW50ID0gZVxuICAgICAgICAgICAgICAgICAgICAgIGlzSW5pdGlhbFJlbmRlclJlZi5jdXJyZW50ID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbj17ZmluYWxDaGFydE9wdGlvbn1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtlY2hhcnRzU3R5bGV9XG4gICAgICAgICAgICAgICAgICB0aGVtZT17aXNEYXJrTW9kZSA/ICdkYXJrJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgIG9wdHM9e2VjaGFydHNPcHRzfVxuICAgICAgICAgICAgICAgICAgbm90TWVyZ2U9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgbGF6eVVwZGF0ZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICBvbkV2ZW50cz17ZWNoYXJ0c0V2ZW50c31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhcnRSZWFkeT17aGFuZGxlQ2hhcnRSZWFkeX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L0Vycm9yQm91bmRhcnk+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICAvLyBFcnJvciBzdGF0ZTogc2hvdyBlcnJvciBtZXNzYWdlXG4gICAgICAgIGNvbnN0IGVycm9yT3B0aW9uID0ge1xuICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICB0ZXh0OiAnRUNoYXJ0cyBlcnJvciAtIFdyb25nIG9wdGlvbi4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIG1pbldpZHRoOiAnMzAwcHgnLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiAnMzUwcHgnLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIG92ZXJmbG93WDogJ2F1dG8nLFxuICAgICAgICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgICAgIHRyYW5zaXRpb246ICdiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZScsXG4gICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8RXJyb3JCb3VuZGFyeT5cbiAgICAgICAgICAgICAgPFJlYWN0RWNoYXJ0c1xuICAgICAgICAgICAgICAgIHJlZj17ZWNoYXJ0c1JlZn1cbiAgICAgICAgICAgICAgICBvcHRpb249e2Vycm9yT3B0aW9ufVxuICAgICAgICAgICAgICAgIHN0eWxlPXtlY2hhcnRzU3R5bGV9XG4gICAgICAgICAgICAgICAgdGhlbWU9e2lzRGFya01vZGUgPyAnZGFyaycgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgb3B0cz17ZWNoYXJ0c09wdHN9XG4gICAgICAgICAgICAgICAgbm90TWVyZ2U9e3RydWV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0Vycm9yQm91bmRhcnk+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3N2Zyc6XG4gICAgICAgIGlmIChpc1NWRykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RXJyb3JCb3VuZGFyeT5cbiAgICAgICAgICAgICAgPFNWR1JlbmRlcmVyIGNvbnRlbnQ9e2NvbnRlbnR9IC8+XG4gICAgICAgICAgICA8L0Vycm9yQm91bmRhcnk+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdhYmMnOlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxFcnJvckJvdW5kYXJ5PlxuICAgICAgICAgICAgPE1hcmtkb3duTXVzaWMgY2hpbGRyZW49e2NvbnRlbnR9IC8+XG4gICAgICAgICAgPC9FcnJvckJvdW5kYXJ5PlxuICAgICAgICApXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxTeW50YXhIaWdobGlnaHRlclxuICAgICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICAgICAgc3R5bGU9e3RoZW1lID09PSBUaGVtZS5saWdodCA/IGF0ZWxpZXJIZWF0aExpZ2h0IDogYXRlbGllckhlYXRoRGFya31cbiAgICAgICAgICAgIGN1c3RvbVN0eWxlPXt7XG4gICAgICAgICAgICAgIHBhZGRpbmdMZWZ0OiAxMixcbiAgICAgICAgICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd2YXIoLS1jb2xvci1jb21wb25lbnRzLWlucHV0LWJnLW5vcm1hbCknLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGxhbmd1YWdlPXttYXRjaD8uWzFdfVxuICAgICAgICAgICAgc2hvd0xpbmVOdW1iZXJzXG4gICAgICAgICAgICBQcmVUYWc9XCJkaXZcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtjb250ZW50fVxuICAgICAgICAgIDwvU3ludGF4SGlnaGxpZ2h0ZXI+XG4gICAgICAgIClcbiAgICB9XG4gIH0sIFtjaGlsZHJlbiwgbGFuZ3VhZ2UsIGlzU1ZHLCBmaW5hbENoYXJ0T3B0aW9uLCBwcm9wcywgdGhlbWUsIG1hdGNoLCBjaGFydFN0YXRlLCBpc0RhcmtNb2RlLCBlY2hhcnRzU3R5bGUsIGVjaGFydHNPcHRzLCBoYW5kbGVDaGFydFJlYWR5LCBlY2hhcnRzRXZlbnRzXSlcblxuICBpZiAoaW5saW5lIHx8ICFtYXRjaClcbiAgICByZXR1cm4gPGNvZGUgey4uLnByb3BzfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e2NoaWxkcmVufTwvY29kZT5cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiByb3VuZGVkLXQtWzEwcHhdIGJvcmRlci1iIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLWlucHV0LWJnLW5vcm1hbCBwLTEgcGwtM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1zZW1pYm9sZC11cHBlcmNhc2UgdGV4dC10ZXh0LXNlY29uZGFyeVwiPntsYW5ndWFnZVNob3dOYW1lfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgICAge2xhbmd1YWdlID09PSAnc3ZnJyAmJiA8U1ZHQnRuIGlzU1ZHPXtpc1NWR30gc2V0SXNTVkc9e3NldElzU1ZHfSAvPn1cbiAgICAgICAgICA8QWN0aW9uQnV0dG9uPlxuICAgICAgICAgICAgPENvcHlJY29uIGNvbnRlbnQ9e1N0cmluZyhjaGlsZHJlbikucmVwbGFjZSgvXFxuJC8sICcnKX0gLz5cbiAgICAgICAgICA8L0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtyZW5kZXJDb2RlQ29udGVudH1cbiAgICA8L2Rpdj5cbiAgKVxufSlcbkNvZGVCbG9jay5kaXNwbGF5TmFtZSA9ICdDb2RlQmxvY2snXG5cbmV4cG9ydCBkZWZhdWx0IENvZGVCbG9ja1xuIl19