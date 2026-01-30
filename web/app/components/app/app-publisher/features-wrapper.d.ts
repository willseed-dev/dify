import type { AppPublisherProps } from '@/app/components/app/app-publisher';
import type { ModelAndParameter } from '@/app/components/app/configuration/debug/types';
type Props = Omit<AppPublisherProps, 'onPublish'> & {
    onPublish?: (modelAndParameter?: ModelAndParameter, features?: any) => Promise<any> | any;
    publishedConfig?: any;
    resetAppConfig?: () => void;
};
declare const FeaturesWrappedAppPublisher: (props: Props) => any;
export default FeaturesWrappedAppPublisher;
