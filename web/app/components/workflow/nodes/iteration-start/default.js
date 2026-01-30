"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: -1,
    type: types_1.BlockEnum.IterationStart,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyREFBMkQ7QUFDM0QsMkRBQWlFO0FBRWpFLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ1IsSUFBSSxFQUFFLGlCQUFTLENBQUMsY0FBYztDQUMvQixDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBd0M7SUFDdkQsUUFBUTtJQUNSLFlBQVksRUFBRSxFQUFFO0lBQ2hCLFVBQVU7UUFDUixPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEl0ZXJhdGlvblN0YXJ0Tm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdlbk5vZGVNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG5cbmNvbnN0IG1ldGFEYXRhID0gZ2VuTm9kZU1ldGFEYXRhKHtcbiAgc29ydDogLTEsXG4gIHR5cGU6IEJsb2NrRW51bS5JdGVyYXRpb25TdGFydCxcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8SXRlcmF0aW9uU3RhcnROb2RlVHlwZT4gPSB7XG4gIG1ldGFEYXRhLFxuICBkZWZhdWx0VmFsdWU6IHt9LFxuICBjaGVja1ZhbGlkKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbm9kZURlZmF1bHRcbiJdfQ==