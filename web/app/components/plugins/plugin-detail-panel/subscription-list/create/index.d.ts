export declare enum CreateButtonType {
    FULL_BUTTON = "full-button",
    ICON_BUTTON = "icon-button"
}
type Props = {
    className?: string;
    buttonType?: CreateButtonType;
    shape?: 'square' | 'circle';
};
export declare const DEFAULT_METHOD = "default";
export declare const CreateSubscriptionButton: ({ buttonType, shape }: Props) => any;
export {};
