"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@headlessui/react");
const function_1 = require("es-toolkit/function");
const react_2 = require("react");
const classnames_1 = require("@/utils/classnames");
const MenuDialog = ({ className, children, show, onClose, }) => {
    const close = (0, react_2.useCallback)(() => onClose?.(), [onClose]);
    (0, react_2.useEffect)(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                close();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [close]);
    return (<react_1.Transition appear show={show} as={react_2.Fragment}>
      <react_1.Dialog as="div" className="relative z-[60]" onClose={function_1.noop}>
        <div className="fixed inset-0">
          <div className="flex min-h-full flex-col items-center justify-center">
            <react_1.TransitionChild>
              <react_1.DialogPanel className={(0, classnames_1.cn)('relative h-full w-full grow overflow-hidden bg-background-sidenav-bg p-0 text-left align-middle backdrop-blur-md transition-all', 'duration-300 ease-in data-[closed]:scale-95 data-[closed]:opacity-0', 'data-[enter]:scale-100 data-[enter]:opacity-100', 'data-[enter]:scale-95 data-[leave]:opacity-0', className)}>
                <div className="absolute right-0 top-0 h-full w-1/2 bg-components-panel-bg"/>
                {children}
              </react_1.DialogPanel>
            </react_1.TransitionChild>
          </div>
        </div>
      </react_1.Dialog>
    </react_1.Transition>);
};
exports.default = MenuDialog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1kaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZW51LWRpYWxvZy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2Q0FBb0Y7QUFDcEYsa0RBQTBDO0FBQzFDLGlDQUF3RDtBQUN4RCxtREFBdUM7QUFTdkMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUNsQixTQUFTLEVBQ1QsUUFBUSxFQUNSLElBQUksRUFDSixPQUFPLEdBQ0ssRUFBRSxFQUFFO0lBQ2hCLE1BQU0sS0FBSyxHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUV2RCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFvQixFQUFFLEVBQUU7WUFDN0MsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVEsRUFBRSxDQUFDO2dCQUMzQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7Z0JBQ3RCLEtBQUssRUFBRSxDQUFBO1lBQ1QsQ0FBQztRQUNILENBQUMsQ0FBQTtRQUVELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUE7UUFDbkQsT0FBTyxHQUFHLEVBQUU7WUFDVixRQUFRLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFBO1FBQ3hELENBQUMsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFFWCxPQUFPLENBQ0wsQ0FBQyxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBUSxDQUFDLENBQzFDO01BQUEsQ0FBQyxjQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBSSxDQUFDLENBQ3pEO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FDNUI7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0RBQXNELENBQ25FO1lBQUEsQ0FBQyx1QkFBZSxDQUNkO2NBQUEsQ0FBQyxtQkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUN4QixpSUFBaUksRUFDakkscUVBQXFFLEVBQ3JFLGlEQUFpRCxFQUNqRCw4Q0FBOEMsRUFDOUMsU0FBUyxDQUNWLENBQUMsQ0FFQTtnQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNERBQTRELEVBQzNFO2dCQUFBLENBQUMsUUFBUSxDQUNYO2NBQUEsRUFBRSxtQkFBVyxDQUNmO1lBQUEsRUFBRSx1QkFBZSxDQUNuQjtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLGNBQU0sQ0FDVjtJQUFBLEVBQUUsa0JBQVUsQ0FBQyxDQUNkLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxVQUFVLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRGlhbG9nLCBEaWFsb2dQYW5lbCwgVHJhbnNpdGlvbiwgVHJhbnNpdGlvbkNoaWxkIH0gZnJvbSAnQGhlYWRsZXNzdWkvcmVhY3QnXG5pbXBvcnQgeyBub29wIH0gZnJvbSAnZXMtdG9vbGtpdC9mdW5jdGlvbidcbmltcG9ydCB7IEZyYWdtZW50LCB1c2VDYWxsYmFjaywgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxudHlwZSBEaWFsb2dQcm9wcyA9IHtcbiAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIGNoaWxkcmVuOiBSZWFjdE5vZGVcbiAgc2hvdzogYm9vbGVhblxuICBvbkNsb3NlPzogKCkgPT4gdm9pZFxufVxuXG5jb25zdCBNZW51RGlhbG9nID0gKHtcbiAgY2xhc3NOYW1lLFxuICBjaGlsZHJlbixcbiAgc2hvdyxcbiAgb25DbG9zZSxcbn06IERpYWxvZ1Byb3BzKSA9PiB7XG4gIGNvbnN0IGNsb3NlID0gdXNlQ2FsbGJhY2soKCkgPT4gb25DbG9zZT8uKCksIFtvbkNsb3NlXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgY2xvc2UoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bilcbiAgICB9XG4gIH0sIFtjbG9zZV0pXG5cbiAgcmV0dXJuIChcbiAgICA8VHJhbnNpdGlvbiBhcHBlYXIgc2hvdz17c2hvd30gYXM9e0ZyYWdtZW50fT5cbiAgICAgIDxEaWFsb2cgYXM9XCJkaXZcIiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LVs2MF1cIiBvbkNsb3NlPXtub29wfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IG1pbi1oLWZ1bGwgZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICA8VHJhbnNpdGlvbkNoaWxkPlxuICAgICAgICAgICAgICA8RGlhbG9nUGFuZWwgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgICAncmVsYXRpdmUgaC1mdWxsIHctZnVsbCBncm93IG92ZXJmbG93LWhpZGRlbiBiZy1iYWNrZ3JvdW5kLXNpZGVuYXYtYmcgcC0wIHRleHQtbGVmdCBhbGlnbi1taWRkbGUgYmFja2Ryb3AtYmx1ci1tZCB0cmFuc2l0aW9uLWFsbCcsXG4gICAgICAgICAgICAgICAgJ2R1cmF0aW9uLTMwMCBlYXNlLWluIGRhdGEtW2Nsb3NlZF06c2NhbGUtOTUgZGF0YS1bY2xvc2VkXTpvcGFjaXR5LTAnLFxuICAgICAgICAgICAgICAgICdkYXRhLVtlbnRlcl06c2NhbGUtMTAwIGRhdGEtW2VudGVyXTpvcGFjaXR5LTEwMCcsXG4gICAgICAgICAgICAgICAgJ2RhdGEtW2VudGVyXTpzY2FsZS05NSBkYXRhLVtsZWF2ZV06b3BhY2l0eS0wJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTAgdG9wLTAgaC1mdWxsIHctMS8yIGJnLWNvbXBvbmVudHMtcGFuZWwtYmdcIiAvPlxuICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgPC9EaWFsb2dQYW5lbD5cbiAgICAgICAgICAgIDwvVHJhbnNpdGlvbkNoaWxkPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRGlhbG9nPlxuICAgIDwvVHJhbnNpdGlvbj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51RGlhbG9nXG4iXX0=