"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSizes = exports.WithFallback = exports.Default = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/Data Display/Avatar',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Initials or image-based avatar used across contacts and member lists. Falls back to the first letter when the image fails to load.',
            },
            source: {
                language: 'tsx',
                code: `
<Avatar name="Alex Doe" avatar="https://cloud.dify.ai/logo/logo.svg" size={40} />
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
    args: {
        name: 'Alex Doe',
        avatar: 'https://cloud.dify.ai/logo/logo.svg',
        size: 40,
    },
};
exports.default = meta;
exports.Default = {};
exports.WithFallback = {
    args: {
        avatar: null,
        name: 'Fallback',
    },
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<Avatar name="Fallback" avatar={null} size={40} />
        `.trim(),
            },
        },
    },
};
exports.CustomSizes = {
    render: args => (<div className="flex items-end gap-4">
      {[24, 32, 48, 64].map(size => (<div key={size} className="flex flex-col items-center gap-2">
          <_1.default {...args} size={size} avatar="https://i.pravatar.cc/96?u=size-test"/>
          <span className="text-xs text-text-tertiary">
            {size}
            px
          </span>
        </div>))}
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
{[24, 32, 48, 64].map(size => (
  <Avatar key={size} name="Size Test" size={size} avatar="https://i.pravatar.cc/96?u=size-test" />
))}
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUFzQjtBQUV0QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSwwQkFBMEI7SUFDakMsU0FBUyxFQUFFLFVBQU07SUFDakIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxvSUFBb0k7YUFDaEo7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOztTQUVMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxVQUFVO1FBQ2hCLE1BQU0sRUFBRSxxQ0FBcUM7UUFDN0MsSUFBSSxFQUFFLEVBQUU7S0FDVDtDQUM0QixDQUFBO0FBRS9CLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsT0FBTyxHQUFVLEVBQUUsQ0FBQTtBQUVuQixRQUFBLFlBQVksR0FBVTtJQUNqQyxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxVQUFVO0tBQ2pCO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7U0FFTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUE7QUFFWSxRQUFBLFdBQVcsR0FBVTtJQUNoQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FDbkM7TUFBQSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDNUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUMxRDtVQUFBLENBQUMsVUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLHNDQUFzQyxFQUMzRTtVQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FDMUM7WUFBQSxDQUFDLElBQUksQ0FDTDs7VUFDRixFQUFFLElBQUksQ0FDUjtRQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyxDQUNKO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7U0FJTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgQXZhdGFyIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIERpc3BsYXkvQXZhdGFyJyxcbiAgY29tcG9uZW50OiBBdmF0YXIsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdJbml0aWFscyBvciBpbWFnZS1iYXNlZCBhdmF0YXIgdXNlZCBhY3Jvc3MgY29udGFjdHMgYW5kIG1lbWJlciBsaXN0cy4gRmFsbHMgYmFjayB0byB0aGUgZmlyc3QgbGV0dGVyIHdoZW4gdGhlIGltYWdlIGZhaWxzIHRvIGxvYWQuJyxcbiAgICAgIH0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48QXZhdGFyIG5hbWU9XCJBbGV4IERvZVwiIGF2YXRhcj1cImh0dHBzOi8vY2xvdWQuZGlmeS5haS9sb2dvL2xvZ28uc3ZnXCIgc2l6ZT17NDB9IC8+XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ3M6IHtcbiAgICBuYW1lOiAnQWxleCBEb2UnLFxuICAgIGF2YXRhcjogJ2h0dHBzOi8vY2xvdWQuZGlmeS5haS9sb2dvL2xvZ28uc3ZnJyxcbiAgICBzaXplOiA0MCxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEF2YXRhcj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgV2l0aEZhbGxiYWNrOiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIGF2YXRhcjogbnVsbCxcbiAgICBuYW1lOiAnRmFsbGJhY2snLFxuICB9LFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPEF2YXRhciBuYW1lPVwiRmFsbGJhY2tcIiBhdmF0YXI9e251bGx9IHNpemU9ezQwfSAvPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEN1c3RvbVNpemVzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtZW5kIGdhcC00XCI+XG4gICAgICB7WzI0LCAzMiwgNDgsIDY0XS5tYXAoc2l6ZSA9PiAoXG4gICAgICAgIDxkaXYga2V5PXtzaXplfSBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgIDxBdmF0YXIgey4uLmFyZ3N9IHNpemU9e3NpemV9IGF2YXRhcj1cImh0dHBzOi8vaS5wcmF2YXRhci5jYy85Nj91PXNpemUtdGVzdFwiIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgIHtzaXplfVxuICAgICAgICAgICAgcHhcbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG57WzI0LCAzMiwgNDgsIDY0XS5tYXAoc2l6ZSA9PiAoXG4gIDxBdmF0YXIga2V5PXtzaXplfSBuYW1lPVwiU2l6ZSBUZXN0XCIgc2l6ZT17c2l6ZX0gYXZhdGFyPVwiaHR0cHM6Ly9pLnByYXZhdGFyLmNjLzk2P3U9c2l6ZS10ZXN0XCIgLz5cbikpfVxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==