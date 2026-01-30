"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const jsdom_testing_mocks_1 = require("jsdom-testing-mocks");
require("@testing-library/jest-dom/vitest");
(0, jsdom_testing_mocks_1.mockResizeObserver)();
// Mock Web Animations API for Headless UI
(0, jsdom_testing_mocks_1.mockAnimationsApi)();
// Suppress act() warnings from @headlessui/react internal Transition component
// These warnings are caused by Headless UI's internal async state updates, not our code
const originalConsoleError = console.error;
console.error = (...args) => {
    // Check all arguments for the Headless UI TransitionRootFn act warning
    const fullMessage = args.map(arg => (typeof arg === 'string' ? arg : '')).join(' ');
    if (fullMessage.includes('TransitionRootFn') && fullMessage.includes('not wrapped in act'))
        return;
    originalConsoleError.apply(console, args);
};
// Fix for @headlessui/react compatibility with happy-dom
// headlessui tries to override focus properties which may be read-only in happy-dom
if (typeof window !== 'undefined') {
    // Provide a minimal animations API polyfill before @headlessui/react boots
    if (typeof Element !== 'undefined' && !Element.prototype.getAnimations)
        Element.prototype.getAnimations = () => [];
    if (!document.getAnimations)
        document.getAnimations = () => [];
    const ensureWritable = (target, prop) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, prop);
        if (descriptor && !descriptor.writable) {
            const original = descriptor.value ?? descriptor.get?.call(target);
            Object.defineProperty(target, prop, {
                value: typeof original === 'function' ? original : vi.fn(),
                writable: true,
                configurable: true,
            });
        }
    };
    ensureWritable(window, 'focus');
    ensureWritable(HTMLElement.prototype, 'focus');
}
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
        observe() {
            return undefined;
        }
        unobserve() {
            return undefined;
        }
        disconnect() {
            return undefined;
        }
    };
}
// Mock IntersectionObserver for tests
if (typeof globalThis.IntersectionObserver === 'undefined') {
    globalThis.IntersectionObserver = class {
        constructor(_callback, _options) {
            this.root = null;
            this.rootMargin = '';
            this.thresholds = [];
        }
        observe() { }
        unobserve() { }
        disconnect() { }
        takeRecords() { return []; }
    };
}
// Mock Element.scrollIntoView for tests (not available in happy-dom/jsdom)
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView)
    Element.prototype.scrollIntoView = function () { };
