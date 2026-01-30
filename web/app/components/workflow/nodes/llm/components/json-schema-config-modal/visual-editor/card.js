"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const Card = ({ name, type, required, description, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="flex flex-col py-0.5">
      <div className="flex h-6 items-center gap-x-1 pl-1 pr-0.5">
        <div className="system-sm-semibold truncate border border-transparent px-1 py-px text-text-primary">
          {name}
        </div>
        <div className="system-xs-medium px-1 py-0.5 text-text-tertiary">
          {type}
        </div>
        {required && (<div className="system-2xs-medium-uppercase px-1 py-0.5 text-text-warning">
              {t('nodes.llm.jsonSchema.required', { ns: 'workflow' })}
            </div>)}
      </div>

      {description && (<div className="system-xs-regular truncate px-2 pb-1 text-text-tertiary">
          {description}
        </div>)}
    </div>);
};
exports.default = React.memo(Card);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhcmQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQThCO0FBQzlCLGlEQUE4QztBQVM5QyxNQUFNLElBQUksR0FBa0IsQ0FBQyxFQUMzQixJQUFJLEVBQ0osSUFBSSxFQUNKLFFBQVEsRUFDUixXQUFXLEdBQ1osRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQ25DO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJDQUEyQyxDQUN4RDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvRkFBb0YsQ0FDakc7VUFBQSxDQUFDLElBQUksQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlEQUFpRCxDQUM5RDtVQUFBLENBQUMsSUFBSSxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUNFLFFBQVEsSUFBSSxDQUNWLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywyREFBMkQsQ0FDeEU7Y0FBQSxDQUFDLENBQUMsQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUN6RDtZQUFBLEVBQUUsR0FBRyxDQUFDLENBRVYsQ0FDRjtNQUFBLEVBQUUsR0FBRyxDQUVMOztNQUFBLENBQUMsV0FBVyxJQUFJLENBQ2QsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlEQUF5RCxDQUN0RTtVQUFBLENBQUMsV0FBVyxDQUNkO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNIO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuXG50eXBlIENhcmRQcm9wcyA9IHtcbiAgbmFtZTogc3RyaW5nXG4gIHR5cGU6IHN0cmluZ1xuICByZXF1aXJlZDogYm9vbGVhblxuICBkZXNjcmlwdGlvbj86IHN0cmluZ1xufVxuXG5jb25zdCBDYXJkOiBGQzxDYXJkUHJvcHM+ID0gKHtcbiAgbmFtZSxcbiAgdHlwZSxcbiAgcmVxdWlyZWQsXG4gIGRlc2NyaXB0aW9uLFxufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBweS0wLjVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTYgaXRlbXMtY2VudGVyIGdhcC14LTEgcGwtMSBwci0wLjVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgdHJ1bmNhdGUgYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudCBweC0xIHB5LXB4IHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAge25hbWV9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0gcHgtMSBweS0wLjUgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAge3R5cGV9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7XG4gICAgICAgICAgcmVxdWlyZWQgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tMnhzLW1lZGl1bS11cHBlcmNhc2UgcHgtMSBweS0wLjUgdGV4dC10ZXh0LXdhcm5pbmdcIj5cbiAgICAgICAgICAgICAge3QoJ25vZGVzLmxsbS5qc29uU2NoZW1hLnJlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHtkZXNjcmlwdGlvbiAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgdHJ1bmNhdGUgcHgtMiBwYi0xIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgIHtkZXNjcmlwdGlvbn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQ2FyZClcbiJdfQ==