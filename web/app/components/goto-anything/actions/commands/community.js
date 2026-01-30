"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityCommand = void 0;
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const command_bus_1 = require("./command-bus");
/**
 * Community command - Opens Discord community
 */
exports.communityCommand = {
    name: 'community',
    description: 'Open community Discord',
    mode: 'direct',
    // Direct execution function
    execute: () => {
        const url = 'https://discord.gg/5AEfbxcd9k';
        window.open(url, '_blank', 'noopener,noreferrer');
    },
    async search(args, locale = 'en') {
        const i18n = (0, react_i18next_1.getI18n)();
        return [{
                id: 'community',
                title: i18n.t('userProfile.community', { ns: 'common', lng: locale }),
                description: i18n.t('gotoAnything.actions.communityDesc', { ns: 'app', lng: locale }) || 'Open Discord community',
                type: 'command',
                icon: (<div className="flex h-6 w-6 items-center justify-center rounded-md border-[0.5px] border-divider-regular bg-components-panel-bg">
          <react_1.RiDiscordLine className="h-4 w-4 text-text-tertiary"/>
        </div>),
                data: { command: 'navigation.community', args: { url: 'https://discord.gg/5AEfbxcd9k' } },
            }];
    },
    register(_deps) {
        (0, command_bus_1.registerCommands)({
            'navigation.community': async (args) => {
                const url = args?.url || 'https://discord.gg/5AEfbxcd9k';
                window.open(url, '_blank', 'noopener,noreferrer');
            },
        });
    },
    unregister() {
        (0, command_bus_1.unregisterCommands)(['navigation.community']);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbXVuaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbXVuaXR5LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw0Q0FBZ0Q7QUFDaEQsK0JBQThCO0FBQzlCLGlEQUF1QztBQUN2QywrQ0FBb0U7QUFLcEU7O0dBRUc7QUFDVSxRQUFBLGdCQUFnQixHQUF1QztJQUNsRSxJQUFJLEVBQUUsV0FBVztJQUNqQixXQUFXLEVBQUUsd0JBQXdCO0lBQ3JDLElBQUksRUFBRSxRQUFRO0lBRWQsNEJBQTRCO0lBQzVCLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDWixNQUFNLEdBQUcsR0FBRywrQkFBK0IsQ0FBQTtRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUscUJBQXFCLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFZLEVBQUUsU0FBaUIsSUFBSTtRQUM5QyxNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFPLEdBQUUsQ0FBQTtRQUN0QixPQUFPLENBQUM7Z0JBQ04sRUFBRSxFQUFFLFdBQVc7Z0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFDckUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsb0NBQW9DLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLHdCQUF3QjtnQkFDakgsSUFBSSxFQUFFLFNBQWtCO2dCQUN4QixJQUFJLEVBQUUsQ0FDSixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0hBQWtILENBQy9IO1VBQUEsQ0FBQyxxQkFBYSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFDdkQ7UUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO2dCQUNELElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsK0JBQStCLEVBQUUsRUFBRTthQUMxRixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQW9CO1FBQzNCLElBQUEsOEJBQWdCLEVBQUM7WUFDZixzQkFBc0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ3JDLE1BQU0sR0FBRyxHQUFHLElBQUksRUFBRSxHQUFHLElBQUksK0JBQStCLENBQUE7Z0JBQ3hELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFBO1lBQ25ELENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUEsZ0NBQWtCLEVBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUE7SUFDOUMsQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNsYXNoQ29tbWFuZEhhbmRsZXIgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgUmlEaXNjb3JkTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGdldEkxOG4gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgcmVnaXN0ZXJDb21tYW5kcywgdW5yZWdpc3RlckNvbW1hbmRzIH0gZnJvbSAnLi9jb21tYW5kLWJ1cydcblxuLy8gQ29tbXVuaXR5IGNvbW1hbmQgZGVwZW5kZW5jeSB0eXBlc1xudHlwZSBDb21tdW5pdHlEZXBzID0gUmVjb3JkPHN0cmluZywgbmV2ZXI+XG5cbi8qKlxuICogQ29tbXVuaXR5IGNvbW1hbmQgLSBPcGVucyBEaXNjb3JkIGNvbW11bml0eVxuICovXG5leHBvcnQgY29uc3QgY29tbXVuaXR5Q29tbWFuZDogU2xhc2hDb21tYW5kSGFuZGxlcjxDb21tdW5pdHlEZXBzPiA9IHtcbiAgbmFtZTogJ2NvbW11bml0eScsXG4gIGRlc2NyaXB0aW9uOiAnT3BlbiBjb21tdW5pdHkgRGlzY29yZCcsXG4gIG1vZGU6ICdkaXJlY3QnLFxuXG4gIC8vIERpcmVjdCBleGVjdXRpb24gZnVuY3Rpb25cbiAgZXhlY3V0ZTogKCkgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2Rpc2NvcmQuZ2cvNUFFZmJ4Y2Q5aydcbiAgICB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnbm9vcGVuZXIsbm9yZWZlcnJlcicpXG4gIH0sXG5cbiAgYXN5bmMgc2VhcmNoKGFyZ3M6IHN0cmluZywgbG9jYWxlOiBzdHJpbmcgPSAnZW4nKSB7XG4gICAgY29uc3QgaTE4biA9IGdldEkxOG4oKVxuICAgIHJldHVybiBbe1xuICAgICAgaWQ6ICdjb21tdW5pdHknLFxuICAgICAgdGl0bGU6IGkxOG4udCgndXNlclByb2ZpbGUuY29tbXVuaXR5JywgeyBuczogJ2NvbW1vbicsIGxuZzogbG9jYWxlIH0pLFxuICAgICAgZGVzY3JpcHRpb246IGkxOG4udCgnZ290b0FueXRoaW5nLmFjdGlvbnMuY29tbXVuaXR5RGVzYycsIHsgbnM6ICdhcHAnLCBsbmc6IGxvY2FsZSB9KSB8fCAnT3BlbiBEaXNjb3JkIGNvbW11bml0eScsXG4gICAgICB0eXBlOiAnY29tbWFuZCcgYXMgY29uc3QsXG4gICAgICBpY29uOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTYgdy02IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLW1kIGJvcmRlci1bMC41cHhdIGJvcmRlci1kaXZpZGVyLXJlZ3VsYXIgYmctY29tcG9uZW50cy1wYW5lbC1iZ1wiPlxuICAgICAgICAgIDxSaURpc2NvcmRMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApLFxuICAgICAgZGF0YTogeyBjb21tYW5kOiAnbmF2aWdhdGlvbi5jb21tdW5pdHknLCBhcmdzOiB7IHVybDogJ2h0dHBzOi8vZGlzY29yZC5nZy81QUVmYnhjZDlrJyB9IH0sXG4gICAgfV1cbiAgfSxcblxuICByZWdpc3RlcihfZGVwczogQ29tbXVuaXR5RGVwcykge1xuICAgIHJlZ2lzdGVyQ29tbWFuZHMoe1xuICAgICAgJ25hdmlnYXRpb24uY29tbXVuaXR5JzogYXN5bmMgKGFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gYXJncz8udXJsIHx8ICdodHRwczovL2Rpc2NvcmQuZ2cvNUFFZmJ4Y2Q5aydcbiAgICAgICAgd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgJ25vb3BlbmVyLG5vcmVmZXJyZXInKVxuICAgICAgfSxcbiAgICB9KVxuICB9LFxuXG4gIHVucmVnaXN0ZXIoKSB7XG4gICAgdW5yZWdpc3RlckNvbW1hbmRzKFsnbmF2aWdhdGlvbi5jb21tdW5pdHknXSlcbiAgfSxcbn1cbiJdfQ==