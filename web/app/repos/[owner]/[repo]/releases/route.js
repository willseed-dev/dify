"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const core_1 = require("@octokit/core");
const request_error_1 = require("@octokit/request-error");
const server_1 = require("next/server");
const config_1 = require("@/config");
const octokit = new core_1.Octokit({
    auth: config_1.GITHUB_ACCESS_TOKEN,
});
async function GET(request, { params }) {
    const { owner, repo } = (await params);
    try {
        const releasesRes = await octokit.request('GET /repos/{owner}/{repo}/releases', {
            owner,
            repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        return server_1.NextResponse.json(releasesRes);
    }
    catch (error) {
        if (error instanceof request_error_1.RequestError)
            return server_1.NextResponse.json(error.response);
        else
            throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWVBLGtCQXFCQztBQW5DRCx3Q0FBdUM7QUFDdkMsMERBQXFEO0FBQ3JELHdDQUEwQztBQUMxQyxxQ0FBOEM7QUFPOUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFPLENBQUM7SUFDMUIsSUFBSSxFQUFFLDRCQUFtQjtDQUMxQixDQUFDLENBQUE7QUFFSyxLQUFLLFVBQVUsR0FBRyxDQUN2QixPQUFvQixFQUNwQixFQUFFLE1BQU0sRUFBK0I7SUFFdkMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sTUFBTSxDQUFDLENBQUE7SUFDdEMsSUFBSSxDQUFDO1FBQ0gsTUFBTSxXQUFXLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxFQUFFO1lBQzlFLEtBQUs7WUFDTCxJQUFJO1lBQ0osT0FBTyxFQUFFO2dCQUNQLHNCQUFzQixFQUFFLFlBQVk7YUFDckM7U0FDRixDQUFDLENBQUE7UUFDRixPQUFPLHFCQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3ZDLENBQUM7SUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxLQUFLLFlBQVksNEJBQVk7WUFDL0IsT0FBTyxxQkFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7O1lBRXhDLE1BQU0sS0FBSyxDQUFBO0lBQ2YsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5leHRSZXF1ZXN0IH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBPY3Rva2l0IH0gZnJvbSAnQG9jdG9raXQvY29yZSdcbmltcG9ydCB7IFJlcXVlc3RFcnJvciB9IGZyb20gJ0BvY3Rva2l0L3JlcXVlc3QtZXJyb3InXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCB7IEdJVEhVQl9BQ0NFU1NfVE9LRU4gfSBmcm9tICdAL2NvbmZpZydcblxudHlwZSBQYXJhbXMgPSB7XG4gIG93bmVyOiBzdHJpbmdcbiAgcmVwbzogc3RyaW5nXG59XG5cbmNvbnN0IG9jdG9raXQgPSBuZXcgT2N0b2tpdCh7XG4gIGF1dGg6IEdJVEhVQl9BQ0NFU1NfVE9LRU4sXG59KVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKFxuICByZXF1ZXN0OiBOZXh0UmVxdWVzdCxcbiAgeyBwYXJhbXMgfTogeyBwYXJhbXM6IFByb21pc2U8UGFyYW1zPiB9LFxuKSB7XG4gIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IChhd2FpdCBwYXJhbXMpXG4gIHRyeSB7XG4gICAgY29uc3QgcmVsZWFzZXNSZXMgPSBhd2FpdCBvY3Rva2l0LnJlcXVlc3QoJ0dFVCAvcmVwb3Mve293bmVyfS97cmVwb30vcmVsZWFzZXMnLCB7XG4gICAgICBvd25lcixcbiAgICAgIHJlcG8sXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdYLUdpdEh1Yi1BcGktVmVyc2lvbic6ICcyMDIyLTExLTI4JyxcbiAgICAgIH0sXG4gICAgfSlcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24ocmVsZWFzZXNSZXMpXG4gIH1cbiAgY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgUmVxdWVzdEVycm9yKVxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGVycm9yLnJlc3BvbnNlKVxuICAgIGVsc2VcbiAgICAgIHRocm93IGVycm9yXG4gIH1cbn1cbiJdfQ==