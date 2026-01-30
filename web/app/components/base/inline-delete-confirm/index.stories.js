"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoVariant = exports.WarningVariant = exports.Playground = void 0;
const react_1 = require("react");
const test_1 = require("storybook/test");
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/InlineDeleteConfirm',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Compact confirmation prompt that appears inline, commonly used near delete buttons or destructive controls.',
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['delete', 'warning', 'info'],
        },
    },
    args: {
        title: 'Delete this item?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: (0, test_1.fn)(),
        onCancel: (0, test_1.fn)(),
    },
    tags: ['autodocs'],
};
exports.default = meta;
const InlineDeleteConfirmDemo = (args) => {
    const [visible, setVisible] = (0, react_1.useState)(true);
    return (<div className="flex flex-col items-start gap-3">
      <button type="button" className="rounded-md border border-divider-subtle px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => setVisible(true)}>
        Trigger inline confirm
      </button>
      {visible && (<_1.default {...args} onConfirm={() => {
                console.log('✅ Confirm clicked');
                setVisible(false);
            }} onCancel={() => {
                console.log('❎ Cancel clicked');
                setVisible(false);
            }}/>)}
    </div>);
};
exports.Playground = {
    render: args => <InlineDeleteConfirmDemo {...args}/>,
};
exports.WarningVariant = {
    render: args => <InlineDeleteConfirmDemo {...args}/>,
    args: {
        variant: 'warning',
        title: 'Archive conversation?',
        confirmText: 'Archive',
        cancelText: 'Keep',
    },
};
exports.InfoVariant = {
    render: args => <InlineDeleteConfirmDemo {...args}/>,
    args: {
        variant: 'info',
        title: 'Remove collaborator?',
        confirmText: 'Remove',
        cancelText: 'Keep',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx5Q0FBbUM7QUFDbkMsd0JBQW1DO0FBRW5DLE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLG1DQUFtQztJQUMxQyxTQUFTLEVBQUUsVUFBbUI7SUFDOUIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSw2R0FBNkc7YUFDekg7U0FDRjtLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUM7U0FDdkM7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSxtQkFBbUI7UUFDMUIsV0FBVyxFQUFFLFFBQVE7UUFDckIsVUFBVSxFQUFFLFFBQVE7UUFDcEIsU0FBUyxFQUFFLElBQUEsU0FBRSxHQUFFO1FBQ2YsUUFBUSxFQUFFLElBQUEsU0FBRSxHQUFFO0tBQ2Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDd0IsQ0FBQTtBQUU1QyxrQkFBZSxJQUFJLENBQUE7QUFHbkIsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLElBQW1CLEVBQUUsRUFBRTtJQUN0RCxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxJQUFJLENBQUMsQ0FBQTtJQUU1QyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlDQUFpQyxDQUM5QztNQUFBLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLHVIQUF1SCxDQUNqSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FFaEM7O01BQ0YsRUFBRSxNQUFNLENBQ1I7TUFBQSxDQUFDLE9BQU8sSUFBSSxDQUNWLENBQUMsVUFBbUIsQ0FDbEIsSUFBSSxJQUFJLENBQUMsQ0FDVCxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2dCQUNoQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbkIsQ0FBQyxDQUFDLENBQ0YsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtnQkFDL0IsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ25CLENBQUMsQ0FBQyxFQUNGLENBQ0gsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVZLFFBQUEsVUFBVSxHQUFVO0lBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztDQUN0RCxDQUFBO0FBRVksUUFBQSxjQUFjLEdBQVU7SUFDbkMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0lBQ3JELElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLEtBQUssRUFBRSx1QkFBdUI7UUFDOUIsV0FBVyxFQUFFLFNBQVM7UUFDdEIsVUFBVSxFQUFFLE1BQU07S0FDbkI7Q0FDRixDQUFBO0FBRVksUUFBQSxXQUFXLEdBQVU7SUFDaEMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0lBQ3JELElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxNQUFNO1FBQ2YsS0FBSyxFQUFFLHNCQUFzQjtRQUM3QixXQUFXLEVBQUUsUUFBUTtRQUNyQixVQUFVLEVBQUUsTUFBTTtLQUNuQjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZm4gfSBmcm9tICdzdG9yeWJvb2svdGVzdCdcbmltcG9ydCBJbmxpbmVEZWxldGVDb25maXJtIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9JbmxpbmVEZWxldGVDb25maXJtJyxcbiAgY29tcG9uZW50OiBJbmxpbmVEZWxldGVDb25maXJtLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0NvbXBhY3QgY29uZmlybWF0aW9uIHByb21wdCB0aGF0IGFwcGVhcnMgaW5saW5lLCBjb21tb25seSB1c2VkIG5lYXIgZGVsZXRlIGJ1dHRvbnMgb3IgZGVzdHJ1Y3RpdmUgY29udHJvbHMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYXJnVHlwZXM6IHtcbiAgICB2YXJpYW50OiB7XG4gICAgICBjb250cm9sOiAnc2VsZWN0JyxcbiAgICAgIG9wdGlvbnM6IFsnZGVsZXRlJywgJ3dhcm5pbmcnLCAnaW5mbyddLFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICB0aXRsZTogJ0RlbGV0ZSB0aGlzIGl0ZW0/JyxcbiAgICBjb25maXJtVGV4dDogJ0RlbGV0ZScsXG4gICAgY2FuY2VsVGV4dDogJ0NhbmNlbCcsXG4gICAgb25Db25maXJtOiBmbigpLFxuICAgIG9uQ2FuY2VsOiBmbigpLFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBJbmxpbmVEZWxldGVDb25maXJtPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmNvbnN0IElubGluZURlbGV0ZUNvbmZpcm1EZW1vID0gKGFyZ3M6IFN0b3J5WydhcmdzJ10pID0+IHtcbiAgY29uc3QgW3Zpc2libGUsIHNldFZpc2libGVdID0gdXNlU3RhdGUodHJ1ZSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1zdGFydCBnYXAtM1wiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIHB4LTMgcHktMS41IHRleHQteHMgZm9udC1tZWRpdW0gdGV4dC10ZXh0LXNlY29uZGFyeSBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0VmlzaWJsZSh0cnVlKX1cbiAgICAgID5cbiAgICAgICAgVHJpZ2dlciBpbmxpbmUgY29uZmlybVxuICAgICAgPC9idXR0b24+XG4gICAgICB7dmlzaWJsZSAmJiAoXG4gICAgICAgIDxJbmxpbmVEZWxldGVDb25maXJtXG4gICAgICAgICAgey4uLmFyZ3N9XG4gICAgICAgICAgb25Db25maXJtPXsoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn4pyFIENvbmZpcm0gY2xpY2tlZCcpXG4gICAgICAgICAgICBzZXRWaXNpYmxlKGZhbHNlKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DYW5jZWw9eygpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfinY4gQ2FuY2VsIGNsaWNrZWQnKVxuICAgICAgICAgICAgc2V0VmlzaWJsZShmYWxzZSlcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8SW5saW5lRGVsZXRlQ29uZmlybURlbW8gey4uLmFyZ3N9IC8+LFxufVxuXG5leHBvcnQgY29uc3QgV2FybmluZ1ZhcmlhbnQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPElubGluZURlbGV0ZUNvbmZpcm1EZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhcmlhbnQ6ICd3YXJuaW5nJyxcbiAgICB0aXRsZTogJ0FyY2hpdmUgY29udmVyc2F0aW9uPycsXG4gICAgY29uZmlybVRleHQ6ICdBcmNoaXZlJyxcbiAgICBjYW5jZWxUZXh0OiAnS2VlcCcsXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBJbmZvVmFyaWFudDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8SW5saW5lRGVsZXRlQ29uZmlybURlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgdmFyaWFudDogJ2luZm8nLFxuICAgIHRpdGxlOiAnUmVtb3ZlIGNvbGxhYm9yYXRvcj8nLFxuICAgIGNvbmZpcm1UZXh0OiAnUmVtb3ZlJyxcbiAgICBjYW5jZWxUZXh0OiAnS2VlcCcsXG4gIH0sXG59XG4iXX0=