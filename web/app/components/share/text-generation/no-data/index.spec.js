"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
describe('NoData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should render empty state icon and text when mounted', () => {
        const { container } = (0, react_1.render)(<index_1.default />);
        expect(container.querySelector('svg')).toBeInTheDocument();
        expect(react_1.screen.getByText('share.generation.noData')).toBeInTheDocument();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXVEO0FBQ3ZELCtCQUE4QjtBQUM5QixtQ0FBNEI7QUFFNUIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUNGLEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDOUQsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBTSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7UUFFeEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzFELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQ3pFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBOb0RhdGEgZnJvbSAnLi9pbmRleCdcblxuZGVzY3JpYmUoJ05vRGF0YScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG4gIGl0KCdzaG91bGQgcmVuZGVyIGVtcHR5IHN0YXRlIGljb24gYW5kIHRleHQgd2hlbiBtb3VudGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPE5vRGF0YSAvPilcblxuICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnc2hhcmUuZ2VuZXJhdGlvbi5ub0RhdGEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxufSlcbiJdfQ==