"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("@emoji-mart/data");
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const class_variance_authority_1 = require("class-variance-authority");
const emoji_mart_1 = require("emoji-mart");
const React = require("react");
const react_2 = require("react");
const classnames_1 = require("@/utils/classnames");
(0, emoji_mart_1.init)({ data: data_1.default });
const appIconVariants = (0, class_variance_authority_1.cva)('flex items-center justify-center relative grow-0 shrink-0 overflow-hidden leading-none border-[0.5px] border-divider-regular', {
    variants: {
        size: {
            xs: 'w-4 h-4 text-xs rounded-[4px]',
            tiny: 'w-6 h-6 text-base rounded-md',
            small: 'w-8 h-8 text-xl rounded-lg',
            medium: 'w-9 h-9 text-[22px] rounded-[10px]',
            large: 'w-10 h-10 text-[24px] rounded-[10px]',
            xl: 'w-12 h-12 text-[28px] rounded-xl',
            xxl: 'w-14 h-14 text-[32px] rounded-2xl',
        },
        rounded: {
            true: 'rounded-full',
        },
    },
    defaultVariants: {
        size: 'medium',
        rounded: false,
    },
});
const EditIconWrapperVariants = (0, class_variance_authority_1.cva)('absolute left-0 top-0 z-10 flex items-center justify-center bg-background-overlay-alt', {
    variants: {
        size: {
            xs: 'w-4 h-4 rounded-[4px]',
            tiny: 'w-6 h-6 rounded-md',
            small: 'w-8 h-8 rounded-lg',
            medium: 'w-9 h-9 rounded-[10px]',
            large: 'w-10 h-10 rounded-[10px]',
            xl: 'w-12 h-12 rounded-xl',
            xxl: 'w-14 h-14 rounded-2xl',
        },
        rounded: {
            true: 'rounded-full',
        },
    },
    defaultVariants: {
        size: 'medium',
        rounded: false,
    },
});
const EditIconVariants = (0, class_variance_authority_1.cva)('text-text-primary-on-surface', {
    variants: {
        size: {
            xs: 'size-3',
            tiny: 'size-3.5',
            small: 'size-5',
            medium: 'size-[22px]',
            large: 'size-6',
            xl: 'size-7',
            xxl: 'size-8',
        },
    },
    defaultVariants: {
        size: 'medium',
    },
});
const AppIcon = ({ size = 'medium', rounded = false, iconType, icon, background, imageUrl, className, innerIcon, coverElement, onClick, showEditIcon = false, }) => {
    const isValidImageIcon = iconType === 'image' && imageUrl;
    const Icon = (icon && icon !== '') ? <em-emoji id={icon}/> : <em-emoji id="🤖"/>;
    const wrapperRef = (0, react_2.useRef)(null);
    const isHovering = (0, ahooks_1.useHover)(wrapperRef);
    return (<span ref={wrapperRef} className={(0, classnames_1.cn)(appIconVariants({ size, rounded }), className)} style={{ background: isValidImageIcon ? undefined : (background || '#FFEAD5') }} onClick={onClick}>
      {isValidImageIcon
            ? <img src={imageUrl} className="h-full w-full" alt="app icon"/>
            : (innerIcon || Icon)}
      {showEditIcon && isHovering && (<div className={EditIconWrapperVariants({ size, rounded })}>
            <react_1.RiEditLine className={EditIconVariants({ size })}/>
          </div>)}
      {coverElement}
    </span>);
};
exports.default = React.memo(AppIcon);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWiwyQ0FBbUM7QUFDbkMsNENBQTZDO0FBQzdDLG1DQUFpQztBQUNqQyx1RUFBOEM7QUFDOUMsMkNBQWlDO0FBQ2pDLCtCQUE4QjtBQUM5QixpQ0FBOEI7QUFDOUIsbURBQXVDO0FBRXZDLElBQUEsaUJBQUksRUFBQyxFQUFFLElBQUksRUFBSixjQUFJLEVBQUUsQ0FBQyxDQUFBO0FBZWQsTUFBTSxlQUFlLEdBQUcsSUFBQSw4QkFBRyxFQUN6Qiw4SEFBOEgsRUFDOUg7SUFDRSxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixFQUFFLEVBQUUsK0JBQStCO1lBQ25DLElBQUksRUFBRSw4QkFBOEI7WUFDcEMsS0FBSyxFQUFFLDRCQUE0QjtZQUNuQyxNQUFNLEVBQUUsb0NBQW9DO1lBQzVDLEtBQUssRUFBRSxzQ0FBc0M7WUFDN0MsRUFBRSxFQUFFLGtDQUFrQztZQUN0QyxHQUFHLEVBQUUsbUNBQW1DO1NBQ3pDO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLGNBQWM7U0FDckI7S0FDRjtJQUNELGVBQWUsRUFBRTtRQUNmLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLEtBQUs7S0FDZjtDQUNGLENBQ0YsQ0FBQTtBQUNELE1BQU0sdUJBQXVCLEdBQUcsSUFBQSw4QkFBRyxFQUNqQyx1RkFBdUYsRUFDdkY7SUFDRSxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixFQUFFLEVBQUUsdUJBQXVCO1lBQzNCLElBQUksRUFBRSxvQkFBb0I7WUFDMUIsS0FBSyxFQUFFLG9CQUFvQjtZQUMzQixNQUFNLEVBQUUsd0JBQXdCO1lBQ2hDLEtBQUssRUFBRSwwQkFBMEI7WUFDakMsRUFBRSxFQUFFLHNCQUFzQjtZQUMxQixHQUFHLEVBQUUsdUJBQXVCO1NBQzdCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLGNBQWM7U0FDckI7S0FDRjtJQUNELGVBQWUsRUFBRTtRQUNmLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLEtBQUs7S0FDZjtDQUNGLENBQ0YsQ0FBQTtBQUNELE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSw4QkFBRyxFQUMxQiw4QkFBOEIsRUFDOUI7SUFDRSxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixFQUFFLEVBQUUsUUFBUTtZQUNaLElBQUksRUFBRSxVQUFVO1lBQ2hCLEtBQUssRUFBRSxRQUFRO1lBQ2YsTUFBTSxFQUFFLGFBQWE7WUFDckIsS0FBSyxFQUFFLFFBQVE7WUFDZixFQUFFLEVBQUUsUUFBUTtZQUNaLEdBQUcsRUFBRSxRQUFRO1NBQ2Q7S0FDRjtJQUNELGVBQWUsRUFBRTtRQUNmLElBQUksRUFBRSxRQUFRO0tBQ2Y7Q0FDRixDQUNGLENBQUE7QUFDRCxNQUFNLE9BQU8sR0FBcUIsQ0FBQyxFQUNqQyxJQUFJLEdBQUcsUUFBUSxFQUNmLE9BQU8sR0FBRyxLQUFLLEVBQ2YsUUFBUSxFQUNSLElBQUksRUFDSixVQUFVLEVBQ1YsUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLE9BQU8sRUFDUCxZQUFZLEdBQUcsS0FBSyxHQUNyQixFQUFFLEVBQUU7SUFDSCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsS0FBSyxPQUFPLElBQUksUUFBUSxDQUFBO0lBQ3pELE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRyxDQUFBO0lBQ2xGLE1BQU0sVUFBVSxHQUFHLElBQUEsY0FBTSxFQUFrQixJQUFJLENBQUMsQ0FBQTtJQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFBLGlCQUFRLEVBQUMsVUFBVSxDQUFDLENBQUE7SUFFdkMsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUNILEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUNoQixTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxlQUFlLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUM3RCxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQ2hGLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUVqQjtNQUFBLENBQ0UsZ0JBQWdCO1lBQ2QsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRztZQUNqRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUN4QixDQUNBO01BQUEsQ0FDRSxZQUFZLElBQUksVUFBVSxJQUFJLENBQzVCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FDekQ7WUFBQSxDQUFDLGtCQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQ3BEO1VBQUEsRUFBRSxHQUFHLENBQUMsQ0FFVixDQUNBO01BQUEsQ0FBQyxZQUFZLENBQ2Y7SUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IEFwcEljb25UeXBlIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgZGF0YSBmcm9tICdAZW1vamktbWFydC9kYXRhJ1xuaW1wb3J0IHsgUmlFZGl0TGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyB1c2VIb3ZlciB9IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IGN2YSB9IGZyb20gJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eSdcbmltcG9ydCB7IGluaXQgfSBmcm9tICdlbW9qaS1tYXJ0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VSZWYgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuXG5pbml0KHsgZGF0YSB9KVxuXG5leHBvcnQgdHlwZSBBcHBJY29uUHJvcHMgPSB7XG4gIHNpemU/OiAneHMnIHwgJ3RpbnknIHwgJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJyB8ICd4bCcgfCAneHhsJ1xuICByb3VuZGVkPzogYm9vbGVhblxuICBpY29uVHlwZT86IEFwcEljb25UeXBlIHwgbnVsbFxuICBpY29uPzogc3RyaW5nXG4gIGJhY2tncm91bmQ/OiBzdHJpbmcgfCBudWxsXG4gIGltYWdlVXJsPzogc3RyaW5nIHwgbnVsbFxuICBjbGFzc05hbWU/OiBzdHJpbmdcbiAgaW5uZXJJY29uPzogUmVhY3QuUmVhY3ROb2RlXG4gIGNvdmVyRWxlbWVudD86IFJlYWN0LlJlYWN0Tm9kZVxuICBzaG93RWRpdEljb24/OiBib29sZWFuXG4gIG9uQ2xpY2s/OiAoKSA9PiB2b2lkXG59XG5jb25zdCBhcHBJY29uVmFyaWFudHMgPSBjdmEoXG4gICdmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByZWxhdGl2ZSBncm93LTAgc2hyaW5rLTAgb3ZlcmZsb3ctaGlkZGVuIGxlYWRpbmctbm9uZSBib3JkZXItWzAuNXB4XSBib3JkZXItZGl2aWRlci1yZWd1bGFyJyxcbiAge1xuICAgIHZhcmlhbnRzOiB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIHhzOiAndy00IGgtNCB0ZXh0LXhzIHJvdW5kZWQtWzRweF0nLFxuICAgICAgICB0aW55OiAndy02IGgtNiB0ZXh0LWJhc2Ugcm91bmRlZC1tZCcsXG4gICAgICAgIHNtYWxsOiAndy04IGgtOCB0ZXh0LXhsIHJvdW5kZWQtbGcnLFxuICAgICAgICBtZWRpdW06ICd3LTkgaC05IHRleHQtWzIycHhdIHJvdW5kZWQtWzEwcHhdJyxcbiAgICAgICAgbGFyZ2U6ICd3LTEwIGgtMTAgdGV4dC1bMjRweF0gcm91bmRlZC1bMTBweF0nLFxuICAgICAgICB4bDogJ3ctMTIgaC0xMiB0ZXh0LVsyOHB4XSByb3VuZGVkLXhsJyxcbiAgICAgICAgeHhsOiAndy0xNCBoLTE0IHRleHQtWzMycHhdIHJvdW5kZWQtMnhsJyxcbiAgICAgIH0sXG4gICAgICByb3VuZGVkOiB7XG4gICAgICAgIHRydWU6ICdyb3VuZGVkLWZ1bGwnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmF1bHRWYXJpYW50czoge1xuICAgICAgc2l6ZTogJ21lZGl1bScsXG4gICAgICByb3VuZGVkOiBmYWxzZSxcbiAgICB9LFxuICB9LFxuKVxuY29uc3QgRWRpdEljb25XcmFwcGVyVmFyaWFudHMgPSBjdmEoXG4gICdhYnNvbHV0ZSBsZWZ0LTAgdG9wLTAgei0xMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1iYWNrZ3JvdW5kLW92ZXJsYXktYWx0JyxcbiAge1xuICAgIHZhcmlhbnRzOiB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIHhzOiAndy00IGgtNCByb3VuZGVkLVs0cHhdJyxcbiAgICAgICAgdGlueTogJ3ctNiBoLTYgcm91bmRlZC1tZCcsXG4gICAgICAgIHNtYWxsOiAndy04IGgtOCByb3VuZGVkLWxnJyxcbiAgICAgICAgbWVkaXVtOiAndy05IGgtOSByb3VuZGVkLVsxMHB4XScsXG4gICAgICAgIGxhcmdlOiAndy0xMCBoLTEwIHJvdW5kZWQtWzEwcHhdJyxcbiAgICAgICAgeGw6ICd3LTEyIGgtMTIgcm91bmRlZC14bCcsXG4gICAgICAgIHh4bDogJ3ctMTQgaC0xNCByb3VuZGVkLTJ4bCcsXG4gICAgICB9LFxuICAgICAgcm91bmRlZDoge1xuICAgICAgICB0cnVlOiAncm91bmRlZC1mdWxsJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkZWZhdWx0VmFyaWFudHM6IHtcbiAgICAgIHNpemU6ICdtZWRpdW0nLFxuICAgICAgcm91bmRlZDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbilcbmNvbnN0IEVkaXRJY29uVmFyaWFudHMgPSBjdmEoXG4gICd0ZXh0LXRleHQtcHJpbWFyeS1vbi1zdXJmYWNlJyxcbiAge1xuICAgIHZhcmlhbnRzOiB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIHhzOiAnc2l6ZS0zJyxcbiAgICAgICAgdGlueTogJ3NpemUtMy41JyxcbiAgICAgICAgc21hbGw6ICdzaXplLTUnLFxuICAgICAgICBtZWRpdW06ICdzaXplLVsyMnB4XScsXG4gICAgICAgIGxhcmdlOiAnc2l6ZS02JyxcbiAgICAgICAgeGw6ICdzaXplLTcnLFxuICAgICAgICB4eGw6ICdzaXplLTgnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmF1bHRWYXJpYW50czoge1xuICAgICAgc2l6ZTogJ21lZGl1bScsXG4gICAgfSxcbiAgfSxcbilcbmNvbnN0IEFwcEljb246IEZDPEFwcEljb25Qcm9wcz4gPSAoe1xuICBzaXplID0gJ21lZGl1bScsXG4gIHJvdW5kZWQgPSBmYWxzZSxcbiAgaWNvblR5cGUsXG4gIGljb24sXG4gIGJhY2tncm91bmQsXG4gIGltYWdlVXJsLFxuICBjbGFzc05hbWUsXG4gIGlubmVySWNvbixcbiAgY292ZXJFbGVtZW50LFxuICBvbkNsaWNrLFxuICBzaG93RWRpdEljb24gPSBmYWxzZSxcbn0pID0+IHtcbiAgY29uc3QgaXNWYWxpZEltYWdlSWNvbiA9IGljb25UeXBlID09PSAnaW1hZ2UnICYmIGltYWdlVXJsXG4gIGNvbnN0IEljb24gPSAoaWNvbiAmJiBpY29uICE9PSAnJykgPyA8ZW0tZW1vamkgaWQ9e2ljb259IC8+IDogPGVtLWVtb2ppIGlkPVwi8J+kllwiIC8+XG4gIGNvbnN0IHdyYXBwZXJSZWYgPSB1c2VSZWY8SFRNTFNwYW5FbGVtZW50PihudWxsKVxuICBjb25zdCBpc0hvdmVyaW5nID0gdXNlSG92ZXIod3JhcHBlclJlZilcblxuICByZXR1cm4gKFxuICAgIDxzcGFuXG4gICAgICByZWY9e3dyYXBwZXJSZWZ9XG4gICAgICBjbGFzc05hbWU9e2NuKGFwcEljb25WYXJpYW50cyh7IHNpemUsIHJvdW5kZWQgfSksIGNsYXNzTmFtZSl9XG4gICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiBpc1ZhbGlkSW1hZ2VJY29uID8gdW5kZWZpbmVkIDogKGJhY2tncm91bmQgfHwgJyNGRkVBRDUnKSB9fVxuICAgICAgb25DbGljaz17b25DbGlja31cbiAgICA+XG4gICAgICB7XG4gICAgICAgIGlzVmFsaWRJbWFnZUljb25cbiAgICAgICAgICA/IDxpbWcgc3JjPXtpbWFnZVVybH0gY2xhc3NOYW1lPVwiaC1mdWxsIHctZnVsbFwiIGFsdD1cImFwcCBpY29uXCIgLz5cbiAgICAgICAgICA6IChpbm5lckljb24gfHwgSWNvbilcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgc2hvd0VkaXRJY29uICYmIGlzSG92ZXJpbmcgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtFZGl0SWNvbldyYXBwZXJWYXJpYW50cyh7IHNpemUsIHJvdW5kZWQgfSl9PlxuICAgICAgICAgICAgPFJpRWRpdExpbmUgY2xhc3NOYW1lPXtFZGl0SWNvblZhcmlhbnRzKHsgc2l6ZSB9KX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgICAgfVxuICAgICAge2NvdmVyRWxlbWVudH1cbiAgICA8L3NwYW4+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhBcHBJY29uKVxuIl19