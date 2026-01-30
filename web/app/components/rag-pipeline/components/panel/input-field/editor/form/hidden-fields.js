"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_form_1 = require("@tanstack/react-form");
const React = require("react");
const form_1 = require("@/app/components/base/form");
const field_1 = require("@/app/components/base/form/form-scenarios/input-field/field");
const hooks_1 = require("./hooks");
const HiddenFields = ({ initialData, }) => (0, form_1.withForm)({
    defaultValues: initialData,
    render: function Render({ form, }) {
        const options = (0, react_form_1.useStore)(form.store, state => state.values.options);
        const hiddenConfigurations = (0, hooks_1.useHiddenConfigurations)({
            options,
        });
        return (<>
        {hiddenConfigurations.map((config, index) => {
                const FieldComponent = (0, field_1.default)({
                    initialData,
                    config,
                });
                return <FieldComponent key={index} form={form}/>;
            })}
      </>);
    },
});
exports.default = HiddenFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlkZGVuLWZpZWxkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhpZGRlbi1maWVsZHMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQStDO0FBQy9DLCtCQUE4QjtBQUM5QixxREFBcUQ7QUFDckQsdUZBQW9GO0FBQ3BGLG1DQUFpRDtBQU1qRCxNQUFNLFlBQVksR0FBRyxDQUFDLEVBQ3BCLFdBQVcsR0FDTyxFQUFFLEVBQUUsQ0FBQyxJQUFBLGVBQVEsRUFBQztJQUNoQyxhQUFhLEVBQUUsV0FBVztJQUMxQixNQUFNLEVBQUUsU0FBUyxNQUFNLENBQUMsRUFDdEIsSUFBSSxHQUNMO1FBQ0MsTUFBTSxPQUFPLEdBQUcsSUFBQSxxQkFBUSxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRW5FLE1BQU0sb0JBQW9CLEdBQUcsSUFBQSwrQkFBdUIsRUFBQztZQUNuRCxPQUFPO1NBQ1IsQ0FBQyxDQUFBO1FBRUYsT0FBTyxDQUNMLEVBQ0U7UUFBQSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDMUMsTUFBTSxjQUFjLEdBQUcsSUFBQSxlQUFVLEVBQUM7b0JBQ2hDLFdBQVc7b0JBQ1gsTUFBTTtpQkFDUCxDQUFDLENBQUE7Z0JBQ0YsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRyxDQUFBO1lBQ25ELENBQUMsQ0FBQyxDQUNKO01BQUEsR0FBRyxDQUNKLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtZm9ybSdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgd2l0aEZvcm0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybSdcbmltcG9ydCBJbnB1dEZpZWxkIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL2Zvcm0tc2NlbmFyaW9zL2lucHV0LWZpZWxkL2ZpZWxkJ1xuaW1wb3J0IHsgdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMgfSBmcm9tICcuL2hvb2tzJ1xuXG50eXBlIEhpZGRlbkZpZWxkc1Byb3BzID0ge1xuICBpbml0aWFsRGF0YT86IFJlY29yZDxzdHJpbmcsIGFueT5cbn1cblxuY29uc3QgSGlkZGVuRmllbGRzID0gKHtcbiAgaW5pdGlhbERhdGEsXG59OiBIaWRkZW5GaWVsZHNQcm9wcykgPT4gd2l0aEZvcm0oe1xuICBkZWZhdWx0VmFsdWVzOiBpbml0aWFsRGF0YSxcbiAgcmVuZGVyOiBmdW5jdGlvbiBSZW5kZXIoe1xuICAgIGZvcm0sXG4gIH0pIHtcbiAgICBjb25zdCBvcHRpb25zID0gdXNlU3RvcmUoZm9ybS5zdG9yZSwgc3RhdGUgPT4gc3RhdGUudmFsdWVzLm9wdGlvbnMpXG5cbiAgICBjb25zdCBoaWRkZW5Db25maWd1cmF0aW9ucyA9IHVzZUhpZGRlbkNvbmZpZ3VyYXRpb25zKHtcbiAgICAgIG9wdGlvbnMsXG4gICAgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8PlxuICAgICAgICB7aGlkZGVuQ29uZmlndXJhdGlvbnMubWFwKChjb25maWcsIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgRmllbGRDb21wb25lbnQgPSBJbnB1dEZpZWxkKHtcbiAgICAgICAgICAgIGluaXRpYWxEYXRhLFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIDxGaWVsZENvbXBvbmVudCBrZXk9e2luZGV4fSBmb3JtPXtmb3JtfSAvPlxuICAgICAgICB9KX1cbiAgICAgIDwvPlxuICAgIClcbiAgfSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IEhpZGRlbkZpZWxkc1xuIl19