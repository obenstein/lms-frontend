import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'

const isTeacherPage = createRouteMatcher(['/teacher(.*)']);
const isTeacherApi = createRouteMatcher(['/api/teacher(.*)']);

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/uploadthing',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users hitting the root to /sign-in
  if (!userId && pathname === '/') {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = '/sign-in';
    return NextResponse.redirect(signInUrl);
  }

  // Protect all non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Teacher area: only the teacher. Route handlers and the teacher layout
  // check again (lib/auth-guards.ts); this is the first line of defence.
  if (!isTeacher(userId)) {
    if (isTeacherApi(req)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    if (isTeacherPage(req)) {
      const homeUrl = req.nextUrl.clone();
      homeUrl.pathname = '/';
      homeUrl.search = '';
      return NextResponse.redirect(homeUrl);
    }
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}