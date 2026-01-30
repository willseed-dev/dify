"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReset = exports.useInvalid = void 0;
const react_query_1 = require("@tanstack/react-query");
const useInvalid = (key) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return () => {
        if (!key)
            return;
        queryClient.invalidateQueries({
            queryKey: key,
        });
    };
};
exports.useInvalid = useInvalid;
const useReset = (key) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return () => {
        if (!key)
            return;
        queryClient.resetQueries({
            queryKey: key,
        });
    };
};
exports.useReset = useReset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1REFHOEI7QUFFdkIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFjLEVBQUUsRUFBRTtJQUMzQyxNQUFNLFdBQVcsR0FBRyxJQUFBLDRCQUFjLEdBQUUsQ0FBQTtJQUNwQyxPQUFPLEdBQUcsRUFBRTtRQUNWLElBQUksQ0FBQyxHQUFHO1lBQ04sT0FBTTtRQUNSLFdBQVcsQ0FBQyxpQkFBaUIsQ0FDM0I7WUFDRSxRQUFRLEVBQUUsR0FBRztTQUNkLENBQ0YsQ0FBQTtJQUNILENBQUMsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQVhZLFFBQUEsVUFBVSxjQVd0QjtBQUVNLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBYyxFQUFFLEVBQUU7SUFDekMsTUFBTSxXQUFXLEdBQUcsSUFBQSw0QkFBYyxHQUFFLENBQUE7SUFDcEMsT0FBTyxHQUFHLEVBQUU7UUFDVixJQUFJLENBQUMsR0FBRztZQUNOLE9BQU07UUFDUixXQUFXLENBQUMsWUFBWSxDQUN0QjtZQUNFLFFBQVEsRUFBRSxHQUFHO1NBQ2QsQ0FDRixDQUFBO0lBQ0gsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBWFksUUFBQSxRQUFRLFlBV3BCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBRdWVyeUtleSB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7XG5cbiAgdXNlUXVlcnlDbGllbnQsXG59IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcblxuZXhwb3J0IGNvbnN0IHVzZUludmFsaWQgPSAoa2V5PzogUXVlcnlLZXkpID0+IHtcbiAgY29uc3QgcXVlcnlDbGllbnQgPSB1c2VRdWVyeUNsaWVudCgpXG4gIHJldHVybiAoKSA9PiB7XG4gICAgaWYgKCFrZXkpXG4gICAgICByZXR1cm5cbiAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyhcbiAgICAgIHtcbiAgICAgICAgcXVlcnlLZXk6IGtleSxcbiAgICAgIH0sXG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VSZXNldCA9IChrZXk/OiBRdWVyeUtleSkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuICgpID0+IHtcbiAgICBpZiAoIWtleSlcbiAgICAgIHJldHVyblxuICAgIHF1ZXJ5Q2xpZW50LnJlc2V0UXVlcmllcyhcbiAgICAgIHtcbiAgICAgICAgcXVlcnlLZXk6IGtleSxcbiAgICAgIH0sXG4gICAgKVxuICB9XG59XG4iXX0=