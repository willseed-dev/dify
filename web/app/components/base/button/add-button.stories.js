"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InToolbar = exports.Default = void 0;
const add_button_1 = require("./add-button");
const meta = {
    title: 'Base/General/AddButton',
    component: add_button_1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Compact icon-only button used for inline “add” actions in lists, cards, and modals.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Extra classes appended to the clickable container.',
        },
        onClick: {
            control: false,
            description: 'Triggered when the add button is pressed.',
        },
    },
    args: {
        onClick: () => console.log('Add button clicked'),
    },
};
exports.default = meta;
exports.Default = {
    args: {
        className: 'bg-white/80 shadow-sm backdrop-blur-sm',
    },
};
exports.InToolbar = {
    render: args => (<div className="flex items-center gap-2 rounded-lg border border-divider-subtle bg-components-panel-bg p-3">
      <span className="text-xs text-text-tertiary">Attachments</span>
      <div className="ml-auto flex items-center gap-2">
        <add_button_1.default {...args}/>
      </div>
    </div>),
    args: {
        className: 'border border-dashed border-primary-200',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLWJ1dHRvbi5zdG9yaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWRkLWJ1dHRvbi5zdG9yaWVzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2Q0FBb0M7QUFFcEMsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsd0JBQXdCO0lBQy9CLFNBQVMsRUFBRSxvQkFBUztJQUNwQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLHFGQUFxRjthQUNqRztTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsUUFBUSxFQUFFO1FBQ1IsU0FBUyxFQUFFO1lBQ1QsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsb0RBQW9EO1NBQ2xFO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQUUsMkNBQTJDO1NBQ3pEO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztLQUNqRDtDQUMrQixDQUFBO0FBRWxDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsT0FBTyxHQUFVO0lBQzVCLElBQUksRUFBRTtRQUNKLFNBQVMsRUFBRSx3Q0FBd0M7S0FDcEQ7Q0FDRixDQUFBO0FBRVksUUFBQSxTQUFTLEdBQVU7SUFDOUIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDZCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEZBQTRGLENBQ3pHO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQzlEO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlDQUFpQyxDQUM5QztRQUFBLENBQUMsb0JBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUN0QjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtJQUNELElBQUksRUFBRTtRQUNKLFNBQVMsRUFBRSx5Q0FBeUM7S0FDckQ7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IEFkZEJ1dHRvbiBmcm9tICcuL2FkZC1idXR0b24nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9HZW5lcmFsL0FkZEJ1dHRvbicsXG4gIGNvbXBvbmVudDogQWRkQnV0dG9uLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0NvbXBhY3QgaWNvbi1vbmx5IGJ1dHRvbiB1c2VkIGZvciBpbmxpbmUg4oCcYWRk4oCdIGFjdGlvbnMgaW4gbGlzdHMsIGNhcmRzLCBhbmQgbW9kYWxzLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnVHlwZXM6IHtcbiAgICBjbGFzc05hbWU6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRXh0cmEgY2xhc3NlcyBhcHBlbmRlZCB0byB0aGUgY2xpY2thYmxlIGNvbnRhaW5lci4nLFxuICAgIH0sXG4gICAgb25DbGljazoge1xuICAgICAgY29udHJvbDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RyaWdnZXJlZCB3aGVuIHRoZSBhZGQgYnV0dG9uIGlzIHByZXNzZWQuJyxcbiAgICB9LFxuICB9LFxuICBhcmdzOiB7XG4gICAgb25DbGljazogKCkgPT4gY29uc29sZS5sb2coJ0FkZCBidXR0b24gY2xpY2tlZCcpLFxuICB9LFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgQWRkQnV0dG9uPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIGNsYXNzTmFtZTogJ2JnLXdoaXRlLzgwIHNoYWRvdy1zbSBiYWNrZHJvcC1ibHVyLXNtJyxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEluVG9vbGJhcjogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTNcIj5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+QXR0YWNobWVudHM8L3NwYW4+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1sLWF1dG8gZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgPEFkZEJ1dHRvbiB7Li4uYXJnc30gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApLFxuICBhcmdzOiB7XG4gICAgY2xhc3NOYW1lOiAnYm9yZGVyIGJvcmRlci1kYXNoZWQgYm9yZGVyLXByaW1hcnktMjAwJyxcbiAgfSxcbn1cbiJdfQ==