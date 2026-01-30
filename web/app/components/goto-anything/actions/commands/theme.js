"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeCommand = void 0;
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const command_bus_1 = require("./command-bus");
const THEME_ITEMS = [
    {
        id: 'system',
        titleKey: 'gotoAnything.actions.themeSystem',
        descKey: 'gotoAnything.actions.themeSystemDesc',
        icon: <react_1.RiComputerLine className="h-4 w-4 text-text-tertiary"/>,
    },
    {
        id: 'light',
        titleKey: 'gotoAnything.actions.themeLight',
        descKey: 'gotoAnything.actions.themeLightDesc',
        icon: <react_1.RiSunLine className="h-4 w-4 text-text-tertiary"/>,
    },
    {
        id: 'dark',
        titleKey: 'gotoAnything.actions.themeDark',
        descKey: 'gotoAnything.actions.themeDarkDesc',
        icon: <react_1.RiMoonLine className="h-4 w-4 text-text-tertiary"/>,
    },
];
const buildThemeCommands = (query, locale) => {
    const i18n = (0, react_i18next_1.getI18n)();
    const q = query.toLowerCase();
    const list = THEME_ITEMS.filter(item => !q
        || i18n.t(item.titleKey, { ns: 'app', lng: locale }).toLowerCase().includes(q)
        || item.id.includes(q));
    return list.map(item => ({
        id: item.id,
        title: i18n.t(item.titleKey, { ns: 'app', lng: locale }),
        description: i18n.t(item.descKey, { ns: 'app', lng: locale }),
        type: 'command',
        icon: (<div className="flex h-6 w-6 items-center justify-center rounded-md border-[0.5px] border-divider-regular bg-components-panel-bg">
        {item.icon}
      </div>),
        data: { command: 'theme.set', args: { value: item.id } },
    }));
};
/**
 * Theme command handler
 * Integrates UI building, search, and registration logic
 */
