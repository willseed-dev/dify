"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithIcon = exports.Loading = exports.Disabled = exports.Warning = exports.Tertiary = exports.GhostAccent = exports.Ghost = exports.SecondaryAccent = exports.Secondary = exports.Default = void 0;
const solid_1 = require("@heroicons/react/20/solid");
const _1 = require(".");
const meta = {
    title: 'Base/General/Button',
    component: _1.Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        loading: { control: 'boolean' },
        variant: {
            control: 'select',
            options: ['primary', 'warning', 'secondary', 'secondary-accent', 'ghost', 'ghost-accent', 'tertiary'],
        },
    },
    args: {
        variant: 'ghost',
        children: 'Button',
    },
};
exports.default = meta;
exports.Default = {
    args: {
        variant: 'primary',
        loading: false,
        children: 'Primary Button',
        styleCss: {},
        spinnerClassName: '',
        destructive: false,
    },
};
exports.Secondary = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};
exports.SecondaryAccent = {
    args: {
        variant: 'secondary-accent',
        children: 'Secondary Accent Button',
    },
};
exports.Ghost = {
    args: {
        variant: 'ghost',
        children: 'Ghost Button',
    },
};
exports.GhostAccent = {
    args: {
        variant: 'ghost-accent',
        children: 'Ghost Accent Button',
    },
};
exports.Tertiary = {
    args: {
        variant: 'tertiary',
        children: 'Tertiary Button',
    },
};
exports.Warning = {
    args: {
        variant: 'warning',
        children: 'Warning Button',
    },
};
exports.Disabled = {
    args: {
        variant: 'primary',
        disabled: true,
        children: 'Disabled Button',
    },
};
exports.Loading = {
    args: {
        variant: 'primary',
        loading: true,
        children: 'Loading Button',
    },
};
exports.WithIcon = {
    args: {
        variant: 'primary',
        children: (<>
        <solid_1.RocketLaunchIcon className="mr-1.5 h-4 w-4 stroke-[1.8px]"/>
        Launch
      </>),
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHFEQUE0RDtBQUM1RCx3QkFBMEI7QUFFMUIsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUscUJBQXFCO0lBQzVCLFNBQVMsRUFBRSxTQUFNO0lBQ2pCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxVQUFVO0tBQ25CO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLFFBQVEsRUFBRTtRQUNSLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7UUFDL0IsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUM7U0FDdEc7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFFBQVEsRUFBRSxRQUFRO0tBQ25CO0NBQzRCLENBQUE7QUFFL0Isa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxPQUFPLEdBQVU7SUFDNUIsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLFNBQVM7UUFDbEIsT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsZ0JBQWdCO1FBQzFCLFFBQVEsRUFBRSxFQUFFO1FBQ1osZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixXQUFXLEVBQUUsS0FBSztLQUNuQjtDQUNGLENBQUE7QUFFWSxRQUFBLFNBQVMsR0FBVTtJQUM5QixJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUUsV0FBVztRQUNwQixRQUFRLEVBQUUsa0JBQWtCO0tBQzdCO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsZUFBZSxHQUFVO0lBQ3BDLElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxrQkFBa0I7UUFDM0IsUUFBUSxFQUFFLHlCQUF5QjtLQUNwQztDQUNGLENBQUE7QUFFWSxRQUFBLEtBQUssR0FBVTtJQUMxQixJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUUsT0FBTztRQUNoQixRQUFRLEVBQUUsY0FBYztLQUN6QjtDQUNGLENBQUE7QUFFWSxRQUFBLFdBQVcsR0FBVTtJQUNoQyxJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUUsY0FBYztRQUN2QixRQUFRLEVBQUUscUJBQXFCO0tBQ2hDO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsUUFBUSxHQUFVO0lBQzdCLElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxVQUFVO1FBQ25CLFFBQVEsRUFBRSxpQkFBaUI7S0FDNUI7Q0FDRixDQUFBO0FBRVksUUFBQSxPQUFPLEdBQVU7SUFDNUIsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLFNBQVM7UUFDbEIsUUFBUSxFQUFFLGdCQUFnQjtLQUMzQjtDQUNGLENBQUE7QUFFWSxRQUFBLFFBQVEsR0FBVTtJQUM3QixJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUUsU0FBUztRQUNsQixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxpQkFBaUI7S0FDNUI7Q0FDRixDQUFBO0FBRVksUUFBQSxPQUFPLEdBQVU7SUFDNUIsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLFNBQVM7UUFDbEIsT0FBTyxFQUFFLElBQUk7UUFDYixRQUFRLEVBQUUsZ0JBQWdCO0tBQzNCO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsUUFBUSxHQUFVO0lBQzdCLElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLFFBQVEsRUFBRSxDQUNSLEVBQ0U7UUFBQSxDQUFDLHdCQUFnQixDQUFDLFNBQVMsQ0FBQywrQkFBK0IsRUFDM0Q7O01BQ0YsR0FBRyxDQUNKO0tBQ0Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuXG5pbXBvcnQgeyBSb2NrZXRMYXVuY2hJY29uIH0gZnJvbSAnQGhlcm9pY29ucy9yZWFjdC8yMC9zb2xpZCdcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9HZW5lcmFsL0J1dHRvbicsXG4gIGNvbXBvbmVudDogQnV0dG9uLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ1R5cGVzOiB7XG4gICAgbG9hZGluZzogeyBjb250cm9sOiAnYm9vbGVhbicgfSxcbiAgICB2YXJpYW50OiB7XG4gICAgICBjb250cm9sOiAnc2VsZWN0JyxcbiAgICAgIG9wdGlvbnM6IFsncHJpbWFyeScsICd3YXJuaW5nJywgJ3NlY29uZGFyeScsICdzZWNvbmRhcnktYWNjZW50JywgJ2dob3N0JywgJ2dob3N0LWFjY2VudCcsICd0ZXJ0aWFyeSddLFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICB2YXJpYW50OiAnZ2hvc3QnLFxuICAgIGNoaWxkcmVuOiAnQnV0dG9uJyxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEJ1dHRvbj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICB2YXJpYW50OiAncHJpbWFyeScsXG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgY2hpbGRyZW46ICdQcmltYXJ5IEJ1dHRvbicsXG4gICAgc3R5bGVDc3M6IHt9LFxuICAgIHNwaW5uZXJDbGFzc05hbWU6ICcnLFxuICAgIGRlc3RydWN0aXZlOiBmYWxzZSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IFNlY29uZGFyeTogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICB2YXJpYW50OiAnc2Vjb25kYXJ5JyxcbiAgICBjaGlsZHJlbjogJ1NlY29uZGFyeSBCdXR0b24nLFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgU2Vjb25kYXJ5QWNjZW50OiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIHZhcmlhbnQ6ICdzZWNvbmRhcnktYWNjZW50JyxcbiAgICBjaGlsZHJlbjogJ1NlY29uZGFyeSBBY2NlbnQgQnV0dG9uJyxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEdob3N0OiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIHZhcmlhbnQ6ICdnaG9zdCcsXG4gICAgY2hpbGRyZW46ICdHaG9zdCBCdXR0b24nLFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgR2hvc3RBY2NlbnQ6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgdmFyaWFudDogJ2dob3N0LWFjY2VudCcsXG4gICAgY2hpbGRyZW46ICdHaG9zdCBBY2NlbnQgQnV0dG9uJyxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IFRlcnRpYXJ5OiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIHZhcmlhbnQ6ICd0ZXJ0aWFyeScsXG4gICAgY2hpbGRyZW46ICdUZXJ0aWFyeSBCdXR0b24nLFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgV2FybmluZzogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICB2YXJpYW50OiAnd2FybmluZycsXG4gICAgY2hpbGRyZW46ICdXYXJuaW5nIEJ1dHRvbicsXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBEaXNhYmxlZDogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICB2YXJpYW50OiAncHJpbWFyeScsXG4gICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgY2hpbGRyZW46ICdEaXNhYmxlZCBCdXR0b24nLFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgTG9hZGluZzogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICB2YXJpYW50OiAncHJpbWFyeScsXG4gICAgbG9hZGluZzogdHJ1ZSxcbiAgICBjaGlsZHJlbjogJ0xvYWRpbmcgQnV0dG9uJyxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IFdpdGhJY29uOiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIHZhcmlhbnQ6ICdwcmltYXJ5JyxcbiAgICBjaGlsZHJlbjogKFxuICAgICAgPD5cbiAgICAgICAgPFJvY2tldExhdW5jaEljb24gY2xhc3NOYW1lPVwibXItMS41IGgtNCB3LTQgc3Ryb2tlLVsxLjhweF1cIiAvPlxuICAgICAgICBMYXVuY2hcbiAgICAgIDwvPlxuICAgICksXG4gIH0sXG59XG4iXX0=