"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonVariants = exports.Button = void 0;
const class_variance_authority_1 = require("class-variance-authority");
const React = require("react");
const classnames_1 = require("@/utils/classnames");
const spinner_1 = require("../spinner");
const buttonVariants = (0, class_variance_authority_1.cva)('btn disabled:btn-disabled', {
    variants: {
        variant: {
            'primary': 'btn-primary',
            'warning': 'btn-warning',
            'secondary': 'btn-secondary',
            'secondary-accent': 'btn-secondary-accent',
            'ghost': 'btn-ghost',
            'ghost-accent': 'btn-ghost-accent',
            'tertiary': 'btn-tertiary',
        },
        size: {
            small: 'btn-small',
            medium: 'btn-medium',
            large: 'btn-large',
        },
    },
    defaultVariants: {
        variant: 'secondary',
        size: 'medium',
    },
});
exports.buttonVariants = buttonVariants;
const Button = ({ className, variant, size, destructive, loading, styleCss, children, spinnerClassName, ref, ...props }) => {
    return (<button type="button" className={(0, classnames_1.cn)(buttonVariants({ variant, size, className }), destructive && 'btn-destructive')} ref={ref} style={styleCss} {...props}>
      {children}
      {loading && <spinner_1.default loading={loading} className={(0, classnames_1.cn)('!ml-1 !h-3 !w-3 !border-2 !text-white', spinnerClassName)}/>}
    </button>);
};
exports.Button = Button;
Button.displayName = 'Button';
exports.default = Button;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsdUVBQThDO0FBQzlDLCtCQUE4QjtBQUM5QixtREFBdUM7QUFDdkMsd0NBQWdDO0FBRWhDLE1BQU0sY0FBYyxHQUFHLElBQUEsOEJBQUcsRUFDeEIsMkJBQTJCLEVBQzNCO0lBQ0UsUUFBUSxFQUFFO1FBQ1IsT0FBTyxFQUFFO1lBQ1AsU0FBUyxFQUFFLGFBQWE7WUFDeEIsU0FBUyxFQUFFLGFBQWE7WUFDeEIsV0FBVyxFQUFFLGVBQWU7WUFDNUIsa0JBQWtCLEVBQUUsc0JBQXNCO1lBQzFDLE9BQU8sRUFBRSxXQUFXO1lBQ3BCLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsVUFBVSxFQUFFLGNBQWM7U0FDM0I7UUFDRCxJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUUsV0FBVztZQUNsQixNQUFNLEVBQUUsWUFBWTtZQUNwQixLQUFLLEVBQUUsV0FBVztTQUNuQjtLQUNGO0lBQ0QsZUFBZSxFQUFFO1FBQ2YsT0FBTyxFQUFFLFdBQVc7UUFDcEIsSUFBSSxFQUFFLFFBQVE7S0FDZjtDQUNGLENBQ0YsQ0FBQTtBQTJCZ0Isd0NBQWM7QUFqQi9CLE1BQU0sTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFlLEVBQUUsRUFBRTtJQUN0SSxPQUFPLENBQ0wsQ0FBQyxNQUFNLENBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FDYixTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsV0FBVyxJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FDOUYsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ1QsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ2hCLElBQUksS0FBSyxDQUFDLENBRVY7TUFBQSxDQUFDLFFBQVEsQ0FDVDtNQUFBLENBQUMsT0FBTyxJQUFJLENBQUMsaUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyx1Q0FBdUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUcsQ0FDckg7SUFBQSxFQUFFLE1BQU0sQ0FBQyxDQUNWLENBQUE7QUFDSCxDQUFDLENBQUE7QUFJUSx3QkFBTTtBQUhmLE1BQU0sQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFBO0FBRTdCLGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVmFyaWFudFByb3BzIH0gZnJvbSAnY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5J1xuaW1wb3J0IHR5cGUgeyBDU1NQcm9wZXJ0aWVzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjdmEgfSBmcm9tICdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IFNwaW5uZXIgZnJvbSAnLi4vc3Bpbm5lcidcblxuY29uc3QgYnV0dG9uVmFyaWFudHMgPSBjdmEoXG4gICdidG4gZGlzYWJsZWQ6YnRuLWRpc2FibGVkJyxcbiAge1xuICAgIHZhcmlhbnRzOiB7XG4gICAgICB2YXJpYW50OiB7XG4gICAgICAgICdwcmltYXJ5JzogJ2J0bi1wcmltYXJ5JyxcbiAgICAgICAgJ3dhcm5pbmcnOiAnYnRuLXdhcm5pbmcnLFxuICAgICAgICAnc2Vjb25kYXJ5JzogJ2J0bi1zZWNvbmRhcnknLFxuICAgICAgICAnc2Vjb25kYXJ5LWFjY2VudCc6ICdidG4tc2Vjb25kYXJ5LWFjY2VudCcsXG4gICAgICAgICdnaG9zdCc6ICdidG4tZ2hvc3QnLFxuICAgICAgICAnZ2hvc3QtYWNjZW50JzogJ2J0bi1naG9zdC1hY2NlbnQnLFxuICAgICAgICAndGVydGlhcnknOiAnYnRuLXRlcnRpYXJ5JyxcbiAgICAgIH0sXG4gICAgICBzaXplOiB7XG4gICAgICAgIHNtYWxsOiAnYnRuLXNtYWxsJyxcbiAgICAgICAgbWVkaXVtOiAnYnRuLW1lZGl1bScsXG4gICAgICAgIGxhcmdlOiAnYnRuLWxhcmdlJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkZWZhdWx0VmFyaWFudHM6IHtcbiAgICAgIHZhcmlhbnQ6ICdzZWNvbmRhcnknLFxuICAgICAgc2l6ZTogJ21lZGl1bScsXG4gICAgfSxcbiAgfSxcbilcblxuZXhwb3J0IHR5cGUgQnV0dG9uUHJvcHMgPSB7XG4gIGRlc3RydWN0aXZlPzogYm9vbGVhblxuICBsb2FkaW5nPzogYm9vbGVhblxuICBzdHlsZUNzcz86IENTU1Byb3BlcnRpZXNcbiAgc3Bpbm5lckNsYXNzTmFtZT86IHN0cmluZ1xuICByZWY/OiBSZWFjdC5SZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+XG59ICYgUmVhY3QuQnV0dG9uSFRNTEF0dHJpYnV0ZXM8SFRNTEJ1dHRvbkVsZW1lbnQ+ICYgVmFyaWFudFByb3BzPHR5cGVvZiBidXR0b25WYXJpYW50cz5cblxuY29uc3QgQnV0dG9uID0gKHsgY2xhc3NOYW1lLCB2YXJpYW50LCBzaXplLCBkZXN0cnVjdGl2ZSwgbG9hZGluZywgc3R5bGVDc3MsIGNoaWxkcmVuLCBzcGlubmVyQ2xhc3NOYW1lLCByZWYsIC4uLnByb3BzIH06IEJ1dHRvblByb3BzKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2NuKGJ1dHRvblZhcmlhbnRzKHsgdmFyaWFudCwgc2l6ZSwgY2xhc3NOYW1lIH0pLCBkZXN0cnVjdGl2ZSAmJiAnYnRuLWRlc3RydWN0aXZlJyl9XG4gICAgICByZWY9e3JlZn1cbiAgICAgIHN0eWxlPXtzdHlsZUNzc31cbiAgICAgIHsuLi5wcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgICB7bG9hZGluZyAmJiA8U3Bpbm5lciBsb2FkaW5nPXtsb2FkaW5nfSBjbGFzc05hbWU9e2NuKCchbWwtMSAhaC0zICF3LTMgIWJvcmRlci0yICF0ZXh0LXdoaXRlJywgc3Bpbm5lckNsYXNzTmFtZSl9IC8+fVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5CdXR0b24uZGlzcGxheU5hbWUgPSAnQnV0dG9uJ1xuXG5leHBvcnQgZGVmYXVsdCBCdXR0b25cbmV4cG9ydCB7IEJ1dHRvbiwgYnV0dG9uVmFyaWFudHMgfVxuIl19