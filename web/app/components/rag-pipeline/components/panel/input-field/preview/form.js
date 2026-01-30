"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form_1 = require("@/app/components/base/form");
const field_1 = require("@/app/components/base/form/form-scenarios/base/field");
const use_input_fields_1 = require("@/app/components/rag-pipeline/hooks/use-input-fields");
const Form = ({ variables, }) => {
    const initialData = (0, use_input_fields_1.useInitialData)(variables);
    const configurations = (0, use_input_fields_1.useConfigurations)(variables);
    const form = (0, form_1.useAppForm)({
        defaultValues: initialData,
    });
    return (<form className="w-full" onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}>
      <div className="flex flex-col gap-y-3 px-4 py-3">
        {configurations.map((config, index) => {
            const FieldComponent = (0, field_1.default)({
                initialData,
                config,
            });
            return <FieldComponent key={index} form={form}/>;
        })}
      </div>
    </form>);
};
exports.default = Form;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscURBQXVEO0FBQ3ZELGdGQUE0RTtBQUM1RSwyRkFBd0c7QUFNeEcsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUNaLFNBQVMsR0FDQyxFQUFFLEVBQUU7SUFDZCxNQUFNLFdBQVcsR0FBRyxJQUFBLGlDQUFjLEVBQUMsU0FBUyxDQUFDLENBQUE7SUFDN0MsTUFBTSxjQUFjLEdBQUcsSUFBQSxvQ0FBaUIsRUFBQyxTQUFTLENBQUMsQ0FBQTtJQUVuRCxNQUFNLElBQUksR0FBRyxJQUFBLGlCQUFVLEVBQUM7UUFDdEIsYUFBYSxFQUFFLFdBQVc7S0FDM0IsQ0FBQyxDQUFBO0lBRUYsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUNILFNBQVMsQ0FBQyxRQUFRLENBQ2xCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDZCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7WUFDbEIsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO1FBQ3JCLENBQUMsQ0FBQyxDQUVGO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlDQUFpQyxDQUM5QztRQUFBLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNwQyxNQUFNLGNBQWMsR0FBRyxJQUFBLGVBQVMsRUFBQztnQkFDL0IsV0FBVztnQkFDWCxNQUFNO2FBQ1AsQ0FBQyxDQUFBO1lBQ0YsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRyxDQUFBO1FBQ25ELENBQUMsQ0FBQyxDQUNKO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJBR1BpcGVsaW5lVmFyaWFibGVzIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgeyB1c2VBcHBGb3JtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0nXG5pbXBvcnQgQmFzZUZpZWxkIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL2Zvcm0tc2NlbmFyaW9zL2Jhc2UvZmllbGQnXG5pbXBvcnQgeyB1c2VDb25maWd1cmF0aW9ucywgdXNlSW5pdGlhbERhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3JhZy1waXBlbGluZS9ob29rcy91c2UtaW5wdXQtZmllbGRzJ1xuXG50eXBlIEZvcm1Qcm9wcyA9IHtcbiAgdmFyaWFibGVzOiBSQUdQaXBlbGluZVZhcmlhYmxlc1xufVxuXG5jb25zdCBGb3JtID0gKHtcbiAgdmFyaWFibGVzLFxufTogRm9ybVByb3BzKSA9PiB7XG4gIGNvbnN0IGluaXRpYWxEYXRhID0gdXNlSW5pdGlhbERhdGEodmFyaWFibGVzKVxuICBjb25zdCBjb25maWd1cmF0aW9ucyA9IHVzZUNvbmZpZ3VyYXRpb25zKHZhcmlhYmxlcylcblxuICBjb25zdCBmb3JtID0gdXNlQXBwRm9ybSh7XG4gICAgZGVmYXVsdFZhbHVlczogaW5pdGlhbERhdGEsXG4gIH0pXG5cbiAgcmV0dXJuIChcbiAgICA8Zm9ybVxuICAgICAgY2xhc3NOYW1lPVwidy1mdWxsXCJcbiAgICAgIG9uU3VibWl0PXsoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgfX1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLXktMyBweC00IHB5LTNcIj5cbiAgICAgICAge2NvbmZpZ3VyYXRpb25zLm1hcCgoY29uZmlnLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IEZpZWxkQ29tcG9uZW50ID0gQmFzZUZpZWxkKHtcbiAgICAgICAgICAgIGluaXRpYWxEYXRhLFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIDxGaWVsZENvbXBvbmVudCBrZXk9e2luZGV4fSBmb3JtPXtmb3JtfSAvPlxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZm9ybT5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBGb3JtXG4iXX0=