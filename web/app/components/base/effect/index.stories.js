"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/Other/Effect',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Blurred circular glow used as a decorative background accent. Combine with relatively positioned containers.',
            },
            source: {
                language: 'tsx',
                code: `
<div className="relative h-40 w-72 overflow-hidden rounded-2xl bg-background-default-subtle">
  <Effect className="top-6 left-8" />
</div>
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {
    render: () => (<div className="relative h-40 w-72 overflow-hidden rounded-2xl border border-divider-subtle bg-background-default-subtle">
      <_1.default className="top-6 left-8"/>
      <_1.default className="top-14 right-10 bg-util-colors-purple-brand-purple-brand-500"/>
      <div className="absolute inset-x-0 bottom-4 flex justify-center text-xs text-text-secondary">
        Accent glow
      </div>
    </div>),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHdCQUFzQjtBQUV0QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSxtQkFBbUI7SUFDMUIsU0FBUyxFQUFFLFVBQU07SUFDakIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSw4R0FBOEc7YUFDMUg7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOzs7O1NBSUwsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDVyxDQUFBO0FBRS9CLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsVUFBVSxHQUFVO0lBQy9CLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUNaLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwR0FBMEcsQ0FDdkg7TUFBQSxDQUFDLFVBQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUNoQztNQUFBLENBQUMsVUFBTSxDQUFDLFNBQVMsQ0FBQyw4REFBOEQsRUFDaEY7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNkVBQTZFLENBQzFGOztNQUNGLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB0YWlsd2luZGNzcy9jbGFzc25hbWVzLW9yZGVyICovXG5pbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgRWZmZWN0IGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9PdGhlci9FZmZlY3QnLFxuICBjb21wb25lbnQ6IEVmZmVjdCxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0JsdXJyZWQgY2lyY3VsYXIgZ2xvdyB1c2VkIGFzIGEgZGVjb3JhdGl2ZSBiYWNrZ3JvdW5kIGFjY2VudC4gQ29tYmluZSB3aXRoIHJlbGF0aXZlbHkgcG9zaXRpb25lZCBjb250YWluZXJzLicsXG4gICAgICB9LFxuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLTQwIHctNzIgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtMnhsIGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGVcIj5cbiAgPEVmZmVjdCBjbGFzc05hbWU9XCJ0b3AtNiBsZWZ0LThcIiAvPlxuPC9kaXY+XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBFZmZlY3Q+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGgtNDAgdy03MiBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlXCI+XG4gICAgICA8RWZmZWN0IGNsYXNzTmFtZT1cInRvcC02IGxlZnQtOFwiIC8+XG4gICAgICA8RWZmZWN0IGNsYXNzTmFtZT1cInRvcC0xNCByaWdodC0xMCBiZy11dGlsLWNvbG9ycy1wdXJwbGUtYnJhbmQtcHVycGxlLWJyYW5kLTUwMFwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LXgtMCBib3R0b20tNCBmbGV4IGp1c3RpZnktY2VudGVyIHRleHQteHMgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICBBY2NlbnQgZ2xvd1xuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICksXG59XG4iXX0=