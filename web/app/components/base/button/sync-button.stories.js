"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InHeader = exports.Default = void 0;
const sync_button_1 = require("./sync-button");
const meta = {
    title: 'Base/General/SyncButton',
    component: sync_button_1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Icon-only refresh button that surfaces a tooltip and is used for manual sync actions across the UI.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional classes appended to the clickable container.',
        },
        popupContent: {
            control: 'text',
            description: 'Tooltip text shown on hover.',
        },
        onClick: {
            control: false,
            description: 'Triggered when the sync button is pressed.',
        },
    },
    args: {
        popupContent: 'Sync now',
        onClick: () => console.log('Sync button clicked'),
    },
};
exports.default = meta;
exports.Default = {
    args: {
        className: 'bg-white/80 shadow-sm backdrop-blur-sm',
    },
};
exports.InHeader = {
    render: args => (<div className="flex items-center gap-2 rounded-lg border border-divider-subtle bg-components-panel-bg p-3">
      <span className="text-xs text-text-tertiary">Logs</span>
      <div className="ml-auto flex items-center gap-2">
        <sync_button_1.default {...args}/>
      </div>
    </div>),
    args: {
        popupContent: 'Refresh logs',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1idXR0b24uc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN5bmMtYnV0dG9uLnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtDQUFzQztBQUV0QyxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx5QkFBeUI7SUFDaEMsU0FBUyxFQUFFLHFCQUFVO0lBQ3JCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUscUdBQXFHO2FBQ2pIO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSx5REFBeUQ7U0FDdkU7UUFDRCxZQUFZLEVBQUU7WUFDWixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSw4QkFBOEI7U0FDNUM7UUFDRCxPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsS0FBSztZQUNkLFdBQVcsRUFBRSw0Q0FBNEM7U0FDMUQ7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLFlBQVksRUFBRSxVQUFVO1FBQ3hCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDO0tBQ2xEO0NBQ2dDLENBQUE7QUFFbkMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxPQUFPLEdBQVU7SUFDNUIsSUFBSSxFQUFFO1FBQ0osU0FBUyxFQUFFLHdDQUF3QztLQUNwRDtDQUNGLENBQUE7QUFFWSxRQUFBLFFBQVEsR0FBVTtJQUM3QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0RkFBNEYsQ0FDekc7TUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FDdkQ7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUNBQWlDLENBQzlDO1FBQUEsQ0FBQyxxQkFBVSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQ3ZCO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QsSUFBSSxFQUFFO1FBQ0osWUFBWSxFQUFFLGNBQWM7S0FDN0I7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IFN5bmNCdXR0b24gZnJvbSAnLi9zeW5jLWJ1dHRvbidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0dlbmVyYWwvU3luY0J1dHRvbicsXG4gIGNvbXBvbmVudDogU3luY0J1dHRvbixcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2NlbnRlcmVkJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdJY29uLW9ubHkgcmVmcmVzaCBidXR0b24gdGhhdCBzdXJmYWNlcyBhIHRvb2x0aXAgYW5kIGlzIHVzZWQgZm9yIG1hbnVhbCBzeW5jIGFjdGlvbnMgYWNyb3NzIHRoZSBVSS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ1R5cGVzOiB7XG4gICAgY2xhc3NOYW1lOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FkZGl0aW9uYWwgY2xhc3NlcyBhcHBlbmRlZCB0byB0aGUgY2xpY2thYmxlIGNvbnRhaW5lci4nLFxuICAgIH0sXG4gICAgcG9wdXBDb250ZW50OiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Rvb2x0aXAgdGV4dCBzaG93biBvbiBob3Zlci4nLFxuICAgIH0sXG4gICAgb25DbGljazoge1xuICAgICAgY29udHJvbDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RyaWdnZXJlZCB3aGVuIHRoZSBzeW5jIGJ1dHRvbiBpcyBwcmVzc2VkLicsXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHBvcHVwQ29udGVudDogJ1N5bmMgbm93JyxcbiAgICBvbkNsaWNrOiAoKSA9PiBjb25zb2xlLmxvZygnU3luYyBidXR0b24gY2xpY2tlZCcpLFxuICB9LFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgU3luY0J1dHRvbj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICBjbGFzc05hbWU6ICdiZy13aGl0ZS84MCBzaGFkb3ctc20gYmFja2Ryb3AtYmx1ci1zbScsXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBJbkhlYWRlcjogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTNcIj5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+TG9nczwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWwtYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICA8U3luY0J1dHRvbiB7Li4uYXJnc30gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApLFxuICBhcmdzOiB7XG4gICAgcG9wdXBDb250ZW50OiAnUmVmcmVzaCBsb2dzJyxcbiAgfSxcbn1cbiJdfQ==