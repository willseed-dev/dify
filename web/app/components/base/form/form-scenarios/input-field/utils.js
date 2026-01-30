"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZodSchema = void 0;
const zod_1 = require("zod");
const schema_1 = require("@/app/components/rag-pipeline/components/panel/input-field/editor/form/schema");
const types_1 = require("./types");
const generateZodSchema = (fields) => {
    const shape = {};
    fields.forEach((field) => {
        let zodType;
        switch (field.type) {
            case types_1.InputFieldType.textInput:
                zodType = zod_1.z.string();
                break;
            case types_1.InputFieldType.numberInput:
                zodType = zod_1.z.number();
                break;
            case types_1.InputFieldType.numberSlider:
                zodType = zod_1.z.number();
                break;
            case types_1.InputFieldType.checkbox:
                zodType = zod_1.z.boolean();
                break;
            case types_1.InputFieldType.options:
                zodType = zod_1.z.array(zod_1.z.string());
                break;
            case types_1.InputFieldType.select:
                zodType = zod_1.z.string();
                break;
            case types_1.InputFieldType.fileTypes:
                zodType = zod_1.z.object({
                    allowedFileExtensions: zod_1.z.string().optional(),
                    allowedFileTypes: zod_1.z.array(schema_1.SupportedFileTypes),
                });
                break;
            case types_1.InputFieldType.inputTypeSelect:
                zodType = zod_1.z.string();
                break;
            case types_1.InputFieldType.uploadMethod:
                zodType = zod_1.z.array(schema_1.TransferMethod);
                break;
            default:
                zodType = zod_1.z.any();
                break;
        }
        if (field.maxLength) {
            if ([types_1.InputFieldType.textInput].includes(field.type))
                zodType = zodType.max(field.maxLength, `${field.label} exceeds max length of ${field.maxLength}`);
        }
        if (field.min) {
            if ([types_1.InputFieldType.numberInput].includes(field.type))
                zodType = zodType.min(field.min, `${field.label} must be at least ${field.min}`);
        }
        if (field.max) {
            if ([types_1.InputFieldType.numberInput].includes(field.type))
                zodType = zodType.max(field.max, `${field.label} exceeds max value of ${field.max}`);
        }
        if (field.required) {
            if ([types_1.InputFieldType.textInput].includes(field.type))
                zodType = zodType.nonempty(`${field.label} is required`);
        }
        else {
            zodType = zodType.optional();
        }
        shape[field.variable] = zodType;
    });
    return zod_1.z.object(shape);
};
exports.generateZodSchema = generateZodSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw2QkFBdUI7QUFDdkIsMEdBQWtJO0FBQ2xJLG1DQUF3QztBQUVqQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsTUFBaUMsRUFBRSxFQUFFO0lBQ3JFLE1BQU0sS0FBSyxHQUE4QixFQUFFLENBQUE7SUFFM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1FBQ3ZCLElBQUksT0FBTyxDQUFBO1FBRVgsUUFBUSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkIsS0FBSyxzQkFBYyxDQUFDLFNBQVM7Z0JBQzNCLE9BQU8sR0FBRyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7Z0JBQ3BCLE1BQUs7WUFDUCxLQUFLLHNCQUFjLENBQUMsV0FBVztnQkFDN0IsT0FBTyxHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtnQkFDcEIsTUFBSztZQUNQLEtBQUssc0JBQWMsQ0FBQyxZQUFZO2dCQUM5QixPQUFPLEdBQUcsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO2dCQUNwQixNQUFLO1lBQ1AsS0FBSyxzQkFBYyxDQUFDLFFBQVE7Z0JBQzFCLE9BQU8sR0FBRyxPQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7Z0JBQ3JCLE1BQUs7WUFDUCxLQUFLLHNCQUFjLENBQUMsT0FBTztnQkFDekIsT0FBTyxHQUFHLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7Z0JBQzdCLE1BQUs7WUFDUCxLQUFLLHNCQUFjLENBQUMsTUFBTTtnQkFDeEIsT0FBTyxHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtnQkFDcEIsTUFBSztZQUNQLEtBQUssc0JBQWMsQ0FBQyxTQUFTO2dCQUMzQixPQUFPLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDakIscUJBQXFCLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtvQkFDNUMsZ0JBQWdCLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQywyQkFBa0IsQ0FBQztpQkFDOUMsQ0FBQyxDQUFBO2dCQUNGLE1BQUs7WUFDUCxLQUFLLHNCQUFjLENBQUMsZUFBZTtnQkFDakMsT0FBTyxHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtnQkFDcEIsTUFBSztZQUNQLEtBQUssc0JBQWMsQ0FBQyxZQUFZO2dCQUM5QixPQUFPLEdBQUcsT0FBQyxDQUFDLEtBQUssQ0FBQyx1QkFBYyxDQUFDLENBQUE7Z0JBQ2pDLE1BQUs7WUFDUDtnQkFDRSxPQUFPLEdBQUcsT0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO2dCQUNqQixNQUFLO1FBQ1QsQ0FBQztRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxzQkFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUNqRCxPQUFPLEdBQUksT0FBcUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLDBCQUEwQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtRQUNwSCxDQUFDO1FBRUQsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsc0JBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDbkQsT0FBTyxHQUFJLE9BQXFCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxxQkFBcUIsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7UUFDbkcsQ0FBQztRQUVELElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLHNCQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ25ELE9BQU8sR0FBSSxPQUFxQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUsseUJBQXlCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZHLENBQUM7UUFFRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsc0JBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDakQsT0FBTyxHQUFJLE9BQXFCLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssY0FBYyxDQUFDLENBQUE7UUFDM0UsQ0FBQzthQUNJLENBQUM7WUFDSixPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzlCLENBQUM7UUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQTtJQUNqQyxDQUFDLENBQUMsQ0FBQTtJQUVGLE9BQU8sT0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN4QixDQUFDLENBQUE7QUFyRVksUUFBQSxpQkFBaUIscUJBcUU3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgWm9kU2NoZW1hLCBab2RTdHJpbmcgfSBmcm9tICd6b2QnXG5pbXBvcnQgdHlwZSB7IElucHV0RmllbGRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnXG5pbXBvcnQgeyBTdXBwb3J0ZWRGaWxlVHlwZXMsIFRyYW5zZmVyTWV0aG9kIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9yYWctcGlwZWxpbmUvY29tcG9uZW50cy9wYW5lbC9pbnB1dC1maWVsZC9lZGl0b3IvZm9ybS9zY2hlbWEnXG5pbXBvcnQgeyBJbnB1dEZpZWxkVHlwZSB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVpvZFNjaGVtYSA9IChmaWVsZHM6IElucHV0RmllbGRDb25maWd1cmF0aW9uW10pID0+IHtcbiAgY29uc3Qgc2hhcGU6IFJlY29yZDxzdHJpbmcsIFpvZFNjaGVtYT4gPSB7fVxuXG4gIGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgIGxldCB6b2RUeXBlXG5cbiAgICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgICAgIGNhc2UgSW5wdXRGaWVsZFR5cGUudGV4dElucHV0OlxuICAgICAgICB6b2RUeXBlID0gei5zdHJpbmcoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBJbnB1dEZpZWxkVHlwZS5udW1iZXJJbnB1dDpcbiAgICAgICAgem9kVHlwZSA9IHoubnVtYmVyKClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgSW5wdXRGaWVsZFR5cGUubnVtYmVyU2xpZGVyOlxuICAgICAgICB6b2RUeXBlID0gei5udW1iZXIoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBJbnB1dEZpZWxkVHlwZS5jaGVja2JveDpcbiAgICAgICAgem9kVHlwZSA9IHouYm9vbGVhbigpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIElucHV0RmllbGRUeXBlLm9wdGlvbnM6XG4gICAgICAgIHpvZFR5cGUgPSB6LmFycmF5KHouc3RyaW5nKCkpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIElucHV0RmllbGRUeXBlLnNlbGVjdDpcbiAgICAgICAgem9kVHlwZSA9IHouc3RyaW5nKClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgSW5wdXRGaWVsZFR5cGUuZmlsZVR5cGVzOlxuICAgICAgICB6b2RUeXBlID0gei5vYmplY3Qoe1xuICAgICAgICAgIGFsbG93ZWRGaWxlRXh0ZW5zaW9uczogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgICAgICAgIGFsbG93ZWRGaWxlVHlwZXM6IHouYXJyYXkoU3VwcG9ydGVkRmlsZVR5cGVzKSxcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgSW5wdXRGaWVsZFR5cGUuaW5wdXRUeXBlU2VsZWN0OlxuICAgICAgICB6b2RUeXBlID0gei5zdHJpbmcoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBJbnB1dEZpZWxkVHlwZS51cGxvYWRNZXRob2Q6XG4gICAgICAgIHpvZFR5cGUgPSB6LmFycmF5KFRyYW5zZmVyTWV0aG9kKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgem9kVHlwZSA9IHouYW55KClcbiAgICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBpZiAoZmllbGQubWF4TGVuZ3RoKSB7XG4gICAgICBpZiAoW0lucHV0RmllbGRUeXBlLnRleHRJbnB1dF0uaW5jbHVkZXMoZmllbGQudHlwZSkpXG4gICAgICAgIHpvZFR5cGUgPSAoem9kVHlwZSBhcyBab2RTdHJpbmcpLm1heChmaWVsZC5tYXhMZW5ndGgsIGAke2ZpZWxkLmxhYmVsfSBleGNlZWRzIG1heCBsZW5ndGggb2YgJHtmaWVsZC5tYXhMZW5ndGh9YClcbiAgICB9XG5cbiAgICBpZiAoZmllbGQubWluKSB7XG4gICAgICBpZiAoW0lucHV0RmllbGRUeXBlLm51bWJlcklucHV0XS5pbmNsdWRlcyhmaWVsZC50eXBlKSlcbiAgICAgICAgem9kVHlwZSA9ICh6b2RUeXBlIGFzIFpvZFN0cmluZykubWluKGZpZWxkLm1pbiwgYCR7ZmllbGQubGFiZWx9IG11c3QgYmUgYXQgbGVhc3QgJHtmaWVsZC5taW59YClcbiAgICB9XG5cbiAgICBpZiAoZmllbGQubWF4KSB7XG4gICAgICBpZiAoW0lucHV0RmllbGRUeXBlLm51bWJlcklucHV0XS5pbmNsdWRlcyhmaWVsZC50eXBlKSlcbiAgICAgICAgem9kVHlwZSA9ICh6b2RUeXBlIGFzIFpvZFN0cmluZykubWF4KGZpZWxkLm1heCwgYCR7ZmllbGQubGFiZWx9IGV4Y2VlZHMgbWF4IHZhbHVlIG9mICR7ZmllbGQubWF4fWApXG4gICAgfVxuXG4gICAgaWYgKGZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBpZiAoW0lucHV0RmllbGRUeXBlLnRleHRJbnB1dF0uaW5jbHVkZXMoZmllbGQudHlwZSkpXG4gICAgICAgIHpvZFR5cGUgPSAoem9kVHlwZSBhcyBab2RTdHJpbmcpLm5vbmVtcHR5KGAke2ZpZWxkLmxhYmVsfSBpcyByZXF1aXJlZGApXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgem9kVHlwZSA9IHpvZFR5cGUub3B0aW9uYWwoKVxuICAgIH1cblxuICAgIHNoYXBlW2ZpZWxkLnZhcmlhYmxlXSA9IHpvZFR5cGVcbiAgfSlcblxuICByZXR1cm4gei5vYmplY3Qoc2hhcGUpXG59XG4iXX0=