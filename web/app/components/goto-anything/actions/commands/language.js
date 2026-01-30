"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageCommand = void 0;
const react_i18next_1 = require("react-i18next");
const language_1 = require("@/i18n-config/language");
const command_bus_1 = require("./command-bus");
const buildLanguageCommands = (query) => {
    const q = query.toLowerCase();
    const list = language_1.languages.filter(item => item.supported && (!q || item.name.toLowerCase().includes(q) || String(item.value).toLowerCase().includes(q)));
    const i18n = (0, react_i18next_1.getI18n)();
    return list.map(item => ({
        id: `lang-${item.value}`,
        title: item.name,
        description: i18n.t('gotoAnything.actions.languageChangeDesc', { ns: 'app' }),
        type: 'command',
        data: { command: 'i18n.set', args: { locale: item.value } },
    }));
};
/**
 * Language command handler
 * Integrates UI building, search, and registration logic
 */
exports.languageCommand = {
    name: 'language',
    aliases: ['lang'],
    description: 'Switch between different languages',
    mode: 'submenu', // Explicitly set submenu mode
    async search(args, _locale = 'en') {
        // Return language options directly, regardless of parameters
        return buildLanguageCommands(args);
    },
    register(deps) {
        (0, command_bus_1.registerCommands)({
            'i18n.set': async (args) => {
                const locale = args?.locale;
                if (locale)
                    await deps.setLocale?.(locale);
            },
        });
    },
    unregister() {
        (0, command_bus_1.unregisterCommands)(['i18n.set']);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW5ndWFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsaURBQXVDO0FBQ3ZDLHFEQUFrRDtBQUNsRCwrQ0FBb0U7QUFPcEUsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLEtBQWEsRUFBeUIsRUFBRTtJQUNyRSxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDN0IsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQ3RELENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUMxRixDQUFDLENBQUE7SUFDRixNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFPLEdBQUUsQ0FBQTtJQUN0QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLEVBQUUsRUFBRSxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2hCLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLHlDQUF5QyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQzdFLElBQUksRUFBRSxTQUFrQjtRQUN4QixJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUU7S0FDNUQsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDLENBQUE7QUFFRDs7O0dBR0c7QUFDVSxRQUFBLGVBQWUsR0FBc0M7SUFDaEUsSUFBSSxFQUFFLFVBQVU7SUFDaEIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ2pCLFdBQVcsRUFBRSxvQ0FBb0M7SUFDakQsSUFBSSxFQUFFLFNBQVMsRUFBRSw4QkFBOEI7SUFFL0MsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFZLEVBQUUsVUFBa0IsSUFBSTtRQUMvQyw2REFBNkQ7UUFDN0QsT0FBTyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQWtCO1FBQ3pCLElBQUEsOEJBQWdCLEVBQUM7WUFDZixVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUN6QixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsTUFBTSxDQUFBO2dCQUMzQixJQUFJLE1BQU07b0JBQ1IsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDbEMsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBQSxnQ0FBa0IsRUFBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7SUFDbEMsQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbW1hbmRTZWFyY2hSZXN1bHQgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgU2xhc2hDb21tYW5kSGFuZGxlciB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBnZXRJMThuIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IGxhbmd1YWdlcyB9IGZyb20gJ0AvaTE4bi1jb25maWcvbGFuZ3VhZ2UnXG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzLCB1bnJlZ2lzdGVyQ29tbWFuZHMgfSBmcm9tICcuL2NvbW1hbmQtYnVzJ1xuXG4vLyBMYW5ndWFnZSBkZXBlbmRlbmN5IHR5cGVzXG50eXBlIExhbmd1YWdlRGVwcyA9IHtcbiAgc2V0TG9jYWxlPzogKGxvY2FsZTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+XG59XG5cbmNvbnN0IGJ1aWxkTGFuZ3VhZ2VDb21tYW5kcyA9IChxdWVyeTogc3RyaW5nKTogQ29tbWFuZFNlYXJjaFJlc3VsdFtdID0+IHtcbiAgY29uc3QgcSA9IHF1ZXJ5LnRvTG93ZXJDYXNlKClcbiAgY29uc3QgbGlzdCA9IGxhbmd1YWdlcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnN1cHBvcnRlZCAmJiAoXG4gICAgIXEgfHwgaXRlbS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSkgfHwgU3RyaW5nKGl0ZW0udmFsdWUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSlcbiAgKSlcbiAgY29uc3QgaTE4biA9IGdldEkxOG4oKVxuICByZXR1cm4gbGlzdC5tYXAoaXRlbSA9PiAoe1xuICAgIGlkOiBgbGFuZy0ke2l0ZW0udmFsdWV9YCxcbiAgICB0aXRsZTogaXRlbS5uYW1lLFxuICAgIGRlc2NyaXB0aW9uOiBpMThuLnQoJ2dvdG9Bbnl0aGluZy5hY3Rpb25zLmxhbmd1YWdlQ2hhbmdlRGVzYycsIHsgbnM6ICdhcHAnIH0pLFxuICAgIHR5cGU6ICdjb21tYW5kJyBhcyBjb25zdCxcbiAgICBkYXRhOiB7IGNvbW1hbmQ6ICdpMThuLnNldCcsIGFyZ3M6IHsgbG9jYWxlOiBpdGVtLnZhbHVlIH0gfSxcbiAgfSkpXG59XG5cbi8qKlxuICogTGFuZ3VhZ2UgY29tbWFuZCBoYW5kbGVyXG4gKiBJbnRlZ3JhdGVzIFVJIGJ1aWxkaW5nLCBzZWFyY2gsIGFuZCByZWdpc3RyYXRpb24gbG9naWNcbiAqL1xuZXhwb3J0IGNvbnN0IGxhbmd1YWdlQ29tbWFuZDogU2xhc2hDb21tYW5kSGFuZGxlcjxMYW5ndWFnZURlcHM+ID0ge1xuICBuYW1lOiAnbGFuZ3VhZ2UnLFxuICBhbGlhc2VzOiBbJ2xhbmcnXSxcbiAgZGVzY3JpcHRpb246ICdTd2l0Y2ggYmV0d2VlbiBkaWZmZXJlbnQgbGFuZ3VhZ2VzJyxcbiAgbW9kZTogJ3N1Ym1lbnUnLCAvLyBFeHBsaWNpdGx5IHNldCBzdWJtZW51IG1vZGVcblxuICBhc3luYyBzZWFyY2goYXJnczogc3RyaW5nLCBfbG9jYWxlOiBzdHJpbmcgPSAnZW4nKSB7XG4gICAgLy8gUmV0dXJuIGxhbmd1YWdlIG9wdGlvbnMgZGlyZWN0bHksIHJlZ2FyZGxlc3Mgb2YgcGFyYW1ldGVyc1xuICAgIHJldHVybiBidWlsZExhbmd1YWdlQ29tbWFuZHMoYXJncylcbiAgfSxcblxuICByZWdpc3RlcihkZXBzOiBMYW5ndWFnZURlcHMpIHtcbiAgICByZWdpc3RlckNvbW1hbmRzKHtcbiAgICAgICdpMThuLnNldCc6IGFzeW5jIChhcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IGFyZ3M/LmxvY2FsZVxuICAgICAgICBpZiAobG9jYWxlKVxuICAgICAgICAgIGF3YWl0IGRlcHMuc2V0TG9jYWxlPy4obG9jYWxlKVxuICAgICAgfSxcbiAgICB9KVxuICB9LFxuXG4gIHVucmVnaXN0ZXIoKSB7XG4gICAgdW5yZWdpc3RlckNvbW1hbmRzKFsnaTE4bi5zZXQnXSlcbiAgfSxcbn1cbiJdfQ==