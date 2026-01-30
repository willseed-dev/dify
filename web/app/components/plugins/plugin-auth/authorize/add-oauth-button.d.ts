import type { PluginPayload } from '../types';
import type { ButtonProps } from '@/app/components/base/button';
import type { FormSchema } from '@/app/components/base/form/types';
export type AddOAuthButtonProps = {
    pluginPayload: PluginPayload;
    buttonVariant?: ButtonProps['variant'];
    buttonText?: string;
    className?: string;
    buttonLeftClassName?: string;
    buttonRightClassName?: string;
    dividerClassName?: string;
    disabled?: boolean;
    onUpdate?: () => void;
    oAuthData?: {
        schema?: FormSchema[];
        is_oauth_custom_client_enabled?: boolean;
        is_system_oauth_params_exists?: boolean;
        client_params?: Record<string, any>;
        redirect_uri?: string;
    };
};
declare const _default: any;
export default _default;
