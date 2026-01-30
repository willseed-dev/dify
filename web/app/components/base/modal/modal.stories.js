"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumSized = exports.WithExtraAction = exports.Default = void 0;
const react_1 = require("react");
const modal_1 = require("./modal");
const meta = {
    title: 'Base/Feedback/RichModal',
    component: modal_1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Full-featured modal with header, subtitle, customizable footer buttons, and optional extra action.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'md'],
            description: 'Defines the panel width.',
        },
        title: {
            control: 'text',
            description: 'Primary heading text.',
        },
        subTitle: {
            control: 'text',
            description: 'Secondary text below the title.',
        },
        confirmButtonText: {
            control: 'text',
            description: 'Label for the confirm button.',
        },
        cancelButtonText: {
            control: 'text',
            description: 'Label for the cancel button.',
        },
        showExtraButton: {
            control: 'boolean',
            description: 'Whether to render the extra button.',
        },
        extraButtonText: {
            control: 'text',
            description: 'Label for the extra button.',
        },
        extraButtonVariant: {
            control: 'select',
            options: ['primary', 'warning', 'secondary', 'secondary-accent', 'ghost', 'ghost-accent', 'tertiary'],
            description: 'Visual style for the extra button.',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables footer actions when true.',
        },
        footerSlot: {
            control: false,
        },
        bottomSlot: {
            control: false,
        },
        onClose: {
            control: false,
            description: 'Handler fired when the close icon or backdrop is clicked.',
        },
        onConfirm: {
            control: false,
            description: 'Handler fired when confirm is pressed.',
        },
        onCancel: {
            control: false,
            description: 'Handler fired when cancel is pressed.',
        },
        onExtraButtonClick: {
            control: false,
            description: 'Handler fired when the extra button is pressed.',
        },
        children: {
            control: false,
        },
    },
    args: {
        size: 'sm',
        title: 'Delete integration',
        subTitle: 'Disabling this integration will revoke access tokens and webhooks.',
        confirmButtonText: 'Delete integration',
        cancelButtonText: 'Cancel',
        showExtraButton: false,
        extraButtonText: 'Disable temporarily',
        extraButtonVariant: 'warning',
        disabled: false,
        onClose: () => console.log('Modal closed'),
        onConfirm: () => console.log('Confirm pressed'),
        onCancel: () => console.log('Cancel pressed'),
        onExtraButtonClick: () => console.log('Extra button pressed'),
    },
};
exports.default = meta;
const ModalDemo = (props) => {
    const [open, setOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (props.disabled && open)
            setOpen(false);
    }, [props.disabled, open]);
    const { onClose, onConfirm, onCancel, onExtraButtonClick, children, ...rest } = props;
    const handleClose = () => {
        onClose?.();
        setOpen(false);
    };
    const handleConfirm = () => {
        onConfirm?.();
        setOpen(false);
    };
    const handleCancel = () => {
        onCancel?.();
        setOpen(false);
    };
    const handleExtra = () => {
        onExtraButtonClick?.();
    };
    return (<div className="relative flex h-[480px] items-center justify-center bg-gray-100">
      <button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
        Show rich modal
      </button>

      {open && (<modal_1.default {...rest} onClose={handleClose} onConfirm={handleConfirm} onCancel={handleCancel} onExtraButtonClick={handleExtra} children={children ?? (<div className="space-y-4 text-sm text-gray-600">
              <p>
                Removing integrations immediately stops workflow automations related to this connection.
                Make sure no scheduled jobs depend on this integration before proceeding.
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs text-gray-500">
                <li>All API credentials issued by this integration will be revoked.</li>
                <li>Historical logs remain accessible for auditing.</li>
                <li>You can re-enable the integration later with fresh credentials.</li>
              </ul>
            </div>)}/>)}
    </div>);
};
exports.Default = {
    render: args => <ModalDemo {...args}/>,
};
exports.WithExtraAction = {
    render: args => <ModalDemo {...args}/>,
    args: {
        showExtraButton: true,
        extraButtonVariant: 'secondary',
        extraButtonText: 'Disable only',
        footerSlot: (<span className="text-xs text-gray-400">Last synced 5 minutes ago</span>),
    },
    parameters: {
        docs: {
            description: {
                story: 'Illustrates the optional extra button and footer slot for advanced workflows.',
            },
        },
    },
};
exports.MediumSized = {
    render: args => <ModalDemo {...args}/>,
    args: {
        size: 'md',
        subTitle: 'Use the larger width to surface forms with more fields or supporting descriptions.',
        bottomSlot: (<div className="border-t border-divider-subtle bg-components-panel-bg px-6 py-4 text-xs text-gray-500">
        Need finer control? Configure automation rules in the integration settings page.
      </div>),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the medium sized panel and a populated `bottomSlot` for supplemental messaging.',
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vZGFsLnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUEyQztBQUMzQyxtQ0FBMkI7QUFFM0IsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUseUJBQXlCO0lBQ2hDLFNBQVMsRUFBRSxlQUFLO0lBQ2hCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsb0dBQW9HO2FBQ2hIO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1lBQ3JCLFdBQVcsRUFBRSwwQkFBMEI7U0FDeEM7UUFDRCxLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSx1QkFBdUI7U0FDckM7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxpQ0FBaUM7U0FDL0M7UUFDRCxpQkFBaUIsRUFBRTtZQUNqQixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSwrQkFBK0I7U0FDN0M7UUFDRCxnQkFBZ0IsRUFBRTtZQUNoQixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSw4QkFBOEI7U0FDNUM7UUFDRCxlQUFlLEVBQUU7WUFDZixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUscUNBQXFDO1NBQ25EO1FBQ0QsZUFBZSxFQUFFO1lBQ2YsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsNkJBQTZCO1NBQzNDO1FBQ0Qsa0JBQWtCLEVBQUU7WUFDbEIsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLENB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RUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUc7SUFDdkMsSUFBSSxFQUFFO1FBQ0osZUFBZSxFQUFFLElBQUk7UUFDckIsa0JBQWtCLEVBQUUsV0FBVztRQUMvQixlQUFlLEVBQUUsY0FBYztRQUMvQixVQUFVLEVBQUUsQ0FDVixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLENBQ3pFO0tBQ0Y7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsS0FBSyxFQUFFLCtFQUErRTthQUN2RjtTQUNGO0tBQ0Y7Q0FDRixDQUFBO0FBRVksUUFBQSxXQUFXLEdBQVU7SUFDaEMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztJQUN2QyxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsSUFBSTtRQUNWLFFBQVEsRUFBRSxvRkFBb0Y7UUFDOUYsVUFBVSxFQUFFLENBQ1YsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHVGQUF1RixDQUNwRzs7TUFDRixFQUFFLEdBQUcsQ0FBQyxDQUNQO0tBQ0Y7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsS0FBSyxFQUFFLHVGQUF1RjthQUMvRjtTQUNGO0tBQ0Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IE1vZGFsIGZyb20gJy4vbW9kYWwnXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9SaWNoTW9kYWwnLFxuICBjb21wb25lbnQ6IE1vZGFsLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnZnVsbHNjcmVlbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnRnVsbC1mZWF0dXJlZCBtb2RhbCB3aXRoIGhlYWRlciwgc3VidGl0bGUsIGN1c3RvbWl6YWJsZSBmb290ZXIgYnV0dG9ucywgYW5kIG9wdGlvbmFsIGV4dHJhIGFjdGlvbi4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ1R5cGVzOiB7XG4gICAgc2l6ZToge1xuICAgICAgY29udHJvbDogJ3JhZGlvJyxcbiAgICAgIG9wdGlvbnM6IFsnc20nLCAnbWQnXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmaW5lcyB0aGUgcGFuZWwgd2lkdGguJyxcbiAgICB9LFxuICAgIHRpdGxlOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByaW1hcnkgaGVhZGluZyB0ZXh0LicsXG4gICAgfSxcbiAgICBzdWJUaXRsZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdTZWNvbmRhcnkgdGV4dCBiZWxvdyB0aGUgdGl0bGUuJyxcbiAgICB9LFxuICAgIGNvbmZpcm1CdXR0b25UZXh0OiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0xhYmVsIGZvciB0aGUgY29uZmlybSBidXR0b24uJyxcbiAgICB9LFxuICAgIGNhbmNlbEJ1dHRvblRleHQ6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGFiZWwgZm9yIHRoZSBjYW5jZWwgYnV0dG9uLicsXG4gICAgfSxcbiAgICBzaG93RXh0cmFCdXR0b246IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byByZW5kZXIgdGhlIGV4dHJhIGJ1dHRvbi4nLFxuICAgIH0sXG4gICAgZXh0cmFCdXR0b25UZXh0OiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0xhYmVsIGZvciB0aGUgZXh0cmEgYnV0dG9uLicsXG4gICAgfSxcbiAgICBleHRyYUJ1dHRvblZhcmlhbnQ6IHtcbiAgICAgIGNvbnRyb2w6ICdzZWxlY3QnLFxuICAgICAgb3B0aW9uczogWydwcmltYXJ5JywgJ3dhcm5pbmcnLCAnc2Vjb25kYXJ5JywgJ3NlY29uZGFyeS1hY2NlbnQnLCAnZ2hvc3QnLCAnZ2hvc3QtYWNjZW50JywgJ3RlcnRpYXJ5J10sXG4gICAgICBkZXNjcmlwdGlvbjogJ1Zpc3VhbCBzdHlsZSBmb3IgdGhlIGV4dHJhIGJ1dHRvbi4nLFxuICAgIH0sXG4gICAgZGlzYWJsZWQ6IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZXMgZm9vdGVyIGFjdGlvbnMgd2hlbiB0cnVlLicsXG4gICAgfSxcbiAgICBmb290ZXJTbG90OiB7XG4gICAgICBjb250cm9sOiBmYWxzZSxcbiAgICB9LFxuICAgIGJvdHRvbVNsb3Q6IHtcbiAgICAgIGNvbnRyb2w6IGZhbHNlLFxuICAgIH0sXG4gICAgb25DbG9zZToge1xuICAgICAgY29udHJvbDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ0hhbmRsZXIgZmlyZWQgd2hlbiB0aGUgY2xvc2UgaWNvbiBvciBiYWNrZHJvcCBpcyBjbGlja2VkLicsXG4gICAgfSxcbiAgICBvbkNvbmZpcm06IHtcbiAgICAgIGNvbnRyb2w6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdIYW5kbGVyIGZpcmVkIHdoZW4gY29uZmlybSBpcyBwcmVzc2VkLicsXG4gICAgfSxcbiAgICBvbkNhbmNlbDoge1xuICAgICAgY29udHJvbDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ0hhbmRsZXIgZmlyZWQgd2hlbiBjYW5jZWwgaXMgcHJlc3NlZC4nLFxuICAgIH0sXG4gICAgb25FeHRyYUJ1dHRvbkNsaWNrOiB7XG4gICAgICBjb250cm9sOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSGFuZGxlciBmaXJlZCB3aGVuIHRoZSBleHRyYSBidXR0b24gaXMgcHJlc3NlZC4nLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIGNvbnRyb2w6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICBzaXplOiAnc20nLFxuICAgIHRpdGxlOiAnRGVsZXRlIGludGVncmF0aW9uJyxcbiAgICBzdWJUaXRsZTogJ0Rpc2FibGluZyB0aGlzIGludGVncmF0aW9uIHdpbGwgcmV2b2tlIGFjY2VzcyB0b2tlbnMgYW5kIHdlYmhvb2tzLicsXG4gICAgY29uZmlybUJ1dHRvblRleHQ6ICdEZWxldGUgaW50ZWdyYXRpb24nLFxuICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdDYW5jZWwnLFxuICAgIHNob3dFeHRyYUJ1dHRvbjogZmFsc2UsXG4gICAgZXh0cmFCdXR0b25UZXh0OiAnRGlzYWJsZSB0ZW1wb3JhcmlseScsXG4gICAgZXh0cmFCdXR0b25WYXJpYW50OiAnd2FybmluZycsXG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuICAgIG9uQ2xvc2U6ICgpID0+IGNvbnNvbGUubG9nKCdNb2RhbCBjbG9zZWQnKSxcbiAgICBvbkNvbmZpcm06ICgpID0+IGNvbnNvbGUubG9nKCdDb25maXJtIHByZXNzZWQnKSxcbiAgICBvbkNhbmNlbDogKCkgPT4gY29uc29sZS5sb2coJ0NhbmNlbCBwcmVzc2VkJyksXG4gICAgb25FeHRyYUJ1dHRvbkNsaWNrOiAoKSA9PiBjb25zb2xlLmxvZygnRXh0cmEgYnV0dG9uIHByZXNzZWQnKSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIE1vZGFsPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbnR5cGUgTW9kYWxQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBNb2RhbD5cblxuY29uc3QgTW9kYWxEZW1vID0gKHByb3BzOiBNb2RhbFByb3BzKSA9PiB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHByb3BzLmRpc2FibGVkICYmIG9wZW4pXG4gICAgICBzZXRPcGVuKGZhbHNlKVxuICB9LCBbcHJvcHMuZGlzYWJsZWQsIG9wZW5dKVxuXG4gIGNvbnN0IHtcbiAgICBvbkNsb3NlLFxuICAgIG9uQ29uZmlybSxcbiAgICBvbkNhbmNlbCxcbiAgICBvbkV4dHJhQnV0dG9uQ2xpY2ssXG4gICAgY2hpbGRyZW4sXG4gICAgLi4ucmVzdFxuICB9ID0gcHJvcHNcblxuICBjb25zdCBoYW5kbGVDbG9zZSA9ICgpID0+IHtcbiAgICBvbkNsb3NlPy4oKVxuICAgIHNldE9wZW4oZmFsc2UpXG4gIH1cblxuICBjb25zdCBoYW5kbGVDb25maXJtID0gKCkgPT4ge1xuICAgIG9uQ29uZmlybT8uKClcbiAgICBzZXRPcGVuKGZhbHNlKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ2FuY2VsID0gKCkgPT4ge1xuICAgIG9uQ2FuY2VsPy4oKVxuICAgIHNldE9wZW4oZmFsc2UpXG4gIH1cblxuICBjb25zdCBoYW5kbGVFeHRyYSA9ICgpID0+IHtcbiAgICBvbkV4dHJhQnV0dG9uQ2xpY2s/LigpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBoLVs0ODBweF0gaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWdyYXktMTAwXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctcHJpbWFyeS02MDAgcHgtNCBweS0yIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC13aGl0ZSBzaGFkb3ctc20gaG92ZXI6YmctcHJpbWFyeS03MDBcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfVxuICAgICAgPlxuICAgICAgICBTaG93IHJpY2ggbW9kYWxcbiAgICAgIDwvYnV0dG9uPlxuXG4gICAgICB7b3BlbiAmJiAoXG4gICAgICAgIDxNb2RhbFxuICAgICAgICAgIHsuLi5yZXN0fVxuICAgICAgICAgIG9uQ2xvc2U9e2hhbmRsZUNsb3NlfVxuICAgICAgICAgIG9uQ29uZmlybT17aGFuZGxlQ29uZmlybX1cbiAgICAgICAgICBvbkNhbmNlbD17aGFuZGxlQ2FuY2VsfVxuICAgICAgICAgIG9uRXh0cmFCdXR0b25DbGljaz17aGFuZGxlRXh0cmF9XG4gICAgICAgICAgY2hpbGRyZW49e2NoaWxkcmVuID8/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IHRleHQtc20gdGV4dC1ncmF5LTYwMFwiPlxuICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICBSZW1vdmluZyBpbnRlZ3JhdGlvbnMgaW1tZWRpYXRlbHkgc3RvcHMgd29ya2Zsb3cgYXV0b21hdGlvbnMgcmVsYXRlZCB0byB0aGlzIGNvbm5lY3Rpb24uXG4gICAgICAgICAgICAgICAgTWFrZSBzdXJlIG5vIHNjaGVkdWxlZCBqb2JzIGRlcGVuZCBvbiB0aGlzIGludGVncmF0aW9uIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJsaXN0LWRpc2Mgc3BhY2UteS0xIHBsLTQgdGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICAgICAgPGxpPkFsbCBBUEkgY3JlZGVudGlhbHMgaXNzdWVkIGJ5IHRoaXMgaW50ZWdyYXRpb24gd2lsbCBiZSByZXZva2VkLjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPkhpc3RvcmljYWwgbG9ncyByZW1haW4gYWNjZXNzaWJsZSBmb3IgYXVkaXRpbmcuPC9saT5cbiAgICAgICAgICAgICAgICA8bGk+WW91IGNhbiByZS1lbmFibGUgdGhlIGludGVncmF0aW9uIGxhdGVyIHdpdGggZnJlc2ggY3JlZGVudGlhbHMuPC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxNb2RhbERlbW8gey4uLmFyZ3N9IC8+LFxufVxuXG5leHBvcnQgY29uc3QgV2l0aEV4dHJhQWN0aW9uOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxNb2RhbERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgc2hvd0V4dHJhQnV0dG9uOiB0cnVlLFxuICAgIGV4dHJhQnV0dG9uVmFyaWFudDogJ3NlY29uZGFyeScsXG4gICAgZXh0cmFCdXR0b25UZXh0OiAnRGlzYWJsZSBvbmx5JyxcbiAgICBmb290ZXJTbG90OiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS00MDBcIj5MYXN0IHN5bmNlZCA1IG1pbnV0ZXMgYWdvPC9zcGFuPlxuICAgICksXG4gIH0sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBzdG9yeTogJ0lsbHVzdHJhdGVzIHRoZSBvcHRpb25hbCBleHRyYSBidXR0b24gYW5kIGZvb3RlciBzbG90IGZvciBhZHZhbmNlZCB3b3JrZmxvd3MuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IE1lZGl1bVNpemVkOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxNb2RhbERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgc2l6ZTogJ21kJyxcbiAgICBzdWJUaXRsZTogJ1VzZSB0aGUgbGFyZ2VyIHdpZHRoIHRvIHN1cmZhY2UgZm9ybXMgd2l0aCBtb3JlIGZpZWxkcyBvciBzdXBwb3J0aW5nIGRlc2NyaXB0aW9ucy4nLFxuICAgIGJvdHRvbVNsb3Q6IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcHgtNiBweS00IHRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICBOZWVkIGZpbmVyIGNvbnRyb2w/IENvbmZpZ3VyZSBhdXRvbWF0aW9uIHJ1bGVzIGluIHRoZSBpbnRlZ3JhdGlvbiBzZXR0aW5ncyBwYWdlLlxuICAgICAgPC9kaXY+XG4gICAgKSxcbiAgfSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIHN0b3J5OiAnU2hvd3MgdGhlIG1lZGl1bSBzaXplZCBwYW5lbCBhbmQgYSBwb3B1bGF0ZWQgYGJvdHRvbVNsb3RgIGZvciBzdXBwbGVtZW50YWwgbWVzc2FnaW5nLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59XG4iXX0=