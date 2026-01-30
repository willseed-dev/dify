"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const badge_1 = require("@/app/components/base/badge");
const node_1 = require("@/app/components/base/prompt-editor/plugins/custom-text/node");
const Placeholder = () => {
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
        <div className="system-kbd mx-0.5 flex h-4 w-4 items-center justify-center rounded bg-components-kbd-bg-gray text-text-placeholder">/</div>
        <div className="system-sm-regular cursor-pointer text-components-input-text-placeholder underline decoration-dotted decoration-auto underline-offset-auto hover:text-text-tertiary" onMouseDown={((e) => {
            e.preventDefault();
            e.stopPropagation();
            handleInsert('/');
        })}>
          {t('nodes.tool.insertPlaceholder2', { ns: 'workflow' })}
        </div>
      </div>
      <badge_1.default className="shrink-0" text="String" uppercase={false}/>
    </div>);
};
exports.default = Placeholder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwbGFjZWhvbGRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrRkFBaUY7QUFDakYscUNBQXFEO0FBQ3JELGlDQUFtQztBQUNuQyxpREFBOEM7QUFDOUMsdURBQStDO0FBQy9DLHVGQUE2RjtBQUU3RixNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7SUFDdkIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFBLGtEQUF5QixHQUFFLENBQUE7SUFFNUMsTUFBTSxZQUFZLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxxQkFBYyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3pDLElBQUEsc0JBQVksRUFBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDMUIsQ0FBQyxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsZUFBZSxDQUFDLHVCQUFhLEVBQUUsU0FBZ0IsQ0FBQyxDQUFBO0lBQ3pELENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFFWixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLHNFQUFzRSxDQUNoRixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2IsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO1lBQ25CLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNsQixDQUFDLENBQUMsQ0FFRjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FDckM7UUFBQSxDQUFDLENBQUMsQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUN2RDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvSEFBb0gsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUMxSTtRQUFBLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQyxvS0FBb0ssQ0FDOUssV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2xCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtZQUNsQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7WUFDbkIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ25CLENBQUMsQ0FBQyxDQUFDLENBRUg7VUFBQSxDQUFDLENBQUMsQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUN6RDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLGVBQUssQ0FDSixTQUFTLENBQUMsVUFBVSxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUVyQjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUxleGljYWxDb21wb3NlckNvbnRleHQgfSBmcm9tICdAbGV4aWNhbC9yZWFjdC9MZXhpY2FsQ29tcG9zZXJDb250ZXh0J1xuaW1wb3J0IHsgJGluc2VydE5vZGVzLCBGT0NVU19DT01NQU5EIH0gZnJvbSAnbGV4aWNhbCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQmFkZ2UgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2JhZGdlJ1xuaW1wb3J0IHsgQ3VzdG9tVGV4dE5vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcHJvbXB0LWVkaXRvci9wbHVnaW5zL2N1c3RvbS10ZXh0L25vZGUnXG5cbmNvbnN0IFBsYWNlaG9sZGVyID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgW2VkaXRvcl0gPSB1c2VMZXhpY2FsQ29tcG9zZXJDb250ZXh0KClcblxuICBjb25zdCBoYW5kbGVJbnNlcnQgPSB1c2VDYWxsYmFjaygodGV4dDogc3RyaW5nKSA9PiB7XG4gICAgZWRpdG9yLnVwZGF0ZSgoKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0Tm9kZSA9IG5ldyBDdXN0b21UZXh0Tm9kZSh0ZXh0KVxuICAgICAgJGluc2VydE5vZGVzKFt0ZXh0Tm9kZV0pXG4gICAgfSlcbiAgICBlZGl0b3IuZGlzcGF0Y2hDb21tYW5kKEZPQ1VTX0NPTU1BTkQsIHVuZGVmaW5lZCBhcyBhbnkpXG4gIH0sIFtlZGl0b3JdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtYXV0byBmbGV4IGgtZnVsbCB3LWZ1bGwgY3Vyc29yLXRleHQgaXRlbXMtY2VudGVyIHB4LTJcIlxuICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBoYW5kbGVJbnNlcnQoJycpXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICB7dCgnbm9kZXMudG9vbC5pbnNlcnRQbGFjZWhvbGRlcjEnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1rYmQgbXgtMC41IGZsZXggaC00IHctNCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZCBiZy1jb21wb25lbnRzLWtiZC1iZy1ncmF5IHRleHQtdGV4dC1wbGFjZWhvbGRlclwiPi88L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIGN1cnNvci1wb2ludGVyIHRleHQtY29tcG9uZW50cy1pbnB1dC10ZXh0LXBsYWNlaG9sZGVyIHVuZGVybGluZSBkZWNvcmF0aW9uLWRvdHRlZCBkZWNvcmF0aW9uLWF1dG8gdW5kZXJsaW5lLW9mZnNldC1hdXRvIGhvdmVyOnRleHQtdGV4dC10ZXJ0aWFyeVwiXG4gICAgICAgICAgb25Nb3VzZURvd249eygoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBoYW5kbGVJbnNlcnQoJy8nKVxuICAgICAgICAgIH0pfVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ25vZGVzLnRvb2wuaW5zZXJ0UGxhY2Vob2xkZXIyJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxCYWRnZVxuICAgICAgICBjbGFzc05hbWU9XCJzaHJpbmstMFwiXG4gICAgICAgIHRleHQ9XCJTdHJpbmdcIlxuICAgICAgICB1cHBlcmNhc2U9e2ZhbHNlfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGFjZWhvbGRlclxuIl19