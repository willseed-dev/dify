"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithCustomIcon = exports.Default = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/Data Display/ListEmpty',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Large empty state card used in panels and drawers to hint at the next action for the user.',
            },
        },
    },
    args: {
        title: 'No items yet',
        description: (<p className="text-xs leading-5 text-text-tertiary">
        Add your first entry to see it appear here. Empty states help users discover what happens next.
      </p>),
    },
    argTypes: {
        description: { control: false },
        icon: { control: false },
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Default = {};
exports.WithCustomIcon = {
    args: {
        title: 'Connect a data source',
        description: (<p className="text-xs leading-5 text-text-secondary">
        Choose a database, knowledge base, or upload documents to get started with retrieval.
      </p>),
        icon: (<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 text-primary-700 shadow-sm">
        {'\u{26A1}\u{FE0F}'}
      </div>),
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUF5QjtBQUV6QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSw2QkFBNkI7SUFDcEMsU0FBUyxFQUFFLFVBQVM7SUFDcEIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSw0RkFBNEY7YUFDeEc7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osS0FBSyxFQUFFLGNBQWM7UUFDckIsV0FBVyxFQUFFLENBQ1gsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUNqRDs7TUFDRixFQUFFLENBQUMsQ0FBQyxDQUNMO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO1FBQy9CLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7S0FDekI7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDYyxDQUFBO0FBRWxDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsT0FBTyxHQUFVLEVBQUUsQ0FBQTtBQUVuQixRQUFBLGNBQWMsR0FBVTtJQUNuQyxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsdUJBQXVCO1FBQzlCLFdBQVcsRUFBRSxDQUNYLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FDbEQ7O01BQ0YsRUFBRSxDQUFDLENBQUMsQ0FDTDtRQUNELElBQUksRUFBRSxDQUNKLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrSkFBa0osQ0FDL0o7UUFBQSxDQUFDLGtCQUFrQixDQUNyQjtNQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgTGlzdEVtcHR5IGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIERpc3BsYXkvTGlzdEVtcHR5JyxcbiAgY29tcG9uZW50OiBMaXN0RW1wdHksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnTGFyZ2UgZW1wdHkgc3RhdGUgY2FyZCB1c2VkIGluIHBhbmVscyBhbmQgZHJhd2VycyB0byBoaW50IGF0IHRoZSBuZXh0IGFjdGlvbiBmb3IgdGhlIHVzZXIuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHRpdGxlOiAnTm8gaXRlbXMgeWV0JyxcbiAgICBkZXNjcmlwdGlvbjogKFxuICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyBsZWFkaW5nLTUgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIEFkZCB5b3VyIGZpcnN0IGVudHJ5IHRvIHNlZSBpdCBhcHBlYXIgaGVyZS4gRW1wdHkgc3RhdGVzIGhlbHAgdXNlcnMgZGlzY292ZXIgd2hhdCBoYXBwZW5zIG5leHQuXG4gICAgICA8L3A+XG4gICAgKSxcbiAgfSxcbiAgYXJnVHlwZXM6IHtcbiAgICBkZXNjcmlwdGlvbjogeyBjb250cm9sOiBmYWxzZSB9LFxuICAgIGljb246IHsgY29udHJvbDogZmFsc2UgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgTGlzdEVtcHR5PlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHt9XG5cbmV4cG9ydCBjb25zdCBXaXRoQ3VzdG9tSWNvbjogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICB0aXRsZTogJ0Nvbm5lY3QgYSBkYXRhIHNvdXJjZScsXG4gICAgZGVzY3JpcHRpb246IChcbiAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgbGVhZGluZy01IHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgQ2hvb3NlIGEgZGF0YWJhc2UsIGtub3dsZWRnZSBiYXNlLCBvciB1cGxvYWQgZG9jdW1lbnRzIHRvIGdldCBzdGFydGVkIHdpdGggcmV0cmlldmFsLlxuICAgICAgPC9wPlxuICAgICksXG4gICAgaWNvbjogKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtOCB3LTggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbGcgYmctZ3JhZGllbnQtdG8tYnIgZnJvbS1wcmltYXJ5LTEwMCB2aWEtcHJpbWFyeS0yMDAgdG8tcHJpbWFyeS0zMDAgdGV4dC1wcmltYXJ5LTcwMCBzaGFkb3ctc21cIj5cbiAgICAgICAgeydcXHV7MjZBMX1cXHV7RkUwRn0nfVxuICAgICAgPC9kaXY+XG4gICAgKSxcbiAgfSxcbn1cbiJdfQ==