import type { PluginPayload } from '../types';
import type { FormSchema } from '@/app/components/base/form/types';
export type ApiKeyModalProps = {
    pluginPayload: PluginPayload;
    onClose?: () => void;
    editValues?: Record<string, any>;
    onRemove?: () => void;
    disabled?: boolean;
    onUpdate?: () => void;
    formSchemas?: FormSchema[];
};
declare const _default: any;
export default _default;
