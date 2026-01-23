import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/user/me
 * Returns the current authenticated user's database record
 */
export async function GET() {
    try {
        const { userId: clerkId, getToken } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get JWT token to authenticate with backend
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                { error: "Failed to get auth token" },
                { status: 401 }
            );
        }

        // Call backend API
        const backendUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/me`;
        const response = await fetch(backendUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend /users/me failed:", errorText);
            return NextResponse.json(
                { error: "Failed to fetch user data" },
                { status: response.status }
            );
        }

        const user = await response.json();
        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Error in /api/user/me:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
