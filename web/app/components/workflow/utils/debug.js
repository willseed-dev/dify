"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputToVarInInspect = void 0;
const workflow_1 = require("@/types/workflow");
const types_1 = require("../types");
const outputToVarInInspect = ({ nodeId, name, value, }) => {
    return {
        id: `${Date.now()}`, // TODO: wait for api
        type: workflow_1.VarInInspectType.node,
        name,
        description: '',
        selector: [nodeId, name],
        value_type: types_1.VarType.string, // TODO: wait for api or get from node
        value,
        edited: false,
        visible: true,
        is_truncated: false,
        full_content: { size_bytes: 0, download_url: '' },
    };
};
exports.outputToVarInInspect = outputToVarInInspect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZWJ1Zy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQ0FBbUQ7QUFDbkQsb0NBQWtDO0FBTzNCLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxFQUNuQyxNQUFNLEVBQ04sSUFBSSxFQUNKLEtBQUssR0FDc0IsRUFBZ0IsRUFBRTtJQUM3QyxPQUFPO1FBQ0wsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUscUJBQXFCO1FBQzFDLElBQUksRUFBRSwyQkFBZ0IsQ0FBQyxJQUFJO1FBQzNCLElBQUk7UUFDSixXQUFXLEVBQUUsRUFBRTtRQUNmLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7UUFDeEIsVUFBVSxFQUFFLGVBQU8sQ0FBQyxNQUFNLEVBQUUsc0NBQXNDO1FBQ2xFLEtBQUs7UUFDTCxNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxJQUFJO1FBQ2IsWUFBWSxFQUFFLEtBQUs7UUFDbkIsWUFBWSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFO0tBQ2xELENBQUE7QUFDSCxDQUFDLENBQUE7QUFsQlksUUFBQSxvQkFBb0Isd0JBa0JoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVmFySW5JbnNwZWN0IH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IFZhckluSW5zcGVjdFR5cGUgfSBmcm9tICdAL3R5cGVzL3dvcmtmbG93J1xuaW1wb3J0IHsgVmFyVHlwZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG50eXBlIE91dHB1dFRvVmFySW5JbnNwZWN0UGFyYW1zID0ge1xuICBub2RlSWQ6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbiAgdmFsdWU6IGFueVxufVxuZXhwb3J0IGNvbnN0IG91dHB1dFRvVmFySW5JbnNwZWN0ID0gKHtcbiAgbm9kZUlkLFxuICBuYW1lLFxuICB2YWx1ZSxcbn06IE91dHB1dFRvVmFySW5JbnNwZWN0UGFyYW1zKTogVmFySW5JbnNwZWN0ID0+IHtcbiAgcmV0dXJuIHtcbiAgICBpZDogYCR7RGF0ZS5ub3coKX1gLCAvLyBUT0RPOiB3YWl0IGZvciBhcGlcbiAgICB0eXBlOiBWYXJJbkluc3BlY3RUeXBlLm5vZGUsXG4gICAgbmFtZSxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgc2VsZWN0b3I6IFtub2RlSWQsIG5hbWVdLFxuICAgIHZhbHVlX3R5cGU6IFZhclR5cGUuc3RyaW5nLCAvLyBUT0RPOiB3YWl0IGZvciBhcGkgb3IgZ2V0IGZyb20gbm9kZVxuICAgIHZhbHVlLFxuICAgIGVkaXRlZDogZmFsc2UsXG4gICAgdmlzaWJsZTogdHJ1ZSxcbiAgICBpc190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgIGZ1bGxfY29udGVudDogeyBzaXplX2J5dGVzOiAwLCBkb3dubG9hZF91cmw6ICcnIH0sXG4gIH1cbn1cbiJdfQ==