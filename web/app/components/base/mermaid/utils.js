"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareMermaidCode = exports.sanitizeMermaidCode = void 0;
exports.cleanUpSvgCode = cleanUpSvgCode;
exports.svgToBase64 = svgToBase64;
exports.processSvgForTheme = processSvgForTheme;
exports.isMermaidCodeComplete = isMermaidCodeComplete;
exports.waitForDOMElement = waitForDOMElement;
function cleanUpSvgCode(svgCode) {
    return svgCode.replaceAll('<br>', '<br/>');
}
const sanitizeMermaidCode = (mermaidCode) => {
    if (!mermaidCode || typeof mermaidCode !== 'string')
        return '';
    return mermaidCode
        .split('\n')
        .filter((line) => {
        const trimmed = line.trimStart();
        // Mermaid directives can override config; treat as untrusted in chat context.
        if (trimmed.startsWith('%%{'))
            return false;
        // Mermaid click directives can create JS callbacks/links inside rendered SVG.
        if (trimmed.startsWith('click '))
            return false;
        return true;
    })
        .join('\n');
};
exports.sanitizeMermaidCode = sanitizeMermaidCode;
/**
 * Prepares mermaid code for rendering by sanitizing common syntax issues.
 * @param {string} mermaidCode - The mermaid code to prepare
 * @param {'classic' | 'handDrawn'} style - The rendering style
 * @returns {string} - The prepared mermaid code
 */
const prepareMermaidCode = (mermaidCode, style) => {
    if (!mermaidCode || typeof mermaidCode !== 'string')
        return '';
    let code = (0, exports.sanitizeMermaidCode)(mermaidCode.trim());
    // Convenience: Basic BR replacement. This is a common and safe operation.
    code = code.replace(/<br\s*\/?>/g, '\n');
    let finalCode = code;
    // Hand-drawn style requires some specific clean-up.
    if (style === 'handDrawn') {
        finalCode = finalCode
            .replace(/style\s+[^\n]+/g, '')
            .replace(/linkStyle\s+[^\n]+/g, '')
            .replace(/^flowchart/, 'graph')
            .replace(/class="[^"]*"/g, '')
            .replace(/fill="[^"]*"/g, '')
            .replace(/stroke="[^"]*"/g, '');
        // Ensure hand-drawn style charts always start with graph
        if (!finalCode.startsWith('graph') && !finalCode.startsWith('flowchart'))
            finalCode = `graph TD\n${finalCode}`;
    }
    return finalCode;
};
exports.prepareMermaidCode = prepareMermaidCode;
/**
 * Converts SVG to base64 string for image rendering
 */
