"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const form_1 = require("@/app/components/base/form");
const field_1 = require("@/app/components/base/form/form-scenarios/input-field/field");
const hooks_1 = require("./hooks");
const InitialFields = ({ initialData, supportFile, }) => (0, form_1.withForm)({
    defaultValues: initialData,
    render: function Render({ form, }) {
        const getFieldValue = (0, react_1.useCallback)((fieldName) => {
            return form.getFieldValue(fieldName);
        }, [form]);
        const setFieldValue = (0, react_1.useCallback)((fieldName, value) => {
            form.setFieldValue(fieldName, value);
        }, [form]);
        const initialConfigurations = (0, hooks_1.useConfigurations)({
            getFieldValue,
            setFieldValue,
            supportFile,
        });
        return (<>
        {initialConfigurations.map((config, index) => {
                const FieldComponent = (0, field_1.default)({
                    initialData,
                    config,
                });
                return <FieldComponent key={index} form={form}/>;
            })}
      </>);
    },
});
exports.default = InitialFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbC1maWVsZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbml0aWFsLWZpZWxkcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFDOUIsaUNBQW1DO0FBQ25DLHFEQUFxRDtBQUNyRCx1RkFBb0Y7QUFDcEYsbUNBQTJDO0FBTzNDLE1BQU0sYUFBYSxHQUFHLENBQUMsRUFDckIsV0FBVyxFQUNYLFdBQVcsR0FDUSxFQUFFLEVBQUUsQ0FBQyxJQUFBLGVBQVEsRUFBQztJQUNqQyxhQUFhLEVBQUUsV0FBVztJQUMxQixNQUFNLEVBQUUsU0FBUyxNQUFNLENBQUMsRUFDdEIsSUFBSSxHQUNMO1FBQ0MsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsU0FBaUIsRUFBRSxFQUFFO1lBQ3RELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUN0QyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBRVYsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsU0FBaUIsRUFBRSxLQUFVLEVBQUUsRUFBRTtZQUNsRSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN0QyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBRVYsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLHlCQUFpQixFQUFDO1lBQzlDLGFBQWE7WUFDYixhQUFhO1lBQ2IsV0FBVztTQUNaLENBQUMsQ0FBQTtRQUVGLE9BQU8sQ0FDTCxFQUNFO1FBQUEsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQzNDLE1BQU0sY0FBYyxHQUFHLElBQUEsZUFBVSxFQUFDO29CQUNoQyxXQUFXO29CQUNYLE1BQU07aUJBQ1AsQ0FBQyxDQUFBO2dCQUNGLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUcsQ0FBQTtZQUNuRCxDQUFDLENBQUMsQ0FDSjtNQUFBLEdBQUcsQ0FDSixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQTtBQUVGLGtCQUFlLGFBQWEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHdpdGhGb3JtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0nXG5pbXBvcnQgSW5wdXRGaWVsZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9pbnB1dC1maWVsZC9maWVsZCdcbmltcG9ydCB7IHVzZUNvbmZpZ3VyYXRpb25zIH0gZnJvbSAnLi9ob29rcydcblxudHlwZSBJbml0aWFsRmllbGRzUHJvcHMgPSB7XG4gIGluaXRpYWxEYXRhPzogUmVjb3JkPHN0cmluZywgYW55PlxuICBzdXBwb3J0RmlsZTogYm9vbGVhblxufVxuXG5jb25zdCBJbml0aWFsRmllbGRzID0gKHtcbiAgaW5pdGlhbERhdGEsXG4gIHN1cHBvcnRGaWxlLFxufTogSW5pdGlhbEZpZWxkc1Byb3BzKSA9PiB3aXRoRm9ybSh7XG4gIGRlZmF1bHRWYWx1ZXM6IGluaXRpYWxEYXRhLFxuICByZW5kZXI6IGZ1bmN0aW9uIFJlbmRlcih7XG4gICAgZm9ybSxcbiAgfSkge1xuICAgIGNvbnN0IGdldEZpZWxkVmFsdWUgPSB1c2VDYWxsYmFjaygoZmllbGROYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBmb3JtLmdldEZpZWxkVmFsdWUoZmllbGROYW1lKVxuICAgIH0sIFtmb3JtXSlcblxuICAgIGNvbnN0IHNldEZpZWxkVmFsdWUgPSB1c2VDYWxsYmFjaygoZmllbGROYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcbiAgICAgIGZvcm0uc2V0RmllbGRWYWx1ZShmaWVsZE5hbWUsIHZhbHVlKVxuICAgIH0sIFtmb3JtXSlcblxuICAgIGNvbnN0IGluaXRpYWxDb25maWd1cmF0aW9ucyA9IHVzZUNvbmZpZ3VyYXRpb25zKHtcbiAgICAgIGdldEZpZWxkVmFsdWUsXG4gICAgICBzZXRGaWVsZFZhbHVlLFxuICAgICAgc3VwcG9ydEZpbGUsXG4gICAgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8PlxuICAgICAgICB7aW5pdGlhbENvbmZpZ3VyYXRpb25zLm1hcCgoY29uZmlnLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IEZpZWxkQ29tcG9uZW50ID0gSW5wdXRGaWVsZCh7XG4gICAgICAgICAgICBpbml0aWFsRGF0YSxcbiAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiA8RmllbGRDb21wb25lbnQga2V5PXtpbmRleH0gZm9ybT17Zm9ybX0gLz5cbiAgICAgICAgfSl9XG4gICAgICA8Lz5cbiAgICApXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBJbml0aWFsRmllbGRzXG4iXX0=