import type { RemixiconComponentType } from '@remixicon/react';
import { z } from 'zod';
export declare const InputTypeEnum: any;
export type InputType = z.infer<typeof InputTypeEnum>;
export type FileTypeSelectOption = {
    value: InputType;
    label: string;
    Icon: RemixiconComponentType;
    type: string;
};
