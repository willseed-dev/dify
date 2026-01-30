import type { FC } from 'react';
import type { Node } from '../types';
export declare const DatasetsDetailContext: any;
type DatasetsDetailProviderProps = {
    nodes: Node[];
    children: React.ReactNode;
};
declare const DatasetsDetailProvider: FC<DatasetsDetailProviderProps>;
export default DatasetsDetailProvider;
