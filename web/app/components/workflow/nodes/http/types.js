"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIType = exports.AuthorizationType = exports.BodyPayloadValueType = exports.BodyType = exports.Method = void 0;
var Method;
(function (Method) {
    Method["get"] = "get";
    Method["post"] = "post";
    Method["head"] = "head";
    Method["patch"] = "patch";
    Method["put"] = "put";
    Method["delete"] = "delete";
})(Method || (exports.Method = Method = {}));
var BodyType;
(function (BodyType) {
    BodyType["none"] = "none";
    BodyType["formData"] = "form-data";
    BodyType["xWwwFormUrlencoded"] = "x-www-form-urlencoded";
    BodyType["rawText"] = "raw-text";
    BodyType["json"] = "json";
    BodyType["binary"] = "binary";
})(BodyType || (exports.BodyType = BodyType = {}));
var BodyPayloadValueType;
(function (BodyPayloadValueType) {
    BodyPayloadValueType["text"] = "text";
    BodyPayloadValueType["file"] = "file";
})(BodyPayloadValueType || (exports.BodyPayloadValueType = BodyPayloadValueType = {}));
var AuthorizationType;
(function (AuthorizationType) {
    AuthorizationType["none"] = "no-auth";
    AuthorizationType["apiKey"] = "api-key";
})(AuthorizationType || (exports.AuthorizationType = AuthorizationType = {}));
var APIType;
(function (APIType) {
    APIType["basic"] = "basic";
    APIType["bearer"] = "bearer";
    APIType["custom"] = "custom";
})(APIType || (exports.APIType = APIType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxJQUFZLE1BT1g7QUFQRCxXQUFZLE1BQU07SUFDaEIscUJBQVcsQ0FBQTtJQUNYLHVCQUFhLENBQUE7SUFDYix1QkFBYSxDQUFBO0lBQ2IseUJBQWUsQ0FBQTtJQUNmLHFCQUFXLENBQUE7SUFDWCwyQkFBaUIsQ0FBQTtBQUNuQixDQUFDLEVBUFcsTUFBTSxzQkFBTixNQUFNLFFBT2pCO0FBRUQsSUFBWSxRQU9YO0FBUEQsV0FBWSxRQUFRO0lBQ2xCLHlCQUFhLENBQUE7SUFDYixrQ0FBc0IsQ0FBQTtJQUN0Qix3REFBNEMsQ0FBQTtJQUM1QyxnQ0FBb0IsQ0FBQTtJQUNwQix5QkFBYSxDQUFBO0lBQ2IsNkJBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQVBXLFFBQVEsd0JBQVIsUUFBUSxRQU9uQjtBQVVELElBQVksb0JBR1g7QUFIRCxXQUFZLG9CQUFvQjtJQUM5QixxQ0FBYSxDQUFBO0lBQ2IscUNBQWEsQ0FBQTtBQUNmLENBQUMsRUFIVyxvQkFBb0Isb0NBQXBCLG9CQUFvQixRQUcvQjtBQWNELElBQVksaUJBR1g7QUFIRCxXQUFZLGlCQUFpQjtJQUMzQixxQ0FBZ0IsQ0FBQTtJQUNoQix1Q0FBa0IsQ0FBQTtBQUNwQixDQUFDLEVBSFcsaUJBQWlCLGlDQUFqQixpQkFBaUIsUUFHNUI7QUFFRCxJQUFZLE9BSVg7QUFKRCxXQUFZLE9BQU87SUFDakIsMEJBQWUsQ0FBQTtJQUNmLDRCQUFpQixDQUFBO0lBQ2pCLDRCQUFpQixDQUFBO0FBQ25CLENBQUMsRUFKVyxPQUFPLHVCQUFQLE9BQU8sUUFJbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbW1vbk5vZGVUeXBlLCBWYWx1ZVNlbGVjdG9yLCBWYXJpYWJsZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5cbmV4cG9ydCBlbnVtIE1ldGhvZCB7XG4gIGdldCA9ICdnZXQnLFxuICBwb3N0ID0gJ3Bvc3QnLFxuICBoZWFkID0gJ2hlYWQnLFxuICBwYXRjaCA9ICdwYXRjaCcsXG4gIHB1dCA9ICdwdXQnLFxuICBkZWxldGUgPSAnZGVsZXRlJyxcbn1cblxuZXhwb3J0IGVudW0gQm9keVR5cGUge1xuICBub25lID0gJ25vbmUnLFxuICBmb3JtRGF0YSA9ICdmb3JtLWRhdGEnLFxuICB4V3d3Rm9ybVVybGVuY29kZWQgPSAneC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgcmF3VGV4dCA9ICdyYXctdGV4dCcsXG4gIGpzb24gPSAnanNvbicsXG4gIGJpbmFyeSA9ICdiaW5hcnknLFxufVxuXG5leHBvcnQgdHlwZSBLZXlWYWx1ZSA9IHtcbiAgaWQ/OiBzdHJpbmdcbiAga2V5OiBzdHJpbmdcbiAgdmFsdWU6IHN0cmluZ1xuICB0eXBlPzogc3RyaW5nXG4gIGZpbGU/OiBWYWx1ZVNlbGVjdG9yXG59XG5cbmV4cG9ydCBlbnVtIEJvZHlQYXlsb2FkVmFsdWVUeXBlIHtcbiAgdGV4dCA9ICd0ZXh0JyxcbiAgZmlsZSA9ICdmaWxlJyxcbn1cblxuZXhwb3J0IHR5cGUgQm9keVBheWxvYWQgPSB7XG4gIGlkPzogc3RyaW5nXG4gIGtleT86IHN0cmluZ1xuICB0eXBlOiBCb2R5UGF5bG9hZFZhbHVlVHlwZVxuICBmaWxlPzogVmFsdWVTZWxlY3RvciAvLyB3aGVuIHR5cGUgaXMgZmlsZVxuICB2YWx1ZT86IHN0cmluZyAvLyB3aGVuIHR5cGUgaXMgdGV4dFxufVtdXG5leHBvcnQgdHlwZSBCb2R5ID0ge1xuICB0eXBlOiBCb2R5VHlwZVxuICBkYXRhOiBzdHJpbmcgfCBCb2R5UGF5bG9hZCAvLyBzdHJpbmcgaXMgZGVwcmVjYXRlZCwgaXQgd291bGQgY29udmVydCB0byBCb2R5UGF5bG9hZCBhZnRlciBsb2FkZWRcbn1cblxuZXhwb3J0IGVudW0gQXV0aG9yaXphdGlvblR5cGUge1xuICBub25lID0gJ25vLWF1dGgnLFxuICBhcGlLZXkgPSAnYXBpLWtleScsXG59XG5cbmV4cG9ydCBlbnVtIEFQSVR5cGUge1xuICBiYXNpYyA9ICdiYXNpYycsXG4gIGJlYXJlciA9ICdiZWFyZXInLFxuICBjdXN0b20gPSAnY3VzdG9tJyxcbn1cblxuZXhwb3J0IHR5cGUgQXV0aG9yaXphdGlvbiA9IHtcbiAgdHlwZTogQXV0aG9yaXphdGlvblR5cGVcbiAgY29uZmlnPzoge1xuICAgIHR5cGU6IEFQSVR5cGVcbiAgICBhcGlfa2V5OiBzdHJpbmdcbiAgICBoZWFkZXI/OiBzdHJpbmdcbiAgfSB8IG51bGxcbn1cblxuZXhwb3J0IHR5cGUgVGltZW91dCA9IHtcbiAgY29ubmVjdD86IG51bWJlclxuICByZWFkPzogbnVtYmVyXG4gIHdyaXRlPzogbnVtYmVyXG4gIG1heF9jb25uZWN0X3RpbWVvdXQ/OiBudW1iZXJcbiAgbWF4X3JlYWRfdGltZW91dD86IG51bWJlclxuICBtYXhfd3JpdGVfdGltZW91dD86IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBIdHRwTm9kZVR5cGUgPSBDb21tb25Ob2RlVHlwZSAmIHtcbiAgdmFyaWFibGVzOiBWYXJpYWJsZVtdXG4gIG1ldGhvZDogTWV0aG9kXG4gIHVybDogc3RyaW5nXG4gIGhlYWRlcnM6IHN0cmluZ1xuICBwYXJhbXM6IHN0cmluZ1xuICBib2R5OiBCb2R5XG4gIGF1dGhvcml6YXRpb246IEF1dGhvcml6YXRpb25cbiAgdGltZW91dDogVGltZW91dFxuICBzc2xfdmVyaWZ5PzogYm9vbGVhblxufVxuIl19