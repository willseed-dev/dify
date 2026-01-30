"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const use_dsl_drag_drop_1 = require("./use-dsl-drag-drop");
describe('useDSLDragDrop', () => {
    let container;
    let mockOnDSLFileDropped;
    beforeEach(() => {
        vi.clearAllMocks();
        container = document.createElement('div');
        document.body.appendChild(container);
        mockOnDSLFileDropped = vi.fn();
    });
    afterEach(() => {
        document.body.removeChild(container);
    });
    // Helper to create drag events
    const createDragEvent = (type, files = []) => {
        const dataTransfer = {
            types: files.length > 0 ? ['Files'] : [],
            files,
        };
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'dataTransfer', {
            value: dataTransfer,
            writable: false,
        });
        Object.defineProperty(event, 'preventDefault', {
            value: vi.fn(),
            writable: false,
        });
        Object.defineProperty(event, 'stopPropagation', {
            value: vi.fn(),
            writable: false,
        });
        return event;
    };
    // Helper to create a mock file
    const createMockFile = (name) => {
        return new File(['content'], name, { type: 'application/x-yaml' });
    };
    describe('Basic functionality', () => {
        it('should return dragging state', () => {
            const containerRef = { current: container };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            expect(result.current.dragging).toBe(false);
        });
        it('should initialize with dragging as false', () => {
            const containerRef = { current: container };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            expect(result.current.dragging).toBe(false);
        });
    });
    describe('Drag events', () => {
        it('should set dragging to true on dragenter with files', () => {
            const containerRef = { current: container };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const file = createMockFile('test.yaml');
            const event = createDragEvent('dragenter', [file]);
            (0, react_1.act)(() => {
                container.dispatchEvent(event);
            });
            expect(result.current.dragging).toBe(true);
        });
        it('should not set dragging on dragenter without files', () => {
            const containerRef = { current: container };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const event = createDragEvent('dragenter', []);
            (0, react_1.act)(() => {
                container.dispatchEvent(event);
            });
            expect(result.current.dragging).toBe(false);
        });
        it('should handle dragover event', () => {
            const containerRef = { current: container };
            (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const event = createDragEvent('dragover');
            (0, react_1.act)(() => {
                container.dispatchEvent(event);
            });
            expect(event.preventDefault).toHaveBeenCalled();
            expect(event.stopPropagation).toHaveBeenCalled();
        });
        it('should set dragging to false on dragleave when leaving container', () => {
            const containerRef = { current: container };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            // First, enter with files
            const enterEvent = createDragEvent('dragenter', [createMockFile('test.yaml')]);
            (0, react_1.act)(() => {
                container.dispatchEvent(enterEvent);
            });
            expect(result.current.dragging).toBe(true);
            // Then leave with null relatedTarget (leaving container)
            const leaveEvent = createDragEvent('dragleave');
            Object.defineProperty(leaveEvent, 'relatedTarget', {
                value: null,
                writable: false,
            });
            (0, react_1.act)(() => {
                container.dispatchEvent(leaveEvent);
            });
            expect(result.current.dragging).toBe(false);
        });
        it('should not set dragging to false on dragleave when within container', () => {
            const containerRef = { current: container };
            const childElement = document.createElement('div');
            container.appendChild(childElement);
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            // First, enter with files
            const enterEvent = createDragEvent('dragenter', [createMockFile('test.yaml')]);
            (0, react_1.act)(() => {
                container.dispatchEvent(enterEvent);
            });
            expect(result.current.dragging).toBe(true);
            // Then leave but to a child element
            const leaveEvent = createDragEvent('dragleave');
            Object.defineProperty(leaveEvent, 'relatedTarget', {
                value: childElement,
                writable: false,
            });
            (0, react_1.act)(() => {
                container.dispatchEvent(leaveEvent);
            });
            expect(result.current.dragging).toBe(true);
            container.removeChild(childElement);
        });
    });
    describe('Drop functionality', () => {
        it('should call onDSLFileDropped for .yaml file', () => {
            const containerRef = { current: container };
            (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const file = createMockFile('test.yaml');
            const dropEvent = createDragEvent('drop', [file]);
            (0, react_1.act)(() => {
                container.dispatchEvent(dropEvent);
            });
            expect(mockOnDSLFileDropped).toHaveBeenCalledWith(file);
        });
        it('should call onDSLFileDropped for .yml file', () => {
            const containerRef = { current: container };
            (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const file = createMockFile('test.yml');
            const dropEvent = createDragEvent('drop', [file]);
            (0, react_1.act)(() => {
                container.dispatchEvent(dropEvent);
            });
            expect(mockOnDSLFileDropped).toHaveBeenCalledWith(file);
        });
        it('should call onDSLFileDropped for uppercase .YAML file', () => {
            const containerRef = { current: container };
            (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const file = createMockFile('test.YAML');
            const dropEvent = createDragEvent('drop', [file]);
            (0, react_1.act)(() => {
                container.dispatchEvent(dropEvent);
            });
            expect(mockOnDSLFileDropped).toHaveBeenCalledWith(file);
        });
        it('should not call onDSLFileDropped for non-yaml file', () => {
            const containerRef = { current: container };
            (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const file = createMockFile('test.json');
            const dropEvent = createDragEvent('drop', [file]);
            (0, react_1.act)(() => {
                container.dispatchEvent(dropEvent);
            });
            expect(mockOnDSLFileDropped).not.toHaveBeenCalled();
        });
        it('should set dragging to false on drop', () => {
            const containerRef = { current: container };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            // First, enter with files
            const enterEvent = createDragEvent('dragenter', [createMockFile('test.yaml')]);
            (0, react_1.act)(() => {
                container.dispatchEvent(enterEvent);
            });
            expect(result.current.dragging).toBe(true);
            // Then drop
            const dropEvent = createDragEvent('drop', [createMockFile('test.yaml')]);
            (0, react_1.act)(() => {
                container.dispatchEvent(dropEvent);
            });
            expect(result.current.dragging).toBe(false);
        });
        it('should handle drop with no dataTransfer', () => {
            const containerRef = { current: container };
            (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const event = new Event('drop', { bubbles: true, cancelable: true });
            Object.defineProperty(event, 'dataTransfer', {
                value: null,
                writable: false,
            });
            Object.defineProperty(event, 'preventDefault', {
                value: vi.fn(),
                writable: false,
            });
            Object.defineProperty(event, 'stopPropagation', {
                value: vi.fn(),
                writable: false,
            });
            (0, react_1.act)(() => {
                container.dispatchEvent(event);
            });
            expect(mockOnDSLFileDropped).not.toHaveBeenCalled();
        });
        it('should handle drop with empty files array', () => {
            const containerRef = { current: container };
            (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const dropEvent = createDragEvent('drop', []);
            (0, react_1.act)(() => {
                container.dispatchEvent(dropEvent);
            });
            expect(mockOnDSLFileDropped).not.toHaveBeenCalled();
        });
        it('should only process the first file when multiple files are dropped', () => {
            const containerRef = { current: container };
            (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const file1 = createMockFile('test1.yaml');
            const file2 = createMockFile('test2.yaml');
            const dropEvent = createDragEvent('drop', [file1, file2]);
            (0, react_1.act)(() => {
                container.dispatchEvent(dropEvent);
            });
            expect(mockOnDSLFileDropped).toHaveBeenCalledTimes(1);
            expect(mockOnDSLFileDropped).toHaveBeenCalledWith(file1);
        });
    });
    describe('Enabled prop', () => {
        it('should not add event listeners when enabled is false', () => {
            const containerRef = { current: container };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
                enabled: false,
            }));
            const file = createMockFile('test.yaml');
            const enterEvent = createDragEvent('dragenter', [file]);
            (0, react_1.act)(() => {
                container.dispatchEvent(enterEvent);
            });
            expect(result.current.dragging).toBe(false);
        });
        it('should return dragging as false when enabled is false even if state is true', () => {
            const containerRef = { current: container };
            const { result, rerender } = (0, react_1.renderHook)(({ enabled }) => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
                enabled,
            }), { initialProps: { enabled: true } });
            // Set dragging state
            const enterEvent = createDragEvent('dragenter', [createMockFile('test.yaml')]);
            (0, react_1.act)(() => {
                container.dispatchEvent(enterEvent);
            });
            expect(result.current.dragging).toBe(true);
            // Disable the hook
            rerender({ enabled: false });
            expect(result.current.dragging).toBe(false);
        });
        it('should default enabled to true', () => {
            const containerRef = { current: container };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            const enterEvent = createDragEvent('dragenter', [createMockFile('test.yaml')]);
            (0, react_1.act)(() => {
                container.dispatchEvent(enterEvent);
            });
            expect(result.current.dragging).toBe(true);
        });
    });
    describe('Cleanup', () => {
        it('should remove event listeners on unmount', () => {
            const containerRef = { current: container };
            const removeEventListenerSpy = vi.spyOn(container, 'removeEventListener');
            const { unmount } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            unmount();
            expect(removeEventListenerSpy).toHaveBeenCalledWith('dragenter', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('dragover', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('dragleave', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('drop', expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });
    });
    describe('Edge cases', () => {
        it('should handle null containerRef', () => {
            const containerRef = { current: null };
            const { result } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            expect(result.current.dragging).toBe(false);
        });
        it('should handle containerRef changing to null', () => {
            const containerRef = { current: container };
            const { result, rerender } = (0, react_1.renderHook)(() => (0, use_dsl_drag_drop_1.useDSLDragDrop)({
                onDSLFileDropped: mockOnDSLFileDropped,
                containerRef,
            }));
            containerRef.current = null;
            rerender();
            expect(result.current.dragging).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWRzbC1kcmFnLWRyb3Auc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1kc2wtZHJhZy1kcm9wLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxrREFBd0Q7QUFDeEQsMkRBQW9EO0FBRXBELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsSUFBSSxTQUF5QixDQUFBO0lBQzdCLElBQUksb0JBQTBCLENBQUE7SUFFOUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQixTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN6QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNwQyxvQkFBb0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFFRixTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEMsQ0FBQyxDQUFDLENBQUE7SUFFRiwrQkFBK0I7SUFDL0IsTUFBTSxlQUFlLEdBQUcsQ0FBQyxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxFQUFFLEVBQUU7UUFDM0QsTUFBTSxZQUFZLEdBQUc7WUFDbkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hDLEtBQUs7U0FDTixDQUFBO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQWMsQ0FBQTtRQUMvRSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxjQUFjLEVB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biAqXG4gKiBUaGlzIGhvb2sgcHJvdmlkZXMgZHJhZy1hbmQtZHJvcCBmdW5jdGlvbmFsaXR5IGZvciBEU0wgZmlsZXMsIGVuYWJsaW5nOlxuICogLSBGaWxlIGRyYWcgZGV0ZWN0aW9uIHdpdGggdmlzdWFsIGZlZWRiYWNrIChkcmFnZ2luZyBzdGF0ZSlcbiAqIC0gWUFNTC9ZTUwgZmlsZSBmaWx0ZXJpbmcgKG9ubHkgYWNjZXB0cyAueWFtbCBhbmQgLnltbCBmaWxlcylcbiAqIC0gRW5hYmxlL2Rpc2FibGUgdG9nZ2xlIGZvciBjb25kaXRpb25hbCBkcmFnLWFuZC1kcm9wXG4gKiAtIENsZWFudXAgb24gdW5tb3VudCAocmVtb3ZlcyBldmVudCBsaXN0ZW5lcnMpXG4gKi9cbmltcG9ydCB0eXBlIHsgTW9jayB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IGFjdCwgcmVuZGVySG9vayB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyB1c2VEU0xEcmFnRHJvcCB9IGZyb20gJy4vdXNlLWRzbC1kcmFnLWRyb3AnXG5cbmRlc2NyaWJlKCd1c2VEU0xEcmFnRHJvcCcsICgpID0+IHtcbiAgbGV0IGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbiAgbGV0IG1vY2tPbkRTTEZpbGVEcm9wcGVkOiBNb2NrXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcilcbiAgICBtb2NrT25EU0xGaWxlRHJvcHBlZCA9IHZpLmZuKClcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoY29udGFpbmVyKVxuICB9KVxuXG4gIC8vIEhlbHBlciB0byBjcmVhdGUgZHJhZyBldmVudHNcbiAgY29uc3QgY3JlYXRlRHJhZ0V2ZW50ID0gKHR5cGU6IHN0cmluZywgZmlsZXM6IEZpbGVbXSA9IFtdKSA9PiB7XG4gICAgY29uc3QgZGF0YVRyYW5zZmVyID0ge1xuICAgICAgdHlwZXM6IGZpbGVzLmxlbmd0aCA+IDAgPyBbJ0ZpbGVzJ10gOiBbXSxcbiAgICAgIGZpbGVzLFxuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KHR5cGUsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZSB9KSBhcyBEcmFnRXZlbnRcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICdkYXRhVHJhbnNmZXInLCB7XG4gICAgICB2YWx1ZTogZGF0YVRyYW5zZmVyLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIH0pXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV2ZW50LCAncHJldmVudERlZmF1bHQnLCB7XG4gICAgICB2YWx1ZTogdmkuZm4oKSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICB9KVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShldmVudCwgJ3N0b3BQcm9wYWdhdGlvbicsIHtcbiAgICAgIHZhbHVlOiB2aS5mbigpLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIH0pXG5cbiAgICByZXR1cm4gZXZlbnRcbiAgfVxuXG4gIC8vIEhlbHBlciB0byBjcmVhdGUgYSBtb2NrIGZpbGVcbiAgY29uc3QgY3JlYXRlTW9ja0ZpbGUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBGaWxlKFsnY29udGVudCddLCBuYW1lLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi94LXlhbWwnIH0pXG4gIH1cblxuICBkZXNjcmliZSgnQmFzaWMgZnVuY3Rpb25hbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBkcmFnZ2luZyBzdGF0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlZiA9IHsgY3VycmVudDogY29udGFpbmVyIH1cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURTTERyYWdEcm9wKHtcbiAgICAgICAgICBvbkRTTEZpbGVEcm9wcGVkOiBtb2NrT25EU0xGaWxlRHJvcHBlZCxcbiAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZHJhZ2dpbmcpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGRyYWdnaW5nIGFzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0geyBjdXJyZW50OiBjb250YWluZXIgfVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlRFNMRHJhZ0Ryb3Aoe1xuICAgICAgICAgIG9uRFNMRmlsZURyb3BwZWQ6IG1vY2tPbkRTTEZpbGVEcm9wcGVkLFxuICAgICAgICAgIGNvbnRhaW5lclJlZixcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kcmFnZ2luZykudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdEcmFnIGV2ZW50cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNldCBkcmFnZ2luZyB0byB0cnVlIG9uIGRyYWdlbnRlciB3aXRoIGZpbGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0geyBjdXJyZW50OiBjb250YWluZXIgfVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlRFNMRHJhZ0Ryb3Aoe1xuICAgICAgICAgIG9uRFNMRmlsZURyb3BwZWQ6IG1vY2tPbkRTTEZpbGVEcm9wcGVkLFxuICAgICAgICAgIGNvbnRhaW5lclJlZixcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSgndGVzdC55YW1sJylcbiAgICAgIGNvbnN0IGV2ZW50ID0gY3JlYXRlRHJhZ0V2ZW50KCdkcmFnZW50ZXInLCBbZmlsZV0pXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRyYWdnaW5nKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNldCBkcmFnZ2luZyBvbiBkcmFnZW50ZXIgd2l0aG91dCBmaWxlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlZiA9IHsgY3VycmVudDogY29udGFpbmVyIH1cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURTTERyYWdEcm9wKHtcbiAgICAgICAgICBvbkRTTEZpbGVEcm9wcGVkOiBtb2NrT25EU0xGaWxlRHJvcHBlZCxcbiAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBjb25zdCBldmVudCA9IGNyZWF0ZURyYWdFdmVudCgnZHJhZ2VudGVyJywgW10pXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRyYWdnaW5nKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkcmFnb3ZlciBldmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlZiA9IHsgY3VycmVudDogY29udGFpbmVyIH1cbiAgICAgIHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlRFNMRHJhZ0Ryb3Aoe1xuICAgICAgICAgIG9uRFNMRmlsZURyb3BwZWQ6IG1vY2tPbkRTTEZpbGVEcm9wcGVkLFxuICAgICAgICAgIGNvbnRhaW5lclJlZixcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGV2ZW50ID0gY3JlYXRlRHJhZ0V2ZW50KCdkcmFnb3ZlcicpXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KGV2ZW50LnByZXZlbnREZWZhdWx0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChldmVudC5zdG9wUHJvcGFnYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBkcmFnZ2luZyB0byBmYWxzZSBvbiBkcmFnbGVhdmUgd2hlbiBsZWF2aW5nIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlZiA9IHsgY3VycmVudDogY29udGFpbmVyIH1cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURTTERyYWdEcm9wKHtcbiAgICAgICAgICBvbkRTTEZpbGVEcm9wcGVkOiBtb2NrT25EU0xGaWxlRHJvcHBlZCxcbiAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBGaXJzdCwgZW50ZXIgd2l0aCBmaWxlc1xuICAgICAgY29uc3QgZW50ZXJFdmVudCA9IGNyZWF0ZURyYWdFdmVudCgnZHJhZ2VudGVyJywgW2NyZWF0ZU1vY2tGaWxlKCd0ZXN0LnlhbWwnKV0pXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kcmFnZ2luZykudG9CZSh0cnVlKVxuXG4gICAgICAvLyBUaGVuIGxlYXZlIHdpdGggbnVsbCByZWxhdGVkVGFyZ2V0IChsZWF2aW5nIGNvbnRhaW5lcilcbiAgICAgIGNvbnN0IGxlYXZlRXZlbnQgPSBjcmVhdGVEcmFnRXZlbnQoJ2RyYWdsZWF2ZScpXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGVhdmVFdmVudCwgJ3JlbGF0ZWRUYXJnZXQnLCB7XG4gICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuZGlzcGF0Y2hFdmVudChsZWF2ZUV2ZW50KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRyYWdnaW5nKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzZXQgZHJhZ2dpbmcgdG8gZmFsc2Ugb24gZHJhZ2xlYXZlIHdoZW4gd2l0aGluIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlZiA9IHsgY3VycmVudDogY29udGFpbmVyIH1cbiAgICAgIGNvbnN0IGNoaWxkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VEU0xEcmFnRHJvcCh7XG4gICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgY29udGFpbmVyUmVmLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gRmlyc3QsIGVudGVyIHdpdGggZmlsZXNcbiAgICAgIGNvbnN0IGVudGVyRXZlbnQgPSBjcmVhdGVEcmFnRXZlbnQoJ2RyYWdlbnRlcicsIFtjcmVhdGVNb2NrRmlsZSgndGVzdC55YW1sJyldKVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgY29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZW50ZXJFdmVudClcbiAgICAgIH0pXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZHJhZ2dpbmcpLnRvQmUodHJ1ZSlcblxuICAgICAgLy8gVGhlbiBsZWF2ZSBidXQgdG8gYSBjaGlsZCBlbGVtZW50XG4gICAgICBjb25zdCBsZWF2ZUV2ZW50ID0gY3JlYXRlRHJhZ0V2ZW50KCdkcmFnbGVhdmUnKVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxlYXZlRXZlbnQsICdyZWxhdGVkVGFyZ2V0Jywge1xuICAgICAgICB2YWx1ZTogY2hpbGRFbGVtZW50LFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuZGlzcGF0Y2hFdmVudChsZWF2ZUV2ZW50KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRyYWdnaW5nKS50b0JlKHRydWUpXG5cbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjaGlsZEVsZW1lbnQpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRHJvcCBmdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkRTTEZpbGVEcm9wcGVkIGZvciAueWFtbCBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0geyBjdXJyZW50OiBjb250YWluZXIgfVxuICAgICAgcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VEU0xEcmFnRHJvcCh7XG4gICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgY29udGFpbmVyUmVmLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tGaWxlKCd0ZXN0LnlhbWwnKVxuICAgICAgY29uc3QgZHJvcEV2ZW50ID0gY3JlYXRlRHJhZ0V2ZW50KCdkcm9wJywgW2ZpbGVdKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuZGlzcGF0Y2hFdmVudChkcm9wRXZlbnQpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja09uRFNMRmlsZURyb3BwZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZpbGUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkRTTEZpbGVEcm9wcGVkIGZvciAueW1sIGZpbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXJSZWYgPSB7IGN1cnJlbnQ6IGNvbnRhaW5lciB9XG4gICAgICByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURTTERyYWdEcm9wKHtcbiAgICAgICAgICBvbkRTTEZpbGVEcm9wcGVkOiBtb2NrT25EU0xGaWxlRHJvcHBlZCxcbiAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoJ3Rlc3QueW1sJylcbiAgICAgIGNvbnN0IGRyb3BFdmVudCA9IGNyZWF0ZURyYWdFdmVudCgnZHJvcCcsIFtmaWxlXSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgY29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZHJvcEV2ZW50KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KG1vY2tPbkRTTEZpbGVEcm9wcGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25EU0xGaWxlRHJvcHBlZCBmb3IgdXBwZXJjYXNlIC5ZQU1MIGZpbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXJSZWYgPSB7IGN1cnJlbnQ6IGNvbnRhaW5lciB9XG4gICAgICByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURTTERyYWdEcm9wKHtcbiAgICAgICAgICBvbkRTTEZpbGVEcm9wcGVkOiBtb2NrT25EU0xGaWxlRHJvcHBlZCxcbiAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoJ3Rlc3QuWUFNTCcpXG4gICAgICBjb25zdCBkcm9wRXZlbnQgPSBjcmVhdGVEcmFnRXZlbnQoJ2Ryb3AnLCBbZmlsZV0pXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGRyb3BFdmVudClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChtb2NrT25EU0xGaWxlRHJvcHBlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmlsZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkRTTEZpbGVEcm9wcGVkIGZvciBub24teWFtbCBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0geyBjdXJyZW50OiBjb250YWluZXIgfVxuICAgICAgcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VEU0xEcmFnRHJvcCh7XG4gICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgY29udGFpbmVyUmVmLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tGaWxlKCd0ZXN0Lmpzb24nKVxuICAgICAgY29uc3QgZHJvcEV2ZW50ID0gY3JlYXRlRHJhZ0V2ZW50KCdkcm9wJywgW2ZpbGVdKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuZGlzcGF0Y2hFdmVudChkcm9wRXZlbnQpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja09uRFNMRmlsZURyb3BwZWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZXQgZHJhZ2dpbmcgdG8gZmFsc2Ugb24gZHJvcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlZiA9IHsgY3VycmVudDogY29udGFpbmVyIH1cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURTTERyYWdEcm9wKHtcbiAgICAgICAgICBvbkRTTEZpbGVEcm9wcGVkOiBtb2NrT25EU0xGaWxlRHJvcHBlZCxcbiAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBGaXJzdCwgZW50ZXIgd2l0aCBmaWxlc1xuICAgICAgY29uc3QgZW50ZXJFdmVudCA9IGNyZWF0ZURyYWdFdmVudCgnZHJhZ2VudGVyJywgW2NyZWF0ZU1vY2tGaWxlKCd0ZXN0LnlhbWwnKV0pXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kcmFnZ2luZykudG9CZSh0cnVlKVxuXG4gICAgICAvLyBUaGVuIGRyb3BcbiAgICAgIGNvbnN0IGRyb3BFdmVudCA9IGNyZWF0ZURyYWdFdmVudCgnZHJvcCcsIFtjcmVhdGVNb2NrRmlsZSgndGVzdC55YW1sJyldKVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgY29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZHJvcEV2ZW50KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRyYWdnaW5nKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkcm9wIHdpdGggbm8gZGF0YVRyYW5zZmVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0geyBjdXJyZW50OiBjb250YWluZXIgfVxuICAgICAgcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VEU0xEcmFnRHJvcCh7XG4gICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgY29udGFpbmVyUmVmLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgZXZlbnQgPSBuZXcgRXZlbnQoJ2Ryb3AnLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUgfSkgYXMgRHJhZ0V2ZW50XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICdkYXRhVHJhbnNmZXInLCB7XG4gICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB9KVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV2ZW50LCAncHJldmVudERlZmF1bHQnLCB7XG4gICAgICAgIHZhbHVlOiB2aS5mbigpLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB9KVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV2ZW50LCAnc3RvcFByb3BhZ2F0aW9uJywge1xuICAgICAgICB2YWx1ZTogdmkuZm4oKSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgY29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja09uRFNMRmlsZURyb3BwZWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZHJvcCB3aXRoIGVtcHR5IGZpbGVzIGFycmF5JywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0geyBjdXJyZW50OiBjb250YWluZXIgfVxuICAgICAgcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VEU0xEcmFnRHJvcCh7XG4gICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgY29udGFpbmVyUmVmLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgZHJvcEV2ZW50ID0gY3JlYXRlRHJhZ0V2ZW50KCdkcm9wJywgW10pXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGRyb3BFdmVudClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChtb2NrT25EU0xGaWxlRHJvcHBlZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9ubHkgcHJvY2VzcyB0aGUgZmlyc3QgZmlsZSB3aGVuIG11bHRpcGxlIGZpbGVzIGFyZSBkcm9wcGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0geyBjdXJyZW50OiBjb250YWluZXIgfVxuICAgICAgcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VEU0xEcmFnRHJvcCh7XG4gICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgY29udGFpbmVyUmVmLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgZmlsZTEgPSBjcmVhdGVNb2NrRmlsZSgndGVzdDEueWFtbCcpXG4gICAgICBjb25zdCBmaWxlMiA9IGNyZWF0ZU1vY2tGaWxlKCd0ZXN0Mi55YW1sJylcbiAgICAgIGNvbnN0IGRyb3BFdmVudCA9IGNyZWF0ZURyYWdFdmVudCgnZHJvcCcsIFtmaWxlMSwgZmlsZTJdKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuZGlzcGF0Y2hFdmVudChkcm9wRXZlbnQpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja09uRFNMRmlsZURyb3BwZWQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tPbkRTTEZpbGVEcm9wcGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlMSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFbmFibGVkIHByb3AnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3QgYWRkIGV2ZW50IGxpc3RlbmVycyB3aGVuIGVuYWJsZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXJSZWYgPSB7IGN1cnJlbnQ6IGNvbnRhaW5lciB9XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VEU0xEcmFnRHJvcCh7XG4gICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgY29udGFpbmVyUmVmLFxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tGaWxlKCd0ZXN0LnlhbWwnKVxuICAgICAgY29uc3QgZW50ZXJFdmVudCA9IGNyZWF0ZURyYWdFdmVudCgnZHJhZ2VudGVyJywgW2ZpbGVdKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRyYWdnaW5nKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBkcmFnZ2luZyBhcyBmYWxzZSB3aGVuIGVuYWJsZWQgaXMgZmFsc2UgZXZlbiBpZiBzdGF0ZSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0geyBjdXJyZW50OiBjb250YWluZXIgfVxuICAgICAgY29uc3QgeyByZXN1bHQsIHJlcmVuZGVyIH0gPSByZW5kZXJIb29rKFxuICAgICAgICAoeyBlbmFibGVkIH0pID0+XG4gICAgICAgICAgdXNlRFNMRHJhZ0Ryb3Aoe1xuICAgICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgICAgICBlbmFibGVkLFxuICAgICAgICAgIH0pLFxuICAgICAgICB7IGluaXRpYWxQcm9wczogeyBlbmFibGVkOiB0cnVlIH0gfSxcbiAgICAgIClcblxuICAgICAgLy8gU2V0IGRyYWdnaW5nIHN0YXRlXG4gICAgICBjb25zdCBlbnRlckV2ZW50ID0gY3JlYXRlRHJhZ0V2ZW50KCdkcmFnZW50ZXInLCBbY3JlYXRlTW9ja0ZpbGUoJ3Rlc3QueWFtbCcpXSlcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGVudGVyRXZlbnQpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRyYWdnaW5nKS50b0JlKHRydWUpXG5cbiAgICAgIC8vIERpc2FibGUgdGhlIGhvb2tcbiAgICAgIHJlcmVuZGVyKHsgZW5hYmxlZDogZmFsc2UgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kcmFnZ2luZykudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkZWZhdWx0IGVuYWJsZWQgdG8gdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlZiA9IHsgY3VycmVudDogY29udGFpbmVyIH1cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURTTERyYWdEcm9wKHtcbiAgICAgICAgICBvbkRTTEZpbGVEcm9wcGVkOiBtb2NrT25EU0xGaWxlRHJvcHBlZCxcbiAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBjb25zdCBlbnRlckV2ZW50ID0gY3JlYXRlRHJhZ0V2ZW50KCdkcmFnZW50ZXInLCBbY3JlYXRlTW9ja0ZpbGUoJ3Rlc3QueWFtbCcpXSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgY29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZW50ZXJFdmVudClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kcmFnZ2luZykudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NsZWFudXAnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgZXZlbnQgbGlzdGVuZXJzIG9uIHVubW91bnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXJSZWYgPSB7IGN1cnJlbnQ6IGNvbnRhaW5lciB9XG4gICAgICBjb25zdCByZW1vdmVFdmVudExpc3RlbmVyU3B5ID0gdmkuc3B5T24oY29udGFpbmVyLCAncmVtb3ZlRXZlbnRMaXN0ZW5lcicpXG5cbiAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VEU0xEcmFnRHJvcCh7XG4gICAgICAgICAgb25EU0xGaWxlRHJvcHBlZDogbW9ja09uRFNMRmlsZURyb3BwZWQsXG4gICAgICAgICAgY29udGFpbmVyUmVmLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgdW5tb3VudCgpXG5cbiAgICAgIGV4cGVjdChyZW1vdmVFdmVudExpc3RlbmVyU3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZHJhZ2VudGVyJywgZXhwZWN0LmFueShGdW5jdGlvbikpXG4gICAgICBleHBlY3QocmVtb3ZlRXZlbnRMaXN0ZW5lclNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2RyYWdvdmVyJywgZXhwZWN0LmFueShGdW5jdGlvbikpXG4gICAgICBleHBlY3QocmVtb3ZlRXZlbnRMaXN0ZW5lclNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2RyYWdsZWF2ZScsIGV4cGVjdC5hbnkoRnVuY3Rpb24pKVxuICAgICAgZXhwZWN0KHJlbW92ZUV2ZW50TGlzdGVuZXJTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdkcm9wJywgZXhwZWN0LmFueShGdW5jdGlvbikpXG5cbiAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJTcHkubW9ja1Jlc3RvcmUoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgY2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBjb250YWluZXJSZWYnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXJSZWYgPSB7IGN1cnJlbnQ6IG51bGwgfVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlRFNMRHJhZ0Ryb3Aoe1xuICAgICAgICAgIG9uRFNMRmlsZURyb3BwZWQ6IG1vY2tPbkRTTEZpbGVEcm9wcGVkLFxuICAgICAgICAgIGNvbnRhaW5lclJlZixcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kcmFnZ2luZykudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29udGFpbmVyUmVmIGNoYW5naW5nIHRvIG51bGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXJSZWYgPSB7IGN1cnJlbnQ6IGNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCB8IG51bGwgfVxuICAgICAgY29uc3QgeyByZXN1bHQsIHJlcmVuZGVyIH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURTTERyYWdEcm9wKHtcbiAgICAgICAgICBvbkRTTEZpbGVEcm9wcGVkOiBtb2NrT25EU0xGaWxlRHJvcHBlZCxcbiAgICAgICAgICBjb250YWluZXJSZWYsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBjb250YWluZXJSZWYuY3VycmVudCA9IG51bGxcbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRyYWdnaW5nKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG59KVxuIl19