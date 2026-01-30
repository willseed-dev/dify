"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const graph_to_log_struct_1 = require("../graph-to-log-struct");
describe('retry', () => {
    // retry nodeId:1 3 times.
    const steps = (0, graph_to_log_struct_1.default)('start -> (retry, retryNode, 3)');
    const [startNode, retryNode, ...retryDetail] = steps;
    const result = (0, _1.default)(steps);
    it('should have no retry status nodes', () => {
        expect(result.find(item => item.status === 'retry')).toBeUndefined();
    });
    it('should put retry nodes in retryDetail', () => {
        expect(result).toEqual([
            startNode,
            {
                ...retryNode,
                retryDetail,
            },
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3QkFBc0I7QUFDdEIsZ0VBQXFEO0FBRXJELFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLDBCQUEwQjtJQUMxQixNQUFNLEtBQUssR0FBRyxJQUFBLDZCQUFnQixFQUFDLGdDQUFnQyxDQUFDLENBQUE7SUFDaEUsTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUE7SUFDcEQsTUFBTSxNQUFNLEdBQUcsSUFBQSxVQUFNLEVBQUMsS0FBWSxDQUFDLENBQUE7SUFDbkMsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUN0RSxDQUFDLENBQUMsQ0FBQTtJQUNGLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNyQixTQUFTO1lBQ1Q7Z0JBQ0UsR0FBRyxTQUFTO2dCQUNaLFdBQVc7YUFDWjtTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZm9ybWF0IGZyb20gJy4nXG5pbXBvcnQgZ3JhcGhUb0xvZ1N0cnVjdCBmcm9tICcuLi9ncmFwaC10by1sb2ctc3RydWN0J1xuXG5kZXNjcmliZSgncmV0cnknLCAoKSA9PiB7XG4gIC8vIHJldHJ5IG5vZGVJZDoxIDMgdGltZXMuXG4gIGNvbnN0IHN0ZXBzID0gZ3JhcGhUb0xvZ1N0cnVjdCgnc3RhcnQgLT4gKHJldHJ5LCByZXRyeU5vZGUsIDMpJylcbiAgY29uc3QgW3N0YXJ0Tm9kZSwgcmV0cnlOb2RlLCAuLi5yZXRyeURldGFpbF0gPSBzdGVwc1xuICBjb25zdCByZXN1bHQgPSBmb3JtYXQoc3RlcHMgYXMgYW55KVxuICBpdCgnc2hvdWxkIGhhdmUgbm8gcmV0cnkgc3RhdHVzIG5vZGVzJywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXN1bHQuZmluZChpdGVtID0+IGl0ZW0uc3RhdHVzID09PSAncmV0cnknKSkudG9CZVVuZGVmaW5lZCgpXG4gIH0pXG4gIGl0KCdzaG91bGQgcHV0IHJldHJ5IG5vZGVzIGluIHJldHJ5RGV0YWlsJywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW1xuICAgICAgc3RhcnROb2RlLFxuICAgICAge1xuICAgICAgICAuLi5yZXRyeU5vZGUsXG4gICAgICAgIHJldHJ5RGV0YWlsLFxuICAgICAgfSxcbiAgICBdKVxuICB9KVxufSlcbiJdfQ==