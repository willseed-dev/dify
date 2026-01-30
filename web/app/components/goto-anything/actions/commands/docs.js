"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsCommand = void 0;
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const i18n_1 = require("@/context/i18n");
const language_1 = require("@/i18n-config/language");
const command_bus_1 = require("./command-bus");
/**
 * Documentation command - Opens help documentation
 */
exports.docsCommand = {
    name: 'docs',
    description: 'Open documentation',
    mode: 'direct',
    // Direct execution function
    execute: () => {
        const i18n = (0, react_i18next_1.getI18n)();
        const currentLocale = i18n.language;
        const docLanguage = (0, language_1.getDocLanguage)(currentLocale);
        const url = `${i18n_1.defaultDocBaseUrl}/${docLanguage}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    },
    async search(args, locale = 'en') {
        const i18n = (0, react_i18next_1.getI18n)();
        return [{
                id: 'doc',
                title: i18n.t('userProfile.helpCenter', { ns: 'common', lng: locale }),
                description: i18n.t('gotoAnything.actions.docDesc', { ns: 'app', lng: locale }) || 'Open help documentation',
                type: 'command',
                icon: (<div className="flex h-6 w-6 items-center justify-center rounded-md border-[0.5px] border-divider-regular bg-components-panel-bg">
          <react_1.RiBookOpenLine className="h-4 w-4 text-text-tertiary"/>
        </div>),
                data: { command: 'navigation.doc', args: {} },
            }];
    },
    register(_deps) {
        const i18n = (0, react_i18next_1.getI18n)();
        (0, command_bus_1.registerCommands)({
            'navigation.doc': async (_args) => {
                // Get the current language from i18n
                const currentLocale = i18n.language;
                const docLanguage = (0, language_1.getDocLanguage)(currentLocale);
                const url = `${i18n_1.defaultDocBaseUrl}/${docLanguage}`;
                window.open(url, '_blank', 'noopener,noreferrer');
            },
        });
    },
    unregister() {
        (0, command_bus_1.unregisterCommands)(['navigation.doc']);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRDQUFpRDtBQUNqRCwrQkFBOEI7QUFDOUIsaURBQXVDO0FBQ3ZDLHlDQUFrRDtBQUNsRCxxREFBdUQ7QUFDdkQsK0NBQW9FO0FBS3BFOztHQUVHO0FBQ1UsUUFBQSxXQUFXLEdBQWlDO0lBQ3ZELElBQUksRUFBRSxNQUFNO0lBQ1osV0FBVyxFQUFFLG9CQUFvQjtJQUNqQyxJQUFJLEVBQUUsUUFBUTtJQUVkLDRCQUE0QjtJQUM1QixPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ1osTUFBTSxJQUFJLEdBQUcsSUFBQSx1QkFBTyxHQUFFLENBQUE7UUFDdEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQTtRQUNuQyxNQUFNLFdBQVcsR0FBRyxJQUFBLHlCQUFjLEVBQUMsYUFBYSxDQUFDLENBQUE7UUFDakQsTUFBTSxHQUFHLEdBQUcsR0FBRyx3QkFBaUIsSUFBSSxXQUFXLEVBQUUsQ0FBQTtRQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUscUJBQXFCLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFZLEVBQUUsU0FBaUIsSUFBSTtRQUM5QyxNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFPLEdBQUUsQ0FBQTtRQUN0QixPQUFPLENBQUM7Z0JBQ04sRUFBRSxFQUFFLEtBQUs7Z0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFDdEUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsOEJBQThCLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLHlCQUF5QjtnQkFDNUcsSUFBSSxFQUFFLFNBQWtCO2dCQUN4QixJQUFJLEVBQUUsQ0FDSixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0hBQWtILENBQy9IO1VBQUEsQ0FBQyxzQkFBYyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFDeEQ7UUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO2dCQUNELElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2FBQzlDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBYztRQUNyQixNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFPLEdBQUUsQ0FBQTtRQUN0QixJQUFBLDhCQUFnQixFQUFDO1lBQ2YsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNoQyxxQ0FBcUM7Z0JBQ3JDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7Z0JBQ25DLE1BQU0sV0FBVyxHQUFHLElBQUEseUJBQWMsRUFBQyxhQUFhLENBQUMsQ0FBQTtnQkFDakQsTUFBTSxHQUFHLEdBQUcsR0FBRyx3QkFBaUIsSUFBSSxXQUFXLEVBQUUsQ0FBQTtnQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixDQUFDLENBQUE7WUFDbkQsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBQSxnQ0FBa0IsRUFBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU2xhc2hDb21tYW5kSGFuZGxlciB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBSaUJvb2tPcGVuTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGdldEkxOG4gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgZGVmYXVsdERvY0Jhc2VVcmwgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcbmltcG9ydCB7IGdldERvY0xhbmd1YWdlIH0gZnJvbSAnQC9pMThuLWNvbmZpZy9sYW5ndWFnZSdcbmltcG9ydCB7IHJlZ2lzdGVyQ29tbWFuZHMsIHVucmVnaXN0ZXJDb21tYW5kcyB9IGZyb20gJy4vY29tbWFuZC1idXMnXG5cbi8vIERvY3VtZW50YXRpb24gY29tbWFuZCBkZXBlbmRlbmN5IHR5cGVzIC0gbm8gZXh0ZXJuYWwgZGVwZW5kZW5jaWVzIG5lZWRlZFxudHlwZSBEb2NEZXBzID0gUmVjb3JkPHN0cmluZywgbmV2ZXI+XG5cbi8qKlxuICogRG9jdW1lbnRhdGlvbiBjb21tYW5kIC0gT3BlbnMgaGVscCBkb2N1bWVudGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBkb2NzQ29tbWFuZDogU2xhc2hDb21tYW5kSGFuZGxlcjxEb2NEZXBzPiA9IHtcbiAgbmFtZTogJ2RvY3MnLFxuICBkZXNjcmlwdGlvbjogJ09wZW4gZG9jdW1lbnRhdGlvbicsXG4gIG1vZGU6ICdkaXJlY3QnLFxuXG4gIC8vIERpcmVjdCBleGVjdXRpb24gZnVuY3Rpb25cbiAgZXhlY3V0ZTogKCkgPT4ge1xuICAgIGNvbnN0IGkxOG4gPSBnZXRJMThuKClcbiAgICBjb25zdCBjdXJyZW50TG9jYWxlID0gaTE4bi5sYW5ndWFnZVxuICAgIGNvbnN0IGRvY0xhbmd1YWdlID0gZ2V0RG9jTGFuZ3VhZ2UoY3VycmVudExvY2FsZSlcbiAgICBjb25zdCB1cmwgPSBgJHtkZWZhdWx0RG9jQmFzZVVybH0vJHtkb2NMYW5ndWFnZX1gXG4gICAgd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgJ25vb3BlbmVyLG5vcmVmZXJyZXInKVxuICB9LFxuXG4gIGFzeW5jIHNlYXJjaChhcmdzOiBzdHJpbmcsIGxvY2FsZTogc3RyaW5nID0gJ2VuJykge1xuICAgIGNvbnN0IGkxOG4gPSBnZXRJMThuKClcbiAgICByZXR1cm4gW3tcbiAgICAgIGlkOiAnZG9jJyxcbiAgICAgIHRpdGxlOiBpMThuLnQoJ3VzZXJQcm9maWxlLmhlbHBDZW50ZXInLCB7IG5zOiAnY29tbW9uJywgbG5nOiBsb2NhbGUgfSksXG4gICAgICBkZXNjcmlwdGlvbjogaTE4bi50KCdnb3RvQW55dGhpbmcuYWN0aW9ucy5kb2NEZXNjJywgeyBuczogJ2FwcCcsIGxuZzogbG9jYWxlIH0pIHx8ICdPcGVuIGhlbHAgZG9jdW1lbnRhdGlvbicsXG4gICAgICB0eXBlOiAnY29tbWFuZCcgYXMgY29uc3QsXG4gICAgICBpY29uOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTYgdy02IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLW1kIGJvcmRlci1bMC41cHhdIGJvcmRlci1kaXZpZGVyLXJlZ3VsYXIgYmctY29tcG9uZW50cy1wYW5lbC1iZ1wiPlxuICAgICAgICAgIDxSaUJvb2tPcGVuTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSxcbiAgICAgIGRhdGE6IHsgY29tbWFuZDogJ25hdmlnYXRpb24uZG9jJywgYXJnczoge30gfSxcbiAgICB9XVxuICB9LFxuXG4gIHJlZ2lzdGVyKF9kZXBzOiBEb2NEZXBzKSB7XG4gICAgY29uc3QgaTE4biA9IGdldEkxOG4oKVxuICAgIHJlZ2lzdGVyQ29tbWFuZHMoe1xuICAgICAgJ25hdmlnYXRpb24uZG9jJzogYXN5bmMgKF9hcmdzKSA9PiB7XG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBsYW5ndWFnZSBmcm9tIGkxOG5cbiAgICAgICAgY29uc3QgY3VycmVudExvY2FsZSA9IGkxOG4ubGFuZ3VhZ2VcbiAgICAgICAgY29uc3QgZG9jTGFuZ3VhZ2UgPSBnZXREb2NMYW5ndWFnZShjdXJyZW50TG9jYWxlKVxuICAgICAgICBjb25zdCB1cmwgPSBgJHtkZWZhdWx0RG9jQmFzZVVybH0vJHtkb2NMYW5ndWFnZX1gXG4gICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICdub29wZW5lcixub3JlZmVycmVyJylcbiAgICAgIH0sXG4gICAgfSlcbiAgfSxcblxuICB1bnJlZ2lzdGVyKCkge1xuICAgIHVucmVnaXN0ZXJDb21tYW5kcyhbJ25hdmlnYXRpb24uZG9jJ10pXG4gIH0sXG59XG4iXX0=