"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionButtonVariants = exports.ActionButtonState = exports.ActionButton = void 0;
const class_variance_authority_1 = require("class-variance-authority");
const React = require("react");
const classnames_1 = require("@/utils/classnames");
var ActionButtonState;
(function (ActionButtonState) {
    ActionButtonState["Destructive"] = "destructive";
    ActionButtonState["Active"] = "active";
    ActionButtonState["Disabled"] = "disabled";
    ActionButtonState["Default"] = "";
    ActionButtonState["Hover"] = "hover";
})(ActionButtonState || (exports.ActionButtonState = ActionButtonState = {}));
const actionButtonVariants = (0, class_variance_authority_1.cva)('action-btn', {
    variants: {
        size: {
            xs: 'action-btn-xs',
            m: 'action-btn-m',
            l: 'action-btn-l',
            xl: 'action-btn-xl',
        },
    },
    defaultVariants: {
        size: 'm',
    },
});
exports.actionButtonVariants = actionButtonVariants;
function getActionButtonState(state) {
    switch (state) {
        case ActionButtonState.Destructive:
            return 'action-btn-destructive';
        case ActionButtonState.Active:
            return 'action-btn-active';
        case ActionButtonState.Disabled:
            return 'action-btn-disabled';
        case ActionButtonState.Hover:
            return 'action-btn-hover';
        default:
            return '';
    }
}
const ActionButton = ({ className, size, state = ActionButtonState.Default, styleCss, children, ref, ...props }) => {
    return (<button type="button" className={(0, classnames_1.cn)(actionButtonVariants({ className, size }), getActionButtonState(state))} ref={ref} style={styleCss} {...props}>
      {children}
    </button>);
};
exports.ActionButton = ActionButton;
ActionButton.displayName = 'ActionButton';
exports.default = ActionButton;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsdUVBQThDO0FBQzlDLCtCQUE4QjtBQUM5QixtREFBdUM7QUFFdkMsSUFBSyxpQkFNSjtBQU5ELFdBQUssaUJBQWlCO0lBQ3BCLGdEQUEyQixDQUFBO0lBQzNCLHNDQUFpQixDQUFBO0lBQ2pCLDBDQUFxQixDQUFBO0lBQ3JCLGlDQUFZLENBQUE7SUFDWixvQ0FBZSxDQUFBO0FBQ2pCLENBQUMsRUFOSSxpQkFBaUIsaUNBQWpCLGlCQUFpQixRQU1yQjtBQUVELE1BQU0sb0JBQW9CLEdBQUcsSUFBQSw4QkFBRyxFQUM5QixZQUFZLEVBQ1o7SUFDRSxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixFQUFFLEVBQUUsZUFBZTtZQUNuQixDQUFDLEVBQUUsY0FBYztZQUNqQixDQUFDLEVBQUUsY0FBYztZQUNqQixFQUFFLEVBQUUsZUFBZTtTQUNwQjtLQUNGO0lBQ0QsZUFBZSxFQUFFO1FBQ2YsSUFBSSxFQUFFLEdBQUc7S0FDVjtDQUNGLENBQ0YsQ0FBQTtBQXdDeUMsb0RBQW9CO0FBL0I5RCxTQUFTLG9CQUFvQixDQUFDLEtBQXdCO0lBQ3BELFFBQVEsS0FBSyxFQUFFLENBQUM7UUFDZCxLQUFLLGlCQUFpQixDQUFDLFdBQVc7WUFDaEMsT0FBTyx3QkFBd0IsQ0FBQTtRQUNqQyxLQUFLLGlCQUFpQixDQUFDLE1BQU07WUFDM0IsT0FBTyxtQkFBbUIsQ0FBQTtRQUM1QixLQUFLLGlCQUFpQixDQUFDLFFBQVE7WUFDN0IsT0FBTyxxQkFBcUIsQ0FBQTtRQUM5QixLQUFLLGlCQUFpQixDQUFDLEtBQUs7WUFDMUIsT0FBTyxrQkFBa0IsQ0FBQTtRQUMzQjtZQUNFLE9BQU8sRUFBRSxDQUFBO0lBQ2IsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLFlBQVksR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFxQixFQUFFLEVBQUU7SUFDcEksT0FBTyxDQUNMLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsb0JBQW9CLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQ3RGLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNULEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNoQixJQUFJLEtBQUssQ0FBQyxDQUVWO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLE1BQU0sQ0FBQyxDQUNWLENBQUE7QUFDSCxDQUFDLENBQUE7QUFJUSxvQ0FBWTtBQUhyQixZQUFZLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQTtBQUV6QyxrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFZhcmlhbnRQcm9wcyB9IGZyb20gJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eSdcbmltcG9ydCB0eXBlIHsgQ1NTUHJvcGVydGllcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY3ZhIH0gZnJvbSAnY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxuZW51bSBBY3Rpb25CdXR0b25TdGF0ZSB7XG4gIERlc3RydWN0aXZlID0gJ2Rlc3RydWN0aXZlJyxcbiAgQWN0aXZlID0gJ2FjdGl2ZScsXG4gIERpc2FibGVkID0gJ2Rpc2FibGVkJyxcbiAgRGVmYXVsdCA9ICcnLFxuICBIb3ZlciA9ICdob3ZlcicsXG59XG5cbmNvbnN0IGFjdGlvbkJ1dHRvblZhcmlhbnRzID0gY3ZhKFxuICAnYWN0aW9uLWJ0bicsXG4gIHtcbiAgICB2YXJpYW50czoge1xuICAgICAgc2l6ZToge1xuICAgICAgICB4czogJ2FjdGlvbi1idG4teHMnLFxuICAgICAgICBtOiAnYWN0aW9uLWJ0bi1tJyxcbiAgICAgICAgbDogJ2FjdGlvbi1idG4tbCcsXG4gICAgICAgIHhsOiAnYWN0aW9uLWJ0bi14bCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGVmYXVsdFZhcmlhbnRzOiB7XG4gICAgICBzaXplOiAnbScsXG4gICAgfSxcbiAgfSxcbilcblxuZXhwb3J0IHR5cGUgQWN0aW9uQnV0dG9uUHJvcHMgPSB7XG4gIHNpemU/OiAneHMnIHwgJ3MnIHwgJ20nIHwgJ2wnIHwgJ3hsJ1xuICBzdGF0ZT86IEFjdGlvbkJ1dHRvblN0YXRlXG4gIHN0eWxlQ3NzPzogQ1NTUHJvcGVydGllc1xuICByZWY/OiBSZWFjdC5SZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+XG59ICYgUmVhY3QuQnV0dG9uSFRNTEF0dHJpYnV0ZXM8SFRNTEJ1dHRvbkVsZW1lbnQ+ICYgVmFyaWFudFByb3BzPHR5cGVvZiBhY3Rpb25CdXR0b25WYXJpYW50cz5cblxuZnVuY3Rpb24gZ2V0QWN0aW9uQnV0dG9uU3RhdGUoc3RhdGU6IEFjdGlvbkJ1dHRvblN0YXRlKSB7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIEFjdGlvbkJ1dHRvblN0YXRlLkRlc3RydWN0aXZlOlxuICAgICAgcmV0dXJuICdhY3Rpb24tYnRuLWRlc3RydWN0aXZlJ1xuICAgIGNhc2UgQWN0aW9uQnV0dG9uU3RhdGUuQWN0aXZlOlxuICAgICAgcmV0dXJuICdhY3Rpb24tYnRuLWFjdGl2ZSdcbiAgICBjYXNlIEFjdGlvbkJ1dHRvblN0YXRlLkRpc2FibGVkOlxuICAgICAgcmV0dXJuICdhY3Rpb24tYnRuLWRpc2FibGVkJ1xuICAgIGNhc2UgQWN0aW9uQnV0dG9uU3RhdGUuSG92ZXI6XG4gICAgICByZXR1cm4gJ2FjdGlvbi1idG4taG92ZXInXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJ1xuICB9XG59XG5cbmNvbnN0IEFjdGlvbkJ1dHRvbiA9ICh7IGNsYXNzTmFtZSwgc2l6ZSwgc3RhdGUgPSBBY3Rpb25CdXR0b25TdGF0ZS5EZWZhdWx0LCBzdHlsZUNzcywgY2hpbGRyZW4sIHJlZiwgLi4ucHJvcHMgfTogQWN0aW9uQnV0dG9uUHJvcHMpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT17Y24oYWN0aW9uQnV0dG9uVmFyaWFudHMoeyBjbGFzc05hbWUsIHNpemUgfSksIGdldEFjdGlvbkJ1dHRvblN0YXRlKHN0YXRlKSl9XG4gICAgICByZWY9e3JlZn1cbiAgICAgIHN0eWxlPXtzdHlsZUNzc31cbiAgICAgIHsuLi5wcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9idXR0b24+XG4gIClcbn1cbkFjdGlvbkJ1dHRvbi5kaXNwbGF5TmFtZSA9ICdBY3Rpb25CdXR0b24nXG5cbmV4cG9ydCBkZWZhdWx0IEFjdGlvbkJ1dHRvblxuZXhwb3J0IHsgQWN0aW9uQnV0dG9uLCBBY3Rpb25CdXR0b25TdGF0ZSwgYWN0aW9uQnV0dG9uVmFyaWFudHMgfVxuIl19