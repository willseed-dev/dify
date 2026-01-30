"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowNodesAction = void 0;
// Create the workflow nodes action
exports.workflowNodesAction = {
    key: '@node',
    shortcut: '@node',
    title: 'Search Workflow Nodes',
    description: 'Find and jump to nodes in the current workflow by name or type',
    searchFn: undefined, // Will be set by useWorkflowSearch hook
    search: async (_, searchTerm = '', _locale) => {
        try {
            // Use the searchFn if available (set by useWorkflowSearch hook)
            if (exports.workflowNodesAction.searchFn)
                return exports.workflowNodesAction.searchFn(searchTerm);
            // If not in workflow context, return empty array
            return [];
        }
        catch (error) {
            console.warn('Workflow nodes search failed:', error);
            return [];
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3ctbm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3b3JrZmxvdy1ub2Rlcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbUNBQW1DO0FBQ3RCLFFBQUEsbUJBQW1CLEdBQWU7SUFDN0MsR0FBRyxFQUFFLE9BQU87SUFDWixRQUFRLEVBQUUsT0FBTztJQUNqQixLQUFLLEVBQUUsdUJBQXVCO0lBQzlCLFdBQVcsRUFBRSxnRUFBZ0U7SUFDN0UsUUFBUSxFQUFFLFNBQVMsRUFBRSx3Q0FBd0M7SUFDN0QsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUM1QyxJQUFJLENBQUM7WUFDSCxnRUFBZ0U7WUFDaEUsSUFBSSwyQkFBbUIsQ0FBQyxRQUFRO2dCQUM5QixPQUFPLDJCQUFtQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUVqRCxpREFBaUQ7WUFDakQsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO1FBQ0QsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0JBQStCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDcEQsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO0lBQ0gsQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFjdGlvbkl0ZW0gfSBmcm9tICcuL3R5cGVzJ1xuXG4vLyBDcmVhdGUgdGhlIHdvcmtmbG93IG5vZGVzIGFjdGlvblxuZXhwb3J0IGNvbnN0IHdvcmtmbG93Tm9kZXNBY3Rpb246IEFjdGlvbkl0ZW0gPSB7XG4gIGtleTogJ0Bub2RlJyxcbiAgc2hvcnRjdXQ6ICdAbm9kZScsXG4gIHRpdGxlOiAnU2VhcmNoIFdvcmtmbG93IE5vZGVzJyxcbiAgZGVzY3JpcHRpb246ICdGaW5kIGFuZCBqdW1wIHRvIG5vZGVzIGluIHRoZSBjdXJyZW50IHdvcmtmbG93IGJ5IG5hbWUgb3IgdHlwZScsXG4gIHNlYXJjaEZuOiB1bmRlZmluZWQsIC8vIFdpbGwgYmUgc2V0IGJ5IHVzZVdvcmtmbG93U2VhcmNoIGhvb2tcbiAgc2VhcmNoOiBhc3luYyAoXywgc2VhcmNoVGVybSA9ICcnLCBfbG9jYWxlKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFVzZSB0aGUgc2VhcmNoRm4gaWYgYXZhaWxhYmxlIChzZXQgYnkgdXNlV29ya2Zsb3dTZWFyY2ggaG9vaylcbiAgICAgIGlmICh3b3JrZmxvd05vZGVzQWN0aW9uLnNlYXJjaEZuKVxuICAgICAgICByZXR1cm4gd29ya2Zsb3dOb2Rlc0FjdGlvbi5zZWFyY2hGbihzZWFyY2hUZXJtKVxuXG4gICAgICAvLyBJZiBub3QgaW4gd29ya2Zsb3cgY29udGV4dCwgcmV0dXJuIGVtcHR5IGFycmF5XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1dvcmtmbG93IG5vZGVzIHNlYXJjaCBmYWlsZWQ6JywgZXJyb3IpXG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH0sXG59XG4iXX0=