// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, request) => {
  // Skip protection for public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect everything else
  auth().then(
    () => NextResponse.next(),
    () => NextResponse.redirect(new URL("/sign-in", request.url))
  );
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
