import type { Locale } from '@/i18n-config';
export type IDevelopProps = {
    params: Promise<{
        locale: Locale;
        appId: string;
    }>;
};
declare const Develop: (props: IDevelopProps) => Promise<any>;
export default Develop;
