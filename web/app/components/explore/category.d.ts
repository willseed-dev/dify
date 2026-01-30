import type { AppCategory } from '@/models/explore';
export type ICategoryProps = {
    className?: string;
    list: AppCategory[];
    value: string;
    onChange: (value: AppCategory | string) => void;
    /**
     * default value for search param 'category' in en
     */
    allCategoriesEn: string;
};
declare const _default: any;
export default _default;
