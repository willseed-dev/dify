"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatDetector = void 0;
const link_1 = require("@lexical/link");
const list_1 = require("@lexical/list");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const store_1 = require("../../store");
const utils_2 = require("../../utils");
const useFormatDetector = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const noteEditorStore = (0, store_1.useNoteEditorStore)();
    const handleFormat = (0, react_1.useCallback)(() => {
        editor.getEditorState().read(() => {
            if (editor.isComposing())
                return;
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                const node = (0, utils_2.getSelectedNode)(selection);
                const { setSelectedIsBold, setSelectedIsItalic, setSelectedIsStrikeThrough, setSelectedLinkUrl, setSelectedIsLink, setSelectedIsBullet, } = noteEditorStore.getState();
                setSelectedIsBold(selection.hasFormat('bold'));
                setSelectedIsItalic(selection.hasFormat('italic'));
                setSelectedIsStrikeThrough(selection.hasFormat('strikethrough'));
                const parent = node.getParent();
                if ((0, link_1.$isLinkNode)(parent) || (0, link_1.$isLinkNode)(node)) {
                    const linkUrl = ((0, link_1.$isLinkNode)(parent) ? parent : node).getURL();
                    setSelectedLinkUrl(linkUrl);
                    setSelectedIsLink(true);
                }
                else {
                    setSelectedLinkUrl('');
                    setSelectedIsLink(false);
                }
                if ((0, list_1.$isListItemNode)(parent) || (0, list_1.$isListItemNode)(node))
                    setSelectedIsBullet(true);
                else
                    setSelectedIsBullet(false);
            }
        });
    }, [editor, noteEditorStore]);
    (0, react_1.useEffect)(() => {
        document.addEventListener('selectionchange', handleFormat);
        return () => {
            document.removeEventListener('selectionchange', handleFormat);
        };
    }, [handleFormat]);
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerUpdateListener(() => {
            handleFormat();
        }));
    }, [editor, handleFormat]);
    return {
        handleFormat,
    };
};
exports.useFormatDetector = useFormatDetector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3Q0FBMkM7QUFDM0Msd0NBQStDO0FBQy9DLGtGQUFpRjtBQUNqRiwwQ0FBOEM7QUFDOUMscUNBR2dCO0FBQ2hCLGlDQUdjO0FBQ2QsdUNBQWdEO0FBQ2hELHVDQUE2QztBQUV0QyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRTtJQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBQSxrREFBeUIsR0FBRSxDQUFBO0lBQzVDLE1BQU0sZUFBZSxHQUFHLElBQUEsMEJBQWtCLEdBQUUsQ0FBQTtJQUU1QyxNQUFNLFlBQVksR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2hDLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtnQkFDdEIsT0FBTTtZQUVSLE1BQU0sU0FBUyxHQUFHLElBQUEsdUJBQWEsR0FBRSxDQUFBO1lBRWpDLElBQUksSUFBQSwyQkFBaUIsRUFBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUNqQyxNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFlLEVBQUMsU0FBUyxDQUFDLENBQUE7Z0JBQ3ZDLE1BQU0sRUFDSixpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ25CLDBCQUEwQixFQUMxQixrQkFBa0IsRUFDbEIsaUJBQWlCLEVBQ2pCLG1CQUFtQixHQUNwQixHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtnQkFDOUIsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO2dCQUM5QyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7Z0JBQ2xELDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtnQkFDaEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO2dCQUMvQixJQUFJLElBQUEsa0JBQVcsRUFBQyxNQUFNLENBQUMsSUFBSSxJQUFBLGtCQUFXLEVBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFBLGtCQUFXLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBZ0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO29CQUMxRSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtvQkFDM0IsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ3pCLENBQUM7cUJBQ0ksQ0FBQztvQkFDSixrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQkFDdEIsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQzFCLENBQUM7Z0JBRUQsSUFBSSxJQUFBLHNCQUFlLEVBQUMsTUFBTSxDQUFDLElBQUksSUFBQSxzQkFBZSxFQUFDLElBQUksQ0FBQztvQkFDbEQsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUE7O29CQUV6QixtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUM5QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQTtJQUU3QixJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFBO1FBQzFELE9BQU8sR0FBRyxFQUFFO1lBQ1YsUUFBUSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFBO1FBQy9ELENBQUMsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7SUFFbEIsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLE9BQU8sSUFBQSxxQkFBYSxFQUNsQixNQUFNLENBQUMsc0JBQXNCLENBQUMsR0FBRyxFQUFFO1lBQ2pDLFlBQVksRUFBRSxDQUFBO1FBQ2hCLENBQUMsQ0FBQyxDQUNILENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQTtJQUUxQixPQUFPO1FBQ0wsWUFBWTtLQUNiLENBQUE7QUFDSCxDQUFDLENBQUE7QUE3RFksUUFBQSxpQkFBaUIscUJBNkQ3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTGlua05vZGUgfSBmcm9tICdAbGV4aWNhbC9saW5rJ1xuaW1wb3J0IHsgJGlzTGlua05vZGUgfSBmcm9tICdAbGV4aWNhbC9saW5rJ1xuaW1wb3J0IHsgJGlzTGlzdEl0ZW1Ob2RlIH0gZnJvbSAnQGxleGljYWwvbGlzdCdcbmltcG9ydCB7IHVzZUxleGljYWxDb21wb3NlckNvbnRleHQgfSBmcm9tICdAbGV4aWNhbC9yZWFjdC9MZXhpY2FsQ29tcG9zZXJDb250ZXh0J1xuaW1wb3J0IHsgbWVyZ2VSZWdpc3RlciB9IGZyb20gJ0BsZXhpY2FsL3V0aWxzJ1xuaW1wb3J0IHtcbiAgJGdldFNlbGVjdGlvbixcbiAgJGlzUmFuZ2VTZWxlY3Rpb24sXG59IGZyb20gJ2xleGljYWwnXG5pbXBvcnQge1xuICB1c2VDYWxsYmFjayxcbiAgdXNlRWZmZWN0LFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZU5vdGVFZGl0b3JTdG9yZSB9IGZyb20gJy4uLy4uL3N0b3JlJ1xuaW1wb3J0IHsgZ2V0U2VsZWN0ZWROb2RlIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbmV4cG9ydCBjb25zdCB1c2VGb3JtYXREZXRlY3RvciA9ICgpID0+IHtcbiAgY29uc3QgW2VkaXRvcl0gPSB1c2VMZXhpY2FsQ29tcG9zZXJDb250ZXh0KClcbiAgY29uc3Qgbm90ZUVkaXRvclN0b3JlID0gdXNlTm90ZUVkaXRvclN0b3JlKClcblxuICBjb25zdCBoYW5kbGVGb3JtYXQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgZWRpdG9yLmdldEVkaXRvclN0YXRlKCkucmVhZCgoKSA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmlzQ29tcG9zaW5nKCkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjb25zdCBzZWxlY3Rpb24gPSAkZ2V0U2VsZWN0aW9uKClcblxuICAgICAgaWYgKCRpc1JhbmdlU2VsZWN0aW9uKHNlbGVjdGlvbikpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGdldFNlbGVjdGVkTm9kZShzZWxlY3Rpb24pXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBzZXRTZWxlY3RlZElzQm9sZCxcbiAgICAgICAgICBzZXRTZWxlY3RlZElzSXRhbGljLFxuICAgICAgICAgIHNldFNlbGVjdGVkSXNTdHJpa2VUaHJvdWdoLFxuICAgICAgICAgIHNldFNlbGVjdGVkTGlua1VybCxcbiAgICAgICAgICBzZXRTZWxlY3RlZElzTGluayxcbiAgICAgICAgICBzZXRTZWxlY3RlZElzQnVsbGV0LFxuICAgICAgICB9ID0gbm90ZUVkaXRvclN0b3JlLmdldFN0YXRlKClcbiAgICAgICAgc2V0U2VsZWN0ZWRJc0JvbGQoc2VsZWN0aW9uLmhhc0Zvcm1hdCgnYm9sZCcpKVxuICAgICAgICBzZXRTZWxlY3RlZElzSXRhbGljKHNlbGVjdGlvbi5oYXNGb3JtYXQoJ2l0YWxpYycpKVxuICAgICAgICBzZXRTZWxlY3RlZElzU3RyaWtlVGhyb3VnaChzZWxlY3Rpb24uaGFzRm9ybWF0KCdzdHJpa2V0aHJvdWdoJykpXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGUuZ2V0UGFyZW50KClcbiAgICAgICAgaWYgKCRpc0xpbmtOb2RlKHBhcmVudCkgfHwgJGlzTGlua05vZGUobm9kZSkpIHtcbiAgICAgICAgICBjb25zdCBsaW5rVXJsID0gKCRpc0xpbmtOb2RlKHBhcmVudCkgPyBwYXJlbnQgOiBub2RlIGFzIExpbmtOb2RlKS5nZXRVUkwoKVxuICAgICAgICAgIHNldFNlbGVjdGVkTGlua1VybChsaW5rVXJsKVxuICAgICAgICAgIHNldFNlbGVjdGVkSXNMaW5rKHRydWUpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc2V0U2VsZWN0ZWRMaW5rVXJsKCcnKVxuICAgICAgICAgIHNldFNlbGVjdGVkSXNMaW5rKGZhbHNlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRpc0xpc3RJdGVtTm9kZShwYXJlbnQpIHx8ICRpc0xpc3RJdGVtTm9kZShub2RlKSlcbiAgICAgICAgICBzZXRTZWxlY3RlZElzQnVsbGV0KHRydWUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzZXRTZWxlY3RlZElzQnVsbGV0KGZhbHNlKVxuICAgICAgfVxuICAgIH0pXG4gIH0sIFtlZGl0b3IsIG5vdGVFZGl0b3JTdG9yZV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3Rpb25jaGFuZ2UnLCBoYW5kbGVGb3JtYXQpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NlbGVjdGlvbmNoYW5nZScsIGhhbmRsZUZvcm1hdClcbiAgICB9XG4gIH0sIFtoYW5kbGVGb3JtYXRdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuIG1lcmdlUmVnaXN0ZXIoXG4gICAgICBlZGl0b3IucmVnaXN0ZXJVcGRhdGVMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgIGhhbmRsZUZvcm1hdCgpXG4gICAgICB9KSxcbiAgICApXG4gIH0sIFtlZGl0b3IsIGhhbmRsZUZvcm1hdF0pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVGb3JtYXQsXG4gIH1cbn1cbiJdfQ==