export declare const useGetDataSourceListAuth: () => any;
export declare const useInvalidDataSourceListAuth: () => () => void;
export declare const useGetDefaultDataSourceListAuth: () => any;
export declare const useInvalidDefaultDataSourceListAuth: () => () => void;
export declare const useGetDataSourceOAuthUrl: (provider: string) => any;
export declare const useGetDataSourceAuth: ({ pluginId, provider, }: {
    pluginId: string;
    provider: string;
}) => any;
export declare const useInvalidDataSourceAuth: ({ pluginId, provider, }: {
    pluginId: string;
    provider: string;
}) => () => void;
