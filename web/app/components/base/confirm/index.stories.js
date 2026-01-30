"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = exports.NotMaskClosable = exports.DangerousAction = exports.AlertStyle = exports.DisabledState = exports.LoadingState = exports.CustomButtonText = exports.InfoDialog = exports.WarningDialog = void 0;
const react_1 = require("react");
const _1 = require(".");
const button_1 = require("../button");
const meta = {
    title: 'Base/Feedback/Confirm',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Confirmation dialog component that supports warning and info types, with customizable button text and behavior.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['info', 'warning'],
            description: 'Dialog type',
        },
        isShow: {
            control: 'boolean',
            description: 'Whether to show the dialog',
        },
        title: {
            control: 'text',
            description: 'Dialog title',
        },
        content: {
            control: 'text',
            description: 'Dialog content',
        },
        confirmText: {
            control: 'text',
            description: 'Confirm button text',
        },
        cancelText: {
            control: 'text',
            description: 'Cancel button text',
        },
        isLoading: {
            control: 'boolean',
            description: 'Confirm button loading state',
        },
        isDisabled: {
            control: 'boolean',
            description: 'Confirm button disabled state',
        },
        showConfirm: {
            control: 'boolean',
            description: 'Whether to show confirm button',
        },
        showCancel: {
            control: 'boolean',
            description: 'Whether to show cancel button',
        },
        maskClosable: {
            control: 'boolean',
            description: 'Whether clicking mask closes dialog',
        },
    },
    args: {
        onConfirm: () => {
            console.log('✅ User clicked confirm');
        },
        onCancel: () => {
            console.log('❌ User clicked cancel');
        },
    },
};
exports.default = meta;
// Interactive demo wrapper
const ConfirmDemo = (args) => {
    const [isShow, setIsShow] = (0, react_1.useState)(false);
    return (<div>
      <button_1.default variant="primary" onClick={() => setIsShow(true)}>
        Open Dialog
      </button_1.default>
      <_1.default {...args} isShow={isShow} onConfirm={() => {
            console.log('✅ User clicked confirm');
            setIsShow(false);
        }} onCancel={() => {
            console.log('❌ User clicked cancel');
            setIsShow(false);
        }}/>
    </div>);
};
// Basic warning dialog - Delete action
exports.WarningDialog = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'warning',
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this project? This action cannot be undone.',
        isShow: false,
    },
};
// Info dialog
exports.InfoDialog = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'info',
        title: 'Notice',
        content: 'Your changes have been saved. Do you want to proceed to the next step?',
        isShow: false,
    },
};
// Custom button text
exports.CustomButtonText = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'warning',
        title: 'Exit Editor',
        content: 'You have unsaved changes. Are you sure you want to exit?',
        confirmText: 'Discard Changes',
        cancelText: 'Continue Editing',
        isShow: false,
    },
};
// Loading state
exports.LoadingState = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'warning',
        title: 'Deleting...',
        content: 'Please wait while we delete the file...',
        isLoading: true,
        isShow: false,
    },
};
// Disabled state
exports.DisabledState = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'info',
        title: 'Verification Required',
        content: 'Please complete email verification before proceeding.',
        isDisabled: true,
        isShow: false,
    },
};
// Alert style - Confirm button only
exports.AlertStyle = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'info',
        title: 'Success',
        content: 'Your settings have been updated!',
        showCancel: false,
        confirmText: 'Got it',
        isShow: false,
    },
};
// Dangerous action - Long content
exports.DangerousAction = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'warning',
        title: 'Permanently Delete Account',
        content: 'This action will permanently delete your account and all associated data, including: all projects and files, collaboration history, and personal settings. This action cannot be reversed!',
        confirmText: 'Delete My Account',
        cancelText: 'Keep My Account',
        isShow: false,
    },
};
// Non-closable mask
exports.NotMaskClosable = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'warning',
        title: 'Important Action',
        content: 'This action requires your explicit choice. Clicking outside will not close this dialog.',
        maskClosable: false,
        isShow: false,
    },
};
// Full feature demo - Playground
exports.Playground = {
    render: args => <ConfirmDemo {...args}/>,
    args: {
        type: 'warning',
        title: 'This is a title',
        content: 'This is the dialog content text...',
        confirmText: undefined,
        cancelText: undefined,
        isLoading: false,
        isDisabled: false,
        showConfirm: true,
        showCancel: true,
        maskClosable: true,
        isShow: false,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBdUI7QUFDdkIsc0NBQThCO0FBRTlCLE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLHVCQUF1QjtJQUM5QixTQUFTLEVBQUUsVUFBTztJQUNsQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLGlIQUFpSDthQUM3SDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztZQUM1QixXQUFXLEVBQUUsYUFBYTtTQUMzQjtRQUNELE1BQU0sRUFBRTtZQUNOLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSw0QkFBNEI7U0FDMUM7UUFDRCxLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxjQUFjO1NBQzVCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsZ0JBQWdCO1NBQzlCO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUscUJBQXFCO1NBQ25DO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsb0JBQW9CO1NBQ2xDO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLDhCQUE4QjtTQUM1QztRQUNELFVBQVUsRUFBRTtZQUNWLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSwr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QjtRQUNoQyxVQUFVLEVBQUUsaUJBQWlCO1FBQzdCLE1BQU0sRUFBRSxLQUFLO0tBQ2Q7Q0FDRixDQUFBO0FBRUQsb0JBQW9CO0FBQ1AsUUFBQSxlQUFlLEdBQVU7SUFDcEMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztJQUN6QyxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxrQkFBa0I7UUFDekIsT0FBTyxFQUFFLHlGQUF5RjtRQUNsRyxZQUFZLEVBQUUsS0FBSztRQUNuQixNQUFNLEVBQUUsS0FBSztLQUNkO0NBQ0YsQ0FBQTtBQUVELGlDQUFpQztBQUNwQixRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0lBQ3pDLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLGlCQUFpQjtRQUN4QixPQUFPLEVBQUUsb0NBQW9DO1FBQzdDLFdBQVcsRUFBRSxTQUFTO1FBQ3RCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxLQUFLO0tBQ2Q7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBDb25maXJtIGZyb20gJy4nXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2J1dHRvbidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0ZlZWRiYWNrL0NvbmZpcm0nLFxuICBjb21wb25lbnQ6IENvbmZpcm0sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnQ29uZmlybWF0aW9uIGRpYWxvZyBjb21wb25lbnQgdGhhdCBzdXBwb3J0cyB3YXJuaW5nIGFuZCBpbmZvIHR5cGVzLCB3aXRoIGN1c3RvbWl6YWJsZSBidXR0b24gdGV4dCBhbmQgYmVoYXZpb3IuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdUeXBlczoge1xuICAgIHR5cGU6IHtcbiAgICAgIGNvbnRyb2w6ICdzZWxlY3QnLFxuICAgICAgb3B0aW9uczogWydpbmZvJywgJ3dhcm5pbmcnXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlhbG9nIHR5cGUnLFxuICAgIH0sXG4gICAgaXNTaG93OiB7XG4gICAgICBjb250cm9sOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gc2hvdyB0aGUgZGlhbG9nJyxcbiAgICB9LFxuICAgIHRpdGxlOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RpYWxvZyB0aXRsZScsXG4gICAgfSxcbiAgICBjb250ZW50OiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RpYWxvZyBjb250ZW50JyxcbiAgICB9LFxuICAgIGNvbmZpcm1UZXh0OiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NvbmZpcm0gYnV0dG9uIHRleHQnLFxuICAgIH0sXG4gICAgY2FuY2VsVGV4dDoge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdDYW5jZWwgYnV0dG9uIHRleHQnLFxuICAgIH0sXG4gICAgaXNMb2FkaW5nOiB7XG4gICAgICBjb250cm9sOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NvbmZpcm0gYnV0dG9uIGxvYWRpbmcgc3RhdGUnLFxuICAgIH0sXG4gICAgaXNEaXNhYmxlZDoge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdDb25maXJtIGJ1dHRvbiBkaXNhYmxlZCBzdGF0ZScsXG4gICAgfSxcbiAgICBzaG93Q29uZmlybToge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIHNob3cgY29uZmlybSBidXR0b24nLFxuICAgIH0sXG4gICAgc2hvd0NhbmNlbDoge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIHNob3cgY2FuY2VsIGJ1dHRvbicsXG4gICAgfSxcbiAgICBtYXNrQ2xvc2FibGU6IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciBjbGlja2luZyBtYXNrIGNsb3NlcyBkaWFsb2cnLFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICBvbkNvbmZpcm06ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCfinIUgVXNlciBjbGlja2VkIGNvbmZpcm0nKVxuICAgIH0sXG4gICAgb25DYW5jZWw6ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCfinYwgVXNlciBjbGlja2VkIGNhbmNlbCcpXG4gICAgfSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIENvbmZpcm0+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuLy8gSW50ZXJhY3RpdmUgZGVtbyB3cmFwcGVyXG5jb25zdCBDb25maXJtRGVtbyA9IChhcmdzOiBhbnkpID0+IHtcbiAgY29uc3QgW2lzU2hvdywgc2V0SXNTaG93XSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxCdXR0b24gdmFyaWFudD1cInByaW1hcnlcIiBvbkNsaWNrPXsoKSA9PiBzZXRJc1Nob3codHJ1ZSl9PlxuICAgICAgICBPcGVuIERpYWxvZ1xuICAgICAgPC9CdXR0b24+XG4gICAgICA8Q29uZmlybVxuICAgICAgICB7Li4uYXJnc31cbiAgICAgICAgaXNTaG93PXtpc1Nob3d9XG4gICAgICAgIG9uQ29uZmlybT17KCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCfinIUgVXNlciBjbGlja2VkIGNvbmZpcm0nKVxuICAgICAgICAgIHNldElzU2hvdyhmYWxzZSlcbiAgICAgICAgfX1cbiAgICAgICAgb25DYW5jZWw9eygpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn4p2MIFVzZXIgY2xpY2tlZCBjYW5jZWwnKVxuICAgICAgICAgIHNldElzU2hvdyhmYWxzZSlcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuLy8gQmFzaWMgd2FybmluZyBkaWFsb2cgLSBEZWxldGUgYWN0aW9uXG5leHBvcnQgY29uc3QgV2FybmluZ0RpYWxvZzogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8Q29uZmlybURlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgIHRpdGxlOiAnRGVsZXRlIENvbmZpcm1hdGlvbicsXG4gICAgY29udGVudDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBwcm9qZWN0PyBUaGlzIGFjdGlvbiBjYW5ub3QgYmUgdW5kb25lLicsXG4gICAgaXNTaG93OiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gSW5mbyBkaWFsb2dcbmV4cG9ydCBjb25zdCBJbmZvRGlhbG9nOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxDb25maXJtRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB0eXBlOiAnaW5mbycsXG4gICAgdGl0bGU6ICdOb3RpY2UnLFxuICAgIGNvbnRlbnQ6ICdZb3VyIGNoYW5nZXMgaGF2ZSBiZWVuIHNhdmVkLiBEbyB5b3Ugd2FudCB0byBwcm9jZWVkIHRvIHRoZSBuZXh0IHN0ZXA/JyxcbiAgICBpc1Nob3c6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBDdXN0b20gYnV0dG9uIHRleHRcbmV4cG9ydCBjb25zdCBDdXN0b21CdXR0b25UZXh0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxDb25maXJtRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB0eXBlOiAnd2FybmluZycsXG4gICAgdGl0bGU6ICdFeGl0IEVkaXRvcicsXG4gICAgY29udGVudDogJ1lvdSBoYXZlIHVuc2F2ZWQgY2hhbmdlcy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGV4aXQ/JyxcbiAgICBjb25maXJtVGV4dDogJ0Rpc2NhcmQgQ2hhbmdlcycsXG4gICAgY2FuY2VsVGV4dDogJ0NvbnRpbnVlIEVkaXRpbmcnLFxuICAgIGlzU2hvdzogZmFsc2UsXG4gIH0sXG59XG5cbi8vIExvYWRpbmcgc3RhdGVcbmV4cG9ydCBjb25zdCBMb2FkaW5nU3RhdGU6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPENvbmZpcm1EZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICB0aXRsZTogJ0RlbGV0aW5nLi4uJyxcbiAgICBjb250ZW50OiAnUGxlYXNlIHdhaXQgd2hpbGUgd2UgZGVsZXRlIHRoZSBmaWxlLi4uJyxcbiAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgaXNTaG93OiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gRGlzYWJsZWQgc3RhdGVcbmV4cG9ydCBjb25zdCBEaXNhYmxlZFN0YXRlOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxDb25maXJtRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB0eXBlOiAnaW5mbycsXG4gICAgdGl0bGU6ICdWZXJpZmljYXRpb24gUmVxdWlyZWQnLFxuICAgIGNvbnRlbnQ6ICdQbGVhc2UgY29tcGxldGUgZW1haWwgdmVyaWZpY2F0aW9uIGJlZm9yZSBwcm9jZWVkaW5nLicsXG4gICAgaXNEaXNhYmxlZDogdHJ1ZSxcbiAgICBpc1Nob3c6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBBbGVydCBzdHlsZSAtIENvbmZpcm0gYnV0dG9uIG9ubHlcbmV4cG9ydCBjb25zdCBBbGVydFN0eWxlOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxDb25maXJtRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB0eXBlOiAnaW5mbycsXG4gICAgdGl0bGU6ICdTdWNjZXNzJyxcbiAgICBjb250ZW50OiAnWW91ciBzZXR0aW5ncyBoYXZlIGJlZW4gdXBkYXRlZCEnLFxuICAgIHNob3dDYW5jZWw6IGZhbHNlLFxuICAgIGNvbmZpcm1UZXh0OiAnR290IGl0JyxcbiAgICBpc1Nob3c6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBEYW5nZXJvdXMgYWN0aW9uIC0gTG9uZyBjb250ZW50XG5leHBvcnQgY29uc3QgRGFuZ2Vyb3VzQWN0aW9uOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxDb25maXJtRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB0eXBlOiAnd2FybmluZycsXG4gICAgdGl0bGU6ICdQZXJtYW5lbnRseSBEZWxldGUgQWNjb3VudCcsXG4gICAgY29udGVudDogJ1RoaXMgYWN0aW9uIHdpbGwgcGVybWFuZW50bHkgZGVsZXRlIHlvdXIgYWNjb3VudCBhbmQgYWxsIGFzc29jaWF0ZWQgZGF0YSwgaW5jbHVkaW5nOiBhbGwgcHJvamVjdHMgYW5kIGZpbGVzLCBjb2xsYWJvcmF0aW9uIGhpc3RvcnksIGFuZCBwZXJzb25hbCBzZXR0aW5ncy4gVGhpcyBhY3Rpb24gY2Fubm90IGJlIHJldmVyc2VkIScsXG4gICAgY29uZmlybVRleHQ6ICdEZWxldGUgTXkgQWNjb3VudCcsXG4gICAgY2FuY2VsVGV4dDogJ0tlZXAgTXkgQWNjb3VudCcsXG4gICAgaXNTaG93OiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gTm9uLWNsb3NhYmxlIG1hc2tcbmV4cG9ydCBjb25zdCBOb3RNYXNrQ2xvc2FibGU6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPENvbmZpcm1EZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICB0aXRsZTogJ0ltcG9ydGFudCBBY3Rpb24nLFxuICAgIGNvbnRlbnQ6ICdUaGlzIGFjdGlvbiByZXF1aXJlcyB5b3VyIGV4cGxpY2l0IGNob2ljZS4gQ2xpY2tpbmcgb3V0c2lkZSB3aWxsIG5vdCBjbG9zZSB0aGlzIGRpYWxvZy4nLFxuICAgIG1hc2tDbG9zYWJsZTogZmFsc2UsXG4gICAgaXNTaG93OiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gRnVsbCBmZWF0dXJlIGRlbW8gLSBQbGF5Z3JvdW5kXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8Q29uZmlybURlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgIHRpdGxlOiAnVGhpcyBpcyBhIHRpdGxlJyxcbiAgICBjb250ZW50OiAnVGhpcyBpcyB0aGUgZGlhbG9nIGNvbnRlbnQgdGV4dC4uLicsXG4gICAgY29uZmlybVRleHQ6IHVuZGVmaW5lZCxcbiAgICBjYW5jZWxUZXh0OiB1bmRlZmluZWQsXG4gICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICBpc0Rpc2FibGVkOiBmYWxzZSxcbiAgICBzaG93Q29uZmlybTogdHJ1ZSxcbiAgICBzaG93Q2FuY2VsOiB0cnVlLFxuICAgIG1hc2tDbG9zYWJsZTogdHJ1ZSxcbiAgICBpc1Nob3c6IGZhbHNlLFxuICB9LFxufVxuIl19