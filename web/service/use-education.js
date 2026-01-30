"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvalidateEducationStatus = exports.useEducationStatus = exports.useEducationAutocomplete = exports.useEducationAdd = exports.useEducationVerify = void 0;
const react_query_1 = require("@tanstack/react-query");
const base_1 = require("./base");
const use_base_1 = require("./use-base");
const NAME_SPACE = 'education';
const useEducationVerify = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'education-verify'],
        mutationFn: () => {
            return (0, base_1.get)('/account/education/verify', {}, { silent: true });
        },
    });
};
exports.useEducationVerify = useEducationVerify;
const useEducationAdd = ({ onSuccess, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'education-add'],
        mutationFn: (params) => {
            return (0, base_1.post)('/account/education', {
                body: params,
            });
        },
        onSuccess,
    });
};
exports.useEducationAdd = useEducationAdd;
const useEducationAutocomplete = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: (searchParams) => {
            const { keywords = '', page = 0, limit = 40, } = searchParams;
            return (0, base_1.get)(`/account/education/autocomplete?keywords=${keywords}&page=${page}&limit=${limit}`);
        },
    });
};
exports.useEducationAutocomplete = useEducationAutocomplete;
const useEducationStatus = (disable) => {
    return (0, react_query_1.useQuery)({
        enabled: !disable,
        queryKey: [NAME_SPACE, 'education-status'],
        queryFn: () => {
            return (0, base_1.get)('/account/education');
        },
        retry: false,
        staleTime: 0, // Data expires immediately, ensuring fresh data on refetch
    });
};
exports.useEducationStatus = useEducationStatus;
const useInvalidateEducationStatus = () => {
    return (0, use_base_1.useInvalid)([NAME_SPACE, 'education-status']);
};
exports.useInvalidateEducationStatus = useInvalidateEducationStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWVkdWNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1lZHVjYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsdURBRzhCO0FBQzlCLGlDQUFrQztBQUNsQyx5Q0FBdUM7QUFFdkMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFBO0FBRXZCLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxFQUFFO0lBQ3JDLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFdBQVcsRUFBRSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQztRQUM3QyxVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQ2YsT0FBTyxJQUFBLFVBQUcsRUFBb0IsMkJBQTJCLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFDbEYsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVBZLFFBQUEsa0JBQWtCLHNCQU85QjtBQUVNLE1BQU0sZUFBZSxHQUFHLENBQUMsRUFDOUIsU0FBUyxHQUdWLEVBQUUsRUFBRTtJQUNILE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFdBQVcsRUFBRSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUM7UUFDMUMsVUFBVSxFQUFFLENBQUMsTUFBMEIsRUFBRSxFQUFFO1lBQ3pDLE9BQU8sSUFBQSxXQUFJLEVBQXNCLG9CQUFvQixFQUFFO2dCQUNyRCxJQUFJLEVBQUUsTUFBTTthQUNiLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxTQUFTO0tBQ1YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBZFksUUFBQSxlQUFlLG1CQWMzQjtBQU9NLE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxFQUFFO0lBQzNDLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFVBQVUsRUFBRSxDQUFDLFlBQTBCLEVBQUUsRUFBRTtZQUN6QyxNQUFNLEVBQ0osUUFBUSxHQUFHLEVBQUUsRUFDYixJQUFJLEdBQUcsQ0FBQyxFQUNSLEtBQUssR0FBRyxFQUFFLEdBQ1gsR0FBRyxZQUFZLENBQUE7WUFDaEIsT0FBTyxJQUFBLFVBQUcsRUFBMkQsNENBQTRDLFFBQVEsU0FBUyxJQUFJLFVBQVUsS0FBSyxFQUFFLENBQUMsQ0FBQTtRQUMxSixDQUFDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBWFksUUFBQSx3QkFBd0IsNEJBV3BDO0FBRU0sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE9BQWlCLEVBQUUsRUFBRTtJQUN0RCxPQUFPLElBQUEsc0JBQVEsRUFBQztRQUNkLE9BQU8sRUFBRSxDQUFDLE9BQU87UUFDakIsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDO1FBQzFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDWixPQUFPLElBQUEsVUFBRyxFQUE0RSxvQkFBb0IsQ0FBQyxDQUFBO1FBQzdHLENBQUM7UUFDRCxLQUFLLEVBQUUsS0FBSztRQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUUsMkRBQTJEO0tBQzFFLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVZZLFFBQUEsa0JBQWtCLHNCQVU5QjtBQUVNLE1BQU0sNEJBQTRCLEdBQUcsR0FBRyxFQUFFO0lBQy9DLE9BQU8sSUFBQSxxQkFBVSxFQUFDLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtBQUNyRCxDQUFDLENBQUE7QUFGWSxRQUFBLDRCQUE0QixnQ0FFeEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEVkdWNhdGlvbkFkZFBhcmFtcyB9IGZyb20gJ0AvYXBwL2VkdWNhdGlvbi1hcHBseS90eXBlcydcbmltcG9ydCB7XG4gIHVzZU11dGF0aW9uLFxuICB1c2VRdWVyeSxcbn0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgZ2V0LCBwb3N0IH0gZnJvbSAnLi9iYXNlJ1xuaW1wb3J0IHsgdXNlSW52YWxpZCB9IGZyb20gJy4vdXNlLWJhc2UnXG5cbmNvbnN0IE5BTUVfU1BBQ0UgPSAnZWR1Y2F0aW9uJ1xuXG5leHBvcnQgY29uc3QgdXNlRWR1Y2F0aW9uVmVyaWZ5ID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ2VkdWNhdGlvbi12ZXJpZnknXSxcbiAgICBtdXRhdGlvbkZuOiAoKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0PHsgdG9rZW46IHN0cmluZyB9PignL2FjY291bnQvZWR1Y2F0aW9uL3ZlcmlmeScsIHt9LCB7IHNpbGVudDogdHJ1ZSB9KVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VFZHVjYXRpb25BZGQgPSAoe1xuICBvblN1Y2Nlc3MsXG59OiB7XG4gIG9uU3VjY2Vzcz86ICgpID0+IHZvaWRcbn0pID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdlZHVjYXRpb24tYWRkJ10sXG4gICAgbXV0YXRpb25GbjogKHBhcmFtczogRWR1Y2F0aW9uQWRkUGFyYW1zKSA9PiB7XG4gICAgICByZXR1cm4gcG9zdDx7IG1lc3NhZ2U6IHN0cmluZyB9PignL2FjY291bnQvZWR1Y2F0aW9uJywge1xuICAgICAgICBib2R5OiBwYXJhbXMsXG4gICAgICB9KVxuICAgIH0sXG4gICAgb25TdWNjZXNzLFxuICB9KVxufVxuXG50eXBlIFNlYXJjaFBhcmFtcyA9IHtcbiAga2V5d29yZHM/OiBzdHJpbmdcbiAgcGFnZT86IG51bWJlclxuICBsaW1pdD86IG51bWJlclxufVxuZXhwb3J0IGNvbnN0IHVzZUVkdWNhdGlvbkF1dG9jb21wbGV0ZSA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbkZuOiAoc2VhcmNoUGFyYW1zOiBTZWFyY2hQYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAga2V5d29yZHMgPSAnJyxcbiAgICAgICAgcGFnZSA9IDAsXG4gICAgICAgIGxpbWl0ID0gNDAsXG4gICAgICB9ID0gc2VhcmNoUGFyYW1zXG4gICAgICByZXR1cm4gZ2V0PHsgZGF0YTogc3RyaW5nW10sIGhhc19uZXh0OiBib29sZWFuLCBjdXJyX3BhZ2U6IG51bWJlciB9PihgL2FjY291bnQvZWR1Y2F0aW9uL2F1dG9jb21wbGV0ZT9rZXl3b3Jkcz0ke2tleXdvcmRzfSZwYWdlPSR7cGFnZX0mbGltaXQ9JHtsaW1pdH1gKVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VFZHVjYXRpb25TdGF0dXMgPSAoZGlzYWJsZT86IGJvb2xlYW4pID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5KHtcbiAgICBlbmFibGVkOiAhZGlzYWJsZSxcbiAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdlZHVjYXRpb24tc3RhdHVzJ10sXG4gICAgcXVlcnlGbjogKCkgPT4ge1xuICAgICAgcmV0dXJuIGdldDx7IGlzX3N0dWRlbnQ6IGJvb2xlYW4sIGFsbG93X3JlZnJlc2g6IGJvb2xlYW4sIGV4cGlyZV9hdDogbnVtYmVyIHwgbnVsbCB9PignL2FjY291bnQvZWR1Y2F0aW9uJylcbiAgICB9LFxuICAgIHJldHJ5OiBmYWxzZSxcbiAgICBzdGFsZVRpbWU6IDAsIC8vIERhdGEgZXhwaXJlcyBpbW1lZGlhdGVseSwgZW5zdXJpbmcgZnJlc2ggZGF0YSBvbiByZWZldGNoXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbnZhbGlkYXRlRWR1Y2F0aW9uU3RhdHVzID0gKCkgPT4ge1xuICByZXR1cm4gdXNlSW52YWxpZChbTkFNRV9TUEFDRSwgJ2VkdWNhdGlvbi1zdGF0dXMnXSlcbn1cbiJdfQ==