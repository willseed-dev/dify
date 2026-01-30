"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomWidth = exports.WithBackLink = exports.Default = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/ModalLikeWrap',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Compact “modal-like” card used in wizards. Provides header actions, optional back slot, and confirm/cancel buttons.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Header title text.',
        },
        className: {
            control: 'text',
            description: 'Additional classes on the wrapper.',
        },
        beforeHeader: {
            control: false,
            description: 'Slot rendered before the header (commonly a back link).',
        },
        hideCloseBtn: {
            control: 'boolean',
            description: 'Hides the top-right close icon when true.',
        },
        children: {
            control: false,
        },
        onClose: {
            control: false,
        },
        onConfirm: {
            control: false,
        },
    },
    args: {
        title: 'Create dataset field',
        hideCloseBtn: false,
        onClose: () => console.log('close'),
        onConfirm: () => console.log('confirm'),
        children: null,
    },
};
exports.default = meta;
const BaseContent = () => (<div className="space-y-3 text-sm text-gray-600">
    <p>
      Describe the new field your dataset should collect. Provide a clear label and optional helper text.
    </p>
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
      Form inputs would be placed here in the real flow.
    </div>
  </div>);
exports.Default = {
    render: args => (<_1.default {...args}>
      <BaseContent />
    </_1.default>),
    args: {
        children: null,
    },
};
exports.WithBackLink = {
    render: args => (<_1.default {...args} hideCloseBtn beforeHeader={(<button className="mb-1 flex items-center gap-1 text-xs font-medium uppercase text-text-accent" onClick={() => console.log('back')}>
          <span className="bg-text-accent/10 inline-block h-4 w-4 rounded text-center text-[10px] leading-4 text-text-accent">{'<'}</span>
          Back
        </button>)}>
      <BaseContent />
    </_1.default>),
    args: {
        title: 'Select metadata type',
        children: null,
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates feeding content into `beforeHeader` while hiding the close button.',
            },
        },
    },
};
exports.CustomWidth = {
    render: args => (<_1.default {...args} className="w-[420px]">
      <BaseContent />
      <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-blue-600">
        Tip: metadata keys may only include letters, numbers, and underscores.
      </div>
    </_1.default>),
    args: {
        title: 'Advanced configuration',
        children: null,
    },
    parameters: {
        docs: {
            description: {
                story: 'Applies extra width and helper messaging to emulate configuration panels.',
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUE2QjtBQUU3QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSw2QkFBNkI7SUFDcEMsU0FBUyxFQUFFLFVBQWE7SUFDeEIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxxSEFBcUg7YUFDakk7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLFFBQVEsRUFBRTtRQUNSLEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLG9CQUFvQjtTQUNsQztRQUNELFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLG9DQUFvQztTQUNsRDtRQUNELFlBQVksRUFBRTtZQUNaLE9BQU8sRUFBRSxLQUFLO1lBQ2QsV0FBVyxFQUFFLHlEQUF5RDtTQUN2RTtRQUNELFlBQVksRUFBRTtZQUNaLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSwyQ0FBMkM7U0FDekQ7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSxzQkFBc0I7UUFDN0IsWUFBWSxFQUFFLEtBQUs7UUFDbkIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ25DLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUN2QyxRQUFRLEVBQUUsSUFBSTtLQUNmO0NBQ21DLENBQUE7QUFFdEMsa0JBQWUsSUFBSSxDQUFBO0FBR25CLE1BQU0sV0FBVyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQ3hCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FDOUM7SUFBQSxDQUFDLENBQUMsQ0FDQTs7SUFDRixFQUFFLENBQUMsQ0FDSDtJQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzRkFBc0YsQ0FDbkc7O0lBQ0YsRUFBRSxHQUFHLENBQ1A7RUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFFWSxRQUFBLE9BQU8sR0FBVTtJQUM1QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsVUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLENBQ3RCO01BQUEsQ0FBQyxXQUFXLENBQUMsQUFBRCxFQUNkO0lBQUEsRUFBRSxVQUFhLENBQUMsQ0FDakI7SUFDRCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsSUFBSTtLQUNmO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsWUFBWSxHQUFVO0lBQ2pDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ2QsQ0FBQyxVQUFhLENBQ1osSUFBSSxJQUFJLENBQUMsQ0FDVCxZQUFZLENBQ1osWUFBWSxDQUFDLENBQUMsQ0FDWixDQUFDLE1BQU0sQ0FDTCxTQUFTLENBQUMsNkVBQTZFLENBQ3ZGLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FFbkM7VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUdBQW1HLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQy9IOztRQUNGLEVBQUUsTUFBTSxDQUFDLENBQ1YsQ0FBQyxDQUVGO01BQUEsQ0FBQyxXQUFXLENBQUMsQUFBRCxFQUNkO0lBQUEsRUFBRSxVQUFhLENBQUMsQ0FDakI7SUFDRCxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsc0JBQXNCO1FBQzdCLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsS0FBSyxFQUFFLGlGQUFpRjthQUN6RjtTQUNGO0tBQ0Y7Q0FDRixDQUFBO0FBRVksUUFBQSxXQUFXLEdBQVU7SUFDaEMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDZCxDQUFDLFVBQWEsQ0FDWixJQUFJLElBQUksQ0FBQyxDQUNULFNBQVMsQ0FBQyxXQUFXLENBRXJCO01BQUEsQ0FBQyxXQUFXLENBQUMsQUFBRCxFQUNaO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNEQUFzRCxDQUNuRTs7TUFDRixFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsVUFBYSxDQUFDLENBQ2pCO0lBQ0QsSUFBSSxFQUFFO1FBQ0osS0FBSyxFQUFFLHdCQUF3QjtRQUMvQixRQUFRLEVBQUUsSUFBSTtLQUNmO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLEtBQUssRUFBRSwyRUFBMkU7YUFDbkY7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBNb2RhbExpa2VXcmFwIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9Nb2RhbExpa2VXcmFwJyxcbiAgY29tcG9uZW50OiBNb2RhbExpa2VXcmFwLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0NvbXBhY3Qg4oCcbW9kYWwtbGlrZeKAnSBjYXJkIHVzZWQgaW4gd2l6YXJkcy4gUHJvdmlkZXMgaGVhZGVyIGFjdGlvbnMsIG9wdGlvbmFsIGJhY2sgc2xvdCwgYW5kIGNvbmZpcm0vY2FuY2VsIGJ1dHRvbnMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdUeXBlczoge1xuICAgIHRpdGxlOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0hlYWRlciB0aXRsZSB0ZXh0LicsXG4gICAgfSxcbiAgICBjbGFzc05hbWU6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWRkaXRpb25hbCBjbGFzc2VzIG9uIHRoZSB3cmFwcGVyLicsXG4gICAgfSxcbiAgICBiZWZvcmVIZWFkZXI6IHtcbiAgICAgIGNvbnRyb2w6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdTbG90IHJlbmRlcmVkIGJlZm9yZSB0aGUgaGVhZGVyIChjb21tb25seSBhIGJhY2sgbGluaykuJyxcbiAgICB9LFxuICAgIGhpZGVDbG9zZUJ0bjoge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdIaWRlcyB0aGUgdG9wLXJpZ2h0IGNsb3NlIGljb24gd2hlbiB0cnVlLicsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgY29udHJvbDogZmFsc2UsXG4gICAgfSxcbiAgICBvbkNsb3NlOiB7XG4gICAgICBjb250cm9sOiBmYWxzZSxcbiAgICB9LFxuICAgIG9uQ29uZmlybToge1xuICAgICAgY29udHJvbDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHRpdGxlOiAnQ3JlYXRlIGRhdGFzZXQgZmllbGQnLFxuICAgIGhpZGVDbG9zZUJ0bjogZmFsc2UsXG4gICAgb25DbG9zZTogKCkgPT4gY29uc29sZS5sb2coJ2Nsb3NlJyksXG4gICAgb25Db25maXJtOiAoKSA9PiBjb25zb2xlLmxvZygnY29uZmlybScpLFxuICAgIGNoaWxkcmVuOiBudWxsLFxuICB9LFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgTW9kYWxMaWtlV3JhcD5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5jb25zdCBCYXNlQ29udGVudCA9ICgpID0+IChcbiAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTMgdGV4dC1zbSB0ZXh0LWdyYXktNjAwXCI+XG4gICAgPHA+XG4gICAgICBEZXNjcmliZSB0aGUgbmV3IGZpZWxkIHlvdXIgZGF0YXNldCBzaG91bGQgY29sbGVjdC4gUHJvdmlkZSBhIGNsZWFyIGxhYmVsIGFuZCBvcHRpb25hbCBoZWxwZXIgdGV4dC5cbiAgICA8L3A+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1ncmF5LTIwMCBiZy1ncmF5LTUwIHAtNCB0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgIEZvcm0gaW5wdXRzIHdvdWxkIGJlIHBsYWNlZCBoZXJlIGluIHRoZSByZWFsIGZsb3cuXG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKVxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiAoXG4gICAgPE1vZGFsTGlrZVdyYXAgey4uLmFyZ3N9PlxuICAgICAgPEJhc2VDb250ZW50IC8+XG4gICAgPC9Nb2RhbExpa2VXcmFwPlxuICApLFxuICBhcmdzOiB7XG4gICAgY2hpbGRyZW46IG51bGwsXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBXaXRoQmFja0xpbms6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gKFxuICAgIDxNb2RhbExpa2VXcmFwXG4gICAgICB7Li4uYXJnc31cbiAgICAgIGhpZGVDbG9zZUJ0blxuICAgICAgYmVmb3JlSGVhZGVyPXsoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJtYi0xIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRleHQteHMgZm9udC1tZWRpdW0gdXBwZXJjYXNlIHRleHQtdGV4dC1hY2NlbnRcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGNvbnNvbGUubG9nKCdiYWNrJyl9XG4gICAgICAgID5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJiZy10ZXh0LWFjY2VudC8xMCBpbmxpbmUtYmxvY2sgaC00IHctNCByb3VuZGVkIHRleHQtY2VudGVyIHRleHQtWzEwcHhdIGxlYWRpbmctNCB0ZXh0LXRleHQtYWNjZW50XCI+eyc8J308L3NwYW4+XG4gICAgICAgICAgQmFja1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICl9XG4gICAgPlxuICAgICAgPEJhc2VDb250ZW50IC8+XG4gICAgPC9Nb2RhbExpa2VXcmFwPlxuICApLFxuICBhcmdzOiB7XG4gICAgdGl0bGU6ICdTZWxlY3QgbWV0YWRhdGEgdHlwZScsXG4gICAgY2hpbGRyZW46IG51bGwsXG4gIH0sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBzdG9yeTogJ0RlbW9uc3RyYXRlcyBmZWVkaW5nIGNvbnRlbnQgaW50byBgYmVmb3JlSGVhZGVyYCB3aGlsZSBoaWRpbmcgdGhlIGNsb3NlIGJ1dHRvbi4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgQ3VzdG9tV2lkdGg6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gKFxuICAgIDxNb2RhbExpa2VXcmFwXG4gICAgICB7Li4uYXJnc31cbiAgICAgIGNsYXNzTmFtZT1cInctWzQyMHB4XVwiXG4gICAgPlxuICAgICAgPEJhc2VDb250ZW50IC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcm91bmRlZC1tZCBiZy1ibHVlLTUwIHAtMyB0ZXh0LXhzIHRleHQtYmx1ZS02MDBcIj5cbiAgICAgICAgVGlwOiBtZXRhZGF0YSBrZXlzIG1heSBvbmx5IGluY2x1ZGUgbGV0dGVycywgbnVtYmVycywgYW5kIHVuZGVyc2NvcmVzLlxuICAgICAgPC9kaXY+XG4gICAgPC9Nb2RhbExpa2VXcmFwPlxuICApLFxuICBhcmdzOiB7XG4gICAgdGl0bGU6ICdBZHZhbmNlZCBjb25maWd1cmF0aW9uJyxcbiAgICBjaGlsZHJlbjogbnVsbCxcbiAgfSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIHN0b3J5OiAnQXBwbGllcyBleHRyYSB3aWR0aCBhbmQgaGVscGVyIG1lc3NhZ2luZyB0byBlbXVsYXRlIGNvbmZpZ3VyYXRpb24gcGFuZWxzLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59XG4iXX0=