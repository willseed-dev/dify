"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const key_value_edit_1 = require("./key-value-edit");
const KeyValueList = ({ readonly, nodeId, list, onChange, onAdd, isSupportFile,
// toggleKeyValueEdit,
 }) => {
    // const handleBulkValueChange = useCallback((value: string) => {
    //   const newList = value.split('\n').map((item) => {
    //     const [key, value] = item.split(':')
    //     return {
    //       key: key ? key.trim() : '',
    //       value: value ? value.trim() : '',
    //     }
    //   })
    //   onChange(newList)
    // }, [onChange])
    // const bulkList = (() => {
    //   const res = list.map((item) => {
    //     if (!item.key && !item.value)
    //       return ''
    //     if (!item.value)
    //       return item.key
    //     return `${item.key}:${item.value}`
    //   }).join('\n')
    //   return res
    // })()
    return (<key_value_edit_1.default readonly={readonly} nodeId={nodeId} list={list} onChange={onChange} onAdd={onAdd} isSupportFile={isSupportFile}/>);
    // : <BulkEdit
    //   value={bulkList}
    //   onChange={handleBulkValueChange}
    //   onSwitchToKeyValueEdit={toggleKeyValueEdit}
    // />
};
exports.default = React.memo(KeyValueList);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWiwrQkFBOEI7QUFDOUIscURBQTJDO0FBWTNDLE1BQU0sWUFBWSxHQUFjLENBQUMsRUFDL0IsUUFBUSxFQUNSLE1BQU0sRUFDTixJQUFJLEVBQ0osUUFBUSxFQUNSLEtBQUssRUFDTCxhQUFhO0FBQ2Isc0JBQXNCO0VBQ3ZCLEVBQUUsRUFBRTtJQUNILGlFQUFpRTtJQUNqRSxzREFBc0Q7SUFDdEQsMkNBQTJDO0lBQzNDLGVBQWU7SUFDZixvQ0FBb0M7SUFDcEMsMENBQTBDO0lBQzFDLFFBQVE7SUFDUixPQUFPO0lBQ1Asc0JBQXNCO0lBQ3RCLGlCQUFpQjtJQUVqQiw0QkFBNEI7SUFDNUIscUNBQXFDO0lBQ3JDLG9DQUFvQztJQUNwQyxrQkFBa0I7SUFDbEIsdUJBQXVCO0lBQ3ZCLHdCQUF3QjtJQUN4Qix5Q0FBeUM7SUFDekMsa0JBQWtCO0lBQ2xCLGVBQWU7SUFDZixPQUFPO0lBQ1AsT0FBTyxDQUNMLENBQUMsd0JBQVksQ0FDWCxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDbkIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ2YsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ1gsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ25CLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNiLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUU3QixDQUNILENBQUE7SUFDRCxjQUFjO0lBQ2QscUJBQXFCO0lBQ3JCLHFDQUFxQztJQUNyQyxnREFBZ0Q7SUFDaEQsS0FBSztBQUNQLENBQUMsQ0FBQTtBQUNELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgS2V5VmFsdWUgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IEtleVZhbHVlRWRpdCBmcm9tICcuL2tleS12YWx1ZS1lZGl0J1xuXG50eXBlIFByb3BzID0ge1xuICByZWFkb25seTogYm9vbGVhblxuICBub2RlSWQ6IHN0cmluZ1xuICBsaXN0OiBLZXlWYWx1ZVtdXG4gIG9uQ2hhbmdlOiAobmV3TGlzdDogS2V5VmFsdWVbXSkgPT4gdm9pZFxuICBvbkFkZDogKCkgPT4gdm9pZFxuICBpc1N1cHBvcnRGaWxlPzogYm9vbGVhblxuICAvLyB0b2dnbGVLZXlWYWx1ZUVkaXQ6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgS2V5VmFsdWVMaXN0OiBGQzxQcm9wcz4gPSAoe1xuICByZWFkb25seSxcbiAgbm9kZUlkLFxuICBsaXN0LFxuICBvbkNoYW5nZSxcbiAgb25BZGQsXG4gIGlzU3VwcG9ydEZpbGUsXG4gIC8vIHRvZ2dsZUtleVZhbHVlRWRpdCxcbn0pID0+IHtcbiAgLy8gY29uc3QgaGFuZGxlQnVsa1ZhbHVlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgLy8gICBjb25zdCBuZXdMaXN0ID0gdmFsdWUuc3BsaXQoJ1xcbicpLm1hcCgoaXRlbSkgPT4ge1xuICAvLyAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gaXRlbS5zcGxpdCgnOicpXG4gIC8vICAgICByZXR1cm4ge1xuICAvLyAgICAgICBrZXk6IGtleSA/IGtleS50cmltKCkgOiAnJyxcbiAgLy8gICAgICAgdmFsdWU6IHZhbHVlID8gdmFsdWUudHJpbSgpIDogJycsXG4gIC8vICAgICB9XG4gIC8vICAgfSlcbiAgLy8gICBvbkNoYW5nZShuZXdMaXN0KVxuICAvLyB9LCBbb25DaGFuZ2VdKVxuXG4gIC8vIGNvbnN0IGJ1bGtMaXN0ID0gKCgpID0+IHtcbiAgLy8gICBjb25zdCByZXMgPSBsaXN0Lm1hcCgoaXRlbSkgPT4ge1xuICAvLyAgICAgaWYgKCFpdGVtLmtleSAmJiAhaXRlbS52YWx1ZSlcbiAgLy8gICAgICAgcmV0dXJuICcnXG4gIC8vICAgICBpZiAoIWl0ZW0udmFsdWUpXG4gIC8vICAgICAgIHJldHVybiBpdGVtLmtleVxuICAvLyAgICAgcmV0dXJuIGAke2l0ZW0ua2V5fToke2l0ZW0udmFsdWV9YFxuICAvLyAgIH0pLmpvaW4oJ1xcbicpXG4gIC8vICAgcmV0dXJuIHJlc1xuICAvLyB9KSgpXG4gIHJldHVybiAoXG4gICAgPEtleVZhbHVlRWRpdFxuICAgICAgcmVhZG9ubHk9e3JlYWRvbmx5fVxuICAgICAgbm9kZUlkPXtub2RlSWR9XG4gICAgICBsaXN0PXtsaXN0fVxuICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgb25BZGQ9e29uQWRkfVxuICAgICAgaXNTdXBwb3J0RmlsZT17aXNTdXBwb3J0RmlsZX1cbiAgICAgIC8vIG9uU3dpdGNoVG9CdWxrRWRpdD17dG9nZ2xlS2V5VmFsdWVFZGl0fVxuICAgIC8+XG4gIClcbiAgLy8gOiA8QnVsa0VkaXRcbiAgLy8gICB2YWx1ZT17YnVsa0xpc3R9XG4gIC8vICAgb25DaGFuZ2U9e2hhbmRsZUJ1bGtWYWx1ZUNoYW5nZX1cbiAgLy8gICBvblN3aXRjaFRvS2V5VmFsdWVFZGl0PXt0b2dnbGVLZXlWYWx1ZUVkaXR9XG4gIC8vIC8+XG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEtleVZhbHVlTGlzdClcbiJdfQ==