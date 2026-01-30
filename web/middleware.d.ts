import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export declare function middleware(request: NextRequest): NextResponse<unknown>;
export declare const config: {
    matcher: {
        source: string;
    }[];
};
