import type { FC } from 'react';
import type { CodeBasedExtensionForm } from '@/models/common';
import type { ModerationConfig } from '@/models/debug';
type FormGenerationProps = {
    forms: CodeBasedExtensionForm[];
    value: ModerationConfig['config'];
    onChange: (v: Record<string, string>) => void;
};
declare const FormGeneration: FC<FormGenerationProps>;
export default FormGeneration;
