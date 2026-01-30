"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_to_log_struct_1 = require("./graph-to-log-struct");
describe('parseDSL', () => {
    it('should parse plain nodes correctly', () => {
        const dsl = 'plainNode1 -> plainNode2';
        const result = (0, graph_to_log_struct_1.default)(dsl);
        expect(result).toEqual([
            { id: 'plainNode1', node_id: 'plainNode1', title: 'plainNode1', execution_metadata: {}, status: 'succeeded' },
            { id: 'plainNode2', node_id: 'plainNode2', title: 'plainNode2', execution_metadata: {}, status: 'succeeded' },
        ]);
    });
    it('should parse retry nodes correctly', () => {
        const dsl = '(retry, retryNode, 3)';
        const result = (0, graph_to_log_struct_1.default)(dsl);
        expect(result).toEqual([
            { id: 'retryNode', node_id: 'retryNode', title: 'retryNode', execution_metadata: {}, status: 'succeeded' },
            { id: 'retryNode', node_id: 'retryNode', title: 'retryNode', execution_metadata: {}, status: 'retry' },
            { id: 'retryNode', node_id: 'retryNode', title: 'retryNode', execution_metadata: {}, status: 'retry' },
            { id: 'retryNode', node_id: 'retryNode', title: 'retryNode', execution_metadata: {}, status: 'retry' },
        ]);
    });
    it('should parse iteration nodes correctly', () => {
        const dsl = '(iteration, iterationNode, plainNode1 -> plainNode2)';
        const result = (0, graph_to_log_struct_1.default)(dsl);
        expect(result).toEqual([
            { id: 'iterationNode', node_id: 'iterationNode', title: 'iterationNode', node_type: 'iteration', execution_metadata: {}, status: 'succeeded' },
            { id: 'plainNode1', node_id: 'plainNode1', title: 'plainNode1', execution_metadata: { iteration_id: 'iterationNode', iteration_index: 0 }, status: 'succeeded' },
            { id: 'plainNode2', node_id: 'plainNode2', title: 'plainNode2', execution_metadata: { iteration_id: 'iterationNode', iteration_index: 0 }, status: 'succeeded' },
        ]);
    });
    it('should parse loop nodes correctly', () => {
        const dsl = '(loop, loopNode, plainNode1 -> plainNode2)';
        const result = (0, graph_to_log_struct_1.default)(dsl);
        expect(result).toEqual([
            { id: 'loopNode', node_id: 'loopNode', title: 'loopNode', node_type: 'loop', execution_metadata: {}, status: 'succeeded' },
            { id: 'plainNode1', node_id: 'plainNode1', title: 'plainNode1', execution_metadata: { loop_id: 'loopNode', loop_index: 0 }, status: 'succeeded' },
            { id: 'plainNode2', node_id: 'plainNode2', title: 'plainNode2', execution_metadata: { loop_id: 'loopNode', loop_index: 0 }, status: 'succeeded' },
        ]);
    });
    it('should parse parallel nodes correctly', () => {
        const dsl = '(parallel, parallelNode, nodeA, nodeB -> nodeC)';
        const result = (0, graph_to_log_struct_1.default)(dsl);
        expect(result).toEqual([
            { id: 'parallelNode', node_id: 'parallelNode', title: 'parallelNode', execution_metadata: { parallel_id: 'parallelNode' }, status: 'succeeded' },
            { id: 'nodeA', node_id: 'nodeA', title: 'nodeA', execution_metadata: { parallel_id: 'parallelNode', parallel_start_node_id: 'nodeA' }, status: 'succeeded' },
            { id: 'nodeB', node_id: 'nodeB', title: 'nodeB', execution_metadata: { parallel_id: 'parallelNode', parallel_start_node_id: 'nodeB' }, status: 'succeeded' },
            { id: 'nodeC', node_id: 'nodeC', title: 'nodeC', execution_metadata: { parallel_id: 'parallelNode', parallel_start_node_id: 'nodeB' }, status: 'succeeded' },
        ]);
    });
    // TODO
    // it('should handle nested parallel nodes', () => {
    //   const dsl = '(parallel, outerParallel, (parallel, innerParallel, plainNode1 -> plainNode2) -> plainNode3)'
    //   const result = parseDSL(dsl)
    //   expect(result).toEqual([
    //     {
    //       id: 'outerParallel',
    //       node_id: 'outerParallel',
    //       title: 'outerParallel',
    //       execution_metadata: { parallel_id: 'outerParallel' },
    //       status: 'succeeded',
    //     },
    //     {
    //       id: 'innerParallel',
    //       node_id: 'innerParallel',
    //       title: 'innerParallel',
    //       execution_metadata: { parallel_id: 'outerParallel', parallel_start_node_id: 'innerParallel' },
    //       status: 'succeeded',
    //     },
    //     {
    //       id: 'plainNode1',
    //       node_id: 'plainNode1',
    //       title: 'plainNode1',
    //       execution_metadata: {
    //         parallel_id: 'innerParallel',
    //         parallel_start_node_id: 'plainNode1',
    //         parent_parallel_id: 'outerParallel',
    //         parent_parallel_start_node_id: 'innerParallel',
    //       },
    //       status: 'succeeded',
    //     },
    //     {
    //       id: 'plainNode2',
    //       node_id: 'plainNode2',
    //       title: 'plainNode2',
    //       execution_metadata: {
    //         parallel_id: 'innerParallel',
    //         parallel_start_node_id: 'plainNode1',
    //         parent_parallel_id: 'outerParallel',
    //         parent_parallel_start_node_id: 'innerParallel',
    //       },
    //       status: 'succeeded',
    //     },
    //     {
    //       id: 'plainNode3',
    //       node_id: 'plainNode3',
    //       title: 'plainNode3',
    //       execution_metadata: {
    //         parallel_id: 'outerParallel',
    //         parallel_start_node_id: 'innerParallel',
    //       },
    //       status: 'succeeded',
    //     },
    //   ])
    // })
    // iterations not support nested iterations
    // it('should handle nested iterations', () => {
    //   const dsl = '(iteration, outerIteration, (iteration, innerIteration -> plainNode1 -> plainNode2))'
    //   const result = parseDSL(dsl)
    //   expect(result).toEqual([
    //     { id: 'outerIteration', node_id: 'outerIteration', title: 'outerIteration', node_type: 'iteration', execution_metadata: {}, status: 'succeeded' },
    //     { id: 'innerIteration', node_id: 'innerIteration', title: 'innerIteration', node_type: 'iteration', execution_metadata: { iteration_id: 'outerIteration', iteration_index: 0 }, status: 'succeeded' },
    //     { id: 'plainNode1', node_id: 'plainNode1', title: 'plainNode1', execution_metadata: { iteration_id: 'innerIteration', iteration_index: 0 }, status: 'succeeded' },
    //     { id: 'plainNode2', node_id: 'plainNode2', title: 'plainNode2', execution_metadata: { iteration_id: 'innerIteration', iteration_index: 0 }, status: 'succeeded' },
    //   ])
    // })
    // it('should handle nested iterations within parallel nodes', () => {
    //   const dsl = '(parallel, parallelNode, (iteration, iterationNode, plainNode1, plainNode2))'
    //   const result = parseDSL(dsl)
    //   expect(result).toEqual([
    //     { id: 'parallelNode', node_id: 'parallelNode', title: 'parallelNode', execution_metadata: { parallel_id: 'parallelNode' }, status: 'succeeded' },
    //     { id: 'iterationNode', node_id: 'iterationNode', title: 'iterationNode', node_type: 'iteration', execution_metadata: { parallel_id: 'parallelNode', parallel_start_node_id: 'iterationNode' }, status: 'succeeded' },
    //     { id: 'plainNode1', node_id: 'plainNode1', title: 'plainNode1', execution_metadata: { iteration_id: 'iterationNode', iteration_index: 0, parallel_id: 'parallelNode', parallel_start_node_id: 'iterationNode' }, status: 'succeeded' },
    //     { id: 'plainNode2', node_id: 'plainNode2', title: 'plainNode2', execution_metadata: { iteration_id: 'iterationNode', iteration_index: 0, parallel_id: 'parallelNode', parallel_start_node_id: 'iterationNode' }, status: 'succeeded' },
    //   ])
    // })
    it('should throw an error for unknown node types', () => {
        const dsl = '(unknown, nodeId)';
        expect(() => (0, graph_to_log_struct_1.default)(dsl)).toThrowError('Unknown nodeType: unknown');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGgtdG8tbG9nLXN0cnVjdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3JhcGgtdG8tbG9nLXN0cnVjdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0RBQTRDO0FBRTVDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsTUFBTSxHQUFHLEdBQUcsMEJBQTBCLENBQUE7UUFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBQSw2QkFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckIsRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtZQUM3RyxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO1NBQzlHLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUM1QyxNQUFNLEdBQUcsR0FBRyx1QkFBdUIsQ0FBQTtRQUNuQyxNQUFNLE1BQU0sR0FBRyxJQUFBLDZCQUFRLEVBQUMsR0FBRyxDQUFDLENBQUE7UUFDNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNyQixFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO1lBQzFHLEVBQUUsRUFBRSxF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ZnJvbSAnLi9ncmFwaC10by1sb2ctc3RydWN0J1xuXG5kZXNjcmliZSgncGFyc2VEU0wnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcGFyc2UgcGxhaW4gbm9kZXMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGNvbnN0IGRzbCA9ICdwbGFpbk5vZGUxIC0+IHBsYWluTm9kZTInXG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2VEU0woZHNsKVxuICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW1xuICAgICAgeyBpZDogJ3BsYWluTm9kZTEnLCBub2RlX2lkOiAncGxhaW5Ob2RlMScsIHRpdGxlOiAncGxhaW5Ob2RlMScsIGV4ZWN1dGlvbl9tZXRhZGF0YToge30sIHN0YXR1czogJ3N1Y2NlZWRlZCcgfSxcbiAgICAgIHsgaWQ6ICdwbGFpbk5vZGUyJywgbm9kZV9pZDogJ3BsYWluTm9kZTInLCB0aXRsZTogJ3BsYWluTm9kZTInLCBleGVjdXRpb25fbWV0YWRhdGE6IHt9LCBzdGF0dXM6ICdzdWNjZWVkZWQnIH0sXG4gICAgXSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHBhcnNlIHJldHJ5IG5vZGVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICBjb25zdCBkc2wgPSAnKHJldHJ5LCByZXRyeU5vZGUsIDMpJ1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlRFNMKGRzbClcbiAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtcbiAgICAgIHsgaWQ6ICdyZXRyeU5vZGUnLCBub2RlX2lkOiAncmV0cnlOb2RlJywgdGl0bGU6ICdyZXRyeU5vZGUnLCBleGVjdXRpb25fbWV0YWRhdGE6IHt9LCBzdGF0dXM6ICdzdWNjZWVkZWQnIH0sXG4gICAgICB7IGlkOiAncmV0cnlOb2RlJywgbm9kZV9pZDogJ3JldHJ5Tm9kZScsIHRpdGxlOiAncmV0cnlOb2RlJywgZXhlY3V0aW9uX21ldGFkYXRhOiB7fSwgc3RhdHVzOiAncmV0cnknIH0sXG4gICAgICB7IGlkOiAncmV0cnlOb2RlJywgbm9kZV9pZDogJ3JldHJ5Tm9kZScsIHRpdGxlOiAncmV0cnlOb2RlJywgZXhlY3V0aW9uX21ldGFkYXRhOiB7fSwgc3RhdHVzOiAncmV0cnknIH0sXG4gICAgICB7IGlkOiAncmV0cnlOb2RlJywgbm9kZV9pZDogJ3JldHJ5Tm9kZScsIHRpdGxlOiAncmV0cnlOb2RlJywgZXhlY3V0aW9uX21ldGFkYXRhOiB7fSwgc3RhdHVzOiAncmV0cnknIH0sXG4gICAgXSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHBhcnNlIGl0ZXJhdGlvbiBub2RlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgY29uc3QgZHNsID0gJyhpdGVyYXRpb24sIGl0ZXJhdGlvbk5vZGUsIHBsYWluTm9kZTEgLT4gcGxhaW5Ob2RlMiknXG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2VEU0woZHNsKVxuICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW1xuICAgICAgeyBpZDogJ2l0ZXJhdGlvbk5vZGUnLCBub2RlX2lkOiAnaXRlcmF0aW9uTm9kZScsIHRpdGxlOiAnaXRlcmF0aW9uTm9kZScsIG5vZGVfdHlwZTogJ2l0ZXJhdGlvbicsIGV4ZWN1dGlvbl9tZXRhZGF0YToge30sIHN0YXR1czogJ3N1Y2NlZWRlZCcgfSxcbiAgICAgIHsgaWQ6ICdwbGFpbk5vZGUxJywgbm9kZV9pZDogJ3BsYWluTm9kZTEnLCB0aXRsZTogJ3BsYWluTm9kZTEnLCBleGVjdXRpb25fbWV0YWRhdGE6IHsgaXRlcmF0aW9uX2lkOiAnaXRlcmF0aW9uTm9kZScsIGl0ZXJhdGlvbl9pbmRleDogMCB9LCBzdGF0dXM6ICdzdWNjZWVkZWQnIH0sXG4gICAgICB7IGlkOiAncGxhaW5Ob2RlMicsIG5vZGVfaWQ6ICdwbGFpbk5vZGUyJywgdGl0bGU6ICdwbGFpbk5vZGUyJywgZXhlY3V0aW9uX21ldGFkYXRhOiB7IGl0ZXJhdGlvbl9pZDogJ2l0ZXJhdGlvbk5vZGUnLCBpdGVyYXRpb25faW5kZXg6IDAgfSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAgIF0pXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBwYXJzZSBsb29wIG5vZGVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICBjb25zdCBkc2wgPSAnKGxvb3AsIGxvb3BOb2RlLCBwbGFpbk5vZGUxIC0+IHBsYWluTm9kZTIpJ1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlRFNMKGRzbClcbiAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtcbiAgICAgIHsgaWQ6ICdsb29wTm9kZScsIG5vZGVfaWQ6ICdsb29wTm9kZScsIHRpdGxlOiAnbG9vcE5vZGUnLCBub2RlX3R5cGU6ICdsb29wJywgZXhlY3V0aW9uX21ldGFkYXRhOiB7fSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAgICAgeyBpZDogJ3BsYWluTm9kZTEnLCBub2RlX2lkOiAncGxhaW5Ob2RlMScsIHRpdGxlOiAncGxhaW5Ob2RlMScsIGV4ZWN1dGlvbl9tZXRhZGF0YTogeyBsb29wX2lkOiAnbG9vcE5vZGUnLCBsb29wX2luZGV4OiAwIH0sIHN0YXR1czogJ3N1Y2NlZWRlZCcgfSxcbiAgICAgIHsgaWQ6ICdwbGFpbk5vZGUyJywgbm9kZV9pZDogJ3BsYWluTm9kZTInLCB0aXRsZTogJ3BsYWluTm9kZTInLCBleGVjdXRpb25fbWV0YWRhdGE6IHsgbG9vcF9pZDogJ2xvb3BOb2RlJywgbG9vcF9pbmRleDogMCB9LCBzdGF0dXM6ICdzdWNjZWVkZWQnIH0sXG4gICAgXSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHBhcnNlIHBhcmFsbGVsIG5vZGVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICBjb25zdCBkc2wgPSAnKHBhcmFsbGVsLCBwYXJhbGxlbE5vZGUsIG5vZGVBLCBub2RlQiAtPiBub2RlQyknXG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2VEU0woZHNsKVxuICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW1xuICAgICAgeyBpZDogJ3BhcmFsbGVsTm9kZScsIG5vZGVfaWQ6ICdwYXJhbGxlbE5vZGUnLCB0aXRsZTogJ3BhcmFsbGVsTm9kZScsIGV4ZWN1dGlvbl9tZXRhZGF0YTogeyBwYXJhbGxlbF9pZDogJ3BhcmFsbGVsTm9kZScgfSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAgICAgeyBpZDogJ25vZGVBJywgbm9kZV9pZDogJ25vZGVBJywgdGl0bGU6ICdub2RlQScsIGV4ZWN1dGlvbl9tZXRhZGF0YTogeyBwYXJhbGxlbF9pZDogJ3BhcmFsbGVsTm9kZScsIHBhcmFsbGVsX3N0YXJ0X25vZGVfaWQ6ICdub2RlQScgfSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAgICAgeyBpZDogJ25vZGVCJywgbm9kZV9pZDogJ25vZGVCJywgdGl0bGU6ICdub2RlQicsIGV4ZWN1dGlvbl9tZXRhZGF0YTogeyBwYXJhbGxlbF9pZDogJ3BhcmFsbGVsTm9kZScsIHBhcmFsbGVsX3N0YXJ0X25vZGVfaWQ6ICdub2RlQicgfSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAgICAgeyBpZDogJ25vZGVDJywgbm9kZV9pZDogJ25vZGVDJywgdGl0bGU6ICdub2RlQycsIGV4ZWN1dGlvbl9tZXRhZGF0YTogeyBwYXJhbGxlbF9pZDogJ3BhcmFsbGVsTm9kZScsIHBhcmFsbGVsX3N0YXJ0X25vZGVfaWQ6ICdub2RlQicgfSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAgIF0pXG4gIH0pXG5cbiAgLy8gVE9ET1xuICAvLyBpdCgnc2hvdWxkIGhhbmRsZSBuZXN0ZWQgcGFyYWxsZWwgbm9kZXMnLCAoKSA9PiB7XG4gIC8vICAgY29uc3QgZHNsID0gJyhwYXJhbGxlbCwgb3V0ZXJQYXJhbGxlbCwgKHBhcmFsbGVsLCBpbm5lclBhcmFsbGVsLCBwbGFpbk5vZGUxIC0+IHBsYWluTm9kZTIpIC0+IHBsYWluTm9kZTMpJ1xuICAvLyAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlRFNMKGRzbClcbiAgLy8gICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtcbiAgLy8gICAgIHtcbiAgLy8gICAgICAgaWQ6ICdvdXRlclBhcmFsbGVsJyxcbiAgLy8gICAgICAgbm9kZV9pZDogJ291dGVyUGFyYWxsZWwnLFxuICAvLyAgICAgICB0aXRsZTogJ291dGVyUGFyYWxsZWwnLFxuICAvLyAgICAgICBleGVjdXRpb25fbWV0YWRhdGE6IHsgcGFyYWxsZWxfaWQ6ICdvdXRlclBhcmFsbGVsJyB9LFxuICAvLyAgICAgICBzdGF0dXM6ICdzdWNjZWVkZWQnLFxuICAvLyAgICAgfSxcbiAgLy8gICAgIHtcbiAgLy8gICAgICAgaWQ6ICdpbm5lclBhcmFsbGVsJyxcbiAgLy8gICAgICAgbm9kZV9pZDogJ2lubmVyUGFyYWxsZWwnLFxuICAvLyAgICAgICB0aXRsZTogJ2lubmVyUGFyYWxsZWwnLFxuICAvLyAgICAgICBleGVjdXRpb25fbWV0YWRhdGE6IHsgcGFyYWxsZWxfaWQ6ICdvdXRlclBhcmFsbGVsJywgcGFyYWxsZWxfc3RhcnRfbm9kZV9pZDogJ2lubmVyUGFyYWxsZWwnIH0sXG4gIC8vICAgICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gIC8vICAgICB9LFxuICAvLyAgICAge1xuICAvLyAgICAgICBpZDogJ3BsYWluTm9kZTEnLFxuICAvLyAgICAgICBub2RlX2lkOiAncGxhaW5Ob2RlMScsXG4gIC8vICAgICAgIHRpdGxlOiAncGxhaW5Ob2RlMScsXG4gIC8vICAgICAgIGV4ZWN1dGlvbl9tZXRhZGF0YToge1xuICAvLyAgICAgICAgIHBhcmFsbGVsX2lkOiAnaW5uZXJQYXJhbGxlbCcsXG4gIC8vICAgICAgICAgcGFyYWxsZWxfc3RhcnRfbm9kZV9pZDogJ3BsYWluTm9kZTEnLFxuICAvLyAgICAgICAgIHBhcmVudF9wYXJhbGxlbF9pZDogJ291dGVyUGFyYWxsZWwnLFxuICAvLyAgICAgICAgIHBhcmVudF9wYXJhbGxlbF9zdGFydF9ub2RlX2lkOiAnaW5uZXJQYXJhbGxlbCcsXG4gIC8vICAgICAgIH0sXG4gIC8vICAgICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gIC8vICAgICB9LFxuICAvLyAgICAge1xuICAvLyAgICAgICBpZDogJ3BsYWluTm9kZTInLFxuICAvLyAgICAgICBub2RlX2lkOiAncGxhaW5Ob2RlMicsXG4gIC8vICAgICAgIHRpdGxlOiAncGxhaW5Ob2RlMicsXG4gIC8vICAgICAgIGV4ZWN1dGlvbl9tZXRhZGF0YToge1xuICAvLyAgICAgICAgIHBhcmFsbGVsX2lkOiAnaW5uZXJQYXJhbGxlbCcsXG4gIC8vICAgICAgICAgcGFyYWxsZWxfc3RhcnRfbm9kZV9pZDogJ3BsYWluTm9kZTEnLFxuICAvLyAgICAgICAgIHBhcmVudF9wYXJhbGxlbF9pZDogJ291dGVyUGFyYWxsZWwnLFxuICAvLyAgICAgICAgIHBhcmVudF9wYXJhbGxlbF9zdGFydF9ub2RlX2lkOiAnaW5uZXJQYXJhbGxlbCcsXG4gIC8vICAgICAgIH0sXG4gIC8vICAgICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gIC8vICAgICB9LFxuICAvLyAgICAge1xuICAvLyAgICAgICBpZDogJ3BsYWluTm9kZTMnLFxuICAvLyAgICAgICBub2RlX2lkOiAncGxhaW5Ob2RlMycsXG4gIC8vICAgICAgIHRpdGxlOiAncGxhaW5Ob2RlMycsXG4gIC8vICAgICAgIGV4ZWN1dGlvbl9tZXRhZGF0YToge1xuICAvLyAgICAgICAgIHBhcmFsbGVsX2lkOiAnb3V0ZXJQYXJhbGxlbCcsXG4gIC8vICAgICAgICAgcGFyYWxsZWxfc3RhcnRfbm9kZV9pZDogJ2lubmVyUGFyYWxsZWwnLFxuICAvLyAgICAgICB9LFxuICAvLyAgICAgICBzdGF0dXM6ICdzdWNjZWVkZWQnLFxuICAvLyAgICAgfSxcbiAgLy8gICBdKVxuICAvLyB9KVxuXG4gIC8vIGl0ZXJhdGlvbnMgbm90IHN1cHBvcnQgbmVzdGVkIGl0ZXJhdGlvbnNcbiAgLy8gaXQoJ3Nob3VsZCBoYW5kbGUgbmVzdGVkIGl0ZXJhdGlvbnMnLCAoKSA9PiB7XG4gIC8vICAgY29uc3QgZHNsID0gJyhpdGVyYXRpb24sIG91dGVySXRlcmF0aW9uLCAoaXRlcmF0aW9uLCBpbm5lckl0ZXJhdGlvbiAtPiBwbGFpbk5vZGUxIC0+IHBsYWluTm9kZTIpKSdcbiAgLy8gICBjb25zdCByZXN1bHQgPSBwYXJzZURTTChkc2wpXG4gIC8vICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXG4gIC8vICAgICB7IGlkOiAnb3V0ZXJJdGVyYXRpb24nLCBub2RlX2lkOiAnb3V0ZXJJdGVyYXRpb24nLCB0aXRsZTogJ291dGVySXRlcmF0aW9uJywgbm9kZV90eXBlOiAnaXRlcmF0aW9uJywgZXhlY3V0aW9uX21ldGFkYXRhOiB7fSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAvLyAgICAgeyBpZDogJ2lubmVySXRlcmF0aW9uJywgbm9kZV9pZDogJ2lubmVySXRlcmF0aW9uJywgdGl0bGU6ICdpbm5lckl0ZXJhdGlvbicsIG5vZGVfdHlwZTogJ2l0ZXJhdGlvbicsIGV4ZWN1dGlvbl9tZXRhZGF0YTogeyBpdGVyYXRpb25faWQ6ICdvdXRlckl0ZXJhdGlvbicsIGl0ZXJhdGlvbl9pbmRleDogMCB9LCBzdGF0dXM6ICdzdWNjZWVkZWQnIH0sXG4gIC8vICAgICB7IGlkOiAncGxhaW5Ob2RlMScsIG5vZGVfaWQ6ICdwbGFpbk5vZGUxJywgdGl0bGU6ICdwbGFpbk5vZGUxJywgZXhlY3V0aW9uX21ldGFkYXRhOiB7IGl0ZXJhdGlvbl9pZDogJ2lubmVySXRlcmF0aW9uJywgaXRlcmF0aW9uX2luZGV4OiAwIH0sIHN0YXR1czogJ3N1Y2NlZWRlZCcgfSxcbiAgLy8gICAgIHsgaWQ6ICdwbGFpbk5vZGUyJywgbm9kZV9pZDogJ3BsYWluTm9kZTInLCB0aXRsZTogJ3BsYWluTm9kZTInLCBleGVjdXRpb25fbWV0YWRhdGE6IHsgaXRlcmF0aW9uX2lkOiAnaW5uZXJJdGVyYXRpb24nLCBpdGVyYXRpb25faW5kZXg6IDAgfSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAvLyAgIF0pXG4gIC8vIH0pXG5cbiAgLy8gaXQoJ3Nob3VsZCBoYW5kbGUgbmVzdGVkIGl0ZXJhdGlvbnMgd2l0aGluIHBhcmFsbGVsIG5vZGVzJywgKCkgPT4ge1xuICAvLyAgIGNvbnN0IGRzbCA9ICcocGFyYWxsZWwsIHBhcmFsbGVsTm9kZSwgKGl0ZXJhdGlvbiwgaXRlcmF0aW9uTm9kZSwgcGxhaW5Ob2RlMSwgcGxhaW5Ob2RlMikpJ1xuICAvLyAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlRFNMKGRzbClcbiAgLy8gICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtcbiAgLy8gICAgIHsgaWQ6ICdwYXJhbGxlbE5vZGUnLCBub2RlX2lkOiAncGFyYWxsZWxOb2RlJywgdGl0bGU6ICdwYXJhbGxlbE5vZGUnLCBleGVjdXRpb25fbWV0YWRhdGE6IHsgcGFyYWxsZWxfaWQ6ICdwYXJhbGxlbE5vZGUnIH0sIHN0YXR1czogJ3N1Y2NlZWRlZCcgfSxcbiAgLy8gICAgIHsgaWQ6ICdpdGVyYXRpb25Ob2RlJywgbm9kZV9pZDogJ2l0ZXJhdGlvbk5vZGUnLCB0aXRsZTogJ2l0ZXJhdGlvbk5vZGUnLCBub2RlX3R5cGU6ICdpdGVyYXRpb24nLCBleGVjdXRpb25fbWV0YWRhdGE6IHsgcGFyYWxsZWxfaWQ6ICdwYXJhbGxlbE5vZGUnLCBwYXJhbGxlbF9zdGFydF9ub2RlX2lkOiAnaXRlcmF0aW9uTm9kZScgfSwgc3RhdHVzOiAnc3VjY2VlZGVkJyB9LFxuICAvLyAgICAgeyBpZDogJ3BsYWluTm9kZTEnLCBub2RlX2lkOiAncGxhaW5Ob2RlMScsIHRpdGxlOiAncGxhaW5Ob2RlMScsIGV4ZWN1dGlvbl9tZXRhZGF0YTogeyBpdGVyYXRpb25faWQ6ICdpdGVyYXRpb25Ob2RlJywgaXRlcmF0aW9uX2luZGV4OiAwLCBwYXJhbGxlbF9pZDogJ3BhcmFsbGVsTm9kZScsIHBhcmFsbGVsX3N0YXJ0X25vZGVfaWQ6ICdpdGVyYXRpb25Ob2RlJyB9LCBzdGF0dXM6ICdzdWNjZWVkZWQnIH0sXG4gIC8vICAgICB7IGlkOiAncGxhaW5Ob2RlMicsIG5vZGVfaWQ6ICdwbGFpbk5vZGUyJywgdGl0bGU6ICdwbGFpbk5vZGUyJywgZXhlY3V0aW9uX21ldGFkYXRhOiB7IGl0ZXJhdGlvbl9pZDogJ2l0ZXJhdGlvbk5vZGUnLCBpdGVyYXRpb25faW5kZXg6IDAsIHBhcmFsbGVsX2lkOiAncGFyYWxsZWxOb2RlJywgcGFyYWxsZWxfc3RhcnRfbm9kZV9pZDogJ2l0ZXJhdGlvbk5vZGUnIH0sIHN0YXR1czogJ3N1Y2NlZWRlZCcgfSxcbiAgLy8gICBdKVxuICAvLyB9KVxuXG4gIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgZm9yIHVua25vd24gbm9kZSB0eXBlcycsICgpID0+IHtcbiAgICBjb25zdCBkc2wgPSAnKHVua25vd24sIG5vZGVJZCknXG4gICAgZXhwZWN0KCgpID0+IHBhcnNlRFNMKGRzbCkpLnRvVGhyb3dFcnJvcignVW5rbm93biBub2RlVHlwZTogdW5rbm93bicpXG4gIH0pXG59KVxuIl19