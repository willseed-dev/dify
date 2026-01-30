"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomContent = exports.WithCornerMark = exports.Default = void 0;
const badge_1 = require("../badge");
const meta = {
    title: 'Base/Data Display/Badge',
    component: badge_1.default,
    parameters: {
        docs: {
            description: {
                component: 'Compact label used for statuses and counts. Supports uppercase styling and optional red corner marks.',
            },
            source: {
                language: 'tsx',
                code: `
<Badge text="beta" />
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
    args: {
        text: 'beta',
        uppercase: true,
    },
};
exports.default = meta;
exports.Default = {};
exports.WithCornerMark = {
    args: {
        text: 'new',
        hasRedCornerMark: true,
    },
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<Badge text="new" hasRedCornerMark />
        `.trim(),
            },
        },
    },
};
exports.CustomContent = {
    render: args => (<badge_1.default {...args} uppercase={false}>
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-emerald-400"/>
        Production
      </span>
    </badge_1.default>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<Badge uppercase={false}>
  <span className="flex items-center gap-1">
    <span className="h-2 w-2 rounded-full bg-emerald-400" />
    Production
  </span>
</Badge>
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9DQUE0QjtBQUU1QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx5QkFBeUI7SUFDaEMsU0FBUyxFQUFFLGVBQUs7SUFDaEIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSx1R0FBdUc7YUFDbkg7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOztTQUVMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osU0FBUyxFQUFFLElBQUk7S0FDaEI7Q0FDMkIsQ0FBQTtBQUU5QixrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLE9BQU8sR0FBVSxFQUFFLENBQUE7QUFFbkIsUUFBQSxjQUFjLEdBQVU7SUFDbkMsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLEtBQUs7UUFDWCxnQkFBZ0IsRUFBRSxJQUFJO0tBQ3ZCO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7U0FFTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUE7QUFFWSxRQUFBLGFBQWEsR0FBVTtJQUNsQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsZUFBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2hDO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUN2QztRQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQ0FBcUMsRUFDckQ7O01BQ0YsRUFBRSxJQUFJLENBQ1I7SUFBQSxFQUFFLGVBQUssQ0FBQyxDQUNUO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7Ozs7OztTQU9MLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBCYWRnZSBmcm9tICcuLi9iYWRnZSdcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRGlzcGxheS9CYWRnZScsXG4gIGNvbXBvbmVudDogQmFkZ2UsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdDb21wYWN0IGxhYmVsIHVzZWQgZm9yIHN0YXR1c2VzIGFuZCBjb3VudHMuIFN1cHBvcnRzIHVwcGVyY2FzZSBzdHlsaW5nIGFuZCBvcHRpb25hbCByZWQgY29ybmVyIG1hcmtzLicsXG4gICAgICB9LFxuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPEJhZGdlIHRleHQ9XCJiZXRhXCIgLz5cbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnczoge1xuICAgIHRleHQ6ICdiZXRhJyxcbiAgICB1cHBlcmNhc2U6IHRydWUsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBCYWRnZT5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgV2l0aENvcm5lck1hcms6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgdGV4dDogJ25ldycsXG4gICAgaGFzUmVkQ29ybmVyTWFyazogdHJ1ZSxcbiAgfSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbjxCYWRnZSB0ZXh0PVwibmV3XCIgaGFzUmVkQ29ybmVyTWFyayAvPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEN1c3RvbUNvbnRlbnQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gKFxuICAgIDxCYWRnZSB7Li4uYXJnc30gdXBwZXJjYXNlPXtmYWxzZX0+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoLTIgdy0yIHJvdW5kZWQtZnVsbCBiZy1lbWVyYWxkLTQwMFwiIC8+XG4gICAgICAgIFByb2R1Y3Rpb25cbiAgICAgIDwvc3Bhbj5cbiAgICA8L0JhZGdlPlxuICApLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPEJhZGdlIHVwcGVyY2FzZT17ZmFsc2V9PlxuICA8c3BhbiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImgtMiB3LTIgcm91bmRlZC1mdWxsIGJnLWVtZXJhbGQtNDAwXCIgLz5cbiAgICBQcm9kdWN0aW9uXG4gIDwvc3Bhbj5cbjwvQmFkZ2U+XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuIl19