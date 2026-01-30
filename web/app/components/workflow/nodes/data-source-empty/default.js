"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: -1,
    type: types_1.BlockEnum.DataSourceEmpty,
    isUndeletable: true,
    isSingleton: true,
});
const nodeDefault = {
    metaData,
    defaultValue: {},
    checkValid() {
        return {
            isValid: true,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyREFBMkQ7QUFDM0QsMkRBQWlFO0FBRWpFLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ1IsSUFBSSxFQUFFLGlCQUFTLENBQUMsZUFBZTtJQUMvQixhQUFhLEVBQUUsSUFBSTtJQUNuQixXQUFXLEVBQUUsSUFBSTtDQUNsQixDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBeUM7SUFDeEQsUUFBUTtJQUNSLFlBQVksRUFBRSxFQUFFO0lBQ2hCLFVBQVU7UUFDUixPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IERhdGFTb3VyY2VFbXB0eU5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIHNvcnQ6IC0xLFxuICB0eXBlOiBCbG9ja0VudW0uRGF0YVNvdXJjZUVtcHR5LFxuICBpc1VuZGVsZXRhYmxlOiB0cnVlLFxuICBpc1NpbmdsZXRvbjogdHJ1ZSxcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8RGF0YVNvdXJjZUVtcHR5Tm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7fSxcbiAgY2hlY2tWYWxpZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVEZWZhdWx0XG4iXX0=