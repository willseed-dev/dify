"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = exports.WorkspaceClient = exports.KnowledgeBaseClient = exports.WorkflowClient = exports.CompletionClient = exports.ChatClient = exports.DifyClient = exports.routes = exports.BASE_URL = void 0;
const common_1 = require("./types/common");
exports.BASE_URL = common_1.DEFAULT_BASE_URL;
exports.routes = {
    feedback: {
        method: "POST",
        url: (messageId) => `/messages/${messageId}/feedbacks`,
    },
    application: {
        method: "GET",
        url: () => "/parameters",
    },
    fileUpload: {
        method: "POST",
        url: () => "/files/upload",
    },
    filePreview: {
        method: "GET",
        url: (fileId) => `/files/${fileId}/preview`,
    },
    textToAudio: {
        method: "POST",
        url: () => "/text-to-audio",
    },
    audioToText: {
        method: "POST",
        url: () => "/audio-to-text",
    },
    getMeta: {
        method: "GET",
        url: () => "/meta",
    },
    getInfo: {
        method: "GET",
        url: () => "/info",
    },
    getSite: {
        method: "GET",
        url: () => "/site",
    },
    createCompletionMessage: {
        method: "POST",
        url: () => "/completion-messages",
    },
    stopCompletionMessage: {
        method: "POST",
        url: (taskId) => `/completion-messages/${taskId}/stop`,
    },
    createChatMessage: {
        method: "POST",
        url: () => "/chat-messages",
    },
    getSuggested: {
        method: "GET",
        url: (messageId) => `/messages/${messageId}/suggested`,
    },
    stopChatMessage: {
        method: "POST",
        url: (taskId) => `/chat-messages/${taskId}/stop`,
    },
    getConversations: {
        method: "GET",
        url: () => "/conversations",
    },
    getConversationMessages: {
        method: "GET",
        url: () => "/messages",
    },
    renameConversation: {
        method: "POST",
        url: (conversationId) => `/conversations/${conversationId}/name`,
    },
    deleteConversation: {
        method: "DELETE",
        url: (conversationId) => `/conversations/${conversationId}`,
    },
    runWorkflow: {
        method: "POST",
        url: () => "/workflows/run",
    },
    stopWorkflow: {
        method: "POST",
        url: (taskId) => `/workflows/tasks/${taskId}/stop`,
    },
};
var base_1 = require("./client/base");
Object.defineProperty(exports, "DifyClient", { enumerable: true, get: function () { return base_1.DifyClient; } });
var chat_1 = require("./client/chat");
Object.defineProperty(exports, "ChatClient", { enumerable: true, get: function () { return chat_1.ChatClient; } });
var completion_1 = require("./client/completion");
Object.defineProperty(exports, "CompletionClient", { enumerable: true, get: function () { return completion_1.CompletionClient; } });
var workflow_1 = require("./client/workflow");
Object.defineProperty(exports, "WorkflowClient", { enumerable: true, get: function () { return workflow_1.WorkflowClient; } });
var knowledge_base_1 = require("./client/knowledge-base");
Object.defineProperty(exports, "KnowledgeBaseClient", { enumerable: true, get: function () { return knowledge_base_1.KnowledgeBaseClient; } });
var workspace_1 = require("./client/workspace");
Object.defineProperty(exports, "WorkspaceClient", { enumerable: true, get: function () { return workspace_1.WorkspaceClient; } });
__exportStar(require("./errors/dify-error"), exports);
__exportStar(require("./types/common"), exports);
__exportStar(require("./types/annotation"), exports);
__exportStar(require("./types/chat"), exports);
__exportStar(require("./types/completion"), exports);
__exportStar(require("./types/knowledge-base"), exports);
__exportStar(require("./types/workflow"), exports);
__exportStar(require("./types/workspace"), exports);
var client_1 = require("./http/client");
Object.defineProperty(exports, "HttpClient", { enumerable: true, get: function () { return client_1.HttpClient; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUFrRDtBQUVyQyxRQUFBLFFBQVEsR0FBRyx5QkFBZ0IsQ0FBQztBQUU1QixRQUFBLE1BQU0sR0FBRztJQUNwQixRQUFRLEVBQUU7UUFDUixNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxDQUFDLFNBQWlCLEVBQUUsRUFBRSxDQUFDLGFBQWEsU0FBUyxZQUFZO0tBQy9EO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsTUFBTSxFQUFFLEtBQUs7UUFDYixHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYTtLQUN6QjtJQUNELFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxNQUFNO1FBQ2QsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLGVBQWU7S0FDM0I7SUFDRCxXQUFXLEVBQUU7UUFDWCxNQUFNLEVBQUUsS0FBSztRQUNiLEdBQUcsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsVUFBVSxNQUFNLFVBQVU7S0FDcEQ7SUFDRCxXQUFXLEVBQUU7UUFDWCxNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0I7S0FDNUI7SUFDRCxXQUFXLEVBQUU7UUFDWCxNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0I7S0FDNUI7SUFDRCxPQUFPLEVBQUU7UUFDUCxNQUFNLEVBQUUsS0FBSztRQUNiLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPO0tBQ25CO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsTUFBTSxFQUFFLEtBQUs7UUFDYixHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTztLQUNuQjtJQUNELE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxLQUFLO1FBQ2IsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU87S0FDbkI7SUFDRCx1QkFBdUIsRUFBRTtRQUN2QixNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxzQkFBc0I7S0FDbEM7SUFDRCxxQkFBcUIsRUFBRTtRQUNyQixNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsd0JBQXdCLE1BQU0sT0FBTztLQUMvRDtJQUNELGlCQUFpQixFQUFFO1FBQ2pCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQjtLQUM1QjtJQUNELFlBQVksRUFBRTtRQUNaLE1BQU0sRUFBRSxLQUFLO1FBQ2IsR0FBRyxFQUFFLENBQUMsU0FBaUIsRUFBRSxFQUFFLENBQUMsYUFBYSxTQUFTLFlBQVk7S0FDL0Q7SUFDRCxlQUFlLEVBQUU7UUFDZixNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLE1BQU0sT0FBTztLQUN6RDtJQUNELGdCQUFnQixFQUFFO1FBQ2hCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQjtLQUM1QjtJQUNELHVCQUF1QixFQUFFO1FBQ3ZCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVc7S0FDdkI7SUFDRCxrQkFBa0IsRUFBRTtRQUNsQixNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxDQUFDLGNBQXNCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixjQUFjLE9BQU87S0FDekU7SUFDRCxrQkFBa0IsRUFBRTtRQUNsQixNQUFNLEVBQUUsUUFBUTtRQUNoQixHQUFHLEVBQUUsQ0FBQyxjQUFzQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsY0FBYyxFQUFFO0tBQ3BFO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsTUFBTSxFQUFFLE1BQU07UUFDZCxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCO0tBQzVCO0lBQ0QsWUFBWSxFQUFFO1FBQ1osTUFBTSxFQUFFLE1BQU07UUFDZCxHQUFHLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLG9CQUFvQixNQUFNLE9BQU87S0FDM0Q7Q0FDRixDQUFDO0FBRUYsc0NBQTJDO0FBQWxDLGtHQUFBLFVBQVUsT0FBQTtBQUNuQixzQ0FBMkM7QUFBbEMsa0dBQUEsVUFBVSxPQUFBO0FBQ25CLGtEQUF1RDtBQUE5Qyw4R0FBQSxnQkFBZ0IsT0FBQTtBQUN6Qiw4Q0FBbUQ7QUFBMUMsMEdBQUEsY0FBYyxPQUFBO0FBQ3ZCLDBEQUE4RDtBQUFyRCxxSEFBQSxtQkFBbUIsT0FBQTtBQUM1QixnREFBcUQ7QUFBNUMsNEdBQUEsZUFBZSxPQUFBO0FBRXhCLHNEQUFvQztBQUNwQyxpREFBK0I7QUFDL0IscURBQW1DO0FBQ25DLCtDQUE2QjtBQUM3QixxREFBbUM7QUFDbkMseURBQXVDO0FBQ3ZDLG1EQUFpQztBQUNqQyxvREFBa0M7QUFDbEMsd0NBQTJDO0FBQWxDLG9HQUFBLFVBQVUsT0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERFRkFVTFRfQkFTRV9VUkwgfSBmcm9tIFwiLi90eXBlcy9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IEJBU0VfVVJMID0gREVGQVVMVF9CQVNFX1VSTDtcblxuZXhwb3J0IGNvbnN0IHJvdXRlcyA9IHtcbiAgZmVlZGJhY2s6IHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHVybDogKG1lc3NhZ2VJZDogc3RyaW5nKSA9PiBgL21lc3NhZ2VzLyR7bWVzc2FnZUlkfS9mZWVkYmFja3NgLFxuICB9LFxuICBhcHBsaWNhdGlvbjoge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6ICgpID0+IFwiL3BhcmFtZXRlcnNcIixcbiAgfSxcbiAgZmlsZVVwbG9hZDoge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgdXJsOiAoKSA9PiBcIi9maWxlcy91cGxvYWRcIixcbiAgfSxcbiAgZmlsZVByZXZpZXc6IHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOiAoZmlsZUlkOiBzdHJpbmcpID0+IGAvZmlsZXMvJHtmaWxlSWR9L3ByZXZpZXdgLFxuICB9LFxuICB0ZXh0VG9BdWRpbzoge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgdXJsOiAoKSA9PiBcIi90ZXh0LXRvLWF1ZGlvXCIsXG4gIH0sXG4gIGF1ZGlvVG9UZXh0OiB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICB1cmw6ICgpID0+IFwiL2F1ZGlvLXRvLXRleHRcIixcbiAgfSxcbiAgZ2V0TWV0YToge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6ICgpID0+IFwiL21ldGFcIixcbiAgfSxcbiAgZ2V0SW5mbzoge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6ICgpID0+IFwiL2luZm9cIixcbiAgfSxcbiAgZ2V0U2l0ZToge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6ICgpID0+IFwiL3NpdGVcIixcbiAgfSxcbiAgY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2U6IHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHVybDogKCkgPT4gXCIvY29tcGxldGlvbi1tZXNzYWdlc1wiLFxuICB9LFxuICBzdG9wQ29tcGxldGlvbk1lc3NhZ2U6IHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHVybDogKHRhc2tJZDogc3RyaW5nKSA9PiBgL2NvbXBsZXRpb24tbWVzc2FnZXMvJHt0YXNrSWR9L3N0b3BgLFxuICB9LFxuICBjcmVhdGVDaGF0TWVzc2FnZToge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgdXJsOiAoKSA9PiBcIi9jaGF0LW1lc3NhZ2VzXCIsXG4gIH0sXG4gIGdldFN1Z2dlc3RlZDoge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6IChtZXNzYWdlSWQ6IHN0cmluZykgPT4gYC9tZXNzYWdlcy8ke21lc3NhZ2VJZH0vc3VnZ2VzdGVkYCxcbiAgfSxcbiAgc3RvcENoYXRNZXNzYWdlOiB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICB1cmw6ICh0YXNrSWQ6IHN0cmluZykgPT4gYC9jaGF0LW1lc3NhZ2VzLyR7dGFza0lkfS9zdG9wYCxcbiAgfSxcbiAgZ2V0Q29udmVyc2F0aW9uczoge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6ICgpID0+IFwiL2NvbnZlcnNhdGlvbnNcIixcbiAgfSxcbiAgZ2V0Q29udmVyc2F0aW9uTWVzc2FnZXM6IHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOiAoKSA9PiBcIi9tZXNzYWdlc1wiLFxuICB9LFxuICByZW5hbWVDb252ZXJzYXRpb246IHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHVybDogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IGAvY29udmVyc2F0aW9ucy8ke2NvbnZlcnNhdGlvbklkfS9uYW1lYCxcbiAgfSxcbiAgZGVsZXRlQ29udmVyc2F0aW9uOiB7XG4gICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgIHVybDogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IGAvY29udmVyc2F0aW9ucy8ke2NvbnZlcnNhdGlvbklkfWAsXG4gIH0sXG4gIHJ1bldvcmtmbG93OiB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICB1cmw6ICgpID0+IFwiL3dvcmtmbG93cy9ydW5cIixcbiAgfSxcbiAgc3RvcFdvcmtmbG93OiB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICB1cmw6ICh0YXNrSWQ6IHN0cmluZykgPT4gYC93b3JrZmxvd3MvdGFza3MvJHt0YXNrSWR9L3N0b3BgLFxuICB9LFxufTtcblxuZXhwb3J0IHsgRGlmeUNsaWVudCB9IGZyb20gXCIuL2NsaWVudC9iYXNlXCI7XG5leHBvcnQgeyBDaGF0Q2xpZW50IH0gZnJvbSBcIi4vY2xpZW50L2NoYXRcIjtcbmV4cG9ydCB7IENvbXBsZXRpb25DbGllbnQgfSBmcm9tIFwiLi9jbGllbnQvY29tcGxldGlvblwiO1xuZXhwb3J0IHsgV29ya2Zsb3dDbGllbnQgfSBmcm9tIFwiLi9jbGllbnQvd29ya2Zsb3dcIjtcbmV4cG9ydCB7IEtub3dsZWRnZUJhc2VDbGllbnQgfSBmcm9tIFwiLi9jbGllbnQva25vd2xlZGdlLWJhc2VcIjtcbmV4cG9ydCB7IFdvcmtzcGFjZUNsaWVudCB9IGZyb20gXCIuL2NsaWVudC93b3Jrc3BhY2VcIjtcblxuZXhwb3J0ICogZnJvbSBcIi4vZXJyb3JzL2RpZnktZXJyb3JcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3R5cGVzL2NvbW1vblwiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHlwZXMvYW5ub3RhdGlvblwiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHlwZXMvY2hhdFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHlwZXMvY29tcGxldGlvblwiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHlwZXMva25vd2xlZGdlLWJhc2VcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3R5cGVzL3dvcmtmbG93XCI7XG5leHBvcnQgKiBmcm9tIFwiLi90eXBlcy93b3Jrc3BhY2VcIjtcbmV4cG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tIFwiLi9odHRwL2NsaWVudFwiO1xuIl19