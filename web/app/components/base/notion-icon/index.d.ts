import type { DataSourceNotionPage } from '@/models/common';
type IconTypes = 'workspace' | 'page';
type NotionIconProps = {
    type?: IconTypes;
    name?: string | null;
    className?: string;
    src?: string | null | DataSourceNotionPage['page_icon'];
};
declare const NotionIcon: ({ type, src, name, className, }: NotionIconProps) => any;
export default NotionIcon;
