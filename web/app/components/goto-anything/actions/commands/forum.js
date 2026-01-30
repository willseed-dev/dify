"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forumCommand = void 0;
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const command_bus_1 = require("./command-bus");
/**
 * Forum command - Opens Dify community forum
 */
exports.forumCommand = {
    name: 'forum',
    description: 'Open Dify community forum',
    mode: 'direct',
    // Direct execution function
    execute: () => {
        const url = 'https://forum.dify.ai';
        window.open(url, '_blank', 'noopener,noreferrer');
    },
    async search(args, locale = 'en') {
        const i18n = (0, react_i18next_1.getI18n)();
        return [{
                id: 'forum',
                title: i18n.t('userProfile.forum', { ns: 'common', lng: locale }),
                description: i18n.t('gotoAnything.actions.feedbackDesc', { ns: 'app', lng: locale }) || 'Open community feedback discussions',
                type: 'command',
                icon: (<div className="flex h-6 w-6 items-center justify-center rounded-md border-[0.5px] border-divider-regular bg-components-panel-bg">
          <react_1.RiFeedbackLine className="h-4 w-4 text-text-tertiary"/>
        </div>),
                data: { command: 'navigation.forum', args: { url: 'https://forum.dify.ai' } },
            }];
    },
    register(_deps) {
        (0, command_bus_1.registerCommands)({
            'navigation.forum': async (args) => {
                const url = args?.url || 'https://forum.dify.ai';
                window.open(url, '_blank', 'noopener,noreferrer');
            },
        });
    },
    unregister() {
        (0, command_bus_1.unregisterCommands)(['navigation.forum']);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ydW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3J1bS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNENBQWlEO0FBQ2pELCtCQUE4QjtBQUM5QixpREFBdUM7QUFDdkMsK0NBQW9FO0FBS3BFOztHQUVHO0FBQ1UsUUFBQSxZQUFZLEdBQW1DO0lBQzFELElBQUksRUFBRSxPQUFPO0lBQ2IsV0FBVyxFQUFFLDJCQUEyQjtJQUN4QyxJQUFJLEVBQUUsUUFBUTtJQUVkLDRCQUE0QjtJQUM1QixPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ1osTUFBTSxHQUFHLEdBQUcsdUJBQXVCLENBQUE7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBWSxFQUFFLFNBQWlCLElBQUk7UUFDOUMsTUFBTSxJQUFJLEdBQUcsSUFBQSx1QkFBTyxHQUFFLENBQUE7UUFDdEIsT0FBTyxDQUFDO2dCQUNOLEVBQUUsRUFBRSxPQUFPO2dCQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUM7Z0JBQ2pFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLG1DQUFtQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxxQ0FBcUM7Z0JBQzdILElBQUksRUFBRSxTQUFrQjtnQkFDeEIsSUFBSSxFQUFFLENBQ0osQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtIQUFrSCxDQUMvSDtVQUFBLENBQUMsc0JBQWMsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLEVBQ3hEO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtnQkFDRCxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLEVBQUU7YUFDOUUsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFnQjtRQUN2QixJQUFBLDhCQUFnQixFQUFDO1lBQ2Ysa0JBQWtCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUNqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLHVCQUF1QixDQUFBO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUscUJBQXFCLENBQUMsQ0FBQTtZQUNuRCxDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELFVBQVU7UUFDUixJQUFBLGdDQUFrQixFQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO0lBQzFDLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTbGFzaENvbW1hbmRIYW5kbGVyIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IFJpRmVlZGJhY2tMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZ2V0STE4biB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzLCB1bnJlZ2lzdGVyQ29tbWFuZHMgfSBmcm9tICcuL2NvbW1hbmQtYnVzJ1xuXG4vLyBGb3J1bSBjb21tYW5kIGRlcGVuZGVuY3kgdHlwZXNcbnR5cGUgRm9ydW1EZXBzID0gUmVjb3JkPHN0cmluZywgbmV2ZXI+XG5cbi8qKlxuICogRm9ydW0gY29tbWFuZCAtIE9wZW5zIERpZnkgY29tbXVuaXR5IGZvcnVtXG4gKi9cbmV4cG9ydCBjb25zdCBmb3J1bUNvbW1hbmQ6IFNsYXNoQ29tbWFuZEhhbmRsZXI8Rm9ydW1EZXBzPiA9IHtcbiAgbmFtZTogJ2ZvcnVtJyxcbiAgZGVzY3JpcHRpb246ICdPcGVuIERpZnkgY29tbXVuaXR5IGZvcnVtJyxcbiAgbW9kZTogJ2RpcmVjdCcsXG5cbiAgLy8gRGlyZWN0IGV4ZWN1dGlvbiBmdW5jdGlvblxuICBleGVjdXRlOiAoKSA9PiB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZm9ydW0uZGlmeS5haSdcbiAgICB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnbm9vcGVuZXIsbm9yZWZlcnJlcicpXG4gIH0sXG5cbiAgYXN5bmMgc2VhcmNoKGFyZ3M6IHN0cmluZywgbG9jYWxlOiBzdHJpbmcgPSAnZW4nKSB7XG4gICAgY29uc3QgaTE4biA9IGdldEkxOG4oKVxuICAgIHJldHVybiBbe1xuICAgICAgaWQ6ICdmb3J1bScsXG4gICAgICB0aXRsZTogaTE4bi50KCd1c2VyUHJvZmlsZS5mb3J1bScsIHsgbnM6ICdjb21tb24nLCBsbmc6IGxvY2FsZSB9KSxcbiAgICAgIGRlc2NyaXB0aW9uOiBpMThuLnQoJ2dvdG9Bbnl0aGluZy5hY3Rpb25zLmZlZWRiYWNrRGVzYycsIHsgbnM6ICdhcHAnLCBsbmc6IGxvY2FsZSB9KSB8fCAnT3BlbiBjb21tdW5pdHkgZmVlZGJhY2sgZGlzY3Vzc2lvbnMnLFxuICAgICAgdHlwZTogJ2NvbW1hbmQnIGFzIGNvbnN0LFxuICAgICAgaWNvbjogKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC02IHctNiBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1tZCBib3JkZXItWzAuNXB4XSBib3JkZXItZGl2aWRlci1yZWd1bGFyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmdcIj5cbiAgICAgICAgICA8UmlGZWVkYmFja0xpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICksXG4gICAgICBkYXRhOiB7IGNvbW1hbmQ6ICduYXZpZ2F0aW9uLmZvcnVtJywgYXJnczogeyB1cmw6ICdodHRwczovL2ZvcnVtLmRpZnkuYWknIH0gfSxcbiAgICB9XVxuICB9LFxuXG4gIHJlZ2lzdGVyKF9kZXBzOiBGb3J1bURlcHMpIHtcbiAgICByZWdpc3RlckNvbW1hbmRzKHtcbiAgICAgICduYXZpZ2F0aW9uLmZvcnVtJzogYXN5bmMgKGFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gYXJncz8udXJsIHx8ICdodHRwczovL2ZvcnVtLmRpZnkuYWknXG4gICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICdub29wZW5lcixub3JlZmVycmVyJylcbiAgICAgIH0sXG4gICAgfSlcbiAgfSxcblxuICB1bnJlZ2lzdGVyKCkge1xuICAgIHVucmVnaXN0ZXJDb21tYW5kcyhbJ25hdmlnYXRpb24uZm9ydW0nXSlcbiAgfSxcbn1cbiJdfQ==