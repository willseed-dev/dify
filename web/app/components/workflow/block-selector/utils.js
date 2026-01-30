"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDataSourceToTool = void 0;
const transformDataSourceToTool = (dataSourceItem) => {
    return {
        id: dataSourceItem.plugin_id,
        provider: dataSourceItem.provider,
        name: dataSourceItem.provider,
        author: dataSourceItem.declaration.identity.author,
        description: dataSourceItem.declaration.identity.description,
        icon: dataSourceItem.declaration.identity.icon,
        label: dataSourceItem.declaration.identity.label,
        type: dataSourceItem.declaration.provider_type,
        team_credentials: {},
        allow_delete: true,
        is_team_authorization: dataSourceItem.is_authorized,
        is_authorized: dataSourceItem.is_authorized,
        labels: dataSourceItem.declaration.identity.tags || [],
        plugin_id: dataSourceItem.plugin_id,
        plugin_unique_identifier: dataSourceItem.plugin_unique_identifier,
        tools: dataSourceItem.declaration.datasources.map((datasource) => {
            return {
                name: datasource.identity.name,
                author: datasource.identity.author,
                label: datasource.identity.label,
                description: datasource.description,
                parameters: datasource.parameters,
                labels: [],
                output_schema: datasource.output_schema,
            };
        }),
        credentialsSchema: dataSourceItem.declaration.credentials_schema || [],
        meta: {
            version: '',
        },
    };
};
exports.transformDataSourceToTool = transformDataSourceToTool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHTyxNQUFNLHlCQUF5QixHQUFHLENBQUMsY0FBOEIsRUFBRSxFQUFFO0lBQzFFLE9BQU87UUFDTCxFQUFFLEVBQUUsY0FBYyxDQUFDLFNBQVM7UUFDNUIsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRO1FBQ2pDLElBQUksRUFBRSxjQUFjLENBQUMsUUFBUTtRQUM3QixNQUFNLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTTtRQUNsRCxXQUFXLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVztRQUM1RCxJQUFJLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSTtRQUM5QyxLQUFLLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSztRQUNoRCxJQUFJLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxhQUFhO1FBQzlDLGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsWUFBWSxFQUFFLElBQUk7UUFDbEIscUJBQXFCLEVBQUUsY0FBYyxDQUFDLGFBQWE7UUFDbkQsYUFBYSxFQUFFLGNBQWMsQ0FBQyxhQUFhO1FBQzNDLE1BQU0sRUFBRSxjQUFjLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksRUFBRTtRQUN0RCxTQUFTLEVBQUUsY0FBYyxDQUFDLFNBQVM7UUFDbkMsd0JBQXdCLEVBQUUsY0FBYyxDQUFDLHdCQUF3QjtRQUNqRSxLQUFLLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDL0QsT0FBTztnQkFDTCxJQUFJLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJO2dCQUM5QixNQUFNLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNO2dCQUNsQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLO2dCQUNoQyxXQUFXLEVBQUUsVUFBVSxDQUFDLFdBQVc7Z0JBQ25DLFVBQVUsRUFBRSxVQUFVLENBQUMsVUFBVTtnQkFDakMsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsYUFBYSxFQUFFLFVBQVUsQ0FBQyxhQUFhO2FBQ2hDLENBQUE7UUFDWCxDQUFDLENBQUM7UUFDRixpQkFBaUIsRUFBRSxjQUFjLENBQUMsV0FBVyxDQUFDLGtCQUFrQixJQUFJLEVBQUU7UUFDdEUsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLEVBQUU7U0FDWjtLQUNGLENBQUE7QUFDSCxDQUFDLENBQUE7QUFqQ1ksUUFBQSx5QkFBeUIsNkJBaUNyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZUl0ZW0gfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBUb29sIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy90b29scy90eXBlcydcblxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybURhdGFTb3VyY2VUb1Rvb2wgPSAoZGF0YVNvdXJjZUl0ZW06IERhdGFTb3VyY2VJdGVtKSA9PiB7XG4gIHJldHVybiB7XG4gICAgaWQ6IGRhdGFTb3VyY2VJdGVtLnBsdWdpbl9pZCxcbiAgICBwcm92aWRlcjogZGF0YVNvdXJjZUl0ZW0ucHJvdmlkZXIsXG4gICAgbmFtZTogZGF0YVNvdXJjZUl0ZW0ucHJvdmlkZXIsXG4gICAgYXV0aG9yOiBkYXRhU291cmNlSXRlbS5kZWNsYXJhdGlvbi5pZGVudGl0eS5hdXRob3IsXG4gICAgZGVzY3JpcHRpb246IGRhdGFTb3VyY2VJdGVtLmRlY2xhcmF0aW9uLmlkZW50aXR5LmRlc2NyaXB0aW9uLFxuICAgIGljb246IGRhdGFTb3VyY2VJdGVtLmRlY2xhcmF0aW9uLmlkZW50aXR5Lmljb24sXG4gICAgbGFiZWw6IGRhdGFTb3VyY2VJdGVtLmRlY2xhcmF0aW9uLmlkZW50aXR5LmxhYmVsLFxuICAgIHR5cGU6IGRhdGFTb3VyY2VJdGVtLmRlY2xhcmF0aW9uLnByb3ZpZGVyX3R5cGUsXG4gICAgdGVhbV9jcmVkZW50aWFsczoge30sXG4gICAgYWxsb3dfZGVsZXRlOiB0cnVlLFxuICAgIGlzX3RlYW1fYXV0aG9yaXphdGlvbjogZGF0YVNvdXJjZUl0ZW0uaXNfYXV0aG9yaXplZCxcbiAgICBpc19hdXRob3JpemVkOiBkYXRhU291cmNlSXRlbS5pc19hdXRob3JpemVkLFxuICAgIGxhYmVsczogZGF0YVNvdXJjZUl0ZW0uZGVjbGFyYXRpb24uaWRlbnRpdHkudGFncyB8fCBbXSxcbiAgICBwbHVnaW5faWQ6IGRhdGFTb3VyY2VJdGVtLnBsdWdpbl9pZCxcbiAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6IGRhdGFTb3VyY2VJdGVtLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllcixcbiAgICB0b29sczogZGF0YVNvdXJjZUl0ZW0uZGVjbGFyYXRpb24uZGF0YXNvdXJjZXMubWFwKChkYXRhc291cmNlKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBkYXRhc291cmNlLmlkZW50aXR5Lm5hbWUsXG4gICAgICAgIGF1dGhvcjogZGF0YXNvdXJjZS5pZGVudGl0eS5hdXRob3IsXG4gICAgICAgIGxhYmVsOiBkYXRhc291cmNlLmlkZW50aXR5LmxhYmVsLFxuICAgICAgICBkZXNjcmlwdGlvbjogZGF0YXNvdXJjZS5kZXNjcmlwdGlvbixcbiAgICAgICAgcGFyYW1ldGVyczogZGF0YXNvdXJjZS5wYXJhbWV0ZXJzLFxuICAgICAgICBsYWJlbHM6IFtdLFxuICAgICAgICBvdXRwdXRfc2NoZW1hOiBkYXRhc291cmNlLm91dHB1dF9zY2hlbWEsXG4gICAgICB9IGFzIFRvb2xcbiAgICB9KSxcbiAgICBjcmVkZW50aWFsc1NjaGVtYTogZGF0YVNvdXJjZUl0ZW0uZGVjbGFyYXRpb24uY3JlZGVudGlhbHNfc2NoZW1hIHx8IFtdLFxuICAgIG1ldGE6IHtcbiAgICAgIHZlcnNpb246ICcnLFxuICAgIH0sXG4gIH1cbn1cbiJdfQ==