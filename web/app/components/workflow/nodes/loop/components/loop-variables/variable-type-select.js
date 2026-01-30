"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pure_1 = require("@/app/components/base/select/pure");
const types_1 = require("@/app/components/workflow/types");
const VariableTypeSelect = ({ value, onChange, }) => {
    const options = [
        {
            label: 'String',
            value: types_1.VarType.string,
        },
        {
            label: 'Number',
            value: types_1.VarType.number,
        },
        {
            label: 'Object',
            value: types_1.VarType.object,
        },
        {
            label: 'Boolean',
            value: types_1.VarType.boolean,
        },
        {
            label: 'Array[string]',
            value: types_1.VarType.arrayString,
        },
        {
            label: 'Array[number]',
            value: types_1.VarType.arrayNumber,
        },
        {
            label: 'Array[object]',
            value: types_1.VarType.arrayObject,
        },
        {
            label: 'Array[boolean]',
            value: types_1.VarType.arrayBoolean,
        },
    ];
    return (<pure_1.default options={options} value={value} onChange={onChange} popupProps={{
            className: 'w-[132px]',
        }}/>);
};
exports.default = VariableTypeSelect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtdHlwZS1zZWxlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YXJpYWJsZS10eXBlLXNlbGVjdC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFBMEQ7QUFDMUQsMkRBQXlEO0FBTXpELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxFQUMxQixLQUFLLEVBQ0wsUUFBUSxHQUNnQixFQUFFLEVBQUU7SUFDNUIsTUFBTSxPQUFPLEdBQUc7UUFDZDtZQUNFLEtBQUssRUFBRSxRQUFRO1lBQ2YsS0FBSyxFQUFFLGVBQU8sQ0FBQyxNQUFNO1NBQ3RCO1FBQ0Q7WUFDRSxLQUFLLEVBQUUsUUFBUTtZQUNmLEtBQUssRUFBRSxlQUFPLENBQUMsTUFBTTtTQUN0QjtRQUNEO1lBQ0UsS0FBSyxFQUFFLFFBQVE7WUFDZixLQUFLLEVBQUUsZUFBTyxDQUFDLE1BQU07U0FDdEI7UUFDRDtZQUNFLEtBQUssRUFBRSxTQUFTO1lBQ2hCLEtBQUssRUFBRSxlQUFPLENBQUMsT0FBTztTQUN2QjtRQUNEO1lBQ0UsS0FBSyxFQUFFLGVBQWU7WUFDdEIsS0FBSyxFQUFFLGVBQU8sQ0FBQyxXQUFXO1NBQzNCO1FBQ0Q7WUFDRSxLQUFLLEVBQUUsZUFBZTtZQUN0QixLQUFLLEVBQUUsZUFBTyxDQUFDLFdBQVc7U0FDM0I7UUFDRDtZQUNFLEtBQUssRUFBRSxlQUFlO1lBQ3RCLEtBQUssRUFBRSxlQUFPLENBQUMsV0FBVztTQUMzQjtRQUNEO1lBQ0UsS0FBSyxFQUFFLGdCQUFnQjtZQUN2QixLQUFLLEVBQUUsZUFBTyxDQUFDLFlBQVk7U0FDNUI7S0FDRixDQUFBO0lBRUQsT0FBTyxDQUNMLENBQUMsY0FBVSxDQUNULE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNqQixLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDYixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDbkIsVUFBVSxDQUFDLENBQUM7WUFDVixTQUFTLEVBQUUsV0FBVztTQUN2QixDQUFDLEVBQ0YsQ0FDSCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHVyZVNlbGVjdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2VsZWN0L3B1cmUnXG5pbXBvcnQgeyBWYXJUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcblxudHlwZSBWYXJpYWJsZVR5cGVTZWxlY3RQcm9wcyA9IHtcbiAgdmFsdWU/OiBzdHJpbmdcbiAgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkXG59XG5jb25zdCBWYXJpYWJsZVR5cGVTZWxlY3QgPSAoe1xuICB2YWx1ZSxcbiAgb25DaGFuZ2UsXG59OiBWYXJpYWJsZVR5cGVTZWxlY3RQcm9wcykgPT4ge1xuICBjb25zdCBvcHRpb25zID0gW1xuICAgIHtcbiAgICAgIGxhYmVsOiAnU3RyaW5nJyxcbiAgICAgIHZhbHVlOiBWYXJUeXBlLnN0cmluZyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTnVtYmVyJyxcbiAgICAgIHZhbHVlOiBWYXJUeXBlLm51bWJlcixcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnT2JqZWN0JyxcbiAgICAgIHZhbHVlOiBWYXJUeXBlLm9iamVjdCxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnQm9vbGVhbicsXG4gICAgICB2YWx1ZTogVmFyVHlwZS5ib29sZWFuLFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdBcnJheVtzdHJpbmddJyxcbiAgICAgIHZhbHVlOiBWYXJUeXBlLmFycmF5U3RyaW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdBcnJheVtudW1iZXJdJyxcbiAgICAgIHZhbHVlOiBWYXJUeXBlLmFycmF5TnVtYmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdBcnJheVtvYmplY3RdJyxcbiAgICAgIHZhbHVlOiBWYXJUeXBlLmFycmF5T2JqZWN0LFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdBcnJheVtib29sZWFuXScsXG4gICAgICB2YWx1ZTogVmFyVHlwZS5hcnJheUJvb2xlYW4sXG4gICAgfSxcbiAgXVxuXG4gIHJldHVybiAoXG4gICAgPFB1cmVTZWxlY3RcbiAgICAgIG9wdGlvbnM9e29wdGlvbnN9XG4gICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICBwb3B1cFByb3BzPXt7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ctWzEzMnB4XScsXG4gICAgICB9fVxuICAgIC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgVmFyaWFibGVUeXBlU2VsZWN0XG4iXX0=