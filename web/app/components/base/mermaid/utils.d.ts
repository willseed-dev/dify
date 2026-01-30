export declare function cleanUpSvgCode(svgCode: string): string;
export declare const sanitizeMermaidCode: (mermaidCode: string) => string;
/**
 * Prepares mermaid code for rendering by sanitizing common syntax issues.
 * @param {string} mermaidCode - The mermaid code to prepare
 * @param {'classic' | 'handDrawn'} style - The rendering style
 * @returns {string} - The prepared mermaid code
 */
export declare const prepareMermaidCode: (mermaidCode: string, style: "classic" | "handDrawn") => string;
/**
 * Converts SVG to base64 string for image rendering
 */
export declare function svgToBase64(svgGraph: string): Promise<string>;
/**
 * Processes SVG for theme styling
 */
export declare function processSvgForTheme(svg: string, isDark: boolean, isHandDrawn: boolean, themes: {
    light: any;
    dark: any;
}): string;
/**
 * Checks if mermaid code is complete and valid
 */
export declare function isMermaidCodeComplete(code: string): boolean;
/**
 * Helper to wait for DOM element with retry mechanism
 */
export declare function waitForDOMElement(callback: () => Promise<any>, maxAttempts?: number, delay?: number): Promise<any>;
