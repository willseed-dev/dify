"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRegExp = void 0;
exports.getSelectedNode = getSelectedNode;
const selection_1 = require("@lexical/selection");
function getSelectedNode(selection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode)
        return anchorNode;
    const isBackward = selection.isBackward();
    if (isBackward)
        return (0, selection_1.$isAtNodeEnd)(focus) ? anchorNode : focusNode;
    else
        return (0, selection_1.$isAtNodeEnd)(anchor) ? anchorNode : focusNode;
}
// eslint-disable-next-line sonarjs/empty-string-repetition
exports.urlRegExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-]*)?\??[-+=&;%@.\w]*#?\w*)?)/;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSwwQ0FlQztBQWpCRCxrREFBaUQ7QUFFakQsU0FBZ0IsZUFBZSxDQUM3QixTQUF5QjtJQUV6QixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFBO0lBQy9CLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUE7SUFDN0IsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUM3QyxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQzNDLElBQUksVUFBVSxLQUFLLFNBQVM7UUFDMUIsT0FBTyxVQUFVLENBQUE7SUFFbkIsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBQ3pDLElBQUksVUFBVTtRQUNaLE9BQU8sSUFBQSx3QkFBWSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTs7UUFFbkQsT0FBTyxJQUFBLHdCQUFZLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO0FBQ3hELENBQUM7QUFFRCwyREFBMkQ7QUFDOUMsUUFBQSxTQUFTLEdBQUcsZ0pBQWdKLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEVsZW1lbnROb2RlLCBSYW5nZVNlbGVjdGlvbiwgVGV4dE5vZGUgfSBmcm9tICdsZXhpY2FsJ1xuaW1wb3J0IHsgJGlzQXROb2RlRW5kIH0gZnJvbSAnQGxleGljYWwvc2VsZWN0aW9uJ1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0ZWROb2RlKFxuICBzZWxlY3Rpb246IFJhbmdlU2VsZWN0aW9uLFxuKTogVGV4dE5vZGUgfCBFbGVtZW50Tm9kZSB7XG4gIGNvbnN0IGFuY2hvciA9IHNlbGVjdGlvbi5hbmNob3JcbiAgY29uc3QgZm9jdXMgPSBzZWxlY3Rpb24uZm9jdXNcbiAgY29uc3QgYW5jaG9yTm9kZSA9IHNlbGVjdGlvbi5hbmNob3IuZ2V0Tm9kZSgpXG4gIGNvbnN0IGZvY3VzTm9kZSA9IHNlbGVjdGlvbi5mb2N1cy5nZXROb2RlKClcbiAgaWYgKGFuY2hvck5vZGUgPT09IGZvY3VzTm9kZSlcbiAgICByZXR1cm4gYW5jaG9yTm9kZVxuXG4gIGNvbnN0IGlzQmFja3dhcmQgPSBzZWxlY3Rpb24uaXNCYWNrd2FyZCgpXG4gIGlmIChpc0JhY2t3YXJkKVxuICAgIHJldHVybiAkaXNBdE5vZGVFbmQoZm9jdXMpID8gYW5jaG9yTm9kZSA6IGZvY3VzTm9kZVxuICBlbHNlXG4gICAgcmV0dXJuICRpc0F0Tm9kZUVuZChhbmNob3IpID8gYW5jaG9yTm9kZSA6IGZvY3VzTm9kZVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc29uYXJqcy9lbXB0eS1zdHJpbmctcmVwZXRpdGlvblxuZXhwb3J0IGNvbnN0IHVybFJlZ0V4cCA9IC8oKChbQS1aYS16XXszLDl9Oig/OlxcL1xcLyk/KSg/OlstOzomPSskLFxcd10rQCk/W0EtWmEtejAtOS4tXSt8KD86d3d3LnxbLTs6Jj0rJCxcXHddK0ApW0EtWmEtejAtOS4tXSspKCg/OlxcL1srfiUvLlxcdy1dKik/XFw/P1stKz0mOyVALlxcd10qIz9cXHcqKT8pL1xuIl19