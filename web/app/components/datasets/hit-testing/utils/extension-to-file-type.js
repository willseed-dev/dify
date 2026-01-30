"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionToFileType = void 0;
const types_1 = require("@/app/components/base/file-uploader/types");
const extensionToFileType = (extension) => {
    switch (extension) {
        case 'pdf':
            return types_1.FileAppearanceTypeEnum.pdf;
        case 'doc':
        case 'docx':
            return types_1.FileAppearanceTypeEnum.word;
        case 'md':
        case 'mdx':
        case 'markdown':
            return types_1.FileAppearanceTypeEnum.markdown;
        case 'csv':
        case 'xls':
        case 'xlsx':
            return types_1.FileAppearanceTypeEnum.excel;
        case 'txt':
        case 'epub':
        case 'html':
        case 'htm':
        case 'xml':
            return types_1.FileAppearanceTypeEnum.document;
        case 'ppt':
        case 'pptx':
            return types_1.FileAppearanceTypeEnum.ppt;
        default:
            return types_1.FileAppearanceTypeEnum.custom;
    }
};
exports.extensionToFileType = extensionToFileType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXRvLWZpbGUtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4dGVuc2lvbi10by1maWxlLXR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQWtGO0FBRTNFLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxTQUFpQixFQUEwQixFQUFFO0lBQy9FLFFBQVEsU0FBUyxFQUFFLENBQUM7UUFDbEIsS0FBSyxLQUFLO1lBQ1IsT0FBTyw4QkFBc0IsQ0FBQyxHQUFHLENBQUE7UUFDbkMsS0FBSyxLQUFLLENBQUM7UUFDWCxLQUFLLE1BQU07WUFDVCxPQUFPLDhCQUFzQixDQUFDLElBQUksQ0FBQTtRQUNwQyxLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssS0FBSyxDQUFDO1FBQ1gsS0FBSyxVQUFVO1lBQ2IsT0FBTyw4QkFBc0IsQ0FBQyxRQUFRLENBQUE7UUFDeEMsS0FBSyxLQUFLLENBQUM7UUFDWCxLQUFLLEtBQUssQ0FBQztRQUNYLEtBQUssTUFBTTtZQUNULE9BQU8sOEJBQXNCLENBQUMsS0FBSyxDQUFBO1FBQ3JDLEtBQUssS0FBSyxDQUFDO1FBQ1gsS0FBSyxNQUFNLENBQUM7UUFDWixLQUFLLE1BQU0sQ0FBQztRQUNaLEtBQUssS0FBSyxDQUFDO1FBQ1gsS0FBSyxLQUFLO1lBQ1IsT0FBTyw4QkFBc0IsQ0FBQyxRQUFRLENBQUE7UUFDeEMsS0FBSyxLQUFLLENBQUM7UUFDWCxLQUFLLE1BQU07WUFDVCxPQUFPLDhCQUFzQixDQUFDLEdBQUcsQ0FBQTtRQUNuQztZQUNFLE9BQU8sOEJBQXNCLENBQUMsTUFBTSxDQUFBO0lBQ3hDLENBQUM7QUFDSCxDQUFDLENBQUE7QUEzQlksUUFBQSxtQkFBbUIsdUJBMkIvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZpbGVBcHBlYXJhbmNlVHlwZUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci90eXBlcydcblxuZXhwb3J0IGNvbnN0IGV4dGVuc2lvblRvRmlsZVR5cGUgPSAoZXh0ZW5zaW9uOiBzdHJpbmcpOiBGaWxlQXBwZWFyYW5jZVR5cGVFbnVtID0+IHtcbiAgc3dpdGNoIChleHRlbnNpb24pIHtcbiAgICBjYXNlICdwZGYnOlxuICAgICAgcmV0dXJuIEZpbGVBcHBlYXJhbmNlVHlwZUVudW0ucGRmXG4gICAgY2FzZSAnZG9jJzpcbiAgICBjYXNlICdkb2N4JzpcbiAgICAgIHJldHVybiBGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLndvcmRcbiAgICBjYXNlICdtZCc6XG4gICAgY2FzZSAnbWR4JzpcbiAgICBjYXNlICdtYXJrZG93bic6XG4gICAgICByZXR1cm4gRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5tYXJrZG93blxuICAgIGNhc2UgJ2Nzdic6XG4gICAgY2FzZSAneGxzJzpcbiAgICBjYXNlICd4bHN4JzpcbiAgICAgIHJldHVybiBGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmV4Y2VsXG4gICAgY2FzZSAndHh0JzpcbiAgICBjYXNlICdlcHViJzpcbiAgICBjYXNlICdodG1sJzpcbiAgICBjYXNlICdodG0nOlxuICAgIGNhc2UgJ3htbCc6XG4gICAgICByZXR1cm4gRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5kb2N1bWVudFxuICAgIGNhc2UgJ3BwdCc6XG4gICAgY2FzZSAncHB0eCc6XG4gICAgICByZXR1cm4gRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5wcHRcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uY3VzdG9tXG4gIH1cbn1cbiJdfQ==