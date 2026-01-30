"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zenCommand = exports.ZEN_TOGGLE_EVENT = void 0;
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const constants_1 = require("@/app/components/workflow/constants");
const command_bus_1 = require("./command-bus");
// Custom event name for zen toggle
exports.ZEN_TOGGLE_EVENT = 'zen-toggle-maximize';
// Shared function to dispatch zen toggle event
const toggleZenMode = () => {
    window.dispatchEvent(new CustomEvent(exports.ZEN_TOGGLE_EVENT));
};
/**
 * Zen command - Toggle canvas maximize (focus mode) in workflow pages
 * Only available in workflow and chatflow pages
 */
exports.zenCommand = {
    name: 'zen',
    description: 'Toggle canvas focus mode',
    mode: 'direct',
    // Only available in workflow/chatflow pages
    isAvailable: () => (0, constants_1.isInWorkflowPage)(),
    // Direct execution function
    execute: toggleZenMode,
    async search(_args, locale = 'en') {
        const i18n = (0, react_i18next_1.getI18n)();
        return [{
                id: 'zen',
                title: i18n.t('gotoAnything.actions.zenTitle', { ns: 'app', lng: locale }) || 'Zen Mode',
                description: i18n.t('gotoAnything.actions.zenDesc', { ns: 'app', lng: locale }) || 'Toggle canvas focus mode',
                type: 'command',
                icon: (<div className="flex h-6 w-6 items-center justify-center rounded-md border-[0.5px] border-divider-regular bg-components-panel-bg">
          <react_1.RiFullscreenLine className="h-4 w-4 text-text-tertiary"/>
        </div>),
                data: { command: 'workflow.zen', args: {} },
            }];
    },
    register(_deps) {
        (0, command_bus_1.registerCommands)({
            'workflow.zen': async () => toggleZenMode(),
        });
    },
    unregister() {
        (0, command_bus_1.unregisterCommands)(['workflow.zen']);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiemVuLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw0Q0FBbUQ7QUFDbkQsK0JBQThCO0FBQzlCLGlEQUF1QztBQUN2QyxtRUFBc0U7QUFDdEUsK0NBQW9FO0FBS3BFLG1DQUFtQztBQUN0QixRQUFBLGdCQUFnQixHQUFHLHFCQUFxQixDQUFBO0FBRXJELCtDQUErQztBQUMvQyxNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7SUFDekIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyx3QkFBZ0IsQ0FBQyxDQUFDLENBQUE7QUFDekQsQ0FBQyxDQUFBO0FBRUQ7OztHQUdHO0FBQ1UsUUFBQSxVQUFVLEdBQWlDO0lBQ3RELElBQUksRUFBRSxLQUFLO0lBQ1gsV0FBVyxFQUFFLDBCQUEwQjtJQUN2QyxJQUFJLEVBQUUsUUFBUTtJQUVkLDRDQUE0QztJQUM1QyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSw0QkFBZ0IsR0FBRTtJQUVyQyw0QkFBNEI7SUFDNUIsT0FBTyxFQUFFLGFBQWE7SUFFdEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFhLEVBQUUsU0FBaUIsSUFBSTtRQUMvQyxNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFPLEdBQUUsQ0FBQTtRQUN0QixPQUFPLENBQUM7Z0JBQ04sRUFBRSxFQUFFLEtBQUs7Z0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsK0JBQStCLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLFVBQVU7Z0JBQ3hGLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSwwQkFBMEI7Z0JBQzdHLElBQUksRUFBRSxTQUFrQjtnQkFDeEIsSUFBSSxFQUFFLENBQ0osQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtIQUFrSCxDQUMvSDtVQUFBLENBQUMsd0JBQWdCLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUMxRDtRQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7Z0JBQ0QsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2FBQzVDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBYztRQUNyQixJQUFBLDhCQUFnQixFQUFDO1lBQ2YsY0FBYyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsYUFBYSxFQUFFO1NBQzVDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBQSxnQ0FBa0IsRUFBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7SUFDdEMsQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNsYXNoQ29tbWFuZEhhbmRsZXIgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgUmlGdWxsc2NyZWVuTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGdldEkxOG4gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgaXNJbldvcmtmbG93UGFnZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvY29uc3RhbnRzJ1xuaW1wb3J0IHsgcmVnaXN0ZXJDb21tYW5kcywgdW5yZWdpc3RlckNvbW1hbmRzIH0gZnJvbSAnLi9jb21tYW5kLWJ1cydcblxuLy8gWmVuIGNvbW1hbmQgZGVwZW5kZW5jeSB0eXBlcyAtIG5vIGV4dGVybmFsIGRlcGVuZGVuY2llcyBuZWVkZWRcbnR5cGUgWmVuRGVwcyA9IFJlY29yZDxzdHJpbmcsIG5ldmVyPlxuXG4vLyBDdXN0b20gZXZlbnQgbmFtZSBmb3IgemVuIHRvZ2dsZVxuZXhwb3J0IGNvbnN0IFpFTl9UT0dHTEVfRVZFTlQgPSAnemVuLXRvZ2dsZS1tYXhpbWl6ZSdcblxuLy8gU2hhcmVkIGZ1bmN0aW9uIHRvIGRpc3BhdGNoIHplbiB0b2dnbGUgZXZlbnRcbmNvbnN0IHRvZ2dsZVplbk1vZGUgPSAoKSA9PiB7XG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChaRU5fVE9HR0xFX0VWRU5UKSlcbn1cblxuLyoqXG4gKiBaZW4gY29tbWFuZCAtIFRvZ2dsZSBjYW52YXMgbWF4aW1pemUgKGZvY3VzIG1vZGUpIGluIHdvcmtmbG93IHBhZ2VzXG4gKiBPbmx5IGF2YWlsYWJsZSBpbiB3b3JrZmxvdyBhbmQgY2hhdGZsb3cgcGFnZXNcbiAqL1xuZXhwb3J0IGNvbnN0IHplbkNvbW1hbmQ6IFNsYXNoQ29tbWFuZEhhbmRsZXI8WmVuRGVwcz4gPSB7XG4gIG5hbWU6ICd6ZW4nLFxuICBkZXNjcmlwdGlvbjogJ1RvZ2dsZSBjYW52YXMgZm9jdXMgbW9kZScsXG4gIG1vZGU6ICdkaXJlY3QnLFxuXG4gIC8vIE9ubHkgYXZhaWxhYmxlIGluIHdvcmtmbG93L2NoYXRmbG93IHBhZ2VzXG4gIGlzQXZhaWxhYmxlOiAoKSA9PiBpc0luV29ya2Zsb3dQYWdlKCksXG5cbiAgLy8gRGlyZWN0IGV4ZWN1dGlvbiBmdW5jdGlvblxuICBleGVjdXRlOiB0b2dnbGVaZW5Nb2RlLFxuXG4gIGFzeW5jIHNlYXJjaChfYXJnczogc3RyaW5nLCBsb2NhbGU6IHN0cmluZyA9ICdlbicpIHtcbiAgICBjb25zdCBpMThuID0gZ2V0STE4bigpXG4gICAgcmV0dXJuIFt7XG4gICAgICBpZDogJ3plbicsXG4gICAgICB0aXRsZTogaTE4bi50KCdnb3RvQW55dGhpbmcuYWN0aW9ucy56ZW5UaXRsZScsIHsgbnM6ICdhcHAnLCBsbmc6IGxvY2FsZSB9KSB8fCAnWmVuIE1vZGUnLFxuICAgICAgZGVzY3JpcHRpb246IGkxOG4udCgnZ290b0FueXRoaW5nLmFjdGlvbnMuemVuRGVzYycsIHsgbnM6ICdhcHAnLCBsbmc6IGxvY2FsZSB9KSB8fCAnVG9nZ2xlIGNhbnZhcyBmb2N1cyBtb2RlJyxcbiAgICAgIHR5cGU6ICdjb21tYW5kJyBhcyBjb25zdCxcbiAgICAgIGljb246IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtNiB3LTYgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbWQgYm9yZGVyLVswLjVweF0gYm9yZGVyLWRpdmlkZXItcmVndWxhciBiZy1jb21wb25lbnRzLXBhbmVsLWJnXCI+XG4gICAgICAgICAgPFJpRnVsbHNjcmVlbkxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICksXG4gICAgICBkYXRhOiB7IGNvbW1hbmQ6ICd3b3JrZmxvdy56ZW4nLCBhcmdzOiB7fSB9LFxuICAgIH1dXG4gIH0sXG5cbiAgcmVnaXN0ZXIoX2RlcHM6IFplbkRlcHMpIHtcbiAgICByZWdpc3RlckNvbW1hbmRzKHtcbiAgICAgICd3b3JrZmxvdy56ZW4nOiBhc3luYyAoKSA9PiB0b2dnbGVaZW5Nb2RlKCksXG4gICAgfSlcbiAgfSxcblxuICB1bnJlZ2lzdGVyKCkge1xuICAgIHVucmVnaXN0ZXJDb21tYW5kcyhbJ3dvcmtmbG93LnplbiddKVxuICB9LFxufVxuIl19