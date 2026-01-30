"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const badge_1 = require("@/app/components/base/badge");
const node_1 = require("@/app/components/base/prompt-editor/plugins/custom-text/node");
const Placeholder = ({ disableVariableInsertion = false }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const handleInsert = (0, react_1.useCallback)((text) => {
        editor.update(() => {
            const textNode = new node_1.CustomTextNode(text);
            (0, lexical_1.$insertNodes)([textNode]);
        });
        editor.dispatchCommand(lexical_1.FOCUS_COMMAND, undefined);
    }, [editor]);
    return (<div className="pointer-events-auto flex h-full w-full cursor-text items-center px-2" onClick={(e) => {
            e.stopPropagation();
            handleInsert('');
        }}>
      <div className="flex grow items-center">
        {t('nodes.tool.insertPlaceholder1', { ns: 'workflow' })}
        {(!disableVariableInsertion) && (<>
            <div className="system-kbd mx-0.5 flex h-4 w-4 items-center justify-center rounded bg-components-kbd-bg-gray text-text-placeholder">/</div>
            <div className="system-sm-regular cursor-pointer text-components-input-text-placeholder underline decoration-dotted decoration-auto underline-offset-auto hover:text-text-tertiary" onMouseDown={((e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInsert('/');
            })}>
              {t('nodes.tool.insertPlaceholder2', { ns: 'workflow' })}
            </div>
          </>)}
      </div>
      <badge_1.default className="shrink-0" text="String" uppercase={false}/>
    </div>);
};
exports.default = Placeholder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwbGFjZWhvbGRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrRkFBaUY7QUFDakYscUNBQXFEO0FBQ3JELGlDQUFtQztBQUNuQyxpREFBOEM7QUFDOUMsdURBQStDO0FBQy9DLHVGQUE2RjtBQU03RixNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQUUsd0JBQXdCLEdBQUcsS0FBSyxFQUFvQixFQUFFLEVBQUU7SUFDN0UsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFBLGtEQUF5QixHQUFFLENBQUE7SUFFNUMsTUFBTSxZQUFZLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxxQkFBYyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3pDLElBQUEsc0JBQVksRUFBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDMUIsQ0FBQyxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsZUFBZSxDQUFDLHVCQUFhLEVBQUUsU0FBZ0IsQ0FBQyxDQUFBO0lBQ3pELENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFFWixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLHNFQUFzRSxDQUNoRixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2IsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO1lBQ25CLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNsQixDQUFDLENBQUMsQ0FFRjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FDckM7UUFBQSxDQUFDLENBQUMsQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUN2RDtRQUFBLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FDOUIsRUFDRTtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvSEFBb0gsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUMxSTtZQUFBLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQyxvS0FBb0ssQ0FDOUssV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNsQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7Z0JBQ2xCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtnQkFDbkIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ25CLENBQUMsQ0FBQyxDQUFDLENBRUg7Y0FBQSxDQUFDLENBQUMsQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUN6RDtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsR0FBRyxDQUNKLENBQ0g7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsZUFBSyxDQUNKLFNBQVMsQ0FBQyxVQUFVLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBRXJCO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlTGV4aWNhbENvbXBvc2VyQ29udGV4dCB9IGZyb20gJ0BsZXhpY2FsL3JlYWN0L0xleGljYWxDb21wb3NlckNvbnRleHQnXG5pbXBvcnQgeyAkaW5zZXJ0Tm9kZXMsIEZPQ1VTX0NPTU1BTkQgfSBmcm9tICdsZXhpY2FsJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCYWRnZSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYmFkZ2UnXG5pbXBvcnQgeyBDdXN0b21UZXh0Tm9kZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wcm9tcHQtZWRpdG9yL3BsdWdpbnMvY3VzdG9tLXRleHQvbm9kZSdcblxudHlwZSBQbGFjZWhvbGRlclByb3BzID0ge1xuICBkaXNhYmxlVmFyaWFibGVJbnNlcnRpb24/OiBib29sZWFuXG59XG5cbmNvbnN0IFBsYWNlaG9sZGVyID0gKHsgZGlzYWJsZVZhcmlhYmxlSW5zZXJ0aW9uID0gZmFsc2UgfTogUGxhY2Vob2xkZXJQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgW2VkaXRvcl0gPSB1c2VMZXhpY2FsQ29tcG9zZXJDb250ZXh0KClcblxuICBjb25zdCBoYW5kbGVJbnNlcnQgPSB1c2VDYWxsYmFjaygodGV4dDogc3RyaW5nKSA9PiB7XG4gICAgZWRpdG9yLnVwZGF0ZSgoKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0Tm9kZSA9IG5ldyBDdXN0b21UZXh0Tm9kZSh0ZXh0KVxuICAgICAgJGluc2VydE5vZGVzKFt0ZXh0Tm9kZV0pXG4gICAgfSlcbiAgICBlZGl0b3IuZGlzcGF0Y2hDb21tYW5kKEZPQ1VTX0NPTU1BTkQsIHVuZGVmaW5lZCBhcyBhbnkpXG4gIH0sIFtlZGl0b3JdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtYXV0byBmbGV4IGgtZnVsbCB3LWZ1bGwgY3Vyc29yLXRleHQgaXRlbXMtY2VudGVyIHB4LTJcIlxuICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBoYW5kbGVJbnNlcnQoJycpXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICB7dCgnbm9kZXMudG9vbC5pbnNlcnRQbGFjZWhvbGRlcjEnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICB7KCFkaXNhYmxlVmFyaWFibGVJbnNlcnRpb24pICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0ta2JkIG14LTAuNSBmbGV4IGgtNCB3LTQgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQgYmctY29tcG9uZW50cy1rYmQtYmctZ3JheSB0ZXh0LXRleHQtcGxhY2Vob2xkZXJcIj4vPC9kaXY+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIGN1cnNvci1wb2ludGVyIHRleHQtY29tcG9uZW50cy1pbnB1dC10ZXh0LXBsYWNlaG9sZGVyIHVuZGVybGluZSBkZWNvcmF0aW9uLWRvdHRlZCBkZWNvcmF0aW9uLWF1dG8gdW5kZXJsaW5lLW9mZnNldC1hdXRvIGhvdmVyOnRleHQtdGV4dC10ZXJ0aWFyeVwiXG4gICAgICAgICAgICAgIG9uTW91c2VEb3duPXsoKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgaGFuZGxlSW5zZXJ0KCcvJylcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdub2Rlcy50b29sLmluc2VydFBsYWNlaG9sZGVyMicsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPEJhZGdlXG4gICAgICAgIGNsYXNzTmFtZT1cInNocmluay0wXCJcbiAgICAgICAgdGV4dD1cIlN0cmluZ1wiXG4gICAgICAgIHVwcGVyY2FzZT17ZmFsc2V9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYWNlaG9sZGVyXG4iXX0=