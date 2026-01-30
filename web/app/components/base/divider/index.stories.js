"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vertical = exports.Horizontal = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/Layout/Divider',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Lightweight separator supporting horizontal and vertical orientations with gradient or solid backgrounds.',
            },
            source: {
                language: 'tsx',
                code: `
<Divider />
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Horizontal = {};
exports.Vertical = {
    render: args => (<div className="flex h-20 items-center gap-4 rounded-lg border border-divider-subtle bg-components-panel-bg p-4">
      <span className="text-sm text-text-secondary">Filters</span>
      <_1.default {...args} type="vertical"/>
      <span className="text-sm text-text-secondary">Tags</span>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<Divider type="vertical" />
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUF1QjtBQUV2QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSxxQkFBcUI7SUFDNUIsU0FBUyxFQUFFLFVBQU87SUFDbEIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSwyR0FBMkc7YUFDdkg7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOztTQUVMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ1ksQ0FBQTtBQUVoQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLFVBQVUsR0FBVSxFQUFFLENBQUE7QUFFdEIsUUFBQSxRQUFRLEdBQVU7SUFDN0IsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDZCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUdBQWlHLENBQzlHO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQzNEO01BQUEsQ0FBQyxVQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQztNQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUMxRDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOztTQUVMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBEaXZpZGVyIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9MYXlvdXQvRGl2aWRlcicsXG4gIGNvbXBvbmVudDogRGl2aWRlcixcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0xpZ2h0d2VpZ2h0IHNlcGFyYXRvciBzdXBwb3J0aW5nIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yaWVudGF0aW9ucyB3aXRoIGdyYWRpZW50IG9yIHNvbGlkIGJhY2tncm91bmRzLicsXG4gICAgICB9LFxuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPERpdmlkZXIgLz5cbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIERpdmlkZXI+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IEhvcml6b250YWw6IFN0b3J5ID0ge31cblxuZXhwb3J0IGNvbnN0IFZlcnRpY2FsOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC0yMCBpdGVtcy1jZW50ZXIgZ2FwLTQgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC00XCI+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5GaWx0ZXJzPC9zcGFuPlxuICAgICAgPERpdmlkZXIgey4uLmFyZ3N9IHR5cGU9XCJ2ZXJ0aWNhbFwiIC8+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5UYWdzPC9zcGFuPlxuICAgIDwvZGl2PlxuICApLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPERpdmlkZXIgdHlwZT1cInZlcnRpY2FsXCIgLz5cbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59XG4iXX0=