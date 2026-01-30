import type { FC } from 'react';
import { GeneratorType } from '@/app/components/app/configuration/config/automatic/types';
type CurrentBlockComponentProps = {
    nodeKey: string;
    generatorType: GeneratorType;
};
declare const CurrentBlockComponent: FC<CurrentBlockComponentProps>;
export default CurrentBlockComponent;
