import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
type Params = {
    owner: string;
    repo: string;
};
export declare function GET(request: NextRequest, { params }: {
    params: Promise<Params>;
}): Promise<NextResponse<any>>;
export {};
