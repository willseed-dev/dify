"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateOnly = exports.Playground = void 0;
const react_1 = require("react");
const test_1 = require("storybook/test");
const date_picker_1 = require("./date-picker");
const dayjs_1 = require("./utils/dayjs");
const meta = {
    title: 'Base/Data Entry/DateAndTimePicker',
    component: date_picker_1.default,
    parameters: {
        docs: {
            description: {
                component: 'Combined date and time picker with timezone support. Includes shortcuts for “now”, year-month navigation, and optional time selection.',
            },
        },
    },
    tags: ['autodocs'],
    args: {
        value: (0, dayjs_1.getDateWithTimezone)({}),
        timezone: dayjs_1.default.tz.guess(),
        needTimePicker: true,
        placeholder: 'Select schedule time',
        onChange: (0, test_1.fn)(),
        onClear: (0, test_1.fn)(),
    },
};
exports.default = meta;
const DatePickerPlayground = (props) => {
    const [value, setValue] = (0, react_1.useState)(props.value);
    return (<div className="inline-flex flex-col items-start gap-3">
      <date_picker_1.default popupZIndexClassname="z-50" {...props} value={value} onChange={setValue} onClear={() => setValue(undefined)}/>
      <div className="w-[252px] rounded-lg border border-divider-subtle bg-components-panel-bg p-3 text-xs text-text-secondary">
        Selected datetime:
        {' '}
        <span className="font-mono text-text-primary">{value ? value.format() : 'undefined'}</span>
      </div>
    </div>);
};
exports.Playground = {
    render: args => <DatePickerPlayground {...args}/>,
    args: {
        ...meta.args,
        needTimePicker: false,
        placeholder: 'Select due date',
    },
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
const [value, setValue] = useState(getDateWithTimezone({}))

<DatePicker
  popupZIndexClassname="z-50"
  value={value}
  timezone={dayjs.tz.guess()}
  onChange={setValue}
  onClear={() => setValue(undefined)}
/>
        `.trim(),
            },
        },
    },
};
exports.DateOnly = {
    render: args => (<DatePickerPlayground {...args} needTimePicker={false} placeholder="Select due date"/>),
    args: {
        ...meta.args,
        needTimePicker: false,
        placeholder: 'Select due date',
    },
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<DatePicker needTimePicker={false} placeholder="Select due date" />
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFnQztBQUNoQyx5Q0FBbUM7QUFDbkMsK0NBQXNDO0FBQ3RDLHlDQUEwRDtBQUUxRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSxtQ0FBbUM7SUFDMUMsU0FBUyxFQUFFLHFCQUFVO0lBQ3JCLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsd0lBQXdJO2FBQ3BKO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsSUFBQSwyQkFBbUIsRUFBQyxFQUFFLENBQUM7UUFDOUIsUUFBUSxFQUFFLGVBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFO1FBQzFCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLFdBQVcsRUFBRSxzQkFBc0I7UUFDbkMsUUFBUSxFQUFFLElBQUEsU0FBRSxHQUFFO1FBQ2QsT0FBTyxFQUFFLElBQUEsU0FBRSxHQUFFO0tBQ2Q7Q0FDZ0MsQ0FBQTtBQUVuQyxrQkFBZSxJQUFJLENBQUE7QUFHbkIsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEtBQXNCLEVBQUUsRUFBRTtJQUN0RCxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFL0MsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FDckQ7TUFBQSxDQUFDLHFCQUFVLENBQ1Qsb0JBQW9CLENBQUMsTUFBTSxDQUMzQixJQUFJLEtBQUssQ0FBQyxDQUNWLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNiLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNuQixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFFckM7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEdBQTBHLENBQ3ZIOztRQUNBLENBQUMsR0FBRyxDQUNKO1FBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FDNUY7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVZLFFBQUEsVUFBVSxHQUFVO0lBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztJQUNsRCxJQUFJLEVBQUU7UUFDSixHQUFHLElBQUksQ0FBQyxJQUFJO1FBQ1osY0FBYyxFQUFFLEtBQUs7UUFDckIsV0FBVyxFQUFFLGlCQUFpQjtLQUMvQjtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7Ozs7Ozs7U0FVTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUE7QUFFWSxRQUFBLFFBQVEsR0FBVTtJQUM3QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsb0JBQW9CLENBQ25CLElBQUksSUFBSSxDQUFDLENBQ1QsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ3RCLFdBQVcsQ0FBQyxpQkFBaUIsRUFDN0IsQ0FDSDtJQUNELElBQUksRUFBRTtRQUNKLEdBQUcsSUFBSSxDQUFDLElBQUk7UUFDWixjQUFjLEVBQUUsS0FBSztRQUNyQixXQUFXLEVBQUUsaUJBQWlCO0tBQy9CO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7U0FFTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgdHlwZSB7IERhdGVQaWNrZXJQcm9wcyB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZm4gfSBmcm9tICdzdG9yeWJvb2svdGVzdCdcbmltcG9ydCBEYXRlUGlja2VyIGZyb20gJy4vZGF0ZS1waWNrZXInXG5pbXBvcnQgZGF5anMsIHsgZ2V0RGF0ZVdpdGhUaW1lem9uZSB9IGZyb20gJy4vdXRpbHMvZGF5anMnXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIEVudHJ5L0RhdGVBbmRUaW1lUGlja2VyJyxcbiAgY29tcG9uZW50OiBEYXRlUGlja2VyLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnQ29tYmluZWQgZGF0ZSBhbmQgdGltZSBwaWNrZXIgd2l0aCB0aW1lem9uZSBzdXBwb3J0LiBJbmNsdWRlcyBzaG9ydGN1dHMgZm9yIOKAnG5vd+KAnSwgeWVhci1tb250aCBuYXZpZ2F0aW9uLCBhbmQgb3B0aW9uYWwgdGltZSBzZWxlY3Rpb24uJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdzOiB7XG4gICAgdmFsdWU6IGdldERhdGVXaXRoVGltZXpvbmUoe30pLFxuICAgIHRpbWV6b25lOiBkYXlqcy50ei5ndWVzcygpLFxuICAgIG5lZWRUaW1lUGlja2VyOiB0cnVlLFxuICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IHNjaGVkdWxlIHRpbWUnLFxuICAgIG9uQ2hhbmdlOiBmbigpLFxuICAgIG9uQ2xlYXI6IGZuKCksXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBEYXRlUGlja2VyPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmNvbnN0IERhdGVQaWNrZXJQbGF5Z3JvdW5kID0gKHByb3BzOiBEYXRlUGlja2VyUHJvcHMpID0+IHtcbiAgY29uc3QgW3ZhbHVlLCBzZXRWYWx1ZV0gPSB1c2VTdGF0ZShwcm9wcy52YWx1ZSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggZmxleC1jb2wgaXRlbXMtc3RhcnQgZ2FwLTNcIj5cbiAgICAgIDxEYXRlUGlja2VyXG4gICAgICAgIHBvcHVwWkluZGV4Q2xhc3NuYW1lPVwiei01MFwiXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICBvbkNoYW5nZT17c2V0VmFsdWV9XG4gICAgICAgIG9uQ2xlYXI9eygpID0+IHNldFZhbHVlKHVuZGVmaW5lZCl9XG4gICAgICAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LVsyNTJweF0gcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC0zIHRleHQteHMgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICBTZWxlY3RlZCBkYXRldGltZTpcbiAgICAgICAgeycgJ31cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIHRleHQtdGV4dC1wcmltYXJ5XCI+e3ZhbHVlID8gdmFsdWUuZm9ybWF0KCkgOiAndW5kZWZpbmVkJ308L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8RGF0ZVBpY2tlclBsYXlncm91bmQgey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgLi4ubWV0YS5hcmdzLFxuICAgIG5lZWRUaW1lUGlja2VyOiBmYWxzZSxcbiAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBkdWUgZGF0ZScsXG4gIH0sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG5jb25zdCBbdmFsdWUsIHNldFZhbHVlXSA9IHVzZVN0YXRlKGdldERhdGVXaXRoVGltZXpvbmUoe30pKVxuXG48RGF0ZVBpY2tlclxuICBwb3B1cFpJbmRleENsYXNzbmFtZT1cInotNTBcIlxuICB2YWx1ZT17dmFsdWV9XG4gIHRpbWV6b25lPXtkYXlqcy50ei5ndWVzcygpfVxuICBvbkNoYW5nZT17c2V0VmFsdWV9XG4gIG9uQ2xlYXI9eygpID0+IHNldFZhbHVlKHVuZGVmaW5lZCl9XG4vPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IERhdGVPbmx5OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IChcbiAgICA8RGF0ZVBpY2tlclBsYXlncm91bmRcbiAgICAgIHsuLi5hcmdzfVxuICAgICAgbmVlZFRpbWVQaWNrZXI9e2ZhbHNlfVxuICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgZHVlIGRhdGVcIlxuICAgIC8+XG4gICksXG4gIGFyZ3M6IHtcbiAgICAuLi5tZXRhLmFyZ3MsXG4gICAgbmVlZFRpbWVQaWNrZXI6IGZhbHNlLFxuICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IGR1ZSBkYXRlJyxcbiAgfSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbjxEYXRlUGlja2VyIG5lZWRUaW1lUGlja2VyPXtmYWxzZX0gcGxhY2Vob2xkZXI9XCJTZWxlY3QgZHVlIGRhdGVcIiAvPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==