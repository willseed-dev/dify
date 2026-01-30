"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Data Entry/AppIconPicker',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Modal workflow for choosing an application avatar. Users can switch between emoji selections and image uploads (when enabled).',
            },
        },
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/apps/demo-app/icon-picker',
                params: { appId: 'demo-app' },
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
const AppIconPickerDemo = () => {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [selection, setSelection] = (0, react_1.useState)(null);
    return (<div className="flex min-h-[320px] flex-col items-start gap-4 px-6 py-8 md:px-12">
      <button type="button" className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
        Choose icon…
      </button>

      <div className="rounded-lg border border-divider-subtle bg-components-panel-bg p-4 text-sm text-text-secondary shadow-sm">
        <div className="font-medium text-text-primary">Selection preview</div>
        <pre className="mt-2 max-h-44 overflow-auto rounded-md bg-background-default-subtle p-3 font-mono text-xs leading-tight text-text-primary">
          {selection ? JSON.stringify(selection, null, 2) : 'No icon selected yet.'}
        </pre>
      </div>

      {open && (<_1.default onSelect={(result) => {
                setSelection(result);
                setOpen(false);
            }} onClose={() => setOpen(false)}/>)}
    </div>);
};
exports.Playground = {
    render: () => <AppIconPickerDemo />,
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
const [open, setOpen] = useState(false)
const [selection, setSelection] = useState<AppIconSelection | null>(null)

return (
  <>
    <button onClick={() => setOpen(true)}>Choose icon…</button>
    {open && (
      <AppIconPicker
        onSelect={(result) => {
          setSelection(result)
          setOpen(false)
        }}
        onClose={() => setOpen(false)}
      />
    )}
  </>
)
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFnQztBQUNoQyx3QkFBNkI7QUFFN0IsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsK0JBQStCO0lBQ3RDLFNBQVMsRUFBRSxVQUFhO0lBQ3hCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsZ0lBQWdJO2FBQzVJO1NBQ0Y7UUFDRCxNQUFNLEVBQUU7WUFDTixZQUFZLEVBQUUsSUFBSTtZQUNsQixVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTthQUM5QjtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDa0IsQ0FBQTtBQUV0QyxrQkFBZSxJQUFJLENBQUE7QUFHbkIsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLEVBQUU7SUFDN0IsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDdkMsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQTBCLElBQUksQ0FBQyxDQUFBO0lBRXpFLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0VBQWtFLENBQy9FO01BQUEsQ0FBQyxNQUFNLENBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FDYixTQUFTLENBQUMsbUdBQW1HLENBQzdHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUU3Qjs7TUFDRixFQUFFLE1BQU0sQ0FFUjs7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEdBQTBHLENBQ3ZIO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLCtCQUErQixDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FDckU7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkhBQTJILENBQ3hJO1VBQUEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQzNFO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FFTDs7TUFBQSxDQUFDLElBQUksSUFBSSxDQUNQLENBQUMsVUFBYSxDQUNaLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ25CLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2hCLENBQUMsQ0FBQyxDQUNGLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUM5QixDQUNILENBQ0g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxBQUFELEVBQUc7SUFDbkMsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBa0JMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB0eXBlIHsgQXBwSWNvblNlbGVjdGlvbiB9IGZyb20gJy4nXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IEFwcEljb25QaWNrZXIgZnJvbSAnLidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRW50cnkvQXBwSWNvblBpY2tlcicsXG4gIGNvbXBvbmVudDogQXBwSWNvblBpY2tlcixcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2Z1bGxzY3JlZW4nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ01vZGFsIHdvcmtmbG93IGZvciBjaG9vc2luZyBhbiBhcHBsaWNhdGlvbiBhdmF0YXIuIFVzZXJzIGNhbiBzd2l0Y2ggYmV0d2VlbiBlbW9qaSBzZWxlY3Rpb25zIGFuZCBpbWFnZSB1cGxvYWRzICh3aGVuIGVuYWJsZWQpLicsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbmV4dGpzOiB7XG4gICAgICBhcHBEaXJlY3Rvcnk6IHRydWUsXG4gICAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICAgIHBhdGhuYW1lOiAnL2FwcHMvZGVtby1hcHAvaWNvbi1waWNrZXInLFxuICAgICAgICBwYXJhbXM6IHsgYXBwSWQ6ICdkZW1vLWFwcCcgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgQXBwSWNvblBpY2tlcj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5jb25zdCBBcHBJY29uUGlja2VyRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzZWxlY3Rpb24sIHNldFNlbGVjdGlvbl0gPSB1c2VTdGF0ZTxBcHBJY29uU2VsZWN0aW9uIHwgbnVsbD4obnVsbClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBtaW4taC1bMzIwcHhdIGZsZXgtY29sIGl0ZW1zLXN0YXJ0IGdhcC00IHB4LTYgcHktOCBtZDpweC0xMlwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBiZy1wcmltYXJ5LTYwMCBweC00IHB5LTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LXdoaXRlIHNoYWRvdy1zbSBob3ZlcjpiZy1wcmltYXJ5LTcwMFwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE9wZW4odHJ1ZSl9XG4gICAgICA+XG4gICAgICAgIENob29zZSBpY29u4oCmXG4gICAgICA8L2J1dHRvbj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTQgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5IHNoYWRvdy1zbVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvbnQtbWVkaXVtIHRleHQtdGV4dC1wcmltYXJ5XCI+U2VsZWN0aW9uIHByZXZpZXc8L2Rpdj5cbiAgICAgICAgPHByZSBjbGFzc05hbWU9XCJtdC0yIG1heC1oLTQ0IG92ZXJmbG93LWF1dG8gcm91bmRlZC1tZCBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlIHAtMyBmb250LW1vbm8gdGV4dC14cyBsZWFkaW5nLXRpZ2h0IHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAge3NlbGVjdGlvbiA/IEpTT04uc3RyaW5naWZ5KHNlbGVjdGlvbiwgbnVsbCwgMikgOiAnTm8gaWNvbiBzZWxlY3RlZCB5ZXQuJ31cbiAgICAgICAgPC9wcmU+XG4gICAgICA8L2Rpdj5cblxuICAgICAge29wZW4gJiYgKFxuICAgICAgICA8QXBwSWNvblBpY2tlclxuICAgICAgICAgIG9uU2VsZWN0PXsocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBzZXRTZWxlY3Rpb24ocmVzdWx0KVxuICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE9wZW4oZmFsc2UpfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPEFwcEljb25QaWNrZXJEZW1vIC8+LFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG5jb25zdCBbc2VsZWN0aW9uLCBzZXRTZWxlY3Rpb25dID0gdXNlU3RhdGU8QXBwSWNvblNlbGVjdGlvbiB8IG51bGw+KG51bGwpXG5cbnJldHVybiAoXG4gIDw+XG4gICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfT5DaG9vc2UgaWNvbuKApjwvYnV0dG9uPlxuICAgIHtvcGVuICYmIChcbiAgICAgIDxBcHBJY29uUGlja2VyXG4gICAgICAgIG9uU2VsZWN0PXsocmVzdWx0KSA9PiB7XG4gICAgICAgICAgc2V0U2VsZWN0aW9uKHJlc3VsdClcbiAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICB9fVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRPcGVuKGZhbHNlKX1cbiAgICAgIC8+XG4gICAgKX1cbiAgPC8+XG4pXG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuIl19