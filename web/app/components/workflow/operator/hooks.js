"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOperator = void 0;
const react_1 = require("react");
const app_context_1 = require("@/context/app-context");
const constants_1 = require("../note-node/constants");
const types_1 = require("../note-node/types");
const store_1 = require("../store");
const utils_1 = require("../utils");
const useOperator = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { userProfile } = (0, app_context_1.useAppContext)();
    const handleAddNote = (0, react_1.useCallback)(() => {
        const { newNode } = (0, utils_1.generateNewNode)({
            type: constants_1.CUSTOM_NOTE_NODE,
            data: {
                title: '',
                desc: '',
                type: '',
                text: '',
                theme: types_1.NoteTheme.blue,
                author: userProfile?.name || '',
                showAuthor: true,
                width: 240,
                height: 88,
                _isCandidate: true,
            },
            position: {
                x: 0,
                y: 0,
            },
        });
        workflowStore.setState({
            candidateNode: newNode,
        });
    }, [workflowStore, userProfile]);
    return {
        handleAddNote,
    };
};
exports.useOperator = useOperator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBbUM7QUFDbkMsdURBQXFEO0FBQ3JELHNEQUF5RDtBQUN6RCw4Q0FBOEM7QUFDOUMsb0NBQTJDO0FBQzNDLG9DQUEwQztBQUVuQyxNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7SUFDOUIsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQ3hDLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFBLDJCQUFhLEdBQUUsQ0FBQTtJQUV2QyxNQUFNLGFBQWEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3JDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFBLHVCQUFlLEVBQUM7WUFDbEMsSUFBSSxFQUFFLDRCQUFnQjtZQUN0QixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEVBQVM7Z0JBQ2YsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsS0FBSyxFQUFFLGlCQUFTLENBQUMsSUFBSTtnQkFDckIsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLElBQUksRUFBRTtnQkFDL0IsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLEtBQUssRUFBRSxHQUFHO2dCQUNWLE1BQU0sRUFBRSxFQUFFO2dCQUNWLFlBQVksRUFBRSxJQUFJO2FBQ0g7WUFDakIsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxDQUFDO2dCQUNKLENBQUMsRUFBRSxDQUFDO2FBQ0w7U0FDRixDQUFDLENBQUE7UUFDRixhQUFhLENBQUMsUUFBUSxDQUFDO1lBQ3JCLGFBQWEsRUFBRSxPQUFPO1NBQ3ZCLENBQUMsQ0FBQTtJQUNKLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBO0lBRWhDLE9BQU87UUFDTCxhQUFhO0tBQ2QsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQWhDWSxRQUFBLFdBQVcsZUFnQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb3RlTm9kZVR5cGUgfSBmcm9tICcuLi9ub3RlLW5vZGUvdHlwZXMnXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IENVU1RPTV9OT1RFX05PREUgfSBmcm9tICcuLi9ub3RlLW5vZGUvY29uc3RhbnRzJ1xuaW1wb3J0IHsgTm90ZVRoZW1lIH0gZnJvbSAnLi4vbm90ZS1ub2RlL3R5cGVzJ1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJy4uL3N0b3JlJ1xuaW1wb3J0IHsgZ2VuZXJhdGVOZXdOb2RlIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmV4cG9ydCBjb25zdCB1c2VPcGVyYXRvciA9ICgpID0+IHtcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCB7IHVzZXJQcm9maWxlIH0gPSB1c2VBcHBDb250ZXh0KClcblxuICBjb25zdCBoYW5kbGVBZGROb3RlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHsgbmV3Tm9kZSB9ID0gZ2VuZXJhdGVOZXdOb2RlKHtcbiAgICAgIHR5cGU6IENVU1RPTV9OT1RFX05PREUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgZGVzYzogJycsXG4gICAgICAgIHR5cGU6ICcnIGFzIGFueSxcbiAgICAgICAgdGV4dDogJycsXG4gICAgICAgIHRoZW1lOiBOb3RlVGhlbWUuYmx1ZSxcbiAgICAgICAgYXV0aG9yOiB1c2VyUHJvZmlsZT8ubmFtZSB8fCAnJyxcbiAgICAgICAgc2hvd0F1dGhvcjogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDI0MCxcbiAgICAgICAgaGVpZ2h0OiA4OCxcbiAgICAgICAgX2lzQ2FuZGlkYXRlOiB0cnVlLFxuICAgICAgfSBhcyBOb3RlTm9kZVR5cGUsXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgfSxcbiAgICB9KVxuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoe1xuICAgICAgY2FuZGlkYXRlTm9kZTogbmV3Tm9kZSxcbiAgICB9KVxuICB9LCBbd29ya2Zsb3dTdG9yZSwgdXNlclByb2ZpbGVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlQWRkTm90ZSxcbiAgfVxufVxuIl19