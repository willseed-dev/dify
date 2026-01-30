"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const InfoPanel = ({ title, content, }) => {
    return (<div>
      <div className="flex flex-col gap-y-0.5 rounded-md bg-workflow-block-parma-bg px-[5px] py-[3px]">
        <div className="system-2xs-semibold-uppercase uppercase text-text-secondary">
          {title}
        </div>
        <div className="system-xs-regular break-words text-text-tertiary">
          {content}
        </div>
      </div>
    </div>);
};
exports.default = React.memo(InfoPanel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mby1wYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZm8tcGFuZWwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBRVosK0JBQThCO0FBTzlCLE1BQU0sU0FBUyxHQUFjLENBQUMsRUFDNUIsS0FBSyxFQUNMLE9BQU8sR0FDUixFQUFFLEVBQUU7SUFDSCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0Y7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUZBQWlGLENBQzlGO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZEQUE2RCxDQUMxRTtVQUFBLENBQUMsS0FBSyxDQUNSO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0RBQWtELENBQy9EO1VBQUEsQ0FBQyxPQUFPLENBQ1Y7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQywgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcblxudHlwZSBQcm9wcyA9IHtcbiAgdGl0bGU6IHN0cmluZ1xuICBjb250ZW50OiBSZWFjdE5vZGVcbn1cblxuY29uc3QgSW5mb1BhbmVsOiBGQzxQcm9wcz4gPSAoe1xuICB0aXRsZSxcbiAgY29udGVudCxcbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC15LTAuNSByb3VuZGVkLW1kIGJnLXdvcmtmbG93LWJsb2NrLXBhcm1hLWJnIHB4LVs1cHhdIHB5LVszcHhdXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLTJ4cy1zZW1pYm9sZC11cHBlcmNhc2UgdXBwZXJjYXNlIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIGJyZWFrLXdvcmRzIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgIHtjb250ZW50fVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEluZm9QYW5lbClcbiJdfQ==