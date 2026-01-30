"use strict";
// https://github.com/iamakulov/unescape-js/blob/master/src/index.js
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * \\ - matches the backslash which indicates the beginning of an escape sequence
 * (
 *   u\{([0-9A-Fa-f]+)\} - first alternative; matches the variable-length hexadecimal escape sequence (\u{ABCD0})
 * |
 *   u([0-9A-Fa-f]{4}) - second alternative; matches the 4-digit hexadecimal escape sequence (\uABCD)
 * |
 *   x([0-9A-Fa-f]{2}) - third alternative; matches the 2-digit hexadecimal escape sequence (\xA5)
 * |
 *   ([1-7][0-7]{0,2}|[0-7]{2,3}) - fourth alternative; matches the up-to-3-digit octal escape sequence (\5 or \512)
 * |
 *   (['"tbrnfv0\\]) - fifth alternative; matches the special escape characters (\t, \n and so on)
 * |
 *   \U([0-9A-Fa-f]+) - sixth alternative; matches the 8-digit hexadecimal escape sequence used by python (\U0001F3B5)
 * )
 */
const jsEscapeRegex = /\\(u\{([0-9A-Fa-f]+)\}|u([0-9A-Fa-f]{4})|x([0-9A-Fa-f]{2})|([1-7][0-7]{0,2}|[0-7]{2,3})|(['"tbrnfv0\\]))|\\U([0-9A-Fa-f]{8})/g;
const usualEscapeSequences = {
    '0': '\0',
    'b': '\b',
    'f': '\f',
    'n': '\n',
    'r': '\r',
    't': '\t',
    'v': '\v',
    '\'': '\'',
    '"': '"',
    '\\': '\\',
};
const fromHex = (str) => String.fromCodePoint(Number.parseInt(str, 16));
const fromOct = (str) => String.fromCodePoint(Number.parseInt(str, 8));
const unescape = (str) => {
    return str.replace(jsEscapeRegex, (_, __, varHex, longHex, shortHex, octal, specialCharacter, python) => {
        if (varHex !== undefined)
            return fromHex(varHex);
        else if (longHex !== undefined)
            return fromHex(longHex);
        else if (shortHex !== undefined)
            return fromHex(shortHex);
        else if (octal !== undefined)
            return fromOct(octal);
        else if (python !== undefined)
            return fromHex(python);
        else
            return usualEscapeSequences[specialCharacter];
    });
};
exports.default = unescape;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5lc2NhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1bmVzY2FwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQW9FOztBQUVwRTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFNLGFBQWEsR0FBRywrSEFBK0gsQ0FBQTtBQUVySixNQUFNLG9CQUFvQixHQUEyQjtJQUNuRCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULElBQUksRUFBRSxJQUFJO0lBQ1YsR0FBRyxFQUFFLEdBQUc7SUFDUixJQUFJLEVBQUUsSUFBSTtDQUNYLENBQUE7QUFFRCxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQy9FLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFFOUUsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUMvQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDdEcsSUFBSSxNQUFNLEtBQUssU0FBUztZQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNuQixJQUFJLE9BQU8sS0FBSyxTQUFTO1lBQzVCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ3BCLElBQUksUUFBUSxLQUFLLFNBQVM7WUFDN0IsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7YUFDckIsSUFBSSxLQUFLLEtBQUssU0FBUztZQUMxQixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUNsQixJQUFJLE1BQU0sS0FBSyxTQUFTO1lBQzNCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztZQUV0QixPQUFPLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDakQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFFRCxrQkFBZSxRQUFRLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBodHRwczovL2dpdGh1Yi5jb20vaWFtYWt1bG92L3VuZXNjYXBlLWpzL2Jsb2IvbWFzdGVyL3NyYy9pbmRleC5qc1xuXG4vKipcbiAqIFxcXFwgLSBtYXRjaGVzIHRoZSBiYWNrc2xhc2ggd2hpY2ggaW5kaWNhdGVzIHRoZSBiZWdpbm5pbmcgb2YgYW4gZXNjYXBlIHNlcXVlbmNlXG4gKiAoXG4gKiAgIHVcXHsoWzAtOUEtRmEtZl0rKVxcfSAtIGZpcnN0IGFsdGVybmF0aXZlOyBtYXRjaGVzIHRoZSB2YXJpYWJsZS1sZW5ndGggaGV4YWRlY2ltYWwgZXNjYXBlIHNlcXVlbmNlIChcXHV7QUJDRDB9KVxuICogfFxuICogICB1KFswLTlBLUZhLWZdezR9KSAtIHNlY29uZCBhbHRlcm5hdGl2ZTsgbWF0Y2hlcyB0aGUgNC1kaWdpdCBoZXhhZGVjaW1hbCBlc2NhcGUgc2VxdWVuY2UgKFxcdUFCQ0QpXG4gKiB8XG4gKiAgIHgoWzAtOUEtRmEtZl17Mn0pIC0gdGhpcmQgYWx0ZXJuYXRpdmU7IG1hdGNoZXMgdGhlIDItZGlnaXQgaGV4YWRlY2ltYWwgZXNjYXBlIHNlcXVlbmNlIChcXHhBNSlcbiAqIHxcbiAqICAgKFsxLTddWzAtN117MCwyfXxbMC03XXsyLDN9KSAtIGZvdXJ0aCBhbHRlcm5hdGl2ZTsgbWF0Y2hlcyB0aGUgdXAtdG8tMy1kaWdpdCBvY3RhbCBlc2NhcGUgc2VxdWVuY2UgKFxcNSBvciBcXDUxMilcbiAqIHxcbiAqICAgKFsnXCJ0YnJuZnYwXFxcXF0pIC0gZmlmdGggYWx0ZXJuYXRpdmU7IG1hdGNoZXMgdGhlIHNwZWNpYWwgZXNjYXBlIGNoYXJhY3RlcnMgKFxcdCwgXFxuIGFuZCBzbyBvbilcbiAqIHxcbiAqICAgXFxVKFswLTlBLUZhLWZdKykgLSBzaXh0aCBhbHRlcm5hdGl2ZTsgbWF0Y2hlcyB0aGUgOC1kaWdpdCBoZXhhZGVjaW1hbCBlc2NhcGUgc2VxdWVuY2UgdXNlZCBieSBweXRob24gKFxcVTAwMDFGM0I1KVxuICogKVxuICovXG5jb25zdCBqc0VzY2FwZVJlZ2V4ID0gL1xcXFwodVxceyhbMC05QS1GYS1mXSspXFx9fHUoWzAtOUEtRmEtZl17NH0pfHgoWzAtOUEtRmEtZl17Mn0pfChbMS03XVswLTddezAsMn18WzAtN117MiwzfSl8KFsnXCJ0YnJuZnYwXFxcXF0pKXxcXFxcVShbMC05QS1GYS1mXXs4fSkvZ1xuXG5jb25zdCB1c3VhbEVzY2FwZVNlcXVlbmNlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJzAnOiAnXFwwJyxcbiAgJ2InOiAnXFxiJyxcbiAgJ2YnOiAnXFxmJyxcbiAgJ24nOiAnXFxuJyxcbiAgJ3InOiAnXFxyJyxcbiAgJ3QnOiAnXFx0JyxcbiAgJ3YnOiAnXFx2JyxcbiAgJ1xcJyc6ICdcXCcnLFxuICAnXCInOiAnXCInLFxuICAnXFxcXCc6ICdcXFxcJyxcbn1cblxuY29uc3QgZnJvbUhleCA9IChzdHI6IHN0cmluZykgPT4gU3RyaW5nLmZyb21Db2RlUG9pbnQoTnVtYmVyLnBhcnNlSW50KHN0ciwgMTYpKVxuY29uc3QgZnJvbU9jdCA9IChzdHI6IHN0cmluZykgPT4gU3RyaW5nLmZyb21Db2RlUG9pbnQoTnVtYmVyLnBhcnNlSW50KHN0ciwgOCkpXG5cbmNvbnN0IHVuZXNjYXBlID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIHJldHVybiBzdHIucmVwbGFjZShqc0VzY2FwZVJlZ2V4LCAoXywgX18sIHZhckhleCwgbG9uZ0hleCwgc2hvcnRIZXgsIG9jdGFsLCBzcGVjaWFsQ2hhcmFjdGVyLCBweXRob24pID0+IHtcbiAgICBpZiAodmFySGV4ICE9PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gZnJvbUhleCh2YXJIZXgpXG4gICAgZWxzZSBpZiAobG9uZ0hleCAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGZyb21IZXgobG9uZ0hleClcbiAgICBlbHNlIGlmIChzaG9ydEhleCAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGZyb21IZXgoc2hvcnRIZXgpXG4gICAgZWxzZSBpZiAob2N0YWwgIT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiBmcm9tT2N0KG9jdGFsKVxuICAgIGVsc2UgaWYgKHB5dGhvbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGZyb21IZXgocHl0aG9uKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB1c3VhbEVzY2FwZVNlcXVlbmNlc1tzcGVjaWFsQ2hhcmFjdGVyXVxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCB1bmVzY2FwZVxuIl19