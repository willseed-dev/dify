import type { ZodSchema } from 'zod';
import type { BaseConfiguration } from '@/app/components/base/form/form-scenarios/base/types';
type OptionsProps = {
    initialData: Record<string, any>;
    configurations: BaseConfiguration[];
    schema: ZodSchema;
    onSubmit: (data: Record<string, any>) => void;
    onPreview: () => void;
    ref: React.RefObject<any>;
    isRunning: boolean;
};
declare const Form: ({ initialData, configurations, schema, onSubmit, onPreview, ref, isRunning, }: OptionsProps) => any;
export default Form;
