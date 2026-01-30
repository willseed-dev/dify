"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const OPTIONS = [
    { value: 'models', text: 'Models' },
    { value: 'datasets', text: 'Datasets' },
    { value: 'plugins', text: 'Plugins' },
];
const TabSliderDemo = ({ initialValue = 'models', }) => {
    const [value, setValue] = (0, react_1.useState)(initialValue);
    (0, react_1.useEffect)(() => {
        const originalFetch = globalThis.fetch?.bind(globalThis);
        const handler = async (input, init) => {
            const url = typeof input === 'string'
                ? input
                : input instanceof URL
                    ? input.toString()
                    : input.url;
            if (url.includes('/workspaces/current/plugin/list')) {
                return new Response(JSON.stringify({
                    total: 6,
                    plugins: [],
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (originalFetch)
                return originalFetch(input, init);
            throw new Error(`Unhandled request for ${url}`);
        };
        globalThis.fetch = handler;
        return () => {
            if (originalFetch)
                globalThis.fetch = originalFetch;
        };
    }, []);
    return (<div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Segmented tabs</div>
      <_1.default value={value} options={OPTIONS} onChange={setValue}/>
    </div>);
};
const meta = {
    title: 'Base/Navigation/TabSlider',
    component: TabSliderDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Animated segmented control with sliding highlight. A badge appears when plugins are installed (mocked in Storybook).',
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
        initialValue: 'models',
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUEyQztBQUMzQyx3QkFBeUI7QUFFekIsTUFBTSxPQUFPLEdBQUc7SUFDZCxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUNuQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtJQUN2QyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtDQUN0QyxDQUFBO0FBRUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxFQUNyQixZQUFZLEdBQUcsUUFBUSxHQUd4QixFQUFFLEVBQUU7SUFDSCxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxZQUFZLENBQUMsQ0FBQTtJQUVoRCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFFeEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQXdCLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQ3JFLE1BQU0sR0FBRyxHQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVE7Z0JBQ25DLENBQUMsQ0FBQyxLQUFLO2dCQUNQLENBQUMsQ0FBQyxLQUFLLFlBQVksR0FBRztvQkFDcEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQ2xCLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFBO1lBRWYsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLEVBQUUsQ0FBQztnQkFDcEQsT0FBTyxJQUFJLFFBQVEsQ0FDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDYixLQUFLLEVBQUUsQ0FBQztvQkFDUixPQUFPLEVBQUUsRUFBRTtpQkFDWixDQUFDLEVBQ0Y7b0JBQ0UsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO2lCQUNoRCxDQUNGLENBQUE7WUFDSCxDQUFDO1lBRUQsSUFBSSxhQUFhO2dCQUNmLE9BQU8sYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUVuQyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixHQUFHLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELENBQUMsQ0FBQTtRQUVELFVBQVUsQ0FBQyxLQUFLLEdBQUcsT0FBa0MsQ0FBQTtRQUVyRCxPQUFPLEdBQUcsRUFBRTtZQUNWLElBQUksYUFBYTtnQkFDZixVQUFVLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQTtRQUNwQyxDQUFDLENBQUE7SUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFTixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlHQUF5RyxDQUN0SDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3REFBd0QsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUMzRjtNQUFBLENBQUMsVUFBUyxDQUNSLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNiLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNqQixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFFdkI7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSwyQkFBMkI7SUFDbEMsU0FBUyxFQUFFLGFBQWE7SUFDeEIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxzSEFBc0g7YUFDbEk7U0FDRjtLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsWUFBWSxFQUFFO1lBQ1osT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQzdDO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixZQUFZLEVBQUUsUUFBUTtLQUN2QjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUNrQixDQUFBO0FBRXRDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsVUFBVSxHQUFVLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBUYWJTbGlkZXIgZnJvbSAnLidcblxuY29uc3QgT1BUSU9OUyA9IFtcbiAgeyB2YWx1ZTogJ21vZGVscycsIHRleHQ6ICdNb2RlbHMnIH0sXG4gIHsgdmFsdWU6ICdkYXRhc2V0cycsIHRleHQ6ICdEYXRhc2V0cycgfSxcbiAgeyB2YWx1ZTogJ3BsdWdpbnMnLCB0ZXh0OiAnUGx1Z2lucycgfSxcbl1cblxuY29uc3QgVGFiU2xpZGVyRGVtbyA9ICh7XG4gIGluaXRpYWxWYWx1ZSA9ICdtb2RlbHMnLFxufToge1xuICBpbml0aWFsVmFsdWU/OiBzdHJpbmdcbn0pID0+IHtcbiAgY29uc3QgW3ZhbHVlLCBzZXRWYWx1ZV0gPSB1c2VTdGF0ZShpbml0aWFsVmFsdWUpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvcmlnaW5hbEZldGNoID0gZ2xvYmFsVGhpcy5mZXRjaD8uYmluZChnbG9iYWxUaGlzKVxuXG4gICAgY29uc3QgaGFuZGxlciA9IGFzeW5jIChpbnB1dDogUmVxdWVzdEluZm8gfCBVUkwsIGluaXQ/OiBSZXF1ZXN0SW5pdCkgPT4ge1xuICAgICAgY29uc3QgdXJsID0gdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IGlucHV0XG4gICAgICAgIDogaW5wdXQgaW5zdGFuY2VvZiBVUkxcbiAgICAgICAgICA/IGlucHV0LnRvU3RyaW5nKClcbiAgICAgICAgICA6IGlucHV0LnVybFxuXG4gICAgICBpZiAodXJsLmluY2x1ZGVzKCcvd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi9saXN0JykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0b3RhbDogNixcbiAgICAgICAgICAgIHBsdWdpbnM6IFtdLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBpZiAob3JpZ2luYWxGZXRjaClcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmV0Y2goaW5wdXQsIGluaXQpXG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5oYW5kbGVkIHJlcXVlc3QgZm9yICR7dXJsfWApXG4gICAgfVxuXG4gICAgZ2xvYmFsVGhpcy5mZXRjaCA9IGhhbmRsZXIgYXMgdHlwZW9mIGdsb2JhbFRoaXMuZmV0Y2hcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAob3JpZ2luYWxGZXRjaClcbiAgICAgICAgZ2xvYmFsVGhpcy5mZXRjaCA9IG9yaWdpbmFsRmV0Y2hcbiAgICB9XG4gIH0sIFtdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBtYXgtdy1sZyBmbGV4LWNvbCBnYXAtNCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjE4ZW1dIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlNlZ21lbnRlZCB0YWJzPC9kaXY+XG4gICAgICA8VGFiU2xpZGVyXG4gICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgb3B0aW9ucz17T1BUSU9OU31cbiAgICAgICAgb25DaGFuZ2U9e3NldFZhbHVlfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvTmF2aWdhdGlvbi9UYWJTbGlkZXInLFxuICBjb21wb25lbnQ6IFRhYlNsaWRlckRlbW8sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnQW5pbWF0ZWQgc2VnbWVudGVkIGNvbnRyb2wgd2l0aCBzbGlkaW5nIGhpZ2hsaWdodC4gQSBiYWRnZSBhcHBlYXJzIHdoZW4gcGx1Z2lucyBhcmUgaW5zdGFsbGVkIChtb2NrZWQgaW4gU3Rvcnlib29rKS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIGluaXRpYWxWYWx1ZToge1xuICAgICAgY29udHJvbDogJ3JhZGlvJyxcbiAgICAgIG9wdGlvbnM6IE9QVElPTlMubWFwKG9wdGlvbiA9PiBvcHRpb24udmFsdWUpLFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICBpbml0aWFsVmFsdWU6ICdtb2RlbHMnLFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBUYWJTbGlkZXJEZW1vPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHt9XG4iXX0=