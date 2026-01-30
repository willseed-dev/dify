"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const SpinnerPlayground = ({ loading = true, }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(loading);
    return (<div className="flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Spinner</p>
      <_1.default loading={isLoading} className="text-primary-500"/>
      <button type="button" className="rounded-md border border-divider-subtle bg-background-default px-3 py-1 text-xs font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => setIsLoading(prev => !prev)}>
        {isLoading ? 'Stop' : 'Start'}
        {' '}
        loading
      </button>
    </div>);
};
const meta = {
    title: 'Base/Feedback/Spinner',
    component: SpinnerPlayground,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Minimal spinner powered by Tailwind utilities. Toggle the state to inspect motion-reduced behaviour.',
            },
        },
    },
    argTypes: {
        loading: { control: 'boolean' },
    },
    args: {
        loading: true,
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBdUI7QUFFdkIsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLEVBQ3pCLE9BQU8sR0FBRyxJQUFJLEdBR2YsRUFBRSxFQUFFO0lBQ0gsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsT0FBTyxDQUFDLENBQUE7SUFFbkQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzSEFBc0gsQ0FDbkk7TUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsT0FBTyxFQUFFLENBQUMsQ0FDaEY7TUFBQSxDQUFDLFVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQ3pEO01BQUEsQ0FBQyxNQUFNLENBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FDYixTQUFTLENBQUMsMklBQTJJLENBQ3JKLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FFM0M7UUFBQSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzdCO1FBQUEsQ0FBQyxHQUFHLENBQ0o7O01BQ0YsRUFBRSxNQUFNLENBQ1Y7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx1QkFBdUI7SUFDOUIsU0FBUyxFQUFFLGlCQUFpQjtJQUM1QixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLHNHQUFzRzthQUNsSDtTQUNGO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0tBQ2hDO0lBQ0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLElBQUk7S0FDZDtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUNzQixDQUFBO0FBRTFDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsVUFBVSxHQUFVLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgU3Bpbm5lciBmcm9tICcuJ1xuXG5jb25zdCBTcGlubmVyUGxheWdyb3VuZCA9ICh7XG4gIGxvYWRpbmcgPSB0cnVlLFxufToge1xuICBsb2FkaW5nPzogYm9vbGVhblxufSkgPT4ge1xuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUobG9hZGluZylcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXcteHMgZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC00IHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTZcIj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjE4ZW1dIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlNwaW5uZXI8L3A+XG4gICAgICA8U3Bpbm5lciBsb2FkaW5nPXtpc0xvYWRpbmd9IGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeS01MDBcIiAvPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBweC0zIHB5LTEgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc0xvYWRpbmcocHJldiA9PiAhcHJldil9XG4gICAgICA+XG4gICAgICAgIHtpc0xvYWRpbmcgPyAnU3RvcCcgOiAnU3RhcnQnfVxuICAgICAgICB7JyAnfVxuICAgICAgICBsb2FkaW5nXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRmVlZGJhY2svU3Bpbm5lcicsXG4gIGNvbXBvbmVudDogU3Bpbm5lclBsYXlncm91bmQsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnTWluaW1hbCBzcGlubmVyIHBvd2VyZWQgYnkgVGFpbHdpbmQgdXRpbGl0aWVzLiBUb2dnbGUgdGhlIHN0YXRlIHRvIGluc3BlY3QgbW90aW9uLXJlZHVjZWQgYmVoYXZpb3VyLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGFyZ1R5cGVzOiB7XG4gICAgbG9hZGluZzogeyBjb250cm9sOiAnYm9vbGVhbicgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIGxvYWRpbmc6IHRydWUsXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFNwaW5uZXJQbGF5Z3JvdW5kPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHt9XG4iXX0=