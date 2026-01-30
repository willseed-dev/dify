"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryClientServer = void 0;
exports.makeQueryClient = makeQueryClient;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const STALE_TIME = 1000 * 60 * 30; // 30 minutes
function makeQueryClient() {
    return new react_query_1.QueryClient({
        defaultOptions: {
            queries: {
                staleTime: STALE_TIME,
            },
        },
    });
}
exports.getQueryClientServer = (0, react_1.cache)(makeQueryClient);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktY2xpZW50LXNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInF1ZXJ5LWNsaWVudC1zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0EsMENBUUM7QUFiRCx1REFBbUQ7QUFDbkQsaUNBQTZCO0FBRTdCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLENBQUMsYUFBYTtBQUUvQyxTQUFnQixlQUFlO0lBQzdCLE9BQU8sSUFBSSx5QkFBVyxDQUFDO1FBQ3JCLGNBQWMsRUFBRTtZQUNkLE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUUsVUFBVTthQUN0QjtTQUNGO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVZLFFBQUEsb0JBQW9CLEdBQUcsSUFBQSxhQUFLLEVBQUMsZUFBZSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBRdWVyeUNsaWVudCB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGNhY2hlIH0gZnJvbSAncmVhY3QnXG5cbmNvbnN0IFNUQUxFX1RJTUUgPSAxMDAwICogNjAgKiAzMCAvLyAzMCBtaW51dGVzXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUXVlcnlDbGllbnQoKSB7XG4gIHJldHVybiBuZXcgUXVlcnlDbGllbnQoe1xuICAgIGRlZmF1bHRPcHRpb25zOiB7XG4gICAgICBxdWVyaWVzOiB7XG4gICAgICAgIHN0YWxlVGltZTogU1RBTEVfVElNRSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGdldFF1ZXJ5Q2xpZW50U2VydmVyID0gY2FjaGUobWFrZVF1ZXJ5Q2xpZW50KVxuIl19