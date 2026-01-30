"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const MIN_VALUE = 0;
const Input = ({ value, onChange, placeholder = '', isNumber = false, }) => {
    const handleChange = (0, react_1.useCallback)((e) => {
        const value = e.target.value;
        if (isNumber) {
            let numberValue = Number.parseInt(value, 10); // integer only
            if (Number.isNaN(numberValue)) {
                onChange('');
                return;
            }
            if (numberValue < MIN_VALUE)
                numberValue = MIN_VALUE;
            onChange(numberValue);
            return;
        }
        onChange(value);
    }, [isNumber, onChange]);
    const otherOption = (() => {
        if (isNumber) {
            return {
                min: MIN_VALUE,
            };
        }
        return {};
    })();
    return (<input type={isNumber ? 'number' : 'text'} {...otherOption} value={value} onChange={handleChange} className="system-xs-regular focus:bg-components-inout-border-active flex h-8 w-full rounded-lg border border-transparent
      bg-components-input-bg-normal p-2 text-components-input-text-filled
        caret-[#295eff] placeholder:text-components-input-text-placeholder hover:border
        hover:border-components-input-border-hover hover:bg-components-input-bg-hover focus:border focus:border-components-input-border-active
        focus:shadow-xs focus:shadow-shadow-shadow-3
        focus-visible:outline-none" placeholder={placeholder}/>);
};
exports.default = React.memo(Input);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnB1dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiwrQkFBOEI7QUFDOUIsaUNBQW1DO0FBU25DLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUVuQixNQUFNLEtBQUssR0FBYyxDQUFDLEVBQ3hCLEtBQUssRUFDTCxRQUFRLEVBQ1IsV0FBVyxHQUFHLEVBQUUsRUFDaEIsUUFBUSxHQUFHLEtBQUssR0FDakIsRUFBRSxFQUFFO0lBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsQ0FBc0MsRUFBRSxFQUFFO1FBQzFFLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO1FBQzVCLElBQUksUUFBUSxFQUFFLENBQUM7WUFDYixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQSxDQUFDLGVBQWU7WUFDNUQsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7Z0JBQzlCLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDWixPQUFNO1lBQ1IsQ0FBQztZQUNELElBQUksV0FBVyxHQUFHLFNBQVM7Z0JBQ3pCLFdBQVcsR0FBRyxTQUFTLENBQUE7WUFFekIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ3JCLE9BQU07UUFDUixDQUFDO1FBQ0QsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2pCLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRXhCLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ3hCLElBQUksUUFBUSxFQUFFLENBQUM7WUFDYixPQUFPO2dCQUNMLEdBQUcsRUFBRSxTQUFTO2FBQ2YsQ0FBQTtRQUNILENBQUM7UUFDRCxPQUFPLEVBRU4sQ0FBQTtJQUNILENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDSixPQUFPLENBQ0wsQ0FBQyxLQUFLLENBQ0osSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUNuQyxJQUFJLFdBQVcsQ0FBQyxDQUNoQixLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDYixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDdkIsU0FBUyxDQUFDOzs7OzttQ0FLbUIsQ0FDN0IsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQ3pCLENBQ0gsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUNELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcblxudHlwZSBQcm9wcyA9IHtcbiAgdmFsdWU6IHN0cmluZyB8IG51bWJlclxuICBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpID0+IHZvaWRcbiAgcGxhY2Vob2xkZXI/OiBzdHJpbmdcbiAgaXNOdW1iZXI/OiBib29sZWFuXG59XG5cbmNvbnN0IE1JTl9WQUxVRSA9IDBcblxuY29uc3QgSW5wdXQ6IEZDPFByb3BzPiA9ICh7XG4gIHZhbHVlLFxuICBvbkNoYW5nZSxcbiAgcGxhY2Vob2xkZXIgPSAnJyxcbiAgaXNOdW1iZXIgPSBmYWxzZSxcbn0pID0+IHtcbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBlLnRhcmdldC52YWx1ZVxuICAgIGlmIChpc051bWJlcikge1xuICAgICAgbGV0IG51bWJlclZhbHVlID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlLCAxMCkgLy8gaW50ZWdlciBvbmx5XG4gICAgICBpZiAoTnVtYmVyLmlzTmFOKG51bWJlclZhbHVlKSkge1xuICAgICAgICBvbkNoYW5nZSgnJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAobnVtYmVyVmFsdWUgPCBNSU5fVkFMVUUpXG4gICAgICAgIG51bWJlclZhbHVlID0gTUlOX1ZBTFVFXG5cbiAgICAgIG9uQ2hhbmdlKG51bWJlclZhbHVlKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIG9uQ2hhbmdlKHZhbHVlKVxuICB9LCBbaXNOdW1iZXIsIG9uQ2hhbmdlXSlcblxuICBjb25zdCBvdGhlck9wdGlvbiA9ICgoKSA9PiB7XG4gICAgaWYgKGlzTnVtYmVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtaW46IE1JTl9WQUxVRSxcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcblxuICAgIH1cbiAgfSkoKVxuICByZXR1cm4gKFxuICAgIDxpbnB1dFxuICAgICAgdHlwZT17aXNOdW1iZXIgPyAnbnVtYmVyJyA6ICd0ZXh0J31cbiAgICAgIHsuLi5vdGhlck9wdGlvbn1cbiAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciBmb2N1czpiZy1jb21wb25lbnRzLWlub3V0LWJvcmRlci1hY3RpdmUgZmxleCBoLTggdy1mdWxsIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudFxuICAgICAgYmctY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwgcC0yIHRleHQtY29tcG9uZW50cy1pbnB1dC10ZXh0LWZpbGxlZFxuICAgICAgICBjYXJldC1bIzI5NWVmZl0gcGxhY2Vob2xkZXI6dGV4dC1jb21wb25lbnRzLWlucHV0LXRleHQtcGxhY2Vob2xkZXIgaG92ZXI6Ym9yZGVyXG4gICAgICAgIGhvdmVyOmJvcmRlci1jb21wb25lbnRzLWlucHV0LWJvcmRlci1ob3ZlciBob3ZlcjpiZy1jb21wb25lbnRzLWlucHV0LWJnLWhvdmVyIGZvY3VzOmJvcmRlciBmb2N1czpib3JkZXItY29tcG9uZW50cy1pbnB1dC1ib3JkZXItYWN0aXZlXG4gICAgICAgIGZvY3VzOnNoYWRvdy14cyBmb2N1czpzaGFkb3ctc2hhZG93LXNoYWRvdy0zXG4gICAgICAgIGZvY3VzLXZpc2libGU6b3V0bGluZS1ub25lXCJcbiAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cbiAgICAvPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKElucHV0KVxuIl19