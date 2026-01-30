import type { FC } from 'react';
import { ModelFeatureEnum } from '../declarations';
type FeatureIconProps = {
    feature: ModelFeatureEnum;
    className?: string;
    showFeaturesLabel?: boolean;
};
declare const FeatureIcon: FC<FeatureIconProps>;
export default FeatureIcon;
