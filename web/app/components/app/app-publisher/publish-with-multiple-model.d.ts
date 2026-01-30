import type { FC } from 'react';
import type { ModelAndParameter } from '../configuration/debug/types';
type PublishWithMultipleModelProps = {
    multipleModelConfigs: ModelAndParameter[];
    onSelect: (v: ModelAndParameter) => void;
};
declare const PublishWithMultipleModel: FC<PublishWithMultipleModelProps>;
export default PublishWithMultipleModel;
