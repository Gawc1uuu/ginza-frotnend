import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AFFILIATE_COOKIE = 'affiliate';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const isProd = process.env.NODE_ENV === 'production';

export default clerkMiddleware((auth, req: NextRequest) => {
    const code = req.nextUrl.searchParams.get('affiliate');
    if (code) {
        const res = NextResponse.next();
        res.cookies.set({
            name: AFFILIATE_COOKIE,
            value: code,
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            path: '/',
            maxAge: MAX_AGE_SECONDS,
            // domain: '.ginzagaming.com',
        });
        return res;
    }
    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|.*\\..*).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
