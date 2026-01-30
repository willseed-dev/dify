"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const _1 = require(".");
const VIDEO_SOURCES = [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/forest.mp4',
];
const meta = {
    title: 'Base/Data Display/VideoGallery',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Stacked list of video players with custom controls for progress, volume, and fullscreen.',
            },
            source: {
                language: 'tsx',
                code: `
<VideoGallery
  srcs={[
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/forest.mp4',
  ]}
/>
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
    args: {
        srcs: VIDEO_SOURCES,
    },
};
exports.default = meta;
exports.Default = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUE0QjtBQUU1QixNQUFNLGFBQWEsR0FBRztJQUNwQiwwRUFBMEU7SUFDMUUsMEVBQTBFO0NBQzNFLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSxnQ0FBZ0M7SUFDdkMsU0FBUyxFQUFFLFVBQVk7SUFDdkIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFlBQVk7UUFDcEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSwwRkFBMEY7YUFDdEc7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOzs7Ozs7O1NBT0wsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLGFBQWE7S0FDcEI7Q0FDa0MsQ0FBQTtBQUVyQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLE9BQU8sR0FBVSxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgVmlkZW9HYWxsZXJ5IGZyb20gJy4nXG5cbmNvbnN0IFZJREVPX1NPVVJDRVMgPSBbXG4gICdodHRwczovL2ludGVyYWN0aXZlLWV4YW1wbGVzLm1kbi5tb3ppbGxhLm5ldC9tZWRpYS9jYzAtdmlkZW9zL2Zsb3dlci5tcDQnLFxuICAnaHR0cHM6Ly9pbnRlcmFjdGl2ZS1leGFtcGxlcy5tZG4ubW96aWxsYS5uZXQvbWVkaWEvY2MwLXZpZGVvcy9mb3Jlc3QubXA0Jyxcbl1cblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRGlzcGxheS9WaWRlb0dhbGxlcnknLFxuICBjb21wb25lbnQ6IFZpZGVvR2FsbGVyeSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2Z1bGxzY3JlZW4nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1N0YWNrZWQgbGlzdCBvZiB2aWRlbyBwbGF5ZXJzIHdpdGggY3VzdG9tIGNvbnRyb2xzIGZvciBwcm9ncmVzcywgdm9sdW1lLCBhbmQgZnVsbHNjcmVlbi4nLFxuICAgICAgfSxcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbjxWaWRlb0dhbGxlcnlcbiAgc3Jjcz17W1xuICAgICdodHRwczovL2ludGVyYWN0aXZlLWV4YW1wbGVzLm1kbi5tb3ppbGxhLm5ldC9tZWRpYS9jYzAtdmlkZW9zL2Zsb3dlci5tcDQnLFxuICAgICdodHRwczovL2ludGVyYWN0aXZlLWV4YW1wbGVzLm1kbi5tb3ppbGxhLm5ldC9tZWRpYS9jYzAtdmlkZW9zL2ZvcmVzdC5tcDQnLFxuICBdfVxuLz5cbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnczoge1xuICAgIHNyY3M6IFZJREVPX1NPVVJDRVMsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBWaWRlb0dhbGxlcnk+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IERlZmF1bHQ6IFN0b3J5ID0ge31cbiJdfQ==