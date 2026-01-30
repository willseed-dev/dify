"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineUsage = exports.Default = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/General/CopyIcon',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Interactive copy-to-clipboard glyph that swaps to a checkmark once the content has been copied. Tooltips rely on the app locale.',
            },
        },
    },
    tags: ['autodocs'],
    args: {
        content: 'https://console.dify.ai/apps/12345',
    },
};
exports.default = meta;
exports.Default = {
    render: args => (<div className="flex items-center gap-2 rounded-lg border border-divider-subtle bg-components-panel-bg p-4 text-sm text-text-secondary">
      <span>Hover or click to copy the app link:</span>
      <_1.default {...args}/>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<div className="flex items-center gap-2">
  <span>Hover or click to copy the app link:</span>
  <CopyIcon content="https://console.dify.ai/apps/12345" />
</div>
        `.trim(),
            },
        },
    },
};
exports.InlineUsage = {
    render: args => (<div className="space-y-3 text-sm text-text-secondary">
      <p>
        Use the copy icon inline with labels or metadata. Clicking the icon copies the value to the clipboard and shows a success tooltip.
      </p>
      <div className="flex items-center gap-1">
        <span className="font-medium text-text-primary">Client ID</span>
        <span className="rounded bg-background-default-subtle px-2 py-1 font-mono text-xs text-text-secondary">acc-3f92fa</span>
        <_1.default {...args} content="acc-3f92fa"/>
      </div>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<CopyIcon content="acc-3f92fa" />
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUF3QjtBQUV4QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx1QkFBdUI7SUFDOUIsU0FBUyxFQUFFLFVBQVE7SUFDbkIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxrSUFBa0k7YUFDOUk7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxvQ0FBb0M7S0FDOUM7Q0FDOEIsQ0FBQTtBQUVqQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLE9BQU8sR0FBVTtJQUM1QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3SEFBd0gsQ0FDckk7TUFBQSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxJQUFJLENBQ2hEO01BQUEsQ0FBQyxVQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsRUFDckI7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7Ozs7U0FLTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUE7QUFFWSxRQUFBLFdBQVcsR0FBVTtJQUNoQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FDcEQ7TUFBQSxDQUFDLENBQUMsQ0FDQTs7TUFDRixFQUFFLENBQUMsQ0FDSDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FDdEM7UUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsK0JBQStCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FDL0Q7UUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsc0ZBQXNGLENBQUMsVUFBVSxFQUFFLElBQUksQ0FDdkg7UUFBQSxDQUFDLFVBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQzFDO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7U0FFTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgQ29weUljb24gZnJvbSAnLidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0dlbmVyYWwvQ29weUljb24nLFxuICBjb21wb25lbnQ6IENvcHlJY29uLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnSW50ZXJhY3RpdmUgY29weS10by1jbGlwYm9hcmQgZ2x5cGggdGhhdCBzd2FwcyB0byBhIGNoZWNrbWFyayBvbmNlIHRoZSBjb250ZW50IGhhcyBiZWVuIGNvcGllZC4gVG9vbHRpcHMgcmVseSBvbiB0aGUgYXBwIGxvY2FsZS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ3M6IHtcbiAgICBjb250ZW50OiAnaHR0cHM6Ly9jb25zb2xlLmRpZnkuYWkvYXBwcy8xMjM0NScsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBDb3B5SWNvbj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTQgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICA8c3Bhbj5Ib3ZlciBvciBjbGljayB0byBjb3B5IHRoZSBhcHAgbGluazo8L3NwYW4+XG4gICAgICA8Q29weUljb24gey4uLmFyZ3N9IC8+XG4gICAgPC9kaXY+XG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gIDxzcGFuPkhvdmVyIG9yIGNsaWNrIHRvIGNvcHkgdGhlIGFwcCBsaW5rOjwvc3Bhbj5cbiAgPENvcHlJY29uIGNvbnRlbnQ9XCJodHRwczovL2NvbnNvbGUuZGlmeS5haS9hcHBzLzEyMzQ1XCIgLz5cbjwvZGl2PlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IElubGluZVVzYWdlOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyB0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgIDxwPlxuICAgICAgICBVc2UgdGhlIGNvcHkgaWNvbiBpbmxpbmUgd2l0aCBsYWJlbHMgb3IgbWV0YWRhdGEuIENsaWNraW5nIHRoZSBpY29uIGNvcGllcyB0aGUgdmFsdWUgdG8gdGhlIGNsaXBib2FyZCBhbmQgc2hvd3MgYSBzdWNjZXNzIHRvb2x0aXAuXG4gICAgICA8L3A+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbWVkaXVtIHRleHQtdGV4dC1wcmltYXJ5XCI+Q2xpZW50IElEPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJyb3VuZGVkIGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGUgcHgtMiBweS0xIGZvbnQtbW9ubyB0ZXh0LXhzIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5hY2MtM2Y5MmZhPC9zcGFuPlxuICAgICAgICA8Q29weUljb24gey4uLmFyZ3N9IGNvbnRlbnQ9XCJhY2MtM2Y5MmZhXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPENvcHlJY29uIGNvbnRlbnQ9XCJhY2MtM2Y5MmZhXCIgLz5cbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59XG4iXX0=