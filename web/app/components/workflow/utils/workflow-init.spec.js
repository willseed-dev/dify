"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@/app/components/workflow/nodes/iteration-start/constants");
const types_1 = require("@/app/components/workflow/types");
const workflow_init_1 = require("./workflow-init");
describe('preprocessNodesAndEdges', () => {
    it('process nodes without iteration node or loop node should return origin nodes and edges.', () => {
        const nodes = [
            {
                data: {
                    type: types_1.BlockEnum.Code,
                },
            },
        ];
        const result = (0, workflow_init_1.preprocessNodesAndEdges)(nodes, []);
        expect(result).toEqual({
            nodes,
            edges: [],
        });
    });
    it('process nodes with iteration node should return nodes with iteration start node', () => {
        const nodes = [
            {
                id: 'iteration',
                data: {
                    type: types_1.BlockEnum.Iteration,
                },
            },
        ];
        const result = (0, workflow_init_1.preprocessNodesAndEdges)(nodes, []);
        expect(result.nodes).toEqual(expect.arrayContaining([
            expect.objectContaining({
                data: expect.objectContaining({
                    type: types_1.BlockEnum.IterationStart,
                }),
            }),
        ]));
    });
    it('process nodes with iteration node start should return origin', () => {
        const nodes = [
            {
                data: {
                    type: types_1.BlockEnum.Iteration,
                    start_node_id: 'iterationStart',
                },
            },
            {
                id: 'iterationStart',
                type: constants_1.CUSTOM_ITERATION_START_NODE,
                data: {
                    type: types_1.BlockEnum.IterationStart,
                },
            },
        ];
        const result = (0, workflow_init_1.preprocessNodesAndEdges)(nodes, []);
        expect(result).toEqual({
            nodes,
            edges: [],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3ctaW5pdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid29ya2Zsb3ctaW5pdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EseUZBQXVHO0FBQ3ZHLDJEQUEyRDtBQUMzRCxtREFBeUQ7QUFFekQsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMseUZBQXlGLEVBQUUsR0FBRyxFQUFFO1FBQ2pHLE1BQU0sS0FBSyxHQUFHO1lBQ1o7Z0JBQ0UsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxpQkFBUyxDQUFDLElBQUk7aUJBQ3JCO2FBQ0Y7U0FDRixDQUFBO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBQSx1Q0FBdUIsRUFBQyxLQUFlLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDM0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNyQixLQUFLO1lBQ0wsS0FBSyxFQUFFLEVBQUU7U0FDVixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxpRkFBaUYsRUFBRSxHQUFHLEVBQUU7UUFDekYsTUFBTSxLQUFLLEdBQUc7WUFDWjtnQkFDRSxFQUFFLEVBQUUsV0FBVztnQkFDZixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLGlCQUFTLENBQUMsU0FBUztpQkFDMUI7YUFDRjtTQUNGLENBQUE7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFBLHVDQUF1QixFQUFDLEtBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMzRCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FDMUIsTUFBTSxDQUFDLGVBQWUsQ0FBQztZQUNyQixNQUFNLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3RCLElBQUksRUFBRSxNQUFNLENBQUMsZ0JBQWdCLENBQUM7b0JBQzVCLElBQUksRUFBRSxpQkFBUyxDQUFDLGNBQWM7aUJBQy9CLENBQUM7YUFDSCxDQUFDO1NBQ0gsQ0FBQyxDQUNILENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw4REFBOEQsRUFBRSxHQUFHLEVBQUU7UUFDdEUsTUFBTSxLQUFLLEdBQUc7WUFDWjtnQkFDRSxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLGlCQUFTLENBQUMsU0FBUztvQkFDekIsYUFBYSxFQUFFLGdCQUFnQjtpQkFDaEM7YUFDRjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxnQkFBZ0I7Z0JBQ3BCLElBQUksRUFBRSx1Q0FBMkI7Z0JBQ2pDLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsaUJBQVMsQ0FBQyxjQUFjO2lCQUMvQjthQUNGO1NBQ0YsQ0FBQTtRQUNELE1BQU0sTUFBTSxHQUFHLElBQUEsdUNBQXVCLEVBQUMsS0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckIsS0FBSztZQUNMLEtBQUssRUFBRSxFQUFFO1NBQ1YsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgTm9kZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IENVU1RPTV9JVEVSQVRJT05fU1RBUlRfTk9ERSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvaXRlcmF0aW9uLXN0YXJ0L2NvbnN0YW50cydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBwcmVwcm9jZXNzTm9kZXNBbmRFZGdlcyB9IGZyb20gJy4vd29ya2Zsb3ctaW5pdCdcblxuZGVzY3JpYmUoJ3ByZXByb2Nlc3NOb2Rlc0FuZEVkZ2VzJywgKCkgPT4ge1xuICBpdCgncHJvY2VzcyBub2RlcyB3aXRob3V0IGl0ZXJhdGlvbiBub2RlIG9yIGxvb3Agbm9kZSBzaG91bGQgcmV0dXJuIG9yaWdpbiBub2RlcyBhbmQgZWRnZXMuJywgKCkgPT4ge1xuICAgIGNvbnN0IG5vZGVzID0gW1xuICAgICAge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogQmxvY2tFbnVtLkNvZGUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHByZXByb2Nlc3NOb2Rlc0FuZEVkZ2VzKG5vZGVzIGFzIE5vZGVbXSwgW10pXG4gICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICBub2RlcyxcbiAgICAgIGVkZ2VzOiBbXSxcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdwcm9jZXNzIG5vZGVzIHdpdGggaXRlcmF0aW9uIG5vZGUgc2hvdWxkIHJldHVybiBub2RlcyB3aXRoIGl0ZXJhdGlvbiBzdGFydCBub2RlJywgKCkgPT4ge1xuICAgIGNvbnN0IG5vZGVzID0gW1xuICAgICAge1xuICAgICAgICBpZDogJ2l0ZXJhdGlvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiBCbG9ja0VudW0uSXRlcmF0aW9uLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdXG5cbiAgICBjb25zdCByZXN1bHQgPSBwcmVwcm9jZXNzTm9kZXNBbmRFZGdlcyhub2RlcyBhcyBOb2RlW10sIFtdKVxuICAgIGV4cGVjdChyZXN1bHQubm9kZXMpLnRvRXF1YWwoXG4gICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGRhdGE6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrRW51bS5JdGVyYXRpb25TdGFydCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSksXG4gICAgICBdKSxcbiAgICApXG4gIH0pXG5cbiAgaXQoJ3Byb2Nlc3Mgbm9kZXMgd2l0aCBpdGVyYXRpb24gbm9kZSBzdGFydCBzaG91bGQgcmV0dXJuIG9yaWdpbicsICgpID0+IHtcbiAgICBjb25zdCBub2RlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHR5cGU6IEJsb2NrRW51bS5JdGVyYXRpb24sXG4gICAgICAgICAgc3RhcnRfbm9kZV9pZDogJ2l0ZXJhdGlvblN0YXJ0JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnaXRlcmF0aW9uU3RhcnQnLFxuICAgICAgICB0eXBlOiBDVVNUT01fSVRFUkFUSU9OX1NUQVJUX05PREUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiBCbG9ja0VudW0uSXRlcmF0aW9uU3RhcnQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF1cbiAgICBjb25zdCByZXN1bHQgPSBwcmVwcm9jZXNzTm9kZXNBbmRFZGdlcyhub2RlcyBhcyBOb2RlW10sIFtdKVxuICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgbm9kZXMsXG4gICAgICBlZGdlczogW10sXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=