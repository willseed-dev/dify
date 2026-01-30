"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escape(input) {
    if (!input || typeof input !== 'string')
        return '';
    const res = input
        // .replaceAll('\\', '\\\\') // This would add too many backslashes
        .replaceAll('\0', '\\0')
        .replaceAll('\b', '\\b')
        .replaceAll('\f', '\\f')
        .replaceAll('\n', '\\n')
        .replaceAll('\r', '\\r')
        .replaceAll('\t', '\\t')
        .replaceAll('\v', '\\v')
        .replaceAll('\'', '\\\'');
    return res;
}
exports.default = escape;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNjYXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXNjYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBUyxNQUFNLENBQUMsS0FBYTtJQUMzQixJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7UUFDckMsT0FBTyxFQUFFLENBQUE7SUFFWCxNQUFNLEdBQUcsR0FBRyxLQUFLO1FBQ2YsbUVBQW1FO1NBQ2xFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQ3ZCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQ3ZCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQ3ZCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQ3ZCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQ3ZCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQ3ZCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQ3ZCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDM0IsT0FBTyxHQUFHLENBQUE7QUFDWixDQUFDO0FBRUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZXNjYXBlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpXG4gICAgcmV0dXJuICcnXG5cbiAgY29uc3QgcmVzID0gaW5wdXRcbiAgICAvLyAucmVwbGFjZUFsbCgnXFxcXCcsICdcXFxcXFxcXCcpIC8vIFRoaXMgd291bGQgYWRkIHRvbyBtYW55IGJhY2tzbGFzaGVzXG4gICAgLnJlcGxhY2VBbGwoJ1xcMCcsICdcXFxcMCcpXG4gICAgLnJlcGxhY2VBbGwoJ1xcYicsICdcXFxcYicpXG4gICAgLnJlcGxhY2VBbGwoJ1xcZicsICdcXFxcZicpXG4gICAgLnJlcGxhY2VBbGwoJ1xcbicsICdcXFxcbicpXG4gICAgLnJlcGxhY2VBbGwoJ1xccicsICdcXFxccicpXG4gICAgLnJlcGxhY2VBbGwoJ1xcdCcsICdcXFxcdCcpXG4gICAgLnJlcGxhY2VBbGwoJ1xcdicsICdcXFxcdicpXG4gICAgLnJlcGxhY2VBbGwoJ1xcJycsICdcXFxcXFwnJylcbiAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgZGVmYXVsdCBlc2NhcGVcbiJdfQ==