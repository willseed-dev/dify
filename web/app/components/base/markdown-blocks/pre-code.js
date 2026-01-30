"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview PreCode component for rendering <pre> tags in Markdown.
 * Extracted from the main markdown renderer for modularity.
 * This is a simple wrapper around the HTML <pre> element.
 */
const React = require("react");
const react_1 = require("react");
function PreCode(props) {
    const ref = (0, react_1.useRef)(null);
    return (<pre ref={ref}>
      <span className="copy-code-button">
      </span>
      {props.children}
    </pre>);
}
exports.default = PreCode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlLWNvZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmUtY29kZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ0gsK0JBQThCO0FBQzlCLGlDQUE4QjtBQUU5QixTQUFTLE9BQU8sQ0FBQyxLQUF3QjtJQUN2QyxNQUFNLEdBQUcsR0FBRyxJQUFBLGNBQU0sRUFBaUIsSUFBSSxDQUFDLENBQUE7SUFFeEMsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNaO01BQUEsQ0FBQyxJQUFJLENBQ0gsU0FBUyxDQUFDLGtCQUFrQixDQUU5QjtNQUFBLEVBQUUsSUFBSSxDQUNOO01BQUEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUNqQjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUM7QUFFRCxrQkFBZSxPQUFPLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUHJlQ29kZSBjb21wb25lbnQgZm9yIHJlbmRlcmluZyA8cHJlPiB0YWdzIGluIE1hcmtkb3duLlxuICogRXh0cmFjdGVkIGZyb20gdGhlIG1haW4gbWFya2Rvd24gcmVuZGVyZXIgZm9yIG1vZHVsYXJpdHkuXG4gKiBUaGlzIGlzIGEgc2ltcGxlIHdyYXBwZXIgYXJvdW5kIHRoZSBIVE1MIDxwcmU+IGVsZW1lbnQuXG4gKi9cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSAncmVhY3QnXG5cbmZ1bmN0aW9uIFByZUNvZGUocHJvcHM6IHsgY2hpbGRyZW46IGFueSB9KSB7XG4gIGNvbnN0IHJlZiA9IHVzZVJlZjxIVE1MUHJlRWxlbWVudD4obnVsbClcblxuICByZXR1cm4gKFxuICAgIDxwcmUgcmVmPXtyZWZ9PlxuICAgICAgPHNwYW5cbiAgICAgICAgY2xhc3NOYW1lPVwiY29weS1jb2RlLWJ1dHRvblwiXG4gICAgICA+XG4gICAgICA8L3NwYW4+XG4gICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgPC9wcmU+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJlQ29kZVxuIl19