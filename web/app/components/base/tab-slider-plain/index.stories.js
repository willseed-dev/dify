"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const OPTIONS = [
    { value: 'analytics', text: 'Analytics' },
    { value: 'activity', text: 'Recent activity' },
    { value: 'alerts', text: 'Alerts' },
];
const TabSliderPlainDemo = ({ initialValue = 'analytics', }) => {
    const [value, setValue] = (0, react_1.useState)(initialValue);
    return (<div className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Underline tabs</div>
      <_1.default value={value} onChange={setValue} options={OPTIONS}/>
    </div>);
};
const meta = {
    title: 'Base/Navigation/TabSliderPlain',
    component: TabSliderPlainDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Underline-style navigation commonly used in dashboards. Toggle between three sections.',
            },
        },
    },
    argTypes: {
        initialValue: {
            control: 'radio',
            options: OPTIONS.map(option => option.value),
        },
    },
    args: {
        initialValue: 'analytics',
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBOEI7QUFFOUIsTUFBTSxPQUFPLEdBQUc7SUFDZCxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUN6QyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFO0lBQzlDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0NBQ3BDLENBQUE7QUFFRCxNQUFNLGtCQUFrQixHQUFHLENBQUMsRUFDMUIsWUFBWSxHQUFHLFdBQVcsR0FHM0IsRUFBRSxFQUFFO0lBQ0gsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsWUFBWSxDQUFDLENBQUE7SUFFaEQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwR0FBMEcsQ0FDdkg7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FDM0Y7TUFBQSxDQUFDLFVBQWMsQ0FDYixLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDYixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDbkIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBRXJCO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsZ0NBQWdDO0lBQ3ZDLFNBQVMsRUFBRSxrQkFBa0I7SUFDN0IsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSx3RkFBd0Y7YUFDcEc7U0FDRjtLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsWUFBWSxFQUFFO1lBQ1osT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQzdDO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixZQUFZLEVBQUUsV0FBVztLQUMxQjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUN1QixDQUFBO0FBRTNDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsVUFBVSxHQUFVLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgVGFiU2xpZGVyUGxhaW4gZnJvbSAnLidcblxuY29uc3QgT1BUSU9OUyA9IFtcbiAgeyB2YWx1ZTogJ2FuYWx5dGljcycsIHRleHQ6ICdBbmFseXRpY3MnIH0sXG4gIHsgdmFsdWU6ICdhY3Rpdml0eScsIHRleHQ6ICdSZWNlbnQgYWN0aXZpdHknIH0sXG4gIHsgdmFsdWU6ICdhbGVydHMnLCB0ZXh0OiAnQWxlcnRzJyB9LFxuXVxuXG5jb25zdCBUYWJTbGlkZXJQbGFpbkRlbW8gPSAoe1xuICBpbml0aWFsVmFsdWUgPSAnYW5hbHl0aWNzJyxcbn06IHtcbiAgaW5pdGlhbFZhbHVlPzogc3RyaW5nXG59KSA9PiB7XG4gIGNvbnN0IFt2YWx1ZSwgc2V0VmFsdWVdID0gdXNlU3RhdGUoaW5pdGlhbFZhbHVlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBtYXgtdy0yeGwgZmxleC1jb2wgZ2FwLTQgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy1bMC4xOGVtXSB0ZXh0LXRleHQtdGVydGlhcnlcIj5VbmRlcmxpbmUgdGFiczwvZGl2PlxuICAgICAgPFRhYlNsaWRlclBsYWluXG4gICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgb25DaGFuZ2U9e3NldFZhbHVlfVxuICAgICAgICBvcHRpb25zPXtPUFRJT05TfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvTmF2aWdhdGlvbi9UYWJTbGlkZXJQbGFpbicsXG4gIGNvbXBvbmVudDogVGFiU2xpZGVyUGxhaW5EZW1vLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1VuZGVybGluZS1zdHlsZSBuYXZpZ2F0aW9uIGNvbW1vbmx5IHVzZWQgaW4gZGFzaGJvYXJkcy4gVG9nZ2xlIGJldHdlZW4gdGhyZWUgc2VjdGlvbnMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYXJnVHlwZXM6IHtcbiAgICBpbml0aWFsVmFsdWU6IHtcbiAgICAgIGNvbnRyb2w6ICdyYWRpbycsXG4gICAgICBvcHRpb25zOiBPUFRJT05TLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKSxcbiAgICB9LFxuICB9LFxuICBhcmdzOiB7XG4gICAgaW5pdGlhbFZhbHVlOiAnYW5hbHl0aWNzJyxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgVGFiU2xpZGVyUGxhaW5EZW1vPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHt9XG4iXX0=