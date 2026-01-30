"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureNonEmptyString = ensureNonEmptyString;
exports.ensureOptionalString = ensureOptionalString;
exports.ensureOptionalInt = ensureOptionalInt;
exports.ensureOptionalBoolean = ensureOptionalBoolean;
exports.ensureStringArray = ensureStringArray;
exports.ensureOptionalStringArray = ensureOptionalStringArray;
exports.ensureRating = ensureRating;
exports.validateParams = validateParams;
const dify_error_1 = require("../errors/dify-error");
const MAX_STRING_LENGTH = 10000;
const MAX_LIST_LENGTH = 1000;
const MAX_DICT_LENGTH = 100;
function ensureNonEmptyString(value, name) {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new dify_error_1.ValidationError(`${name} must be a non-empty string`);
    }
    if (value.length > MAX_STRING_LENGTH) {
        throw new dify_error_1.ValidationError(`${name} exceeds maximum length of ${MAX_STRING_LENGTH} characters`);
    }
}
/**
 * Validates optional string fields that must be non-empty when provided.
 * Use this for fields like `name` that are optional but should not be empty strings.
 *
 * For filter parameters that accept empty strings (e.g., `keyword: ""`),
 * use `validateParams` which allows empty strings for optional params.
 */
function ensureOptionalString(value, name) {
    if (value === undefined || value === null) {
        return;
    }
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new dify_error_1.ValidationError(`${name} must be a non-empty string when set`);
    }
    if (value.length > MAX_STRING_LENGTH) {
        throw new dify_error_1.ValidationError(`${name} exceeds maximum length of ${MAX_STRING_LENGTH} characters`);
    }
}
function ensureOptionalInt(value, name) {
    if (value === undefined || value === null) {
        return;
    }
    if (!Number.isInteger(value)) {
        throw new dify_error_1.ValidationError(`${name} must be an integer when set`);
    }
}
function ensureOptionalBoolean(value, name) {
    if (value === undefined || value === null) {
        return;
    }
    if (typeof value !== "boolean") {
        throw new dify_error_1.ValidationError(`${name} must be a boolean when set`);
    }
}
function ensureStringArray(value, name) {
    if (!Array.isArray(value) || value.length === 0) {
        throw new dify_error_1.ValidationError(`${name} must be a non-empty string array`);
    }
    if (value.length > MAX_LIST_LENGTH) {
        throw new dify_error_1.ValidationError(`${name} exceeds maximum size of ${MAX_LIST_LENGTH} items`);
    }
    value.forEach((item) => {
        if (typeof item !== "string" || item.trim().length === 0) {
            throw new dify_error_1.ValidationError(`${name} must contain non-empty strings`);
        }
    });
}
function ensureOptionalStringArray(value, name) {
    if (value === undefined || value === null) {
        return;
    }
    ensureStringArray(value, name);
}
function ensureRating(value) {
    if (value === undefined || value === null) {
        return;
    }
    if (value !== "like" && value !== "dislike") {
        throw new dify_error_1.ValidationError("rating must be either 'like' or 'dislike'");
    }
}
function validateParams(params) {
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }
        // Only check max length for strings; empty strings are allowed for optional params
        // Required fields are validated at method level via ensureNonEmptyString
        if (typeof value === "string") {
            if (value.length > MAX_STRING_LENGTH) {
                throw new dify_error_1.ValidationError(`Parameter '${key}' exceeds maximum length of ${MAX_STRING_LENGTH} characters`);
            }
        }
        else if (Array.isArray(value)) {
            if (value.length > MAX_LIST_LENGTH) {
                throw new dify_error_1.ValidationError(`Parameter '${key}' exceeds maximum size of ${MAX_LIST_LENGTH} items`);
            }
        }
        else if (typeof value === "object") {
            if (Object.keys(value).length > MAX_DICT_LENGTH) {
                throw new dify_error_1.ValidationError(`Parameter '${key}' exceeds maximum size of ${MAX_DICT_LENGTH} items`);
            }
        }
        if (key === "user" && typeof value !== "string") {
            throw new dify_error_1.ValidationError(`Parameter '${key}' must be a string`);
        }
        if ((key === "page" || key === "limit" || key === "page_size") &&
            !Number.isInteger(value)) {
            throw new dify_error_1.ValidationError(`Parameter '${key}' must be an integer`);
        }
        if (key === "files" && !Array.isArray(value) && typeof value !== "object") {
            throw new dify_error_1.ValidationError(`Parameter '${key}' must be a list or dict`);
        }
        if (key === "rating" && value !== "like" && value !== "dislike") {
            throw new dify_error_1.ValidationError(`Parameter '${key}' must be 'like' or 'dislike'`);
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhbGlkYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQSxvREFZQztBQVNELG9EQVlDO0FBRUQsOENBT0M7QUFFRCxzREFPQztBQUVELDhDQWNDO0FBRUQsOERBS0M7QUFFRCxvQ0FPQztBQUVELHdDQTRDQztBQXZJRCxxREFBdUQ7QUFFdkQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFDaEMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzdCLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQztBQUU1QixTQUFnQixvQkFBb0IsQ0FDbEMsS0FBYyxFQUNkLElBQVk7SUFFWixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzNELE1BQU0sSUFBSSw0QkFBZSxDQUFDLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztRQUNyQyxNQUFNLElBQUksNEJBQWUsQ0FDdkIsR0FBRyxJQUFJLDhCQUE4QixpQkFBaUIsYUFBYSxDQUNwRSxDQUFDO0lBQ0osQ0FBQztBQUNILENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixvQkFBb0IsQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUMvRCxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQzFDLE9BQU87SUFDVCxDQUFDO0lBQ0QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMzRCxNQUFNLElBQUksNEJBQWUsQ0FBQyxHQUFHLElBQUksc0NBQXNDLENBQUMsQ0FBQztJQUMz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Q0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzFFLE1BQU0sSUFBSSw0QkFBZSxDQUFDLGNBQWMsR0FBRywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7UUFDRCxJQUFJLEdBQUcsS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDaEUsTUFBTSxJQUFJLDRCQUFlLENBQUMsY0FBYyxHQUFHLCtCQUErQixDQUFDLENBQUM7UUFDOUUsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZhbGlkYXRpb25FcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvZGlmeS1lcnJvclwiO1xuXG5jb25zdCBNQVhfU1RSSU5HX0xFTkdUSCA9IDEwMDAwO1xuY29uc3QgTUFYX0xJU1RfTEVOR1RIID0gMTAwMDtcbmNvbnN0IE1BWF9ESUNUX0xFTkdUSCA9IDEwMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZU5vbkVtcHR5U3RyaW5nKFxuICB2YWx1ZTogdW5rbm93bixcbiAgbmFtZTogc3RyaW5nXG4pOiBhc3NlcnRzIHZhbHVlIGlzIHN0cmluZyB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIgfHwgdmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoYCR7bmFtZX0gbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmdgKTtcbiAgfVxuICBpZiAodmFsdWUubGVuZ3RoID4gTUFYX1NUUklOR19MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgYCR7bmFtZX0gZXhjZWVkcyBtYXhpbXVtIGxlbmd0aCBvZiAke01BWF9TVFJJTkdfTEVOR1RIfSBjaGFyYWN0ZXJzYFxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgb3B0aW9uYWwgc3RyaW5nIGZpZWxkcyB0aGF0IG11c3QgYmUgbm9uLWVtcHR5IHdoZW4gcHJvdmlkZWQuXG4gKiBVc2UgdGhpcyBmb3IgZmllbGRzIGxpa2UgYG5hbWVgIHRoYXQgYXJlIG9wdGlvbmFsIGJ1dCBzaG91bGQgbm90IGJlIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogRm9yIGZpbHRlciBwYXJhbWV0ZXJzIHRoYXQgYWNjZXB0IGVtcHR5IHN0cmluZ3MgKGUuZy4sIGBrZXl3b3JkOiBcIlwiYCksXG4gKiB1c2UgYHZhbGlkYXRlUGFyYW1zYCB3aGljaCBhbGxvd3MgZW1wdHkgc3RyaW5ncyBmb3Igb3B0aW9uYWwgcGFyYW1zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlT3B0aW9uYWxTdHJpbmcodmFsdWU6IHVua25vd24sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiIHx8IHZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGAke25hbWV9IG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nIHdoZW4gc2V0YCk7XG4gIH1cbiAgaWYgKHZhbHVlLmxlbmd0aCA+IE1BWF9TVFJJTkdfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgIGAke25hbWV9IGV4Y2VlZHMgbWF4aW11bSBsZW5ndGggb2YgJHtNQVhfU1RSSU5HX0xFTkdUSH0gY2hhcmFjdGVyc2BcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVPcHRpb25hbEludCh2YWx1ZTogdW5rbm93biwgbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGAke25hbWV9IG11c3QgYmUgYW4gaW50ZWdlciB3aGVuIHNldGApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVPcHRpb25hbEJvb2xlYW4odmFsdWU6IHVua25vd24sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIikge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoYCR7bmFtZX0gbXVzdCBiZSBhIGJvb2xlYW4gd2hlbiBzZXRgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlU3RyaW5nQXJyYXkodmFsdWU6IHVua25vd24sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpIHx8IHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoYCR7bmFtZX0gbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcgYXJyYXlgKTtcbiAgfVxuICBpZiAodmFsdWUubGVuZ3RoID4gTUFYX0xJU1RfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgIGAke25hbWV9IGV4Y2VlZHMgbWF4aW11bSBzaXplIG9mICR7TUFYX0xJU1RfTEVOR1RIfSBpdGVtc2BcbiAgICApO1xuICB9XG4gIHZhbHVlLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09IFwic3RyaW5nXCIgfHwgaXRlbS50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGAke25hbWV9IG11c3QgY29udGFpbiBub24tZW1wdHkgc3RyaW5nc2ApO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVPcHRpb25hbFN0cmluZ0FycmF5KHZhbHVlOiB1bmtub3duLCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZW5zdXJlU3RyaW5nQXJyYXkodmFsdWUsIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlUmF0aW5nKHZhbHVlOiB1bmtub3duKTogdm9pZCB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh2YWx1ZSAhPT0gXCJsaWtlXCIgJiYgdmFsdWUgIT09IFwiZGlzbGlrZVwiKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcInJhdGluZyBtdXN0IGJlIGVpdGhlciAnbGlrZScgb3IgJ2Rpc2xpa2UnXCIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhcmFtcyhwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogdm9pZCB7XG4gIE9iamVjdC5lbnRyaWVzKHBhcmFtcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGNoZWNrIG1heCBsZW5ndGggZm9yIHN0cmluZ3M7IGVtcHR5IHN0cmluZ3MgYXJlIGFsbG93ZWQgZm9yIG9wdGlvbmFsIHBhcmFtc1xuICAgIC8vIFJlcXVpcmVkIGZpZWxkcyBhcmUgdmFsaWRhdGVkIGF0IG1ldGhvZCBsZXZlbCB2aWEgZW5zdXJlTm9uRW1wdHlTdHJpbmdcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAodmFsdWUubGVuZ3RoID4gTUFYX1NUUklOR19MRU5HVEgpIHtcbiAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgICBgUGFyYW1ldGVyICcke2tleX0nIGV4Y2VlZHMgbWF4aW11bSBsZW5ndGggb2YgJHtNQVhfU1RSSU5HX0xFTkdUSH0gY2hhcmFjdGVyc2BcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBpZiAodmFsdWUubGVuZ3RoID4gTUFYX0xJU1RfTEVOR1RIKSB7XG4gICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoXG4gICAgICAgICAgYFBhcmFtZXRlciAnJHtrZXl9JyBleGNlZWRzIG1heGltdW0gc2l6ZSBvZiAke01BWF9MSVNUX0xFTkdUSH0gaXRlbXNgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyh2YWx1ZSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikubGVuZ3RoID4gTUFYX0RJQ1RfTEVOR1RIKSB7XG4gICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoXG4gICAgICAgICAgYFBhcmFtZXRlciAnJHtrZXl9JyBleGNlZWRzIG1heGltdW0gc2l6ZSBvZiAke01BWF9ESUNUX0xFTkdUSH0gaXRlbXNgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGtleSA9PT0gXCJ1c2VyXCIgJiYgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGBQYXJhbWV0ZXIgJyR7a2V5fScgbXVzdCBiZSBhIHN0cmluZ2ApO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICAoa2V5ID09PSBcInBhZ2VcIiB8fCBrZXkgPT09IFwibGltaXRcIiB8fCBrZXkgPT09IFwicGFnZV9zaXplXCIpICYmXG4gICAgICAhTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSlcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoYFBhcmFtZXRlciAnJHtrZXl9JyBtdXN0IGJlIGFuIGludGVnZXJgKTtcbiAgICB9XG4gICAgaWYgKGtleSA9PT0gXCJmaWxlc1wiICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoYFBhcmFtZXRlciAnJHtrZXl9JyBtdXN0IGJlIGEgbGlzdCBvciBkaWN0YCk7XG4gICAgfVxuICAgIGlmIChrZXkgPT09IFwicmF0aW5nXCIgJiYgdmFsdWUgIT09IFwibGlrZVwiICYmIHZhbHVlICE9PSBcImRpc2xpa2VcIikge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihgUGFyYW1ldGVyICcke2tleX0nIG11c3QgYmUgJ2xpa2UnIG9yICdkaXNsaWtlJ2ApO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=