"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appAction = void 0;
const apps_1 = require("@/service/apps");
const app_redirection_1 = require("@/utils/app-redirection");
const type_selector_1 = require("../../app/type-selector");
const app_icon_1 = require("../../base/app-icon");
const parser = (apps) => {
    return apps.map(app => ({
        id: app.id,
        title: app.name,
        description: app.description,
        type: 'app',
        path: (0, app_redirection_1.getRedirectionPath)(true, {
            id: app.id,
            mode: app.mode,
        }),
        icon: (<div className="relative shrink-0">
        <app_icon_1.default size="large" iconType={app.icon_type} icon={app.icon} background={app.icon_background} imageUrl={app.icon_url}/>
        <type_selector_1.AppTypeIcon wrapperClassName="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-[4px] border border-divider-regular outline outline-components-panel-on-panel-item-bg" className="h-3 w-3" type={app.mode}/>
      </div>),
        data: app,
    }));
};
exports.appAction = {
    key: '@app',
    shortcut: '@app',
    title: 'Search Applications',
    description: 'Search and navigate to your applications',
    // action,
    search: async (_, searchTerm = '', _locale) => {
        try {
            const response = await (0, apps_1.fetchAppList)({
                url: 'apps',
                params: {
                    page: 1,
                    name: searchTerm,
                },
            });
            const apps = response?.data || [];
            return parser(apps);
        }
        catch (error) {
            console.warn('App search failed:', error);
            return [];
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSx5Q0FBNkM7QUFDN0MsNkRBQTREO0FBQzVELDJEQUFxRDtBQUNyRCxrREFBeUM7QUFFekMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFXLEVBQXFCLEVBQUU7SUFDaEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7UUFDVixLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUk7UUFDZixXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVc7UUFDNUIsSUFBSSxFQUFFLEtBQWM7UUFDcEIsSUFBSSxFQUFFLElBQUEsb0NBQWtCLEVBQUMsSUFBSSxFQUFFO1lBQzdCLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNWLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtTQUNmLENBQUM7UUFDRixJQUFJLEVBQUUsQ0FDSixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQ2hDO1FBQUEsQ0FBQyxrQkFBTyxDQUNOLElBQUksQ0FBQyxPQUFPLENBQ1osUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUN4QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQ2YsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUNoQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBRXpCO1FBQUEsQ0FBQywyQkFBVyxDQUNWLGdCQUFnQixDQUFDLHVJQUF1SSxDQUN4SixTQUFTLENBQUMsU0FBUyxDQUNuQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBRW5CO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtRQUNELElBQUksRUFBRSxHQUFHO0tBQ1YsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDLENBQUE7QUFFWSxRQUFBLFNBQVMsR0FBZTtJQUNuQyxHQUFHLEVBQUUsTUFBTTtJQUNYLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLEtBQUssRUFBRSxxQkFBcUI7SUFDNUIsV0FBVyxFQUFFLDBDQUEwQztJQUN2RCxVQUFVO0lBQ1YsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUM1QyxJQUFJLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsbUJBQVksRUFBQztnQkFDbEMsR0FBRyxFQUFFLE1BQU07Z0JBQ1gsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxDQUFDO29CQUNQLElBQUksRUFBRSxVQUFVO2lCQUNqQjthQUNGLENBQUMsQ0FBQTtZQUNGLE1BQU0sSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFBO1lBQ2pDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JCLENBQUM7UUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN6QyxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7SUFDSCxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQWN0aW9uSXRlbSwgQXBwU2VhcmNoUmVzdWx0IH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBmZXRjaEFwcExpc3QgfSBmcm9tICdAL3NlcnZpY2UvYXBwcydcbmltcG9ydCB7IGdldFJlZGlyZWN0aW9uUGF0aCB9IGZyb20gJ0AvdXRpbHMvYXBwLXJlZGlyZWN0aW9uJ1xuaW1wb3J0IHsgQXBwVHlwZUljb24gfSBmcm9tICcuLi8uLi9hcHAvdHlwZS1zZWxlY3RvcidcbmltcG9ydCBBcHBJY29uIGZyb20gJy4uLy4uL2Jhc2UvYXBwLWljb24nXG5cbmNvbnN0IHBhcnNlciA9IChhcHBzOiBBcHBbXSk6IEFwcFNlYXJjaFJlc3VsdFtdID0+IHtcbiAgcmV0dXJuIGFwcHMubWFwKGFwcCA9PiAoe1xuICAgIGlkOiBhcHAuaWQsXG4gICAgdGl0bGU6IGFwcC5uYW1lLFxuICAgIGRlc2NyaXB0aW9uOiBhcHAuZGVzY3JpcHRpb24sXG4gICAgdHlwZTogJ2FwcCcgYXMgY29uc3QsXG4gICAgcGF0aDogZ2V0UmVkaXJlY3Rpb25QYXRoKHRydWUsIHtcbiAgICAgIGlkOiBhcHAuaWQsXG4gICAgICBtb2RlOiBhcHAubW9kZSxcbiAgICB9KSxcbiAgICBpY29uOiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIHNocmluay0wXCI+XG4gICAgICAgIDxBcHBJY29uXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBpY29uVHlwZT17YXBwLmljb25fdHlwZX1cbiAgICAgICAgICBpY29uPXthcHAuaWNvbn1cbiAgICAgICAgICBiYWNrZ3JvdW5kPXthcHAuaWNvbl9iYWNrZ3JvdW5kfVxuICAgICAgICAgIGltYWdlVXJsPXthcHAuaWNvbl91cmx9XG4gICAgICAgIC8+XG4gICAgICAgIDxBcHBUeXBlSWNvblxuICAgICAgICAgIHdyYXBwZXJDbGFzc05hbWU9XCJhYnNvbHV0ZSAtYm90dG9tLTAuNSAtcmlnaHQtMC41IHctNCBoLTQgcm91bmRlZC1bNHB4XSBib3JkZXIgYm9yZGVyLWRpdmlkZXItcmVndWxhciBvdXRsaW5lIG91dGxpbmUtY29tcG9uZW50cy1wYW5lbC1vbi1wYW5lbC1pdGVtLWJnXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJoLTMgdy0zXCJcbiAgICAgICAgICB0eXBlPXthcHAubW9kZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICksXG4gICAgZGF0YTogYXBwLFxuICB9KSlcbn1cblxuZXhwb3J0IGNvbnN0IGFwcEFjdGlvbjogQWN0aW9uSXRlbSA9IHtcbiAga2V5OiAnQGFwcCcsXG4gIHNob3J0Y3V0OiAnQGFwcCcsXG4gIHRpdGxlOiAnU2VhcmNoIEFwcGxpY2F0aW9ucycsXG4gIGRlc2NyaXB0aW9uOiAnU2VhcmNoIGFuZCBuYXZpZ2F0ZSB0byB5b3VyIGFwcGxpY2F0aW9ucycsXG4gIC8vIGFjdGlvbixcbiAgc2VhcmNoOiBhc3luYyAoXywgc2VhcmNoVGVybSA9ICcnLCBfbG9jYWxlKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hBcHBMaXN0KHtcbiAgICAgICAgdXJsOiAnYXBwcycsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgbmFtZTogc2VhcmNoVGVybSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBhcHBzID0gcmVzcG9uc2U/LmRhdGEgfHwgW11cbiAgICAgIHJldHVybiBwYXJzZXIoYXBwcylcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FwcCBzZWFyY2ggZmFpbGVkOicsIGVycm9yKVxuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9LFxufVxuIl19