"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const _1 = require(".");
const SAMPLE_SVG = `
<svg width="400" height="280" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D1E9FF"/>
      <stop offset="100%" stop-color="#FBE8FF"/>
    </linearGradient>
  </defs>
  <rect width="400" height="280" rx="24" fill="url(#bg)"/>
  <g font-family="sans-serif" fill="#1F2937" text-anchor="middle">
    <text x="200" y="120" font-size="32" font-weight="600">SVG Preview</text>
    <text x="200" y="160" font-size="16">Click to open high-resolution preview</text>
  </g>
  <circle cx="320" cy="70" r="28" fill="#E0F2FE" stroke="#2563EB" stroke-width="4"/>
  <circle cx="80" cy="200" r="18" fill="#FDE68A" stroke="#CA8A04" stroke-width="4"/>
  <rect x="120" y="190" width="160" height="48" rx="12" fill="#FFF" opacity="0.85"/>
  <text x="200" y="220" font-size="16" font-weight="500">Inline SVG asset</text>
</svg>
`.trim();
const meta = {
    title: 'Base/Data Display/SVGRenderer',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Renders sanitized SVG markup with zoom-to-preview capability.',
            },
            source: {
                language: 'tsx',
                code: `
<SVGRenderer content={\`
  <svg width="400" height="280" ...>...</svg>
\`} />
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
    args: {
        content: SAMPLE_SVG,
    },
};
exports.default = meta;
exports.Default = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUEyQjtBQUUzQixNQUFNLFVBQVUsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBa0JsQixDQUFDLElBQUksRUFBRSxDQUFBO0FBRVIsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsK0JBQStCO0lBQ3RDLFNBQVMsRUFBRSxVQUFXO0lBQ3RCLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsK0RBQStEO2FBQzNFO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7OztTQUlMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxVQUFVO0tBQ3BCO0NBQ2lDLENBQUE7QUFFcEMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxPQUFPLEdBQVUsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IFNWR1JlbmRlcmVyIGZyb20gJy4nXG5cbmNvbnN0IFNBTVBMRV9TVkcgPSBgXG48c3ZnIHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiMjgwXCIgdmlld0JveD1cIjAgMCA0MDAgMjgwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICA8ZGVmcz5cbiAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCJiZ1wiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIxMDAlXCI+XG4gICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjRDFFOUZGXCIvPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjRkJFOEZGXCIvPlxuICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gIDwvZGVmcz5cbiAgPHJlY3Qgd2lkdGg9XCI0MDBcIiBoZWlnaHQ9XCIyODBcIiByeD1cIjI0XCIgZmlsbD1cInVybCgjYmcpXCIvPlxuICA8ZyBmb250LWZhbWlseT1cInNhbnMtc2VyaWZcIiBmaWxsPVwiIzFGMjkzN1wiIHRleHQtYW5jaG9yPVwibWlkZGxlXCI+XG4gICAgPHRleHQgeD1cIjIwMFwiIHk9XCIxMjBcIiBmb250LXNpemU9XCIzMlwiIGZvbnQtd2VpZ2h0PVwiNjAwXCI+U1ZHIFByZXZpZXc8L3RleHQ+XG4gICAgPHRleHQgeD1cIjIwMFwiIHk9XCIxNjBcIiBmb250LXNpemU9XCIxNlwiPkNsaWNrIHRvIG9wZW4gaGlnaC1yZXNvbHV0aW9uIHByZXZpZXc8L3RleHQ+XG4gIDwvZz5cbiAgPGNpcmNsZSBjeD1cIjMyMFwiIGN5PVwiNzBcIiByPVwiMjhcIiBmaWxsPVwiI0UwRjJGRVwiIHN0cm9rZT1cIiMyNTYzRUJcIiBzdHJva2Utd2lkdGg9XCI0XCIvPlxuICA8Y2lyY2xlIGN4PVwiODBcIiBjeT1cIjIwMFwiIHI9XCIxOFwiIGZpbGw9XCIjRkRFNjhBXCIgc3Ryb2tlPVwiI0NBOEEwNFwiIHN0cm9rZS13aWR0aD1cIjRcIi8+XG4gIDxyZWN0IHg9XCIxMjBcIiB5PVwiMTkwXCIgd2lkdGg9XCIxNjBcIiBoZWlnaHQ9XCI0OFwiIHJ4PVwiMTJcIiBmaWxsPVwiI0ZGRlwiIG9wYWNpdHk9XCIwLjg1XCIvPlxuICA8dGV4dCB4PVwiMjAwXCIgeT1cIjIyMFwiIGZvbnQtc2l6ZT1cIjE2XCIgZm9udC13ZWlnaHQ9XCI1MDBcIj5JbmxpbmUgU1ZHIGFzc2V0PC90ZXh0PlxuPC9zdmc+XG5gLnRyaW0oKVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRGF0YSBEaXNwbGF5L1NWR1JlbmRlcmVyJyxcbiAgY29tcG9uZW50OiBTVkdSZW5kZXJlcixcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1JlbmRlcnMgc2FuaXRpemVkIFNWRyBtYXJrdXAgd2l0aCB6b29tLXRvLXByZXZpZXcgY2FwYWJpbGl0eS4nLFxuICAgICAgfSxcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbjxTVkdSZW5kZXJlciBjb250ZW50PXtcXGBcbiAgPHN2ZyB3aWR0aD1cIjQwMFwiIGhlaWdodD1cIjI4MFwiIC4uLj4uLi48L3N2Zz5cblxcYH0gLz5cbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnczoge1xuICAgIGNvbnRlbnQ6IFNBTVBMRV9TVkcsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBTVkdSZW5kZXJlcj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7fVxuIl19