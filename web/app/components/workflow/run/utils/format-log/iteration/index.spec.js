"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("es-toolkit/function");
const _1 = require(".");
const graph_to_log_struct_1 = require("../graph-to-log-struct");
describe('iteration', () => {
    const list = (0, graph_to_log_struct_1.default)('start -> (iteration, iterationNode, plainNode1 -> plainNode2)');
    // const [startNode, iterationNode, ...iterations] = list
    const result = (0, _1.default)(list, function_1.noop);
    it('result should have no nodes in iteration node', () => {
        expect(result.find((item) => !!item.execution_metadata?.iteration_id)).toBeUndefined();
    });
    // test('iteration should put nodes in details', () => {
    //   expect(result as any).toEqual([
    //     startNode,
    //     {
    //       ...iterationNode,
    //       details: [
    //         [iterations[0], iterations[1]],
    //       ],
    //     },
    //   ])
    // })
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrREFBMEM7QUFDMUMsd0JBQXNCO0FBQ3RCLGdFQUFxRDtBQUVyRCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixNQUFNLElBQUksR0FBRyxJQUFBLDZCQUFnQixFQUFDLCtEQUErRCxDQUFDLENBQUE7SUFDOUYseURBQXlEO0lBQ3pELE1BQU0sTUFBTSxHQUFHLElBQUEsVUFBTSxFQUFDLElBQVcsRUFBRSxlQUFJLENBQUMsQ0FBQTtJQUN4QyxFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1FBQ3ZELE1BQU0sQ0FBRSxNQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDdEcsQ0FBQyxDQUFDLENBQUE7SUFDRix3REFBd0Q7SUFDeEQsb0NBQW9DO0lBQ3BDLGlCQUFpQjtJQUNqQixRQUFRO0lBQ1IsMEJBQTBCO0lBQzFCLG1CQUFtQjtJQUNuQiwwQ0FBMEM7SUFDMUMsV0FBVztJQUNYLFNBQVM7SUFDVCxPQUFPO0lBQ1AsS0FBSztBQUNQLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbm9vcCB9IGZyb20gJ2VzLXRvb2xraXQvZnVuY3Rpb24nXG5pbXBvcnQgZm9ybWF0IGZyb20gJy4nXG5pbXBvcnQgZ3JhcGhUb0xvZ1N0cnVjdCBmcm9tICcuLi9ncmFwaC10by1sb2ctc3RydWN0J1xuXG5kZXNjcmliZSgnaXRlcmF0aW9uJywgKCkgPT4ge1xuICBjb25zdCBsaXN0ID0gZ3JhcGhUb0xvZ1N0cnVjdCgnc3RhcnQgLT4gKGl0ZXJhdGlvbiwgaXRlcmF0aW9uTm9kZSwgcGxhaW5Ob2RlMSAtPiBwbGFpbk5vZGUyKScpXG4gIC8vIGNvbnN0IFtzdGFydE5vZGUsIGl0ZXJhdGlvbk5vZGUsIC4uLml0ZXJhdGlvbnNdID0gbGlzdFxuICBjb25zdCByZXN1bHQgPSBmb3JtYXQobGlzdCBhcyBhbnksIG5vb3ApXG4gIGl0KCdyZXN1bHQgc2hvdWxkIGhhdmUgbm8gbm9kZXMgaW4gaXRlcmF0aW9uIG5vZGUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KChyZXN1bHQgYXMgYW55KS5maW5kKChpdGVtOiBhbnkpID0+ICEhaXRlbS5leGVjdXRpb25fbWV0YWRhdGE/Lml0ZXJhdGlvbl9pZCkpLnRvQmVVbmRlZmluZWQoKVxuICB9KVxuICAvLyB0ZXN0KCdpdGVyYXRpb24gc2hvdWxkIHB1dCBub2RlcyBpbiBkZXRhaWxzJywgKCkgPT4ge1xuICAvLyAgIGV4cGVjdChyZXN1bHQgYXMgYW55KS50b0VxdWFsKFtcbiAgLy8gICAgIHN0YXJ0Tm9kZSxcbiAgLy8gICAgIHtcbiAgLy8gICAgICAgLi4uaXRlcmF0aW9uTm9kZSxcbiAgLy8gICAgICAgZGV0YWlsczogW1xuICAvLyAgICAgICAgIFtpdGVyYXRpb25zWzBdLCBpdGVyYXRpb25zWzFdXSxcbiAgLy8gICAgICAgXSxcbiAgLy8gICAgIH0sXG4gIC8vICAgXSlcbiAgLy8gfSlcbn0pXG4iXX0=