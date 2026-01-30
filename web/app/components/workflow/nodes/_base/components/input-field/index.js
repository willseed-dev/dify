"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layout_1 = require("@/app/components/workflow/nodes/_base/components/layout");
const add_1 = require("./add");
const InputField = () => {
    return (<layout_1.BoxGroupField fieldProps={{
            supportCollapse: true,
            fieldTitleProps: {
                title: 'input field',
                operation: <add_1.default />,
            },
        }} boxGroupProps={{
            boxProps: {
                withBorderBottom: true,
            },
        }}>
      input field
    </layout_1.BoxGroupField>);
};
exports.default = InputField;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvRkFBdUY7QUFDdkYsK0JBQXVCO0FBRXZCLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtJQUN0QixPQUFPLENBQ0wsQ0FBQyxzQkFBYSxDQUNaLFVBQVUsQ0FBQyxDQUFDO1lBQ1YsZUFBZSxFQUFFLElBQUk7WUFDckIsZUFBZSxFQUFFO2dCQUNmLEtBQUssRUFBRSxhQUFhO2dCQUNwQixTQUFTLEVBQUUsQ0FBQyxhQUFHLENBQUMsQUFBRCxFQUFHO2FBQ25CO1NBQ0YsQ0FBQyxDQUNGLGFBQWEsQ0FBQyxDQUFDO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLGdCQUFnQixFQUFFLElBQUk7YUFDdkI7U0FDRixDQUFDLENBRUY7O0lBQ0YsRUFBRSxzQkFBYSxDQUFDLENBQ2pCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxVQUFVLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCb3hHcm91cEZpZWxkIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL2xheW91dCdcbmltcG9ydCBBZGQgZnJvbSAnLi9hZGQnXG5cbmNvbnN0IElucHV0RmllbGQgPSAoKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPEJveEdyb3VwRmllbGRcbiAgICAgIGZpZWxkUHJvcHM9e3tcbiAgICAgICAgc3VwcG9ydENvbGxhcHNlOiB0cnVlLFxuICAgICAgICBmaWVsZFRpdGxlUHJvcHM6IHtcbiAgICAgICAgICB0aXRsZTogJ2lucHV0IGZpZWxkJyxcbiAgICAgICAgICBvcGVyYXRpb246IDxBZGQgLz4sXG4gICAgICAgIH0sXG4gICAgICB9fVxuICAgICAgYm94R3JvdXBQcm9wcz17e1xuICAgICAgICBib3hQcm9wczoge1xuICAgICAgICAgIHdpdGhCb3JkZXJCb3R0b206IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9fVxuICAgID5cbiAgICAgIGlucHV0IGZpZWxkXG4gICAgPC9Cb3hHcm91cEZpZWxkPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBJbnB1dEZpZWxkXG4iXX0=