export type IItem = {
    key: string;
    name: string;
};
type ICollapse = {
    title: string | undefined;
    items: IItem[];
    renderItem: (item: IItem) => React.ReactNode;
    onSelect?: (item: IItem) => void;
    wrapperClassName?: string;
};
declare const Collapse: ({ title, items, renderItem, onSelect, wrapperClassName, }: ICollapse) => any;
export default Collapse;
