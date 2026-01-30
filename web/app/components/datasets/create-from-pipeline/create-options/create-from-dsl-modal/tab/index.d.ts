import { CreateFromDSLModalTab } from '@/app/components/app/create-from-dsl-modal';
type TabProps = {
    currentTab: CreateFromDSLModalTab;
    setCurrentTab: (tab: CreateFromDSLModalTab) => void;
};
declare const Tab: ({ currentTab, setCurrentTab, }: TabProps) => any;
export default Tab;