exports.themeCommand = {
    name: 'theme',
    description: 'Switch between light and dark themes',
    mode: 'submenu', // Explicitly set submenu mode
    async search(args, locale = 'en') {
        // Return theme options directly, regardless of parameters
        return buildThemeCommands(args, locale);
    },
    register(deps) {
        (0, command_bus_1.registerCommands)({
            'theme.set': async (args) => {
                deps.setTheme?.(args?.value);
            },
        });
    },
    unregister() {
        (0, command_bus_1.unregisterCommands)(['theme.set']);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aGVtZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsNENBQXdFO0FBQ3hFLCtCQUE4QjtBQUM5QixpREFBdUM7QUFDdkMsK0NBQW9FO0FBT3BFLE1BQU0sV0FBVyxHQUFHO0lBQ2xCO1FBQ0UsRUFBRSxFQUFFLFFBQVE7UUFDWixRQUFRLEVBQUUsa0NBQWtDO1FBQzVDLE9BQU8sRUFBRSxzQ0FBc0M7UUFDL0MsSUFBSSxFQUFFLENBQUMsc0JBQWMsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLEVBQUc7S0FDaEU7SUFDRDtRQUNFLEVBQUUsRUFBRSxPQUFPO1FBQ1gsUUFBUSxFQUFFLGlDQUFpQztRQUMzQyxPQUFPLEVBQUUscUNBQXFDO1FBQzlDLElBQUksRUFBRSxDQUFDLGlCQUFTLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUFHO0tBQzNEO0lBQ0Q7UUFDRSxFQUFFLEVBQUUsTUFBTTtRQUNWLFFBQVEsRUFBRSxnQ0FBZ0M7UUFDMUMsT0FBTyxFQUFFLG9DQUFvQztRQUM3QyxJQUFJLEVBQUUsQ0FBQyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFBRztLQUM1RDtDQUNPLENBQUE7QUFFVixNQUFNLGtCQUFrQixHQUFHLENBQUMsS0FBYSxFQUFFLE1BQWUsRUFBeUIsRUFBRTtJQUNuRixNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFPLEdBQUUsQ0FBQTtJQUN0QixNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDN0IsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNyQyxDQUFDLENBQUM7V0FDQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7V0FDM0UsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQ3ZCLENBQUE7SUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtRQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUN4RCxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDN0QsSUFBSSxFQUFFLFNBQWtCO1FBQ3hCLElBQUksRUFBRSxDQUNKLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrSEFBa0gsQ0FDL0g7UUFBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ1o7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO1FBQ0QsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO0tBQ3pELENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyxDQUFBO0FBRUQ7OztHQUdHO0FBQ1UsUUFBQSxZQUFZLEdBQW1DO0lBQzFELElBQUksRUFBRSxPQUFPO0lBQ2IsV0FBVyxFQUFFLHNDQUFzQztJQUNuRCxJQUFJLEVBQUUsU0FBUyxFQUFFLDhCQUE4QjtJQUUvQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQVksRUFBRSxTQUFpQixJQUFJO1FBQzlDLDBEQUEwRDtRQUMxRCxPQUFPLGtCQUFrQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQWU7UUFDdEIsSUFBQSw4QkFBZ0IsRUFBQztZQUNmLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDOUIsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBQSxnQ0FBa0IsRUFBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7SUFDbkMsQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbW1hbmRTZWFyY2hSZXN1bHQgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgU2xhc2hDb21tYW5kSGFuZGxlciB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBSaUNvbXB1dGVyTGluZSwgUmlNb29uTGluZSwgUmlTdW5MaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZ2V0STE4biB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzLCB1bnJlZ2lzdGVyQ29tbWFuZHMgfSBmcm9tICcuL2NvbW1hbmQtYnVzJ1xuXG4vLyBUaGVtZSBkZXBlbmRlbmN5IHR5cGVzXG50eXBlIFRoZW1lRGVwcyA9IHtcbiAgc2V0VGhlbWU/OiAodmFsdWU6ICdsaWdodCcgfCAnZGFyaycgfCAnc3lzdGVtJykgPT4gdm9pZFxufVxuXG5jb25zdCBUSEVNRV9JVEVNUyA9IFtcbiAge1xuICAgIGlkOiAnc3lzdGVtJyxcbiAgICB0aXRsZUtleTogJ2dvdG9Bbnl0aGluZy5hY3Rpb25zLnRoZW1lU3lzdGVtJyxcbiAgICBkZXNjS2V5OiAnZ290b0FueXRoaW5nLmFjdGlvbnMudGhlbWVTeXN0ZW1EZXNjJyxcbiAgICBpY29uOiA8UmlDb21wdXRlckxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPixcbiAgfSxcbiAge1xuICAgIGlkOiAnbGlnaHQnLFxuICAgIHRpdGxlS2V5OiAnZ290b0FueXRoaW5nLmFjdGlvbnMudGhlbWVMaWdodCcsXG4gICAgZGVzY0tleTogJ2dvdG9Bbnl0aGluZy5hY3Rpb25zLnRoZW1lTGlnaHREZXNjJyxcbiAgICBpY29uOiA8UmlTdW5MaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz4sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RhcmsnLFxuICAgIHRpdGxlS2V5OiAnZ290b0FueXRoaW5nLmFjdGlvbnMudGhlbWVEYXJrJyxcbiAgICBkZXNjS2V5OiAnZ290b0FueXRoaW5nLmFjdGlvbnMudGhlbWVEYXJrRGVzYycsXG4gICAgaWNvbjogPFJpTW9vbkxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPixcbiAgfSxcbl0gYXMgY29uc3RcblxuY29uc3QgYnVpbGRUaGVtZUNvbW1hbmRzID0gKHF1ZXJ5OiBzdHJpbmcsIGxvY2FsZT86IHN0cmluZyk6IENvbW1hbmRTZWFyY2hSZXN1bHRbXSA9PiB7XG4gIGNvbnN0IGkxOG4gPSBnZXRJMThuKClcbiAgY29uc3QgcSA9IHF1ZXJ5LnRvTG93ZXJDYXNlKClcbiAgY29uc3QgbGlzdCA9IFRIRU1FX0lURU1TLmZpbHRlcihpdGVtID0+XG4gICAgIXFcbiAgICB8fCBpMThuLnQoaXRlbS50aXRsZUtleSwgeyBuczogJ2FwcCcsIGxuZzogbG9jYWxlIH0pLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSlcbiAgICB8fCBpdGVtLmlkLmluY2x1ZGVzKHEpLFxuICApXG4gIHJldHVybiBsaXN0Lm1hcChpdGVtID0+ICh7XG4gICAgaWQ6IGl0ZW0uaWQsXG4gICAgdGl0bGU6IGkxOG4udChpdGVtLnRpdGxlS2V5LCB7IG5zOiAnYXBwJywgbG5nOiBsb2NhbGUgfSksXG4gICAgZGVzY3JpcHRpb246IGkxOG4udChpdGVtLmRlc2NLZXksIHsgbnM6ICdhcHAnLCBsbmc6IGxvY2FsZSB9KSxcbiAgICB0eXBlOiAnY29tbWFuZCcgYXMgY29uc3QsXG4gICAgaWNvbjogKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtNiB3LTYgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbWQgYm9yZGVyLVswLjVweF0gYm9yZGVyLWRpdmlkZXItcmVndWxhciBiZy1jb21wb25lbnRzLXBhbmVsLWJnXCI+XG4gICAgICAgIHtpdGVtLmljb259XG4gICAgICA8L2Rpdj5cbiAgICApLFxuICAgIGRhdGE6IHsgY29tbWFuZDogJ3RoZW1lLnNldCcsIGFyZ3M6IHsgdmFsdWU6IGl0ZW0uaWQgfSB9LFxuICB9KSlcbn1cblxuLyoqXG4gKiBUaGVtZSBjb21tYW5kIGhhbmRsZXJcbiAqIEludGVncmF0ZXMgVUkgYnVpbGRpbmcsIHNlYXJjaCwgYW5kIHJlZ2lzdHJhdGlvbiBsb2dpY1xuICovXG5leHBvcnQgY29uc3QgdGhlbWVDb21tYW5kOiBTbGFzaENvbW1hbmRIYW5kbGVyPFRoZW1lRGVwcz4gPSB7XG4gIG5hbWU6ICd0aGVtZScsXG4gIGRlc2NyaXB0aW9uOiAnU3dpdGNoIGJldHdlZW4gbGlnaHQgYW5kIGRhcmsgdGhlbWVzJyxcbiAgbW9kZTogJ3N1Ym1lbnUnLCAvLyBFeHBsaWNpdGx5IHNldCBzdWJtZW51IG1vZGVcblxuICBhc3luYyBzZWFyY2goYXJnczogc3RyaW5nLCBsb2NhbGU6IHN0cmluZyA9ICdlbicpIHtcbiAgICAvLyBSZXR1cm4gdGhlbWUgb3B0aW9ucyBkaXJlY3RseSwgcmVnYXJkbGVzcyBvZiBwYXJhbWV0ZXJzXG4gICAgcmV0dXJuIGJ1aWxkVGhlbWVDb21tYW5kcyhhcmdzLCBsb2NhbGUpXG4gIH0sXG5cbiAgcmVnaXN0ZXIoZGVwczogVGhlbWVEZXBzKSB7XG4gICAgcmVnaXN0ZXJDb21tYW5kcyh7XG4gICAgICAndGhlbWUuc2V0JzogYXN5bmMgKGFyZ3MpID0+IHtcbiAgICAgICAgZGVwcy5zZXRUaGVtZT8uKGFyZ3M/LnZhbHVlKVxuICAgICAgfSxcbiAgICB9KVxuICB9LFxuXG4gIHVucmVnaXN0ZXIoKSB7XG4gICAgdW5yZWdpc3RlckNvbW1hbmRzKFsndGhlbWUuc2V0J10pXG4gIH0sXG59XG4iXX0=