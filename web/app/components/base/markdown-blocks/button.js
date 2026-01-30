"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const button_1 = require("@/app/components/base/button");
const context_1 = require("@/app/components/base/chat/chat/context");
const classnames_1 = require("@/utils/classnames");
const utils_1 = require("./utils");
const MarkdownButton = ({ node }) => {
    const { onSend } = (0, context_1.useChatContext)();
    const variant = node.properties.dataVariant;
    const message = node.properties.dataMessage;
    const link = node.properties.dataLink;
    const size = node.properties.dataSize;
    return (<button_1.default variant={variant} size={size} className={(0, classnames_1.cn)('!h-auto min-h-8 select-none whitespace-normal !px-3')} onClick={() => {
            if (link && (0, utils_1.isValidUrl)(link)) {
                window.open(link, '_blank');
                return;
            }
            if (!message)
                return;
            onSend?.(message);
        }}>
      <span className="text-[13px]">{node.children[0]?.value || ''}</span>
    </button_1.default>);
};
MarkdownButton.displayName = 'MarkdownButton';
exports.default = MarkdownButton;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnV0dG9uLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUFpRDtBQUNqRCxxRUFBd0U7QUFDeEUsbURBQXVDO0FBQ3ZDLG1DQUFvQztBQUVwQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFPLEVBQUUsRUFBRTtJQUN2QyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx3QkFBYyxHQUFFLENBQUE7SUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUE7SUFDM0MsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUE7SUFDM0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUE7SUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUE7SUFFckMsT0FBTyxDQUNMLENBQUMsZ0JBQU0sQ0FDTCxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDakIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ1gsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMscURBQXFELENBQUMsQ0FBQyxDQUNyRSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUU7WUFDWixJQUFJLElBQUksSUFBSSxJQUFBLGtCQUFVLEVBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0JBQzNCLE9BQU07WUFDUixDQUFDO1lBQ0QsSUFBSSxDQUFDLE9BQU87Z0JBQ1YsT0FBTTtZQUNSLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ25CLENBQUMsQ0FBQyxDQUVGO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FDckU7SUFBQSxFQUFFLGdCQUFNLENBQUMsQ0FDVixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0QsY0FBYyxDQUFDLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQTtBQUU3QyxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgeyB1c2VDaGF0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jaGF0L2NoYXQvY29udGV4dCdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgaXNWYWxpZFVybCB9IGZyb20gJy4vdXRpbHMnXG5cbmNvbnN0IE1hcmtkb3duQnV0dG9uID0gKHsgbm9kZSB9OiBhbnkpID0+IHtcbiAgY29uc3QgeyBvblNlbmQgfSA9IHVzZUNoYXRDb250ZXh0KClcbiAgY29uc3QgdmFyaWFudCA9IG5vZGUucHJvcGVydGllcy5kYXRhVmFyaWFudFxuICBjb25zdCBtZXNzYWdlID0gbm9kZS5wcm9wZXJ0aWVzLmRhdGFNZXNzYWdlXG4gIGNvbnN0IGxpbmsgPSBub2RlLnByb3BlcnRpZXMuZGF0YUxpbmtcbiAgY29uc3Qgc2l6ZSA9IG5vZGUucHJvcGVydGllcy5kYXRhU2l6ZVxuXG4gIHJldHVybiAoXG4gICAgPEJ1dHRvblxuICAgICAgdmFyaWFudD17dmFyaWFudH1cbiAgICAgIHNpemU9e3NpemV9XG4gICAgICBjbGFzc05hbWU9e2NuKCchaC1hdXRvIG1pbi1oLTggc2VsZWN0LW5vbmUgd2hpdGVzcGFjZS1ub3JtYWwgIXB4LTMnKX1cbiAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgaWYgKGxpbmsgJiYgaXNWYWxpZFVybChsaW5rKSkge1xuICAgICAgICAgIHdpbmRvdy5vcGVuKGxpbmssICdfYmxhbmsnKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmICghbWVzc2FnZSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgb25TZW5kPy4obWVzc2FnZSlcbiAgICAgIH19XG4gICAgPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTNweF1cIj57bm9kZS5jaGlsZHJlblswXT8udmFsdWUgfHwgJyd9PC9zcGFuPlxuICAgIDwvQnV0dG9uPlxuICApXG59XG5NYXJrZG93bkJ1dHRvbi5kaXNwbGF5TmFtZSA9ICdNYXJrZG93bkJ1dHRvbidcblxuZXhwb3J0IGRlZmF1bHQgTWFya2Rvd25CdXR0b25cbiJdfQ==