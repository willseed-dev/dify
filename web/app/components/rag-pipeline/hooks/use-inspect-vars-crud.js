"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInspectVarsCrud = void 0;
const use_inspect_vars_crud_common_1 = require("../../workflow/hooks/use-inspect-vars-crud-common");
const use_configs_map_1 = require("./use-configs-map");
const useInspectVarsCrud = () => {
    const configsMap = (0, use_configs_map_1.useConfigsMap)();
    const apis = (0, use_inspect_vars_crud_common_1.useInspectVarsCrudCommon)({
        ...configsMap,
    });
    return {
        ...apis,
    };
};
exports.useInspectVarsCrud = useInspectVarsCrud;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWluc3BlY3QtdmFycy1jcnVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWluc3BlY3QtdmFycy1jcnVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9HQUE0RjtBQUM1Rix1REFBaUQ7QUFFMUMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUU7SUFDckMsTUFBTSxVQUFVLEdBQUcsSUFBQSwrQkFBYSxHQUFFLENBQUE7SUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBQSx1REFBd0IsRUFBQztRQUNwQyxHQUFHLFVBQVU7S0FDZCxDQUFDLENBQUE7SUFFRixPQUFPO1FBQ0wsR0FBRyxJQUFJO0tBQ1IsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQVRZLFFBQUEsa0JBQWtCLHNCQVM5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUluc3BlY3RWYXJzQ3J1ZENvbW1vbiB9IGZyb20gJy4uLy4uL3dvcmtmbG93L2hvb2tzL3VzZS1pbnNwZWN0LXZhcnMtY3J1ZC1jb21tb24nXG5pbXBvcnQgeyB1c2VDb25maWdzTWFwIH0gZnJvbSAnLi91c2UtY29uZmlncy1tYXAnXG5cbmV4cG9ydCBjb25zdCB1c2VJbnNwZWN0VmFyc0NydWQgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbmZpZ3NNYXAgPSB1c2VDb25maWdzTWFwKClcbiAgY29uc3QgYXBpcyA9IHVzZUluc3BlY3RWYXJzQ3J1ZENvbW1vbih7XG4gICAgLi4uY29uZmlnc01hcCxcbiAgfSlcblxuICByZXR1cm4ge1xuICAgIC4uLmFwaXMsXG4gIH1cbn1cbiJdfQ==