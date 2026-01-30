import type { ZodSchema } from 'zod';
import type { CustomActionsProps } from '@/app/components/base/form/components/form/actions';
import type { BaseConfiguration } from '@/app/components/base/form/form-scenarios/base/types';
type OptionsProps = {
    initialData: Record<string, any>;
    configurations: BaseConfiguration[];
    schema: ZodSchema;
    CustomActions: (props: CustomActionsProps) => React.JSX.Element;
    onSubmit: (data: Record<string, any>) => void;
};
declare const Options: ({ initialData, configurations, schema, CustomActions, onSubmit, }: OptionsProps) => any;
export default Options;
