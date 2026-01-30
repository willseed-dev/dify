"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("@heroicons/react/24/outline");
const solid_1 = require("@heroicons/react/24/solid");
const mermaid_1 = require("mermaid");
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const loading_anim_1 = require("@/app/components/base/chat/chat/loading-anim");
const image_preview_1 = require("@/app/components/base/image-uploader/image-preview");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const utils_1 = require("./utils");
// Global flags and cache for mermaid
let isMermaidInitialized = false;
const diagramCache = new Map();
let mermaidAPI = null;
if (typeof window !== 'undefined')
    mermaidAPI = mermaid_1.default.mermaidAPI;
// Theme configurations
const THEMES = {
    light: {
        name: 'Light Theme',
        background: '#ffffff',
        primaryColor: '#ffffff',
        primaryBorderColor: '#000000',
        primaryTextColor: '#000000',
        secondaryColor: '#ffffff',
        tertiaryColor: '#ffffff',
        nodeColors: [
            { bg: '#f0f9ff', color: '#0369a1' },
            { bg: '#f0fdf4', color: '#166534' },
            { bg: '#fef2f2', color: '#b91c1c' },
            { bg: '#faf5ff', color: '#7e22ce' },
            { bg: '#fffbeb', color: '#b45309' },
        ],
        connectionColor: '#74a0e0',
    },
    dark: {
        name: 'Dark Theme',
        background: '#1e293b',
        primaryColor: '#334155',
        primaryBorderColor: '#94a3b8',
        primaryTextColor: '#e2e8f0',
        secondaryColor: '#475569',
        tertiaryColor: '#334155',
        nodeColors: [
            { bg: '#164e63', color: '#e0f2fe' },
            { bg: '#14532d', color: '#dcfce7' },
            { bg: '#7f1d1d', color: '#fee2e2' },
            { bg: '#581c87', color: '#f3e8ff' },
            { bg: '#78350f', color: '#fef3c7' },
        ],
        connectionColor: '#60a5fa',
    },
};
/**
 * Initializes mermaid library with default configuration
 */
