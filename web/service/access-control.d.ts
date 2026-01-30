import type { AccessControlGroup } from '@/models/access-control';
export declare const useAppWhiteListSubjects: (appId: string | undefined, enabled: boolean) => any;
export declare const useSearchForWhiteListCandidates: (query: {
    keyword?: string;
    groupId?: AccessControlGroup["id"];
    resultsPerPage?: number;
}, enabled: boolean) => any;
export declare const useUpdateAccessMode: () => any;
export declare const useGetUserCanAccessApp: ({ appId, isInstalledApp, enabled }: {
    appId?: string;
    isInstalledApp?: boolean;
    enabled?: boolean;
}) => any;
