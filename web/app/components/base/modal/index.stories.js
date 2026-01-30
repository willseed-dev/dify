"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighPriorityOverflow = exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/Modal',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Lightweight modal wrapper with optional header/description, close icon, and high-priority stacking for dropdown overlays.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Extra classes applied to the modal panel.',
        },
        wrapperClassName: {
            control: 'text',
            description: 'Additional wrapper classes for the dialog.',
        },
        isShow: {
            control: 'boolean',
            description: 'Controls whether the modal is visible.',
        },
        title: {
            control: 'text',
            description: 'Heading displayed at the top of the modal.',
        },
        description: {
            control: 'text',
            description: 'Secondary text beneath the title.',
        },
        closable: {
            control: 'boolean',
            description: 'Whether the close icon should be shown.',
        },
        overflowVisible: {
            control: 'boolean',
            description: 'Allows content to overflow the modal panel.',
        },
        highPriority: {
            control: 'boolean',
            description: 'Lifts the modal above other high z-index elements like dropdowns.',
        },
        onClose: {
            control: false,
            description: 'Callback invoked when the modal requests to close.',
        },
    },
    args: {
        isShow: false,
        title: 'Create new API key',
        description: 'Generate a scoped key for this workspace. You can revoke it at any time.',
        closable: true,
    },
};
exports.default = meta;
const ModalDemo = (props) => {
    const [open, setOpen] = (0, react_1.useState)(props.isShow);
    (0, react_1.useEffect)(() => {
        setOpen(props.isShow);
    }, [props.isShow]);
    return (<div className="relative flex h-[480px] items-center justify-center bg-gray-100">
      <button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
        Show modal
      </button>

      <_1.default {...props} isShow={open} onClose={() => {
            props.onClose?.();
            setOpen(false);
        }}>
        <div className="mt-6 space-y-4 text-sm text-gray-600">
          <p>
            Provide a descriptive name for this key so collaborators know its purpose. Restrict usage with scopes to limit access.
          </p>
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
            Form fields and validation messaging would appear here. This placeholder keeps the story lightweight.
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button className="rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700">
            Create key
          </button>
        </div>
      </_1.default>
    </div>);
};
exports.Default = {
    render: args => <ModalDemo {...args}/>,
};
exports.HighPriorityOverflow = {
    render: args => <ModalDemo {...args}/>,
    args: {
        highPriority: true,
        overflowVisible: true,
        description: 'Demonstrates the modal configured to sit above dropdowns while letting the body content overflow.',
        className: 'max-w-[540px]',
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the modal with `highPriority` and `overflowVisible` enabled, useful when nested within complex surfaces.',
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUEyQztBQUMzQyx3QkFBcUI7QUFFckIsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUscUJBQXFCO0lBQzVCLFNBQVMsRUFBRSxVQUFLO0lBQ2hCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsMkhBQTJIO2FBQ3ZJO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSwyQ0FBMkM7U0FDekQ7UUFDRCxnQkFBZ0IsRUFBRTtZQUNoQixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSw0Q0FBNEM7U0FDMUQ7UUFDRCxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsd0NBQXdDO1NBQ3REO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsNENBQTRDO1NBQzFEO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsbUNBQW1DO1NBQ2pEO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLHlDQUF5QztTQUN2RDtRQUNELGVBQWUsRUFBRTtZQUNmLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSw2Q0FBNkM7U0FDM0Q7UUFDRCxZQUFZLEVBQUU7WUFDWixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsbUVBQW1FO1NBQ2pGO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQUUsb0RBQW9EO1NBQ2xFO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsS0FBSztRQUNiLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsV0FBVyxFQUFFLDBFQUEwRTtRQUN2RixRQUFRLEVBQUUsSUFBSTtLQUNmO0NBQzJCLENBQUE7QUFFOUIsa0JBQWUsSUFBSSxDQUFBO0FBR25CLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBeUMsRUFBRSxFQUFFO0lBQzlELE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUU5QyxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN2QixDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUVsQixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlFQUFpRSxDQUM5RTtNQUFBLENBQUMsTUFBTSxDQUNMLFNBQVMsQ0FBQyxtR0FBbUcsQ0FDN0csT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBRTdCOztNQUNGLEVBQUUsTUFBTSxDQUVSOztNQUFBLENBQUMsVUFBSyxDQUNKLElBQUksS0FBSyxDQUFDLENBQ1YsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2IsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ1osS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUE7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2hCLENBQUMsQ0FBQyxDQUVGO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUNuRDtVQUFBLENBQUMsQ0FBQyxDQUNBOztVQUNGLEVBQUUsQ0FBQyxDQUNIO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNGQUFzRixDQUNuRzs7VUFDRixFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUMxQztVQUFBLENBQUMsTUFBTSxDQUNMLFNBQVMsQ0FBQyxzRkFBc0YsQ0FDaEcsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBRTlCOztVQUNGLEVBQUUsTUFBTSxDQUNSO1VBQUEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLCtFQUErRSxDQUMvRjs7VUFDRixFQUFFLE1BQU0sQ0FDVjtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxVQUFLLENBQ1Q7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLE9BQU8sR0FBVTtJQUM1QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0NBQ3hDLENBQUE7QUFFWSxRQUFBLG9CQUFvQixHQUFVO0lBQ3pDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUc7SUFDdkMsSUFBSSxFQUFFO1FBQ0osWUFBWSxFQUFFLElBQUk7UUFDbEIsZUFBZSxFQUFFLElBQUk7UUFDckIsV0FBVyxFQUFFLG1HQUFtRztRQUNoSCxTQUFTLEVBQUUsZUFBZTtLQUMzQjtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxLQUFLLEVBQUUsZ0hBQWdIO2FBQ3hIO1NBQ0Y7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgTW9kYWwgZnJvbSAnLidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0ZlZWRiYWNrL01vZGFsJyxcbiAgY29tcG9uZW50OiBNb2RhbCxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2Z1bGxzY3JlZW4nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0xpZ2h0d2VpZ2h0IG1vZGFsIHdyYXBwZXIgd2l0aCBvcHRpb25hbCBoZWFkZXIvZGVzY3JpcHRpb24sIGNsb3NlIGljb24sIGFuZCBoaWdoLXByaW9yaXR5IHN0YWNraW5nIGZvciBkcm9wZG93biBvdmVybGF5cy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ1R5cGVzOiB7XG4gICAgY2xhc3NOYW1lOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4dHJhIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgbW9kYWwgcGFuZWwuJyxcbiAgICB9LFxuICAgIHdyYXBwZXJDbGFzc05hbWU6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWRkaXRpb25hbCB3cmFwcGVyIGNsYXNzZXMgZm9yIHRoZSBkaWFsb2cuJyxcbiAgICB9LFxuICAgIGlzU2hvdzoge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdDb250cm9scyB3aGV0aGVyIHRoZSBtb2RhbCBpcyB2aXNpYmxlLicsXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdIZWFkaW5nIGRpc3BsYXllZCBhdCB0aGUgdG9wIG9mIHRoZSBtb2RhbC4nLFxuICAgIH0sXG4gICAgZGVzY3JpcHRpb246IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2Vjb25kYXJ5IHRleHQgYmVuZWF0aCB0aGUgdGl0bGUuJyxcbiAgICB9LFxuICAgIGNsb3NhYmxlOiB7XG4gICAgICBjb250cm9sOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdGhlIGNsb3NlIGljb24gc2hvdWxkIGJlIHNob3duLicsXG4gICAgfSxcbiAgICBvdmVyZmxvd1Zpc2libGU6IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWxsb3dzIGNvbnRlbnQgdG8gb3ZlcmZsb3cgdGhlIG1vZGFsIHBhbmVsLicsXG4gICAgfSxcbiAgICBoaWdoUHJpb3JpdHk6IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGlmdHMgdGhlIG1vZGFsIGFib3ZlIG90aGVyIGhpZ2ggei1pbmRleCBlbGVtZW50cyBsaWtlIGRyb3Bkb3ducy4nLFxuICAgIH0sXG4gICAgb25DbG9zZToge1xuICAgICAgY29udHJvbDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NhbGxiYWNrIGludm9rZWQgd2hlbiB0aGUgbW9kYWwgcmVxdWVzdHMgdG8gY2xvc2UuJyxcbiAgICB9LFxuICB9LFxuICBhcmdzOiB7XG4gICAgaXNTaG93OiBmYWxzZSxcbiAgICB0aXRsZTogJ0NyZWF0ZSBuZXcgQVBJIGtleScsXG4gICAgZGVzY3JpcHRpb246ICdHZW5lcmF0ZSBhIHNjb3BlZCBrZXkgZm9yIHRoaXMgd29ya3NwYWNlLiBZb3UgY2FuIHJldm9rZSBpdCBhdCBhbnkgdGltZS4nLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICB9LFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgTW9kYWw+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuY29uc3QgTW9kYWxEZW1vID0gKHByb3BzOiBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgTW9kYWw+KSA9PiB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKHByb3BzLmlzU2hvdylcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldE9wZW4ocHJvcHMuaXNTaG93KVxuICB9LCBbcHJvcHMuaXNTaG93XSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBoLVs0ODBweF0gaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWdyYXktMTAwXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctcHJpbWFyeS02MDAgcHgtNCBweS0yIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC13aGl0ZSBzaGFkb3ctc20gaG92ZXI6YmctcHJpbWFyeS03MDBcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfVxuICAgICAgPlxuICAgICAgICBTaG93IG1vZGFsXG4gICAgICA8L2J1dHRvbj5cblxuICAgICAgPE1vZGFsXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgaXNTaG93PXtvcGVufVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgcHJvcHMub25DbG9zZT8uKClcbiAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTYgc3BhY2UteS00IHRleHQtc20gdGV4dC1ncmF5LTYwMFwiPlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgUHJvdmlkZSBhIGRlc2NyaXB0aXZlIG5hbWUgZm9yIHRoaXMga2V5IHNvIGNvbGxhYm9yYXRvcnMga25vdyBpdHMgcHVycG9zZS4gUmVzdHJpY3QgdXNhZ2Ugd2l0aCBzY29wZXMgdG8gbGltaXQgYWNjZXNzLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kYXNoZWQgYm9yZGVyLWdyYXktMjAwIGJnLWdyYXktNTAgcC00IHRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgICAgRm9ybSBmaWVsZHMgYW5kIHZhbGlkYXRpb24gbWVzc2FnaW5nIHdvdWxkIGFwcGVhciBoZXJlLiBUaGlzIHBsYWNlaG9sZGVyIGtlZXBzIHRoZSBzdG9yeSBsaWdodHdlaWdodC5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtOCBmbGV4IGp1c3RpZnktZW5kIGdhcC0zXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWdyYXktMzAwIHB4LTMgcHktMS41IHRleHQtc20gdGV4dC1ncmF5LTYwMCBob3ZlcjpiZy1ncmF5LTUwXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oZmFsc2UpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicm91bmRlZC1tZCBiZy1wcmltYXJ5LTYwMCBweC0zIHB5LTEuNSB0ZXh0LXNtIHRleHQtd2hpdGUgaG92ZXI6YmctcHJpbWFyeS03MDBcIj5cbiAgICAgICAgICAgIENyZWF0ZSBrZXlcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L01vZGFsPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxNb2RhbERlbW8gey4uLmFyZ3N9IC8+LFxufVxuXG5leHBvcnQgY29uc3QgSGlnaFByaW9yaXR5T3ZlcmZsb3c6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPE1vZGFsRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBoaWdoUHJpb3JpdHk6IHRydWUsXG4gICAgb3ZlcmZsb3dWaXNpYmxlOiB0cnVlLFxuICAgIGRlc2NyaXB0aW9uOiAnRGVtb25zdHJhdGVzIHRoZSBtb2RhbCBjb25maWd1cmVkIHRvIHNpdCBhYm92ZSBkcm9wZG93bnMgd2hpbGUgbGV0dGluZyB0aGUgYm9keSBjb250ZW50IG92ZXJmbG93LicsXG4gICAgY2xhc3NOYW1lOiAnbWF4LXctWzU0MHB4XScsXG4gIH0sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBzdG9yeTogJ1Nob3dzIHRoZSBtb2RhbCB3aXRoIGBoaWdoUHJpb3JpdHlgIGFuZCBgb3ZlcmZsb3dWaXNpYmxlYCBlbmFibGVkLCB1c2VmdWwgd2hlbiBuZXN0ZWQgd2l0aGluIGNvbXBsZXggc3VyZmFjZXMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==