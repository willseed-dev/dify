"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeModeTypesNum = exports.AssignerNodeInputType = exports.WriteMode = void 0;
var WriteMode;
(function (WriteMode) {
    WriteMode["overwrite"] = "over-write";
    WriteMode["clear"] = "clear";
    WriteMode["append"] = "append";
    WriteMode["extend"] = "extend";
    WriteMode["set"] = "set";
    WriteMode["increment"] = "+=";
    WriteMode["decrement"] = "-=";
    WriteMode["multiply"] = "*=";
    WriteMode["divide"] = "/=";
    WriteMode["removeFirst"] = "remove-first";
    WriteMode["removeLast"] = "remove-last";
})(WriteMode || (exports.WriteMode = WriteMode = {}));
var AssignerNodeInputType;
(function (AssignerNodeInputType) {
    AssignerNodeInputType["variable"] = "variable";
    AssignerNodeInputType["constant"] = "constant";
})(AssignerNodeInputType || (exports.AssignerNodeInputType = AssignerNodeInputType = {}));
exports.writeModeTypesNum = [WriteMode.increment, WriteMode.decrement, WriteMode.multiply, WriteMode.divide];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxJQUFZLFNBWVg7QUFaRCxXQUFZLFNBQVM7SUFDbkIscUNBQXdCLENBQUE7SUFDeEIsNEJBQWUsQ0FBQTtJQUNmLDhCQUFpQixDQUFBO0lBQ2pCLDhCQUFpQixDQUFBO0lBQ2pCLHdCQUFXLENBQUE7SUFDWCw2QkFBZ0IsQ0FBQTtJQUNoQiw2QkFBZ0IsQ0FBQTtJQUNoQiw0QkFBZSxDQUFBO0lBQ2YsMEJBQWEsQ0FBQTtJQUNiLHlDQUE0QixDQUFBO0lBQzVCLHVDQUEwQixDQUFBO0FBQzVCLENBQUMsRUFaVyxTQUFTLHlCQUFULFNBQVMsUUFZcEI7QUFFRCxJQUFZLHFCQUdYO0FBSEQsV0FBWSxxQkFBcUI7SUFDL0IsOENBQXFCLENBQUE7SUFDckIsOENBQXFCLENBQUE7QUFDdkIsQ0FBQyxFQUhXLHFCQUFxQixxQ0FBckIscUJBQXFCLFFBR2hDO0FBY1ksUUFBQSxpQkFBaUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ29tbW9uTm9kZVR5cGUsIFZhbHVlU2VsZWN0b3IgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG5leHBvcnQgZW51bSBXcml0ZU1vZGUge1xuICBvdmVyd3JpdGUgPSAnb3Zlci13cml0ZScsXG4gIGNsZWFyID0gJ2NsZWFyJyxcbiAgYXBwZW5kID0gJ2FwcGVuZCcsXG4gIGV4dGVuZCA9ICdleHRlbmQnLFxuICBzZXQgPSAnc2V0JyxcbiAgaW5jcmVtZW50ID0gJys9JyxcbiAgZGVjcmVtZW50ID0gJy09JyxcbiAgbXVsdGlwbHkgPSAnKj0nLFxuICBkaXZpZGUgPSAnLz0nLFxuICByZW1vdmVGaXJzdCA9ICdyZW1vdmUtZmlyc3QnLFxuICByZW1vdmVMYXN0ID0gJ3JlbW92ZS1sYXN0Jyxcbn1cblxuZXhwb3J0IGVudW0gQXNzaWduZXJOb2RlSW5wdXRUeXBlIHtcbiAgdmFyaWFibGUgPSAndmFyaWFibGUnLFxuICBjb25zdGFudCA9ICdjb25zdGFudCcsXG59XG5cbmV4cG9ydCB0eXBlIEFzc2lnbmVyTm9kZU9wZXJhdGlvbiA9IHtcbiAgdmFyaWFibGVfc2VsZWN0b3I6IFZhbHVlU2VsZWN0b3JcbiAgaW5wdXRfdHlwZTogQXNzaWduZXJOb2RlSW5wdXRUeXBlXG4gIG9wZXJhdGlvbjogV3JpdGVNb2RlXG4gIHZhbHVlOiBhbnlcbn1cblxuZXhwb3J0IHR5cGUgQXNzaWduZXJOb2RlVHlwZSA9IENvbW1vbk5vZGVUeXBlICYge1xuICB2ZXJzaW9uPzogJzEnIHwgJzInXG4gIGl0ZW1zOiBBc3NpZ25lck5vZGVPcGVyYXRpb25bXVxufVxuXG5leHBvcnQgY29uc3Qgd3JpdGVNb2RlVHlwZXNOdW0gPSBbV3JpdGVNb2RlLmluY3JlbWVudCwgV3JpdGVNb2RlLmRlY3JlbWVudCwgV3JpdGVNb2RlLm11bHRpcGx5LCBXcml0ZU1vZGUuZGl2aWRlXVxuIl19