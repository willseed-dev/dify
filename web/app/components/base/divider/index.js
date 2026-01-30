"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_variance_authority_1 = require("class-variance-authority");
const React = require("react");
const classnames_1 = require("@/utils/classnames");
const dividerVariants = (0, class_variance_authority_1.cva)('', {
    variants: {
        type: {
            horizontal: 'w-full h-[0.5px] my-2 ',
            vertical: 'w-[1px] h-full mx-2',
        },
        bgStyle: {
            gradient: 'bg-gradient-to-r from-divider-regular to-background-gradient-mask-transparent',
            solid: 'bg-divider-regular',
        },
    },
    defaultVariants: {
        type: 'horizontal',
        bgStyle: 'solid',
    },
});
const Divider = ({ type, bgStyle, className = '', style }) => {
    return (<div className={(0, classnames_1.cn)(dividerVariants({ type, bgStyle }), 'shrink-0', className)} style={style}></div>);
};
exports.default = Divider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx1RUFBOEM7QUFDOUMsK0JBQThCO0FBQzlCLG1EQUF1QztBQUV2QyxNQUFNLGVBQWUsR0FBRyxJQUFBLDhCQUFHLEVBQUMsRUFBRSxFQUFFO0lBQzlCLFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRTtZQUNKLFVBQVUsRUFBRSx3QkFBd0I7WUFDcEMsUUFBUSxFQUFFLHFCQUFxQjtTQUNoQztRQUNELE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRSwrRUFBK0U7WUFDekYsS0FBSyxFQUFFLG9CQUFvQjtTQUM1QjtLQUNGO0lBQ0QsZUFBZSxFQUFFO1FBQ2YsSUFBSSxFQUFFLFlBQVk7UUFDbEIsT0FBTyxFQUFFLE9BQU87S0FDakI7Q0FDRixDQUFDLENBQUE7QUFPRixNQUFNLE9BQU8sR0FBcUIsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO0lBQzdFLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxlQUFlLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUNwRyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBWYXJpYW50UHJvcHMgfSBmcm9tICdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknXG5pbXBvcnQgdHlwZSB7IENTU1Byb3BlcnRpZXMsIEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjdmEgfSBmcm9tICdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuXG5jb25zdCBkaXZpZGVyVmFyaWFudHMgPSBjdmEoJycsIHtcbiAgdmFyaWFudHM6IHtcbiAgICB0eXBlOiB7XG4gICAgICBob3Jpem9udGFsOiAndy1mdWxsIGgtWzAuNXB4XSBteS0yICcsXG4gICAgICB2ZXJ0aWNhbDogJ3ctWzFweF0gaC1mdWxsIG14LTInLFxuICAgIH0sXG4gICAgYmdTdHlsZToge1xuICAgICAgZ3JhZGllbnQ6ICdiZy1ncmFkaWVudC10by1yIGZyb20tZGl2aWRlci1yZWd1bGFyIHRvLWJhY2tncm91bmQtZ3JhZGllbnQtbWFzay10cmFuc3BhcmVudCcsXG4gICAgICBzb2xpZDogJ2JnLWRpdmlkZXItcmVndWxhcicsXG4gICAgfSxcbiAgfSxcbiAgZGVmYXVsdFZhcmlhbnRzOiB7XG4gICAgdHlwZTogJ2hvcml6b250YWwnLFxuICAgIGJnU3R5bGU6ICdzb2xpZCcsXG4gIH0sXG59KVxuXG5leHBvcnQgdHlwZSBEaXZpZGVyUHJvcHMgPSB7XG4gIGNsYXNzTmFtZT86IHN0cmluZ1xuICBzdHlsZT86IENTU1Byb3BlcnRpZXNcbn0gJiBWYXJpYW50UHJvcHM8dHlwZW9mIGRpdmlkZXJWYXJpYW50cz5cblxuY29uc3QgRGl2aWRlcjogRkM8RGl2aWRlclByb3BzPiA9ICh7IHR5cGUsIGJnU3R5bGUsIGNsYXNzTmFtZSA9ICcnLCBzdHlsZSB9KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKGRpdmlkZXJWYXJpYW50cyh7IHR5cGUsIGJnU3R5bGUgfSksICdzaHJpbmstMCcsIGNsYXNzTmFtZSl9IHN0eWxlPXtzdHlsZX0+PC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGl2aWRlclxuIl19