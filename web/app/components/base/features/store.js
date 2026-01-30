"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeaturesStore = void 0;
const zustand_1 = require("zustand");
const app_1 = require("@/types/app");
const createFeaturesStore = (initProps) => {
    const DEFAULT_PROPS = {
        features: {
            moreLikeThis: {
                enabled: false,
            },
            opening: {
                enabled: false,
            },
            suggested: {
                enabled: false,
            },
            text2speech: {
                enabled: false,
            },
            speech2text: {
                enabled: false,
            },
            citation: {
                enabled: false,
            },
            moderation: {
                enabled: false,
            },
            file: {
                image: {
                    enabled: false,
                    detail: app_1.Resolution.high,
                    number_limits: 3,
                    transfer_methods: [app_1.TransferMethod.local_file, app_1.TransferMethod.remote_url],
                },
            },
            annotationReply: {
                enabled: false,
            },
        },
    };
    return (0, zustand_1.createStore)()(set => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setFeatures: features => set(() => ({ features })),
        showFeaturesModal: false,
        setShowFeaturesModal: showFeaturesModal => set(() => ({ showFeaturesModal })),
    }));
};
exports.createFeaturesStore = createFeaturesStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBcUM7QUFDckMscUNBQXdEO0FBbUJqRCxNQUFNLG1CQUFtQixHQUFHLENBQUMsU0FBa0MsRUFBRSxFQUFFO0lBQ3hFLE1BQU0sYUFBYSxHQUFrQjtRQUNuQyxRQUFRLEVBQUU7WUFDUixZQUFZLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLEtBQUs7YUFDZjtZQUNELE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUUsS0FBSzthQUNmO1lBQ0QsU0FBUyxFQUFFO2dCQUNULE9BQU8sRUFBRSxLQUFLO2FBQ2Y7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsT0FBTyxFQUFFLEtBQUs7YUFDZjtZQUNELFdBQVcsRUFBRTtnQkFDWCxPQUFPLEVBQUUsS0FBSzthQUNmO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxLQUFLO2FBQ2Y7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLEtBQUs7YUFDZjtZQUNELElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsTUFBTSxFQUFFLGdCQUFVLENBQUMsSUFBSTtvQkFDdkIsYUFBYSxFQUFFLENBQUM7b0JBQ2hCLGdCQUFnQixFQUFFLENBQUMsb0JBQWMsQ0FBQyxVQUFVLEVBQUUsb0JBQWMsQ0FBQyxVQUFVLENBQUM7aUJBQ3pFO2FBQ0Y7WUFDRCxlQUFlLEVBQUU7Z0JBQ2YsT0FBTyxFQUFFLEtBQUs7YUFDZjtTQUNGO0tBQ0YsQ0FBQTtJQUNELE9BQU8sSUFBQSxxQkFBVyxHQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QyxHQUFHLGFBQWE7UUFDaEIsR0FBRyxTQUFTO1FBQ1osV0FBVyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0tBQzlFLENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyxDQUFBO0FBNUNZLFFBQUEsbUJBQW1CLHVCQTRDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZlYXR1cmVzIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnenVzdGFuZCdcbmltcG9ydCB7IFJlc29sdXRpb24sIFRyYW5zZmVyTWV0aG9kIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5cbmV4cG9ydCB0eXBlIEZlYXR1cmVzTW9kYWwgPSB7XG4gIHNob3dGZWF0dXJlc01vZGFsOiBib29sZWFuXG4gIHNldFNob3dGZWF0dXJlc01vZGFsOiAoc2hvd0ZlYXR1cmVzTW9kYWw6IGJvb2xlYW4pID0+IHZvaWRcbn1cblxuZXhwb3J0IHR5cGUgRmVhdHVyZXNTdGF0ZSA9IHtcbiAgZmVhdHVyZXM6IEZlYXR1cmVzXG59XG5cbmV4cG9ydCB0eXBlIEZlYXR1cmVzQWN0aW9uID0ge1xuICBzZXRGZWF0dXJlczogKGZlYXR1cmVzOiBGZWF0dXJlcykgPT4gdm9pZFxufVxuXG5leHBvcnQgdHlwZSBGZWF0dXJlU3RvcmVTdGF0ZSA9IEZlYXR1cmVzU3RhdGUgJiBGZWF0dXJlc0FjdGlvbiAmIEZlYXR1cmVzTW9kYWxcblxuZXhwb3J0IHR5cGUgRmVhdHVyZXNTdG9yZSA9IFJldHVyblR5cGU8dHlwZW9mIGNyZWF0ZUZlYXR1cmVzU3RvcmU+XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVGZWF0dXJlc1N0b3JlID0gKGluaXRQcm9wcz86IFBhcnRpYWw8RmVhdHVyZXNTdGF0ZT4pID0+IHtcbiAgY29uc3QgREVGQVVMVF9QUk9QUzogRmVhdHVyZXNTdGF0ZSA9IHtcbiAgICBmZWF0dXJlczoge1xuICAgICAgbW9yZUxpa2VUaGlzOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIG9wZW5pbmc6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgc3VnZ2VzdGVkOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHRleHQyc3BlZWNoOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHNwZWVjaDJ0ZXh0OiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGNpdGF0aW9uOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIG1vZGVyYXRpb246IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgZmlsZToge1xuICAgICAgICBpbWFnZToge1xuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIGRldGFpbDogUmVzb2x1dGlvbi5oaWdoLFxuICAgICAgICAgIG51bWJlcl9saW1pdHM6IDMsXG4gICAgICAgICAgdHJhbnNmZXJfbWV0aG9kczogW1RyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsIFRyYW5zZmVyTWV0aG9kLnJlbW90ZV91cmxdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFubm90YXRpb25SZXBseToge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxuICByZXR1cm4gY3JlYXRlU3RvcmU8RmVhdHVyZVN0b3JlU3RhdGU+KCkoc2V0ID0+ICh7XG4gICAgLi4uREVGQVVMVF9QUk9QUyxcbiAgICAuLi5pbml0UHJvcHMsXG4gICAgc2V0RmVhdHVyZXM6IGZlYXR1cmVzID0+IHNldCgoKSA9PiAoeyBmZWF0dXJlcyB9KSksXG4gICAgc2hvd0ZlYXR1cmVzTW9kYWw6IGZhbHNlLFxuICAgIHNldFNob3dGZWF0dXJlc01vZGFsOiBzaG93RmVhdHVyZXNNb2RhbCA9PiBzZXQoKCkgPT4gKHsgc2hvd0ZlYXR1cmVzTW9kYWwgfSkpLFxuICB9KSlcbn1cbiJdfQ==