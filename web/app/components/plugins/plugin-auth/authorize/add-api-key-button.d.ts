import type { PluginPayload } from '../types';
import type { ButtonProps } from '@/app/components/base/button';
import type { FormSchema } from '@/app/components/base/form/types';
export type AddApiKeyButtonProps = {
    pluginPayload: PluginPayload;
    buttonVariant?: ButtonProps['variant'];
    buttonText?: string;
    disabled?: boolean;
    onUpdate?: () => void;
    formSchemas?: FormSchema[];
};
declare const _default: any;
export default _default;
