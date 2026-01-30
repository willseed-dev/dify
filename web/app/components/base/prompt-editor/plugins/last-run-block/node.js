"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastRunBlockNode = void 0;
exports.$createLastRunBlockNode = $createLastRunBlockNode;
exports.$isLastRunBlockNode = $isLastRunBlockNode;
const lexical_1 = require("lexical");
const component_1 = require("./component");
class LastRunBlockNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'last-run-block';
    }
    static clone(node) {
        return new LastRunBlockNode(node.getKey());
    }
    isInline() {
        return true;
    }
    constructor(key) {
        super(key);
    }
    createDOM() {
        const div = document.createElement('div');
        div.classList.add('inline-flex', 'items-center', 'align-middle');
        return div;
    }
    updateDOM() {
        return false;
    }
    decorate() {
        return (<component_1.default nodeKey={this.getKey()}/>);
    }
    static importJSON() {
        const node = $createLastRunBlockNode();
        return node;
    }
    exportJSON() {
        return {
            type: 'last-run-block',
            version: 1,
        };
    }
    getTextContent() {
        return '{{#last_run#}}';
    }
}
exports.LastRunBlockNode = LastRunBlockNode;
function $createLastRunBlockNode() {
    return new LastRunBlockNode();
}
function $isLastRunBlockNode(node) {
    return node instanceof LastRunBlockNode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQTBEQSwwREFFQztBQUVELGtEQUlDO0FBakVELHFDQUF1QztBQUN2QywyQ0FBK0M7QUFJL0MsTUFBYSxnQkFBaUIsU0FBUSx1QkFBZ0M7SUFDcEUsTUFBTSxDQUFDLE9BQU87UUFDWixPQUFPLGdCQUFnQixDQUFBO0lBQ3pCLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQXNCO1FBQ2pDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELFlBQVksR0FBYTtRQUN2QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDWixDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDekMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUNoRSxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sQ0FDTCxDQUFDLG1CQUFxQixDQUNwQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFDdkIsQ0FDSCxDQUFBO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVO1FBQ2YsTUFBTSxJQUFJLEdBQUcsdUJBQXVCLEVBQUUsQ0FBQTtRQUV0QyxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxVQUFVO1FBQ1IsT0FBTztZQUNMLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFBO0lBQ0gsQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLGdCQUFnQixDQUFBO0lBQ3pCLENBQUM7Q0FDRjtBQW5ERCw0Q0FtREM7QUFDRCxTQUFnQix1QkFBdUI7SUFDckMsT0FBTyxJQUFJLGdCQUFnQixFQUFFLENBQUE7QUFDL0IsQ0FBQztBQUVELFNBQWdCLG1CQUFtQixDQUNqQyxJQUF1RDtJQUV2RCxPQUFPLElBQUksWUFBWSxnQkFBZ0IsQ0FBQTtBQUN6QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBMZXhpY2FsTm9kZSwgTm9kZUtleSwgU2VyaWFsaXplZExleGljYWxOb2RlIH0gZnJvbSAnbGV4aWNhbCdcbmltcG9ydCB7IERlY29yYXRvck5vZGUgfSBmcm9tICdsZXhpY2FsJ1xuaW1wb3J0IExhc3RSdW5CbG9ja0NvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudCdcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZE5vZGUgPSBTZXJpYWxpemVkTGV4aWNhbE5vZGVcblxuZXhwb3J0IGNsYXNzIExhc3RSdW5CbG9ja05vZGUgZXh0ZW5kcyBEZWNvcmF0b3JOb2RlPFJlYWN0LkpTWC5FbGVtZW50PiB7XG4gIHN0YXRpYyBnZXRUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdsYXN0LXJ1bi1ibG9jaydcbiAgfVxuXG4gIHN0YXRpYyBjbG9uZShub2RlOiBMYXN0UnVuQmxvY2tOb2RlKTogTGFzdFJ1bkJsb2NrTm9kZSB7XG4gICAgcmV0dXJuIG5ldyBMYXN0UnVuQmxvY2tOb2RlKG5vZGUuZ2V0S2V5KCkpXG4gIH1cblxuICBpc0lubGluZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY29uc3RydWN0b3Ioa2V5PzogTm9kZUtleSkge1xuICAgIHN1cGVyKGtleSlcbiAgfVxuXG4gIGNyZWF0ZURPTSgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWZsZXgnLCAnaXRlbXMtY2VudGVyJywgJ2FsaWduLW1pZGRsZScpXG4gICAgcmV0dXJuIGRpdlxuICB9XG5cbiAgdXBkYXRlRE9NKCk6IGZhbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGRlY29yYXRlKCk6IFJlYWN0LkpTWC5FbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgPExhc3RSdW5CbG9ja0NvbXBvbmVudFxuICAgICAgICBub2RlS2V5PXt0aGlzLmdldEtleSgpfVxuICAgICAgLz5cbiAgICApXG4gIH1cblxuICBzdGF0aWMgaW1wb3J0SlNPTigpOiBMYXN0UnVuQmxvY2tOb2RlIHtcbiAgICBjb25zdCBub2RlID0gJGNyZWF0ZUxhc3RSdW5CbG9ja05vZGUoKVxuXG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gIGV4cG9ydEpTT04oKTogU2VyaWFsaXplZE5vZGUge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnbGFzdC1ydW4tYmxvY2snLFxuICAgICAgdmVyc2lvbjogMSxcbiAgICB9XG4gIH1cblxuICBnZXRUZXh0Q29udGVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAne3sjbGFzdF9ydW4jfX0nXG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiAkY3JlYXRlTGFzdFJ1bkJsb2NrTm9kZSgpOiBMYXN0UnVuQmxvY2tOb2RlIHtcbiAgcmV0dXJuIG5ldyBMYXN0UnVuQmxvY2tOb2RlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uICRpc0xhc3RSdW5CbG9ja05vZGUoXG4gIG5vZGU6IExhc3RSdW5CbG9ja05vZGUgfCBMZXhpY2FsTm9kZSB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBMYXN0UnVuQmxvY2tOb2RlXG59XG4iXX0=