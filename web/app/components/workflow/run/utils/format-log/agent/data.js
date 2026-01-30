"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiStepsCircle = exports.oneStepCircle = exports.agentNodeData = void 0;
const types_1 = require("@/app/components/workflow/types");
exports.agentNodeData = (() => {
    const node = {
        node_type: types_1.BlockEnum.Agent,
        execution_metadata: {
            agent_log: [
                { id: '1', label: 'Root 1' },
                { id: '2', parent_id: '1', label: 'Child 1.2' },
                { id: '3', parent_id: '1', label: 'Child 1.3' },
                { id: '4', parent_id: '2', label: 'Child 2.4' },
                { id: '5', parent_id: '2', label: 'Child 2.5' },
                { id: '6', parent_id: '3', label: 'Child 3.6' },
                { id: '7', parent_id: '4', label: 'Child 4.7' },
                { id: '8', parent_id: '4', label: 'Child 4.8' },
                { id: '9', parent_id: '5', label: 'Child 5.9' },
                { id: '10', parent_id: '5', label: 'Child 5.10' },
                { id: '11', parent_id: '7', label: 'Child 7.11' },
                { id: '12', parent_id: '7', label: 'Child 7.12' },
                { id: '13', parent_id: '9', label: 'Child 9.13' },
                { id: '14', parent_id: '9', label: 'Child 9.14' },
                { id: '15', parent_id: '9', label: 'Child 9.15' },
            ],
        },
    };
    return {
        in: [node],
        expect: [{
                ...node,
                agentLog: [
                    {
                        id: '1',
                        label: 'Root 1',
                        children: [
                            {
                                id: '2',
                                parent_id: '1',
                                label: 'Child 1.2',
                                children: [
                                    {
                                        id: '4',
                                        parent_id: '2',
                                        label: 'Child 2.4',
                                        children: [
                                            {
                                                id: '7',
                                                parent_id: '4',
                                                label: 'Child 4.7',
                                                children: [
                                                    { id: '11', parent_id: '7', label: 'Child 7.11' },
                                                    { id: '12', parent_id: '7', label: 'Child 7.12' },
                                                ],
                                            },
                                            { id: '8', parent_id: '4', label: 'Child 4.8' },
                                        ],
                                    },
                                    {
                                        id: '5',
                                        parent_id: '2',
                                        label: 'Child 2.5',
                                        children: [
                                            {
                                                id: '9',
                                                parent_id: '5',
                                                label: 'Child 5.9',
                                                children: [
                                                    { id: '13', parent_id: '9', label: 'Child 9.13' },
                                                    { id: '14', parent_id: '9', label: 'Child 9.14' },
                                                    { id: '15', parent_id: '9', label: 'Child 9.15' },
                                                ],
                                            },
                                            { id: '10', parent_id: '5', label: 'Child 5.10' },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: '3',
                                parent_id: '1',
                                label: 'Child 1.3',
                                children: [
                                    { id: '6', parent_id: '3', label: 'Child 3.6' },
                                ],
                            },
                        ],
                    },
                ],
            }],
    };
})();
exports.oneStepCircle = (() => {
    const node = {
        node_type: types_1.BlockEnum.Agent,
        execution_metadata: {
            agent_log: [
                { id: '1', label: 'Node 1' },
                { id: '1', parent_id: '1', label: 'Node 1' },
                { id: '1', parent_id: '1', label: 'Node 1' },
                { id: '1', parent_id: '1', label: 'Node 1' },
                { id: '1', parent_id: '1', label: 'Node 1' },
                { id: '1', parent_id: '1', label: 'Node 1' },
            ],
        },
    };
    return {
        in: [node],
        expect: [{
                ...node,
                agentLog: [
                    {
                        id: '1',
                        label: 'Node 1',
                        hasCircle: true,
                        children: [],
                    },
                ],
            }],
    };
})();
exports.multiStepsCircle = (() => {
    const node = {
        node_type: types_1.BlockEnum.Agent,
        execution_metadata: {
            agent_log: [
                // 1 -> [2 -> 4 -> 1, 3]
                { id: '1', label: 'Node 1' },
                { id: '2', parent_id: '1', label: 'Node 2' },
                { id: '3', parent_id: '1', label: 'Node 3' },
                { id: '4', parent_id: '2', label: 'Node 4' },
                // Loop
                { id: '1', parent_id: '4', label: 'Node 1' },
                { id: '2', parent_id: '1', label: 'Node 2' },
                { id: '4', parent_id: '2', label: 'Node 4' },
                { id: '1', parent_id: '4', label: 'Node 1' },
                { id: '2', parent_id: '1', label: 'Node 2' },
                { id: '4', parent_id: '2', label: 'Node 4' },
            ],
        },
    };
    // 1 -> [2(4(1(2(4...)))), 3]
    return {
        in: [node],
        expect: [{
                ...node,
                agentLog: [
                    {
                        id: '1',
                        label: 'Node 1',
                        children: [
                            {
                                id: '2',
                                parent_id: '1',
                                label: 'Node 2',
                                children: [
                                    {
                                        id: '4',
                                        parent_id: '2',
                                        label: 'Node 4',
                                        children: [],
                                        hasCircle: true,
                                    },
                                ],
                            },
                            {
                                id: '3',
                                parent_id: '1',
                                label: 'Node 3',
                            },
                        ],
                    },
                ],
            }],
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQTJEO0FBRTlDLFFBQUEsYUFBYSxHQUFHLENBQUMsR0FBRyxFQUFFO0lBQ2pDLE1BQU0sSUFBSSxHQUFHO1FBQ1gsU0FBUyxFQUFFLGlCQUFTLENBQUMsS0FBSztRQUMxQixrQkFBa0IsRUFBRTtZQUNsQixTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQzVCLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FB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QUFRO3dCQUNmLFFBQVEsRUFBRTs0QkFDUjtnQ0FDRSxFQUFFLEVBQUUsR0FBRztnQ0FDUCxTQUFTLEVBQUUsR0FBRztnQ0FDZCxLQUFLLEVBQUUsUUFBUTtnQ0FDZixRQUFRLEVBQUU7b0NBQ1I7d0NBQ0UsRUFBRSxFQUFFLEdBQUc7d0NBQ1AsU0FBUyxFQUFFLEdBQUc7d0NBQ2QsS0FBSyxFQUFFLFFBQVE7d0NBQ2YsUUFBUSxFQUFFLEVBQUU7d0NBQ1osU0FBUyxFQUFFLElBQUk7cUNBQ2hCO2lDQUNGOzZCQUNGOzRCQUNEO2dDQUNFLEVBQUUsRUFBRSxHQUFHO2dDQUNQLFNBQVMsRUFBRSxHQUFHO2dDQUNkLEtBQUssRUFBRSxRQUFROzZCQUNoQjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUM7S0FDSCxDQUFBO0FBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBhZ2VudE5vZGVEYXRhID0gKCgpID0+IHtcbiAgY29uc3Qgbm9kZSA9IHtcbiAgICBub2RlX3R5cGU6IEJsb2NrRW51bS5BZ2VudCxcbiAgICBleGVjdXRpb25fbWV0YWRhdGE6IHtcbiAgICAgIGFnZW50X2xvZzogW1xuICAgICAgICB7IGlkOiAnMScsIGxhYmVsOiAnUm9vdCAxJyB9LFxuICAgICAgICB7IGlkOiAnMicsIHBhcmVudF9pZDogJzEnLCBsYWJlbDogJ0NoaWxkIDEuMicgfSxcbiAgICAgICAgeyBpZDogJzMnLCBwYXJlbnRfaWQ6ICcxJywgbGFiZWw6ICdDaGlsZCAxLjMnIH0sXG4gICAgICAgIHsgaWQ6ICc0JywgcGFyZW50X2lkOiAnMicsIGxhYmVsOiAnQ2hpbGQgMi40JyB9LFxuICAgICAgICB7IGlkOiAnNScsIHBhcmVudF9pZDogJzInLCBsYWJlbDogJ0NoaWxkIDIuNScgfSxcbiAgICAgICAgeyBpZDogJzYnLCBwYXJlbnRfaWQ6ICczJywgbGFiZWw6ICdDaGlsZCAzLjYnIH0sXG4gICAgICAgIHsgaWQ6ICc3JywgcGFyZW50X2lkOiAnNCcsIGxhYmVsOiAnQ2hpbGQgNC43JyB9LFxuICAgICAgICB7IGlkOiAnOCcsIHBhcmVudF9pZDogJzQnLCBsYWJlbDogJ0NoaWxkIDQuOCcgfSxcbiAgICAgICAgeyBpZDogJzknLCBwYXJlbnRfaWQ6ICc1JywgbGFiZWw6ICdDaGlsZCA1LjknIH0sXG4gICAgICAgIHsgaWQ6ICcxMCcsIHBhcmVudF9pZDogJzUnLCBsYWJlbDogJ0NoaWxkIDUuMTAnIH0sXG4gICAgICAgIHsgaWQ6ICcxMScsIHBhcmVudF9pZDogJzcnLCBsYWJlbDogJ0NoaWxkIDcuMTEnIH0sXG4gICAgICAgIHsgaWQ6ICcxMicsIHBhcmVudF9pZDogJzcnLCBsYWJlbDogJ0NoaWxkIDcuMTInIH0sXG4gICAgICAgIHsgaWQ6ICcxMycsIHBhcmVudF9pZDogJzknLCBsYWJlbDogJ0NoaWxkIDkuMTMnIH0sXG4gICAgICAgIHsgaWQ6ICcxNCcsIHBhcmVudF9pZDogJzknLCBsYWJlbDogJ0NoaWxkIDkuMTQnIH0sXG4gICAgICAgIHsgaWQ6ICcxNScsIHBhcmVudF9pZDogJzknLCBsYWJlbDogJ0NoaWxkIDkuMTUnIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluOiBbbm9kZV0sXG4gICAgZXhwZWN0OiBbe1xuICAgICAgLi4ubm9kZSxcbiAgICAgIGFnZW50TG9nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJzEnLFxuICAgICAgICAgIGxhYmVsOiAnUm9vdCAxJyxcbiAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICBwYXJlbnRfaWQ6ICcxJyxcbiAgICAgICAgICAgICAgbGFiZWw6ICdDaGlsZCAxLjInLFxuICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGlkOiAnNCcsXG4gICAgICAgICAgICAgICAgICBwYXJlbnRfaWQ6ICcyJyxcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ2hpbGQgMi40JyxcbiAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBpZDogJzcnLFxuICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZDogJzQnLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ2hpbGQgNC43JyxcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJzExJywgcGFyZW50X2lkOiAnNycsIGxhYmVsOiAnQ2hpbGQgNy4xMScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaWQ6ICcxMicsIHBhcmVudF9pZDogJzcnLCBsYWJlbDogJ0NoaWxkIDcuMTInIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBpZDogJzgnLCBwYXJlbnRfaWQ6ICc0JywgbGFiZWw6ICdDaGlsZCA0LjgnIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaWQ6ICc1JyxcbiAgICAgICAgICAgICAgICAgIHBhcmVudF9pZDogJzInLFxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdDaGlsZCAyLjUnLFxuICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGlkOiAnOScsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyZW50X2lkOiAnNScsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdDaGlsZCA1LjknLFxuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGlkOiAnMTMnLCBwYXJlbnRfaWQ6ICc5JywgbGFiZWw6ICdDaGlsZCA5LjEzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJzE0JywgcGFyZW50X2lkOiAnOScsIGxhYmVsOiAnQ2hpbGQgOS4xNCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaWQ6ICcxNScsIHBhcmVudF9pZDogJzknLCBsYWJlbDogJ0NoaWxkIDkuMTUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBpZDogJzEwJywgcGFyZW50X2lkOiAnNScsIGxhYmVsOiAnQ2hpbGQgNS4xMCcgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgICAgIHBhcmVudF9pZDogJzEnLFxuICAgICAgICAgICAgICBsYWJlbDogJ0NoaWxkIDEuMycsXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgeyBpZDogJzYnLCBwYXJlbnRfaWQ6ICczJywgbGFiZWw6ICdDaGlsZCAzLjYnIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH1dLFxuICB9XG59KSgpXG5cbmV4cG9ydCBjb25zdCBvbmVTdGVwQ2lyY2xlID0gKCgpID0+IHtcbiAgY29uc3Qgbm9kZSA9IHtcbiAgICBub2RlX3R5cGU6IEJsb2NrRW51bS5BZ2VudCxcbiAgICBleGVjdXRpb25fbWV0YWRhdGE6IHtcbiAgICAgIGFnZW50X2xvZzogW1xuICAgICAgICB7IGlkOiAnMScsIGxhYmVsOiAnTm9kZSAxJyB9LFxuICAgICAgICB7IGlkOiAnMScsIHBhcmVudF9pZDogJzEnLCBsYWJlbDogJ05vZGUgMScgfSxcbiAgICAgICAgeyBpZDogJzEnLCBwYXJlbnRfaWQ6ICcxJywgbGFiZWw6ICdOb2RlIDEnIH0sXG4gICAgICAgIHsgaWQ6ICcxJywgcGFyZW50X2lkOiAnMScsIGxhYmVsOiAnTm9kZSAxJyB9LFxuICAgICAgICB7IGlkOiAnMScsIHBhcmVudF9pZDogJzEnLCBsYWJlbDogJ05vZGUgMScgfSxcbiAgICAgICAgeyBpZDogJzEnLCBwYXJlbnRfaWQ6ICcxJywgbGFiZWw6ICdOb2RlIDEnIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluOiBbbm9kZV0sXG4gICAgZXhwZWN0OiBbe1xuICAgICAgLi4ubm9kZSxcbiAgICAgIGFnZW50TG9nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJzEnLFxuICAgICAgICAgIGxhYmVsOiAnTm9kZSAxJyxcbiAgICAgICAgICBoYXNDaXJjbGU6IHRydWUsXG4gICAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9XSxcbiAgfVxufSkoKVxuXG5leHBvcnQgY29uc3QgbXVsdGlTdGVwc0NpcmNsZSA9ICgoKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSB7XG4gICAgbm9kZV90eXBlOiBCbG9ja0VudW0uQWdlbnQsXG4gICAgZXhlY3V0aW9uX21ldGFkYXRhOiB7XG4gICAgICBhZ2VudF9sb2c6IFtcbiAgICAgICAgLy8gMSAtPiBbMiAtPiA0IC0+IDEsIDNdXG4gICAgICAgIHsgaWQ6ICcxJywgbGFiZWw6ICdOb2RlIDEnIH0sXG4gICAgICAgIHsgaWQ6ICcyJywgcGFyZW50X2lkOiAnMScsIGxhYmVsOiAnTm9kZSAyJyB9LFxuICAgICAgICB7IGlkOiAnMycsIHBhcmVudF9pZDogJzEnLCBsYWJlbDogJ05vZGUgMycgfSxcbiAgICAgICAgeyBpZDogJzQnLCBwYXJlbnRfaWQ6ICcyJywgbGFiZWw6ICdOb2RlIDQnIH0sXG5cbiAgICAgICAgLy8gTG9vcFxuICAgICAgICB7IGlkOiAnMScsIHBhcmVudF9pZDogJzQnLCBsYWJlbDogJ05vZGUgMScgfSxcbiAgICAgICAgeyBpZDogJzInLCBwYXJlbnRfaWQ6ICcxJywgbGFiZWw6ICdOb2RlIDInIH0sXG4gICAgICAgIHsgaWQ6ICc0JywgcGFyZW50X2lkOiAnMicsIGxhYmVsOiAnTm9kZSA0JyB9LFxuICAgICAgICB7IGlkOiAnMScsIHBhcmVudF9pZDogJzQnLCBsYWJlbDogJ05vZGUgMScgfSxcbiAgICAgICAgeyBpZDogJzInLCBwYXJlbnRfaWQ6ICcxJywgbGFiZWw6ICdOb2RlIDInIH0sXG4gICAgICAgIHsgaWQ6ICc0JywgcGFyZW50X2lkOiAnMicsIGxhYmVsOiAnTm9kZSA0JyB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9XG4gIC8vIDEgLT4gWzIoNCgxKDIoNC4uLikpKSksIDNdXG4gIHJldHVybiB7XG4gICAgaW46IFtub2RlXSxcbiAgICBleHBlY3Q6IFt7XG4gICAgICAuLi5ub2RlLFxuICAgICAgYWdlbnRMb2c6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnMScsXG4gICAgICAgICAgbGFiZWw6ICdOb2RlIDEnLFxuICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAnMicsXG4gICAgICAgICAgICAgIHBhcmVudF9pZDogJzEnLFxuICAgICAgICAgICAgICBsYWJlbDogJ05vZGUgMicsXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaWQ6ICc0JyxcbiAgICAgICAgICAgICAgICAgIHBhcmVudF9pZDogJzInLFxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdOb2RlIDQnLFxuICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgICAgICAgICAgICAgaGFzQ2lyY2xlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogJzMnLFxuICAgICAgICAgICAgICBwYXJlbnRfaWQ6ICcxJyxcbiAgICAgICAgICAgICAgbGFiZWw6ICdOb2RlIDMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9XSxcbiAgfVxufSkoKVxuIl19