"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ragPipelineNodesAction = void 0;
// Create the RAG pipeline nodes action
exports.ragPipelineNodesAction = {
    key: '@node',
    shortcut: '@node',
    title: 'Search RAG Pipeline Nodes',
    description: 'Find and jump to nodes in the current RAG pipeline by name or type',
    searchFn: undefined, // Will be set by useRagPipelineSearch hook
    search: async (_, searchTerm = '', _locale) => {
        try {
            // Use the searchFn if available (set by useRagPipelineSearch hook)
            if (exports.ragPipelineNodesAction.searchFn)
                return exports.ragPipelineNodesAction.searchFn(searchTerm);
            // If not in RAG pipeline context, return empty array
            return [];
        }
        catch (error) {
            console.warn('RAG pipeline nodes search failed:', error);
            return [];
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFnLXBpcGVsaW5lLW5vZGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmFnLXBpcGVsaW5lLW5vZGVzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSx1Q0FBdUM7QUFDMUIsUUFBQSxzQkFBc0IsR0FBZTtJQUNoRCxHQUFHLEVBQUUsT0FBTztJQUNaLFFBQVEsRUFBRSxPQUFPO0lBQ2pCLEtBQUssRUFBRSwyQkFBMkI7SUFDbEMsV0FBVyxFQUFFLG9FQUFvRTtJQUNqRixRQUFRLEVBQUUsU0FBUyxFQUFFLDJDQUEyQztJQUNoRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQzVDLElBQUksQ0FBQztZQUNILG1FQUFtRTtZQUNuRSxJQUFJLDhCQUFzQixDQUFDLFFBQVE7Z0JBQ2pDLE9BQU8sOEJBQXNCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBRXBELHFEQUFxRDtZQUNyRCxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN4RCxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7SUFDSCxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQWN0aW9uSXRlbSB9IGZyb20gJy4vdHlwZXMnXG5cbi8vIENyZWF0ZSB0aGUgUkFHIHBpcGVsaW5lIG5vZGVzIGFjdGlvblxuZXhwb3J0IGNvbnN0IHJhZ1BpcGVsaW5lTm9kZXNBY3Rpb246IEFjdGlvbkl0ZW0gPSB7XG4gIGtleTogJ0Bub2RlJyxcbiAgc2hvcnRjdXQ6ICdAbm9kZScsXG4gIHRpdGxlOiAnU2VhcmNoIFJBRyBQaXBlbGluZSBOb2RlcycsXG4gIGRlc2NyaXB0aW9uOiAnRmluZCBhbmQganVtcCB0byBub2RlcyBpbiB0aGUgY3VycmVudCBSQUcgcGlwZWxpbmUgYnkgbmFtZSBvciB0eXBlJyxcbiAgc2VhcmNoRm46IHVuZGVmaW5lZCwgLy8gV2lsbCBiZSBzZXQgYnkgdXNlUmFnUGlwZWxpbmVTZWFyY2ggaG9va1xuICBzZWFyY2g6IGFzeW5jIChfLCBzZWFyY2hUZXJtID0gJycsIF9sb2NhbGUpID0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gVXNlIHRoZSBzZWFyY2hGbiBpZiBhdmFpbGFibGUgKHNldCBieSB1c2VSYWdQaXBlbGluZVNlYXJjaCBob29rKVxuICAgICAgaWYgKHJhZ1BpcGVsaW5lTm9kZXNBY3Rpb24uc2VhcmNoRm4pXG4gICAgICAgIHJldHVybiByYWdQaXBlbGluZU5vZGVzQWN0aW9uLnNlYXJjaEZuKHNlYXJjaFRlcm0pXG5cbiAgICAgIC8vIElmIG5vdCBpbiBSQUcgcGlwZWxpbmUgY29udGV4dCwgcmV0dXJuIGVtcHR5IGFycmF5XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1JBRyBwaXBlbGluZSBub2RlcyBzZWFyY2ggZmFpbGVkOicsIGVycm9yKVxuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9LFxufVxuIl19