"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: -1,
    type: types_1.BlockEnum.LoopStart,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyREFBMkQ7QUFDM0QsMkRBQWlFO0FBRWpFLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ1IsSUFBSSxFQUFFLGlCQUFTLENBQUMsU0FBUztDQUMxQixDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBbUM7SUFDbEQsUUFBUTtJQUNSLFlBQVksRUFBRSxFQUFFO0lBQ2hCLFVBQVU7UUFDUixPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IExvb3BTdGFydE5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIHNvcnQ6IC0xLFxuICB0eXBlOiBCbG9ja0VudW0uTG9vcFN0YXJ0LFxufSlcbmNvbnN0IG5vZGVEZWZhdWx0OiBOb2RlRGVmYXVsdDxMb29wU3RhcnROb2RlVHlwZT4gPSB7XG4gIG1ldGFEYXRhLFxuICBkZWZhdWx0VmFsdWU6IHt9LFxuICBjaGVja1ZhbGlkKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbm9kZURlZmF1bHRcbiJdfQ==