"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticApi = exports.Provider = void 0;
const react_1 = require("react");
const _1 = require(".");
const ToastControls = () => {
    const { notify } = (0, _1.useToastContext)();
    const trigger = (0, react_1.useCallback)((type) => {
        notify({
            type,
            message: `This is a ${type} toast`,
            children: type === 'info' ? 'Additional details can live here.' : undefined,
        });
    }, [notify]);
    return (<div className="flex flex-wrap gap-3">
      <button type="button" className="rounded-md border border-divider-subtle bg-background-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => trigger('success')}>
        Success
      </button>
      <button type="button" className="rounded-md border border-divider-subtle bg-background-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => trigger('info')}>
        Info
      </button>
      <button type="button" className="rounded-md border border-divider-subtle bg-background-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => trigger('warning')}>
        Warning
      </button>
      <button type="button" className="rounded-md border border-divider-subtle bg-background-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => trigger('error')}>
        Error
      </button>
    </div>);
};
const ToastProviderDemo = () => {
    return (<_1.ToastProvider>
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
        <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Toast provider</div>
        <ToastControls />
      </div>
    </_1.ToastProvider>);
};
const StaticToastDemo = () => {
    return (<div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Static API</div>
      <button type="button" className="self-start rounded-md border border-divider-subtle bg-background-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => {
            const handle = _1.default.notify({
                type: 'success',
                message: 'Saved changes',
                duration: 2000,
            });
            setTimeout(() => handle.clear?.(), 2500);
        }}>
        Trigger Toast.notify()
      </button>
    </div>);
};
const meta = {
    title: 'Base/Feedback/Toast',
    component: ToastProviderDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'ToastProvider based notifications and the static Toast.notify helper. Buttons showcase each toast variant.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Provider = {};
exports.StaticApi = {
    render: () => <StaticToastDemo />,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFtQztBQUNuQyx3QkFBeUQ7QUFFekQsTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUFFO0lBQ3pCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFlLEdBQUUsQ0FBQTtJQUVwQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxJQUE4QyxFQUFFLEVBQUU7UUFDN0UsTUFBTSxDQUFDO1lBQ0wsSUFBSTtZQUNKLE9BQU8sRUFBRSxhQUFhLElBQUksUUFBUTtZQUNsQyxRQUFRLEVBQUUsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDNUUsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUVaLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQ25DO01BQUEsQ0FBQyxNQUFNLENBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FDYixTQUFTLENBQUMsNklBQTZJLENBQ3ZKLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUVsQzs7TUFDRixFQUFFLE1BQU0sQ0FDUjtNQUFBLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLDZJQUE2SSxDQUN2SixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FFL0I7O01BQ0YsRUFBRSxNQUFNLENBQ1I7TUFBQSxDQUFDLE1BQU0sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQyw2SUFBNkksQ0FDdkosT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBRWxDOztNQUNGLEVBQUUsTUFBTSxDQUNSO01BQUEsQ0FBQyxNQUFNLENBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FDYixTQUFTLENBQUMsNklBQTZJLENBQ3ZKLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUVoQzs7TUFDRixFQUFFLE1BQU0sQ0FDVjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQzdCLE9BQU8sQ0FDTCxDQUFDLGdCQUFhLENBQ1o7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUdBQXlHLENBQ3RIO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdEQUF3RCxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQzNGO1FBQUEsQ0FBQyxhQUFhLENBQUMsQUFBRCxFQUNoQjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxnQkFBYSxDQUFDLENBQ2pCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUU7SUFDM0IsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5R0FBeUcsQ0FDdEg7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FDdkY7TUFBQSxDQUFDLE1BQU0sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQyx3SkFBd0osQ0FDbEssT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ1osTUFBTSxNQUFNLEdBQUcsVUFBSyxDQUFDLE1BQU0sQ0FBQztnQkFDMUIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLFFBQVEsRUFBRSxJQUFJO2FBQ2YsQ0FBQyxDQUFBO1lBQ0YsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUVGOztNQUNGLEVBQUUsTUFBTSxDQUNWO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUscUJBQXFCO0lBQzVCLFNBQVMsRUFBRSxpQkFBaUI7SUFDNUIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSw0R0FBNEc7YUFDeEg7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ3NCLENBQUE7QUFFMUMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxRQUFRLEdBQVUsRUFBRSxDQUFBO0FBRXBCLFFBQUEsU0FBUyxHQUFVO0lBQzlCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxBQUFELEVBQUc7Q0FDbEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgVG9hc3QsIHsgVG9hc3RQcm92aWRlciwgdXNlVG9hc3RDb250ZXh0IH0gZnJvbSAnLidcblxuY29uc3QgVG9hc3RDb250cm9scyA9ICgpID0+IHtcbiAgY29uc3QgeyBub3RpZnkgfSA9IHVzZVRvYXN0Q29udGV4dCgpXG5cbiAgY29uc3QgdHJpZ2dlciA9IHVzZUNhbGxiYWNrKCh0eXBlOiAnc3VjY2VzcycgfCAnZXJyb3InIHwgJ3dhcm5pbmcnIHwgJ2luZm8nKSA9PiB7XG4gICAgbm90aWZ5KHtcbiAgICAgIHR5cGUsXG4gICAgICBtZXNzYWdlOiBgVGhpcyBpcyBhICR7dHlwZX0gdG9hc3RgLFxuICAgICAgY2hpbGRyZW46IHR5cGUgPT09ICdpbmZvJyA/ICdBZGRpdGlvbmFsIGRldGFpbHMgY2FuIGxpdmUgaGVyZS4nIDogdW5kZWZpbmVkLFxuICAgIH0pXG4gIH0sIFtub3RpZnldKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBnYXAtM1wiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBweC0zIHB5LTEuNSB0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtdGV4dC1zZWNvbmRhcnkgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRyaWdnZXIoJ3N1Y2Nlc3MnKX1cbiAgICAgID5cbiAgICAgICAgU3VjY2Vzc1xuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0IHB4LTMgcHktMS41IHRleHQteHMgZm9udC1tZWRpdW0gdGV4dC10ZXh0LXNlY29uZGFyeSBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gdHJpZ2dlcignaW5mbycpfVxuICAgICAgPlxuICAgICAgICBJbmZvXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQgcHgtMyBweS0xLjUgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB0cmlnZ2VyKCd3YXJuaW5nJyl9XG4gICAgICA+XG4gICAgICAgIFdhcm5pbmdcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBweC0zIHB5LTEuNSB0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtdGV4dC1zZWNvbmRhcnkgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRyaWdnZXIoJ2Vycm9yJyl9XG4gICAgICA+XG4gICAgICAgIEVycm9yXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBUb2FzdFByb3ZpZGVyRGVtbyA9ICgpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8VG9hc3RQcm92aWRlcj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXctbWQgZmxleC1jb2wgZ2FwLTQgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjE4ZW1dIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlRvYXN0IHByb3ZpZGVyPC9kaXY+XG4gICAgICAgIDxUb2FzdENvbnRyb2xzIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L1RvYXN0UHJvdmlkZXI+XG4gIClcbn1cblxuY29uc3QgU3RhdGljVG9hc3REZW1vID0gKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXctbWQgZmxleC1jb2wgZ2FwLTQgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy1bMC4xOGVtXSB0ZXh0LXRleHQtdGVydGlhcnlcIj5TdGF0aWMgQVBJPC9kaXY+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJzZWxmLXN0YXJ0IHJvdW5kZWQtbWQgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQgcHgtMyBweS0xLjUgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlID0gVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdTYXZlZCBjaGFuZ2VzJyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBoYW5kbGUuY2xlYXI/LigpLCAyNTAwKVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICBUcmlnZ2VyIFRvYXN0Lm5vdGlmeSgpXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRmVlZGJhY2svVG9hc3QnLFxuICBjb21wb25lbnQ6IFRvYXN0UHJvdmlkZXJEZW1vLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1RvYXN0UHJvdmlkZXIgYmFzZWQgbm90aWZpY2F0aW9ucyBhbmQgdGhlIHN0YXRpYyBUb2FzdC5ub3RpZnkgaGVscGVyLiBCdXR0b25zIHNob3djYXNlIGVhY2ggdG9hc3QgdmFyaWFudC4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBUb2FzdFByb3ZpZGVyRGVtbz5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUHJvdmlkZXI6IFN0b3J5ID0ge31cblxuZXhwb3J0IGNvbnN0IFN0YXRpY0FwaTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPFN0YXRpY1RvYXN0RGVtbyAvPixcbn1cbiJdfQ==