const initMermaid = () => {
    if (typeof window !== 'undefined' && !isMermaidInitialized) {
        try {
            const config = {
                startOnLoad: false,
                fontFamily: 'sans-serif',
                securityLevel: 'strict',
                flowchart: {
                    htmlLabels: true,
                    useMaxWidth: true,
                    curve: 'basis',
                    nodeSpacing: 50,
                    rankSpacing: 70,
                },
                gantt: {
                    titleTopMargin: 25,
                    barHeight: 20,
                    barGap: 4,
                    topPadding: 50,
                    leftPadding: 75,
                    gridLineStartPadding: 35,
                    fontSize: 11,
                    numberSectionStyles: 4,
                    axisFormat: '%Y-%m-%d',
                },
                mindmap: {
                    useMaxWidth: true,
                    padding: 10,
                },
                maxTextSize: 50000,
            };
            mermaid_1.default.initialize(config);
            isMermaidInitialized = true;
        }
        catch (error) {
            console.error('Mermaid initialization error:', error);
            return null;
        }
    }
    return isMermaidInitialized;
};
const Flowchart = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [svgString, setSvgString] = (0, react_1.useState)(null);
    const [look, setLook] = (0, react_1.useState)('classic');
    const [isInitialized, setIsInitialized] = (0, react_1.useState)(false);
    const [currentTheme, setCurrentTheme] = (0, react_1.useState)(props.theme || 'light');
    const containerRef = (0, react_1.useRef)(null);
    const chartId = (0, react_1.useRef)(`mermaid-chart-${Math.random().toString(36).slice(2, 11)}`).current;
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const renderTimeoutRef = (0, react_1.useRef)(undefined);
    const [errMsg, setErrMsg] = (0, react_1.useState)('');
    const [imagePreviewUrl, setImagePreviewUrl] = (0, react_1.useState)('');
    /**
     * Renders Mermaid chart
     */
    const renderMermaidChart = async (code, style) => {
        if (style === 'handDrawn') {
            // Special handling for hand-drawn style
            if (containerRef.current)
                containerRef.current.innerHTML = `<div id="${chartId}"></div>`;
            await new Promise(resolve => setTimeout(resolve, 30));
            if (typeof window !== 'undefined' && mermaidAPI) {
                // Prefer using mermaidAPI directly for hand-drawn style
                return await mermaidAPI.render(chartId, code);
            }
            else {
                // Fall back to standard rendering if mermaidAPI is not available
                const { svg } = await mermaid_1.default.render(chartId, code);
                return { svg };
            }
        }
        else {
            // Standard rendering for classic style - using the extracted waitForDOMElement function
            const renderWithRetry = async () => {
                if (containerRef.current)
                    containerRef.current.innerHTML = `<div id="${chartId}"></div>`;
                await new Promise(resolve => setTimeout(resolve, 30));
                const { svg } = await mermaid_1.default.render(chartId, code);
                return { svg };
            };
            return await (0, utils_1.waitForDOMElement)(renderWithRetry);
        }
    };
    /**
     * Handle rendering errors
     */
    const handleRenderError = (error) => {
        console.error('Mermaid rendering error:', error);
        // On any render error, assume the mermaid state is corrupted and force a re-initialization.
        try {
            diagramCache.clear(); // Clear cache to prevent using potentially corrupted SVGs
            isMermaidInitialized = false; // <-- THE FIX: Force re-initialization
            initMermaid(); // Re-initialize with the default safe configuration
        }
        catch (reinitError) {
            console.error('Failed to re-initialize Mermaid after error:', reinitError);
        }
        setErrMsg(`Rendering failed: ${error.message || 'Unknown error. Please check the console.'}`);
        setIsLoading(false);
    };
    // Initialize mermaid
    (0, react_1.useEffect)(() => {
        const api = initMermaid();
        if (api)
            setIsInitialized(true);
    }, []);
    // Update theme when prop changes, but allow internal override.
    const prevThemeRef = (0, react_1.useRef)(undefined);
    (0, react_1.useEffect)(() => {
        // Only react if the theme prop from the outside has actually changed.
        if (props.theme && props.theme !== prevThemeRef.current) {
            // When the global theme prop changes, it should act as the source of truth,
            // overriding any local theme selection.
            diagramCache.clear();
            setSvgString(null);
            setCurrentTheme(props.theme);
            // Reset look to classic for a consistent state after a global change.
            setLook('classic');
        }
        // Update the ref to the current prop value for the next render.
        prevThemeRef.current = props.theme;
    }, [props.theme]);
    const renderFlowchart = (0, react_1.useCallback)(async (primitiveCode) => {
        if (!isInitialized || !containerRef.current) {
            setIsLoading(false);
            setErrMsg(!isInitialized ? 'Mermaid initialization failed' : 'Container element not found');
            return;
        }
        // Return cached result if available
        const cacheKey = `${primitiveCode}-${look}-${currentTheme}`;
        if (diagramCache.has(cacheKey)) {
            setErrMsg('');
            setSvgString(diagramCache.get(cacheKey) || null);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setErrMsg('');
        try {
            let finalCode;
            const trimmedCode = primitiveCode.trim();
            const isGantt = trimmedCode.startsWith('gantt');
            const isMindMap = trimmedCode.startsWith('mindmap');
            const isSequence = trimmedCode.startsWith('sequenceDiagram');
            if (isGantt || isMindMap || isSequence) {
                if (isGantt) {
                    finalCode = trimmedCode
                        .split('\n')
                        .map((line) => {
                        // Gantt charts have specific syntax needs.
                        const taskMatch = line.match(/^\s*([^:]+?)\s*:\s*(.*)/);
                        if (!taskMatch)
                            return line; // Not a task line, return as is.
                        const taskName = taskMatch[1].trim();
                        let paramsStr = taskMatch[2].trim();
                        // Rule 1: Correct multiple "after" dependencies ONLY if they exist.
                        // This is a common mistake, e.g., "..., after task1, after task2, ..."
                        const afterCount = (paramsStr.match(/after /g) || []).length;
                        if (afterCount > 1)
                            paramsStr = paramsStr.replace(/,\s*after\s+/g, ' ');
                        // Rule 2: Normalize spacing between parameters for consistency.
                        const finalParams = paramsStr.replace(/\s*,\s*/g, ', ').trim();
                        return `${taskName} :${finalParams}`;
                    })
                        .join('\n');
                }
                else {
                    // For mindmap and sequence charts, which are sensitive to syntax,
                    // pass the code through directly.
                    finalCode = trimmedCode;
                }
            }
            else {
                // Step 1: Clean and prepare Mermaid code using the extracted prepareMermaidCode function
                // This function handles flowcharts appropriately.
                finalCode = (0, utils_1.prepareMermaidCode)(primitiveCode, look);
            }
            finalCode = (0, utils_1.sanitizeMermaidCode)(finalCode);
            // Step 2: Render chart
            const svgGraph = await renderMermaidChart(finalCode, look);
            // Step 3: Apply theme to SVG using the extracted processSvgForTheme function
            const processedSvg = (0, utils_1.processSvgForTheme)(svgGraph.svg, currentTheme === app_1.Theme.dark, look === 'handDrawn', THEMES);
            // Step 4: Clean up SVG code
            const cleanedSvg = (0, utils_1.cleanUpSvgCode)(processedSvg);
            if (cleanedSvg && typeof cleanedSvg === 'string') {
                diagramCache.set(cacheKey, cleanedSvg);
                setSvgString(cleanedSvg);
            }
            setIsLoading(false);
        }
        catch (error) {
            // Error handling
            handleRenderError(error);
        }
    }, [chartId, isInitialized, look, currentTheme, t]);
    const configureMermaid = (0, react_1.useCallback)((primitiveCode) => {
        if (typeof window !== 'undefined' && isInitialized) {
            const themeVars = THEMES[currentTheme];
            const config = {
                startOnLoad: false,
                securityLevel: 'strict',
                fontFamily: 'sans-serif',
                maxTextSize: 50000,
                gantt: {
                    titleTopMargin: 25,
                    barHeight: 20,
                    barGap: 4,
                    topPadding: 50,
                    leftPadding: 75,
                    gridLineStartPadding: 35,
                    fontSize: 11,
                    numberSectionStyles: 4,
                    axisFormat: '%Y-%m-%d',
                },
                mindmap: {
                    useMaxWidth: true,
                    padding: 10,
                },
            };
            const isFlowchart = primitiveCode.trim().startsWith('graph') || primitiveCode.trim().startsWith('flowchart');
            if (look === 'classic') {
                config.theme = currentTheme === 'dark' ? 'dark' : 'neutral';
                if (isFlowchart) {
                    const flowchartConfig = {
                        htmlLabels: true,
                        useMaxWidth: true,
                        nodeSpacing: 60,
                        rankSpacing: 80,
                        curve: 'linear',
                        ranker: 'tight-tree',
                    };
                    config.flowchart = flowchartConfig;
                }
                if (currentTheme === 'dark') {
                    config.themeVariables = {
                        background: themeVars.background,
                        primaryColor: themeVars.primaryColor,
                        primaryBorderColor: themeVars.primaryBorderColor,
                        primaryTextColor: themeVars.primaryTextColor,
                        secondaryColor: themeVars.secondaryColor,
                        tertiaryColor: themeVars.tertiaryColor,
                    };
                }
            }
            else { // look === 'handDrawn'
                config.theme = 'default';
                config.themeCSS = `
          .node rect { fill-opacity: 0.85; }
          .edgePath .path { stroke-width: 1.5px; }
          .label { font-family: 'sans-serif'; }
          .edgeLabel { font-family: 'sans-serif'; }
          .cluster rect { rx: 5px; ry: 5px; }
        `;
                config.themeVariables = {
                    fontSize: '14px',
                    fontFamily: 'sans-serif',
                    primaryBorderColor: currentTheme === 'dark' ? THEMES.dark.connectionColor : THEMES.light.connectionColor,
                };
                if (isFlowchart) {
                    config.flowchart = {
                        htmlLabels: true,
                        useMaxWidth: true,
                        nodeSpacing: 40,
                        rankSpacing: 60,
                        curve: 'basis',
                    };
                }
            }
            try {
                mermaid_1.default.initialize(config);
                return true;
            }
            catch (error) {
                console.error('Config error:', error);
                return false;
            }
        }
        return false;
    }, [currentTheme, isInitialized, look]);
    // This is the main rendering effect.
    // It triggers whenever the code, theme, or style changes.
    (0, react_1.useEffect)(() => {
        if (!isInitialized)
            return;
        // Don't render if code is too short
        if (!props.PrimitiveCode || props.PrimitiveCode.length < 10) {
            setIsLoading(false);
            setSvgString(null);
            return;
        }
        // Use a timeout to handle streaming code and debounce rendering
        if (renderTimeoutRef.current)
            clearTimeout(renderTimeoutRef.current);
        setIsLoading(true);
        renderTimeoutRef.current = setTimeout(() => {
            // Final validation before rendering
            if (!(0, utils_1.isMermaidCodeComplete)(props.PrimitiveCode)) {
                setIsLoading(false);
                setErrMsg('Diagram code is not complete or invalid.');
                return;
            }
            const cacheKey = `${props.PrimitiveCode}-${look}-${currentTheme}`;
            if (diagramCache.has(cacheKey)) {
                setErrMsg('');
                setSvgString(diagramCache.get(cacheKey) || null);
                setIsLoading(false);
                return;
            }
            if (configureMermaid(props.PrimitiveCode))
                renderFlowchart(props.PrimitiveCode);
        }, 300); // 300ms debounce
        return () => {
            if (renderTimeoutRef.current)
                clearTimeout(renderTimeoutRef.current);
        };
    }, [props.PrimitiveCode, look, currentTheme, isInitialized, configureMermaid, renderFlowchart]);
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            if (containerRef.current)
                containerRef.current.innerHTML = '';
            if (renderTimeoutRef.current)
                clearTimeout(renderTimeoutRef.current);
        };
    }, []);
    const handlePreviewClick = async () => {
        if (svgString) {
            const base64 = await (0, utils_1.svgToBase64)(svgString);
            setImagePreviewUrl(base64);
        }
    };
    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        // Ensure a full, clean re-render cycle, consistent with global theme change.
        diagramCache.clear();
        setSvgString(null);
        setCurrentTheme(newTheme);
    };
    // Style classes for theme-dependent elements
    const themeClasses = {
        container: (0, classnames_1.cn)('relative', {
            'bg-white': currentTheme === app_1.Theme.light,
            'bg-slate-900': currentTheme === app_1.Theme.dark,
        }),
        mermaidDiv: (0, classnames_1.cn)('mermaid relative h-auto w-full cursor-pointer', {
            'bg-white': currentTheme === app_1.Theme.light,
            'bg-slate-900': currentTheme === app_1.Theme.dark,
        }),
        errorMessage: (0, classnames_1.cn)('px-[26px] py-4', {
            'text-red-500': currentTheme === app_1.Theme.light,
            'text-red-400': currentTheme === app_1.Theme.dark,
        }),
        errorIcon: (0, classnames_1.cn)('h-6 w-6', {
            'text-red-500': currentTheme === app_1.Theme.light,
            'text-red-400': currentTheme === app_1.Theme.dark,
        }),
        segmented: (0, classnames_1.cn)('msh-segmented msh-segmented-sm css-23bs09 css-var-r1', {
            'text-gray-700': currentTheme === app_1.Theme.light,
            'text-gray-300': currentTheme === app_1.Theme.dark,
        }),
        themeToggle: (0, classnames_1.cn)('flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-300', {
            'bg-white/80 hover:bg-white hover:shadow-lg text-gray-700 border border-gray-200': currentTheme === app_1.Theme.light,
            'bg-slate-800/80 hover:bg-slate-700 hover:shadow-lg text-yellow-300 border border-slate-600': currentTheme === app_1.Theme.dark,
        }),
    };
    // Style classes for look options
    const getLookButtonClass = (lookType) => {
        return (0, classnames_1.cn)('system-sm-medium mb-4 flex h-8 w-[calc((100%-8px)/2)] cursor-pointer items-center justify-center rounded-lg border border-components-option-card-option-border bg-components-option-card-option-bg text-text-secondary', look === lookType && 'border-[1.5px] border-components-option-card-option-selected-border bg-components-option-card-option-selected-bg text-text-primary', currentTheme === app_1.Theme.dark && 'border-slate-600 bg-slate-800 text-slate-300', look === lookType && currentTheme === app_1.Theme.dark && 'border-blue-500 bg-slate-700 text-white');
    };
    return (<div ref={props.ref} className={themeClasses.container}>
      <div className={themeClasses.segmented}>
        <div className="msh-segmented-group">
          <label className="msh-segmented-item m-2 flex w-[200px] items-center space-x-1">
            <div key="classic" className={getLookButtonClass('classic')} onClick={() => {
            if (look !== 'classic') {
                diagramCache.clear();
                setSvgString(null);
                setLook('classic');
            }
        }}>
              <div className="msh-segmented-item-label">{t('mermaid.classic', { ns: 'app' })}</div>
            </div>
            <div key="handDrawn" className={getLookButtonClass('handDrawn')} onClick={() => {
            if (look !== 'handDrawn') {
                diagramCache.clear();
                setSvgString(null);
                setLook('handDrawn');
            }
        }}>
              <div className="msh-segmented-item-label">{t('mermaid.handDrawn', { ns: 'app' })}</div>
            </div>
          </label>
        </div>
      </div>

      <div ref={containerRef} style={{ position: 'absolute', visibility: 'hidden', height: 0, overflow: 'hidden' }}/>

      {isLoading && !svgString && (<div className="px-[26px] py-4">
          <loading_anim_1.default type="text"/>
          <div className="mt-2 text-sm text-gray-500">
            {t('wait_for_completion', { ns: 'common', defaultValue: 'Waiting for diagram code to complete...' })}
          </div>
        </div>)}

      {svgString && (<div className={themeClasses.mermaidDiv} style={{ objectFit: 'cover' }} onClick={handlePreviewClick}>
          <div className="absolute bottom-2 left-2 z-[100]">
            <button type="button" onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
            }} className={themeClasses.themeToggle} title={(currentTheme === app_1.Theme.light ? t('theme.switchDark', { ns: 'app' }) : t('theme.switchLight', { ns: 'app' })) || ''} style={{ transform: 'translate3d(0, 0, 0)' }}>
              {currentTheme === app_1.Theme.light ? <solid_1.MoonIcon className="h-5 w-5"/> : <solid_1.SunIcon className="h-5 w-5"/>}
            </button>
          </div>

          <div style={{ maxWidth: '100%' }} dangerouslySetInnerHTML={{ __html: svgString }}/>
        </div>)}

      {errMsg && (<div className={themeClasses.errorMessage}>
          <div className="flex items-center">
            <outline_1.ExclamationTriangleIcon className={themeClasses.errorIcon}/>
            <span className="ml-2">{errMsg}</span>
          </div>
        </div>)}

      {imagePreviewUrl && (<image_preview_1.default title="mermaid_chart" url={imagePreviewUrl} onCancel={() => setImagePreviewUrl('')}/>)}
    </div>);
};
Flowchart.displayName = 'Flowchart';
exports.default = Flowchart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5REFBcUU7QUFDckUscURBQTZEO0FBQzdELHFDQUE2QjtBQUM3QiwrQkFBOEI7QUFDOUIsaUNBQWdFO0FBQ2hFLGlEQUE4QztBQUM5QywrRUFBc0U7QUFDdEUsc0ZBQTZFO0FBQzdFLHFDQUFtQztBQUNuQyxtREFBdUM7QUFDdkMsbUNBUWdCO0FBRWhCLHFDQUFxQztBQUNyQyxJQUFJLG9CQUFvQixHQUFHLEtBQUssQ0FBQTtBQUNoQyxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQTtBQUM5QyxJQUFJLFVBQVUsR0FBUSxJQUFJLENBQUE7QUFFMUIsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXO0lBQy9CLFVBQVUsR0FBRyxpQkFBTyxDQUFDLFVBQVUsQ0FBQTtBQUVqQyx1QkFBdUI7QUFDdkIsTUFBTSxNQUFNLEdBQUc7SUFDYixLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsYUFBYTtRQUNuQixVQUFVLEVBQUUsU0FBUztRQUNyQixZQUFZLEVBQUUsU0FBUztRQUN2QixrQkFBa0IsRUFBRSxTQUFTO1FBQzdCLGdCQUFnQixFQUFFLFNBQVM7UUFDM0IsY0FBYyxFQUFFLFNBQVM7UUFDekIsYUFBYSxFQUFFLFNBQVM7UUFDeEIsVUFBVSxFQUFFO1lBQ1YsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDbkMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDbkMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDbkMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDbkMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7U0FDcEM7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RztZQUFBLEVBQUUsTUFBTSxDQUNWO1VBQUEsRUFBRSxHQUFHLENBRUw7O1VBQUEsQ0FBQyxHQUFHLENBQ0YsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FDNUIsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUVuRDtRQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FFRDs7TUFBQSxDQUFDLE1BQU0sSUFBSSxDQUNULENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FDeEM7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQ2hDO1lBQUEsQ0FBQyxpQ0FBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQzNEO1lBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FDdkM7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FFRDs7TUFBQSxDQUFDLGVBQWUsSUFBSSxDQUNsQixDQUFDLHVCQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFHLENBQ3JHLENBQ0g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxTQUFTLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUVuQyxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1lcm1haWRDb25maWcgfSBmcm9tICdtZXJtYWlkJ1xuaW1wb3J0IHsgRXhjbGFtYXRpb25UcmlhbmdsZUljb24gfSBmcm9tICdAaGVyb2ljb25zL3JlYWN0LzI0L291dGxpbmUnXG5pbXBvcnQgeyBNb29uSWNvbiwgU3VuSWNvbiB9IGZyb20gJ0BoZXJvaWNvbnMvcmVhY3QvMjQvc29saWQnXG5pbXBvcnQgbWVybWFpZCBmcm9tICdtZXJtYWlkJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgTG9hZGluZ0FuaW0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoYXQvY2hhdC9sb2FkaW5nLWFuaW0nXG5pbXBvcnQgSW1hZ2VQcmV2aWV3IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pbWFnZS11cGxvYWRlci9pbWFnZS1wcmV2aWV3J1xuaW1wb3J0IHsgVGhlbWUgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHtcbiAgY2xlYW5VcFN2Z0NvZGUsXG4gIGlzTWVybWFpZENvZGVDb21wbGV0ZSxcbiAgcHJlcGFyZU1lcm1haWRDb2RlLFxuICBwcm9jZXNzU3ZnRm9yVGhlbWUsXG4gIHNhbml0aXplTWVybWFpZENvZGUsXG4gIHN2Z1RvQmFzZTY0LFxuICB3YWl0Rm9yRE9NRWxlbWVudCxcbn0gZnJvbSAnLi91dGlscydcblxuLy8gR2xvYmFsIGZsYWdzIGFuZCBjYWNoZSBmb3IgbWVybWFpZFxubGV0IGlzTWVybWFpZEluaXRpYWxpemVkID0gZmFsc2VcbmNvbnN0IGRpYWdyYW1DYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KClcbmxldCBtZXJtYWlkQVBJOiBhbnkgPSBudWxsXG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJylcbiAgbWVybWFpZEFQSSA9IG1lcm1haWQubWVybWFpZEFQSVxuXG4vLyBUaGVtZSBjb25maWd1cmF0aW9uc1xuY29uc3QgVEhFTUVTID0ge1xuICBsaWdodDoge1xuICAgIG5hbWU6ICdMaWdodCBUaGVtZScsXG4gICAgYmFja2dyb3VuZDogJyNmZmZmZmYnLFxuICAgIHByaW1hcnlDb2xvcjogJyNmZmZmZmYnLFxuICAgIHByaW1hcnlCb3JkZXJDb2xvcjogJyMwMDAwMDAnLFxuICAgIHByaW1hcnlUZXh0Q29sb3I6ICcjMDAwMDAwJyxcbiAgICBzZWNvbmRhcnlDb2xvcjogJyNmZmZmZmYnLFxuICAgIHRlcnRpYXJ5Q29sb3I6ICcjZmZmZmZmJyxcbiAgICBub2RlQ29sb3JzOiBbXG4gICAgICB7IGJnOiAnI2YwZjlmZicsIGNvbG9yOiAnIzAzNjlhMScgfSxcbiAgICAgIHsgYmc6ICcjZjBmZGY0JywgY29sb3I6ICcjMTY2NTM0JyB9LFxuICAgICAgeyBiZzogJyNmZWYyZjInLCBjb2xvcjogJyNiOTFjMWMnIH0sXG4gICAgICB7IGJnOiAnI2ZhZjVmZicsIGNvbG9yOiAnIzdlMjJjZScgfSxcbiAgICAgIHsgYmc6ICcjZmZmYmViJywgY29sb3I6ICcjYjQ1MzA5JyB9LFxuICAgIF0sXG4gICAgY29ubmVjdGlvbkNvbG9yOiAnIzc0YTBlMCcsXG4gIH0sXG4gIGRhcms6IHtcbiAgICBuYW1lOiAnRGFyayBUaGVtZScsXG4gICAgYmFja2dyb3VuZDogJyMxZTI5M2InLFxuICAgIHByaW1hcnlDb2xvcjogJyMzMzQxNTUnLFxuICAgIHByaW1hcnlCb3JkZXJDb2xvcjogJyM5NGEzYjgnLFxuICAgIHByaW1hcnlUZXh0Q29sb3I6ICcjZTJlOGYwJyxcbiAgICBzZWNvbmRhcnlDb2xvcjogJyM0NzU1NjknLFxuICAgIHRlcnRpYXJ5Q29sb3I6ICcjMzM0MTU1JyxcbiAgICBub2RlQ29sb3JzOiBbXG4gICAgICB7IGJnOiAnIzE2NGU2MycsIGNvbG9yOiAnI2UwZjJmZScgfSxcbiAgICAgIHsgYmc6ICcjMTQ1MzJkJywgY29sb3I6ICcjZGNmY2U3JyB9LFxuICAgICAgeyBiZzogJyM3ZjFkMWQnLCBjb2xvcjogJyNmZWUyZTInIH0sXG4gICAgICB7IGJnOiAnIzU4MWM4NycsIGNvbG9yOiAnI2YzZThmZicgfSxcbiAgICAgIHsgYmc6ICcjNzgzNTBmJywgY29sb3I6ICcjZmVmM2M3JyB9LFxuICAgIF0sXG4gICAgY29ubmVjdGlvbkNvbG9yOiAnIzYwYTVmYScsXG4gIH0sXG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgbWVybWFpZCBsaWJyYXJ5IHdpdGggZGVmYXVsdCBjb25maWd1cmF0aW9uXG4gKi9cbmNvbnN0IGluaXRNZXJtYWlkID0gKCkgPT4ge1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgIWlzTWVybWFpZEluaXRpYWxpemVkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbmZpZzogTWVybWFpZENvbmZpZyA9IHtcbiAgICAgICAgc3RhcnRPbkxvYWQ6IGZhbHNlLFxuICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgIHNlY3VyaXR5TGV2ZWw6ICdzdHJpY3QnLFxuICAgICAgICBmbG93Y2hhcnQ6IHtcbiAgICAgICAgICBodG1sTGFiZWxzOiB0cnVlLFxuICAgICAgICAgIHVzZU1heFdpZHRoOiB0cnVlLFxuICAgICAgICAgIGN1cnZlOiAnYmFzaXMnLFxuICAgICAgICAgIG5vZGVTcGFjaW5nOiA1MCxcbiAgICAgICAgICByYW5rU3BhY2luZzogNzAsXG4gICAgICAgIH0sXG4gICAgICAgIGdhbnR0OiB7XG4gICAgICAgICAgdGl0bGVUb3BNYXJnaW46IDI1LFxuICAgICAgICAgIGJhckhlaWdodDogMjAsXG4gICAgICAgICAgYmFyR2FwOiA0LFxuICAgICAgICAgIHRvcFBhZGRpbmc6IDUwLFxuICAgICAgICAgIGxlZnRQYWRkaW5nOiA3NSxcbiAgICAgICAgICBncmlkTGluZVN0YXJ0UGFkZGluZzogMzUsXG4gICAgICAgICAgZm9udFNpemU6IDExLFxuICAgICAgICAgIG51bWJlclNlY3Rpb25TdHlsZXM6IDQsXG4gICAgICAgICAgYXhpc0Zvcm1hdDogJyVZLSVtLSVkJyxcbiAgICAgICAgfSxcbiAgICAgICAgbWluZG1hcDoge1xuICAgICAgICAgIHVzZU1heFdpZHRoOiB0cnVlLFxuICAgICAgICAgIHBhZGRpbmc6IDEwLFxuICAgICAgICB9LFxuICAgICAgICBtYXhUZXh0U2l6ZTogNTAwMDAsXG4gICAgICB9XG4gICAgICBtZXJtYWlkLmluaXRpYWxpemUoY29uZmlnKVxuICAgICAgaXNNZXJtYWlkSW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignTWVybWFpZCBpbml0aWFsaXphdGlvbiBlcnJvcjonLCBlcnJvcilcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIHJldHVybiBpc01lcm1haWRJbml0aWFsaXplZFxufVxuXG50eXBlIEZsb3djaGFydFByb3BzID0ge1xuICBQcmltaXRpdmVDb2RlOiBzdHJpbmdcbiAgdGhlbWU/OiAnbGlnaHQnIHwgJ2RhcmsnXG4gIHJlZj86IFJlYWN0LlJlZjxIVE1MRGl2RWxlbWVudD5cbn1cblxuY29uc3QgRmxvd2NoYXJ0ID0gKHByb3BzOiBGbG93Y2hhcnRQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgW3N2Z1N0cmluZywgc2V0U3ZnU3RyaW5nXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtsb29rLCBzZXRMb29rXSA9IHVzZVN0YXRlPCdjbGFzc2ljJyB8ICdoYW5kRHJhd24nPignY2xhc3NpYycpXG4gIGNvbnN0IFtpc0luaXRpYWxpemVkLCBzZXRJc0luaXRpYWxpemVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbY3VycmVudFRoZW1lLCBzZXRDdXJyZW50VGhlbWVdID0gdXNlU3RhdGU8J2xpZ2h0JyB8ICdkYXJrJz4ocHJvcHMudGhlbWUgfHwgJ2xpZ2h0JylcbiAgY29uc3QgY29udGFpbmVyUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKVxuICBjb25zdCBjaGFydElkID0gdXNlUmVmKGBtZXJtYWlkLWNoYXJ0LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgMTEpfWApLmN1cnJlbnRcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpXG4gIGNvbnN0IHJlbmRlclRpbWVvdXRSZWYgPSB1c2VSZWY8Tm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZClcbiAgY29uc3QgW2Vyck1zZywgc2V0RXJyTXNnXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbaW1hZ2VQcmV2aWV3VXJsLCBzZXRJbWFnZVByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgTWVybWFpZCBjaGFydFxuICAgKi9cbiAgY29uc3QgcmVuZGVyTWVybWFpZENoYXJ0ID0gYXN5bmMgKGNvZGU6IHN0cmluZywgc3R5bGU6ICdjbGFzc2ljJyB8ICdoYW5kRHJhd24nKSA9PiB7XG4gICAgaWYgKHN0eWxlID09PSAnaGFuZERyYXduJykge1xuICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgaGFuZC1kcmF3biBzdHlsZVxuICAgICAgaWYgKGNvbnRhaW5lclJlZi5jdXJyZW50KVxuICAgICAgICBjb250YWluZXJSZWYuY3VycmVudC5pbm5lckhUTUwgPSBgPGRpdiBpZD1cIiR7Y2hhcnRJZH1cIj48L2Rpdj5gXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzApKVxuXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgbWVybWFpZEFQSSkge1xuICAgICAgICAvLyBQcmVmZXIgdXNpbmcgbWVybWFpZEFQSSBkaXJlY3RseSBmb3IgaGFuZC1kcmF3biBzdHlsZVxuICAgICAgICByZXR1cm4gYXdhaXQgbWVybWFpZEFQSS5yZW5kZXIoY2hhcnRJZCwgY29kZSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gc3RhbmRhcmQgcmVuZGVyaW5nIGlmIG1lcm1haWRBUEkgaXMgbm90IGF2YWlsYWJsZVxuICAgICAgICBjb25zdCB7IHN2ZyB9ID0gYXdhaXQgbWVybWFpZC5yZW5kZXIoY2hhcnRJZCwgY29kZSlcbiAgICAgICAgcmV0dXJuIHsgc3ZnIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBTdGFuZGFyZCByZW5kZXJpbmcgZm9yIGNsYXNzaWMgc3R5bGUgLSB1c2luZyB0aGUgZXh0cmFjdGVkIHdhaXRGb3JET01FbGVtZW50IGZ1bmN0aW9uXG4gICAgICBjb25zdCByZW5kZXJXaXRoUmV0cnkgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmIChjb250YWluZXJSZWYuY3VycmVudClcbiAgICAgICAgICBjb250YWluZXJSZWYuY3VycmVudC5pbm5lckhUTUwgPSBgPGRpdiBpZD1cIiR7Y2hhcnRJZH1cIj48L2Rpdj5gXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMCkpXG4gICAgICAgIGNvbnN0IHsgc3ZnIH0gPSBhd2FpdCBtZXJtYWlkLnJlbmRlcihjaGFydElkLCBjb2RlKVxuICAgICAgICByZXR1cm4geyBzdmcgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGF3YWl0IHdhaXRGb3JET01FbGVtZW50KHJlbmRlcldpdGhSZXRyeSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHJlbmRlcmluZyBlcnJvcnNcbiAgICovXG4gIGNvbnN0IGhhbmRsZVJlbmRlckVycm9yID0gKGVycm9yOiBhbnkpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKCdNZXJtYWlkIHJlbmRlcmluZyBlcnJvcjonLCBlcnJvcilcblxuICAgIC8vIE9uIGFueSByZW5kZXIgZXJyb3IsIGFzc3VtZSB0aGUgbWVybWFpZCBzdGF0ZSBpcyBjb3JydXB0ZWQgYW5kIGZvcmNlIGEgcmUtaW5pdGlhbGl6YXRpb24uXG4gICAgdHJ5IHtcbiAgICAgIGRpYWdyYW1DYWNoZS5jbGVhcigpIC8vIENsZWFyIGNhY2hlIHRvIHByZXZlbnQgdXNpbmcgcG90ZW50aWFsbHkgY29ycnVwdGVkIFNWR3NcbiAgICAgIGlzTWVybWFpZEluaXRpYWxpemVkID0gZmFsc2UgLy8gPC0tIFRIRSBGSVg6IEZvcmNlIHJlLWluaXRpYWxpemF0aW9uXG4gICAgICBpbml0TWVybWFpZCgpIC8vIFJlLWluaXRpYWxpemUgd2l0aCB0aGUgZGVmYXVsdCBzYWZlIGNvbmZpZ3VyYXRpb25cbiAgICB9XG4gICAgY2F0Y2ggKHJlaW5pdEVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcmUtaW5pdGlhbGl6ZSBNZXJtYWlkIGFmdGVyIGVycm9yOicsIHJlaW5pdEVycm9yKVxuICAgIH1cblxuICAgIHNldEVyck1zZyhgUmVuZGVyaW5nIGZhaWxlZDogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3IuIFBsZWFzZSBjaGVjayB0aGUgY29uc29sZS4nfWApXG4gICAgc2V0SXNMb2FkaW5nKGZhbHNlKVxuICB9XG5cbiAgLy8gSW5pdGlhbGl6ZSBtZXJtYWlkXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgYXBpID0gaW5pdE1lcm1haWQoKVxuICAgIGlmIChhcGkpXG4gICAgICBzZXRJc0luaXRpYWxpemVkKHRydWUpXG4gIH0sIFtdKVxuXG4gIC8vIFVwZGF0ZSB0aGVtZSB3aGVuIHByb3AgY2hhbmdlcywgYnV0IGFsbG93IGludGVybmFsIG92ZXJyaWRlLlxuICBjb25zdCBwcmV2VGhlbWVSZWYgPSB1c2VSZWY8c3RyaW5nIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gT25seSByZWFjdCBpZiB0aGUgdGhlbWUgcHJvcCBmcm9tIHRoZSBvdXRzaWRlIGhhcyBhY3R1YWxseSBjaGFuZ2VkLlxuICAgIGlmIChwcm9wcy50aGVtZSAmJiBwcm9wcy50aGVtZSAhPT0gcHJldlRoZW1lUmVmLmN1cnJlbnQpIHtcbiAgICAgIC8vIFdoZW4gdGhlIGdsb2JhbCB0aGVtZSBwcm9wIGNoYW5nZXMsIGl0IHNob3VsZCBhY3QgYXMgdGhlIHNvdXJjZSBvZiB0cnV0aCxcbiAgICAgIC8vIG92ZXJyaWRpbmcgYW55IGxvY2FsIHRoZW1lIHNlbGVjdGlvbi5cbiAgICAgIGRpYWdyYW1DYWNoZS5jbGVhcigpXG4gICAgICBzZXRTdmdTdHJpbmcobnVsbClcbiAgICAgIHNldEN1cnJlbnRUaGVtZShwcm9wcy50aGVtZSlcbiAgICAgIC8vIFJlc2V0IGxvb2sgdG8gY2xhc3NpYyBmb3IgYSBjb25zaXN0ZW50IHN0YXRlIGFmdGVyIGEgZ2xvYmFsIGNoYW5nZS5cbiAgICAgIHNldExvb2soJ2NsYXNzaWMnKVxuICAgIH1cbiAgICAvLyBVcGRhdGUgdGhlIHJlZiB0byB0aGUgY3VycmVudCBwcm9wIHZhbHVlIGZvciB0aGUgbmV4dCByZW5kZXIuXG4gICAgcHJldlRoZW1lUmVmLmN1cnJlbnQgPSBwcm9wcy50aGVtZVxuICB9LCBbcHJvcHMudGhlbWVdKVxuXG4gIGNvbnN0IHJlbmRlckZsb3djaGFydCA9IHVzZUNhbGxiYWNrKGFzeW5jIChwcmltaXRpdmVDb2RlOiBzdHJpbmcpID0+IHtcbiAgICBpZiAoIWlzSW5pdGlhbGl6ZWQgfHwgIWNvbnRhaW5lclJlZi5jdXJyZW50KSB7XG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpXG4gICAgICBzZXRFcnJNc2coIWlzSW5pdGlhbGl6ZWQgPyAnTWVybWFpZCBpbml0aWFsaXphdGlvbiBmYWlsZWQnIDogJ0NvbnRhaW5lciBlbGVtZW50IG5vdCBmb3VuZCcpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gY2FjaGVkIHJlc3VsdCBpZiBhdmFpbGFibGVcbiAgICBjb25zdCBjYWNoZUtleSA9IGAke3ByaW1pdGl2ZUNvZGV9LSR7bG9va30tJHtjdXJyZW50VGhlbWV9YFxuICAgIGlmIChkaWFncmFtQ2FjaGUuaGFzKGNhY2hlS2V5KSkge1xuICAgICAgc2V0RXJyTXNnKCcnKVxuICAgICAgc2V0U3ZnU3RyaW5nKGRpYWdyYW1DYWNoZS5nZXQoY2FjaGVLZXkpIHx8IG51bGwpXG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRJc0xvYWRpbmcodHJ1ZSlcbiAgICBzZXRFcnJNc2coJycpXG5cbiAgICB0cnkge1xuICAgICAgbGV0IGZpbmFsQ29kZTogc3RyaW5nXG5cbiAgICAgIGNvbnN0IHRyaW1tZWRDb2RlID0gcHJpbWl0aXZlQ29kZS50cmltKClcbiAgICAgIGNvbnN0IGlzR2FudHQgPSB0cmltbWVkQ29kZS5zdGFydHNXaXRoKCdnYW50dCcpXG4gICAgICBjb25zdCBpc01pbmRNYXAgPSB0cmltbWVkQ29kZS5zdGFydHNXaXRoKCdtaW5kbWFwJylcbiAgICAgIGNvbnN0IGlzU2VxdWVuY2UgPSB0cmltbWVkQ29kZS5zdGFydHNXaXRoKCdzZXF1ZW5jZURpYWdyYW0nKVxuXG4gICAgICBpZiAoaXNHYW50dCB8fCBpc01pbmRNYXAgfHwgaXNTZXF1ZW5jZSkge1xuICAgICAgICBpZiAoaXNHYW50dCkge1xuICAgICAgICAgIGZpbmFsQ29kZSA9IHRyaW1tZWRDb2RlXG4gICAgICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgICAubWFwKChsaW5lKSA9PiB7XG4gICAgICAgICAgICAgIC8vIEdhbnR0IGNoYXJ0cyBoYXZlIHNwZWNpZmljIHN5bnRheCBuZWVkcy5cbiAgICAgICAgICAgICAgY29uc3QgdGFza01hdGNoID0gbGluZS5tYXRjaCgvXlxccyooW146XSs/KVxccyo6XFxzKiguKikvKVxuICAgICAgICAgICAgICBpZiAoIXRhc2tNYXRjaClcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZSAvLyBOb3QgYSB0YXNrIGxpbmUsIHJldHVybiBhcyBpcy5cblxuICAgICAgICAgICAgICBjb25zdCB0YXNrTmFtZSA9IHRhc2tNYXRjaFsxXS50cmltKClcbiAgICAgICAgICAgICAgbGV0IHBhcmFtc1N0ciA9IHRhc2tNYXRjaFsyXS50cmltKClcblxuICAgICAgICAgICAgICAvLyBSdWxlIDE6IENvcnJlY3QgbXVsdGlwbGUgXCJhZnRlclwiIGRlcGVuZGVuY2llcyBPTkxZIGlmIHRoZXkgZXhpc3QuXG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBjb21tb24gbWlzdGFrZSwgZS5nLiwgXCIuLi4sIGFmdGVyIHRhc2sxLCBhZnRlciB0YXNrMiwgLi4uXCJcbiAgICAgICAgICAgICAgY29uc3QgYWZ0ZXJDb3VudCA9IChwYXJhbXNTdHIubWF0Y2goL2FmdGVyIC9nKSB8fCBbXSkubGVuZ3RoXG4gICAgICAgICAgICAgIGlmIChhZnRlckNvdW50ID4gMSlcbiAgICAgICAgICAgICAgICBwYXJhbXNTdHIgPSBwYXJhbXNTdHIucmVwbGFjZSgvLFxccyphZnRlclxccysvZywgJyAnKVxuXG4gICAgICAgICAgICAgIC8vIFJ1bGUgMjogTm9ybWFsaXplIHNwYWNpbmcgYmV0d2VlbiBwYXJhbWV0ZXJzIGZvciBjb25zaXN0ZW5jeS5cbiAgICAgICAgICAgICAgY29uc3QgZmluYWxQYXJhbXMgPSBwYXJhbXNTdHIucmVwbGFjZSgvXFxzKixcXHMqL2csICcsICcpLnRyaW0oKVxuICAgICAgICAgICAgICByZXR1cm4gYCR7dGFza05hbWV9IDoke2ZpbmFsUGFyYW1zfWBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignXFxuJylcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBGb3IgbWluZG1hcCBhbmQgc2VxdWVuY2UgY2hhcnRzLCB3aGljaCBhcmUgc2Vuc2l0aXZlIHRvIHN5bnRheCxcbiAgICAgICAgICAvLyBwYXNzIHRoZSBjb2RlIHRocm91Z2ggZGlyZWN0bHkuXG4gICAgICAgICAgZmluYWxDb2RlID0gdHJpbW1lZENvZGVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIFN0ZXAgMTogQ2xlYW4gYW5kIHByZXBhcmUgTWVybWFpZCBjb2RlIHVzaW5nIHRoZSBleHRyYWN0ZWQgcHJlcGFyZU1lcm1haWRDb2RlIGZ1bmN0aW9uXG4gICAgICAgIC8vIFRoaXMgZnVuY3Rpb24gaGFuZGxlcyBmbG93Y2hhcnRzIGFwcHJvcHJpYXRlbHkuXG4gICAgICAgIGZpbmFsQ29kZSA9IHByZXBhcmVNZXJtYWlkQ29kZShwcmltaXRpdmVDb2RlLCBsb29rKVxuICAgICAgfVxuXG4gICAgICBmaW5hbENvZGUgPSBzYW5pdGl6ZU1lcm1haWRDb2RlKGZpbmFsQ29kZSlcblxuICAgICAgLy8gU3RlcCAyOiBSZW5kZXIgY2hhcnRcbiAgICAgIGNvbnN0IHN2Z0dyYXBoID0gYXdhaXQgcmVuZGVyTWVybWFpZENoYXJ0KGZpbmFsQ29kZSwgbG9vaylcblxuICAgICAgLy8gU3RlcCAzOiBBcHBseSB0aGVtZSB0byBTVkcgdXNpbmcgdGhlIGV4dHJhY3RlZCBwcm9jZXNzU3ZnRm9yVGhlbWUgZnVuY3Rpb25cbiAgICAgIGNvbnN0IHByb2Nlc3NlZFN2ZyA9IHByb2Nlc3NTdmdGb3JUaGVtZShcbiAgICAgICAgc3ZnR3JhcGguc3ZnLFxuICAgICAgICBjdXJyZW50VGhlbWUgPT09IFRoZW1lLmRhcmssXG4gICAgICAgIGxvb2sgPT09ICdoYW5kRHJhd24nLFxuICAgICAgICBUSEVNRVMsXG4gICAgICApXG5cbiAgICAgIC8vIFN0ZXAgNDogQ2xlYW4gdXAgU1ZHIGNvZGVcbiAgICAgIGNvbnN0IGNsZWFuZWRTdmcgPSBjbGVhblVwU3ZnQ29kZShwcm9jZXNzZWRTdmcpXG5cbiAgICAgIGlmIChjbGVhbmVkU3ZnICYmIHR5cGVvZiBjbGVhbmVkU3ZnID09PSAnc3RyaW5nJykge1xuICAgICAgICBkaWFncmFtQ2FjaGUuc2V0KGNhY2hlS2V5LCBjbGVhbmVkU3ZnKVxuICAgICAgICBzZXRTdmdTdHJpbmcoY2xlYW5lZFN2ZylcbiAgICAgIH1cblxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIEVycm9yIGhhbmRsaW5nXG4gICAgICBoYW5kbGVSZW5kZXJFcnJvcihlcnJvcilcbiAgICB9XG4gIH0sIFtjaGFydElkLCBpc0luaXRpYWxpemVkLCBsb29rLCBjdXJyZW50VGhlbWUsIHRdKVxuXG4gIGNvbnN0IGNvbmZpZ3VyZU1lcm1haWQgPSB1c2VDYWxsYmFjaygocHJpbWl0aXZlQ29kZTogc3RyaW5nKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIGlzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIGNvbnN0IHRoZW1lVmFycyA9IFRIRU1FU1tjdXJyZW50VGhlbWVdXG4gICAgICBjb25zdCBjb25maWc6IE1lcm1haWRDb25maWcgPSB7XG4gICAgICAgIHN0YXJ0T25Mb2FkOiBmYWxzZSxcbiAgICAgICAgc2VjdXJpdHlMZXZlbDogJ3N0cmljdCcsXG4gICAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICAgICAgbWF4VGV4dFNpemU6IDUwMDAwLFxuICAgICAgICBnYW50dDoge1xuICAgICAgICAgIHRpdGxlVG9wTWFyZ2luOiAyNSxcbiAgICAgICAgICBiYXJIZWlnaHQ6IDIwLFxuICAgICAgICAgIGJhckdhcDogNCxcbiAgICAgICAgICB0b3BQYWRkaW5nOiA1MCxcbiAgICAgICAgICBsZWZ0UGFkZGluZzogNzUsXG4gICAgICAgICAgZ3JpZExpbmVTdGFydFBhZGRpbmc6IDM1LFxuICAgICAgICAgIGZvbnRTaXplOiAxMSxcbiAgICAgICAgICBudW1iZXJTZWN0aW9uU3R5bGVzOiA0LFxuICAgICAgICAgIGF4aXNGb3JtYXQ6ICclWS0lbS0lZCcsXG4gICAgICAgIH0sXG4gICAgICAgIG1pbmRtYXA6IHtcbiAgICAgICAgICB1c2VNYXhXaWR0aDogdHJ1ZSxcbiAgICAgICAgICBwYWRkaW5nOiAxMCxcbiAgICAgICAgfSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNGbG93Y2hhcnQgPSBwcmltaXRpdmVDb2RlLnRyaW0oKS5zdGFydHNXaXRoKCdncmFwaCcpIHx8IHByaW1pdGl2ZUNvZGUudHJpbSgpLnN0YXJ0c1dpdGgoJ2Zsb3djaGFydCcpXG5cbiAgICAgIGlmIChsb29rID09PSAnY2xhc3NpYycpIHtcbiAgICAgICAgY29uZmlnLnRoZW1lID0gY3VycmVudFRoZW1lID09PSAnZGFyaycgPyAnZGFyaycgOiAnbmV1dHJhbCdcblxuICAgICAgICBpZiAoaXNGbG93Y2hhcnQpIHtcbiAgICAgICAgICB0eXBlIEZsb3djaGFydENvbmZpZ1dpdGhSYW5rZXIgPSBOb25OdWxsYWJsZTxNZXJtYWlkQ29uZmlnWydmbG93Y2hhcnQnXT4gJiB7IHJhbmtlcj86IHN0cmluZyB9XG4gICAgICAgICAgY29uc3QgZmxvd2NoYXJ0Q29uZmlnOiBGbG93Y2hhcnRDb25maWdXaXRoUmFua2VyID0ge1xuICAgICAgICAgICAgaHRtbExhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgIHVzZU1heFdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgbm9kZVNwYWNpbmc6IDYwLFxuICAgICAgICAgICAgcmFua1NwYWNpbmc6IDgwLFxuICAgICAgICAgICAgY3VydmU6ICdsaW5lYXInLFxuICAgICAgICAgICAgcmFua2VyOiAndGlnaHQtdHJlZScsXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbmZpZy5mbG93Y2hhcnQgPSBmbG93Y2hhcnRDb25maWcgYXMgdW5rbm93biBhcyBNZXJtYWlkQ29uZmlnWydmbG93Y2hhcnQnXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRUaGVtZSA9PT0gJ2RhcmsnKSB7XG4gICAgICAgICAgY29uZmlnLnRoZW1lVmFyaWFibGVzID0ge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdGhlbWVWYXJzLmJhY2tncm91bmQsXG4gICAgICAgICAgICBwcmltYXJ5Q29sb3I6IHRoZW1lVmFycy5wcmltYXJ5Q29sb3IsXG4gICAgICAgICAgICBwcmltYXJ5Qm9yZGVyQ29sb3I6IHRoZW1lVmFycy5wcmltYXJ5Qm9yZGVyQ29sb3IsXG4gICAgICAgICAgICBwcmltYXJ5VGV4dENvbG9yOiB0aGVtZVZhcnMucHJpbWFyeVRleHRDb2xvcixcbiAgICAgICAgICAgIHNlY29uZGFyeUNvbG9yOiB0aGVtZVZhcnMuc2Vjb25kYXJ5Q29sb3IsXG4gICAgICAgICAgICB0ZXJ0aWFyeUNvbG9yOiB0aGVtZVZhcnMudGVydGlhcnlDb2xvcixcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgeyAvLyBsb29rID09PSAnaGFuZERyYXduJ1xuICAgICAgICBjb25maWcudGhlbWUgPSAnZGVmYXVsdCdcbiAgICAgICAgY29uZmlnLnRoZW1lQ1NTID0gYFxuICAgICAgICAgIC5ub2RlIHJlY3QgeyBmaWxsLW9wYWNpdHk6IDAuODU7IH1cbiAgICAgICAgICAuZWRnZVBhdGggLnBhdGggeyBzdHJva2Utd2lkdGg6IDEuNXB4OyB9XG4gICAgICAgICAgLmxhYmVsIHsgZm9udC1mYW1pbHk6ICdzYW5zLXNlcmlmJzsgfVxuICAgICAgICAgIC5lZGdlTGFiZWwgeyBmb250LWZhbWlseTogJ3NhbnMtc2VyaWYnOyB9XG4gICAgICAgICAgLmNsdXN0ZXIgcmVjdCB7IHJ4OiA1cHg7IHJ5OiA1cHg7IH1cbiAgICAgICAgYFxuICAgICAgICBjb25maWcudGhlbWVWYXJpYWJsZXMgPSB7XG4gICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgICAgcHJpbWFyeUJvcmRlckNvbG9yOiBjdXJyZW50VGhlbWUgPT09ICdkYXJrJyA/IFRIRU1FUy5kYXJrLmNvbm5lY3Rpb25Db2xvciA6IFRIRU1FUy5saWdodC5jb25uZWN0aW9uQ29sb3IsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGbG93Y2hhcnQpIHtcbiAgICAgICAgICBjb25maWcuZmxvd2NoYXJ0ID0ge1xuICAgICAgICAgICAgaHRtbExhYmVsczogdHJ1ZSxcbiAgICAgICAgICAgIHVzZU1heFdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgbm9kZVNwYWNpbmc6IDQwLFxuICAgICAgICAgICAgcmFua1NwYWNpbmc6IDYwLFxuICAgICAgICAgICAgY3VydmU6ICdiYXNpcycsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIG1lcm1haWQuaW5pdGlhbGl6ZShjb25maWcpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignQ29uZmlnIGVycm9yOicsIGVycm9yKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sIFtjdXJyZW50VGhlbWUsIGlzSW5pdGlhbGl6ZWQsIGxvb2tdKVxuXG4gIC8vIFRoaXMgaXMgdGhlIG1haW4gcmVuZGVyaW5nIGVmZmVjdC5cbiAgLy8gSXQgdHJpZ2dlcnMgd2hlbmV2ZXIgdGhlIGNvZGUsIHRoZW1lLCBvciBzdHlsZSBjaGFuZ2VzLlxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghaXNJbml0aWFsaXplZClcbiAgICAgIHJldHVyblxuXG4gICAgLy8gRG9uJ3QgcmVuZGVyIGlmIGNvZGUgaXMgdG9vIHNob3J0XG4gICAgaWYgKCFwcm9wcy5QcmltaXRpdmVDb2RlIHx8IHByb3BzLlByaW1pdGl2ZUNvZGUubGVuZ3RoIDwgMTApIHtcbiAgICAgIHNldElzTG9hZGluZyhmYWxzZSlcbiAgICAgIHNldFN2Z1N0cmluZyhudWxsKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVXNlIGEgdGltZW91dCB0byBoYW5kbGUgc3RyZWFtaW5nIGNvZGUgYW5kIGRlYm91bmNlIHJlbmRlcmluZ1xuICAgIGlmIChyZW5kZXJUaW1lb3V0UmVmLmN1cnJlbnQpXG4gICAgICBjbGVhclRpbWVvdXQocmVuZGVyVGltZW91dFJlZi5jdXJyZW50KVxuXG4gICAgc2V0SXNMb2FkaW5nKHRydWUpXG5cbiAgICByZW5kZXJUaW1lb3V0UmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIEZpbmFsIHZhbGlkYXRpb24gYmVmb3JlIHJlbmRlcmluZ1xuICAgICAgaWYgKCFpc01lcm1haWRDb2RlQ29tcGxldGUocHJvcHMuUHJpbWl0aXZlQ29kZSkpIHtcbiAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKVxuICAgICAgICBzZXRFcnJNc2coJ0RpYWdyYW0gY29kZSBpcyBub3QgY29tcGxldGUgb3IgaW52YWxpZC4nKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgY2FjaGVLZXkgPSBgJHtwcm9wcy5QcmltaXRpdmVDb2RlfS0ke2xvb2t9LSR7Y3VycmVudFRoZW1lfWBcbiAgICAgIGlmIChkaWFncmFtQ2FjaGUuaGFzKGNhY2hlS2V5KSkge1xuICAgICAgICBzZXRFcnJNc2coJycpXG4gICAgICAgIHNldFN2Z1N0cmluZyhkaWFncmFtQ2FjaGUuZ2V0KGNhY2hlS2V5KSB8fCBudWxsKVxuICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlndXJlTWVybWFpZChwcm9wcy5QcmltaXRpdmVDb2RlKSlcbiAgICAgICAgcmVuZGVyRmxvd2NoYXJ0KHByb3BzLlByaW1pdGl2ZUNvZGUpXG4gICAgfSwgMzAwKSAvLyAzMDBtcyBkZWJvdW5jZVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChyZW5kZXJUaW1lb3V0UmVmLmN1cnJlbnQpXG4gICAgICAgIGNsZWFyVGltZW91dChyZW5kZXJUaW1lb3V0UmVmLmN1cnJlbnQpXG4gICAgfVxuICB9LCBbcHJvcHMuUHJpbWl0aXZlQ29kZSwgbG9vaywgY3VycmVudFRoZW1lLCBpc0luaXRpYWxpemVkLCBjb25maWd1cmVNZXJtYWlkLCByZW5kZXJGbG93Y2hhcnRdKVxuXG4gIC8vIENsZWFudXAgb24gdW5tb3VudFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoY29udGFpbmVyUmVmLmN1cnJlbnQpXG4gICAgICAgIGNvbnRhaW5lclJlZi5jdXJyZW50LmlubmVySFRNTCA9ICcnXG4gICAgICBpZiAocmVuZGVyVGltZW91dFJlZi5jdXJyZW50KVxuICAgICAgICBjbGVhclRpbWVvdXQocmVuZGVyVGltZW91dFJlZi5jdXJyZW50KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlUHJldmlld0NsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmIChzdmdTdHJpbmcpIHtcbiAgICAgIGNvbnN0IGJhc2U2NCA9IGF3YWl0IHN2Z1RvQmFzZTY0KHN2Z1N0cmluZylcbiAgICAgIHNldEltYWdlUHJldmlld1VybChiYXNlNjQpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdG9nZ2xlVGhlbWUgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV3VGhlbWUgPSBjdXJyZW50VGhlbWUgPT09ICdsaWdodCcgPyAnZGFyaycgOiAnbGlnaHQnXG4gICAgLy8gRW5zdXJlIGEgZnVsbCwgY2xlYW4gcmUtcmVuZGVyIGN5Y2xlLCBjb25zaXN0ZW50IHdpdGggZ2xvYmFsIHRoZW1lIGNoYW5nZS5cbiAgICBkaWFncmFtQ2FjaGUuY2xlYXIoKVxuICAgIHNldFN2Z1N0cmluZyhudWxsKVxuICAgIHNldEN1cnJlbnRUaGVtZShuZXdUaGVtZSlcbiAgfVxuXG4gIC8vIFN0eWxlIGNsYXNzZXMgZm9yIHRoZW1lLWRlcGVuZGVudCBlbGVtZW50c1xuICBjb25zdCB0aGVtZUNsYXNzZXMgPSB7XG4gICAgY29udGFpbmVyOiBjbigncmVsYXRpdmUnLCB7XG4gICAgICAnYmctd2hpdGUnOiBjdXJyZW50VGhlbWUgPT09IFRoZW1lLmxpZ2h0LFxuICAgICAgJ2JnLXNsYXRlLTkwMCc6IGN1cnJlbnRUaGVtZSA9PT0gVGhlbWUuZGFyayxcbiAgICB9KSxcbiAgICBtZXJtYWlkRGl2OiBjbignbWVybWFpZCByZWxhdGl2ZSBoLWF1dG8gdy1mdWxsIGN1cnNvci1wb2ludGVyJywge1xuICAgICAgJ2JnLXdoaXRlJzogY3VycmVudFRoZW1lID09PSBUaGVtZS5saWdodCxcbiAgICAgICdiZy1zbGF0ZS05MDAnOiBjdXJyZW50VGhlbWUgPT09IFRoZW1lLmRhcmssXG4gICAgfSksXG4gICAgZXJyb3JNZXNzYWdlOiBjbigncHgtWzI2cHhdIHB5LTQnLCB7XG4gICAgICAndGV4dC1yZWQtNTAwJzogY3VycmVudFRoZW1lID09PSBUaGVtZS5saWdodCxcbiAgICAgICd0ZXh0LXJlZC00MDAnOiBjdXJyZW50VGhlbWUgPT09IFRoZW1lLmRhcmssXG4gICAgfSksXG4gICAgZXJyb3JJY29uOiBjbignaC02IHctNicsIHtcbiAgICAgICd0ZXh0LXJlZC01MDAnOiBjdXJyZW50VGhlbWUgPT09IFRoZW1lLmxpZ2h0LFxuICAgICAgJ3RleHQtcmVkLTQwMCc6IGN1cnJlbnRUaGVtZSA9PT0gVGhlbWUuZGFyayxcbiAgICB9KSxcbiAgICBzZWdtZW50ZWQ6IGNuKCdtc2gtc2VnbWVudGVkIG1zaC1zZWdtZW50ZWQtc20gY3NzLTIzYnMwOSBjc3MtdmFyLXIxJywge1xuICAgICAgJ3RleHQtZ3JheS03MDAnOiBjdXJyZW50VGhlbWUgPT09IFRoZW1lLmxpZ2h0LFxuICAgICAgJ3RleHQtZ3JheS0zMDAnOiBjdXJyZW50VGhlbWUgPT09IFRoZW1lLmRhcmssXG4gICAgfSksXG4gICAgdGhlbWVUb2dnbGU6IGNuKCdmbGV4IGgtMTAgdy0xMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIHNoYWRvdy1tZCBiYWNrZHJvcC1ibHVyLXNtIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCcsIHtcbiAgICAgICdiZy13aGl0ZS84MCBob3ZlcjpiZy13aGl0ZSBob3ZlcjpzaGFkb3ctbGcgdGV4dC1ncmF5LTcwMCBib3JkZXIgYm9yZGVyLWdyYXktMjAwJzogY3VycmVudFRoZW1lID09PSBUaGVtZS5saWdodCxcbiAgICAgICdiZy1zbGF0ZS04MDAvODAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOnNoYWRvdy1sZyB0ZXh0LXllbGxvdy0zMDAgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAnOiBjdXJyZW50VGhlbWUgPT09IFRoZW1lLmRhcmssXG4gICAgfSksXG4gIH1cblxuICAvLyBTdHlsZSBjbGFzc2VzIGZvciBsb29rIG9wdGlvbnNcbiAgY29uc3QgZ2V0TG9va0J1dHRvbkNsYXNzID0gKGxvb2tUeXBlOiAnY2xhc3NpYycgfCAnaGFuZERyYXduJykgPT4ge1xuICAgIHJldHVybiBjbihcbiAgICAgICdzeXN0ZW0tc20tbWVkaXVtIG1iLTQgZmxleCBoLTggdy1bY2FsYygoMTAwJS04cHgpLzIpXSBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWNvbXBvbmVudHMtb3B0aW9uLWNhcmQtb3B0aW9uLWJvcmRlciBiZy1jb21wb25lbnRzLW9wdGlvbi1jYXJkLW9wdGlvbi1iZyB0ZXh0LXRleHQtc2Vjb25kYXJ5JyxcbiAgICAgIGxvb2sgPT09IGxvb2tUeXBlICYmICdib3JkZXItWzEuNXB4XSBib3JkZXItY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tc2VsZWN0ZWQtYm9yZGVyIGJnLWNvbXBvbmVudHMtb3B0aW9uLWNhcmQtb3B0aW9uLXNlbGVjdGVkLWJnIHRleHQtdGV4dC1wcmltYXJ5JyxcbiAgICAgIGN1cnJlbnRUaGVtZSA9PT0gVGhlbWUuZGFyayAmJiAnYm9yZGVyLXNsYXRlLTYwMCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS0zMDAnLFxuICAgICAgbG9vayA9PT0gbG9va1R5cGUgJiYgY3VycmVudFRoZW1lID09PSBUaGVtZS5kYXJrICYmICdib3JkZXItYmx1ZS01MDAgYmctc2xhdGUtNzAwIHRleHQtd2hpdGUnLFxuICAgIClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiByZWY9e3Byb3BzLnJlZiBhcyBSZWFjdC5SZWZPYmplY3Q8SFRNTERpdkVsZW1lbnQ+fSBjbGFzc05hbWU9e3RoZW1lQ2xhc3Nlcy5jb250YWluZXJ9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9e3RoZW1lQ2xhc3Nlcy5zZWdtZW50ZWR9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1zaC1zZWdtZW50ZWQtZ3JvdXBcIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibXNoLXNlZ21lbnRlZC1pdGVtIG0tMiBmbGV4IHctWzIwMHB4XSBpdGVtcy1jZW50ZXIgc3BhY2UteC0xXCI+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT1cImNsYXNzaWNcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2dldExvb2tCdXR0b25DbGFzcygnY2xhc3NpYycpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxvb2sgIT09ICdjbGFzc2ljJykge1xuICAgICAgICAgICAgICAgICAgZGlhZ3JhbUNhY2hlLmNsZWFyKClcbiAgICAgICAgICAgICAgICAgIHNldFN2Z1N0cmluZyhudWxsKVxuICAgICAgICAgICAgICAgICAgc2V0TG9vaygnY2xhc3NpYycpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1zaC1zZWdtZW50ZWQtaXRlbS1sYWJlbFwiPnt0KCdtZXJtYWlkLmNsYXNzaWMnLCB7IG5zOiAnYXBwJyB9KX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBrZXk9XCJoYW5kRHJhd25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2dldExvb2tCdXR0b25DbGFzcygnaGFuZERyYXduJyl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobG9vayAhPT0gJ2hhbmREcmF3bicpIHtcbiAgICAgICAgICAgICAgICAgIGRpYWdyYW1DYWNoZS5jbGVhcigpXG4gICAgICAgICAgICAgICAgICBzZXRTdmdTdHJpbmcobnVsbClcbiAgICAgICAgICAgICAgICAgIHNldExvb2soJ2hhbmREcmF3bicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1zaC1zZWdtZW50ZWQtaXRlbS1sYWJlbFwiPnt0KCdtZXJtYWlkLmhhbmREcmF3bicsIHsgbnM6ICdhcHAnIH0pfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiByZWY9e2NvbnRhaW5lclJlZn0gc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHZpc2liaWxpdHk6ICdoaWRkZW4nLCBoZWlnaHQ6IDAsIG92ZXJmbG93OiAnaGlkZGVuJyB9fSAvPlxuXG4gICAgICB7aXNMb2FkaW5nICYmICFzdmdTdHJpbmcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LVsyNnB4XSBweS00XCI+XG4gICAgICAgICAgPExvYWRpbmdBbmltIHR5cGU9XCJ0ZXh0XCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTIgdGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICB7dCgnd2FpdF9mb3JfY29tcGxldGlvbicsIHsgbnM6ICdjb21tb24nLCBkZWZhdWx0VmFsdWU6ICdXYWl0aW5nIGZvciBkaWFncmFtIGNvZGUgdG8gY29tcGxldGUuLi4nIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHtzdmdTdHJpbmcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhlbWVDbGFzc2VzLm1lcm1haWREaXZ9IHN0eWxlPXt7IG9iamVjdEZpdDogJ2NvdmVyJyB9fSBvbkNsaWNrPXtoYW5kbGVQcmV2aWV3Q2xpY2t9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTIgbGVmdC0yIHotWzEwMF1cIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgIHRvZ2dsZVRoZW1lKClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGVtZUNsYXNzZXMudGhlbWVUb2dnbGV9XG4gICAgICAgICAgICAgIHRpdGxlPXsoY3VycmVudFRoZW1lID09PSBUaGVtZS5saWdodCA/IHQoJ3RoZW1lLnN3aXRjaERhcmsnLCB7IG5zOiAnYXBwJyB9KSA6IHQoJ3RoZW1lLnN3aXRjaExpZ2h0JywgeyBuczogJ2FwcCcgfSkpIHx8ICcnfVxuICAgICAgICAgICAgICBzdHlsZT17eyB0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2N1cnJlbnRUaGVtZSA9PT0gVGhlbWUubGlnaHQgPyA8TW9vbkljb24gY2xhc3NOYW1lPVwiaC01IHctNVwiIC8+IDogPFN1bkljb24gY2xhc3NOYW1lPVwiaC01IHctNVwiIC8+fVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17eyBtYXhXaWR0aDogJzEwMCUnIH19XG4gICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHN2Z1N0cmluZyB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAge2Vyck1zZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGVtZUNsYXNzZXMuZXJyb3JNZXNzYWdlfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICA8RXhjbGFtYXRpb25UcmlhbmdsZUljb24gY2xhc3NOYW1lPXt0aGVtZUNsYXNzZXMuZXJyb3JJY29ufSAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMlwiPntlcnJNc2d9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHtpbWFnZVByZXZpZXdVcmwgJiYgKFxuICAgICAgICA8SW1hZ2VQcmV2aWV3IHRpdGxlPVwibWVybWFpZF9jaGFydFwiIHVybD17aW1hZ2VQcmV2aWV3VXJsfSBvbkNhbmNlbD17KCkgPT4gc2V0SW1hZ2VQcmV2aWV3VXJsKCcnKX0gLz5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuRmxvd2NoYXJ0LmRpc3BsYXlOYW1lID0gJ0Zsb3djaGFydCdcblxuZXhwb3J0IGRlZmF1bHQgRmxvd2NoYXJ0XG4iXX0=