"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbidBooleanProperties = exports.draft07Validator = void 0;
const jsonschema_1 = require("jsonschema");
const draft_07_json_1 = require("./draft-07.json");
const validator = new jsonschema_1.Validator();
const draft07Validator = (schema) => {
    return validator.validate(schema, draft_07_json_1.default);
};
exports.draft07Validator = draft07Validator;
const forbidBooleanProperties = (schema, path = []) => {
    let errors = [];
    if (schema && typeof schema === 'object' && schema.properties) {
        for (const [key, val] of Object.entries(schema.properties)) {
            if (typeof val === 'boolean') {
                errors.push(`Error: Property '${[...path, key].join('.')}' must not be a boolean schema`);
            }
            else if (typeof val === 'object') {
                errors = errors.concat((0, exports.forbidBooleanProperties)(val, [...path, key]));
            }
        }
    }
    return errors;
};
exports.forbidBooleanProperties = forbidBooleanProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQXNDO0FBQ3RDLG1EQUEyQztBQUUzQyxNQUFNLFNBQVMsR0FBRyxJQUFJLHNCQUFTLEVBQUUsQ0FBQTtBQUUxQixNQUFNLGdCQUFnQixHQUFHLENBQUMsTUFBVyxFQUFFLEVBQUU7SUFDOUMsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSx1QkFBa0MsQ0FBQyxDQUFBO0FBQ3ZFLENBQUMsQ0FBQTtBQUZZLFFBQUEsZ0JBQWdCLG9CQUU1QjtBQUVNLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxNQUFXLEVBQUUsT0FBaUIsRUFBRSxFQUFZLEVBQUU7SUFDcEYsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFBO0lBRXpCLElBQUksTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUQsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDM0QsSUFBSSxPQUFPLEdBQUcsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDN0IsTUFBTSxDQUFDLElBQUksQ0FDVCxvQkFBb0IsQ0FBQyxHQUFHLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUM3RSxDQUFBO1lBQ0gsQ0FBQztpQkFDSSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRSxDQUFDO2dCQUNqQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFBLCtCQUF1QixFQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN0RSxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLE1BQU0sQ0FBQTtBQUNmLENBQUMsQ0FBQTtBQWhCWSxRQUFBLHVCQUF1QiwyQkFnQm5DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTY2hlbWEgfSBmcm9tICdqc29uc2NoZW1hJ1xuaW1wb3J0IHsgVmFsaWRhdG9yIH0gZnJvbSAnanNvbnNjaGVtYSdcbmltcG9ydCBkcmFmdDA3U2NoZW1hIGZyb20gJy4vZHJhZnQtMDcuanNvbidcblxuY29uc3QgdmFsaWRhdG9yID0gbmV3IFZhbGlkYXRvcigpXG5cbmV4cG9ydCBjb25zdCBkcmFmdDA3VmFsaWRhdG9yID0gKHNjaGVtYTogYW55KSA9PiB7XG4gIHJldHVybiB2YWxpZGF0b3IudmFsaWRhdGUoc2NoZW1hLCBkcmFmdDA3U2NoZW1hIGFzIHVua25vd24gYXMgU2NoZW1hKVxufVxuXG5leHBvcnQgY29uc3QgZm9yYmlkQm9vbGVhblByb3BlcnRpZXMgPSAoc2NoZW1hOiBhbnksIHBhdGg6IHN0cmluZ1tdID0gW10pOiBzdHJpbmdbXSA9PiB7XG4gIGxldCBlcnJvcnM6IHN0cmluZ1tdID0gW11cblxuICBpZiAoc2NoZW1hICYmIHR5cGVvZiBzY2hlbWEgPT09ICdvYmplY3QnICYmIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHNjaGVtYS5wcm9wZXJ0aWVzKSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdib29sZWFuJykge1xuICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICBgRXJyb3I6IFByb3BlcnR5ICcke1suLi5wYXRoLCBrZXldLmpvaW4oJy4nKX0nIG11c3Qgbm90IGJlIGEgYm9vbGVhbiBzY2hlbWFgLFxuICAgICAgICApXG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMgPSBlcnJvcnMuY29uY2F0KGZvcmJpZEJvb2xlYW5Qcm9wZXJ0aWVzKHZhbCwgWy4uLnBhdGgsIGtleV0pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZXJyb3JzXG59XG4iXX0=