"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnCard = exports.Default = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/Data Display/CornerLabel',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Decorative label that anchors to card corners. Useful for marking “beta”, “deprecated”, or similar callouts.',
            },
            source: {
                language: 'tsx',
                code: `
<CornerLabel label="beta" />
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
    args: {
        label: 'beta',
    },
};
exports.default = meta;
exports.Default = {};
exports.OnCard = {
    render: args => (<div className="relative w-80 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <_1.default {...args} className="absolute right-[-1px] top-[-1px]"/>
      <div className="text-sm text-text-secondary">
        Showcase how the label sits on a card header. Pair with contextual text or status information.
      </div>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<div className="relative">
  <CornerLabel label="beta" className="absolute left-[-1px] top-[-1px]" />
  ...card content...
</div>
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUEyQjtBQUUzQixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSwrQkFBK0I7SUFDdEMsU0FBUyxFQUFFLFVBQVc7SUFDdEIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSw4R0FBOEc7YUFDMUg7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOztTQUVMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSxNQUFNO0tBQ2Q7Q0FDaUMsQ0FBQTtBQUVwQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLE9BQU8sR0FBVSxFQUFFLENBQUE7QUFFbkIsUUFBQSxNQUFNLEdBQVU7SUFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDZCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUZBQW1GLENBQ2hHO01BQUEsQ0FBQyxVQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsa0NBQWtDLEVBQ25FO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUMxQzs7TUFDRixFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOzs7OztTQUtMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBDb3JuZXJMYWJlbCBmcm9tICcuJ1xuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRGF0YSBEaXNwbGF5L0Nvcm5lckxhYmVsJyxcbiAgY29tcG9uZW50OiBDb3JuZXJMYWJlbCxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0RlY29yYXRpdmUgbGFiZWwgdGhhdCBhbmNob3JzIHRvIGNhcmQgY29ybmVycy4gVXNlZnVsIGZvciBtYXJraW5nIOKAnGJldGHigJ0sIOKAnGRlcHJlY2F0ZWTigJ0sIG9yIHNpbWlsYXIgY2FsbG91dHMuJyxcbiAgICAgIH0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48Q29ybmVyTGFiZWwgbGFiZWw9XCJiZXRhXCIgLz5cbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnczoge1xuICAgIGxhYmVsOiAnYmV0YScsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBDb3JuZXJMYWJlbD5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgT25DYXJkOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIHctODAgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNlwiPlxuICAgICAgPENvcm5lckxhYmVsIHsuLi5hcmdzfSBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC1bLTFweF0gdG9wLVstMXB4XVwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICBTaG93Y2FzZSBob3cgdGhlIGxhYmVsIHNpdHMgb24gYSBjYXJkIGhlYWRlci4gUGFpciB3aXRoIGNvbnRleHR1YWwgdGV4dCBvciBzdGF0dXMgaW5mb3JtYXRpb24uXG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbjxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgPENvcm5lckxhYmVsIGxhYmVsPVwiYmV0YVwiIGNsYXNzTmFtZT1cImFic29sdXRlIGxlZnQtWy0xcHhdIHRvcC1bLTFweF1cIiAvPlxuICAuLi5jYXJkIGNvbnRlbnQuLi5cbjwvZGl2PlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==