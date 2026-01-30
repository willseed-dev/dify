"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const _1 = require(".");
const IMAGE_SOURCES = [
    'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'400\'><rect width=\'600\' height=\'400\' fill=\'%23E0EAFF\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'48\' fill=\'%23455675\'>Dataset</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'400\'><rect width=\'600\' height=\'400\' fill=\'%23FEF7C3\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'48\' fill=\'%237A5B00\'>Playground</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'400\'><rect width=\'600\' height=\'400\' fill=\'%23D5F5F6\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'48\' fill=\'%23045C63\'>Workflow</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'400\'><rect width=\'600\' height=\'400\' fill=\'%23FCE7F6\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'48\' fill=\'%238E2F63\'>Prompts</text></svg>',
];
const meta = {
    title: 'Base/Data Display/ImageGallery',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Responsive thumbnail grid with lightbox preview for larger imagery.',
            },
            source: {
                language: 'tsx',
                code: `
<ImageGallery srcs={[
  'data:image/svg+xml;utf8,<svg ... fill=%23E0EAFF ...>',
  'data:image/svg+xml;utf8,<svg ... fill=%23FEF7C3 ...>',
]} />
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
    args: {
        srcs: IMAGE_SOURCES,
    },
};
exports.default = meta;
exports.Default = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUE0QjtBQUU1QixNQUFNLGFBQWEsR0FBRztJQUNwQix5VEFBeVQ7SUFDelQsNFRBQTRUO0lBQzVULDBUQUEwVDtJQUMxVCx5VEFBeVQ7Q0FDMVQsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLGdDQUFnQztJQUN2QyxTQUFTLEVBQUUsVUFBWTtJQUN2QixVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLHFFQUFxRTthQUNqRjtZQUNELE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7O1NBS0wsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLGFBQWE7S0FDcEI7Q0FDa0MsQ0FBQTtBQUVyQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLE9BQU8sR0FBVSxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgSW1hZ2VHYWxsZXJ5IGZyb20gJy4nXG5cbmNvbnN0IElNQUdFX1NPVVJDRVMgPSBbXG4gICdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPVxcJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFwnIHdpZHRoPVxcJzYwMFxcJyBoZWlnaHQ9XFwnNDAwXFwnPjxyZWN0IHdpZHRoPVxcJzYwMFxcJyBoZWlnaHQ9XFwnNDAwXFwnIGZpbGw9XFwnJTIzRTBFQUZGXFwnLz48dGV4dCB4PVxcJzUwJVxcJyB5PVxcJzUwJVxcJyBkb21pbmFudC1iYXNlbGluZT1cXCdtaWRkbGVcXCcgdGV4dC1hbmNob3I9XFwnbWlkZGxlXFwnIGZvbnQtZmFtaWx5PVxcJ3NhbnMtc2VyaWZcXCcgZm9udC1zaXplPVxcJzQ4XFwnIGZpbGw9XFwnJTIzNDU1Njc1XFwnPkRhdGFzZXQ8L3RleHQ+PC9zdmc+JyxcbiAgJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XFwnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXCcgd2lkdGg9XFwnNjAwXFwnIGhlaWdodD1cXCc0MDBcXCc+PHJlY3Qgd2lkdGg9XFwnNjAwXFwnIGhlaWdodD1cXCc0MDBcXCcgZmlsbD1cXCclMjNGRUY3QzNcXCcvPjx0ZXh0IHg9XFwnNTAlXFwnIHk9XFwnNTAlXFwnIGRvbWluYW50LWJhc2VsaW5lPVxcJ21pZGRsZVxcJyB0ZXh0LWFuY2hvcj1cXCdtaWRkbGVcXCcgZm9udC1mYW1pbHk9XFwnc2Fucy1zZXJpZlxcJyBmb250LXNpemU9XFwnNDhcXCcgZmlsbD1cXCclMjM3QTVCMDBcXCc+UGxheWdyb3VuZDwvdGV4dD48L3N2Zz4nLFxuICAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cXCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcJyB3aWR0aD1cXCc2MDBcXCcgaGVpZ2h0PVxcJzQwMFxcJz48cmVjdCB3aWR0aD1cXCc2MDBcXCcgaGVpZ2h0PVxcJzQwMFxcJyBmaWxsPVxcJyUyM0Q1RjVGNlxcJy8+PHRleHQgeD1cXCc1MCVcXCcgeT1cXCc1MCVcXCcgZG9taW5hbnQtYmFzZWxpbmU9XFwnbWlkZGxlXFwnIHRleHQtYW5jaG9yPVxcJ21pZGRsZVxcJyBmb250LWZhbWlseT1cXCdzYW5zLXNlcmlmXFwnIGZvbnQtc2l6ZT1cXCc0OFxcJyBmaWxsPVxcJyUyMzA0NUM2M1xcJz5Xb3JrZmxvdzwvdGV4dD48L3N2Zz4nLFxuICAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cXCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcJyB3aWR0aD1cXCc2MDBcXCcgaGVpZ2h0PVxcJzQwMFxcJz48cmVjdCB3aWR0aD1cXCc2MDBcXCcgaGVpZ2h0PVxcJzQwMFxcJyBmaWxsPVxcJyUyM0ZDRTdGNlxcJy8+PHRleHQgeD1cXCc1MCVcXCcgeT1cXCc1MCVcXCcgZG9taW5hbnQtYmFzZWxpbmU9XFwnbWlkZGxlXFwnIHRleHQtYW5jaG9yPVxcJ21pZGRsZVxcJyBmb250LWZhbWlseT1cXCdzYW5zLXNlcmlmXFwnIGZvbnQtc2l6ZT1cXCc0OFxcJyBmaWxsPVxcJyUyMzhFMkY2M1xcJz5Qcm9tcHRzPC90ZXh0Pjwvc3ZnPicsXG5dXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIERpc3BsYXkvSW1hZ2VHYWxsZXJ5JyxcbiAgY29tcG9uZW50OiBJbWFnZUdhbGxlcnksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdSZXNwb25zaXZlIHRodW1ibmFpbCBncmlkIHdpdGggbGlnaHRib3ggcHJldmlldyBmb3IgbGFyZ2VyIGltYWdlcnkuJyxcbiAgICAgIH0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48SW1hZ2VHYWxsZXJ5IHNyY3M9e1tcbiAgJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgLi4uIGZpbGw9JTIzRTBFQUZGIC4uLj4nLFxuICAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyAuLi4gZmlsbD0lMjNGRUY3QzMgLi4uPicsXG5dfSAvPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdzOiB7XG4gICAgc3JjczogSU1BR0VfU09VUkNFUyxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEltYWdlR2FsbGVyeT5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7fVxuIl19