"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processNodesWithoutDataSource = void 0;
const constants_1 = require("@/app/components/workflow/constants");
const constants_2 = require("@/app/components/workflow/nodes/data-source-empty/constants");
const constants_3 = require("@/app/components/workflow/note-node/constants");
const types_1 = require("@/app/components/workflow/note-node/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const processNodesWithoutDataSource = (nodes, viewport) => {
    let leftNode;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.data.type === types_2.BlockEnum.DataSource) {
            return {
                nodes,
                viewport,
            };
        }
        if (node.type === constants_1.CUSTOM_NODE && !leftNode)
            leftNode = node;
        if (node.type === constants_1.CUSTOM_NODE && leftNode && node.position.x < leftNode.position.x)
            leftNode = node;
    }
    if (leftNode) {
        const startX = leftNode.position.x - constants_1.NODE_WIDTH_X_OFFSET;
        const startY = leftNode.position.y;
        const { newNode } = (0, utils_1.generateNewNode)({
            id: 'data-source-empty',
            type: constants_2.CUSTOM_DATA_SOURCE_EMPTY_NODE,
            data: {
                title: '',
                desc: '',
                type: types_2.BlockEnum.DataSourceEmpty,
                width: 240,
                _isTempNode: true,
            },
            position: {
                x: startX,
                y: startY,
            },
        });
        const newNoteNode = (0, utils_1.generateNewNode)({
            id: 'note',
            type: constants_3.CUSTOM_NOTE_NODE,
            data: {
                title: '',
                desc: '',
                type: '',
                text: '{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-size: 14px;","text":"Get started with a blank pipeline","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-size: 14px;"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"A Knowledge Pipeline starts with Data Source as the starting node and ends with the knowledge base node. The general steps are: import documents from the data source → use extractor to extract document content → split and clean content into structured chunks → store in the knowledge base.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":2,"mode":"normal","style":"","text":"Link to documentation","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"textFormat":2,"rel":"noreferrer","target":"_blank","title":null,"url":"https://dify.ai"}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":2,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1,"textFormat":1,"textStyle":"font-size: 14px;"}}',
                theme: types_1.NoteTheme.blue,
                author: '',
                showAuthor: true,
                width: 240,
                height: 300,
                _isTempNode: true,
            },
            position: {
                x: startX,
                y: startY + 100,
            },
        }).newNode;
        return {
            nodes: [
                newNode,
                newNoteNode,
                ...nodes,
            ],
            viewport: {
                x: (constants_1.START_INITIAL_POSITION.x - startX) * (viewport?.zoom || 1),
                y: (constants_1.START_INITIAL_POSITION.y - startY) * (viewport?.zoom || 1),
                zoom: viewport?.zoom || 1,
            },
        };
    }
    return {
        nodes,
        viewport,
    };
};
exports.processNodesWithoutDataSource = processNodesWithoutDataSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxtRUFJNEM7QUFDNUMsMkZBQTJHO0FBQzNHLDZFQUFnRjtBQUNoRixxRUFBcUU7QUFDckUsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUUxRCxNQUFNLDZCQUE2QixHQUFHLENBQUMsS0FBYSxFQUFFLFFBQW1CLEVBQUUsRUFBRTtJQUNsRixJQUFJLFFBQVEsQ0FBQTtJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRXJCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM1QyxPQUFPO2dCQUNMLEtBQUs7Z0JBQ0wsUUFBUTthQUNULENBQUE7UUFDSCxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHVCQUFXLElBQUksQ0FBQyxRQUFRO1lBQ3hDLFFBQVEsR0FBRyxJQUFJLENBQUE7UUFFakIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHVCQUFXLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRixRQUFRLEdBQUcsSUFBSSxDQUFBO0lBQ25CLENBQUM7SUFFRCxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQ2IsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsK0JBQW1CLENBQUE7UUFDeEQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDbEMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUEsdUJBQWUsRUFBQztZQUNsQyxFQUFFLEVBQUUsbUJBQW1CO1lBQ3ZCLElBQUksRUFBRSx5Q0FBNkI7WUFDbkMsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxFQUFFO2dCQUNULElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxpQkFBUyxDQUFDLGVBQWU7Z0JBQy9CLEtBQUssRUFBRSxHQUFHO2dCQUNWLFdBQVcsRUFBRSxJQUFJO2FBQ2xCO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxNQUFNO2dCQUNULENBQUMsRUFBRSxNQUFNO2FBQ1Y7U0FDRixDQUFDLENBQUE7UUFDRixNQUFNLFdBQVcsR0FBRyxJQUFBLHVCQUFlLEVBQUM7WUFDbEMsRUFBRSxFQUFFLE1BQU07WUFDVixJQUFJLEVBQUUsNEJBQWdCO1lBQ3RCLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsRUFBRTtnQkFDVCxJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsRUFBUztnQkFDZixJQUFJLEVBQUUsa25EQUFrbkQ7Z0JBQ3huRCxLQUFLLEVBQUUsaUJBQVMsQ0FBQyxJQUFJO2dCQUNyQixNQUFNLEVBQUUsRUFBRTtnQkFDVixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsV0FBVyxFQUFFLElBQUk7YUFDRjtZQUNqQixRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFLE1BQU07Z0JBQ1QsQ0FBQyxFQUFFLE1BQU0sR0FBRyxHQUFHO2FBQ2hCO1NBQ0YsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUNWLE9BQU87WUFDTCxLQUFLLEVBQUU7Z0JBQ0wsT0FBTztnQkFDUCxXQUFXO2dCQUNYLEdBQUcsS0FBSzthQUNUO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxDQUFDLGtDQUFzQixDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDO2dCQUM5RCxDQUFDLEVBQUUsQ0FBQyxrQ0FBc0IsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQzthQUMxQjtTQUNGLENBQUE7SUFDSCxDQUFDO0lBRUQsT0FBTztRQUNMLEtBQUs7UUFDTCxRQUFRO0tBQ1QsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQTNFWSxRQUFBLDZCQUE2QixpQ0EyRXpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB0eXBlIHsgTm90ZU5vZGVUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub3RlLW5vZGUvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE5vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHtcbiAgQ1VTVE9NX05PREUsXG4gIE5PREVfV0lEVEhfWF9PRkZTRVQsXG4gIFNUQVJUX0lOSVRJQUxfUE9TSVRJT04sXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvY29uc3RhbnRzJ1xuaW1wb3J0IHsgQ1VTVE9NX0RBVEFfU09VUkNFX0VNUFRZX05PREUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2RhdGEtc291cmNlLWVtcHR5L2NvbnN0YW50cydcbmltcG9ydCB7IENVU1RPTV9OT1RFX05PREUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vdGUtbm9kZS9jb25zdGFudHMnXG5pbXBvcnQgeyBOb3RlVGhlbWUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vdGUtbm9kZS90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5lcmF0ZU5ld05vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuXG5leHBvcnQgY29uc3QgcHJvY2Vzc05vZGVzV2l0aG91dERhdGFTb3VyY2UgPSAobm9kZXM6IE5vZGVbXSwgdmlld3BvcnQ/OiBWaWV3cG9ydCkgPT4ge1xuICBsZXQgbGVmdE5vZGVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXVxuXG4gICAgaWYgKG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uRGF0YVNvdXJjZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZXMsXG4gICAgICAgIHZpZXdwb3J0LFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09IENVU1RPTV9OT0RFICYmICFsZWZ0Tm9kZSlcbiAgICAgIGxlZnROb2RlID0gbm9kZVxuXG4gICAgaWYgKG5vZGUudHlwZSA9PT0gQ1VTVE9NX05PREUgJiYgbGVmdE5vZGUgJiYgbm9kZS5wb3NpdGlvbi54IDwgbGVmdE5vZGUucG9zaXRpb24ueClcbiAgICAgIGxlZnROb2RlID0gbm9kZVxuICB9XG5cbiAgaWYgKGxlZnROb2RlKSB7XG4gICAgY29uc3Qgc3RhcnRYID0gbGVmdE5vZGUucG9zaXRpb24ueCAtIE5PREVfV0lEVEhfWF9PRkZTRVRcbiAgICBjb25zdCBzdGFydFkgPSBsZWZ0Tm9kZS5wb3NpdGlvbi55XG4gICAgY29uc3QgeyBuZXdOb2RlIH0gPSBnZW5lcmF0ZU5ld05vZGUoe1xuICAgICAgaWQ6ICdkYXRhLXNvdXJjZS1lbXB0eScsXG4gICAgICB0eXBlOiBDVVNUT01fREFUQV9TT1VSQ0VfRU1QVFlfTk9ERSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICBkZXNjOiAnJyxcbiAgICAgICAgdHlwZTogQmxvY2tFbnVtLkRhdGFTb3VyY2VFbXB0eSxcbiAgICAgICAgd2lkdGg6IDI0MCxcbiAgICAgICAgX2lzVGVtcE5vZGU6IHRydWUsXG4gICAgICB9LFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogc3RhcnRYLFxuICAgICAgICB5OiBzdGFydFksXG4gICAgICB9LFxuICAgIH0pXG4gICAgY29uc3QgbmV3Tm90ZU5vZGUgPSBnZW5lcmF0ZU5ld05vZGUoe1xuICAgICAgaWQ6ICdub3RlJyxcbiAgICAgIHR5cGU6IENVU1RPTV9OT1RFX05PREUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgZGVzYzogJycsXG4gICAgICAgIHR5cGU6ICcnIGFzIGFueSxcbiAgICAgICAgdGV4dDogJ3tcInJvb3RcIjp7XCJjaGlsZHJlblwiOlt7XCJjaGlsZHJlblwiOlt7XCJkZXRhaWxcIjowLFwiZm9ybWF0XCI6MSxcIm1vZGVcIjpcIm5vcm1hbFwiLFwic3R5bGVcIjpcImZvbnQtc2l6ZTogMTRweDtcIixcInRleHRcIjpcIkdldCBzdGFydGVkIHdpdGggYSBibGFuayBwaXBlbGluZVwiLFwidHlwZVwiOlwidGV4dFwiLFwidmVyc2lvblwiOjF9XSxcImRpcmVjdGlvblwiOlwibHRyXCIsXCJmb3JtYXRcIjpcIlwiLFwiaW5kZW50XCI6MCxcInR5cGVcIjpcInBhcmFncmFwaFwiLFwidmVyc2lvblwiOjEsXCJ0ZXh0Rm9ybWF0XCI6MSxcInRleHRTdHlsZVwiOlwiZm9udC1zaXplOiAxNHB4O1wifSx7XCJjaGlsZHJlblwiOltdLFwiZGlyZWN0aW9uXCI6XCJsdHJcIixcImZvcm1hdFwiOlwiXCIsXCJpbmRlbnRcIjowLFwidHlwZVwiOlwicGFyYWdyYXBoXCIsXCJ2ZXJzaW9uXCI6MSxcInRleHRGb3JtYXRcIjoxLFwidGV4dFN0eWxlXCI6XCJcIn0se1wiY2hpbGRyZW5cIjpbe1wiZGV0YWlsXCI6MCxcImZvcm1hdFwiOjAsXCJtb2RlXCI6XCJub3JtYWxcIixcInN0eWxlXCI6XCJcIixcInRleHRcIjpcIkEgS25vd2xlZGdlIFBpcGVsaW5lIHN0YXJ0cyB3aXRoIERhdGEgU291cmNlIGFzIHRoZSBzdGFydGluZyBub2RlIGFuZCBlbmRzIHdpdGggdGhlIGtub3dsZWRnZSBiYXNlIG5vZGUuIFRoZSBnZW5lcmFsIHN0ZXBzIGFyZTogaW1wb3J0IGRvY3VtZW50cyBmcm9tIHRoZSBkYXRhIHNvdXJjZSDihpIgdXNlIGV4dHJhY3RvciB0byBleHRyYWN0IGRvY3VtZW50IGNvbnRlbnQg4oaSIHNwbGl0IGFuZCBjbGVhbiBjb250ZW50IGludG8gc3RydWN0dXJlZCBjaHVua3Mg4oaSIHN0b3JlIGluIHRoZSBrbm93bGVkZ2UgYmFzZS5cIixcInR5cGVcIjpcInRleHRcIixcInZlcnNpb25cIjoxfV0sXCJkaXJlY3Rpb25cIjpcImx0clwiLFwiZm9ybWF0XCI6XCJcIixcImluZGVudFwiOjAsXCJ0eXBlXCI6XCJwYXJhZ3JhcGhcIixcInZlcnNpb25cIjoxLFwidGV4dEZvcm1hdFwiOjAsXCJ0ZXh0U3R5bGVcIjpcIlwifSx7XCJjaGlsZHJlblwiOltdLFwiZGlyZWN0aW9uXCI6XCJsdHJcIixcImZvcm1hdFwiOlwiXCIsXCJpbmRlbnRcIjowLFwidHlwZVwiOlwicGFyYWdyYXBoXCIsXCJ2ZXJzaW9uXCI6MSxcInRleHRGb3JtYXRcIjowLFwidGV4dFN0eWxlXCI6XCJcIn0se1wiY2hpbGRyZW5cIjpbe1wiY2hpbGRyZW5cIjpbe1wiZGV0YWlsXCI6MCxcImZvcm1hdFwiOjIsXCJtb2RlXCI6XCJub3JtYWxcIixcInN0eWxlXCI6XCJcIixcInRleHRcIjpcIkxpbmsgdG8gZG9jdW1lbnRhdGlvblwiLFwidHlwZVwiOlwidGV4dFwiLFwidmVyc2lvblwiOjF9XSxcImRpcmVjdGlvblwiOlwibHRyXCIsXCJmb3JtYXRcIjpcIlwiLFwiaW5kZW50XCI6MCxcInR5cGVcIjpcImxpbmtcIixcInZlcnNpb25cIjoxLFwidGV4dEZvcm1hdFwiOjIsXCJyZWxcIjpcIm5vcmVmZXJyZXJcIixcInRhcmdldFwiOlwiX2JsYW5rXCIsXCJ0aXRsZVwiOm51bGwsXCJ1cmxcIjpcImh0dHBzOi8vZGlmeS5haVwifV0sXCJkaXJlY3Rpb25cIjpcImx0clwiLFwiZm9ybWF0XCI6XCJcIixcImluZGVudFwiOjAsXCJ0eXBlXCI6XCJwYXJhZ3JhcGhcIixcInZlcnNpb25cIjoxLFwidGV4dEZvcm1hdFwiOjIsXCJ0ZXh0U3R5bGVcIjpcIlwifSx7XCJjaGlsZHJlblwiOltdLFwiZGlyZWN0aW9uXCI6XCJsdHJcIixcImZvcm1hdFwiOlwiXCIsXCJpbmRlbnRcIjowLFwidHlwZVwiOlwicGFyYWdyYXBoXCIsXCJ2ZXJzaW9uXCI6MSxcInRleHRGb3JtYXRcIjowLFwidGV4dFN0eWxlXCI6XCJcIn1dLFwiZGlyZWN0aW9uXCI6XCJsdHJcIixcImZvcm1hdFwiOlwiXCIsXCJpbmRlbnRcIjowLFwidHlwZVwiOlwicm9vdFwiLFwidmVyc2lvblwiOjEsXCJ0ZXh0Rm9ybWF0XCI6MSxcInRleHRTdHlsZVwiOlwiZm9udC1zaXplOiAxNHB4O1wifX0nLFxuICAgICAgICB0aGVtZTogTm90ZVRoZW1lLmJsdWUsXG4gICAgICAgIGF1dGhvcjogJycsXG4gICAgICAgIHNob3dBdXRob3I6IHRydWUsXG4gICAgICAgIHdpZHRoOiAyNDAsXG4gICAgICAgIGhlaWdodDogMzAwLFxuICAgICAgICBfaXNUZW1wTm9kZTogdHJ1ZSxcbiAgICAgIH0gYXMgTm90ZU5vZGVUeXBlLFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogc3RhcnRYLFxuICAgICAgICB5OiBzdGFydFkgKyAxMDAsXG4gICAgICB9LFxuICAgIH0pLm5ld05vZGVcbiAgICByZXR1cm4ge1xuICAgICAgbm9kZXM6IFtcbiAgICAgICAgbmV3Tm9kZSxcbiAgICAgICAgbmV3Tm90ZU5vZGUsXG4gICAgICAgIC4uLm5vZGVzLFxuICAgICAgXSxcbiAgICAgIHZpZXdwb3J0OiB7XG4gICAgICAgIHg6IChTVEFSVF9JTklUSUFMX1BPU0lUSU9OLnggLSBzdGFydFgpICogKHZpZXdwb3J0Py56b29tIHx8IDEpLFxuICAgICAgICB5OiAoU1RBUlRfSU5JVElBTF9QT1NJVElPTi55IC0gc3RhcnRZKSAqICh2aWV3cG9ydD8uem9vbSB8fCAxKSxcbiAgICAgICAgem9vbTogdmlld3BvcnQ/Lnpvb20gfHwgMSxcbiAgICAgIH0sXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBub2RlcyxcbiAgICB2aWV3cG9ydCxcbiAgfVxufVxuIl19