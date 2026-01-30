"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = exports.CustomStyling = exports.NotificationTemplate = exports.EmailTemplate = exports.AdjacentVariables = exports.VariablesWithUnderscores = exports.LongContent = exports.EmptyState = exports.ReadOnlyMode = exports.ComplexTemplate = exports.MultipleVariables = exports.SingleVariable = exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Data Entry/BlockInput',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Block input component with variable highlighting. Supports {{variable}} syntax with validation and visual highlighting of variable names.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'Input value (supports {{variable}} syntax)',
        },
        className: {
            control: 'text',
            description: 'Wrapper CSS classes',
        },
        highLightClassName: {
            control: 'text',
            description: 'CSS class for highlighted variables (default: text-blue-500)',
        },
        readonly: {
            control: 'boolean',
            description: 'Read-only mode',
        },
    },
};
exports.default = meta;
// Interactive demo wrapper
const BlockInputDemo = (args) => {
    const [value, setValue] = (0, react_1.useState)(args.value || '');
    const [keys, setKeys] = (0, react_1.useState)([]);
    return (<div style={{ width: '600px' }}>
      <_1.default {...args} value={value} onConfirm={(newValue, extractedKeys) => {
            setValue(newValue);
            setKeys(extractedKeys);
            console.log('Value confirmed:', newValue);
            console.log('Extracted keys:', extractedKeys);
        }}/>
      {keys.length > 0 && (<div className="mt-4 rounded-lg bg-blue-50 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">Detected Variables:</div>
          <div className="flex flex-wrap gap-2">
            {keys.map(key => (<span key={key} className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                {key}
              </span>))}
          </div>
        </div>)}
    </div>);
};
// Default state
exports.Default = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: '',
        readonly: false,
    },
};
// With single variable
exports.SingleVariable = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'Hello {{name}}, welcome to the application!',
        readonly: false,
    },
};
// With multiple variables
exports.MultipleVariables = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'Dear {{user_name}},\n\nYour order {{order_id}} has been shipped to {{address}}.\n\nThank you for shopping with us!',
        readonly: false,
    },
};
// Complex template
exports.ComplexTemplate = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'Hi {{customer_name}},\n\nYour {{product_type}} subscription will renew on {{renewal_date}} for {{amount}}.\n\nYour payment method ending in {{card_last_4}} will be charged.\n\nQuestions? Contact us at {{support_email}}.',
        readonly: false,
    },
};
// Read-only mode
exports.ReadOnlyMode = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'This is a read-only template with {{variable1}} and {{variable2}}.\n\nYou cannot edit this content.',
        readonly: true,
    },
};
// Empty state
exports.EmptyState = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: '',
        readonly: false,
    },
};
// Long content
exports.LongContent = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'Dear {{recipient_name}},\n\nWe are writing to inform you about the upcoming changes to your {{service_name}} account.\n\nEffective {{effective_date}}, your plan will include:\n\n1. Access to {{feature_1}}\n2. {{feature_2}} with unlimited usage\n3. Priority support via {{support_channel}}\n4. Monthly reports sent to {{email_address}}\n\nYour new monthly rate will be {{new_price}}, compared to your current rate of {{old_price}}.\n\nIf you have any questions, please contact our team at {{contact_info}}.\n\nBest regards,\n{{company_name}} Team',
        readonly: false,
    },
};
// Variables with underscores
exports.VariablesWithUnderscores = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'User {{user_id}} from {{user_country}} has {{total_orders}} orders with status {{order_status}}.',
        readonly: false,
    },
};
// Adjacent variables
exports.AdjacentVariables = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'File: {{file_name}}.{{file_extension}} ({{file_size}}{{size_unit}})',
        readonly: false,
    },
};
// Real-world example - Email template
exports.EmailTemplate = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'Subject: Your {{service_name}} account has been created\n\nHi {{first_name}},\n\nWelcome to {{company_name}}! Your account is now active.\n\nUsername: {{username}}\nEmail: {{email}}\n\nGet started at {{app_url}}\n\nThanks,\nThe {{company_name}} Team',
        readonly: false,
    },
};
// Real-world example - Notification template
exports.NotificationTemplate = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: '🔔 {{user_name}} mentioned you in {{channel_name}}\n\n"{{message_preview}}"\n\nReply now: {{message_url}}',
        readonly: false,
    },
};
// Custom styling
exports.CustomStyling = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'This template uses {{custom_variable}} with custom styling.',
        readonly: false,
        className: 'bg-gray-50 border-2 border-blue-200',
    },
};
// Interactive playground
exports.Playground = {
    render: args => <BlockInputDemo {...args}/>,
    args: {
        value: 'Try editing this text and adding variables like {{example}}',
        readonly: false,
        className: '',
        highLightClassName: '',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBMEI7QUFFMUIsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsNEJBQTRCO0lBQ25DLFNBQVMsRUFBRSxVQUFVO0lBQ3JCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsMklBQTJJO2FBQ3ZKO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSw0Q0FBNEM7U0FDMUQ7UUFDRCxTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxxQkFBcUI7U0FDbkM7UUFDRCxrQkFBa0IsRUFBRTtZQUNsQixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSw4REFBOEQ7U0FDNUU7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsZ0JBQWdCO1NBQzlCO0tBQ0Y7Q0FDZ0MsQ0FBQTtBQUVuQyxrQkFBZSxJQUFJLENBQUE7QUFHbkIsMkJBQTJCO0FBQzNCLE1BQU0sY0FBYyxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7SUFDbkMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNwRCxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBVyxFQUFFLENBQUMsQ0FBQTtJQUU5QyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsS0FB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QUFHO0lBQzVDLElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSwyR0FBMkc7UUFDbEgsUUFBUSxFQUFFLEtBQUs7S0FDaEI7Q0FDRixDQUFBO0FBRUQsaUJBQWlCO0FBQ0osUUFBQSxhQUFhLEdBQVU7SUFDbEMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztJQUM1QyxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsNkRBQTZEO1FBQ3BFLFFBQVEsRUFBRSxLQUFLO1FBQ2YsU0FBUyxFQUFFLHFDQUFxQztLQUNqRDtDQUNGLENBQUE7QUFFRCx5QkFBeUI7QUFDWixRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0lBQzVDLElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSw2REFBNkQ7UUFDcEUsUUFBUSxFQUFFLEtBQUs7UUFDZixTQUFTLEVBQUUsRUFBRTtRQUNiLGtCQUFrQixFQUFFLEVBQUU7S0FDdkI7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBCbG9ja0lucHV0IGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIEVudHJ5L0Jsb2NrSW5wdXQnLFxuICBjb21wb25lbnQ6IEJsb2NrSW5wdXQsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnQmxvY2sgaW5wdXQgY29tcG9uZW50IHdpdGggdmFyaWFibGUgaGlnaGxpZ2h0aW5nLiBTdXBwb3J0cyB7e3ZhcmlhYmxlfX0gc3ludGF4IHdpdGggdmFsaWRhdGlvbiBhbmQgdmlzdWFsIGhpZ2hsaWdodGluZyBvZiB2YXJpYWJsZSBuYW1lcy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ1R5cGVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSW5wdXQgdmFsdWUgKHN1cHBvcnRzIHt7dmFyaWFibGV9fSBzeW50YXgpJyxcbiAgICB9LFxuICAgIGNsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdXcmFwcGVyIENTUyBjbGFzc2VzJyxcbiAgICB9LFxuICAgIGhpZ2hMaWdodENsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdDU1MgY2xhc3MgZm9yIGhpZ2hsaWdodGVkIHZhcmlhYmxlcyAoZGVmYXVsdDogdGV4dC1ibHVlLTUwMCknLFxuICAgIH0sXG4gICAgcmVhZG9ubHk6IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUmVhZC1vbmx5IG1vZGUnLFxuICAgIH0sXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBCbG9ja0lucHV0PlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbi8vIEludGVyYWN0aXZlIGRlbW8gd3JhcHBlclxuY29uc3QgQmxvY2tJbnB1dERlbW8gPSAoYXJnczogYW55KSA9PiB7XG4gIGNvbnN0IFt2YWx1ZSwgc2V0VmFsdWVdID0gdXNlU3RhdGUoYXJncy52YWx1ZSB8fCAnJylcbiAgY29uc3QgW2tleXMsIHNldEtleXNdID0gdXNlU3RhdGU8c3RyaW5nW10+KFtdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzYwMHB4JyB9fT5cbiAgICAgIDxCbG9ja0lucHV0XG4gICAgICAgIHsuLi5hcmdzfVxuICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgIG9uQ29uZmlybT17KG5ld1ZhbHVlLCBleHRyYWN0ZWRLZXlzKSA9PiB7XG4gICAgICAgICAgc2V0VmFsdWUobmV3VmFsdWUpXG4gICAgICAgICAgc2V0S2V5cyhleHRyYWN0ZWRLZXlzKVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdWYWx1ZSBjb25maXJtZWQ6JywgbmV3VmFsdWUpXG4gICAgICAgICAgY29uc29sZS5sb2coJ0V4dHJhY3RlZCBrZXlzOicsIGV4dHJhY3RlZEtleXMpXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICAge2tleXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCByb3VuZGVkLWxnIGJnLWJsdWUtNTAgcC0zXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTcwMFwiPkRldGVjdGVkIFZhcmlhYmxlczo8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGdhcC0yXCI+XG4gICAgICAgICAgICB7a2V5cy5tYXAoa2V5ID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtrZXl9IGNsYXNzTmFtZT1cInJvdW5kZWQgYmctYmx1ZS01MDAgcHgtMiBweS0xIHRleHQteHMgdGV4dC13aGl0ZVwiPlxuICAgICAgICAgICAgICAgIHtrZXl9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuLy8gRGVmYXVsdCBzdGF0ZVxuZXhwb3J0IGNvbnN0IERlZmF1bHQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEJsb2NrSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiAnJyxcbiAgICByZWFkb25seTogZmFsc2UsXG4gIH0sXG59XG5cbi8vIFdpdGggc2luZ2xlIHZhcmlhYmxlXG5leHBvcnQgY29uc3QgU2luZ2xlVmFyaWFibGU6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEJsb2NrSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiAnSGVsbG8ge3tuYW1lfX0sIHdlbGNvbWUgdG8gdGhlIGFwcGxpY2F0aW9uIScsXG4gICAgcmVhZG9ubHk6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBXaXRoIG11bHRpcGxlIHZhcmlhYmxlc1xuZXhwb3J0IGNvbnN0IE11bHRpcGxlVmFyaWFibGVzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxCbG9ja0lucHV0RGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB2YWx1ZTogJ0RlYXIge3t1c2VyX25hbWV9fSxcXG5cXG5Zb3VyIG9yZGVyIHt7b3JkZXJfaWR9fSBoYXMgYmVlbiBzaGlwcGVkIHRvIHt7YWRkcmVzc319LlxcblxcblRoYW5rIHlvdSBmb3Igc2hvcHBpbmcgd2l0aCB1cyEnLFxuICAgIHJlYWRvbmx5OiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gQ29tcGxleCB0ZW1wbGF0ZVxuZXhwb3J0IGNvbnN0IENvbXBsZXhUZW1wbGF0ZTogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8QmxvY2tJbnB1dERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgdmFsdWU6ICdIaSB7e2N1c3RvbWVyX25hbWV9fSxcXG5cXG5Zb3VyIHt7cHJvZHVjdF90eXBlfX0gc3Vic2NyaXB0aW9uIHdpbGwgcmVuZXcgb24ge3tyZW5ld2FsX2RhdGV9fSBmb3Ige3thbW91bnR9fS5cXG5cXG5Zb3VyIHBheW1lbnQgbWV0aG9kIGVuZGluZyBpbiB7e2NhcmRfbGFzdF80fX0gd2lsbCBiZSBjaGFyZ2VkLlxcblxcblF1ZXN0aW9ucz8gQ29udGFjdCB1cyBhdCB7e3N1cHBvcnRfZW1haWx9fS4nLFxuICAgIHJlYWRvbmx5OiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gUmVhZC1vbmx5IG1vZGVcbmV4cG9ydCBjb25zdCBSZWFkT25seU1vZGU6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEJsb2NrSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiAnVGhpcyBpcyBhIHJlYWQtb25seSB0ZW1wbGF0ZSB3aXRoIHt7dmFyaWFibGUxfX0gYW5kIHt7dmFyaWFibGUyfX0uXFxuXFxuWW91IGNhbm5vdCBlZGl0IHRoaXMgY29udGVudC4nLFxuICAgIHJlYWRvbmx5OiB0cnVlLFxuICB9LFxufVxuXG4vLyBFbXB0eSBzdGF0ZVxuZXhwb3J0IGNvbnN0IEVtcHR5U3RhdGU6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEJsb2NrSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiAnJyxcbiAgICByZWFkb25seTogZmFsc2UsXG4gIH0sXG59XG5cbi8vIExvbmcgY29udGVudFxuZXhwb3J0IGNvbnN0IExvbmdDb250ZW50OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxCbG9ja0lucHV0RGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB2YWx1ZTogJ0RlYXIge3tyZWNpcGllbnRfbmFtZX19LFxcblxcbldlIGFyZSB3cml0aW5nIHRvIGluZm9ybSB5b3UgYWJvdXQgdGhlIHVwY29taW5nIGNoYW5nZXMgdG8geW91ciB7e3NlcnZpY2VfbmFtZX19IGFjY291bnQuXFxuXFxuRWZmZWN0aXZlIHt7ZWZmZWN0aXZlX2RhdGV9fSwgeW91ciBwbGFuIHdpbGwgaW5jbHVkZTpcXG5cXG4xLiBBY2Nlc3MgdG8ge3tmZWF0dXJlXzF9fVxcbjIuIHt7ZmVhdHVyZV8yfX0gd2l0aCB1bmxpbWl0ZWQgdXNhZ2VcXG4zLiBQcmlvcml0eSBzdXBwb3J0IHZpYSB7e3N1cHBvcnRfY2hhbm5lbH19XFxuNC4gTW9udGhseSByZXBvcnRzIHNlbnQgdG8ge3tlbWFpbF9hZGRyZXNzfX1cXG5cXG5Zb3VyIG5ldyBtb250aGx5IHJhdGUgd2lsbCBiZSB7e25ld19wcmljZX19LCBjb21wYXJlZCB0byB5b3VyIGN1cnJlbnQgcmF0ZSBvZiB7e29sZF9wcmljZX19LlxcblxcbklmIHlvdSBoYXZlIGFueSBxdWVzdGlvbnMsIHBsZWFzZSBjb250YWN0IG91ciB0ZWFtIGF0IHt7Y29udGFjdF9pbmZvfX0uXFxuXFxuQmVzdCByZWdhcmRzLFxcbnt7Y29tcGFueV9uYW1lfX0gVGVhbScsXG4gICAgcmVhZG9ubHk6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBWYXJpYWJsZXMgd2l0aCB1bmRlcnNjb3Jlc1xuZXhwb3J0IGNvbnN0IFZhcmlhYmxlc1dpdGhVbmRlcnNjb3JlczogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8QmxvY2tJbnB1dERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgdmFsdWU6ICdVc2VyIHt7dXNlcl9pZH19IGZyb20ge3t1c2VyX2NvdW50cnl9fSBoYXMge3t0b3RhbF9vcmRlcnN9fSBvcmRlcnMgd2l0aCBzdGF0dXMge3tvcmRlcl9zdGF0dXN9fS4nLFxuICAgIHJlYWRvbmx5OiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gQWRqYWNlbnQgdmFyaWFibGVzXG5leHBvcnQgY29uc3QgQWRqYWNlbnRWYXJpYWJsZXM6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEJsb2NrSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiAnRmlsZToge3tmaWxlX25hbWV9fS57e2ZpbGVfZXh0ZW5zaW9ufX0gKHt7ZmlsZV9zaXplfX17e3NpemVfdW5pdH19KScsXG4gICAgcmVhZG9ubHk6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBFbWFpbCB0ZW1wbGF0ZVxuZXhwb3J0IGNvbnN0IEVtYWlsVGVtcGxhdGU6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEJsb2NrSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiAnU3ViamVjdDogWW91ciB7e3NlcnZpY2VfbmFtZX19IGFjY291bnQgaGFzIGJlZW4gY3JlYXRlZFxcblxcbkhpIHt7Zmlyc3RfbmFtZX19LFxcblxcbldlbGNvbWUgdG8ge3tjb21wYW55X25hbWV9fSEgWW91ciBhY2NvdW50IGlzIG5vdyBhY3RpdmUuXFxuXFxuVXNlcm5hbWU6IHt7dXNlcm5hbWV9fVxcbkVtYWlsOiB7e2VtYWlsfX1cXG5cXG5HZXQgc3RhcnRlZCBhdCB7e2FwcF91cmx9fVxcblxcblRoYW5rcyxcXG5UaGUge3tjb21wYW55X25hbWV9fSBUZWFtJyxcbiAgICByZWFkb25seTogZmFsc2UsXG4gIH0sXG59XG5cbi8vIFJlYWwtd29ybGQgZXhhbXBsZSAtIE5vdGlmaWNhdGlvbiB0ZW1wbGF0ZVxuZXhwb3J0IGNvbnN0IE5vdGlmaWNhdGlvblRlbXBsYXRlOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxCbG9ja0lucHV0RGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB2YWx1ZTogJ/CflJQge3t1c2VyX25hbWV9fSBtZW50aW9uZWQgeW91IGluIHt7Y2hhbm5lbF9uYW1lfX1cXG5cXG5cInt7bWVzc2FnZV9wcmV2aWV3fX1cIlxcblxcblJlcGx5IG5vdzoge3ttZXNzYWdlX3VybH19JyxcbiAgICByZWFkb25seTogZmFsc2UsXG4gIH0sXG59XG5cbi8vIEN1c3RvbSBzdHlsaW5nXG5leHBvcnQgY29uc3QgQ3VzdG9tU3R5bGluZzogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8QmxvY2tJbnB1dERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgdmFsdWU6ICdUaGlzIHRlbXBsYXRlIHVzZXMge3tjdXN0b21fdmFyaWFibGV9fSB3aXRoIGN1c3RvbSBzdHlsaW5nLicsXG4gICAgcmVhZG9ubHk6IGZhbHNlLFxuICAgIGNsYXNzTmFtZTogJ2JnLWdyYXktNTAgYm9yZGVyLTIgYm9yZGVyLWJsdWUtMjAwJyxcbiAgfSxcbn1cblxuLy8gSW50ZXJhY3RpdmUgcGxheWdyb3VuZFxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEJsb2NrSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiAnVHJ5IGVkaXRpbmcgdGhpcyB0ZXh0IGFuZCBhZGRpbmcgdmFyaWFibGVzIGxpa2Uge3tleGFtcGxlfX0nLFxuICAgIHJlYWRvbmx5OiBmYWxzZSxcbiAgICBjbGFzc05hbWU6ICcnLFxuICAgIGhpZ2hMaWdodENsYXNzTmFtZTogJycsXG4gIH0sXG59XG4iXX0=