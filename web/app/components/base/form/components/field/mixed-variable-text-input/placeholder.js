"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
const badge_1 = require("@/app/components/base/badge");
const node_1 = require("@/app/components/base/prompt-editor/plugins/custom-text/node");
const Placeholder = () => {
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
        Type or press
        <div className="system-kbd mx-0.5 flex h-4 w-4 items-center justify-center rounded bg-components-kbd-bg-gray text-text-placeholder">/</div>
        <div className="system-sm-regular cursor-pointer text-components-input-text-placeholder underline decoration-dotted decoration-auto underline-offset-auto hover:text-text-tertiary" onClick={((e) => {
            e.stopPropagation();
            handleInsert('/');
        })}>
          insert variable
        </div>
      </div>
      <badge_1.default className="shrink-0" text="String" uppercase={false}/>
    </div>);
};
exports.default = Placeholder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwbGFjZWhvbGRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrRkFBaUY7QUFDakYscUNBQXFEO0FBQ3JELGlDQUFtQztBQUNuQyx1REFBK0M7QUFDL0MsdUZBQTZGO0FBRTdGLE1BQU0sV0FBVyxHQUFHLEdBQUcsRUFBRTtJQUN2QixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBQSxrREFBeUIsR0FBRSxDQUFBO0lBRTVDLE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQVksRUFBRSxFQUFFO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ2pCLE1BQU0sUUFBUSxHQUFHLElBQUkscUJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN6QyxJQUFBLHNCQUFZLEVBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzFCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLGVBQWUsQ0FBQyx1QkFBYSxFQUFFLFNBQWdCLENBQUMsQ0FBQTtJQUN6RCxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBRVosT0FBTyxDQUNMLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQyxzRUFBc0UsQ0FDaEYsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNiLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtZQUNuQixZQUFZLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDbEIsQ0FBQyxDQUFDLENBRUY7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQ3JDOztRQUNBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvSEFBb0gsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUMxSTtRQUFBLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQyxvS0FBb0ssQ0FDOUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2QsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO1lBQ25CLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNuQixDQUFDLENBQUMsQ0FBQyxDQUVIOztRQUNGLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLGVBQUssQ0FDSixTQUFTLENBQUMsVUFBVSxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUVyQjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUxleGljYWxDb21wb3NlckNvbnRleHQgfSBmcm9tICdAbGV4aWNhbC9yZWFjdC9MZXhpY2FsQ29tcG9zZXJDb250ZXh0J1xuaW1wb3J0IHsgJGluc2VydE5vZGVzLCBGT0NVU19DT01NQU5EIH0gZnJvbSAnbGV4aWNhbCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQmFkZ2UgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2JhZGdlJ1xuaW1wb3J0IHsgQ3VzdG9tVGV4dE5vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcHJvbXB0LWVkaXRvci9wbHVnaW5zL2N1c3RvbS10ZXh0L25vZGUnXG5cbmNvbnN0IFBsYWNlaG9sZGVyID0gKCkgPT4ge1xuICBjb25zdCBbZWRpdG9yXSA9IHVzZUxleGljYWxDb21wb3NlckNvbnRleHQoKVxuXG4gIGNvbnN0IGhhbmRsZUluc2VydCA9IHVzZUNhbGxiYWNrKCh0ZXh0OiBzdHJpbmcpID0+IHtcbiAgICBlZGl0b3IudXBkYXRlKCgpID0+IHtcbiAgICAgIGNvbnN0IHRleHROb2RlID0gbmV3IEN1c3RvbVRleHROb2RlKHRleHQpXG4gICAgICAkaW5zZXJ0Tm9kZXMoW3RleHROb2RlXSlcbiAgICB9KVxuICAgIGVkaXRvci5kaXNwYXRjaENvbW1hbmQoRk9DVVNfQ09NTUFORCwgdW5kZWZpbmVkIGFzIGFueSlcbiAgfSwgW2VkaXRvcl0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1hdXRvIGZsZXggaC1mdWxsIHctZnVsbCBjdXJzb3ItdGV4dCBpdGVtcy1jZW50ZXIgcHgtMlwiXG4gICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGhhbmRsZUluc2VydCgnJylcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdyb3cgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgIFR5cGUgb3IgcHJlc3NcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0ta2JkIG14LTAuNSBmbGV4IGgtNCB3LTQgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQgYmctY29tcG9uZW50cy1rYmQtYmctZ3JheSB0ZXh0LXRleHQtcGxhY2Vob2xkZXJcIj4vPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciBjdXJzb3ItcG9pbnRlciB0ZXh0LWNvbXBvbmVudHMtaW5wdXQtdGV4dC1wbGFjZWhvbGRlciB1bmRlcmxpbmUgZGVjb3JhdGlvbi1kb3R0ZWQgZGVjb3JhdGlvbi1hdXRvIHVuZGVybGluZS1vZmZzZXQtYXV0byBob3Zlcjp0ZXh0LXRleHQtdGVydGlhcnlcIlxuICAgICAgICAgIG9uQ2xpY2s9eygoZSkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgaGFuZGxlSW5zZXJ0KCcvJylcbiAgICAgICAgICB9KX1cbiAgICAgICAgPlxuICAgICAgICAgIGluc2VydCB2YXJpYWJsZVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPEJhZGdlXG4gICAgICAgIGNsYXNzTmFtZT1cInNocmluay0wXCJcbiAgICAgICAgdGV4dD1cIlN0cmluZ1wiXG4gICAgICAgIHVwcGVyY2FzZT17ZmFsc2V9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYWNlaG9sZGVyXG4iXX0=