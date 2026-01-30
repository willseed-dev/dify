import type { SortType } from '@/service/datasets';
export type DocumentListQuery = {
    page: number;
    limit: number;
    keyword: string;
    status: string;
    sort: SortType;
};
declare function useDocumentListQueryState(): any;
export default useDocumentListQueryState;
