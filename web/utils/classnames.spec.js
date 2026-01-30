"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test suite for the classnames utility function
 * This utility combines the classnames library with tailwind-merge
 * to handle conditional CSS classes and merge conflicting Tailwind classes
 */
const classnames_1 = require("./classnames");
describe('classnames', () => {
    /**
     * Tests basic classnames library features:
     * - String concatenation
     * - Array handling
     * - Falsy value filtering
     * - Object-based conditional classes
     */
    it('classnames libs feature', () => {
        expect((0, classnames_1.cn)('foo')).toBe('foo');
        expect((0, classnames_1.cn)('foo', 'bar')).toBe('foo bar');
        expect((0, classnames_1.cn)(['foo', 'bar'])).toBe('foo bar');
        expect((0, classnames_1.cn)(undefined)).toBe('');
        expect((0, classnames_1.cn)(null)).toBe('');
        expect((0, classnames_1.cn)(false)).toBe('');
        expect((0, classnames_1.cn)({
            foo: true,
            bar: false,
            baz: true,
        })).toBe('foo baz');
    });
    /**
     * Tests tailwind-merge functionality:
     * - Conflicting class resolution (last one wins)
     * - Modifier handling (hover, focus, etc.)
     * - Important prefix (!)
     * - Custom color classes
     * - Arbitrary values
     */
    it('tailwind-merge', () => {
        /* eslint-disable tailwindcss/classnames-order */
        expect((0, classnames_1.cn)('p-0')).toBe('p-0');
        expect((0, classnames_1.cn)('text-right text-center text-left')).toBe('text-left');
        expect((0, classnames_1.cn)('pl-4 p-8')).toBe('p-8');
        expect((0, classnames_1.cn)('m-[2px] m-[4px]')).toBe('m-[4px]');
        expect((0, classnames_1.cn)('m-1 m-[4px]')).toBe('m-[4px]');
        expect((0, classnames_1.cn)('overflow-x-auto hover:overflow-x-hidden overflow-x-scroll')).toBe('hover:overflow-x-hidden overflow-x-scroll');
        expect((0, classnames_1.cn)('h-10 h-min')).toBe('h-min');
        expect((0, classnames_1.cn)('bg-grey-5 bg-hotpink')).toBe('bg-hotpink');
        expect((0, classnames_1.cn)('hover:block hover:inline')).toBe('hover:inline');
        expect((0, classnames_1.cn)('font-medium !font-bold')).toBe('font-medium !font-bold');
        expect((0, classnames_1.cn)('!font-medium !font-bold')).toBe('!font-bold');
        expect((0, classnames_1.cn)('text-gray-100 text-primary-200')).toBe('text-primary-200');
        expect((0, classnames_1.cn)('text-some-unknown-color text-components-input-bg-disabled text-primary-200')).toBe('text-primary-200');
        expect((0, classnames_1.cn)('bg-some-unknown-color bg-components-input-bg-disabled bg-primary-200')).toBe('bg-primary-200');
        expect((0, classnames_1.cn)('border-t border-white/10')).toBe('border-t border-white/10');
        expect((0, classnames_1.cn)('border-t border-white')).toBe('border-t border-white');
        expect((0, classnames_1.cn)('text-3.5xl text-black')).toBe('text-3.5xl text-black');
    });
    /**
     * Tests the integration of classnames and tailwind-merge:
     * - Object-based conditional classes with Tailwind conflict resolution
     */
    it('classnames combined with tailwind-merge', () => {
        expect((0, classnames_1.cn)('text-right', {
            'text-center': true,
        })).toBe('text-center');
        expect((0, classnames_1.cn)('text-right', {
            'text-center': false,
        })).toBe('text-right');
    });
    /**
     * Tests handling of multiple mixed argument types:
     * - Strings, arrays, and objects in a single call
     * - Tailwind merge working across different argument types
     */
    it('multiple mixed argument types', () => {
        expect((0, classnames_1.cn)('foo', ['bar', 'baz'], { qux: true, quux: false })).toBe('foo bar baz qux');
        expect((0, classnames_1.cn)('p-4', ['p-2', 'm-4'], { 'text-left': true, 'text-right': true })).toBe('p-2 m-4 text-right');
    });
    /**
     * Tests nested array handling:
     * - Deep array flattening
     * - Tailwind merge with nested structures
     */
    it('nested arrays', () => {
        expect((0, classnames_1.cn)(['foo', ['bar', 'baz']])).toBe('foo bar baz');
        expect((0, classnames_1.cn)(['p-4', ['p-2', 'text-center']])).toBe('p-2 text-center');
    });
    /**
     * Tests empty input handling:
     * - Empty strings, arrays, and objects
     * - Mixed empty and non-empty values
     */
    it('empty inputs', () => {
        expect((0, classnames_1.cn)('')).toBe('');
        expect((0, classnames_1.cn)([])).toBe('');
        expect((0, classnames_1.cn)({})).toBe('');
        expect((0, classnames_1.cn)('', [], {})).toBe('');
        expect((0, classnames_1.cn)('foo', '', 'bar')).toBe('foo bar');
    });
    /**
     * Tests number input handling:
     * - Truthy numbers converted to strings
     * - Zero treated as falsy
     */
    it('numbers as inputs', () => {
        expect((0, classnames_1.cn)(1)).toBe('1');
        expect((0, classnames_1.cn)(0)).toBe('');
        expect((0, classnames_1.cn)('foo', 1, 'bar')).toBe('foo 1 bar');
    });
    /**
     * Tests multiple object arguments:
     * - Object merging
     * - Tailwind conflict resolution across objects
     */
    it('multiple objects', () => {
        expect((0, classnames_1.cn)({ foo: true }, { bar: true })).toBe('foo bar');
        expect((0, classnames_1.cn)({ foo: true, bar: false }, { bar: true, baz: true })).toBe('foo bar baz');
        expect((0, classnames_1.cn)({ 'p-4': true }, { 'p-2': true })).toBe('p-2');
    });
    /**
     * Tests complex edge cases:
     * - Mixed falsy values
     * - Nested arrays with falsy values
     * - Multiple conflicting Tailwind classes
     */
    it('complex edge cases', () => {
        expect((0, classnames_1.cn)('foo', null, undefined, false, 'bar', 0, 1, '')).toBe('foo bar 1');
        expect((0, classnames_1.cn)(['foo', null, ['bar', undefined, 'baz']])).toBe('foo bar baz');
        expect((0, classnames_1.cn)('text-sm', { 'text-lg': false, 'text-xl': true }, 'text-2xl')).toBe('text-2xl');
    });
    /**
     * Tests important (!) modifier behavior:
     * - Important modifiers in objects
     * - Conflict resolution with important prefix
     */
    it('important modifier with objects', () => {
        expect((0, classnames_1.cn)({ '!font-medium': true }, { '!font-bold': true })).toBe('!font-bold');
        expect((0, classnames_1.cn)('font-normal', { '!font-bold': true })).toBe('font-normal !font-bold');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NuYW1lcy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xhc3NuYW1lcy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7R0FJRztBQUNILDZDQUFpQztBQUVqQyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQjs7Ozs7O09BTUc7SUFDSCxFQUFFLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxJQUFBLGVBQUUsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QixNQUFNLENBQUMsSUFBQSxlQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3hDLE1BQU0sQ0FBQyxJQUFBLGVBQUUsRUFBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBRTFDLE1BQU0sQ0FBQyxJQUFBLGVBQUUsRUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM5QixNQUFNLENBQUMsSUFBQSxlQUFFLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDekIsTUFBTSxDQUFDLElBQUEsZUFBRSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRTFCLE1BQU0sQ0FBQyxJQUFBLGVBQUUsRUFBQztZQUNSLEdBQUcsRUFBRSxJQUFJO1lBQ1QsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsSUFBSTtTQUNWLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNyQixDQUFDLENBQUMsQ0FBQTtJQUVGOzs7Ozs7O09BT0c7SUFDSCxFQUFFLENB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WyIvKipcbiAqIFRlc3Qgc3VpdGUgZm9yIHRoZSBjbGFzc25hbWVzIHV0aWxpdHkgZnVuY3Rpb25cbiAqIFRoaXMgdXRpbGl0eSBjb21iaW5lcyB0aGUgY2xhc3NuYW1lcyBsaWJyYXJ5IHdpdGggdGFpbHdpbmQtbWVyZ2VcbiAqIHRvIGhhbmRsZSBjb25kaXRpb25hbCBDU1MgY2xhc3NlcyBhbmQgbWVyZ2UgY29uZmxpY3RpbmcgVGFpbHdpbmQgY2xhc3Nlc1xuICovXG5pbXBvcnQgeyBjbiB9IGZyb20gJy4vY2xhc3NuYW1lcydcblxuZGVzY3JpYmUoJ2NsYXNzbmFtZXMnLCAoKSA9PiB7XG4gIC8qKlxuICAgKiBUZXN0cyBiYXNpYyBjbGFzc25hbWVzIGxpYnJhcnkgZmVhdHVyZXM6XG4gICAqIC0gU3RyaW5nIGNvbmNhdGVuYXRpb25cbiAgICogLSBBcnJheSBoYW5kbGluZ1xuICAgKiAtIEZhbHN5IHZhbHVlIGZpbHRlcmluZ1xuICAgKiAtIE9iamVjdC1iYXNlZCBjb25kaXRpb25hbCBjbGFzc2VzXG4gICAqL1xuICBpdCgnY2xhc3NuYW1lcyBsaWJzIGZlYXR1cmUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNuKCdmb28nKSkudG9CZSgnZm9vJylcbiAgICBleHBlY3QoY24oJ2ZvbycsICdiYXInKSkudG9CZSgnZm9vIGJhcicpXG4gICAgZXhwZWN0KGNuKFsnZm9vJywgJ2JhciddKSkudG9CZSgnZm9vIGJhcicpXG5cbiAgICBleHBlY3QoY24odW5kZWZpbmVkKSkudG9CZSgnJylcbiAgICBleHBlY3QoY24obnVsbCkpLnRvQmUoJycpXG4gICAgZXhwZWN0KGNuKGZhbHNlKSkudG9CZSgnJylcblxuICAgIGV4cGVjdChjbih7XG4gICAgICBmb286IHRydWUsXG4gICAgICBiYXI6IGZhbHNlLFxuICAgICAgYmF6OiB0cnVlLFxuICAgIH0pKS50b0JlKCdmb28gYmF6JylcbiAgfSlcblxuICAvKipcbiAgICogVGVzdHMgdGFpbHdpbmQtbWVyZ2UgZnVuY3Rpb25hbGl0eTpcbiAgICogLSBDb25mbGljdGluZyBjbGFzcyByZXNvbHV0aW9uIChsYXN0IG9uZSB3aW5zKVxuICAgKiAtIE1vZGlmaWVyIGhhbmRsaW5nIChob3ZlciwgZm9jdXMsIGV0Yy4pXG4gICAqIC0gSW1wb3J0YW50IHByZWZpeCAoISlcbiAgICogLSBDdXN0b20gY29sb3IgY2xhc3Nlc1xuICAgKiAtIEFyYml0cmFyeSB2YWx1ZXNcbiAgICovXG4gIGl0KCd0YWlsd2luZC1tZXJnZScsICgpID0+IHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSB0YWlsd2luZGNzcy9jbGFzc25hbWVzLW9yZGVyICovXG4gICAgZXhwZWN0KGNuKCdwLTAnKSkudG9CZSgncC0wJylcbiAgICBleHBlY3QoY24oJ3RleHQtcmlnaHQgdGV4dC1jZW50ZXIgdGV4dC1sZWZ0JykpLnRvQmUoJ3RleHQtbGVmdCcpXG4gICAgZXhwZWN0KGNuKCdwbC00IHAtOCcpKS50b0JlKCdwLTgnKVxuICAgIGV4cGVjdChjbignbS1bMnB4XSBtLVs0cHhdJykpLnRvQmUoJ20tWzRweF0nKVxuICAgIGV4cGVjdChjbignbS0xIG0tWzRweF0nKSkudG9CZSgnbS1bNHB4XScpXG4gICAgZXhwZWN0KGNuKCdvdmVyZmxvdy14LWF1dG8gaG92ZXI6b3ZlcmZsb3cteC1oaWRkZW4gb3ZlcmZsb3cteC1zY3JvbGwnKSkudG9CZShcbiAgICAgICdob3ZlcjpvdmVyZmxvdy14LWhpZGRlbiBvdmVyZmxvdy14LXNjcm9sbCcsXG4gICAgKVxuICAgIGV4cGVjdChjbignaC0xMCBoLW1pbicpKS50b0JlKCdoLW1pbicpXG4gICAgZXhwZWN0KGNuKCdiZy1ncmV5LTUgYmctaG90cGluaycpKS50b0JlKCdiZy1ob3RwaW5rJylcblxuICAgIGV4cGVjdChjbignaG92ZXI6YmxvY2sgaG92ZXI6aW5saW5lJykpLnRvQmUoJ2hvdmVyOmlubGluZScpXG5cbiAgICBleHBlY3QoY24oJ2ZvbnQtbWVkaXVtICFmb250LWJvbGQnKSkudG9CZSgnZm9udC1tZWRpdW0gIWZvbnQtYm9sZCcpXG4gICAgZXhwZWN0KGNuKCchZm9udC1tZWRpdW0gIWZvbnQtYm9sZCcpKS50b0JlKCchZm9udC1ib2xkJylcblxuICAgIGV4cGVjdChjbigndGV4dC1ncmF5LTEwMCB0ZXh0LXByaW1hcnktMjAwJykpLnRvQmUoJ3RleHQtcHJpbWFyeS0yMDAnKVxuICAgIGV4cGVjdChjbigndGV4dC1zb21lLXVua25vd24tY29sb3IgdGV4dC1jb21wb25lbnRzLWlucHV0LWJnLWRpc2FibGVkIHRleHQtcHJpbWFyeS0yMDAnKSkudG9CZSgndGV4dC1wcmltYXJ5LTIwMCcpXG4gICAgZXhwZWN0KGNuKCdiZy1zb21lLXVua25vd24tY29sb3IgYmctY29tcG9uZW50cy1pbnB1dC1iZy1kaXNhYmxlZCBiZy1wcmltYXJ5LTIwMCcpKS50b0JlKCdiZy1wcmltYXJ5LTIwMCcpXG5cbiAgICBleHBlY3QoY24oJ2JvcmRlci10IGJvcmRlci13aGl0ZS8xMCcpKS50b0JlKCdib3JkZXItdCBib3JkZXItd2hpdGUvMTAnKVxuICAgIGV4cGVjdChjbignYm9yZGVyLXQgYm9yZGVyLXdoaXRlJykpLnRvQmUoJ2JvcmRlci10IGJvcmRlci13aGl0ZScpXG4gICAgZXhwZWN0KGNuKCd0ZXh0LTMuNXhsIHRleHQtYmxhY2snKSkudG9CZSgndGV4dC0zLjV4bCB0ZXh0LWJsYWNrJylcbiAgfSlcblxuICAvKipcbiAgICogVGVzdHMgdGhlIGludGVncmF0aW9uIG9mIGNsYXNzbmFtZXMgYW5kIHRhaWx3aW5kLW1lcmdlOlxuICAgKiAtIE9iamVjdC1iYXNlZCBjb25kaXRpb25hbCBjbGFzc2VzIHdpdGggVGFpbHdpbmQgY29uZmxpY3QgcmVzb2x1dGlvblxuICAgKi9cbiAgaXQoJ2NsYXNzbmFtZXMgY29tYmluZWQgd2l0aCB0YWlsd2luZC1tZXJnZScsICgpID0+IHtcbiAgICBleHBlY3QoY24oJ3RleHQtcmlnaHQnLCB7XG4gICAgICAndGV4dC1jZW50ZXInOiB0cnVlLFxuICAgIH0pKS50b0JlKCd0ZXh0LWNlbnRlcicpXG5cbiAgICBleHBlY3QoY24oJ3RleHQtcmlnaHQnLCB7XG4gICAgICAndGV4dC1jZW50ZXInOiBmYWxzZSxcbiAgICB9KSkudG9CZSgndGV4dC1yaWdodCcpXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3RzIGhhbmRsaW5nIG9mIG11bHRpcGxlIG1peGVkIGFyZ3VtZW50IHR5cGVzOlxuICAgKiAtIFN0cmluZ3MsIGFycmF5cywgYW5kIG9iamVjdHMgaW4gYSBzaW5nbGUgY2FsbFxuICAgKiAtIFRhaWx3aW5kIG1lcmdlIHdvcmtpbmcgYWNyb3NzIGRpZmZlcmVudCBhcmd1bWVudCB0eXBlc1xuICAgKi9cbiAgaXQoJ211bHRpcGxlIG1peGVkIGFyZ3VtZW50IHR5cGVzJywgKCkgPT4ge1xuICAgIGV4cGVjdChjbignZm9vJywgWydiYXInLCAnYmF6J10sIHsgcXV4OiB0cnVlLCBxdXV4OiBmYWxzZSB9KSkudG9CZSgnZm9vIGJhciBiYXogcXV4JylcbiAgICBleHBlY3QoY24oJ3AtNCcsIFsncC0yJywgJ20tNCddLCB7ICd0ZXh0LWxlZnQnOiB0cnVlLCAndGV4dC1yaWdodCc6IHRydWUgfSkpLnRvQmUoJ3AtMiBtLTQgdGV4dC1yaWdodCcpXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3RzIG5lc3RlZCBhcnJheSBoYW5kbGluZzpcbiAgICogLSBEZWVwIGFycmF5IGZsYXR0ZW5pbmdcbiAgICogLSBUYWlsd2luZCBtZXJnZSB3aXRoIG5lc3RlZCBzdHJ1Y3R1cmVzXG4gICAqL1xuICBpdCgnbmVzdGVkIGFycmF5cycsICgpID0+IHtcbiAgICBleHBlY3QoY24oWydmb28nLCBbJ2JhcicsICdiYXonXV0pKS50b0JlKCdmb28gYmFyIGJheicpXG4gICAgZXhwZWN0KGNuKFsncC00JywgWydwLTInLCAndGV4dC1jZW50ZXInXV0pKS50b0JlKCdwLTIgdGV4dC1jZW50ZXInKVxuICB9KVxuXG4gIC8qKlxuICAgKiBUZXN0cyBlbXB0eSBpbnB1dCBoYW5kbGluZzpcbiAgICogLSBFbXB0eSBzdHJpbmdzLCBhcnJheXMsIGFuZCBvYmplY3RzXG4gICAqIC0gTWl4ZWQgZW1wdHkgYW5kIG5vbi1lbXB0eSB2YWx1ZXNcbiAgICovXG4gIGl0KCdlbXB0eSBpbnB1dHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNuKCcnKSkudG9CZSgnJylcbiAgICBleHBlY3QoY24oW10pKS50b0JlKCcnKVxuICAgIGV4cGVjdChjbih7fSkpLnRvQmUoJycpXG4gICAgZXhwZWN0KGNuKCcnLCBbXSwge30pKS50b0JlKCcnKVxuICAgIGV4cGVjdChjbignZm9vJywgJycsICdiYXInKSkudG9CZSgnZm9vIGJhcicpXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3RzIG51bWJlciBpbnB1dCBoYW5kbGluZzpcbiAgICogLSBUcnV0aHkgbnVtYmVycyBjb252ZXJ0ZWQgdG8gc3RyaW5nc1xuICAgKiAtIFplcm8gdHJlYXRlZCBhcyBmYWxzeVxuICAgKi9cbiAgaXQoJ251bWJlcnMgYXMgaW5wdXRzJywgKCkgPT4ge1xuICAgIGV4cGVjdChjbigxKSkudG9CZSgnMScpXG4gICAgZXhwZWN0KGNuKDApKS50b0JlKCcnKVxuICAgIGV4cGVjdChjbignZm9vJywgMSwgJ2JhcicpKS50b0JlKCdmb28gMSBiYXInKVxuICB9KVxuXG4gIC8qKlxuICAgKiBUZXN0cyBtdWx0aXBsZSBvYmplY3QgYXJndW1lbnRzOlxuICAgKiAtIE9iamVjdCBtZXJnaW5nXG4gICAqIC0gVGFpbHdpbmQgY29uZmxpY3QgcmVzb2x1dGlvbiBhY3Jvc3Mgb2JqZWN0c1xuICAgKi9cbiAgaXQoJ211bHRpcGxlIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNuKHsgZm9vOiB0cnVlIH0sIHsgYmFyOiB0cnVlIH0pKS50b0JlKCdmb28gYmFyJylcbiAgICBleHBlY3QoY24oeyBmb286IHRydWUsIGJhcjogZmFsc2UgfSwgeyBiYXI6IHRydWUsIGJhejogdHJ1ZSB9KSkudG9CZSgnZm9vIGJhciBiYXonKVxuICAgIGV4cGVjdChjbih7ICdwLTQnOiB0cnVlIH0sIHsgJ3AtMic6IHRydWUgfSkpLnRvQmUoJ3AtMicpXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3RzIGNvbXBsZXggZWRnZSBjYXNlczpcbiAgICogLSBNaXhlZCBmYWxzeSB2YWx1ZXNcbiAgICogLSBOZXN0ZWQgYXJyYXlzIHdpdGggZmFsc3kgdmFsdWVzXG4gICAqIC0gTXVsdGlwbGUgY29uZmxpY3RpbmcgVGFpbHdpbmQgY2xhc3Nlc1xuICAgKi9cbiAgaXQoJ2NvbXBsZXggZWRnZSBjYXNlcycsICgpID0+IHtcbiAgICBleHBlY3QoY24oJ2ZvbycsIG51bGwsIHVuZGVmaW5lZCwgZmFsc2UsICdiYXInLCAwLCAxLCAnJykpLnRvQmUoJ2ZvbyBiYXIgMScpXG4gICAgZXhwZWN0KGNuKFsnZm9vJywgbnVsbCwgWydiYXInLCB1bmRlZmluZWQsICdiYXonXV0pKS50b0JlKCdmb28gYmFyIGJheicpXG4gICAgZXhwZWN0KGNuKCd0ZXh0LXNtJywgeyAndGV4dC1sZyc6IGZhbHNlLCAndGV4dC14bCc6IHRydWUgfSwgJ3RleHQtMnhsJykpLnRvQmUoJ3RleHQtMnhsJylcbiAgfSlcblxuICAvKipcbiAgICogVGVzdHMgaW1wb3J0YW50ICghKSBtb2RpZmllciBiZWhhdmlvcjpcbiAgICogLSBJbXBvcnRhbnQgbW9kaWZpZXJzIGluIG9iamVjdHNcbiAgICogLSBDb25mbGljdCByZXNvbHV0aW9uIHdpdGggaW1wb3J0YW50IHByZWZpeFxuICAgKi9cbiAgaXQoJ2ltcG9ydGFudCBtb2RpZmllciB3aXRoIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNuKHsgJyFmb250LW1lZGl1bSc6IHRydWUgfSwgeyAnIWZvbnQtYm9sZCc6IHRydWUgfSkpLnRvQmUoJyFmb250LWJvbGQnKVxuICAgIGV4cGVjdChjbignZm9udC1ub3JtYWwnLCB7ICchZm9udC1ib2xkJzogdHJ1ZSB9KSkudG9CZSgnZm9udC1ub3JtYWwgIWZvbnQtYm9sZCcpXG4gIH0pXG59KVxuIl19