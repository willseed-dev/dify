import type { App } from '@/types/app';
type AccessControlProps = {
    app: App;
    onClose: () => void;
    onConfirm?: () => void;
};
export default function AccessControl(props: AccessControlProps): any;
export {};
