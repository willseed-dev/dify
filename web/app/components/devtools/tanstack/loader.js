"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TanStackDevtoolsLoader = void 0;
const react_1 = require("react");
const config_1 = require("@/config");
const TanStackDevtoolsWrapper = (0, react_1.lazy)(() => Promise.resolve().then(() => require('./devtools')).then(module => ({
    default: module.TanStackDevtoolsWrapper,
})));
const TanStackDevtoolsLoader = () => {
    if (!config_1.IS_DEV)
        return null;
    return (<react_1.Suspense fallback={null}>
      <TanStackDevtoolsWrapper />
    </react_1.Suspense>);
};
exports.TanStackDevtoolsLoader = TanStackDevtoolsLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOzs7QUFFWixpQ0FBc0M7QUFDdEMscUNBQWlDO0FBRWpDLE1BQU0sdUJBQXVCLEdBQUcsSUFBQSxZQUFJLEVBQUMsR0FBRyxFQUFFLENBQ3hDLHFDQUFPLFlBQVksR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLE9BQU8sRUFBRSxNQUFNLENBQUMsdUJBQXVCO0NBQ3hDLENBQUMsQ0FBQyxDQUNKLENBQUE7QUFFTSxNQUFNLHNCQUFzQixHQUFHLEdBQUcsRUFBRTtJQUN6QyxJQUFJLENBQUMsZUFBTTtRQUNULE9BQU8sSUFBSSxDQUFBO0lBRWIsT0FBTyxDQUNMLENBQUMsZ0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDdkI7TUFBQSxDQUFDLHVCQUF1QixDQUFDLEFBQUQsRUFDMUI7SUFBQSxFQUFFLGdCQUFRLENBQUMsQ0FDWixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBVFksUUFBQSxzQkFBc0IsMEJBU2xDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBJU19ERVYgfSBmcm9tICdAL2NvbmZpZydcblxuY29uc3QgVGFuU3RhY2tEZXZ0b29sc1dyYXBwZXIgPSBsYXp5KCgpID0+XG4gIGltcG9ydCgnLi9kZXZ0b29scycpLnRoZW4obW9kdWxlID0+ICh7XG4gICAgZGVmYXVsdDogbW9kdWxlLlRhblN0YWNrRGV2dG9vbHNXcmFwcGVyLFxuICB9KSksXG4pXG5cbmV4cG9ydCBjb25zdCBUYW5TdGFja0RldnRvb2xzTG9hZGVyID0gKCkgPT4ge1xuICBpZiAoIUlTX0RFVilcbiAgICByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPFN1c3BlbnNlIGZhbGxiYWNrPXtudWxsfT5cbiAgICAgIDxUYW5TdGFja0RldnRvb2xzV3JhcHBlciAvPlxuICAgIDwvU3VzcGVuc2U+XG4gIClcbn1cbiJdfQ==