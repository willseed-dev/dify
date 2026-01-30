"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowClient = void 0;
const base_1 = require("./base");
const validation_1 = require("./validation");
class WorkflowClient extends base_1.DifyClient {
    run(inputOrRequest, user, stream = false) {
        let payload;
        let shouldStream = stream;
        if (user === undefined && "user" in inputOrRequest) {
            payload = inputOrRequest;
            shouldStream = payload.response_mode === "streaming";
        }
        else {
            (0, validation_1.ensureNonEmptyString)(user, "user");
            payload = {
                inputs: inputOrRequest,
                user,
                response_mode: stream ? "streaming" : "blocking",
            };
        }
        (0, validation_1.ensureNonEmptyString)(payload.user, "user");
        if (shouldStream) {
            return this.http.requestStream({
                method: "POST",
                path: "/workflows/run",
                data: payload,
            });
        }
        return this.http.request({
            method: "POST",
            path: "/workflows/run",
            data: payload,
        });
    }
    runById(workflowId, request) {
        (0, validation_1.ensureNonEmptyString)(workflowId, "workflowId");
        (0, validation_1.ensureNonEmptyString)(request.user, "user");
        if (request.response_mode === "streaming") {
            return this.http.requestStream({
                method: "POST",
                path: `/workflows/${workflowId}/run`,
                data: request,
            });
        }
        return this.http.request({
            method: "POST",
            path: `/workflows/${workflowId}/run`,
            data: request,
        });
    }
    getRun(workflowRunId) {
        (0, validation_1.ensureNonEmptyString)(workflowRunId, "workflowRunId");
        return this.http.request({
            method: "GET",
            path: `/workflows/run/${workflowRunId}`,
        });
    }
    stop(taskId, user) {
        (0, validation_1.ensureNonEmptyString)(taskId, "taskId");
        (0, validation_1.ensureNonEmptyString)(user, "user");
        return this.http.request({
            method: "POST",
            path: `/workflows/tasks/${taskId}/stop`,
            data: { user },
        });
    }
    /**
     * Get workflow execution logs with filtering options.
     *
     * Note: The backend API filters by `createdByEndUserSessionId` (end user session ID)
     * or `createdByAccount` (account ID), not by a generic `user` parameter.
     */
    getLogs(options) {
        if (options?.keyword) {
            (0, validation_1.ensureOptionalString)(options.keyword, "keyword");
        }
        if (options?.status) {
            (0, validation_1.ensureOptionalString)(options.status, "status");
        }
        if (options?.createdAtBefore) {
            (0, validation_1.ensureOptionalString)(options.createdAtBefore, "createdAtBefore");
        }
        if (options?.createdAtAfter) {
            (0, validation_1.ensureOptionalString)(options.createdAtAfter, "createdAtAfter");
        }
        if (options?.createdByEndUserSessionId) {
            (0, validation_1.ensureOptionalString)(options.createdByEndUserSessionId, "createdByEndUserSessionId");
        }
        if (options?.createdByAccount) {
            (0, validation_1.ensureOptionalString)(options.createdByAccount, "createdByAccount");
        }
        if (options?.startTime) {
            (0, validation_1.ensureOptionalString)(options.startTime, "startTime");
        }
        if (options?.endTime) {
            (0, validation_1.ensureOptionalString)(options.endTime, "endTime");
        }
        (0, validation_1.ensureOptionalInt)(options?.page, "page");
        (0, validation_1.ensureOptionalInt)(options?.limit, "limit");
        const createdAtAfter = options?.createdAtAfter ?? options?.startTime;
        const createdAtBefore = options?.createdAtBefore ?? options?.endTime;
        const query = {
            keyword: options?.keyword,
            status: options?.status,
            created_at__before: createdAtBefore,
            created_at__after: createdAtAfter,
            created_by_end_user_session_id: options?.createdByEndUserSessionId,
            created_by_account: options?.createdByAccount,
            page: options?.page,
            limit: options?.limit,
        };
        return this.http.request({
            method: "GET",
            path: "/workflows/logs",
            query,
        });
    }
}
exports.WorkflowClient = WorkflowClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3b3JrZmxvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBb0M7QUFHcEMsNkNBSXNCO0FBRXRCLE1BQWEsY0FBZSxTQUFRLGlCQUFVO0lBUzVDLEdBQUcsQ0FDRCxjQUE0RCxFQUM1RCxJQUFhLEVBQ2IsTUFBTSxHQUFHLEtBQUs7UUFFZCxJQUFJLE9BQTJCLENBQUM7UUFDaEMsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDO1FBRTFCLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxNQUFNLElBQUssY0FBcUMsRUFBRSxDQUFDO1lBQzNFLE9BQU8sR0FBRyxjQUFvQyxDQUFDO1lBQy9DLFlBQVksR0FBRyxPQUFPLENBQUMsYUFBYSxLQUFLLFdBQVcsQ0FBQztRQUN2RCxDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUEsaUNBQW9CLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLE9BQU8sR0FBRztnQkFDUixNQUFNLEVBQUUsY0FBeUM7Z0JBQ2pELElBQUk7Z0JBQ0osYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVO2FBQ2pELENBQUM7UUFDSixDQUFDO1FBRUQsSUFBQSxpQ0FBb0IsRUFBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTNDLElBQUksWUFBWSxFQUFFLENBQUM7WUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBc0I7Z0JBQ2xELE1BQU0sRUFBRSxNQUFNO2dCQUNkLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLElBQUksRUFBRSxPQUFPO2FBQ2QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQXNCO1lBQzVDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixJQUFJ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QUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUNELElBQUEsOEJBQWlCLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QyxJQUFBLDhCQUFpQixFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFM0MsTUFBTSxjQUFjLEdBQUcsT0FBTyxFQUFFLGNBQWMsSUFBSSxPQUFPLEVBQUUsU0FBUyxDQUFDO1FBQ3JFLE1BQU0sZUFBZSxHQUFHLE9BQU8sRUFBRSxlQUFlLElBQUksT0FBTyxFQUFFLE9BQU8sQ0FBQztRQUVyRSxNQUFNLEtBQUssR0FBZ0I7WUFDekIsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPO1lBQ3pCLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTTtZQUN2QixrQkFBa0IsRUFBRSxlQUFlO1lBQ25DLGlCQUFpQixFQUFFLGNBQWM7WUFDakMsOEJBQThCLEVBQUUsT0FBTyxFQUFFLHlCQUF5QjtZQUNsRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCO1lBQzdDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSTtZQUNuQixLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUs7U0FDdEIsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDdkIsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsaUJBQWlCO1lBQ3ZCLEtBQUs7U0FDTixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUEzSkQsd0NBMkpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlmeUNsaWVudCB9IGZyb20gXCIuL2Jhc2VcIjtcbmltcG9ydCB0eXBlIHsgV29ya2Zsb3dSdW5SZXF1ZXN0LCBXb3JrZmxvd1J1blJlc3BvbnNlIH0gZnJvbSBcIi4uL3R5cGVzL3dvcmtmbG93XCI7XG5pbXBvcnQgdHlwZSB7IERpZnlSZXNwb25zZSwgRGlmeVN0cmVhbSwgUXVlcnlQYXJhbXMgfSBmcm9tIFwiLi4vdHlwZXMvY29tbW9uXCI7XG5pbXBvcnQge1xuICBlbnN1cmVOb25FbXB0eVN0cmluZyxcbiAgZW5zdXJlT3B0aW9uYWxJbnQsXG4gIGVuc3VyZU9wdGlvbmFsU3RyaW5nLFxufSBmcm9tIFwiLi92YWxpZGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBXb3JrZmxvd0NsaWVudCBleHRlbmRzIERpZnlDbGllbnQge1xuICBydW4oXG4gICAgcmVxdWVzdDogV29ya2Zsb3dSdW5SZXF1ZXN0XG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPFdvcmtmbG93UnVuUmVzcG9uc2U+IHwgRGlmeVN0cmVhbTxXb3JrZmxvd1J1blJlc3BvbnNlPj47XG4gIHJ1bihcbiAgICBpbnB1dHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgIHVzZXI6IHN0cmluZyxcbiAgICBzdHJlYW0/OiBib29sZWFuXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPFdvcmtmbG93UnVuUmVzcG9uc2U+IHwgRGlmeVN0cmVhbTxXb3JrZmxvd1J1blJlc3BvbnNlPj47XG4gIHJ1bihcbiAgICBpbnB1dE9yUmVxdWVzdDogV29ya2Zsb3dSdW5SZXF1ZXN0IHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgdXNlcj86IHN0cmluZyxcbiAgICBzdHJlYW0gPSBmYWxzZVxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxXb3JrZmxvd1J1blJlc3BvbnNlPiB8IERpZnlTdHJlYW08V29ya2Zsb3dSdW5SZXNwb25zZT4+IHtcbiAgICBsZXQgcGF5bG9hZDogV29ya2Zsb3dSdW5SZXF1ZXN0O1xuICAgIGxldCBzaG91bGRTdHJlYW0gPSBzdHJlYW07XG5cbiAgICBpZiAodXNlciA9PT0gdW5kZWZpbmVkICYmIFwidXNlclwiIGluIChpbnB1dE9yUmVxdWVzdCBhcyBXb3JrZmxvd1J1blJlcXVlc3QpKSB7XG4gICAgICBwYXlsb2FkID0gaW5wdXRPclJlcXVlc3QgYXMgV29ya2Zsb3dSdW5SZXF1ZXN0O1xuICAgICAgc2hvdWxkU3RyZWFtID0gcGF5bG9hZC5yZXNwb25zZV9tb2RlID09PSBcInN0cmVhbWluZ1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnN1cmVOb25FbXB0eVN0cmluZyh1c2VyLCBcInVzZXJcIik7XG4gICAgICBwYXlsb2FkID0ge1xuICAgICAgICBpbnB1dHM6IGlucHV0T3JSZXF1ZXN0IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgICAgICB1c2VyLFxuICAgICAgICByZXNwb25zZV9tb2RlOiBzdHJlYW0gPyBcInN0cmVhbWluZ1wiIDogXCJibG9ja2luZ1wiLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhwYXlsb2FkLnVzZXIsIFwidXNlclwiKTtcblxuICAgIGlmIChzaG91bGRTdHJlYW0pIHtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdFN0cmVhbTxXb3JrZmxvd1J1blJlc3BvbnNlPih7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHBhdGg6IFwiL3dvcmtmbG93cy9ydW5cIixcbiAgICAgICAgZGF0YTogcGF5bG9hZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdDxXb3JrZmxvd1J1blJlc3BvbnNlPih7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogXCIvd29ya2Zsb3dzL3J1blwiLFxuICAgICAgZGF0YTogcGF5bG9hZCxcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkJ5SWQoXG4gICAgd29ya2Zsb3dJZDogc3RyaW5nLFxuICAgIHJlcXVlc3Q6IFdvcmtmbG93UnVuUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxXb3JrZmxvd1J1blJlc3BvbnNlPiB8IERpZnlTdHJlYW08V29ya2Zsb3dSdW5SZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyh3b3JrZmxvd0lkLCBcIndvcmtmbG93SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC51c2VyLCBcInVzZXJcIik7XG4gICAgaWYgKHJlcXVlc3QucmVzcG9uc2VfbW9kZSA9PT0gXCJzdHJlYW1pbmdcIikge1xuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0U3RyZWFtPFdvcmtmbG93UnVuUmVzcG9uc2U+KHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgcGF0aDogYC93b3JrZmxvd3MvJHt3b3JrZmxvd0lkfS9ydW5gLFxuICAgICAgICBkYXRhOiByZXF1ZXN0LFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdDxXb3JrZmxvd1J1blJlc3BvbnNlPih7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogYC93b3JrZmxvd3MvJHt3b3JrZmxvd0lkfS9ydW5gLFxuICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJ1bih3b3JrZmxvd1J1bklkOiBzdHJpbmcpOiBQcm9taXNlPERpZnlSZXNwb25zZTxXb3JrZmxvd1J1blJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHdvcmtmbG93UnVuSWQsIFwid29ya2Zsb3dSdW5JZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgcGF0aDogYC93b3JrZmxvd3MvcnVuLyR7d29ya2Zsb3dSdW5JZH1gLFxuICAgIH0pO1xuICB9XG5cbiAgc3RvcChcbiAgICB0YXNrSWQ6IHN0cmluZyxcbiAgICB1c2VyOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8V29ya2Zsb3dSdW5SZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyh0YXNrSWQsIFwidGFza0lkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHVzZXIsIFwidXNlclwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Q8V29ya2Zsb3dSdW5SZXNwb25zZT4oe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvd29ya2Zsb3dzL3Rhc2tzLyR7dGFza0lkfS9zdG9wYCxcbiAgICAgIGRhdGE6IHsgdXNlciB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB3b3JrZmxvdyBleGVjdXRpb24gbG9ncyB3aXRoIGZpbHRlcmluZyBvcHRpb25zLlxuICAgKlxuICAgKiBOb3RlOiBUaGUgYmFja2VuZCBBUEkgZmlsdGVycyBieSBgY3JlYXRlZEJ5RW5kVXNlclNlc3Npb25JZGAgKGVuZCB1c2VyIHNlc3Npb24gSUQpXG4gICAqIG9yIGBjcmVhdGVkQnlBY2NvdW50YCAoYWNjb3VudCBJRCksIG5vdCBieSBhIGdlbmVyaWMgYHVzZXJgIHBhcmFtZXRlci5cbiAgICovXG4gIGdldExvZ3Mob3B0aW9ucz86IHtcbiAgICBrZXl3b3JkPzogc3RyaW5nO1xuICAgIHN0YXR1cz86IHN0cmluZztcbiAgICBjcmVhdGVkQXRCZWZvcmU/OiBzdHJpbmc7XG4gICAgY3JlYXRlZEF0QWZ0ZXI/OiBzdHJpbmc7XG4gICAgY3JlYXRlZEJ5RW5kVXNlclNlc3Npb25JZD86IHN0cmluZztcbiAgICBjcmVhdGVkQnlBY2NvdW50Pzogc3RyaW5nO1xuICAgIHBhZ2U/OiBudW1iZXI7XG4gICAgbGltaXQ/OiBudW1iZXI7XG4gICAgc3RhcnRUaW1lPzogc3RyaW5nO1xuICAgIGVuZFRpbWU/OiBzdHJpbmc7XG4gIH0pOiBQcm9taXNlPERpZnlSZXNwb25zZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4+IHtcbiAgICBpZiAob3B0aW9ucz8ua2V5d29yZCkge1xuICAgICAgZW5zdXJlT3B0aW9uYWxTdHJpbmcob3B0aW9ucy5rZXl3b3JkLCBcImtleXdvcmRcIik7XG4gICAgfVxuICAgIGlmIChvcHRpb25zPy5zdGF0dXMpIHtcbiAgICAgIGVuc3VyZU9wdGlvbmFsU3RyaW5nKG9wdGlvbnMuc3RhdHVzLCBcInN0YXR1c1wiKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnM/LmNyZWF0ZWRBdEJlZm9yZSkge1xuICAgICAgZW5zdXJlT3B0aW9uYWxTdHJpbmcob3B0aW9ucy5jcmVhdGVkQXRCZWZvcmUsIFwiY3JlYXRlZEF0QmVmb3JlXCIpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucz8uY3JlYXRlZEF0QWZ0ZXIpIHtcbiAgICAgIGVuc3VyZU9wdGlvbmFsU3RyaW5nKG9wdGlvbnMuY3JlYXRlZEF0QWZ0ZXIsIFwiY3JlYXRlZEF0QWZ0ZXJcIik7XG4gICAgfVxuICAgIGlmIChvcHRpb25zPy5jcmVhdGVkQnlFbmRVc2VyU2Vzc2lvbklkKSB7XG4gICAgICBlbnN1cmVPcHRpb25hbFN0cmluZyhcbiAgICAgICAgb3B0aW9ucy5jcmVhdGVkQnlFbmRVc2VyU2Vzc2lvbklkLFxuICAgICAgICBcImNyZWF0ZWRCeUVuZFVzZXJTZXNzaW9uSWRcIlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnM/LmNyZWF0ZWRCeUFjY291bnQpIHtcbiAgICAgIGVuc3VyZU9wdGlvbmFsU3RyaW5nKG9wdGlvbnMuY3JlYXRlZEJ5QWNjb3VudCwgXCJjcmVhdGVkQnlBY2NvdW50XCIpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucz8uc3RhcnRUaW1lKSB7XG4gICAgICBlbnN1cmVPcHRpb25hbFN0cmluZyhvcHRpb25zLnN0YXJ0VGltZSwgXCJzdGFydFRpbWVcIik7XG4gICAgfVxuICAgIGlmIChvcHRpb25zPy5lbmRUaW1lKSB7XG4gICAgICBlbnN1cmVPcHRpb25hbFN0cmluZyhvcHRpb25zLmVuZFRpbWUsIFwiZW5kVGltZVwiKTtcbiAgICB9XG4gICAgZW5zdXJlT3B0aW9uYWxJbnQob3B0aW9ucz8ucGFnZSwgXCJwYWdlXCIpO1xuICAgIGVuc3VyZU9wdGlvbmFsSW50KG9wdGlvbnM/LmxpbWl0LCBcImxpbWl0XCIpO1xuXG4gICAgY29uc3QgY3JlYXRlZEF0QWZ0ZXIgPSBvcHRpb25zPy5jcmVhdGVkQXRBZnRlciA/PyBvcHRpb25zPy5zdGFydFRpbWU7XG4gICAgY29uc3QgY3JlYXRlZEF0QmVmb3JlID0gb3B0aW9ucz8uY3JlYXRlZEF0QmVmb3JlID8/IG9wdGlvbnM/LmVuZFRpbWU7XG5cbiAgICBjb25zdCBxdWVyeTogUXVlcnlQYXJhbXMgPSB7XG4gICAgICBrZXl3b3JkOiBvcHRpb25zPy5rZXl3b3JkLFxuICAgICAgc3RhdHVzOiBvcHRpb25zPy5zdGF0dXMsXG4gICAgICBjcmVhdGVkX2F0X19iZWZvcmU6IGNyZWF0ZWRBdEJlZm9yZSxcbiAgICAgIGNyZWF0ZWRfYXRfX2FmdGVyOiBjcmVhdGVkQXRBZnRlcixcbiAgICAgIGNyZWF0ZWRfYnlfZW5kX3VzZXJfc2Vzc2lvbl9pZDogb3B0aW9ucz8uY3JlYXRlZEJ5RW5kVXNlclNlc3Npb25JZCxcbiAgICAgIGNyZWF0ZWRfYnlfYWNjb3VudDogb3B0aW9ucz8uY3JlYXRlZEJ5QWNjb3VudCxcbiAgICAgIHBhZ2U6IG9wdGlvbnM/LnBhZ2UsXG4gICAgICBsaW1pdDogb3B0aW9ucz8ubGltaXQsXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBcIi93b3JrZmxvd3MvbG9nc1wiLFxuICAgICAgcXVlcnksXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==