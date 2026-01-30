"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePipelineTemplate = void 0;
const react_i18next_1 = require("react-i18next");
const constants_1 = require("@/app/components/workflow/constants");
const default_1 = require("@/app/components/workflow/nodes/knowledge-base/default");
const utils_1 = require("@/app/components/workflow/utils");
const usePipelineTemplate = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { newNode: knowledgeBaseNode } = (0, utils_1.generateNewNode)({
        id: 'knowledgeBase',
        data: {
            ...default_1.default.defaultValue,
            type: default_1.default.metaData.type,
            title: t(`blocks.${default_1.default.metaData.type}`, { ns: 'workflow' }),
            selected: true,
        },
        position: {
            x: constants_1.START_INITIAL_POSITION.x + 500,
            y: constants_1.START_INITIAL_POSITION.y,
        },
    });
    return {
        nodes: [knowledgeBaseNode],
        edges: [],
    };
};
exports.usePipelineTemplate = usePipelineTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBpcGVsaW5lLXRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXBpcGVsaW5lLXRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlEQUE4QztBQUM5QyxtRUFFNEM7QUFDNUMsb0ZBQXlGO0FBQ3pGLDJEQUFpRTtBQUUxRCxNQUFNLG1CQUFtQixHQUFHLEdBQUcsRUFBRTtJQUN0QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsTUFBTSxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxHQUFHLElBQUEsdUJBQWUsRUFBQztRQUNyRCxFQUFFLEVBQUUsZUFBZTtRQUNuQixJQUFJLEVBQUU7WUFDSixHQUFHLGlCQUFvQixDQUFDLFlBQXFDO1lBQzdELElBQUksRUFBRSxpQkFBb0IsQ0FBQyxRQUFRLENBQUMsSUFBSTtZQUN4QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFVBQVUsaUJBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDO1lBQzVFLFFBQVEsRUFBRSxJQUFJO1NBQ2Y7UUFDRCxRQUFRLEVBQUU7WUFDUixDQUFDLEVBQUUsa0NBQXNCLENBQUMsQ0FBQyxHQUFHLEdBQUc7WUFDakMsQ0FBQyxFQUFFLGtDQUFzQixDQUFDLENBQUM7U0FDNUI7S0FDRixDQUFDLENBQUE7SUFFRixPQUFPO1FBQ0wsS0FBSyxFQUFFLENBQUMsaUJBQWlCLENBQUM7UUFDMUIsS0FBSyxFQUFFLEVBQUU7S0FDVixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBckJZLFFBQUEsbUJBQW1CLHVCQXFCL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEtub3dsZWRnZUJhc2VOb2RlVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMva25vd2xlZGdlLWJhc2UvdHlwZXMnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQge1xuICBTVEFSVF9JTklUSUFMX1BPU0lUSU9OLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2NvbnN0YW50cydcbmltcG9ydCBrbm93bGVkZ2VCYXNlRGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1iYXNlL2RlZmF1bHQnXG5pbXBvcnQgeyBnZW5lcmF0ZU5ld05vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuXG5leHBvcnQgY29uc3QgdXNlUGlwZWxpbmVUZW1wbGF0ZSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgY29uc3QgeyBuZXdOb2RlOiBrbm93bGVkZ2VCYXNlTm9kZSB9ID0gZ2VuZXJhdGVOZXdOb2RlKHtcbiAgICBpZDogJ2tub3dsZWRnZUJhc2UnLFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmtub3dsZWRnZUJhc2VEZWZhdWx0LmRlZmF1bHRWYWx1ZSBhcyBLbm93bGVkZ2VCYXNlTm9kZVR5cGUsXG4gICAgICB0eXBlOiBrbm93bGVkZ2VCYXNlRGVmYXVsdC5tZXRhRGF0YS50eXBlLFxuICAgICAgdGl0bGU6IHQoYGJsb2Nrcy4ke2tub3dsZWRnZUJhc2VEZWZhdWx0Lm1ldGFEYXRhLnR5cGV9YCwgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgIHNlbGVjdGVkOiB0cnVlLFxuICAgIH0sXG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IFNUQVJUX0lOSVRJQUxfUE9TSVRJT04ueCArIDUwMCxcbiAgICAgIHk6IFNUQVJUX0lOSVRJQUxfUE9TSVRJT04ueSxcbiAgICB9LFxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgbm9kZXM6IFtrbm93bGVkZ2VCYXNlTm9kZV0sXG4gICAgZWRnZXM6IFtdLFxuICB9XG59XG4iXX0=