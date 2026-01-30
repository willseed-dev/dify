import type { FC } from 'react';
import type { CitationItem } from '../type';
export type Resources = {
    documentId: string;
    documentName: string;
    dataSourceType: string;
    sources: CitationItem[];
};
type CitationProps = {
    data: CitationItem[];
    showHitInfo?: boolean;
    containerClassName?: string;
};
declare const Citation: FC<CitationProps>;
export default Citation;
