"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWorkflowRunIdentifier = exports.isEventTargetInputArea = exports.getKeyboardKeyCodeBySystem = exports.getKeyboardKeyNameBySystem = exports.isMac = void 0;
const isMac = () => {
    return navigator.userAgent.toUpperCase().includes('MAC');
};
exports.isMac = isMac;
const specialKeysNameMap = {
    ctrl: '⌘',
    alt: '⌥',
    shift: '⇧',
};
const getKeyboardKeyNameBySystem = (key) => {
    if ((0, exports.isMac)())
        return specialKeysNameMap[key] || key;
    return key;
};
exports.getKeyboardKeyNameBySystem = getKeyboardKeyNameBySystem;
const specialKeysCodeMap = {
    ctrl: 'meta',
};
const getKeyboardKeyCodeBySystem = (key) => {
    if ((0, exports.isMac)())
        return specialKeysCodeMap[key] || key;
    return key;
};
exports.getKeyboardKeyCodeBySystem = getKeyboardKeyCodeBySystem;
const isEventTargetInputArea = (target) => {
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
        return true;
    if (target.contentEditable === 'true')
        return true;
};
exports.isEventTargetInputArea = isEventTargetInputArea;
/**
 * Format workflow run identifier using finished_at timestamp
 * @param finishedAt - Unix timestamp in seconds
 * @param fallbackText - Text to show when finishedAt is not available (default: 'Running')
 * @returns Formatted string like " (14:30:25)" or " (Running)"
 */