afterEach(() => {
    (0, react_1.cleanup)();
});
// mock next/image to avoid width/height requirements for data URLs
vi.mock('next/image');
// mock react-i18next
vi.mock('react-i18next', async () => {
    const actual = await vi.importActual('react-i18next');
    const { createReactI18nextMock } = await Promise.resolve().then(() => require('./test/i18n-mock'));
    return {
        ...actual,
        ...createReactI18nextMock(),
    };
});
// mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
// Mock localStorage for testing
const createMockLocalStorage = () => {
    const storage = {};
    return {
        getItem: vi.fn((key) => storage[key] || null),
        setItem: vi.fn((key, value) => {
            storage[key] = value;
        }),
        removeItem: vi.fn((key) => {
            delete storage[key];
        }),
        clear: vi.fn(() => {
            Object.keys(storage).forEach(key => delete storage[key]);
        }),
        get storage() { return { ...storage }; },
    };
};
let mockLocalStorage;
beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage = createMockLocalStorage();
    Object.defineProperty(globalThis, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
        configurable: true,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidml0ZXN0LnNldHVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidml0ZXN0LnNldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQWdEO0FBQ2hELDZEQUEyRTtBQUMzRSw0Q0FBeUM7QUFFekMsSUFBQSx3Q0FBa0IsR0FBRSxDQUFBO0FBRXBCLDBDQUEwQztBQUMxQyxJQUFBLHVDQUFpQixHQUFFLENBQUE7QUFFbkIsK0VBQStFO0FBQy9FLHdGQUF3RjtBQUN4RixNQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUE7QUFDMUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBZSxFQUFFLEVBQUU7SUFDckMsdUVBQXVFO0lBQ3ZFLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNuRixJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDO1FBQ3hGLE9BQU07SUFDUixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzNDLENBQUMsQ0FBQTtBQUVELHlEQUF5RDtBQUN6RCxvRkFBb0Y7QUFDcEYsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUUsQ0FBQztJQUNsQywyRUFBMkU7SUFDM0UsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWE7UUFDcEUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFBO0lBRTVDLElBQUksQ0FBQyxRQUFR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QU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDMUQsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUEsQ0FBQyxDQUFDO0tBQ3hDLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxJQUFJLGdCQUEyRCxDQUFBO0FBRS9ELFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDbEIsZ0JBQWdCLEdBQUcsc0JBQXNCLEVBQUUsQ0FBQTtJQUMzQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUU7UUFDaEQsS0FBSyxFQUFFLGdCQUFnQjtRQUN2QixRQUFRLEVBQUUsSUFBSTtRQUNkLFlBQVksRUFBRSxJQUFJO0tBQ25CLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xlYW51cCB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBtb2NrQW5pbWF0aW9uc0FwaSwgbW9ja1Jlc2l6ZU9ic2VydmVyIH0gZnJvbSAnanNkb20tdGVzdGluZy1tb2NrcydcbmltcG9ydCAnQHRlc3RpbmctbGlicmFyeS9qZXN0LWRvbS92aXRlc3QnXG5cbm1vY2tSZXNpemVPYnNlcnZlcigpXG5cbi8vIE1vY2sgV2ViIEFuaW1hdGlvbnMgQVBJIGZvciBIZWFkbGVzcyBVSVxubW9ja0FuaW1hdGlvbnNBcGkoKVxuXG4vLyBTdXBwcmVzcyBhY3QoKSB3YXJuaW5ncyBmcm9tIEBoZWFkbGVzc3VpL3JlYWN0IGludGVybmFsIFRyYW5zaXRpb24gY29tcG9uZW50XG4vLyBUaGVzZSB3YXJuaW5ncyBhcmUgY2F1c2VkIGJ5IEhlYWRsZXNzIFVJJ3MgaW50ZXJuYWwgYXN5bmMgc3RhdGUgdXBkYXRlcywgbm90IG91ciBjb2RlXG5jb25zdCBvcmlnaW5hbENvbnNvbGVFcnJvciA9IGNvbnNvbGUuZXJyb3JcbmNvbnNvbGUuZXJyb3IgPSAoLi4uYXJnczogdW5rbm93bltdKSA9PiB7XG4gIC8vIENoZWNrIGFsbCBhcmd1bWVudHMgZm9yIHRoZSBIZWFkbGVzcyBVSSBUcmFuc2l0aW9uUm9vdEZuIGFjdCB3YXJuaW5nXG4gIGNvbnN0IGZ1bGxNZXNzYWdlID0gYXJncy5tYXAoYXJnID0+ICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyA/IGFyZyA6ICcnKSkuam9pbignICcpXG4gIGlmIChmdWxsTWVzc2FnZS5pbmNsdWRlcygnVHJhbnNpdGlvblJvb3RGbicpICYmIGZ1bGxNZXNzYWdlLmluY2x1ZGVzKCdub3Qgd3JhcHBlZCBpbiBhY3QnKSlcbiAgICByZXR1cm5cbiAgb3JpZ2luYWxDb25zb2xlRXJyb3IuYXBwbHkoY29uc29sZSwgYXJncylcbn1cblxuLy8gRml4IGZvciBAaGVhZGxlc3N1aS9yZWFjdCBjb21wYXRpYmlsaXR5IHdpdGggaGFwcHktZG9tXG4vLyBoZWFkbGVzc3VpIHRyaWVzIHRvIG92ZXJyaWRlIGZvY3VzIHByb3BlcnRpZXMgd2hpY2ggbWF5IGJlIHJlYWQtb25seSBpbiBoYXBweS1kb21cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAvLyBQcm92aWRlIGEgbWluaW1hbCBhbmltYXRpb25zIEFQSSBwb2x5ZmlsbCBiZWZvcmUgQGhlYWRsZXNzdWkvcmVhY3QgYm9vdHNcbiAgaWYgKHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhRWxlbWVudC5wcm90b3R5cGUuZ2V0QW5pbWF0aW9ucylcbiAgICBFbGVtZW50LnByb3RvdHlwZS5nZXRBbmltYXRpb25zID0gKCkgPT4gW11cblxuICBpZiAoIWRvY3VtZW50LmdldEFuaW1hdGlvbnMpXG4gICAgZG9jdW1lbnQuZ2V0QW5pbWF0aW9ucyA9ICgpID0+IFtdXG5cbiAgY29uc3QgZW5zdXJlV3JpdGFibGUgPSAodGFyZ2V0OiBvYmplY3QsIHByb3A6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcClcbiAgICBpZiAoZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci53cml0YWJsZSkge1xuICAgICAgY29uc3Qgb3JpZ2luYWwgPSBkZXNjcmlwdG9yLnZhbHVlID8/IGRlc2NyaXB0b3IuZ2V0Py5jYWxsKHRhcmdldClcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3AsIHtcbiAgICAgICAgdmFsdWU6IHR5cGVvZiBvcmlnaW5hbCA9PT0gJ2Z1bmN0aW9uJyA/IG9yaWdpbmFsIDogdmkuZm4oKSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZW5zdXJlV3JpdGFibGUod2luZG93LCAnZm9jdXMnKVxuICBlbnN1cmVXcml0YWJsZShIVE1MRWxlbWVudC5wcm90b3R5cGUsICdmb2N1cycpXG59XG5cbmlmICh0eXBlb2YgZ2xvYmFsVGhpcy5SZXNpemVPYnNlcnZlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgZ2xvYmFsVGhpcy5SZXNpemVPYnNlcnZlciA9IGNsYXNzIHtcbiAgICBvYnNlcnZlKCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHVub2JzZXJ2ZSgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0KCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgfVxufVxuXG4vLyBNb2NrIEludGVyc2VjdGlvbk9ic2VydmVyIGZvciB0ZXN0c1xuaWYgKHR5cGVvZiBnbG9iYWxUaGlzLkludGVyc2VjdGlvbk9ic2VydmVyID09PSAndW5kZWZpbmVkJykge1xuICBnbG9iYWxUaGlzLkludGVyc2VjdGlvbk9ic2VydmVyID0gY2xhc3Mge1xuICAgIHJlYWRvbmx5IHJvb3Q6IEVsZW1lbnQgfCBEb2N1bWVudCB8IG51bGwgPSBudWxsXG4gICAgcmVhZG9ubHkgcm9vdE1hcmdpbjogc3RyaW5nID0gJydcbiAgICByZWFkb25seSB0aHJlc2hvbGRzOiBSZWFkb25seUFycmF5PG51bWJlcj4gPSBbXVxuICAgIGNvbnN0cnVjdG9yKF9jYWxsYmFjazogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjaywgX29wdGlvbnM/OiBJbnRlcnNlY3Rpb25PYnNlcnZlckluaXQpIHsgLyogbm9vcCAqLyB9XG4gICAgb2JzZXJ2ZSgpIHsgLyogbm9vcCAqLyB9XG4gICAgdW5vYnNlcnZlKCkgeyAvKiBub29wICovIH1cbiAgICBkaXNjb25uZWN0KCkgeyAvKiBub29wICovIH1cbiAgICB0YWtlUmVjb3JkcygpOiBJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5W10geyByZXR1cm4gW10gfVxuICB9XG59XG5cbi8vIE1vY2sgRWxlbWVudC5zY3JvbGxJbnRvVmlldyBmb3IgdGVzdHMgKG5vdCBhdmFpbGFibGUgaW4gaGFwcHktZG9tL2pzZG9tKVxuaWYgKHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsSW50b1ZpZXcpXG4gIEVsZW1lbnQucHJvdG90eXBlLnNjcm9sbEludG9WaWV3ID0gZnVuY3Rpb24gKCkgeyAvKiBub29wICovIH1cblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgY2xlYW51cCgpXG59KVxuXG4vLyBtb2NrIG5leHQvaW1hZ2UgdG8gYXZvaWQgd2lkdGgvaGVpZ2h0IHJlcXVpcmVtZW50cyBmb3IgZGF0YSBVUkxzXG52aS5tb2NrKCduZXh0L2ltYWdlJylcblxuLy8gbW9jayByZWFjdC1pMThuZXh0XG52aS5tb2NrKCdyZWFjdC1pMThuZXh0JywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBhY3R1YWwgPSBhd2FpdCB2aS5pbXBvcnRBY3R1YWw8dHlwZW9mIGltcG9ydCgncmVhY3QtaTE4bmV4dCcpPigncmVhY3QtaTE4bmV4dCcpXG4gIGNvbnN0IHsgY3JlYXRlUmVhY3RJMThuZXh0TW9jayB9ID0gYXdhaXQgaW1wb3J0KCcuL3Rlc3QvaTE4bi1tb2NrJylcbiAgcmV0dXJuIHtcbiAgICAuLi5hY3R1YWwsXG4gICAgLi4uY3JlYXRlUmVhY3RJMThuZXh0TW9jaygpLFxuICB9XG59KVxuXG4vLyBtb2NrIHdpbmRvdy5tYXRjaE1lZGlhXG5PYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbWF0Y2hNZWRpYScsIHtcbiAgd3JpdGFibGU6IHRydWUsXG4gIHZhbHVlOiB2aS5mbigpLm1vY2tJbXBsZW1lbnRhdGlvbihxdWVyeSA9PiAoe1xuICAgIG1hdGNoZXM6IGZhbHNlLFxuICAgIG1lZGlhOiBxdWVyeSxcbiAgICBvbmNoYW5nZTogbnVsbCxcbiAgICBhZGRMaXN0ZW5lcjogdmkuZm4oKSwgLy8gZGVwcmVjYXRlZFxuICAgIHJlbW92ZUxpc3RlbmVyOiB2aS5mbigpLCAvLyBkZXByZWNhdGVkXG4gICAgYWRkRXZlbnRMaXN0ZW5lcjogdmkuZm4oKSxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyOiB2aS5mbigpLFxuICAgIGRpc3BhdGNoRXZlbnQ6IHZpLmZuKCksXG4gIH0pKSxcbn0pXG5cbi8vIE1vY2sgbG9jYWxTdG9yYWdlIGZvciB0ZXN0aW5nXG5jb25zdCBjcmVhdGVNb2NrTG9jYWxTdG9yYWdlID0gKCkgPT4ge1xuICBjb25zdCBzdG9yYWdlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge31cbiAgcmV0dXJuIHtcbiAgICBnZXRJdGVtOiB2aS5mbigoa2V5OiBzdHJpbmcpID0+IHN0b3JhZ2Vba2V5XSB8fCBudWxsKSxcbiAgICBzZXRJdGVtOiB2aS5mbigoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHN0b3JhZ2Vba2V5XSA9IHZhbHVlXG4gICAgfSksXG4gICAgcmVtb3ZlSXRlbTogdmkuZm4oKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICBkZWxldGUgc3RvcmFnZVtrZXldXG4gICAgfSksXG4gICAgY2xlYXI6IHZpLmZuKCgpID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKHN0b3JhZ2UpLmZvckVhY2goa2V5ID0+IGRlbGV0ZSBzdG9yYWdlW2tleV0pXG4gICAgfSksXG4gICAgZ2V0IHN0b3JhZ2UoKSB7IHJldHVybiB7IC4uLnN0b3JhZ2UgfSB9LFxuICB9XG59XG5cbmxldCBtb2NrTG9jYWxTdG9yYWdlOiBSZXR1cm5UeXBlPHR5cGVvZiBjcmVhdGVNb2NrTG9jYWxTdG9yYWdlPlxuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIG1vY2tMb2NhbFN0b3JhZ2UgPSBjcmVhdGVNb2NrTG9jYWxTdG9yYWdlKClcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbFRoaXMsICdsb2NhbFN0b3JhZ2UnLCB7XG4gICAgdmFsdWU6IG1vY2tMb2NhbFN0b3JhZ2UsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICB9KVxufSlcbiJdfQ==