"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGitHubUpload = exports.useGitHubReleases = void 0;
const toast_1 = require("@/app/components/base/toast");
const config_1 = require("@/config");
const plugins_1 = require("@/service/plugins");
const semver_1 = require("@/utils/semver");
const formatReleases = (releases) => {
    return releases.map((release) => ({
        tag_name: release.tag_name,
        assets: release.assets.map((asset) => ({
            browser_download_url: asset.browser_download_url,
            name: asset.name,
        })),
    }));
};
const useGitHubReleases = () => {
    const fetchReleases = async (owner, repo) => {
        try {
            if (!config_1.GITHUB_ACCESS_TOKEN) {
                // Fetch releases without authentication from client
                const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
                if (!res.ok)
                    throw new Error('Failed to fetch repository releases');
                const data = await res.json();
                return formatReleases(data);
            }
            else {
                // Fetch releases with authentication from server
                const res = await fetch(`/repos/${owner}/${repo}/releases`);
                const bodyJson = await res.json();
                if (bodyJson.status !== 200)
                    throw new Error(bodyJson.data.message);
                return formatReleases(bodyJson.data);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast_1.default.notify({
                    type: 'error',
                    message: error.message,
                });
            }
            else {
                toast_1.default.notify({
                    type: 'error',
                    message: 'Failed to fetch repository releases',
                });
            }
            return [];
        }
    };
    const checkForUpdates = (fetchedReleases, currentVersion) => {
        let needUpdate = false;
        const toastProps = {
            type: 'info',
            message: 'No new version available',
        };
        if (fetchedReleases.length === 0) {
            toastProps.type = 'error';
            toastProps.message = 'Input releases is empty';
            return { needUpdate, toastProps };
        }
        const versions = fetchedReleases.map(release => release.tag_name);
        const latestVersion = (0, semver_1.getLatestVersion)(versions);
        try {
            needUpdate = (0, semver_1.compareVersion)(latestVersion, currentVersion) === 1;
            if (needUpdate)
                toastProps.message = `New version available: ${latestVersion}`;
        }
        catch {
            needUpdate = false;
            toastProps.type = 'error';
            toastProps.message = 'Fail to compare versions, please check the version format';
        }
        return { needUpdate, toastProps };
    };
    return { fetchReleases, checkForUpdates };
};
exports.useGitHubReleases = useGitHubReleases;
const useGitHubUpload = () => {
    const handleUpload = async (repoUrl, selectedVersion, selectedPackage, onSuccess) => {
        try {
            const response = await (0, plugins_1.uploadGitHub)(repoUrl, selectedVersion, selectedPackage);
            const GitHubPackage = {
                manifest: response.manifest,
                unique_identifier: response.unique_identifier,
            };
            if (onSuccess)
                onSuccess(GitHubPackage);
            return GitHubPackage;
        }
        catch (error) {
            toast_1.default.notify({
                type: 'error',
                message: 'Error uploading package',
            });
            throw error;
        }
    };
    return { handleUpload };
};
exports.useGitHubUpload = useGitHubUpload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSx1REFBK0M7QUFDL0MscUNBQThDO0FBQzlDLCtDQUFnRDtBQUNoRCwyQ0FBaUU7QUFFakUsTUFBTSxjQUFjLEdBQUcsQ0FBQyxRQUFhLEVBQUUsRUFBRTtJQUN2QyxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1FBQzFCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsb0JBQW9CO1lBQ2hELElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtTQUNqQixDQUFDLENBQUM7S0FDSixDQUFDLENBQUMsQ0FBQTtBQUNMLENBQUMsQ0FBQTtBQUVNLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQ3BDLE1BQU0sYUFBYSxHQUFHLEtBQUssRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLEVBQUU7UUFDMUQsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLDRCQUFtQixFQUFFLENBQUM7Z0JBQ3pCLG9EQUFvRDtnQkFDcEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsZ0NBQWdDLEtBQUssSUFBSSxJQUFJLFdBQVcsQ0FBQyxDQUFBO2dCQUNqRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO2dCQUN4RCxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDN0IsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDN0IsQ0FBQztpQkFDSSxDQUFDO2dCQUNKLGlEQUFpRDtnQkFD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Q0QsSUFBSSxTQUFTO2dCQUNYLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUMxQixPQUFPLGFBQWEsQ0FBQTtRQUN0QixDQUFDO1FBQ0QsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLGVBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ1gsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsT0FBTyxFQUFFLHlCQUF5QjthQUNuQyxDQUFDLENBQUE7WUFDRixNQUFNLEtBQUssQ0FBQTtRQUNiLENBQUM7SUFDSCxDQUFDLENBQUE7SUFFRCxPQUFPLEVBQUUsWUFBWSxFQUFFLENBQUE7QUFDekIsQ0FBQyxDQUFBO0FBM0JZLFFBQUEsZUFBZSxtQkEyQjNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBHaXRIdWJSZXBvUmVsZWFzZVJlc3BvbnNlIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IElUb2FzdFByb3BzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IEdJVEhVQl9BQ0NFU1NfVE9LRU4gfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IHVwbG9hZEdpdEh1YiB9IGZyb20gJ0Avc2VydmljZS9wbHVnaW5zJ1xuaW1wb3J0IHsgY29tcGFyZVZlcnNpb24sIGdldExhdGVzdFZlcnNpb24gfSBmcm9tICdAL3V0aWxzL3NlbXZlcidcblxuY29uc3QgZm9ybWF0UmVsZWFzZXMgPSAocmVsZWFzZXM6IGFueSkgPT4ge1xuICByZXR1cm4gcmVsZWFzZXMubWFwKChyZWxlYXNlOiBhbnkpID0+ICh7XG4gICAgdGFnX25hbWU6IHJlbGVhc2UudGFnX25hbWUsXG4gICAgYXNzZXRzOiByZWxlYXNlLmFzc2V0cy5tYXAoKGFzc2V0OiBhbnkpID0+ICh7XG4gICAgICBicm93c2VyX2Rvd25sb2FkX3VybDogYXNzZXQuYnJvd3Nlcl9kb3dubG9hZF91cmwsXG4gICAgICBuYW1lOiBhc3NldC5uYW1lLFxuICAgIH0pKSxcbiAgfSkpXG59XG5cbmV4cG9ydCBjb25zdCB1c2VHaXRIdWJSZWxlYXNlcyA9ICgpID0+IHtcbiAgY29uc3QgZmV0Y2hSZWxlYXNlcyA9IGFzeW5jIChvd25lcjogc3RyaW5nLCByZXBvOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFHSVRIVUJfQUNDRVNTX1RPS0VOKSB7XG4gICAgICAgIC8vIEZldGNoIHJlbGVhc2VzIHdpdGhvdXQgYXV0aGVudGljYXRpb24gZnJvbSBjbGllbnRcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvJHtvd25lcn0vJHtyZXBvfS9yZWxlYXNlc2ApXG4gICAgICAgIGlmICghcmVzLm9rKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoIHJlcG9zaXRvcnkgcmVsZWFzZXMnKVxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxuICAgICAgICByZXR1cm4gZm9ybWF0UmVsZWFzZXMoZGF0YSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBGZXRjaCByZWxlYXNlcyB3aXRoIGF1dGhlbnRpY2F0aW9uIGZyb20gc2VydmVyXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAvcmVwb3MvJHtvd25lcn0vJHtyZXBvfS9yZWxlYXNlc2ApXG4gICAgICAgIGNvbnN0IGJvZHlKc29uID0gYXdhaXQgcmVzLmpzb24oKVxuICAgICAgICBpZiAoYm9keUpzb24uc3RhdHVzICE9PSAyMDApXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGJvZHlKc29uLmRhdGEubWVzc2FnZSlcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlbGVhc2VzKGJvZHlKc29uLmRhdGEpXG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdGYWlsZWQgdG8gZmV0Y2ggcmVwb3NpdG9yeSByZWxlYXNlcycsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH1cblxuICBjb25zdCBjaGVja0ZvclVwZGF0ZXMgPSAoZmV0Y2hlZFJlbGVhc2VzOiBHaXRIdWJSZXBvUmVsZWFzZVJlc3BvbnNlW10sIGN1cnJlbnRWZXJzaW9uOiBzdHJpbmcpID0+IHtcbiAgICBsZXQgbmVlZFVwZGF0ZSA9IGZhbHNlXG4gICAgY29uc3QgdG9hc3RQcm9wczogSVRvYXN0UHJvcHMgPSB7XG4gICAgICB0eXBlOiAnaW5mbycsXG4gICAgICBtZXNzYWdlOiAnTm8gbmV3IHZlcnNpb24gYXZhaWxhYmxlJyxcbiAgICB9XG4gICAgaWYgKGZldGNoZWRSZWxlYXNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRvYXN0UHJvcHMudHlwZSA9ICdlcnJvcidcbiAgICAgIHRvYXN0UHJvcHMubWVzc2FnZSA9ICdJbnB1dCByZWxlYXNlcyBpcyBlbXB0eSdcbiAgICAgIHJldHVybiB7IG5lZWRVcGRhdGUsIHRvYXN0UHJvcHMgfVxuICAgIH1cbiAgICBjb25zdCB2ZXJzaW9ucyA9IGZldGNoZWRSZWxlYXNlcy5tYXAocmVsZWFzZSA9PiByZWxlYXNlLnRhZ19uYW1lKVxuICAgIGNvbnN0IGxhdGVzdFZlcnNpb24gPSBnZXRMYXRlc3RWZXJzaW9uKHZlcnNpb25zKVxuICAgIHRyeSB7XG4gICAgICBuZWVkVXBkYXRlID0gY29tcGFyZVZlcnNpb24obGF0ZXN0VmVyc2lvbiwgY3VycmVudFZlcnNpb24pID09PSAxXG4gICAgICBpZiAobmVlZFVwZGF0ZSlcbiAgICAgICAgdG9hc3RQcm9wcy5tZXNzYWdlID0gYE5ldyB2ZXJzaW9uIGF2YWlsYWJsZTogJHtsYXRlc3RWZXJzaW9ufWBcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgbmVlZFVwZGF0ZSA9IGZhbHNlXG4gICAgICB0b2FzdFByb3BzLnR5cGUgPSAnZXJyb3InXG4gICAgICB0b2FzdFByb3BzLm1lc3NhZ2UgPSAnRmFpbCB0byBjb21wYXJlIHZlcnNpb25zLCBwbGVhc2UgY2hlY2sgdGhlIHZlcnNpb24gZm9ybWF0J1xuICAgIH1cbiAgICByZXR1cm4geyBuZWVkVXBkYXRlLCB0b2FzdFByb3BzIH1cbiAgfVxuXG4gIHJldHVybiB7IGZldGNoUmVsZWFzZXMsIGNoZWNrRm9yVXBkYXRlcyB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VHaXRIdWJVcGxvYWQgPSAoKSA9PiB7XG4gIGNvbnN0IGhhbmRsZVVwbG9hZCA9IGFzeW5jIChcbiAgICByZXBvVXJsOiBzdHJpbmcsXG4gICAgc2VsZWN0ZWRWZXJzaW9uOiBzdHJpbmcsXG4gICAgc2VsZWN0ZWRQYWNrYWdlOiBzdHJpbmcsXG4gICAgb25TdWNjZXNzPzogKEdpdEh1YlBhY2thZ2U6IHsgbWFuaWZlc3Q6IGFueSwgdW5pcXVlX2lkZW50aWZpZXI6IHN0cmluZyB9KSA9PiB2b2lkLFxuICApID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB1cGxvYWRHaXRIdWIocmVwb1VybCwgc2VsZWN0ZWRWZXJzaW9uLCBzZWxlY3RlZFBhY2thZ2UpXG4gICAgICBjb25zdCBHaXRIdWJQYWNrYWdlID0ge1xuICAgICAgICBtYW5pZmVzdDogcmVzcG9uc2UubWFuaWZlc3QsXG4gICAgICAgIHVuaXF1ZV9pZGVudGlmaWVyOiByZXNwb25zZS51bmlxdWVfaWRlbnRpZmllcixcbiAgICAgIH1cbiAgICAgIGlmIChvblN1Y2Nlc3MpXG4gICAgICAgIG9uU3VjY2VzcyhHaXRIdWJQYWNrYWdlKVxuICAgICAgcmV0dXJuIEdpdEh1YlBhY2thZ2VcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnRXJyb3IgdXBsb2FkaW5nIHBhY2thZ2UnLFxuICAgICAgfSlcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgaGFuZGxlVXBsb2FkIH1cbn1cbiJdfQ==