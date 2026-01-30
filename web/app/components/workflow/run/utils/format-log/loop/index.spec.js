"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("es-toolkit/function");
const _1 = require(".");
const graph_to_log_struct_1 = require("../graph-to-log-struct");
describe('loop', () => {
    const list = (0, graph_to_log_struct_1.default)('start -> (loop, loopNode, plainNode1 -> plainNode2)');
    const [startNode, loopNode, ...loops] = list;
    const result = (0, _1.default)(list, function_1.noop);
    it('result should have no nodes in loop node', () => {
        expect(result.find(item => !!item.execution_metadata?.loop_id)).toBeUndefined();
    });
    it('loop should put nodes in details', () => {
        expect(result).toEqual([
            startNode,
            {
                ...loopNode,
                details: [
                    [loops[0], loops[1]],
                ],
            },
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrREFBMEM7QUFDMUMsd0JBQXNCO0FBQ3RCLGdFQUFxRDtBQUVyRCxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNwQixNQUFNLElBQUksR0FBRyxJQUFBLDZCQUFnQixFQUFDLHFEQUFxRCxDQUFDLENBQUE7SUFDcEYsTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBQSxVQUFNLEVBQUMsSUFBVyxFQUFFLGVBQUksQ0FBQyxDQUFBO0lBQ3hDLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDbEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDakYsQ0FBQyxDQUFDLENBQUE7SUFDRixFQUFFLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1FBQzFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckIsU0FBUztZQUNUO2dCQUNFLEdBQUcsUUFBUTtnQkFDWCxPQUFPLEVBQUU7b0JBQ1AsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5vb3AgfSBmcm9tICdlcy10b29sa2l0L2Z1bmN0aW9uJ1xuaW1wb3J0IGZvcm1hdCBmcm9tICcuJ1xuaW1wb3J0IGdyYXBoVG9Mb2dTdHJ1Y3QgZnJvbSAnLi4vZ3JhcGgtdG8tbG9nLXN0cnVjdCdcblxuZGVzY3JpYmUoJ2xvb3AnLCAoKSA9PiB7XG4gIGNvbnN0IGxpc3QgPSBncmFwaFRvTG9nU3RydWN0KCdzdGFydCAtPiAobG9vcCwgbG9vcE5vZGUsIHBsYWluTm9kZTEgLT4gcGxhaW5Ob2RlMiknKVxuICBjb25zdCBbc3RhcnROb2RlLCBsb29wTm9kZSwgLi4ubG9vcHNdID0gbGlzdFxuICBjb25zdCByZXN1bHQgPSBmb3JtYXQobGlzdCBhcyBhbnksIG5vb3ApXG4gIGl0KCdyZXN1bHQgc2hvdWxkIGhhdmUgbm8gbm9kZXMgaW4gbG9vcCBub2RlJywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXN1bHQuZmluZChpdGVtID0+ICEhaXRlbS5leGVjdXRpb25fbWV0YWRhdGE/Lmxvb3BfaWQpKS50b0JlVW5kZWZpbmVkKClcbiAgfSlcbiAgaXQoJ2xvb3Agc2hvdWxkIHB1dCBub2RlcyBpbiBkZXRhaWxzJywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW1xuICAgICAgc3RhcnROb2RlLFxuICAgICAge1xuICAgICAgICAuLi5sb29wTm9kZSxcbiAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgIFtsb29wc1swXSwgbG9vcHNbMV1dLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdKVxuICB9KVxufSlcbiJdfQ==