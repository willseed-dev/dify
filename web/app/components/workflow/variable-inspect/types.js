"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewType = exports.ViewMode = exports.CHUNK_SCHEMA_TYPES = exports.EVENT_WORKFLOW_STOP = void 0;
exports.EVENT_WORKFLOW_STOP = 'WORKFLOW_STOP';
exports.CHUNK_SCHEMA_TYPES = ['general_structure', 'parent_child_structure', 'qa_structure'];
var ViewMode;
(function (ViewMode) {
    ViewMode["Code"] = "code";
    ViewMode["Preview"] = "preview";
})(ViewMode || (exports.ViewMode = ViewMode = {}));
var PreviewType;
(function (PreviewType) {
    PreviewType["Markdown"] = "markdown";
    PreviewType["Chunks"] = "chunks";
})(PreviewType || (exports.PreviewType = PreviewType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLG1CQUFtQixHQUFHLGVBQWUsQ0FBQTtBQUVyQyxRQUFBLGtCQUFrQixHQUFHLENBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLEVBQUUsY0FBYyxDQUFDLENBQUE7QUFFakcsSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ2xCLHlCQUFhLENBQUE7SUFDYiwrQkFBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSFcsUUFBUSx3QkFBUixRQUFRLFFBR25CO0FBRUQsSUFBWSxXQUdYO0FBSEQsV0FBWSxXQUFXO0lBQ3JCLG9DQUFxQixDQUFBO0lBQ3JCLGdDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFIVyxXQUFXLDJCQUFYLFdBQVcsUUFHdEIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgRVZFTlRfV09SS0ZMT1dfU1RPUCA9ICdXT1JLRkxPV19TVE9QJ1xuXG5leHBvcnQgY29uc3QgQ0hVTktfU0NIRU1BX1RZUEVTID0gWydnZW5lcmFsX3N0cnVjdHVyZScsICdwYXJlbnRfY2hpbGRfc3RydWN0dXJlJywgJ3FhX3N0cnVjdHVyZSddXG5cbmV4cG9ydCBlbnVtIFZpZXdNb2RlIHtcbiAgQ29kZSA9ICdjb2RlJyxcbiAgUHJldmlldyA9ICdwcmV2aWV3Jyxcbn1cblxuZXhwb3J0IGVudW0gUHJldmlld1R5cGUge1xuICBNYXJrZG93biA9ICdtYXJrZG93bicsXG4gIENodW5rcyA9ICdjaHVua3MnLFxufVxuIl19