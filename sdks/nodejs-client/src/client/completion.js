"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionClient = void 0;
const base_1 = require("./base");
const validation_1 = require("./validation");
const warned = new Set();
const warnOnce = (message) => {
    if (warned.has(message)) {
        return;
    }
    warned.add(message);
    console.warn(message);
};
class CompletionClient extends base_1.DifyClient {
    createCompletionMessage(inputOrRequest, user, stream = false, files) {
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
                files,
                response_mode: stream ? "streaming" : "blocking",
            };
        }
        (0, validation_1.ensureNonEmptyString)(payload.user, "user");
        if (shouldStream) {
            return this.http.requestStream({
                method: "POST",
                path: "/completion-messages",
                data: payload,
            });
        }
        return this.http.request({
            method: "POST",
            path: "/completion-messages",
            data: payload,
        });
    }
    stopCompletionMessage(taskId, user) {
        (0, validation_1.ensureNonEmptyString)(taskId, "taskId");
        (0, validation_1.ensureNonEmptyString)(user, "user");
        return this.http.request({
            method: "POST",
            path: `/completion-messages/${taskId}/stop`,
            data: { user },
        });
    }
    stop(taskId, user) {
        return this.stopCompletionMessage(taskId, user);
    }
    runWorkflow(inputs, user, stream = false) {
        warnOnce("CompletionClient.runWorkflow is deprecated. Use WorkflowClient.run instead.");
        (0, validation_1.ensureNonEmptyString)(user, "user");
        const payload = {
            inputs,
            user,
            response_mode: stream ? "streaming" : "blocking",
        };
        if (stream) {
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
}
exports.CompletionClient = CompletionClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbXBsZXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQW9DO0FBR3BDLDZDQUFvRDtBQUVwRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0FBQ2pDLE1BQU0sUUFBUSxHQUFHLENBQUMsT0FBZSxFQUFRLEVBQUU7SUFDekMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDeEIsT0FBTztJQUNULENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRUYsTUFBYSxnQkFBaUIsU0FBUSxpQkFBVTtJQVU5Qyx1QkFBdUIsQ0FDckIsY0FBMkQsRUFDM0QsSUFBYSxFQUNiLE1BQU0sR0FBRyxLQUFLLEVBQ2QsS0FBNkM7UUFFN0MsSUFBSSxPQUEwQixDQUFDO1FBQy9CLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQztRQUUxQixJQUFJLElBQUksS0FBSyxTQUFTLElBQUksTUFBTSxJQUFLLGNBQW9DLEVBQUUsQ0FBQztZQUMxRSxPQUFPLEdBQUcsY0FBbUMsQ0FBQztZQUM5QyxZQUFZLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxXQUFXLENBQUM7UUFDdkQsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFBLGlDQUFvQixFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNuQyxPQUFPLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLGNBQXlDO2dCQUNqRCxJQUFJO2dCQUNKLEtBQUs7Z0JBQ0wsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVO2FBQ2pELENBQUM7UUFDSixDQUFDO1FBRUQsSUFBQSxpQ0FBb0IsRUFBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTNDLElBQUksWUFBWSxFQUFFLENBQUM7WUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBcUI7Z0JBQ2pELE1BQU0sRUFBRSxNQUFNO2dCQUNkLElBQUksRUFBRSxzQkFBc0I7Z0JBQzVCLElBQUksRUFBRSxPQUFPO2FBQ2QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQXFCO1lBQzNDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixJQUFJLEVBQUUsT0FBTztTQUNkLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxxQkFBcUIsQ0FDbkIsTUFBYyxFQUNkLElBQVk7UUFFWixJQUFBLGlDQUFvQixFQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2QyxJQUFBLGlDQUFvQixFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFxQjtZQUMzQyxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSx3QkFBd0IsTUFBTSxPQUFPO1lBQzNDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRTtTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJLENBQ0YsTUFBYyxFQUNkLElBQVk7UUFFWixPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELFdBQVcsQ0FDVCxNQUErQixFQUMvQixJQUFZLEVBQ1osTUFBTSxHQUFHLEtBQUs7UUFFZCxRQUFRLENBQ04sNkVBQTZFLENBQzlFLENBQUM7UUFDRixJQUFBLGlDQUFvQixFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBRztZQUNkLE1BQU07WUFDTixJQUFJO1lBQ0osYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVO1NBQ2pELENBQUM7UUFDRixJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBMEI7Z0JBQ3RELE1BQU0sRUFBRSxNQUFNO2dCQUNkLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLElBQUksRUFBRSxPQUFPO2FBQ2QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQTBCO1lBQ2hELE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixJQUFJLEVBQUUsT0FBTztTQUNkLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWhHRCw0Q0FnR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaWZ5Q2xpZW50IH0gZnJvbSBcIi4vYmFzZVwiO1xuaW1wb3J0IHR5cGUgeyBDb21wbGV0aW9uUmVxdWVzdCwgQ29tcGxldGlvblJlc3BvbnNlIH0gZnJvbSBcIi4uL3R5cGVzL2NvbXBsZXRpb25cIjtcbmltcG9ydCB0eXBlIHsgRGlmeVJlc3BvbnNlLCBEaWZ5U3RyZWFtIH0gZnJvbSBcIi4uL3R5cGVzL2NvbW1vblwiO1xuaW1wb3J0IHsgZW5zdXJlTm9uRW1wdHlTdHJpbmcgfSBmcm9tIFwiLi92YWxpZGF0aW9uXCI7XG5cbmNvbnN0IHdhcm5lZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuY29uc3Qgd2Fybk9uY2UgPSAobWVzc2FnZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gIGlmICh3YXJuZWQuaGFzKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHdhcm5lZC5hZGQobWVzc2FnZSk7XG4gIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbn07XG5cbmV4cG9ydCBjbGFzcyBDb21wbGV0aW9uQ2xpZW50IGV4dGVuZHMgRGlmeUNsaWVudCB7XG4gIGNyZWF0ZUNvbXBsZXRpb25NZXNzYWdlKFxuICAgIHJlcXVlc3Q6IENvbXBsZXRpb25SZXF1ZXN0XG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPENvbXBsZXRpb25SZXNwb25zZT4gfCBEaWZ5U3RyZWFtPENvbXBsZXRpb25SZXNwb25zZT4+O1xuICBjcmVhdGVDb21wbGV0aW9uTWVzc2FnZShcbiAgICBpbnB1dHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgIHVzZXI6IHN0cmluZyxcbiAgICBzdHJlYW0/OiBib29sZWFuLFxuICAgIGZpbGVzPzogQXJyYXk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHwgbnVsbFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxDb21wbGV0aW9uUmVzcG9uc2U+IHwgRGlmeVN0cmVhbTxDb21wbGV0aW9uUmVzcG9uc2U+PjtcbiAgY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2UoXG4gICAgaW5wdXRPclJlcXVlc3Q6IENvbXBsZXRpb25SZXF1ZXN0IHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgdXNlcj86IHN0cmluZyxcbiAgICBzdHJlYW0gPSBmYWxzZSxcbiAgICBmaWxlcz86IEFycmF5PFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB8IG51bGxcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8Q29tcGxldGlvblJlc3BvbnNlPiB8IERpZnlTdHJlYW08Q29tcGxldGlvblJlc3BvbnNlPj4ge1xuICAgIGxldCBwYXlsb2FkOiBDb21wbGV0aW9uUmVxdWVzdDtcbiAgICBsZXQgc2hvdWxkU3RyZWFtID0gc3RyZWFtO1xuXG4gICAgaWYgKHVzZXIgPT09IHVuZGVmaW5lZCAmJiBcInVzZXJcIiBpbiAoaW5wdXRPclJlcXVlc3QgYXMgQ29tcGxldGlvblJlcXVlc3QpKSB7XG4gICAgICBwYXlsb2FkID0gaW5wdXRPclJlcXVlc3QgYXMgQ29tcGxldGlvblJlcXVlc3Q7XG4gICAgICBzaG91bGRTdHJlYW0gPSBwYXlsb2FkLnJlc3BvbnNlX21vZGUgPT09IFwic3RyZWFtaW5nXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHVzZXIsIFwidXNlclwiKTtcbiAgICAgIHBheWxvYWQgPSB7XG4gICAgICAgIGlucHV0czogaW5wdXRPclJlcXVlc3QgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgICAgIHVzZXIsXG4gICAgICAgIGZpbGVzLFxuICAgICAgICByZXNwb25zZV9tb2RlOiBzdHJlYW0gPyBcInN0cmVhbWluZ1wiIDogXCJibG9ja2luZ1wiLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhwYXlsb2FkLnVzZXIsIFwidXNlclwiKTtcblxuICAgIGlmIChzaG91bGRTdHJlYW0pIHtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdFN0cmVhbTxDb21wbGV0aW9uUmVzcG9uc2U+KHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgcGF0aDogXCIvY29tcGxldGlvbi1tZXNzYWdlc1wiLFxuICAgICAgICBkYXRhOiBwYXlsb2FkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0PENvbXBsZXRpb25SZXNwb25zZT4oe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IFwiL2NvbXBsZXRpb24tbWVzc2FnZXNcIixcbiAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgfSk7XG4gIH1cblxuICBzdG9wQ29tcGxldGlvbk1lc3NhZ2UoXG4gICAgdGFza0lkOiBzdHJpbmcsXG4gICAgdXNlcjogc3RyaW5nXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPENvbXBsZXRpb25SZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyh0YXNrSWQsIFwidGFza0lkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHVzZXIsIFwidXNlclwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Q8Q29tcGxldGlvblJlc3BvbnNlPih7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogYC9jb21wbGV0aW9uLW1lc3NhZ2VzLyR7dGFza0lkfS9zdG9wYCxcbiAgICAgIGRhdGE6IHsgdXNlciB9LFxuICAgIH0pO1xuICB9XG5cbiAgc3RvcChcbiAgICB0YXNrSWQ6IHN0cmluZyxcbiAgICB1c2VyOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8Q29tcGxldGlvblJlc3BvbnNlPj4ge1xuICAgIHJldHVybiB0aGlzLnN0b3BDb21wbGV0aW9uTWVzc2FnZSh0YXNrSWQsIHVzZXIpO1xuICB9XG5cbiAgcnVuV29ya2Zsb3coXG4gICAgaW5wdXRzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICB1c2VyOiBzdHJpbmcsXG4gICAgc3RyZWFtID0gZmFsc2VcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHwgRGlmeVN0cmVhbTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4+IHtcbiAgICB3YXJuT25jZShcbiAgICAgIFwiQ29tcGxldGlvbkNsaWVudC5ydW5Xb3JrZmxvdyBpcyBkZXByZWNhdGVkLiBVc2UgV29ya2Zsb3dDbGllbnQucnVuIGluc3RlYWQuXCJcbiAgICApO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHVzZXIsIFwidXNlclwiKTtcbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgaW5wdXRzLFxuICAgICAgdXNlcixcbiAgICAgIHJlc3BvbnNlX21vZGU6IHN0cmVhbSA/IFwic3RyZWFtaW5nXCIgOiBcImJsb2NraW5nXCIsXG4gICAgfTtcbiAgICBpZiAoc3RyZWFtKSB7XG4gICAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3RTdHJlYW08UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgcGF0aDogXCIvd29ya2Zsb3dzL3J1blwiLFxuICAgICAgICBkYXRhOiBwYXlsb2FkLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdDxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IFwiL3dvcmtmbG93cy9ydW5cIixcbiAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==