import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is / redirect the user to /account
  // if (user && (user.iat + 3600 > Date.now()/1000) && req.nextUrl.pathname === '/account') {
  //   return (console.log("redirect"), NextResponse.redirect(new URL('/aut/signout', req.url)))
  // }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname === '/account') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/account'],
}