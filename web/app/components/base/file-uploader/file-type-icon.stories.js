"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = exports.Playground = void 0;
const file_type_icon_1 = require("./file-type-icon");
const types_1 = require("./types");
const meta = {
    title: 'Base/General/FileTypeIcon',
    component: file_type_icon_1.default,
    parameters: {
        docs: {
            description: {
                component: 'Displays the appropriate icon and accent colour for a file appearance type. Useful in lists and attachments.',
            },
        },
    },
    tags: ['autodocs'],
    args: {
        type: types_1.FileAppearanceTypeEnum.document,
        size: 'md',
    },
};
exports.default = meta;
exports.Playground = {};
exports.Gallery = {
    render: () => (<div className="grid grid-cols-4 gap-6 rounded-xl border border-divider-subtle bg-components-panel-bg p-6">
      {Object.values(types_1.FileAppearanceTypeEnum).map(type => (<div key={type} className="flex flex-col items-center gap-2 text-xs text-text-secondary">
          <file_type_icon_1.default type={type} size="xl"/>
          <span className="capitalize">{type}</span>
        </div>))}
    </div>),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS10eXBlLWljb24uc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUtdHlwZS1pY29uLnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFEQUEyQztBQUMzQyxtQ0FBZ0Q7QUFFaEQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsMkJBQTJCO0lBQ2xDLFNBQVMsRUFBRSx3QkFBWTtJQUN2QixVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLDhHQUE4RzthQUMxSDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLDhCQUFzQixDQUFDLFFBQVE7UUFDckMsSUFBSSxFQUFFLElBQUk7S0FDWDtDQUNrQyxDQUFBO0FBRXJDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsVUFBVSxHQUFVLEVBQUUsQ0FBQTtBQUV0QixRQUFBLE9BQU8sR0FBVTtJQUM1QixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FDWixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkZBQTJGLENBQ3hHO01BQUEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLDhCQUFzQixDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDakQsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLDhEQUE4RCxDQUN0RjtVQUFBLENBQUMsd0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUNuQztVQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQzNDO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFDLENBQ0o7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBGaWxlVHlwZUljb24gZnJvbSAnLi9maWxlLXR5cGUtaWNvbidcbmltcG9ydCB7IEZpbGVBcHBlYXJhbmNlVHlwZUVudW0gfSBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvR2VuZXJhbC9GaWxlVHlwZUljb24nLFxuICBjb21wb25lbnQ6IEZpbGVUeXBlSWNvbixcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0Rpc3BsYXlzIHRoZSBhcHByb3ByaWF0ZSBpY29uIGFuZCBhY2NlbnQgY29sb3VyIGZvciBhIGZpbGUgYXBwZWFyYW5jZSB0eXBlLiBVc2VmdWwgaW4gbGlzdHMgYW5kIGF0dGFjaG1lbnRzLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnczoge1xuICAgIHR5cGU6IEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uZG9jdW1lbnQsXG4gICAgc2l6ZTogJ21kJyxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEZpbGVUeXBlSWNvbj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgR2FsbGVyeTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtNCBnYXAtNiByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTZcIj5cbiAgICAgIHtPYmplY3QudmFsdWVzKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0pLm1hcCh0eXBlID0+IChcbiAgICAgICAgPGRpdiBrZXk9e3R5cGV9IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0yIHRleHQteHMgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgIDxGaWxlVHlwZUljb24gdHlwZT17dHlwZX0gc2l6ZT1cInhsXCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjYXBpdGFsaXplXCI+e3R5cGV9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkpfVxuICAgIDwvZGl2PlxuICApLFxufVxuIl19