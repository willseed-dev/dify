"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: 0.1,
    type: types_1.BlockEnum.Start,
    isStart: true,
    isRequired: false,
    isSingleton: true,
    isTypeFixed: false, // support node type change for start node(user input)
    helpLinkUri: 'user-input',
});
const nodeDefault = {
    metaData,
    defaultValue: {
        variables: [],
    },
    checkValid() {
        return {
            isValid: true,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyREFBMkQ7QUFDM0QsMkRBQWlFO0FBRWpFLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxpQkFBUyxDQUFDLEtBQUs7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixVQUFVLEVBQUUsS0FBSztJQUNqQixXQUFXLEVBQUUsSUFBSTtJQUNqQixXQUFXLEVBQUUsS0FBSyxFQUFFLHNEQUFzRDtJQUMxRSxXQUFXLEVBQUUsWUFBWTtDQUMxQixDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBK0I7SUFDOUMsUUFBUTtJQUNSLFlBQVksRUFBRTtRQUNaLFNBQVMsRUFBRSxFQUFFO0tBQ2Q7SUFDRCxVQUFVO1FBQ1IsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb2RlRGVmYXVsdCB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBTdGFydE5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIHNvcnQ6IDAuMSxcbiAgdHlwZTogQmxvY2tFbnVtLlN0YXJ0LFxuICBpc1N0YXJ0OiB0cnVlLFxuICBpc1JlcXVpcmVkOiBmYWxzZSxcbiAgaXNTaW5nbGV0b246IHRydWUsXG4gIGlzVHlwZUZpeGVkOiBmYWxzZSwgLy8gc3VwcG9ydCBub2RlIHR5cGUgY2hhbmdlIGZvciBzdGFydCBub2RlKHVzZXIgaW5wdXQpXG4gIGhlbHBMaW5rVXJpOiAndXNlci1pbnB1dCcsXG59KVxuY29uc3Qgbm9kZURlZmF1bHQ6IE5vZGVEZWZhdWx0PFN0YXJ0Tm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgdmFyaWFibGVzOiBbXSxcbiAgfSxcbiAgY2hlY2tWYWxpZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVEZWZhdWx0XG4iXX0=