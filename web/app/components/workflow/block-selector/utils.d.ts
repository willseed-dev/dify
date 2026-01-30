import type { DataSourceItem } from './types';
export declare const transformDataSourceToTool: (dataSourceItem: DataSourceItem) => {
    id: string;
    provider: string;
    name: string;
    author: string;
    description: TypeWithI18N;
    icon: string | {
        background: string;
        content: string;
    };
    label: TypeWithI18N;
    type: string;
    team_credentials: {};
    allow_delete: boolean;
    is_team_authorization: boolean;
    is_authorized: boolean;
    labels: string[];
    plugin_id: string;
    plugin_unique_identifier: string;
    tools: Tool[];
    credentialsSchema: unknown[];
    meta: {
        version: string;
    };
};
