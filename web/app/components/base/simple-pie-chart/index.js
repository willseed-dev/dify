"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const echarts_for_react_1 = require("echarts-for-react");
const react_1 = require("react");
const classnames_1 = require("@/utils/classnames");
const index_module_css_1 = require("./index.module.css");
const SimplePieChart = ({ percentage = 80, fill = '#fdb022', stroke = '#f79009', size = 12, animationDuration, className }) => {
    const option = (0, react_1.useMemo)(() => ({
        series: [
            {
                type: 'pie',
                radius: ['83%', '100%'],
                animation: false,
                data: [
                    { value: 100, itemStyle: { color: stroke } },
                ],
                emphasis: {
                    disabled: true,
                },
                labelLine: {
                    show: false,
                },
                cursor: 'default',
            },
            {
                type: 'pie',
                radius: '83%',
                animationDuration: animationDuration ?? 600,
                data: [
                    { value: percentage, itemStyle: { color: fill } },
                    { value: 100 - percentage, itemStyle: { color: '#fff' } },
                ],
                emphasis: {
                    disabled: true,
                },
                labelLine: {
                    show: false,
                },
                cursor: 'default',
            },
        ],
    }), [stroke, fill, percentage, animationDuration]);
    return (<echarts_for_react_1.default option={option} className={(0, classnames_1.cn)(index_module_css_1.default.simplePieChart, className)} style={{
            '--simple-pie-chart-color': fill,
            'width': size,
            'height': size,
        }}/>);
};
exports.default = (0, react_1.memo)(SimplePieChart);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5REFBNEM7QUFDNUMsaUNBQXFDO0FBQ3JDLG1EQUF1QztBQUN2Qyx5REFBc0M7QUFXdEMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLFNBQVMsRUFBRSxNQUFNLEdBQUcsU0FBUyxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUF1QixFQUFFLEVBQUU7SUFDakosTUFBTSxNQUFNLEdBQWtCLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0MsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztnQkFDdkIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLElBQUksRUFBRTtvQkFDSixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFO2lCQUM3QztnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsUUFBUSxFQUFFLElBQUk7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxLQUFLO2lCQUNaO2dCQUNELE1BQU0sRUFBRSxTQUFTO2FBQ2xCO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsaUJBQWlCLEVBQUUsaUJBQWlCLElBQUksR0FBRztnQkFDM0MsSUFBSSxFQUFFO29CQUNKLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7b0JBQ2pELEVBQUUsS0FBSyxFQUFFLEdBQUcsR0FBRyxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFO2lCQUMxRDtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsUUFBUSxFQUFFLElBQUk7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxLQUFLO2lCQUNaO2dCQUNELE1BQU0sRUFBRSxTQUFTO2FBQ2xCO1NBQ0Y7S0FDRixDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7SUFFbEQsT0FBTyxDQUNMLENBQUMsMkJBQVksQ0FDWCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDZixTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQywwQkFBSyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUMvQyxLQUFLLENBQUMsQ0FBQztZQUNMLDBCQUEwQixFQUFFLElBQUk7WUFDaEMsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtTQUNFLENBQUMsRUFDbkIsQ0FDSCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsSUFBQSxZQUFJLEVBQUMsY0FBYyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEVDaGFydHNPcHRpb24gfSBmcm9tICdlY2hhcnRzJ1xuaW1wb3J0IHR5cGUgeyBDU1NQcm9wZXJ0aWVzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RFQ2hhcnRzIGZyb20gJ2VjaGFydHMtZm9yLXJlYWN0J1xuaW1wb3J0IHsgbWVtbywgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9pbmRleC5tb2R1bGUuY3NzJ1xuXG5leHBvcnQgdHlwZSBTaW1wbGVQaWVDaGFydFByb3BzID0ge1xuICBwZXJjZW50YWdlPzogbnVtYmVyXG4gIGZpbGw/OiBzdHJpbmdcbiAgc3Ryb2tlPzogc3RyaW5nXG4gIHNpemU/OiBudW1iZXJcbiAgYW5pbWF0aW9uRHVyYXRpb24/OiBudW1iZXJcbiAgY2xhc3NOYW1lPzogc3RyaW5nXG59XG5cbmNvbnN0IFNpbXBsZVBpZUNoYXJ0ID0gKHsgcGVyY2VudGFnZSA9IDgwLCBmaWxsID0gJyNmZGIwMjInLCBzdHJva2UgPSAnI2Y3OTAwOScsIHNpemUgPSAxMiwgYW5pbWF0aW9uRHVyYXRpb24sIGNsYXNzTmFtZSB9OiBTaW1wbGVQaWVDaGFydFByb3BzKSA9PiB7XG4gIGNvbnN0IG9wdGlvbjogRUNoYXJ0c09wdGlvbiA9IHVzZU1lbW8oKCkgPT4gKHtcbiAgICBzZXJpZXM6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ3BpZScsXG4gICAgICAgIHJhZGl1czogWyc4MyUnLCAnMTAwJSddLFxuICAgICAgICBhbmltYXRpb246IGZhbHNlLFxuICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgeyB2YWx1ZTogMTAwLCBpdGVtU3R5bGU6IHsgY29sb3I6IHN0cm9rZSB9IH0sXG4gICAgICAgIF0sXG4gICAgICAgIGVtcGhhc2lzOiB7XG4gICAgICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGxhYmVsTGluZToge1xuICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdwaWUnLFxuICAgICAgICByYWRpdXM6ICc4MyUnLFxuICAgICAgICBhbmltYXRpb25EdXJhdGlvbjogYW5pbWF0aW9uRHVyYXRpb24gPz8gNjAwLFxuICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgeyB2YWx1ZTogcGVyY2VudGFnZSwgaXRlbVN0eWxlOiB7IGNvbG9yOiBmaWxsIH0gfSxcbiAgICAgICAgICB7IHZhbHVlOiAxMDAgLSBwZXJjZW50YWdlLCBpdGVtU3R5bGU6IHsgY29sb3I6ICcjZmZmJyB9IH0sXG4gICAgICAgIF0sXG4gICAgICAgIGVtcGhhc2lzOiB7XG4gICAgICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGxhYmVsTGluZToge1xuICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSksIFtzdHJva2UsIGZpbGwsIHBlcmNlbnRhZ2UsIGFuaW1hdGlvbkR1cmF0aW9uXSlcblxuICByZXR1cm4gKFxuICAgIDxSZWFjdEVDaGFydHNcbiAgICAgIG9wdGlvbj17b3B0aW9ufVxuICAgICAgY2xhc3NOYW1lPXtjbihzdHlsZS5zaW1wbGVQaWVDaGFydCwgY2xhc3NOYW1lKX1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgICctLXNpbXBsZS1waWUtY2hhcnQtY29sb3InOiBmaWxsLFxuICAgICAgICAnd2lkdGgnOiBzaXplLFxuICAgICAgICAnaGVpZ2h0Jzogc2l6ZSxcbiAgICAgIH0gYXMgQ1NTUHJvcGVydGllc31cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oU2ltcGxlUGllQ2hhcnQpXG4iXX0=