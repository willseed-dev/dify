export type HtmlContentProps = {
    open?: boolean;
    onClose?: () => void;
    onClick?: () => void;
};
type IPopover = {
    className?: string;
    htmlContent: React.ReactNode;
    popupClassName?: string;
    trigger?: 'click' | 'hover';
    position?: 'bottom' | 'br' | 'bl';
    btnElement?: string | React.ReactNode;
    btnClassName?: string | ((open: boolean) => string);
    manualClose?: boolean;
    disabled?: boolean;
};
export default function CustomPopover({ trigger, position, htmlContent, popupClassName, btnElement, className, btnClassName, manualClose, disabled, }: IPopover): any;
export {};
