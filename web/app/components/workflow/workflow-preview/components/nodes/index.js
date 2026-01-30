"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const constants_1 = require("./constants");
const CustomNode = (props) => {
    const nodeData = props.data;
    const NodeComponent = constants_1.NodeComponentMap[nodeData.type];
    return (<>
      <base_1.default {...props}>
        {NodeComponent && <NodeComponent />}
      </base_1.default>
    </>);
};
exports.default = CustomNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBNkI7QUFDN0IsMkNBQThDO0FBRTlDLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBZ0IsRUFBRSxFQUFFO0lBQ3RDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUE7SUFDM0IsTUFBTSxhQUFhLEdBQUcsNEJBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRXJELE9BQU8sQ0FDTCxFQUNFO01BQUEsQ0FBQyxjQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FDbEI7UUFBQSxDQUFFLGFBQWEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxBQUFELEVBQUksQ0FDdkM7TUFBQSxFQUFFLGNBQVEsQ0FDWjtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb2RlUHJvcHMgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgQmFzZU5vZGUgZnJvbSAnLi9iYXNlJ1xuaW1wb3J0IHsgTm9kZUNvbXBvbmVudE1hcCB9IGZyb20gJy4vY29uc3RhbnRzJ1xuXG5jb25zdCBDdXN0b21Ob2RlID0gKHByb3BzOiBOb2RlUHJvcHMpID0+IHtcbiAgY29uc3Qgbm9kZURhdGEgPSBwcm9wcy5kYXRhXG4gIGNvbnN0IE5vZGVDb21wb25lbnQgPSBOb2RlQ29tcG9uZW50TWFwW25vZGVEYXRhLnR5cGVdXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEJhc2VOb2RlIHsuLi5wcm9wc30+XG4gICAgICAgIHsgTm9kZUNvbXBvbmVudCAmJiA8Tm9kZUNvbXBvbmVudCAvPiB9XG4gICAgICA8L0Jhc2VOb2RlPlxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEN1c3RvbU5vZGVcbiJdfQ==