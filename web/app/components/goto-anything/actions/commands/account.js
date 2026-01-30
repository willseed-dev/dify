"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountCommand = void 0;
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const command_bus_1 = require("./command-bus");
/**
 * Account command - Navigates to account page
 */
exports.accountCommand = {
    name: 'account',
    description: 'Navigate to account page',
    mode: 'direct',
    // Direct execution function
    execute: () => {
        window.location.href = '/account';
    },
    async search(args, locale = 'en') {
        const i18n = (0, react_i18next_1.getI18n)();
        return [{
                id: 'account',
                title: i18n.t('account.account', { ns: 'common', lng: locale }),
                description: i18n.t('gotoAnything.actions.accountDesc', { ns: 'app', lng: locale }),
                type: 'command',
                icon: (<div className="flex h-6 w-6 items-center justify-center rounded-md border-[0.5px] border-divider-regular bg-components-panel-bg">
          <react_1.RiUser3Line className="h-4 w-4 text-text-tertiary"/>
        </div>),
                data: { command: 'navigation.account', args: {} },
            }];
    },
    register(_deps) {
        (0, command_bus_1.registerCommands)({
            'navigation.account': async (_args) => {
                // Navigate to account page
                window.location.href = '/account';
            },
        });
    },
    unregister() {
        (0, command_bus_1.unregisterCommands)(['navigation.account']);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY291bnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRDQUE4QztBQUM5QywrQkFBOEI7QUFDOUIsaURBQXVDO0FBQ3ZDLCtDQUFvRTtBQUtwRTs7R0FFRztBQUNVLFFBQUEsY0FBYyxHQUFxQztJQUM5RCxJQUFJLEVBQUUsU0FBUztJQUNmLFdBQVcsRUFBRSwwQkFBMEI7SUFDdkMsSUFBSSxFQUFFLFFBQVE7SUFFZCw0QkFBNEI7SUFDNUIsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNaLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFZLEVBQUUsU0FBaUIsSUFBSTtRQUM5QyxNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFPLEdBQUUsQ0FBQTtRQUN0QixPQUFPLENBQUM7Z0JBQ04sRUFBRSxFQUFFLFNBQVM7Z0JBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFDL0QsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsa0NBQWtDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFDbkYsSUFBSSxFQUFFLFNBQWtCO2dCQUN4QixJQUFJLEVBQUUsQ0FDSixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0hBQWtILENBQy9IO1VBQUEsQ0FBQyxtQkFBVyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFDckQ7UUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO2dCQUNELElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2FBQ2xELENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBa0I7UUFDekIsSUFBQSw4QkFBZ0IsRUFBQztZQUNmLG9CQUFvQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDcEMsMkJBQTJCO2dCQUMzQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUE7WUFDbkMsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBQSxnQ0FBa0IsRUFBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU2xhc2hDb21tYW5kSGFuZGxlciB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBSaVVzZXIzTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGdldEkxOG4gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgcmVnaXN0ZXJDb21tYW5kcywgdW5yZWdpc3RlckNvbW1hbmRzIH0gZnJvbSAnLi9jb21tYW5kLWJ1cydcblxuLy8gQWNjb3VudCBjb21tYW5kIGRlcGVuZGVuY3kgdHlwZXMgLSBubyBleHRlcm5hbCBkZXBlbmRlbmNpZXMgbmVlZGVkXG50eXBlIEFjY291bnREZXBzID0gUmVjb3JkPHN0cmluZywgbmV2ZXI+XG5cbi8qKlxuICogQWNjb3VudCBjb21tYW5kIC0gTmF2aWdhdGVzIHRvIGFjY291bnQgcGFnZVxuICovXG5leHBvcnQgY29uc3QgYWNjb3VudENvbW1hbmQ6IFNsYXNoQ29tbWFuZEhhbmRsZXI8QWNjb3VudERlcHM+ID0ge1xuICBuYW1lOiAnYWNjb3VudCcsXG4gIGRlc2NyaXB0aW9uOiAnTmF2aWdhdGUgdG8gYWNjb3VudCBwYWdlJyxcbiAgbW9kZTogJ2RpcmVjdCcsXG5cbiAgLy8gRGlyZWN0IGV4ZWN1dGlvbiBmdW5jdGlvblxuICBleGVjdXRlOiAoKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2FjY291bnQnXG4gIH0sXG5cbiAgYXN5bmMgc2VhcmNoKGFyZ3M6IHN0cmluZywgbG9jYWxlOiBzdHJpbmcgPSAnZW4nKSB7XG4gICAgY29uc3QgaTE4biA9IGdldEkxOG4oKVxuICAgIHJldHVybiBbe1xuICAgICAgaWQ6ICdhY2NvdW50JyxcbiAgICAgIHRpdGxlOiBpMThuLnQoJ2FjY291bnQuYWNjb3VudCcsIHsgbnM6ICdjb21tb24nLCBsbmc6IGxvY2FsZSB9KSxcbiAgICAgIGRlc2NyaXB0aW9uOiBpMThuLnQoJ2dvdG9Bbnl0aGluZy5hY3Rpb25zLmFjY291bnREZXNjJywgeyBuczogJ2FwcCcsIGxuZzogbG9jYWxlIH0pLFxuICAgICAgdHlwZTogJ2NvbW1hbmQnIGFzIGNvbnN0LFxuICAgICAgaWNvbjogKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC02IHctNiBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1tZCBib3JkZXItWzAuNXB4XSBib3JkZXItZGl2aWRlci1yZWd1bGFyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmdcIj5cbiAgICAgICAgICA8UmlVc2VyM0xpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICksXG4gICAgICBkYXRhOiB7IGNvbW1hbmQ6ICduYXZpZ2F0aW9uLmFjY291bnQnLCBhcmdzOiB7fSB9LFxuICAgIH1dXG4gIH0sXG5cbiAgcmVnaXN0ZXIoX2RlcHM6IEFjY291bnREZXBzKSB7XG4gICAgcmVnaXN0ZXJDb21tYW5kcyh7XG4gICAgICAnbmF2aWdhdGlvbi5hY2NvdW50JzogYXN5bmMgKF9hcmdzKSA9PiB7XG4gICAgICAgIC8vIE5hdmlnYXRlIHRvIGFjY291bnQgcGFnZVxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYWNjb3VudCdcbiAgICAgIH0sXG4gICAgfSlcbiAgfSxcblxuICB1bnJlZ2lzdGVyKCkge1xuICAgIHVucmVnaXN0ZXJDb21tYW5kcyhbJ25hdmlnYXRpb24uYWNjb3VudCddKVxuICB9LFxufVxuIl19