import { z } from 'zod';
export declare const ContactMethods: any;
export declare const UserSchema: any;
export type User = z.infer<typeof UserSchema>;
