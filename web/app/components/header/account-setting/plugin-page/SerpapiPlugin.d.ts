import type { PluginProvider } from '@/models/common';
type SerpapiPluginProps = {
    plugin: PluginProvider;
    onUpdate: () => void;
};
declare const SerpapiPlugin: ({ plugin, onUpdate, }: SerpapiPluginProps) => any;
export default SerpapiPlugin;
