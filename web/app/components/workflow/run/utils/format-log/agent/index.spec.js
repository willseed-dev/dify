"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const data_1 = require("./data");
describe('agent', () => {
    it('list should transform to tree', () => {
        // console.log(format(agentNodeData.in as any))
        expect((0, _1.default)(data_1.agentNodeData.in)).toEqual(data_1.agentNodeData.expect);
    });
    it('list should remove circle log item', () => {
        // format(oneStepCircle.in as any)
        expect((0, _1.default)(data_1.oneStepCircle.in)).toEqual(data_1.oneStepCircle.expect);
        expect((0, _1.default)(data_1.multiStepsCircle.in)).toEqual(data_1.multiStepsCircle.expect);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3QkFBc0I7QUFDdEIsaUNBQXVFO0FBRXZFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDdkMsK0NBQStDO1FBQy9DLE1BQU0sQ0FBQyxJQUFBLFVBQU0sRUFBQyxvQkFBYSxDQUFDLEVBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdkUsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1FBQzVDLGtDQUFrQztRQUNsQyxNQUFNLENBQUMsSUFBQSxVQUFNLEVBQUMsb0JBQWEsQ0FBQyxFQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JFLE1BQU0sQ0FBQyxJQUFBLFVBQU0sRUFBQyx1QkFBZ0IsQ0FBQyxFQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM3RSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZvcm1hdCBmcm9tICcuJ1xuaW1wb3J0IHsgYWdlbnROb2RlRGF0YSwgbXVsdGlTdGVwc0NpcmNsZSwgb25lU3RlcENpcmNsZSB9IGZyb20gJy4vZGF0YSdcblxuZGVzY3JpYmUoJ2FnZW50JywgKCkgPT4ge1xuICBpdCgnbGlzdCBzaG91bGQgdHJhbnNmb3JtIHRvIHRyZWUnLCAoKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coZm9ybWF0KGFnZW50Tm9kZURhdGEuaW4gYXMgYW55KSlcbiAgICBleHBlY3QoZm9ybWF0KGFnZW50Tm9kZURhdGEuaW4gYXMgYW55KSkudG9FcXVhbChhZ2VudE5vZGVEYXRhLmV4cGVjdClcbiAgfSlcblxuICBpdCgnbGlzdCBzaG91bGQgcmVtb3ZlIGNpcmNsZSBsb2cgaXRlbScsICgpID0+IHtcbiAgICAvLyBmb3JtYXQob25lU3RlcENpcmNsZS5pbiBhcyBhbnkpXG4gICAgZXhwZWN0KGZvcm1hdChvbmVTdGVwQ2lyY2xlLmluIGFzIGFueSkpLnRvRXF1YWwob25lU3RlcENpcmNsZS5leHBlY3QpXG4gICAgZXhwZWN0KGZvcm1hdChtdWx0aVN0ZXBzQ2lyY2xlLmluIGFzIGFueSkpLnRvRXF1YWwobXVsdGlTdGVwc0NpcmNsZS5leHBlY3QpXG4gIH0pXG59KVxuIl19