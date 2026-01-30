"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TanStackDevtoolsWrapper = TanStackDevtoolsWrapper;
const react_devtools_1 = require("@tanstack/react-devtools");
const react_form_devtools_1 = require("@tanstack/react-form-devtools");
const react_query_devtools_1 = require("@tanstack/react-query-devtools");
const React = require("react");
function TanStackDevtoolsWrapper() {
    return (<react_devtools_1.TanStackDevtools plugins={[
            // Query Devtools (Official Plugin)
            {
                name: 'React Query',
                render: () => <react_query_devtools_1.ReactQueryDevtoolsPanel />,
            },
            // Form Devtools (Official Plugin)
            (0, react_form_devtools_1.formDevtoolsPlugin)(),
        ]}/>);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXZ0b29scy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFPWiwwREFlQztBQXBCRCw2REFBMkQ7QUFDM0QsdUVBQWtFO0FBQ2xFLHlFQUF3RTtBQUN4RSwrQkFBOEI7QUFFOUIsU0FBZ0IsdUJBQXVCO0lBQ3JDLE9BQU8sQ0FDTCxDQUFDLGlDQUFnQixDQUNmLE9BQU8sQ0FBQyxDQUFDO1lBQ1AsbUNBQW1DO1lBQ25DO2dCQUNFLElBQUksRUFBRSxhQUFhO2dCQUNuQixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyw4Q0FBdUIsQ0FBQyxBQUFELEVBQUc7YUFDMUM7WUFFRCxrQ0FBa0M7WUFDbEMsSUFBQSx3Q0FBa0IsR0FBRTtTQUNyQixDQUFDLEVBQ0YsQ0FDSCxDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgeyBUYW5TdGFja0RldnRvb2xzIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LWRldnRvb2xzJ1xuaW1wb3J0IHsgZm9ybURldnRvb2xzUGx1Z2luIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LWZvcm0tZGV2dG9vbHMnXG5pbXBvcnQgeyBSZWFjdFF1ZXJ5RGV2dG9vbHNQYW5lbCB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeS1kZXZ0b29scydcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5leHBvcnQgZnVuY3Rpb24gVGFuU3RhY2tEZXZ0b29sc1dyYXBwZXIoKSB7XG4gIHJldHVybiAoXG4gICAgPFRhblN0YWNrRGV2dG9vbHNcbiAgICAgIHBsdWdpbnM9e1tcbiAgICAgICAgLy8gUXVlcnkgRGV2dG9vbHMgKE9mZmljaWFsIFBsdWdpbilcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdSZWFjdCBRdWVyeScsXG4gICAgICAgICAgcmVuZGVyOiAoKSA9PiA8UmVhY3RRdWVyeURldnRvb2xzUGFuZWwgLz4sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRm9ybSBEZXZ0b29scyAoT2ZmaWNpYWwgUGx1Z2luKVxuICAgICAgICBmb3JtRGV2dG9vbHNQbHVnaW4oKSxcbiAgICAgIF19XG4gICAgLz5cbiAgKVxufVxuIl19