function svgToBase64(svgGraph) {
    if (!svgGraph)
        return Promise.resolve('');
    try {
        // Ensure SVG has correct XML declaration
        if (!svgGraph.includes('<?xml'))
            svgGraph = `<?xml version="1.0" encoding="UTF-8"?>${svgGraph}`;
        const blob = new Blob([new TextEncoder().encode(svgGraph)], { type: 'image/svg+xml;charset=utf-8' });
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    catch {
        return Promise.resolve('');
    }
}
/**
 * Processes SVG for theme styling
 */
function processSvgForTheme(svg, isDark, isHandDrawn, themes) {
    let processedSvg = svg;
    if (isDark) {
        processedSvg = processedSvg
            .replace(/style="fill: ?#000000"/g, 'style="fill: #e2e8f0"')
            .replace(/style="stroke: ?#000000"/g, 'style="stroke: #94a3b8"')
            .replace(/<rect [^>]*fill="#ffffff"/g, '<rect $& fill="#1e293b"');
        if (isHandDrawn) {
            processedSvg = processedSvg
                .replace(/fill="#[a-fA-F0-9]{6}"/g, `fill="${themes.dark.nodeColors[0].bg}"`)
                .replace(/stroke="#[a-fA-F0-9]{6}"/g, `stroke="${themes.dark.connectionColor}"`)
                .replace(/stroke-width="1"/g, 'stroke-width="1.5"');
        }
        else {
            let i = 0;
            const nodeColorRegex = /fill="#[a-fA-F0-9]{6}"[^>]*class="node-[^"]*"/g;
            processedSvg = processedSvg.replace(nodeColorRegex, (match) => {
                const colorIndex = i % themes.dark.nodeColors.length;
                i++;
                return match.replace(/fill="#[a-fA-F0-9]{6}"/, `fill="${themes.dark.nodeColors[colorIndex].bg}"`);
            });
            processedSvg = processedSvg
                .replace(/<path [^>]*stroke="#[a-fA-F0-9]{6}"/g, `<path stroke="${themes.dark.connectionColor}" stroke-width="1.5"`)
                .replace(/<(line|polyline) [^>]*stroke="#[a-fA-F0-9]{6}"/g, `<$1 stroke="${themes.dark.connectionColor}" stroke-width="1.5"`);
        }
    }
    else {
        if (isHandDrawn) {
            processedSvg = processedSvg
                .replace(/fill="#[a-fA-F0-9]{6}"/g, `fill="${themes.light.nodeColors[0].bg}"`)
                .replace(/stroke="#[a-fA-F0-9]{6}"/g, `stroke="${themes.light.connectionColor}"`)
                .replace(/stroke-width="1"/g, 'stroke-width="1.5"');
        }
        else {
            let i = 0;
            const nodeColorRegex = /fill="#[a-fA-F0-9]{6}"[^>]*class="node-[^"]*"/g;
            processedSvg = processedSvg.replace(nodeColorRegex, (match) => {
                const colorIndex = i % themes.light.nodeColors.length;
                i++;
                return match.replace(/fill="#[a-fA-F0-9]{6}"/, `fill="${themes.light.nodeColors[colorIndex].bg}"`);
            });
            processedSvg = processedSvg
                .replace(/<path [^>]*stroke="#[a-fA-F0-9]{6}"/g, `<path stroke="${themes.light.connectionColor}"`)
                .replace(/<(line|polyline) [^>]*stroke="#[a-fA-F0-9]{6}"/g, `<$1 stroke="${themes.light.connectionColor}"`);
        }
    }
    return processedSvg;
}
/**
 * Checks if mermaid code is complete and valid
 */
function isMermaidCodeComplete(code) {
    if (!code || code.trim().length === 0)
        return false;
    try {
        const trimmedCode = code.trim();
        // Special handling for gantt charts
        if (trimmedCode.startsWith('gantt')) {
            // For gantt charts, check if it has at least a title and one task
            const lines = trimmedCode.split('\n').filter(line => line.trim().length > 0);
            return lines.length >= 3;
        }
        // Special handling for mindmaps
        if (trimmedCode.startsWith('mindmap')) {
            // For mindmaps, check if it has at least a root node
            const lines = trimmedCode.split('\n').filter(line => line.trim().length > 0);
            return lines.length >= 2;
        }
        // Check for basic syntax structure
        const hasValidStart = /^(graph|flowchart|sequenceDiagram|classDiagram|classDef|class|stateDiagram|gantt|pie|er|journey|requirementDiagram|mindmap)/.test(trimmedCode);
        // The balanced bracket check was too strict and produced false negatives for valid
        // mermaid syntax like the asymmetric shape `A>B]`. Relying on Mermaid's own
        // parser is more robust.
        const isBalanced = true;
        // Check for common syntax errors
        const hasNoSyntaxErrors = !trimmedCode.includes('undefined')
            && !trimmedCode.includes('[object Object]')
            && trimmedCode.split('\n').every(line => !(line.includes('-->') && !line.match(/\S+\s*-->\s*\S+/)));
        return hasValidStart && isBalanced && hasNoSyntaxErrors;
    }
    catch (error) {
        console.error('Mermaid code validation error:', error);
        return false;
    }
}
/**
 * Helper to wait for DOM element with retry mechanism
 */
