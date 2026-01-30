"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessageBlockNode = void 0;
exports.$createErrorMessageBlockNode = $createErrorMessageBlockNode;
exports.$isErrorMessageBlockNode = $isErrorMessageBlockNode;
const lexical_1 = require("lexical");
const component_1 = require("./component");
class ErrorMessageBlockNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'error-message-block';
    }
    static clone(node) {
        return new ErrorMessageBlockNode(node.getKey());
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
        const node = $createErrorMessageBlockNode();
        return node;
    }
    exportJSON() {
        return {
            type: 'error-message-block',
            version: 1,
        };
    }
    getTextContent() {
        return '{{#error_message#}}';
    }
}
exports.ErrorMessageBlockNode = ErrorMessageBlockNode;
function $createErrorMessageBlockNode() {
    return new ErrorMessageBlockNode();
}
function $isErrorMessageBlockNode(node) {
    return node instanceof ErrorMessageBlockNode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQTBEQSxvRUFFQztBQUVELDREQUlDO0FBakVELHFDQUF1QztBQUN2QywyQ0FBb0Q7QUFJcEQsTUFBYSxxQkFBc0IsU0FBUSx1QkFBZ0M7SUFDekUsTUFBTSxDQUFDLE9BQU87UUFDWixPQUFPLHFCQUFxQixDQUFBO0lBQzlCLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQTJCO1FBQ3RDLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUNqRCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELFlBQVksR0FBYTtRQUN2QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDWixDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDekMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUNoRSxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sQ0FDTCxDQUFDLG1CQUEwQixDQUN6QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFDdkIsQ0FDSCxDQUFBO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVO1FBQ2YsTUFBTSxJQUFJLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQTtRQUUzQyxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxVQUFVO1FBQ1IsT0FBTztZQUNMLElBQUksRUFBRSxxQkFBcUI7WUFDM0IsT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFBO0lBQ0gsQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLHFCQUFxQixDQUFBO0lBQzlCLENBQUM7Q0FDRjtBQW5ERCxzREFtREM7QUFDRCxTQUFnQiw0QkFBNEI7SUFDMUMsT0FBTyxJQUFJLHFCQUFxQixFQUFFLENBQUE7QUFDcEMsQ0FBQztBQUVELFNBQWdCLHdCQUF3QixDQUN0QyxJQUE0RDtJQUU1RCxPQUFPLElBQUksWUFBWSxxQkFBcUIsQ0FBQTtBQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBMZXhpY2FsTm9kZSwgTm9kZUtleSwgU2VyaWFsaXplZExleGljYWxOb2RlIH0gZnJvbSAnbGV4aWNhbCdcbmltcG9ydCB7IERlY29yYXRvck5vZGUgfSBmcm9tICdsZXhpY2FsJ1xuaW1wb3J0IEVycm9yTWVzc2FnZUJsb2NrQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50J1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkTm9kZSA9IFNlcmlhbGl6ZWRMZXhpY2FsTm9kZVxuXG5leHBvcnQgY2xhc3MgRXJyb3JNZXNzYWdlQmxvY2tOb2RlIGV4dGVuZHMgRGVjb3JhdG9yTm9kZTxSZWFjdC5KU1guRWxlbWVudD4ge1xuICBzdGF0aWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZXJyb3ItbWVzc2FnZS1ibG9jaydcbiAgfVxuXG4gIHN0YXRpYyBjbG9uZShub2RlOiBFcnJvck1lc3NhZ2VCbG9ja05vZGUpOiBFcnJvck1lc3NhZ2VCbG9ja05vZGUge1xuICAgIHJldHVybiBuZXcgRXJyb3JNZXNzYWdlQmxvY2tOb2RlKG5vZGUuZ2V0S2V5KCkpXG4gIH1cblxuICBpc0lubGluZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY29uc3RydWN0b3Ioa2V5PzogTm9kZUtleSkge1xuICAgIHN1cGVyKGtleSlcbiAgfVxuXG4gIGNyZWF0ZURPTSgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWZsZXgnLCAnaXRlbXMtY2VudGVyJywgJ2FsaWduLW1pZGRsZScpXG4gICAgcmV0dXJuIGRpdlxuICB9XG5cbiAgdXBkYXRlRE9NKCk6IGZhbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGRlY29yYXRlKCk6IFJlYWN0LkpTWC5FbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgPEVycm9yTWVzc2FnZUJsb2NrQ29tcG9uZW50XG4gICAgICAgIG5vZGVLZXk9e3RoaXMuZ2V0S2V5KCl9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIHN0YXRpYyBpbXBvcnRKU09OKCk6IEVycm9yTWVzc2FnZUJsb2NrTm9kZSB7XG4gICAgY29uc3Qgbm9kZSA9ICRjcmVhdGVFcnJvck1lc3NhZ2VCbG9ja05vZGUoKVxuXG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gIGV4cG9ydEpTT04oKTogU2VyaWFsaXplZE5vZGUge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZXJyb3ItbWVzc2FnZS1ibG9jaycsXG4gICAgICB2ZXJzaW9uOiAxLFxuICAgIH1cbiAgfVxuXG4gIGdldFRleHRDb250ZW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICd7eyNlcnJvcl9tZXNzYWdlI319J1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gJGNyZWF0ZUVycm9yTWVzc2FnZUJsb2NrTm9kZSgpOiBFcnJvck1lc3NhZ2VCbG9ja05vZGUge1xuICByZXR1cm4gbmV3IEVycm9yTWVzc2FnZUJsb2NrTm9kZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiAkaXNFcnJvck1lc3NhZ2VCbG9ja05vZGUoXG4gIG5vZGU6IEVycm9yTWVzc2FnZUJsb2NrTm9kZSB8IExleGljYWxOb2RlIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVycm9yTWVzc2FnZUJsb2NrTm9kZVxufVxuIl19