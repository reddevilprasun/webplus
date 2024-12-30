import {
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes
} from '@/routes'

import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
  isAuthenticatedNextjs
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(publicRoutes);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

export default convexAuthNextjsMiddleware(async(request, {convexAuth}) => {
  if(isPublicRoute(request) && await isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request,"/dashboard");
  }
  if(isProtectedRoute(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request,"/sign-up");
  }
})



export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};