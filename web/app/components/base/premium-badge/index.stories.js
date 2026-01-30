"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverEnabled = exports.Playground = void 0;
const _1 = require(".");
const colors = ['blue', 'indigo', 'gray', 'orange'];
const PremiumBadgeGallery = ({ size = 'm', allowHover = false, }) => {
    return (<div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Brand badge variants</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {colors.map(color => (<div key={color} className="flex flex-col items-center gap-2 rounded-xl border border-transparent px-2 py-4 hover:border-divider-subtle hover:bg-background-default-subtle">
            <_1.default color={color} size={size} allowHover={allowHover}>
              <span className="px-2 text-xs font-semibold uppercase tracking-[0.14em]">Premium</span>
            </_1.default>
            <span className="text-[11px] uppercase tracking-[0.16em] text-text-tertiary">{color}</span>
          </div>))}
      </div>
    </div>);
};
const meta = {
    title: 'Base/General/PremiumBadge',
    component: PremiumBadgeGallery,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Gradient badge used for premium features and upsell prompts. Hover animations can be toggled per instance.',
            },
        },
    },
    argTypes: {
        size: {
            control: 'radio',
            options: ['s', 'm'],
        },
        allowHover: { control: 'boolean' },
    },
    args: {
        size: 'm',
        allowHover: false,
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
exports.HoverEnabled = {
    args: {
        allowHover: true,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUE0QjtBQUU1QixNQUFNLE1BQU0sR0FBMkUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUUzSCxNQUFNLG1CQUFtQixHQUFHLENBQUMsRUFDM0IsSUFBSSxHQUFHLEdBQUcsRUFDVixVQUFVLEdBQUcsS0FBSyxHQUluQixFQUFFLEVBQUU7SUFDSCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlHQUF5RyxDQUN0SDtNQUFBLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx3REFBd0QsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQzdGO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHVDQUF1QyxDQUNwRDtRQUFBLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQ25CLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnSkFBZ0osQ0FDeks7WUFBQSxDQUFDLFVBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FDN0Q7Y0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsT0FBTyxFQUFFLElBQUksQ0FDeEY7WUFBQSxFQUFFLFVBQVksQ0FDZDtZQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FDNUY7VUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUMsQ0FDSjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsMkJBQTJCO0lBQ2xDLFNBQVMsRUFBRSxtQkFBbUI7SUFDOUIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSw0R0FBNEc7YUFDeEg7U0FDRjtLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQjtRQUNELFVBQVUsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7S0FDbkM7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsR0FBRztRQUNULFVBQVUsRUFBRSxLQUFLO0tBQ2xCO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ3dCLENBQUE7QUFFNUMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxVQUFVLEdBQVUsRUFBRSxDQUFBO0FBRXRCLFFBQUEsWUFBWSxHQUFVO0lBQ2pDLElBQUksRUFBRTtRQUNKLFVBQVUsRUFBRSxJQUFJO0tBQ2pCO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBQcmVtaXVtQmFkZ2UgZnJvbSAnLidcblxuY29uc3QgY29sb3JzOiBBcnJheTxOb25OdWxsYWJsZTxSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgUHJlbWl1bUJhZGdlPlsnY29sb3InXT4+ID0gWydibHVlJywgJ2luZGlnbycsICdncmF5JywgJ29yYW5nZSddXG5cbmNvbnN0IFByZW1pdW1CYWRnZUdhbGxlcnkgPSAoe1xuICBzaXplID0gJ20nLFxuICBhbGxvd0hvdmVyID0gZmFsc2UsXG59OiB7XG4gIHNpemU/OiAncycgfCAnbSdcbiAgYWxsb3dIb3Zlcj86IGJvb2xlYW5cbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy1mdWxsIG1heC13LXhsIGZsZXgtY29sIGdhcC00IHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTZcIj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjE4ZW1dIHRleHQtdGV4dC10ZXJ0aWFyeVwiPkJyYW5kIGJhZGdlIHZhcmlhbnRzPC9wPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00IHNtOmdyaWQtY29scy00XCI+XG4gICAgICAgIHtjb2xvcnMubWFwKGNvbG9yID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17Y29sb3J9IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudCBweC0yIHB5LTQgaG92ZXI6Ym9yZGVyLWRpdmlkZXItc3VidGxlIGhvdmVyOmJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGVcIj5cbiAgICAgICAgICAgIDxQcmVtaXVtQmFkZ2UgY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSBhbGxvd0hvdmVyPXthbGxvd0hvdmVyfT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHgtMiB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdXBwZXJjYXNlIHRyYWNraW5nLVswLjE0ZW1dXCI+UHJlbWl1bTwvc3Bhbj5cbiAgICAgICAgICAgIDwvUHJlbWl1bUJhZGdlPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdXBwZXJjYXNlIHRyYWNraW5nLVswLjE2ZW1dIHRleHQtdGV4dC10ZXJ0aWFyeVwiPntjb2xvcn08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0dlbmVyYWwvUHJlbWl1bUJhZGdlJyxcbiAgY29tcG9uZW50OiBQcmVtaXVtQmFkZ2VHYWxsZXJ5LFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0dyYWRpZW50IGJhZGdlIHVzZWQgZm9yIHByZW1pdW0gZmVhdHVyZXMgYW5kIHVwc2VsbCBwcm9tcHRzLiBIb3ZlciBhbmltYXRpb25zIGNhbiBiZSB0b2dnbGVkIHBlciBpbnN0YW5jZS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIHNpemU6IHtcbiAgICAgIGNvbnRyb2w6ICdyYWRpbycsXG4gICAgICBvcHRpb25zOiBbJ3MnLCAnbSddLFxuICAgIH0sXG4gICAgYWxsb3dIb3ZlcjogeyBjb250cm9sOiAnYm9vbGVhbicgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHNpemU6ICdtJyxcbiAgICBhbGxvd0hvdmVyOiBmYWxzZSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgUHJlbWl1bUJhZGdlR2FsbGVyeT5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgSG92ZXJFbmFibGVkOiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIGFsbG93SG92ZXI6IHRydWUsXG4gIH0sXG59XG4iXX0=