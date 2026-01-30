"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = Tag;
const classnames_1 = require("@/utils/classnames");
const variantStyles = {
    medium: 'rounded-lg px-1.5 ring-1 ring-inset',
};
const colorStyles = {
    emerald: {
        small: 'text-emerald-500 dark:text-emerald-400',
        medium: 'ring-emerald-300 dark:ring-emerald-400/30 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400',
    },
    sky: {
        small: 'text-sky-500',
        medium: 'ring-sky-300 bg-sky-400/10 text-sky-500 dark:ring-sky-400/30 dark:bg-sky-400/10 dark:text-sky-400',
    },
    amber: {
        small: 'text-amber-500',
        medium: 'ring-amber-300 bg-amber-400/10 text-amber-500 dark:ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400',
    },
    rose: {
        small: 'text-red-500 dark:text-rose-500',
        medium: 'ring-rose-200 bg-rose-50 text-red-500 dark:ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400',
    },
    zinc: {
        small: 'text-zinc-400 dark:text-zinc-500',
        medium: 'ring-zinc-200 bg-zinc-50 text-zinc-500 dark:ring-zinc-500/20 dark:bg-zinc-400/10 dark:text-zinc-400',
    },
};
const valueColorMap = {
    get: 'emerald',
    post: 'sky',
    put: 'amber',
    delete: 'rose',
};
function Tag({ children, variant = 'medium', color = valueColorMap[children.toLowerCase()] ?? 'emerald', }) {
    return (<span className={(0, classnames_1.cn)('font-mono text-[0.625rem] font-semibold leading-6', variantStyles[variant], colorStyles[color][variant])}>
      {children}
    </span>);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFnLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQWdEWixrQkFZQztBQTNERCxtREFBdUM7QUFFdkMsTUFBTSxhQUFhLEdBQUc7SUFDcEIsTUFBTSxFQUFFLHFDQUFxQztDQUNqQixDQUFBO0FBRTlCLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLEtBQUssRUFBRSx3Q0FBd0M7UUFDL0MsTUFBTSxFQUNKLG9HQUFvRztLQUN2RztJQUNELEdBQUcsRUFBRTtRQUNILEtBQUssRUFBRSxjQUFjO1FBQ3JCLE1BQU0sRUFDSixtR0FBbUc7S0FDdEc7SUFDRCxLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsZ0JBQWdCO1FBQ3ZCLE1BQU0sRUFDSiwrR0FBK0c7S0FDbEg7SUFDRCxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsaUNBQWlDO1FBQ3hDLE1BQU0sRUFDSixvR0FBb0c7S0FDdkc7SUFDRCxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsa0NBQWtDO1FBQ3pDLE1BQU0sRUFDSixxR0FBcUc7S0FDeEc7Q0FDOEMsQ0FBQTtBQUVqRCxNQUFNLGFBQWEsR0FBRztJQUNwQixHQUFHLEVBQUUsU0FBUztJQUNkLElBQUksRUFBRSxLQUFLO0lBQ1gsR0FBRyxFQUFFLE9BQU87SUFDWixNQUFNLEVBQUUsTUFBTTtDQUNjLENBQUE7QUFROUIsU0FBZ0IsR0FBRyxDQUFDLEVBQ2xCLFFBQVEsRUFDUixPQUFPLEdBQUcsUUFBUSxFQUNsQixLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLFNBQVMsR0FDaEQ7SUFDVixPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQ0gsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsbURBQW1ELEVBQUUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBRXhIO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxuY29uc3QgdmFyaWFudFN0eWxlcyA9IHtcbiAgbWVkaXVtOiAncm91bmRlZC1sZyBweC0xLjUgcmluZy0xIHJpbmctaW5zZXQnLFxufSBhcyB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9XG5cbmNvbnN0IGNvbG9yU3R5bGVzID0ge1xuICBlbWVyYWxkOiB7XG4gICAgc21hbGw6ICd0ZXh0LWVtZXJhbGQtNTAwIGRhcms6dGV4dC1lbWVyYWxkLTQwMCcsXG4gICAgbWVkaXVtOlxuICAgICAgJ3JpbmctZW1lcmFsZC0zMDAgZGFyazpyaW5nLWVtZXJhbGQtNDAwLzMwIGJnLWVtZXJhbGQtNDAwLzEwIHRleHQtZW1lcmFsZC01MDAgZGFyazp0ZXh0LWVtZXJhbGQtNDAwJyxcbiAgfSxcbiAgc2t5OiB7XG4gICAgc21hbGw6ICd0ZXh0LXNreS01MDAnLFxuICAgIG1lZGl1bTpcbiAgICAgICdyaW5nLXNreS0zMDAgYmctc2t5LTQwMC8xMCB0ZXh0LXNreS01MDAgZGFyazpyaW5nLXNreS00MDAvMzAgZGFyazpiZy1za3ktNDAwLzEwIGRhcms6dGV4dC1za3ktNDAwJyxcbiAgfSxcbiAgYW1iZXI6IHtcbiAgICBzbWFsbDogJ3RleHQtYW1iZXItNTAwJyxcbiAgICBtZWRpdW06XG4gICAgICAncmluZy1hbWJlci0zMDAgYmctYW1iZXItNDAwLzEwIHRleHQtYW1iZXItNTAwIGRhcms6cmluZy1hbWJlci00MDAvMzAgZGFyazpiZy1hbWJlci00MDAvMTAgZGFyazp0ZXh0LWFtYmVyLTQwMCcsXG4gIH0sXG4gIHJvc2U6IHtcbiAgICBzbWFsbDogJ3RleHQtcmVkLTUwMCBkYXJrOnRleHQtcm9zZS01MDAnLFxuICAgIG1lZGl1bTpcbiAgICAgICdyaW5nLXJvc2UtMjAwIGJnLXJvc2UtNTAgdGV4dC1yZWQtNTAwIGRhcms6cmluZy1yb3NlLTUwMC8yMCBkYXJrOmJnLXJvc2UtNDAwLzEwIGRhcms6dGV4dC1yb3NlLTQwMCcsXG4gIH0sXG4gIHppbmM6IHtcbiAgICBzbWFsbDogJ3RleHQtemluYy00MDAgZGFyazp0ZXh0LXppbmMtNTAwJyxcbiAgICBtZWRpdW06XG4gICAgICAncmluZy16aW5jLTIwMCBiZy16aW5jLTUwIHRleHQtemluYy01MDAgZGFyazpyaW5nLXppbmMtNTAwLzIwIGRhcms6YmctemluYy00MDAvMTAgZGFyazp0ZXh0LXppbmMtNDAwJyxcbiAgfSxcbn0gYXMgeyBba2V5OiBzdHJpbmddOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IH1cblxuY29uc3QgdmFsdWVDb2xvck1hcCA9IHtcbiAgZ2V0OiAnZW1lcmFsZCcsXG4gIHBvc3Q6ICdza3knLFxuICBwdXQ6ICdhbWJlcicsXG4gIGRlbGV0ZTogJ3Jvc2UnLFxufSBhcyB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9XG5cbnR5cGUgSVRhZ1Byb3BzID0ge1xuICBjaGlsZHJlbjogc3RyaW5nXG4gIGNvbG9yPzogc3RyaW5nXG4gIHZhcmlhbnQ/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRhZyh7XG4gIGNoaWxkcmVuLFxuICB2YXJpYW50ID0gJ21lZGl1bScsXG4gIGNvbG9yID0gdmFsdWVDb2xvck1hcFtjaGlsZHJlbi50b0xvd2VyQ2FzZSgpXSA/PyAnZW1lcmFsZCcsXG59OiBJVGFnUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgY2xhc3NOYW1lPXtjbignZm9udC1tb25vIHRleHQtWzAuNjI1cmVtXSBmb250LXNlbWlib2xkIGxlYWRpbmctNicsIHZhcmlhbnRTdHlsZXNbdmFyaWFudF0sIGNvbG9yU3R5bGVzW2NvbG9yXVt2YXJpYW50XSl9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvc3Bhbj5cbiAgKVxufVxuIl19