"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowMode = void 0;
const react_1 = require("react");
const store_1 = require("../store");
const useWorkflowMode = () => {
    const historyWorkflowData = (0, store_1.useStore)(s => s.historyWorkflowData);
    const isRestoring = (0, store_1.useStore)(s => s.isRestoring);
    return (0, react_1.useMemo)(() => {
        return {
            normal: !historyWorkflowData && !isRestoring,
            restoring: isRestoring,
            viewHistory: !!historyWorkflowData,
        };
    }, [historyWorkflowData, isRestoring]);
};
exports.useWorkflowMode = useWorkflowMode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LW1vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctbW9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBK0I7QUFDL0Isb0NBQW1DO0FBRTVCLE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRTtJQUNsQyxNQUFNLG1CQUFtQixHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBQ2hFLE1BQU0sV0FBVyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUNoRCxPQUFPLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUNsQixPQUFPO1lBQ0wsTUFBTSxFQUFFLENBQUMsbUJBQW1CLElBQUksQ0FBQyxXQUFXO1lBQzVDLFNBQVMsRUFBRSxXQUFXO1lBQ3RCLFdBQVcsRUFBRSxDQUFDLENBQUMsbUJBQW1CO1NBQ25DLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBO0FBQ3hDLENBQUMsQ0FBQTtBQVZZLFFBQUEsZUFBZSxtQkFVM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJy4uL3N0b3JlJ1xuXG5leHBvcnQgY29uc3QgdXNlV29ya2Zsb3dNb2RlID0gKCkgPT4ge1xuICBjb25zdCBoaXN0b3J5V29ya2Zsb3dEYXRhID0gdXNlU3RvcmUocyA9PiBzLmhpc3RvcnlXb3JrZmxvd0RhdGEpXG4gIGNvbnN0IGlzUmVzdG9yaW5nID0gdXNlU3RvcmUocyA9PiBzLmlzUmVzdG9yaW5nKVxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vcm1hbDogIWhpc3RvcnlXb3JrZmxvd0RhdGEgJiYgIWlzUmVzdG9yaW5nLFxuICAgICAgcmVzdG9yaW5nOiBpc1Jlc3RvcmluZyxcbiAgICAgIHZpZXdIaXN0b3J5OiAhIWhpc3RvcnlXb3JrZmxvd0RhdGEsXG4gICAgfVxuICB9LCBbaGlzdG9yeVdvcmtmbG93RGF0YSwgaXNSZXN0b3JpbmddKVxufVxuIl19