type Props = {
    onCancel: () => void;
    onJustDowngrade: () => void;
    onExcludeAndDowngrade: () => void;
};
declare const DowngradeWarningModal: ({ onCancel, onJustDowngrade, onExcludeAndDowngrade, }: Props) => any;
export default DowngradeWarningModal;
