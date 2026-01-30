"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterVar = exports.checkNodeValid = void 0;
const types_1 = require("../../types");
const checkNodeValid = () => {
    return true;
};
exports.checkNodeValid = checkNodeValid;
const filterVar = (varType) => {
    return (v) => {
        if (varType === types_1.VarType.any)
            return true;
        if (v.type === types_1.VarType.any)
            return true;
        return v.type === varType;
    };
};
exports.filterVar = filterVar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBcUM7QUFFOUIsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFO0lBQ2pDLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBRlksUUFBQSxjQUFjLGtCQUUxQjtBQUVNLE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZ0IsRUFBRSxFQUFFO0lBQzVDLE9BQU8sQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUNoQixJQUFJLE9BQU8sS0FBSyxlQUFPLENBQUMsR0FBRztZQUN6QixPQUFPLElBQUksQ0FBQTtRQUNiLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxlQUFPLENBQUMsR0FBRztZQUN4QixPQUFPLElBQUksQ0FBQTtRQUNiLE9BQU8sQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUE7SUFDM0IsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBUlksUUFBQSxTQUFTLGFBUXJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBWYXIgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IFZhclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcydcblxuZXhwb3J0IGNvbnN0IGNoZWNrTm9kZVZhbGlkID0gKCkgPT4ge1xuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgY29uc3QgZmlsdGVyVmFyID0gKHZhclR5cGU6IFZhclR5cGUpID0+IHtcbiAgcmV0dXJuICh2OiBWYXIpID0+IHtcbiAgICBpZiAodmFyVHlwZSA9PT0gVmFyVHlwZS5hbnkpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGlmICh2LnR5cGUgPT09IFZhclR5cGUuYW55KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gdi50eXBlID09PSB2YXJUeXBlXG4gIH1cbn1cbiJdfQ==