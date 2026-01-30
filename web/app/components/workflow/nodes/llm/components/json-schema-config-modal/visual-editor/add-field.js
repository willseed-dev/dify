"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const context_1 = require("./context");
const store_1 = require("./store");
const AddField = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setIsAddingNewField = (0, store_1.useVisualEditorStore)(state => state.setIsAddingNewField);
    const { emit } = (0, context_1.useMittContext)();
    const handleAddField = (0, react_2.useCallback)(() => {
        setIsAddingNewField(true);
        // fix: when user change the last property type, the 'hoveringProperty' value will be reset by 'setHoveringPropertyDebounced(null)', that cause the EditCard not showing
        setTimeout(() => {
            emit('addField', { path: [] });
        }, 100);
    }, [setIsAddingNewField, emit]);
    return (<div className="py-2 pl-5">
      <button_1.default size="small" variant="secondary-accent" className="flex items-center gap-x-[1px]" onClick={handleAddField}>
        <react_1.RiAddCircleFill className="h-3.5 w-3.5"/>
        <span className="px-[3px]">{t('nodes.llm.jsonSchema.addField', { ns: 'workflow' })}</span>
      </button_1.default>
    </div>);
};
exports.default = React.memo(AddField);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLWZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWRkLWZpZWxkLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUFrRDtBQUNsRCwrQkFBOEI7QUFDOUIsaUNBQW1DO0FBQ25DLGlEQUE4QztBQUM5Qyx5REFBaUQ7QUFDakQsdUNBQTBDO0FBQzFDLG1DQUE4QztBQUU5QyxNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7SUFDcEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSw0QkFBb0IsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBQ3BGLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFBLHdCQUFjLEdBQUUsQ0FBQTtJQUVqQyxNQUFNLGNBQWMsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3RDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3pCLHdLQUF3SztRQUN4SyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ2hDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNULENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7SUFFL0IsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCO01BQUEsQ0FBQyxnQkFBTSxDQUNMLElBQUksQ0FBQyxPQUFPLENBQ1osT0FBTyxDQUFDLGtCQUFrQixDQUMxQixTQUFTLENBQUMsK0JBQStCLENBQ3pDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUV4QjtRQUFBLENBQUMsdUJBQWUsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUN4QztRQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsK0JBQStCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FDM0Y7TUFBQSxFQUFFLGdCQUFNLENBQ1Y7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmlBZGRDaXJjbGVGaWxsIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCB7IHVzZU1pdHRDb250ZXh0IH0gZnJvbSAnLi9jb250ZXh0J1xuaW1wb3J0IHsgdXNlVmlzdWFsRWRpdG9yU3RvcmUgfSBmcm9tICcuL3N0b3JlJ1xuXG5jb25zdCBBZGRGaWVsZCA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHNldElzQWRkaW5nTmV3RmllbGQgPSB1c2VWaXN1YWxFZGl0b3JTdG9yZShzdGF0ZSA9PiBzdGF0ZS5zZXRJc0FkZGluZ05ld0ZpZWxkKVxuICBjb25zdCB7IGVtaXQgfSA9IHVzZU1pdHRDb250ZXh0KClcblxuICBjb25zdCBoYW5kbGVBZGRGaWVsZCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRJc0FkZGluZ05ld0ZpZWxkKHRydWUpXG4gICAgLy8gZml4OiB3aGVuIHVzZXIgY2hhbmdlIHRoZSBsYXN0IHByb3BlcnR5IHR5cGUsIHRoZSAnaG92ZXJpbmdQcm9wZXJ0eScgdmFsdWUgd2lsbCBiZSByZXNldCBieSAnc2V0SG92ZXJpbmdQcm9wZXJ0eURlYm91bmNlZChudWxsKScsIHRoYXQgY2F1c2UgdGhlIEVkaXRDYXJkIG5vdCBzaG93aW5nXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBlbWl0KCdhZGRGaWVsZCcsIHsgcGF0aDogW10gfSlcbiAgICB9LCAxMDApXG4gIH0sIFtzZXRJc0FkZGluZ05ld0ZpZWxkLCBlbWl0XSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicHktMiBwbC01XCI+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgIHZhcmlhbnQ9XCJzZWNvbmRhcnktYWNjZW50XCJcbiAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLXgtWzFweF1cIlxuICAgICAgICBvbkNsaWNrPXtoYW5kbGVBZGRGaWVsZH1cbiAgICAgID5cbiAgICAgICAgPFJpQWRkQ2lyY2xlRmlsbCBjbGFzc05hbWU9XCJoLTMuNSB3LTMuNVwiIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInB4LVszcHhdXCI+e3QoJ25vZGVzLmxsbS5qc29uU2NoZW1hLmFkZEZpZWxkJywgeyBuczogJ3dvcmtmbG93JyB9KX08L3NwYW4+XG4gICAgICA8L0J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEFkZEZpZWxkKVxuIl19