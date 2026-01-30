export declare const useEndpointList: (pluginID: string) => any;
export declare const useInvalidateEndpointList: () => (pluginID: string) => void;
export declare const useCreateEndpoint: ({ onSuccess, onError, }: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => any;
export declare const useUpdateEndpoint: ({ onSuccess, onError, }: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => any;
export declare const useDeleteEndpoint: ({ onSuccess, onError, }: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => any;
export declare const useEnableEndpoint: ({ onSuccess, onError, }: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => any;
export declare const useDisableEndpoint: ({ onSuccess, onError, }: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => any;
