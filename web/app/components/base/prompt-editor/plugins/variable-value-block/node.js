"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableValueBlockNode = void 0;
exports.$createVariableValueBlockNode = $createVariableValueBlockNode;
exports.$isVariableValueNodeBlock = $isVariableValueNodeBlock;
const lexical_1 = require("lexical");
class VariableValueBlockNode extends lexical_1.TextNode {
    static getType() {
        return 'variable-value-block';
    }
    static clone(node) {
        return new VariableValueBlockNode(node.__text, node.__key);
    }
    // constructor(text: string, key?: NodeKey) {
    //   super(text, key)
    // }
    createDOM(config) {
        const element = super.createDOM(config);
        element.classList.add('inline-flex', 'items-center', 'px-0.5', 'h-[22px]', 'text-text-accent', 'rounded-[5px]', 'align-middle');
        return element;
    }
    static importJSON(serializedNode) {
        const node = $createVariableValueBlockNode(serializedNode.text);
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }
    exportJSON() {
        return {
            detail: this.getDetail(),
            format: this.getFormat(),
            mode: this.getMode(),
            style: this.getStyle(),
            text: this.getTextContent(),
            type: 'variable-value-block',
            version: 1,
        };
    }
    canInsertTextBefore() {
        return false;
    }
}
exports.VariableValueBlockNode = VariableValueBlockNode;
function $createVariableValueBlockNode(text = '') {
    return (0, lexical_1.$applyNodeReplacement)(new VariableValueBlockNode(text));
}
function $isVariableValueNodeBlock(node) {
    return node instanceof VariableValueBlockNode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXVEQSxzRUFFQztBQUVELDhEQUlDO0FBMURELHFDQUdnQjtBQUVoQixNQUFhLHNCQUF1QixTQUFRLGtCQUFRO0lBQ2xELE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTyxzQkFBc0IsQ0FBQTtJQUMvQixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUE0QjtRQUN2QyxPQUFPLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDNUQsQ0FBQztJQUVELDZDQUE2QztJQUM3QyxxQkFBcUI7SUFDckIsSUFBSTtJQUVKLFNBQVMsQ0FBQyxNQUFvQjtRQUM1QixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3ZDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFDL0gsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBa0M7UUFDbEQsTUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9ELElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25DLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPO1lBQ0wsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDM0IsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUE7SUFDSCxDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztDQUNGO0FBM0NELHdEQTJDQztBQUVELFNBQWdCLDZCQUE2QixDQUFDLElBQUksR0FBRyxFQUFFO0lBQ3JELE9BQU8sSUFBQSwrQkFBcUIsRUFBQyxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7QUFDaEUsQ0FBQztBQUVELFNBQWdCLHlCQUF5QixDQUN2QyxJQUFvQztJQUVwQyxPQUFPLElBQUksWUFBWSxzQkFBc0IsQ0FBQTtBQUMvQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUge1xuICBFZGl0b3JDb25maWcsXG4gIExleGljYWxOb2RlLFxuICBTZXJpYWxpemVkVGV4dE5vZGUsXG59IGZyb20gJ2xleGljYWwnXG5pbXBvcnQge1xuICAkYXBwbHlOb2RlUmVwbGFjZW1lbnQsXG4gIFRleHROb2RlLFxufSBmcm9tICdsZXhpY2FsJ1xuXG5leHBvcnQgY2xhc3MgVmFyaWFibGVWYWx1ZUJsb2NrTm9kZSBleHRlbmRzIFRleHROb2RlIHtcbiAgc3RhdGljIGdldFR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ3ZhcmlhYmxlLXZhbHVlLWJsb2NrJ1xuICB9XG5cbiAgc3RhdGljIGNsb25lKG5vZGU6IFZhcmlhYmxlVmFsdWVCbG9ja05vZGUpOiBWYXJpYWJsZVZhbHVlQmxvY2tOb2RlIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlVmFsdWVCbG9ja05vZGUobm9kZS5fX3RleHQsIG5vZGUuX19rZXkpXG4gIH1cblxuICAvLyBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcsIGtleT86IE5vZGVLZXkpIHtcbiAgLy8gICBzdXBlcih0ZXh0LCBrZXkpXG4gIC8vIH1cblxuICBjcmVhdGVET00oY29uZmlnOiBFZGl0b3JDb25maWcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHN1cGVyLmNyZWF0ZURPTShjb25maWcpXG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtZmxleCcsICdpdGVtcy1jZW50ZXInLCAncHgtMC41JywgJ2gtWzIycHhdJywgJ3RleHQtdGV4dC1hY2NlbnQnLCAncm91bmRlZC1bNXB4XScsICdhbGlnbi1taWRkbGUnKVxuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICBzdGF0aWMgaW1wb3J0SlNPTihzZXJpYWxpemVkTm9kZTogU2VyaWFsaXplZFRleHROb2RlKTogVGV4dE5vZGUge1xuICAgIGNvbnN0IG5vZGUgPSAkY3JlYXRlVmFyaWFibGVWYWx1ZUJsb2NrTm9kZShzZXJpYWxpemVkTm9kZS50ZXh0KVxuICAgIG5vZGUuc2V0Rm9ybWF0KHNlcmlhbGl6ZWROb2RlLmZvcm1hdClcbiAgICBub2RlLnNldERldGFpbChzZXJpYWxpemVkTm9kZS5kZXRhaWwpXG4gICAgbm9kZS5zZXRNb2RlKHNlcmlhbGl6ZWROb2RlLm1vZGUpXG4gICAgbm9kZS5zZXRTdHlsZShzZXJpYWxpemVkTm9kZS5zdHlsZSlcbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgZXhwb3J0SlNPTigpOiBTZXJpYWxpemVkVGV4dE5vZGUge1xuICAgIHJldHVybiB7XG4gICAgICBkZXRhaWw6IHRoaXMuZ2V0RGV0YWlsKCksXG4gICAgICBmb3JtYXQ6IHRoaXMuZ2V0Rm9ybWF0KCksXG4gICAgICBtb2RlOiB0aGlzLmdldE1vZGUoKSxcbiAgICAgIHN0eWxlOiB0aGlzLmdldFN0eWxlKCksXG4gICAgICB0ZXh0OiB0aGlzLmdldFRleHRDb250ZW50KCksXG4gICAgICB0eXBlOiAndmFyaWFibGUtdmFsdWUtYmxvY2snLFxuICAgICAgdmVyc2lvbjogMSxcbiAgICB9XG4gIH1cblxuICBjYW5JbnNlcnRUZXh0QmVmb3JlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiAkY3JlYXRlVmFyaWFibGVWYWx1ZUJsb2NrTm9kZSh0ZXh0ID0gJycpOiBWYXJpYWJsZVZhbHVlQmxvY2tOb2RlIHtcbiAgcmV0dXJuICRhcHBseU5vZGVSZXBsYWNlbWVudChuZXcgVmFyaWFibGVWYWx1ZUJsb2NrTm9kZSh0ZXh0KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uICRpc1ZhcmlhYmxlVmFsdWVOb2RlQmxvY2soXG4gIG5vZGU6IExleGljYWxOb2RlIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IG5vZGUgaXMgVmFyaWFibGVWYWx1ZUJsb2NrTm9kZSB7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgVmFyaWFibGVWYWx1ZUJsb2NrTm9kZVxufVxuIl19