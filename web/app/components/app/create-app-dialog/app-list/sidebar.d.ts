export declare enum AppCategories {
    RECOMMENDED = "Recommended"
}
type SidebarProps = {
    current: AppCategories | string;
    categories: string[];
    onClick?: (category: AppCategories | string) => void;
    onCreateFromBlank?: () => void;
};
export default function Sidebar({ current, categories, onClick, onCreateFromBlank }: SidebarProps): any;
type AppCategoryLabelProps = {
    category: AppCategories | string;
    className?: string;
};
export declare function AppCategoryLabel({ category, className }: AppCategoryLabelProps): any;
export {};
