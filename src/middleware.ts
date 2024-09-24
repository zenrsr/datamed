import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, request) => {
  const { userId } = auth();

  // Redirect to sign-in if trying to access a protected route without being authenticated
  if (isProtectedRoute(request) && !userId) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", "/dashboard");
    return NextResponse.redirect(signInUrl);
  }

  // No need to force a redirect after sign-in/sign-up, let Clerk handle it
  if (isPublicRoute(request) || userId) {
    return NextResponse.next();
  }

  // Protect all other routes if the user is not authenticated
  auth().protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
