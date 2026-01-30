import type { SearchParams } from 'nuqs';
export declare function HydrateQueryClient({ searchParams, children, }: {
    searchParams: Promise<SearchParams> | undefined;
    children: React.ReactNode;
}): Promise<any>;
