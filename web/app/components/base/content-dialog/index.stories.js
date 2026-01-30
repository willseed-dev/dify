"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarrowPanel = exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/ContentDialog',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Sliding panel overlay used in the app detail view. Includes dimmed backdrop and animated entrance/exit transitions.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional classes applied to the sliding panel container.',
        },
        show: {
            control: 'boolean',
            description: 'Controls visibility of the dialog.',
        },
        onClose: {
            control: false,
            description: 'Invoked when the overlay/backdrop is clicked.',
        },
        children: {
            control: false,
            table: { disable: true },
        },
    },
    args: {
        show: false,
        children: null,
    },
};
exports.default = meta;
const DemoWrapper = (props) => {
    const [open, setOpen] = (0, react_1.useState)(props.show);
    (0, react_1.useEffect)(() => {
        setOpen(props.show);
    }, [props.show]);
    return (<div className="relative h-[480px] w-full overflow-hidden bg-gray-100">
      <div className="flex h-full items-center justify-center">
        <button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
          Open dialog
        </button>
      </div>

      <_1.default {...props} show={open} onClose={() => {
            props.onClose?.();
            setOpen(false);
        }}>
        <div className="flex h-full flex-col space-y-4 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Plan summary</h2>
          <p className="text-sm text-gray-600">
            Use this area to present rich content for the selected run, configuration details, or
            any supporting context.
          </p>
          <div className="flex-1 overflow-y-auto rounded-md border border-dashed border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
            Scrollable placeholder content. Add domain-specific information, activity logs, or
            editors in the real application.
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700">
              Apply changes
            </button>
          </div>
        </div>
      </_1.default>
    </div>);
};
exports.Default = {
    args: {
        children: null,
    },
    render: args => <DemoWrapper {...args}/>,
};
exports.NarrowPanel = {
    render: args => <DemoWrapper {...args}/>,
    args: {
        className: 'max-w-[420px]',
        children: null,
    },
    parameters: {
        docs: {
            description: {
                story: 'Applies a custom width class to show the dialog as a narrower information panel.',
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUEyQztBQUMzQyx3QkFBNkI7QUFJN0IsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsNkJBQTZCO0lBQ3BDLFNBQVMsRUFBRSxVQUFhO0lBQ3hCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUscUhBQXFIO2FBQ2pJO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSw0REFBNEQ7U0FDMUU7UUFDRCxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsb0NBQW9DO1NBQ2xEO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQUUsK0NBQStDO1NBQzdEO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLEtBQUs7WUFDZCxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO1NBQ3pCO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7Q0FDbUMsQ0FBQTtBQUV0QyxrQkFBZSxJQUFJLENBQUE7QUFHbkIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtJQUNuQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFNUMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDckIsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFFaEIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1REFBdUQsQ0FDcEU7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQ3REO1FBQUEsQ0FBQyxNQUFNLENBQ0wsU0FBUyxDQUFDLG1HQUFtRyxDQUM3RyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FFN0I7O1FBQ0YsRUFBRSxNQUFNLENBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FFTDs7TUFBQSxDQUFDLFVBQWEsQ0FDWixJQUFJLEtBQUssQ0FBQyxDQUNWLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNYLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRTtZQUNaLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFBO1lBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNoQixDQUFDLENBQUMsQ0FFRjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2Q0FBNkMsQ0FDMUQ7VUFBQSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMscUNBQXFDLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FDcEU7VUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQ2xDOzs7VUFFRixFQUFFLENBQUMsQ0FDSDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2R0FBNkcsQ0FDMUg7OztVQUVGLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUMxQztZQUFBLENBQUMsTUFBTSxDQUNMLFNBQVMsQ0FBQyxzRkFBc0YsQ0FDaEcsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBRTlCOztZQUNGLEVBQUUsTUFBTSxDQUNSO1lBQUEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLCtFQUErRSxDQUMvRjs7WUFDRixFQUFFLE1BQU0sQ0FDVjtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLFVBQWEsQ0FDakI7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLE9BQU8sR0FBVTtJQUM1QixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsSUFBSTtLQUNmO0lBQ0QsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztDQUMxQyxDQUFBO0FBRVksUUFBQSxXQUFXLEdBQVU7SUFDaEMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztJQUN6QyxJQUFJLEVBQUU7UUFDSixTQUFTLEVBQUUsZUFBZTtRQUMxQixRQUFRLEVBQUUsSUFBSTtLQUNmO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLEtBQUssRUFBRSxrRkFBa0Y7YUFDMUY7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBDb250ZW50RGlhbG9nIGZyb20gJy4nXG5cbnR5cGUgUHJvcHMgPSBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgQ29udGVudERpYWxvZz5cblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0ZlZWRiYWNrL0NvbnRlbnREaWFsb2cnLFxuICBjb21wb25lbnQ6IENvbnRlbnREaWFsb2csXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdmdWxsc2NyZWVuJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdTbGlkaW5nIHBhbmVsIG92ZXJsYXkgdXNlZCBpbiB0aGUgYXBwIGRldGFpbCB2aWV3LiBJbmNsdWRlcyBkaW1tZWQgYmFja2Ryb3AgYW5kIGFuaW1hdGVkIGVudHJhbmNlL2V4aXQgdHJhbnNpdGlvbnMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdUeXBlczoge1xuICAgIGNsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdBZGRpdGlvbmFsIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgc2xpZGluZyBwYW5lbCBjb250YWluZXIuJyxcbiAgICB9LFxuICAgIHNob3c6IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ29udHJvbHMgdmlzaWJpbGl0eSBvZiB0aGUgZGlhbG9nLicsXG4gICAgfSxcbiAgICBvbkNsb3NlOiB7XG4gICAgICBjb250cm9sOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSW52b2tlZCB3aGVuIHRoZSBvdmVybGF5L2JhY2tkcm9wIGlzIGNsaWNrZWQuJyxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBjb250cm9sOiBmYWxzZSxcbiAgICAgIHRhYmxlOiB7IGRpc2FibGU6IHRydWUgfSxcbiAgICB9LFxuICB9LFxuICBhcmdzOiB7XG4gICAgc2hvdzogZmFsc2UsXG4gICAgY2hpbGRyZW46IG51bGwsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBDb250ZW50RGlhbG9nPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmNvbnN0IERlbW9XcmFwcGVyID0gKHByb3BzOiBQcm9wcykgPT4ge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShwcm9wcy5zaG93KVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0T3Blbihwcm9wcy5zaG93KVxuICB9LCBbcHJvcHMuc2hvd10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGgtWzQ4MHB4XSB3LWZ1bGwgb3ZlcmZsb3ctaGlkZGVuIGJnLWdyYXktMTAwXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1mdWxsIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBiZy1wcmltYXJ5LTYwMCBweC00IHB5LTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LXdoaXRlIHNoYWRvdy1zbSBob3ZlcjpiZy1wcmltYXJ5LTcwMFwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3Blbih0cnVlKX1cbiAgICAgICAgPlxuICAgICAgICAgIE9wZW4gZGlhbG9nXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxDb250ZW50RGlhbG9nXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgc2hvdz17b3Blbn1cbiAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgIHByb3BzLm9uQ2xvc2U/LigpXG4gICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtZnVsbCBmbGV4LWNvbCBzcGFjZS15LTQgYmctd2hpdGUgcC02XCI+XG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktOTAwXCI+UGxhbiBzdW1tYXJ5PC9oMj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS02MDBcIj5cbiAgICAgICAgICAgIFVzZSB0aGlzIGFyZWEgdG8gcHJlc2VudCByaWNoIGNvbnRlbnQgZm9yIHRoZSBzZWxlY3RlZCBydW4sIGNvbmZpZ3VyYXRpb24gZGV0YWlscywgb3JcbiAgICAgICAgICAgIGFueSBzdXBwb3J0aW5nIGNvbnRleHQuXG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG92ZXJmbG93LXktYXV0byByb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1ncmF5LTIwMCBiZy1ncmF5LTUwIHAtNCB0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgIFNjcm9sbGFibGUgcGxhY2Vob2xkZXIgY29udGVudC4gQWRkIGRvbWFpbi1zcGVjaWZpYyBpbmZvcm1hdGlvbiwgYWN0aXZpdHkgbG9ncywgb3JcbiAgICAgICAgICAgIGVkaXRvcnMgaW4gdGhlIHJlYWwgYXBwbGljYXRpb24uXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktZW5kIGdhcC0yIHB0LTRcIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWdyYXktMzAwIHB4LTMgcHktMS41IHRleHQtc20gdGV4dC1ncmF5LTYwMCBob3ZlcjpiZy1ncmF5LTUwXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3BlbihmYWxzZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctcHJpbWFyeS02MDAgcHgtMyBweS0xLjUgdGV4dC1zbSB0ZXh0LXdoaXRlIGhvdmVyOmJnLXByaW1hcnktNzAwXCI+XG4gICAgICAgICAgICAgIEFwcGx5IGNoYW5nZXNcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQ29udGVudERpYWxvZz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICBjaGlsZHJlbjogbnVsbCxcbiAgfSxcbiAgcmVuZGVyOiBhcmdzID0+IDxEZW1vV3JhcHBlciB7Li4uYXJnc30gLz4sXG59XG5cbmV4cG9ydCBjb25zdCBOYXJyb3dQYW5lbDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8RGVtb1dyYXBwZXIgey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgY2xhc3NOYW1lOiAnbWF4LXctWzQyMHB4XScsXG4gICAgY2hpbGRyZW46IG51bGwsXG4gIH0sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBzdG9yeTogJ0FwcGxpZXMgYSBjdXN0b20gd2lkdGggY2xhc3MgdG8gc2hvdyB0aGUgZGlhbG9nIGFzIGEgbmFycm93ZXIgaW5mb3JtYXRpb24gcGFuZWwuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==