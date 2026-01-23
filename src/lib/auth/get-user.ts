import { auth } from "@clerk/nextjs/server";
import { User } from "@/types/user";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

/**
 * Get the current authenticated user from the database
 * This should be used in server components and API routes
 * 
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return null;
        }

        // Call backend to get user data
        const response = await fetch(`${BASE_API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${clerkId}`, // Backend will use Clerk to verify
            },
            cache: "no-store", // Always fetch fresh user data
        });

        if (!response.ok) {
            console.error("Failed to fetch current user:", response.statusText);
            return null;
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
}

/**
 * Require authenticated user - throws if not authenticated
 * Use this in server components/actions that require authentication
 */
export async function requireUser(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Authentication required");
    }

    return user;
}

/**
 * Get user by Clerk ID
 * Useful for admin operations
 */
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
    try {
        const response = await fetch(`${BASE_API_URL}/users/clerk/${clerkId}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user by Clerk ID:", error);
        return null;
    }
}