function waitForDOMElement(callback, maxAttempts = 3, delay = 100) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const tryRender = async () => {
            try {
                resolve(await callback());
            }
            catch (error) {
                attempts++;
                if (attempts < maxAttempts)
                    setTimeout(tryRender, delay);
                else
                    reject(error);
            }
        };
        tryRender();
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FFQztBQThERCxrQ0FvQkM7QUFLRCxnREE0REM7QUFLRCxzREF5Q0M7QUFLRCw4Q0FpQkM7QUF6TkQsU0FBZ0IsY0FBYyxDQUFDLE9BQWU7SUFDNUMsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUM1QyxDQUFDO0FBRU0sTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFdBQW1CLEVBQVUsRUFBRTtJQUNqRSxJQUFJLENBQUMsV0FBVyxJQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVE7UUFDakQsT0FBTyxFQUFFLENBQUE7SUFFWCxPQUFPLFdBQVc7U0FDZixLQUFLLENBQUMsSUFBSSxDQUFDO1NBQ1gsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDZixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7UUFFaEMsOEVBQThFO1FBQzlFLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDM0IsT0FBTyxLQUFLLENBQUE7UUFFZCw4RUFBOEU7UUFDOUUsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUM5QixPQUFPLEtBQUssQ0FBQTtRQUVkLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2YsQ0FBQyxDQUFBO0FBcEJZLFFBQUEsbUJBQW1CLHVCQW9CL0I7QUFFRDs7Ozs7R0FLRztBQUNJLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxXQUFtQixFQUFFLEtBQThCLEVBQVUsRUFBRTtJQUNoRyxJQUFJLENBQUMsV0FBVyxJQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVE7UUFDakQsT0FBTyxFQUFFLENBQUE7SUFFWCxJQUFJLElBQUksR0FBRyxJQUFBLDJCQUFt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QUM7SUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN0RCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxRQUE0QixFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEdBQUc7SUFDMUYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUE7UUFDaEIsTUFBTSxTQUFTLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDM0IsSUFBSSxDQUFDO2dCQUNILE9BQU8sQ0FBQyxNQUFNLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDM0IsQ0FBQztZQUNELE9BQU8sS0FBSyxFQUFFLENBQUM7Z0JBQ2IsUUFBUSxFQUFFLENBQUE7Z0JBQ1YsSUFBSSxRQUFRLEdBQUcsV0FBVztvQkFDeEIsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTs7b0JBRTVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNqQixDQUFDO1FBQ0gsQ0FBQyxDQUFBO1FBQ0QsU0FBUyxFQUFFLENBQUE7SUFDYixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY2xlYW5VcFN2Z0NvZGUoc3ZnQ29kZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN2Z0NvZGUucmVwbGFjZUFsbCgnPGJyPicsICc8YnIvPicpXG59XG5cbmV4cG9ydCBjb25zdCBzYW5pdGl6ZU1lcm1haWRDb2RlID0gKG1lcm1haWRDb2RlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICBpZiAoIW1lcm1haWRDb2RlIHx8IHR5cGVvZiBtZXJtYWlkQ29kZSAhPT0gJ3N0cmluZycpXG4gICAgcmV0dXJuICcnXG5cbiAgcmV0dXJuIG1lcm1haWRDb2RlXG4gICAgLnNwbGl0KCdcXG4nKVxuICAgIC5maWx0ZXIoKGxpbmUpID0+IHtcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSBsaW5lLnRyaW1TdGFydCgpXG5cbiAgICAgIC8vIE1lcm1haWQgZGlyZWN0aXZlcyBjYW4gb3ZlcnJpZGUgY29uZmlnOyB0cmVhdCBhcyB1bnRydXN0ZWQgaW4gY2hhdCBjb250ZXh0LlxuICAgICAgaWYgKHRyaW1tZWQuc3RhcnRzV2l0aCgnJSV7JykpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAvLyBNZXJtYWlkIGNsaWNrIGRpcmVjdGl2ZXMgY2FuIGNyZWF0ZSBKUyBjYWxsYmFja3MvbGlua3MgaW5zaWRlIHJlbmRlcmVkIFNWRy5cbiAgICAgIGlmICh0cmltbWVkLnN0YXJ0c1dpdGgoJ2NsaWNrICcpKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuICAgIC5qb2luKCdcXG4nKVxufVxuXG4vKipcbiAqIFByZXBhcmVzIG1lcm1haWQgY29kZSBmb3IgcmVuZGVyaW5nIGJ5IHNhbml0aXppbmcgY29tbW9uIHN5bnRheCBpc3N1ZXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVybWFpZENvZGUgLSBUaGUgbWVybWFpZCBjb2RlIHRvIHByZXBhcmVcbiAqIEBwYXJhbSB7J2NsYXNzaWMnIHwgJ2hhbmREcmF3bid9IHN0eWxlIC0gVGhlIHJlbmRlcmluZyBzdHlsZVxuICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgcHJlcGFyZWQgbWVybWFpZCBjb2RlXG4gKi9cbmV4cG9ydCBjb25zdCBwcmVwYXJlTWVybWFpZENvZGUgPSAobWVybWFpZENvZGU6IHN0cmluZywgc3R5bGU6ICdjbGFzc2ljJyB8ICdoYW5kRHJhd24nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFtZXJtYWlkQ29kZSB8fCB0eXBlb2YgbWVybWFpZENvZGUgIT09ICdzdHJpbmcnKVxuICAgIHJldHVybiAnJ1xuXG4gIGxldCBjb2RlID0gc2FuaXRpemVNZXJtYWlkQ29kZShtZXJtYWlkQ29kZS50cmltKCkpXG5cbiAgLy8gQ29udmVuaWVuY2U6IEJhc2ljIEJSIHJlcGxhY2VtZW50LiBUaGlzIGlzIGEgY29tbW9uIGFuZCBzYWZlIG9wZXJhdGlvbi5cbiAgY29kZSA9IGNvZGUucmVwbGFjZSgvPGJyXFxzKlxcLz8+L2csICdcXG4nKVxuXG4gIGxldCBmaW5hbENvZGUgPSBjb2RlXG5cbiAgLy8gSGFuZC1kcmF3biBzdHlsZSByZXF1aXJlcyBzb21lIHNwZWNpZmljIGNsZWFuLXVwLlxuICBpZiAoc3R5bGUgPT09ICdoYW5kRHJhd24nKSB7XG4gICAgZmluYWxDb2RlID0gZmluYWxDb2RlXG4gICAgICAucmVwbGFjZSgvc3R5bGVcXHMrW15cXG5dKy9nLCAnJylcbiAgICAgIC5yZXBsYWNlKC9saW5rU3R5bGVcXHMrW15cXG5dKy9nLCAnJylcbiAgICAgIC5yZXBsYWNlKC9eZmxvd2NoYXJ0LywgJ2dyYXBoJylcbiAgICAgIC5yZXBsYWNlKC9jbGFzcz1cIlteXCJdKlwiL2csICcnKVxuICAgICAgLnJlcGxhY2UoL2ZpbGw9XCJbXlwiXSpcIi9nLCAnJylcbiAgICAgIC5yZXBsYWNlKC9zdHJva2U9XCJbXlwiXSpcIi9nLCAnJylcblxuICAgIC8vIEVuc3VyZSBoYW5kLWRyYXduIHN0eWxlIGNoYXJ0cyBhbHdheXMgc3RhcnQgd2l0aCBncmFwaFxuICAgIGlmICghZmluYWxDb2RlLnN0YXJ0c1dpdGgoJ2dyYXBoJykgJiYgIWZpbmFsQ29kZS5zdGFydHNXaXRoKCdmbG93Y2hhcnQnKSlcbiAgICAgIGZpbmFsQ29kZSA9IGBncmFwaCBURFxcbiR7ZmluYWxDb2RlfWBcbiAgfVxuXG4gIHJldHVybiBmaW5hbENvZGVcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBTVkcgdG8gYmFzZTY0IHN0cmluZyBmb3IgaW1hZ2UgcmVuZGVyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdmdUb0Jhc2U2NChzdmdHcmFwaDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgaWYgKCFzdmdHcmFwaClcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCcnKVxuXG4gIHRyeSB7XG4gICAgLy8gRW5zdXJlIFNWRyBoYXMgY29ycmVjdCBYTUwgZGVjbGFyYXRpb25cbiAgICBpZiAoIXN2Z0dyYXBoLmluY2x1ZGVzKCc8P3htbCcpKVxuICAgICAgc3ZnR3JhcGggPSBgPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIj8+JHtzdmdHcmFwaH1gXG5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW25ldyBUZXh0RW5jb2RlcigpLmVuY29kZShzdmdHcmFwaCldLCB7IHR5cGU6ICdpbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgnIH0pXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiByZXNvbHZlKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKVxuICAgICAgcmVhZGVyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpXG4gICAgfSlcbiAgfVxuICBjYXRjaCB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgnJylcbiAgfVxufVxuXG4vKipcbiAqIFByb2Nlc3NlcyBTVkcgZm9yIHRoZW1lIHN0eWxpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NTdmdGb3JUaGVtZShcbiAgc3ZnOiBzdHJpbmcsXG4gIGlzRGFyazogYm9vbGVhbixcbiAgaXNIYW5kRHJhd246IGJvb2xlYW4sXG4gIHRoZW1lczoge1xuICAgIGxpZ2h0OiBhbnlcbiAgICBkYXJrOiBhbnlcbiAgfSxcbik6IHN0cmluZyB7XG4gIGxldCBwcm9jZXNzZWRTdmcgPSBzdmdcblxuICBpZiAoaXNEYXJrKSB7XG4gICAgcHJvY2Vzc2VkU3ZnID0gcHJvY2Vzc2VkU3ZnXG4gICAgICAucmVwbGFjZSgvc3R5bGU9XCJmaWxsOiA/IzAwMDAwMFwiL2csICdzdHlsZT1cImZpbGw6ICNlMmU4ZjBcIicpXG4gICAgICAucmVwbGFjZSgvc3R5bGU9XCJzdHJva2U6ID8jMDAwMDAwXCIvZywgJ3N0eWxlPVwic3Ryb2tlOiAjOTRhM2I4XCInKVxuICAgICAgLnJlcGxhY2UoLzxyZWN0IFtePl0qZmlsbD1cIiNmZmZmZmZcIi9nLCAnPHJlY3QgJCYgZmlsbD1cIiMxZTI5M2JcIicpXG5cbiAgICBpZiAoaXNIYW5kRHJhd24pIHtcbiAgICAgIHByb2Nlc3NlZFN2ZyA9IHByb2Nlc3NlZFN2Z1xuICAgICAgICAucmVwbGFjZSgvZmlsbD1cIiNbYS1mQS1GMC05XXs2fVwiL2csIGBmaWxsPVwiJHt0aGVtZXMuZGFyay5ub2RlQ29sb3JzWzBdLmJnfVwiYClcbiAgICAgICAgLnJlcGxhY2UoL3N0cm9rZT1cIiNbYS1mQS1GMC05XXs2fVwiL2csIGBzdHJva2U9XCIke3RoZW1lcy5kYXJrLmNvbm5lY3Rpb25Db2xvcn1cImApXG4gICAgICAgIC5yZXBsYWNlKC9zdHJva2Utd2lkdGg9XCIxXCIvZywgJ3N0cm9rZS13aWR0aD1cIjEuNVwiJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgaSA9IDBcbiAgICAgIGNvbnN0IG5vZGVDb2xvclJlZ2V4ID0gL2ZpbGw9XCIjW2EtZkEtRjAtOV17Nn1cIltePl0qY2xhc3M9XCJub2RlLVteXCJdKlwiL2dcbiAgICAgIHByb2Nlc3NlZFN2ZyA9IHByb2Nlc3NlZFN2Zy5yZXBsYWNlKG5vZGVDb2xvclJlZ2V4LCAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBjb2xvckluZGV4ID0gaSAlIHRoZW1lcy5kYXJrLm5vZGVDb2xvcnMubGVuZ3RoXG4gICAgICAgIGkrK1xuICAgICAgICByZXR1cm4gbWF0Y2gucmVwbGFjZSgvZmlsbD1cIiNbYS1mQS1GMC05XXs2fVwiLywgYGZpbGw9XCIke3RoZW1lcy5kYXJrLm5vZGVDb2xvcnNbY29sb3JJbmRleF0uYmd9XCJgKVxuICAgICAgfSlcblxuICAgICAgcHJvY2Vzc2VkU3ZnID0gcHJvY2Vzc2VkU3ZnXG4gICAgICAgIC5yZXBsYWNlKC88cGF0aCBbXj5dKnN0cm9rZT1cIiNbYS1mQS1GMC05XXs2fVwiL2csIGA8cGF0aCBzdHJva2U9XCIke3RoZW1lcy5kYXJrLmNvbm5lY3Rpb25Db2xvcn1cIiBzdHJva2Utd2lkdGg9XCIxLjVcImApXG4gICAgICAgIC5yZXBsYWNlKC88KGxpbmV8cG9seWxpbmUpIFtePl0qc3Ryb2tlPVwiI1thLWZBLUYwLTldezZ9XCIvZywgYDwkMSBzdHJva2U9XCIke3RoZW1lcy5kYXJrLmNvbm5lY3Rpb25Db2xvcn1cIiBzdHJva2Utd2lkdGg9XCIxLjVcImApXG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGlmIChpc0hhbmREcmF3bikge1xuICAgICAgcHJvY2Vzc2VkU3ZnID0gcHJvY2Vzc2VkU3ZnXG4gICAgICAgIC5yZXBsYWNlKC9maWxsPVwiI1thLWZBLUYwLTldezZ9XCIvZywgYGZpbGw9XCIke3RoZW1lcy5saWdodC5ub2RlQ29sb3JzWzBdLmJnfVwiYClcbiAgICAgICAgLnJlcGxhY2UoL3N0cm9rZT1cIiNbYS1mQS1GMC05XXs2fVwiL2csIGBzdHJva2U9XCIke3RoZW1lcy5saWdodC5jb25uZWN0aW9uQ29sb3J9XCJgKVxuICAgICAgICAucmVwbGFjZSgvc3Ryb2tlLXdpZHRoPVwiMVwiL2csICdzdHJva2Utd2lkdGg9XCIxLjVcIicpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IGkgPSAwXG4gICAgICBjb25zdCBub2RlQ29sb3JSZWdleCA9IC9maWxsPVwiI1thLWZBLUYwLTldezZ9XCJbXj5dKmNsYXNzPVwibm9kZS1bXlwiXSpcIi9nXG4gICAgICBwcm9jZXNzZWRTdmcgPSBwcm9jZXNzZWRTdmcucmVwbGFjZShub2RlQ29sb3JSZWdleCwgKG1hdGNoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgY29sb3JJbmRleCA9IGkgJSB0aGVtZXMubGlnaHQubm9kZUNvbG9ycy5sZW5ndGhcbiAgICAgICAgaSsrXG4gICAgICAgIHJldHVybiBtYXRjaC5yZXBsYWNlKC9maWxsPVwiI1thLWZBLUYwLTldezZ9XCIvLCBgZmlsbD1cIiR7dGhlbWVzLmxpZ2h0Lm5vZGVDb2xvcnNbY29sb3JJbmRleF0uYmd9XCJgKVxuICAgICAgfSlcblxuICAgICAgcHJvY2Vzc2VkU3ZnID0gcHJvY2Vzc2VkU3ZnXG4gICAgICAgIC5yZXBsYWNlKC88cGF0aCBbXj5dKnN0cm9rZT1cIiNbYS1mQS1GMC05XXs2fVwiL2csIGA8cGF0aCBzdHJva2U9XCIke3RoZW1lcy5saWdodC5jb25uZWN0aW9uQ29sb3J9XCJgKVxuICAgICAgICAucmVwbGFjZSgvPChsaW5lfHBvbHlsaW5lKSBbXj5dKnN0cm9rZT1cIiNbYS1mQS1GMC05XXs2fVwiL2csIGA8JDEgc3Ryb2tlPVwiJHt0aGVtZXMubGlnaHQuY29ubmVjdGlvbkNvbG9yfVwiYClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcHJvY2Vzc2VkU3ZnXG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIG1lcm1haWQgY29kZSBpcyBjb21wbGV0ZSBhbmQgdmFsaWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTWVybWFpZENvZGVDb21wbGV0ZShjb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFjb2RlIHx8IGNvZGUudHJpbSgpLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gZmFsc2VcblxuICB0cnkge1xuICAgIGNvbnN0IHRyaW1tZWRDb2RlID0gY29kZS50cmltKClcblxuICAgIC8vIFNwZWNpYWwgaGFuZGxpbmcgZm9yIGdhbnR0IGNoYXJ0c1xuICAgIGlmICh0cmltbWVkQ29kZS5zdGFydHNXaXRoKCdnYW50dCcpKSB7XG4gICAgICAvLyBGb3IgZ2FudHQgY2hhcnRzLCBjaGVjayBpZiBpdCBoYXMgYXQgbGVhc3QgYSB0aXRsZSBhbmQgb25lIHRhc2tcbiAgICAgIGNvbnN0IGxpbmVzID0gdHJpbW1lZENvZGUuc3BsaXQoJ1xcbicpLmZpbHRlcihsaW5lID0+IGxpbmUudHJpbSgpLmxlbmd0aCA+IDApXG4gICAgICByZXR1cm4gbGluZXMubGVuZ3RoID49IDNcbiAgICB9XG5cbiAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciBtaW5kbWFwc1xuICAgIGlmICh0cmltbWVkQ29kZS5zdGFydHNXaXRoKCdtaW5kbWFwJykpIHtcbiAgICAgIC8vIEZvciBtaW5kbWFwcywgY2hlY2sgaWYgaXQgaGFzIGF0IGxlYXN0IGEgcm9vdCBub2RlXG4gICAgICBjb25zdCBsaW5lcyA9IHRyaW1tZWRDb2RlLnNwbGl0KCdcXG4nKS5maWx0ZXIobGluZSA9PiBsaW5lLnRyaW0oKS5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIGxpbmVzLmxlbmd0aCA+PSAyXG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGJhc2ljIHN5bnRheCBzdHJ1Y3R1cmVcbiAgICBjb25zdCBoYXNWYWxpZFN0YXJ0ID0gL14oZ3JhcGh8Zmxvd2NoYXJ0fHNlcXVlbmNlRGlhZ3JhbXxjbGFzc0RpYWdyYW18Y2xhc3NEZWZ8Y2xhc3N8c3RhdGVEaWFncmFtfGdhbnR0fHBpZXxlcnxqb3VybmV5fHJlcXVpcmVtZW50RGlhZ3JhbXxtaW5kbWFwKS8udGVzdCh0cmltbWVkQ29kZSlcblxuICAgIC8vIFRoZSBiYWxhbmNlZCBicmFja2V0IGNoZWNrIHdhcyB0b28gc3RyaWN0IGFuZCBwcm9kdWNlZCBmYWxzZSBuZWdhdGl2ZXMgZm9yIHZhbGlkXG4gICAgLy8gbWVybWFpZCBzeW50YXggbGlrZSB0aGUgYXN5bW1ldHJpYyBzaGFwZSBgQT5CXWAuIFJlbHlpbmcgb24gTWVybWFpZCdzIG93blxuICAgIC8vIHBhcnNlciBpcyBtb3JlIHJvYnVzdC5cbiAgICBjb25zdCBpc0JhbGFuY2VkID0gdHJ1ZVxuXG4gICAgLy8gQ2hlY2sgZm9yIGNvbW1vbiBzeW50YXggZXJyb3JzXG4gICAgY29uc3QgaGFzTm9TeW50YXhFcnJvcnMgPSAhdHJpbW1lZENvZGUuaW5jbHVkZXMoJ3VuZGVmaW5lZCcpXG4gICAgICAmJiAhdHJpbW1lZENvZGUuaW5jbHVkZXMoJ1tvYmplY3QgT2JqZWN0XScpXG4gICAgICAmJiB0cmltbWVkQ29kZS5zcGxpdCgnXFxuJykuZXZlcnkobGluZSA9PlxuICAgICAgICAhKGxpbmUuaW5jbHVkZXMoJy0tPicpICYmICFsaW5lLm1hdGNoKC9cXFMrXFxzKi0tPlxccypcXFMrLykpKVxuXG4gICAgcmV0dXJuIGhhc1ZhbGlkU3RhcnQgJiYgaXNCYWxhbmNlZCAmJiBoYXNOb1N5bnRheEVycm9yc1xuICB9XG4gIGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ01lcm1haWQgY29kZSB2YWxpZGF0aW9uIGVycm9yOicsIGVycm9yKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbi8qKlxuICogSGVscGVyIHRvIHdhaXQgZm9yIERPTSBlbGVtZW50IHdpdGggcmV0cnkgbWVjaGFuaXNtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yRE9NRWxlbWVudChjYWxsYmFjazogKCkgPT4gUHJvbWlzZTxhbnk+LCBtYXhBdHRlbXB0cyA9IDMsIGRlbGF5ID0gMTAwKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgYXR0ZW1wdHMgPSAwXG4gICAgY29uc3QgdHJ5UmVuZGVyID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShhd2FpdCBjYWxsYmFjaygpKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGF0dGVtcHRzKytcbiAgICAgICAgaWYgKGF0dGVtcHRzIDwgbWF4QXR0ZW1wdHMpXG4gICAgICAgICAgc2V0VGltZW91dCh0cnlSZW5kZXIsIGRlbGF5KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfVxuICAgIH1cbiAgICB0cnlSZW5kZXIoKVxuICB9KVxufVxuIl19