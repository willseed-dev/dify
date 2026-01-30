import type { ZodSchema } from 'zod';
import * as React from 'react';
declare function withValidation<T extends Record<string, unknown>, K extends keyof T>(WrappedComponent: React.ComponentType<T>, schema: ZodSchema<Pick<T, K>>): (props: T) => any;
export default withValidation;
