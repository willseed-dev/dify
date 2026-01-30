"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumBadgeVariants = exports.PremiumBadge = void 0;
const class_variance_authority_1 = require("class-variance-authority");
const React = require("react");
const common_1 = require("@/app/components/base/icons/src/public/common");
const classnames_1 = require("@/utils/classnames");
require("./index.css");
const PremiumBadgeVariants = (0, class_variance_authority_1.cva)('premium-badge', {
    variants: {
        size: {
            s: 'premium-badge-s',
            m: 'premium-badge-m',
            custom: '',
        },
        color: {
            blue: 'premium-badge-blue',
            indigo: 'premium-badge-indigo',
            gray: 'premium-badge-gray',
            orange: 'premium-badge-orange',
        },
        allowHover: {
            true: 'allowHover',
            false: '',
        },
    },
    defaultVariants: {
        size: 'm',
        color: 'blue',
        allowHover: false,
    },
});
exports.PremiumBadgeVariants = PremiumBadgeVariants;
const PremiumBadge = ({ className, size, color, allowHover, styleCss, children, ...props }) => {
    return (<div className={(0, classnames_1.cn)(PremiumBadgeVariants({ size, color, allowHover, className }), 'relative text-nowrap')} style={styleCss} {...props}>
      {children}
      <common_1.Highlight className={(0, classnames_1.cn)('absolute right-1/2 top-0 translate-x-[20%] opacity-50 transition-all duration-100 ease-out hover:translate-x-[30%] hover:opacity-80', size === 's' ? 'h-[18px] w-12' : 'h-6 w-12')}/>
    </div>);
};
exports.PremiumBadge = PremiumBadge;
PremiumBadge.displayName = 'PremiumBadge';
exports.default = PremiumBadge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsdUVBQThDO0FBQzlDLCtCQUE4QjtBQUM5QiwwRUFBeUU7QUFDekUsbURBQXVDO0FBQ3ZDLHVCQUFvQjtBQUVwQixNQUFNLG9CQUFvQixHQUFHLElBQUEsOEJBQUcsRUFDOUIsZUFBZSxFQUNmO0lBQ0UsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFO1lBQ0osQ0FBQyxFQUFFLGlCQUFpQjtZQUNwQixDQUFDLEVBQUUsaUJBQWlCO1lBQ3BCLE1BQU0sRUFBRSxFQUFFO1NBQ1g7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsb0JBQW9CO1lBQzFCLE1BQU0sRUFBRSxzQkFBc0I7WUFDOUIsSUFBSSxFQUFFLG9CQUFvQjtZQUMxQixNQUFNLEVBQUUsc0JBQXNCO1NBQy9CO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLFlBQVk7WUFDbEIsS0FBSyxFQUFFLEVBQUU7U0FDVjtLQUNGO0lBQ0QsZUFBZSxFQUFFO1FBQ2YsSUFBSSxFQUFFLEdBQUc7UUFDVCxLQUFLLEVBQUUsTUFBTTtRQUNiLFVBQVUsRUFBRSxLQUFLO0tBQ2xCO0NBQ0YsQ0FDRixDQUFBO0FBbUNzQixvREFBb0I7QUF6QjNDLE1BQU0sWUFBWSxHQUFnQyxDQUFDLEVBQ2pELFNBQVMsRUFDVCxJQUFJLEVBQ0osS0FBSyxFQUNMLFVBQVUsRUFDVixRQUFRLEVBQ1IsUUFBUSxFQUNSLEdBQUcsS0FBSyxFQUNULEVBQUUsRUFBRTtJQUNILE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxvQkFBb0IsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUNwRyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDaEIsSUFBSSxLQUFLLENBQUMsQ0FFVjtNQUFBLENBQUMsUUFBUSxDQUNUO01BQUEsQ0FBQyxrQkFBUyxDQUNSLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHFJQUFxSSxFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFFdE07SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFJUSxvQ0FBWTtBQUhyQixZQUFZLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQTtBQUV6QyxrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFZhcmlhbnRQcm9wcyB9IGZyb20gJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eSdcbmltcG9ydCB0eXBlIHsgQ1NTUHJvcGVydGllcywgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjdmEgfSBmcm9tICdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEhpZ2hsaWdodCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvcHVibGljL2NvbW1vbidcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0ICcuL2luZGV4LmNzcydcblxuY29uc3QgUHJlbWl1bUJhZGdlVmFyaWFudHMgPSBjdmEoXG4gICdwcmVtaXVtLWJhZGdlJyxcbiAge1xuICAgIHZhcmlhbnRzOiB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIHM6ICdwcmVtaXVtLWJhZGdlLXMnLFxuICAgICAgICBtOiAncHJlbWl1bS1iYWRnZS1tJyxcbiAgICAgICAgY3VzdG9tOiAnJyxcbiAgICAgIH0sXG4gICAgICBjb2xvcjoge1xuICAgICAgICBibHVlOiAncHJlbWl1bS1iYWRnZS1ibHVlJyxcbiAgICAgICAgaW5kaWdvOiAncHJlbWl1bS1iYWRnZS1pbmRpZ28nLFxuICAgICAgICBncmF5OiAncHJlbWl1bS1iYWRnZS1ncmF5JyxcbiAgICAgICAgb3JhbmdlOiAncHJlbWl1bS1iYWRnZS1vcmFuZ2UnLFxuICAgICAgfSxcbiAgICAgIGFsbG93SG92ZXI6IHtcbiAgICAgICAgdHJ1ZTogJ2FsbG93SG92ZXInLFxuICAgICAgICBmYWxzZTogJycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGVmYXVsdFZhcmlhbnRzOiB7XG4gICAgICBzaXplOiAnbScsXG4gICAgICBjb2xvcjogJ2JsdWUnLFxuICAgICAgYWxsb3dIb3ZlcjogZmFsc2UsXG4gICAgfSxcbiAgfSxcbilcblxudHlwZSBQcmVtaXVtQmFkZ2VQcm9wcyA9IHtcbiAgc2l6ZT86ICdzJyB8ICdtJyB8ICdjdXN0b20nXG4gIGNvbG9yPzogJ2JsdWUnIHwgJ2luZGlnbycgfCAnZ3JheScgfCAnb3JhbmdlJ1xuICBhbGxvd0hvdmVyPzogYm9vbGVhblxuICBzdHlsZUNzcz86IENTU1Byb3BlcnRpZXNcbiAgY2hpbGRyZW4/OiBSZWFjdE5vZGVcbn0gJiBSZWFjdC5IVE1MQXR0cmlidXRlczxIVE1MRGl2RWxlbWVudD4gJiBWYXJpYW50UHJvcHM8dHlwZW9mIFByZW1pdW1CYWRnZVZhcmlhbnRzPlxuXG5jb25zdCBQcmVtaXVtQmFkZ2U6IFJlYWN0LkZDPFByZW1pdW1CYWRnZVByb3BzPiA9ICh7XG4gIGNsYXNzTmFtZSxcbiAgc2l6ZSxcbiAgY29sb3IsXG4gIGFsbG93SG92ZXIsXG4gIHN0eWxlQ3NzLFxuICBjaGlsZHJlbixcbiAgLi4ucHJvcHNcbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2NuKFByZW1pdW1CYWRnZVZhcmlhbnRzKHsgc2l6ZSwgY29sb3IsIGFsbG93SG92ZXIsIGNsYXNzTmFtZSB9KSwgJ3JlbGF0aXZlIHRleHQtbm93cmFwJyl9XG4gICAgICBzdHlsZT17c3R5bGVDc3N9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgICAgPEhpZ2hsaWdodFxuICAgICAgICBjbGFzc05hbWU9e2NuKCdhYnNvbHV0ZSByaWdodC0xLzIgdG9wLTAgdHJhbnNsYXRlLXgtWzIwJV0gb3BhY2l0eS01MCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0xMDAgZWFzZS1vdXQgaG92ZXI6dHJhbnNsYXRlLXgtWzMwJV0gaG92ZXI6b3BhY2l0eS04MCcsIHNpemUgPT09ICdzJyA/ICdoLVsxOHB4XSB3LTEyJyA6ICdoLTYgdy0xMicpfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuUHJlbWl1bUJhZGdlLmRpc3BsYXlOYW1lID0gJ1ByZW1pdW1CYWRnZSdcblxuZXhwb3J0IGRlZmF1bHQgUHJlbWl1bUJhZGdlXG5leHBvcnQgeyBQcmVtaXVtQmFkZ2UsIFByZW1pdW1CYWRnZVZhcmlhbnRzIH1cbiJdfQ==