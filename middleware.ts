import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // if user is not signed in and the current path is not / redirect the user to /sign-in
    if (!user && ['/sign-in', '/sign-up'].indexOf(req.nextUrl.pathname) === -1) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (user && ['/sign-in', '/sign-up'].indexOf(req.nextUrl.pathname) !== -1) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/', '/account', '/sign-in', '/sign-up'],
}