const formatWorkflowRunIdentifier = (finishedAt, fallbackText = 'Running') => {
    if (!finishedAt)
        return ` (${fallbackText})`;
    const date = new Date(finishedAt * 1000);
    const timeStr = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return ` (${timeStr})`;
};
exports.formatWorkflowRunIdentifier = formatWorkflowRunIdentifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFPLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRTtJQUN4QixPQUFPLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzFELENBQUMsQ0FBQTtBQUZZLFFBQUEsS0FBSyxTQUVqQjtBQUVELE1BQU0sa0JBQWtCLEdBQXVDO0lBQzdELElBQUksRUFBRSxHQUFHO0lBQ1QsR0FBRyxFQUFFLEdBQUc7SUFDUixLQUFLLEVBQUUsR0FBRztDQUNYLENBQUE7QUFFTSxNQUFNLDBCQUEwQixHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7SUFDeEQsSUFBSSxJQUFBLGFBQUssR0FBRTtRQUNULE9BQU8sa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFBO0lBRXZDLE9BQU8sR0FBRyxDQUFBO0FBQ1osQ0FBQyxDQUFBO0FBTFksUUFBQSwwQkFBMEIsOEJBS3RDO0FBRUQsTUFBTSxrQkFBa0IsR0FBdUM7SUFDN0QsSUFBSSxFQUFFLE1BQU07Q0FDYixDQUFBO0FBRU0sTUFBTSwwQkFBMEIsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO0lBQ3hELElBQUksSUFBQSxhQUFLLEdBQUU7UUFDVCxPQUFPLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQTtJQUV2QyxPQUFPLEdBQUcsQ0FBQTtBQUNaLENBQUMsQ0FBQTtBQUxZLFFBQUEsMEJBQTBCLDhCQUt0QztBQUVNLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxNQUFtQixFQUFFLEVBQUU7SUFDNUQsSUFBSSxNQUFNLENBQUMsT0FBTyxLQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxLQUFLLFVBQVU7UUFDN0QsT0FBTyxJQUFJLENBQUE7SUFFYixJQUFJLE1BQU0sQ0FBQyxlQUFlLEtBQUssTUFBTTtRQUNuQyxPQUFPLElBQUksQ0FBQTtBQUNmLENBQUMsQ0FBQTtBQU5ZLFFBQUEsc0JBQXNCLDBCQU1sQztBQUVEOzs7OztHQUtHO0FBQ0ksTUFBTSwyQkFBMkIsR0FBRyxDQUFDLFVBQW1CLEVBQUUsWUFBWSxHQUFHLFNBQVMsRUFBVSxFQUFFO0lBQ25HLElBQUksQ0FBQyxVQUFVO1FBQ2IsT0FBTyxLQUFLLFlBQVksR0FBRyxDQUFBO0lBRTdCLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQTtJQUN4QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxFQUFFO1FBQzFDLElBQUksRUFBRSxTQUFTO1FBQ2YsTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLFNBQVM7S0FDbEIsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxLQUFLLE9BQU8sR0FBRyxDQUFBO0FBQ3hCLENBQUMsQ0FBQTtBQVhZLFFBQUEsMkJBQTJCLCtCQVd2QyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBpc01hYyA9ICgpID0+IHtcbiAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQudG9VcHBlckNhc2UoKS5pbmNsdWRlcygnTUFDJylcbn1cblxuY29uc3Qgc3BlY2lhbEtleXNOYW1lTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCB1bmRlZmluZWQ+ID0ge1xuICBjdHJsOiAn4oyYJyxcbiAgYWx0OiAn4oylJyxcbiAgc2hpZnQ6ICfih6cnLFxufVxuXG5leHBvcnQgY29uc3QgZ2V0S2V5Ym9hcmRLZXlOYW1lQnlTeXN0ZW0gPSAoa2V5OiBzdHJpbmcpID0+IHtcbiAgaWYgKGlzTWFjKCkpXG4gICAgcmV0dXJuIHNwZWNpYWxLZXlzTmFtZU1hcFtrZXldIHx8IGtleVxuXG4gIHJldHVybiBrZXlcbn1cblxuY29uc3Qgc3BlY2lhbEtleXNDb2RlTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCB1bmRlZmluZWQ+ID0ge1xuICBjdHJsOiAnbWV0YScsXG59XG5cbmV4cG9ydCBjb25zdCBnZXRLZXlib2FyZEtleUNvZGVCeVN5c3RlbSA9IChrZXk6IHN0cmluZykgPT4ge1xuICBpZiAoaXNNYWMoKSlcbiAgICByZXR1cm4gc3BlY2lhbEtleXNDb2RlTWFwW2tleV0gfHwga2V5XG5cbiAgcmV0dXJuIGtleVxufVxuXG5leHBvcnQgY29uc3QgaXNFdmVudFRhcmdldElucHV0QXJlYSA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gIGlmICh0YXJnZXQudGFnTmFtZSA9PT0gJ0lOUFVUJyB8fCB0YXJnZXQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJylcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGlmICh0YXJnZXQuY29udGVudEVkaXRhYmxlID09PSAndHJ1ZScpXG4gICAgcmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBGb3JtYXQgd29ya2Zsb3cgcnVuIGlkZW50aWZpZXIgdXNpbmcgZmluaXNoZWRfYXQgdGltZXN0YW1wXG4gKiBAcGFyYW0gZmluaXNoZWRBdCAtIFVuaXggdGltZXN0YW1wIGluIHNlY29uZHNcbiAqIEBwYXJhbSBmYWxsYmFja1RleHQgLSBUZXh0IHRvIHNob3cgd2hlbiBmaW5pc2hlZEF0IGlzIG5vdCBhdmFpbGFibGUgKGRlZmF1bHQ6ICdSdW5uaW5nJylcbiAqIEByZXR1cm5zIEZvcm1hdHRlZCBzdHJpbmcgbGlrZSBcIiAoMTQ6MzA6MjUpXCIgb3IgXCIgKFJ1bm5pbmcpXCJcbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdFdvcmtmbG93UnVuSWRlbnRpZmllciA9IChmaW5pc2hlZEF0PzogbnVtYmVyLCBmYWxsYmFja1RleHQgPSAnUnVubmluZycpOiBzdHJpbmcgPT4ge1xuICBpZiAoIWZpbmlzaGVkQXQpXG4gICAgcmV0dXJuIGAgKCR7ZmFsbGJhY2tUZXh0fSlgXG5cbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGZpbmlzaGVkQXQgKiAxMDAwKVxuICBjb25zdCB0aW1lU3RyID0gZGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcoW10sIHtcbiAgICBob3VyOiAnMi1kaWdpdCcsXG4gICAgbWludXRlOiAnMi1kaWdpdCcsXG4gICAgc2Vjb25kOiAnMi1kaWdpdCcsXG4gIH0pXG4gIHJldHVybiBgICgke3RpbWVTdHJ9KWBcbn1cbiJdfQ==