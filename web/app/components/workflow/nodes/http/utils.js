"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToBodyPayload = void 0;
const types_1 = require("./types");
const transformToBodyPayload = (old, hasKey) => {
    if (!hasKey) {
        return [
            {
                type: types_1.BodyPayloadValueType.text,
                value: old,
            },
        ];
    }
    const bodyPayload = old.split('\n').map((item) => {
        const [key, value] = item.split(':');
        return {
            key: key || '',
            type: types_1.BodyPayloadValueType.text,
            value: value || '',
        };
    });
    return bodyPayload;
};
exports.transformToBodyPayload = transformToBodyPayload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBOEM7QUFFdkMsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLEdBQVcsRUFBRSxNQUFlLEVBQWUsRUFBRTtJQUNsRixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWixPQUFPO1lBQ0w7Z0JBQ0UsSUFBSSxFQUFFLDRCQUFvQixDQUFDLElBQUk7Z0JBQy9CLEtBQUssRUFBRSxHQUFHO2FBQ1g7U0FDRixDQUFBO0lBQ0gsQ0FBQztJQUNELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDL0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3BDLE9BQU87WUFDTCxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUU7WUFDZCxJQUFJLEVBQUUsNEJBQW9CLENBQUMsSUFBSTtZQUMvQixLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUU7U0FDbkIsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxXQUFXLENBQUE7QUFDcEIsQ0FBQyxDQUFBO0FBbEJZLFFBQUEsc0JBQXNCLDBCQWtCbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEJvZHlQYXlsb2FkIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IEJvZHlQYXlsb2FkVmFsdWVUeXBlIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybVRvQm9keVBheWxvYWQgPSAob2xkOiBzdHJpbmcsIGhhc0tleTogYm9vbGVhbik6IEJvZHlQYXlsb2FkID0+IHtcbiAgaWYgKCFoYXNLZXkpIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICB0eXBlOiBCb2R5UGF5bG9hZFZhbHVlVHlwZS50ZXh0LFxuICAgICAgICB2YWx1ZTogb2xkLFxuICAgICAgfSxcbiAgICBdXG4gIH1cbiAgY29uc3QgYm9keVBheWxvYWQgPSBvbGQuc3BsaXQoJ1xcbicpLm1hcCgoaXRlbSkgPT4ge1xuICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IGl0ZW0uc3BsaXQoJzonKVxuICAgIHJldHVybiB7XG4gICAgICBrZXk6IGtleSB8fCAnJyxcbiAgICAgIHR5cGU6IEJvZHlQYXlsb2FkVmFsdWVUeXBlLnRleHQsXG4gICAgICB2YWx1ZTogdmFsdWUgfHwgJycsXG4gICAgfVxuICB9KVxuICByZXR1cm4gYm9keVBheWxvYWRcbn1cbiJdfQ==