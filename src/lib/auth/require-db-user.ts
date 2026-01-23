import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to ensure user exists in database
 * Use this for routes that require both Clerk auth AND database user
 * 
 * This should be used in API routes that need user data
 */
export async function requireDbUser(request: NextRequest) {
    const { userId: clerkId, getToken } = await auth();

    if (!clerkId) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    try {
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                { error: "Failed to get auth token" },
                { status: 401 }
            );
        }

        // Check if user exists in database
        const backendUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/me`;
        const response = await fetch(backendUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            // User doesn't exist in DB yet (webhook might be processing)
            if (response.status === 404) {
                return NextResponse.json(
                    {
                        error: "User account is being set up. Please try again in a moment.",
                        code: "USER_NOT_FOUND"
                    },
                    { status: 503 } // Service unavailable - client should retry
                );
            }

            return NextResponse.json(
                { error: "Failed to verify user" },
                { status: response.status }
            );
        }

        const user = await response.json();

        // Attach user to request for downstream handlers
        // Note: This is a workaround since we can't modify request in middleware
        return { user, clerkId, token };
    } catch (error: any) {
        console.error("Error in requireDbUser:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
