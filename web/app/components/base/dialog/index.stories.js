"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomStyling = exports.WithoutFooter = exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/Dialog',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Modal dialog built on Headless UI. Provides animated overlay, title slot, and optional footer region.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional classes applied to the panel.',
        },
        titleClassName: {
            control: 'text',
            description: 'Extra classes for the title element.',
        },
        bodyClassName: {
            control: 'text',
            description: 'Extra classes for the content area.',
        },
        footerClassName: {
            control: 'text',
            description: 'Extra classes for the footer container.',
        },
        title: {
            control: 'text',
            description: 'Dialog title.',
        },
        show: {
            control: 'boolean',
            description: 'Controls visibility of the dialog.',
        },
        onClose: {
            control: false,
            description: 'Called when the dialog backdrop or close handler fires.',
        },
    },
    args: {
        title: 'Manage API Keys',
        show: false,
        children: null,
    },
};
exports.default = meta;
const DialogDemo = (props) => {
    const [open, setOpen] = (0, react_1.useState)(props.show);
    (0, react_1.useEffect)(() => {
        setOpen(props.show);
    }, [props.show]);
    return (<div className="relative flex h-[480px] items-center justify-center bg-gray-100">
      <button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
        Show dialog
      </button>

      <_1.default {...props} show={open} onClose={() => {
            props.onClose?.();
            setOpen(false);
        }}>
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            Centralize API key management for collaborators. You can revoke, rotate, or generate new keys directly from this dialog.
          </p>
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
            This placeholder area represents a form or table that would live inside the dialog body.
          </div>
        </div>
      </_1.default>
    </div>);
};
exports.Default = {
    render: args => <DialogDemo {...args}/>,
    args: {
        footer: (<>
        <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button className="rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700">
          Save changes
        </button>
      </>),
    },
};
exports.WithoutFooter = {
    render: args => <DialogDemo {...args}/>,
    args: {
        footer: undefined,
        title: 'Read-only summary',
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates the dialog when no footer actions are provided.',
            },
        },
    },
};
exports.CustomStyling = {
    render: args => <DialogDemo {...args}/>,
    args: {
        className: 'max-w-[560px] bg-white/95 backdrop-blur',
        bodyClassName: 'bg-gray-50 rounded-xl p-5',
        footerClassName: 'justify-between px-4 pb-4 pt-4',
        titleClassName: 'text-lg text-primary-600',
        footer: (<>
        <span className="text-xs text-gray-400">Last synced 2 minutes ago</span>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            Close
          </button>
          <button className="rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700">
            Refresh data
          </button>
        </div>
      </>),
    },
    parameters: {
        docs: {
            description: {
                story: 'Applies custom classes to the panel, body, title, and footer to match different surfaces.',
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUEyQztBQUMzQyx3QkFBc0I7QUFFdEIsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsc0JBQXNCO0lBQzdCLFNBQVMsRUFBRSxVQUFNO0lBQ2pCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsdUdBQXVHO2FBQ25IO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSwwQ0FBMEM7U0FDeEQ7UUFDRCxjQUFjLEVBQUU7WUFDZCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxzQ0FBc0M7U0FDcEQ7UUFDRCxhQUFhLEVBQUU7WUFDYixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxxQ0FBcUM7U0FDbkQ7UUFDRCxlQUFlLEVBQUU7WUFDZixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSx5Q0FBeUM7U0FDdkQ7UUFDRCxLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxlQUFlO1NBQzdCO1FBQ0QsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLG9DQUFvQztTQUNsRDtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRSxLQUFLO1lBQ2QsV0FBVyxFQUFFLHlEQUF5RDtTQUN2RTtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osS0FBSyxFQUFFLGlCQUFpQjtRQUN4QixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7Q0FDNEIsQ0FBQTtBQUUvQixr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LE1BQU0sQ0FBQyxTQUFTLENBQUMsK0VBQStFLENBQy9GOztVQUNGLEVBQUUsTUFBTSxDQUNWO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxHQUFHLENBQ0o7S0FDRjtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxLQUFLLEVBQUUsMkZBQTJGO2FBQ25HO1NBQ0Y7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9EaWFsb2cnLFxuICBjb21wb25lbnQ6IERpYWxvZyxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2Z1bGxzY3JlZW4nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ01vZGFsIGRpYWxvZyBidWlsdCBvbiBIZWFkbGVzcyBVSS4gUHJvdmlkZXMgYW5pbWF0ZWQgb3ZlcmxheSwgdGl0bGUgc2xvdCwgYW5kIG9wdGlvbmFsIGZvb3RlciByZWdpb24uJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdUeXBlczoge1xuICAgIGNsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdBZGRpdGlvbmFsIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgcGFuZWwuJyxcbiAgICB9LFxuICAgIHRpdGxlQ2xhc3NOYW1lOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4dHJhIGNsYXNzZXMgZm9yIHRoZSB0aXRsZSBlbGVtZW50LicsXG4gICAgfSxcbiAgICBib2R5Q2xhc3NOYW1lOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4dHJhIGNsYXNzZXMgZm9yIHRoZSBjb250ZW50IGFyZWEuJyxcbiAgICB9LFxuICAgIGZvb3RlckNsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdFeHRyYSBjbGFzc2VzIGZvciB0aGUgZm9vdGVyIGNvbnRhaW5lci4nLFxuICAgIH0sXG4gICAgdGl0bGU6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlhbG9nIHRpdGxlLicsXG4gICAgfSxcbiAgICBzaG93OiB7XG4gICAgICBjb250cm9sOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NvbnRyb2xzIHZpc2liaWxpdHkgb2YgdGhlIGRpYWxvZy4nLFxuICAgIH0sXG4gICAgb25DbG9zZToge1xuICAgICAgY29udHJvbDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NhbGxlZCB3aGVuIHRoZSBkaWFsb2cgYmFja2Ryb3Agb3IgY2xvc2UgaGFuZGxlciBmaXJlcy4nLFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICB0aXRsZTogJ01hbmFnZSBBUEkgS2V5cycsXG4gICAgc2hvdzogZmFsc2UsXG4gICAgY2hpbGRyZW46IG51bGwsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBEaWFsb2c+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuY29uc3QgRGlhbG9nRGVtbyA9IChwcm9wczogUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIERpYWxvZz4pID0+IHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUocHJvcHMuc2hvdylcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRPcGVuKHByb3BzLnNob3cpXG4gIH0sIFtwcm9wcy5zaG93XSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBoLVs0ODBweF0gaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWdyYXktMTAwXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctcHJpbWFyeS02MDAgcHgtNCBweS0yIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC13aGl0ZSBzaGFkb3ctc20gaG92ZXI6YmctcHJpbWFyeS03MDBcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfVxuICAgICAgPlxuICAgICAgICBTaG93IGRpYWxvZ1xuICAgICAgPC9idXR0b24+XG5cbiAgICAgIDxEaWFsb2dcbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgICBzaG93PXtvcGVufVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgcHJvcHMub25DbG9zZT8uKClcbiAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCB0ZXh0LXNtIHRleHQtZ3JheS02MDBcIj5cbiAgICAgICAgICA8cD5cbiAgICAgICAgICAgIENlbnRyYWxpemUgQVBJIGtleSBtYW5hZ2VtZW50IGZvciBjb2xsYWJvcmF0b3JzLiBZb3UgY2FuIHJldm9rZSwgcm90YXRlLCBvciBnZW5lcmF0ZSBuZXcga2V5cyBkaXJlY3RseSBmcm9tIHRoaXMgZGlhbG9nLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kYXNoZWQgYm9yZGVyLWdyYXktMjAwIGJnLWdyYXktNTAgcC00IHRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgICAgVGhpcyBwbGFjZWhvbGRlciBhcmVhIHJlcHJlc2VudHMgYSBmb3JtIG9yIHRhYmxlIHRoYXQgd291bGQgbGl2ZSBpbnNpZGUgdGhlIGRpYWxvZyBib2R5LlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRGlhbG9nPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxEaWFsb2dEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIGZvb3RlcjogKFxuICAgICAgPD5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcHgtMyBweS0xLjUgdGV4dC1zbSB0ZXh0LWdyYXktNjAwIGhvdmVyOmJnLWdyYXktNTBcIj5cbiAgICAgICAgICBDYW5jZWxcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicm91bmRlZC1tZCBiZy1wcmltYXJ5LTYwMCBweC0zIHB5LTEuNSB0ZXh0LXNtIHRleHQtd2hpdGUgaG92ZXI6YmctcHJpbWFyeS03MDBcIj5cbiAgICAgICAgICBTYXZlIGNoYW5nZXNcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8Lz5cbiAgICApLFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgV2l0aG91dEZvb3RlcjogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8RGlhbG9nRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBmb290ZXI6IHVuZGVmaW5lZCxcbiAgICB0aXRsZTogJ1JlYWQtb25seSBzdW1tYXJ5JyxcbiAgfSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIHN0b3J5OiAnRGVtb25zdHJhdGVzIHRoZSBkaWFsb2cgd2hlbiBubyBmb290ZXIgYWN0aW9ucyBhcmUgcHJvdmlkZWQuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEN1c3RvbVN0eWxpbmc6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPERpYWxvZ0RlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgY2xhc3NOYW1lOiAnbWF4LXctWzU2MHB4XSBiZy13aGl0ZS85NSBiYWNrZHJvcC1ibHVyJyxcbiAgICBib2R5Q2xhc3NOYW1lOiAnYmctZ3JheS01MCByb3VuZGVkLXhsIHAtNScsXG4gICAgZm9vdGVyQ2xhc3NOYW1lOiAnanVzdGlmeS1iZXR3ZWVuIHB4LTQgcGItNCBwdC00JyxcbiAgICB0aXRsZUNsYXNzTmFtZTogJ3RleHQtbGcgdGV4dC1wcmltYXJ5LTYwMCcsXG4gICAgZm9vdGVyOiAoXG4gICAgICA8PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS00MDBcIj5MYXN0IHN5bmNlZCAyIG1pbnV0ZXMgYWdvPC9zcGFuPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBweC0zIHB5LTEuNSB0ZXh0LXNtIHRleHQtZ3JheS02MDAgaG92ZXI6YmctZ3JheS01MFwiPlxuICAgICAgICAgICAgQ2xvc2VcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctcHJpbWFyeS02MDAgcHgtMyBweS0xLjUgdGV4dC1zbSB0ZXh0LXdoaXRlIGhvdmVyOmJnLXByaW1hcnktNzAwXCI+XG4gICAgICAgICAgICBSZWZyZXNoIGRhdGFcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8Lz5cbiAgICApLFxuICB9LFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgc3Rvcnk6ICdBcHBsaWVzIGN1c3RvbSBjbGFzc2VzIHRvIHRoZSBwYW5lbCwgYm9keSwgdGl0bGUsIGFuZCBmb290ZXIgdG8gbWF0Y2ggZGlmZmVyZW50IHN1cmZhY2VzLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59XG4iXX0=