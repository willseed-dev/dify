type IProps = {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    wrapperClassName?: string;
    minHeight?: number;
    maxHeight?: number;
    autoFocus?: boolean;
    controlFocus?: number;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};
declare const AutoHeightTextarea: {
    ({ ref: outerRef, value, onChange, placeholder, className, wrapperClassName, minHeight, maxHeight, autoFocus, controlFocus, onKeyDown, onKeyUp, }: IProps & {
        ref?: React.RefObject<HTMLTextAreaElement>;
    }): any;
    displayName: string;
};
export default AutoHeightTextarea;
