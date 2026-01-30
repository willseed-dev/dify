"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = exports.CommentBox = exports.ChatInput = exports.LongContent = exports.CustomStyling = exports.AutoFocus = exports.SmallMaxHeight = exports.CustomMinHeight = exports.MultilineContent = exports.WithInitialValue = exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Data Entry/AutoHeightTextarea',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Auto-resizing textarea component that expands and contracts based on content, with configurable min/max height constraints.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: {
            control: 'text',
            description: 'Placeholder text',
        },
        value: {
            control: 'text',
            description: 'Textarea value',
        },
        onChange: {
            action: 'changed',
            description: 'Change handler',
        },
        minHeight: {
            control: 'number',
            description: 'Minimum height in pixels',
        },
        maxHeight: {
            control: 'number',
            description: 'Maximum height in pixels',
        },
        autoFocus: {
            control: 'boolean',
            description: 'Auto focus on mount',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
        wrapperClassName: {
            control: 'text',
            description: 'Wrapper CSS classes',
        },
    },
    args: {
        onChange: (e) => {
            console.log('Text changed:', e.target.value);
        },
    },
};
exports.default = meta;
// Interactive demo wrapper
const AutoHeightTextareaDemo = (args) => {
    const [value, setValue] = (0, react_1.useState)(args.value || '');
    return (<div style={{ width: '500px' }}>
      <_1.default {...args} value={value} onChange={(e) => {
            setValue(e.target.value);
            console.log('Text changed:', e.target.value);
        }}/>
    </div>);
};
// Default state
exports.Default = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Type something...',
        value: '',
        minHeight: 36,
        maxHeight: 96,
        className: 'w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
};
// With initial value
exports.WithInitialValue = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Type something...',
        value: 'This is a pre-filled textarea with some initial content.',
        minHeight: 36,
        maxHeight: 96,
        className: 'w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
};
// With multiline content
exports.MultilineContent = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Type something...',
        value: 'Line 1\nLine 2\nLine 3\nLine 4\nThis textarea automatically expands to fit the content.',
        minHeight: 36,
        maxHeight: 96,
        className: 'w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
};
// Custom min height
exports.CustomMinHeight = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Taller minimum height...',
        value: '',
        minHeight: 100,
        maxHeight: 200,
        className: 'w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
};
// Small max height (scrollable)
exports.SmallMaxHeight = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Type multiple lines...',
        value: 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nThis will become scrollable when it exceeds max height.',
        minHeight: 36,
        maxHeight: 80,
        className: 'w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
};
// Auto focus enabled
exports.AutoFocus = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'This textarea auto-focuses on mount',
        value: '',
        minHeight: 36,
        maxHeight: 96,
        autoFocus: true,
        className: 'w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
};
// With custom styling
exports.CustomStyling = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Custom styled textarea...',
        value: '',
        minHeight: 50,
        maxHeight: 150,
        className: 'w-full p-3 bg-gray-50 border-2 border-blue-400 rounded-xl text-lg focus:outline-none focus:bg-white focus:border-blue-600',
        wrapperClassName: 'shadow-lg',
    },
};
// Long content example
exports.LongContent = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Type something...',
        value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        minHeight: 36,
        maxHeight: 200,
        className: 'w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
};
// Real-world example - Chat input
exports.ChatInput = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Type your message...',
        value: '',
        minHeight: 40,
        maxHeight: 120,
        className: 'w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500',
    },
};
// Real-world example - Comment box
exports.CommentBox = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Write a comment...',
        value: '',
        minHeight: 60,
        maxHeight: 200,
        className: 'w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
    },
};
// Interactive playground
exports.Playground = {
    render: args => <AutoHeightTextareaDemo {...args}/>,
    args: {
        placeholder: 'Type something...',
        value: '',
        minHeight: 36,
        maxHeight: 96,
        autoFocus: false,
        className: 'w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
        wrapperClassName: '',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBa0M7QUFFbEMsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsb0NBQW9DO0lBQzNDLFNBQVMsRUFBRSxVQUFrQjtJQUM3QixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLDZIQUE2SDthQUN6STtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsUUFBUSxFQUFFO1FBQ1IsV0FBVyxFQUFFO1lBQ1gsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsa0JBQWtCO1NBQ2hDO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsZ0JBQWdCO1NBQzlCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsTUFBTSxFQUFFLFNBQVM7WUFDakIsV0FBVyxFQUFFLGdCQUFnQjtTQUM5QjtRQUNELFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFdBQVcsRUFBRSwwQkFBMEI7U0FDeEM7UUFDRCxTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsUUFBUTtZQUNqQixXQUFXLEVBQUUsMEJBQTBCO1NBQ3hDO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLHFCQUFxQjtTQUNuQztRQUNELFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLHdCQUF3QjtTQUN0QztRQUNELGdCQUFnQixFQUFFO1lBQ2hCLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLHFCQUFxQjtTQUNuQztLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFF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QUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLElBQUksSUFBSSxDQUFDLEVBQUc7SUFDcEQsSUFBSSxFQUFFO1FBQ0osV0FBVyxFQUFFLHNCQUFzQjtRQUNuQyxLQUFLLEVBQUUsRUFBRTtRQUNULFNBQVMsRUFBRSxFQUFFO1FBQ2IsU0FBUyxFQUFFLEdBQUc7UUFDZCxTQUFTLEVBQUUsNElBQTRJO0tBQ3hKO0NBQ0YsQ0FBQTtBQUVELG1DQUFtQztBQUN0QixRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLElBQUksSUFBSSxDQUFDLEVBQUc7SUFDcEQsSUFBSSxFQUFFO1FBQ0osV0FBVyxFQUFFLG9CQUFvQjtRQUNqQyxLQUFLLEVBQUUsRUFBRTtRQUNULFNBQVMsRUFBRSxFQUFFO1FBQ2IsU0FBUyxFQUFFLEdBQUc7UUFDZCxTQUFTLEVBQUUsNEdBQTRHO0tBQ3hIO0NBQ0YsQ0FBQTtBQUVELHlCQUF5QjtBQUNaLFFBQUEsVUFBVSxHQUFVO0lBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztJQUNwRCxJQUFJLEVBQUU7UUFDSixXQUFXLEVBQUUsbUJBQW1CO1FBQ2hDLEtBQUssRUFBRSxFQUFFO1FBQ1QsU0FBUyxFQUFFLEVBQUU7UUFDYixTQUFTLEVBQUUsRUFBRTtRQUNiLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFNBQVMsRUFBRSxrR0FBa0c7UUFDN0csZ0JBQWdCLEVBQUUsRUFBRTtLQUNyQjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IEF1dG9IZWlnaHRUZXh0YXJlYSBmcm9tICcuJ1xuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRGF0YSBFbnRyeS9BdXRvSGVpZ2h0VGV4dGFyZWEnLFxuICBjb21wb25lbnQ6IEF1dG9IZWlnaHRUZXh0YXJlYSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2NlbnRlcmVkJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdBdXRvLXJlc2l6aW5nIHRleHRhcmVhIGNvbXBvbmVudCB0aGF0IGV4cGFuZHMgYW5kIGNvbnRyYWN0cyBiYXNlZCBvbiBjb250ZW50LCB3aXRoIGNvbmZpZ3VyYWJsZSBtaW4vbWF4IGhlaWdodCBjb25zdHJhaW50cy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ1R5cGVzOiB7XG4gICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGxhY2Vob2xkZXIgdGV4dCcsXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdUZXh0YXJlYSB2YWx1ZScsXG4gICAgfSxcbiAgICBvbkNoYW5nZToge1xuICAgICAgYWN0aW9uOiAnY2hhbmdlZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NoYW5nZSBoYW5kbGVyJyxcbiAgICB9LFxuICAgIG1pbkhlaWdodDoge1xuICAgICAgY29udHJvbDogJ251bWJlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ01pbmltdW0gaGVpZ2h0IGluIHBpeGVscycsXG4gICAgfSxcbiAgICBtYXhIZWlnaHQ6IHtcbiAgICAgIGNvbnRyb2w6ICdudW1iZXInLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXhpbXVtIGhlaWdodCBpbiBwaXhlbHMnLFxuICAgIH0sXG4gICAgYXV0b0ZvY3VzOiB7XG4gICAgICBjb250cm9sOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1dG8gZm9jdXMgb24gbW91bnQnLFxuICAgIH0sXG4gICAgY2xhc3NOYW1lOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FkZGl0aW9uYWwgQ1NTIGNsYXNzZXMnLFxuICAgIH0sXG4gICAgd3JhcHBlckNsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdXcmFwcGVyIENTUyBjbGFzc2VzJyxcbiAgICB9LFxuICB9LFxuICBhcmdzOiB7XG4gICAgb25DaGFuZ2U6IChlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnVGV4dCBjaGFuZ2VkOicsIGUudGFyZ2V0LnZhbHVlKVxuICAgIH0sXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBBdXRvSGVpZ2h0VGV4dGFyZWE+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuLy8gSW50ZXJhY3RpdmUgZGVtbyB3cmFwcGVyXG5jb25zdCBBdXRvSGVpZ2h0VGV4dGFyZWFEZW1vID0gKGFyZ3M6IGFueSkgPT4ge1xuICBjb25zdCBbdmFsdWUsIHNldFZhbHVlXSA9IHVzZVN0YXRlKGFyZ3MudmFsdWUgfHwgJycpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNTAwcHgnIH19PlxuICAgICAgPEF1dG9IZWlnaHRUZXh0YXJlYVxuICAgICAgICB7Li4uYXJnc31cbiAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICBzZXRWYWx1ZShlLnRhcmdldC52YWx1ZSlcbiAgICAgICAgICBjb25zb2xlLmxvZygnVGV4dCBjaGFuZ2VkOicsIGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICB9fVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG4vLyBEZWZhdWx0IHN0YXRlXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8QXV0b0hlaWdodFRleHRhcmVhRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBwbGFjZWhvbGRlcjogJ1R5cGUgc29tZXRoaW5nLi4uJyxcbiAgICB2YWx1ZTogJycsXG4gICAgbWluSGVpZ2h0OiAzNixcbiAgICBtYXhIZWlnaHQ6IDk2LFxuICAgIGNsYXNzTmFtZTogJ3ctZnVsbCBwLTIgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCByb3VuZGVkLWxnIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTUwMCcsXG4gIH0sXG59XG5cbi8vIFdpdGggaW5pdGlhbCB2YWx1ZVxuZXhwb3J0IGNvbnN0IFdpdGhJbml0aWFsVmFsdWU6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEF1dG9IZWlnaHRUZXh0YXJlYURlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgcGxhY2Vob2xkZXI6ICdUeXBlIHNvbWV0aGluZy4uLicsXG4gICAgdmFsdWU6ICdUaGlzIGlzIGEgcHJlLWZpbGxlZCB0ZXh0YXJlYSB3aXRoIHNvbWUgaW5pdGlhbCBjb250ZW50LicsXG4gICAgbWluSGVpZ2h0OiAzNixcbiAgICBtYXhIZWlnaHQ6IDk2LFxuICAgIGNsYXNzTmFtZTogJ3ctZnVsbCBwLTIgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCByb3VuZGVkLWxnIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTUwMCcsXG4gIH0sXG59XG5cbi8vIFdpdGggbXVsdGlsaW5lIGNvbnRlbnRcbmV4cG9ydCBjb25zdCBNdWx0aWxpbmVDb250ZW50OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxBdXRvSGVpZ2h0VGV4dGFyZWFEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHBsYWNlaG9sZGVyOiAnVHlwZSBzb21ldGhpbmcuLi4nLFxuICAgIHZhbHVlOiAnTGluZSAxXFxuTGluZSAyXFxuTGluZSAzXFxuTGluZSA0XFxuVGhpcyB0ZXh0YXJlYSBhdXRvbWF0aWNhbGx5IGV4cGFuZHMgdG8gZml0IHRoZSBjb250ZW50LicsXG4gICAgbWluSGVpZ2h0OiAzNixcbiAgICBtYXhIZWlnaHQ6IDk2LFxuICAgIGNsYXNzTmFtZTogJ3ctZnVsbCBwLTIgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCByb3VuZGVkLWxnIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTUwMCcsXG4gIH0sXG59XG5cbi8vIEN1c3RvbSBtaW4gaGVpZ2h0XG5leHBvcnQgY29uc3QgQ3VzdG9tTWluSGVpZ2h0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxBdXRvSGVpZ2h0VGV4dGFyZWFEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHBsYWNlaG9sZGVyOiAnVGFsbGVyIG1pbmltdW0gaGVpZ2h0Li4uJyxcbiAgICB2YWx1ZTogJycsXG4gICAgbWluSGVpZ2h0OiAxMDAsXG4gICAgbWF4SGVpZ2h0OiAyMDAsXG4gICAgY2xhc3NOYW1lOiAndy1mdWxsIHAtMiBib3JkZXIgYm9yZGVyLWdyYXktMzAwIHJvdW5kZWQtbGcgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctMiBmb2N1czpyaW5nLWJsdWUtNTAwJyxcbiAgfSxcbn1cblxuLy8gU21hbGwgbWF4IGhlaWdodCAoc2Nyb2xsYWJsZSlcbmV4cG9ydCBjb25zdCBTbWFsbE1heEhlaWdodDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8QXV0b0hlaWdodFRleHRhcmVhRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBwbGFjZWhvbGRlcjogJ1R5cGUgbXVsdGlwbGUgbGluZXMuLi4nLFxuICAgIHZhbHVlOiAnTGluZSAxXFxuTGluZSAyXFxuTGluZSAzXFxuTGluZSA0XFxuTGluZSA1XFxuTGluZSA2XFxuVGhpcyB3aWxsIGJlY29tZSBzY3JvbGxhYmxlIHdoZW4gaXQgZXhjZWVkcyBtYXggaGVpZ2h0LicsXG4gICAgbWluSGVpZ2h0OiAzNixcbiAgICBtYXhIZWlnaHQ6IDgwLFxuICAgIGNsYXNzTmFtZTogJ3ctZnVsbCBwLTIgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCByb3VuZGVkLWxnIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTUwMCcsXG4gIH0sXG59XG5cbi8vIEF1dG8gZm9jdXMgZW5hYmxlZFxuZXhwb3J0IGNvbnN0IEF1dG9Gb2N1czogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8QXV0b0hlaWdodFRleHRhcmVhRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBwbGFjZWhvbGRlcjogJ1RoaXMgdGV4dGFyZWEgYXV0by1mb2N1c2VzIG9uIG1vdW50JyxcbiAgICB2YWx1ZTogJycsXG4gICAgbWluSGVpZ2h0OiAzNixcbiAgICBtYXhIZWlnaHQ6IDk2LFxuICAgIGF1dG9Gb2N1czogdHJ1ZSxcbiAgICBjbGFzc05hbWU6ICd3LWZ1bGwgcC0yIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcm91bmRlZC1sZyBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctYmx1ZS01MDAnLFxuICB9LFxufVxuXG4vLyBXaXRoIGN1c3RvbSBzdHlsaW5nXG5leHBvcnQgY29uc3QgQ3VzdG9tU3R5bGluZzogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8QXV0b0hlaWdodFRleHRhcmVhRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBwbGFjZWhvbGRlcjogJ0N1c3RvbSBzdHlsZWQgdGV4dGFyZWEuLi4nLFxuICAgIHZhbHVlOiAnJyxcbiAgICBtaW5IZWlnaHQ6IDUwLFxuICAgIG1heEhlaWdodDogMTUwLFxuICAgIGNsYXNzTmFtZTogJ3ctZnVsbCBwLTMgYmctZ3JheS01MCBib3JkZXItMiBib3JkZXItYmx1ZS00MDAgcm91bmRlZC14bCB0ZXh0LWxnIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpiZy13aGl0ZSBmb2N1czpib3JkZXItYmx1ZS02MDAnLFxuICAgIHdyYXBwZXJDbGFzc05hbWU6ICdzaGFkb3ctbGcnLFxuICB9LFxufVxuXG4vLyBMb25nIGNvbnRlbnQgZXhhbXBsZVxuZXhwb3J0IGNvbnN0IExvbmdDb250ZW50OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxBdXRvSGVpZ2h0VGV4dGFyZWFEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHBsYWNlaG9sZGVyOiAnVHlwZSBzb21ldGhpbmcuLi4nLFxuICAgIHZhbHVlOiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gU2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuXFxuXFxuVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC5cXG5cXG5EdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci5cXG5cXG5FeGNlcHRldXIgc2ludCBvY2NhZWNhdCBjdXBpZGF0YXQgbm9uIHByb2lkZW50LCBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtLicsXG4gICAgbWluSGVpZ2h0OiAzNixcbiAgICBtYXhIZWlnaHQ6IDIwMCxcbiAgICBjbGFzc05hbWU6ICd3LWZ1bGwgcC0yIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcm91bmRlZC1sZyBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctYmx1ZS01MDAnLFxuICB9LFxufVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBDaGF0IGlucHV0XG5leHBvcnQgY29uc3QgQ2hhdElucHV0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxBdXRvSGVpZ2h0VGV4dGFyZWFEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHBsYWNlaG9sZGVyOiAnVHlwZSB5b3VyIG1lc3NhZ2UuLi4nLFxuICAgIHZhbHVlOiAnJyxcbiAgICBtaW5IZWlnaHQ6IDQwLFxuICAgIG1heEhlaWdodDogMTIwLFxuICAgIGNsYXNzTmFtZTogJ3ctZnVsbCBweC00IHB5LTIgYmctZ3JheS0xMDAgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCByb3VuZGVkLTJ4bCB0ZXh0LXNtIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpiZy13aGl0ZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTUwMCcsXG4gIH0sXG59XG5cbi8vIFJlYWwtd29ybGQgZXhhbXBsZSAtIENvbW1lbnQgYm94XG5leHBvcnQgY29uc3QgQ29tbWVudEJveDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8QXV0b0hlaWdodFRleHRhcmVhRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBwbGFjZWhvbGRlcjogJ1dyaXRlIGEgY29tbWVudC4uLicsXG4gICAgdmFsdWU6ICcnLFxuICAgIG1pbkhlaWdodDogNjAsXG4gICAgbWF4SGVpZ2h0OiAyMDAsXG4gICAgY2xhc3NOYW1lOiAndy1mdWxsIHAtMyBib3JkZXIgYm9yZGVyLWdyYXktMzAwIHJvdW5kZWQtbGcgdGV4dC1zbSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctaW5kaWdvLTUwMCcsXG4gIH0sXG59XG5cbi8vIEludGVyYWN0aXZlIHBsYXlncm91bmRcbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxBdXRvSGVpZ2h0VGV4dGFyZWFEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHBsYWNlaG9sZGVyOiAnVHlwZSBzb21ldGhpbmcuLi4nLFxuICAgIHZhbHVlOiAnJyxcbiAgICBtaW5IZWlnaHQ6IDM2LFxuICAgIG1heEhlaWdodDogOTYsXG4gICAgYXV0b0ZvY3VzOiBmYWxzZSxcbiAgICBjbGFzc05hbWU6ICd3LWZ1bGwgcC0yIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcm91bmRlZC1sZyBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctYmx1ZS01MDAnLFxuICAgIHdyYXBwZXJDbGFzc05hbWU6ICcnLFxuICB9LFxufVxuIl19