"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unBindTag = exports.bindTag = exports.deleteTag = exports.updateTag = exports.createTag = exports.fetchTagList = void 0;
const base_1 = require("./base");
const fetchTagList = (type) => {
    return (0, base_1.get)('/tags', { params: { type } });
};
exports.fetchTagList = fetchTagList;
const createTag = (name, type) => {
    return (0, base_1.post)('/tags', {
        body: {
            name,
            type,
        },
    });
};
exports.createTag = createTag;
const updateTag = (tagID, name) => {
    return (0, base_1.patch)(`/tags/${tagID}`, {
        body: {
            name,
        },
    });
};
exports.updateTag = updateTag;
const deleteTag = (tagID) => {
    return (0, base_1.del)(`/tags/${tagID}`);
};
exports.deleteTag = deleteTag;
const bindTag = (tagIDList, targetID, type) => {
    return (0, base_1.post)('/tag-bindings/create', {
        body: {
            tag_ids: tagIDList,
            target_id: targetID,
            type,
        },
    });
};
exports.bindTag = bindTag;
const unBindTag = (tagID, targetID, type) => {
    return (0, base_1.post)('/tag-bindings/remove', {
        body: {
            tag_id: tagID,
            target_id: targetID,
            type,
        },
    });
};
exports.unBindTag = unBindTag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUE4QztBQUV2QyxNQUFNLFlBQVksR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQzNDLE9BQU8sSUFBQSxVQUFHLEVBQVEsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ2xELENBQUMsQ0FBQTtBQUZZLFFBQUEsWUFBWSxnQkFFeEI7QUFFTSxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQVksRUFBRSxJQUFZLEVBQUUsRUFBRTtJQUN0RCxPQUFPLElBQUEsV0FBSSxFQUFNLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUU7WUFDSixJQUFJO1lBQ0osSUFBSTtTQUNMO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBUFksUUFBQSxTQUFTLGFBT3JCO0FBRU0sTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBWSxFQUFFLEVBQUU7SUFDdkQsT0FBTyxJQUFBLFlBQUssRUFBQyxTQUFTLEtBQUssRUFBRSxFQUFFO1FBQzdCLElBQUksRUFBRTtZQUNKLElBQUk7U0FDTDtLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQU5ZLFFBQUEsU0FBUyxhQU1yQjtBQUVNLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7SUFDekMsT0FBTyxJQUFBLFVBQUcsRUFBQyxTQUFTLEtBQUssRUFBRSxDQUFDLENBQUE7QUFDOUIsQ0FBQyxDQUFBO0FBRlksUUFBQSxTQUFTLGFBRXJCO0FBRU0sTUFBTSxPQUFPLEdBQUcsQ0FBQyxTQUFtQixFQUFFLFFBQWdCLEVBQUUsSUFBWSxFQUFFLEVBQUU7SUFDN0UsT0FBTyxJQUFBLFdBQUksRUFBQyxzQkFBc0IsRUFBRTtRQUNsQyxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsU0FBUztZQUNsQixTQUFTLEVBQUUsUUFBUTtZQUNuQixJQUFJO1NBQ0w7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFSWSxRQUFBLE9BQU8sV0FRbkI7QUFFTSxNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLElBQVksRUFBRSxFQUFFO0lBQ3pFLE9BQU8sSUFBQSxXQUFJLEVBQUMsc0JBQXNCLEVBQUU7UUFDbEMsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLEtBQUs7WUFDYixTQUFTLEVBQUUsUUFBUTtZQUNuQixJQUFJO1NBQ0w7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFSWSxRQUFBLFNBQVMsYUFRckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFRhZyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90YWctbWFuYWdlbWVudC9jb25zdGFudCdcbmltcG9ydCB7IGRlbCwgZ2V0LCBwYXRjaCwgcG9zdCB9IGZyb20gJy4vYmFzZSdcblxuZXhwb3J0IGNvbnN0IGZldGNoVGFnTGlzdCA9ICh0eXBlOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIGdldDxUYWdbXT4oJy90YWdzJywgeyBwYXJhbXM6IHsgdHlwZSB9IH0pXG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUYWcgPSAobmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHBvc3Q8VGFnPignL3RhZ3MnLCB7XG4gICAgYm9keToge1xuICAgICAgbmFtZSxcbiAgICAgIHR5cGUsXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZVRhZyA9ICh0YWdJRDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHBhdGNoKGAvdGFncy8ke3RhZ0lEfWAsIHtcbiAgICBib2R5OiB7XG4gICAgICBuYW1lLFxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCBkZWxldGVUYWcgPSAodGFnSUQ6IHN0cmluZykgPT4ge1xuICByZXR1cm4gZGVsKGAvdGFncy8ke3RhZ0lEfWApXG59XG5cbmV4cG9ydCBjb25zdCBiaW5kVGFnID0gKHRhZ0lETGlzdDogc3RyaW5nW10sIHRhcmdldElEOiBzdHJpbmcsIHR5cGU6IHN0cmluZykgPT4ge1xuICByZXR1cm4gcG9zdCgnL3RhZy1iaW5kaW5ncy9jcmVhdGUnLCB7XG4gICAgYm9keToge1xuICAgICAgdGFnX2lkczogdGFnSURMaXN0LFxuICAgICAgdGFyZ2V0X2lkOiB0YXJnZXRJRCxcbiAgICAgIHR5cGUsXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVuQmluZFRhZyA9ICh0YWdJRDogc3RyaW5nLCB0YXJnZXRJRDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHBvc3QoJy90YWctYmluZGluZ3MvcmVtb3ZlJywge1xuICAgIGJvZHk6IHtcbiAgICAgIHRhZ19pZDogdGFnSUQsXG4gICAgICB0YXJnZXRfaWQ6IHRhcmdldElELFxuICAgICAgdHlwZSxcbiAgICB9LFxuICB9KVxufVxuIl19