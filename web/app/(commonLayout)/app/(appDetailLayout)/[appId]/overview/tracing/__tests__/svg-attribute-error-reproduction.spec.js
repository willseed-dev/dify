"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const tracing_1 = require("@/app/components/base/icons/src/public/tracing");
const OpikIconBig_json_1 = require("@/app/components/base/icons/src/public/tracing/OpikIconBig.json");
const utils_1 = require("@/app/components/base/icons/utils");
describe('SVG Attribute Error Reproduction', () => {
    // Capture console errors
    const originalError = console.error;
    let errorMessages = [];
    beforeEach(() => {
        errorMessages = [];
        console.error = vi.fn((message) => {
            errorMessages.push(message);
            originalError(message);
        });
    });
    afterEach(() => {
        console.error = originalError;
    });
    it('should reproduce inkscape attribute errors when rendering OpikIconBig', () => {
        console.log('\n=== TESTING OpikIconBig SVG ATTRIBUTE ERRORS ===');
        // Test multiple renders to check for inconsistency
        for (let i = 0; i < 5; i++) {
            console.log(`\nRender attempt ${i + 1}:`);
            const { unmount } = (0, react_1.render)(<tracing_1.OpikIconBig />);
            // Check for specific inkscape attribute errors
            const inkscapeErrors = errorMessages.filter(msg => typeof msg === 'string' && msg.includes('inkscape'));
            if (inkscapeErrors.length > 0) {
                console.log(`Found ${inkscapeErrors.length} inkscape errors:`);
                inkscapeErrors.forEach((error, index) => {
                    console.log(`  ${index + 1}. ${error.substring(0, 100)}...`);
                });
            }
            else {
                console.log('No inkscape errors found in this render');
            }
            unmount();
            // Clear errors for next iteration
            errorMessages = [];
        }
    });
    it('should analyze the SVG structure causing the errors', () => {
        console.log('\n=== ANALYZING SVG STRUCTURE ===');
        console.log('Icon structure analysis:');
        console.log('- Root element:', OpikIconBig_json_1.default.icon.name);
        console.log('- Children count:', OpikIconBig_json_1.default.icon.children?.length || 0);
        // Find problematic elements
        const findProblematicElements = (node, path = '') => {
            const problematicElements = [];
            if (node.name && (node.name.includes(':') || node.name.startsWith('sodipodi'))) {
                problematicElements.push({
                    path,
                    name: node.name,
                    attributes: Object.keys(node.attributes || {}),
                });
            }
            // Check attributes for inkscape/sodipodi properties
            if (node.attributes) {
                const problematicAttrs = Object.keys(node.attributes).filter(attr => attr.startsWith('inkscape:') || attr.startsWith('sodipodi:'));
                if (problematicAttrs.length > 0) {
                    problematicElements.push({
                        path,
                        name: node.name,
                        problematicAttributes: problematicAttrs,
                    });
                }
            }
            if (node.children) {
                node.children.forEach((child, index) => {
                    problematicElements.push(...findProblematicElements(child, `${path}/${node.name}[${index}]`));
                });
            }
            return problematicElements;
        };
        const problematicElements = findProblematicElements(OpikIconBig_json_1.default.icon, 'root');
        console.log(`\n🚨 Found ${problematicElements.length} problematic elements:`);
        problematicElements.forEach((element, index) => {
            console.log(`\n${index + 1}. Element: ${element.name}`);
            console.log(`   Path: ${element.path}`);
            if (element.problematicAttributes)
                console.log(`   Problematic attributes: ${element.problematicAttributes.join(', ')}`);
        });
    });
    it('should test the normalizeAttrs function behavior', () => {
        console.log('\n=== TESTING normalizeAttrs FUNCTION ===');
        const testAttributes = {
            'inkscape:showpageshadow': '2',
            'inkscape:pageopacity': '0.0',
            'inkscape:pagecheckerboard': '0',
            'inkscape:deskcolor': '#d1d1d1',
            'sodipodi:docname': 'opik-icon-big.svg',
            'xmlns:inkscape': 'https://www.inkscape.org/namespaces/inkscape',
            'xmlns:sodipodi': 'https://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
            'xmlns:svg': 'https://www.w3.org/2000/svg',
            'data-name': 'Layer 1',
            'normal-attr': 'value',
            'class': 'test-class',
        };
        console.log('Input attributes:', Object.keys(testAttributes));
        const normalized = (0, utils_1.normalizeAttrs)(testAttributes);
        console.log('Normalized attributes:', Object.keys(normalized));
        console.log('Normalized values:', normalized);
        // Check if problematic attributes are still present
        const problematicKeys = Object.keys(normalized).filter(key => key.toLowerCase().includes('inkscape') || key.toLowerCase().includes('sodipodi'));
        if (problematicKeys.length > 0)
            console.log(`🚨 PROBLEM: Still found problematic attributes: ${problematicKeys.join(', ')}`);
        else
            console.log('✅ No problematic attributes found after normalization');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLWF0dHJpYnV0ZS1lcnJvci1yZXByb2R1Y3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN2Zy1hdHRyaWJ1dGUtZXJyb3ItcmVwcm9kdWN0aW9uLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQStDO0FBQy9DLCtCQUE4QjtBQUM5Qiw0RUFBNEU7QUFDNUUsc0dBQXNGO0FBQ3RGLDZEQUFrRTtBQUVsRSxRQUFRLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO0lBQ2hELHlCQUF5QjtJQUN6QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFBO0lBQ25DLElBQUksYUFBYSxHQUFhLEVBQUUsQ0FBQTtJQUVoQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsYUFBYSxHQUFHLEVBQUUsQ0FBQTtRQUNsQixPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNoQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzNCLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNiLE9BQU8sQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFBO0lBQy9CLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtRQUMvRSxPQUFPLENBQUMsR0FBRyxDQUFDLG9EQUFvRCxDQUFDLENBQUE7UUFFakUsbURBQW1EO1FBQ25ELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUV6QyxNQUFN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ZXNDb250ZW50IjpbImltcG9ydCB7IHJlbmRlciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IE9waWtJY29uQmlnIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy9wdWJsaWMvdHJhY2luZydcbmltcG9ydCBpY29uRGF0YSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3B1YmxpYy90cmFjaW5nL09waWtJY29uQmlnLmpzb24nXG5pbXBvcnQgeyBub3JtYWxpemVBdHRycyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy91dGlscydcblxuZGVzY3JpYmUoJ1NWRyBBdHRyaWJ1dGUgRXJyb3IgUmVwcm9kdWN0aW9uJywgKCkgPT4ge1xuICAvLyBDYXB0dXJlIGNvbnNvbGUgZXJyb3JzXG4gIGNvbnN0IG9yaWdpbmFsRXJyb3IgPSBjb25zb2xlLmVycm9yXG4gIGxldCBlcnJvck1lc3NhZ2VzOiBzdHJpbmdbXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgZXJyb3JNZXNzYWdlcyA9IFtdXG4gICAgY29uc29sZS5lcnJvciA9IHZpLmZuKChtZXNzYWdlKSA9PiB7XG4gICAgICBlcnJvck1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICAgIG9yaWdpbmFsRXJyb3IobWVzc2FnZSlcbiAgICB9KVxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgY29uc29sZS5lcnJvciA9IG9yaWdpbmFsRXJyb3JcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlcHJvZHVjZSBpbmtzY2FwZSBhdHRyaWJ1dGUgZXJyb3JzIHdoZW4gcmVuZGVyaW5nIE9waWtJY29uQmlnJywgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdcXG49PT0gVEVTVElORyBPcGlrSWNvbkJpZyBTVkcgQVRUUklCVVRFIEVSUk9SUyA9PT0nKVxuXG4gICAgLy8gVGVzdCBtdWx0aXBsZSByZW5kZXJzIHRvIGNoZWNrIGZvciBpbmNvbnNpc3RlbmN5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgIGNvbnNvbGUubG9nKGBcXG5SZW5kZXIgYXR0ZW1wdCAke2kgKyAxfTpgKVxuXG4gICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8T3Bpa0ljb25CaWcgLz4pXG5cbiAgICAgIC8vIENoZWNrIGZvciBzcGVjaWZpYyBpbmtzY2FwZSBhdHRyaWJ1dGUgZXJyb3JzXG4gICAgICBjb25zdCBpbmtzY2FwZUVycm9ycyA9IGVycm9yTWVzc2FnZXMuZmlsdGVyKG1zZyA9PlxuICAgICAgICB0eXBlb2YgbXNnID09PSAnc3RyaW5nJyAmJiBtc2cuaW5jbHVkZXMoJ2lua3NjYXBlJyksXG4gICAgICApXG5cbiAgICAgIGlmIChpbmtzY2FwZUVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBGb3VuZCAke2lua3NjYXBlRXJyb3JzLmxlbmd0aH0gaW5rc2NhcGUgZXJyb3JzOmApXG4gICAgICAgIGlua3NjYXBlRXJyb3JzLmZvckVhY2goKGVycm9yLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAgICR7aW5kZXggKyAxfS4gJHtlcnJvci5zdWJzdHJpbmcoMCwgMTAwKX0uLi5gKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBpbmtzY2FwZSBlcnJvcnMgZm91bmQgaW4gdGhpcyByZW5kZXInKVxuICAgICAgfVxuXG4gICAgICB1bm1vdW50KClcblxuICAgICAgLy8gQ2xlYXIgZXJyb3JzIGZvciBuZXh0IGl0ZXJhdGlvblxuICAgICAgZXJyb3JNZXNzYWdlcyA9IFtdXG4gICAgfVxuICB9KVxuXG4gIGl0KCdzaG91bGQgYW5hbHl6ZSB0aGUgU1ZHIHN0cnVjdHVyZSBjYXVzaW5nIHRoZSBlcnJvcnMnLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1xcbj09PSBBTkFMWVpJTkcgU1ZHIFNUUlVDVFVSRSA9PT0nKVxuXG4gICAgY29uc29sZS5sb2coJ0ljb24gc3RydWN0dXJlIGFuYWx5c2lzOicpXG4gICAgY29uc29sZS5sb2coJy0gUm9vdCBlbGVtZW50OicsIGljb25EYXRhLmljb24ubmFtZSlcbiAgICBjb25zb2xlLmxvZygnLSBDaGlsZHJlbiBjb3VudDonLCBpY29uRGF0YS5pY29uLmNoaWxkcmVuPy5sZW5ndGggfHwgMClcblxuICAgIC8vIEZpbmQgcHJvYmxlbWF0aWMgZWxlbWVudHNcbiAgICBjb25zdCBmaW5kUHJvYmxlbWF0aWNFbGVtZW50cyA9IChub2RlOiBhbnksIHBhdGggPSAnJykgPT4ge1xuICAgICAgY29uc3QgcHJvYmxlbWF0aWNFbGVtZW50czogYW55W10gPSBbXVxuXG4gICAgICBpZiAobm9kZS5uYW1lICYmIChub2RlLm5hbWUuaW5jbHVkZXMoJzonKSB8fCBub2RlLm5hbWUuc3RhcnRzV2l0aCgnc29kaXBvZGknKSkpIHtcbiAgICAgICAgcHJvYmxlbWF0aWNFbGVtZW50cy5wdXNoKHtcbiAgICAgICAgICBwYXRoLFxuICAgICAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiBPYmplY3Qua2V5cyhub2RlLmF0dHJpYnV0ZXMgfHwge30pLFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBhdHRyaWJ1dGVzIGZvciBpbmtzY2FwZS9zb2RpcG9kaSBwcm9wZXJ0aWVzXG4gICAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIGNvbnN0IHByb2JsZW1hdGljQXR0cnMgPSBPYmplY3Qua2V5cyhub2RlLmF0dHJpYnV0ZXMpLmZpbHRlcihhdHRyID0+XG4gICAgICAgICAgYXR0ci5zdGFydHNXaXRoKCdpbmtzY2FwZTonKSB8fCBhdHRyLnN0YXJ0c1dpdGgoJ3NvZGlwb2RpOicpLFxuICAgICAgICApXG5cbiAgICAgICAgaWYgKHByb2JsZW1hdGljQXR0cnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHByb2JsZW1hdGljRWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICAgICAgcHJvYmxlbWF0aWNBdHRyaWJ1dGVzOiBwcm9ibGVtYXRpY0F0dHJzLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgcHJvYmxlbWF0aWNFbGVtZW50cy5wdXNoKFxuICAgICAgICAgICAgLi4uZmluZFByb2JsZW1hdGljRWxlbWVudHMoY2hpbGQsIGAke3BhdGh9LyR7bm9kZS5uYW1lfVske2luZGV4fV1gKSxcbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9ibGVtYXRpY0VsZW1lbnRzXG4gICAgfVxuXG4gICAgY29uc3QgcHJvYmxlbWF0aWNFbGVtZW50cyA9IGZpbmRQcm9ibGVtYXRpY0VsZW1lbnRzKGljb25EYXRhLmljb24sICdyb290JylcblxuICAgIGNvbnNvbGUubG9nKGBcXG7wn5qoIEZvdW5kICR7cHJvYmxlbWF0aWNFbGVtZW50cy5sZW5ndGh9IHByb2JsZW1hdGljIGVsZW1lbnRzOmApXG4gICAgcHJvYmxlbWF0aWNFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coYFxcbiR7aW5kZXggKyAxfS4gRWxlbWVudDogJHtlbGVtZW50Lm5hbWV9YClcbiAgICAgIGNvbnNvbGUubG9nKGAgICBQYXRoOiAke2VsZW1lbnQucGF0aH1gKVxuICAgICAgaWYgKGVsZW1lbnQucHJvYmxlbWF0aWNBdHRyaWJ1dGVzKVxuICAgICAgICBjb25zb2xlLmxvZyhgICAgUHJvYmxlbWF0aWMgYXR0cmlidXRlczogJHtlbGVtZW50LnByb2JsZW1hdGljQXR0cmlidXRlcy5qb2luKCcsICcpfWApXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHRlc3QgdGhlIG5vcm1hbGl6ZUF0dHJzIGZ1bmN0aW9uIGJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdcXG49PT0gVEVTVElORyBub3JtYWxpemVBdHRycyBGVU5DVElPTiA9PT0nKVxuXG4gICAgY29uc3QgdGVzdEF0dHJpYnV0ZXMgPSB7XG4gICAgICAnaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3cnOiAnMicsXG4gICAgICAnaW5rc2NhcGU6cGFnZW9wYWNpdHknOiAnMC4wJyxcbiAgICAgICdpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkJzogJzAnLFxuICAgICAgJ2lua3NjYXBlOmRlc2tjb2xvcic6ICcjZDFkMWQxJyxcbiAgICAgICdzb2RpcG9kaTpkb2NuYW1lJzogJ29waWstaWNvbi1iaWcuc3ZnJyxcbiAgICAgICd4bWxuczppbmtzY2FwZSc6ICdodHRwczovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZScsXG4gICAgICAneG1sbnM6c29kaXBvZGknOiAnaHR0cHM6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkJyxcbiAgICAgICd4bWxuczpzdmcnOiAnaHR0cHM6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyxcbiAgICAgICdkYXRhLW5hbWUnOiAnTGF5ZXIgMScsXG4gICAgICAnbm9ybWFsLWF0dHInOiAndmFsdWUnLFxuICAgICAgJ2NsYXNzJzogJ3Rlc3QtY2xhc3MnLFxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdJbnB1dCBhdHRyaWJ1dGVzOicsIE9iamVjdC5rZXlzKHRlc3RBdHRyaWJ1dGVzKSlcblxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBdHRycyh0ZXN0QXR0cmlidXRlcylcblxuICAgIGNvbnNvbGUubG9nKCdOb3JtYWxpemVkIGF0dHJpYnV0ZXM6JywgT2JqZWN0LmtleXMobm9ybWFsaXplZCkpXG4gICAgY29uc29sZS5sb2coJ05vcm1hbGl6ZWQgdmFsdWVzOicsIG5vcm1hbGl6ZWQpXG5cbiAgICAvLyBDaGVjayBpZiBwcm9ibGVtYXRpYyBhdHRyaWJ1dGVzIGFyZSBzdGlsbCBwcmVzZW50XG4gICAgY29uc3QgcHJvYmxlbWF0aWNLZXlzID0gT2JqZWN0LmtleXMobm9ybWFsaXplZCkuZmlsdGVyKGtleSA9PlxuICAgICAga2V5LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2lua3NjYXBlJykgfHwga2V5LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3NvZGlwb2RpJyksXG4gICAgKVxuXG4gICAgaWYgKHByb2JsZW1hdGljS2V5cy5sZW5ndGggPiAwKVxuICAgICAgY29uc29sZS5sb2coYPCfmqggUFJPQkxFTTogU3RpbGwgZm91bmQgcHJvYmxlbWF0aWMgYXR0cmlidXRlczogJHtwcm9ibGVtYXRpY0tleXMuam9pbignLCAnKX1gKVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCfinIUgTm8gcHJvYmxlbWF0aWMgYXR0cmlidXRlcyBmb3VuZCBhZnRlciBub3JtYWxpemF0aW9uJylcbiAgfSlcbn0pXG4iXX0=