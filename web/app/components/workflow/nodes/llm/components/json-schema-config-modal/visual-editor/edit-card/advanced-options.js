"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const divider_1 = require("@/app/components/base/divider");
const textarea_1 = require("@/app/components/base/textarea");
const AdvancedOptions = ({ onChange, options, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    // const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
    const [enumValue, setEnumValue] = (0, react_1.useState)(options.enum);
    const handleEnumChange = (0, react_1.useCallback)((e) => {
        setEnumValue(e.target.value);
    }, []);
    const handleEnumBlur = (0, react_1.useCallback)((e) => {
        onChange({ enum: e.target.value });
    }, [onChange]);
    // const handleToggleAdvancedOptions = useCallback(() => {
    //   setShowAdvancedOptions(prev => !prev)
    // }, [])
    return (<div className="border-t border-divider-subtle">
      {/* {showAdvancedOptions ? ( */}
      <div className="flex flex-col gap-y-1 px-2 py-1.5">
        <div className="flex w-full items-center gap-x-2">
          <span className="system-2xs-medium-uppercase text-text-tertiary">
            {t('nodes.llm.jsonSchema.stringValidations', { ns: 'workflow' })}
          </span>
          <div className="grow">
            <divider_1.default type="horizontal" className="my-0 h-px bg-line-divider-bg"/>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="system-xs-medium flex h-6 items-center text-text-secondary">
            Enum
          </div>
          <textarea_1.default size="small" className="min-h-6" value={enumValue} onChange={handleEnumChange} onBlur={handleEnumBlur} placeholder="abcd, 1, 1.5, etc."/>
        </div>
      </div>
      {/* ) : (
          <button
            type='button'
            className='flex items-center gap-x-0.5 pb-1 pl-1.5 pr-2 pt-2'
            onClick={handleToggleAdvancedOptions}
          >
            <RiArrowDownDoubleLine className='h-3 w-3 text-text-tertiary' />
            <span className='system-xs-regular text-text-tertiary'>
              {t('workflow.nodes.llm.jsonSchema.showAdvancedOptions')}
            </span>
          </button>
        )} */}
    </div>);
};
exports.default = React.memo(AdvancedOptions);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWR2YW5jZWQtb3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFkdmFuY2VkLW9wdGlvbnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQThCO0FBQzlCLGlDQUE2QztBQUM3QyxpREFBOEM7QUFDOUMsMkRBQW1EO0FBQ25ELDZEQUFxRDtBQVdyRCxNQUFNLGVBQWUsR0FBNkIsQ0FBQyxFQUNqRCxRQUFRLEVBQ1IsT0FBTyxHQUNSLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5Qix3RUFBd0U7SUFDeEUsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRXhELE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsQ0FBeUMsRUFBRSxFQUFFO1FBQ2pGLFlBQVksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUVOLE1BQU0sY0FBYyxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLENBQXdDLEVBQUUsRUFBRTtRQUM5RSxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ3BDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFFZCwwREFBMEQ7SUFDMUQsMENBQTBDO0lBQzFDLFNBQVM7SUFFVCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUM3QztNQUFBLENBQUMsOEJBQThCLENBQy9CO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUNoRDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FDL0M7VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0RBQWdELENBQzlEO1lBQUEsQ0FBQyxDQUFDLENBQUMsd0NBQXdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDbEU7VUFBQSxFQUFFLElBQUksQ0FDTjtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ25CO1lBQUEsQ0FBQyxpQkFBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLDhCQUE4QixFQUNyRTtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUM1QjtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0REFBNEQsQ0FDekU7O1VBQ0YsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLGtCQUFRLENBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FDWixTQUFTLENBQUMsU0FBUyxDQUNuQixLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDakIsUUFBUSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FDM0IsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQ3ZCLFdBQVcsQ0FBQyxvQkFBb0IsRUFFcEM7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQzs7Ozs7Ozs7Ozs7YUFXSSxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCBUZXh0YXJlYSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdGV4dGFyZWEnXG5cbmV4cG9ydCB0eXBlIEFkdmFuY2VkT3B0aW9uc1R5cGUgPSB7XG4gIGVudW06IHN0cmluZ1xufVxuXG50eXBlIEFkdmFuY2VkT3B0aW9uc1Byb3BzID0ge1xuICBvcHRpb25zOiBBZHZhbmNlZE9wdGlvbnNUeXBlXG4gIG9uQ2hhbmdlOiAob3B0aW9uczogQWR2YW5jZWRPcHRpb25zVHlwZSkgPT4gdm9pZFxufVxuXG5jb25zdCBBZHZhbmNlZE9wdGlvbnM6IEZDPEFkdmFuY2VkT3B0aW9uc1Byb3BzPiA9ICh7XG4gIG9uQ2hhbmdlLFxuICBvcHRpb25zLFxufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgLy8gY29uc3QgW3Nob3dBZHZhbmNlZE9wdGlvbnMsIHNldFNob3dBZHZhbmNlZE9wdGlvbnNdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtlbnVtVmFsdWUsIHNldEVudW1WYWx1ZV0gPSB1c2VTdGF0ZShvcHRpb25zLmVudW0pXG5cbiAgY29uc3QgaGFuZGxlRW51bUNoYW5nZSA9IHVzZUNhbGxiYWNrKChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MVGV4dEFyZWFFbGVtZW50PikgPT4ge1xuICAgIHNldEVudW1WYWx1ZShlLnRhcmdldC52YWx1ZSlcbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlRW51bUJsdXIgPSB1c2VDYWxsYmFjaygoZTogUmVhY3QuRm9jdXNFdmVudDxIVE1MVGV4dEFyZWFFbGVtZW50PikgPT4ge1xuICAgIG9uQ2hhbmdlKHsgZW51bTogZS50YXJnZXQudmFsdWUgfSlcbiAgfSwgW29uQ2hhbmdlXSlcblxuICAvLyBjb25zdCBoYW5kbGVUb2dnbGVBZHZhbmNlZE9wdGlvbnMgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gIC8vICAgc2V0U2hvd0FkdmFuY2VkT3B0aW9ucyhwcmV2ID0+ICFwcmV2KVxuICAvLyB9LCBbXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLWRpdmlkZXItc3VidGxlXCI+XG4gICAgICB7Lyoge3Nob3dBZHZhbmNlZE9wdGlvbnMgPyAoICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC15LTEgcHgtMiBweS0xLjVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBpdGVtcy1jZW50ZXIgZ2FwLXgtMlwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS0yeHMtbWVkaXVtLXVwcGVyY2FzZSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgIHt0KCdub2Rlcy5sbG0uanNvblNjaGVtYS5zdHJpbmdWYWxpZGF0aW9ucycsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3Jvd1wiPlxuICAgICAgICAgICAgPERpdmlkZXIgdHlwZT1cImhvcml6b250YWxcIiBjbGFzc05hbWU9XCJteS0wIGgtcHggYmctbGluZS1kaXZpZGVyLWJnXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLW1lZGl1bSBmbGV4IGgtNiBpdGVtcy1jZW50ZXIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgRW51bVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxUZXh0YXJlYVxuICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1pbi1oLTZcIlxuICAgICAgICAgICAgdmFsdWU9e2VudW1WYWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVFbnVtQ2hhbmdlfVxuICAgICAgICAgICAgb25CbHVyPXtoYW5kbGVFbnVtQmx1cn1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYWJjZCwgMSwgMS41LCBldGMuXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgey8qICkgOiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgY2xhc3NOYW1lPSdmbGV4IGl0ZW1zLWNlbnRlciBnYXAteC0wLjUgcGItMSBwbC0xLjUgcHItMiBwdC0yJ1xuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVRvZ2dsZUFkdmFuY2VkT3B0aW9uc31cbiAgICAgICAgPlxuICAgICAgICAgIDxSaUFycm93RG93bkRvdWJsZUxpbmUgY2xhc3NOYW1lPSdoLTMgdy0zIHRleHQtdGV4dC10ZXJ0aWFyeScgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3N5c3RlbS14cy1yZWd1bGFyIHRleHQtdGV4dC10ZXJ0aWFyeSc+XG4gICAgICAgICAgICB7dCgnd29ya2Zsb3cubm9kZXMubGxtLmpzb25TY2hlbWEuc2hvd0FkdmFuY2VkT3B0aW9ucycpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApfSAqL31cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEFkdmFuY2VkT3B0aW9ucylcbiJdfQ==