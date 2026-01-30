import type { GitHubRepoReleaseResponse } from '../types';
export declare const useGitHubReleases: () => {
    fetchReleases: (owner: string, repo: string) => Promise<any>;
    checkForUpdates: (fetchedReleases: GitHubRepoReleaseResponse[], currentVersion: string) => {
        needUpdate: boolean;
        toastProps: IToastProps;
    };
};
export declare const useGitHubUpload: () => {
    handleUpload: (repoUrl: string, selectedVersion: string, selectedPackage: string, onSuccess?: (GitHubPackage: {
        manifest: any;
        unique_identifier: string;
    }) => void) => Promise<{
        manifest: any;
        unique_identifier: any;
    }>;
};
